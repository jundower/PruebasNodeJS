const express = require('express');
const router = express.Router();
const {isLoggedin} = require('../../lib/auth');
const {poolPromise, mssql} = require ('../../database');

router.post('/lista', async (req, res) => {
    try{
        const codigo_empresa = req.user.codigo_empresa;
        const pool = await poolPromise;
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('tipo', mssql.VarChar(10), req.body.tipo)
        .query(
            "select \n"+
            "erp_codigo as Codigo, \n"+
            "erp_nombre as Nombre, \n"+
            "erp_tipo as Tipo, \n"+
            "erp_visible as Visible \n"+
            "from Erp_Conceptos_Precios where \n"+
            "erp_tipo=@tipo \n"+
            "and erp_codemp = @codigo_empresa \n"+
            "and erp_visible ='1' \n"
        );
    
        const recordset = lista.recordset;
        res.json(recordset);
    } catch (err) {
        res.send(err.message)
    }
});

router.post('/clientes', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const pool = await poolPromise;
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_cliente', mssql.VarChar(100), req.body.codigo)
        .query("select erp_codlista as Codigo, erp_nombre as Nombre "+
        "from Erp_clientes_Lista_Precios "+ 
        "inner join Erp_Conceptos_Precios on "+
        "Erp_clientes_Lista_Precios.erp_codemp  = Erp_Conceptos_Precios.erp_codemp "+
        "and Erp_clientes_Lista_Precios.erp_codlista  = Erp_Conceptos_Precios.erp_codigo "+
        "where "+
        "Erp_Conceptos_Precios.erp_codemp = @codigo_empresa and "+
        "erp_codclie=@codigo_cliente and erp_activo='1' and Erp_Conceptos_Precios.erp_tipo='12' ");
        const recordset = lista.recordset;
        res.json(recordset);
    } catch (err) {
        res.send(err.message)
    }
});

router.get('/:venta_compra',isLoggedin,async (req, res) => {
    const {venta_compra} = req.params;
    res.render("modulos/mantenimientos/lista_precios",{venta_compra: venta_compra});
});

router.post('/venta', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const pool = await poolPromise;
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_cliente', mssql.VarChar(100), req.body.codigo)
        .query("exec dbo.sp_lista_precios_venta02 @codigo_empresa,N'001',N'001',N'12',N'S/', ' ' ");
        const recordset = lista.recordset;
        res.json(recordset);
    } catch (err) {
        res.send(err.message)
    }
});

module.exports = router;