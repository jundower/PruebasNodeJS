/*
//---- Elementos a necesitar ---- //
Input Text:
    - subtotal
    - monto_descuento
    - igv
    - total
calcular_totales_facturacion se usa 3 veces, al ingresar nuevos productos, al modificar una linea o al cambiar la opción del "mas igv"
*/
var url_detalle_venta = "/cotizacion/detalle";
var url_configuracion_grid="/configurar_tablas/generar";

var grid_detalle_ventas = "grid_detalle_ventas"
var mas_igv = "mas_igv";
var porc_descuento_cabecera = "porc_descuento";

var modal_serie_lote="modal_serie_lote";
var modal_title_serie_lote="modal_title_serie_lote";
var lista_serie_lote="lista_serie_lote";
var serie_lote_almacenes="serie_lote_almacenes";

var jq_grid_detalle_ventas;
var jq_grid_detalle_productos;
var jq_mas_igv;
var jq_porc_descuento_cabecera;

var jq_modal_serie_lote;
var jq_modal_title_serie_lote;
var jq_lista_serie_lote;
var jq_serie_lote_almacenes;

var col_model_grid_detalle_productos=[];
var col_grid_detalle_productos=[];
var fila_vacia_grid_detalle_productos={};
var selected_Id_detalle_ventas;
var selected_Id_Cell_detalle_ventas;
var selected_cell_detalle_ventas="3";
var lista_productos_elegidos=[];
var id_detalle="";
var tipo_lote_serie="";

var onCancelRowid="";
var onCancelValue="";
var onCanceliRow="";
var onCanceliCol="";
var onCancelCellName="";
var Anticipos = 0;
var extranjero = false;
var detalle_modulo_ventas = "detalle_venta";
var jq_comentario_normal;
var jq_comentario_normal_02;
var jq_comentario_deallado;
var jq_text_comentario;
$(document).ready(function() {
    jq_grid_detalle_ventas = $("#"+grid_detalle_ventas);
    jq_mas_igv = $("#"+mas_igv);
    jq_porc_descuento_cabecera = $("#"+porc_descuento_cabecera);

    jq_modal_serie_lote=$("#"+modal_serie_lote);
    jq_modal_title_serie_lote=$("#"+modal_title_serie_lote);
    jq_lista_serie_lote=$("#"+lista_serie_lote);
    jq_serie_lote_almacenes=$("#"+serie_lote_almacenes);

    keydown_modal(jq_modal_serie_lote,jq_lista_serie_lote);

    jq_comentario_normal = $("#comentario_normal");
    jq_comentario_normal_02 = $("#comentario_normal_02");
    jq_comentario_detallado = $("#comentario_detallado");
    jq_text_comentario = $("#text_comentario");

    // cargar_configuracion_detalle_ventas();
    jq_mas_igv.change(function() {
        recalcular_montos_ventas();
    });
    
    $("#enviar_serie_lote").click(function(){
        var validar_serie_lote=true
        var cantidad_serie_lote_total=0;
        var jq_grid_detalle=jq_grid_detalle_ventas;
        var jq_grid=jq_lista_serie_lote;
        jq_grid.saveRow(rowediting);
        var dataIDs = jq_grid.getDataIDs(); 
        var rowdata_detalle = jq_grid_detalle.getRowData(id_detalle);

        for(i = 0; i < dataIDs.length; i++)
        {
            var rowid = dataIDs[i];
            var rowdata = jq_grid.getRowData(rowid);
            cantidad_serie_lote_total = cantidad_serie_lote_total + rowdata.Cantidad * 1;
            if(rowdata.Cantidad > rowdata.Stock){
                validar_serie_lote=false;
                mostrarMensajeModal("Aviso","La cantidad supera el stock")
                i = dataIDs.length;
            }
        }

        if(cantidad_serie_lote_total > rowdata_detalle.Cantidad){
            validar_serie_lote=false;
            mostrarMensajeModal("Aviso","La cantidad requerida es menor a la cantidad enviada")
        }

        if(validar_serie_lote==true)
        {
            var enviados_lote_serie=0;
            for(i = 0; i < dataIDs.length; i++)
            {
                var rowid = dataIDs[i];
                var rowdata = jq_grid.getRowData(rowid);
                
                if(rowdata.Cantidad>0){
                    if(enviados_lote_serie==0){
                        jq_grid_detalle.jqGrid('setCell',id_detalle,"Cantidad",rowdata.Cantidad); 
                        jq_grid_detalle.jqGrid('setCell',id_detalle,"Cantidad_presentacion",rowdata.Cantidad); 
                        if(tipo_lote_serie=="Serie"){
                            jq_grid_detalle.jqGrid('setCell',id_detalle,"Serie_Numero",rowdata.Series); 
                        }
                        if(tipo_lote_serie == "Lote"){
                            jq_grid_detalle.jqGrid('setCell',id_detalle,"Lote_Numero",rowdata.Lote); 
                            jq_grid_detalle.jqGrid('setCell',id_detalle,"Lote_Vencimiento",rowdata.Vcto); 
                        }
                        jq_grid_detalle.jqGrid('setCell',id_detalle,"Codigo_Almacen",jq_serie_lote_almacenes.val()); 
                        jq_grid_detalle.jqGrid('setCell',id_detalle,"Almacen",jq_serie_lote_almacenes.find('option:selected').text()); 
                    }else{
                        var MaxID = maxID(jq_grid_detalle.getDataIDs());
                        rowdata_detalle.Cantidad=rowdata.Cantidad;
                        rowdata_detalle.Cantidad_presentacion=rowdata.Cantidad; 
                        if(tipo_lote_serie=="Serie"){
                            rowdata_detalle.Serie_Numero=rowdata.Series;
                        }
                        if(tipo_lote_serie == "Lote"){
                            rowdata_detalle.Lote_Numero=rowdata.Lote;
                            rowdata_detalle.Lote_Vencimiento=rowdata.Vcto;
                        }
                        rowdata_detalle.Codigo_Almacen=jq_serie_lote_almacenes.val();
                        rowdata_detalle.Almacen=jq_serie_lote_almacenes.find('option:selected').text();
                        jq_grid_detalle.jqGrid('addRowData',MaxID.length,rowdata_detalle,"after",id_detalle );  
                    }
                    enviados_lote_serie ++;
                }
            }
            jq_modal_serie_lote.modal("hide");
            recalcular_montos_ventas();
        }
    });

    jq_comentario_normal.change(function(e){
        if ($(this).prop("checked") == true) {
            jq_comentario_detallado.prop("checked", $(this).prop("checked") == true? false:true);
            $("#m_comentario_normal").modal("show");
            $(".modal-backdrop").addClass("d-none"); 
        }
    });
    jq_comentario_normal_02.change(function(e){
        if ($(this).prop("checked") == true) {
            jq_comentario_detallado.prop("checked", $(this).prop("checked") == true? false:true);
            $("#m_comentario_normal_02").modal("show");
            $(".modal-backdrop").addClass("d-none");
        }
    });
    jq_comentario_detallado.change(function(e){
        if ($(this).prop("checked") == true) {
            jq_comentario_normal.prop("checked", $(this).prop("checked") == true? false:true);
        }
    });
    cargar_grid_comentario_normal();
});

$(window).bind('resize', function() {
    resize_jqgrid_restar(jq_grid_detalle_ventas,$("#myTabContent").height() + $("#myTab").height() + $("#nav_title_bar").height() + 100 + $("#comentario_box").height(),$(window).width() - $("#myTabContent").width());
});

$(window).keydown(function(event) {
    var id_focused=$("*:focus").attr("id");
    var keycode = (event.keyCode ? event.keyCode : event.code);

    if(keycode == '113') {
        event.preventDefault();
    }
    if(id_focused!=undefined){
        switch(id_focused){
            case "grid_detalle_ventas_kn":
                keydown_detalle_ventas(keycode);
                break;
            case "grid_detalle_ventas":
                keydown_detalle_ventas(keycode);
                break;
        }
    }else{
        keydown_detalle_ventas(keycode);
    }
    
});

function setDetalleVentas(modulo){
    detalle_modulo_ventas = isEmptyOrWhiteSpaces(modulo) ? "detalle_venta":modulo ;
    cargar_configuracion_detalle_ventas();
}

function cargar_configuracion_detalle_ventas(){
    $.ajax({
        type: 'POST',
        url: url_configuracion_grid,
        data:{
            modulo: detalle_modulo_ventas
        },
        success: function (lists){
            cargar_jq_grid_detalle_ventas(lists);
        }
    });
}

function cargar_jq_grid_detalle_ventas(configuraciones){
    var configuracion_width= configuraciones[0];
    var configuracion_visibilidad= configuraciones[1];
    var configuracion_posicion= configuraciones[2];
    var configuracion_nueva_posicion= configuraciones[3];
    var configuracion_formato= configuraciones[4];
    var configuracion_editable= configuraciones[5];

    //El Pivot solo acepta para numeros, por el max()
    //1: text | 2:number | 3:currency

    var templates={0:textTemplate,1:numberTemplate,2:currencyTemplate,3:realTemplate,4:dateTemplate2,5:cantidadTemplate};
    
    var jq_grid=jq_grid_detalle_ventas;
    
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

        col_grid_detalle_productos.push(col_nombre);

        var codigo_formato=configuracion_formato[Object.keys(configuracion_formato)[i]];
        fila_vacia_grid_detalle_productos[col_nombre] = (codigo_formato == '0' ? "": (codigo_formato == '4' ? "": "0"));

        if(col_nombre=="Codigo"){

            col_model_grid_detalle_productos.push(
                {
                    name:col_nombre,
                    index:col_nombre,
                    width:configuracion_width[col_nombre],
                    editable:((configuracion_editable[Object.keys(configuracion_editable)[i]]=='1') ? true:false),
                    hidden:((configuracion_visibilidad[col_nombre]=='1') ? true:false),
                    editoptions:{
                        dataInit: function(element) {
                            var id_selected = jq_grid.jqGrid('getGridParam', 'selrow');
                            $(element).keyup(function(event) {
                                rellenar_productos(id_selected,$(this).val(),false);
                            });
                            $(element).keydown(function(event) {
                                var keycode = (event.keyCode ? event.keyCode : event.code);
                                if(keycode == '115' || keycode == '13'){ //115 F4 - 13 Enter
                                    jq_grid.saveCell(id_selected,selected_cell_detalle_ventas);
                                    show_modal_lisa_productos();
                                }
                                if(keycode == '120'){ //120 F9
                                    event.preventDefault();
                                    jq_grid.saveCell(id_selected,selected_cell_detalle_ventas);
                                    var rowdata = jq_grid.getRowData(id_selected);
                                    if(rowdata.Serie_SN == "S"){
                                        var columnas=['Series','Stock','Cantidad','Almacen'];
                                        modal_lote_serie_show(id_selected,"Listado de Serie - "+rowdata.Codigo,'/productos/series/',columnas,{codigo_articulo: rowdata.Codigo, almacen: rowdata.Codigo_Almacen},"Serie");

                                    }else if(rowdata.Lote_SN == "S"){
                                        var columnas=['Lote','Vcto','Stock','Cantidad','Almacen'];
                                        modal_lote_serie_show(id_selected,"Listado de Lotes - "+rowdata.Codigo,'/productos/lotes/',columnas,{codigo_articulo: rowdata.Codigo, almacen: rowdata.Codigo_Almacen},"Lote");
                                    }
                                }
                            });
                            $(element).dblclick(function(event) {
                                jq_grid.saveCell(id_selected,selected_cell_detalle_ventas);
                                show_modal_lisa_productos();
                            });
                        }
                    },
                    template:templates[codigo_formato]
                        // (
                        //     (codigo_formato=='1') ? 
                        //         numberTemplate : 
                        //         (codigo_formato=='2') ? 
                        //             currencyTemplate :
                        //             (codigo_formato=='3') ? 
                        //                 realTemplate :
                        //                 (codigo_formato=='4') ? 
                        //                     dateTemplate :
                        //                     textTemplate
                        // )
                }
            );
        }else if(col_nombre=="Cantidad"){
            col_model_grid_detalle_productos.push(
                {
                    name:col_nombre,
                    index:col_nombre,
                    width:configuracion_width[col_nombre],
                    editable:((configuracion_editable[Object.keys(configuracion_editable)[i]]=='1') ? true:false),
                    hidden:((configuracion_visibilidad[col_nombre]=='1') ? true:false),
                    template:templates[codigo_formato],
                    editoptions:{
                        dataInit: function(element) {
                            $(element).keyup(function(event) {
                                recalcular_montos_ventas();
                            });
                            $(element).on('paste', function(e){ 
                                var id = jq_grid.jqGrid('getGridParam', 'selrow');
                                
                                e.preventDefault();
                                var pastedData = e.originalEvent.clipboardData.getData('text');
                                var jsonPastedData=tsvToJson(pastedData);
                                var pastedRow=[];
                                jq_grid.saveCell(id,selected_cell_detalle_ventas);
                                if(jsonPastedData.length>0){
                                    var element=jsonPastedData[0];
                                    
                                    if(Object.keys(element).length>=3){

                                        jq_grid.jqGrid('setCell',id,"Cantidad",isNaN(element[0])==true ? 0 : element[0]); 
                                        jq_grid.jqGrid('setCell',id,"Cantidad_Presentacion",isNaN(element[0])==true ? 0 : element[0]); 

                                        jq_grid.jqGrid('setCell',id,"Codigo",element[1]); 
                                        jq_grid.jqGrid('setCell',id,"Codigo_Presentacion",element[1]);

                                        jq_grid.jqGrid('setCell',id,"Unit",isNaN(element[2])==true ? 0 : element[0]); 
                                        jq_grid.jqGrid('setCell',id,"Precio_Presentacion",isNaN(element[2])==true ? 0 : element[0]); 

                                        for(var i=jsonPastedData.length - 1; i>0;i--){
                                            var new_fila=deepCopy(fila_vacia_grid_detalle_productos);
                                            var element=jsonPastedData[i];
                                            new_fila.Cantidad=isNaN(element[0])==true ? 0 : element[0];
                                            new_fila.Cantidad_Presentacion=isNaN(element[0])==true ? 0 : element[0];
                                            new_fila.Codigo=element[1];
                                            new_fila.Codigo_Presentacion=element[1];
                                            new_fila.Unit=isNaN(element[2])==true ? 0 : element[2];
                                            new_fila.Precio_Presentacion=isNaN(element[2])==true ? 0 : element[2];

                                            pastedRow.push(new_fila);
                                        }
                                        var MaxID = maxID(jq_grid.getDataIDs());
                                        jq_grid.jqGrid('addRowData',MaxID.length,pastedRow,"after",id );
                                                                    
                                        var dataIDs = jq_grid.getDataIDs(); 

                                        for(i = 0; i < dataIDs.length; i++)
                                        {
                                            var rowid = dataIDs[i];
                                            var rowdata = jq_grid.getRowData(rowid);
                                            
                                            if(rowdata.Codigo!=""){
                                                rellenar_productos(rowid,rowdata.Codigo,true);
                                            }else{
                                                jq_grid.jqGrid ("delRowData", rowid);
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            );
        }else if (codigo_formato=="4"){
            col_model_grid_detalle_productos.push(
                {
                    name:col_nombre,
                    index:col_nombre,
                    width:configuracion_width[col_nombre],
                    editable:((configuracion_editable[Object.keys(configuracion_editable)[i]]=='1') ? true:false),
                    hidden:((configuracion_visibilidad[col_nombre]=='1') ? true:false),
                    template:templates[codigo_formato],
                }
            );
        }else{
            col_model_grid_detalle_productos.push(
                {
                    name:col_nombre,
                    index:col_nombre,
                    width:configuracion_width[col_nombre],
                    editable:((configuracion_editable[Object.keys(configuracion_editable)[i]]=='1') ? true:false),
                    hidden:((configuracion_visibilidad[col_nombre]=='1') ? true:false),
                    template:templates[codigo_formato],
                    editoptions: {
                        dataInit: function(element) {
                            $(element).keyup(function(event) {
                                recalcular_montos_ventas();
                            });
                        }
                    }
                }
            );
        }
    }


    jq_grid.jqGrid({
        url: url_detalle_venta,
        datatype: "json",
        mtype: "POST",
        colNames:col_grid_detalle_productos,
        colModel:col_model_grid_detalle_productos,
        loadonce: true,
        cellEdit: true,
        viewrecords: true,
        rownumbers: true,
        autowidth:true,
        shrinkToFit:false,
        forceFit:true,
        height: 250,
        Width: 250,
        rowNum:100,
        rowList:[100,500,5000,50000],
        caption:"&nbsp;",
        hidegrid:false,
        footerrow : true,
        pager: '#grid_detalle_ventas_pager',
        // userDataOnFooter : true,
        // altRows : true,
        beforeSelectRow(rowid, e){
        },
        onSelectRow: function (rowid, status, e){
        },
        afterEditCell: function (rowid,cellname,value,iRow,iCol) {
            $("#"+iRow+'_'+cellname)[0].select();
            // jq_grid.jqGrid('setCell',rowid,cellname,'',{color: value==0 ? 'white' : 'black'});
        },
        beforeSaveCell: function (rowid,cellname,value,iRow,iCol) {
            switch(cellname){
                case "Unit":
                    jq_grid.jqGrid('setRowData', rowid, {Precio_original: value, Precio_presentacion: value});
                    break;
                case "Nombre":
                    jq_grid.jqGrid('setRowData', rowid, {Nombre_presentacion: value});
                    break;
                case "Cantidad":
                    jq_grid.jqGrid('setRowData', rowid, {Cantidad_presentacion: value});
                    break;
            }
            recalcular_montos_ventas();
        },
        afterRestoreCell: function (rowid, value, iRow, iCol) {
            
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            var cellname = cm[iCol];

            onCancelRowid=rowid;
            onCancelValue=value;
            onCanceliRow=iRow;
            onCanceliCol=iCol;
            onCancelCellName=cellname.name;
            recalcular_montos_ventas();
        },
        loadComplete:function(data){
            cargar_filas_detalle_ventas();
            resize_jqgrid_restar(jq_grid,$("#myTabContent").height() + $("#myTab").height() + $("#nav_title_bar").height() + 100 + $("#comentario_box").height(), $(window).width() - $("#myTabContent").width());
            // recalcular_montos_ventas();
            calcular_totales_footer();
                    
            
            setColorsByNumber();
            
        },
        onCellSelect : function(rowid, iCol, cellcontent, e) { // use this event to capture edited cellID
            resetSelectionDetalleProductos();
            selected_Id_detalle_ventas=rowid;
            selected_cell_detalle_ventas = iCol; // save the cellId to a variable
        },
        onSelectCell : function(rowid, cellname, value, iRow, iCol) { // use this event to capture edited cellID
            selected_Id_Cell_detalle_ventas = rowid;
            resetSelectionDetalleProductos();
            selected_cell_detalle_ventas = iCol; // save the cellId to a variable
        }
    });
    
    jq_grid.jqGrid('bindKeys', {
        "onEnter":function( rowid ) { 
            console.log($("*:focus").attr("id"));
        }
    } );
}

function keydown_detalle_ventas(keycode){

    var jq_grid=jq_grid_detalle_ventas;
    switch(keycode){
        // case 115: //F4 = 115
        //     event.preventDefault();
        //     jq_modal_productos.modal('show');
        // break;
        case 118: //F7 = 118
            event.preventDefault();
            var MaxID = maxID(jq_grid.getDataIDs());
            if(!isEmptyOrWhiteSpaces(selected_Id_Cell_detalle_ventas))
                jq_grid.jqGrid('addRowData',MaxID.length,fila_vacia_grid_detalle_productos,"after",selected_Id_Cell_detalle_ventas);
            else
                jq_grid.jqGrid('addRowData',MaxID.length,fila_vacia_grid_detalle_productos);  
        break;
        case 119: //F8 = 118
            event.preventDefault();
            var dataIds = jq_grid.getDataIDs();
            var rowId = jq_grid.jqGrid ("getGridParam", "selrow");
            if(dataIds.length>0 && !isEmptyOrWhiteSpaces(rowId)){
                var index = dataIds.indexOf(rowId);
                var subindex = index * 1 + 1;
                index = index == 0 ?  1 : index -1;
                selected_Id_detalle_ventas = dataIds[index];

                jq_grid.jqGrid ("delRowData", rowId);

                jq_grid.editCell((subindex >= dataIds.length ? subindex - 1 : subindex),selected_cell_detalle_ventas,false);
            }
        break;
        case 115: //F4 = 115
        break;
        default:
            // console.log($("*:focus").attr("id"));
            // console.log(keycode);
    }
}

function agregar_detalle_ventas(){
    var jq_grid=jq_grid_detalle_ventas;
    var id_selected = jq_grid.jqGrid('getGridParam', 'selrow');
    for(var i=0; i<lista_productos_elegidos.length;i++){
        var j=0;
        if(i==0){
            j=i;
        }else{
            j=lista_productos_elegidos.length-i;
        }
        element = lista_productos_elegidos[j];
        var new_fila=deepCopy(fila_vacia_grid_detalle_productos);
        if($("#TitleHeader").text()=="Requerimientos"){
            element.PrecioCalcular = 0;
        }
        // if(modulo)
        // element.PrecioCalcular
        new_fila.Barticulo = "S";
        new_fila.Comision_monto = "0";
        new_fila.Comision_porcentaje = "0";
        new_fila.Desc1 = jq_porc_descuento_cabecera.val();
        new_fila.Desc2 = "0";
        new_fila.Desc3 = "0";
        new_fila.Desc4 = "0";
        new_fila.Percepcion_uni = "0";
        new_fila.Perpecion_porc = "0";
        new_fila.Peso = "0";
        new_fila.NItem = "0";
        new_fila.Pedido_NItem = "0";
        new_fila.Guia_NItem = "0";
        new_fila.Origen_NItem = "0";
        
        new_fila.Almacen = element.Almacen;
        new_fila.Codigo_Almacen = element.Codigo_Almacen;
        new_fila.Factor = element.Factor;
        new_fila.Cantidad = element.Cantidad;
        new_fila.Cantidad_Kardex = element.Cantidad * element.Factor ;
        new_fila.Cantidad_presentacion = element.Cantidad;
        new_fila.Unidad = element.Unidad;
        new_fila.Unidad_presentacion = element.Unidad;
        new_fila.Codigo_Unidad = element.Unidad;
        new_fila.Codigo = element.Codigo;
        new_fila.Codigo_presentacion = element.Codigo;
        new_fila.Igv_Art = element.Igv_Art;
        new_fila.Nombre = element.Nombre;
        new_fila.Nombre_presentacion = element.Nombre;
        new_fila.Unit = element.PrecioCalcular;
        new_fila.Precio_original = element.PrecioCalcular;
        new_fila.Precio_presentacion = element.PrecioCalcular;
        new_fila.Lote_SN = element.Lote_SN;
        new_fila.Lote_Numero = "";
        new_fila.Lote_Vencimiento = "";
        new_fila.Serie_SN = element.Serie_SN;
        new_fila.Serie_Numero = "";
        new_fila.ICBPER = element.ICBPER;
        new_fila.Stock_SN = element.Stock_SN;

        var MaxID = maxID(jq_grid.getDataIDs());
        if(i==0) {
            jq_grid.jqGrid('setRowData',id_selected,new_fila);  
            
        }else{
            jq_grid.jqGrid('addRowData',undefined,new_fila,"after",id_selected );  
        }
    };
    recalcular_montos_ventas(); 
    
    selected_Id_detalle_ventas = id_selected;
    // jq_grid.resetSelection().setSelection(id_selected,true);
    jq_grid.focus();
    jq_grid.saveCell(id_selected,selected_cell_detalle_ventas);
    // jq_grid.editCell(id_selected,selected_cell_detalle_ventas,false);
    

}

function recalcular_montos_ventas(){
    var jq_grid=jq_grid_detalle_ventas;

    var dataIDs = jq_grid.getDataIDs(); 

    var SubTotal_Sin_Descuentos=0,Descuentos=0,SubTotal_Con_Descuentos=0, SubTotal_Con_Descuentos_Con_Anticipos = 0,Igv=0, Icbper=0,Total = 0;

    for(i = 0; i < dataIDs.length; i++)
    {
        var rowid = dataIDs[i];
        var rowdata = jq_grid.getRowData(rowid);
        if(rowdata.Nombre!=""){
            if(rowdata.Cantidad > 0 && rowdata.Unit >0)
                jq_grid.jqGrid('setCell',rowid,"Desc1",jq_porc_descuento_cabecera.val()); 

            if(rowid==onCancelRowid){
                switch(onCancelCellName){
                    case "Unit":
                        rowdata.Unit=onCancelValue;
                        break;
                    case "Cantidad":
                        rowdata.Cantidad=onCancelValue;
                        break;
                    case "Desc2":
                        rowdata.Desc2=onCancelValue;
                        break;
                    case "Desc3":
                        rowdata.Desc3=onCancelValue;
                        break;
                    case "Desc4":
                        rowdata.Desc4=onCancelValue;
                        break;

                }
            }
            var calculos = calcular_totales_facturacion(jq_mas_igv.is(':checked'), rowdata.Cantidad, rowdata.
            Unit, rowdata.Igv_Art,rowdata.ICBPER, jq_porc_descuento_cabecera.val(),rowdata.Desc2,rowdata.Desc3,rowdata.Desc4, extranjero );
            
            jq_grid.jqGrid('setRowData', rowid, {
                Base_Calculada : calculos.SubTotal_Sin_Descuentos,
                Base_calculada_dec : calculos.SubTotal_Sin_Descuentos,
                Base_Imponible : calculos.SubTotal_Con_Descuentos,
                Base_imp_dec : calculos.SubTotal_Con_Descuentos,
                Igv : calculos.Igv,
                Igv_dec : calculos.Igv,
                Importe : calculos.Total,
                Importe_dec : calculos.Total,
                Monto_Descuento : calculos.Descuentos_SubTotal,
                Cantidad_Kardex: rowdata.Cantidad * rowdata.Factor
            });
            SubTotal_Sin_Descuentos = SubTotal_Sin_Descuentos + 1 * calculos.SubTotal_Sin_Descuentos;
            SubTotal_Con_Descuentos = SubTotal_Con_Descuentos + 1 * calculos.SubTotal_Con_Descuentos;
            Descuentos = Descuentos + 1 * calculos.Descuentos_SubTotal;
            Igv = Igv + 1 * calculos.Igv;
            Icbper = Icbper + 1 * calculos.ICBPER;
            Total = Total + 1 * calculos.Total;
        }
    }
    if(Anticipos!=0){
        SubTotal_Con_Descuentos = SubTotal_Con_Descuentos - Anticipos;
        Igv = SubTotal_Con_Descuentos * 0.18;
        Total = SubTotal_Con_Descuentos + Igv + Icbper;
    }
    
    $("#base_calculada").val(SubTotal_Sin_Descuentos.toFixed(2));
    $("#monto_descuento").val(Descuentos.toFixed(2));
    $("#anticipos").val(Anticipos.toFixed(2));
    $("#subtotal").val(SubTotal_Con_Descuentos.toFixed(2));
    $("#igv").val(Igv.toFixed(2));
    $("#icbper").val(Icbper.toFixed(2));
    $("#total").val(Total.toFixed(2));
    
    $("#base_calculada_mask").val(formatNumber.new(SubTotal_Sin_Descuentos,"",2))
    $("#monto_descuento_mask").val(formatNumber.new(Descuentos,"",2))
    $("#anticipos_mask").val(formatNumber.new(Anticipos,"",2))
    $("#subtotal_mask").val(formatNumber.new(SubTotal_Con_Descuentos,"",2))
    $("#igv_mask").val(formatNumber.new(Igv,"",2))
    $("#icbper_mask").val(formatNumber.new(Icbper,"",2))
    $("#total_mask").val(formatNumber.new(Total,"",2))
    onCancelRowid="";
    calcular_totales_footer();
    
    setColorsByNumber();
}

function setColorsByNumber(){
    
    var jq_grid=jq_grid_detalle_ventas;

    var dataIDs = jq_grid.getDataIDs(); 

    for(i = 0; i < dataIDs.length; i++)
    {
        var rowid = dataIDs[i];
        var rowdata = jq_grid.getRowData(rowid);
        jq_grid.jqGrid('setCell',rowid,'Cantidad','',{color: rowdata.Cantidad==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Cantidad_presentacion','',{color: rowdata.Cantidad==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Precio_presentacion','',{color: rowdata.Cantidad==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Unit','',{color: rowdata.Unit==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Igv_Art','',{color: rowdata.Igv_Art==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'ICBPER','',{color: rowdata.ICBPER==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Desc1','',{color: rowdata.Desc1==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Desc2','',{color: rowdata.Desc2==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Desc3','',{color: rowdata.Desc3==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Desc4','',{color: rowdata.Desc4==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Factor','',{color: rowdata.Factor==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Base_Calculada','',{color: rowdata.Base_Calculada==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Base_Imponible','',{color: rowdata.Base_Imponible==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Igv','',{color: rowdata.Igv==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Importe','',{color: rowdata.Importe==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Monto_Descuento','',{color: rowdata.Monto_Descuento==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Cantidad_Kardex','',{color: rowdata.Cantidad_Kardex==0 ? 'white' : 'black'});
    }

}

function resetSelectionDetalleProductos(){
    var jq_grid=jq_grid_detalle_ventas;

    if(selected_Id_detalle_ventas!=""){
        jq_grid.resetSelection(selected_Id_detalle_ventas);
        selected_Id_detalle_ventas="";
    }
}

function cargar_filas_detalle_ventas(){
    var jq_grid=jq_grid_detalle_ventas;
    var ids=jq_grid.getDataIDs();
    if(ids.length==0){
        for(var i = 0 ; i < 20 ; i++ ){
            jq_grid.jqGrid('addRowData',undefined,fila_vacia_grid_detalle_productos);
        }
    }      
}

function rellenar_productos(id, codigo, copiado){
    
    $.ajax({
        type: 'POST',
        url: '/productos/datos/',
        data: {codigo: codigo},
        success: function (result){

            var jq_grid=jq_grid_detalle_ventas;
            console.log(result.length);
            if(result.length>0){
                var element = result[0];
                
                jq_grid.jqGrid('setCell',id,"Codigo_Almacen",element.Codigo_Almacen); 
                jq_grid.jqGrid('setCell',id,"Almacen",element.Nombre_Almacen); 

                jq_grid.jqGrid('setCell',id,"Factor",element.Factor); 
                jq_grid.jqGrid('setCell',id,"Codigo_Unidad",element.Unidad); 
                jq_grid.jqGrid('setCell',id,"Unidad",element.Unidad); 
                jq_grid.jqGrid('setCell',id,"Igv_Art",element.Igv_Art); 
                jq_grid.jqGrid('setCell',id,"Nombre",element.Nombre); 
                jq_grid.jqGrid('setCell',id,"Unidad_presentacion",element.Unidad); 
                jq_grid.jqGrid('setCell',id,"Codigo_presentacion",element.Codigo); 
                jq_grid.jqGrid('setCell',id,"Nombre_presentacion",element.Nombre); 
                jq_grid.jqGrid('setCell',id,"Barticulo",'S'); 
                jq_grid.jqGrid('setCell',id,"Stock_SN",element.Control_Stock); 
                jq_grid.jqGrid('setCell',id,"Lote_SN",element.Lote); 
                jq_grid.jqGrid('setCell',id,"Serie_SN",element.Serie); 
                jq_grid.jqGrid('setCell',id,"Desc1",jq_porc_descuento_cabecera.val()); 
                
                copiado==true ? recalcular_montos_ventas() : '';
                
            }else{
                jq_grid.jqGrid('setCell',id,"Codigo_Almacen",' '); 
                jq_grid.jqGrid('setCell',id,"Almacen",' '); 
                jq_grid.jqGrid('setCell',id,"Factor",' '); 
                jq_grid.jqGrid('setCell',id,"Codigo_Unidad",' '); 
                jq_grid.jqGrid('setCell',id,"Unidad",' '); 
                jq_grid.jqGrid('setCell',id,"Igv_Art",' '); 
                jq_grid.jqGrid('setCell',id,"Nombre",' '); 
                jq_grid.jqGrid('setCell',id,"Unidad_presentacion",' '); 
                jq_grid.jqGrid('setCell',id,"Codigo_presentacion",' '); 
                jq_grid.jqGrid('setCell',id,"Nombre_presentacion",' '); 
                jq_grid.jqGrid('setCell',id,"Barticulo",' ');
                jq_grid.jqGrid('setCell',id,"Stock_SN",' '); 
                jq_grid.jqGrid('setCell',id,"Lote_SN",' '); 
                jq_grid.jqGrid('setCell',id,"Serie_SN",' '); 
                jq_grid.jqGrid('setCell',id,"Desc1",' ');  

                copiado==true ? console.log("Codigo "+ codigo+ " no encontrado"): '';
                copiado==true ? jq_grid.jqGrid("delRowData", id): ' ';
            }
        }
    });
}

function actualizar_lista_precios(){

    var jq_grid=jq_grid_detalle_ventas;

    var dataIDs = jq_grid.getDataIDs(); 

    var lista_codigos=[];
    for(i = 0; i < dataIDs.length; i++)
    {
        var rowid = dataIDs[i];
        var rowdata = jq_grid.getRowData(rowid);
        if(rowdata.Nombre!=""){
            lista_codigos.push({Codigo: rowdata.Codigo, Unidad: rowdata.Codigo_Unidad});
        }
    }
    
    var id_selected = jq_grid.jqGrid('getGridParam', 'selrow');
    jq_grid.saveCell(id_selected,selected_cell_detalle_ventas);
    
    $.ajax({
        url: '/productos/lista_precios/',
        type: 'post',
        data:{
            codigo_concepto:jq_lista_precios.val(),
            codigo_tipo: '12',
            tipo_cambio:jq_tasa_cambio.val(),
            moneda_documento: jq_moneda.val(),
            filas: JSON.stringify( lista_codigos)
        },
        success: function(result){
            for(i = 0; i < dataIDs.length; i++)
            {
                var rowid = dataIDs[i];
                var rowdata = jq_grid.getRowData(rowid);
                if(rowdata.Nombre!=""){
                    result.forEach(element => {
                        if(element.length>0){
                            var elem = element[0];
                            var Codigo=elem.Codigo;
                            var Unidad=elem.Unidad;
                            if(rowdata.Codigo == Codigo && rowdata.Codigo_Unidad == Unidad){
                                jq_grid.jqGrid('setCell',rowid,"Unit",elem.Unit); 
                                jq_grid.jqGrid('setCell',rowid,"Precio_Calcular",elem.Unit); 
                                jq_grid.jqGrid('setCell',rowid,"Desc2",elem.Desc2); 
                                jq_grid.jqGrid('setCell',rowid,"Desc3",elem.Desc3); 
                                jq_grid.jqGrid('setCell',rowid,"Desc4",elem.Desc4);  
                            }
                        }
                    });
                }
            }
            
            recalcular_montos_ventas();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown,extra) { 
            mostrarMensaje("No se pudo guardar",false,2000);
        }
   });
   
}

function calcular_totales_footer(){
    
    var jq_grid=jq_grid_detalle_ventas;
    var colSum = jq_grid.jqGrid('getCol', 'Cantidad', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Cantidad': colSum });
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
}

function modal_lote_serie_show(id,titulo,url,columnas, data, tipo){
    id_detalle=id;
    tipo_lote_serie=tipo;
    jq_modal_title_serie_lote.text(titulo);
    var jq_grid = jq_lista_serie_lote;
    var jq_element = jq_serie_lote_almacenes;
    
    $.ajax({
        url: url_productos_detalle_almacenes,
        type: "POST",
        success: function (lists){
            jq_element.html('');
            lists.forEach(list=>{
                jq_element.append('<option value="'+list.Codigo+'">'+list.Nombre+'</option>');
            });
            jq_element.val(data.almacen);
        }
    });
    jq_element.change(function() {
        data.almacen=$(this).val();
        var gridArr = jq_grid.getDataIDs();
        jq_grid.jqGrid('saveRow',gridArr[curr_index_detalle], true);
        jq_grid.jqGrid('setGridParam',{
            url: url, 
            type: "POST",
            datatype: "json",
            postData: data,
        }).trigger('reloadGrid', { fromServer: true, page: 1 });
    });
    
    jq_modal_serie_lote.modal('show');

    var model =[]
    for(var i=0;i<columnas.length ; i++){
        model.push({name: columnas[i], editable: (columnas[i] == "Cantidad" ? true : false ), align: 'center', searchoptions:{sopt:['cn','nc','eq','bw','bn','ew','en']}});
    }
    jq_grid.jqGrid('GridUnload');
    jq_grid.jqGrid({
        url: url,
        mtype: "POST",
        datatype: "json",
        postData: data,
        colNames: columnas,
        colModel: model,
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        width: 750,
        height: 300,
        loadComplete:function(data){
            var gridArr = jq_grid.getDataIDs();
            rowid=gridArr[0];
            jq_grid.resetSelection().setSelection(rowid,true);
            rowediting= rowid;
            jq_grid.jqGrid('editRow',rowid,{ keys : true});
        },
        beforeSelectRow:function(rowid, e){
            jq_grid.resetSelection().setSelection(rowid,true);
            editar_celda_serie_lote(rowid,jq_grid);
        },
        onSelectRow: function (rowid, status, e){
            editar_celda_serie_lote(rowid,jq_grid);
        }
    });
    

    jq_grid.jqGrid('bindKeys', {
        "onEnter":function( rowid ) { 
            console.log($("*:focus").attr("id"));
        } 
    } );
    
}

function keydown_modal(jq_modal,jq_grid){

    jq_modal.keydown(function(event) {
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
}

function editar_celda_serie_lote(rowid, jq_grid){
    jq_grid.saveRow(rowediting);
    rowediting= rowid;
    jq_grid.jqGrid('editRow',rowid,{ keys : true,
        aftersavefunc: function() {
            
        },
        oneditfunc: function() {
            $("#"+rowid+'_Cantidad')[0].select();
        },
        afterrestorefunc: function(){
            jq_modal_serie_lote.modal('hide');
        }
    });
}

function cargar_grid_comentario_normal() {
    var fila_vacia = {};

    jQuery("#grid_comentario_normal").jqGrid({
        datatype: "local",
        height: 68,
        width: 454,
        colNames:['Titulo','Descripcion'],
        colModel:[
            {name:'Titulo',index:'Titulo', width:55, editable:true},
            {name:'Descripcion',index:'Descripcion', width:90, editable:true},	
        ],
        rowNum:10,
        sortname: 'id',
        viewrecords: true,
        sortorder: "desc",
        cellEdit: true,
        loadComplete: function (data) {
            for (let i = 0; i < 4-data.length; i++) {
                jQuery("#grid_comentario_normal").jqGrid('addRowData',undefined,fila_vacia);
            } 
        }
    });
}

function generar_array_detalle(){
    var filas_detalle=[];
    var rows = jq_grid_detalle_ventas.jqGrid('getDataIDs');
    rows.forEach(rowid => {
        var rowdata = jq_grid_detalle_ventas.getRowData(rowid);

        if(isEmptyOrWhiteSpaces(rowdata.Pedido_NItem)){
            rowid.Pedido_NItem = 0;
        }

        if(isEmptyOrWhiteSpaces(rowdata.Lote_Vencimiento)){
            rowdata.Lote_Vencimiento='01/01/1900';
        }else{
            rowdata.Lote_Vencimiento = getDateFormat (rowdata.Lote_Vencimiento,'d/m/y',"m/d/y",'/','/');
        }

        if(rowid.Lote_SN!="S"){
            rowdata.Lote_Vencimiento='01/01/1900';
            rowdata.Lote_Numero='';
        }
        if(rowid.Serie_SN!="S"){
            rowdata.Serie_Numero="";
        }

        filas_detalle.push(rowdata);
    });
    return filas_detalle;
}