const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../../database');

router.post('/cotizacion/:tipo_reporte', async (req, res) => {
    try{
        const {tipo_reporte} = req.params;
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.body.punto_venta;
        var columnas = {
            responsable_aprobacion: "Hcotizac.ccod_empleado_aprueba",
            centro_costos: "Hcotizac.ccod_cencos",
            unidad_negocio: "Hcotizac.erp_codune",
            orden_trabajo: "Hcotizac.Codigo_Orden_Trabajo",
            motivos_tramite: "Hcotizac.idmotivo_venta",
            codigo_cliente: "Hcotizac.ccod_cliente",
            forma_pago_lista: "Hcotizac.ccod_forpago",
            articulos: "Hcotizad.ccod_articulo",
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
            "Hcotizac.punto_venta as Punto_Venta, \n"+
            "Hcotizac.idmotivo_venta as Codigo_Motivo, \n"+
            "erp_motivos_tramite.erp_nommot  as Nombre_Motivo, \n"+
            "Hcotizac.tipo as Tipo_Venta, \n"+
            "Hcotizac.cnum_doc as Numero_Documento, \n"+
            "Hcotizac.ccod_cliente as Codigo_Cliente, \n"+
            "Hcotizac.cnom_cliente_c as Nombre_Cliente, \n"+
            "CONVERT(VARCHAR,Hcotizac.dfecha_doc,103) as Fecha_Documento, \n"+
            "Hcotizac.dias as Dias, \n"+
            "CONVERT(VARCHAR,Hcotizac.dfecha_validez,103) as Fecha_Validez, \n"+
            "CONVERT(VARCHAR,Hcotizac.dfecha_entr,103) as Fecha_Entrega, \n"+
            "Hcotizac.ccod_forpago as Codigo_Forma_Pago, \n"+
            "Hfor_pag.cnom_forpago as Forma_Pago, \n"+
            "Hcotizac.email as Email, \n"+
            "Hcotizac.telefono as Telefono, \n"+
            "Hcotizac.fax as Fax, \n"+
            "Hcotizac.ccod_person as Codigo_Vendedor, \n"+
            "Vendedor_1.cnom_vendedor as Nombre_Vendedor, \n"+
            "Hcotizac.ccod_empleado_aprueba as Persona_Aprobacion, \n"+
            "(Aprobacion.ape_pat+' '+Aprobacion.ape_mat+' '+Aprobacion.nombres) as Nombre_Persona_Aprobacion, \n"+
            "Hcotizac.caprobado as Aprobado, \n"+
            " Hcotizac.dfecha_aprobacion as Fecha_Aprobacion, \n"+
            "Hcotizac.cobservacion_aprobacion as Observacion_Aprobacion, \n"+
            "Hcotizac.estado as Estado, \n"+
            "Hcotizac.tipocambio as Tipo_Cambio, \n"+
            "Hcotizac.pto_llegada as Punto_Llegada, \n"+
            "Hcotizac.cod_contacto as Codigo_Contacto, \n"+
            "Hcotizac.nom_contacto as Nombre_Contacto, \n"+
            "Hcotizac.erp_codune as Codigo_Unidad_Negocio, \n"+
            "erp_unidad_negocio.erp_nomune as Unidad_Negocio, \n"+
            "Hcotizac.ccod_cencos as Codigo_Centro_Costo, \n"+
            "Hcencos.cnom_cencos as Centro_Costo, \n"+
            "Hcotizac.ot as Codigo_Orden_Trabajo, \n"+
            "Horden_trabajo.cnom_ot as  Orden_Trabajo, \n"+
            "Hcotizac.cmoneda as Moneda, \n"+
            "Hcotizac.lista_precios as Lista_Precios, \n"+
            "Hcotizac.observacion as Observacion, \n"+
            "Hcotizac.glosa as Glosa, \n"+
            "Hcotizac.vendedor_2 as Vendedor2, \n"+
            "Vendedor_2.cnom_vendedor as Nombre_Vendedor_2, \n"+
            "(case Hcotizac.erp_codage when ''then '00' else  Hcotizac.erp_codage end) as Codigo_Agencia, \n"+
            "(case Hcotizac.erp_codage when '' then 'NINGUNO' else erp_agencia.erp_nomage end) as Nombre_Agencia, \n"+
            "Hcotizac.atencion as Atencion, \n"+
            "Hcotizac.porcentaje as Porcentaje, \n"+
            "Hcotizac.descuento as Descuento_Porcentaje, \n"+
            "Hcotizac.siigv as Si_Igv, \n"+
            "Hcotizac.subtotal_sin_descuentos as Base_Calculada, \n"+
            "Hcotizac.erp_Ddescuento as Descuento, \n"+
            "Hcotizac.erp_Dsubtotal as Base_Imponible, \n"+
            "Hcotizac.erp_Digv as Igv, \n"+
            "Hcotizac.erp_Dimporte as Total, \n"+
            "Hcotizac.erp_gestor as Codigo_Gestor, \n"+
            "erp_gestor_cobranza.erp_nomgestor as Nombre_Gestor, \n"+
            "Hcotizac.erp_nro_exp as Numero_Expediente1,\n"+
            "Hcotizac.erp_nro_exp2 as Numero_Expediente2,\n"+
            "Hcotizac.usuario as Usuario, \n"+
            "Hcotizac.Pc_User as Pc_User, \n"+
            "Hcotizac.Pc_Fecha as Pc_Fecha, \n"+
            "Hcotizac.Pc_Ip as Pc_Ip \n"+
            "from Hcotizac \n"+
            "inner join erp_motivos_tramite on \n"+
            "Hcotizac.ccod_empresa = erp_motivos_tramite.erp_codemp and \n"+
            "Hcotizac.idmotivo_venta = erp_motivos_tramite.erp_codmot \n"+
            "inner join Hfor_pag on \n"+
            "Hcotizac.ccod_empresa = Hfor_pag.ccod_empresa and \n"+
            "Hcotizac.ccod_forpago = Hfor_pag.ccod_forpago \n"+
            "inner join Hvended Vendedor_1 on \n"+
            "Hcotizac.ccod_empresa = Vendedor_1.ccod_empresa and \n"+
            "Hcotizac.ccod_person = Vendedor_1.ccod_vendedor \n"+
            "inner join Hvended Vendedor_2 on \n"+
            "Hcotizac.ccod_empresa = Vendedor_2.ccod_empresa and \n"+
            "Hcotizac.vendedor_2 = Vendedor_2.ccod_vendedor \n"+
            "inner join Hperson Aprobacion on \n"+
            "Hcotizac.ccod_empresa = Aprobacion.ccod_empresa and \n"+
            "Hcotizac.ccod_empleado_aprueba = Aprobacion.ccod_person \n"+
            "inner join Hcencos on \n"+
            "Hcotizac.ccod_empresa = Hcencos.ccod_empresa and \n"+
            "Hcotizac.ccod_cencos = Hcencos.ccod_cencos \n"+
            "inner join Horden_trabajo on \n"+
            "Hcotizac.ccod_empresa = Horden_trabajo.ccod_empresa  and \n"+
            "Hcotizac.ot = Horden_trabajo.ccod_ot \n"+
            "inner join erp_unidad_negocio on \n"+
            "Hcotizac.ccod_empresa = erp_unidad_negocio.erp_codemp  and \n"+
            "Hcotizac.erp_codune = erp_unidad_negocio.erp_codune \n"+
            "left join erp_agencia on \n"+
            "Hcotizac.ccod_empresa = erp_agencia.erp_codemp  and \n"+
            "Hcotizac.erp_codage = erp_agencia.erp_codage \n"+
            "inner join erp_gestor_cobranza on \n"+
            "Hcotizac.ccod_empresa = erp_gestor_cobranza.erp_codemp  and \n"+
            "Hcotizac.erp_gestor = erp_gestor_cobranza.erp_codgestor \n"+
            " where Hcotizac.ccod_empresa = @codigo_empresa \n"+
            " and Hcotizac.atencion <> case @estado_atencion when 'Todos' then '' else 'Atendido' end  \n"+
            " and Hcotizac.punto_venta = @codigo_punto_venta \n"+ 
            (agrupacion1_valores == "" ? "" : "and "+columnas[agrupacion1_tipo]+" in ("+agrupacion1_valores +") \n")+
            (agrupacion2_valores == "" ? "" : "and "+columnas[agrupacion2_tipo]+" in ("+agrupacion2_valores +") \n")+
            (agrupacion3_valores == "" ? "" : "and "+columnas[agrupacion3_tipo]+" in ("+agrupacion3_valores +") \n")+
            " and Hcotizac.dfecha_doc between @fecha_inicio and @fecha_termino \n"+
            " order by \n"+
            (columnas[agrupacion1_tipo] ? columnas[agrupacion1_tipo] : "Hcotizac.punto_venta") +", \n"+
            (columnas[agrupacion2_tipo] ? columnas[agrupacion2_tipo] : "Hcotizac.dfecha_doc desc") +", \n"+
            (columnas[agrupacion3_tipo] ? columnas[agrupacion3_tipo] : "Hcotizac.cnum_doc") +" \n";
        }else{
            query =
            "select   \n"+
            " Hcotizac.punto_venta as Punto_Venta, \n"+
            " Hcotizac.idmotivo_venta as Codigo_Motivo, \n"+
            " erp_motivos_tramite.erp_nommot  as Nombre_Motivo, \n"+
            " Hcotizac.tipo as Tipo_Venta, \n"+
            " Hcotizac.cnum_doc as Numero_Documento, \n"+
            " Hcotizac.ccod_cliente as Codigo_Cliente, \n"+
            " Hcotizac.cnom_cliente_c as Nombre_Cliente, \n"+
            " CONVERT(VARCHAR,Hcotizac.dfecha_doc,103) as Fecha_Documento, \n"+
            " Hcotizac.dias as Dias, \n"+
            " CONVERT(VARCHAR,Hcotizac.dfecha_validez,103) as Fecha_Validez, \n"+ 
            " CONVERT(VARCHAR,Hcotizac.dfecha_entr,103) as Fecha_Entrega, \n"+
            " Hcotizac.ccod_forpago as Codigo_Forma_Pago, \n"+
            " Hfor_pag.cnom_forpago as Forma_Pago, \n"+
            " Hcotizac.email as Email, \n"+
            " Hcotizac.telefono as Telefono, \n"+
            " Hcotizac.fax as Fax, \n"+
            " Hcotizac.ccod_person as Codigo_Vendedor, \n"+
            " Vendedor_1.cnom_vendedor as Nombre_Vendedor, \n"+
            " Hcotizac.ccod_empleado_aprueba as Persona_Aprobacion, \n"+
            " (Aprobacion.ape_pat+' '+Aprobacion.ape_mat+' '+Aprobacion.nombres) as Nombre_Persona_Aprobacion, \n"+
            " Hcotizac.caprobado as Aprobado, \n"+
            "  Hcotizac.dfecha_aprobacion as Fecha_Aprobacion, \n"+
            " Hcotizac.cobservacion_aprobacion as Observacion_Aprobacion, \n"+
            " Hcotizac.estado as Estado, \n"+
            " Hcotizac.tipocambio as Tipo_Cambio, \n"+
            " Hcotizac.pto_llegada as Punto_Llegada,    \n"+
            " Hcotizac.cod_contacto as Codigo_Contacto, \n"+
            " Hcotizac.nom_contacto as Nombre_Contacto, \n"+
            " Hcotizac.erp_codune as Codigo_Unidad_Negocio, \n"+
            " erp_unidad_negocio.erp_nomune as Unidad_Negocio, \n"+
            " Hcotizac.ccod_cencos as Codigo_Centro_Costo, \n"+
            " Hcencos.cnom_cencos as Centro_Costo, \n"+
            " Hcotizac.ot as Codigo_Orden_Trabajo, \n"+
            " Horden_trabajo.cnom_ot as  Orden_Trabajo, \n"+
            " Hcotizac.cmoneda as Moneda, \n"+
            " Hcotizac.lista_precios as Lista_Precios, \n"+
            " Hcotizac.observacion as Observacion, \n"+
            " Hcotizac.glosa as Glosa, \n"+
            " Hcotizac.vendedor_2 as Vendedor2, \n"+
            " Vendedor_2.cnom_vendedor as Nombre_Vendedor_2, \n"+
            " (case Hcotizac.erp_codage when ''then '00' else  Hcotizac.erp_codage end) as Codigo_Agencia, \n"+
            " (case Hcotizac.erp_codage when '' then 'NINGUNO' else erp_agencia.erp_nomage end) as Nombre_Agencia, \n"+
            " Hcotizac.atencion as Atencion, \n"+
            " Hcotizac.porcentaje as Porcentaje, \n"+
            " Hcotizac.descuento as Descuento_Porcentaje, \n"+
            " Hcotizac.siigv as Si_Igv, \n"+
            " Hcotizac.subtotal_sin_descuentos as Base_Calculada, \n"+
            " Hcotizac.erp_Ddescuento as Descuento, \n"+
            " Hcotizac.erp_Dsubtotal as Base_Imponible, \n"+
            " Hcotizac.erp_Digv as Igv, \n"+
            " Hcotizac.erp_Dimporte as Total, \n"+
            " Hcotizac.erp_gestor as Codigo_Gestor, \n"+
            " erp_gestor_cobranza.erp_nomgestor as Nombre_Gestor, \n"+
            " Hcotizac.erp_nro_exp as Numero_Expediente1,\n"+
            " Hcotizac.erp_nro_exp2 as Numero_Expediente2,\n"+
            " Hcotizac.usuario as Usuario, \n"+
            " Hcotizac.Pc_User as Pc_User, \n"+
            " Hcotizac.Pc_Fecha as Pc_Fecha, \n"+
            " Hcotizac.Pc_Ip as Pc_Ip, \n"+
            " Hcotizad.nitem as Item, \n"+
            " Hcotizad.ccod_articulo as Codigo_Articulo, \n"+
            " Hcotizad.cnom_articulo as Nombre_Articulo, \n"+
            " Hcotizad.cunidad as Unidad, \n"+
            " Hcotizad.igv_art as Igv_Articulo, \n"+
            " Hcotizad.ncantidad as Cantidad, \n"+
            " Hcotizad.factor as Factor, \n"+
            " Hcotizad.ncantidad3 as Cantidad_Kardex, \n"+
            " Hcotizad.nprecio as Unit, \n"+
            " Hcotizad.desc1 as Descuento1, \n"+
            " Hcotizad.desc2 as Descuento2, \n"+
            " Hcotizad.Desc3 as Descuento3, \n"+
            " Hcotizad.erp_desc4 as Descuento4, \n"+
            " Hcotizad.cantidad_presentacion as Cantidad_Presentacion, \n"+
            " Hcotizad.nombre_presentacion as Nombre_Presentacion, \n"+
            " Hcotizad.unidad_presentacion as unidad_presentacion, \n"+
            " Hcotizad.precio_presentacion as Precio_Presentacion, \n"+
            " Hcotizad.ccencos as Detalle_Centro_Costos, \n"+
            " Hcotizad.ot as Detalle_Orden_Trabajo, \n"+
            " Hcotizad.base_calculada as Detalle_Base_Calculada, \n"+
            " Hcotizad.monto_descuento as Detalle_Descuento, \n"+
            " Hcotizad.base_imp as Detalle_Base_Imponible, \n"+
            " Hcotizad.nigv as Detalle_IGV, \n"+
            " Hcotizad.nimporte as Detalle_Importe, \n"+
            " Hcotizad.erp_codune as Detalle_Unidad_Negocio, \n"+
            " Hcotizad.erp_codage as Detalle_Agencia\n"+
            " from Hcotizac\n"+
            " inner join Hcotizad on\n"+
            " Hcotizac.ccod_empresa = Hcotizad.ccod_empresa and  \n"+
            " Hcotizac.punto_venta = Hcotizad.erp_ptovta and\n"+
            " Hcotizac.idmotivo_venta = Hcotizad.idmotivo_venta and  \n"+
            " Hcotizac.cnum_doc = Hcotizad.cnum_doc \n"+
            " inner join erp_motivos_tramite on  \n"+
            " Hcotizac.ccod_empresa = erp_motivos_tramite.erp_codemp and  \n"+
            " Hcotizac.idmotivo_venta = erp_motivos_tramite.erp_codmot  \n"+
            " inner join Hfor_pag on  \n"+
            " Hcotizac.ccod_empresa = Hfor_pag.ccod_empresa and  \n"+
            " Hcotizac.ccod_forpago = Hfor_pag.ccod_forpago  \n"+
            " inner join Hvended Vendedor_1 on  \n"+
            " Hcotizac.ccod_empresa = Vendedor_1.ccod_empresa and  \n"+
            " Hcotizac.ccod_person = Vendedor_1.ccod_vendedor  \n"+
            " inner join Hvended Vendedor_2 on  \n"+
            " Hcotizac.ccod_empresa = Vendedor_2.ccod_empresa and  \n"+
            " Hcotizac.vendedor_2 = Vendedor_2.ccod_vendedor  \n"+
            " inner join Hperson Aprobacion on  \n"+
            " Hcotizac.ccod_empresa = Aprobacion.ccod_empresa and  \n"+
            " Hcotizac.ccod_empleado_aprueba = Aprobacion.ccod_person  \n"+
            " inner join Hcencos on  \n"+
            " Hcotizac.ccod_empresa = Hcencos.ccod_empresa and \n"+
            " Hcotizac.ccod_cencos = Hcencos.ccod_cencos  \n"+
            " inner join Horden_trabajo on  \n"+
            " Hcotizac.ccod_empresa = Horden_trabajo.ccod_empresa  and \n"+
            " Hcotizac.ot = Horden_trabajo.ccod_ot  \n"+
            " inner join erp_unidad_negocio on  \n"+
            " Hcotizac.ccod_empresa = erp_unidad_negocio.erp_codemp  and \n"+
            " Hcotizac.erp_codune = erp_unidad_negocio.erp_codune  \n"+
            " left join erp_agencia on  \n"+
            " Hcotizac.ccod_empresa = erp_agencia.erp_codemp  and \n"+
            " Hcotizac.erp_codage = erp_agencia.erp_codage  \n"+
            " inner join erp_gestor_cobranza on  \n"+
            " Hcotizac.ccod_empresa = erp_gestor_cobranza.erp_codemp  and \n"+
            " Hcotizac.erp_gestor = erp_gestor_cobranza.erp_codgestor  \n"+
            " where  Hcotizac.ccod_empresa = @codigo_empresa \n"+
            " order by Hcotizac.cnum_doc desc"
            " where Hcotizac.ccod_empresa = @codigo_empresa \n"+
            " and Hcotizac.atencion <> case @estado_atencion when 'Todos' then '' else 'Atendido' end  \n"+
            " and Hcotizac.punto_venta = @codigo_punto_venta \n"+ 
            (agrupacion1_valores == "" ? "" : "and "+columnas[agrupacion1_tipo]+" in ("+agrupacion1_valores +") \n")+
            (agrupacion2_valores == "" ? "" : "and "+columnas[agrupacion2_tipo]+" in ("+agrupacion2_valores +") \n")+
            (agrupacion3_valores == "" ? "" : "and "+columnas[agrupacion3_tipo]+" in ("+agrupacion3_valores +") \n")+
            " and Hcotizac.dfecha_doc between @fecha_inicio and @fecha_termino \n"+
            " order by \n"+
            (columnas[agrupacion1_tipo] ? columnas[agrupacion1_tipo] : "Hcotizac.punto_venta") +", \n"+
            (columnas[agrupacion2_tipo] ? columnas[agrupacion2_tipo] : "Hcotizac.dfecha_doc desc") +", \n"+
            (columnas[agrupacion3_tipo] ? columnas[agrupacion3_tipo] : "Hcotizac.cnum_doc") +" \n";
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

router.post('/pedido/:tipo_reporte', async (req, res) => {
    try{
        const {tipo_reporte} = req.params;
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.body.punto_venta;
        var columnas = {
            responsable_aprobacion: "Hpedidoc.responsable_aprobacion",
            centro_costos: "Hpedidoc.ccod_cencos",
            unidad_negocio: "Hpedidoc.erp_codune",
            orden_trabajo: "Hpedidoc.ot",
            motivos_tramite: "Hpedidoc.idmotivo_venta",
            codigo_cliente: "Hpedidoc.ccod_cliente",
            forma_pago_lista: "Hpedidoc.ccod_forpago",
            articulos: "Hpedidod.ccod_articulo",
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
            "Hpedidoc.ccod_almacen as Punto_Venta, \n"+
            "Hpedidoc.idmotivo_venta as Codigo_Motivo, \n"+
            "erp_motivos_tramite.erp_nommot  as Nombre_Motivo, \n"+
            "Hpedidoc.tipo_pedido as Tipo_Venta, \n"+
            "Hpedidoc.cnum_doc as Numero_Documento, \n"+
            "Hpedidoc.ccod_cliente as Codigo_Cliente, \n"+
            "Hpedidoc.cnom_cliente as Nombre_Cliente, \n"+
            "CONVERT(VARCHAR,Hpedidoc.dfecha_doc,103) as Fecha_Documento, \n"+
            "Hpedidoc.erp_dias as Dias, \n"+
            "CONVERT(VARCHAR,Hpedidoc.dfecha_val,103) as Fecha_Validez, \n"+
            "CONVERT(VARCHAR,Hpedidoc.dfecha_entr,103) as Fecha_Entrega, \n"+
            "Hpedidoc.ccod_forpago as Codigo_Forma_Pago, \n"+
            "Hfor_pag.cnom_forpago as Forma_Pago, \n"+
            "Hpedidoc.ccod_person as Codigo_Vendedor, \n"+
            "Vendedor_1.cnom_vendedor as Nombre_Vendedor, \n"+
            "Hpedidoc.cnum_docref as Numero_Documento_Referencia, \n"+
            "Hpedidoc.responsable_aprobacion as Persona_Aprobacion, \n"+
            "(Aprobacion.ape_pat+' '+Aprobacion.ape_mat+' '+Aprobacion.nombres) as Nombre_Persona_Aprobacion, \n"+
            "Hpedidoc.aprobado as Aprobado, \n"+
            "CONVERT(VARCHAR, Hpedidoc.fecha_aprobacion, 103) as Fecha_Aprobacion, \n"+
            "Hpedidoc.observacion_aprobacion as Observacion_Aprobacion, \n"+
            "Hpedidoc.estado as Estado, \n"+
            "Hpedidoc.tipo_cambio as Tipo_Cambio, \n"+
            "Hpedidoc.punto_partida as Punto_Partida, \n"+
            "Hpedidoc.lugar_entrega as Lugar_Entrega, \n"+
            "Hpedidoc.ccod_contacto as Codigo_Contacto, \n"+
            "Hpedidoc.nom_contacto as Nombre_Contacto, \n"+
            "Hpedidoc.motivo_traslado as Codigo_Motivo_Traslado, \n"+
            "Hmotivo_traslado.nombre_motivo as Motivo_Traslado, \n"+
            "Hpedidoc.erp_codune as Codigo_Unidad_Negocio, \n"+
            "erp_unidad_negocio.erp_nomune as Unidad_Negocio, \n"+
            "Hpedidoc.ccod_cencos as Codigo_Centro_Costo, \n"+
            "Hcencos.cnom_cencos as Centro_Costo, \n"+
            "Hpedidoc.Ot as Codigo_Orden_Trabajo, \n"+
            "Horden_trabajo.cnom_ot as  Orden_Trabajo, \n"+
            "Hpedidoc.cmoneda as Moneda, \n"+
            "Hpedidoc.lista_precios as Lista_Precios, \n"+
            "Hpedidoc.observacion as Observacion, \n"+
            "Hpedidoc.erp_glosa as Glosa, \n"+
            "Hpedidoc.idvendedor2 as Vendedor2, \n"+
            "Vendedor_2.cnom_vendedor as Nombre_Vendedor_2, \n"+
            "(case Hpedidoc.erp_codage when ''then '00' else  Hpedidoc.erp_codage end) as Codigo_Agencia, \n"+
            "(case Hpedidoc.erp_codage when '' then 'NINGUNO' else erp_agencia.erp_nomage end) as Nombre_Agencia, \n"+
            "Hpedidoc.atencion as Atencion, \n"+
            "Hpedidoc.porcentaje as Porcentaje, \n"+
            "Hpedidoc.Atencion_Prod as Atencion_Producto, \n"+
            "Hpedidoc.porcentaje_prod as Porcentaje_Producto, \n"+
            "Hpedidoc.dscto as Descuento_Porcentaje, \n"+
            "Hpedidoc.si_igv as Si_Igv, \n"+
            "Hpedidoc.subtotal_sin_descuentos as Base_Calculada, \n"+
            "Hpedidoc.erp_Ddescuento as Descuento, \n"+
            "Hpedidoc.erp_Dsubtotal as Base_Imponible, \n"+
            "Hpedidoc.erp_Digv as Igv, \n"+
            "Hpedidoc.erp_Dimporte as Total, \n"+
            "Hpedidoc.erp_gestor as Codigo_Gestor, \n"+
            "erp_gestor_cobranza.erp_nomgestor as Nombre_Gestor, \n"+
            "Hpedidoc.ccod_transportista as Codigo_Transportista, \n"+
            "Htransp.cnom_transportista as Nombre_Transportista, \n"+
            "Hpedidoc.ccod_vehiculo as Codigo_Vehiculo, \n"+
            "Hvehiculo.placa1 as Nombre_Vehiculo, \n"+
            "Hpedidoc.erp_nro_exp as Numero_Expediente1,\n"+
            "Hpedidoc.erp_nro_exp2 as Numero_Expediente2,\n"+
            "Hpedidoc.usuario as Usuario, \n"+
            "Hpedidoc.Pc_User as Pc_User, \n"+
            "Hpedidoc.Pc_Fecha as Pc_Fecha, \n"+
            "Hpedidoc.Pc_Ip as Pc_Ip \n"+
            "from Hpedidoc \n"+
            "inner join erp_motivos_tramite on \n"+
            "Hpedidoc.ccod_empresa = erp_motivos_tramite.erp_codemp and \n"+
            "Hpedidoc.idmotivo_venta = erp_motivos_tramite.erp_codmot \n"+
            "inner join Hfor_pag on \n"+
            "Hpedidoc.ccod_empresa = Hfor_pag.ccod_empresa and \n"+
            "Hpedidoc.ccod_forpago = Hfor_pag.ccod_forpago \n"+
            "inner join Hvended Vendedor_1 on \n"+
            "Hpedidoc.ccod_empresa = Vendedor_1.ccod_empresa and \n"+
            "Hpedidoc.ccod_person = Vendedor_1.ccod_vendedor \n"+
            "inner join Hvended Vendedor_2 on \n"+
            "Hpedidoc.ccod_empresa = Vendedor_2.ccod_empresa and \n"+
            "Hpedidoc.idvendedor2 = Vendedor_2.ccod_vendedor \n"+
            "inner join Hperson Aprobacion on \n"+
            "Hpedidoc.ccod_empresa = Aprobacion.ccod_empresa and \n"+
            "Hpedidoc.responsable_aprobacion = Aprobacion.ccod_person \n"+
            "inner join Hcencos on \n"+
            "Hpedidoc.ccod_empresa = Hcencos.ccod_empresa and \n"+
            "Hpedidoc.ccod_cencos = Hcencos.ccod_cencos \n"+
            "inner join Horden_trabajo on \n"+
            "Hpedidoc.ccod_empresa = Horden_trabajo.ccod_empresa  and \n"+
            "Hpedidoc.ot = Horden_trabajo.ccod_ot \n"+
            "inner join erp_unidad_negocio on \n"+
            "Hpedidoc.ccod_empresa = erp_unidad_negocio.erp_codemp  and \n"+
            "Hpedidoc.erp_codune = erp_unidad_negocio.erp_codune \n"+
            "left join erp_agencia on \n"+
            "Hpedidoc.ccod_empresa = erp_agencia.erp_codemp  and \n"+
            "Hpedidoc.erp_codage = erp_agencia.erp_codage \n"+
            "inner join erp_gestor_cobranza on \n"+
            "Hpedidoc.ccod_empresa = erp_gestor_cobranza.erp_codemp  and \n"+
            "Hpedidoc.erp_gestor = erp_gestor_cobranza.erp_codgestor \n"+
            "inner join Hmotivo_traslado on \n"+
            "Hpedidoc.ccod_empresa = Hmotivo_traslado.ccod_empresa  and \n"+
            "Hpedidoc.motivo_traslado = Hmotivo_traslado.ccod_motivo \n"+
            "inner join Htransp on \n"+
            "Hpedidoc.ccod_empresa = Htransp.ccod_empresa  and \n"+
            "Hpedidoc.ccod_transportista = Htransp.ccod_transportista \n"+
            "inner join Hvehiculo on \n"+
            "Hpedidoc.ccod_empresa = Hvehiculo.ccod_empresa  and \n"+
            "Hpedidoc.ccod_vehiculo = Hvehiculo.ccod_vehiculo \n"+
            " where Hpedidoc.ccod_empresa = @codigo_empresa \n"+
            " and Hpedidoc.atencion <> case @estado_atencion when 'Todos' then '' else 'Atendido' end  \n"+
            " and Hpedidoc.ccod_almacen = @codigo_punto_venta \n"+ 
            (agrupacion1_valores == "" ? "" : "and "+columnas[agrupacion1_tipo]+" in ("+agrupacion1_valores +") \n")+
            (agrupacion2_valores == "" ? "" : "and "+columnas[agrupacion2_tipo]+" in ("+agrupacion2_valores +") \n")+
            (agrupacion3_valores == "" ? "" : "and "+columnas[agrupacion3_tipo]+" in ("+agrupacion3_valores +") \n")+
            " and Hpedidoc.dfecha_doc between @fecha_inicio and @fecha_termino \n"+
            " order by \n"+
            (columnas[agrupacion1_tipo] ? columnas[agrupacion1_tipo] : "Hpedidoc.ccod_almacen") +", \n"+
            (columnas[agrupacion2_tipo] ? columnas[agrupacion2_tipo] : "Hpedidoc.dfecha_doc desc") +", \n"+
            (columnas[agrupacion3_tipo] ? columnas[agrupacion3_tipo] : "Hpedidoc.cnum_doc") +" \n";
        }else{
            query =

            "select \n"+
            "Hpedidoc.ccod_almacen as Punto_Venta, \n"+
            "Hpedidoc.idmotivo_venta as Codigo_Motivo, \n"+
            "erp_motivos_tramite.erp_nommot  as Nombre_Motivo, \n"+
            "Hpedidoc.tipo_pedido as Tipo_Venta, \n"+
            "Hpedidoc.cnum_doc as Numero_Documento, \n"+
            "Hpedidoc.ccod_cliente as Codigo_Cliente, \n"+
            "Hpedidoc.cnom_cliente as Nombre_Cliente, \n"+
            "CONVERT(VARCHAR,Hpedidoc.dfecha_doc,103) as Fecha_Documento, \n"+
            "Hpedidoc.erp_dias as Dias, \n"+
            "CONVERT(VARCHAR,Hpedidoc.dfecha_val,103) as Fecha_Validez, \n"+
            "CONVERT(VARCHAR,Hpedidoc.dfecha_entr,103) as Fecha_Entrega, \n"+
            "Hpedidoc.ccod_forpago as Codigo_Forma_Pago, \n"+
            "Hfor_pag.cnom_forpago as Forma_Pago, \n"+
            "Hpedidoc.ccod_person as Codigo_Vendedor, \n"+
            "Vendedor_1.cnom_vendedor as Nombre_Vendedor, \n"+
            "Hpedidoc.cnum_docref as Numero_Documento_Referencia, \n"+
            "Hpedidoc.responsable_aprobacion as Persona_Aprobacion, \n"+
            "(Aprobacion.ape_pat+' '+Aprobacion.ape_mat+' '+Aprobacion.nombres) as Nombre_Persona_Aprobacion, \n"+
            "Hpedidoc.aprobado as Aprobado, \n"+
            "CONVERT(VARCHAR, Hpedidoc.fecha_aprobacion, 103) as Fecha_Aprobacion, \n"+
            "Hpedidoc.observacion_aprobacion as Observacion_Aprobacion, \n"+
            "Hpedidoc.estado as Estado, \n"+
            "Hpedidoc.tipo_cambio as Tipo_Cambio, \n"+
            "Hpedidoc.punto_partida as Punto_Partida, \n"+
            "Hpedidoc.lugar_entrega as Lugar_Entrega, \n"+
            "Hpedidoc.ccod_contacto as Codigo_Contacto, \n"+
            "Hpedidoc.nom_contacto as Nombre_Contacto, \n"+
            "Hpedidoc.motivo_traslado as Codigo_Motivo_Traslado, \n"+
            "Hmotivo_traslado.nombre_motivo as Motivo_Traslado, \n"+
            "Hpedidoc.erp_codune as Codigo_Unidad_Negocio, \n"+
            "erp_unidad_negocio.erp_nomune as Unidad_Negocio, \n"+
            "Hpedidoc.ccod_cencos as Codigo_Centro_Costo, \n"+
            "Hcencos.cnom_cencos as Centro_Costo, \n"+
            "Hpedidoc.Ot as Codigo_Orden_Trabajo, \n"+
            "Horden_trabajo.cnom_ot as  Orden_Trabajo, \n"+
            "Hpedidoc.cmoneda as Moneda, \n"+
            "Hpedidoc.lista_precios as Lista_Precios, \n"+
            "Hpedidoc.observacion as Observacion, \n"+
            "Hpedidoc.erp_glosa as Glosa, \n"+
            "Hpedidoc.idvendedor2 as Vendedor2, \n"+
            "Vendedor_2.cnom_vendedor as Nombre_Vendedor_2, \n"+
            "(case Hpedidoc.erp_codage when ''then '00' else  Hpedidoc.erp_codage end) as Codigo_Agencia, \n"+
            "(case Hpedidoc.erp_codage when '' then 'NINGUNO' else erp_agencia.erp_nomage end) as Nombre_Agencia, \n"+
            "Hpedidoc.atencion as Atencion, \n"+
            "Hpedidoc.porcentaje as Porcentaje, \n"+
            "Hpedidoc.Atencion_Prod as Atencion_Producto, \n"+
            "Hpedidoc.porcentaje_prod as Porcentaje_Producto, \n"+
            "Hpedidoc.dscto as Descuento_Porcentaje, \n"+
            "Hpedidoc.si_igv as Si_Igv, \n"+
            "Hpedidoc.subtotal_sin_descuentos as Base_Calculada, \n"+
            "Hpedidoc.erp_Ddescuento as Descuento, \n"+
            "Hpedidoc.erp_Dsubtotal as Base_Imponible, \n"+
            "Hpedidoc.erp_Digv as Igv, \n"+
            "Hpedidoc.erp_Dimporte as Total, \n"+
            "Hpedidoc.erp_gestor as Codigo_Gestor, \n"+
            "erp_gestor_cobranza.erp_nomgestor as Nombre_Gestor, \n"+
            "Hpedidoc.ccod_transportista as Codigo_Transportista, \n"+
            "Htransp.cnom_transportista as Nombre_Transportista, \n"+
            "Hpedidoc.ccod_vehiculo as Codigo_Vehiculo, \n"+
            "Hvehiculo.placa1 as Nombre_Vehiculo, \n"+
            "Hpedidoc.erp_nro_exp as Numero_Expediente1,\n"+
            "Hpedidoc.erp_nro_exp2 as Numero_Expediente2,\n"+
            "Hpedidoc.usuario as Usuario, \n"+
            "Hpedidoc.Pc_User as Pc_User, \n"+
            "Hpedidoc.Pc_Fecha as Pc_Fecha, \n"+
            "Hpedidoc.Pc_Ip as Pc_Ip, \n"+
            "Hpedidod.nitem as Item, \n"+
            "Hpedidod.ccod_articulo as Codigo_Articulo, \n"+
            "Hpedidod.cnom_articulo as Nombre_Articulo, \n"+
            "Hpedidod.cunidad as Unidad, \n"+
            "Hpedidod.ncantidad3 as Cantidad, \n"+
            "Hpedidod.factor as Factor, \n"+
            "Hpedidod.ncantidad as Cantidad_Kardex, \n"+
            "Hpedidod.nprecio as Unit, \n"+
            "Hpedidod.porc_descuento as Descuento1, \n"+
            "Hpedidod.desc2 as Descuento2, \n"+
            "Hpedidod.desc3 as Descuento3, \n"+
            "Hpedidod.erp_desc4 as Descuento4, \n"+
            "Hpedidod.bserie as Serie_SN, \n"+
            "Hpedidod.cnro_serie as Serie_Numero, \n"+
            "Hpedidod.blote as Lote_SN, \n"+
            "Hpedidod.cnro_lote as Lote_Numero, \n"+
            "case Hpedidod.blote when 'N' then '' else CONVERT(VARCHAR,Hpedidod.vcto,103) end as Lote_Vencimiento, \n"+
            "Hpedidod.codigo_presentacion as Codigo_Presentacion, \n"+
            "Hpedidod.nombre_presentacion as Nombre_Presentacion, \n"+
            "Hpedidod.cantidad_presentacion as Cantidad_Presentacion, \n"+
            "Hpedidod.unidad_presentacion as Unidad_Presentacion, \n"+
            "Hpedidod.precio_presentacion as Precio_Presentacion, \n"+
            "'COT' as Documento_Referencia_Cotizacion, \n"+
            "Hpedidod.ptovta_cotizacion as Documento_Referencia_Punto_Venta_Cotizacion, \n"+
            "Hpedidod.idmotivo_cotizacion as Documento_Referencia_Motivo_Serie_Cotizacion, \n"+
            "Hpedidod.numero_cotizacion as Documento_Referencia_Numero_Cotizacion, \n"+
            "Hpedidod.nitem_ref as Documento_Referencia_Item_Cotizacion, \n"+
            "Hpedidod.erp_peso as Peso, \n"+
            "Hpedidod.largo as Largo, \n"+
            "Hpedidod.ancho as Ancho, \n"+
            "Hpedidod.nigv as Igv_Articulo, \n"+
            "Hpedidod.base_calculada as Detalle_Base_Calculada, \n"+
            "Hpedidod.monto_descuento as Detalle_Descuento, \n"+
            "Hpedidod.base_imp as Detalle_Base_Imponible, \n"+
            "Hpedidod.nigv as Detalle_IGV, \n"+
            "Hpedidod.nimporte as Detalle_Importe \n"+
            "from Hpedidoc \n"+
            "inner join Hpedidod on \n"+
            "Hpedidoc.ccod_empresa = Hpedidod.ccod_empresa \n"+
            "and Hpedidoc.ccod_almacen = Hpedidod.ccod_almacen \n"+
            "and Hpedidoc.idmotivo_venta = Hpedidod.idmotivo_venta \n"+
            "and Hpedidoc.cnum_doc = Hpedidod.cnum_doc \n"+
            "inner join erp_motivos_tramite on \n"+
            "Hpedidoc.ccod_empresa = erp_motivos_tramite.erp_codemp and \n"+
            "Hpedidoc.idmotivo_venta = erp_motivos_tramite.erp_codmot \n"+
            "inner join Hfor_pag on \n"+
            "Hpedidoc.ccod_empresa = Hfor_pag.ccod_empresa and \n"+
            "Hpedidoc.ccod_forpago = Hfor_pag.ccod_forpago \n"+
            "inner join Hvended Vendedor_1 on \n"+
            "Hpedidoc.ccod_empresa = Vendedor_1.ccod_empresa and \n"+
            "Hpedidoc.ccod_person = Vendedor_1.ccod_vendedor \n"+
            "inner join Hvended Vendedor_2 on \n"+
            "Hpedidoc.ccod_empresa = Vendedor_2.ccod_empresa and \n"+
            "Hpedidoc.idvendedor2 = Vendedor_2.ccod_vendedor \n"+
            "inner join Hperson Aprobacion on \n"+
            "Hpedidoc.ccod_empresa = Aprobacion.ccod_empresa and \n"+
            "Hpedidoc.responsable_aprobacion = Aprobacion.ccod_person \n"+
            "inner join Hcencos on \n"+
            "Hpedidoc.ccod_empresa = Hcencos.ccod_empresa and \n"+
            "Hpedidoc.ccod_cencos = Hcencos.ccod_cencos \n"+
            "inner join Horden_trabajo on \n"+
            "Hpedidoc.ccod_empresa = Horden_trabajo.ccod_empresa  and \n"+
            "Hpedidoc.ot = Horden_trabajo.ccod_ot \n"+
            "inner join erp_unidad_negocio on \n"+
            "Hpedidoc.ccod_empresa = erp_unidad_negocio.erp_codemp  and \n"+
            "Hpedidoc.erp_codune = erp_unidad_negocio.erp_codune \n"+
            "left join erp_agencia on \n"+
            "Hpedidoc.ccod_empresa = erp_agencia.erp_codemp  and \n"+
            "Hpedidoc.erp_codage = erp_agencia.erp_codage \n"+
            "inner join erp_gestor_cobranza on \n"+
            "Hpedidoc.ccod_empresa = erp_gestor_cobranza.erp_codemp  and \n"+
            "Hpedidoc.erp_gestor = erp_gestor_cobranza.erp_codgestor \n"+
            "inner join Hmotivo_traslado on \n"+
            "Hpedidoc.ccod_empresa = Hmotivo_traslado.ccod_empresa  and \n"+
            "Hpedidoc.motivo_traslado = Hmotivo_traslado.ccod_motivo \n"+
            "inner join Htransp on \n"+
            "Hpedidoc.ccod_empresa = Htransp.ccod_empresa  and \n"+
            "Hpedidoc.ccod_transportista = Htransp.ccod_transportista \n"+
            "inner join Hvehiculo on \n"+
            "Hpedidoc.ccod_empresa = Hvehiculo.ccod_empresa  and \n"+
            "Hpedidoc.ccod_vehiculo = Hvehiculo.ccod_vehiculo \n"+
            " where Hpedidoc.ccod_empresa = @codigo_empresa \n"+
            " and Hpedidoc.atencion <> case @estado_atencion when 'Todos' then '' else 'Atendido' end  \n"+
            " and Hpedidoc.ccod_almacen = @codigo_punto_venta \n"+ 
            (agrupacion1_valores == "" ? "" : "and "+columnas[agrupacion1_tipo]+" in ("+agrupacion1_valores +") \n")+
            (agrupacion2_valores == "" ? "" : "and "+columnas[agrupacion2_tipo]+" in ("+agrupacion2_valores +") \n")+
            (agrupacion3_valores == "" ? "" : "and "+columnas[agrupacion3_tipo]+" in ("+agrupacion3_valores +") \n")+
            " and Hpedidoc.dfecha_doc between @fecha_inicio and @fecha_termino \n"+
            " order by \n"+
            (columnas[agrupacion1_tipo] ? columnas[agrupacion1_tipo] : "Hpedidoc.ccod_almacen") +", \n"+
            (columnas[agrupacion2_tipo] ? columnas[agrupacion2_tipo] : "Hpedidoc.dfecha_doc desc") +", \n"+
            (columnas[agrupacion3_tipo] ? columnas[agrupacion3_tipo] : "Hpedidoc.cnum_doc") +" \n";
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

router.post('/guia/:tipo_reporte', async (req, res) => {
    try{
        const {tipo_reporte} = req.params;
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.body.punto_venta;
        var columnas = {
            centro_costos: "HMOVIALC.ccod_cencos",
            unidad_negocio: "HMOVIALC.erp_codune",
            orden_trabajo: "HMOVIALC.ot",
            serie_documento: "HMOVIALC.cnum_serie",
            codigo_cliente: "HMOVIALC.ccod_cliente",
            forma_pago_lista: "HMOVIALC.ccod_forpago",
            articulos: "HMOVIALD.ccod_articulo",
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
            "HMOVIALC.ccod_almacen as Punto_Venta, \n"+
            "HMOVIALC.tipo_venta as Tipo_Venta, \n"+
            "HMOVIALC.cnum_serie as Serie_Documento, \n"+
            "HMOVIALC.cnum_doc as Numero_Documento, \n"+
            "HMOVIALC.ccod_cliente as Codigo_Cliente, \n"+
            "HMOVIALC.cnom_cliente_v as Nombre_Cliente, \n"+
            "CONVERT(VARCHAR,HMOVIALC.dfecha_doc,103) as Fecha_Documento, \n"+
            "HMOVIALC.nro_dias as Dias, \n"+
            "CONVERT(VARCHAR,HMOVIALC.dfecha_val,103) as Fecha_Validez, \n"+
            "CONVERT(VARCHAR,HMOVIALC.dfecha_entr,103) as Fecha_Entrega, \n"+
            "HMOVIALC.ccod_forpago as Codigo_Forma_Pago, \n"+
            "Hfor_pag.cnom_forpago as Forma_Pago, \n"+
            "case HMOVIALC.ctip_docref when '00' then '' else HMOVIALC.ctip_docref end as Codigo_Tipo_Referencia, \n"+
            "case HMOVIALC.ctip_docref when '00' then '' else tipo_documento_referencia.cnom_doc end as Nombre_Tipo_Referencia, \n"+
            "HMOVIALC.cserie_docref as Motivo_Serie_Referencia, \n"+
            "HMOVIALC.cnum_docref as Numero_Referencia, \n"+
            "case HMOVIALC.tipo_comprobante when '00' then '' else HMOVIALC.tipo_comprobante end as Codigo_Tipo_Comprobante, \n"+
            "case HMOVIALC.tipo_comprobante when '00' then '' else tipo_documento_comprobante.cnom_doc end as Nombre_Tipo_Comprobante, \n"+
            "HMOVIALC.numero_comprobante as Numero_Comprobante, \n"+
            "HMOVIALC.serie_comprobante as Serie_Comprobante, \n"+
            "CONVERT(VARCHAR,HMOVIALC.fecha_comp,103) as Fecha_Comprobante, \n"+
            "HMOVIALC.estado as Estado, \n"+
            "HMOVIALC.tipo_cambio as Tipo_Cambio, \n"+
            "HMOVIALC.desc_stock as Desc_Stock, \n"+
            "HMOVIALC.ccod_vendedor as Codigo_Vendedor, \n"+
            "Hvended.cnom_vendedor as Nombre_Vendedor, \n"+
            "HMOVIALC.erp_codune as Codigo_Unidad_Negocio, \n"+
            "erp_unidad_negocio.erp_nomune as Unidad_Negocio, \n"+
            "HMOVIALC.ccod_cencos as Codigo_Centro_Costo, \n"+
            "Hcencos.cnom_cencos as Centro_Costo, \n"+
            "HMOVIALC.ot as Codigo_Orden_Trabajo, \n"+
            "Horden_trabajo.cnom_ot as  Nombre_Orden_Trabajo, \n"+
            "HMOVIALC.cmoneda as Moneda, \n"+
            "HMOVIALC.n_orden as Numero_Orden, \n"+
            "HMOVIALC.erp_nro_exp as Numero_Expediente1,\n"+
            "HMOVIALC.erp_nro_exp2 as Numero_Expediente2,\n"+
            "HMOVIALC.motivo_traslado as  Codigo_Motivo_Taslado, \n"+
            "Hmotivo_traslado.nombre_motivo as  Nombre_Motivo_Taslado, \n"+
            "HMOVIALC.lista_precios as Lista_Precios, \n"+
            "HMOVIALC.observacion as Observacion, \n"+
            "HMOVIALC.glosa as Glosa, \n"+
            "HMOVIALC.erp_codage as Agente, \n"+
            "HMOVIALC.atencion as Atencion, \n"+
            "HMOVIALC.porcentaje as Porcentaje, \n"+
            "HMOVIALC.porc_descuento as Descuento_Porcentaje, \n"+
            "HMOVIALC.si_igv as Si_Igv, \n"+
            "HMOVIALC.subtotal_sin_descuentos as Base_Calculada, \n"+
            "HMOVIALC.erp_Ddescuento as Descuento, \n"+
            "HMOVIALC.erp_Dsubtotal as Base_Imponible, \n"+
            "HMOVIALC.erp_Digv as Igv, \n"+
            "HMOVIALC.erp_Dimporte as Total, \n"+
            "HMOVIALC.usuario as Usuario, \n"+
            "HMOVIALC.Pc_User as Pc_User, \n"+
            "HMOVIALC.Pc_Fecha as Pc_Fecha, \n"+
            "HMOVIALC.Pc_Ip as Pc_Ip \n"+
            "from HMOVIALC \n"+
            "inner Join htipdoc as tipo_documento on \n"+
            "HMOVIALC.ccod_empresa = tipo_documento.ccod_empresa \n"+
            "and HMOVIALC.ccod_movimiento = tipo_documento.ctip_doc \n"+
            "left Join htipdoc as tipo_documento_referencia on \n"+
            "HMOVIALC.ccod_empresa = tipo_documento_referencia.ccod_empresa \n"+
            "and HMOVIALC.ctip_docref = tipo_documento_referencia.ctip_doc \n"+
            "left Join htipdoc as tipo_documento_comprobante on \n"+
            "HMOVIALC.ccod_empresa = tipo_documento_comprobante.ccod_empresa \n"+
            "and HMOVIALC.tipo_comprobante = tipo_documento_comprobante.ctip_doc \n"+
            "inner join Hfor_pag on \n"+
            "HMOVIALC.ccod_empresa = Hfor_pag.ccod_empresa and \n"+
            "HMOVIALC.ccod_forpago = Hfor_pag.ccod_forpago \n"+
            "inner join hvended on \n"+
            "HMOVIALC.ccod_empresa = hvended.ccod_empresa and \n"+
            "HMOVIALC.ccod_vendedor = hvended.ccod_vendedor \n"+
            "inner join Hcencos on \n"+
            "HMOVIALC.ccod_empresa = Hcencos.ccod_empresa \n"+
            "and HMOVIALC.ccod_cencos = Hcencos.ccod_cencos \n"+
            "inner join Horden_trabajo on \n"+
            "HMOVIALC.ccod_empresa = Horden_trabajo.ccod_empresa \n"+
            "and HMOVIALC.ot = Horden_trabajo.ccod_ot \n"+
            "inner join erp_unidad_negocio on \n"+
            "HMOVIALC.ccod_empresa = erp_unidad_negocio.erp_codemp \n"+
            "and HMOVIALC.erp_codune = erp_unidad_negocio.erp_codune \n"+
            "inner join Hmotivo_traslado on \n"+
            "HMOVIALC.ccod_empresa = Hmotivo_traslado.ccod_empresa \n"+
            "and HMOVIALC.motivo_traslado = Hmotivo_traslado.ccod_motivo \n"+
            " where HMOVIALC.ccod_empresa = @codigo_empresa \n"+
            " and HMOVIALC.modulo = 'Guia_Venta' \n"+ 
            " and HMOVIALC.atencion <> case @estado_atencion when 'Todos' then '' else 'Atendido' end  \n"+
            " and HMOVIALC.ccod_almacen = @codigo_punto_venta \n"+ 
            (agrupacion1_valores == "" ? "" : "and "+columnas[agrupacion1_tipo]+" in ("+agrupacion1_valores +") \n")+
            (agrupacion2_valores == "" ? "" : "and "+columnas[agrupacion2_tipo]+" in ("+agrupacion2_valores +") \n")+
            (agrupacion3_valores == "" ? "" : "and "+columnas[agrupacion3_tipo]+" in ("+agrupacion3_valores +") \n")+
            " and HMOVIALC.dfecha_doc between @fecha_inicio and @fecha_termino \n"+
            " order by \n"+
            (columnas[agrupacion1_tipo] ? columnas[agrupacion1_tipo] : "HMOVIALC.ccod_almacen") +", \n"+
            (columnas[agrupacion2_tipo] ? columnas[agrupacion2_tipo] : "HMOVIALC.dfecha_doc desc") +", \n"+
            (columnas[agrupacion3_tipo] ? columnas[agrupacion3_tipo] : "tipo_documento.ctip_doc") +" \n";

        }else{
            query =
            "select \n"+
            "HMOVIALC.ccod_almacen as Punto_Venta, \n"+
            "HMOVIALC.tipo_venta as Tipo_Venta, \n"+
            "HMOVIALC.cnum_serie as Serie_Documento, \n"+
            "HMOVIALC.cnum_doc as Numero_Documento, \n"+
            "HMOVIALC.ccod_cliente as Codigo_Cliente, \n"+
            "HMOVIALC.cnom_cliente_v as Nombre_Cliente, \n"+
            "CONVERT(VARCHAR,HMOVIALC.dfecha_doc,103) as Fecha_Documento, \n"+
            "HMOVIALC.nro_dias as Dias, \n"+
            "CONVERT(VARCHAR,HMOVIALC.dfecha_val,103) as Fecha_Validez, \n"+
            "CONVERT(VARCHAR,HMOVIALC.dfecha_entr,103) as Fecha_Entrega, \n"+
            "HMOVIALC.ccod_forpago as Codigo_Forma_Pago, \n"+
            "Hfor_pag.cnom_forpago as Forma_Pago, \n"+
            "case HMOVIALC.ctip_docref when '00' then '' else HMOVIALC.ctip_docref end as Codigo_Tipo_Referencia, \n"+
            "case HMOVIALC.ctip_docref when '00' then '' else tipo_documento_referencia.cnom_doc end as Nombre_Tipo_Referencia, \n"+
            "HMOVIALC.cserie_docref as Motivo_Serie_Referencia, \n"+
            "HMOVIALC.cnum_docref as Numero_Referencia, \n"+
            "case HMOVIALC.tipo_comprobante when '00' then '' else HMOVIALC.tipo_comprobante end as Codigo_Tipo_Comprobante, \n"+
            "case HMOVIALC.tipo_comprobante when '00' then '' else tipo_documento_comprobante.cnom_doc end as Nombre_Tipo_Comprobante, \n"+
            "HMOVIALC.numero_comprobante as Numero_Comprobante, \n"+
            "HMOVIALC.serie_comprobante as Serie_Comprobante, \n"+
            "CONVERT(VARCHAR,HMOVIALC.fecha_comp,103) as Fecha_Comprobante, \n"+
            "HMOVIALC.estado as Estado, \n"+
            "HMOVIALC.tipo_cambio as Tipo_Cambio, \n"+
            "HMOVIALC.desc_stock as Desc_Stock, \n"+
            "HMOVIALC.ccod_vendedor as Codigo_Vendedor, \n"+
            "Hvended.cnom_vendedor as Nombre_Vendedor, \n"+
            "HMOVIALC.erp_codune as Codigo_Unidad_Negocio, \n"+
            "erp_unidad_negocio.erp_nomune as Unidad_Negocio, \n"+
            "HMOVIALC.ccod_cencos as Codigo_Centro_Costo, \n"+
            "Hcencos.cnom_cencos as Centro_Costo, \n"+
            "HMOVIALC.ot as Codigo_Orden_Trabajo, \n"+
            "Horden_trabajo.cnom_ot as  Nombre_Orden_Trabajo, \n"+
            "HMOVIALC.cmoneda as Moneda, \n"+
            "HMOVIALC.n_orden as Numero_Orden, \n"+
            "HMOVIALC.erp_nro_exp as Numero_Expediente1,\n"+
            "HMOVIALC.erp_nro_exp2 as Numero_Expediente2,\n"+
            "HMOVIALC.motivo_traslado as  Codigo_Motivo_Taslado, \n"+
            "Hmotivo_traslado.nombre_motivo as  Nombre_Motivo_Taslado, \n"+
            "HMOVIALC.lista_precios as Lista_Precios, \n"+
            "HMOVIALC.observacion as Observacion, \n"+
            "HMOVIALC.glosa as Glosa, \n"+
            "HMOVIALC.erp_codage as Agente, \n"+
            "HMOVIALC.atencion as Atencion, \n"+
            "HMOVIALC.porcentaje as Porcentaje, \n"+
            "HMOVIALC.porc_descuento as Descuento_Porcentaje, \n"+
            "HMOVIALC.si_igv as Si_Igv, \n"+
            "HMOVIALC.subtotal_sin_descuentos as Base_Calculada, \n"+
            "HMOVIALC.erp_Ddescuento as Descuento, \n"+
            "HMOVIALC.erp_Dsubtotal as Base_Imponible, \n"+
            "HMOVIALC.erp_Digv as Igv, \n"+
            "HMOVIALC.erp_Dimporte as Total, \n"+
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
            "HMOVIALD.porc_descuento as Descuento1, \n"+
            "HMOVIALD.desc2 as Descuento2, \n"+
            "HMOVIALD.desc3 as Descuento3, \n"+
            "HMOVIALD.erp_desc4 as Descuento4, \n"+
            "HMOVIALD.bserie as Serie_SN, \n"+
            "HMOVIALD.nro_serie as Serie_Numero, \n"+
            "HMOVIALD.blote as Lote_SN, \n"+
            "HMOVIALD.CNRO_LOTE as Lote_Numero, \n"+
            "case HMOVIALD.blote when 'N' then '' else CONVERT(VARCHAR,HMOVIALD.vcto,103) end as Lote_Vencimiento, \n"+
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
            "inner Join htipdoc as tipo_documento on \n"+
            "HMOVIALC.ccod_empresa = tipo_documento.ccod_empresa \n"+
            "and HMOVIALC.ccod_movimiento = tipo_documento.ctip_doc \n"+
            "left Join htipdoc as tipo_documento_referencia on \n"+
            "HMOVIALC.ccod_empresa = tipo_documento_referencia.ccod_empresa \n"+
            "and HMOVIALC.ctip_docref = tipo_documento_referencia.ctip_doc \n"+
            "left Join htipdoc as tipo_documento_comprobante on \n"+
            "HMOVIALC.ccod_empresa = tipo_documento_comprobante.ccod_empresa \n"+
            "and HMOVIALC.tipo_comprobante = tipo_documento_comprobante.ctip_doc \n"+
            "inner join Hfor_pag on \n"+
            "HMOVIALC.ccod_empresa = Hfor_pag.ccod_empresa and \n"+
            "HMOVIALC.ccod_forpago = Hfor_pag.ccod_forpago \n"+
            "inner join hvended on \n"+
            "HMOVIALC.ccod_empresa = hvended.ccod_empresa and \n"+
            "HMOVIALC.ccod_vendedor = hvended.ccod_vendedor \n"+
            "inner join Hcencos on \n"+
            "HMOVIALC.ccod_empresa = Hcencos.ccod_empresa \n"+
            "and HMOVIALC.ccod_cencos = Hcencos.ccod_cencos \n"+
            "inner join Horden_trabajo on \n"+
            "HMOVIALC.ccod_empresa = Horden_trabajo.ccod_empresa \n"+
            "and HMOVIALC.ot = Horden_trabajo.ccod_ot \n"+
            "inner join erp_unidad_negocio on \n"+
            "HMOVIALC.ccod_empresa = erp_unidad_negocio.erp_codemp \n"+
            "and HMOVIALC.erp_codune = erp_unidad_negocio.erp_codune \n"+
            "inner join Hmotivo_traslado on \n"+
            "HMOVIALC.ccod_empresa = Hmotivo_traslado.ccod_empresa \n"+
            "and HMOVIALC.motivo_traslado = Hmotivo_traslado.ccod_motivo \n"+
            " where HMOVIALC.ccod_empresa = @codigo_empresa \n"+
            " and HMOVIALC.modulo = 'Guia_Venta' \n"+ 
            " and HMOVIALC.atencion <> case @estado_atencion when 'Todos' then '' else 'Atendido' end  \n"+
            " and HMOVIALC.ccod_almacen = @codigo_punto_venta \n"+ 
            (agrupacion1_valores == "" ? "" : "and "+columnas[agrupacion1_tipo]+" in ("+agrupacion1_valores +") \n")+
            (agrupacion2_valores == "" ? "" : "and "+columnas[agrupacion2_tipo]+" in ("+agrupacion2_valores +") \n")+
            (agrupacion3_valores == "" ? "" : "and "+columnas[agrupacion3_tipo]+" in ("+agrupacion3_valores +") \n")+
            " and HMOVIALC.dfecha_doc between @fecha_inicio and @fecha_termino \n"+
            " order by \n"+
            (columnas[agrupacion1_tipo] ? columnas[agrupacion1_tipo] : "HMOVIALC.ccod_almacen") +", \n"+
            (columnas[agrupacion2_tipo] ? columnas[agrupacion2_tipo] : "HMOVIALC.dfecha_doc desc") +", \n"+
            (columnas[agrupacion3_tipo] ? columnas[agrupacion3_tipo] : "tipo_documento.ctip_doc") +" \n";
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

router.post('/ventas_diarias/:tipo_reporte', async (req, res) => {
    try{
        const {tipo_reporte} = req.params;
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.body.punto_venta;
        var columnas = {
            centro_costos: "HMOVIALC.ccod_cencos",
            unidad_negocio: "HMOVIALC.erp_codune",
            orden_trabajo: "HMOVIALC.ot",
            serie_documento: "HMOVIALC.cnum_serie",
            codigo_cliente: "HMOVIALC.ccod_cliente",
            forma_pago_lista: "HMOVIALC.ccod_forpago",
            articulos: "HMOVIALD.ccod_articulo",
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
            "HMOVIALC.ccod_almacen as Punto_Venta, \n"+
            "HMOVIALC.ccod_movimiento as Codigo_Tipo_Documento, \n"+
            "tipo_documento.cnom_doc as Nombre_Tipo_Documento, \n"+
            "HMOVIALC.tipo_venta as Tipo_Venta, \n"+
            "HMOVIALC.cnum_serie as Serie_Documento, \n"+
            "HMOVIALC.cnum_doc as Numero_Documento, \n"+
            "HMOVIALC.ccod_cliente as Codigo_Cliente, \n"+
            "HMOVIALC.cnom_cliente_v as Nombre_Cliente, \n"+
            "CONVERT(VARCHAR,HMOVIALC.dfecha_doc,103) as Fecha_Documento, \n"+
            "HMOVIALC.nro_dias as Dias, \n"+
            "CONVERT(VARCHAR,HMOVIALC.dfecha_val,103) as Fecha_Validez, \n"+
            "CONVERT(VARCHAR,HMOVIALC.dfecha_entr,103) as Fecha_Entrega, \n"+
            "HMOVIALC.ccod_forpago as Codigo_Forma_Pago, \n"+
            "Hfor_pag.cnom_forpago as Forma_Pago, \n"+
            "case HMOVIALC.ctip_docref when '00' then '' else HMOVIALC.ctip_docref end as Codigo_Tipo_Referencia, \n"+
            "case HMOVIALC.ctip_docref when '00' then '' else tipo_documento_referencia.cnom_doc end as Nombre_Tipo_Referencia, \n"+
            "HMOVIALC.cserie_docref as Motivo_Serie_Referencia, \n"+
            "HMOVIALC.cnum_docref as Numero_Referencia, \n"+
            "HMOVIALC.estado as Estado, \n"+
            "HMOVIALC.tipo_cambio as Tipo_Cambio, \n"+
            "HMOVIALC.desc_stock as Desc_Stock, \n"+
            "HMOVIALC.ccod_vendedor as Codigo_Vendedor, \n"+
            "Hvended.cnom_vendedor as Nombre_Vendedor, \n"+
            "HMOVIALC.erp_codune as Codigo_Unidad_Negocio, \n"+
            "erp_unidad_negocio.erp_nomune as Unidad_Negocio, \n"+
            "HMOVIALC.ccod_cencos as Codigo_Centro_Costo, \n"+
            "Hcencos.cnom_cencos as Centro_Costo, \n"+
            "HMOVIALC.ot as Codigo_Orden_Trabajo, \n"+
            "Horden_trabajo.cnom_ot as  Nombre_Orden_Trabajo, \n"+
            "HMOVIALC.ccod_detraccion as  Codigo_Detraccion, \n"+
            "Hdetraccion.descrip as  Nombre_Detraccion, \n"+
            "HMOVIALC.cmoneda as Moneda, \n"+
            "HMOVIALC.n_orden as Numero_Orden, \n"+
            "HMOVIALC.erp_nro_exp as Numero_Expediente1,\n"+
            "HMOVIALC.erp_nro_exp2 as Numero_Expediente2,\n"+
            "HMOVIALC.motivo_traslado as  Codigo_Motivo_Taslado, \n"+
            "Hmotivo_traslado.nombre_motivo as  Nombre_Motivo_Taslado, \n"+
            "HMOVIALC.tribute_concept as  Tipo_Operacion, \n"+
            "HMOVIALC.lista_precios as Lista_Precios, \n"+
            "HMOVIALC.observacion as Observacion, \n"+
            "HMOVIALC.glosa as Glosa, \n"+
            "HMOVIALC.erp_codage as Agente, \n"+
            "HMOVIALC.atencion as Atencion, \n"+
            "HMOVIALC.porcentaje as Porcentaje, \n"+
            "HMOVIALC.porc_descuento as Descuento_Porcentaje, \n"+
            "HMOVIALC.si_igv as Si_Igv, \n"+
            "HMOVIALC.subtotal_sin_descuentos as Base_Calculada, \n"+
            "HMOVIALC.erp_Ddescuento as Descuento, \n"+
            "HMOVIALC.erp_Dsubtotal as Base_Imponible, \n"+
            "HMOVIALC.erp_Digv as Igv, \n"+
            "HMOVIALC.erp_Dimporte as Total, \n"+
            "HMOVIALC.usuario as Usuario, \n"+
            "HMOVIALC.Pc_User as Pc_User, \n"+
            "HMOVIALC.Pc_Fecha as Pc_Fecha, \n"+
            "HMOVIALC.Pc_Ip as Pc_Ip \n"+
            "from HMOVIALC \n"+
            "Inner Join htipdoc as tipo_documento on \n"+
            "HMOVIALC.ccod_empresa = tipo_documento.ccod_empresa \n"+
            "and HMOVIALC.ccod_movimiento = tipo_documento.ctip_doc \n"+
            "Inner Join htipdoc as tipo_documento_referencia on \n"+
            "HMOVIALC.ccod_empresa = tipo_documento_referencia.ccod_empresa \n"+
            "and HMOVIALC.ctip_docref = tipo_documento_referencia.ctip_doc \n"+
            "inner join Hfor_pag on \n"+
            "HMOVIALC.ccod_empresa = Hfor_pag.ccod_empresa and \n"+
            "HMOVIALC.ccod_forpago = Hfor_pag.ccod_forpago \n"+
            "inner join hvended on \n"+
            "HMOVIALC.ccod_empresa = hvended.ccod_empresa and \n"+
            "HMOVIALC.ccod_vendedor = hvended.ccod_vendedor \n"+
            "inner join Hcencos on \n"+
            "HMOVIALC.ccod_empresa = Hcencos.ccod_empresa \n"+
            "and HMOVIALC.ccod_cencos = Hcencos.ccod_cencos \n"+
            "inner join Horden_trabajo on \n"+
            "HMOVIALC.ccod_empresa = Horden_trabajo.ccod_empresa \n"+
            "and HMOVIALC.ot = Horden_trabajo.ccod_ot \n"+
            "inner join erp_unidad_negocio on \n"+
            "HMOVIALC.ccod_empresa = erp_unidad_negocio.erp_codemp \n"+
            "and HMOVIALC.erp_codune = erp_unidad_negocio.erp_codune \n"+
            "inner join Hmotivo_traslado on \n"+
            "HMOVIALC.ccod_empresa = Hmotivo_traslado.ccod_empresa \n"+
            "and HMOVIALC.motivo_traslado = Hmotivo_traslado.ccod_motivo \n"+
            "inner join Hdetraccion on \n"+
            "HMOVIALC.ccod_empresa = Hdetraccion.ccod_empresa \n"+
            "and HMOVIALC.ccod_detraccion = Hdetraccion.ccod_detraccion \n"+
            " where HMOVIALC.ccod_empresa = @codigo_empresa \n"+
            " and HMOVIALC.modulo = 'Punto_Venta' \n"+ 
            " and HMOVIALC.atencion <> case @estado_atencion when 'Todos' then '' else 'Atendido' end  \n"+
            " and HMOVIALC.ccod_almacen = @codigo_punto_venta \n"+ 
            (agrupacion1_valores == "" ? "" : "and "+columnas[agrupacion1_tipo]+" in ("+agrupacion1_valores +") \n")+
            (agrupacion2_valores == "" ? "" : "and "+columnas[agrupacion2_tipo]+" in ("+agrupacion2_valores +") \n")+
            (agrupacion3_valores == "" ? "" : "and "+columnas[agrupacion3_tipo]+" in ("+agrupacion3_valores +") \n")+
            " and HMOVIALC.dfecha_doc between @fecha_inicio and @fecha_termino \n"+
            " order by HMOVIALC.cnum_doc desc,\n"+
            (columnas[agrupacion1_tipo] ? columnas[agrupacion1_tipo] : "HMOVIALC.ccod_almacen") +", \n"+
            (columnas[agrupacion2_tipo] ? columnas[agrupacion2_tipo] : "HMOVIALC.dfecha_doc desc") +", \n"+
            (columnas[agrupacion3_tipo] ? columnas[agrupacion3_tipo] : "tipo_documento.ctip_doc") +" \n";

        }else{
            query =

            "select \n"+
            "HMOVIALC.ccod_almacen as Punto_Venta, \n"+
            "HMOVIALC.ccod_movimiento as Codigo_Tipo_Documento, \n"+
            "tipo_documento.cnom_doc as Nombre_Tipo_Documento, \n"+
            "HMOVIALC.tipo_venta as Tipo_Venta, \n"+
            "HMOVIALC.cnum_serie as Serie_Documento, \n"+
            "HMOVIALC.cnum_doc as Numero_Documento, \n"+
            "HMOVIALC.ccod_cliente as Codigo_Cliente, \n"+
            "HMOVIALC.cnom_cliente_v as Nombre_Cliente, \n"+
            "CONVERT(VARCHAR,HMOVIALC.dfecha_doc,103) as Fecha_Documento, \n"+
            "HMOVIALC.nro_dias as Dias, \n"+
            "CONVERT(VARCHAR,HMOVIALC.dfecha_val,103) as Fecha_Validez, \n"+
            "CONVERT(VARCHAR,HMOVIALC.dfecha_entr,103) as Fecha_Entrega, \n"+
            "HMOVIALC.ccod_forpago as Codigo_Forma_Pago, \n"+
            "Hfor_pag.cnom_forpago as Forma_Pago, \n"+
            "case HMOVIALC.ctip_docref when '00' then '' else HMOVIALC.ctip_docref end as Codigo_Tipo_Referencia, \n"+
            "case HMOVIALC.ctip_docref when '00' then '' else tipo_documento_referencia.cnom_doc end as Nombre_Tipo_Referencia, \n"+
            "HMOVIALC.cserie_docref as Motivo_Serie_Referencia, \n"+
            "HMOVIALC.cnum_docref as Numero_Referencia, \n"+
            "HMOVIALC.estado as Estado, \n"+
            "HMOVIALC.tipo_cambio as Tipo_Cambio, \n"+
            "HMOVIALC.desc_stock as Desc_Stock, \n"+
            "HMOVIALC.ccod_vendedor as Codigo_Vendedor, \n"+
            "Hvended.cnom_vendedor as Nombre_Vendedor, \n"+
            "HMOVIALC.erp_codune as Codigo_Unidad_Negocio, \n"+
            "erp_unidad_negocio.erp_nomune as Unidad_Negocio, \n"+
            "HMOVIALC.ccod_cencos as Codigo_Centro_Costo, \n"+
            "Hcencos.cnom_cencos as Centro_Costo, \n"+
            "HMOVIALC.ot as Codigo_Orden_Trabajo, \n"+
            "Horden_trabajo.cnom_ot as  Nombre_Orden_Trabajo, \n"+
            "HMOVIALC.ccod_detraccion as  Codigo_Detraccion, \n"+
            "Hdetraccion.descrip as  Nombre_Detraccion, \n"+
            "HMOVIALC.cmoneda as Moneda, \n"+
            "HMOVIALC.n_orden as Numero_Orden, \n"+
            "HMOVIALC.erp_nro_exp as Numero_Expediente1,\n"+
            "HMOVIALC.erp_nro_exp2 as Numero_Expediente2,\n"+
            "HMOVIALC.motivo_traslado as  Codigo_Motivo_Taslado, \n"+
            "Hmotivo_traslado.nombre_motivo as  Nombre_Motivo_Taslado, \n"+
            "HMOVIALC.tribute_concept as  Tipo_Operacion, \n"+
            "HMOVIALC.lista_precios as Lista_Precios, \n"+
            "HMOVIALC.observacion as Observacion, \n"+
            "HMOVIALC.glosa as Glosa, \n"+
            "HMOVIALC.erp_codage as Agente, \n"+
            "HMOVIALC.atencion as Atencion, \n"+
            "HMOVIALC.porcentaje as Porcentaje, \n"+
            "HMOVIALC.porc_descuento as Descuento_Porcentaje, \n"+
            "HMOVIALC.si_igv as Si_Igv, \n"+
            "HMOVIALC.subtotal_sin_descuentos as Base_Calculada, \n"+
            "HMOVIALC.erp_Ddescuento as Descuento, \n"+
            "HMOVIALC.erp_Dsubtotal as Base_Imponible, \n"+
            "HMOVIALC.erp_Digv as Igv, \n"+
            "HMOVIALC.erp_Dimporte as Total, \n"+
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
            "HMOVIALD.porc_descuento as Descuento1, \n"+
            "HMOVIALD.desc2 as Descuento2, \n"+
            "HMOVIALD.desc3 as Descuento3, \n"+
            "HMOVIALD.erp_desc4 as Descuento4, \n"+
            "HMOVIALD.bserie as Serie_SN, \n"+
            "HMOVIALD.nro_serie as Serie_Numero, \n"+
            "HMOVIALD.blote as Lote_SN, \n"+
            "HMOVIALD.CNRO_LOTE as Lote_Numero, \n"+
            "case HMOVIALD.blote when 'N' then '' else CONVERT(VARCHAR,HMOVIALD.vcto,103) end as Lote_Vencimiento, \n"+
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
            "Inner Join htipdoc as tipo_documento on \n"+
            "HMOVIALC.ccod_empresa = tipo_documento.ccod_empresa \n"+
            "and HMOVIALC.ccod_movimiento = tipo_documento.ctip_doc \n"+
            "Inner Join htipdoc as tipo_documento_referencia on \n"+
            "HMOVIALC.ccod_empresa = tipo_documento_referencia.ccod_empresa \n"+
            "and HMOVIALC.ctip_docref = tipo_documento_referencia.ctip_doc \n"+
            "inner join Hfor_pag on \n"+
            "HMOVIALC.ccod_empresa = Hfor_pag.ccod_empresa and \n"+
            "HMOVIALC.ccod_forpago = Hfor_pag.ccod_forpago \n"+
            "inner join hvended on \n"+
            "HMOVIALC.ccod_empresa = hvended.ccod_empresa and \n"+
            "HMOVIALC.ccod_vendedor = hvended.ccod_vendedor \n"+
            "inner join Hcencos on \n"+
            "HMOVIALC.ccod_empresa = Hcencos.ccod_empresa \n"+
            "and HMOVIALC.ccod_cencos = Hcencos.ccod_cencos \n"+
            "inner join Horden_trabajo on \n"+
            "HMOVIALC.ccod_empresa = Horden_trabajo.ccod_empresa \n"+
            "and HMOVIALC.ot = Horden_trabajo.ccod_ot \n"+
            "inner join erp_unidad_negocio on \n"+
            "HMOVIALC.ccod_empresa = erp_unidad_negocio.erp_codemp \n"+
            "and HMOVIALC.erp_codune = erp_unidad_negocio.erp_codune \n"+
            "inner join Hmotivo_traslado on \n"+
            "HMOVIALC.ccod_empresa = Hmotivo_traslado.ccod_empresa \n"+
            "and HMOVIALC.motivo_traslado = Hmotivo_traslado.ccod_motivo \n"+
            "inner join Hdetraccion on \n"+
            "HMOVIALC.ccod_empresa = Hdetraccion.ccod_empresa \n"+
            "and HMOVIALC.ccod_detraccion = Hdetraccion.ccod_detraccion \n"+
            " where HMOVIALC.ccod_empresa = @codigo_empresa \n"+
            " and HMOVIALC.modulo = 'Punto_Venta' \n"+ 
            " and HMOVIALC.atencion <> case @estado_atencion when 'Todos' then '' else 'Atendido' end  \n"+
            " and HMOVIALC.ccod_almacen = @codigo_punto_venta \n"+ 
            (agrupacion1_valores == "" ? "" : "and "+columnas[agrupacion1_tipo]+" in ("+agrupacion1_valores +") \n")+
            (agrupacion2_valores == "" ? "" : "and "+columnas[agrupacion2_tipo]+" in ("+agrupacion2_valores +") \n")+
            (agrupacion3_valores == "" ? "" : "and "+columnas[agrupacion3_tipo]+" in ("+agrupacion3_valores +") \n")+
            " and HMOVIALC.dfecha_doc between @fecha_inicio and @fecha_termino \n"+
            " order by \n"+
            (columnas[agrupacion1_tipo] ? columnas[agrupacion1_tipo] : "HMOVIALC.ccod_almacen") +", \n"+
            (columnas[agrupacion2_tipo] ? columnas[agrupacion2_tipo] : "HMOVIALC.dfecha_doc desc") +", \n"+
            (columnas[agrupacion3_tipo] ? columnas[agrupacion3_tipo] : "tipo_documento.ctip_doc") +" \n";
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

router.post('/arqueo_cajas/:tipo_reporte', async (req, res) => {
    try{
        console.log(req.body);
        const {tipo_reporte} = req.params;
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.body.punto_venta;
        var columnas = {
            centro_costos: "HMOVIALC.ccod_cencos",
            unidad_negocio: "HMOVIALC.erp_codune",
            orden_trabajo: "HMOVIALC.ot",
            serie_documento: "HMOVIALC.cnum_serie",
            codigo_cliente: "HMOVIALC.ccod_cliente",
            forma_pago_lista: "HMOVIALC.ccod_forpago",
            articulos: "HMOVIALD.ccod_articulo",
        }
        var agrupacion1_valores = req.body.agrupacion1_valores;
        var agrupacion2_valores = req.body.agrupacion2_valores;
        var agrupacion3_valores = req.body.agrupacion3_valores;
        var agrupacion1_tipo = req.body.agrupacion1_tipo;
        var agrupacion2_tipo = req.body.agrupacion2_tipo;
        var agrupacion3_tipo = req.body.agrupacion3_tipo;

        var query="";
        if(tipo_reporte=="resumido"){
            query= ""

        }else{
            query = "exec dbo.Sq_PtoVta_Arqueo_Caja_Detallado @codigo_empresa,@codigo_punto_venta,'(Todos)',@caja_cuenta_corriente,@fecha_inicio,@fecha_termino,'Ninguno','Ninguno','(Todos)','(Todos)'"
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
        .input('caja_cuenta_corriente', mssql.VarChar(250), req.body.caja_cuenta_corriente)
        .query(query);
    
        const recordset = lista.recordset;
        res.json(recordset);
    }catch(err){
        console.log(err.message);
        res.send(err.message);
    }
});

module.exports = router;