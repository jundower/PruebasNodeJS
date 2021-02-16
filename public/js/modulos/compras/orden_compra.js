var fecha_trabajo=new Date();
var short_fecha_trabajo="";
var url_motivo_tramites="/talonarios/motivos_tramite_correlativo";
var url_guardar = "/cotizacion/guardar";
var url_responsables = "/usuario/responsables";
var url_configuracion_permisos = '/configuraciones/configuracion_permisos/proceso_compra__sist_logistica__orden_compra';


var tipo = "tipo";
var pto_venta = 'pto_venta';
var codigo_proveedor = "codigo_proveedor";
var nombre_proveedor = "nombre_proveedor";
var ruc_proveedor = "ruc_proveedor";
var telefono_proveedor = "telefono_proveedor";
var direccion_proveedor = "direccion_proveedor";
var contacto_proveedor ="contacto_proveedor";
var email_proveedor = "email_proveedor";
var motivo = "motivo";
var automatico = "automatico";
var manual = "manual";
var numero_correlativo = "numero_correlativo";
var fecha_doc = "fecha_doc";
var dias_forma_pago = "dias_forma_pago";
var fecha_validez = "fecha_validez";
var fecha_entrega = "fecha_entrega";
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
var fact_nombre = "fact_nombre";
var punto_partida = "punto_partida";
var numero_importacion = "numero_importacion";
var invoice = "invoice";
var fecha_fact_comercial = "fecha_fact_comercial";
var incoterm = "incoterm";
var numero_expediente = "numero_expediente";
var numero_expediente_2 = "numero_expediente_2";
var referencia_requerimiento_motivo ="referencia_requerimiento_motivo";
var referencia_requerimiento_numero = "referencia_requerimiento_numero";
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
var jq_motivo;
var jq_automatico;
var jq_manual;
var jq_numero_correlativo;
var jq_fecha_doc;
var jq_dias_forma_pago;
var jq_fecha_validez;
var jq_fecha_entrega;
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
var jq_fact_nombre ;
var jq_punto_partida;
var jq_numero_importacion ;
var jq_invoice ;
var jq_fecha_fact_comercial ;
var jq_incoterm ;
var jq_numero_expediente ;
var jq_numero_expediente_2;
var jq_modal_ventana_lista;
var jq_referencia_requerimiento_motivo;
var jq_referencia_requerimiento_numero;

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
    jq_motivo = $("#"+motivo) ;
    jq_automatico = $("#"+automatico) ;
    jq_manual = $("#"+manual) ;
    jq_numero_correlativo = $("#"+numero_correlativo) ;
    jq_fecha_doc = $("#"+ fecha_doc) ;
    jq_dias_forma_pago = $("#"+dias_forma_pago) ;
    jq_fecha_validez = $("#"+fecha_validez) ;
    jq_fecha_entrega = $("#"+fecha_entrega) ;
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
    jq_fact_nombre = $("#"+fact_nombre) ;
    jq_punto_partida = $("#"+punto_partida) ;
    jq_numero_importacion = $("#"+numero_importacion) ;
    jq_invoice = $("#"+invoice) ;
    jq_fecha_fact_comercial = $("#"+fecha_fact_comercial) ;
    jq_incoterm = $("#"+incoterm) ;
    jq_numero_expediente = $("#"+numero_expediente) ;
    jq_numero_expediente_2 = $("#"+numero_expediente_2);
    jq_modal_ventana_lista = $("#"+modal_ventana_lista);
    jq_referencia_requerimiento_motivo = $("#"+referencia_requerimiento_motivo);
    jq_referencia_requerimiento_numero = $("#"+referencia_requerimiento_numero);

    $(".comentario_normal_02").removeClass("d-none");
    $(".comentario_normal").addClass("d-none");

    jq_automatico.click(function() {
        cargar_correlativo();
    });
    jq_manual.click(function() {
        cargar_correlativo();
    });
    jq_motivo.change(function() {
        cargar_correlativo();
    });
    
    jq_tipo.change(function() {
        var val=$(this).val();
        switch (val) {
            case "REQUERIMIENTO":
                $("#buscar_pendientes").prop( "disabled", false );
                setVentasPendientes('Requerimientos Pendientes','/requerimientos/lista_documentos_pendientes','/requerimientos/lista_detalle_pendientes','','compras_pendientes','detalle_compra');
                $("#modal_pendientes").modal("show");
                break;
            case "CUADRO COMPARATIVO":
                $("#buscar_pendientes").prop( "disabled", false );
                setVentasPendientes('Cuadros Comparativos Pendientes','/comparativo_precios/lista_documentos_pendientes','/comparativo_precios/lista_detalle_pendientes','','compras_pendientes','detalle_compra');
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
    setTitle("Orden De Compra");
    setTitleLista("Listado de Orden de Compra");
    setListaDocumentos('/orden_compra/lista', '/orden_compra/consultar', '/orden_compra/detalle','Motivo','listado_documentos_compras');
    setCabeceraVentas("/talonarios/motivos_tramite");
    setDetalleVentas("detalle_compra");
    nuevo();
});

function nuevo(){
    
    estado="guardar";
    short_fecha_trabajo =  getShortDate(fecha_trabajo);
    jq_automatico.prop('checked', true);
    jq_manual.prop('checked', false);
    jq_direccion_proveedor.prop( "disabled", true );
    
    rellenar_motivos_tramite_series("OC",motivo,true);
    rellenar_codigo_nombre(url_unidad_negocio,"unidad_negocio","user-Unidad_negocio");
    rellenar_codigo_nombre(url_centro_costos,"centro_costos","user-codigo_centro_costos");
    rellenar_codigo_nombre(url_orden_trabajo,"orden_trabajo","user-codigo_ninguno");
    rellenar_codigo_nombre(url_incoterm,"incoterm","user-codigo_ninguno");
    rellenar_motivos_tramite_series("REQ",referencia_requerimiento_motivo,false);
    rellenar_moneda(moneda);
    rellenar_tipo_cambio(tipo_cambio, tasa_cambio,fecha_doc); //Mantener este orden de tasa/tipo, porque si no, no funciona dinamicamente y siempre agarrará VTA
    rellenar_punto_partida("punto_partida");

    cargar_responsable();
    jq_fecha_doc.val(short_fecha_trabajo);
    jq_fecha_entrega.val(short_fecha_trabajo);
    jq_fecha_validez.val(short_fecha_trabajo);
    jq_fecha_fact_comercial.val(short_fecha_trabajo);
    cargar_configuraciones();
    limpiar();
    permisos();
    jq_tipo.val("DIRECTA");
    jq_tipo.trigger("change");
}

function limpiar(){
    jq_codigo_proveedor.val("");
    jq_ruc_proveedor.val("");
    jq_nombre_proveedor.val("");
    jq_direccion_proveedor.val("");
    jq_telefono_proveedor.val("");
    jq_email_proveedor.val("");
    jq_lista_precios.val("");
    jq_dias_forma_pago.val("0");
    jq_porc_descuento.val("0");
    jq_glosa.val("");
    jq_numero_importacion.val("");
    jq_invoice.val("");
    jq_numero_expediente.val("");
    jq_numero_expediente_2.val("");
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
                motivo: jq_motivo.val(),
                anio:yyyy,
                tipo_documento:'OC'
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
            tipo: 'OC'
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
            url_guardar = "/orden_compra/guardar";
            mensaje = "Guardado satisfactoriamente."
            impresion=true;
            break;
        case  'modificar':
            url_guardar = "/orden_compra/modificar";
            mensaje = "Modificado satisfactoriamente."
            break;
        case 'eliminar':
            url_guardar = "/orden_compra/eliminar";
            mensaje = "Eliminado satisfactoriamente."
            break;
        case 'anular':
            url_guardar = "/orden_compra/anular";
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
             motivo: jq_motivo.val(),
             numero_correlativo: jq_numero_correlativo.val(),
             automatico: automatico,
             codigo_proveedor: jq_codigo_proveedor.val(),
             nombre_proveedor: jq_nombre_proveedor.val(),
             direccion: jq_direccion_proveedor.val(),
             lugar_entrega: jq_punto_partida.val(),
             fact_nombre: jq_fact_nombre.val(),
             fecha_doc: jq_fecha_doc.val(),
             fecha_validez: jq_fecha_validez.val(),
             fecha_entr: jq_fecha_entrega.val(),
             tasa_cambio: jq_tasa_cambio.val(),
             importe: jq_total.val(),
             forma_pago: jq_forma_pago.val(),
             estado: 'Ingresado',
             moneda: jq_moneda.val(),
             centro_costos: jq_centro_costos.val(),
             mas_igv: mas_igv,
             codigo_incoterm: jq_incoterm.val(),
             seguro: '0',
             flete: '0',
             otros: '0',
             numero_importacion: jq_numero_importacion.val(),
             numero_fact_comercial: jq_invoice.val(),
             fecha_fact_comerial: jq_fecha_fact_comercial.val(),
             pais: pais_proveedor,
             orden_trabajo: jq_orden_trabajo.val(),
             numero_orden_compra: '',
             tipo: jq_tipo.val(),
             responsable: jq_responsable.val(),
             comentario: jq_text_comentario.val(),
             comentario2: "",
             comentario3: "",
             comentario4: "",
             comentario5: "",
             comentario6: "",
             comentario7: "",
             descuento: jq_porc_descuento.val(),
             atendido: 'Pendiente',
             porcentaje: '0%',
             tipo_cambio: jq_tipo_cambio.val(),
             nombre_contacto: $('select[name="contacto_proveedor"] option:selected').text(),
             codigo_unidad_negocio: jq_unidad_negocio.val(),
             codigo_contacto: jq_contacto_proveedor.val(),
             glosa: jq_glosa.val(),
             codigo_agencia: jq_agencia_proveedor.val(),
             Pc_User: "",
             Pc_Fecha: "01/01/1900",
             Pc_Ip: "",
             lista_compras: '',
             erp_titulo01: "",
             erp_titulo02: "",
             erp_titulo03: "",
             erp_titulo05: "",
             erp_titulo06: "",
             erp_titulo07: "",
             erp_titulo08: "",
             motivo_requerimiento: jq_tipo.val() == 'CUADRO COMPARATIVO' ? '00':jq_referencia_requerimiento_motivo.val(),
             numero_requerimiento: jq_referencia_requerimiento_numero.val(),
             subtotal_sin_descuentos: jq_base_calculada.val(),
             erp_Ddescuento: jq_monto_descuento.val(),
             erp_Dsubtotal: jq_subtotal.val(),
             erp_Digv: jq_igv.val(),
             erp_Dimporte: jq_total.val(),
             erp_Dpercepcion: "0",
             erp_Dtotal: jq_total.val(),
             numero_expediente: jq_numero_expediente.val(),
             numero_expediente_2: jq_numero_expediente_2.val(),
             pto_venta_referencia: '',
             situacion_aprobacion: 'Sin Aprobacion',
             responsable_aprobacion: '00',
             fecha_aprovacion: '"01/01/1900',
             comentario_aprovacion:'',
             largo: '0',
             ancho:'0',
            
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
    console.log(pais_proveedor);
    var retorno=true;

    if(isEmptyOrWhiteSpaces(jq_porc_descuento.val())) {
        jq_porc_descuento.val("0");
    }
    if(isEmptyOrWhiteSpaces(jq_dias_forma_pago.val())) {
        jq_dias_forma_pago.val("0");
    }
    if (pais_proveedor != '001' && jq_incoterm.val() == '00') {
        retorno = false;
        mostrarMensajeModal("Aviso","Debe ingresar un Incoterm")
    }
    if(jq_tasa_cambio.val() * 1 == 0 ) {
        retorno = false;
        mostrarMensajeModal("Aviso","Tipo de cambio debe ser mayor a 0");
    }
    if(isEmptyOrWhiteSpaces(jq_codigo_proveedor.val())) {
        retorno = false;
        mostrarMensajeModal("Aviso","Debe ingresar un proveedor");
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
    jq_comentario_normal_02.prop("checked", false);
    jq_comentario_detallado.prop("checked", false);

    documentoSeleccionado = rowId_seleccionado;
    row_lista_documento_selected = jq_grid_documentos.jqGrid("getRowData", documentoSeleccionado);
    var data ={
        numero_documento : row_lista_documento_selected.Numero,
        motivo_documento : row_lista_documento_selected.Codigo_Motivo_Serie,
        codigo_punto_venta : row_lista_documento_selected.Codigo_Punto_Venta
    }
    if(impresion){
        data ={
            numero_documento : jq_numero_correlativo.val(),
            motivo_documento : jq_motivo.val(),
            codigo_punto_venta : ""
        }
    }
    $.ajax({
        type: "POST",
        url: url_consultar,
        data: data,
        success: function (data) {
            console.log(data);
            rellenar_formas_pago(data[0].codigo_proveedor,'42',data[0].documento_forma_pago_codigo);
            rellenar_sublista_clientes(data[0].codigo_proveedor, url_proveedores_contactos,"contacto_proveedor",data[0].proveedor_contacto_codigo);
            rellenar_sublista_clientes(data[0].codigo_proveedor, url_proveedores_agencias,"agencia_proveedor",data[0].proveedor_agencia);

            // ** Ventana 1 - 1 ** //
            jq_tipo.val(data[0].documento_tipo);
            jq_codigo_proveedor.val(data[0].codigo_proveedor);
            jq_ruc_proveedor.val(data[0].codigo_proveedor);
            jq_nombre_proveedor.val(data[0].proveedor_nombre);
            jq_telefono_proveedor.val(data[0].proveedor_telefono);
            jq_direccion_proveedor.val(data[0].proveedor_direccion);
            jq_email_proveedor.val(data[0].proveedor_correo);
            //Contacto

            // ** Ventana 1 - 2 ** //
            jq_motivo.val(data[0].documento_motivo_venta_codigo);
            data[0].documento_automatico=="A" ? jq_automatico.prop('checked', true) : jq_automatico.prop('checked', false)
            data[0].documento_automatico=="M" ? jq_manual.prop('checked', true) : jq_manual.prop('checked', false)
            jq_numero_correlativo.val(data[0].documento_numero);
            jq_fecha_doc.val(data[0].documento_fecha_format23);
            jq_fecha_validez.val(data[0].documento_fecha_validez_format23);
            jq_dias_forma_pago.val(data[0].documento_dias);
            jq_fecha_entrega.val(data[0].documento_fecha_entrega_format23);
            jq_responsable.val(data[0].documento_responsable);
            //Forma Pago
            jq_mas_igv.prop('checked', (data[0].documento_mas_igv=="S" ? true : false));
            jq_moneda.val(data[0].documento_moneda);
            jq_tipo_cambio.val(data[0].nombre_tipo_cambio);
            jq_tasa_cambio.val(data[0].tipo_cambio);
            jq_porc_descuento.val(data[0].documento_descuento_porc);
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
            jq_unidad_negocio.val(data[0].unidad_negocio_codigo);
            jq_centro_costos.val(data[0].documento_cencos_codigo);
            jq_orden_trabajo.val(data[0].documento_ot_codigo);
            jq_agencia_proveedor.val(data[0].proveedor_agencia);
            jq_fact_nombre.val(data[0].documento_factura_a_nombre);
            jq_punto_partida.val(data[0].documento_punto_llegada);

            // ** Ventana 2 - 2 ** //
            jq_numero_importacion.val(data[0].documento_numero_importacion);
            jq_invoice.val(data[0].documento_invoice);
            jq_fecha_fact_comercial.val(data[0].documento_fecha_fact_comercial23);
            jq_incoterm.val(data[0].documento_incoterm);
            jq_numero_expediente.val(data[0].documento_numero_expediente);
            jq_numero_expediente_2.val(data[0].documento_numero_expediente_2);
            jq_referencia_requerimiento_motivo.val(data[0].requerimiento_motivo);
            jq_referencia_requerimiento_numero.val(data[0].requerimiento_numero);
            //Requerimiento motivo
            //Requerimiento numero

            
            pais_proveedor = data[0].proveedor_pais;

            setFormatoImpresion(
                {
                    modulo : 'Compras',
                    tipo_formato : 'tramites',
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
    // console.log(rowData);
    if(rowData.Tipo_Compra!="REQ"){
        // ** Ventana 1 - 1 ** //
        jq_codigo_proveedor.val(rowData.Codigo_Proveedor);
        jq_ruc_proveedor.val(rowData.Pais == "001"? rowData.Codigo_Proveedor: "");
        jq_nombre_proveedor.val(rowData.Nombre_Proveedor);
        jq_direccion_proveedor.val(rowData.Proveedor_Direccion);
        jq_telefono_proveedor.val(rowData.Telefono_Proveedor);
        jq_email_proveedor.val(rowData.Correo_Proveedor);
        rellenar_sublista_clientes(rowData.Codigo_Proveedor, url_proveedores_contactos,"contacto_proveedor",rowData.Codigo_Contacto);
        // ** Ventana 1 - 2 ** //
        rellenar_formas_pago(rowData.Codigo_Proveedor,'42',rowData.Forma_Pago);
        jq_dias_forma_pago.val(rowData.Dias_Forma_Pago);
        // jq_porc_descuento.val(rowData.Porc_Descuento);
        // ** Ventana 2 - 1 ** //
        // rellenar_sublista_clientes(rowData.Codigo_proveedor, url_proveedores_agencias,"agencia_proveedor",rowData.Codigo_Agencia);
        // jq_punto_llegada_proveedor.val(rowData.Punto_Llegada);
        pais_proveedor
        $.ajax({
            url: '/proveedores/datos',
            type: 'POST',
            data: {
                codigo: rowData.Codigo_Proveedor
            },
            success: function (result){
                console.log(result);
                pais_proveedor = result[0].Codigo_Pais;
                //extranjero =  (pais_proveedor != "001");
            }
        })
        
        //jq_referencia_requerimiento_motivo.html("<option value ='00' > Ninguno </option>")
    }else{
        // rellenar_motivos_tramite_series("REQ",referencia_requerimiento_motivo,false);
    }
    
    // ** Ventana 1 - 1 ** //
    // ** Ventana 1 - 2 ** //
    jq_moneda.val(rowData.Moneda);
    jq_glosa.val(rowData.glosa);
    jq_mas_igv.prop('checked', true);

    // ** Ventana 1 - 3 ** //
    // jq_base_calculada.val(rowData.Sub_Total_Sin_Descuentos);
    // jq_monto_descuento.val(rowData.Monto_Descuento);
    // jq_subtotal.val(rowData.Sub_Total);
    // jq_igv.val(rowData.Igv);
    // jq_total.val(rowData.Total);
    
    // ** Ventana 2 - 1 ** //
    jq_unidad_negocio.val(rowData.Codigo_Unidad_Negocio);
    jq_centro_costos.val(rowData.Cencos);
    jq_orden_trabajo.val(rowData.Ot);
    //Factura a nombre de:
    //Lugar de entraga

    
    // ** Ventana 2 - 2 ** //
    //Nro de Importacion
    //Invoice
    //Fecha Fact Comercial
    //Icoterm 
    //NroExp
    //jq_referencia_requerimiento_motivo.val('00');
    jq_referencia_requerimiento_numero.val(rowData.Referencia_Requerimiento_Numero);
    jq_numero_expediente.val(rowData.Numero_Expediente);
    jq_numero_expediente_2.val(rowData.Numero_Expediente_2);

    // jq_tipo_documento_referencia.val(rowData.Codigo_Movimiento == ""? rowData.Tipo_Venta : rowData.Codigo_Movimiento);
    // jq_serie_documento_referencia.val(rowData.Codigo_Motivo_Serie);
    // jq_numero_documento_referencia.val(rowData.Numero);
    // recalcular_montos_ventas();
};

function rowid_dblclick_detalle_contable (){
    
}
function calcular_formas_pago_proveedor (){
    
}