var fecha_trabajo=new Date();
var short_fecha_trabajo="";
var url_motivo_tramites="/talonarios/motivos_serie_correlativo";
var url_guardar = "/facturacion/guardar";
var url_configuracion_permisos = '/configuraciones/configuracion_permisos/proceso_ventas__sist_venta_facturacion__ventas_facturacion';

var pto_venta = "pto_venta";
var automatico = "automatico";
var manual = "manual";
var tipo_documento = "tipo_documento";
var serie = "serie";
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
var anticipo = "anticipos";
var total = "total";
var forma_pago = "forma_pago";
var nombre_cliente = "nombre_cliente";
var direccion_cliente = "direccion_cliente";
var ruc_cliente = "ruc_cliente";
var lista_precios = "lista_precios";
var telefono_cliente = "telefono_cliente";
var email_cliente = "email_cliente";
var centro_costos = "centro_costos";
var orden_trabajo = "orden_trabajo";
var punto_partida = "punto_partida";
var punto_llegada_cliente = "punto_llegada_cliente";
var dias_forma_pago = "dias_forma_pago";
var unidad_negocio = "unidad_negocio";
var contacto_cliente ="contacto_cliente";
var vendedor1 = "vendedor1";
var vendedor2 = "vendedor2";
var numero_orden = "numero_orden";
var motivo_venta = "motivo_venta";
var glosa = "glosa";
var tipo_operacion = "tipo_operacion";
var detalle_anulacion = "detalle_anulacion";
var motivo_operacion = "motivo_operacion";
var motivo_operacion_div = "motivo_operacion_div";
var agencia_cliente = "agencia_cliente";
var presupuesto = "presupuesto";
var detraccion = "detraccion";
var subtotal = "subtotal";
var monto_descuento = "monto_descuento";
var igv = "igv";
var total = "total";
var gestor = "gestor";
var tipo = "tipo";
var motivo_referencia = "motivo_referencia";
var numero_referencia = "numero_referencia";
var chofer = "chofer";
var agencia_transporte = "agencia_transporte";
var transportista = "transportista";
var vehiculo = "vehiculo";
var motivo_traslado = "motivo_traslado";
var fecha_referencia = "fecha_referencia";
var tipo_documento_referencia = "tipo_documento_referencia";
var serie_documento_referencia = "serie_documento_referencia";
var numero_documento_referencia = "numero_documento_referencia";
var numero_expediente1 = "numero_expediente1";
var numero_expediente2 = "numero_expediente2";

var jq_pto_venta;
var jq_automatico;
var jq_manual;
var jq_tipo_documento;
var jq_serie;
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
var jq_anticipo;
var jq_total;
var jq_forma_pago;
var jq_nombre_cliente;
var jq_direccion_cliente;
var jq_ruc_cliente;
var jq_lista_precios;
var jq_telefono_cliente;
var jq_email_cliente;
var jq_centro_costos;
var jq_orden_trabajo;
var jq_punto_partida;
var jq_punto_llegada_cliente;
var jq_dias_forma_pago;
var jq_unidad_negocio;
var jq_contacto_cliente;
var jq_vendedor1;
var jq_vendedor2;
var jq_numero_orden;
var jq_motivo_venta;
var jq_glosa;
var jq_tipo_operacion;
var jq_detalle_anulacion;
var jq_motivo_operacion;
var jq_motivo_operacion_div;
var jq_agencia_cliente;
var jq_presupuesto;
var jq_detraccion;
var jq_subtotal;
var jq_monto_descuento;
var jq_igv;
var jq_total;
var jq_gestor;
var jq_tipo;
var jq_motivo_referencia;
var jq_numero_referencia;
var jq_chofer;
var jq_agencia_transporte;
var jq_transportista;
var jq_vehiculo;
var jq_motivo_traslado;
var jq_fecha_referencia;
var jq_tipo_documento_referencia;
var jq_serie_documento_referencia;
var jq_numero_documento_referencia;
var jq_numero_expediente1;
var jq_numero_expediente2;
var datos_anticipos=[];

$(document).ready(function() {
    
    jq_pto_venta = $("#"+pto_venta);
    jq_automatico = $("#"+automatico);
    jq_manual = $("#"+manual);
    jq_tipo_documento = $("#"+tipo_documento);
    jq_serie = $("#"+serie);
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
    jq_anticipo = $("#"+anticipo);
    jq_total = $("#"+total);
    jq_forma_pago = $("#"+forma_pago);
    jq_nombre_cliente = $("#"+nombre_cliente);
    jq_direccion_cliente = $("#"+direccion_cliente);
    jq_ruc_cliente = $("#"+ruc_cliente);
    jq_lista_precios = $("#"+lista_precios);
    jq_telefono_cliente = $("#"+telefono_cliente);
    jq_email_cliente = $("#"+email_cliente);
    jq_centro_costos = $("#"+centro_costos);
    jq_orden_trabajo = $("#"+orden_trabajo);
    jq_punto_partida = $("#"+punto_partida);
    jq_punto_llegada_cliente = $("#"+punto_llegada_cliente);
    jq_dias_forma_pago = $("#"+dias_forma_pago);
    jq_unidad_negocio = $("#"+unidad_negocio);
    jq_contacto_cliente = $("#"+contacto_cliente);
    jq_vendedor1 = $("#"+vendedor1);
    jq_vendedor2 = $("#"+vendedor2);
    jq_numero_orden = $("#"+numero_orden);
    jq_motivo_venta = $("#"+motivo_venta);
    jq_glosa = $("#"+glosa);
    jq_tipo_operacion = $("#"+tipo_operacion);
    jq_detalle_anulacion = $("#"+detalle_anulacion);
    jq_motivo_operacion = $("#"+motivo_operacion);
    jq_motivo_operacion_div = $("#"+motivo_operacion_div);
    jq_agencia_cliente = $("#"+agencia_cliente);
    jq_presupuesto = $("#"+presupuesto);
    jq_detraccion = $("#"+detraccion);
    jq_subtotal = $("#"+subtotal);
    jq_monto_descuento = $("#"+monto_descuento);
    jq_igv = $("#"+igv);
    jq_total = $("#"+total);
    jq_gestor = $("#"+gestor);
    jq_tipo = $("#"+tipo);
    jq_motivo_referencia = $("#"+motivo_referencia);
    jq_numero_referencia = $("#"+numero_referencia);
    jq_transportista = $("#"+transportista);
    jq_vehiculo = $("#"+vehiculo);
    jq_motivo_traslado = $("#"+motivo_traslado);
    jq_chofer = $("#"+chofer);
    jq_agencia_transporte = $("#"+agencia_transporte);
    jq_fecha_referencia = $("#"+fecha_referencia);
    jq_tipo_documento_referencia = $("#"+tipo_documento_referencia);
    jq_serie_documento_referencia = $("#"+serie_documento_referencia);
    jq_numero_documento_referencia = $("#"+numero_documento_referencia);
    jq_numero_expediente1 = $("#"+numero_expediente1);
    jq_numero_expediente2 = $("#"+numero_expediente2);

    $(".comentario_normal_02").removeClass("d-none");
    $(".comentario_normal").addClass("d-none");
    
    jq_tipo_operacion.val('OPERACION GRAVADA');

    jq_automatico.click(function() {
        cargar_correlativo();
    });
    jq_manual.click(function() {
        cargar_correlativo();
    });
    jq_tipo_documento.change(function(){
        rellenar_motivos_tramite_series($(this).val(),"serie",true);
        // jq_serie.trigger("change");
    }); 
    jq_serie.change(function() {
        cargar_correlativo();
    });
    
    jq_tipo.change(function() {
        jq_motivo_operacion_div.hide();
        jq_tipo_documento.val("01");
        switch ($(this).val()){
            case "FACTURAR GUIAS DE VENTA":
                $("#buscar_pendientes").prop( "disabled", false );
                setVentasPendientes('Documentos Pendientes','/facturacion/lista_documentos_pendientes','/facturacion/lista_detalle_pendientes','09');
                break;
            // case "ANTICIPO":
            case "NOTA DE DEBITO":
                $("#buscar_pendientes").prop( "disabled", false );
                setVentasPendientes('Documentos Pendientes','/facturacion/lista_documentos_pendientes','/facturacion/lista_detalle_pendientes','08');
                jq_tipo_documento.val("08");
                jq_motivo_operacion_div.show();
                Llenar_Motivo(jq_tipo.val());
                $("#modal_pendientes").modal("show");
                break;
            case "NOTA DE CREDITO DIRECTO":
                $("#buscar_pendientes").prop( "disabled", true );
                jq_tipo_documento.val("07");
                jq_motivo_operacion_div.show();
                Llenar_Motivo(jq_tipo.val());
                break;
            case "NOTA DE CREDITO POR DEVOLUCION":
            case "NOTA DE CREDITO POR DESCUENTO":
                $("#buscar_pendientes").prop( "disabled", false );
                setVentasPendientes('Documentos Pendientes','/facturacion/lista_documentos_pendientes','/facturacion/lista_detalle_pendientes','07');
                jq_tipo_documento.val("07");
                jq_motivo_operacion_div.show();
                Llenar_Motivo(jq_tipo.val());
                $("#modal_pendientes").modal("show");
                break;
            case "FACTURAR PEDIDO":
            case "VENTA DIFERIDA DE PEDIDO":
            case "FACTURAR PEDIDO PARCIAL":
                $("#buscar_pendientes").prop( "disabled", false );
                setVentasPendientes('Documentos Pendientes','/pedido/lista_documentos_pendientes','/pedido/lista_detalle_pendientes');
                $("#modal_pendientes").modal("show");
                break;
            default:
                $("#buscar_pendientes").prop( "disabled", true );
        }
        jq_tipo_documento.trigger("change")
    });
    $("#buscar_pendientes").prop( "disabled", true );
    $("#nuevo").show();
    $("#guardar").show();
    $("#listar").show();
    $("#imprimir").show();
    $('#modificar').hide();
    setTitle("Facturación");
    setTitleLista("Listado de Facturas");
    setListaDocumentos('/facturacion/lista', '/facturacion/consultar', '/facturacion/detalle','Motivo','listado_documentos');
    setCabeceraVentas("/talonarios/motivos_series");
    setDetalleVentas("detalle_venta");
    nuevo();

});

async function nuevo(){
    estado="guardar";
    short_fecha_trabajo =  getShortDate(fecha_trabajo);
    jq_automatico.prop('checked', true);
    jq_manual.prop('checked', false);
    jq_direccion_cliente.prop( "disabled", true );
    jq_subtotal.prop( "disabled", true );
    jq_monto_descuento.prop( "disabled", true );
    jq_igv.prop( "disabled", true );
    jq_total.prop( "disabled", true );
    jq_fecha_doc.prop( "disabled", true );
    //rellenar_vendedores(true,true,true);
    
    let finished = await rellenar_codigo_nombre(url_tipo_documento_venta,tipo_documento,"user-predeterminado_documento");
    // rellenar_motivos_tramite_series("01","serie",true);
    //rellenar_motivos_tramite_series("01",numero_correlativo,true); 
    rellenar_codigo_nombre(url_unidad_negocio,"unidad_negocio","user-Unidad_negocio");
    rellenar_codigo_nombre(url_centro_costos,"centro_costos","user-codigo_centro_costos");
    rellenar_codigo_nombre(url_orden_trabajo,"orden_trabajo","user-codigo_ninguno");
    rellenar_codigo_nombre(url_presupuesto,"presupuesto","user-codigo_ninguno");
    rellenar_codigo_nombre(url_gestor_cobranza,"gestor","user-codigo_ninguno");
    rellenar_codigo_nombre(url_vendedor_lista,"vendedor1","user-codigo_ninguno");
    rellenar_codigo_nombre(url_vendedor_lista,"vendedor2","user-codigo_ninguno");
    rellenar_codigo_nombre(url_vendedor_lista,"vendedor3","user-codigo_ninguno");
    rellenar_codigo_nombre(url_motivo_traslado,"motivo_traslado","user-codigo_ninguno");
    rellenar_codigo_nombre(url_transportista,"transportista","user-codigo_ninguno");
    rellenar_codigo_nombre(url_vehiculo,"vehiculo","user-codigo_ninguno");
    rellenar_codigo_nombre(url_chofer,"chofer","user-codigo_ninguno");
    rellenar_codigo_nombre(url_agencia_transporte,"agencia_transporte","user-codigo_ninguno");
    rellenar_codigo_nombre(url_tipo_documento,"tipo_documento_referencia","user-codigo_ninguno");
    rellenar_codigo_nombre(url_detracciones,"detraccion","user-codigo_ninguno");
    rellenar_codigo_nombre(url_motivo_traslado,"motivo_venta","user-codigo_ninguno")
    
    rellenar_moneda(moneda);
    rellenar_tasa_cambio(tasa_cambio, short_fecha_trabajo,jq_tipo_cambio.val()) //Mantener este orden de tasa/tipo, porque si no, no funciona dinamicamente y siempre agarrará VTA
    rellenar_tipo_cambio(tipo_cambio,tasa_cambio, fecha_doc); //Mantener este orden de tasa/tipo, porque si no, no funciona dinamicamente y siempre agarrará VTA
    rellenar_punto_partida("punto_partida");


    cargar_configuraciones();
    limpiar();
    permisos();
    
    finished ==true ? jq_tipo.trigger("change") : '';
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
    jq_subtotal.val("0.00");
    jq_monto_descuento.val("0.00");
    jq_igv.val("0.00");
    jq_icbper.val("0.00");
    jq_anticipos.val("0.00");
    jq_total.val("0.00");

    $("#base_calculada_mask").val(formatNumber.new(0,"",2));
    $("#monto_descuento_mask").val(formatNumber.new(0,"",2));
    $("#anticipos_mask").val(formatNumber.new(0,"",2));
    $("#subtotal_mask").val(formatNumber.new(0,"",2));
    $("#igv_mask").val(formatNumber.new(0,"",2));
    $("#icbper_mask").val(formatNumber.new(0,"",2));
    $("#total_mask").val(formatNumber.new(0,"",2));

    jq_punto_llegada_cliente.val("");
    jq_numero_referencia.val("");
    jq_transportista.val("");
    jq_vehiculo.val("");
    jq_motivo_traslado.val("");
    jq_numero_orden.val("");
    jq_tipo_documento_referencia.val("");
    jq_serie_documento_referencia.val("");
    jq_numero_referencia.val("");
    jq_numero_expediente1.val("");
    jq_numero_expediente2.val("");
    jq_numero_documento_referencia.val("");
    jq_fecha_doc.val(short_fecha_trabajo);
    jq_fecha_validez.val(short_fecha_trabajo);
    jq_fecha_entrega.val(short_fecha_trabajo);
    jq_fecha_referencia.val(short_fecha_trabajo);
    $("#subvoucher_contable").val("");
    $("#numero_contable").val("");

    var jq_grid=jq_grid_detalle_ventas;
    jq_grid.saveCell(selected_Id_detalle_ventas,selected_cell_detalle_ventas);

    jq_grid.jqGrid("setGridParam",{
        url: url_getListaDetalle,
        mtype: "POST",
        datatype: "json",
        postData:{
            numero_documento : "00",
            tipo_documento : "00",
            codigo_punto_venta : "00",
            numero_serie: "00"
        }
    }).trigger("reloadGrid")

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
                anio:yyyy,
                tipo_documento: jq_tipo_documento.val(),
                punto_venta: jq_pto_venta.val()
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

    // $('<div></div>').appendTo('body')
    // .html('<div><h6>¿Seguro de Guardar?</h6></div>')
    // .dialog({
    // modal: true,
    // title: 'Delete message',
    // zIndex: 10000,
    // autoOpen: true,
    // width: 'auto',
    // resizable: false,
    // buttons: {
    // Yes: function() {
    //     $(this).dialog("close");
    //     guardarDocumento();
    // },
    // No: function() {
    //     $(this).dialog("close");
    // }
    // },
    // close: function(event, ui) {
    // $(this).remove();
    // }
    // });
    
    guardarDocumento();
};

function guardarDocumento(){

    url_guardar="";
    var mensaje="";
    var impresion=false;
    switch (estado) {
        case 'guardar':
            url_guardar = "/facturacion/guardar";
            mensaje = "Guardado satisfactoriamente."
            impresion=true;
            break;
        case  'modificar':
            url_guardar = "/facturacion/modificar";
            mensaje = "Modificado satisfactoriamente."
            break;
        case 'eliminar':
            url_guardar = "/facturacion/eliminar";
            mensaje = "Eliminado satisfactoriamente."
            break;
        case 'anular':
            url_guardar = "/facturacion/anular";
            mensaje = "Anulado satisfactoriamente."
            break;
    }
    var mas_igv = (jq_mas_igv.prop('checked' ) ? "S" : "N");
    var automatico = (jq_automatico.prop('checked') == true ? "A" : "M");
    
    var filas_detalle= generar_array_detalle();
    $.ajax({
        url: url_guardar,
        type: 'post',
        data:{
            tipo_documento: jq_tipo_documento.val(),
            serie: jq_serie.val(),
            tipo_movimiento: 'S',
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
            codigo_persona: "00",
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
            pto_partida: jq_punto_partida.val(),
            pto_llegada: jq_punto_llegada_cliente.val(),
            dias: jq_dias_forma_pago.val(),
            pais: pais_cliente,
            tipo_documento_cliente: tipo_documento_cliente,
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
            subtotal_sin_descuentos: jq_base_calculada.val(),
            erp_presupuesto: jq_presupuesto.val(),
            erp_Dsubtotal: jq_subtotal.val(),
            erp_Ddescuento: jq_monto_descuento.val(),
            erp_Digv: jq_igv.val(),
            erp_ICBPER: jq_icbper.val(),
            erp_Dimporte: jq_total.val(),
            erp_Dpercepcion: "0",
            erp_Dtotal: jq_total.val(),
            erp_gestor: jq_gestor.val(),
            tipo: jq_tipo.val(),
            motivo_ref: jq_motivo_referencia.val(),
            numero_referencia: jq_numero_referencia.val(),
            codigo_transportista: jq_transportista.val(),
            nombre_transportista: '',
            codigo_vehiculo: jq_vehiculo.val(),
            motivo_traslado: jq_motivo_traslado.val(),
            numero_orden: jq_numero_orden.val(),
            atencion_prod: 'Pendiente',
            porcentaje_prod: '0%',
            erp_tipdoc: '0',
            flag_ruta_contacto: 'N',
            ruta_contacto: 'NULL',
            erp_dscto_stock: 'S',
            erp_contacto_vendedor: '00',
            detalle_anulacion: jq_detalle_anulacion.val(),
            tipo_operacion: jq_tipo_operacion.val(),
            codigo_detraccion: jq_detraccion.val(),
            tipo_comprobante: '00',
            serie_comprobante: '00',
            numero_comprobante: '00',
            fecha_comprobante: '00',
            tipo_documento_referencia: jq_tipo_documento_referencia.val(),
            serie_documento_referencia: jq_serie_documento_referencia.val(),
            numero_documento_referencia: jq_numero_documento_referencia.val(),
            fecha_referencia: jq_fecha_referencia.val(),
            anticipo: jq_anticipo.val(),
            impmn: '0',
            impme: '0',
            costo: '0',
            codigo_almacen_d : '',
            nombre_cliente_2: '',
            codigo_proveedor: '00',
            nombre_proveedor_c: '',
            modulo: 'Facturacion',
            ccod_almacen2: '',
            ccod_almacend2: '',
            codigo_transaccion: '00',
            contabilizada: 'N',
            serie_guia_prov:'',
            nro_guia_prov:'',
            serie_fac_prov:'',
            nro_fac_prov:'',
            fecha_emision: '01/01/1900',
            codigo_caja: '00',
            erp_vuelto: '0',
            erp_motivo: jq_motivo_venta.val(),
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
            motivo_nota: jq_motivo_operacion.val(),
            igv_icbper: '0',
            redondeo: '0',
            agencia_transporte: jq_agencia_transporte.val(),
            codigo_chofer: jq_chofer.val(),
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
            erp_nro_exp: '',
            erp_ejercon_02: '',
            erp_percon_02: '',
            erp_cobsub_02: '',
            erp_numcon_02: '',
            erp_selecc: '',
            tipdoc_ref_2: '',
            ptovta_ref_2: '',
            motivo_ref_2: '',
            nro_ref_2: '',
            erp_cod_rubro: '00',
            detalleanulacion: '',
            cnum_lote: '',
            filas_detalle: JSON.stringify( filas_detalle),
            datos_anticipos: JSON.stringify( datos_anticipos),
            numero_expediente1: jq_numero_expediente1.val(),
            numero_expediente2: jq_numero_expediente2.val(),
        },
        success: function(result){
            if(result.estado == true){
                jq_numero_correlativo.val(result.codigo);
                $("#guardar").prop("disabled", true);
                $("#buscar_pendientes").prop( "disabled", true );

                mostrarMensaje(mensaje,true,2000);

                if(jq_tipo.val()=="NOTA DE CREDITO POR DEVOLUCION" || jq_tipo.val()=="NOTA DE CREDITO POR DESCUENTO"){
                    $('<div></div>').appendTo('body')
                    .html('<div><h6>¿Desea aplicar la nota de crédito?</h6></div>')
                    .dialog({
                    modal: true,
                    title: 'Delete message',
                    zIndex: 10000,
                    autoOpen: true,
                    width: 'auto',
                    resizable: false,
                    buttons: {
                        Yes: function() {
                            console.log("Yes");
                            $(this).dialog("close");
                        },
                        No: function() {
                            console.log("No");    
                            $(this).dialog("close");
                        }
                    },
                    close: function(event, ui) {
                        $(this).remove();    
                        if(estado!="eliminar") 
                            consultar(impresion,estado);
                        estado="Consultar";
                    }
                    });
                    
                }else{
                    if(estado!="eliminar") 
                        consultar(impresion,estado);
                    estado="Consultar";
                }
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
    if( (jq_tipo_documento.val()=="07" || jq_tipo_documento=="08") && isEmptyOrWhiteSpaces(jq_glosa.val())) {
        mostrarMensajeModal("Aviso","La glosa no puede estar vacía");
        retorno=false;
    }
    if( estado== "anular" && isEmptyOrWhiteSpaces(jq_detalle_anulacion.val()) ) {
        mostrarMensajeModal("Aviso","Se necesita un detalle de anulación");
        retorno=false;
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
        if(rowData.Lote_SN=="S" && rowData.Lote_Vencimiento==""){
            mostrarMensajeModal("Aviso","El producto "+rowData.Codigo+" necesita una fecha de vencimiento");
            retorno=false;
        }
        if(rowData.Lote_SN=="S" && rowData.Lote_Vencimiento=="01/01/1900"){
            mostrarMensajeModal("Aviso","El producto "+rowData.Codigo+" necesita un fecha de vencimiento");
            retorno=false;
        }
    }
    
    return retorno;
};

// function listar(){
//     jq_modal_ventana_lista.modal('show');
//     Actualizar_lista() ; 
// }

function consultar(impresion, estado) {

    documentoSeleccionado = rowId_seleccionado;
    row_lista_documento_selected = jq_grid_documentos.jqGrid("getRowData", documentoSeleccionado);
    var data ={
        numero_documento : row_lista_documento_selected.Numero,
        numero_serie : row_lista_documento_selected.Codigo_Motivo_Serie,
        codigo_punto_venta : row_lista_documento_selected.Codigo_Punto_Venta,
        tipo_documento : row_lista_documento_selected.Codigo_Tipo_Documento
    }
    if(impresion){
        data ={
            numero_documento : jq_numero_correlativo.val(),
            numero_serie : jq_serie.val(),
            tipo_documento: jq_tipo_documento.val(),
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

            rellenar_motivos_tramite_series(data[0].documento_tipo_movimiento,"serie",false,data[0].documento_motivo_venta_codigo);

            data[0].documento_automatico=="A" ? jq_automatico.prop('checked', true) : jq_automatico.prop('checked', false)
            data[0].documento_automatico=="M" ? jq_manual.prop('checked', true) : jq_manual.prop('checked', false)
            jq_mas_igv.prop('checked', (data[0].documento_mas_igv=="S" ? true : false));
            jq_tipo.val(data[0].documento_tipo);
            jq_tipo_documento.val(data[0].documento_tipo_movimiento);
            jq_serie.val(data[0].documento_motivo_venta_codigo);
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
            jq_contacto_cliente.val(data[0].cliente_contacto_codigo);
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
            jq_transportista.val(data[0].codigo_transportista);
            jq_vehiculo.val(data[0].codigo_vehiculo);
            jq_motivo_traslado.val(data[0].motivo_traslado);
            jq_numero_referencia.val(data[0].documento_numero_referencia);
            jq_numero_orden.val(data[0].documento_numero_orden);
            jq_fecha_referencia.val(data[0].fecha_referencia);
            jq_tipo_documento_referencia.val(data[0].documento_tipo_referencia);
            jq_serie_documento_referencia.val(data[0].Origen_Serie_referencia);
            jq_numero_documento_referencia.val(data[0].documento_numero_referencia);
            jq_chofer.val(data[0].codigo_chofer);
            jq_agencia_transporte.val(data[0].agencia_tansporte);
            jq_tipo_operacion.val(data[0].documento_tipo_operacion);
            jq_detraccion.val(data[0].documento_codigo_detraccion);
            jq_motivo_venta.val(data[0].documento_motivo_venta);
            jq_fecha_referencia.val(data[0].documento_fecha_referencia2);
            jq_detalle_anulacion.val(data[0].documento_detalle_anulacion);
            jq_numero_expediente1.val(data[0].numero_expediente1);
            jq_numero_expediente2.val(data[0].numero_expediente2);

            jq_base_calculada.val(formatCurrency(data[0].documento_subtotal_sin_descuentos,2));
            jq_subtotal.val(formatCurrency(data[0].documento_subtotal,2));
            jq_monto_descuento.val(formatCurrency(data[0].documento_descuento,2));
            jq_igv.val(formatCurrency(data[0].documento_igv,2));
            jq_icbper.val(formatCurrency(data[0].documento_igv_icbper,2));
            jq_anticipo.val(formatCurrency(data[0].documento_anticipo,2));
            jq_total.val(formatCurrency(data[0].documento_total,2));
            $("#subvoucher_contable").val(data[0].contabilidad_subvoucher);
            $("#numero_contable").val(data[0].contabilidad_numero);

            $("#base_calculada_mask").val(formatNumber.new(data[0].documento_subtotal_sin_descuentos,"",2));
            $("#monto_descuento_mask").val(formatNumber.new(data[0].documento_subtotal,"",2));
            $("#anticipos_mask").val(formatNumber.new(data[0].documento_anticipo,"",2));
            $("#subtotal_mask").val(formatNumber.new(data[0].documento_subtotal,"",2));
            $("#igv_mask").val(formatNumber.new(data[0].documento_igv,"",2));
            $("#icbper_mask").val(formatNumber.new(data[0].documento_igv_icbper,"",2));
            $("#total_mask").val(formatNumber.new(data[0].documento_total,"",2));

            pais_cliente = data[0].pais_cliente;
            documento_estado = data[0].documento_estado;
            Anticipos = data[0].documento_anticipo;

            if(data[0].documento_tipo == 'NOTA DE DEBITO'){
                jq_motivo_operacion_div.show();
                Llenar_Motivo(data[0].documento_tipo);
            }
            else if(data[0].documento_tipo == 'NOTA DE CREDITO DIRECTO' || data[0].documento_tipo == "NOTA DE CREDITO POR DEVOLUCION" || data[0].documento_tipo == "NOTA DE CREDITO POR DESCUENTO") {
                jq_motivo_operacion_div.show();
                Llenar_Motivo(data[0].documento_tipo);
            }
            else {
                jq_motivo_operacion_div.hide();
            };

            jq_motivo_operacion.val(data[0].documento_motivo_nota);
            jq_text_comentario.val(data[0].Comentario01);
            
            setFormatoImpresion(
                {
                    modulo : 'Ventas',
                    tipo_formato : 'talonarios',
                    punto_venta : row_lista_documento_selected.Codigo_Punto_Venta,
                    tipo_documento : row_lista_documento_selected.Codigo_Tipo_Documento,
                    motivo_serie : row_lista_documento_selected.Codigo_Motivo_Serie,
                    guardado_automatico: estado=="guardar" ? "S" : "N",
                    data_guardado_automatico: data[0]
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
    // ** Ventana 1 - 1 ** //
    jq_codigo_cliente.val(rowData.Codigo_Cliente);
    jq_ruc_cliente.val(rowData.Codigo_Cliente);

    rellenar_formas_pago(rowData.Codigo_Cliente,'12',rowData.Forma_Pago);
    rellenar_sublista_clientes(rowData.Codigo_Cliente, url_lista_precios_cliente,"lista_precios",rowData.Lista_Precios);
    rellenar_sublista_clientes(rowData.Codigo_Cliente, url_clientes_contactos,"contacto_cliente",rowData.Codigo_Contacto);
    rellenar_sublista_clientes(rowData.Codigo_Cliente, url_clientes_agencias,"agencia_cliente",rowData.Codigo_Agencia);
    jq_nombre_cliente.val(rowData.Nombre_Cliente);
    jq_direccion_cliente.val(rowData.Cliente_Direccion);
    jq_telefono_cliente.val(rowData.Telefono_Cliente);
    jq_email_cliente.val(rowData.Correo_Cliente);

    // ** Ventana 1 - 2 ** //

    jq_dias_forma_pago.val(rowData.Dias_Forma_Pago);
    // jq_fecha_validez.val(rowData.Codigo_Cliente);
    // jq_fecha_entrega.val(rowData.Fecha_Entrega);
    jq_vendedor1.val(rowData.Vendedor1);
    jq_mas_igv.prop('checked', (rowData.si_igv=="S" ? true : false));
    jq_moneda.val(rowData.Moneda);
    jq_porc_descuento.val(rowData.Porc_Descuento);
    jq_glosa.val(rowData.glosa);

    // ** Ventana 1 - 3 ** //
    jq_base_calculada.val(rowData.Sub_Total_Sin_Descuentos);
    jq_monto_descuento.val(rowData.Monto_Descuento);
    jq_subtotal.val(rowData.Sub_Total);
    jq_igv.val(rowData.Igv);
    jq_total.val(rowData.Total);

    $("#base_calculada_mask").val(formatNumber.new(rowData.Sub_Total_Sin_Descuentos,"",2));
    $("#monto_descuento_mask").val(formatNumber.new(rowData.Monto_Descuento,"",2));
    $("#subtotal_mask").val(formatNumber.new(rowData.Sub_Total,"",2));
    $("#igv_mask").val(formatNumber.new(rowData.Igv,"",2));
    $("#total_mask").val(formatNumber.new(rowData.Total,"",2));
    // ** Ventana 2 - 1 ** //
    jq_unidad_negocio.val(rowData.Codigo_Unidad_Negocio);
    jq_centro_costos.val(rowData.Cencos);
    jq_orden_trabajo.val(rowData.Ot);
    jq_presupuesto.val(rowData.Codigo_Presupuesto);
    // jq_punto_partida.val(rowData.);
    jq_punto_llegada_cliente.val(rowData.Punto_Llegada);

    // ** Ventana 2 - 2 ** //
    jq_vendedor3.val(rowData.Vendedor1);
    jq_vendedor2.val(rowData.Vendedor2);
    jq_numero_referencia.val(rowData.Numero);
    jq_numero_expediente1.val(rowData.Numero_Expediente1);
    jq_numero_expediente2.val(rowData.Numero_Expediente2);
    // jq_numero_orden.val();
    jq_gestor.val(rowData.Codigo_Gestor);
    jq_motivo_venta.val(rowData.Motivo_Trasl);
    jq_motivo_traslado.val(rowData.Motivo_Trasl);
    jq_transportista.val(rowData.Codigo_Transportista);
    jq_vehiculo.val(rowData.Codigo_Vehiculo);
    jq_chofer.val(rowData.Codigo_Chofer == ""? '00': rowData.Codigo_Chofer);
    jq_agencia_transporte.val(rowData.Codigo_Agencia ==""? '00' : rowData.Agencia_Transporte);
    jq_tipo_documento_referencia.val(rowData.Tipo_Documento);
    jq_serie_documento_referencia.val(rowData.Codigo_Motivo_Serie);
    jq_numero_documento_referencia.val(rowData.Numero);
    jq_fecha_referencia.val(getShortDate(convertToDate(rowData.Fecha,'d/m/y','/')));
    

    var url_comentarios = "/guia/comentarios";
    if (rowData.Tipo_Documento == "PED") {
        url_comentarios = "/pedido/comentarios";
    }

    $.ajax({
        type: 'POST',
        url: url_comentarios,
        data: {
            motivo_documento: rowData.Codigo_Motivo_Serie,
            numero_documento: rowData.Numero,
            codigo_punto_venta: rowData.Punto_Venta,
            tipo_documento : rowData.Tipo_Documento
        },success: function (data) {
            // console.log(data)
            jq_text_comentario.val(data[0].comentario1);
        }
    })
};

function Llenar_Motivo(tipo) {
    if (tipo == "NOTA DE DEBITO") {
        var array = ["Intereses por mora", "Aumento en el valor", "Penalidades otros conceptos"];
        var select = jq_motivo_operacion;
        select.html("");
        for (var i = 0; i < array.length; i++) {
            select.append(new Option(array[i], array[i]))
            
            // select.append('<option value="'+array[i]+'">'+array[i]+'</option>')
        }
    }
    else if(tipo == "NOTA DE CREDITO DIRECTO" || tipo == "NOTA DE CREDITO POR DEVOLUCION" || tipo == "NOTA DE CREDITO POR DESCUENTO"){
        var array = ["Anulación de la operación","Anulación por error en el RUC","Corrección por error en la descripción","Descuento global",
        "Descuento por ítem","Devolución total","Devolución por ítem","Bonificación","Disminución en el valor","Otros Conceptos" ];
        var select = jq_motivo_operacion;
        select.html("");
        for (var i = 0; i < array.length; i++) {
            select.append(new Option(array[i], array[i]))
            // select.append('<option value="'+array[i]+'">'+array[i]+'</option>')
        }
    } 
    else {
    }
}

function enviar_datos_anticipo (rowid){

    datos_anticipos=[];
    var total = 0;
    var fila_vacia_grid_detalle_productos={};

    var lista = jq_grid_lista_anticipos.jqGrid('getGridParam','selarrrow');
    
    for (let i = 0; i < lista.length; i++) {
        var data = jq_grid_lista_anticipos.jqGrid('getRowData', lista[i]);
        jq_moneda.val() == "S/" ? data.Importe = data.Importe_Soles : data.Importe = data.Importe_Dolares
        jq_moneda.val() == "S/" ? data.Sub_Total = data.Sub_Total_Soles : data.Sub_Total = data.Sub_Total_Dolares
        jq_moneda.val() == "S/" ? data.Igv = data.Igv_Soles : data.Igv = data.Igv_Dolares
        datos_anticipos.push(data);
        total += (jq_moneda.val() == "S/" ? data.Sub_Total_Soles : data.Sub_Total_Dolares) * 1;
    }
    jq_tipo_documento_referencia.val(datos_anticipos[0].Movimiento);
    jq_serie_documento_referencia.val(datos_anticipos[0].Serie);
    jq_numero_documento_referencia.val(datos_anticipos[0].Numero);
    jq_fecha_referencia.val(datos_anticipos[0].Fecha);
    Anticipos = total;
    
    var selected = jq_grid_detalle_ventas.jqGrid('getGridParam', 'selrow');

    datos_anticipos.forEach(function (element, index, array) {
        var new_fila=deepCopy(fila_vacia_grid_detalle_productos);

        new_fila.Barticulo = "N";
        new_fila.Comision_monto = "0";
        new_fila.Comision_porcentaje = "0";
        new_fila.Desc1 = "0";
        new_fila.Desc2 = "0";
        new_fila.Desc3 = "0";
        new_fila.Desc4 = "0";
        new_fila.Percepcion_uni = "0";
        new_fila.Perpecion_porc = "0";
        new_fila.Peso = "0";
        new_fila.NItem = "0";
        new_fila.Pedido_NItem = "0";
        new_fila.Guia_NItem = "0";
        new_fila.Origen_NItem = "0";
        
        new_fila.Almacen = "00";
        new_fila.Codigo_Almacen = "00";
        new_fila.Factor = "0";
        new_fila.Cantidad = "0";
        new_fila.Cantidad_Kardex = "0" ;
        new_fila.Cantidad_presentacion = "0";
        new_fila.Unidad = "00"
        new_fila.Unidad_presentacion = "00";
        new_fila.Codigo_Unidad = "00";
        new_fila.Codigo = "00";
        new_fila.Codigo_presentacion = "00";
        new_fila.Igv_Art = "0";
        new_fila.Nombre = "Anticipo:"+' '+element.Serie+'-'+element.Numero+' '+'Monto: '+element.Moneda+' '+(element.Moneda == "S/" ? data.Sub_Total : data.Sub_Total_Dolares) ;
        new_fila.Nombre_presentacion = "Anticipo:"+' '+element.Serie+'-'+element.Numero+' '+'Monto: '+element.Moneda+' '+(element.Moneda == "S/" ? data.Sub_Total : data.Sub_Total_Dolares) ;
        new_fila.Unit = "0";
        new_fila.Precio_original = "0";
        new_fila.Precio_presentacion = "0";
        new_fila.Stock_SN = "N";
        new_fila.Lote_SN = "N";
        new_fila.Lote_Numero = "";
        new_fila.Lote_Vencimiento = "";
        new_fila.Serie_SN = "N";
        new_fila.Serie_Numero = "";
        new_fila.ICBPER = "0";

        var MaxID = maxID(jq_grid_detalle_ventas.getDataIDs());
        jq_grid_detalle_ventas.jqGrid('addRowData',MaxID.length,new_fila,"after",selected );  

        recalcular_montos_ventas();
    });
}

 
function generarPDF(ruc_empresa,tipo,serie,numero){
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
        '<link href="http://demo.erp-facturacionelectronica.com/css/styles.css" rel="stylesheet"> \n';

        var hoja=$("#formato_impresion").html();
            var impresion=estilos+
            '<style> \n'+
            'body{\n'+
                'background: #fff;\n'+
                'min-height: 750px;\n'+
                'width: 750px;\n'+
                'color: black;\n'+
            '}\n'+
            '</style> \n'+
        '<div id="formato_impresion" class="mx-auto print-page">'+hoja+ '</div>';

        // $.ajax({
        //     type: 'POST',
        //     url: "http://pdf.erp-facturacionelectronica.com/descargar_pdf",
        //     crossDomain: true,
        //     data:{
        //         content: impresion,
        //         nameFile: ruc_empresa+"-"+tipo+"-"+serie+"-"+numero
        //     },
        //     success: function (result){
        //         console.log("Errores al crear PDF: " + result);
        //         // window.location.replace(result);
        //     }
        // });
        $.ajax({
            type: 'POST',
            url: "/ventas/exportar_html",
            crossDomain: true,
            data:{
                content: impresion,
                nameFile: ruc_empresa+"-"+tipo+"-"+serie+"-"+numero
            },
            success: function (result){
                console.log("Errores al crear PDF: " + result);
                // window.location.replace(result);
            }
        });
}