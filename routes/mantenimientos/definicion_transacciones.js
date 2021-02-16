const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');

router.post('/tipo_transaccion', async (req, res) => {
  
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('tipo_movimiento', mssql.VarChar(250), req.body.tipo_movimiento)
    .query("SELECT  \n"+
    "ctip_movimiento as Tipo, \n"+
    "LTRIM(RTRIM(ccod_movimiento)) as Codigo, \n"+
    "ccod_movimiento +'-'+cnom_movimiento as Nombre, \n"+
    "csi_proveedor as Proveedor, \n"+
    "csi_cliente as Cliente, \n"+
    "blguia_remision as Guia_Remision, \n"+
    "impresion_guia as Impresion_Gia, \n"+
    "Erp_Anexo_SN as Anexo_SN, \n"+
    "Erp_Tipo_Anexo as Tipo_Anexo \n"+
    "FROM HTRANSAL  \n"+
    "WHERE ccod_empresa = @codigo_empresa And \n"+
    "ctip_movimiento = @tipo_movimiento order by ccod_movimiento asc" );
    const recordset = lista.recordset;
    res.json(recordset);
  });

  router.post('/transaccion', async (req, res) => {

    
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('tipo_movimiento', mssql.VarChar(250), req.body.tipo_movimiento)
    .input('transaccion', mssql.VarChar(250), req.body.transaccion)
    .query("SELECT  \n"+
    "ctip_movimiento as Tipo, \n"+
    "LTRIM(RTRIM(ccod_movimiento)) as Codigo, \n"+
    "ccod_movimiento +'-'+cnom_movimiento as Nombre, \n"+
    "csi_proveedor as Proveedor, \n"+
    "csi_cliente as Cliente, \n"+
    "blguia_remision as Guia_Remision, \n"+
    "impresion_guia as Impresion_Gia, \n"+
    "Erp_Anexo_SN as Anexo_SN, \n"+
    "Erp_Tipo_Anexo as Tipo_Anexo, \n"+
    "LTRIM(RTRIM(erp_tipo_documento)) as Tipo_Documento_Pendientes \n"+
    "FROM HTRANSAL  \n"+
    "WHERE ccod_empresa = @codigo_empresa And \n"+
    "ccod_movimiento = @transaccion and \n"+
    "ctip_movimiento = @tipo_movimiento " );
    const recordset = lista.recordset;
    res.json(recordset);
  });

module.exports = router;