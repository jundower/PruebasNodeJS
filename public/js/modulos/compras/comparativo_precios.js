var fecha_trabajo=new Date();
var short_fecha_trabajo="";
var url_motivo_tramites="/talonarios/motivos_tramite_correlativo";
var url_guardar = "/cotizacion/guardar";
var url_responsables = "/usuario/responsables";
var url_configuracion_permisos = '/configuraciones/configuracion_permisos/proceso_compra__sist_cuadro_comparativo__cuadro_comparativo';



var pto_venta = 'pto_venta';
var moneda = 'moneda';
var codigo_proveedor = 'codigo_proveedor';
var nombre_proveedor = 'nombre_proveedor';
var forma_pago = "forma_pago";
var dias_forma_pago = 'dias_forma_pago';
var observacion = "observacion";
var responsable = "responsable";
var base_calculada = "base_calculada";
var monto_descuento = "monto_descuento";
var subtotal = "subtotal";
var igv = "igv";
var total = "total";

var modal_ventana_lista = "modal_ventana_lista";
var grid_lista_pre_cotizaciones = 'lista_pre_cotizaciones';
var grid_detalle_comparativo_precios = 'detalle_comparativo_precios';

var jq_pto_venta;
var jq_moneda;
var jq_codigo_proveedor;
var jq_nombre_proveedor;
var jq_dias_forma_pago;
var jq_observacion;
var jq_responsable;
var jq_base_calculada;
var jq_monto_descuento;
var jq_subtotal;
var jq_igv;
var jq_total;

var jq_modal_ventana_lista;
var jq_grid_lista_pre_cotizaciones;
var jq_grid_detalle_comparativo_precios;

var selected_Id_detalle_comparativo_precios;
var selected_Id_Cell_detalle_comparativo_precios;

var onCancelRowid="";
var onCancelValue="";
var onCanceliRow="";
var onCanceliCol="";
var onCancelCellName="";
var comparativo_precios_lista_proveedores;
var posicion=0;
var lista_productos_elegidos = [];

$(document).ready(function() {
   
    jq_pto_venta = $("#"+pto_venta) ;
    jq_moneda = $("#"+moneda);
    jq_codigo_proveedor = $("#"+codigo_proveedor);
    jq_nombre_proveedor = $("#"+nombre_proveedor);
    jq_dias_forma_pago = $("#"+dias_forma_pago);
    jq_observacion = $("#"+observacion) ;
    jq_responsable = $("#"+responsable);
    jq_base_calculada = $("#"+base_calculada) ;
    jq_monto_descuento = $("#"+monto_descuento) ;
    jq_subtotal = $("#"+subtotal) ;
    jq_igv =$("#"+igv) ;
    jq_total = $("#"+total) ;

    jq_modal_ventana_lista = $("#"+modal_ventana_lista);
    jq_grid_lista_pre_cotizaciones = $("#"+grid_lista_pre_cotizaciones);
    jq_grid_detalle_comparativo_precios = $("#"+grid_detalle_comparativo_precios);


    //$("#buscar_pendientes").prop( "disabled", false );
    //setcomparativo_preciosPendientes('Requerimientos Pendientes','/requerimientos/lista_documentos_pendientes','/requerimientos/lista_detalle_pendientes','','compras_pendientes','detalle_compra');

    $("#nuevo").show();
    $("#guardar").show();
    $("#listar").show();
    $("#imprimir").show();
    setTitle("Comparativo Precios");
    setTitleLista("Listado de Comparativo Precios");
    setListaDocumentos('/pre_cotizacion/lista', '/pre_cotizacion/consultar', '/pre_cotizacion/detalle','Motivo','listado_documentos_compras');
    //setCabeceracomparativo_precios("/talonarios/motivos_tramite");
    //setDetallecomparativo_precios("detalle_compra");

    // jq_codigo_proveedor.change(function () {
    //     console.log(jq_nombre_proveedor.val());
    //     //row_lista_documento_selected = jq_grid_detalle_comparativo_precios.jqGrid("getRowData", 'selrow'); 
    //     var rowData = jq_grid_detalle_comparativo_precios.jqGrid('getRowData')
    //     console.log(rowData);
    //  });

    $("#rigth").click(function(e){

        comparativo_precios_lista_proveedores[posicion]={
            codigo_proveedor:jq_codigo_proveedor.val(),
            nombre_proveedor:jq_nombre_proveedor.val(),
            codigo_forma_pago : jq_forma_pago.val(),
            dias_entrega : jq_dias_forma_pago.val(),
            fecha_pc : "",
            item : posicion,
            moneda : jq_moneda.val(),
            observacion : jq_observacion.val(),
        };
        //recalcular_montos_ventas();
        Nombre_Proveedor();
        posicion==4 ? posicion = posicion : posicion++;
        var proveedor1= comparativo_precios_lista_proveedores[posicion];
        rellenar_comparativo_proveedor(proveedor1);
    })
    $("#left").click(function(e){

        comparativo_precios_lista_proveedores[posicion]={
            codigo_proveedor:jq_codigo_proveedor.val(),
            nombre_proveedor:jq_nombre_proveedor.val(),
            codigo_forma_pago : jq_forma_pago.val(),
            dias_entrega : jq_dias_forma_pago.val(),
            fecha_pc : "",
            item : posicion,
            moneda : jq_moneda.val(),
            observacion : jq_observacion.val(),
        };
        //recalcular_montos_ventas();
        Nombre_Proveedor();
        posicion==0 ? posicion = posicion : posicion--;
        var proveedor1= comparativo_precios_lista_proveedores[posicion];
        rellenar_comparativo_proveedor(proveedor1);
    });
    jq_codigo_proveedor.change(function(){

    });
    nuevo();
});

function nuevo(){
    cargar_pre_cotizaciones();
    cargar_detalle_comparativo();
    
    estado="guardar";
    short_fecha_trabajo =  getShortDate(fecha_trabajo);
    rellenar_codigo_nombre(url_forma_pago,"forma_pago");
    // jq_automatico.prop('checked', true);
    // jq_manual.prop('checked', false);
    jq_direccion_proveedor.prop( "disabled", true );
    
    //rellenar_motivos_tramite_series("OC",motivo,true);
    //cargar_correlativo();
    rellenar_moneda(moneda);

    cargar_responsable();
    jq_fecha_doc.val(short_fecha_trabajo);

    cargar_configuraciones();
    limpiar();
    permisos();
    //jq_tipo.trigger("change");
}

function limpiar(){

    jq_codigo_proveedor.val("");
    jq_nombre_proveedor.val("");
    jq_codigo_proveedor.val("");
    jq_dias_forma_pago.val("");
    jq_observacion.val("");
    jq_base_calculada.val("0.00");
    jq_monto_descuento.val("0.00");
    jq_subtotal.val("0.00");
    jq_igv.val("0.00");
    jq_total.val("0.00");


    // var jq_grid=jq_grid_detalle_comparativo_precios;
    // jq_grid.saveCell(selected_Id_detalle_comparativo_precios,selected_cell_detalle_comparativo_precios);

    jq_grid_detalle_comparativo_precios.jqGrid("setGridParam",{
        url: '/comparativo_precios/detalle',
        mtype: "POST",
        datatype: "json",
        postData:{
            numero_documento : "00",
            codigo_punto_venta : "00"
        }
    }).trigger("reloadGrid");

}

function cargar_correlativo(){

    if(jq_automatico.is(':checked')) {
        
        jq_numero_correlativo.prop( "disabled", true );  
        var today= fecha_trabajo;
        var yyyy = today.getFullYear();
        $.ajax({
            type: 'POST',
            url: url_motivo_tramites,
            data:{
                motivo: 'RCT',
                anio:yyyy,
                tipo_documento:'RCT'
            },
            success: function (lists){
                jq_numero_correlativo.val(lists);
            }
        });
    }else{
        jq_numero_correlativo.prop( "disabled", false );
        jq_numero_correlativo.val("");
    }
};

function cargar_configuraciones(){
    $.ajax({
        type: 'POST',
        url: url_configuraciones_tipo_cambio,
        success: function (lists){
            lists.forEach(list=>{
                jq_moneda.val(list.moneda_trabajo);
                //jq_tipo_cambio.val(list.ctipo_cambio);
                //jq_mas_igv.prop('checked', (list.mas_igv=="S" ? true : false));
                //rellenar_tasa_cambio(tasa_cambio, short_fecha_trabajo,jq_tipo_cambio.val());
            });
        }
    });
    
}

function cargar_responsable(){
    var jq_elemento = jq_responsable;
    $.ajax({
        type: 'POST',
        url: url_responsables,
        data:{
            tipo: 'COT'
        },
        success: function (lists){
            jq_elemento.html('');
            lists.forEach(list=>{
                jq_elemento.append('<option value="'+list.Codigo+'" >'+list.Nombre + '</option>');
            });
       }
   });
}

function guardar(){
    
    comparativo_precios_lista_proveedores[posicion]={
        codigo_proveedor:jq_codigo_proveedor.val(),
        nombre_proveedor:jq_nombre_proveedor.val(),
        codigo_forma_pago : jq_forma_pago.val(),
        dias_entrega : jq_dias_forma_pago.val(),
        fecha_pc : "",
        item : posicion,
        moneda : jq_moneda.val(),
        observacion : jq_observacion.val(),
    };
    url_guardar="";
    var mensaje="";
    var impresion=false;
    switch (estado) {
        case 'guardar':
            url_guardar = "/comparativo_precios/guardar";
            mensaje = "Guardado satisfactoriamente."
            impresion=true;
            break;
        case  'modificar':
            url_guardar = "/comparativo_precios/modificar";
            mensaje = "Modificado satisfactoriamente."
            break;
        case 'eliminar':
            url_guardar = "/comparativo_precios/eliminar";
            mensaje = "Eliminado satisfactoriamente."
            break;
        case 'anular':
            url_guardar = "/comparativo_precios/anular";
            mensaje = "Anulado satisfactoriamente."
            break;
    }
    var RowID = jq_grid_lista_pre_cotizaciones.jqGrid('getGridParam', 'selrow')
    var rowData = jq_grid_lista_pre_cotizaciones.jqGrid('getRowData', RowID)

    var filas_detalle= [];
    var rows = jq_grid_detalle_comparativo_precios.jqGrid('getDataIDs');

    rows.forEach(rowid => {
        var rowdata = jq_grid_detalle_comparativo_precios.getRowData(rowid);
        filas_detalle.push(rowdata);
    });
    //console.log(comparativo_precios_lista_proveedores);
     $.ajax({
         url: url_guardar,
         type: 'post',
         data:{
             numero_documento:  rowData.Numero,
             filas_cabezera: JSON.stringify(comparativo_precios_lista_proveedores),
             filas_detalle: JSON.stringify( filas_detalle)
         },
         success: function(result){
             if(result.estado == true){
                jq_numero_correlativo.val(result.codigo);
                 
                // $("#guardar").prop("disabled", true);
                mostrarMensaje(mensaje,true,2000);
                if(estado!="eliminar") 
                    consultar(impresion);
                estado="Consultar";
             }
             else
                mostrarMensaje("Código de Error:  "+result.codigo+" " +result.mensaje,false,2000);
         },
         error: function(XMLHttpRequest, textStatus, errorThrown,extra) { 
             mostrarMensaje("No se pudo guardar",false,2000);
         }
    });
}

function validar(){
    var retorno=true;

    if(isEmptyOrWhiteSpaces(jq_dias_forma_pago.val())) {
        jq_dias_forma_pago.val("0");
    }
    if(validarDetallecomparativo_precios()) {
        retorno = false;
        mostrarMensajeModal("Aviso","Debe ingresar un detalle de documento");
    }
    return retorno;
}

function listar(){
    jq_modal_ventana_lista.modal('show'); 
    Actualizar_lista() ;
}


function consultar(impresion) {
    var RowID = jq_grid_lista_pre_cotizaciones.jqGrid('getGridParam', 'selrow')
    var rowData = jq_grid_lista_pre_cotizaciones.jqGrid('getRowData', RowID)

    $.ajax({
        type: 'POST',
        url:'/comparativo_precios/consultar',
        data: {
            numero_documento: rowData.Numero,
            codigo_punto_venta:rowData.Punto_Venta
        },success: function (data) {
            setFormatoImpresion(
                {
                    modulo : 'compras',
                    tipo_formato : '',
                    punto_venta : '',
                    tipo_documento : '',
                    motivo_serie : '',
                    formato: 'comparativo_precios'
                },
                data,
                impresion
            );
        }
    });
    // documentoSeleccionado = rowId_seleccionado;
    // row_lista_documento_selected = jq_grid_documentos.jqGrid("getRowData", documentoSeleccionado);
    // var data ={
    //     numero_documento : row_lista_documento_selected.Numero,
    //     codigo_punto_venta : row_lista_documento_selected.Codigo_Punto_Venta
    // }
    // if(impresion){
    //     data ={
    //         numero_documento : jq_numero_correlativo.val(),
    //         codigo_punto_venta : ""
    //     }
    // }
    // $.ajax({
    //     type: "POST",
    //     url: url_consultar,
    //     data: data,
    //     success: function (data) {
    //         console.log(data);
    //         // ** Ventana 1 - 1 ** //
    //         // jq_numero_requerimiento.val(data[0].Numero_Requerimiento);
    //         //Contacto

    //         // ** Ventana 1 - 2 ** //
    //         data[0].Automatico=="A" ? jq_automatico.prop('checked', true) : jq_automatico.prop('checked', false)
    //         data[0].Automatico=="M" ? jq_manual.prop('checked', true) : jq_manual.prop('checked', false)
    //         jq_numero_correlativo.val(data[0].Numero_Documento);
    //         jq_fecha_doc.val(data[0].Fecha_Documento);
    //         jq_responsable.val(data[0].Codigo_Responsable);
    //         //Forma Pago
    //         jq_glosa.val(data[0].Glosa);

            
    //     }
    // });

    // jq_grid_detalle_comparativo_precios.jqGrid("setGridParam",{
    //     url: url_getListaDetalle,
    //     mtype: "POST",
    //     datatype: "json",
    //     postData:data
    // }).trigger("reloadGrid");


    // jq_modal_ventana_lista.modal('hide');
}

function agregar_cabecera_pendientes(rowData){
    console.log(rowData);
    jq_motivo_requerimiento.val(rowData.Codigo_Motivo_Serie);
    // jq_numero_requerimiento.val(rowData.Numero);
    jq_glosa.val(rowData.glosa);


    // ** Ventana 1 - 3 ** //
    jq_base_calculada.val(rowData.Sub_Total_Sin_Descuentos);
    jq_monto_descuento.val(rowData.Monto_Descuento);
    jq_subtotal.val(rowData.Sub_Total);
    jq_igv.val(rowData.Igv);
    jq_total.val(rowData.Total);

};

$(window).bind('resize', function() {
    resize_jqgrid_porcentajes(jq_grid_lista_pre_cotizaciones,80,30);
});

function cargar_pre_cotizaciones() {
    var jq_grid= jq_grid_lista_pre_cotizaciones;
    jq_grid.jqGrid({  
        type: 'POST',      
        url: '/pre_cotizacion/pre_cotizaciones_pendientes',
        datatype: "json",
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
            consultar_comparativo(data);
            
        },
        caption: '&nbsp;',
    });
    ///
}

function cargar_detalle_comparativo() {
    var jq_grid= jq_grid_detalle_comparativo_precios;
    jq_grid.jqGrid({  
        type: 'POST',      
        url: '/comparativo_precios/detalle',
        datatype: "json",
        colNames:['Codigo','Nombre','Unidad','Cantidad', 'Proveedor_1', 'Total_1', 'Proveedor_2', 'Total_2', 'Proveedor_3', 'Total_3', 'Proveedor_4', 'Total_4', 'Proveedor_5', 'Total_5'],
        colModel:[
            {name:'Codigo', width:100},
            {name:'Nombre', width:100, template: textTemplate},
            {name:'Unidad', width:100 },
            {name:'Cantidad', width:100,  template: numberTemplate},
            {name:'Proveedor_1', width:100, template: numberTemplate, editable: true, editoptions: {dataInit: function(element) {
                $(element).keyup(function(event) { recalcular_montos();});}
            }},	
            {name:'Total_1', width:100,  template: numberTemplate},
            {name:'Proveedor_2', width:100, template: numberTemplate, editable: true, editoptions: {dataInit: function(element) {
                $(element).keyup(function(event) { recalcular_montos();});}
            }},	
            {name:'Total_2', width:100, template: numberTemplate},	
            {name:'Proveedor_3', width:100,  template: numberTemplate, editable: true, editoptions: {dataInit: function(element) {
                $(element).keyup(function(event) { recalcular_montos();});}
            }},	
            {name:'Total_3', width:100,  template: numberTemplate},
            {name:'Proveedor_4', width:100, template: numberTemplate, editable: true, editoptions: {dataInit: function(element) {
                $(element).keyup(function(event) { recalcular_montos();});}
            }},		
            {name:'Total_4', width:100,  template: numberTemplate},	
            {name:'Proveedor_5', width:100, template: numberTemplate, editable: true, editoptions: {dataInit: function(element) {
                $(element).keyup(function(event) { recalcular_montos();});}
            }},	
            {name:'Total_5', width:100,  template: numberTemplate},			
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
        loadComplete: function() {
            resize_jqgrid_porcentajes(jq_grid,50,65);
            recalcular_montos();
        },
        afterEditCell: function (rowid,cellname,value,iRow,iCol) {
            $("#"+iRow+'_'+cellname)[0].select();
        },
        beforeSaveCell: function (rowid,cellname,value,iRow,iCol) {
            recalcular_montos();
        },
        afterRestoreCell: function (rowid, value, iRow, iCol) {
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            var cellname = cm[iCol];

            onCancelRowid=rowid;
            onCancelValue=value;
            onCanceliRow=iRow;
            onCanceliCol=iCol;
            onCancelCellName=cellname.name;
            recalcular_montos();
        },
        onCellSelect : function(rowid, iCol, cellcontent, e) { // use this event to capture edited cellID
            resetSelectionDetalle();
            selected_Id_detalle_comparativo_precios=rowid;
            selected_cell_detalle_comparativo_precios = iCol; // save the cellId to a variable
        },
        onSelectCell : function(rowid, cellname, value, iRow, iCol) { // use this event to capture edited cellID
            selected_Id_Cell_detalle_comparativo_precios = rowid;
            resetSelectionDetalle();
            selected_cell_detalle_comparativo_precios = iCol; // save the cellId to a variable
        },
        onSelectRow: function (rowid, status, e){
            var data = jq_grid.getRowData(rowid);
            
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
        }
    })
}


function consultar_comparativo(data){
  
    var impresion=false;
    $.ajax({
        type: 'POST',
        url: '/comparativo_precios/consultar_comparativo',
        data:{
            numero_documento: data.Numero
        },
        success: function (result){
            posicion=0;
            if(result.length==0){
                result=[
                    {
                        codigo_forma_pago : "",
                        codigo_proveedor : "",
                        dias_entrega : "",
                        fecha_pc : "",
                        item : "",
                        moneda : "",
                        nombre_proveedor : "",
                        observacion : "",
                    },
                    {
                        codigo_forma_pago : "",
                        codigo_proveedor : "",
                        dias_entrega : "",
                        fecha_pc : "",
                        item : "",
                        moneda : "",
                        nombre_proveedor : "",
                        observacion : "",
                    },
                    {
                        codigo_forma_pago : "",
                        codigo_proveedor : "",
                        dias_entrega : "",
                        fecha_pc : "",
                        item : "",
                        moneda : "",
                        nombre_proveedor : "",
                        observacion : "",
                    },
                    {
                        codigo_forma_pago : "",
                        codigo_proveedor : "",
                        dias_entrega : "",
                        fecha_pc : "",
                        item : "",
                        moneda : "",
                        nombre_proveedor : "",
                        observacion : "",
                    },
                    {
                        codigo_forma_pago : "",
                        codigo_proveedor : "",
                        dias_entrega : "",
                        fecha_pc : "",
                        item : "",
                        moneda : "",
                        nombre_proveedor : "",
                        observacion : "",
                    },
                ]
                comparativo_precios_lista_proveedores=result;
            }else{
                comparativo_precios_lista_proveedores=result;

            }
            var proveedor1= comparativo_precios_lista_proveedores[posicion];
            if (proveedor1 == undefined) {
                proveedor1 = '';
            }  
            rellenar_comparativo_proveedor(proveedor1);
            llenar_grid(data.Numero, data.Punto_Venta);
            
        }
    });

    $.ajax({
        type: 'POST',
        url:'/comparativo_precios/consultar',
        data: {
            numero_documento: data.Numero,
            codigo_punto_venta: data.Punto_Venta
        },success: function (data) {
            setFormatoImpresion(
                {
                    modulo : 'compras',
                    tipo_formato : '',
                    punto_venta : '',
                    tipo_documento : '',
                    motivo_serie : '',
                    formato: 'comparativo_precios'
                },
                data,
                impresion
            );
        }
    });
}

function rellenar_comparativo_proveedor(datos_proveedor){
    jq_codigo_proveedor.val(datos_proveedor.codigo_proveedor);
    jq_nombre_proveedor.val(datos_proveedor.nombre_proveedor);
    jq_moneda.val(datos_proveedor.moneda);
    jq_forma_pago.val(datos_proveedor.codigo_forma_pago);
    jq_dias_forma_pago.val(datos_proveedor.dias_entrega);
    jq_observacion.val(datos_proveedor.observacion);
    
}

function recalcular_montos_ventas () {
    for (let index = 0; index < comparativo_precios_lista_proveedores.length; index++) {
        const element = comparativo_precios_lista_proveedores[index].codigo_proveedor;
        if (element == jq_codigo_proveedor.val()) {
            mostrarMensajeModal("Aviso","El proveedor ya fue seleccionado");
            jq_codigo_proveedor.val('')
            jq_nombre_proveedor.val('')
        }
    }

    Nombre_Proveedor();

}

function Nombre_Proveedor() {
    switch(posicion){
        case 0:
            jq_grid_detalle_comparativo_precios.jqGrid("setLabel", 4, jq_nombre_proveedor.val() ==' '? "Proveedor_1":jq_nombre_proveedor.val());
        break;
        case 1:
            jq_grid_detalle_comparativo_precios.jqGrid("setLabel", 6, jq_nombre_proveedor.val() ==' '? "Proveedor_2":jq_nombre_proveedor.val());
        break;
        case 2:
            jq_grid_detalle_comparativo_precios.jqGrid("setLabel", 8, jq_nombre_proveedor.val() ==' '? "Proveedor_3":jq_nombre_proveedor.val());
        break;
        case 3:
            jq_grid_detalle_comparativo_precios.jqGrid("setLabel", 10, jq_nombre_proveedor.val() ==' '? "Proveedor_4":jq_nombre_proveedor.val());
        break;
        case 4:
            jq_grid_detalle_comparativo_precios.jqGrid("setLabel", 12, jq_nombre_proveedor.val() ==' '? "Proveedor_5":jq_nombre_proveedor.val());
        break;
    }
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