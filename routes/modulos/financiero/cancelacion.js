const express = require('express');
const router = express.Router();
const {isLoggedin} = require('../../../lib/auth');
const {poolPromise, mssql} = require ('../../../database');
const helpers = require('../../../lib/helpers');

router.get('/cancelacion',isLoggedin,async (req, res) => {
    res.render("modulos/financiero/cancelacion");
});

router.get('/cheque_voucher',isLoggedin,async (req, res) => {
    res.render("modulos/financiero/cheque_voucher");
});

router.post('/guardar', async (req,res)=>{
    try{
        const codigo_empresa = req.user.codigo_empresa;
        const usuario = req.user.codigo_usuario;
        var filas_detalle = JSON.parse(req.body.filas_detalle)

        var fecha_contabilidad =  new Date(req.body.fecha_registro.replace("-", "/"));
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
                .input('ejercicio', mssql.VarChar(250),yyyy)
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
                .input('ejercon', mssql.VarChar(250), yyyy)
                .input('periodo_con', mssql.VarChar(250), req.body.periodo)
                .input('ccod_svoucher', mssql.VarChar(250), req.body.codigo_subvoucher)
                .input('cnum_doc', mssql.VarChar(250), numero_correlativo_contabilidad)
                .input('automatico', mssql.VarChar(250), req.body.automatico)
                .input('dfecha_doc', mssql.Date, req.body.fecha_registro)
                .input('fecha_referencia', mssql.Date, req.body.fecha_referencia2)
                .input('tipo2', mssql.VarChar(250), req.body.tipo_referencia2)
                .input('serie2', mssql.VarChar(250), req.body.serie_referencia2)
                .input('numero2', mssql.VarChar(250), req.body.numero_referencia2)
                .input('dfecha_docref', mssql.Date, req.body.fecha_referencia1)
                .input('ctip_docref', mssql.VarChar(250), req.body.tipo_referencia1)
                .input('cserie_docref', mssql.VarChar(250), req.body.serie_referencia1)
                .input('cnum_docref', mssql.VarChar(250), req.body.numero_referencia1)
                .input('ctip_auxiliar', mssql.VarChar(250), req.body.tipo_codigo_auxiliar)
                .input('ccod_anexo', mssql.VarChar(250), req.body.codigo_anexo)
                .input('cnom_anexo', mssql.VarChar(250), req.body.nombre_anexo)
                .input('cmoneda', mssql.VarChar(250), req.body.moneda)
                .input('ctip_cambio', mssql.VarChar(250), req.body.tipo_cambio)
                .input('tipo_cambio', mssql.VarChar(250), req.body.tasa_cambio)
                .input('tc_ref', mssql.VarChar(250), '0')
                .input('tipo_registro', mssql.VarChar(250), 'ST')
                .input('glosa', mssql.VarChar(250), req.body.glosa)
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
                .input('cnum_ctacte', mssql.VarChar(250), req.body.codigo_caja_banco)
                .input('ing_egr', mssql.VarChar(250), req.body.ingresos_egresos)
                .input('caj_ban', mssql.VarChar(250), req.body.tipo_caja_banco)
                .input('n_planilla', mssql.VarChar(250), req.body.numero_operacion)
                .input('cobrador', mssql.VarChar(250), req.body.codigo_cobrador)
                .input('SN_diferida', mssql.VarChar(250), 'N')
                .input('fecha_diferida', mssql.Date, '1900/01/01')
                .input('fecha_ref2', mssql.Date, req.body.fecha_referencia2)
                .input('erp_forpag', mssql.VarChar(250), '00')
                .input('erp_percepcion_mn', mssql.VarChar(250), 0)
                .input('erp_percepcion_me', mssql.VarChar(250), 0)
                .input('erp_cierre_caj_s_n', mssql.VarChar(250), 'N')
                .input('erp_resp_cierre', mssql.VarChar(250), '00')
                .input('erp_fecha_cierre', mssql.Date, '1900/01/01')
                .input('erp_observacion_cierre', mssql.VarChar(250), '')
                .input('erp_responsable', mssql.VarChar(250), '00')
                .input('pc_user', mssql.VarChar(250), '')
                .input('pc_fecha', mssql.Date, req.body.fecha_registro)
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

                //#region Guardar Contabilidad Detalle

                // #region  grabar detalle
                var nitem = 0;
                for(var j=0;j<filas_detalle.length;j++){
                    var Si_Detraccion = filas_detalle[j].Si_Detraccion

                    nitem++;
                    var request_contabilidad_detalle  = new mssql.Request(transaction);
                    await request_contabilidad_detalle
                    .input('ccod_empresa',mssql.VarChar(250), codigo_empresa)
                    .input('ejercon',mssql.VarChar(250), yyyy)
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
                    .input('dfechadocref',mssql.Date,filas_detalle[j].Fecha_Referencia)
                    .input('tipodoc_2',mssql.VarChar(250), filas_detalle[j].Tipo2)
                    .input('seriedoc_2',mssql.VarChar(250), filas_detalle[j].Serie2)
                    .input('numdoc_2',mssql.VarChar(250), filas_detalle[j].Numero2)
                    .input('fechadoc_2',mssql.Date, filas_detalle[j].Fecha2)
                    .input('monto_ref',mssql.VarChar(250), '0')
                    .input('CMONEDA_DOCREF',mssql.VarChar(250), filas_detalle[j].Moneda_Referencia)
                    .input('TIPO_CAMBIO_DOCREF',mssql.VarChar(250), filas_detalle[j].Tipo_Cambio_Referencia)
                    .input('subvoucher_ref',mssql.VarChar(250), filas_detalle[j].SubVoucher_Referencia == "" ? '00':filas_detalle[j].SubVoucher_Referencia)
                    .input('fecha_vencimiento',mssql.Date, filas_detalle[j].Fecha_Vencimiento)
                    .input('glosa',mssql.VarChar(250), filas_detalle[j].Glosa)
                    .input('movimiento_guia',mssql.VarChar(250), filas_detalle[j].Movimiento_Guia)
                    .input('tipmov_guia',mssql.VarChar(250), filas_detalle[j].Tipo_Movimiento_Guia)
                    .input('serie',mssql.VarChar(250), filas_detalle[j].Serie_Guia)
                    .input('numero',mssql.VarChar(250), filas_detalle[j].Numero_Guia)
                    .input('iten_guia',mssql.VarChar(250), '0')
                    .input('cta_diferencia',mssql.VarChar(250), filas_detalle[j].Si_Diferencia)
                    .input('cuenta_trans',mssql.VarChar(250), filas_detalle[j].Es_Transferencia==""? 'N':filas_detalle[j].Es_Transferencia)
                    .input('item_transferencia',mssql.VarChar(250), filas_detalle[j].Item_Transferencia)
                    .input('tipo_origen',mssql.VarChar(250), filas_detalle[j].Tipo_Anexo == "00" ? 'N':filas_detalle[j].Tipo_Origen)
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
           " And movc.modulo_origen = 'C-B'\n"+
           " group by movc.ejercon, movc.periodo_con,  \n"+
           " movc.cnum_doc,  movc.dfecha_doc,\n"+
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
           " Order By movc.cnum_doc desc \n"
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
           " ('COMPROBANTE DE PAGO - '+ CASE movc.ing_egr When 'ING' THEN 'INGRESO' Else 'EGRESO' End) as documento_nombre, \n"+
           " movc.ing_egr as Documento_Ingreso_Egreso, \n"+
           " movc.ejercon as Documento_Ejercicio,  \n"+
           " movc.periodo_con as Documento_Periodo_Contable,  \n"+
           " movc.cnum_doc as Documento_Numero_Contable,  \n"+
           " CONVERT(VARCHAR,movc.dfecha_doc,23) as Documento_Fecha_Registro,  \n"+
           " CONVERT(VARCHAR,movc.dfecha_doc,103) as documento_fecha,  \n"+
           " CONVERT(VARCHAR,movc.fecha_diferida,103) as documento_fecha_diferida, \n"+
           " movc.automatico as Documento_Automatico,  \n"+
           " movc.tipo_registro as Documento_Tipo_Registro, \n"+ 
           " movc.ccod_svoucher as Documento_Codigo_Svoucher,  \n"+
           " movc.cmoneda as Documento_Moneda,                \n"+
           " movc.CMONEDA as documento_moneda,\n"+
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
           " movc.cnum_ctacte as Documento_Caja_Bancos,  \n"+
           " movc.base_con_mn as Documento_SubTotal_MN,  \n"+
           " movc.base_sin_mn as Documento_SubTotal_Mixto_MN,  \n"+
           " movc.igv_mn as Documento_Igv_MN,  \n"+
           " movc.importe_mn as Documento_Importe_MN,  \n"+
           " movc.n_planilla as Documento_Numero_Operacion, \n"+
           " movc.cobrador as Documento_Cobrador,  \n"+
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
           " movc.glosa as documento_glosa, \n"+
           " movc.dest_operacion as Documento_Destino_Operacion, \n"+
           " movc.tipo_cambio as  Documento_Tasa_Cambio,     \n"+
           " movc.tipo_cambio as  tipo_cambio,     \n"+
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
           " movc.Ip_pc as Documento_Ip_Pc,     \n"+
           " (movc.CTIP_DOCREF +' - '+ Htipdoc.cnom_doc) as forma_pago_nombre,     \n"+
           " (movc.CTIP_DOCREF +' - '+ movc.CSERIE_DOCREF +' - '+ movc.CNUM_DOCREF) as numero,     \n"+
           " CONVERT(VARCHAR,movc.dfecha_docref,103) as documento_fecha_referencia_c,   \n"+
           " --Detalle    \n"+
           " HMOVCOND.NITEM as Detalle_Item, \n"+
           " HMOVCOND.DEBE as Detalle_Debe, \n"+
           " HMOVCOND.HABER as Detalle_Haber, \n"+
           " HMOVCOND.CCUENTA as Detalle_Cuenta, \n"+
           " CASE HMOVCOND.CUENTA_TRANS WHEN 'N' Then 'Cuentas de Comprobante' Else 'Cuentas por Transferencia' End as Detalle_Cta_Transferencia, \n"+
           " HMOVCOND.CCOD_AUXILIAR as Detalle_Codigo_Auxiliar, \n"+
           " HMOVCOND.CNOM_AUXILIAR as Detalle_Nombre_Auxiliar, \n"+
           " HMOVCOND.CTIP_DOCREF as Detalle_Tipo_Ref2, \n"+
           " HMOVCOND.CNUM_SERIEREF as Detalle_Serie_Ref2, \n"+
           " HMOVCOND.CNUM_DOCREF as Detalle_Numero_Ref2, \n"+
           " HMOVCOND.CCOD_CENCOS as Detalle_Cencos, \n"+
           " HMOVCOND.OT as Detalle_Ot, \n"+
           " hmovcond.cta_diferencia as Detalle_Cta_diferencia, \n"+
           " hmovcond.cuenta_trans as Detalle_Cta_trans, \n"+
           " CONVERT(VARCHAR,Hmovcond.dfechadocref,103) as Detalle_Fecha_referencia_detalle, \n"+
           " Hmovcond.ccod_cencos as Detalle_Centro_costo_detalle, \n"+
           " dbo.udf_numero_letra(movc.nimporte) as documento_total_letras, \n"+
           " 0 as documento_total_productos, \n"+
           " '' as usuario_codigo, \n"+
           "(select SUM(debe)  from HMOVCOND  Where HMOVCOND.ccod_empresa = @ccod_empresa And \n"+
           " HMOVCOND.ejercon = @ejercicio And  \n"+
           " HMOVCOND.periodo_con = @periodo And  \n"+
           " HMOVCOND.cnum_doc = @numero_documento_contable And \n"+
           " HMOVCOND.ccod_svoucher = @subvoucher ) as documento_debe_t, \n"+
           "(select SUM(haber)  from HMOVCOND  Where HMOVCOND.ccod_empresa = @ccod_empresa And \n"+
           " HMOVCOND.ejercon = @ejercicio And  \n"+
           " HMOVCOND.periodo_con = @periodo And  \n"+
           " HMOVCOND.cnum_doc = @numero_documento_contable And \n"+
           " HMOVCOND.ccod_svoucher = @subvoucher  ) as documento_haber_t, \n"+
           "--Empresa\n"+
           " Hempresa.ccod_empresa as empresa_codigo, \n"+
           " Hempresa.crazonsocial as empresa_razon_social, \n"+
           " Hempresa.rutadelogo as empresa_ruta_logo, \n"+
           " Hempresa.fax_3 as empresa_logo, \n"+
           " hempresa.nro_cuenta_mn as empresa_cuenta1,\n"+
           " hempresa.nro_cuenta_me as empresa_cuenta2,\n"+
           " hempresa.ctelefono as empresa_telefono,\n"+
           " hempresa.cpag_web as empresa_web,\n"+
           " hempresa.cnum_ruc as empresa_ruc,\n"+
           " hempresa.cdireccion as empresa_direccion,\n"+
           " hempresa.cemail as empresa_correo,\n"+
           " 0 as articulo_cantidad, \n"+
           " 0 as articulo_precio, \n"+
           " 0 as articulo_igv, \n"+
           " 0 as articulo_importe \n"+

           " From hmovconc movc  \n"+
           " INNER JOIN HMOVCOND  \n"+
           " ON movc.CCOD_EMPRESA	= HMOVCOND.CCOD_EMPRESA AND \n"+
           " movc.EJERCON				= HMOVCOND.EJERCON AND \n"+
           " movc.PERIODO_CON		= HMOVCOND.PERIODO_CON AND \n"+
           " movc.CCOD_SVOUCHER	= HMOVCOND.CCOD_SVOUCHER AND \n"+
           " movc.CNUM_DOC			= HMOVCOND.CNUM_DOC  \n"+
           " INNER JOIN Hempresa on \n"+
           " movc.CCOD_EMPRESA = Hempresa.ccod_empresa\n"+
           " Inner Join Htipdoc \n"+
	       " On movc.ccod_empresa  =htipdoc.ccod_empresa and \n"+
		   " movc.ctip_docref  =htipdoc.ctip_doc  \n"+
           " Where movc.ccod_empresa = @ccod_empresa And \n"+
           " movc.ejercon = @ejercicio And  \n"+
           " movc.periodo_con = @periodo And  \n"+
           " movc.cnum_doc = @numero_documento_contable And \n"+
           " movc.ccod_svoucher = @subvoucher \n"
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

        var fecha_contabilidad =  new Date(req.body.fecha_registro.replace("-", "/"));
        var ejercicio = fecha_contabilidad.getFullYear();

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
                .input('ejercon', mssql.VarChar(250), ejercicio)
                .input('periodo_con', mssql.VarChar(250), req.body.periodo)
                .input('ccod_svoucher', mssql.VarChar(250), req.body.codigo_subvoucher)
                .input('cnum_doc', mssql.VarChar(250), req.body.numero_correlativo)
                .input('automatico', mssql.VarChar(250), req.body.automatico)
                .input('dfecha_doc', mssql.Date, req.body.fecha_registro)
                .input('fecha_referencia', mssql.Date, req.body.fecha_referencia2)
                .input('tipo2', mssql.VarChar(250), req.body.tipo_referencia2)
                .input('serie2', mssql.VarChar(250), req.body.serie_referencia2)
                .input('numero2', mssql.VarChar(250), req.body.numero_referencia2)
                .input('dfecha_docref', mssql.Date, req.body.fecha_referencia1)
                .input('ctip_docref', mssql.VarChar(250), req.body.tipo_referencia1)
                .input('cserie_docref', mssql.VarChar(250), req.body.serie_referencia1)
                .input('cnum_docref', mssql.VarChar(250), req.body.numero_referencia1)
                .input('ctip_auxiliar', mssql.VarChar(250), req.body.tipo_codigo_auxiliar)
                .input('ccod_anexo', mssql.VarChar(250), req.body.codigo_anexo)
                .input('cnom_anexo', mssql.VarChar(250), req.body.nombre_anexo)
                .input('cmoneda', mssql.VarChar(250), req.body.moneda)
                .input('ctip_cambio', mssql.VarChar(250), req.body.tipo_cambio)
                .input('tipo_cambio', mssql.VarChar(250), req.body.tasa_cambio)
                .input('tc_ref', mssql.VarChar(250), '0')
                .input('tipo_registro', mssql.VarChar(250), 'ST')
                .input('glosa', mssql.VarChar(250), req.body.glosa)
                .input('estado', mssql.VarChar(250), 'Modificado')
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
                .input('cnum_ctacte', mssql.VarChar(250), req.body.codigo_caja_banco)
                .input('ing_egr', mssql.VarChar(250), req.body.ingresos_egresos)
                .input('caj_ban', mssql.VarChar(250), req.body.tipo_caja_banco)
                .input('n_planilla', mssql.VarChar(250), req.body.numero_operacion)
                .input('cobrador', mssql.VarChar(250), req.body.codigo_cobrador)
                .input('SN_diferida', mssql.VarChar(250), 'N')
                .input('fecha_diferida', mssql.Date, '1900/01/01')
                .input('fecha_ref2', mssql.Date, req.body.fecha_referencia2)
                .input('erp_forpag', mssql.VarChar(250), '00')
                .input('erp_percepcion_mn', mssql.VarChar(250), 0)
                .input('erp_percepcion_me', mssql.VarChar(250), 0)
                .input('erp_cierre_caj_s_n', mssql.VarChar(250), 'N')
                .input('erp_resp_cierre', mssql.VarChar(250), '00')
                .input('erp_fecha_cierre', mssql.Date, '1900/01/01')
                .input('erp_observacion_cierre', mssql.VarChar(250), '')
                .input('erp_responsable', mssql.VarChar(250), '00')
                .input('pc_user', mssql.VarChar(250), '')
                .input('pc_fecha', mssql.Date, req.body.fecha_registro)
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
                    .input('ejercon', mssql.VarChar(250), ejercicio)
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
                        .input('ejercon',mssql.VarChar(250), ejercicio)
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
                        .input('subvoucher_ref',mssql.VarChar(250), filas_detalle[j].SubVoucher_Referencia == "" ? '00':filas_detalle[j].SubVoucher_Referencia)
                        .input('fecha_vencimiento',mssql.VarChar(250), filas_detalle[j].Fecha_Vencimiento)
                        .input('glosa',mssql.VarChar(250), filas_detalle[j].Glosa)
                        .input('movimiento_guia',mssql.VarChar(250), filas_detalle[j].Movimiento_Guia)
                        .input('tipmov_guia',mssql.VarChar(250), filas_detalle[j].Tipo_Movimiento_Guia)
                        .input('serie',mssql.VarChar(250), filas_detalle[j].Serie_Guia)
                        .input('numero',mssql.VarChar(250), filas_detalle[j].Numero_Guia)
                        .input('iten_guia',mssql.VarChar(250), '0')
                        .input('cta_diferencia',mssql.VarChar(250), filas_detalle[j].Si_Diferencia)
                        .input('cuenta_trans',mssql.VarChar(250), filas_detalle[j].Es_Transferencia==""? 'N':filas_detalle[j].Es_Transferencia)
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

        var fecha_contabilidad =  new Date(req.body.fecha_registro.replace("-", "/"));
        var ejercicio = fecha_contabilidad.getFullYear();
        
        const pool = await poolPromise;
        const transaction = await new mssql.Transaction(pool);
        
        await transaction.begin(async err => {
            try{
                const request_borrar_detalle_contabilidad  = new mssql.Request(transaction);
                await request_borrar_detalle_contabilidad
                .input('ccod_empresa', mssql.VarChar(250), codigo_empresa)
                .input('ejercon', mssql.VarChar(250), ejercicio)
                .input('periodo_con', mssql.VarChar(250), req.body.periodo)
                .input('ccod_svoucher', mssql.VarChar(250), req.body.codigo_subvoucher)
                .input('cnum_doc', mssql.VarChar(250), req.body.numero_correlativo)
                .query("delete from hmovcond where ccod_empresa = @ccod_empresa and ejercon = @ejercon and \n"+
                "periodo_con = @periodo_con and ccod_svoucher = @ccod_svoucher and cnum_doc = @cnum_doc ")

                const request_borrar_cabecera_contabilidad = new mssql.Request(transaction);
                await request_borrar_cabecera_contabilidad 
                .input('ccod_empresa', mssql.VarChar(250), codigo_empresa)
                .input('ejercon', mssql.VarChar(250), ejercicio)
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
                    .input('ejercicio', mssql.VarChar(250), ejercicio)
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

        var fecha_contabilidad =  new Date(req.body.fecha_registro.replace("-", "/"));
        var ejercicio = fecha_contabilidad.getFullYear();
        
        const pool = await poolPromise;
        const transaction = await new mssql.Transaction(pool);
        
        await transaction.begin(async err => {
            try{
                const request_anular_detalle_contabilidad  = new mssql.Request(transaction);
                await request_anular_detalle_contabilidad
                .input('ccod_empresa', mssql.VarChar(250), codigo_empresa)
                .input('ejercon', mssql.VarChar(250), ejercicio)
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
                .input('ejercon', mssql.VarChar(250), ejercicio)
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

module.exports = router;


