const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../../database');

router.post('/almacen/:tipo_reporte', async (req, res) => {
    try{
        const {tipo_reporte} = req.params;
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.body.punto_venta;
        var columnas = {
            responsable: "HMOVIALC.ccod_responsable",
            centro_costos: "HMOVIALC.ccod_cencos",
            unidad_negocio: "HMOVIALC.erp_codune",
            orden_trabajo: "HMOVIALC.ot",
            codigo_proveedor: "HMOVIALC.ccod_proveedor",
            articulos: "HMOVIALD.ccod_articulo",
            forma_pago_lista: "HMOVIALC.ccod_forpago",
        }
        var agrupacion1_valores = req.body.agrupacion1_valores;
        var agrupacion2_valores = req.body.agrupacion2_valores;
        var agrupacion3_valores = req.body.agrupacion3_valores;
        var agrupacion1_tipo = req.body.agrupacion1_tipo;
        var agrupacion2_tipo = req.body.agrupacion2_tipo;
        var agrupacion3_tipo = req.body.agrupacion3_tipo;

        var query="";
        if(tipo_reporte=="resumido"){
            query=
            "select \n"+ 
            " HMOVIALC.modulo as Modulo_Documento, \n"+
            " HMOVIALC.ccod_almacen as Punto_Venta, \n"+
            " HMOVIALC.ccod_movimiento as Codigo_Movimiento, \n"+
            " htipdoc.cnom_doc as Nombre_Movimiento, \n"+
            " (case HMOVIALC.modulo when 'INVENTARIO' then HTRANSAL.cnom_movimiento  else HMOVIALC.tipo_venta end) as Transaccion_Tipo, \n"+
            " HMOVIALC.cnum_serie as Serie, \n"+
            " HMOVIALC.cnum_doc as Numero, \n"+
            " HMOVIALC.ccod_proveedor as Codigo_Proveedor, \n"+
            " HMOVIALC.cnom_proveedor_c as Nombre_Provvedor, \n"+
            " HMOVIALC.ccod_cliente as Codigo_Cliente, \n"+
            " HMOVIALC.cnom_cliente_v as Nombre_Cliente, \n"+
            " CONVERT(VARCHAR,HMOVIALC.dfecha_doc,103) as Fecha, \n"+
            " HMOVIALC.nro_dias as Dias, \n"+
            " CONVERT(VARCHAR,HMOVIALC.dfecha_entr,103) as Fecha_Limite, \n"+
            " HMOVIALC.ccod_forpago as Codigo_Forma_Pago, \n"+
            " Hfor_pag.cnom_forpago as Forma_Pago, \n"+
            " HMOVIALC.ctip_docref as Tipo_Referencia, \n"+
            " HMOVIALC.cserie_docref as Motivo_Serie_Referencia, \n"+
            " HMOVIALC.cnum_docref as Numero_Referencia, \n"+
            " HMOVIALC.estado as Estado, \n"+
            " HMOVIALC.tipo_cambio as Tipo_Cambio, \n"+
            " HMOVIALC.desc_stock as Desc_Stock, \n"+
            " HMOVIALC.ccod_responsable as Codigo_Responsable, \n"+
            " (Hperson.ape_pat+' '+Hperson.ape_mat+' '+Hperson.nombres) as Nombre_Responsable, \n"+
            " HMOVIALC.erp_codune as Codigo_Unidad_Negocio, \n"+
            " erp_unidad_negocio.erp_nomune as Unidad_Negocio, \n"+
            " Hcencos.cnom_cencos as Centro_Costo, \n"+
            " HMOVIALC.ot as Codigo_Orden_Trabajo, \n"+
            " Horden_trabajo.cnom_ot as  Orden_Trabajo, \n"+
            " HMOVIALC.cmoneda as Moneda, \n"+
            " HMOVIALC.n_orden as Numero_Orden, \n"+
            " HMOVIALC.motivo_traslado as  Motivo_Taslado, \n"+
            " HMOVIALC.lista_precios as Lista_Precios, \n"+
            " HMOVIALC.observacion as Observacio, \n"+
            " HMOVIALC.glosa as Glosa, \n"+
            " HMOVIALC.tipo_comprobante as Tipo_Comprobante, \n"+
            " HMOVIALC.numero_comprobante as Numero_Comprobante, \n"+
            " HMOVIALC.serie_comprobante as Serie_Comprobante, \n"+
            " CONVERT(VARCHAR,HMOVIALC.fecha_comp,103) as Fecha_Comprobante, \n"+
            " HMOVIALC.erp_codage as Agente, \n"+
            " (case HMOVIALC.contabilizada when 'S' then 'Contabilizada' else 'No Contabilizada' end) as Contabilizada, \n"+
            " HMOVIALC.serie_guia_prov as Guia_Provvedor, \n"+
            " HMOVIALC.nro_guia_prov as Numero_Guia_Proveedor, \n"+
            " HMOVIALC.serie_fac_prov as Factura_Pruveedor, \n"+
            " HMOVIALC.nro_fac_prov as Numero_Factura_Proveedor, \n"+
            " CONVERT(VARCHAR,HMOVIALC.fecha_emision,103) as Fecha_Emision, \n"+
            " HMOVIALC.atencion as Atencion, \n"+
            " HMOVIALC.porcentaje as Porcentaje, \n"+
            " HMOVIALC.tipdoc_ref_2 as Tipo_Referencia2, \n"+
            " HMOVIALC.motivo_ref_2 as Motivo_Serie_Referencia2, \n"+
            " HMOVIALC.nro_ref_2 as Numero_Referencia2, \n"+
            " HMOVIALC.porc_descuento as Descuento_Porcentaje, \n"+
            " HMOVIALC.si_igv as Si_Igv, \n"+
            " HMOVIALC.subtotal_sin_descuentos as Base_Calculada, \n"+
            " HMOVIALC.erp_Digv as Igv, \n"+
            " HMOVIALC.erp_Dsubtotal as Base_Imponible, \n"+
            " HMOVIALC.erp_Ddescuento as Descuento, \n"+
            " HMOVIALC.erp_Dimporte as Total, \n"+
            " HMOVIALC.erp_nro_exp as Numero_Expediente1, \n"+
            " HMOVIALC.erp_nro_exp2 as Numero_Expediente2,\n"+
            " HMOVIALC.usuario as Usuario, \n"+
            " HMOVIALC.Pc_User as Pc_User, \n"+
            " HMOVIALC.Pc_Fecha as Pc_Fecha, \n"+
            " HMOVIALC.Pc_Ip as Pc_Ip \n"+
            " from HMOVIALC \n"+
            " Inner Join htipdoc on \n"+
            " HMOVIALC.ccod_empresa = htipdoc.ccod_empresa \n"+
            " and HMOVIALC.ccod_movimiento = htipdoc.ctip_doc \n"+
            " inner join  HTRANSAL on \n"+
            " HMOVIALC.ccod_empresa = HTRANSAL.ccod_empresa \n"+
            " and HMOVIALC.ccod_transaccion = HTRANSAL.ccod_movimiento \n"+
            " inner join Hfor_pag on \n"+
            " HMOVIALC.ccod_empresa = Hfor_pag.ccod_empresa and \n"+
            " HMOVIALC.ccod_forpago = Hfor_pag.ccod_forpago \n"+
            " inner join Hperson on \n"+
            " HMOVIALC.ccod_empresa = Hperson.ccod_empresa and \n"+
            " HMOVIALC.ccod_responsable = Hperson.ccod_person \n"+
            " inner join Hcencos on \n"+
            " HMOVIALC.ccod_empresa = Hcencos.ccod_empresa \n"+
            " and HMOVIALC.ccod_cencos = Hcencos.ccod_cencos \n"+
            " inner join Horden_trabajo on \n"+
            " HMOVIALC.ccod_empresa = Horden_trabajo.ccod_empresa \n"+
            " and HMOVIALC.ot = Horden_trabajo.ccod_ot \n"+
            " inner join erp_unidad_negocio on \n"+
            " HMOVIALC.ccod_empresa = erp_unidad_negocio.erp_codemp \n"+
            " and HMOVIALC.erp_codune = erp_unidad_negocio.erp_codune \n"+
            " where HMOVIALC.ccod_empresa = @codigo_empresa \n"+
            " and HMOVIALC.modulo in ('GUIA_ENTRADA', 'INVENTARIO') \n"+
            " and HMOVIALC.atencion <> case @estado_atencion when 'Todos' then '' else 'Atendido' end  \n"+
            " and HMOVIALC.ccod_almacen = @codigo_punto_venta \n"+ 
            (agrupacion1_valores == "" ? "" : "and "+columnas[agrupacion1_tipo]+" in ("+agrupacion1_valores +") \n")+
            (agrupacion2_valores == "" ? "" : "and "+columnas[agrupacion2_tipo]+" in ("+agrupacion2_valores +") \n")+
            (agrupacion3_valores == "" ? "" : "and "+columnas[agrupacion3_tipo]+" in ("+agrupacion3_valores +") \n")+
            " and HMOVIALC.dfecha_doc between @fecha_inicio and @fecha_termino \n"+
            " order by \n"+
            (columnas[agrupacion1_tipo] ? columnas[agrupacion1_tipo] : "HMOVIALC.modulo") +", \n"+
            (columnas[agrupacion2_tipo] ? columnas[agrupacion2_tipo] : "HMOVIALC.dfecha_doc desc") +", \n"+
            (columnas[agrupacion3_tipo] ? columnas[agrupacion3_tipo] : "HMOVIALC.ccod_movimiento") +" \n";
        }else{
            query =
                
            "select \n"+
            "HMOVIALC.modulo as Modulo_Documento, \n"+
            "HMOVIALC.ccod_almacen as Punto_Venta, \n"+
            "HMOVIALC.ccod_movimiento as Codigo_Movimiento, \n"+
            "htipdoc.cnom_doc as Nombre_Movimiento, \n"+
            "(case HMOVIALC.modulo when 'INVENTARIO' then HTRANSAL.cnom_movimiento  else HMOVIALC.tipo_venta end) as Transaccion_Tipo, \n"+
            "HMOVIALC.cnum_serie as Serie, \n"+
            "HMOVIALC.cnum_doc as Numero, \n"+
            "HMOVIALC.ccod_proveedor as Codigo_Proveedor, \n"+
            "HMOVIALC.cnom_proveedor_c as Nombre_Provvedor, \n"+
            "HMOVIALC.ccod_cliente as Codigo_Cliente, \n"+
            "HMOVIALC.cnom_cliente_v as Nombre_Cliente, \n"+
            "CONVERT(VARCHAR,HMOVIALC.dfecha_doc,103) as Fecha, \n"+
            "HMOVIALC.nro_dias as Dias, \n"+
            "CONVERT(VARCHAR,HMOVIALC.dfecha_entr,103) as Fecha_Limite, \n"+
            "HMOVIALC.ccod_forpago as Codigo_Forma_Pago, \n"+
            "Hfor_pag.cnom_forpago as Forma_Pago, \n"+
            "HMOVIALC.ctip_docref as Tipo_Referencia, \n"+
            "HMOVIALC.cserie_docref as Motivo_Serie_Referencia, \n"+
            "HMOVIALC.cnum_docref as Numero_Referencia, \n"+
            "HMOVIALC.estado as Estado, \n"+
            "HMOVIALC.tipo_cambio as Tipo_Cambio, \n"+
            "HMOVIALC.desc_stock as Desc_Stock, \n"+
            "HMOVIALC.ccod_responsable as Codigo_Responsable, \n"+
            "(Hperson.ape_pat+' '+Hperson.ape_mat+' '+Hperson.nombres) as Nombre_Responsable, \n"+
            "HMOVIALC.erp_codune as Codigo_Unidad_Negocio, \n"+
            "erp_unidad_negocio.erp_nomune as Unidad_Negocio, \n"+
            "Hcencos.cnom_cencos as Centro_Costo, \n"+
            "HMOVIALC.ot as Codigo_Orden_Trabajo, \n"+
            "Horden_trabajo.cnom_ot as  Orden_Trabajo, \n"+
            "HMOVIALC.cmoneda as Moneda, \n"+
            "HMOVIALC.n_orden as Numero_Orden, \n"+
            "HMOVIALC.motivo_traslado as  Motivo_Taslado, \n"+
            "HMOVIALC.lista_precios as Lista_Precios, \n"+
            "HMOVIALC.observacion as Observacio, \n"+
            "HMOVIALC.glosa as Glosa, \n"+
            "HMOVIALC.tipo_comprobante as Tipo_Comprobante, \n"+
            "HMOVIALC.numero_comprobante as Numero_Comprobante, \n"+
            "HMOVIALC.serie_comprobante as Serie_Comprobante, \n"+
            "CONVERT(VARCHAR,HMOVIALC.fecha_comp,103) as Fecha_Comprobante, \n"+
            "HMOVIALC.erp_codage as Agente, \n"+
            "(case HMOVIALC.contabilizada when 'S' then 'Contabilizada' else 'No Contabilizada' end) as Contabilizada, \n"+
            "HMOVIALC.serie_guia_prov as Guia_Provvedor, \n"+
            "HMOVIALC.nro_guia_prov as Numero_Guia_Proveedor, \n"+
            "HMOVIALC.serie_fac_prov as Factura_Pruveedor, \n"+
            "HMOVIALC.nro_fac_prov as Numero_Factura_Proveedor, \n"+
            "CONVERT(VARCHAR,HMOVIALC.fecha_emision,103) as Fecha_Emision, \n"+
            "HMOVIALC.atencion as Atencion, \n"+
            "HMOVIALC.porcentaje as Porcentaje, \n"+
            "HMOVIALC.tipdoc_ref_2 as Tipo_Referencia2, \n"+
            "HMOVIALC.motivo_ref_2 as Motivo_Serie_Referencia2, \n"+
            "HMOVIALC.nro_ref_2 as Numero_Referencia2, \n"+
            "HMOVIALC.porc_descuento as Descuento_Porcentaje, \n"+
            "HMOVIALC.si_igv as Si_Igv, \n"+
            "HMOVIALC.subtotal_sin_descuentos as Base_Calculada, \n"+
            "HMOVIALC.erp_Digv as Igv, \n"+
            "HMOVIALC.erp_Dsubtotal as Base_Imponible, \n"+
            "HMOVIALC.erp_Ddescuento as Descuento, \n"+
            "HMOVIALC.erp_Dimporte as Total, \n"+
            "HMOVIALC.erp_nro_exp as Numero_Expediente, \n"+
            "HMOVIALC.usuario as Usuario, \n"+
            "HMOVIALC.Pc_User as Pc_User, \n"+
            "HMOVIALC.Pc_Fecha as Pc_Fecha, \n"+
            "HMOVIALC.Pc_Ip as Pc_Ip, \n"+
            "HMOVIALD.nitem as Item, \n"+
            "HMOVIALD.ccod_articulo as Codigo_Articulo, \n"+
            "HMOVIALD.cnom_articulo as Nombre_Articulo, \n"+
            "HMOVIALD.cunidad as Unidad, \n"+
            "HMOVIALD.ncantidad3 as Cantidad, \n"+
            "HMOVIALD.factor as Factor, \n"+
            "HMOVIALD.ncantidad as Cantidad_Kardex, \n"+
            "HMOVIALD.NPRECIO_TRANS as Unit, \n"+
            "HMOVIALD.codigo_presentacion as Codigo_Presentacion, \n"+
            "HMOVIALD.nombre_presentacion as Nombre_Presentacion, \n"+
            "HMOVIALD.cantidad_presentacion as Cantidad_Presentacion, \n"+
            "HMOVIALD.unidad_presentacion as Unidad_Presentacion, \n"+
            "HMOVIALD.precio_presentacion as Precio_Presentacion, \n"+
            "HMOVIALD.movimiento_origen as Documento_Referencia_Tipo, \n"+
            "HMOVIALD.serie_origen as Documento_Referencia_Motivo_Serie, \n"+
            "HMOVIALD.cnum_doc_guiaventa as Documento_Referencia_Numero, \n"+
            "HMOVIALD.erp_itemref as Documento_Referencia_Item, \n"+
            "'OC' as Documento_Referencia_OC, \n"+
            "HMOVIALD.idmotivo_compra as Documento_Referencia_Motivo_OC, \n"+
            "HMOVIALD.cnum_doc_ordc as Documento_Referencia_Numero_OC, \n"+
            "case HMOVIALD.idmotivo_compra when '' then '' else  HMOVIALD.origen_item end as Documento_Referencia_Item_OC, \n"+
            "'PED' as Documento_Referencia_PED, \n"+
            "HMOVIALD.motivo_pedido as Documento_Referencia_Motivo_PED, \n"+
            "HMOVIALD.doc_origen_pedido as Documento_Referencia_Numero_PED, \n"+
            "case HMOVIALD.motivo_pedido when '' then '' else  HMOVIALD.origen_item end as Documento_Referencia_Item_PED, \n"+
            "HMOVIALD.tipdoc_ref_2 as Documento_Referencia_Tipo_2, \n"+
            "HMOVIALD.motivo_ref_2 as Documento_Referencia_Motivo_2, \n"+
            "HMOVIALD.nro_ref_2 as Documento_Referencia_Numero_2, \n"+
            "HMOVIALD.erp_peso as Peso, \n"+
            "HMOVIALD.erp_largo as Largo, \n"+
            "HMOVIALD.erp_ancho as Ancho, \n"+
            "HMOVIALD.nigv as Igv_Articulo, \n"+
            "HMOVIALD.base_calculada as Detalle_Base_Calculada, \n"+
            "HMOVIALD.monto_descuento as Detalle_Descuento, \n"+
            "HMOVIALD.nbaseimpon as Detalle_Base_Imponible, \n"+
            "HMOVIALD.nigvcalc as Detalle_IGV, \n"+
            "HMOVIALD.nprecio_importe as Detalle_Importe \n"+
            "from HMOVIALC \n"+
            "inner join HMOVIALD on \n"+
            "HMOVIALC.ccod_empresa = HMOVIALD.CCOD_EMPRESA \n"+
            "AND HMOVIALC.ccod_almacen = HMOVIALD.ccod_almacen \n"+
            "AND HMOVIALC.ccod_movimiento = HMOVIALD.CCOD_MOVIMIENTO \n"+
            "AND HMOVIALC.ctip_movimiento = HMOVIALD.CTIP_MOVIMIENTO \n"+
            "AND HMOVIALC.cnum_serie = HMOVIALD.CNUM_SERIE \n"+
            "AND HMOVIALC.cnum_doc = HMOVIALD.cnum_doc \n"+
            "Inner Join htipdoc on \n"+
            "HMOVIALC.ccod_empresa = htipdoc.ccod_empresa \n"+
            "and HMOVIALC.ccod_movimiento = htipdoc.ctip_doc \n"+
            "inner join  HTRANSAL on \n"+
            "HMOVIALC.ccod_empresa = HTRANSAL.ccod_empresa \n"+
            "and HMOVIALC.ccod_transaccion = HTRANSAL.ccod_movimiento \n"+
            "inner join Hfor_pag on \n"+
            "HMOVIALC.ccod_empresa = Hfor_pag.ccod_empresa and \n"+
            "HMOVIALC.ccod_forpago = Hfor_pag.ccod_forpago \n"+
            "inner join Hperson on \n"+
            "HMOVIALC.ccod_empresa = Hperson.ccod_empresa and \n"+
            "HMOVIALC.ccod_responsable = Hperson.ccod_person \n"+
            "inner join Hcencos on \n"+
            "HMOVIALC.ccod_empresa = Hcencos.ccod_empresa \n"+
            "and HMOVIALC.ccod_cencos = Hcencos.ccod_cencos \n"+
            "inner join Horden_trabajo on \n"+
            "HMOVIALC.ccod_empresa = Horden_trabajo.ccod_empresa \n"+
            "and HMOVIALC.ot = Horden_trabajo.ccod_ot \n"+
            "inner join erp_unidad_negocio on \n"+
            "HMOVIALC.ccod_empresa = erp_unidad_negocio.erp_codemp \n"+
            "and HMOVIALC.erp_codune = erp_unidad_negocio.erp_codune \n"+
            "where  HMOVIALC.ccod_empresa = @codigo_empresa and HMOVIALC.modulo in ('GUIA_ENTRADA', 'INVENTARIO') \n"+
            "order by HMOVIALC.cnum_doc desc \n"
            " where HMOVIALC.ccod_empresa = @codigo_empresa \n"+
            " and HMOVIALC.modulo in ('GUIA_ENTRADA', 'INVENTARIO') \n"+
            " and HMOVIALC.atencion <> case @estado_atencion when 'Todos' then '' else 'Atendido' end  \n"+
            " and HMOVIALC.ccod_almacen = @codigo_punto_venta \n"+ 
            (agrupacion1_valores == "" ? "" : "and "+columnas[agrupacion1_tipo]+" in ("+agrupacion1_valores +") \n")+
            (agrupacion2_valores == "" ? "" : "and "+columnas[agrupacion2_tipo]+" in ("+agrupacion2_valores +") \n")+
            (agrupacion3_valores == "" ? "" : "and "+columnas[agrupacion3_tipo]+" in ("+agrupacion3_valores +") \n")+
            " and HMOVIALC.dfecha_doc between @fecha_inicio and @fecha_termino \n"+
            " order by \n"+
            (columnas[agrupacion1_tipo] ? columnas[agrupacion1_tipo] : "HMOVIALC.modulo") +", \n"+
            (columnas[agrupacion2_tipo] ? columnas[agrupacion2_tipo] : "HMOVIALC.dfecha_doc desc") +", \n"+
            (columnas[agrupacion3_tipo] ? columnas[agrupacion3_tipo] : "HMOVIALC.ccod_movimiento") +" \n";
            
        }
        const pool = await poolPromise;
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(10), codigo_punto_venta)
        .input('estado_atencion', mssql.VarChar(250), req.body.estado_atencion)
        .input('fecha_inicio', mssql.Date, req.body.fecha_inicio)
        .input('fecha_termino', mssql.Date, req.body.fecha_termino)
        .input('agrupacion1_tipo', mssql.VarChar(250), agrupacion1_tipo)
        .input('agrupacion2_tipo', mssql.VarChar(250), agrupacion2_tipo)
        .input('agrupacion3_tipo', mssql.VarChar(250), agrupacion3_tipo)
        .query(query);
    
        const recordset = lista.recordset;
        res.json(recordset);
    }catch(err){
        console.log(err.message);
        res.send(err.message);
    }
});

router.post('/productos', async (req, res) => {
    try{
        console.log(req.body);
        const codigo_empresa = req.user.codigo_empresa;
        
        var codigo_punto_venta = req.body.punto_venta;
         if (req.body.punto_venta == '') {
            codigo_punto_venta = req.user.codigo_punto_venta;
        }
        const codigo_almacen = req.body.almacen;
        const codigo_tipo_producto = req.body.tipo_producto;
        const fecha = req.body.fecha;
        const codigo_moneda = req.body.moneda;
        const codigo_tipo_stock = req.body.tipo_stock;

        const pool = await poolPromise;
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(10), codigo_punto_venta)
        .input('codigo_almacen', mssql.VarChar(250), codigo_almacen)
        .input('codigo_tipo_producto', mssql.VarChar(250), codigo_tipo_producto)
        .input('fecha', mssql.Date, fecha)
        .input('codigo_moneda', mssql.VarChar(250), codigo_moneda)
        .input('codigo_tipo_stock', mssql.VarChar(250), codigo_tipo_stock)
        .query("exec sq_rpt_listado_articulo2 @codigo_empresa, @codigo_punto_venta, @codigo_almacen, @codigo_tipo_producto, @fecha, @codigo_moneda, @codigo_tipo_stock");
    
        const recordset = lista.recordset;
        res.json(recordset);
    }catch(err){
        console.log(err.message);
        res.send(err.message);
    }
});

router.post('/productos_lote_serie', async (req, res) => {
    try{
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.body.punto_venta;
        const codigo_almacen = req.body.almacen;
        const codigo_tipo_producto = req.body.tipo_producto;
        const fecha = req.body.fecha;
        const tipo_lote_serie = req.body.tipo_lote_serie;
        const codigo_moneda = req.body.moneda;
        const codigo_tipo_stock = req.body.tipo_stock;

        const pool = await poolPromise;
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(10), codigo_punto_venta)
        .input('codigo_almacen', mssql.VarChar(250), codigo_almacen)
        .input('codigo_tipo_producto', mssql.VarChar(250), codigo_tipo_producto)
        .input('fecha', mssql.Date, fecha)
        .input('tipo', mssql.VarChar(250), tipo_lote_serie)
        .input('codigo_moneda', mssql.VarChar(250), codigo_moneda)
        .input('codigo_tipo_stock', mssql.VarChar(250), codigo_tipo_stock)
        .query("exec sq_rpt_listado_articulo_lote_serie_web @codigo_empresa, @codigo_punto_venta, @codigo_almacen, @codigo_tipo_producto, @fecha, @tipo, @codigo_moneda, @codigo_tipo_stock");
    
        const recordset = lista.recordset;
        res.json(recordset);
    }catch(err){
        console.log(err.message);
        res.send(err.message);
    }
});

router.post('/kardex', async (req, res) => {
    try{
        const codigo_empresa = req.user.codigo_empresa;
        const usuario = req.user.codigo_usuario;
        const codigo_punto_venta = req.body.punto_venta;
        const codigo_almacen = req.body.almacen;
        const codigo_tipo_producto = req.body.tipo_producto;
        const fecha = req.body.fecha;
        const codigo_moneda = req.body.moneda;
        const codigo_tipo_stock = req.body.tipo_stock;
        const fecha_inicio = req.body.fecha_inicio;
        const fecha_final = req.body.fecha_final;
        const productos = JSON.parse(req.body.productos);
        var codigo_random=codigo_empresa+"kardex"+usuario;
        if(productos.length>0){
            var query_hedu;
            query_hedu="delete from HEDU where CODIGO ='"+codigo_random+"'; insert into HEDU (CODIGO_ENTIDAD, CODIGO_ENTIDAD2,CODIGO) values "
            var pool = await poolPromise;
            for(var i=0; i<productos.length; i++){
                var producto = productos[i];
                query_hedu+="('"+producto+"','','"+codigo_random+"'),";

            }
            query_hedu = query_hedu.slice(0,-1);
            var lista = await pool
            .request()
            .query(query_hedu);
        }

        var pool = await poolPromise;
        var lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(10), codigo_punto_venta)
        .input('codigo_almacen', mssql.VarChar(250), codigo_almacen)
        .input('codigo_edu', mssql.VarChar(250), codigo_random)
        .input('codigo_moneda', mssql.VarChar(250), codigo_moneda)
        .input('anulado', mssql.VarChar(250), '')
        .input('fecha_inicio', mssql.Date, fecha_inicio)// '2020-10-01')
        .input('fecha_final', mssql.Date, fecha_final)//'2020-10-23')
        .query("exec sq_rpt_kardex_articulo3 @codigo_empresa, @codigo_punto_venta, @codigo_almacen, @codigo_edu, @codigo_moneda, @anulado, @fecha_inicio, @fecha_final");
    
        const recordset = lista.recordset;
        res.json(recordset);
    }catch(err){
        console.log(err.message);
        res.send(err.message);
    }
});

router.post('/kardex_lote_serie', async (req, res) => {
    try{
        const codigo_empresa = req.user.codigo_empresa;
        const usuario = req.user.codigo_usuario;
        const codigo_punto_venta = req.body.punto_venta;
        const codigo_almacen = req.body.almacen;
        const codigo_tipo_producto = req.body.tipo_producto;
        const fecha = req.body.fecha;
        const codigo_moneda = req.body.moneda;
        const codigo_tipo_stock = req.body.tipo_stock;
        const fecha_inicio = req.body.fecha_inicio;
        const fecha_final = req.body.fecha_final;
        const tipo_lote_serie = req.body.tipo_lote_serie;
        const productos = JSON.parse(req.body.productos);
        const lotes = JSON.parse(req.body.lotes);
        var codigo_random=codigo_empresa+"kardex_serie"+usuario;
        if(productos.length>0){
            var query_hedu;
            query_hedu="delete from HEDU where CODIGO ='"+codigo_random+"'; insert into HEDU (CODIGO_ENTIDAD, CODIGO_ENTIDAD2,CODIGO,FVCTO) values "
            var pool = await poolPromise;
            for(var i=0; i<productos.length; i++){
                var producto = productos[i];
                var lote = lotes[i];
                query_hedu+="('"+producto+"','"+lote+"','"+codigo_random+"','1900-01-01'),";

            }
            query_hedu = query_hedu.slice(0,-1);
            var lista = await pool
            .request()
            .query(query_hedu);
        }
        var pool = await poolPromise;
        var lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(10), codigo_punto_venta)
        .input('codigo_almacen', mssql.VarChar(250), codigo_almacen)
        .input('codigo_edu', mssql.VarChar(250), codigo_random)
        .input('lote', mssql.VarChar(250), '')
        .input('codigo_moneda', mssql.VarChar(250), codigo_moneda)
        .input('fecha_inicio', mssql.Date, fecha_inicio)// '2020-10-01')
        .input('anulado', mssql.VarChar(250), '')
        .input('fecha_final', mssql.Date, fecha_final)//'2020-10-23')
        .input('tipo', mssql.VarChar(250), tipo_lote_serie)
        .query("exec sq_rpt_kardex_articulo_lote_serie_web @codigo_empresa, @codigo_punto_venta, @codigo_almacen, @codigo_edu, @lote, @codigo_moneda, @fecha_inicio, @anulado, @fecha_final, @tipo");
    
        const recordset = lista.recordset;
        res.json(recordset);
    }catch(err){
        console.log(err.message);
        res.send(err.message);
    }
});
module.exports = router;