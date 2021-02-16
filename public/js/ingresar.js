var url_getempresas = "empresas/lista";
var url_getpunto_venta = '/punto_venta/punto_venta/';
var url_getunidad_negocios = '/unidad_negocios/unidad_negocios/';
var url_getcentro_costos = '/cencos/centro_costos/';
var url_getalmacen_punto_venta = "centro_costos/centro_costos/";
var url_getalmacen_punto_venta = '/almacen/almacen_punto_venta/';
var grid="grid";
var codigo_punto_venta = "codigo_punto_venta";
var select_punto_venta = "select_punto_venta";

var jq_grid;
var jq_codigo_punto_venta;
var jq_select_punto_venta;

$(document).ready(function() {
    jq_grid = $("#"+grid);
    $("#titulo_ventana").text("Ingresar");
    jq_codigo_punto_venta = $("#"+codigo_punto_venta);
    jq_select_punto_venta = $("#"+select_punto_venta);
    cargar_login();
    $(document).on('change', '#select_punto_venta',function(codempresa) {
        var e = document.getElementById("select_punto_venta");
        var selected = e.options[e.selectedIndex].value;
        var values= e.options[e.selectedIndex].innerHTML;
       jq_codigo_punto_venta.val(selected);
        $('#nombre_punto_venta').val(values);

        rowData.push(
            {console: '01'}
        )
        cargar_almacen_punto_venta(rowData[0].console, selected);
    });
    $(document).on('change','#select_centro_costos', function() {
        var e = document.getElementById("select_centro_costos");
        var selected = e.options[e.selectedIndex].value;
        var values= e.options[e.selectedIndex].innerHTML;
        $('#codigo_centro_costos').val(selected);
        $('#nombre_centro_costos').val(values);
    });
    $(document).on('change', '#select_unidad_negocio', function() {
        var e = document.getElementById("select_unidad_negocio");
        var selected = e.options[e.selectedIndex].value;
        var values= e.options[e.selectedIndex].innerHTML;
        $('#codigo_unidad_negocio').val(selected);
        $('#nombre_unidad_negocio').val(values);
    });
});


function cargar_login(){
    jq_grid.jqGrid({
        url: url_getempresas,
        mtype: "POST",
        datatype: "json",
        colNames:['Código','Nombre'],
        colModel: [
            { 
                name: "ccod_empresa", 
                index:'ccod_empresa',
                key:true,
                align: 'center',
                cellsalign: 'center'
            },
            { 
                name: "crazonsocial", 
                width: 280
            }
        ],
        rownumbers: true,
        rowNum:100,
        autowidth: true,
        height: 120,
        rowList:[10,20,30,100],
        viewrecords: true,
        loadonce: true, 
        loadComplete: function() {
            var $grid = $("#"+grid);
            $grid.jqGrid('setSelection', "01", false);
            cargar_punto_venta("01");
            cargar_unidad_negocio("01");
            cargar_centro_costos("01");
            $('#codigo_empresa').val("01");
        },
        onSelectRow: function (rowid, status, e){
            console.log(rowid);
            var dato = $('#codigo_empresa').val(rowid);
            cargar_punto_venta(rowid);
            cargar_unidad_negocio(rowid);
            cargar_centro_costos(rowid);
            cargar_almacen_punto_venta(rowid);
        }
    });
}

function cargar_punto_venta(cod_empresa){
    var cargar_datos=true;
    var url_punto_venta = url_getpunto_venta+cod_empresa;
    $.ajax({
        url: url_punto_venta,
        success: function (lists){
            var codigo_predeterminado='';
            var nombre_predeterminado='';
            let select = $('#select_punto_venta');
            select.html('');
            lists.forEach(list=>{
                select.append('<option value="'+list.ccod_almacen+'">'+list.cnom_almacen+'</option>')
                if(list.ccod_almacen=='001'){
                    codigo_predeterminado=list.ccod_almacen;
                    nombre_predeterminado=list.cnom_almacen;
                }

                if (cargar_datos==true){
                   jq_codigo_punto_venta.val(list.ccod_almacen);
                    $('#nombre_punto_venta').val(list.cnom_almacen);
                    cargar_datos=false;
                }
            });
            if(codigo_predeterminado == '001'){
               jq_codigo_punto_venta.val(codigo_predeterminado);
                $('#nombre_punto_venta').val(nombre_predeterminado);
                $('#select_punto_venta').val(codigo_predeterminado);
                cargar_almacen_punto_venta(cod_empresa,codigo_predeterminado);
            }
        }
    });
}

function cargar_unidad_negocio(cod_empresa){
    var cargar_datos=true;
    var url_unidad_negocio= url_getunidad_negocios+cod_empresa;
    $.ajax({
        url: url_unidad_negocio,
        success: function (lists){
            let select = $('#select_unidad_negocio');
            select.html('');
            lists.forEach(list=>{
                select.append('<option value="'+list.erp_codune+'">'+list.erp_nomune+"</option>")
                if (cargar_datos==true){
                    $('#codigo_unidad_negocio').val(list.erp_codune);
                    $('#nombre_unidad_negocio').val(list.erp_nomune);
                    cargar_datos=false;
                }
            })
        }
    });
}

function cargar_centro_costos(cod_empresa){
    var cargar_datos=true;
    var url_centro_costos= url_getcentro_costos+cod_empresa;
    $.ajax({
        url: url_centro_costos,
        success: function (lists){
            let select = $('#select_centro_costos');
            select.html('');
            lists.forEach(list=>{
                select.append('<option value="'+list.ccod_cencos+'">'+list.cnom_cencos+"</option>")
                if (cargar_datos==true){
                    $('#codigo_centro_costos').val(list.ccod_cencos);
                    $('#nombre_centro_costos').val(list.cnom_cencos);
                    cargar_datos=false;
                }
            })
        }
    });
}

function cargar_almacen_punto_venta(cod_empresa ,codigo_punto_venta) {
    var url_almacen_punto_venta= url_getalmacen_punto_venta+cod_empresa+'/'+codigo_punto_venta;
    $.ajax({
        url: url_almacen_punto_venta,
        success: function(lists){
            lists.forEach(list => {
                //console.log(list.ccod_almacen);
            })
        }
    });
};
