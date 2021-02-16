const express= require ('express');
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

// Global variables
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,application/json");
  app.locals.user=req.user;
  // req.session.cookie.maxAge= 30 * 60 * 1000;
  next();
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));

app.use('/empresas',require('./routes/mantenimientos/empresas.js'));
app.use('/productos',require('./routes/mantenimientos/productos'));
app.use('/cencos',require('./routes/mantenimientos/cencos.js'));
app.use('/punto_venta',require('./routes/mantenimientos/punto_venta.js'));
app.use('/unidad_negocios',require('./routes/mantenimientos/unidad_negocios.js'));
app.use('/motivo_traslado',require('./routes/mantenimientos/motivo_traslado.js'));
app.use('/transportista',require('./routes/mantenimientos/transportista.js'));
app.use('/vehiculo',require('./routes/mantenimientos/vehiculo.js'));
app.use('/orden_trabajo',require('./routes/mantenimientos/orden_trabajo.js'));
app.use('/presupuesto',require('./routes/mantenimientos/presupuesto.js'));
app.use('/almacen',require('./routes/mantenimientos/almacen.js'));
app.use('/clientes',require('./routes/mantenimientos/clientes.js'));
app.use('/unidades',require('./routes/mantenimientos/unidades.js'));
app.use('/talonarios',require('./routes/mantenimientos/talonarios.js'));
app.use('/forma_pago',require('./routes/mantenimientos/forma_pago.js'));
app.use('/lista_precios',require('./routes/mantenimientos/lista_precios.js'));
app.use('/tipo_cambio',require('./routes/mantenimientos/tipo_cambio.js'));
app.use('/vendedor',require('./routes/mantenimientos/vendedor.js'));
app.use('/gestor_cobranza',require('./routes/mantenimientos/gestor_cobranza.js'));
app.use('/configurar_tablas',require('./routes/mantenimientos/configurar_tablas.js'));
app.use('/usuario',require('./routes/mantenimientos/usuario.js'));
app.use('/tipo_documento',require('./routes/mantenimientos/tipo_documento.js'))
app.use('/chofer',require('./routes/mantenimientos/chofer.js'));
app.use('/agencia_transporte',require('./routes/mantenimientos/agencia_transporte.js'));
app.use('/detracciones',require('./routes/mantenimientos/detraccciones.js'));
app.use('/proveedores',require('./routes/mantenimientos/proveedores.js'));
app.use('/incoterm',require('./routes/mantenimientos/incoterm.js'));
app.use('/definicion_transacciones',require('./routes/mantenimientos/definicion_transacciones.js'));
app.use('/zona',require('./routes/mantenimientos/zona.js'));
app.use('/tipo_productos',require('./routes/mantenimientos/tipo_productos.js'));
app.use('/empleados',require('./routes/mantenimientos/empleados.js'));
app.use('/paises',require('./routes/mantenimientos/paises.js'));
app.use('/tipo_documento_identidad',require('./routes/mantenimientos/tipo_documento_identidad.js'));
app.use('/plan_contable',require('./routes/mantenimientos/plan_contable.js'))
app.use('/subvoucher',require('./routes/mantenimientos/subvoucher.js'));
app.use('/anexos',require('./routes/mantenimientos/anexos.js'));
app.use('/tipo_auxiliar',require('./routes/mantenimientos/tipo_auxiliar.js'));
app.use('/clasificacion_bien_servicios',require('./routes/mantenimientos/clasificacion_bien_servicios.js'));
app.use('/periodo_contable',require('./routes/mantenimientos/periodo_contable.js'));
app.use('/retencion_no_domiciliado',require('./routes/mantenimientos/retencion_no_domiciliados.js'));
app.use('/cuentas_corrientes',require('./routes/mantenimientos/cuentas_corrientes.js'));

// Public
app.use(express.static(path.join(__dirname, 'public')));


// Starting
app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));
});

module.exports.app;