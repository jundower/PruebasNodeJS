
/*
//---- Elementos a necesitar ---- //
Div para el footer/pager del jqgrid:
    - lista_productos_pager
*/
//Variables a necesitar
var url_productos_lista= '/productos/lista/';
var url_productos_almacenes= '/productos/almacenes/';
var url_productos_unidades= '/productos/unidades/';
var modal_productos = "modal_productos";
var grid_productos = "lista_productos"
var grid_productos_almacenes = "lista_productos_almacenes"
var grid_productos_unidades = "lista_productos_unidades"
var lista_precios = "lista_precios";

var jq_modal_productos;
var jq_grid_productos;
var jq_grid_productos_almacenes;
var jq_grid_productos_unidades;
var jq_lista_precios;

var ancho_ventana_detalle_ventas_productos = 0; //ancho de la ventana

// var col_grid_lista_productos=['','Codigo','Codigo_Interno','Nombre','Familia','SubFamilia','Concepto1','Concepto2','Concepto3','Concepto4','Concepto5','Concepto6','Concepto7','Lote','Serie','Servicio','Tipo_Producto', 'Igv_Art'];

var col_grid_lista_productos=[];

var col_model_grid_lista_productos=[];

$(document).ready(function() {
    jq_modal_productos=$("#"+modal_productos);
    jq_grid_productos=$("#"+grid_productos);
    jq_lista_precios = $("#"+lista_precios);
    jq_grid_productos_almacenes=$("#"+grid_productos_almacenes);
    jq_grid_productos_unidades=$("#"+grid_productos_unidades);
    cargar_configuracion_lista_productos();

    rellenar_codigo_nombre(url_punto_venta_lista,"lista_punto_venta","",$("#pto_venta").val());
    cargar_grid_productos_almacenes();
    cargar_grid_productos_unidades();
    keydown_modal_productos();
    jq_modal_productos.on('shown.bs.modal', function () {
        var jq_grid=jq_grid_productos;

        var gridArr = jq_grid.getDataIDs();

        for(var i=0;i<gridArr.length;i++){
            jq_grid.jqGrid('setRowData',gridArr[i],{'active':'0'})
        }

        jq_grid.resetSelection().setSelection(gridArr[0],true);
        $('#'+gridArr[0]).focus();
        $('#gs_'+grid_productos+'_'+col_model_grid_lista_productos[1].name).focus();
        lista_productos_elegidos=[];
        jq_grid.setGridHeight($("#modal_parent_lista_productos_content").height()*0.7);
        jq_grid.setGridWidth($("#parent_lista_productos").width());
        jq_grid_productos_unidades.setGridHeight($("#modal_parent_lista_productos_content").height()*0.15);
        jq_grid_productos_unidades.setGridWidth($("#parent_lista_productos_unidades").width());
        jq_grid_productos_almacenes.setGridHeight($("#modal_parent_lista_productos_content").height()*0.15);
        jq_grid_productos_almacenes.setGridWidth($("#parent_lista_productos_almacenes").width());
        
    });
    $("#lista_productos_enviar").click(function(){
        agregar_detalle_ventas();
    });
    jq_modal_productos.on('hidden.bs.modal', function () {
        // agregar_detalle_ventas();
    });

    $("#lista_punto_venta").change(function () {
        var rowData = jq_grid_productos.jqGrid ('getRowData', 'sellrow');
        var codigo=rowData.Codigo;

        jq_grid_productos_almacenes.jqGrid('setGridParam',{
            url: url_productos_almacenes, 
            type: "POST",
            postData:{
                codigo : codigo,
                punto_venta: $(this).val()
            }
        }).trigger('reloadGrid');
    })
});

function cargar_configuracion_lista_productos(){
    $.ajax({
        type: 'POST',
        url: url_configuracion_grid,
        data:{
            modulo: "listado_productos"
        },
        success: function (result){
            cargar_jq_grid_lista_productos(result);
        }
    });
}

function cargar_jq_grid_lista_productos(configuraciones){
    var configuracion_width= configuraciones[0];
    var configuracion_visibilidad= configuraciones[1];
    var configuracion_posicion= configuraciones[2];
    var configuracion_nueva_posicion= configuraciones[3];
    var configuracion_formato= configuraciones[4];
    var configuracion_editable= configuraciones[5];
    
    //El Pivot solo acepta para numeros, por el max()
    col_grid_lista_productos.push("");
        
    col_model_grid_lista_productos.push({name: 'active', index: 'active', width: 60, align: 'center',
    formatter: 'checkbox', editoptions: { value: '1:0' },
    formatoptions: { disabled: true }});
    
    for(var i=3 ; i<Object.keys(configuracion_visibilidad).length; i++)
    {
        var col_nombre=Object.keys(configuracion_visibilidad)[i];
        switch (col_nombre){
            case "Concepto1":
                // col_nombre="Marca";
                break;
            case "Codigo_Concepto1":
                // col_nombre="Codigo marca";
                break;
            case "Concepto2":
                break;
            case "Codigo_Concepto2":
                break;
            case "Concepto3":
                break;
            case "Codigo_Concepto3":
                break;
            case "Concepto4":
                break;
            case "Codigo_Concepto4":
                break;
            case "Concepto5":
                break;
            case "Codigo_Concepto5":
                break;
            case "Concepto6":
                break;
            case "Codigo_Concepto6":
                break;
            case "Concepto7":
                break;
            case "Codigo_Concepto7":
                break;
        }

        col_grid_lista_productos.push(col_nombre);

        var codigo_formato=configuracion_formato[Object.keys(configuracion_formato)[i]];
        

        col_model_grid_lista_productos.push(
            {
                name:col_nombre,
                index:col_nombre,
                width:configuracion_width[col_nombre],
                editable:((configuracion_editable[Object.keys(configuracion_editable)[i]]=='1') ? true:false),
                hidden:((configuracion_visibilidad[col_nombre]=='1') ? true:false),
                template:((codigo_formato=='1') ? numberTemplate:(codigo_formato=='2') ? currencyTemplate:(codigo_formato=='3') ? realTemplate:textTemplate)
            }
        );
    }

    var jq_grid=jq_grid_productos;

    jq_grid.jqGrid({
        url: url_productos_lista,
        mtype: "POST",
        datatype: "json",
        colNames: col_grid_lista_productos,
        colModel: col_model_grid_lista_productos,
        rowNum:50,
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        width: 50,
        height: 50,
        rowList:[50,500,5000,50000],
        loadonce: true, 
        pager: '#lista_productos_pager',
        ondblClickRow: function(rowid, iRow, iCol, e){
            jq_grid.setSelection(rowid,true);
            show_modal_productos_detalle(rowid);
        },
        onSelectRow: function (rowid, status, e){
            cargarDetalleProducto(rowid);
            $("#lista_productos_leyenda1").text(jq_grid.getRowData(rowid).Leyenda1);
            var codigo=$("#lista_productos_imagen").attr("codigo");
            if(jq_grid.getRowData(rowid).Imagen!=""){
                $("#lista_productos_imagen").attr("src", "/erp/"+codigo+"/img/"+jq_grid.getRowData(rowid).Imagen);
            }else{
                $("#lista_productos_imagen").removeAttr("src");
            }
        },
        loadComplete:function(data){
            var gridArr = jq_grid.getDataIDs();
            jq_grid.resetSelection().setSelection(gridArr[0],true);
            
            jq_grid.jqGrid('bindKeys', {
                "onEnter":function( rowid ) { 
                    show_modal_productos_detalle(rowid);
                } 
            });
        }
    });

    jq_grid.jqGrid('filterToolbar',{stringResult: true, searchOnEnter : false, searchOperators : true});
}

function keydown_modal_productos(){
    var jq_grid=jq_grid_productos;
    
    jq_modal_productos.keydown(function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.code);
        if(keycode == '38' || keycode == '40')  //up/down arrow override
        {
            var gridArr = jq_grid.getDataIDs();
            var focusID = $("*:focus").attr("id") ; 
            if ( $.inArray( focusID, gridArr )<0 ){
                event.preventDefault();
                $( "#"+gridArr[0] ).focus();
            }
        }
        if(keycode == '45'){ //key Ins Insertar
            jq_modal_productos.modal('hide');
            agregar_detalle_ventas();
        }
    });

    jq_grid_productos_unidades.jqGrid('bindKeys', {
        "onEnter":function( rowid ) { 
            show_modal_productos_detalle(rowid)
        } 
    });
    jq_grid_productos_almacenes.jqGrid('bindKeys', {
        "onEnter":function( rowid ) { 
            show_modal_productos_detalle(rowid)
        } 
    });
}

function cargar_grid_productos_almacenes(){
    var jq_grid=jq_grid_productos_almacenes;

    jq_grid.jqGrid({
        url: url_productos_almacenes,
        mtype: "POST",
        datatype: "json",
        colNames: ['Codigo','Nombre', 'Stock'],
        colModel:[
            {name:'cod_almacen', width:60},
            {name:'nom_almacen', width:150},
            {name:'stock', width:60, template: numberTemplate, align: "right"},
        ],
        rownumbers: true,
        width: 50,
        height: 50,
        loadComplete:function(data){
            var gridArr = jq_grid.getDataIDs();
            jq_grid.resetSelection().setSelection(gridArr[0],true);
        }
    });

}

function cargar_grid_productos_unidades(){
    var jq_grid=jq_grid_productos_unidades;

    jq_grid.jqGrid({
        url: url_productos_unidades,
        mtype: "POST",
        datatype: "json",
        // colNames: ['Producto','Unidad','Factor', 'Unit', 'Descuento1','Descuento2'],
        colNames: ['Producto','Unidad','Factor'],
        colModel:[
            {name:'Codigo', width:60, hidden: true },
            {name:'Unidad', width:60},
            {name:'Factor', width:60, align:"right",template: numberTemplate},
            // {name:'Unit', width:70, align:"right",template: numberTemplate},
            // {name:'Descuento1', width:70, align:"right",template: numberTemplate},		
            // {name:'Descuento2', width:70,align:"right",template: numberTemplate}
        ],
        rownumbers: true,
        width: 50,
        height: 50,
        loadComplete:function(data){
            var gridArr = jq_grid.getDataIDs();
            jq_grid.resetSelection().setSelection(gridArr[0],true);
        }
    });

}

function cargarDetalleProducto(rowid){
    var rowData = jq_grid_productos.jqGrid ('getRowData', rowid);
    var codigo=rowData.Codigo;

    jq_grid_productos_almacenes.jqGrid('setGridParam',{
        url: url_productos_almacenes, 
        type: "POST",
        postData:{
            codigo : codigo,
            punto_venta: ''
        }
    }).trigger('reloadGrid');

    jq_grid_productos_unidades.jqGrid('setGridParam',{
        url: url_productos_unidades, 
        type: "POST",
        postData:{
            codigo : codigo,
            lista_precios : (isEmptyOrWhiteSpaces(jq_lista_precios.val()) == true ? "01" : jq_lista_precios.val())
        }
    }).trigger('reloadGrid');

    $("#lista_punto_venta").val($("#pto_venta").val());
}

function show_modal_lisa_productos(){
    console.log('jagsjasd');
    jq_modal_productos.modal('show');
}