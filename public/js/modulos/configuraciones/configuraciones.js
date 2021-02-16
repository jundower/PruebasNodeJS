
var logo ='<img src="http://demo.erp-facturacionelectronica.com/erp/01/img/logo_empresa.png" class="img-fluid mx-auto d-block" alt="Responsive image"></img>';

var campos=[
    //Empresa
    "empresa_logo","empresa_ruc","empresa_razon_social","empresa_direccion","empresa_telefono","empresa_correo","empresa_pagina_web",
    //Cabecera
    "documento_tipo","documento_punto_venta","documento_punto_llegada","cliente_codigo","cliente_ruc","cliente_nombre","cliente_telefono","cliente_direccion","cliente_email","cliente_lista_precios_codigo","cliente_lista_precios_nombre","cliente_contacto_codigo","cliente_contacto_nombre","documento_motivo_serie","documento_numero","documento_fecha_emision","documento_dias_validez","documento_fecha_validez","documento_fecha_entrega","documento_vendedor_codigo","documento_vendedor_nombre","documento_forma_pago_codigo","documento_forma_pago_nombre","documento_si_igv","documento_moneda","documento_moneda_nombre","documento_tipo_cambio","documento_tasa_cambio","documento_descuento_porcentaje","documento_glosa","documento_base_calculada","documento_descuento_monto","documento_base_imponible","documento_igv","documento_total",
    //Detalle
    "detalle_NItem","detalle_Cantidad","detalle_Codigo","detalle_Codigo_Tipo_producto","detalle_Tipo_producto","detalle_Codigo_Familia","detalle_Familia","detalle_Codigo_Subfamilia","detalle_Subfamilia","detalle_Codigo_Concepto1","detalle_Concepto1","detalle_Codigo_Concepto2","detalle_Concepto2","detalle_Codigo_Concepto3","detalle_Concepto3","detalle_Codigo_Concepto4","detalle_Concepto4","detalle_Codigo_Concepto5","detalle_Concepto5","detalle_Codigo_Concepto6","detalle_Concepto6","detalle_Codigo_Concepto7","detalle_Concepto7","detalle_Codigo_Fabricante","detalle_Codigo_Digemid","detalle_Codigo_Interno","detalle_Codigo_Interno2","detalle_Leyenda1","detalle_Leyenda2","detalle_Nombre","detalle_Codigo_Unidad","detalle_Unidad","detalle_Factor","detalle_Precio","detalle_Base_Calculada","detalle_Desc1","detalle_Desc2","detalle_Desc3","detalle_Desc4","detalle_Base_Imponible","detalle_Igv","detalle_ICBPER","detalle_Importe","detalle_Peso","detalle_Codigo_Almacen","detalle_Almacen","detalle_Cantidad_presentacion","detalle_Codigo_presentacion","detalle_Unidad_presentacion","detalle_Nombre_presentacion","detalle_Precio_presentacion","detalle_Cantidad_Kardex","detalle_Barticulo","detalle_Precio_original","detalle_Igv_Art","detalle_Base_calculada_dec","detalle_Monto_Descuento","detalle_Base_imp_dec","detalle_Igv_dec","detalle_Importe_dec","detalle_Stock_SN","detalle_Lote_SN","detalle_Lote_Numero","detalle_Lote_Vencimiento","detalle_Serie_SN","detalle_Serie_Numero","detalle_Cotizacion_Punto_Venta","detalle_Cotizacion_Motivo","detalle_Cotizacion_Numero","detalle_Cotizacion_NItem","detalle_Pedido_Motivo","detalle_Pedido_Numero","detalle_Pedido_NItem","detalle_Guia_Serie","detalle_Guia_Numero","detalle_Guia_NItem","detalle_Factura_Serie","detalle_Factura_Numero","detalle_Boleta_Serie","detalle_Boleta_Numero","detalle_NC_Serie","detalle_NC_Numero","detalle_ND_Serie","detalle_ND_Numero","detalle_Origen_Documento","detalle_Origen_Serie","detalle_Origen_Numero","detalle_Origen_NItem",
    //Cuadrados
    "cuadrado1","cuadrado2","cuadrado3",
];

$(document).ready(function() {
    $("#nuevo").show();
    $("#guardar").show();
    $("#imprimir").show();
    nuevo();
    
    generar();
        
    $( ".draggable" ).draggable({
        containment: ".droppable",
        stack: ".draggable"
    });
    $( ".draggable" ).resizable();
    $( ".droppable" ).droppable();
    $( ".resizable" ).resizable();
    
    setTitle("Configuraciones");
});
function guardar(){
    
    var propiedades=[];
    for(var i=0; i<campos.length; i++){
        var campo = $("#"+campos[i]);
        var campo_text = $("#text_"+campos[i]);
        if(campo.attr('class').indexOf("d-none")<0){
            propiedades.push({
                nombre: campos[i],
                text: campo.text(),
                position: campo.css("position"),
                width: campo.css("width"),
                right: campo.css("right"),
                height: campo.css("height"),
                bottom: campo.css("bottom"),
                left: campo.css("left"),
                top: campo.css("top"),
                clase: campo.attr('class'),
                font_size: campo.css('font-size'),
                text_align: campo.css('text-align'),
                font_weight: campo.css('font-weight')
            });
            propiedades.push({
                nombre:"text_"+campos[i],
                text: campo_text.text(),
                position: campo_text.css("position"),
                width: campo_text.css("width"),
                right: campo_text.css("right"),
                height: campo_text.css("height"),
                bottom: campo_text.css("bottom"),
                left: campo_text.css("left"),
                top: campo_text.css("top"),
                clase: campo_text.attr('class'),
                font_size: campo_text.css('font-size'),
                text_align: campo_text.css('text-align'),
                font_weight: campo.css('font-weight')
            });
        }
    }
    
    $.ajax({
        type: 'POST',
        url: '/configuraciones/formatos/guardar',
        data:{
            modulo: "Cotizacion",
            propiedades: JSON.stringify(propiedades)
        },
        success: function (result){
            console.log(result);
        }
    });
}
function nuevo(){
    var div_campo="";
    var div_table="";
    $("#formato_impresion").html("");
    $("#campos_impresion").html("");
    for(var i= 0; i<campos.length;i++){
        var element=campos[i];
        div_campo='<div class="draggable sm text-info border border-info d-none px-1" id ="text_'+element+'" contenteditable="true" style="width: 300px"><span>'+ element + '</span></div>';
        $("#formato_impresion").append(div_campo);
        div_campo= '<div class="draggable sm border border-info d-none px-1" id ="'+ element +'" contenteditable="true" style="left: 0px;width: 300px"><span>'+(element == 'empresa_logo' ? '' : element) +'</span></div>';
        $("#formato_impresion").append(div_campo);


        // div_campo='<div class="row"><div class="col-sm-5"><div class="form-check my-0 py-0 sm"><input type="checkbox" class="form-check-input sm" id="checkbox_'+element+'"><label class="form-check-label col-form-label-sm sm" for="checkbox_'+element+'">'+element+'</label></div></div><div class="col-sm-2"><div class="form-group row my-05 py-05"><input type="number" id = "font_size_'+element+'" class="form-control form-control-sm my-0 py-0 text-right" value ="10.88"></div></div></div>';

        //Con Negrita y bordes
        div_table='<tr><td><div class="form-check my-0 py-0 sm"><input type="checkbox" class="form-check-input sm" id="checkbox_'+element+'"><label class="form-check-label col-form-label-sm sm" for="checkbox_'+element+'">'+element+'</label></div></td><td class="text-center"><input type="number" id = "font_size_'+element+'" class="form-control form-control-sm text-right" value ="10.88"></td><td class="text-center"><select class="custom-select custom-select-sm sm-auto" id = "posicion_text_'+element+'"><option value="right">Derecha</option><option value="left">Izquierda</option><option value="center">Centrado</option></select></td><td class="text-center"><select class="custom-select custom-select-sm sm-auto" id = "posicion_'+element+'"><option value="right">Derecha</option><option value="left">Izquierda</option><option value="center">Centrado</option></select></td><td class="text-center"><div class="form-check"><input class="form-check-input" type="checkbox" id = "negrita_'+element+'"></div></td><td class="text-center"><div class="form-check"><input class="form-check-input" type="checkbox" id = "bordes_'+element+'"></div></td></tr>'

        
        $("#campos_propiedades").append(div_table);
        

        $("#checkbox_"+element).on( 'change', function() {
            var nameField=$(this).attr("id").replace("checkbox_","");
            if( $(this).is(':checked') ) {
                $('#'+nameField).removeClass("d-none");
                $('#text_'+nameField).removeClass("d-none");
            }else{
                $('#'+nameField).addClass("d-none");
                $('#text_'+nameField).addClass("d-none");
            }
        });
        $("#font_size_"+element).on( 'change', function() {
            var nameField=$(this).attr("id").replace("font_size_","");
            $('#'+nameField).css("font-size",$(this).val()+"px");
            $('#text_'+nameField).css("font-size",$(this).val()+"px");
        });
        $("#font_size_"+element).on( 'keyup', function() {
            var nameField=$(this).attr("id").replace("font_size_","");
            $('#'+nameField).css("font-size",$(this).val()+"px");
            $('#text_'+nameField).css("font-size",$(this).val()+"px");
        });
        $("#posicion_"+element).change(function(){
            var nameField=$(this).attr("id").replace("posicion_","");
            $('#'+nameField).css("text-align",$(this).val());
        });
        $("#posicion_text_"+element).change(function(){
            var nameField=$(this).attr("id").replace("posicion_text_","");
            $('#text_'+nameField).css("text-align",$(this).val());
        });
        $("#posicion_text_"+element).change(function(){
            var nameField=$(this).attr("id").replace("posicion_text_","");
            $('#text_'+nameField).css("text-align",$(this).val());
        });

        $("#bordes_"+element).on( 'change', function() {
            var nameField=$(this).attr("id").replace("bordes_","");
            if($(this).is(':checked')) {
                $('#'+nameField).removeClass("border-info");
                $('#text_'+nameField).removeClass("border-info");
            }else{
                $('#'+nameField).addClass("border-info");
                $('#text_'+nameField).addClass("border-info");
            }
        });

        $("#negrita_"+element).on( 'change', function() {
            var nameField=$(this).attr("id").replace("negrita_","");
            if($(this).is(':checked')) {
                $('#'+nameField).css("font-weight","bold");
                $('#text_'+nameField).css("font-weight","bold");
            }else{
                $('#'+nameField).css("font-weight","normal");
                $('#text_'+nameField).css("font-weight","normal");
            }
        });
        
    }

    $("#formato_impresion").append(div_campo);

    $("#empresa_logo").append(logo);
    $( ".draggable" ).draggable({
        containment: ".droppable",
        stack: ".draggable"
    });
    $( ".draggable" ).resizable();
    
}

$(document).on("keydown", function(e) {
    var keycode = (e.keyCode ? e.keyCode : e.code);
    switch(keycode){
        case 37: //Izquierda
            $("*:focus").css("left", (parseInt($("*:focus").css("left")) * 1 - 1) + "px")
            break;

        case 38: //Up
            $("*:focus").css("top", (parseInt($("*:focus").css("top")) * 1 - 1) + "px")
            break;
            
        case 39: //Derecha
            $("*:focus").css("left", (parseInt($("*:focus").css("left")) * 1 + 1) + "px")
            break;
            
        case 40: //Down
            $("*:focus").css("top", (parseInt($("*:focus").css("top")) * 1 + 1) + "px")
            break;
    }
});
function generar(){

    // $("#formato_impresion").html("");
    $.ajax({
        type: 'POST',
        url: '/configuraciones/formatos/lista',
        data:{
            modulo: "Cotizacion",
        },
        success: function (result){
            for(var i=0 ; i<result.length; i++){
                var element = result[i];
                $("#"+element.campo).removeClass();
                $("#"+element.campo).addClass(element.campo_clase);
                                
                $("#"+element.campo).css({
                    'position': element.campo_position,
                    'width': element.campo_width,
                    'height': (element.campo_height=="0px" ? "auto": element.campo_height ),
                    'right': element.campo_right,
                    'left': element.campo_left,
                    'bottom': element.campo_bottom,
                    'top': element.campo_top,
                    'font-size': element.campo_font_size,
                    'text-align': element.campo_text_align,
                    'font-weight':element.campo_font_weight
                });
                $('#'+element.campo+' span').text(element.nuevo_texto);

             

                $("#font_size_"+element.campo).val(parseInt(element.campo_font_size));
                $("#checkbox_"+element.campo).prop('checked', element.campo_clase.indexOf("d-none")<0 ? true : false);
                $("#posicion_"+element.campo).val(element.campo_text_align);
                $("#bordes_"+element.campo).prop('checked', element.campo_clase.indexOf("border-info")<0 ? true : false);
                $("#negrita_"+element.campo).prop('checked', element.campo_font_weight=="700" ? true : false);
                
            }

        }
    });
}

function imprimir(){
    $("#formato_impresion").printThis();
}
function validar(){
    return true;
}