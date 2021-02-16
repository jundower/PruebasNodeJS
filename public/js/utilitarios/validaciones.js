// Restricts input for each element in the set of matched elements to the given inputFilter.
// (function($) {
//     $.fn.inputFilter = function(inputFilter) {
//       return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
//         if (inputFilter(this.value)) {
//           this.oldValue = this.value;
//           this.oldSelectionStart = this.selectionStart;
//           this.oldSelectionEnd = this.selectionEnd;
//         } else if (this.hasOwnProperty("oldValue")) {
//           this.value = this.oldValue;
//           this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
//         } else {
//           this.value = "";
//         }
//       });
//     };
// }(jQuery));
  

// // Install input filters.
// $(".intTextBox").inputFilter(function(value) {
//   return /^-?\d*$/.test(value);
// });
// $(".uintTextBox").inputFilter(function(value) {
//   return /^\d*$/.test(value);
// });
// $(".intLimitTextBox").inputFilter(function(value) {
//   return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 500);
// });
// $(".floatTextBox").inputFilter(function(value) {
//   return /^-?\d*[.,]?\d*$/.test(value);
// });
// $(".currencyTextBox").inputFilter(function(value) {
//   return /^-?\d*[.,]?\d{0,2}$/.test(value);
// });
// $(".latinTextBox").inputFilter(function(value) {
//   return /^[a-z]*$/i.test(value);
// });
// $(".hexTextBox").inputFilter(function(value) {
//   return /^[0-9a-f]*$/i.test(value);
// });
  
  
function isEmptyOrWhiteSpaces(string){
  //return true si tiene espacios en blanco o si es nulo o si es vacío
  return string == null || string.trim()==='';
}

function isEmptyOrUndefinied(string){
  //return true si tiene espacios en blanco o si es nulo o si es vacío
  return string == undefined || string.trim()==='';
}

function isNullOrUndefinied(data){
  return data == null || data === undefined;
}

function maxLengthCheck(object) {
  //Para los input type Number
  //De esta manera se controla el tamaño del campo
  if (object.value.length > object.maxLength)
    object.value = object.value.slice(0, object.maxLength)
}
  
function isNumeric (evt) {
  var theEvent = evt || window.event;
  var key = theEvent.keyCode || theEvent.which;
  key = String.fromCharCode (key);
  var regex = /[0-9]|\./;
  if ( !regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
}