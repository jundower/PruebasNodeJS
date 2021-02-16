var url_contabilidad_detalle= '/contabilidad/detalle';
var jq_grid_detalle_contable;
var col_Names=[];
var col_Model=[];
var fila_vacia_grid_detalle_contable=[];
var lista_cencos="";
var lista_ot="";
var lista_unidad_negocio="";
var lista_tipo_documento="";
var lista_tipo_documento_2 = "";
var lista_moneda="";
var lista_subvoucher="";
var lista_tipo_origen="";
var lista_vendedor="";
var lista_forma_pago="";
var rowid_dblclick_detalle_contable;
var row_editing_detalle_contable;
var rowid_editing_detalle_contable;
var col_editing_detalle_contable;
var rowid_selected_detalle_contable;
var iRow_dblclick_detalle_contable;
var iCol_dblclick_detalle_contable;
var selected_cell_detalle_contable;

$(document).ready(function() {
    jq_grid_detalle_contable = $("#grid_detalle_contable");
    cargar_configuracion_detalle_contable();
});

$(window).keydown(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.code);
    switch (keycode){
        case 113:
            event.preventDefault();
        break;
        case 118:
            event.preventDefault();
            var jq_grid=jq_grid_detalle_contable;
            var newFila = deepCopy(fila_vacia_grid_detalle_contable)
            var rowId = jq_grid.jqGrid ("getGridParam", "selrow");
            if(!isEmptyOrWhiteSpaces(rowId))
                jq_grid.jqGrid('addRowData',undefined,newFila,"after",rowId );
            else
                jq_grid.jqGrid('addRowData',undefined,newFila );
        break;
        case 119:
            event.preventDefault();
            var jq_grid=jq_grid_detalle_contable;
            var dataIds = jq_grid.getDataIDs();
            var rowId = jq_grid.jqGrid ("getGridParam", "selrow");
            if(dataIds.length>0 && !isEmptyOrWhiteSpaces(rowId)){
                var index = dataIds.indexOf(rowId);
                index = index == 0 ?  1 : index -1;
                rowid_selected_detalle_contable = dataIds[index];

                jq_grid.jqGrid ("delRowData", rowId);
                jq_grid.setSelection(rowid_selected_detalle_contable,true);
            }
        break;
    }
});

function cargar_configuracion_detalle_contable(){
    $.ajax({
        type: 'POST',
        url: "/configurar_tablas/generar",
        data:{
            modulo: 'detalle_contable'
        },
        success: function (result){
            cargar_jq_grid_detalle_contable(result);
        }
    });
}

async function cargar_jq_grid_detalle_contable(configuraciones){

    var configuracion_width= configuraciones[0];
    var configuracion_visibilidad= configuraciones[1];
    var configuracion_posicion= configuraciones[2];
    var configuracion_nueva_posicion= configuraciones[3];
    var configuracion_formato= configuraciones[4];
    var configuracion_editable= configuraciones[5];

    //El Pivot solo acepta para numeros, por el max()
    //1: text | 2:number | 3:currency

    var jq_grid=jq_grid_detalle_contable;

    await $.ajax({
        type: 'POST',
        url: '/cencos/lista/',
        success: function (result){
            result.forEach(element => {
                lista_cencos +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
            });
        }
    });
    await $.ajax({
        type: 'POST',
        url: '/orden_trabajo/lista/',
        success: function (result){
            result.forEach(element => {
                lista_ot +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
            });
        }
    });
    await $.ajax({
        type: 'POST',
        url: '/unidad_negocios/lista/',
        success: function (result){
            result.forEach(element => {
                lista_unidad_negocio +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
            });
        }
    });
    await $.ajax({
        type: 'POST',
        url: '/tipo_documento/lista/Todos',
        success: function (result){
            result.forEach(element => {
                lista_tipo_documento +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
            });
        }
    });
    await $.ajax({
        type: 'POST',
        url: '/tipo_documento/lista/Todos',
        success: function (result){
            result.forEach(element => {
                lista_tipo_documento_2 +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
            });
        }
    });
    // lista_moneda +=  '<option value ="S/">S/</option>'
    // lista_moneda +=  '<option value ="$">$</option>'

    await $.ajax({
        type: 'POST',
        url: '/subvoucher/lista/',
        success: function (result){
            result.forEach(element => {
                lista_subvoucher +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
            });
        }
    });
    lista_tipo_origen +=  '<option value ="F">Pago</option>'
    lista_tipo_origen +=  '<option value ="I">Provisión</option>'
    lista_tipo_origen +=  '<option value ="N">Ninguno</option>'

    await $.ajax({
        type: 'POST',
        url: '/vendedor/lista/',
        success: function (result){
            result.forEach(element => {
                lista_vendedor +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
            });
        }
    });
    await $.ajax({
        type: 'POST',
        url: '/forma_pago/lista/',
        success: function (result){
            result.forEach(element => {
                lista_forma_pago +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
            });
        }
    });

    for(var i=3 ; i<Object.keys(configuracion_visibilidad).length; i++)
    {
        var col_nombre=Object.keys(configuracion_visibilidad)[i];
        col_Names.push(col_nombre);

        var templates={0:textTemplate,1:numberTemplate,2:currencyTemplate,3:realTemplate,4:dateTemplate,5:cantidadTemplate};
        var templates_default={0:'',1:'0',2:'0',3:'0',4:'',5:'0'};

        var codigo_formato=configuracion_formato[Object.keys(configuracion_formato)[i]];
        fila_vacia_grid_detalle_contable[col_nombre] = templates_default[codigo_formato];

        var col_Model_fila=
        {
            name:col_nombre,
            index:col_nombre,
            width:configuracion_width[col_nombre],
            editable:((configuracion_editable[Object.keys(configuracion_editable)[i]]=='1') ? true:false),
            hidden:((configuracion_visibilidad[col_nombre]=='1') ? true:false),
            template:templates[codigo_formato],
        }

        switch (codigo_formato){
            case 1:
                col_Model_fila. editoptions = {
                    dataInit: function(element) {
                        $(element).keyup(function(event) {
                            calcularMeMnDetalle();
                        });
                    }
                }
            break;
        }
        switch (col_nombre){
            case 'CenCos':
                col_Model_fila.formatter = lista_select_cencos;
            break;
            case 'Ot':
                col_Model_fila.formatter = lista_select_ot;
            break;
            case 'Unidad_Negocio':
                col_Model_fila.formatter = lista_select_unidad_negocio;
            break;
            case 'Tipo_Referencia':
                col_Model_fila.formatter = lista_select_tipo_documento;
            break;
            case 'Tipo2':
                col_Model_fila.formatter = lista_select_tipo_documento2;
            break;
            case 'Tipo_Origen':
                col_Model_fila.formatter = lista_select_tipo_origen;
            break;
            case 'Vendedor':
                col_Model_fila.formatter = lista_select_vendedor;
            break;
            case 'Vendedor2':
                col_Model_fila.formatter = lista_select_vendedor2;
            break;
            case 'Forma_Pago':
                col_Model_fila.formatter = lista_select_forma_pago;
            break;
            case 'Cuenta':
                col_Model_fila.editoptions = {dataEvents: [
                    {
                        type: 'keyup',
                        fn: function(e) {
                            if(e.keyCode==115){
                                open_modal_mantenimientos_grid($(this).prop("name"),$(this).prop("id"));
                            }else{
                                $.ajax({
                                    type: 'POST',
                                    url: '/plan_contable/lista/',
                                    data: {
                                        cuenta: $(this).val(),
                                    },
                                    success: function (datos) {
                                        if(datos.length>0) rellenar_datos_plan_contable_detalle(datos[0],rowid_editing_detalle_contable);
                                    }
                                });
                            }
                        }
                    },
                    {
                        type: 'paste',
                        fn: function(e) {
                            var cuenta = e.originalEvent.clipboardData.getData('text');
                            $.ajax({
                                type: 'POST',
                                url: '/plan_contable/lista/',
                                data: {
                                    cuenta: cuenta,
                                },
                                success: function (datos) {
                                    if(datos.length>0) rellenar_datos_plan_contable_detalle(datos[0],rowid_editing_detalle_contable);
                                }
                            });
                        }
                    }
                ]};
            break;
            case 'Codigo_Anexo':
                col_Model_fila.editoptions = {dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            if(e.keyCode==115){
                                open_modal_mantenimientos_grid($(this).prop("name"),$(this).prop("id"));
                            }
                            else{
                                $.ajax({
                                    type: 'POST',
                                    url: '/anexos/datos/',
                                    data: {
                                        codigo: $(this).val(),
                                        tipo: '12',
                                    },
                                    success: function (datos) {
                                        if(datos.length>0) rellenar_datos_anexo_detalle(datos[0],rowid_editing_detalle_contable);
                                    }
                                });
                            }
                        }
                    }
                ]};
            break;
            case 'Fecha_Referencia':
                col_Model_fila.editoptions = {
                    dataInit:function(elem){
                        var id_selected = jq_grid.jqGrid('getGridParam', 'selrow');
                        $(elem).datepicker({
                            dateFormat:'yy/mm/dd',
                            changeYear: true,
                            changeMonth: true,
                            showButtonPanel: true,
                            closeText: "Cerrar",
                            currentText: "Hoy",
                            monthNamesShort: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre" ],
                            dayNamesMin : [ "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
                            onSelect: function(value, elem){
                                jq_grid.jqGrid('setRowData', id_selected, {
                                    Fecha_Vencimiento : new Date(elem.selectedYear,elem.selectedMonth,elem.selectedDay),
                                });
                            }
                        });
                        if ($(elem).val().length === 0) {
                            $(elem).datepicker("setDate", new Date(1900, 0, 1));
                        }
                    }
                };
            break;
        }
        col_Model.push(col_Model_fila);
    }


    jq_grid.jqGrid({
        url: url_contabilidad_detalle,
        datatype: "json",
        mtype: "POST",
        colNames:col_Names,
        colModel:col_Model,
        loadonce: true,
        // cellEdit: true,
        viewrecords: true,
        rownumbers: true,
        autowidth:true,
        shrinkToFit:false,
        hidegrid:false,
        forceFit:true,
        height: 250,
        Width: 250,
        caption:"&nbsp;",
        footerrow : true,
        pager: '#grid_detalle_contable_pager',
        // userDataOnFooter : true,
        // altRows : true,
        beforeSelectRow(rowid, e){
        },
        onSelectRow: function (rowid, status, e){
        },
        beforeEditCell: function (rowid,cellname,value,iRow,iCol) {
            // $("#"+iRow+'_'+cellname)[0].select();
            // jq_grid.jqGrid('setCell',rowid,cellname,'',{color: value==0 ? 'white' : 'black'});
            
        },
        afterEditCell: function (rowid,cellname,value,iRow,iCol) {
            $("#"+iRow+'_'+cellname)[0].select();
            rowid_editing_detalle_contable = rowid
            // $("#"+iRow+'_'+cellname)[0].select();
            // jq_grid.jqGrid('setCell',rowid,cellname,'',{color: value==0 ? 'white' : 'black'});
        },
        beforeSaveCell: function (rowid,cellname,value,iRow,iCol) {
            // switch(cellname){
            //     case "Cuenta":

            //         $.ajax({
            //             type: 'POST',
            //             url: "/plan_contable/datos",
            //             data:{
            //                 Codigo: value
            //             },
            //             success: function (result){
            //                 console.log(result);
            //             }
            //         });

            //         break;
            //     case "Nombre":
            //         jq_grid.jqGrid('setRowData', rowid, {Nombre_presentacion: value});
            //         break;
            //     case "Cantidad":
            //         jq_grid.jqGrid('setRowData', rowid, {Cantidad_presentacion: value});
            //         break;
            // }
            // recalcular_montos_ventas();
            if (iRow == 1 && (cellname == "Debe" || cellname == "Haber")) {
                jq_importe.val(value);
            };
        },
        afterRestoreCell: function (rowid, value, iRow, iCol) {

            // var cm = jq_grid.jqGrid("getGridParam", "colModel");
            // var cellname = cm[iCol];

            // onCancelRowid=rowid;
            // onCancelValue=value;
            // onCanceliRow=iRow;
            // onCanceliCol=iCol;
            // onCancelCellName=cellname.name;
            // recalcular_montos_ventas();
        },
        loadComplete:function(data){
            // cargar_filas_detalle_ventas();
            // resize_jqgrid_comparative_height(jq_grid, 100, $("#myTabContent").height() * 1 + 220);
            // recalcular_montos_ventas();
            // calcular_totales_footer();
            if(estado=="guardar") jq_subvoucher.trigger("change");
            var ids = jq_grid.getDataIDs()
            if(ids){
                ids.forEach(function (element, index, array) {
                    var fila = jq_grid.getRowData(element);
                    $("#lista_select_cencos_"+element).val(fila.Codigo_CenCos);
                    $("#lista_select_ot_"+element).val(fila.Codigo_Ot);
                    $("#lista_select_unidad_negocio_"+element).val(fila.Codigo_Unidad_Negocio);
                    $("#lista_select_tipo_documento_"+element).val(fila.Codigo_Tipo_Referencia);
                    $("#lista_select_tipo_documento2_"+element).val(fila.Codigo_Tipo2);
                    $("#lista_select_subvoucher_"+element).val(fila.Codigo_SubVoucher_Referencia);
                    $("#lista_select_tipo_origen_"+element).val(fila.Codigo_Tipo_Origen);
                    $("#lista_select_vendedor_"+element).val(fila.Codigo_Vendedor);
                    $("#lista_select_vendedor2_"+element).val(fila.Codigo_Vendedor2);
                    $("#lista_select_forma_pago_"+element).val(fila.Codigo_Forma_Pago);
                });
            }
            if(modulo=="caja_banco") jq_codigo_caja_banco.trigger("change");
            calcular_totales_footer();
            
            resize_jqgrid_restar(jq_grid,$("#myTabContent").height() + $("#myTab").height() + $("#nav_title_bar").height() + 100,$(window).width() - $("#myTabContent").width() );
            
            setColorsByNumber();
        },
        onCellSelect : function(rowid, iCol, cellcontent, e) { // use this event to capture edited cellID
            var iRow = jq_grid.jqGrid('getInd',rowid)
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            var rowdata = jq_grid.getRowData(rowid);
            //Falta configurar para cuando no son provisiones
            //El debe y haber son configurables independiente del D_H

            if(((cm[iCol].name !="Codigo_Anexo" && cm[iCol].name !="Debe"  && cm[iCol].name !="Haber" ) && cm[iCol].editable) || (cm[iCol].name =="Codigo_Anexo" && rowdata.Tipo_Anexo!="00") || (cm[iCol].name =="Debe" && rowdata.D_H=="D") || (cm[iCol].name =="Haber" && rowdata.D_H=="H")){
                jq_grid.resetSelection();
                row_editing_detalle_contable = iRow;
                col_editing_detalle_contable = iCol;
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: true,
                });
            }else{
                jq_grid.jqGrid('saveCell',row_editing_detalle_contable,col_editing_detalle_contable);
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: false,
                });
            }
            selected_cell_detalle_contable = iCol;
            rowid_selected_detalle_contable=rowid;
        },
        onSelectCell : function(rowid, cellname, value, iRow, iCol) { // use this event to capture edited cellID
            // row_editing_detalle_contable = iRow;
            // selected_Id_Cell_detalle_ventas = rowid;
            // resetSelectionDetalleProductos();
            selected_cell_detalle_contable = iCol; // save the cellId to a variable
            rowid_selected_detalle_contable = rowid;
        },
        ondblClickRow: function(rowid,iRow,iCol,e){
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            rowid_dblclick_detalle_contable= rowid;
            iRow_dblclick_detalle_contable= iRow;
            iCol_dblclick_detalle_contable= iCol;
            var rowdata = jq_grid.getRowData(rowid);
            switch (cm[iCol].name){
                case "CenCos":
                case "Ot":
                case "Unidad_Negocio":
                case "Tipo_Referencia":
                case "Tipo2":
                case "SubVoucher_Referencia":
                case "Vendedor":
                case "Vendedor2":
                case "Forma_Pago":
                    var id_focused=$("*:focus").attr("id");
                    var tabla_focused=$("*:focus").attr("tabla");
                    modal_open(tabla_focused,id_focused);
                break;
                case "Cuenta":
                    open_modal_mantenimientos_grid(cm[iCol].name,iRow+'_Cuenta');
                break;
                case "Codigo_Anexo":
                    if(rowdata.Tipo_Anexo!="00"){
                        lista_mantenimientos_tipo_anexo = rowdata.Tipo_Anexo;
                        open_modal_mantenimientos_grid(cm[iCol].name,iRow+'_Codigo_Anexo');
                    }
                break;
            }
            
        },
    });

    jq_grid.jqGrid('bindKeys', {
        "onEnter":function( rowid ) {
            console.log($("*:focus").attr("id"));
        }
    } );
}

function calcularMeMnDetalle(){

    var jq_grid=jq_grid_detalle_contable;

    var dataIDs = jq_grid.getDataIDs();

    for(i = 0; i < dataIDs.length; i++)
    {
        var rowid = dataIDs[i];
        var rowdata = jq_grid.getRowData(rowid);
        if(rowdata.Cuenta!=""){
            var calculos = calcular_detalle_contabilidad({
                Debe: rowdata.Debe,
                Haber: rowdata.Haber,
                Tc: rowdata.Tipo_Cambio_Referencia,
                Moneda: rowdata.Moneda_Referencia,
            });

            // console.log(fecha.getFullYear());
            jq_grid.jqGrid('setRowData', rowid, {
                MnDebe : calculos.Debe_Mn,
                MnHaber : calculos.Haber_Mn,
                MeDebe : calculos.Debe_Me,
                MeHaber : calculos.Haber_Me,
            });
        }

    }
    calcular_totales_footer();
}

function setColorsByNumber(){
    
    var jq_grid=jq_grid_detalle_contable;

    var dataIDs = jq_grid.getDataIDs(); 

    for(i = 0; i < dataIDs.length; i++)
    {
        var rowid = dataIDs[i];
        var rowdata = jq_grid.getRowData(rowid);
        jq_grid.jqGrid('setCell',rowid,'Debe','',{color: rowdata.Debe==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'Haber','',{color: rowdata.Haber==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'MnDebe','',{color: rowdata.MnDebe==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'MnHaber','',{color: rowdata.MnHaber==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'MeDebe','',{color: rowdata.MeDebe==0 ? 'white' : 'black'});
        jq_grid.jqGrid('setCell',rowid,'MeHaber','',{color: rowdata.MeHaber==0 ? 'white' : 'black'});
    }

}

function calcular_totales_footer(){

    var jq_grid=jq_grid_detalle_contable;
    var colSum = jq_grid.jqGrid('getCol', 'Debe', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Debe': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Haber', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Haber': colSum });
    colSum = jq_grid.jqGrid('getCol', 'MnDebe', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'MnDebe': colSum });
    colSum = jq_grid.jqGrid('getCol', 'MnHaber', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'MnHaber': colSum });
    colSum = jq_grid.jqGrid('getCol', 'MeDebe', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'MeDebe': colSum });
    colSum = jq_grid.jqGrid('getCol', 'MeHaber', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'MeHaber': colSum });
}

function lista_select_cencos(cellvalue, options, rowObject){
    var newlista_cencos = lista_cencos.replace('value ="'+cellvalue+'"','value ="'+cellvalue+'" selected');
    return '<select id="lista_select_cencos_'+options.rowId+'" class="form-control form-control-sm c_mantenimientos select-sm" tabla="centro_costos">'+newlista_cencos+'</select>'
}
function lista_select_ot(cellvalue, options, rowObject){
    var newlista_ot = lista_ot.replace('value ="'+cellvalue+'"','value ="'+cellvalue+'" selected');
    return '<select id="lista_select_ot_'+options.rowId+'" class="form-control form-control-sm c_mantenimientos select-sm" tabla="orden_trabajo">'+newlista_ot+'</select>'
}
function lista_select_unidad_negocio(cellvalue, options, rowObject){
    var newlista_unidad_negocio = lista_unidad_negocio.replace('value ="'+cellvalue+'"','value ="'+cellvalue+'" selected');
    return '<select id="lista_select_unidad_negocio_'+options.rowId+'" class="form-control form-control-sm c_mantenimientos select-sm" tabla="unidad_negocio">'+newlista_unidad_negocio+'</select>'
}
function lista_select_tipo_documento(cellvalue, options, rowObject){
    var newlista_tipo_documento = lista_tipo_documento.replace('value ="'+cellvalue+'"','value ="'+cellvalue+'" selected');
    return '<select id="lista_select_tipo_documento_'+options.rowId+'" class="form-control form-control-sm c_mantenimientos select-sm" tabla="tipo_documento">'+newlista_tipo_documento+'</select>'
}
function lista_select_tipo_documento2(cellvalue, options, rowObject){
    var newlista_tipo_documento_2 = lista_tipo_documento_2.replace('value ="'+cellvalue+'"','value ="'+cellvalue+'" selected');
    return '<select id="lista_select_tipo_documento2_'+options.rowId+'" class="form-control form-control-sm c_mantenimientos select-sm" tabla="tipo_documento">'+newlista_tipo_documento_2+'</select>'
}
function lista_select_moneda(cellvalue, options, rowObject){
    return '<select id="lista_select_moneda_'+options.rowId+'" class="form-control form-control-sm c_mantenimientos select-sm" tabla="moneda">'+lista_moneda+'</select>'
}
function lista_select_subvoucher(cellvalue, options, rowObject){
    return '<select id="lista_select_subvoucher_'+options.rowId+'" class="form-control form-control-sm c_mantenimientos select-sm" tabla="subvoucher">'+lista_subvoucher+'</select>'
}
function lista_select_tipo_origen(cellvalue, options, rowObject){
    var newlista_tipo_origen = lista_tipo_origen.replace('value ="'+cellvalue+'"','value ="'+cellvalue+'" selected');
    return '<select id="lista_select_tipo_origen_'+options.rowId+'" class="form-control form-control-sm c_mantenimientos select-sm" tabla="tipo_origen">'+newlista_tipo_origen+'</select>'
}
function lista_select_vendedor(cellvalue, options, rowObject){
    var newlista_vendedor = lista_vendedor.replace('value ="'+cellvalue+'"','value ="'+cellvalue+'" selected');
    return '<select id="lista_select_vendedor_'+options.rowId+'" class="form-control form-control-sm c_mantenimientos select-sm" tabla="vendedor">'+newlista_vendedor+'</select>'
}
function lista_select_vendedor2(cellvalue, options, rowObject){
    var newlista_vendedor = lista_vendedor.replace('value ="'+cellvalue+'"','value ="'+cellvalue+'" selected');
    return '<select id="lista_select_vendedor2_'+options.rowId+'" class="form-control form-control-sm c_mantenimientos select-sm" tabla="vendedor">'+newlista_vendedor+'</select>'
}
function lista_select_forma_pago(cellvalue, options, rowObject){
    var newlista_forma_pago = lista_forma_pago.replace('value ="'+cellvalue+'"','value ="'+cellvalue+'" selected');
    return '<select id="lista_select_forma_pago_'+options.rowId+'" class="form-control form-control-sm c_mantenimientos select-sm" tabla="forma_pago_lista">'+newlista_forma_pago+'</select>'
}
function open_modal_mantenimientos_grid(name, id){
    switch (name){
        case "Cuenta":
            var id_focused=id;
            var tabla_focused="detalle_contable";
            lista_mantenimientos_nivel_plan_contable = 5;
            modal_open(tabla_focused,id_focused);
        break;
        case "Codigo_Anexo":
            var id_focused=id;
            var tabla_focused="codigo_anexo";
            modal_open(tabla_focused,id_focused);
        break;
    }
}
function rellenar_plan_contable_fila(data){
    var jq_grid = jq_grid_detalle_contable;
    var rowId=rowid_dblclick_detalle_contable;
    jq_grid.jqGrid('saveCell',iRow_dblclick_detalle_contable,iCol_dblclick_detalle_contable);
    // console.log(data);
    // console.log(iRow_dblclick_detalle_contable)
    // console.log(iCol_dblclick_detalle_contable)
    rellenar_datos_plan_contable_detalle(data, rowId);
}
function rellenar_codigo_anexo_detalle(data){
    var jq_grid = jq_grid_detalle_contable;
    var rowId=rowid_dblclick_detalle_contable;

    jq_grid.jqGrid('saveCell',row_editing_detalle_contable,col_editing_detalle_contable);
    rellenar_datos_anexo_detalle(data, rowId);
    listar_documentos_pendientes_contable(data.Tipo_Auxiliar, data.Numero_Documento,rowId,"detalle");
}
function rellenar_datos_anexo_detalle(data,rowId){
    var jq_grid = jq_grid_detalle_contable;
    jq_grid.jqGrid('setCell',rowId,"Codigo_Anexo",data.Codigo);
    jq_grid.jqGrid('setCell',rowId,"Nombre_Anexo",data.Nombre);
}

function rellenar_datos_plan_contable_detalle(data,rowId){
    var jq_grid = jq_grid_detalle_contable;
    var Codigo_Anexo=jq_tipo_anexo.val()==data.Tipo_Auxiliar? jq_codigo_anexo.val(): " ";
    var Nombre_Anexo=jq_tipo_anexo.val()==data.Tipo_Auxiliar? jq_nombre_anexo.val(): " ";
    jq_grid.jqGrid('setCell',rowId,"Es_Transferencia",'N');
    jq_grid.jqGrid('setCell',rowId,"Nombre_Cuenta",data.Nombre);
    jq_grid.jqGrid('setCell',rowId,"D_H",data.D_H);
    jq_grid.jqGrid('setCell',rowId,"Si_Transferencia",data.Si_Transferencia);
    jq_grid.jqGrid('setCell',rowId,"Si_CenCos",data.Si_CenCos);
    jq_grid.jqGrid('setCell',rowId,"Si_Ot",data.Si_Ot);
    jq_grid.jqGrid('setCell',rowId,"Si_Diferencia",data.Si_Genera_Diferencia);
    jq_grid.jqGrid('setCell',rowId,"Si_Presupuesto",data.Si_Presupuesto);
    jq_grid.jqGrid('setCell',rowId,"Tipo_Anexo",data.Tipo_Auxiliar);
    jq_grid.jqGrid('setCell',rowId,"Codigo_Anexo",data.Tipo_Auxiliar=="00"?" ":Codigo_Anexo);
    jq_grid.jqGrid('setCell',rowId,"Nombre_Anexo",data.Tipo_Auxiliar=="00"?" ":Nombre_Anexo);
    jq_grid.jqGrid('setCell',rowId,"Debe","0");
    jq_grid.jqGrid('setCell',rowId,"Haber","0");
    $("#lista_select_cencos_"+rowId).prop("disabled",data.Si_CenCos=="N");
    // $("#lista_select_ot_"+rowId).prop("disabled",data.Si_Ot=="N"); //Falta retirarlo de mantenimientos del plan contable, no debe ser dinamico, siempre dbe ser editable
    // lista_mantenimientos_tipo_anexo = data.Tipo_Auxiliar;
    //Elementos editables desde la cabecera, o sea, mientras se edita la cabecera, se debe editar el detalle, pero no viceversa
    //Glosa, Fecha, Fecha de vencimiento, Tipo, Serie y Numero de referencia y de la referencia de referencia (2)
    //La glosa es reemplazada por la cabecera,  solo cuando se está editando la glosa de la cabecera
    
    // jq_grid.jqGrid('setCell',rowid,'Debe','',{color: data.Debe==0 ? 'white' : 'black'});
    // jq_grid.jqGrid('setCell',rowid,'Haber','',{color: data.Haber==0 ? 'white' : 'black'});
    // jq_grid.jqGrid('setCell',rowid,'MnDebe','',{color: data.MnDebe==0 ? 'white' : 'black'});
    // jq_grid.jqGrid('setCell',rowid,'MnHaber','',{color: data.MnHaber==0 ? 'white' : 'black'});
    // jq_grid.jqGrid('setCell',rowid,'MeDebe','',{color: data.MeDebe==0 ? 'white' : 'black'});
    // jq_grid.jqGrid('setCell',rowid,'MeHaber','',{color: data.MeHaber==0 ? 'white' : 'black'});

    calcularMeMnDetalle();
}

async function cargar_cuentas_subvoucher(subvoucher, moneda){

    var jq_grid = jq_grid_detalle_contable;
    var dataIDs = jq_grid.getDataIDs();

    for(i = 0; i < dataIDs.length; i++)
    {
        jq_grid.jqGrid ("delRowData", dataIDs[i]);
    }

    await $.ajax({
        type: 'POST',
        url: '/subvoucher/detalle/',
        data: {
            subvoucher: subvoucher,
            moneda: moneda
        },
        success: function (datos) {
            datos.forEach((element, index) => {
                var newFila = deepCopy(fila_vacia_grid_detalle_contable);
                if(element.Tipo_Auxiliar=="00"){
                    newFila.Tipo_Origen='N';
                }else{
                    newFila.Tipo_Origen='I';
                }
                newFila.Cuenta = element.Cuenta;
                jq_grid.jqGrid('addRowData',undefined,newFila );
                dataIDs = jq_grid.getDataIDs();
                rellenar_datos_plan_contable_detalle(datos[index],dataIDs[index]);
            });
            jqgridDetalleContableLoadComplete();
        }
    });
}

//Guardar historial de modificaciones, creacion y eliminacion de los documentos


function detalle_contable_actualizar_editables(){
 
    var jq_grid=jq_grid_detalle_contable;

    var dataIDs = jq_grid.getDataIDs();

    for(i = 0; i < dataIDs.length; i++)
    {
        var data = jq_grid.getRowData(dataIDs[i]);
        $("#lista_select_cencos_"+dataIDs[i]).prop("disabled",data.Si_CenCos=="N");
    }   
}