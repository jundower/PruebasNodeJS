var fecha_trabajo=new Date();
var short_fecha_trabajo="";
var url_motivo_tramites="/talonarios/motivos_tramite_correlativo";
var url_guardar = "/cotizacion/guardar";
var url_responsables = "/usuario/responsables";
var url_configuracion_permisos = '/configuraciones/configuracion_permisos/proceso_compra__sist_cuadro_comparativo__pre_cotizacion';


var tipo_cambio = "tipo_cambio";
var tasa_cambio = "tasa_cambio";
var pto_venta = 'pto_venta';
var motivo_requerimiento = 'motivo_requerimiento';
var numero_requerimiento = 'numero_requerimiento';
var automatico = "automatico";
var manual = "manual";
var numero_correlativo = "numero_correlativo";
var fecha_doc = "fecha_doc";
var responsable = "responsable";
var forma_pago = "forma_pago";
var glosa = "glosa";
var base_calculada = "base_calculada";
var monto_descuento = "monto_descuento";
var subtotal = "subtotal";
var igv = "igv";
var total = "total";
var moneda = "moneda";

var modal_ventana_lista = "modal_ventana_lista";

var jq_pto_venta;
var jq_motivo_requerimiento;
var jq_numero_requerimiento;
var jq_automatico;
var jq_manual;
var jq_numero_correlativo;
var jq_fecha_doc;
var jq_responsable;
var jq_glosa;
var jq_base_calculada;
var jq_monto_descuento;
var jq_subtotal;
var jq_igv;
var jq_total;
var jq_moneda;
var jq_tipo_cambio;
var jq_tasa_cambio;

var jq_modal_ventana_lista;


$(document).ready(function() {
   
    jq_pto_venta = $("#"+pto_venta) ;
    jq_motivo_requerimiento = $("#"+motivo_requerimiento);
    jq_numero_requerimiento = $("#"+numero_requerimiento);
    jq_automatico = $("#"+automatico) ;
    jq_manual = $("#"+manual) ;
    jq_numero_correlativo = $("#"+numero_correlativo) ;
    jq_fecha_doc = $("#"+ fecha_doc) ;
    jq_responsable = $("#"+responsable);
    jq_glosa = $("#"+glosa) ;
    jq_base_calculada = $("#"+base_calculada) ;
    jq_monto_descuento = $("#"+monto_descuento) ;
    jq_subtotal = $("#"+subtotal) ;
    jq_igv =$("#"+igv) ;
    jq_total = $("#"+total) ;

    jq_modal_ventana_lista = $("#"+modal_ventana_lista);

    jq_moneda = $("#"+moneda);
    jq_tipo_cambio = $("#"+tipo_cambio) ;
    jq_tasa_cambio = $("#"+tasa_cambio) ;

    jq_automatico.click(function() {
        cargar_correlativo();
    });
    jq_manual.click(function() {
        cargar_correlativo();
    });
    
    $("#buscar_pendientes").prop( "disabled", false );
    setVentasPendientes('Requerimientos Pendientes','/requerimientos/lista_documentos_pendientes','/requerimientos/lista_detalle_pendientes','','compras_pendientes','detalle_compra');

    $("#nuevo").show();
    $("#guardar").show();
    $("#listar").show();
    $("#imprimir").show();
    setTitle("Pre Cotizacion");
    setTitleLista("Listado de Pre Cotizacion");
    setListaDocumentos('/pre_cotizacion/lista', '/pre_cotizacion/consultar', '/pre_cotizacion/detalle','Motivo','listado_documentos_compras');
    //setCabeceraVentas("/talonarios/motivos_tramite");
    setDetalleVentas("detalle_compra");
    nuevo();
});

function nuevo(){
    
    estado="guardar";
    short_fecha_trabajo =  getShortDate(fecha_trabajo);
    jq_automatico.prop('checked', true);
    jq_manual.prop('checked', false);
    jq_direccion_proveedor.prop( "disabled", true );
    
    //rellenar_motivos_tramite_series("OC",motivo,true);
    cargar_correlativo();

    cargar_responsable();
    rellenar_moneda(moneda);
    rellenar_tipo_cambio(tipo_cambio, tasa_cambio,fecha_doc); 
    jq_fecha_doc.val(short_fecha_trabajo);

    cargar_configuraciones();
    limpiar();
    permisos();
    //jq_tipo.trigger("change");
}

function limpiar(){

    jq_motivo_requerimiento.val("");
    jq_numero_requerimiento.val("");
    jq_glosa.val("");
    jq_base_calculada.val("0.00");
    jq_monto_descuento.val("0.00");
    jq_subtotal.val("0.00");
    jq_igv.val("0.00");
    jq_total.val("0.00");


    var jq_grid=jq_grid_detalle_ventas;
    jq_grid.saveCell(selected_Id_detalle_ventas,selected_cell_detalle_ventas);

    jq_grid.jqGrid("setGridParam",{
        url: url_getListaDetalle,
        mtype: "POST",
        datatype: "json",
        postData:{
            numero_documento : "00",
            motivo_documento : "00",
            codigo_punto_venta : "00"
        }
    }).trigger("reloadGrid");

}

function cargar_correlativo(){

    if(jq_automatico.is(':checked')) {
        
        jq_numero_correlativo.prop( "disabled", true );  
        var today= fecha_trabajo;
        var yyyy = today.getFullYear();
        $.ajax({
            type: 'POST',
            url: url_motivo_tramites,
            data:{
                motivo: 'RCT',
                anio:yyyy,
                tipo_documento:'RCT'
            },
            success: function (lists){
                jq_numero_correlativo.val(lists);
            }
        });
    }else{
        jq_numero_correlativo.prop( "disabled", false );
        jq_numero_correlativo.val("");
    }
};

function cargar_configuraciones(){
    $.ajax({
        type: 'POST',
        url: url_configuraciones_tipo_cambio,
        success: function (lists){
            lists.forEach(list=>{
                jq_moneda.val(list.moneda_trabajo);
                jq_tipo_cambio.val(list.ctipo_cambio);
                jq_mas_igv.prop('checked', (list.mas_igv=="S" ? true : false));
                rellenar_tasa_cambio(tasa_cambio, short_fecha_trabajo,jq_tipo_cambio.val());
            });
        }
    });
    
}

function cargar_responsable(){
    var jq_elemento = jq_responsable;
    $.ajax({
        type: 'POST',
        url: url_responsables,
        data:{
            tipo: 'COT'
        },
        success: function (lists){
            jq_elemento.html('');
            lists.forEach(list=>{
                jq_elemento.append('<option value="'+list.Codigo+'" >'+list.Nombre + '</option>');
            });
       }
   });
}

function guardar(){
    url_guardar="";
    var mensaje="";
    var impresion=false;
    switch (estado) {
        case 'guardar':
            url_guardar = "/pre_cotizacion/guardar";
            mensaje = "Guardado satisfactoriamente."
            impresion=true;
            break;
        case  'modificar':
            url_guardar = "/pre_cotizacion/modificar";
            mensaje = "Modificado satisfactoriamente."
            break;
        case 'eliminar':
            url_guardar = "/pre_cotizacion/eliminar";
            mensaje = "Eliminado satisfactoriamente."
            break;
        case 'anular':
            url_guardar = "/pre_cotizacion/anular";
            mensaje = "Anulado satisfactoriamente."
            break;
    }
    var mas_igv = (jq_mas_igv.prop('checked' ) ? "S" : "N");
    var automatico = (jq_automatico.prop('checked') == true ? "A" : "M");

    var today= fecha_trabajo;
    var yyyy = today.getFullYear();

    var filas_detalle= generar_array_detalle();

     $.ajax({
         url: url_guardar,
         type: 'post',
         data:{
             anio: yyyy,
             motivo: 'RCT',
             numero_correlativo: jq_numero_correlativo.val(),
             automatico: automatico,
             codigo_responsable: jq_responsable.val(),
             fecha_doc: jq_fecha_doc.val(),
             estado: 'Ingresado',
             glosa: jq_glosa.val(),
             motivo_requerimiento: jq_motivo_requerimiento.val(),
             numero_requerimiento: jq_numero_requerimiento.val(),

             filas_detalle: JSON.stringify( filas_detalle)
         },
         success: function(result){
             if(result.estado == true){
                jq_numero_correlativo.val(result.codigo);
                 
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

    if(isEmptyOrWhiteSpaces(jq_porc_descuento.val())) {
        jq_porc_descuento.val("0");
    }
    if(isEmptyOrWhiteSpaces(jq_dias_forma_pago.val())) {
        jq_dias_forma_pago.val("0");
    }

    if(jq_tasa_cambio.val() * 1 == 0 ) {
        retorno = false;
        mostrarMensajeModal("Aviso","Tipo de cambio debe ser mayor a 0");
    }
    if(isEmptyOrWhiteSpaces(jq_numero_correlativo.val())) {
        retorno = false;
        mostrarMensajeModal("Aviso","Debe ingresar un número correlativo");
    }
    if(validarDetalleVentas()) {
        retorno = false;
        mostrarMensajeModal("Aviso","Debe ingresar un detalle de documento");
    }

    return retorno;
}

// function listar(){
//     jq_modal_ventana_lista.modal('show'); 
//     Actualizar_lista() ;
// }


function consultar(impresion) {
    documentoSeleccionado = rowId_seleccionado;
    row_lista_documento_selected = jq_grid_documentos.jqGrid("getRowData", documentoSeleccionado);
    console.log(row_lista_documento_selected);
    var data ={
        numero_documento : row_lista_documento_selected.Numero,
        codigo_punto_venta : row_lista_documento_selected.Codigo_Punto_Venta
    }
    if(impresion){
        data ={
            numero_documento : jq_numero_correlativo.val(),
            codigo_punto_venta : ""
        }
    }
    $.ajax({
        type: "POST",
        url: url_consultar,
        data: data,
        success: function (data) {
            // ** Ventana 1 - 1 ** //
            jq_numero_requerimiento.val(data[0].Numero_Requerimiento);
            //Contacto

            // ** Ventana 1 - 2 ** //
            data[0].Automatico=="A" ? jq_automatico.prop('checked', true) : jq_automatico.prop('checked', false)
            data[0].Automatico=="M" ? jq_manual.prop('checked', true) : jq_manual.prop('checked', false)
            jq_numero_correlativo.val(data[0].Numero_Documento);
            jq_fecha_doc.val(data[0].Fecha_Documento);
            jq_responsable.val(data[0].Codigo_Responsable);
            //Forma Pago
            jq_glosa.val(data[0].Glosa);

            // ** Ventana 1 - 3 ** //
            // jq_base_calculada.val(formatCurrency(data[0].documento_subtotal_sin_descuentos,2));
            // jq_monto_descuento.val(formatCurrency(data[0].documento_descuento,2));
            // jq_subtotal.val(formatCurrency(data[0].documento_subtotal,2));
            // jq_igv.val(formatCurrency(data[0].documento_igv,2));
            // jq_total.val(formatCurrency(data[0].documento_total,2));

            // ** Ventana 2 - 1 ** //


            // ** Ventana 2 - 2 ** //

            //Requerimiento motivo
            //Requerimiento numero

            // rellenarFormato(data);
            // if(impresion)
            //     imprimir();
            setFormatoImpresion(
                {
                    modulo : 'Compras',
                    tipo_formato : 'tramites',
                    punto_venta : row_lista_documento_selected.Codigo_Punto_Venta,
                    tipo_documento : 'RCT',
                    motivo_serie : 'RCT',
                },
                data,
                impresion
            );
        }
    });

    jq_grid_detalle_ventas.jqGrid("setGridParam",{
        url: url_getListaDetalle,
        mtype: "POST",
        datatype: "json",
        postData:data
    }).trigger("reloadGrid");


    jq_modal_ventana_lista.modal('hide');
}

function agregar_cabecera_pendientes(rowData){

    jq_motivo_requerimiento.val(rowData.Codigo_Motivo_Serie);
    jq_numero_requerimiento.val(rowData.Numero);
    // ** Ventana 1 - 1 ** //
    // ** Ventana 1 - 2 ** //
    // jq_moneda.val(rowData.Moneda);
    jq_glosa.val(rowData.glosa);
    // jq_mas_igv.prop('checked', (rowData.si_igv=="S" ? true : false));

    // ** Ventana 1 - 3 ** //
    jq_base_calculada.val(rowData.Sub_Total_Sin_Descuentos);
    jq_monto_descuento.val(rowData.Monto_Descuento);
    jq_subtotal.val(rowData.Sub_Total);
    jq_igv.val(rowData.Igv);
    jq_total.val(rowData.Total);
    
    // ** Ventana 2 - 1 ** //
    // jq_unidad_negocio.val(rowData.Codigo_Unidad_Negocio);
    // jq_centro_costos.val(rowData.Cencos);
    // jq_orden_trabajo.val(rowData.Ot);
    //Factura a nombre de:
    //Lugar de entraga

    
    // ** Ventana 2 - 2 ** //
    //Nro de Importacion
    //Invoice
    //Fecha Fact Comercial
    //Icoterm 
    //NroExp
    // jq_referencia_requerimiento_motivo.val(rowData.Referencia_Requerimiento_Motivo);
    // jq_referencia_requerimiento_numero.val(rowData.Referencia_Requerimiento_Numero);
    

    // jq_tipo_documento_referencia.val(rowData.Codigo_Movimiento == ""? rowData.Tipo_Venta : rowData.Codigo_Movimiento);
    // jq_serie_documento_referencia.val(rowData.Codigo_Motivo_Serie);
    // jq_numero_documento_referencia.val(rowData.Numero);

};
