

var url_motivos_series='/talonarios/motivos_series';

var numero_letras = 'numero_letras';
var automatico = 'automatico';
var manual = 'manual';
var serie_letra = 'serie_letra';
var serie_letra_manual = 'serie_letra_manual';
var dias_letras = 'dias_letras';
var numero_letras = 'numero_letras';

var grid_lista_facturas='lista-facturas';
var grid_lista_letras = 'lista-letras';
var modal_creacion_letras = "creacion_letras";

var jq_numero_letras;
var jq_automatico;
var jq_manual;
var jq_serie_letra;
var jq_serie_letra_manual;
var jq_dias_letras;
var jq_numero_letras;

var jq_grid_lista_facturas;
var jq_grid_lista_letras;
var jq_modal_creacion_letras;


var rowid_selected_letras;
var row_editing_detalle_letras;
var col_editing_detalle_letras;

$(document).ready(function() {

    jq_numero_letras = $("#"+numero_letras);
    jq_automatico = $("#"+automatico);
    jq_manual = $("#"+manual);
    jq_serie_letra = $("#"+serie_letra);
    jq_serie_letra_manual = $("#"+serie_letra_manual);
    jq_dias_letras = $("#"+dias_letras);
    jq_numero_letras = $("#"+numero_letras);

    jq_grid_lista_facturas=$("#"+grid_lista_facturas);
    jq_grid_lista_letras = $("#"+grid_lista_letras);
    jq_modal_creacion_letras = $("#"+modal_creacion_letras);

    nueva_letra();
    rellenar_serie_letra();
    lista_facturas();
    lista_letras();

    
    jq_automatico.click(function() {
        rellenar_serie_letra();
    });
    jq_manual.click(function() {
        rellenar_serie_letra();
    });
    jq_numero_letras.on('keyup', function (e) {
        var keycode = e.keyCode || e.which;
          if (keycode == 13) {
            generar_letra()
          }
    });
    jq_dias_letras.on('keyup', function (e) {
        var keycode = e.keyCode || e.which;
          if (keycode == 13) {
            generar_letra()
          }
    });
    // jq_modal_documentos_pendientes_contable = $("#"+modal_documentos_pendientes_contable)

    $('#finalizar').click(async function (){
        var jq_grid=jq_grid_lista_facturas;
        var FImporte_Mn = jq_grid.jqGrid('getCol', 'Importe_Mn', false, 'sum');
        var FImporte_Me = jq_grid.jqGrid('getCol', 'Importe_Me', false, 'sum');

        var jq_grid=jq_grid_lista_letras;
        var LImporte_Mn = jq_grid.jqGrid('getCol', 'Importe_Mn', false, 'sum');
        var LImporte_Me = jq_grid.jqGrid('getCol', 'Importe_Me', false, 'sum');

        if ( jq_moneda.val() == "S/"?  FImporte_Mn.toFixed(2) == LImporte_Mn.toFixed(2): FImporte_Me.toFixed(2) == LImporte_Me.toFixed(2)) {
            enviar_datos_letra();
            $("#creacion_letras").modal("hide");
        }else{
            mostrarMensajeModal('Los montos de las letras en soles no coicinden con la suma de las facturas');
        }
    });

    jq_modal_creacion_letras.on('shown.bs.modal', function () {
        resize_jqgrid_porcentajes(jq_grid_lista_facturas,30,87);
        resize_jqgrid_porcentajes(jq_grid_lista_letras,30,87);
    });
})

function nueva_letra() {
    jq_numero_letras.val(1);
    jq_dias_letras.val("");
    jq_automatico.prop("checked", true);
}

function lista_facturas() {
    var jq_grid = jq_grid_lista_facturas;
    var fila_vacia = {Tipo:''};

    jq_grid.jqGrid({
        datatype: "local",
        height: 120,
        colNames:['Tipo','Serie','Numero','Fecha','Moneda','Tc','Importe_Mn','Importe_Me','Comision','Cuenta','Dh','Signo',
        'Fecha_Vencimiento','Vendedor','For_Pago','Tipo_Referencia','Serie_Referencia',
        'Numero_Referencia','Fecha_Referencia','Glosa','Subvoucher'],
        colModel:[
            {name:'Tipo', width:100, hidden:false, editable:true},
            {name:'Serie', width:100, hidden:false, editable:true},
            {name:'Numero', width:100, hidden:false, editable:true},
            {name:'Fecha', width:100, hidden:false, editable:true},
            {name:'Moneda', width:100, hidden:false, editable:true},
            {name:'Tc', width:100, hidden:false, editable:true},
            {name:'Importe_Mn', width:100, hidden:false, editable:true, template: numberTemplate},
            {name:'Importe_Me', width:100, hidden:false, editable:true, template: numberTemplate},
            {name:'Comision', width:100, hidden:false, editable:true},
            {name:'Cuenta', width:100, hidden:false, editable:true},
            {name:'Dh', width:100, hidden:false, editable:true},
            {name:'Signo', width:100, hidden:false, editable:true},
            {name:'Fecha_Vencimiento', width:100, hidden:false, editable:true},
            {name:'Vendedor', width:100, hidden:false, editable:true},
            {name:'For_Pago', width:100, hidden:false, editable:true},
            {name:'Tipo_Referencia', width:100, hidden:false, editable:true},
            {name:'Serie_Referencia', width:100, hidden:false, editable:true},
            {name:'Numero_Referencia', width:100, hidden:false, editable:true},
            {name:'Fecha_Referencia', width:100, hidden:false, editable:true},
            {name:'Glosa', width:100, hidden:false, editable:true},
            {name:'Subvoucher', width:100, hidden:true, editable:true},
        ],
        loadonce: true, 
        caption: "Listado Facturas",
        footerrow : true,
        loadComplete:function(data){
            jq_grid.jqGrid('addRowData',undefined,fila_vacia); 
            //calcular_footer_facturas();   
        }
    });
    
}

function calcular_footer(jq_grid){
    //var jq_grid=jq_grid_lista_facturas;
    var colSum = jq_grid.jqGrid('getCol', 'Importe_Mn', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Importe_Mn': colSum });
    colSum = jq_grid.jqGrid('getCol', 'Importe_Me', false, 'sum');
    jq_grid.jqGrid('footerData', 'set', { 'Importe_Me': colSum });
}


function lista_letras() {

    var jq_grid = jq_grid_lista_letras;
    var fila_vacia = {Numero:'00'};

    jq_grid.jqGrid({
        datatype: "local",
        height: 120,
        colNames:['Numero','Fecha_Emision','Dias','Fecha_Vencimiento','Importe_Mn','Importe_Me','Comision'
        ,'Vendedor','For_Pago','Tipo_Referencia','Serie_Referencia','Numero_Referencia','Fecha_Referencia','A/M'],
        colModel:[
            {name:'Numero', width:100, hidden:false, editable:false},
            {name:'Fecha_Emision', width:100, hidden:false, editable:false},
            {name:'Dias', width:100, hidden:false, editable:true,  editoptions: {
                dataEvents: [
                   {  type: 'keydown',
                      fn: function(e) {
                        var row = jq_grid.getRowData(rowid_selected_letras);
                        var fecha_actual =  getDateFormat(row.Fecha_Emision,"d/m/y","y-m-d","/","-");
                        var dia_etitado = this.value;
                        if (dia_etitado == "") {
                            dia_etitado = 0;
                        }
                        jq_grid.jqGrid('setCell',rowid_selected_letras,"Fecha_Vencimiento",
                        getDateFormat(sumar_dias(fecha_actual,dia_etitado),"y-m-d","d/m/y","-","/"));
                      }
                   }
                ]}
            },
            {name:'Fecha_Vencimiento', width:100, hidden:false, editable:true, template: dateTemplate2},
            {name:'Importe_Mn', width:100, hidden:false, editable: true , template: numberTemplate, editoptions: {
                dataEvents: [
                    {   type: 'keydown',
                        fn: function(e){
                            recalcular_importe();
                            calcular_footer(jq_grid_lista_letras);

                        }
                    }
                ]
            }},
            {name:'Importe_Me', width:100, hidden:false, editable:true, template: numberTemplate, editoptions: {
                dataEvents: [
                    {   type: 'keydown',
                        fn: function(e){
                            recalcular_importe();
                            calcular_footer(jq_grid_lista_letras);
                        }
                    }
                ]
            }},
            {name:'Comision', width:100, hidden:false, editable:false},
            {name:'Vendedor', width:100, hidden:false, editable:false},
            {name:'For_Pago', width:100, hidden:false, editable:false},
            {name:'Tipo_Referencia', width:100, hidden:false, editable:false},
            {name:'Serie_Referencia', width:100, hidden:false, editable:false},
            {name:'Numero_Referencia', width:100, hidden:false, editable:false},
            {name:'Fecha_Referencia', width:100, hidden:false, editable:false},
            {name:'A_M', width:100, hidden:false, editable:false},
        ],
        loadonce: true, 
        cellEdit: true,
        caption: "Listado Letras",
        footerrow : true,
        loadComplete:function(data){
            jq_grid.jqGrid('addRowData',undefined,fila_vacia);
            
            
        },
        onSelectCell : function(rowid, cellname, value, iRow, iCol) { 
            //selected_cell_detalle_contable = iCol; 
            //console.log(rowid);
            rowid_selected_letras = rowid;
        },
        onCellSelect : function(rowid, iCol, cellcontent, e) { 
            var iRow = jq_grid.jqGrid('getInd',rowid)
            var cm = jq_grid.jqGrid("getGridParam", "colModel");

            if((cm[iCol].name =="Importe_Mn" && jq_moneda.val() == "S/") || cm[iCol].name =="Dias" || cm[iCol].name =="Fecha_Vencimiento" || (cm[iCol].name =="Importe_Me" && jq_moneda.val() == "$")){
                jq_grid.resetSelection();
                row_editing_detalle_letras = iRow;
                col_editing_detalle_letras = iCol;
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: true,
                });
            }else{
                jq_grid.jqGrid('saveCell',row_editing_detalle_letras,col_editing_detalle_letras);
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: false,
                });
            }

            rowid_selected_letras=rowid;
        }
    })
}

$(window).bind('resize', function() {
    resize_jqgrid_porcentajes(jq_grid_lista_facturas,30,87);
    resize_jqgrid_porcentajes(jq_grid_lista_letras,30,87);
});

function recalcular_importe() {
    var jq_grid=jq_grid_lista_letras;

    jq_grid.jqGrid('setRowData', rowid_selected_letras, {A_M : "M"});
    var dataIDs = jq_grid.getDataIDs();
    for(i = 0; i < dataIDs.length; i++)
    {
        var rowid = dataIDs[i];
        var rowdata = jq_grid.getRowData(rowid);
        if (jq_moneda.val() == "S/") {
            jq_grid.jqGrid('setRowData', rowid, {
                Importe_Me : rowdata.Importe_Mn / Number(jq_tasa_cambio.val())
            });
        }else{
            jq_grid.jqGrid('setRowData', rowid, {
                Importe_Mn : rowdata.Importe_Me * Number(jq_tasa_cambio.val())
            });
        }
    } 
}

async function rellenar_serie_letra() {
    if (jq_automatico.is(':checked')) {
        jq_serie_letra.prop("hidden", false);
        jq_serie_letra_manual.prop("hidden", true);

        await $.ajax({
            type: 'POST',
            url: url_motivos_series,
            data: {
                tipo_documento: 'LT'
            },success: function (lists) {
                jq_serie_letra.html('');
                lists.forEach(list=>{
                    jq_serie_letra.append('<option value="'+list.Codigo+'" >'+list.Nombre + '</option>');
                });
            }
        })
    }else{
        jq_serie_letra.prop("hidden", true);
        jq_serie_letra_manual.prop("hidden", false);
    }

    generar_numeros();
}

function generar_letra(){
    
    var jq_grid=jq_grid_lista_facturas;
    var TImporte_Mn = jq_grid.jqGrid('getCol', 'Importe_Mn', false, 'sum');
    var TImporte_Me = jq_grid.jqGrid('getCol', 'Importe_Me', false, 'sum');
    var fecha = jq_fecha_canje.val();
    var tipo_letra = jq_tipo_letra.val();
    var cantidad_letras = jq_numero_letras.val() == ''? 1:jq_numero_letras.val();
    var TC = jq_tasa_cambio.val(); 
    var intdias = 0;

    if (jq_dias_letras.val() == 0 || jq_dias_letras.val=="") {
        var dias = 30;
    }else{
        var dias = Number(jq_dias_letras.val());
    }
    var correlativo_letra = $("#correlativo_letra").val();
    var caracteres = correlativo_letra.length
    var numero = correlativo_letra.replace(/^0+/, '');


    var filas_seleccionadas=[];
    var dataIDs = jq_grid.getDataIDs(); 
    var dataIDs_Listado_Letras = jq_grid_lista_letras.getDataIDs(); 
    var rowId = dataIDs_Listado_Letras[0];

    for(var i=0;i<dataIDs.length;i++){
        var row = jq_grid.getRowData(dataIDs[i]);
        filas_seleccionadas.push(row);
    }

    var newData = jq_grid_lista_letras.getRowData(rowId);
    console.log(newData);

    for (let i = 0; i < cantidad_letras; i++) {
        const element = filas_seleccionadas[0];

        var numer = Number(numero) + i
        var intdias = intdias + dias;

        newData.Numero = PadLeft(numer,caracteres);
        newData.Fecha_Emision = getDateFormat(fecha,"y-m-d","d/m/y","-","/");
        newData.Dias = intdias;
        newData.Fecha_Vencimiento = getDateFormat(sumar_dias(fecha,intdias),"y-m-d","d/m/y","-","/");
        newData.Importe_Mn = jq_moneda.val() == "S/"? TImporte_Mn/cantidad_letras: (TImporte_Me/cantidad_letras)*TC;
        newData.Importe_Me = jq_moneda.val() == "S/"? (TImporte_Mn/cantidad_letras)/TC:TImporte_Me/cantidad_letras;
        newData.Vendedor = element.Vendedor;
        newData.For_Pago = element.For_Pago;
        newData.Tipo_Referencia = element.Tipo;
        newData.Serie_Referencia = element.Serie;
        newData.Numero_Referencia = element.Numero;
        newData.Fecha_Referencia = element.Fecha_Referencia;
        newData.A_M = "A";

        jq_grid_lista_letras.jqGrid('addRowData',undefined,newData);
    }

    var IdEliminarfila = jq_grid_lista_letras.getDataIDs(); 
    for(var i=0;i<IdEliminarfila.length;i++){
        var row = jq_grid_lista_letras.getRowData(IdEliminarfila[i]);
        if(row.Numero=="00") jq_grid_lista_letras.delRowData(IdEliminarfila[i]);
    }

    for(var i=0;i<dataIDs_Listado_Letras.length;i++){
        jq_grid_lista_letras.delRowData(dataIDs_Listado_Letras[i]);
    }

    calcular_footer(jq_grid_lista_letras);
}

function generar_numeros() {
    $.ajax({
        type: 'POST',
        url: '/talonarios/motivos_serie_correlativo',
        data: {
            tipo_documento: 'LT',
            serie_documento: jq_serie_letra.val()
        },success: function (data) {
            $("#correlativo_letra").val(data)
        }
    });
};

function PadLeft(value, length) {
    return (value.toString().length < length) ? PadLeft("0" + value, length) : value;
}

function enviar_datos_letra() {
    var SelectIdDetalle=jq_grid_detalle_letras.getDataIDs(); 

    for(var i=0;i<SelectIdDetalle.length;i++){
        jq_grid_detalle_letras.delRowData(SelectIdDetalle[i]);
    }

    var jq_grid=jq_grid_lista_facturas;
    var TImporte_Mn = jq_grid.jqGrid('getCol', 'Importe_Mn', false, 'sum');
    var TImporte_Me = jq_grid.jqGrid('getCol', 'Importe_Me', false, 'sum');

    var SelectIdFacturas = jq_grid.getDataIDs();
    var rowDataFacturas = jq_grid.getRowData()
    var SelectIdFilas = jq_grid_lista_letras.getDataIDs(); 
    var rowData = jq_grid_lista_letras.getRowData()

    jq_tipo_documento_referencia.val(rowData[0].Tipo_Referencia);
    jq_serie_referencia.val(rowData[0].Serie_Referencia);
    jq_numero_referencia.val(rowData[0].Numero_Referencia);
    jq_tipo_documento.val("LT");
    jq_serie.val(jq_serie_letra.val());
    jq_numero.val(rowData[0].Numero);
    jq_fecha_vencimiento.val(getDateFormat(rowData[0].Fecha_Vencimiento,"d/m/y","y-m-d","/","-"));

    if (jq_moneda.val() == 'S/') {
        jq_importe.val(TImporte_Mn);
    }else{
        jq_importe.val(TImporte_Me);
    }

    jq_fecha_vencimiento.trigger("change");

    // var dataIDs_detalle_letras = jq_grid_detalle_letras.getDataIDs(); 
    // var rowId = dataIDs_detalle_letras[0];

    var newData = deepCopy(fila_vacia_grid_detalle_letras);

    for (let i = 0; i < SelectIdFilas.length; i++) {
        const element = rowData[i]; 
        const facturas = rowDataFacturas[0];

        newData.Cuenta = facturas.Cuenta;
        newData.Tipo_Anexo = jq_tipo_anexo.val();
        newData.Codigo_Anexo = jq_codigo_anexo.val();
        newData.Nombre_Anexo = jq_nombre_anexo.val();
        newData.Tipo_Doc = jq_tipo_documento.val();
        newData.Serie_Doc = jq_serie.val();
        newData.Numero_Doc = element.Numero;
        newData.Fecha_Emision = element.Fecha_Emision;
        newData.Fecha_Vencimiento = element.Fecha_Vencimiento;
        newData.Moneda = jq_moneda.val();
        newData.Tc = jq_tasa_cambio.val();
        newData.Importe_Mn = element.Importe_Mn;
        newData.Importe_Me = element.Importe_Me;
        newData.Dh = 'D';
        newData.Voucher_Ref = jq_subvoucher.val();
        newData.Tipo_Origen = 'I';
        newData.Tipo_Ref = jq_tipo_documento_referencia.val();
        newData.Serie_Ref = jq_serie_referencia.val();
        newData.Numero_Ref = jq_numero_referencia.val();
        newData.Fecha_Ref = facturas.Fecha_Referencia;
        newData.Vendedor = facturas.Vendedor;
        newData.For_Pago = facturas.For_Pago;

        jq_grid_detalle_letras.jqGrid('addRowData',undefined,newData);
    }

    for (let i = 0; i < SelectIdFacturas.length; i++) {
        //const element = rowData[i]; 
        const facturas = rowDataFacturas[i];
        console.log(facturas);
        newData.Cuenta = facturas.Cuenta;
        newData.Tipo_Anexo = jq_tipo_anexo.val();
        newData.Codigo_Anexo = jq_codigo_anexo.val();
        newData.Nombre_Anexo = jq_nombre_anexo.val();
        newData.Tipo_Doc = facturas.Tipo;
        newData.Serie_Doc = facturas.Serie;
        newData.Numero_Doc = facturas.Numero;
        newData.Fecha_Emision = facturas.Fecha;
        newData.Fecha_Vencimiento = facturas.Fecha_Vencimiento;
        newData.Moneda = jq_moneda.val();
        newData.Tc = jq_tasa_cambio.val();
        newData.Importe_Mn = facturas.Importe_Mn;
        newData.Importe_Me = facturas.Importe_Me;
        newData.Dh = facturas.Dh == 'D'?'H':'D';
        newData.Voucher_Ref = facturas.Subvoucher;
        newData.Tipo_Origen = 'F';
        newData.Tipo_Ref = facturas.Tipo_Referencia;
        newData.Serie_Ref = facturas.Serie_Referencia;
        newData.Numero_Ref = facturas.Numero_Referencia;
        newData.Feche_Ref = facturas.Fecha_Referencia;
        newData.Vendedor = facturas.Vendedor;
        newData.For_Pago = facturas.For_Pago;

        jq_grid_detalle_letras.jqGrid('addRowData',undefined,newData);

        jq_glosa.val(facturas.Glosa);
    }
}