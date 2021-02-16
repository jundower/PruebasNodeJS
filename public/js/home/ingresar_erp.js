
$(document).ready(function() {
    $("#ingresar_erp").click(function(){
        $.ajax({
            type: 'POST',
            url: "/home/ingresar_erp",
            data:{
                codigo:$("#codigo_empresa").val(),
            },
            success: function (e){
                if(e=="0"){
                    $("#label_mensaje").text("No se encontró la empresa");
                }else{
                    // window.location.replace(e);
                    window.open(e)
                }
                
            }
        });
    })
    

    $("#countries").msDropdown();
});
