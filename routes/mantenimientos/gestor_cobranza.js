const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');
  
router.post('/lista', async (req, res) => {
  try {
      const codigo_empresa = req.user.codigo_empresa;
      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('id', mssql.VarChar(10), codigo_empresa)
      .query("Select \n"+
      "erp_codgestor as Codigo,\n"+
      "erp_nomgestor as Nombre,\n"+
      "erp_email as Email,\n"+
      "erp_celular as Celular, \n"+
      "erp_telefono1 as Telefono1, \n"+
      "erp_telefono2 as Telefono2, \n"+
      "erp_cargo as Cargo,\n"+
      "predeterminado as Predeterminado\n"+
      "From erp_gestor_cobranza\n"+
      "Where erp_codemp= @id order by erp_codgestor");
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

router.post('/guardar', async (req, res) => {
  try {

    const usuario = req.user.codigo_usuario;

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{

          //#region Guardar Gestor Cobranza
          const datos_gestor_cobranza  = new mssql.Request(transaction);
          await datos_gestor_cobranza
          .input('erp_codemp', mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codgestor', mssql.VarChar(250),req.body.Codigo)
          .input('erp_nomgestor', mssql.VarChar(250),req.body.Nombre)
          .input('erp_telefono1', mssql.VarChar(250),req.body.Telefono1)
          .input('erp_telefono2', mssql.VarChar(250),req.body.Telefono2)
          .input('erp_email', mssql.VarChar(250),req.body.Correo)
          .input('erp_celular', mssql.VarChar(250),req.body.Celular)
          .input('erp_cargo', mssql.VarChar(250),req.body.Cargo)
          .input('predeterminado', mssql.VarChar(250),req.body.Predeterminado)
          .query(
           " INSERT INTO erp_gestor_cobranza( \n"+
           " erp_codemp, \n"+
           " erp_codgestor, \n"+
           " erp_nomgestor, \n"+
           " erp_email, \n"+
           " erp_celular, \n"+
           " erp_telefono1, \n"+
           " erp_telefono2, \n"+
           " erp_cargo, \n"+
           " predeterminado )VALUES(\n"+
           " @erp_codemp, \n"+
           " @erp_codgestor, \n"+
           " @erp_nomgestor, \n"+
           " @erp_email, \n"+
           " @erp_celular, \n"+
           " @erp_telefono1, \n"+
           " @erp_telefono2, \n"+
           " @erp_cargo, \n"+
           " @predeterminado )\n"
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

    const usuario = req.user.codigo_usuario;

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{

          //#region Modificar Gestor Cobranza
          const datos_gestor_cobranza  = new mssql.Request(transaction);
          await datos_gestor_cobranza
          .input('erp_codemp', mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codgestor', mssql.VarChar(250),req.body.Codigo)
          .input('erp_nomgestor', mssql.VarChar(250),req.body.Nombre)
          .input('erp_telefono1', mssql.VarChar(250),req.body.Telefono1)
          .input('erp_telefono2', mssql.VarChar(250),req.body.Telefono2)
          .input('erp_email', mssql.VarChar(250),req.body.Correo)
          .input('erp_celular', mssql.VarChar(250),req.body.Celular)
          .input('erp_cargo', mssql.VarChar(250),req.body.Cargo)
          .input('predeterminado', mssql.VarChar(250),req.body.Predeterminado)
          .query(
           " update erp_gestor_cobranza set\n"+
           " erp_nomgestor = @erp_nomgestor, \n"+
           " erp_email = @erp_email, \n"+
           " erp_celular = @erp_celular, \n"+
           " erp_telefono1 = @erp_telefono1, \n"+
           " erp_telefono2 = @erp_telefono2, \n"+
           " erp_cargo = @erp_cargo, \n"+
           " predeterminado = @predeterminado  where erp_codemp = @erp_codemp and erp_codgestor = @erp_codgestor \n"
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

    const usuario = req.user.codigo_usuario;

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{

          //#region Eliminar Gestor Cobranza
          const datos_gestor_cobranza  = new mssql.Request(transaction);
          await datos_gestor_cobranza
          .input('erp_codemp', mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codgestor', mssql.VarChar(250),req.body.Codigo)
          .query(
           " delete from erp_gestor_cobranza where erp_codemp = @erp_codemp and erp_codgestor = @erp_codgestor \n"
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

module.exports = router;