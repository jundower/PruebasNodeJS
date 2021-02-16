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
        " Select LTRIM(RTRIM(Hunimed.cunidad)) as Codigo, Hunimed.cunidad as Nombre \n" +
        " From Hunimed  \n" +
        " where erp_codemp = @Codigo_Empresa \n" 
      );   
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

router.post('/unidad_productos', async (req, res) => {
    try {
      const codigo_empresa = req.user.codigo_empresa
      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .input('codigo_articulo', mssql.VarChar(250), req.body.codigo_articulo)
      .input('lista_precios', mssql.VarChar(250), req.body.lista_precios)
      .query("select * from (\n" +
      "SELECT \n" +
      "(Harticul.ccod_empresa) as codigo_empresa,\n" +
      "(Harticul.ccod_articulo) as codigo_articulo,\n" +
      "erp_lista_precio_cliente.erp_codigo_concepto as codigo_concepto,\n" +
      "erp_lista_precio_cliente.erp_tipo as tipo,\n" +
      "(erp_lista_precio_cliente.erp_unidad) as Unidad, \n" +
      "(erp_articulo_unidad.erp_factor) as Factor,\n" +
      "harticul.cmoneda_precio as moneda,\n" +
      "erp_lista_precio_cliente.erp_monto as Unit, \n" +
      "(erp_lista_precio_cliente.erp_desc1) as Descuento1, \n" +
      "(erp_lista_precio_cliente.erp_desc2) as Descuento2,\n" +
      "(erp_articulo_unidad.erp_iteart) as item\n" +
      "FROM erp_lista_precio_cliente Inner Join Harticul On\n" +
      "erp_lista_precio_cliente.erp_codemp = Harticul.ccod_empresa And\n" +
      "erp_lista_precio_cliente.erp_codart = Harticul.ccod_articulo\n" +
      "inner join erp_articulo_unidad on\n" +
      "erp_lista_precio_cliente.erp_codemp=erp_articulo_unidad.erp_codemp and \n" +
      "erp_lista_precio_cliente.erp_codart=erp_articulo_unidad.erp_codart and \n" +
      "erp_lista_precio_cliente.erp_unidad= erp_articulo_unidad.erp_codund\n" +
      "UNION\n" +
      "SELECT \n" +
      "(Harticul.ccod_empresa) as codigo_empresa,\n" +
      "(Harticul.ccod_articulo) as codigo_articulo,\n" +
      "erp_lista_precio_cliente.erp_codigo_concepto as codigo_concepto,\n" +
      "erp_lista_precio_cliente.erp_tipo as tipo,\n" +
      "(Harticul.cunidad) as Unidad, \n" +
      "(harticul.cant_cont) as Factor,\n" +
      "harticul.cmoneda_precio as moneda,\n" +
      "erp_lista_precio_cliente.erp_monto as Unit, \n" +
      "(erp_lista_precio_cliente.erp_desc1) as Descuento1, \n" +
      "(erp_lista_precio_cliente.erp_desc1) as Descuento2,\n" +
      "(0) as item\n" +
      "FROM erp_lista_precio_cliente Inner Join Harticul On\n" +
      "erp_lista_precio_cliente.erp_codemp = Harticul.ccod_empresa And\n" +
      "erp_lista_precio_cliente.erp_codart = Harticul.ccod_articulo and \n" +
      "erp_lista_precio_cliente.erp_unidad = Harticul.cunidad \n" +
      ") as tabla\n" +
      "WHERE \n" +
      "codigo_empresa = @codigo_empresa AND\n" +
      "codigo_articulo = @codigo_articulo and \n" +
      "codigo_concepto = @lista_precios and \n" +
      "tipo ='12'\n" +
      "ORDER BY item");
        
      const recordset = lista.recordset;
      res.json(recordset); 
    } catch (err) {
      
      res.send(err.message)
    }
});

module.exports = router;