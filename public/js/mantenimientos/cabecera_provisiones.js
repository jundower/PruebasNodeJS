var fecha_trabajo=new Date();
var short_fecha_trabajo="";

var url_subvoucher_lista="/subvoucher/lista";
var url_tipo_auxiliar_lista="/tipo_auxiliar/lista";
var url_tasa_cambio="/tipo_cambio/tasa_cambio";
var url_tipo_documento = '/tipo_documento/lista/Todos';
var url_tipo_documento_porcentaje = '/tipo_documento/porcentaje';
var url_clasificacion_lista = '/clasificacion_bien_servicios/lista';
var url_periodo_contable = '/periodo_contable/datos';
var url_numero_comprobante = '/subvoucher/correlativo';
var url_anexo_datos= '/anexos/datos';
var url_forma_pago_clientes= '/forma_pago/clientes';
var url_detracciones_datos ="/detracciones/datos";
var url_retencion_no_domiciliado_datos ="/retencion_no_domiciliado/datos";
var url_cuentas_corrientes = '/cuentas_corrientes/lista/todos';
var url_cobrador = '/cobrador/lista/todos';


var modal_lista_anticipos = 'modal_lista_anticipos';
var modal_title_lista_anticipos = 'modal_title_lista_anticipos';

var fecha_vencimiento = "fecha_vencimiento";
var nombre_anexo = "nombre_anexo";
var forma_pago = "forma_pago";
var dias = "dias";


var glosa = "glosa";
var fecha_comprobante = "fecha_comprobante";

var jq_modal_lista_anticipos;
var jq_modal_title_lista_anticipos;

var jq_fecha_vencimiento;
var jq_nombre_anexo;
var jq_forma_pago;
var jq_dias;

var jq_glosa;
var jq_fecha_comprobante

$(document).ready(function() {

    jq_modal_lista_anticipos = $("#"+modal_lista_anticipos);
    jq_modal_title_lista_anticipos = $("#"+modal_title_lista_anticipos);
    
    jq_codigo_anexo = $("#codigo_anexo");
    jq_nombre_anexo = $("#"+nombre_anexo);
    jq_forma_pago = $("#"+forma_pago);
    jq_fecha_vencimiento = $("#"+fecha_vencimiento);
    jq_dias = $("#"+dias);

    jq_glosa = $("#"+glosa);
    jq_fecha_comprobante = $("#"+fecha_comprobante);
    
    jq_dias.focusin(function(){
        $(this).select();
    });
    jq_dias.change(function() {
        var ndias = jq_dias.val();
        var fecha = new Date(jq_fecha_emision.val());
        jq_fecha_vencimiento.val(sumar_dias(fecha,ndias));
    });
    jq_dias.keyup(function() {
        var ndias = jq_dias.val();
        var fecha = new Date(ndias.val());
        jq_fecha_vencimiento.val(sumar_dias(fecha,ndias));
    });
    
    jq_fecha_vencimiento.change(function() {
        var dias = restar_fechas(new Date(jq_fecha_vencimiento.val()),new Date(jq_fecha_emision.val()));
        jq_dias.val(dias)
    });
    
    jq_codigo_anexo.keyup(function() {
        rellenar_anexos($(this).val(), jq_tipo_anexo.val());
    });

});

async function cargar_porcentaje_impuesto_documento(tipo_documento) {
    
   await $.ajax({
        type: 'POST',
        url: url_tipo_documento_porcentaje,
        data: {
            tipo_documento: tipo_documento
        },
        success: function (datos) {

            if (datos[0].Renta_Cuarta == "S") {
                var rows = jq_grid_detalle_contable.jqGrid('getDataIDs');
                for (let i = 0; i < rows.length; i++) {
                    jq_grid_detalle_contable.delRowData(rows[1]);
                }
                 $.ajax({
                    type: 'POST',
                    url: '/plan_contable/renta_cuarta',
                    success: function (fila) {
                        var element = fila[0];

                        var jq_grid = jq_grid_detalle_contable;
                        var dataIDs = jq_grid.getDataIDs(); 
                        var rowId=dataIDs[1];
                        var data = jq_grid.getRowData(rowId);
                        data.Cuenta = element.Codigo;
                        data.Nombre_Cuenta = element.Nombre;
                        data.D_H = modulo == 'cuentas_por_pagar'?'H':'D';
                        data.Tipo_Referencia = jq_tipo_documento.val();
                        data.Fecha_Referencia = getDateFormat(jq_fecha_emision.val(),'y-m-d','d/m/y','-','/');
                        data.Fecha_Vencimiento = getDateFormat(jq_fecha_vencimiento.val(),'y-m-d','d/m/y','-','/');
                        data.Forma_Pago = jq_forma_pago.val();
                        data.Tipo2 = jq_tipo_documento_referencia.val();
                        data.Fecha2 = getDateFormat(jq_fecha_referencia.val(),'y-m-d','d/m/y','-','/');
                        data.Si_Transferencia = element.Si_Transferencia;
                        data.Si_CenCos = element.Si_CenCos;
                        data.Si_Ot = element.Si_Ot;
                        data.Si_Diferencia = element.Si_Genera_Diferencia;
                        data.Tipo_Anexo = element.Tipo_Auxiliar;
                        if(element.Tipo_Auxiliar=="00"){
                            data.Tipo_Origen='N';
                        }else{
                            data.Tipo_Origen='I';
                        }
                        jq_grid.jqGrid('addRowData', undefined, data,"before",rowId );
                        var arr = jq_grid.getDataIDs();
                        $("#lista_select_cencos_"+arr[1]).prop("disabled",data.Si_CenCos=="N");
                    }
                });
            }else{
                var rows = jq_grid_detalle_contable.jqGrid('getDataIDs');
                for (let i = 0; i < rows.length; i++) {
                    jq_grid_detalle_contable.delRowData(rows[1]);
                }

                 $.ajax({
                    type: 'POST',
                    url: '/subvoucher/detalle/',
                    data: {
                        subvoucher: jq_subvoucher.val(),
                        moneda: jq_moneda.val()
                    },
                    success: function (datos) {
                        datos.forEach((element, index) => {
                            if (index == 1) {
                                var jq_grid = jq_grid_detalle_contable;
                                var dataIDs = jq_grid.getDataIDs(); 
                                var rowId=dataIDs[1];
                                var data = jq_grid.getRowData(rowId);
                                data.Cuenta = element.Cuenta;
                                data.Nombre_Cuenta = element.Nombre;
                                data.D_H =  jq_tipo_documento.val() == "07"?  element.D_H == "D" ? "H": "D" : element.D_H;
                                data.Tipo_Referencia = jq_tipo_documento.val();
                                data.Fecha_Referencia = getDateFormat(jq_fecha_emision.val(),'y-m-d','d/m/y','-','/');
                                data.Fecha_Vencimiento = getDateFormat(jq_fecha_vencimiento.val(),'y-m-d','d/m/y','-','/');
                                data.Forma_Pago = jq_forma_pago.val();
                                data.Tipo2 = jq_tipo_documento_referencia.val();
                                data.Fecha2 = getDateFormat(jq_fecha_referencia.val(),'y-m-d','d/m/y','-','/');
                                data.Si_Transferencia = element.Si_Transferencia;
                                data.Si_CenCos = element.Si_CenCos;
                                data.Si_Diferencia = element.Si_Genera_Diferencia;
                                data.Tipo_Anexo = element.Tipo_Auxiliar;
                                if(element.Tipo_Auxiliar=="00"){
                                    data.Tipo_Origen='N';
                                }else{
                                    data.Tipo_Origen='I';
                                }
                                jq_grid.jqGrid('addRowData', undefined, data,"before",rowId );
                                var arr = jq_grid.getDataIDs();
                                $("#lista_select_cencos_"+arr[1]).prop("disabled",data.Si_CenCos=="N");
                            }
            
                        });
                        //jqgridDetalleContableLoadComplete();
                    }
                });
            }

            var porcentaje = datos[0].Porcentaje
            jq_porcentaje_impuesto.val(porcentaje.toFixed(2));
            jq_porcentaje_impuesto.attr("monto",datos[0].Minimo_Porcentaje);
            jq_porcentaje_impuesto.attr("renta_cuarta",datos[0].Renta_Cuarta);
            
            // jq_impuesto.val((jq_subtotal.val()*(jq_porcentaje_impuesto.val()/100)).toFixed(2));
            // jq_importe.val((Number(jq_subtotal.val())+Number(jq_impuesto.val())).toFixed(2));

            // if (jq_subtotal.val() != '0.00') {
            //     rellenar_moneda_2();
            // }     
            calcular_valores("SubTotal")
        }
    });
}

function cargar_periodo_ejercicio_contable(tipo_documento,cancelacion) {
    $.ajax({
        type: 'POST',
        url: url_periodo_contable,
        data: {
            año: fecha_trabajo.getFullYear(),
            mes: fecha_trabajo.getMonth()+1
        },
        success: function (datos) {

            if (cancelacion != true) {
                jq_ejercicio.val(datos[0].Ejercicio);
                jq_periodo.val(datos[0].Periodo);
            }

            $.ajax({
                type: 'POST',
                url: url_numero_comprobante,
                data: {
                    ejercicio: datos[0].Ejercicio,
                    periodo: datos[0].Periodo,
                    subvoucher: tipo_documento
                },
                success: function (datos) {
                    jq_numero_documento.val(datos)
                }
            })
        }
    });
}

function rellenar_formas_pago(codigo,tipo, set_predeterminado){
    tipo_forma_pago = tipo; //tipo_forma_pago pertenece a lista_mantenimientos.js
    $.ajax({
        type: 'POST',
        url: url_forma_pago_clientes,
        data:{
            codigo:codigo,
            tipo: tipo,
        },
        success: function (result){    
            var predeterminado='';       
            var dias_predeterminado='';
            let select=jq_forma_pago;
            select.html('');
            result.forEach(list=>{
                select.append(
                  '<option value="'+list.Codigo+'" dias ="'+list.Nro_dias+'">'+list.Nombre + '</option>'
                );
                if(list.Predeterminado=='S'){
                    predeterminado=list.Codigo;
                    dias_predeterminado=list.Nro_dias;
                };
            });

            if(!isEmptyOrWhiteSpaces(set_predeterminado)){
                select.val(set_predeterminado);
                var jq_grid = jq_grid_detalle_contable;
                var dataIDs = jq_grid.getDataIDs(); 
                dataIDs.forEach(rowid => {
                    $("#lista_select_forma_pago_"+rowid).val(set_predeterminado);
                });
                calcular_formas_pago();     
            }else{
                if( predeterminado != ''){
                    select.val(predeterminado);
                    calcular_formas_pago();
                }
            }
            select.change(function() {
                calcular_formas_pago();   
            });
        }
    });
};

function calcular_formas_pago(){
    
    var ndias = $("#"+forma_pago+" option:selected").attr("dias");
    var fecha = new Date(jq_fecha_emision.val());
    jq_fecha_vencimiento.val(sumar_dias(fecha,ndias || 0));
    var jq_grid = jq_grid_detalle_contable;
    var dataIDs = jq_grid.getDataIDs(); 
    dataIDs.forEach(rowid => {
        $("#lista_select_forma_pago_"+rowid).val(jq_forma_pago.val());
    });

    jq_fecha_vencimiento.trigger("change");
};

async function relllenar_detracciones(codigo,set_predeterminado){

    await $.ajax({
        type: 'POST',
        url: url_detracciones_datos,
        data:{
            codigo:codigo,
        },
        success: function (result){  
            let select=jq_detraccion_provisiones;
            select.html('');
            result.forEach(list=>{
                select.append(
                  '<option value="'+list.Codigo+'" monto_minimo="'+list.Monto_Minimo+'">'+list.Nombre + '</option>'
                );

                if(list.Predeterminado=='S'){
                    if (isEmptyOrWhiteSpaces(set_predeterminado)) {
                        jq_detraccion_check.prop("checked", true);
                    }
                    var porcentaje = list.Porcentaje
                    jq_porcentaje_detraccion.val(porcentaje.toFixed(2));
                    if (list.Editar_Porcentaje == '1') {
                        jq_porcentaje_detraccion.prop("disabled", false);
                    }
                    //calcular_valores();
                };
            });
            if (isEmptyOrWhiteSpaces(set_predeterminado)) {
                calcular_valores();
            }
            if (!isEmptyOrWhiteSpaces(set_predeterminado)) {
                jq_detraccion_provisiones.val(set_predeterminado);
                jq_detraccion_provisiones.trigger("change");
            }
        }
    });
};

async function rellenar_retencion_no_domiciliado(codigo, set_predeterminado) {

    await $.ajax({
        type: 'POST',
        url: url_retencion_no_domiciliado_datos,
        data: {
            codigo: codigo
        },
        success: function (result) {
            let select=jq_retencion_no_domiciliado;
            select.html('');
            result.forEach(list=>{
                select.append(
                  '<option value="'+list.Codigo+'">'+list.Nombre + '</option>'
                );
                if(list.Predeterminado=='S'){
                    if (isEmptyOrWhiteSpaces(set_predeterminado)) {
                        jq_retencion_check.prop("checked", true);
                        jq_detraccion_check.prop("checked", false);
                    }
                    
                    var tasa = list.Tasa
                    jq_porcentaje_retencion.val(tasa.toFixed(2));
                    if (list.Editar_Porcentaje == '1') {
                        jq_porcentaje_retencion.prop("disabled", false);
                    }
                    //calcular_valores();
                };
            });
            if (isEmptyOrWhiteSpaces(set_predeterminado)) {
                console.log("consultar");
                calcular_valores();
            }
            if (!isEmptyOrWhiteSpaces(set_predeterminado)) {
                jq_retencion_no_domiciliado.val(set_predeterminado);
                jq_retencion_no_domiciliado.trigger("change");
            }
        }
    });
}

function calcular_tipo_cambio(Fecha,setPredeterminado) {
    $.ajax({
        type:'POST',
        url: '/tipo_documento/fecha_tc',
        data: {
            Codigo_Tipo_Documento: jq_tipo_documento.val()
        },
        success: function (element) {
            var dato = element[0].Fecha_Tc;

            if (dato.toLowerCase() == setPredeterminado) {
                $.ajax({
                    type: 'POST',
                    url: url_tasa_cambio,
                    data: {
                        fecha: Fecha,
                        tipo_cambio: jq_tipo_cambio.val()
                    },
                    success: function (data) {
                        jq_tasa_cambio.val(data);
                        jq_tasa_cambio.trigger("change");
                    }
                });
            }
            //console.log(element);
        }
    });
}

function permisos(){
    $.ajax({
        type: 'POST',
        url: url_configuracion_permisos,
        success: function (e){
            console.log(e);
            var data = e[0];
            if(data.modificar=='N'){
                $("#modificar_lista").prop("disabled",true);
            }
            if(data.eliminar=='N'){
                $("#eliminar_lista").prop("disabled",true);
            }
            if(data.guardar=='N'){
                $("#guardar").prop("disabled",true);
            }
        }
    });
}