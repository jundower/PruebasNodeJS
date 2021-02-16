const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');

router.post('/lista', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa
        const pool = await poolPromise
        const list = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('modulo', mssql.VarChar(250), req.body.modulo)
        .query('select modulo,campo,visible,posicion,nueva_posicion,width from configuracion_web where codigo_empresa = @codigo_empresa and modulo =@modulo order by nueva_posicion');
            
        const recordset = list.recordset;

        res.json(recordset); 
    } catch (err) {
        res.send(err.message)
    }
});

router.post('/guardar', async (req, res) => {
    try {
        codigo_empresa = req.user.codigo_empresa;
        const pool = await poolPromise;
        var list;
        var lista = JSON.parse(req.body.lista)
        for(var i=0 ; i<lista.length; i++){
            var element=lista[i];
            list = await pool
            .request()
            .input('codigo_empresa', mssql.VarChar(250), codigo_empresa)
            .input('visible', mssql.Int, element.visible)
            .input('nueva_posicion', mssql.Int, element.nueva_posicion)
            .input('modulo', mssql.VarChar(250), element.modulo)
            .input('campo', mssql.VarChar(250), element.campo)
            .input('width', mssql.VarChar(250), element.width)
            .query('update configuracion_web set visible=@visible, nueva_posicion = @nueva_posicion, width = @width where codigo_empresa = @codigo_empresa and modulo= @modulo and campo = @campo' );
        }
        var recordset = list.rowsAffected;
        res.send(recordset);
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/generar', async (req, res) => {
  
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const pool = await poolPromise;
        var lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('modulo', mssql.VarChar(250), req.body.modulo)
        .query(
        "DECLARE @columns nvarchar(MAX);\n"+
        "DECLARE @sql nvarchar(MAX);\n"+
        "SET @columns = STUFF((SELECT ',' + QUOTENAME(campo) FROM\n"+
        "(SELECT DISTINCT codigo_empresa,modulo,campo,nueva_posicion,width FROM configuracion_web ) AS T\n"+
        "where codigo_empresa=@codigo_empresa and modulo=@modulo\n"+
        "ORDER BY [nueva_posicion] FOR XML PATH('') ), 1, 1, '');\n"+
        "SET @sql = '\n"+
        "SELECT * FROM (\n"+
        "select codigo_empresa,modulo,campo,COL,VAL from configuracion_web\n"+
        "CROSS APPLY (VALUES (''visible'',visible),\n"+
        "(''posicion'',posicion),\n"+
        "(''nueva_posicion'',nueva_posicion),\n"+
        "(''width'',width),\n"+
        "(''formato'',formato),\n"+
        "(''editable'',editable)\n"+
        ")CS (COL,VAL))T\n"+
        "PIVOT (MAX(VAL) FOR campo IN ('+@columns+'))PVT\n"+
        "where\n"+
        "codigo_empresa='+@codigo_empresa+'\n"+
        "and modulo =''"+req.body.modulo+"''\n"+
        "ORDER BY COL DESC\n"+
        "';\n"+
        "EXEC sp_executesql @sql;\n");
    
        const recordset = lista.recordset;
        res.json(recordset);
        
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/restablecer', async (req, res) => {
    try{
        const codigo_empresa = req.user.codigo_empresa;
        const pool = await poolPromise;
        var lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('modulo', mssql.VarChar(250), req.body.modulo)
        .query("delete from configuracion_web where codigo_empresa = @codigo_empresa and modulo= @modulo");

        var columnas = JSON.parse(req.body.columnas)

        var query = "insert into configuracion_web values ";
        for(var i=0 ; i<columnas.length; i++){
            var element=columnas[i];
            query +=" ('"+codigo_empresa+"','"+req.body.modulo+"','"+element.Nombre+"','"+element.Hidden+"','"+(i + 1)+"','"+(i + 1)+"','"+element.Formato+"','"+element.Editable+"','"+element.width+"'),";
        }

        query = query.slice(0,-1);
        lista = await pool
        .request()
        .query(query);
        const recordset = lista.rowsAffected;
        res.json(recordset);
    } catch (err) {
        res.send(err.message);
    }
    
});

module.exports = router;