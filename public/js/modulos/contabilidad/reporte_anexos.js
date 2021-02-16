
var url_tipos_auxiliar = '/tipo_auxiliar/lista';

var colNames=[];
var colModel=[];
var cabecera=[];

var filtrado = false;
var jq_formato_impresion;
var html_formato_impresion;

$(document).ready(function() {

  jq_formato_impresion = $("#print_page");
  html_formato_impresion = jq_formato_impresion.html();
  jq_formato_impresion.html("")
  jq_formato_impresion.append(html_formato_impresion);
  jq_formato_impresion.html(html_formato_impresion);

  setTitle("Reporte de Anexos");
  $("#imprimir").show();
  $("#exportar").show();
  tipo_reporte = $("#tipo_modulo").val();
  lista_mantenimientos_tipo_anexo = tipo_reporte=='cxc' ? '12' : '42';
  mantenimientos_multiselect = true;
  rellenar_codigo_nombre(url_tipos_auxiliar,"codigo_tipo_anexo",'',lista_mantenimientos_tipo_anexo,'change');
  rellenar_ejercicio_periodo();
  //cargar_tipo_reportes();

  $("#fecha_inicio").val(getFirstDate(new Date()));
  $("#fecha_termino").val(getLastDate(new Date()));
  
  $("#codigo_tipo_anexo").change(function(){
    lista_mantenimientos_tipo_anexo = $(this).val();
  });

  $("#ejercicio").change(function(){
    var periodo = getPeriodo(fecha_trabajo);
    periodo = periodo.replace(getEjercicio(fecha_trabajo),$(this).val());
    rellenar_codigo_nombre("/periodo_contable/periodo/"+$(this).val(),"periodo_inicio",'',periodo);
    rellenar_codigo_nombre("/periodo_contable/periodo/"+$(this).val(),"periodo_final",'',periodo);
  });
  $("#filtrar").click(function(){
    filtrado=true;
    jq_formato_impresion.html("");
    cargar_reporte();
  });
  $("#exportar").click(function(){
    exportar_excel();
  });
  
});

async function rellenar_ejercicio_periodo(){
  await rellenar_codigo_nombre("/periodo_contable/ejercicio","ejercicio",'',getEjercicio(fecha_trabajo));
  // rellenar_codigo_nombre("/periodo_contable/periodo/"+$("#ejercicio").val(),"periodo_inicio",'',getPeriodo(fecha_trabajo));
  // rellenar_codigo_nombre("/periodo_contable/periodo/"+$("#ejercicio").val(),"periodo_final",'',getPeriodo(fecha_trabajo));
  rellenar_codigo_nombre_clase("/periodo_contable/periodo/"+$("#ejercicio").val(),"periodos",'',getPeriodo(fecha_trabajo));

}

function cargar_tipo_reporte(){
  
  var tipo_grid="reporte_anexos";

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
              }
          }
          cargar_reporte();
      }
  });
}

function cargar_reporte(){
  var cuentas = JSON.stringify([]);
  var anexos = JSON.stringify([]);
  if ($("#filtrar_cuentas").prop("checked") == false) {
    cuentas= $("#agrupacion1_text").attr("datos");
  }
  if ($("#filtrar_anexos").prop("checked") == false) {
    anexos=$("#agrupacion2_text").attr("datos");
  }
 
  $.ajax({
    type: 'POST',
    url: "/reporte_anexos/reporte_anexos",
    data:{
      ejercicio: $("#ejercicio").val(),
      tipo_anexo: $("#codigo_tipo_anexo").val(),
      periodo_inicial : $("#periodo_inicio").val(),
      periodo_final: $("#periodo_final").val(),
      cuentas: cuentas,
      anexos: anexos
    },
    success: function (result){
      console.log(result);
      if(result.length>0) rellenar_reporte_anexos(result);
    }
  });
}

function mantenimientos_multiselect_function (id) {
  console.log(id);
  switch(id){
    case "agrupacion1_text":
        $("#filtrar_cuentas").prop("checked",false);
    break;
    case "agrupacion2_text":
        $("#filtrar_anexos").prop("checked",false);
    break;
  }
};

function rellenar_reporte_anexos(data) {
  console.log(html_formato_impresion);
  jq_formato_impresion.append(html_formato_impresion);
  var page_height = 700;
  console.log(new Date())
  $(".print_header_ruc").text(data[0].Ruc_Empresa);
  $(".print_header_razon_social").text(data[0].Nombre_Empresa);
  $(".print_header_paginacion").text("Página 1");
  $(".print_header_fecha_pagina").text("Fecha");
  $(".print_header_horapagina").text("Hora");

  var header_height = $(".print_header").css("height").replace("px","") * 1;
  var footer_height = $(".print_footer").css("height").replace("px","") * 1;
  var content_height = $(".print_body_filas_id").css("height").replace("px","") * 1;
  $(".print_body").css("height",page_height - header_height - footer_height);

  var original_page = $("#print_page").html();
  var original_body = $(".print_body").html();
  var original_body_fila_detalle = $(".print_body_filas_id").html();
  var original_body_fila_agrupacion1 = $(".print_body_agrupacion1_cuenta_id").html();
  var original_body_fila_agrupacion2 = $(".print_body_agrupacion2_anexo_id").html();
  var original_body_fila_agrupacion3 = $(".print_body_agrupacion3_documento_id").html();
  
  var original_body_fila_totales1 = $(".print_body_agrupacion_totales1_id").html();
  var original_body_fila_totales2 = $(".print_body_agrupacion_totales2_id").html();
  var original_body_fila_totales3 = $(".print_body_agrupacion_totales3_id").html();
  
  var original_body_fila_footer = $(".print_footer_filas_id").html();

  $(".print_body").html("")
  $(".print_footer").html("")
  
  var page_number=0;
  var new_page = original_page;

  var agrupaciones1="";
  var agrupaciones2="";
  var agrupaciones3="";


  var documento_saldo_mn=0;
  var documento_saldo_me=0;

  var total2_debe_soles = 0;
  var total2_haber_soles = 0;
  var total2_saldo_soles = 0;
  var total2_debe_dolares = 0;
  var total2_haber_dolares = 0;
  var total2_saldo_dolares = 0;
  
  var total1_debe_soles = 0;
  var total1_haber_soles = 0;
  var total1_saldo_soles = 0;
  var total1_debe_dolares = 0;
  var total1_haber_dolares = 0;
  var total1_saldo_dolares = 0;

  var footer_totales_debe_soles = 0;
  var footer_totales_haber_soles = 0;
  var footer_totales_saldo_soles = 0;
  var footer_totales_debe_dolares = 0;
  var footer_totales_haber_dolares = 0;
  var footer_totales_saldo_dolares = 0;


  for(var i = 0; i<data.length; i++){

    var new_fila=original_body_fila_detalle;

    var new_agrupaciones1=original_body_fila_agrupacion1;
    var new_agrupaciones2=original_body_fila_agrupacion2;
    var new_agrupaciones3=original_body_fila_agrupacion3;

    var new_totales1=original_body_fila_totales1;
    var new_totales2=original_body_fila_totales2;
    var new_totales3=original_body_fila_totales3;

    var new_footer=original_body_fila_footer;

    if(agrupaciones1!=data[i].Cuenta){
      agrupaciones1 = data[i].Cuenta;
      new_agrupaciones1 = new_agrupaciones1.replace('agrupacion1_cuenta', data[i].Cuenta +" "+data[i].Nombre_Cuenta);
      $(".print_body").append(new_agrupaciones1);
      agrupaciones2 = data[i].Codigo_Auxiliar;
      new_agrupaciones2 = new_agrupaciones2.replace('agrupacion2_anexo', "ANEXO: "+data[i].Nombre_Auxiliar);
      $(".print_body").append(new_agrupaciones2);
      agrupaciones3 = data[i].Tipo_Doc_origen + " " + data[i].Serie_Ref_origen +" - "+data[i].Numero_Ref__origen;
      new_agrupaciones3 = new_agrupaciones3.replace('agrupacion3_documento', agrupaciones3);
      $(".print_body").append(new_agrupaciones3);
      documento_saldo_mn=0;
      documento_saldo_me=0;

      total1_debe_soles = 0;
      total1_haber_soles = 0;
      total1_saldo_soles = 0;
      total1_debe_dolares = 0;
      total1_haber_dolares = 0;
      total1_saldo_dolares = 0;

      total2_debe_soles = 0;
      total2_haber_soles = 0;
      total2_saldo_soles = 0;
      total2_debe_dolares = 0;
      total2_haber_dolares = 0;
      total2_saldo_dolares = 0;

    }else if(agrupaciones2!=data[i].Codigo_Auxiliar){
      agrupaciones2 = data[i].Codigo_Auxiliar;
      new_agrupaciones2 = new_agrupaciones2.replace('agrupacion2_anexo', "ANEXO: "+data[i].Nombre_Auxiliar);
      $(".print_body").append(new_agrupaciones2);
      agrupaciones3 = data[i].Tipo_Doc_origen + " " + data[i].Serie_Ref_origen +" - "+data[i].Numero_Ref__origen;
      new_agrupaciones3 = new_agrupaciones3.replace('agrupacion3_documento', agrupaciones3);
      $(".print_body").append(new_agrupaciones3);
      documento_saldo_mn=0;
      documento_saldo_me=0;

      total2_debe_soles = 0;
      total2_haber_soles = 0;
      total2_saldo_soles = 0;
      total2_debe_dolares = 0;
      total2_haber_dolares = 0;
      total2_saldo_dolares = 0;

    }else if(agrupaciones3!=data[i].Tipo_Doc_origen + " " + data[i].Serie_Ref_origen +" - "+data[i].Numero_Ref__origen){
      agrupaciones3 = data[i].Tipo_Doc_origen + " " + data[i].Serie_Ref_origen +" - "+data[i].Numero_Ref__origen;
      new_agrupaciones3 = new_agrupaciones3.replace('agrupacion3_documento', agrupaciones3);
      $(".print_body").append(new_agrupaciones3);
      documento_saldo_mn=0;
      documento_saldo_me=0;
    }
    //Codigo_Auxiliar
    //Nombre_Auxiliar
    documento_saldo_mn = documento_saldo_mn + data[i].Debe - data[i].Haber;
    documento_saldo_me = documento_saldo_mn + data[i].Debe_me - data[i].Haber_me;
    
    total2_debe_soles +=data[i].Debe;
    total2_haber_soles +=data[i].Haber;
    total2_saldo_soles += (data[i].Debe - data[i].Haber);
    total2_debe_dolares +=data[i].Debe_me;
    total2_haber_dolares +=data[i].Haber_me;
    total2_saldo_dolares += (data[i].Debe_me - data[i].Haber_me);

    total1_debe_soles +=data[i].Debe;
    total1_haber_soles +=data[i].Haber;
    total1_saldo_soles += (data[i].Debe - data[i].Haber);
    total1_debe_dolares +=data[i].Debe_me;
    total1_haber_dolares +=data[i].Haber_me;
    total1_saldo_dolares += (data[i].Debe_me - data[i].Haber_me);
    
    footer_totales_debe_soles +=data[i].Debe;
    footer_totales_haber_soles +=data[i].Haber;
    footer_totales_saldo_soles += (data[i].Debe - data[i].Haber);
    footer_totales_debe_dolares +=data[i].Debe_me;
    footer_totales_haber_dolares +=data[i].Haber_me;
    footer_totales_saldo_dolares += (data[i].Debe_me - data[i].Haber_me);


    new_fila = new_fila.replace('body_voucher',"&nbsp&nbsp&nbsp&nbsp&nbsp"+data[i].Voucher +' '+data[i].Numero);
    new_fila = new_fila.replace('body_fecha_registro',data[i].Fecha_Registro);
    new_fila = new_fila.replace('body_fecha_emision',data[i].Fecha_Emision);
    new_fila = new_fila.replace('body_tippo',data[i].Tipo_Doc);
    new_fila = new_fila.replace('body_serie',data[i].Serie_Ref);
    new_fila = new_fila.replace('body_numero',data[i].Numero_Ref);
    new_fila = new_fila.replace('body_fecha_vencimiento',data[i].Fecha_Vencimiento);
    new_fila = new_fila.replace('body_moneda',data[i].Moneda);
    new_fila = new_fila.replace('body_tc',formatCurrency2(data[i].tc,3));
    new_fila = new_fila.replace('body_glosa',data[i].Glosa);
    new_fila = new_fila.replace('body_debe_soles',formatCurrency2(data[i].Debe,2));
    new_fila = new_fila.replace('body_haber_soles',formatCurrency2(data[i].Haber,2));
    new_fila = new_fila.replace('body_saldo_soles',formatCurrency2(documento_saldo_mn,2));
    new_fila = new_fila.replace('body_debe_dolares',formatCurrency2(data[i].Debe_me,2));
    new_fila = new_fila.replace('body_haber_dolares',formatCurrency2(data[i].Haber_me,2));
    new_fila = new_fila.replace('body_saldo_dolares',formatCurrency2(documento_saldo_me,2));
    $(".print_body").append(new_fila);
    
    if(i+1 >= data.length || (agrupaciones2!=data[i+1].Codigo_Auxiliar || agrupaciones1!=data[i+1].Cuenta )){
      new_totales2 = new_totales2.replace('agrupacion_totales2', "Total x "+data[i].Nombre_Auxiliar);
      new_totales2 = new_totales2.replace('total2_debe_soles', formatCurrency2(total2_debe_soles,2));
      new_totales2 = new_totales2.replace('total2_haber_soles', formatCurrency2(total2_haber_soles,2));
      new_totales2 = new_totales2.replace('total2_saldo_soles', formatCurrency2(total2_saldo_soles,2));
      new_totales2 = new_totales2.replace('total2_debe_dolares', formatCurrency2(total2_debe_dolares,2));
      new_totales2 = new_totales2.replace('total2_haber_dolares', formatCurrency2(total2_haber_dolares,2));
      new_totales2 = new_totales2.replace('total2_saldo_dolares', formatCurrency2(total2_saldo_dolares,2));
      $(".print_body").append(new_totales2);
    }
    if(i+1 >= data.length || agrupaciones1!=data[i+1].Cuenta){
      new_totales1 = new_totales1.replace('agrupacion_totales1', "Total cuenta "+data[i].Cuenta);
      new_totales1 = new_totales1.replace('total1_debe_soles', formatCurrency2(total2_debe_soles,2));
      new_totales1 = new_totales1.replace('total1_haber_soles', formatCurrency2(total2_haber_soles,2));
      new_totales1 = new_totales1.replace('total1_saldo_soles', formatCurrency2(total2_saldo_soles,2));
      new_totales1 = new_totales1.replace('total1_debe_dolares', formatCurrency2(total2_debe_dolares,2));
      new_totales1 = new_totales1.replace('total1_haber_dolares', formatCurrency2(total2_haber_dolares,2));
      new_totales1 = new_totales1.replace('total1_saldo_dolares', formatCurrency2(total2_saldo_dolares,2));
      $(".print_body").append(new_totales1);
    }
    if(i+1 >= data.length){
      new_footer = new_footer.replace('footer_totales', "Total General ---->");
      new_footer = new_footer.replace('footer_totales_debe_soles', formatCurrency2(footer_totales_debe_soles,2));
      new_footer = new_footer.replace('footer_totales_haber_soles', formatCurrency2(footer_totales_haber_soles,2));
      new_footer = new_footer.replace('footer_totales_saldo_soles', formatCurrency2(footer_totales_saldo_soles,2));
      new_footer = new_footer.replace('footer_totales_debe_dolares', formatCurrency2(footer_totales_debe_dolares,2));
      new_footer = new_footer.replace('footer_totales_haber_dolares', formatCurrency2(footer_totales_haber_dolares,2));
      new_footer = new_footer.replace('footer_totales_saldo_dolares', formatCurrency2(footer_totales_saldo_dolares,2));
      $(".print_footer").append(new_footer);
    }
    console.log(data[i].Nombre_Auxiliar);
  }

}