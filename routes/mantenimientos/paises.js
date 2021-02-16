const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');


router.get('/paises/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const pool = await poolPromise
  
          const lista = await pool
          .request()
          .input('id', mssql.VarChar(10), id)
          .query('select * from Hpais where ccod_empresa = @id');
            
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
      res.send(err.message)
    }
  });
  
router.post('/lista', async (req, res) => {
  try {
      const codigo_empresa = req.user.codigo_empresa;
      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .query("Select LTRIM(RTRIM(ccod_pais)) as Codigo,  cnom_pais as Nombre  From Hpais where ccod_empresa = @codigo_empresa  Order By cnom_pais");
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

module.exports = router;