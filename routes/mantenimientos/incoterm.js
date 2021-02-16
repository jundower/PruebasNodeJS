const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');


router.get('/incoterm/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const pool = await poolPromise
  
          const lista = await pool
          .request()
          .input('id', mssql.VarChar(10), id)
          .query('select * from Hincoterm where ccod_empresa = @id');
            
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
      .input('id', mssql.VarChar(10), codigo_empresa)
      .query(" Select "+
        " LTRIM(RTRIM(ccod_incoterm)) as Codigo, "+
        " descripcion as Nombre, "+
        " bflete as Flete, "+
        " bseguro as Seguro, "+
        " botros as Otros "+
        " From Hincoterm where ccod_empresa = @id");
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

module.exports = router;