const express = require('express');
const router = express.Router();
const {isLoggedin} = require('../../../lib/auth');
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

router.post('/configuraciones4', async (req, res) => {
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .query("select erp_sitlet_mn, erp_sitlet_me from erp_configuraciones_4 where erp_codemp=@codigo_empresa ");
  
    const recordset = lista.recordset;
    res.json(recordset);
});

router.get('/letras_cxc',isLoggedin,async (req, res) => {
    //const {cob_pag} = req.params;
    //var subvoucher = cob_pag == "cuentas_por_cobrar" ? '06' : '05';
    //res.render("modulos/provisiones/letras_cxc",{cob_pag: cob_pag, subvoucher: subvoucher});
    res.render("modulos/provisiones/letras_cxc");
});

router.get('/situacion_letras',isLoggedin,async (req, res) => {
    res.render("modulos/provisiones/situacion_letras");
});

router.post('/detalle', async (req, res) => {
    try{
        const codigo_empresa = req.user.codigo_empresa;

        var Cob_Pag = '';
        var numero_contable = req.body.numero_documento_contable;

        const pool = await poolPromise;
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('cob_pag', mssql.VarChar(250), Cob_Pag)
        .input('numero_contable', mssql.VarChar(250), numero_contable)
        .query(
            "select   \n"+
            "erp_codemp as  Codigo_Empresa, \n"+
            "erp_cobpag as  Cob_Pag, \n"+
            "erp_itemov as  Item, \n"+
            "erp_codtia as  Tipo_Anexo, \n"+
            "erp_codane as  Codigo_Anexo, \n"+
            "erp_nomane as  Nombre_Anexo, \n"+
            "erp_tipdoc as  Tipo_Doc, \n"+
            "erp_serdoc as  Serie_Doc, \n"+
            "erp_numdoc as  Numero_Doc, \n"+
            "convert(varchar,erp_fecemi,103) as  Fecha_Emision, \n"+
            "convert(varchar,erp_fecven,103) as  Fecha_Vencimiento, \n"+
            "erp_codmon as  Moneda, \n"+
            "erp_tipcam as  Tc, \n"+
            "erp_impmn  as  Importe_Mn, \n"+
            "erp_impme  as  Importe_Me, \n"+
            "erp_codcue as  Cuenta, \n"+
            "erp_dh as  Dh, \n"+
            "erp_tipref as  Tipo_Ref, \n"+
            "erp_serref as  Serie_Ref, \n"+
            "erp_numref as  Numero_Ref, \n"+
            "convert(varchar,erp_fecref,103) as  Fecha_Ref, \n"+
            "erp_codune as  Unidad_Negocio, \n"+
            "erp_codcen as  Cencos, \n"+
            "erp_codot as  OT, \n"+
            "erp_subref as  Voucher_Ref, \n"+
            "erp_vendedor as  Vendedor, \n"+
            "erp_forpag as  For_Pago, \n"+
            "erp_comision_porc as  Porc_Comision, \n"+
            "erp_comision_monto as  Comision \n"+
            "from erp_ctacxcp_detalle where  \n"+
            "erp_codemp = @codigo_empresa and \n"+
            "erp_numcxp = @numero_contable \n"
        );
    
        const recordset = lista.recordset;
        res.json(recordset);
    }catch(err){
        res.send(err.message);
    }
});

router.post('/guardar', async (req,res)=>{
    try{
        const codigo_empresa = req.user.codigo_empresa;
        const usuario = req.user.codigo_usuario;
        //
        var filas_detalle = JSON.parse(req.body.filas_detalle)

        var fecha_contabilidad =  new Date(req.body.fecha_emision.replace("-", "/"));
        var dd = fecha_contabilidad.getDate();
        var mm = fecha_contabilidad.getMonth()+1; 
        var yyyy = fecha_contabilidad.getFullYear();

        fecha_contabilidad = yyyy+'/'+(mm<10? '0'+mm : mm)+'/'+ (dd<10? '0'+dd : dd);

        var valores={
            SubTotal_Gravado: req.body.erp_Dsubtotal,
            SubTotal_No_Gravado: req.body.erp_Dsubtotal_No_Grabada,
            Igv: req.body.erp_Digv,
            Icbper: req.body.erp_ICBPER,
            Total: req.body.erp_Dimporte,
            Detraccion: req.body.monto_detraccion,
            Percepcion: req.body.monto_percepcion,
            Retencion: req.body.monto_retencion,
            Comision: 0,
            tc: req.body.tasa_cambio,
            moneda: req.body.moneda,
        }

        var calculos_contable = await helpers.getCalculosContables(valores)

        const pool = await poolPromise;
        const transaction = await new mssql.Transaction(pool);
        await transaction.begin(async err => {
            try{

                //#region Guardar Contabilidad
    
                //#endregion

                //#region Guardar Letras Cuentas por Cobrar

                //#region Generar Correlativo de Letras de cuentas por cobrar
                const request_automatico_provision  = new mssql.Request(transaction);
                const result_automatico_provision = await request_automatico_provision 
                .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
                .input('concepto', mssql.VarChar(250), req.body.concepto)
                .input('tipo', mssql.VarChar(250), req.body.tipo_transferencia)
                .input('letra', mssql.VarChar(250), req.body.tipo_transferencia == 'PAG'? 'P':'C')
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
                    "AND cnum_ctax_cob_pag = @letra+@ceros+convert(varchar (50), @correlativo ) \n"+
                    "print @letra+@ceros+convert(varchar (50), @correlativo ) \n"+
                    "print @contador \n"+
                    "end  \n"+
                    "select @letra+@ceros+CONVERT(VARCHAR(50),@correlativo) as correlativo"
                );
                var recordset_automatico_provision = result_automatico_provision.recordset;
                numero_correlativo_provision = recordset_automatico_provision[0].correlativo;
                //#endregion

                //#region Guardar Letras de Cuentas por cobrar o por pagar
                const request_provision  = new mssql.Request(transaction);
                await request_provision
                .input('ccod_empresa', mssql.VarChar(250), codigo_empresa)
                .input('cob_pag', mssql.VarChar(250), req.body.tipo_transferencia)
                .input('cnum_ctax_cob_pag', mssql.VarChar(250), numero_correlativo_provision)
                .input('ejercon', mssql.VarChar(250), req.body.ejercicio)
                .input('periodo_con', mssql.VarChar(250), req.body.periodo)
                .input('ccod_svoucher', mssql.VarChar(250), req.body.codigo_subvoucher)
                .input('cnum_doc_cont', mssql.VarChar(250), '')
                .input('AUTOMATICO', mssql.VarChar(250), req.body.automatico)
                .input('dfecha_doc', mssql.Date, req.body.fecha_registro)
                .input('fecha_ref', mssql.Date, req.body.fecha_referencia)
                .input('ctip_docref', mssql.VarChar(250), req.body.tipo_documento_referencia)
                .input('cnum_serie_docref', mssql.VarChar(250), req.body.serie_documento_referencia)
                .input('cnum_doc_docref', mssql.VarChar(250), req.body.numero_documento_referencia)
                .input('dfecha_emision', mssql.Date, req.body.fecha_emision)
                .input('ctip_doc', mssql.VarChar(250), req.body.tipo_documento)
                .input('cserie_doc', mssql.VarChar(250), req.body.serie)
                .input('cnum_doc', mssql.VarChar(250), req.body.numero)
                .input('cmoneda', mssql.VarChar(250), req.body.moneda)
                .input('tipo_tc', mssql.VarChar(250), req.body.tipo_cambio)
                .input('tipo_cambio', mssql.VarChar(250), req.body.tasa_cambio)
                .input('tc_ref', mssql.VarChar(250), "0")
                .input('tipo_anexo', mssql.VarChar(250), req.body.tipo_codigo_auxiliar)
                .input('ccod_anexo', mssql.VarChar(250), req.body.codigo_anexo)
                .input('cnom_anexo', mssql.VarChar(250), req.body.nombre_anexo)
                .input('cnom_forpago', mssql.VarChar(250), req.body.forma_pago)
                .input('nro_dias', mssql.VarChar(250), req.body.dias)
                .input('fecha_venc', mssql.VarChar(250), req.body.fecha_vencimiento)
                .input('glosa', mssql.VarChar(250), req.body.Glosa)
                .input('letra_aceptada', mssql.VarChar(250), "N")
                .input('ccod_situac_letra', mssql.VarChar(250), "00")
                .input('ccod_banco', mssql.VarChar(250), "00")
                .input('nro_unico', mssql.VarChar(250), "")
                .input('nsub_total', mssql.VarChar(250), req.body.erp_Dsubtotal)
                .input('nsub_total_ng', mssql.VarChar(250), req.body.erp_Dsubtotal_No_Grabada)
                .input('porcent_nigv', mssql.VarChar(250), req.body.porcentaje_impuesto)
                .input('nigv', mssql.VarChar(250), req.body.erp_Digv)
                .input('nimporte', mssql.VarChar(250), req.body.erp_Dimporte)
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
                .input('fecha_canje_letra', mssql.Date, req.body.fecha_canje)
                .input('si_regcompra', mssql.VarChar(250), req.body.registro_compra)
                .input('dest_operacion', mssql.VarChar(250), req.body.destino_operacion)
                .input('a_dua', mssql.VarChar(250), "")
                .input('modulo', mssql.VarChar(250), req.body.modulo_origen)
                .input('estado', mssql.VarChar(250), req.body.estado)
                .input('contabilizada', mssql.VarChar(250), req.body.contabilizada)
                .input('cnum_doc_ordc', mssql.VarChar(250), '')
                .input('ccod_detraccion', mssql.VarChar(250), '00')
                .input('detraccion', mssql.VarChar(250), req.body.detraccion_sn)
                .input('porc_Detrac', mssql.VarChar(250), req.body.porcentaje_detraccion)
                .input('mon_Detrac', mssql.VarChar(250), req.body.monto_detraccion)
                .input('percep_flag', mssql.VarChar(250), req.body.percepcion_sn)
                .input('Porc_Percep', mssql.VarChar(250), req.body.porcentaje_percepcion)
                .input('mon_Percep', mssql.VarChar(250), req.body.monto_percepcion)
                .input('usuario', mssql.VarChar(250), usuario)
                .input('lt_canjeada', mssql.VarChar(250), 'N')
                .input('fecha_aceptacion', mssql.Date, '1900/01/01')
                .input('tipo_letra', mssql.VarChar(250), req.body.tipo_letra)
                .input('erp_codaval', mssql.VarChar(250), req.body.codigo_aval)
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
                .input('clasif_bien_servicio', mssql.VarChar(250), req.body.clasificacion_bien_servicio)
                .input('ccod_retencion_no_domic', mssql.VarChar(250), req.body.retension_no_domiciliado)
                .input('retencion_no_domic', mssql.VarChar(250), req.body.retencion_no_domiciliado_sn)
                .input('porc_reten_no_domic', mssql.VarChar(250), req.body.porcentaje_retencion_no_domiciliado)
                .input('mon_reten', mssql.VarChar(250), req.body.monto_retencion)
                .input('retencion_no_domic_mn', mssql.VarChar(250), 0)
                .input('retencion_no_domic_me', mssql.VarChar(250), 0)
                .input('dt_aplica_no_domic', mssql.VarChar(250), 0)
                .input('icbper', mssql.VarChar(250), req.body.erp_ICBPER)
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
                "GETDATE(), \n"+
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


                // #region  grabar detalle
                var nitem = 0;
                for(var j=0;j<filas_detalle.length;j++){

                    nitem++;
                    var request_contabilidad_detalle  = new mssql.Request(transaction);
                    await request_contabilidad_detalle
                    .input('erp_codemp', mssql.VarChar(250), codigo_empresa)
                    .input('erp_cobpag', mssql.VarChar(250), req.body.tipo_transferencia)
                    .input('erp_numcxp', mssql.VarChar(250), numero_correlativo_provision)
                    .input('erp_itemov', mssql.VarChar(250), nitem)
                    .input('erp_codtia', mssql.VarChar(250), filas_detalle[j].Tipo_Anexo)
                    .input('erp_codane', mssql.VarChar(250), filas_detalle[j].Codigo_Anexo)
                    .input('erp_nomane', mssql.VarChar(250), filas_detalle[j].Nombre_Anexo)
                    .input('erp_tipdoc', mssql.VarChar(250), filas_detalle[j].Tipo_Doc)
                    .input('erp_serdoc', mssql.VarChar(250), filas_detalle[j].Serie_Doc)
                    .input('erp_numdoc', mssql.VarChar(250), filas_detalle[j].Numero_Doc)
                    .input('erp_fecemi', mssql.Date, filas_detalle[j].Fecha_Emision)
                    .input('erp_fecven', mssql.Date, filas_detalle[j].Fecha_Vencimiento)
                    .input('erp_codmon', mssql.VarChar(250), filas_detalle[j].Moneda)
                    .input('erp_tipcam', mssql.VarChar(250), filas_detalle[j].Tc)
                    .input('erp_impmn', mssql.VarChar(250), filas_detalle[j].Importe_Mn)
                    .input('erp_impme', mssql.VarChar(250), filas_detalle[j].Importe_Me)
                    .input('erp_codcue', mssql.VarChar(250), filas_detalle[j].Cuenta)
                    .input('erp_dh', mssql.VarChar(250), filas_detalle[j].Dh)
                    .input('erp_tipref', mssql.VarChar(250), filas_detalle[j].Tipo_Ref)
                    .input('erp_serref', mssql.VarChar(250), filas_detalle[j].Serie_Ref)
                    .input('erp_numref', mssql.VarChar(250), filas_detalle[j].Numero_Ref)
                    .input('erp_fecref', mssql.Date, filas_detalle[j].Fecha_Ref)
                    .input('erp_codune', mssql.VarChar(250), '00')
                    .input('erp_codcen', mssql.VarChar(250), '00')
                    .input('erp_codot', mssql.VarChar(250), '00')
                    .input('erp_subref', mssql.VarChar(250), filas_detalle[j].Voucher_Ref)
                    .input('erp_tipope', mssql.VarChar(250), filas_detalle[j].Tipo_Origen)
                    .input('erp_letace', mssql.VarChar(250), 'N')
                    .input('erp_fecace', mssql.VarChar(250), '1900/01/01')
                    .input('erp_letcon', mssql.VarChar(250), 'N')
                    .input('erp_vendedor', mssql.VarChar(250), filas_detalle[j].Vendedor)
                    .input('erp_forpag', mssql.VarChar(250), filas_detalle[j].For_Pago)
                    .input('erp_comision_porc', mssql.VarChar(250), filas_detalle[j].Porc_Comision== ''? 0:filas_detalle[j].Porc_Comision)
                    .input('erp_comision_monto', mssql.VarChar(250), filas_detalle[j].Comision== ''? 0:filas_detalle[j].Comision)
                    .query(
                     " INSERT INTO erp_ctacxcp_detalle( \n"+
                     " erp_codemp, \n"+
                     " erp_cobpag, \n"+
                     " erp_numcxp, \n"+
                     " erp_itemov, \n"+
                     " erp_codtia, \n"+
                     " erp_codane, \n"+
                     " erp_nomane, \n"+
                     " erp_tipdoc, \n"+
                     " erp_serdoc, \n"+
                     " erp_numdoc, \n"+
                     " erp_fecemi, \n"+
                     " erp_fecven, \n"+
                     " erp_codmon, \n"+
                     " erp_tipcam, \n"+
                     " erp_impmn, \n"+
                     " erp_impme, \n"+
                     " erp_codcue, \n"+
                     " erp_dh, \n"+
                     " erp_tipref, \n"+
                     " erp_serref, \n"+
                     " erp_numref, \n"+
                     " erp_fecref, \n"+
                     " erp_codune, \n"+
                     " erp_codcen, \n"+
                     " erp_codot, \n"+
                     " erp_subref, \n"+
                     " erp_tipope, \n"+
                     " erp_letace, \n"+
                     " erp_fecace, \n"+
                     " erp_letcon, \n"+
                     " erp_vendedor, \n"+
                     " erp_forpag, \n"+
                     " erp_comision_porc, \n"+
                     " erp_comision_monto \n"+
                     " )VALUES( \n"+
                     " @erp_codemp,  \n"+
                     " @erp_cobpag, \n"+
                     " @erp_numcxp, \n"+
                     " @erp_itemov, \n"+
                     " @erp_codtia, \n"+
                     " @erp_codane, \n"+
                     " @erp_nomane, \n"+
                     " @erp_tipdoc, \n"+
                     " @erp_serdoc, \n"+
                     " @erp_numdoc, \n"+
                     " @erp_fecemi, \n"+
                     " @erp_fecven, \n"+
                     " @erp_codmon, \n"+
                     " @erp_tipcam, \n"+
                     " @erp_impmn,  \n"+
                     " @erp_impme,  \n"+
                     " @erp_codcue, \n"+
                     " @erp_dh, \n"+
                     " @erp_tipref, \n"+
                     " @erp_serref, \n"+
                     " @erp_numref, \n"+
                     " @erp_fecref, \n"+
                     " @erp_codune, \n"+
                     " @erp_codcen, \n"+
                     " @erp_codot,  \n"+
                     " @erp_subref, \n"+
                     " @erp_tipope, \n"+
                     " @erp_letace, \n"+
                     " @erp_fecace,   \n"+
                     " @erp_letcon,   \n"+
                     " @erp_vendedor, \n"+
                     " @erp_forpag,   \n"+
                     " @erp_comision_porc,  \n"+
                     " @erp_comision_monto) \n"
                    );
                    
                    if (filas_detalle[j].Tipo_Doc == 'LT') {
                        const request_correlativo = new mssql.Request(transaction);
                        await request_correlativo
                        .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                        .input("tip_doc", mssql.VarChar(250), filas_detalle[j].Tipo_Doc)
                        .input("cnum_serie", mssql.VarChar(250), filas_detalle[j].Serie_Doc)
                        .input("ultimo_grab", mssql.VarChar(250), parseInt(filas_detalle[j].Numero_Doc))
                        .query("update Htalonar set ultimo_grab = @ultimo_grab  where tip_doc = @tip_doc and ccod_empresa = @ccod_empresa and cnum_serie = @cnum_serie "); 
                    } 
                };
                // #endregion

                transaction.commit(tErr => {if(tErr) {console.log(tErr)}})
                res.send({estado: true, codigo: 'Letra', mensaje: ""});
            }catch(err){
                transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
                console.log(err.message);
                res.send({estado: false, codigo: "Err", mensaje: err.message});
            }
        });

    }catch(err){
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }

});

router.post('/modificar', async(req, res) => {
    try {
        const pool = await poolPromise;
        const transaction = await new mssql.Transaction(pool);
        await transaction.begin(async err => {
            try{

                
                transaction.commit(tErr => {if(tErr) {console.log(tErr)}})
                res.send({estado: true, codigo: 'Letra', mensaje: ""});
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
                var opcion = "and MONTH(Hctacxcp.dfecha_doc) = @mes AND YEAR(Hctacxcp.dfecha_doc) = @anio \n"
                break;
            case "rango_fechas":
                var opcion = "and Hctacxcp.dfecha_doc between @fecha_inicio and @fecha_final \n"
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
        .input('modulo_contable', mssql.VarChar(250), req.body.modulo_contable)
        .input('fecha_inicio', mssql.VarChar(250), req.body.fecha_inicio)
        .input('fecha_final', mssql.VarChar(250), req.body.fecha_final)
        .query(
           " Select \n"+
           " tipo_letra as Tipo_Letra, \n"+
           " ejercon as Ejercicio, \n"+
           " periodo_con as Periodo_Contable, \n"+
           " ccod_svoucher as Codigo_Svoucher, \n"+
           " cnum_doc_cont as Numero_Contable, \n"+
           " CONVERT(VARCHAR,dfecha_doc,103) as Fecha_Registro, \n"+
           " CONVERT(VARCHAR,dfecha_emision,103) as Fecha_Emision, \n"+
           " ctip_docref as Tipo_Documento_Referencia, \n"+
           " cnum_serie_docref as Serie_Documento_Referencia, \n"+
           " cnum_doc_docref as Numero_Documento_Referencia, \n"+
           " ctip_doc as Tipo_Documento,           \n"+
           " cserie_doc as Serie, \n"+
           " LTRIM(RTRIM(cnum_doc)) as Numero, \n"+
           " tipo_anexo as Tipo_Anexo, \n"+
           " ccod_anexo as Codigo_Anexo, \n"+
           " cnom_anexo as Nombre_Anexo, \n"+
           " cnom_forpago as Codigo_Forma_Pago, \n"+
           " nro_dias as Dias, \n"+
           " CONVERT(VARCHAR,fecha_venc,103) as Fecha_Vencimiento, \n"+
           " cmoneda as Moneda, \n"+
           " tipo_cambio as Tipo_Cambio,   \n"+
           " nimporte as Importe, \n"+
           " importe_mn as Importe_MN, \n"+
           " importe_me as Importe_ME, \n"+
           " estado as Estado, \n"+
           " cob_pag as Cob_Pag, \n"+
           " cnum_ctax_cob_pag as Numero_Cta,      \n"+
           " glosa as Glosa, \n"+
           " CONVERT(VARCHAR,fecha_ref,103) as Fecha_Referencia_Documento, \n"+
           " modulo as Modulo_Contable, \n"+
           " contabilizada as Contabilizada, \n"+
           " erp_usuario as Usuario, \n"+
           " nombre_pc as Nombre_Pc, \n"+
           " CONVERT(VARCHAR,Fecha_Pc,103) as Fecha_Pc,  \n"+
           " convert(varchar,Fecha_Pc,108 ) as Hora,  \n"+
           " Ip_pc as Ip_Pc \n"+
           " From Hctacxcp           \n"+
           " Where ccod_empresa  = @codigo_empresa \n"+opcion+
           " And modulo = @modulo_contable And            \n"+
           " (Isnull(modulo,'') <> 'RT')           \n"+
           " Order By dfecha_doc desc, cnum_doc desc  \n"
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

        const pool = await poolPromise
        var lista = await pool
        .request()
        .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
        .input("cob_pag", mssql.VarChar(250), req.body.cob_pag)
        .input("ejercicio", mssql.VarChar(250), req.body.ejercicio)
        .input("periodo", mssql.VarChar(250), req.body.periodo)
        .input("numero_documento_contable", mssql.VarChar(250), req.body.numero_documento_contable)
        .query(
         " Select    \n"+
         " tipo_letra as Documento_Tipo_Letra,  \n"+
         " ejercon as Documento_Ejercicio,   \n"+
         " periodo_con as Documento_Periodo_Contable,   \n"+
         " ccod_svoucher as Documento_Codigo_Svoucher,   \n"+
         " cnum_doc_cont as Documento_Numero_Contable,   \n"+
         " CONVERT(VARCHAR,dfecha_doc,23) as Documento_Fecha_Registro,   \n"+
         " CONVERT(VARCHAR,dfecha_emision,23) as Documento_Fecha_Emision,   \n"+
         " ctip_docref as Documento_Tipo_Documento_Referencia,   \n"+
         " cnum_serie_docref as Documento_Serie_Documento_Referencia,   \n"+
         " cnum_doc_docref as Documento_Numero_Documento_Referencia,   \n"+
         " ctip_doc as Documento_Tipo_Documento,   \n"+
         " cserie_doc as Documento_Serie,   \n"+
         " cnum_doc as Documento_Numero,   \n"+
         " tipo_anexo as Documento_Tipo_Anexo,   \n"+
         " Hctacxcp.ccod_anexo as Documento_Codigo_Anexo,   \n"+
         " Hctacxcp.cnom_anexo as Documento_Nombre_Anexo,   \n"+
         " Hctacxcp.erp_codaval as Documento_Codigo_Aval,  \n"+
         " cnom_forpago as Documento_Codigo_Forma_Pago,   \n"+
         " nro_dias as Documento_Dias,   \n"+
         " CONVERT(VARCHAR,fecha_venc,23) as Documento_Fecha_Vencimiento,   \n"+
         " tipo_tc as Documento_Tipo_Cambio,   \n"+
         " cmoneda as Documento_Moneda,   \n"+
         " tipo_cambio as Documento_Tasa_Cambio,       \n"+
         " nimporte as Documento_Importe,   \n"+
         " importe_mn as Documento_Importe_MN,   \n"+
         " importe_me as Documento_Importe_ME,             \n"+
         " Hctacxcp.estado as Documento_Estado,   \n"+
         " cob_pag as Documento_Cob_Pag,   \n"+
         " cnum_ctax_cob_pag as Documento_Numero_Cta,        \n"+
         " glosa as Documento_Glosa,   \n"+
         " CONVERT(VARCHAR,fecha_canje_letra,23) as Documento_Fecha_Canje_Letra,    \n"+
         " dest_operacion as Documento_Destino_Oprecacion,   \n"+
         " modulo as Documento_Modulo_Contable,   \n"+
         " contabilizada as Documento_Contabilizada,   \n"+
         " erp_usuario as usuario_codigo,   \n"+
         " nombre_pc as Documento_Nombre_Pc,   \n"+
         " Fecha_Pc as Documento_Fecha_Pc,    \n"+
         " Ip_pc as Documento_Ip_Pc,  \n"+
         " --detalle letras  \n"+
         " erp_cobpag as  Detalle_Cob_Pag,   \n"+
         " erp_itemov as  Detalle_Item,   \n"+
         " erp_codtia as  Detalle_Tipo_Anexo,   \n"+
         " erp_codane as  Detalle_Codigo_Anexo,   \n"+
         " erp_nomane as  Detalle_Nombre_Anexo,   \n"+
         " erp_tipdoc as  Detalle_Tipo_Doc,   \n"+
         " erp_serdoc as  Detalle_Serie_Doc,   \n"+
         " erp_numdoc as  Detalle_Numero_Doc,   \n"+
         " erp_fecemi as  Detalle_Fecha_Emision,   \n"+
         " erp_fecven as  Detalle_Fecha_Vencimiento,   \n"+
         " erp_codmon as  Detalle_Moneda,   \n"+
         " erp_tipcam as  Detalle_Tc,   \n"+
         " (Case erp_codmon when 'S/' then erp_ctacxcp_detalle.erp_impmn else erp_ctacxcp_detalle.erp_impme End) as Detalle_Importe,  \n"+
         " erp_impmn  as  Detalle_Importe_Mn,   \n"+
         " erp_impme  as  Detalle_Importe_Me,   \n"+
         " erp_codcue as  Detalle_Cuenta,   \n"+
         " erp_dh as  Detalle_Dh,   \n"+
         " erp_tipref as  Detalle_Tipo_Ref,   \n"+
         " erp_serref as  Detalle_Serie_Ref,   \n"+
         " erp_numref as  Detalle_Numero_Ref,   \n"+
         " erp_fecref as  Detalle_Fecha_Ref,   \n"+
         " erp_codune as  Detalle_Unidad_Negocio,   \n"+
         " erp_codcen as  Detalle_Cencos,   \n"+
         " erp_codot as  Detalle_OT,   \n"+
         " erp_subref as  Detalle_Voucher_Ref,   \n"+
         " erp_vendedor as  Detalle_Vendedor,   \n"+
         " erp_forpag as  Detalle_For_Pago,   \n"+
         " erp_comision_porc as  Detalle_Porc_Comision,   \n"+
         " erp_comision_monto as  Detalle_Comision,   \n"+
         " dbo.udf_numero_letra(Case erp_codmon when 'S/' then erp_ctacxcp_detalle.erp_impmn else erp_ctacxcp_detalle.erp_impme End) as Detalle_Monto_Letra,  \n"+
         " isnull(Hdepto.cnom_departamento,'') as Detalle_Departamento, \n"+
         " IsNull(Hciudad.cnom_ciudad,'') as Detalle_Ciudad,  \n"+
         " IsNull(cnom_distrito,'')  as Detalle_Distrito,  \n"+
         " Hanexos.cdireccion as Detalle_Direccion_Anexo, \n"+
         " ltrim(rtrim(Hanexos.cnum_ruc)) as Detalle_Ruc_Anexo, \n"+
         " Hanexos.ctelefonos as Detalle_Telefono_Anexo, \n"+
         " --Empresa \n"+
         " Hempresa.ccod_empresa as empresa_codigo,  \n"+
         " Hempresa.crazonsocial as empresa_razon_social,  \n"+
         " Hempresa.rutadelogo as empresa_ruta_logo,  \n"+
         " Hempresa.fax_3 as empresa_logo,  \n"+
         " hempresa.nro_cuenta_mn as empresa_cuenta1, \n"+
         " hempresa.nro_cuenta_me as empresa_cuenta2, \n"+
         " hempresa.ctelefono as empresa_telefono, \n"+
         " hempresa.cpag_web as empresa_web, \n"+
         " hempresa.cnum_ruc as empresa_ruc, \n"+
         " hempresa.cdireccion as empresa_direccion, \n"+
         " hempresa.cemail as empresa_correo, \n"+
         " (Erp_aval.erp_nomaval) as Detalle_Nombre_Aval, \n"+
         " (Erp_aval.erp_dirava) as Detalle_Direccion_Aval, \n"+
         " (Erp_aval.erp_codaval) as Detalle_Codigo_Aval, \n"+
         " (Erp_aval.erp_telaval) as Detalle_Telefono_Aval, \n"+
         " (Erp_aval.erp_nomubi) as Detalle_Ubicacion_Aval, \n"+
         " --articulo  \n"+
         " 0 as  articulo_cantidad,   \n"+
         " 0 as  articulo_igv,   \n"+
         " 0 as  articulo_importe,   \n"+
         " 0 as  articulo_precio   \n"+
         " From Hctacxcp  inner join erp_ctacxcp_detalle  \n"+
         " on Hctacxcp.ccod_empresa = erp_ctacxcp_detalle.erp_codemp  \n"+
         " and Hctacxcp.cnum_ctax_cob_pag = erp_ctacxcp_detalle.erp_numcxp  \n"+
         " INNER JOIN Hempresa on  \n"+
         " Hctacxcp.ccod_empresa = Hempresa.ccod_empresa \n"+
         " Inner Join Hanexos \n"+
         " On Hanexos.ccod_empresa  = erp_ctacxcp_detalle.erp_codemp and \n"+
         " Hanexos.ctip_auxiliar = erp_ctacxcp_detalle.erp_codtia and \n"+
         " Hanexos.ccod_anexo	  = erp_ctacxcp_detalle.erp_codane  \n"+
         " inner join hcliente on \n"+
         " hcliente.ccod_empresa = Hanexos.ccod_empresa and \n"+
         " hcliente.ccod_cliente = Hanexos.ccod_anexo \n"+
         " inner join Hdepto on \n"+
         " Hdepto.ccod_empresa = hcliente.ccod_empresa and \n"+
         " Hdepto.ccod_pais = hcliente.ccod_pais and  \n"+
         " Hdepto.ccod_departamento = hcliente.ccod_departamento \n"+
         " inner join Hciudad on \n"+
         " Hciudad.ccod_empresa = hcliente.ccod_empresa and \n"+
         " Hciudad.ccod_pais = hcliente.ccod_pais and  \n"+
         " Hciudad.ccod_departamento = hcliente.ccod_departamento and \n"+
         " Hciudad.ccod_ciudad = hcliente.cciudad \n"+
         " inner join Hdistrit on \n"+
         " Hdistrit.ccod_empresa = hcliente.ccod_empresa and \n"+
         " Hdistrit.ccod_pais = hcliente.ccod_pais and  \n"+
         " Hdistrit.ccod_departamento = hcliente.ccod_departamento and \n"+
         " Hdistrit.ccod_ciudad = hcliente.cciudad and \n"+
         " Hdistrit.ccod_distrito = hcliente.cdistrito \n"+
         " inner join Erp_aval on \n"+
	     " Erp_aval.ccod_empresa=hanexos.ccod_empresa and \n"+
	     " Erp_aval.ccod_anexo=hanexos.ccod_anexo  \n"+
         " Where Hctacxcp.ccod_empresa = @ccod_empresa And  \n"+
         " ejercon = @ejercicio And  periodo_con = @periodo and \n"+
         " cnum_ctax_cob_pag = @numero_documento_contable and erp_tipdoc = 'LT'\n"
        );
        const Cabecera = lista.recordset;

        res.json(Cabecera);
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/eliminar', async (req, res) => {
    try {

        const codigo_empresa = req.user.codigo_empresa;
        
        const pool = await poolPromise;
        const transaction = await new mssql.Transaction(pool);
        
        await transaction.begin(async err => {
            try{
                const request_borrar_detalle_contabilidad  = new mssql.Request(transaction);
                await request_borrar_detalle_contabilidad
                .input('ccod_empresa', mssql.VarChar(250), codigo_empresa)
                .input('numero_documento_contable', mssql.VarChar(250), req.body.numero_documento_contable)
                .query("DELETE FROM erp_ctacxcp_detalle WHERE erp_codemp = @ccod_empresa AND \n"+
                "erp_cobpag ='COB' AND erp_numcxp = @numero_documento_contable ")

                const request_borrar_cabecera_contabilidad = new mssql.Request(transaction);
                await request_borrar_cabecera_contabilidad 
                .input('ccod_empresa', mssql.VarChar(250), codigo_empresa)
                .input('numero_documento_contable', mssql.VarChar(250), req.body.numero_documento_contable)
                .query("DELETE FROM hctacxcp WHERE ccod_empresa =@ccod_empresa And cob_pag ='COB' \n"+ 
                "And cnum_ctax_cob_pag = @numero_documento_contable ");

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

router.post('/lista_documentos_pendientes', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa
        const codigo_punto_venta = req.user.codigo_punto_venta;
        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('tipo_anexo', mssql.VarChar(250), req.body.tipo_anexo)
        .input('codigo_anexo', mssql.VarChar(250), req.body.codigo_anexo)
        .input('fecha', mssql.VarChar(250), req.body.fecha)
        .input('tasa_cambio', mssql.VarChar(250), req.body.tasa_cambio)
        .input('modulo' , mssql.VarChar(250), '')
        .query("exec dbo.sq_facturas_pendientes_letras @codigo_empresa, @tipo_anexo, @codigo_anexo, @fecha"); 
          
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/lista_letras_renovacion', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa
        const codigo_punto_venta = req.user.codigo_punto_venta;
        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('tipo_anexo', mssql.VarChar(250), req.body.tipo_anexo)
        .input('codigo_anexo', mssql.VarChar(250), req.body.codigo_anexo)
        .input('fecha', mssql.VarChar(250), req.body.fecha)
        .input('tasa_cambio', mssql.VarChar(250), req.body.tasa_cambio)
        .input('modulo' , mssql.VarChar(250), '')
        .query("exec dbo.sq_listado_letras_renovacion @codigo_empresa, @tipo_anexo, @codigo_anexo, @fecha"); 
          
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/lista_situacion_letras', async (req, res) => {
    try {
        console.log(req.body);
        const codigo_empresa = req.user.codigo_empresa
        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('fecha', mssql.VarChar(250), req.body.fecha)
        .input('situacion' , mssql.VarChar(250), req.body.situacion)
        .query("exec dbo.sq_listado_situacion_letras @codigo_empresa, @fecha, @situacion"); 
          
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/aceptar_leras', async (req, res) => {
    try {
        console.log(req.body);
        const codigo_empresa = req.user.codigo_empresa
        const pool = await poolPromise
        const transaction = await new mssql.Transaction(pool);
        await transaction.begin(async err => {
            try {
                const request_aceptar_letras  = new mssql.Request(transaction);
                await request_aceptar_letras
                .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
                .input('aceptar_letras', mssql.VarChar(250), req.body.aceptar_letras)
                .input('erp_numcxp' , mssql.VarChar(250), req.body.erp_numcxp)
                .query("update erp_ctacxcp_detalle \n"+
                "SET erp_letace =@aceptar_letras , erp_fecace = getdate() \n"+
                "WHERE erp_codemp =@codigo_empresa AND erp_cobpag ='COB' AND erp_numcxp =@erp_numcxp ");
                
                transaction.commit(tErr => {if(tErr) {console.log(tErr)}})
                res.send({estado: true, codigo: 'Letra', mensaje: ""});

            } catch (err) {
                transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
                console.log(err.message);
                res.send({estado: false, codigo: "Err", mensaje: err.message});
            } 
        });

    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
});

router.post('/contabilizar', async (req,res)=>{
    try{
        console.log(req.body);
        const codigo_empresa = req.user.codigo_empresa;
        const usuario = req.user.codigo_usuario;

        var filas_detalle = JSON.parse(req.body.filas_detalle)

        var fecha_contabilidad =  new Date(req.body.fecha_emision.replace("-", "/"));
        var dd = fecha_contabilidad.getDate();
        var mm = fecha_contabilidad.getMonth()+1; 
        var yyyy = fecha_contabilidad.getFullYear();

        fecha_contabilidad = yyyy+'/'+(mm<10? '0'+mm : mm)+'/'+ (dd<10? '0'+dd : dd);

        const pool = await poolPromise;
        const transaction = await new mssql.Transaction(pool);
        await transaction.begin(async err => {
            try{

                //#region Generar Correlativo Contabilidad
                const request_automatico_contabilidad  = new mssql.Request(transaction);
                const result_automatico_contabilidad = await request_automatico_contabilidad
                .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
                .input('ejercicio', mssql.VarChar(250), req.body.ejercicio)
                .input('periodo', mssql.VarChar(250), req.body.periodo)
                .input('subvoucher', mssql.VarChar(250), req.body.codigo_subvoucher)
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

                var recordset_automatico_contabilidad = result_automatico_contabilidad.recordset;
                numero_correlativo_contabilidad = recordset_automatico_contabilidad[0].correlativo;
                //#endregion
                console.log(numero_correlativo_contabilidad)

                //#region Guardar Contabilidad Cabecera
                 const request_contabilidad_cabecera  = new mssql.Request(transaction);
                 await request_contabilidad_cabecera
                 .input('ccod_empresa', mssql.VarChar(250), codigo_empresa)
                 .input('ejercon', mssql.VarChar(250), req.body.ejercicio)
                 .input('periodo_con', mssql.VarChar(250), req.body.periodo)
                 .input('ccod_svoucher', mssql.VarChar(250), req.body.codigo_subvoucher)
                 .input('cnum_doc', mssql.VarChar(250), numero_correlativo_contabilidad)
                 .input('automatico', mssql.VarChar(250), req.body.automatico)
                 .input('dfecha_doc', mssql.Date, req.body.fecha_emision)
                 .input('fecha_referencia', mssql.Date, req.body.fecha2)
                 .input('tipo2', mssql.VarChar(250), req.body.tipo2)
                 .input('serie2', mssql.VarChar(250), req.body.serie2)
                 .input('numero2', mssql.VarChar(250), req.body.numero2)
                 .input('dfecha_docref', mssql.Date, req.body.fecha_referencia)
                 .input('ctip_docref', mssql.VarChar(250), req.body.tipo_ref)
                 .input('cserie_docref', mssql.VarChar(250), req.body.serie_ref)
                 .input('cnum_docref', mssql.VarChar(250), req.body.numero_ref)
                 .input('ctip_auxiliar', mssql.VarChar(250), req.body.tipo_anexo)
                 .input('ccod_anexo', mssql.VarChar(250), req.body.codigo_anexo)
                 .input('cnom_anexo', mssql.VarChar(250), req.body.nombre_anexo)
                 .input('cmoneda', mssql.VarChar(250), req.body.moneda)
                 .input('ctip_cambio', mssql.VarChar(250), req.body.tipo_cambio)
                 .input('tipo_cambio', mssql.VarChar(250), req.body.tasa_cambio)
                 .input('tc_ref', mssql.VarChar(250), '0')
                 .input('tipo_registro', mssql.VarChar(250), req.body.tipo_registro)
                 .input('glosa', mssql.VarChar(250), req.body.glosa)
                 .input('estado', mssql.VarChar(250), 'Ingresado')
                 .input('dest_operacion', mssql.VarChar(250), req.body.destino_operacion)
                 .input('modulo_origen', mssql.VarChar(250), req.body.modulo_origen)
                 .input('a_dua', mssql.VarChar(250), '')
                 .input('mnbaseimpgrav', mssql.VarChar(250),  req.body.base_con)
                 .input('mnbaseimpnograv', mssql.VarChar(250), req.body.base_sin)
                 .input('mnigvgrav', mssql.VarChar(250), req.body.igv)
                 .input('nimporte', mssql.VarChar(250), req.body.importe)
                 .input('otros_tributos', mssql.VarChar(250), '0')
                 .input('ventas_diferidas', mssql.VarChar(250), '0')
                 .input('base_con_mn', mssql.VarChar(250), req.body.base_con_mn)
                 .input('base_sin_mn', mssql.VarChar(250), req.body.base_sin_mn)
                 .input('igv_mn', mssql.VarChar(250), req.body.igv_mn)
                 .input('otros_mn', mssql.VarChar(250), '0')
                 .input('importe_mn', mssql.VarChar(250), req.body.importe_mn)
                 .input('detraccion_mn', mssql.VarChar(250), 0)
                 .input('venta_diferida_mn', mssql.VarChar(250), '0')
                 .input('base_con_me', mssql.VarChar(250), req.body.base_con_me)
                 .input('base_sin_me', mssql.VarChar(250), req.body.base_sin_me)
                 .input('igv_me', mssql.VarChar(250), req.body.igv_me)
                 .input('otros_me', mssql.VarChar(250), '0')
                 .input('importe_me', mssql.VarChar(250), req.body.importe_me)
                 .input('detraccion_me', mssql.VarChar(250), 0)
                 .input('venta_diferida_me', mssql.VarChar(250), '0')
                 .input('dfecha_venc', mssql.Date, req.body.fecha_vencimiento)
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
                 .input('pc_fecha', mssql.VarChar(250), req.body.fecha_emision)
                 .input('pc_ip', mssql.VarChar(250), '')
                 .input('erp_porcentaje_percep', mssql.VarChar(250), 0)
                 .input('erp_porcent_igv', mssql.VarChar(250), 0)
                 .input('erp_nro_dias', mssql.VarChar(250), 0)
                 .input('erp_porcent_detraccion', mssql.VarChar(250), 0)
                 .input('erp_percepcion_sn', mssql.VarChar(250), 'N')
                 .input('erp_porc_percep', mssql.VarChar(250), 0)
                 .input('erp_reten_mn', mssql.VarChar(250), '0')
                 .input('erp_reten_me', mssql.VarChar(250), '0')
                 .input('erp_descuento_mn', mssql.VarChar(250), '0')
                 .input('erp_descuento_me', mssql.VarChar(250), '0')
                 .input('erp_comision_mn', mssql.VarChar(250), '0')
                 .input('erp_comision_me', mssql.VarChar(250), '0')
                 .input('erp_retencion_sn', mssql.VarChar(250), 'N')
                 .input('erp_porc_retencion', mssql.VarChar(250), 0)
                 .input('erp_serie_ne_ref', mssql.VarChar(250), '')
                 .input('erp_numer_ne_ref', mssql.VarChar(250), '')
                 .input('usuario', mssql.VarChar(250), usuario)
                 .input('erp_tipo_aporte', mssql.VarChar(250), '')
                 .input('erp_afp', mssql.VarChar(250), '')
                 .input('erp_nro_cups', mssql.VarChar(250), '')
                 .input('erp_flujo_mixta', mssql.VarChar(250), '')
                 .input('erp_motivo_venta', mssql.VarChar(250), '00')
                 .input('erp_dsubtotal', mssql.VarChar(250), '0')
                 .input('erp_ddescuento', mssql.VarChar(250), '0')
                 .input('erp_digv', mssql.VarChar(250), '0')
                 .input('erp_dimporte', mssql.VarChar(250), '0')
                 .input('erp_dpercepcion', mssql.VarChar(250), '0')
                 .input('erp_dtotal', mssql.VarChar(250), '0')
                 .input('erp_gestor', mssql.VarChar(250), '00')
                 .input('erp_usuario', mssql.VarChar(250), usuario)
                 .input('nombre_pc', mssql.VarChar(250), '')
                 .input('Fecha_Pc', mssql.VarChar(250), req.body.fecha_emision)
                 .input('Ip_pc', mssql.VarChar(250), '')
                 .input('clasif_bien_servicio', mssql.VarChar(250), '')
                 .input('ccod_retencion_no_domic', mssql.VarChar(250),  '00')
                 .input('retencion_no_domic_sn', mssql.VarChar(250), 'N')
                 .input('retencion_no_domic_mn', mssql.VarChar(250), '0')
                 .input('retencion_no_domic_me', mssql.VarChar(250), '0')
                 .input('erp_porcent_retencion_no_domic', mssql.VarChar(250), 0)
                 .input('saldo_actual_caja', mssql.VarChar(250), '0')
                 .input('icbper', mssql.VarChar(250), 0)
                 .input('icbper_mn', mssql.VarChar(250), 0)
                 .input('icbper_me', mssql.VarChar(250),0)
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


                // #region  grabar detalle
                var nitem = 0;
                for(var j=0;j<filas_detalle.length;j++){
                    var Si_Detraccion = filas_detalle[j].Si_Detraccion

                    nitem++;
                    var request_contabilidad_detalle  = new mssql.Request(transaction);
                    await request_contabilidad_detalle
                    .input('ccod_empresa',mssql.VarChar(250), codigo_empresa)
                    .input('ejercon',mssql.VarChar(250), req.body.ejercicio)
                    .input('periodo_con',mssql.VarChar(250), req.body.periodo)
                    .input('ccod_svoucher',mssql.VarChar(250), req.body.codigo_subvoucher)
                    .input('cnum_doc',mssql.VarChar(250), numero_correlativo_contabilidad)
                    .input('nitem',mssql.VarChar(250), nitem)
                    .input('ccuenta',mssql.VarChar(250), filas_detalle[j].cuenta)
                    .input('ctip_auxiliar',mssql.VarChar(250), filas_detalle[j].tipo_anexo)
                    .input('ccod_auxiliar',mssql.VarChar(250), filas_detalle[j].codigo_anexo)
                    .input('cnom_auxiliar',mssql.VarChar(250), filas_detalle[j].nombre_anexo)
                    .input('debe',mssql.VarChar(250), filas_detalle[j].debe)
                    .input('haber',mssql.VarChar(250), filas_detalle[j].haber)
                    .input('mndebe',mssql.VarChar(250), filas_detalle[j].mndebe)
                    .input('mnhaber',mssql.VarChar(250), filas_detalle[j].mnhaber)
                    .input('medebe',mssql.VarChar(250), filas_detalle[j].medebe)
                    .input('mehaber',mssql.VarChar(250), filas_detalle[j].mehaber)
                    .input('mnretencion',mssql.VarChar(250), '0')
                    .input('erp_codune',mssql.VarChar(250), filas_detalle[j].unidad_negocio)
                    .input('ccod_cencos',mssql.VarChar(250), filas_detalle[j].cencos)
                    .input('ot',mssql.VarChar(250), filas_detalle[j].ot)
                    .input('d_h',mssql.VarChar(250), filas_detalle[j].dh)
                    .input('ccod_almacen_docref',mssql.VarChar(250), '')
                    .input('ctip_docref',mssql.VarChar(250), filas_detalle[j].tipo_doc)
                    .input('cnum_serieref',mssql.VarChar(250),filas_detalle[j].serie_doc)
                    .input('cnum_docref',mssql.VarChar(250),filas_detalle[j].numero_doc)
                    .input('dfechadocref',mssql.VarChar(250),filas_detalle[j].fecha_ref)
                    .input('tipodoc_2',mssql.VarChar(250), filas_detalle[j].tipo_ref)
                    .input('seriedoc_2',mssql.VarChar(250), filas_detalle[j].serie_ref)
                    .input('numdoc_2',mssql.VarChar(250), filas_detalle[j].numero_ref)
                    .input('fechadoc_2',mssql.VarChar(250), filas_detalle[j].fecha_ref)
                    .input('monto_ref',mssql.VarChar(250), '0')
                    .input('CMONEDA_DOCREF',mssql.VarChar(250), filas_detalle[j].moneda)
                    .input('TIPO_CAMBIO_DOCREF',mssql.VarChar(250), filas_detalle[j].tipo_cambio)
                    .input('subvoucher_ref',mssql.VarChar(250), filas_detalle[j].voucher_ref)
                    .input('fecha_vencimiento',mssql.VarChar(250), filas_detalle[j].fecha_vencimiento)
                    .input('glosa',mssql.VarChar(250),  req.body.glosa)
                    .input('movimiento_guia',mssql.VarChar(250), '0')
                    .input('tipmov_guia',mssql.VarChar(250), '')
                    .input('serie',mssql.VarChar(250), '')
                    .input('numero',mssql.VarChar(250), '')
                    .input('iten_guia',mssql.VarChar(250), '0')
                    .input('cta_diferencia',mssql.VarChar(250), 'N')
                    .input('cuenta_trans',mssql.VarChar(250), 'N')
                    .input('item_transferencia',mssql.VarChar(250), '')
                    .input('tipo_origen',mssql.VarChar(250), filas_detalle[j].tipo_origen)
                    .input('pago_mn',mssql.VarChar(250), '0')
                    .input('pago_me',mssql.VarChar(250), '0')
                    .input('pago_rt',mssql.VarChar(250), '0')
                    .input('cta_detracion',mssql.VarChar(250),  'N')
                    .input('cta_retencion',mssql.VarChar(250),  'N')
                    .input('cta_percepcion',mssql.VarChar(250), 'N')
                    .input('CCOD_BANCO',mssql.VarChar(250), '00')
                    .input('CCOD_SIT_LETRA',mssql.VarChar(250), filas_detalle[j].codigo_situacion)
                    .input('NRO_UNICO',mssql.VarChar(250), '')
                    .input('erp_codven',mssql.VarChar(250), filas_detalle[j].vendedor)
                    .input('erp_forpag',mssql.VarChar(250), filas_detalle[j].for_pago)
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
                    .input('erp_codven2',mssql.VarChar(250), req.body.vendedor)
                    .input('erp_cta_costo_sn',mssql.VarChar(250), 'N')
                    .input('clasif_bien_servicio',mssql.VarChar(250), '')
                    .input('cta_retencion_no_domic',mssql.VarChar(250), '')
                    .input('rt_aplica_no_domic',mssql.VarChar(250), '')
                    .input('retencion_s_n',mssql.VarChar(250), '')
                    .input('retencion_porcent',mssql.VarChar(250), '0')
                    .input('retencion_doc_serie',mssql.VarChar(250), '')
                    .input('retencion_doc_numero',mssql.VarChar(250), '')
                    .input('ccod_articulo',mssql.VarChar(250), '')
                    .input('nitem_ref',mssql.VarChar(250), '')
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
                };
                // #endregion

                const request_actualizar_correlativo  = new mssql.Request(transaction);
                const result_actualizar_correlativo = await request_actualizar_correlativo
                .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
                .input('ejercicio', mssql.VarChar(250), req.body.ejercicio)
                .input('periodo', mssql.VarChar(250), req.body.periodo)
                .input('subvoucher', mssql.VarChar(250), req.body.codigo_subvoucher)
                .input('numero', mssql.VarChar(250), numero_correlativo_contabilidad * 1)
                .query( 
                    " UPDATE Hpernume SET NUM_ULTCOMP = @numero \n"+
                    " where  CCOD_EMPRESA= @codigo_empresa  and EJERCON= @ejercicio and PERIODO_CON= @periodo  and CCOD_SVOUCHER= @subvoucher "
                );

                const request_actualizar_provision  = new mssql.Request(transaction);
                const result_actualizar_provision = await request_actualizar_provision
                .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
                .input('ejercicio', mssql.VarChar(250), req.body.ejercicio)
                .input('periodo', mssql.VarChar(250), req.body.periodo)
                .input('subvoucher', mssql.VarChar(250), req.body.codigo_subvoucher)
                .input('numero', mssql.VarChar(250), numero_correlativo_contabilidad)
                .input('cnum_ctax_cob_pag', mssql.VarChar(250), req.body.correlativo_provision)
                .query( 
                  " update hctacxcp set cnum_doc_cont = @numero, contabilizada = 'S'  \n"+
                  " where ccod_empresa = @codigo_empresa and ejercon = @ejercicio and periodo_con = @periodo  \n"+
                  " and ccod_svoucher = @subvoucher and cnum_ctax_cob_pag = @cnum_ctax_cob_pag \n"
                );
                             
                transaction.commit(tErr => {if(tErr) {console.log(tErr)}})
                res.send({estado: true, codigo: 'Letra', mensaje: ""});
            }catch(err){
                transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
                console.log(err.message);
                res.send({estado: false, codigo: "Err", mensaje: err.message});
            }
        });

    }catch(err){
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }

});

router.post('/elminar_contabilizar', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        var detalle_delete=true;
        
        const pool = await poolPromise;
        const transaction = await new mssql.Transaction(pool);
        
        await transaction.begin(async err => {
            try{
                const request_borrar_detalle_contabilidad  = new mssql.Request(transaction);
                await request_borrar_detalle_contabilidad
                .input('ccod_empresa', mssql.VarChar(250), codigo_empresa)
                .input('ejercon', mssql.VarChar(250), req.body.ejercicio)
                .input('periodo_con', mssql.VarChar(250), req.body.periodo)
                .input('ccod_svoucher', mssql.VarChar(250), req.body.codigo_subvoucher)
                .input('cnum_doc', mssql.VarChar(250), req.body.numero_correlativo)
                .query("delete from hmovcond where ccod_empresa = @ccod_empresa and ejercon = @ejercon and \n"+
                "periodo_con = @periodo_con and ccod_svoucher = @ccod_svoucher and cnum_doc = @cnum_doc ")


                const request_borrar_cabecera_contabilidad = new mssql.Request(transaction);
                await request_borrar_cabecera_contabilidad 
                .input('ccod_empresa', mssql.VarChar(250), codigo_empresa)
                .input('ejercon', mssql.VarChar(250), req.body.ejercicio)
                .input('periodo_con', mssql.VarChar(250), req.body.periodo)
                .input('ccod_svoucher', mssql.VarChar(250), req.body.codigo_subvoucher)
                .input('cnum_doc', mssql.VarChar(250), req.body.numero_correlativo)
                .query("Delete hmovconc where ccod_empresa = @ccod_empresa and ejercon = @ejercon and \n"+
                    "periodo_con = @periodo_con and ccod_svoucher = @ccod_svoucher and cnum_doc = @cnum_doc \n")

                const request_actualizar_provision  = new mssql.Request(transaction);
                const result_actualizar_provision = await request_actualizar_provision
                .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
                .input('ejercicio', mssql.VarChar(250), req.body.ejercicio)
                .input('periodo', mssql.VarChar(250), req.body.periodo)
                .input('subvoucher', mssql.VarChar(250), req.body.codigo_subvoucher)
                .input('cnum_ctax_cob_pag', mssql.VarChar(250), req.body.correlativo_provision)
                .query( 
                    " update hctacxcp set cnum_doc_cont = '', contabilizada = 'N'  \n"+
                    " where ccod_empresa = @codigo_empresa and ejercon = @ejercicio and periodo_con = @periodo  \n"+
                    " and ccod_svoucher = @subvoucher and cnum_ctax_cob_pag = @cnum_ctax_cob_pag \n"
                );

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

router.post('/consultar_detalle_letras', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa

        const pool = await poolPromise
        var lista = await pool
        .request()
        .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
        .input("erp_numcxp", mssql.VarChar(250), req.body.erp_numcxp)
        .query(
         "SELECT  \n"+
         "erp_ctacxcp_detalle.erp_codtia as tipo_anexo,    \n"+
         "erp_ctacxcp_detalle.erp_codane as codigo_anexo,    \n"+
         "erp_ctacxcp_detalle.erp_nomane as nombre_anexo,    \n"+
         "erp_ctacxcp_detalle.erp_tipdoc as tipo_doc,    \n"+
         "erp_ctacxcp_detalle.erp_serdoc as serie_doc,    \n"+
         "erp_ctacxcp_detalle.erp_numdoc as numero_doc,    \n"+
         "erp_ctacxcp_detalle.erp_fecemi as fecha_emision, \n"+
         "erp_ctacxcp_detalle.erp_codmon as moneda,    \n"+
         "erp_ctacxcp_detalle.erp_tipcam as tipo_cambio,    \n"+
         "erp_ctacxcp_detalle.erp_impmn as importe_mn,    \n"+
         "erp_ctacxcp_detalle.erp_impme as importe_me,    \n"+
         "erp_ctacxcp_detalle.erp_codcue as cuenta,    \n"+
         "erp_ctacxcp_detalle.erp_dh as dh,    \n"+
         "erp_ctacxcp_detalle.erp_codune as unidad_negocio,    \n"+
         "erp_ctacxcp_detalle.erp_codcen as cencos, \n"+
         "erp_ctacxcp_detalle.erp_codot as ot, \n"+
         "erp_ctacxcp_detalle.erp_fecven as fecha_vencimiento, \n"+
         "erp_ctacxcp_detalle.erp_subref	 as voucher_ref, \n"+
         "erp_ctacxcp_detalle.erp_tipope as tipo_origen, \n"+
         "erp_ctacxcp_detalle.erp_tipref	as tipo_ref, \n"+
         "erp_ctacxcp_detalle.erp_serref	as serie_ref, \n"+
         "erp_ctacxcp_detalle.erp_numref as numero_ref, \n"+
         "erp_ctacxcp_detalle.erp_fecref as fecha_ref, \n"+
         "(erp_ctacxcp_detalle.erp_vendedor) as vendedor, \n"+
         "(erp_ctacxcp_detalle.erp_forpag) as for_pago, \n"+
         "(hctacxcp.tipo_tc) as tipo_tc, \n"+
         "(erp_ctacxcp_detalle.erp_comision_porc) as comporc, \n"+
         "(erp_ctacxcp_detalle.erp_comision_monto) as monporc \n"+
         "FROM erp_ctacxcp_detalle \n"+
         "inner join hctacxcp ON \n"+
         "hctacxcp.cnum_ctax_cob_pag = erp_ctacxcp_detalle.erp_numcxp \n"+
         "and hctacxcp.ccod_empresa = erp_ctacxcp_detalle.erp_codemp \n"+
         "WHERE erp_codemp = @ccod_empresa and erp_cobpag = 'COB' And erp_numcxp = @erp_numcxp \n"
        );
        const Cabecera = lista.recordset;

        res.json(Cabecera);
    } catch (err) {
        res.send(err.message);
    }
});

module.exports = router;
// module.exports = router;