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
            "LTRIM(RTRIM(ccod_pais)) as Codigo_Pais, \n"+
            "LTRIM(RTRIM(ccod_departamento)) as Codigo_Departamento, \n"+
            "LTRIM(RTRIM(ccod_ciudad)) as Codigo, \n"+
            "LTRIM(RTRIM(cnom_ciudad)) as Nombre \n"+
            "from Hciudad  \n"+
            "order by  \n"+
            "cnom_ciudad \n"
        );
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

module.exports = router;