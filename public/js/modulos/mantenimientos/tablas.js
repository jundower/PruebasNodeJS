// var grid_reporte_documentos='reporte-documentos'

// var jq_grid_tablas;
// var cabecera;
// var modal_tablas_titulo="";
// var columnas=[];
// var modulo_tablas;

// var jq_group_listas_precios;

// var estado_tablas="Guardar";

$(document).ready(function() {
    jq_grid_tablas = $("#"+grid_reporte_documentos);
    cargar_configuracion()
    $("#nuevo").show();
    $("#modificar").show();
    $("#eliminar").show();
    $("#exportar").show();
    $('#exportar').click(function (){
        createExcelFromGrid(grid_reporte_documentos,$("#TitleHeader").text(),cabecera);
    });
    $('#modificar').click(function (){
        modificar_tablas();
    });
    $('#eliminar').click(function (){
        eliminar_tablas();
    });
})

$(window).bind('resize', function() {
    resize_jqgrid_porcentajes(jq_grid_tablas,70,98);
});

function nuevo(){
    nuevo_tablas();
}
