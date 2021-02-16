var url_vendedor_lista="/vendedor/lista";
var url_motivos_tramite_series;
var url_unidad_negocio="/unidad_negocios/lista";
var url_centro_costos="/cencos/lista";
var url_orden_trabajo="/orden_trabajo/lista";
var url_presupuesto="/presupuesto/lista";
var url_gestor_cobranza="/gestor_cobranza/lista";
var url_tasa_cambio="/tipo_cambio/tasa_cambio";
var url_punto_venta="/punto_venta/datos";
var url_punto_venta_lista="/punto_venta/lista";
var url_motivo_traslado="/motivo_traslado/lista";
var url_transportista="/transportista/lista";
var url_vehiculo= "/vehiculo/lista"; 
var url_clientes_datos= '/clientes/datos';
var url_tipo_documento = '/tipo_documento/lista/Todos';
var url_tipo_documento_venta = '/tipo_documento/lista/VENTAS';
var url_tipo_documento_ALMACEN = '/tipo_documento/lista/ALMACEN';
var url_chofer = '/chofer/lista';
var url_agencia_transporte = '/agencia_transporte/lista';
var url_detracciones = '/detracciones/lista';
var url_incoterm = '/incoterm/lista';
var url_proveedores_datos= '/proveedores/datos';
var url_almacen = '/almacen/lista';
var url_forma_pago = '/forma_pago/lista';

var url_clientes_contactos= '/clientes/contactos';
var url_clientes_agencias= '/clientes/agencias';
var url_forma_pago_clientes= '/forma_pago/clientes';
var url_lista_precios_cliente= '/lista_precios/clientes';

var url_proveedores_contactos= '/proveedores/contactos';
var url_proveedores_agencias= '/proveedores/agencias';

var modal_lista_anticipos = 'modal_lista_anticipos';
var modal_title_lista_anticipos = 'modal_title_lista_anticipos';

var codigo_cliente="codigo_cliente";
var ruc_cliente="ruc_cliente";
var nombre_cliente="nombre_cliente";
var direccion_cliente="direccion_cliente";
var contacto_cliente="contacto_cliente";
var agencia_cliente="agencia_cliente";
var punto_llegada_cliente="punto_llegada_cliente";
var telefono_cliente="telefono_cliente";
var email_cliente="email_cliente";
var pais_cliente="";
var tipo_documento_cliente="";

var codigo_proveedor="codigo_proveedor";
var ruc_proveedor="ruc_proveedor";
var nombre_proveedor="nombre_proveedor";
var direccion_proveedor="direccion_proveedor";
var contacto_proveedor="contacto_proveedor";
var agencia_proveedor="agencia_proveedor";
var punto_llegada_proveedor="punto_llegada_proveedor";
var telefono_proveedor="telefono_proveedor";
var email_proveedor="email_proveedor";
var pais_proveedor="";
var tipo_documento_proveedor="";
var modulo="";
var glosa = "glosa";
var forma_pago="forma_pago";
var lista_precios="lista_precios";
var ndoc_id="ndoc_id";
var vendedor1="vendedor1";
var vendedor3="vendedor3";
var porc_descuento="porc_descuento";
var dias_forma_pago="dias_forma_pago";
var fecha_doc="fecha_doc";
var fecha_validez="fecha_validez";
var base_calculada = "base_calculada";
var monto_descuento = "monto_descuento";
var subtotal = "subtotal";
var igv = "igv";
var icbper = "icbper";
var anticipos = "anticipos";
var total = "total";
var fecha_comprobante = "fecha_comprobante";

var jq_modal_lista_anticipos;
var jq_modal_title_lista_anticipos;

var jq_codigo_cliente;
var jq_ruc_cliente;
var jq_nombre_cliente;
var jq_direccion_cliente;
var jq_telefono_cliente;
var jq_email_cliente;
var jq_punto_llegada_cliente;
var jq_contacto_cliente;
var jq_agencia_cliente;

var jq_codigo_proveedor;
var jq_ruc_proveedor;
var jq_nombre_proveedor;
var jq_direccion_proveedor;
var jq_telefono_proveedor;
var jq_email_proveedor;
var jq_punto_llegada_proveedor;
var jq_contacto_proveedor;
var jq_agencia_proveedor;

var jq_glosa;
var jq_forma_pago;
var jq_lista_precios;
var jq_ndoc_id;
var jq_vendedor1;
var jq_vendedor3;
var jq_porc_descuento;
var jq_base_calculada;
var jq_monto_descuento;
var jq_subtotal;
var jq_igv;
var jq_icbper;
var jq_anticipos;
var jq_total;
var jq_fecha_doc;
var jq_fecha_comprobante

$(document).ready(function() {

    jq_modal_lista_anticipos = $("#"+modal_lista_anticipos);
    jq_modal_title_lista_anticipos = $("#"+modal_title_lista_anticipos);
    
    jq_codigo_cliente=$("#"+codigo_cliente);
    jq_ruc_cliente=$("#"+ruc_cliente);
    jq_nombre_cliente=$("#"+nombre_cliente);
    jq_direccion_cliente=$("#"+direccion_cliente);
    jq_contacto_cliente=$("#"+contacto_cliente);
    jq_agencia_cliente=$("#"+agencia_cliente);
    jq_punto_llegada_cliente = $("#"+punto_llegada_cliente);
    jq_telefono_cliente = $("#"+telefono_cliente);
    jq_email_cliente = $("#"+email_cliente);

    jq_codigo_proveedor=$("#"+codigo_proveedor);
    jq_ruc_proveedor=$("#"+ruc_proveedor);
    jq_nombre_proveedor=$("#"+nombre_proveedor);
    jq_direccion_proveedor=$("#"+direccion_proveedor);
    jq_contacto_proveedor=$("#"+contacto_proveedor);
    jq_agencia_proveedor=$("#"+agencia_proveedor);
    jq_punto_llegada_proveedor = $("#"+punto_llegada_proveedor);
    jq_telefono_proveedor = $("#"+telefono_proveedor);
    jq_email_proveedor = $("#"+email_proveedor);

    jq_glosa = $("#"+glosa);
    jq_forma_pago=$("#"+forma_pago);
    jq_lista_precios=$("#"+lista_precios);
    jq_dias_forma_pago=$("#"+dias_forma_pago);
    jq_fecha_validez=$("#"+fecha_validez);
    jq_ndoc_id = $("#"+ndoc_id);
    jq_vendedor1 = $("#"+vendedor1);
    jq_vendedor3 = $("#"+vendedor3);
    jq_porc_descuento = $("#"+porc_descuento);
    jq_base_calculada = $("#"+base_calculada);
    jq_monto_descuento = $("#"+monto_descuento);
    jq_subtotal = $("#"+subtotal);
    jq_igv = $("#"+igv);
    jq_icbper = $("#"+icbper);
    jq_anticipos = $("#"+anticipos);
    jq_total = $("#"+total);
    jq_fecha_doc = $("#"+fecha_doc);
    jq_fecha_comprobante = $("#"+fecha_comprobante);
    
    jq_base_calculada.prop( "disabled", true );
    jq_monto_descuento.prop( "disabled", true );
    jq_subtotal.prop( "disabled", true );
    jq_igv.prop( "disabled", true );
    jq_icbper.prop( "disabled", true );
    jq_anticipos.prop( "disabled", true );
    jq_total.prop( "disabled", true );
    jq_fecha_doc.prop( "disabled", true );
    
    jq_dias_forma_pago.focusin(function(){
        $(this).select();
    });
    jq_dias_forma_pago.change(function() {
        var ndias = jq_dias_forma_pago.val();
        var fecha = new Date(jq_fecha_doc.val());
        jq_fecha_validez.val(sumar_dias(fecha,ndias));
    });
    jq_dias_forma_pago.keyup(function() {
        var ndias = jq_dias_forma_pago.val();
        var fecha = new Date(jq_fecha_doc.val());
        jq_fecha_validez.val(sumar_dias(fecha,ndias));
    });
    
    jq_fecha_validez.change(function() {
        var dias = restar_fechas(new Date(jq_fecha_validez.val()),new Date(jq_fecha_doc.val()));
        jq_dias_forma_pago.val(dias)
    });
    
    jq_porc_descuento.change(function() {
        recalcular_montos_ventas();
    });

    jq_lista_precios.change(function() {
        
        if($("#guardar").prop("disabled")==false)
            actualizar_lista_precios($(this).val()); //Se encuentra en detalle_venta
    });

    jq_porc_descuento.keyup(function() {
        if(isEmptyOrWhiteSpaces($(this).val())){
            $(this).val("0");
        }
        recalcular_montos_ventas();
    });

    jq_codigo_cliente.keyup(function() {
        rellenar_clientes($(this).val());
    });
    jq_nombre_cliente.keyup(function() {
        rellenar_clientes($(this).val());
    });
    jq_codigo_cliente.keyup(function() {
        rellenar_clientes($(this).val());
    });
    jq_codigo_proveedor.keyup(function() {
        rellenar_proveedores($(this).val());
    });
    
    rellenar_autocomplete_cliente();
    jq_forma_pago.val("00") ;

        

});


$(document).on("keyup", ".c_mayus", function(e) {
    var contenido = $(this).val();
    contenido = contenido.toUpperCase()
    $(this).val(contenido);
    console.log($(this).val())
});

$(document).on("keydown", function(e) {
    var keycode = (e.keyCode ? e.keyCode : e.code);
    var id_focused=$("*:focus").attr("id");
    console.log(id_focused);
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
}
async function rellenar_motivos_tramite_series(tipo_documento, elemento, elemento_trigger_change, predeterminado, cargar_cliente_proveedor){
    var jq_elemento = $('#'+elemento);
    await $.ajax({
        type: 'POST',
        url: url_motivos_tramite_series,
        data: {tipo_documento: tipo_documento},
        success: function (lists){
            jq_elemento.html('');
            lists.forEach(list=>{
                jq_elemento.append('<option value="'+list.Codigo+'" >'+list.Nombre + '</option>');
            });
            if(elemento_trigger_change){
                jq_elemento.trigger("change")
                // cargar_correlativo(elemento);
            }
            if(cargar_cliente_proveedor){
                cliente_proveedor();
            }
            if(!isEmptyOrWhiteSpaces(predeterminado)){
                jq_elemento.val(predeterminado);
            }
       }
   });
};

async function rellenar_tipo_transaccion_almacen(url_transaccion,tipo_movimiento, elemento, predeterminado) {
    var jq_elemento = $('#'+elemento);
    var req = false;
    await $.ajax({
        type: 'POST',
        url: url_transaccion,
        data: {tipo_movimiento: tipo_movimiento},
        success: function (lists){
            jq_elemento.html('');
            lists.forEach(list=>{
                jq_elemento.append('<option value="'+list.Codigo+'" >'+list.Nombre + '</option>');
            });
            if(!isEmptyOrWhiteSpaces(predeterminado)){
                jq_elemento.val(predeterminado);
                jq_elemento.trigger("change");
                //cargar_almacen_destino();
            }
            req = true;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            req = false;
        }
    });

    return req;
}


function rellenar_punto_partida(elemento){
    var jq_elemento = $('#'+elemento);
    $.ajax({
        type: 'POST',
        url: url_punto_venta,
        success: function (result){
            result.forEach(list=>{
                jq_elemento.val(list.Direccion);
           });
       }
   });
}

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
}

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
                select.append('<option value="'+list.Codigo+'" dias ="'+list.Nro_dias+'">'+list.Nombre + '</option>');
                if(list.Predeterminado=='S'){
                    predeterminado=list.Codigo;
                    dias_predeterminado=list.Nro_dias;
                };
            });

            if(!isEmptyOrWhiteSpaces(set_predeterminado)){
                select.val(set_predeterminado);
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
    jq_dias_forma_pago.val(ndias);
    
    var fecha = new Date(jq_fecha_doc.val());
    jq_fecha_validez.val(sumar_dias(fecha,ndias));
}

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
                    jq_ndoc_id.val(list.Numero_Doc);
                    jq_ruc_proveedor.val(ruc_dni);
                    jq_nombre_proveedor.val(list.Nombre);
                    jq_direccion_proveedor.val(list.Direccion);
                    jq_punto_llegada_proveedor.val(list.Direccion);
                    jq_vendedor1.val(list.Vendedor_codigo);
                    jq_vendedor3.val(list.Vendedor_codigo);
                    jq_telefono_proveedor.val(list.Telefono);
                    jq_email_proveedor.val(list.Email);
                    pais_proveedor = list.Codigo_Pais;
                    extranjero =  (pais_proveedor != "001"); //Usado para el calcular_totales_facturacion de detalle ventas
                    rellenar_formas_pago(list.Codigo,'42');
                    rellenar_sublista_clientes(list.Codigo, url_proveedores_contactos,"contacto_proveedor");
                    rellenar_sublista_clientes(list.Codigo, url_proveedores_agencias,"agencia_proveedor");
                    recalcular_montos_ventas();
                });
            }
        });
    }
}

function abrir_anticipos(){
    jq_modal_title_lista_anticipos.text('Listado Anticipos');
    jq_modal_lista_anticipos.modal('show');
}

function rellenar_codigo_anexo_mantenimiento() {
    // console.log('jagsjdaksd');
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