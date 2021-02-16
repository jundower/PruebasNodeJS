const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');
const {isNotLoggedin,isLoggedin} = require('../../lib/auth');

router.get('/lista',isNotLoggedin, async (req, res) => {
  try {
    const pool = await poolPromise
    const result_empresas = await pool.request().query('select * from hempresa');
    const empresas = result_empresas.recordset;
    res.json(empresas);
  } catch (err) {
    
    res.send(err.message)
  }
});
  
router.post('/lista', async (req, res) => {
  try {
    const pool = await poolPromise
    const result_empresas = await pool.request().query('select * from hempresa');
    const empresas = result_empresas.recordset;
    res.json(empresas);
  } catch (err) {
    
    res.send(err.message)
  }
});
  
module.exports = router;