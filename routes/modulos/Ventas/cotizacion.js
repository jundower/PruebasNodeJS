const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../../database');
const { compareSync } = require('bcryptjs');

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

    if(codigo_punto_venta==""){
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
    "Hcotizad.nitem as NItem,\n"+
    "Hcotizad.NCANTIDAD as Cantidad,\n"+
    "Hcotizad.CCOD_ARTICULO AS Codigo,\n"+
    "Harticul.ccod_almacen as Tipo_producto,\n"+
    "Harticul.cfamilia as Familia,\n"+
    "Harticul.ccod_subfamilia as Subfamilia,\n"+
    "harticul.codmarca as Codigo_Concepto1,\n"+
    "erp_concepto1.erp_nomcon as Concepto1,\n"+
    "harticul.modelo as Concepto2,\n"+
    "harticul.color as Concepto3,\n"+
    "harticul.tratamiento as Concepto4,\n"+
    "harticul.fuelle as Concepto5,\n"+
    "harticul.azas as Concepto6,\n"+
    "harticul.solapa as Concepto7,\n"+
    "harticul.ccod_interno as Codigo_Fabricante,\n"+
    "harticul.cod_digemir as Codigo_Digemid,\n"+
    "harticul.erp_codinterno2 as Codigo_Interno,\n"+
    "harticul.erp_codinterno3 as Codigo_Interno2,\n"+
    "harticul.observacion as Leyenda1,\n"+
    "harticul.erp_observacion2 as Leyenda2,\n"+
    "Hcotizad.CNOM_ARTICULO AS Nombre,\n"+
    "RTRIM(Hcotizad.CUNIDAD) AS Codigo_Unidad,\n"+
    "RTRIM(Hcotizad.CUNIDAD) AS Unidad,\n"+
    "hcotizad.erp_comision_porc as Comision_porcentaje,\n"+
    "hcotizad.factor as Factor,\n"+
    "Hcotizad.NPRECIO as Unit,\n"+
    "Hcotizad.BASE_IMP as Base_Imponible,\n"+
    "Hcotizad.DESC1 as Desc1,\n"+
    "Hcotizad.DESC2 as Desc2,\n"+
    "Hcotizad.Desc3 As Desc3,\n"+
    "Hcotizad.erp_desc4 as Desc4,\n"+
    "Hcotizad.BASE_CALCULADA as Base_Calculada,\n"+
    "Hcotizad.NIGV as Igv,\n"+
    "Hcotizad.NIMPORTE as Importe,\n"+
    "hcotizad.erp_peso as Peso,\n"+
    "Halmacen_2.ccod_almacen as Codigo_Almacen,\n"+
    "Halmacen_2.cnom_almacen as Almacen,\n"+
    "Hcotizad.cantidad_presentacion as Cantidad_presentacion,\n"+
    "Hcotizad.codigo_presentacion as Codigo_presentacion,\n"+
    "RTRIM(Hcotizad.unidad_presentacion) AS Unidad_presentacion,\n"+
    "Hcotizad.nombre_presentacion AS Nombre_presentacion,\n"+
    "Hcotizad.precio_presentacion as Precio_presentacion,\n"+
    "Hcotizad.erp_observacion as Observacion,\n"+
    "Hcotizad.OT as OT,\n"+
    "Hcotizad.NCANTIDAD3 as Cantidad_Kardex,\n"+
    "Hcotizad.barticulo as Barticulo,\n"+
    "Hcotizad.igv_art as Igv_Art,\n"+
    "Hcotizad.monto_descuento as Monto_Descuento,\n"+
    "hcotizad.precio_original as Precio_original,\n"+
    "hcotizad.erp_codune as Codigo_Unidad_Negocio,\n"+
    "Hcotizad.erp_codune as Unidad_negocio,\n"+
    "Hcotizad.CCENCOS AS Codigo_Cencos,\n"+
    "Hcotizad.CCENCOS AS Cencos,\n"+
    "Hcotizad.erp_presupuesto as Codigo_Partida_presupuestal,\n"+
    "Hcotizad.erp_presupuesto as Partida_presupuestal,\n"+
    "Hcotizad.erp_codage as Codigo_Agencia,\n"+
    "Hcotizad.erp_codage as Agencia,\n"+
    "Hcotizad.erp_percepcion_sn as Percepcion_sn,\n"+
    "Hcotizad.erp_percepcion_uni as Percepcion_uni,\n"+
    "Hcotizad.erp_percepcion_porc as Perpecion_porc,\n"+
    "Hcotizad.erp_boni_sn as Boni_sn,\n"+
    "Hcotizad.erp_item_boni as Item_boni,\n"+
    "hcotizad.erp_comision_monto as Comision_monto,\n"+
    "hcotizad.erp_base_calc_dec as Base_calculada_dec,\n"+
    "hcotizad.erp_base_imp_dec as Base_imp_dec,\n"+
    "hcotizad.erp_igv_dec as Igv_dec,\n"+
    "hcotizad.erp_importe_dec as Importe_dec,\n"+
    "Harticul.csistock as Stock_SN, \n"+
    "Harticul.lote as Lote_SN, \n"+
    "'' as Lote_Numero, \n"+
    "'' as Lote_Vencimiento, \n"+
    "Harticul.flagserie Serie_SN, \n"+
    "'' as Serie_Numero, \n"+
    "'' as Cotizacion_Punto_Venta, \n"+
    "'' as Cotizacion_Motivo, \n"+
    "'' as Cotizacion_Numero, \n"+
    "'' as Cotizacion_NItem \n"+
    "FROM Hcotizad inner Join Harticul On \n"+
    "Hcotizad.ccod_empresa = Harticul.ccod_empresa and\n"+
    "Hcotizad.ccod_articulo = Harticul.ccod_articulo\n"+
    "inner join erp_concepto1 on\n"+
    "erp_concepto1.erp_codemp = Harticul.ccod_empresa and\n"+
    "erp_concepto1.erp_codcon = Harticul.codmarca\n"+
    "inner join Halmacen_2 on\n"+
    "Halmacen_2.ccod_empresa = Hcotizad.ccod_empresa and\n"+
    "Halmacen_2.ccod_almacen = Hcotizad.erp_cod_almacen\n"+
    "WHERE \n"+
    "Hcotizad.ccod_empresa = @codigo_empresa and \n"+
    "Hcotizad.idmotivo_venta = @motivo_documento and\n"+
    "Hcotizad.cnum_doc = @numero_documento and \n"+
    "Hcotizad.erp_ptovta= @codigo_punto_venta \n"+
    "ORDER BY NITEM");

    
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
                    .input("idmotivo_venta", mssql.VarChar(250), req.body.motivo)
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
                        "and erp_codmot = @idmotivo_venta \n"+
                        "and erp_sermot = @anio \n"+
                        "select \n"+
                        "@cantidad_ceros = Isnull(cantidad_caracteres,0) \n"+
                        "from htipdoc \n"+
                        "where ccod_empresa = @codigo_empresa \n"+
                        "and ctip_doc = 'COT' \n"+
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
                        "FROM hpedidoc \n"+
                        "WHERE ccod_empresa = @codigo_empresa \n"+
                        "AND ccod_almacen = @codigo_punto_venta \n"+
                        "AND idmotivo_venta = @idmotivo_venta \n"+
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
                .input("punto_venta", mssql.VarChar(250), codigo_punto_venta)
                .input("idmotivo_venta", mssql.VarChar(250), req.body.motivo)
                .input("cnum_doc", mssql.VarChar(250), numero_correlativo)
                .input("automatico", mssql.VarChar(250), req.body.automatico)
                .input("dfecha_doc", mssql.Date, req.body.fecha_doc)
                .input("dfecha_entr", mssql.Date, req.body.fecha_entr)
                .input("dfecha_validez", mssql.Date, req.body.fecha_validez)
                .input("cmoneda", mssql.VarChar(250), req.body.moneda)
                .input("nimporte", mssql.VarChar(250), req.body.importe)
                .input("ccod_forpago", mssql.VarChar(250), req.body.forma_pago)
                .input("ccod_cliente", mssql.VarChar(250), req.body.codigo_cliente)
                .input("cnom_cliente_c", mssql.VarChar(250), req.body.nombre_cliente)
                .input("cnum_ruc_c", mssql.VarChar(250), req.body.ruc_cliente)
                .input("estado", mssql.VarChar(250), req.body.estado)
                .input("observacion", mssql.VarChar(250), req.body.observacion)
                .input("siigv", mssql.VarChar(250), req.body.mas_igv)
                .input("ctipo_cambio", mssql.VarChar(250), req.body.tipo_cambio)
                .input("tipocambio", mssql.VarChar(250), req.body.tasa_cambio)
                .input("ccod_person", mssql.VarChar(250), req.body.vendedor_1)
                .input("lista_precios", mssql.VarChar(250), req.body.lista_precios)
                .input("telefono", mssql.VarChar(250), req.body.telefono_cliente)
                .input("fax", mssql.VarChar(250), req.body.fax)
                .input("email", mssql.VarChar(250), req.body.email)
                .input("caprobado", mssql.VarChar(250), req.body.aprobado)
                .input("dfecha_aprobacion", mssql.Date, req.body.fecha_aprobacion)
                .input("ccod_empleado_aprueba", mssql.VarChar(250), req.body.codigo_empleado_aprobacion)
                .input("cobservacion_aprobacion", mssql.VarChar(250), req.body.observacion_aprobacion)
                .input("ccod_cencos", mssql.VarChar(250), req.body.codigo_centro_costos)
                .input("descuento", mssql.VarChar(250), req.body.descuento)
                .input("ot", mssql.VarChar(250), req.body.orden_trabajo)
                .input("observacion2", mssql.VarChar(250), req.body.observacion2)
                .input("observacion3", mssql.VarChar(250), req.body.observacion3)
                .input("observacion4", mssql.VarChar(250), req.body.observacion4)
                .input("observacion5", mssql.VarChar(250), req.body.observacion5)
                .input("observacion6", mssql.VarChar(250), req.body.observacion6)
                .input("observacion7", mssql.VarChar(250), req.body.observacion7)
                .input("observacion8", mssql.VarChar(250), req.body.observacion8)
                .input("comentario2", mssql.VarChar(250), req.body.comentario2)
                .input("comentario3", mssql.VarChar(250), req.body.comentario3)
                .input("comentario4", mssql.VarChar(250), req.body.comentario4)
                .input("comentario5", mssql.VarChar(250), req.body.comentario5)
                .input("comentario6", mssql.VarChar(250), req.body.comentario6)
                .input("comentario7", mssql.VarChar(250), req.body.comentario7)
                .input("pto_llegada", mssql.VarChar(250), req.body.pto_llegada)
                .input("dias", mssql.VarChar(250), req.body.dias)
                .input("pais", mssql.VarChar(250), req.body.pais)
                .input("atencion", mssql.VarChar(250), req.body.atencion)
                .input("porcentaje", mssql.VarChar(250), req.body.porcentaje)
                .input("erp_codune", mssql.VarChar(250), req.body.codigo_unidad_negocio)
                .input("cod_contacto", mssql.VarChar(250), req.body.codigo_contacto)
                .input("nom_contacto", mssql.VarChar(250), req.body.nom_contacto)
                .input("vendedor_2", mssql.VarChar(250), req.body.vendedor_2)
                .input("Glosa", mssql.VarChar(250), req.body.Glosa)
                .input("erp_codage", mssql.VarChar(250), req.body.codigo_agencia)
                .input("usuario", mssql.VarChar(250), usuario)
                .input("Pc_User", mssql.VarChar(250), req.body.Pc_User)
                .input("Pc_Fecha", mssql.Date, req.body.Pc_Fecha)
                .input("Pc_Ip", mssql.VarChar(250), req.body.Pc_Ip)
                .input("comentario1", mssql.VarChar(250), req.body.comentario1)
                .input("comentario8", mssql.VarChar(250), req.body.comentario8)
                .input("erp_presupuesto", mssql.VarChar(250), req.body.erp_presupuesto)
                .input("subtotal_sin_descuentos", mssql.VarChar(250), req.body.subtotal_sin_descuentos)
                .input("erp_Ddescuento", mssql.VarChar(250), req.body.erp_Ddescuento)
                .input("erp_Dsubtotal", mssql.VarChar(250), req.body.erp_Dsubtotal)
                .input("erp_Digv", mssql.VarChar(250), req.body.erp_Digv)
                .input("erp_Dimporte", mssql.VarChar(250), req.body.erp_Dimporte)
                .input("erp_Dpercepcion", mssql.VarChar(250), req.body.erp_Dpercepcion)
                .input("erp_Dtotal", mssql.VarChar(250), req.body.erp_Dtotal)
                .input("erp_gestor", mssql.VarChar(250), req.body.erp_gestor)
                .input("tipo", mssql.VarChar(250), req.body.tipo)
                .input("motivo_ref", mssql.VarChar(250), req.body.motivo_ref)
                .input("num_ref", mssql.VarChar(250), req.body.numero_referencia)
                .input("numero_expediente1", mssql.VarChar(250), req.body.numero_expediente1)
                .input("numero_expediente2", mssql.VarChar(250), req.body.numero_expediente2)
                .query("insert into hcotizac (" +
                "ccod_empresa,\n"+
                "punto_venta,\n"+
                "idmotivo_venta,\n"+
                "cnum_doc,\n"+
                "automatico,\n"+
                "dfecha_doc,\n"+
                "dfecha_entr,\n"+
                "dfecha_validez,\n"+
                "cmoneda,\n"+
                "nimporte,\n"+
                "ccod_forpago,\n"+
                "ccod_cliente,\n"+
                "cnom_cliente_c,\n"+
                "cnum_ruc_c,\n"+
                "estado,\n"+
                "observacion,\n"+
                "siigv,\n"+
                "ctipo_cambio,\n"+
                "tipocambio,\n"+
                "ccod_person,\n"+
                "lista_precios,\n"+
                "telefono,\n"+
                "fax,\n"+
                "email,\n"+
                "caprobado,\n"+
                "dfecha_aprobacion,\n"+
                "ccod_empleado_aprueba,\n"+
                "cobservacion_aprobacion,\n"+
                "ccod_cencos,\n"+
                "descuento,\n"+
                "ot,\n"+
                "observacion2,\n"+
                "observacion3,\n"+
                "observacion4,\n"+
                "observacion5,\n"+
                "observacion6,\n"+
                "observacion7,\n"+
                "observacion8,\n"+
                "comentario2,\n"+
                "comentario3,\n"+
                "comentario4,\n"+
                "comentario5,\n"+
                "comentario6,\n"+
                "comentario7,\n"+
                "pto_llegada,\n"+
                "dias,\n"+
                "pais,\n"+
                "atencion,\n"+
                "porcentaje,\n"+
                "erp_codune,\n"+
                "cod_contacto,\n"+
                "nom_contacto,\n"+
                "vendedor_2,\n"+
                "Glosa,\n"+
                "erp_codage,\n"+
                "usuario,\n"+
                "Pc_User,\n"+
                "Pc_Fecha,\n"+
                "Pc_Ip,\n"+
                "comentario1,\n"+
                "comentario8,\n"+
                "erp_presupuesto,\n"+
                "subtotal_sin_descuentos,\n"+
                "erp_Ddescuento,\n"+
                "erp_Dsubtotal,\n"+
                "erp_Digv,\n"+
                "erp_Dimporte,\n"+
                "erp_Dpercepcion,\n"+
                "erp_Dtotal,\n"+
                "erp_gestor,\n"+
                "tipo,\n"+
                "motivo_ref,\n"+
                "num_ref,\n"+
                "erp_nro_exp,\n"+
                "erp_nro_exp2 \n" +
                ") values (" +
                "@ccod_empresa,\n"+
                "@punto_venta,\n"+
                "@idmotivo_venta,\n"+
                "@cnum_doc,\n"+
                "@automatico,\n"+
                "@dfecha_doc,\n"+
                "@dfecha_entr,\n"+
                "@dfecha_validez,\n"+
                "@cmoneda,\n"+
                "@nimporte,\n"+
                "@ccod_forpago,\n"+
                "@ccod_cliente,\n"+
                "@cnom_cliente_c,\n"+
                "@cnum_ruc_c,\n"+
                "@estado,\n"+
                "@observacion,\n"+
                "@siigv,\n"+
                "@ctipo_cambio,\n"+
                "@tipocambio,\n"+
                "@ccod_person,\n"+
                "@lista_precios,\n"+
                "@telefono,\n"+
                "@fax,\n"+
                "@email,\n"+
                "@caprobado,\n"+
                "@dfecha_aprobacion,\n"+
                "@ccod_empleado_aprueba,\n"+
                "@cobservacion_aprobacion,\n"+
                "@ccod_cencos,\n"+
                "@descuento,\n"+
                "@ot,\n"+
                "@observacion2,\n"+
                "@observacion3,\n"+
                "@observacion4,\n"+
                "@observacion5,\n"+
                "@observacion6,\n"+
                "@observacion7,\n"+
                "@observacion8,\n"+
                "@comentario2,\n"+
                "@comentario3,\n"+
                "@comentario4,\n"+
                "@comentario5,\n"+
                "@comentario6,\n"+
                "@comentario7,\n"+
                "@pto_llegada,\n"+
                "@dias,\n"+
                "@pais,\n"+
                "@atencion,\n"+
                "@porcentaje,\n"+
                "@erp_codune,\n"+
                "@cod_contacto,\n"+
                "@nom_contacto,\n"+
                "@vendedor_2,\n"+
                "@Glosa,\n"+
                "@erp_codage,\n"+
                "@usuario,\n"+
                "@Pc_User,\n"+
                "@Pc_Fecha,\n"+
                "@Pc_Ip,\n"+
                "@comentario1,\n"+
                "@comentario8,\n"+
                "@erp_presupuesto,\n"+
                "@subtotal_sin_descuentos,\n"+
                "@erp_Ddescuento,\n"+
                "@erp_Dsubtotal,\n"+
                "@erp_Digv,\n"+
                "@erp_Dimporte,\n"+
                "@erp_Dpercepcion,\n"+
                "@erp_Dtotal,\n"+
                "@erp_gestor,\n"+
                "@tipo,\n"+
                "@motivo_ref,\n"+
                "@num_ref,\n"+
                "@numero_expediente1,\n"+
                "@numero_expediente2 \n" +
                ")")
                //#endregion
                
                //#region Registro del detalle
                for (let i= 0; i< filas_detalle.length; i++){
                    rowid = filas_detalle[i];
                    const request_detalle = new mssql.Request(transaction);
                    await request_detalle
                    .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                    .input("erp_ptovta", mssql.VarChar(250), codigo_punto_venta)
                    .input("idmotivo_venta", mssql.VarChar(250), req.body.motivo)
                    .input("cnum_doc", mssql.VarChar(250), numero_correlativo)
                    .input("nitem", mssql.VarChar(250), i+1)
                    .input("ccod_articulo", mssql.VarChar(250), rowid.Codigo)
                    .input("cnom_articulo", mssql.VarChar(250), rowid.Nombre)
                    .input("cunidad", mssql.VarChar(250), rowid.Codigo_Unidad)
                    .input("igv_art", mssql.VarChar(250), rowid.Igv_Art)
                    .input("factor", mssql.VarChar(250), rowid.Factor)
                    .input("ncantidad", mssql.VarChar(250), rowid.Cantidad)
                    .input("ncantidad3", mssql.VarChar(250), rowid.Cantidad_Kardex)
                    .input("nprecio", mssql.VarChar(250), rowid.Unit)
                    .input("nigv", mssql.VarChar(250), rowid.Igv)
                    .input("desc1", mssql.VarChar(250), rowid.Desc1)
                    .input("desc2", mssql.VarChar(250), rowid.Desc2)
                    .input("barticulo", mssql.VarChar(250), rowid.Barticulo)
                    .input("cantidad_presentacion", mssql.VarChar(250), rowid.Cantidad_presentacion)
                    .input("nombre_presentacion", mssql.VarChar(250), rowid.Nombre_presentacion)
                    .input("unidad_presentacion", mssql.VarChar(250), rowid.Unidad_presentacion)
                    .input("precio_presentacion", mssql.VarChar(250), rowid.Precio_presentacion)
                    .input("ccencos", mssql.VarChar(250), req.body.codigo_centro_costos)
                    .input("ot", mssql.VarChar(250), req.body.orden_trabajo)
                    .input("base_imp", mssql.VarChar(250), rowid.Base_Imponible)
                    .input("base_calculada", mssql.VarChar(250), rowid.Base_Calculada)
                    .input("monto_descuento", mssql.VarChar(250), rowid.Monto_Descuento)
                    .input("nimporte", mssql.VarChar(250), rowid.Importe)
                    .input("precio_original", mssql.VarChar(250), rowid.Precio_original)
                    .input("erp_codune", mssql.VarChar(250), req.body.codigo_unidad_negocio)
                    .input("erp_codage", mssql.VarChar(250), req.body.codigo_agencia)
                    .input("erp_observacion", mssql.VarChar(250), "")
                    .input("desc3", mssql.VarChar(250), rowid.Desc3)
                    .input("erp_percepcion_sn", mssql.VarChar(250), rowid.Percepcion_sn)
                    .input("erp_percepcion_uni", mssql.VarChar(250), rowid.Percepcion_uni)
                    .input("erp_percepcion_porc", mssql.VarChar(250), rowid.Perpecion_porc)
                    .input("erp_boni_sn", mssql.VarChar(250), rowid.Boni_sn)
                    .input("erp_item_boni", mssql.VarChar(250), rowid.BonItem_bonii_sn)
                    .input("erp_presupuesto", mssql.VarChar(250), req.body.erp_presupuesto)
                    .input("erp_desc4", mssql.VarChar(250), rowid.Desc4)
                    .input("erp_peso", mssql.VarChar(250), rowid.Peso)
                    .input("erp_cod_almacen", mssql.VarChar(250), rowid.Codigo_Almacen)
                    .input("erp_base_calc_dec", mssql.VarChar(250), rowid.Base_calculada_dec)
                    .input("erp_base_imp_dec", mssql.VarChar(250), rowid.Base_imp_dec)
                    .input("erp_igv_dec", mssql.VarChar(250), rowid.Igv_dec)
                    .input("erp_importe_dec", mssql.VarChar(250), rowid.Importe_dec)
                    .input("erp_comision_porc", mssql.VarChar(250), rowid.Comision_porcentaje)
                    .input("erp_comision_monto", mssql.VarChar(250), rowid.Comision_monto)
                    .input("codigo_presentacion", mssql.VarChar(250), rowid.Codigo_presentacion)
                    .query("insert into Hcotizad (" +
                    "ccod_empresa,\n"+
                    "erp_ptovta,\n"+
                    "idmotivo_venta,\n"+
                    "cnum_doc,\n"+
                    "nitem,\n"+
                    "ccod_articulo,\n"+
                    "cnom_articulo,\n"+
                    "cunidad,\n"+
                    "igv_art,\n"+
                    "factor,\n"+
                    "ncantidad,\n"+
                    "ncantidad3,\n"+
                    "nprecio,\n"+
                    "nigv,\n"+
                    "desc1,\n"+
                    "desc2,\n"+
                    "barticulo,\n"+
                    "cantidad_presentacion,\n"+
                    "nombre_presentacion,\n"+
                    "unidad_presentacion,\n"+
                    "precio_presentacion,\n"+
                    "ccencos,\n"+
                    "ot,\n"+
                    "base_imp,\n"+
                    "base_calculada,\n"+
                    "monto_descuento,\n"+
                    "nimporte,\n"+
                    "precio_original,\n"+
                    "erp_codune,\n"+
                    "erp_codage,\n"+
                    "erp_observacion,\n"+
                    "desc3,\n"+
                    "erp_percepcion_sn,\n"+
                    "erp_percepcion_uni,\n"+
                    "erp_percepcion_porc,\n"+
                    "erp_boni_sn,\n"+
                    "erp_item_boni,\n"+
                    "erp_presupuesto,\n"+
                    "erp_desc4,\n"+
                    "erp_peso,\n"+
                    "erp_cod_almacen,\n"+
                    "erp_base_calc_dec,\n"+
                    "erp_base_imp_dec,\n"+
                    "erp_igv_dec,\n"+
                    "erp_importe_dec,\n"+
                    "erp_comision_porc,\n"+
                    "erp_comision_monto,\n"+
                    "codigo_presentacion" +
                    ") values (" +
                    "@ccod_empresa,\n"+
                    "@erp_ptovta,\n"+
                    "@idmotivo_venta,\n"+
                    "@cnum_doc,\n"+
                    "@nitem,\n"+
                    "@ccod_articulo,\n"+
                    "@cnom_articulo,\n"+
                    "@cunidad,\n"+
                    "@igv_art,\n"+
                    "@factor,\n"+
                    "@ncantidad,\n"+
                    "@ncantidad3,\n"+
                    "@nprecio,\n"+
                    "@nigv,\n"+
                    "@desc1,\n"+
                    "@desc2,\n"+
                    "@barticulo,\n"+
                    "@cantidad_presentacion,\n"+
                    "@nombre_presentacion,\n"+
                    "@unidad_presentacion,\n"+
                    "@precio_presentacion,\n"+
                    "@ccencos,\n"+
                    "@ot,\n"+
                    "@base_imp,\n"+
                    "@base_calculada,\n"+
                    "@monto_descuento,\n"+
                    "@nimporte,\n"+
                    "@precio_original,\n"+
                    "@erp_codune,\n"+
                    "@erp_codage,\n"+
                    "@erp_observacion,\n"+
                    "@desc3,\n"+
                    "@erp_percepcion_sn,\n"+
                    "@erp_percepcion_uni,\n"+
                    "@erp_percepcion_porc,\n"+
                    "@erp_boni_sn,\n"+
                    "@erp_item_boni,\n"+
                    "@erp_presupuesto,\n"+
                    "@erp_desc4,\n"+
                    "@erp_peso,\n"+
                    "@erp_cod_almacen,\n"+
                    "@erp_base_calc_dec,\n"+
                    "@erp_base_imp_dec,\n"+
                    "@erp_igv_dec,\n"+
                    "@erp_importe_dec,\n"+
                    "@erp_comision_porc,\n"+
                    "@erp_comision_monto,\n"+
                    "@codigo_presentacion" +
                    ")")
                }
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
                .input("punto_venta", mssql.VarChar(250), codigo_punto_venta)
                .input("idmotivo_venta", mssql.VarChar(250), req.body.motivo)
                .input("cnum_doc", mssql.VarChar(250), req.body.numero_correlativo)
                .input("automatico", mssql.VarChar(250), req.body.automatico)
                .input("dfecha_doc", mssql.Date, req.body.fecha_doc)
                .input("dfecha_entr", mssql.Date, req.body.fecha_entr)
                .input("dfecha_validez", mssql.Date, req.body.fecha_validez)
                .input("cmoneda", mssql.VarChar(250), req.body.moneda)
                .input("nimporte", mssql.VarChar(250), req.body.importe)
                .input("ccod_forpago", mssql.VarChar(250), req.body.forma_pago)
                .input("ccod_cliente", mssql.VarChar(250), req.body.codigo_cliente)
                .input("cnom_cliente_c", mssql.VarChar(250), req.body.nombre_cliente)
                .input("cnum_ruc_c", mssql.VarChar(250), req.body.ruc_cliente)
                .input("estado", mssql.VarChar(250), req.body.estado)
                .input("observacion", mssql.VarChar(250), req.body.observacion)
                .input("siigv", mssql.VarChar(250), req.body.mas_igv)
                .input("ctipo_cambio", mssql.VarChar(250), req.body.tipo_cambio)
                .input("tipocambio", mssql.VarChar(250), req.body.tasa_cambio)
                .input("ccod_person", mssql.VarChar(250), req.body.vendedor_1)
                .input("lista_precios", mssql.VarChar(250), req.body.lista_precios)
                .input("telefono", mssql.VarChar(250), req.body.telefono_cliente)
                .input("fax", mssql.VarChar(250), req.body.fax)
                .input("email", mssql.VarChar(250), req.body.email)
                .input("caprobado", mssql.VarChar(250), req.body.aprobado)
                .input("dfecha_aprobacion", mssql.Date, req.body.fecha_aprobacion)
                .input("ccod_empleado_aprueba", mssql.VarChar(250), req.body.codigo_empleado_aprobacion)
                .input("cobservacion_aprobacion", mssql.VarChar(250), req.body.observacion_aprobacion)
                .input("ccod_cencos", mssql.VarChar(250), req.body.codigo_centro_costos)
                .input("descuento", mssql.VarChar(250), req.body.descuento)
                .input("ot", mssql.VarChar(250), req.body.orden_trabajo)
                .input("observacion2", mssql.VarChar(250), req.body.observacion2)
                .input("observacion3", mssql.VarChar(250), req.body.observacion3)
                .input("observacion4", mssql.VarChar(250), req.body.observacion4)
                .input("observacion5", mssql.VarChar(250), req.body.observacion5)
                .input("observacion6", mssql.VarChar(250), req.body.observacion6)
                .input("observacion7", mssql.VarChar(250), req.body.observacion7)
                .input("observacion8", mssql.VarChar(250), req.body.observacion8)
                .input("comentario2", mssql.VarChar(250), req.body.comentario2)
                .input("comentario3", mssql.VarChar(250), req.body.comentario3)
                .input("comentario4", mssql.VarChar(250), req.body.comentario4)
                .input("comentario5", mssql.VarChar(250), req.body.comentario5)
                .input("comentario6", mssql.VarChar(250), req.body.comentario6)
                .input("comentario7", mssql.VarChar(250), req.body.comentario7)
                .input("pto_llegada", mssql.VarChar(250), req.body.pto_llegada)
                .input("dias", mssql.VarChar(250), req.body.dias)
                .input("pais", mssql.VarChar(250), req.body.pais)
                .input("atencion", mssql.VarChar(250), req.body.atencion)
                .input("porcentaje", mssql.VarChar(250), req.body.porcentaje)
                .input("erp_codune", mssql.VarChar(250), req.body.codigo_unidad_negocio)
                .input("cod_contacto", mssql.VarChar(250), req.body.codigo_contacto)
                .input("nom_contacto", mssql.VarChar(250), req.body.nom_contacto)
                .input("vendedor_2", mssql.VarChar(250), req.body.vendedor_2)
                .input("Glosa", mssql.VarChar(250), req.body.Glosa)
                .input("erp_codage", mssql.VarChar(250), req.body.codigo_agencia)
                .input("usuario", mssql.VarChar(250), usuario)
                .input("Pc_User", mssql.VarChar(250), req.body.Pc_User)
                .input("Pc_Fecha", mssql.Date, req.body.Pc_Fecha)
                .input("Pc_Ip", mssql.VarChar(250), req.body.Pc_Ip)
                .input("comentario1", mssql.VarChar(250), req.body.comentario1)
                .input("comentario8", mssql.VarChar(250), req.body.comentario8)
                .input("erp_presupuesto", mssql.VarChar(250), req.body.erp_presupuesto)
                .input("subtotal_sin_descuentos", mssql.VarChar(250), req.body.subtotal_sin_descuentos)
                .input("erp_Ddescuento", mssql.VarChar(250), req.body.erp_Ddescuento)
                .input("erp_Dsubtotal", mssql.VarChar(250), req.body.erp_Dsubtotal)
                .input("erp_Digv", mssql.VarChar(250), req.body.erp_Digv)
                .input("erp_Dimporte", mssql.VarChar(250), req.body.erp_Dimporte)
                .input("erp_Dpercepcion", mssql.VarChar(250), req.body.erp_Dpercepcion)
                .input("erp_Dtotal", mssql.VarChar(250), req.body.erp_Dtotal)
                .input("erp_gestor", mssql.VarChar(250), req.body.erp_gestor)
                .input("tipo", mssql.VarChar(250), req.body.tipo)
                .input("motivo_ref", mssql.VarChar(250), req.body.motivo_ref)
                .input("num_ref", mssql.VarChar(250), req.body.numero_referencia)
                .input("numero_expediente1", mssql.VarChar(250), req.body.numero_expediente1)
                .input("numero_expediente2", mssql.VarChar(250), req.body.numero_expediente2)
                .query("Update Hcotizac  "+        
                "Set \n"+                
                "dfecha_doc     =@dfecha_doc,  \n"+          
                "dfecha_entr    =@dfecha_entr,  \n"+          
                "dfecha_validez =@dfecha_validez,  \n"+          
                "cmoneda        =@cmoneda,  \n"+          
                "nimporte       =@nimporte,  \n"+          
                "ccod_forpago   =@ccod_forpago,  \n"+          
                "ccod_cliente   =@ccod_cliente,  \n"+          
                "cnom_cliente_c =@cnom_cliente_c,  \n"+          
                "cnum_ruc_c     =@cnum_ruc_c,  \n"+          
                "estado         =@estado,  \n"+          
                "observacion    =@observacion,  \n"+          
                "siigv          =@siigv,  \n"+          
                "ctipo_cambio   =@ctipo_cambio,  \n"+          
                "tipocambio     =@tipocambio,  \n"+          
                "ccod_person    =@ccod_person,  \n"+          
                "lista_precios  =@lista_precios,  \n"+          
                "telefono       =@telefono,  \n"+          
                "fax            =@fax,  \n"+          
                "email          =@email,  \n"+          
                "caprobado      =@caprobado,  \n"+          
                "dfecha_aprobacion      =@dfecha_aprobacion,  \n"+          
                "ccod_empleado_aprueba  =@ccod_empleado_aprueba,  \n"+           
                "cobservacion_aprobacion=@cobservacion_aprobacion,  \n"+          
                "ccod_cencos    =@ccod_cencos,  \n"+          
                "descuento      =@descuento,  \n"+          
                "ot             =@ot,  \n"+          
                "observacion2   =@observacion2,  \n"+          
                "observacion3   =@observacion3,  \n"+          
                "observacion4   =@observacion4,  \n"+          
                "observacion5   =@observacion5,  \n"+          
                "observacion6   =@observacion6,  \n"+          
                "observacion7   =@observacion7,  \n"+          
                "observacion8   =@observacion8,  \n"+          
                "comentario2    =@comentario2,  \n"+          
                "comentario3    =@comentario3,  \n"+          
                "comentario4    =@comentario4,  \n"+     
                "comentario5    =@comentario5,  \n"+          
                "comentario6    =@comentario6,  \n"+          
                "comentario7    =@comentario7,  \n"+          
                "comentario1    =@comentario1,  \n"+          
                "comentario8    =@comentario8,  \n"+          
                "pto_llegada    =@pto_llegada,  \n"+          
                "dias           =@dias,  \n"+          
                "pais           =@pais,  \n"+          
                "atencion       =@atencion,  \n"+          
                "porcentaje     =@porcentaje,  \n"+          
                "erp_codune     =@erp_codune,  \n"+          
                "cod_contacto   =@cod_contacto,  \n"+          
                "nom_contacto   =@nom_contacto,  \n"+          
                "vendedor_2     =@vendedor_2,  \n"+          
                "Glosa          =@Glosa,  \n"+          
                "erp_codage     =@erp_codage,  \n"+          
                "usuario        =@usuario,  \n"+          
                "Pc_User        =@Pc_User,  \n"+          
                "Pc_Fecha       =@Pc_Fecha,  \n"+          
                "Pc_Ip          =@Pc_Ip,  \n"+          
                "erp_presupuesto=@erp_presupuesto,  \n"+          
                "erp_gestor     =@erp_gestor,  \n"+    
                "subtotal_sin_descuentos  =@subtotal_sin_descuentos,  \n"+          
                "erp_Ddescuento =@erp_Ddescuento,  \n"+          
                "erp_Dsubtotal  =@erp_Dsubtotal,  \n"+          
                "erp_Digv       =@erp_Digv,  \n"+          
                "erp_Dimporte   =@erp_Dimporte,  \n"+          
                "erp_Dpercepcion=@erp_Dpercepcion,  \n"+          
                "erp_Dtotal     =@erp_Dtotal,  \n"+          
                "tipo           =@tipo,  \n"+    
                "motivo_ref     =@motivo_ref,  \n"+    
                "num_ref        =@num_ref,  \n"+    
                "erp_nro_exp    =@numero_expediente1,  \n"+    
                "erp_nro_exp2   =@numero_expediente2 \n"+    
                "where          \n"+ 
                 "ccod_empresa  =@ccod_empresa and \n"+          
                 "punto_venta   =@punto_venta and    \n"+      
                 "idmotivo_venta =@idmotivo_venta and     \n"+     
                 "cnum_doc      =@cnum_doc and \n"+ 
                 "estado = 'Ingresado' ")
        

                //#endregion
                //console.log(result_cabecera.rowsAffected);
                if(result_cabecera.rowsAffected>0){
                    console.log(result_cabecera.rowsAffected);
                    //#region Borrar detalle
                    const request_detalle_borrar  = new mssql.Request(transaction);
                    await request_detalle_borrar
                    .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                    .input("punto_venta", mssql.VarChar(250), codigo_punto_venta)
                    .input("idmotivo_venta", mssql.VarChar(250), req.body.motivo)
                    .input("cnum_doc", mssql.VarChar(250), req.body.numero_correlativo)
                    .query("DELETE FROM Hcotizad WHERE ccod_empresa = @ccod_empresa and erp_ptovta =@punto_venta and idmotivo_venta = @idmotivo_venta and cnum_doc = @cnum_doc")
                    //#endregion

                    //#region Grabar detalle
                    for (let i= 0; i< filas_detalle.length; i++){
                        rowid = filas_detalle[i];
                        const request_detalle_registrar  = new mssql.Request(transaction);
                        await request_detalle_registrar
                         .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                         .input("erp_ptovta", mssql.VarChar(250), codigo_punto_venta)
                         .input("idmotivo_venta", mssql.VarChar(250), req.body.motivo)
                         .input("cnum_doc", mssql.VarChar(250), req.body.numero_correlativo)
                         .input("nitem", mssql.VarChar(250), i+1)
                         .input("ccod_articulo", mssql.VarChar(250), rowid.Codigo)
                         .input("cnom_articulo", mssql.VarChar(250), rowid.Nombre)
                         .input("cunidad", mssql.VarChar(250), rowid.Codigo_Unidad)
                         .input("igv_art", mssql.VarChar(250), rowid.Igv_Art)
                         .input("factor", mssql.VarChar(250), rowid.Factor)
                         .input("ncantidad", mssql.VarChar(250), rowid.Cantidad)
                         .input("ncantidad3", mssql.VarChar(250), rowid.Cantidad_Kardex)
                         .input("nprecio", mssql.VarChar(250), rowid.Unit)
                         .input("nigv", mssql.VarChar(250), rowid.Igv)
                         .input("desc1", mssql.VarChar(250), rowid.Desc1)
                         .input("desc2", mssql.VarChar(250), rowid.Desc2)
                         .input("barticulo", mssql.VarChar(250), rowid.Barticulo)
                         .input("cantidad_presentacion", mssql.VarChar(250), rowid.Cantidad_presentacion)
                         .input("nombre_presentacion", mssql.VarChar(250), rowid.Nombre_presentacion)
                         .input("unidad_presentacion", mssql.VarChar(250), rowid.Unidad_presentacion)
                         .input("precio_presentacion", mssql.VarChar(250), rowid.Precio_presentacion)
                         .input("ccencos", mssql.VarChar(250), req.body.codigo_centro_costos)
                         .input("ot", mssql.VarChar(250), req.body.orden_trabajo)
                         .input("base_imp", mssql.VarChar(250), rowid.Base_Imponible)
                         .input("base_calculada", mssql.VarChar(250), rowid.Base_Calculada)
                         .input("monto_descuento", mssql.VarChar(250), rowid.Monto_Descuento)
                         .input("nimporte", mssql.VarChar(250), rowid.Importe)
                         .input("precio_original", mssql.VarChar(250), rowid.Precio_original)
                         .input("erp_codune", mssql.VarChar(250), req.body.codigo_unidad_negocio)
                         .input("erp_codage", mssql.VarChar(250), req.body.codigo_agencia)
                         .input("erp_observacion", mssql.VarChar(250), rowid.Observacion)
                         .input("desc3", mssql.VarChar(250), rowid.Desc3)
                         .input("erp_percepcion_sn", mssql.VarChar(250), rowid.Percepcion_sn)
                         .input("erp_percepcion_uni", mssql.VarChar(250), rowid.Percepcion_uni)
                         .input("erp_percepcion_porc", mssql.VarChar(250), rowid.Perpecion_porc)
                         .input("erp_boni_sn", mssql.VarChar(250), rowid.Boni_sn)
                         .input("erp_item_boni", mssql.VarChar(250), rowid.BonItem_bonii_sn)
                         .input("erp_presupuesto", mssql.VarChar(250), req.body.erp_presupuesto)
                         .input("erp_desc4", mssql.VarChar(250), rowid.Desc4)
                         .input("erp_peso", mssql.VarChar(250), rowid.Peso)
                         .input("erp_cod_almacen", mssql.VarChar(250), rowid.Codigo_Almacen)
                         .input("erp_base_calc_dec", mssql.VarChar(250), rowid.Base_calculada_dec)
                         .input("erp_base_imp_dec", mssql.VarChar(250), rowid.Base_imp_dec)
                         .input("erp_igv_dec", mssql.VarChar(250), rowid.Igv_dec)
                         .input("erp_importe_dec", mssql.VarChar(250), rowid.Importe_dec)
                         .input("erp_comision_porc", mssql.VarChar(250), rowid.Comision_porcentaje)
                         .input("erp_comision_monto", mssql.VarChar(250), rowid.Comision_monto)
                         .input("codigo_presentacion", mssql.VarChar(250), rowid.Codigo_presentacion)
                         .query("insert into Hcotizad (" +
                         "ccod_empresa,\n"+
                         "erp_ptovta,\n"+
                         "idmotivo_venta,\n"+
                         "cnum_doc,\n"+
                         "nitem,\n"+
                         "ccod_articulo,\n"+
                         "cnom_articulo,\n"+
                         "cunidad,\n"+
                         "igv_art,\n"+
                         "factor,\n"+
                         "ncantidad,\n"+
                         "ncantidad3,\n"+
                         "nprecio,\n"+
                         "nigv,\n"+
                         "desc1,\n"+
                         "desc2,\n"+
                         "barticulo,\n"+
                         "cantidad_presentacion,\n"+
                         "nombre_presentacion,\n"+
                         "unidad_presentacion,\n"+
                         "precio_presentacion,\n"+
                         "ccencos,\n"+
                         "ot,\n"+
                         "base_imp,\n"+
                         "base_calculada,\n"+
                         "monto_descuento,\n"+
                         "nimporte,\n"+
                         "precio_original,\n"+
                         "erp_codune,\n"+
                         "erp_codage,\n"+
                         "erp_observacion,\n"+
                         "desc3,\n"+
                         "erp_percepcion_sn,\n"+
                         "erp_percepcion_uni,\n"+
                         "erp_percepcion_porc,\n"+
                         "erp_boni_sn,\n"+
                         "erp_item_boni,\n"+
                         "erp_presupuesto,\n"+
                         "erp_desc4,\n"+
                         "erp_peso,\n"+
                         "erp_cod_almacen,\n"+
                         "erp_base_calc_dec,\n"+
                         "erp_base_imp_dec,\n"+
                         "erp_igv_dec,\n"+
                         "erp_importe_dec,\n"+
                         "erp_comision_porc,\n"+
                         "erp_comision_monto,\n"+
                         "codigo_presentacion" +
                         ") values (" +
                         "@ccod_empresa,\n"+
                         "@erp_ptovta,\n"+
                         "@idmotivo_venta,\n"+
                         "@cnum_doc,\n"+
                         "@nitem,\n"+
                         "@ccod_articulo,\n"+
                         "@cnom_articulo,\n"+
                         "@cunidad,\n"+
                         "@igv_art,\n"+
                         "@factor,\n"+
                         "@ncantidad,\n"+
                         "@ncantidad3,\n"+
                         "@nprecio,\n"+
                         "@nigv,\n"+
                         "@desc1,\n"+
                         "@desc2,\n"+
                         "@barticulo,\n"+
                         "@cantidad_presentacion,\n"+
                         "@nombre_presentacion,\n"+
                         "@unidad_presentacion,\n"+
                         "@precio_presentacion,\n"+
                         "@ccencos,\n"+
                         "@ot,\n"+
                         "@base_imp,\n"+
                         "@base_calculada,\n"+
                         "@monto_descuento,\n"+
                         "@nimporte,\n"+
                         "@precio_original,\n"+
                         "@erp_codune,\n"+
                         "@erp_codage,\n"+
                         "@erp_observacion,\n"+
                         "@desc3,\n"+
                         "@erp_percepcion_sn,\n"+
                         "@erp_percepcion_uni,\n"+
                         "@erp_percepcion_porc,\n"+
                         "@erp_boni_sn,\n"+
                         "@erp_item_boni,\n"+
                         "@erp_presupuesto,\n"+
                         "@erp_desc4,\n"+
                         "@erp_peso,\n"+
                         "@erp_cod_almacen,\n"+
                         "@erp_base_calc_dec,\n"+
                         "@erp_base_imp_dec,\n"+
                         "@erp_igv_dec,\n"+
                         "@erp_importe_dec,\n"+
                         "@erp_comision_porc,\n"+
                         "@erp_comision_monto,\n"+
                         "@codigo_presentacion" +
                         ")")
                    };
                    //#endregion
                    
                    transaction.commit(tErr => {if(tErr) {console.log(tErr)}})
                    res.send({estado: true, codigo: 0, mensaje: ""});
                }else{
                    console.log("No se encuentra el documento para borrar");
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
})

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
                .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                .input("erp_ptovta", mssql.VarChar(250), codigo_punto_venta)
                .input("idmotivo_venta", mssql.VarChar(250), req.body.motivo)
                .input("cnum_doc", mssql.VarChar(250), req.body.numero_correlativo)
                .query("DELETE FROM Hcotizad WHERE ccod_empresa =@ccod_empresa and erp_ptovta = @erp_ptovta and idmotivo_venta =@idmotivo_venta and cnum_doc = @cnum_doc")
                
                const request_cabecera = new mssql.Request(transaction);
                await request_cabecera 
                .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                .input("erp_ptovta", mssql.VarChar(250), codigo_punto_venta)
                .input("idmotivo_venta", mssql.VarChar(250), req.body.motivo)
                .input("cnum_doc", mssql.VarChar(250), req.body.numero_correlativo)
                .query("Delete hcotizac where ccod_empresa =@ccod_empresa and punto_venta  =@erp_ptovta and idmotivo_venta =@idmotivo_venta and cnum_doc  =@cnum_doc")
                
                if( req.body.automatico == "A") {
                    serie_motivo = req.body.numero_correlativo.substr(-20,4)
                    numero_motivo = req.body.numero_correlativo.substr(-4) - 1

                    const request_automatico = new mssql.Request(transaction);
                    await request_automatico 
                    .input("erp_codemp", mssql.VarChar(250), codigo_empresa)
                    .input("erp_codmot", mssql.VarChar(250), req.body.motivo)
                    .input("erp_sermot", mssql.VarChar(250), serie_motivo)
                    .input("erp_nummot", mssql.VarChar(250), parseInt(numero_motivo))
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

router.post('/anular', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.user.codigo_punto_venta;
        
        const pool = await poolPromise
        await pool
        .request()
        .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
        .input("erp_ptovta", mssql.VarChar(250), codigo_punto_venta)
        .input("idmotivo_venta", mssql.VarChar(250), req.body.motivo)
        .input("cnum_doc", mssql.VarChar(250), req.body.numero_correlativo)
        .query("Update Hcotizac set estado = 'Anulado' where ccod_empresa =@ccod_empresa and punto_venta  =@erp_ptovta and idmotivo_venta =@idmotivo_venta and cnum_doc  =@cnum_doc")

        res.send({estado: true, codigo: 0, mensaje: ""});
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
                var opcion = "and MONTH(Hcotizac.dfecha_doc) = @mes AND YEAR(Hcotizac.dfecha_doc) = @anio \n"
                break;
            case "rango_fechas":
                var opcion = "and Hcotizac.dfecha_doc between @fecha_inicio and @fecha_final \n"
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
        .query("SELECT  "+ 
        "Halmacen.cnom_almacen as Punto_Venta,  "+  
        "Hcotizac.tipo as Tipo_Venta,  "+   
        "'COTIZACIÓN' as Tipo_Documento,  "+   
        "erp_motivos_tramite.erp_nommot as Motivo_Serie,   "+  
        "Hcotizac.cnum_doc as Numero,    "+ 
        "CONVERT(VARCHAR(50),Hcotizac.dfecha_doc,3) as Fecha,    "+ 
        "CONVERT(VARCHAR(50),Hcotizac.dfecha_entr,3) as Fecha_Entrega,    "+ 
        "Hcotizac.ccod_cliente as Codigo,    "+ 
        "Hcotizac.cnom_cliente_c as Nombre,    "+ 
        "Hfor_pag.cnom_forpago as Forma_Pago,  "+   
        "Hcotizac.cmoneda as Moneda,    "+ 
        "Hcotizac.tipocambio as tc,    "+ 
        "Hcotizac.nimporte as Importe,   "+  
        "Hvended.cnom_vendedor  as vendedor,  "+   
        "Hcotizac.estado as Estado,    "+ 
        "Hcotizac.caprobado as Aprobado,    "+ 
        "case Hcotizac.caprobado when 'Sin Aprobacion' then '' else (ltrim(rtrim(Hperson.Ape_pat)) + ' ' + ltrim(rtrim(ape_mat)) + ' ' + ltrim(rtrim(nombres))) end as Persona_Aprob,   "+  
        "case Hcotizac.caprobado when 'Sin Aprobacion' then '' else CONVERT(VARCHAR(50),Hcotizac.dfecha_aprobacion,3) end as Fecha_Aprob,    "+ 
        "Hcotizac.atencion as Atencion,    "+ 
        "Hcotizac.porcentaje as Porcentaje,   "+  
        "Hcotizac.usuario as Usuario,    "+ 
        "Hcotizac.Pc_User as Nombre_Pc,    "+ 
        "CONVERT(VARCHAR,Hcotizac.Pc_Fecha,3) as Fecha_Grab,   "+  
        "CONVERT(VARCHAR,Hcotizac.Pc_Fecha,24) as Hora_Grab,   "+  
        "Hcotizac.Pc_Ip as Ip_Pc,    "+ 
        "Hcotizac.punto_venta as Codigo_Punto_Venta,    "+ 
        "Hcotizac.idmotivo_venta as Codigo_Motivo_Serie,    "+ 
        "'COT' as Codigo_Tipo_Documento,    "+ 
        "'' as Estado_Fe,  "+
        "'' as Tipo_Referencia_Documento,  "+
        "Hcotizac.motivo_ref as Motivo_Serie_Referencia_Documento,  "+
        "Hcotizac.num_ref as Numero_Referencia_Documento  "+
        "FROM Hcotizac INNER JOIN Halmacen ON    "+ 
        "Hcotizac.ccod_empresa = Halmacen.ccod_empresa and    "+ 
        "Hcotizac.punto_venta = Halmacen.ccod_almacen     "+ 
        "INNER JOIN erp_motivos_tramite ON    "+ 
        "Hcotizac.ccod_empresa = erp_motivos_tramite.erp_codemp and   "+  
        "Hcotizac.idmotivo_venta = erp_motivos_tramite.erp_codmot   "+  
        "Inner Join hfor_pag ON    "+ 
        "Hcotizac.ccod_empresa = Hfor_pag.ccod_empresa and  "+   
        "Hcotizac.ccod_forpago = Hfor_pag.ccod_forpago    "+ 
        "Inner Join hperson On    "+ 
        "Hcotizac.ccod_empresa = Hperson.ccod_empresa and   "+  
        "Hcotizac.ccod_empleado_aprueba  = Hperson.ccod_person  "+   
        "Inner Join Hvended On    "+ 
        "Hcotizac.ccod_empresa = Hvended.ccod_empresa and "+    
        "Hcotizac.ccod_person = Hvended.ccod_vendedor    "+ 
        "WHERE Hcotizac.ccod_empresa = @codigo_empresa AND    "+  
        "Hcotizac.punto_venta = @codigo_punto_venta "+opcion+  
        "order by dfecha_doc desc,idmotivo_venta,cnum_doc desc");
          
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
        .input('estado', mssql.VarChar(250), req.body.estado)
        .query("SELECT  "+ 
        "Halmacen.cnom_almacen as Punto_Venta,  "+   
        "erp_motivos_tramite.erp_nommot as Motivo_Serie,   "+  
        "CONVERT(VARCHAR(50),Hcotizac.dfecha_doc,3) as Fecha,    "+ 
        "CONVERT(VARCHAR(50),Hcotizac.dfecha_entr,3) as Fecha_Entrega,    "+ 
        "Hcotizac.ccod_cliente as Codigo_Cliente,    "+ 
        "Hcotizac.cnom_cliente_c as Cliente,    "+ 
        "Hcotizac.ccod_cencos as Codigo_Centro_Costo, \n"+
        "Hcencos.cnom_cencos as Centro_Costo, \n"+
        "Hcotizac.ot as Codigo_Orden_Trabajo, \n"+
        "Horden_trabajo.cnom_ot as Orden_Trabajo, \n"+
        "Hcotizac.erp_codune as Codigo_Unidad_Negocio, \n"+
        "erp_unidad_negocio.erp_nomune as Unidad_Negocio, \n"+
        "Hfor_pag.cnom_forpago as Forma_Pago,  "+   
        "Hcotizac.cmoneda as Moneda,    "+ 
        "Hcotizac.tipocambio as Tipo_Cambio,    "+ 
        "Hcotizac.nimporte as Importe,   "+  
        "Hvended.cnom_vendedor  as Vendedor,  "+   
        "Hcotizac.estado as Estado,    "+ 
        "Hcotizac.caprobado as Aprobado,    "+ 
        "case Hcotizac.caprobado when 'Sin Aprobacion' then '' else (ltrim(rtrim(Hperson.Ape_pat)) + ' ' + ltrim(rtrim(ape_mat)) + ' ' + ltrim(rtrim(nombres))) end as Persona_Aprobado,   "+  
        "case Hcotizac.caprobado when 'Sin Aprobacion' then '' else CONVERT(VARCHAR(50),Hcotizac.dfecha_aprobacion,3) end as Fecha_Aprobado,    "+ 
        "Hcotizac.atencion as Atencion,    "+ 
        "Hcotizac.porcentaje as Porcentaje,   "+  
        "Hcotizac.usuario as Usuario,    "+ 
        "Hcotizac.Pc_User as Nombre_Pc,    "+ 
        "CONVERT(VARCHAR,Hcotizac.Pc_Fecha,3) as Fecha_Grab,   "+  
        "CONVERT(VARCHAR,Hcotizac.Pc_Fecha,24) as Hora_Grab,   "+  
        "Hcotizac.Pc_Ip as Ip_Pc,    "+ 
        "Hcotizac.idmotivo_venta as Codigo_Motivo_Serie,    "+ 
        "Hcotizac.cnum_doc as Numero,    "+ 
        "Hcotizac.punto_venta as Codigo_Punto_Venta    "+ 
        "FROM Hcotizac INNER JOIN Halmacen ON    "+ 
        "Hcotizac.ccod_empresa = Halmacen.ccod_empresa and    "+ 
        "Hcotizac.punto_venta = Halmacen.ccod_almacen     "+ 
        "INNER JOIN erp_motivos_tramite ON    "+ 
        "Hcotizac.ccod_empresa = erp_motivos_tramite.erp_codemp and   "+  
        "Hcotizac.idmotivo_venta = erp_motivos_tramite.erp_codmot   "+  
        "Inner Join hfor_pag ON    "+ 
        "Hcotizac.ccod_empresa = Hfor_pag.ccod_empresa and  "+   
        "Hcotizac.ccod_forpago = Hfor_pag.ccod_forpago    "+ 
        "Inner Join hperson On    "+ 
        "Hcotizac.ccod_empresa = Hperson.ccod_empresa and   "+  
        "Hcotizac.ccod_empleado_aprueba  = Hperson.ccod_person  "+   
        "Inner Join Hvended On    "+ 
        "Hcotizac.ccod_empresa = Hvended.ccod_empresa and "+    
        "Hcotizac.ccod_person = Hvended.ccod_vendedor    "+ 
        "Inner Join Hcencos On \n"+
        "Hcotizac.ccod_empresa = Hcencos.ccod_empresa and \n"+
        "Hcotizac.ccod_cencos  = Hcencos.ccod_cencos \n"+
        "Inner Join Horden_trabajo On \n"+
        "Hcotizac.ccod_empresa = Horden_trabajo.ccod_empresa and \n"+
        "Hcotizac.ot  = Horden_trabajo.ccod_ot \n"+
        "Inner Join erp_unidad_negocio On \n"+
        "Hcotizac.ccod_empresa = erp_unidad_negocio.erp_codemp and \n"+
        "Hcotizac.erp_codune  = erp_unidad_negocio.erp_codune \n"+
        "WHERE Hcotizac.ccod_empresa = @codigo_empresa AND \n"+  
        "Hcotizac.punto_venta = @codigo_punto_venta AND \n"+  
        "Hcotizac.caprobado = @estado \n"+  
        // "order by dfecha_doc desc,idmotivo_venta,cnum_doc desc"
        "order by dfecha_doc desc, cnum_doc desc"
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
            .query("update Hcotizac set caprobado = @estado, ccod_empleado_aprueba = @responsable, cobservacion_aprobacion = @comentario, dfecha_aprobacion = @fecha  where ccod_empresa=@codigo_empresa and punto_venta=@punto_venta and idmotivo_venta=@motivo and cnum_doc=@numero ");
            rowsAffected++;
        }
        
        res.send({estado: true, codigo: "0", mensaje: rowsAffected});
    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
});

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
        .input('codigo_punto_venta', mssql.VarChar(5), codigo_punto_venta)
        .input('motivo_documento', mssql.VarChar(250), motivo_documento)
        .input('numero_documento', mssql.VarChar(250), numero_documento)
        .query(
            "select \n"+
            "'COTIZACIÓN' as documento_nombre, \n"+
            "Hcotizac.tipo as documento_tipo,\n"+
            "Hcotizac.punto_venta as documento_punto_venta_codigo,\n"+
            "pto_venta.cnom_almacen as documento_punto_venta_nombre,\n"+
            "Hcotizac.idmotivo_venta as documento_motivo_venta_codigo,\n"+
            "Hcotizac.cnum_doc as documento_numero,\n"+
            "CONVERT(VARCHAR(50),Hcotizac.dfecha_doc,103) as documento_fecha,\n"+
            "CONVERT(VARCHAR(50),Hcotizac.dfecha_entr,103) as documento_fecha_entrega,\n"+
            "CONVERT(VARCHAR(50),Hcotizac.dfecha_validez,103) as documento_fecha_validez,\n"+
            "CONVERT(VARCHAR(50),Hcotizac.dfecha_doc,23) as documento_fecha_format23,\n"+
            "CONVERT(VARCHAR(50),Hcotizac.dfecha_entr,23) as documento_fecha_entrega_format23,\n"+
            "CONVERT(VARCHAR(50),Hcotizac.dfecha_validez,23) as documento_fecha_validez_format23,\n"+
            "Hcotizac.cmoneda as documento_moneda,\n"+
            "Hcotizac.nimporte as documento_nimporte,\n"+
            "RTRIM(LTRIM(Hcotizac.ccod_forpago)) as documento_forma_pago_codigo,\n"+
            "Hcotizac.ccod_cliente as Codigo_Cliente,\n"+
            "Hcotizac.cnom_cliente_c as cliente_nombre,\n"+
            "Hcotizac.cnum_ruc_c as cliente_ruc,\n"+
            "Hcotizac.estado as documento_estado,\n"+
            "Hcotizac.siigv as documento_mas_igv,\n"+
            "Hcotizac.ctipo_cambio as nombre_tipo_cambio,\n"+
            "Hcotizac.tipocambio as tipo_cambio,\n"+
            "Hcotizac.lista_precios as documento_lista_precios,\n"+
            "Hcotizac.telefono as cliente_telefono,\n"+
            "Hcotizac.fax as cliente_fax,\n"+
            "Hcotizac.email as cliente_correo,\n"+
            "Hcotizac.caprobado as documento_aprobacion_estado,\n"+
            "CONVERT(VARCHAR(50),Hcotizac.dfecha_aprobacion,103) as documento_aprobacion_fecha,\n"+
            "Hcotizac.ccod_empleado_aprueba as documento_aprobacion_codigo_responsable,\n"+
            "Hcotizac.cobservacion_aprobacion as documento_aprobacion_comentario,\n"+
            "(Aprobacion1.ape_pat+' '+Aprobacion1.ape_mat+' '+Aprobacion1.nombres) as documento_aprobacion1,\n"+
            "(Aprobacion1.email) as documento_aprobacion1_correo,\n"+
            "Aprobacion1.imagen_firma as documento_firma_Aprobacion1,\n"+
            "Hcotizac.ccod_cencos as documento_cencos_codigo,\n"+
            "Hcencos.cnom_cencos as documento_cencos_nombre,\n"+
            "Hcotizac.descuento as documento_descuento_porc,\n"+
            "Hcotizac.ot as documento_ot_codigo,\n"+
            "Hcotizac.pto_llegada as documento_punto_llegada,\n"+
            "Hcotizac.dias as documento_dias,\n"+
            "LTRIM(RTRIM(Hcotizac.pais)) as cliente_pais,\n"+
            "Hcotizac.atencion as documento_atencion_estado,\n"+
            "Hcotizac.porcentaje as documento_atencion_porcentaje,\n"+
            "LTRIM(RTRIM(Hcotizac.cod_contacto)) as cliente_contacto_codigo,\n"+
            "isnull(LTRIM(RTRIM(Hpercontactocli.erp_cargo)),'-') as cliente_contacto_cargo,\n"+
            "LTRIM(RTRIM(Hcotizac.ccod_person)) as documento_vendedor1,\n"+
            "Hcotizac.vendedor_2 as documento_vendedor2,\n"+
            "Hcotizac.Glosa as documento_glosa,\n"+
            "Hcotizac.erp_codage as cliente_agencia,\n"+
            "Hcotizac.usuario as usuario_codigo,\n"+
            "Hcotizac.Pc_User as pc_user,\n"+
            "Hcotizac.Pc_Fecha as pc_fecha,\n"+
            "Hcotizac.Pc_Ip as pc_ip,\n"+
            "Hcotizac.erp_presupuesto as presupuesto_codigo,\n"+
            "Hcotizac.subtotal_sin_descuentos as documento_subtotal_sin_descuentos,\n"+
            "Hcotizac.erp_Ddescuento as documento_descuento,\n"+
            "Hcotizac.erp_Dsubtotal as documento_subtotal,\n"+
            "Hcotizac.erp_Digv as documento_igv,\n"+
            "Hcotizac.erp_Dimporte as documento_importe,\n"+
            "Hcotizac.erp_Dpercepcion as documento_percepcion,\n"+
            "Hcotizac.erp_Dtotal as documento_total,\n"+
            "Hcotizac.erp_gestor as gestor_codigo,\n"+
            "Hcotizac.tipo as documento_tipo,\n"+
            "Hcotizac.motivo_ref as documento_referencia_motivo_codigo,\n"+
            "case Hcotizac.nom_contacto when'00 - NINGUNO' then '-' else Hcotizac.nom_contacto end as cliente_contacto_nombre,\n"+
            "Hcotizac.erp_codune as unidad_negocio_codigo,\n"+
            "erp_unidad_negocio.erp_nomune as documento_nombre_unidad_negocio,\n"+
            "Hcotizac.automatico as documento_automatico,\n"+
            "Hcotizac.erp_nro_exp as numero_expediente1,\n"+
            "Hcotizac.erp_nro_exp2 as numero_expediente2,\n"+
            "Hcotizac.observacion as Comentario01,\n"+
            "0 as documento_total_productos,\n"+
            "Hvended.cnom_vendedor as documento_vendedor1_nombre2,\n"+
            "Hvended.email as documento_vendedor1_correo,\n"+
            "Hvended.imagen_firma as documento_firma_vendedor,\n"+
            "Isnull(Hvended.telefono2,'Celular') as documento_vendedor1_celular,\n"+
            "--Cliente\n"+
            "hcliente.cdireccion as cliente_direccion,\n"+
            "--Forma Pago\n"+
            "Hfor_pag.cnom_forpago as forma_pago_nombre,\n"+
            "--Detalle\n"+
            "Hcotizad.nitem as detalle_orden,\n"+
            "Hcotizad.ccod_articulo as articulo_codigo,\n"+
            "Hcotizad.cnom_articulo as articulo_nombre,\n"+
            "Hcotizad.cunidad as articulo_unidad,\n"+
            "Hcotizad.igv_art as articulo_igv_porcentaje,\n"+
            "Hcotizad.factor as articulo_factor,\n"+
            "Hcotizad.ncantidad as articulo_cantidad,\n"+
            "Hcotizad.ncantidad3 as articulo_kardex,\n"+
            "Hcotizad.nprecio as articulo_precio,\n"+
            "Hcotizad.nigv as articulo_igv,\n"+
            "Hcotizad.desc1 as articulo_descuento1,\n"+
            "Hcotizad.desc2 as articulo_descuento2,\n"+
            "Hcotizad.barticulo as articulo_barticulo,\n"+
            "Hcotizad.cantidad_presentacion as articulo_presentacion_cantidad,\n"+
            "Hcotizad.nombre_presentacion as articulo_presentacion_nombre,\n"+
            "Hcotizad.unidad_presentacion as articulo_presentacion_unidad,\n"+
            "Hcotizad.precio_presentacion as articulo_presentacion_precio,\n"+
            "Hcotizad.base_imp as articulo_base_imponible,\n"+
            "Hcotizad.base_calculada as articulo_base_calculada,\n"+
            "Hcotizad.monto_descuento as articulo_monto_descuento,\n"+
            "Hcotizad.nimporte as articulo_importe,\n"+
            "Hcotizad.precio_original as articulo_precio_original,\n"+
            "Hcotizad.Desc3 as articulo_descuento3,\n"+
            "Hcotizad.erp_percepcion_sn as articulo_percepcion_sn,\n"+
            "Hcotizad.erp_percepcion_uni as articulo_percepcion_uni,\n"+
            "Hcotizad.erp_percepcion_porc as articulo_percepcion_porc,\n"+
            "Hcotizad.erp_desc4 as articulo_descuento4,\n"+
            "Hcotizad.erp_cod_almacen as articulo_almacen_codigo,\n"+
            "Hcotizad.erp_base_calc_dec as articulo_base_calculada_dec,\n"+
            "Hcotizad.erp_base_imp_dec as articulo_base_imponible_dec,\n"+
            "Hcotizad.erp_igv_dec as articulo_igv_dec,\n"+
            "Hcotizad.erp_importe_dec as articulo_importe_dec,\n"+
            "Hcotizad.erp_comision_porc as articulo_comision_porc,\n"+
            "Hcotizad.erp_comision_monto as articulo_comision_monto,\n"+
            "Hcotizad.codigo_presentacion as articulo_presentacion_codigo,\n"+
            "--Empresa\n"+
            "Hempresa.ccod_empresa as empresa_codigo, \n"+
            "Hempresa.crazonsocial as empresa_razon_social, \n"+
            "Hempresa.rutadelogo as empresa_ruta_logo, \n"+
            "Hempresa.fax_3 as empresa_logo, \n"+
            "hempresa.nro_cuenta_mn as empresa_cuenta1,\n"+
            "hempresa.nro_cuenta_me as empresa_cuenta2,\n"+
            "hempresa.ctelefono as empresa_telefono,\n"+
            "hempresa.cpag_web as empresa_web,\n"+
            "hempresa.cnum_ruc as empresa_ruc,\n"+
            "hempresa.cdireccion as empresa_direccion,\n"+
            "hempresa.cemail as empresa_correo,\n"+
            "--Configuración Formatos\n"+
            "HCONFIG_FORMATOS.valor as cantidad_filas,\n"+
            "'COT' as documento_tipo_movimiento\n"+
            "from Hcotizac \n"+
            "left join Hcotizad on\n"+
            "Hcotizac.ccod_empresa = Hcotizad.ccod_empresa\n"+
            "and Hcotizac.punto_venta = Hcotizad.erp_ptovta\n"+
            "and Hcotizac.idmotivo_venta = Hcotizad.idmotivo_venta\n"+
            "and Hcotizac.cnum_doc = Hcotizad.cnum_doc\n"+
            "inner join hcliente on \n"+
            "Hcotizac.ccod_empresa = hcliente.ccod_empresa\n"+
            "and Hcotizac.ccod_cliente = hcliente.ccod_cliente\n"+
            "inner join Hfor_pag on \n"+
            "Hcotizac.ccod_empresa = Hfor_pag.ccod_empresa\n"+
            "and Hcotizac.ccod_forpago = Hfor_pag.ccod_forpago\n"+
            "inner join HCONFIG_FORMATOS on \n"+
            "Hcotizac.ccod_empresa = HCONFIG_FORMATOS.ccod_empresa\n"+
            "and 'COT' = HCONFIG_FORMATOS.tipo_doc\n"+
            "inner join Hempresa on \n"+
            "hcotizac.ccod_empresa = Hempresa.ccod_empresa\n"+
            "left join Hpercontactocli on \n"+
            "Hpercontactocli.ccod_empresa = hcotizac.ccod_empresa\n"+
            "and Hpercontactocli.ccod_cliente = hcotizac.ccod_cliente\n"+
            "and Hpercontactocli.ccod_contacto = hcotizac.cod_contacto\n"+
            "and Hpercontactocli.ccod_contacto <> '00'\n"+
            "inner join erp_unidad_negocio on\n"+
            "Hcotizac.ccod_empresa = erp_unidad_negocio.erp_codemp \n"+
            "and Hcotizac.erp_codune = erp_unidad_negocio.erp_codune\n"+
            "inner join Halmacen pto_venta on\n"+
            "Hcotizac.ccod_empresa = pto_venta.ccod_empresa \n"+
            "and Hcotizac.punto_venta = pto_venta.ccod_almacen\n"+
            "inner join Hcencos on \n"+
            "Hcotizac.ccod_empresa = Hcencos.ccod_empresa  \n"+
            "and Hcotizac.ccod_cencos = Hcencos.ccod_cencos \n"+
            "Inner Join Hvended On  \n"+
            "Hcotizac.ccod_empresa = Hvended.ccod_empresa and \n"+
            "Hcotizac.ccod_person = Hvended.ccod_vendedor   \n"+
            "inner join Hperson Aprobacion1 on \n"+
            "Hcotizac.ccod_empresa = Aprobacion1.ccod_empresa \n"+
            "and Hcotizac.ccod_empleado_aprueba = Aprobacion1.ccod_person \n"+
            "where \n"+
            "Hcotizac.ccod_empresa = @codigo_empresa\n"+
            "and Hcotizac.punto_venta = @codigo_punto_venta\n"+
            "and Hcotizac.idmotivo_venta = @motivo_documento\n"+
            "and Hcotizac.cnum_doc = @numero_documento");

        const Cabecera = lista.recordset;
        res.json(Cabecera);
    } catch (err) {
        res.send(err.message);
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
        .input('codigo_cliente', mssql.VarChar(250), req.body.codigo)
        .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
        .input('todos', mssql.VarChar(250), req.body.todos)
        .query(
            "Select \n"+
            "Hcotizac.punto_venta as Punto_Venta, \n"+
            "Hcotizac.tipo as Tipo_Venta, \n"+
            "'COT' as Tipo_Documento, \n"+
            "Rtrim(Ltrim(Hcotizac.idmotivo_venta)) as Codigo_Motivo_Serie, \n"+
            "Hcotizac.cnum_doc as Numero,\n"+
            "CONVERT(VARCHAR(50),Hcotizac.dfecha_doc,103) as Fecha,\n"+
            "Hcliente.ccod_cliente as Codigo_Cliente,\n"+
            "Hcliente.cnom_cliente as Nombre_Cliente,\n"+
            "CONVERT(VARCHAR(50),Hcotizac.dfecha_entr,103) as Fecha_Entrega,\n"+
            "RTRIM(LTRIM(Hcotizac.ccod_forpago)) as Forma_Pago,\n"+
            "Hcotizac.cmoneda as Moneda,\n"+
            "hcencos.ccod_cencos as Cencos,\n"+
            "Hcotizac.ot as Ot,\n"+
            "hcencos.responsable as Codigo_Responsable,\n"+
            "Hcotizac.erp_codune as Codigo_Unidad_Negocio,\n"+
            "Hcotizac.erp_codage as Codigo_Agencia,\n"+
            "Hcotizac.glosa as glosa,\n"+
            "Hcotizac.siigv as si_igv,\n"+
            "(hcencos.cnom_cencos) as Nombre_Cencos,\n"+
            "(ERP_MOTIVOS_TRAMITE.erp_nommot) as Motivo_Serie,\n"+
            "Hcotizac.descuento as Porc_Descuento,\n"+
            "Hcotizac.telefono as Telefono_Cliente,\n"+
            "Hcotizac.cod_contacto as Codigo_Contacto,\n"+
            "Hcotizac.nom_contacto as Nombre_Contacto,\n"+
            "Hcotizac.email as Correo_Cliente,\n"+
            "Hcotizac.lista_precios as Lista_Precios,\n"+
            "Hcotizac.dias as Dias_Forma_Pago,\n"+
            "Hcotizac.ccod_person as Vendedor1,\n"+
            "Hcotizac.subtotal_sin_descuentos as Sub_Total_Sin_Descuentos,\n"+
            "Hcotizac.erp_Ddescuento as Monto_Descuento,\n"+
            "Hcotizac.erp_Dsubtotal as Sub_Total,\n"+
            "Hcotizac.erp_Digv as Igv,\n"+
            "Hcotizac.erp_Dtotal as Total,\n"+
            "Hcotizac.erp_presupuesto as Codigo_Presupuesto,\n"+
            "Hcotizac.pto_llegada as Punto_Llegada,\n"+
            "vendedor_2 as Vendedor2,\n"+
            "Hcotizac.erp_gestor as Codigo_Gestor,\n"+
            "hcliente.cdireccion as Cliente_Direccion,\n"+
            "Hcotizac.erp_nro_exp as Numero_Expediente1,\n"+
            "Hcotizac.erp_nro_exp2 as Numero_Expediente2\n"+
            "From Hcotizac \n"+
            "Inner Join Hcliente On\n"+
            "Hcotizac.ccod_empresa= Hcliente.ccod_empresa And\n"+
            "Hcotizac.ccod_cliente = Hcliente.ccod_cliente\n"+
            "Inner Join hcencos On\n"+
            "Hcotizac.ccod_cencos = hcencos.ccod_cencos And\n"+
            "Hcotizac.ccod_empresa = hcencos.ccod_empresa\n"+
            "Inner Join ERP_MOTIVOS_TRAMITE on\n"+
            "Hcotizac.ccod_empresa= ERP_MOTIVOS_TRAMITE.erp_codemp And\n"+
            "Hcotizac.idmotivo_venta = ERP_MOTIVOS_TRAMITE.erp_codmot\n"+
            "inner join Hconfiguraciones_2 on\n"+
            "hcotizac.ccod_empresa= Hconfiguraciones_2.idempresa\n"+
            "Where Hcotizac.ccod_empresa = @codigo_empresa And \n"+
            "Hcotizac.punto_venta = @codigo_punto_venta AND    "+  
            "case @todos when 'S' then '' else Hcotizac.atencion end <> 'Atendido' \n"+
            "and Hcotizac.estado <> 'Anulado'\n"+
            "and (Hcotizac.caprobado ='Aprobado'\n"+
            "or cotizacion_aprobacion= 'N')\n"+
            "and Hcotizac.ccod_cliente = \n"+
            "(case when @codigo_cliente = '' then Hcotizac.ccod_cliente else @codigo_cliente end ) \n"+
            "Order By Hcotizac.dfecha_doc desc,cnum_doc desc"
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
        .input('codigo_punto_venta', mssql.VarChar(200), req.body.punto_venta)
        .input('motivo_serie', mssql.VarChar(200), req.body.motivo_serie)
        .input('numero_documento', mssql.VarChar(200), req.body.numero)
        .input('todos', mssql.VarChar(250), req.body.todos)
        .query(
            "select \n"+
            "Cantidad_Por_Atender - \n"+
            "case Cantidad_Atendida when -1 then 0 else Cantidad_Atendida end as Cantidad, \n"+
            "Cantidad_Kardex_Por_Atender - \n"+
            "case Cantidad_Kardex_Atendida when -1 then 0 else Cantidad_Kardex_Atendida end as Cantidad_Kardex, \n"+
            "* from ( \n"+
            "SELECT \n"+
            "Hcotizad.erp_ptovta as Punto_Venta, \n"+
            "Hcotizad.idmotivo_venta as Codigo_Motivo_Serie, \n"+
            "Hcotizad.cnum_doc as Numero, \n"+
            "Hcotizad.nitem as NItem, \n"+
            "Hcotizad.NCANTIDAD as Cantidad_Por_Atender, \n"+
            "(case @todos when 'S' then 0 else isnull(( \n"+
            "select sum(hpedidod.ncantidad3) from hpedidod \n"+
            "inner join Hpedidoc on \n"+
            "Hpedidoc.ccod_empresa = hpedidod.ccod_empresa \n"+
            "and Hpedidoc.ccod_almacen = hpedidod.ccod_almacen \n"+
            "and Hpedidoc.idmotivo_venta = hpedidod.idmotivo_venta \n"+
            "and Hpedidoc.cnum_doc = hpedidod.cnum_doc \n"+
            "where \n"+
            "hpedidod.ccod_empresa = Hcotizad.ccod_empresa \n"+
            "and Hpedidod.idmotivo_cotizacion = hcotizad.idmotivo_venta \n"+
            "and Hpedidod.numero_cotizacion = hcotizad.cnum_doc \n"+
            "and Hpedidod.ptovta_cotizacion = hcotizad.erp_ptovta \n"+
            "and hpedidoc.estado <> 'Anulado' \n"+
            "and hpedidod.ccod_articulo = hcotizad.ccod_articulo \n"+
            "and hpedidod.cunidad = hcotizad.cunidad \n"+
            "and hpedidod.nitem_ref = Hcotizad.nitem \n"+
            "),-1) end) as Cantidad_Atendida, \n"+
            "Hcotizad.CCOD_ARTICULO AS Codigo, \n"+
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
            "Hcotizad.CNOM_ARTICULO AS Nombre, \n"+
            "RTRIM(Hcotizad.CUNIDAD) AS Codigo_Unidad, \n"+
            "RTRIM(Hcotizad.CUNIDAD) AS Unidad, \n"+
            "hcotizad.erp_comision_porc as Comision_porcentaje, \n"+
            "hcotizad.factor as Factor, \n"+
            "Hcotizad.NPRECIO as Unit, \n"+
            "Hcotizad.BASE_IMP as Base_Imponible, \n"+
            "Hcotizad.DESC1 as Desc1, \n"+
            "Hcotizad.DESC2 as Desc2, \n"+
            "Hcotizad.Desc3 As Desc3, \n"+
            "Hcotizad.erp_desc4 as Desc4, \n"+
            "Hcotizad.BASE_CALCULADA as Base_Calculada, \n"+
            "Hcotizad.NIGV as Igv, \n"+
            "Hcotizad.NIMPORTE as Importe, \n"+
            "hcotizad.erp_peso as Peso, \n"+
            "Halmacen_2.ccod_almacen as Codigo_Almacen, \n"+
            "Halmacen_2.cnom_almacen as Almacen, \n"+
            "Hcotizad.cantidad_presentacion as Cantidad_presentacion, \n"+
            "Hcotizad.codigo_presentacion as Codigo_presentacion, \n"+
            "RTRIM(Hcotizad.unidad_presentacion) AS Unidad_presentacion, \n"+
            "Hcotizad.nombre_presentacion AS Nombre_presentacion, \n"+
            "Hcotizad.precio_presentacion as Precio_presentacion, \n"+
            "Hcotizad.erp_observacion as Observacion, \n"+
            "Hcotizad.OT as OT, \n"+
            "Hcotizad.NCANTIDAD3 as Cantidad_Kardex_Por_Atender, \n"+
            "isnull(( \n"+
            "select sum(hpedidod.ncantidad) from hpedidod \n"+
            "inner join Hpedidoc on \n"+
            "Hpedidoc.ccod_empresa = hpedidod.ccod_empresa \n"+
            "and Hpedidoc.ccod_almacen = hpedidod.ccod_almacen \n"+
            "and Hpedidoc.idmotivo_venta = hpedidod.idmotivo_venta \n"+
            "and Hpedidoc.cnum_doc = hpedidod.cnum_doc \n"+
            "where \n"+
            "hpedidod.ccod_empresa = Hcotizad.ccod_empresa \n"+
            "and Hpedidod.idmotivo_cotizacion = hcotizad.idmotivo_venta \n"+
            "and Hpedidod.numero_cotizacion = hcotizad.cnum_doc \n"+
            "and Hpedidod.ptovta_cotizacion = hcotizad.erp_ptovta \n"+
            "and hpedidoc.estado <> 'Anulado' \n"+
            "and hpedidod.ccod_articulo = hcotizad.ccod_articulo \n"+
            "and hpedidod.cunidad = hcotizad.cunidad \n"+
            "and hpedidod.nitem_ref = Hcotizad.nitem \n"+
            "),-1) as Cantidad_Kardex_Atendida, \n"+
            "Hcotizad.barticulo as Barticulo, \n"+
            "Hcotizad.igv_art as Igv_Art, \n"+
            "Hcotizad.monto_descuento as Monto_Descuento, \n"+
            "hcotizad.precio_original as Precio_original, \n"+
            "hcotizad.erp_codune as Codigo_Unidad_Negocio,\n"+
            "Hcotizad.erp_codune as Unidad_negocio,\n"+
            "Hcotizad.CCENCOS AS Codigo_Cencos,\n"+
            "Hcotizad.CCENCOS AS Cencos,\n"+
            "Hcotizad.erp_presupuesto as Codigo_Partida_presupuestal,\n"+
            "Hcotizad.erp_presupuesto as Partida_presupuestal,\n"+
            "Hcotizad.erp_codage as Codigo_Agencia,\n"+
            "Hcotizad.erp_codage as Agencia,\n"+
            "Hcotizad.erp_percepcion_sn as Percepcion_sn, \n"+
            "Hcotizad.erp_percepcion_uni as Percepcion_uni, \n"+
            "Hcotizad.erp_percepcion_porc as Perpecion_porc, \n"+
            "Hcotizad.erp_boni_sn as Boni_sn, \n"+
            "Hcotizad.erp_item_boni as Item_boni, \n"+
            "hcotizad.erp_comision_monto as Comision_monto, \n"+
            "hcotizad.erp_base_calc_dec as Base_calculada_dec, \n"+
            "hcotizad.erp_base_imp_dec as Base_imp_dec, \n"+
            "hcotizad.erp_igv_dec as Igv_dec, \n"+
            "hcotizad.erp_importe_dec as Importe_dec, \n"+
            "Harticul.csistock as Stock_SN, \n"+
            "Harticul.lote as Lote_SN, \n"+
            "'' as Lote_Numero, \n"+
            "'' as Lote_Vencimiento, \n"+
            "Harticul.flagserie Serie_SN, \n"+
            "'' as Serie_Numero, \n"+
            "Hcotizad.erp_ptovta as Cotizacion_Punto_Venta, \n"+
            "Hcotizad.idmotivo_venta as Cotizacion_Motivo, \n"+
            "Hcotizad.cnum_doc as Cotizacion_Numero, \n"+
            "Hcotizad.nitem as Cotizacion_NItem \n"+
            "FROM Hcotizad inner Join Harticul On \n"+
            "Hcotizad.ccod_empresa = Harticul.ccod_empresa and \n"+
            "Hcotizad.ccod_articulo = Harticul.ccod_articulo \n"+
            "inner join erp_concepto1 on \n"+
            "erp_concepto1.erp_codemp = Harticul.ccod_empresa and \n"+
            "erp_concepto1.erp_codcon = Harticul.codmarca \n"+
            "inner join Halmacen_2 on \n"+
            "Halmacen_2.ccod_empresa = Hcotizad.ccod_empresa and \n"+
            "Halmacen_2.ccod_almacen = Hcotizad.erp_cod_almacen \n"+
            "WHERE \n"+
            "Hcotizad.ccod_empresa = @codigo_empresa and \n"+
            "Hcotizad.idmotivo_venta = @motivo_serie and\n"+
            "Hcotizad.cnum_doc = @numero_documento and \n"+
            "Hcotizad.erp_ptovta= @codigo_punto_venta \n"+
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
            .input('tipo_documento', mssql.VarChar(250), "Cotizacion")
            .input('serie_motivo', mssql.VarChar(250), detalle.Codigo_Motivo_Serie)
            .input('numero_documento', mssql.VarChar(250), detalle.Numero)
            .input('modulo', mssql.VarChar(250), "Cotizacion")
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
                "update hcotizac \n"+
                "set \n"+
                "atencion='Atendido'\n"+
                ",porcentaje='100%'\n"+
                "where \n"+
                "ccod_empresa=@codigo_empresa\n"+
                "and punto_venta=@punto_venta\n"+
                "and idmotivo_venta=@serie_motivo\n"+
                "and cnum_doc=@numero_documento"
            );
        }
        res.send({estado: true, codigo: "0", mensaje: "Saldos Eliminados"});
    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
});

router.post('/comentarios', async (req, res) => {
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
        .input('codigo_punto_venta', mssql.VarChar(5), codigo_punto_venta)
        .input('motivo_documento', mssql.VarChar(250), motivo_documento)
        .input('numero_documento', mssql.VarChar(250), numero_documento)
        .query(
        "select  \n"+
        "observacion as comentario1,  \n"+
        "observacion2 as comentario2,  \n"+
        "observacion3 as comentario3,  \n"+
        "observacion4 as comentario4,  \n"+
        "observacion5 as comentario5,  \n"+
        "observacion6 as comentario6,  \n"+
        "observacion7 as comentario7,  \n"+
        "observacion8 as comentario8,  \n"+
        "comentario1 as comentario1_1,  \n"+
        "comentario2 as comentario2_1,  \n"+
        "comentario3 as comentario3_1,  \n"+
        "comentario4 as comentario4_1,  \n"+
        "comentario5 as comentario5_1,  \n"+
        "comentario6 as comentario6_1,  \n"+
        "comentario7 as comentario7_1,  \n"+
        "comentario8 as comentario8_1 \n"+
        "from hcotizac \n"+
        "where \n"+
        "Hcotizac.ccod_empresa = @codigo_empresa\n"+
        "and Hcotizac.punto_venta = @codigo_punto_venta\n"+
        "and Hcotizac.idmotivo_venta = @motivo_documento\n"+
        "and Hcotizac.cnum_doc = @numero_documento"
        );

        const Cabecera = lista.recordset;
        res.json(Cabecera);
    } catch (err) {
        res.send(err.message);
    }
});


module.exports = router;