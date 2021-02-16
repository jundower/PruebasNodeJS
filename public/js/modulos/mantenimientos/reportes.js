var grid_reporte_documentos='reporte-documentos'

var jq_grid_reporte_documentos;

var jq_resumido;
var jq_detallado;
var url_resumido;
var url_detallado;
var id_subgrid;
var modulo="";

var cabecera=[];
var resumido=[];
var detallado=[];
var tipo_reporte;
var idsFooter=[];
var titulo_reporte;
var groupingList=[];
var agroup1=[];
var agroup2=[];
var agroup3=[];
var colNames=[];
var colModel=[];
var filtrado = false;
var first_col="";

var lista_agrupacion={
    Punto_Venta : "",
    Codigo_Motivo : "motivos_tramite",
    Motivo : "motivos_tramite",
    Codigo_Centro_Costo : "centro_costos",
    Centro_Costo : "centro_costos",
    responsable_aprobacion : "responsable_aprobacion",
    Responsable_Aprobacion_1 : "responsable_aprobacion",
    Responable_Aprobacion_2 : "responsable_aprobacion_2",
    Codigo_Orden_Trabajo : "orden_trabajo",
    Orden_Trabajo : "orden_trabajo",
    Codigo_Unidad_Negocio : "unidad_negocio",
    Unidad_Negocio : "unidad_negocio",
    Codigo_Proveedor : "codigo_proveedor",
    Nombre_Proveedor : "codigo_proveedor",
    Codigo_Articulo: "articulos",
    Nombre_Articulo: "articulos",
    Codigo_Forma_Pago: "forma_pago_lista",
    Nombre_Forma_Pago: "forma_pago_lista",
    Forma_Pago: "forma_pago_lista",
    Codigo_Cliente: "codigo_cliente",
    Nombre_Cliente: "codigo_cliente",
    Serie_Documento: "serie_documento",
    Moneda: "moneda",
}

var modulo_propiedades={
    requerimientos:{
        url_grid_resumido:"reportes_requerimientos_resumido",
        url_grid_detallado:"reportes_requerimientos_detallado",
        url_data_resumido: "/reportes_compras/requerimientos/resumido",
        url_data_detallado: "/reportes_compras/requerimientos/detallado",
        titulo:"Listado de Requerimientos",
        tipo_documento: 'REQ',
    },
    requerimientos_vs_oc:{
        url_grid_resumido:"reportes_requerimientos_vs_orden_compra",
        url_grid_detallado:"reportes_requerimientos_vs_orden_compra",
        url_data_resumido: "/reportes_compras/requerimientos/detallado",
        url_data_detallado: "/reportes_compras/requerimientos/detallado",
        titulo:"Listado de Requerimientos vs Ordenes de Compra",
        tipo_documento: 'REQ',
    },
    orden_compra:{
        url_grid_resumido:"reportes_orden_compra_resumido",
        url_grid_detallado:"reportes_orden_compra_detallado",
        url_data_resumido: "/reportes_compras/orden_compra/resumido",
        url_data_detallado: "/reportes_compras/orden_compra/detallado",
        titulo:"Listado de Orden de Compra",
        tipo_documento: 'OC',
    },
    orden_compra_vs_guias_entrada:{
        url_grid_resumido:"reportes_orden_compra_vs_guia",
        url_grid_detallado:"reportes_orden_compra_vs_guia",
        url_data_resumido: "/reportes_compras/orden_compra/detallado",
        url_data_detallado: "/reportes_compras/orden_compra/detallado",
        titulo:"Listado de Orden de Compra vs Guias de Entrada",
        tipo_documento: 'OC',
    },
    cuadro_comparativo:{
        url_grid_resumido:"reportes_cuadro_comparativo_resumido",
        url_grid_detallado:"reportes_cuadro_comparativo_detallado",
        url_data_resumido: "/reportes_compras/cuadro_comparativo/resumido",
        url_data_detallado: "/reportes_compras/cuadro_comparativo/detallado",
        titulo:"Listado de Cuadro Comparativo",
        tipo_documento: 'OC',
    },
    almacen:{
        url_grid_resumido:"reportes_almacen_resumido",
        url_grid_detallado:"reportes_almacen_detallado",
        url_data_resumido: "/reportes_almacen/almacen/resumido",
        url_data_detallado: "/reportes_almacen/almacen/detallado",
        titulo:"Listado de Almacén",
        tipo_documento: 'OC',
    },
    cotizacion:{
        url_grid_resumido:"reportes_cotizacion_resumido",
        url_grid_detallado:"reportes_cotizacion_detallado",
        url_data_resumido: "/reportes_ventas/cotizacion/resumido",
        url_data_detallado: "/reportes_ventas/cotizacion/detallado",
        titulo:"Listado de Cotizaciones",
        tipo_documento: 'COT',
    },
    cotizacion_vs_pedidos:{
        url_grid_resumido:"reportes_cotizacion_vs_pedido",
        url_grid_detallado:"reportes_cotizacion_vs_pedido",
        url_data_resumido: "/reportes_ventas/cotizacion/detallado",
        url_data_detallado: "/reportes_ventas/cotizacion/detallado",
        titulo:"Cotización vs Pedido",
        tipo_documento: 'COT',
    },
    pedido:{
        url_grid_resumido:"reportes_pedido_resumido",
        url_grid_detallado:"reportes_pedido_detallado",
        url_data_resumido: "/reportes_ventas/pedido/resumido",
        url_data_detallado: "/reportes_ventas/pedido/detallado",
        titulo:"Listado de Pedidos",
        tipo_documento: 'PED',
    },
    pedido_vs_guia:{
        url_grid_resumido:"reportes_pedido_vs_guia",
        url_grid_detallado:"reportes_pedido_vs_guia",
        url_data_resumido: "/reportes_ventas/pedido/detallado",
        url_data_detallado: "/reportes_ventas/pedido/detallado",
        titulo:"Pedido vs Guia",
        tipo_documento: 'PED',
    },
    guia:{
        url_grid_resumido:"reportes_guia_resumido",
        url_grid_detallado:"reportes_guia_detallado",
        url_data_resumido: "/reportes_ventas/guia/resumido",
        url_data_detallado: "/reportes_ventas/guia/detallado",
        titulo:"Listado de Guías",
        tipo_documento: '09',
    },
    guia_vs_factura:{
        url_grid_resumido:"reportes_guia_vs_factura",
        url_grid_detallado:"reportes_guia_vs_factura",
        url_data_resumido: "/reportes_ventas/guia/detallado",
        url_data_detallado: "/reportes_ventas/guia/detallado",
        titulo:"Guías vs Factura",
        tipo_documento: '09',
    },
    facturacion:{
        url_grid_resumido:"reportes_facturacion_resumido",
        url_grid_detallado:"reportes_facturacion_detallado",
        url_data_resumido: "/reportes_ventas/facturacion/resumido",
        url_data_detallado: "/reportes_ventas/facturacion/detallado",
        titulo:"Listado de Ventas",
        tipo_documento: 'TODOS',
    },
    ventas_diarias:{
        url_grid_resumido:"reportes_ventas_diarias_resumido",
        url_grid_detallado:"reportes_ventas_diarias_detallado",
        url_data_resumido: "/reportes_punto_venta/ventas_diarias/resumido",
        url_data_detallado: "/reportes_punto_venta/ventas_diarias/detallado",
        titulo: "Listado de Ventas Diarias",
        tipo_documento: 'TODOS',
    },
    arqueo_cajas:{
        url_grid_detallado:"reportes_pto_venta_arqueo_cajas_detallado",
        url_data_detallado: "/reportes_punto_venta/arqueo_cajas/detallado",
        titulo: "Listado Arqueo de Cajas",
        tipo_documento: 'TODOS',
    }
}
    
$(document).ready(function() {
    jq_grid_reporte_documentos = $("#"+grid_reporte_documentos);
    mantenimientos_multiselect=true; //Para Lista_Mantenimientos
    rellenar_codigo_nombre("/punto_venta/lista","punto_venta","user-punto_venta","","change")
    rellenar_cta_corriente();
    //rellenar_codigo_nombre("/cuentas_corrientes/lista","caja_cuenta_corriente","",""),
    // cargar_configuracion()
    modulo = $("#modulo").text();
    console.log(modulo);
    if (modulo == "arqueo_cajas") {
        $("#ver_radio_box").addClass("d-none");
        $("#resumido").prop("checked",false);
        $("#detallado").prop("checked",true);
        $(".caja_cuenta_corriente").removeClass("d-none");
    }
    setTitle(modulo_propiedades[modulo].titulo);
    $("#exportar").show();
    $("#imprimir").show();
    // prueba();
    $('#exportar').click(function (){
        $("#reporte-documentos").tableExport({
            formats: ["xlsx"], //Tipo de archivos a exportar ("xlsx","txt", "csv", "xls")
            position: 'bottom',  // Posicion que se muestran los botones puedes ser: (top, bottom)
            bootstrap: false,//Usar lo estilos de css de bootstrap para los botones (true, false)
            fileName: $("#modulo").text(),    //Nombre del archivo 
        });
    });

    $("#punto_venta").change(function(){
        $("#filtrar").trigger("click");
    });
    $("#radio_box").change(function(){
        $("#agrupacion1_text").val("");
        $("#agrupacion1_todos").prop("checked",true);
        $("#agrupacion2_text").val("");
        $("#agrupacion2_todos").prop("checked",true);
        $("#agrupacion3_text").val("");
        $("#agrupacion3_todos").prop("checked",true);
        $("#filtrar").trigger("click");
    });
    
    // $("input[name=moneda]").click(function () {  
    //     groupingSubGrid();
    // });
    
    $("#agrupacion1").change(function(){
        groupingSubGrid();
        $("#agrupacion1_text").val("");
        $("#agrupacion1_todos").prop("checked",true);
    })
    $("#agrupacion2").change(function(){
        groupingSubGrid();
        $("#agrupacion2_text").val("");
        $("#agrupacion2_todos").prop("checked",true);
    })
    $("#agrupacion3").change(function(){
        groupingSubGrid();
        $("#agrupacion3_text").val("");
        $("#agrupacion3_todos").prop("checked",true);
    })
    $("#agrupacion1_todos").change(function() {
        if(this.checked) {
            $("#agrupacion1_text").val("");
        }
    });
    $("#agrupacion2_todos").change(function() {
        if(this.checked) {
            $("#agrupacion2_text").val("");
        }
    });
    $("#agrupacion3_todos").change(function() {
        if(this.checked) {
            $("#agrupacion3_text").val("");
        }
    });

    $("#fecha_inicio").val(getFirstDate(new Date()));
    $("#fecha_termino").val(getLastDate(new Date()));

    $("#filtrar").click(function(){
        filtrado=true;
        if(!isEmptyOrWhiteSpaces($("#punto_venta").val())){
            var selected_value = $("input[name='reporte']:checked").val();
            if(tipo_reporte != selected_value){
                tipo_reporte = selected_value;
                cargar_tipo_reporte();
            }else{
                cargar_reporte();
            }
        }
    });
});

function groupingSubGrid(){
    var moneda_agrupacion = $("input[name='moneda']:checked").val();

    var group1 = $("#agrupacion1").val();
    var group2 = $("#agrupacion2").val();
    var group3 = $("#agrupacion3").val();

    $("#agrupacion1_text").attr("tabla",lista_agrupacion[group1]);
    $("#agrupacion2_text").attr("tabla",lista_agrupacion[group2]);
    $("#agrupacion3_text").attr("tabla",lista_agrupacion[group3]);

    var grouping = [];

    if(moneda_agrupacion=="moneda_origen") grouping.push('Moneda');
    if(group1!="Ninguno") grouping.push(group1);
    if(group2!="Ninguno") grouping.push(group2);
    if(group3!="Ninguno") grouping.push(group3);
    
    var groupText = [];
    if(moneda_agrupacion=="moneda_origen") groupText.push('Moneda: {0}');
    if(group1!="Ninguno") groupText.push('Agrupación 1: {0}');
    if(group2!="Ninguno") groupText.push('Agrupación 2: {0}');
    if(group3!="Ninguno") groupText.push('Agrupación 3: {0}');

    grouping.length>0 ? $("#"+id_subgrid).jqGrid('groupingGroupBy',grouping,{
        groupSummary : [true,true,true,true],
        groupText : groupText,
        showSummaryOnHide: true,
        // groupOrder : ['desc', 'asc', 'asc', 'asc'] 
        // groupDataSorted : true 
    }) : $("#"+id_subgrid).jqGrid('groupingRemove',true);
    groupingList=grouping;
}

$(window).bind('resize', function() {
    resize_jqgrid_restar(jq_grid_reporte_documentos,($("#myTab").css("height").replace("px",""))*1 + 200,20);
});

function cargar_tipo_reporte(){

    var url_grid=tipo_reporte=="resumido" ? modulo_propiedades[modulo].url_grid_resumido : modulo_propiedades[modulo].url_grid_detallado;
    lista_mantenimientos_tipo_documento = modulo_propiedades[modulo].tipo_documento;
    $.ajax({
        type: 'POST',
        url: "/configurar_tablas/generar",
        data:{
            modulo: url_grid
        },
        success: function (lists){
            // console.log(lists);
            var configuracion_width= lists[0];
            var configuracion_visibilidad= lists[1];
            var configuracion_formato= lists[4];
            var configuracion_editable= lists[5];
            var templates={0:textTemplate,1:numberTemplate,2:currencyTemplate,3:realTemplate,4:dateTemplate,5:cantidadTemplate};
                    
            colNames=[];
            colModel=[];
            cabecera=[];
            $("#agrupacion1").html("");
            $("#agrupacion2").html("");
            $("#agrupacion3").html("");
            
            $("#agrupacion1").append(new Option("Ninguno", "Ninguno"))
            $("#agrupacion2").append(new Option("Ninguno", "Ninguno"))
            $("#agrupacion3").append(new Option("Ninguno", "Ninguno"))

            for(var i=3 ; i<Object.keys(configuracion_visibilidad).length; i++)
            {
                var col_nombre=Object.keys(configuracion_visibilidad)[i];

                colNames.push(col_nombre);

                var codigo_formato=configuracion_formato[Object.keys(configuracion_formato)[i]];

                var element=
                    {
                        name:col_nombre,
                        index:col_nombre,
                        width:configuracion_width[col_nombre],
                        editable:((configuracion_editable[Object.keys(configuracion_editable)[i]]=='1') ? true:false),
                        hidden:((configuracion_visibilidad[col_nombre]=='1') ? true:false),
                        template:templates[codigo_formato],
                    }
                switch(element.name){
                    case "Base_Calculada":
                    case "Descuento":
                    case "Base_Imponible":
                    case "Igv":
                    case "Total":
                    case "Importe":
                    case "Cantidad":
                    case "Cantidad_Atendida":
                    case "Cantidad_Saldo":
                    case "Detalle_Base_Imponible":
                    case "Detalle_IGV":
                    case "Detalle_Importe":
                    case "Unit":
                    case "Orden_compra_1":
                    case "Orden_compra_2":
                    case "Orden_compra_3":
                    case "Orden_compra_4":
                    case "Orden_compra_5":
                    case "Guia_Entrada_1":
                    case "Guia_Entrada_2":
                    case "Guia_Entrada_3":
                    case "Guia_Entrada_4":
                    case "Guia_Entrada_5":
                    case "Pedido_1":
                    case "Pedido_2":
                    case "Pedido_3":
                    case "Pedido_4":
                    case "Pedido_5":
                    case "Guia_1":
                    case "Guia_2":
                    case "Guia_3":
                    case "Guia_4":
                    case "Guia_5":
                        element.summaryType='sum'
                    break;
                }
                if(i==3){
                    element.summaryType="count";
                    element.summaryTpl="N° Item: {0}";
                    first_col=col_nombre;
                }
                colModel.push(element);
                if(!element.hidden)
                {
                    cabecera.push(col_nombre);
                    $("#agrupacion1").append(new Option(col_nombre,col_nombre));
                    $("#agrupacion2").append(new Option(col_nombre,col_nombre));
                    $("#agrupacion3").append(new Option(col_nombre,col_nombre));
                }
            }
            $("#agrupacion1_text").attr("tabla","");
            $("#agrupacion2_text").attr("tabla","");
            $("#agrupacion3_text").attr("tabla","");
            cargar_reporte();
        }
    });
}

function cargar_reporte(){

    var url_data=tipo_reporte=="resumido" ? modulo_propiedades[modulo].url_data_resumido : modulo_propiedades[modulo].url_data_detallado;

    var jq_grid=jq_grid_reporte_documentos;
    jq_grid.jqGrid('GridUnload');

    jq_grid.jqGrid({
        colNames: ['',''],
        colModel: [
            {name:'Empresa',width: 300},
            {name:'Titulo',width: 1300, align:"center"},
        ],
        rowNum:50,
        viewrecords: true,
        rownumbers: false,
        shrinkToFit: false,
        width: 100,
        height: 100,
        rowList:[50,500,5000,50000],
        loadonce: true, 
        footerrow : true,
        subGrid : true,
        hidegrid:false,
        subgridtype: 'json', 
        caption:"&nbsp;",
        loadComplete:function(data){
            resize_jqgrid_restar(jq_grid_reporte_documentos,($("#myTab").css("height").replace("px",""))*1 + 200,20);
        },
        subGridRowExpanded: function(subgrid_id, row_id) {
            $("#reporte-documento-body").append('<div id="reporte-documentos-pager"> </div>');
            var subgrid_table_id, pager_id;
            subgrid_table_id = subgrid_id+"_t";
            pager_id = "p_"+subgrid_table_id;
            $("#"+subgrid_id).html("<table id='"+subgrid_table_id+"' class='scroll'></table><div id='"+pager_id+"' class='scroll'></div>");
            id_subgrid = subgrid_table_id;
            
            
            $("#"+subgrid_table_id).jqGrid({
                url: url_data,
                mtype: "POST",
                postData:{
                    punto_venta: $("#punto_venta").val(),
                    estado_atencion: $("input[name='estado_atencion']:checked").val(),
                    fecha_inicio: $("#fecha_inicio").val(),
                    fecha_termino: $("#fecha_termino").val(),
                    agrupacion0_tipo_moneda: $("input[name='moneda']:checked").val(),
                    agrupacion0_moneda: $("#moneda_select").val(),
                    agrupacion1_tipo: $("#agrupacion1_text").attr("tabla"),
                    agrupacion1_valores: $("#agrupacion1_text").val(),
                    agrupacion2_tipo: $("#agrupacion2_text").attr("tabla"),
                    agrupacion2_valores: $("#agrupacion2_text").val(),
                    agrupacion3_tipo: $("#agrupacion3_text").attr("tabla"),
                    agrupacion3_valores: $("#agrupacion3_text").val(),
                    caja_cuenta_corriente: $("#caja_cuenta_corriente").val(),

                },
                datatype: "json",
                colNames: colNames,
                colModel: colModel,
                rowNum:50,
                viewrecords: true,
                rownumbers: true,
                shrinkToFit: false,
                width: 1400,
                height: 400,
                rowList:[50,500,5000,50000],
                loadonce: true, 
                footerrow : true,
                pager: 'reporte-documentos-pager',
                loadComplete:function(data){
                    var jq_grid=$("#"+subgrid_table_id);
                    footer_sum(jq_grid)

                    if(filtrado){
                        setTimeout(function() { 
                            groupingSubGrid();
                        },  100);
                        
                        filtrado=false;
                    }
                }
            })
            
            resize_jqgrid_restar($("#"+subgrid_table_id),($("#myTab").css("height").replace("px",""))*1 + 350,70);
            $("#"+subgrid_table_id).jqGrid('filterToolbar',{stringResult: true, searchOnEnter : false, searchOperators : true});
        },
    });

            
    $.ajax({
        type: 'POST',
        url: '/configuraciones/datos_empresa/',
        success: function (lists) {
            var mydata = [
                {Empresa:lists[0].Razon_Social,Titulo:$("#TitleHeader").text()},
                {Empresa:lists[0].Ruc,Titulo: "Desde " + getDateFormat($("#fecha_inicio").val(),'y-m-d','d/m/y','-','/') +" Hasta "+ getDateFormat($("#fecha_termino").val(),'y-m-d','d/m/y','-','/')},
            ];
            for(var i=0;i<mydata.length;i++){
                jq_grid.jqGrid('addRowData',undefined,mydata[i]);
            }
            var rowIds = jq_grid.getDataIDs();
            jq_grid.expandSubGridRow(rowIds[rowIds.length - 1 ]); 
        }
    });
}

function imprimir(){
    $("#reporte-documentos").tableExport({
        formats: ["printHtml"], //Tipo de archivos a exportar ("xlsx","txt", "csv", "xls")
        position: 'bottom',  // Posicion que se muestran los botones puedes ser: (top, bottom)
        bootstrap: false,//Usar lo estilos de css de bootstrap para los botones (true, false)
        fileName: $("#modulo").text(),    //Nombre del archivo 
        columnas: cabecera.length,
    });
}

function mantenimientos_multiselect_function(id){
    switch(id){
        case "agrupacion1_text":
            $("#agrupacion1_todos").prop("checked",false);
        break;
        case "agrupacion2_text":
            $("#agrupacion2_todos").prop("checked",false);
        break;
        case "agrupacion3_text":
            $("#agrupacion3_todos").prop("checked",false);
        break;
    }
    
}

function rellenar_cta_corriente() {
    $.ajax({
        type: 'POST',
        url: '/cuentas_corrientes/lista',
        success: function (lists) {
            lists.forEach(list=>{
                $("#caja_cuenta_corriente").append('<option value="'+list.Codigo+'" >'+list.Codigo+' - '+list.Nombre+ '</option>');
            });
        }
    })
}

function footer_sum(jq_grid){
    var colSum = jq_grid.jqGrid('getCol', 'Cantidad', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Cantidad': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Cantidad_Kardex', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Cantidad_Kardex': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Cantidad_Atendida', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Cantidad_Atendida': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Cantidad_Saldo', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Cantidad_Saldo': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Unit', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Unit': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Base_Calculada', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Base_Calculada': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Base_Imponible', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Base_Imponible': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Igv', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Igv': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Importe', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Importe': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Precio_presentacion', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Precio_presentacion': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Monto_Descuento', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Monto_Descuento': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Descuento', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Descuento': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Total', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Total': colSum });

    colSum = jq_grid.jqGrid('getCol', 'Detalle_Base_Calculada', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Detalle_Base_Calculada': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Detalle_Descuento', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Detalle_Descuento': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Detalle_Base_Imponible', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Detalle_Base_Imponible': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Detalle_IGV', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Detalle_IGV': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Detalle_Importe', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Detalle_Importe': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Cantidad_Presentacion', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Cantidad_Presentacion': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Precio_Presentacion', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Precio_Presentacion': colSum });
    
    // console.log(jq_grid.jqGrid('getGridParam','colNames')[1]);
    // colSum = jq_grid.jqGrid('getCol', "Tipo_Venta", false, 'count');
    var footer={};
    footer[first_col]="N° Item: "+jq_grid.getDataIDs().length;
    jq_grid.jqGrid('footerData', 'set', footer);
    
    colSum = jq_grid.jqGrid('getCol', 'Orden_compra_1', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Orden_compra_1': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Orden_compra_2', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Orden_compra_2': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Orden_compra_3', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Orden_compra_3': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Orden_compra_4', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Orden_compra_4': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Orden_compra_5', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Orden_compra_5': colSum });
    
    colSum = jq_grid.jqGrid('getCol', 'Guia_Entrada_1', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Guia_Entrada_1': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Guia_Entrada_2', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Guia_Entrada_2': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Guia_Entrada_3', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Guia_Entrada_3': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Guia_Entrada_4', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Guia_Entrada_4': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Guia_Entrada_5', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Guia_Entrada_5': colSum });
    
    colSum = jq_grid.jqGrid('getCol', 'Pedido_1', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Pedido_1': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Pedido_2', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Pedido_2': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Pedido_3', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Pedido_3': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Pedido_4', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Pedido_4': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Pedido_5', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Pedido_5': colSum });
    
    colSum = jq_grid.jqGrid('getCol', 'Guia_1', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Guia_1': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Guia_2', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Guia_2': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Guia_3', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Guia_3': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Guia_4', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Guia_4': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Guia_5', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Guia_5': colSum });
    
    setColorsWhite(jq_grid);
    

}



function setColorsWhite(jq_grid){
    

    var dataIDs = jq_grid.getDataIDs(); 

    for(i = 0; i < dataIDs.length; i++)
    {
        var rowid = dataIDs[i];
        var rowdata = jq_grid.getRowData(rowid);
        jq_grid.jqGrid('setCell',rowid,'Guia_Entrada_1','',{color: rowdata.Guia_Entrada_1==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Guia_Entrada_2','',{color: rowdata.Guia_Entrada_2==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Guia_Entrada_3','',{color: rowdata.Guia_Entrada_3==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Guia_Entrada_4','',{color: rowdata.Guia_Entrada_4==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Guia_Entrada_5','',{color: rowdata.Guia_Entrada_5==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Orden_compra_1','',{color: rowdata.Orden_compra_1==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Orden_compra_2','',{color: rowdata.Orden_compra_2==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Orden_compra_3','',{color: rowdata.Orden_compra_3==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Orden_compra_4','',{color: rowdata.Orden_compra_4==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Orden_compra_5','',{color: rowdata.Orden_compra_5==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Pedido_1','',{color: rowdata.Pedido_1==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Pedido_2','',{color: rowdata.Pedido_2==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Pedido_3','',{color: rowdata.Pedido_3==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Pedido_4','',{color: rowdata.Pedido_4==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Pedido_5','',{color: rowdata.Pedido_5==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Guia_1','',{color: rowdata.Guia_1==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Guia_2','',{color: rowdata.Guia_2==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Guia_3','',{color: rowdata.Guia_3==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Guia_4','',{color: rowdata.Guia_4==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Guia_5','',{color: rowdata.Guia_5==0 ? 'white' : 'black'});
    }

}