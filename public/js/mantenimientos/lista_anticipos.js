var url_get_lista_anticipos = '/facturacion/lista_anticipos';

var grid_lista_anticipos='lista_anticipos';

var modal_lista_anticipos = "modal_lista_anticipos";

var jq_modal_lista_anticipos;

$(document).ready(function() {
    jq_grid_lista_anticipos = $("#"+grid_lista_anticipos);
    jq_modal_lista_anticipos = $("#"+modal_lista_anticipos);

    //cargar_jq_grid_lista_anticipos('0');

    jq_modal_lista_anticipos.on('shown.bs.modal', function () {
        resize_jqgrid_porcentajes(jq_grid_lista_anticipos,60,87);
    });

})

$(window).bind('resize', function() {
    resize_jqgrid_porcentajes(jq_grid_lista_anticipos,60,87);
});

function cargar_jq_grid_lista_anticipos(codigo_cliente) {
    jq_grid_lista_anticipos.jqGrid('GridUnload');
    jq_grid_lista_anticipos.jqGrid({
        url: url_get_lista_anticipos,
        mtype: "POST",
        datatype: "json",
        postData: {
            codigo_cliente: codigo_cliente
        },
        colNames:['Serie','Numero','Fecha','Moneda','Sub_Total','Igv','Importe','Sub_Total_Dolares','Igv_Dolares','Importe_Dolares','Movimiento','Tipo_Movimiento','Punto_Venta','tipo_cambio'],
        colModel:[
            {name:'Serie', width:100},
            {name:'Numero', width:100},
            {name:'Fecha', width:100, align:"center"},
            {name:'Moneda', width:100, align:"center"},
            {name:'Sub_Total_Soles', width:100, template: numberTemplate},
            {name:'Igv_Soles', width:100, template: numberTemplate},
            {name:'Importe_Soles', width:100, template: numberTemplate},
            {name:'Sub_Total_Dolares', width:100, template: numberTemplate},
            {name:'Igv_Dolares', width:100, template: numberTemplate},
            {name:'Importe_Dolares', width:100, template: numberTemplate},
            {name:'Movimiento', width:100, hidden: true},
            {name:'Tipo_Movimiento', width:100, hidden: true},
            {name:'Punto_Venta', width:100, hidden: true},
            {name:'tipo_cambio', width:100, template: numberTemplate},
        ],
        rowNum:50,
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        width: 1190,
        height: 400,
        rowList:[50,500,5000,50000],
        multiselect: true,
        loadonce: true, 
        pager: '#lista_anticipos_pager',
        onSelectRow: function (rowid, status, e){
            
        },
        ondblClickRow: function(rowid, iRow, iCol, e){

        },
        loadComplete:function(data){

        }
    });

    
}

$("#enviar_anticipo").click(function name(params) {
    enviar_datos_anticipo();
});