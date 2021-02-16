var fecha_trabajo=new Date();
var url_configuracion_grid="/configurar_tablas/generar";
var url_lista = '/cotizacion/lista_documentos_aprobacion';
var url_actualizar = "/cotizacion/aprobaciones";
var url_responsables = "/usuario/responsables";
var url_consultar = "'/cotizacion/consultar'";


var lista_documentos="lista_documentos";
var estado = "estado";
var responsable = "responsable";
var comentario1 = "comentario1";
var contenedor_formato_impresion = "contenedor_formato_impresion";

var jq_lista_documentos;
var jq_estado;
var jq_responsable;
var jq_comentario1;
var jq_contenedor_formato_impresion;
var jq_fecha_tramite;

var jqGridWrapperId;
var top_jq_contenedor_formato_impresion="0px";
var left_jq_contenedor_formato_impresion="0px";

var col_grid_lista_documentos=[];
var col_model_grid_lista_documentos=[];
var tipo_responsables;
var codigo_tipo_documento;
var tipo_aprobaciones="aprobaciones_ventas";
var modulo_aprobaciones_formato_impresion="compras";
var tipo_formato_aprobaciones_formato_impresion="tramites";
var documentos_listas_cabecera = [];

$(document).ready(function() {
    
    $("#aprobar").show();
    $("#desaprobar").show();
    $("#imprimir").show();
    $("#exportar").show();
    $("#guardar").prop("disabled",true);
    
    jq_lista_documentos=$("#"+lista_documentos);
    jq_estado=$("#"+estado);
    jq_responsable=$("#"+responsable);
    jq_comentario1=$("#"+comentario1);
    jq_contenedor_formato_impresion=$("#"+contenedor_formato_impresion);
    
    jq_contenedor_formato_impresion.draggable();
    
    jq_estado.change(function() {
        recargar_jgrid();
    });
    jq_contenedor_formato_impresion.hide();
    $("#close_print").click(function(){
        jq_contenedor_formato_impresion.hide();
    });

    $('#exportar').click(function (){
        createExcelFromGrid(lista_documentos,$("#TitleHeader").text(),documentos_listas_cabecera)
        // jq_lista_documentos.tableExport({
        //     formats: ["xlsx"], //Tipo de archivos a exportar ("xlsx","txt", "csv", "xls")
        //     position: 'bottom',  // Posicion que se muestran los botones puedes ser: (top, bottom)
        //     bootstrap: false,//Usar lo estilos de css de bootstrap para los botones (true, false)
        //     fileName: $("#modulo").text(),    //Nombre del archivo 
        // });
    });
    cargar_configuracion();

});

function cargar_configuracion(){
    var modulo = $("#modulo").text();
    url_lista = '/'+modulo+'/lista_documentos_aprobacion';
    url_consultar = '/'+modulo+'/consultar';
    url_actualizar = '/'+modulo+'/aprobaciones';

    switch (modulo){
        case "cotizacion":
            setTitle("Aprobacion de Cotizaciones");
            tipo_responsables = 'COT';
            tipo_aprobaciones = 'aprobaciones_ventas';
            codigo_tipo_documento='COT';
            modulo_aprobaciones_formato_impresion = "ventas";
            tipo_formato_aprobaciones_formato_impresion = "tramites";
            break;
        case "pedido":
            setTitle("Aprobacion de Pedidos");
            tipo_responsables = 'PED';
            tipo_aprobaciones = 'aprobaciones_ventas';
            codigo_tipo_documento='PED';
            modulo_aprobaciones_formato_impresion = "ventas";
            tipo_formato_aprobaciones_formato_impresion = "tramites";
            break;
        case "requerimientos01":
            setTitle("Aprobacion 1 de Requerimientos");
            tipo_responsables = 'REQ1';
            url_lista = '/requerimientos/lista_documentos_aprobacion01';
            url_consultar = '/requerimientos/consultar';
            url_actualizar = '/requerimientos/aprobaciones01';
            tipo_aprobaciones = 'aprobaciones_compras';
            codigo_tipo_documento='REQ';
            modulo_aprobaciones_formato_impresion = "compras";
            tipo_formato_aprobaciones_formato_impresion = "tramites";
            break;
        case "requerimientos02":
            setTitle("Aprobacion 2 de Requerimientos");
            tipo_responsables = 'REQ2';
            url_lista = '/requerimientos/lista_documentos_aprobacion02';
            url_consultar = '/requerimientos/consultar';
            url_actualizar = '/requerimientos/aprobaciones02';
            tipo_aprobaciones = 'aprobaciones_compras';
            codigo_tipo_documento='REQ';
            modulo_aprobaciones_formato_impresion = "compras";
            tipo_formato_aprobaciones_formato_impresion = "tramites";
            break;
        case "orden_compra":
            setTitle("Aprobacion de Ordenes de Compra");
            tipo_responsables = 'OC';
            tipo_aprobaciones = 'aprobaciones_compras';
            codigo_tipo_documento='OC';
            modulo_aprobaciones_formato_impresion = "compras";
            tipo_formato_aprobaciones_formato_impresion = "tramites";
            break;
    }
    cargar_responsable();
    cargar_configuracion_aprobaciones();
}
$(window).bind('resize', function() {
    resize_jqgrid_porcentajes(jq_lista_documentos, 50 ,94);
    //Este código no se usa aún, es útil, pero se usará cuando el cliente lo exija
    //Corrección para que el formato de impresión se rediriga al centro
    // if(jq_contenedor_formato_impresion.css("top") != "-"+$(jqGridWrapperId).parent().height()+"px" ){
    //     jq_contenedor_formato_impresion.css("top","-"+$(jqGridWrapperId).parent().height()+"px");
    // }
});

$(window).keydown(function(event) {

    var keycode = (event.keyCode ? event.keyCode : event.code);
    console.log(keycode);
    //Esc = 27
    if(keycode == '27') {
        jq_contenedor_formato_impresion.hide();
    }
    
});

function aprobar(){
    actualizar_estado("Aprobado");
}
function desaprobar(){
    actualizar_estado("Desaprobado");
}

function cargar_responsable(){
    
    var jq_elemento = jq_responsable;
    $.ajax({
        type: 'POST',
        url: url_responsables,
        data:{
            tipo: tipo_responsables
        },
        success: function (lists){
            jq_elemento.html('');
            lists.forEach(list=>{
                jq_elemento.append('<option value="'+list.Codigo+'" >'+list.Nombre + '</option>');
            });
       }
   });
}

function recargar_jgrid(){
    var jq_grid=jq_lista_documentos;

    jq_grid.jqGrid('setGridParam',{
        url: url_lista, 
        type: "POST",
        postData:{
            estado: jq_estado.val()
        }
    }).trigger('reloadGrid', { fromServer: true, page: 1 });
}



function cargar_configuracion_aprobaciones(){
    $.ajax({
        type: 'POST',
        url: url_configuracion_grid,
        data:{
            modulo: tipo_aprobaciones
        },
        success: function (lists){
            cargar_jq_grid__aprobaciones(lists);
        }
    });

}

function cargar_jq_grid__aprobaciones(configuraciones){
    var configuracion_width= configuraciones[0];
    var configuracion_visibilidad= configuraciones[1];
    var configuracion_posicion= configuraciones[2];
    var configuracion_nueva_posicion= configuraciones[3];
    var configuracion_formato= configuraciones[4];
    var configuracion_editable= configuraciones[5];
    
    var jq_grid=jq_lista_documentos;
    
    //El Pivot solo acepta para numeros, por el max()
    //1: text | 2:number | 3:currency

    col_grid_lista_documentos.push('');
    col_model_grid_lista_documentos.push(
        {
            name: 'activo', 
            index: 'activo', 
            width: 60, 
            align: 'center',
            formatter: 'checkbox', 
            editoptions: { value: '1:0' },
            formatoptions: { disabled: false }
        }
    );
    for(var i=3 ; i<Object.keys(configuracion_visibilidad).length; i++)
    {
        var col_nombre=Object.keys(configuracion_visibilidad)[i];

        col_grid_lista_documentos.push(col_nombre);

        var codigo_formato=configuracion_formato[Object.keys(configuracion_formato)[i]];
        
        col_model_grid_lista_documentos.push(
            {
                name:col_nombre,
                index:col_nombre,
                width:configuracion_width[col_nombre],
                hidden:((configuracion_visibilidad[col_nombre]=='1') ? true:false),
                template:((codigo_formato=='1') ? numberTemplate:(codigo_formato=='2') ? currencyTemplate:(codigo_formato=='3') ? realTemplate:textTemplate)
            }
        );
        configuracion_visibilidad[col_nombre]=='0' ? documentos_listas_cabecera.push(col_nombre): "";
    }

    jq_grid.jqGrid({
        url: url_lista,
        mtype: "POST",
        datatype: "json",
        postData: {
            estado: jq_estado.val()
        },
        colNames:col_grid_lista_documentos,
        colModel: col_model_grid_lista_documentos,
        rowNum:50,
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        width: 1100,
        height: 400,
        rowList:[50,500,5000,50000],
        loadonce: true, 
        pager: '#lista-documentos-pager',
        onSelectRow: function (rowid, status, e){
            var fila=fila=jq_grid.jqGrid("getRowData",rowid);

            $("#aprobaciones_contenedor_formato_impresion").html("");
            $.ajax({
                type: "POST",
                url: url_consultar,
                data: {
                    numero_documento : fila.Numero,
                    motivo_documento : fila.Codigo_Motivo_Serie,
                    codigo_punto_venta : fila.Codigo_Punto_Venta
                },
                success:  function (data) {
                    jqGridWrapperId = "#gbox_" + jq_grid.attr('id')
                    
                    $("#contenedor_impresion").show();
                    $("#contenedor_impresion").css("display","inline-block");
                    $("#contenedor_impresion").removeClass("pt-2");
                    // $("#close_print").css("top","30px");
                    $("#close_print").css("position","relative");
                    $("#close_print").css("z-index","1");
                    jq_contenedor_formato_impresion.css("display","block");
                    jq_contenedor_formato_impresion.css("position","relative");
                    jq_contenedor_formato_impresion.css("bottom","auto");
                    // jq_contenedor_formato_impresion.css("top","-"+$(jqGridWrapperId).parent().height()+"px");
                    jq_contenedor_formato_impresion.css("top","-"+($(jqGridWrapperId).parent().height()+200)+"px");
                    jq_contenedor_formato_impresion.css("left",$(jqGridWrapperId).parent().width() * 1/3+"px");
                    if(data.length>0){
                        cargar_reporte_aprobacion(data);
                    }
                }
            });
        },
        loadComplete:function(data){
            resize_jqgrid_porcentajes(jq_grid, 50 ,94);
        }
    });

    jq_grid.jqGrid('filterToolbar',{stringResult: true, searchOnEnter : false, searchOperators : true});
}

async function cargar_reporte_aprobacion(data){

    await setFormatoImpresion(
        {
            modulo : modulo_aprobaciones_formato_impresion,
            tipo_formato : tipo_formato_aprobaciones_formato_impresion,
            punto_venta : data[0].documento_punto_venta_codigo,
            tipo_documento : data[0].documento_tipo_movimiento,
            motivo_serie : data[0].documento_motivo_venta_codigo,
        },
        data,
        false
    );
    //console.log( $("#formato_impresion").html());
    // console.log(jq_formato_impresion.html())
    var vista_previa= $("#formato_impresion").html();
    $("#aprobaciones_contenedor_formato_impresion").html(vista_previa);
}

function actualizar_estado(aprobacion){
    //Yunior Ponle una funcion Validar()
    //en la funcion validar, adentro
    //vas a poner lo siguiente:
    //ahi pones que dependa del modulo 
    //si es requerimient aprobacion 1 o no, nada más //era el 1, disculpa xD
    var modulo = $("#modulo").text();
    if(modulo == 'requerimientos01'){
        Validar_2(aprobacion);
    }
    else{
        Validar(aprobacion);
    }
}

function Validar(aprobacion) {
    var listado=[];
    var jq_grid = jq_lista_documentos;
    var gridArr = jq_grid.getDataIDs();
    var fila;
    short_fecha_trabajo =  getShortDate(fecha_trabajo);
    gridArr.forEach(element => {
        fila=jq_grid.jqGrid("getRowData",element);
        if( fila.activo == "1" && fila.Atencion == 'Pendiente'){
            listado.push(fila);
        }
    });
    
    $.ajax({
        type: 'POST',
        url: url_actualizar,
        data:{
            aprobacion: aprobacion,
            responsable: jq_responsable.val(),
            comentario: jq_comentario1.val(),
            fecha: short_fecha_trabajo,
            fila: JSON.stringify(listado),
        },
        success: function (result){
            //console.log(result);
            recargar_jgrid();
            mostrarMensaje(result.mensaje + ' Documentos '+aprobacion+'(s)',result.estado,1500);
        }
    });
}

function Validar_2(aprobacion) {
    var listado=[];
    var jq_grid = jq_lista_documentos;
    var gridArr = jq_grid.getDataIDs();
    var fila;
    short_fecha_trabajo =  getShortDate(fecha_trabajo);
    gridArr.forEach(element => {
        fila=jq_grid.jqGrid("getRowData",element);
        if( fila.activo == "1" && fila.Atencion == 'Pendiente' && fila.Aprobado2 == 'Sin Aprobacion'){
            listado.push(fila);
        }
    });
    
    $.ajax({
        type: 'POST',
        url: url_actualizar,
        data:{
            aprobacion: aprobacion,
            responsable: jq_responsable.val(),
            comentario: jq_comentario1.val(),
            fecha: short_fecha_trabajo,
            fila: JSON.stringify(listado),
        },
        success: function (result){
            recargar_jgrid();
            if (result.mensaje == 0) {
                mostrarMensaje('Estos documentos estan aprobados',false,1500);
            }
            else{
                mostrarMensaje(result.mensaje + ' Documentos '+aprobacion+'(s)',result.estado,1500);
            }
            
        }
    });
}
