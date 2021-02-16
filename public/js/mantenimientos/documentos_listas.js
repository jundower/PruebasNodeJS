var url_getdocumentos;
var url_consultar;
var url_getListaDetalle;
var url_configuracion_listado_documentos="/configurar_tablas/generar";

var grid_documentos='lista-documentos';

var modal_ventana_lista = "modal_ventana_lista";
var jq_grid_documentos;

var jq_modal_ventana_lista;

var rowId_seleccionado="";

var cambiar_motivo_serie="";
var documentos_listas_cabecera = [];
// import { jsPDF } from "jspdf";
// jsPDF = require('jspdf')
var documentos_listas_modulo ="listado_documentos";
var P_C_V = '';
var subtotal = "subtotal";
var jq_fecha_inicio;
var jq_fecha_final;
$(document).ready(function() {
    jq_grid_documentos=$("#"+grid_documentos);
    jq_fecha_inicio = $("#fecha_inicio");
    jq_fecha_final = $("#fecha_final");
    
    jq_numero_correlativo = $("#"+numero_correlativo)
    jq_subtotal = $("#"+subtotal)
    if (P_C_V != '') {
        jq_porc_descuento = $("#"+monto_descuento)
    }
    jq_modal_ventana_lista = $("#"+modal_ventana_lista)

    cargar_años();
    cargar_meses();

    //cargar_configuracion_documentos();
    

    $('#meses_lista').on('change',function(){
        Actualizar_lista("año_mes");
    })
    
    $('#años_lista').on('change',function(){
        Actualizar_lista("año_mes");
    })
    jq_fecha_inicio.change(function () {
        Actualizar_lista("rango_fechas");
    })
    jq_fecha_final.change(function () {
        Actualizar_lista("rango_fechas");
    })

    $('#modificar_lista').click(function (){
        documentoSeleccionado = jq_grid_documentos.jqGrid("getGridParam", 'selrow');
        if(!isEmptyOrWhiteSpaces( documentoSeleccionado)){
            console.log('jhskghsdfhghjhkhjk');
            var rowData=jq_grid_documentos.getRowData(documentoSeleccionado);
            var mensaje="";
            rowData.Estado=="Anulado"?
            mensaje="está Anulado.":rowData.Atencion=="Atendido"?
            mensaje="está Atendido.":rowData.Atencion=="Proceso"?
            mensaje="está en Proceso.":rowData.Aprobado=="Aprobado"?
            mensaje="está Aprobado.":rowData.Aprobacion_2=="Aprobado"?
            mensaje="está Aprobado 2.":rowData.Aprobacion_1=="Aprobado"?
            mensaje="está Aprobado 1.":rowData.Contabilizada == "S"?
            mensaje="está Contabilizado":mensaje="";

            if(mensaje==""){
                $("#guardar").prop("disabled", false);
                estado="modificar";
                consultar();
            }else{
                mostrarMensajeModal("Aviso", "El documento no se puede modificar, porque "+mensaje);
            }
        }
    });
    $('#consultar_lista').click(function (){
        documentoSeleccionado = jq_grid_documentos.jqGrid("getGridParam", 'selrow');
        if(!isEmptyOrWhiteSpaces( documentoSeleccionado)){
            $("#guardar").prop("disabled", true);
            estado="consultar";
            consultar();
        }
    });
    $('#duplicar_lista').click(function (){
        documentoSeleccionado = jq_grid_documentos.jqGrid("getGridParam", 'selrow');
        if(!isEmptyOrWhiteSpaces( documentoSeleccionado)){
            $("#guardar").prop("disabled", false);
            estado="guardar";
            consultar();
            setTimeout(function () {
                $("#automatico").trigger('click');
            }, 200);
        }
    });
    $('#eliminar_lista').click(function (){
        documentoSeleccionado = jq_grid_documentos.jqGrid("getGridParam", 'selrow');
        if(!isEmptyOrWhiteSpaces( documentoSeleccionado)){
            
            var rowData=jq_grid_documentos.getRowData(documentoSeleccionado);
            var mensaje="";
            rowData.Atencion=="Atendido"?
            mensaje="está Atendido.":rowData.Atencion=="Proceso"?
            mensaje="está en Proceso.":rowData.Aprobado=="Aprobado"?
            mensaje="está Aprobado.":rowData.Aprobacion_2=="Aprobado"?
            mensaje="está Aprobado 2.":rowData.Aprobacion_1=="Aprobado"?
            mensaje="está Aprobado 1.":rowData.Contabilizada == "S" && rowData.Codigo_Tipo_Documento == "NE"?
            mensaje="está Contabilizado":mensaje="";

            if(mensaje==""){
                $("#guardar").prop("disabled", false);
                estado="eliminar";
                consultar();
            }else{
                mostrarMensajeModal("Aviso", "El documento no se puede modificar, porque "+mensaje);
            }
            
        }
    });
    $('#anular_lista').click(function (){
        documentoSeleccionado = jq_grid_documentos.jqGrid("getGridParam", 'selrow');
        if(!isEmptyOrWhiteSpaces( documentoSeleccionado)){
            
            var rowData=jq_grid_documentos.getRowData(documentoSeleccionado);
            var mensaje="";
            
            rowData.Estado=="Anulado"?
            mensaje="está Anulado.":rowData.Atencion=="Atendido"?
            mensaje="está Atendido.":rowData.Atencion=="Proceso"?
            mensaje="está en Proceso.":rowData.Aprobado=="Aprobado"?
            mensaje="está Aprobado.":rowData.Aprobacion_2=="Aprobado"?
            mensaje="está Aprobado 2.":rowData.Aprobacion_1=="Aprobado"?
            mensaje="está Aprobado 1.":rowData.Estado_Fe=="Ingresado"?
            mensaje="debe enviar primero a la sunat.":rowData.Contabilizada == "S"?
            mensaje="está Contabilizado":mensaje="";

            if(mensaje==""){
                $("#guardar").prop("disabled", false);
                estado="anular";
                consultar();
            }else{
                mostrarMensajeModal("Aviso", "El documento no se puede modificar, porque "+mensaje);
            }
        }
    });
    $('#exportar_excel_lista').click(function (){
        createExcelFromGrid(grid_documentos,$("#titulo_ventana_lista").text(),documentos_listas_cabecera)
    });
    jq_modal_ventana_lista.on('shown.bs.modal', function () {
        resize_jqgrid_porcentajes(jq_grid_documentos,60,87);
    });

    $('input[type=radio][name=busqueda]').change(function() {
        Actualizar_lista(this.value);
    });

    jq_fecha_inicio.val(short_fecha_trabajo);
    jq_fecha_final.val(short_fecha_trabajo);
})

function setTitleLista(Titulo){
    $("#titulo_ventana_lista").text(Titulo);
}

$(window).bind('resize', function() {
    resize_jqgrid_porcentajes(jq_grid_documentos,60,87);
});

function setListaDocumentos(url_lista, url_consulta, url_detalle,motivo_serie,modulo,contable){
    url_getdocumentos=url_lista;
    url_consultar=url_consulta;
    url_getListaDetalle=url_detalle;
    cambiar_motivo_serie=motivo_serie;
    documentos_listas_modulo= isEmptyOrWhiteSpaces(modulo) ? "listado_documentos":modulo ;
    modulo_contable = contable;
    cargar_configuracion_documentos();
}

function cargar_configuracion_documentos(){
    $.ajax({
        type: 'POST',
        url: url_configuracion_listado_documentos,
        data:{
            modulo: documentos_listas_modulo
        },
        success: function (lists){
            cargar_jq_grid_documentos(lists);
        }
    });
}
function cargar_jq_grid_documentos(configuraciones) {
    var configuracion_width= configuraciones[0];
    var configuracion_visibilidad= configuraciones[1];
    var configuracion_posicion= configuraciones[2];
    var configuracion_nueva_posicion= configuraciones[3];
    var configuracion_formato= configuraciones[4];
    var configuracion_editable= configuraciones[5];

    var col_grid_lista_documentos=[];
    var col_model_grid_lista_documentos=[];
    
    for(var i=3 ; i<Object.keys(configuracion_visibilidad).length; i++)
    {
        var col_nombre=Object.keys(configuracion_visibilidad)[i];

        if(col_nombre=="Motivo_Serie")
            col_grid_lista_documentos.push(cambiar_motivo_serie);
        else
            col_grid_lista_documentos.push(col_nombre);

        var codigo_formato=configuracion_formato[Object.keys(configuracion_formato)[i]];

        col_model_grid_lista_documentos.push(
            {
                name:col_nombre,
                index:col_nombre,
                width:100,
                editable:((configuracion_editable[Object.keys(configuracion_editable)[i]]=='1') ? true:false),
                hidden:((configuracion_visibilidad[col_nombre]=='1') ? true:false),
                template:((codigo_formato=='1') ? numberTemplate:(codigo_formato=='2') ? currencyTemplate:(codigo_formato=='3') ? realTemplate:textTemplate)
            }
        );
        configuracion_visibilidad[col_nombre]=='0' ? documentos_listas_cabecera.push(col_nombre): "";
    }

    var jq_grid=jq_grid_documentos;

    jq_grid.jqGrid({
        url: url_getdocumentos,
        mtype: "POST",
        datatype: "json",
        postData: {
            anio: $('#años_lista').val(),
            meses: $('#meses_lista').val(),
            modulo_contable: modulo_contable,
            busqueda: 'año_mes',
        },
        colNames: col_grid_lista_documentos,
        colModel: col_model_grid_lista_documentos,
        rowNum:50,
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        width: 1190,
        height: 400,
        rowList:[50,500,5000,50000],
        loadonce: true, 
        pager: '#lista-documentos-pager',
        onSelectRow: function (rowid, status, e){
            rowId_seleccionado = rowid;
        },
        ondblClickRow: function(rowid, iRow, iCol, e){
            jq_grid.resetSelection().setSelection(rowid,true);
            $("#consultar_lista").trigger("click");
        },
        loadComplete:function(data){
            var gridArr = jq_grid.getDataIDs();
            jq_grid.resetSelection().setSelection(gridArr[0],true);
        }
    });

    jq_grid.jqGrid('filterToolbar',{stringResult: true, searchOnEnter : false, searchOperators : true});
}

function cargar_años() {
    var n = (new Date()).getFullYear()   
    var select = document.getElementsByName('lista-años')[0];
    for(var i = n; i>=2000; i--)select.options.add(new Option(i,i)); 
}

function cargar_meses() {
    var idmeses = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    var select = document.getElementsByName('lista-meses')[0];

    for (var i = 0; i < meses.length; i++) {
        select.options[i] = new Option(meses[i], idmeses[i]);
    }
    $("#meses_lista").val( (new Date()).getMonth() + 1);
}

function Actualizar_lista(busqueda) {
    jq_grid_documentos.jqGrid("setGridParam",{
        url: url_getdocumentos,
        mtype: "POST",
        datatype: "json",
        postData:{
            meses : $('#meses_lista').val(),
            anio: $('#años_lista').val(),
            fecha_inicio: jq_fecha_inicio.val(),
            fecha_final: jq_fecha_final.val(),
            busqueda
        }
    }).trigger("reloadGrid");
}


function listar(){
    jq_modal_ventana_lista.modal('show');
    Actualizar_lista('año_mes') ; 
    // $('#año_mes').prop("checked",true);
    // $(".año_mes").removeClass("d-none");
    // $(".rango_fechas").addClass("d-none");
}