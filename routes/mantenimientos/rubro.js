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
        "select  \n"+
        "Erp_CodRubro as Codigo, \n"+
        "Erp_nomrubro as Nombre,  \n"+
        "fechMod as Fecha_Modificacion, \n"+
        "NombreEquipo as PC, \n"+
        "IpCliente as IP, \n"+
        "ErpUsuario as Usuario \n"+
        "From Erp_Rubro_Cliente where  \n"+
        "Erp_CodEmp=@codigo_empresa \n"
        );
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

module.exports = router;