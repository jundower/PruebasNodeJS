const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../../database');
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

router.post('/guardar', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const usuario = req.user.codigo_usuario;

        var filas_detalle = JSON.parse(req.body.filas_detalle)
        var codigo_punto_venta = req.body.transferencia_almacen=="TE" ? req.body.ccod_almacen2 : req.user.codigo_punto_venta;
        var automatico = req.body.transferencia_almacen=="TE" ? req.body.automatico_destino : req.body.automatico;
        var codigo_movimiento = req.body.transferencia_almacen=="TE" ? "NE" : req.body.codigo_movimiento;
        var serie = req.body.transferencia_almacen=="TE" ? req.body.serie_destino: req.body.serie;
        var tipo_movimiento = req.body.transferencia_almacen=="TE" ? 'E' : req.body.tipo_movimiento;
        var codigo_almacen = req.body.transferencia_almacen=="TE" ? req.body.ccod_almacend2 : req.body.codigo_almacen_d;
        var tipo_E_S = req.body.transferencia_almacen=="TE" ? 'E' : req.body.codigo_movimiento=='NE'? 'E':'S';
        var codigo_transaccion = req.body.transferencia_almacen=="TE" ? '04' : req.body.codigo_transaccion;
        var numero_correlativo;

        const pool = await poolPromise;
        const transaction = await new mssql.Transaction(pool);
        await transaction.begin(async err => {
            try{
                //#region Generación del correlativo automatico

                if (automatico== "A") {
                    const request_automatico  = new mssql.Request(transaction);
                    const result_automatico = await request_automatico 
                    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
                    .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
                    .input('tipo_documento', mssql.VarChar(250), codigo_movimiento)
                    .input('serie_documento', mssql.VarChar(250), serie)
                    .input('tipo_movimiento', mssql.VarChar(250), tipo_movimiento)
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
                            "WHERE CCOD_EMPRESA= @codigo_empresa \n"+
                            "AND ccod_almacen= @codigo_punto_venta \n"+
                            "AND CCOD_MOVIMIENTO= @tipo_documento \n"+
                            "AND CNUM_SERIE= @serie_documento \n"+
                            "AND CTIP_MOVIMIENTO= @tipo_movimiento \n"+
                            "AND CNUM_DOC=@ceros+@correlativo \n"+
                        "end \n"+
                        "select @ceros++CONVERT(VARCHAR(50),@correlativo) as correlativo \n"
                    );
        
                    var recordset_automatico = result_automatico.recordset;
                    numero_correlativo = recordset_automatico[0].correlativo;
                } else {
                    numero_correlativo = req.body.numero_correlativo
                }
                console.log(numero_correlativo);
                //#endregion
                
                //#region Registro de la cabecera
                const request_cabecera  = new mssql.Request(transaction);
                await request_cabecera
                .input('ccod_empresa', mssql.VarChar(10), codigo_empresa)
                .input('ccod_almacen', mssql.VarChar(3), codigo_punto_venta)
                .input('ccod_movimiento', mssql.VarChar(3), codigo_movimiento)
                .input('ctip_movimiento', mssql.VarChar(10), tipo_movimiento)
                .input('cnum_serie', mssql.VarChar(5), serie)
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
                .input('ctip_docref', mssql.VarChar(3), req.body.tipo_documento_referencia)
                .input('cserie_docref', mssql.VarChar(5), req.body.serie_documento_referencia)
                .input('cnum_docref', mssql.VarChar(15), req.body.numero_documento_referencia)
                .input('fecha_ref', mssql.Date, req.body.fecha_referencia)
                .input('ccod_almacend', mssql.VarChar(3), codigo_almacen)
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
                .input('desc_stock', mssql.VarChar(1), req.body.erp_dscto_stock)
                .input('ccod_almacen2', mssql.VarChar(250), req.body.ccod_almacen2)
                .input('ccod_almacend2', mssql.VarChar(250), req.body.ccod_almacend2)
                .input('automatico', mssql.VarChar(1), req.body.automatico)
                .input('automatico_destino', mssql.VarChar(1), req.body.automatico_destino)
                .input('serie_destino', mssql.VarChar(250), req.body.serie_destino)
                .input('numero_destino', mssql.VarChar(20), req.body.numero_destino)
                .input('ccod_responsable', mssql.VarChar(15), req.body.responsable)
                .input('ccod_vendedor', mssql.VarChar(15), req.body.vendedor_1)
                .input('idvendedor2', mssql.VarChar(15), req.body.idvendedor2)
                .input('ccod_transaccion', mssql.VarChar(250), codigo_transaccion)
                .input('erp_codune', mssql.VarChar(20), req.body.codigo_unidad_negocio)
                .input('ccod_cencos', mssql.VarChar(20), req.body.codigo_centro_costos)
                .input('ot', mssql.VarChar(20), req.body.orden_trabajo)
                .input('ccod_vehiculo', mssql.VarChar(250), req.body.codigo_vehiculo)
                .input('ccod_transportista', mssql.VarChar(15), req.body.codigo_transportista)
                .input('nombre_chofer', mssql.VarChar(250), req.body.codigo_chofer)
                .input('pais', mssql.VarChar(250), req.body.pais)
                .input('tipo_venta', mssql.VarChar(30), req.body.tipo_venta)
                .input('n_orden', mssql.VarChar(30), req.body.numero_orden)
                .input('si_igv', mssql.VarChar(1), req.body.mas_igv)
                .input('porc_descuento', mssql.Decimal(18,4), req.body.descuento)
                .input('motivo_traslado', mssql.VarChar(250), req.body.motivo_traslado)
                .input('lista_precios', mssql.VarChar(10),  req.body.lista_precios)
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
                .input('interior_llegada', mssql.VarChar(200), req.body.interior_llegada)
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
                .input('erp_codcaja', mssql.VarChar(250), req.body.codigo_caja)
                .input('erp_vuelto', mssql.Decimal(18,2), req.body.erp_vuelto)
                .input('ruta_cont_ped', mssql.VarChar(500), req.body.ruta_cont_ped)
                .input('erp_presupuesto', mssql.VarChar(20), req.body.erp_presupuesto)
                .input('erp_motivo', mssql.VarChar(250), req.body.erp_motivo)
                .input("subtotal_sin_descuentos", mssql.VarChar(250), req.body.subtotal_sin_descuentos)
                .input('erp_Ddescuento', mssql.Decimal(18,4), req.body.erp_Ddescuento)
                .input('erp_Dsubtotal', mssql.Decimal(18,2), req.body.erp_Dsubtotal)
                .input('erp_Digv', mssql.Decimal(18,2), req.body.erp_Digv)
                .input('erp_Dimporte', mssql.Decimal(18,2), req.body.erp_Dimporte)
                .input('erp_Dpercepcion', mssql.Decimal(18,2), req.body.erp_Dpercepcion)
                .input('erp_Dtotal', mssql.Decimal(18,2), req.body.erp_Dtotal)
                .input('erp_Danticipo', mssql.Decimal(18,2), req.body.anticipo)
                .input('erp_glosa', mssql.VarChar(255), req.body.Glosa)
                .input('erp_gestor', mssql.VarChar(15), req.body.erp_gestor)
                .input('erp_nro_exp', mssql.VarChar(30), req.body.erp_nro_exp)
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
                .input('detalleanulacion', mssql.VarChar(100), req.body.detalleanulacion)
                .input('fechagen', mssql.Date, req.body.fechagen)
                .input('fechabaja', mssql.Date, req.body.fechabaja)
                .input('tribute_concept', mssql.VarChar(250), req.body.tribute_concept)
                .input('cnum_lote', mssql.VarChar(4), req.body.cnum_lote)
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
                "erp_Ddescuento, \n"+
                "erp_Dsubtotal, \n"+
                "erp_Digv, \n"+
                "erp_Dimporte, \n"+
                "erp_Dpercepcion, \n"+
                "erp_Dtotal, \n"+
                "erp_Danticipo, \n"+
                "erp_glosa, \n"+
                "erp_gestor, \n"+
                "erp_nro_exp, \n"+
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
                "cnum_lote \n"+
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
                "@erp_Ddescuento, \n"+
                "@erp_Dsubtotal, \n"+
                "@erp_Digv, \n"+
                "@erp_Dimporte, \n"+
                "@erp_Dpercepcion, \n"+
                "@erp_Dtotal, \n"+
                "@erp_Danticipo, \n"+
                "@erp_glosa, \n"+
                "@erp_gestor, \n"+
                "@erp_nro_exp, \n"+
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
                "@cnum_lote)");
                //#endregion
                
                //#region Registro del detalle

                for (let i= 0; i< filas_detalle.length; i++){
                    rowid = filas_detalle[i];
                    
                    var today =  new Date(req.body.fecha_doc);
                    var dd = today.getDate() +1 ;
                    var mm = today.getMonth()+1; 
                    var yyyy = today.getFullYear();
        
                    today = yyyy+'/'+(mm<10? '0'+mm : mm)+'/'+ (dd<10? '0'+dd : dd);
                    
                    var request_costo = new mssql.Request(transaction);
                    var query_costo = await request_costo
                    .input('vi_empresa', mssql.VarChar(10), codigo_empresa)
                    .input('vi_pto_venta', mssql.VarChar(3), codigo_punto_venta)
                    .input('vi_almacen', mssql.VarChar(3), codigo_almacen)
                    .input('vi_articulo', mssql.VarChar(35), rowid.Codigo)
                    .input('vi_lote', mssql.VarChar(35), rowid.Lote_Numero)
                    .input('vi_vencimiento', mssql.Date(), rowid.Lote_Vencimiento)  
                    .input('vi_numero_serie', mssql.VarChar(35), rowid.Serie_Numero)
                    .input('vi_moneda', mssql.VarChar(35), req.body.moneda)
                    .input('vi_tc', mssql.Decimal(18,3), req.body.tasa_cambio)
                    .input('vi_fecha', mssql.Date(), today)// Año / Mes / Dia
                    .input('vi_cantidad', mssql.Decimal(18,4), rowid.Cantidad_Kardex)
                    .input('vi_precio', mssql.Decimal(18,4), rowid.Unit)
                    .output('vi_costo_mn', mssql.Decimal(18,4), 0)
                    .output('vi_costo_me', mssql.Decimal(18,4), 0)
                    .output('vi_costo_mn_t', mssql.Decimal(18,4), 0)
                    .output('vi_costo_me_t', mssql.Decimal(18,4), 0)
                    .execute("sq_execalculo_costo_entrada");

                    var rs_costo_producto = query_costo.output;

                    var request_detalle = new mssql.Request(transaction);
                    await request_detalle
                    .input('CCOD_EMPRESA', mssql.VarChar(10),codigo_empresa)
                    .input('CCOD_ALMACEN', mssql.VarChar(3),codigo_punto_venta)
                    .input('CCOD_MOVIMIENTO', mssql.VarChar(3),codigo_movimiento)
                    .input('CTIP_MOVIMIENTO', mssql.VarChar(10),tipo_movimiento)
                    .input('CNUM_SERIE', mssql.VarChar(5),serie)
                    .input('CNUM_DOC', mssql.VarChar(250),numero_correlativo)
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
                    .input('E_S', mssql.VarChar(1), tipo_E_S)
                    .input('porc_descuento', mssql.Decimal(18,10),rowid.Desc1)
                    .input('costo_venta', mssql.Decimal(18,10),'0')
                    .input('costo_venta_total', mssql.Decimal(18,10),'0')
                    .input('desc2', mssql.Decimal(18,10),rowid.Desc2)
                    .input('monto_descuento', mssql.Decimal(18,10),rowid.Monto_Descuento)
                    .input('barticulo', mssql.VarChar(1), rowid.Barticulo)
                    .input('blote', mssql.VarChar(1),rowid.Lote_SN)
                    .input('bserie', mssql.VarChar(1),rowid.Serie_SN)
                    .input('ccod_almacen_org', mssql.VarChar(3),codigo_almacen)
                    .input('factor', mssql.Decimal(18,2),rowid.Factor)
                    .input('erp_codune', mssql.VarChar(20),req.body.codigo_unidad_negocio)
                    .input('cc', mssql.VarChar(20),req.body.codigo_centro_costos)
                    .input('ot', mssql.VarChar(20),req.body.orden_trabajo)
                    .input('CNRO_LOTE', mssql.VarChar(20),rowid.Lote_Numero) 
                    .input('vcto', mssql.VarChar(250),rowid.Lote_Vencimiento)
                    .input('motivo_pedido', mssql.VarChar(250), '00')
                    .input('doc_origen_pedido', mssql.VarChar(15), '')
                    .input('origen_item', mssql.Int, rowid.Origen_NItem)
                    .input('movimiento_origen', mssql.VarChar(3),rowid.Origen_Documento)
                    .input('serie_origen', mssql.VarChar(5),'')
                    .input('cnum_doc_guiaventa', mssql.VarChar(15),'')
                    .input('erp_itemref', mssql.Decimal(18,4),'0')
                    .input('nombre_presentacion', mssql.VarChar(300),rowid.Nombre_presentacion)
                    .input('cantidad_presentacion', mssql.Decimal(18,10), rowid.Cantidad_presentacion)
                    .input('unidad_presentacion', mssql.VarChar(250), rowid.Unidad_presentacion)
                    .input('erp_codage', mssql.VarChar(20),req.body.codigo_agencia)
                    .input('percepcion_uni', mssql.Decimal(18,10),rowid.Percepcion_uni)
                    .input('idmotivo_compra', mssql.VarChar(15), rowid.Origen_Motivo_Serie)
                    .input('cnum_doc_ordc', mssql.VarChar(15), rowid.Origen_Numero)
                    .input('nro_serie', mssql.VarChar(80),rowid.Serie_Numero)
                    .input('n_req', mssql.VarChar(20),req.body.n_req)
                    .input('bonificacion', mssql.VarChar(1),'N')
                    .input('precio_presentacion', mssql.Decimal(18,10),rowid.Precio_presentacion)
                    .input('precio_original', mssql.Decimal(18,10),rowid.Precio_original)
                    .input('anticipo', mssql.Decimal(18,10),req.body.anticipo)
                    .input('igv_2', mssql.Decimal(18,10),'0')
                    .input('importe_2', mssql.Decimal(18,10),'0')
                    .input('item_origen', mssql.Decimal(18,4),'0')
                    .input('ccod_interno', mssql.VarChar(35),'')
                    .input('erp_codfab', mssql.VarChar(35),'')
                    .input('erp_cosmn', mssql.Decimal(18,4),rs_costo_producto.vi_costo_mn)
                    .input('erp_cosme', mssql.Decimal(18,4),rs_costo_producto.vi_costo_me)
                    .input('erp_tcref', mssql.Decimal(18,8),req.body.tasa_cambio)
                    .input('erp_iteord', mssql.Int,'0')
                    .input('erp_itereq', mssql.Int,'0')
                    .input('Erp_Tipo_anexo', mssql.VarChar(10),'')
                    .input('Erp_CodAnexo', mssql.VarChar(20),'')
                    .input('Erp_NomAnexo', mssql.VarChar(250),'')
                    .input('dt_aplica', mssql.VarChar(1),'')
                    .input('erp_costmn', mssql.Decimal(18,4),rs_costo_producto.vi_costo_mn_t)
                    .input('erp_costme', mssql.Decimal(18,4),rs_costo_producto.vi_costo_me_t)
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
                    .input('digv_icbper', mssql.Decimal(10,2),'0')
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
                };                
                //#endregion
                
                //#region Actualización del correlativo automatico
                if(req.body.automatico=="A"){
                    const request_correlativo = new mssql.Request(transaction);
                    await request_correlativo
                    .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                    .input('ccod_almacen', mssql.VarChar(250),codigo_punto_venta)
                    .input("tip_doc", mssql.VarChar(250), codigo_movimiento)
                    .input("cnum_serie", mssql.VarChar(250), serie)
                    .input("numero_Correlativo", mssql.VarChar(250), parseInt(numero_correlativo))
                    .query("UPDATE Htalonar SET ultimo_grab = @numero_correlativo\n"+ 
                    "WHERE ccod_empresa = @ccod_empresa AND ccod_almacen = @ccod_almacen\n"+ 
                    "AND tip_doc = @tip_doc AND cnum_serie = @cnum_serie")
                }
                //#endregion
                var fila_contable=[];
                //#region Contabilidad
                console.log(codigo_movimiento);
                if (codigo_movimiento == "NE" || codigo_movimiento == "NS" || codigo_movimiento == "NT") {
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

                    //#region Generar Correlativo Contabilidad
                    const request_automatico_contabilidad  = new mssql.Request(transaction);
                    const result_automatico_contabilidad = await request_automatico_contabilidad
                    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
                    .input('ejercicio', mssql.VarChar(250), ejercicio)
                    .input('periodo', mssql.VarChar(250), periodo)
                    .input('subvoucher', mssql.VarChar(250), '58')
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
                        "and CCOD_SVOUCHER='58' \n"+
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
                    .input('ccod_svoucher', mssql.VarChar(250), '58')
                    .input('cnum_doc', mssql.VarChar(250), numero_correlativo_contabilidad)
                    .input('automatico', mssql.VarChar(250), 'A')
                    .input('dfecha_doc', mssql.Date, req.body.fecha_doc)
                    .input('fecha_referencia', mssql.Date, req.body.fecha_referencia)
                    .input('tipo2', mssql.VarChar(250), '00')
                    .input('serie2', mssql.VarChar(250), '')
                    .input('numero2', mssql.VarChar(250), '')
                    .input('dfecha_docref', mssql.Date, req.body.fecha_doc)
                    .input('ctip_docref', mssql.VarChar(250), codigo_movimiento)
                    .input('cserie_docref', mssql.VarChar(250), serie)
                    .input('cnum_docref', mssql.VarChar(250), numero_correlativo)
                    .input('ctip_auxiliar', mssql.VarChar(250), '00')
                    .input('ccod_anexo', mssql.VarChar(250), '')
                    .input('cnom_anexo', mssql.VarChar(250), '')
                    .input('cmoneda', mssql.VarChar(250), req.body.moneda)
                    .input('ctip_cambio', mssql.VarChar(250), req.body.tipo_cambio)
                    .input('tipo_cambio', mssql.VarChar(250), req.body.tasa_cambio)
                    .input('tc_ref', mssql.VarChar(250), '0')
                    .input('tipo_registro', mssql.VarChar(250), 'ST')
                    .input('glosa', mssql.VarChar(250), req.body.Glosa)
                    .input('estado', mssql.VarChar(250), req.body.estado)
                    .input('dest_operacion', mssql.VarChar(250), '004')
                    .input('modulo_origen', mssql.VarChar(250), 'ALMA')
                    .input('a_dua', mssql.VarChar(250), '')
                    .input('mnbaseimpgrav', mssql.VarChar(250), '0')
                    .input('mnbaseimpnograv', mssql.VarChar(250), req.body.subtotal_sin_descuentos)
                    .input('mnigvgrav', mssql.VarChar(250),'0')
                    .input('nimporte', mssql.VarChar(250), req.body.subtotal_sin_descuentos)
                    .input('otros_tributos', mssql.VarChar(250), '0')
                    .input('ventas_diferidas', mssql.VarChar(250), '0')
                    .input('base_con_mn', mssql.VarChar(250), '0')
                    .input('base_sin_mn', mssql.VarChar(250), '0')
                    .input('igv_mn', mssql.VarChar(250), '0')
                    .input('otros_mn', mssql.VarChar(250), '0')
                    .input('importe_mn', mssql.VarChar(250), '0')
                    .input('detraccion_mn', mssql.VarChar(250), '0')
                    .input('venta_diferida_mn', mssql.VarChar(250), '0')
                    .input('base_con_me', mssql.VarChar(250), '0')
                    .input('base_sin_me', mssql.VarChar(250), '0')
                    .input('igv_me', mssql.VarChar(250), '0')
                    .input('otros_me', mssql.VarChar(250), '0')
                    .input('importe_me', mssql.VarChar(250), '0')
                    .input('detraccion_me', mssql.VarChar(250), '0')
                    .input('venta_diferida_me', mssql.VarChar(250), '0')
                    .input('dfecha_venc', mssql.Date, req.body.fecha_validez)
                    .input('detraccion_sn', mssql.VarChar(250), 'N')
                    .input('ccod_detraccion', mssql.VarChar(250), '00')
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
                    .input('erp_motivo_venta', mssql.VarChar(250), '')
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
                    .input('icbper', mssql.VarChar(250), '0')
                    .input('icbper_mn', mssql.VarChar(250), '0')
                    .input('icbper_me', mssql.VarChar(250), '0')
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

                    //#region  Guardar Detalle Contable
                    if (codigo_movimiento == "NE" || codigo_movimiento == "NS" || codigo_movimiento == "NT") {
                        for (let i= 0; i< filas_detalle.length; i++){
                            rowid = filas_detalle[i];
                            var request_contabilidad_detalle_cuenta_detalle  = new mssql.Request(transaction);
                            var result_contabilidad_detalle_cuenta_detalle = await request_contabilidad_detalle_cuenta_detalle
                            .input('codigo_empresa',mssql.VarChar(250), codigo_empresa)
                            .input('codigo',mssql.VarChar(250), rowid.Codigo)
                            .query(
                                "Select \n"+
                                "hfam_art.ccuenta_h as Cuenta,  \n"+
                                "hfam_art.cta_alm_ne_haber as Cuenta_Almacen_NE_Haber,  \n"+
                                "hfam_art.cta_alm_ne_debe as Cuenta_Almacen_NE_Debe,\n"+
                                "hfam_art.cta_alm_ns_haber as Cuenta_Almacen_NS_Haber,  \n"+
                                "hfam_art.cta_alm_ns_debe as Cuenta_Almacen_NS_Debe\n"+
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
                                Monto: rowid.Base_Calculada,
                                Tc : req.body.tasa_cambio,
                                Moneda : req.body.moneda,
                                D_H: 'H',
                            });

                            var cuenta_productos = '';
                            if(codigo_movimiento == "NE"){
                                cuenta_productos = recordset_contabilidad_detalle_cuenta_detalle.Cuenta_Almacen_NE_Haber;

                                var request_contabilidad_detalle_cuenta_transferencia1  = new mssql.Request(transaction);
                                var result_contabilidad_detalle_cuenta_trasferencia1 = await request_contabilidad_detalle_cuenta_transferencia1
                                .input('codigo_empresa',mssql.VarChar(250), codigo_empresa)
                                .input('ccuenta',mssql.VarChar(250), cuenta_productos)
                                .query(
                                    "select \n"+
                                    "ccuenta as Cuenta, \n"+
                                    "sitransfer as Si_Transferencia\n"+
                                    "from Hplancon  \n"+
                                    "where ccod_empresa = @codigo_empresa and ccuenta = @ccuenta \n"
                                );
                                var recordset_contabilidad_detalle_cuenta_transferencia1 = result_contabilidad_detalle_cuenta_trasferencia1.recordset[0];

                            }else{
                                cuenta_productos = recordset_contabilidad_detalle_cuenta_detalle.Cuenta_Almacen_NS_Haber;

                                var request_contabilidad_detalle_cuenta_transferencia1  = new mssql.Request(transaction);
                                var result_contabilidad_detalle_cuenta_trasferencia1 = await request_contabilidad_detalle_cuenta_transferencia1
                                .input('codigo_empresa',mssql.VarChar(250), codigo_empresa)
                                .input('ccuenta',mssql.VarChar(250), cuenta_productos)
                                .query(
                                    "select \n"+
                                    "ccuenta as Cuenta, \n"+
                                    "sitransfer as Si_Transferencia\n"+
                                    "from Hplancon  \n"+
                                    "where ccod_empresa = @codigo_empresa and ccuenta = @ccuenta \n"
                                );
                                var recordset_contabilidad_detalle_cuenta_transferencia1 = result_contabilidad_detalle_cuenta_trasferencia1.recordset[0];
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
                                d_h : 'H',
                                Si_Diferencia : 'N',
                                Si_Transferencia : 'N',
                                Tipo_Origen : 'N',
                                Si_Detraccion : 'N',
                                Si_Retencion : 'N',
                                Si_Percepcion : 'N',
                                Producto_Codigo : rowid.Codigo,
                                Producto_Item : i+1,
                            });

                            if(codigo_movimiento == "NE"){
                                cuenta_productos = recordset_contabilidad_detalle_cuenta_detalle.Cuenta_Almacen_NE_Debe;

                                var request_contabilidad_detalle_cuenta_transferencia2  = new mssql.Request(transaction);
                                var result_contabilidad_detalle_cuenta_trasferencia2 = await request_contabilidad_detalle_cuenta_transferencia2
                                .input('codigo_empresa',mssql.VarChar(250), codigo_empresa)
                                .input('ccuenta',mssql.VarChar(250), cuenta_productos)
                                .query(
                                    "select \n"+
                                    "ccuenta as Cuenta, \n"+
                                    "sitransfer as Si_Transferencia\n"+
                                    "from Hplancon  \n"+
                                    "where ccod_empresa = @codigo_empresa and ccuenta = @ccuenta \n"
                                );
                                var recordset_contabilidad_detalle_cuenta_transferencia2 = result_contabilidad_detalle_cuenta_trasferencia2.recordset[0];

                            }else{
                                cuenta_productos = recordset_contabilidad_detalle_cuenta_detalle.Cuenta_Almacen_NS_Debe;

                                var request_contabilidad_detalle_cuenta_transferencia2  = new mssql.Request(transaction);
                                var result_contabilidad_detalle_cuenta_trasferencia2 = await request_contabilidad_detalle_cuenta_transferencia2
                                .input('codigo_empresa',mssql.VarChar(250), codigo_empresa)
                                .input('ccuenta',mssql.VarChar(250), cuenta_productos)
                                .query(
                                    "select \n"+
                                    "ccuenta as Cuenta, \n"+
                                    "sitransfer as Si_Transferencia\n"+
                                    "from Hplancon  \n"+
                                    "where ccod_empresa = @codigo_empresa and ccuenta = @ccuenta \n"
                                );
                                var recordset_contabilidad_detalle_cuenta_transferencia2 = result_contabilidad_detalle_cuenta_trasferencia2.recordset[0];
                                console.log(recordset_contabilidad_detalle_cuenta_transferencia2)
                            }

                            var calculos_mn_me = await helpers.getCalculosMnMe({
                                Monto: rowid.Base_Calculada,
                                Tc : req.body.tasa_cambio,
                                Moneda : req.body.moneda,
                                D_H: 'D',
                            });

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
                                d_h : 'D',
                                Si_Diferencia : 'N',
                                Si_Transferencia : 'N',
                                Tipo_Origen : 'N',
                                Si_Detraccion : 'N',
                                Si_Retencion : 'N',
                                Si_Percepcion : 'N',
                                Producto_Codigo : rowid.Codigo,
                                Producto_Item : i+1,
                            });

                            if (recordset_contabilidad_detalle_cuenta_transferencia1.Si_Transferencia == 'S') {
                                var request_contabilidad_detalle_cuentas  = new mssql.Request(transaction);
                                var result_contabilidad_detalle_cuentas = await request_contabilidad_detalle_cuentas
                                .input('codigo_empresa',mssql.VarChar(250), codigo_empresa)
                                .input('ccuenta',mssql.VarChar(250), recordset_contabilidad_detalle_cuenta_transferencia1.Cuenta)
                                .query(
                                 "select  \n"+
                                 "cxtransfer as Cuenta, \n"+
                                 "nporc_debe, \n"+
                                 "nporc_haber, \n"+
                                 "(case nporc_debe when 0 then 'H' else 'D' end) as D_H \n"+
                                 "from hctatrf \n"+
                                 "Where ccod_empresa = @codigo_empresa And ccuenta = @ccuenta \n"
                                );
                                var filas_cuantas_transferencia = result_contabilidad_detalle_cuentas.recordset

                                for (let k = 0; k < filas_cuantas_transferencia.length; k++) {
                                    const element = filas_cuantas_transferencia[k];
                                    console.log(element)
                                    var calculos_mn_me = await helpers.getCalculosMnMe({
                                        Monto: rowid.Base_Calculada,
                                        Tc : req.body.tasa_cambio,
                                        Moneda : req.body.moneda,
                                        D_H: element.D_H,
                                    });
                                    
                                    fila_contable.push({
                                        cuenta_codigo : element.Cuenta,
                                        tipo_auxiliar : '00',
                                        codigo_auxiliar : '',
                                        nombre_auxiliar : '',
                                        debe : calculos_mn_me.Debe,
                                        debe_mn : calculos_mn_me.Debe_MN,
                                        debe_me : calculos_mn_me.Debe_ME,
                                        haber : calculos_mn_me.Haber,
                                        haber_mn : calculos_mn_me.Haber_MN,
                                        haber_me : calculos_mn_me.Haber_ME,
                                        d_h : element.D_H,
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
                            }
                            if (recordset_contabilidad_detalle_cuenta_transferencia2.Si_Transferencia == 'S') {
                                var request_contabilidad_detalle_cuentas  = new mssql.Request(transaction);
                                var result_contabilidad_detalle_cuentas = await request_contabilidad_detalle_cuentas
                                .input('codigo_empresa',mssql.VarChar(250), codigo_empresa)
                                .input('ccuenta',mssql.VarChar(250), recordset_contabilidad_detalle_cuenta_transferencia2.Cuenta)
                                .query(
                                 "select  \n"+
                                 "cxtransfer as Cuenta, \n"+
                                 "nporc_debe, \n"+
                                 "nporc_haber, \n"+
                                 "(case nporc_debe when 0 then 'H' else 'D' end) as D_H \n"+
                                 "from hctatrf \n"+
                                 "Where ccod_empresa = @codigo_empresa And ccuenta = @ccuenta \n"
                                );
                                var filas_cuantas_transferencia = result_contabilidad_detalle_cuentas.recordset

                                for (let k = 0; k < filas_cuantas_transferencia.length; k++) {
                                    const element = filas_cuantas_transferencia[k];

                                    var calculos_mn_me = await helpers.getCalculosMnMe({
                                        Monto: rowid.Base_Calculada,
                                        Tc : req.body.tasa_cambio,
                                        Moneda : req.body.moneda,
                                        D_H: element.D_H,
                                    });
                                    
                                    fila_contable.push({
                                        cuenta_codigo : element.Cuenta,
                                        tipo_auxiliar : '00',
                                        codigo_auxiliar : '',
                                        nombre_auxiliar : '',
                                        debe : calculos_mn_me.Debe,
                                        debe_mn : calculos_mn_me.Debe_MN,
                                        debe_me : calculos_mn_me.Debe_ME,
                                        haber : calculos_mn_me.Haber,
                                        haber_mn : calculos_mn_me.Haber_MN,
                                        haber_me : calculos_mn_me.Haber_ME,
                                        d_h : element.D_H,
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
                            }
                        }
                    }

                    var nitem = 0;
                    for(var j=0;j<fila_contable.length;j++){
                        nitem++;
                        var request_contabilidad_detalle  = new mssql.Request(transaction);
                        await request_contabilidad_detalle
                        .input('ccod_empresa',mssql.VarChar(250), codigo_empresa)
                        .input('ejercon',mssql.VarChar(250), ejercicio)
                        .input('periodo_con',mssql.VarChar(250), periodo)
                        .input('ccod_svoucher',mssql.VarChar(250), '58')
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
                        .input('ctip_docref',mssql.VarChar(250), fila_contable[j].Tipo_Documento || codigo_movimiento)
                        .input('cnum_serieref',mssql.VarChar(250),fila_contable[j].Serie_Documento ||  serie)
                        .input('cnum_docref',mssql.VarChar(250),fila_contable[j].Numero_Documento ||  numero_correlativo)
                        .input('dfechadocref',mssql.VarChar(250),fila_contable[j].Fecha_Documento ||  req.body.fecha_doc)
                        .input('tipodoc_2',mssql.VarChar(250), fila_contable[j].Tipo_Documento_Referencia || '00')
                        .input('seriedoc_2',mssql.VarChar(250), fila_contable[j].Serie_Documento_Referencia || '')
                        .input('numdoc_2',mssql.VarChar(250), fila_contable[j].Numero_Documento_Referencia || '')
                        .input('fechadoc_2',mssql.VarChar(250), fila_contable[j].Fecha_Documento_Referencia || '1900/01/01')
                        .input('monto_ref',mssql.VarChar(250), '0')
                        .input('CMONEDA_DOCREF',mssql.VarChar(250), req.body.moneda)
                        .input('TIPO_CAMBIO_DOCREF',mssql.VarChar(250), req.body.tasa_cambio)
                        .input('subvoucher_ref',mssql.VarChar(250), '58')
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
                        .input('erp_codven2',mssql.VarChar(250), '00')
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
                    //#endregion
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

router.post('/lista', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa
        const codigo_punto_venta = req.user.codigo_punto_venta;

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
        .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
        .input('anio', mssql.VarChar(250), req.body.anio)
        .input('mes', mssql.VarChar(250), req.body.meses)
        .input('fecha_inicio', mssql.VarChar(250), req.body.fecha_inicio)
        .input('fecha_final', mssql.VarChar(250), req.body.fecha_final)
        .query(
            "select \n"+
            "Halmacen.cnom_almacen as Punto_Venta, \n"+
            "(case Hmovialc.ctip_movimiento \n"+
            "when 'E' then 'ENTRADA' \n"+
            "when 'S' then 'SALIDA' \n"+
            "when 'T' then 'TRANSFERENCIA' \n"+
            "else 'AJUSTE' end) as Tipo_Compra, \n"+
            "Htransal.cnom_movimiento as Tipo_Documento, \n"+
            "Hmovialc.cnum_serie as Motivo_Serie, \n"+
            "Hmovialc.cnum_doc as Numero, \n"+
            "CONVERT(VARCHAR(50),Hmovialc.dfecha_doc,103) as Fecha, \n"+
            "case Hmovialc.ccod_proveedor when '00' then '' else Hmovialc.ccod_proveedor end as Codigo_Proveedor, \n"+
            "Hmovialc.cnom_proveedor_c as Nombre_Proveedor, \n"+
            "CONVERT(VARCHAR(50),Hmovialc.dfecha_entr,103) as Fecha_Entrega, \n"+
            "'' as Fecha_Limite, \n"+
            "'' as Forma_Pago, \n"+
            "'' as Prioridad, \n"+
            "Hmovialc.cmoneda as Moneda, \n"+
            "Hmovialc.tipo_cambio as Tc, \n"+
            "Responsable.ccod_person as Codigo_Responsable, \n"+
            "Responsable.ape_pat +' '+ Responsable.ape_mat + ' '+ Responsable.nombres as Responsable, \n"+
            "'' as Aprobacion_1, \n"+
            "'' as Usuario_Aprobacion_1, \n"+
            "'' as Aprobacion_2, \n"+
            "'' as Usuario_Aprobacion_2, \n"+
            "Hmovialc.estado as Estado, \n"+
            "'' as Atencion, \n"+
            "Hmovialc.porcentaje as Porcentaje, \n"+
            "Hmovialc.ctip_docref as Documento_Referencia, \n"+
            "Hmovialc.cserie_docref as Serie_Notivo_Referencia, \n"+
            "Hmovialc.cnum_docref as Numero_Referencia, \n"+
            "Hmovialc.glosa as glosa, \n"+
            "Hmovialc.si_igv as si_igv, \n"+
            "Hmovialc.erp_codune as Codigo_Unidad_Negocio, \n"+
            "Hmovialc.erp_codune as Unidad_Negocio, \n"+
            "Hmovialc.ccod_cencos as Cencos, \n"+
            "Hmovialc.ot as Ot, \n"+
            "erp_codage as Codigo_Agencia, \n"+
            "Hcencos.cnom_cencos as Nombre_Cencos, \n"+
            "'' as Nombre_Motivo, \n"+
            "Hmovialc.porc_descuento as Porc_Descuento, \n"+
            "Hproveed.ctelefonos as Telefono_Proveedor, \n"+
            "'' as Codigo_Contacto, \n"+
            "'' as Nombre_Contacto, \n"+
            "Hproveed.ce_mail as Correo_Proveedor, \n"+
            "'' as Dias_Forma_Pago, \n"+
            "Hmovialc.subtotal_sin_descuentos as Sub_Total_Sin_Descuentos, \n"+
            "Hmovialc.erp_Ddescuento as Monto_Descuento, \n"+
            "Hmovialc.erp_Dsubtotal as Sub_Total, \n"+
            "Hmovialc.erp_Digv as Igv, \n"+
            "Hmovialc.erp_Dimporte as Total, \n"+
            "case Hmovialc.ccod_cliente when '00' then '' else Hmovialc.ccod_cliente end as Codigo_Cliente, \n"+
            "Hmovialc.cnom_cliente_v as Nombre_Cliente, \n"+
            "Hmovialc.pto_llegada_02 as Punto_Llegada, \n"+
            "'' as Proveedor_Direccion, \n"+
            "Hmovialc.usuario as Usuario, \n"+
            "Hmovialc.Pc_User as Nombre_Pc, \n"+
            "Hmovialc.Pc_Fecha as Pc_Fecha, \n"+
            "Hmovialc.Pc_Ip as Pc_Ip, \n"+
            "Hmovialc.erp_nro_exp as Numero_Expediente, \n"+
            "'' as Comentario, \n"+
            "Hmovialc.ccod_almacen as Codigo_Punto_Venta, \n"+
            "Hmovialc.cnum_serie as Codigo_Motivo_Serie, \n"+
            "Hmovialc.ccod_transaccion as Codigo_Transaccion, \n"+
            "hmovialc.ctip_movimiento as Codigo_Tipo_Documento \n"+
            "FROM Hmovialc \n"+
            "left join Hproveed on \n"+
            "Hmovialc.ccod_empresa = Hproveed.ccod_empresa \n"+
            "and Hmovialc.ccod_proveedor = Hproveed.ccod_proveedor \n"+
            "left Join Hperson as Responsable \n"+
            "On Hmovialc.ccod_empresa = Responsable.ccod_empresa and \n"+
            "case Hmovialc.ccod_responsable when '00' then '' else Hmovialc.ccod_responsable end = Responsable.ccod_person \n"+
            "Inner Join Erp_Unidad_Negocio \n"+
            "On Hmovialc.ccod_empresa = Erp_Unidad_Negocio.erp_codemp and \n"+
            "Hmovialc.erp_codune = Erp_Unidad_Negocio.erp_codune \n"+
            "Inner Join Hcencos \n"+
            "On Hmovialc.ccod_empresa = Hcencos.ccod_empresa and \n"+
            "Hmovialc.ccod_cencos = Hcencos.ccod_cencos \n"+
            "Inner Join Horden_Trabajo \n"+
            "On Hmovialc.ccod_empresa = Horden_trabajo.ccod_empresa and \n"+
            "Hmovialc.ot = Horden_Trabajo.ccod_ot \n"+
            "Inner Join Halmacen \n"+
            "On Hmovialc.ccod_empresa = Halmacen.ccod_empresa and \n"+
            "Hmovialc.ccod_almacen = Halmacen.ccod_almacen \n"+
            "Inner Join Hmotivo_traslado \n"+
            "On Hmovialc.Ccod_Empresa = Hmotivo_traslado.Ccod_Empresa And \n"+
            "Hmovialc.Motivo_Traslado  = Hmotivo_traslado.Ccod_motivo \n"+
            "inner join Htransal on \n"+
            "Hmovialc.ccod_empresa = Htransal.ccod_empresa \n"+
            "and Hmovialc.ctip_movimiento = Htransal.ctip_movimiento \n"+
            "and Hmovialc.ccod_transaccion = Htransal.ccod_movimiento \n"+
            "WHERE \n"+
            "hmovialc.modulo = 'INVENTARIO' \n"+
            "and Hmovialc.ccod_empresa = @codigo_empresa \n"+
            "AND Hmovialc.ccod_almacen = @codigo_punto_venta \n"+opcion+
            "order by ncorrel desc \n"  
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
        .input("CCOD_MOVIMIENTO", mssql.VarChar(250), "N"+ req.body.tipo_documento)
        .input("CNUM_SERIE", mssql.VarChar(250), req.body.motivo_serie)
        .input("CNUM_DOC", mssql.VarChar(250), req.body.numero_documento)
        .query(
            "select \n"+
            "(case hmovialc.ccod_movimiento when 'NE' then 'NOTA DE ENTRADA' \n"+
            "else (case hmovialc.ccod_movimiento when 'NS' then 'NOTA DE SALIDA' else 'NOTA  DE TRANSFERENCIA' end) end) as documento_nombre, \n"+
            "hmovialc.ctip_movimiento as documento_tipo, \n"+
            "hmovialc.ccod_movimiento as documento_tipo_movimiento, \n"+
            "LTRIM(RTRIM(hmovialc.ccod_transaccion)) as documento_tipo_transaccion, \n"+
            "hmovialc.ccod_almacen as documento_punto_venta_codigo, \n"+
            "Halmacen.cnom_almacen as documento_punto_venta_nombre, \n"+
            "hmovialc.cnum_serie as documento_motivo_venta_codigo, \n"+
            "hmovialc.cnum_doc as documento_numero, \n"+
            "CONVERT(VARCHAR(50), hmovialc.dfecha_doc, 103) as documento_fecha, \n"+
            "CONVERT(VARCHAR(50), hmovialc.dfecha_doc, 23) as documento_fecha_format23, \n"+
            "CONVERT(VARCHAR(50), hmovialc.fecha_emision, 23) as documento_fecha_emision, \n"+
            "hmovialc.cmoneda as documento_moneda, \n"+
            "hmovialc.nimporte as documento_nimporte, \n"+
            "RTRIM(LTRIM(hmovialc.ccod_forpago)) as documento_forma_pago_codigo, \n"+
            "hmovialc.ccod_cliente as codigo_cliente, \n"+
            "hmovialc.cnom_cliente_v as cliente_nombre, \n"+
            "hmovialc.ccod_proveedor as codigo_proveedor, \n"+
            "hmovialc.cnom_Proveedor_c as proveedor_nombre, \n"+
            "hmovialc.ccod_proveedor as proveedor_ruc, \n"+
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
            "--LTRIM(RTRIM(hmovialc.pais)) as cliente_pais, \n"+
            "hmovialc.atencion as documento_atencion_estado, \n"+
            "hmovialc.porcentaje as documento_atencion_porcentaje, \n"+
            "'' as cliente_contacto_codigo, \n"+
            "LTRIM(RTRIM(hmovialc.ccod_vendedor)) as documento_vendedor1, \n"+
            "hmovialc.idvendedor2 as documento_vendedor2, \n"+
            "hmovialc.glosa as documento_glosa, \n"+
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
            "hmovialc.erp_Dimporte as documento_importe, \n"+
            "hmovialc.erp_Dpercepcion as documento_percepcion, \n"+
            "hmovialc.erp_Dtotal as documento_total, \n"+
            "hmovialc.erp_gestor as gestor_codigo, \n"+
            "'' as documento_referencia_motivo_codigo, \n"+
            "'' as cliente_contacto_nombre, \n"+
            "hmovialc.erp_codune as unidad_negocio_codigo, \n"+
            "hmovialc.ccod_transportista as codigo_transportista, \n"+
            "hmovialc.ccod_vehiculo as codigo_vehiculo, \n"+
            "LTRIM(RTRIM(hmovialc.motivo_traslado)) as motivo_traslado, \n"+
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
            "hmovialc.automatico as documento_automatico,\n"+
            "hmovialc.ccod_responsable as documento_responsable,\n"+
            "hmovialc.erp_nro_exp as documento_numero_expediente,\n"+
            "LTRIM(RTRIM(hmovialc.motivo_traslado)) as documento_motivo_documento,\n"+
            "hmovialc.ctip_docref as documento_tipo_referencia,\n"+
            "hmovialc.cserie_docref as documento_serie_referencia,\n"+
            "hmovialc.cnum_docref as documento_numero_referencia,\n"+
            "hmovialc.tipdoc_ref_2 as documento_tipo_referencia_2,\n"+
            "hmovialc.motivo_ref_2 as documento_serie_referencia_2,\n"+
            "hmovialc.nro_ref_2 as documento_numero_referencia_2,\n"+
            "hmovialc.serie_fac_prov as documento_serie_factura,\n"+
            "hmovialc.nro_fac_prov as documento_numero_factura,\n"+
            "hmovialc.serie_guia_prov as documento_serie_guia_remision,\n"+
            "hmovialc.nro_guia_prov as documento_numero_guia_remision,\n"+
            "LTRIM(RTRIM(hmovialc.erp_codagente)) as proveedor_agencia,\n"+
            "hmovialc.ccod_almacend as documento_codigo_almacen,\n"+
            "Halmacen_2.cnom_almacen as articulo_nombre_almacen_origen,\n"+
            "hmovialc.ccod_almacen2 as documento_codigo_punto_venta_2,\n"+
            "LTRIM(RTRIM(hmovialc.ccod_almacend2)) as documento_codigo_almacen_destino_2,\n"+
            "hmovialc.automatico_destino as documento_automatico_destino,\n"+
            "hmovialc.serie_destino as documento_serie_destino,\n"+
            "hmovialc.numero_destino  as  documento_numero_destino,\n"+
            "CONVERT(VARCHAR(50),Hmovialc.dfecha_entr,23) as Fecha_Entrega, \n"+
            "HTRANSAL.cnom_movimiento as documento_nombre_tipo_transaccion, \n"+
            "(case hmovialc.ccod_cliente when '00' then hmovialc.ccod_proveedor +' - '+hmovialc.cnom_proveedor_c  \n"+
            "else hmovialc.ccod_cliente +' - '+hmovialc.cnom_cliente_v end) as documento_nombre_entidad, \n"+
            "Ltrim(rtrim(ape_pat)) + ' ' + Ltrim(rtrim(ape_mat)) + ' ' +Ltrim(rtrim(nombres)) as documento_nombre_responsable, \n"+
            "hmovialc.observacion as Comentario01, \n"+
            "--Proveedor \n"+
            "Hproveed.cdireccion as proveedor_direccion, \n"+
            "Hproveed.ctelefonos as proveedor_telefono, \n"+ 
            "Hproveed.cfax as proveedor_fax, \n"+ 
            "Hproveed.ce_mail as proveedor_correo, \n"+ 
            "Hproveed.pais as proveedor_cliente, \n"+ 
            "--Cliente \n"+
            "hcliente.cdireccion as cliente_direccion, \n"+
            "hcliente.ccod_pais as cliente_pais, \n"+ 
            "--Forma Pago \n"+
            "Hfor_pag.cnom_forpago as forma_pago_nombre, \n"+
            "--Responsable \n"+
            "Hperson.erp_cargo  as Responsable_Cargo, \n"+
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
            "HMOVIALD.erp_importe_dec as articulo_importe_dec, \n"+
            "HMOVIALD.erp_comision_porc as articulo_comision_porc, \n"+
            "HMOVIALD.erp_comision_monto as articulo_comision_monto, \n"+
            "HMOVIALD.codigo_presentacion as articulo_presentacion_codigo, \n"+
            "HMOVIALD.Cnro_lote as articulo_lote, \n"+
            " ( select SUM(NCANTIDAD3) from \n"+
            "HMOVIALD where HMOVIALD.ccod_empresa = @ccod_empresa and HMOVIALD.CCOD_MOVIMIENTO = @CCOD_MOVIMIENTO and \n"+
            "HMOVIALD.ccod_almacen = @ccod_almacen and HMOVIALD.CNUM_SERIE = @CNUM_SERIE and HMOVIALD.cnum_doc = @CNUM_DOC) as documento_total_productos, \n"+
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
            "--Configuración Formatos \n"+
            "HCONFIG_FORMATOS.valor as cantidad_filas \n"+
            "from hmovialc \n"+
            "left join HMOVIALD on \n"+
            "hmovialc.ccod_empresa = HMOVIALD.ccod_empresa \n"+
            "and hmovialc.ccod_movimiento = HMOVIALD.CCOD_MOVIMIENTO \n"+
            "and hmovialc.ccod_almacen = HMOVIALD.ccod_almacen \n"+
            "and hmovialc.cnum_serie = HMOVIALD.CNUM_SERIE \n"+
            "and hmovialc.cnum_doc = HMOVIALD.cnum_doc \n"+
            "inner join Hproveed on \n"+
            "hmovialc.ccod_empresa = Hproveed.ccod_empresa \n"+
            "and hmovialc.ccod_proveedor = Hproveed.ccod_proveedor \n"+
            "inner join hcliente on \n"+
            "hmovialc.ccod_empresa = hcliente.ccod_empresa \n"+
            "and hmovialc.ccod_cliente = hcliente.ccod_cliente\n"+
            "inner join Hfor_pag on \n"+
            "hmovialc.ccod_empresa = Hfor_pag.ccod_empresa \n"+
            "and hmovialc.ccod_forpago = Hfor_pag.ccod_forpago \n"+
            "inner join Hperson on \n"+
            "hmovialc.ccod_empresa = Hperson.ccod_empresa and \n"+
            "hmovialc.ccod_responsable = Hperson.ccod_person \n"+
            "inner join Halmacen on \n"+
            "hmovialc.ccod_empresa = Halmacen.ccod_empresa and \n"+
            "hmovialc.ccod_almacen = Halmacen.ccod_almacen  \n"+
            "inner join Halmacen_2 on \n"+
            "hmovialc.ccod_empresa = Halmacen_2.ccod_empresa and \n"+
            "hmovialc.ccod_almacend = Halmacen_2.ccod_almacen  \n"+
            "inner join HTRANSAL on \n"+
            "hmovialc.ccod_empresa = HTRANSAL.ccod_empresa and \n"+
            "hmovialc.ccod_transaccion = HTRANSAL.ccod_movimiento \n"+
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

router.post('/detalle', async (req, res) => {

    const codigo_empresa = req.user.codigo_empresa;
    // const motivo_documento = '022';
    // const numero_documento = '2020-00002';
    // const codigo_punto_venta = '001';
    const tipo_documento = req.body.tipo_documento;
    const numero_documento = req.body.numero_documento;
    var motivo_serie = req.body.motivo_serie;
    var codigo_punto_venta = req.body.codigo_punto_venta;

    if(codigo_punto_venta==""){
        codigo_punto_venta = req.user.codigo_punto_venta;
    }
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('tipo_documento', mssql.VarChar(250), "N"+tipo_documento)
    .input('motivo_serie', mssql.VarChar(250), motivo_serie)
    .input('numero_documento', mssql.VarChar(250), numero_documento)
    .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
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
    "hmoviald.NPRECIO_IMPORTE AS Importe, \n"+ 
    "Harticul.csistock as Stock_SN, \n"+
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
    "HMOVIALD.blote as Lote_SN, \n"+ 
    "HMOVIALD.cnro_lote as Lote_Numero, \n"+ 
    "CONVERT(VARCHAR(50),HMOVIALD.vcto, 103) as Lote_Vencimiento, \n"+ 
    "HMOVIALD.bserie as Serie_SN, \n"+ 
    "HMOVIALD.nro_serie as Serie_Numero, \n"+ 
    "HMOVIALD.ccod_almacen as Punto_Venta, \n"+
    "HMOVIALD.CNUM_SERIE as Codigo_Motivo_Serie, \n"+
    "HMOVIALD.cnum_doc as Numero, \n"+
    "HMOVIALD.motivo_ref_2 as Requerimiento_Motivo, \n"+
    "HMOVIALD.nro_ref_2 as Requerimiento_Numero, \n"+
    "HMOVIALD.idmotivo_compra as Orden_Compra_Motivo, \n"+
    "HMOVIALD.cnum_doc_ordc as Orden_Compra_Numero, \n"+
    "'OC' as Origen_Documento, \n"+
    "HMOVIALD.ccod_almacen as Origen_Punto_Venta, \n"+
    "HMOVIALD.idmotivo_compra as Origen_Motivo_Serie, \n"+
    "HMOVIALD.cnum_doc_ordc as Origen_Numero, \n"+
    "HMOVIALD.origen_item as Origen_NItem \n"+
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
    "HMOVIALD.CNUM_SERIE = @motivo_serie and \n"+
    "HMOVIALD.cnum_doc = @numero_documento and \n"+
    "HMOVIALD.ccod_almacen= @codigo_punto_venta and \n"+
    "HMOVIALD.CCOD_MOVIMIENTO= @tipo_documento \n"+
    "ORDER BY NITEM" );
   
    const recordset = lista.recordset;
    res.json(recordset);
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
                .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                .input("erp_ptovta", mssql.VarChar(250), codigo_punto_venta)
                .input("CCOD_MOVIMIENTO", mssql.VarChar(250), req.body.codigo_movimiento)
                .input("CNUM_SERIE", mssql.VarChar(250), req.body.serie)
                .input("CNUM_DOC", mssql.VarChar(250), req.body.numero_correlativo)
                .query("DELETE FROM HMOVIALD "+
                "WHERE CCOD_EMPRESA = @ccod_empresa AND "+
                "CCOD_ALMACEN = @erp_ptovta AND "+
                "CCOD_MOVIMIENTO = @CCOD_MOVIMIENTO AND "+
                "CNUM_SERIE = @CNUM_SERIE AND "+
                "CNUM_DOC = @CNUM_DOC ")
                
                const request_cabecera = new mssql.Request(transaction);
                await request_cabecera 
                .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                .input("erp_ptovta", mssql.VarChar(250), codigo_punto_venta)
                .input("CCOD_MOVIMIENTO", mssql.VarChar(250), req.body.codigo_movimiento)
                .input("CNUM_SERIE", mssql.VarChar(250), req.body.serie)
                .input("CNUM_DOC", mssql.VarChar(250), req.body.numero_correlativo)
                .query("DELETE FROM hmovialc "+
                "WHERE CCOD_EMPRESA = @ccod_empresa AND "+
                "CCOD_ALMACEN = @erp_ptovta AND "+
                "CCOD_MOVIMIENTO = @CCOD_MOVIMIENTO AND "+
                "CNUM_SERIE = @CNUM_SERIE AND "+
                "CNUM_DOC = @CNUM_DOC")
                
                if( req.body.automatico == "A") {
                    const request_automatico = new mssql.Request(transaction);
                    await request_automatico 
                    .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                    .input('ccod_almacen', mssql.VarChar(250),codigo_punto_venta)
                    .input("tip_doc", mssql.VarChar(250), req.body.codigo_movimiento)
                    .input("cnum_serie", mssql.VarChar(250), req.body.serie)
                    .input("numero_Correlativo", mssql.VarChar(250), parseInt(req.body.numero_correlativo)-1)
                    .query("UPDATE Htalonar SET ultimo_grab = @numero_correlativo "+
                    "WHERE ccod_empresa = @ccod_empresa AND ccod_almacen = @ccod_almacen "+
                    "AND tip_doc = @tip_doc AND cnum_serie = @cnum_serie")
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
        res.send({estado: false, codigo: err.number, mensaje: err.message})
    }
});

router.post('/anular', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.user.codigo_punto_venta;
        
        const pool = await poolPromise
        const Detalle = await pool
        .request()
        .input('ccod_empresa', mssql.VarChar(250), codigo_empresa)
        .input('ccod_almacen', mssql.VarChar(250), codigo_punto_venta)
        .input('ccod_movimiento', mssql.VarChar(250), req.body.codigo_movimiento)
        .input('cnum_serie', mssql.VarChar(250), req.body.serie)
        .input('cnum_doc', mssql.VarChar(250), req.body.numero_correlativo)
        .query("update hmovialc set estado = 'Anulado' "+
        "where ccod_empresa = @ccod_empresa and ccod_almacen = @ccod_almacen and "+
        "cnum_serie = @cnum_serie  and cnum_doc = @cnum_doc")

        res.send({estado: true, codigo: 0, mensaje: ""});
    
    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
})

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
            "HTRANSAL.cnom_movimiento as Tipo_Compra, \n"+
            "hmovialc.ccod_movimiento as Tipo_Documento, \n"+
            "Rtrim(Ltrim(Hmovialc.cnum_serie)) as Codigo_Motivo_Serie, \n"+
            "Hmovialc.cnum_doc as Numero, \n"+
            "CONVERT(VARCHAR(50),Hmovialc.dfecha_doc,103) as Fecha, \n"+
            "hmovialc.ccod_proveedor as Codigo_Proveedor, \n"+
            "hmovialc.cnom_proveedor_c as Nombre_Proveedor, \n"+
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
            "Hproveed.cdireccion as Proveedor_Direccion, \n"+
            "hmovialc.ccod_vehiculo as Codigo_Vehiculo, \n"+
            "hmovialc.ccod_transportista as Codigo_Transportista, \n"+
            "hmovialc.nombre_chofer as Codigo_Chofer, \n"+
            "LTRIM(RTRIM(hmovialc.motivo_traslado)) as Motivo_Trasl, \n"+
            "hmovialc.erp_agencia as Agencia_Transporte, \n"+
            "hmovialc.ctip_docref as Tipo_Referencia_Documento, \n"+
            "hmovialc.cserie_docref as Motivo_Serie_Referencia_Documento, \n"+
            "hmovialc.cnum_docref as Numero_Referencia_Documento, \n"+
            "Hmovialc.ccod_cliente as Codigo_Cliente, \n"+
            "Hmovialc.cnom_cliente_v as Nombre_Cliente, \n"+
            "hcliente.cdireccion as Cliente_Direccion \n"+
            "From Hmovialc \n"+
            "left Join Hcliente On \n"+
            "Hmovialc.ccod_empresa= Hcliente.ccod_empresa And \n"+
            "Hmovialc.ccod_cliente = Hcliente.ccod_cliente \n"+
            "left Join Hproveed On \n"+
            "Hmovialc.ccod_empresa= Hproveed.ccod_empresa And \n"+
            "Hmovialc.ccod_proveedor = Hproveed.ccod_proveedor \n"+
            "inner join  HTRANSAL on \n"+
            "HMOVIALC.ccod_empresa = HTRANSAL.ccod_empresa \n"+
            "and HMOVIALC.ccod_transaccion = HTRANSAL.ccod_movimiento \n"+
            "Inner Join hcencos On \n"+
            "Hmovialc.ccod_cencos = hcencos.ccod_cencos And \n"+
            "Hmovialc.ccod_empresa = hcencos.ccod_empresa \n"+
            "Where Hmovialc.ccod_empresa = @codigo_empresa And \n"+
            "Hmovialc.ccod_almacen = @codigo_punto_venta AND \n"+
            "case @todos when 'S' then '' else Hmovialc.atencion end <> 'Atendido' \n"+
            "and Hmovialc.estado <> 'Anulado' \n"+
            "and ( \n"+
            "hmovialc.ccod_movimiento = (case @tipo_venta_guia when 'NS' then 'NS' else '' end) \n"+
            "or hmovialc.ccod_movimiento = (case @tipo_venta_guia when 'NE' then 'NE' else '' end) \n"+
            "or hmovialc.ccod_movimiento = (case @tipo_venta_guia when 'NT' then 'NT' else '' end) \n"+
            ") \n"+
            // "and (Hmovialc.ccod_cliente = \n"+
            // "(case when @codigo_cliente = '' then Hmovialc.ccod_cliente else @codigo_cliente end ) \n"+
            // "or Hmovialc.ccod_proveedor = \n"+
            // "(case when @codigo_cliente = '' then Hmovialc.ccod_proveedor else @codigo_cliente end )) \n"+
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
module.exports = router;