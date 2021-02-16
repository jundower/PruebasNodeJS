var fecha_trabajo=new Date();
var short_fecha_trabajo="";
var url_motivo_tramites="/talonarios/motivos_tramite_correlativo";
var url_guardar = "/cotizacion/guardar";
var url_configuracion_permisos = '/configuraciones/configuracion_permisos/proceso_ventas__sist_cotizacion__solicitud_cotizacion';


var automatico = "automatico";
var manual = "manual";
var motivo = "motivo";
var moneda = "moneda";
var numero_correlativo = "numero_correlativo";
var fecha_doc = "fecha_doc";
var fecha_validez = "fecha_validez";
var fecha_entrega = "fecha_entrega";
var tipo_cambio = "tipo_cambio";
var tasa_cambio = "tasa_cambio";
var mas_igv = "mas_igv";
var codigo_cliente = "codigo_cliente";
var porc_descuento = "porc_descuento";
var dias_forma_pago = "dias_forma_pago";
var subtotal = "subtotal";
var monto_descuento = "monto_descuento";
var igv = "igv";
var total = "total";
var forma_pago = "forma_pago";
var nombre_cliente = "nombre_cliente";
var ruc_cliente = "ruc_cliente";
var lista_precios = "lista_precios";
var telefono_cliente = "telefono_cliente";
var email_cliente = "email_cliente";
var centro_costos = "centro_costos";
var porc_descuento = "porc_descuento";
var orden_trabajo = "orden_trabajo";
var punto_llegada_cliente = "punto_llegada_cliente";
var dias_forma_pago = "dias_forma_pago";
var unidad_negocio = "unidad_negocio";
var contacto_cliente ="contacto_cliente";
var vendedor1 = "vendedor1";
var vendedor2 = "vendedor2";
var glosa = "glosa";
var agencia_cliente = "agencia_cliente";
var presupuesto = "presupuesto";
var subtotal = "subtotal";
var monto_descuento = "monto_descuento";
var igv = "igv";
var total = "total";
var gestor = "gestor";
var tipo = "tipo";
var motivo_referencia_presupuesto = "motivo_referencia_presupuesto";
var numero_referencia = "numero_referencia";
var numero_expediente1 = "numero_expediente1";
var numero_expediente2 = "numero_expediente2";
var modal_ventana_lista = "modal_ventana_lista";

var jq_automatico;
var jq_manual;
var jq_motivo;
var jq_moneda;
var jq_numero_correlativo;
var jq_fecha_doc;
var jq_fecha_validez;
var jq_fecha_entrega;
var jq_tipo_cambio;
var jq_tasa_cambio;
var jq_mas_igv;
var jq_codigo_cliente;
var jq_porc_descuento;
var jq_dias_forma_pago;
var jq_subtotal;
var jq_monto_descuento;
var jq_igv;
var jq_total;
var jq_forma_pago;
var jq_nombre_cliente;
var jq_ruc_cliente;
var jq_lista_precios;
var jq_telefono_cliente;
var jq_email_cliente;
var jq_centro_costos;
var jq_porc_descuento;
var jq_orden_trabajo;
var jq_punto_llegada_cliente;
var jq_dias_forma_pago;
var jq_unidad_negocio;
var jq_contacto_cliente;
var jq_vendedor1;
var jq_vendedor2;
var jq_glosa;
var jq_agencia_cliente;
var jq_presupuesto;
var jq_subtotal;
var jq_monto_descuento;
var jq_igv;
var jq_total;
var jq_gestor;
var jq_tipo;
var jq_motivo_referencia_presupuesto;
var jq_numero_referencia;
var jq_numero_expediente1;
var jq_numero_expediente2;
var jq_modal_ventana_lista;

$(document).ready(function() {
   
    jq_automatico = $("#"+automatico);
    jq_manual = $("#"+manual);
    jq_motivo = $("#"+motivo);
    jq_moneda = $("#"+moneda);
    jq_numero_correlativo = $("#"+numero_correlativo);
    jq_fecha_doc = $("#"+fecha_doc);
    jq_fecha_validez = $("#"+fecha_validez);
    jq_fecha_entrega = $("#"+fecha_entrega);
    jq_tipo_cambio = $("#"+tipo_cambio);
    jq_tasa_cambio = $("#"+tasa_cambio);
    jq_mas_igv = $("#"+mas_igv);
    jq_codigo_cliente = $("#"+codigo_cliente);
    jq_porc_descuento = $("#"+porc_descuento);
    jq_dias_forma_pago = $("#"+dias_forma_pago);
    jq_subtotal = $("#"+subtotal);
    jq_monto_descuento = $("#"+monto_descuento);
    jq_igv = $("#"+igv);
    jq_total = $("#"+total);
    jq_forma_pago = $("#"+forma_pago);
    jq_nombre_cliente = $("#"+nombre_cliente);
    jq_direccion_cliente = $("#"+direccion_cliente);
    jq_ruc_cliente = $("#"+ruc_cliente);
    jq_lista_precios = $("#"+lista_precios);
    jq_telefono_cliente = $("#"+telefono_cliente);
    jq_email_cliente = $("#"+email_cliente);
    jq_centro_costos = $("#"+centro_costos);
    jq_porc_descuento = $("#"+porc_descuento);
    jq_orden_trabajo = $("#"+orden_trabajo);
    jq_punto_llegada_cliente = $("#"+punto_llegada_cliente);
    jq_dias_forma_pago = $("#"+dias_forma_pago);
    jq_unidad_negocio = $("#"+unidad_negocio);
    jq_contacto_cliente = $("#"+contacto_cliente);
    jq_vendedor1 = $("#"+vendedor1);
    jq_vendedor2 = $("#"+vendedor2);
    jq_glosa = $("#"+glosa);
    jq_agencia_cliente = $("#"+agencia_cliente);
    jq_presupuesto = $("#"+presupuesto);
    jq_subtotal = $("#"+subtotal);
    jq_monto_descuento = $("#"+monto_descuento);
    jq_igv = $("#"+igv);
    jq_total = $("#"+total);
    jq_gestor = $("#"+gestor);
    jq_tipo = $("#"+tipo);
    jq_motivo_referencia_presupuesto = $("#"+motivo_referencia_presupuesto);
    jq_numero_referencia = $("#"+numero_referencia);
    jq_numero_expediente1 = $("#"+numero_expediente1);
    jq_numero_expediente2 = $("#"+numero_expediente2);
    
    jq_modal_ventana_lista = $("#"+modal_ventana_lista);

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
    
    $("#nuevo").show();
    $("#guardar").show();
    $("#listar").show();
    $("#imprimir").show();
    setTitle("Solicitud de Cotización");
    setTitleLista("Listado de Cotización");
    setListaDocumentos('/cotizacion/lista', '/cotizacion/consultar', '/cotizacion/detalle','Motivo','listado_documentos');
    setCabeceraVentas("/talonarios/motivos_tramite");
    setDetalleVentas("detalle_venta");
    nuevo();
});

function nuevo(){
    
    estado="guardar";
    short_fecha_trabajo =  getShortDate(fecha_trabajo);
    jq_automatico.prop('checked', true);
    jq_manual.prop('checked', false);
    jq_direccion_cliente.prop( "disabled", true );
    
    rellenar_motivos_tramite_series("COT",motivo,true);
    rellenar_motivos_tramite_series("PRE","motivo_referencia_presupuesto",false);
    rellenar_codigo_nombre(url_unidad_negocio,"unidad_negocio","user-Unidad_negocio");
    rellenar_codigo_nombre(url_centro_costos,"centro_costos","user-codigo_centro_costos");
    rellenar_codigo_nombre(url_orden_trabajo,"orden_trabajo","user-codigo_ninguno");
    rellenar_codigo_nombre(url_presupuesto,"presupuesto","user-codigo_ninguno");
    rellenar_codigo_nombre(url_gestor_cobranza,"gestor","user-codigo_ninguno");
    rellenar_codigo_nombre(url_vendedor_lista,"vendedor1","user-codigo_ninguno");
    rellenar_codigo_nombre(url_vendedor_lista,"vendedor2","user-codigo_ninguno");
    rellenar_codigo_nombre(url_vendedor_lista,"vendedor3","user-codigo_ninguno");
    rellenar_moneda(moneda);
    rellenar_tipo_cambio(tipo_cambio, tasa_cambio,fecha_doc); //Mantener este orden de tasa/tipo, porque si no, no funciona dinamicamente y siempre agarrará VTA
    rellenar_punto_partida("punto_partida");

    jq_fecha_doc.val(short_fecha_trabajo);
    jq_fecha_validez.val(short_fecha_trabajo);
    jq_fecha_entrega.val(short_fecha_trabajo);
    
    cargar_configuraciones();
    limpiar();
    permisos();
}

function limpiar(){
    jq_codigo_cliente.val("");
    jq_ruc_cliente.val("");
    jq_nombre_cliente.val("");
    jq_direccion_cliente.val("");
    jq_telefono_cliente.val("");
    jq_email_cliente.val("");
    jq_contacto_cliente.val("");
    jq_lista_precios.val("");
    jq_dias_forma_pago.val("0");
    jq_porc_descuento.val("0");
    jq_glosa.val("");
    jq_base_calculada.val("0.00");
    jq_monto_descuento.val("0.00");
    jq_subtotal.val("0.00");
    jq_igv.val("0.00");
    jq_total.val("0.00");
    jq_punto_llegada_cliente.val("");
    jq_numero_referencia.val("");
    jq_numero_expediente1.val("");
    jq_numero_expediente2.val("");

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
                tipo_documento:'COT'
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

function guardar(){
    url_guardar="";
    var mensaje="";
    var impresion=false;
    switch (estado) {
        case 'guardar':
            url_guardar = "/cotizacion/guardar";
            mensaje = "Guardado satisfactoriamente."
            impresion=true;
            break;
        case  'modificar':
            url_guardar = "/cotizacion/modificar";
            mensaje = "Modificado satisfactoriamente."
            break;
        case 'eliminar':
            url_guardar = "/cotizacion/eliminar";
            mensaje = "Eliminado satisfactoriamente."
            break;
        case 'anular':
            url_guardar = "/cotizacion/anular";
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
             fecha_doc: jq_fecha_doc.val(),
             fecha_entr: jq_fecha_entrega.val(),
             fecha_validez: jq_fecha_validez.val(),
             moneda: jq_moneda.val(),
             importe: jq_total.val(),
             forma_pago: jq_forma_pago.val(),
             codigo_cliente: jq_codigo_cliente.val(),
             nombre_cliente: jq_nombre_cliente.val(),
             ruc_cliente: jq_ruc_cliente.val(),
             estado: "Ingresado",
             observacion: jq_text_comentario.val(),
             mas_igv: mas_igv,
             tipo_cambio: jq_tipo_cambio.val(),
             tasa_cambio: jq_tasa_cambio.val(),
             lista_precios: jq_lista_precios.val(),
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
             observacion2: "",
             observacion3: "",
             observacion4: "",
             observacion5: "",
             observacion6: "",
             observacion7: "",
             observacion8: "",
             comentario2: "",
             comentario3: "",
             comentario4: "",
             comentario5: "",
             comentario6: "",
             comentario7: "",
             pto_llegada: jq_punto_llegada_cliente.val(),
             dias: jq_dias_forma_pago.val(),
             pais: pais_cliente,
             atencion: "Pendiente",
             porcentaje: "",
             codigo_unidad_negocio: jq_unidad_negocio.val(),
             codigo_contacto: jq_contacto_cliente.val(),
             nom_contacto: jq_contacto_cliente.find('option:selected').text(),
             vendedor_1: jq_vendedor1.val(),
             vendedor_2: jq_vendedor2.val(),
             Glosa : jq_glosa.val(),
             codigo_agencia: jq_agencia_cliente.val(),
             usuario: "",
             Pc_User: "",
             Pc_Fecha: "01/01/1900",
             Pc_Ip: "",
             comentario1: "",
             comentario8: "",
             erp_presupuesto: jq_presupuesto.val(),
             subtotal_sin_descuentos: jq_base_calculada.val(),
             erp_Ddescuento: jq_monto_descuento.val(),
             erp_Dsubtotal: jq_subtotal.val(),
             erp_Digv: jq_igv.val(),
             erp_Dimporte: jq_total.val(),
             erp_Dpercepcion: "0",
             erp_Dtotal: jq_total.val(),
             erp_gestor: jq_gestor.val(),
             tipo: jq_tipo.val(),
             motivo_ref: jq_motivo_referencia_presupuesto.val(),
             numero_referencia: jq_numero_referencia.val(),
             numero_expediente1: jq_numero_expediente1.val(),
             numero_expediente2: jq_numero_expediente2.val(),
             filas_detalle: JSON.stringify( filas_detalle)
         },
         success: function(result){
             console.log(result.mensaje);
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
    if(isEmptyOrWhiteSpaces(jq_codigo_cliente.val())) {
        retorno = false;
        mostrarMensajeModal("Aviso","Debe ingresar un cliente");
        mensaje += "Debe ingresar un cliente. <br>";
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
            rellenar_formas_pago(data[0].Codigo_Cliente,'12',data[0].documento_forma_pago_codigo);
            rellenar_sublista_clientes(data[0].Codigo_Cliente, url_lista_precios_cliente,"lista_precios",data[0].documento_lista_precios);
            rellenar_sublista_clientes(data[0].Codigo_Cliente, url_clientes_contactos,"contacto_cliente",data[0].cliente_contacto_codigo);
            rellenar_sublista_clientes(data[0].Codigo_Cliente, url_clientes_agencias,"agencia_cliente",data[0].cliente_agencia);

            data[0].documento_automatico=="A" ? jq_automatico.prop('checked', true) : jq_automatico.prop('checked', false)
            data[0].documento_automatico=="M" ? jq_manual.prop('checked', true) : jq_manual.prop('checked', false)
            jq_mas_igv.prop('checked', (data[0].documento_mas_igv=="S" ? true : false));
            jq_tipo.val(data[0].documento_tipo);
            jq_motivo.val(data[0].documento_motivo_venta_codigo);
            jq_moneda.val(data[0].documento_moneda);
            jq_numero_correlativo.val(data[0].documento_numero);
            jq_fecha_doc.val(data[0].documento_fecha_format23);
            jq_fecha_validez.val(data[0].documento_fecha_validez_format23);
            jq_fecha_entrega.val(data[0].documento_fecha_entrega_format23);
            jq_tipo_cambio.val(data[0].nombre_tipo_cambio);
            jq_tasa_cambio.val(data[0].tipo_cambio);
            jq_codigo_cliente.val(data[0].Codigo_Cliente);
            jq_porc_descuento.val(data[0].documento_descuento_porc);
            jq_dias_forma_pago.val(data[0].documento_dias);
            jq_nombre_cliente.val(data[0].cliente_nombre);
            jq_direccion_cliente.val(data[0].cliente_direccion);
            jq_ruc_cliente.val(data[0].cliente_ruc);
            jq_telefono_cliente.val(data[0].cliente_telefono);
            jq_email_cliente.val(data[0].cliente_correo);
            jq_centro_costos.val(data[0].documento_cencos_codigo);
            jq_orden_trabajo.val(data[0].documento_ot_codigo);
            jq_punto_llegada_cliente.val(data[0].documento_punto_llegada);
            jq_unidad_negocio.val(data[0].unidad_negocio_codigo);
            jq_vendedor1.val(data[0].documento_vendedor1);
            jq_vendedor2.val(data[0].documento_vendedor2);
            jq_vendedor3.val(data[0].documento_vendedor1);
            jq_glosa.val(data[0].documento_glosa);
            jq_presupuesto.val(data[0].presupuesto_codigo);
            jq_gestor.val(data[0].gestor_codigo);
            jq_numero_expediente1.val(data[0].numero_expediente1);
            jq_numero_expediente2.val(data[0].numero_expediente2);

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
            pais_cliente = data[0].cliente_pais;

            setFormatoImpresion(
                {
                    modulo : 'Ventas',
                    tipo_formato : 'tramites',
                    punto_venta : row_lista_documento_selected.Codigo_Punto_Venta,
                    tipo_documento : 'COT',
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
