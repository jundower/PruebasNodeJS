var fecha = new Date();

var jq_formato_impresion;
var impresion_tipo_documento = "01";
var impresion_motivo_serie_documento = "F001";
var impresion_tipo_formato_documento = "ERP_FE";
var impresion_punto_venta = "001";
var impresion_modulo = "Ventas";
var impresion_nombre = "Formato_Modelo";
var campos=[
    //Empresa
    "empresa_logo","empresa_ruc","empresa_razon_social","empresa_direccion","empresa_telefono","empresa_correo","empresa_pagina_web",
    //Cabecera
    "documento_tipo","documento_punto_venta","documento_punto_llegada","cliente_codigo","cliente_ruc","cliente_nombre","cliente_telefono","cliente_direccion","cliente_email","cliente_lista_precios_codigo","cliente_lista_precios_nombre","cliente_contacto_codigo","cliente_contacto_nombre","documento_motivo_serie","documento_numero","documento_fecha_emision","documento_dias_validez","documento_fecha_validez","documento_fecha_entrega","documento_vendedor_codigo","documento_vendedor_nombre","documento_forma_pago_codigo","documento_forma_pago_nombre","documento_si_igv","documento_moneda","documento_moneda_nombre","documento_tipo_cambio","documento_tasa_cambio","documento_descuento_porcentaje","documento_glosa","documento_base_calculada","documento_descuento_monto","documento_base_imponible","documento_igv","documento_total",
    //Detalle
    "detalle_NItem","detalle_Cantidad","detalle_Codigo","detalle_Codigo_Tipo_producto","detalle_Tipo_producto","detalle_Codigo_Familia","detalle_Familia","detalle_Codigo_Subfamilia","detalle_Subfamilia","detalle_Codigo_Concepto1","detalle_Concepto1","detalle_Codigo_Concepto2","detalle_Concepto2","detalle_Codigo_Concepto3","detalle_Concepto3","detalle_Codigo_Concepto4","detalle_Concepto4","detalle_Codigo_Concepto5","detalle_Concepto5","detalle_Codigo_Concepto6","detalle_Concepto6","detalle_Codigo_Concepto7","detalle_Concepto7","detalle_Codigo_Fabricante","detalle_Codigo_Digemid","detalle_Codigo_Interno","detalle_Codigo_Interno2","detalle_Leyenda1","detalle_Leyenda2","detalle_Nombre","detalle_Codigo_Unidad","detalle_Unidad","detalle_Factor","detalle_Precio","detalle_Base_Calculada","detalle_Desc1","detalle_Desc2","detalle_Desc3","detalle_Desc4","detalle_Base_Imponible","detalle_Igv","detalle_ICBPER","detalle_Importe","detalle_Peso","detalle_Codigo_Almacen","detalle_Almacen","detalle_Cantidad_presentacion","detalle_Codigo_presentacion","detalle_Unidad_presentacion","detalle_Nombre_presentacion","detalle_Precio_presentacion","detalle_Cantidad_Kardex","detalle_Barticulo","detalle_Precio_original","detalle_Igv_Art","detalle_Base_calculada_dec","detalle_Monto_Descuento","detalle_Base_imp_dec","detalle_Igv_dec","detalle_Importe_dec","detalle_Stock_SN","detalle_Lote_SN","detalle_Lote_Numero","detalle_Lote_Vencimiento","detalle_Serie_SN","detalle_Serie_Numero","detalle_Cotizacion_Punto_Venta","detalle_Cotizacion_Motivo","detalle_Cotizacion_Numero","detalle_Cotizacion_NItem","detalle_Pedido_Motivo","detalle_Pedido_Numero","detalle_Pedido_NItem","detalle_Guia_Serie","detalle_Guia_Numero","detalle_Guia_NItem","detalle_Factura_Serie","detalle_Factura_Numero","detalle_Boleta_Serie","detalle_Boleta_Numero","detalle_NC_Serie","detalle_NC_Numero","detalle_ND_Serie","detalle_ND_Numero","detalle_Origen_Documento","detalle_Origen_Serie","detalle_Origen_Numero","detalle_Origen_NItem",
    //Cuadrados
    "cuadrado1","cuadrado2","cuadrado3",
    //Facturación electrónica
    "imagen_qr",
];

$(document).ready(function() {
    jq_formato_impresion = $("#formato_impresion");
    impresion_tipo_documento=$("#modulo_formatos").val();
    impresion_motivo_serie_documento=$("#modulo_formatos").val();
    impresion_tipo_documento =="requerimientos01" ? impresion_tipo_documento="requerimientos": impresion_tipo_documento =="requerimientos02" ? impresion_tipo_documento="requerimientos": "";
    $(".print_botones_imprimir").click(function(){
        window.print();
    });
    $(".print_botones_descargar").click(function(){
        descargarPDF();
    });
    $(".print_botones_onedrive").click(function(){
    });
    $(".print_botones_atras").click(function(){
        $(".print_container").addClass("d---none");
    });
    $(".print_container").keydown(function(e){
        var keycode = (event.keyCode ? event.keyCode : event.code);
        if(keycode==27)  $(".print_container").addClass("d---none");//$(".print_container").hide();
    });
    $("#imprimir").keydown(function(e){
        var keycode = (event.keyCode ? event.keyCode : event.code);
        if(keycode==27)  $(".print_container").addClass("d---none");//$(".print_container").hide();
    });
    
});

function descargarPDF(){
    
    $(".breaker").hide();
    html2canvas(document.getElementById('formato_impresion'), {scale:2}).then(function(canvas) {
        // $("#printer_block").append(canvas);
        var imgData = canvas.toDataURL('image/png');
        
        // var imgWidth = 210; 
        // var pageHeight = 295;
        var imgWidth = 205; 
        var pageHeight = 295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
        var doc = new jsPDF('p', 'mm');
        var position = 0;

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        doc.save( 'descarga.pdf');
        $(".breaker").show();
    });
}

async function setFormatoImpresion(config, data, vista_previa){
    //console.log(config);
    if (config.formato != undefined) {
        var format = document.getElementById('formato_impresion');
        format.style.width = '1125px';
        format.style.height= '750px';
    }
    impresion_modulo = config.modulo || 'Ventas';
    impresion_tipo_formato_documento = config.tipo_formato || 'Talonarios';
    impresion_punto_venta = config.punto_venta || '001';
    impresion_tipo_documento = config.tipo_documento || '01';
    impresion_motivo_serie_documento = config.motivo_serie || 'F001';
    await $.ajax({
        type: 'POST',
        url: '/configuraciones/formato_impresion',
        data:{
            modulo: impresion_modulo,
            tipo_formato: impresion_tipo_formato_documento,
            punto_venta: impresion_punto_venta,
            tipo_documento: impresion_tipo_documento,
            motivo_serie_documento: impresion_motivo_serie_documento,
        },
        success: function (result){
            //console.log(result);
            jq_formato_impresion.html(result);
            impresion_nombre = impresion_modulo + '-' + impresion_punto_venta + '-' + impresion_tipo_documento + '-' + impresion_motivo_serie_documento + '-' + data[0].documento_numero;
            rellenarFormato(data);
            if(vista_previa) imprimir();
            if(config.guardado_automatico=="S"){
                data = config.data_guardado_automatico;
                generarPDF(data.empresa_ruc,data.documento_tipo_movimiento,data.documento_motivo_venta_codigo,data.documento_numero)
            }
        }
    });
}

function imprimir(){
    // $(".print_container").show();
    $(".print_container").removeClass("d---none");
    
}

function rellenarFormato(data){
    //console.log(data);
    // var page_height = 1573; // cuando no está configurado el @page size : auto
    // var page_height = 1507;
    // var page_height = 1480; //Corregido para una hoja
    // var page_height = 1000;
    // var page_height = 1045;
    var page_height = 1075;
    if (data[0].documento_nombre == 'CUADRO COMPARATIVO') {
        var page_height = 750;
    }
    
    
    $("#print_header_empresa_logo").attr("src",'/erp/'+data[0].empresa_codigo+'/img/'+data[0].empresa_logo);
    $("#print_header_empresa_logo_small").attr("src",'/erp/'+data[0].empresa_codigo+'/img/small_'+data[0].empresa_logo);
    $("#print_detalle_letra_final").attr("src",'/erp/'+data[0].empresa_codigo+'/img/letra final.PNG');
    $("#print_detalle_firma_final").attr("src",'/erp/'+data[0].empresa_codigo+'/img/firma final.PNG');

    $("#print_header_empresa_nombre").text(data[0].empresa_razon_social);
    $("#print_header_empresa_direccion").text(data[0].empresa_direccion);
    $("#print_header_empresa_ruc").text(data[0].empresa_ruc);
    $("#print_header_empresa_web").text(data[0].empresa_web);
    $("#print_header_empresa_correo").text(data[0].empresa_correo);
    $("#print_header_empresa_telefono").text(data[0].empresa_telefono);
    

    $("#print_header_documento_ruc").text("RUC: "+data[0].empresa_ruc);
    $("#print_header_documento_nombre").text(data[0].documento_nombre);
    $("#print_header_documento_numero").text(data[0].documento_numero);
    $("#print_header_documento_numero_guia_factura").text(data[0].documento_motivo_venta_codigo+' - '+data[0].documento_numero);
    $("#print_header_documento_tipo").text(data[0].documento_tipo);
    $("#print_header_documento_fecha_vencimiento").text(data[0].documento_fecha_validez);
    $("#print_header_documento_fecha_emision").text(data[0].documento_fecha);
    $("#print_header_unidad_negocio").text(data[0].documento_nombre_unidad_negocio);
    $("#print_header_prioridad").text(data[0].documento_nombre_prioridad);
    $("#print_header_tasa_cambio").text(data[0].tipo_cambio);
    $("#print_header_moneda").text(data[0].documento_moneda);
    $("#print_header_centro_costo").text(data[0].documento_cencos_nombre);
    $("#print_header_punto_venta").text(data[0].documento_punto_venta_nombre);//
    $("#print_header_fecha").text(data[0].documento_fecha);
    $("#print_header_fecha_limite").text(data[0].documento_fecha_limite);
    $("#print_header_responsable").text(data[0].documento_nombre_responsable);
    $("#print_header_glosa").text(data[0].documento_glosa);
    $("#print_header_ot").text(data[0].documento_ot_nombre);
    $("#print_header_cliente_nombre").text(data[0].cliente_nombre);
    $("#print_header_proveedor_nombre").text(data[0].proveedor_nombre);
    $("#print_header_cliente_direccion").text(data[0].cliente_direccion);
    $("#print_header_proveedor_direccion").text(data[0].proveedor_direccion);
    $("#print_header_cliente_codigo").text(data[0].Codigo_Cliente);
    $("#print_header_cliente_ruc").text(data[0].cliente_ruc);
    $("#print_header_proveedor_ruc").text(data[0].proveedor_ruc);
    $("#print_header_cliente_contacto_nombre").text(data[0].cliente_contacto_nombre);
    $("#print_header_proveedor_contacto_nombre").text(data[0].proveedor_contacto_nombre);
    $("#print_header_proveedor_telefono").text(data[0].proveedor_telefono);
    $("#print_header_cliente_telefono").text(data[0].cliente_telefono);
    $("#print_header_proveedor_email").text(data[0].proveedor_correo);
    $("#print_header_cliente_email").text(data[0].cliente_correo);
    $("#print_header_cliente_contacto_cargo").text(data[0].cliente_contacto_cargo);
    $("#print_header_fecha_entrega").text(data[0].documento_fecha_entrega);///////////////////////
    $("#print_header_empresa_nombre").text(data[0].empresa_razon_social);
    $("#print_header_empresa_ruc").text(data[0].empresa_ruc);
    $("#print_header_punto_llegada").text(data[0].documento_punto_llegada);
    $("#print_header_forma_pago").text(data[0].forma_pago_nombre);
    $("#print_header_documento_vendedor1").text(data[0].documento_vendedor1_nombre);
    $("#print_header_documento_almacen").text(data[0].articulo_nombre_almacen_origen);
    $("#print_header_documento_tipo_transaccion").text(data[0].documento_nombre_tipo_transaccion);
    $("#print_header_documento_nombre_entidad").text(data[0].documento_nombre_entidad);
    $("#print_header_motivo_traslado").text(data[0].documento_motivo_traslado);
    $("#print_header_documento_numero_referencia").text(data[0].documento_numero_referencia);
    $("#print_header_documento_serie_factura").text(data[0].documento_serie_factura);
    $("#print_header_documento_numero_factura").text(data[0].documento_numero_factura);
    $("#print_header_documento_serie_guia").text(data[0].documento_serie_guia_remision);
    $("#print_header_documento_numero_guia").text(data[0].documento_numero_guia_remision);
    $("#print_header_documento_serie_referencia").text(data[0].Origen_Serie_referencia);
    $("#print_header_documento_punto_partida").text(data[0].documento_punto_partida);
    $("#print_header_documento_punto_llegada").text(data[0].documento_punto_llegada);
    $("#print_header_documento_nombre_chofer").text(data[0].documento_nombre_chofer);
    $("#print_header_documento_placa_vehiculo").text(data[0].documento_placa_vehiculo);
    $("#print_header_documento_chofer_licencia").text(data[0].documento_chofer_licencia);
    $("#print_header_documento_vendedor").text(data[0].documento_vendedor1_nombre2);
    $("#print_header_documento_total_letras").text(data[0].documento_total_letras +' '+(data[0].documento_moneda == 'S/'? 'SOLES': 'DOLARES'));
    $("#print_header_moneda_letras").text(data[0].documento_moneda == 'S/'? 'SOLES': 'DOLARES');
    $("#print_header_plazo_entrega").text(data[0].documento_dias+' dias');
    $("#print_header_documento_tipo_dato1").text(data[0].documento_tipo_movimiento == '01'? 'Orden de Compra:': data[0].documento_tipo_movimiento == '08'? 'Documento que modifica:':data[0].documento_tipo_movimiento == '07'?'Documento que modifica:':'Orden de Compra:');
    $("#print_header_documento_tipo_dato2").text(data[0].documento_tipo_movimiento == '01'? 'Condición de Pago:': data[0].documento_tipo_movimiento == '08'? 'Motivo:':data[0].documento_tipo_movimiento == '07'?'Motivo:':'Condición de Pago:');
    $("#print_header_documento_tipo_dato3").text(data[0].documento_tipo_movimiento == '01'? 'Guía de Remisión:': data[0].documento_tipo_movimiento == '08'? 'Descripción del motivo:':data[0].documento_tipo_movimiento == '07'?'Descripción del motivo:':'Guía de Remisión:');
    $("#print_header_documento_tipo_dato4").text(data[0].Origen_Serie_referencia+' - '+data[0].documento_numero_referencia);
    $("#print_header_documento_tipo_dato5").text(data[0].documento_tipo_movimiento == '01'? data[0].forma_pago_nombre: data[0].documento_tipo_movimiento == '08'? data[0].documento_motivo_nota:data[0].documento_tipo_movimiento == '07'?data[0].documento_motivo_nota:data[0].forma_pago_nombre );
    $("#print_header_documento_tipo_dato6").text(data[0].documento_tipo_movimiento == '01'? data[0].documento_numero_referencia: data[0].documento_tipo_movimiento == '08'? data[0].documento_glosa:data[0].documento_tipo_movimiento == '07'?data[0].documento_glosa:data[0].documento_numero_referencia );
    $("#print_header_documento_tipo_dato7").text(data[0].Documento_Ingreso_Egreso == 'EGR'? 'PAGESE A LA ORDEN DE: ': 'COBRESE A LA ORDEN DE: ' );
    $("#print_header_nombre_anexo").text(data[0].Documento_Nombre_Anexo);
    $("#print_header_nombre_anexo2").text(data[0].Documento_Nombre_Anexo);
    $("#print_header_documento_fecha_diferida").text(data[0].documento_fecha_diferida);
    $("#print_header_documento_subvoucher").text(data[0].Documento_Codigo_Svoucher +' - '+ data[0].Documento_Numero_Contable);
    $("#print_header_numero").text(data[0].numero);
    $("#print_header_documento_fecha_referencia_c").text(data[0].documento_fecha_referencia_c);
    if (data[0].documento_debe_t != undefined){
    $("#print_header_documento_debe_t").text((data[0].documento_debe_t).toFixed(2))};
    if (data[0].documento_haber_t != undefined){
    $("#print_header_documento_haber_t").text((data[0].documento_haber_t).toFixed(2))};
    if (data[0].Documento_Importe != undefined){
    $("#print_header_documento_importe").text(data[0].documento_moneda +'  '+(data[0].Documento_Importe).toFixed(2))};

    $("#print_header_proveedor1").text(data[0].nombre1);
    $("#print_header_proveedor2").text(data[0].nombre2);
    $("#print_header_proveedor3").text(data[0].nombre3);
    $("#print_header_proveedor4").text(data[0].nombre4);

    $("#print_footer_empresa_partida_presupuestal").text(data[0].documento_cencos_codigo);
    $("#print_footer_responsable").text(data[0].documento_nombre_responsable);
    $("#print_footer_vendedor1").text(data[0].documento_vendedor1_nombre2);
    $("#print_footer_vendedor1_correo").text(data[0].documento_vendedor1_correo);
    $("#print_footer_vendedor1_celular").text(data[0].documento_vendedor1_celular);
    $("#print_footer_vendedor2").text(data[0].documento_vendedor2_nombre);
    $("#print_footer_aprobacion1").text(data[0].documento_aprobacion1);
    $("#print_footer_aprobacion1_correo").text(data[0].documento_aprobacion1_correo);
    $("#print_footer_aprobacion2").text(data[0].documento_aprobacion2);
    if (data[0].documento_total_productos != undefined){
    $("#print_footer_total_productos").text((data[0].documento_total_productos).toFixed(2))};
    $("#print_footer_empresa_cuenta_banacaria").text(data[0].cuenta_bancaria);
    $("#print_footer_empresa_cuenta_interbancaria").text(data[0].cuenta_interbancaria);
    
    //data[0].documento_firma_vendedor != undefined?
    !isEmptyOrUndefinied(data[0].documento_firma_vendedor)?
    $("#print_footer_firma_vendedor1").attr("src",'/erp/'+data[0].empresa_codigo+'/img/'+data[0].documento_firma_vendedor): $("#print_footer_firma_vendedor1").hide();
    //data[0].documento_firma_responsable != undefined?
    !isEmptyOrUndefinied(data[0].documento_firma_responsable)?
    $("#print_footer_firma_responsable").attr("src",'/erp/'+data[0].empresa_codigo+'/img/'+data[0].documento_firma_responsable): $("#print_footer_firma_responsable").hide();
    //data[0].documento_firma_Aprobacion1 != undefined ?
    !isEmptyOrUndefinied(data[0].documento_firma_Aprobacion1)?
    $("#print_footer_firma_aprobacion1").attr("src",'/erp/'+data[0].empresa_codigo+'/img/'+data[0].documento_firma_Aprobacion1): $("#print_footer_firma_aprobacion1").hide();
    //data[0].documento_firma_Aprobacion2 != undefined?
    !isEmptyOrUndefinied(data[0].documento_firma_Aprobacion2)?
    $("#print_footer_firma_aprobacion2").attr("src",'/erp/'+data[0].empresa_codigo+'/img/'+data[0].documento_firma_Aprobacion2):$("#print_footer_firma_aprobacion2").hide();

    $("#print_footer_titulo1").text(data[0].Titulo1 == null? '':data[0].Titulo1);
    $("#print_footer_descripcion01").text(data[0].Descricion1 == null? '': data[0].Descricion1);
    $("#print_footer_documento_aprobacion_comentario").text(data[0].documento_aprobacion_comentario);
    $("#print_footer_Descricion2").text(data[0].Descricion2 == null? '': data[0].Descricion2);
    $("#print_footer_documento_aprobacion2_comentario").text(data[0].documento_aprobacion2_comentario);
    $("#print_footer_Descricion3").text(data[0].Descricion3 == null? '': data[0].Descricion3);
    $("#print_footer_Comentario01").text(data[0].Comentario01 == null? '':data[0].Comentario01);

    if (data[0].documento_nombre == 'CUADRO COMPARATIVO'){

        var total_precio1=0,total_precio2=0,total_precio3=0,total_precio4=0;
        var total1 = 0,total2 = 0,total3 = 0,total4 = 0;
        for(var i = 0; i<data.length; i++){
            var detalle = data[i];

            total_precio1= detalle.precio1+total_precio1;
            total_precio2= detalle.precio2+total_precio2;
            total_precio3= detalle.precio3+total_precio3;
            total_precio4= detalle.precio4+total_precio4;

            total1 = (detalle.articulo_cantidad*detalle.precio1) +total1;
            total2 = (detalle.articulo_cantidad*detalle.precio2) +total2;
            total3 = (detalle.articulo_cantidad*detalle.precio3) +total3;
            total4 = (detalle.articulo_cantidad*detalle.precio4) +total4;
        }
        $("#print_footer_total_precio1").text((total_precio1).toFixed(2));
        $("#print_footer_total_precio2").text((total_precio2).toFixed(2));
        $("#print_footer_total_precio3").text((total_precio3).toFixed(2));
        $("#print_footer_total_precio4").text((total_precio4).toFixed(2));
        $("#print_footer_total_1").text((total1).toFixed(2));
        $("#print_footer_total_2").text((total2).toFixed(2));
        $("#print_footer_total_3").text((total3).toFixed(2));
        $("#print_footer_total_4").text((total4).toFixed(2));
        
        $("#print_footer_total_observaciones1").text(data[0].Observacion_01!= null ?data[0].Observacion_01:'');
        $("#print_footer_total_observaciones2").text(data[0].Observacion_02!=null?data[0].Observacion_02:'');
        $("#print_footer_total_observaciones3").text(data[0].Observacion_03!=null?data[0].Observacion_03:'');
        $("#print_footer_total_observaciones4").text(data[0].Observacion_04!=null?data[0].Observacion_04:'');

        $("#print_footer_forma_pago1").text(data[0].f_pago1!=null?data[0].f_pago1:'');
        $("#print_footer_forma_pago2").text(data[0].f_pago2!=null?data[0].f_pago2:'');
        $("#print_footer_forma_pago3").text(data[0].f_pago3!=null?data[0].f_pago3:'');
        $("#print_footer_forma_pago4").text(data[0].f_pago4!=null?data[0].f_pago4:'');

        $("#print_footer_entrega1").text(data[0].d_entrega1!=null?data[0].d_entrega1:'');
        $("#print_footer_entrega2").text(data[0].d_entrega2!=null?data[0].d_entrega2:'');
        $("#print_footer_entrega3").text(data[0].d_entrega3!=null?data[0].d_entrega3:'');
        $("#print_footer_entrega4").text(data[0].d_entrega4!=null?data[0].d_entrega4:'');

        $("#print_footer_contacto1").text(data[0].contacto_proveedor1!=null?data[0].contacto_proveedor1:'');
        $("#print_footer_contacto2").text(data[0].contacto_proveedor2!=null?data[0].contacto_proveedor2:'');
        $("#print_footer_contacto3").text(data[0].contacto_proveedor3!=null?data[0].contacto_proveedor3:'');
        $("#print_footer_contacto4").text(data[0].contacto_proveedor4!=null?data[0].contacto_proveedor4:'');

        $("#print_footer_telefono1").text(data[0].telefono_proveedor1!=null?data[0].telefono_proveedor1:'');
        $("#print_footer_telefono2").text(data[0].telefono_proveedor2!=null?data[0].telefono_proveedor2:'');
        $("#print_footer_telefono3").text(data[0].telefono_proveedor3!=null?data[0].telefono_proveedor3:'');
        $("#print_footer_telefono4").text(data[0].telefono_proveedor4!=null?data[0].telefono_proveedor4:'');

        $("#print_footer_historial1").text(data[0].comentario_historial1!=null?data[0].comentario_historial1:'');
        $("#print_footer_historial2").text(data[0].comentario_historial2!=null?data[0].comentario_historial2:'');
        $("#print_footer_historial3").text(data[0].comentario_historial3!=null?data[0].comentario_historial3:'');
        $("#print_footer_historial4").text(data[0].comentario_historial4!=null?data[0].comentario_historial4:'');

        $("#print_footer_fecha1").text(data[0].fecha_historial1!=null?data[0].fecha_historial1:'');
        $("#print_footer_fecha2").text(data[0].fecha_historial2!=null?data[0].fecha_historial2:'');
        $("#print_footer_fecha3").text(data[0].fecha_historial3!=null?data[0].fecha_historial3:'');
        $("#print_footer_fecha4").text(data[0].fecha_historial4!=null?data[0].fecha_historial4:'');
    };

    $("#print_footer_empresa_nombre").text(data[0].empresa_razon_social);
    $("#print_footer_empresa_direccion2").text(data[0].empresa_direccion);
    $("#print_footer_empresa_web2").text(data[0].empresa_web);
    $("#print_footer_empresa_direccion").text(data[0].empresa_direccion);
    $("#print_footer_empresa_ruc").text(data[0].empresa_ruc);
    $("#print_footer_cliente_nombre").text(data[0].cliente_nombre);
    $("#print_footer_cliente_ruc").text(data[0].cliente_ruc);
    $("#print_footer_empresa_web").text(data[0].empresa_web);
    $("#print_footer_empresa_telefono").text(data[0].empresa_telefono);
    $("#print_footer_empresa_correo").text(data[0].empresa_correo);
    $("#print_footer_firma_responsable_nombre").text(data[0].documento_nombre_responsable);
    $("#print_footer_firma_responsable_cargo").text('Responsable Cargo');
    $("#print_footer_firma_empresa").text(data[0].empresa_razon_social);
    $("#print_footer_firma_telefono").text(data[0].empresa_telefono);
    $("#print_footer_firma_correo").text(data[0].empresa_correo);
    $("#print_footer_usuario").text((data[0].usuario_codigo).toUpperCase());

    if (data[0].documento_subtotal != undefined){
    $("#print_footer_subtotal").text( (data[0].documento_moneda)+'  '+(data[0].documento_subtotal).toFixed(2))};
    if (data[0].documento_igv != undefined){
    $("#print_footer_igv").text( (data[0].documento_moneda)+'  '+(data[0].documento_igv).toFixed(2))};
    if (data[0].documento_igv_icbper != undefined){
    $("#print_footer_icbper").text( (data[0].documento_moneda)+'  '+(data[0].documento_igv_icbper).toFixed(2));}
    if (data[0].documento_descuento != undefined){
    $("#print_footer_descuento").text( (data[0].documento_moneda)+'  '+(data[0].documento_descuento).toFixed(2))};
    if (data[0].documento_importe != undefined){
    $("#print_footer_total").text( (data[0].documento_moneda)+'  '+(data[0].documento_importe).toFixed(2))};

    $("#print_footer_fecha_impresion").text(getShortDateFormat(fecha, "dd-mm-yyyy"));
    $("#print_footer_hora_impresion").text(getHora(fecha));

    data[0].documento_aprobado == 'Aprobado' ? $("#print_footer_empresa_aprobado").attr("src",'/erp/'+data[0].empresa_codigo+'/img/aprobado.png') : $("#print_footer_empresa_aprobado").hide();
    $("#print_imagen_qr").attr("src",'/erp/'+data[0].empresa_codigo+'/qr/'+data[0].documento_qr);

    var header_height = $(".print_header").css("height").replace("px","") * 1;
    var footer_height = $(".print_footer").css("height").replace("px","") * 1;
    var content_height = $(".print_body_filas_id").css("height").replace("px","") * 1;
    $(".print_body").css("height",page_height - header_height - footer_height);

    var original_page = $("#print_page").html();
    var original_body = $("#print_body").html();
    var page_number=0;

    var original_body_fila_detalle = $("#print_body_fila_detalle_1").html();

    $(".print_body_fila_detalle").html("");
    $("#print_page").html("")
    
    var new_page = original_page;

    $(".print_footer_number_page").text("Página "+page_number);
    var nitem=0;
    for(var i = 0; i<data.length; i++){
        var detalle = data[i];
        if(detalle.articulo_codigo!="00") nitem++;
        if((header_height + footer_height + content_height < page_height ) && (page_number!=0)){
            var new_fila = original_body_fila_detalle;
    
            new_fila = new_fila.replace("fila_1","fila_"+(i+1))
            new_fila = new_fila.replace("Producto_Nitem",(detalle.articulo_codigo!="00")?nitem:'')
            new_fila = new_fila.replace("Producto_Cantidad",(detalle.articulo_codigo!="00")?(detalle.articulo_cantidad).toFixed(2):'')
            new_fila = new_fila.replace("Producto_Codigo",(detalle.articulo_codigo!="00")?detalle.articulo_codigo:'')
            new_fila = new_fila.replace("Producto_Modelo",(detalle.articulo_modelo))
            new_fila = new_fila.replace("Producto_Lote",(detalle.articulo_lote))
            new_fila = new_fila.replace("Producto_Marca",(detalle.articulo_marca))
            new_fila = new_fila.replace("Producto_Nombre",detalle.articulo_nombre)
            new_fila = new_fila.replace("Producto_UND",(detalle.articulo_codigo!="00")?detalle.articulo_unidad:'')
            new_fila = new_fila.replace("Producto_Precio",(detalle.articulo_precio).toFixed(2))
            new_fila = new_fila.replace("Producto_Igv",(detalle.articulo_igv).toFixed(2))
            new_fila = new_fila.replace("Producto_Total",(detalle.articulo_importe).toFixed(2))

            new_fila = new_fila.replace("Detalle_Cuenta",(detalle.Detalle_Cuenta))
            new_fila = new_fila.replace("Detalle_Centro_Costo",(detalle.Detalle_Cencos))
            new_fila = new_fila.replace("Detalle_Fecha",(detalle.Detalle_Fecha_referencia_detalle))
            new_fila = new_fila.replace("Detalle_Documento",(detalle.Detalle_Tipo_Ref2+' - '+detalle.Detalle_Serie_Ref2 +' - '+detalle.Detalle_Numero_Ref2))
            new_fila = new_fila.replace("Detalle_Anexo",(detalle.Detalle_Nombre_Auxiliar))
            if (detalle.Detalle_Debe != undefined){
            new_fila = new_fila.replace("Detalle_Debe",((detalle.Detalle_Debe).toFixed(2)))}
            if (detalle.Detalle_Haber != undefined){
            new_fila = new_fila.replace("Detalle_Haber",((detalle.Detalle_Haber).toFixed(2)))}
            // console.log(detalle);
            if (detalle.precio1 != undefined || detalle.precio1 == null){
                new_fila = new_fila.replace("Product_Precio1",(detalle.articulo_codigo!="00")?((detalle.precio1==null? 0:detalle.precio1).toFixed(2)):'')
                new_fila = new_fila.replace("Product_Total1",(detalle.articulo_codigo!="00")?(((detalle.precio1==null? 0:detalle.precio1)*detalle.articulo_cantidad).toFixed(2)):'')
                new_fila = new_fila.replace("Product_Precio2",(detalle.articulo_codigo!="00")?((detalle.precio2==null? 0:detalle.precio2).toFixed(2)):'')
                new_fila = new_fila.replace("Product_Total2",(detalle.articulo_codigo!="00")?(((detalle.precio2==null? 0:detalle.precio2)*detalle.articulo_cantidad).toFixed(2)):'')
                new_fila = new_fila.replace("Product_Precio3",(detalle.articulo_codigo!="00")?((detalle.precio3==null? 0:detalle.precio3).toFixed(2)):'')
                new_fila = new_fila.replace("Product_Total3",(detalle.articulo_codigo!="00")?(((detalle.precio3==null? 0:detalle.precio3)*detalle.articulo_cantidad).toFixed(2)):'')
                new_fila = new_fila.replace("Product_Precio4",(detalle.articulo_codigo!="00")?((detalle.precio4==null? 0:detalle.precio4).toFixed(2)):'')
                new_fila = new_fila.replace("Product_Total4",(detalle.articulo_codigo!="00")?(((detalle.precio4==null? 0:detalle.precio4)*detalle.articulo_cantidad).toFixed(2)):'')}
            
            new_fila = new_fila.replace('Detalle_Numero_Doc',(detalle.Detalle_Numero_Doc))
            new_fila = new_fila.replace('Detalle_Numero_Ref',(detalle.Detalle_Numero_Ref))
            if (detalle.Detalle_Fecha_Emision != undefined || detalle.Detalle_Fecha_Emision == null) {
                var d = new Date(detalle.Detalle_Fecha_Emision)
                new_fila = new_fila.replace('Detalle_Año',(d.getFullYear()))
                new_fila = new_fila.replace('Detalle_Mes',(d.getMonth()+1 >= 10 ? d.getMonth()+1: '0'+(d.getMonth()+1)))
                new_fila = new_fila.replace('Detalle_Dia',(d.getDate()+1 >= 10 ? d.getDate()+1: '0'+(d.getDate()+1)))
            }
            if (detalle.Detalle_Fecha_Vencimiento != undefined || detalle.Detalle_Fecha_Vencimiento == null) {
                var d = new Date(detalle.Detalle_Fecha_Vencimiento)
                new_fila = new_fila.replace('Detalle_Año_Venc',(d.getFullYear()))
                new_fila = new_fila.replace('Detalle_Mes_Venc',(d.getMonth()+1 >= 10 ? d.getMonth()+1: '0'+(d.getMonth()+1)))
                new_fila = new_fila.replace('Detalle_Dia_Venc',(d.getDate()+1 >= 10 ? d.getDate()+1: '0'+(d.getDate()+1)))
            }
            var Detalle_Importe;
            if ((detalle.Detalle_Importe == undefined ? Detalle_Importe = 0: Detalle_Importe = detalle.Detalle_Importe) || detalle.Detalle_Importe == null) {
                new_fila = new_fila.replace('Detalle_Moneda_Importe',(detalle.Detalle_Moneda+' '+(Detalle_Importe).toFixed(2))) 
            }
            new_fila = new_fila.replace('Detalle_Razon_Social',(detalle.empresa_razon_social))
            new_fila = new_fila.replace('Detalle_Importe_Letras',(detalle.Detalle_Monto_Letra+ (detalle.Detalle_Moneda == "S/" ? " SOLES":" DOLARES")))
            new_fila = new_fila.replace('Detalle_Nombre_Anexo',(detalle.Detalle_Nombre_Anexo))
            new_fila = new_fila.replace('Detalle_Domicilio_Anexo',(detalle.Detalle_Direccion_Anexo+' - '+detalle.Detalle_Distrito+' - '+detalle.Detalle_Ciudad+' - '+detalle.Detalle_Departamento))
            new_fila = new_fila.replace('Detalle_Distrito',(detalle.Detalle_Distrito))
            new_fila = new_fila.replace('Detalle_Codigo_Anexo',(detalle.Detalle_Codigo_Anexo))
            new_fila = new_fila.replace('Detalle_Telefono_Anexo',(detalle.Detalle_Telefono_Anexo))
            new_fila = new_fila.replace('Detalle_Nombre_Aval',(detalle.Detalle_Nombre_Aval))
            new_fila = new_fila.replace('Detalle_Direccion_Aval',(detalle.Detalle_Direccion_Aval))
            new_fila = new_fila.replace('Detalle_Ubicacion_Aval',(detalle.Detalle_Ubicacion_Aval))
            new_fila = new_fila.replace('Detalle_Codigo_Aval',(detalle.Detalle_Codigo_Aval))
            new_fila = new_fila.replace('Detalle_Telefono_Aval',(detalle.Detalle_Telefono_Aval))

            $("#print_body_fila_detalle_"+page_number).append(new_fila);

            content_height+=$("#fila_"+(i+1)).css("height").replace("px","") * 1;
            if(header_height + footer_height + content_height > page_height){
                $("#fila_"+(i+1)).remove();
                i--;
                nitem--;
            }
        }else{
            new_page = original_page;
            page_number++;
            new_page = new_page.replace("PageNumber","Página "+page_number);
            new_page = new_page.replace("Producto_Nitem",(detalle.articulo_codigo!="00")?nitem:'')
            new_page = new_page.replace("Producto_Cantidad",(detalle.articulo_codigo!="00")?(detalle.articulo_cantidad).toFixed(2):'')
            new_page = new_page.replace("Producto_Codigo",(detalle.articulo_codigo!="00")?detalle.articulo_codigo:'')
            new_page = new_page.replace("Producto_Modelo",(detalle.articulo_modelo))
            new_page = new_page.replace("Producto_Lote",(detalle.articulo_lote))
            new_page = new_page.replace("Producto_Marca",(detalle.articulo_marca))
            new_page = new_page.replace("Producto_Nombre",detalle.articulo_nombre)
            new_page = new_page.replace("Producto_UND",(detalle.articulo_codigo!="00")?detalle.articulo_unidad:'')
            new_page = new_page.replace("Producto_Precio",(detalle.articulo_precio).toFixed(2))
            new_page = new_page.replace("Producto_Igv",(detalle.articulo_igv).toFixed(2))
            new_page = new_page.replace("Producto_Total", (detalle.articulo_importe).toFixed(2));

            new_page = new_page.replace("Detalle_Cuenta",(detalle.Detalle_Cuenta))
            new_page = new_page.replace("Detalle_Centro_Costo",(detalle.Detalle_Cencos))
            new_page = new_page.replace("Detalle_Fecha",(detalle.Detalle_Fecha_referencia_detalle))
            new_page = new_page.replace("Detalle_Documento",(detalle.Detalle_Tipo_Ref2+' - '+detalle.Detalle_Serie_Ref2 +' - '+detalle.Detalle_Numero_Ref2))
            new_page = new_page.replace("Detalle_Anexo",(detalle.Detalle_Nombre_Auxiliar))
            if (detalle.Detalle_Debe != undefined){
            new_page = new_page.replace("Detalle_Debe",((detalle.Detalle_Debe).toFixed(2)))}
            if (detalle.Detalle_Haber != undefined){
            new_page = new_page.replace("Detalle_Haber",((detalle.Detalle_Haber).toFixed(2)))}

            if (detalle.precio1 != undefined || detalle.precio1 == null){
                new_page = new_page.replace("Product_Precio1",((detalle.precio1==null? 0:detalle.precio1).toFixed(2)))
                new_page = new_page.replace("Product_Total1",(((detalle.precio1==null? 0:detalle.precio1)*detalle.articulo_cantidad).toFixed(2)))
                new_page = new_page.replace("Product_Precio2",((detalle.precio2==null? 0:detalle.precio2).toFixed(2)))
                new_page = new_page.replace("Product_Total2",(((detalle.precio2==null? 0:detalle.precio2)*detalle.articulo_cantidad).toFixed(2)))
                new_page = new_page.replace("Product_Precio3",((detalle.precio3==null? 0:detalle.precio3).toFixed(2)))
                new_page = new_page.replace("Product_Total3",(((detalle.precio3==null? 0:detalle.precio3)*detalle.articulo_cantidad).toFixed(2)))
                new_page = new_page.replace("Product_Precio4",((detalle.precio4==null? 0:detalle.precio4).toFixed(2)))
                new_page = new_page.replace("Product_Total4",(((detalle.precio4==null? 0:detalle.precio4)*detalle.articulo_cantidad).toFixed(2)))}
            
            new_page = new_page.replace('Detalle_Numero_Doc',(detalle.Detalle_Numero_Doc))
            new_page = new_page.replace('Detalle_Numero_Ref',(detalle.Detalle_Numero_Ref))
            if (detalle.Detalle_Fecha_Emision != undefined || detalle.Detalle_Fecha_Emision == null) {
                var d = new Date(detalle.Detalle_Fecha_Emision)
                new_page = new_page.replace('Detalle_Año',(d.getFullYear()))
                new_page = new_page.replace('Detalle_Mes',(d.getMonth()+1 >= 10 ? d.getMonth()+1: '0'+(d.getMonth()+1)))
                new_page = new_page.replace('Detalle_Dia',(d.getDate()+1 >= 10 ? d.getDate()+1: '0'+(d.getDate()+1)))
            }
            if (detalle.Detalle_Fecha_Vencimiento != undefined || detalle.Detalle_Fecha_Vencimiento == null) {
                var d = new Date(detalle.Detalle_Fecha_Vencimiento)
                new_page = new_page.replace('Detalle_Año_Venc',(d.getFullYear()))
                new_page = new_page.replace('Detalle_Mes_Venc',(d.getMonth()+1 >= 10 ? d.getMonth()+1: '0'+(d.getMonth()+1)))
                new_page = new_page.replace('Detalle_Dia_Venc',(d.getDate()+1 >= 10 ? d.getDate()+1: '0'+(d.getDate()+1)))
            }
            var Detalle_Importe;
            if ((detalle.Detalle_Importe == undefined ? Detalle_Importe = 0: Detalle_Importe = detalle.Detalle_Importe) || detalle.Detalle_Importe == null) {
                new_page = new_page.replace('Detalle_Moneda_Importe',(detalle.Detalle_Moneda+' '+(Detalle_Importe).toFixed(2))) 
            }
            new_page = new_page.replace('Detalle_Razon_Social',(detalle.empresa_razon_social))
            new_page = new_page.replace('Detalle_Importe_Letras',(detalle.Detalle_Monto_Letra + (detalle.Detalle_Moneda == "S/" ? " SOLES":" DOLARES") ))
            new_page = new_page.replace('Detalle_Nombre_Anexo',(detalle.Detalle_Nombre_Anexo))
            new_page = new_page.replace('Detalle_Domicilio_Anexo',(detalle.Detalle_Direccion_Anexo+' - '+detalle.Detalle_Distrito+' - '+detalle.Detalle_Ciudad+' - '+detalle.Detalle_Departamento))
            new_page = new_page.replace('Detalle_Distrito',(detalle.Detalle_Distrito))
            new_page = new_page.replace('Detalle_Codigo_Anexo',(detalle.Detalle_Codigo_Anexo))
            new_page = new_page.replace('Detalle_Telefono_Anexo',(detalle.Detalle_Telefono_Anexo))
            new_page = new_page.replace('Detalle_Nombre_Aval',(detalle.Detalle_Nombre_Aval))
            new_page = new_page.replace('Detalle_Direccion_Aval',(detalle.Detalle_Direccion_Aval))
            new_page = new_page.replace('Detalle_Ubicacion_Aval',(detalle.Detalle_Ubicacion_Aval))
            new_page = new_page.replace('Detalle_Codigo_Aval',(detalle.Detalle_Codigo_Aval))
            new_page = new_page.replace('Detalle_Telefono_Aval',(detalle.Detalle_Telefono_Aval))

            new_page = new_page.replace("print_body_fila_detalle_1","print_body_fila_detalle_"+page_number);
            new_page = new_page.replace("print_page_1","print_page_"+page_number);
            new_page = new_page.replace("fila_1","fila_"+(i+1))
            $("#print_page").append(new_page);
            content_height = $("#fila_"+(i+1)).css("height").replace("px","") * 1;
        }
    }
}


function setpixelated(context) {
    context['imageSmoothingEnabled'] = false; /* standard /
    context['mozImageSmoothingEnabled'] = false; / Firefox /
    context['oImageSmoothingEnabled'] = false; / Opera /
    context['webkitImageSmoothingEnabled'] = false; / Safari /
    context['msImageSmoothingEnabled'] = false; / IE */
}