var url_configuracion_permisos = '/configuraciones/configuracion_permisos/proceso_pto_venta__configuraciones__configurar_cobrador';
var lista_configuracion_cobrador = 'lista_configuracion_cobrador';

var jq_grid_configuracion_cobrador;
var fila_vacia_grid_configuracion_cobrador = [];
var rowid_selected_configuracion_proveedor;
var selected_cell_configuracion_proveedor;
var row_editing_configuracion_proveedor;
var col_editing_configuracion_proveedor;
var rowid_dblclick_configuracion_cobrador;

$(document).ready(function() {
    jq_grid_configuracion_cobrador = $("#"+lista_configuracion_cobrador);

    $("#guardar").show();
    setTitle("Configuracion de Cobrador");

    cargar_configuracion_cobrador();
    permisos();
});

function validar(){
    var retorno=true;
    var jq_grid=jq_grid_configuracion_cobrador;
    var dataIDs = jq_grid.getDataIDs(); 
    for(i = 0; i < dataIDs.length; i++)
    {
        var rowData = jq_grid.jqGrid ('getRowData', dataIDs[i]);
        if(rowData.Codigo=="" && rowData.Usuario==""){
            mostrarMensajeModal("Aviso","Tiene que seleccionar un usuario");
            retorno=false;
        }
    }

    return retorno;
};

function guardar(){
    var lista_configuracion_cobrador = [];
    url_guardar = "/configuracion_cobrador/guardar";
    mensaje = "Guardado satisfactoriamente";

    if (jq_grid_configuracion_cobrador) {
        var ids = jq_grid_configuracion_cobrador.getDataIDs();
        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_configuracion_cobrador.getRowData(element);
                console.log(fila);
                var Codigo_Movimiento = $("#lista_select_movimiento_"+element).val();
                var Codigo_Punto_Venta = $("#lista_select_punto_venta_"+element).val();
                var Codigo_Serie = $("#lista_select_serie_"+element).val();
                lista_configuracion_cobrador.push({Codigo_Punto_Venta, Codigo: fila.Codigo, Usuario: fila.Usuario, Cta_Cteb: fila.Cta_Cteb, Cuenta_Contable: fila.Cuenta_Contable, Nombre_Cta_Cteb: fila.Nombre_Cta_Cteb, Codigo_Movimiento, Codigo_Serie});
            });
        }
    }

    $.ajax({
        url: url_guardar,
        type: 'POST',
        data: {
            filas_configuaracion_cobrador : JSON.stringify(lista_configuracion_cobrador)
        },
        success: function (result) {
            if (result.estado == true) {
                mostrarMensaje(mensaje,true,2000);
            }
            else
            mostrarMensaje("Código de Error:  "+result.codigo+" " +result.mensaje,false,2000);
        }
    }); 
};

$(window).keydown(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.code);
    switch (keycode){
        case 113:
            event.preventDefault();
        break;
        case 118:
            event.preventDefault();
            var jq_grid=jq_grid_configuracion_cobrador;
            var newFila = deepCopy(fila_vacia_grid_configuracion_cobrador)
            var rowId = jq_grid.jqGrid ("getGridParam", "selrow");
            if(!isEmptyOrWhiteSpaces(rowId))
                jq_grid.jqGrid('addRowData',undefined,newFila,"after",rowId );
            else
                jq_grid.jqGrid('addRowData',undefined,newFila );
        break;
        case 119:
            event.preventDefault();
            var jq_grid=jq_grid_configuracion_cobrador;
            var dataIds = jq_grid.getDataIDs();
            var rowId = jq_grid.jqGrid ("getGridParam", "selrow");
            if(dataIds.length>0 && !isEmptyOrWhiteSpaces(rowId)){
                var index = dataIds.indexOf(rowId);
                index = index == 0 ?  1 : index -1;
                rowid_selected_configuracion_proveedor = dataIds[index];

                jq_grid.jqGrid ("delRowData", rowId);
                jq_grid.setSelection(rowid_selected_configuracion_proveedor,true);
            }
        break;
    }
});


async function cargar_configuracion_cobrador() {
    var jq_grid = jq_grid_configuracion_cobrador;

    lista_punto_ventas="";
    lista_movimientos="";
    lista_serie="";

    await $.ajax({
        type: 'POST',
        url: '/punto_venta/lista',
        success: function (result){
            result.forEach(element => {
                lista_punto_ventas +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
            });
        }
    });
    await $.ajax({
        type: 'POST',
        url: '/tipo_documento/lista/PTOVTA',
        success: function (result){
            result.forEach(element => {
                lista_movimientos +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
            });
        }
    });
    await $.ajax({
        type: 'POST',
        url: '/talonarios/motivos_series',
        success: function (result){
            result.forEach(element => {
                lista_serie +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
            });
        }
    });

    jq_grid.jqGrid({
        mtype: "POST",
        datatype: "json",
        url: "/configuracion_cobrador/lista",
        height: 250,
        width: 1350,
        colNames:['Codigo_Punto_Venta','Punto_Venta','Codigo', 'Usuario', 'Cta_Cteb','Cuenta_Contable',
        'Nombre_Cta_Cteb','Codigo_Movimiento','Movimiento','Codigo_Serie','Serie'],
        colModel:[
            {name:'Codigo_Punto_Venta', width:100, hidden: true},
            {name:'Punto_Venta', width:100, formatter:lista_select_punto_venta},
            {name:'Codigo', width:100, sorttype:"date"},
            {name:'Usuario', width:100},
            {name:'Cta_Cteb', width:100, align:"left", editable:true, sorttype:"float"},
            {name:'Cuenta_Contable', width:100, align:"left", editable:true, sorttype:"float"},		
            {name:'Nombre_Cta_Cteb', width:100,align:"left", editable:true, sorttype:"float"},		
            {name:'Codigo_Movimiento', width:100,hidden: true},
            {name:'Movimiento', width:100, formatter:lista_select_movimiento},		
            {name:'Codigo_Serie', width:100,hidden: true},	
            {name:'Serie', width:100, formatter:lista_select_serie}	
        ],
        cellEdit: true,
        caption: "&nbsp;",
        loadComplete:function(data){
            var ids = jq_grid.getDataIDs()
            if(ids){
                ids.forEach(function (element, index, array) {
                    var fila = jq_grid.getRowData(element);
                    $("#lista_select_punto_venta_"+element).val(fila.Codigo_Punto_Venta);
                    $("#lista_select_movimiento_"+element).val(fila.Codigo_Movimiento);
                    cargar_serie_grid(fila.Codigo_Movimiento, element, fila.Codigo_Serie);
                });
            } 
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
            var iRow = jq_grid.jqGrid('getInd',rowid)
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            if(((cm[iCol].name !="Punto_Venta") && cm[iCol].editable) ){
                jq_grid.resetSelection();
                row_editing_configuracion_proveedor = iRow;
                col_editing_configuracion_proveedor = iCol;
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: true,
                });
            }else{
                jq_grid.jqGrid('saveCell',row_editing_configuracion_proveedor,col_editing_configuracion_proveedor);
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: false,
                });
            }
            
            var codigo_movimiento=$("#lista_select_movimiento_"+rowid).val();
            if (cm[iCol].name =="Movimiento") {
                $.ajax({
                    type: "POST",
                    url: '/talonarios/motivos_series',
                    data: {
                        tipo_documento: codigo_movimiento
                    },success: function (result) {
                        $("#lista_select_serie_"+rowid).empty();
                        result.forEach(list=>{
                            $("#lista_select_serie_"+rowid).append('<option value="'+list.Codigo+'" >'+list.Nombre + "</option>");   
                        });                  
                    }
                })  
            }
        },
        onSelectCell : function(rowid, cellname, value, iRow, iCol) { // use this event to capture edited cellID
            selected_cell_configuracion_proveedor = iCol; // save the cellId to a variable
            rowid_selected_configuracion_proveedor = rowid;
        },
        onSelectRow: function (rowid, status, e){
            //console.log(rowid);
            rowid_selected_configuracion_proveedor = rowid;
            $("#lista_select_punto_venta_"+rowid).trigger("change");
        },
        ondblClickRow: function (rowid,iRow,iCol,e) {
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            rowid_dblclick_configuracion_cobrador= rowid;
            var rowdata = jq_grid.getRowData(rowid);

            switch (cm[iCol].name){
                case "Codigo":
                    open_modal_mantenimientos_grid(cm[iCol].name,iRow+'_Cuenta');
                break;
                case "Cta_Cteb":
                    open_modal_mantenimientos_grid(cm[iCol].name,iRow+'_Cta_Cteb');
                break;
            }
        }
    });
}

function lista_select_punto_venta(cellvalue, options, rowObject)
{
    return '<select id="lista_select_punto_venta_'+options.rowId+'" class="form-control form-control-sm select-sm">'+lista_punto_ventas+'</select>'
}
function lista_select_movimiento(cellvalue, options, rowObject)
{
    return '<select id="lista_select_movimiento_'+options.rowId+'" class="form-control form-control-sm select-sm">'+lista_movimientos+'</select>'
}
function lista_select_serie(cellvalue, options, rowObject)
{
    return '<select id="lista_select_serie_'+options.rowId+'" class="form-control form-control-sm select-sm">'+lista_serie+'</select>'
}

function cargar_serie_grid(codigo_movimiento,rowid,predeterminado) {
    $.ajax({
        type: "POST",
        url: '/talonarios/motivos_series',
        data: {
            tipo_documento: codigo_movimiento
        },success: function (result) {
            $("#lista_select_serie_"+rowid).empty();
            result.forEach(list=>{
                $("#lista_select_serie_"+rowid).append('<option value="'+list.Codigo+'" >'+list.Nombre + "</option>");   
            });  
            if (predeterminado) {
                $("#lista_select_serie_"+rowid).val(predeterminado);
            }                
        }
    }) 
}

function open_modal_mantenimientos_grid(name, id){
    console.log(id);
    switch (name){
        case "Codigo":
            var id_focused=id;
            var tabla_focused="usuario";
            modal_open(tabla_focused,id_focused);
        break;
        case "Cta_Cteb":
            var id_focused=id;
            var tabla_focused="Cta_Cteb";
            modal_open(tabla_focused,id_focused);
        break;
    }
}

function rellenar_usuario_seleccionado(data) {
    var jq_grid = jq_grid_configuracion_cobrador;
    jq_grid.jqGrid('setCell',rowid_dblclick_configuracion_cobrador,"Codigo",data.Codigo);
    jq_grid.jqGrid('setCell',rowid_dblclick_configuracion_cobrador,"Usuario",data.Nombre);
}

function rellenar_cuenta_corriente_seleccionado(data) {
    
    var jq_grid = jq_grid_configuracion_cobrador;
    jq_grid.jqGrid('saveCell',rowid_dblclick_configuracion_cobrador,col_editing_configuracion_proveedor);
    console.log(data);
    jq_grid.jqGrid('setCell',rowid_dblclick_configuracion_cobrador,"Cta_Cteb",data.Codigo);
    jq_grid.jqGrid('setCell',rowid_dblclick_configuracion_cobrador,"Cuenta_Contable",data.Cuenta);
    jq_grid.jqGrid('setCell',rowid_dblclick_configuracion_cobrador,"Nombre_Cta_Cteb",data.Nombre);
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