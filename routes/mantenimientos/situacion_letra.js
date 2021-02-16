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
       " select \n"+
       " ccod_situac_letra as Codigo, \n"+
       " cnom_situac_letra as Nombre, \n"+
       " contabilidad as Contabilidad, \n"+
       " ccuenta as Cuenta_Cliente, \n"+
       " ccuenta_prov as Cuenta_Proveedor, \n"+
       " ctas_orden as Cuenta_Orden, \n"+
       " cta_orden_debe as Cuenta_Orden_Debe, \n"+
       " cta_orden_haber as Cuenta_Orden_Haber, \n"+
       " erp_cod_auxiliar as Codigo_Auxiliar, \n"+
       " erp_cod_anexo as Codigo_Anexo, \n"+
       " Hsit_let_fechmodificacion as Fecha_Modificacion, \n"+
       " NombreEquipo as Nombre_Equipo, \n"+
       " HoraPc as Hora_Pc, \n"+
       " Ip_Cliente as Ip_Cliente, \n"+
       " ErpUsuario as Erp_Usuario \n"+
       " from hsit_let where ccod_empresa = @codigo_empresa \n"
        );
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

router.post('/situacion', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_situacion', mssql.VarChar(10), req.body.codigo_situacion)
        .query(
          " SELECT  \n"+
          " LTRIM(RTRIM(ccod_situac_letra)) as Codigo, \n"+
          " cnom_situac_letra as Nombre, \n"+
          " LTRIM(RTRIM(contabilidad)) as Contabilidad,  \n"+
          " LTRIM(RTRIM(ccuenta)) as Cuenta_Cliente, \n"+
          " LTRIM(RTRIM(ccuenta_prov)) as Cuenta_Proveedor, \n"+
          " LTRIM(RTRIM(ctas_orden)) as Cuenta_Orden, \n"+
          " LTRIM(RTRIM(cta_orden_debe)) as Cuenta_Orden_Debe, \n"+
          " LTRIM(RTRIM(cta_orden_haber)) as Cuenta_Orden_Haber \n"+
          " FROM hsit_let  \n"+
          " WHERE ccod_empresa = @codigo_empresa AND ccod_situac_letra = @codigo_situacion \n"
          );
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
      res.send(err.message)
    }
  });

module.exports = router;