var url_getempresas = "/auth/empresas/lista";
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

var codigo_empresa_seleccionado="";

$(document).ready(function() {
    jq_grid = $("#"+grid);
    $("#titulo_ventana").text("Ingresar");
    
    jq_codigo_punto_venta = $("#"+codigo_punto_venta);
    jq_select_punto_venta = $("#"+select_punto_venta);
    cargar_login();
    // cargar_tipo_cambio();
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
    $("#registrar_tc").click(function(){
        var fecha =  getShortDateFormat(new Date(),"mm/dd/yyyy");
        $.ajax({
            type: "POST",
            url: "/tipo_cambio/registrar_tc",
            data: {
                codigo_empresa: codigo_empresa_seleccionado,
                fecha: fecha,
                venta: $("#tc_venta").val(),
                compra: $("#tc_compra").val()
            },
            success: function (e){
                console.log(e);
                $("#lbl_mensaje").text(e.mensaje);
                if(e.mensaje=="Registrado"){
                    $("#ingresar").prop("disabled",false);
                    $("#modal_tc").modal("hide");
                }
            }
        });
    })
});

$(document).on("keydown", function(e) {
    var keycode = (e.keyCode ? e.keyCode : e.code);
    if(keycode == '13'){ //13 enter
        $("#ingresar").click();
    }
});

function cargar_login(){
    jq_grid.jqGrid({
        url: url_getempresas,
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: $("#ruc_empresa").val()
        },
        colNames:['Código','RUC','Nombre'],
        colModel: [
            { 
                name: "ccod_empresa", 
                key:true,
                align: 'center',
                cellsalign: 'center',
                hidden: true
            },
            { 
                name: "cnum_ruc", 
                align: 'center',
                cellsalign: 'center',
                width: 100
            },
            { 
                name: "crazonsocial",
                width: 300
            }
        ],
        rownumbers: true,
        rowNum:100,
        height: 120,
        rowList:[10,20,30,100],
        viewrecords: true,
        loadonce: true, 
        loadComplete: function() {
            var $grid = $("#"+grid);
            var id_empresa = $grid.getDataIDs()[0];
            $grid.jqGrid('setSelection', id_empresa, false);
            codigo_empresa_seleccionado = id_empresa;
            validar_tipo_cambio(id_empresa);
            cargar_punto_venta(id_empresa);
            cargar_unidad_negocio(id_empresa);
            cargar_centro_costos(id_empresa);
            $('#codigo_empresa').val(id_empresa);
        },
        onSelectRow: function (rowid, status, e){
            var dato = $('#codigo_empresa').val(rowid);
            codigo_empresa_seleccionado = rowid;
            validar_tipo_cambio(rowid);
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

function validar_tipo_cambio(codigo_empresa){
    var fecha =  getShortDateFormat(new Date(),"mm/dd/yyyy");
    $.ajax({
        type: "POST",
        url: "/tipo_cambio/empresas_tc",
        data: {
            codigo_empresa: codigo_empresa,
            fecha: fecha
        },
        success: function (e){
            if(e.length==0){
                $("#lbl_mensaje").text("Buscando...");
                $("#ingresar").prop("disabled",true);
                cargar_tipo_cambio();
            }else{
                $("#ingresar").prop("disabled",false);
            }
        }
    });

}


function cargar_tipo_cambio(){
    $("#modal_tc").modal("show")
    $.ajax({
        type: "POST",
        url: "http://pdf.erp-facturacionelectronica.com/tipo_cambio",
        crossDomain: true,
        success: function (e){
            $("#tc_compra").val(e[0])
            $("#tc_venta").val(e[1])
            $("#lbl_mensaje").text("Completado");
        }
    });
}