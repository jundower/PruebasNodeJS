const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');

router.post('/lista', async(req, res) => {

    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('tipo_documento', mssql.VarChar(25), req.body.tipo_documento)
    .query(
        "SELECT \n"+
        "Erp_Sunat_30_clasif_bien_servicios.erp_codigo as Codigo,     \n"+
        "Erp_Sunat_30_clasif_bien_servicios.erp_codigo+' - '+Erp_Sunat_30_clasif_bien_servicios.erp_descripcion as Nombre \n"+       
        "FROM Erp_Sunat_30_clasif_bien_servicios   \n"
    );
    const recordset = lista.recordset;
    res.json(recordset); 
});

module.exports = router;