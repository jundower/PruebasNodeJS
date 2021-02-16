const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');

router.post('/empresas_tc', async (req, res) => {
  try{
  const codigo_empresa = req.body.codigo_empresa;
  const pool = await poolPromise;
  const lista = await pool
  .request()
  .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
  .input('fecha', mssql.VarChar(100), req.body.fecha)
  .query("select * from hcalenda where ccod_empresa = @codigo_empresa and dfecha=@fecha");

  const recordset = lista.recordset; 
  res.json(recordset);
  }catch(err){
    res.send(err.message);
  }
});
router.post('/registrar_tc', async (req, res) => {
  try{
    const codigo_empresa = req.body.codigo_empresa;
    if(req.body.venta>0 && req.body.compra>0 && req.body.venta<10 && req.body.compra<10){
      const pool = await poolPromise;
      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .input('fecha', mssql.VarChar(100), req.body.fecha)
      .input('venta', mssql.Decimal(20,4), req.body.venta)
      .input('compra', mssql.Decimal(20,4), req.body.compra)
      .query("insert into hcalenda (ccod_empresa, dfecha, ntc_venta, ntc_compra) values (@codigo_empresa,@fecha,@venta,@compra)");
      res.json({codigo: lista.rowsAffected, mensaje:"Registrado"});
    }else{
      res.json({codigo: 0, mensaje:"TC Venta o Compra no válidos."});
    }
  }catch(err){
    res.json({codigo: err.number, mensaje:err.message});
  }
});

router.post('/tipo_cambio', async (req, res) => {
  try{
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('fecha', mssql.VarChar(100), req.body.fecha)
    .query("select * from hcalenda where ccod_empresa = @codigo_empresa and dfecha=@fecha");
  
    const recordset = lista.recordset; 
    res.json(recordset);
  }catch(err){
    res.send(err.message);
  }
});
  
  
router.post('/tasa_cambio', async (req, res) => {
  try{
    const codigo_empresa = req.user.codigo_empresa;
    var tipo_cambio=req.body.tipo_cambio;
    
    var pool = await poolPromise;
    var lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .query("select moneda_trabajo, mas_igv, ctipo_cambio from Hconfiguraciones_2 where idempresa=@codigo_empresa ");

    var recordset = lista.recordset; 

    if(tipo_cambio=="" && recordset.length > 0 ){
      tipo_cambio=recordset[0].ctipo_cambio;
    }
    lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('fecha', mssql.VarChar(100), req.body.fecha)
    .input('tipo_cambio', mssql.VarChar(100), tipo_cambio)
    .query("select\n"+
    "case \n"+
    "\twhen @tipo_cambio= 'VTA' then ntc_venta \n"+
    "\twhen @tipo_cambio= 'COM' then ntc_compra \n"+
    "\twhen @tipo_cambio= 'ESP' then ntc_especial \n"+
    "end\n"+
    "as tasa_cambio\n"+
    "from hcalenda where\n"+
    "ccod_empresa = @codigo_empresa \n"+
    "and dfecha=@fecha");

    recordset = lista.recordset; 
    if(recordset.length>0){
      res.json(recordset[0].tasa_cambio);
    }else{
      res.send("No hay TC para la fecha");
    }
  }catch(err){
    res.send(err.message);
  }
  
});

module.exports = router;