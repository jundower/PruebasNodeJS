const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../../database');
const {isLoggedin} = require('../../../lib/auth');

router.get('/formatos/:tipo_documento/:motivo_serie_documento',isLoggedin,async (req, res) => {
    const { tipo_documento } = req.params;
    const { motivo_serie_documento } = req.params;
    res.render("modulos/configuraciones/formato", {tipo_documento: tipo_documento,motivo_serie_documento: motivo_serie_documento});
});

router.post('/formatos/guardar',isLoggedin,async (req, res) => {
    try {
        var codigo_empresa = req.user.codigo_empresa;
        var tipo_documento = req.body.tipo_documento;
        var motivo_serie_documento = req.body.motivo_serie_documento;
        const pool = await poolPromise;
        var list;
        var lista = JSON.parse(req.body.propiedades)
        
        list = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(250), codigo_empresa)
        .input('tipo_documento', mssql.VarChar(250), tipo_documento)
        .input('motivo_serie_documento', mssql.VarChar(250), motivo_serie_documento)
        .query('delete from configuracion_formatos_web where codigo_empresa = @codigo_empresa and tipo_documento = @tipo_documento and motivo_serie_documento= @motivo_serie_documento');
        
        for(var i=0 ; i<lista.length; i++){
            var element=lista[i];
            list = await pool
            .request()
            .input('codigo_empresa', mssql.VarChar(250), codigo_empresa)
            .input('tipo_documento', mssql.VarChar(250), tipo_documento)
            .input('motivo_serie_documento', mssql.VarChar(250), motivo_serie_documento)
            .input('campo', mssql.VarChar(250), element.nombre)
            .input('nuevo_texto', mssql.VarChar(250), element.text)
            .input('campo_position', mssql.VarChar(250), element.position)
            .input('campo_width', mssql.VarChar(250), element.width)
            .input('campo_right', mssql.VarChar(250), element.right)
            .input('campo_height', mssql.VarChar(250), element.height)
            .input('campo_bottom', mssql.VarChar(250), element.bottom)
            .input('campo_left', mssql.VarChar(250), element.left)
            .input('campo_top', mssql.VarChar(250), element.top)
            .input('campo_clase', mssql.VarChar(250), element.clase)
            .input('campo_font_size', mssql.VarChar(250), element.font_size)
            .input('campo_text_align', mssql.VarChar(250), element.text_align)
            .input('campo_font_weight', mssql.VarChar(250), element.font_weight)
            .query(
                'insert into configuracion_formatos_web (codigo_empresa,tipo_documento,motivo_serie_documento,campo,nuevo_texto,campo_position,campo_width,campo_right,campo_height,campo_bottom,campo_left,campo_top,campo_clase,campo_font_size,campo_text_align,campo_font_weight) values (@codigo_empresa,@tipo_documento,@motivo_serie_documento,@campo,@nuevo_texto,@campo_position,@campo_width,@campo_right,@campo_height,@campo_bottom,@campo_left,@campo_top,@campo_clase,@campo_font_size,@campo_text_align,@campo_font_weight)' 
            );
        }
        var recordset = list.rowsAffected;
        res.send(recordset);
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/formatos/lista',isLoggedin,async (req, res) => {
    
    try {
        var codigo_empresa = req.user.codigo_empresa;
        var tipo_documento = req.body.tipo_documento;
        var motivo_serie_documento = req.body.motivo_serie_documento;
        const pool = await poolPromise;
        var lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('tipo_documento', mssql.VarChar(250), tipo_documento)
        .input('motivo_serie_documento', mssql.VarChar(250), motivo_serie_documento)
        .query("select * from configuracion_formatos_web where codigo_empresa = @codigo_empresa and tipo_documento= @tipo_documento and motivo_serie_documento= @motivo_serie_documento");

        var recordset = lista.recordset;
        res.send(recordset);
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/formatos/campos',isLoggedin,async (req, res) => {
    
    try {
        var codigo_empresa = req.user.codigo_empresa;
        const pool = await poolPromise;
        var lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('tabla', mssql.VarChar(250), req.body.tabla)
        .query(
            "SELECT COLUMN_NAME,ORDINAL_POSITION,DATA_TYPE,CHARACTER_MAXIMUM_LENGTH,CHARACTER_OCTET_LENGTH \n"+
            "FROM Information_Schema.Columns \n"+
            "WHERE TABLE_NAME = @tabla \n"+
            "ORDER BY COLUMN_NAME \n"
        )

        var recordset = lista.recordset;
        res.send(recordset);
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/globales',isLoggedin,async (req, res) => {
    try {
        var codigo_empresa = req.user.codigo_empresa;
        const pool = await poolPromise;
        var lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .query(
            "select decimales_cant,decimales_precio from Hconfiguraciones where IdEmpresa=@codigo_empresa"
        )

        var recordset = lista.recordset;
        res.send(recordset);
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/tipo_cambio',isLoggedin,async (req, res) => {
    try {
        var codigo_empresa = req.user.codigo_empresa;
        const pool = await poolPromise;
        var lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .query("select moneda_trabajo, mas_igv, ctipo_cambio from Hconfiguraciones_2 where idempresa=@codigo_empresa ");

        var recordset = lista.recordset;
        res.send(recordset);
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/datos_empresa',isLoggedin,async (req, res) => {
    
    try {
        var codigo_empresa = req.user.codigo_empresa;
        const pool = await poolPromise;
        var lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .query(
            "select crazonsocial as Razon_Social, cnum_ruc as Ruc from hempresa where ccod_empresa = @codigo_empresa"
        )

        var recordset = lista.recordset;
        res.send(recordset);
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/formato_impresion',isLoggedin,async (req, res) => {
    
    try {
        // res.send(req.user);
        
        var codigo_empresa = req.user.codigo_empresa;
        var ruc_empresa = req.user.ruc_empresa;
        var modulo = req.body.modulo;
        var tipo_formato = req.body.tipo_formato;
        var punto_venta = req.body.punto_venta;
        var tipo_documento = req.body.tipo_documento;
        var motivo_serie_documento = req.body.motivo_serie_documento;
        
        // res.render("modulos/configuraciones/pruebas", {layout: false});
        const pool = await poolPromise;
        var lista;
        if(tipo_formato=="talonarios"){
            lista = await pool
            .request()
            .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
            .input('punto_venta', mssql.VarChar(250), punto_venta)
            .input('tipo_documento', mssql.VarChar(250), tipo_documento)
            .input('motivo_serie_documento', mssql.VarChar(250), motivo_serie_documento)
            .query("select ruta_formato as nombre from Htalonar where ccod_empresa=@codigo_empresa and ccod_almacen=@punto_venta and tip_doc=@tipo_documento and cnum_serie=@motivo_serie_documento");
        }else if (tipo_formato=="tramites"){
            lista = await pool
            .request()
            .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
            .input('tipo_documento', mssql.VarChar(250), tipo_documento)
            .input('motivo_serie_documento', mssql.VarChar(250), motivo_serie_documento)
            .query("select erp_rutfor as nombre from erp_motivos_tramite where erp_codemp=@codigo_empresa and erp_codtid=@tipo_documento and erp_codmot=@motivo_serie_documento");
        }else if (tipo_formato=="transaccion"){
            lista = await pool
            .request()
            .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
            .input('tipo_documento', mssql.VarChar(250), tipo_documento)
            .input('motivo_serie_documento', mssql.VarChar(250), motivo_serie_documento)
            .query("select ruta_formato as nombre from HTRANSAL where ccod_empresa = @codigo_empresa and ccod_movimiento = @motivo_serie_documento and ctip_movimiento = @tipo_documento");
            //.query("select erp_rutfor as nombre from erp_motivos_tramite where erp_codemp=@codigo_empresa and erp_codtid=@tipo_documento and erp_codmot=@motivo_serie_documento");
        }else{
            lista = await pool
            .request()
            .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
            .input('tipo_documento', mssql.VarChar(250), tipo_documento)
            .query("select ruta_formato as nombre from Htipdoc where ccod_empresa=@codigo_empresa and ctip_doc=@tipo_documento");
        }

        var recordset = lista.recordset[0];
        var ruta_nombre = recordset.nombre
        if (ruta_nombre == '' ) {
            ruta_nombre = 'comparativo_precios';
        }
        console.log(ruta_nombre);
        // res.send('formatos/'+ruc_empresa+'/'+modulo+'/'+recordset.nombre,);
        res.render('formatos/'+ruc_empresa+'/'+modulo+'/'+ruta_nombre, {layout: false});
    } catch (err) {
        res.send(err.message);
        // res.render("modulos/configuraciones/pruebas", {layout: false});
    }
});

router.post('/configuracion_permisos/:modulo', async (req, res) => {
    try{
        const {modulo} = req.params;
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_usuario = req.user.codigo_usuario;
        const pool = await poolPromise;
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_usuario', mssql.VarChar(20), codigo_usuario)
        .query("select replace(modulo,'__','_') as modulo, acceso, guardar, modificar, eliminar from configuracion_permisos where codigo_empresa=@codigo_empresa and codigo_usuario=@codigo_usuario and modulo = '"+modulo+"'");
      
        const recordset = lista.recordset;
        res.json(recordset);
    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
});


router.post('/configuracion_visibilidad', async (req, res) => {

    try{
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_usuario = req.user.codigo_usuario;
        const pool = await poolPromise;
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_usuario', mssql.VarChar(20), codigo_usuario)
        .query("select modulo, acceso, guardar, modificar, eliminar from configuracion_permisos where codigo_empresa=@codigo_empresa and codigo_usuario=@codigo_usuario");
      
        const recordset = lista.recordset;
        res.json(recordset);
    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
});
module.exports = router;