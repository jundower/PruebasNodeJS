var tasa_cambio = "tasa_cambio";
var codigo_cliente = "codigo_cliente";
var numero_correlativo = "numero_correlativo";
var grid_detalle_ventas = "grid_detalle_ventas"
var fecha_trabajo=new Date();
var short_fecha_trabajo="";
var url_configuraciones_tipo_cambio="/configuraciones/tipo_cambio";

var jq_tasa_cambio;
var jq_codigo_cliente;
var jq_numero_correlativo;
var jq_grid_detalle_ventas;

var Estado = '';
var tipo_validacion ='ventas'; //por defecto ventas
var configuraciones_globales=[];

$(document).ready(function() {
    jq_tasa_cambio = $("#"+tasa_cambio);
    jq_codigo_cliente = $("#"+codigo_cliente);
    jq_numero_correlativo = $("#"+numero_correlativo);
    jq_grid_detalle_ventas = $("#"+grid_detalle_ventas);
    
    short_fecha_trabajo =  getShortDate(fecha_trabajo);

    $('#nuevo').click(function (){
        $("#guardar").prop("disabled", false);
        nuevo();
    });
    $('#guardar').click(function (){
        if (validar() == true)
            guardar();
    });
    $('#listar').click(function (){
        listar();
    });
    $('#imprimir').click(function (){
        imprimir();
    });
    $('#aprobar').click(function (){
        aprobar();
    });
    $('#desaprobar').click(function (){
        desaprobar();
    });
    $('.dropdown-submenu').on('click', function (e) {
        e.stopPropagation();
        $($(this).attr("href")).toggle();
    });

    $('.dropdown-item').on('show.bs.dropdown', function () {
        console.log("dropDownMenuTablas");
    })
    $('.dropdown-item').on('hidden.bs.dropdown', function (e) {
        var target = $(e.target);
        if(target.hasClass("keepopen") || target.parents(".keepopen").length){
            return false; // returning false should stop the dropdown from hiding.
        }else{
            return true;
        }
    });
    
    $(".focusIn").focusin(function(){
        $(this).select();
    });
    
    $(".focusIn").focusin(function(){
        $(this).select();
    });
    // $(".focusIn").focusin(function(){
    //     $(this).select();
    // });
    
    $.ajax({
        type: 'POST',
        url: '/configuraciones/globales',
        success: function (result){
            configuraciones_globales=result[0];
        }
    });
    
    $(".no-calendar").click(function(){
        console.log($(this).val());
    })

});

$(document).on("keydown", function(e) {
    var keycode = (e.keyCode ? e.keyCode : e.code);
    if(keycode == '13'){ //13 enter
        e.preventDefault();
    }
});

function setTitle(Titulo){
    $("#TitleHeader").text(Titulo);
    $("#titulo_ventana").text(Titulo);
    $(".titulos_ventanas").text(Titulo);
}


function validarDetalleVentas(){
    

    var jq_grid=jq_grid_detalle_ventas;
    var dataIDs = jq_grid.getDataIDs(); 
    jq_grid.saveCell(selected_Id_detalle_ventas,selected_cell_detalle_ventas);

    for(i = 0; i < dataIDs.length; i++)
    {
        var rowData = jq_grid.jqGrid ('getRowData', dataIDs[i]);
        if(isEmptyOrWhiteSpaces(rowData.Nombre)){
            jq_grid.jqGrid ("delRowData", dataIDs[i]);
        }else if(isEmptyOrWhiteSpaces(rowData.Codigo)){
            jq_grid.jqGrid ("setRowData", dataIDs[i],{"Codigo": "00"});
            jq_grid.jqGrid ("setRowData", dataIDs[i],{"Codigo_Almacen": "00"});
            jq_grid.jqGrid ("setRowData", dataIDs[i],{"Codigo_Unidad": "00"});
            jq_grid.jqGrid ("setRowData", dataIDs[i],{"Codigo_presentacion": "00"});
            jq_grid.jqGrid ("setRowData", dataIDs[i],{"Unidad_presentacion": "00"});
        }
    }
    
    return jq_grid_detalle_ventas.getDataIDs().length == 0;
}

function validarDetallecomparativo_precios(){

    var jq_grid=jq_grid_detalle_comparativo_precios;
    var dataIDs = jq_grid.getDataIDs(); 
    jq_grid.saveCell(selected_Id_detalle_comparativo_precios,selected_Id_Cell_detalle_comparativo_precios);

    for(i = 0; i < dataIDs.length; i++)
    {
        var rowData = jq_grid.jqGrid ('getRowData', dataIDs[i]);
        if(isEmptyOrWhiteSpaces(rowData.Nombre)){
            jq_grid.jqGrid ("delRowData", dataIDs[i]);
        }else if(isEmptyOrWhiteSpaces(rowData.Codigo)){
            jq_grid.jqGrid ("setRowData", dataIDs[i],{"Codigo": "00"});
        }
    }
    
    return jq_grid_detalle_comparativo_precios.getDataIDs().length == 0;
}

async function rellenar_codigo_nombre(url_post, elemento, id_predeterminado, value_predeterminado, trigger){
    var jq_elemento = $('#'+elemento);
    var req = false;
    await $.ajax({
        type: 'POST',
        url: url_post,
        success: function (result){
            jq_elemento.html('');
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
            if (elemento == "codigo_caja_banco") {
                rellenar_nombre_banco(jq_elemento.val());
            }
            req = true;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            req = false;
        }
    });

    return req;
};

async function rellenar_codigo_nombre_clase(url_post, elemento, data, value_predeterminado, trigger) {
    var jq_elemento = $('.'+elemento);
    var req = false;
    await $.ajax({
        type: 'POST',
        url: url_post,
        success: function (result){
            jq_elemento.html('');
            result.forEach(list=>{
                jq_elemento.append('<option value="'+list.Codigo+'" >'+list.Nombre + "</option>");
            });

            for (let k = 0; k < data.length; k++) {
                var select = data[k].element;
                select.val(data[k].predeterminado)
            }
            if (!isEmptyOrWhiteSpaces(value_predeterminado)) {
                jq_elemento.val(value_predeterminado); ///Dinámico
            }
            req = true;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            req = false;
        }
    });

    return req;
}

function rellenar_tasa_cambio(elemento, fecha, tipo_cambio){
    var jq_elemento = $('#'+elemento);
    $.ajax({
        type: 'POST',
        url: url_tasa_cambio,
        data:{fecha:fecha,tipo_cambio:tipo_cambio},
        success: function (lists){
            jq_elemento.val(formatCurrency(lists,3));
       }
    });
}


function rellenar_tipo_cambio(elemento, sub_elemento, elemento_fecha){
    
    var jq_elemento = $('#'+elemento);
    var jq_subelemento = $('#'+sub_elemento);

    jq_subelemento.prop( "disabled", true );
    jq_elemento.html('');
    jq_elemento.append("<option value='VTA'>Venta</option>");
    jq_elemento.append("<option value='COM'>Compra</option>");
    jq_elemento.append("<option value='ESP'>Especial </option>");
    jq_elemento.change(function() {
        var fecha = $("#"+elemento_fecha).val();
        rellenar_tasa_cambio(sub_elemento,fecha,jq_elemento.val());
        if(jq_elemento.val()=="ESP"){
            jq_subelemento.prop( "disabled", false );
        }else{
            jq_subelemento.prop( "disabled", true );
        }
    });
}

function rellenar_moneda(elemento){
    var jq_elemento = $('#'+elemento);
    jq_elemento.html('');
    jq_elemento.append("<option value='S/'>S/</option>");
    jq_elemento.append("<option value='$'>$</option>");
}
