var fecha_trabajo=new Date();
var short_fecha_trabajo="";
var url_motivos_serie_correlativo="/talonarios/motivos_serie_correlativo";
var url_guardar = "/transaccion_almacen/guardar";
var url_responsables = "/usuario/responsables";
var url_almacen_destino = '/almacen/lista';
var url_transaccion = "/definicion_transacciones/tipo_transaccion";
var url_configuracion_permisos = '/configuraciones/configuracion_permisos/proceso_almacen__sist_almacen__transaccion_almacen';


var tipo_movimiento = "tipo_movimiento";
var tipo = "tipo";
var pto_venta = 'pto_venta';
var codigo_proveedor = "codigo_proveedor";
var nombre_proveedor = "nombre_proveedor";
var direccion_proveedor = "direccion_proveedor";
var codigo_cliente = "codigo_cliente";
var nombre_cliente = "nombre_cliente";
var direccion_cliente = "direccion_cliente";
var serie = "serie";
var automatico = "automatico";
var manual = "manual";
var numero_correlativo = "numero_correlativo";
var almacen = "almacen";
var fecha_doc = "fecha_doc";
var responsable = "responsable";
var cargo = "cargo";
var moneda = "moneda";
var tipo_cambio = "tipo_cambio";
var tasa_cambio = "tasa_cambio";
var glosa = "glosa";
var base_calculada = "base_calculada";
var monto_descuento = "monto_descuento";
var subtotal = "subtotal";
var igv = "igv";
var total = "total";
var unidad_negocio = "unidad_negocio";
var centro_costos = "centro_costos";
var orden_trabajo = "orden_trabajo";
var punto_partida = "punto_partida";
var punto_llegada_cliente = "punto_llegada_cliente";
var pto_venta_destino = "pto_venta_destino";
var almacen_destino = "almacen_destino";
var serie_destino = "serie_destino";
var automatico_destino = "automatico_destino";
var manual_destino = "manual_destino";
var numero_correlativo_destino = "numero_correlativo_destino";
var numero_expediente = "numero_expediente";
var tipo_referencia = "tipo_referencia";
var serie_referencia = "serie_referencia";
var numero_referencia = "numero_referencia";
var tipo_referencia_2 = "tipo_referencia_2";
var serie_referencia_2 = "serie_referencia_2";
var numero_referencia_2 = "numero_referencia_2";
var motivo_traslado = "motivo_traslado";
var transportista = "transportista";
var vehiculo  = "vehiculo";
var chofer = "chofer";
var fecha_transporte = "fecha_transporte";
var agencia_transporte = "agencia_transporte";

var modal_ventana_lista = "modal_ventana_lista";

var jq_tipo_movimiento;
var jq_tipo;
var jq_pto_venta;
var jq_codigo_proveedor;
var jq_nombre_proveedor;
var jq_direccion_proveedor;
var jq_codigo_cliente;
var jq_nombre_cliente;
var jq_direccion_cliente;
var jq_serie;
var jq_automatico;
var jq_manual;
var jq_numero_correlativo;
var jq_almacen;
var jq_fecha_doc;
var jq_responsable ;
var jq_cargo;
var jq_moneda;
var jq_tipo_cambio;
var jq_tasa_cambio;
var jq_glosa;
var jq_base_calculada;
var jq_monto_descuento;
var jq_subtotal;
var jq_igv;
var jq_total;
var jq_unidad_negocio;
var jq_centro_costos ;
var jq_orden_trabajo ;
var jq_punto_partida;
var jq_punto_llegada_cliente;
var jq_pto_venta_destino;
var jq_almacen_destino;
var jq_serie_destino;
var jq_automatico_destino;
var jq_manual_destino;
var jq_numero_correlativo_destino;
var jq_numero_expediente ;
var jq_tipo_referencia ;
var jq_serie_referencia ;
var jq_numero_referencia ;
var jq_tipo_referencia_2;
var jq_serie_referencia_2 ;
var jq_numero_referencia_2 ;
var jq_motivo_traslado ;
var jq_transportista;
var jq_vehiculo;
var jq_chofer;
var jq_fecha_transporte;
var jq_agencia_transporte ;

var jq_modal_ventana_lista;

$(document).ready(function() {
   
    jq_tipo_movimiento  = $("#"+tipo_movimiento);
    jq_tipo = $("#"+tipo);
    jq_pto_venta = $("#"+pto_venta) ;
    jq_codigo_proveedor = $("#"+codigo_proveedor) ;
    jq_nombre_proveedor = $("#"+nombre_proveedor) ;
    jq_direccion_proveedor = $("#"+direccion_proveedor) ;
    jq_codigo_cliente = $("#"+codigo_cliente) ;
    jq_nombre_cliente = $("#"+nombre_cliente) ;
    jq_direccion_cliente = $("#"+direccion_cliente) ;
    jq_serie = $("#"+serie) ;
    jq_automatico = $("#"+automatico) ;
    jq_manual = $("#"+manual) ;
    jq_numero_correlativo = $("#"+numero_correlativo) ;
    jq_almacen = $("#"+almacen);
    jq_fecha_doc = $("#"+ fecha_doc) ;
    jq_responsable = $("#"+responsable) ;
    jq_cargo = $("#"+cargo);
    jq_moneda = $("#"+moneda) ;
    jq_tipo_cambio = $("#"+tipo_cambio) ;
    jq_tasa_cambio = $("#"+tasa_cambio) ;
    jq_glosa = $("#"+glosa) ;
    jq_base_calculada = $("#"+base_calculada) ;
    jq_monto_descuento = $("#"+monto_descuento) ;
    jq_subtotal = $("#"+subtotal) ;
    jq_igv =$("#"+igv) ;
    jq_total = $("#"+total) ;
    jq_unidad_negocio  = $("#"+unidad_negocio); 
    jq_centro_costos = $("#"+centro_costos) ;
    jq_orden_trabajo = $("#"+orden_trabajo) ;
    jq_punto_partida = $("#"+punto_partida);
    jq_punto_llegada_cliente = $("#"+punto_llegada_cliente);
    jq_pto_venta_destino = $("#"+pto_venta_destino);
    jq_almacen_destino = $("#"+almacen_destino);
    jq_serie_destino = $("#"+serie_destino); 
    jq_automatico_destino = $("#"+automatico_destino) ;
    jq_manual_destino = $("#"+manual_destino) ;
    jq_numero_correlativo_destino = $("#"+numero_correlativo_destino) ;
    jq_numero_expediente  = $("#"+numero_expediente);
    jq_tipo_referencia  = $("#"+tipo_referencia);
    jq_serie_referencia  = $("#"+serie_referencia);
    jq_numero_referencia  = $("#"+numero_referencia);
    jq_tipo_referencia_2 = $("#"+tipo_referencia_2);
    jq_serie_referencia_2  = $("#"+serie_referencia_2);
    jq_numero_referencia_2  = $("#"+ numero_referencia_2);
    jq_motivo_traslado  = $("#"+motivo_traslado);
    jq_transportista = $("#"+transportista);
    jq_vehiculo = $("#"+vehiculo);
    jq_chofer = $("#"+chofer);
    jq_fecha_transporte = $("#"+fecha_transporte);
    jq_agencia_transporte = $("#"+agencia_transporte) ;

    jq_modal_ventana_lista = $("#"+modal_ventana_lista);

    $(".comentario_normal_02").removeClass("d-none");
    $(".comentario_normal").addClass("d-none");
    
    jq_automatico.click(function() {  
        cargar_correlativo(serie);
    });
    jq_manual.click(function() {  
        cargar_correlativo(serie);
    });
    jq_automatico_destino.click(function() {  
        cargar_correlativo(serie_destino);
    });
    jq_manual_destino.click(function() {  
        cargar_correlativo(serie_destino);
    });
    jq_serie.change(function() {  
        cargar_correlativo(serie);
        //console.log(jq_tipo.val());
        
    });
    jq_serie_destino.change(function() {  
        cargar_correlativo(serie_destino);
    });
    jq_tipo_movimiento.change(function() {  
        rellenar_tipo_transaccion_almacen("/definicion_transacciones/tipo_transaccion",jq_tipo_movimiento.val(),tipo);
        //setFormatoImpresion({motivo_serie: jq_tipo.val(), tipo_documento: $(this).val()});
        var valor = jq_tipo_movimiento.val();
        switch (valor) {
            case "E":
                rellenar_motivos_tramite_series("NE",serie,true,'',true);
                break;
            case "S":
                rellenar_motivos_tramite_series("NS",serie,true,'',true);
                break;
            case "T":
                rellenar_motivos_tramite_series("NT",serie,true,'',true);
                break;
            case "A":
                rellenar_motivos_tramite_series("NA",serie,true,'',true);
                break;
            default:
                rellenar_motivos_tramite_series("NE",serie,true,'',true);
                break;
        }
        valor == "T" ? $("#div_transferecia").show():$("#div_transferecia").hide();
    });
    jq_responsable.change(function(){
        $.ajax({
            type: 'POST',
            url: '/usuario/cargo',
            data: {
                codigo_responsable: jq_responsable.val()
            },
            success: function(data) {
                jq_cargo.val(data[0].Cargo)
            }
        })
    });
    jq_pto_venta_destino.change(function () {
        cargar_almacen_destino();
        // cargar_correlativo(serie_destino);
    })
    jq_tipo.change(function() {
        cliente_proveedor();
        /*var val=$(this).val();
        switch (val) {
            case "GUIA DE ORDEN DE COMPRA":
                $("#buscar_pendientes").prop( "disabled", false );
                setVentasPendientes('Orden de Compra Pendientes','/orden_compra/lista_documentos_pendientes','/orden_compra/lista_detalle_pendientes');
                break;
            default:
                $("#buscar_pendientes").prop( "disabled", true );
                break;
        }*/
    });

    $("#nuevo").show();
    $("#guardar").show();
    $("#listar").show();
    $("#imprimir").show();
    setTitle("Transacciones de Almacen");
    setTitleLista("Listado de Transaccion de Almacen");
    setListaDocumentos('/transaccion_almacen/lista', '/transaccion_almacen/consultar', '/transaccion_almacen/detalle','serie','listado_documentos_compras');
    setCabeceraVentas("/talonarios/motivos_series");
    setDetalleVentas("detalle_compra");
    nuevo();
});

async function nuevo(){
    
    estado="guardar";
    short_fecha_trabajo =  getShortDate(fecha_trabajo);
    jq_automatico.prop('checked', true);
    jq_manual.prop('checked', false);
    jq_automatico_destino.prop('checked', true);
    jq_manual_destino.prop('checked', false);
    jq_direccion_proveedor.prop( "disabled", true );
    
    await rellenar_tipo_transaccion_almacen(url_transaccion,jq_tipo_movimiento.val(),tipo);
    rellenar_motivos_tramite_series("NE",serie,true,'',true);
    //rellenar_motivos_tramite_series("NE",serie_destino,true,'',true);
    //rellenar_motivos_tramite_series("PRE","motivo_referencia_presupuesto",false);
    rellenar_codigo_nombre(url_unidad_negocio,"unidad_negocio","user-Unidad_negocio");
    rellenar_codigo_nombre(url_centro_costos,"centro_costos","user-codigo_centro_costos");
    rellenar_codigo_nombre(url_orden_trabajo,"orden_trabajo","user-codigo_ninguno");
    rellenar_codigo_nombre(url_motivo_traslado,"motivo_traslado","user-codigo_ninguno");
    rellenar_codigo_nombre(url_tipo_documento,"tipo_referencia","user-codigo_ninguno");
    rellenar_codigo_nombre(url_tipo_documento,"tipo_referencia_2","user-codigo_ninguno");
    rellenar_codigo_nombre(url_transportista,"transportista","user-codigo_ninguno");
    rellenar_codigo_nombre(url_vehiculo,"vehiculo","user-codigo_ninguno");
    rellenar_codigo_nombre(url_chofer,"chofer","user-codigo_ninguno");
    rellenar_codigo_nombre(url_agencia_transporte,"agencia_transporte","user-codigo_ninguno");
    rellenar_codigo_nombre(url_almacen,"almacen");
    rellenar_codigo_nombre(url_punto_venta_lista,"pto_venta_destino","user-codigo_ninguno");
    rellenar_moneda(moneda);
    rellenar_tipo_cambio(tipo_cambio, tasa_cambio,fecha_doc); //Mantener este orden de tasa/tipo, porque si no, no funciona dinamicamente y siempre agarrará VTA
    rellenar_punto_partida("punto_partida");

    cargar_responsable();
    cargar_almacen_destino();
    jq_fecha_doc.val(short_fecha_trabajo);
    jq_fecha_transporte.val(short_fecha_trabajo);
    //setVentasPendientes('Requerimientos Pendientes','/requerimientos/lista_documentos_pendientes','/requerimientos/lista_detalle_pendientes');
    cargar_configuraciones();
    limpiar();
    permisos();
}

function limpiar(){
    jq_codigo_proveedor.val("");
    jq_nombre_proveedor.val("");
    jq_direccion_proveedor.val("");
    jq_codigo_cliente.val("");
    jq_nombre_cliente.val("");
    jq_direccion_cliente.val("");
    jq_glosa.val("");
    jq_punto_llegada_cliente.val("");
    jq_numero_expediente.val("");
    jq_serie_referencia.val("");
    jq_serie_referencia_2.val("");
    jq_numero_referencia.val("");
    jq_numero_referencia_2.val("");
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
    jq_tipo.trigger("change");

    jq_text_comentario.val("");
    jq_comentario_normal_02.prop("checked", false);
    jq_comentario_detallado.prop("checked", false);
}

function cargar_correlativo(elemento, predeterminado){
    var tipo_documento = jq_tipo_movimiento.val();
    if(elemento==serie){

        if(jq_automatico.is(':checked')) {

            jq_numero_correlativo.prop( "disabled", true );  
            $.ajax({
                type: 'POST',
                url: url_motivos_serie_correlativo,
                data:{
                    serie_documento: jq_serie.val(),
                    tipo_documento: tipo_documento=="E" ? "NE" : tipo_documento=="S" ? "NS" : tipo_documento=="T" ? "NT" : "NA"
                },
                success: function (lists){

                    if(!isEmptyOrWhiteSpaces(predeterminado)){
                        jq_numero_correlativo.val(predeterminado);
                    }else if(predeterminado === undefined){
                        jq_numero_correlativo.val(lists);
                    }
                }
            });
        }else{
            jq_numero_correlativo.prop( "disabled", false );
            jq_numero_correlativo.val("");
        }
    }else if(elemento==serie_destino){
        if(jq_automatico_destino.is(':checked')) {
            jq_numero_correlativo_destino.prop( "disabled", true );  
            $.ajax({
                type: 'POST',
                url: url_motivos_serie_correlativo,
                data:{
                    serie_documento: jq_serie_destino.val(),
                    tipo_documento: 'NE',
                    codigo_punto_venta: jq_pto_venta_destino.val()
                },
                success: function (lists){
                    jq_numero_correlativo_destino.val(lists);
                }
            });
        }else{
            jq_numero_correlativo_destino.prop( "disabled", false );
            jq_numero_correlativo_destino.val("");
        }
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
            jq_cargo.val(lists[0].Cargo);
       }
   });
}

function guardar(){
    url_guardar="";
    var mensaje="";
    var impresion=false;
    switch (estado) {
        case 'guardar':
            url_guardar = "/transaccion_almacen/guardar";
            mensaje = "Guardado satisfactoriamente."
            impresion=true;
            break;
        case  'modificar':
            url_guardar = "/transaccion_almacen/modificar";
            mensaje = "Modificado satisfactoriamente."
            break;
        case 'eliminar':
            url_guardar = "/transaccion_almacen/eliminar";
            mensaje = "Eliminado satisfactoriamente."
            break;
        case 'anular':
            url_guardar = "/transaccion_almacen/anular";
            mensaje = "Anulado satisfactoriamente."
            break;
    }
    var automatico = (jq_automatico.prop('checked') == true ? "A" : "M");
    var codigo_movimiento = jq_tipo_movimiento.val()=="E" ? "NE" : jq_tipo_movimiento.val()=="S" ? "NS" : jq_tipo_movimiento.val()=="T" ? "NT" : "NA"
    var codigo_cliente = jq_codigo_cliente.val()=='' ? '00' : jq_codigo_cliente.val();
    var codigo_proveedor = jq_codigo_proveedor.val()=='' ? '00' : jq_codigo_proveedor.val();
    var automatico_destino = (jq_automatico_destino.prop('checked') == true ? "A" : "M");

    var filas_detalle= generar_array_detalle();

    var data = {
        serie: jq_serie.val(),
        numero_correlativo: jq_numero_correlativo.val(),
        codigo_movimiento: codigo_movimiento,
        tipo_movimiento: jq_tipo_movimiento.val(),
        automatico: automatico,
        automatico_destino: automatico_destino,
        fecha_doc: jq_fecha_doc.val(),
        fecha_entr: jq_fecha_doc.val(),
        fecha_validez: "01/01/1900",
        moneda: jq_moneda.val(),
        importe: jq_total.val(),
        forma_pago: '00',
        codigo_cliente: codigo_cliente,
        nombre_cliente: jq_nombre_cliente.val(),
        ruc_cliente: codigo_cliente,
        estado: "Ingresado",
        observacion: jq_text_comentario.val(),
        mas_igv: 'N',
        tipo_cambio: jq_tipo_cambio.val(),
        tasa_cambio: jq_tasa_cambio.val(),
        codigo_persona: "00",
        lista_precios: '',
        aprobado: "Sin Aprobacion",
        fecha_aprobacion: "01/01/1900",
        codigo_empleado_aprobacion: "00",
        observacion_aprobacion: "",
        codigo_centro_costos: jq_centro_costos.val(),
        descuento: '0',
        orden_trabajo: jq_orden_trabajo.val(),
        pto_partida: jq_punto_partida.val(),
        pto_llegada: jq_punto_llegada_cliente.val(),
        dias: '0',
        pais: '',
        atencion: "Pendiente",
        porcentaje: "",
        codigo_unidad_negocio: jq_unidad_negocio.val(),
        codigo_contacto: '',
        nom_contacto: '',
        vendedor_1: '00',
        idvendedor2: '00',
        responsable: jq_responsable.val(),
        Glosa : jq_glosa.val(),
        codigo_agencia: '',
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
        tipo_venta: 'NINGUNO',
        motivo_ref: '',
        numero_referencia: jq_numero_referencia.val(),
        codigo_transportista: jq_transportista.val(),
        codigo_vehiculo: jq_vehiculo.val(),
        motivo_traslado: jq_motivo_traslado.val(),
        numero_orden: '00',
        atencion_prod: 'Pendiente',
        porcentaje_prod: '0%',
        erp_tipdoc: '0',
        flag_ruta_contacto: 'N',
        ruta_contacto: 'NULL',
        erp_dscto_stock: 'S',
        erp_contacto_vendedor: '00',
        tipo_comprobante: '',
        serie_comprobante: '',
        numero_comprobante: '',
        fecha_comprobante: '01/01/1900',
        tipo_documento_referencia: jq_tipo_referencia.val(),
        serie_documento_referencia: jq_serie_referencia.val(),
        numero_documento_referencia: jq_numero_referencia.val(),
        fecha_referencia: '01/01/1900',
        anticipo: '0.00',
        impmn: '0',
        impme: '0',
        costo: '0',
        codigo_almacen_d: jq_almacen.val(),
        nombre_cliente_2: '',
        codigo_proveedor: codigo_proveedor,
        nombre_proveedor_c: jq_nombre_proveedor.val(),
        modulo: 'INVENTARIO',
        ccod_almacen2: jq_pto_venta_destino.val(),
        ccod_almacend2: jq_almacen_destino.val(),
        codigo_transaccion: jq_tipo.val(),
        codigo_detraccion:'00',
        contabilizada: 'N',
        serie_guia_prov: '',
        nro_guia_prov: '',
        serie_fac_prov: '',
        nro_fac_prov: '',
        fecha_emision: '01/01/1900',
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
        agencia_transporte: jq_agencia_transporte.val(),
        codigo_chofer: jq_chofer.val(),
        serie_destino: jq_serie_destino.val(),
        numero_destino: jq_numero_correlativo_destino.val(),
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
        erp_ejercon_02: '',
        erp_percon_02: '',
        erp_cobsub_02: '',
        erp_numcon_02: '',
        erp_selecc: '',
        tipdoc_ref_2: jq_tipo_referencia_2.val(),
        ptovta_ref_2: '',
        motivo_ref_2: jq_serie_referencia_2.val(),
        nro_ref_2: jq_numero_referencia_2.val(),
        erp_cod_rubro: '00',
        detalleanulacion: '',
        cnum_lote: '',
        transferencia_almacen: jq_tipo_movimiento.val(),       
        filas_detalle: JSON.stringify( filas_detalle)
    };
     $.ajax({
         url: url_guardar,
         type: 'post',
         data:data,
         success: function(result){
             console.log(result);
             if(result.estado == true){
                jq_numero_correlativo.val(result.codigo);

                if(data.transferencia_almacen=="T"){
                    data.transferencia_almacen="TE";
                    $.ajax({
                        url: url_guardar,
                        type: 'post',
                        data:data,
                        success: function(result){
                            console.log(result);
                            if(result.estado == true){
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
                }else{
                    $("#guardar").prop("disabled", true);
                    mostrarMensaje(mensaje,true,2000);
                    if(estado!="eliminar") 
                        consultar(impresion);
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
    var mensaje='';
    /*if(isEmptyOrWhiteSpaces(jq_porc_descuento.val())) {
        jq_porc_descuento.val("0");
    }*/
    /*if(isEmptyOrWhiteSpaces(jq_dias_forma_pago.val())) {
        jq_dias_forma_pago.val("0");
    }*/

    if(jq_tasa_cambio.val() * 1 == 0 ) {
        retorno = false;
        mostrarMensajeModal("Aviso","Tipo de cambio debe ser mayor a 0");
    }
    /*if(isEmptyOrWhiteSpaces(jq_codigo_proveedor.val())) {
        retorno = false;
        mostrarMensajeModal("Aviso","Debe ingresar un proveedor");
        mensaje += "Debe ingresar un proveedor. <br>";
    }*/
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
    documentoSeleccionado = rowId_seleccionado;
    row_lista_documento_selected = jq_grid_documentos.jqGrid("getRowData", documentoSeleccionado);
    //console.log(row_lista_documento_selected);
    var data ={
        codigo_punto_venta : row_lista_documento_selected.Codigo_Punto_Venta,
        tipo_documento : row_lista_documento_selected.Codigo_Tipo_Documento,
        motivo_serie : row_lista_documento_selected.Codigo_Motivo_Serie,
        numero_documento : row_lista_documento_selected.Numero,
    }
    if(impresion){
        data ={
            codigo_punto_venta : "",
            tipo_documento : jq_tipo_movimiento.val(),
            motivo_serie : jq_serie.val(),
            numero_documento : jq_numero_correlativo.val(),
        }
    }
    $.ajax({
        type: "POST",
        url: url_consultar,
        data: data,
        success: function (data) {
            console.log(data);
            rellenar_formas_pago(data[0].codigo_proveedor,'42',data[0].documento_forma_pago_codigo);
            rellenar_tipo_transaccion_almacen(url_transaccion,data[0].documento_tipo,tipo,data[0].documento_tipo_transaccion);
            rellenar_sublista_clientes(data[0].codigo_proveedor, url_proveedores_contactos,"contacto_proveedor",data[0].proveedor_contacto_codigo);
            rellenar_sublista_clientes(data[0].codigo_proveedor, url_proveedores_agencias,"agencia_proveedor",data[0].proveedor_agencia);
            data[0].documento_tipo == "T" ? $("#div_transferecia").show():$("#div_transferecia").hide();
            

            data[0].documento_automatico=="A" ? jq_automatico.prop('checked', true) : jq_automatico.prop('checked', false)
            data[0].documento_automatico=="M" ? jq_manual.prop('checked', true) : jq_manual.prop('checked', false)
            data[0].documento_automatico_destino=="A" ? jq_automatico_destino.prop('checked', true) : jq_automatico_destino.prop('checked', false)
            data[0].documento_automatico_destino=="M" ? jq_manual_destino.prop('checked', true) : jq_manual_destino.prop('checked', false)
            jq_mas_igv.prop('checked', (data[0].documento_mas_igv=="S" ? true : false));
            jq_tipo_movimiento.val(data[0].documento_tipo)
            // jq_tipo.val(data[0].documento_tipo_transaccion);
            jq_codigo_cliente.val(data[0].codigo_cliente);
            jq_nombre_cliente.val(data[0].cliente_nombre);
            jq_direccion_cliente.val(data[0].cliente_direccion);
            jq_codigo_proveedor.val(data[0].proveedor_ruc);
            jq_nombre_proveedor.val(data[0].proveedor_nombre);
            jq_direccion_proveedor.val(data[0].proveedor_direccion);
            //jq_tipo_movimiento.trigger("change");
            //rellenar_motivos_tramite_series("NE",serie,true,'',true);
            rellenar_motivos_tramite_series(data[0].documento_tipo_movimiento,serie,false,data[0].documento_motivo_venta_codigo);
            cargar_correlativo(serie,data[0].documento_numero);
            //jq_serie.val(data[0].documento_motivo_venta_codigo);
            jq_moneda.val(data[0].documento_moneda);
            //jq_numero_correlativo.val(data[0].documento_numero);
            jq_fecha_doc.val(data[0].documento_fecha_format23);
            jq_tipo_cambio.val(data[0].nombre_tipo_cambio);
            jq_tasa_cambio.val(data[0].tipo_cambio);
            jq_almacen.val(data[0].documento_codigo_almacen);
            jq_responsable.val(data[0].documento_responsable);
            jq_cargo.val(data[0].Responsable_Cargo);
            jq_centro_costos.val(data[0].documento_cencos_codigo);
            jq_orden_trabajo.val(data[0].documento_ot_codigo);
            jq_unidad_negocio.val(data[0].unidad_negocio_codigo);
            jq_glosa.val(data[0].documento_glosa);
            jq_agencia_proveedor.val(data[0].proveedor_agencia);
            jq_numero_expediente.val(data[0].documento_numero_expediente);
            jq_punto_llegada_cliente.val(data[0].documento_punto_llegada);
            jq_tipo_referencia.val(data[0].documento_tipo_referencia);
            jq_serie_referencia.val(data[0].documento_serie_referencia);
            jq_numero_referencia.val(data[0].documento_numero_referencia);
            jq_tipo_referencia_2.val(data[0].documento_tipo_referencia_2);
            jq_serie_referencia_2.val(data[0].documento_serie_referencia_2);
            jq_numero_referencia_2.val(data[0].documento_numero_referencia_2);
            jq_motivo_traslado.val(data[0].documento_motivo_documento);
            jq_transportista.val(data[0].codigo_transportista);
            jq_vehiculo.val(data[0].codigo_vehiculo);
            jq_chofer.val(data[0].codigo_chofer);
            jq_agencia_transporte.val(data[0].agencia_tansporte);
            jq_pto_venta_destino.val(data[0].documento_codigo_punto_venta_2);
            // jq_pto_venta_destino.trigger("change");
            cargar_almacen_destino(
                {
                    predeterminado_almacen: data[0].documento_codigo_almacen_destino_2,
                    predeterminado_serie: data[0].documento_serie_destino
                }
            );
            jq_numero_correlativo_destino.val(data[0].documento_numero_destino);
            jq_fecha_transporte.val(data[0].Fecha_Entrega);
            // jq_almacen_destino.html("");
            // jq_almacen_destino.append(new Option(data[0].documento_codigo_almacen_destino_2, data[0].documento_codigo_almacen_destino_2))

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
            pais_proveedor = data[0].proveedor_pais;

            // rellenarFormato(data);
            // if(impresion)
            //     imprimir();
            setFormatoImpresion(
                {
                    modulo : 'Almacen',
                    tipo_formato : 'transaccion',
                    punto_venta : row_lista_documento_selected.Codigo_Punto_Venta,
                    tipo_documento : row_lista_documento_selected.Codigo_Tipo_Documento,
                    motivo_serie : row_lista_documento_selected.Codigo_Transaccion,
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
    jq_codigo_cliente.val(rowData.Codigo_Cliente);
    jq_nombre_cliente.val(rowData.Nombre_Cliente);
    jq_direccion_cliente.val(rowData.Cliente_Direccion);
    jq_codigo_proveedor.val(rowData.Codigo_Proveedor);
    jq_ruc_proveedor.val(rowData.Codigo_Proveedor);
    jq_nombre_proveedor.val(rowData.Nombre_Proveedor);
    jq_direccion_proveedor.val(rowData.Proveedor_Direccion);
    // rellenar_sublista_clientes(rowData.Codigo_proveedor, url_proveedores_contactos,"contacto_proveedor",rowData.Codigo_Contacto);

    // ** Ventana 1 - 2 ** //
    // rellenar_formas_pago(rowData.Codigo_proveedor,'42',rowData.Forma_Pago);
    // jq_dias_forma_pago.val(rowData.Dias_Forma_Pago);
    jq_moneda.val(rowData.Moneda);
    jq_glosa.val(rowData.glosa);
    jq_porc_descuento.val(rowData.Porc_Descuento);
    // jq_mas_igv.prop('checked', (rowData.si_igv=="S" ? true : false));

    
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
    jq_punto_llegada_cliente.val(rowData.Punto_Llegada);
    jq_unidad_negocio.val(rowData.Codigo_Unidad_Negocio);
    jq_centro_costos.val(rowData.Cencos);
    jq_orden_trabajo.val(rowData.Ot);
    jq_numero_expediente.val(rowData.Documento_Nro_Expediente) //Nro Expediente
    // rellenar_sublista_clientes(rowData.Codigo_proveedor, url_proveedores_agencias,"agencia_proveedor",rowData.Codigo_Agencia);

    // ** Ventana 2 - 2 ** //
    jq_tipo_referencia.val(rowData.Tipo_Documento);
    jq_serie_referencia.val(rowData.Codigo_Motivo_Serie);
    jq_numero_referencia.val(rowData.Numero);
    jq_tipo_referencia_2.val(rowData.Tipo_Referencia_Documento);
    jq_serie_referencia_2.val(rowData.Motivo_Serie_Referencia_Documento);
    jq_numero_referencia_2.val(rowData.Numero_Referencia_Documento);
    // jq_motivo_traslado.val(rowData.)
    // jq_tipo_referencia.val(rowData.Referencia_01_Tipo); //Tipo Ref - Tipo
    // jq_serie_referencia.val(rowData.Referencia_01_Motivo_Serie); //Tipo Ref - Motivo
    // jq_numero_referencia.val(rowData.Referencia_01_Numero); //Tipo Ref - Numero
    // jq_tipo_referencia.val(rowData.Referencia_02_Tipo); //Tipo Ref 2 - Tipo
    // jq_tipo_referencia.val(rowData.Referencia_02_Tipo); //Tipo Ref 2 - Motivo
    // jq_tipo_referencia.val(rowData.Referencia_02_Tipo); //Tipo Ref 2 - Numero
    // jq_serie_guia_remision.val(rowData.Referencia_Guia_Remision_Serie); //Guia Remision - Serie
    // jq_numero_guia_remision.val(rowData.Referencia_Guia_Remision_Numero); //Guia Remision - Numero
    // jq_fecha_emision.val(rowData.Referencia_Guia_Remision_Fecha); //Guia Remision - Fecha
    // jq_tipo_factura.val(rowData.Referencia_Factura_Tipo); //Factura - Tipo
    // jq_serie_factura.val(rowData.Referencia_Factura_Motivo_Serie); //Factura - Serie
    // jq_numero_factura.val(rowData.Referencia_Factura_Numero); //Factura - Numero
    
};

function cliente_proveedor() {
    $.ajax({
        type: 'POST',
        url: '/definicion_transacciones/transaccion',
        data: {
            tipo_movimiento: jq_tipo_movimiento.val(),
            transaccion: jq_tipo.val()
        },
        success: function (data) {
            console.log(data);
            if(data.length>0){
                data[0].Proveedor=="S" ? $("#div_prveedor").show():$("#div_prveedor").hide();
                data[0].Cliente=="S" ? $("#div_cliente").show():$("#div_cliente").hide();
                var Tipo_Documento_Pendientes=data[0].Tipo_Documento_Pendientes;
                var pendientes_titulo,pendientes_cabecera_url,pendientes_detalle_url, pendientes_cabecera_tipo,pendientes_detalle_tipo;
                switch(Tipo_Documento_Pendientes){
                    case "REQ":
                        pendientes_titulo='Requerimientos Pendientes';
                        pendientes_cabecera_url='/requerimientos/lista_documentos_pendientes';
                        pendientes_detalle_url='/requerimientos/lista_detalle_pendientes';
                        pendientes_cabecera_tipo='compras_pendientes';
                        pendientes_detalle_tipo='detalle_compra';
                    break;
                    case "OC":
                        pendientes_titulo='Orden de Compra Pendientes';
                        pendientes_cabecera_url='/orden_compra/lista_documentos_pendientes';
                        pendientes_detalle_url='/orden_compra/lista_detalle_pendientes';
                        pendientes_cabecera_tipo='compras_pendientes';
                        pendientes_detalle_tipo='detalle_compra';
                    break;
                    case "NS":
                    case "NE":
                    case "NT":
                        pendientes_titulo='Almacen Pendientes';
                        pendientes_cabecera_url='/transaccion_almacen/lista_documentos_pendientes';
                        pendientes_detalle_url='/transaccion_almacen/lista_detalle_pendientes';
                        pendientes_cabecera_tipo='compras_pendientes';
                        pendientes_detalle_tipo='detalle_compra';
                    break;
                    case "PED":
                        pendientes_titulo='Pedidos Pendientes';
                        pendientes_cabecera_url='/pedido/lista_documentos_pendientes';
                        pendientes_detalle_url='/pedido/lista_detalle_pendientes';
                        pendientes_cabecera_tipo='ventas_pendientes';
                        pendientes_detalle_tipo='detalle_venta';
                    break;
                    case "COT":
                        pendientes_titulo='Cotizaciones Pendientes';
                        pendientes_cabecera_url='/cotizacion/lista_documentos_pendientes';
                        pendientes_detalle_url='/cotizacion/lista_detalle_pendientes';
                        pendientes_cabecera_tipo='ventas_pendientes';
                        pendientes_detalle_tipo='detalle_venta';
                    break;
                    case "09":
                    case "07":
                    case "08":
                        pendientes_titulo='Documentos Pendientes';
                        pendientes_cabecera_url='/facturacion/lista_documentos_pendientes';
                        pendientes_detalle_url='/facturacion/lista_detalle_pendientes';
                        pendientes_cabecera_tipo='ventas_pendientes';
                        pendientes_detalle_tipo='detalle_venta';
                    break;
                }
                if(Tipo_Documento_Pendientes!="00" && pendientes_detalle_url != undefined){
                    setVentasPendientes(pendientes_titulo,pendientes_cabecera_url,pendientes_detalle_url, Tipo_Documento_Pendientes, pendientes_cabecera_tipo,pendientes_detalle_tipo);
                }
            }
        }
    });
    
}

function cargar_almacen_destino(data) {
    $.ajax({
        type: 'POST',
        url: url_almacen_destino,
        data:{
            codigo_punto_venta: jq_pto_venta_destino.val()
        },
        success: function (lists){
            jq_almacen_destino.html('');
            lists.forEach(list=>{
                jq_almacen_destino.append('<option value="'+list.Codigo+'" >'+list.Nombre + '</option>');
            });
            if( !isNullOrUndefinied(data) && !isEmptyOrWhiteSpaces(data.predeterminado_almacen)){
                jq_almacen_destino.val(data.predeterminado_almacen);
            }

            $.ajax({
                type: 'POST',
                url: '/talonarios/motivos_series',
                data: {
                    tipo_documento: 'NE',
                    codigo_punto_venta: jq_pto_venta_destino.val(),
                },
                success: function (lists){
                    jq_serie_destino.html('');
                    lists.forEach(list=>{
                        jq_serie_destino.append('<option value="'+list.Codigo+'" >'+list.Nombre + '</option>');
                    });
                    if( !isNullOrUndefinied(data) && !isEmptyOrWhiteSpaces(data.predeterminado_serie)){
                        jq_serie_destino.val(data.predeterminado_serie);
                    }else{
                        jq_serie_destino.trigger("change");
                    }
                    //cargar_correlativo(serie_destino);
               }
           });

       }
   });
}

function calcular_formas_pago_proveedor (){
    
}