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
        "LTRIM(RTRIM(codigo)) as Codigo, \n"+
        "nombre as Nombre, \n"+
        "fechMod as Fecha_Modificacion, \n"+
        "NombreEquipo as PC, \n"+
        "IpCliente as IP, \n"+
        "erpusuario as Usuario \n"+
        "from Hsituacion_cliente where  \n"+
        "ccod_empresa=@codigo_empresa \n"
        );
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

module.exports = router;