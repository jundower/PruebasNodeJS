var url_getdocumentos_pendientes_contables;
var url_consultar;
//var url_getListaDetalle;
var url_configuracion_listado_documentos="/configurar_tablas/generar";

var grid_documentos_pendientes='lista-documentos-pendientes';

var modal_documentos_pendientes_contable = "documentos_pendientes_contable";
var jq_grid_documentos_pendientes;

var jq_modal_documentos_pendientes_contable;

var rowId_seleccionado="";
var row_editing_documentos_pendientes;
var rowid_editing_detalle_contable;
var col_editing_documentos_pendientes;
var rowid_selected_detalle_contable;

var documentos_listas_cabecera = [];
var documentos_Pendientes_Contable_currentID;
var documentos_Pendientes_Contable_tipo_rellenado;
var documentos_pendientes_contable_agregar_fila = false;
var documentos_pendientes_contable_add_finalizar= false;
var pendientes_contables_rowid = "";
var pendientes_contables_iCol = "";
var pendientes_contables_iRow = "";
// import { jsPDF } from "jspdf";
// jsPDF = require('jspdf')
var modulo = "Movimiento_Contable";

$(document).ready(function() {
    jq_grid_documentos_pendientes=$("#"+grid_documentos_pendientes);
    jq_modal_documentos_pendientes_contable = $("#"+modal_documentos_pendientes_contable)

    $('#pagar').click(async function (){
        
        jq_grid_documentos_pendientes.jqGrid('saveCell',pendientes_contables_rowid,pendientes_contables_iCol);
        if(documentos_Pendientes_Contable_tipo_rellenado=="cabecera"){
            await rellenar_detalle_desde_cabecera();
        }
        else if(documentos_Pendientes_Contable_tipo_rellenado=="Letras"){
            $("#creacion_letras").modal("show");
            nueva_letra();
            jq_grid_lista_facturas.jqGrid("GridUnload");
            lista_facturas();
            jq_grid_lista_letras.jqGrid("GridUnload");
            lista_letras()
            rellenar_listado_facturas();

        }else{
            await rellenar_detalle_desde_detalle();
        }
        calcularMeMnDetalle();
        detalle_contable_actualizar_editables();
        if(documentos_pendientes_contable_add_finalizar) documentos_pendientes_contable_finalizar();
    });

    jq_modal_documentos_pendientes_contable.on('shown.bs.modal', function () {
        resize_jqgrid_porcentajes(jq_grid_documentos_pendientes,60,87);
    });
})

// function setTitleLista(Titulo){
//     $("#titulo_ventana_lista").text(Titulo);
// }

$(window).bind('resize', function() {
    resize_jqgrid_porcentajes(jq_grid_documentos_pendientes,60,87);
});

function setListaDocumentosContables(url_lista_documentos_pendientes_contables,modulo, eliminar_fila, finalizar){
    url_getdocumentos_pendientes_contables=url_lista_documentos_pendientes_contables;
    documentos_listas_modulo= modulo;
    documentos_pendientes_contable_agregar_fila = eliminar_fila || false;
    documentos_pendientes_contable_add_finalizar = finalizar || false;
    cargar_configuracion_documentos_contables();
}

function cargar_configuracion_documentos_contables(){
    $.ajax({
        type: 'POST',
        url: url_configuracion_listado_documentos,
        data:{
            modulo: documentos_listas_modulo
        },
        success: function (lists){
            cargar_jq_grid_documentos_contables(lists);
        }
    });
}

function cargar_jq_grid_documentos_contables(configuraciones) {
    var configuracion_width= configuraciones[0];
    var configuracion_visibilidad= configuraciones[1];
    var configuracion_posicion= configuraciones[2];
    var configuracion_nueva_posicion= configuraciones[3];
    var configuracion_formato= configuraciones[4];
    var configuracion_editable= configuraciones[5];

    var col_grid_lista_documentos=[];
    var col_model_grid_lista_documentos=[];
    
    var templates={0:textTemplate,1:numberTemplate,2:currencyTemplate,3:realTemplate,4:dateTemplate,5:cantidadTemplate,6:dateTemplate2};

    col_model_grid_lista_documentos.push({name: 'active', index: 'active', width: 60, align: 'center',
        formatter: 'checkbox', editoptions: { value: '1:0' },
        formatoptions: { disabled: false }});

    for(var i=3 ; i<Object.keys(configuracion_visibilidad).length; i++)
    {
        var col_nombre=Object.keys(configuracion_visibilidad)[i];

        var codigo_formato=configuracion_formato[Object.keys(configuracion_formato)[i]];

        col_model_grid_lista_documentos.push(
            {
                name:col_nombre,
                index:col_nombre,
                width:100,
                editable:((configuracion_editable[Object.keys(configuracion_editable)[i]]=='1') ? true:false),
                hidden:((configuracion_visibilidad[col_nombre]=='1') ? true:false),
                template:templates[codigo_formato],
            }
        );
        configuracion_visibilidad[col_nombre]=='0' ? documentos_listas_cabecera.push(col_nombre): "";
    }

    var jq_grid=jq_grid_documentos_pendientes;

    jq_grid.jqGrid({
        url: url_getdocumentos_pendientes_contables,
        mtype: "POST",
        datatype: "json",
        postData: {
            tipo_anexo: "12",
            codigo_anexo: "10000153937",
            fecha: jq_fecha_registro.val(),
            tasa_cambio: "3.606"
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
        cellEdit: true,
        //multiselect: true,
        //multikey: "shiftKey", 
        pager: '#lista-documentos-pendientes-pager',
        onSelectRow: function (rowid, status, e){
            rowId_seleccionado = rowid;

        },
        beforeSelectRow(rowid, e){

        },
        onCellSelect : function(rowid, iCol, cellcontent, e) { // use this event to capture edited cellID
            
            
            var iRow = jq_grid.jqGrid('getInd',rowid)
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            var rowdata = jq_grid.getRowData(rowid);
            //Falta configurar para cuando no son provisiones
            //El debe y haber son configurables independiente del D_H
            pendientes_contables_rowid=rowid;
            pendientes_contables_iCol=iCol;
            pendientes_contables_iRow=iRow;
            if(rowdata.active == "1"){
                //jq_grid.resetSelection();
                row_editing_documentos_pendientes = iRow;
                col_editing_documentos_pendientes = iCol;
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: true,
                });
            }else{
                jq_grid.jqGrid('saveCell',row_editing_documentos_pendientes,col_editing_documentos_pendientes);
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: false,
                });
            }
        },
        ondblClickRow: function(rowid, iRow, iCol, e){
            jq_grid.resetSelection().setSelection(rowid,true);
        },
        loadComplete:function(data){
            
            // var gridArr = jq_grid.getDataIDs();
            // jq_grid.resetSelection().setSelection(gridArr[0],true);
        }
    });

    jq_grid.jqGrid('filterToolbar',{stringResult: true, searchOnEnter : false, searchOperators : true});
}

function Actualizar_lista_documentos(tipo_anexo, codigo_anexo) {
    jq_grid_documentos_pendientes.jqGrid("setGridParam",{
        url: url_getdocumentos_pendientes_contables,
        mtype: "POST",
        datatype: "json",
        postData:{
            tipo_anexo: tipo_anexo,
            codigo_anexo: codigo_anexo,
            fecha: jq_fecha_registro.val(),
            tasa_cambio: jq_tasa_cambio.val()
        }
    }).trigger("reloadGrid");
}

function listar_documentos_pendientes_contable(tipo_anexo, codigo_anexo, currentID, cabecera_o_detalle){
    jq_modal_documentos_pendientes_contable.modal('show');
    documentos_Pendientes_Contable_currentID=currentID;
    documentos_Pendientes_Contable_tipo_rellenado=cabecera_o_detalle;
    Actualizar_lista_documentos(tipo_anexo, codigo_anexo) ; 
}

function rellenar_detalle_desde_cabecera(){
    var eliminar_fila=false;
    var filas_seleccionadas=[];
    var dataIDs = jq_grid_documentos_pendientes.getDataIDs(); 
    var dataIDs_Detalle_Contable = jq_grid_detalle_contable.getDataIDs(); 
    var rowId = documentos_Pendientes_Contable_currentID || dataIDs_Detalle_Contable[0];

    for(var i=0;i<dataIDs.length;i++){
        var row = jq_grid_documentos_pendientes.getRowData(dataIDs[i]);
        if(row.active==1) filas_seleccionadas.push(row)
    }

    var newData = jq_grid_detalle_contable.getRowData(rowId);
    if(isEmptyOrWhiteSpaces(newData.Codigo_Anexo)) eliminar_fila=true;
    if(documentos_pendientes_contable_agregar_fila) eliminar_fila=false;

    for(var i=0;i<filas_seleccionadas.length;i++){
        var element=filas_seleccionadas[i];

        if (jq_glosa.val() == "") {
            jq_glosa.val(filas_seleccionadas[0].glosa);
        }

        newData.Cuenta=element.Cuenta;
        newData.Nombre_Cuenta=element.Nombre_Cuenta;
        newData.D_H=element.Dh=="D"?"H":"D";
        newData.Debe=newData.D_H=="D"? jq_moneda.val() == "S/"? element.Pago_Soles:element.Pago_Dolares:0;
        newData.Haber=newData.D_H=="H"? jq_moneda.val() == "S/"? element.Pago_Soles:element.Pago_Dolares:0;
        newData.CenCos=element.cencos;
        newData.Ot=element.ot;
        newData.Unidad_Negocio=element.erp_codune;
        newData.Glosa=element.glosa;
        newData.Tipo_Referencia=element.tipo;
        newData.Serie_Referencia=element.serie;
        newData.Numero_Referencia=element.numero;
        newData.Fecha_Referencia=getDateFormat(element.fecha,'d/m/y','d/m/y','/','/');
        newData.SubVoucher_Referencia=element.voucher;
        newData.Fecha_Vencimiento=getDateFormat(element.Fecha_Vencimiento,'d/m/y','d/m/y','/','/');
        newData.Vendedor=element.vendedor;
        newData.Vendedor2=element.vendedor2 == ""? "00":element.vendedor2;
        newData.Forma_Pago=element.for_pago;
        newData.Tipo2=element.tipo_ref2;
        newData.Serie2=element.serie_ref2;
        newData.Numero2=element.numero_ref2;
        newData.Fecha2=getDateFormat(element.fecha_ref2,'y/m/d','d/m/y','/','/');
        newData.Codigo_Anexo=element.codigo_anexo;
        newData.Nombre_Anexo=element.nombre_anexo;
        newData.Tipo_Anexo=element.tipo_anexo;
        newData.Si_CenCos=element.Si_CenCos;
        newData.Si_Ot=element.Si_Ot;
        newData.Si_Presupuesto=element.Si_Presupuesto;
        newData.Si_Transferencia=element.Si_Transferencia;
        newData.Si_Genera_Diferencia=element.Si_Genera_Diferencia;
        //$("#lista_select_cencos_"+rowId).prop("disabled",data.Si_CenCos=="N");
        
        jq_grid_detalle_contable.jqGrid('addRowData',undefined,newData,documentos_pendientes_contable_agregar_fila ? "after" : "before",rowId);
        //jq_grid_detalle_contable.jqGrid('addRowData',undefined,newData,"before",rowId);
    }

    if(eliminar_fila) jq_grid_detalle_contable.jqGrid('delRowData',rowId);

    var data = jq_grid_detalle_contable.getRowData();
    if (data[0].D_H == "H") {
        var colSum = jq_grid_detalle_contable.jqGrid('getCol', 'Haber', false, 'sum');
    }else{
        var colSum = jq_grid_detalle_contable.jqGrid('getCol', 'Debe', false, 'sum');
    }
    jq_importe.val((colSum).toFixed(2));

}

function rellenar_detalle_desde_detalle(){
    var eliminar_fila=true;
    var filas_seleccionadas=[];
    var dataIDs = jq_grid_documentos_pendientes.getDataIDs(); 
    var dataIDs_Detalle_Contable = jq_grid_detalle_contable.getDataIDs(); 
    var rowId=documentos_Pendientes_Contable_currentID || dataIDs_Detalle_Contable[0];
    for(var i=0;i<dataIDs.length;i++){
        var row = jq_grid_documentos_pendientes.getRowData(dataIDs[i]);
        if(row.active==1) filas_seleccionadas.push(row)
    }

    var newData = jq_grid_detalle_contable.getRowData(rowId);
    for(var i=0;i<filas_seleccionadas.length;i++){
        var element=filas_seleccionadas[i];

        newData.Cuenta=element.Cuenta;
        newData.Nombre_Cuenta=element.Nombre_Cuenta;
        newData.D_H=element.Dh=="D"?"H":"D";
        newData.Debe=newData.D_H=="D"? jq_moneda.val() == "S/"? element.Pago_Soles:element.Pago_Dolares:0;
        newData.Haber=newData.D_H=="H"? jq_moneda.val() == "S/"? element.Pago_Soles:element.Pago_Dolares:0;
        newData.CenCos=element.cencos;
        newData.Ot=element.ot;
        newData.Unidad_Negocio=element.erp_codune;
        newData.Glosa=element.glosa;
        newData.Tipo_Referencia=element.tipo;
        newData.Serie_Referencia=element.serie;
        newData.Numero_Referencia=element.numero;
        newData.Fecha_Referencia=getDateFormat(element.fecha,'y/m/d','d/m/y','/','/');
        newData.SubVoucher_Referencia=element.voucher;
        newData.Fecha_Vencimiento=getDateFormat(element.Fecha_Vencimiento,'y/m/d','d/m/y','/','/');
        newData.Vendedor=element.vendedor;
        newData.Vendedor2=element.vendedor2 == ""? "00":element.vendedor2;
        newData.Forma_Pago=element.for_pago;
        newData.Tipo2=element.tipo_ref2;
        newData.Serie2=element.serie_ref2;
        newData.Numero2=element.numero_ref2;
        newData.Fecha2=getDateFormat(element.fecha_ref2,'y/m/d','d/m/y','/','/');
        newData.Codigo_Anexo=element.codigo_anexo;
        newData.Nombre_Anexo=element.nombre_anexo;
        newData.Si_CenCos=element.Si_CenCos;
        newData.Si_Ot=element.Si_Ot;
        newData.Si_Presupuesto=element.Si_Presupuesto;
        newData.Si_Transferencia=element.Si_Transferencia;
        newData.Si_Genera_Diferencia=element.Si_Genera_Diferencia;
        //$("#lista_select_cencos_"+rowId).prop("disabled",data.Si_CenCos=="N");
        jq_grid_detalle_contable.jqGrid('addRowData',undefined,newData,"before",rowId);
    }

    if(eliminar_fila) jq_grid_detalle_contable.jqGrid('delRowData',rowId);

    var data = jq_grid_detalle_contable.getRowData();
    if (data[0].D_H == "H") {
        var colSum = jq_grid_detalle_contable.jqGrid('getCol', 'Haber', false, 'sum');
    }else{
        var colSum = jq_grid_detalle_contable.jqGrid('getCol', 'Debe', false, 'sum');
    }
    jq_importe.val((colSum).toFixed(2));
}

function rellenar_listado_facturas(){
    var filas_seleccionadas=[];
    var dataIDs = jq_grid_documentos_pendientes.getDataIDs(); 
    var dataIDs_Listado_Facturas = jq_grid_lista_facturas.getDataIDs(); 
    var rowId = dataIDs_Listado_Facturas[0];

    for(var i=0;i<dataIDs.length;i++){
        var row = jq_grid_documentos_pendientes.getRowData(dataIDs[i]);
        if(row.active==1) filas_seleccionadas.push(row)
    }

    var newData = jq_grid_lista_facturas.getRowData(rowId);

    for (let i = 0; i < filas_seleccionadas.length; i++) {
        const element = filas_seleccionadas[i];
        console.log(element);
        newData.Tipo = element.tipo;
        newData.Serie = element.serie;
        newData.Numero = element.numero;
        newData.Fecha = getDateFormat(jq_fecha_emision.val(),"y-m-d","d/m/y","-","/"); //element.fecha;
        newData.Moneda = element.moneda;
        newData.Tc =  jq_tasa_cambio.val(); //element.tipo_cambio;
        newData.Importe_Mn = jq_moneda.val() == "S/"? element.Importe_Soles: (element.Importe_Dolares)*jq_tasa_cambio.val(); //element.Importe_Soles;
        newData.Importe_Me = jq_moneda.val() == "S/"? (element.Importe_Soles)/jq_tasa_cambio.val():element.Importe_Dolares; //element.Importe_Dolares;
        newData.Comision = 0;
        newData.Cuenta = element.Cuenta;
        newData.Dh = element.Dh;
        newData.Signo = element.signo;
        newData.Fecha_Vencimiento = element.Fecha_Vencimiento;
        newData.Vendedor = element.vendedor;
        newData.For_Pago = element.for_pago;
        newData.Tipo_Referencia = element.tipo_ref2;
        newData.Serie_Referencia = element.serie_ref2;
        newData.Numero_Referencia = element.numero_ref2;
        newData.Fecha_Referencia = element.fecha_ref2;
        newData.Glosa = element.glosa;
        newData.Subvoucher = element.voucher;

        jq_grid_lista_facturas.jqGrid('addRowData',undefined,newData);
    }

    var dataIDs_Listado_Facturas = jq_grid_lista_facturas.getDataIDs(); 
    for(var i=0;i<dataIDs_Listado_Facturas.length;i++){
        var row = jq_grid_lista_facturas.getRowData(dataIDs_Listado_Facturas[i]);
        if(row.Tipo=="") jq_grid_lista_facturas.delRowData(dataIDs_Listado_Facturas[i]);
    }

    calcular_footer(jq_grid_lista_facturas);
    generar_letra();
}