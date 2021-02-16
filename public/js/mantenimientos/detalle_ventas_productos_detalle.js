//Variables a necesitar
var url_productos_detalle= '/productos/detalle/';
var url_productos_detalle_almacenes= '/almacen/lista/';
var url_productos_datos_tecnicos = '/productos/datos_tecnicos/';
var modal_productos_detalle = "modal_productos_detalle";
var grid_productos_detalle = "lista_productos_detalle"
var productos_detalle_almacenes = "productos_detalle_almacenes"
var lista_precios = "lista_precios";
var tasa_cambio = "tasa_cambio";

var jq_modal_productos_detalle;
var jq_grid_productos_detalle;
var jq_productos_detalle_almacenes;
var jq_lista_precios;
var jq_tasa_cambio;
var rowediting;

var row_producto_detalle;
var curr_index_detalle=0;
var rowid_selected;

$(document).ready(function() {
    jq_modal_productos_detalle=$("#"+modal_productos_detalle);
    jq_grid_productos_detalle=$("#"+grid_productos_detalle);
    jq_productos_detalle_almacenes=$("#"+productos_detalle_almacenes);
    jq_lista_precios = $("#"+lista_precios);
    jq_tasa_cambio = $("#"+tasa_cambio);
    cargar_productos_detalle_almacenes();
    cargar_productos_detalle();
    jq_modal_productos_detalle.on('shown.bs.modal', function () {
        var jq_grid=jq_grid_productos_detalle;
        var gridArr = jq_grid.getDataIDs();
        jq_grid.resetSelection().setSelection(gridArr[0],true);
        $('#'+gridArr[0]).focus();
    });
    jq_modal_productos_detalle.on('hidden.bs.modal', function () {
        var gridArr = jq_grid_productos.jqGrid('getGridParam', 'selrow');
        $('#'+gridArr).focus();
    });
    keydown_modal_productos_detalle();
    jq_productos_detalle_almacenes.change(function() {
        recargar_jqgrid_detalle_productos();
    });
});

function cargar_productos_detalle(codigo, lista_precios,almacen,tipo_cambio,moneda){
    
    var jq_grid=jq_grid_productos_detalle;
    
    jq_grid.jqGrid({
        url: url_productos_detalle,
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: codigo || '',
            lista_precios: lista_precios || '01',
            almacen: almacen || '001',
            tipo_cambio: tipo_cambio || 1,
            moneda_documento: moneda || 'S/'
        },
        colNames: ['Producto','Unidad','Factor', 'Unit', 'ICBPER', 'Descuento1','Descuento2','Stock','Cantidad','Importe','Stock Minimo', 'PrecioCalcular','Lote SN', 'Serie SN'],
        colModel:[
            {name:'Codigo', width:60, hidden: true },
            {name:'Unidad', width:60},
            {name:'Factor', width:60, align:"right",template: numberTemplate, editable: false},
            {name:'Unit', width:90, align:"right",template: numberTemplate, editable: false},
            {name:'ICBPER', width:90, align:"right",template: numberTemplate, editable: false, hidden:false},
            {name:'Descuento1', width:70, align:"right",template: numberTemplate, editable: false},
            {name:'Descuento2', width:70,align:"right",template: numberTemplate, editable: false},
            {name:'Stock', width:70,align:"right",template: numberTemplate, editable: false},		
            {name:'Cantidad', width:70,align:"right",  editable: true,
            editoptions: {
                type: "number", 
                step: "0.01",
                min: "0.00",
                max: "1000",
                pattern: "[0-9]+([\.|,][0-9]+)?",
                title: "This should be a number with up to 2 decimal places."
            }},	
            {name:'Importe', width:70,align:"right",template: numberTemplate, editable: false},		
            {name:'Stock_Minimo', width:70,align:"right",template: numberTemplate, editable: false},
            {name:'PrecioCalcular', width:70,align:"right",hidden:true},
            {name:'Lote_SN', width:70,align:"right", editable: false},
            {name:'Serie_SN', width:70,align:"right", editable: false},
        ],
        cellEdit: true,
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        width: 750,
        height: 300,
        loadComplete:function(data){
            var gridArr = jq_grid.getDataIDs();
            rowid=gridArr[0];
            jq_grid.resetSelection().setSelection(rowid,true);
            // $('#'+rowid).focus();
            rowediting= rowid;
            // jq_grid.jqGrid('editRow',rowid,{ keys : true});
            
            editar_celda_productos_detalle(rowid);
            // $('1_cantidad').focus();

        },
        beforeSelectRow:function(rowid, e){
            jq_grid.resetSelection().setSelection(rowid,true);
            editar_celda_productos_detalle(rowid);
        },
        onSelectRow: function (rowid, status, e){
            editar_celda_productos_detalle(rowid);
        }
    });
}

function cargar_productos_detalle_almacenes(){
    var jq_element = jq_productos_detalle_almacenes;
    var predeterminado='';
    $.ajax({
        url: url_productos_detalle_almacenes,
        type: "POST",
        success: function (lists){
            jq_element.html('');
            lists.forEach(list=>{
                jq_element.append('<option value="'+list.Codigo+'">'+list.Nombre+'</option>');
                if(list.Predeterminado=='S' && predeterminado == ''){
                    predeterminado=list.Codigo;
                }
            });
            jq_element.val(predeterminado);
        }
    });
}

function show_modal_productos_detalle(rowid){
    jq_modal_productos_detalle.modal('show');
    rowid_selected = rowid;
    row_producto_detalle = jq_grid_productos.jqGrid ('getRowData', rowid);
    recargar_jqgrid_detalle_productos();
}

function recargar_jqgrid_detalle_productos(){
    var jq_grid = jq_grid_productos_detalle;
    // jq_grid.saveRow(rowediting);
    // jq_grid.jqGrid('setGridParam',{
    //     url: url_productos_detalle, 
    //     cellEdit: true,
    //     type: "POST",
    //     postData:{
    //         codigo: row_producto_detalle.Codigo,
    //         lista_precios: (isEmptyOrWhiteSpaces(jq_lista_precios.val())? '01': jq_lista_precios.val() ),
    //         almacen: jq_productos_detalle_almacenes.val(),
    //         tipo_cambio: jq_tasa_cambio.val(),
    //         moneda_documento: jq_moneda.val()
    //     },
    // }).trigger('reloadGrid', { fromServer: true, page: 1 });
    jq_grid.jqGrid('GridUnload');
    cargar_productos_detalle(row_producto_detalle.Codigo,jq_lista_precios.val(),jq_productos_detalle_almacenes.val(),jq_tasa_cambio.val(),jq_moneda.val());

}

function keydown_modal_productos_detalle(){
    var jq_grid=jq_grid_productos_detalle;
    
    jq_modal_productos_detalle.keydown(function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.code);
        if(keycode == '38' || keycode== '40')  //up/down arrow override
        {
            // var focusID = $("*:focus").attr("id") ; 
            var gridArr = jq_grid.getDataIDs();
            var selrow = jq_grid.getGridParam("selrow");

            jq_grid.jqGrid('saveRow',gridArr[curr_index_detalle], true);

            for(var i = 0; i < gridArr.length; i++)
            {
                if(gridArr[i]==selrow)
                    curr_index_detalle = i;
            }
            
            if(event.keyCode == '38') //up
            {
                if((curr_index_detalle-1)>=0){
                    curr_index_detalle=curr_index_detalle-1;
                }
            }
            if(event.keyCode == '40') //down
            {
                if((curr_index_detalle+1)<gridArr.length){
                    curr_index_detalle=curr_index_detalle+1;
                }
            } 

            jq_grid.resetSelection().setSelection(gridArr[curr_index_detalle],true);
        }
        
    });

    jq_grid.jqGrid('bindKeys', {
        "onEnter":function( rowid ) { 
            console.log($("*:focus").attr("id"));
        } 
    } );
}

function editar_celda_productos_detalle(rowid){
    var contador = 0;
    var jq_grid=jq_grid_productos_detalle;
    jq_grid.saveRow(rowediting);
    rowediting= rowid;
    jq_grid.jqGrid('editRow',rowid,{ keys : true,
        aftersavefunc: function() {
            
            var dataIDs = jq_grid.getDataIDs(); 
            for(i = 0; i < dataIDs.length; i++)
            {
                var rowData = jq_grid.jqGrid ('getRowData', dataIDs[i]);
                
                if (rowData.Cantidad != "" && rowData.Cantidad * 1 != "0" ){
                    rowData.Codigo_Almacen = jq_productos_detalle_almacenes.val();
                    rowData.Almacen = jq_productos_detalle_almacenes.find('option:selected').text();
                    rowData.Nombre = row_producto_detalle.Nombre;
                    rowData.Igv_Art = row_producto_detalle.Igv_Art;
                    rowData.Stock_SN= row_producto_detalle.Control_Stock;
                 
                    lista_productos_elegidos.push(rowData);
                    $.ajax({
                        url: url_productos_datos_tecnicos,
                        type: "POST",
                        data:{
                            codigo: rowData.Codigo,
                            modulo: "V"
                        },
                        success: function (result){
                            result.forEach(list=>{
                                lista_productos_elegidos.push(list);
                            })
                        }
                    });
                    contador++;
                }
            }
            if(contador==0){
                jq_grid.resetSelection().setSelection(rowid,true);
            }else{
                jq_grid_productos.jqGrid('setRowData',rowid_selected,{'active':'1'})
                jq_modal_productos_detalle.modal('hide');
            }
        },
        oneditfunc: function() {
            $("#"+rowid+'_Cantidad')[0].select();
        },
        afterrestorefunc: function(){
            jq_modal_productos_detalle.modal('hide');
        }
    });
}