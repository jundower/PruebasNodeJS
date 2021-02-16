const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../database');
const {isNotLoggedin,isLoggedin} = require('../lib/auth');

router.get('/main', isLoggedin, async (req, res) => {
  try {
    // res.redirect('/ventas/cotizacion');
    console.log(req.user);
    if(req.user.proceso_compra=="S"){
      res.redirect('/compras/requerimientos');
    }
    else if(req.user.proceso_pto_venta=="S"){
      res.redirect('/punto_venta/toma_pedidos');
    }
    else{
      res.redirect('/compras/requerimientos');

    }
  } catch (err) {
    res.send(err.message)
  }
});

router.get('/', async (req, res) => {
  res.render('home/home',{layout: false});
});

router.get('/home', async (req, res) => {
  res.render('home/home',{layout: false});
});

router.get('/home/productos', async (req, res) => {
  res.render('home/productos',{layout: false});
});

router.get('/home/enviodemensaje', async (req, res) => {
  res.render('home/enviodemensaje',{layout: false});
});

router.post('/home/enviarmensaje', async (req, res) => {
  res.send("Enviado");
});

router.post('/home/ingresar_erp',async (req,res)=>{
  try{
    const pool = await poolPromise
    const result_empresas = await pool.request().input('codigo',mssql.VarChar(50),req.body.codigo).query('select ruc_empresa_contratante as codigo from hempresa_contratante_detalle where ruc_empresa_contratante = @codigo group by codigo_empresa_contratante,ruc_empresa_contratante ');
    const empresas = result_empresas.recordset;
    // res.render('auth/ingresar',{empresas});
    if(empresas.length<=0){
      res.send("0");
    }else{
      res.send('/'+empresas[0].codigo);
      // res.render('auth/ingresar',{empresas});
    }
  } catch (err) {
    res.send(err.message)
  }
});

router.get('/configurar_tablas', isLoggedin, async (req, res) => {
  try {
    res.render('mantenimientos/configurar_tablas');
  } catch (err) {
    res.send(err.message)
    // res.render('auth/error');
  }
});

router.get('/configurar_tablas/:tipo', isLoggedin, async (req, res) => {
  try {
    const { tipo } = req.params;
    res.render('mantenimientos/configurar_tablas',{tipo : tipo});
  } catch (err) {
    res.send(err.message)
    // res.render('auth/error');
  }
});

module.exports = router;