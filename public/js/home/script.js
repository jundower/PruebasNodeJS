$(document).ready(function(){
    $('#btnSend').click(function(){
        var errores = '';

        // Validado Nombre ===============================
        if( $('#names').val() === '' ){
            errores += '<p>Escriba un nombre</p>';
            $('#names').css("border-bottom-color", "#F14B4B")
        } else{
            $('#names').css("border-bottom-color", "#d1d1d1")
        }
        
        // Validado Correo ===============================
        if( $('#email').val() === '' || $('#email').val().indexOf('@', 0) == -1 || $("#email").val().indexOf('.', 0) == -1 ){
            errores += '<p>Ingrese un correo valido</p>';
            $('#email').css("border-bottom-color", "#F14B4B")
        } else{
            $('#email').css("border-bottom-color", "#d1d1d1")
        }
        
        // Validado Mensaje ==============================
        if( $('#mensaje').val() === '' ){
            errores += '<p>Escriba un mensaje</p>';
            $('#mensaje').css("border-bottom-color", "#F14B4B")
        } else{
            $('#mensaje').css("border-bottom-color", "#d1d1d1")
        }
        
        
        // ENVIANDO MENSAJE ==============================
        if( errores === ''  && errores === false){
            var mensajeModal = '<div class="modal_wrap">'+
                                    '<div class="mensaje_modal">'+
                                        '<h3>Errores encontrados</h3>'+
                                        errores+
                                        '<span id="btnClose">Cerrar</span>'+
                                    '</div>'+
                                '</div>'

            $('body').append(mensajeModal);
        }


        // CERRANDO MODAL ==============================
        $('#btnClose').click(function(){
            $('.modal_wrap').remove();
        });
    });

});
function validator() {
    var names, asunto, empresa, ruc, phone, email;
    names = document.getElementById('names').value;
    asunto = document.getElementById("asunto").value;
    empresa = document.getElementById("empresa").value;
    ruc = document.getElementById("ruc").value;
    phone = document.getElementById("phone").value;
    email = document.getElementById("email").value;
    
    if (name === "" || asunto === "" || empresa === "" || ruc === "" || phone === "" email === "") {
        alert("El campo nombre está vació");
        return false;
    }
}
