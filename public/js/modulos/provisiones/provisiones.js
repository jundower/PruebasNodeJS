var fecha_trabajo=new Date();
var short_fecha_trabajo="";
var url_motivo_tramites="/talonarios/motivos_serie_correlativo";
var url_cuenta_transferencia = "/plan_contable/transferencias";
var url_cuenta_icbper = "/plan_contable/icbper";
var url_configuracion_permisos;


var subvoucher = "subvoucher";
var guia_entrada = "guia_entrada";
var moneda = "moneda";
var tipo_documento_referencia = "tipo_documento_referencia";
var tipo_documento = "tipo_documento";
var fecha_emision = "fecha_emision"
var subtotal = "subtotal";
var subtotal_2 = "subtotal_2";
var detraccion_provisiones = "detraccion_provisiones";
var retencion_no_domiciliado = "retencion_no_domiciliado";
var fecha_registro = "fecha_registro";
var registro_compra_si = "registro_compra_si"
var registro_compra_no = "registro_compra_no";
var tipo_anexo = "tipo_anexo";
var tipo_cambio = "tipo_cambio";
var tasa_cambio = "tasa_cambio";
var serie_referencia = "serie_referencia";
var numero_referencia = "numero_referencia";
var serie = "serie";
var numero = "numero";
var dias = "dias";
var fecha_vencimiento = "fecha_vencimiento";
var mixta = "mixta";
var porcentaje_impuesto = "porcentaje_impuesto";
var mixta_2 = "mixta_2";
var detraccion_check = "detraccion_check";
var porcentaje_detraccion = "porcentaje_detraccion";
var percepcion_check = "percepcion_check";
var porcentaje_percepcion = "porcentaje_percepcion";
var retencion_check = "retencion_check";
var porcentaje_retencion = "porcentaje_retencion";
var ejercicio = "ejercicio";
var periodo = "periodo";
var automatico = "automatico";
var manual = "manual";
var numero_documento = "numero_documento";
var codigo_anexo = "codigo_anexo";
var nombre_anexo = "nombre_anexo";
var forma_pago = "forma_pago";
var fecha_referencia = "fecha_referencia";
var destino_operacion = "destino_operacion";
var clasificacion = "clasificacion";
var contabilizada = "contabilizada";
var manual_2 = "manual_2";
var no_costos = "no_costos";
var impuesto = "impuesto";
var icbper = "icbper";
var importe = "importe";
var impuesto_2 = "impuesto_2";
var icbper_2 = "icbper_2";
var importe_2 = "importe_2";
var percepcion = "percepcion";
var percepcion_2 = "percepcion_2";
var monto_detraccion = "monto_detraccion";
var monto_retencion = "monto_retencion";
var glosa = "glosa";
var Serie_Guia = "";
var Codigo_Punto_Venta = "";
Tipo_Documento_Guia = "";

var modal_ventana_lista = "modal_ventana_lista";

var jq_subvoucher;
var jq_guia_entrada;
var jq_moneda;
var jq_tipo_documento_referencia;
var jq_tipo_documento;
var jq_fecha_emision;
var jq_subtotal;
var jq_subtotal_2;
var jq_detraccion_provisiones;
var jq_retencion_no_domiciliado;
var jq_fecha_registro;
var jq_registro_compra_si;
var jq_registro_compra_no;
var jq_tipo_anexo;
var jq_tipo_cambio;
var jq_tasa_cambio;
var jq_serie_referencia;
var jq_numero_referencia;
var jq_serie;
var jq_numero;
var jq_dias;
var jq_fecha_vencimiento;
var jq_mixta;
var jq_porcentaje_impuesto;
var jq_mixta_2;
var jq_detraccion_check;
var jq_porcentaje_detraccion;
var jq_percepcion_check;
var jq_porcentaje_percepcion;
var jq_retencion_check;
var jq_porcentaje_retencion;
var jq_ejercicio;
var jq_periodo;
var jq_automatico;
var jq_manual;
var jq_numero_documento;
var jq_codigo_anexo;
var jq_nombre_anexo;
var jq_forma_pago;
var jq_fecha_referencia;
var jq_destino_operacion;
var jq_clasificacion;
var jq_contabilizada;
var jq_manual_2;
var jq_no_costos;
var jq_impuesto;
var jq_icbper;
var jq_importe;
var jq_impuesto_2;
var jq_icbper_2;
var jq_importe_2;
var jq_percepcion;
var jq_percepcion_2;
var jq_monto_detraccion;
var jq_monto_retencion;
var jq_glosa;

var modulo="";
var titulo="";
var parametros_contables="";
var pression;
var celdas_nuevas = [];
var jq_modal_ventana_lista;
var tipo_provision;

$(document).ready(function() {

    jq_modal_ventana_lista = $("#"+modal_ventana_lista);
   
    jq_subvoucher = $("#"+subvoucher);
    jq_guia_entrada = $("#"+guia_entrada);
    jq_moneda = $("#"+moneda);
    jq_tipo_documento_referencia = $("#"+tipo_documento_referencia);
    jq_tipo_documento = $("#"+tipo_documento);
    jq_fecha_emision = $("#"+fecha_emision);
    jq_subtotal = $("#"+subtotal);
    jq_subtotal_2 = $("#"+subtotal_2);
    jq_detraccion_provisiones = $("#"+detraccion_provisiones);
    jq_retencion_no_domiciliado = $("#"+retencion_no_domiciliado);
    jq_fecha_registro = $("#"+fecha_registro);
    jq_registro_compra_si = $("#"+registro_compra_si);
    jq_registro_compra_no = $("#"+registro_compra_no);
    jq_tipo_anexo = $("#"+tipo_anexo);
    jq_tipo_cambio = $("#"+tipo_cambio);
    jq_tasa_cambio = $("#"+tasa_cambio);
    jq_serie_referencia = $("#"+serie_referencia);
    jq_numero_referencia = $("#"+numero_referencia);
    jq_serie = $("#"+serie);
    jq_numero = $("#"+numero);
    jq_dias = $("#"+dias);
    jq_fecha_vencimiento = $("#"+fecha_vencimiento);
    jq_mixta = $("#"+mixta);
    jq_porcentaje_impuesto = $("#"+porcentaje_impuesto);
    jq_mixta_2 = $("#"+mixta_2);
    jq_detraccion_check = $("#"+detraccion_check);
    jq_porcentaje_detraccion = $("#"+porcentaje_detraccion);
    jq_percepcion_check = $("#"+percepcion_check);
    jq_porcentaje_percepcion = $("#"+porcentaje_percepcion);
    jq_retencion_check = $("#"+retencion_check);
    jq_porcentaje_retencion = $("#"+porcentaje_retencion);
    jq_ejercicio = $("#"+ejercicio);
    jq_periodo = $("#"+periodo);
    jq_automatico = $("#"+automatico);
    jq_manual = $("#"+manual);
    jq_numero_documento = $("#"+numero_documento);
    jq_codigo_anexo = $("#"+codigo_anexo);
    jq_nombre_anexo = $("#"+nombre_anexo);
    jq_forma_pago = $("#"+forma_pago);
    jq_fecha_referencia = $("#"+fecha_referencia);
    jq_destino_operacion = $("#"+destino_operacion);
    jq_clasificacion = $("#"+clasificacion);
    jq_contabilizada = $("#"+contabilizada);
    jq_manual_2 = $("#"+manual_2);
    jq_no_costos = $("#"+no_costos);
    jq_impuesto = $("#"+impuesto);
    jq_icbper = $("#"+icbper);
    jq_importe = $("#"+importe);
    jq_impuesto_2 = $("#"+impuesto_2);
    jq_icbper_2 = $("#"+icbper_2);
    jq_importe_2 = $("#"+importe_2);
    jq_percepcion = $("#"+percepcion);
    jq_percepcion_2 = $("#"+percepcion_2);
    jq_codigo_proveedor = $("#"+codigo_anexo);
    jq_monto_detraccion = $("#"+monto_detraccion);
    jq_monto_retencion = $("#"+monto_retencion);
    jq_glosa = $("#"+glosa);
    modulo = $("#modulo_cob_pag").val();
 
    titulo = (modulo=="cuentas_por_cobrar" ? 'Cuentas por Cobrar' : 'Cuentas por Pagar');
    modulo == "cuentas_por_cobrar" ? '': $("#clasificacion_si_no").show();
    modulo == "cuentas_por_cobrar" ? '': $("#retencion_si").show();
    modulo == "cuentas_por_cobrar" ? '': $("#retencion_si_2").show();
    tipo_provision = (modulo=="cuentas_por_cobrar" ? 'sist_ctas_x_cobrar' : 'sist_ctas_x_pagar');
    url_configuracion_permisos = '/configuraciones/configuracion_permisos/proceso_provisiones__'+tipo_provision+'__registro_comprobantes';

    jq_automatico.click(function() {
        cargar_correlativo();
    });
    jq_manual.click(function() {
        cargar_correlativo();
    });
    jq_tipo_documento.change(function() {
        
        if($(this).val()){
            cargar_porcentaje_impuesto_documento(jq_tipo_documento.val());
            var jq_grid = jq_grid_detalle_contable;
            var dataIDs = jq_grid.getDataIDs(); 
            dataIDs.forEach(rowid => {
                $("#lista_select_tipo_documento_"+rowid).val($(this).val());
            });
        }
        
        if ($(this).val() == '07') {
            var fila = 0
            var jq_grid = jq_grid_detalle_contable;
            var dataIDs = jq_grid.getDataIDs(); 
            dataIDs.forEach(rowid => {
                fila++
                jq_grid.jqGrid('setCell',rowid,"Debe",0);
                jq_grid.jqGrid('setCell',rowid,"Haber",0);
                jq_grid.jqGrid('setCell',rowid,"MnDebe",0);
                jq_grid.jqGrid('setCell',rowid,"MnHaber",0);
                jq_grid.jqGrid('setCell',rowid,"MeDebe",0);
                jq_grid.jqGrid('setCell',rowid,"MeHaber",0);
                if (fila == 1) {
                    var rowdata = jq_grid_detalle_contable.getRowData(rowid);
                    if (rowdata.D_H == 'D') {
                        jq_grid.jqGrid('setCell',rowid,"D_H",'H');
                    }else{
                        jq_grid.jqGrid('setCell',rowid,"D_H",'D');
                    }
                }
                else{
                    var rowdata = jq_grid_detalle_contable.getRowData(rowid);
                    if (rowdata.D_H == 'D') {
                        jq_grid.jqGrid('setCell',rowid,"D_H",'H');
                    }else{
                        jq_grid.jqGrid('setCell',rowid,"D_H",'D');
                    }
                }
            });
        }
        else{
            var fila = 0
            var jq_grid = jq_grid_detalle_contable;
            var dataIDs = jq_grid.getDataIDs(); 
            dataIDs.forEach(rowid => {
                jq_grid.jqGrid('setCell',rowid,"Debe",0);
                jq_grid.jqGrid('setCell',rowid,"Haber",0);
                jq_grid.jqGrid('setCell',rowid,"MnDebe",0);
                jq_grid.jqGrid('setCell',rowid,"MnHaber",0);
                jq_grid.jqGrid('setCell',rowid,"MeDebe",0);
                jq_grid.jqGrid('setCell',rowid,"MeHaber",0);
                fila++
                if (fila == 1) {
                    var rowdata = jq_grid_detalle_contable.getRowData(rowid);
                    if (rowdata.D_H == 'D') {
                        jq_grid.jqGrid('setCell',rowid,"D_H",modulo=="cuentas_por_pagar" ?'H':'D');
                    }else{
                        jq_grid.jqGrid('setCell',rowid,"D_H",modulo=="cuentas_por_pagar" ?'H':'D');
                    }
                }else{
                    var rowdata = jq_grid_detalle_contable.getRowData(rowid);
                    if (rowdata.D_H == 'D') {
                        jq_grid.jqGrid('setCell',rowid,"D_H",modulo=="cuentas_por_pagar" ?'D':'H');
                    }else{
                        jq_grid.jqGrid('setCell',rowid,"D_H",modulo=="cuentas_por_pagar" ?'D':'H');
                    }
                }
            });
        }
        if ($(this).val() == '03') {
            jq_destino_operacion.val('004');
        }
        
        // calcular_valores();
        //console.log(jq_tipo_documento.val());
    });
    jq_tipo_documento_referencia.change(function() {
        if($(this).val())
        {
            var jq_grid = jq_grid_detalle_contable;
            var dataIDs = jq_grid.getDataIDs(); 
            dataIDs.forEach(rowid => {
                $("#lista_select_tipo_documento2_"+rowid).val($(this).val());
            });
        }
    });
    jq_subvoucher.change(function () {
        cargar_periodo_ejercicio_contable(jq_subvoucher.val());
        cargar_cuentas_subvoucher(jq_subvoucher.val(), jq_moneda.val());
    });
    jq_tipo_anexo.change(function () {
        lista_mantenimientos_tipo_anexo = $(this).val();
    });
    jq_codigo_anexo.dblclick(function () {
        lista_mantenimientos_tipo_anexo = jq_tipo_anexo.val();
    });
    jq_detraccion_provisiones.change(function(){
        if (jq_detraccion_check.is(':checked')) {
            $.ajax({
                type: 'POST',
                url: '/detracciones/porcentaje',
                data: {
                    codigo: jq_detraccion_provisiones.val()
                },
                success: function (dato) {
                    var porcentaje = dato[0].Porcentaje;
                    jq_porcentaje_detraccion.val(porcentaje.toFixed(2));
                    if (dato[0].Editar_Porcentaje == '1') {
                        jq_porcentaje_detraccion.prop("disabled", false);
                    }else{
                        jq_porcentaje_detraccion.prop("disabled", true);
                    }
                    
                    calcular_valores();
                }
    
            })
        }
    });
    jq_retencion_no_domiciliado.change(function(){
        if (jq_retencion_check.is(':checked')) {
            $.ajax({
                type: 'POST',
                url: '/retencion_no_domiciliado/tasa',
                data: {
                    codigo: jq_retencion_no_domiciliado.val()
                },
                success: function (dato) {
                    var tasa = dato[0].Tasa;
                    jq_porcentaje_retencion.val(tasa);
                    if (dato[0].Editar_Porcentaje == '1') {
                        jq_porcentaje_retencion.prop("disabled", false);
                    }else{
                        jq_porcentaje_retencion.prop("disabled", true);
                    }
                }
                
            })
        }
    });
    jq_guia_entrada.dblclick(function() {
        jq_buscar_pendientes.trigger("click");
        
        //setVentasPendientes('Guias Pendientes','/guia_entrada/lista_documentos_pendientes','/guia_entrada/lista_detalle_pendientes');
    });
    setVentasPendientes('Guia Pendientes','/guia_entrada/lista_documentos_pendientes','/guia_entrada/lista_detalle_pendientes','','compras_pendientes','detalle_compra');
    
    jq_mixta.keyup(function(){
        calcular_valores("SubMixta");
    });
    jq_subtotal.keyup(function(){
        calcular_valores("SubTotal");
        if (jq_destino_operacion.val() == '004') {
            jq_monto_retencion.trigger("change");
        }
    });

    jq_icbper.keyup(function(){
        if(isEmptyOrWhiteSpaces($(this).val())){
            $(this).val("0");
        }
        var jq_grid = jq_grid_detalle_contable;
        var dataIDs = jq_grid.getDataIDs(); 
        var filas_maximas=4;
        if(jq_mixta.val()>0) filas_maximas++;
        
        // if(jq_icbper.val()>0 && jq_mixta.val()>0) filas_maximas++;
        if(dataIDs.length < filas_maximas){
            $.ajax({
                url: url_cuenta_icbper,
                type: 'POST',
                success: function (fila) {
                    var element = fila[0]

                    var rowId=dataIDs[1];
                    var data = jq_grid.getRowData(rowId);
                    data.Cuenta = element.Codigo;
                    data.Nombre_Cuenta = element.Nombre;
                    data.Debe = element.D_H=="D" ? jq_icbper.val() : 0;
                    data.Haber = element.D_H=="H" ? jq_icbper.val() : 0;
                    data.D_H = element.D_H;
                    data.Tipo_Referencia = jq_tipo_documento.val();
                    data.Fecha_Referencia = getDateFormat(jq_fecha_emision.val(),'y-m-d','d/m/y','-','/');
                    data.Fecha_Vencimiento = getDateFormat(jq_fecha_vencimiento.val(),'y-m-d','d/m/y','-','/');
                    data.Forma_Pago = jq_forma_pago.val();
                    data.Fecha2 = getDateFormat(jq_fecha_referencia.val(),'y-m-d','d/m/y','-','/');
                    data.Si_Transferencia = element.Si_Transferencia;
                    data.Si_CenCos = element.Si_CenCos;
                    data.Si_Ot = element.Si_Ot;
                    data.Si_Diferencia = element.Si_Genera_Diferencia;
                    data.Tipo_Anexo = element.Tipo_Auxiliar;
                    jq_grid.jqGrid('addRowData', undefined, data,"after",rowId );
                }
            });
        }else{
            var rowId=dataIDs[2];
            var data = jq_grid.getRowData(rowId);
            jq_grid.jqGrid('setCell',rowId,data.D_H=="D" ? "Debe" : "Haber",$(this).val());

        }
        calcular_valores("ICBPER");
    });

    jq_impuesto.keyup(function(){
    });

    jq_importe.keyup(function(){
        calcular_valores("Total");
        if (jq_destino_operacion.val() == '004') {
            jq_monto_retencion.trigger("change");
        }
    });

    jq_moneda.change(function () {  
        calcular_valores();
    });
    jq_destino_operacion.change(function() {
        switch (jq_destino_operacion.val()) {
            case '004':
                jq_porcentaje_impuesto.val('0.00');
                jq_impuesto.val('0.00');
                jq_importe.val(jq_subtotal.val());
                jq_mixta.val('0.00')
                jq_mixta.prop("disabled", true);
                break;
            case '005':
                cargar_porcentaje_impuesto_documento(jq_tipo_documento.val());
                jq_mixta.val('0.00')
                jq_mixta.prop("disabled", false);
                break;
            default:
                cargar_porcentaje_impuesto_documento(jq_tipo_documento.val());
                jq_mixta.val('0.00')
                jq_mixta.prop("disabled", true);
                break;
        }
        calcular_valores();
    });
    jq_monto_retencion.change(function(){
        //rellenar_moneda_2();
        if(isEmptyOrWhiteSpaces(jq_monto_retencion.val())){
            jq_monto_retencion.val("0.00");
        }
        var jq_grid = jq_grid_detalle_contable;
        var dataIDs = jq_grid.getDataIDs(); 
        var rowId=dataIDs[1];
        var data = jq_grid.getRowData(rowId);
        jq_grid.jqGrid('setCell',rowId,data.D_H=="D" ? "Debe" : "Haber",jq_monto_retencion.val());
    });
    jq_serie.keyup(function(){
        if(isEmptyOrWhiteSpaces(jq_serie.val())){
            jq_serie.val(" ");
        }
        var jq_grid = jq_grid_detalle_contable;
        var dataIDs = jq_grid.getDataIDs(); 
        dataIDs.forEach(rowid => {
            jq_grid.jqGrid('setCell',rowid,"Serie_Referencia",jq_serie.val());
        });
    });
    jq_serie_referencia.keyup(function(){
        if(isEmptyOrWhiteSpaces(jq_serie_referencia.val())){
            jq_serie_referencia.val(" ");
        }
        var jq_grid = jq_grid_detalle_contable;
        var dataIDs = jq_grid.getDataIDs(); 
        dataIDs.forEach(rowid => {
            jq_grid.jqGrid('setCell',rowid,"Serie2",jq_serie_referencia.val());
        });
    });
    jq_numero.keyup(function(){
        if(isEmptyOrWhiteSpaces(jq_numero.val())){
            jq_numero.val(" ");
        }
        var jq_grid = jq_grid_detalle_contable;
        var dataIDs = jq_grid.getDataIDs(); 
        dataIDs.forEach(rowid => {
            jq_grid.jqGrid('setCell',rowid,"Numero_Referencia",jq_numero.val());
        });
    });
    jq_numero_referencia.keyup(function(){
        if(isEmptyOrWhiteSpaces(jq_numero_referencia.val())){
            jq_numero_referencia.val(" ");
        }
        var jq_grid = jq_grid_detalle_contable;
        var dataIDs = jq_grid.getDataIDs(); 
        dataIDs.forEach(rowid => {
            jq_grid.jqGrid('setCell',rowid,"Numero2",jq_numero_referencia.val());
        });
    });
    jq_glosa.keyup(function(){
        if(isEmptyOrWhiteSpaces(jq_glosa.val())){
            jq_glosa.val(" ");
        }
        var jq_grid = jq_grid_detalle_contable;
        var dataIDs = jq_grid.getDataIDs(); 
        dataIDs.forEach(rowid => {
            jq_grid.jqGrid('setCell',rowid,"Glosa",jq_glosa.val());
        });
    });
    jq_fecha_emision.change(function () {
        var jq_grid = jq_grid_detalle_contable;
        var dataIDs = jq_grid.getDataIDs(); 
        dataIDs.forEach(rowid => {
            jq_grid.jqGrid('setCell',rowid,"Fecha_Referencia",getDateFormat(jq_fecha_emision.val(),'y-m-d','d/m/y','-','/'));
        });

        calcular_tipo_cambio(jq_fecha_emision.val(),"fecha de emision");
    });
    jq_fecha_vencimiento.change(function () {
        var jq_grid = jq_grid_detalle_contable;
        var dataIDs = jq_grid.getDataIDs(); 
        dataIDs.forEach(rowid => {
            jq_grid.jqGrid('setCell',rowid,"Fecha_Vencimiento",getDateFormat(jq_fecha_vencimiento.val(),'y-m-d','d/m/y','-','/'));
        });

        //calcular_tipo_cambio("fecha_emision");
    });
    jq_fecha_referencia.change(function () {
        var jq_grid = jq_grid_detalle_contable;
        var dataIDs = jq_grid.getDataIDs(); 
        dataIDs.forEach(rowid => {
            jq_grid.jqGrid('setCell',rowid,"Fecha2",getDateFormat(jq_fecha_referencia.val(),'y-m-d','d/m/y','-','/'));
        });

        calcular_tipo_cambio(jq_fecha_referencia.val(),"fecha de referencia");
    });
    jq_moneda.change(function(){
        if(isEmptyOrWhiteSpaces(jq_moneda.val())){
            jq_moneda.val(" ");
        }
        var jq_grid = jq_grid_detalle_contable;
        var dataIDs = jq_grid.getDataIDs(); 
        dataIDs.forEach(rowid => {
            jq_grid.jqGrid('setCell',rowid,"Moneda_Referencia",jq_moneda.val());
        });
    });
    jq_tasa_cambio.change(function(){
        if(isEmptyOrWhiteSpaces(jq_tasa_cambio.val())){
            jq_tasa_cambio.val(" ");
        }
        var jq_grid = jq_grid_detalle_contable;
        var dataIDs = jq_grid.getDataIDs(); 
        dataIDs.forEach(rowid => {
            jq_grid.jqGrid('setCell',rowid,"Tipo_Cambio_Referencia",jq_tasa_cambio.val());
        });
    });

    $("#nuevo").show();
    $("#guardar").show();
    $("#listar").show();
    $("#imprimir").show();
    $('#modificar').hide();
    setTitle(titulo);
    setTitleLista(modulo=="cuentas_por_cobrar" ? 'Listado de Cuentas por Cobrar' : 'Listado de Cuentas por Pagar');
    setListaDocumentos('/provisiones/lista', '/provisiones/consultar', '/contabilidad/detalle','','listado_documento_provisiones',modulo == 'cuentas_por_pagar'?'PAG':'COB');
    nuevo();  
});

function nuevo(){

    estado="guardar";
    short_fecha_trabajo =  getShortDate(fecha_trabajo);
    jq_automatico.prop('checked', true);
    jq_manual.prop('checked', false);
    jq_registro_compra_si.prop('checked', true);
    jq_registro_compra_no.prop('checked', false);
    jq_contabilizada.prop('checked', true);
    jq_manual_2.prop('checked', false);
    jq_no_costos.prop('checked', false);
    jq_ejercicio.prop("disabled", true);
    jq_fecha_registro.prop( "disabled", true );
    jq_porcentaje_impuesto.prop( "disabled", true );
    jq_subtotal.val("0.00");
    jq_subtotal_2.val("0.00");
    jq_mixta.val("0.00");
    jq_mixta.prop("disabled", true);
    jq_mixta_2.val("0.00");
    jq_impuesto.val("0.00");
    jq_impuesto_2.val("0.00");
    jq_icbper.val("0.00");
    jq_icbper_2.val("0.00");
    jq_importe.val("0.00");
    jq_importe_2.val("0.00");
    jq_porcentaje_percepcion.val("0.00");
    jq_percepcion.val("0.00");
    jq_percepcion_2.val("0.00");
    jq_porcentaje_detraccion.val("0.00");
    jq_porcentaje_retencion.val("0.00");
    jq_subtotal_2.prop( "disabled", true );
    jq_mixta_2.prop( "disabled", true );
    jq_impuesto_2.prop( "disabled", true );
    jq_icbper_2.prop( "disabled", true );
    jq_importe_2.prop("disabled", true);
    jq_percepcion_2.prop("disabled", true);
    jq_porcentaje_detraccion.prop("disabled", true);
    jq_porcentaje_retencion.prop("disabled", true);

    lista_mantenimientos_tipo_anexo = modulo == 'cuentas_por_pagar'?'42':'12';
    cargar_periodo_ejercicio_contable(modulo == 'cuentas_por_pagar'?'05':'06');
    rellenar_codigo_nombre(url_subvoucher_lista,"subvoucher",'',modulo == 'cuentas_por_pagar'?'05':'06');
    rellenar_codigo_nombre(url_tipo_auxiliar_lista,"tipo_anexo",'',modulo == 'cuentas_por_pagar'?'42':'12');
    rellenar_codigo_nombre(url_tipo_documento,"tipo_documento_referencia",'','00');
    rellenar_codigo_nombre(url_tipo_documento,"tipo_documento",'',"01");
    rellenar_codigo_nombre(url_clasificacion_lista,"clasificacion",'',"00");
    rellenar_moneda(moneda);
    rellenar_tasa_cambio(tasa_cambio, short_fecha_trabajo,jq_tipo_cambio.val()) //Mantener este orden de tasa/tipo, porque si no, no funciona dinamicamente y siempre agarrará VTA
    rellenar_tipo_cambio(tipo_cambio,tasa_cambio, fecha_registro); //Mantener este orden de tasa/tipo, porque si no, no funciona dinamicamente y siempre agarrará VTA
    cargar_configuraciones();
    // cargar_porcentaje_impuesto_documento("01")

    jq_fecha_registro.val(short_fecha_trabajo); 
    jq_fecha_emision.val(short_fecha_trabajo);
    jq_fecha_vencimiento.val(short_fecha_trabajo);
    jq_fecha_referencia.val(short_fecha_trabajo);

    //jq_tipo_documento.trigger("change");
    limpiar();
    permisos();
    
}

function limpiar(){
    jq_guia_entrada.val("");
    jq_codigo_anexo.val("");
    jq_nombre_anexo.val("");
    jq_dias.val("0");
    jq_subtotal.val("0.00");
    jq_subtotal_2.val("0.00");
    jq_mixta.val("0.00");
    jq_mixta_2.val("0.00");
    jq_impuesto.val("0.00");
    jq_impuesto_2.val("0.00");
    jq_icbper.val("0.00");
    jq_icbper_2.val("0.00");
    jq_importe.val("0.00");
    jq_importe_2.val("0.00");
    jq_detraccion_provisiones.val("");
    jq_retencion_no_domiciliado.val("");
    jq_detraccion_check.prop("checked", false);
    jq_retencion_check.prop("checked", false);
    jq_porcentaje_detraccion.val("0.00");
    jq_porcentaje_retencion.val("0.00");
    jq_destino_operacion.val("001")
    jq_serie.val("");
    jq_numero.val("");
    jq_glosa.val("");

    var jq_grid=jq_grid_detalle_contable;
    jq_grid.saveCell(rowid_selected_detalle_contable,selected_cell_detalle_contable);
    jq_grid.jqGrid("setGridParam",{
        url: url_contabilidad_detalle,
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: ""
        }
    }).trigger("reloadGrid")
}

function calcular_valores(campo){
    
    var calculos = calcular_totales_contabilidad(
        {
            SubTotal: jq_subtotal.val(),
            SubTotal_Mixto: jq_mixta.val(),
            Igv: jq_impuesto.val(),
            Icbper: jq_icbper.val(),
            Total: jq_importe.val(),
            Porcentaje_Igv: jq_porcentaje_impuesto.val(),
            Porcentaje_Detraccion: jq_porcentaje_detraccion.val(),
            Porcentaje_Retencion_No_Domiciliado: jq_porcentaje_retencion.val(),
            Porcentaje_Percepcion: jq_porcentaje_percepcion.val(),
            Tipo_Operacion: jq_destino_operacion.val(),
            Tasa_Cambio: jq_tasa_cambio.val(),
            Campo: campo,
            Moneda: jq_moneda.val(),
            Monto_Minimo_Detraccion: $("#"+detraccion_provisiones+" option:selected").attr("monto_minimo"),
            Monto_Minimo_IGV: $("#porcentaje_impuesto").attr("monto"),
            Aplicar_Renta_Cuarta: $("#porcentaje_impuesto").attr("renta_cuarta"),
        }
    )
    
    if(campo!="SubTotal") jq_subtotal.val((calculos.SubTotal).toFixed(2));
    if(campo!="Total") jq_importe.val((calculos.Total).toFixed(2));
    jq_impuesto.val((calculos.Igv).toFixed(2));
    if(campo!="ICBPER") jq_icbper.val((calculos.Icbper).toFixed(2));
    if(campo!="SubMixta") jq_mixta.val((calculos.SubTotal_Mixto).toFixed(2));
    jq_subtotal_2.val((calculos.SubTotal_2).toFixed(2));
    jq_importe_2.val((calculos.Total_2).toFixed(2));
    jq_impuesto_2.val((calculos.Igv_2).toFixed(2));
    jq_icbper_2.val((calculos.Icbper_2).toFixed(2));
    jq_mixta_2.val((calculos.SubTotal_Mixto_2).toFixed(2));
    jq_monto_retencion.val((calculos.Retencion_No_Domiciliado).toFixed(2));
    jq_monto_detraccion.val((calculos.Detraccion).toFixed(2));
    jq_percepcion.val((calculos.Percepcion).toFixed(2));
    jq_percepcion_2.val((calculos.Percepcion_2).toFixed(2));

    // if(campo!="SubTotal") jq_subtotal.val((calculos.SubTotal));
    // if(campo!="Total") jq_importe.val((calculos.Total));
    // jq_impuesto.val((calculos.Igv));
    // if(campo!="ICBPER") jq_icbper.val((calculos.Icbper));
    // if(campo!="SubMixta") jq_mixta.val((calculos.SubTotal_Mixto));
    // jq_subtotal_2.val((calculos.SubTotal_2));
    // jq_importe_2.val((calculos.Total_2));
    // jq_impuesto_2.val((calculos.Igv_2));
    // jq_icbper_2.val((calculos.Icbper_2));
    // jq_mixta_2.val((calculos.SubTotal_Mixto_2));
    // jq_monto_retencion.val((calculos.Retencion_No_Domiciliado));
    // jq_monto_detraccion.val((calculos.Detraccion));
    // jq_percepcion.val((calculos.Percepcion));
    // jq_percepcion_2.val((calculos.Percepcion_2));
    rellenar_moneda_2();
}

function cargar_configuraciones(){
    $.ajax({
        type: 'POST',
        url: url_configuraciones_tipo_cambio,
        success: function (lists){
            lists.forEach(list=>{
                jq_moneda.val(list.moneda_trabajo);
                jq_tipo_cambio.val(list.ctipo_cambio);
                rellenar_tasa_cambio(tasa_cambio, short_fecha_trabajo,jq_tipo_cambio.val());
            });
        }
    });
}

async function guardar(){
    
    var filas_detalle= [];
    var rows = jq_grid_detalle_contable.jqGrid('getDataIDs');
    var tipo_transferencia = modulo == 'cuentas_por_pagar'?'PAG':'COB';
    var detraccion_check = (jq_detraccion_check.prop('checked') == true ? "S": "N");
    
    if(estado!="eliminar")
    {
        for (let i = 0; i < rows.length; i++) {
            var rowdata = jq_grid_detalle_contable.getRowData(rows[i]);
            if (rowdata.Si_Detraccion == 'S') {
                jq_grid_detalle_contable.delRowData(rows[i]);
            }
            if (rowdata.Es_Transferencia == 'S') {
                jq_grid_detalle_contable.delRowData(rows[i]);
            }
        }
        rows.forEach(rowid => {
            var rowdata = jq_grid_detalle_contable.getRowData(rowid);
            rowdata.CenCos=$("#lista_select_cencos_"+rowid).val();
            rowdata.Ot=$("#lista_select_ot_"+rowid).val();
            rowdata.Unidad_Negocio=$("#lista_select_unidad_negocio_"+rowid).val();
            rowdata.Tipo_Referencia=$("#lista_select_tipo_documento_"+rowid).val();
            rowdata.Tipo2=$("#lista_select_tipo_documento2_"+rowid).val();
            rowdata.Tipo_Origen=$("#lista_select_tipo_origen_"+rowid).val();
            rowdata.Vendedor=$("#lista_select_vendedor_"+rowid).val();
            rowdata.Vendedor2=$("#lista_select_vendedor2_"+rowid).val();
            rowdata.Forma_Pago=$("#lista_select_forma_pago_"+rowid).val();
            filas_detalle.push(rowdata);
        });
    
        if (detraccion_check == "S" && jq_monto_detraccion.val() > 0) {
            await $.ajax({
                url: '/detracciones/cuenta',
                type: 'POST',
                data: {
                    tipo_grupo: modulo == 'cuentas_por_pagar'?'42':'12',
                    codigo_anexo: jq_codigo_anexo.val(),
                    moneda: jq_moneda.val(),
                },
                success: function (data) {
                    var row = data[0];
                    var jq_grid=jq_grid_detalle_contable;
                    var FilaDetra = deepCopy(fila_vacia_grid_detalle_contable)
                    FilaDetra.Cuenta = row.Cuenta;
                    FilaDetra.Nombre_Cuenta =  row.NombreCuenta;
                    FilaDetra.Codigo_Anexo =  jq_codigo_anexo.val();
                    FilaDetra.Nombre_Anexo =  jq_nombre_anexo.val();
                    FilaDetra.Tipo_Referencia = jq_tipo_documento.val();
                    FilaDetra.Serie_Referencia = jq_serie.val();
                    FilaDetra.Numero_Referencia = jq_numero.val();
                    FilaDetra.Fecha_Referencia = getDateFormat(jq_fecha_emision.val(),'y-m-d','d/m/y','-','/');
                    FilaDetra.Fecha_Vencimiento = getDateFormat(jq_fecha_vencimiento.val(),'y-m-d','d/m/y','-','/');
                    FilaDetra.Fecha2 = getDateFormat(jq_fecha_emision.val(),'y-m-d','d/m/y','-','/');
                    FilaDetra.Tipo_Cambio_Referencia = jq_tasa_cambio.val();
                    FilaDetra.Moneda_Referencia = jq_moneda.val();
                    FilaDetra.SubVoucher_Referencia = jq_subvoucher.val();
                    FilaDetra.Tipo_Origen = 'F';
                    FilaDetra.Si_Detraccion = 'S';
                    FilaDetra.Si_Transferencia = 'N';
                    FilaDetra.Si_CenCos = 'N';
                    FilaDetra.Si_Diferencia = 'N';
                    FilaDetra.Tipo_Anexo= modulo == 'cuentas_por_pagar'?'42':'12';
                    FilaDetra.Glosa = jq_glosa.val();
                    FilaDetra.Es_Transferencia = 'N';

                    if (tipo_transferencia == 'PAG') {
                        FilaDetra.Debe =  jq_monto_detraccion.val();
                        FilaDetra.Haber = '0.00';
                        FilaDetra.D_H =  'D';
                        FilaDetra.MnDebe = jq_monto_detraccion.val();
                        FilaDetra.MnHaber = '0.00';
                        FilaDetra.MeDebe = jq_monto_detraccion.val()/jq_tasa_cambio.val();
                        FilaDetra.MeHaber = '0.00';
                    }else{
                        FilaDetra.Debe =  '0.00'
                        FilaDetra.Haber = jq_monto_detraccion.val();
                        FilaDetra.D_H =  'H';
                        FilaDetra.MnDebe = '0.00'
                        FilaDetra.MnHaber = jq_monto_detraccion.val();
                        FilaDetra.MeDebe = '0.00';
                        FilaDetra.MeHaber = jq_monto_detraccion.val()/jq_tasa_cambio.val();
                    }
                    
                    jq_grid.jqGrid('addRowData',undefined,FilaDetra );

                    var FilaDetra2 = deepCopy(FilaDetra)

                    FilaDetra2.Cuenta = jq_moneda.val() == 'S/' ? row.Cuenta_Detraccion_Soles: row.Cuenta_Detraccion_Dolares;
                    FilaDetra2.Nombre_Cuenta = jq_moneda.val() == 'S/' ? row.NombreCuenta_Detraccion_Soles: row.NombreCuenta_Detraccion_Dolares;
                    FilaDetra2.Tipo_Origen = 'I';
                    FilaDetra2.Tipo_Referencia  ='DT';

                    if (tipo_transferencia == 'PAG') {
                        FilaDetra2.Haber =  jq_monto_detraccion.val();
                        FilaDetra2.Debe = '0.00';
                        FilaDetra2.D_H =  'H';
                        FilaDetra2.MnHaber = jq_monto_detraccion.val();
                        FilaDetra2.MnDebe = '0.00';
                        FilaDetra2.MeHaber = jq_monto_detraccion.val()/jq_tasa_cambio.val();
                        FilaDetra2.MeDebe = '0.00';
                    }else{
                        FilaDetra2.Haber =  '0.00'
                        FilaDetra2.Debe = jq_monto_detraccion.val();
                        FilaDetra2.D_H =  'D';
                        FilaDetra2.MnHaber = '0.00'
                        FilaDetra2.MnDebe = jq_monto_detraccion.val();
                        FilaDetra2.MeHaber = '0.00';
                        FilaDetra2.MeDebe = jq_monto_detraccion.val()/jq_tasa_cambio.val();
                    }
                    
                    jq_grid.jqGrid('addRowData',undefined,FilaDetra2 );
                    return true;
                }
            });
        }
        
        for (let i = 0; i < filas_detalle.length; i++) {
            const element = filas_detalle[i];

            if (element.Si_Transferencia == 'S') {
                var item_referencia = i+1
                await $.ajax({
                    url: url_cuenta_transferencia,
                    type: 'POST',
                    data: {
                        Codigo: element.Cuenta
                    },
                    success: function (data) {
                        
                        for (let j = 0; j < data.length; j++) {

                            var fila = data[j];
                            var jq_grid=jq_grid_detalle_contable;
                            var newFila = deepCopy(fila_vacia_grid_detalle_contable)

                            var Codigo_Anexo=jq_tipo_anexo.val()==fila.Tipo_Auxiliar? jq_codigo_anexo.val(): " ";
                            var Nombre_Anexo=jq_tipo_anexo.val()==fila.Tipo_Auxiliar? jq_nombre_anexo.val(): " ";
                            
                            newFila.Item_Transferencia = item_referencia;
                            newFila.Es_Transferencia = 'S';
                            newFila.Cuenta = fila.Codigo;
                            newFila.Nombre_Cuenta =  fila.Nombre;
                            newFila.D_H = element.D_H== "D"? fila.D_H: fila.D_H=="H"? "D":"H";
                            newFila.Si_Transferencia =  fila.Si_Transferencia;
                            newFila.Si_CenCos =  fila.Si_CenCos;
                            newFila.Si_Ot =  fila.Si_Ot;
                            newFila.Si_Diferencia =  fila.Si_Genera_Diferencia;
                            newFila.Si_Presupuesto =  fila.Si_Presupuesto;
                            newFila.Tipo_Anexo =  fila.Tipo_Auxiliar;
                            newFila.Codigo_Anexo =  fila.Tipo_Auxiliar=="00"?" ":Codigo_Anexo;
                            newFila.Nombre_Anexo =  fila.Tipo_Auxiliar=="00"?" ":Nombre_Anexo;
                            newFila.Debe = element.D_H=="D"?(fila.Porcentaje_Debe/100) * (element.D_H=="D" ? element.Debe : element.Haber):(fila.Porcentaje_Haber/100) * (element.D_H=="D" ? element.Debe : element.Haber);
                            newFila.Haber = element.D_H=="D"?(fila.Porcentaje_Haber/100) * (element.D_H=="D" ? element.Debe : element.Haber):(fila.Porcentaje_Debe/100) * (element.D_H=="D" ? element.Debe : element.Haber);
                            newFila.CenCos = element.CenCos;
                            newFila.Ot = element.Ot;
                            newFila.Unidad_Negocio = element.Unidad_Negocio;
                            newFila.Glosa = element.Glosa;
                            newFila.Tipo_Referencia = element.Tipo_Referencia;
                            newFila.Serie_Referencia = element.Serie_Referencia;
                            newFila.Numero_Referencia = $.trim(element.Numero_Referencia);
                            newFila.Fecha_Referencia = getDateFormat(element.Fecha_Referencia,'y/m/d','d/m/y','/','/');
                            newFila.Tipo_Cambio_Referencia = element.Tipo_Cambio_Referencia;
                            newFila.Moneda_Referencia = element.Moneda_Referencia;
                            newFila.SubVoucher_Referencia = element.SubVoucher_Referencia;
                            newFila.Tipo_Origen = 'N';
                            newFila.Fecha_Vencimiento = getDateFormat(element.Fecha_Vencimiento,'y/m/d','d/m/y','/','/');
                            newFila.Vendedor = element.Vendedor;
                            newFila.Vendedor2 = element.Vendedor2;
                            newFila.Forma_Pago = element.Forma_Pago;
                            newFila.Tipo2 = element.Tipo2;
                            newFila.Serie2 = element.Serie2;
                            newFila.Numero2 = element.Numero2;
                            newFila.Fecha2 = getDateFormat(element.Fecha2,'y/m/d','d/m/y','/','/');
                            newFila.MnDebe = element.D_H=="D"?(fila.Porcentaje_Debe/100) * (element.D_H=="D" ? element.MnDebe : element.MnHaber):(fila.Porcentaje_Haber/100) * (element.D_H=="D" ? element.MnDebe : element.MnHaber);
                            newFila.MnHaber = element.D_H=="D"?(fila.Porcentaje_Haber/100) * (element.D_H=="D" ? element.MnDebe : element.MnHaber):(fila.Porcentaje_Debe/100) * (element.D_H=="D" ? element.MnDebe : element.MnHaber);
                            newFila.MeDebe = element.D_H=="D"?(fila.Porcentaje_Debe/100) * (element.D_H=="D" ? element.MeDebe : element.MeHaber):(fila.Porcentaje_Haber/100) * (element.D_H=="D" ? element.MeDebe : element.MeHaber);
                            newFila.MeHaber = element.D_H=="D"?(fila.Porcentaje_Haber/100) * (element.D_H=="D" ? element.MeDebe : element.MeHaber):(fila.Porcentaje_Debe/100) * (element.D_H=="D" ? element.MeDebe : element.MeHaber);

                            //console.log(newFila.Tipo_Referencia);
                            jq_grid.jqGrid('addRowData',undefined,newFila );
                            
                        }
                    }
                });
            }
            
        }
    }
    guardar_2();
};

function guardar_2() {
    
    if(!isEmptyOrWhiteSpaces(Codigo_Centro_Costos)){
        var jq_grid=jq_grid_detalle_contable;
        var arr = jq_grid.getDataIDs();
        for(var i=0;i<arr.length;i++){
            $("#lista_select_cencos_"+arr[i]).val(Codigo_Centro_Costos);
            $("#lista_select_ot_"+arr[i]).val(Codigo_Orden_Trabajo);
            $("#lista_select_unidad_negocio_"+arr[i]).val(Codigo_Unidad_Negocio);
        }
    }

    url_guardar="";
    var mensaje="";
    var impresion=false;
    switch (estado) {
        case 'guardar':
            url_guardar = "/provisiones/guardar";
            mensaje = "Guardado satisfactoriamente."
            impresion=true;
            break;
        case  'modificar':
            url_guardar = "/provisiones/modificar";
            mensaje = "Modificado satisfactoriamente."
            break;
        case 'eliminar':
            url_guardar = "/provisiones/eliminar";
            mensaje = "Eliminado satisfactoriamente."
            break;
        case 'anular':
            url_guardar = "/provisiones/anular";
            mensaje = "Anulado satisfactoriamente."
            break;
    }

    var filas_detalle= [];
    var rows = jq_grid_detalle_contable.jqGrid('getDataIDs');
    var automatico = (jq_automatico.prop('checked') == true ? "A" : "M");
    var registro_compra = (jq_registro_compra_si.prop('checked') == true ? "S" : "N");
    var tipo_registro = modulo == 'cuentas_por_pagar'? jq_registro_compra_si.prop('checked') == true ? 'RC' : 'ST': jq_registro_compra_si.prop('checked') == true ? 'RV': 'ST';
    var modulo_origen = modulo == 'cuentas_por_pagar'?'CXP':'CXC';
    var concepto = modulo == 'cuentas_por_pagar'?'NNUM_CTAXPAG':'NNUM_CTAXCOB';
    var tipo_transferencia = modulo == 'cuentas_por_pagar'?'PAG':'COB';
    var detraccion_check = (jq_detraccion_check.prop('checked') == true ? "S": "N");
    var percepcion_check = (jq_percepcion_check.prop('checked') == true ? "S": "N");
    var retencion_check = (jq_retencion_check.prop('checked') == true ? "S" : "N");
    var contabilizada = (jq_contabilizada.prop('checked') == true ? "S": "N");


    rows.forEach(rowid => {
        var rowdata = jq_grid_detalle_contable.getRowData(rowid);
        rowdata.CenCos=$("#lista_select_cencos_"+rowid).val();
        rowdata.Ot=$("#lista_select_ot_"+rowid).val();
        rowdata.Unidad_Negocio=$("#lista_select_unidad_negocio_"+rowid).val();
        rowdata.Tipo_Referencia=$("#lista_select_tipo_documento_"+rowid).val();
        rowdata.Tipo2= $("#lista_select_tipo_documento2_"+rowid).val();
        rowdata.Tipo_Origen=$("#lista_select_tipo_origen_"+rowid).val();
        // rowdata.Tipo_Origen= rowdata.Tipo_Anexo != "00"? "I":"N";  //$("#lista_select_tipo_origen_"+rowid).val();
        if(isEmptyOrWhiteSpaces(rowdata.Tipo_Anexo) || rowdata.Tipo_Anexo=="00"){
            rowdata.Tipo_Origen = 'N';
        }
        rowdata.Vendedor=$("#lista_select_vendedor_"+rowid).val();
        rowdata.Vendedor2=$("#lista_select_vendedor2_"+rowid).val();
        rowdata.Forma_Pago=$("#lista_select_forma_pago_"+rowid).val();
        rowdata.Fecha_Referencia=getDateFormat (rowdata.Fecha_Referencia,'d/m/y',"m/d/y",'/','/');
        rowdata.Fecha2=getDateFormat (rowdata.Fecha2,'d/m/y',"m/d/y",'/','/');
        rowdata.Fecha_Vencimiento=getDateFormat (rowdata.Fecha_Vencimiento,'d/m/y',"m/d/y",'/','/');
        filas_detalle.push(rowdata);
    });
    $.ajax({
         url: url_guardar,
         type: 'post',
         data:{
             ejercicio: jq_ejercicio.val(),
             periodo: jq_periodo.val(),
             codigo_subvoucher: jq_subvoucher.val(),
             automatico: automatico,
             fecha_doc : getDateFormat (jq_fecha_registro.val(),'y-m-d',"m/d/y",'-','/') ,
             fecha_registro : getDateFormat (jq_fecha_registro.val(),'y-m-d',"m/d/y",'-','/') ,
             fecha_emision : getDateFormat (jq_fecha_emision.val(),'y-m-d',"m/d/y",'-','/') ,
             fecha_referencia : getDateFormat (jq_fecha_referencia.val(),'y-m-d',"m/d/y",'-','/') ,
             tipo_documento_referencia: jq_tipo_documento_referencia.val(),
             serie_documento_referencia: jq_serie_referencia.val(),
             numero_documento_referencia: jq_numero_referencia.val(),
             tipo_documento: jq_tipo_documento.val(),
             serie: jq_serie.val(),
             numero: jq_numero.val(),
             numero_correlativo: jq_numero_documento.val(),
             tipo_codigo_auxiliar: jq_tipo_anexo.val(),
             codigo_cliente: jq_codigo_anexo.val(),
             nombre_cliente: jq_nombre_anexo.val(),
             moneda: jq_moneda.val(),
             tipo_cambio: jq_tipo_cambio.val(),
             tasa_cambio: jq_tasa_cambio.val(),
             tipo_registro:  tipo_registro,
             Glosa: jq_glosa.val(),
             estado: "Ingresado",
             destino_operacion: jq_destino_operacion.val(),
             modulo_origen: modulo_origen,
             erp_Dsubtotal: jq_subtotal.val(),
             erp_Dsubtotal_No_Grabada: jq_destino_operacion.val() == '004'? jq_subtotal.val(): jq_destino_operacion.val() == '005' ? jq_mixta.val() : 0 ,
             erp_Digv: jq_impuesto.val(),
             erp_Dimporte: jq_importe.val(),
             fecha_vencimiento : getDateFormat (jq_fecha_vencimiento.val(),'y-m-d',"m/d/y",'-','/') ,
             detraccion_sn: detraccion_check,
             codigo_detraccion: isEmptyOrWhiteSpaces(jq_detraccion_provisiones.val()) ? '00': jq_detraccion_provisiones.val(),
             forma_pago: jq_forma_pago.val(),
             porcentaje_percepcion: jq_porcentaje_percepcion.val() == ''? 0: jq_porcentaje_percepcion.val(),
             porcentaje_impuesto: jq_porcentaje_impuesto.val(),
             dias: jq_dias.val(),
             porcentaje_detraccion: jq_porcentaje_detraccion.val(),
             percepcion_sn: percepcion_check,
             retencion_sn: retencion_check,
             porcentaje_retencion: jq_porcentaje_retencion.val(),
             retension_no_domiciliado: jq_retencion_no_domiciliado.val(),
             retencion_no_domiciliado_sn: retencion_check,
             porcentaje_retencion_no_domiciliado: jq_porcentaje_retencion.val(),
             erp_ICBPER: jq_icbper.val(),
             concepto: concepto,
             tipo_transferencia: tipo_transferencia,
             contabilizada: contabilizada,
             monto_detraccion: jq_monto_detraccion.val()  == ''? 0 :jq_monto_detraccion.val(),
             monto_percepcion: jq_percepcion.val() == ''? 0 :jq_percepcion.val(),
             clasificacion_bien_servicio: jq_clasificacion.val(),
             monto_retencion: jq_monto_retencion.val() == ''? 0: jq_monto_retencion.val(),
             Pc_Fecha: '01/01/1900',
             Pc_User: '',
             Pc_Ip: '',
             registro_compra: registro_compra,
             guia_entrada: jq_guia_entrada.val(),
             Serie_Guia: Serie_Guia,
             Codigo_Punto_Venta: Codigo_Punto_Venta,

             filas_detalle: JSON.stringify(filas_detalle)
         },
         success: function(result){
             console.log(result);
            if(result.estado == true){
                jq_numero_documento.val(result.codigo);
               $("#guardar").prop("disabled", true);

               mostrarMensaje(mensaje,true,2000);
               if(estado!="eliminar") 
                   consultar(impresion);
               estado="Consultar";
            }
            else
               mostrarMensaje("Código de Error:  "+result.codigo+" " +result.mensaje,false,2000);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown,extra) { 
            mostrarMensaje("No se pudo guardar",false,2000);
        }
    });

}

function validar(){
    var retorno=true;
    if(isEmptyOrWhiteSpaces(jq_dias.val())) {
        jq_dias.val("0");
    }
    if(jq_tasa_cambio.val() * 1 == 0 ) {
        retorno = false;
        mostrarMensajeModal("Aviso","Tipo de cambio debe ser mayor a 0");
    }
    if(isEmptyOrWhiteSpaces(jq_codigo_anexo.val())) {
        retorno = false;
        mostrarMensajeModal("Aviso","Debe ingresar un cliente");
        //mensaje += "Debe ingresar un cliente. <br>";
    }
    if(isEmptyOrWhiteSpaces(jq_numero_documento.val())) {
        retorno = false;
        mostrarMensajeModal("Aviso","Debe ingresar un número correlativo");
    }
    if(isEmptyOrWhiteSpaces(jq_serie.val())) {
        retorno = false;
        mostrarMensajeModal("Aviso","Debe ingresar una serie documento");
    }
    if(isEmptyOrWhiteSpaces(jq_numero.val())) {
        retorno = false;
        mostrarMensajeModal("Aviso","Debe ingresar una numero documento");
    }
    if(isEmptyOrWhiteSpaces(jq_glosa.val())) {
        retorno = false;
        mostrarMensajeModal("Aviso","Debe ingresar la glosa");
    }

    var jq_grid=jq_grid_detalle_contable;

    var SumaHaber = jq_grid.jqGrid('getCol', 'Haber', false, 'sum');
    var SumaDebe = jq_grid.jqGrid('getCol', 'Debe', false, 'sum');

    if((SumaHaber).toFixed(2) != (SumaDebe).toFixed(2)){
        mostrarMensajeModal("Aviso","El Documento esta Descuadrado");
        retorno=false;
    }

    return retorno;
};

function consultar(impresion) {
    var jq_grid=jq_grid_detalle_contable;
    jq_grid.saveCell(rowid_selected_detalle_contable,selected_cell_detalle_contable);

    documentoSeleccionado = jq_grid_documentos.jqGrid("getGridParam", 'selrow');
    documentoSeleccionado = rowId_seleccionado;
    row_lista_documento_selected = jq_grid_documentos.jqGrid("getRowData", documentoSeleccionado);

    var data ={
        cob_pag: row_lista_documento_selected.Cob_Pag,
        ejercicio: row_lista_documento_selected.Ejercicio,
        periodo: row_lista_documento_selected.Periodo_Contable,
        numero_documento_contable: row_lista_documento_selected.Numero_Contable,
        subvoucher: row_lista_documento_selected.Codigo_Svoucher
    }
    if(impresion){
        data ={
            cob_pag : modulo == 'cuentas_por_pagar'?'PAG':'COB',
            ejercicio: jq_ejercicio.val(),
            periodo: jq_periodo.val(),
            numero_documento_contable : jq_numero_documento.val(),
            subvoucher: jq_subvoucher.val()
        }
    }
    $.ajax({
        type: "POST",
        url: url_consultar,
        data: data,
        success: function (data) {
            rellenar_formas_pago(data[0].Documento_Codigo_Anexo,data[0].Documento_Tipo_Anexo,data[0].Documento_Codigo_Forma_Pago);

            jq_subvoucher.val(data[0].Documento_Codigo_Svoucher);
            jq_fecha_registro.val(data[0].Documento_Fecha_Registro);
            data[0].Documento_Si_Registro_Compra=="S" ? jq_registro_compra_si.prop('checked',true): jq_registro_compra_si.prop('checked',false)
            data[0].Documento_Si_Registro_Compra=="N" ? jq_registro_compra_no.prop('checked',true): jq_registro_compra_no.prop('checked',false)
            jq_ejercicio.val(data[0].Documento_Ejercicio);
            jq_periodo.val(data[0].Documento_Periodo_Contable);
            data[0].Documento_Automatico=="A" ? jq_automatico.prop('checked', true) : jq_automatico.prop('checked', false)
            data[0].Documento_Automatico=="M" ? jq_manual.prop('checked', true) : jq_manual.prop('checked', false)
            jq_numero_documento.val(data[0].Documento_Numero_Contable);
            jq_guia_entrada.val(data[0].Documento_Guia_Entrada);
            jq_tipo_anexo.val(data[0].Documento_Tipo_Anexo);
            jq_codigo_anexo.val(data[0].Documento_Codigo_Anexo);
            jq_nombre_anexo.val(data[0].Documento_Nombre_Anexo);
            jq_moneda.val(data[0].Documento_Moneda);
            jq_tipo_cambio.val(data[0].Documento_Tipo_Cambio);
            jq_tasa_cambio.val(data[0].Documento_Tasa_Cambio);
            jq_tipo_documento_referencia.val(data[0].Documento_Tipo_Documento_Referencia);
            jq_serie_referencia.val(data[0].Documento_Serie_Documento_Referencia);
            jq_numero_referencia.val(data[0].Documento_Numero_Documento_Referencia);
            jq_fecha_referencia.val(data[0].Documento_Fecha_Documento_Referencia);
            jq_destino_operacion.val(data[0].Documento_Destino_Oprecacion);
            jq_tipo_documento.val(data[0].Documento_Tipo_Documento);
            jq_serie.val(data[0].Documento_Serie);
            jq_numero.val(data[0].Documento_Numero);
            jq_fecha_emision.val(data[0].Documento_Fecha_Emision);
            jq_dias.val(data[0].Documento_Dias);
            jq_fecha_vencimiento.val(data[0].Documento_Fecha_Vencimiento);
            jq_clasificacion.val(data[0].Documento_Cliasificacion_Bien_Servicio);
            jq_subtotal.val(formatCurrency(data[0].Documento_Destino_Oprecacion == '004'?data[0].Documento_SubTotal_NGrabado : data[0].Documento_SubTotal,2));
            jq_subtotal_2.val(formatCurrency(data[0].Documento_Moneda == "S/"? data[0].Documento_SubTotal_ME:data[0].Documento_SubTotal_MN,2));
            jq_mixta.val(formatCurrency(data[0].Documento_Destino_Oprecacion == "005"? data[0].Documento_SubTotal_NGrabado : 0,2));
            jq_mixta_2.val(formatCurrency(data[0].Documento_Destino_Oprecacion == "005"? data[0].Documento_Moneda == "S/"? data[0].Documento_SubTotal_Mixto_ME:data[0].Documento_SubTotal_Mixto_MN: 0,2));
            jq_porcentaje_impuesto.val(formatCurrency(data[0].Documento_Porcentaje,2));
            jq_impuesto.val(formatCurrency(data[0].Documento_Igv,2));
            jq_impuesto_2.val(formatCurrency(data[0].Documento_Moneda == "S/"? data[0].Documento_Igv_ME:data[0].Documento_Igv_MN,2));
            jq_icbper.val(formatCurrency(data[0].Documento_Icbper,2));
            jq_icbper_2.val(formatCurrency(data[0].Documento_Moneda == "S/"? data[0].Documento_Icbper_ME:data[0].Documento_Icbper_MN,2));
            jq_importe.val(formatCurrency(data[0].Documento_Importe,2));
            jq_importe_2.val(formatCurrency(data[0].Documento_Moneda == "S/"? data[0].Documento_Importe_ME:data[0].Documento_Importe_MN,2));
                      
            if (data[0].Documento_Pais == '001'|| data[0].Documento_Pais == '' || data[0].Documento_Pais == null ) {
                //relllenar_detracciones(data[0].Documento_Codigo_Anexo,data[0].Documento_Codigo_Detraccion);
                $("#retencion_si").hide();
                $("#retencion_si_2").hide();
            }
            if (data[0].Documento_Pais!= '001') {
                $("#retencion_si").show();
                $("#retencion_si_2").show();
                //rellenar_retencion_no_domiciliado(data[0].Documento_Codigo_Anexo,data[0].Documento_Retencion_NoDomiciliada);
            }
            data[0].Documento_SN_Detraccion == 'S'? jq_detraccion_check.prop("checked", true):jq_detraccion_check.prop("checked", false);
            data[0].Documento_SN_Retencion == 'S'? jq_retencion_check.prop("checked", true):jq_retencion_check.prop("checked", false);
            
            jq_glosa.val(data[0].Documento_Glosa);


            switch (data[0].Documento_Destino_Oprecacion) {
                case '004':
                    jq_mixta.prop("disabled", true);
                    break;
                case '005':
                    jq_mixta.prop("disabled", false);
                    break;
                default:
                    jq_mixta.prop("disabled", true);
                    break;
            }

            // rellenarFormato(data);
            // if(impresion)
            //     imprimir();
        }
      });
      jq_grid_detalle_contable.jqGrid("setGridParam",{
        url: url_getListaDetalle,
        mtype: "POST",
        datatype: "json",
        postData:data
    }).trigger("reloadGrid");

    jq_modal_ventana_lista.modal('hide');
}

async function agregar_cabecera_pendientes(rowData){
    
    jq_porcentaje_detraccion.val("0.00");
    jq_porcentaje_retencion.val("0.00");
    jq_guia_entrada.val(rowData.Numero);
    jq_tasa_cambio.val(rowData.Tc);
    jq_codigo_anexo.val(rowData.Codigo_Proveedor);
    jq_nombre_anexo.val(rowData.Nombre_Proveedor);
    rellenar_formas_pago(rowData.Codigo_Proveedor,'42',rowData.Forma_Pago);
    jq_tipo_documento_referencia.val('09');
    jq_serie_referencia.val(rowData.Motivo_Serie_Referencia_Documento);
    jq_numero_referencia.val(rowData.Numero_Referencia_Documento);
    jq_serie.val(rowData.Factura_Serie_Referencia);
    jq_numero.val(rowData.Factura_Numero_Referencia);
    jq_moneda.val(rowData.Moneda);
    jq_fecha_emision.val(rowData.Fecha_Emision);
    jq_fecha_vencimiento.val(rowData.Fecha_Emision);
    jq_fecha_referencia.val(rowData.Fecha_Emision);
    jq_glosa.val(rowData.glosa);
    Serie_Guia = rowData.Codigo_Motivo_Serie;
    Codigo_Punto_Venta = rowData.Punto_Venta;
    Tipo_Documento_Guia = rowData.Tipo_Documento;
    Codigo_Centro_Costos = rowData.Cencos;
    Codigo_Orden_Trabajo = rowData.Ot;
    Codigo_Unidad_Negocio = rowData.Codigo_Unidad_Negocio;

    if (rowData.Igv == '0') {
        jq_destino_operacion.val('004');
        jq_porcentaje_impuesto.val('0.00');
    }
    
    jq_subtotal.val((rowData.Sub_Total).toFixed(2));
    jq_impuesto.val((rowData.Igv).toFixed(2));
    jq_importe.val((rowData.Total).toFixed(2));

    if (rowData.Pais == '001'|| rowData.Pais == '' || rowData.Pais == null ) {
        relllenar_detracciones(rowData.Codigo_Proveedor);
        $("#retencion_si").hide();
        $("#retencion_si_2").hide();
    }
    if (rowData.Pais!= '001') {
        $("#retencion_si").show();
        $("#retencion_si_2").show();
        rellenar_retencion_no_domiciliado(rowData.Codigo_Proveedor);
    }

    var jq_grid = jq_grid_detalle_contable;
    var dataIDs = jq_grid.getDataIDs(); 
    
    for(i = 0; i < dataIDs.length; i++)
    {
        var rowId=dataIDs[i];
        var data = jq_grid.getRowData(rowId);
        if(jq_tipo_anexo.val() == data.Tipo_Anexo){
            jq_grid.jqGrid('setCell',rowId,"Codigo_Anexo",rowData.Codigo_Proveedor);
            jq_grid.jqGrid('setCell',rowId,"Nombre_Anexo",rowData.Nombre_Proveedor);
        }
        if (data.Si_Transferencia == 'S') {
            jq_grid.jqGrid('delRowData',rowId);
        }
    }

    var ids_subgrid=jq_detalle_documentos_pendientes_seleccionados.getDataIDs();
    var rowDetalle = jq_detalle_documentos_pendientes_seleccionados.getRowData(ids_subgrid);
    for (let j = 0; j < rowDetalle.length; j++) {
        const item = rowDetalle[j];

        await $.ajax({
            type: 'POST',
            url: '/plan_contable/cuentas_item',
            data: {
                Codigo: item.Familia
            },
            success: function (datos) {
                $.ajax({
                    type: 'POST',
                    url: '/plan_contable/datos',
                    data: {
                        Codigo: modulo == 'cuentas_por_pagar'? datos[0].Cuenta_Debe_Pagar: datos[0].Cuenta_Haber
                    },
                    success: function (datos_cuenta) {

                        var jq_grid=jq_grid_detalle_contable;
                        var newFila = deepCopy(fila_vacia_grid_detalle_contable)

                        newFila.Cuenta = datos_cuenta[0].Codigo;
                        newFila.Nombre_Cuenta =  datos_cuenta[0].Nombre;
                        newFila.D_H = datos_cuenta[0].D_H;
                        newFila.Debe = datos_cuenta[0].D_H == 'D' ? item.Base_Imponible :0;
                        newFila.Haber = datos_cuenta[0].D_H == 'H' ? item.Base_Imponible : 0;
                        newFila.CenCos = Codigo_Centro_Costos;
                        newFila.Ot = Codigo_Orden_Trabajo;
                        newFila.Unidad_Negocio = Codigo_Unidad_Negocio;
                        newFila.Glosa = jq_glosa.val();
                        newFila.Tipo_Referencia = jq_tipo_documento.val();
                        newFila.Serie_Referencia = jq_serie.val();
                        newFila.Numero_Referencia = jq_numero.val();
                        newFila.Fecha_Referencia = getDateFormat(jq_fecha_emision.val(),'y-m-d','d/m/y','-','/');
                        newFila.Tipo_Cambio_Referencia = jq_tasa_cambio.val();
                        newFila.Moneda_Referencia = jq_moneda.val();
                        newFila.Tipo_Origen = 'N';
                        newFila.Fecha_Vencimiento = getDateFormat(jq_fecha_vencimiento.val(),'y-m-d','d/m/y','-','/');
                        newFila.Forma_Pago = jq_forma_pago.val();
                        newFila.Tipo2 = jq_tipo_documento_referencia.val();
                        newFila.Serie2 = jq_serie_referencia.val();
                        newFila.Numero2 = jq_numero_referencia.val();
                        newFila.Fecha2 = getDateFormat(jq_fecha_referencia.val(),'y-m-d','d/m/y','-','/');
                        newFila.MnDebe = datos_cuenta[0].D_H == 'D' ? item.Base_Imponible :0;
                        newFila.MnHaber = datos_cuenta[0].D_H == 'H' ? item.Base_Imponible : 0;
                        newFila.MeDebe = datos_cuenta[0].D_H == 'D' ? item.Base_Imponible/jq_tasa_cambio.val() :0;
                        newFila.MeHaber = datos_cuenta[0].D_H == 'H' ? item.Base_Imponible/jq_tasa_cambio.val() : 0;
                        newFila.Es_Transferencia = 'N';
                        newFila.Si_CenCos = datos_cuenta[0].Si_CenCos;
                        newFila.Si_Ot = datos_cuenta[0].Si_Ot;
                        newFila.Si_Diferencia = datos_cuenta[0].Si_Genera_Diferencia;
                        newFila.Si_Transferencia = datos_cuenta[0].Si_Transferencia;
                        newFila.Tipo_Anexo = '00';
                        newFila.Movimiento_Guia = Tipo_Documento_Guia;
                        newFila.Tipo_Movimiento_Guia = 'E';
                        newFila.Serie_Guia = Serie_Guia;
                        newFila.Numero_Guia = jq_guia_entrada.val();

                        jq_grid.jqGrid('addRowData',undefined,newFila );

                        calcular_totales_footer();
                    }
                })
            }
        })
        
    }

    jq_tipo_documento_referencia.trigger("change");
    //jq_moneda.trigger("change");
    jq_tasa_cambio.trigger("change");
    jq_serie.trigger("keyup");
    jq_numero.trigger("keyup");
    jq_serie_referencia.trigger("keyup");
    jq_numero_referencia.trigger("keyup");
    jq_fecha_emision.trigger("change");
    jq_fecha_vencimiento.trigger("change");
    jq_fecha_referencia.trigger("change");
    jq_glosa.trigger("keyup");
    //calcular_valores("Total");
    
    if(!isEmptyOrWhiteSpaces(Codigo_Centro_Costos)){
        var jq_grid=jq_grid_detalle_contable;
        var arr = jq_grid.getDataIDs();
        for(var i=0;i<arr.length;i++){
            $("#lista_select_cencos_"+arr[i]).val(Codigo_Centro_Costos);
            $("#lista_select_ot_"+arr[i]).val(Codigo_Orden_Trabajo);
            $("#lista_select_unidad_negocio_"+arr[i]).val(Codigo_Unidad_Negocio);
        }
    }
}

function cargarConfiguracionCuentasContables(){
    
    $.ajax({
        type: 'POST',
        url: '/contabilidad/parametros_contables/',
        success: function (datos) {
            parametros_contables = datos;
        }
    });
}

function rellenar_moneda_2(){

    if(isEmptyOrWhiteSpaces(jq_subtotal.val())){
        jq_subtotal.val("0");
    }
    var jq_grid = jq_grid_detalle_contable;
    var dataIDs = jq_grid.getDataIDs(); 
    var rowId=dataIDs[jq_icbper.val()>0 ? 3 : 2];
    var data = jq_grid.getRowData(rowId);
    jq_grid.jqGrid('setCell',rowId,data.D_H=="D" ? "Debe" : "Haber",jq_subtotal.val());

    if(isEmptyOrWhiteSpaces(jq_importe.val())){
        jq_importe.val("0");
    }

    if(isEmptyOrWhiteSpaces(jq_impuesto.val())){
        jq_impuesto.val("0");
    }
    
    if(isEmptyOrWhiteSpaces(jq_mixta.val())){
        jq_mixta.val("0");
    }

    //#region  Total
    // if (jq_destino_operacion.val() == '004') {
    //     var importe  = jq_importe.val() - jq_monto_retencion.val();
    // } else {
    //     var importe = jq_importe.val();
    // }
    var importe = jq_importe.val();

    var rowId=dataIDs[0];
    var data = jq_grid.getRowData(rowId);
    jq_grid.jqGrid('setCell',rowId,data.D_H=="D" ? "Debe" : "Haber",importe);
    //#endregion

    //#region IGV
    var rowId=dataIDs[1];
    var data = jq_grid.getRowData(rowId);
    jq_grid.jqGrid('setCell',rowId,data.D_H=="D" ? "Debe" : "Haber",jq_impuesto.val());
    //#endregion

    //#region Mixta
    if (jq_destino_operacion.val() =='005' ) {
        var filas_maximas=4;
        if(jq_icbper.val()>0) filas_maximas++;
        // if(jq_icbper.val()>0 && jq_mixta.val()>0) filas_maximas++;
        if(dataIDs.length < filas_maximas){
            var rowId=dataIDs[jq_icbper.val()>0 ? 3 : 2];
            var data = jq_grid.getRowData(rowId);
            data.Debe = data.D_H=="D" ? jq_mixta.val() : 0
            data.Haber = data.D_H=="H" ? jq_mixta.val() : 0
            data.Tipo_Referencia = jq_tipo_documento.val();
            data.Fecha_Referencia = getDateFormat(jq_fecha_emision.val(),'y-m-d','d/m/y','-','/');
            data.Fecha_Vencimiento = getDateFormat(jq_fecha_vencimiento.val(),'y-m-d','d/m/y','-','/');
            data.Fecha2 = getDateFormat(jq_fecha_referencia.val(),'y-m-d','d/m/y','-','/');
            jq_grid.jqGrid('addRowData', undefined, data,"after",rowId );  
            // jq_grid.jqGrid('setCell',rowId,data.D_H=="D" ? "Debe" : "Haber",$(this).val());
        }else{
            var rowId=dataIDs[jq_icbper.val()>0 ? 4 : 3];
            var data = jq_grid.getRowData(rowId);
            jq_grid.jqGrid('setCell',rowId,data.D_H=="D" ? "Debe" : "Haber",jq_mixta.val());

        }
    }
    //#endregion

    calcularMeMnDetalle();
}

function jqgridDetalleContableLoadComplete(){
    jq_tipo_documento.trigger("change");
    jq_tipo_documento_referencia.trigger("change");
    jq_fecha_emision.trigger("change");
    jq_fecha_vencimiento.trigger("change");
    jq_fecha_referencia.trigger("change");
    jq_moneda.trigger("change");
    jq_tasa_cambio.trigger("change");
    //jq_forma_pago.trigger("change");
}

function rellenar_codigo_anexo_detalle(){
    
}

function rellenar_anexos(codigo, tipo){
    if(!isEmptyOrWhiteSpaces(codigo)){
        $.ajax({
            type: 'POST',
            url: url_anexo_datos,
            data: {codigo: codigo, tipo: tipo},
            success: function (result){
                result.forEach(list=>{
                    var ruc_dni=''
                    switch(list.Tipo_documento){
                        case "01":
                            ruc_dni=list.Numero_DNI;
                        break;
                        case "06":
                            ruc_dni=list.Numero_Ruc;
                        break;
                        default:
                            ruc_dni=list.Numero_Doc;
                        break;
                    }
                    jq_porcentaje_detraccion.val("0.00");
                    jq_porcentaje_retencion.val("0.00");
                    jq_codigo_anexo.val(list.Codigo);
                    jq_nombre_anexo.val(list.Nombre);

                    rellenar_formas_pago(list.Codigo,tipo);
                    if (list.Pais == '001'|| list.Pais == '' || list.Pais == null ) {
                        relllenar_detracciones(list.Codigo);
                        $("#retencion_si").hide();
                        $("#retencion_si_2").hide();
                        return true;
                    }
                    if (list.Pais != '001') {
                        $("#retencion_si").show();
                        $("#retencion_si_2").show();
                        rellenar_retencion_no_domiciliado(list.Codigo);
                    }

                });

                var jq_grid = jq_grid_detalle_contable;

                var dataIDs = jq_grid.getDataIDs(); 
                
                for(i = 0; i < dataIDs.length; i++)
                {
                    var rowId=dataIDs[i];
                    var data = jq_grid.getRowData(rowId);
                    if(jq_tipo_anexo.val() == data.Tipo_Anexo){
                        jq_grid.jqGrid('setCell',rowId,"Codigo_Anexo",jq_codigo_anexo.val());
                        jq_grid.jqGrid('setCell',rowId,"Nombre_Anexo",jq_nombre_anexo.val());
                    }
                }
                
            }
        });
    }
};


function recalcular_montos_ventas(){
    
}