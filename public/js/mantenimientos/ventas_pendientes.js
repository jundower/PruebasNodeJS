var url_getdocumentos_pendientes;
var url_getdetalle_pendientes;

var url_configuracion_grid="/configurar_tablas/generar";

var buscar_pendientes = "buscar_pendientes";

var lista_documentos_pendientes="lista_documentos_pendientes";
var detalle_documentos_pendientes="detalle_documentos_pendientes";
var detalle_documentos_pendientes_seleccionados="detalle_documentos_pendientes_seleccionados";
var seleccionar_todos_pendientes = "seleccionar_todos_pendientes";
var enviar_pendientes = "enviar_pendientes";
var actualizar_pendientes = "actualizar_pendientes";
var exportar_pendientes = "exportar_pendientes";
var mostrar_todos_pendientes = "mostrar_todos_pendientes";
var mostrar_todos_pendientes_div = "mostrar_todos_pendientes_div";

var jq_lista_documentos_pendientes;
var jq_detalle_documentos_pendientes;
var jq_detalle_documentos_pendientes_seleccionados;
var jq_seleccionar_todos_pendientes;
var jq_buscar_pendientes;
var jq_enviar_pendientes;
var jq_actualizar_pendientes;
var jq_exportar_pendientes;
var jq_mostrar_todos_pendientes;
var jq_mostrar_todos_pendientes_div;

var newIdsSelected=[];
var rowDataPendientes;
var rowDataPendientesSelected;
var codClientesPendientes="";
var codtipo_documento = "";
var tipo_venta_guia ="";
var mostrar_todos="N";
var ventas_pendientes_modulo = "ventas_pendientes";
var ventas_pendientes_modulo_detalle = "detalle_venta";
var jq_codigo_cliente;
var jq_codigo_proveedor;
var Codigo_Centro_Costos;
var Codigo_Orden_Trabajo;
var Codigo_Unidad_Negocio;
var documentos_listas_cabecera=[];
var modulo="";
$(document).ready(function() {
    jq_buscar_pendientes = $("#"+buscar_pendientes);
    jq_lista_documentos_pendientes = $("#"+lista_documentos_pendientes);
    jq_detalle_documentos_pendientes = $("#"+detalle_documentos_pendientes);
    jq_detalle_documentos_pendientes_seleccionados = $("#"+detalle_documentos_pendientes_seleccionados);
    jq_seleccionar_todos_pendientes = $("#"+seleccionar_todos_pendientes);
    jq_enviar_pendientes= $("#"+enviar_pendientes);
    jq_actualizar_pendientes = $("#"+actualizar_pendientes);
    jq_exportar_pendientes = $("#"+exportar_pendientes);
    jq_mostrar_todos_pendientes = $("#"+mostrar_todos_pendientes);
    jq_mostrar_todos_pendientes_div = $("#"+mostrar_todos_pendientes_div);
    
    jq_seleccionar_todos_pendientes.on( 'change', function() {
        var jq_grid = jq_detalle_documentos_pendientes ;
        var ids = jq_grid.jqGrid('getDataIDs');
        
        for(var i=0; i<ids.length;i++){
            if( $(this).is(':checked') ) {
                jq_grid.jqGrid('setCell', ids[i], 'activod', "1");
            }else{
                jq_grid.jqGrid('setCell', ids[i], 'activod', "0");
            }
            agregar_seleccionados(ids[i])
        }
    });
    jq_mostrar_todos_pendientes.on( 'change', function() {
        if( $(this).is(':checked') ) {
            mostrar_todos="S";
        }else{
            mostrar_todos="N";
        }
        recargar_lista_pendientes();
    });

    jq_buscar_pendientes.click(function() {
        $("#modal_pendientes").modal("show");
    });
    jq_enviar_pendientes.click(function() {
        agregar_detalle_pendientes();
        $("#modal_pendientes").modal("hide");
    });
    jq_actualizar_pendientes.click(function() {
        cargar_configuracion_ventas_pendientes();
    });
    jq_exportar_pendientes.click(function () {
        createExcelFromGrid(lista_documentos_pendientes,$("#modal_pendientes_titulo").text(),documentos_listas_cabecera)
    });
    $("#modal_pendientes").on('shown.bs.modal', function () {
        recargar_lista_pendientes();
    });
})

function setVentasPendientes(titulo,_url_getdocumentos,_url_getdetalle, _tipo_venta_guia, modulo, modulo_detalle){
    //Titulo: Aquí va el titulo del modal
    //_url_getdocumentos
    
    $("#modal_pendientes_titulo").text(titulo);
    url_getdocumentos_pendientes = _url_getdocumentos;
    url_getdetalle_pendientes = _url_getdetalle;
    
    tipo_venta_guia=_tipo_venta_guia=="08"?_tipo_venta_guia="07":_tipo_venta_guia=_tipo_venta_guia;
    ventas_pendientes_modulo= isEmptyOrWhiteSpaces(modulo) ? "ventas_pendientes":modulo ;
    ventas_pendientes_modulo_detalle= isEmptyOrWhiteSpaces(modulo_detalle) ? "detalle_venta":modulo_detalle ;
    cargar_configuracion_ventas_pendientes();
}

$(window).bind('resize', function() {
    if(jq_lista_documentos_pendientes!=null){
        resize_jqgrid_porcentajes(jq_lista_documentos_pendientes, 30,85);
        resize_jqgrid_porcentajes(jq_detalle_documentos_pendientes, 25,40);
        resize_jqgrid_porcentajes(jq_detalle_documentos_pendientes_seleccionados, 25,40);
    }
});

function cargar_configuracion_ventas_pendientes(){
    $.ajax({
        type: 'POST',
        url: url_configuracion_grid,
        data:{
            modulo: ventas_pendientes_modulo
        },
        success: function (result){
            cargar_jq_grid_ventas_pendientes(result);
        }
    });

    $.ajax({
        type: 'POST',
        url: url_configuracion_grid,
        data:{
            modulo: ventas_pendientes_modulo_detalle //Cambiar a dinamico para detalle compra y detalle venta
        },
        success: function (result){
            cargar_jq_grid_detalle_pendientes(result);
        }
    });

}

function cargar_jq_grid_ventas_pendientes (configuraciones){
    var configuracion_width= configuraciones[0];
    var configuracion_visibilidad= configuraciones[1];
    var configuracion_posicion= configuraciones[2];
    var configuracion_nueva_posicion= configuraciones[3];
    var configuracion_formato= configuraciones[4];
    var configuracion_editable= configuraciones[5];

    var jq_grid=jq_lista_documentos_pendientes;
    
    var col_grid_lista_documentos=[];
    var col_model_grid_lista_documentos=[];

    for(var i=3 ; i<Object.keys(configuracion_visibilidad).length; i++)
    {
        var col_nombre=Object.keys(configuracion_visibilidad)[i];

        col_grid_lista_documentos.push(col_nombre);

        var codigo_formato=configuracion_formato[Object.keys(configuracion_formato)[i]];
        
        col_model_grid_lista_documentos.push(
            {
                name:col_nombre,
                index:col_nombre,
                width:100,
                hidden:((configuracion_visibilidad[col_nombre]=='1') ? true:false),
                template:((codigo_formato=='1') ? numberTemplate:(codigo_formato=='2') ? currencyTemplate:(codigo_formato=='3') ? realTemplate:textTemplate)
            }
        );
        configuracion_visibilidad[col_nombre]=='0' ? documentos_listas_cabecera.push(col_nombre): "";
    }

    // var codigo_ventas_pendientes="";
    // if(ventas_pendientes_modulo=="ventas_pendientes")


    jq_grid.jqGrid("GridUnload");
    jq_grid.jqGrid({
        url: url_getdocumentos_pendientes,
        mtype: "POST",
        datatype: "json",
        postData: {
            codigo: ventas_pendientes_modulo=="ventas_pendientes" ? jq_codigo_cliente.val() : jq_codigo_proveedor.val(),
            tipo_venta_guia: tipo_venta_guia
        },
        colNames: col_grid_lista_documentos,
        colModel: col_model_grid_lista_documentos,
        rowNum:50,
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        width: 400,
        height: 400,
        rowList:[50,500,5000,50000],
        loadonce: true, 
        pager: '#lista_documentos_pendientes_pager',
        onSelectRow: function (rowid, status, e){
            rowDataPendientes=jq_grid.getRowData(rowid);
            recargar_detalle_pendientes(rowid)
        },
        loadComplete:function(data){
            resize_jqgrid_porcentajes(jq_grid, 30,85);
            
            codClientesPendientes="";
            jq_seleccionar_todos_pendientes.prop('checked',false);
            
            var jq_grid_detalle = jq_detalle_documentos_pendientes ;
            var jq_subgrid=jq_detalle_documentos_pendientes_seleccionados;

            var ids = jq_grid_detalle.getDataIDs(); 
            var subids = jq_subgrid.getDataIDs(); 

            for(i = 0; i < ids.length; i++)
            {
                jq_grid_detalle.jqGrid ("delRowData", ids[i]);
            }
            for(i = 0; i < subids.length; i++)
            {
                jq_subgrid.jqGrid ("delRowData", subids[i]);
            }
        }
    }).jqGrid('filterToolbar',{stringResult: true, searchOnEnter : false, defaultSearch : "cn"});
}

function cargar_jq_grid_detalle_pendientes(configuraciones){
    var configuracion_width= configuraciones[0];
    var configuracion_visibilidad= configuraciones[1];
    var configuracion_posicion= configuraciones[2];
    var configuracion_nueva_posicion= configuraciones[3];
    var configuracion_formato= configuraciones[4];
    var configuracion_editable= configuraciones[5];
    
    var jq_grid=jq_lista_documentos_pendientes;
    
    var col_grid_lista_documentos=[];
    var col_model_grid_lista_documentos=[];
    col_grid_lista_documentos.push("");
    col_model_grid_lista_documentos.push(
        {
            name: 'activod', 
            width: 60, 
            align: 'center',
            formatter: 'checkbox', 
            editoptions: { value: '1:0' },
            formatoptions: { disabled: false }
            
        }
    );
    for(var i=3 ; i<Object.keys(configuracion_visibilidad).length; i++)
    {
        var col_nombre=Object.keys(configuracion_visibilidad)[i];

        col_grid_lista_documentos.push(col_nombre);

        var codigo_formato=configuracion_formato[Object.keys(configuracion_formato)[i]];
        // console.log(((configuracion_visibilidad[col_nombre]=='1') ? (modulo=="cuentas_por_pagar" ? false: true):false))
        col_model_grid_lista_documentos.push(
            {
                name:col_nombre,
                index:col_nombre,
                width:configuracion_width[col_nombre],
                editable:((configuracion_editable[Object.keys(configuracion_editable)[i]]=='1') ? (modulo=="cuentas_por_pagar" ? false: true):false),
                hidden:((configuracion_visibilidad[col_nombre]=='1') ? true:false),
                template:((codigo_formato=='1') ? numberTemplate:(codigo_formato=='2') ? currencyTemplate:(codigo_formato=='3') ? realTemplate:textTemplate),
                configuracion_editable
            }
        );
    }

    var jq_grid=jq_detalle_documentos_pendientes;
    var jq_grid_seleccionados=jq_detalle_documentos_pendientes_seleccionados;    
    
    jq_grid.jqGrid({
        url: url_getdetalle_pendientes,
        mtype: "POST",
        datatype: "json",
        postData:{
            punto_venta: "",
            tipo_documento: "",
            motivo_serie: "",
            numero: ""
        },
        colNames: col_grid_lista_documentos,
        colModel: col_model_grid_lista_documentos,
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        width: 400,
        height: 400,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
            agregar_seleccionados(rowid);
            var fila=jq_grid.getRowData(rowid);
            if(fila.activod=="0"){
                jq_seleccionar_todos_pendientes.prop('checked',false);
            }
        },
        loadComplete:function(data){
            resize_jqgrid_porcentajes(jq_grid,25,40);
            jq_seleccionar_todos_pendientes.prop('checked',false);
            seleccionar_seleccionados();
        }
    });
    
    jq_grid_seleccionados.jqGrid({
        url: url_getdetalle_pendientes,
        mtype: "POST",
        datatype: "json",
        postData:{
            punto_venta: "",
            tipo_documento: "",
            motivo_serie: "",
            numero: ""
        },
        colNames: col_grid_lista_documentos,
        colModel: col_model_grid_lista_documentos,
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        cellEdit: true,
        width: 400,
        height: 400,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        afterEditCell: function (rowid,cellname,value,iRow,iCol) {
            $("#"+iRow+'_'+cellname)[0].select();
        },
        loadComplete:function(data){
            resize_jqgrid_porcentajes(jq_grid_seleccionados,25,40);
        }
    });
}

function recargar_lista_pendientes(){
    var jq_grid=jq_lista_documentos_pendientes;
    jq_grid.jqGrid("setGridParam",{
        url: url_getdocumentos_pendientes,
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: ventas_pendientes_modulo=="ventas_pendientes" ? jq_codigo_cliente.val() : jq_codigo_proveedor.val(),
            tipo_venta_guia: tipo_venta_guia,
            todos: mostrar_todos
        }
    }).trigger("reloadGrid");
}

function recargar_detalle_pendientes(rowID){
    var fila = jq_lista_documentos_pendientes.jqGrid("getRowData",rowID);
    var jq_grid=jq_detalle_documentos_pendientes;
    jq_grid.jqGrid("setGridParam",{
        url: url_getdetalle_pendientes,
        mtype: "POST",
        datatype: "json",
        postData:{
            punto_venta: fila.Punto_Venta,
            motivo_serie: fila.Codigo_Motivo_Serie,
            tipo_documento: fila.Tipo_Documento,
            numero: fila.Numero,
            tipo_venta_guia: tipo_venta_guia,
            todos: mostrar_todos,
            Codigo_Proveedor: fila.Codigo_Proveedor
        }
    }).trigger("reloadGrid");
}

function agregar_seleccionados(rowid){
    var jq_grid=jq_detalle_documentos_pendientes;
    var jq_grid_seleccionados=jq_detalle_documentos_pendientes_seleccionados;

    var fila=jq_grid.getRowData(rowid);
    var ids_subgrid=jq_grid_seleccionados.getDataIDs();
    if(fila.activod=="1"){
        var validar=false;
        if(codClientesPendientes==""){
            codClientesPendientes=rowDataPendientes.Codigo_Cliente;
            rowDataPendientesSelected=rowDataPendientes;
        }
        
        if(codClientesPendientes==rowDataPendientes.Codigo_Cliente)
            validar=true;
    
        //Falta Validar los descentos
        // if(porcDescuentosPendientes==rowDataPendientes.Porc_Descuento)
        //     validar=true;
    
        if(validar){
            var encontrado=false;
            var MaxID = maxID(ids_subgrid);
            if(ids_subgrid.length>0){
                for(var i= 0; i<ids_subgrid.length;i++){
                    var sub_fila = jq_grid_seleccionados.getRowData(ids_subgrid[i]);
                    if(sub_fila.Numero == fila.Numero && sub_fila.Punto_Venta == fila.Punto_Venta && sub_fila.Motivo_Serie == fila.Motivo_Serie && sub_fila.NItem == fila.NItem ){
                        encontrado=true;
                    }
                }
            }
            if(encontrado==false){
                jq_grid_seleccionados.jqGrid('addRowData',MaxID.length,fila);  
            }
        }else{
            jq_grid.jqGrid('setCell', rowid, 'activod', "0");
            mostrarMensajeModal("Aviso","Los documentos deben pertenecer al mismo cliente");
        }
        
    }else{
        for(var i= 0; i<ids_subgrid.length;i++){
            var sub_fila = jq_grid_seleccionados.getRowData(ids_subgrid[i]);
            if(sub_fila.Numero == fila.Numero && sub_fila.Punto_Venta == fila.Punto_Venta && sub_fila.Motivo_Serie == fila.Motivo_Serie && sub_fila.NItem == fila.NItem ){
                jq_grid_seleccionados.jqGrid('delRowData',ids_subgrid[i]);  
            }
            if(jq_grid_seleccionados.getDataIDs().length=="0"){
                codClientesPendientes="";
                rowDataPendientesSelected=[];
            }
        }
    }
}

function seleccionar_seleccionados(){
 
    var jq_grid=jq_detalle_documentos_pendientes;
    var jq_grid_seleccionados=jq_detalle_documentos_pendientes_seleccionados;

    var ids_grid=jq_grid.getDataIDs();
    var ids_subgrid=jq_grid_seleccionados.getDataIDs();
    
    for(var i= 0; i<ids_subgrid.length;i++){
        var sub_fila = jq_grid_seleccionados.getRowData(ids_subgrid[i]);
        
        for(var j= 0; j<ids_grid.length;j++){
            var fila=jq_grid.getRowData(ids_grid[j]);
            if(sub_fila.Numero == fila.Numero && sub_fila.Punto_Venta == fila.Punto_Venta && sub_fila.Motivo_Serie == fila.Motivo_Serie && sub_fila.NItem == fila.NItem ){
                jq_grid.jqGrid('setCell', ids_grid[j], 'activod', "1");
            }
        }
    }
}

function agregar_detalle_pendientes(){

    var lista_productos=[];
    var jq_grid_seleccionados=jq_detalle_documentos_pendientes_seleccionados;
    var ids_subgrid=jq_grid_seleccionados.getDataIDs();

    for(var i= 0; i<ids_subgrid.length;i++){
        var sub_fila = jq_grid_seleccionados.getRowData(ids_subgrid[i]);
        sub_fila.Cantidad_presentacion=sub_fila.Cantidad;
        lista_productos.push(sub_fila);
    }

    var jq_grid=jq_grid_detalle_ventas;

    var dataIDs = jq_grid.getDataIDs(); 

    for(i = 0; i < dataIDs.length; i++)
    {
        jq_grid.jqGrid ("delRowData", dataIDs[i]);
    }
    
    lista_productos.forEach(function (element, index, array) {
        var MaxID = maxID(jq_grid.getDataIDs());
        jq_grid.jqGrid('addRowData',MaxID.length,element); 
    });

    agregar_cabecera_pendientes(rowDataPendientesSelected,lista_productos);

    recalcular_montos_ventas();
}