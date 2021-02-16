var tipo_filtrar="Todo";
var url_sunat_lista='/sunat/pendientes';

$(document).ready(function() {
    
    setTitle("Sunat");
    $('input:radio[name="fecha_tipo"]').change(function() {
        tipo_filtrar = $(this).val();
        if ($(this).val() ==  "intervalo") {
            $("#seleccion_fechas").prop("hidden", false);
            cargar_jq_grid();
        } else {
            $("#seleccion_fechas").prop("hidden", true);
            cargar_jq_grid();
        }
    });

    $("#fecha_inicio").val(getFirstDate(new Date()))
    $("#fecha_final").val(getLastDate(new Date()))
    
    $(".filtrar").change(function(){
        $("#filtrar").trigger("click");
    });
    
    $("#filtrar").click(function(){
        if($("#estado_sunat").val()=="Pendientes"){
            url_sunat_lista = '/sunat/pendientes';
        }else{
            url_sunat_lista = '/sunat/enviados';
        }
        cargar_jq_grid();
        url_sunat_lista=='/sunat/Pendientes' ? $("#enviar_todo").show() : $("#enviar_todo").hide();
    });

    cargar_jq_grid();
});

function cargar_jq_grid(){
    var jq_grid = $("#grid_sunat");
    jq_grid.jqGrid("GridUnload");

    var colNamesSunat = [];
    var colModelSunat=[];

    switch($("#estado_sunat").val()){
        case "Pendientes":
            colNamesSunat.push("Enviar");
            colModelSunat.push({name:"Sunat",formatter:function (cellvalue, options, rowObject) {    
                    return "<input type='button' class='btn btn-success btn-sm'  value='Envíar' onclick=\"javascript:enviar_documento('" + options.rowId + "','" + cellvalue + "')\" \>";
                }, width:80, align: "center"
            });
        break;
        case "Aceptados":
            colNamesSunat.push("PDF");
            colNamesSunat.push("XML");
            colNamesSunat.push("CDR");
            colNamesSunat.push("Correo");

            colModelSunat.push({name:"PDF",formatter:function (cellvalue, options, rowObject) {  
                    return "<input type='button' class='btn btn-success btn-sm'  value='PDF' onclick=\"javascript:enviar_documento('" + options.rowId + "','" + cellvalue + "')\" \>";
                }, width:50, align: "center"
            });
            colModelSunat.push({name:"XML",formatter:function (cellvalue, options, rowObject) {    
                    return "<input type='button' class='btn btn-success btn-sm'  value='XML' onclick=\"javascript:enviar_documento('" + options.rowId + "','" + cellvalue + "')\" \>";
                }, width:50, align: "center"
            });
            colModelSunat.push({name:"CDR",formatter:function (cellvalue, options, rowObject) {    
                    return "<input type='button' class='btn btn-success btn-sm'  value='CDR' onclick=\"javascript:enviar_documento('" + options.rowId + "','" + cellvalue + "')\" \>";
                }, width:50, align: "center"
            });
            colModelSunat.push({name:"Correo",formatter:function (cellvalue, options, rowObject) {    
                    return "<input type='button' class='btn btn-success btn-sm'  value='Envíar Correo' onclick=\"javascript:enviar_documento('" + options.rowId + "','" + cellvalue + "')\" \>";
                }, width:100, align: "center"
            });
        break;

    }
    
    colNamesSunat.push("Codigo_Punto_Venta");
    colNamesSunat.push("Punto de Venta");
    colNamesSunat.push("Codigo_Tipo_Documento");
    colNamesSunat.push("Tipo de Documento");
    colNamesSunat.push("Serie");
    colNamesSunat.push("Numero");
    colModelSunat.push({name:"Codigo_Punto_Venta", hidden:true});
    colModelSunat.push({name:"Punto_Venta", template: textTemplate, width:100});
    colModelSunat.push({name:"Codigo_Tipo_Documento", hidden:true});
    colModelSunat.push({name:"Tipo_Documento", template: textTemplate, width:100});
    colModelSunat.push({name:"Serie", align: "center", template: textTemplate, width:50});
    colModelSunat.push({name:"Numero", align: "center", template: textTemplate, width:80});

    colNamesSunat.push("Estado Sunat");
    colNamesSunat.push("Fecha Envio");
    colNamesSunat.push("Fecha Baja");
    
    colModelSunat.push({name:"Estado_Fe", template: textTemplate, width:200, align: "center"});
    colModelSunat.push({name:"Fecha_Envio", template: dateTemplate2, width:70});
    colModelSunat.push({name:"Fecha_Baja", template: dateTemplate2, width:70});

    switch($("#estado_sunat").val()){
        case "Enviados":
        case "Aceptados":
        case "Rechazados":
        case "Observados":
            colNamesSunat.push("Codigo Sunat");
            colNamesSunat.push("Mensaje Sunat");
            colNamesSunat.push("Estado Web PDF");
            colNamesSunat.push("Estado Web CDR");
            colNamesSunat.push("Estado Web XML");
            colNamesSunat.push("Estado Envío Correos");

            colModelSunat.push({name:"codigo_cdr", width:70});
            colModelSunat.push({name:"mensaje_cdr", width:300});
            colModelSunat.push({name:"pdf_web", width:100});
            colModelSunat.push({name:"cdr_web", width:100});
            colModelSunat.push({name:"xml_web", width:100});
            colModelSunat.push({name:"estado_correo", width:100});
        break;

    }

    colNamesSunat.push("Fecha");
    colNamesSunat.push("Fecha Entrega");
    colNamesSunat.push("Codigo Cliente");
    colNamesSunat.push("Nombre Cliente");
    colNamesSunat.push("Codigo_Forma_Pago");
    colNamesSunat.push("Forma de Pago");
    colNamesSunat.push("Moneda");
    colNamesSunat.push("Tc");
    colNamesSunat.push("SubTotal S. Desc.");
    colNamesSunat.push("Descuento");
    colNamesSunat.push("SubTotal");
    colNamesSunat.push("Igv");
    colNamesSunat.push("Importe");
    colNamesSunat.push("Estado Documento");

    
    colModelSunat.push({name:"Fecha", template: dateTemplate2, width:100});
    colModelSunat.push({name:"Fecha_Entrega", template: dateTemplate2, width:100});
    colModelSunat.push({name:"Codigo_Cliente", template: textTemplate, width:100});
    colModelSunat.push({name:"Nombre_Cliente", template: textTemplate, width:200});
    colModelSunat.push({name:"Codigo_Forma_Pago", hidden:true});
    colModelSunat.push({name:"Forma_Pago", template: textTemplate, width:100});
    colModelSunat.push({name:"Moneda", align: "center", template: textTemplate, width:50});
    colModelSunat.push({name:"Tc", align: "center", template: textTemplate, width:50});
    colModelSunat.push({name:"Sub_total_sin_descuentos", template: numberTemplate, width:70});
    colModelSunat.push({name:"Descuento", template: numberTemplate, width:70});
    colModelSunat.push({name:"Sub_total", template: numberTemplate, width:70});
    colModelSunat.push({name:"Igv", template: numberTemplate, width:70});
    colModelSunat.push({name:"Importe", template: numberTemplate, width:70});
    colModelSunat.push({name:"Estado_Documento", template: textTemplate, width:80, align: "center"});

    

    jq_grid.jqGrid({
        url: url_sunat_lista,
        datatype: "json",
        mtype: "POST",
        postData:{
            tipo_filtrar: tipo_filtrar,
            inicio: getDateFormat($("#fecha_inicio").val(),'y-m-d','m/d/y','-','/'),
            final: getDateFormat($("#fecha_final").val(),'y-m-d','m/d/y','-','/'),
            sunat_filtrar: $("#estado_sunat").val()
            // inicio: "10/01/2020",
            // final: "11/01/2020"
        },
        colNames: colNamesSunat,
        colModel: colModelSunat,
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
        loadComplete:function(data){
            resize_jqgrid_restar(jq_grid, $("#myTab").height() + $("#nav_title_bar").height() + 100,$(window).width() - $("#myTab").width());
        }
    });
    jq_grid.jqGrid('filterToolbar',{stringResult: true, searchOnEnter : false, searchOperators : true});
}

function enviar_documento(rowID, cellvalue)
{
    // console.log(cellvalue);
    var jq_grid = $("#grid_sunat");
    var row = jq_grid.getRowData(rowID);
    // console.log(row);
    // jq_grid.setRowData(rowID,{Sunat: "<input type='button' class='btn btn-success btn-sm'  value='Envíando'>"})
    switch(cellvalue){
        case "Sunat":
            $.ajax({
                type: 'POST',
                url: "/sunat/insertar_sunat",
                data:{
                    Codigo_Cliente: row.Codigo_Cliente,
                    Codigo_Forma_Pago: row.Codigo_Forma_Pago,
                    Codigo_Punto_Venta: row.Codigo_Punto_Venta,
                    Codigo_Tipo_Documento: row.Codigo_Tipo_Documento,
                    Descuento: row.Descuento,
                    Estado_Documento: row.Estado_Documento,
                    Estado_Fe: row.Estado_Fe,
                    Fecha: getDateFormat(row.Fecha,'d/m/y','m/d/y','/','/'),
                    Fecha_Baja: '01/01/1900',
                    Fecha_Entrega: getDateFormat(row.Fecha_Entrega,'d/m/y','m/d/y','/','/'),
                    Fecha_Envio: getShortDateFormat(new Date(), "mm/dd/yyyy"),
                    Forma_Pago: row.Forma_Pago,
                    Igv: row.Igv,
                    Importe: row.Importe,
                    Moneda: row.Moneda,
                    Nombre_Cliente: row.Nombre_Cliente,
                    Numero: row.Numero,
                    Punto_Venta: row.Punto_Venta,
                    Serie: row.Serie,
                    Sub_total: row.Sub_total,
                    Sub_total_sin_descuentos: row.Sub_total_sin_descuentos,
                    Tc: row.Tc,
                    Tipo_Documento: row.Tipo_Documento,
                },
                success: function (e){
                    console.log(e);
                },
                error: function(e){
                    console.log(e);
                }
            });
        break;
    }
}