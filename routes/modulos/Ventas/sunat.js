const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../../database');

router.post('/pendientes', async (req, res) => {
    try {
        var tipo_filtrar = req.body.tipo_filtrar;
        const codigo_empresa = req.user.codigo_empresa;

        const pool = await poolPromise
  
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('inicio', mssql.VarChar(250), req.body.inicio)
        .input('final', mssql.VarChar(250), req.body.final)
        .query(
            "SELECT \n"+
            "'Sunat' as Sunat, \n"+
            "'XML' as XML, \n"+
            "'PDF' as PDF, \n"+
            "'CDR' as CDR, \n"+
            "'Correo' as Correo, \n"+
            "Halmacen.ccod_almacen as Codigo_Punto_Venta, \n"+
            "Halmacen.cnom_almacen as Punto_Venta, \n"+
            "hmovialc.ccod_movimiento as Codigo_Tipo_Documento, \n"+
            "Htipdoc.cnom_doc as Tipo_Documento, \n"+
            "Hmovialc.cnum_serie as Serie, \n"+
            "Hmovialc.cnum_doc as Numero, \n"+
            "CONVERT(VARCHAR(50),Hmovialc.dfecha_doc,103) as Fecha, \n"+
            "CONVERT(VARCHAR(50),Hmovialc.dfecha_entr,103) as Fecha_Entrega, \n"+
            "Hmovialc.ccod_cliente as Codigo_Cliente, \n"+
            "Hmovialc.cnom_cliente_v as Nombre_Cliente, \n"+
            "Hmovialc.ccod_forpago as Codigo_Forma_Pago, \n"+
            "Hfor_pag.cnom_forpago as Forma_Pago, \n"+
            "Hmovialc.cmoneda as Moneda, \n"+
            "Hmovialc.tipo_cambio as Tc, \n"+
            "Hmovialc.subtotal_sin_descuentos as Sub_total_sin_descuentos, \n"+
            "Hmovialc.erp_Ddescuento as Descuento, \n"+
            "Hmovialc.nsubtotal as Sub_total, \n"+
            "Hmovialc.nigv as Igv, \n"+
            "Hmovialc.nimporte as Importe, \n"+
            "Hmovialc.estado as Estado_Documento, \n"+
            "hmovialc.estado_fe as Estado_Fe, \n"+
            "case CONVERT(VARCHAR(50),Hmovialc.fechagen,103) when '01/01/1900' then '' else CONVERT(VARCHAR(50),Hmovialc.fechagen,103) end as Fecha_Envio, \n"+
            "case CONVERT(VARCHAR(50),Hmovialc.fechabaja,103) when '01/01/1900' then '' else CONVERT(VARCHAR(50),Hmovialc.fechabaja,103) end as Fecha_Baja \n"+
            "FROM Hmovialc with (nolock) INNER JOIN Halmacen with (nolock) ON \n"+
            "Hmovialc.ccod_empresa = Halmacen.ccod_empresa and \n"+
            "Hmovialc.ccod_almacen = Halmacen.ccod_almacen \n"+
            "inner join Htipdoc on \n"+
            "Htipdoc.ccod_empresa = hmovialc.ccod_empresa and \n"+
            "Htipdoc.ctip_doc = hmovialc.ccod_movimiento \n"+
            "Inner Join hfor_pag with (nolock) ON \n"+
            "Hmovialc.ccod_empresa = Hfor_pag.ccod_empresa and \n"+
            "Hmovialc.ccod_forpago = Hfor_pag.ccod_forpago \n"+
            "WHERE Hmovialc.ccod_empresa = @codigo_empresa \n"+
            "and Hmovialc.ccod_movimiento in ('01','03','07','08','09') \n"+
            "and  \n"+
            "( \n"+
            "Hmovialc.cnum_serie like ('F%') or \n"+
            "Hmovialc.cnum_serie like ('B%') or \n"+
            "Hmovialc.cnum_serie like ('T%') \n"+
            ") \n"+
            "and hmovialc.estado_fe not in ('Enviado','Enviado y Anulado', 'Rechazado') \n"+
            "and LEN(cnum_serie)=4 \n"+
            (tipo_filtrar =="Todo" ? "" :  "and dfecha_doc between @inicio and @final\n")+
            "order by Hmovialc.dfecha_doc desc \n"

        );
          
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/enviados', async (req, res) => {
    try {

        var tipo_filtrar = req.body.tipo_filtrar;
        var sunat_filtrar = req.body.sunat_filtrar;
        
        const codigo_empresa = req.user.codigo_empresa;

        const pool = await poolPromise
  
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('inicio', mssql.VarChar(250), req.body.inicio)
        .input('final', mssql.VarChar(250), req.body.final)
        .query(
            "select \n"+
            "codigo_empresa as Codigo_Empresa, \n"+
            "codigo_punto_venta as Codigo_Punto_Venta, \n"+
            "Halmacen.cnom_almacen as Punto_Venta, \n"+
            "tipo_documento as Codigo_Tipo_Documento, \n"+
            "Htipdoc.cnom_doc as Tipo_Documento, \n"+
            "serie_documento as Serie, \n"+
            "numero_documento as Numero, \n"+
            "CONVERT(VARCHAR(50),fecha_documento,103) as Fecha, \n"+
            "CONVERT(VARCHAR(50),fecha_entrega,103) as Fecha_Entrega, \n"+
            "codigo_cliente as Codigo_Cliente, \n"+
            "nombre_cliente as Nombre_Cliente, \n"+
            "codigo_forma_pago as Codigo_Forma_Pago, \n"+
            "hfor_pag.cnom_forpago as Forma_Pago, \n"+
            "codigo_moneda as Moneda, \n"+
            "tasa_cambio as Tc, \n"+
            "sub_total_sin_descuentos as Sub_total_sin_descuentos, \n"+
            "descuento as Descuento, \n"+
            "sub_total as Sub_total, \n"+
            "igv as Igv, \n"+
            "total as Importe, \n"+
            "estado_documento as Estado_Documento, \n"+
            "estado_sunat as Estado_Fe, \n"+
            "CONVERT(VARCHAR(50),fecha_envio,103) as Fecha_Envio, \n"+
            "CONVERT(VARCHAR(50),fecha_baja,103) as Fecha_Baja, \n"+
            "codigo_cdr, \n"+
            "mensaje_cdr, \n"+
            "pdf_web, \n"+
            "cdr_web, \n"+
            "xml_web, \n"+
            "estado_correo \n"+
            "from envios_sunat \n"+
            "inner join Htipdoc on \n"+
            "envios_sunat.codigo_empresa = Htipdoc.ccod_empresa and \n"+
            "envios_sunat.tipo_documento = Htipdoc.ctip_doc \n"+
            "INNER JOIN Halmacen on \n"+
            "envios_sunat.codigo_empresa = Halmacen.ccod_empresa and \n"+
            "envios_sunat.codigo_punto_venta = Halmacen.ccod_almacen \n"+
            "Inner Join hfor_pag on \n"+
            "envios_sunat.codigo_empresa = hfor_pag.ccod_empresa and \n"+
            "envios_sunat.codigo_forma_pago = hfor_pag.ccod_forpago \n"+
            "where \n"+
            "envios_sunat.codigo_empresa = @codigo_empresa \n"+
            (tipo_filtrar =="Todo" ? "" :  "and envios_sunat.fecha_envio between @inicio and @final\n")+
            (sunat_filtrar =="Aceptados" ? "and estado_sunat = 'Aceptado' \n" : "")+
            (sunat_filtrar =="Rechazados" ? "and estado_sunat = 'Rechazado' \n" : "")+
            (sunat_filtrar =="Observados" ? "and estado_sunat = 'Observado' \n" : "")+
            "order by envios_sunat.fecha_envio desc \n"
        );
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/insertar_sunat', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('Codigo_Cliente', mssql.VarChar(300), req.body.Codigo_Cliente)
        .input('Codigo_Forma_Pago', mssql.VarChar(100), req.body.Codigo_Forma_Pago)
        .input('Codigo_Punto_Venta', mssql.VarChar(100), req.body.Codigo_Punto_Venta)
        .input('Codigo_Tipo_Documento', mssql.VarChar(100), req.body.Codigo_Tipo_Documento)
        .input('Tipo_Documento', mssql.VarChar(100), req.body.Tipo_Documento)
        .input('Serie', mssql.VarChar(100), req.body.Serie)
        .input('Numero', mssql.VarChar(100), req.body.Numero)
        .input('Descuento', mssql.VarChar(100), req.body.Descuento)
        .input('Estado_Documento', mssql.VarChar(100), req.body.Estado_Documento)
        .input('Estado_Fe', mssql.VarChar(100), req.body.Estado_Fe)
        .input('Fecha', mssql.VarChar(100), req.body.Fecha)
        .input('Fecha_Baja', mssql.VarChar(100), req.body.Fecha_Baja)
        .input('Fecha_Entrega', mssql.VarChar(100), req.body.Fecha_Entrega)
        .input('Fecha_Envio', mssql.VarChar(100), req.body.Fecha_Envio)
        .input('Forma_Pago', mssql.VarChar(100), req.body.Forma_Pago)
        .input('Igv', mssql.VarChar(100), req.body.Igv)
        .input('Importe', mssql.VarChar(100), req.body.Importe)
        .input('Moneda', mssql.VarChar(100), req.body.Moneda)
        .input('Nombre_Cliente', mssql.VarChar(300), req.body.Nombre_Cliente)
        .input('Punto_Venta', mssql.VarChar(100), req.body.Punto_Venta)
        .input('Sub_total', mssql.VarChar(100), req.body.Sub_total)
        .input('Sub_total_sin_descuentos', mssql.VarChar(100), req.body.Sub_total_sin_descuentos)
        .input('Tc', mssql.VarChar(100), req.body.Tc)
        .query(
            "delete from envios_sunat where \n"+
            "codigo_empresa = @codigo_empresa and \n"+
            "Codigo_Cliente = @Codigo_Cliente and \n"+
            "Codigo_Punto_Venta = @Codigo_Punto_Venta and \n"+
            "tipo_documento = @Codigo_Tipo_Documento and \n"+
            "serie_documento = @Serie and \n"+
            "numero_documento = @Numero; \n"+
            "insert into envios_sunat ( \n"+
            "codigo_empresa, \n"+
            "Codigo_Cliente, \n"+
            "Codigo_Forma_Pago, \n"+
            "Codigo_Punto_Venta, \n"+
            "tipo_documento, \n"+
            "Descuento, \n"+
            "Estado_Documento, \n"+
            "estado_sunat, \n"+
            "fecha_documento, \n"+
            "Fecha_Baja, \n"+
            "Fecha_Entrega, \n"+
            "Fecha_Envio, \n"+
            "Igv, \n"+
            "total, \n"+
            "codigo_moneda, \n"+
            "Nombre_Cliente, \n"+
            "numero_documento, \n"+
            "serie_documento, \n"+
            "Sub_total, \n"+
            "Sub_total_sin_descuentos, \n"+
            "tasa_cambio \n"+
            ") values ( \n"+
            "@codigo_empresa, \n"+
            "@Codigo_Cliente, \n"+
            "@Codigo_Forma_Pago, \n"+
            "@Codigo_Punto_Venta, \n"+
            "@Codigo_Tipo_Documento, \n"+
            "@Descuento, \n"+
            "@Estado_Documento, \n"+
            "'Esperando Respuesta...', \n"+
            "@Fecha, \n"+
            "@Fecha_Baja, \n"+
            "@Fecha_Entrega, \n"+
            "@Fecha_Envio, \n"+
            "@Igv, \n"+
            "@Importe, \n"+
            "@Moneda, \n"+
            "@Nombre_Cliente, \n"+
            "@Numero, \n"+
            "@Serie, \n"+
            "@Sub_total, \n"+
            "@Sub_total_sin_descuentos, \n"+
            "@Tc \n"+
            "); \n"+
            "update hmovialc set \n"+
            (req.body.Estado_Documento != "Anulado" ? "fechagen = @Fecha_Envio where \n" : "fechabaja = @Fecha_Envio where \n" ) +
            "hmovialc.ccod_empresa = @codigo_empresa \n"+
            "and hmovialc.ccod_almacen = @Codigo_Punto_Venta \n"+
            "and hmovialc.ccod_movimiento = @Codigo_Tipo_Documento \n"+
            "and hmovialc.cnum_serie = @Serie \n"+
            "and hmovialc.cnum_doc = @Numero "
        );
        res.json(req.body); 
    } catch (err) {
        res.send("Error");
        // res.send(err.message);
    }
});

router.get('/lista_para_enviar', async (req, res) => {
    try {
        const pool = await poolPromise
        const lista = await pool
        .request()
        .query(
            "select codigo_empresa, hempresa.cnum_ruc as empresa_ruc, codigo_punto_venta, tipo_documento,serie_documento,numero_documento \n"+
            "from envios_sunat \n"+
            "inner join Hempresa on \n"+
            "envios_sunat.codigo_empresa = Hempresa.ccod_empresa \n"+
            "where pdf_web is null \n"
        );
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/actualizar_pdf', async (req, res) => {
    try {
        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), req.body.codigo_empresa)
        .input('Punto_Venta', mssql.VarChar(100), req.body.punto_venta)
        .input('Tipo_Documento', mssql.VarChar(100), req.body.tipo_documento)
        .input('Serie', mssql.VarChar(100), req.body.serie_documento)
        .input('Numero', mssql.VarChar(100), req.body.numero_documento)
        .input('mensaje', mssql.VarChar(100), req.body.mensaje_codigo =="0" ?'Creando XML...' : req.body.mensaje_contenido )
        .query(
            "update envios_sunat \n"+
            "set estado_sunat =@mensaje where \n"+
            "envios_sunat.codigo_empresa = @codigo_empresa \n"+
            "and envios_sunat.codigo_punto_venta = @Punto_Venta \n"+
            "and envios_sunat.tipo_documento = @Tipo_Documento \n"+
            "and envios_sunat.serie_documento = @Serie \n"+
            "and envios_sunat.numero_documento = @Numero "
        );
        const recordset = lista.rowsAffected;
        res.json(req.body); 
    } catch (err) {
        res.send(err.message);
    }
});

module.exports = router;