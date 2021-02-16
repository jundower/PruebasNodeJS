const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');

router.post('/lista', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;

    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .query(
        " SELECT \n"+
        " ccod_tipaux as Codigo , \n"+
        " ccod_tipaux + ' - ' + cnom_tipaux as Nombre \n"+
        " FROM HTIPAUX \n"+
        " WHERE ccod_empresa = @codigo_empresa \n"+
        " ORDER BY ccod_tipaux"
      );

    const recordset = lista.recordset;
    res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

router.post('/guardar', async (req, res) => {
  try {
    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);

    await transaction.begin(async err => {
        try{

          //#region Guardar
          const datos_tipo_auxiliar  = new mssql.Request(transaction);
          await datos_tipo_auxiliar
          .input('ccod_empresa', mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_tipaux', mssql.VarChar(250),req.body.Codigo)
          .input('cnom_tipaux', mssql.VarChar(250),req.body.Nombre)
          .query(
          " insert into HTIPAUX ( \n"+
          " ccod_empresa, \n"+
          " ccod_tipaux, \n"+
          " cnom_tipaux \n"+
          " )values( \n"+
          " @ccod_empresa, \n"+
          " @ccod_tipaux, \n"+
          " @cnom_tipaux) \n"
          );
          //#endregion

          transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: true, codigo: "0", mensaje: ''});
        }catch(err){
          transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: false, codigo: "Err", mensaje: err.message});
        }
    });    
  } catch (err) {
    console.log(err.message);
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

router.post('/modificar', async (req, res) => {
  try {
    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);

    await transaction.begin(async err => {
        try{

          //#region Guardar
          const datos_tipo_auxiliar  = new mssql.Request(transaction);
          await datos_tipo_auxiliar
          .input('ccod_empresa', mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_tipaux', mssql.VarChar(250),req.body.Codigo)
          .input('cnom_tipaux', mssql.VarChar(250),req.body.Nombre)
          .query(
          " update HTIPAUX set \n"+
          " cnom_tipaux = @cnom_tipaux \n"+
          " where ccod_empresa = @ccod_empresa and ccod_tipaux = @ccod_tipaux \n"
          );
          //#endregion

          transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: true, codigo: "0", mensaje: ''});
        }catch(err){
          transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: false, codigo: "Err", mensaje: err.message});
        }
    });    
  } catch (err) {
    console.log(err.message);
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

router.post('/eliminar', async (req, res) => {
  try {
    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);

    await transaction.begin(async err => {
        try{

          //#region Guardar
          const datos_tipo_auxiliar  = new mssql.Request(transaction);
          await datos_tipo_auxiliar
          .input('ccod_empresa', mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_tipaux', mssql.VarChar(250),req.body.Codigo)
          .query(
          " delete from HTIPAUX  \n"+
          " where ccod_empresa = @ccod_empresa and ccod_tipaux = @ccod_tipaux \n"
          );
          //#endregion

          transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: true, codigo: "0", mensaje: ''});
        }catch(err){
          transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: false, codigo: "Err", mensaje: "El tipo de Auxiliar " + req.body.Codigo +" tiene movimientos en CtaxPagar o CtaxCobrar"});
        }
    });    
  } catch (err) {
    console.log(err.message);
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

module.exports = router;