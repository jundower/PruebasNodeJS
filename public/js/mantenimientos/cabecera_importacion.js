var url_tasa_cambio="/tipo_cambio/tasa_cambio";
var url_incoterm = '/incoterm/lista';
var url_centro_costos="/cencos/lista";
var url_tipo_documento = '/tipo_documento/lista/Todos';
var url_proveedores_datos= '/proveedores/datos';

var modal_lista_anticipos = 'modal_lista_anticipos';
var modal_title_lista_anticipos = 'modal_title_lista_anticipos';

var tipo = "tipo";
var fecha_deposito = 'fecha_deposito';
var automatico = "automatico";
var manual = "manual";
var numero_correlativo = "numero_correlativo";
var numero_expediente = "numero_expediente";
var numero_referencia = "numero_referencia";
var serie_factura = "serie_factura";
var numero_factura = "numero_factura";
var fecha_embarque = "fecha_embarque";
var codigo_proveedor = "codigo_proveedor";
var fecha_doc = "fecha_doc";
var serie_dua_guia = "serie_dua_guia";
var numero_dua_guia = "numero_dua_guia";
var fecha_llegada = "fecha_llegada";
var nombre_proveedor = "nombre_proveedor";
var documento_referencia2 = "documento_referencia2";
var moneda = "moneda";
var tipo_cambio = "tipo_cambio";
var tasa_cambio = "tasa_cambio";
var centro_costos = "centro_costos";
var numero_importacion = "numero_importacion";
var motivo_referencia2 = "motivo_referencia2";
var agente_aduana = "agente_aduana";
var numero_referencia2 = "numero_referencia2";
var vapor_air = "vapor_air";
var guia_transporte = "guia_transporte";
var interes = "interes";
var fecha_declaracion = "fecha_declaracion";
var numero_declaracion = "numero_declaracion";
var advalorem = "advalorem";
var convenio = "convenio";
var monto_convenio = "monto_convenio";
var sobretasa = "sobretasa";
var ipm ="ipm";
var igv = "igv";
var isc = "isc";
var percepcion = "percepcion";
var tipo_via ="tipo_via";
var incoterm = "incoterm";
var numero_inconterm = "numero_inconterm";
var flete = "flete";
var seguro = "seguro";
var otros = "otros";
var total_cif = "total_cif";

var jq_tipo;
var jq_fecha_deposito;
var jq_automatico;
var jq_manual;
var jq_numero_correlativo;
var jq_numero_expediente;
var jq_numero_referencia;
var jq_serie_factura;
var jq_numero_factura;
var jq_fecha_embarque;
var jq_codigo_proveedor;
var jq_fecha_doc;
var jq_serie_dua_guia;
var jq_numero_dua_guia;
var jq_fecha_llegada;
var jq_nombre_proveedor;
var jq_documento_referencia2;
var jq_moneda;
var jq_tipo_cambio;
var jq_tasa_cambio;
var jq_centro_costos;
var jq_numero_importacion;
var jq_motivo_referencia2;
var jq_agente_aduana;
var jq_numero_referencia2;
var jq_vapor_air;
var jq_guia_transporte;
var jq_interes;
var jq_fecha_declaracion;
var jq_numero_declaracion;
var jq_advalorem;
var jq_convenio;
var jq_monto_convenio;
var jq_sobretasa;
var jq_ipm;
var jq_igv;
var jq_isc;
var jq_percepcion;
var jq_tipo_via;
var jq_incoterm;
var jq_numero_inconterm;
var jq_flete;
var jq_seguro;
var jq_otros;
var jq_total_cif;

$(document).ready(function() {

    jq_modal_lista_anticipos = $("#"+modal_lista_anticipos);
    jq_modal_title_lista_anticipos = $("#"+modal_title_lista_anticipos);
    
    jq_tipo = $("#"+tipo);
    jq_fecha_deposito = $("#"+fecha_deposito);
    jq_automatico = $("#"+automatico);
    jq_manual = $("#"+manual);
    jq_numero_correlativo = $("#"+numero_correlativo);
    jq_numero_expediente = $("#"+numero_expediente);
    jq_numero_referencia = $("#"+numero_referencia);
    jq_serie_factura = $("#"+serie_factura);
    jq_numero_factura = $("#"+numero_factura);
    jq_fecha_embarque = $("#"+fecha_embarque);
    jq_codigo_proveedor = $("#"+codigo_proveedor);
    jq_fecha_doc = $("#"+fecha_doc);
    jq_serie_dua_guia = $("#"+serie_dua_guia);
    jq_numero_dua_guia = $("#"+numero_dua_guia);
    jq_fecha_llegada = $("#"+fecha_llegada);
    jq_nombre_proveedor = $("#"+nombre_proveedor);
    jq_documento_referencia2 = $("#"+documento_referencia2);
    jq_moneda = $("#"+moneda);
    jq_tipo_cambio = $("#"+tipo_cambio);
    jq_tasa_cambio = $("#"+tasa_cambio);
    jq_centro_costos = $("#"+centro_costos);
    jq_numero_importacion = $("#"+numero_importacion);
    jq_motivo_referencia2 = $("#"+motivo_referencia2);
    jq_agente_aduana = $("#"+agente_aduana);
    jq_numero_referencia2 = $("#"+numero_referencia2);
    jq_vapor_air = $("#"+vapor_air);
    jq_guia_transporte = $("#"+guia_transporte);
    jq_interes = $("#"+interes);
    jq_fecha_declaracion = $("#"+fecha_declaracion);
    jq_numero_declaracion = $("#"+numero_declaracion);
    jq_advalorem = $("#"+advalorem);
    jq_convenio = $("#"+convenio);
    jq_monto_convenio = $("#"+monto_convenio);
    jq_sobretasa = $("#"+sobretasa);
    jq_ipm = $("#"+ipm);
    jq_igv = $("#"+igv);
    jq_isc = $("#"+isc);
    jq_percepcion = $("#"+percepcion);
    jq_tipo_via = $("#"+tipo_via);
    jq_incoterm = $("#"+incoterm);
    jq_numero_inconterm = $("#"+numero_inconterm);
    jq_flete = $("#"+flete);
    jq_seguro = $("#"+seguro);
    jq_otros = $("#"+otros);
    jq_total_cif = $("#"+total_cif);
    
    jq_flete.keyup(function () {
        recalcular_montos_importacion('Flete'); 
    });
    // jq_base_calculada.prop( "disabled", true );
    // jq_monto_descuento.prop( "disabled", true );
    // jq_subtotal.prop( "disabled", true );
    // jq_igv.prop( "disabled", true );
    // jq_icbper.prop( "disabled", true );
    // jq_anticipos.prop( "disabled", true );
    // jq_total.prop( "disabled", true );

    // jq_codigo_cliente.keyup(function() {
    //     rellenar_clientes($(this).val());
    // });
    // jq_nombre_cliente.keyup(function() {
    //     rellenar_clientes($(this).val());
    // });
    // jq_codigo_cliente.keyup(function() {
    //     rellenar_clientes($(this).val());
    // });
    // jq_codigo_proveedor.keyup(function() {
    //     rellenar_proveedores($(this).val());
    // });
    
    // rellenar_autocomplete_cliente();
});

$(document).on("keydown", function(e) {
    var keycode = (e.keyCode ? e.keyCode : e.code);
    var id_focused=$("*:focus").attr("id");
    //console.log(id_focused);
    if(keycode == '13'){ //13 enter
        e.preventDefault();
    }
    if(keycode == '122'){ //122 F11
        e.preventDefault();
        if(jq_codigo_cliente.val() != ''){
            abrir_anticipos();
            cargar_jq_grid_lista_anticipos(jq_codigo_cliente.val());
        }
        else{
            mostrarMensajeModal("Aviso", "Debes Seleccionar un Cliente.");
        }   
    }
});

function setCabeceraVentas(_url_motivos_tramite_series){
    url_motivos_tramite_series= _url_motivos_tramite_series;
};

function rellenar_clientes(codigo){
    if(!isEmptyOrWhiteSpaces(codigo)){
        $.ajax({
            type: 'POST',
            url: url_clientes_datos,
            data: {codigo: codigo},
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
                    jq_codigo_cliente.val(list.Codigo);
                    jq_ndoc_id.val(list.Numero_Doc);
                    jq_ruc_cliente.val(ruc_dni);
                    jq_nombre_cliente.val(list.Nombre);
                    jq_direccion_cliente.val(list.Direccion);
                    jq_punto_llegada_cliente.val(list.Direccion);
                    jq_vendedor1.val(list.Vendedor_codigo);
                    jq_vendedor3.val(list.Vendedor_codigo);
                    jq_telefono_cliente.val(list.Telefono);
                    jq_email_cliente.val(list.Email);
                    jq_porc_descuento.val(list.Porc_descuento);
                    pais_cliente = list.Codigo_Pais,
                    extranjero =  (pais_cliente != "001"); //Usado para el calcular_totales_facturacion de detalle ventas
                    tipo_documento_cliente = list.Tipo_documento,
                    rellenar_formas_pago(list.Codigo,'12');
                    rellenar_sublista_clientes(list.Codigo, url_lista_precios_cliente,"lista_precios",list.Lista_Precios,true);
                    rellenar_sublista_clientes(list.Codigo, url_clientes_contactos,"contacto_cliente");
                    rellenar_sublista_clientes(list.Codigo, url_clientes_agencias,"agencia_cliente");
                    recalcular_montos_ventas();
                });
            }
        });
    }
};

function rellenar_sublista_clientes(codigo, url, element, set_predeterminado,trigger_change){
    $.ajax({
        type: 'POST',
        url: url,
        data:{
            codigo:codigo,
        },
        success: function (lists){
            var predeterminado='';      
            let select=$("#"+element);
            select.html('');
            lists.forEach(list=>{
                select.append(
                  '<option value="'+list.Codigo+'" >'+list.Nombre + '</option>'
                );
                if(list.Predetermniado=='S'){
                    predeterminado=list.Codigo;
                };
            });
            
            if( predeterminado != ''){
                select.val(predeterminado);
            }
            if(!isEmptyOrWhiteSpaces(set_predeterminado)){
                select.val(set_predeterminado);
            }
            if (lists.length == 0) {
                select.append('<option value="00" >00 - NINGUNO</option>');
            }
            if(trigger_change) select.trigger("change");

        }
    });
};

function rellenar_autocomplete_cliente(){
    $.ajax({
        type: 'POST',
        url: '/clientes/lista/',
        success: function (result){
            var tags_codigos =[];
            var tags_rucs =[];
            var tags_nombres =[];
            result.forEach(element => {
                tags_codigos.push(element.Codigo);
                tags_rucs.push(element.Numero_Ruc);
                tags_nombres.push(element.Nombre);
            });
            
            jq_codigo_cliente.autocomplete({
                source: tags_codigos,
                select: function(event, ui){
                    rellenar_clientes(ui.item.value);
                }
            });
           
            jq_ruc_cliente.autocomplete({
                source: tags_rucs,
                select: function(event, ui){
                    rellenar_clientes(ui.item.value);
                }
            });
           
            jq_nombre_cliente.autocomplete({
                source: tags_nombres,
                select: function(event, ui){
                    rellenar_clientes(ui.item.value);
                }
            });
           
       }
   });
};

function rellenar_proveedores(codigo){
    if(!isEmptyOrWhiteSpaces(codigo)){
        $.ajax({
            type: 'POST',
            url: url_proveedores_datos,
            data: {codigo: codigo},
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
                    jq_codigo_proveedor.val(list.Codigo);
                    jq_nombre_proveedor.val(list.Nombre);
                    pais_proveedor = list.Codigo_Pais;
                    extranjero =  (pais_proveedor != "001"); //Usado para el calcular_totales_facturacion de detalle ventas
                    //recalcular_montos_ventas();
                });
            }
        });
    }
};

function rellenar_codigo_anexo_mantenimiento() {
    console.log('jagsjdaksd');
};

async function rellenar_codigo_incoterm(url_post, elemento, id_predeterminado, value_predeterminado, trigger){
    var jq_elemento = $('#'+elemento);
    var req = false;
    await $.ajax({
        type: 'POST',
        url: url_post,
        success: function (result){
            jq_elemento.html('');
            console.log(result);
            result.forEach(list=>{
                jq_elemento.append('<option value="'+list.Codigo+'" >'+list.Nombre + "</option>");
            });
            if (!isEmptyOrWhiteSpaces(id_predeterminado)) {
                jq_elemento.val($('#'+id_predeterminado).val()); ///Dinámico
            }
            if (!isEmptyOrWhiteSpaces(value_predeterminado)) {
                jq_elemento.val(value_predeterminado); ///Dinámico
            }
            if(!isEmptyOrWhiteSpaces(trigger)){
                jq_elemento.trigger(trigger);
            }
            // jq_elemento.val(predeterminado);
            req = true;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            req = false;
        }
    });

    return req;
};
