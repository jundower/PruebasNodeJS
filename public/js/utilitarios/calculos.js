//La base imponible es el monto respecto del cual se aplicará la tasa del impuesto, está constituida por:
//a) El valor de la primera venta realizada en el territorio nacional.
//b) El valor en Aduana determinado con arreglo a la legislación pertinente, más los tributos que afecten la importación con excepción del IVAP.
//Fuente: SUNAT
//Los descuentos solo se aplican por linea, en el subtotal, antes de aplicarse el IGV
//Si el descuento se aplicase al total, entonces no debería tocar el igv 
//Ejemplo: SubTotal 100, IGV: 18, Total: 118
//Descuento al SubTotal de 10: SubTotal: 100, NuevoSubTotal: 90, IGV: 16.2, Total: 106.2
//Descuento al Total de 10: SubTotal: 100, IGV: 18, Total: 118, Descuento 10, Nuevo Total: 108 (IGV: 18 y SubTotal 90)
//El IGV siempre se hace sobre la base imponible
//Base Calculada: es el Unit sin igv * cantidad
//Base Imponible: es el Unit sin igv * cantidad - descuentos
//IGV: Base Imponible * IGV%
//Total: Base Imponible + IGV

function calcular_totales_facturacion(agregar_igv, cantidad, precio_unitario, igv_articulo, icbper_articulo, descuento1, descuento2, descuento3, descuento4, extranjero){
    isNaN(icbper_articulo) ? icbper_articulo = 0 : "";
    isNaN(descuento1) ? descuento1 = 0 : "";
    isNaN(descuento2) ? descuento2 = 0 : "";
    isNaN(descuento3) ? descuento3 = 0 : "";
    isNaN(descuento4) ? descuento4 = 0 : "";
    if (extranjero) igv_articulo = 0;
    //El descuento se aplicará al subTotal
    //El descuento_cabecera será el primero en hacer efecto
    var calcular_totales={
        Precio_Sin_Igv: 0,
        SubTotal_Sin_Descuentos: 0,
        Descuentos_SubTotal: 0,
        SubTotal_Con_Descuentos: 0,
        Igv: 0,
        ICBPER: 0,
        Total: 0
    };

    var Unit=0,SubTotal_Sin_Descuentos=0,descuento, Descuentos_SubTotal=0,SubTotal_Con_Descuentos=0,Igv=0,ICBPER=0,Total=0;

    // descuento_subtotal_porcentaje = descuento_subtotal_porcentaje / 100;
    // descuento_total_porcentaje = descuento_total_porcentaje / 100;
    descuento1 = descuento1 / 100;
    descuento2 = descuento2 / 100;
    descuento3 = descuento3 / 100;
    descuento4 = descuento4 / 100;

    igv_articulo = igv_articulo / 100;
    Unit = precio_unitario;
    
    ICBPER = icbper_articulo * cantidad;
    if(!agregar_igv){
        Unit = Unit / 1.18;
    }
    
    SubTotal_Sin_Descuentos = Unit * cantidad;

    SubTotal_Con_Descuentos = SubTotal_Sin_Descuentos;

    //1er descuento
    descuento = SubTotal_Con_Descuentos * descuento1;
    SubTotal_Con_Descuentos = SubTotal_Con_Descuentos - descuento;
    Descuentos_SubTotal += descuento;
    //2do descuento
    descuento = SubTotal_Con_Descuentos * descuento2;
    SubTotal_Con_Descuentos = SubTotal_Con_Descuentos - descuento;
    Descuentos_SubTotal += descuento;
    
    //3er descuento
    descuento = SubTotal_Con_Descuentos * descuento3;
    SubTotal_Con_Descuentos = SubTotal_Con_Descuentos - descuento;
    Descuentos_SubTotal += descuento;
    
    //4to descuento
    descuento = SubTotal_Con_Descuentos * descuento4;
    SubTotal_Con_Descuentos = SubTotal_Con_Descuentos - descuento;
    Descuentos_SubTotal += descuento;


    Igv = SubTotal_Con_Descuentos * igv_articulo;

    Total = SubTotal_Con_Descuentos + Igv + ICBPER;

    calcular_totales.Precio_Sin_Igv = Unit;
    calcular_totales.SubTotal_Sin_Descuentos = SubTotal_Sin_Descuentos;
    calcular_totales.Descuentos_SubTotal = Descuentos_SubTotal;
    calcular_totales.SubTotal_Con_Descuentos = SubTotal_Con_Descuentos;
    calcular_totales.Igv = Igv;
    calcular_totales.ICBPER= ICBPER;
    calcular_totales.Total = Total;
    return calcular_totales;
}

function calcular_detalle_contabilidad(data){
    
    var calculos={
        Debe_Mn: 0,
        Haber_Mn: 0,
        Debe_Me: 0,
        Haber_Me: 0,
    };
    var debe=0,haber=0,tc=0, moneda,debe_mn=0,haber_mn=0,debe_me=0,haber_me=0;
    
    debe = data.Debe || 0;
    haber = data.Haber || 0;
    tc = data.Tc || 1;
    moneda = data.Moneda || 'S/';

    if(moneda=="S/"){
        debe_mn = debe;
        haber_mn = haber;
        debe_me = debe / tc;
        haber_me = haber / tc;
    }else{
        
        debe_mn = debe * tc;
        haber_mn = haber * tc;
        debe_me = debe;
        haber_me = haber;
    }
    
    calculos.Debe_Mn = debe_mn;
    calculos.Haber_Mn = haber_mn;
    calculos.Debe_Me = debe_me;
    calculos.Haber_Me = haber_me;
    return calculos;
}


function calcular_totales_contabilidad(data){
    try{
        var calculos={};
        
        // data.SubTotal;
        // data.SubTotal_Mixto;
        // data.Igv;
        // data.Icbper;
        // data.Total;
        // data.Porcentaje_Igv;
        // data.Porcentaje_Detraccion;
        // data.Tipo_Operacion;
        // data.Tasa_Cambio;
        // data.Campo;
        // data.Moneda
        var SubTotal = data.SubTotal * 1;
        var SubTotal_Mixto = data.SubTotal_Mixto * 1;
        var Igv = data.Igv * 1;
        var Icbper = data.Icbper * 1;
        var Total = data.Total * 1;
        var Porcentaje_Igv = data.Porcentaje_Igv * 1 / 100;
        var Porcentaje_Detraccion = data.Porcentaje_Detraccion * 1 / 100;
        var Porcentaje_Retencion_No_Domiciliado = data.Porcentaje_Retencion_No_Domiciliado * 1 / 100;
        var Porcentaje_Percepcion = data.Porcentaje_Percepcion * 1 / 100;
        var Tasa_Cambio = data.Tasa_Cambio * 1;
        var Tipo_Operacion = data.Tipo_Operacion;
        var Campo = data.Campo;
        var Moneda = data.Moneda;
        var Monto_Minimo_Detraccion = data.Monto_Minimo_Detraccion;
        
        var Detraccion = 0;
        var Retencion_No_Domiciliado = 0;
        var Percepcion = 0;
        var SubTotal_Gravado = 0;
        var SubTotal_NoGravado = 0;

        
        if(data.Aplicar_Renta_Cuarta=="S"){
            if(SubTotal <= data.Monto_Minimo_IGV){
                Porcentaje_Igv = 0;
            }else{
                Porcentaje_Igv = Porcentaje_Igv * -1;
            }
        }
        
        switch(Tipo_Operacion){
            case "001":
                switch(Campo){
                    case "SubTotal":
                        SubTotal_Mixto = 0;
                        Igv = SubTotal * Porcentaje_Igv;
                        Total = SubTotal + Igv + SubTotal_Mixto + Icbper;
                    break;
                    case "Total":
                        SubTotal_Mixto = 0;
                        SubTotal = Total  / (1 + Porcentaje_Igv);
                        Igv = Total - SubTotal;
                    break;
                    case "ICBPER":
                        SubTotal_Mixto = 0;
                        Igv = SubTotal * Porcentaje_Igv;
                        Total = SubTotal + Igv + SubTotal_Mixto + Icbper;
                    break;

                }
            break;
            case "004":
                switch(Campo){
                    case "SubTotal":
                        Igv = 0;
                        SubTotal_Mixto = 0;
                        Total = SubTotal + Igv + SubTotal_Mixto + Icbper;
                    break;
                    case "Total":
                        Igv = 0;
                        SubTotal_Mixto = 0;
                        SubTotal = Total - Igv - SubTotal_Mixto - Icbper;
                    break;
                    case "ICBPER":
                        Igv = 0;
                        SubTotal_Mixto = 0;
                        Total = SubTotal + Igv + SubTotal_Mixto + Icbper;
                    break;

                }
            break;
            case "005":
                switch(Campo){
                    case "SubTotal":
                        Igv = SubTotal * Porcentaje_Igv;
                        Total = SubTotal + Igv + SubTotal_Mixto + Icbper;
                    break;
                    case "Total":
                        SubTotal = (Total - SubTotal_Mixto)  / (1 + Porcentaje_Igv);
                        Igv = SubTotal * Porcentaje_Igv;
                    break;
                    case "SubMixta":
                        Igv = SubTotal * Porcentaje_Igv;
                        Total = SubTotal + Igv + SubTotal_Mixto + Icbper;
                    break;
                    case "ICBPER":
                        Igv = SubTotal * Porcentaje_Igv;
                        Total = SubTotal + Igv + SubTotal_Mixto + Icbper;
                    break;
                }
            break;
        }

        if(data.Aplicar_Renta_Cuarta=="S"){
            Igv = Igv * -1;
        }
        console.log(Igv);
        calculos.SubTotal=SubTotal;
        calculos.SubTotal_Mixto=SubTotal_Mixto;
        calculos.SubTotal_Gravado=SubTotal_Gravado;
        calculos.SubTotal_NoGravado=SubTotal_NoGravado;
        calculos.Igv=Igv;
        calculos.Icbper=Icbper;
        calculos.Total=Total;
        calculos.Retencion_No_Domiciliado = Total * Porcentaje_Retencion_No_Domiciliado;
        calculos.Percepcion = Total * Porcentaje_Percepcion;
        if (Total >= Monto_Minimo_Detraccion) {
            calculos.Detraccion = Total * Porcentaje_Detraccion;
        }else{
            calculos.Detraccion = 0;
        }



        if(Moneda=="S/"){
            calculos.SubTotal_MN=SubTotal;
            calculos.SubTotal_Mixto_MN=SubTotal_Mixto;
            calculos.SubTotal_Gravado_MN=calculos.SubTotal_Gravado;
            calculos.SubTotal_NoGravado_MN=calculos.SubTotal_NoGravado;
            calculos.Igv_MN=calculos.Igv;
            calculos.Icbper_MN=calculos.Icbper;
            calculos.Total_MN=calculos.Total;
            calculos.Detraccion_MN=calculos.Detraccion;
            calculos.Percepcion_MN=calculos.Percepcion;
            
            calculos.SubTotal_ME=SubTotal / Tasa_Cambio;
            calculos.SubTotal_Mixto_ME=SubTotal_Mixto / Tasa_Cambio;
            calculos.SubTotal_Gravado_ME=calculos.SubTotal_Gravado / Tasa_Cambio;
            calculos.SubTotal_NoGravado_ME=calculos.SubTotal_NoGravado / Tasa_Cambio;
            calculos.Igv_ME=calculos.Igv / Tasa_Cambio;
            calculos.Icbper_ME=calculos.Icbper / Tasa_Cambio;
            calculos.Total_ME=calculos.Total / Tasa_Cambio;
            calculos.Detraccion_ME=calculos.Detraccion / Tasa_Cambio;
            calculos.Percepcion_ME=calculos.Percepcion / Tasa_Cambio;
            
            calculos.SubTotal_2=SubTotal / Tasa_Cambio;
            calculos.SubTotal_Mixto_2=SubTotal_Mixto / Tasa_Cambio;
            calculos.SubTotal_Gravado_2=calculos.SubTotal_Gravado / Tasa_Cambio;
            calculos.SubTotal_NoGravado_2=calculos.SubTotal_NoGravado / Tasa_Cambio;
            calculos.Igv_2=calculos.Igv / Tasa_Cambio;
            calculos.Icbper_2=calculos.Icbper / Tasa_Cambio;
            calculos.Total_2=calculos.Total / Tasa_Cambio;
            calculos.Detraccion_2=calculos.Detraccion / Tasa_Cambio;
            calculos.Percepcion_2=calculos.Percepcion / Tasa_Cambio;
        }else{
            calculos.SubTotal_ME=SubTotal;
            calculos.SubTotal_Mixto_ME=SubTotal_Mixto;
            calculos.SubTotal_Gravado_ME=calculos.SubTotal_Gravado;
            calculos.SubTotal_NoGravado_ME=calculos.SubTotal_NoGravado;
            calculos.Igv_ME=calculos.Igv;
            calculos.Icbper_ME=calculos.Icbper;
            calculos.Total_ME=calculos.Total;
            calculos.Detraccion_ME=calculos.Detraccion;
            calculos.Percepcion_ME=calculos.Percepcion;
            
            calculos.SubTotal_MN=SubTotal * Tasa_Cambio;
            calculos.SubTotal_Mixto_MN=SubTotal_Mixto * Tasa_Cambio;
            calculos.SubTotal_Gravado_MN=calculos.SubTotal_Gravado * Tasa_Cambio;
            calculos.SubTotal_NoGravado_MN=calculos.SubTotal_NoGravado * Tasa_Cambio;
            calculos.Igv_MN=calculos.Igv * Tasa_Cambio;
            calculos.Icbper_MN=calculos.Icbper * Tasa_Cambio;
            calculos.Total_MN=calculos.Total * Tasa_Cambio;
            calculos.Detraccion_MN=calculos.Detraccion * Tasa_Cambio;
            calculos.Percepcion_MN=calculos.Percepcion * Tasa_Cambio;
            
            calculos.SubTotal_2=SubTotal * Tasa_Cambio;
            calculos.SubTotal_Mixto_2=SubTotal_Mixto * Tasa_Cambio;
            calculos.SubTotal_Gravado_2=calculos.SubTotal_Gravado * Tasa_Cambio;
            calculos.SubTotal_NoGravado_2=calculos.SubTotal_NoGravado * Tasa_Cambio;
            calculos.Igv_2=calculos.Igv * Tasa_Cambio;
            calculos.Icbper_2=calculos.Icbper * Tasa_Cambio;
            calculos.Total_2=calculos.Total * Tasa_Cambio;
            calculos.Detraccion_2=calculos.Detraccion * Tasa_Cambio;
            calculos.Percepcion_2=calculos.Percepcion * Tasa_Cambio;
        }

        
        return calculos;
    }catch (e){
        return e;
    }
}


function calcular_totales_importacion(data){
    console.log(data);

    var total = data.Incoterm;
    var flete = data.Flete;
    var cantidad_unit = data.Cantidad;
    var precio_unit = data.Precio;
    var total_unit = cantidad_unit * precio_unit;

    var calcular_totales={
        Incoterm: 0,
        Flete: 0,
        Seguro: 0,
        Otros: 0,
       
        Total_Unit: 0,
        Advalorem_Mn: 0,
        Advalorem_Me: 0,
        Total_Advalorem_Mn: 0,
        Total_Advalorem_Me: 0,
        Flete_Unit: 0,
    };

    if (data.Moneda == '$') {
        calcular_totales.Advalorem_Me = (data.Precio + data.Flete + data.Seguro) * (data.Porcentaje_Advalorem / 100)
        calcular_totales.Advalorem_Mn = ((data.Precio + data.Flete + data.Seguro) * data.Tc) * (data.Porcentaje_Advalorem / 100)

        calcular_totales.Total_Advalorem_Me = ((data.Cantidad * data.Precio) + data.Flete + data.Seguro) * (data.Porcentaje_Advalorem / 100)
        calcular_totales.Total_Advalorem_Mn = (((data.Cantidad * data.Precio) + data.Flete + data.Seguro) * data.Tc) * (data.Porcentaje_Advalorem / 100)
    }else{
        calcular_totales.Advalorem_Mn = (data.Precio + data.Flete + data.Seguro) * (data.Porcentaje_Advalorem / 100)
        calcular_totales.Advalorem_Me = (data.Precio + data.Flete + data.Seguro) * ((data.Porcentaje_Advalorem / 100) / data.Tc)

        calcular_totales.Total_Advalorem_Mn = ((data.Cantidad * data.Precio)+ data.Flete + data.Seguro) * (data.Porcentaje_Advalorem / 100)
        calcular_totales.Total_Advalorem_Me = ((data.Cantidad * data.Precio) + data.Flete + data.Seguro) * ((data.Porcentaje_Advalorem / 100) / data.Tc)
    }

    calcular_totales.Flete_Unit = ((flete/total)*total_unit)/cantidad_unit;
    calcular_totales.Incoterm = data.Cantidad * data.Precio ;
    calcular_totales.Flete = calcular_totales.Flete_Unit  * cantidad_unit;
    calcular_totales.Seguro = data.Seguro;

    return calcular_totales;
}