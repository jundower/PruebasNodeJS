var fecha_trabajo=new Date();
var url_configuracion_grid="/configurar_tablas/generar";
var url_actualizar = "/cotizacion/aprobaciones";
var url_responsables = "/usuario/responsables";
var url_consultar = "'/cotizacion/consultar'";
var url_configuracion_permisos = '/configuraciones/configuracion_permisos/proceso_compra__sist_cuadro_comparativo__aprobacion_comparativos';

var grid_lista_pre_cotizaciones = 'lista_pre_cotizaciones';
var grid_cabezera_comparativo_precios = 'cabezera_comparativo_precios';
var grid_detalle_comparativo_precios = 'detalle_comparativo_precios';

var estado = "estado";
var contenedor_formato_impresion = "contenedor_formato_impresion";

var jq_estado;
var jq_contenedor_formato_impresion;
var jq_fecha_tramite;

var jq_grid_lista_pre_cotizaciones;
var jq_grid_cabezera_comparativo_precios;
var jq_grid_detalle_comparativo_precios;

var selected_Id_detalle_comparativo_precios;
var selected_Id_Cell_detalle_comparativo_precios;

var jqGridWrapperId;
var top_jq_contenedor_formato_impresion="0px";
var left_jq_contenedor_formato_impresion="0px";

var onCancelRowid;
var col_grid_lista_documentos=[];
var col_model_grid_lista_documentos=[];
var codigo_tipo_documento;
var lista_proveedor_elegido = [{nitem:"0",proveedor:""}];

$(document).ready(function() {
    
    $("#aprobar").show();
    $("#desaprobar").show();
    $("#imprimir").show();
    $("#guardar").prop("disabled",true);

    jq_grid_lista_pre_cotizaciones = $("#"+grid_lista_pre_cotizaciones);
    jq_grid_cabezera_comparativo_precios = $("#"+grid_cabezera_comparativo_precios);
    jq_grid_detalle_comparativo_precios = $("#"+grid_detalle_comparativo_precios);
    
    jq_estado=$("#"+estado);
    jq_contenedor_formato_impresion=$("#"+contenedor_formato_impresion);
    jq_contenedor_formato_impresion.draggable();
    
    jq_estado.change(function() {
        Actualizar_lista();
    });
    jq_contenedor_formato_impresion.hide();
    $("#close_print").click(function(){
        jq_contenedor_formato_impresion.hide();
    });

    setTitle("Aprobacion de Comprativo Precios");

    cargar_cabezera_comparativo();
    cargar_detalle_comparativo();
    cargar_pre_cotizaciones();
    permisos();
    //Actualizar_lista();
    

});

$(window).keydown(function(event) {

    var keycode = (event.keyCode ? event.keyCode : event.code);
    //Esc = 27
    if(keycode == '27') {
        jq_contenedor_formato_impresion.hide();
    }
    
});

function aprobar() {
    var RowID = jq_grid_lista_pre_cotizaciones.jqGrid('getGridParam', 'selrow')
    var rowData = jq_grid_lista_pre_cotizaciones.jqGrid('getRowData', RowID)
    
    $.ajax({
        url: '/comparativo_precios/aprobar_comparativo_precios',
        type: 'post',
        data:{
            numero_documento:  rowData.Numero,
            filas_detalle: JSON.stringify(lista_proveedor_elegido)
        },
        success: function(result){
            if(result.estado == true){
                mensaje = "Aprobado satisfactoriamente.";
                mostrarMensaje(mensaje,true,2000);
                estado="Consultar";

                jq_grid_lista_pre_cotizaciones.jqGrid("setGridParam",{url: '/comparativo_precios/comparativo_precios_pendientes'}).trigger("reloadGrid");
            }
            else
                mostrarMensaje("Código de Error:  "+result.codigo+" " +result.mensaje,false,2000);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown,extra) { 
                mostrarMensaje("No se pudo Aprobar",false,2000);
            }
    }); 
};

function cargar_pre_cotizaciones() {
    var jq_grid= jq_grid_lista_pre_cotizaciones;
    jq_grid.jqGrid({  
        type: 'POST',      
        url: '/comparativo_precios/comparativo_precios_pendientes',
        datatype: "json",
        postData:{
            estado:  jq_estado.val(),
        },
        colNames:['Titulo','Fecha','Numero', 'Glosa', 'Responsable','Punto_Venta'],
        colModel:[
            {name:'Titulo', width:100, hidden: true},
            {name:'Fecha', width:100},
            {name:'Numero', width:100, firstsortorder: "desc"},
            {name:'Glosa', width:100},
            {name:'Responsable', width:100, align:"right"},	
            {name:'Punto_Venta', width:100, align:"right"},	
        ],
        height: 500,
        width: 400,
        rowNum:20,
        pager: '#p_pre_cotizaciones',
        viewrecords: true,
        loadComplete: function() {
            resize_jqgrid_porcentajes(jq_grid,76,30);
            var gridArr = jq_grid.getDataIDs();
            jq_grid.resetSelection().setSelection(gridArr[0],true);
        },
        onSelectRow: function (rowid, status, e){
            var data = jq_grid.getRowData(rowid);
            llenar_grid(data.Numero, data.Punto_Venta);
            llenar_grid_cabezera(data.Numero, data.Punto_Venta);
            
        },
        caption: '&nbsp;',
    });
    ///
}

function cargar_cabezera_comparativo() {
    var jq_grid= jq_grid_cabezera_comparativo_precios;
    jq_grid.jqGrid({  
        type: 'POST',      
        url: '/comparativo_precios/cabezera_aprobacion_comparativo_precios',
        datatype: "json",
        colNames:['Concepto','Valor1','Valor2','Valor3', 'Valor4'],
        colModel:[
            {name:'Concepto', width:150},
            {name:'Valor1', width:150, template: textTemplate},
            {name:'Valor2', width:150, template: textTemplate },
            {name:'Valor3', width:150,  template: textTemplate},
            {name:'Valor4', width:150, template: textTemplate},			
        ],
        height: 200,
        width: 400,
        rowNum:20,
        pager: '#c_comparativo_precios',
        cellEdit: true,
        viewrecords: true,
        shrinkToFit:false,
        forceFit:true,
        loadComplete: function() {
            resize_jqgrid_porcentajes(jq_grid,15,65);
        },
        afterEditCell: function (rowid,cellname,value,iRow,iCol) {
            $("#"+iRow+'_'+cellname)[0].select();
        },
        beforeSaveCell: function (rowid,cellname,value,iRow,iCol) {
        },
        afterRestoreCell: function (rowid, value, iRow, iCol) {
        },
        onCellSelect : function(rowid, iCol, cellcontent, e) { // use this event to capture edited cellID
           
        },
        onSelectCell : function(rowid, cellname, value, iRow, iCol) { // use this event to capture edited cellID
        },
        onSelectRow: function (rowid, status, e){
            var data = jq_grid.getRowData(rowid);
            
        },
        caption: '&nbsp;',
    });
}

function cargar_detalle_comparativo() {
    
    var jq_grid= jq_grid_detalle_comparativo_precios;
    jq_grid.jqGrid({  
        type: 'POST',      
        url: '/comparativo_precios/detalle',
        datatype: "json",
        colNames:['Codigo','Nombre','Unidad','Cantidad', 'Proveedor_1', 'Total_1', 'Proveedor_2', 'Total_2', 'Proveedor_3', 'Total_3', 'Proveedor_4', 'Total_4', 'Proveedor_5', 'Total_5', 'Aprobado_1', 'Aprobado_2', 'Aprobado_3', 'Aprobado_4', 'Aprobado_5'],
        colModel:[
            {name:'Codigo', width:100},
            {name:'Nombre', width:100, template: textTemplate},
            {name:'Unidad', width:100 },
            {name:'Cantidad', width:100,  template: numberTemplate},
            {name:'Proveedor_1', width:100, template: numberTemplate},	
            {name:'Total_1', width:100,  template: numberTemplate},
            {name:'Proveedor_2', width:100, template: numberTemplate},	
            {name:'Total_2', width:100, template: numberTemplate},	
            {name:'Proveedor_3', width:100,  template: numberTemplate},	
            {name:'Total_3', width:100,  template: numberTemplate},
            {name:'Proveedor_4', width:100, template: numberTemplate},		
            {name:'Total_4', width:100,  template: numberTemplate},	
            {name:'Proveedor_5', width:100, template: numberTemplate},	
            {name:'Total_5', width:100,  template: numberTemplate},		
            {name:'Aprobado_1', width:100, hidden:false, template: textTemplate},
            {name:'Aprobado_2', width:100,hidden:false, template: textTemplate},		
            {name:'Aprobado_3', width:100,hidden:false,  template: textTemplate},	
            {name:'Aprobado_4', width:100,hidden:false, template: textTemplate},	
            {name:'Aprobado_5', width:100,hidden:false,  template: textTemplate},			
        ],
        height: 500,
        width: 400,
        rowNum:20,
        pager: '#p_comparativo_precios',
        cellEdit: true,
        viewrecords: true,
        footerrow : true,
        shrinkToFit:false,
        forceFit:true,
        loadComplete: function(data) {
            resize_jqgrid_porcentajes(jq_grid,40,65);
            recalcular_montos();
            var ids = jq_grid.getDataIDs()
            if(ids){
                lista_proveedor_elegido = [{nitem:"0",proveedor:""}];
                ids.forEach(function (element, index, array) {

                    var fila = jq_grid.getRowData(element);
                    if(fila.Aprobado_1=="1"){
                        lista_proveedor_elegido.push({nitem:index + 1 ,proveedor:4});
                        jq_grid.jqGrid('setCell',element,4,'',{'background-color':'rgb(247 146 43)'});
                        jq_grid.jqGrid('setCell',element,5,'',{'background-color':'rgb(247 146 43)'});
                    }
                    if(fila.Aprobado_2=="1"){
                        lista_proveedor_elegido.push({nitem:index + 1,proveedor:6});
                        jq_grid.jqGrid('setCell',element,6,'',{'background-color':'rgb(247 146 43)'});
                        jq_grid.jqGrid('setCell',element,7,'',{'background-color':'rgb(247 146 43)'});
                    }
                    if(fila.Aprobado_3=="1"){
                        lista_proveedor_elegido.push({nitem:index + 1,proveedor:8});
                        jq_grid.jqGrid('setCell',element,8,'',{'background-color':'rgb(247 146 43)'});
                        jq_grid.jqGrid('setCell',element,9,'',{'background-color':'rgb(247 146 43)'});
                    }
                    if(fila.Aprobado_4=="1"){
                        lista_proveedor_elegido.push({nitem:index + 1,proveedor:10});
                        jq_grid.jqGrid('setCell',element,10,'',{'background-color':'rgb(247 146 43)'});
                        jq_grid.jqGrid('setCell',element,11,'',{'background-color':'rgb(247 146 43)'});
                    }
                    if(fila.Aprobado_5=="1"){
                        lista_proveedor_elegido.push({nitem:index + 1,proveedor:12});
                        jq_grid.jqGrid('setCell',element,12,'',{'background-color':'rgb(247 146 43)'});
                        jq_grid.jqGrid('setCell',element,13,'',{'background-color':'rgb(247 146 43)'});
                    }

                });
            }
        },
        afterEditCell: function (rowid,cellname,value,iRow,iCol) {
        },
        beforeSaveCell: function (rowid,cellname,value,iRow,iCol) {
            recalcular_montos();
        },
        afterRestoreCell: function (rowid, value, iRow, iCol) {
            recalcular_montos();
        },
        onCellSelect : function(rowid, iCol, cellcontent, e) { // use this event to capture edited cellID
        },
        onSelectCell : function(rowid, cellname, value, iRow, iCol) { // use this event to capture edited cellID
        },
        onSelectRow: function (rowid, status, e){
        },
        ondblClickRow: function name(rowid,iRow,iCol) {
            if(iCol==4 || iCol==6 || iCol==8 || iCol==10 || iCol==12){
                var existe=false;
                var bloquear=false;
                var existe_index;
                lista_proveedor_elegido.forEach(function (element, index, array) {
                    if(element.nitem==iRow){
                        if(element.proveedor==iCol){
                            existe_index=index;
                            existe=true;
                            bloquear=false;
                            return;
                        }else{
                            bloquear=true;
                        }
                    }
                });
                if(bloquear){
                    mostrarMensajeModal("Aviso","Este producto ya tiene un proveedor.");
                }else{
                    if(existe){
                        lista_proveedor_elegido[existe_index];
                        jq_grid.jqGrid('setCell',rowid,iCol,'',{'background-color':'inherit'});
                        jq_grid.jqGrid('setCell',rowid,iCol*1 + 1,'',{'background-color':'inherit'});
                        lista_proveedor_elegido.splice( existe_index, 1 );
                    }else{  
                        lista_proveedor_elegido.push({nitem:iRow,proveedor:iCol});
                        jq_grid.jqGrid('setCell',rowid,iCol,'',{'background-color':'rgb(247 146 43)'});
                        jq_grid.jqGrid('setCell',rowid,iCol*1 + 1 ,'',{'background-color':'rgb(247 146 43)'});
                    }
                }
                console.log(lista_proveedor_elegido);
            }
        },
        caption: '&nbsp;',
    });
}

function resetSelectionDetalle(){
    var jq_grid=jq_grid_detalle_comparativo_precios;

    if(selected_Id_detalle_comparativo_precios!=""){
        jq_grid.resetSelection(selected_Id_detalle_comparativo_precios);
        selected_Id_detalle_comparativo_precios="";
    }
}

function llenar_grid_cabezera(numero, punto_venta){
    jq_grid_cabezera_comparativo_precios.jqGrid("setGridParam",{
        url: '/comparativo_precios/cabezera_aprobacion_comparativo_precios',
        mtype: "POST",
        datatype: "json",
        postData:{
            numero_documento : numero,
            codigo_punto_venta : punto_venta
        }
    }).trigger("reloadGrid");

    $.ajax({
        url: '/comparativo_precios/cabezera_aprobacion_comparativo_precios',
        type: 'POST',
        data: {
            numero_documento: numero,
            codigo_punto_venta: punto_venta
        },
        success: function (array) {
            if(array != '0'){
                jq_grid_cabezera_comparativo_precios.jqGrid("setLabel", 1, array[0].nombre_proveedor1 ==' '? "Proveedor_1":array[0].nombre_proveedor1);
                jq_grid_cabezera_comparativo_precios.jqGrid("setLabel", 2, array[0].nombre_proveedor2 ==' '? "Proveedor_2":array[0].nombre_proveedor2);
                jq_grid_cabezera_comparativo_precios.jqGrid("setLabel", 3, array[0].nombre_proveedor3 ==' '? "Proveedor_3":array[0].nombre_proveedor3);
                jq_grid_cabezera_comparativo_precios.jqGrid("setLabel", 4, array[0].nombre_proveedor4 ==' '? "Proveedor_4":array[0].nombre_proveedor4);
            }
        }
    })
}

function llenar_grid(numero, punto_venta){
    jq_grid_detalle_comparativo_precios.jqGrid("setGridParam",{
        url: '/comparativo_precios/detalle',
        mtype: "POST",
        datatype: "json",
        postData:{
            numero_documento : numero,
            codigo_punto_venta : punto_venta
        }
    }).trigger("reloadGrid");

    $.ajax({
        url: '/comparativo_precios/detalle',
        type: 'POST',
        data: {
            numero_documento: numero,
            codigo_punto_venta: punto_venta
        },
        success: function (array) {
            if(array != '0'){
                jq_grid_detalle_comparativo_precios.jqGrid("setLabel", 4, array[0].Nombre_Proveedor_1 ==' '? "Proveedor_1":array[0].Nombre_Proveedor_1);
                jq_grid_detalle_comparativo_precios.jqGrid("setLabel", 6, array[0].Nombre_Proveedor_2 ==' '? "Proveedor_2":array[0].Nombre_Proveedor_2);
                jq_grid_detalle_comparativo_precios.jqGrid("setLabel", 8, array[0].Nombre_Proveedor_3 ==' '? "Proveedor_3":array[0].Nombre_Proveedor_3);
                jq_grid_detalle_comparativo_precios.jqGrid("setLabel", 10, array[0].Nombre_Proveedor_4 ==' '? "Proveedor_4":array[0].Nombre_Proveedor_4);
                jq_grid_detalle_comparativo_precios.jqGrid("setLabel", 12, array[0].Nombre_Proveedor_5 ==' '? "Proveedor_5":array[0].Nombre_Proveedor_5);
            }

            //console.log(lista_proveedor_elegido);
        }
    })
}

function recalcular_montos(){  
    var jq_grid=jq_grid_detalle_comparativo_precios;
    var dataIDs = jq_grid.getDataIDs(); 

    for(i = 0; i < dataIDs.length; i++)
    {
        var rowid = dataIDs[i];
        var rowdata = jq_grid.getRowData(rowid);
        if(rowdata.Nombre!=""){

            if(rowid==onCancelRowid){
                switch(onCancelCellName){
                    case "Total_1":
                        rowdata.Total_1=onCancelValue;
                        break;
                    case "Total_2":
                        rowdata.Total_2=onCancelValue;
                        break;
                    case "Total_3":
                        rowdata.Total_3=onCancelValue;
                        break;
                    case "Total_4":
                        rowdata.Total_4=onCancelValue;
                        break;
                    case "Total_5":
                        rowdata.Total_5=onCancelValue;
                        break;

                }
            }

            var valor = calcular_total(rowdata.Cantidad,rowdata.Proveedor_1,rowdata.Proveedor_2,rowdata.Proveedor_3,rowdata.Proveedor_4,rowdata.Proveedor_5);
            
            jq_grid.jqGrid('setRowData', rowid, {
                Total_1 : valor.Total_1,
                Total_2 : valor.Total_2,
                Total_3 : valor.Total_3,
                Total_4 : valor.Total_4,
                Total_5 : valor.Total_5,
            });
        }
    }
    var colSum = jq_grid.jqGrid('getCol', 'Cantidad', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Cantidad': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Proveedor_1', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Proveedor_1': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Total_1', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Total_1': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Proveedor_2', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Proveedor_2': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Total_2', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Total_2': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Proveedor_3', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Proveedor_3': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Total_3', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Total_3': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Proveedor_4', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Proveedor_4': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Total_4', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Total_4': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Proveedor_5', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Proveedor_5': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Total_5', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Total_5': colSum });
}

function calcular_total(Cantidad,Proveedor_1,Proveedor_2,Proveedor_3,Proveedor_4,Proveedor_5) {
    var calcular_total={
        Total_1: 0,
        Total_2: 0,
        Total_3: 0,
        Total_4: 0,
        Total_5: 0
    };

    calcular_total.Total_1 = Cantidad * Proveedor_1;
    calcular_total.Total_2 = Cantidad * Proveedor_2;
    calcular_total.Total_3 = Cantidad * Proveedor_3;
    calcular_total.Total_4 = Cantidad * Proveedor_4;
    calcular_total.Total_5 = Cantidad * Proveedor_5;

    return calcular_total;
}

function Actualizar_lista() {
    jq_grid_lista_pre_cotizaciones.jqGrid("setGridParam",{
        url: '/comparativo_precios/comparativo_precios_pendientes',
        mtype: "POST",
        datatype: "json",
        postData:{
            estado:  jq_estado.val(),
        }
    }).trigger("reloadGrid");
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