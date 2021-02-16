const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../../database');

router.post('/configuraciones', async (req, res) => {
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .query("select moneda_trabajo, mas_igv, ctipo_cambio from Hconfiguraciones_2 where idempresa=@codigo_empresa ");
  
    const recordset = lista.recordset;
    res.json(recordset);
});

router.post('/detalle', async (req, res) => {

    const codigo_empresa = req.user.codigo_empresa;
    // const motivo_documento = '022';
    // const numero_documento = '2020-00002';
    // const codigo_punto_venta = '001';
    const motivo_documento = req.body.motivo_documento;
    const numero_documento = req.body.numero_documento;
    var codigo_punto_venta = req.body.codigo_punto_venta;

    if(codigo_punto_venta == null || codigo_punto_venta.trim()===''){
        codigo_punto_venta = req.user.codigo_punto_venta;
    }
    
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('motivo_documento', mssql.VarChar(250), motivo_documento)
    .input('numero_documento', mssql.VarChar(250), numero_documento)
    .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
    .query("SELECT \n"+
        " Hordcomd.nitem as NItem,\n"+
        " Hordcomd.NCANTIDAD3 as Cantidad,\n"+
        " Hordcomd.CCOD_ARTICULO AS Codigo,\n"+
        " Harticul.ccod_almacen as Tipo_producto,\n"+
        " Harticul.cfamilia as Familia,\n"+
        " Harticul.ccod_subfamilia as Subfamilia,\n"+
        " harticul.codmarca as Codigo_Concepto1,\n"+
        " erp_concepto1.erp_nomcon as Concepto1,\n"+
        " harticul.modelo as Concepto2,\n"+
        " harticul.color as Concepto3,\n"+
        " harticul.tratamiento as Concepto4,\n"+
        " harticul.fuelle as Concepto5,\n"+
        " harticul.azas as Concepto6,\n"+
        " harticul.solapa as Concepto7,\n"+
        " harticul.ccod_interno as Codigo_Fabricante,\n"+
        " harticul.cod_digemir as Codigo_Digemid,\n"+
        " harticul.erp_codinterno2 as Codigo_Interno,\n"+
        " harticul.erp_codinterno3 as Codigo_Interno2,\n"+
        " harticul.observacion as Leyenda1,\n"+
        " harticul.erp_observacion2 as Leyenda2,\n"+
        " Hordcomd.CNOM_ARTICULO AS Nombre,\n"+
        " RTRIM(Hordcomd.CUNIDAD) AS Codigo_Unidad,\n"+
        " RTRIM(Hordcomd.CUNIDAD) AS Unidad,\n"+
        " '' as Comision_porcentaje,\n"+
        " Hordcomd.factor as Factor,\n"+
        " Hordcomd.npreciounitario as Unit,\n"+
        " Hordcomd.nbaseimpon as Base_Imponible,\n"+
        " '' as Desc1,\n"+
        " '' as Desc2,\n"+
        " '' As Desc3,\n"+
        " '' as Desc4,\n"+
        " Hordcomd.base_calculada as Base_Calculada,\n"+
        " Hordcomd.NIGVCalc as Igv,\n"+
        " Hordcomd.nprecio_importe as Importe,\n"+
        " Hordcomd.peso as Peso,\n"+
        " Halmacen_2.ccod_almacen as Codigo_Almacen,\n"+
        " Halmacen_2.cnom_almacen as Almacen,\n"+
        " Hordcomd.cantidad_presentacion as Cantidad_presentacion,\n"+
        " Hordcomd.codigo_presentacion as Codigo_presentacion,\n"+
        " RTRIM(Hordcomd.unidad_presentacion) AS Unidad_presentacion,\n"+
        " Hordcomd.nombre_presentacion AS Nombre_presentacion,\n"+
        " Hordcomd.precio_presentacion as Precio_presentacion,\n"+
        " '' as Observacion,\n"+
        " Hordcomd.r_ot as OT,\n"+
        " Hordcomd.NCANTIDAD as Cantidad_Kardex,\n"+
        " Hordcomd.barticulo as Barticulo,\n"+
        " Hordcomd.nigv as Igv_Art,\n"+
        " Hordcomd.monto_descuento as Monto_Descuento,\n"+
        " Hordcomd.npreciounitario as Precio_original,\n"+
        " Hordcomd.erp_codune as Codigo_Unidad_Negocio,\n"+
        " Hordcomd.erp_codune as Unidad_negocio,\n"+
        " Hordcomd.ccod_cencos AS Codigo_Cencos,\n"+
        " Hordcomd.ccod_cencos AS Cencos,\n"+
        " '' as Codigo_Partida_presupuestal,\n"+
        " '' as Partida_presupuestal,\n"+
        " Hordcomd.erp_codage as Codigo_Agencia,\n"+
        " Hordcomd.erp_codage as Agencia,\n"+
        " Hordcomd.percepcion_sn as Percepcion_sn,\n"+
        " Hordcomd.percepcion_uni as Percepcion_uni,\n"+
        " '' as Perpecion_porc,\n"+
        " '' as Boni_sn,\n"+
        " '' as Item_boni,\n"+
        " '' as Comision_monto,\n"+
        " Hordcomd.base_calculada as Base_calculada_dec,\n"+
        " Hordcomd.nbaseimpon as Base_imp_dec,\n"+
        " Hordcomd.NIGVCalc as Igv_dec,\n"+
        " Hordcomd.nprecio_importe as Importe_dec,\n"+
        " Harticul.csistock as Stock_SN, \n"+
        " Harticul.lote as Lote_SN, \n"+
        " '' as Lote_Numero, \n"+
        " '' as Lote_Vencimiento, \n"+
        " Harticul.flagserie Serie_SN, \n"+
        " '' as Serie_Numero, \n"+
        " Hordcomd.erp_ptovta as Punto_Venta, \n"+
        " Hordcomd.idmotivo_compra as Codigo_Motivo_Serie, \n"+
        " Hordcomd.cnum_doc as Numero, \n"+
        " Hordcomd.erp_motivo_req as Requerimiento_Motivo, \n"+
        " Hordcomd.erp_nro_req as Requerimiento_Numero, \n"+
        " '' as Orden_Compra_Motivo, \n"+
        " '' as Orden_Compra_Numero, \n"+
        " 'REQ' as Origen_Documento, \n"+
        " Hordcomd.erp_ptovta as Origen_Punto_Venta, \n"+
        " Hordcomd.erp_motivo_req as Origen_Motivo_Serie, \n"+
        " Hordcomd.erp_nro_req as Origen_Numero, \n"+
        " Hordcomd.item_requerimiento as Origen_NItem \n"+
        " FROM Hordcomd inner Join Harticul On \n"+
        " Hordcomd.ccod_empresa = Harticul.ccod_empresa and\n"+
        " Hordcomd.ccod_articulo = Harticul.ccod_articulo\n"+
        " inner join erp_concepto1 on\n"+
        " erp_concepto1.erp_codemp = Harticul.ccod_empresa and\n"+
        " erp_concepto1.erp_codcon = Harticul.codmarca\n"+
        " inner join Halmacen_2 on\n"+
        " Halmacen_2.ccod_empresa = Hordcomd.ccod_empresa and\n"+
        " Halmacen_2.ccod_almacen = Hordcomd.erp_ptovta\n"+
        " WHERE \n"+
        " Hordcomd.ccod_empresa = @codigo_empresa and \n"+
        " Hordcomd.idmotivo_compra = @motivo_documento and\n"+
        " Hordcomd.cnum_doc = @numero_documento and \n"+
        " Hordcomd.erp_ptovta= @codigo_punto_venta \n"+
        " ORDER BY NITEM");

    
    const recordset = lista.recordset;
    res.json(recordset);
});

router.post('/guardar', async (req, res) => {
    try {

        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.user.codigo_punto_venta;
        const usuario = req.user.codigo_usuario;
        var filas_detalle = JSON.parse(req.body.filas_detalle)
        
        var numero_correlativo;
        const pool = await poolPromise;
        const transaction = await new mssql.Transaction(pool);
        await transaction.begin(async err => {
            try{
                //#region Generación del correlativo automatico
                if (req.body.automatico == "A") {
                    const request_automatico  = new mssql.Request(transaction);
                    const result_automatico = await request_automatico 
                    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
                    .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
                    .input("idmotivo_compra", mssql.VarChar(150), req.body.motivo)
                    .input("anio", mssql.VarChar(250), req.body.anio)
                    .query(
                        "declare \n"+
                        "@correlativo varchar(50), \n"+
                        "@contador int, \n"+
                        "@cantidad_ceros int, \n"+
                        "@ceros varchar(50), \n"+
                        "@cnt INT \n"+
                        "set @contador = 1 \n"+
                        "set @ceros ='' \n"+
                        "SELECT @correlativo = erp_nummot \n"+
                        "FROM erp_motivos_tramite_detalle \n"+
                        "WHERE erp_codemp = @codigo_empresa \n"+
                        "and erp_codmot = @idmotivo_compra \n"+
                        "and erp_sermot = @anio \n"+
                        "select \n"+
                        "@cantidad_ceros = Isnull(cantidad_caracteres,0) \n"+
                        "from htipdoc \n"+
                        "where ccod_empresa = @codigo_empresa \n"+
                        "and ctip_doc = 'OC' \n"+
                        "set @cnt = LEN(@correlativo) \n"+
                        "WHILE @cnt < @cantidad_ceros \n"+
                        "BEGIN \n"+
                        "SET @ceros = '0'+@ceros \n"+
                        "SET @cnt = @cnt + 1 \n"+
                        "END \n"+
                        "while @contador>0 \n"+
                        "begin \n"+
                        "set @correlativo = @correlativo +1 \n"+
                        "SELECT @contador= COUNT(*) \n"+
                        "FROM Hordcomc \n"+
                        "WHERE ccod_empresa = @codigo_empresa \n"+
                        "AND erp_ptovta = @codigo_punto_venta \n"+
                        "AND idmotivo_compra = @idmotivo_compra \n"+
                        "AND cnum_doc =CONVERT(VARCHAR(50),@anio+'-'+@ceros+@correlativo) \n"+
                        "end \n"+
                        "select @anio+'-'+@ceros++CONVERT(VARCHAR(50),@correlativo) as correlativo "
                    );        
        
                    var recordset_automatico = result_automatico.recordset;
                    numero_correlativo = recordset_automatico[0].correlativo;
        
                } else {
                    numero_correlativo = req.body.numero_correlativo
                }
                //#endregion
              
                //#region Registro de la cabecera
                const request_cabecera  = new mssql.Request(transaction);
                await request_cabecera
                .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                .input("erp_ptovta", mssql.VarChar(250), codigo_punto_venta)
                .input("idmotivo_compra", mssql.VarChar(250), req.body.motivo)
                .input("cnum_doc", mssql.VarChar(250), numero_correlativo)
                .input("automatico", mssql.VarChar(250), req.body.automatico)
                .input("ccod_proveedor", mssql.VarChar(250), req.body.codigo_proveedor)
                .input("cnom_proveedor", mssql.VarChar(250), req.body.nombre_proveedor)
                .input("direccion", mssql.VarChar(250), req.body.direccion)
                .input("lugar_entrega", mssql.VarChar(250), req.body.lugar_entrega)
                .input("fact_a_nombre", mssql.VarChar(250), req.body.fact_nombre)
                .input("dfecha_doc", mssql.Date, req.body.fecha_doc)
                .input("fecha_validez", mssql.Date, req.body.fecha_validez)
                .input("dfecha_entr", mssql.Date, req.body.fecha_entr)
                .input("tipocambio", mssql.VarChar(250), req.body.tasa_cambio)
                .input("nimporte", mssql.VarChar(250), req.body.importe)
                .input("ccod_forpago", mssql.VarChar(250), req.body.forma_pago)
                .input("estado", mssql.VarChar(250), req.body.estado)
                .input("cmoneda", mssql.VarChar(250), req.body.moneda)
                .input("ccod_cencos", mssql.VarChar(250), req.body.centro_costos)
                .input("si_igv", mssql.VarChar(250), req.body.mas_igv)
                .input("ccod_incoterm", mssql.VarChar(250), req.body.codigo_incoterm)
                .input("seguro", mssql.VarChar(250), req.body.seguro)
                .input("flete", mssql.VarChar(250), req.body.flete)
                .input("otros", mssql.VarChar(250), req.body.otros)
                .input("nro_importacion", mssql.VarChar(250), req.body.numero_importacion)
                .input("nro_fact_comercial", mssql.VarChar(250), req.body.numero_fact_comercial)
                .input("dfecha_fact_comercial", mssql.VarChar(250), req.body.fecha_fact_comerial)
                .input("pais", mssql.VarChar(250), req.body.pais)
                .input("ccod_ot", mssql.VarChar(250), req.body.orden_trabajo)
                .input("n_orden_compra", mssql.VarChar(250), req.body.numero_orden_compra)
                .input("tipo", mssql.VarChar(250), req.body.tipo)
                .input("responsable", mssql.VarChar(250), req.body.responsable)
                .input("comentario", mssql.VarChar(250), req.body.comentario)
                .input("comentario2", mssql.VarChar(250), req.body.comentario2)
                .input("comentario3", mssql.VarChar(250), req.body.comentario3)
                .input("comentario4", mssql.VarChar(250), req.body.comentario4)
                .input("comentario5", mssql.VarChar(250), req.body.comentario5)
                .input("comentario6", mssql.VarChar(250), req.body.comentario6)
                .input("comentario7", mssql.VarChar(250), req.body.comentario7)
                .input("descuento", mssql.VarChar(250), req.body.descuento)
                .input("atendido", mssql.VarChar(250), req.body.atendido)
                .input("porcentaje", mssql.VarChar(250), req.body.porcentaje)
                .input("ctipo_cambio", mssql.VarChar(250), req.body.tipo_cambio)
                .input("persona_contacto", mssql.VarChar(250), req.body.nombre_contacto)
                .input("erp_codune", mssql.VarChar(250), req.body.codigo_unidad_negocio)
                .input("cod_contact", mssql.VarChar(250), req.body.codigo_contacto)
                .input("glosa", mssql.VarChar(250), req.body.glosa)
                .input("erp_codage", mssql.VarChar(250), req.body.codigo_agencia)
                .input("usuario", mssql.VarChar(250), usuario)
                .input("Pc_User", mssql.VarChar(250), req.body.Pc_User)
                .input("Pc_Fecha", mssql.Date, req.body.Pc_Fecha)
                .input("Pc_Ip", mssql.VarChar(250), req.body.Pc_Ip)
                .input("erp_lista_comp", mssql.VarChar(250), req.body.lista_compras)
                .input("erp_titulo01", mssql.VarChar(250), req.body.erp_titulo01)
                .input("erp_titulo02", mssql.VarChar(250), req.body.erp_titulo02)
                .input("erp_titulo03", mssql.VarChar(250), req.body.erp_titulo03)
                .input("erp_titulo04", mssql.VarChar(250), req.body.erp_titulo04)
                .input("erp_titulo05", mssql.VarChar(250), req.body.erp_titulo05)
                .input("erp_titulo06", mssql.VarChar(250), req.body.erp_titulo06)
                .input("erp_titulo07", mssql.VarChar(250), req.body.erp_titulo07)
                .input("erp_titulo08", mssql.VarChar(250), req.body.erp_titulo08)
                .input("erp_motivo_req", mssql.VarChar(250), req.body.motivo_requerimiento)
                .input("erp_nro_req", mssql.VarChar(250), req.body.numero_requerimiento)
                .input("subtotal_sin_descuentos", mssql.VarChar(250), req.body.subtotal_sin_descuentos)
                .input("erp_Ddescuento", mssql.VarChar(250), req.body.erp_Ddescuento)
                .input("erp_Dsubtotal", mssql.VarChar(250), req.body.erp_Dsubtotal)
                .input("erp_Digv", mssql.VarChar(250), req.body.erp_Digv)
                .input("erp_Dimporte", mssql.VarChar(250), req.body.erp_Dimporte)
                .input("erp_Dpercepcion", mssql.VarChar(250), req.body.erp_Dpercepcion)
                .input("erp_Dtotal", mssql.VarChar(250), req.body.erp_Dtotal)
                .input("erp_nro_exp", mssql.VarChar(250), req.body.numero_expediente)
                .input("erp_nro_exp2", mssql.VarChar(250), req.body.numero_expediente_2)
                .input("erp_ptovta_ref2", mssql.VarChar(250), req.body.pto_venta_referencia)
                .input("situaprov", mssql.VarChar(250), req.body.situacion_aprobacion)
                .input("respaprov", mssql.VarChar(250), req.body.responsable_aprobacion)
                .input("fechaprov", mssql.Date, req.body.fecha_aprovacion)
                .input("comentaprov", mssql.VarChar(250), req.body.comentario_aprovacion)
                .query("INSERT INTO Hordcomc \n"+
                    "(ccod_empresa \n"+
                    ",erp_ptovta \n"+
                    ",idmotivo_compra \n"+
                    ",cnum_doc \n"+
                    ",automatico \n"+
                    ",ccod_proveedor \n"+
                    ",cnom_proveedor \n"+
                    ",direccion \n"+
                    ",lugar_entrega \n"+
                    ",fact_a_nombre \n"+
                    ",dfecha_doc \n"+
                    ",fecha_validez \n"+
                    ",dfecha_entr \n"+
                    ",tipocambio \n"+
                    ",nimporte \n"+
                    ",ccod_forpago \n"+
                    ",estado \n"+
                    ",cmoneda \n"+
                    ",ccod_cencos \n"+
                    ",si_igv \n"+
                    ",ccod_incoterm \n"+
                    ",seguro \n"+
                    ",flete \n"+
                    ",otros \n"+
                    ",nro_importacion \n"+
                    ",nro_fact_comercial \n"+
                    ",dfecha_fact_comercial \n"+
                    ",ccod_ot \n"+
                    ",pais \n"+
                    ",n_orden_compra \n"+
                    ",tipo \n"+
                    ",responsable \n"+
                    ",comentario \n"+
                    ",comentario2 \n"+
                    ",comentario3 \n"+
                    ",comentario4 \n"+
                     ",comentario5 \n"+
                    ",comentario6 \n"+
                    ",comentario7 \n"+
                    ",descuento \n"+
                    ",atendido \n"+
                    ",porcentaje \n"+
                    ",ctipo_cambio \n"+
                    ",persona_contacto \n"+
                    ",erp_codune \n"+ 
                    ",cod_contact \n"+ 
                   ",glosa \n"+ 
                    ",erp_codage \n"+ 
                    ",usuario \n"+ 
                    ",Pc_User \n"+ 
                    ",Pc_Fecha \n"+ 
                    ",Pc_Ip \n"+ 
                    ",erp_lista_comp \n"+
                    ",erp_titulo01 \n"+
                    ",erp_titulo02 \n"+
                    ",erp_titulo03 \n"+
                    ",erp_titulo04 \n"+
                    ",erp_titulo05 \n"+
                    ",erp_titulo06 \n"+
                    ",erp_titulo07 \n"+
                    ",erp_titulo08 \n"+
                    ",erp_motivo_req \n"+
                    ",erp_nro_req \n"+
                    ",subtotal_sin_descuentos \n"+
                    ",erp_Ddescuento \n"+
                    ",erp_Dsubtotal \n"+
                    ",erp_Digv \n"+
                    ",erp_Dimporte \n"+
                    ",erp_Dpercepcion \n"+ 
                    ",erp_Dtotal \n"+
                    ",erp_nro_exp \n"+
                    ",erp_nro_exp2 \n"+
                    ",erp_ptovta_ref2 \n"+ 
                    ",situaprov \n"+
                    ",respaprov \n"+
                    ",fechaprov \n"+
                    ",comentaprov) \n"+
                    "VALUES \n"+
                    "( @ccod_empresa \n"+
                    ", @erp_ptovta \n"+
                    ", @idmotivo_compra \n"+ 
                    ", @cnum_doc \n"+
                    ", @automatico \n"+
                    ", @ccod_proveedor \n"+
                    ", @cnom_proveedor \n"+
                    ", @direccion \n"+
                    ", @lugar_entrega \n"+
                    ", @fact_a_nombre \n"+
                    ", @dfecha_doc \n"+
                    ", @fecha_validez \n"+
                    ", @dfecha_entr \n"+
                    ", @tipocambio \n"+
                    ", @nimporte \n"+
                    ", @ccod_forpago \n"+
                    ", @estado \n"+
                    ", @cmoneda \n"+
                    ", @ccod_cencos \n"+
                    ", @si_igv \n"+
                    ", @ccod_incoterm \n"+
                    ", @seguro \n"+
                    ", @flete \n"+
                    ", @otros \n"+
                    ", @nro_importacion \n"+
                    ", @nro_fact_comercial \n"+
                    ", @dfecha_fact_comercial \n"+
                    ", @ccod_ot \n"+
                    ", @pais \n"+
                    ", @n_orden_compra \n"+
                    ", @tipo \n"+
                    ", @responsable \n"+
                    ", @comentario \n"+
                    ", @comentario2 \n"+
                    ", @comentario3 \n"+
                    ", @comentario4 \n"+
                    ", @comentario5 \n"+
                    ", @comentario6 \n"+
                    ", @comentario7 \n"+
                    ", @descuento \n"+
                    ", @atendido \n"+
                    ", @porcentaje \n"+
                    ", @ctipo_cambio \n"+
                    ", @persona_contacto \n"+
                    ", @erp_codune \n"+
                    ", @cod_contact \n"+
                    ", @glosa \n"+
                    ", @erp_codage \n"+
                    ", @usuario \n"+
                    ", @Pc_User \n"+
                    ", getdate() \n"+
                    ", @Pc_Ip \n"+
                    ", @erp_lista_comp \n"+
                    ", @erp_titulo01 \n"+
                    ", @erp_titulo02 \n"+
                    ", @erp_titulo03 \n"+
                    ", @erp_titulo04 \n"+
                    ", @erp_titulo05 \n"+
                    ", @erp_titulo06 \n"+
                    ", @erp_titulo07 \n"+
                    ", @erp_titulo08 \n"+
                    ", @erp_motivo_req \n"+
                    ", @erp_nro_req \n"+
                    ", @subtotal_sin_descuentos \n"+
                    ", @erp_Ddescuento \n"+
                    ", @erp_Dsubtotal \n"+
                    ", @erp_Digv \n"+
                    ", @erp_Dimporte \n"+
                    ", @erp_Dpercepcion \n"+
                    ", @erp_Dtotal \n"+
                    ", @erp_nro_exp \n"+
                    ", @erp_nro_exp2 \n"+
                    ", @erp_ptovta_ref2 \n"+
                    ", @situaprov \n"+
                    ", @respaprov \n"+
                    ", @fechaprov \n"+
                    ", @comentaprov) ")
                //#endregion

                //#region Registro del detalle
                for (let i= 0; i< filas_detalle.length; i++){
                    rowid = filas_detalle[i];
                    
                    const request_detalle = new mssql.Request(transaction);
                    await request_detalle
                    .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                    .input("erp_ptovta", mssql.VarChar(250), codigo_punto_venta)
                    .input("idmotivo_compra", mssql.VarChar(250), req.body.motivo)
                    .input("cnum_doc", mssql.VarChar(250), numero_correlativo)
                    .input("nitem", mssql.VarChar(250), i+1)
                    .input("ccod_articulo", mssql.VarChar(250), rowid.Codigo)
                    .input("cnom_articulo", mssql.VarChar(250), rowid.Nombre)
                    .input("cunidad", mssql.VarChar(250), rowid.Codigo_Unidad)
                    .input("factor", mssql.VarChar(250), rowid.Factor)
                    .input("ncantidad3", mssql.VarChar(250), rowid.Cantidad)
                    .input("ncantidad", mssql.VarChar(250), rowid.Cantidad_Kardex)
                    .input("npreciounitario", mssql.VarChar(250), rowid.Unit)
                    .input("nigv", mssql.VarChar(250), rowid.Igv_Art)
                    .input("barticulo", mssql.VarChar(250), rowid.Barticulo)
                    .input("cantidad_presentacion", mssql.VarChar(250), rowid.Cantidad_presentacion)
                    .input("nombre_presentacion", mssql.VarChar(250), rowid.Nombre_presentacion)
                    .input("unidad_presentacion", mssql.VarChar(250), rowid.Unidad_presentacion)
                    .input("precio_presentacion", mssql.VarChar(250), rowid.Precio_presentacion)
                    .input("ccod_cencos", mssql.VarChar(250), req.body.centro_costos)
                    .input("r_ot", mssql.VarChar(250), req.body.orden_trabajo)
                    .input("nbaseimpon", mssql.VarChar(250), rowid.Base_Imponible)
                    .input("nigvcalc", mssql.VarChar(250), rowid.Igv)
                    .input("base_calculada", mssql.VarChar(250), rowid.Base_Calculada)
                    .input("monto_descuento", mssql.VarChar(250), rowid.Monto_Descuento)
                    .input("nporcdesc", mssql.VarChar(250), rowid.Monto_Descuento)
                    .input("nprecio_importe", mssql.VarChar(250), rowid.Importe)
                    .input("precio_original", mssql.VarChar(250), rowid.Precio_original)
                    .input("erp_codune", mssql.VarChar(250), req.body.codigo_unidad_negocio)
                    .input("erp_codage", mssql.VarChar(250), req.body.codigo_agencia)
                    .input("flete", mssql.VarChar(250), req.body.flete)
                    .input("erp_nro_exp", mssql.VarChar(250), req.body.numero_expediente)
                    .input("percepcion_sn", mssql.VarChar(250), rowid.Percepcion_sn)
                    .input("percepcion_uni", mssql.VarChar(250), rowid.Percepcion_uni)
                    .input("erp_ptovta_req", mssql.VarChar(250), rowid.Origen_Punto_Venta)
                    .input("erp_motivo_req", mssql.VarChar(250), rowid.Origen_Motivo_Serie)
                    .input("erp_nro_req", mssql.VarChar(250), rowid.Origen_Numero)
                    .input("item_requerimiento", mssql.VarChar(250), rowid.Origen_NItem)
                    .input("peso", mssql.VarChar(250), rowid.Peso)
                    .input("largo", mssql.VarChar(250), req.body.largo)
                    .input("ancho", mssql.VarChar(250), req.body.ancho)
                    .input("erp_codfab", mssql.VarChar(250), '')
                    .input("nro_fact_comercial", mssql.VarChar(250), req.body.numero_fact_comercial)
                    .input("nro_importacion", mssql.VarChar(250), req.body.numero_importacion)
                    .input("codigo_presentacion", mssql.VarChar(250), rowid.Codigo_presentacion)
                    .query("INSERT INTO Hordcomd \n"+
                        " (ccod_empresa \n"+
                        " ,erp_ptovta \n"+
                        " ,idmotivo_compra \n"+
                        " ,cnum_doc \n"+
                        " ,nitem \n"+
                        " ,ccod_articulo \n"+
                        " ,cnom_articulo \n"+
                        " ,cunidad \n"+
                        " ,factor \n"+
                        " ,ncantidad \n"+
                        " ,ncantidad3 \n"+
                        " ,npreciounitario \n"+
                        " ,nprecio_importe \n"+
                        " ,nigv \n"+
                        " ,ccod_cencos \n"+
                        " ,nbaseimpon \n"+
                        " ,nigvcalc \n"+
                        " ,nporcdesc \n"+
                        " ,monto_descuento \n"+
                        " ,r_ot \n"+
                        " ,barticulo \n"+
                        " ,largo \n"+
                        " ,ancho \n"+
                        " ,peso \n"+
                        " ,erp_codfab \n"+
                        " ,cantidad_presentacion \n"+
                        " ,unidad_presentacion \n"+
                        " ,nombre_presentacion \n"+
                        " ,percepcion_sn \n"+
                        " ,percepcion_uni \n"+
                        " ,precio_presentacion \n"+
                        " ,erp_ptovta_req \n"+
                        " ,erp_motivo_req \n"+
                        " ,erp_nro_req \n"+
                        " ,item_requerimiento \n"+
                        " ,erp_codune \n"+
                        " ,erp_codage \n"+
                        " ,flete \n"+
                        " ,erp_nro_exp \n"+
                        " ,nro_importacion \n"+
                        " ,nro_fact_comercial \n"+
                        " ,codigo_presentacion \n"+
                        " ,base_calculada) \n"+
                        " VALUES \n"+
                        " ( @ccod_empresa \n"+
                        " , @erp_ptovta \n"+
                        " , @idmotivo_compra \n"+
                        " , @cnum_doc \n"+
                        " , @nitem \n"+
                        " , @ccod_articulo \n"+
                        " , @cnom_articulo \n"+
                        " , @cunidad \n"+
                        " , @factor \n"+
                        " , @ncantidad \n"+
                        " , @ncantidad3 \n"+
                        " , @npreciounitario \n"+
                        " , @nprecio_importe \n"+
                        " , @nigv \n"+
                        " , @ccod_cencos \n"+
                        " , @nbaseimpon \n"+
                        " , @nigvcalc \n"+
                        " , @nporcdesc \n"+
                        " , @monto_descuento \n"+
                        " , @r_ot \n"+
                        " , @barticulo \n"+
                        " , @largo \n"+
                        " , @ancho \n"+
                        " , @peso \n"+
                        " , @erp_codfab \n"+
                        " , @cantidad_presentacion \n"+
                        " , @unidad_presentacion \n"+
                        " , @nombre_presentacion \n"+
                        " , @percepcion_sn \n"+
                        " , @percepcion_uni \n"+
                        " , @precio_presentacion \n"+
                        " , @erp_ptovta_req \n"+
                        " , @erp_motivo_req \n"+
                        " , @erp_nro_req \n"+
                        " , @item_requerimiento \n"+
                        " , @erp_codune \n"+
                        " , @erp_codage \n"+
                        " , @flete \n"+
                        " , @erp_nro_exp \n"+
                        " , @nro_importacion \n"+
                        " , @nro_fact_comercial \n"+
                        " , @codigo_presentacion \n"+
                        " , @base_calculada)")
                };                
                //#endregion
                
                //#region Actualización del correlativo automatico
                if(req.body.automatico=="A"){
                    serie_motivo = numero_correlativo.substr(-20,4)
                    numero_motivo = numero_correlativo.substr(-4)

                    const request_correlativo = new mssql.Request(transaction);
                    await request_correlativo
                     .input("erp_codemp", mssql.VarChar(250), codigo_empresa)
                     .input("erp_codmot", mssql.VarChar(250), req.body.motivo)
                     .input("erp_sermot", mssql.VarChar(250), serie_motivo)
                     .input("erp_nummot", mssql.VarChar(250), parseInt(numero_motivo))
                     .query("update Erp_motivos_tramite_detalle SET erp_nummot = @erp_nummot WHERE erp_codemp = @erp_codemp and erp_codmot = @erp_codmot and erp_sermot = @erp_sermot ")
                }                
                //#endregion
            
                transaction.commit(tErr => {if(tErr) {console.log(tErr)}})
                res.send({estado: true, codigo: numero_correlativo, mensaje: ""});
            }catch(err){
                transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
                console.log(err.message);
                res.send({estado: false, codigo: "Err", mensaje: err.message});
            }
        });    
    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
});

router.post('/modificar', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.user.codigo_punto_venta;
        const usuario = req.user.codigo_usuario;

        var filas_detalle = JSON.parse(req.body.filas_detalle)
        
        const pool = await poolPromise;
        const transaction = await new mssql.Transaction(pool);
        await transaction.begin(async err => {
            try{
                //#region Modificar la cabecera
                const request_cabecera  = new mssql.Request(transaction);
                const result_cabecera = await request_cabecera 
                .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                .input("erp_ptovta", mssql.VarChar(250), codigo_punto_venta)
                .input("idmotivo_compra", mssql.VarChar(250), req.body.motivo)
                .input("cnum_doc", mssql.VarChar(250), req.body.numero_correlativo)
                .input("automatico", mssql.VarChar(250), req.body.automatico)
                .input("ccod_proveedor", mssql.VarChar(250), req.body.codigo_proveedor)
                .input("cnom_proveedor", mssql.VarChar(250), req.body.nombre_proveedor)
                .input("direccion", mssql.VarChar(250), req.body.direccion)
                .input("lugar_entrega", mssql.VarChar(250), req.body.lugar_entrega)
                .input("fact_a_nombre", mssql.VarChar(250), req.body.fact_nombre)
                .input("dfecha_doc", mssql.Date, req.body.fecha_doc)
                .input("fecha_validez", mssql.Date, req.body.fecha_validez)
                .input("dfecha_entr", mssql.Date, req.body.fecha_entr)
                .input("tipocambio", mssql.VarChar(250), req.body.tasa_cambio)
                .input("nimporte", mssql.VarChar(250), req.body.importe)
                .input("ccod_forpago", mssql.VarChar(250), req.body.forma_pago)
                .input("estado", mssql.VarChar(250), req.body.estado)
                .input("cmoneda", mssql.VarChar(250), req.body.moneda)
                .input("ccod_cencos", mssql.VarChar(250), req.body.centro_costos)
                .input("si_igv", mssql.VarChar(250), req.body.mas_igv)
                .input("ccod_incoterm", mssql.VarChar(250), req.body.codigo_incoterm)
                .input("seguro", mssql.VarChar(250), req.body.seguro)
                .input("flete", mssql.VarChar(250), req.body.flete)
                .input("otros", mssql.VarChar(250), req.body.otros)
                .input("nro_importacion", mssql.VarChar(250), req.body.numero_importacion)
                .input("nro_fact_comercial", mssql.VarChar(250), req.body.numero_fact_comercial)
                .input("dfecha_fact_comercial", mssql.VarChar(250), req.body.fecha_fact_comerial)
                .input("pais", mssql.VarChar(250), req.body.pais)
                .input("ccod_ot", mssql.VarChar(250), req.body.orden_trabajo)
                .input("n_orden_compra", mssql.VarChar(250), req.body.numero_orden_compra)
                .input("tipo", mssql.VarChar(250), req.body.tipo)
                .input("responsable", mssql.VarChar(250), req.body.responsable)
                .input("comentario", mssql.VarChar(250), req.body.comentario)
                .input("comentario2", mssql.VarChar(250), req.body.comentario2)
                .input("comentario3", mssql.VarChar(250), req.body.comentario3)
                .input("comentario4", mssql.VarChar(250), req.body.comentario4)
                .input("comentario5", mssql.VarChar(250), req.body.comentario5)
                .input("comentario6", mssql.VarChar(250), req.body.comentario6)
                .input("comentario7", mssql.VarChar(250), req.body.comentario7)
                .input("descuento", mssql.VarChar(250), req.body.descuento)
                .input("atendido", mssql.VarChar(250), req.body.atendido)
                .input("porcentaje", mssql.VarChar(250), req.body.porcentaje)
                .input("ctipo_cambio", mssql.VarChar(250), req.body.tipo_cambio)
                .input("persona_contacto", mssql.VarChar(250), req.body.nombre_contacto)
                .input("erp_codune", mssql.VarChar(250), req.body.codigo_unidad_negocio)
                .input("cod_contact", mssql.VarChar(250), req.body.codigo_contacto)
                .input("glosa", mssql.VarChar(250), req.body.glosa)
                .input("erp_codage", mssql.VarChar(250), req.body.codigo_agencia)
                .input("usuario", mssql.VarChar(250), usuario)
                .input("Pc_User", mssql.VarChar(250), req.body.Pc_User)
                .input("Pc_Fecha", mssql.Date, req.body.Pc_Fecha)
                .input("Pc_Ip", mssql.VarChar(250), req.body.Pc_Ip)
                .input("erp_lista_comp", mssql.VarChar(250), req.body.lista_compras)
                .input("erp_titulo01", mssql.VarChar(250), req.body.erp_titulo01)
                .input("erp_titulo02", mssql.VarChar(250), req.body.erp_titulo02)
                .input("erp_titulo03", mssql.VarChar(250), req.body.erp_titulo03)
                .input("erp_titulo04", mssql.VarChar(250), req.body.erp_titulo04)
                .input("erp_titulo05", mssql.VarChar(250), req.body.erp_titulo05)
                .input("erp_titulo06", mssql.VarChar(250), req.body.erp_titulo06)
                .input("erp_titulo07", mssql.VarChar(250), req.body.erp_titulo07)
                .input("erp_titulo08", mssql.VarChar(250), req.body.erp_titulo08)
                .input("erp_motivo_req", mssql.VarChar(250), req.body.motivo_requerimiento)
                .input("erp_nro_req", mssql.VarChar(250), req.body.numero_requerimiento)
                .input("subtotal_sin_descuentos", mssql.VarChar(250), req.body.subtotal_sin_descuentos)
                .input("erp_Ddescuento", mssql.VarChar(250), req.body.erp_Ddescuento)
                .input("erp_Dsubtotal", mssql.VarChar(250), req.body.erp_Dsubtotal)
                .input("erp_Digv", mssql.VarChar(250), req.body.erp_Digv)
                .input("erp_Dimporte", mssql.VarChar(250), req.body.erp_Dimporte)
                .input("erp_Dpercepcion", mssql.VarChar(250), req.body.erp_Dpercepcion)
                .input("erp_Dtotal", mssql.VarChar(250), req.body.erp_Dtotal)
                .input("erp_nro_exp", mssql.VarChar(250), req.body.numero_expediente)
                .input("erp_nro_exp2", mssql.VarChar(250), req.body.numero_expediente_2)
                .input("erp_ptovta_ref2", mssql.VarChar(250), req.body.pto_venta_referencia)
                .input("situaprov", mssql.VarChar(250), req.body.situacion_aprobacion)
                .input("respaprov", mssql.VarChar(250), req.body.responsable_aprobacion)
                .input("fechaprov", mssql.Date, req.body.fecha_aprovacion)
                .input("comentaprov", mssql.VarChar(250), req.body.comentario_aprovacion)
                .query("UPDATE Hordcomc SET \n"+
                    "  automatico 	= @automatico \n"+ 
                    " ,ccod_proveedor 	= @ccod_proveedor \n"+ 
                    " ,cnom_proveedor 	= @cnom_proveedor \n"+ 
                    " ,direccion 	= @direccion \n"+ 
                    " ,lugar_entrega 	= @lugar_entrega \n"+ 
                    " ,fact_a_nombre 	= @fact_a_nombre \n"+ 
                    " ,dfecha_doc 	= @dfecha_doc \n"+ 
                    " ,fecha_validez 	= @fecha_validez \n"+ 
                    " ,dfecha_entr 	= @dfecha_entr \n"+ 
                    " ,tipocambio 	= @tipocambio \n"+ 
                    " ,nimporte 	= @nimporte \n"+ 
                    " ,ccod_forpago 	= @ccod_forpago \n"+ 
                    " ,estado 	= @estado \n"+
                    " ,cmoneda 	= @cmoneda \n"+
                    " ,ccod_cencos 	= @ccod_cencos \n"+ 
                    " ,si_igv 	= @si_igv \n"+
                    " ,ccod_incoterm 	= @ccod_incoterm \n"+ 
                    " ,seguro 	= @seguro \n"+
                    " ,flete 	= @flete \n"+
                    " ,otros 	= @otros \n"+
                    " ,nro_importacion 	= @nro_importacion \n"+ 
                    " ,nro_fact_comercial 	= @nro_fact_comercial \n"+ 
                    " ,dfecha_fact_comercial 	= @dfecha_fact_comercial \n"+ 
                    " ,ccod_ot 	= @ccod_ot \n"+
                    " ,pais 	= @pais \n"+
                    " ,n_orden_compra 	= @n_orden_compra \n"+ 
                    " ,tipo 	= @tipo \n"+
                    " ,responsable 	= @responsable \n"+ 
                    " ,comentario 	= @comentario \n"+ 
                    " ,comentario2 	= @comentario2 \n"+ 
                    " ,comentario3 	= @comentario3 \n"+ 
                    " ,comentario4 	= @comentario4 \n"+ 
                    " ,comentario5 	= @comentario5 \n"+ 
                    " ,comentario6 	= @comentario6 \n"+ 
                    " ,comentario7 	= @comentario7 \n"+
                    " ,descuento 	= @descuento \n"+
                    " ,atendido 	= @atendido \n"+
                    " ,porcentaje 	= @porcentaje \n"+ 
                    " ,ctipo_cambio 	= @ctipo_cambio \n"+ 
                    " ,persona_contacto 	= @persona_contacto \n"+ 
                    " ,erp_codune  	= @erp_codune \n"+ 
                    " ,cod_contact  	= @cod_contact \n"+ 
                    " ,glosa  	= @glosa \n"+
                    " ,erp_codage  	= @erp_codage \n"+ 
                    " ,usuario  	= @usuario \n"+
                    " ,Pc_User  	= @Pc_User \n"+
                    " ,Pc_Fecha  	= getdate() \n"+
                    " ,Pc_Ip  	= @Pc_Ip \n"+
                    " ,erp_lista_comp 	= @erp_lista_comp \n"+ 
                    " ,erp_titulo01 	= @erp_titulo01 \n"+ 
                    " ,erp_titulo02 	= @erp_titulo02 \n"+ 
                    " ,erp_titulo03 	= @erp_titulo03 \n"+ 
                    " ,erp_titulo04 	= @erp_titulo04 \n"+ 
                    " ,erp_titulo05 	= @erp_titulo05 \n"+ 
                    " ,erp_titulo06 	= @erp_titulo06 \n"+ 
                    " ,erp_titulo07 	= @erp_titulo07 \n"+ 
                    " ,erp_titulo08 	= @erp_titulo08 \n"+ 
                    " ,erp_motivo_req 	= @erp_motivo_req \n"+ 
                    " ,erp_nro_req 	= @erp_nro_req \n"+ 
                    " ,subtotal_sin_descuentos 	= @subtotal_sin_descuentos \n"+ 
                    " ,erp_Ddescuento 	= @erp_Ddescuento \n"+ 
                    " ,erp_Dsubtotal 	= @erp_Dsubtotal \n"+ 
                    " ,erp_Digv 	= @erp_Digv \n"+
                    " ,erp_Dimporte 	= @erp_Dimporte \n"+ 
                    " ,erp_Dpercepcion  	= @erp_Dpercepcion \n"+ 
                    " ,erp_Dtotal 	= @erp_Dtotal \n"+ 
                    " ,erp_nro_exp 	= @erp_nro_exp \n"+ 
                    " ,erp_nro_exp2 	= @erp_nro_exp2 \n"+ 
                    " ,erp_ptovta_ref2  	= @erp_ptovta_ref2 \n"+ 
                    " ,situaprov 	= @situaprov \n"+
                    " ,respaprov 	= @respaprov \n"+
                    " ,fechaprov 	= @fechaprov \n"+
                    " ,comentaprov	= @comentaprov \n"+
                    " where ccod_empresa = @ccod_empresa and \n"+
                    " erp_ptovta = @erp_ptovta and \n"+
                    " idmotivo_compra =  @idmotivo_compra \n"+
                    " and cnum_doc = @cnum_doc  ")
                //#endregion

                if(result_cabecera.rowsAffected>0){
                    //#region Borrar detalle
                    const request_detalle_borrar  = new mssql.Request(transaction);
                    await request_detalle_borrar
                    .input("ccod_empresa", mssql.VarChar(150), codigo_empresa)
                    .input("erp_ptovta", mssql.VarChar(150), codigo_punto_venta)
                    .input("idmotivo_venta", mssql.VarChar(150), req.body.motivo)
                    .input("cnum_doc", mssql.VarChar(150), req.body.numero_correlativo)
                    .query("DELETE FROM Hordcomd WHERE ccod_empresa =@ccod_empresa and erp_ptovta = @erp_ptovta and idmotivo_compra =@idmotivo_venta and cnum_doc = @cnum_doc")
                    //#endregion
                    //#region Grabar detalle   

                    for (let i= 0; i< filas_detalle.length; i++){
                        rowid = filas_detalle[i];
                        const request_detalle_registrar  = new mssql.Request(transaction);
                        await request_detalle_registrar
                        .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                        .input("erp_ptovta", mssql.VarChar(250), codigo_punto_venta)
                        .input("idmotivo_compra", mssql.VarChar(250), req.body.motivo)
                        .input("cnum_doc", mssql.VarChar(250), req.body.numero_correlativo)
                        .input("nitem", mssql.VarChar(250), i+1)
                        .input("ccod_articulo", mssql.VarChar(250), rowid.Codigo)
                        .input("cnom_articulo", mssql.VarChar(250), rowid.Nombre)
                        .input("cunidad", mssql.VarChar(250), rowid.Codigo_Unidad)
                        .input("factor", mssql.VarChar(250), rowid.Factor)
                        .input("ncantidad3", mssql.VarChar(250), rowid.Cantidad)
                        .input("ncantidad", mssql.VarChar(250), rowid.Cantidad_Kardex)
                        .input("npreciounitario", mssql.VarChar(250), rowid.Unit)
                        .input("nigv", mssql.VarChar(250), rowid.Igv_Art)
                        .input("barticulo", mssql.VarChar(250), rowid.Barticulo)
                        .input("cantidad_presentacion", mssql.VarChar(250), rowid.Cantidad_presentacion)
                        .input("nombre_presentacion", mssql.VarChar(250), rowid.Nombre_presentacion)
                        .input("unidad_presentacion", mssql.VarChar(250), rowid.Unidad_presentacion)
                        .input("precio_presentacion", mssql.VarChar(250), rowid.Precio_presentacion)
                        .input("ccod_cencos", mssql.VarChar(250), req.body.centro_costos)
                        .input("r_ot", mssql.VarChar(250), req.body.orden_trabajo)
                        .input("nbaseimpon", mssql.VarChar(250), rowid.Base_Imponible)
                        .input("nigvcalc", mssql.VarChar(250), rowid.Igv)
                        .input("base_calculada", mssql.VarChar(250), rowid.Base_Calculada)
                        .input("monto_descuento", mssql.VarChar(250), rowid.Monto_Descuento)
                        .input("nporcdesc", mssql.VarChar(250), rowid.Monto_Descuento)
                        .input("nprecio_importe", mssql.VarChar(250), rowid.Importe)
                        .input("precio_original", mssql.VarChar(250), rowid.Precio_original)
                        .input("erp_codune", mssql.VarChar(250), req.body.codigo_unidad_negocio)
                        .input("erp_codage", mssql.VarChar(250), req.body.codigo_agencia)
                        .input("flete", mssql.VarChar(250), req.body.flete)
                        .input("erp_nro_exp", mssql.VarChar(250), req.body.numero_expediente)
                        .input("percepcion_sn", mssql.VarChar(250), rowid.Percepcion_sn)
                        .input("percepcion_uni", mssql.VarChar(250), rowid.Percepcion_uni)
                        .input("erp_ptovta_req", mssql.VarChar(250), '')
                        .input("erp_motivo_req", mssql.VarChar(250), '')
                        .input("erp_nro_req", mssql.VarChar(250), '')
                        .input("item_requerimiento", mssql.VarChar(250), '')
                        .input("peso", mssql.VarChar(250), rowid.Peso)
                        .input("largo", mssql.VarChar(250), req.body.largo)
                        .input("ancho", mssql.VarChar(250), req.body.ancho)
                        .input("erp_codfab", mssql.VarChar(250), '')
                        .input("nro_fact_comercial", mssql.VarChar(250), req.body.numero_fact_comercial)
                        .input("nro_importacion", mssql.VarChar(250), req.body.numero_importacion)
                        .input("codigo_presentacion", mssql.VarChar(250), rowid.Codigo_presentacion)
                        .query("INSERT INTO Hordcomd \n"+
                            " (ccod_empresa \n"+
                            " ,erp_ptovta \n"+
                            " ,idmotivo_compra \n"+
                            " ,cnum_doc \n"+
                            " ,nitem \n"+
                            " ,ccod_articulo \n"+
                            " ,cnom_articulo \n"+
                            " ,cunidad \n"+
                            " ,factor \n"+
                            " ,ncantidad \n"+
                            " ,ncantidad3 \n"+
                            " ,npreciounitario \n"+
                            " ,nprecio_importe \n"+
                            " ,nigv \n"+
                            " ,ccod_cencos \n"+
                            " ,nbaseimpon \n"+
                            " ,nigvcalc \n"+
                            " ,nporcdesc \n"+
                            " ,monto_descuento \n"+
                            " ,r_ot \n"+
                            " ,barticulo \n"+
                            " ,largo \n"+
                            " ,ancho \n"+
                            " ,peso \n"+
                            " ,erp_codfab \n"+
                            " ,cantidad_presentacion \n"+
                            " ,unidad_presentacion \n"+
                            " ,nombre_presentacion \n"+
                            " ,percepcion_sn \n"+
                            " ,percepcion_uni \n"+
                            " ,precio_presentacion \n"+
                            " ,erp_ptovta_req \n"+
                            " ,erp_motivo_req \n"+
                            " ,erp_nro_req \n"+
                            " ,item_requerimiento \n"+
                            " ,erp_codune \n"+
                            " ,erp_codage \n"+
                            " ,flete \n"+
                            " ,erp_nro_exp \n"+
                            " ,nro_importacion \n"+
                            " ,nro_fact_comercial \n"+
                            " ,base_calculada \n"+
                            " ,codigo_presentacion) \n"+
                            " VALUES \n"+
                            " ( @ccod_empresa \n"+
                            " , @erp_ptovta \n"+
                            " , @idmotivo_compra \n"+
                            " , @cnum_doc \n"+
                            " , @nitem \n"+
                            " , @ccod_articulo \n"+
                            " , @cnom_articulo \n"+
                            " , @cunidad \n"+
                            " , @factor \n"+
                            " , @ncantidad \n"+
                            " , @ncantidad3 \n"+
                            " , @npreciounitario \n"+
                            " , @nprecio_importe \n"+
                            " , @nigv \n"+
                            " , @ccod_cencos \n"+
                            " , @nbaseimpon \n"+
                            " , @nigvcalc \n"+
                            " , @nporcdesc \n"+
                            " , @monto_descuento \n"+
                            " , @r_ot \n"+
                            " , @barticulo \n"+
                            " , @largo \n"+
                            " , @ancho \n"+
                            " , @peso \n"+
                            " , @erp_codfab \n"+
                            " , @cantidad_presentacion \n"+
                            " , @unidad_presentacion \n"+
                            " , @nombre_presentacion \n"+
                            " , @percepcion_sn \n"+
                            " , @percepcion_uni \n"+
                            " , @precio_presentacion \n"+
                            " , @erp_ptovta_req \n"+
                            " , @erp_motivo_req \n"+
                            " , @erp_nro_req \n"+
                            " , @item_requerimiento \n"+
                            " , @erp_codune \n"+
                            " , @erp_codage \n"+
                            " , @flete \n"+
                            " , @erp_nro_exp \n"+
                            " , @nro_importacion \n"+
                            " , @nro_fact_comercial \n"+
                            " , @base_calculada \n"+
                            " , @codigo_presentacion)")
                    };                          
                    //#endregion
                    
                    transaction.commit(tErr => {if(tErr) {console.log(tErr)}})
                    res.send({estado: true, codigo: 0, mensaje: ""});
                }else{
                    transaction.commit(tErr => {if(tErr) {console.log(tErr)}})
                    res.send({estado: false, codigo: 0, mensaje: "No se encuentra el documento para borrar"});
                }

            }catch(err){
                transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
                console.log(err.message);
                res.send({estado: false, codigo: "Err", mensaje: err.message});
            }
        });
    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
});

router.post('/eliminar', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.user.codigo_punto_venta;
        
        const pool = await poolPromise;
        const transaction = await new mssql.Transaction(pool);
        
        await transaction.begin(async err => {
            try{
                const request_detalle  = new mssql.Request(transaction);
                await request_detalle
                .input("ccod_empresa", mssql.VarChar(150), codigo_empresa)
                .input("erp_ptovta", mssql.VarChar(150), codigo_punto_venta)
                .input("idmotivo_venta", mssql.VarChar(150), req.body.motivo)
                .input("cnum_doc", mssql.VarChar(150), req.body.numero_correlativo)
                .query("DELETE FROM Hordcomd WHERE ccod_empresa =@ccod_empresa and erp_ptovta = @erp_ptovta and idmotivo_compra =@idmotivo_venta and cnum_doc = @cnum_doc")
                
                const request_cabecera = new mssql.Request(transaction);
                await request_cabecera 
                .input("ccod_empresa", mssql.VarChar(150), codigo_empresa)
                .input("erp_ptovta", mssql.VarChar(150), codigo_punto_venta)
                .input("idmotivo_venta", mssql.VarChar(150), req.body.motivo)
                .input("cnum_doc", mssql.VarChar(150), req.body.numero_correlativo)
                .query("DELETE FROM Hordcomc WHERE ccod_empresa =@ccod_empresa and erp_ptovta = @erp_ptovta and idmotivo_compra =@idmotivo_venta and cnum_doc = @cnum_doc")
                
                if( req.body.automatico == "A") {
                    serie_motivo = req.body.numero_correlativo.substr(-20,4)
                    numero_motivo = req.body.numero_correlativo.substr(-4) - 1

                    const request_automatico = new mssql.Request(transaction);
                    await request_automatico 
                    .input("erp_codemp", mssql.VarChar(150), codigo_empresa)
                    .input("erp_codmot", mssql.VarChar(150), req.body.motivo)
                    .input("erp_sermot", mssql.VarChar(150), serie_motivo)
                    .input("erp_nummot", mssql.VarChar(150), parseInt(numero_motivo))
                    .query("update Erp_motivos_tramite_detalle SET erp_nummot = @erp_nummot WHERE erp_codemp = @erp_codemp and erp_codmot = @erp_codmot and erp_sermot = @erp_sermot ")
                }
                transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
                res.send({estado: true, codigo: 0, mensaje: ""});   
            }catch(err){
                transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
                console.log(err.message);
                res.send({estado: false, codigo: "Err", mensaje: err.message});
            }
        });

    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
})

router.post('/lista', async (req, res) => {
    try {
 
        const codigo_empresa = req.user.codigo_empresa
        const codigo_punto_venta = req.user.codigo_punto_venta;

        switch (req.body.busqueda) {
            case "año_mes":
                var opcion = "and MONTH(Hordcomc.dfecha_doc) = @mes AND YEAR(Hordcomc.dfecha_doc) = @anio \n"
                break;
            case "rango_fechas":
                var opcion = "and Hordcomc.dfecha_doc between @fecha_inicio and @fecha_final \n"
                break;
            case "todos":
                var opcion = " \n"
                break;
        }

        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
        .input('anio', mssql.VarChar(250), req.body.anio)
        .input('mes', mssql.VarChar(250), req.body.meses)
        .input('fecha_inicio', mssql.VarChar(250), req.body.fecha_inicio)
        .input('fecha_final', mssql.VarChar(250), req.body.fecha_final)
        .query(
            "select \n"+
            "Halmacen.cnom_almacen as Punto_Venta, \n"+
            "'Orden de Compra' as Tipo_Compra, \n"+
            "Hordcomc.tipo as Tipo_Documento, \n"+
            "Erp_motivos_tramite.erp_nommot as Motivo_Serie, \n"+
            "Hordcomc.cnum_doc as Numero, \n"+
            "CONVERT(VARCHAR(50),Hordcomc.dfecha_doc,103) as Fecha, \n"+
            "Hordcomc.ccod_proveedor as Codigo_Proveedor, \n"+
            "Hordcomc.cnom_proveedor as Nombre_Proveedor, \n"+
            "CONVERT(VARCHAR(50),Hordcomc.dfecha_entr,103) as Fecha_Entrega, \n"+
            "'' as Fecha_Limite, \n"+
            "Hordcomc.ccod_forpago as Forma_Pago, \n"+
            "'' as Prioridad, \n"+
            "Hordcomc.cmoneda as Moneda, \n"+
            "Hordcomc.tipocambio as Tc, \n"+
            "Responsable.ccod_person as Codigo_Responsable, \n"+
            "Responsable.ape_pat +' '+ Responsable.ape_mat + ' '+ Responsable.nombres as Responsable, \n"+
            "Hordcomc.situaprov as Aprobacion_1, \n"+
            "Aprobacion1.ape_pat +' '+ Aprobacion1.ape_mat + ' '+ Aprobacion1.nombres as Usuario_Aprobacion_1, \n"+
            "REPLACE(Hordcomc.comentaprov,'<br>',' ') as Observacion_Aprobacion_1, \n"+
            "'' as Aprobacion_2, \n"+
            "'' as Usuario_Aprobacion_2, \n"+
            "Hordcomc.estado as Estado, \n"+
            "Hordcomc.atendido as Atencion, \n"+
            "Hordcomc.porcentaje as Porcentaje, \n"+
            "'REQ' as Documento_Referencia, \n"+
            "Hordcomc.erp_motivo_req as Serie_Notivo_Referencia, \n"+
            "Hordcomc.erp_nro_req as Numero_Referencia, \n"+
            "Hordcomc.glosa as glosa, \n"+
            "Hordcomc.si_igv as si_igv, \n"+
            "Hordcomc.erp_codune as Codigo_Unidad_Negocio, \n"+
            "Hordcomc.erp_codune as Unidad_Negocio, \n"+
            "Hordcomc.ccod_cencos as Cencos, \n"+
            "Hordcomc.ccod_ot as Ot, \n"+
            "erp_codage as Codigo_Agencia, \n"+
            "Hcencos.cnom_cencos as Nombre_Cencos, \n"+
            "'' as Nombre_Motivo, \n"+
            "Hordcomc.descuento as Porc_Descuento, \n"+
            "Hproveed.ctelefonos as Telefono_Proveedor, \n"+
            "Hordcomc.cod_contact as Codigo_Contacto, \n"+
            "Hordcomc.persona_contacto as Nombre_Contacto, \n"+
            "Hproveed.ce_mail as Correo_Proveedor, \n"+
            "hfor_pag.nro_dias as Dias_Forma_Pago, \n"+
            "Hordcomc.subtotal_sin_descuentos as Sub_Total_Sin_Descuentos, \n"+
            "Hordcomc.erp_Ddescuento as Monto_Descuento, \n"+
            "Hordcomc.erp_Dsubtotal as Sub_Total, \n"+
            "Hordcomc.erp_Digv as Igv, \n"+
            "Hordcomc.erp_Dimporte as Total, \n"+
            "'' as Codigo_Cliente, \n"+
            "'' as Nombre_Cliente, \n"+
            "Hordcomc.lugar_entrega as Punto_Llegada, \n"+
            "Hordcomc.direccion as Proveedor_Direccion, \n"+
            "Hordcomc.usuario as Usuario, \n"+
            "Hordcomc.Pc_User as Nombre_Pc, \n"+
            "Hordcomc.Pc_Fecha as Pc_Fecha, \n"+
            "Hordcomc.Pc_Ip as Pc_Ip, \n"+
            "Hordcomc.erp_nro_exp as Numero_Expediente, \n"+
            "Hordcomc.erp_nro_exp2 as Numero_Expediente_2, \n"+
            "Hordcomc.comentario as Comentario, \n"+
            "Hordcomc.erp_ptovta as Codigo_Punto_Venta, \n"+
            "Hordcomc.idmotivo_compra as Codigo_Motivo_Serie, \n"+
            "'OC' as Codigo_Tipo_Documento \n"+
            "FROM Hordcomc Inner Join erp_motivos_tramite \n"+
            "On Hordcomc.ccod_empresa = erp_motivos_tramite.erp_codemp and \n"+
            "Hordcomc.idmotivo_compra = erp_motivos_tramite.erp_codmot and \n"+
            "erp_motivos_tramite.erp_codtid= 'OC' \n"+
            "left join Hproveed on \n"+
            "Hordcomc.ccod_empresa = Hproveed.ccod_empresa \n"+
            "and Hordcomc.ccod_proveedor = Hproveed.ccod_proveedor \n"+
            "left Join Hperson as Aprobacion1 \n"+
            "On Hordcomc.ccod_empresa = Aprobacion1.ccod_empresa and \n"+
            "case Hordcomc.respaprov when '00' then '' else Hordcomc.respaprov end = Aprobacion1.ccod_person \n"+
            "left Join Hperson as Responsable \n"+
            "On Hordcomc.ccod_empresa = Responsable.ccod_empresa and \n"+
            "case Hordcomc.responsable when '00' then '' else Hordcomc.responsable end = Responsable.ccod_person \n"+
            "Inner Join Erp_Unidad_Negocio \n"+
            "On Hordcomc.ccod_empresa = Erp_Unidad_Negocio.erp_codemp and \n"+
            "Hordcomc.erp_codune = Erp_Unidad_Negocio.erp_codune \n"+
            "Inner Join Hcencos \n"+
            "On Hordcomc.ccod_empresa = Hcencos.ccod_empresa and \n"+
            "Hordcomc.ccod_cencos = Hcencos.ccod_cencos \n"+
            "Inner Join Horden_Trabajo \n"+
            "On Hordcomc.ccod_empresa = Horden_trabajo.ccod_empresa and \n"+
            "Hordcomc.ccod_ot = Horden_Trabajo.ccod_ot \n"+
            "Inner Join Halmacen \n"+
            "On Hordcomc.ccod_empresa = Halmacen.ccod_empresa and \n"+
            "Hordcomc.erp_ptovta = Halmacen.ccod_almacen \n"+
            "inner join hfor_pag \n"+
            "On Hordcomc.ccod_empresa = hfor_pag.ccod_empresa and \n"+
            "Hordcomc.ccod_forpago = hfor_pag.ccod_forpago \n"+
            "Where Hordcomc.ccod_empresa = @codigo_empresa \n"+opcion+
            "Order by   Erp_motivos_tramite.erp_nommot desc , Hordcomc.cnum_doc desc , Hordcomc.dfecha_doc \n"
        );
          
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/anular', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.user.codigo_punto_venta;
        
        const pool = await poolPromise
        const Detalle = await pool
        .request()
        .input("codigo_empresa", mssql.VarChar(250), codigo_empresa)
        .input("punto_venta", mssql.VarChar(250), codigo_punto_venta)
        .input("motivo_serie", mssql.VarChar(250), req.body.motivo)
        .input("numero_documento", mssql.VarChar(250), req.body.numero_correlativo)
        .query("Update Hordcomc set estado = 'Anulado' where  ccod_empresa = @codigo_empresa and erp_ptovta =@punto_venta and idmotivo_compra = @motivo_serie and cnum_doc = @numero_documento")

        res.send({estado: true, codigo: 0, mensaje: ""});
    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
})

router.post('/consultar', async (req, res) => {
    try {

        const codigo_empresa = req.user.codigo_empresa
        const motivo_documento = req.body.motivo_documento;
        const numero_documento = req.body.numero_documento;
        var codigo_punto_venta = req.body.codigo_punto_venta;

        if(codigo_punto_venta==""){
            codigo_punto_venta = req.user.codigo_punto_venta;
        }
        const pool = await poolPromise
        var lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(150), codigo_punto_venta)
        .input('motivo_documento', mssql.VarChar(150), motivo_documento)
        .input('numero_documento', mssql.VarChar(150), numero_documento)
        .query(
            "select \n"+
            "'ORDEN DE COMPRA' as documento_nombre, \n"+
            "Hordcomc.tipo as documento_tipo, \n"+
            "Hordcomc.erp_ptovta as documento_punto_venta_codigo, \n"+
            "'OC' as documento_tipo_movimiento, \n"+
            "LTRIM(RTRIM(Hordcomc.idmotivo_compra)) as documento_motivo_venta_codigo, \n"+
            "Hordcomc.cnum_doc as documento_numero, \n"+
            "CONVERT(VARCHAR(50), Hordcomc.dfecha_doc, 103) as documento_fecha, \n"+
            "CONVERT(VARCHAR(50), Hordcomc.fecha_validez, 103) as documento_fecha_validez, \n"+
            "CONVERT(VARCHAR(50), Hordcomc.dfecha_entr, 103) as documento_fecha_entrega, \n"+
            "CONVERT(VARCHAR(50), Hordcomc.dfecha_doc, 23) as documento_fecha_format23, \n"+
            "CONVERT(VARCHAR(50), Hordcomc.fecha_validez, 23) as documento_fecha_validez_format23, \n"+
            "CONVERT(VARCHAR(50), Hordcomc.dfecha_entr, 23) as documento_fecha_entrega_format23, \n"+
            "CONVERT(VARCHAR(50), Hordcomc.dfecha_fact_comercial, 103) as documento_fecha_fact_comercial, \n"+
            "CONVERT(VARCHAR(50), Hordcomc.dfecha_fact_comercial, 23) as documento_fecha_fact_comercial23, \n"+
            "Hordcomc.cmoneda as documento_moneda, \n"+
            "Hordcomc.nimporte as documento_nimporte, \n"+
            "RTRIM(LTRIM(Hordcomc.ccod_forpago)) as documento_forma_pago_codigo, \n"+
            "Hordcomc.ccod_proveedor as codigo_proveedor, \n"+
            "Hordcomc.cnom_proveedor as proveedor_nombre, \n"+
            "(case Hproveed.cnum_ruc when '' then Hordcomc.ccod_proveedor else Hproveed.cnum_ruc end) as proveedor_ruc, \n"+
            "Hordcomc.estado as documento_estado, \n"+
            "Hordcomc.si_igv as documento_mas_igv, \n"+
            "Hordcomc.ctipo_cambio as nombre_tipo_cambio, \n"+
            "Hordcomc.tipocambio as tipo_cambio, \n"+
            "Hordcomc.erp_lista_comp as documento_lista_precios, \n"+
            "'' AS documento_aprobacion_estado, \n"+
            "'' as documento_aprobacion_fecha, \n"+
            "'' as documento_aprobacion_codigo_responsable, \n"+
            "Hordcomc.responsable as documento_responsable, \n"+
            "(Responsable.ape_pat+' '+Responsable.ape_mat+' '+Responsable.nombres) as documento_nombre_responsable, \n"+
            "'' as documento_aprobacion_comentario, \n"+
            "(Responsable.imagen_firma) as documento_firma_responsable,\n"+
            "Hordcomc.comentario as Comentario01, \n"+
            "Hordcomc.comentario2 as Comentario02, \n"+
            "Hordcomc.comentario3 as Comentario03, \n"+
            "Hordcomc.comentario4 as Comentario04, \n"+
            "Hordcomc.comentario5 as Comentario05, \n"+
            "Hordcomc.comentario6 as Comentario06, \n"+
            "Hordcomc.comentario7 as Comentario07, \n"+
            "Hordcomc.ccod_cencos as documento_cencos_codigo, \n"+
            "Hordcomc.ccod_cencos as documento_cencos_codigo, \n"+
            "Hordcomc.descuento as documento_descuento_porc, \n"+
            "Hordcomc.ccod_ot as documento_ot_codigo, \n"+
            "Horden_trabajo.cnom_ot as documento_ot_nombre,\n"+
            "Hordcomc.lugar_entrega as documento_punto_llegada, \n"+
            "'0' as documento_dias, \n"+
            "LTRIM(RTRIM(Hordcomc.pais)) as proveedor_pais, \n"+
            "Hordcomc.atendido as documento_atencion_estado, \n"+
            "Hordcomc.porcentaje as documento_atencion_porcentaje, \n"+
            "'' as proveedor_contacto_codigo, \n"+
            "LTRIM(RTRIM(Hordcomc.cod_contact)) as documento_contacto_codigo, \n"+
            "LTRIM(RTRIM(Hordcomc.persona_contacto)) as documento_contacto_nombre, \n"+
            "Hordcomc.glosa as documento_glosa, \n"+
            "isnull(Hordcomc.erp_codage, '00 - Ninguno') as proveedor_agencia, \n"+
            "Hordcomc.usuario as usuario_codigo, \n"+
            "Hordcomc.Pc_User as pc_user, \n"+
            "Hordcomc.Pc_Fecha as pc_fecha, \n"+
            "Hordcomc.Pc_Ip as pc_ip, \n"+
            "Hordcomc.subtotal_sin_descuentos as documento_subtotal_sin_descuentos, \n"+
            "Hordcomc.erp_Ddescuento as documento_descuento, \n"+
            "Hordcomc.erp_Dsubtotal as documento_subtotal, \n"+
            "Hordcomc.erp_Digv as documento_igv, \n"+
            "Hordcomc.erp_Dimporte as documento_importe, \n"+
            "Hordcomc.erp_Dpercepcion as documento_percepcion, \n"+
            "Hordcomc.erp_Dtotal as documento_total, \n"+
            "'' as documento_referencia_motivo_codigo, \n"+
            "LTRIM(RTRIM(Hordcomc.persona_contacto)) as proveedor_contacto_nombre, \n"+
            "(Aprobacion1.ape_pat+' '+Aprobacion1.ape_mat+' '+Aprobacion1.nombres) as documento_aprobacion1, \n"+
            "(Aprobacion1.imagen_firma) as documento_firma_Aprobacion1,\n"+
            "Hordcomc.erp_codune as unidad_negocio_codigo, \n"+
            "'' as documento_nombre_unidad_negocio,\n"+
            "case Hordcomc.erp_motivo_req when '' then '' else 'REQ' end as documento_tipo_referencia, \n"+
            "Hordcomc.erp_motivo_req as Origen_Serie_referencia, \n"+
            "Hordcomc.erp_nro_req as documento_numero_referencia, \n"+
            "Hordcomc.automatico as documento_automatico, \n"+
            "Hordcomc.nro_importacion as documento_numero_importacion, \n"+
            "Hordcomc.erp_nro_exp as documento_numero_expediente, \n"+
            "Hordcomc.erp_nro_exp2 as documento_numero_expediente_2, \n"+
            "Hordcomc.nro_fact_comercial as documento_invoice, \n"+
            "LTRIM(RTRIM(Hordcomc.ccod_incoterm)) as documento_incoterm, \n"+
            "Hordcomc.fact_a_nombre as documento_factura_a_nombre, \n"+
            "Hordcomc.erp_motivo_req as requerimiento_motivo, \n"+
            "Hordcomc.erp_nro_req as requerimiento_numero, \n"+
            "--proveedor \n"+
            "Hproveed.cdireccion as proveedor_direccion, \n"+
            "Hproveed.ctelefonos as proveedor_telefono, \n"+
            "Hproveed.cfax as proveedor_fax, \n"+
            "Hproveed.ce_mail as proveedor_correo, \n"+
            "Hproveed.pais as pais_proveedor, \n"+
            "--Forma Pago \n"+
            "Hfor_pag.cnom_forpago as forma_pago_nombre, \n"+
            "--Detalle \n"+
            "Hordcomd.nitem as detalle_orden, \n"+
            "Hordcomd.ccod_articulo as articulo_codigo, \n"+
            "Hordcomd.cnom_articulo as articulo_nombre, \n"+
            "Hordcomd.cunidad as articulo_unidad, \n"+
            "Hordcomd.nigv as articulo_igv_porcentaje, \n"+
            "Hordcomd.factor as articulo_factor, \n"+
            "Hordcomd.ncantidad as articulo_kardex, \n"+
            "Hordcomd.ncantidad3 as articulo_cantidad, \n"+
            "Hordcomd.precio_presentacion as articulo_precio, \n"+
            "Hordcomd.nigvcalc as articulo_igv, \n"+
            "'' as articulo_descuento1, \n"+
            "Hordcomd.barticulo as articulo_barticulo, \n"+
            "Hordcomd.cantidad_presentacion as articulo_presentacion_cantidad, \n"+
            "Hordcomd.nombre_presentacion as articulo_presentacion_nombre, \n"+
            "Hordcomd.unidad_presentacion as articulo_presentacion_unidad, \n"+
            "Hordcomd.precio_presentacion as articulo_presentacion_precio, \n"+
            "Hordcomd.NBASEIMPON as articulo_base_imponible, \n"+
            "Hordcomd.base_calculada as articulo_base_calculada, \n"+
            "Hordcomd.monto_descuento as articulo_monto_descuento, \n"+
            "Hordcomd.NPRECIO_IMPORTE as articulo_importe, \n"+
            "Hordcomd.npreciounitario as articulo_precio_original, \n"+
            "'0' as articulo_descuento3, \n"+
            "'0' as articulo_descuento4, \n"+
            "Halmacen_2.ccod_almacen as articulo_almacen_codigo, \n"+
            "Hordcomd.base_calculada as articulo_base_calculada_dec, \n"+
            "Hordcomd.nbaseimpon as articulo_base_imponible_dec, \n"+
            "Hordcomd.nigvcalc as articulo_igv_dec, \n"+
            "Hordcomd.nprecio_importe as articulo_importe_dec, \n"+
            "Hordcomd.codigo_presentacion as articulo_presentacion_codigo, \n"+
            "0 as documento_total_productos,\n"+
            "--Empresa \n"+
            "Hempresa.ccod_empresa as empresa_codigo, \n"+
            "Hempresa.crazonsocial as empresa_razon_social, \n"+
            "Hempresa.rutadelogo as empresa_ruta_logo, \n"+
            "Hempresa.fax_3 as empresa_logo, \n"+
            "hempresa.nro_cuenta_mn as empresa_cuenta1, \n"+
            "hempresa.nro_cuenta_me as empresa_cuenta2, \n"+
            "hempresa.ctelefono as empresa_telefono, \n"+
            "hempresa.cpag_web as empresa_web, \n"+
            "hempresa.cnum_ruc as empresa_ruc, \n"+
            "hempresa.cdireccion as empresa_direccion, \n"+
            "hempresa.cemail as empresa_correo, \n"+
            "--Facturación Electrónica \n"+
            "'' as documento_qr \n"+
            "from Hordcomc \n"+
            "left join Hordcomd on \n"+
            "Hordcomc.ccod_empresa = Hordcomd.ccod_empresa \n"+
            "and Hordcomc.erp_ptovta = Hordcomd.erp_ptovta \n"+
            "and Hordcomc.idmotivo_compra = Hordcomd.idmotivo_compra \n"+
            "and Hordcomc.cnum_doc = Hordcomd.cnum_doc \n"+
            "inner join Hproveed on \n"+
            "Hordcomc.ccod_empresa = Hproveed.ccod_empresa \n"+
            "and Hordcomc.ccod_proveedor = Hproveed.ccod_proveedor \n"+
            "inner join Hfor_pag on \n"+
            "Hordcomc.ccod_empresa = Hfor_pag.ccod_empresa \n"+
            "and Hordcomc.ccod_forpago = Hfor_pag.ccod_forpago \n"+
            "inner join Hempresa on \n"+
            "Hordcomc.ccod_empresa = Hempresa.ccod_empresa \n"+
            "inner join Halmacen on \n"+
            "Halmacen.ccod_empresa = Hordcomd.ccod_empresa and \n"+
            "Halmacen.ccod_almacen = Hordcomd.erp_ptovta \n"+
            "inner join Halmacen_2 on \n"+
            "Halmacen_2.ccod_empresa = Hordcomd.ccod_empresa and \n"+
            "Halmacen_2.ccod_almacen = Hordcomd.erp_ptovta \n"+
            "inner join Horden_trabajo on  \n"+
            "Hordcomc.ccod_empresa = Horden_trabajo.ccod_empresa  \n"+
            "and Hordcomc.ccod_ot = Horden_trabajo.ccod_ot  \n"+
            "inner join Hperson Responsable on \n"+
            "Hordcomc.ccod_empresa = Responsable.ccod_empresa \n"+
            "and Hordcomc.responsable = Responsable.ccod_person\n"+
            "inner join Hperson Aprobacion1 on \n"+
            "Hordcomc.ccod_empresa = Aprobacion1.ccod_empresa \n"+
            "and Hordcomc.respaprov = Aprobacion1.ccod_person\n"+
            "where \n"+
            "Hordcomc.ccod_empresa = @codigo_empresa \n"+
            "and Hordcomc.erp_ptovta = @codigo_punto_venta \n"+
            "and Hordcomc.idmotivo_compra = @motivo_documento \n"+
            "and Hordcomc.cnum_doc = @numero_documento \n"
        );

        const recordset = lista.recordset;
        res.json(recordset);
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/lista_documentos_aprobacion', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa
        const codigo_punto_venta = req.user.codigo_punto_venta;
        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
        .input('estado', mssql.VarChar(50), req.body.estado)
        .query(
            "SELECT \n"+
            "Halmacen.cnom_almacen as Punto_Venta, \n"+
            "erp_motivos_tramite.erp_nommot as Motivo_Serie, \n"+
            "CONVERT(VARCHAR(50),Hordcomc.dfecha_doc,3) as Fecha, \n"+
            "CONVERT(VARCHAR(50),Hordcomc.dfecha_entr,3) as Fecha_Entrega, \n"+
            "Hordcomc.ccod_proveedor as Codigo_Proveedor, \n"+
            "Hordcomc.cnom_proveedor as Proveedor, \n"+
            "Hordcomc.ccod_cencos as Codigo_Centro_Costo, \n"+
            "Hcencos.cnom_cencos as Centro_Costo, \n"+
            "Hordcomc.ccod_ot as Codigo_Orden_Trabajo, \n"+
            "Horden_trabajo.cnom_ot as Orden_Trabajo, \n"+
            "Hordcomc.erp_codune as Codigo_Unidad_Negocio, \n"+
            "erp_unidad_negocio.erp_nomune as Unidad_Negocio, \n"+
            "Hfor_pag.cnom_forpago as Forma_Pago, \n"+
            "Hordcomc.cmoneda as Moneda, \n"+
            "Hordcomc.tipocambio as Tipo_Cambio, \n"+
            "Hordcomc.nimporte as Importe, \n"+
            "'' as Vendedor, \n"+
            "Hordcomc.estado as Estado, \n"+
            "Hordcomc.situaprov as Aprobado, \n"+
            "case Hordcomc.situaprov when 'Sin Aprobacion' \n"+
            "then '' \n"+
            "else (ltrim(rtrim(Hperson.Ape_pat)) + ' ' + ltrim(rtrim(ape_mat)) + ' ' + ltrim(rtrim(nombres))) end \n"+
            "as Persona_Aprobado, \n"+
            "case Hordcomc.situaprov when 'Sin Aprobacion' \n"+
            "then '' \n"+
            "else CONVERT(VARCHAR(50),Hordcomc.fechaprov,3) end \n"+
            "as Fecha_Aprobado, \n"+
            "Hordcomc.atendido as Atencion, \n"+
            "Hordcomc.porcentaje as Porcentaje, \n"+
            "Hordcomc.usuario as Usuario, \n"+
            "Hordcomc.Pc_User as Nombre_Pc, \n"+
            "CONVERT(VARCHAR,Hordcomc.Pc_Fecha,3) as Fecha_Grab, \n"+
            "CONVERT(VARCHAR,Hordcomc.Pc_Fecha,24) as Hora_Grab, \n"+
            "Hordcomc.Pc_Ip as Ip_Pc, \n"+
            "LTRIM(RTRIM(Hordcomc.idmotivo_compra)) as Codigo_Motivo_Serie, \n"+
            "Hordcomc.cnum_doc as Numero, \n"+
            "Hordcomc.erp_ptovta as Codigo_Punto_Venta \n"+
            "FROM Hordcomc INNER JOIN Halmacen ON \n"+
            "Hordcomc.ccod_empresa = Halmacen.ccod_empresa and \n"+
            "Hordcomc.erp_ptovta = Halmacen.ccod_almacen \n"+
            "INNER JOIN erp_motivos_tramite ON \n"+
            "Hordcomc.ccod_empresa = erp_motivos_tramite.erp_codemp and \n"+
            "Hordcomc.erp_ptovta = erp_motivos_tramite.erp_codmot \n"+
            "Inner Join hfor_pag ON \n"+
            "Hordcomc.ccod_empresa = Hfor_pag.ccod_empresa and \n"+
            "Hordcomc.ccod_forpago = Hfor_pag.ccod_forpago \n"+
            "Inner Join hperson On \n"+
            "Hordcomc.ccod_empresa = Hperson.ccod_empresa and \n"+
            "Hordcomc.respaprov = Hperson.ccod_person \n"+
            "Inner Join Hcencos On \n"+
            "Hordcomc.ccod_empresa = Hcencos.ccod_empresa and \n"+
            "Hordcomc.ccod_cencos  = Hcencos.ccod_cencos \n"+
            "Inner Join Horden_trabajo On \n"+
            "Hordcomc.ccod_empresa = Horden_trabajo.ccod_empresa and \n"+
            "Hordcomc.ccod_ot  = Horden_trabajo.ccod_ot \n"+
            "Inner Join erp_unidad_negocio On \n"+
            "Hordcomc.ccod_empresa = erp_unidad_negocio.erp_codemp and \n"+
            "Hordcomc.erp_codune  = erp_unidad_negocio.erp_codune \n"+
            "WHERE Hordcomc.ccod_empresa = @codigo_empresa AND \n"+
            "Hordcomc.erp_ptovta = @codigo_punto_venta AND \n"+
            "Hordcomc.situaprov = @estado \n"+
            // "order by dfecha_doc desc,idmotivo_compra,cnum_doc desc \n"
            "order by dfecha_doc desc, cnum_doc desc \n"
        );
          
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/aprobaciones', async (req, res) => {
    try{
        var rowsAffected=0;
        const codigo_empresa = req.user.codigo_empresa;
        var filas = JSON.parse(req.body.fila)
        const pool = await poolPromise;
        var lista;
        for (let i= 0; i< filas.length; i++){
            lista = await pool
            .request()
            .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
            .input('estado', mssql.VarChar(250), req.body.aprobacion)
            .input('responsable', mssql.VarChar(250), req.body.responsable)
            .input('comentario', mssql.VarChar(250), req.body.comentario)
            .input('punto_venta', mssql.VarChar(250), filas[i].Codigo_Punto_Venta)
            .input('motivo', mssql.VarChar(250), filas[i].Codigo_Motivo_Serie)
            .input('numero', mssql.VarChar(250), filas[i].Numero)
            .input('fecha', mssql.Date, req.body.fecha)
            .query("update Hordcomc set situaprov = @estado, respaprov = @responsable, comentaprov = @comentario, fechaprov = @fecha where ccod_empresa=@codigo_empresa and erp_ptovta=@punto_venta and idmotivo_compra=@motivo and cnum_doc=@numero");
            rowsAffected++;
        }
        
        res.send({estado: true, codigo: "0", mensaje: rowsAffected});
    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
});

router.post('/lista_documentos_pendientes', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa
        const codigo_punto_venta = req.user.codigo_punto_venta;
        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_proveedor', mssql.VarChar(250), req.body.codigo)
        .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
        .input('codigo', mssql.VarChar(250), req.body.codigo)
        .input('todos', mssql.VarChar(250), req.body.todos)
        .query(
            "Select \n"+
            "Hordcomc.erp_ptovta as Punto_Venta, \n"+
            "Hordcomc.tipo as Tipo_Compra, \n"+
            "'OC' as Tipo_Documento, \n"+
            "Rtrim(Ltrim(Hordcomc.idmotivo_compra)) as Codigo_Motivo_Serie, \n"+
            "Hordcomc.cnum_doc as Numero, \n"+
            "CONVERT(VARCHAR(50),Hordcomc.dfecha_doc,103) as Fecha, \n"+
            "Rtrim(Ltrim(Hordcomc.ccod_proveedor)) as Codigo_Proveedor, \n"+
            "Hordcomc.cnom_proveedor as Nombre_Proveedor, \n"+
            "CONVERT(VARCHAR(50),Hordcomc.dfecha_entr,103) as Fecha_Entrega, \n"+
            "'' as Fecha_Limite, \n"+
            "Rtrim(Ltrim(Hordcomc.ccod_forpago)) as Forma_Pago, \n"+
            "'' as Prioridad, \n"+
            "Hordcomc.cmoneda as Moneda, \n"+
            "Hordcomc.tipocambio as Tc, \n"+
            "hcencos.ccod_cencos as Cencos, \n"+
            "Hordcomc.ccod_ot as Ot, \n"+
            "Hordcomc.responsable as Codigo_Responsable, \n"+
            "Hordcomc.erp_codune as Codigo_Unidad_Negocio, \n"+
            "Hordcomc.erp_codage as Codigo_Agencia, \n"+
            "Hordcomc.glosa as glosa, \n"+
            "Hordcomc.si_igv as si_igv, \n"+
            "(hcencos.cnom_cencos) as Nombre_Cencos, \n"+
            "(ERP_MOTIVOS_TRAMITE.erp_nommot) as Nombre_Motivo, \n"+
            "Hordcomc.descuento as Porc_Descuento, \n"+
            "Hproveed.ctelefonos as Telefono_Proveedor, \n"+
            "Rtrim(Ltrim(Hordcomc.cod_contact)) as Codigo_Contacto, \n"+
            "Hordcomc.persona_contacto as Nombre_Contacto, \n"+
            "Hproveed.ce_mail as Correo_Proveedor, \n"+
            "Hfor_pag.nro_dias as Dias_Forma_Pago, \n"+
            "Hordcomc.subtotal_sin_descuentos as Sub_Total_Sin_Descuentos, \n"+
            "Hordcomc.erp_Ddescuento as Monto_Descuento, \n"+
            "Hordcomc.erp_Dsubtotal as Sub_Total, \n"+
            "Hordcomc.erp_Digv as Igv, \n"+
            "Hordcomc.erp_Dimporte as Total, \n"+
            "Hordcomc.lugar_entrega as Punto_Llegada, \n"+
            "Hordcomc.direccion as Proveedor_Direccion, \n"+
            "Hordcomc.erp_nro_exp as Numero_Expediente, \n"+
            "Hordcomc.erp_nro_exp2 as Numero_Expediente_2, \n"+
            "Hordcomc.erp_motivo_req as Referencia_Requerimiento_Motivo, \n"+
            "Hordcomc.erp_nro_req as Referencia_Requerimiento_Numero, \n"+
            "'REQ' as Tipo_Referencia_Documento, \n"+
            "Hordcomc.erp_motivo_req as Motivo_Serie_Referencia_Documento, \n"+
            "Hordcomc.erp_nro_req as Numero_Referencia_Documento \n"+
            "From Hordcomc \n"+
            "Inner Join Hproveed On \n"+
            "Hordcomc.ccod_empresa = Hproveed.ccod_empresa And \n"+
            "Hordcomc.ccod_proveedor = Hproveed.ccod_proveedor \n"+
            "inner join Hfor_pag on \n"+
            "Hordcomc.ccod_empresa = Hfor_pag.ccod_empresa and \n"+
            "Hordcomc.ccod_forpago = Hfor_pag.ccod_forpago \n"+
            "Inner Join hcencos On \n"+
            "Hordcomc.ccod_cencos = hcencos.ccod_cencos And \n"+
            "Hordcomc.ccod_empresa = hcencos.ccod_empresa \n"+
            "Inner Join ERP_MOTIVOS_TRAMITE on \n"+
            "Hordcomc.ccod_empresa= ERP_MOTIVOS_TRAMITE.erp_codemp And \n"+
            "Hordcomc.idmotivo_compra = ERP_MOTIVOS_TRAMITE.erp_codmot \n"+
            "inner join Hconfiguraciones_2 on \n"+
            "Hordcomc.ccod_empresa= Hconfiguraciones_2.idempresa \n"+
            "Where Hordcomc.ccod_empresa = @codigo_empresa And \n"+
            "Hordcomc.erp_ptovta = @codigo_punto_venta AND \n"+
            "hordcomc.pais ='001' and \n"+
            "case @todos when 'S' then '' else Hordcomc.atendido end <> 'Atendido' \n"+
            "and Hordcomc.estado <> 'Anulado' \n"+
            "and Hordcomc.situaprov ='Aprobado' \n"+
            "and Hordcomc.ccod_proveedor = \n"+
            "(case when @codigo = '' then Hordcomc.ccod_proveedor else case @todos when 'S' then Hordcomc.ccod_proveedor else @codigo end end ) \n"+
            "Order By Hordcomc.dfecha_doc desc,Hordcomc.cnum_doc desc \n"
            
        );    
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/lista_detalle_pendientes', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa
        const codigo_punto_venta = req.user.codigo_punto_venta;
        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('punto_venta', mssql.VarChar(200), req.body.punto_venta)
        .input('motivo_serie', mssql.VarChar(200), req.body.motivo_serie)
        .input('numero', mssql.VarChar(200), req.body.numero)
        .query(
            
            "select \n"+
            "Cantidad_Por_Atender - \n"+
            "case Cantidad_Atendida when -1 then 0 else Cantidad_Atendida end as Cantidad, \n"+
            "Cantidad_Kardex_Por_Atender - \n"+
            "case Cantidad_Kardex_Atendida when -1 then 0 else Cantidad_Kardex_Atendida end as Cantidad_Kardex, \n"+
            "* from ( \n"+
            "SELECT \n"+
            "Hordcomd.erp_ptovta as Punto_Venta, \n"+
            "Hordcomd.idmotivo_compra as Codigo_Motivo_Serie, \n"+
            "Hordcomd.cnum_doc as Numero, \n"+
            "Hordcomd.nitem as NItem, \n"+
            "Hordcomd.NCANTIDAD3 as Cantidad_Por_Atender, \n"+
            "isnull(( \n"+
            "select sum(ncantidad3) from Hmoviald \n"+
            "inner join Hmovialc on \n"+
            "Hmovialc.ccod_empresa = Hmoviald.ccod_empresa \n"+
            "and Hmovialc.ccod_almacen = Hmoviald.ccod_almacen \n"+
            "and Hmovialc.ccod_movimiento = Hmoviald.CCOD_MOVIMIENTO \n"+
            "and Hmovialc.cnum_serie = Hmoviald.CNUM_SERIE \n"+
            "and Hmovialc.cnum_doc = Hmoviald.cnum_doc \n"+
            "and Hmovialc.tipo_venta like '%orden de compra%' \n"+
            "where \n"+
            "Hmoviald.ccod_empresa = Hordcomd.ccod_empresa \n"+
            "and Hmoviald.motivo_pedido = Hordcomd.idmotivo_compra \n"+
            "and Hmoviald.doc_origen_pedido = Hordcomd.cnum_doc \n"+
            "and Hmoviald.ccod_almacen = Hordcomd.erp_ptovta \n"+
            "and Hmovialc.estado <> 'Anulado' \n"+
            "and Hmoviald.ccod_articulo = Hordcomd.ccod_articulo \n"+
            "and Hmoviald.cunidad = Hordcomd.cunidad \n"+
            "and Hmoviald.origen_item = Hordcomd.nitem \n"+
            "),-1) as Cantidad_Atendida, \n"+
            "Hordcomd.CCOD_ARTICULO AS Codigo, \n"+
            "Harticul.ccod_almacen as Tipo_producto, \n"+
            "Harticul.cfamilia as Familia, \n"+
            "Harticul.ccod_subfamilia as Subfamilia, \n"+
            "harticul.codmarca as Codigo_Concepto1, \n"+
            "erp_concepto1.erp_nomcon as Concepto1, \n"+
            "harticul.modelo as Concepto2, \n"+
            "harticul.color as Concepto3, \n"+
            "harticul.tratamiento as Concepto4, \n"+
            "harticul.fuelle as Concepto5, \n"+
            "harticul.azas as Concepto6, \n"+
            "harticul.solapa as Concepto7, \n"+
            "harticul.ccod_interno as Codigo_Fabricante, \n"+
            "harticul.cod_digemir as Codigo_Digemid, \n"+
            "harticul.erp_codinterno2 as Codigo_Interno, \n"+
            "harticul.erp_codinterno3 as Codigo_Interno2, \n"+
            "harticul.observacion as Leyenda1, \n"+
            "harticul.erp_observacion2 as Leyenda2, \n"+
            "Hordcomd.CNOM_ARTICULO AS Nombre, \n"+
            "RTRIM(Hordcomd.CUNIDAD) AS Codigo_Unidad, \n"+
            "RTRIM(Hordcomd.CUNIDAD) AS Unidad, \n"+
            "'0' as Comision_porcentaje, \n"+
            "Hordcomd.factor as Factor, \n"+
            "Hordcomd.npreciounitario as Unit, \n"+
            "Hordcomd.nbaseimpon as Base_Imponible, \n"+
            "Hordcomd.nporcdesc as Desc1, \n"+
            "'0' as Desc2, \n"+
            "'0' As Desc3, \n"+
            "'0' as Desc4, \n"+
            "'0' as Base_Calculada, \n"+
            "Hordcomd.nigvcalc as Igv, \n"+
            "Hordcomd.nprecio_importe as Importe, \n"+
            "'0' as Peso, \n"+
            "Halmacen_2.ccod_almacen as Codigo_Almacen, \n"+
            "Halmacen_2.cnom_almacen as Almacen, \n"+
            "Hordcomd.cantidad_presentacion as Cantidad_presentacion, \n"+
            "Hordcomd.codigo_presentacion as Codigo_presentacion, \n"+
            "RTRIM(Hordcomd.unidad_presentacion) AS Unidad_presentacion, \n"+
            "Hordcomd.nombre_presentacion AS Nombre_presentacion, \n"+
            "Hordcomd.precio_presentacion as Precio_presentacion, \n"+
            "'' as Observacion, \n"+
            "Hordcomd.r_ot as OT, \n"+
            "'' as ICBPER, \n"+
            "Hordcomd.NCANTIDAD as Cantidad_Kardex_Por_Atender, \n"+
            "isnull(( \n"+
            "select sum(ncantidad) from Hmoviald \n"+
            "inner join Hmovialc on \n"+
            "Hmovialc.ccod_empresa = Hmoviald.ccod_empresa \n"+
            "and Hmovialc.ccod_almacen = Hmoviald.ccod_almacen \n"+
            "and Hmovialc.ccod_movimiento = Hmoviald.CCOD_MOVIMIENTO \n"+
            "and Hmovialc.cnum_serie = Hmoviald.CNUM_SERIE \n"+
            "and Hmovialc.cnum_doc = Hmoviald.cnum_doc \n"+
            "and Hmovialc.tipo_venta like '%orden de compra%' \n"+
            "where \n"+
            "Hmoviald.ccod_empresa = Hordcomd.ccod_empresa \n"+
            "and Hmoviald.motivo_pedido = Hordcomd.idmotivo_compra \n"+
            "and Hmoviald.doc_origen_pedido = Hordcomd.cnum_doc \n"+
            "and Hmoviald.ccod_almacen = Hordcomd.erp_ptovta \n"+
            "and Hmovialc.estado <> 'Anulado' \n"+
            "and Hmoviald.ccod_articulo = Hordcomd.ccod_articulo \n"+
            "and Hmoviald.cunidad = Hordcomd.cunidad \n"+
            "and Hmoviald.origen_item = Hordcomd.nitem \n"+
            "),-1) as Cantidad_Kardex_Atendida, \n"+
            "Hordcomd.barticulo as Barticulo, \n"+
            "Hordcomd.nigv as Igv_Art, \n"+
            "Hordcomd.monto_descuento as Monto_Descuento, \n"+
            "Hordcomd.npreciounitario as Precio_original, \n"+
            "Hordcomd.erp_codune as Codigo_Unidad_Negocio, \n"+
            "Hordcomd.erp_codune as Unidad_negocio, \n"+
            "Hordcomd.ccod_cencos AS Codigo_Cencos, \n"+
            "Hordcomd.ccod_cencos AS Cencos, \n"+
            "'' as Codigo_Partida_presupuestal, \n"+
            "'' as Partida_presupuestal, \n"+
            "Hordcomd.erp_codage as Codigo_Agencia, \n"+
            "Hordcomd.erp_codage as Agencia, \n"+
            "Hordcomd.percepcion_sn as Percepcion_sn, \n"+
            "Hordcomd.percepcion_uni as Percepcion_uni, \n"+
            "'' as Perpecion_porc, \n"+
            "'' as Boni_sn, \n"+
            "'' as Item_boni, \n"+
            "'' as Comision_monto, \n"+
            "'0' as Base_calculada_dec, \n"+
            "Hordcomd.nbaseimpon as Base_imp_dec, \n"+
            "Hordcomd.nigvcalc as Igv_dec, \n"+
            "Hordcomd.nprecio_importe as Importe_dec, \n"+
            "Harticul.csistock as Stock_SN, \n"+
            "Harticul.lote as Lote_SN, \n"+
            "'' as Lote_Numero, \n"+
            "'' as Lote_Vencimiento, \n"+
            "Harticul.flagserie Serie_SN, \n"+
            "'' as Serie_Numero, \n"+
            "Hordcomd.erp_motivo_req as Requerimiento_Motivo, \n"+
            "Hordcomd.erp_nro_req as Requerimiento_Numero, \n"+
            "Hordcomd.idmotivo_compra as Orden_Compra_Motivo, \n"+
            "Hordcomd.cnum_doc as Orden_Compra_Numero, \n"+
            "'OC' as Origen_Documento, \n"+
            "Hordcomd.erp_ptovta as Origen_Punto_Venta, \n"+
            "Hordcomd.idmotivo_compra as Origen_Motivo_Serie, \n"+
            "Hordcomd.cnum_doc as Origen_Numero, \n"+
            "Hordcomd.nitem  as Origen_NItem \n"+
            "FROM Hordcomd inner Join Harticul On \n"+
            "Hordcomd.ccod_empresa = Harticul.ccod_empresa and \n"+
            "Hordcomd.ccod_articulo = Harticul.ccod_articulo \n"+
            "inner join erp_concepto1 on \n"+
            "erp_concepto1.erp_codemp = Harticul.ccod_empresa and \n"+
            "erp_concepto1.erp_codcon = Harticul.codmarca \n"+
            "inner join Halmacen on \n"+
            "Halmacen.ccod_empresa = Hordcomd.ccod_empresa and \n"+
            "Halmacen.ccod_almacen = Hordcomd.erp_ptovta \n"+
            "inner join Halmacen_2 on \n"+
            "Halmacen_2.ccod_empresa = Hordcomd.ccod_empresa and \n"+
            "Halmacen_2.ccod_almacen = Hordcomd.erp_ptovta \n"+
            "WHERE \n"+
            "Hordcomd.ccod_empresa = @codigo_empresa and \n"+
            "Hordcomd.idmotivo_compra = @motivo_serie and \n"+
            "Hordcomd.cnum_doc = @numero and \n"+
            "Hordcomd.erp_ptovta = @punto_venta \n"+
            ") as tablita \n"+
            "where \n"+
            "Cantidad_Por_Atender > Cantidad_Atendida \n"+
            "ORDER BY NITEM \n"
        );
          
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/eliminar_saldos', async (req, res) => {
    try {
        const filas_detalle=JSON.parse(req.body.datos);
        const codigo_empresa = req.user.codigo_empresa;
        const usuario = req.user.codigo_usuario;
        const pool = await poolPromise
        var lista;
        for (let i= 0; i< filas_detalle.length; i++){
            var detalle = filas_detalle[i];
            lista = await pool
            .request()
            .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
            .input('punto_venta', mssql.VarChar(250), detalle.Punto_Venta)
            .input('tipo_documento', mssql.VarChar(250), "Orden de Compras")
            .input('serie_motivo', mssql.VarChar(250), detalle.Codigo_Motivo_Serie)
            .input('numero_documento', mssql.VarChar(250), detalle.Numero)
            .input('modulo', mssql.VarChar(250), "Orden de Compras")
            .input('usuario', mssql.VarChar(250), usuario)
            .input('PC_User', mssql.VarChar(250), '')
            .input('PC_Ip', mssql.VarChar(250), req.ip)
            .query(
                "declare @conteo varchar(10) \n"+
                "select @conteo = COUNT(*) from saldos_eliminados where \n"+
                "codigo_empresa = @codigo_empresa \n"+
                "and punto_venta = @punto_venta \n"+
                "and tipo_documento = @tipo_documento \n"+
                "and serie_motivo = @serie_motivo \n"+
                "and numero_documento = @numero_documento \n"+
                "and modulo = @modulo \n"+
                "if @conteo = 0 \n"+
                "begin \n"+
                    "insert into saldos_eliminados values ("+
                    "@codigo_empresa,"+
                    "@punto_venta,"+
                    "@tipo_documento,"+
                    "@serie_motivo,"+
                    "@numero_documento,"+
                    "@modulo,"+
                    "@usuario,"+
                    "host_name(),"+
                    "CURRENT_TIMESTAMP,"+
                    "@PC_Ip"+
                    ")\n"+
                "end"
            );

            
            lista = await pool
            .request()
            .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
            .input('punto_venta', mssql.VarChar(250), detalle.Punto_Venta)
            .input('serie_motivo', mssql.VarChar(250), detalle.Codigo_Motivo_Serie)
            .input('numero_documento', mssql.VarChar(250), detalle.Numero)
            .query(
                "update Hordcomc \n"+
                "set \n"+
                "atendido='Atendido'\n"+
                ",porcentaje='100%'\n"+
                "where \n"+
                "ccod_empresa=@codigo_empresa\n"+
                "and erp_ptovta=@punto_venta\n"+
                "and idmotivo_compra=@serie_motivo\n"+
                "and cnum_doc=@numero_documento"
            );
        }
        res.send({estado: true, codigo: "0", mensaje: "Saldos Eliminados"});
    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
});
module.exports = router;