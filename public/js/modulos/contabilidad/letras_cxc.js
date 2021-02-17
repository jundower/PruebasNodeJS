var fecha_trabajo=new Date();
var short_fecha_trabajo="";
var url_motivo_tramites="/talonarios/motivos_serie_correlativo";
var url_configuraciones="/provisiones/configuraciones";
var url_ejercicio = "/periodo_contable/ejercicio";
var url_periodo = "/periodo_contable/lista";
var url_detalle_letra = "/letras/detalle";
var url_aval = "/clientes/lista_aval";
//var url_guardar = "/pedido/guardar";

var subvoucher = "subvoucher";
var moneda = "moneda";
var tipo_documento_referencia = "tipo_documento_referencia";
var tipo_documento = "tipo_documento";
var fecha_canje = "fecha_canje";
var fecha_registro = "fecha_registro";
var tipo_letra = "tipo_letra";
var tipo_anexo = "tipo_anexo";
var tipo_cambio = "tipo_cambio";
var tasa_cambio = "tasa_cambio";
var serie_referencia = "serie_referencia";
var numero_referencia = "numero_referencia";
var serie = "serie";
var numero = "numero";
var dias = "dias";
var fecha_vencimiento = "fecha_vencimiento";
var ejercicio = "ejercicio";
var periodo = "periodo";
var numero_documento = "numero_documento";
var codigo_anexo = "codigo_anexo";
var nombre_anexo = "nombre_anexo";
var importe = "importe";
var fecha_emision = "fecha_emision";
var glosa = "glosa";
var aval = "aval";



Tipo_Documento_Guia = "";

var modal_ventana_lista = "modal_ventana_lista";

var jq_subvoucher;
var jq_guia_entrada;
var jq_moneda;
var jq_tipo_documento_referencia;
var jq_tipo_documento;
var jq_fecha_canje;
var jq_fecha_registro;
var jq_tipo_letra;
var jq_tipo_anexo;
var jq_tipo_cambio;
var jq_tasa_cambio;
var jq_serie_referencia;
var jq_numero_referencia;
var jq_serie;
var jq_numero;
var jq_dias;
var jq_fecha_vencimiento;
var jq_ejercicio;
var jq_periodo;
var jq_numero_documento;
var jq_codigo_anexo;
var jq_nombre_anexo;
var jq_importe;
var jq_fecha_emision;
var jq_glosa;
var jq_aval;


var modulo="";
var numero_documento_contable;
var jq_modal_ventana_lista;
var fila_vacia_grid_detalle_letras={};

var jq_grid_detalle_letras;

$(document).ready(function() {

    jq_modal_ventana_lista = $("#"+modal_ventana_lista);
   
    jq_subvoucher = $("#"+subvoucher);
    jq_moneda = $("#"+moneda);
    jq_tipo_documento_referencia = $("#"+tipo_documento_referencia);
    jq_tipo_documento = $("#"+tipo_documento);
    jq_fecha_canje = $("#"+fecha_canje);
    jq_fecha_registro = $("#"+fecha_registro);
    jq_tipo_letra = $("#"+tipo_letra);
    jq_tipo_anexo = $("#"+tipo_anexo);
    jq_tipo_cambio = $("#"+tipo_cambio);
    jq_tasa_cambio = $("#"+tasa_cambio);
    jq_serie_referencia = $("#"+serie_referencia);
    jq_numero_referencia = $("#"+numero_referencia);
    jq_serie = $("#"+serie);
    jq_numero = $("#"+numero);
    jq_dias = $("#"+dias);
    jq_fecha_vencimiento = $("#"+fecha_vencimiento);
    jq_ejercicio = $("#"+ejercicio);
    jq_periodo = $("#"+periodo);
    jq_numero_documento = $("#"+numero_documento);
    jq_codigo_anexo = $("#"+codigo_anexo);
    jq_nombre_anexo = $("#"+nombre_anexo);
    jq_importe = $("#"+importe);
    jq_fecha_emision = $("#"+fecha_emision);
    jq_glosa = $("#"+glosa);
    jq_aval = $("#"+aval);

    jq_grid_detalle_letras = $("#grid_detalle_letras");

    jq_tipo_anexo.change(function () {
        lista_mantenimientos_tipo_anexo = $(this).val();
        
    });
    jq_codigo_anexo.dblclick(function () {
        lista_mantenimientos_tipo_anexo = jq_tipo_anexo.val();
    });
    jq_moneda.change(function(){
        if(isEmptyOrWhiteSpaces(jq_moneda.val())){
            jq_moneda.val(" ");
        }
        var jq_grid = jq_grid_detalle_contable;
        var dataIDs = jq_grid.getDataIDs(); 
        dataIDs.forEach(rowid => {
            jq_grid.jqGrid('setCell',rowid,"Moneda_Referencia",jq_moneda.val());
        });
    });
    jq_tasa_cambio.change(function(){
        if(isEmptyOrWhiteSpaces(jq_tasa_cambio.val())){
            jq_tasa_cambio.val(" ");
        }
        var jq_grid = jq_grid_detalle_contable;
        var dataIDs = jq_grid.getDataIDs(); 
        dataIDs.forEach(rowid => {
            jq_grid.jqGrid('setCell',rowid,"Tipo_Cambio_Referencia",jq_tasa_cambio.val());
        });
    });
    jq_tipo_letra.change( function(){
        var url_documentos_pendientes = jq_tipo_letra.val() == 'CANJE'? '/provisiones':'.';
        setListaDocumentosContables(url_documentos_pendientes+'/lista_documentos_pendientes', 'listado_documento_contables');
    })

    $("#nuevo").show();
    $("#guardar").show();
    $("#listar").show();
    $("#imprimir").show();
    $('#modificar').hide();
    setTitle("Canje de Documentos a Letras");
    setTitleLista('Listado de Documentos');
    setListaDocumentos('/letras/lista', '/letras/consultar', '/letras/detalle','','listado_documentos_letras','LT');
    setListaDocumentosContables('/provisiones/lista_documentos_pendientes', 'listado_documento_contables');
    detalle_letras();
    nuevo();  
});

function nuevo(){

    estado="guardar";
    short_fecha_trabajo =  getShortDate(fecha_trabajo);
    jq_fecha_registro.prop( "disabled", true );
    jq_importe.val("0.00");

    rellenar_codigo_nombre(url_subvoucher_lista,"subvoucher",'','09');
    rellenar_codigo_nombre(url_tipo_auxiliar_lista,"tipo_anexo",'','12');
    rellenar_codigo_nombre(url_tipo_documento,"tipo_documento_referencia",'','00');
    rellenar_codigo_nombre(url_tipo_documento,"tipo_documento",'',"00");
    rellenar_ejercicio_contable("ejercicio",fecha_trabajo.getFullYear());
    rellenar_moneda(moneda);
    rellenar_tasa_cambio(tasa_cambio, short_fecha_trabajo,jq_tipo_cambio.val()) //Mantener este orden de tasa/tipo, porque si no, no funciona dinamicamente y siempre agarrará VTA
    rellenar_tipo_cambio(tipo_cambio,tasa_cambio, fecha_registro); //Mantener este orden de tasa/tipo, porque si no, no funciona dinamicamente y siempre agarrará VTA
    cargar_configuraciones();

    jq_fecha_registro.val(short_fecha_trabajo); 
    jq_fecha_canje.val(short_fecha_trabajo);
    jq_fecha_vencimiento.val(short_fecha_trabajo);
    jq_fecha_emision.val(short_fecha_trabajo);

    limpiar();
}

function limpiar(){
    jq_codigo_anexo.val("");
    jq_nombre_anexo.val("");
    jq_dias.val("0");
    jq_importe.val("0.00");
    jq_serie_referencia.val("");
    jq_numero_referencia.val("");
    jq_serie.val("");
    jq_numero.val("");
    jq_glosa.val("");

    var jq_grid=jq_grid_detalle_letras;
    jq_grid.jqGrid("setGridParam",{
        url: url_detalle_letra,
        mtype: "POST",
        datatype: "json",
        postData:{
            numero_documento_contable: ""
        }
    }).trigger("reloadGrid")
}

function calcular_valores(campo){
    
    var calculos = calcular_totales_contabilidad(
        {
            SubTotal: jq_subtotal.val(),
            SubTotal_Mixto: jq_mixta.val(),
            Igv: jq_impuesto.val(),
            Icbper: jq_icbper.val(),
            Total: jq_importe.val(),
            Porcentaje_Igv: jq_porcentaje_impuesto.val(),
            Porcentaje_Detraccion: 0,
            Porcentaje_Retencion_No_Domiciliado: 0,
            Porcentaje_Percepcion: 0,
            Tipo_Operacion: jq_destino_operacion.val(),
            Tasa_Cambio: jq_tasa_cambio.val(),
            Campo: campo,
            Moneda: jq_moneda.val(),
            Monto_Minimo_Detraccion: $("#"+detraccion_provisiones+" option:selected").attr("monto_minimo"),
            Monto_Minimo_IGV: $("#porcentaje_impuesto").attr("monto"),
            Aplicar_Renta_Cuarta: $("#porcentaje_impuesto").attr("renta_cuarta"),
        }
    )
    
    if(campo!="SubTotal") jq_subtotal.val((calculos.SubTotal).toFixed(2));
    if(campo!="Total") jq_importe.val((calculos.Total).toFixed(2));
    jq_impuesto.val((calculos.Igv).toFixed(2));
    if(campo!="ICBPER") jq_icbper.val((calculos.Icbper).toFixed(2));
    if(campo!="SubMixta") jq_mixta.val((calculos.SubTotal_Mixto).toFixed(2));

    // if(campo!="SubTotal") jq_subtotal.val((calculos.SubTotal));
    // if(campo!="Total") jq_importe.val((calculos.Total));
    // jq_impuesto.val((calculos.Igv));
    // if(campo!="ICBPER") jq_icbper.val((calculos.Icbper));
    // if(campo!="SubMixta") jq_mixta.val((calculos.SubTotal_Mixto));
    // jq_subtotal_2.val((calculos.SubTotal_2));
    // jq_importe_2.val((calculos.Total_2));
    // jq_impuesto_2.val((calculos.Igv_2));
    // jq_icbper_2.val((calculos.Icbper_2));
    // jq_mixta_2.val((calculos.SubTotal_Mixto_2));
    // jq_monto_retencion.val((calculos.Retencion_No_Domiciliado));
    // jq_monto_detraccion.val((calculos.Detraccion));
    // jq_percepcion.val((calculos.Percepcion));
    // jq_percepcion_2.val((calculos.Percepcion_2));
    rellenar_moneda_2();
}
function cargar_configuraciones(){
    $.ajax({
        type: 'POST',
        url: url_configuraciones,
        success: function (lists){
            lists.forEach(list=>{
                jq_moneda.val(list.moneda_trabajo);
                jq_tipo_cambio.val(list.ctipo_cambio);
                rellenar_tasa_cambio(tasa_cambio, short_fecha_trabajo,jq_tipo_cambio.val());
            });
        }
    });
}

function guardar() {
    url_guardar="";
    var mensaje="";
    var impresion=false;
    switch (estado) {
        case 'guardar':
            url_guardar = "/letras/guardar";
            mensaje = "Guardado satisfactoriamente."
            impresion=true;
            break;
        case  'modificar':
            url_guardar = "/letras/modificar";
            mensaje = "Modificado satisfactoriamente."
            break;
        case 'eliminar':
            url_guardar = "/letras/eliminar";
            mensaje = "Eliminado satisfactoriamente."
            break;
        case 'anular':
            url_guardar = "/letras/anular";
            mensaje = "Anulado satisfactoriamente."
            break;
    }

    var filas_detalle= [];
    var rows = jq_grid_detalle_letras.jqGrid('getDataIDs');

    rows.forEach(rowid => {
        var rowdata = jq_grid_detalle_letras.getRowData(rowid);
        rowdata.Fecha_Emision = getDateFormat(rowdata.Fecha_Emision, "d/m/y","y-m-d","/","-")
        rowdata.Fecha_Vencimiento = getDateFormat(rowdata.Fecha_Vencimiento, "d/m/y","y-m-d","/","-")
        rowdata.Fecha_Ref = getDateFormat(rowdata.Fecha_Ref, "d/m/y","y-m-d","/","-")
        filas_detalle.push(rowdata);
    });

     $.ajax({
         url: url_guardar,
         type: 'POST',
         data:{
             ejercicio: jq_ejercicio.val(),
             periodo: jq_periodo.val(),
             codigo_subvoucher: jq_subvoucher.val(),
             numero_correlativo: '',
             automatico: 'A',
             fecha_registro : jq_fecha_registro.val(),
             fecha_referencia: '1900/01/01',
             tipo_documento_referencia: jq_tipo_documento_referencia.val(),
             serie_documento_referencia: jq_serie_referencia.val(),
             numero_documento_referencia: jq_numero_referencia.val(),
             fecha_emision: jq_fecha_emision.val(),
             tipo_documento: jq_tipo_documento.val(),
             serie: jq_serie.val(),
             numero: jq_numero.val(),
             moneda: jq_moneda.val(),
             tipo_cambio: jq_tipo_cambio.val(),
             tasa_cambio: jq_tasa_cambio.val(),
             tipo_codigo_auxiliar: jq_tipo_anexo.val(),
             codigo_anexo: jq_codigo_anexo.val(),
             nombre_anexo: jq_nombre_anexo.val(),
             forma_pago: '00',
             dias: jq_dias.val(),
             fecha_vencimiento: jq_fecha_vencimiento.val(),
             Glosa: jq_glosa.val(),
             erp_Dsubtotal: 0,
             erp_Dsubtotal_No_Grabada: 0 ,
             porcentaje_impuesto: 0,
             erp_Digv: 0,
             erp_Dimporte: jq_importe.val(),
             fecha_canje: jq_fecha_canje.val(),
             registro_compra: 'N',
             destino_operacion: '004',
             modulo_origen: 'LT',
             estado: "Ingresado",
             contabilizada: 'N',
             detraccion_sn: 'N',
             porcentaje_detraccion: '0',
             monto_detraccion: '0',
             percepcion_sn: 'N',
             porcentaje_percepcion: 0,
             monto_percepcion: '0',
             tipo_letra: jq_tipo_letra.val(),
             Pc_Fecha: '1900/01/01',
             Pc_User: '',
             Pc_Ip: '',
             clasificacion_bien_servicio: '00',
             retension_no_domiciliado: 'N',
             retencion_no_domiciliado_sn: 'N',
             porcentaje_retencion_no_domiciliado: '0',
             monto_retencion: 0,
             erp_ICBPER: '0',
             tipo_transferencia: 'COB',
             concepto: 'NNUM_CTAXCOB',
             numero_documento_contable,
             codigo_aval: jq_aval.val(),
             
             filas_detalle: JSON.stringify(filas_detalle)
         },
         success: function(result){
            //  console.log(result);
            if(result.estado == true){
                jq_numero_documento.val(result.codigo);
               $("#guardar").prop("disabled", true);

               mostrarMensaje(mensaje,true,2000);
               if(estado!="eliminar") 
                   consultar(impresion);
               estado="Consultar";
            }
            else
               mostrarMensaje("Código de Error:  "+result.codigo+" " +result.mensaje,false,2000);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown,extra) { 
            mostrarMensaje("No se pudo guardar",false,2000);
        }
    });

}

function validar(){
    var retorno=true;
    if(isEmptyOrWhiteSpaces(jq_dias.val())) {
        jq_dias.val("0");
    }
    if(jq_tasa_cambio.val() * 1 == 0 ) {
        retorno = false;
        mostrarMensajeModal("Aviso","Tipo de cambio debe ser mayor a 0");
    }
    if(isEmptyOrWhiteSpaces(jq_codigo_anexo.val())) {
        retorno = false;
        mostrarMensajeModal("Aviso","Debe ingresar un cliente");
        //mensaje += "Debe ingresar un cliente. <br>";
    }
    // if(isEmptyOrWhiteSpaces(jq_numero_documento.val())) {
    //     retorno = false;
    //     mostrarMensajeModal("Aviso","Debe ingresar un número correlativo");
    // }
    if(isEmptyOrWhiteSpaces(jq_glosa.val())) {
        retorno = false;
        mostrarMensajeModal("Aviso","Debe ingresar la glosa");
    }

    return retorno;
};

async function consultar(impresion) {
    //var jq_grid=jq_grid_detalle_letras;
    //jq_grid.saveCell(rowid_selected_detalle_contable,selected_cell_detalle_contable);

    documentoSeleccionado = jq_grid_documentos.jqGrid("getGridParam", 'selrow');
    documentoSeleccionado = rowId_seleccionado;
    row_lista_documento_selected = jq_grid_documentos.jqGrid("getRowData", documentoSeleccionado);

    var data ={
        cob_pag: row_lista_documento_selected.Cob_Pag,
        ejercicio: row_lista_documento_selected.Ejercicio,
        periodo: row_lista_documento_selected.Periodo_Contable,
        numero_documento_contable: row_lista_documento_selected.Numero_Cta,
        subvoucher: row_lista_documento_selected.Codigo_Svoucher
    }
    if(impresion){
        data ={
            cob_pag: "",
            ejercicio: jq_ejercicio.val(),
            periodo: jq_periodo.val(),
            numero_documento_contable : jq_numero_documento.val(),
            subvoucher: jq_subvoucher.val()
        }
    }
    await $.ajax({
        type: "POST",
        url: url_consultar,
        data: data,
        success: function (data) {
            console.log(data);
            rellenar_aval_anexo(data[0].Documento_Tipo_Anexo, data[0].Documento_Codigo_Anexo);
            jq_ejercicio.val(data[0].Documento_Ejercicio);
            rellenar_periodo_contable(data[0].Documento_Periodo_Contable,'consultar')
            jq_subvoucher.val(data[0].Documento_Codigo_Svoucher);
            jq_fecha_registro.val(data[0].Documento_Fecha_Registro);

            jq_numero_documento.val(data[0].Documento_Numero_Contable);
            jq_tipo_anexo.val(data[0].Documento_Tipo_Anexo);
            jq_codigo_anexo.val(data[0].Documento_Codigo_Anexo);
            jq_nombre_anexo.val(data[0].Documento_Nombre_Anexo);
            jq_moneda.val(data[0].Documento_Moneda);
            jq_tasa_cambio.val(data[0].Documento_Tasa_Cambio);
            jq_tipo_cambio.val(data[0].Documento_Tipo_Cambio);
            jq_tipo_documento_referencia.val(data[0].Documento_Tipo_Documento_Referencia);
            jq_serie_referencia.val(data[0].Documento_Serie_Documento_Referencia);
            jq_numero_referencia.val(data[0].Documento_Numero_Documento_Referencia);
            jq_fecha_canje.val(data[0].Documento_Fecha_Canje_Letra);
            jq_tipo_documento.val(data[0].Documento_Tipo_Documento =="" ? '001': data[0].Documento_Tipo_Documento);
            jq_serie.val(data[0].Documento_Serie);
            jq_numero.val(data[0].Documento_Numero);
            jq_fecha_emision.val(data[0].Documento_Fecha_Emision);
            jq_dias.val(data[0].Documento_Dias);
            jq_fecha_vencimiento.val(data[0].Documento_Fecha_Vencimiento);
            jq_importe.val(formatCurrency(data[0].Documento_Importe,2)); 
            numero_documento_contable =  data[0].Documento_Numero_Cta;    
  
            jq_glosa.val(data[0].Documento_Glosa);
            jq_aval.val(data[0].Documento_Codigo_Aval);

            // rellenarFormato(data);
            // if(impresion)
            //     imprimir();
        }
      });

    jq_grid_detalle_letras.jqGrid("setGridParam",{
        url: url_getListaDetalle,
        mtype: "POST",
        datatype: "json",
        postData:data
    }).trigger("reloadGrid");

    jq_modal_ventana_lista.modal('hide');
}

async function agregar_cabecera_pendientes(rowData){  
}

function rellenar_anexos(codigo, tipo){
    if(!isEmptyOrWhiteSpaces(codigo)){
        $.ajax({
            type: 'POST',
            url: url_anexo_datos,
            data: {codigo: codigo, tipo: tipo},
            success: function (result){
                result.forEach(list=>{
                    var ruc_dni=''
                    switch(list.Tipo_documento){
                        case "01":
                            ruc_dni=list.Numero_DNI;
                        break;
                        case "06":
                            ruc_dni=list.Numero_Ruc;
                        break;
                        default:
                            ruc_dni=list.Numero_Doc;
                        break;
                    }
                    jq_codigo_anexo.val(list.Codigo);
                    jq_nombre_anexo.val(list.Nombre);

                    rellenar_aval_anexo(tipo, codigo);

                });

                if(isEmptyOrWhiteSpaces(modulo)){
                    listar_documentos_pendientes_contable(result[0].Tipo_Auxiliar, result[0].Codigo,null,"Letras");
                }
            }
        });
    }
};

function rellenar_aval_anexo(tipo, codigo) {
    $.ajax({
        url: url_aval,
        type: 'POST',
        data: {
            tipo: tipo,
            codigo: codigo       
        },success: function (result) {
            jq_aval.html('');
            result.forEach(list=>{
                jq_aval.append('<option value="'+list.Codigo+'" >'+list.Nombre + "</option>");
            });
        }
    })
}

async function rellenar_ejercicio_contable(elemento, setPredeterminado) {
    jq_elemento = $("#"+elemento);
    await $.ajax({
        type: 'POST',
        url: url_ejercicio,
        success: function (result){
            jq_elemento.html('');
            result.forEach(list=>{
                jq_elemento.append('<option value="'+list.Ejercicio+'" >'+list.Descripcion + '</option>');
            });
            if(setPredeterminado != ""){
                jq_ejercicio.val(setPredeterminado);
                rellenar_periodo_contable(getPeriodo(fecha_trabajo));
            }
        }
    });
};

async function rellenar_periodo_contable(setPredeterminado,consultar) {
    await $.ajax({
        type: 'POST',
        url: url_periodo,
        data:{
            ejercicio: jq_ejercicio.val()
        },
        success: function (result){
            jq_periodo.html('');
            result.forEach(list=>{
                jq_periodo.append('<option value="'+list.Periodo_Contable+'" >'+list.Periodo_Contable + '</option>');
            });
            if(setPredeterminado != undefined){
                jq_periodo.val(setPredeterminado);
            }
            if (consultar == undefined) {
                rellenar_numero_contable(jq_subvoucher.val());
            }
            // if(periodo_antiguo) jq_periodo.val(periodo_antiguo+jq_ejercicio.val());
            //rellenar_numero_contable(jq_subvoucher.val());
        }
    });
};

async function rellenar_numero_contable(subvoucher) {
    // if(jq_automatico.is(':checked')) {
        // jq_numero_documento.prop( "disabled", true );  
        // await $.ajax({
        //     type: 'POST',
        //     url: url_numero_comprobante,
        //     data: {
        //         ejercicio: jq_ejercicio.val(),
        //         periodo: jq_periodo.val(),
        //         subvoucher: subvoucher
        //     },
        //     success: function (datos) {
        //         jq_numero_documento.val(datos)
        //     }
        // })
    // }else{
    //     jq_numero_documento.prop( "disabled", true );
   jq_numero_documento.val("");
    // }
    
}

function detalle_letras() {
    var jq_grid = jq_grid_detalle_letras;

    jq_grid.jqGrid({
        url: url_detalle_letra,
        datatype: "json",
        mtype: "POST",
        height: 120,
        colNames:['Cuenta','Tipo_Anexo','Codigo_Anexo','Nombre_Anexo','Tipo_Doc','Serie_Doc','Numero_Doc'
        ,'Fecha_Emision','Fecha_Vencimiento','Moneda','Tc','Importe_Mn','Importe_Me','Dh','Unidad_Negocio','Cencos','OT'
        ,'Voucher_Ref','Tipo_Origen','Tipo_Ref','Serie_Ref','Numero_Ref', 'Fecha_Ref', 'Vendedor', 'For_Pago', 'Porc_Comision', 'Comision'],
        colModel:[
            {name:'Cuenta', width:100, hidden:false, editable:false},
            {name:'Tipo_Anexo', width:80, hidden:false, editable:false},
            {name:'Codigo_Anexo', width:100, hidden:false, editable:false},
            {name:'Nombre_Anexo', width:250, hidden:false, editable:false},
            {name:'Tipo_Doc', width:80, hidden:false, editable:false},
            {name:'Serie_Doc', width:80, hidden:false, editable:false},
            {name:'Numero_Doc', width:80, hidden:false, editable:false},
            {name:'Fecha_Emision', width:100, hidden:false, editable:false},
            {name:'Fecha_Vencimiento', width:100, hidden:false, editable:false},
            {name:'Moneda', width:80, hidden:false, editable:false},
            {name:'Tc', width:80, hidden:false, editable:false},
            {name:'Importe_Mn', width:100, hidden:false, editable:false, template: numberTemplate},
            {name:'Importe_Me', width:100, hidden:false, editable:false, template: numberTemplate},
            {name:'Dh', width:100, hidden:false, editable:false},
            {name:'Unidad_Negocio', width:100, hidden:false, editable:false},
            {name:'Cencos', width:100, hidden:false, editable:false},
            {name:'OT', width:100, hidden:false, editable:false},
            {name:'Voucher_Ref', width:100, hidden:false, editable:false},
            {name:'Tipo_Origen', width:100, hidden:false, editable:false},
            {name:'Tipo_Ref', width:100, hidden:false, editable:false},
            {name:'Serie_Ref', width:100, hidden:false, editable:false},
            {name:'Numero_Ref', width:100, hidden:false, editable:false},
            {name:'Fecha_Ref', width:100, hidden:false, editable:false},
            {name:'Vendedor', width:100, hidden:false, editable:false},
            {name:'For_Pago', width:100, hidden:false, editable:false},
            {name:'Porc_Comision', width:100, hidden:false, editable:false},
            {name:'Comision', width:100, hidden:false, editable:false},
        ],
        loadonce: true, 
        cellEdit: true,
        viewrecords: true,
        rownumbers: true,
        autowidth:true,
        shrinkToFit:false,
        forceFit:true,
        height: 250,
        Width: 250,
        caption:"&nbsp;",
        footerrow : true,
        loadComplete:function(data){
            //jq_grid.jqGrid('addRowData',undefined,fila_vacia);
            cargar_filas_detalle_letras();
            resize_jqgrid_restar(jq_grid,$("#myTabContent").height() + $("#myTab").height() + $("#nav_title_bar").height() + 100,$(window).width() - $("#myTabContent").width() );
        },
        onSelectCell : function(rowid, cellname, value, iRow, iCol) { 
            //selected_cell_detalle_contable = iCol; 
            //console.log(rowid);
            rowid_selected_letras = rowid;
        },
        onCellSelect : function(rowid, iCol, cellcontent, e) { 
            //selected_cell_detalle_contable = iCol;
            rowid_selected_letras=rowid; 
        }
    })
};

function cargar_filas_detalle_letras() {
    var jq_grid=jq_grid_detalle_letras;
    var ids=jq_grid.getDataIDs();
    if(ids.length==0){
        for(var i = 0 ; i < 15 ; i++ ){
            fila_vacia_grid_detalle_letras.Importe_Mn = 0;
            fila_vacia_grid_detalle_letras.Importe_Me = 0;
            jq_grid.jqGrid('addRowData',undefined,fila_vacia_grid_detalle_letras);
            
        }
    }
}

function calcularMeMnDetalle() {
    
};

function detalle_contable_actualizar_editables(params) {
    
};

function rellenar_codigo_anexo_detalle(params) {
    
};