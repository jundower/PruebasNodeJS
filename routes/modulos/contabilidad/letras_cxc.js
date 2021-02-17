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

router.get('/letras_cxc',isLoggedin,async (req, res) => {
    //const {cob_pag} = req.params;
    //var subvoucher = cob_pag == "cuentas_por_cobrar" ? '06' : '05';
    //res.render("modulos/contabilidad/letras_cxc",{cob_pag: cob_pag, subvoucher: subvoucher});
    res.render("modulos/contabilidad/letras_cxc");
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

router.post('/lista', async (req, res) => {
    try {

        const codigo_empresa = req.user.codigo_empresa
        const pool = await poolPromise
        console.log(req.body);
  
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('anio', mssql.VarChar(250), req.body.anio)
        .input('mes', mssql.VarChar(250), req.body.meses)
        .input('modulo_contable', mssql.VarChar(250), req.body.modulo_contable)
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
           " Where ccod_empresa  = @codigo_empresa And  \n"+
           " MONTH(dfecha_doc)= @mes And  \n"+
           " YEAR(dfecha_doc) = @anio And  \n"+
           " modulo = @modulo_contable And            \n"+
           " (Isnull(modulo,'') <> 'RT')           \n"+
           " Order By cnum_doc_cont desc  \n"
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
         " Select   \n"+
         " tipo_letra as Documento_Tipo_Letra, \n"+
         " ejercon as Documento_Ejercicio,  \n"+
         " periodo_con as Documento_Periodo_Contable,  \n"+
         " ccod_svoucher as Documento_Codigo_Svoucher,  \n"+
         " cnum_doc_cont as Documento_Numero_Contable,  \n"+
         " CONVERT(VARCHAR,dfecha_doc,23) as Documento_Fecha_Registro,  \n"+
         " CONVERT(VARCHAR,dfecha_emision,23) as Documento_Fecha_Emision,  \n"+
         " ctip_docref as Documento_Tipo_Documento_Referencia,  \n"+
         " cnum_serie_docref as Documento_Serie_Documento_Referencia,  \n"+
         " cnum_doc_docref as Documento_Numero_Documento_Referencia,  \n"+
         " ctip_doc as Documento_Tipo_Documento,  \n"+
         " cserie_doc as Documento_Serie,  \n"+
         " cnum_doc as Documento_Numero,  \n"+
         " tipo_anexo as Documento_Tipo_Anexo,  \n"+
         " ccod_anexo as Documento_Codigo_Anexo,  \n"+
         " cnom_anexo as Documento_Nombre_Anexo,  \n"+
         " erp_codaval as Documento_Codigo_Aval, \n"+
         " cnom_forpago as Documento_Codigo_Forma_Pago,  \n"+
         " nro_dias as Documento_Dias,  \n"+
         " CONVERT(VARCHAR,fecha_venc,23) as Documento_Fecha_Vencimiento,  \n"+
         " tipo_tc as Documento_Tipo_Cambio,  \n"+
         " cmoneda as Documento_Moneda,  \n"+
         " tipo_cambio as Documento_Tasa_Cambio,      \n"+
         " nimporte as Documento_Importe,  \n"+
         " importe_mn as Documento_Importe_MN,  \n"+
         " importe_me as Documento_Importe_ME,            \n"+
         " estado as Documento_Estado,  \n"+
         " cob_pag as Documento_Cob_Pag,  \n"+
         " cnum_ctax_cob_pag as Documento_Numero_Cta,       \n"+
         " glosa as Documento_Glosa,  \n"+
         " CONVERT(VARCHAR,fecha_canje_letra,23) as Documento_Fecha_Canje_Letra,   \n"+
         " dest_operacion as Documento_Destino_Oprecacion,  \n"+
         " modulo as Documento_Modulo_Contable,  \n"+
         " contabilizada as Documento_Contabilizada,  \n"+
         " erp_usuario as Documento_Usuario,  \n"+
         " nombre_pc as Documento_Nombre_Pc,  \n"+
         " Fecha_Pc as Documento_Fecha_Pc,   \n"+
         " Ip_pc as Documento_Ip_Pc, \n"+
         " --detalle letras \n"+
         " erp_cobpag as  Detalle_Cob_Pag,  \n"+
         " erp_itemov as  Detalle_Item,  \n"+
         " erp_codtia as  Detalle_Tipo_Anexo,  \n"+
         " erp_codane as  Detalle_Codigo_Anexo,  \n"+
         " erp_nomane as  Detalle_Nombre_Anexo,  \n"+
         " erp_tipdoc as  Detalle_Tipo_Doc,  \n"+
         " erp_serdoc as  Detalle_Serie_Doc,  \n"+
         " erp_numdoc as  Detalle_Numero_Doc,  \n"+
         " erp_fecemi as  Detalle_Fecha_Emision,  \n"+
         " erp_fecven as  Detalle_Fecha_Vencimiento,  \n"+
         " erp_codmon as  Detalle_Moneda,  \n"+
         " erp_tipcam as  Detalle_Tc,  \n"+
         " erp_impmn  as  Detalle_Importe_Mn,  \n"+
         " erp_impme  as  Detalle_Importe_Me,  \n"+
         " erp_codcue as  Detalle_Cuenta,  \n"+
         " erp_dh as  Detalle_Dh,  \n"+
         " erp_tipref as  Detalle_Tipo_Ref,  \n"+
         " erp_serref as  Detalle_Serie_Ref,  \n"+
         " erp_numref as  Detalle_Numero_Ref,  \n"+
         " erp_fecref as  Detalle_Fecha_Ref,  \n"+
         " erp_codune as  Detalle_Unidad_Negocio,  \n"+
         " erp_codcen as  Detalle_Cencos,  \n"+
         " erp_codot as  Detalle_OT,  \n"+
         " erp_subref as  Detalle_Voucher_Ref,  \n"+
         " erp_vendedor as  Detalle_Vendedor,  \n"+
         " erp_forpag as  Detalle_For_Pago,  \n"+
         " erp_comision_porc as  Detalle_Porc_Comision,  \n"+
         " erp_comision_monto as  Detalle_Comision  \n"+
         " From Hctacxcp  inner join erp_ctacxcp_detalle \n"+
         " on Hctacxcp.ccod_empresa = erp_ctacxcp_detalle.erp_codemp \n"+
         " and Hctacxcp.cnum_ctax_cob_pag = erp_ctacxcp_detalle.erp_numcxp \n"+
         " Where ccod_empresa = @ccod_empresa And  \n"+
         " ejercon = @ejercicio And  periodo_con = @periodo and \n"+
         " cnum_ctax_cob_pag = @numero_documento_contable \n"
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
        .query(
         " select  \n"+
         " '' as activo,          \n"+
         " erp_tipdoc as tipo,    \n"+
         " erp_serdoc as serie,   \n"+
         " erp_numdoc as numero,  \n"+
         " erp_fecemi as fecha,   \n"+
         " erp_codmon as moneda,  \n"+
         " erp_codcue AS Cuenta,  \n"+
         " erp_fecven as Fecha_Vencimiento, \n"+
         " erp_fecven as tipo_cambio,   \n"+
         " erp_codane AS codigo_anexo,  \n"+
         " erp_nomane AS nombre_anexo,  \n"+
         " erp_dh AS Dh,                \n"+
         " erp_codcen AS cencos,        \n"+
         " erp_codot AS ot,             \n"+
         " erp_codtia  AS tipo_anexo,   \n"+
         " '' AS ejercicio,             \n"+
         " '' AS periodo,               \n"+
         " erp_subref AS voucher,       \n"+
         " ''  AS Numero_contable,      \n"+
         " erp_itemov  AS item,  \n"+
         " erp_impme as Importe_Dolares,  \n"+
         " erp_impmn as Importe_Soles, \n"+
         " '' AS signo,                \n"+
         " '' AS aval,                 \n"+
         " '' AS banco,            \n"+
         " '' AS situacion_letra,      \n"+
         " '' AS nro_unico,   \n"+
         " '' as Pago_Dolares, \n"+
         " '' as Pago_Soles,  \n"+
         " 0 AS activo2,               \n"+
         " erp_tipref as tipo_ref2,      \n"+
         " erp_serref as serie_ref2,   \n"+
         " erp_numref as numero_ref2,      \n"+
         " erp_fecref as fecha_ref2,      \n"+
         " '' as aplica_retencion,      \n"+
         " '' as porc_percep,          \n"+
         " '' as nom_bancos,           \n"+
         " '' as nom_situacion,        \n"+
         " erp_vendedor as vendedor,   \n"+
         " erp_forpag as for_pago,     \n"+
         " '' as vendedor2 ,           \n"+
         " '' as monto_percep  ,       \n"+
         " 'N' as retencion_si_no  ,   \n"+
         " 0.00 as retencion_porcent,  \n"+
         " '' as retencion_doc_serie  ,  \n"+
         " '' as retencion_doc_numero ,  \n"+
         " erp_codune as erp_codune ,   \n"+
         " '' as glosa     \n"+
         " from erp_ctacxcp_detalle \n"+
         " where erp_tipdoc = 'LT' and  \n"+
         " erp_codemp = @codigo_empresa and \n"+
         " erp_codtia = @tipo_anexo and \n"+
         " erp_codane = @codigo_anexo \n"+
         " order by erp_numdoc desc \n"
        ); 
          
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

module.exports = router;
// module.exports = router;