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

app.get('/', function(req,res){
    res.send("Cuarta Prueba")
})

app.listen(process.env.PORT || 5000);
module.exports.app;