function validar() {
    var nombre, ruc, numero, email;
    nombre = document.getElementById('nombre').value
    numero = document.getElementById('numero').value
    email = document.getElementById('email').value
    ruc = document.getElementById('ruc').value
    
    sinEspacios=/[a-zA-Z0-9]/;
    correos=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    soloRuc=/[1-2]0\d{9}/;
    soloNumeros = /[0-9]{7,11}/;
    caracterRaro="No se admiten caracteres raros";
    
    //var x = document.forms["form"]["email"].value;
    //if (nombre === "") {
    //console.log(document.getElementById("nombre").value)
    //alert("Campo obligatorio");
    //document.getElementById("nombre").focus();
    //return false;
    //}
    
    if (nombre==="" || email==="" || numero==="" || ruc==="") {
        alert("Todos los campos son requeridos");
        return false;
    } else if(!sinEspacios.test(nombre)) {
        alert(caracterRaro);
        document.getElementById("nombre").focus();
        return false;
    } else if(!soloRuc.test(ruc)) {
        alert("Ingrese un RUC Válido");
        document.getElementById("ruc").focus();
        return false;
    } else if(!soloNumeros.test(numero)) {
        alert("Ingrese un teléfono Válido");
        document.getElementById("numero").focus();
        return false; 
    } else if(!correos.test(email)) {
        alert("Ingrese un correo Válido");
        document.getElementById("email").focus();
        return false;
    } else {
        alert("Mensaje enviado satisfactoriamente!")
    }
}