
var modal_permisos="modal_permisos";
var lista_permisos="lista_permisos";

var jq_modal_permisos;
var jq_lista_permisos;

$(document).ready(function() {
    jq_modal_permisos = $("#"+modal_permisos);
    jq_lista_permisos = $("#"+lista_permisos);

    $("#modal_title_permisos").text("Permisos");

    $("#permisos").click(function () {
        jq_modal_permisos.modal("show");
        var rowData = $("#reporte-documentos").getRowData(id_fila_seleccionada)
        $("#tablas_permiso_codigo").val(rowData.Codigo);
        $("#tablas_permiso_nombre").val(rowData.Nombre);
        var data = {
            Codigo: rowData.Codigo
        }
        cargar_lista_permisos(data);
    });

    // $("#guardar_1").click(function () {
    //     guardar();
    // });
    $("#restablecer_1").click(function () {
        jq_modal_permisos.modal("show");
        var rowData = $("#reporte-documentos").getRowData(id_fila_seleccionada)
        $("#tablas_permiso_codigo").val(rowData.Codigo);
        $("#tablas_permiso_nombre").val(rowData.Nombre);
        var data = {
            Codigo: rowData.Codigo
        }
        restablecer_premisos(data);
    });
});

function cargar_lista_permisos(data) {

    jq_lista_permisos.jqGrid('GridUnload');

    jq_lista_permisos.jqGrid({
    type: 'POST',
    url:'/usuario/permisos_nivel/'+'1',
    postData: data,
    datatype: "json",
    height: 400,
    width:700,
    colNames:['Codigo','Modulo_Padre','Modulo','Acceso', 'Guardar', 'Modificar','Eliminar'],
    colModel:[
        {name:'Codigo',index:'Codigo', width:250, hidden: true},
        {name:'Modulo_Padre',index:'Modulo_Padre', width:250, hidden: true},
        {name:'Modulo',index:'Modulo', width:250},
        {name:'Acceso',index:'Acceso', width:80, align:"center", formatter:'checkbox',edittype:"checkbox", editoptions:{value:"S:N"}, formatoptions: { disabled: false }},
        {name:'Guardar',index:'Guardar', width:80, align:"center", formatter:'checkbox',editoptions:{value:"S:N"}, formatoptions: { disabled: false }},
        {name:'Modificar',index:'Modificar', width:80, align:"center", formatter:'checkbox',editoptions:{value:"S:N"},  formatoptions: { disabled: false }},
        {name:'Eliminar',index:'Eliminar', width:80, align:"center", formatter:'checkbox',editoptions:{value:"S:N"},  formatoptions: { disabled: false }}		
    ],
    rowNum:10,
    rowList:[10,20,30],
    pager: '#pager11',
    viewrecords: true,
    sortorder: "desc",
    cellEdit: true,
    multiselect: false,
    loadComplete:function(data){
        resize_jqgrid_porcentajes(jq_lista_permisos,60,82);
    },
    onCellSelect : function(rowid, iCol, value, iRow) {
        var cm = jq_lista_permisos.jqGrid("getGridParam", "colModel");
        if (cm[iCol].name != 'Modulo') {
            var Data_Nivel1 = jq_lista_permisos.getRowData();
            console.log(Data_Nivel1);
            $.ajax({
                type: 'POST',
                url:'/usuario/guardar_permisos',
                data: {
                    Data_Permisos: JSON.stringify(Data_Nivel1)
                },success: function (data) {
                    console.log(data);
                }
            })
        }
    },
    subGrid : true,
    subgridtype: 'json', 
    subGridRowExpanded: function(subgrid_id, row_id) {
        var subgrid_table_id, pager_id;
        subgrid_table_id = subgrid_id+"_t";
        pager_id = "p_"+subgrid_table_id;
        $("#"+subgrid_id).html("<table id='"+subgrid_table_id+"' class='scroll'></table><div id='"+pager_id+"' class='scroll'></div>");
        id_subgrid = subgrid_table_id;

        var rowData = jq_lista_permisos.getRowData(row_id);
        $("#"+subgrid_table_id).jqGrid({
            url: '/usuario/permisos_nivel/'+'2',
            mtype: "POST",
            postData:{
                Codigo: rowData.Codigo,
                Modulo: rowData.Modulo_Padre
            },
            datatype: "json",
            colNames:['Codigo','Modulo_Padre','Modulo','Acceso', 'Guardar', 'Modificar','Eliminar'],
            colModel:[
                {name:'Codigo',index:'Codigo', width:250, hidden: true},
                {name:'Modulo_Padre',index:'Modulo_Padre', width:250, hidden: true},
                {name:'Modulo',index:'Modulo', width:225},
                {name:'Acceso',index:'Acceso', width:70, align:"center", formatter:'checkbox', edittype:"checkbox" ,editoptions:{value:"S:N"}, formatoptions: { disabled: false }},
                {name:'Guardar',index:'Guardar', width:70, align:"center", formatter:'checkbox',editoptions:{value:"S:N"},  formatoptions: { disabled: false }},
                {name:'Modificar',index:'Modificar', width:70, align:"center", formatter:'checkbox',editoptions:{value:"S:N"},  formatoptions: { disabled: false }},
                {name:'Eliminar',index:'Eliminar', width:70, align:"center", formatter:'checkbox',editoptions:{value:"S:N"},  formatoptions: { disabled: false }}		
            ],
            rowNum:50,
            viewrecords: true,
            width: 1100,
            height: 100,
            loadonce: true,
            cellEdit: true,
            loadComplete:function(data){
            },
            onCellSelect : function(rowid, iCol, value, iRow) {
                var cm = $("#"+subgrid_table_id).jqGrid("getGridParam", "colModel");
                if (cm[iCol].name != 'Modulo') {
                    var Data_Nivel2 = $("#"+subgrid_table_id).getRowData();
                    console.log(Data_Nivel2);
                    $.ajax({
                        type: 'POST',
                        url:'/usuario/guardar_permisos',
                        data: {
                            Data_Permisos: JSON.stringify(Data_Nivel2)
                        },success: function (data) {
                            console.log(data);
                        }
                    })
                }
            },
            subGrid : true,
            subgridtype: 'json', 
            subGridRowExpanded: function(subgrid_id, row_id) {
                var subgrid_table_id_2, pager_id;
                subgrid_table_id_2 = subgrid_id+"_t";
                pager_id = "p_"+subgrid_table_id_2;
                $("#"+subgrid_id).html("<table id='"+subgrid_table_id_2+"' class='scroll'></table><div id='"+pager_id+"' class='scroll'></div>");
                id_subgrid = subgrid_table_id_2;

                //var rowData = $("#reporte-documentos").getRowData(id_fila_seleccionada)
                var rowData = $("#"+subgrid_table_id).getRowData(row_id);
                $("#"+subgrid_table_id_2).jqGrid({
                    url: '/usuario/permisos_nivel/'+'3',
                    mtype: "POST",
                    postData:{
                        Codigo: rowData.Codigo,
                        Modulo: rowData.Modulo_Padre
                    },
                    datatype: "json",
                    colNames:['Codigo','Modulo_Padre','Modulo','Acceso', 'Guardar', 'Modificar','Eliminar'],
                    colModel:[
                        {name:'Codigo',index:'Codigo', width:250, hidden: true},
                        {name:'Modulo_Padre',index:'Modulo_Padre', width:250, hidden: true},
                        {name:'Modulo',index:'Modulo', width:225},
                        {name:'Acceso',index:'Acceso', width:70, align:"center", formatter:'checkbox', edittype:"checkbox" ,editoptions:{value:"S:N"}, formatoptions: { disabled: false }},
                        {name:'Guardar',index:'Guardar', width:70, align:"center", formatter:'checkbox',editoptions:{value:"S:N"},  formatoptions: { disabled: false }},
                        {name:'Modificar',index:'Modificar', width:70, align:"center", formatter:'checkbox',editoptions:{value:"S:N"},  formatoptions: { disabled: false }},
                        {name:'Eliminar',index:'Eliminar', width:70, align:"center", formatter:'checkbox',editoptions:{value:"S:N"},  formatoptions: { disabled: false }}		
                    ],
                    rowNum:50,
                    viewrecords: true,
                    width: 1100,
                    height: 100,
                    loadonce: true,
                    cellEdit: true,
                    loadComplete:function(data){
                    },
                    onCellSelect : function(rowid, iCol, value, iRow) {
                        var cm = $("#"+subgrid_table_id_2).jqGrid("getGridParam", "colModel");
                        if (cm[iCol].name != 'Modulo') {
                            var Data_Nivel3 = $("#"+subgrid_table_id_2).getRowData();
                            $.ajax({
                                type: 'POST',
                                url:'/usuario/guardar_permisos',
                                data: {
                                    Data_Permisos: JSON.stringify(Data_Nivel3)
                                },success: function (data) {
                                    console.log(data);
                                }
                            })
                        }
                    },
                    subGrid : true,
                    subgridtype: 'json', 
                    subGridRowExpanded: function(subgrid_id, row_id) {
                        var subgrid_table_id_3, pager_id;
                        subgrid_table_id_3 = subgrid_id+"_t";
                        pager_id = "p_"+subgrid_table_id_3;
                        $("#"+subgrid_id).html("<table id='"+subgrid_table_id_3+"' class='scroll'></table><div id='"+pager_id+"' class='scroll'></div>");
                        id_subgrid = subgrid_table_id_3;
                        
                        //var rowData = $("#reporte-documentos").getRowData(id_fila_seleccionada)
                        var rowData = $("#"+subgrid_table_id_2).getRowData(row_id);
                        $("#"+subgrid_table_id_3).jqGrid({
                            url: '/usuario/permisos_nivel/'+'4',
                            mtype: "POST",
                            postData:{
                                Codigo: rowData.Codigo,
                                Modulo: rowData.Modulo_Padre
                            },
                            datatype: "json",
                            colNames:['Codigo','Modulo_Padre','Modulo','Acceso', 'Guardar', 'Modificar','Eliminar'],
                            colModel:[
                                {name:'Codigo',index:'Codigo', width:250, hidden: true},
                                {name:'Modulo_Padre',index:'Modulo_Padre', width:250, hidden: true},
                                {name:'Modulo',index:'Modulo', width:225},
                                {name:'Acceso',index:'Acceso', width:70, align:"center", formatter:'checkbox', edittype:"checkbox" ,editoptions:{value:"S:N"}, formatoptions: { disabled: false }},
                                {name:'Guardar',index:'Guardar', width:70, align:"center", formatter:'checkbox',editoptions:{value:"S:N"},  formatoptions: { disabled: false }},
                                {name:'Modificar',index:'Modificar', width:70, align:"center", formatter:'checkbox',editoptions:{value:"S:N"},  formatoptions: { disabled: false }},
                                {name:'Eliminar',index:'Eliminar', width:70, align:"center", formatter:'checkbox',editoptions:{value:"S:N"},  formatoptions: { disabled: false }}		
                            ],
                            rowNum:50,
                            viewrecords: true,
                            width: 1100,
                            height: 100,
                            loadonce: true,
                            cellEdit: true,
                            loadComplete:function(data){
                            },
                            onCellSelect : function(rowid, iCol, value, iRow) {
                                var cm = $("#"+subgrid_table_id_3).jqGrid("getGridParam", "colModel");
                                if (cm[iCol].name != 'Modulo') {
                                    var Data_Nivel4 = $("#"+subgrid_table_id_3).getRowData();
                                    $.ajax({
                                        type: 'POST',
                                        url:'/usuario/guardar_permisos',
                                        data: {
                                            Data_Permisos: JSON.stringify(Data_Nivel4)
                                        },success: function (data) {
                                            console.log(data);
                                        }
                                    })
                                }
                            }
                        })
                      }
                })
              }
            
        })
      }
    });
    jq_lista_permisos.jqGrid('navGrid','#pager11',{add:false,edit:false,del:false});
}

function restablecer_premisos(data) {
    $.ajax({
        type: 'POST',
        url: '/usuario/restablecer_permisos',
        data: data,
        success: function (result) {
            if (result.estado == true) {
                cargar_lista_permisos(data);
            }
        }
    });
}

$("#todos").click(function () {
    var rowData = $("#reporte-documentos").getRowData(id_fila_seleccionada)
    var data = {
        Codigo: rowData.Codigo
    }
    if ($("#todos").prop("checked")) {
        $.ajax({
            type: 'POST',
            url: '/usuario/todos_permisos',
            data: data,
            success: function (result) {
                console.log(result);
                if (result.estado == true) {
                    cargar_lista_permisos(data);
                    $("#todos").prop("checked", false);
                }
            }
        })
    }else{
        console.log('falso');
    }
});