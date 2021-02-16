const express = require ('express');
const morgan= require ('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const passport = require ('passport');
var favicon = require('serve-favicon');
const {options,database} = require('./keys');
var TediousStore = require('connect-tedious')(session);

// Intializations
const app = express();
require('./lib/passport');


// Settings
app.set('port', process.env.PORT || 3000);
app.set('trust proxy', true) //Agregado para leer la ip del cliente
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

// app.get('/', function(req,res){
//     res.send("Sexta Prueba")
// })

// Middlewares
app.use(session({
    secret: 'ERP',
    resave: false,
    saveUninitialized: false, 
    store: new TediousStore(options),
    // cookie: { maxAge: 10000, expires : new Date(Date.now() + 10000)}
    // cookie: { maxAge: 3600000}
  }));
  app.use(morgan('dev'));
  app.use(express.urlencoded({limit: '50mb',extended:false}));
  app.use(express.json({limit: '50mb',extended: true,}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(favicon(path.join(__dirname, 'public', 'img', 'erpsoft.ico')))

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
  

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting
app.listen(app.get('port'), () => {
    console.log('Server is in port', app.get('port'));
  });

  
// app.listen(process.env.PORT || 5000);
module.exports.app;