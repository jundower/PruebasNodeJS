function getEjercicio(fecha){
    return fecha.getFullYear()+'';
}
function getPeriodo(fecha){
    var today =  new Date(fecha);

    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    var periodo="";
    switch (mm){
        case 1:
            periodo="ENE-";
            break;
            
        case 2:
            periodo="FEB-";
            break;
            
        case 3:
            periodo="MAR-";
            break;
            
        case 4:
            periodo="ABR-";
            break;
            
        case 5:
            periodo="MAY-";
            break;
            
        case 6:
            periodo="JUN-";
            break;
            
        case 7:
            periodo="JUL-";
            break;
            
        case 8:
            periodo="AGO-";
            break;
            
        case 9:
            periodo="SET-";
            break;
            
        case 10:
            periodo="OCT-";
            break;
            
        case 11:
            periodo="NOV-";
            break;
            
        case 12:
            periodo="DIC-";
            break;
    }
    return periodo+yyyy;

}

function getShortDate(date){
    var d = date;
    
    var month = d.getMonth()+1;
    var day = d.getDate();

    var output = d.getFullYear() + '-' +
        ((''+month).length<2 ? '0' : '') + month + '-' +
        ((''+day).length<2 ? '0' : '') + day;
    return output;
}

function getShortDateFormat(date,format){
    var d = date;
    
    var month = d.getMonth()+1;
    var day = d.getDate();

    var output = d.getFullYear() + '-' +
        ((''+month).length<2 ? '0' : '') + month + '-' +
        ((''+day).length<2 ? '0' : '') + day;
    switch (format){
        case "dd-mm-yyyy":
            output =((''+day).length<2 ? '0' : '') + day + '/' + ((''+month).length<2 ? '0' : '') + month + '/' + d.getFullYear();
        break;
        case "mm/dd/yyyy":
            output = ((''+month).length<2 ? '0' : '') + month + '/' + ((''+day).length<2 ? '0' : '') + day + '/' + d.getFullYear();
        break;
    }
    return output;
}

function sumar_dias(date, dias) {
    //la fecha
    var d = new Date(date);

    //dias a sumar
    var dias = parseInt(dias);
    
    //nueva fecha sumada
    d.setDate(d.getDate() + dias + 1);

    //formato de salida para la fecha
    
    var month = d.getMonth()+1;
    var day = d.getDate();

    var output = d.getFullYear() + '-' +
        ((''+month).length<2 ? '0' : '') + month + '-' +
        ((''+day).length<2 ? '0' : '') + day;
    
    return output;
}

function restar_fechas(fecha_1, fecha_2) {
    
    var d_1 = new Date(fecha_1);
    var d_2= new Date(fecha_2);
    
    var dif = d_1 - d_2;
    var output = Math.floor(dif / (1000 * 60 * 60 * 24));
    return output;
}

function convertToDate(date, formato, separador){
    var array = date.split(separador);
    var new_formato = formato.split(separador);
    var mm,dd,yyyy;
    for(var i=0 ; i<new_formato.length;i++){
        if(new_formato[i]=="d") dd = array[i];
        if(new_formato[i]=="m") mm = array[i];
        if(new_formato[i]=="y") yyyy = array[i];
    }

    return new Date(yyyy,mm - 1,dd);
}

function getDateFormat(date,formato, newFormat,separador, newSeparator){
    var array = date.split(separador);
    var split_formato = formato.split(separador);
    var mm,dd,yyyy;
    for(var i=0 ; i<split_formato.length;i++){
        if(split_formato[i]=="d") dd = array[i];
        if(split_formato[i]=="m") mm = array[i];
        if(split_formato[i]=="y") yyyy = array[i];
    }
    var split_newFormat = newFormat.split(newSeparator);
    var new_string=""
    for(var i=0 ; i<split_newFormat.length;i++){
        if(split_newFormat[i]=="d") new_string += dd;
        if(split_newFormat[i]=="m") new_string += mm;
        if(split_newFormat[i]=="y") new_string += yyyy;
        new_string+=newSeparator;
    }

    return new_string.slice(0,-1);
}

function getFirstDate(date){

    var d = date;
    
    var month = d.getMonth()+1;

    var output = d.getFullYear() + '-' +
        ((''+month).length<2 ? '0' : '') + month + '-' +
        ('0'    ) + 1;
    return output;
}

function getLastDate(date){
    var d = date;
    
    var month = d.getMonth()+1;
    var day = d.getDate();
    
    var output = d.getFullYear() + '-' +
        ((''+month).length<2 ? '0' : '') + month + '-' +
        ((''+day).length<2 ? '0' : '') + 1;
    
    var newDate = new Date(d.getFullYear(),month,1);
    var lstDate = new Date(newDate - 1);

    month = lstDate.getMonth()+1;
    day = lstDate.getDate();
    output = lstDate.getFullYear() + '-' +
        ((''+month).length<2 ? '0' : '') + month + '-' +
        ((''+day).length<2 ? '0' : '') + day;
        
    return output;
    
}   

function getHora(date){
    var hora = date.getHours();
    var output =  date.toLocaleTimeString()
      + (hora>=01 && hora<12 ? ' AM' : ' PM');

    return output;
  }
  