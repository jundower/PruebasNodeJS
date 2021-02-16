var grid_lista_productos;
var jq_formato_impresion;
var html_formato_impresion;

var cabecera_kardex= [
    'Codigo',
    'Interno',
    'Nombre',
    'unidad',
    'Stock',
    'Costo',
    'Serie',
    'Dias x Vencer',
    'moneda',
    'Tipo_Producto',
    'Familia',
    'Subfamilia',
    'Concepto1',
    'Concepto2',
    'Concepto3',
    'Concepto4',
    'Concepto5',
    'Concepto6',
    'Concepto7',
    'Categoria',
    'Ubicacion'

];

$(document).ready(async function() {
    jq_formato_impresion = $("#formato_impresion");
    html_formato_impresion = jq_formato_impresion.html();
    rellenar_selects();
    
    $("#almacen").append('<option value="(TODOS)">Todos</option>');
    $("#tipo_producto").append('<option value="(TODOS)">Todos</option>');

    $("#tipo_producto").val("(TODOS)");
    setTitle("Kardex Valorizado");
    
    $("#exportar").show();
    $("#imprimir").show();
    $("#ver_objeto").show();

    grid_lista_productos = $("#table_grid");

    
    $('#exportar').click(function (){
        createExcelFromGrid("table_grid",$("#TitleHeader").text(),cabecera_kardex);
    });

    $("#filtrar").click(function(){
        cargar_lista_productos();    
    });

    $("#ver_objeto").click(function(){
        cargar_kardex();    
    });
    cargar_lista_productos();

    $(".print_container").keydown(function(e){
        var keycode = (event.keyCode ? event.keyCode : event.code);
        if(keycode==27)  $(".print_container").addClass("d---none");//$(".print_container").hide();
    });
    $(".print_botones_imprimir").click(function(){
        $("#formato_impresion").printThis();
    });
    $(".print_botones_descargar").click(function(){
        descargarPDF(true);
    });
    $(".print_botones_onedrive").click(function(){
        descargarPDF(false);
    });
    $(".print_botones_atras").click(function(){
        $(".print_container").addClass("d---none");
    });
    $(".print_botones_excel").click(function(){
        var header = $(".print_header > div.row");
        
        var filename="prueba";
        var wb = XLSX.utils.book_new();
        wb.Props = {
                Title: "ErpSoft",
                Subject: "ErpSoft",
                Author: "ErpSoft",
                CreatedDate: new Date(2017,12,19)
        };
        wb.SheetNames.push(filename);
        var ws_data=[];

        var fila=[];
        var merges=[];
        var espaciado=0;
        var html="<table>";
        for (var i =0;i<header.length;i++){
            html+="<tr>";
            var row1 = $($(header[i])).children("div");
            if(row1.length==0) {
                console.log("row1")
                fila.push([$(header[i]).text()])
            }
            espaciado=0;
            for (var j =0;j<row1.length;j++){
                var row2 = $($(row1[j])).children("div");
                if(row2.length==0) {
                    var width = $(row1[j]).css("width").replace("px","");
                    var vacios =  Math.round(width/90);
                    if(fila[i]){
                        html+='<td colspan="'+vacios+'">'+$(row1[j]).text()+"</td>";
                        fila[i].push($(row1[j]).text())
                    }else{
                        html+='<td colspan="'+vacios+'">'+$(row1[j]).text()+"</td>";    
                        fila.push([$(row1[j]).text()])
                    }
                    for(var v = 1;v<vacios;v++){
                        // fila[i].push(" ")
                        fila[i].push(j)
                    }
                    console.log("i: "+i+" - j: "+j+" - vacios: "+vacios);
                    if(vacios>0){
                        merges.push({ s: {r:i, c:espaciado}, e: {r:i, c:  vacios + espaciado - 1 } })
                    }
                    espaciado+= vacios;
                }
                for (var l =0;l<row2.length;l++){
                    var row3 = $($(row2[l])).children("div");
                    if(row3.length==0) {
                        console.log("row3")
                        if(fila[i]){
                            fila[i].push($(row2[l]).text())
                        }else{
                            fila.push([$(row2[l]).text()])
                        }
                    }
                    for (var k =0;k<row3.length;k++){
                        var row4 = $($(row3[k])).children("div");
                        if(row4.length==0) {
                            console.log("row4")
                            if(fila[i]){
                                fila[i].push($(row3[k]).text())
                            }else{
                                fila.push([$(row3[k]).text()])
                            }
                        }
                        for (var m =0;m<row4.length;m++){
                            var row5 = $($(row4[m])).children("div");
                            
                            if(row5.length==0) {
                                console.log("row5")
                                if(fila[i]){
                                    fila[i].push($(row4[m]).text())
                                }else{
                                    fila.push([$(row4[m]).text()])
                                }
                            }
                        }
                    }
                }
            }
            html+="</tr>";
        }
        html+="</table>";
        // console.log(html)
        console.log(fila)
        console.log(merges)
        for(var y=0;y<fila.length;y++){
            ws_data.push(fila[y]);
        }
        var ws = XLSX.utils.aoa_to_sheet(ws_data);
        ws['A10'].s = {font: {
            name: 'Arial',
            sz: 20,
            color: { rgb: "#FF000000" },
            bold: true,
            italic: true,
            underline: true
            }}
        ws["C1"].s = {
            font: {
                sz: 13,
                bold: true,
                color: {
                    rgb: "FFFFAA00"
                }
            },
            alignment: {
                horizontal: "center",
                vertical: "center",
                wrap_text: true
            }
        };

        ws["A5"].s = {
            font: {
                sz: 13,
                bold: true,
                color: {
                    rgb: "FFFFAA00"
                }
            },
            alignment: {
                horizontal: "center",
                vertical: "center",
                wrap_text: true
            }
        };

        /* add merges */
        if(!ws['!merges']) ws['!merges'] = [];
        
        for(var y=0;y<merges.length;y++){
            ws['!merges'].push(merges[y]);
        }
        //https://docs.sheetjs.com/
        //cellStyles .s
        // //Control cell width
        // ws["!cols"] = [{
        //     wpx: 70
        // }, {
        //     wpx: 70
        // }, {
        //     wpx: 70
        // }, {
        //     wpx: 70
        // }, {
        //     wpx: 150
        // }, {
        //     wpx: 120
        //         }]; //Cell column width

        wb.Sheets[filename] = ws;

        var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
        function s2ab(s) {

                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
                
        }
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), filename+'.xlsx');

        // window.open('data:application/vnd.ms-excel,' + encodeURIComponent('<table  ><tr><td>Cell 0</td><td>Cell 1</td><td>Cell 2</td></tr><tr><td colspan="2">Cell 00</td><td>Cell 22</td></tr></table>'));
        

        // // window.open('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + encodeURIComponent(html));
        // var link = document.createElement("a");
        // link.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + encodeURIComponent(html);
        // link.style = "visibility:hidden";
        // link.download = "Kardex.xlsx";

        // document.body.appendChild(link);
        // link.click();
        // // document.body.removeChild(link);


        // /* notice the hole where cell "B1" would be */
        // var data = [
        //     ["Merged", "", "C", "D"],
        //     [1,2,3,4],
        //     ["a","","c","d"]
        // ];
        
        // /* merge cells A1:B1 */
        // var merge = { s: {r:0, c:0}, e: {r:0, c:1} };
        // var merge2 = { s: {r:2, c:0}, e: {r:2, c:1} };
        // //var merge = XLSX.utils.decode_range("A1:B1"); // this is equivalent
        
        // /* generate worksheet */
        // var ws = XLSX.utils.aoa_to_sheet(data);
        
        // /* add merges */
        // if(!ws['!merges']) ws['!merges'] = [];
        // ws['!merges'].push(merge);
        // ws['!merges'].push(merge2);
        
        // /* generate workbook */
        // var wb = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        
        // /* generate file and download */
        // const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
        // saveAs(new Blob([wbout], { type: "application/octet-stream" }), "issue964.xlsx");
    });
    $("#kardex_fecha_inicial").change(function(){
        cargar_kardex();
    });
    $("#kardex_fecha_final").change(function(){
        cargar_kardex();
    });
    $("#print_moneda_select").change(function(){
        cargar_kardex();
    });
    $("#kardex_fecha_inicial").val(getFirstDate(new Date()));
    $("#kardex_fecha_final").val(getLastDate(new Date()));
});

async function rellenar_selects(){
    await rellenar_codigo_nombre("/punto_venta/lista","punto_venta","user-punto_venta")
    await rellenar_codigo_nombre("/almacen/lista","almacen","user-almacen")
    await rellenar_codigo_nombre("/tipo_productos/lista","tipo_producto")
}

$(window).bind('resize', function() {
    resize_jqgrid_restar(grid_lista_productos,($("#myTab").css("height").replace("px",""))*1 + 200,20);
});

function cargar_lista_productos(){
    
    grid_lista_productos.jqGrid('GridUnload');
    grid_lista_productos.jqGrid({
        url: '/reportes_almacen/productos_lote_serie/',
        mtype: "POST",
        datatype: "json",
        postData: {
            punto_venta : $("#punto_venta").val(),
            almacen : $("#almacen").val(),
            tipo_producto : $("#tipo_producto").val(),
            fecha: getShortDate(new Date()),
            tipo_lote_serie: 'Serie',
            moneda : $("#moneda").val(),
            tipo_stock : $("#tipo_stock").val(),
            
        },
        colNames:cabecera_kardex,
        colModel: [
            {name: 'Codigo', template: textTemplate},
            {name: 'Interno', template: textTemplate},
            {name: 'Nombre', template: textTemplate},
            {name: 'unidad', template: textTemplate, align: 'center'},
            {name: 'Stock', template: numberTemplate},
            {name: 'costo', template: numberTemplate},
            {name: 'nro_serie', template: textTemplate, align: 'center'},
            {name: 'dias_xvencer', template: textTemplate, align: 'center'},
            {name: 'moneda', template: textTemplate, align: 'center'},
            {name: 'Tipo_Producto', template: textTemplate},
            {name: 'Familia', template: textTemplate},
            {name: 'Subfamilia', template: textTemplate},
            {name: 'Concepto1', template: textTemplate},
            {name: 'Concepto2', template: textTemplate},
            {name: 'Concepto3', template: textTemplate},
            {name: 'Concepto4', template: textTemplate},
            {name: 'Concepto5', template: textTemplate},
            {name: 'Concepto6', template: textTemplate},
            {name: 'Concepto7', template: textTemplate},
            {name: 'Categoria', template: textTemplate},
            {name: 'Ubicacion', template: textTemplate},
        ],
        rowNum:50,
        loadonce: true,
        viewrecords: true,
        rownumbers: true,
        multiselect: true,
        shrinkToFit: false,
        height: 300,
        width: 300,
        rowList:[50,500,5000,50000],
        pager: '#lista_mantenimientos_pager',
        ondblClickRow: function(rowid, iRow, iCol, e){
        },
        loadComplete:function(data){
            resize_jqgrid_restar(grid_lista_productos,($("#myTab").css("height").replace("px",""))*1 + 200,20);
        },
        beforeSelectRow(rowid, e){
        },
        onSelectRow: function (rowid, status, e){
        },
    });
    
    grid_lista_productos.jqGrid('filterToolbar',{stringResult: true,searchOnEnter : false, searchOperators : true});

}

function cargar_kardex(){
    $("#print_page").hide();
    var ids = grid_lista_productos.getGridParam('selarrrow');
    var productos=[];
    var lotes=[];
    for(var i=0; i<ids.length;i++){
        var row = grid_lista_productos.getRowData(ids[i]);
        console.log(row);
        productos.push(row.Codigo);
        lotes.push(row.nro_serie);
    }
    $.ajax({
        type: 'POST',
        url: '/reportes_almacen/kardex_lote_serie/',
        data: {
            punto_venta : $("#punto_venta").val(),
            almacen : $("#almacen").val(),
            tipo_producto : $("#tipo_producto").val(),
            fecha: getShortDate(new Date()),
            moneda : $("#print_moneda_select").val(),
            tipo_stock : $("#tipo_stock").val(),
            tipo_lote_serie: 'Serie',
            productos : JSON.stringify(productos),
            lotes : JSON.stringify(lotes),
            fecha_inicio: $("#kardex_fecha_inicial").val(),
            fecha_final: $("#kardex_fecha_final").val(),
        },
        success: function (result) {
            rellenarKardex(result);
            $(".print_container").removeClass("d---none");
            $("#print_page").show();
        }
    });
}

function rellenarKardex(data){
    console.log(data);
    jq_formato_impresion.html(html_formato_impresion);
    // var page_height = 1573; // cuando no está configurado el @page size : auto
    var page_height = 1507;
    $(".print_header_fecha_intervalo").html("<u>DESDE: "+ data[0].Fecha_Inicial + " HASTA: " + data[0].Fecha_Final+"</u>");
    $(".print_header_periodo").text(data[0].Periodo);
    $(".print_header_ruc").text(data[0].Ruc);
    $(".print_header_razon_social").text(data[0].Nombre_Empresa);
    $(".print_header_direccion").text(data[0].direccion);
    $(".print_header_punto_venta").text(data[0].nombre_pto_venta);
    $(".print_header_almacen").text(data[0].nombre_almacen);
    
    var header_height = $(".print_header").css("height").replace("px","") * 1;
    var footer_height = $(".print_footer").css("height").replace("px","") * 1;
    var content_height = $(".print_body_filas_id").css("height").replace("px","") * 1;
    $(".print_body").css("height",page_height - header_height - footer_height);

    var original_page = $("#print_page").html();
    var original_body = $("#print_body").html();
    var page_number=0;

    var original_body_fila_detalle = $("#print_body_fila_detalle_1").html();

    $(".print_body_fila_detalle").html("");
    $("#print_page").html("")
    
    var new_page = original_page;

    var Cantidad_Saldo=0;

    var Cantidad_Entrada_Sumatoria=0;
    var Costo_Entrada_Sumatoria=0;
    var Costo_Total_Entrada_Sumatoria=0;
    var Cantidad_Salida_Sumatoria=0;
    var Costo_Salida_Sumatoria=0;
    var Costo_Total_Salida_Sumatoria=0;
    var Cantidad_Saldo_Sumatoria=0;
    var Costo_Saldo_Sumatoria=0;
    var Costo_Total_Saldo_Sumatoria=0;

    var Cantidad_Entrada_Total=0;
    var Costo_Entrada_Total=0;
    var Costo_Total_Entrada_Total=0;
    var Cantidad_Salida_Total=0;
    var Costo_Salida_Total=0;
    var Costo_Total_Salida_Total=0;
    var Cantidad_Saldo_Total=0;
    var Costo_Saldo_Total=0;
    var Costo_Total_Saldo_Total=0;

    var agrupacion_codigo="";
    var agrupacion_serie="";
    var nuevo_grupo=false;
    for(var i = 0; i<data.length; i++){
        var detalle = data[i];
        if(agrupacion_codigo!=detalle.Codigo || agrupacion_serie != detalle.nro_serie){
            Cantidad_Saldo=0;
            Cantidad_Entrada_Sumatoria=0;
            Costo_Entrada_Sumatoria=0;
            Costo_Total_Entrada_Sumatoria=0;
            Cantidad_Salida_Sumatoria=0;
            Costo_Salida_Sumatoria=0;
            Costo_Total_Salida_Sumatoria=0;
            Cantidad_Saldo_Sumatoria=0;
            Costo_Saldo_Sumatoria=0;
            Costo_Total_Saldo_Sumatoria=0;
            agrupacion_codigo=detalle.Codigo;
            agrupacion_serie=detalle.nro_serie;
            nuevo_grupo=true;
        }else{
            nuevo_grupo=false;
        }
        if((header_height + footer_height + content_height < page_height ) && (page_number!=0)){
            var new_fila = original_body_fila_detalle;

            Cantidad_Saldo+=detalle.Cantidad_Entrada - detalle.Cantidad_Salida;

            Costo_Total_Entrada = detalle.Cantidad_Entrada * detalle.Costo_Entrada;
            Costo_Total_Salida = detalle.Cantidad_Salida * detalle.Costo_Salida;
            Costo_Total_Saldo = Cantidad_Saldo * detalle.Costo_Saldo;

            Cantidad_Entrada_Sumatoria+=detalle.Cantidad_Entrada;
            Costo_Entrada_Sumatoria+=detalle.Costo_Entrada;
            Costo_Total_Entrada_Sumatoria+=Costo_Total_Entrada;
            Cantidad_Salida_Sumatoria+=detalle.Cantidad_Salida;
            Costo_Salida_Sumatoria+=detalle.Costo_Salida;
            Costo_Total_Salida_Sumatoria+=Costo_Total_Salida;
            Cantidad_Saldo_Sumatoria=Cantidad_Entrada_Sumatoria-Cantidad_Salida_Sumatoria;
            Costo_Saldo_Sumatoria+=detalle.Costo_Saldo;
            Costo_Total_Saldo_Sumatoria+=Costo_Total_Saldo;

            Cantidad_Entrada_Total+=detalle.Cantidad_Entrada;
            Costo_Entrada_Total+=detalle.Costo_Entrada;
            Costo_Total_Entrada_Total+=Costo_Total_Entrada;
            Cantidad_Salida_Total+=detalle.Cantidad_Salida;
            Costo_Salida_Total+=detalle.Costo_Salida;
            Costo_Total_Salida_Total+=Costo_Total_Salida;
            Cantidad_Saldo_Total=Cantidad_Entrada_Total-Cantidad_Salida_Total;
            Costo_Saldo_Total+=detalle.Costo_Saldo;
            Costo_Total_Saldo_Total+=Costo_Total_Saldo;

            new_fila = new_fila.replace("fila_1","fila_"+(i+1))
            new_fila = new_fila.replace("print_body_agrupacion","print_body_agrupacion_"+(i+1))
            new_fila = new_fila.replace("print_body_totales","print_body_totales_"+(i+1))
            
            new_fila = new_fila.replace("print_body_codigo",detalle.Codigo)
            new_fila = new_fila.replace("print_body_descripcion",detalle.Nombre)
            new_fila = new_fila.replace("print_body_unidad",detalle.Unidad)
            new_fila = new_fila.replace("print_body_familia",detalle.Familia)
            new_fila = new_fila.replace("print_body_nro_serie",detalle.nro_serie)
            // new_fila = new_fila.replace("print_body_vencimiento",detalle.vcto)
            new_fila = new_fila.replace("print_body_tipo_producto", detalle.Tipo_Producto)
            new_fila = new_fila.replace("print_body_subfamilia", detalle.Subfamilia)
            
            new_fila = new_fila.replace("Documento_Fecha",detalle.Fecha)
            new_fila = new_fila.replace("Documento_Tipo",detalle.Tipo)
            new_fila = new_fila.replace("Documento_Numero",detalle.Serie +" - "+ detalle.Numero)

            if(detalle.Cantidad_Entrada>0){
                new_fila = new_fila.replace('visibility: hidden">Producto_Entrada_Cantidad', '">Producto_Entrada_Cantidad')
                new_fila = new_fila.replace('visibility: hidden">Producto_Entrada_Costo_Unitario', '">Producto_Entrada_Costo_Unitario')
                new_fila = new_fila.replace('visibility: hidden">Producto_Entrada_Costo_Total', '">Producto_Entrada_Costo_Total')
            }

            if(detalle.Cantidad_Salida>0){
                new_fila = new_fila.replace('visibility: hidden">Producto_Salida_Cantidad', '">Producto_Salida_Cantidad')
                new_fila = new_fila.replace('visibility: hidden">Producto_Salida_Costo_Unitario', '">Producto_Salida_Costo_Unitario')
                new_fila = new_fila.replace('visibility: hidden">Producto_Salida_Costo_Total', '">Producto_Salida_Costo_Total')
            }


            new_fila = new_fila.replace("Producto_Entrada_Cantidad", formatCurrency2(detalle.Cantidad_Entrada,detalle.dec_precio))
            new_fila = new_fila.replace("Producto_Entrada_Costo_Unitario", formatCurrency2(detalle.Costo_Entrada,detalle.dec_precio))
            new_fila = new_fila.replace("Producto_Entrada_Costo_Total", formatCurrency2(Costo_Total_Entrada,detalle.dec_precio))
            new_fila = new_fila.replace("Producto_Salida_Cantidad", formatCurrency2(detalle.Cantidad_Salida,detalle.dec_precio))
            new_fila = new_fila.replace("Producto_Salida_Costo_Unitario", formatCurrency2(detalle.Costo_Salida,detalle.dec_precio))
            new_fila = new_fila.replace("Producto_Salida_Costo_Total", formatCurrency2(Costo_Total_Salida,detalle.dec_precio))
            new_fila = new_fila.replace("Producto_Saldo_Cantidad", formatCurrency2(Cantidad_Saldo,detalle.dec_precio))
            new_fila = new_fila.replace("Producto_Saldo_Costo_Unitario", formatCurrency2(detalle.Costo_Saldo,detalle.dec_precio))
            new_fila = new_fila.replace("Producto_Saldo_Costo_Total", formatCurrency2(Costo_Total_Saldo,detalle.dec_precio))
            
            
            new_fila = new_fila.replace("Producto_Total_Agrupacion", "Total "+detalle.Nombre+" ----->")
            new_fila = new_fila.replace("Producto_Entrada_Cantidad_Sumatoria", formatCurrency2(Cantidad_Entrada_Sumatoria,detalle.dec_precio))
            new_fila = new_fila.replace("Producto_Entrada_Costo_Unitario_Sumatoria", formatCurrency2(Costo_Entrada_Sumatoria,detalle.dec_precio))
            new_fila = new_fila.replace("Producto_Entrada_Costo_Total_Sumatoria", formatCurrency2(Costo_Total_Entrada_Sumatoria,detalle.dec_precio))
            new_fila = new_fila.replace("Producto_Salida_Cantidad_Sumatoria", formatCurrency2(Cantidad_Salida_Sumatoria,detalle.dec_precio))
            new_fila = new_fila.replace("Producto_Salida_Costo_Unitario_Sumatoria", formatCurrency2(Costo_Salida_Sumatoria,detalle.dec_precio))
            new_fila = new_fila.replace("Producto_Salida_Costo_Total_Sumatoria", formatCurrency2(Costo_Total_Salida_Sumatoria,detalle.dec_precio))
            new_fila = new_fila.replace("Producto_Saldo_Cantidad_Sumatoria", formatCurrency2(Cantidad_Saldo_Sumatoria,detalle.dec_precio))
            new_fila = new_fila.replace("Producto_Saldo_Costo_Unitario_Sumatoria", formatCurrency2(Costo_Saldo_Sumatoria,detalle.dec_precio))
            new_fila = new_fila.replace("Producto_Saldo_Costo_Total_Sumatoria", formatCurrency2(Costo_Total_Saldo_Sumatoria,detalle.dec_precio))

            $("#print_body_fila_detalle_"+page_number).append(new_fila);

            $("#Producto_Entrada_Cantidad_Total_"+page_number).text(formatCurrency2(Cantidad_Entrada_Total,detalle.dec_precio));
            $("#Producto_Entrada_Costo_Unitario_Total_"+page_number).text(formatCurrency2(Costo_Entrada_Total,detalle.dec_precio));
            $("#Producto_Entrada_Costo_Total_Total_"+page_number).text(formatCurrency2(Costo_Total_Entrada_Total,detalle.dec_precio));
            $("#Producto_Salida_Cantidad_Total_"+page_number).text(formatCurrency2(Cantidad_Salida_Total,detalle.dec_precio));
            $("#Producto_Salida_Costo_Unitario_Total_"+page_number).text(formatCurrency2(Costo_Salida_Total,detalle.dec_precio));
            $("#Producto_Salida_Costo_Total_Total_"+page_number).text(formatCurrency2(Costo_Total_Salida_Total,detalle.dec_precio));
            $("#Producto_Saldo_Cantidad_Total_"+page_number).text("Total Saldo General =====> "+formatCurrency2(Cantidad_Saldo_Total,detalle.dec_precio));
            $("#Producto_Saldo_Costo_Unitario_Total_"+page_number).text(formatCurrency2(Costo_Saldo_Total,detalle.dec_precio));
            $("#Producto_Saldo_Costo_Total_Total_"+page_number).text(formatCurrency2(Costo_Total_Saldo_Total,detalle.dec_precio));

            if(!nuevo_grupo){
                $("#print_body_agrupacion_"+(i+1)).remove();
                $("#print_body_totales_"+i).remove();
                content_height-=$("#print_body_totales_"+(i+1)).css("height").replace("px","") * 1;
            }
            
            content_height+=$("#fila_"+(i+1)).css("height").replace("px","") * 1;
            // console.log("Pagina: "+page_number + " Fila "+ (i+1)+" Tamaño "+$("#fila_"+(i+1)).css("height").replace("px","") + " Total " +content_height);
            if(header_height + footer_height + content_height > page_height){
                $("#fila_"+(i+1)).remove();
                i--;
            }
        }else{
            Cantidad_Saldo+=detalle.Cantidad_Entrada - detalle.Cantidad_Salida;
            

            Costo_Total_Entrada = detalle.Cantidad_Entrada * detalle.Costo_Entrada;
            Costo_Total_Salida = detalle.Cantidad_Salida * detalle.Costo_Salida;
            Costo_Total_Saldo = Cantidad_Saldo * detalle.Costo_Saldo;

            Cantidad_Entrada_Sumatoria+=detalle.Cantidad_Entrada;
            Costo_Entrada_Sumatoria+=detalle.Costo_Entrada;
            Costo_Total_Entrada_Sumatoria+=Costo_Total_Entrada;
            Cantidad_Salida_Sumatoria+=detalle.Cantidad_Salida;
            Costo_Salida_Sumatoria+=detalle.Costo_Salida;
            Costo_Total_Salida_Sumatoria+=Costo_Total_Salida;
            Cantidad_Saldo_Sumatoria=Cantidad_Entrada_Sumatoria-Cantidad_Salida_Sumatoria;
            Costo_Saldo_Sumatoria+=detalle.Costo_Saldo;
            Costo_Total_Saldo_Sumatoria+=Costo_Total_Saldo;

            Cantidad_Entrada_Total+=detalle.Cantidad_Entrada;
            Costo_Entrada_Total+=detalle.Costo_Entrada;
            Costo_Total_Entrada_Total+=Costo_Total_Entrada;
            Cantidad_Salida_Total+=detalle.Cantidad_Salida;
            Costo_Salida_Total+=detalle.Costo_Salida;
            Costo_Total_Salida_Total+=Costo_Total_Salida;
            Cantidad_Saldo_Total=Cantidad_Entrada_Total-Cantidad_Salida_Total;
            Costo_Saldo_Total+=detalle.Costo_Saldo;
            Costo_Total_Saldo_Total+=Costo_Total_Saldo;

            new_page = original_page;
            page_number++;
            new_page = new_page.replace("print_header_paginacion","Página "+page_number);
            new_page = new_page.replace("print_paginacion","print_paginacion_"+page_number)
            new_page = new_page.replace("print_body_fila_detalle_1","print_body_fila_detalle_"+page_number);
            
            new_page = new_page.replace("Producto_Entrada_Cantidad_Total","Producto_Entrada_Cantidad_Total_"+page_number)
            new_page = new_page.replace("Producto_Entrada_Costo_Unitario_Total","Producto_Entrada_Costo_Unitario_Total_"+page_number)
            new_page = new_page.replace("Producto_Entrada_Costo_Total_Total","Producto_Entrada_Costo_Total_Total_"+page_number)
            new_page = new_page.replace("Producto_Salida_Cantidad_Total","Producto_Salida_Cantidad_Total_"+page_number)
            new_page = new_page.replace("Producto_Salida_Costo_Unitario_Total","Producto_Salida_Costo_Unitario_Total_"+page_number)
            new_page = new_page.replace("Producto_Salida_Costo_Total_Total","Producto_Salida_Costo_Total_Total_"+page_number)
            new_page = new_page.replace("Producto_Saldo_Cantidad_Total","Producto_Saldo_Cantidad_Total_"+page_number)
            new_page = new_page.replace("Producto_Saldo_Costo_Unitario_Total","Producto_Saldo_Costo_Unitario_Total_"+page_number)
            new_page = new_page.replace("Producto_Saldo_Costo_Total_Total","Producto_Saldo_Costo_Total_Total_"+page_number)

            new_page = new_page.replace("print_header_fecha_pagina","Fecha "+getShortDateFormat(new Date(),'dd-mm-yyyy'));

            new_page = new_page.replace("print_body_agrupacion","print_body_agrupacion_"+(i+1))
            new_page = new_page.replace("print_body_totales","print_body_totales_"+(i+1))

            new_page = new_page.replace("print_body_codigo",detalle.Codigo)
            new_page = new_page.replace("print_body_descripcion", detalle.Nombre)
            new_page = new_page.replace("print_body_unidad", detalle.Unidad)
            new_page = new_page.replace("print_body_familia", detalle.Familia)
            new_page = new_page.replace("print_body_nro_serie", detalle.nro_serie)
            // new_page = new_page.replace("print_body_vencimiento", detalle.vcto)
            new_page = new_page.replace("print_body_tipo_producto", detalle.Tipo_Producto)
            new_page = new_page.replace("print_body_subfamilia", detalle.Subfamilia)

            new_page = new_page.replace("Documento_Fecha",detalle.Fecha)
            new_page = new_page.replace("Documento_Tipo",detalle.Tipo)
            new_page = new_page.replace("Documento_Numero",detalle.Serie +" - "+ detalle.Numero)

            if(detalle.Cantidad_Entrada>0){
                new_page = new_page.replace('visibility: hidden">Producto_Entrada_Cantidad', '">Producto_Entrada_Cantidad')
                new_page = new_page.replace('visibility: hidden">Producto_Entrada_Costo_Unitario', '">Producto_Entrada_Costo_Unitario')
                new_page = new_page.replace('visibility: hidden">Producto_Entrada_Costo_Total', '">Producto_Entrada_Costo_Total')
            }

            if(detalle.Cantidad_Salida>0){
                new_page = new_page.replace('visibility: hidden">Producto_Salida_Cantidad', '">Producto_Salida_Cantidad')
                new_page = new_page.replace('visibility: hidden">Producto_Salida_Costo_Unitario', '">Producto_Salida_Costo_Unitario')
                new_page = new_page.replace('visibility: hidden">Producto_Salida_Costo_Total', '">Producto_Salida_Costo_Total')
            }

            new_page = new_page.replace("Producto_Entrada_Cantidad", formatCurrency2(detalle.Cantidad_Entrada,detalle.dec_precio))
            new_page = new_page.replace("Producto_Entrada_Costo_Unitario", formatCurrency2(detalle.Costo_Entrada,detalle.dec_precio))
            new_page = new_page.replace("Producto_Entrada_Costo_Total", formatCurrency2(Costo_Total_Entrada,detalle.dec_precio))
            new_page = new_page.replace("Producto_Salida_Cantidad", formatCurrency2(detalle.Cantidad_Salida,detalle.dec_precio))
            new_page = new_page.replace("Producto_Salida_Costo_Unitario", formatCurrency2(detalle.Costo_Salida,detalle.dec_precio))
            new_page = new_page.replace("Producto_Salida_Costo_Total", formatCurrency2(Costo_Total_Salida,detalle.dec_precio))
            new_page = new_page.replace("Producto_Saldo_Cantidad", formatCurrency2(Cantidad_Saldo,detalle.dec_precio))
            new_page = new_page.replace("Producto_Saldo_Costo_Unitario", formatCurrency2(detalle.Costo_Saldo,detalle.dec_precio))
            new_page = new_page.replace("Producto_Saldo_Costo_Total", formatCurrency2(Costo_Total_Saldo,detalle.dec_precio))
            
            new_page = new_page.replace("Producto_Total_Agrupacion", "Total "+detalle.Nombre+" ----->")
            new_page = new_page.replace("Producto_Entrada_Cantidad_Sumatoria", formatCurrency2(Cantidad_Entrada_Sumatoria,detalle.dec_precio))
            new_page = new_page.replace("Producto_Entrada_Costo_Unitario_Sumatoria", formatCurrency2(Costo_Entrada_Sumatoria,detalle.dec_precio))
            new_page = new_page.replace("Producto_Entrada_Costo_Total_Sumatoria", formatCurrency2(Costo_Total_Entrada_Sumatoria,detalle.dec_precio))
            new_page = new_page.replace("Producto_Salida_Cantidad_Sumatoria", formatCurrency2(Cantidad_Salida_Sumatoria,detalle.dec_precio))
            new_page = new_page.replace("Producto_Salida_Costo_Unitario_Sumatoria", formatCurrency2(Costo_Salida_Sumatoria,detalle.dec_precio))
            new_page = new_page.replace("Producto_Salida_Costo_Total_Sumatoria", formatCurrency2(Costo_Total_Salida_Sumatoria,detalle.dec_precio))
            new_page = new_page.replace("Producto_Saldo_Cantidad_Sumatoria", formatCurrency2(Cantidad_Saldo_Sumatoria,detalle.dec_precio))
            new_page = new_page.replace("Producto_Saldo_Costo_Unitario_Sumatoria", formatCurrency2(Costo_Saldo_Sumatoria,detalle.dec_precio))
            new_page = new_page.replace("Producto_Saldo_Costo_Total_Sumatoria", formatCurrency2(Costo_Total_Saldo_Sumatoria,detalle.dec_precio))
            new_page = new_page.replace("fila_1","fila_"+(i+1))
            $("#print_page").append(new_page);
            
            $("#Producto_Entrada_Cantidad_Total_"+page_number).text(formatCurrency2(Cantidad_Entrada_Total,detalle.dec_precio));
            $("#Producto_Entrada_Costo_Unitario_Total_"+page_number).text(formatCurrency2(Costo_Entrada_Total,detalle.dec_precio));
            $("#Producto_Entrada_Costo_Total_Total_"+page_number).text(formatCurrency2(Costo_Total_Entrada_Total,detalle.dec_precio));
            $("#Producto_Salida_Cantidad_Total_"+page_number).text(formatCurrency2(Cantidad_Salida_Total,detalle.dec_precio));
            $("#Producto_Salida_Costo_Unitario_Total_"+page_number).text(formatCurrency2(Costo_Salida_Total,detalle.dec_precio));
            $("#Producto_Salida_Costo_Total_Total_"+page_number).text(formatCurrency2(Costo_Total_Salida_Total,detalle.dec_precio));
            $("#Producto_Saldo_Cantidad_Total_"+page_number).text("Total Saldo General =====> "+formatCurrency2(Cantidad_Saldo_Total,detalle.dec_precio));
            $("#Producto_Saldo_Costo_Unitario_Total_"+page_number).text(formatCurrency2(Costo_Saldo_Total,detalle.dec_precio));
            $("#Producto_Saldo_Costo_Total_Total_"+page_number).text(formatCurrency2(Costo_Total_Saldo_Total,detalle.dec_precio));
            
            content_height = $("#fila_"+(i+1)).css("height").replace("px","") * 1;
        }
    }
    for(var i=1;i<=page_number;i++){
        $("#print_paginacion_"+i).text($("#print_paginacion_"+i).text()+" de "+page_number);
    }
    
}


function descargarPDF(download){
    var estilos=

    '<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/themes/redmond/jquery-ui.css"> \n'+
    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css"> \n'+
    '<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"> \n'+
    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.37/css/bootstrap-datetimepicker.css"> \n'+
    '<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script> \n'+
    '<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js"></script> \n'+
    '<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.min.js"></script> \n'+
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script> \n'+
    '<link href="https://fonts.googleapis.com/css?family=Oswald&display=swap" rel="stylesheet"> \n'+
    '<script src="https://kit.fontawesome.com/c6f1e55cf2.js" crossorigin="anonymous"></script> \n'+
    '<link href="http://demo.erp-facturacionelectronica.com/css/styles.css" rel="stylesheet"> \n'+
    '<script src="http://demo.erp-facturacionelectronica.com/js/mensaje.js"></script> \n'

    var hoja=$("#formato_impresion").html();
    var impresion=estilos+ 
    '<style> \n'+
    'body{\n'+
        'background: #fff;\n'+
        'height: 1450px;\n'+
        'width: 1050px;\n'+
        'color: black;\n'+
        '}\n'+
    '</style> \n'+
    hoja;
    $.ajax({
        type: 'POST',
        url: '/ventas/descargar_pdf',
        data:{
            content: impresion,
            nameFile: "kardex"
        },
        success: function (result){
            if(download){
                window.open(result);
            }else{
                //Se necesita el usuario y clave del onedrive
                var odOptions = 
                {
                  clientId: "00000000-xxxxx-0000-xxxx-0000000000",
                  action: "save",  // upload was not valid
                  sourceInputElementId: "pdfFile",
                  //sourceUri: "", 
                  //fileName: filename,
                  openInNewWindow: true,
                  advanced: {endpointHint: "api.onedrive.com"},
                  success: function(files) { /* success handler */ },
                  progress: function(p) { /* progress handler */ },
                  cancel: function() { /* cancel handler */ },
                  error: function(e) { /* error handler */ }     
                }
                OneDrive.save(odOptions);
            }
        }
    });
}


function imprimir(){
    createTableFromGrid("table_grid","",cabecera_kardex);
    // grid_lista_productos.tableExport({
    //     formats: ["printHtmlTable"], //Tipo de archivos a exportar ("xlsx","txt", "csv", "xls")
    //     position: 'bottom',  // Posicion que se muestran los botones puedes ser: (top, bottom)
    //     bootstrap: false,//Usar lo estilos de css de bootstrap para los botones (true, false)
    //     fileName: $("#TitleHeader").text(),    //Nombre del archivo 
    //     columnas: 0,
    // });
}