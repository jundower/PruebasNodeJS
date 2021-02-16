var fecha_trabajo=new Date();
var short_fecha_trabajo="";
var url_motivo_tramites="/talonarios/motivos_tramite_correlativo";
var url_responsables = "/usuario/responsables";
// var url_configuracion_permisos = '/requerimientos/configuracion_permisos'
var url_configuracion_permisos = '/configuraciones/configuracion_permisos/proceso_compra__sist_requerimiento__solicitud_compra';

var automatico = "automatico";
var alta = 'alta';
var media = 'media';
var baja = 'baja';
var manual = "manual";
var motivo = "motivo";
var moneda = "moneda";
var numero_correlativo = "numero_correlativo";
var responsable = "responsable";
var fecha_doc = "fecha_doc";
var fecha_limite = "fecha_limite";
var tipo_cambio = "tipo_cambio";
var tasa_cambio = "tasa_cambio";
var mas_igv = "mas_igv";
var porc_descuento = "porc_descuento";
var glosa = "glosa";
var numero_exp = "numero_exp";
var numero_exp_2 = "numero_exp_2";
var unidad_negocio ="unidad_negocio";
var orden_trabajo ="orden_trabajo";
var centro_costos ="centro_costos";
var tipo_documento_referencia ="tipo_documento_referencia";
var serie_documento_referencia ="serie_documento_referencia";
var numero_documento_referencia ="numero_documento_referencia";
var base_calculada ="base_calculada";
var monto_descuento ="monto_descuento";
var subtotal ="subtotal";
var igv ="igv";
var total ="total";
var modal_ventana_lista_compras = "modal_ventana_lista_compras";


var jq_automatico;
var jq_alta;
var jq_media;
var jq_baja;
var jq_manual;
var jq_motivo;
var jq_moneda;
var jq_numero_correlativo;
var jq_responsable;
var jq_fecha_doc;
var jq_fecha_limite;
var jq_tipo_cambio;
var jq_tasa_cambio;
var jq_mas_igv;
var jq_porc_descuento;
var jq_glosa;
var jq_numero_exp;
var jq_numero_exp_2;
var jq_unidad_negocio;
var jq_orden_trabajo;
var jq_centro_costos;
var jq_tipo_documento_referencia;
var jq_serie_documento_referencia;
var jq_numero_documento_referencia;
var jq_base_calculada;
var jq_monto_descuento;
var jq_subtotal;
var jq_igv;
var jq_total;
var jq_modal_ventana_lista_compras;

$(document).ready(function() {

    jq_automatico = $("#"+automatico);
    jq_alta = $("#"+alta);
    jq_media = $("#"+media);
    jq_baja = $("#"+baja);
    jq_manual = $("#"+manual);
    jq_motivo = $("#"+motivo);
    jq_moneda = $("#"+moneda);
    jq_numero_correlativo = $("#"+numero_correlativo);
    jq_responsable = $("#"+responsable);
    jq_fecha_doc = $("#"+fecha_doc);
    jq_fecha_limite = $("#"+fecha_limite);
    jq_tipo_cambio = $("#"+tipo_cambio);
    jq_tasa_cambio = $("#"+tasa_cambio);
    jq_mas_igv = $("#"+mas_igv);
    jq_porc_descuento = $("#"+porc_descuento);
    jq_glosa = $("#"+glosa);
    jq_numero_exp = $("#"+numero_exp);
    jq_numero_exp_2 = $("#"+numero_exp_2);
    jq_unidad_negocio = $("#"+unidad_negocio);
    jq_orden_trabajo = $("#"+orden_trabajo);
    jq_centro_costos = $("#"+centro_costos);
    jq_tipo_documento_referencia = $("#"+tipo_documento_referencia);
    jq_serie_documento_referencia = $("#"+serie_documento_referencia);
    jq_numero_documento_referencia = $("#"+numero_documento_referencia);
    jq_base_calculada = $("#"+base_calculada);
    jq_monto_descuento = $("#"+monto_descuento);
    jq_subtotal = $("#"+subtotal);
    jq_igv = $("#"+igv);
    jq_total = $("#"+total);
    jq_modal_ventana_lista_compras = $("#"+modal_ventana_lista_compras);
    jq_dias_forma_pago=$("#dias_forma_pago");
    
    jq_automatico.click(function() {
       cargar_correlativo();
    });
    jq_manual.click(function() {
        cargar_correlativo();
    });
    jq_motivo.change(function() {
        cargar_correlativo();
    });
    jq_dias_forma_pago.change(function() {
        var ndias = jq_dias_forma_pago.val();
        var fecha = new Date(jq_fecha_doc.val());
        jq_fecha_limite.val(sumar_dias(fecha,ndias));
    });
    jq_dias_forma_pago.keyup(function() {
        var ndias = jq_dias_forma_pago.val();
        var fecha = new Date(jq_fecha_doc.val());
        jq_fecha_limite.val(sumar_dias(fecha,ndias));
    });
    
    
    $("#nuevo").show();
    $("#guardar").show();
    $("#listar").show();
    $("#imprimir").show();
    setTitle("Requerimientos");
    setTitleLista("Listado de Requerimientos");
    setListaDocumentos('/requerimientos/lista', '/requerimientos/consultar', '/requerimientos/detalle','Motivo', 'listado_documentos_compras');
    setCabeceraVentas("/talonarios/motivos_tramite");
    setDetalleVentas("detalle_compra");
    nuevo();
    tipo_validacion='requerimientos';
    

});
function nuevo(){ 
    estado="guardar";

    short_fecha_trabajo =  getShortDate(fecha_trabajo);
    jq_automatico.prop('checked', true);
    jq_manual.prop('checked', false);

    jq_alta.prop('checked', false);
    jq_media.prop('checked', true);
    jq_baja.prop('checked', false);

    rellenar_motivos_tramite_series("REQ",motivo,true);
    rellenar_codigo_nombre(url_unidad_negocio,"unidad_negocio","user-Unidad_negocio");
    rellenar_codigo_nombre(url_centro_costos,"centro_costos","user-codigo_centro_costos");
    rellenar_codigo_nombre(url_orden_trabajo,"orden_trabajo","user-codigo_ninguno");
    rellenar_codigo_nombre(url_tipo_documento,"tipo_documento_referencia","user-codigo_ninguno");
    rellenar_moneda(moneda);
    rellenar_tipo_cambio(tipo_cambio, tasa_cambio,fecha_doc);


    jq_fecha_doc.val(short_fecha_trabajo);
    jq_fecha_limite.val(short_fecha_trabajo);

    cargar_configuraciones();
    cargar_responsable();
    limpiar();
    permisos();
}

function limpiar(){
    jq_porc_descuento.val("0");
    jq_glosa.val("");
    jq_numero_exp.val("");
    jq_numero_exp_2.val("");
    jq_base_calculada.val("0.00");
    jq_monto_descuento.val("0.00");
    jq_subtotal.val("0.00");
    jq_igv.val("0.00");
    jq_total.val("0.00");

    $("#base_calculada_mask").val(formatNumber.new(0,"",2))
    $("#monto_descuento_mask").val(formatNumber.new(0,"",2))
    $("#subtotal_mask").val(formatNumber.new(0,"",2))
    $("#igv_mask").val(formatNumber.new(0,"",2))
    $("#total_mask").val(formatNumber.new(0,"",2))

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

    jQuery("#grid_comentario_normal").jqGrid("setGridParam",{
        url: "/requerimientos/comentarios",
        mtype: "POST",
        datatype: "json",
        postData:{
            numero_documento : "00",
            motivo_documento : "00",
            codigo_punto_venta : "00"
        }
    }).trigger("reloadGrid");

    jq_comentario_normal.prop("checked", false);
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
                tipo_documento:'REQ'
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
            url_guardar = "/requerimientos/guardar";
            mensaje = "Guardado satisfactoriamente."
            impresion=true;
            break;
        case  'modificar':
            url_guardar = "/requerimientos/modificar";
            mensaje = "Modificado satisfactoriamente."
            break;
        case 'eliminar':
            url_guardar = "/requerimientos/eliminar";
            mensaje = "Eliminado satisfactoriamente."
            break;
        case 'anular':
            url_guardar = "/requerimientos/anular";
            mensaje = "Anulado satisfactoriamente."
            break;
    }
    var filas_comentarios = [];
    var mas_igv = (jq_mas_igv.prop('checked' ) ? "S" : "N");
    var automatico = (jq_automatico.prop('checked') == true ? "A" : "M");
    var prioridad = $('input:radio[name=prioridad]:checked').val();
    var today= fecha_trabajo;
    var yyyy = today.getFullYear();


    var filas_detalle= generar_array_detalle();
    
    if (jq_comentario_normal.prop("checked") == true) {
        var filas = $("#grid_comentario_normal").jqGrid('getDataIDs');

        filas.forEach(rowid => {
            var fila_datos = $("#grid_comentario_normal").getRowData(rowid)
            if (fila_datos.Descripcion != "") {
                filas_comentarios.push(fila_datos);
            }
        })
    }

    $.ajax({
         url: url_guardar,
         type: 'post',
         data:{
             anio: yyyy,
             automatico: automatico,
             motivo_documento: jq_motivo.val(),
             numero_correlativo: jq_numero_correlativo.val(),
             fecha_doc: jq_fecha_doc.val(),
             fecha_limite: jq_fecha_limite.val(),
             prioridad: prioridad,
             estado: 'Ingresado',
             comentario: '',
             centro_costos: jq_centro_costos.val(),
             situacion_apro: 'Sin Aprobacion',
             responsable: jq_responsable.val(),
             fecha_aceptacion: '01/01/1900',
             observacion: '',
             orden_trabajo: jq_orden_trabajo.val(),
             unidad_negocio: jq_unidad_negocio.val(),
             aprobado1: 'Sin Aprobacion',
             usuario_aprobado1: '00',
             fecha_aprobacion2: '01/01/1900',
             observacion2: '',
             atencion: 'Pendiente',
             porcentaje: "0",
             moneda: jq_moneda.val(),
             tipo_cambio: jq_tipo_cambio.val(),
             tasa_cambio: jq_tasa_cambio.val(),
             glosa: jq_glosa.val(),
             codigo_agencia: '00',
             motivo_referencia: jq_tipo_documento_referencia.val(),
             tipo_referencia: jq_serie_documento_referencia.val(),
             numero_referencia: jq_numero_documento_referencia.val(),
             Pc_User: "",
             Pc_Fecha: "01/01/1900",
             Pc_Ip: "",
             numero_exp: jq_numero_exp.val(),
             numero_exp_2: jq_numero_exp_2.val(),
             mas_igv: mas_igv,
             subtotal_sin_descuentos: jq_base_calculada.val(),
             erp_Ddescuento: jq_monto_descuento.val(),
             erp_Dsubtotal: jq_subtotal.val(),
             erp_Digv: jq_igv.val(),
             erp_Dimporte: jq_total.val(),
             erp_Dpercepcion: '0',
             erp_Dtotal: jq_total.val(),
             nro_dias: jq_dias_forma_pago.val(),
             estado_salida: 'Pendiente',
             porcentaje_salida: '0%',
             filas_detalle: JSON.stringify(filas_detalle),
             filas_comentarios: JSON.stringify(filas_comentarios)
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
};

function cargar_responsable(){
    
    var jq_elemento = jq_responsable;
    $.ajax({
        type: 'POST',
        url: url_responsables,
        data:{
            tipo: ''
        },
        success: function (lists){
            jq_elemento.html('');
            lists.forEach(list=>{
                jq_elemento.append('<option value="'+list.Codigo+'" >'+list.Nombre + '</option>');
            });
       }
   });
}

function consultar(impresion) {
    documentoSeleccionado = rowId_seleccionado;
    row_lista_documento_selected = jq_grid_documentos.jqGrid("getRowData", documentoSeleccionado);
    var data ={
        motivo_documento : row_lista_documento_selected.Codigo_Motivo_Serie,
        numero_documento : row_lista_documento_selected.Numero,
        codigo_punto_venta : row_lista_documento_selected.Codigo_Punto_Venta
    }
    if(impresion){
        data ={
            motivo_documento : jq_motivo.val(),
            numero_documento : jq_numero_correlativo.val(),
            codigo_punto_venta : ""
        }
    }
    $.ajax({
        type: "POST",
        url: url_consultar,
        data: data,
        success: function (data) {

            data[0].documento_automatico=="A" ? jq_automatico.prop('checked', true) : jq_automatico.prop('checked', false)
            data[0].documento_automatico=="M" ? jq_manual.prop('checked', true) : jq_manual.prop('checked', false)
            //data[0].documento_prioridad== "A" ? jq_alta.prop('ckecked', true) : jq_alta.prop('checked', false)
            var prioridad=data[0].documento_prioridad;
            switch (prioridad){
                case 'A':
                    jq_alta.prop('checked',true);
                    break;
                    
                case 'M':
                    jq_media.prop('checked',true);
                    break;
                    
                case 'B':
                    jq_baja.prop('checked',true);
                    break;
            }
            
            jq_mas_igv.prop('checked', (data[0].documento_mas_igv=="S" ? true : false));
            jq_motivo.val(data[0].documento_motivo_compra_codigo);
            jq_numero_correlativo.val(data[0].documento_numero);
            jq_responsable.val(data[0].documento_responsable);
            jq_fecha_doc.val(data[0].documento_fecha_format23);
            jq_fecha_limite.val(data[0].documento_fecha_limite_format23);
            jq_moneda.val(data[0].documento_moneda);
            jq_tipo_cambio.val(data[0].nombre_tipo_cambio);
            jq_tasa_cambio.val(data[0].tipo_cambio);
            jq_porc_descuento.val(data[0].documento_descuento_porc);
            jq_glosa.val(data[0].documento_glosa);
            jq_numero_exp.val(data[0].documento_numero_expediente);
            jq_numero_exp_2.val(data[0].documento_numero_expediente_2);
            jq_unidad_negocio.val(data[0].documento_unidad_negocio_codigo);
            jq_orden_trabajo.val(data[0].documento_ot_codigo);
            jq_centro_costos.val(data[0].documento_cencos_codigo);
            jq_tipo_documento_referencia.val(data[0].documento_referencia_tipo);
            jq_serie_documento_referencia.val(data[0].documento_referencia_serie);
            jq_numero_documento_referencia.val(data[0].documento_referencia_numero);

            jq_base_calculada.val(formatCurrency(data[0].documento_subtotal_sin_descuentos,2));
            jq_monto_descuento.val(formatCurrency(data[0].documento_descuento,2));
            jq_subtotal.val(formatCurrency(data[0].documento_subtotal,2));
            jq_igv.val(formatCurrency(data[0].documento_igv,2));
            jq_total.val(formatCurrency(data[0].documento_importe,2));

            $("#base_calculada_mask").val(formatNumber.new(data[0].documento_subtotal_sin_descuentos,"",2))
            $("#monto_descuento_mask").val(formatNumber.new(data[0].documento_descuento,"",2))
            $("#subtotal_mask").val(formatNumber.new(data[0].documento_subtotal,"",2))
            $("#igv_mask").val(formatNumber.new(data[0].documento_igv,"",2))
            $("#total_mask").val(formatNumber.new(data[0].documento_total,"",2))
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
        }
    });

    jq_grid_detalle_ventas.jqGrid("setGridParam",{
        url: url_getListaDetalle,
        mtype: "POST",
        datatype: "json",
        postData:data
    }).trigger("reloadGrid");

    jQuery("#grid_comentario_normal").jqGrid("setGridParam",{
        url: "/requerimientos/comentarios",
        mtype: "POST",
        datatype: "json",
        postData:data
    }).trigger("reloadGrid");

    jq_modal_ventana_lista.modal('hide');
}

// function listar(){
//     jq_modal_ventana_lista_compras.modal('show');
//     //Actualizar_lista() ; 
// }