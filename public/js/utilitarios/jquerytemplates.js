Globalize.culture("es-PE");

var numberTemplate = {
    align: 'right', 
    sorttype: 'number',
    editoptions:{
        size: 10, maxlengh: 8,
        dataEvents: [
            {
                type: 'keydown',
                fn: function(e) {
                    decimalKeyDown(e);
                }
            }
        ],
        dataInit: function(element) {
        }
    },
    searchoptions: { sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'nu', 'nn']},
    formatter: function (v) {
        decimales = configuraciones_globales.decimales_precio || 2;
        return formatCurrency(v,decimales);
    },
    unformat: function (v) {
        return Globalize.parseFloat(v);
    }
};

var cantidadTemplate = {
    align: 'right', 
    sorttype: 'number',
    editoptions:{
        size: 10, maxlengh: 8,
        dataEvents: [
            {
                type: 'keydown',
                fn: function(e) {
                    decimalKeyDown(e);
                }
            }
        ],
        dataInit: function(element) {
        }
    },
    searchoptions: { sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'nu', 'nn']},
    formatter: function (v) {
        decimales = configuraciones_globales.decimales_cant || 2;
        return formatCurrency(v,decimales);
    },
    unformat: function (v) {
        return Globalize.parseFloat(v);
    }
};

var currencyTemplate = {
    align: 'right', 
    sorttype: 'number',
    editoptions:{
        size: 10, maxlengh: 8,
        dataEvents: [
            {
                type: 'keydown',
                fn: function(e) {
                    decimalKeyDown(e);
                }
            }
        ],
        dataInit: function(element) {
        }
    },
    searchoptions: { sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'nu', 'nn']},
    formatter: function (v) {
        decimales = configuraciones_globales.decimales_cant || 2;
        return formatCurrency(v,decimales);
    },
    unformat: function (v) {
        return Globalize.parseFloat(v);
    }
};

var realTemplate = {
    align: 'right', 
    sorttype: 'float',
    searchoptions: { sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'nu', 'nn']},
};

var textTemplate = {
    sorttype: 'text',
    searchoptions: { sopt: ['cn','nc','eq','bw','bn','ew','en', 'nu', 'nn']},
};

var dateTemplate = {
    sorttype: 'date',
    align: 'center',
    cellsalign: 'center',
    formatter:'date',
    formatoptions: { srcformat: 'd/m/Y', newformat: 'd/m/Y'},
    searchoptions: { sopt: ['cn','nc','eq','bw','bn','ew','en', 'nu', 'nn']},
    editoptions:{size:12,
        dataInit:function(elem){
            $(elem).datepicker({
                dateFormat:'dd/mm/yy',
                changeYear: true,
                changeMonth: true,
                showButtonPanel: true,
                closeText: "Cerrar",
                currentText: "Hoy",
                monthNamesShort: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre" ],
                dayNamesMin : [ "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
            });
            if ($(elem).val().length === 0) {
                $(elem).datepicker("setDate", new Date(2021, 0, 1));
            }            
        }
    },
};

var dateTemplate2 = {
    sorttype: 'date',
    align: 'center',
    cellsalign: 'center',
    formatter:'date',
    formatoptions: { srcformat: 'd/m/Y', newformat: 'd/m/Y'},
    searchoptions: { sopt: ['cn','nc','eq','bw','bn','ew','en', 'nu', 'nn']},
    editoptions:{size:12,
        dataInit:function(elem){
            $(elem).datepicker({
                dateFormat:'dd/mm/yy',
                changeYear: true,
                changeMonth: true,
                showButtonPanel: true,
                closeText: "Cerrar",
                currentText: "Hoy",
                monthNamesShort: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre" ],
                dayNamesMin : [ "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
            });
            if ($(elem).val().length === 0) {
                $(elem).datepicker("setDate", new Date(2021, 0, 1));
            }            
        }
    },
};
var formatNumber = {
    separador: ",", // separador para los miles
    sepDecimal: '.', // separador para los decimales
    formatear:function (num,decimals){
    var ceros = Math.pow(10,decimals);
    num = (Math.round(num * ceros) / ceros).toFixed(decimals);
    num +='';
    var splitStr = num.split('.');
    var splitLeft = splitStr[0];
    var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
    var regx = /(\d+)(\d{3})/;
    while (regx.test(splitLeft)) {
    splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
    }
    return this.simbol + splitLeft +splitRight;
    },
    new:function(num, simbol,decimals){
    this.simbol = simbol ||'';
    return this.formatear(num,decimals);
    }
   }
function formatMask(number, decimals){
    // var ceros = Math.pow(10,decimals);
    return formatNumber.new(number, "",decimals)
};

function formatCurrency(number, decimals){
    var ceros = Math.pow(10,decimals);
    return (Math.round(number * ceros) / ceros).toFixed(decimals);
    // return formatNumber.new(number, "",decimals)
};
function formatCurrency2(number, decimals){
    var ceros = Math.pow(10,decimals);
    return (Math.round(number * ceros) / ceros).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

function maxID(rowids) {
    var max = 0;
    for(var i=0; i<rowids.length; i++){
      if(max <= eval(rowids[i])){
         max = eval(rowids[i]);
      }
   }
   return eval(max) + 1;
}

// var numberTemplate = {
//     align: 'right', 
//     sorttype: 'number',
//     formatter: "number", 
//     formatoptions: {
//         // decimalSeparator:",", 
//         thousandsSeparator: " ", 
//         decimalPlaces: 4, 
//         defaultValue: '0.0000'
//     },
//     editoptions: {
//         type: "number", 
//         step: "0.01",
//         min: "0.00",
//         max: "1000",
//         pattern: "((\d{0,8})+(\.\d{0,2})?|\.?\d{1,2})$",
//         title: "This should be a number with up to 2 decimal places."
//     }
// };
// var currencyTemplate = {
//     align: 'right', 
//     sorttype: 'number',
//     formatter: "currency", 
//     formatoptions: {
//         // decimalSeparator:".", 
//         thousandsSeparator: " ", 
//         decimalPlaces: 4, 
//         prefix: "S/ ", 
//         suffix: "", 
//         defaultValue: '0.00'
//     },
//     editoptions: {
//         type: "number", 
//         step: "0.01",
//         min: "0.00",
//         max: "1000",
//         pattern: "((\d{0,8})+(\.\d{0,2})?|\.?\d{1,2})$",
//         title: "This should be a number with up to 2 decimal places."
//     }
// };

function decimalKeyDown(e){
    
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) ||
        // Allow: Ctrl+C
        (e.keyCode == 67 && e.ctrlKey === true) ||
        // Allow: Ctrl+X
        (e.keyCode == 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
}
