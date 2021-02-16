var fecha_trabajo=new Date();
var short_fecha_trabajo="";
var url_motivo_tramites="/talonarios/motivos_serie_correlativo";
var url_guardar = "/guia_entrada/guardar";
var url_responsables = "/usuario/responsables";
var url_configuracion_permisos = '/configuraciones/configuracion_permisos/proceso_almacen__sist_almacen__sist_guia_entrada';

var tipo = "tipo";
var pto_venta = 'pto_venta';
var codigo_proveedor = "codigo_proveedor";
var nombre_proveedor = "nombre_proveedor";
var ruc_proveedor = "ruc_proveedor";
var telefono_proveedor = "telefono_proveedor";
var direccion_proveedor = "direccion_proveedor";
var contacto_proveedor ="contacto_proveedor";
var email_proveedor = "email_proveedor";
var serie = "serie";
var automatico = "automatico";
var manual = "manual";
var numero_correlativo = "numero_correlativo";
var fecha_doc = "fecha_doc";
var responsable = "responsable";
var forma_pago = "forma_pago";
var mas_igv = "mas_igv";
var moneda = "moneda";
var tipo_cambio = "tipo_cambio";
var tasa_cambio = "tasa_cambio";
var porc_descuento = "porc_descuento";
var glosa = "glosa";
var base_calculada = "base_calculada";
var monto_descuento = "monto_descuento";
var subtotal = "subtotal";
var igv = "igv";
var total = "total";
var unidad_negocio = "unidad_negocio";
var centro_costos = "centro_costos";
var orden_trabajo = "orden_trabajo";
var agencia_proveedor = "agencia_proveedor";
var numero_expediente = "numero_expediente";
var numero_expediente_2 = "numero_expediente_2";
var motivo_documento = "motivo_documento";
var tipo_referencia = "tipo_referencia";
var serie_referencia = "serie_referencia";
var numero_referencia = "numero_referencia";
var tipo_referencia_02 = "tipo_referencia_02";
var motivo_referencia = "motivo_referencia";
var tipo_guia = "tipo_guia";
var numero_requerimiento = "numero_requerimiento";
var serie_guia_remision = "serie_guia_remision";
var numero_guia_remision = "numero_guia_remision";
var fecha_emision = "fecha_emision";
var tipo_factura = "tipo_factura";
var serie_factura = "serie_factura";
var numero_factura = "numero_factura";

var modal_ventana_lista = "modal_ventana_lista";

var jq_tipo;
var jq_pto_venta;
var jq_codigo_proveedor;
var jq_nombre_proveedor;
var jq_ruc_proveedor;
var jq_telefono_proveedor;
var jq_direccion_proveedor;
var jq_contacto_proveedor;
var jq_email_proveedor;
var jq_serie;
var jq_automatico;
var jq_manual;
var jq_numero_correlativo;
var jq_fecha_doc;
var jq_responsable ;
var jq_forma_pago ;
var jq_mas_igv;
var jq_moneda;
var jq_tipo_cambio;
var jq_tasa_cambio;
var jq_porc_descuento;
var jq_glosa;
var jq_base_calculada;
var jq_monto_descuento;
var jq_subtotal;
var jq_igv;
var jq_total;
var jq_unidad_negocio;
var jq_centro_costos ;
var jq_orden_trabajo ;
var jq_agencia_proveedor ;
var jq_numero_expediente ;
var jq_numero_expediente_2;
var jq_motivo_documento ;
var jq_tipo_referencia ;
var jq_serie_referencia ;
var jq_numero_referencia ;
var jq_tipo_referencia_02;
var jq_motivo_referencia;
var jq_tipo_guia;
var jq_numero_requerimiento;
var jq_serie_guia_remision;
var jq_numero_guia_remision;
var jq_fecha_emision;
var jq_tipo_factura ;
var jq_serie_factura;
var jq_numero_factura;

$(document).ready(function() {
   
    jq_tipo  = $("#"+tipo);
    jq_pto_venta = $("#"+pto_venta) ;
    jq_codigo_proveedor = $("#"+codigo_proveedor) ;
    jq_nombre_proveedor = $("#"+nombre_proveedor) ;
    jq_ruc_proveedor = $("#"+ ruc_proveedor) ;
    jq_telefono_proveedor = $("#"+telefono_proveedor) ;
    jq_direccion_proveedor = $("#"+direccion_proveedor) ;
    jq_contacto_proveedor = $("#"+contacto_proveedor) ;
    jq_email_proveedor = $("#"+email_proveedor) ;
    jq_serie = $("#"+serie) ;
    jq_automatico = $("#"+automatico) ;
    jq_manual = $("#"+manual) ;
    jq_numero_correlativo = $("#"+numero_correlativo) ;
    jq_fecha_doc = $("#"+ fecha_doc) ;
    jq_responsable = $("#"+responsable) ;
    jq_forma_pago = $("#"+forma_pago) ;
    jq_mas_igv = $("#"+mas_igv) ;
    jq_moneda = $("#"+moneda) ;
    jq_tipo_cambio = $("#"+tipo_cambio) ;
    jq_tasa_cambio = $("#"+tasa_cambio) ;
    jq_porc_descuento = $("#"+porc_descuento) ;
    jq_glosa = $("#"+glosa) ;
    jq_base_calculada = $("#"+base_calculada) ;
    jq_monto_descuento = $("#"+monto_descuento) ;
    jq_subtotal = $("#"+subtotal) ;
    jq_igv =$("#"+igv) ;
    jq_total = $("#"+total) ;
    jq_unidad_negocio  = $("#"+unidad_negocio); 
    jq_centro_costos = $("#"+centro_costos) ;
    jq_orden_trabajo = $("#"+orden_trabajo) ;
    jq_agencia_proveedor = $("#"+agencia_proveedor) ;
    jq_numero_expediente  = $("#"+numero_expediente);
    jq_numero_expediente_2 = $("#"+numero_expediente_2);
    jq_motivo_documento  = $("#"+motivo_documento);
    jq_tipo_referencia  = $("#"+tipo_referencia);
    jq_serie_referencia  = $("#"+serie_referencia);
    jq_numero_referencia  = $("#"+ numero_referencia);
    jq_tipo_referencia_02 = $("#"+tipo_referencia_02);
    jq_motivo_referencia = $("#"+motivo_referencia);
    
    jq_tipo_guia = $("#"+tipo_guia);
    jq_numero_requerimiento = $("#"+numero_requerimiento);
    jq_serie_guia_remision = $("#"+serie_guia_remision);
    jq_numero_guia_remision = $("#"+numero_guia_remision);
    jq_fecha_emision = $("#"+fecha_emision);
    jq_tipo_factura  = $("#"+tipo_factura);
    jq_serie_factura = $("#"+serie_factura);
    jq_numero_factura = $("#"+numero_factura);

    jq_modal_ventana_lista = $("#"+modal_ventana_lista);

    $(".comentario_normal_02").removeClass("d-none");
    $(".comentario_normal").addClass("d-none");


    jq_automatico.click(function() {
        cargar_correlativo();
    });
    jq_manual.click(function() {
        cargar_correlativo();
    });
    jq_serie.change(function() {
        cargar_correlativo();
    });
    
    jq_tipo.change(function() {
        var val=$(this).val();
        switch (val) {
            case "GUIA DE ORDEN DE COMPRA":
                $("#buscar_pendientes").prop( "disabled", false );
                setVentasPendientes('Orden de Compra Pendientes','/orden_compra/lista_documentos_pendientes','/orden_compra/lista_detalle_pendientes','','compras_pendientes','detalle_compra');
                $("#modal_pendientes").modal("show");
                break;
            default:
                $("#buscar_pendientes").prop( "disabled", true );
                break;
        }
    });

    $("#nuevo").show();
    $("#guardar").show();
    $("#listar").show();
    $("#imprimir").show();
    setTitle("Guia Entrada");
    setTitleLista("Listado de Guia Entrada");
    setListaDocumentos('/guia_entrada/lista', '/guia_entrada/consultar', '/guia_entrada/detalle','serie','listado_documentos_compras');
    setCabeceraVentas("/talonarios/motivos_series");
    setDetalleVentas("detalle_compra");
    nuevo();
});

function nuevo(){
    
    estado="guardar";
    short_fecha_trabajo =  getShortDate(fecha_trabajo);
    jq_automatico.prop('checked', true);
    jq_manual.prop('checked', false);
    jq_direccion_proveedor.prop( "disabled", true );
    
    rellenar_motivos_tramite_series("NE",serie,true);
    //rellenar_motivos_tramite_series("PRE","motivo_referencia_presupuesto",false);
    rellenar_codigo_nombre(url_unidad_negocio,"unidad_negocio","user-Unidad_negocio");
    rellenar_codigo_nombre(url_centro_costos,"centro_costos","user-codigo_centro_costos");
    rellenar_codigo_nombre(url_orden_trabajo,"orden_trabajo","user-codigo_ninguno");
    rellenar_codigo_nombre(url_motivo_traslado,"motivo_documento","user-codigo_ninguno");
    rellenar_codigo_nombre(url_tipo_documento,"tipo_referencia","user-codigo_ninguno");
    rellenar_codigo_nombre(url_tipo_documento,"tipo_referencia_02","user-codigo_ninguno");
    rellenar_codigo_nombre(url_tipo_documento_venta,"tipo_factura","user-predeterminado_documento");
    rellenar_codigo_nombre(url_tipo_documento_ALMACEN,"tipo_guia","user-predeterminado_guia");
    //rellenar_codigo_nombre(url_vendedor_lista,"vendedor2","user-codigo_ninguno");
    rellenar_codigo_nombre(url_incoterm,"incoterm","user-codigo_ninguno");
    rellenar_moneda(moneda);
    rellenar_tipo_cambio(tipo_cambio, tasa_cambio,fecha_doc); //Mantener este orden de tasa/tipo, porque si no, no funciona dinamicamente y siempre agarrará VTA
    rellenar_punto_partida("punto_partida");

    cargar_responsable();
    jq_fecha_doc.val(short_fecha_trabajo);
    jq_fecha_emision.val(short_fecha_trabajo);
    cargar_configuraciones();
    limpiar();
    permisos();
    jq_tipo.val("GUIA DIRECTA");
    jq_tipo.trigger("change");
}

function limpiar(){
    jq_codigo_proveedor.val("");
    jq_ruc_proveedor.val("");
    jq_nombre_proveedor.val("");
    jq_direccion_proveedor.val("");
    jq_telefono_proveedor.val("");
    jq_email_proveedor.val("");
    jq_porc_descuento.val("0");
    jq_glosa.val("");
    jq_base_calculada.val("0.00");
    jq_monto_descuento.val("0.00");
    jq_subtotal.val("0.00");
    jq_igv.val("0.00");
    jq_total.val("0.00");

    $("#base_calculada_mask").val(formatNumber.new(0,"",2));
    $("#monto_descuento_mask").val(formatNumber.new(0,"",2));
    $("#subtotal_mask").val(formatNumber.new(0,"",2));
    $("#igv_mask").val(formatNumber.new(0,"",2));
    $("#total_mask").val(formatNumber.new(0,"",2));

    jq_punto_llegada_proveedor.val("");
    jq_serie_referencia.val("");
    jq_numero_referencia.val("");
    jq_motivo_referencia.val("");
    jq_numero_requerimiento.val("");
    jq_serie_guia_remision.val("");
    jq_numero_guia_remision.val("");
    jq_tipo_factura.val("00");
    jq_serie_factura.val("");
    jq_numero_factura.val("");
    jq_numero_expediente.val("");
    jq_numero_expediente_2.val("");
    jq_fecha_doc.val(short_fecha_trabajo);
    jq_fecha_emision.val(short_fecha_trabajo);

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

    jq_text_comentario.val("");
    jq_comentario_normal_02.prop("checked", false);
    jq_comentario_detallado.prop("checked", false);

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
                serie_documento: jq_serie.val(),
                tipo_documento:'NE'
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
                // jq_mas_igv.prop('checked', (list.mas_igv=="S" ? true : false));
                jq_mas_igv.prop('checked', true);
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
            tipo: 'NE'
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
            url_guardar = "/guia_entrada/guardar";
            mensaje = "Guardado satisfactoriamente."
            impresion=true;
            break;
        case  'modificar':
            url_guardar = "/guia_entrada/modificar";
            mensaje = "Modificado satisfactoriamente."
            break;
        case 'eliminar':
            url_guardar = "/guia_entrada/eliminar";
            mensaje = "Eliminado satisfactoriamente."
            break;
        case 'anular':
            url_guardar = "/guia_entrada/anular";
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
             serie: jq_serie.val(),
             numero_correlativo: jq_numero_correlativo.val(),
             codigo_movimiento: 'NE',
             tipo_movimiento: 'E',
             automatico: automatico,
             fecha_doc: jq_fecha_doc.val(),
             fecha_entr: "01/01/1900",
             fecha_validez: "01/01/1900",
             moneda: jq_moneda.val(),
             importe: jq_total.val(),
             forma_pago: jq_forma_pago.val(),
             codigo_cliente: '00',
             nombre_cliente: '',
             ruc_cliente: '',
             estado: "Ingresado",
             observacion: jq_text_comentario.val(),
             mas_igv: 'N',
             tipo_cambio: jq_tipo_cambio.val(),
             tasa_cambio: jq_tasa_cambio.val(),
             codigo_persona: "00",
             lista_precios: '',
             telefono_cliente: jq_telefono_cliente.val(),
             fax: "",
             email: jq_email_cliente.val(),
             aprobado: "Sin Aprobacion",
             fecha_aprobacion: "01/01/1900",
             codigo_empleado_aprobacion: "00",
             observacion_aprobacion: "",
             codigo_centro_costos: jq_centro_costos.val(),
             descuento: jq_porc_descuento.val(),
             orden_trabajo: jq_orden_trabajo.val(),
             pto_partida: jq_direccion_proveedor.val(),
             pto_llegada: '',
             dias: '0',
             pais: '',
             atencion: "Pendiente",
             porcentaje: "",
             codigo_unidad_negocio: jq_unidad_negocio.val(),
             codigo_contacto: jq_contacto_cliente.val(),
             nom_contacto: jq_contacto_cliente.find('option:selected').text(),
             vendedor_1: '00',
             idvendedor2: '00',
             responsable: jq_responsable.val(),
             Glosa : jq_glosa.val(),
             codigo_agencia: jq_agencia_proveedor.val(),
             usuario: "",
             Pc_User: "",
             Pc_Fecha: "01/01/1900",
             Pc_Ip: "",
             comentario1: "",
             comentario8: "",
             erp_presupuesto: '00',
             subtotal_sin_descuentos: jq_base_calculada.val(),
             erp_Ddescuento: jq_monto_descuento.val(),
             erp_Dsubtotal: jq_subtotal.val(),
             erp_Digv: jq_igv.val(),
             erp_Dimporte: jq_total.val(),
             erp_Dpercepcion: "0",
             erp_Dtotal: jq_total.val(),
             erp_gestor: '00',
             tipo: jq_tipo.val(),
             motivo_ref: '',
             //numero_referencia: jq_numero_referencia.val(),
             codigo_transportista: '00',
             nombre_transportista: '',
             codigo_vehiculo: '00',
             motivo_traslado: jq_motivo_documento.val(),
             numero_orden: '00',
             atencion_prod: 'Pendiente',
             porcentaje_prod: '0%',
             erp_tipdoc: '0',
             flag_ruta_contacto: 'N',
             ruta_contacto: 'NULL',
             erp_dscto_stock: 'S',
             erp_contacto_vendedor: '00',
             tipo_comprobante: jq_tipo_referencia_02.val(),
             serie_comprobante: jq_motivo_referencia.val(),
             numero_comprobante: jq_numero_requerimiento.val(),
             fecha_comprobante: '01/01/1900',
             tipo_documento_referencia: jq_tipo_referencia.val(),
             serie_documento_referencia:  jq_tipo.val() == 'GUIA DE ORDEN DE COMPRA' ? '--': jq_serie_referencia.val(),
             numero_documento_referencia: jq_numero_referencia.val(),
             fecha_referencia: '01/01/1900',
             anticipo: '0.00',
             impmn: '0',
             impme: '0',
             costo: '0',
             codigo_almacen_d: '',
             nombre_cliente_2: '',
             codigo_proveedor: jq_codigo_proveedor.val(),
             nombre_proveedor_c: jq_nombre_proveedor.val(),
             modulo: 'GUIA_ENTRADA',
             ccod_almacen2: '',
             ccod_almacend2: '',
             codigo_transaccion: '00',
             codigo_detraccion:'00',
             contabilizada: 'N',
             tipo_guia_prov: jq_tipo_guia.val(),
             serie_guia_prov: jq_serie_guia_remision.val(),
             nro_guia_prov: jq_numero_guia_remision.val(),
             serie_fac_prov: jq_serie_factura.val(),
             nro_fac_prov: jq_numero_factura.val(),
             fecha_emision: jq_fecha_emision.val(),
             codigo_caja: '00',
             erp_vuelto: '0',
             erp_motivo: '00',
             erp_contacto_vendedor: '00',
             erp_monto_recaudo: '0',
             erp_ck_recaudo_sn: 'N',
             erp_cuenta_recaudo: '00',
             erp_anexo_recaudo: '00',
             erp_tiporig_recaudo: 'N',
             estado_fe: 'Ingresado',
             detalleanulacion: '',
             fechagen: '01/01/1900',
             fechabaja:'01/01/1900',
             tribute_concept: 'OPERACION GRAVADA',
             motivo_nota: '',
             igv_icbper: '0',
             redondeo: '0',
             agencia_transporte: '00',
             codigo_chofer: '',
             serie_destino: '',
             numero_destino: '',
             via_nom_partida: '',
             n_req: '',
             viatipo_partida: '',
             nro_partida: '',
             interior_partida: '',
             zona_partida: '',
             distrito_partida:'',
             prov_partida: '',
             dep_partida: '',
             tip_nro_doc_partida: '',
             viatipo_llegada: '',
             via_nom_llegada: '',
             nro_llegada: '',
             interior_llegada: '',
             zona_llegada: '',
             distrito_llegada: '',
             prov_llegada: '',
             dep_llegada: '',
             tipo_venta_ref: '',
             erp_ejecon: '',
             erp_percon: '',
             erp_codsub: '',
             erp_numcon: '',
             erp_costome: '0',
             erp_costomn: '0',
             erp_cosme: '0',
             erp_cosmn: '0',
             erp_iteref: '0',
             ruta_cont_ped: '',
             erp_nro_exp: jq_numero_expediente.val(),
             erp_nro_exp2: jq_numero_expediente_2.val(),
             erp_ejercon_02: '',
             erp_percon_02: '',
             erp_cobsub_02: '',
             erp_numcon_02: '',
             erp_selecc: '',
             tipdoc_ref_2: jq_tipo_factura.val(),
             ptovta_ref_2: '',
             motivo_ref_2: '',
             nro_ref_2: '',
             erp_cod_rubro: '00',
             detalleanulacion: '',
             cnum_lote: '',
            
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
    var mensaje='';
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
    if(isEmptyOrWhiteSpaces(jq_codigo_proveedor.val())) {
        retorno = false;
        mostrarMensajeModal("Aviso","Debe ingresar un proveedor");
        mensaje += "Debe ingresar un proveedor. <br>";
    }
    if(isEmptyOrWhiteSpaces(jq_numero_correlativo.val())) {
        retorno = false;
        mostrarMensajeModal("Aviso","Debe ingresar un número correlativo");
    }
    if(validarDetalleVentas()) {
        retorno = false;
        mostrarMensajeModal("Aviso","Debe ingresar un detalle de documento");
    }

    var jq_grid=jq_grid_detalle_ventas;
    var dataIDs = jq_grid.getDataIDs(); 
    for(i = 0; i < dataIDs.length; i++)
    {
        var rowData = jq_grid.jqGrid ('getRowData', dataIDs[i]);
        if(rowData.Serie_SN=="S" && rowData.Serie_Numero==""){
            mostrarMensajeModal("Aviso","El producto "+rowData.Codigo+" necesita una Serie");
            retorno=false;
        }
        if(rowData.Lote_SN=="S" && rowData.Lote_Numero==""){
            mostrarMensajeModal("Aviso","El producto "+rowData.Codigo+" necesita un lote");
            retorno=false;
        }
        if(rowData.Lote_SN=="S" && isEmptyOrWhiteSpaces(rowData.Lote_Vencimiento)){
            mostrarMensajeModal("Aviso","El producto "+rowData.Codigo+" necesita un fecha de vencimiento");
            retorno=false;
        }
        if(rowData.Lote_SN=="S" && rowData.Lote_Vencimiento=="01/01/1900"){
            mostrarMensajeModal("Aviso","El producto "+rowData.Codigo+" necesita un fecha de vencimiento");
            retorno=false;
        }
    }
    return retorno;
}

// function listar(){
//     jq_modal_ventana_lista.modal('show'); 
//     Actualizar_lista() ;
// }


function consultar(impresion) {
    jq_comentario_normal_02.prop("checked", false);
    jq_comentario_detallado.prop("checked", false);

    documentoSeleccionado = rowId_seleccionado;
    row_lista_documento_selected = jq_grid_documentos.jqGrid("getRowData", documentoSeleccionado);
    var data ={
        numero_documento : row_lista_documento_selected.Numero,
        motivo_serie : row_lista_documento_selected.Codigo_Motivo_Serie,
        tipo_documento : row_lista_documento_selected.Codigo_Tipo_Documento,
        codigo_punto_venta : row_lista_documento_selected.Codigo_Punto_Venta,
        tipo_movimiento: row_lista_documento_selected.Tipo_Compra == "ENTRADA"? "E":"S"
    }
    if(impresion){
        data ={
            numero_documento : jq_numero_correlativo.val(),
            motivo_serie : jq_serie.val(),
            tipo_documento: "NE",
            codigo_punto_venta : "",
            tipo_movimiento: "E"
        }
    }
    $.ajax({
        type: "POST",
        url: url_consultar,
        data: data,
        success: function (data) {

            rellenar_formas_pago(data[0].codigo_proveedor,'42',data[0].documento_forma_pago_codigo);
            rellenar_sublista_clientes(data[0].codigo_proveedor, url_proveedores_contactos,"contacto_proveedor",data[0].proveedor_contacto_codigo);
            rellenar_sublista_clientes(data[0].codigo_proveedor, url_proveedores_agencias,"agencia_proveedor",data[0].proveedor_agencia);

            // ** Ventana 1 - 1 ** //
            jq_tipo.val(data[0].documento_tipo);
            jq_serie.val(data[0].documento_motivo_venta_codigo);
            jq_codigo_proveedor.val(data[0].codigo_proveedor);
            jq_nombre_proveedor.val(data[0].proveedor_nombre);
            jq_direccion_proveedor.val(data[0].proveedor_direccion);
            jq_ruc_proveedor.val(data[0].codigo_proveedor);
            jq_telefono_proveedor.val(data[0].proveedor_telefono);
            jq_email_proveedor.val(data[0].proveedor_correo);
            // ** Ventana 1 - 2 ** //
            data[0].documento_automatico=="A" ? jq_automatico.prop('checked', true) : jq_automatico.prop('checked', false)
            data[0].documento_automatico=="M" ? jq_manual.prop('checked', true) : jq_manual.prop('checked', false)
            jq_numero_correlativo.val(data[0].documento_numero);
            jq_fecha_doc.val(data[0].documento_fecha_format23);
            jq_mas_igv.prop('checked', (data[0].documento_mas_igv=="S" ? true : false));
            jq_moneda.val(data[0].documento_moneda);
            jq_tipo_cambio.val(data[0].nombre_tipo_cambio);
            jq_tasa_cambio.val(data[0].tipo_cambio);
            jq_porc_descuento.val(data[0].documento_descuento_porc);
            jq_responsable.val(data[0].documento_responsable);
            jq_glosa.val(data[0].documento_glosa);
            // ** Ventana 1 - 3 ** //
            jq_base_calculada.val(formatCurrency(data[0].documento_subtotal_sin_descuentos,2));
            jq_monto_descuento.val(formatCurrency(data[0].documento_descuento,2));
            jq_subtotal.val(formatCurrency(data[0].documento_subtotal,2));
            jq_igv.val(formatCurrency(data[0].documento_igv,2));
            jq_total.val(formatCurrency(data[0].documento_total,2));

            $("#base_calculada_mask").val(formatNumber.new(data[0].documento_subtotal_sin_descuentos,"",2))
            $("#monto_descuento_mask").val(formatNumber.new(data[0].documento_descuento,"",2))
            $("#subtotal_mask").val(formatNumber.new(data[0].documento_subtotal,"",2))
            $("#igv_mask").val(formatNumber.new(data[0].documento_igv,"",2))
            $("#total_mask").val(formatNumber.new(data[0].documento_total,"",2))

            // ** Ventana 2 - 1 ** //
            jq_centro_costos.val(data[0].documento_cencos_codigo);
            jq_orden_trabajo.val(data[0].documento_ot_codigo);
            jq_unidad_negocio.val(data[0].unidad_negocio_codigo);
            jq_agencia_proveedor.val(data[0].proveedor_agencia);
            jq_motivo_documento.val(data[0].documento_motivo_documento);
            // ** Ventana 2 - 2 ** //
            jq_tipo_referencia.val(data[0].documento_tipo_referencia);
            jq_serie_referencia.val(data[0].documento_serie_referencia);
            jq_numero_referencia.val(data[0].documento_numero_referencia);

            jq_tipo_referencia_02.val(data[0].tipo_comprobante);
            jq_motivo_referencia.val(data[0].serie_comprobante);
            jq_numero_requerimiento.val(data[0].numero_comprobante);

            jq_tipo_guia.val(data[0].documento_tipo_guia_remision);
            jq_serie_guia_remision.val(data[0].documento_serie_guia_remision);
            jq_numero_guia_remision.val(data[0].documento_numero_guia_remision);
            jq_fecha_emision.val(data[0].documento_fecha_emision);
            
            jq_tipo_factura.val(data[0].documento_tipo_factura);
            jq_serie_factura.val(data[0].documento_serie_factura);
            jq_numero_factura.val(data[0].documento_numero_factura);

            jq_numero_expediente.val(data[0].documento_numero_expediente);
            jq_numero_expediente_2.val(data[0].documento_numero_expediente_2);
    
            pais_proveedor = data[0].proveedor_pais;

            setFormatoImpresion(
                {
                    modulo : 'Almacen',
                    tipo_formato : 'talonarios',
                    punto_venta : row_lista_documento_selected.Codigo_Punto_Venta,
                    tipo_documento : row_lista_documento_selected.Codigo_Tipo_Documento,
                    motivo_serie : row_lista_documento_selected.Codigo_Motivo_Serie,
                },
                data,
                impresion
            );

            jq_text_comentario.val(data[0].Comentario01);
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
    // ** Ventana 1 - 1 ** //
    jq_codigo_proveedor.val(rowData.Codigo_Proveedor);
    jq_ruc_proveedor.val(rowData.Codigo_Proveedor);
    jq_nombre_proveedor.val(rowData.Nombre_Proveedor);
    jq_direccion_proveedor.val(rowData.Proveedor_Direccion);
    jq_telefono_proveedor.val(rowData.Telefono_Proveedor);
    jq_email_proveedor.val(rowData.Correo_Proveedor);
    rellenar_sublista_clientes(rowData.Codigo_Proveedor, url_proveedores_contactos,"contacto_proveedor",rowData.Codigo_Contacto);

    // ** Ventana 1 - 2 ** //
    rellenar_formas_pago(rowData.Codigo_Proveedor,'42',rowData.Forma_Pago);
    // jq_dias_forma_pago.val(rowData.Dias_Forma_Pago);
    jq_moneda.val(rowData.Moneda);
    jq_glosa.val(rowData.glosa);
    jq_porc_descuento.val(rowData.Porc_Descuento);
    jq_mas_igv.prop('checked', (rowData.si_igv=="S" ? true : false));

    
    // ** Ventana 1 - 3 ** //
    jq_base_calculada.val(rowData.Sub_Total_Sin_Descuentos);
    jq_monto_descuento.val(rowData.Monto_Descuento);
    jq_subtotal.val(rowData.Sub_Total);
    jq_igv.val(rowData.Igv);
    jq_total.val(rowData.Total);

    $("#base_calculada_mask").val(formatNumber.new(rowData.Sub_Total_Sin_Descuentos,"",2))
    $("#monto_descuento_mask").val(formatNumber.new(rowData.Monto_Descuento,"",2))
    $("#subtotal_mask").val(formatNumber.new(rowData.Sub_Total,"",2))
    $("#igv_mask").val(formatNumber.new(rowData.Igv,"",2))
    $("#total_mask").val(formatNumber.new(rowData.Total,"",2))

    // ** Ventana 2 - 1 ** //
    jq_unidad_negocio.val(rowData.Codigo_Unidad_Negocio);
    jq_centro_costos.val(rowData.Cencos);
    jq_orden_trabajo.val(rowData.Ot);
    jq_numero_expediente.val(rowData.Numero_Expediente); //Nro Expediente
    jq_numero_expediente_2.val(rowData.Numero_Expediente_2);
    rellenar_sublista_clientes(rowData.Codigo_proveedor, url_proveedores_agencias,"agencia_proveedor",rowData.Codigo_Agencia);

    // ** Ventana 2 - 2 ** //
    jq_tipo_referencia.val('OC'); //Tipo Ref - Tipo
    jq_serie_referencia.val(rowData.Codigo_Motivo_Serie); //Tipo Ref - Motivo
    jq_numero_referencia.val(rowData.Numero); //Tipo Ref - Numero
    jq_tipo_referencia_02.val('REQ'); //Tipo Ref 2 - Tipo
    jq_motivo_referencia.val(rowData.Referencia_Requerimiento_Motivo); //Tipo Ref 2 - Motivo
    jq_numero_requerimiento.val(rowData.Referencia_Requerimiento_Numero); //Tipo Ref 2 - Numero
    
    recalcular_montos_ventas();
};

function cliente_proveedor() {
    //Funcion que requeire la cabecera ventas en NE, para transacciones de almacen
    //Si se borra esta función, dará error
};


function calcular_formas_pago_proveedor (){
    
}