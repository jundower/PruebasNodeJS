var url_tasa_cambio="/tipo_cambio/tasa_cambio";
var url_lista_situacion_letras = '/letras/lista_situacion_letras';
var url_configuracion_permisos = '/configuraciones/configuracion_permisos/proceso_provisiones__sist_letras_CXC__situacion_letras';

var moneda = "moneda";
var tipo_cambio = "tipo_cambio";
var tasa_cambio = "tasa_cambio";
var situacion_letra_mn = "situacion_letra_mn";
var situacion_letra_me = "situacion_letra_me";

var lista_letras_pendientes = "lista_letras_pendientes";
var estado = "estado";
var contenedor_formato_impresion = "contenedor_formato_impresion";

var jq_moneda;
var jq_tipo_cambio;
var jq_tasa_cambio;
var jq_situacion_letra_mn;
var jq_situacion_letra_me;

var jq_lista_letras_pendientes;
var jq_estado;
var jq_contenedor_formato_impresion;
var detalle_letras_contable = [];

$(document).ready(function() {
    
    $("#aprobar").show();
    $("#desaprobar").show();
    $("#imprimir").show();
    $("#exportar").show();
    $("#guardar").prop("disabled",true);

    jq_moneda = $("#"+moneda);
    jq_tipo_cambio = $("#"+tipo_cambio);
    jq_tasa_cambio = $("#"+tasa_cambio);
    jq_situacion_letra_mn = $("#"+situacion_letra_mn);
    jq_situacion_letra_me = $("#"+situacion_letra_me);
    
    jq_lista_letras_pendientes=$("#"+lista_letras_pendientes);
    jq_estado=$("#"+estado);
    jq_contenedor_formato_impresion=$("#"+contenedor_formato_impresion);
    
    jq_contenedor_formato_impresion.draggable();
    
    jq_estado.change(function() {
        recargar_jgrid();
    });
    jq_contenedor_formato_impresion.hide();
    $("#close_print").click(function(){
        jq_contenedor_formato_impresion.hide();
    });

    // $('#exportar').click(function (){
    //     createExcelFromGrid(lista_documentos,$("#TitleHeader").text(),documentos_listas_cabecera)
    //     // jq_lista_documentos.tableExport({
    //     //     formats: ["xlsx"], //Tipo de archivos a exportar ("xlsx","txt", "csv", "xls")
    //     //     position: 'bottom',  // Posicion que se muestran los botones puedes ser: (top, bottom)
    //     //     bootstrap: false,//Usar lo estilos de css de bootstrap para los botones (true, false)
    //     //     fileName: $("#modulo").text(),    //Nombre del archivo 
    //     // });
    // });
    // cargar_configuracion();
    cargar_configuraciones();
    cargar_listado_letras_pendientes();
    setTitle("Listado de Letras Pendientes");
    permisos();
});

function cargar_listado_letras_pendientes() {
    var jq_grid = jq_lista_letras_pendientes;

    jq_grid.jqGrid({
        url: url_lista_situacion_letras,
        type: 'POST',
        postData: {
            fecha: getShortDate(fecha_trabajo),
            situacion: "N"
        },
        datatype: "json",
        colNames:['Fecha_Emision','Fecha_Vencimiento', 'Tipo_Doc', 'Serie_Doc','Numero_Doc','Tipo_Anexo','Codigo_Anexo','Nombre_Anexo','Cuenta','Letra_Aceptada',
        'Moneda','Importe_Mn', 'Importe_Me', 'Pago','Tipo_Ref','Serie_Ref','Numero_Ref','Voucher_Ref','Banco',
        'Situacion_Letra','Numero_Unico', 'Numero_Cta', 'Ejercicio','Periodo','Voucher','Numero_Cont','Item_Cont','Modulo','Vendedor','For_Pago','Glosa'],
        colModel:[
            {name:'Fecha_Emision', width:100, hidden: false},
            {name:'Fecha_Vencimiento', width:100, hidden: false}, 
            {name:'Tipo_Doc', width:80, hidden: false}, 
            {name:'Serie_Doc', width:80, hidden: false},
            {name:'Numero_Doc', width:80, hidden: false},
            {name:'Tipo_Anexo', width:80, hidden: false},
            {name:'Codigo_Anexo', width:80, hidden: false},
            {name:'Nombre_Anexo', width:250, hidden: false},
            {name:'Cuenta', width:80, hidden: false},
            {name:'Letra_Aceptada', width:100, hidden: false},
            {name:'Moneda', width:60, hidden: false},
            {name:'Importe_Mn', width:80, hidden: false, template: numberTemplate}, 
            {name:'Importe_Me', width:80, hidden: false, template: numberTemplate}, 
            {name:'Pago', width:60, hidden: false, template: numberTemplate},
            {name:'Tipo_Ref', width:60, hidden: false},
            {name:'Serie_Ref', width:60, hidden: false},
            {name:'Numero_Ref', width:60, hidden: false},
            {name:'Voucher_Ref', width:80, hidden: false},
            {name:'Banco', width:50, hidden: false},
            {name:'Situacion_Letra', width:100, hidden: false},
            {name:'Numero_Unico', width:100, hidden: false}, 
            {name:'Numero_Cta', width:80, hidden: false}, 
            {name:'Ejercicio', width:80, hidden: false},
            {name:'Periodo', width:80, hidden: false},
            {name:'Voucher', width:80, hidden: false},
            {name:'Numero_Cont', width:100, hidden: false},
            {name:'Item_Cont', width:100, hidden: false},
            {name:'Modulo', width:100, hidden: false},
            {name:'Vendedor', width:100, hidden: false},
            {name:'For_Pago', width:100, hidden: false},	
            {name:'Glosa', width:100, hidden: false},
        ],
        rowNum:50,
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        width: 1100,
        height: 400,
        rowList:[50,500,5000,50000],
        loadonce: true, 
        loadComplete:function(data){
            resize_jqgrid_porcentajes(jq_grid, 70 ,96);
        },
        onSelectRow: function (rowid, status, e) {
            var rowData = jq_grid.jqGrid("getRowData",rowid);
            console.log(rowData);
            detalle_letras_contable = [];
            console.log(detalle_letras_contable);
            $.ajax({
                url: '/situacion_letra/situacion',
                type: 'POST',
                data: {
                    codigo_situacion: rowData.Moneda == "S/"? jq_situacion_letra_mn.val(): jq_situacion_letra_me.val()
                }, success: function (data) {
                    const dato = data[0];
                    console.log(dato);
                    $.ajax({
                        url: '/letras/consultar_detalle_letras',
                        type: 'POST',
                        data: {
                            erp_numcxp: rowData.Numero_Cta
                        },success: function (list) {
                            console.log(list);
                            list.forEach(element => {
                                element.cuenta = rowData.Tipo_Anexo == "12"? element.tipo_origen == "I"? dato.Cuenta_Cliente: element.cuenta: element.tipo_origen == "I"? dato.Cuenta_Proveedor: element.cuenta
                                element.tipo_cambio = jq_tasa_cambio.val();
                                element.debe = element.dh == "D"? element.moneda == "S/"? element.importe_mn:element.importe_me:0;
                                element.haber = element.dh == "H"? element.moneda == "S/" ? element.importe_mn:element.importe_me:0;
                                element.mndebe = element.dh == "D"? element.moneda == "S/"? element.importe_mn:element.importe_me*jq_tasa_cambio.val():0;
                                element.mnhaber = element.dh == "H"? element.moneda == "S/" ? element.importe_mn:element.importe_me*jq_tasa_cambio.val():0;
                                element.medebe = element.dh == "D"? element.moneda == "S/"? element.importe_mn/jq_tasa_cambio.val():element.importe_me:0;
                                element.mehaber =  element.dh == "H"? element.moneda == "S/" ? element.importe_mn/jq_tasa_cambio.val():element.importe_me:0;
                                element.codigo_situacion = dato.Codigo;
                                detalle_letras_contable.push(element);
                            });
                        }
                    })
                }
            })

            
            console.log(detalle_letras_contable);
        }
    });
    jq_grid.jqGrid('filterToolbar',{stringResult: true, searchOnEnter : false, searchOperators : true});
};

function recargar_jgrid(){
    var jq_grid=jq_lista_letras_pendientes;

    jq_grid.jqGrid('setGridParam',{
        url: url_lista_situacion_letras, 
        type: "POST",
        postData:{
            fecha: getShortDate(fecha_trabajo),
            situacion: jq_estado.val()
        }
    }).trigger('reloadGrid', { fromServer: true, page: 1 });
};

function aprobar(){
    if (jq_estado.val() == "N") {
        $('<div></div>').appendTo('body')
        .html('<div><h6>¿Desea aceptar las letras seleccionadas?</h6></div>')
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
                    actualizar_estado("S");
                    $(this).dialog("close");
                },
                No: function() {
                    console.log("No");    
                    $(this).dialog("close");
                }
            },
            close: function(event, ui) {
                $(this).remove();
            }
        });
    }
    else{
        mostrarMensajeModal("La Letra Ya Ha Sido Contabilizada");
    }
};

function desaprobar(){
    if (jq_estado.val() == "S") {
        actualizar_estado("N");
    }
    else{
        mostrarMensajeModal("Las Letras Seleccionadas No Estan Aceptadas");
    }
    
}

function actualizar_estado(aprobacion) {
    var jq_grid = jq_lista_letras_pendientes;
    var gridArr = jq_grid.jqGrid("getGridParam", "selrow");
    var rowData = jq_grid.jqGrid("getRowData",gridArr);
    $.ajax({
        url: '/letras/aceptar_leras',
        type: 'POST',
        data: {
            aceptar_letras: aprobacion,
            erp_numcxp: rowData.Numero_Cta,

        },success: function (result) {
            if (result.estado == true && aprobacion == "S") {
                $('<div></div>').appendTo('body')
                .html('<div><h6>¿Desea contabilizar?</h6></div>')
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
                            contabilizar();
                            $(this).dialog("close");
                        },
                        No: function() {
                            console.log("No");    
                            $(this).dialog("close");
                        }
                    },
                    close: function(event, ui) {
                        $(this).remove();
                    }
                });
            }else{
                $('<div></div>').appendTo('body')
                .html('<div><h6>La Aceptacion de Letras Seleccionadas Han Sido Eliminadas.</h6></div>')
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
                            var jq_grid = jq_lista_letras_pendientes;
                            var gridArr = jq_grid.jqGrid("getGridParam", "selrow");
                            var rowData = jq_grid.jqGrid("getRowData",gridArr);
                            $.ajax({
                                url: '/letras/elminar_contabilizar',
                                type: 'POST',
                                data: {
                                    ejercicio: rowData.Ejercicio,
                                    periodo: rowData.Periodo,
                                    codigo_subvoucher: rowData.Voucher,
                                    numero_correlativo: rowData.Numero_Cont,
                                    correlativo_provision: rowData.Numero_Cta,
                                },success: function (result) {
                                    if(result.estado == true){
                                        recargar_jgrid();
                                        mensaje = "Letra Cntabilizada Eminada Satisfactoriamente."
                                        mostrarMensaje(mensaje,true,2000);
                                    }
                                    else
                                        mostrarMensaje("Código de Error:  "+result.codigo+" " +result.mensaje,false,2000);
                                }
                            });

                            $(this).dialog("close");
                        },
                        No: function() {
                            console.log("No");    
                            $(this).dialog("close");
                        }
                    },
                    close: function(event, ui) {
                        $(this).remove();
                    }
                });
            }
        }
    })
}

function contabilizar() {
    var jq_grid = jq_lista_letras_pendientes;
    var gridArr = jq_grid.jqGrid("getGridParam", "selrow");
    var rowData = jq_grid.jqGrid("getRowData",gridArr);
    var fecha_emision = getShortDate(fecha_trabajo);
    // console.log(rowData);
    // console.log(detalle_letras_contable);
    $.ajax({
        url: '/letras/contabilizar',
        type: 'POST',
        data: {
            ejercicio: fecha_trabajo.getFullYear(),
            periodo: getPeriodo(fecha_emision),
            fecha_emision: fecha_emision,
            tipo_registro: 'ST',
            codigo_subvoucher: '09',
            moneda: rowData.Moneda,
            tipo_cambio: jq_tipo_cambio.val(),
            tasa_cambio: jq_tasa_cambio.val(),
            tipo_ref: rowData.Tipo_Doc,
            serie_ref: rowData.Serie_Doc,
            numero_ref: rowData.Numero_Doc,
            fecha_referencia: fecha_emision,
            importe: rowData.Importe_Mn,
            base_con: rowData.Importe_Mn,
            glosa: rowData.Glosa,
            base_sin: 0,
            igv: 0,
            tipo_anexo: rowData.Tipo_Anexo,
            codigo_anexo: rowData.Codigo_Anexo,
            nombre_anexo: rowData.Nombre_Anexo,
            destino_operacion: '004',
            modulo_origen: 'LT',
            automatico: 'A',
            fecha_vencimiento: getDateFormat(rowData.Fecha_Vencimiento, "d/m/y","y-m-d","/","-"),
            codigo_detraccion: '00',
            fecha2: getDateFormat(rowData.Fecha_Emision, "d/m/y","y-m-d","/","-"),
            tipo2: rowData.Tipo_Ref,
            serie2: rowData.Serie_Ref,
            numero2: rowData.Numero_Ref,
            base_con_mn: rowData.Importe_Mn,
            base_con_me: rowData.Importe_Me,
            importe_mn: rowData.Importe_Mn,
            importe_me:  rowData.Importe_Me,
            base_sin_mn: 0,
            base_sin_me: 0,
            igv_mn: 0,
            igv_me: 0,
            forma_pago: rowData.For_Pago,
            correlativo_provision: rowData.Numero_Cta,

            filas_detalle: JSON.stringify(detalle_letras_contable)
            
        },success: function (result) {
            if(result.estado == true){
                recargar_jgrid();
                mensaje = "Contabilizado satisfactoriamente."
                mostrarMensaje(mensaje,true,2000);
            }
            else
                mostrarMensaje("Código de Error:  "+result.codigo+" " +result.mensaje,false,2000);
        }
    })
};

function cargar_configuraciones(){
    $.ajax({
        type: 'POST',
        url: url_configuraciones_tipo_cambio,
        success: function (lists){
            lists.forEach(list=>{
                jq_moneda.val(list.moneda_trabajo);
                jq_tipo_cambio.val(list.ctipo_cambio);
                rellenar_tasa_cambio(tasa_cambio, getShortDate(fecha_trabajo),jq_tipo_cambio.val());
            });
            cargar_configuracion4();
        }
    });
}

function cargar_configuracion4(){
    $.ajax({
        type: 'POST',
        url: '/letras/configuraciones4',
        success: function(lists){
            lists.forEach(element => {
                jq_situacion_letra_mn.val(element.erp_sitlet_mn);
                jq_situacion_letra_me.val(element.erp_sitlet_me);
            });
        }
    });
}

function permisos(){
    $.ajax({
        type: 'POST',
        url: url_configuracion_permisos,
        success: function (e){
            console.log(e);
            var data = e[0];
            if(data.modificar=='N'){
                $("#modificar_lista").prop("disabled",true);
            }
            if(data.eliminar=='N'){
                $("#eliminar_lista").prop("disabled",true);
            }
            if(data.guardar=='N'){
                $("#guardar").prop("disabled",true);
            }
        }
    });
}