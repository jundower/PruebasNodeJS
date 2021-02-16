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
        .input('ejercicio', mssql.VarChar(250), req.body.ejercicio)
        .query(
          " SELECT \n"+
          " Hpercon.periodo_con as Codigo,   \n"+
          " Hpercon.periodo_con as Nombre,   \n"+
          " Hpercon.ejercon as Ejercicio,   \n"+
          " Hpercon.periodo_con as Periodo_Contable,   \n"+
          " Hpercon.descripcion as Descripcion,   \n"+
          " Hpercon.dfecha_inicio as Fecha_Inicio,   \n"+
          " Hpercon.dfecha_final as Fecha_Final,   \n"+
          " Hpercon.secuencia as Secuencia,   \n"+
          " Hpercon.estado as Estado  \n"+
          " FROM Hpercon   \n"+
          " where ccod_empresa = @codigo_empresa and\n"+
          " ejercon = @ejercicio \n"+
          " order by secuencia \n"
        );
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
      res.send(err.message)
    }
});

router.post('/datos', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        var codigo = req.body.Codigo;
        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('año', mssql.VarChar(250), req.body.año)
        .input('mes', mssql.VarChar(250), req.body.mes)
        .query(
            " select \n"+
            " ejercon as Ejercicio, \n"+
            " periodo_con as Periodo, \n"+
            " descripcion as Descripcion, \n"+
            " convert(varchar,dfecha_inicio,103) as Fecha_Inicio, \n"+
            " CONVERT(varchar,dfecha_final, 103) as Fecha_Final, \n"+
            " secuencia as Numero_Correlativo, \n"+
            " estado as Estado, \n"+
            " erp_tccomp, \n"+
            " erp_tcvent \n"+
            " from Hpercon \n"+
            " where \n"+
            " ccod_empresa = @codigo_empresa and \n"+
            " ejercon = @año and \n"+
            " MONTH(dfecha_inicio) = @mes order by periodo_con desc"
        );
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message)
    }
});

router.post('/ejercicio', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .query(
          " SELECT  \n"+
          " Hejercon.ejercon as Codigo,    \n"+
          " 'AÑO '+Hejercon.ejercon as Nombre,    \n"+
          " Hejercon.ejercon as Ejercicio,    \n"+
          " Hejercon.Descripcion as Descripcion,    \n"+
          " CONVERT(VARCHAR,Hejercon.dfecha_inicio,103) as Fecha_Inicio,    \n"+
          " CONVERT(VARCHAR,Hejercon.dfecha_final,103) as Fecha_Final, \n"+
          " 'M'   as Tipo \n"+
          " FROM Hejercon    \n"+
          " where ccod_empresa  = @codigo_empresa \n"
        );
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        console.log(err.message);
        res.send(err.message)
    }
});


router.post('/periodo/:ejercicio', async (req, res) => {
    try {
        
        const {ejercicio} = req.params;
        const codigo_empresa = req.user.codigo_empresa;
        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('ejercicio', mssql.VarChar(250), ejercicio)
        .query(
          " SELECT \n"+
          " Hpercon.periodo_con as Codigo,   \n"+
          " Hpercon.periodo_con as Nombre,   \n"+
          " Hpercon.ejercon as Ejercicio,   \n"+
          " Hpercon.periodo_con as Periodo_Contable,   \n"+
          " Hpercon.descripcion as Descripcion,   \n"+
          " Hpercon.dfecha_inicio as Fecha_Inicio,   \n"+
          " Hpercon.dfecha_final as Fecha_Final,   \n"+
          " Hpercon.secuencia as Secuencia,   \n"+
          " Hpercon.estado as Estado  \n"+
          " FROM Hpercon   \n"+
          " where ccod_empresa = @codigo_empresa and\n"+
          " ejercon = @ejercicio \n"+
          " order by secuencia \n"
        );
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
      res.send(err.message)
    }
});

module.exports = router;