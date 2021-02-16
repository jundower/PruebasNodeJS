const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../../database');
const qrcode = require("qrcode");
const path = require('path');
const helpers = require('../../../lib/helpers');

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
    try{
        const codigo_empresa = req.user.codigo_empresa;
        // const motivo_documento = '022';
        // const numero_documento = '2020-00002';
        // const codigo_punto_venta = '001';
        var tipo_documento = req.body.tipo_documento;
        var numero_documento = req.body.numero_documento;
        var codigo_punto_venta = req.body.codigo_punto_venta;
        var numero_serie = req.body.numero_serie 

        if(codigo_punto_venta==""){
            codigo_punto_venta = req.user.codigo_punto_venta;
        }
        const pool = await poolPromise;
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('tipo_documento', mssql.VarChar(250), tipo_documento)
        .input('numero_documento', mssql.VarChar(250), numero_documento)
        .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
        .input('numero_serie', mssql.VarChar(250), numero_serie)
        .query("SELECT \n"+ 
        "HMOVIALD.nitem as NItem, \n"+ 
        "HMOVIALD.NCANTIDAD3 as Cantidad, \n"+ 
        "HMOVIALD.CCOD_ARTICULO AS Codigo, \n"+ 
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
        "HMOVIALD.CNOM_ARTICULO AS Nombre, \n"+ 
        "RTRIM(HMOVIALD.CUNIDAD) AS Codigo_Unidad, \n"+ 
        "RTRIM(HMOVIALD.CUNIDAD) AS Unidad,\n"+
        "HMOVIALD.erp_comision_porc as Comision_porcentaje, \n"+ 
        "HMOVIALD.factor as Factor, \n"+ 
        "HMOVIALD.NPRECIO_TRANS as Unit, \n"+ 
        "HMOVIALD.NBASEIMPON as Base_Imponible, \n"+ 
        "HMOVIALD.porc_descuento as Desc1, \n"+ 
        "HMOVIALD.DESC2 as Desc2, \n"+ 
        "HMOVIALD.Desc3 As Desc3, \n"+ 
        "HMOVIALD.erp_desc4 as Desc4, \n"+ 
        "HMOVIALD.BASE_CALCULADA as Base_Calculada, \n"+ 
        "HMOVIALD.nigvcalc as Igv, \n"+ 
        "HMOVIALD.digv_icbper as ICBPER, \n"+ 
        "hmoviald.NPRECIO_IMPORTE AS Importe, \n"+ 
        "HMOVIALD.erp_peso as Peso, \n"+ 
        "Halmacen_2.ccod_almacen as Codigo_Almacen, \n"+
        "Halmacen_2.cnom_almacen as Almacen, \n"+
        "HMOVIALD.cantidad_presentacion as Cantidad_presentacion, \n"+ 
        "HMOVIALD.codigo_presentacion as Codigo_presentacion, \n"+ 
        "RTRIM(HMOVIALD.unidad_presentacion) AS Unidad_presentacion, \n"+ 
        "HMOVIALD.nombre_presentacion AS Nombre_presentacion, \n"+ 
        "HMOVIALD.precio_presentacion as Precio_presentacion, \n"+ 
        "'' as Observacion, \n"+ 
        "HMOVIALD.OT as OT, \n"+ 
        "HMOVIALD.NCANTIDAD as Cantidad_Kardex, \n"+ 
        "HMOVIALD.barticulo as Barticulo, \n"+ 
        "HMOVIALD.NIGV as Igv_Art, \n"+ 
        "HMOVIALD.monto_descuento as Monto_Descuento, \n"+ 
        "HMOVIALD.precio_original as Precio_original, \n"+ 
        "HMOVIALD.erp_codune as Codigo_Unidad_negocio, \n"+ 
        "HMOVIALD.erp_codune as Unidad_negocio, \n"+ 
        "HMOVIALD.cc AS Codigo_Cencos, \n"+ 
        "HMOVIALD.cc AS Cencos, \n"+ 
        "HMOVIALD.erp_presupuesto as Codigo_Partida_presupuestal, \n"+ 
        "HMOVIALD.erp_presupuesto as Partida_presupuestal, \n"+ 
        "HMOVIALD.erp_codage as Codigo_Agencia, \n"+ 
        "HMOVIALD.erp_codage as Agencia, \n"+ 
        "HMOVIALD.erp_percepcion_sn as Percepcion_sn, \n"+ 
        "HMOVIALD.erp_percepcion_uni as Percepcion_uni, \n"+ 
        "HMOVIALD.erp_percepcion_porc as Perpecion_porc, \n"+ 
        "HMOVIALD.erp_boni_sn as Boni_sn, \n"+ 
        "HMOVIALD.erp_item_boni as Item_boni, \n"+ 
        "HMOVIALD.erp_comision_monto as Comision_monto, \n"+ 
        "HMOVIALD.erp_base_calc_dec as Base_calculada_dec, \n"+ 
        "HMOVIALD.erp_base_imp_dec as Base_imp_dec, \n"+ 
        "HMOVIALD.erp_igv_dec as Igv_dec, \n"+ 
        "HMOVIALD.erp_importe_dec as Importe_dec, \n"+ 
        "Harticul.csistock as Stock_SN, \n"+
        "HMOVIALD.blote as Lote_SN, \n"+ 
        "HMOVIALD.cnro_lote as Lote_Numero, \n"+ 
        "CONVERT(VARCHAR(50),HMOVIALD.vcto, 111) as Lote_Vencimiento, \n"+ 
        "HMOVIALD.bserie as Serie_SN, \n"+ 
        "HMOVIALD.nro_serie as Serie_Numero, \n"+ 
        "HMOVIALD.cnum_doc_ordc as Documento_Orden_Compra, \n"+ 
        "HMOVIALD.cnum_doc_guiaventa Documento_Guia_Venta , \n"+ 
        "HMOVIALD.doc_origen_pedido as Origen_Documento_Pedido, \n"+
        "HMOVIALD.motivo_pedido as Pedido_Motivo, \n"+
        "HMOVIALD.doc_origen_pedido as Pedido_Numero, \n"+
        "HMOVIALD.origen_item as Pedido_NItem, \n"+
        "case Hmoviald.movimiento_origen when '09' then Hmoviald.serie_origen else '' end  as Guia_Serie, \n"+
        "case Hmoviald.movimiento_origen when '09' then Hmoviald.cnum_doc_guiaventa else '' end  as Guia_Numero, \n"+
        "case Hmoviald.movimiento_origen when '01' then Hmoviald.serie_origen else '' end  as Factura_Serie, \n"+
        "case Hmoviald.movimiento_origen when '01' then Hmoviald.cnum_doc_guiaventa else '' end  as Factura_Numero, \n"+
        "case Hmoviald.movimiento_origen when '03' then Hmoviald.serie_origen else '' end  as Boleta_Serie, \n"+
        "case Hmoviald.movimiento_origen when '03' then Hmoviald.cnum_doc_guiaventa else '' end  as Boleta_Numero, \n"+
        "case Hmoviald.movimiento_origen when '07' then Hmoviald.serie_origen else '' end  as NC_Serie, \n"+
        "case Hmoviald.movimiento_origen when '07' then Hmoviald.cnum_doc_guiaventa else '' end  as NC_Numero, \n"+
        "case Hmoviald.movimiento_origen when '08' then Hmoviald.serie_origen else '' end  as ND_Serie, \n"+
        "case Hmoviald.movimiento_origen when '08' then Hmoviald.cnum_doc_guiaventa else '' end  as ND_Numero, \n"+
        "Hmoviald.movimiento_origen as Origen_Documento, \n"+
        "Hmoviald.serie_origen as Origen_Serie, \n"+
        "Hmoviald.cnum_doc_guiaventa as Origen_Numero, \n"+
        "Hmoviald.erp_itemref as Origen_NItem \n"+
        "FROM HMOVIALD inner Join Harticul On \n"+
        "HMOVIALD.ccod_empresa = Harticul.ccod_empresa and \n"+
        "HMOVIALD.ccod_articulo = Harticul.ccod_articulo \n"+
        "inner join erp_concepto1 on \n"+
        "erp_concepto1.erp_codemp = Harticul.ccod_empresa and \n"+
        "erp_concepto1.erp_codcon = Harticul.codmarca \n"+
        "inner join Halmacen_2 on\n"+
        "Halmacen_2.ccod_empresa = HMOVIALD.ccod_empresa and\n"+
        "Halmacen_2.ccod_almacen = HMOVIALD.ccod_almacen_org\n"+
        "WHERE \n"+
        "HMOVIALD.ccod_empresa = @codigo_empresa and \n"+
        "HMOVIALD.CNUM_SERIE = @numero_serie and \n"+
        "HMOVIALD.cnum_doc = @numero_documento and \n"+
        "HMOVIALD.ccod_almacen = @codigo_punto_venta and \n"+
        "HMOVIALD.CCOD_MOVIMIENTO = @tipo_documento \n"+
        "ORDER BY NITEM" );
    
        const recordset = lista.recordset;
        res.json(recordset);
    }catch(err){
        res.send(err.message);
    }
});

router.post('/guardar', async (req, res) => {
    try {

        const codigo_empresa = req.user.codigo_empresa;
        const ruc_empresa = req.user.ruc_empresa;
        const codigo_punto_venta = req.user.codigo_punto_venta;
        const usuario = req.user.codigo_usuario;

        var documento_saved=true;
        var filas_detalle = JSON.parse(req.body.filas_detalle);
        var datos_anticipos = JSON.parse(req.body.datos_anticipos);
        
        var numero_correlativo;
        var erp_dscto_stock;
        
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
                    .input('tipo_documento', mssql.VarChar(250), req.body.tipo_documento)
                    .input('serie_documento', mssql.VarChar(250), req.body.serie)
                    .input('tipo_movimiento', mssql.VarChar(250), req.body.tipo_movimiento)
                    .query(
                        "declare \n"+
                        "@correlativo int, \n"+
                        "@contador int, \n"+
                        "@cantidad_ceros int, \n"+
                        "@ceros varchar(50), \n"+
                        "@cnt INT \n"+
                        "set @contador = 1 \n"+
                        "set @ceros ='' \n"+
                        "SELECT @correlativo = ultimo_grab \n"+
                        "FROM HTALONAR \n"+
                        "WHERE ccod_empresa = @codigo_empresa \n"+
                        "and ccod_almacen= @codigo_punto_venta \n"+
                        "and tip_doc= @tipo_documento \n"+
                        "and cnum_serie= @serie_documento \n"+
                        "select \n"+
                        "@cantidad_ceros = Isnull(cantidad_caracteres,0) \n"+
                        "from htipdoc \n"+
                        "where ccod_empresa = @codigo_empresa \n"+
                        "and ctip_doc = @tipo_documento \n"+
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
                            "FROM hmovialc \n"+
                            "WHERE CCOD_EMPRESA= @codigo_empresa  \n"+
                            "AND ccod_almacen= @codigo_punto_venta \n"+
                            "AND CCOD_MOVIMIENTO= @tipo_documento \n"+
                            "AND CNUM_SERIE= @serie_documento \n"+
                            "AND CTIP_MOVIMIENTO= @tipo_movimiento \n"+
                            "AND CNUM_DOC=@ceros+@correlativo \n"+
                            "set @ceros = '' \n"+
                            "set @cnt = LEN(@correlativo) \n"+
                            "WHILE @cnt < @cantidad_ceros \n"+
                            "BEGIN \n"+
                               "SET @ceros = '0'+@ceros \n"+
                               "SET @cnt = @cnt + 1 \n"+
                            "END \n"+
                        "end \n"+
                        "select @ceros+CONVERT(VARCHAR(50),@correlativo) as correlativo \n"
                    );
        
                    var recordset_automatico = result_automatico.recordset;
                    numero_correlativo = recordset_automatico[0].correlativo;
        
                } else {
                    numero_correlativo = req.body.numero_correlativo
                }
                //#endregion

                //#region Creación de QR
                await qrcode.toFile(path.join(__dirname, '../../../public/erp/'+codigo_empresa+'/qr/'+ruc_empresa+'-'+req.body.tipo_documento+'-'+req.body.serie+'-'+numero_correlativo+'.png'),ruc_empresa+'|'+req.body.tipo_documento+'|'+req.body.serie+'|'+numero_correlativo+'|'+req.body.erp_Digv+'|'+req.body.erp_Dimporte+'|'+req.body.fecha_doc+'|'+req.body.tipo_documento_cliente+'|'+req.body.codigo_cliente,{color: {light: '#0000'}},function(err){
                    if(err) throw console.log(err);
                    // console.log("qr_creado");
                });
                //#endregion

                //#region Determinar si descuenta o no el stock
                if (req.body.tipo_documento == '08' || req.body.tipo == 'VENTA DIFERIDA' || 
                req.body.tipo == 'NOTA DE CREDITO POR DESCUENTO' || req.body.tipo == 'ANTICIPO' || 
                req.body.tipo == 'VENTA DIFERIDA DE PEDIDO') {
                    erp_dscto_stock = 'N';
                }else{
                    erp_dscto_stock = req.body.erp_dscto_stock;
                }                                    
                //#endregion

                //#region Registro de la cabecera
                const request_cabecera  = new mssql.Request(transaction);
                await request_cabecera
                .input('ccod_empresa', mssql.VarChar(10), codigo_empresa)
                .input('ccod_almacen', mssql.VarChar(3), codigo_punto_venta)
                .input('ccod_movimiento', mssql.VarChar(3), req.body.tipo_documento)
                .input('ctip_movimiento', mssql.VarChar(10), req.body.tipo_movimiento)
                .input('cnum_serie', mssql.VarChar(5), req.body.serie)
                .input('cnum_doc', mssql.VarChar(250), numero_correlativo)
                .input('dfecha_doc', mssql.Date, req.body.fecha_doc)
                .input('nro_dias', mssql.Int, req.body.dias)
                .input('dfecha_entr', mssql.Date, req.body.fecha_entr)
                .input('cmoneda', mssql.VarChar(3), req.body.moneda)
                .input('ccod_forpago', mssql.VarChar(250), req.body.forma_pago)
                .input('nsubtotal', mssql.Decimal(18,2), req.body.erp_Dsubtotal)
                .input('nigv', mssql.Decimal(18,2), req.body.erp_Digv)
                .input('nimporte', mssql.Decimal(18,2), req.body.erp_Dimporte)
                .input('anticipo', mssql.Decimal(18,2), req.body.anticipo)
                .input('erp_impmn', mssql.Decimal(18,2), req.body.impmn)
                .input('erp_impme', mssql.Decimal(18,2), req.body.impme)
                .input('costo', mssql.Decimal(18,2), req.body.costo)
                .input('ctip_docref', mssql.VarChar(15), req.body.tipo_documento_referencia)
                .input('cserie_docref', mssql.VarChar(15), req.body.serie_documento_referencia)
                .input('cnum_docref', mssql.VarChar(15), req.body.numero_documento_referencia)
                .input('fecha_ref', mssql.Date, req.body.fecha_referencia)
                .input('ccod_almacend', mssql.VarChar(3), req.body.codigo_almacen_d)
                .input('ccod_cliente', mssql.VarChar(20), req.body.codigo_cliente)
                .input('cnom_cliente_v', mssql.VarChar(250), req.body.nombre_cliente)
                .input('cnum_ruc_v', mssql.VarChar(20), req.body.ruc_cliente)
                .input('idcliente2', mssql.VarChar(20), req.body.codigo_cliente)
                .input('nombre_cliente2', mssql.VarChar(250), req.body.nombre_cliente)
                .input('ccod_proveedor', mssql.VarChar(20), req.body.codigo_proveedor)
                .input('cnom_proveedor_c', mssql.VarChar(250), req.body.nombre_proveedor_c)
                .input('estado', mssql.VarChar(12), req.body.estado)
                .input('porcentaje', mssql.VarChar(250), req.body.porcentaje)
                .input('atencion', mssql.VarChar(12), req.body.atencion)
                .input('modulo', mssql.VarChar(250), req.body.modulo)
                .input('ctipo_cambio', mssql.VarChar(3), req.body.tipo_cambio)
                .input('tipo_cambio', mssql.Decimal(18,8), req.body.tasa_cambio)
                .input('desc_stock', mssql.VarChar(1), erp_dscto_stock)
                .input('ccod_almacen2', mssql.VarChar(250), req.body.ccod_almacen2)
                .input('ccod_almacend2', mssql.VarChar(250), req.body.ccod_almacend2)
                .input('automatico', mssql.VarChar(1), req.body.automatico)
                .input('automatico_destino', mssql.VarChar(1), req.body.automatico)
                .input('serie_destino', mssql.VarChar(250), req.body.serie_destino)
                .input('numero_destino', mssql.VarChar(20), req.body.numero_destino)
                .input('ccod_responsable', mssql.VarChar(15), req.body.vendedor_2)
                .input('ccod_vendedor', mssql.VarChar(15), req.body.vendedor_1)
                .input('idvendedor2', mssql.VarChar(15), req.body.vendedor_2)
                .input('ccod_transaccion', mssql.VarChar(250), req.body.codigo_transaccion)
                .input('erp_codune', mssql.VarChar(20), req.body.codigo_unidad_negocio)
                .input('ccod_cencos', mssql.VarChar(20), req.body.codigo_centro_costos)
                .input('ot', mssql.VarChar(20), req.body.orden_trabajo)
                .input('ccod_vehiculo', mssql.VarChar(250), req.body.codigo_vehiculo)
                .input('ccod_transportista', mssql.VarChar(15), req.body.codigo_transportista)
                .input('nombre_chofer', mssql.VarChar(250), req.body.codigo_chofer)
                .input('pais', mssql.VarChar(250), req.body.pais)
                .input('tipo_venta', mssql.VarChar(30), req.body.tipo)
                .input('n_orden', mssql.VarChar(30), req.body.numero_orden)
                .input('si_igv', mssql.VarChar(1), req.body.mas_igv)
                .input('porc_descuento', mssql.Decimal(18,4), req.body.descuento)
                .input('motivo_traslado', mssql.VarChar(250), req.body.motivo_traslado)
                .input('lista_precios', mssql.VarChar(10), req.body.lista_precios)
                .input('observacion', mssql.VarChar(250), req.body.observacion)
                .input('glosa', mssql.VarChar(250), req.body.Glosa)
                .input('tipo_comprobante', mssql.VarChar(250), req.body.tipo_comprobante)
                .input('serie_comprobante', mssql.VarChar(5), req.body.serie_comprobante)
                .input('numero_comprobante', mssql.VarChar(250), req.body.numero_comprobante)
                .input('fecha_comp', mssql.Date, req.body.fecha_comprobante)
                .input('pto_partida_02', mssql.VarChar(255), req.body.pto_partida)
                .input('pto_llegada_02', mssql.VarChar(255), req.body.pto_llegada)
                .input('ccod_detraccion', mssql.VarChar(250), req.body.codigo_detraccion)
                .input('erp_codage', mssql.VarChar(20), req.body.codigo_agencia)
                .input('contabilizada', mssql.VarChar(1), req.body.contabilizada)
                .input('serie_guia_prov', mssql.VarChar(5), req.body.serie_guia_prov)
                .input('via_nom_partida', mssql.VarChar(200), req.body.via_nom_partida)
                .input('nro_guia_prov', mssql.VarChar(250), req.body.nro_guia_prov)
                .input('serie_fac_prov', mssql.VarChar(5), req.body.serie_fac_prov)
                .input('nro_fac_prov', mssql.VarChar(250), req.body.nro_fac_prov)
                .input('fecha_emision', mssql.Date, req.body.fecha_emision)
                .input('usuario', mssql.VarChar(100), usuario)
                .input('n_req', mssql.VarChar(20), req.body.n_req)
                .input('viatipo_partida', mssql.VarChar(200), req.body.viatipo_partida)
                .input('nro_partida', mssql.VarChar(250), req.body.nro_partida)
                .input('interior_partida', mssql.VarChar(200), req.body.interior_partida)
                .input('zona_partida', mssql.VarChar(200), req.body.zona_partida)
                .input('distrito_partida', mssql.VarChar(200), req.body.distrito_partida)
                .input('prov_partida', mssql.VarChar(200), req.body.prov_partida)
                .input('dep_partida', mssql.VarChar(200), req.body.dep_partida)
                .input('tip_nro_doc_partida', mssql.VarChar(200), req.body.tip_nro_doc_partida)
                .input('viatipo_llegada', mssql.VarChar(200), req.body.viatipo_llegada)
                .input('via_nom_llegada', mssql.VarChar(200), req.body.via_nom_llegada)
                .input('nro_llegada', mssql.VarChar(200), req.body.nro_llegada)
                .input('interior_llegada', mssql.VarChar(200), req.body.pto_llegada)
                .input('zona_llegada', mssql.VarChar(200), req.body.zona_llegada)
                .input('distrito_llegada', mssql.VarChar(200), req.body.distrito_llegada)
                .input('prov_llegada', mssql.VarChar(200), req.body.prov_llegada)
                .input('dep_llegada', mssql.VarChar(200), req.body.dep_llegada)
                .input('tipo_venta_ref', mssql.VarChar(250), req.body.tipo_venta_ref)
                .input('erp_ejecon', mssql.VarChar(4), req.body.erp_ejecon)
                .input('erp_percon', mssql.VarChar(8), req.body.erp_percon)
                .input('erp_codsub', mssql.VarChar(10), req.body.erp_codsub)
                .input('erp_numcon', mssql.VarChar(250), req.body.erp_numcon)
                .input('erp_codagente', mssql.VarChar(12), req.body.codigo_agencia)
                .input('erp_costome',  mssql.Decimal(18,10), req.body.erp_costome)
                .input('erp_costomn',  mssql.Decimal(18,10), req.body.erp_costomn)
                .input('pc_user', mssql.VarChar(30), req.body.Pc_User)
                .input('pc_fecha', mssql.Date, req.body.Pc_Fecha)
                .input('pc_ip', mssql.VarChar(30), req.body.Pc_Ip)
                .input('erp_cosme', mssql.Decimal(18,4), req.body.erp_cosme)
                .input('erp_cosmn', mssql.Decimal(18,4), req.body.erp_cosmn)
                .input('erp_iteref', mssql.Int, req.body.erp_iteref)
                .input('erp_codcaja', mssql.VarChar(250), req.body.erp_codcaja)
                .input('erp_vuelto', mssql.Decimal(18,2), req.body.erp_vuelto)
                .input('ruta_cont_ped', mssql.VarChar(500), req.body.ruta_cont_ped)
                .input('erp_presupuesto', mssql.VarChar(20), req.body.erp_presupuesto)
                .input('erp_motivo', mssql.VarChar(250), req.body.erp_motivo)
                .input("subtotal_sin_descuentos", mssql.VarChar(250), req.body.subtotal_sin_descuentos)
                .input('erp_Dsubtotal', mssql.Decimal(18,2), req.body.erp_Dsubtotal)
                .input('erp_Ddescuento', mssql.Decimal(18,4), req.body.erp_Ddescuento)
                .input('erp_Digv', mssql.Decimal(18,2), req.body.erp_Digv)
                .input('erp_Dimporte', mssql.Decimal(18,2), req.body.erp_Dimporte)
                .input('erp_Dpercepcion', mssql.Decimal(18,2), req.body.erp_Dpercepcion)
                .input('erp_Dtotal', mssql.Decimal(18,2), req.body.erp_Dtotal)
                .input('erp_Danticipo', mssql.Decimal(18,2), req.body.anticipo)
                .input('erp_glosa', mssql.VarChar(255), req.body.Glosa)
                .input('erp_gestor', mssql.VarChar(15), req.body.erp_gestor)
                .input('erp_agencia', mssql.VarChar(250), req.body.agencia_transporte)
                .input('erp_ejercon_02', mssql.VarChar(4), req.body.erp_ejercon_02)
                .input('erp_percon_02', mssql.VarChar(8), req.body.erp_percon_02)
                .input('erp_cobsub_02', mssql.VarChar(10), req.body.erp_cobsub_02)
                .input('erp_numcon_02', mssql.VarChar(250), req.body.erp_numcon_02)
                .input('erp_selecc', mssql.VarChar(1), req.body.erp_selecc)
                .input('tipdoc_ref_2', mssql.VarChar(250), req.body.tipdoc_ref_2)
                .input('ptovta_ref_2', mssql.VarChar(3), req.body.ptovta_ref_2)
                .input('motivo_ref_2', mssql.VarChar(250), req.body.motivo_ref_2)
                .input('nro_ref_2', mssql.VarChar(15), req.body.nro_ref_2)
                .input('dfecha_val', mssql.Date, req.body.fecha_validez)
                .input('erp_dfecha_val', mssql.Date, req.body.fecha_validez)
                .input('erp_contacto_vendedor', mssql.VarChar(15), req.body.erp_contacto_vendedor)
                .input('dfecha_hora', mssql.Date, req.body.fecha_doc)
                .input('erp_monto_recaudo', mssql.Decimal(18,2), req.body.erp_monto_recaudo)
                .input('erp_ck_recaudo_sn', mssql.VarChar(1), req.body.erp_ck_recaudo_sn)
                .input('erp_cuenta_recaudo', mssql.VarChar(20), req.body.erp_cuenta_recaudo)
                .input('erp_anexo_recaudo', mssql.VarChar(25), req.body.erp_anexo_recaudo)
                .input('erp_tiporig_recaudo', mssql.VarChar(1), req.body.erp_tiporig_recaudo)
                .input('erp_cod_rubro', mssql.VarChar(18), req.body.erp_cod_rubro)
                .input('estado_fe', mssql.VarChar(20), req.body.estado_fe)
                .input('detalleanulacion', mssql.VarChar(100), req.body.detalle_anulacion)
                .input('fechagen', mssql.Date, req.body.fechagen)
                .input('fechabaja', mssql.Date, req.body.fechabaja)
                .input('tribute_concept', mssql.VarChar(120), req.body.tipo_operacion)
                .input('motivo_nota', mssql.VarChar(120), req.body.motivo_nota)
                .input('cnum_lote', mssql.VarChar(4), req.body.cnum_lote)
                .input('igv_icbper', mssql.Decimal(10,2),req.body.erp_ICBPER)
                .input("numero_expediente1", mssql.VarChar(250), req.body.numero_expediente1)
                .input("numero_expediente2", mssql.VarChar(250), req.body.numero_expediente2)
                .query("Insert Into HMOVIALC ("+
                "ccod_empresa, \n"+
                "ccod_almacen, \n"+
                "ccod_movimiento, \n"+
                "ctip_movimiento, \n"+
                "cnum_serie, \n"+
                "cnum_doc, \n"+
                "dfecha_doc, \n"+
                "nro_dias, \n"+
                "dfecha_entr, \n"+
                "cmoneda, \n"+
                "ccod_forpago, \n"+
                "nsubtotal, \n"+
                "nigv, \n"+
                "nimporte, \n"+
                "anticipo, \n"+
                "erp_impmn, \n"+
                "erp_impme, \n"+
                "costo, \n"+
                "ctip_docref, \n"+
                "cserie_docref, \n"+
                "cnum_docref, \n"+
                "fecha_ref, \n"+
                "ccod_almacend, \n"+
                "ccod_cliente, \n"+
                "cnom_cliente_v, \n"+
                "cnum_ruc_v, \n"+
                "idcliente2, \n"+
                "nombre_cliente2, \n"+
                "ccod_proveedor, \n"+
                "cnom_proveedor_c, \n"+
                "estado, \n"+
                "porcentaje, \n"+
                "atencion, \n"+
                "modulo, \n"+
                "ctipo_cambio, \n"+
                "tipo_cambio, \n"+
                "desc_stock, \n"+
                "ccod_almacen2, \n"+
                "ccod_almacend2, \n"+
                "automatico, \n"+
                "automatico_destino, \n"+
                "serie_destino, \n"+
                "numero_destino, \n"+
                "ccod_responsable, \n"+
                "ccod_vendedor, \n"+
                "idvendedor2, \n"+
                "ccod_transaccion, \n"+
                "erp_codune, \n"+
                "ccod_cencos, \n"+
                "ot, \n"+
                "ccod_vehiculo, \n"+
                "ccod_transportista, \n"+
                "nombre_chofer, \n"+
                "pais, \n"+
                "tipo_venta, \n"+
                "n_orden, \n"+
                "si_igv, \n"+
                "porc_descuento, \n"+
                "motivo_traslado, \n"+
                "lista_precios, \n"+
                "observacion, \n"+
                "glosa, \n"+
                "tipo_comprobante, \n"+
                "serie_comprobante, \n"+
                "numero_comprobante, \n"+
                "fecha_comp, \n"+
                "pto_partida_02, \n"+
                "pto_llegada_02, \n"+
                "ccod_detraccion, \n"+
                "erp_codage, \n"+
                "contabilizada, \n"+
                "serie_guia_prov, \n"+
                "nro_guia_prov, \n"+
                "serie_fac_prov, \n"+
                "nro_fac_prov, \n"+
                "fecha_emision, \n"+
                "usuario, \n"+
                "n_req, \n"+
                "viatipo_partida, \n"+
                "via_nom_partida, \n"+
                "nro_partida, \n"+
                "interior_partida, \n"+
                "zona_partida, \n"+
                "distrito_partida, \n"+
                "prov_partida, \n"+
                "dep_partida, \n"+
                "tip_nro_doc_partida, \n"+
                "viatipo_llegada, \n"+
                "via_nom_llegada, \n"+
                "nro_llegada, \n"+
                "interior_llegada, \n"+
                "zona_llegada, \n"+
                "distrito_llegada, \n"+
                "prov_llegada, \n"+
                "dep_llegada, \n"+
                "tipo_venta_ref, \n"+
                "erp_ejecon, \n"+
                "erp_percon, \n"+
                "erp_codsub, \n"+
                "erp_numcon, \n"+
                "erp_codagente, \n"+
                "erp_costome, \n"+
                "erp_costomn, \n"+
                "pc_user, \n"+
                "pc_fecha, \n"+
                "pc_ip, \n"+
                "erp_cosme, \n"+
                "erp_cosmn, \n"+
                "erp_iteref, \n"+
                "erp_codcaja, \n"+
                "erp_vuelto, \n"+
                "ruta_cont_ped, \n"+
                "erp_presupuesto, \n"+
                "erp_motivo, \n"+
                "subtotal_sin_descuentos,\n"+
                "erp_Dsubtotal, \n"+
                "erp_Ddescuento, \n"+
                "erp_Digv, \n"+
                "erp_Dimporte, \n"+
                "erp_Dpercepcion, \n"+
                "erp_Dtotal, \n"+
                "erp_Danticipo, \n"+
                "erp_glosa, \n"+
                "erp_gestor, \n"+
                "erp_agencia, \n"+
                "erp_ejercon_02, \n"+
                "erp_percon_02, \n"+
                "erp_cobsub_02, \n"+
                "erp_numcon_02, \n"+
                "erp_selecc, \n"+
                "tipdoc_ref_2, \n"+
                "ptovta_ref_2, \n"+
                "motivo_ref_2, \n"+
                "nro_ref_2, \n"+
                "dfecha_val, \n"+
                "erp_dfecha_val, \n"+
                "erp_contacto_vendedor, \n"+
                "dfecha_hora, \n"+
                "erp_monto_recaudo, \n"+
                "erp_ck_recaudo_sn, \n"+
                "erp_cuenta_recaudo, \n"+
                "erp_anexo_recaudo, \n"+
                "erp_tiporig_recaudo, \n"+
                "erp_cod_rubro, \n"+
                "estado_fe, \n"+
                "detalleanulacion, \n"+
                "fechagen, \n"+
                "fechabaja, \n"+
                "tribute_concept, \n"+
                "motivo_nota, \n"+
                "cnum_lote, \n"+
                "igv_icbper,\n"+
                "erp_nro_exp,\n"+
                "erp_nro_exp2 \n" +
                ") values (\n"+
                "@ccod_empresa, \n"+
                "@ccod_almacen, \n"+
                "@ccod_movimiento, \n"+
                "@ctip_movimiento, \n"+
                "@cnum_serie, \n"+
                "@cnum_doc, \n"+
                "@dfecha_doc, \n"+
                "@nro_dias, \n"+
                "@dfecha_entr, \n"+
                "@cmoneda, \n"+
                "@ccod_forpago, \n"+
                "@nsubtotal, \n"+
                "@nigv, \n"+
                "@nimporte, \n"+
                "@anticipo, \n"+
                "@erp_impmn, \n"+
                "@erp_impme, \n"+
                "@costo, \n"+
                "@ctip_docref, \n"+
                "@cserie_docref, \n"+
                "@cnum_docref, \n"+
                "@fecha_ref, \n"+
                "@ccod_almacend, \n"+
                "@ccod_cliente, \n"+
                "@cnom_cliente_v, \n"+
                "@cnum_ruc_v, \n"+
                "@idcliente2, \n"+
                "@nombre_cliente2, \n"+
                "@ccod_proveedor, \n"+
                "@cnom_proveedor_c, \n"+
                "@estado, \n"+
                "@porcentaje, \n"+
                "@atencion, \n"+
                "@modulo, \n"+
                "@ctipo_cambio, \n"+
                "@tipo_cambio, \n"+
                "@desc_stock, \n"+
                "@ccod_almacen2, \n"+
                "@ccod_almacend2, \n"+
                "@automatico, \n"+
                "@automatico_destino, \n"+
                "@serie_destino, \n"+
                "@numero_destino, \n"+
                "@ccod_responsable, \n"+
                "@ccod_vendedor, \n"+
                "@idvendedor2, \n"+
                "@ccod_transaccion, \n"+
                "@erp_codune, \n"+
                "@ccod_cencos, \n"+
                "@ot, \n"+
                "@ccod_vehiculo, \n"+
                "@ccod_transportista, \n"+
                "@nombre_chofer, \n"+
                "@pais, \n"+
                "@tipo_venta, \n"+
                "@n_orden, \n"+
                "@si_igv, \n"+
                "@porc_descuento, \n"+
                "@motivo_traslado, \n"+
                "@lista_precios, \n"+
                "@observacion, \n"+
                "@glosa, \n"+
                "@tipo_comprobante, \n"+
                "@serie_comprobante, \n"+
                "@numero_comprobante, \n"+
                "@fecha_comp, \n"+
                "@pto_partida_02, \n"+
                "@pto_llegada_02, \n"+
                "@ccod_detraccion, \n"+
                "@erp_codage, \n"+
                "@contabilizada, \n"+
                "@serie_guia_prov, \n"+
                "@nro_guia_prov, \n"+
                "@serie_fac_prov, \n"+
                "@nro_fac_prov, \n"+
                "@fecha_emision, \n"+
                "@usuario, \n"+
                "@n_req, \n"+
                "@viatipo_partida, \n"+
                "@via_nom_partida, \n"+
                "@nro_partida, \n"+
                "@interior_partida, \n"+
                "@zona_partida, \n"+
                "@distrito_partida, \n"+
                "@prov_partida, \n"+
                "@dep_partida, \n"+
                "@tip_nro_doc_partida, \n"+
                "@viatipo_llegada, \n"+
                "@via_nom_llegada, \n"+
                "@nro_llegada, \n"+
                "@interior_llegada, \n"+
                "@zona_llegada, \n"+
                "@distrito_llegada, \n"+
                "@prov_llegada, \n"+
                "@dep_llegada, \n"+
                "@tipo_venta_ref, \n"+
                "@erp_ejecon, \n"+
                "@erp_percon, \n"+
                "@erp_codsub, \n"+
                "@erp_numcon, \n"+
                "@erp_codagente, \n"+
                "@erp_costome, \n"+
                "@erp_costomn, \n"+
                "@pc_user, \n"+
                "@pc_fecha, \n"+
                "@pc_ip, \n"+
                "@erp_cosme, \n"+
                "@erp_cosmn, \n"+
                "@erp_iteref, \n"+
                "@erp_codcaja, \n"+
                "@erp_vuelto, \n"+
                "@ruta_cont_ped, \n"+
                "@erp_presupuesto, \n"+
                "@erp_motivo, \n"+
                "@subtotal_sin_descuentos,\n"+
                "@erp_Dsubtotal, \n"+
                "@erp_Ddescuento, \n"+
                "@erp_Digv, \n"+
                "@erp_Dimporte, \n"+
                "@erp_Dpercepcion, \n"+
                "@erp_Dtotal, \n"+
                "@erp_Danticipo, \n"+
                "@erp_glosa, \n"+
                "@erp_gestor, \n"+
                "@erp_agencia, \n"+
                "@erp_ejercon_02, \n"+
                "@erp_percon_02, \n"+
                "@erp_cobsub_02, \n"+
                "@erp_numcon_02, \n"+
                "@erp_selecc, \n"+
                "@tipdoc_ref_2, \n"+
                "@ptovta_ref_2, \n"+
                "@motivo_ref_2, \n"+
                "@nro_ref_2, \n"+
                "@dfecha_val, \n"+
                "@erp_dfecha_val, \n"+
                "@erp_contacto_vendedor, \n"+
                "@dfecha_hora, \n"+
                "@erp_monto_recaudo, \n"+
                "@erp_ck_recaudo_sn, \n"+
                "@erp_cuenta_recaudo, \n"+
                "@erp_anexo_recaudo, \n"+
                "@erp_tiporig_recaudo, \n"+
                "@erp_cod_rubro, \n"+
                "@estado_fe, \n"+
                "@detalleanulacion, \n"+
                "@fechagen, \n"+
                "@fechabaja, \n"+
                "@tribute_concept, \n"+
                "@motivo_nota, \n"+
                "@cnum_lote, \n"+
                "@igv_icbper,\n"+
                "@numero_expediente1,\n"+
                "@numero_expediente2 \n" +
                ")");
                //#endregion

                //#region Registro del detalle
                for (let i= 0; i< filas_detalle.length; i++){
                    rowid = filas_detalle[i];
        
                    var today =  new Date(req.body.fecha_doc.replace("-", "/"));
                    var dd = today.getDate();
                    var mm = today.getMonth()+1; 
                    var yyyy = today.getFullYear();
        
                    today = yyyy+'/'+(mm<10? '0'+mm : mm)+'/'+ (dd<10? '0'+dd : dd);
        
                    var request_stock = new mssql.Request(transaction);
                    var query_stock = await request_stock
                    .input('codigo_empresa', mssql.VarChar(250), codigo_empresa)
                    .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
                    .input('Codigo_Almacen', mssql.VarChar(250), rowid.Codigo_Almacen)
                    .input('Codigo', mssql.VarChar(250), rowid.Codigo)
                    .input('Lote_Numero', mssql.VarChar(250), rowid.Lote_Numero)
                    .input('Lote_Vencimiento', mssql.Date(), rowid.Lote_Vencimiento)  
                    .input('Serie_Numero', mssql.VarChar(250), rowid.Serie_Numero)
                    .query("select ERP_STOART from HSTOCK where ERP_CODEMP=@codigo_empresa and ERP_CODPTV=@codigo_punto_venta and ERP_CODALM=@Codigo_Almacen and ERP_CODART=@Codigo and ERP_LOTART =@Lote_Numero and ERP_VENLOT=@Lote_Vencimiento and ERP_NUMSER=@Serie_Numero");
        
                    var rs_stock_producto = query_stock.recordset;
    
                    if((rowid.Stock_SN =="N" ||  rowid.Stock_SN=="") || (rowid.Stock_SN =="S" && rs_stock_producto.length>0 && rowid.Cantidad_Kardex <= rs_stock_producto[0].ERP_STOART) ){
                        var costo_tipo_documento=req.body.tipo_documento;
                        var costo_serie_documento=req.body.serie;
                        var costo_numero_documento=req.body.numero_correlativo;
                        if(req.body.tipo_documento=="07" && req.body.tipo !="NOTA DE CREDITO DIRECTO"){
                            costo_tipo_documento=req.body.tipo_documento_referencia;
                            costo_serie_documento=req.body.serie_documento_referencia;
                            costo_numero_documento=req.body.numero_documento_referencia;
                        }
                        var request_costo = new mssql.Request(transaction);
                        var query_costo = await request_costo
                        .input('vi_empresa', mssql.VarChar(10), codigo_empresa)
                        .input('vi_pto_venta', mssql.VarChar(3), codigo_punto_venta)
                        .input('vi_almacen', mssql.VarChar(3), rowid.Codigo_Almacen)
                        .input('vi_movimiento', mssql.VarChar(3), costo_tipo_documento)
                        .input('vi_serie', mssql.VarChar(35), costo_serie_documento)
                        .input('vi_numero', mssql.VarChar(35), costo_numero_documento)
                        .input('vi_item', mssql.VarChar(35), rowid.Origen_NItem)
                        .input('vi_articulo', mssql.VarChar(35), rowid.Codigo)
                        .input('vi_lote', mssql.VarChar(35), rowid.Lote_Numero)
                        .input('vi_vencimiento', mssql.Date(), rowid.Lote_Vencimiento)  
                        .input('vi_numero_serie', mssql.VarChar(35), rowid.Serie_Numero)
                        .input('vi_fecha', mssql.Date(), today)// Año / Mes / Dia
                        .input('vi_tipo_doc', mssql.VarChar(35), req.body.tipo_documento)
                        .input('vi_tipo_venta', mssql.VarChar(250), req.body.tipo) 
                        .output('vi_costo_mn', mssql.Decimal(18,8), 0)
                        .output('vi_costo_me', mssql.Decimal(18,8), 0)
                        .execute("sq_execalculo_costo_salida");
                        
                        var rs_costo_producto = query_costo.output;
                        rowid.costo_mn = rs_costo_producto.vi_costo_mn;
                        rowid.costo_me = rs_costo_producto.vi_costo_me;
                        rowid.nitem = i*1+1;
                        var request_detalle = new mssql.Request(transaction);
                        await request_detalle
                        .input('CCOD_EMPRESA', mssql.VarChar(10),codigo_empresa)
                        .input('CCOD_ALMACEN', mssql.VarChar(3),codigo_punto_venta)
                        .input('CCOD_MOVIMIENTO', mssql.VarChar(3),req.body.tipo_documento)
                        .input('CTIP_MOVIMIENTO', mssql.VarChar(10),req.body.tipo_movimiento)
                        .input('CNUM_SERIE', mssql.VarChar(5),req.body.serie)
                        .input('CNUM_DOC', mssql.VarChar(250), numero_correlativo)
                        .input('NITEM', mssql.Int, i+1)
                        .input('CCOD_ARTICULO', mssql.VarChar(35),rowid.Codigo)
                        .input('CNOM_ARTICULO', mssql.VarChar(300),rowid.Nombre)
                        .input('CUNIDAD', mssql.VarChar(250),rowid.Codigo_Unidad)
                        .input('NCANTIDAD3', mssql.Decimal(18,10),rowid.Cantidad)
                        .input('NCANTIDAD', mssql.Decimal(18,10),rowid.Cantidad_Kardex)
                        .input('NPRECIO_TRANS', mssql.Decimal(18,10),rowid.Unit)
                        .input('NBASEIMPON', mssql.Decimal(20,10),rowid.Base_Imponible)
                        .input('base_calculada', mssql.Decimal(18,10),rowid.Base_Calculada)
                        .input('nigvcalc', mssql.Decimal(18,10),rowid.Igv)
                        .input('NIGV', mssql.Decimal(18,10),rowid.Igv_Art)
                        .input('NPRECIO_IMPORTE', mssql.Decimal(18,10),rowid.Importe)
                        .input('E_S', mssql.VarChar(1), req.body.tipo_documento == '07'? 'E': 'S')
                        .input('porc_descuento', mssql.Decimal(18,10),rowid.Desc1)
                        .input('costo_venta', mssql.Decimal(18,10),'0')
                        .input('costo_venta_total', mssql.Decimal(18,10),'0')
                        .input('desc2', mssql.Decimal(18,10),rowid.Desc2)
                        .input('monto_descuento', mssql.Decimal(18,10),rowid.Monto_Descuento)
                        .input('barticulo', mssql.VarChar(1), rowid.Barticulo)
                        .input('blote', mssql.VarChar(1),rowid.Lote_SN)
                        .input('bserie', mssql.VarChar(1),rowid.Serie_SN)
                        .input('ccod_almacen_org', mssql.VarChar(3),rowid.Codigo_Almacen)
                        .input('factor', mssql.Decimal(18,2),rowid.Factor)
                        .input('erp_codune', mssql.VarChar(20),req.body.codigo_unidad_negocio)
                        .input('cc', mssql.VarChar(20),req.body.codigo_centro_costos)
                        .input('ot', mssql.VarChar(20),req.body.orden_trabajo)
                        .input('CNRO_LOTE', mssql.VarChar(20),rowid.Lote_Numero)
                        .input('vcto', mssql.VarChar(250),rowid.Lote_Vencimiento)
                        .input('motivo_pedido', mssql.VarChar(250), rowid.Pedido_Motivo) //Pedido
                        .input('doc_origen_pedido', mssql.VarChar(15), rowid.Pedido_Numero) //Pedido
                        .input('origen_item', mssql.Int, rowid.Pedido_NItem) //Pedido
                        .input('movimiento_origen', mssql.VarChar(3), rowid.Origen_Documento) //Factura o Guía
                        .input('serie_origen', mssql.VarChar(5),rowid.Origen_Serie) //Factura o Guía
                        .input('cnum_doc_guiaventa', mssql.VarChar(15),rowid.Origen_Numero) //Factura o Guía
                        .input('erp_itemref', mssql.Decimal(18,4), req.body.tipo == 'FACTURA PEDIDO'? 0:rowid.Origen_NItem)//Factura o Guía
                        .input('nombre_presentacion', mssql.VarChar(300),rowid.Nombre_presentacion)
                        .input('cantidad_presentacion', mssql.Decimal(18,10), rowid.Cantidad_presentacion)
                        .input('unidad_presentacion', mssql.VarChar(250), rowid.Unidad_presentacion)
                        .input('erp_codage', mssql.VarChar(20),req.body.codigo_agencia)
                        .input('percepcion_uni', mssql.Decimal(18,10),rowid.Percepcion_uni)
                        .input('idmotivo_compra', mssql.VarChar(15),'0')
                        .input('cnum_doc_ordc', mssql.VarChar(15),'0')
                        .input('nro_serie', mssql.VarChar(80),rowid.Serie_Numero)
                        .input('n_req', mssql.VarChar(20),req.body.n_req)
                        .input('bonificacion', mssql.VarChar(1),'N')
                        .input('precio_presentacion', mssql.Decimal(18,10),rowid.Precio_presentacion)
                        .input('precio_original', mssql.Decimal(18,10),rowid.Precio_original == "" ? 0 :rowid.Precio_original)
                        .input('anticipo', mssql.Decimal(18,10),req.body.anticipo)
                        .input('igv_2', mssql.Decimal(18,10),rowid.Igv)
                        .input('importe_2', mssql.Decimal(18,10),rowid.Importe)
                        .input('item_origen', mssql.Decimal(18,4),'0')
                        .input('ccod_interno', mssql.VarChar(35),'')
                        .input('erp_codfab', mssql.VarChar(35),'')
                        .input('erp_cosmn', mssql.Decimal(18,4),rs_costo_producto.vi_costo_mn)
                        .input('erp_cosme', mssql.Decimal(18,4),rs_costo_producto.vi_costo_me)
                        .input('erp_tcref', mssql.Decimal(18,8),'0')
                        .input('erp_iteord', mssql.Int,'0')
                        .input('erp_itereq', mssql.Int,'0')
                        .input('Erp_Tipo_anexo', mssql.VarChar(10),'')
                        .input('Erp_CodAnexo', mssql.VarChar(20),'')
                        .input('Erp_NomAnexo', mssql.VarChar(250),'')
                        .input('dt_aplica', mssql.VarChar(1),'')
                        .input('erp_costmn', mssql.Decimal(18,4),rs_costo_producto.vi_costo_mn)
                        .input('erp_costme', mssql.Decimal(18,4),rs_costo_producto.vi_costo_me)
                        .input('erp_iteref', mssql.Int,req.body.erp_iteref)
                        .input('erp_canana', mssql.Int,'0')
                        .input('item_guia', mssql.Int,'0')
                        .input('desc3', mssql.Decimal(18,4),rowid.Desc3)
                        .input('erp_percepcion_sn', mssql.VarChar(1),rowid.Percepcion_sn)
                        .input('erp_percepcion_uni', mssql.Decimal(18,8),rowid.Percepcion_uni)
                        .input('erp_percepcion_porc', mssql.Decimal(18,2),rowid.Perpecion_porc)
                        .input('erp_boni_sn', mssql.VarChar(1), rowid.Boni_sn)
                        .input('erp_promo_sn', mssql.VarChar(1),'')
                        .input('erp_item_boni', mssql.Int,'0')
                        .input('erp_presupuesto', mssql.VarChar(20),req.body.erp_presupuesto)
                        .input('erp_fabricacion', mssql.Date,'01/01/1900')
                        .input('erp_cta_producccion', mssql.VarChar(20),'')
                        .input('erp_cta_produccion', mssql.VarChar(20),'')
                        .input('erp_peso', mssql.Decimal(18,2),rowid.Peso)
                        .input('erp_largo', mssql.Decimal(18,2),'0')
                        .input('erp_ancho', mssql.Decimal(18,2),'0')
                        .input('erp_desc4', mssql.Decimal(18,4),rowid.Desc4)
                        .input('erp_nro_exp', mssql.VarChar(30),req.body.erp_nro_exp)
                        .input('erp_monto_aplicacion', mssql.Decimal(18,6),'0')
                        .input('tipdoc_ref_2', mssql.VarChar(250),req.body.tipdoc_ref_2)
                        .input('ptovta_ref_2', mssql.VarChar(3),req.body.ptovta_ref_2)
                        .input('motivo_ref_2', mssql.VarChar(250),req.body.motivo_ref_2)
                        .input('nro_ref_2', mssql.VarChar(15),req.body.nro_ref_2)
                        .input('cod_vendedor', mssql.VarChar(15),'')
                        .input('erp_base_calc_dec', mssql.Decimal(18,8),rowid.Base_calculada_dec)
                        .input('erp_base_imp_dec', mssql.Decimal(18,8),rowid.Base_imp_dec)
                        .input('erp_igv_dec', mssql.Decimal(18,8),rowid.Igv_dec)
                        .input('erp_importe_dec', mssql.Decimal(18,8),rowid.Importe_dec)
                        .input('erp_comision_porc', mssql.Decimal(18,2),rowid.Comision_porcentaje)
                        .input('erp_comision_monto', mssql.Decimal(18,9), rowid.Comision_monto)
                        .input('digv_icbper', mssql.Decimal(10,2),rowid.ICBPER)
                        .input('desc_cab', mssql.Decimal(10,2),'0')
                        .input('codigo_presentacion', mssql.VarChar(250),rowid.Codigo_presentacion)
                        .input('peso_total', mssql.Decimal(10,6),'0')
                        .query("INSERT INTO HMOVIALD"+
                        "(CCOD_EMPRESA"+
                        ",CCOD_ALMACEN"+
                        ",CCOD_MOVIMIENTO"+
                        ",CTIP_MOVIMIENTO"+
                        ",CNUM_SERIE"+
                        ",CNUM_DOC"+
                        ",NITEM"+
                        ",CCOD_ARTICULO"+
                        ",CNOM_ARTICULO"+
                        ",CUNIDAD"+
                        ",NCANTIDAD"+
                        ",NCANTIDAD3"+
                        ",NPRECIO_TRANS"+
                        ",NBASEIMPON"+
                        ",base_calculada"+
                        ",nigvcalc"+
                        ",NIGV"+
                        ",NPRECIO_IMPORTE"+
                        ",E_S"+
                        ",porc_descuento"+
                        ",costo_venta"+
                        ",costo_venta_total"+
                        ",desc2"+
                        ",monto_descuento"+
                        ",barticulo"+
                        ",blote"+
                        ",bserie"+
                        ",ccod_almacen_org"+
                        ",factor"+
                        ",erp_codune"+
                        ",cc"+
                        ",ot"+
                        ",CNRO_LOTE"+
                        ",vcto"+
                        ",motivo_pedido"+
                        ",doc_origen_pedido"+
                        ",origen_item"+
                        ",movimiento_origen"+
                        ",serie_origen"+
                        ",cnum_doc_guiaventa"+
                        ",nombre_presentacion"+
                        ",cantidad_presentacion"+
                        ",unidad_presentacion"+
                        ",erp_codage"+
                        ",percepcion_uni"+
                        ",idmotivo_compra"+
                        ",cnum_doc_ordc"+
                        ",nro_serie"+
                        ",n_req"+
                        ",bonificacion"+
                        ",precio_presentacion"+
                        ",precio_original"+
                        ",anticipo"+
                        ",igv_2"+
                        ",importe_2"+
                        ",item_origen"+
                        ",erp_itemref"+
                        ",ccod_interno"+
                        ",erp_codfab"+
                        ",erp_cosmn"+
                        ",erp_cosme"+
                        ",erp_tcref"+
                        ",erp_iteord"+
                        ",erp_itereq"+
                        ",Erp_Tipo_anexo"+
                        ",Erp_CodAnexo"+
                        ",Erp_NomAnexo"+
                        ",dt_aplica"+
                        ",erp_costmn"+
                        ",erp_costme"+
                        ",erp_iteref"+
                        ",erp_canana"+
                        ",item_guia"+
                        ",desc3"+
                        ",erp_percepcion_sn"+
                        ",erp_percepcion_uni"+
                        ",erp_percepcion_porc"+
                        ",erp_boni_sn"+
                        ",erp_promo_sn"+
                        ",erp_item_boni"+
                        ",erp_presupuesto"+
                        ",erp_fabricacion"+
                        ",erp_cta_producccion"+
                        ",erp_cta_produccion"+
                        ",erp_peso"+
                        ",erp_largo"+
                        ",erp_ancho"+
                        ",erp_desc4"+
                        ",erp_nro_exp"+
                        ",erp_monto_aplicacion"+
                        ",tipdoc_ref_2"+
                        ",ptovta_ref_2"+
                        ",motivo_ref_2"+
                        ",nro_ref_2"+
                        ",cod_vendedor"+
                        ",erp_base_calc_dec"+
                        ",erp_base_imp_dec"+
                        ",erp_igv_dec"+
                        ",erp_importe_dec"+
                        ",erp_comision_porc"+
                        ",erp_comision_monto"+
                        ",digv_icbper"+
                        ",desc_cab"+
                        ",codigo_presentacion"+
                        ",peso_total"+
                        ") VALUES ("+
                        " @CCOD_EMPRESA"+
                        ",@CCOD_ALMACEN"+
                        ",@CCOD_MOVIMIENTO"+
                        ",@CTIP_MOVIMIENTO"+
                        ",@CNUM_SERIE"+
                        ",@CNUM_DOC"+
                        ",@NITEM"+
                        ",@CCOD_ARTICULO"+
                        ",@CNOM_ARTICULO"+
                        ",@CUNIDAD"+
                        ",@NCANTIDAD"+
                        ",@NCANTIDAD3"+
                        ",@NPRECIO_TRANS"+
                        ",@NBASEIMPON"+
                        ",@base_calculada"+
                        ",@nigvcalc"+
                        ",@NIGV"+
                        ",@NPRECIO_IMPORTE"+
                        ",@E_S"+
                        ",@porc_descuento"+
                        ",@costo_venta"+
                        ",@costo_venta_total"+
                        ",@desc2"+
                        ",@monto_descuento"+
                        ",@barticulo"+
                        ",@blote"+
                        ",@bserie"+
                        ",@ccod_almacen_org"+
                        ",@factor"+
                        ",@erp_codune"+
                        ",@cc"+
                        ",@ot"+
                        ",@CNRO_LOTE"+
                        ",@vcto"+
                        ",@motivo_pedido"+
                        ",@doc_origen_pedido"+
                        ",@origen_item"+
                        ",@movimiento_origen"+
                        ",@serie_origen"+
                        ",@cnum_doc_guiaventa"+
                        ",@nombre_presentacion"+
                        ",@cantidad_presentacion"+
                        ",@unidad_presentacion"+
                        ",@erp_codage"+
                        ",@percepcion_uni"+
                        ",@idmotivo_compra"+
                        ",@cnum_doc_ordc"+
                        ",@nro_serie"+
                        ",@n_req"+
                        ",@bonificacion"+
                        ",@precio_presentacion"+
                        ",@precio_original"+
                        ",@anticipo"+
                        ",@igv_2"+
                        ",@importe_2"+
                        ",@item_origen"+
                        ",@erp_itemref"+
                        ",@ccod_interno"+
                        ",@erp_codfab"+
                        ",@erp_cosmn"+
                        ",@erp_cosme"+
                        ",@erp_tcref"+
                        ",@erp_iteord"+
                        ",@erp_itereq"+
                        ",@Erp_Tipo_anexo"+
                        ",@Erp_CodAnexo"+
                        ",@Erp_NomAnexo"+
                        ",@dt_aplica"+
                        ",@erp_costmn"+
                        ",@erp_costme"+
                        ",@erp_iteref"+
                        ",@erp_canana"+
                        ",@item_guia"+
                        ",@desc3"+
                        ",@erp_percepcion_sn"+
                        ",@erp_percepcion_uni"+
                        ",@erp_percepcion_porc"+
                        ",@erp_boni_sn"+
                        ",@erp_promo_sn"+
                        ",@erp_item_boni"+
                        ",@erp_presupuesto"+
                        ",@erp_fabricacion"+
                        ",@erp_cta_producccion"+
                        ",@erp_cta_produccion"+
                        ",@erp_peso"+
                        ",@erp_largo"+
                        ",@erp_ancho"+
                        ",@erp_desc4"+
                        ",@erp_nro_exp"+
                        ",@erp_monto_aplicacion"+
                        ",@tipdoc_ref_2"+
                        ",@ptovta_ref_2"+
                        ",@motivo_ref_2"+
                        ",@nro_ref_2"+
                        ",@cod_vendedor"+
                        ",@erp_base_calc_dec"+
                        ",@erp_base_imp_dec"+
                        ",@erp_igv_dec"+
                        ",@erp_importe_dec"+
                        ",@erp_comision_porc"+
                        ",@erp_comision_monto"+
                        ",@digv_icbper"+
                        ",@desc_cab"+
                        ",@codigo_presentacion"+
                        ",@peso_total)");
                    }else{
                        i=filas_detalle.length;
                        documento_saved=false;
                        transaction.rollback(tErr => {if(tErr) {console.log(tErr)} });
                        res.send({estado: false, codigo: 0, mensaje: "No hay suficiente stock para el producto: "+rowid.Codigo});
                    }
                };
                //#endregion
                
                //#region Actualizar Correlativo / Anticpos / Contabilidad
                if(documento_saved){
                    //#region Actualizar Correlativo
                    if(req.body.automatico == "A"){
                        const request_correlativo = new mssql.Request(transaction);
                        await request_correlativo
                        .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                        .input("tip_doc", mssql.VarChar(250), req.body.tipo_documento)
                        .input("cnum_serie", mssql.VarChar(250), req.body.serie)
                        .input("ultimo_grab", mssql.VarChar(250), parseInt(numero_correlativo))
                        .query("update Htalonar set ultimo_grab = @ultimo_grab  where tip_doc = @tip_doc and ccod_empresa = @ccod_empresa and cnum_serie = @cnum_serie ");
                    }
                    //#endregion

                    //#region Guardar Anticipos
                    if (datos_anticipos.length != 0) {
                        for (let i = 0; i < datos_anticipos.length; i++) {
                            rowid = datos_anticipos[i];
                            const request_anticipo = new mssql.Request(transaction);
                            var anticipo = await request_anticipo
                            .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
                            .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
                            .input('ccod_movimiento', mssql.VarChar(3), req.body.tipo_documento)
                            .input('ctip_movimiento', mssql.VarChar(10), req.body.tipo_movimiento)
                            .input('cnum_serie', mssql.VarChar(5), req.body.serie)
                            .input('cnum_doc', mssql.VarChar(250), numero_correlativo)
                            .input('item_doc', mssql.VarChar(250), i+1)
                            .input('Punto_Venta', mssql.VarChar(250), rowid.Punto_Venta )
                            .input('Movimiento', mssql.VarChar(250), rowid.Movimiento)
                            .input('Tipo_Movimiento', mssql.VarChar(250), rowid.Tipo_Movimiento)
                            .input('Serie', mssql.VarChar(250), rowid.Serie)
                            .input('Numero', mssql.VarChar(250), rowid.Numero)
                            .input('Importe', mssql.VarChar(250), rowid.Importe)
                            .query("INSERT INTO ERP_HMOVIALD ( \n"+
                                "ERP_CODEMP , ERP_CODPTV , ERP_CODMOV , ERP_TIPMOV , \n"+
                                "ERP_SERDOC , ERP_NUMDOC , ERP_ITEDOC , ERP_CODPTV2 , \n"+
                                "ERP_CODMOV2 , ERP_TIPMOV2 , \n"+
                                "ERP_SERDOC2 , ERP_NUMDOC2 , ERP_MONDOC ) \n"+
                                "VALUES ( @codigo_empresa , @codigo_punto_venta , @ccod_movimiento , @ctip_movimiento , \n"+
                                "@cnum_serie , @cnum_doc , @item_doc , @Punto_Venta , @Movimiento , \n"+
                                "@Tipo_Movimiento , @Serie , @Numero , @Importe ) ")
            
                        }
                    }
                    //#endregion

                    //#region Obtener información de periodo y del ejercicio
                    var fecha_contabilidad =  new Date(req.body.fecha_doc.replace("-", "/"));
                    var dd = fecha_contabilidad.getDate();
                    var mm = fecha_contabilidad.getMonth()+1; 
                    var yyyy = fecha_contabilidad.getFullYear();
        
                    fecha_contabilidad = yyyy+'/'+(mm<10? '0'+mm : mm)+'/'+ (dd<10? '0'+dd : dd);

                    const request_datos_contables  = new mssql.Request(transaction);
                    result_datos_contables = await request_datos_contables
                    .input("ccod_empresa", mssql.VarChar(10), codigo_empresa)
                    .input("year", mssql.Int ,yyyy)
                    .input("mes", mssql.Int ,mm)
                    .query("SELECT ejercon, periodo_con FROM hpercon WHERE ccod_empresa = @ccod_empresa "+
                    " and year(dfecha_inicio) = @year and month(dfecha_inicio) = @mes and (periodo_con not like 'APE%' and periodo_con not like 'CIE%')");
                    var recordset_datos_contables = result_datos_contables.recordset;
                    var ejercicio = recordset_datos_contables[0].ejercon;
                    var periodo = recordset_datos_contables[0].periodo_con;

                    var valores={
                        SubTotal_Gravado: req.body.erp_Dsubtotal,
                        SubTotal_No_Gravado: 0,
                        Igv: req.body.erp_Digv,
                        Icbper: req.body.erp_ICBPER,
                        Total: req.body.erp_Dtotal,
                        Detraccion: 0,
                        Percepcion: 0,
                        Retencion: 0,
                        Comision: 0,
                        tc: req.body.tasa_cambio,
                        moneda: req.body.moneda,
                    }
                    var calculos_contable = await helpers.getCalculosContables(valores)
                    //#endregion

                    //#region Guardar Contabilidad

                    //#region Generar Correlativo Contabilidad
                    const request_automatico_contabilidad  = new mssql.Request(transaction);
                    const result_automatico_contabilidad = await request_automatico_contabilidad
                    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
                    .input('ejercicio', mssql.VarChar(250), ejercicio)
                    .input('periodo', mssql.VarChar(250), periodo)
                    .input('subvoucher', mssql.VarChar(250), '06')
                    .query(
                        "declare  \n"+
                        "@correlativo int,  \n"+
                        "@contador int,  \n"+
                        "@cantidad_ceros int,  \n"+
                        "@ceros varchar(50),  \n"+
                        "@cnt INT  \n"+
                        "set @cantidad_ceros = 5 \n"+
                        "set @contador = 1  \n"+
                        "set @ceros =''  \n"+
                        "select @correlativo = NUM_ULTCOMP  \n"+
                        "from Hpernume where  \n"+
                        "CCOD_EMPRESA= @codigo_empresa  \n"+
                        "and EJERCON= @ejercicio \n"+
                        "and PERIODO_CON= @periodo  \n"+
                        "and CCOD_SVOUCHER='06' \n"+
                        "set @cnt = LEN(@correlativo)  \n"+
                        "WHILE @cnt < @cantidad_ceros  \n"+
                        "BEGIN  \n"+
                        "SET @ceros = '0'+@ceros  \n"+
                        "SET @cnt = @cnt + 1  \n"+
                        "END  \n"+
                        "while @contador>0  \n"+
                        "begin  \n"+
                        "set @correlativo = @correlativo +1  \n"+
                        "SELECT @contador= COUNT(*)  \n"+
                        "FROM hmovconc  \n"+
                        "WHERE CCOD_EMPRESA= @codigo_empresa   \n"+
                        "AND ejercon= @ejercicio  \n"+
                        "AND periodo_con= @periodo  \n"+
                        "AND ccod_svoucher= @subvoucher  \n"+
                        "AND CNUM_DOC=@ceros+@correlativo  \n"+
                        "set @ceros ='' \n"+
                        "set @cnt = LEN(@correlativo)  \n"+
                        "WHILE @cnt < @cantidad_ceros  \n"+
                        "BEGIN  \n"+
                        "SET @ceros = '0'+@ceros  \n"+
                        "SET @cnt = @cnt + 1  \n"+
                        "END  \n"+
                        "end  \n"+
                        "select @ceros+CONVERT(VARCHAR(50),@correlativo) as correlativo \n"
                    );
        
                    var recordset_automatico_contabilidad = result_automatico_contabilidad.recordset;
                    numero_correlativo_contabilidad = recordset_automatico_contabilidad[0].correlativo;
                    //#endregion
                    
                    //#region Guardar Contabilidad Cabecera
                    const request_contabilidad_cabecera  = new mssql.Request(transaction);
                    await request_contabilidad_cabecera
                    .input('ccod_empresa', mssql.VarChar(250), codigo_empresa)
                    .input('ejercon', mssql.VarChar(250), ejercicio)
                    .input('periodo_con', mssql.VarChar(250), periodo)
                    .input('ccod_svoucher', mssql.VarChar(250), '06')
                    .input('cnum_doc', mssql.VarChar(250), numero_correlativo_contabilidad)
                    .input('automatico', mssql.VarChar(250), 'A')
                    .input('dfecha_doc', mssql.Date, req.body.fecha_doc)
                    .input('fecha_referencia', mssql.Date, req.body.fecha_referencia)
                    .input('tipo2', mssql.VarChar(250), req.body.tipo_documento_referencia)
                    .input('serie2', mssql.VarChar(250), req.body.serie_documento_referencia)
                    .input('numero2', mssql.VarChar(250), req.body.numero_documento_referencia)
                    .input('dfecha_docref', mssql.Date, req.body.fecha_doc)
                    .input('ctip_docref', mssql.VarChar(250), req.body.tipo_documento)
                    .input('cserie_docref', mssql.VarChar(250), req.body.serie)
                    .input('cnum_docref', mssql.VarChar(250), numero_correlativo)
                    .input('ctip_auxiliar', mssql.VarChar(250), '12')
                    .input('ccod_anexo', mssql.VarChar(250), req.body.codigo_cliente)
                    .input('cnom_anexo', mssql.VarChar(250), req.body.nombre_cliente)
                    .input('cmoneda', mssql.VarChar(250), req.body.moneda)
                    .input('ctip_cambio', mssql.VarChar(250), req.body.tipo_cambio)
                    .input('tipo_cambio', mssql.VarChar(250), req.body.tasa_cambio)
                    .input('tc_ref', mssql.VarChar(250), '0')
                    .input('tipo_registro', mssql.VarChar(250), 'RV')
                    .input('glosa', mssql.VarChar(250), req.body.Glosa == ""?'Por la Venta': req.body.Glosa)
                    .input('estado', mssql.VarChar(250), req.body.estado)
                    .input('dest_operacion', mssql.VarChar(250), '001')
                    .input('modulo_origen', mssql.VarChar(250), 'FACTURACION')
                    .input('a_dua', mssql.VarChar(250), '')
                    .input('mnbaseimpgrav', mssql.VarChar(250), req.body.erp_Dsubtotal)
                    .input('mnbaseimpnograv', mssql.VarChar(250), '0')
                    .input('mnigvgrav', mssql.VarChar(250), req.body.erp_Digv)
                    .input('nimporte', mssql.VarChar(250), req.body.erp_Dimporte)
                    .input('otros_tributos', mssql.VarChar(250), '0')
                    .input('ventas_diferidas', mssql.VarChar(250), '0')
                    .input('base_con_mn', mssql.VarChar(250), calculos_contable.SubTotal_Gravado_MN)
                    .input('base_sin_mn', mssql.VarChar(250), calculos_contable.SubTotal_No_Gravado_MN)
                    .input('igv_mn', mssql.VarChar(250), calculos_contable.Igv_MN)
                    .input('otros_mn', mssql.VarChar(250), '0')
                    .input('importe_mn', mssql.VarChar(250), calculos_contable.Total_MN)
                    .input('detraccion_mn', mssql.VarChar(250), '0')
                    .input('venta_diferida_mn', mssql.VarChar(250), '0')
                    .input('base_con_me', mssql.VarChar(250), calculos_contable.SubTotal_Gravado_ME)
                    .input('base_sin_me', mssql.VarChar(250), calculos_contable.SubTotal_No_Gravado_ME)
                    .input('igv_me', mssql.VarChar(250), calculos_contable.Igv_ME)
                    .input('otros_me', mssql.VarChar(250), '0')
                    .input('importe_me', mssql.VarChar(250), calculos_contable.Total_ME)
                    .input('detraccion_me', mssql.VarChar(250), '0')
                    .input('venta_diferida_me', mssql.VarChar(250), '0')
                    .input('dfecha_venc', mssql.Date, req.body.fecha_validez)
                    .input('detraccion_sn', mssql.VarChar(250), 'N')
                    .input('ccod_detraccion', mssql.VarChar(250), req.body.codigo_detraccion)
                    .input('numero_dt', mssql.VarChar(250), '')
                    .input('fecha_dt', mssql.Date, '1900/01/01')
                    .input('cnum_ctacte', mssql.VarChar(250), '00')
                    .input('ing_egr', mssql.VarChar(250), 'ING')
                    .input('caj_ban', mssql.VarChar(250), 'CAJ')
                    .input('n_planilla', mssql.VarChar(250), '')
                    .input('cobrador', mssql.VarChar(250), '00')
                    .input('SN_diferida', mssql.VarChar(250), 'N')
                    .input('fecha_diferida', mssql.Date, '1900/01/01')
                    .input('fecha_ref2', mssql.Date, '1900/01/01')
                    .input('erp_forpag', mssql.VarChar(250), req.body.forma_pago)
                    .input('erp_percepcion_mn', mssql.VarChar(250), 0)
                    .input('erp_percepcion_me', mssql.VarChar(250), 0)
                    .input('erp_cierre_caj_s_n', mssql.VarChar(250), 'N')
                    .input('erp_resp_cierre', mssql.VarChar(250), '00')
                    .input('erp_fecha_cierre', mssql.Date, '1900/01/01')
                    .input('erp_observacion_cierre', mssql.VarChar(250), '')
                    .input('erp_responsable', mssql.VarChar(250), '00')
                    .input('pc_user', mssql.VarChar(250), '')
                    .input('pc_fecha', mssql.VarChar(250), req.body.fecha_doc)
                    .input('pc_ip', mssql.VarChar(250), '')
                    .input('erp_porcentaje_percep', mssql.VarChar(250), '4')
                    .input('erp_porcent_igv', mssql.VarChar(250), '0')
                    .input('erp_nro_dias', mssql.VarChar(250), '0')
                    .input('erp_porcent_detraccion', mssql.VarChar(250), '0')
                    .input('erp_percepcion_sn', mssql.VarChar(250), 'N')
                    .input('erp_porc_percep', mssql.VarChar(250), '0')
                    .input('erp_reten_mn', mssql.VarChar(250), '0')
                    .input('erp_reten_me', mssql.VarChar(250), '0')
                    .input('erp_descuento_mn', mssql.VarChar(250), '0')
                    .input('erp_descuento_me', mssql.VarChar(250), '0')
                    .input('erp_comision_mn', mssql.VarChar(250), '0')
                    .input('erp_comision_me', mssql.VarChar(250), '0')
                    .input('erp_retencion_sn', mssql.VarChar(250), 'N')
                    .input('erp_porc_retencion', mssql.VarChar(250), '0')
                    .input('erp_serie_ne_ref', mssql.VarChar(250), '')
                    .input('erp_numer_ne_ref', mssql.VarChar(250), '')
                    .input('usuario', mssql.VarChar(250), usuario)
                    .input('erp_tipo_aporte', mssql.VarChar(250), '')
                    .input('erp_afp', mssql.VarChar(250), '')
                    .input('erp_nro_cups', mssql.VarChar(250), '')
                    .input('erp_flujo_mixta', mssql.VarChar(250), '')
                    .input('erp_motivo_venta', mssql.VarChar(250), '01')
                    .input('erp_dsubtotal', mssql.VarChar(250), '0')
                    .input('erp_ddescuento', mssql.VarChar(250), '0')
                    .input('erp_digv', mssql.VarChar(250), '0')
                    .input('erp_dimporte', mssql.VarChar(250), '0')
                    .input('erp_dpercepcion', mssql.VarChar(250), '0')
                    .input('erp_dtotal', mssql.VarChar(250), '0')
                    .input('erp_gestor', mssql.VarChar(250), '00')
                    .input('erp_usuario', mssql.VarChar(250), usuario)
                    .input('nombre_pc', mssql.VarChar(250), '')
                    .input('Fecha_Pc', mssql.VarChar(250), req.body.Pc_Fecha)
                    .input('Ip_pc', mssql.VarChar(250), '')
                    .input('clasif_bien_servicio', mssql.VarChar(250), '')
                    .input('ccod_retencion_no_domic', mssql.VarChar(250),  '')
                    .input('retencion_no_domic_sn', mssql.VarChar(250), '')
                    .input('retencion_no_domic_mn', mssql.VarChar(250), '0')
                    .input('retencion_no_domic_me', mssql.VarChar(250), '0')
                    .input('erp_porcent_retencion_no_domic', mssql.VarChar(250), '0')
                    .input('saldo_actual_caja', mssql.VarChar(250), '0')
                    .input('icbper', mssql.VarChar(250), req.body.erp_ICBPER)
                    .input('icbper_mn', mssql.VarChar(250), calculos_contable.Icbper_MN)
                    .input('icbper_me', mssql.VarChar(250), calculos_contable.Icbper_ME)
                    .input('ruta_pdf', mssql.VarChar(250), '')
                    .query("Insert Into hmovconc ("+
                        "ccod_empresa, \n"+
                        "ejercon, \n"+
                        "periodo_con, \n"+
                        "ccod_svoucher, \n"+
                        "cnum_doc, \n"+
                        "automatico, \n"+
                        "dfecha_doc, \n"+
                        "fecha_referencia, \n"+
                        "tipo2, \n"+
                        "serie2, \n"+
                        "numero2, \n"+
                        "dfecha_docref, \n"+
                        "ctip_docref, \n"+
                        "cserie_docref, \n"+
                        "cnum_docref, \n"+
                        "ctip_auxiliar, \n"+
                        "ccod_anexo, \n"+
                        "cnom_anexo, \n"+
                        "cmoneda, \n"+
                        "ctip_cambio, \n"+
                        "tipo_cambio, \n"+
                        "tc_ref, \n"+
                        "tipo_registro, \n"+
                        "glosa, \n"+
                        "estado, \n"+
                        "dest_operacion, \n"+
                        "modulo_origen, \n"+
                        "a_dua, \n"+
                        "mnbaseimpgrav, \n"+
                        "mnbaseimpnograv, \n"+
                        "mnigvgrav, \n"+
                        "nimporte, \n"+
                        "otros_tributos, \n"+
                        "ventas_diferidas, \n"+
                        "base_con_mn, \n"+
                        "base_sin_mn, \n"+
                        "igv_mn, \n"+
                        "otros_mn, \n"+
                        "importe_mn, \n"+
                        "detraccion_mn, \n"+
                        "venta_diferida_mn, \n"+
                        "base_con_me, \n"+
                        "base_sin_me, \n"+
                        "igv_me, \n"+
                        "otros_me, \n"+
                        "importe_me, \n"+
                        "detraccion_me, \n"+
                        "venta_diferida_me, \n"+
                        "dfecha_venc, \n"+
                        "detraccion_sn, \n"+
                        "ccod_detraccion, \n"+
                        "numero_dt, \n"+
                        "fecha_dt, \n"+
                        "cnum_ctacte, \n"+
                        "ing_egr, \n"+
                        "caj_ban, \n"+
                        "n_planilla, \n"+
                        "cobrador, \n"+
                        "SN_diferida, \n"+
                        "fecha_diferida, \n"+
                        "fecha_ref2, \n"+
                        "erp_forpag, \n"+
                        "erp_percepcion_mn, \n"+
                        "erp_percepcion_me, \n"+
                        "erp_cierre_caj_s_n, \n"+
                        "erp_resp_cierre, \n"+
                        "erp_fecha_cierre, \n"+
                        "erp_observacion_cierre, \n"+
                        "erp_responsable, \n"+
                        "pc_user, \n"+
                        "pc_fecha, \n"+
                        "pc_ip, \n"+
                        "erp_porcentaje_percep, \n"+
                        "erp_porcent_igv, \n"+
                        "erp_nro_dias, \n"+
                        "erp_porcent_detraccion, \n"+
                        "erp_percepcion_sn, \n"+
                        "erp_porc_percep, \n"+
                        "erp_reten_mn, \n"+
                        "erp_reten_me, \n"+
                        "erp_descuento_mn, \n"+
                        "erp_descuento_me, \n"+
                        "erp_comision_mn, \n"+
                        "erp_comision_me, \n"+
                        "erp_retencion_sn, \n"+
                        "erp_porc_retencion, \n"+
                        "erp_serie_ne_ref, \n"+
                        "erp_numer_ne_ref, \n"+
                        "usuario, \n"+
                        "erp_tipo_aporte, \n"+
                        "erp_afp, \n"+
                        "erp_nro_cups, \n"+
                        "erp_flujo_mixta, \n"+
                        "erp_motivo_venta, \n"+
                        "erp_dsubtotal, \n"+
                        "erp_ddescuento, \n"+
                        "erp_digv, \n"+
                        "erp_dimporte, \n"+
                        "erp_dpercepcion, \n"+
                        "erp_dtotal, \n"+
                        "erp_gestor, \n"+
                        "erp_usuario, \n"+
                        "nombre_pc, \n"+
                        "Fecha_Pc, \n"+
                        "Ip_pc, \n"+
                        "clasif_bien_servicio, \n"+
                        "ccod_retencion_no_domic, \n"+
                        "retencion_no_domic_sn, \n"+
                        "retencion_no_domic_mn, \n"+
                        "retencion_no_domic_me, \n"+
                        "erp_porcent_retencion_no_domic, \n"+
                        "saldo_actual_caja, \n"+
                        "icbper, \n"+
                        "icbper_mn, \n"+
                        "icbper_me, \n"+
                        "ruta_pdf \n"+
                        ") values ( \n"+
                        '@ccod_empresa, \n'+
                        '@ejercon, \n'+
                        '@periodo_con, \n'+
                        '@ccod_svoucher, \n'+
                        '@cnum_doc, \n'+
                        '@automatico, \n'+
                        '@dfecha_doc, \n'+
                        '@fecha_referencia, \n'+
                        '@tipo2, \n'+
                        '@serie2, \n'+
                        '@numero2, \n'+
                        '@dfecha_docref, \n'+
                        '@ctip_docref, \n'+
                        '@cserie_docref, \n'+
                        '@cnum_docref, \n'+
                        '@ctip_auxiliar, \n'+
                        '@ccod_anexo, \n'+
                        '@cnom_anexo, \n'+
                        '@cmoneda, \n'+
                        '@ctip_cambio, \n'+
                        '@tipo_cambio, \n'+
                        '@tc_ref, \n'+
                        '@tipo_registro, \n'+
                        '@glosa, \n'+
                        '@estado, \n'+
                        '@dest_operacion, \n'+
                        '@modulo_origen, \n'+
                        '@a_dua, \n'+
                        '@mnbaseimpgrav, \n'+
                        '@mnbaseimpnograv, \n'+
                        '@mnigvgrav, \n'+
                        '@nimporte, \n'+
                        '@otros_tributos, \n'+
                        '@ventas_diferidas, \n'+
                        '@base_con_mn, \n'+
                        '@base_sin_mn, \n'+
                        '@igv_mn, \n'+
                        '@otros_mn, \n'+
                        '@importe_mn, \n'+
                        '@detraccion_mn, \n'+
                        '@venta_diferida_mn, \n'+
                        '@base_con_me, \n'+
                        '@base_sin_me, \n'+
                        '@igv_me, \n'+
                        '@otros_me, \n'+
                        '@importe_me, \n'+
                        '@detraccion_me, \n'+
                        '@venta_diferida_me, \n'+
                        '@dfecha_venc, \n'+
                        '@detraccion_sn, \n'+
                        '@ccod_detraccion, \n'+
                        '@numero_dt, \n'+
                        '@fecha_dt, \n'+
                        '@cnum_ctacte, \n'+
                        '@ing_egr, \n'+
                        '@caj_ban, \n'+
                        '@n_planilla, \n'+
                        '@cobrador, \n'+
                        '@SN_diferida, \n'+
                        '@fecha_diferida, \n'+
                        '@fecha_ref2, \n'+
                        '@erp_forpag, \n'+
                        '@erp_percepcion_mn, \n'+
                        '@erp_percepcion_me, \n'+
                        '@erp_cierre_caj_s_n, \n'+
                        '@erp_resp_cierre, \n'+
                        '@erp_fecha_cierre, \n'+
                        '@erp_observacion_cierre, \n'+
                        '@erp_responsable, \n'+
                        '@pc_user, \n'+
                        '@pc_fecha, \n'+
                        '@pc_ip, \n'+
                        '@erp_porcentaje_percep, \n'+
                        '@erp_porcent_igv, \n'+
                        '@erp_nro_dias, \n'+
                        '@erp_porcent_detraccion, \n'+
                        '@erp_percepcion_sn, \n'+
                        '@erp_porc_percep, \n'+
                        '@erp_reten_mn, \n'+
                        '@erp_reten_me, \n'+
                        '@erp_descuento_mn, \n'+
                        '@erp_descuento_me, \n'+
                        '@erp_comision_mn, \n'+
                        '@erp_comision_me, \n'+
                        '@erp_retencion_sn, \n'+
                        '@erp_porc_retencion, \n'+
                        '@erp_serie_ne_ref, \n'+
                        '@erp_numer_ne_ref, \n'+
                        '@usuario, \n'+
                        '@erp_tipo_aporte, \n'+
                        '@erp_afp, \n'+
                        '@erp_nro_cups, \n'+
                        '@erp_flujo_mixta, \n'+
                        '@erp_motivo_venta, \n'+
                        '@erp_dsubtotal, \n'+
                        '@erp_ddescuento, \n'+
                        '@erp_digv, \n'+
                        '@erp_dimporte, \n'+
                        '@erp_dpercepcion, \n'+
                        '@erp_dtotal, \n'+
                        '@erp_gestor, \n'+
                        '@erp_usuario, \n'+
                        '@nombre_pc, \n'+
                        '@Fecha_Pc, \n'+
                        '@Ip_pc, \n'+
                        '@clasif_bien_servicio, \n'+
                        '@ccod_retencion_no_domic, \n'+
                        '@retencion_no_domic_sn, \n'+
                        '@retencion_no_domic_mn, \n'+
                        '@retencion_no_domic_me, \n'+
                        '@erp_porcent_retencion_no_domic, \n'+
                        '@saldo_actual_caja, \n'+
                        '@icbper, \n'+
                        '@icbper_mn, \n'+
                        '@icbper_me, \n'+
                        '@ruta_pdf) \n'
                    );
                    //#endregion
                    
                    //#region Guardar Contabilidad Detalle
                    
                    var fila_contable=[];

                    //#region Cuenta de Venta del Grupo Cliente
                    const request_contabilidad_detalle_cuenta_factura  = new mssql.Request(transaction);
                    const result_contabilidad_detalle_cuenta_factura = await request_contabilidad_detalle_cuenta_factura
                    .input('codigo_empresa',mssql.VarChar(250), codigo_empresa)
                    .input('tipo',mssql.VarChar(250), '12')
                    .input('codigo',mssql.VarChar(250), req.body.codigo_cliente)
                    .input('moneda',mssql.VarChar(250), req.body.moneda)
                    .query(
                        "Select \n"+
                        "ERP_CTAGRU.erp_ctagru as Cuenta,  \n"+
                        "Hplancon.cnom_cuenta as Nombre, \n"+
                        "Hplancon.dh as D_H \n"+
                        "From hanexos Inner Join ERP_CTAGRU On \n"+
                        "hanexos.ccod_empresa = ERP_CTAGRU.ERP_CODEMP  \n"+
                        "And hanexos.ctip_auxiliar = ERP_CTAGRU.ERP_TIPGRU  \n"+
                        "And hanexos.cgrupo_cliente = ERP_CTAGRU.ERP_CODGRU \n"+
                        "Inner Join Hplancon On \n"+
                        "ERP_CTAGRU.ERP_CODEMP = Hplancon.ccod_empresa  \n"+
                        "And ERP_CTAGRU.erp_ctagru = Hplancon.ccuenta \n"+
                        "Where  \n"+
                        "hanexos.ccod_empresa = @codigo_empresa  \n"+
                        "And hanexos.ctip_auxiliar = @tipo  \n"+
                        "And hanexos.ccod_anexo = @codigo  \n"+
                        "and ERP_CTAGRU.erp_moncta = @moneda  \n"+
                        "And ERP_CTAGRU.ERP_TIPCTA = 'CTA' \n"
                    );
                    var recordset_contabilidad_detalle_cuenta_factura = result_contabilidad_detalle_cuenta_factura.recordset[0];
                    fila_contable.push({
                        cuenta_codigo : recordset_contabilidad_detalle_cuenta_factura.Cuenta,
                        tipo_auxiliar : '12',
                        codigo_auxiliar : req.body.codigo_cliente,
                        nombre_auxiliar : req.body.nombre_cliente,
                        debe : req.body.tipo_documento == "07" ? 0 : calculos_contable.Total,
                        debe_mn : req.body.tipo_documento == "07" ? 0 : calculos_contable.Total_MN,
                        debe_me : req.body.tipo_documento == "07" ? 0 : calculos_contable.Total_ME,
                        haber : req.body.tipo_documento == "07" ? calculos_contable.Total : 0,
                        haber_mn : req.body.tipo_documento == "07" ? calculos_contable.Total_MN : 0,
                        haber_me : req.body.tipo_documento == "07" ? calculos_contable.Total_ME : 0,
                        d_h : req.body.tipo_documento == "07" ? 'H' : 'D',
                        Si_Diferencia : 'N',
                        Si_Transferencia : 'N',
                        Tipo_Origen : 'I',
                        Si_Detraccion : 'N',
                        Si_Retencion : 'N',
                        Si_Percepcion : 'N',
                        Producto_Codigo : '',
                        Producto_Item : '0',
                    });
                    //#endregion

                    //#region Cuentas para los anticipos de una factura
                
                    //12 Anticipo, tambien se usará si es que la factura es de anticipo
                    const request_contabilidad_detalle_cuenta_anticipo  = new mssql.Request(transaction);
                    const result_contabilidad_detalle_cuenta_anticipo = await request_contabilidad_detalle_cuenta_anticipo
                    .input('codigo_empresa',mssql.VarChar(250), codigo_empresa)
                    .input('tipo',mssql.VarChar(250), '12')
                    .input('codigo',mssql.VarChar(250), req.body.codigo_cliente)
                    .input('moneda',mssql.VarChar(250), req.body.moneda)
                    .query(
                        "Select \n"+
                        "ERP_CTAGRU.erp_ctagru as Cuenta,  \n"+
                        "Hplancon.cnom_cuenta as Nombre, \n"+
                        "Hplancon.dh as D_H \n"+
                        "From hanexos Inner Join ERP_CTAGRU On \n"+
                        "hanexos.ccod_empresa = ERP_CTAGRU.ERP_CODEMP  \n"+
                        "And hanexos.ctip_auxiliar = ERP_CTAGRU.ERP_TIPGRU  \n"+
                        "And hanexos.cgrupo_cliente = ERP_CTAGRU.ERP_CODGRU \n"+
                        "Inner Join Hplancon On \n"+
                        "ERP_CTAGRU.ERP_CODEMP = Hplancon.ccod_empresa  \n"+
                        "And ERP_CTAGRU.erp_ctagru = Hplancon.ccuenta \n"+
                        "Where  \n"+
                        "hanexos.ccod_empresa = @codigo_empresa  \n"+
                        "And hanexos.ctip_auxiliar = @tipo  \n"+
                        "And hanexos.ccod_anexo = @codigo  \n"+
                        "and ERP_CTAGRU.erp_moncta = @moneda  \n"+
                        "And ERP_CTAGRU.ERP_TIPCTA = 'ANT' \n"
                    );
                    var recordset_contabilidad_detalle_cuenta_anticipo = result_contabilidad_detalle_cuenta_anticipo.recordset[0];



                    for(var i= 0;i<datos_anticipos.length;i++){

                        var anticipo=datos_anticipos[i];
                        // console.log( datos_anticipos);
                        
                        // datos_anticipos.Serie
                        // datos_anticipos.Numero
                        // datos_anticipos.fecha_doc
                        // datos_anticipos.Moneda
                        // datos_anticipos.Sub_Total
                        // datos_anticipos.Igv
                        // datos_anticipos.Importe
                        // datos_anticipos.Movimiento
                        // datos_anticipos.tipo_movimiento
                        // datos_anticipos.punto_venta
                        
                        var calculos_mn_me = await helpers.getCalculosMnMe({
                            Monto: req.body.moneda=="S/" ? anticipo.Sub_Total : anticipo.Sub_Total_Dolares,
                            // Monto_Soles : anticipo.Sub_Total,
                            // Monto_Dolares : anticipo.Sub_Total_Dolares,
                            Tc : req.body.tasa_cambio,
                            Moneda : req.body.moneda,
                            D_H: req.body.tipo_documento == "07" ? 'H' : 'D',
                        })

                        fila_contable.push({
                            cuenta_codigo : recordset_contabilidad_detalle_cuenta_anticipo.Cuenta,
                            tipo_auxiliar : '12',
                            codigo_auxiliar : req.body.codigo_cliente,
                            nombre_auxiliar : req.body.nombre_cliente,
                            debe : req.body.tipo_documento == "07" ? 0 : calculos_mn_me.Debe ,
                            debe_mn : req.body.tipo_documento == "07" ? 0 : calculos_mn_me.Debe_MN ,
                            debe_me : req.body.tipo_documento == "07" ? 0 : calculos_mn_me.Debe_ME ,
                            haber : req.body.tipo_documento == "07" ? calculos_mn_me.Haber : 0,
                            haber_mn : req.body.tipo_documento == "07" ? calculos_mn_me.Haber_MN : 0,
                            haber_me : req.body.tipo_documento == "07" ? calculos_mn_me.Haber_ME : 0,
                            d_h : req.body.tipo_documento == "07" ? 'H' : 'D',
                            Si_Diferencia : 'N',
                            Si_Transferencia : 'N',
                            Tipo_Origen : 'N',
                            Si_Detraccion : 'N',
                            Si_Retencion : 'N',
                            Si_Percepcion : 'N',
                            Producto_Codigo : '',
                            Producto_Item : '0',
                            Tipo_Documento: anticipo.tipo_movimiento,
                            Serie_Documento: anticipo.Serie,
                            Numero_Documento: anticipo.Numero,
                            Fecha_Documento: anticipo.fecha_doc,
                            Tipo_Documento_Referencia: '00',
                            Serie_Documento_Referencia: ' ',
                            Numero_Documento_Referencia: ' ',
                            Fecha_Documento_Referencia: req.body.fecha_doc,
                        });
                    }

                    //#endregion

                    //#region Cuenta de IGV del SubVoucher
                    const request_contabilidad_detalle_cuenta_igv  = new mssql.Request(transaction);
                    const result_contabilidad_detalle_cuenta_igv = await request_contabilidad_detalle_cuenta_igv
                    .input('codigo_empresa',mssql.VarChar(250), codigo_empresa)
                    .input('moneda',mssql.VarChar(250), req.body.moneda)
                    .query(
                        "Select  \n"+
                        "Hplancon.ccuenta as Cuenta,  \n"+
                        "Hplancon.cnom_cuenta as Nombre, \n"+
                        "Hplancon.dh as D_H \n"+
                        "from hsubvoud \n"+
                        "Inner Join Hplancon On \n"+
                        "hsubvoud.ccod_empresa = Hplancon.ccod_empresa  \n"+
                        "And hsubvoud.ccuenta = Hplancon.ccuenta \n"+
                        "where  \n"+
                        "hsubvoud.ccod_empresa = @codigo_empresa  \n"+
                        "and hsubvoud.ccod_svoucher = '06'  \n"+
                        "and hsubvoud.cmoneda = @moneda  \n"+
                        "and hsubvoud.ccuenta like '40%' "
                    );

                    var recordset_contabilidad_detalle_cuenta_igv = result_contabilidad_detalle_cuenta_igv.recordset[0];

                    //40 IGV
                    fila_contable.push({
                        cuenta_codigo : recordset_contabilidad_detalle_cuenta_igv.Cuenta,
                        tipo_auxiliar : '00',
                        codigo_auxiliar : '',
                        nombre_auxiliar : '',
                        debe : req.body.tipo_documento == "07" ? calculos_contable.Igv : 0,
                        debe_mn : req.body.tipo_documento == "07" ? calculos_contable.Igv_MN : 0,
                        debe_me : req.body.tipo_documento == "07" ? calculos_contable.Igv_ME : 0,
                        haber : req.body.tipo_documento == "07" ? 0 : calculos_contable.Igv,
                        haber_mn : req.body.tipo_documento == "07" ? 0 : calculos_contable.Igv_MN,
                        haber_me : req.body.tipo_documento == "07" ? 0 : calculos_contable.Igv_ME,
                        d_h : req.body.tipo_documento == "07" ? 'D' : 'H',
                        Si_Diferencia : 'N',
                        Si_Transferencia : 'N',
                        Tipo_Origen : 'N',
                        Si_Detraccion : 'N',
                        Si_Retencion : 'N',
                        Si_Percepcion : 'N',
                        Producto_Codigo : '',
                        Producto_Item : '0',
                    });
                    //#endregion

                    //#region Cuenta de ICBPER 
                    //40 ICBPER
                    if(req.body.erp_ICBPER > 0) {
                        
                        var request_contabilidad_detalle_cuenta_icbper  = new mssql.Request(transaction);
                        var result_contabilidad_detalle_cuenta_icbper = await request_contabilidad_detalle_cuenta_icbper
                        .input('codigo_empresa',mssql.VarChar(250), codigo_empresa)
                        .input('codigo',mssql.VarChar(250), rowid.Codigo)
                        .query(
                            "Select \n"+
                            "cta_icbper as Cuenta  \n"+
                            "from hparameter \n"+
                            "Where \n"+
                            "hparameter.ccod_empresa = @codigo_empresa \n"
                        );

                        var recordset_contabilidad_detalle_cuenta_icbper = result_contabilidad_detalle_cuenta_icbper.recordset[0];

                        fila_contable.push({
                            cuenta_codigo : recordset_contabilidad_detalle_cuenta_icbper.Cuenta,
                            tipo_auxiliar : '00',
                            codigo_auxiliar : '',
                            nombre_auxiliar : '',
                            debe : req.body.tipo_documento == "07" ? calculos_contable.Icbper : 0,
                            debe_mn : req.body.tipo_documento == "07" ? calculos_contable.Icbper_MN : 0,
                            debe_me : req.body.tipo_documento == "07" ? calculos_contable.Icbper_ME : 0,
                            haber : req.body.tipo_documento == "07" ? 0 : calculos_contable.Icbper,
                            haber_mn : req.body.tipo_documento == "07" ? 0 : calculos_contable.Icbper_MN,
                            haber_me : req.body.tipo_documento == "07" ? 0 : calculos_contable.Icbper_ME,
                            d_h : req.body.tipo_documento == "07" ? 'D' : 'H',
                            Si_Diferencia : 'N',
                            Si_Transferencia : 'N',
                            Tipo_Origen : 'N',
                            Si_Detraccion : 'N',
                            Si_Retencion : 'N',
                            Si_Percepcion : 'N',
                            Producto_Codigo : '',
                            Producto_Item : '0',
                        });
                    }
                    //#endregion

                    if(req.body.tipo == "ANTICIPO"){

                        //#region Cuenta de Anticipo del Grupo cliente
                                                
                        fila_contable.push({
                            cuenta_codigo : recordset_contabilidad_detalle_cuenta_anticipo.Cuenta,
                            tipo_auxiliar : '12',
                            codigo_auxiliar : req.body.codigo_cliente,
                            nombre_auxiliar : req.body.nombre_cliente,
                            debe : req.body.tipo_documento == "07" ? calculos_contable.SubTotal_Gravado : 0,
                            debe_mn : req.body.tipo_documento == "07" ? calculos_contable.SubTotal_Gravado_MN : 0,
                            debe_me : req.body.tipo_documento == "07" ? calculos_contable.SubTotal_Gravado_ME : 0,
                            haber : req.body.tipo_documento == "07" ? 0 : calculos_contable.SubTotal_Gravado,
                            haber_mn : req.body.tipo_documento == "07" ? 0 : calculos_contable.SubTotal_Gravado_MN,
                            haber_me : req.body.tipo_documento == "07" ? 0 : calculos_contable.SubTotal_Gravado_ME,
                            d_h : req.body.tipo_documento == "07" ? 'D' : 'H',
                            Si_Diferencia : 'N',
                            Si_Transferencia : 'N',
                            Tipo_Origen : 'N',
                            Si_Detraccion : 'N',
                            Si_Retencion : 'N',
                            Si_Percepcion : 'N',
                            Producto_Codigo : '',
                            Producto_Item : '0',
                        });
                        //#endregion
                    
                    
                    }else{

                        //#region Cuenta de los productos
                        for (let i= 0; i< filas_detalle.length; i++){
                            rowid = filas_detalle[i];
                            if(rowid.costo_mn != 0 || rowid.costo_me != 0 ){
                                var request_contabilidad_detalle_cuenta_detalle  = new mssql.Request(transaction);
                                var result_contabilidad_detalle_cuenta_detalle = await request_contabilidad_detalle_cuenta_detalle
                                .input('codigo_empresa',mssql.VarChar(250), codigo_empresa)
                                .input('codigo',mssql.VarChar(250), rowid.Codigo)
                                .query(
                                    "Select \n"+
                                    "hfam_art.ccuenta_h as Cuenta,  \n"+
                                    "hfam_art.ccuenta_vd as Cuenta_Diferida,  \n"+
                                    "hfam_art.erp_cta_nc_dev as Cuenta_Credito_Devolucion, \n"+
                                    "hparameter.cta_nd_vta as Cuenta_Debito, \n"+
                                    "hparameter.cta_nc_vta as Cuenta_Credito_Descuento \n"+
                                    "From harticul  \n"+
                                    "Inner join hfam_art on \n"+
                                    "harticul.ccod_empresa = hfam_art.ccod_empresa  \n"+
                                    "And harticul.cfamilia = hfam_art.cfamilia \n"+
                                    "inner join hparameter on \n"+
                                    "hparameter.ccod_empresa = harticul.ccod_empresa \n"+
                                    "Where \n"+
                                    "harticul.ccod_empresa = @codigo_empresa \n"+
                                    "And ccod_articulo = @codigo"
                                );

                                var recordset_contabilidad_detalle_cuenta_detalle = result_contabilidad_detalle_cuenta_detalle.recordset[0];

                                var calculos_mn_me = await helpers.getCalculosMnMe({
                                    Monto: rowid.Base_imp_dec,
                                    Tc : req.body.tasa_cambio,
                                    Moneda : req.body.moneda,
                                    D_H: req.body.tipo_documento == "07" ? 'D' : 'H',
                                });

                                var cuenta_productos = '';
                                if(req.body.tipo=="VENTA DIFERIDA" || req.body.tipo=="VENTA DIFERIDA DE PEDIDO"){
                                    cuenta_productos = recordset_contabilidad_detalle_cuenta_detalle.Cuenta_Diferida;
                                }else if(req.body.tipo=="NOTA DE DEBITO"){
                                    cuenta_productos = recordset_contabilidad_detalle_cuenta_detalle.Cuenta_Debito;
                                }else if(req.body.tipo=="NOTA DE CREDITO POR DESCUENTO"){
                                    cuenta_productos = recordset_contabilidad_detalle_cuenta_detalle.Cuenta_Credito_Descuento;
                                }else if(req.body.tipo=="NOTA DE CREDITO DIRECTO" || req.body.tipo=="NOTA DE CREDITO POR DEVOLUCION"){
                                    cuenta_productos = recordset_contabilidad_detalle_cuenta_detalle.Cuenta_Credito_Devolucion;
                                }else{
                                    cuenta_productos = recordset_contabilidad_detalle_cuenta_detalle.Cuenta;
                                }
                                fila_contable.push({
                                    cuenta_codigo : cuenta_productos,
                                    tipo_auxiliar : '00',
                                    codigo_auxiliar : '',
                                    nombre_auxiliar : '',
                                    debe : calculos_mn_me.Debe,
                                    debe_mn : calculos_mn_me.Debe_MN,
                                    debe_me : calculos_mn_me.Debe_ME,
                                    haber : calculos_mn_me.Haber,
                                    haber_mn : calculos_mn_me.Haber_MN,
                                    haber_me : calculos_mn_me.Haber_ME,
                                    d_h : req.body.tipo_documento == "07" ? 'D' : 'H',
                                    Si_Diferencia : 'N',
                                    Si_Transferencia : 'S',
                                    Tipo_Origen : 'N',
                                    Si_Detraccion : 'N',
                                    Si_Retencion : 'N',
                                    Si_Percepcion : 'N',
                                    Producto_Codigo : rowid.Codigo,
                                    Producto_Item : rowid.nitem,
                                });
                            }
                        }
                        //#endregion
                        
                        //#region Cuenta de los costos
                        if(req.body.tipo=="VENTA DIFERIDA" || req.body.tipo=="VENTA DIFERIDA DE PEDIDO"){
                            cuenta_productos = recordset_contabilidad_detalle_cuenta_detalle.Cuenta_Diferida;
                        }else if(req.body.tipo=="NOTA DE DEBITO"){
                            cuenta_productos = recordset_contabilidad_detalle_cuenta_detalle.Cuenta_Debito;
                        }else if(req.body.tipo=="NOTA DE CREDITO POR DESCUENTO"){
                            cuenta_productos = recordset_contabilidad_detalle_cuenta_detalle.Cuenta_Credito_Descuento;
                        }else if(req.body.tipo=="NOTA DE CREDITO DIRECTO" || req.body.tipo=="NOTA DE CREDITO POR DEVOLUCION"){
                            cuenta_productos = recordset_contabilidad_detalle_cuenta_detalle.Cuenta_Credito_Devolucion;
                        }else{
                            cuenta_productos = recordset_contabilidad_detalle_cuenta_detalle.Cuenta;
                        }

                        if(req.body.tipo!="VENTA DIFERIDA" && req.body.tipo!="VENTA DIFERIDA DE PEDIDO" && req.body.tipo!="NOTA DE DEBITO" && req.body.tipo!="NOTA DE CREDITO POR DESCUENTO" ){

                            for (let i= 0; i< filas_detalle.length; i++){
                                rowid = filas_detalle[i];

                                if(rowid.costo_mn != 0 || rowid.costo_me != 0 ){
                                    var request_contabilidad_detalle_cuenta_costos  = new mssql.Request(transaction);
                                    var result_contabilidad_detalle_cuenta_costos = await request_contabilidad_detalle_cuenta_costos
                                    .input('codigo_empresa',mssql.VarChar(250), codigo_empresa)
                                    .input('codigo',mssql.VarChar(250), rowid.Codigo)
                                    .query(
                                        "Select  \n"+
                                        "hfam_art.cta_costo_venta_h as Costo_H,  \n"+
                                        "hfam_art.cta_costo_venta_d as Costo_D,  \n"+
                                        "hfam_art.erp_cta_nc_dev as Cuenta_NC \n"+
                                        "From harticul Inner join hfam_art on \n"+
                                        "harticul.ccod_empresa = hfam_art.ccod_empresa  \n"+
                                        "And harticul.cfamilia = hfam_art.cfamilia \n"+
                                        "Where  \n"+
                                        "harticul.ccod_empresa = @codigo_empresa \n"+
                                        "And ccod_articulo = @codigo"
                                    );

                                    var recordset_contabilidad_detalle_cuenta_costos = result_contabilidad_detalle_cuenta_costos.recordset[0];


                                    var calculos_mn_me = await helpers.getCalculosMnMe({
                                        Monto_Soles : rowid.costo_mn * rowid.Cantidad_Kardex,
                                        Monto_Dolares : rowid.costo_me * rowid.Cantidad_Kardex,
                                        Tc : req.body.tasa_cambio,
                                        Moneda : req.body.moneda,
                                        D_H: req.body.tipo_documento == "07" ? 'H' : 'D',
                                    })

                                    fila_contable.push({
                                        cuenta_codigo : recordset_contabilidad_detalle_cuenta_costos.Costo_D,
                                        tipo_auxiliar : '00',
                                        codigo_auxiliar : '',
                                        nombre_auxiliar : '',
                                        debe : calculos_mn_me.Debe,
                                        debe_mn : calculos_mn_me.Debe_MN,
                                        debe_me : calculos_mn_me.Debe_ME,
                                        haber : calculos_mn_me.Haber,
                                        haber_mn : calculos_mn_me.Haber_MN,
                                        haber_me : calculos_mn_me.Haber_ME,
                                        d_h : req.body.tipo_documento == "07" ? 'H' : 'D',
                                        Si_Diferencia : 'N',
                                        Si_Transferencia : 'S',
                                        Tipo_Origen : 'N',
                                        Si_Detraccion : 'N',
                                        Si_Retencion : 'N',
                                        Si_Percepcion : 'N',
                                        Producto_Codigo : rowid.Codigo,
                                        Producto_Item : rowid.nitem,
                                    });

                                    calculos_mn_me = await helpers.getCalculosMnMe({
                                        Monto_Soles : rowid.costo_mn * rowid.Cantidad_Kardex,
                                        Monto_Dolares : rowid.costo_me * rowid.Cantidad_Kardex,
                                        Tc : req.body.tasa_cambio,
                                        Moneda : req.body.moneda,
                                        D_H: req.body.tipo_documento == "07" ? 'D' : 'H',
                                    })

                                    fila_contable.push({
                                        cuenta_codigo : recordset_contabilidad_detalle_cuenta_costos.Costo_H,
                                        tipo_auxiliar : '00',
                                        codigo_auxiliar : '',
                                        nombre_auxiliar : '',
                                        debe : calculos_mn_me.Debe,
                                        debe_mn : calculos_mn_me.Debe_MN,
                                        debe_me : calculos_mn_me.Debe_ME,
                                        haber : calculos_mn_me.Haber,
                                        haber_mn : calculos_mn_me.Haber_MN,
                                        haber_me : calculos_mn_me.Haber_ME,
                                        d_h : req.body.tipo_documento == "07" ? 'D' : 'H',
                                        Si_Diferencia : 'N',
                                        Si_Transferencia : 'S',
                                        Tipo_Origen : 'N',
                                        Si_Detraccion : 'N',
                                        Si_Retencion : 'N',
                                        Si_Percepcion : 'N',
                                        Producto_Codigo : rowid.Codigo,
                                        Producto_Item : rowid.nitem,
                                    });
                                }
                            }
                        }
                        //#endregion
                        
                    }

                    // #region  grabar detalle
                    var nitem = 0;
                    for(var j=0;j<fila_contable.length;j++){
                        nitem++;
                        var request_contabilidad_detalle  = new mssql.Request(transaction);
                        await request_contabilidad_detalle
                        .input('ccod_empresa',mssql.VarChar(250), codigo_empresa)
                        .input('ejercon',mssql.VarChar(250), ejercicio)
                        .input('periodo_con',mssql.VarChar(250), periodo)
                        .input('ccod_svoucher',mssql.VarChar(250), '06')
                        .input('cnum_doc',mssql.VarChar(250), numero_correlativo_contabilidad)
                        .input('nitem',mssql.VarChar(250), nitem)
                        .input('ccuenta',mssql.VarChar(250), fila_contable[j].cuenta_codigo)
                        .input('ctip_auxiliar',mssql.VarChar(250), fila_contable[j].tipo_auxiliar)
                        .input('ccod_auxiliar',mssql.VarChar(250), fila_contable[j].codigo_auxiliar)
                        .input('cnom_auxiliar',mssql.VarChar(250), fila_contable[j].nombre_auxiliar)
                        .input('debe',mssql.VarChar(250), fila_contable[j].debe)
                        .input('haber',mssql.VarChar(250), fila_contable[j].haber)
                        .input('mndebe',mssql.VarChar(250), fila_contable[j].debe_mn)
                        .input('mnhaber',mssql.VarChar(250), fila_contable[j].haber_mn)
                        .input('medebe',mssql.VarChar(250), fila_contable[j].debe_me)
                        .input('mehaber',mssql.VarChar(250), fila_contable[j].haber_me)
                        .input('mnretencion',mssql.VarChar(250), '0')
                        .input('erp_codune',mssql.VarChar(250), req.body.codigo_unidad_negocio)
                        .input('ccod_cencos',mssql.VarChar(250), req.body.codigo_centro_costos)
                        .input('ot',mssql.VarChar(250), req.body.orden_trabajo)
                        .input('d_h',mssql.VarChar(250), fila_contable[j].d_h)
                        .input('ccod_almacen_docref',mssql.VarChar(250), '')
                        .input('ctip_docref',mssql.VarChar(250), fila_contable[j].Tipo_Documento || req.body.tipo_documento)
                        .input('cnum_serieref',mssql.VarChar(250),fila_contable[j].Serie_Documento ||  req.body.serie)
                        .input('cnum_docref',mssql.VarChar(250),fila_contable[j].Numero_Documento ||  numero_correlativo)
                        .input('dfechadocref',mssql.VarChar(250),fila_contable[j].Fecha_Documento ||  req.body.fecha_doc)
                        .input('tipodoc_2',mssql.VarChar(250), fila_contable[j].Tipo_Documento_Referencia || req.body.tipo_documento_referencia)
                        .input('seriedoc_2',mssql.VarChar(250), fila_contable[j].Serie_Documento_Referencia || req.body.serie_documento_referencia)
                        .input('numdoc_2',mssql.VarChar(250), fila_contable[j].Numero_Documento_Referencia || req.body.numero_documento_referencia)
                        .input('fechadoc_2',mssql.VarChar(250), fila_contable[j].Fecha_Documento_Referencia || req.body.fecha_referencia)
                        .input('monto_ref',mssql.VarChar(250), '0')
                        .input('CMONEDA_DOCREF',mssql.VarChar(250), req.body.moneda)
                        .input('TIPO_CAMBIO_DOCREF',mssql.VarChar(250), req.body.tasa_cambio)
                        .input('subvoucher_ref',mssql.VarChar(250), '06')
                        .input('fecha_vencimiento',mssql.VarChar(250), req.body.fecha_validez)
                        .input('glosa',mssql.VarChar(250), req.body.Glosa)
                        .input('movimiento_guia',mssql.VarChar(250), '')
                        .input('tipmov_guia',mssql.VarChar(250), '')
                        .input('serie',mssql.VarChar(250), '')
                        .input('numero',mssql.VarChar(250), '')
                        .input('iten_guia',mssql.VarChar(250), '0')
                        .input('cta_diferencia',mssql.VarChar(250), fila_contable[j].Si_Diferencia)
                        .input('cuenta_trans',mssql.VarChar(250), fila_contable[j].Si_Transferencia)
                        .input('item_transferencia',mssql.VarChar(250), '0')
                        .input('tipo_origen',mssql.VarChar(250), fila_contable[j].Tipo_Origen)
                        .input('pago_mn',mssql.VarChar(250), '0')
                        .input('pago_me',mssql.VarChar(250), '0')
                        .input('pago_rt',mssql.VarChar(250), '0')
                        .input('cta_detracion',mssql.VarChar(250), fila_contable[j].Si_Detraccion)
                        .input('cta_retencion',mssql.VarChar(250), fila_contable[j].Si_Retencion)
                        .input('cta_percepcion',mssql.VarChar(250), fila_contable[j].Si_Percepcion)
                        .input('CCOD_BANCO',mssql.VarChar(250), '00')
                        .input('CCOD_SIT_LETRA',mssql.VarChar(250), '00')
                        .input('NRO_UNICO',mssql.VarChar(250), '')
                        .input('erp_codven',mssql.VarChar(250), req.body.vendedor_1)
                        .input('erp_forpag',mssql.VarChar(250), req.body.forma_pago)
                        .input('erp_Nro_Ope',mssql.VarChar(250), '')
                        .input('erp_conciliado',mssql.VarChar(250), 'N')
                        .input('erp_percon_con',mssql.VarChar(250), '')
                        .input('erp_doccan',mssql.VarChar(250), 'N')
                        .input('erp_codaval',mssql.VarChar(250), '')
                        .input('erp_canje',mssql.VarChar(250), 'N')
                        .input('dt_aplica',mssql.VarChar(250), 'N')
                        .input('erp_aplica',mssql.VarChar(250), 'N')
                        .input('erp_numcta',mssql.VarChar(250), '')
                        .input('erp_itecta',mssql.VarChar(250), '0')
                        .input('erp_retencion_aplica',mssql.VarChar(250), 'N')
                        .input('erp_asiento_patron',mssql.VarChar(250), '00')
                        .input('erp_provision_ff',mssql.VarChar(250), 'N')
                        .input('erp_resp_det',mssql.VarChar(250), '00')
                        .input('erp_presupuesto',mssql.VarChar(250), '00')
                        .input('erp_presupuesto_sn',mssql.VarChar(250), 'N')
                        .input('erp_codven2',mssql.VarChar(250), req.body.vendedor_2)
                        .input('erp_cta_costo_sn',mssql.VarChar(250), 'N')
                        .input('clasif_bien_servicio',mssql.VarChar(250), '')
                        .input('cta_retencion_no_domic',mssql.VarChar(250), '')
                        .input('rt_aplica_no_domic',mssql.VarChar(250), '')
                        .input('retencion_s_n',mssql.VarChar(250), '')
                        .input('retencion_porcent',mssql.VarChar(250), '0')
                        .input('retencion_doc_serie',mssql.VarChar(250), '')
                        .input('retencion_doc_numero',mssql.VarChar(250), '')
                        .input('ccod_articulo',mssql.VarChar(250), fila_contable[j].Producto_Codigo)
                        .input('nitem_ref',mssql.VarChar(250), fila_contable[j].Producto_Item)
                        .query("Insert Into hmovcond ("+
                        "ccod_empresa, \n"+
                        "ejercon, \n"+
                        "periodo_con, \n"+
                        "ccod_svoucher, \n"+
                        "cnum_doc, \n"+
                        "nitem, \n"+
                        "ccuenta, \n"+
                        "ctip_auxiliar, \n"+
                        "ccod_auxiliar, \n"+
                        "cnom_auxiliar, \n"+
                        "debe, \n"+
                        "haber, \n"+
                        "mndebe, \n"+
                        "mnhaber, \n"+
                        "medebe, \n"+
                        "mehaber, \n"+
                        "mnretencion, \n"+
                        "erp_codune, \n"+
                        "ccod_cencos, \n"+
                        "ot, \n"+
                        "d_h, \n"+
                        "ccod_almacen_docref, \n"+
                        "ctip_docref, \n"+
                        "cnum_serieref, \n"+
                        "cnum_docref, \n"+
                        "dfechadocref, \n"+
                        "tipodoc_2, \n"+
                        "seriedoc_2, \n"+
                        "numdoc_2, \n"+
                        "fechadoc_2, \n"+
                        "monto_ref, \n"+
                        "CMONEDA_DOCREF, \n"+
                        "TIPO_CAMBIO_DOCREF, \n"+
                        "subvoucher_ref, \n"+
                        "fecha_vencimiento, \n"+
                        "glosa, \n"+
                        "movimiento_guia, \n"+
                        "tipmov_guia, \n"+
                        "serie, \n"+
                        "numero, \n"+
                        "iten_guia, \n"+
                        "cta_diferencia, \n"+
                        "cuenta_trans, \n"+
                        "item_transferencia, \n"+
                        "tipo_origen, \n"+
                        "pago_mn, \n"+
                        "pago_me, \n"+
                        "pago_rt, \n"+
                        "cta_detracion, \n"+
                        "cta_retencion, \n"+
                        "cta_percepcion, \n"+
                        "CCOD_BANCO, \n"+
                        "CCOD_SIT_LETRA, \n"+
                        "NRO_UNICO, \n"+
                        "erp_codven, \n"+
                        "erp_forpag, \n"+
                        "erp_Nro_Ope, \n"+
                        "erp_conciliado, \n"+
                        "erp_percon_con, \n"+
                        "erp_doccan, \n"+
                        "erp_codaval, \n"+
                        "erp_canje, \n"+
                        "dt_aplica, \n"+
                        "erp_aplica, \n"+
                        "erp_numcta, \n"+
                        "erp_itecta, \n"+
                        "erp_retencion_aplica, \n"+
                        "erp_asiento_patron, \n"+
                        "erp_provision_ff, \n"+
                        "erp_resp_det, \n"+
                        "erp_presupuesto, \n"+
                        "erp_presupuesto_sn, \n"+
                        "erp_codven2, \n"+
                        "erp_cta_costo_sn, \n"+
                        "clasif_bien_servicio, \n"+
                        "cta_retencion_no_domic, \n"+
                        "rt_aplica_no_domic, \n"+
                        "retencion_s_n, \n"+
                        "retencion_porcent, \n"+
                        "retencion_doc_serie, \n"+
                        "retencion_doc_numero, \n"+
                        "ccod_articulo, \n"+
                        "nitem_ref \n"+
                        ") values ( \n"+
                        "@ccod_empresa, \n"+
                        "@ejercon, \n"+
                        "@periodo_con, \n"+
                        "@ccod_svoucher, \n"+
                        "@cnum_doc, \n"+
                        "@nitem, \n"+
                        "@ccuenta, \n"+
                        "@ctip_auxiliar, \n"+
                        "@ccod_auxiliar, \n"+
                        "@cnom_auxiliar, \n"+
                        "@debe, \n"+
                        "@haber, \n"+
                        "@mndebe, \n"+
                        "@mnhaber, \n"+
                        "@medebe, \n"+
                        "@mehaber, \n"+
                        "@mnretencion, \n"+
                        "@erp_codune, \n"+
                        "@ccod_cencos, \n"+
                        "@ot, \n"+
                        "@d_h, \n"+
                        "@ccod_almacen_docref, \n"+
                        "@ctip_docref, \n"+
                        "@cnum_serieref, \n"+
                        "@cnum_docref, \n"+
                        "@dfechadocref, \n"+
                        "@tipodoc_2, \n"+
                        "@seriedoc_2, \n"+
                        "@numdoc_2, \n"+
                        "@fechadoc_2, \n"+
                        "@monto_ref, \n"+
                        "@CMONEDA_DOCREF, \n"+
                        "@TIPO_CAMBIO_DOCREF, \n"+
                        "@subvoucher_ref, \n"+
                        "@fecha_vencimiento, \n"+
                        "@glosa, \n"+
                        "@movimiento_guia, \n"+
                        "@tipmov_guia, \n"+
                        "@serie, \n"+
                        "@numero, \n"+
                        "@iten_guia, \n"+
                        "@cta_diferencia, \n"+
                        "@cuenta_trans, \n"+
                        "@item_transferencia, \n"+
                        "@tipo_origen, \n"+
                        "@pago_mn, \n"+
                        "@pago_me, \n"+
                        "@pago_rt, \n"+
                        "@cta_detracion, \n"+
                        "@cta_retencion, \n"+
                        "@cta_percepcion, \n"+
                        "@CCOD_BANCO, \n"+
                        "@CCOD_SIT_LETRA, \n"+
                        "@NRO_UNICO, \n"+
                        "@erp_codven, \n"+
                        "@erp_forpag, \n"+
                        "@erp_Nro_Ope, \n"+
                        "@erp_conciliado, \n"+
                        "@erp_percon_con, \n"+
                        "@erp_doccan, \n"+
                        "@erp_codaval, \n"+
                        "@erp_canje, \n"+
                        "@dt_aplica, \n"+
                        "@erp_aplica, \n"+
                        "@erp_numcta, \n"+
                        "@erp_itecta, \n"+
                        "@erp_retencion_aplica, \n"+
                        "@erp_asiento_patron, \n"+
                        "@erp_provision_ff, \n"+
                        "@erp_resp_det, \n"+
                        "@erp_presupuesto, \n"+
                        "@erp_presupuesto_sn, \n"+
                        "@erp_codven2, \n"+
                        "@erp_cta_costo_sn, \n"+
                        "@clasif_bien_servicio, \n"+
                        "@cta_retencion_no_domic, \n"+
                        "@rt_aplica_no_domic, \n"+
                        "@retencion_s_n, \n"+
                        "@retencion_porcent, \n"+
                        "@retencion_doc_serie, \n"+
                        "@retencion_doc_numero, \n"+
                        "@ccod_articulo, \n"+
                        "@nitem_ref )\n"
                        );
                    }
                    // #endregion
                    
                    //#endregion

                    //#region Guardar Provision Cuentas por Cobrar

                    //#region Generar Correlativo de cuentas por cobrar
                    const request_automatico_provision  = new mssql.Request(transaction);
                    const result_automatico_provision = await request_automatico_provision 
                    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
                    .input('concepto', mssql.VarChar(250), 'NNUM_CTAXCOB')
                    .input('tipo', mssql.VarChar(250), 'COB')
                    .query(
                        "declare  \n"+
                        "@correlativo int,  \n"+
                        "@contador int,  \n"+
                        "@cantidad_ceros int,  \n"+
                        "@ceros varchar(50),  \n"+
                        "@cnt INT  \n"+
                        "set @cantidad_ceros = 6 \n"+
                        "set @contador = 1  \n"+
                        "set @ceros =''  \n"+
                        "set @correlativo =  \n"+
                        "(select  top (1) nvalor  \n"+
                        "from hultval  \n"+
                        "where  \n"+
                        "ccod_empresa = @codigo_empresa  \n"+
                        "and cconcepto = @concepto) \n"+
                        "set @cnt = LEN(@correlativo)  \n"+
                        "WHILE @cnt < @cantidad_ceros  \n"+
                        "BEGIN  \n"+
                        "SET @ceros = '0'+@ceros  \n"+
                        "SET @cnt = @cnt + 1  \n"+
                        "print LEN(@correlativo)  \n"+
                        "print @correlativo \n"+
                        "print @cantidad_ceros \n"+
                        "print @cnt \n"+
                        "print @ceros \n"+
                        "END  \n"+
                        "while @contador>0  \n"+
                        "begin  \n"+
                        "set @correlativo = @correlativo +1  \n"+
                        "SELECT @contador= COUNT(*)  \n"+
                        "FROM hctacxcp  \n"+
                        "WHERE CCOD_EMPRESA= @codigo_empresa   \n"+
                        "AND cob_pag= @tipo  \n"+
                        "AND cnum_ctax_cob_pag = 'C'+@ceros+convert(varchar (50), @correlativo ) \n"+
                        "print 'C'+@ceros+convert(varchar (50), @correlativo ) \n"+
                        "print @contador \n"+
                        "end  \n"+
                        "select 'C'+@ceros+CONVERT(VARCHAR(50),@correlativo) as correlativo"
                    );
                    var recordset_automatico_provision = result_automatico_provision.recordset;
                    numero_correlativo_provision = recordset_automatico_provision[0].correlativo;
                    //#endregion

                    //#region Guardar Provisión de Cuentas por cobrar
                    const request_provision  = new mssql.Request(transaction);
                    await request_provision
                    .input('ccod_empresa', mssql.VarChar(250), codigo_empresa)
                    .input('cob_pag', mssql.VarChar(250), 'COB')
                    .input('cnum_ctax_cob_pag', mssql.VarChar(250), numero_correlativo_provision)
                    .input('ejercon', mssql.VarChar(250), ejercicio)
                    .input('periodo_con', mssql.VarChar(250), periodo)
                    .input('ccod_svoucher', mssql.VarChar(250), "06")
                    .input('cnum_doc_cont', mssql.VarChar(250), numero_correlativo_contabilidad)
                    .input('AUTOMATICO', mssql.VarChar(250), "A")
                    .input('dfecha_doc', mssql.Date, req.body.fecha_doc)
                    .input('fecha_ref', mssql.Date, req.body.fecha_doc)
                    .input('ctip_docref', mssql.VarChar(250), req.body.tipo_documento_referencia)
                    .input('cnum_serie_docref', mssql.VarChar(250), req.body.serie_documento_referencia)
                    .input('cnum_doc_docref', mssql.VarChar(250), req.body.numero_documento_referencia)
                    .input('dfecha_emision', mssql.Date, req.body.fecha_doc)
                    .input('ctip_doc', mssql.VarChar(250), req.body.tipo_documento)
                    .input('cserie_doc', mssql.VarChar(250), req.body.serie)
                    .input('cnum_doc', mssql.VarChar(250), numero_correlativo)
                    .input('cmoneda', mssql.VarChar(250), req.body.moneda)
                    .input('tipo_tc', mssql.VarChar(250), req.body.tipo_cambio)
                    .input('tipo_cambio', mssql.VarChar(250), req.body.tasa_cambio)
                    .input('tc_ref', mssql.VarChar(250), "0")
                    .input('tipo_anexo', mssql.VarChar(250), "12")
                    .input('ccod_anexo', mssql.VarChar(250), req.body.codigo_cliente)
                    .input('cnom_anexo', mssql.VarChar(250), req.body.nombre_cliente)
                    .input('cnom_forpago', mssql.VarChar(250), req.body.forma_pago)
                    .input('nro_dias', mssql.VarChar(250), req.body.dias)
                    .input('fecha_venc', mssql.VarChar(250), req.body.fecha_validez)
                    .input('glosa', mssql.VarChar(250), req.body.Glosa)
                    .input('letra_aceptada', mssql.VarChar(250), "N")
                    .input('ccod_situac_letra', mssql.VarChar(250), "00")
                    .input('ccod_banco', mssql.VarChar(250), "00")
                    .input('nro_unico', mssql.VarChar(250), "")
                    .input('nsub_total', mssql.VarChar(250), req.body.erp_Dsubtotal)
                    .input('nsub_total_ng', mssql.VarChar(250), "0")
                    .input('porcent_nigv', mssql.VarChar(250), 18)
                    .input('nigv', mssql.VarChar(250), req.body.erp_Digv)
                    .input('nimporte', mssql.VarChar(250), req.body.erp_Dtotal)
                    .input('pago', mssql.VarChar(250), 0)
                    .input('subtotal_mn', mssql.VarChar(250), calculos_contable.SubTotal_Gravado_MN)
                    .input('subtotal_mixto_mn', mssql.VarChar(250), calculos_contable.SubTotal_No_Gravado_MN)
                    .input('igv_mn', mssql.VarChar(250), calculos_contable.Igv_MN)
                    .input('importe_mn', mssql.VarChar(250), calculos_contable.Total_MN)
                    .input('comision_mn', mssql.VarChar(250), calculos_contable.Comision_MN)
                    .input('descuento_mn', mssql.VarChar(250), 0)
                    .input('detraccion_mn', mssql.VarChar(250), calculos_contable.Detraccion_MN)
                    .input('percepcion_mn', mssql.VarChar(250), calculos_contable.Percepcion_MN)
                    .input('subtotal_me', mssql.VarChar(250), calculos_contable.SubTotal_Gravado_ME)
                    .input('subtotal_mixto_me', mssql.VarChar(250), calculos_contable.SubTotal_No_Gravado_ME)
                    .input('igv_me', mssql.VarChar(250), calculos_contable.Igv_ME)
                    .input('importe_me', mssql.VarChar(250), calculos_contable.Total_ME)
                    .input('comision_me', mssql.VarChar(250), calculos_contable.Comision_ME)
                    .input('descuento_me', mssql.VarChar(250), 0)
                    .input('detraccion_me', mssql.VarChar(250), calculos_contable.Detraccion_ME)
                    .input('percepcion_me', mssql.VarChar(250), calculos_contable.Percepcion_ME)
                    .input('comision_doc', mssql.VarChar(250), 0)
                    .input('dscto_doc', mssql.VarChar(250), 0)
                    .input('ERP_NUMVIN', mssql.VarChar(250), 0)
                    .input('LUGAR_GIRO', mssql.VarChar(250), "")
                    .input('fecha_canje_letra', mssql.Date, req.body.fecha_doc)
                    .input('si_regcompra', mssql.VarChar(250), "S")
                    .input('dest_operacion', mssql.VarChar(250), "001")
                    .input('a_dua', mssql.VarChar(250), "")
                    .input('modulo', mssql.VarChar(250), "FACTURACION")
                    .input('estado', mssql.VarChar(250), "Ingresado")
                    .input('contabilizada', mssql.VarChar(250), "S")
                    .input('cnum_doc_ordc', mssql.VarChar(250), "")
                    .input('ccod_detraccion', mssql.VarChar(250), "00")
                    .input('detraccion', mssql.VarChar(250), "N")
                    .input('porc_Detrac', mssql.VarChar(250), 0)
                    .input('mon_Detrac', mssql.VarChar(250), 0)
                    .input('percep_flag', mssql.VarChar(250), "S")
                    .input('Porc_Percep', mssql.VarChar(250), 4)
                    .input('mon_Percep', mssql.VarChar(250), 0)
                    .input('usuario', mssql.VarChar(250), usuario)
                    .input('lt_canjeada', mssql.VarChar(250), 'N')
                    .input('fecha_aceptacion', mssql.Date, '1900/01/01')
                    .input('tipo_letra', mssql.VarChar(250), 'CANJE')
                    .input('erp_codaval', mssql.VarChar(250), '')
                    .input('erp_retmn', mssql.VarChar(250), calculos_contable.Retencion_MN)
                    .input('erp_retme', mssql.VarChar(250), calculos_contable.Retencion_ME)
                    .input('dt_aplica', mssql.VarChar(250), 'N')
                    .input('erp_tipo_aporte', mssql.VarChar(250), '')
                    .input('erp_afp', mssql.VarChar(250), '')
                    .input('erp_nro_cups', mssql.VarChar(250), '')
                    .input('erp_flujo_mixta', mssql.VarChar(250), '')
                    .input('erp_motivo_venta', mssql.VarChar(250), '')
                    .input('erp_usuario', mssql.VarChar(250), usuario)
                    .input('nombre_pc', mssql.VarChar(250), req.body.Pc_User)
                    .input('Fecha_Pc', mssql.Date, req.body.fecha_doc)
                    .input('Ip_pc', mssql.VarChar(250), req.body.Pc_Ip)
                    .input('nro_familias', mssql.VarChar(250), 0)
                    .input('erp_ptovta_ref', mssql.VarChar(250), '')
                    .input('erp_tipo_ref', mssql.VarChar(250), '')
                    .input('erp_serie_ref', mssql.VarChar(250), '')
                    .input('erp_numero_ref', mssql.VarChar(250), '')
                    .input('clasif_bien_servicio', mssql.VarChar(250), '')
                    .input('ccod_retencion_no_domic', mssql.VarChar(250), '')
                    .input('retencion_no_domic', mssql.VarChar(250), '')
                    .input('porc_reten_no_domic', mssql.VarChar(250), 0)
                    .input('mon_reten', mssql.VarChar(250), 0)
                    .input('retencion_no_domic_mn', mssql.VarChar(250), 0)
                    .input('retencion_no_domic_me', mssql.VarChar(250), 0)
                    .input('dt_aplica_no_domic', mssql.VarChar(250), 0)
                    .input('icbper', mssql.VarChar(250), req.body.ICBPER)
                    .input('icbper_mn', mssql.VarChar(250), calculos_contable.Icbper_MN)
                    .input('icbper_me', mssql.VarChar(250), calculos_contable.Icbper_ME)
                    .query("Insert Into hctacxcp ("+
                    "ccod_empresa, \n"+
                    "cob_pag, \n"+
                    "cnum_ctax_cob_pag, \n"+
                    "ejercon, \n"+
                    "periodo_con, \n"+
                    "ccod_svoucher, \n"+
                    "cnum_doc_cont, \n"+
                    "AUTOMATICO, \n"+
                    "dfecha_doc, \n"+
                    "fecha_ref, \n"+
                    "ctip_docref, \n"+
                    "cnum_serie_docref, \n"+
                    "cnum_doc_docref, \n"+
                    "dfecha_emision, \n"+
                    "ctip_doc, \n"+
                    "cserie_doc, \n"+
                    "cnum_doc, \n"+
                    "cmoneda, \n"+
                    "tipo_tc, \n"+
                    "tipo_cambio, \n"+
                    "tc_ref, \n"+
                    "tipo_anexo, \n"+
                    "ccod_anexo, \n"+
                    "cnom_anexo, \n"+
                    "cnom_forpago, \n"+
                    "nro_dias, \n"+
                    "fecha_venc, \n"+
                    "glosa, \n"+
                    "letra_aceptada, \n"+
                    "ccod_situac_letra, \n"+
                    "ccod_banco, \n"+
                    "nro_unico, \n"+
                    "nsub_total, \n"+
                    "nsub_total_ng, \n"+
                    "porcent_nigv, \n"+
                    "nigv, \n"+
                    "nimporte, \n"+
                    "pago, \n"+
                    "subtotal_mn, \n"+
                    "subtotal_mixto_mn, \n"+
                    "igv_mn, \n"+
                    "importe_mn, \n"+
                    "comision_mn, \n"+
                    "descuento_mn, \n"+
                    "detraccion_mn, \n"+
                    "percepcion_mn, \n"+
                    "subtotal_me, \n"+
                    "subtotal_mixto_me, \n"+
                    "igv_me, \n"+
                    "importe_me, \n"+
                    "comision_me, \n"+
                    "descuento_me, \n"+
                    "detraccion_me, \n"+
                    "percepcion_me, \n"+
                    "comision_doc, \n"+
                    "dscto_doc, \n"+
                    "ERP_NUMVIN, \n"+
                    "LUGAR_GIRO, \n"+
                    "fecha_canje_letra, \n"+
                    "si_regcompra, \n"+
                    "dest_operacion, \n"+
                    "a_dua, \n"+
                    "modulo, \n"+
                    "estado, \n"+
                    "contabilizada, \n"+
                    "cnum_doc_ordc, \n"+
                    "ccod_detraccion, \n"+
                    "detraccion, \n"+
                    "porc_Detrac, \n"+
                    "mon_Detrac, \n"+
                    "percep_flag, \n"+
                    "Porc_Percep, \n"+
                    "mon_Percep, \n"+
                    "usuario, \n"+
                    "lt_canjeada, \n"+
                    "fecha_aceptacion, \n"+
                    "tipo_letra, \n"+
                    "erp_codaval, \n"+
                    "erp_retmn, \n"+
                    "erp_retme, \n"+
                    "dt_aplica, \n"+
                    "erp_tipo_aporte, \n"+
                    "erp_afp, \n"+
                    "erp_nro_cups, \n"+
                    "erp_flujo_mixta, \n"+
                    "erp_motivo_venta, \n"+
                    "erp_usuario, \n"+
                    "nombre_pc, \n"+
                    "Fecha_Pc, \n"+
                    "Ip_pc, \n"+
                    "nro_familias, \n"+
                    "erp_ptovta_ref, \n"+
                    "erp_tipo_ref, \n"+
                    "erp_serie_ref, \n"+
                    "erp_numero_ref, \n"+
                    "clasif_bien_servicio, \n"+
                    "ccod_retencion_no_domic, \n"+
                    "retencion_no_domic, \n"+
                    "porc_reten_no_domic, \n"+
                    "mon_reten, \n"+
                    "retencion_no_domic_mn, \n"+
                    "retencion_no_domic_me, \n"+
                    "dt_aplica_no_domic, \n"+
                    "icbper, \n"+
                    "icbper_mn, \n"+
                    "icbper_me \n"+
                    ") values (\n"+
                    "@ccod_empresa, \n"+
                    "@cob_pag, \n"+
                    "@cnum_ctax_cob_pag, \n"+
                    "@ejercon, \n"+
                    "@periodo_con, \n"+
                    "@ccod_svoucher, \n"+
                    "@cnum_doc_cont, \n"+
                    "@AUTOMATICO, \n"+
                    "@dfecha_doc, \n"+
                    "@fecha_ref, \n"+
                    "@ctip_docref, \n"+
                    "@cnum_serie_docref, \n"+
                    "@cnum_doc_docref, \n"+
                    "@dfecha_emision, \n"+
                    "@ctip_doc, \n"+
                    "@cserie_doc, \n"+
                    "@cnum_doc, \n"+
                    "@cmoneda, \n"+
                    "@tipo_tc, \n"+
                    "@tipo_cambio, \n"+
                    "@tc_ref, \n"+
                    "@tipo_anexo, \n"+
                    "@ccod_anexo, \n"+
                    "@cnom_anexo, \n"+
                    "@cnom_forpago, \n"+
                    "@nro_dias, \n"+
                    "@fecha_venc, \n"+
                    "@glosa, \n"+
                    "@letra_aceptada, \n"+
                    "@ccod_situac_letra, \n"+
                    "@ccod_banco, \n"+
                    "@nro_unico, \n"+
                    "@nsub_total, \n"+
                    "@nsub_total_ng, \n"+
                    "@porcent_nigv, \n"+
                    "@nigv, \n"+
                    "@nimporte, \n"+
                    "@pago, \n"+
                    "@subtotal_mn, \n"+
                    "@subtotal_mixto_mn, \n"+
                    "@igv_mn, \n"+
                    "@importe_mn, \n"+
                    "@comision_mn, \n"+
                    "@descuento_mn, \n"+
                    "@detraccion_mn, \n"+
                    "@percepcion_mn, \n"+
                    "@subtotal_me, \n"+
                    "@subtotal_mixto_me, \n"+
                    "@igv_me, \n"+
                    "@importe_me, \n"+
                    "@comision_me, \n"+
                    "@descuento_me, \n"+
                    "@detraccion_me, \n"+
                    "@percepcion_me, \n"+
                    "@comision_doc, \n"+
                    "@dscto_doc, \n"+
                    "@ERP_NUMVIN, \n"+
                    "@LUGAR_GIRO, \n"+
                    "@fecha_canje_letra, \n"+
                    "@si_regcompra, \n"+
                    "@dest_operacion, \n"+
                    "@a_dua, \n"+
                    "@modulo, \n"+
                    "@estado, \n"+
                    "@contabilizada, \n"+
                    "@cnum_doc_ordc, \n"+
                    "@ccod_detraccion, \n"+
                    "@detraccion, \n"+
                    "@porc_Detrac, \n"+
                    "@mon_Detrac, \n"+
                    "@percep_flag, \n"+
                    "@Porc_Percep, \n"+
                    "@mon_Percep, \n"+
                    "@usuario, \n"+
                    "@lt_canjeada, \n"+
                    "@fecha_aceptacion, \n"+
                    "@tipo_letra, \n"+
                    "@erp_codaval, \n"+
                    "@erp_retmn, \n"+
                    "@erp_retme, \n"+
                    "@dt_aplica, \n"+
                    "@erp_tipo_aporte, \n"+
                    "@erp_afp, \n"+
                    "@erp_nro_cups, \n"+
                    "@erp_flujo_mixta, \n"+
                    "@erp_motivo_venta, \n"+
                    "@erp_usuario, \n"+
                    "@nombre_pc, \n"+
                    "@Fecha_Pc, \n"+
                    "@Ip_pc, \n"+
                    "@nro_familias, \n"+
                    "@erp_ptovta_ref, \n"+
                    "@erp_tipo_ref, \n"+
                    "@erp_serie_ref, \n"+
                    "@erp_numero_ref, \n"+
                    "@clasif_bien_servicio, \n"+
                    "@ccod_retencion_no_domic, \n"+
                    "@retencion_no_domic, \n"+
                    "@porc_reten_no_domic, \n"+
                    "@mon_reten, \n"+
                    "@retencion_no_domic_mn, \n"+
                    "@retencion_no_domic_me, \n"+
                    "@dt_aplica_no_domic, \n"+
                    "@icbper, \n"+
                    "@icbper_mn, \n"+
                    "@icbper_me \n"+
                    ")"
                    );
                    //#endregion
                    
                    //#endregion

                    //#region Actualizar Factura con Numero Contable
                    
                    const request_actualizar_factura_contabilidad = new mssql.Request(transaction);
                    await request_actualizar_factura_contabilidad
                    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
                    .input('ejercicio', mssql.VarChar(250), ejercicio)
                    .input('periodo', mssql.VarChar(250), periodo)
                    .input('subvoucher', mssql.VarChar(250), '06')
                    .input('numero_contable', mssql.VarChar(250), numero_correlativo_contabilidad)
                    .input('punto_venta', mssql.VarChar(250), codigo_punto_venta)
                    .input('tipo_documento', mssql.VarChar(250), req.body.tipo_documento)
                    .input('tipo_movimiento', mssql.VarChar(250), req.body.tipo_movimiento)
                    .input('serie_documento', mssql.VarChar(250), req.body.serie)
                    .input('numero_documento', mssql.VarChar(250), numero_correlativo)
                    .query(
                        "UPDATE HMOVIALC   \n"+
                        "SET erp_ejecon = @ejercicio, \n"+
                        "erp_percon = @periodo, \n"+
                        "erp_codsub = @subvoucher, \n"+
                        "erp_numcon = @numero_contable \n"+
                        "WHERE  \n"+
                        "ccod_empresa = @codigo_empresa  \n"+
                        "AND ccod_almacen = @punto_venta \n"+
                        "AND ccod_movimiento = @tipo_documento  \n"+
                        "AND ctip_movimiento = @tipo_movimiento  \n"+
                        "AND cnum_serie = @serie_documento \n"+
                        "AND cnum_doc = @numero_documento \n"
                    );
                    //#endregion
                    
                    //#endregion

                    //#region Guardar Cancelacion
                    if (req.body.erp_cancelacion == "S") {

                        //#region Guardar Detalle Tipo Cancelacion
                        const request_detalle_tipo_cancelacion  = new mssql.Request(transaction);
                        await request_detalle_tipo_cancelacion
                        .input('erp_codemp', mssql.VarChar(10), codigo_empresa)
                        .input('erp_ptovta', mssql.VarChar(3), codigo_punto_venta)
                        .input('erp_tipodoc', mssql.VarChar(3), req.body.tipo_documento)
                        .input('erp_seriedoc', mssql.VarChar(5), req.body.serie)
                        .input('erp_numerodoc', mssql.VarChar(250), numero_correlativo)
                        .input('erp_ing_egr', mssql.VarChar(250), "I")
                        .input('erp_nitem', mssql.Int, '1')
                        .input('erp_codmov', mssql.VarChar(250), req.body.codigo_movimiento)
                        .input('erp_nommov', mssql.VarChar(250), req.body.nombre_movimiento)
                        .input('erp_importe', mssql.Decimal(18,2), (req.body.erp_Dimporte*1)+(req.body.erp_vuelto * 1))
                        .input('erp_moneda', mssql.VarChar(250), req.body.moneda)
                        .input('erp_nro_ope', mssql.VarChar(250), req.body.numero_operacion)
                        .input('erp_tipo', mssql.VarChar(250), "N")
                        .input('erp_concepto', mssql.VarChar(250), req.body.concepto_movimiento)
                        .input('fecha_cancelacion', mssql.Date, req.body.fecha_doc)
                        .query(
                          " INSERT INTO Erp_Ingreso_Egresos_PtoVta_Det( \n"+
                          " erp_codemp, \n"+
                          " erp_ptovta, \n"+
                          " erp_tipodoc, \n"+
                          " erp_seriedoc, \n"+
                          " erp_numerodoc, \n"+
                          " erp_ing_egr, \n"+
                          " erp_nitem, \n"+
                          " erp_codmov, \n"+
                          " erp_nommov, \n"+
                          " erp_importe, \n"+
                          " erp_moneda, \n"+
                          " erp_nro_ope, \n"+
                          " erp_tipo, \n"+
                          " erp_concepto, \n"+
                          " fecha_cancelacion \n"+
                          " )VALUES( \n"+
                          " @erp_codemp, \n"+
                          " @erp_ptovta, \n"+
                          " @erp_tipodoc, \n"+
                          " @erp_seriedoc, \n"+
                          " @erp_numerodoc, \n"+
                          " @erp_ing_egr, \n"+
                          " @erp_nitem, \n"+
                          " @erp_codmov, \n"+
                          " @erp_nommov, \n"+
                          " @erp_importe, \n"+
                          " @erp_moneda, \n"+
                          " @erp_nro_ope, \n"+
                          " @erp_tipo, \n"+
                          " @erp_concepto, \n"+
                          " @fecha_cancelacion) \n"
                        )
                        //#endregion

                        //#region Generar Correlativo Contabilidad
                        const request_automatico_contabilidad_cancelacion  = new mssql.Request(transaction);
                        const result_automatico_contabilidad_cancelacion = await request_automatico_contabilidad_cancelacion
                        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
                        .input('ejercicio', mssql.VarChar(250), ejercicio)
                        .input('periodo', mssql.VarChar(250), periodo)
                        .input('subvoucher', mssql.VarChar(250), '01')
                        .query(
                            "declare  \n"+
                            "@correlativo int,  \n"+
                            "@contador int,  \n"+
                            "@cantidad_ceros int,  \n"+
                            "@ceros varchar(50),  \n"+
                            "@cnt INT  \n"+
                            "set @cantidad_ceros = 5 \n"+
                            "set @contador = 1  \n"+
                            "set @ceros =''  \n"+
                            "select @correlativo = NUM_ULTCOMP  \n"+
                            "from Hpernume where  \n"+
                            "CCOD_EMPRESA= @codigo_empresa  \n"+
                            "and EJERCON= @ejercicio \n"+
                            "and PERIODO_CON= @periodo  \n"+
                            "and CCOD_SVOUCHER= @subvoucher \n"+
                            "set @cnt = LEN(@correlativo)  \n"+
                            "WHILE @cnt < @cantidad_ceros  \n"+
                            "BEGIN  \n"+
                            "SET @ceros = '0'+@ceros  \n"+
                            "SET @cnt = @cnt + 1  \n"+
                            "END  \n"+
                            "while @contador>0  \n"+
                            "begin  \n"+
                            "set @correlativo = @correlativo +1  \n"+
                            "SELECT @contador= COUNT(*)  \n"+
                            "FROM hmovconc  \n"+
                            "WHERE CCOD_EMPRESA= @codigo_empresa   \n"+
                            "AND ejercon= @ejercicio  \n"+
                            "AND periodo_con= @periodo  \n"+
                            "AND ccod_svoucher= @subvoucher  \n"+
                            "AND CNUM_DOC=@ceros+@correlativo  \n"+
                            "set @ceros ='' \n"+
                            "set @cnt = LEN(@correlativo)  \n"+
                            "WHILE @cnt < @cantidad_ceros  \n"+
                            "BEGIN  \n"+
                            "SET @ceros = '0'+@ceros  \n"+
                            "SET @cnt = @cnt + 1  \n"+
                            "END  \n"+
                            "end  \n"+
                            "select @ceros+CONVERT(VARCHAR(50),@correlativo) as correlativo \n"
                        );

                        var recordset_automatico_contabilidad_cancelacion = result_automatico_contabilidad_cancelacion.recordset;
                        numero_correlativo_cancelacion = recordset_automatico_contabilidad_cancelacion[0].correlativo;
                        //#endregion

                        //#region Guardar Cabecera Cancelacion
                        const request_contabilidad_cancelacion_cabecera  = new mssql.Request(transaction);
                        await request_contabilidad_cancelacion_cabecera
                        .input('ccod_empresa', mssql.VarChar(250), codigo_empresa)
                        .input('ejercon', mssql.VarChar(250), ejercicio)
                        .input('periodo_con', mssql.VarChar(250), periodo)
                        .input('ccod_svoucher', mssql.VarChar(250), '01')
                        .input('cnum_doc', mssql.VarChar(250), numero_correlativo_cancelacion)
                        .input('automatico', mssql.VarChar(250), req.body.automatico)
                        .input('dfecha_doc', mssql.Date, req.body.fecha_doc)
                        .input('fecha_referencia', mssql.Date, req.body.fecha_doc)
                        .input('tipo2', mssql.VarChar(250), req.body.tipo_documento)
                        .input('serie2', mssql.VarChar(250), req.body.serie)
                        .input('numero2', mssql.VarChar(250), numero_correlativo)
                        .input('dfecha_docref', mssql.Date, req.body.fecha_doc)
                        .input('ctip_docref', mssql.VarChar(250), '009')
                        .input('cserie_docref', mssql.VarChar(250), "")
                        .input('cnum_docref', mssql.VarChar(250), "")
                        .input('ctip_auxiliar', mssql.VarChar(250), '12')
                        .input('ccod_anexo', mssql.VarChar(250), req.body.codigo_cliente)
                        .input('cnom_anexo', mssql.VarChar(250), req.body.nombre_cliente)
                        .input('cmoneda', mssql.VarChar(250), req.body.moneda)
                        .input('ctip_cambio', mssql.VarChar(250), req.body.tipo_cambio)
                        .input('tipo_cambio', mssql.VarChar(250), req.body.tasa_cambio)
                        .input('tc_ref', mssql.VarChar(250), '0')
                        .input('tipo_registro', mssql.VarChar(250), 'ST')
                        .input('glosa', mssql.VarChar(250), req.body.Glosa == "" ? "Por Venta": req.body.Glosa )
                        .input('estado', mssql.VarChar(250), 'Ingresado')
                        .input('dest_operacion', mssql.VarChar(250), '004')
                        .input('modulo_origen', mssql.VarChar(250), 'C-B')
                        .input('a_dua', mssql.VarChar(250), '')
                        .input('mnbaseimpgrav', mssql.VarChar(250),  0)
                        .input('mnbaseimpnograv', mssql.VarChar(250), 0)
                        .input('mnigvgrav', mssql.VarChar(250), 0)
                        .input('nimporte', mssql.VarChar(250), req.body.erp_Dimporte)
                        .input('otros_tributos', mssql.VarChar(250), '0')
                        .input('ventas_diferidas', mssql.VarChar(250), '0')
                        .input('base_con_mn', mssql.VarChar(250), 0)
                        .input('base_sin_mn', mssql.VarChar(250), 0)
                        .input('igv_mn', mssql.VarChar(250), 0)
                        .input('otros_mn', mssql.VarChar(250), '0')
                        .input('importe_mn', mssql.VarChar(250), 0)
                        .input('detraccion_mn', mssql.VarChar(250), 0)
                        .input('venta_diferida_mn', mssql.VarChar(250), '0')
                        .input('base_con_me', mssql.VarChar(250), 0)
                        .input('base_sin_me', mssql.VarChar(250), 0)
                        .input('igv_me', mssql.VarChar(250), 0)
                        .input('otros_me', mssql.VarChar(250), '0')
                        .input('importe_me', mssql.VarChar(250), 0)
                        .input('detraccion_me', mssql.VarChar(250), 0)
                        .input('venta_diferida_me', mssql.VarChar(250), '0')
                        .input('dfecha_venc', mssql.Date, '1900/01/01')
                        .input('detraccion_sn', mssql.VarChar(250), 'N')
                        .input('ccod_detraccion', mssql.VarChar(250), '00')
                        .input('numero_dt', mssql.VarChar(250), '')
                        .input('fecha_dt', mssql.Date, '1900/01/01')
                        .input('cnum_ctacte', mssql.VarChar(250), req.body.erp_codcaja)
                        .input('ing_egr', mssql.VarChar(250), 'ING')
                        .input('caj_ban', mssql.VarChar(250), 'CAJ')
                        .input('n_planilla', mssql.VarChar(250), '')
                        .input('cobrador', mssql.VarChar(250), '00')
                        .input('SN_diferida', mssql.VarChar(250), 'N')
                        .input('fecha_diferida', mssql.Date, req.body.fecha_doc)
                        .input('fecha_ref2', mssql.Date, req.body.fecha_doc)
                        .input('erp_forpag', mssql.VarChar(250), '00')
                        .input('erp_percepcion_mn', mssql.VarChar(250), 0)
                        .input('erp_percepcion_me', mssql.VarChar(250), 0)
                        .input('erp_cierre_caj_s_n', mssql.VarChar(250), 'N')
                        .input('erp_resp_cierre', mssql.VarChar(250), '00')
                        .input('erp_fecha_cierre', mssql.Date, '1900/01/01')
                        .input('erp_observacion_cierre', mssql.VarChar(250), '')
                        .input('erp_responsable', mssql.VarChar(250), '00')
                        .input('pc_user', mssql.VarChar(250), '')
                        .input('pc_fecha', mssql.Date, req.body.fecha_doc)
                        .input('pc_ip', mssql.VarChar(250), '')
                        .input('erp_porcentaje_percep', mssql.VarChar(250), '0')
                        .input('erp_porcent_igv', mssql.VarChar(250), '0')
                        .input('erp_nro_dias', mssql.VarChar(250), '0')
                        .input('erp_porcent_detraccion', mssql.VarChar(250), '0')
                        .input('erp_percepcion_sn', mssql.VarChar(250), 'N')
                        .input('erp_porc_percep', mssql.VarChar(250), '0')
                        .input('erp_reten_mn', mssql.VarChar(250), '0')
                        .input('erp_reten_me', mssql.VarChar(250), '0')
                        .input('erp_descuento_mn', mssql.VarChar(250), '0')
                        .input('erp_descuento_me', mssql.VarChar(250), '0')
                        .input('erp_comision_mn', mssql.VarChar(250), '0')
                        .input('erp_comision_me', mssql.VarChar(250), '0')
                        .input('erp_retencion_sn', mssql.VarChar(250), 'N')
                        .input('erp_porc_retencion', mssql.VarChar(250), '0')
                        .input('erp_serie_ne_ref', mssql.VarChar(250), '')
                        .input('erp_numer_ne_ref', mssql.VarChar(250), '')
                        .input('usuario', mssql.VarChar(250), usuario)
                        .input('erp_tipo_aporte', mssql.VarChar(250), '')
                        .input('erp_afp', mssql.VarChar(250), '')
                        .input('erp_nro_cups', mssql.VarChar(250), '')
                        .input('erp_flujo_mixta', mssql.VarChar(250), '')
                        .input('erp_motivo_venta', mssql.VarChar(250), '01')
                        .input('erp_dsubtotal', mssql.VarChar(250), '0')
                        .input('erp_ddescuento', mssql.VarChar(250), '0')
                        .input('erp_digv', mssql.VarChar(250), '0')
                        .input('erp_dimporte', mssql.VarChar(250), '0')
                        .input('erp_dpercepcion', mssql.VarChar(250), '0')
                        .input('erp_dtotal', mssql.VarChar(250), '0')
                        .input('erp_gestor', mssql.VarChar(250), '00')
                        .input('erp_usuario', mssql.VarChar(250), usuario)
                        .input('nombre_pc', mssql.VarChar(250), '')
                        .input('Fecha_Pc', mssql.Date, req.body.Pc_Fecha)
                        .input('Ip_pc', mssql.VarChar(250), '')
                        .input('clasif_bien_servicio', mssql.VarChar(250), '')
                        .input('ccod_retencion_no_domic', mssql.VarChar(250),  '00')
                        .input('retencion_no_domic_sn', mssql.VarChar(250), 'N')
                        .input('retencion_no_domic_mn', mssql.VarChar(250), '0')
                        .input('retencion_no_domic_me', mssql.VarChar(250), '0')
                        .input('erp_porcent_retencion_no_domic', mssql.VarChar(250), '0')
                        .input('saldo_actual_caja', mssql.VarChar(250), '0')
                        .input('icbper', mssql.VarChar(250), 0)
                        .input('icbper_mn', mssql.VarChar(250), 0)
                        .input('icbper_me', mssql.VarChar(250), 0)
                        .input('ruta_pdf', mssql.VarChar(250), '')
                        .query("Insert Into hmovconc ("+
                            "ccod_empresa, \n"+
                            "ejercon, \n"+
                            "periodo_con, \n"+
                            "ccod_svoucher, \n"+
                            "cnum_doc, \n"+
                            "automatico, \n"+
                            "dfecha_doc, \n"+
                            "fecha_referencia, \n"+
                            "tipo2, \n"+
                            "serie2, \n"+
                            "numero2, \n"+
                            "dfecha_docref, \n"+
                            "ctip_docref, \n"+
                            "cserie_docref, \n"+
                            "cnum_docref, \n"+
                            "ctip_auxiliar, \n"+
                            "ccod_anexo, \n"+
                            "cnom_anexo, \n"+
                            "cmoneda, \n"+
                            "ctip_cambio, \n"+
                            "tipo_cambio, \n"+
                            "tc_ref, \n"+
                            "tipo_registro, \n"+
                            "glosa, \n"+
                            "estado, \n"+
                            "dest_operacion, \n"+
                            "modulo_origen, \n"+
                            "a_dua, \n"+
                            "mnbaseimpgrav, \n"+
                            "mnbaseimpnograv, \n"+
                            "mnigvgrav, \n"+
                            "nimporte, \n"+
                            "otros_tributos, \n"+
                            "ventas_diferidas, \n"+
                            "base_con_mn, \n"+
                            "base_sin_mn, \n"+
                            "igv_mn, \n"+
                            "otros_mn, \n"+
                            "importe_mn, \n"+
                            "detraccion_mn, \n"+
                            "venta_diferida_mn, \n"+
                            "base_con_me, \n"+
                            "base_sin_me, \n"+
                            "igv_me, \n"+
                            "otros_me, \n"+
                            "importe_me, \n"+
                            "detraccion_me, \n"+
                            "venta_diferida_me, \n"+
                            "dfecha_venc, \n"+
                            "detraccion_sn, \n"+
                            "ccod_detraccion, \n"+
                            "numero_dt, \n"+
                            "fecha_dt, \n"+
                            "cnum_ctacte, \n"+
                            "ing_egr, \n"+
                            "caj_ban, \n"+
                            "n_planilla, \n"+
                            "cobrador, \n"+
                            "SN_diferida, \n"+
                            "fecha_diferida, \n"+
                            "fecha_ref2, \n"+
                            "erp_forpag, \n"+
                            "erp_percepcion_mn, \n"+
                            "erp_percepcion_me, \n"+
                            "erp_cierre_caj_s_n, \n"+
                            "erp_resp_cierre, \n"+
                            "erp_fecha_cierre, \n"+
                            "erp_observacion_cierre, \n"+
                            "erp_responsable, \n"+
                            "pc_user, \n"+
                            "pc_fecha, \n"+
                            "pc_ip, \n"+
                            "erp_porcentaje_percep, \n"+
                            "erp_porcent_igv, \n"+
                            "erp_nro_dias, \n"+
                            "erp_porcent_detraccion, \n"+
                            "erp_percepcion_sn, \n"+
                            "erp_porc_percep, \n"+
                            "erp_reten_mn, \n"+
                            "erp_reten_me, \n"+
                            "erp_descuento_mn, \n"+
                            "erp_descuento_me, \n"+
                            "erp_comision_mn, \n"+
                            "erp_comision_me, \n"+
                            "erp_retencion_sn, \n"+
                            "erp_porc_retencion, \n"+
                            "erp_serie_ne_ref, \n"+
                            "erp_numer_ne_ref, \n"+
                            "usuario, \n"+
                            "erp_tipo_aporte, \n"+
                            "erp_afp, \n"+
                            "erp_nro_cups, \n"+
                            "erp_flujo_mixta, \n"+
                            "erp_motivo_venta, \n"+
                            "erp_dsubtotal, \n"+
                            "erp_ddescuento, \n"+
                            "erp_digv, \n"+
                            "erp_dimporte, \n"+
                            "erp_dpercepcion, \n"+
                            "erp_dtotal, \n"+
                            "erp_gestor, \n"+
                            "erp_usuario, \n"+
                            "nombre_pc, \n"+
                            "Fecha_Pc, \n"+
                            "Ip_pc, \n"+
                            "clasif_bien_servicio, \n"+
                            "ccod_retencion_no_domic, \n"+
                            "retencion_no_domic_sn, \n"+
                            "retencion_no_domic_mn, \n"+
                            "retencion_no_domic_me, \n"+
                            "erp_porcent_retencion_no_domic, \n"+
                            "saldo_actual_caja, \n"+
                            "icbper, \n"+
                            "icbper_mn, \n"+
                            "icbper_me, \n"+
                            "ruta_pdf \n"+
                            ") values ( \n"+
                            '@ccod_empresa, \n'+
                            '@ejercon, \n'+
                            '@periodo_con, \n'+
                            '@ccod_svoucher, \n'+
                            '@cnum_doc, \n'+
                            '@automatico, \n'+
                            '@dfecha_doc, \n'+
                            '@fecha_referencia, \n'+
                            '@tipo2, \n'+
                            '@serie2, \n'+
                            '@numero2, \n'+
                            '@dfecha_docref, \n'+
                            '@ctip_docref, \n'+
                            '@cserie_docref, \n'+
                            '@cnum_docref, \n'+
                            '@ctip_auxiliar, \n'+
                            '@ccod_anexo, \n'+
                            '@cnom_anexo, \n'+
                            '@cmoneda, \n'+
                            '@ctip_cambio, \n'+
                            '@tipo_cambio, \n'+
                            '@tc_ref, \n'+
                            '@tipo_registro, \n'+
                            '@glosa, \n'+
                            '@estado, \n'+
                            '@dest_operacion, \n'+
                            '@modulo_origen, \n'+
                            '@a_dua, \n'+
                            '@mnbaseimpgrav, \n'+
                            '@mnbaseimpnograv, \n'+
                            '@mnigvgrav, \n'+
                            '@nimporte, \n'+
                            '@otros_tributos, \n'+
                            '@ventas_diferidas, \n'+
                            '@base_con_mn, \n'+
                            '@base_sin_mn, \n'+
                            '@igv_mn, \n'+
                            '@otros_mn, \n'+
                            '@importe_mn, \n'+
                            '@detraccion_mn, \n'+
                            '@venta_diferida_mn, \n'+
                            '@base_con_me, \n'+
                            '@base_sin_me, \n'+
                            '@igv_me, \n'+
                            '@otros_me, \n'+
                            '@importe_me, \n'+
                            '@detraccion_me, \n'+
                            '@venta_diferida_me, \n'+
                            '@dfecha_venc, \n'+
                            '@detraccion_sn, \n'+
                            '@ccod_detraccion, \n'+
                            '@numero_dt, \n'+
                            '@fecha_dt, \n'+
                            '@cnum_ctacte, \n'+
                            '@ing_egr, \n'+
                            '@caj_ban, \n'+
                            '@n_planilla, \n'+
                            '@cobrador, \n'+
                            '@SN_diferida, \n'+
                            '@fecha_diferida, \n'+
                            '@fecha_ref2, \n'+
                            '@erp_forpag, \n'+
                            '@erp_percepcion_mn, \n'+
                            '@erp_percepcion_me, \n'+
                            '@erp_cierre_caj_s_n, \n'+
                            '@erp_resp_cierre, \n'+
                            '@erp_fecha_cierre, \n'+
                            '@erp_observacion_cierre, \n'+
                            '@erp_responsable, \n'+
                            '@pc_user, \n'+
                            '@pc_fecha, \n'+
                            '@pc_ip, \n'+
                            '@erp_porcentaje_percep, \n'+
                            '@erp_porcent_igv, \n'+
                            '@erp_nro_dias, \n'+
                            '@erp_porcent_detraccion, \n'+
                            '@erp_percepcion_sn, \n'+
                            '@erp_porc_percep, \n'+
                            '@erp_reten_mn, \n'+
                            '@erp_reten_me, \n'+
                            '@erp_descuento_mn, \n'+
                            '@erp_descuento_me, \n'+
                            '@erp_comision_mn, \n'+
                            '@erp_comision_me, \n'+
                            '@erp_retencion_sn, \n'+
                            '@erp_porc_retencion, \n'+
                            '@erp_serie_ne_ref, \n'+
                            '@erp_numer_ne_ref, \n'+
                            '@usuario, \n'+
                            '@erp_tipo_aporte, \n'+
                            '@erp_afp, \n'+
                            '@erp_nro_cups, \n'+
                            '@erp_flujo_mixta, \n'+
                            '@erp_motivo_venta, \n'+
                            '@erp_dsubtotal, \n'+
                            '@erp_ddescuento, \n'+
                            '@erp_digv, \n'+
                            '@erp_dimporte, \n'+
                            '@erp_dpercepcion, \n'+
                            '@erp_dtotal, \n'+
                            '@erp_gestor, \n'+
                            '@erp_usuario, \n'+
                            '@nombre_pc, \n'+
                            '@Fecha_Pc, \n'+
                            '@Ip_pc, \n'+
                            '@clasif_bien_servicio, \n'+
                            '@ccod_retencion_no_domic, \n'+
                            '@retencion_no_domic_sn, \n'+
                            '@retencion_no_domic_mn, \n'+
                            '@retencion_no_domic_me, \n'+
                            '@erp_porcent_retencion_no_domic, \n'+
                            '@saldo_actual_caja, \n'+
                            '@icbper, \n'+
                            '@icbper_mn, \n'+
                            '@icbper_me, \n'+
                            '@ruta_pdf) \n'
                        );
                        //#endregion 
                    
                        var fila_contable_cancelacion = [];
                        //#region Cuenta Caja Banco

                        var valores_caja={
                            SubTotal_Gravado: req.body.erp_Dsubtotal,
                            SubTotal_No_Gravado: 0,
                            Igv: req.body.erp_Digv,
                            Icbper: req.body.erp_ICBPER,
                            Total: (req.body.erp_Dtotal * 1)+(req.body.erp_vuelto * 1),
                            Detraccion: 0,
                            Percepcion: 0,
                            Retencion: 0,
                            Comision: 0,
                            tc: req.body.tasa_cambio,
                            moneda: req.body.moneda,
                        }
                        var calculos_contable_caja = await helpers.getCalculosContables(valores_caja)

                        const request_contabilidad_detalle_caja  = new mssql.Request(transaction);
                        const result_contabilidad_detalle_cuenta_caja = await request_contabilidad_detalle_caja
                        .input('codigo_empresa',mssql.VarChar(250), codigo_empresa)
                        .input('codigo',mssql.VarChar(250), req.body.erp_codcaja)
                        .query(
                            "select \n"+
                            "Hctacteb.cnum_ctacte as Codigo, \n"+
                            "Hctacteb.descripcion as Nombre, \n"+
                            "rtrim(ltrim(Hctacteb.ccod_banco)) + ' - ' + Hbancos.cnom_banco as Banco, \n"+
                            "rtrim(ltrim(Hctacteb.ccod_banco))  as Codigo_Banco, \n"+
                            "Hbancos.cnom_banco as Nombre_Banco, \n"+
                            "RTRIM(LTRIM(Hctacteb.cmoneda)) as Moneda, \n"+
                            "rtrim(ltrim(Hctacteb.ccuenta)) +' - '+ Hplancon.cnom_cuenta as Cuenta, \n"+
                            "Hctacteb.conciliacion as Conciliacion, \n"+
                            "Hctacteb.caj_ban as Tipo_Caja, \n"+
                            "Hctacteb.tipo_doc_pred as Tipo_Documento_Predeterminado, \n"+
                            "RTRIM(LTRIM(Hctacteb.tipo_doc)) as Tipo_Documento, \n"+
                            "Hctacteb.correlativo as Correlativo, \n"+
                            "Hctacteb.erp_logo as Logo, \n"+
                            "Hctacteb.si_pto_vta as Si_Pto_Venta, \n"+
                            "Hctacteb.si_fdo_fjo as Si_Fondo_Fijo, \n"+
                            "Hctacteb.si_banco as Si_Banco, \n"+
                            "Hctacteb.Hctacteb_fechmodificacion as FechaModificacion, \n"+
                            "Hctacteb.NombreEquipo as NombreEquipo, \n"+
                            "convert(varchar(8),Hctacteb.HoraPc,108) as Hora, \n"+
                            "Hctacteb.Ip_Cliente as IP_Cliente, \n"+
                            "Hctacteb.ErpUsuario as ErpUsuario, \n"+
                            "rtrim(ltrim(Hctacteb.ccuenta))as Codigo_Cuenta_Contable \n"+
                            "from \n"+
                            "Hctacteb Inner Join Hbancos On \n"+
                            "Hctacteb.ccod_banco = Hbancos.ccod_banco and\n"+
                            "Hctacteb.ccod_empresa = Hbancos.ccod_empresa \n"+
                            "left Join Hplancon On \n"+
                            "Hctacteb.ccod_empresa = Hplancon.ccod_empresa And \n"+
                            "Hctacteb.ccuenta = Hplancon.ccuenta \n"+
                            "where \n"+
                            "Hctacteb.ccod_empresa= @codigo_empresa \n"+
                            "and Hctacteb.cnum_ctacte =@codigo\n"
                        );

                        var recordset_contabilidad_detalle_cuenta_caja = result_contabilidad_detalle_cuenta_caja.recordset[0];

                        fila_contable_cancelacion.push({
                            cuenta_codigo : recordset_contabilidad_detalle_cuenta_caja.Codigo_Cuenta_Contable,
                            tipo_auxiliar : '10',
                            codigo_auxiliar : '',
                            nombre_auxiliar : '',
                            debe : req.body.tipo_documento == "07" ? 0 : calculos_contable_caja.Total,
                            debe_mn : req.body.tipo_documento == "07" ? 0 : calculos_contable_caja.Total_MN,
                            debe_me : req.body.tipo_documento == "07" ? 0 : calculos_contable_caja.Total_ME,
                            haber : req.body.tipo_documento == "07" ? calculos_contable_caja.Total : 0,
                            haber_mn : req.body.tipo_documento == "07" ? calculos_contable_caja.Total_MN : 0,
                            haber_me : req.body.tipo_documento == "07" ? calculos_contable_caja.Total_ME : 0,
                            d_h : req.body.tipo_documento == "07" ? 'H' : 'D',
                            Si_Diferencia : 'N',
                            Si_Transferencia : 'N',
                            Tipo_Origen : 'N',
                            Si_Detraccion : 'N',
                            Si_Retencion : 'N',
                            Si_Percepcion : 'N',
                            Producto_Codigo : '',
                            Producto_Item : '0',
                        });

                        if ((req.body.erp_vuelto * 1) > 0) {

                            var valores_vuelto={
                                SubTotal_Gravado: req.body.erp_Dsubtotal,
                                SubTotal_No_Gravado: 0,
                                Igv: req.body.erp_Digv,
                                Icbper: req.body.erp_ICBPER,
                                Total: (req.body.erp_vuelto * 1),
                                Detraccion: 0,
                                Percepcion: 0,
                                Retencion: 0,
                                Comision: 0,
                                tc: req.body.tasa_cambio,
                                moneda: req.body.moneda,
                            }
                            var calculos_contable_vuelto = await helpers.getCalculosContables(valores_vuelto)

                            fila_contable_cancelacion.push({
                                cuenta_codigo : recordset_contabilidad_detalle_cuenta_caja.Codigo_Cuenta_Contable,
                                tipo_auxiliar : '10',
                                codigo_auxiliar : '',
                                nombre_auxiliar : '',
                                debe : req.body.tipo_documento == "07" ? calculos_contable_vuelto.Total : 0,
                                debe_mn : req.body.tipo_documento == "07" ? calculos_contable_vuelto.Total_MN : 0,
                                debe_me : req.body.tipo_documento == "07" ? calculos_contable_vuelto.Total_ME : 0,
                                haber : req.body.tipo_documento == "07" ? 0 : calculos_contable_vuelto.Total,
                                haber_mn : req.body.tipo_documento == "07" ? 0 : calculos_contable_vuelto.Total_MN,
                                haber_me : req.body.tipo_documento == "07" ? 0 : calculos_contable_vuelto.Total_ME,
                                d_h : req.body.tipo_documento == "07" ? 'D' : 'H',
                                Si_Diferencia : 'N',
                                Si_Transferencia : 'N',
                                Tipo_Origen : 'N',
                                Si_Detraccion : 'N',
                                Si_Retencion : 'N',
                                Si_Percepcion : 'N',
                                Producto_Codigo : '',
                                Producto_Item : '0',
                            });
                        }
                        //#endregion

                        //#region Cuenta de Venta del Grupo Cliente
                        const request_contabilidad_detalle_cuenta_factura  = new mssql.Request(transaction);
                        const result_contabilidad_detalle_cuenta_factura = await request_contabilidad_detalle_cuenta_factura
                        .input('codigo_empresa',mssql.VarChar(250), codigo_empresa)
                        .input('tipo',mssql.VarChar(250), '12')
                        .input('codigo',mssql.VarChar(250), req.body.codigo_cliente)
                        .input('moneda',mssql.VarChar(250), req.body.moneda)
                        .query(
                            "Select \n"+
                            "ERP_CTAGRU.erp_ctagru as Cuenta,  \n"+
                            "Hplancon.cnom_cuenta as Nombre, \n"+
                            "Hplancon.dh as D_H \n"+
                            "From hanexos Inner Join ERP_CTAGRU On \n"+
                            "hanexos.ccod_empresa = ERP_CTAGRU.ERP_CODEMP  \n"+
                            "And hanexos.ctip_auxiliar = ERP_CTAGRU.ERP_TIPGRU  \n"+
                            "And hanexos.cgrupo_cliente = ERP_CTAGRU.ERP_CODGRU \n"+
                            "Inner Join Hplancon On \n"+
                            "ERP_CTAGRU.ERP_CODEMP = Hplancon.ccod_empresa  \n"+
                            "And ERP_CTAGRU.erp_ctagru = Hplancon.ccuenta \n"+
                            "Where  \n"+
                            "hanexos.ccod_empresa = @codigo_empresa  \n"+
                            "And hanexos.ctip_auxiliar = @tipo  \n"+
                            "And hanexos.ccod_anexo = @codigo  \n"+
                            "and ERP_CTAGRU.erp_moncta = @moneda  \n"+
                            "And ERP_CTAGRU.ERP_TIPCTA = 'CTA' \n"
                        );
                        var recordset_contabilidad_detalle_cuenta_factura = result_contabilidad_detalle_cuenta_factura.recordset[0];
                        fila_contable_cancelacion.push({
                            cuenta_codigo : recordset_contabilidad_detalle_cuenta_factura.Cuenta,
                            tipo_auxiliar : '12',
                            codigo_auxiliar : req.body.codigo_cliente,
                            nombre_auxiliar : req.body.nombre_cliente,
                            debe : req.body.tipo_documento == "07" ? calculos_contable.Total : 0,
                            debe_mn : req.body.tipo_documento == "07" ? calculos_contable.Total_MN : 0,
                            debe_me : req.body.tipo_documento == "07" ? calculos_contable.Total_ME : 0,
                            haber : req.body.tipo_documento == "07" ? 0 : calculos_contable.Total,
                            haber_mn : req.body.tipo_documento == "07" ? 0 : calculos_contable.Total_MN,
                            haber_me : req.body.tipo_documento == "07" ? 0 : calculos_contable.Total_ME,
                            d_h : req.body.tipo_documento == "07" ? 'D' : 'H',
                            Si_Diferencia : 'N',
                            Si_Transferencia : 'N',
                            Tipo_Origen : 'F',
                            Si_Detraccion : 'N',
                            Si_Retencion : 'N',
                            Si_Percepcion : 'N',
                            Producto_Codigo : '',
                            Producto_Item : '0',
                        });
                        //#endregion

                        // #region  grabar detalle cancelacion
                        var nitem = 0;
                        for(var j=0;j<fila_contable_cancelacion.length;j++){
                            nitem++;
                            var request_contabilidad_detalle  = new mssql.Request(transaction);
                            await request_contabilidad_detalle
                            .input('ccod_empresa',mssql.VarChar(250), codigo_empresa)
                            .input('ejercon',mssql.VarChar(250), ejercicio)
                            .input('periodo_con',mssql.VarChar(250), periodo)
                            .input('ccod_svoucher',mssql.VarChar(250), '01')
                            .input('cnum_doc',mssql.VarChar(250), numero_correlativo_cancelacion)
                            .input('nitem',mssql.VarChar(250), nitem)
                            .input('ccuenta',mssql.VarChar(250), fila_contable_cancelacion[j].cuenta_codigo)
                            .input('ctip_auxiliar',mssql.VarChar(250), fila_contable_cancelacion[j].tipo_auxiliar)
                            .input('ccod_auxiliar',mssql.VarChar(250), fila_contable_cancelacion[j].codigo_auxiliar)
                            .input('cnom_auxiliar',mssql.VarChar(250), fila_contable_cancelacion[j].nombre_auxiliar)
                            .input('debe',mssql.VarChar(250), fila_contable_cancelacion[j].debe)
                            .input('haber',mssql.VarChar(250), fila_contable_cancelacion[j].haber)
                            .input('mndebe',mssql.VarChar(250), fila_contable_cancelacion[j].debe_mn)
                            .input('mnhaber',mssql.VarChar(250), fila_contable_cancelacion[j].haber_mn)
                            .input('medebe',mssql.VarChar(250), fila_contable_cancelacion[j].debe_me)
                            .input('mehaber',mssql.VarChar(250), fila_contable_cancelacion[j].haber_me)
                            .input('mnretencion',mssql.VarChar(250), '0')
                            .input('erp_codune',mssql.VarChar(250), req.body.codigo_unidad_negocio)
                            .input('ccod_cencos',mssql.VarChar(250), req.body.codigo_centro_costos)
                            .input('ot',mssql.VarChar(250), req.body.orden_trabajo)
                            .input('d_h',mssql.VarChar(250), fila_contable_cancelacion[j].d_h)
                            .input('ccod_almacen_docref',mssql.VarChar(250), '')
                            .input('ctip_docref',mssql.VarChar(250), fila_contable_cancelacion[j].Tipo_Documento || req.body.tipo_documento)
                            .input('cnum_serieref',mssql.VarChar(250),fila_contable_cancelacion[j].Serie_Documento ||  req.body.serie)
                            .input('cnum_docref',mssql.VarChar(250),fila_contable_cancelacion[j].Numero_Documento ||  numero_correlativo)
                            .input('dfechadocref',mssql.VarChar(250),fila_contable_cancelacion[j].Fecha_Documento ||  req.body.fecha_doc)
                            .input('tipodoc_2',mssql.VarChar(250), fila_contable_cancelacion[j].Tipo_Documento_Referencia || req.body.tipo_documento_referencia)
                            .input('seriedoc_2',mssql.VarChar(250), fila_contable_cancelacion[j].Serie_Documento_Referencia || req.body.serie_documento_referencia)
                            .input('numdoc_2',mssql.VarChar(250), fila_contable_cancelacion[j].Numero_Documento_Referencia || req.body.numero_documento_referencia)
                            .input('fechadoc_2',mssql.VarChar(250), fila_contable_cancelacion[j].Fecha_Documento_Referencia || req.body.fecha_referencia)
                            .input('monto_ref',mssql.VarChar(250), '0')
                            .input('CMONEDA_DOCREF',mssql.VarChar(250), req.body.moneda)
                            .input('TIPO_CAMBIO_DOCREF',mssql.VarChar(250), req.body.tasa_cambio)
                            .input('subvoucher_ref',mssql.VarChar(250), '06')
                            .input('fecha_vencimiento',mssql.VarChar(250), req.body.fecha_validez)
                            .input('glosa',mssql.VarChar(250), 'Cancelación de Factura')
                            .input('movimiento_guia',mssql.VarChar(250), '')
                            .input('tipmov_guia',mssql.VarChar(250), '')
                            .input('serie',mssql.VarChar(250), '')
                            .input('numero',mssql.VarChar(250), '')
                            .input('iten_guia',mssql.VarChar(250), '0')
                            .input('cta_diferencia',mssql.VarChar(250), fila_contable_cancelacion[j].Si_Diferencia)
                            .input('cuenta_trans',mssql.VarChar(250), fila_contable_cancelacion[j].Si_Transferencia)
                            .input('item_transferencia',mssql.VarChar(250), '0')
                            .input('tipo_origen',mssql.VarChar(250), fila_contable_cancelacion[j].Tipo_Origen)
                            .input('pago_mn',mssql.VarChar(250), '0')
                            .input('pago_me',mssql.VarChar(250), '0')
                            .input('pago_rt',mssql.VarChar(250), '0')
                            .input('cta_detracion',mssql.VarChar(250), fila_contable_cancelacion[j].Si_Detraccion)
                            .input('cta_retencion',mssql.VarChar(250), fila_contable_cancelacion[j].Si_Retencion)
                            .input('cta_percepcion',mssql.VarChar(250), fila_contable_cancelacion[j].Si_Percepcion)
                            .input('CCOD_BANCO',mssql.VarChar(250), '00')
                            .input('CCOD_SIT_LETRA',mssql.VarChar(250), '00')
                            .input('NRO_UNICO',mssql.VarChar(250), '')
                            .input('erp_codven',mssql.VarChar(250), req.body.vendedor_1)
                            .input('erp_forpag',mssql.VarChar(250), req.body.forma_pago)
                            .input('erp_Nro_Ope',mssql.VarChar(250), '')
                            .input('erp_conciliado',mssql.VarChar(250), 'N')
                            .input('erp_percon_con',mssql.VarChar(250), '')
                            .input('erp_doccan',mssql.VarChar(250), 'N')
                            .input('erp_codaval',mssql.VarChar(250), '')
                            .input('erp_canje',mssql.VarChar(250), 'N')
                            .input('dt_aplica',mssql.VarChar(250), 'N')
                            .input('erp_aplica',mssql.VarChar(250), 'N')
                            .input('erp_numcta',mssql.VarChar(250), '')
                            .input('erp_itecta',mssql.VarChar(250), '0')
                            .input('erp_retencion_aplica',mssql.VarChar(250), 'N')
                            .input('erp_asiento_patron',mssql.VarChar(250), '00')
                            .input('erp_provision_ff',mssql.VarChar(250), 'N')
                            .input('erp_resp_det',mssql.VarChar(250), '00')
                            .input('erp_presupuesto',mssql.VarChar(250), '00')
                            .input('erp_presupuesto_sn',mssql.VarChar(250), 'N')
                            .input('erp_codven2',mssql.VarChar(250), req.body.vendedor_2)
                            .input('erp_cta_costo_sn',mssql.VarChar(250), 'N')
                            .input('clasif_bien_servicio',mssql.VarChar(250), '')
                            .input('cta_retencion_no_domic',mssql.VarChar(250), '')
                            .input('rt_aplica_no_domic',mssql.VarChar(250), '')
                            .input('retencion_s_n',mssql.VarChar(250), '')
                            .input('retencion_porcent',mssql.VarChar(250), '0')
                            .input('retencion_doc_serie',mssql.VarChar(250), '')
                            .input('retencion_doc_numero',mssql.VarChar(250), '')
                            .input('ccod_articulo',mssql.VarChar(250), fila_contable_cancelacion[j].Producto_Codigo)
                            .input('nitem_ref',mssql.VarChar(250), fila_contable_cancelacion[j].Producto_Item)
                            .query("Insert Into hmovcond ("+
                            "ccod_empresa, \n"+
                            "ejercon, \n"+
                            "periodo_con, \n"+
                            "ccod_svoucher, \n"+
                            "cnum_doc, \n"+
                            "nitem, \n"+
                            "ccuenta, \n"+
                            "ctip_auxiliar, \n"+
                            "ccod_auxiliar, \n"+
                            "cnom_auxiliar, \n"+
                            "debe, \n"+
                            "haber, \n"+
                            "mndebe, \n"+
                            "mnhaber, \n"+
                            "medebe, \n"+
                            "mehaber, \n"+
                            "mnretencion, \n"+
                            "erp_codune, \n"+
                            "ccod_cencos, \n"+
                            "ot, \n"+
                            "d_h, \n"+
                            "ccod_almacen_docref, \n"+
                            "ctip_docref, \n"+
                            "cnum_serieref, \n"+
                            "cnum_docref, \n"+
                            "dfechadocref, \n"+
                            "tipodoc_2, \n"+
                            "seriedoc_2, \n"+
                            "numdoc_2, \n"+
                            "fechadoc_2, \n"+
                            "monto_ref, \n"+
                            "CMONEDA_DOCREF, \n"+
                            "TIPO_CAMBIO_DOCREF, \n"+
                            "subvoucher_ref, \n"+
                            "fecha_vencimiento, \n"+
                            "glosa, \n"+
                            "movimiento_guia, \n"+
                            "tipmov_guia, \n"+
                            "serie, \n"+
                            "numero, \n"+
                            "iten_guia, \n"+
                            "cta_diferencia, \n"+
                            "cuenta_trans, \n"+
                            "item_transferencia, \n"+
                            "tipo_origen, \n"+
                            "pago_mn, \n"+
                            "pago_me, \n"+
                            "pago_rt, \n"+
                            "cta_detracion, \n"+
                            "cta_retencion, \n"+
                            "cta_percepcion, \n"+
                            "CCOD_BANCO, \n"+
                            "CCOD_SIT_LETRA, \n"+
                            "NRO_UNICO, \n"+
                            "erp_codven, \n"+
                            "erp_forpag, \n"+
                            "erp_Nro_Ope, \n"+
                            "erp_conciliado, \n"+
                            "erp_percon_con, \n"+
                            "erp_doccan, \n"+
                            "erp_codaval, \n"+
                            "erp_canje, \n"+
                            "dt_aplica, \n"+
                            "erp_aplica, \n"+
                            "erp_numcta, \n"+
                            "erp_itecta, \n"+
                            "erp_retencion_aplica, \n"+
                            "erp_asiento_patron, \n"+
                            "erp_provision_ff, \n"+
                            "erp_resp_det, \n"+
                            "erp_presupuesto, \n"+
                            "erp_presupuesto_sn, \n"+
                            "erp_codven2, \n"+
                            "erp_cta_costo_sn, \n"+
                            "clasif_bien_servicio, \n"+
                            "cta_retencion_no_domic, \n"+
                            "rt_aplica_no_domic, \n"+
                            "retencion_s_n, \n"+
                            "retencion_porcent, \n"+
                            "retencion_doc_serie, \n"+
                            "retencion_doc_numero, \n"+
                            "ccod_articulo, \n"+
                            "nitem_ref \n"+
                            ") values ( \n"+
                            "@ccod_empresa, \n"+
                            "@ejercon, \n"+
                            "@periodo_con, \n"+
                            "@ccod_svoucher, \n"+
                            "@cnum_doc, \n"+
                            "@nitem, \n"+
                            "@ccuenta, \n"+
                            "@ctip_auxiliar, \n"+
                            "@ccod_auxiliar, \n"+
                            "@cnom_auxiliar, \n"+
                            "@debe, \n"+
                            "@haber, \n"+
                            "@mndebe, \n"+
                            "@mnhaber, \n"+
                            "@medebe, \n"+
                            "@mehaber, \n"+
                            "@mnretencion, \n"+
                            "@erp_codune, \n"+
                            "@ccod_cencos, \n"+
                            "@ot, \n"+
                            "@d_h, \n"+
                            "@ccod_almacen_docref, \n"+
                            "@ctip_docref, \n"+
                            "@cnum_serieref, \n"+
                            "@cnum_docref, \n"+
                            "@dfechadocref, \n"+
                            "@tipodoc_2, \n"+
                            "@seriedoc_2, \n"+
                            "@numdoc_2, \n"+
                            "@fechadoc_2, \n"+
                            "@monto_ref, \n"+
                            "@CMONEDA_DOCREF, \n"+
                            "@TIPO_CAMBIO_DOCREF, \n"+
                            "@subvoucher_ref, \n"+
                            "@fecha_vencimiento, \n"+
                            "@glosa, \n"+
                            "@movimiento_guia, \n"+
                            "@tipmov_guia, \n"+
                            "@serie, \n"+
                            "@numero, \n"+
                            "@iten_guia, \n"+
                            "@cta_diferencia, \n"+
                            "@cuenta_trans, \n"+
                            "@item_transferencia, \n"+
                            "@tipo_origen, \n"+
                            "@pago_mn, \n"+
                            "@pago_me, \n"+
                            "@pago_rt, \n"+
                            "@cta_detracion, \n"+
                            "@cta_retencion, \n"+
                            "@cta_percepcion, \n"+
                            "@CCOD_BANCO, \n"+
                            "@CCOD_SIT_LETRA, \n"+
                            "@NRO_UNICO, \n"+
                            "@erp_codven, \n"+
                            "@erp_forpag, \n"+
                            "@erp_Nro_Ope, \n"+
                            "@erp_conciliado, \n"+
                            "@erp_percon_con, \n"+
                            "@erp_doccan, \n"+
                            "@erp_codaval, \n"+
                            "@erp_canje, \n"+
                            "@dt_aplica, \n"+
                            "@erp_aplica, \n"+
                            "@erp_numcta, \n"+
                            "@erp_itecta, \n"+
                            "@erp_retencion_aplica, \n"+
                            "@erp_asiento_patron, \n"+
                            "@erp_provision_ff, \n"+
                            "@erp_resp_det, \n"+
                            "@erp_presupuesto, \n"+
                            "@erp_presupuesto_sn, \n"+
                            "@erp_codven2, \n"+
                            "@erp_cta_costo_sn, \n"+
                            "@clasif_bien_servicio, \n"+
                            "@cta_retencion_no_domic, \n"+
                            "@rt_aplica_no_domic, \n"+
                            "@retencion_s_n, \n"+
                            "@retencion_porcent, \n"+
                            "@retencion_doc_serie, \n"+
                            "@retencion_doc_numero, \n"+
                            "@ccod_articulo, \n"+
                            "@nitem_ref )\n"
                            );
                        }
                        // #endregion
                    }
                    //#endregion

                    transaction.commit(tErr => {if(tErr) {console.log(tErr)}})
                    res.send({estado: true, codigo: numero_correlativo, mensaje: ""});
                }
                //#endregion
                
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

router.post('/lista', async (req, res) => {
    try {
 
        const codigo_empresa = req.user.codigo_empresa

        switch (req.body.busqueda) {
            case "año_mes":
                var opcion = "and MONTH(hmovialc.dfecha_doc) = @mes AND YEAR(hmovialc.dfecha_doc) = @anio \n"
                break;
            case "rango_fechas":
                var opcion = "and hmovialc.dfecha_doc between @fecha_inicio and @fecha_final \n"
                break;
            case "todos":
                var opcion = " \n"
                break;
        }

        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('anio', mssql.VarChar(250), req.body.anio)
        .input('mes', mssql.VarChar(250), req.body.meses)
        .input('fecha_inicio', mssql.VarChar(250), req.body.fecha_inicio)
        .input('fecha_final', mssql.VarChar(250), req.body.fecha_final)
        .query(
            "SELECT \n"+
            "Halmacen.cnom_almacen as Punto_Venta, \n"+
            "Hmovialc.tipo_venta as Tipo_Venta, \n"+
            "hmovialc.ccod_movimiento as Tipo_Documento, \n"+
            "Hmovialc.cnum_doc as Numero, \n"+
            "cnum_serie as Motivo_Serie, \n"+
            "CONVERT(VARCHAR(50),Hmovialc.dfecha_doc,3) as Fecha, \n"+
            "CONVERT(VARCHAR(50),Hmovialc.dfecha_entr,3) as Fecha_Entrega, \n"+
            "Hmovialc.ccod_cliente as Codigo, \n"+
            "Hmovialc.cnom_cliente_v as Nombre, \n"+
            "Hfor_pag.cnom_forpago as Forma_Pago, \n"+
            "Hmovialc.cmoneda as Moneda, \n"+
            "Hmovialc.tipo_cambio as tc, \n"+
            "Hmovialc.nimporte as Importe, \n"+
            "Hvended.cnom_vendedor as vendedor, \n"+
            "Hmovialc.estado as Estado, \n"+
            "'' as Aprobado, \n"+
            "'' as Persona_Aprob, \n"+
            "'' as Fecha_aprob, \n"+
            "Hmovialc.atencion as Atencion, \n"+
            "Hmovialc.porcentaje as Porcentaje, \n"+
            "Hmovialc.usuario as Usuario, \n"+
            "Hmovialc.Pc_User as Nombre_Pc, \n"+
            "CONVERT(VARCHAR,Hmovialc.Pc_Fecha,3) as Fecha_Grab, \n"+
            "CONVERT(VARCHAR,Hmovialc.Pc_Fecha,24) as Hora_Grab, \n"+
            "Hmovialc.Pc_Ip as Ip_Pc, \n"+
            "hmovialc.ccod_movimiento as Codigo_Tipo_Documento, \n"+
            "Hmovialc.ccod_almacen as Codigo_Punto_Venta, \n"+
            "Hmovialc.cnum_serie as Codigo_Motivo_Serie, \n"+
            "hmovialc.estado_fe as Estado_Fe, \n"+
            "hmovialc.ctip_docref as Tipo_Referencia_Documento, \n"+
            "Hmovialc.cserie_docref as Motivo_Serie_Referencia_Documento, \n"+
            "Hmovialc.cnum_docref as Numero_Referencia_Documento \n"+
            "FROM Hmovialc with (nolock) INNER JOIN Halmacen with (nolock) ON \n"+
            "Hmovialc.ccod_empresa = Halmacen.ccod_empresa and \n"+
            "Hmovialc.ccod_almacen = Halmacen.ccod_almacen \n"+
            "Inner Join hfor_pag with (nolock) ON \n"+
            "Hmovialc.ccod_empresa = Hfor_pag.ccod_empresa and \n"+
            "Hmovialc.ccod_forpago = Hfor_pag.ccod_forpago \n"+
            "Inner Join Hvended with (nolock) On \n"+
            "Hmovialc.ccod_empresa = Hvended.ccod_empresa and \n"+
            "Hmovialc.ccod_vendedor = Hvended.ccod_vendedor \n"+
            "WHERE Hmovialc.ccod_empresa = @codigo_empresa \n"+opcion+
            "and modulo='Punto_Venta' \n"+
            "and ccod_movimiento <> '09'\n"+
            "order by ncorrel desc\n"  
        );
          
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/consultar', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa
        var codigo_punto_venta = req.body.codigo_punto_venta;

        if(codigo_punto_venta==""){
            codigo_punto_venta = req.user.codigo_punto_venta;
        }

        const pool = await poolPromise
        var lista = await pool
        .request()
        .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
        .input("ccod_almacen", mssql.VarChar(250), codigo_punto_venta)
        .input("CCOD_MOVIMIENTO", mssql.VarChar(250), req.body.tipo_documento)
        .input("ctip_movimiento", mssql.VarChar(250), req.body.tipo_movimiento)
        .input("CNUM_SERIE", mssql.VarChar(250), req.body.numero_serie)
        .input("CNUM_DOC", mssql.VarChar(250), req.body.numero_documento)
        .query(
            "select \n"+
            "case when hmovialc.ccod_movimiento ='01' then 'FACTURA' when hmovialc.ccod_movimiento ='03' then 'BOLETA' when hmovialc.ccod_movimiento ='07' then 'NOTA DE CRÉDITO' when hmovialc.ccod_movimiento ='08' then 'NOTA DE DÉBITO' else '' end as documento_nombre, \n"+
            "hmovialc.tipo_venta as documento_tipo, \n"+
            "hmovialc.ccod_almacen as documento_punto_venta_codigo, \n"+
            "hmovialc.ccod_movimiento as documento_tipo_movimiento, \n"+
            "hmovialc.cnum_serie as documento_motivo_venta_codigo, \n"+
            "(hmovialc.cnum_doc) as documento_numero, \n"+
            "CONVERT(VARCHAR(50), hmovialc.dfecha_doc, 103) as documento_fecha, \n"+
            "CONVERT(VARCHAR(50), hmovialc.dfecha_entr, 103) as documento_fecha_entrega, \n"+
            "CONVERT(VARCHAR(50), hmovialc.dfecha_val, 103) as documento_fecha_validez, \n"+
            "CONVERT(VARCHAR(50), hmovialc.dfecha_doc, 23) as documento_fecha_format23, \n"+
            "CONVERT(VARCHAR(50), hmovialc.dfecha_entr, 23) as documento_fecha_entrega_format23, \n"+
            "CONVERT(VARCHAR(50), hmovialc.dfecha_val, 23) as documento_fecha_validez_format23, \n"+
            "hmovialc.cmoneda as documento_moneda, \n"+
            "hmovialc.nimporte as documento_nimporte, \n"+
            "RTRIM(LTRIM(hmovialc.ccod_forpago)) as documento_forma_pago_codigo, \n"+
            "hmovialc.ccod_cliente as Codigo_Cliente, \n"+
            "hmovialc.cnom_cliente_v as cliente_nombre, \n"+
            "hmovialc.cnum_ruc_v as cliente_ruc, \n"+
            "hmovialc.estado as documento_estado, \n"+
            "hmovialc.si_igv as documento_mas_igv, \n"+
            "hmovialc.ctipo_cambio as nombre_tipo_cambio, \n"+
            "hmovialc.tipo_cambio as tipo_cambio, \n"+
            "hmovialc.lista_precios as documento_lista_precios, \n"+
            "'' AS documento_aprobacion_estado, \n"+
            "'' as documento_aprobacion_fecha, \n"+
            "'' as documento_aprobacion_codigo_responsable, \n"+
            "'' as documento_aprobacion_comentario, \n"+
            "hmovialc.ccod_cencos as documento_cencos_codigo, \n"+
            "hmovialc.porc_descuento as documento_descuento_porc, \n"+
            "hmovialc.ot as documento_ot_codigo, \n"+
            "hmovialc.pto_llegada_02 as documento_punto_llegada, \n"+
            "hmovialc.nro_dias as documento_dias, \n"+
            "LTRIM(RTRIM(hmovialc.pais)) as cliente_pais, \n"+
            "hmovialc.atencion as documento_atencion_estado, \n"+
            "hmovialc.porcentaje as documento_atencion_porcentaje, \n"+
            "'' as cliente_contacto_codigo, \n"+
            "LTRIM(RTRIM(hmovialc.ccod_vendedor)) as documento_vendedor1, \n"+
            "LTRIM(RTRIM(hmovialc.idvendedor2)) as documento_vendedor2, \n"+
            "hmovialc.erp_glosa as documento_glosa, \n"+
            "hmovialc.erp_codage as cliente_agencia, \n"+
            "hmovialc.usuario as usuario_codigo, \n"+
            "hmovialc.Pc_User as pc_user, \n"+
            "hmovialc.Pc_Fecha as pc_fecha, \n"+
            "hmovialc.Pc_Ip as pc_ip, \n"+
            "hmovialc.erp_presupuesto as presupuesto_codigo, \n"+
            "hmovialc.subtotal_sin_descuentos as documento_subtotal_sin_descuentos,\n"+
            "hmovialc.erp_Ddescuento as documento_descuento, \n"+
            "hmovialc.erp_Dsubtotal as documento_subtotal, \n"+
            "hmovialc.erp_Digv as documento_igv, \n"+
            "hmovialc.igv_icbper as documento_igv_icbper, \n"+
            "hmovialc.erp_Dimporte as documento_importe, \n"+
            "hmovialc.erp_Dpercepcion as documento_percepcion, \n"+
            "hmovialc.erp_Dtotal as documento_total, \n"+
            "hmovialc.erp_gestor as gestor_codigo, \n"+
            "'' as documento_referencia_motivo_codigo, \n"+
            "'' as cliente_contacto_nombre, \n"+
            "hmovialc.erp_codune as unidad_negocio_codigo, \n"+
            "hmovialc.ccod_transportista as codigo_transportista, \n"+
            "LTRIM(RTRIM(hmovialc.ccod_vehiculo)) as codigo_vehiculo, \n"+
            "LTRIM(RTRIM(hmovialc.motivo_traslado)) as motivo_traslado, \n"+
            "hmovialc.ctip_docref as documento_tipo_referencia, \n"+
            "hmovialc.cserie_docref as Origen_Serie_referencia, \n"+
            "hmovialc.cnum_docref as documento_numero_referencia, \n"+
            "CONVERT(VARCHAR(50), hmovialc.fecha_ref, 103) as documento_fecha_referencia, \n"+ 
            "CONVERT(VARCHAR(50), hmovialc.fecha_ref, 23) as documento_fecha_referencia2, \n"+ 
            "hmovialc.n_orden as documento_numero_orden, \n"+
            "hmovialc.tipo_comprobante as tipo_comprobante, \n"+
            "hmovialc.serie_comprobante as serie_comprobante, \n"+
            "hmovialc.numero_comprobante as numero_comprobante, \n"+
            "CONVERT(VARCHAR(50), hmovialc.fecha_comp, 103) as fecha_comprobante, \n"+
            "CONVERT(VARCHAR(50), hmovialc.fecha_comp, 23) as fecha_comprobante2, \n"+
            "hmovialc.nombre_chofer as codigo_chofer, \n"+
            "hmovialc.erp_agencia as agencia_tansporte, \n"+
            "hmovialc.motivo_nota as documento_motivo_nota, \n"+
            "hmovialc.tribute_concept as documento_tipo_operacion, \n"+
            "hmovialc.ccod_detraccion as documento_codigo_detraccion, \n"+
            "LTRIM(RTRIM(hmovialc.erp_motivo))  as documento_motivo_venta, \n"+
            "hmovialc.detalleanulacion as documento_detalle_anulacion, \n"+
            "hmovialc.automatico as documento_automatico,\n"+
            "hmovialc.anticipo as documento_anticipo, \n"+
            "hmovialc.erp_ejecon as contabilidad_ejercicio,\n"+
            "hmovialc.erp_percon as contabilidad_periodo,\n"+
            "hmovialc.erp_codsub as contabilidad_subvoucher,\n"+
            "hmovialc.erp_numcon as contabilidad_numero,\n"+
            "hmovialc.erp_nro_exp as numero_expediente1,\n"+
            "hmovialc.erp_nro_exp2 as numero_expediente2,\n"+
            "--Cliente \n"+
            "hcliente.cdireccion as cliente_direccion, \n"+
            "hcliente.ctelefonos as cliente_telefono, \n"+ 
            "hcliente.cfax as cliente_fax, \n"+ 
            "hcliente.ce_mail as cliente_correo, \n"+ 
            "hcliente.ccod_pais as pais_cliente, \n"+ 
            "--Forma Pago \n"+
            "Hfor_pag.cnom_forpago as forma_pago_nombre, \n"+
            "--Detalle \n"+
            "HMOVIALD.nitem as detalle_orden, \n"+
            "HMOVIALD.ccod_articulo as articulo_codigo, \n"+
            "HMOVIALD.cnom_articulo as articulo_nombre, \n"+
            "HMOVIALD.cunidad as articulo_unidad, \n"+
            "HMOVIALD.igv_2 as articulo_igv_porcentaje, \n"+
            "HMOVIALD.factor as articulo_factor, \n"+
            "HMOVIALD.ncantidad as articulo_kardex, \n"+
            "HMOVIALD.ncantidad3 as articulo_cantidad, \n"+
            "HMOVIALD.precio_presentacion as articulo_precio, \n"+
            "HMOVIALD.nigv as articulo_igv, \n"+
            "'' as articulo_descuento1, \n"+
            "HMOVIALD.desc2 as articulo_descuento2, \n"+
            "HMOVIALD.barticulo as articulo_barticulo, \n"+
            "HMOVIALD.cantidad_presentacion as articulo_presentacion_cantidad, \n"+
            "HMOVIALD.nombre_presentacion as articulo_presentacion_nombre, \n"+
            "HMOVIALD.unidad_presentacion as articulo_presentacion_unidad, \n"+
            "HMOVIALD.precio_presentacion as articulo_presentacion_precio, \n"+
            "HMOVIALD.NBASEIMPON as articulo_base_imponible, \n"+
            "HMOVIALD.base_calculada as articulo_base_calculada, \n"+
            "HMOVIALD.monto_descuento as articulo_monto_descuento, \n"+
            "HMOVIALD.NPRECIO_IMPORTE as articulo_importe, \n"+
            "HMOVIALD.precio_original as articulo_precio_original, \n"+
            "HMOVIALD.Desc3 as articulo_descuento3, \n"+
            "HMOVIALD.erp_percepcion_sn as articulo_percepcion_sn, \n"+
            "HMOVIALD.erp_percepcion_uni as articulo_percepcion_uni, \n"+
            "HMOVIALD.erp_percepcion_porc as articulo_percepcion_porc, \n"+
            "HMOVIALD.erp_desc4 as articulo_descuento4, \n"+
            "HMOVIALD.ccod_almacen as articulo_almacen_codigo, \n"+
            "HMOVIALD.erp_base_calc_dec as articulo_base_calculada_dec, \n"+
            "HMOVIALD.erp_base_imp_dec as articulo_base_imponible_dec, \n"+
            "HMOVIALD.erp_igv_dec as articulo_igv_dec, \n"+
            "HMOVIALD.digv_icbper as articulo_igv_icbper_dec, \n"+
            "HMOVIALD.erp_importe_dec as articulo_importe_dec, \n"+
            "HMOVIALD.erp_comision_porc as articulo_comision_porc, \n"+
            "HMOVIALD.erp_comision_monto as articulo_comision_monto, \n"+
            "HMOVIALD.codigo_presentacion as articulo_presentacion_codigo, \n"+
            "dbo.udf_numero_letra (hmovialc.nimporte) as  documento_total_letras, \n"+
            "0 as documento_total_productos, \n"+
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
            "hempresa.cnum_ruc +'-'+hmovialc.ccod_movimiento +'-'+hmovialc.cnum_serie+'-'+hmovialc.cnum_doc+'.png' as documento_qr, \n"+
            "(select nro_cuenta_mn from Hempresa   with (nolock) where ccod_empresa = @ccod_empresa) as cuenta_bancaria, \n"+
            "(select REPLACE(nro_cuenta_me, '@', CHAR(13)+CHAR(10) ) from Hempresa   with (nolock) where ccod_empresa = @ccod_empresa) as cuenta_interbancaria, \n"+
            "--Configuración Formatos \n"+
            "HCONFIG_FORMATOS.valor as cantidad_filas \n"+
            "from hmovialc \n"+
            "left join HMOVIALD on \n"+
            "hmovialc.ccod_empresa = HMOVIALD.ccod_empresa \n"+
            "and hmovialc.ccod_almacen = HMOVIALD.ccod_almacen \n"+
            "and hmovialc.ccod_movimiento = HMOVIALD.ccod_movimiento \n"+
            "and hmovialc.ctip_movimiento = HMOVIALD.ctip_movimiento \n"+
            "and hmovialc.cnum_serie = HMOVIALD.CNUM_SERIE \n"+
            "and hmovialc.cnum_doc = HMOVIALD.cnum_doc \n"+
            "inner join hcliente on \n"+
            "hmovialc.ccod_empresa = hcliente.ccod_empresa \n"+
            "and hmovialc.ccod_cliente = hcliente.ccod_cliente \n"+
            "inner join Hfor_pag on \n"+
            "hmovialc.ccod_empresa = Hfor_pag.ccod_empresa \n"+
            "and hmovialc.ccod_forpago = Hfor_pag.ccod_forpago \n"+
            "inner join HCONFIG_FORMATOS on \n"+
            "hmovialc.ccod_empresa = HCONFIG_FORMATOS.ccod_empresa \n"+
            "and 'PED' = HCONFIG_FORMATOS.tipo_doc \n"+
            "inner join Hempresa on \n"+
            "hmovialc.ccod_empresa = Hempresa.ccod_empresa \n"+
            "where \n"+
            "hmovialc.ccod_empresa = @ccod_empresa \n"+
            "and hmovialc.ccod_almacen = @ccod_almacen \n"+
            "and hmovialc.ccod_movimiento = @CCOD_MOVIMIENTO \n"+
            "and hmovialc.cnum_serie = @CNUM_SERIE \n"+
            "and hmovialc.cnum_doc = @CNUM_DOC ");

        const Cabecera = lista.recordset;
        res.json(Cabecera);
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/anular', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.user.codigo_punto_venta;

        const pool = await poolPromise
        await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(250), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
        .input('tipo_documento', mssql.VarChar(250), req.body.tipo_documento)
        .input('tipo_movimiento', mssql.VarChar(250), req.body.tipo_movimiento)
        .input('motivo_serie', mssql.VarChar(250), req.body.serie)
        .input('numero_correlativo', mssql.VarChar(250), req.body.numero_correlativo)
        .query(
            "update hmovialc set estado = 'Anulado', estado_fe = 'Anulado' \n"+
            "where ccod_empresa = @codigo_empresa \n"+
            "and ccod_almacen = @codigo_punto_venta \n"+
            "and ccod_movimiento= @tipo_documento \n"+
            "and ctip_movimiento= @tipo_movimiento \n"+
            "and cnum_serie = @motivo_serie \n"+
            "and cnum_doc = @numero_correlativo"
        )

        res.send({estado: true, codigo: 0, mensaje: ""});

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
                const request_datos_contables  = new mssql.Request(transaction);
                const result_datos_contables = await request_datos_contables 
                .input('codigo_empresa', mssql.VarChar(250), codigo_empresa)
                .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
                .input('tipo_documento', mssql.VarChar(250), req.body.tipo_documento)
                .input('tipo_movimiento', mssql.VarChar(250), req.body.tipo_movimiento)
                .input('motivo_serie', mssql.VarChar(250), req.body.serie)
                .input('numero_correlativo', mssql.VarChar(250), req.body.numero_correlativo)
                .query(
                    "select erp_ejecon, erp_percon, erp_codsub, erp_numcon FROM hmovialc "+
                    "where ccod_empresa = @codigo_empresa \n"+
                    "and ccod_almacen = @codigo_punto_venta \n"+
                    "and ccod_movimiento= @tipo_documento \n"+
                    "and ctip_movimiento= @tipo_movimiento \n"+
                    "and cnum_serie = @motivo_serie \n"+
                    "and cnum_doc = @numero_correlativo"
                )
                const record_datos_contables = result_datos_contables.recordset[0];
                
                const request_detalle  = new mssql.Request(transaction);
                await request_detalle 
                .input('codigo_empresa', mssql.VarChar(250), codigo_empresa)
                .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
                .input('tipo_documento', mssql.VarChar(250), req.body.tipo_documento)
                .input('tipo_movimiento', mssql.VarChar(250), req.body.tipo_movimiento)
                .input('motivo_serie', mssql.VarChar(250), req.body.serie)
                .input('numero_correlativo', mssql.VarChar(250), req.body.numero_correlativo)
                .query(
                    "DELETE FROM HMOVIALD "+
                    "where ccod_empresa = @codigo_empresa \n"+
                    "and ccod_almacen = @codigo_punto_venta \n"+
                    "and ccod_movimiento= @tipo_documento \n"+
                    "and ctip_movimiento= @tipo_movimiento \n"+
                    "and cnum_serie = @motivo_serie \n"+
                    "and cnum_doc = @numero_correlativo"
                )
                const request_cabecera = new mssql.Request(transaction);
                await request_cabecera 
                .input('codigo_empresa', mssql.VarChar(250), codigo_empresa)
                .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
                .input('tipo_documento', mssql.VarChar(250), req.body.tipo_documento)
                .input('tipo_movimiento', mssql.VarChar(250), req.body.tipo_movimiento)
                .input('motivo_serie', mssql.VarChar(250), req.body.serie)
                .input('numero_correlativo', mssql.VarChar(250), req.body.numero_correlativo)
                .query(
                    "DELETE FROM hmovialc "+
                    "where ccod_empresa = @codigo_empresa \n"+
                    "and ccod_almacen = @codigo_punto_venta \n"+
                    "and ccod_movimiento= @tipo_documento \n"+
                    "and ctip_movimiento= @tipo_movimiento \n"+
                    "and cnum_serie = @motivo_serie \n"+
                    "and cnum_doc = @numero_correlativo"
                )
                const request_sunat = new mssql.Request(transaction);
                await request_sunat 
                .input('codigo_empresa', mssql.VarChar(250), codigo_empresa)
                .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
                .input('tipo_documento', mssql.VarChar(250), req.body.tipo_documento)
                .input('tipo_movimiento', mssql.VarChar(250), req.body.tipo_movimiento)
                .input('motivo_serie', mssql.VarChar(250), req.body.serie)
                .input('numero_correlativo', mssql.VarChar(250), req.body.numero_correlativo)
                .query(
                    "DELETE FROM envios_sunat "+
                    "where codigo_empresa = @codigo_empresa \n"+
                    "and codigo_punto_venta = @codigo_punto_venta \n"+
                    "and tipo_documento= @tipo_documento \n"+
                    "and serie_documento = @motivo_serie \n"+
                    "and numero_documento = @numero_correlativo"
                )
                const request_anticipos = new mssql.Request(transaction);
                await request_anticipos
                .input('codigo_empresa', mssql.VarChar(250), codigo_empresa)
                .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
                .input('tipo_documento', mssql.VarChar(250), req.body.tipo_documento)
                .input('tipo_movimiento', mssql.VarChar(250), req.body.tipo_movimiento)
                .input('motivo_serie', mssql.VarChar(250), req.body.serie)
                .input('numero_correlativo', mssql.VarChar(250), req.body.numero_correlativo)
                .query(
                    "DELETE FROM ERP_HMOVIALD "+
                    "where erp_codemp = @codigo_empresa \n"+
                    "and erp_codptv = @codigo_punto_venta \n"+
                    "and erp_codmov= @tipo_documento \n"+
                    "and erp_serdoc = @motivo_serie \n"+
                    "and erp_numdoc = @numero_correlativo"
                )
                

                if(req.body.automatico == "A") {
                    const request_automatico = new mssql.Request(transaction);
                    await request_automatico
                    .input("codigo_empresa", mssql.VarChar(250), codigo_empresa)
                    .input('codigo_punto_venta', mssql.VarChar(250),codigo_punto_venta)
                    .input("tipo_movimiento", mssql.VarChar(250), req.body.tipo_movimiento)
                    .input("motivo_serie", mssql.VarChar(250), req.body.serie)
                    .input("ultimo_grab", mssql.VarChar(250), parseInt(req.body.numero_correlativo)-1)
                    .query("UPDATE Htalonar SET ultimo_grab = @ultimo_grab "+
                    "WHERE ccod_empresa = @codigo_empresa AND ccod_almacen = @codigo_punto_venta "+
                    "AND tip_doc = @tipo_movimiento AND cnum_serie = @motivo_serie")
                }
                

                const request_detalle_contable  = new mssql.Request(transaction);
                await request_detalle_contable
                .input('codigo_empresa', mssql.VarChar(250), codigo_empresa)
                .input('ejercicio', mssql.VarChar(250), record_datos_contables.erp_ejecon)
                .input('periodo', mssql.VarChar(250), record_datos_contables.erp_percon)
                .input('sub_voucher', mssql.VarChar(250), record_datos_contables.erp_codsub)
                .input('numero', mssql.VarChar(250), record_datos_contables.erp_numcon)
                .query(
                    "DELETE FROM HMOVCOND "+
                    "where ccod_empresa = @codigo_empresa \n"+
                    "and ejercon = @ejercicio \n"+
                    "and periodo_con= @periodo \n"+
                    "and ccod_svoucher= @sub_voucher \n"+
                    "and cnum_doc = @numero"
                )

                const request_cabecera_contable = new mssql.Request(transaction);
                await request_cabecera_contable 
                .input('codigo_empresa', mssql.VarChar(250), codigo_empresa)
                .input('ejercicio', mssql.VarChar(250), record_datos_contables.erp_ejecon)
                .input('periodo', mssql.VarChar(250), record_datos_contables.erp_percon)
                .input('sub_voucher', mssql.VarChar(250), record_datos_contables.erp_codsub)
                .input('numero', mssql.VarChar(250), record_datos_contables.erp_numcon)
                .query(
                    "DELETE FROM HMOVCONC "+
                    "where ccod_empresa = @codigo_empresa \n"+
                    "and ejercon = @ejercicio \n"+
                    "and periodo_con= @periodo \n"+
                    "and ccod_svoucher= @sub_voucher \n"+
                    "and cnum_doc = @numero"
                )

                const request_cabecera_provisiones = new mssql.Request(transaction);
                await request_cabecera_provisiones 
                .input('codigo_empresa', mssql.VarChar(250), codigo_empresa)
                .input('ejercicio', mssql.VarChar(250), record_datos_contables.erp_ejecon)
                .input('periodo', mssql.VarChar(250), record_datos_contables.erp_percon)
                .input('sub_voucher', mssql.VarChar(250), record_datos_contables.erp_codsub)
                .input('numero', mssql.VarChar(250), record_datos_contables.erp_numcon)
                .query(
                    "DELETE FROM hctacxcp "+
                    "where ccod_empresa = @codigo_empresa \n"+
                    "and cob_pag = 'COB' \n"+
                    "and ejercon = @ejercicio \n"+
                    "and periodo_con= @periodo \n"+
                    "and ccod_svoucher= @sub_voucher \n"+
                    "and cnum_doc_cont = @numero"
                )


                transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
                res.send({estado: true, codigo: 0, mensaje: ""});      
            }catch(err){
                transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
                console.log(err.message);
                res.send({estado: false, codigo: "Err", mensaje: err.message});
            }
        });
    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message})
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
        .input('tipo_venta_guia', mssql.VarChar(250), req.body.tipo_venta_guia)
        .input('todos', mssql.VarChar(250), req.body.todos)
        .query(
            "Select \n"+
            "Hmovialc.ccod_almacen as Punto_Venta, \n"+
            "Hmovialc.tipo_venta as Tipo_Venta, \n"+
            "hmovialc.ccod_movimiento as Tipo_Documento, \n"+
            "Rtrim(Ltrim(Hmovialc.cnum_serie)) as Codigo_Motivo_Serie, \n"+
            "Hmovialc.cnum_doc as Numero, \n"+
            "CONVERT(VARCHAR(50),Hmovialc.dfecha_doc,103) as Fecha, \n"+
            "Hcliente.ccod_cliente as Codigo_Cliente, \n"+
            "Hcliente.cnom_cliente as Nombre_Cliente, \n"+
            "CONVERT(VARCHAR(50),Hmovialc.dfecha_entr,103) as Fecha_Entrega, \n"+
            "RTRIM(LTRIM(Hmovialc.ccod_forpago)) as Forma_Pago, \n"+
            "Hmovialc.cmoneda as Moneda, \n"+
            "hcencos.ccod_cencos as Cencos, \n"+
            "Hmovialc.ot as Ot, \n"+
            "hcencos.responsable as Codigo_Responsable, \n"+
            "Hmovialc.erp_codune as Codigo_Unidad_Negocio, \n"+
            "Hmovialc.erp_codage as Codigo_Agencia, \n"+
            "Hmovialc.erp_glosa as glosa, \n"+
            "Hmovialc.si_igv as si_igv, \n"+
            "(hcencos.cnom_cencos) as Nombre_Cencos, \n"+
            "Rtrim(Ltrim(Hmovialc.cnum_serie)) as Motivo_Serie, \n"+
            "Hmovialc.porc_descuento as Porc_Descuento, \n"+
            "Hcliente.ctelefonos as Telefono_Cliente, \n"+
            "'' as Codigo_Contacto, \n"+
            "'' as Nombre_Contacto, \n"+
            "Hcliente.ce_mail as Correo_Cliente, \n"+
            "Hmovialc.lista_precios as Lista_Precios, \n"+
            "Hmovialc.nro_dias as Dias_Forma_Pago, \n"+
            "LTRIM(RTRIM(Hmovialc.ccod_vendedor)) as Vendedor1, \n"+
            "Hmovialc.subtotal_sin_descuentos as Sub_Total_Sin_Descuentos, \n"+
            "Hmovialc.erp_Ddescuento as Monto_Descuento, \n"+
            "Hmovialc.erp_Dsubtotal as Sub_Total, \n"+
            "Hmovialc.erp_Digv as Igv, \n"+
            "hmovialc.igv_icbper as Igv_icbper, \n"+
            "Hmovialc.erp_Dimporte as Total, \n"+
            "Hmovialc.erp_presupuesto as Codigo_Presupuesto, \n"+
            "Hmovialc.pto_llegada_02 as Punto_Llegada, \n"+
            "LTRIM(RTRIM(idvendedor2)) as Vendedor2, \n"+
            "Hmovialc.erp_gestor as Codigo_Gestor, \n"+
            "hcliente.cdireccion as Cliente_Direccion, \n"+
            "hmovialc.ccod_vehiculo as Codigo_Vehiculo, \n"+
            "hmovialc.ccod_transportista as Codigo_Transportista, \n"+
            "hmovialc.nombre_chofer as Codigo_Chofer, \n"+
            "LTRIM(RTRIM(hmovialc.motivo_traslado)) as Motivo_Trasl, \n"+
            "hmovialc.erp_agencia as Agencia_Transporte, \n"+
            "hmovialc.ctip_docref as Tipo_Referencia_Documento, \n"+
            "hmovialc.cserie_docref as Motivo_Serie_Referencia_Documento, \n"+
            "hmovialc.cnum_docref as Numero_Referencia_Documento, \n"+
            "hmovialc.erp_nro_exp as Numero_Expediente1,\n"+
            "hmovialc.erp_nro_exp2 as Numero_Expediente2\n"+
            "From Hmovialc \n"+
            "Inner Join Hcliente On \n"+
            "Hmovialc.ccod_empresa= Hcliente.ccod_empresa And \n"+
            "Hmovialc.ccod_cliente = Hcliente.ccod_cliente \n"+
            "Inner Join hcencos On \n"+
            "Hmovialc.ccod_cencos = hcencos.ccod_cencos And \n"+
            "Hmovialc.ccod_empresa = hcencos.ccod_empresa \n"+
            "Where Hmovialc.ccod_empresa = @codigo_empresa And \n"+
            "Hmovialc.ccod_almacen = @codigo_punto_venta AND \n"+
            "case @todos when 'S' then '' else Hmovialc.atencion end <> 'Atendido' \n"+
            "and Hmovialc.estado <> 'Anulado' \n"+
            "and modulo='Punto_Venta' \n"+
            "and ccod_movimiento <> '09'\n"+
            // "and hmovialc.tipo_venta like \n"+
            // "(case when @todos = 'S' then '%%' when @tipo_venta_guia = '01' then '%VENTA DIFERIDA%' when @tipo_venta_guia = '09' then '%GUIA DIRECTA%' else '%%' end) \n"+
            "and ( \n"+
            "hmovialc.ccod_movimiento = (case @tipo_venta_guia when '01' then '01' else '' end) \n"+
            "or hmovialc.ccod_movimiento = (case @tipo_venta_guia when '01' then '03' else '' end) \n"+
            "or hmovialc.ccod_movimiento = (case @tipo_venta_guia when '09' then '09' else '' end) \n"+
            "or hmovialc.ccod_movimiento = (case @tipo_venta_guia when '07' then '01' else '' end) \n"+
            "or hmovialc.ccod_movimiento = (case @tipo_venta_guia when '07' then '03' else '' end) \n"+
            ") \n"+
            "and Hmovialc.ccod_cliente = \n"+
            "(case when @codigo_cliente = '' then Hmovialc.ccod_cliente else case @todos when 'S' then Hmovialc.ccod_cliente else @codigo_cliente end end ) \n"+
            "Order By Hmovialc.dfecha_doc desc,cnum_doc desc \n"
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
        .input('tipo_documento', mssql.VarChar(200), req.body.tipo_documento)
        .input('motivo_serie', mssql.VarChar(200), req.body.motivo_serie)
        .input('numero', mssql.VarChar(200), req.body.numero)
        .input('todos', mssql.VarChar(200), req.body.todos)
        .query(
            "select \n"+
            "case when @todos= 'S' then Cantidad_Por_Atender else \n"+
            "Cantidad_Por_Atender - \n"+
            "case Cantidad_Atendida when -1 then 0 else Cantidad_Atendida end end as Cantidad, \n"+
            "Cantidad_Kardex_Por_Atender - \n"+
            "case Cantidad_Kardex_Atendida when -1 then 0 else Cantidad_Kardex_Atendida end as Cantidad_Kardex, \n"+
            "* from ( \n"+
            "SELECT \n"+
            "Hmoviald.ccod_almacen as Punto_Venta, \n"+
            "Hmoviald.CNUM_SERIE as Codigo_Motivo_Serie, \n"+
            "Hmoviald.cnum_doc as Numero, \n"+
            "Hmoviald.nitem as NItem, \n"+
            "Hmoviald.NCANTIDAD3 as Cantidad_Por_Atender, \n"+
            "isnull(( \n"+
            "select sum(ncantidad3) from Hmoviald as d2 \n"+
            "inner join Hmovialc as c2 on \n"+
            "c2.ccod_empresa = d2.ccod_empresa \n"+
            "and c2.ccod_almacen = d2.ccod_almacen \n"+
            "and c2.ccod_movimiento = d2.CCOD_MOVIMIENTO \n"+
            "and c2.cnum_serie = d2.CNUM_SERIE \n"+
            "and c2.cnum_doc = d2.cnum_doc \n"+
            "and d2.CCOD_MOVIMIENTO <> '08' \n"+
            "where \n"+
            "d2.ccod_empresa = Hmoviald.ccod_empresa \n"+
            "and d2.movimiento_origen = Hmoviald.CCOD_MOVIMIENTO \n"+
            "and d2.serie_origen = Hmoviald.CNUM_SERIE \n"+
            "and d2.cnum_doc_guiaventa = Hmoviald.cnum_doc \n"+
            "and d2.ccod_almacen = Hmoviald.ccod_almacen \n"+
            "and c2.estado <> 'Anulado' \n"+
            "and d2.ccod_articulo = Hmoviald.ccod_articulo \n"+
            "and d2.cunidad = Hmoviald.cunidad \n"+
            "and d2.erp_itemref = Hmoviald.nitem \n"+
            "),-1) as Cantidad_Atendida, \n"+
            "Hmoviald.CCOD_ARTICULO AS Codigo, \n"+
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
            "Hmoviald.CNOM_ARTICULO AS Nombre, \n"+
            "RTRIM(Hmoviald.CUNIDAD) AS Codigo_Unidad, \n"+
            "RTRIM(Hmoviald.CUNIDAD) AS Unidad,\n"+
            "Hmoviald.erp_comision_porc as Comision_porcentaje, \n"+
            "Hmoviald.factor as Factor, \n"+
            "Hmoviald.NPRECIO_TRANS as Unit, \n"+
            "Hmoviald.NBASEIMPON as Base_Imponible, \n"+
            "Hmoviald.porc_descuento as Desc1, \n"+
            "Hmoviald.DESC2 as Desc2, \n"+
            "Hmoviald.Desc3 As Desc3, \n"+
            "Hmoviald.erp_desc4 as Desc4, \n"+
            "Hmoviald.BASE_CALCULADA as Base_Calculada, \n"+
            "HMOVIALD.nigvcalc as Igv, \n"+
            "HMOVIALD.digv_icbper as ICBPER, \n"+ 
            "hmoviald.NPRECIO_IMPORTE AS Importe, \n"+
            "Hmoviald.erp_peso as Peso, \n"+
            "Halmacen_2.ccod_almacen as Codigo_Almacen, \n"+
            "Halmacen_2.cnom_almacen as Almacen, \n"+
            "Hmoviald.cantidad_presentacion as Cantidad_presentacion, \n"+
            "Hmoviald.codigo_presentacion as Codigo_presentacion, \n"+
            "RTRIM(Hmoviald.unidad_presentacion) AS Unidad_presentacion, \n"+
            "Hmoviald.nombre_presentacion AS Nombre_presentacion, \n"+
            "Hmoviald.precio_presentacion as Precio_presentacion, \n"+
            "'' as Observacion, \n"+
            "Hmoviald.OT as OT, \n"+
            "Hmoviald.NCANTIDAD as Cantidad_Kardex_Por_Atender, \n"+
            "isnull(( \n"+
            "select sum(NCANTIDAD) from Hmoviald as d2 \n"+
            "inner join Hmovialc as c2 on \n"+
            "c2.ccod_empresa = d2.ccod_empresa \n"+
            "and c2.ccod_almacen = d2.ccod_almacen \n"+
            "and c2.ccod_movimiento = d2.CCOD_MOVIMIENTO \n"+
            "and c2.cnum_serie = d2.CNUM_SERIE \n"+
            "and c2.cnum_doc = d2.cnum_doc \n"+
            "where \n"+
            "d2.ccod_empresa = Hmoviald.ccod_empresa \n"+
            "and d2.movimiento_origen = Hmoviald.CCOD_MOVIMIENTO \n"+
            "and d2.serie_origen = Hmoviald.CNUM_SERIE \n"+
            "and d2.cnum_doc_guiaventa = Hmoviald.cnum_doc \n"+
            "and d2.ccod_almacen = Hmoviald.ccod_almacen \n"+
            "and c2.estado <> 'Anulado' \n"+
            "and d2.ccod_articulo = Hmoviald.ccod_articulo \n"+
            "and d2.cunidad = Hmoviald.cunidad \n"+
            "and d2.erp_itemref = Hmoviald.nitem \n"+
            "and d2.CCOD_MOVIMIENTO <> '08' \n"+
            "),-1) as Cantidad_Kardex_Atendida, \n"+
            "Hmoviald.barticulo as Barticulo, \n"+
            "Hmoviald.NIGV as Igv_Art, \n"+
            "Hmoviald.monto_descuento as Monto_Descuento, \n"+
            "Hmoviald.precio_original as Precio_original, \n"+
            "Hmoviald.erp_codune as Unidad_negocio, \n"+
            "Hmoviald.cc AS Codigo_Cencos,\n"+
            "Hmoviald.cc AS Cencos, \n"+
            "Hmoviald.erp_presupuesto as Partida_presupuestal, \n"+
            "Hmoviald.erp_codage as Agencia, \n"+
            "Hmoviald.erp_percepcion_sn as Percepcion_sn, \n"+
            "Hmoviald.erp_percepcion_uni as Percepcion_uni, \n"+
            "Hmoviald.erp_percepcion_porc as Perpecion_porc, \n"+
            "Hmoviald.erp_boni_sn as Boni_sn, \n"+
            "Hmoviald.erp_item_boni as Item_boni, \n"+
            "Hmoviald.erp_comision_monto as Comision_monto, \n"+
            "Hmoviald.erp_base_calc_dec as Base_calculada_dec, \n"+
            "Hmoviald.erp_base_imp_dec as Base_imp_dec, \n"+
            "Hmoviald.erp_igv_dec as Igv_dec, \n"+
            "Hmoviald.erp_importe_dec as Importe_dec, \n"+
            "Harticul.csistock as Stock_SN, \n"+
            "Harticul.lote as Lote_SN, \n"+
            "hmoviald.CNRO_LOTE as Lote_Numero, \n"+
            "CONVERT(VARCHAR(50),HMOVIALD.vcto, 111) as Lote_Vencimiento, \n"+
            "Harticul.flagserie Serie_SN, \n"+
            "hmoviald.nro_serie as Serie_Numero, \n"+
            "Hmoviald.motivo_pedido as Pedido_Motivo, \n"+
            "Hmoviald.doc_origen_pedido as Pedido_Numero, \n"+
            "Hmoviald.origen_item as Pedido_NItem, \n"+
            "case Hmoviald.CCOD_MOVIMIENTO when '09' then Hmoviald.cnum_serie else '' end  as Guia_Serie, \n"+
            "case Hmoviald.CCOD_MOVIMIENTO when '09' then Hmoviald.cnum_doc else '' end  as Guia_Numero, \n"+
            "case Hmoviald.CCOD_MOVIMIENTO when '01' then Hmoviald.cnum_serie else '' end  as Factura_Serie, \n"+
            "case Hmoviald.CCOD_MOVIMIENTO when '01' then Hmoviald.cnum_doc else '' end  as Factura_Numero, \n"+
            "case Hmoviald.CCOD_MOVIMIENTO when '03' then Hmoviald.cnum_serie else '' end  as Boleta_Serie, \n"+
            "case Hmoviald.CCOD_MOVIMIENTO when '03' then Hmoviald.cnum_doc else '' end  as Boleta_Numero, \n"+
            "case Hmoviald.CCOD_MOVIMIENTO when '07' then Hmoviald.cnum_serie else '' end  as NC_Serie, \n"+
            "case Hmoviald.CCOD_MOVIMIENTO when '07' then Hmoviald.cnum_doc else '' end  as NC_Numero, \n"+
            "case Hmoviald.CCOD_MOVIMIENTO when '08' then Hmoviald.cnum_serie else '' end  as ND_Serie, \n"+
            "case Hmoviald.CCOD_MOVIMIENTO when '08' then Hmoviald.cnum_doc else '' end  as ND_Numero, \n"+
            "Hmoviald.ccod_movimiento as Origen_Documento, \n"+
            "Hmoviald.cnum_serie as Origen_Serie, \n"+
            "Hmoviald.cnum_doc as Origen_Numero, \n"+
            "Hmoviald.nitem as Origen_NItem \n"+
            "FROM Hmoviald inner Join Harticul On \n"+
            "Hmoviald.ccod_empresa = Harticul.ccod_empresa and \n"+
            "Hmoviald.ccod_articulo = Harticul.ccod_articulo \n"+
            "inner join erp_concepto1 on \n"+
            "erp_concepto1.erp_codemp = Harticul.ccod_empresa and \n"+
            "erp_concepto1.erp_codcon = Harticul.codmarca \n"+
            "inner join Halmacen_2 on \n"+
            "Halmacen_2.ccod_empresa = Hmoviald.ccod_empresa and \n"+
            "Halmacen_2.ccod_almacen = Hmoviald.ccod_almacen_org \n"+
            "WHERE \n"+
            "Hmoviald.ccod_empresa = @codigo_empresa and \n"+
            "Hmoviald.ccod_movimiento = @tipo_documento and \n"+
            "Hmoviald.CNUM_SERIE = @motivo_serie and \n"+
            "Hmoviald.cnum_doc = @numero and \n"+
            "Hmoviald.ccod_almacen= @punto_venta \n"+
            ") as tablita \n"+
            "where \n"+
            "Cantidad_Por_Atender > case @todos when 'S' then -1 else Cantidad_Atendida end \n"+
            "ORDER BY NITEM \n"
        );
          
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/lista_anticipos', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa
        const codigo_punto_venta = req.user.codigo_punto_venta;
  
        const pool = await poolPromise
  
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(5), codigo_punto_venta)
        .input('codigo_cliente', mssql.VarChar(25), req.body.codigo_cliente)
        .query(
            "select cnum_serie as Serie, \n"+
            "cnum_doc as Numero, \n"+
            "CONVERT(VARCHAR(25), dfecha_doc, 23) as Fecha, \n"+
            "cmoneda as Moneda,  \n"+
            "case cmoneda when 'S/' then nsubtotal else nsubtotal * tipo_cambio end as Sub_Total_Soles,  \n"+
            "case cmoneda when 'S/' then nigv else nigv * tipo_cambio end as Igv_Soles,  \n"+
            "case cmoneda when 'S/' then nimporte else nimporte * tipo_cambio end as Importe_Soles,  \n"+
            "case cmoneda when 'S/' then nsubtotal / tipo_cambio else nsubtotal end as Sub_Total_Dolares,  \n"+
            "case cmoneda when 'S/' then nigv / tipo_cambio else nigv end as Igv_Dolares,  \n"+
            "case cmoneda when 'S/' then nimporte / tipo_cambio else nimporte end as Importe_Dolares,  \n"+
            "ccod_movimiento as Movimiento, \n"+
            "ctip_movimiento as Tipo_Movimiento, \n"+
            "ccod_almacen as Punto_Venta, \n"+
            "tipo_cambio \n"+
            "from hmovialc \n"+
            "where \n"+
            "ccod_empresa = @codigo_empresa \n"+
            "and tipo_venta='ANTICIPO' \n"+
            "and ccod_cliente = @codigo_cliente \n"+
            "and ccod_empresa+ccod_almacen+ccod_movimiento+cnum_serie+cnum_doc \n"+
            "not in ( \n"+
            "select \n"+
            "ERP_CODEMP+ERP_CODPTV2+ERP_CODMOV2+ERP_SERDOC2+ERP_NUMDOC2 \n"+
            "from erp_hmoviald where ERP_CODEMP= @codigo_empresa \n"+
            ") \n"
        );
          
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
      res.send(err.message)
    }
});

module.exports = router;