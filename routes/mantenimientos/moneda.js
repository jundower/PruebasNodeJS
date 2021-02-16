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
          " SELECT  ltrim(rtrim(htipmon.cmoneda)) Codigo, ltrim(rtrim(htipmon.cmoneda)) Nombre \n"+
          " FROM htipmon \n"+
          " WHERE ccod_empresa = @Codigo_Empresa \n"+
          " order by ccod_tipmon desc \n"
        ); 
        
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
      res.send(err.message)
    }
});
  
module.exports = router;