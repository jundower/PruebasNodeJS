const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');


router.get('/tipo_documento_identidad/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const pool = await poolPromise
  
          const lista = await pool
          .request()
          .input('id', mssql.VarChar(10), id)
          .query('select * from HTIPDOCIDEN where ccod_empresa = @id');
            
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
      .query("SELECT  \n"+  
      " ccod_tdid AS Codigo_ID,\n"+  
      " ccod_sunatid + '--' + cnom_descrip AS Nombre, \n"+  
      " ccod_sunatid as Codigo, \n"+  
      " abvr as Abreviatura, \n"+  
      " digitos as Digitos \n"+  
      " FROM HTIPDOCIDEN");
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

module.exports = router;