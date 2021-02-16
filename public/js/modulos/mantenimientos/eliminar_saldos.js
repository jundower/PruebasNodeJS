var url_getdocumentos;
var url_getdetalle;
var url_eliminar_saldos;


var lista_documentos="lista_documentos";
var detalle_documentos="detalle_documentos";

var jq_lista_documentos;
var jq_detalle_documentos;

var col_grid=[];
var col_model=[];
var newIds=[];


$(document).ready(function() {
    jq_lista_documentos=$("#"+lista_documentos);
    jq_detalle_documentos=$("#"+detalle_documentos);
    //Se usará el botón aprobar, se cambiará el nombre y se usará la función "aprobar()"
    $('#aprobar').prop('title', 'Eliminar Saldos');
    $('#aprobar').show();
    cargar_configuracion();
});

function cargar_configuracion(){
    var modulo = $("#modulo").text();
    url_getdocumentos = '/'+modulo+'/lista_documentos_pendientes';
    url_getdetalle = '/'+modulo+'/lista_detalle_pendientes';
    url_eliminar_saldos = '/'+modulo+'/eliminar_saldos';
    setTitle("Eliminar saldos "+modulo);
    switch (modulo){
        case "cotizacion":
            setTitle("Eliminar saldos Cotización");
            cargar_lista();
            break;
        case "pedido":
            setTitle("Eliminar saldos Pedido");
            cargar_lista();
            break;
        case "guia":
            setTitle("Eliminar saldos Guía de Remisión");
            cargar_lista();
            break;
        case "requerimientos":
            setTitle("Eliminar saldos Requerimientos");
            cargar_lista_compras();
            break;
        case "orden_compra":
            setTitle("Eliminar saldos Orden compra");
            cargar_lista_compras();
            break;
    }
    //cargar_lista();
    cargar_detalle();
}

$(window).bind('resize', function() {
    resize_jqgrid_porcentajes(jq_lista_documentos, 35, 96);
    resize_jqgrid_porcentajes(jq_detalle_documentos, 30, 96);
});

function cargar_lista(){

    var jq_grid=jq_lista_documentos;
    var col_grid=[
        "",
        "Punto_Venta",
        "Codigo_Motivo_Serie",
        "Numero",
        "Fecha",
        "Codigo_Cliente",
        "Nombre_Cliente",
        "Fecha_Entrega",
        "Forma_Pago",
        "Moneda",
        "Cencos",
        "Ot",
        "responsable",
        "unidad_negocio",
        "Codigo_Agencia",
        "glosa",
        "si_igv",
        "Nombre_Cencos",
        "Nombre_Motivo"
    ];
    var col_model=[
        {
            name: 'activo', 
            index: 'activo', 
            width: 60, 
            align: 'center',
            formatter: 'checkbox', 
            editoptions: { value: '1:0' },
            formatoptions: { disabled: false }
        },
        {name:"Punto_Venta",width:100,template: textTemplate},
        {name:"Codigo_Motivo_Serie",width:100,template: textTemplate},
        {name:"Numero",width:100,template: textTemplate},
        {name:"Fecha",width:100,template: textTemplate},
        {name:"Codigo_Cliente",width:100,template: textTemplate},
        {name:"Nombre_Cliente",width:100,template: textTemplate},
        {name:"Fecha_Entrega",width:100,template: textTemplate},
        {name:"Forma_Pago",width:100,template: textTemplate},
        {name:"Moneda",width:100,template: textTemplate},
        {name:"Cencos",width:100,template: textTemplate},
        {name:"Ot",width:100,template: textTemplate},
        {name:"responsable",width:100,template: textTemplate},
        {name:"unidad_negocio",width:100,template: textTemplate},
        {name:"Codigo_Agencia",width:100,template: textTemplate},
        {name:"glosa",width:100,template: textTemplate},
        {name:"si_igv",width:100,template: textTemplate},
        {name:"Nombre_Cencos",width:100,template: textTemplate},
        {name:"Nombre_Motivo",width:100,template: textTemplate}
    ];
    
    jq_grid.jqGrid({
        url: url_getdocumentos,
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: ''
        },
        colNames: col_grid,
        colModel: col_model,
        rowNum:50,
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        width: 400,
        height: 400,
        rowList:[50,500,5000,50000],
        loadonce: true, 
        pager: '#lista_documentos_pager',
        onSelectRow: function (rowid, status, e){
            recargar_detalle(rowid)
        },
        loadComplete:function(data){
            resize_jqgrid_porcentajes(jq_grid, 35,96);
        }
    }).jqGrid('filterToolbar',{stringResult: true, searchOnEnter : false, searchOperators : true});
}

function cargar_lista_compras(){

    var jq_grid=jq_lista_documentos;
    var col_grid=[
        "",
        "Punto_Venta",
        "Codigo_Motivo_Serie",
        "Numero",
        "Fecha",
        "Fecha_Limite",
        "Prioridad",
        "Moneda",
        "Cencos",
        "Ot",
        "Responsable",
        "Unidad_Negocio",
        "Codigo_Agencia",
        "glosa",
        "si_igv",
        "Nombre_Cencos",
        "Nombre_Motivo"
    ];
    var col_model=[
        {
            name: 'activo', 
            index: 'activo', 
            width: 60, 
            align: 'center',
            formatter: 'checkbox', 
            editoptions: { value: '1:0' },
            formatoptions: { disabled: false }
        },
        {name:"Punto_Venta",width:100,template: textTemplate},
        {name:"Codigo_Motivo_Serie",width:100,template: textTemplate},
        {name:"Numero",width:100,template: textTemplate},
        {name:"Fecha",width:100,template: textTemplate},
        {name:"Fecha_Limite",width:100,template: textTemplate},
        {name:"Prioridad",width:100,template: textTemplate},
        {name:"Moneda",width:100,template: textTemplate},
        {name:"Cencos",width:100,template: textTemplate},
        {name:"Ot",width:100,template: textTemplate},
        {name:"Responsable",width:100,template: textTemplate},
        {name:"Unidad_Negocio",width:100,template: textTemplate},
        {name:"Codigo_Agencia",width:100,template: textTemplate},
        {name:"glosa",width:100,template: textTemplate},
        {name:"si_igv",width:100,template: textTemplate},
        {name:"Nombre_Cencos",width:100,template: textTemplate},
        {name:"Nombre_Motivo",width:100,template: textTemplate}
    ];
    
    jq_grid.jqGrid({
        url: url_getdocumentos,
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: ''
        },
        colNames: col_grid,
        colModel: col_model,
        rowNum:50,
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        width: 400,
        height: 400,
        rowList:[50,500,5000,50000],
        loadonce: true, 
        pager: '#lista_documentos_pager',
        onSelectRow: function (rowid, status, e){
            recargar_detalle(rowid)
        },
        loadComplete:function(data){
            resize_jqgrid_porcentajes(jq_grid, 35,96);
        }
    }).jqGrid('filterToolbar',{stringResult: true, searchOnEnter : false, searchOperators : true});
}

function cargar_detalle(){
    var jq_grid=jq_detalle_documentos;

    var col_grid=[
        "",
        "Cantidad",
        "Codigo_Unidad",
        "Factor",
        "Codigo",
        "Nombre",
        "Igv_Art",
        "Unit",
        "Base_Imponible",
        "Base_Calculada",
        "Igv",
        "Importe",
        "Punto_Venta",
        "Codigo_Motivo_Serie",
        "Numero",
        "NItem"
    ];
    var col_model=[
        {
            name: 'activod', 
            width: 60, 
            align: 'center',
            formatter: 'checkbox', 
            editoptions: { value: '1:0' },
            formatoptions: { disabled: true }
        },
        {name:"Cantidad",width:100},
        {name:"Codigo_Unidad",width:100},
        {name:"Factor",width:100},
        {name:"Codigo",width:100},
        {name:"Nombre",width:100},
        {name:"Igv_Art",width:100},
        {name:"Unit",width:100},
        {name:"Base_Imponible",width:100},
        {name:"Base_Calculada",width:100},
        {name:"Igv",width:100},
        {name:"Importe",width:100},
        {name:"Punto_Venta",width:100},
        {name:"Codigo_Motivo_Serie",width:100},
        {name:"Numero",width:100},
        {name:"NItem",width:100}
    ];
    
    jq_grid.jqGrid({
        url: url_getdetalle,
        mtype: "POST",
        datatype: "json",
        postData:{
            punto_venta: "",
            motivo: "",
            numero: ""
        },
        colNames: col_grid,
        colModel: col_model,
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        width: 400,
        height: 400,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        loadComplete:function(data){
            resize_jqgrid_porcentajes(jq_grid, 35,96);
        }
    });
    
}


function recargar_detalle(rowID){
    var fila = jq_lista_documentos.jqGrid("getRowData",rowID);
    var jq_grid=jq_detalle_documentos;
    jq_grid.jqGrid("setGridParam",{
        url: url_getdetalle,
        mtype: "POST",
        datatype: "json",
        postData:{
            punto_venta: fila.Punto_Venta,
            motivo_serie: fila.Codigo_Motivo_Serie,
            numero: fila.Numero
        }
    }).trigger("reloadGrid");
}

function aprobar(){
    var datos=[];
    var jq_grid = jq_lista_documentos;
    var gridArr = jq_grid.getDataIDs();
    var fila;
    gridArr.forEach(element => {
        fila=jq_grid.jqGrid("getRowData",element);
        if( fila.activo == "1"){
            datos.push(fila);
        }
    });
    
    $.ajax({
        type: 'POST',
        url: url_eliminar_saldos,
        data:{
            datos: JSON.stringify(datos)
        },
        success: function (result){
            if(result.estado == true){
                jq_lista_documentos.jqGrid("setGridParam",{
                    url: url_getdocumentos,
                    mtype: "POST",
                    datatype: "json",
                }).trigger("reloadGrid");
                jq_detalle_documentos.jqGrid("setGridParam",{
                    url: url_getdetalle,
                    mtype: "POST",
                    postData:{
                        punto_venta: "",
                        motivo: "",
                        numero: ""
                    },
                    datatype: "json",
                }).trigger("reloadGrid");
            }
            mostrarMensaje(result.mensaje,result.estado,1500);
        }
    });
}