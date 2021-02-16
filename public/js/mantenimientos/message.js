
function mostrarMensaje(mensaje, status, tiempo){

    if(status){
        $("#container_mensaje_ajax").removeClass("d-none").fadeIn( 300 ).delay( tiempo ).slideUp( 400 );
        $("#container_mensaje_ajax").removeClass("alert-success");
        $("#container_mensaje_ajax").removeClass("alert-danger");
        $("#container_mensaje_ajax").addClass("alert-success");
        $("#mensaje_ajax").html(mensaje);
    }else{
        $("#container_mensaje_ajax").removeClass("d-none").fadeIn( 300 ).delay( tiempo ).slideUp( 400 );
        $("#container_mensaje_ajax").removeClass("alert-success");
        $("#container_mensaje_ajax").removeClass("alert-danger");
        $("#container_mensaje_ajax").addClass("alert-danger");
        $("#mensaje_ajax").html(mensaje);
    }
}


function mostrarMensajeModal(titulo, mensaje){
    $("#modal_message_title").text(titulo);
    $("#modal_message_body").text(mensaje);
    $("#modal_message").modal("show");
}
