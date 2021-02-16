const express = require ('express');
const morgan= require ('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const passport = require ('passport');
var favicon = require('serve-favicon');
const {options,database} = require('./keys');
var TediousStore = require('connect-tedious')(session);
const app = express();


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

app.get('/', function(req,res){
    res.send("Cuarta Prueba")
})

// Starting
app.listen(app.get('port'), () => {
    console.log('Server is in port', app.get('port'));
  });

  
// app.listen(process.env.PORT || 5000);
module.exports.app;