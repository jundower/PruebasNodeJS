const express = require('express');
const router = express.Router();
const {isLoggedin} = require('../../../lib/auth');
const {poolPromise, mssql} = require ('../../../database');
const helpers = require('../../../lib/helpers');

router.get('/movimientos_contables',isLoggedin,async (req, res) => {
    res.render("modulos/contabilidad/movimientos_contables");
});

router.post('/detalle', async (req, res) => {
    try{
        const codigo_empresa = req.user.codigo_empresa;
        if (req.body.cob_pag != undefined) {
            var ejercon = req.body.ejercicio;
            var periodo_con = req.body.periodo;
            var ccod_svoucher = req.body.subvoucher;
            var cnum_doc = req.body.numero_documento_contable;
        }else{
            var ejercon = '';
            var periodo_con = '';
            var ccod_svoucher = '';
            var cnum_doc = '';
        }
        const pool = await poolPromise;
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('ejercon', mssql.VarChar(250), ejercon)
        .input('ccod_svoucher', mssql.VarChar(250), ccod_svoucher)
        .input('periodo_con', mssql.VarChar(250), periodo_con)
        .input('cnum_doc', mssql.VarChar(250), cnum_doc)
        .query(
            "Select \n"+
            "Hmovcond.ccuenta as Cuenta, \n"+
            "Hplancon.cnom_cuenta as Nombre_Cuenta, \n"+
            "Hmovcond.ccod_auxiliar as Codigo_Anexo, \n"+
            "Hmovcond.cnom_auxiliar as Nombre_Anexo, \n"+
            "Hmovcond.debe as Debe, \n"+
            "Hmovcond.haber as Haber, \n"+
            "Hmovcond.ccod_cencos as CenCos, \n"+
            "Hmovcond.ot as Ot, \n"+
            "Hmovcond.erp_codune as Unidad_Negocio, \n"+
            "Hmovcond.glosa as Glosa, \n"+
            "Hmovcond.d_h as D_H, \n"+
            "Hmovcond.ctip_docref as Tipo_Referencia, \n"+
            "Hmovcond.cnum_serieref as Serie_Referencia, \n"+
            "Hmovcond.cnum_docref as Numero_Referencia, \n"+
            "CONVERT(VARCHAR(50),Hmovcond.dfechadocref, 103) as Fecha_Referencia, \n"+
            "Hmovcond.tipo_cambio_docref as Tipo_Cambio_Referencia, \n"+
            "Hmovcond.cmoneda_docref as Moneda_Referencia, \n"+
            "Hmovcond.subvoucher_ref as SubVoucher_Referencia, \n"+
            "Hmovcond.tipo_origen as Tipo_Origen, \n"+
            "CONVERT(VARCHAR(50),Hmovcond.fecha_vencimiento, 103) as Fecha_Vencimiento, \n"+
            "Hmovcond.erp_codven as Vendedor, \n"+
            "Hmovcond.erp_codven2 as Vendedor2, \n"+
            "Hmovcond.erp_forpag as Forma_Pago, \n"+
            "Hmovcond.tipodoc_2 as Tipo2, \n"+
            "Hmovcond.seriedoc_2 as Serie2, \n"+
            "Hmovcond.numdoc_2 as Numero2, \n"+
            "CONVERT(VARCHAR(50),Hmovcond.fechadoc_2, 103) as Fecha2, \n"+
            "Hmovcond.mndebe as MnDebe, \n"+
            "Hmovcond.mnhaber as MnHaber, \n"+
            "Hmovcond.medebe as MeDebe, \n"+
            "Hmovcond.mehaber as MeHaber, \n"+
            "Hmovcond.cuenta_trans as Es_Transferencia, \n"+
            "Hplancon.sitransfer as Si_Transferencia, \n"+
            "Hplancon.csicencos as Si_CenCos, \n"+
            "Hplancon.ot as Si_Ot, \n"+
            "Hmovcond.cta_diferencia  as Si_Diferencia, \n"+
            "Hmovcond.cta_detracion as Si_Detraccion, \n"+
            "Hmovcond.cta_percepcion as Si_Percepcion, \n"+
            "Hmovcond.erp_presupuesto_sn as Si_Presupuesto, \n"+
            "Hmovcond.retencion_s_n as Si_Retencion, \n"+
            "Hmovcond.ctip_auxiliar as Tipo_Anexo, \n"+
            "Hmovcond.item_transferencia as Item_Transferencia, \n"+
            "Hmovcond.erp_presupuesto as Presupuesto, \n"+
            "Hmovcond.ccod_banco as Banco, \n"+
            "Hmovcond.ccod_sit_letra as Situacion_Letra, \n"+
            "Hmovcond.nro_unico as Numero_Unico, \n"+
            "Hmovcond.cta_retencion as Retencion, \n"+
            "Hmovcond.retencion_porcent as Retencion_Porcentaje, \n"+
            "Hmovcond.retencion_doc_serie as Retencion_Serie, \n"+
            "Hmovcond.retencion_doc_numero as Retencion_Numero, \n"+
            "Hmovcond.ccod_articulo as Codigo_Articulo_Referencia, \n"+
            "Hmovcond.nitem_ref as Item_Articulo_Referencia, \n"+
            "LTRIM(RTRIM(Hmovcond.ccod_cencos)) as Codigo_CenCos, \n"+
            "LTRIM(RTRIM(Hmovcond.ot)) as Codigo_Ot, \n"+
            "LTRIM(RTRIM(Hmovcond.erp_codune)) as Codigo_Unidad_Negocio, \n"+
            "LTRIM(RTRIM(Hmovcond.ctip_docref)) as Codigo_Tipo_Referencia, \n"+
            "LTRIM(RTRIM(Hmovcond.tipodoc_2)) as Codigo_Tipo2, \n"+
            "LTRIM(RTRIM(Hmovcond.subvoucher_ref)) as Codigo_SubVoucher_Referencia, \n"+
            "LTRIM(RTRIM(Hmovcond.tipo_origen)) as Codigo_Tipo_Origen, \n"+
            "LTRIM(RTRIM(Hmovcond.erp_codven)) as Codigo_Vendedor, \n"+
            "LTRIM(RTRIM(Hmovcond.erp_codven2)) as Codigo_Vendedor2, \n"+
            "LTRIM(RTRIM(Hmovcond.erp_forpag)) as Codigo_Forma_Pago, \n"+
            "LTRIM(RTRIM(Hmovcond.movimiento_guia)) as Movimiento_Guia, \n"+
            "LTRIM(RTRIM(Hmovcond.tipmov_guia)) as Tipo_Movimiento_Guia, \n"+
            "LTRIM(RTRIM(Hmovcond.serie)) as Serie_Guia, \n"+
            "LTRIM(RTRIM(Hmovcond.numero)) as Numero_Guia \n"+
            "From hmovcond \n"+
            "Inner Join Hplancon On \n"+
            "Hmovcond.ccod_empresa = Hplancon.ccod_empresa And \n"+
            "Hmovcond.ccuenta = Hplancon.ccuenta \n"+
            "Where \n"+
            "Hmovcond.ccod_empresa = @codigo_empresa \n"+
            "And Hmovcond.ejercon = @ejercon \n"+
            "And Hmovcond.periodo_con = @periodo_con \n"+
            "And Hmovcond.ccod_svoucher = @ccod_svoucher \n"+
            "And Hmovcond.cnum_doc = @cnum_doc \n"+
            "Order by Hmovcond.nitem \n"
        );
    
        const recordset = lista.recordset;
        res.json(recordset);
    }catch(err){
        res.send(err.message);
    }
});

router.post('/parametros_contables', async (req, res) => {
    try{
        const codigo_empresa = req.user.codigo_empresa;

        const pool = await poolPromise;
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .query(
            "select  \n"+
            "agente_rtn, \n"+
            "porc_rtn, \n"+
            "agente_prc, \n"+
            "porc_prcp, \n"+
            "cta_prcprov, \n"+
            "prc_en_doc, \n"+
            "buen_contribuyente, \n"+
            "cta_percambio, \n"+
            "cta_gancambio, \n"+
            "cta_percambiome, \n"+
            "cta_gancambiome, \n"+
            "cta_nc_vta, \n"+
            "cta_nd_vta, \n"+
            "cuenta_renta_cuarta, \n"+
            "cta_rtn, \n"+
            "cta_rtnp, \n"+
            "cuenta_debe_deposito, \n"+
            "cuenta_haber_deposito, \n"+
            "cta_detraccion, \n"+
            "factor, \n"+
            "erp_ctadtc, \n"+
            "erp_cta_dscto, \n"+
            "erp_cta_igv_imp, \n"+
            "erp_cuenta_planilla, \n"+
            "erp_cuenta_essalud, \n"+
            "erp_cta_percep_clie, \n"+
            "erp_voudetrac_comp, \n"+
            "erp_voudetrac_vent, \n"+
            "erp_voureten_comp, \n"+
            "erp_voureten_vent, \n"+
            "erp_regimen_esp_gen, \n"+
            "erp_tip_plancon, \n"+
            "erp_cta_onp, \n"+
            "erp_porc_renta_cuarta, \n"+
            "erp_monto_rmv, \n"+
            "dt_monto_total_sn, \n"+
            "cta_recaudo, \n"+
            "erp_anexo_recaudo, \n"+
            "erp_cta_cheque_diferido, \n"+
            "cta_rt_no_domic, \n"+
            "cta_detraccion_dolar, \n"+
            "erp_ctadtc_dolar, \n"+
            "cta_detrac_prov_relac, \n"+
            "cta_detrac_cli_relac, \n"+
            "nnivel01, \n"+
            "nnivel02, \n"+
            "nnivel03, \n"+
            "monto_rt, \n"+
            "pnnivel01, \n"+
            "pnnivel02, \n"+
            "pnnivel03, \n"+
            "cta_icbper \n"+
            "from Hparameter  \n"+
            "where ccod_empresa = @codigo_empresa \n"
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

        var fecha_contabilidad =  new Date(req.body.fecha_doc.replace("-", "/"));
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
                
                //#region Guardar Contabilidad Cabecera
                const request_contabilidad_cabecera  = new mssql.Request(transaction);
                await request_contabilidad_cabecera
                .input('ccod_empresa', mssql.VarChar(250), codigo_empresa)
                .input('ejercon', mssql.VarChar(250), req.body.ejercicio)
                .input('periodo_con', mssql.VarChar(250), req.body.periodo)
                .input('ccod_svoucher', mssql.VarChar(250), req.body.codigo_subvoucher)
                .input('cnum_doc', mssql.VarChar(250), numero_correlativo_contabilidad)
                .input('automatico', mssql.VarChar(250), req.body.automatico)
                .input('dfecha_doc', mssql.Date, req.body.fecha_registro)
                .input('fecha_referencia', mssql.Date, req.body.fecha_referencia)
                .input('tipo2', mssql.VarChar(250), req.body.tipo_documento_referencia)
                .input('serie2', mssql.VarChar(250), req.body.serie_documento_referencia)
                .input('numero2', mssql.VarChar(250), req.body.numero_documento_referencia)
                .input('dfecha_docref', mssql.Date, req.body.fecha_doc)
                .input('ctip_docref', mssql.VarChar(250), req.body.tipo_documento)
                .input('cserie_docref', mssql.VarChar(250), req.body.serie)
                .input('cnum_docref', mssql.VarChar(250), req.body.numero)
                .input('ctip_auxiliar', mssql.VarChar(250), req.body.tipo_codigo_auxiliar)
                .input('ccod_anexo', mssql.VarChar(250), req.body.codigo_anexo)
                .input('cnom_anexo', mssql.VarChar(250), req.body.nombre_anexo)
                .input('cmoneda', mssql.VarChar(250), req.body.moneda)
                .input('ctip_cambio', mssql.VarChar(250), req.body.tipo_cambio)
                .input('tipo_cambio', mssql.VarChar(250), req.body.tasa_cambio)
                .input('tc_ref', mssql.VarChar(250), '0')
                .input('tipo_registro', mssql.VarChar(250), req.body.tipo_registro)
                .input('glosa', mssql.VarChar(250), req.body.Glosa)
                .input('estado', mssql.VarChar(250), req.body.estado)
                .input('dest_operacion', mssql.VarChar(250), req.body.destino_operacion)
                .input('modulo_origen', mssql.VarChar(250), req.body.modulo_origen)
                .input('a_dua', mssql.VarChar(250), '')
                .input('mnbaseimpgrav', mssql.VarChar(250),  req.body.destino_operacion != '004'? req.body.erp_Dsubtotal:0)
                .input('mnbaseimpnograv', mssql.VarChar(250), req.body.erp_Dsubtotal_No_Grabada)
                .input('mnigvgrav', mssql.VarChar(250), req.body.erp_Digv)
                .input('nimporte', mssql.VarChar(250), req.body.erp_Dimporte)
                .input('otros_tributos', mssql.VarChar(250), '0')
                .input('ventas_diferidas', mssql.VarChar(250), '0')
                .input('base_con_mn', mssql.VarChar(250), req.body.destino_operacion != '004'? calculos_contable.SubTotal_Gravado_MN:0)
                .input('base_sin_mn', mssql.VarChar(250), calculos_contable.SubTotal_No_Gravado_MN)
                .input('igv_mn', mssql.VarChar(250), calculos_contable.Igv_MN)
                .input('otros_mn', mssql.VarChar(250), '0')
                .input('importe_mn', mssql.VarChar(250), calculos_contable.Total_MN)
                .input('detraccion_mn', mssql.VarChar(250), calculos_contable.Detraccion_MN)
                .input('venta_diferida_mn', mssql.VarChar(250), '0')
                .input('base_con_me', mssql.VarChar(250), req.body.destino_operacion != '004'? calculos_contable.SubTotal_Gravado_ME:0)
                .input('base_sin_me', mssql.VarChar(250), calculos_contable.SubTotal_No_Gravado_ME)
                .input('igv_me', mssql.VarChar(250), calculos_contable.Igv_ME)
                .input('otros_me', mssql.VarChar(250), '0')
                .input('importe_me', mssql.VarChar(250), calculos_contable.Total_ME)
                .input('detraccion_me', mssql.VarChar(250), calculos_contable.Detraccion_ME)
                .input('venta_diferida_me', mssql.VarChar(250), '0')
                .input('dfecha_venc', mssql.Date, req.body.fecha_vencimiento)
                .input('detraccion_sn', mssql.VarChar(250), req.body.detraccion_sn)
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
                .input('pc_fecha', mssql.Date, req.body.fecha_doc)
                .input('pc_ip', mssql.VarChar(250), '')
                .input('erp_porcentaje_percep', mssql.VarChar(250), req.body.porcentaje_percepcion)
                .input('erp_porcent_igv', mssql.VarChar(250), req.body.porcentaje_impuesto)
                .input('erp_nro_dias', mssql.VarChar(250), req.body.dias)
                .input('erp_porcent_detraccion', mssql.VarChar(250), req.body.porcentaje_detraccion)
                .input('erp_percepcion_sn', mssql.VarChar(250), req.body.percepcion_sn)
                .input('erp_porc_percep', mssql.VarChar(250), req.body.porcentaje_percepcion)
                .input('erp_reten_mn', mssql.VarChar(250), '0')
                .input('erp_reten_me', mssql.VarChar(250), '0')
                .input('erp_descuento_mn', mssql.VarChar(250), '0')
                .input('erp_descuento_me', mssql.VarChar(250), '0')
                .input('erp_comision_mn', mssql.VarChar(250), '0')
                .input('erp_comision_me', mssql.VarChar(250), '0')
                .input('erp_retencion_sn', mssql.VarChar(250), req.body.retencion_sn)
                .input('erp_porc_retencion', mssql.VarChar(250), req.body.porcentaje_retencion)
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
                .input('ccod_retencion_no_domic', mssql.VarChar(250),  req.body.retension_no_domiciliado)
                .input('retencion_no_domic_sn', mssql.VarChar(250), req.body.retencion_no_domiciliado_sn)
                .input('retencion_no_domic_mn', mssql.VarChar(250), '0')
                .input('retencion_no_domic_me', mssql.VarChar(250), '0')
                .input('erp_porcent_retencion_no_domic', mssql.VarChar(250), req.body.porcentaje_retencion_no_domiciliado)
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

                // #region  grabar detalle
                var nitem = 0;
                for(var j=0;j<filas_detalle.length;j++){
                    console.log(filas_detalle[j]);
                    var Si_Detraccion = filas_detalle[j].Si_Detraccion
                    console.log(filas_detalle[j].Forma_Pago);

                    nitem++;
                    var request_contabilidad_detalle  = new mssql.Request(transaction);
                    await request_contabilidad_detalle
                    .input('ccod_empresa',mssql.VarChar(250), codigo_empresa)
                    .input('ejercon',mssql.VarChar(250), req.body.ejercicio)
                    .input('periodo_con',mssql.VarChar(250), req.body.periodo)
                    .input('ccod_svoucher',mssql.VarChar(250), req.body.codigo_subvoucher)
                    .input('cnum_doc',mssql.VarChar(250), numero_correlativo_contabilidad)
                    .input('nitem',mssql.VarChar(250), nitem)
                    .input('ccuenta',mssql.VarChar(250), filas_detalle[j].Cuenta)
                    .input('ctip_auxiliar',mssql.VarChar(250), filas_detalle[j].Tipo_Anexo)
                    .input('ccod_auxiliar',mssql.VarChar(250), filas_detalle[j].Codigo_Anexo)
                    .input('cnom_auxiliar',mssql.VarChar(250), filas_detalle[j].Nombre_Anexo)
                    .input('debe',mssql.VarChar(250), filas_detalle[j].Debe)
                    .input('haber',mssql.VarChar(250), filas_detalle[j].Haber)
                    .input('mndebe',mssql.VarChar(250), filas_detalle[j].MnDebe)
                    .input('mnhaber',mssql.VarChar(250), filas_detalle[j].MnHaber)
                    .input('medebe',mssql.VarChar(250), filas_detalle[j].MeDebe)
                    .input('mehaber',mssql.VarChar(250), filas_detalle[j].MeHaber)
                    .input('mnretencion',mssql.VarChar(250), '0')
                    .input('erp_codune',mssql.VarChar(250), filas_detalle[j].Unidad_Negocio)
                    .input('ccod_cencos',mssql.VarChar(250), filas_detalle[j].CenCos)
                    .input('ot',mssql.VarChar(250), filas_detalle[j].Ot)
                    .input('d_h',mssql.VarChar(250), filas_detalle[j].D_H)
                    .input('ccod_almacen_docref',mssql.VarChar(250), '')
                    .input('ctip_docref',mssql.VarChar(250), filas_detalle[j].Tipo_Referencia)
                    .input('cnum_serieref',mssql.VarChar(250),filas_detalle[j].Serie_Referencia)
                    .input('cnum_docref',mssql.VarChar(250),filas_detalle[j].Numero_Referencia)
                    .input('dfechadocref',mssql.VarChar(250),filas_detalle[j].Fecha_Referencia)
                    .input('tipodoc_2',mssql.VarChar(250), filas_detalle[j].Tipo2)
                    .input('seriedoc_2',mssql.VarChar(250), filas_detalle[j].Serie2)
                    .input('numdoc_2',mssql.VarChar(250), filas_detalle[j].Numero2)
                    .input('fechadoc_2',mssql.VarChar(250), filas_detalle[j].Fecha2)
                    .input('monto_ref',mssql.VarChar(250), '0')
                    .input('CMONEDA_DOCREF',mssql.VarChar(250), filas_detalle[j].Moneda_Referencia)
                    .input('TIPO_CAMBIO_DOCREF',mssql.VarChar(250), filas_detalle[j].Tipo_Cambio_Referencia)
                    .input('subvoucher_ref',mssql.VarChar(250), req.body.codigo_subvoucher)
                    .input('fecha_vencimiento',mssql.VarChar(250), filas_detalle[j].Fecha_Vencimiento)
                    .input('glosa',mssql.VarChar(250), filas_detalle[j].Glosa)
                    .input('movimiento_guia',mssql.VarChar(250), filas_detalle[j].Movimiento_Guia)
                    .input('tipmov_guia',mssql.VarChar(250), filas_detalle[j].Tipo_Movimiento_Guia)
                    .input('serie',mssql.VarChar(250), filas_detalle[j].Serie_Guia)
                    .input('numero',mssql.VarChar(250), filas_detalle[j].Numero_Guia)
                    .input('iten_guia',mssql.VarChar(250), '0')
                    .input('cta_diferencia',mssql.VarChar(250), filas_detalle[j].Si_Diferencia)
                    .input('cuenta_trans',mssql.VarChar(250), filas_detalle[j].Es_Transferencia)
                    .input('item_transferencia',mssql.VarChar(250), filas_detalle[j].Item_Transferencia)
                    .input('tipo_origen',mssql.VarChar(250), filas_detalle[j].Tipo_Anexo == "00"? 'N':filas_detalle[j].Tipo_Origen)
                    .input('pago_mn',mssql.VarChar(250), '0')
                    .input('pago_me',mssql.VarChar(250), '0')
                    .input('pago_rt',mssql.VarChar(250), '0')
                    .input('cta_detracion',mssql.VarChar(250), Si_Detraccion == ''|| Si_Detraccion == 'N'? 'N': 'S')
                    .input('cta_retencion',mssql.VarChar(250), filas_detalle[j].Si_Retencion == ''? 'N': 'S')
                    .input('cta_percepcion',mssql.VarChar(250), filas_detalle[j].Si_Percepcion == ''? 'N': 'S')
                    .input('CCOD_BANCO',mssql.VarChar(250), '00')
                    .input('CCOD_SIT_LETRA',mssql.VarChar(250), '00')
                    .input('NRO_UNICO',mssql.VarChar(250), '')
                    .input('erp_codven',mssql.VarChar(250), filas_detalle[j].Vendedor)
                    .input('erp_forpag',mssql.VarChar(250), filas_detalle[j].Forma_Pago == null? '00':filas_detalle[j].Forma_Pago)
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
                    .input('erp_codven2',mssql.VarChar(250), filas_detalle[j].Vendedor2)
                    .input('erp_cta_costo_sn',mssql.VarChar(250), 'N')
                    .input('clasif_bien_servicio',mssql.VarChar(250), '')
                    .input('cta_retencion_no_domic',mssql.VarChar(250), '')
                    .input('rt_aplica_no_domic',mssql.VarChar(250), '')
                    .input('retencion_s_n',mssql.VarChar(250), '')
                    .input('retencion_porcent',mssql.VarChar(250), '0')
                    .input('retencion_doc_serie',mssql.VarChar(250), '')
                    .input('retencion_doc_numero',mssql.VarChar(250), '')
                    .input('ccod_articulo',mssql.VarChar(250), filas_detalle[j].Codigo_Articulo_Referencia)
                    .input('nitem_ref',mssql.VarChar(250), filas_detalle[j].Item_Articulo_Referencia)
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
                
                //#endregion

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

                transaction.commit(tErr => {if(tErr) {console.log(tErr)}})
                res.send({estado: true, codigo: numero_correlativo_contabilidad, mensaje: ""});
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

        switch (req.body.busqueda) {
            case "año_mes":
                var opcion = "and MONTH(movc.dfecha_doc) = @mes AND YEAR(movc.dfecha_doc) = @anio \n"
                break;
            case "rango_fechas":
                var opcion = "and movc.dfecha_doc between @fecha_inicio and @fecha_final \n"
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
           " select         \n"+
           " movc.ejercon as Ejercicio,  \n"+
           " movc.periodo_con as Periodo_Contable,  \n"+
           " movc.cnum_doc as Numero_Contable,  \n"+
           " CONVERT(VARCHAR,movc.dfecha_doc,103) as Fecha_Registro,  \n"+
           " movc.automatico as Automatico,  \n"+
           " movc.ccod_svoucher as Codigo_Svoucher,  \n"+
           " movc.cmoneda as Moneda,          \n"+
           " Round((sum(movd.mndebe)-sum(movd.mnhaber)),2) as MN,         \n"+
           " Round((sum(movd.medebe)-sum(movd.mehaber)),2) as ME,         \n"+
           " movc.estado as Estado,  \n"+
           " CONVERT(VARCHAR,movc.dfecha_docref,103) as Fecha_Emision,  \n"+
           " movc.ctip_docref as Tipo_Documento,  \n"+
           " movc.cserie_docref as Serie,  \n"+
           " movc.cnum_docref as Numero, \n"+
           " movc.ctip_auxiliar as Tipo_Anexo,  \n"+
           " movc.ccod_anexo as Codigo_Anexo,  \n"+
           " movc.cnom_anexo as Nombre_Anexo,  \n"+
           " movc.erp_forpag as Codigo_Forma_Pago,  \n"+
           " movc.erp_nro_dias as Dias,   \n"+
           " movc.mnbaseimpgrav as SubTotal,  \n"+
           " movc.mnbaseimpnograv as SubTotal_NGrabado, \n"+
           " movc.erp_porcent_igv as Porcentaje,  \n"+
           " movc.mnigvgrav as Igv, \n"+
           " movc.nimporte as Importe,  \n"+
           " '0' as Detraccion,  \n"+
           " '0'as Pago,  \n"+
           " '0' as Saldo, \n"+
           " movc.base_con_mn as SubTotal_MN,  \n"+
           " movc.base_sin_mn as SubTotal_Mixto_MN,  \n"+
           " movc.igv_mn as Igv_MN,  \n"+
           " movc.importe_mn as Importe_MN,  \n"+
           " movc.detraccion_mn as Detraccion_MN,  \n"+
           " movc.base_con_me as SubTotal_ME,  \n"+
           " movc.base_sin_me as SubTotal_Mixto_ME,  \n"+
           " movc.igv_me as Igv_ME,  \n"+
           " movc.importe_me as Importe_ME,  \n"+
           " movc.detraccion_me as Detraccion_ME,             \n"+
           " movc.modulo_origen as Modulo_Contable,  \n"+
           " CONVERT(VARCHAR,movc.fecha_referencia,103) as Fecha_Referencia_Documento,  \n"+
           " movc.tipo2 as Tipo_Documento_Referencia,  \n"+
           " movc.serie2 as Serie_Documento_Referencia,  \n"+
           " movc.numero2 as Numero_Documento_Referencia,   \n"+
           " movc.glosa as Glosa, \n"+
           " movc.dest_operacion as Destino_Operacion, \n"+
           " movc.tipo_cambio as Tipo_Cambio,     \n"+
           " movc.ccod_detraccion as Codigo_Detraccion, \n"+
           " movc.detraccion_sn as SN_Detraccion, \n"+
           " movc.erp_porcent_detraccion as Porcentaje_Detraccion, \n"+
           " '0' as Monto_Detraccion,  \n"+
           " movc.clasif_bien_servicio as Cliasificacion_Bien_Servicio,  \n"+
           " movc.ccod_retencion_no_domic as Retencion_NoDomiciliada,  \n"+
           " movc.retencion_no_domic_sn as SN_Retencion,  \n"+
           " movc.erp_porcent_retencion_no_domic as Porcentaje_Retencion_NoDomiciliada,  \n"+
           " '0' as Monto_Retencion,  \n"+
           " movc.retencion_no_domic_mn as Retencion_NDomic_MN,  \n"+
           " movc.retencion_no_domic_me as retencion_Ndomic_ME,  \n"+
           " movc.icbper as Icbper,  \n"+
           " movc.icbper_mn as Icbper_MN,  \n"+
           " movc.icbper_me as Icbper_ME , \n"+
           " movc.erp_usuario as Usuario, \n"+
           " movc.nombre_pc as Nombre_Pc,  \n"+
           " movc.Fecha_Pc as Fecha_Pc, \n"+
           " convert(varchar,movc.Fecha_Pc,108)as Hora_Pc, \n"+
           " movc.Ip_pc as Ip_Pc    \n"+
           " From hmovconc movc         \n"+
           " inner join hmovcond movd on         \n"+
           " movc.ccod_empresa = movd.ccod_empresa and          \n"+
           " movc.ejercon = movd.ejercon and         \n"+
           " movc.periodo_con = movd.periodo_con and         \n"+
           " movc.ccod_svoucher = movd.ccod_svoucher and         \n"+
           " movc.cnum_doc = movd.cnum_doc          \n"+
           " Where movc.ccod_empresa = @codigo_empresa \n"+opcion+
           " group by movc.ejercon, movc.periodo_con,  \n"+
           " movc.cnum_doc, movc.dfecha_doc,  \n"+
           " movc.automatico,movc.dfecha_docref, \n"+
           " movc.fecha_referencia,movc.tipo2, \n"+
           " movc.serie2,movc.numero2,movc.tipo_cambio, \n"+
           " movc.ccod_svoucher, movc.cmoneda,  \n"+
           " movc.erp_forpag, movc.erp_nro_dias,       \n"+
           " movc.estado, movc.ctip_docref,  \n"+
           " movc.cserie_docref, movc.cnum_docref, \n"+
           " movc.mnbaseimpgrav, movc.mnbaseimpnograv, \n"+
           " movc.erp_porcent_igv, movc.mnigvgrav, \n"+
           " movc.nimporte,movc.ctip_auxiliar,  \n"+
           " movc.base_con_mn, movc.base_sin_mn, \n"+
           " movc.igv_mn,movc.importe_mn, \n"+
           " movc.detraccion_mn, movc.base_con_me, \n"+
           " movc.base_sin_me,movc.igv_me, \n"+
           " movc.importe_me, movc.detraccion_me, \n"+
           " movc.glosa,movc.dest_operacion, \n"+
           " movc.ccod_detraccion, movc.detraccion_sn, \n"+
           " movc.erp_porcent_detraccion, \n"+
           " movc.clasif_bien_servicio, movc.ccod_retencion_no_domic, \n"+
           " movc.retencion_no_domic_sn, movc.erp_porcent_retencion_no_domic, \n"+
           " movc.retencion_no_domic_me, movc.retencion_no_domic_mn, \n"+
           " movc.icbper, movc.icbper_mn,movc.icbper_me, \n"+
           " movc.ccod_anexo, movc.cnom_anexo,  \n"+
           " movc.modulo_origen,movc.erp_usuario,  \n"+
           " movc.nombre_pc, movc.Fecha_Pc,movc.Ip_pc,ncorrel  \n"+
           " Order By movc.dfecha_doc desc, movc.cnum_doc desc \n"
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
        .input("ejercicio", mssql.VarChar(250), req.body.ejercicio)
        .input("periodo", mssql.VarChar(250), req.body.periodo)
        .input("numero_documento_contable", mssql.VarChar(250), req.body.numero_documento_contable)
        .input("subvoucher", mssql.VarChar(250), req.body.subvoucher)
        .query(
           " select   \n"+
           " movc.ejercon as Documento_Ejercicio,  \n"+
           " movc.periodo_con as Documento_Periodo_Contable,  \n"+
           " movc.cnum_doc as Documento_Numero_Contable,  \n"+
           " CONVERT(VARCHAR,movc.dfecha_doc,23) as Documento_Fecha_Registro,  \n"+
           " movc.automatico as Documento_Automatico,  \n"+
           " movc.tipo_registro as Documento_Tipo_Registro, \n"+ 
           " movc.ccod_svoucher as Documento_Codigo_Svoucher,  \n"+
           " movc.cmoneda as Documento_Moneda,                \n"+
           " movc.estado as Documento_Estado,  \n"+
           " CONVERT(VARCHAR,movc.dfecha_docref,23) as Documento_Fecha_Emision,  \n"+
           " movc.ctip_docref as Documento_Tipo_Documento,  \n"+
           " movc.cserie_docref as Documento_Serie,  \n"+
           " movc.cnum_docref as Documento_Numero, \n"+
           " movc.ctip_auxiliar as Documento_Tipo_Anexo,  \n"+
           " CONVERT(VARCHAR,movc.dfecha_venc,23) as Documento_Fecha_Vencimiento,  \n"+
           " movc.ccod_anexo as Documento_Codigo_Anexo,  \n"+
           " movc.cnom_anexo as Documento_Nombre_Anexo,  \n"+
           " movc.erp_forpag as Documento_Codigo_Forma_Pago,  \n"+
           " movc.erp_nro_dias as Documento_Dias,   \n"+
           " movc.mnbaseimpgrav as Documento_SubTotal,  \n"+
           " movc.mnbaseimpnograv as Documento_SubTotal_NGrabado, \n"+
           " movc.erp_porcent_igv as Documento_Porcentaje,  \n"+
           " movc.mnigvgrav as Documento_Igv, \n"+
           " movc.nimporte as Documento_Importe,  \n"+
           " '0' as Documento_Detraccion,  \n"+
           " '0'as Documento_Pago,  \n"+
           " '0' as Documento_Saldo, \n"+
           " movc.base_con_mn as Documento_SubTotal_MN,  \n"+
           " movc.base_sin_mn as Documento_SubTotal_Mixto_MN,  \n"+
           " movc.igv_mn as Documento_Igv_MN,  \n"+
           " movc.importe_mn as Documento_Importe_MN,  \n"+
           " movc.detraccion_mn as Documento_Detraccion_MN,  \n"+
           " movc.base_con_me as Documento_SubTotal_ME,  \n"+
           " movc.base_sin_me as Documento_SubTotal_Mixto_ME,  \n"+
           " movc.igv_me as Documento_Igv_ME,  \n"+
           " movc.importe_me as Documento_Importe_ME,  \n"+
           " movc.detraccion_me as Documento_Detraccion_ME,             \n"+
           " movc.modulo_origen as Documento_Modulo_Contable,  \n"+
           " CONVERT(VARCHAR,movc.fecha_referencia,23) as Documento_Fecha_Referencia_Documento,  \n"+
           " movc.tipo2 as Documento_Tipo_Documento_Referencia,  \n"+
           " movc.serie2 as Documento_Serie_Documento_Referencia,  \n"+
           " movc.numero2 as Documento_Numero_Documento_Referencia,   \n"+
           " movc.glosa as Documento_Glosa, \n"+
           " movc.dest_operacion as Documento_Destino_Operacion, \n"+
           " movc.tipo_cambio as  Documento_Tasa_Cambio,     \n"+
           " movc.ctip_cambio as Documento_Tipo_Cambio,     \n"+
           " movc.ccod_detraccion as Documento_Codigo_Detraccion, \n"+
           " movc.detraccion_sn as Documento_SN_Detraccion, \n"+
           " movc.erp_porcent_detraccion as Documento_Porcentaje_Detraccion, \n"+
           " '0' as Documento_Monto_Detraccion,  \n"+
           " movc.clasif_bien_servicio as Documento_Cliasificacion_Bien_Servicio,  \n"+
           " movc.ccod_retencion_no_domic as Documento_Retencion_NoDomiciliada,  \n"+
           " movc.retencion_no_domic_sn as Documento_SN_Retencion,  \n"+
           " movc.erp_porcent_retencion_no_domic as Documento_Porcentaje_Retencion_NoDomiciliada,  \n"+
           " '0' as Documento_Monto_Retencion,  \n"+
           " movc.retencion_no_domic_mn as Documento_Retencion_NDomic_MN,  \n"+
           " movc.retencion_no_domic_me as Documento_retencion_Ndomic_ME,  \n"+
           " movc.icbper as Documento_Icbper,  \n"+
           " movc.icbper_mn as Documento_Icbper_MN,  \n"+
           " movc.icbper_me as Documento_Icbper_ME , \n"+
           " movc.erp_usuario as Documento_Usuario, \n"+
           " movc.nombre_pc as Documento_Nombre_Pc,  \n"+
           " movc.Fecha_Pc as Documento_Fecha_Pc, \n"+
           " convert(varchar,movc.Fecha_Pc,108)as Documento_Hora_Pc, \n"+
           " movc.Ip_pc as Documento_Ip_Pc      \n"+
           " From hmovconc movc  \n"+
           " Where ccod_empresa = @ccod_empresa And \n"+
           " ejercon = @ejercicio And  \n"+
           " periodo_con = @periodo And  \n"+
           " cnum_doc = @numero_documento_contable And \n"+
           " ccod_svoucher = @subvoucher \n"
        );
        const Cabecera = lista.recordset;

        res.json(Cabecera);
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/modificar', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const usuario = req.user.codigo_usuario;

        var filas_detalle = JSON.parse(req.body.filas_detalle)

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
                //#region Guardar Contabilidad Cabecera
                const request_contabilidad_cabecera  = new mssql.Request(transaction);
                const result_contabilidad_cabecera = await request_contabilidad_cabecera
                .input('ccod_empresa', mssql.VarChar(250), codigo_empresa)
                .input('ejercon', mssql.VarChar(250), req.body.ejercicio)
                .input('periodo_con', mssql.VarChar(250), req.body.periodo)
                .input('ccod_svoucher', mssql.VarChar(250), req.body.codigo_subvoucher)
                .input('cnum_doc', mssql.VarChar(250), req.body.numero_correlativo)
                .input('automatico', mssql.VarChar(250), req.body.automatico)
                .input('dfecha_doc', mssql.Date, req.body.fecha_registro)
                .input('fecha_referencia', mssql.Date, req.body.fecha_referencia)
                .input('tipo2', mssql.VarChar(250), req.body.tipo_documento_referencia)
                .input('serie2', mssql.VarChar(250), req.body.serie_documento_referencia)
                .input('numero2', mssql.VarChar(250), req.body.numero_documento_referencia)
                .input('dfecha_docref', mssql.Date, req.body.fecha_doc)
                .input('ctip_docref', mssql.VarChar(250), req.body.tipo_documento)
                .input('cserie_docref', mssql.VarChar(250), req.body.serie)
                .input('cnum_docref', mssql.VarChar(250), req.body.numero)
                .input('ctip_auxiliar', mssql.VarChar(250), req.body.tipo_codigo_auxiliar)
                .input('ccod_anexo', mssql.VarChar(250), req.body.codigo_anexo)
                .input('cnom_anexo', mssql.VarChar(250), req.body.nombre_anexo)
                .input('cmoneda', mssql.VarChar(250), req.body.moneda)
                .input('ctip_cambio', mssql.VarChar(250), req.body.tipo_cambio)
                .input('tipo_cambio', mssql.VarChar(250), req.body.tasa_cambio)
                .input('tc_ref', mssql.VarChar(250), '0')
                .input('tipo_registro', mssql.VarChar(250), req.body.tipo_registro)
                .input('glosa', mssql.VarChar(250), req.body.Glosa)
                .input('estado', mssql.VarChar(250), 'Modificado')
                .input('dest_operacion', mssql.VarChar(250), req.body.destino_operacion)
                .input('modulo_origen', mssql.VarChar(250), req.body.modulo_origen)
                .input('a_dua', mssql.VarChar(250), '')
                .input('mnbaseimpgrav', mssql.VarChar(250),  req.body.destino_operacion != '004'? req.body.erp_Dsubtotal:0)
                .input('mnbaseimpnograv', mssql.VarChar(250), req.body.erp_Dsubtotal_No_Grabada)
                .input('mnigvgrav', mssql.VarChar(250), req.body.erp_Digv)
                .input('nimporte', mssql.VarChar(250), req.body.erp_Dimporte)
                .input('otros_tributos', mssql.VarChar(250), '0')
                .input('ventas_diferidas', mssql.VarChar(250), '0')
                .input('base_con_mn', mssql.VarChar(250), req.body.destino_operacion != '004'? calculos_contable.SubTotal_Gravado_MN:0)
                .input('base_sin_mn', mssql.VarChar(250), calculos_contable.SubTotal_No_Gravado_MN)
                .input('igv_mn', mssql.VarChar(250), calculos_contable.Igv_MN)
                .input('otros_mn', mssql.VarChar(250), '0')
                .input('importe_mn', mssql.VarChar(250), calculos_contable.Total_MN)
                .input('detraccion_mn', mssql.VarChar(250), calculos_contable.Detraccion_MN)
                .input('venta_diferida_mn', mssql.VarChar(250), '0')
                .input('base_con_me', mssql.VarChar(250), req.body.destino_operacion != '004'? calculos_contable.SubTotal_Gravado_ME:0)
                .input('base_sin_me', mssql.VarChar(250), calculos_contable.SubTotal_No_Gravado_ME)
                .input('igv_me', mssql.VarChar(250), calculos_contable.Igv_ME)
                .input('otros_me', mssql.VarChar(250), '0')
                .input('importe_me', mssql.VarChar(250), calculos_contable.Total_ME)
                .input('detraccion_me', mssql.VarChar(250), calculos_contable.Detraccion_ME)
                .input('venta_diferida_me', mssql.VarChar(250), '0')
                .input('dfecha_venc', mssql.Date, req.body.fecha_vencimiento)
                .input('detraccion_sn', mssql.VarChar(250), req.body.detraccion_sn)
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
                .input('erp_porcentaje_percep', mssql.VarChar(250), req.body.porcentaje_percepcion)
                .input('erp_porcent_igv', mssql.VarChar(250), req.body.porcentaje_impuesto)
                .input('erp_nro_dias', mssql.VarChar(250), req.body.dias)
                .input('erp_porcent_detraccion', mssql.VarChar(250), req.body.porcentaje_detraccion)
                .input('erp_percepcion_sn', mssql.VarChar(250), req.body.percepcion_sn)
                .input('erp_porc_percep', mssql.VarChar(250), req.body.porcentaje_percepcion)
                .input('erp_reten_mn', mssql.VarChar(250), '0')
                .input('erp_reten_me', mssql.VarChar(250), '0')
                .input('erp_descuento_mn', mssql.VarChar(250), '0')
                .input('erp_descuento_me', mssql.VarChar(250), '0')
                .input('erp_comision_mn', mssql.VarChar(250), '0')
                .input('erp_comision_me', mssql.VarChar(250), '0')
                .input('erp_retencion_sn', mssql.VarChar(250), req.body.retencion_sn)
                .input('erp_porc_retencion', mssql.VarChar(250), req.body.porcentaje_retencion)
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
                .input('ccod_retencion_no_domic', mssql.VarChar(250),  req.body.retension_no_domiciliado)
                .input('retencion_no_domic_sn', mssql.VarChar(250), req.body.retencion_no_domiciliado_sn)
                .input('retencion_no_domic_mn', mssql.VarChar(250), '0')
                .input('retencion_no_domic_me', mssql.VarChar(250), '0')
                .input('erp_porcent_retencion_no_domic', mssql.VarChar(250), req.body.porcentaje_retencion_no_domiciliado)
                .input('saldo_actual_caja', mssql.VarChar(250), '0')
                .input('icbper', mssql.VarChar(250), req.body.erp_ICBPER)
                .input('icbper_mn', mssql.VarChar(250), calculos_contable.Icbper_MN)
                .input('icbper_me', mssql.VarChar(250), calculos_contable.Icbper_ME)
                .input('ruta_pdf', mssql.VarChar(250), '')
                .query("Update hmovconc Set \n"+
                    "automatico = @automatico, \n"+
                    "dfecha_doc = @dfecha_doc, \n"+
                    "fecha_referencia = @fecha_referencia, \n"+
                    "tipo2 = @tipo2, \n"+
                    "serie2 = @serie2, \n"+
                    "numero2 = @numero2, \n"+
                    "dfecha_docref = @dfecha_docref, \n"+
                    "ctip_docref = @ctip_docref, \n"+
                    "cserie_docref = @cserie_docref, \n"+
                    "cnum_docref = @cnum_docref, \n"+
                    "ctip_auxiliar = @ctip_auxiliar, \n"+
                    "ccod_anexo = @ccod_anexo, \n"+
                    "cnom_anexo = @cnom_anexo, \n"+
                    "cmoneda = @cmoneda, \n"+
                    "ctip_cambio = @ctip_cambio, \n"+
                    "tipo_cambio = @tipo_cambio, \n"+
                    "tc_ref = @tc_ref, \n"+
                    "tipo_registro = @tipo_registro, \n"+
                    "glosa = @glosa, \n"+
                    "estado = @estado, \n"+
                    "dest_operacion = @dest_operacion, \n"+
                    "a_dua = @a_dua, \n"+
                    "mnbaseimpgrav = @mnbaseimpgrav, \n"+
                    "mnbaseimpnograv = @mnbaseimpnograv, \n"+
                    "mnigvgrav = @mnigvgrav, \n"+
                    "nimporte = @nimporte, \n"+
                    "otros_tributos = @otros_tributos, \n"+
                    "ventas_diferidas = @ventas_diferidas, \n"+
                    "base_con_mn = @base_con_mn, \n"+
                    "base_sin_mn = @base_sin_mn, \n"+
                    "igv_mn = @igv_mn, \n"+
                    "otros_mn = @otros_mn, \n"+
                    "importe_mn = @importe_mn, \n"+
                    "detraccion_mn = @detraccion_mn, \n"+
                    "venta_diferida_mn = @venta_diferida_mn, \n"+
                    "base_con_me = @base_con_me, \n"+
                    "base_sin_me = @base_sin_me, \n"+
                    "igv_me = @igv_me, \n"+
                    "otros_me = @otros_me, \n"+
                    "importe_me = @importe_me, \n"+
                    "detraccion_me = @detraccion_me, \n"+
                    "venta_diferida_me = @venta_diferida_me, \n"+
                    "dfecha_venc = @dfecha_venc, \n"+
                    "detraccion_sn = @detraccion_sn, \n"+
                    "ccod_detraccion = @ccod_detraccion, \n"+
                    "numero_dt = @numero_dt, \n"+
                    "fecha_dt = @fecha_dt, \n"+
                    "cnum_ctacte = @cnum_ctacte, \n"+
                    "ing_egr = @ing_egr, \n"+
                    "caj_ban = @caj_ban, \n"+
                    "n_planilla = @n_planilla, \n"+
                    "cobrador = @cobrador, \n"+
                    "SN_diferida = @SN_diferida, \n"+
                    "fecha_diferida = @fecha_diferida, \n"+
                    "fecha_ref2 = @fecha_ref2, \n"+
                    "erp_percepcion_mn = @erp_percepcion_mn, \n"+
                    "erp_percepcion_me = @erp_percepcion_me, \n"+
                    "erp_cierre_caj_s_n = @erp_cierre_caj_s_n, \n"+
                    "erp_resp_cierre = @erp_resp_cierre, \n"+
                    "erp_fecha_cierre = @erp_fecha_cierre, \n"+
                    "erp_observacion_cierre = @erp_observacion_cierre, \n"+
                    "erp_responsable = @erp_responsable, \n"+
                    "pc_user = @pc_user, \n"+
                    "pc_fecha = @pc_fecha, \n"+
                    "pc_ip = @pc_ip, \n"+
                    "erp_porcentaje_percep = @erp_porcentaje_percep, \n"+
                    "erp_percepcion_sn = @erp_percepcion_sn, \n"+
                    "erp_porc_percep = @erp_porc_percep, \n"+
                    "erp_reten_mn = @erp_reten_mn, \n"+
                    "erp_reten_me = @erp_reten_me, \n"+
                    "erp_descuento_mn = @erp_descuento_mn, \n"+
                    "erp_descuento_me = @erp_descuento_me, \n"+
                    "erp_comision_mn = @erp_comision_mn, \n"+
                    "erp_comision_me = @erp_comision_me, \n"+
                    "erp_serie_ne_ref = @erp_serie_ne_ref, \n"+
                    "erp_numer_ne_ref = @erp_numer_ne_ref, \n"+
                    "usuario = @usuario, \n"+
                    "erp_tipo_aporte = @erp_tipo_aporte, \n"+
                    "erp_afp = @erp_afp, \n"+
                    "erp_nro_cups = @erp_nro_cups, \n"+
                    "erp_flujo_mixta = @erp_flujo_mixta, \n"+
                    "erp_motivo_venta = @erp_motivo_venta, \n"+
                    "erp_dsubtotal = @erp_dsubtotal, \n"+
                    "erp_ddescuento = @erp_ddescuento, \n"+
                    "erp_digv = @erp_digv, \n"+
                    "erp_dimporte = @erp_dimporte, \n"+
                    "erp_dpercepcion = @erp_dpercepcion, \n"+
                    "erp_dtotal = @erp_dtotal, \n"+
                    "erp_gestor = @erp_gestor, \n"+
                    "erp_usuario = @erp_usuario, \n"+
                    "nombre_pc = @nombre_pc, \n"+
                    "Fecha_Pc = @Fecha_Pc, \n"+
                    "Ip_pc = @Ip_pc, \n"+
                    "retencion_no_domic_sn = @retencion_no_domic_sn, \n"+
                    "retencion_no_domic_mn = @retencion_no_domic_mn, \n"+
                    "retencion_no_domic_me = @retencion_no_domic_me, \n"+
                    "saldo_actual_caja = @saldo_actual_caja, \n"+
                    "icbper = @icbper, \n"+
                    "icbper_mn = @icbper_mn, \n"+
                    "icbper_me = @icbper_me, \n"+
                    "ruta_pdf = @ruta_pdf \n"+
                    "where ccod_empresa = @ccod_empresa and \n"+
                    "ejercon = @ejercon and \n"+
                    "periodo_con = @periodo_con and \n"+
                    "ccod_svoucher = @ccod_svoucher and \n"+
                    "cnum_doc = @cnum_doc "
                );
                //#endregion

                if(result_contabilidad_cabecera.rowsAffected>0){

                    //#region Borrar detalle
                    const request_detalle_borrar  = new mssql.Request(transaction);
                    await request_detalle_borrar
                    .input('ccod_empresa', mssql.VarChar(250), codigo_empresa)
                    .input('ejercon', mssql.VarChar(250), req.body.ejercicio)
                    .input('periodo_con', mssql.VarChar(250), req.body.periodo)
                    .input('ccod_svoucher', mssql.VarChar(250), req.body.codigo_subvoucher)
                    .input('cnum_doc', mssql.VarChar(250), req.body.numero_correlativo)
                    .query("delete from hmovcond where ccod_empresa = @ccod_empresa and ejercon = @ejercon and \n"+
                    "periodo_con = @periodo_con and ccod_svoucher = @ccod_svoucher and cnum_doc = @cnum_doc ")
                    //#endregion

                    //#region Grabar Contabilidad Detalle
                    var nitem = 0;
                    for(var j=0;j<filas_detalle.length;j++){
                        console.log(filas_detalle[j]);
                        var Si_Detraccion = filas_detalle[j].Si_Detraccion

                        nitem++;
                        var request_contabilidad_detalle  = new mssql.Request(transaction);
                        await request_contabilidad_detalle
                        .input('ccod_empresa',mssql.VarChar(250), codigo_empresa)
                        .input('ejercon',mssql.VarChar(250), req.body.ejercicio)
                        .input('periodo_con',mssql.VarChar(250), req.body.periodo)
                        .input('ccod_svoucher',mssql.VarChar(250), req.body.codigo_subvoucher)
                        .input('cnum_doc',mssql.VarChar(250), req.body.numero_correlativo)
                        .input('nitem',mssql.VarChar(250), nitem)
                        .input('ccuenta',mssql.VarChar(250), filas_detalle[j].Cuenta)
                        .input('ctip_auxiliar',mssql.VarChar(250), filas_detalle[j].Tipo_Anexo)
                        .input('ccod_auxiliar',mssql.VarChar(250), filas_detalle[j].Codigo_Anexo)
                        .input('cnom_auxiliar',mssql.VarChar(250), filas_detalle[j].Nombre_Anexo)
                        .input('debe',mssql.VarChar(250), filas_detalle[j].Debe)
                        .input('haber',mssql.VarChar(250), filas_detalle[j].Haber)
                        .input('mndebe',mssql.VarChar(250), filas_detalle[j].MnDebe)
                        .input('mnhaber',mssql.VarChar(250), filas_detalle[j].MnHaber)
                        .input('medebe',mssql.VarChar(250), filas_detalle[j].MeDebe)
                        .input('mehaber',mssql.VarChar(250), filas_detalle[j].MeHaber)
                        .input('mnretencion',mssql.VarChar(250), '0')
                        .input('erp_codune',mssql.VarChar(250), filas_detalle[j].Unidad_Negocio)
                        .input('ccod_cencos',mssql.VarChar(250), filas_detalle[j].CenCos)
                        .input('ot',mssql.VarChar(250), filas_detalle[j].Ot)
                        .input('d_h',mssql.VarChar(250), filas_detalle[j].D_H)
                        .input('ccod_almacen_docref',mssql.VarChar(250), '')
                        .input('ctip_docref',mssql.VarChar(250), filas_detalle[j].Tipo_Referencia)
                        .input('cnum_serieref',mssql.VarChar(250),filas_detalle[j].Serie_Referencia)
                        .input('cnum_docref',mssql.VarChar(250),filas_detalle[j].Numero_Referencia)
                        .input('dfechadocref',mssql.VarChar(250),filas_detalle[j].Fecha_Referencia)
                        .input('tipodoc_2',mssql.VarChar(250), filas_detalle[j].Tipo2)
                        .input('seriedoc_2',mssql.VarChar(250), filas_detalle[j].Serie2)
                        .input('numdoc_2',mssql.VarChar(250), filas_detalle[j].Numero2)
                        .input('fechadoc_2',mssql.VarChar(250), filas_detalle[j].Fecha2)
                        .input('monto_ref',mssql.VarChar(250), '0')
                        .input('CMONEDA_DOCREF',mssql.VarChar(250), filas_detalle[j].Moneda_Referencia)
                        .input('TIPO_CAMBIO_DOCREF',mssql.VarChar(250), filas_detalle[j].Tipo_Cambio_Referencia)
                        .input('subvoucher_ref',mssql.VarChar(250), req.body.codigo_subvoucher)
                        .input('fecha_vencimiento',mssql.VarChar(250), filas_detalle[j].Fecha_Vencimiento)
                        .input('glosa',mssql.VarChar(250), filas_detalle[j].Glosa)
                        .input('movimiento_guia',mssql.VarChar(250), filas_detalle[j].Movimiento_Guia)
                        .input('tipmov_guia',mssql.VarChar(250), filas_detalle[j].Tipo_Movimiento_Guia)
                        .input('serie',mssql.VarChar(250), filas_detalle[j].Serie_Guia)
                        .input('numero',mssql.VarChar(250), filas_detalle[j].Numero_Guia)
                        .input('iten_guia',mssql.VarChar(250), '0')
                        .input('cta_diferencia',mssql.VarChar(250), filas_detalle[j].Si_Diferencia)
                        .input('cuenta_trans',mssql.VarChar(250), filas_detalle[j].Es_Transferencia)
                        .input('item_transferencia',mssql.VarChar(250), filas_detalle[j].Item_Transferencia)
                        .input('tipo_origen',mssql.VarChar(250), filas_detalle[j].Tipo_Origen)
                        .input('pago_mn',mssql.VarChar(250), '0')
                        .input('pago_me',mssql.VarChar(250), '0')
                        .input('pago_rt',mssql.VarChar(250), '0')
                        .input('cta_detracion',mssql.VarChar(250), Si_Detraccion == ''|| Si_Detraccion == 'N'? 'N': 'S')
                        .input('cta_retencion',mssql.VarChar(250), filas_detalle[j].Si_Retencion == ''? 'N': 'S')
                        .input('cta_percepcion',mssql.VarChar(250), filas_detalle[j].Si_Percepcion == ''? 'N': 'S')
                        .input('CCOD_BANCO',mssql.VarChar(250), '00')
                        .input('CCOD_SIT_LETRA',mssql.VarChar(250), '00')
                        .input('NRO_UNICO',mssql.VarChar(250), '')
                        .input('erp_codven',mssql.VarChar(250), filas_detalle[j].Vendedor)
                        .input('erp_forpag',mssql.VarChar(250), filas_detalle[j].Forma_Pago)
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
                        .input('erp_codven2',mssql.VarChar(250), filas_detalle[j].Vendedor2 == null? '00': filas_detalle[j].Vendedor2)
                        .input('erp_cta_costo_sn',mssql.VarChar(250), 'N')
                        .input('clasif_bien_servicio',mssql.VarChar(250), '')
                        .input('cta_retencion_no_domic',mssql.VarChar(250), '')
                        .input('rt_aplica_no_domic',mssql.VarChar(250), '')
                        .input('retencion_s_n',mssql.VarChar(250), '')
                        .input('retencion_porcent',mssql.VarChar(250), '0')
                        .input('retencion_doc_serie',mssql.VarChar(250), '')
                        .input('retencion_doc_numero',mssql.VarChar(250), '')
                        .input('ccod_articulo',mssql.VarChar(250), filas_detalle[j].Codigo_Articulo_Referencia)
                        .input('nitem_ref',mssql.VarChar(250), filas_detalle[j].Item_Articulo_Referencia)
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
                
                if(req.body.automatico == "A") {
                    numero_correlativo = req.body.numero_correlativo.substr(-4) - 1

                    const request_automatico = new mssql.Request(transaction);
                    await request_automatico 
                    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
                    .input('ejercicio', mssql.VarChar(250), req.body.ejercicio)
                    .input('periodo', mssql.VarChar(250), req.body.periodo)
                    .input('subvoucher', mssql.VarChar(250), req.body.codigo_subvoucher)
                    .input('Ultimo_numero', mssql.VarChar(250), numero_correlativo)
                    .query("update Hpernume SET NUM_ULTCOMP = @Ultimo_numero WHERE CCOD_EMPRESA= @codigo_empresa  \n"+  
                    " and EJERCON= @ejercicio and PERIODO_CON= @periodo  and CCOD_SVOUCHER= @subvoucher ")
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
        
        const pool = await poolPromise;
        const transaction = await new mssql.Transaction(pool);
        
        await transaction.begin(async err => {
            try{
                const request_anular_detalle_contabilidad  = new mssql.Request(transaction);
                await request_anular_detalle_contabilidad
                .input('ccod_empresa', mssql.VarChar(250), codigo_empresa)
                .input('ejercon', mssql.VarChar(250), req.body.ejercicio)
                .input('periodo_con', mssql.VarChar(250), req.body.periodo)
                .input('ccod_svoucher', mssql.VarChar(250), req.body.codigo_subvoucher)
                .input('cnum_doc', mssql.VarChar(250), req.body.numero_correlativo)
                .query("update hmovcond SET \n"+
                " debe = 0 , \n"+
                " haber = 0 , \n"+
                " mndebe = 0 , \n"+
                " mnhaber = 0 , \n"+
                " medebe = 0 , \n"+
                " mehaber = 0 \n"+
                " WHERE  ccod_empresa = @ccod_empresa and ejercon = @ejercon and \n"+
                " periodo_con = @periodo_con and ccod_svoucher = @ccod_svoucher and cnum_doc = @cnum_doc")

                const request_anular_cabecera_contabilidad = new mssql.Request(transaction);
                await request_anular_cabecera_contabilidad 
                .input('ccod_empresa', mssql.VarChar(250), codigo_empresa)
                .input('ejercon', mssql.VarChar(250), req.body.ejercicio)
                .input('periodo_con', mssql.VarChar(250), req.body.periodo)
                .input('ccod_svoucher', mssql.VarChar(250), req.body.codigo_subvoucher)
                .input('cnum_doc', mssql.VarChar(250), req.body.numero_correlativo)
                .query("update hmovconc SET \n"+
                " estado ='Anulado' , \n"+
                " erp_percepcion_mn =0 , \n"+
                " importe_mn =0 , \n"+
                " detraccion_mn =0 , \n"+
                " erp_percepcion_me =0 , \n"+
                " importe_me =0 , \n"+
                " detraccion_me =0 , \n"+
                " nimporte =0 \n"+
                " WHERE  ccod_empresa = @ccod_empresa and ejercon = @ejercon and \n"+
                " periodo_con = @periodo_con and ccod_svoucher = @ccod_svoucher and cnum_doc = @cnum_doc \n")

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

router.get('/reporte_anexos',isLoggedin,async (req, res) => {
    res.render("modulos/contabilidad/reporte_anexos");
});

router.post('/reporte/reporte_anexos', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa
        const codigo_punto_venta = req.user.codigo_punto_venta;
        
        var columnas = {
            codigo_anexo: "hmovcond.ccod_auxiliar",
            Nombre_Anexo: "hmovcond.cnom_auxiliar",
            tipo: "hmovcond.ctip_docref",
        }
        var agrupacion1_valores = req.body.agrupacion1_valores;
        var agrupacion2_valores = req.body.agrupacion2_valores;
        var agrupacion3_valores = req.body.agrupacion3_valores;
        var agrupacion1_tipo = req.body.agrupacion1_tipo;
        var agrupacion2_tipo = req.body.agrupacion2_tipo;
        var agrupacion3_tipo = req.body.agrupacion3_tipo;

        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('tipo_anexo', mssql.VarChar(10), req.body.tipo_anexo)
        .input('filtros_cuenta', mssql.VarChar(200), req.body.filtros_cuenta)
        .input('filtros_anexo', mssql.VarChar(200), req.body.filtros_anexo)
        .input('ejercicio', mssql.VarChar(20), req.body.ejercicio)
        .input('fecha_inicio', mssql.VarChar(20), req.body.fecha_inicio)
        .input('fecha_final', mssql.VarChar(20), req.body.fecha_final)
        .query(
            "select \n"+
            "RTRIM(LTRIM(periodo)) as periodo, \n"+
            "RTRIM(LTRIM(voucher_contable)) as voucher_contable, \n"+
            "RTRIM(LTRIM(numero_contable)) as numero_contable, \n"+
            "RTRIM(LTRIM(codigo_anexo)) as codigo_anexo, \n"+
            "Nombre_Anexo, \n"+
            "tipo_doc as tipo, \n"+
            "serie_doc as serie, \n"+
            "numero_doc as numero, \n"+
            "Codigo_Forma_Pago, \n"+
            "Forma_Pago, \n"+
            "Rtrim(Ltrim(cod_vendedor)) as vendedor_codigo, \n"+
            "NombreVendedor as vendedor_nombre, \n"+
            "CONVERT(VARCHAR(50),fecha_contable,103) AS fecha_contable, \n"+
            "CONVERT(VARCHAR(50),fecha_emision,103) AS fecha_emision, \n"+
            "CONVERT(VARCHAR(50),fecha_vencimiento,103) AS fecha_vencimiento, \n"+
            "dias_vencidos as dias_vencidos, \n"+
            "moneda_doc as moneda_documento, \n"+
            "tc, \n"+
            "abs(round(importe_soles,2)) as importe_soles, \n"+
            "abs(round(pago_soles,2)) as pago_soles, \n"+
            "abs(round(importe_soles,2)) - abs(round(pago_soles,2)) as saldo_soles, \n"+
            "abs(round(importe_dolares,2)) as importe_dolares, \n"+
            "abs(round(pago_dolares,2)) as pago_dolares, \n"+
            "abs(round(importe_dolares,2)) - abs(round(pago_dolares,2)) as saldo_dolares, \n"+
            "case when dias_vencidos < 0 then case @moneda_reporte when 'S/' then abs(round(importe_soles,2)) - abs(round(pago_soles,2)) else abs(round(importe_dolares,2)) - abs(round(pago_dolares,2)) end else 0 end as vencidos, \n"+
            "case when dias_vencidos <= 0 and dias_vencidos >=-30 then case @moneda_reporte when 'S/' then abs(round(importe_soles,2)) - abs(round(pago_soles,2)) else abs(round(importe_dolares,2)) - abs(round(pago_dolares,2)) end else 0 end as '0-30', \n"+
            "case when dias_vencidos <= -31 and dias_vencidos >=-60 then case @moneda_reporte when 'S/' then abs(round(importe_soles,2)) - abs(round(pago_soles,2)) else abs(round(importe_dolares,2)) - abs(round(pago_dolares,2)) end else 0 end as '31-60', \n"+
            "case when dias_vencidos <= -61 and dias_vencidos >=-90 then case @moneda_reporte when 'S/' then abs(round(importe_soles,2)) - abs(round(pago_soles,2)) else abs(round(importe_dolares,2)) - abs(round(pago_dolares,2)) end else 0 end as '61-90', \n"+
            "case when dias_vencidos <= -91 then case @moneda_reporte when 'S/' then abs(round(importe_soles,2)) - abs(round(pago_soles,2)) else abs(round(importe_dolares,2)) - abs(round(pago_dolares,2)) end else 0 end as '91 a mas', \n"+
            "@moneda_reporte as moneda, \n"+
            "case @moneda_reporte when 'S/' then abs(round(importe_soles,2)) - abs(round(pago_soles,2)) else abs(round(importe_dolares,2)) - abs(round(pago_dolares,2)) end as conversion, \n"+
            "case @moneda when 'S/' then abs(round(importe_soles,2)) - abs(round(pago_soles,2)) else abs(round(importe_dolares,2)) - abs(round(pago_dolares,2)) end as importe_a_pagar, \n"+
            "glosa, \n"+
            "banco, \n"+
            "sit_letra, \n"+
            "nro_unico, \n"+
            "Empresa, \n"+
            "Ruc_empresa, \n"+
            "credito_soles, \n"+
            "credito_dolares, \n"+
            "Gestor_Nombre, \n"+
            "Motivo_Nombre, \n"+
            "RTRIM(LTRIM(Ciudad)) as Ciudad, \n"+
            "RTRIM(LTRIM(Departamento)) as Departamento, \n"+
            "RTRIM(LTRIM(Distrito)) as Distrito, \n"+
            "Rubro, \n"+
            "situacion1, \n"+
            "situacion2, \n"+
            "Zona1, \n"+
            "Zona2, \n"+
            "@moneda as MonedaConvert, \n"+
            "Cuenta_Contable, \n"+
            "NombreDocumento, \n"+
            "NombreRubro, \n"+
            "CodigoBancos, \n"+
            "CodSituacionLetra, \n"+
            "CodigoGestor, \n"+
            "Codigo_Motivo_Tram, \n"+
            "Codigo_Rubro, \n"+
            "CodDistrito, \n"+
            "CodigoCiudad, \n"+
            "CodigoDepartamento, \n"+
            "CodigoPais \n"+
            ",Cencos \n"+
            ",Ot \n"+
            ",Uni_Neg \n"+
            "from ( \n"+
            "select \n"+
            "hmovcond.periodo_con AS periodo, \n"+
            "hmovcond.ccod_svoucher AS voucher_contable, \n"+
            "hmovcond.cnum_doc AS numero_contable, \n"+
            "Hanexos.ccod_anexo AS codigo_anexo, \n"+
            "Hanexos.cnom_anexo AS Nombre_Anexo, \n"+
            "Hmovcond.ctip_docref AS tipo_doc, \n"+
            "hmovcond.cnum_serieref AS serie_doc, \n"+
            "hmovcond.cnum_docref AS numero_doc, \n"+
            "hmovcond.erp_codven AS cod_vendedor, \n"+
            "hmovconc.dfecha_doc AS fecha_contable, \n"+
            "hmovcond.dfechadocref AS fecha_emision, \n"+
            "hmovcond.fecha_vencimiento AS fecha_vencimiento, \n"+
            "datediff(day,getdate() , case hmovcond.fecha_vencimiento when '1900-01-01 00:00:00.000' then hmovcond.dfechadocref else hmovcond.fecha_vencimiento end ) as dias_vencidos, \n"+
            "hmovcond.cmoneda_docref AS moneda_doc, \n"+
            "hmovconc.tipo_cambio AS tc, \n"+
            "case hmovcond.d_h when 'D' then hmovcond.mndebe else hmovcond.mnhaber end as importe_soles, \n"+
            "case hmovcond.d_h when 'D' then hmovcond.medebe else hmovcond.mehaber end as importe_dolares, \n"+
            "isnull((select \n"+
            "sum(case when d2.d_h='D' then d2.mndebe else d2.mnhaber end) \n"+
            "from HMOVCOND as d2 INNER JOIN Hmovconc as c2 ON \n"+
            "d2.ccod_empresa = c2.ccod_empresa and \n"+
            "d2.ejercon = c2.ejercon  and \n"+
            "d2.periodo_con = c2.periodo_con and \n"+
            "d2.ccod_svoucher = c2.ccod_svoucher and \n"+
            "d2.cnum_doc = c2.cnum_doc \n"+
            "where \n"+
            "d2.ccod_empresa=c2.ccod_empresa \n"+
            "and d2.ctip_auxiliar=hmovcond.ctip_auxiliar \n"+
            "and d2.ccod_auxiliar=hmovcond.ccod_auxiliar \n"+
            "and d2.ctip_docref=hmovcond.ctip_docref \n"+
            "and d2.cnum_serieref=hmovcond.cnum_serieref \n"+
            "and d2.cnum_docref=hmovcond.cnum_docref \n"+
            "and d2.ejercon = hmovcond.ejercon \n"+
            "and c2.estado <> 'Anulado' \n"+
            "and d2.tipo_origen ='F') ,0) \n"+
            "as pago_soles, \n"+
            "isnull((select \n"+
            "sum(case when d2.d_h='D' then d2.medebe else d2.mehaber end) \n"+
            "from HMOVCOND as d2 INNER JOIN Hmovconc as c2 ON \n"+
            "d2.ccod_empresa = c2.ccod_empresa and \n"+
            "d2.ejercon = c2.ejercon  and \n"+
            "d2.periodo_con = c2.periodo_con and \n"+
            "d2.ccod_svoucher = c2.ccod_svoucher and \n"+
            "d2.cnum_doc = c2.cnum_doc \n"+
            "where \n"+
            "d2.ccod_empresa=hmovcond.ccod_empresa \n"+
            "and d2.ctip_auxiliar=hmovcond.ctip_auxiliar \n"+
            "and d2.ccod_auxiliar=hmovcond.ccod_auxiliar \n"+
            "and d2.ctip_docref=hmovcond.ctip_docref \n"+
            "and d2.cnum_serieref=hmovcond.cnum_serieref \n"+
            "and d2.cnum_docref=hmovcond.cnum_docref \n"+
            "and d2.ejercon = hmovcond.ejercon \n"+
            "and c2.estado <> 'Anulado' \n"+
            "and d2.tipo_origen ='F') ,0) \n"+
            "as pago_dolares, \n"+
            "hbancos.cnom_banco AS banco, \n"+
            "hsit_let.cnom_situac_letra AS sit_letra, \n"+
            "hmovcond.nro_unico, \n"+
            "hmovcond.ccuenta as Cuenta_Contable, \n"+
            "hfor_pag.cnom_forpago AS Forma_Pago, \n"+
            "Hempresa.crazonsocial AS Empresa, \n"+
            "Hempresa.cnum_ruc AS Ruc_empresa, \n"+
            "(Select nlinea_credito_mn from hcliente WITH(NOLOCK) where \n"+
            "ccod_empresa = hmovconc.ccod_empresa and ccod_cliente = Hanexos.ccod_anexo) as credito_soles, \n"+
            "(Select nlinea_credito_me from hcliente WITH(NOLOCK) where \n"+
            "ccod_empresa = hmovconc.ccod_empresa and ccod_cliente = Hanexos.ccod_anexo) as credito_dolares, \n"+
            "isnull (erp_gestor_cobranza.erp_nomgestor,'Ninguno') Gestor_Nombre, \n"+
            "isnull(erp_motivos_tramite.erp_nommot,'Ninguno') Motivo_Nombre, \n"+
            "upper(hciudad.cnom_ciudad) as Ciudad, \n"+
            "upper(hdepto.cnom_departamento) as Departamento, \n"+
            "upper(hdistrit.cnom_distrito) as Distrito, \n"+
            "(CASE @tipo_anexo when '12' then \n"+
            "(select LTRIM(rtrim(erp_rubro_cliente.erp_nomrubro)) FROM HCLIENTE WITH(NOLOCK) inner join erp_rubro_cliente WITH(NOLOCK) on \n"+
            "erp_rubro_cliente.erp_codemp = hcliente.ccod_empresa and erp_rubro_cliente.erp_codrubro = hcliente.erp_codrubro \n"+
            "where hcliente.ccod_empresa=@codigo_empresa and hcliente.ccod_cliente=Hanexos.ccod_anexo ) \n"+
            "else '' end) as Rubro, \n"+
            "(CASE @tipo_anexo when '12' then \n"+
            "(select LTRIM(rtrim(Hsituacion_cliente.nombre)) FROM HCLIENTE WITH(NOLOCK) inner join Hsituacion_cliente WITH(NOLOCK) on \n"+
            "Hsituacion_cliente.ccod_empresa = hcliente.ccod_empresa and Hsituacion_cliente.codigo = hcliente.situacion \n"+
            "where hcliente.ccod_empresa=@codigo_empresa and hcliente.ccod_cliente=Hanexos.ccod_anexo ) \n"+
            "else '' end) as situacion1, \n"+
            "(CASE @tipo_anexo when '12' then \n"+
            "(select LTRIM(rtrim(Erp_Situacion_02.erp_nombre)) FROM HCLIENTE WITH(NOLOCK) inner join Erp_Situacion_02 WITH(NOLOCK) on \n"+
            "Erp_Situacion_02.erp_ccodemp = hcliente.ccod_empresa and Erp_Situacion_02.erp_codigo = hcliente.erp_situacion_2 \n"+
            "where hcliente.ccod_empresa=@codigo_empresa and hcliente.ccod_cliente=Hanexos.ccod_anexo ) \n"+
            "else '' end) as situacion2, \n"+
            "hzona.cnom_zona as Zona1, \n"+
            "erp_zona_02.erp_nombre as Zona2, \n"+
            "Hvended.cnom_vendedor as NombreVendedor, \n"+
            "upper(Htipdoc.cnom_doc) as NombreDocumento, \n"+
            "upper(Erp_Rubro_Cliente.Erp_nomrubro) as NombreRubro, \n"+
            "ccod_forpago as Codigo_Forma_Pago, \n"+
            "hbancos.ccod_banco as CodigoBancos, \n"+
            "rtrim(ltrim(hsit_let.ccod_situac_letra)) as CodSituacionLetra, \n"+
            "erp_gestor_cobranza.erp_codgestor as CodigoGestor, \n"+
            "erp_motivos_tramite.erp_codmot as Codigo_Motivo_Tram, \n"+
            "Erp_Rubro_Cliente.erp_codrubro as Codigo_Rubro, \n"+
            "hanexos.distrito as CodDistrito, \n"+
            "hanexos.cciudad as CodigoCiudad, \n"+
            "hanexos.departamento as CodigoDepartamento, \n"+
            "hanexos.pais as CodigoPais, \n"+
            "Hmovconc.ctip_auxiliar as tipoAuxiliar \n"+
            ",ltrim(rtrim(Hcencos.ccod_cencos))+' - '+ltrim(rtrim(Hcencos.cnom_cencos)) as Cencos \n"+
            ",ltrim(rtrim(Horden_trabajo.ccod_ot))+' - '+ltrim(rtrim(Horden_trabajo.cnom_ot)) as Ot \n"+
            ",ltrim(rtrim(erp_unidad_negocio.erp_codune))+' - '+ltrim(rtrim(erp_unidad_negocio.erp_nomune)) as Uni_Neg \n"+
            ", hmovconc.glosa \n"+
            "FROM Hmovconc WITH(NOLOCK) Inner join Hmovcond WITH(NOLOCK) ON \n"+
            "Hmovcond.ccod_empresa = hmovconc.ccod_empresa and \n"+
            "Hmovcond.ejercon = hmovconc.ejercon and \n"+
            "Hmovcond.periodo_con = hmovconc.periodo_con and \n"+
            "Hmovcond.ccod_svoucher = hmovconc.ccod_svoucher and \n"+
            "Hmovcond.cnum_doc= hmovconc.cnum_doc \n"+
            "INNER JOIN Hanexos WITH(NOLOCK) ON \n"+
            "Hmovcond.ccod_empresa = hanexos.ccod_empresa and \n"+
            "Hmovcond.ctip_auxiliar = hanexos.ctip_auxiliar and \n"+
            "Hmovcond.ccod_auxiliar = hanexos.ccod_anexo \n"+
            "INNER JOIN Hbancos WITH(NOLOCK) ON \n"+
            "Hmovconc.ccod_empresa=Hbancos.ccod_empresa and \n"+
            "Hmovcond.ccod_banco = Hbancos.ccod_banco \n"+
            "INNER JOIN Hsit_let WITH(NOLOCK) ON \n"+
            "Hmovcond.ccod_empresa = Hsit_let.ccod_empresa and \n"+
            "hmovcond.ccod_sit_letra = Hsit_let.ccod_situac_letra \n"+
            "INNER JOIN Hvended WITH(NOLOCK) ON \n"+
            "hmovcond.ccod_empresa = Hvended.ccod_empresa and \n"+
            "hmovcond.erp_codven = Hvended.ccod_vendedor \n"+
            "INNER JOIN Htipdoc WITH(NOLOCK) ON \n"+
            "hmovcond.ccod_empresa = Htipdoc.ccod_empresa and \n"+
            "hmovcond.ctip_docref = Htipdoc.ctip_doc \n"+
            "INNER JOIN Hfor_Pag WITH(NOLOCK) ON \n"+
            "hmovcond.ccod_empresa = Hfor_Pag.ccod_empresa and \n"+
            "hmovcond.erp_forpag = hfor_pag.ccod_forpago \n"+
            "INNER JOIN hempresa WITH(NOLOCK) ON \n"+
            "hmovcond.ccod_empresa = Hempresa.ccod_empresa \n"+
            "Inner Join Hplancon WITH(NOLOCK) On \n"+
            "Hmovcond.ccod_empresa = Hplancon.ccod_empresa and \n"+
            "Hmovcond.ccuenta = Hplancon.ccuenta \n"+
            "LEFT join hciudad WITH(NOLOCK) on \n"+
            "hempresa.ccod_empresa=hciudad.ccod_empresa and \n"+
            "hanexos.pais=hciudad.ccod_pais and \n"+
            "hanexos.departamento=hciudad.ccod_departamento and \n"+
            "hanexos.cciudad=hciudad.ccod_ciudad \n"+
            "left join hdepto WITH(NOLOCK) on \n"+
            "hempresa.ccod_empresa=hdepto.ccod_empresa and \n"+
            "hanexos.pais=hdepto.ccod_pais and \n"+
            "hanexos.departamento=hdepto.ccod_departamento \n"+
            "left join hdistrit WITH(NOLOCK) on \n"+
            "hempresa.ccod_empresa=hdistrit.ccod_empresa and \n"+
            "hanexos.pais=hdistrit.ccod_pais and \n"+
            "hanexos.departamento=hdistrit.ccod_departamento and \n"+
            "hanexos.cciudad=hdistrit.ccod_ciudad and \n"+
            "hanexos.distrito=hdistrit.ccod_distrito \n"+
            "left join erp_rubro_cliente WITH(NOLOCK) on \n"+
            "hanexos.ccod_empresa=erp_rubro_cliente.erp_codemp and \n"+
            "hanexos.rubro=erp_rubro_cliente.erp_codrubro \n"+
            "left join hzona WITH(NOLOCK) on \n"+
            "hanexos.ccod_empresa=hzona.ccod_empresa and \n"+
            "hanexos.zona1=hzona.ccod_zona \n"+
            "left join erp_zona_02 WITH(NOLOCK) on \n"+
            "hanexos.ccod_empresa=erp_zona_02.erp_codemp and \n"+
            "hanexos.zona2=erp_zona_02.erp_codzona \n"+
            "Left Join erp_gestor_cobranza WITH(NOLOCK) On \n"+
            "erp_gestor_cobranza.erp_codemp = Hmovconc.ccod_empresa and \n"+
            "erp_gestor_cobranza.erp_codgestor = Hmovconc.erp_gestor \n"+
            "Left join erp_motivos_tramite WITH(NOLOCK) On \n"+
            "erp_motivos_tramite.erp_codemp = Hmovconc.ccod_empresa and \n"+
            "erp_motivos_tramite.erp_codmot = Hmovconc.erp_motivo_venta \n"+
            "left join hcliente WITH(NOLOCK) on \n"+
            "hcliente.ccod_empresa=hanexos.ccod_empresa and \n"+
            "hcliente.ccod_cliente=hanexos.ccod_anexo \n"+
            "INNER JOIN Hcencos WITH(NOLOCK) ON \n"+
            "Hmovcond.ccod_empresa = Hcencos.ccod_empresa and \n"+
            "hmovcond.ccod_cencos = Hcencos.ccod_cencos \n"+
            "INNER JOIN Horden_trabajo WITH(NOLOCK) ON \n"+
            "Hmovcond.ccod_empresa = Horden_trabajo.ccod_empresa and \n"+
            "hmovcond.ot = Horden_trabajo.ccod_ot \n"+
            "INNER JOIN erp_unidad_negocio WITH(NOLOCK) ON \n"+
            "Hmovcond.ccod_empresa = erp_unidad_negocio.erp_codemp and \n"+
            "hmovcond.erp_codune = erp_unidad_negocio.erp_codune \n"+
            "where Hmovconc.ccod_empresa = @codigo_empresa \n"+
            "and Hmovcond.ctip_auxiliar = @tipo_anexo \n"+
            "and Hmovconc.estado <> 'Anulado' \n"+
            "and hmovcond.tipo_origen = 'I' \n"+
            "and ((CASE @filtro_tipo_fecha when 'E' then hmovcond.dfechadocref \n"+
            "when 'V' then hmovcond.fecha_vencimiento \n"+
            "when 'R' then hmovconc.dfecha_doc \n"+
            "END) >= @fecha_inicio \n"+
            "and (CASE @filtro_tipo_fecha when 'E' then hmovcond.dfechadocref \n"+
            "when 'V' then hmovcond.fecha_vencimiento \n"+
            "when 'R' then hmovconc.dfecha_doc \n"+
            "END) <= @fecha_final) \n"+
            (agrupacion1_valores == "" ? "" : "and "+columnas[agrupacion1_tipo]+" in ("+agrupacion1_valores +") \n")+
            (agrupacion2_valores == "" ? "" : "and "+columnas[agrupacion2_tipo]+" in ("+agrupacion2_valores +") \n")+
            (agrupacion3_valores == "" ? "" : "and "+columnas[agrupacion3_tipo]+" in ("+agrupacion3_valores +") \n")+
            ") as TB1 \n"+
            "where \n"+
            "case @filtro_tipo_estado when 'Todos' then 'Todos' when 'Pendientes' then 'Pendientes' when 'Pagados' then 'Pagados' else '0' end \n"+
            "= \n"+
            "case @filtro_tipo_estado when 'Todos' then 'Todos' \n"+
            "when 'Pendientes' then \n"+
            "case when abs(round(importe_soles,2)) - abs(round(pago_soles,2)) > 0 then 'Pendientes' else '1' end \n"+
            "when 'Pagados' then \n"+
            "case when abs(round(importe_soles,2)) - abs(round(pago_soles,2)) = 0 then 'Pagados' else '1' end \n"+
            "else '0' end \n"+
            "ORDER BY \n"+
            (agrupacion1_tipo != 'Ninguno' ? agrupacion1_tipo +",": "") +
            (agrupacion2_tipo != 'Ninguno' ? agrupacion2_tipo +",": "") +
            (agrupacion3_tipo != 'Ninguno' ? agrupacion3_tipo +",": "") +
            "fecha_vencimiento asc \n"
        ); 
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

module.exports = router;


