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
    "Hpedidod.nitem as NItem, \n"+
    "Hpedidod.NCANTIDAD3 as Cantidad, \n"+
    "Hpedidod.CCOD_ARTICULO AS Codigo, \n"+
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
    "Hpedidod.CNOM_ARTICULO AS Nombre, \n"+
    "RTRIM(Hpedidod.CUNIDAD) AS Codigo_Unidad, \n"+
    "RTRIM(Hpedidod.CUNIDAD) AS Unidad,\n"+
    "Hpedidod.erp_comision_porc as Comision_porcentaje, \n"+
    "Hpedidod.factor as Factor, \n"+
    "Hpedidod.NPRECIO as Unit, \n"+
    "Hpedidod.BASE_IMP as Base_Imponible, \n"+
    "Hpedidod.porc_descuento as Desc1, \n"+
    "Hpedidod.DESC2 as Desc2, \n"+
    "Hpedidod.Desc3 As Desc3, \n"+
    "Hpedidod.erp_desc4 as Desc4, \n"+
    "Hpedidod.BASE_CALCULADA as Base_Calculada, \n"+
    "Hpedidod.NIGV as Igv, \n"+
    "Hpedidod.NIMPORTE as Importe, \n"+
    "Harticul.csistock as Stock_SN, \n"+
    "Hpedidod.erp_peso as Peso, \n"+
    "Halmacen_2.ccod_almacen as Codigo_Almacen,\n"+
    "Halmacen_2.cnom_almacen as Almacen,\n"+
    "Hpedidod.cantidad_presentacion as Cantidad_presentacion, \n"+
    "Hpedidod.codigo_presentacion as Codigo_presentacion, \n"+
    "RTRIM(Hpedidod.unidad_presentacion) AS Unidad_presentacion, \n"+
    "Hpedidod.nombre_presentacion AS Nombre_presentacion, \n"+
    "Hpedidod.precio_presentacion as Precio_presentacion, \n"+
    "'' as Observacion, \n"+
    "Hpedidod.OT as OT, \n"+
    "Hpedidod.NCANTIDAD as Cantidad_Kardex, \n"+
    "Hpedidod.barticulo as Barticulo, \n"+
    "Hpedidod.igv_art as Igv_Art, \n"+
    "Hpedidod.monto_descuento as Monto_Descuento, \n"+
    "Hpedidod.precio_original as Precio_original, \n"+
    "Hpedidod.erp_codune as Codigo_Unidad_Negocio,\n"+
    "Hpedidod.erp_codune as Unidad_negocio, \n"+
    "Hpedidod.CCENCOS AS Codigo_Cencos,\n"+
    "Hpedidod.CCENCOS AS Cencos, \n"+
    "Hpedidod.erp_presupuesto as Codigo_Partida_presupuestal, \n"+
    "Hpedidod.erp_presupuesto as Partida_presupuestal, \n"+
    "Hpedidod.erp_codage as Codigo_Agencia, \n"+
    "Hpedidod.erp_codage as Agencia, \n"+
    "Hpedidod.erp_percepcion_sn as Percepcion_sn, \n"+
    "Hpedidod.erp_percepcion_uni as Percepcion_uni, \n"+
    "Hpedidod.erp_percepcion_porc as Perpecion_porc, \n"+
    "Hpedidod.erp_boni_sn as Boni_sn, \n"+
    "Hpedidod.erp_item_boni as Item_boni, \n"+
    "Hpedidod.erp_comision_monto as Comision_monto, \n"+
    "Hpedidod.erp_base_calc_dec as Base_calculada_dec, \n"+
    "Hpedidod.erp_base_imp_dec as Base_imp_dec, \n"+
    "Hpedidod.erp_igv_dec as Igv_dec, \n"+
    "Hpedidod.erp_importe_dec as Importe_dec, \n"+
    "Hpedidod.blote as Lote_SN, \n"+
    "Hpedidod.cnro_lote as Lote_Numero, \n"+
    "CONVERT(VARCHAR(50),Hpedidod.vcto, 103)  as Lote_Vencimiento, \n"+
    "Hpedidod.bserie as Serie_SN, \n"+
    "Hpedidod.cnro_serie as Serie_Numero, \n"+
    "Hpedidod.ptovta_cotizacion as Cotizacion_Punto_Venta, \n"+
    "Hpedidod.idmotivo_cotizacion as Cotizacion_Motivo, \n"+
    "Hpedidod.numero_cotizacion as Cotizacion_Numero, \n"+
    "Hpedidod.nitem_ref as Cotizacion_NItem \n"+
    "FROM Hpedidod inner Join Harticul On \n"+
    "Hpedidod.ccod_empresa = Harticul.ccod_empresa and \n"+
    "Hpedidod.ccod_articulo = Harticul.ccod_articulo \n"+
    "inner join erp_concepto1 on \n"+
    "erp_concepto1.erp_codemp = Harticul.ccod_empresa and \n"+
    "erp_concepto1.erp_codcon = Harticul.codmarca \n"+
    "inner join Halmacen_2 on\n"+
    "Halmacen_2.ccod_empresa = Hpedidod.ccod_empresa and\n"+
    "Halmacen_2.ccod_almacen = Hpedidod.ccod_almacen_org\n"+
    "WHERE \n"+
    "Hpedidod.ccod_empresa = @codigo_empresa and \n"+
    "Hpedidod.idmotivo_venta = @motivo_documento and \n"+
    "Hpedidod.cnum_doc = @numero_documento and \n"+
    "Hpedidod.ccod_almacen= @codigo_punto_venta \n"+
    "ORDER BY NITEM ");
   
    const recordset = lista.recordset;
    res.json(recordset);
});

router.post('/guardar', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.user.codigo_punto_venta;
        const usuario = req.user.codigo_usuario;

        var cabecera_saved=true;
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
                        "and ctip_doc = 'PED' \n"+
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
                .input("ccod_almacen", mssql.VarChar(250), codigo_punto_venta)
                .input("idmotivo_venta", mssql.VarChar(250), req.body.motivo)
                .input("cnum_doc", mssql.VarChar(250), numero_correlativo)
                .input("automatico", mssql.VarChar(250), req.body.automatico)
                .input("dfecha_doc", mssql.Date, req.body.fecha_doc)
                .input("dfecha_entr", mssql.Date, req.body.fecha_entr)
                .input("dfecha_val", mssql.Date, req.body.fecha_validez)
                .input("cmoneda", mssql.VarChar(250), req.body.moneda)
                .input("nimporte", mssql.VarChar(250), req.body.importe)
                .input("ccod_forpago", mssql.VarChar(250), req.body.forma_pago)
                .input("ccod_cliente", mssql.VarChar(250), req.body.codigo_cliente)
                .input("cnom_cliente", mssql.VarChar(250), req.body.nombre_cliente)
                .input("cnum_ruc_cliente", mssql.VarChar(250), req.body.ruc_cliente)
                .input("estado", mssql.VarChar(250), req.body.estado)
                .input("observacion", mssql.VarChar(250), req.body.observacion)
                .input("si_igv", mssql.VarChar(250), req.body.mas_igv)
                .input("ctipo_cambio", mssql.VarChar(250), req.body.tipo_cambio)
                .input("tipo_cambio", mssql.VarChar(250), req.body.tasa_cambio)
                .input("ccod_person", mssql.VarChar(250), req.body.vendedor_1)
                .input("lista_precios", mssql.VarChar(250), req.body.lista_precios)
                //.input("telefono", mssql.VarChar(250), req.body.telefono_cliente)
                //.input("fax", mssql.VarChar(250), req.body.fax)
                //.input("email", mssql.VarChar(250), req.body.email)
                .input("aprobado", mssql.VarChar(250), req.body.aprobado)
                .input("fecha_aprobacion", mssql.Date, req.body.fecha_aprobacion)
                .input("responsable_aprobacion", mssql.VarChar(250), req.body.codigo_empleado_aprobacion)
                .input("observacion_aprobacion", mssql.VarChar(250), req.body.observacion_aprobacion)
                .input("ccod_cencos", mssql.VarChar(250), req.body.codigo_centro_costos)
                .input("dscto", mssql.VarChar(250), req.body.descuento)
                .input("OT", mssql.VarChar(250), req.body.orden_trabajo)
                .input("titulo02", mssql.VarChar(250), req.body.observacion2)
                .input("titulo03", mssql.VarChar(250), req.body.observacion3)
                .input("titulo04", mssql.VarChar(250), req.body.observacion4)
                .input("titulo05", mssql.VarChar(250), req.body.observacion5)
                .input("titulo06", mssql.VarChar(250), req.body.observacion6)
                .input("titulo07", mssql.VarChar(250), req.body.observacion7)
                .input("titulo08", mssql.VarChar(250), req.body.observacion8)
                .input("comentario2", mssql.VarChar(250), req.body.comentario2)
                .input("comentario3", mssql.VarChar(250), req.body.comentario3)
                .input("comentario4", mssql.VarChar(250), req.body.comentario4)
                .input("comentario5", mssql.VarChar(250), req.body.comentario5)
                .input("comentario6", mssql.VarChar(250), req.body.comentario6)
                .input("comentario7", mssql.VarChar(250), req.body.comentario7)
                .input("punto_partida", mssql.VarChar(250), req.body.pto_partida)
                .input("lugar_entrega", mssql.VarChar(250), req.body.pto_llegada)
                .input("erp_dias", mssql.VarChar(250), req.body.dias)
                .input("pais", mssql.VarChar(250), req.body.pais)
                .input("ATENCION", mssql.VarChar(250), req.body.atencion)
                .input("porcentaje", mssql.VarChar(250), req.body.porcentaje)
                .input("erp_codune", mssql.VarChar(250), req.body.codigo_unidad_negocio)
                .input("ccod_contacto", mssql.VarChar(250), req.body.codigo_contacto)
                .input("nom_contacto", mssql.VarChar(250), req.body.nom_contacto)
                .input("idvendedor2", mssql.VarChar(250), req.body.vendedor_2)
                .input("erp_glosa", mssql.VarChar(250), req.body.Glosa)
                .input("erp_codage", mssql.VarChar(250), req.body.codigo_agencia)
                .input("usuario", mssql.VarChar(250), usuario)
                .input("Pc_User", mssql.VarChar(250), req.body.Pc_User)
                .input("Pc_Fecha", mssql.Date, req.body.Pc_Fecha)
                .input("Pc_Ip", mssql.VarChar(250), req.body.Pc_Ip)
                .input("titulo01", mssql.VarChar(250), req.body.comentario1)
                .input("comentario8", mssql.VarChar(250), req.body.comentario8)
                .input("erp_presupuesto", mssql.VarChar(250), req.body.erp_presupuesto)
                .input("subtotal_sin_descuentos", mssql.VarChar(250), req.body.subtotal_sin_descuentos)
                .input("erp_ddescuento", mssql.VarChar(250), req.body.erp_Ddescuento)
                .input("erp_dsubtotal", mssql.VarChar(250), req.body.erp_Dsubtotal)
                .input("erp_digv", mssql.VarChar(250), req.body.erp_Digv)
                .input("erp_dimporte", mssql.VarChar(250), req.body.erp_Dimporte)
                .input("erp_dpercepcion", mssql.VarChar(250), req.body.erp_Dpercepcion)
                .input("erp_dtotal", mssql.VarChar(250), req.body.erp_Dtotal)
                .input("erp_gestor", mssql.VarChar(250), req.body.erp_gestor)
                .input("tipo_pedido", mssql.VarChar(250), req.body.tipo)
                ///.input("motivo_ref", mssql.VarChar(250), req.body.motivo_ref)
                .input("cnum_docref", mssql.VarChar(250), req.body.numero_referencia)
                .input("ccod_transportista", mssql.VarChar(250), req.body.codigo_transportista)
                .input("nombre_transp", mssql.VarChar(250), req.body.nombre_transportista)
                .input("ccod_vehiculo", mssql.VarChar(250), req.body.codigo_vehiculo)
                .input("motivo_traslado", mssql.VarChar(250), req.body.motivo_traslado)
                .input("n_orden", mssql.VarChar(250), req.body.numero_orden)
                .input("atencion_prod", mssql.VarChar(250), req.body.atencion_prod)
                .input("porcentaje_prod", mssql.VarChar(250), req.body.porcentaje_prod)
                .input("erp_tipdoc", mssql.VarChar(250), req.body.erp_tipdoc)
                .input("flag_ruta_contacto", mssql.VarChar(250), req.body.flag_ruta_contacto)
                .input("ruta_contacto", mssql.VarChar(250), req.body.ruta_contacto)
                .input("erp_dscto_stock", mssql.VarChar(250), req.body.erp_dscto_stock)
                .input("erp_contacto_vendedor", mssql.VarChar(250), req.body.erp_contacto_vendedor)
                .input("numero_expediente1", mssql.VarChar(250), req.body.numero_expediente1)
                .input("numero_expediente2", mssql.VarChar(250), req.body.numero_expediente2)
                .query("INSERT INTO Hpedidoc ( "+
                "ccod_empresa , \n"+
                "ccod_almacen , \n"+  
                "idmotivo_venta , \n"+ 
                "cnum_doc , \n"+ 
                "automatico , \n"+ 
                "dfecha_doc , \n"+ 
                "dfecha_entr , \n"+ 
                "dfecha_val , \n"+
                "cmoneda , \n"+ 
                "nimporte , \n"+ 
                "ccod_forpago , \n"+ 
                "ccod_cliente , \n"+ 
                "cnom_cliente , \n"+ 
                "cnum_ruc_cliente , \n"+ 
                "estado , \n"+
                "observacion , \n"+ 
                "si_igv , \n"+ 
                "ctipo_cambio , \n"+ 
                "tipo_cambio , \n"+ 
                "ccod_person , \n"+ 
                "lista_precios , \n"+
                "aprobado , \n"+
                "fecha_aprobacion , \n"+ 
                "responsable_aprobacion , \n"+
                "observacion_aprobacion , \n"+ 
                "ccod_cencos , \n"+ 
                "dscto , \n"+
                "OT , \n"+ 
                "titulo02 , \n"+ 
                "titulo03 , \n"+ 
                "titulo04 , \n"+ 
                "titulo05 , \n"+ 
                "titulo06 , \n"+ 
                "titulo07 , \n"+ 
                "titulo08 , \n"+ 
                "comentario2 , \n"+ 
                "comentario3 , \n"+ 
                "comentario4 , \n"+ 
                "comentario5 , \n"+ 
                "comentario6 , \n"+ 
                "comentario7 , \n"+ 
                "punto_partida , \n"+
                "lugar_entrega , \n"+
                "erp_dias , \n"+
                "pais , \n"+
                "ATENCION , \n"+ 
                "porcentaje , \n"+ 
                "erp_codune , \n"+ 
                "ccod_contacto , \n"+ 
                "nom_contacto , \n"+ 
                "idvendedor2 , \n"+ 
                "erp_glosa , \n"+
                "erp_codage , \n"+ 
                "usuario , \n"+ 
                "Pc_User , \n"+ 
                "Pc_Fecha , \n"+ 
                "Pc_Ip , \n"+ 
                "titulo01 , \n"+ 
                "comentario8 , \n"+ 
                "erp_presupuesto , \n"+
                "subtotal_sin_descuentos,\n"+
                "erp_ddescuento , \n"+ 
                "erp_dsubtotal , \n"+ 
                "erp_digv , \n"+ 
                "erp_dimporte , \n"+ 
                "erp_dpercepcion , \n"+ 
                "erp_dtotal , \n"+ 
                "erp_gestor , \n"+
                "tipo_pedido , \n"+ 
                "cnum_docref , \n"+ 
                "ccod_transportista , \n"+ 
                "nombre_transp , \n"+ 
                "ccod_vehiculo , \n"+ 
                "motivo_traslado, \n"+ 
                "n_orden , \n"+ 
                "atencion_prod , \n"+ 
                "porcentaje_prod , \n"+ 
                "erp_tipdoc , \n"+ 
                "flag_ruta_contacto , \n"+ 
                "ruta_contacto , \n"+ 
                "erp_dscto_stock , \n"+ 
                "erp_contacto_vendedor,\n"+
                "erp_nro_exp,\n"+
                "erp_nro_exp2" +
                ") VALUES ( "+
                "@ccod_empresa , \n"+
                "@ccod_almacen , \n"+  
                "@idmotivo_venta , \n"+ 
                "@cnum_doc , \n"+ 
                "@automatico , \n"+ 
                "@dfecha_doc , \n"+ 
                "@dfecha_entr , \n"+ 
                "@dfecha_val , \n"+
                "@cmoneda , \n"+ 
                "@nimporte , \n"+ 
                "@ccod_forpago , \n"+ 
                "@ccod_cliente , \n"+ 
                "@cnom_cliente , \n"+ 
                "@cnum_ruc_cliente , \n"+ 
                "@estado , \n"+
                "@observacion , \n"+ 
                "@si_igv , \n"+ 
                "@ctipo_cambio , \n"+ 
                "@tipo_cambio , \n"+ 
                "@ccod_person , \n"+ 
                "@lista_precios , \n"+
                "@aprobado , \n"+
                "@fecha_aprobacion , \n"+ 
                "@responsable_aprobacion , \n"+
                "@observacion_aprobacion , \n"+ 
                "@ccod_cencos , \n"+ 
                "@dscto , \n"+
                "@OT , \n"+ 
                "@titulo02 , \n"+ 
                "@titulo03 , \n"+ 
                "@titulo04 , \n"+ 
                "@titulo05 , \n"+ 
                "@titulo06 , \n"+ 
                "@titulo07 , \n"+ 
                "@titulo08 , \n"+ 
                "@comentario2 , \n"+ 
                "@comentario3 , \n"+ 
                "@comentario4 , \n"+ 
                "@comentario5 , \n"+ 
                "@comentario6 , \n"+ 
                "@comentario7 , \n"+ 
                "@punto_partida , \n"+
                "@lugar_entrega , \n"+
                "@erp_dias , \n"+
                "@pais , \n"+
                "@ATENCION , \n"+ 
                "@porcentaje , \n"+ 
                "@erp_codune , \n"+ 
                "@ccod_contacto , \n"+ 
                "@nom_contacto , \n"+ 
                "@idvendedor2 , \n"+ 
                "@erp_glosa , \n"+
                "@erp_codage , \n"+ 
                "@usuario , \n"+ 
                "@Pc_User , \n"+ 
                "@Pc_Fecha , \n"+ 
                "@Pc_Ip , \n"+ 
                "@titulo01 , \n"+ 
                "@comentario8 , \n"+ 
                "@erp_presupuesto , \n"+
                "@subtotal_sin_descuentos,\n"+
                "@erp_ddescuento , \n"+ 
                "@erp_dsubtotal , \n"+ 
                "@erp_digv , \n"+ 
                "@erp_dimporte , \n"+ 
                "@erp_dpercepcion , \n"+ 
                "@erp_dtotal , \n"+ 
                "@erp_gestor , \n"+
                "@tipo_pedido , \n"+ 
                "@cnum_docref , \n"+ 
                "@ccod_transportista , \n"+ 
                "@nombre_transp , \n"+ 
                "@ccod_vehiculo , \n"+ 
                "@motivo_traslado, \n"+ 
                "@n_orden , \n"+ 
                "@atencion_prod , \n"+ 
                "@porcentaje_prod , \n"+ 
                "@erp_tipdoc , \n"+ 
                "@flag_ruta_contacto , \n"+ 
                "@ruta_contacto , \n"+ 
                "@erp_dscto_stock , \n"+ 
                "@erp_contacto_vendedor,\n"+
                "@numero_expediente1,\n"+
                "@numero_expediente2" +
                ")")
                //#endregion
                
                //#region Registro del detalle
                for (let i= 0; i< filas_detalle.length; i++){
                    rowid = filas_detalle[i];
                    
                    const request_detalle = new mssql.Request(transaction);
                    await request_detalle
                     .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                     .input("ccod_almacen", mssql.VarChar(250), codigo_punto_venta)
                     .input("idmotivo_venta", mssql.VarChar(250), req.body.motivo)
                     .input("cnum_doc", mssql.VarChar(250), numero_correlativo)
                     .input("nitem", mssql.VarChar(250), i+1)
                     .input("ccod_articulo", mssql.VarChar(250), rowid.Codigo)
                     .input("cnom_articulo", mssql.VarChar(250), rowid.Nombre)
                     .input("cunidad", mssql.VarChar(250), rowid.Codigo_Unidad)
                     .input("igv_art", mssql.VarChar(250), rowid.Igv_Art)
                     .input("factor", mssql.VarChar(250), rowid.Factor)
                     .input("ncantidad3", mssql.VarChar(250), rowid.Cantidad)
                     .input("ncantidad", mssql.VarChar(250), rowid.Cantidad_Kardex)
                     .input("nprecio", mssql.VarChar(250), rowid.Unit)
                     .input("nigv", mssql.VarChar(250), rowid.Igv)
                     //.input("desc1", mssql.VarChar(250), rowid.Desc1)
                     .input("desc2", mssql.VarChar(250), rowid.Desc2)
                     .input("barticulo", mssql.VarChar(250), rowid.Barticulo)//
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
                     //.input("erp_observacion", mssql.VarChar(250), rowid.Observacion)
                     .input("desc3", mssql.VarChar(250), rowid.Desc3)
                     .input("erp_percepcion_sn", mssql.VarChar(250), rowid.Percepcion_sn)
                     .input("erp_percepcion_uni", mssql.VarChar(250), rowid.Percepcion_uni)
                     .input("erp_percepcion_porc", mssql.VarChar(250), rowid.Perpecion_porc)
                     .input("erp_boni_sn", mssql.VarChar(250), rowid.Boni_sn)
                     .input("erp_item_boni", mssql.VarChar(250), rowid.BonItem_bonii_sn)
                     .input("erp_presupuesto", mssql.VarChar(250), req.body.erp_presupuesto)
                     .input("erp_desc4", mssql.VarChar(250), rowid.Desc4)
                     .input("erp_peso", mssql.VarChar(250), rowid.Peso)
                     .input("ccod_almacen_org", mssql.VarChar(250), rowid.Codigo_Almacen)
                     .input("erp_base_calc_dec", mssql.VarChar(250), rowid.Base_calculada_dec)
                     .input("erp_base_imp_dec", mssql.VarChar(250), rowid.Base_imp_dec)
                     .input("erp_igv_dec", mssql.VarChar(250), rowid.Igv_dec)
                     .input("erp_importe_dec", mssql.VarChar(250), rowid.Importe_dec)
                     .input("erp_comision_porc", mssql.VarChar(250), rowid.Comision_porcentaje)
                     .input("erp_comision_monto", mssql.VarChar(250), rowid.Comision_monto)
                     .input("codigo_presentacion", mssql.VarChar(250), rowid.Codigo_presentacion)
                     .input("largo", mssql.VarChar(250), '0')
                     .input("ancho", mssql.VarChar(250), '0')
                     .input("erp_lpn", mssql.VarChar(250), '105200000')
                     .input("porc_descuento", mssql.VarChar(250), rowid.Desc1)
                     .input("blote", mssql.VarChar(250), rowid.Lote_SN)
                     .input("cnro_lote", mssql.VarChar(250), rowid.Lote_Numero)
                     .input("vcto", mssql.VarChar(250), rowid.Lote_Vencimiento)
                     .input("bserie", mssql.VarChar(250), rowid.Serie_SN)
                     .input("cnro_serie", mssql.VarChar(250), rowid.Serie_Numero)
                     .input("ptovta_cotizacion", mssql.VarChar(250), rowid.Cotizacion_Punto_Venta)
                     .input("idmotivo_cotizacion", mssql.VarChar(250), rowid.Cotizacion_Motivo)
                     .input("numero_cotizacion", mssql.VarChar(250), rowid.Cotizacion_Numero)
                     .input("nitem_ref", mssql.VarChar(250), rowid.Cotizacion_NItem)
                     .input("bonificacion", mssql.VarChar(250), 'N')
                     .input("cod_referencia", mssql.VarChar(250), '')
                     .query("insert into Hpedidod (" +
                     "ccod_empresa,\n"+
                    "ccod_almacen,\n"+
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
                    "desc3,\n"+ 
                    "erp_percepcion_sn,\n"+ 
                    "erp_percepcion_uni,\n"+ 
                    "erp_percepcion_porc,\n"+ 
                    "erp_boni_sn,\n"+ 
                    "erp_item_boni,\n"+ 
                    "erp_presupuesto,\n"+ 
                    "erp_desc4,\n"+ 
                    "erp_peso,\n"+
                    "ccod_almacen_org,\n"+ 
                    "erp_base_calc_dec,\n"+ 
                    "erp_base_imp_dec,\n"+ 
                    "erp_igv_dec,\n"+ 
                    "erp_importe_dec,\n"+ 
                    "erp_comision_porc,\n"+ 
                    "erp_comision_monto,\n"+ 
                    "codigo_presentacion,\n"+ 
                    "largo,\n"+
                    "ancho,\n"+
                    "erp_lpn,\n"+
                    "porc_descuento,\n"+
                    "blote,\n"+
                    "cnro_lote,\n"+
                    "vcto,\n"+
                    "bserie,\n"+
                    "cnro_serie,\n"+
                    "ptovta_cotizacion,\n"+
                    "idmotivo_cotizacion,\n"+
                    "numero_cotizacion,\n"+
                    "nitem_ref,\n"+
                    "bonificacion,\n"+
                    "cod_referencia" +
                     ") values (" +
                     "@ccod_empresa,\n"+
                    "@ccod_almacen,\n"+
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
                    "@desc3,\n"+ 
                    "@erp_percepcion_sn,\n"+ 
                    "@erp_percepcion_uni,\n"+ 
                    "@erp_percepcion_porc,\n"+ 
                    "@erp_boni_sn,\n"+ 
                    "@erp_item_boni,\n"+ 
                    "@erp_presupuesto,\n"+ 
                    "@erp_desc4,\n"+ 
                    "@erp_peso,\n"+
                    "@ccod_almacen_org,\n"+ 
                    "@erp_base_calc_dec,\n"+ 
                    "@erp_base_imp_dec,\n"+ 
                    "@erp_igv_dec,\n"+ 
                    "@erp_importe_dec,\n"+ 
                    "@erp_comision_porc,\n"+ 
                    "@erp_comision_monto,\n"+ 
                    "@codigo_presentacion,\n"+ 
                    "@largo,\n"+
                    "@ancho,\n"+
                    "@erp_lpn,\n"+
                    "@porc_descuento,\n"+
                    "@blote,\n"+
                    "@cnro_lote,\n"+
                    "@vcto,\n"+
                    "@bserie,\n"+
                    "@cnro_serie,\n"+
                    "@ptovta_cotizacion,\n"+
                    "@idmotivo_cotizacion,\n"+
                    "@numero_cotizacion,\n"+
                    "@nitem_ref,\n"+
                    "@bonificacion,\n"+
                    "@cod_referencia" +
                     ")")
                };
                //#endregion

                //#region Actualización del correlativo automatico
                if(cabecera_saved == true && req.body.automatico=="A"){
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
                .input("ccod_almacen", mssql.VarChar(250), codigo_punto_venta)
                .input("idmotivo_venta", mssql.VarChar(250), req.body.motivo)
                .input("cnum_doc", mssql.VarChar(250), req.body.numero_correlativo)
                .input("automatico", mssql.VarChar(250), req.body.automatico)
                .input("dfecha_doc", mssql.Date, req.body.fecha_doc)
                .input("dfecha_entr", mssql.Date, req.body.fecha_entr)
                .input("dfecha_val", mssql.Date, req.body.fecha_validez)
                .input("cmoneda", mssql.VarChar(250), req.body.moneda)
                .input("nimporte", mssql.VarChar(250), req.body.importe)
                .input("ccod_forpago", mssql.VarChar(250), req.body.forma_pago)
                .input("ccod_cliente", mssql.VarChar(250), req.body.codigo_cliente)
                .input("cnom_cliente", mssql.VarChar(250), req.body.nombre_cliente)
                .input("cnum_ruc_cliente", mssql.VarChar(250), req.body.ruc_cliente)
                .input("estado", mssql.VarChar(250), req.body.estado)
                .input("observacion", mssql.VarChar(250), req.body.observacion)
                .input("si_igv", mssql.VarChar(250), req.body.mas_igv)
                .input("ctipo_cambio", mssql.VarChar(250), req.body.tipo_cambio)
                .input("tipo_cambio", mssql.VarChar(250), req.body.tasa_cambio)
                .input("ccod_person", mssql.VarChar(250), req.body.vendedor_1)
                .input("lista_precios", mssql.VarChar(250), req.body.lista_precios)
                //.input("telefono", mssql.VarChar(250), req.body.telefono_cliente)
                //.input("fax", mssql.VarChar(250), req.body.fax)
                //.input("email", mssql.VarChar(250), req.body.email)
                .input("aprobado", mssql.VarChar(250), req.body.aprobado)
                .input("fecha_aprobacion", mssql.Date, req.body.fecha_aprobacion)
                .input("responsable_aprobacion", mssql.VarChar(250), req.body.codigo_empleado_aprobacion)
                .input("observacion_aprobacion", mssql.VarChar(250), req.body.observacion_aprobacion)
                .input("ccod_cencos", mssql.VarChar(250), req.body.codigo_centro_costos)
                .input("dscto", mssql.VarChar(250), req.body.descuento)
                .input("OT", mssql.VarChar(250), req.body.orden_trabajo)
                .input("titulo02", mssql.VarChar(250), req.body.observacion2)
                .input("titulo03", mssql.VarChar(250), req.body.observacion3)
                .input("titulo04", mssql.VarChar(250), req.body.observacion4)
                .input("titulo05", mssql.VarChar(250), req.body.observacion5)
                .input("titulo06", mssql.VarChar(250), req.body.observacion6)
                .input("titulo07", mssql.VarChar(250), req.body.observacion7)
                .input("titulo08", mssql.VarChar(250), req.body.observacion8)
                .input("comentario2", mssql.VarChar(250), req.body.comentario2)
                .input("comentario3", mssql.VarChar(250), req.body.comentario3)
                .input("comentario4", mssql.VarChar(250), req.body.comentario4)
                .input("comentario5", mssql.VarChar(250), req.body.comentario5)
                .input("comentario6", mssql.VarChar(250), req.body.comentario6)
                .input("comentario7", mssql.VarChar(250), req.body.comentario7)
                .input("punto_partida", mssql.VarChar(250), req.body.pto_partida)
                .input("lugar_entrega", mssql.VarChar(250), req.body.pto_llegada)
                .input("erp_dias", mssql.VarChar(250), req.body.dias)
                .input("pais", mssql.VarChar(250), req.body.pais)
                .input("ATENCION", mssql.VarChar(250), req.body.atencion)
                .input("porcentaje", mssql.VarChar(250), req.body.porcentaje)
                .input("erp_codune", mssql.VarChar(250), req.body.codigo_unidad_negocio)
                .input("ccod_contacto", mssql.VarChar(250), req.body.codigo_contacto)
                .input("nom_contacto", mssql.VarChar(250), req.body.nom_contacto)
                .input("idvendedor2", mssql.VarChar(250), req.body.vendedor_2)
                .input("erp_glosa", mssql.VarChar(250), req.body.Glosa)
                .input("erp_codage", mssql.VarChar(250), req.body.codigo_agencia)
                .input("usuario", mssql.VarChar(250), usuario)
                .input("Pc_User", mssql.VarChar(250), req.body.Pc_User)
                .input("Pc_Fecha", mssql.Date, req.body.Pc_Fecha)
                .input("Pc_Ip", mssql.VarChar(250), req.body.Pc_Ip)
                .input("titulo01", mssql.VarChar(250), req.body.comentario1)
                .input("comentario8", mssql.VarChar(250), req.body.comentario8)
                .input("erp_presupuesto", mssql.VarChar(250), req.body.erp_presupuesto)
                .input("subtotal_sin_descuentos", mssql.VarChar(250), req.body.subtotal_sin_descuentos)
                .input("erp_ddescuento", mssql.VarChar(250), req.body.erp_Ddescuento)
                .input("erp_dsubtotal", mssql.VarChar(250), req.body.erp_Dsubtotal)
                .input("erp_digv", mssql.VarChar(250), req.body.erp_Digv)
                .input("erp_dimporte", mssql.VarChar(250), req.body.erp_Dimporte)
                .input("erp_dpercepcion", mssql.VarChar(250), req.body.erp_Dpercepcion)
                .input("erp_dtotal", mssql.VarChar(250), req.body.erp_Dtotal)
                .input("erp_gestor", mssql.VarChar(250), req.body.erp_gestor)
                .input("tipo_pedido", mssql.VarChar(250), req.body.tipo)
                ///.input("motivo_ref", mssql.VarChar(250), req.body.motivo_ref)
                .input("cnum_docref", mssql.VarChar(250), req.body.numero_referencia)
                .input("ccod_transportista", mssql.VarChar(250), req.body.codigo_transportista)
                .input("nombre_transp", mssql.VarChar(250), req.body.nombre_transportista)
                .input("ccod_vehiculo", mssql.VarChar(250), req.body.codigo_vehiculo)
                .input("motivo_traslado", mssql.VarChar(250), req.body.motivo_traslado)
                .input("n_orden", mssql.VarChar(250), req.body.numero_orden)
                .input("atencion_prod", mssql.VarChar(250), req.body.atencion_prod)
                .input("porcentaje_prod", mssql.VarChar(250), req.body.porcentaje_prod)
                .input("erp_tipdoc", mssql.VarChar(250), req.body.erp_tipdoc)
                .input("flag_ruta_contacto", mssql.VarChar(250), req.body.flag_ruta_contacto)
                .input("ruta_contacto", mssql.VarChar(250), req.body.ruta_contacto)
                .input("erp_dscto_stock", mssql.VarChar(250), req.body.erp_dscto_stock)
                .input("erp_contacto_vendedor", mssql.VarChar(250), req.body.erp_contacto_vendedor)
                .input("numero_expediente1", mssql.VarChar(250), req.body.numero_expediente1)
                .input("numero_expediente2", mssql.VarChar(250), req.body.numero_expediente2)
                .query("UPDATE Hpedidoc \n"+
                "SET \n"+
                "dfecha_doc = @dfecha_doc,  \n"+  
                "dfecha_entr = @dfecha_entr,  \n"+  
                "dfecha_val = @dfecha_val,  \n"+ 
                "cmoneda = @cmoneda,  \n"+  
                "nimporte = @nimporte,  \n"+  
                "ccod_forpago = @ccod_forpago,  \n"+  
                "ccod_cliente = @ccod_cliente,  \n"+  
                "cnom_cliente = @cnom_cliente,  \n"+  
                "cnum_ruc_cliente = @cnum_ruc_cliente,  \n"+  
                "estado = @estado,  \n"+ 
                "observacion = @observacion,  \n"+  
                "si_igv = @si_igv,  \n"+  
                "ctipo_cambio = @ctipo_cambio,  \n"+  
                "tipo_cambio = @tipo_cambio,  \n"+  
                "ccod_person = @ccod_person,  \n"+  
                "lista_precios = @lista_precios,  \n"+ 
                "aprobado = @aprobado,  \n"+ 
                "fecha_aprobacion = @fecha_aprobacion,  \n"+  
                "responsable_aprobacion = @responsable_aprobacion,  \n"+ 
                "observacion_aprobacion = @observacion_aprobacion,  \n"+  
                "ccod_cencos = @ccod_cencos,  \n"+  
                "dscto = @dscto,  \n"+ 
                "OT = @OT,  \n"+  
                "titulo02 = @titulo02,  \n"+  
                "titulo03 = @titulo03,  \n"+  
                "titulo04 = @titulo04,  \n"+  
                "titulo05 = @titulo05,  \n"+  
                "titulo06 = @titulo06,  \n"+  
                "titulo07 = @titulo07,  \n"+  
                "titulo08 = @titulo08,  \n"+  
                "comentario2 = @comentario2,  \n"+  
                "comentario3 = @comentario3,  \n"+  
                "comentario4 = @comentario4,  \n"+  
                "comentario5 = @comentario5,  \n"+  
                "comentario6 = @comentario6,  \n"+  
                "comentario7 = @comentario7,  \n"+  
                "punto_partida = @punto_partida,  \n"+ 
                "lugar_entrega = @lugar_entrega,  \n"+ 
                "erp_dias = @erp_dias,  \n"+ 
                "pais = @pais,  \n"+ 
                "ATENCION = @ATENCION,  \n"+  
                "porcentaje = @porcentaje,  \n"+  
                "erp_codune = @erp_codune,  \n"+  
                "ccod_contacto = @ccod_contacto,  \n"+  
                "nom_contacto = @nom_contacto,  \n"+  
                "idvendedor2 = @idvendedor2,  \n"+  
                "erp_glosa = @erp_glosa,  \n"+ 
                "erp_codage = @erp_codage,  \n"+  
                "usuario = @usuario,  \n"+  
                "Pc_User = @Pc_User,  \n"+  
                "Pc_Fecha = @Pc_Fecha,  \n"+  
                "Pc_Ip = @Pc_Ip,  \n"+  
                "titulo01 = @titulo01,  \n"+  
                "comentario8 = @comentario8,  \n"+  
                "erp_presupuesto = @erp_presupuesto,  \n"+ 
                "subtotal_sin_descuentos  =@subtotal_sin_descuentos,  \n"+   
                "erp_ddescuento = @erp_ddescuento,  \n"+  
                "erp_dsubtotal = @erp_dsubtotal,  \n"+  
                "erp_digv = @erp_digv,  \n"+  
                "erp_dimporte = @erp_dimporte,  \n"+  
                "erp_dpercepcion = @erp_dpercepcion,  \n"+  
                "erp_dtotal = @erp_dtotal,  \n"+  
                "erp_gestor = @erp_gestor,  \n"+ 
                "tipo_pedido = @tipo_pedido,  \n"+  
                "cnum_docref = @cnum_docref,  \n"+  
                "ccod_transportista = @ccod_transportista,  \n"+  
                "nombre_transp = @nombre_transp,  \n"+  
                "ccod_vehiculo = @ccod_vehiculo,  \n"+  
                "motivo_traslado= @motivo_traslado,  \n"+  
                "n_orden = @n_orden,  \n"+  
                "atencion_prod = @atencion_prod,  \n"+  
                "porcentaje_prod = @porcentaje_prod,  \n"+  
                "erp_tipdoc = @erp_tipdoc,  \n"+  
                "flag_ruta_contacto = @flag_ruta_contacto,  \n"+  
                "ruta_contacto = @ruta_contacto,  \n"+  
                "erp_dscto_stock = @erp_dscto_stock,  \n"+  
                "erp_contacto_vendedor =@erp_contacto_vendedor,  \n"+    
                "erp_nro_exp    =@numero_expediente1,  \n"+    
                "erp_nro_exp2   =@numero_expediente2 \n"+  
                "WHERE \n"+
                "ccod_empresa = @ccod_empresa and  \n"+ 
                "ccod_almacen = @ccod_almacen and  \n"+   
                "idmotivo_venta = @idmotivo_venta and  \n"+  
                "cnum_doc      =@cnum_doc and \n"+ 
                "estado = 'Ingresado' ")
                //#endregion

                if(result_cabecera.rowsAffected>0 || result_cabecera.rowsAffected[1]>0){
                    //#region Borrar detalle
                    const request_detalle_borrar  = new mssql.Request(transaction);
                    await request_detalle_borrar
                    .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                    .input("punto_venta", mssql.VarChar(250), codigo_punto_venta)
                    .input("idmotivo_venta", mssql.VarChar(250), req.body.motivo)
                    .input("cnum_doc", mssql.VarChar(250), req.body.numero_correlativo)
                    .query("DELETE FROM Hpedidod WHERE ccod_empresa = @ccod_empresa and ccod_almacen =@punto_venta and idmotivo_venta = @idmotivo_venta and cnum_doc = @cnum_doc")
                    //#endregion

                    //#region Grabar detalle
                    for (let i= 0; i< filas_detalle.length; i++){
                        rowid = filas_detalle[i];
                        const request_detalle_registrar  = new mssql.Request(transaction);
                        await request_detalle_registrar
                        .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                        .input("ccod_almacen", mssql.VarChar(250), codigo_punto_venta)
                        .input("idmotivo_venta", mssql.VarChar(250), req.body.motivo)
                        .input("cnum_doc", mssql.VarChar(250), req.body.numero_correlativo)
                        .input("nitem", mssql.VarChar(250), i+1)
                        .input("ccod_articulo", mssql.VarChar(250), rowid.Codigo)
                        .input("cnom_articulo", mssql.VarChar(250), rowid.Nombre)
                        .input("cunidad", mssql.VarChar(250), rowid.Codigo_Unidad)
                        .input("igv_art", mssql.VarChar(250), rowid.Igv_Art)
                        .input("factor", mssql.VarChar(250), rowid.Factor)
                        .input("ncantidad3", mssql.VarChar(250), rowid.Cantidad)
                        .input("ncantidad", mssql.VarChar(250), rowid.Cantidad_Kardex)
                        .input("nprecio", mssql.VarChar(250), rowid.Unit)
                        .input("nigv", mssql.VarChar(250), rowid.Igv)
                        //.input("desc1", mssql.VarChar(250), rowid.Desc1)
                        .input("desc2", mssql.VarChar(250), rowid.Desc2)
                        .input("barticulo", mssql.VarChar(250), rowid.Barticulo)//
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
                        //.input("erp_observacion", mssql.VarChar(250), rowid.Observacion)
                        .input("desc3", mssql.VarChar(250), rowid.Desc3)
                        .input("erp_percepcion_sn", mssql.VarChar(250), rowid.Percepcion_sn)
                        .input("erp_percepcion_uni", mssql.VarChar(250), rowid.Percepcion_uni)
                        .input("erp_percepcion_porc", mssql.VarChar(250), rowid.Perpecion_porc)
                        .input("erp_boni_sn", mssql.VarChar(250), rowid.Boni_sn)
                        .input("erp_item_boni", mssql.VarChar(250), rowid.BonItem_bonii_sn)
                        .input("erp_presupuesto", mssql.VarChar(250), req.body.erp_presupuesto)
                        .input("erp_desc4", mssql.VarChar(250), rowid.Desc4)
                        .input("erp_peso", mssql.VarChar(250), rowid.Peso)
                        .input("ccod_almacen_org", mssql.VarChar(250), rowid.Codigo_Almacen)
                        .input("erp_base_calc_dec", mssql.VarChar(250), rowid.Base_calculada_dec)
                        .input("erp_base_imp_dec", mssql.VarChar(250), rowid.Base_imp_dec)
                        .input("erp_igv_dec", mssql.VarChar(250), rowid.Igv_dec)
                        .input("erp_importe_dec", mssql.VarChar(250), rowid.Importe_dec)
                        .input("erp_comision_porc", mssql.VarChar(250), rowid.Comision_porcentaje)
                        .input("erp_comision_monto", mssql.VarChar(250), rowid.Comision_monto)
                        .input("codigo_presentacion", mssql.VarChar(250), rowid.Codigo_presentacion)
                        .input("largo", mssql.VarChar(250), '0')
                        .input("ancho", mssql.VarChar(250), '0')
                        .input("erp_lpn", mssql.VarChar(250), '105200000')
                        .input("porc_descuento", mssql.VarChar(250), '0')
                        .input("blote", mssql.VarChar(250), rowid.Lote_SN)
                        .input("cnro_lote", mssql.VarChar(250), rowid.Lote_Numero)
                        .input("vcto", mssql.VarChar(250), rowid.Lote_Vencimiento)
                        .input("bserie", mssql.VarChar(250), rowid.Serie_SN)
                        .input("cnro_serie", mssql.VarChar(250), rowid.Serie_Numero)
                        .input("ptovta_cotizacion", mssql.VarChar(250), rowid.Cotizacion_Punto_Venta)
                        .input("idmotivo_cotizacion", mssql.VarChar(250), rowid.Cotizacion_Motivo)
                        .input("numero_cotizacion", mssql.VarChar(250), rowid.Cotizacion_Numero)
                        .input("nitem_ref", mssql.VarChar(250), rowid.Cotizacion_NItem)
                        .input("bonificacion", mssql.VarChar(250), 'N')
                        .input("cod_referencia", mssql.VarChar(250), '')
                        .query("insert into Hpedidod (" +
                        "ccod_empresa,\n"+
                        "ccod_almacen,\n"+
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
                        "desc3,\n"+ 
                        "erp_percepcion_sn,\n"+ 
                        "erp_percepcion_uni,\n"+ 
                        "erp_percepcion_porc,\n"+ 
                        "erp_boni_sn,\n"+ 
                        "erp_item_boni,\n"+ 
                        "erp_presupuesto,\n"+ 
                        "erp_desc4,\n"+ 
                        "erp_peso,\n"+
                        "ccod_almacen_org,\n"+ 
                        "erp_base_calc_dec,\n"+ 
                        "erp_base_imp_dec,\n"+ 
                        "erp_igv_dec,\n"+ 
                        "erp_importe_dec,\n"+ 
                        "erp_comision_porc,\n"+ 
                        "erp_comision_monto,\n"+ 
                        "codigo_presentacion,\n"+ 
                        "largo,\n"+
                        "ancho,\n"+
                        "erp_lpn,\n"+
                        "porc_descuento,\n"+
                        "blote,\n"+
                        "cnro_lote,\n"+
                        "vcto,\n"+
                        "bserie,\n"+
                        "cnro_serie,\n"+
                        "ptovta_cotizacion,\n"+
                        "idmotivo_cotizacion,\n"+
                        "numero_cotizacion,\n"+
                        "nitem_ref,\n"+
                        "bonificacion,\n"+
                        "cod_referencia" +
                        ") values (" +
                        "@ccod_empresa,\n"+
                        "@ccod_almacen,\n"+
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
                        "@desc3,\n"+ 
                        "@erp_percepcion_sn,\n"+ 
                        "@erp_percepcion_uni,\n"+ 
                        "@erp_percepcion_porc,\n"+ 
                        "@erp_boni_sn,\n"+ 
                        "@erp_item_boni,\n"+ 
                        "@erp_presupuesto,\n"+ 
                        "@erp_desc4,\n"+ 
                        "@erp_peso,\n"+
                        "@ccod_almacen_org,\n"+ 
                        "@erp_base_calc_dec,\n"+ 
                        "@erp_base_imp_dec,\n"+ 
                        "@erp_igv_dec,\n"+ 
                        "@erp_importe_dec,\n"+ 
                        "@erp_comision_porc,\n"+ 
                        "@erp_comision_monto,\n"+ 
                        "@codigo_presentacion,\n"+ 
                        "@largo,\n"+
                        "@ancho,\n"+
                        "@erp_lpn,\n"+
                        "@porc_descuento,\n"+
                        "@blote,\n"+
                        "@cnro_lote,\n"+
                        "@vcto,\n"+
                        "@bserie,\n"+
                        "@cnro_serie,\n"+
                        "@ptovta_cotizacion,\n"+
                        "@idmotivo_cotizacion,\n"+
                        "@numero_cotizacion,\n"+
                        "@nitem_ref,\n"+
                        "@bonificacion,\n"+
                        "@cod_referencia" +
                        ")")
                    };                    
                    //#endregion
                    
                    transaction.commit(tErr => {if(tErr) {console.log(tErr)}})
                    res.send({estado: true, codigo: 0, mensaje: ""});
                }else{
                    console.log('gjasdasd');
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
        var detalle_delete=true;
        
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
                .query("DELETE FROM Hpedidod WHERE ccod_empresa =@ccod_empresa and ccod_almacen = @erp_ptovta and idmotivo_venta =@idmotivo_venta and cnum_doc = @cnum_doc")

                const request_cabecera = new mssql.Request(transaction);
                await request_cabecera 
                .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                .input("erp_ptovta", mssql.VarChar(250), codigo_punto_venta)
                .input("idmotivo_venta", mssql.VarChar(250), req.body.motivo)
                .input("cnum_doc", mssql.VarChar(250), req.body.numero_correlativo)
                .query("Delete Hpedidoc where ccod_empresa =@ccod_empresa and ccod_almacen  =@erp_ptovta and idmotivo_venta =@idmotivo_venta and cnum_doc  =@cnum_doc")
                if(req.body.automatico == "A") {
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
});

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
        .query("Update Hpedidoc set estado = 'Anulado' where ccod_empresa =@ccod_empresa and ccod_almacen  =@erp_ptovta and idmotivo_venta =@idmotivo_venta and cnum_doc  =@cnum_doc")

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
                var opcion = "and MONTH(Hpedidoc.dfecha_doc) = @mes AND YEAR(Hpedidoc.dfecha_doc) = @anio \n"
                break;
            case "rango_fechas":
                var opcion = "and Hpedidoc.dfecha_doc between @fecha_inicio and @fecha_final \n"
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
        "Hpedidoc.tipo_pedido as Tipo_Venta,  "+   
        "'PEDIDO' as Tipo_Documento,  "+   
        "erp_motivos_tramite.erp_nommot as Motivo_Serie,  "+ 
        "Hpedidoc.cnum_doc as Numero,    "+ 
        "CONVERT(VARCHAR(50),Hpedidoc.dfecha_doc,3) as Fecha,    "+ 
        "CONVERT(VARCHAR(50),Hpedidoc.dfecha_entr,3) as Fecha_Entrega,    "+ 
        "Hpedidoc.ccod_cliente as Codigo,    "+ 
        "Hpedidoc.cnom_cliente as Nombre,    "+ 
        "Hfor_pag.cnom_forpago as Forma_Pago,  "+ 
        "Hpedidoc.cmoneda as Moneda,    "+ 
        "Hpedidoc.tipo_cambio as tc,    "+ 
        "Hpedidoc.nimporte as Importe,  "+ 
        "Hvended.cnom_vendedor  as vendedor,  "+ 
        "Hpedidoc.estado as Estado,    "+ 
        "Hpedidoc.aprobado as Aprobado,    "+ 
        "case Hpedidoc.aprobado when 'Sin Aprobacion' then '' else (ltrim(rtrim(Hperson.Ape_pat)) +' '+ ltrim(rtrim(ape_mat)) +' '+ ltrim(rtrim(nombres))) end as Persona_Aprob,  "+ 
        "case Hpedidoc.aprobado when 'Sin Aprobacion' then '' else CONVERT(VARCHAR(50),Hpedidoc.fecha_aprobacion,3) end as Fecha_Aprob,    "+ 
        "Hpedidoc.atencion as Atencion,    "+ 
        "Hpedidoc.porcentaje as Porcentaje,  "+ 
        "Hpedidoc.usuario as Usuario,    "+ 
        "Hpedidoc.Pc_User as Nombre_Pc,    "+ 
        "CONVERT(VARCHAR,Hpedidoc.Pc_Fecha,3) as Fecha_Grab,  "+ 
        "CONVERT(VARCHAR,Hpedidoc.Pc_Fecha,24) as Hora_Grab,  "+ 
        "Hpedidoc.Pc_Ip as Ip_Pc,    "+ 
        "Hpedidoc.ccod_almacen as Codigo_Punto_Venta,  "+   
        "Hpedidoc.idmotivo_venta as Codigo_Motivo_Serie,   "+  
        "'COT' as Codigo_Tipo_Documento,    "+ 
        "'' as Estado_Fe,  "+ 
        "'' as Tipo_Referencia_Documento,  "+
        "'' as Motivo_Serie_Referencia_Documento,  "+
        "Hpedidoc.cnum_docref as Numero_Referencia_Documento  "+
        "FROM Hpedidoc INNER JOIN Halmacen ON    "+ 
        "Hpedidoc.ccod_empresa = Halmacen.ccod_empresa and    "+ 
        "Hpedidoc.ccod_almacen = Halmacen.ccod_almacen     "+ 
        "INNER JOIN erp_motivos_tramite ON    "+ 
        "Hpedidoc.ccod_empresa = erp_motivos_tramite.erp_codemp and  "+ 
        "Hpedidoc.idmotivo_venta = erp_motivos_tramite.erp_codmot "+   
        "Inner Join hfor_pag ON    "+ 
        "Hpedidoc.ccod_empresa = Hfor_pag.ccod_empresa and  "+ 
        "Hpedidoc.ccod_forpago = Hfor_pag.ccod_forpago    "+ 
        "Inner Join hperson On    "+ 
        "Hpedidoc.ccod_empresa = Hperson.ccod_empresa and  "+ 
        "Hpedidoc.responsable_aprobacion  = Hperson.ccod_person  "+ 
        "Inner Join Hvended On    "+ 
        "Hpedidoc.ccod_empresa = Hvended.ccod_empresa and  "+ 
        "Hpedidoc.ccod_person = Hvended.ccod_vendedor    "+ 
        "WHERE Hpedidoc.ccod_empresa = @codigo_empresa  AND   "+ 
        "Hpedidoc.ccod_almacen = @codigo_punto_venta "+ opcion+ 
        "order by dfecha_doc desc,idmotivo_venta,cnum_doc desc ");
          
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
        .query("SELECT   "+
        "Halmacen.cnom_almacen as Punto_Venta,  "+     
        "erp_motivos_tramite.erp_nommot as Motivo_Serie,  "+     
        "CONVERT(VARCHAR(50), Hpedidoc.dfecha_doc, 3) as Fecha,  "+     
        "CONVERT(VARCHAR(50), Hpedidoc.dfecha_entr, 3) as Fecha_Entrega,  "+     
        "Hpedidoc.ccod_cliente as Codigo_Cliente,  "+     
        "Hpedidoc.cnom_cliente as Cliente,  "+     
        "Hpedidoc.ccod_cencos as Codigo_Centro_Costo, \n"+
        "Hcencos.cnom_cencos as Centro_Costo, \n"+
        "Hpedidoc.ot as Codigo_Orden_Trabajo, \n"+
        "Horden_trabajo.cnom_ot as Orden_Trabajo, \n"+
        "Hpedidoc.erp_codune as Codigo_Unidad_Negocio, \n"+
        "erp_unidad_negocio.erp_nomune as Unidad_Negocio, \n"+
        "Hfor_pag.cnom_forpago as Forma_Pago,  "+     
        "Hpedidoc.cmoneda as Moneda,  "+     
        "Hpedidoc.tipo_cambio as Tipo_Cambio,  "+     
        "Hpedidoc.nimporte as Importe,  "+     
        "Hvended.cnom_vendedor  as Vendedor,  "+     
        "Hpedidoc.estado as Estado,  "+     
        "Hpedidoc.aprobado as Aprobado,  "+     
        "case Hpedidoc.aprobado when 'Sin Aprobacion' then '' else (ltrim(rtrim(Hperson.Ape_pat)) +' '+ ltrim(rtrim(ape_mat)) +' '+ ltrim(rtrim(nombres))) end as Persona_Aprobado,  "+ 
        "case Hpedidoc.aprobado when 'Sin Aprobacion' then '' else CONVERT(VARCHAR(50),Hpedidoc.fecha_aprobacion,3) end as Fecha_Aprobado,    "+ 
        "Hpedidoc.atencion as Atencion,  "+     
        "Hpedidoc.porcentaje as Porcentaje,  "+     
        "Hpedidoc.usuario as Usuario,  "+     
        "Hpedidoc.Pc_User as Nombre_Pc,  "+     
        "CONVERT(VARCHAR,  Hpedidoc.Pc_Fecha,  3) as Fecha_Grab,  "+     
        "CONVERT(VARCHAR,  Hpedidoc.Pc_Fecha,  24) as Hora_Grab,  "+     
        "Hpedidoc.Pc_Ip as Ip_Pc,  "+     
        "Hpedidoc.idmotivo_venta as Codigo_Motivo_Serie,  "+     
        "Hpedidoc.cnum_doc as Numero,  "+     
        "Hpedidoc.ccod_almacen as Codigo_Punto_Venta  "+     
        "FROM Hpedidoc INNER JOIN Halmacen ON     "+
        "Hpedidoc.ccod_empresa = Halmacen.ccod_empresa and   "+  
        "Hpedidoc.ccod_almacen = Halmacen.ccod_almacen    "+  
        "INNER JOIN erp_motivos_tramite ON     "+
        "Hpedidoc.ccod_empresa = erp_motivos_tramite.erp_codemp and   "+  
        "Hpedidoc.idmotivo_venta = erp_motivos_tramite.erp_codmot  "+   
        "Inner Join hfor_pag ON     "+
        "Hpedidoc.ccod_empresa = Hfor_pag.ccod_empresa and     "+
        "Hpedidoc.ccod_forpago = Hfor_pag.ccod_forpago   "+  
        "Inner Join hperson On     "+
        "Hpedidoc.ccod_empresa = Hperson.ccod_empresa and    "+ 
        "Hpedidoc.responsable_aprobacion  = Hperson.ccod_person  "+   
        "Inner Join Hvended On     "+
        "Hpedidoc.ccod_empresa = Hvended.ccod_empresa and   "+  
        "Hpedidoc.ccod_person = Hvended.ccod_vendedor     "+
        "Inner Join Hcencos On \n"+
        "Hpedidoc.ccod_empresa = Hcencos.ccod_empresa and \n"+
        "Hpedidoc.ccod_cencos  = Hcencos.ccod_cencos \n"+
        "Inner Join Horden_trabajo On \n"+
        "Hpedidoc.ccod_empresa = Horden_trabajo.ccod_empresa and \n"+
        "Hpedidoc.ot  = Horden_trabajo.ccod_ot \n"+
        "Inner Join erp_unidad_negocio On \n"+
        "Hpedidoc.ccod_empresa = erp_unidad_negocio.erp_codemp and \n"+
        "Hpedidoc.erp_codune  = erp_unidad_negocio.erp_codune \n"+
        "WHERE Hpedidoc.ccod_empresa = @codigo_empresa AND \n"+
        "Hpedidoc.ccod_almacen = @codigo_punto_venta AND \n"+
        "Hpedidoc.aprobado = @estado \n"+
        // "order by dfecha_doc desc,  idmotivo_venta, cnum_doc desc "
        "order by dfecha_doc desc, cnum_doc desc "
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
            .query("update Hpedidoc set aprobado = @estado, responsable_aprobacion = @responsable, observacion_aprobacion = @comentario, fecha_aprobacion = @fecha where ccod_empresa=@codigo_empresa and ccod_almacen=@punto_venta and idmotivo_venta=@motivo and cnum_doc=@numero");
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
        "'PEDIDO' as documento_nombre, \n"+
        "Hpedidoc.tipo_pedido as documento_tipo,\n"+
        "Hpedidoc.ccod_almacen as documento_punto_venta_codigo,\n"+
        "Halmacen.cnom_almacen as documento_punto_venta_nombre, \n"+
        "Hpedidoc.idmotivo_venta as documento_motivo_venta_codigo,\n"+
        "Hpedidoc.cnum_doc as documento_numero,\n"+
        "CONVERT(VARCHAR(50),Hpedidoc.dfecha_doc,103) as documento_fecha,\n"+
        "CONVERT(VARCHAR(50),Hpedidoc.dfecha_entr,103) as documento_fecha_entrega,\n"+
        "CONVERT(VARCHAR(50),Hpedidoc.dfecha_val,103) as documento_fecha_validez,\n"+
        "CONVERT(VARCHAR(50),Hpedidoc.dfecha_doc,23) as documento_fecha_format23,\n"+
        "CONVERT(VARCHAR(50),Hpedidoc.dfecha_entr,23) as documento_fecha_entrega_format23,\n"+
        "CONVERT(VARCHAR(50),Hpedidoc.dfecha_val,23) as documento_fecha_validez_format23,\n"+
        "Hpedidoc.cmoneda as documento_moneda,\n"+
        "Hpedidoc.nimporte as documento_nimporte,\n"+
        "RTRIM(LTRIM(Hpedidoc.ccod_forpago)) as documento_forma_pago_codigo,\n"+
        "Hpedidoc.ccod_cliente as Codigo_Cliente,\n"+
        "Hpedidoc.cnom_cliente as cliente_nombre,\n"+
        "Hpedidoc.cnum_ruc_cliente as cliente_ruc,\n"+
        "Hpedidoc.estado as documento_estado,\n"+
        "Hpedidoc.si_igv as documento_mas_igv,\n"+
        "Hpedidoc.ctipo_cambio as nombre_tipo_cambio,\n"+
        "Hpedidoc.tipo_cambio as tipo_cambio,\n"+
        "Hpedidoc.lista_precios as documento_lista_precios,\n"+
        "Hpedidoc.responsable_aprobacion as documento_aprobacion_estado,\n"+
        "CONVERT(VARCHAR(50),Hpedidoc.fecha_aprobacion,103) as documento_aprobacion_fecha,\n"+
        "Hpedidoc.responsable_aprobacion as documento_aprobacion_codigo_responsable,\n"+
        "Hpedidoc.observacion_aprobacion as documento_aprobacion_comentario,\n"+
        "isnull(hperson.imagen_firma ,'') as documento_firma_Aprobacion1,\n"+
        "Hpedidoc.comentario2 as Comentario02,\n"+
        "Hpedidoc.ccod_cencos as documento_cencos_codigo,\n"+
        "Hcencos.cnom_cencos as documento_cencos_nombre, \n"+
        "Hpedidoc.dscto as documento_descuento_porc,\n"+
        "Hpedidoc.ot as documento_ot_codigo,\n"+
        "Horden_trabajo.cnom_ot as documento_ot_nombre, \n"+
        "Hpedidoc.lugar_entrega as documento_punto_llegada,\n"+
        "Hpedidoc.erp_dias as documento_dias,\n"+
        "LTRIM(RTRIM(Hpedidoc.pais)) as cliente_pais,\n"+
        "Hpedidoc.atencion as documento_atencion_estado,\n"+
        "Hpedidoc.porcentaje as documento_atencion_porcentaje,\n"+
        "LTRIM(RTRIM(Hpedidoc.ccod_contacto)) as cliente_contacto_codigo,\n"+
        "isnull(LTRIM(RTRIM(Hpercontactocli.erp_cargo)),'-') as cliente_contacto_cargo,\n"+
        "LTRIM(RTRIM(Hpedidoc.ccod_person)) as documento_vendedor1,\n"+
        "(Hvended.ccod_vendedor+' - '+Hvended.cnom_vendedor) as documento_vendedor1_nombre,\n"+
        "(Hvended.cnom_vendedor) as documento_vendedor1_nombre2,\n"+
        "Hvended.imagen_firma as documento_firma_vendedor,\n"+
        "(select top 1 imagen_firma from hperson where ccod_empresa=hpedidoc.ccod_empresa and Erp_Coduser=hpedidoc.Usuario) as documento_firma_responsable,\n"+
        "Hpedidoc.idvendedor2 as documento_vendedor2,\n"+
        "Vendedor2.cnom_vendedor as documento_vendedor2_nombre,\n"+
        "Hpedidoc.erp_glosa as documento_glosa,\n"+
        "Hpedidoc.erp_codage as cliente_agencia,\n"+
        "Hpedidoc.usuario as usuario_codigo,\n"+
        "Hpedidoc.Pc_User as pc_user,\n"+
        "Hpedidoc.Pc_Fecha as pc_fecha,\n"+
        "Hpedidoc.Pc_Ip as pc_ip,\n"+
        "Hpedidoc.erp_presupuesto as presupuesto_codigo,\n"+
        "Hpedidoc.subtotal_sin_descuentos as documento_subtotal_sin_descuentos,\n"+
        "Hpedidoc.erp_Ddescuento as documento_descuento,\n"+
        "Hpedidoc.erp_Dsubtotal as documento_subtotal,\n"+
        "Hpedidoc.erp_Digv as documento_igv,\n"+
        "Hpedidoc.erp_Dimporte as documento_importe,\n"+
        "Hpedidoc.erp_Dpercepcion as documento_percepcion,\n"+
        "Hpedidoc.erp_Dtotal as documento_total,\n"+
        "Hpedidoc.erp_gestor as gestor_codigo,\n"+
        "'' as documento_referencia_motivo_codigo,\n"+
        " 0 as documento_total_productos,\n"+
        "case Hpedidoc.nom_contacto when'00 - NINGUNO' then '-' else Hpedidoc.nom_contacto end as cliente_contacto_nombre,\n"+
        "Hpedidoc.erp_codune as unidad_negocio_codigo,\n"+
        "Hpedidoc.ccod_transportista as codigo_transportista,\n"+
        "Hpedidoc.ccod_vehiculo as codigo_vehiculo,\n"+
        "LTRIM(RTRIM(Hpedidoc.motivo_traslado)) as motivo_traslado,\n"+
        "Hpedidoc.cnum_docref as documento_numero_referencia, \n"+
        "Hpedidoc.n_orden as documento_numero_orden, \n"+
        "Hpedidoc.automatico as documento_automatico,\n"+
        "Hpedidoc.erp_nro_exp as numero_expediente1,\n"+
        "Hpedidoc.erp_nro_exp2 as numero_expediente2,\n"+
        "Hpedidoc.aprobado as documento_aprobado,\n"+
        "Hpedidoc.observacion as Comentario01,\n"+
        "--Cliente \n"+
        "hcliente.cdireccion as cliente_direccion,\n"+
        "hcliente.ctelefonos as cliente_telefono, \n"+
        "hcliente.cfax as cliente_fax, \n"+
        "hcliente.ce_mail as cliente_correo, \n"+
        "hcliente.ccod_pais as pais_cliente, \n"+
        "--Forma Pago\n"+
        "Hfor_pag.cnom_forpago as forma_pago_nombre,\n"+
        "--Detalle\n"+
        "Hpedidod.nitem as detalle_orden,\n"+
        "Hpedidod.ccod_articulo as articulo_codigo,\n"+
        "Hpedidod.cnom_articulo as articulo_nombre,\n"+
        "Hpedidod.cunidad as articulo_unidad,\n"+
        "Hpedidod.igv_art as articulo_igv_porcentaje,\n"+
        "Hpedidod.factor as articulo_factor,\n"+
        "Hpedidod.ncantidad as articulo_kardex,\n"+
        "Hpedidod.ncantidad3 as articulo_cantidad,\n"+
        
        "Hpedidod.nprecio as articulo_precio,\n"+
        "Hpedidod.nigv as articulo_igv,\n"+
        "'' as articulo_descuento1,\n"+
        "Hpedidod.desc2 as articulo_descuento2,\n"+
        "Hpedidod.barticulo as articulo_barticulo,\n"+
        "Hpedidod.cantidad_presentacion as articulo_presentacion_cantidad,\n"+
        "Hpedidod.nombre_presentacion as articulo_presentacion_nombre,\n"+
        "Hpedidod.unidad_presentacion as articulo_presentacion_unidad,\n"+
        "Hpedidod.precio_presentacion as articulo_presentacion_precio,\n"+
        "Hpedidod.base_imp as articulo_base_imponible,\n"+
        "Hpedidod.base_calculada as articulo_base_calculada,\n"+
        "Hpedidod.monto_descuento as articulo_monto_descuento,\n"+
        "Hpedidod.nimporte as articulo_importe,\n"+
        "Hpedidod.precio_original as articulo_precio_original,\n"+
        "Hpedidod.Desc3 as articulo_descuento3,\n"+
        "Hpedidod.erp_percepcion_sn as articulo_percepcion_sn,\n"+
        "Hpedidod.erp_percepcion_uni as articulo_percepcion_uni,\n"+
        "Hpedidod.erp_percepcion_porc as articulo_percepcion_porc,\n"+
        "Hpedidod.erp_desc4 as articulo_descuento4,\n"+
        "Hpedidod.ccod_almacen as articulo_almacen_codigo,\n"+
        "Hpedidod.erp_base_calc_dec as articulo_base_calculada_dec,\n"+
        "Hpedidod.erp_base_imp_dec as articulo_base_imponible_dec,\n"+
        "Hpedidod.erp_igv_dec as articulo_igv_dec,\n"+
        "Hpedidod.erp_importe_dec as articulo_importe_dec,\n"+
        "Hpedidod.erp_comision_porc as articulo_comision_porc,\n"+
        "Hpedidod.erp_comision_monto as articulo_comision_monto,\n"+
        "Hpedidod.codigo_presentacion as articulo_presentacion_codigo,\n"+
        "Erp_concepto1.erp_nomcon as articulo_marca,\n"+
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
        "HCONFIG_FORMATOS.valor as cantidad_filas, \n"+
        "'PED' as documento_tipo_movimiento\n"+
        "from Hpedidoc \n"+
        "left join Hpedidod on \n"+
        "Hpedidoc.ccod_empresa = Hpedidod.ccod_empresa \n"+
        "and Hpedidoc.ccod_almacen = Hpedidod.ccod_almacen \n"+
        "and Hpedidoc.idmotivo_venta = Hpedidod.idmotivo_venta \n"+
        "and Hpedidoc.cnum_doc = Hpedidod.cnum_doc \n"+
        "inner join hcliente on \n"+
        "Hpedidoc.ccod_empresa = hcliente.ccod_empresa \n"+
        "and Hpedidoc.ccod_cliente = hcliente.ccod_cliente \n"+
        "inner join Hfor_pag on \n"+
        "Hpedidoc.ccod_empresa = Hfor_pag.ccod_empresa \n"+
        "and Hpedidoc.ccod_forpago = Hfor_pag.ccod_forpago \n"+
        "inner join HCONFIG_FORMATOS on \n"+
        "Hpedidoc.ccod_empresa = HCONFIG_FORMATOS.ccod_empresa \n"+
        "and 'PED' = HCONFIG_FORMATOS.tipo_doc \n"+
        "inner join Hempresa on \n"+
        "Hpedidoc.ccod_empresa = Hempresa.ccod_empresa \n"+
        "left join Hpercontactocli on \n"+
        "Hpercontactocli.ccod_empresa = Hpedidoc.ccod_empresa\n"+
        "and Hpercontactocli.ccod_cliente = Hpedidoc.ccod_cliente\n"+
        "and Hpercontactocli.ccod_contacto = Hpedidoc.ccod_contacto\n"+
        "and Hpercontactocli.ccod_contacto <> '00'\n"+
        "inner join Halmacen on \n"+
        "Halmacen.ccod_empresa = Hpedidoc.ccod_empresa and \n"+
        "Halmacen.ccod_almacen = Hpedidoc.ccod_almacen \n"+
        "inner join Horden_trabajo on   \n"+
        "Hpedidoc.ccod_empresa = Horden_trabajo.ccod_empresa  \n"+
        "and Hpedidoc.Ot = Horden_trabajo.ccod_ot   \n"+
        "inner join Hcencos on \n"+
        "Hpedidoc.ccod_empresa = Hcencos.ccod_empresa  \n"+
        "and Hpedidoc.ccod_cencos = Hcencos.ccod_cencos \n"+
        "inner Join Hvended  On \n"+
        "Hpedidoc.ccod_empresa  = Hvended.ccod_Empresa  \n"+
        "and Hpedidoc.ccod_person = Hvended.ccod_vendedor \n"+	
        "inner Join Hvended as Vendedor2  On \n"+
        "Hpedidoc.ccod_empresa  = Vendedor2.ccod_Empresa  \n"+
        "and Hpedidoc.idvendedor2 = Vendedor2.ccod_vendedor \n"+
        "inner Join Harticul on  \n"+
        "Hpedidod.ccod_empresa=harticul.ccod_empresa  \n"+
        "And Hpedidod.ccod_articulo = harticul.ccod_articulo \n"+
        "inner Join Erp_Concepto1 On	 \n"+
        "Harticul.ccod_Empresa  = erp_concepto1.erp_codemp  \n"+
        "and Harticul.codmarca  = erp_concepto1.erp_codcon	 \n"+
        "left Join hperson On	 \n"+
        "hperson.ccod_Empresa  = Hpedidoc.ccod_Empresa  \n"+
        "and hperson.ccod_person  = Hpedidoc.responsable_aprobacion	 \n"+
        "where \n"+
        "Hpedidoc.ccod_empresa = @codigo_empresa \n"+
        "and Hpedidoc.ccod_almacen = @codigo_punto_venta \n"+
        "and Hpedidoc.idmotivo_venta = @motivo_documento \n"+
        "and Hpedidoc.cnum_doc = @numero_documento ");

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
        .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
        .input('codigo_cliente', mssql.VarChar(250), req.body.codigo)
        .input('todos', mssql.VarChar(250), req.body.todos)
        .query(
            "Select \n"+
            "Hpedidoc.ccod_almacen as Punto_Venta, \n"+
            "Hpedidoc.tipo_pedido as Tipo_Venta, \n"+
            "'PED' as Tipo_Documento, \n"+
            "Rtrim(Ltrim(Hpedidoc.idmotivo_venta)) as Codigo_Motivo_Serie, \n"+
            "Hpedidoc.cnum_doc as Numero, \n"+
            "CONVERT(VARCHAR(50),Hpedidoc.dfecha_doc,103) as Fecha, \n"+
            "Hcliente.ccod_cliente as Codigo_Cliente, \n"+
            "Hcliente.cnom_cliente as Nombre_Cliente, \n"+
            "CONVERT(VARCHAR(50),Hpedidoc.dfecha_entr,103) as Fecha_Entrega, \n"+
            "RTRIM(LTRIM(Hpedidoc.ccod_forpago)) as Forma_Pago, \n"+
            "Hpedidoc.cmoneda as Moneda, \n"+
            "hcencos.ccod_cencos as Cencos, \n"+
            "Hpedidoc.ot as Ot, \n"+
            "hcencos.responsable as Codigo_Responsable, \n"+
            "Hpedidoc.erp_codune as Codigo_Unidad_Negocio, \n"+
            "Hpedidoc.erp_codage as Codigo_Agencia_2, \n"+
            "Hpedidoc.erp_glosa as glosa, \n"+
            "Hpedidoc.si_igv as si_igv, \n"+
            "(hcencos.cnom_cencos) as Nombre_Cencos, \n"+
            "(ERP_MOTIVOS_TRAMITE.erp_nommot) as Motivo_Serie, \n"+
            "Hpedidoc.dscto as Porc_Descuento, \n"+
            "Hcliente.ctelefonos as Telefono_Cliente, \n"+
            "Hpedidoc.ccod_contacto as Codigo_Contacto, \n"+
            "Hpedidoc.nom_contacto as Nombre_Contacto, \n"+
            "Hcliente.ce_mail as Correo_Cliente, \n"+
            "Hpedidoc.lista_precios as Lista_Precios, \n"+
            "Hpedidoc.erp_dias as Dias_Forma_Pago, \n"+
            "Hpedidoc.ccod_person as Vendedor1, \n"+
            "Hpedidoc.subtotal_sin_descuentos as Sub_Total_Sin_Descuentos, \n"+
            "Hpedidoc.erp_Ddescuento as Monto_Descuento, \n"+
            "Hpedidoc.erp_Dsubtotal as Sub_Total, \n"+
            "Hpedidoc.erp_Digv as Igv, \n"+
            "Hpedidoc.erp_Dtotal as Total, \n"+
            "Hpedidoc.erp_presupuesto as Codigo_Presupuesto, \n"+
            "Hpedidoc.lugar_entrega as Punto_Llegada, \n"+
            "idvendedor2 as Vendedor2, \n"+
            "Hpedidoc.erp_gestor as Codigo_Gestor, \n"+
            "hcliente.cdireccion as Cliente_Direccion, \n"+
            "Hpedidoc.ccod_vehiculo as Codigo_Vehiculo, \n"+
            "Hpedidoc.ccod_transportista as Codigo_Transportista, \n"+
            "'' as Codigo_Chofer, \n"+
            "'' as Codigo_Agencia, \n"+
            "Hpedidoc.motivo_traslado as Motivo_Trasl, \n"+
            "'COT' as Tipo_Referencia_Documento, \n"+
            "'' as Motivo_Serie_Referencia_Documento, \n"+
            "Hpedidoc.cnum_docref as Numero_Referencia_Documento, \n"+
            "Hpedidoc.erp_nro_exp as Numero_Expediente1,\n"+
            "Hpedidoc.erp_nro_exp2 as Numero_Expediente2\n"+
            "From Hpedidoc \n"+
            "Inner Join Hcliente On \n"+
            "Hpedidoc.ccod_empresa= Hcliente.ccod_empresa And \n"+
            "Hpedidoc.ccod_cliente = Hcliente.ccod_cliente \n"+
            "Inner Join hcencos On \n"+
            "Hpedidoc.ccod_cencos = hcencos.ccod_cencos And \n"+
            "Hpedidoc.ccod_empresa = hcencos.ccod_empresa \n"+
            "Inner Join ERP_MOTIVOS_TRAMITE on \n"+
            "Hpedidoc.ccod_empresa= ERP_MOTIVOS_TRAMITE.erp_codemp And \n"+
            "Hpedidoc.idmotivo_venta = ERP_MOTIVOS_TRAMITE.erp_codmot \n"+
            "inner join Hconfiguraciones_2 on \n"+
            "Hpedidoc.ccod_empresa= Hconfiguraciones_2.idempresa \n"+
            "Where Hpedidoc.ccod_empresa = @codigo_empresa And \n"+
            "Hpedidoc.ccod_almacen = @codigo_punto_venta AND    "+   
            "case @todos when 'S' then '' else Hpedidoc.atencion end <> 'Atendido' \n"+
            "and Hpedidoc.estado <> 'Anulado' \n"+
            "and (Hpedidoc.aprobado ='Aprobado' \n"+
            "or pedido_aprobacion= 'N') \n"+
            "and Hpedidoc.ccod_cliente = \n"+
            "(case when @codigo_cliente = '' then Hpedidoc.ccod_cliente else @codigo_cliente end ) \n"+
            "Order By Hpedidoc.dfecha_doc desc,cnum_doc desc"
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
        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('punto_venta', mssql.VarChar(200), req.body.punto_venta)
        .input('motivo_serie', mssql.VarChar(200), req.body.motivo_serie)
        .input('numero', mssql.VarChar(200), req.body.numero)
        .input('todos', mssql.VarChar(250), req.body.todos)
        .query(
            "select \n"+
            "Cantidad_Por_Atender - \n"+
            "case Cantidad_Atendida when -1 then 0 else Cantidad_Atendida end as Cantidad, \n"+
            "Cantidad_Kardex_Por_Atender - \n"+
            "case Cantidad_Kardex_Atendida when -1 then 0 else Cantidad_Kardex_Atendida end as Cantidad_Kardex, \n"+
            "* from ( \n"+
            "SELECT \n"+
            "Hpedidod.ccod_almacen as Punto_Venta, \n"+
            "Hpedidod.idmotivo_venta as Codigo_Motivo_Serie, \n"+
            "Hpedidod.cnum_doc as Numero, \n"+
            "Hpedidod.nitem as NItem, \n"+
            "Hpedidod.NCANTIDAD3 as Cantidad_Por_Atender, \n"+
            "(case @todos when 'S' then 0 else isnull(( \n"+
            "select sum(ncantidad3) from Hmoviald \n"+
            "inner join Hmovialc on \n"+
            "Hmovialc.ccod_empresa = Hmoviald.ccod_empresa \n"+
            "and Hmovialc.ccod_almacen = Hmoviald.ccod_almacen \n"+
            "and Hmovialc.ccod_movimiento = Hmoviald.CCOD_MOVIMIENTO\n"+
            "and Hmovialc.cnum_serie = Hmoviald.CNUM_SERIE\n"+
            "and Hmovialc.cnum_doc = Hmoviald.cnum_doc \n"+
            "and Hmovialc.tipo_venta like '%pedido%' \n"+
            "where \n"+
            "Hmoviald.ccod_empresa = Hpedidod.ccod_empresa \n"+
            "and Hmoviald.motivo_pedido = Hpedidod.idmotivo_venta \n"+
            "and Hmoviald.doc_origen_pedido = Hpedidod.cnum_doc \n"+
            "and Hmoviald.ccod_almacen = Hpedidod.ccod_almacen \n"+
            "and Hmovialc.estado <> 'Anulado' \n"+
            "and Hmoviald.ccod_articulo = Hpedidod.ccod_articulo \n"+
            "and Hmoviald.cunidad = Hpedidod.cunidad \n"+
            "and Hmoviald.origen_item = Hpedidod.nitem \n"+
            "),-1) end) as Cantidad_Atendida, \n"+
            "Hpedidod.CCOD_ARTICULO AS Codigo, \n"+
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
            "Hpedidod.CNOM_ARTICULO AS Nombre, \n"+
            "RTRIM(Hpedidod.CUNIDAD) AS Codigo_Unidad, \n"+
            "RTRIM(Hpedidod.CUNIDAD) AS Unidad,\n"+
            "Hpedidod.erp_comision_porc as Comision_porcentaje, \n"+
            "Hpedidod.factor as Factor, \n"+
            "Hpedidod.NPRECIO as Unit, \n"+
            "Hpedidod.BASE_IMP as Base_Imponible, \n"+
            "Hpedidod.porc_descuento as Desc1, \n"+
            "Hpedidod.DESC2 as Desc2, \n"+
            "Hpedidod.Desc3 As Desc3, \n"+
            "Hpedidod.erp_desc4 as Desc4, \n"+
            "Hpedidod.BASE_CALCULADA as Base_Calculada, \n"+
            "Hpedidod.NIGV as Igv, \n"+
            "Hpedidod.NIMPORTE as Importe, \n"+
            "Hpedidod.erp_peso as Peso, \n"+
            "Halmacen_2.ccod_almacen as Codigo_Almacen, \n"+
            "Halmacen_2.cnom_almacen as Almacen, \n"+
            "Hpedidod.cantidad_presentacion as Cantidad_presentacion, \n"+
            "Hpedidod.codigo_presentacion as Codigo_presentacion, \n"+
            "RTRIM(Hpedidod.unidad_presentacion) AS Unidad_presentacion, \n"+
            "Hpedidod.nombre_presentacion AS Nombre_presentacion, \n"+
            "Hpedidod.precio_presentacion as Precio_presentacion, \n"+
            "'' as Observacion, \n"+
            "Hpedidod.OT as OT, \n"+
            "'' as ICBPER, \n"+ 
            "Hpedidod.NCANTIDAD as Cantidad_Kardex_Por_Atender, \n"+
            "isnull(( \n"+
            "select sum(ncantidad) from Hmoviald \n"+
            "inner join Hmovialc on \n"+
            "Hmovialc.ccod_empresa = Hmoviald.ccod_empresa \n"+
            "and Hmovialc.ccod_almacen = Hmoviald.ccod_almacen \n"+
            "and Hmovialc.ccod_movimiento = Hmoviald.CCOD_MOVIMIENTO\n"+
            "and Hmovialc.cnum_serie = Hmoviald.CNUM_SERIE\n"+
            "and Hmovialc.cnum_doc = Hmoviald.cnum_doc \n"+
            "and Hmovialc.tipo_venta like '%pedido%' \n"+
            "where \n"+
            "Hmoviald.ccod_empresa = Hpedidod.ccod_empresa \n"+
            "and Hmoviald.motivo_pedido = Hpedidod.idmotivo_venta \n"+
            "and Hmoviald.doc_origen_pedido = Hpedidod.cnum_doc \n"+
            "and Hmoviald.ccod_almacen = Hpedidod.ccod_almacen \n"+
            "and Hmovialc.estado <> 'Anulado' \n"+
            "and Hmoviald.ccod_articulo = Hpedidod.ccod_articulo \n"+
            "and Hmoviald.cunidad = Hpedidod.cunidad \n"+
            "and Hmoviald.origen_item = Hpedidod.nitem \n"+
            "),-1) as Cantidad_Kardex_Atendida, \n"+
            "Hpedidod.barticulo as Barticulo, \n"+
            "Hpedidod.igv_art as Igv_Art, \n"+
            "Hpedidod.monto_descuento as Monto_Descuento, \n"+
            "Hpedidod.precio_original as Precio_original, \n"+
            "Hpedidod.erp_codune as Codigo_Unidad_Negocio,\n"+
            "Hpedidod.erp_codune as Unidad_negocio, \n"+
            "Hpedidod.CCENCOS AS Codigo_Cencos,\n"+
            "Hpedidod.CCENCOS AS Cencos, \n"+
            "Hpedidod.erp_presupuesto as Codigo_Partida_presupuestal, \n"+
            "Hpedidod.erp_presupuesto as Partida_presupuestal, \n"+
            "Hpedidod.erp_codage as Codigo_Agencia, \n"+
            "Hpedidod.erp_codage as Agencia, \n"+
            "Hpedidod.erp_percepcion_sn as Percepcion_sn, \n"+
            "Hpedidod.erp_percepcion_uni as Percepcion_uni, \n"+
            "Hpedidod.erp_percepcion_porc as Perpecion_porc, \n"+
            "Hpedidod.erp_boni_sn as Boni_sn, \n"+
            "Hpedidod.erp_item_boni as Item_boni, \n"+
            "Hpedidod.erp_comision_monto as Comision_monto, \n"+
            "Hpedidod.erp_base_calc_dec as Base_calculada_dec, \n"+
            "Hpedidod.erp_base_imp_dec as Base_imp_dec, \n"+
            "Hpedidod.erp_igv_dec as Igv_dec, \n"+
            "Hpedidod.erp_importe_dec as Importe_dec, \n"+
            "Harticul.csistock as Stock_SN, \n"+
            "Harticul.lote as Lote_SN, \n"+
            "'' as Lote_Numero, \n"+
            "'' as Lote_Vencimiento, \n"+
            "Harticul.flagserie Serie_SN, \n"+
            "'' as Serie_Numero, \n"+
            "Hpedidod.ptovta_cotizacion as Cotizacion_Punto_Venta, \n"+
            "Hpedidod.idmotivo_cotizacion as Cotizacion_Motivo, \n"+
            "Hpedidod.numero_cotizacion as Cotizacion_Numero, \n"+
            "Hpedidod.nitem_ref as Cotizacion_NItem, \n"+
            "Hpedidod.idmotivo_venta as Pedido_Motivo, \n"+
            "Hpedidod.cnum_doc as Pedido_Numero, \n"+
            "Hpedidod.nitem as Pedido_NItem, \n"+
            "'' as Guia_Serie, \n"+
            "'' as Guia_Numero, \n"+
            "'0' as Guia_NItem, \n"+
            "'PED' as Origen_Documento, \n"+
            "Hpedidod.idmotivo_venta as Origen_Serie, \n"+
            "Hpedidod.cnum_doc as Origen_Numero, \n"+
            "Hpedidod.nitem as Origen_NItem \n"+
            "FROM Hpedidod inner Join Harticul On \n"+
            "Hpedidod.ccod_empresa = Harticul.ccod_empresa and \n"+
            "Hpedidod.ccod_articulo = Harticul.ccod_articulo \n"+
            "inner join erp_concepto1 on \n"+
            "erp_concepto1.erp_codemp = Harticul.ccod_empresa and \n"+
            "erp_concepto1.erp_codcon = Harticul.codmarca \n"+
            "inner join Halmacen_2 on \n"+
            "Halmacen_2.ccod_empresa = Hpedidod.ccod_empresa and \n"+
            "Halmacen_2.ccod_almacen = Hpedidod.ccod_almacen_org \n"+
            "WHERE \n"+
            "Hpedidod.ccod_empresa = @codigo_empresa and \n"+
            "Hpedidod.idmotivo_venta = @motivo_serie and\n"+
            "Hpedidod.cnum_doc = @numero and \n"+
            "Hpedidod.ccod_almacen= @punto_venta \n"+
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
            .input('tipo_documento', mssql.VarChar(250), "Pedidos")
            .input('serie_motivo', mssql.VarChar(250), detalle.Codigo_Motivo_Serie)
            .input('numero_documento', mssql.VarChar(250), detalle.Numero)
            .input('modulo', mssql.VarChar(250), "Pedidos")
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
                "update hpedidoc \n"+
                "set \n"+
                "atencion='Atendido'\n"+
                ",porcentaje='100%'\n"+
                "where \n"+
                "ccod_empresa=@codigo_empresa\n"+
                "and ccod_almacen=@punto_venta\n"+
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
        console.log(req.body);
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
        "select   \n"+
        "observacion as comentario1,  \n"+
        "comentario2 as comentario2,  \n"+
        "comentario3 as comentario3,  \n"+
        "comentario4 as comentario4,  \n"+
        "comentario5 as comentario5,  \n"+
        "comentario6 as comentario6,  \n"+
        "comentario7 as comentario7,  \n"+
        "comentario8 as comentario8,  \n"+
        "titulo01 as comentario1_1,  \n"+
        "titulo02 as comentario2_1,  \n"+
        "titulo03 as comentario3_1,  \n"+
        "titulo04 as comentario4_1,  \n"+
        "titulo05 as comentario5_1,  \n"+
        "titulo06 as comentario6_1,  \n"+
        "titulo07 as comentario7_1,  \n"+
        "titulo08 as comentario8_1 \n"+
        "from Hpedidoc  \n"+
        "where \n"+
        "Hpedidoc.ccod_empresa = @codigo_empresa \n"+
        "and Hpedidoc.ccod_almacen = @codigo_punto_venta \n"+
        "and Hpedidoc.idmotivo_venta = @motivo_documento \n"+
        "and Hpedidoc.cnum_doc = @numero_documento "
        );

        const Cabecera = lista.recordset;
        res.json(Cabecera);
    } catch (err) {
        res.send(err.message);
    }
});

module.exports = router;