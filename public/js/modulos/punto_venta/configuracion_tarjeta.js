var url_configuracion_permisos = '/configuraciones/configuracion_permisos/proceso_pto_venta__configuraciones__configurar_tarjetas';
var lista_configuracion_tarjeta = 'lista_configuracion_tarjeta';

var jq_grid_configuracion_tarjeta;
var fila_vacia_grid_configuracion_tarjeta = [];
var row_editing_configuracion_tarjeta;
var col_editing_configuracion_tarjeta;
var selected_cell_configuracion_tarjeta;
var rowid_selected_configuracion_tarjeta;
var rowid_dblclick_configuracion_tarjeta;

$(document).ready(function() {
    jq_grid_configuracion_tarjeta = $("#"+lista_configuracion_tarjeta);

    $("#guardar").show();
    setTitle("Configuracion de Tarjeta");

    cargar_configuracion_tarjeta();
    permisos();
});

$(window).keydown(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.code);
    switch (keycode){
        case 113:
            event.preventDefault();
        break;
        case 118:
            event.preventDefault();
            var jq_grid=jq_grid_configuracion_tarjeta;
            var newFila = deepCopy(fila_vacia_grid_configuracion_tarjeta)
            var rowId = jq_grid.jqGrid ("getGridParam", "selrow");
            if(!isEmptyOrWhiteSpaces(rowId))
                jq_grid.jqGrid('addRowData',undefined,newFila,"after",rowId );
            else
                jq_grid.jqGrid('addRowData',undefined,newFila );
        break;
        case 119:
            event.preventDefault();
            var jq_grid=jq_grid_configuracion_tarjeta;
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

function validar(){
    var retorno=true;
    var jq_grid=jq_grid_configuracion_tarjeta;
    var dataIDs = jq_grid.getDataIDs(); 
    for(i = 0; i < dataIDs.length; i++)
    {
        var rowData = jq_grid.jqGrid ('getRowData', dataIDs[i]);
        if(rowData.Codigo==""){
            mostrarMensajeModal("Aviso","Tiene Que Ingresar Una Cuenta");
            retorno=false;
        }
    }

    return retorno;
};

function guardar(){
    var lista_configuracion_tarjeta = [];
    url_guardar = "/configuracion_tarjeta/guardar";
    mensaje = "Guardado satisfactoriamente";

    var ids = jq_grid_configuracion_tarjeta.getDataIDs();
    ids.forEach(element => {
        var fila = jq_grid_configuracion_tarjeta.getRowData(element);
        lista_configuracion_tarjeta.push(fila);
    });

    $.ajax({
        url: url_guardar,
        type: 'POST',
        data: {
            filas_configuaracion_tarjeta : JSON.stringify(lista_configuracion_tarjeta)
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


async function cargar_configuracion_tarjeta() {
    var jq_grid = jq_grid_configuracion_tarjeta;

    jq_grid.jqGrid({
        mtype: "POST",
        datatype: "json",
        url: "/configuracion_tarjeta/lista",
        height: 250,
        width: 1350,
        colNames:['Codigo','Nombre','Codigo_Cuenta', 'Cuenta'],
        colModel:[
            {name:'Codigo', width:100, editable: true},
            {name:'Nombre', width:100, editable: true},		
            {name:'Codigo_Cuenta', width:100,hidden: true},
            {name:'Cuenta', width:100,editable: true}
        ],
        cellEdit: true,
        caption: "&nbsp;",
        loadComplete:function(data){

        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
            var iRow = jq_grid.jqGrid('getInd',rowid)
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            if(((cm[iCol].name !="Codigo") || cellcontent == "&nbsp;") ){
                jq_grid.resetSelection();
                row_editing_configuracion_tarjeta = iRow;
                col_editing_configuracion_tarjeta = iCol;
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: true,
                });
            }else{
                jq_grid.jqGrid('saveCell',row_editing_configuracion_tarjeta,col_editing_configuracion_tarjeta);
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: false,
                });
            }
            
        },
        onSelectCell : function(rowid, cellname, value, iRow, iCol) { // use this event to capture edited cellID
            selected_cell_configuracion_tarjeta = iCol; // save the cellId to a variable
            rowid_selected_configuracion_tarjeta = rowid;
        },
        onSelectRow: function (rowid, status, e){
            rowid_selected_configuracion_tarjeta = rowid;
        },
        ondblClickRow: function (rowid,iRow,iCol,e) {
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            rowid_dblclick_configuracion_tarjeta= rowid;
            var rowdata = jq_grid.getRowData(rowid);

            switch (cm[iCol].name){
                case "Cuenta":
                    open_modal_mantenimientos_grid(cm[iCol].name,iRow+'_Cuenta');
                break;
            }
        }
    });
}

function open_modal_mantenimientos_grid(name, id){
    switch (name){
        case "Cuenta":
            var id_focused=id;
            var tabla_focused="plan_contable";
            lista_mantenimientos_nivel_plan_contable = 0;
            modal_open(tabla_focused,id_focused);
        break;
    }
}

function rellenar_plan_contable_detalle(data){
    var jq_grid = jq_grid_configuracion_tarjeta;
    var rowId=rowid_dblclick_configuracion_tarjeta;

    jq_grid.jqGrid('saveCell',row_editing_configuracion_tarjeta,col_editing_configuracion_tarjeta);
    jq_grid.jqGrid('setCell',rowId,"Codigo_Cuenta",data.Codigo);
    jq_grid.jqGrid('setCell',rowId,"Cuenta",(data.Codigo +' - '+ data.Nombre));
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