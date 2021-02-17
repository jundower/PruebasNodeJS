var url_configuraciones="/provisiones/configuraciones";
var modulo = "caja_banco";
var short_fecha_trabajo;

var jq_automatico;
var jq_manual;
var jq_numero_documento;
var jq_tasa_cambio;
var jq_saldo_caja;
var jq_tipo_caja_banco;
var jq_codigo_caja_banco;
var jq_ingresos_egresos;
var jq_codigo_cobrador;
var jq_importe;
var jq_tipo_anexo;
var jq_fecha_emision;
var jq_tipo_referencia1;
var jq_serie_referencia1;
var jq_numero_referencia1;
var jq_fecha_referencia1;
var jq_numero_operacion;
var jq_tipo_referencia2;
var jq_serie_referencia2;
var jq_numero_referencia2;
var jq_fecha_referencia2;
var jq_glosa;
var jq_subvoucher;
var jq_tipo_cambio;
var jq_codigo_anexo;
var jq_nombre_anexo;
var jq_moneda;
var jq_fecha_registro;

var estado="guardar";

$(document).ready(function() {
  
    jq_automatico = $("#automatico");
    jq_manual = $("#manual");
    jq_numero_documento = $("#numero_correlativo");
    jq_tasa_cambio = $("#tasa_cambio");
    jq_saldo_caja = $("#saldo_caja");
    jq_tipo_caja_banco = $("#tipo_caja_banco");
    jq_codigo_caja_banco = $("#codigo_caja_banco");
    jq_ingresos_egresos = $("#ingresos_egresos");
    jq_codigo_cobrador = $("#codigo_cobrador");
    jq_importe = $("#importe");
    jq_tipo_anexo = $("#tipo_anexo");
    jq_fecha_emision=$("#fecha_emision");
    jq_fecha_registro = $("#fecha_emision");
    jq_tipo_referencia1 = $("#tipo_referencia1");
    jq_serie_referencia1 = $("#serie_referencia1");
    jq_numero_referencia1 = $("#numero_referencia1");
    jq_fecha_referencia1 = $("#fecha_referencia1");
    jq_numero_operacion = $("#numero_operacion");
    jq_tipo_referencia2 = $("#tipo_referencia2");
    jq_serie_referencia2 = $("#serie_referencia2");
    jq_numero_referencia2 = $("#numero_referencia2");
    jq_fecha_referencia2 = $("#fecha_referencia2");
    jq_glosa = $("#glosa");
    
    jq_subvoucher = $("#subvoucher");
    jq_tipo_cambio = $("#tipo_cambio");
    jq_moneda = $("#moneda");
    jq_codigo_anexo = $("#codigo_anexo");
    jq_nombre_anexo = $("#nombre_anexo");

    $("#nuevo").show();
    $("#guardar").show();
    $("#listar").show();
    $("#imprimir").show();
    $('#modificar').hide();

    jq_codigo_caja_banco.change(function(){
        rellenar_caja_bancos($(this).val());
    });

    jq_tipo_anexo.change(function(){
        lista_mantenimientos_tipo_anexo = $(this).val();
    });

    jq_ingresos_egresos.change(function(){
        documentos_pendientes_contable_finalizar();
    });

    jq_subvoucher.change(function(){
        cargar_periodo_ejercicio_contable($(this).val(),true);
    });

    $("#buscar_pendientes_cancelacion").click(function(){
        listar_documentos_pendientes_contable(jq_tipo_anexo.val(), jq_codigo_anexo.val(),null,"cabecera");
    });

    jq_codigo_proveedor = jq_codigo_anexo;
    jq_codigo_cliente = jq_codigo_anexo;
    setTitle("Cancelación de Documentos");
    setTitleLista('Listado de Cancelación de Documentos');
    setListaDocumentos('/cancelacion/lista', '/cancelacion/consultar', '/contabilidad/detalle','','listado_documento_provisiones');
    setListaDocumentosContables('/provisiones/lista_documentos_pendientes', 'listado_documento_contables', true, true);
    setVentasPendientes("Programación masiva",'/provisiones/programacion_vencimientos/lista','/provisiones/programacion_vencimientos/detalle', '', 'listado_documento_programacion_masiva', 'detalle_documento_programacion_masiva')
    nuevo();
});

async function nuevo(){
    
    short_fecha_trabajo =  getShortDate(new Date());
    jq_fecha_emision.val(short_fecha_trabajo);
    jq_fecha_referencia1.val(short_fecha_trabajo);
    jq_fecha_referencia2.val(short_fecha_trabajo);
    cargar_periodo_ejercicio_contable('02',true);
    rellenar_codigo_nombre(url_subvoucher_lista,"subvoucher",'','02');
    rellenar_codigo_nombre(url_tipo_auxiliar_lista,"tipo_anexo",'','12');
    rellenar_codigo_nombre(url_tipo_documento,"tipo_referencia1",'','00');
    rellenar_codigo_nombre(url_tipo_documento,"tipo_referencia2",'',"00");
    rellenar_codigo_nombre(url_cuentas_corrientes,"codigo_caja_banco");
    rellenar_codigo_nombre(url_cobrador,"codigo_cobrador",'',"00");
    rellenar_moneda("moneda");
    rellenar_tipo_cambio("tipo_cambio","tasa_cambio", "fecha_emision"); 
    cargar_configuraciones();
    estado="guardar";
    limpiar();
}

function limpiar(){
    jq_serie_referencia1.val("");
    jq_importe.val("0");
    jq_numero_referencia1.val("");
    jq_serie_referencia2.val("");
    jq_numero_referencia2.val("");
    jq_numero_operacion.val("");
    jq_glosa.val("");
    jq_codigo_anexo.val("");
    jq_nombre_anexo.val("");
// jq_codigo_caja_banco.trigger("change")

    var jq_grid=jq_grid_detalle_contable;
    jq_grid.saveCell(rowid_selected_detalle_contable,selected_cell_detalle_contable);

    jq_grid.jqGrid("setGridParam",{
        url: url_contabilidad_detalle,
        mtype: "POST",
        datatype: "json",
        postData:{
            ejercicio: "",
            periodo: "",
            subvoucher: "",
            numero_documento_contable: "",
            codigo: ""
        }
    }).trigger('reloadGrid');
    // }).trigger('reloadGrid', { fromServer: true, page: 1 });

}

function guardar(){
    console.log('empieza guardando')
    url_guardar="";
    var mensaje="";
    var impresion=false;
    switch (estado) {
        case 'guardar':
            url_guardar = "/cancelacion/guardar";
            mensaje = "Guardado satisfactoriamente."
            impresion=true;
            break;
        case  'modificar':
            url_guardar = "/cancelacion/modificar";
            mensaje = "Modificado satisfactoriamente."
            break;
        case 'eliminar':
            url_guardar = "/cancelacion/eliminar";
            mensaje = "Eliminado satisfactoriamente."
            break;
        case 'anular':
            url_guardar = "/cancelacion/anular";
            mensaje = "Anulado satisfactoriamente."
            break;
    }
    console.log("2")

    var filas_detalle= [];
    var rows = jq_grid_detalle_contable.jqGrid('getDataIDs');
    var automatico = (jq_automatico.prop('checked') == true ? "A" : "M");

    rows.forEach(rowid => {
        var rowdata = jq_grid_detalle_contable.getRowData(rowid);
        rowdata.CenCos=$("#lista_select_cencos_"+rowid).val();
        rowdata.Ot=$("#lista_select_ot_"+rowid).val();
        rowdata.Unidad_Negocio=$("#lista_select_unidad_negocio_"+rowid).val();
        rowdata.Tipo_Referencia=$("#lista_select_tipo_documento_"+rowid).val();
        rowdata.Tipo2=$("#lista_select_tipo_documento2_"+rowid).val();
        rowdata.Tipo_Origen=$("#lista_select_tipo_origen_"+rowid).val();
        rowdata.Vendedor=$("#lista_select_vendedor_"+rowid).val();
        rowdata.Vendedor2=$("#lista_select_vendedor2_"+rowid).val();
        rowdata.Forma_Pago=$("#lista_select_forma_pago_"+rowid).val();
        filas_detalle.push(rowdata);
    });
    console.log('iniciar guardar')
     $.ajax({
         url: url_guardar,
         type: 'post',
         data:{
             periodo: getPeriodo(jq_fecha_registro.val()),
             ingresos_egresos: jq_ingresos_egresos.val(),
             codigo_subvoucher: jq_subvoucher.val(),
             automatico: automatico,
             numero_correlativo : jq_numero_documento.val(),
             fecha_registro: jq_fecha_registro.val(),
             tipo_caja_banco: jq_tipo_caja_banco.val(),
             codigo_caja_banco: jq_codigo_caja_banco.val(),
             tipo_cambio: jq_tipo_cambio.val(),
             tasa_cambio: jq_tasa_cambio.val(),
             saldo_caja: jq_saldo_caja.val(),
             codigo_cobrador: jq_codigo_cobrador.val(),
             moneda: jq_moneda.val(),
             erp_Dimporte: jq_importe.val(),
             tipo_referencia1: jq_tipo_referencia1.val(),
             serie_referencia1: jq_serie_referencia1.val(),
             numero_referencia1: jq_numero_referencia1.val(),
             fecha_referencia1: jq_fecha_referencia1.val(),
             numero_operacion: jq_numero_operacion.val(),
             tipo_referencia2: jq_tipo_referencia2.val(),
             serie_referencia2: jq_serie_referencia2.val(),
             numero_referencia2: jq_numero_referencia2.val(),
             fecha_referencia2: jq_fecha_referencia2.val(),
             tipo_codigo_auxiliar: jq_tipo_anexo.val(),
             codigo_anexo: jq_codigo_anexo.val(),
             nombre_anexo: jq_nombre_anexo.val(),
             glosa: jq_glosa.val(),
             Pc_Fecha: '1900/01/01',

             filas_detalle: JSON.stringify(filas_detalle)
         },
         success: function(result){
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
    var jq_grid=jq_grid_detalle_contable;

    var dataIDs = jq_grid.getDataIDs();
    var fila0 = jq_grid.getRowData(dataIDs[0]);
    var fila1 = jq_grid.getRowData(dataIDs[1]);

    
    if(jq_tipo_referencia2.val()=="00" && isEmptyOrWhiteSpaces(jq_serie_referencia2.val()) && isEmptyOrWhiteSpaces(jq_numero_referencia2.val())){
        jq_tipo_referencia2.val($("#lista_select_tipo_documento_"+dataIDs[1]).val());
        jq_serie_referencia2.val(fila1.Serie_Referencia);
        jq_numero_referencia2.val(fila1.Numero_Referencia);
        jq_fecha_referencia1.val(getDateFormat(fila1.Fecha_Referencia,'y/m/d','y-m-d','/','-'));
        retorno = false;
        mostrarMensajeModal("Aviso","Debe Ingresa Referencia 2");
    }
    // #region 
        // if(jq_tipo_referencia1.val()=="00" && isEmptyOrWhiteSpaces(jq_serie_referencia1.val()) && isEmptyOrWhiteSpaces(jq_numero_referencia1.val())){
        //     jq_tipo_referencia1.val($("#lista_select_tipo_documento_"+dataIDs[0]).val());
        //     jq_serie_referencia1.val(fila0.Serie_Referencia);
        //     jq_numero_referencia1.val(fila0.Numero_Referencia);
        //     jq_fecha_referencia2.val(getDateFormat(fila0.Fecha_Referencia,'y/m/d','y-m-d','/','-'));
        //     retorno = false;
        //     mostrarMensajeModal("Aviso","Debe Ingresa Referencia 1");
        // }
    
        // if(isEmptyOrWhiteSpaces(jq_glosa.val())){
        //     jq_numero_referencia1.val(fila0.Glosa);
        //     retorno = false;
        //     mostrarMensajeModal("Aviso","Debe Ingresa una Glosa");
        // }

        // if($("#lista_select_tipo_documento_"+dataIDs[0]).val()=="00"){
        //     $("#lista_select_tipo_documento_"+dataIDs[0]).val(jq_tipo_referencia1.val());
        //     retorno = false;
        //     mostrarMensajeModal("Aviso","Debe Ingresar Tipo Documento 1");
        // }
        // if(isEmptyOrWhiteSpaces(fila0.Serie_Referencia)){
        //     jq_grid.jqGrid('setRowData', dataIDs[0], {Serie_Referencia: jq_serie_referencia1.val() });
        //     retorno = false;
        //     mostrarMensajeModal("Aviso","Debe Ingresa Serie Referecia 1");
        
        // }

        // if(isEmptyOrWhiteSpaces(fila0.Numero_Referencia)){
        //     jq_grid.jqGrid('setRowData', dataIDs[0], {Numero_Referencia: jq_numero_referencia1.val() });
        //     retorno = false;
        //     mostrarMensajeModal("Aviso","Debe Ingresa Numero Referencia 1");
        // }

        // if(isEmptyOrWhiteSpaces(fila0.Glosa)){
        //     jq_grid.jqGrid('setRowData', dataIDs[0], {Glosa: jq_glosa.val() });
        //     retorno = false;
        //     mostrarMensajeModal("Aviso","Debe Ingresa Glosa en el Detalle");
        // }
    //#endregion

    return retorno;
};

async function consultar(impresion) {
    console.log(estado);
    var jq_grid=jq_grid_detalle_contable;
    jq_grid.saveCell(rowid_selected_detalle_contable,selected_cell_detalle_contable);

    documentoSeleccionado = jq_grid_documentos.jqGrid("getGridParam", 'selrow');
    documentoSeleccionado = rowId_seleccionado;
    row_lista_documento_selected = jq_grid_documentos.jqGrid("getRowData", documentoSeleccionado);

    var data ={
        cob_pag: row_lista_documento_selected.Cob_Pag,
        ejercicio: row_lista_documento_selected.Ejercicio,
        periodo: row_lista_documento_selected.Periodo_Contable,
        numero_documento_contable: row_lista_documento_selected.Numero_Contable,
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

            jq_ingresos_egresos.val(data[0].Documento_Ingreso_Egreso);
            jq_subvoucher.val(data[0].Documento_Codigo_Svoucher);
            data[0].Documento_Automatico=="A" ? jq_automatico.prop('checked', true) : jq_automatico.prop('checked', false)
            data[0].Documento_Automatico=="M" ? jq_manual.prop('checked', true) : jq_manual.prop('checked', false)
            jq_numero_documento.val(data[0].Documento_Numero_Contable);
            jq_fecha_registro.val(data[0].Documento_Fecha_Registro);
            jq_codigo_caja_banco.val(data[0].Documento_Caja_Bancos);
            jq_tasa_cambio.val(data[0].Documento_Tasa_Cambio);
            jq_tipo_cambio.val(data[0].Documento_Tipo_Cambio);
            jq_moneda.val(data[0].Documento_Moneda);
            jq_codigo_cobrador.val(data[0].Documento_Cobrador);
            jq_importe.val(formatCurrency(data[0].Documento_Importe,2));
            jq_tipo_referencia1.val(data[0].Documento_Tipo_Documento);
            jq_serie_referencia1.val(data[0].Documento_Serie);
            jq_numero_referencia1.val(data[0].Documento_Numero);
            jq_fecha_referencia1.val(data[0].Documento_Fecha_Emision);
            jq_tipo_referencia2.val(data[0].Documento_Tipo_Documento_Referencia);
            jq_serie_referencia2.val(data[0].Documento_Serie_Documento_Referencia);
            jq_numero_referencia2.val(data[0].Documento_Numero_Documento_Referencia);
            jq_fecha_referencia2.val(data[0].Documento_Fecha_Referencia_Documento);
            jq_numero_operacion.val(data[0].Documento_Numero_Operacion);
            jq_tipo_anexo.val(data[0].Documento_Tipo_Anexo);
            jq_codigo_anexo.val(data[0].Documento_Codigo_Anexo);
            jq_nombre_anexo.val(data[0].Documento_Nombre_Anexo);
            jq_glosa.val(data[0].Documento_Glosa);
            // rellenarFormato(data);
            // if(impresion)
            //     imprimir();


            setFormatoImpresion(
                {
                    modulo : 'Contabilidad',
                    tipo_formato : '',
                    tipo_documento : 'VOU',
                },
                data,
                impresion
            );
        }
      });

      jq_grid_detalle_contable.jqGrid("setGridParam",{
        url: url_getListaDetalle,
        mtype: "POST",
        datatype: "json",
        postData:data
    }).trigger("reloadGrid");

    jq_modal_ventana_lista.modal('hide');
};

function cargar_configuraciones(){
    $.ajax({
        type: 'POST',
        url: url_configuraciones,
        success: function (lists){
            lists.forEach(list=>{
                jq_moneda.val(list.moneda_trabajo);
                jq_tipo_cambio.val(list.ctipo_cambio);
                jq_tipo_cambio.trigger("change");
            });
        }
    });
};

function rellenar_anexos(codigo, tipo){
    if(!isEmptyOrWhiteSpaces(codigo)){
        $.ajax({
            type: 'POST',
            url: url_anexo_datos,
            data: {codigo: codigo, tipo: tipo},
            success: function (result){
                if(result.length>0){
                    
                    result.forEach(list=>{
                        jq_codigo_anexo.val(list.Codigo);
                        jq_nombre_anexo.val(list.Nombre);
                    });

                    listar_documentos_pendientes_contable(result[0].Tipo_Auxiliar, result[0].Codigo,null,"cabecera");
                }
            }
        });
    }
};

function rellenar_caja_bancos(codigo){

    jq_grid_detalle_contable.jqGrid('saveCell',row_editing_detalle_contable,col_editing_detalle_contable);
    if(!isEmptyOrWhiteSpaces(codigo)){
        $.ajax({
            type: 'POST',
            url: "/cuentas_corrientes/lista/"+codigo,
            success: function (e){
                var caja = e[0];
                if(caja.Si_Banco=="S"){
                    $("#tipo_caja_banco").val("CAJ");
                }else{
                    $("#tipo_caja_banco").val("BAN");
                }
                jq_moneda.val(caja.Moneda);
                jq_tipo_referencia1.val(caja.Tipo_Documento);

                $.ajax({
                    type: 'POST',
                    url: '/cuentas_corrientes/saldo',
                    data: {
                        Cta_cte: caja.Codigo,
                        Periodo: getPeriodo(fecha_trabajo),
                        Tipo: 'AFTER'
                    },
                    success: function(data){
                        jq_saldo_caja.val(data[0].Saldo);
                    }
                });

                $.ajax({
                    type: 'POST',
                    url: '/plan_contable/datos',
                    data: {
                        Codigo: caja.Codigo_Cuenta_Contable
                    },
                    success: function (data) {

                        var element = data[0];
                        var dataIDs = jq_grid_detalle_contable.getDataIDs(); 
                        var firstId = dataIDs[0]
                        var data = deepCopy(fila_vacia_grid_detalle_contable)
                        // var data = jq_grid_detalle_contable.getRowData(firstId);

                        data.Cuenta = element.Codigo;
                        data.Nombre_Cuenta = element.Nombre;
                        data.Debe = 0;
                        data.Haber = 0;
                        data.D_H = jq_ingresos_egresos.val()=="ING" ? "D" : "H";
                        data.Glosa = jq_glosa.val();
                        data.Tipo_Referencia = jq_tipo_referencia1.val();
                        data.Serie_Referencia = jq_serie_referencia1.val();
                        data.Numero_Referencia = jq_numero_referencia1.val();
                        data.Fecha_Referencia = getDateFormat(jq_fecha_referencia1.val(),'y-m-d','d/m/y','-','/');
                        data.Fecha_Vencimiento = getDateFormat(jq_fecha_referencia1.val(),'y-m-d','d/m/y','-','/');
                        data.Forma_Pago = '00';
                        data.Fecha2 = getDateFormat(jq_fecha_referencia2.val(),'y-m-d','d/m/y','-','/');
                        data.Si_Transferencia = element.Si_Transferencia;
                        data.Si_CenCos = element.Si_CenCos;
                        data.Si_Ot = element.Si_Ot;
                        data.Si_Diferencia = element.Si_Genera_Diferencia;
                        data.Tipo_Anexo = element.Tipo_Auxiliar;

                        if(dataIDs.length==0){
                            jq_grid_detalle_contable.jqGrid('addRowData',undefined,data );
                            dataIDs = jq_grid_detalle_contable.getDataIDs(); 
                            firstId = dataIDs[0]
                            $("#lista_select_cencos_"+firstId).prop("disabled",data.Si_CenCos=="N");
                        }else{
                            jq_grid_detalle_contable.jqGrid('setRowData', firstId, data);
                            $("#lista_select_cencos_"+firstId).prop("disabled",data.Si_CenCos=="N");
                        }
                        
                        documentos_pendientes_contable_finalizar();

                    }
                });
            }
        });
    }
};

function documentos_pendientes_contable_finalizar(){
    
    var jq_grid=jq_grid_detalle_contable;

    var dataIDs = jq_grid.getDataIDs();

    var caja = jq_grid.getRowData(dataIDs[0]);
    var importe = 0;
    var debe_total = 0;
    var haber_total = 0;
    jq_grid.jqGrid('setRowData', dataIDs[0], {D_H: jq_ingresos_egresos.val()=="ING" ? "D" : "H" , Tipo_Cambio_Referencia: jq_tasa_cambio.val(), Moneda_Referencia: jq_moneda.val()});
    $("#lista_select_tipo_origen_"+dataIDs[0]).val("ING");
    caja = jq_grid.getRowData(dataIDs[0]);
    for(i = 1; i < dataIDs.length; i++)
    {
        var data = jq_grid.getRowData(dataIDs[i]);

        debe_total += jq_moneda.val()=="S/" ? data.MnDebe : data.MeDebe;
        haber_total +=  jq_moneda.val()=="S/" ? data.MnHaber : data.MeHaber;
        jq_grid.jqGrid('setRowData', dataIDs[i], {Tipo_Cambio_Referencia: jq_tasa_cambio.val(), Moneda_Referencia: jq_moneda.val(), Debe: jq_moneda.val()=="S/" ? data.MnDebe : data.MeDebe , Haber: jq_moneda.val()=="S/" ? data.MnHaber : data.MeHaber });
    }
    
    importe = (caja.D_H=="D" ? haber_total - debe_total : debe_total - haber_total);
    jq_importe.val(importe);
    
    jq_grid.jqGrid('setRowData', dataIDs[0], {Debe: (caja.D_H=="D" ? importe : 0), Haber: (caja.D_H=="D" ? 0 : importe)});
    calcularMeMnDetalle();
    calcular_totales_footer();

};

function agregar_cabecera_pendientes(row,data){

    jq_codigo_caja_banco.val(row.Numero_Cuenta_Corriente)
    jq_codigo_caja_banco.trigger("change");

    var total_debe=0, total_haber=0;
    for(var i=0; i<data.length; i++){
        var jq_grid=jq_grid_detalle_contable;
        var newFila = deepCopy(fila_vacia_grid_detalle_contable)
        newFila.Cuenta=data[i].Cuenta;
        newFila.Nombre_Cuenta=data[i].Nombre_Cuenta;
        newFila.Codigo_Anexo=data[i].Codigo_Anexo;
        newFila.Nombre_Anexo=data[i].Nombre_Anexo;
        newFila.D_H=data[i].D_H;
        newFila.Tipo_Referencia=data[i].Tipo_Referencia;
        newFila.Serie_Referencia=data[i].Serie_Referencia;
        newFila.Numero_Referencia=data[i].Numero_Referencia;
        newFila.Fecha_Referencia=data[i].Fecha_Referencia;
        newFila.Fecha_Vencimiento=data[i].Fecha_Vencimiento;
        newFila.Fecha2='01/01/1900';
        newFila.Tipo_Cambio_Referencia=jq_tasa_cambio.val();
        newFila.Moneda_Referencia=data[i].Moneda_Referencia;
        newFila.SubVoucher_Referencia=data[i].SubVoucher_Referencia;
        newFila.Es_Transferencia='N';
        newFila.Si_Transferencia=data[i].Si_Transferencia;
        newFila.Si_CenCos=data[i].Si_CenCos;
        newFila.Si_Ot=data[i].Si_Ot;
        newFila.Si_Diferencia='N';
        newFila.Tipo_Anexo=data[i].Tipo_Anexo;
        newFila.Debe=data[i].D_H == "D" ? data[i].Importe : 0 ;
        newFila.Haber=data[i].D_H == "H" ? data[i].Importe : 0 ;

        jq_grid.jqGrid('addRowData',undefined,newFila );
    }

    var dataIDs = jq_grid.getDataIDs();
    for(var i=1;i<dataIDs.length;i++){
        var row = jq_grid.getRowData(dataIDs[i]);
        total_debe+=row.Debe;
        total_haber+=row.Haber;
    }

    var row = jq_grid.getRowData(dataIDs[0]);
    row.D_H =="D" ? jq_grid.jqGrid( 'setRowData', dataIDs[0], {Debe: total_haber}) : jq_grid.jqGrid( 'setRowData', dataIDs[0], {Haber: total_debe})
    row.D_H =="D" ? jq_importe.val(total_haber) : jq_importe.val(total_debe)
    
    calcularMeMnDetalle();
}