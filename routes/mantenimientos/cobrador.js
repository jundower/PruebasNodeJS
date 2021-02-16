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
          "Select  \n"+
          "Erp_Cobrador.erp_codcob as Codigo, \n"+
          "Erp_Cobrador.erp_nomcob as Nombre, \n"+
          "Erp_Cobrador.erp_email as Email, \n"+
          "Erp_Cobrador.erp_telefono as Telefono1, \n"+
          "Erp_Cobrador.erp_telefono2 as Telefono2 \n"+
          "From Erp_Cobrador \n"+
          "where \n"+
          "Erp_Cobrador.erp_codemp = @codigo_empresa \n"
        );
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

router.post('/lista/:codigo', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const {codigo} = req.params;
        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo', mssql.VarChar(250), codigo)
        .query(
            "Select  \n"+
            "Erp_Cobrador.erp_codcob as Codigo, \n"+
            "Erp_Cobrador.erp_nomcob as Nombre, \n"+
            "Erp_Cobrador.erp_email as Email, \n"+
            "Erp_Cobrador.erp_telefono as Telefono, \n"+
            "Erp_Cobrador.erp_telefono2 as Telefono2, \n"+
            "hcaja.ccod_caja as Codigo_Caja, \n"+
            "hcaja.cnom_caja as Nombre_Caja \n"+
            "From Erp_Cobrador \n"+
            "left join hcaja on \n"+
            "hcaja.ccod_empresa = Erp_Cobrador.erp_codemp \n"+
            "and hcaja.ccod_caja = Erp_Cobrador.ccod_caja \n"+
            "where \n"+
            "Erp_Cobrador.erp_codemp = @codigo_empresa \n"+
            "and Erp_Cobrador.erp_codcob = case @codigo when 'todos' then Erp_Cobrador.erp_codcob else @codigo end \n"
          );
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

          //#region Guardar Cobrador
          const datos_cobrador  = new mssql.Request(transaction);
          await datos_cobrador
          .input('erp_codemp', mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codcob', mssql.VarChar(250),req.body.Codigo)
          .input('erp_nomcob', mssql.VarChar(250),req.body.Nombre)
          .input('erp_telefono', mssql.VarChar(250),req.body.Telefono1)
          .input('erp_telefono2', mssql.VarChar(250),req.body.Telefono2)
          .input('erp_email', mssql.VarChar(250),req.body.Correo)
          .input('ccod_caja', mssql.VarChar(250),'')
          .input('erp_password', mssql.VarChar(250),req.body.Password)
          .input('usuario', mssql.VarChar(250),req.body.Usuario)
          .input('predeterminado', mssql.VarChar(250),req.body.Predeterminado)
          .query(
           " INSERT INTO Erp_Cobrador( \n"+
           " erp_codemp, \n"+
           " erp_codcob, \n"+
           " erp_nomcob, \n"+
           " erp_email, \n"+
           " erp_telefono, \n"+
           " erp_telefono2, \n"+
           " erp_password, \n"+
           " ccod_caja, \n"+
           " predeterminado, \n"+
           " usuario )VALUES(\n"+
           " @erp_codemp, \n"+
           " @erp_codcob, \n"+
           " @erp_nomcob, \n"+
           " @erp_email, \n"+
           " @erp_telefono, \n"+
           " @erp_telefono2, \n"+
           " @erp_password, \n"+
           " @ccod_caja, \n"+
           " @predeterminado, \n"+
           " @usuario )\n"
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

          //#region Modificar Cobrador
          const datos_modificar_cobrador  = new mssql.Request(transaction);
          await datos_modificar_cobrador
          .input('erp_codemp', mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codcob', mssql.VarChar(250),req.body.Codigo)
          .input('erp_nomcob', mssql.VarChar(250),req.body.Nombre)
          .input('erp_telefono', mssql.VarChar(250),req.body.Telefono1)
          .input('erp_telefono2', mssql.VarChar(250),req.body.Telefono2)
          .input('erp_email', mssql.VarChar(250),req.body.Correo)
          .input('ccod_caja', mssql.VarChar(250),'')
          .input('erp_password', mssql.VarChar(250),req.body.Password)
          .input('usuario', mssql.VarChar(250),req.body.Usuario)
          .input('predeterminado', mssql.VarChar(250),req.body.Predeterminado)
          .query(
           " update Erp_Cobrador set \n"+
           " erp_nomcob = @erp_nomcob, \n"+
           " erp_email = @erp_email, \n"+
           " erp_telefono = @erp_telefono, \n"+
           " erp_telefono2 = @erp_telefono2, \n"+
           " erp_password = @erp_password, \n"+
           " ccod_caja = @ccod_caja, \n"+
           " predeterminado = @predeterminado, \n"+
           " usuario = @usuario where erp_codemp = @erp_codemp and erp_codcob = @erp_codcob \n"
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

          //#region Eliminar Cobrador
          const datos_eliminar_cobrador  = new mssql.Request(transaction);
          await datos_eliminar_cobrador
          .input('erp_codemp', mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codcob', mssql.VarChar(250),req.body.Codigo)
          .query(
           " delete from Erp_Cobrador where erp_codemp = @erp_codemp and erp_codcob = @erp_codcob \n"
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