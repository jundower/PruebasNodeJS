const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');

router.post('/lista', async (req, res) => {
    try {
        const pool = await poolPromise

        const lista = await pool
        .request()
        .input('Codigo_Empresa', mssql.VarChar(10), req.user.codigo_empresa)
        .query(
        " select  \n"+
        " LTRIM(RTRIM(codigo)) as Codigo, \n"+
        " nombre as Nombre, \n"+
        " Erp_CodSunat as Codigo_Sunat, \n"+
        " CONVERT(VARCHAR,TipoProd_fechModificacion,103) as Fecha_Modificacion, \n"+
        " NombreEquipo as PC, \n"+
        " Hora as Hora_Modificacion, \n"+
        " Ip_cliente as Ip_Cliente, \n"+
        " ErpUsuario as Usuario \n"+
        " from htipo_prod \n"+
        " where idempresa = @Codigo_Empresa \n"
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

          //#region Guardar Tipo Productos
          const datos_tipo_productos  = new mssql.Request(transaction);
          await datos_tipo_productos
          .input('idempresa', mssql.VarChar(250),req.user.codigo_empresa)
          .input('codigo', mssql.VarChar(250),req.body.Codigo)
          .input('nombre', mssql.VarChar(250),req.body.Nombre)
          .input('Erp_CodSunat', mssql.VarChar(250),req.body.Codigo_Sunat)
          .input('TipoProd_fechModificacion', mssql.VarChar(250),'')
          .input('NombreEquipo', mssql.VarChar(250),'')
          .input('Hora', mssql.VarChar(250),'')
          .input('Ip_cliente', mssql.VarChar(250),'')
          .input('ErpUsuario', mssql.VarChar(250), usuario)
          .query(
          " insert into htipo_prod( \n"+
          " idempresa, \n"+
          " codigo, \n"+
          " nombre, \n"+
          " Erp_CodSunat, \n"+
          " TipoProd_fechModificacion, \n"+
          " NombreEquipo, \n"+
          " Hora, \n"+
          " Ip_cliente, \n"+
          " ErpUsuario \n"+
          " )values( \n"+
          " @idempresa, \n"+
          " @codigo, \n"+
          " @nombre, \n"+
          " @Erp_CodSunat, \n"+
          " getdate(), \n"+
          " @NombreEquipo, \n"+
          " CONVERT(VARCHAR,getdate(),8), \n"+
          " @Ip_cliente, \n"+
          " @ErpUsuario) \n"
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

          //#region Modificar Tipo Productos
          const modificar_datos_tipo_productos  = new mssql.Request(transaction);
          await modificar_datos_tipo_productos
          .input('idempresa', mssql.VarChar(250),req.user.codigo_empresa)
          .input('codigo', mssql.VarChar(250),req.body.Codigo)
          .input('nombre', mssql.VarChar(250),req.body.Nombre)
          .input('Erp_CodSunat', mssql.VarChar(250),req.body.Codigo_Sunat)
          .input('TipoProd_fechModificacion', mssql.VarChar(250),'')
          .input('NombreEquipo', mssql.VarChar(250),'')
          .input('Hora', mssql.VarChar(250),'')
          .input('Ip_cliente', mssql.VarChar(250),'')
          .input('ErpUsuario', mssql.VarChar(250), usuario)
          .query(
          " update htipo_prod set \n"+
          " nombre = @nombre, \n"+
          " Erp_CodSunat = @Erp_CodSunat, \n"+
          " TipoProd_fechModificacion = getdate(), \n"+
          " NombreEquipo = @NombreEquipo, \n"+
          " Hora = CONVERT(VARCHAR,getdate(),8), \n"+
          " Ip_cliente = @Ip_cliente, \n"+
          " ErpUsuario = @ErpUsuario where idempresa = @idempresa and  codigo = @codigo\n"
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

          //#region Eliminar Tipo Productos
          const eliminar_datos_tipo_productos  = new mssql.Request(transaction);
          await eliminar_datos_tipo_productos
          .input('idempresa', mssql.VarChar(250),req.user.codigo_empresa)
          .input('codigo', mssql.VarChar(250),req.body.Codigo)
          .query(
          " delete from htipo_prod \n"+
          " where idempresa = @idempresa and  codigo = @codigo\n"
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