var fecha_trabajo=new Date();
var short_fecha_trabajo="";
var url_motivo_tramites="/talonarios/motivos_serie_correlativo";
var url_cuenta_transferencia = "/plan_contable/transferencias";
var url_ejercicio = "/periodo_contable/ejercicio";
var url_periodo = "/periodo_contable/lista";
var url_cuenta_icbper = "/plan_contable/icbper";
var url_configuracion_permisos = '/configuraciones/configuracion_permisos/proceso_contabilidad__sist_contabilidad__movimientos_contables';
//var url_guardar = "/pedido/guardar";

var subvoucher = "subvoucher";
var guia_entrada = "guia_entrada";
var moneda = "moneda";
var tipo_documento_referencia = "tipo_documento_referencia";
var tipo_documento = "tipo_documento";
var fecha_emision = "fecha_emision"
var subtotal = "subtotal";
var detraccion_provisiones = "detraccion_provisiones";
var fecha_registro = "fecha_registro";
var Standar = "Standar";
var registro_venta = "registro_venta";
var registro_compra = "registro_compra";
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
var impuesto = "impuesto";
var icbper = "icbper";
var importe = "importe";
var percepcion = "percepcion";
var glosa = "glosa";
var Serie_Guia = "";
var Codigo_Punto_Venta = "";
var porcentaje_detraccion = "porcentaje_detraccion";
var porcentaje_percepcion = "porcentaje_percepcion";
var porcentaje_retencion = "porcentaje_retencion";
var detraccion_check = "detraccion_check";


Tipo_Documento_Guia = "";

var modal_ventana_lista = "modal_ventana_lista";

var jq_subvoucher;
var jq_guia_entrada;
var jq_moneda;
var jq_tipo_documento_referencia;
var jq_tipo_documento;
var jq_fecha_emision;
var jq_subtotal;
var jq_detraccion_provisiones;
var jq_fecha_registro;
var jq_Standar;
var jq_registro_venta;
var jq_registro_compra;
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
var jq_impuesto;
var jq_icbper;
var jq_importe;
var jq_percepcion;
var jq_glosa;
var jq_Serie_Guia;
var jq_Codigo_Punto_Venta;
var jq_porcentaje_detraccion;
var jq_porcentaje_percepcion;
var jq_porcentaje_retencion;
var jq_detraccion_check;

var modulo="";
var titulo="";
var parametros_contables="";
var pression;
var celdas_nuevas = [];
var jq_modal_ventana_lista;

$(document).ready(function() {

    jq_modal_ventana_lista = $("#"+modal_ventana_lista);
   
    jq_subvoucher = $("#"+subvoucher);
    jq_guia_entrada = $("#"+guia_entrada);
    jq_moneda = $("#"+moneda);
    jq_tipo_documento_referencia = $("#"+tipo_documento_referencia);
    jq_tipo_documento = $("#"+tipo_documento);
    jq_fecha_emision = $("#"+fecha_emision);
    jq_subtotal = $("#"+subtotal);
    jq_detraccion_provisiones = $("#"+detraccion_provisiones);
    jq_fecha_registro = $("#"+fecha_registro);
    jq_Standar = $("#"+Standar);
    jq_registro_venta = $("#"+registro_venta);
    jq_registro_compra = $("#"+registro_compra);
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
    jq_impuesto = $("#"+impuesto);
    jq_icbper = $("#"+icbper);
    jq_importe = $("#"+importe);
    jq_percepcion = $("#"+percepcion);
    jq_glosa = $("#"+glosa);
    jq_porcentaje_detraccion = $("#"+porcentaje_detraccion);
    jq_porcentaje_percepcion = $("#"+porcentaje_percepcion);
    jq_porcentaje_retencion = $("#"+porcentaje_retencion);
    jq_detraccion_check = $("#"+detraccion_check);

    jq_automatico.click(function() {
        rellenar_numero_contable(jq_subvoucher.val());
    });
    jq_manual.click(function() {
        rellenar_numero_contable();
    });
    jq_ejercicio.change(function(){
        rellenar_periodo_contable(jq_periodo.val().slice(0,-4)+jq_ejercicio.val());
        rellenar_numero_contable(jq_subvoucher.val());
    });
    jq_periodo.change(function () {
       rellenar_numero_contable(jq_subvoucher.val()); 
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
        rellenar_numero_contable(jq_subvoucher.val());
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
    jq_mixta.keyup(function(){
        //calcular_valores("SubMixta");
    });
    jq_subtotal.keyup(function(){
        // calcular_valores("SubTotal");
        // if (jq_destino_operacion.val() == '004') {
        //     jq_monto_retencion.trigger("change");
        // }
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
                    console.log(element);

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
    jq_importe.keyup(function(){
        rellenar_moneda_2();
    });
    jq_moneda.change(function () {  
        //calcular_valores();
    });
    jq_destino_operacion.change(function() {
        switch (jq_destino_operacion.val()) {
            case '004':
                //jq_porcentaje_impuesto.val('0.00');
                //jq_impuesto.val('0.00');
                //jq_importe.val(jq_subtotal.val());
                jq_mixta.val('0.00')
                jq_mixta.prop("disabled", true);
                break;
            case '005':
                //cargar_porcentaje_impuesto_documento(jq_tipo_documento.val());
                jq_mixta.val('0.00')
                jq_mixta.prop("disabled", false);
                break;
            default:
                cargar_porcentaje_impuesto_documento(jq_tipo_documento.val());
                jq_mixta.val('0.00')
                jq_mixta.prop("disabled", true);
                break;
        }
        //calcular_valores();
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

    $('input:radio[name="tipo_registro"]').change(function() {
        if ($(this).val() !=  "ST") {
            $("#calculos").prop("hidden", false);
        } else {
            $("#calculos").prop("hidden", true);
        }
    });


    $("#nuevo").show();
    $("#guardar").show();
    $("#listar").show();
    $("#imprimir").show();
    $('#modificar').hide();
    setTitle("Movimientos Contables");
    setTitleLista('Listado de Documentos');
    setListaDocumentos('/contabilidad/lista', '/contabilidad/consultar', '/contabilidad/detalle','','listado_documento_provisiones',modulo == 'cuentas_por_pagar'?'PAG':'COB');
    setListaDocumentosContables('/provisiones/lista_documentos_pendientes', 'listado_documento_contables');
    nuevo();  
});

function nuevo(){

    estado="guardar";
    short_fecha_trabajo =  getShortDate(fecha_trabajo);
    jq_automatico.prop('checked', true);
    jq_manual.prop('checked', false);
    jq_Standar.prop('checked', true);
    jq_fecha_registro.prop( "disabled", true );
    jq_porcentaje_impuesto.prop( "disabled", true );
    jq_subtotal.val("0.00");
    jq_mixta.val("0.00");
    jq_mixta.prop("disabled", true);
    jq_impuesto.val("0.00");
    jq_icbper.val("0.00");
    jq_importe.val("0.00");

    rellenar_codigo_nombre(url_subvoucher_lista,"subvoucher",'','06');
    rellenar_codigo_nombre(url_tipo_auxiliar_lista,"tipo_anexo",'','12');
    rellenar_codigo_nombre(url_tipo_documento,"tipo_documento_referencia",'','00');
    rellenar_codigo_nombre(url_tipo_documento,"tipo_documento",'',"00");
    rellenar_codigo_nombre(url_clasificacion_lista,"clasificacion",'',"00");
    rellenar_ejercicio_contable("ejercicio",fecha_trabajo.getFullYear());
    rellenar_moneda(moneda);
    rellenar_tasa_cambio(tasa_cambio, short_fecha_trabajo,jq_tipo_cambio.val()) //Mantener este orden de tasa/tipo, porque si no, no funciona dinamicamente y siempre agarrará VTA
    rellenar_tipo_cambio(tipo_cambio,tasa_cambio, fecha_registro); //Mantener este orden de tasa/tipo, porque si no, no funciona dinamicamente y siempre agarrará VTA
    cargar_configuraciones();

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
    jq_mixta.val("0.00");
    jq_impuesto.val("0.00");
    jq_icbper.val("0.00");
    jq_importe.val("0.00");
    jq_detraccion_provisiones.val("");
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
            Porcentaje_Detraccion: 0,
            Porcentaje_Retencion_No_Domiciliado: 0,
            Porcentaje_Percepcion: 0,
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
                        newFila.Numero_Referencia = element.Numero_Referencia;
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
        }else{
            console.log('no se realizo nada');
        }
        
    }
    guardar_2();
};

function guardar_2() {
    url_guardar="";
    var mensaje="";
    var impresion=false;
    switch (estado) {
        case 'guardar':
            url_guardar = "/contabilidad/guardar";
            mensaje = "Guardado satisfactoriamente."
            impresion=true;
            break;
        case  'modificar':
            url_guardar = "/contabilidad/modificar";
            mensaje = "Modificado satisfactoriamente."
            break;
        case 'eliminar':
            url_guardar = "/contabilidad/eliminar";
            mensaje = "Eliminado satisfactoriamente."
            break;
        case 'anular':
            url_guardar = "/contabilidad/anular";
            mensaje = "Anulado satisfactoriamente."
            break;
    }

    var filas_detalle= [];
    var rows = jq_grid_detalle_contable.jqGrid('getDataIDs');
    var automatico = (jq_automatico.prop('checked') == true ? "A" : "M");
    var tipo_registro = jq_registro_venta.prop('checked') == true ? "RV":jq_registro_compra.prop('checked') == true ? "RC":"ST";

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

     $.ajax({
         url: url_guardar,
         type: 'post',
         data:{
             ejercicio: jq_ejercicio.val(),
             periodo: jq_periodo.val(),
             codigo_subvoucher: jq_subvoucher.val(),
             automatico: automatico,
             fecha_registro : jq_fecha_registro.val(),
             fecha_doc: jq_fecha_emision.val(),
             fecha_referencia: jq_fecha_referencia.val(),
             tipo_documento_referencia: jq_tipo_documento_referencia.val(),
             serie_documento_referencia: jq_serie_referencia.val(),
             numero_documento_referencia: jq_numero_referencia.val(),
             tipo_documento: jq_tipo_documento.val(),
             serie: jq_serie.val(),
             numero: jq_numero.val(),
             numero_correlativo: jq_numero_documento.val(),
             tipo_codigo_auxiliar: jq_tipo_anexo.val(),
             codigo_anexo: jq_codigo_anexo.val(),
             nombre_anexo: jq_nombre_anexo.val(),
             moneda: jq_moneda.val(),
             tipo_cambio: jq_tipo_cambio.val(),
             tasa_cambio: jq_tasa_cambio.val(),
             tipo_registro:  tipo_registro,
             Glosa: jq_glosa.val(),
             estado: "Ingresado",
             destino_operacion: jq_destino_operacion.val(),
             modulo_origen: 'CONT',
             erp_Dsubtotal: jq_subtotal.val(),
             erp_Dsubtotal_No_Grabada: jq_destino_operacion.val() == '004'? jq_subtotal.val(): jq_destino_operacion.val() == '005' ? jq_mixta.val() : 0 ,
             erp_Digv: jq_impuesto.val(),
             erp_Dimporte: jq_importe.val(),
             fecha_vencimiento: jq_fecha_vencimiento.val(),
             detraccion_sn: 'N',
             codigo_detraccion: jq_detraccion_provisiones.val(),
             forma_pago: '00',
             porcentaje_percepcion: 0,
             porcentaje_impuesto: '0',
             dias: '0',
             porcentaje_detraccion: '0',
             percepcion_sn: 'N',
             retencion_sn: 'N',
             porcentaje_retencion: '0',
             retension_no_domiciliado: 'N',
             retencion_no_domiciliado_sn: 'N',
             porcentaje_retencion_no_domiciliado: '0',
             erp_ICBPER: jq_icbper.val(),
             tipo_transferencia: '00',
             monto_detraccion: '0',
             monto_percepcion: '0',
             clasificacion_bien_servicio: '00',
             monto_retencion: 0,
             Pc_Fecha: '1900/01/01',
             Pc_User: '',
             Pc_Ip: '',
             registro_compra: 'N',
             guia_entrada: '',
             Serie_Guia: '',
             Codigo_Punto_Venta: '',

             filas_detalle: JSON.stringify(filas_detalle)
         },
         success: function(result){
            //  console.log(result);
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
    if(isEmptyOrWhiteSpaces(jq_glosa.val())) {
        retorno = false;
        mostrarMensajeModal("Aviso","Debe ingresar la glosa");
    }

    var jq_grid=jq_grid_detalle_contable;
    var dataIDs = jq_grid.getDataIDs(); 
    for(i = 0; i < dataIDs.length; i++)
    {
        var rowData = jq_grid.jqGrid ('getRowData', dataIDs[i]);
        if(rowData.Si_CenCos=="S" && $("#lista_select_cencos_"+dataIDs[i]).val() =='00'){ 
            retorno=false;
            mostrarMensajeModal("Aviso","Elige Centro de Costos para la Cuenta: "+rowData.Cuenta);
        }
    }

    var SumaHaber = jq_grid.jqGrid('getCol', 'Haber', false, 'sum');
    var SumaDebe = jq_grid.jqGrid('getCol', 'Debe', false, 'sum');
    if((SumaHaber).toFixed(2) != (SumaDebe).toFixed(2)){
        mostrarMensajeModal("Aviso","El Documento esta Descuadrado");
        retorno=false;
    }

    return retorno;
};

async function consultar(impresion) {
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
            cob_pag: "",
            ejercicio: jq_ejercicio.val(),
            periodo: jq_periodo.val(),
            numero_documento_contable : jq_numero_documento.val(),
            subvoucher: jq_subvoucher.val()
        }
    }
    await $.ajax({
        type: "POST",
        url: url_consultar,
        data: data,
        success: function (data) {
            console.log(data);
            jq_ejercicio.val(data[0].Documento_Ejercicio);
            rellenar_periodo_contable(data[0].Documento_Periodo_Contable,'consultar')
            jq_subvoucher.val(data[0].Documento_Codigo_Svoucher);
            jq_fecha_registro.val(data[0].Documento_Fecha_Registro);
            data[0].Documento_Tipo_Registro=="RV" ? jq_registro_venta.prop('checked',true):  jq_registro_venta.prop('checked',false);
            data[0].Documento_Tipo_Registro=="RC" ? jq_registro_compra.prop("checked", true): jq_registro_compra.prop("checked", false);
            data[0].Documento_Tipo_Registro=="ST" ? jq_Standar.prop("checked", true): jq_Standar.prop("checked", false);
            // jq_ejercicio.trigger("change");
            //jq_periodo.val(data[0].Documento_Periodo_Contable);
            data[0].Documento_Automatico=="A" ? jq_automatico.prop('checked', true) : jq_automatico.prop('checked', false)
            data[0].Documento_Automatico=="M" ? jq_manual.prop('checked', true) : jq_manual.prop('checked', false)
            jq_numero_documento.val(data[0].Documento_Numero_Contable);
            jq_guia_entrada.val(data[0].Documento_Guia_Entrada);
            jq_tipo_anexo.val(data[0].Documento_Tipo_Anexo);
            jq_codigo_anexo.val(data[0].Documento_Codigo_Anexo);
            jq_nombre_anexo.val(data[0].Documento_Nombre_Anexo);
            jq_moneda.val(data[0].Documento_Moneda);
            jq_tasa_cambio.val(data[0].Documento_Tasa_Cambio);
            jq_tipo_cambio.val(data[0].Documento_Tipo_Cambio);
            jq_tipo_documento_referencia.val(data[0].Documento_Tipo_Documento_Referencia);
            jq_serie_referencia.val(data[0].Documento_Serie_Documento_Referencia);
            jq_numero_referencia.val(data[0].Documento_Numero_Documento_Referencia);
            jq_fecha_referencia.val(data[0].Documento_Fecha_Referencia_Documento);
            jq_destino_operacion.val(data[0].Documento_Destino_Operacion);
            jq_tipo_documento.val(data[0].Documento_Tipo_Documento =="" ? '001': data[0].Documento_Tipo_Documento);
            jq_serie.val(data[0].Documento_Serie);
            jq_numero.val(data[0].Documento_Numero);
            jq_fecha_emision.val(data[0].Documento_Fecha_Emision);
            jq_dias.val(data[0].Documento_Dias);
            jq_fecha_vencimiento.val(data[0].Documento_Fecha_Vencimiento);
            jq_subtotal.val(formatCurrency(data[0].Documento_Destino_Operacion == '004'?data[0].Documento_SubTotal_NGrabado : data[0].Documento_SubTotal,2));
            jq_mixta.val(formatCurrency(data[0].Documento_Destino_Operacion == "005"? data[0].Documento_SubTotal_NGrabado : 0,2));
            jq_porcentaje_impuesto.val(formatCurrency(data[0].Documento_Porcentaje,2));
            jq_impuesto.val(formatCurrency(data[0].Documento_Igv,2));
            jq_icbper.val(formatCurrency(data[0].Documento_Icbper,2));
            jq_importe.val(formatCurrency(data[0].Documento_Importe,2));      
            if (data[0].Documento_Pais == '001'|| data[0].Documento_Pais == '' || data[0].Documento_Pais == null ) {
                relllenar_detracciones(data[0].Documento_Codigo_Anexo,data[0].Documento_Codigo_Detraccion);
            }
            jq_glosa.val(data[0].Documento_Glosa);

            switch (data[0].Documento_Destino_Operacion) {
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

            if (data[0].Documento_Tipo_Registro !=  "ST") {
                $("#calculos").prop("hidden", false);
            } else {
                $("#calculos").prop("hidden", true);
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
    var jq_grid = jq_grid_detalle_contable;
    var dataIDs = jq_grid.getDataIDs(); 

    if(isEmptyOrWhiteSpaces(jq_importe.val())){
        jq_importe.val("0");
    }
    var importe = jq_importe.val();

    var rowId=dataIDs[0];
    var data = jq_grid.getRowData(rowId);
    jq_grid.jqGrid('setCell',rowId,data.D_H=="D" ? "Debe" : "Haber",importe);

    calcularMeMnDetalle();
}

function jqgridDetalleContableLoadComplete(){
    jq_tipo_documento_referencia.trigger("change");
    jq_fecha_emision.trigger("change");
    jq_fecha_vencimiento.trigger("change");
    jq_fecha_referencia.trigger("change");
    jq_moneda.trigger("change");
    jq_tasa_cambio.trigger("change");
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
                
                // for(i = 0; i < dataIDs.length; i++)
                // {
                //     var rowId=dataIDs[i];
                //     var data = jq_grid.getRowData(rowId);
                //     if(jq_tipo_anexo.val() == data.Tipo_Anexo){
                //         jq_grid.jqGrid('setCell',rowId,"Codigo_Anexo",jq_codigo_anexo.val());
                //         jq_grid.jqGrid('setCell',rowId,"Nombre_Anexo",jq_nombre_anexo.val());
                //     }
                // }
                if(isEmptyOrWhiteSpaces(modulo)){
                    listar_documentos_pendientes_contable(result[0].Tipo_Auxiliar, result[0].Codigo,null,"cabecera");
                }
            }
        });
    }
};

async function rellenar_ejercicio_contable(elemento, setPredeterminado) {

    jq_elemento = $("#"+elemento);
    await $.ajax({
        type: 'POST',
        url: url_ejercicio,
        success:  function (result){

            jq_elemento.html('');
            result.forEach(list=>{
                jq_elemento.append('<option value="'+list.Ejercicio+'" >'+list.Descripcion + '</option>');
            });
            if(setPredeterminado != ""){
                jq_ejercicio.val(setPredeterminado);
                rellenar_periodo_contable(getPeriodo(fecha_trabajo));
            }
        }
    });
};

async function rellenar_periodo_contable(setPredeterminado,consultar) {
    await $.ajax({
        type: 'POST',
        url: url_periodo,
        data:{
            ejercicio: jq_ejercicio.val()
        },
        success: function (result){
            jq_periodo.html('');
            result.forEach(list=>{
                jq_periodo.append('<option value="'+list.Periodo_Contable+'" >'+list.Periodo_Contable + '</option>');
            });
            console.log(consultar);
            if(setPredeterminado != undefined){
                jq_periodo.val(setPredeterminado);
            }
            if (consultar == undefined) {
                rellenar_numero_contable(jq_subvoucher.val());
            }
            // if(periodo_antiguo) jq_periodo.val(periodo_antiguo+jq_ejercicio.val());
            //rellenar_numero_contable(jq_subvoucher.val());
        }
    });
};

async function rellenar_numero_contable(subvoucher) {
    if(jq_automatico.is(':checked')) {
        jq_numero_documento.prop( "disabled", true );  
        await $.ajax({
            type: 'POST',
            url: url_numero_comprobante,
            data: {
                ejercicio: jq_ejercicio.val(),
                periodo: jq_periodo.val(),
                subvoucher: subvoucher
            },
            success: function (datos) {
                jq_numero_documento.val(datos)
            }
        })
    }else{
        jq_numero_documento.prop( "disabled", false );
        jq_numero_documento.val("");
    }
    
}
