const helpers = {};
const bcrypt = require ('bcryptjs');

helpers.encryptPassword= async (password)=>{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);
    return hash;
};

helpers.matchPassword=async(password,savedPassword)=>{
    try{
        var strexpresion=""
        const li_longitud = password.length; 
        var i;
        for (i = 0; i < password.length; i++) {
            const ls_letra = password.substring(i, i+1);
            const li_ascii = ls_letra.codePointAt(0);
            const li_ascii_new = li_ascii + ((li_longitud + 1 - (i + 1)) * (li_longitud + 1 - (i + 1))) - ((li_longitud + 2 - (i + 1)) * (li_longitud + 2 - (i + 1)));
            strexpresion = strexpresion + String.fromCharCode(li_ascii_new);
        }
        return strexpresion == savedPassword;

        // if(password=savedPassword){
        // return true;
        // }
        //return await bcrypt.compare(password,savedPassword);
    }catch(e){
        console.log(e);
    }

};

helpers.getTodayFormat=async(date, format)=>{
    try{

        // var today =  new Date(req.body.fecha_doc);
        var today = date;
        var dd = today.getDate();
        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();

        today = yyyy+'/'+(mm<10? '0'+mm : mm)+'/'+ (dd<10? '0'+dd : dd);

        return today;
    }catch(e){
        console.log(e);
    }
}

helpers.getRellenarCeros = async(data)=>{
    var number= data.number;
    var width= data.width;
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */ 
    var zero = "0"; /* String de cero */  
    
    if (width <= length) {
        if (number < 0) {
             return ("-" + numberOutput.toString()); 
        } else {
             return numberOutput.toString(); 
        }
    } else {
        if (number < 0) {
            return ("-" + (zero.repeat(width - length)) + numberOutput.toString()); 
        } else {
            return ((zero.repeat(width - length)) + numberOutput.toString()); 
        }
    }
}

helpers.getCalculosContables=async(data)=>{
    try{
        var calculos={
            SubTotal_Gravado_MN: 0,
            SubTotal_Gravado_ME: 0,
            SubTotal_No_Gravado_MN: 0,
            SubTotal_No_Gravado_ME: 0,
            Igv_MN: 0,
            Igv_ME: 0,
            Icbper_MN: 0,
            Icbper_ME: 0,
            Total_MN: 0,
            Total_ME: 0,
            Detraccion_MN: 0,
            Detraccion_ME: 0,
            Percepcion_MN: 0,
            Percepcion_ME: 0,
            Retencion_MN: 0,
            Retencion_ME: 0,
            Comision_MN: 0,
            Comision_ME: 0,
            SubTotal_Gravado: 0,
            SubTotal_No_Gravado: 0,
            Igv: 0,
            Icbper: 0,
            Total: 0,
            Detraccion: 0,
            Percepcion: 0,
            Retencion: 0,
            Comision: 0,
            Tc: 0,
        };
        
        if(data.moneda=="S/"){
            calculos.SubTotal_Gravado_MN = data.SubTotal_Gravado;
            calculos.SubTotal_Gravado_ME = data.SubTotal_Gravado / data.tc;
            calculos.SubTotal_No_Gravado_MN = data.SubTotal_No_Gravado;
            calculos.SubTotal_No_Gravado_ME = data.SubTotal_No_Gravado / data.tc;
            calculos.Igv_MN = data.Igv;
            calculos.Igv_ME = data.Igv / data.tc;
            calculos.Icbper_MN = data.Icbper;
            calculos.Icbper_ME = data.Icbper / data.tc;
            calculos.Total_MN = data.Total;
            calculos.Total_ME = data.Total / data.tc;
            calculos.Detraccion_MN = data.Detraccion;
            calculos.Detraccion_ME = data.Detraccion / data.tc;
            calculos.Percepcion_MN = data.Percepcion;
            calculos.Percepcion_ME = data.Percepcion / data.tc;
            calculos.Retencion_MN = data.Retencion;
            calculos.Retencion_ME = data.Retencion / data.tc;
            calculos.Comision_MN = data.Comision;
            calculos.Comision_ME = data.Comision / data.tc;
        }else{
            calculos.SubTotal_Gravado_MN = data.SubTotal_Gravado * data.tc;
            calculos.SubTotal_Gravado_ME = data.SubTotal_Gravado;
            calculos.SubTotal_No_Gravado_MN = data.SubTotal_No_Gravado * data.tc;
            calculos.SubTotal_No_Gravado_ME = data.SubTotal_No_Gravado;
            calculos.Igv_MN = data.Igv * data.tc;
            calculos.Igv_ME = data.Igv;
            calculos.Icbper_MN = data.Icbper * data.tc;
            calculos.Icbper_ME = data.Icbper;
            calculos.Total_MN = data.Total * data.tc;
            calculos.Total_ME = data.Total;
            calculos.Detraccion_MN = data.Detraccion * data.tc;
            calculos.Detraccion_ME = data.Detraccion;
            calculos.Percepcion_MN = data.Percepcion * data.tc;
            calculos.Percepcion_ME = data.Percepcion;
            calculos.Retencion_MN = data.Retencion * data.tc;
            calculos.Retencion_ME = data.Retencion;
            calculos.Comision_MN = data.Comision * data.tc;
            calculos.Comision_ME = data.Comision;
        }
        calculos.SubTotal_Gravado = data.SubTotal_Gravado;
        calculos.SubTotal_No_Gravado = data.SubTotal_No_Gravado;
        calculos.Igv = data.Igv;
        calculos.Icbper = data.Icbper;
        calculos.Total = data.Total;
        calculos.Detraccion = data.Detraccion;
        calculos.Percepcion = data.Percepcion;
        calculos.Retencion = data.Retencion;
        calculos.Comision = data.Comision;
        calculos.Tc = data.tc;

        return calculos;
    }catch (e){
        return e;
    }
}

helpers.getCalculosMnMe = async (data)=>{
    try{
        var calculos={
            Debe: 0,
            Debe_MN: 0,
            Debe_ME: 0,
            Haber: 0,
            Haber_MN: 0,
            Haber_ME: 0,
            Tc: 0,
        };
        var valor_soles = 0;
        var valor_dolares = 0;
        if(data.Moneda=="S/"){
            valor_soles = data.Monto_Soles || data.Monto;
            valor_dolares = data.Monto_Dolares || data.Monto / data.Tc;
            calculos.Debe = data.D_H=="D" ? valor_soles : 0;
            calculos.Debe_MN = data.D_H=="D" ? valor_soles : 0;
            calculos.Debe_ME = data.D_H=="D" ? valor_dolares : 0;
            calculos.Haber = data.D_H=="H" ? valor_soles : 0;
            calculos.Haber_MN = data.D_H=="H" ? valor_soles : 0;
            calculos.Haber_ME = data.D_H=="H" ? valor_dolares : 0;
            calculos.Tc = data.Tc;
        }else{
            valor_soles = data.Monto_Dolares || data.Monto;
            valor_dolares = data.Monto_Soles || data.Monto * data.Tc;
            calculos.Debe = data.D_H=="D" ? valor_dolares : 0;
            calculos.Debe_MN = data.D_H=="D" ? valor_soles : 0;
            calculos.Debe_ME = data.D_H=="D" ? valor_dolares : 0;
            calculos.Haber = data.D_H=="H" ? valor_dolares : 0;
            calculos.Haber_MN = data.D_H=="H" ? valor_soles : 0;
            calculos.Haber_ME = data.D_H=="H" ? valor_dolares : 0;
            calculos.Tc = data.Tc;
        }

        return calculos;
    }catch (e){
        return e;
    }
    
}
module.exports = helpers;