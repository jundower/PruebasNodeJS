var fecha_trabajo=new Date();
var short_fecha_trabajo="";
var url_motivo_tramites="/talonarios/motivos_tramite_correlativo";
var url_guardar = "/pedido/guardar";


$(document).ready(function() {
   
    $("#guardar").show();
    $("#imprimir").show();

    var title = $("#modulo").text() == 'compra'? 'Lista Precios Compra': 'Lista Precios Venta'

    setTitle(title);

    cargar_configuraciones();
});

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
            url_guardar = "/pedido/guardar";
            mensaje = "Guardado satisfactoriamente."
            impresion=true;
            break;
        case  'modificar':
            url_guardar = "/pedido/modificar";
            mensaje = "Modificado satisfactoriamente."
            break;
        case 'eliminar':
            url_guardar = "/pedido/eliminar";
            mensaje = "Eliminado satisfactoriamente."
            break;
        case 'anular':
            url_guardar = "/pedido/anular";
            mensaje = "Anulado satisfactoriamente."
            break;
    }
    var rows = jq_grid_detalle_ventas.jqGrid('getDataIDs');
    var mas_igv = (jq_mas_igv.prop('checked' ) ? "S" : "N");
    
    // jq_mas_igv.prop('checked', (rowData.si_igv=="S" ? true : false));
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
            observacion: "",
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
            numero_expediente1: jq_numero_expediente1.val(),
            numero_expediente2: jq_numero_expediente2.val(),
            filas_detalle: JSON.stringify( filas_detalle)
        },
        success: function(result){
            if(result.estado == true){
                jq_numero_correlativo.val(result.codigo);
                
                $("#guardar").prop("disabled", true);
                $("#buscar_pendientes").prop( "disabled", true );

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
};

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
};


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
            jq_numero_expediente1.val(data[0].numero_expediente1);
            jq_numero_expediente2.val(data[0].numero_expediente2);

            jq_base_calculada.val(formatCurrency(data[0].documento_subtotal_sin_descuentos,2));
            jq_monto_descuento.val(formatCurrency(data[0].documento_descuento,2));
            jq_subtotal.val(formatCurrency(data[0].documento_subtotal,2));
            jq_igv.val(formatCurrency(data[0].documento_igv,2));
            jq_total.val(formatCurrency(data[0].documento_total,2));
            pais_cliente = data[0].pais_cliente;
            documento_estado = data[0].documento_estado;

            // rellenarFormato(data);
            // if(impresion)
            //     imprimir();
            
            setFormatoImpresion(
                {
                    modulo : 'Ventas',
                    tipo_formato : 'tramites',
                    punto_venta : row_lista_documento_selected.Codigo_Punto_Venta,
                    tipo_documento : 'PED',
                    motivo_serie : row_lista_documento_selected.Codigo_Motivo_Serie,
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

