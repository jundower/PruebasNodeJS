const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');

router.post('/lista', async (req, res) => {
    const codigo_empresa = req.user.codigo_empresa;

    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .query("Select LTRIM(RTRIM(ccod_banco)) as Codigo , Upper(cnom_banco) as Nombre  From hbancos");

    const recordset = lista.recordset;
    res.json(recordset);
});

module.exports = router;