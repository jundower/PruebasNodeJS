
var url_cuentas_corrientes = '/cuentas_corrientes/lista/todos';
var url_tipos_auxiliar = '/tipo_auxiliar/lista';
var tipo_reporte="";

var colNames=[];
var colModel=[];
var cabecera=[];
var filtrado = false;
var banco_seleccionado=[];

var cell_edited_row="";
var cell_edited_col="";


var lista={
  codigo_anexo : "codigo_anexo",
  Nombre_Anexo : "codigo_anexo",
  tipo : "tipo_documento",
  serie: "serie_documento",
}


$(document).ready(function() {
  setTitle("Programación de Vencimientos");
  $("#listar").show();
  $("#imprimir").show();
  $("#exportar").show();
  // tipo_reporte = $("#tipo_modulo").val();
  tipo_reporte = '42';
  // lista_mantenimientos_tipo_anexo = tipo_reporte=='cxc' ? '12' : '42';
  lista_mantenimientos_tipo_anexo = '42';
  mantenimientos_multiselect=true;
  cargar_tipo_reporte();
  rellenar_codigo_nombre(url_cuentas_corrientes,"codigo_caja_banco",'','',"change");
  rellenar_codigo_nombre(url_tipos_auxiliar,"codigo_tipo_anexo",'',tipo_reporte);

  $("#fecha_inicio").val(getFirstDate(new Date()));
  $("#fecha_termino").val(getLastDate(new Date()));

  $("#agrupacion1").change(function(){
    groupingGrid();
    $("#agrupacion1_text").val("");
    $("#agrupacion1_todos").prop("checked",true);
  })
  $("#agrupacion2").change(function(){
      groupingGrid();
      $("#agrupacion2_text").val("");
      $("#agrupacion2_todos").prop("checked",true);
  })
  $("#agrupacion3").change(function(){
      groupingGrid();
      $("#agrupacion3_text").val("");
      $("#agrupacion3_todos").prop("checked",true);
  })
  $("#agrupacion1_todos").change(function() {
      if(this.checked) {
          $("#agrupacion1_text").val("");
      }
  });
  $("#agrupacion2_todos").change(function() {
      if(this.checked) {
          $("#agrupacion2_text").val("");
      }
  });
  $("#agrupacion3_todos").change(function() {
      if(this.checked) {
          $("#agrupacion3_text").val("");
      }
  });
  $("#codigo_caja_banco").change(function() {
    $.ajax({
      type: 'POST',
      url: "/cuentas_corrientes/lista/"+$(this).val(),
      success: function (lists){
        banco_seleccionado = lists[0];
        $("#filtrar").click();
      }
    });

  });
  $("#filtrar").click(function(){
    filtrado=true;
    cargar_reporte();
  });
  $("#exportar").click(function(){
    exportar_excel();
  });
  
  setListaDocumentos('/provisiones/programacion_vencimientos/lista', '', '', '', 'listado_documento_programacion_masiva', '')

  $("#generar_tc").click(function(){
    guardar();
  });
});

function groupingGrid(){
  var group1 = $("#agrupacion1").val();
  var group2 = $("#agrupacion2").val();
  var group3 = $("#agrupacion3").val();

  $("#agrupacion1_text").attr("tabla",lista[group1]);
  $("#agrupacion2_text").attr("tabla",lista[group2]);
  $("#agrupacion3_text").attr("tabla",lista[group3]);

  var grouping = [];

  if(group1!="Ninguno") grouping.push(group1);
  if(group2!="Ninguno") grouping.push(group2);
  if(group3!="Ninguno") grouping.push(group3);
  grouping.length>0 ? $("#grid_reporte").jqGrid('groupingGroupBy',grouping,{
      groupSummary : [true,true,true],
      groupText : ['Agrupación 1: {0}', 'Agrupación 2: {0}', 'Agrupación 3: {0}'],
      showSummaryOnHide: true,
  }) : $("#grid_reporte").jqGrid('groupingRemove',true);
  groupingList=grouping;
}

function cargar_tipo_reporte(){
  // var tipo_grid="programacion_vencimientos_"+tipo_reporte;

  var tipo_grid="programacion_masivos_cxp";

  $.ajax({
      type: 'POST',
      url: "/configurar_tablas/generar",
      data:{
          modulo: tipo_grid
      },
      success: function (lists){
          var configuracion_width= lists[0];
          var configuracion_visibilidad= lists[1];
          var configuracion_formato= lists[4];
          var configuracion_editable= lists[5];
          var templates={0:textTemplate,1:numberTemplate,2:currencyTemplate,3:realTemplate,4:dateTemplate2,5:cantidadTemplate};
                  
          colNames=[];
          colModel=[];
          cabecera=[];
          $("#agrupacion1").html("");
          $("#agrupacion2").html("");
          $("#agrupacion3").html("");
          
          $("#agrupacion1").append(new Option("Ninguno", "Ninguno"))
          $("#agrupacion2").append(new Option("Ninguno", "Ninguno"))
          $("#agrupacion3").append(new Option("Ninguno", "Ninguno"))

          for(var i=3 ; i<Object.keys(configuracion_visibilidad).length; i++)
          {
              var col_nombre=Object.keys(configuracion_visibilidad)[i];

              colNames.push(col_nombre);

              var codigo_formato=configuracion_formato[Object.keys(configuracion_formato)[i]];

              var element=
                {
                    name:col_nombre,
                    index:col_nombre,
                    width:configuracion_width[col_nombre],
                    editable:((configuracion_editable[Object.keys(configuracion_editable)[i]]=='1') ? true:false),
                    hidden:((configuracion_visibilidad[col_nombre]=='1') ? true:false),
                    template:templates[codigo_formato],
                }
                
              switch(element.name){
                case "importe_soles":
                case "pago_soles":
                case "saldo_soles":
                case "importe_dolares":
                case "pago_dolares":
                case "saldo_dolares":
                case "vencidos":
                case "0-30":
                case "31-60":
                case "61-90":
                case "91 a mas":
                case "importe_a_pagar":
                    element.summaryType='sum'
                break;
                case "Seleccionar":
                  element.formatter = "checkbox"
                  element.align = "center"
                  element.editoptions = { value: '1:0' }
                  element.formatoptions = { disabled: false }
                break;
              }
              colModel.push(element);
              if(!element.hidden)
              {
                  cabecera.push(col_nombre);
                  $("#agrupacion1").append(new Option(col_nombre,col_nombre));
                  $("#agrupacion2").append(new Option(col_nombre,col_nombre));
                  $("#agrupacion3").append(new Option(col_nombre,col_nombre));
              }
          }
          $("#agrupacion1_text").attr("tabla","");
          $("#agrupacion2_text").attr("tabla","");
          $("#agrupacion3_text").attr("tabla","");
          // cargar_reporte();
      }
  });
}

function cargar_reporte(){

  var jq_grid =  $("#grid_reporte");
  jq_grid.jqGrid('GridUnload');

  jq_grid.jqGrid({
      url: "/provisiones/reporte_programacion_vencimientos",
      mtype: "POST",
      postData:{
          tipo_anexo: $("#codigo_tipo_anexo").val(),
          punto_venta: $("#punto_venta").val(),
          tipo_estado: $("input[name='filtrar_tipo_estado']:checked").val(),
          tipo_fecha: $("input[name='filtrar_tipo_fecha']:checked").val(),
          tipo_moneda: $("input[name='filtrar_tipo_moneda']:checked").val(),
          moneda: $("#moneda").val(),
          moneda_banco: banco_seleccionado.Moneda,
          fecha_inicio: $("#fecha_inicio").val(),
          fecha_termino: $("#fecha_termino").val(),
          agrupacion1_tipo: $("#agrupacion1").val(),
          agrupacion1_valores: $("#agrupacion1_text").val(),
          agrupacion2_tipo: $("#agrupacion2").val(),
          agrupacion2_valores: $("#agrupacion2_text").val(),
          agrupacion3_tipo: $("#agrupacion3").val(),
          agrupacion3_valores: $("#agrupacion3_text").val(),
      },
      datatype: "json",
      colNames: colNames,
      colModel: colModel,
      rowNum:-1,
      width: 1500,
      height: 400,
      rowList:[50,500,5000,50000],
      viewrecords: true,
      shrinkToFit: false,
      rownumbers: true,
      loadonce: true, 
      hidegrid:false,
      footerrow : true,
      cellEdit:true,
      caption:"&nbsp;",
      pager: 'grid_reporte-pager',
      loadComplete:function(data){
        var colSum_importe_soles = jq_grid.jqGrid('getCol', 'importe_soles', false, 'sum');
        var colSum_pago_soles = jq_grid.jqGrid('getCol', 'pago_soles', false, 'sum');

        var colSum_importe_dolares = jq_grid.jqGrid('getCol', 'importe_dolares', false, 'sum');
        var colSum_pago_dolares = jq_grid.jqGrid('getCol', 'pago_dolares', false, 'sum');

        var colSum_vencidos = jq_grid.jqGrid('getCol', 'vencidos', false, 'sum');
        var colSum_0_30 = jq_grid.jqGrid('getCol', '0-30', false, 'sum');
        var colSum_31_60 = jq_grid.jqGrid('getCol', '31-60', false, 'sum');
        var colSum_61_90 = jq_grid.jqGrid('getCol', '61-90', false, 'sum');
        var colSum_91_a_mas = jq_grid.jqGrid('getCol', '91 a mas', false, 'sum');

        var colSum_importe_a_pagar = jq_grid.jqGrid('getCol', 'importe_a_pagar', false, 'sum');

        jq_grid.jqGrid('footerData', 'set', { 'importe_soles': colSum_importe_soles });
        jq_grid.jqGrid('footerData', 'set', { 'pago_soles': colSum_pago_soles });
        jq_grid.jqGrid('footerData', 'set', { 'saldo_soles': colSum_importe_soles - colSum_pago_soles });

        jq_grid.jqGrid('footerData', 'set', { 'importe_dolares': colSum_importe_dolares });
        jq_grid.jqGrid('footerData', 'set', { 'pago_dolares': colSum_pago_dolares });
        jq_grid.jqGrid('footerData', 'set', { 'saldo_dolares': colSum_importe_dolares - colSum_pago_dolares });
        
        jq_grid.jqGrid('footerData', 'set', { 'vencidos': colSum_vencidos });
        jq_grid.jqGrid('footerData', 'set', { '0-30': colSum_0_30 });
        jq_grid.jqGrid('footerData', 'set', { '31-60': colSum_31_60 });
        jq_grid.jqGrid('footerData', 'set', { '61-90': colSum_61_90 });
        jq_grid.jqGrid('footerData', 'set', { '91 a mas': colSum_91_a_mas });
        jq_grid.jqGrid('footerData', 'set', { 'importe_a_pagar': colSum_importe_a_pagar });

        setTimeout(function() { 
          if(filtrado){
            groupingGrid();
            filtrado=false;
          }
          var rows= jq_grid.jqGrid('getRowData');
          var dataIDs = jq_grid.getDataIDs();
          for(var i=0;i<rows.length;i++){
              var row=rows[i];
              if(Number(row["dias_vencidos"])<0){
                jq_grid.jqGrid('setCell',dataIDs[i],"dias_vencidos","",{color:'red'});

              }else{
                jq_grid.jqGrid('setCell',dataIDs[i],"dias_vencidos","",{color:'black'});
              }    
          }
        },  100);
        
            
      },
      afterEditCell: function(rowid, cellname, value, iRow, iCol){
        cell_edited_row = iRow;
        cell_edited_col = iCol;
      }
      
  });
  resize_jqgrid_restar(jq_grid,($("#myTab").css("height").replace("px",""))*1 + 200,80);
  jq_grid.jqGrid('filterToolbar',{stringResult: true, searchOnEnter : false, searchOperators : true});
  jq_grid.jqGrid('setGroupHeaders', {
    useColSpanStyle: true, 
    groupHeaders:[
      {startColumnName: 'tipo', numberOfColumns: 3, titleText: 'Documento'},
      {startColumnName: 'importe_soles', numberOfColumns: 3, titleText: 'Moneda Nacional'},
      {startColumnName: 'importe_dolares', numberOfColumns: 3, titleText: 'Moneda Extranjera'},
    ]	
  });
}

function imprimir(){
  crear_reporte_html();
  window.print();
}

function mantenimientos_multiselect_function(id){
  switch(id){
      case "agrupacion1_text":
          $("#agrupacion1_todos").prop("checked",false);
      break;
      case "agrupacion2_text":
          $("#agrupacion2_todos").prop("checked",false);
      break;
      case "agrupacion3_text":
          $("#agrupacion3_todos").prop("checked",false);
      break;
  }
  
}

function exportar_excel(){
  crear_reporte_html();
  $("#gview_grid_reporte_body_print").tableExport({
    formats: ["xlsx"], //Tipo de archivos a exportar ("xlsx","txt", "csv", "xls")
    position: 'bottom',  // Posicion que se muestran los botones puedes ser: (top, bottom)
    bootstrap: false,//Usar lo estilos de css de bootstrap para los botones (true, false)
    fileName: $("#modulo").text(),    //Nombre del archivo 
  });
}

function crear_reporte_html(){

  
  $("#printable").html("");
  var cabecera = $(".ui-jqgrid-htable > thead").html();
  var body = $("#grid_reporte").html();
  var footer = $(".ui-jqgrid-ftable > tbody").html();
  $("#printable").append('<div class="ui-jqgrid-jquery-ui ui-widget ui-widget-content ui-corner-all ui-jqgrid" id="gbox_grid_reporte" dir="ltr" ><div class="ui-jqgrid-view" role="grid" aria-multiselectable="false" id="gview_grid_reporte"><div class="ui-widget-header ui-corner-top ui-jqgrid-titlebar ui-jqgrid-caption" ><span class="ui-jqgrid-title">&nbsp;</span></div><div class="ui-state-default ui-corner-top ui-jqgrid-hdiv" style="background: #fcfdfd"><div class="ui-jqgrid-hbox" style="padding-right: 0px;"><table class="ui-jqgrid-htable" style="width:1px" role="presentation" aria-labelledby="gbox_grid_reporte" id="gview_grid_reporte_body_print"></table></div></div></div>')
  

  $("#gview_grid_reporte_body_print").append("<thead id='gview_grid_reporte_header'>"+cabecera+"</thead>")
  $("#gview_grid_reporte_body_print").append(body)
  $("#gview_grid_reporte_body_print").append("<tfoot>"+footer+"</tfoot>")

  $("#gview_grid_reporte_header > .ui-search-toolbar").remove()
  $("#gview_grid_reporte_body_print > thead tr th[style*='display: none']").remove();
  $("#gview_grid_reporte_body_print > tbody tr td[style*='display:none']").remove();
  $("#gview_grid_reporte_body_print > tfoot tr td[style*='display:none']").remove();
}
$(window).bind('resize', function() {
  var jq_grid =  $("#grid_reporte");
  resize_jqgrid_restar(jq_grid,($("#myTab").css("height").replace("px",""))*1 + 200,80);
});

function fnExcelReport()
{


    var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";
    var textRange; var j=0;
    tab = document.getElementById('gview_grid_reporte_body_print'); // id of table

    for(j = 0 ; j < tab.rows.length ; j++) 
    {     
        tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
        //tab_text=tab_text+"</tr>";
    }

    tab_text=tab_text+"</table>";
    tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
    tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE "); 

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        txtArea1.document.open("txt/html","replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus(); 
        sa=txtArea1.document.execCommand("SaveAs",true,"Say Thanks to Sumit.xls");
    }  
    else                 //other browser not tested on IE 11
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));  

    return (sa);
}

function validar(){
  var jq_grid =  $("#grid_reporte");
  jq_grid.saveCell(cell_edited_row,cell_edited_col);
}

function guardar(){
  var texto="";
  var arrayGuardar=[];
  var jq_grid =  $("#grid_reporte");
  var dataIDs = jq_grid.getDataIDs();
  for(var i=0; i<dataIDs.length; i++){
    var row = jq_grid.getRowData(dataIDs[i]);
    if(row.Seleccionar == "1"){
      arrayGuardar.push({
        voucher_contable: row.voucher_contable,
        numero_contable: row.numero_contable,
        codigo_anexo: row.codigo_anexo,
        tipo_doc: row.tipo,
        serie_doc: row.serie,
        numero_doc: row.numero,
        fecha_contable: getDateFormat(row.fecha_contable,'d/m/y','y/m/d','/','/'),
        fecha_emision: getDateFormat(row.fecha_emision,'d/m/y','y/m/d','/','/'),
        fecha_vencimiento: getDateFormat(row.fecha_vencimiento,'d/m/y','y/m/d','/','/'),
        moneda_doc: row.moneda,
        tc: row.tc,
        importe_soles: row.importe_soles,
        pago_soles: row.pago_soles,
        importe_dolares: row.importe_dolares,
        pago_dolares: row.pago_dolares,
        Import: row.importe_a_pagar,
        Cuenta_contable: row.Cuenta_Contable
      });
      texto+=row.voucher_contable+'|';
      texto+=row.numero_contable+'|';
      texto+=row.codigo_anexo+'|';
      texto+=row.tipo+'|';
      texto+=row.serie+'|';
      texto+=row.numero+'|';
      texto+=getDateFormat(row.fecha_contable,'d/m/y','y/m/d','/','/')+'|';
      texto+=getDateFormat(row.fecha_emision,'d/m/y','y/m/d','/','/')+'|';
      texto+=getDateFormat(row.fecha_vencimiento,'d/m/y','y/m/d','/','/')+'|';
      texto+=row.moneda+'|';
      texto+=row.tc+'|';
      texto+=row.importe_soles+'|';
      texto+=row.pago_soles+'|';
      texto+=row.importe_dolares+'|';
      texto+=row.pago_dolares+'|';
      texto+=row.importe_a_pagar+'|';
      texto+=row.Cuenta_Contable+'|';
      texto+="\r\n";
    }
  }
  var today= new Date();
  $.ajax({
    type: 'POST',
    url: "/provisiones/programacion_vencimientos/guardar/",
    data:{
      today: getShortDate(today,"dd-mm-yyyy"),
      tipo_anexo: lista_mantenimientos_tipo_anexo,
      ctacte_codigo: banco_seleccionado.Codigo,
      ctacte_nombre: banco_seleccionado.Nombre,
      ctacte_banco: banco_seleccionado.Codigo_Banco,
      ctacte_moneda: banco_seleccionado.Moneda,
      ctacte_cuenta_contable: banco_seleccionado.Codigo_Cuenta_Contable,
      anio: today.getFullYear(),
      filas_detalle: JSON.stringify(arrayGuardar),
    },
    success: function (lists){
      console.log(lists);
      if(lists.estado==true){
        var blob = new Blob([texto], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "TLC COD_CTA "+banco_seleccionado.Codigo_Banco+" "+banco_seleccionado.Codigo+".txt");
      }
    }
  });

}

function listar(){
  jq_modal_ventana_lista.modal('show');
}
function consultar(){

}