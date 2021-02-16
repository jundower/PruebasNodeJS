const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../../database');

router.post('/cotizacion/:tipo_reporte', async (req, res) => {
    try{
        const {tipo_reporte} = req.params;
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.body.punto_venta;
        var columnas = {
            responsable_aprobacion: "Hcotizac.ccod_empleado_aprueba",
            centro_costos: "Hcotizac.ccod_cencos",
            unidad_negocio: "Hcotizac.erp_codune",
            orden_trabajo: "Hcotizac.Codigo_Orden_Trabajo",
            motivos_tramite: "Hcotizac.idmotivo_venta",
            codigo_cliente: "Hcotizac.ccod_cliente",
            forma_pago_lista: "Hcotizac.ccod_forpago",
            articulos: "Hcotizad.ccod_articulo",
        }
        var columnas_order = {
            responsable_aprobacion: "Codigo_Aprobacion_1",
            responsable_aprobacion_2: "Codigo_Aprobacion_2",
            centro_costos: "Codigo_Centro_Costo",
            unidad_negocio: "Codigo_Unidad_Negocio",
            orden_trabajo: "Codigo_Orden_Trabajo",
            motivos_tramite: "Codigo_Motivo",
            articulos: "Codigo_Articulo"
        }
        
        var agrupacion1_valores = req.body.agrupacion1_valores;
        var agrupacion2_valores = req.body.agrupacion2_valores;
        var agrupacion3_valores = req.body.agrupacion3_valores;
        var agrupacion1_tipo = req.body.agrupacion1_tipo;
        var agrupacion2_tipo = req.body.agrupacion2_tipo;
        var agrupacion3_tipo = req.body.agrupacion3_tipo;
        var agrupacion0_tipo_moneda= req.body.agrupacion0_tipo_moneda;
        var agrupacion0_moneda= req.body.agrupacion0_moneda;

        var query = 
        "select \n"+
        "Hcotizac.punto_venta as Punto_Venta, \n"+
        "Hcotizac.idmotivo_venta as Codigo_Motivo, \n"+
        "erp_motivos_tramite.erp_nommot as Motivo, \n"+
        "CONVERT(VARCHAR,Hcotizac.dfecha_doc,103) as Fecha, \n"+
        "CONVERT(VARCHAR,Hcotizac.dfecha_entr,103) as Fecha_Entrega, \n"+
        "CONVERT(VARCHAR,Hcotizac.dfecha_validez,103) as Fecha_Validez, \n"+
        "Hcotizac.cnum_doc as Numero, \n"+
        "Hcotizac.ccod_cliente as Codigo_Cliente, \n"+
        "hcliente.cnum_ruc as RUC_Cliente, \n"+
        "Hcotizac.cnom_cliente_c as Nombre_Cliente, \n"+
        "hcliente.cdireccion as Direccion_Cliente, \n"+
        "hcliente.ctelefonos as Telefono_Cliente, \n"+
        "hcliente.ce_mail as Correo_Cliente, \n"+
        "Hcotizac.cod_contacto as Contacto_Cliente, \n"+
        "Hvended.cnom_vendedor as Vendedor, \n"+
        "Hcotizac.cmoneda as Moneda, \n"+
        "Hcotizac.tipocambio as Tipo_Cambio, \n"+
        "case Hcotizac.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hcotizac.cmoneda when 'S/' then Hcotizac.subtotal_sin_descuentos else Hcotizac.subtotal_sin_descuentos*Hcotizac.tipocambio end" : "case Hcotizac.cmoneda when '$' then Hcotizac.subtotal_sin_descuentos else Hcotizac.subtotal_sin_descuentos/Hcotizac.tipocambio end") : "Hcotizac.subtotal_sin_descuentos") +" end as Base_Calculada, \n"+
        "case Hcotizac.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hcotizac.cmoneda when 'S/' then Hcotizac.erp_Ddescuento else Hcotizac.erp_Ddescuento*Hcotizac.tipocambio end" : "case Hcotizac.cmoneda when '$' then Hcotizac.erp_Ddescuento else Hcotizac.erp_Ddescuento/Hcotizac.tipocambio end") : "Hcotizac.erp_Ddescuento") +" end as Descuento, \n"+
        "case Hcotizac.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hcotizac.cmoneda when 'S/' then Hcotizac.erp_Dsubtotal else Hcotizac.erp_Dsubtotal*Hcotizac.tipocambio end" : "case Hcotizac.cmoneda when '$' then Hcotizac.erp_Dsubtotal else Hcotizac.erp_Dsubtotal/Hcotizac.tipocambio end") : "Hcotizac.erp_Dsubtotal") +" end as Base_Imponible, \n"+
        "case Hcotizac.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hcotizac.cmoneda when 'S/' then Hcotizac.erp_Digv else Hcotizac.erp_Digv*Hcotizac.tipocambio end" : "case Hcotizac.cmoneda when '$' then Hcotizac.erp_Digv else Hcotizac.erp_Digv/Hcotizac.tipocambio end") : "Hcotizac.erp_Digv") +" end as Igv, \n"+
        "case Hcotizac.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hcotizac.cmoneda when 'S/' then Hcotizac.erp_Dimporte else Hcotizac.erp_Dimporte*Hcotizac.tipocambio end" : "case Hcotizac.cmoneda when '$' then Hcotizac.erp_Dimporte else Hcotizac.erp_Dimporte/Hcotizac.tipocambio end") : "Hcotizac.erp_Dimporte") +" end as Importe, \n"+
        "Hcotizac.estado as Estado, \n"+
        "Hcotizac.atencion as Atencion, \n"+
        "Hcotizac.porcentaje as Porcentaje, \n"+
        "case Hcotizac.ot when '00' then '' else Hcotizac.ot end as Codigo_Orden_Trabajo, \n"+
        "case Hcotizac.ot when '00' then '' else Horden_trabajo.cnom_ot end as Orden_Trabajo, \n"+
        "case Hcotizac.erp_codune when '00' then '' else Hcotizac.erp_codune end as Codigo_Unidad_Negocio, \n"+
        "case Hcotizac.erp_codune when '00' then '' else erp_unidad_negocio.erp_nomune end as Unidad_Negocio, \n"+
        "case Hcotizac.ccod_cencos when '00' then '' else Hcotizac.ccod_cencos end as Codigo_Centro_Costo, \n"+
        "case Hcotizac.ccod_cencos when '00' then '' else Hcencos.cnom_cencos end as Centro_Costo, \n"+
        "case Hcotizac.ccod_forpago when '00' then '' else Hcotizac.ccod_forpago end as Codigo_Forma_Pago, \n"+
        "case Hcotizac.ccod_forpago when '00' then '' else Hfor_pag.cnom_forpago end as Forma_Pago, \n"+
        "case Hcotizac.caprobado when 'Sin Aprobacion' then '' else CONVERT(VARCHAR,Hcotizac.dfecha_aprobacion,103) end as Fecha_Aprobacion, \n"+
        "case Hcotizac.caprobado when 'Sin Aprobacion' then '' else (Aprobacion.ape_pat+' '+Aprobacion.ape_mat+' '+Aprobacion.nombres) end as Responsable_Aprobacion, \n"+
        "Hcotizac.usuario as Usuario, \n"+
        "Hcotizac.Pc_User as Pc_User, \n"+
        "Hcotizac.Pc_Fecha as Pc_Fecha, \n"+
        "Hcotizac.Pc_Ip as Pc_Ip, \n"+

        "Hcotizad.nitem as item, \n"+
        "case Hcotizac.estado when 'Anulado' then '0' else Hcotizad.ncantidad3 end as Cantidad, \n"+
        "case Hcotizac.estado when 'Anulado' then '0' else isnull((select sum(Hpedidod.ncantidad3) \n"+
        "from Hpedidod \n"+
        "inner join Hpedidoc on \n"+
        "Hpedidod.ccod_empresa = Hpedidoc.ccod_empresa and  \n"+
        "Hpedidod.ccod_almacen = Hpedidoc.ccod_almacen and  \n"+
        "Hpedidod.idmotivo_venta = Hpedidoc.idmotivo_venta and  \n"+
        "Hpedidod.cnum_doc = Hpedidoc.cnum_doc  \n"+
        "where \n"+
        "Hpedidod.ccod_empresa = Hcotizad.ccod_empresa and \n"+
        "Hpedidod.ptovta_cotizacion = Hcotizad.erp_ptovta and \n"+
        "Hpedidod.idmotivo_cotizacion = Hcotizad.idmotivo_venta and \n"+
        "Hpedidod.numero_cotizacion = Hcotizad.cnum_doc and  \n"+
        "Hpedidoc.estado <> 'Anulado' and \n"+
        "Hpedidod.ccod_articulo = Hcotizad.ccod_articulo and  \n"+
        "Hpedidod.nitem_ref = Hcotizad.nitem),0) end as Cantidad_Atendida,\n"+
        "case Hcotizac.estado when 'Anulado' then '0' else Hcotizad.ncantidad3 - isnull((select sum(Hpedidod.ncantidad3) \n"+
        "from Hpedidod \n"+
        "inner join Hpedidoc on \n"+
        "Hpedidod.ccod_empresa = Hpedidoc.ccod_empresa and  \n"+
        "Hpedidod.idmotivo_venta = Hpedidoc.idmotivo_venta and  \n"+
        "Hpedidod.ccod_almacen = Hpedidoc.ccod_almacen and  \n"+
        "Hpedidod.cnum_doc = Hpedidoc.cnum_doc  \n"+
        "where \n"+
        "Hpedidod.ccod_empresa = Hcotizad.ccod_empresa and \n"+
        "Hpedidod.ptovta_cotizacion = Hcotizad.erp_ptovta and \n"+
        "Hpedidod.idmotivo_cotizacion = Hcotizad.idmotivo_venta and \n"+
        "Hpedidod.numero_cotizacion = Hcotizad.cnum_doc and  \n"+
        "Hpedidoc.estado <> 'Anulado' and \n"+
        "Hpedidod.ccod_articulo = Hcotizad.ccod_articulo and  \n"+
        "Hpedidod.nitem_ref = Hcotizad.nitem),0)  end as Cantidad_Saldo, \n"+
        "case Hcotizac.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hcotizac.cmoneda when 'S/' then Hcotizad.nprecio  else Hcotizad.nprecio * Hcotizac.tipocambio end" : "case Hcotizac.cmoneda when '$' then Hcotizad.nprecio  else Hcotizad.nprecio / Hcotizac.tipocambio end") : "Hcotizad.nprecio ") +" end as Unit, \n"+
        "Hcotizad.ccod_articulo as Codigo_Articulo, \n"+
        "Harticul.ccod_interno as Codigo_Fabricante, \n"+
        "Harticul.cnom_articulo as Nombre_Articulo, \n"+
        "Hcotizad.nombre_presentacion as Nombre_Presentacion, \n"+
        "Hcotizad.cunidad as Unidad, \n"+
        "case Hcotizac.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hcotizac.cmoneda when 'S/' then Hcotizad.erp_base_calc_dec else Hcotizad.erp_base_calc_dec*Hcotizac.tipocambio end" : "case Hcotizac.cmoneda when '$' then Hcotizad.erp_base_calc_dec else Hcotizad.erp_base_calc_dec/Hcotizac.tipocambio end") : "Hcotizad.erp_base_calc_dec") +" end as Detalle_Base_Calculada, \n"+
        "case Hcotizac.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hcotizac.cmoneda when 'S/' then Hcotizad.monto_descuento else Hcotizad.monto_descuento*Hcotizac.tipocambio end" : "case Hcotizac.cmoneda when '$' then Hcotizad.monto_descuento else Hcotizad.monto_descuento/Hcotizac.tipocambio end") : "Hcotizad.monto_descuento") +" end as Detalle_Descuento, \n"+
        "case Hcotizac.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hcotizac.cmoneda when 'S/' then Hcotizad.erp_base_imp_dec else Hcotizad.erp_base_imp_dec*Hcotizac.tipocambio end" : "case Hcotizac.cmoneda when '$' then Hcotizad.erp_base_imp_dec else Hcotizad.erp_base_imp_dec/Hcotizac.tipocambio end") : "Hcotizad.erp_base_imp_dec") +" end as Detalle_Base_Imponible, \n"+
        "case Hcotizac.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hcotizac.cmoneda when 'S/' then Hcotizad.erp_igv_dec else Hcotizad.erp_igv_dec*Hcotizac.tipocambio end" : "case Hcotizac.cmoneda when '$' then Hcotizad.erp_igv_dec else Hcotizad.erp_igv_dec/Hcotizac.tipocambio end") : "Hcotizad.erp_igv_dec") +" end as Detalle_IGV, \n"+
        "case Hcotizac.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hcotizac.cmoneda when 'S/' then Hcotizad.erp_importe_dec else Hcotizad.erp_importe_dec*Hcotizac.tipocambio end" : "case Hcotizac.cmoneda when '$' then Hcotizad.erp_importe_dec else Hcotizad.erp_importe_dec/Hcotizac.tipocambio end") : "Hcotizad.erp_importe_dec") +" end as Detalle_Importe, \n"+

        "(select sum(n_cantidad) from ( \n"+
        "select ROW_NUMBER() over (order by Hpedidod.cnum_doc) as orden, Hpedidod.ncantidad3 as n_cantidad \n"+
        "from Hpedidod  \n"+
        "inner join Hpedidoc on \n"+
        "Hpedidod.ccod_empresa = Hpedidoc.ccod_empresa and  \n"+
        "Hpedidod.ccod_almacen = Hpedidoc.ccod_almacen and  \n"+
        "Hpedidod.idmotivo_venta = Hpedidoc.idmotivo_venta and  \n"+
        "Hpedidod.cnum_doc = Hpedidoc.cnum_doc  \n"+
        "where \n"+
        "Hpedidod.ccod_empresa = Hcotizad.ccod_empresa and \n"+
        "Hpedidod.ptovta_cotizacion = Hcotizad.erp_ptovta and \n"+
        "Hpedidod.idmotivo_cotizacion = Hcotizad.idmotivo_venta and \n"+
        "Hpedidod.numero_cotizacion = Hcotizad.cnum_doc and  \n"+
        "Hpedidoc.estado <> 'Anulado' and \n"+
        "Hpedidod.ccod_articulo = Hcotizad.ccod_articulo and  \n"+
        "Hpedidod.nitem_ref = Hcotizad.nitem \n"+
        ") as d where orden='1' ) as Pedido_1, \n"+
        "(select n_documento_referencia from ( \n"+
        "select ROW_NUMBER() over (order by Hpedidod.cnum_doc) as orden, Hpedidod.cnum_doc as n_documento_referencia \n"+
        "from Hpedidod  \n"+
        "inner join Hpedidoc on  \n"+
        "Hpedidod.ccod_empresa = Hpedidoc.ccod_empresa and  \n"+
        "Hpedidod.ccod_almacen = Hpedidoc.ccod_almacen and  \n"+
        "Hpedidod.idmotivo_venta = Hpedidoc.idmotivo_venta and  \n"+
        "Hpedidod.cnum_doc = Hpedidoc.cnum_doc  \n"+
        "where \n"+
        "Hpedidod.ccod_empresa = Hcotizad.ccod_empresa and \n"+
        "Hpedidod.ptovta_cotizacion = Hcotizad.erp_ptovta and \n"+
        "Hpedidod.idmotivo_cotizacion = Hcotizad.idmotivo_venta and \n"+
        "Hpedidod.numero_cotizacion = Hcotizad.cnum_doc and  \n"+
        "Hpedidoc.estado <> 'Anulado' and \n"+
        "Hpedidod.ccod_articulo = Hcotizad.ccod_articulo and  \n"+
        "Hpedidod.nitem_ref = Hcotizad.nitem \n"+
        ") as d where orden='1' ) as  Referencia_Pedido_1, \n"+
        "(select sum(n_cantidad) from ( \n"+
        "select ROW_NUMBER() over (order by Hpedidod.cnum_doc) as orden, Hpedidod.ncantidad3 as n_cantidad \n"+
        "from Hpedidod  \n"+
        "inner join Hpedidoc on \n"+
        "Hpedidod.ccod_empresa = Hpedidoc.ccod_empresa and  \n"+
        "Hpedidod.ccod_almacen = Hpedidoc.ccod_almacen and  \n"+
        "Hpedidod.idmotivo_venta = Hpedidoc.idmotivo_venta and  \n"+
        "Hpedidod.cnum_doc = Hpedidoc.cnum_doc  \n"+
        "where \n"+
        "Hpedidod.ccod_empresa = Hcotizad.ccod_empresa and \n"+
        "Hpedidod.ptovta_cotizacion = Hcotizad.erp_ptovta and \n"+
        "Hpedidod.idmotivo_cotizacion = Hcotizad.idmotivo_venta and \n"+
        "Hpedidod.numero_cotizacion = Hcotizad.cnum_doc and  \n"+
        "Hpedidoc.estado <> 'Anulado' and \n"+
        "Hpedidod.ccod_articulo = Hcotizad.ccod_articulo and  \n"+
        "Hpedidod.nitem_ref = Hcotizad.nitem \n"+
        ") as d where orden='2' ) as Pedido_2, \n"+
        "(select n_documento_referencia from ( \n"+
        "select ROW_NUMBER() over (order by Hpedidod.cnum_doc) as orden, Hpedidod.cnum_doc as n_documento_referencia \n"+
        "from Hpedidod  \n"+
        "inner join Hpedidoc on  \n"+
        "Hpedidod.ccod_empresa = Hpedidoc.ccod_empresa and  \n"+
        "Hpedidod.ccod_almacen = Hpedidoc.ccod_almacen and  \n"+
        "Hpedidod.idmotivo_venta = Hpedidoc.idmotivo_venta and  \n"+
        "Hpedidod.cnum_doc = Hpedidoc.cnum_doc  \n"+
        "where \n"+
        "Hpedidod.ccod_empresa = Hcotizad.ccod_empresa and \n"+
        "Hpedidod.ptovta_cotizacion = Hcotizad.erp_ptovta and \n"+
        "Hpedidod.idmotivo_cotizacion = Hcotizad.idmotivo_venta and \n"+
        "Hpedidod.numero_cotizacion = Hcotizad.cnum_doc and  \n"+
        "Hpedidoc.estado <> 'Anulado' and \n"+
        "Hpedidod.ccod_articulo = Hcotizad.ccod_articulo and  \n"+
        "Hpedidod.nitem_ref = Hcotizad.nitem \n"+
        ") as d where orden='2' ) as  Referencia_Pedido_2, \n"+
        "(select sum(n_cantidad) from ( \n"+
        "select ROW_NUMBER() over (order by Hpedidod.cnum_doc) as orden, Hpedidod.ncantidad3 as n_cantidad \n"+
        "from Hpedidod  \n"+
        "inner join Hpedidoc on \n"+
        "Hpedidod.ccod_empresa = Hpedidoc.ccod_empresa and  \n"+
        "Hpedidod.ccod_almacen = Hpedidoc.ccod_almacen and  \n"+
        "Hpedidod.idmotivo_venta = Hpedidoc.idmotivo_venta and  \n"+
        "Hpedidod.cnum_doc = Hpedidoc.cnum_doc  \n"+
        "where \n"+
        "Hpedidod.ccod_empresa = Hcotizad.ccod_empresa and \n"+
        "Hpedidod.ptovta_cotizacion = Hcotizad.erp_ptovta and \n"+
        "Hpedidod.idmotivo_cotizacion = Hcotizad.idmotivo_venta and \n"+
        "Hpedidod.numero_cotizacion = Hcotizad.cnum_doc and  \n"+
        "Hpedidoc.estado <> 'Anulado' and \n"+
        "Hpedidod.ccod_articulo = Hcotizad.ccod_articulo and  \n"+
        "Hpedidod.nitem_ref = Hcotizad.nitem \n"+
        ") as d where orden='3' ) as Pedido_3, \n"+
        "(select n_documento_referencia from ( \n"+
        "select ROW_NUMBER() over (order by Hpedidod.cnum_doc) as orden, Hpedidod.cnum_doc as n_documento_referencia \n"+
        "from Hpedidod  \n"+
        "inner join Hpedidoc on  \n"+
        "Hpedidod.ccod_empresa = Hpedidoc.ccod_empresa and  \n"+
        "Hpedidod.ccod_almacen = Hpedidoc.ccod_almacen and  \n"+
        "Hpedidod.idmotivo_venta = Hpedidoc.idmotivo_venta and  \n"+
        "Hpedidod.cnum_doc = Hpedidoc.cnum_doc  \n"+
        "where \n"+
        "Hpedidod.ccod_empresa = Hcotizad.ccod_empresa and \n"+
        "Hpedidod.ptovta_cotizacion = Hcotizad.erp_ptovta and \n"+
        "Hpedidod.idmotivo_cotizacion = Hcotizad.idmotivo_venta and \n"+
        "Hpedidod.numero_cotizacion = Hcotizad.cnum_doc and  \n"+
        "Hpedidoc.estado <> 'Anulado' and \n"+
        "Hpedidod.ccod_articulo = Hcotizad.ccod_articulo and  \n"+
        "Hpedidod.nitem_ref = Hcotizad.nitem \n"+
        ") as d where orden='3' ) as  Referencia_Pedido_3, \n"+
        "(select sum(n_cantidad) from ( \n"+
        "select ROW_NUMBER() over (order by Hpedidod.cnum_doc) as orden, Hpedidod.ncantidad3 as n_cantidad \n"+
        "from Hpedidod  \n"+
        "inner join Hpedidoc on \n"+
        "Hpedidod.ccod_empresa = Hpedidoc.ccod_empresa and  \n"+
        "Hpedidod.ccod_almacen = Hpedidoc.ccod_almacen and  \n"+
        "Hpedidod.idmotivo_venta = Hpedidoc.idmotivo_venta and  \n"+
        "Hpedidod.cnum_doc = Hpedidoc.cnum_doc  \n"+
        "where \n"+
        "Hpedidod.ccod_empresa = Hcotizad.ccod_empresa and \n"+
        "Hpedidod.ptovta_cotizacion = Hcotizad.erp_ptovta and \n"+
        "Hpedidod.idmotivo_cotizacion = Hcotizad.idmotivo_venta and \n"+
        "Hpedidod.numero_cotizacion = Hcotizad.cnum_doc and  \n"+
        "Hpedidoc.estado <> 'Anulado' and \n"+
        "Hpedidod.ccod_articulo = Hcotizad.ccod_articulo and  \n"+
        "Hpedidod.nitem_ref = Hcotizad.nitem \n"+
        ") as d where orden='4' ) as Pedido_4, \n"+
        "(select n_documento_referencia from ( \n"+
        "select ROW_NUMBER() over (order by Hpedidod.cnum_doc) as orden, Hpedidod.cnum_doc as n_documento_referencia \n"+
        "from Hpedidod  \n"+
        "inner join Hpedidoc on  \n"+
        "Hpedidod.ccod_empresa = Hpedidoc.ccod_empresa and  \n"+
        "Hpedidod.ccod_almacen = Hpedidoc.ccod_almacen and  \n"+
        "Hpedidod.idmotivo_venta = Hpedidoc.idmotivo_venta and  \n"+
        "Hpedidod.cnum_doc = Hpedidoc.cnum_doc  \n"+
        "where \n"+
        "Hpedidod.ccod_empresa = Hcotizad.ccod_empresa and \n"+
        "Hpedidod.ptovta_cotizacion = Hcotizad.erp_ptovta and \n"+
        "Hpedidod.idmotivo_cotizacion = Hcotizad.idmotivo_venta and \n"+
        "Hpedidod.numero_cotizacion = Hcotizad.cnum_doc and  \n"+
        "Hpedidoc.estado <> 'Anulado' and \n"+
        "Hpedidod.ccod_articulo = Hcotizad.ccod_articulo and  \n"+
        "Hpedidod.nitem_ref = Hcotizad.nitem \n"+
        ") as d where orden='4' ) as  Referencia_Pedido_4, \n"+
        "(select sum(n_cantidad) from ( \n"+
        "select ROW_NUMBER() over (order by Hpedidod.cnum_doc) as orden, Hpedidod.ncantidad3 as n_cantidad \n"+
        "from Hpedidod  \n"+
        "inner join Hpedidoc on \n"+
        "Hpedidod.ccod_empresa = Hpedidoc.ccod_empresa and  \n"+
        "Hpedidod.ccod_almacen = Hpedidoc.ccod_almacen and  \n"+
        "Hpedidod.idmotivo_venta = Hpedidoc.idmotivo_venta and  \n"+
        "Hpedidod.cnum_doc = Hpedidoc.cnum_doc  \n"+
        "where \n"+
        "Hpedidod.ccod_empresa = Hcotizad.ccod_empresa and \n"+
        "Hpedidod.ptovta_cotizacion = Hcotizad.erp_ptovta and \n"+
        "Hpedidod.idmotivo_cotizacion = Hcotizad.idmotivo_venta and \n"+
        "Hpedidod.numero_cotizacion = Hcotizad.cnum_doc and  \n"+
        "Hpedidoc.estado <> 'Anulado' and \n"+
        "Hpedidod.ccod_articulo = Hcotizad.ccod_articulo and  \n"+
        "Hpedidod.nitem_ref = Hcotizad.nitem \n"+
        ") as d where orden='5' ) as Pedido_5, \n"+
        "(select n_documento_referencia from ( \n"+
        "select ROW_NUMBER() over (order by Hpedidod.cnum_doc) as orden, Hpedidod.cnum_doc as n_documento_referencia \n"+
        "from Hpedidod  \n"+
        "inner join Hpedidoc on  \n"+
        "Hpedidod.ccod_empresa = Hpedidoc.ccod_empresa and  \n"+
        "Hpedidod.ccod_almacen = Hpedidoc.ccod_almacen and  \n"+
        "Hpedidod.idmotivo_venta = Hpedidoc.idmotivo_venta and  \n"+
        "Hpedidod.cnum_doc = Hpedidoc.cnum_doc  \n"+
        "where \n"+
        "Hpedidod.ccod_empresa = Hcotizad.ccod_empresa and \n"+
        "Hpedidod.ptovta_cotizacion = Hcotizad.erp_ptovta and \n"+
        "Hpedidod.idmotivo_cotizacion = Hcotizad.idmotivo_venta and \n"+
        "Hpedidod.numero_cotizacion = Hcotizad.cnum_doc and  \n"+
        "Hpedidoc.estado <> 'Anulado' and \n"+
        "Hpedidod.ccod_articulo = Hcotizad.ccod_articulo and  \n"+
        "Hpedidod.nitem_ref = Hcotizad.nitem \n"+
        ") as d where orden='5' ) as  Referencia_Pedido_5 \n"+
        
        "from Hcotizac \n"+
        "inner join Hcotizad on \n"+
        "Hcotizac.ccod_empresa = Hcotizad.ccod_empresa and \n"+
        "Hcotizac.punto_venta = Hcotizad.erp_ptovta and \n"+
        "Hcotizac.idmotivo_venta = Hcotizad.idmotivo_venta and \n"+
        "Hcotizac.cnum_doc = Hcotizad.cnum_doc \n"+
        "Inner Join erp_motivos_tramite on \n"+
        "Hcotizad.ccod_empresa = erp_motivos_tramite.erp_codemp \n"+
        "and Hcotizac.idmotivo_venta = erp_motivos_tramite.erp_codmot \n"+
        "Inner Join hcliente on \n"+
        "Hcotizac.ccod_empresa = hcliente.ccod_empresa \n"+
        "and Hcotizac.ccod_cliente = hcliente.ccod_cliente \n"+
        "Inner Join Harticul on \n"+
        "Hcotizad.ccod_empresa = Harticul.ccod_empresa \n"+
        "and Hcotizad.ccod_articulo = Harticul.ccod_articulo \n"+
        "Inner Join hfam_art on \n"+
        "hfam_art.ccod_empresa = Harticul.ccod_empresa \n"+
        "and hfam_art.cfamilia = Harticul.cfamilia \n"+
        "Inner Join Hsubfamilia_art on \n"+
        "Hsubfamilia_art.ccod_empresa = Harticul.ccod_empresa \n"+
        "and Hsubfamilia_art.ccod_subfamilia = Harticul.ccod_subfamilia \n"+
        "inner join Hfor_pag on \n"+
        "Hcotizac.ccod_empresa = Hfor_pag.ccod_empresa and \n"+
        "Hcotizac.ccod_forpago = Hfor_pag.ccod_forpago \n"+
        "inner join Hvended on \n"+
        "Hcotizac.ccod_empresa = Hvended.ccod_empresa and \n"+
        "Hcotizac.ccod_person = Hvended.ccod_vendedor \n"+
        "inner join Hperson Aprobacion on \n"+
        "Hcotizac.ccod_empresa = Aprobacion.ccod_empresa and \n"+
        "Hcotizac.ccod_empleado_aprueba = Aprobacion.ccod_person \n"+
        "inner join Hcencos on \n"+
        "Hcotizac.ccod_empresa = Hcencos.ccod_empresa \n"+
        "and Hcotizac.ccod_cencos = Hcencos.ccod_cencos \n"+
        "inner join Horden_trabajo on \n"+
        "Hcotizac.ccod_empresa = Horden_trabajo.ccod_empresa \n"+
        "and Hcotizac.ot = Horden_trabajo.ccod_ot \n"+
        "inner join erp_unidad_negocio on \n"+
        "Hcotizac.ccod_empresa = erp_unidad_negocio.erp_codemp \n"+
        "and Hcotizac.erp_codune = erp_unidad_negocio.erp_codune \n"+
        "where Hcotizac.ccod_empresa = @codigo_empresa \n"+
        "and Hcotizac.atencion <> case @estado_atencion when 'Todos' then '' else 'Atendido' end  \n"+
        "and Hcotizac.punto_venta = @codigo_punto_venta \n"+ 
        (agrupacion1_valores == "" ? "" : "and "+columnas[agrupacion1_tipo]+" in ("+agrupacion1_valores +") \n")+
        (agrupacion2_valores == "" ? "" : "and "+columnas[agrupacion2_tipo]+" in ("+agrupacion2_valores +") \n")+
        (agrupacion3_valores == "" ? "" : "and "+columnas[agrupacion3_tipo]+" in ("+agrupacion3_valores +") \n")+
        "and Hcotizac.dfecha_doc between @fecha_inicio and @fecha_termino \n"

        
        if(tipo_reporte=="resumido"){
            query = 
                "select  \n"+
                "Punto_Venta, \n"+
                "Motivo, \n"+
                "Fecha, \n"+
                "Fecha_Validez, \n"+
                "Numero, \n"+
                "Codigo_Cliente, \n"+
                "RUC_Cliente, \n"+
                "Nombre_Cliente, \n"+
                "Direccion_Cliente, \n"+
                "Telefono_Cliente, \n"+
                "Correo_Cliente, \n"+
                "Contacto_Cliente, \n"+
                "Vendedor, \n"+
                "Moneda, \n"+
                "Tipo_Cambio, \n"+
                "Base_Calculada, \n"+
                "Descuento, \n"+
                "Base_Imponible, \n"+
                "Igv, \n"+
                "Importe, \n"+
                "Estado, \n"+
                "Atencion, \n"+
                "Porcentaje, \n"+
                "Codigo_Unidad_Negocio, \n"+
                "Unidad_Negocio, \n"+
                "Codigo_Centro_Costo, \n"+
                "Centro_Costo, \n"+
                "Forma_Pago, \n"+
                "Fecha_Aprobacion, \n"+
                "Responsable_Aprobacion, \n"+
                "Usuario, \n"+
                "Pc_User, \n"+
                "Pc_Fecha, \n"+
                "Pc_Ip, \n"+
                "SUM(Cantidad) as Cantidad, \n"+
                "SUM(Cantidad_Atendida) as Cantidad_Atendida, \n"+
                "SUM(Cantidad_Saldo) as Cantidad_Saldo, \n"+
                "SUM(Unit) as Unit \n"+
                "from ( \n"+
                query +
                " ) as t \n"+
                "group by  \n"+
                "Punto_Venta, \n"+
                "Motivo, \n"+
                "Fecha, \n"+
                "Fecha_Validez, \n"+
                "Numero, \n"+
                "Codigo_Cliente, \n"+
                "RUC_Cliente, \n"+
                "Nombre_Cliente, \n"+
                "Direccion_Cliente, \n"+
                "Telefono_Cliente, \n"+
                "Correo_Cliente, \n"+
                "Contacto_Cliente, \n"+
                "Vendedor, \n"+
                "Moneda, \n"+
                "Tipo_Cambio, \n"+
                "Base_Calculada, \n"+
                "Descuento, \n"+
                "Base_Imponible, \n"+
                "Igv, \n"+
                "Importe, \n"+
                "Estado, \n"+
                "Atencion, \n"+
                "Porcentaje, \n"+
                "Codigo_Unidad_Negocio, \n"+
                "Unidad_Negocio, \n"+
                "Codigo_Centro_Costo, \n"+
                "Centro_Costo, \n"+
                "Forma_Pago, \n"+
                "Fecha_Aprobacion, \n"+
                "Responsable_Aprobacion, \n"+
                "Usuario, \n"+
                "Pc_User, \n"+
                "Pc_Fecha, \n"+
                "Pc_Ip \n"+
                "order by \n"+
                (columnas_order[agrupacion1_tipo] ? columnas_order[agrupacion1_tipo] : "Punto_Venta") +", \n"+
                (columnas_order[agrupacion2_tipo] ? columnas_order[agrupacion2_tipo] : "Motivo") +", \n"+
                (columnas_order[agrupacion3_tipo] ? columnas_order[agrupacion3_tipo] : "Numero") +" \n";
        }else{
            query += 
                " order by \n"+
                (columnas_order[agrupacion1_tipo] ? columnas_order[agrupacion1_tipo] : "Punto_Venta") +", \n"+
                (columnas_order[agrupacion2_tipo] ? columnas_order[agrupacion2_tipo] : "Motivo") +", \n"+
                (columnas_order[agrupacion3_tipo] ? columnas_order[agrupacion3_tipo] : "Numero") +",item \n";
        }
        
        const pool = await poolPromise;
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(10), codigo_punto_venta)
        .input('estado_atencion', mssql.VarChar(250), req.body.estado_atencion)
        .input('fecha_inicio', mssql.Date, req.body.fecha_inicio)
        .input('fecha_termino', mssql.Date, req.body.fecha_termino)
        .input('agrupacion1_tipo', mssql.VarChar(250), agrupacion1_tipo)
        .input('agrupacion2_tipo', mssql.VarChar(250), agrupacion2_tipo)
        .input('agrupacion3_tipo', mssql.VarChar(250), agrupacion3_tipo)
        .query(query);
    
        const recordset = lista.recordset;
        res.json(recordset);
    }catch(err){
        console.log(err.message);
        res.send(err.message);
    }
});

router.post('/pedido/:tipo_reporte', async (req, res) => {
    try{
        const {tipo_reporte} = req.params;
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.body.punto_venta;
        var columnas = {
            responsable_aprobacion: "Hpedidoc.responsable_aprobacion",
            centro_costos: "Hpedidoc.ccod_cencos",
            unidad_negocio: "Hpedidoc.erp_codune",
            orden_trabajo: "Hpedidoc.ot",
            motivos_tramite: "Hpedidoc.idmotivo_venta",
            codigo_cliente: "Hpedidoc.ccod_cliente",
            forma_pago_lista: "Hpedidoc.ccod_forpago",
            articulos: "Hpedidod.ccod_articulo",
        }
        var columnas_order = {
            responsable_aprobacion: "Codigo_Aprobacion",
            centro_costos: "Codigo_Centro_Costo",
            unidad_negocio: "Codigo_Unidad_Negocio",
            orden_trabajo: "Codigo_Orden_Trabajo",
            motivos_tramite: "Codigo_Motivo",
            articulos: "Codigo_Articulo"
        }
        
        var agrupacion1_valores = req.body.agrupacion1_valores;
        var agrupacion2_valores = req.body.agrupacion2_valores;
        var agrupacion3_valores = req.body.agrupacion3_valores;
        var agrupacion1_tipo = req.body.agrupacion1_tipo;
        var agrupacion2_tipo = req.body.agrupacion2_tipo;
        var agrupacion3_tipo = req.body.agrupacion3_tipo;
        var agrupacion0_tipo_moneda= req.body.agrupacion0_tipo_moneda;
        var agrupacion0_moneda= req.body.agrupacion0_moneda;

        var query = 
        "select \n"+
        "Hpedidoc.ccod_almacen as Punto_Venta, \n"+
        "Hpedidoc.idmotivo_venta as Codigo_Motivo, \n"+
        "erp_motivos_tramite.erp_nommot as Motivo, \n"+
        "CONVERT(VARCHAR,Hpedidoc.dfecha_doc,103) as Fecha, \n"+
        "CONVERT(VARCHAR,Hpedidoc.dfecha_entr,103) as Fecha_Entrega, \n"+
        "Hpedidoc.cnum_doc as Numero, \n"+
        "Hpedidoc.ccod_cliente as Codigo_Cliente, \n"+
        "hcliente.cnum_ruc as RUC_Cliente, \n"+
        "Hpedidoc.cnom_cliente as Nombre_Cliente, \n"+
        "Hvended.ccod_vendedor as Codigo_Vendedor, \n"+
        "Hvended.cnom_vendedor as Vendedor, \n"+
        "Hpedidoc.cmoneda as Moneda, \n"+
        "Hpedidoc.tipo_cambio as Tipo_Cambio, \n"+
        "case Hpedidoc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hpedidoc.cmoneda when 'S/' then Hpedidoc.subtotal_sin_descuentos else Hpedidoc.subtotal_sin_descuentos*Hpedidoc.tipo_cambio end" : "case Hpedidoc.cmoneda when '$' then Hpedidoc.subtotal_sin_descuentos else Hpedidoc.subtotal_sin_descuentos/Hpedidoc.tipo_cambio end") : "Hpedidoc.subtotal_sin_descuentos") +" end as Base_Calculada, \n"+
        "case Hpedidoc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hpedidoc.cmoneda when 'S/' then Hpedidoc.erp_Ddescuento else Hpedidoc.erp_Ddescuento*Hpedidoc.tipo_cambio end" : "case Hpedidoc.cmoneda when '$' then Hpedidoc.erp_Ddescuento else Hpedidoc.erp_Ddescuento/Hpedidoc.tipo_cambio end") : "Hpedidoc.erp_Ddescuento") +" end as Descuento, \n"+
        "case Hpedidoc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hpedidoc.cmoneda when 'S/' then Hpedidoc.erp_Dsubtotal else Hpedidoc.erp_Dsubtotal*Hpedidoc.tipo_cambio end" : "case Hpedidoc.cmoneda when '$' then Hpedidoc.erp_Dsubtotal else Hpedidoc.erp_Dsubtotal/Hpedidoc.tipo_cambio end") : "Hpedidoc.erp_Dsubtotal") +" end as Base_Imponible, \n"+
        "case Hpedidoc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hpedidoc.cmoneda when 'S/' then Hpedidoc.erp_Digv else Hpedidoc.erp_Digv*Hpedidoc.tipo_cambio end" : "case Hpedidoc.cmoneda when '$' then Hpedidoc.erp_Digv else Hpedidoc.erp_Digv/Hpedidoc.tipo_cambio end") : "Hpedidoc.erp_Digv") +" end as Igv, \n"+
        "case Hpedidoc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hpedidoc.cmoneda when 'S/' then Hpedidoc.erp_Dimporte else Hpedidoc.erp_Dimporte*Hpedidoc.tipo_cambio end" : "case Hpedidoc.cmoneda when '$' then Hpedidoc.erp_Dimporte else Hpedidoc.erp_Dimporte/Hpedidoc.tipo_cambio end") : "Hpedidoc.erp_Dimporte") +" end as Importe, \n"+
        "Hpedidoc.estado as Estado, \n"+
        "Hpedidoc.atencion as Atencion, \n"+
        "Hpedidoc.porcentaje as Porcentaje, \n"+
        "case Hpedidoc.ot when '00' then '' else Hpedidoc.ot end as Codigo_Orden_Trabajo, \n"+
        "case Hpedidoc.ot when '00' then '' else Horden_trabajo.cnom_ot end as Orden_Trabajo, \n"+
        "case Hpedidoc.erp_codune when '00' then '' else Hpedidoc.erp_codune end as Codigo_Unidad_Negocio, \n"+
        "case Hpedidoc.erp_codune when '00' then '' else erp_unidad_negocio.erp_nomune end as Unidad_Negocio, \n"+
        "case Hpedidoc.ccod_cencos when '00' then '' else Hpedidoc.ccod_cencos end as Codigo_Centro_Costo, \n"+
        "case Hpedidoc.ccod_cencos when '00' then '' else Hcencos.cnom_cencos end as Centro_Costo, \n"+
        "case Hpedidoc.ccod_forpago when '00' then '' else Hpedidoc.ccod_forpago end as Codigo_Forma_Pago, \n"+
        "case Hpedidoc.ccod_forpago when '00' then '' else Hfor_pag.cnom_forpago end as Forma_Pago, \n"+
        "case Hpedidoc.aprobado when 'Sin Aprobacion' then '' else CONVERT(VARCHAR,Hpedidoc.fecha_aprobacion,103) end as Fecha_Aprobacion, \n"+
        "case Hpedidoc.aprobado when 'Sin Aprobacion' then '' else (Aprobacion.ape_pat+' '+Aprobacion.ape_mat+' '+Aprobacion.nombres) end as Responsable_Aprobacion, \n"+
        "Hpedidoc.usuario as Usuario, \n"+
        "Hpedidoc.Pc_User as Pc_User, \n"+
        "Hpedidoc.Pc_Fecha as Pc_Fecha, \n"+
        "Hpedidoc.Pc_Ip as Pc_Ip, \n"+
        
        "Hpedidod.nitem as item, \n"+
        "case Hpedidoc.estado when 'Anulado' then '0' else Hpedidod.ncantidad3 end as Cantidad, \n"+
        "case Hpedidoc.estado when 'Anulado' then '0' else isnull((select sum(Hmoviald.ncantidad3) \n"+
        "from Hmoviald \n"+
        "inner join Hmovialc on \n"+
        "Hmoviald.CCOD_EMPRESA = Hmovialc.CCOD_EMPRESA and  \n"+
        "Hmoviald.CCOD_ALMACEN = Hmovialc.CCOD_ALMACEN and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = Hmovialc.CCOD_MOVIMIENTO and  \n"+
        "Hmoviald.CTIP_MOVIMIENTO = Hmovialc.CTIP_MOVIMIENTO and  \n"+
        "Hmoviald.CNUM_SERIE = Hmovialc.CNUM_SERIE and  \n"+
        "Hmoviald.CNUM_DOC = Hmovialc.CNUM_DOC  \n"+
        "where \n"+
        "Hmoviald.ccod_empresa = Hpedidod.ccod_empresa and \n"+
        "Hmoviald.CCOD_ALMACEN = Hpedidod.ccod_almacen and \n"+
        "Hmoviald.motivo_pedido = Hpedidod.idmotivo_venta and \n"+
        "Hmoviald.doc_origen_pedido = Hpedidod.cnum_doc and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = '09' and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hpedidod.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hpedidod.nitem),0) end as Cantidad_Atendida,\n"+
        "case Hpedidoc.estado when 'Anulado' then '0' else Hpedidod.ncantidad3 - isnull((select sum(Hmoviald.ncantidad3) \n"+
        "from Hmoviald \n"+
        "inner join Hmovialc on \n"+
        "Hmoviald.CCOD_EMPRESA = Hmovialc.CCOD_EMPRESA and  \n"+
        "Hmoviald.CCOD_ALMACEN = Hmovialc.CCOD_ALMACEN and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = Hmovialc.CCOD_MOVIMIENTO and  \n"+
        "Hmoviald.CTIP_MOVIMIENTO = Hmovialc.CTIP_MOVIMIENTO and  \n"+
        "Hmoviald.CNUM_SERIE = Hmovialc.CNUM_SERIE and  \n"+
        "Hmoviald.CNUM_DOC = Hmovialc.CNUM_DOC  \n"+
        "where \n"+
        "Hmoviald.ccod_empresa = Hpedidod.ccod_empresa and \n"+
        "Hmoviald.CCOD_ALMACEN = Hpedidod.ccod_almacen and \n"+
        "Hmoviald.motivo_pedido = Hpedidod.idmotivo_venta and \n"+
        "Hmoviald.doc_origen_pedido = Hpedidod.cnum_doc and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = '09' and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hpedidod.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hpedidod.nitem),0)  end as Cantidad_Saldo, \n"+
        "case Hpedidoc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hpedidoc.cmoneda when 'S/' then Hpedidod.nprecio  else Hpedidod.nprecio * Hpedidoc.tipo_cambio end" : "case Hpedidoc.cmoneda when '$' then Hpedidod.nprecio  else Hpedidod.nprecio / Hpedidoc.tipo_cambio end") : "Hpedidod.nprecio ") +" end as Unit, \n"+
        "Hpedidod.ccod_articulo as Codigo_Articulo, \n"+
        "Harticul.ccod_interno as Codigo_Fabricante, \n"+
        "hfam_art.cfamilia as Codigo_Familia, \n"+
        "hfam_art.cnom_familia as Familia, \n"+
        "Hsubfamilia_art.ccod_subfamilia as Codigo_SubFamilia, \n"+
        "Hsubfamilia_art.cnom_subfamilia as SubFamilia, \n"+
        "Harticul.cnom_articulo as Nombre_Articulo, \n"+
        "Hpedidod.nombre_presentacion as Nombre_Presentacion, \n"+
        "Hpedidod.cunidad as Unidad, \n"+
        "case Hpedidoc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hpedidoc.cmoneda when 'S/' then Hpedidod.erp_base_calc_dec else Hpedidod.erp_base_calc_dec*Hpedidoc.tipo_cambio end" : "case Hpedidoc.cmoneda when '$' then Hpedidod.erp_base_calc_dec else Hpedidod.erp_base_calc_dec/Hpedidoc.tipo_cambio end") : "Hpedidod.erp_base_calc_dec") +" end as Detalle_Base_Calculada, \n"+
        "case Hpedidoc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hpedidoc.cmoneda when 'S/' then Hpedidod.monto_descuento else Hpedidod.monto_descuento*Hpedidoc.tipo_cambio end" : "case Hpedidoc.cmoneda when '$' then Hpedidod.monto_descuento else Hpedidod.monto_descuento/Hpedidoc.tipo_cambio end") : "Hpedidod.monto_descuento") +" end as Detalle_Descuento, \n"+
        "case Hpedidoc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hpedidoc.cmoneda when 'S/' then Hpedidod.erp_base_imp_dec else Hpedidod.erp_base_imp_dec*Hpedidoc.tipo_cambio end" : "case Hpedidoc.cmoneda when '$' then Hpedidod.erp_base_imp_dec else Hpedidod.erp_base_imp_dec/Hpedidoc.tipo_cambio end") : "Hpedidod.erp_base_imp_dec") +" end as Detalle_Base_Imponible, \n"+
        "case Hpedidoc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hpedidoc.cmoneda when 'S/' then Hpedidod.erp_igv_dec else Hpedidod.erp_igv_dec*Hpedidoc.tipo_cambio end" : "case Hpedidoc.cmoneda when '$' then Hpedidod.erp_igv_dec else Hpedidod.erp_igv_dec/Hpedidoc.tipo_cambio end") : "Hpedidod.erp_igv_dec") +" end as Detalle_IGV, \n"+
        "case Hpedidoc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hpedidoc.cmoneda when 'S/' then Hpedidod.erp_importe_dec else Hpedidod.erp_importe_dec*Hpedidoc.tipo_cambio end" : "case Hpedidoc.cmoneda when '$' then Hpedidod.erp_importe_dec else Hpedidod.erp_importe_dec/Hpedidoc.tipo_cambio end") : "Hpedidod.erp_importe_dec") +" end as Detalle_Importe, \n"+

        "(select sum(n_cantidad) from ( \n"+
        "select ROW_NUMBER() over (order by Hmoviald.cnum_doc) as orden, Hmoviald.ncantidad3 as n_cantidad \n"+
        "from Hmoviald  \n"+
        "inner join Hmovialc on \n"+
        "Hmoviald.CCOD_EMPRESA = Hmovialc.CCOD_EMPRESA and  \n"+
        "Hmoviald.CCOD_ALMACEN = Hmovialc.CCOD_ALMACEN and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = Hmovialc.CCOD_MOVIMIENTO and  \n"+
        "Hmoviald.CTIP_MOVIMIENTO = Hmovialc.CTIP_MOVIMIENTO and  \n"+
        "Hmoviald.CNUM_SERIE = Hmovialc.CNUM_SERIE and  \n"+
        "Hmoviald.CNUM_DOC = Hmovialc.CNUM_DOC  \n"+
        "where \n"+
        "Hmoviald.ccod_empresa = Hpedidod.ccod_empresa and \n"+
        "Hmoviald.CCOD_ALMACEN = Hpedidod.ccod_almacen and \n"+
        "Hmoviald.motivo_pedido = Hpedidod.idmotivo_venta and \n"+
        "Hmoviald.doc_origen_pedido = Hpedidod.cnum_doc and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = '09' and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hpedidod.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hpedidod.nitem \n"+
        ") as d where orden='1' ) as Guia_1, \n"+
        "(select n_documento_referencia from ( \n"+
        "select ROW_NUMBER() over (order by Hmoviald.cnum_doc) as orden, Hmoviald.cnum_doc as n_documento_referencia \n"+
        "from Hmoviald  \n"+
        "inner join Hmovialc on  \n"+
        "Hmoviald.CCOD_EMPRESA = Hmovialc.CCOD_EMPRESA and  \n"+
        "Hmoviald.CCOD_ALMACEN = Hmovialc.CCOD_ALMACEN and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = Hmovialc.CCOD_MOVIMIENTO and  \n"+
        "Hmoviald.CTIP_MOVIMIENTO = Hmovialc.CTIP_MOVIMIENTO and  \n"+
        "Hmoviald.CNUM_SERIE = Hmovialc.CNUM_SERIE and  \n"+
        "Hmoviald.CNUM_DOC = Hmovialc.CNUM_DOC  \n"+
        "where \n"+
        "Hmoviald.ccod_empresa = Hpedidod.ccod_empresa and \n"+
        "Hmoviald.CCOD_ALMACEN = Hpedidod.ccod_almacen and \n"+
        "Hmoviald.motivo_pedido = Hpedidod.idmotivo_venta and \n"+
        "Hmoviald.doc_origen_pedido = Hpedidod.cnum_doc and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = '09' and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hpedidod.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hpedidod.nitem \n"+
        ") as d where orden='1' ) as  Referencia_Guia_1, \n"+
        "(select sum(n_cantidad) from ( \n"+
        "select ROW_NUMBER() over (order by Hmoviald.cnum_doc) as orden, Hmoviald.ncantidad3 as n_cantidad \n"+
        "from Hmoviald  \n"+
        "inner join Hmovialc on \n"+
        "Hmoviald.CCOD_EMPRESA = Hmovialc.CCOD_EMPRESA and  \n"+
        "Hmoviald.CCOD_ALMACEN = Hmovialc.CCOD_ALMACEN and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = Hmovialc.CCOD_MOVIMIENTO and  \n"+
        "Hmoviald.CTIP_MOVIMIENTO = Hmovialc.CTIP_MOVIMIENTO and  \n"+
        "Hmoviald.CNUM_SERIE = Hmovialc.CNUM_SERIE and  \n"+
        "Hmoviald.CNUM_DOC = Hmovialc.CNUM_DOC  \n"+
        "where \n"+
        "Hmoviald.ccod_empresa = Hpedidod.ccod_empresa and \n"+
        "Hmoviald.CCOD_ALMACEN = Hpedidod.ccod_almacen and \n"+
        "Hmoviald.motivo_pedido = Hpedidod.idmotivo_venta and \n"+
        "Hmoviald.doc_origen_pedido = Hpedidod.cnum_doc and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hpedidod.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hpedidod.nitem \n"+
        ") as d where orden='2' ) as Guia_2, \n"+
        "(select n_documento_referencia from ( \n"+
        "select ROW_NUMBER() over (order by Hmoviald.cnum_doc) as orden, Hmoviald.cnum_doc as n_documento_referencia \n"+
        "from Hmoviald  \n"+
        "inner join Hmovialc on  \n"+
        "Hmoviald.CCOD_EMPRESA = Hmovialc.CCOD_EMPRESA and  \n"+
        "Hmoviald.CCOD_ALMACEN = Hmovialc.CCOD_ALMACEN and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = Hmovialc.CCOD_MOVIMIENTO and  \n"+
        "Hmoviald.CTIP_MOVIMIENTO = Hmovialc.CTIP_MOVIMIENTO and  \n"+
        "Hmoviald.CNUM_SERIE = Hmovialc.CNUM_SERIE and  \n"+
        "Hmoviald.CNUM_DOC = Hmovialc.CNUM_DOC  \n"+
        "where \n"+
        "Hmoviald.ccod_empresa = Hpedidod.ccod_empresa and \n"+
        "Hmoviald.CCOD_ALMACEN = Hpedidod.ccod_almacen and \n"+
        "Hmoviald.motivo_pedido = Hpedidod.idmotivo_venta and \n"+
        "Hmoviald.doc_origen_pedido = Hpedidod.cnum_doc and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = '09' and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hpedidod.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hpedidod.nitem \n"+
        ") as d where orden='2' ) as  Referencia_Guia_2, \n"+
        "(select sum(n_cantidad) from ( \n"+
        "select ROW_NUMBER() over (order by Hmoviald.cnum_doc) as orden, Hmoviald.ncantidad3 as n_cantidad \n"+
        "from Hmoviald  \n"+
        "inner join Hmovialc on \n"+
        "Hmoviald.CCOD_EMPRESA = Hmovialc.CCOD_EMPRESA and  \n"+
        "Hmoviald.CCOD_ALMACEN = Hmovialc.CCOD_ALMACEN and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = Hmovialc.CCOD_MOVIMIENTO and  \n"+
        "Hmoviald.CTIP_MOVIMIENTO = Hmovialc.CTIP_MOVIMIENTO and  \n"+
        "Hmoviald.CNUM_SERIE = Hmovialc.CNUM_SERIE and  \n"+
        "Hmoviald.CNUM_DOC = Hmovialc.CNUM_DOC  \n"+
        "where \n"+
        "Hmoviald.ccod_empresa = Hpedidod.ccod_empresa and \n"+
        "Hmoviald.CCOD_ALMACEN = Hpedidod.ccod_almacen and \n"+
        "Hmoviald.motivo_pedido = Hpedidod.idmotivo_venta and \n"+
        "Hmoviald.doc_origen_pedido = Hpedidod.cnum_doc and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = '09' and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hpedidod.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hpedidod.nitem \n"+
        ") as d where orden='3' ) as Guia_3, \n"+
        "(select n_documento_referencia from ( \n"+
        "select ROW_NUMBER() over (order by Hmoviald.cnum_doc) as orden, Hmoviald.cnum_doc as n_documento_referencia \n"+
        "from Hmoviald  \n"+
        "inner join Hmovialc on  \n"+
        "Hmoviald.CCOD_EMPRESA = Hmovialc.CCOD_EMPRESA and  \n"+
        "Hmoviald.CCOD_ALMACEN = Hmovialc.CCOD_ALMACEN and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = Hmovialc.CCOD_MOVIMIENTO and  \n"+
        "Hmoviald.CTIP_MOVIMIENTO = Hmovialc.CTIP_MOVIMIENTO and  \n"+
        "Hmoviald.CNUM_SERIE = Hmovialc.CNUM_SERIE and  \n"+
        "Hmoviald.CNUM_DOC = Hmovialc.CNUM_DOC  \n"+
        "where \n"+
        "Hmoviald.ccod_empresa = Hpedidod.ccod_empresa and \n"+
        "Hmoviald.CCOD_ALMACEN = Hpedidod.ccod_almacen and \n"+
        "Hmoviald.motivo_pedido = Hpedidod.idmotivo_venta and \n"+
        "Hmoviald.doc_origen_pedido = Hpedidod.cnum_doc and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = '09' and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hpedidod.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hpedidod.nitem \n"+
        ") as d where orden='3' ) as  Referencia_Guia_3, \n"+
        "(select sum(n_cantidad) from ( \n"+
        "select ROW_NUMBER() over (order by Hmoviald.cnum_doc) as orden, Hmoviald.ncantidad3 as n_cantidad \n"+
        "from Hmoviald  \n"+
        "inner join Hmovialc on \n"+
        "Hmoviald.CCOD_EMPRESA = Hmovialc.CCOD_EMPRESA and  \n"+
        "Hmoviald.CCOD_ALMACEN = Hmovialc.CCOD_ALMACEN and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = Hmovialc.CCOD_MOVIMIENTO and  \n"+
        "Hmoviald.CTIP_MOVIMIENTO = Hmovialc.CTIP_MOVIMIENTO and  \n"+
        "Hmoviald.CNUM_SERIE = Hmovialc.CNUM_SERIE and  \n"+
        "Hmoviald.CNUM_DOC = Hmovialc.CNUM_DOC  \n"+
        "where \n"+
        "Hmoviald.ccod_empresa = Hpedidod.ccod_empresa and \n"+
        "Hmoviald.CCOD_ALMACEN = Hpedidod.ccod_almacen and \n"+
        "Hmoviald.motivo_pedido = Hpedidod.idmotivo_venta and \n"+
        "Hmoviald.doc_origen_pedido = Hpedidod.cnum_doc and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = '09' and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hpedidod.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hpedidod.nitem \n"+
        ") as d where orden='4' ) as Guia_4, \n"+
        "(select n_documento_referencia from ( \n"+
        "select ROW_NUMBER() over (order by Hmoviald.cnum_doc) as orden, Hmoviald.cnum_doc as n_documento_referencia \n"+
        "from Hmoviald  \n"+
        "inner join Hmovialc on  \n"+
        "Hmoviald.CCOD_EMPRESA = Hmovialc.CCOD_EMPRESA and  \n"+
        "Hmoviald.CCOD_ALMACEN = Hmovialc.CCOD_ALMACEN and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = Hmovialc.CCOD_MOVIMIENTO and  \n"+
        "Hmoviald.CTIP_MOVIMIENTO = Hmovialc.CTIP_MOVIMIENTO and  \n"+
        "Hmoviald.CNUM_SERIE = Hmovialc.CNUM_SERIE and  \n"+
        "Hmoviald.CNUM_DOC = Hmovialc.CNUM_DOC  \n"+
        "where \n"+
        "Hmoviald.ccod_empresa = Hpedidod.ccod_empresa and \n"+
        "Hmoviald.CCOD_ALMACEN = Hpedidod.ccod_almacen and \n"+
        "Hmoviald.motivo_pedido = Hpedidod.idmotivo_venta and \n"+
        "Hmoviald.doc_origen_pedido = Hpedidod.cnum_doc and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = '09' and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hpedidod.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hpedidod.nitem \n"+
        ") as d where orden='4' ) as  Referencia_Guia_4, \n"+
        "(select sum(n_cantidad) from ( \n"+
        "select ROW_NUMBER() over (order by Hmoviald.cnum_doc) as orden, Hmoviald.ncantidad3 as n_cantidad \n"+
        "from Hmoviald  \n"+
        "inner join Hmovialc on \n"+
        "Hmoviald.CCOD_EMPRESA = Hmovialc.CCOD_EMPRESA and  \n"+
        "Hmoviald.CCOD_ALMACEN = Hmovialc.CCOD_ALMACEN and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = Hmovialc.CCOD_MOVIMIENTO and  \n"+
        "Hmoviald.CTIP_MOVIMIENTO = Hmovialc.CTIP_MOVIMIENTO and  \n"+
        "Hmoviald.CNUM_SERIE = Hmovialc.CNUM_SERIE and  \n"+
        "Hmoviald.CNUM_DOC = Hmovialc.CNUM_DOC  \n"+
        "where \n"+
        "Hmoviald.ccod_empresa = Hpedidod.ccod_empresa and \n"+
        "Hmoviald.CCOD_ALMACEN = Hpedidod.ccod_almacen and \n"+
        "Hmoviald.motivo_pedido = Hpedidod.idmotivo_venta and \n"+
        "Hmoviald.doc_origen_pedido = Hpedidod.cnum_doc and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = '09' and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hpedidod.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hpedidod.nitem \n"+
        ") as d where orden='5' ) as Guia_5, \n"+
        "(select n_documento_referencia from ( \n"+
        "select ROW_NUMBER() over (order by Hmoviald.cnum_doc) as orden, Hmoviald.cnum_doc as n_documento_referencia \n"+
        "from Hmoviald  \n"+
        "inner join Hmovialc on  \n"+
        "Hmoviald.CCOD_EMPRESA = Hmovialc.CCOD_EMPRESA and  \n"+
        "Hmoviald.CCOD_ALMACEN = Hmovialc.CCOD_ALMACEN and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = Hmovialc.CCOD_MOVIMIENTO and  \n"+
        "Hmoviald.CTIP_MOVIMIENTO = Hmovialc.CTIP_MOVIMIENTO and  \n"+
        "Hmoviald.CNUM_SERIE = Hmovialc.CNUM_SERIE and  \n"+
        "Hmoviald.CNUM_DOC = Hmovialc.CNUM_DOC  \n"+
        "where \n"+
        "Hmoviald.ccod_empresa = Hpedidod.ccod_empresa and \n"+
        "Hmoviald.CCOD_ALMACEN = Hpedidod.ccod_almacen and \n"+
        "Hmoviald.motivo_pedido = Hpedidod.idmotivo_venta and \n"+
        "Hmoviald.doc_origen_pedido = Hpedidod.cnum_doc and  \n"+
        "Hmoviald.CCOD_MOVIMIENTO = '09' and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hpedidod.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hpedidod.nitem \n"+
        ") as d where orden='5' ) as  Referencia_Guia_5 \n"+
        
        "from Hpedidoc \n"+
        "inner join Hpedidod on \n"+
        "Hpedidoc.ccod_empresa = Hpedidod.ccod_empresa and \n"+
        "Hpedidoc.ccod_almacen = Hpedidod.ccod_almacen and \n"+
        "Hpedidoc.idmotivo_venta = Hpedidod.idmotivo_venta and \n"+
        "Hpedidoc.cnum_doc = Hpedidod.cnum_doc \n"+
        "Inner Join erp_motivos_tramite on \n"+
        "Hpedidod.ccod_empresa = erp_motivos_tramite.erp_codemp \n"+
        "and Hpedidoc.idmotivo_venta = erp_motivos_tramite.erp_codmot \n"+
        "Inner Join hcliente on \n"+
        "Hpedidoc.ccod_empresa = hcliente.ccod_empresa \n"+
        "and Hpedidoc.ccod_cliente = hcliente.ccod_cliente \n"+
        "Inner Join Harticul on \n"+
        "Hpedidod.ccod_empresa = Harticul.ccod_empresa \n"+
        "and Hpedidod.ccod_articulo = Harticul.ccod_articulo \n"+
        "Inner Join hfam_art on \n"+
        "hfam_art.ccod_empresa = Harticul.ccod_empresa \n"+
        "and hfam_art.cfamilia = Harticul.cfamilia \n"+
        "Inner Join Hsubfamilia_art on \n"+
        "Hsubfamilia_art.ccod_empresa = Harticul.ccod_empresa \n"+
        "and Hsubfamilia_art.ccod_subfamilia = Harticul.ccod_subfamilia \n"+
        "inner join Hfor_pag on \n"+
        "Hpedidoc.ccod_empresa = Hfor_pag.ccod_empresa and \n"+
        "Hpedidoc.ccod_forpago = Hfor_pag.ccod_forpago \n"+
        "inner join Hvended on \n"+
        "Hpedidoc.ccod_empresa = Hvended.ccod_empresa and \n"+
        "Hpedidoc.ccod_person = Hvended.ccod_vendedor \n"+
        "inner join Hperson Aprobacion on \n"+
        "Hpedidoc.ccod_empresa = Aprobacion.ccod_empresa and \n"+
        "Hpedidoc.responsable_aprobacion = Aprobacion.ccod_person \n"+
        "inner join Hcencos on \n"+
        "Hpedidoc.ccod_empresa = Hcencos.ccod_empresa \n"+
        "and Hpedidoc.ccod_cencos = Hcencos.ccod_cencos \n"+
        "inner join Horden_trabajo on \n"+
        "Hpedidoc.ccod_empresa = Horden_trabajo.ccod_empresa \n"+
        "and Hpedidoc.ot = Horden_trabajo.ccod_ot \n"+
        "inner join erp_unidad_negocio on \n"+
        "Hpedidoc.ccod_empresa = erp_unidad_negocio.erp_codemp \n"+
        "and Hpedidoc.erp_codune = erp_unidad_negocio.erp_codune \n"+
        "where Hpedidoc.ccod_empresa = @codigo_empresa \n"+
        "and Hpedidoc.atencion <> case @estado_atencion when 'Todos' then '' else 'Atendido' end  \n"+
        "and Hpedidoc.ccod_almacen = @codigo_punto_venta \n"+ 
        (agrupacion1_valores == "" ? "" : "and "+columnas[agrupacion1_tipo]+" in ("+agrupacion1_valores +") \n")+
        (agrupacion2_valores == "" ? "" : "and "+columnas[agrupacion2_tipo]+" in ("+agrupacion2_valores +") \n")+
        (agrupacion3_valores == "" ? "" : "and "+columnas[agrupacion3_tipo]+" in ("+agrupacion3_valores +") \n")+
        "and Hpedidoc.dfecha_doc between @fecha_inicio and @fecha_termino \n"

        
        if(tipo_reporte=="resumido"){
            query = 
                "select  \n"+
                "Punto_Venta, \n"+
                "Motivo, \n"+
                "Fecha, \n"+
                "Numero, \n"+
                "Codigo_Cliente, \n"+
                "RUC_Cliente, \n"+
                "Nombre_Cliente, \n"+
                "Moneda, \n"+
                "Tipo_Cambio, \n"+
                "Base_Calculada, \n"+
                "Descuento, \n"+
                "Base_Imponible, \n"+
                "Igv, \n"+
                "Importe, \n"+
                "Estado, \n"+
                "Atencion, \n"+
                "Porcentaje, \n"+
                "Codigo_Vendedor, \n"+
                "Vendedor, \n"+
                "Codigo_Unidad_Negocio, \n"+
                "Unidad_Negocio, \n"+
                "Codigo_Centro_Costo, \n"+
                "Centro_Costo, \n"+
                "Fecha_Aprobacion, \n"+
                "Responsable_Aprobacion, \n"+
                "Usuario, \n"+
                "Pc_User, \n"+
                "Pc_Fecha, \n"+
                "Pc_Ip, \n"+
                "SUM(Cantidad), \n"+
                "SUM(Cantidad_Atendida), \n"+
                "SUM(Cantidad_Saldo), \n"+
                "SUM(Unit) \n"+
                "from ( \n"+
                query +
                " ) as t \n"+
                "group by  \n"+
                "Punto_Venta, \n"+
                "Motivo, \n"+
                "Fecha, \n"+
                "Numero, \n"+
                "Codigo_Cliente, \n"+
                "RUC_Cliente, \n"+
                "Nombre_Cliente, \n"+
                "Moneda, \n"+
                "Tipo_Cambio, \n"+
                "Base_Calculada, \n"+
                "Descuento, \n"+
                "Base_Imponible, \n"+
                "Igv, \n"+
                "Importe, \n"+
                "Estado, \n"+
                "Atencion, \n"+
                "Porcentaje, \n"+
                "Codigo_Vendedor, \n"+
                "Vendedor, \n"+
                "Codigo_Unidad_Negocio, \n"+
                "Unidad_Negocio, \n"+
                "Codigo_Centro_Costo, \n"+
                "Centro_Costo, \n"+
                "Fecha_Aprobacion, \n"+
                "Responsable_Aprobacion, \n"+
                "Usuario, \n"+
                "Pc_User, \n"+
                "Pc_Fecha, \n"+
                "Pc_Ip \n"+
                "order by \n"+
                (columnas_order[agrupacion1_tipo] ? columnas_order[agrupacion1_tipo] : "Punto_Venta") +", \n"+
                (columnas_order[agrupacion2_tipo] ? columnas_order[agrupacion2_tipo] : "Motivo") +", \n"+
                (columnas_order[agrupacion3_tipo] ? columnas_order[agrupacion3_tipo] : "Numero") +" \n";
        }else{
            query += 
                " order by \n"+
                (columnas_order[agrupacion1_tipo] ? columnas_order[agrupacion1_tipo] : "Punto_Venta") +", \n"+
                (columnas_order[agrupacion2_tipo] ? columnas_order[agrupacion2_tipo] : "Motivo") +", \n"+
                (columnas_order[agrupacion3_tipo] ? columnas_order[agrupacion3_tipo] : "Numero") +",item \n";
        }
        
        
        const pool = await poolPromise;
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(10), codigo_punto_venta)
        .input('estado_atencion', mssql.VarChar(250), req.body.estado_atencion)
        .input('fecha_inicio', mssql.Date, req.body.fecha_inicio)
        .input('fecha_termino', mssql.Date, req.body.fecha_termino)
        .input('agrupacion1_tipo', mssql.VarChar(250), agrupacion1_tipo)
        .input('agrupacion2_tipo', mssql.VarChar(250), agrupacion2_tipo)
        .input('agrupacion3_tipo', mssql.VarChar(250), agrupacion3_tipo)
        .query(query);
    
        const recordset = lista.recordset;
        res.json(recordset);
    }catch(err){
        console.log(err.message);
        res.send(err.message);
    }
});

router.post('/guia/:tipo_reporte', async (req, res) => {
    try{
        const {tipo_reporte} = req.params;
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.body.punto_venta;
        var columnas = {
            centro_costos: "HMOVIALC.ccod_cencos",
            unidad_negocio: "HMOVIALC.erp_codune",
            orden_trabajo: "HMOVIALC.ot",
            serie_documento: "HMOVIALC.cnum_serie",
            codigo_cliente: "HMOVIALC.ccod_cliente",
            forma_pago_lista: "HMOVIALC.ccod_forpago",
            articulos: "HMOVIALD.ccod_articulo",
        }
        var columnas_order = {
            responsable_aprobacion: "Codigo_Aprobacion_1",
            responsable_aprobacion_2: "Codigo_Aprobacion_2",
            centro_costos: "Codigo_Centro_Costo",
            unidad_negocio: "Codigo_Unidad_Negocio",
            orden_trabajo: "Codigo_Orden_Trabajo",
            motivos_tramite: "Codigo_Motivo",
            articulos: "Codigo_Articulo"
        }
        
        var agrupacion1_valores = req.body.agrupacion1_valores;
        var agrupacion2_valores = req.body.agrupacion2_valores;
        var agrupacion3_valores = req.body.agrupacion3_valores;
        var agrupacion1_tipo = req.body.agrupacion1_tipo;
        var agrupacion2_tipo = req.body.agrupacion2_tipo;
        var agrupacion3_tipo = req.body.agrupacion3_tipo;
        var agrupacion0_tipo_moneda= req.body.agrupacion0_tipo_moneda;
        var agrupacion0_moneda= req.body.agrupacion0_moneda;

        var query = 
        "select \n"+
        "Hmovialc.ccod_almacen as Punto_Venta, \n"+
        "Hmovialc.tipo_venta as Tipo_Venta, \n"+
        "CONVERT(VARCHAR,Hmovialc.dfecha_doc,103) as Fecha, \n"+
        "CONVERT(VARCHAR,Hmovialc.dfecha_entr,103) as Fecha_Entrega, \n"+
        "Hmovialc.ccod_movimiento as Movimiento, \n"+
        "Hmovialc.cnum_serie as Serie, \n"+
        "Hmovialc.cnum_doc as Numero, \n"+
        "Hmovialc.ccod_cliente as Codigo_Cliente, \n"+
        "hcliente.cnum_ruc as RUC_Cliente, \n"+
        "Hmovialc.cnom_cliente_v as Nombre_Cliente, \n"+
        "Hmovialc.cmoneda as Moneda, \n"+
        "Hmovialc.tipo_cambio as Tipo_Cambio, \n"+
        "case Hmovialc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hmovialc.cmoneda when 'S/' then Hmovialc.subtotal_sin_descuentos else Hmovialc.subtotal_sin_descuentos*Hmovialc.tipo_cambio end" : "case Hmovialc.cmoneda when '$' then Hmovialc.subtotal_sin_descuentos else Hmovialc.subtotal_sin_descuentos/Hmovialc.tipo_cambio end") : "Hmovialc.subtotal_sin_descuentos") +" end as Base_Calculada, \n"+
        "case Hmovialc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hmovialc.cmoneda when 'S/' then Hmovialc.erp_Ddescuento else Hmovialc.erp_Ddescuento*Hmovialc.tipo_cambio end" : "case Hmovialc.cmoneda when '$' then Hmovialc.erp_Ddescuento else Hmovialc.erp_Ddescuento/Hmovialc.tipo_cambio end") : "Hmovialc.erp_Ddescuento") +" end as Descuento, \n"+
        "case Hmovialc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hmovialc.cmoneda when 'S/' then Hmovialc.erp_Dsubtotal else Hmovialc.erp_Dsubtotal*Hmovialc.tipo_cambio end" : "case Hmovialc.cmoneda when '$' then Hmovialc.erp_Dsubtotal else Hmovialc.erp_Dsubtotal/Hmovialc.tipo_cambio end") : "Hmovialc.erp_Dsubtotal") +" end as Base_Imponible, \n"+
        "case Hmovialc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hmovialc.cmoneda when 'S/' then Hmovialc.erp_Digv else Hmovialc.erp_Digv*Hmovialc.tipo_cambio end" : "case Hmovialc.cmoneda when '$' then Hmovialc.erp_Digv else Hmovialc.erp_Digv/Hmovialc.tipo_cambio end") : "Hmovialc.erp_Digv") +" end as Igv, \n"+
        "case Hmovialc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hmovialc.cmoneda when 'S/' then Hmovialc.erp_Dimporte else Hmovialc.erp_Dimporte*Hmovialc.tipo_cambio end" : "case Hmovialc.cmoneda when '$' then Hmovialc.erp_Dimporte else Hmovialc.erp_Dimporte/Hmovialc.tipo_cambio end") : "Hmovialc.erp_Dimporte") +" end as Importe, \n"+
        "Hmovialc.estado as Estado, \n"+
        "Hmovialc.atencion as Atencion, \n"+
        "Hmovialc.porcentaje as Porcentaje, \n"+
        "Hmovialc.pto_partida_02 as Punto_Partida, \n"+
        "Hmovialc.pto_llegada_02 as Punto_Llegada, \n"+
        "Hmotivo_traslado.nombre_motivo as Motivo_Traslado, \n"+
        "Htransp.cnom_transportista as Transport, \n"+
        "Hvehiculo.placa1 as Vehiculo, \n"+
        "Hchofer.erp_nombre as Chofer, \n"+
        "erp_agencia_transporte.erp_nomagencia as Agencia_Transporte, \n"+
        "case Hmovialc.ot when '00' then '' else Hmovialc.ot end as Codigo_Orden_Trabajo, \n"+
        "case Hmovialc.ot when '00' then '' else Horden_trabajo.cnom_ot end as Orden_Trabajo, \n"+
        "case Hmovialc.erp_codune when '00' then '' else Hmovialc.erp_codune end as Codigo_Unidad_Negocio, \n"+
        "case Hmovialc.erp_codune when '00' then '' else erp_unidad_negocio.erp_nomune end as Unidad_Negocio, \n"+
        "case Hmovialc.ccod_cencos when '00' then '' else Hmovialc.ccod_cencos end as Codigo_Centro_Costo, \n"+
        "case Hmovialc.ccod_cencos when '00' then '' else Hcencos.cnom_cencos end as Centro_Costo, \n"+
        "case Hmovialc.ccod_forpago when '00' then '' else Hmovialc.ccod_forpago end as Codigo_Forma_Pago, \n"+
        "case Hmovialc.ccod_forpago when '00' then '' else Hfor_pag.cnom_forpago end as Forma_Pago, \n"+
        "Hmovialc.usuario as Usuario, \n"+
        "Hmovialc.Pc_User as Pc_User, \n"+
        "Hmovialc.Pc_Fecha as Pc_Fecha, \n"+
        "Hmovialc.Pc_Ip as Pc_Ip, \n"+
        "Hmoviald.nitem as item, \n"+
        "case Hmovialc.estado when 'Anulado' then '0' else Hmoviald.ncantidad3 end as Cantidad, \n"+
        "case Hmovialc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hmovialc.cmoneda when 'S/' then Hmoviald.nprecio_trans  else Hmoviald.nprecio_trans * Hmovialc.tipo_cambio end" : "case Hmovialc.cmoneda when '$' then Hmoviald.nprecio_trans  else Hmoviald.nprecio_trans / Hmovialc.tipo_cambio end") : "Hmoviald.nprecio_trans ") +" end as Unit, \n"+
        "Hmoviald.ccod_articulo as Codigo_Articulo, \n"+
        "Harticul.ccod_interno as Codigo_Fabricante, \n"+
        "hfam_art.cfamilia as Codigo_Familia, \n"+
        "hfam_art.cnom_familia as Familia, \n"+
        "Hsubfamilia_art.ccod_subfamilia as Codigo_SubFamilia, \n"+
        "Hsubfamilia_art.cnom_subfamilia as SubFamilia, \n"+
        "Harticul.cnom_articulo as Nombre_Articulo, \n"+
        "Hmoviald.nombre_presentacion as Nombre_Presentacion, \n"+
        "Hmoviald.cunidad as Unidad, \n"+
        "case Hmovialc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hmovialc.cmoneda when 'S/' then Hmoviald.erp_base_calc_dec else Hmoviald.erp_base_calc_dec*Hmovialc.tipo_cambio end" : "case Hmovialc.cmoneda when '$' then Hmoviald.erp_base_calc_dec else Hmoviald.erp_base_calc_dec/Hmovialc.tipo_cambio end") : "Hmoviald.erp_base_calc_dec") +" end as Detalle_Base_Calculada, \n"+
        "case Hmovialc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hmovialc.cmoneda when 'S/' then Hmoviald.monto_descuento else Hmoviald.monto_descuento*Hmovialc.tipo_cambio end" : "case Hmovialc.cmoneda when '$' then Hmoviald.monto_descuento else Hmoviald.monto_descuento/Hmovialc.tipo_cambio end") : "Hmoviald.monto_descuento") +" end as Detalle_Descuento, \n"+
        "case Hmovialc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hmovialc.cmoneda when 'S/' then Hmoviald.erp_base_imp_dec else Hmoviald.erp_base_imp_dec*Hmovialc.tipo_cambio end" : "case Hmovialc.cmoneda when '$' then Hmoviald.erp_base_imp_dec else Hmoviald.erp_base_imp_dec/Hmovialc.tipo_cambio end") : "Hmoviald.erp_base_imp_dec") +" end as Detalle_Base_Imponible, \n"+
        "case Hmovialc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hmovialc.cmoneda when 'S/' then Hmoviald.erp_igv_dec else Hmoviald.erp_igv_dec*Hmovialc.tipo_cambio end" : "case Hmovialc.cmoneda when '$' then Hmoviald.erp_igv_dec else Hmoviald.erp_igv_dec/Hmovialc.tipo_cambio end") : "Hmoviald.erp_igv_dec") +" end as Detalle_IGV, \n"+
        "case Hmovialc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hmovialc.cmoneda when 'S/' then Hmoviald.erp_importe_dec else Hmoviald.erp_importe_dec*Hmovialc.tipo_cambio end" : "case Hmovialc.cmoneda when '$' then Hmoviald.erp_importe_dec else Hmoviald.erp_importe_dec/Hmovialc.tipo_cambio end") : "Hmoviald.erp_importe_dec") +" end as Detalle_Importe, \n"+

        "(select sum(n_cantidad) from ( \n"+
        "select ROW_NUMBER() over (order by factura_d.cnum_doc) as orden, factura_d.ncantidad3 as n_cantidad \n"+
        "from Hmoviald as factura_d \n"+
        "inner join Hmovialc as factura_c on \n"+
        "factura_d.CCOD_EMPRESA = factura_c.CCOD_EMPRESA and  \n"+
        "factura_d.CCOD_ALMACEN = factura_c.CCOD_ALMACEN and  \n"+
        "factura_d.CCOD_MOVIMIENTO = factura_c.CCOD_MOVIMIENTO and  \n"+
        "factura_d.CTIP_MOVIMIENTO = factura_c.CTIP_MOVIMIENTO and  \n"+
        "factura_d.CNUM_SERIE = factura_c.CNUM_SERIE and  \n"+
        "factura_d.CNUM_DOC = factura_c.CNUM_DOC  \n"+
        "where \n"+
        "factura_d.ccod_empresa = Hmoviald.ccod_empresa and \n"+
        "factura_d.CCOD_ALMACEN = Hmoviald.ccod_almacen and \n"+
        "factura_d.movimiento_origen = Hmoviald.CCOD_MOVIMIENTO and \n"+
        "factura_d.serie_origen = Hmoviald.CNUM_SERIE and \n"+
        "factura_d.cnum_doc_guiaventa = Hmoviald.CNUM_DOC and  \n"+
        "factura_c.estado <> 'Anulado' and \n"+
        "factura_d.ccod_articulo = Hmoviald.ccod_articulo and  \n"+
        "factura_d.erp_itemref = Hmoviald.nitem \n"+
        ") as d where orden='1' ) as Guia_1, \n"+
        "(select n_documento_referencia from ( \n"+
        "select ROW_NUMBER() over (order by factura_d.cnum_doc) as orden, factura_d.cnum_doc as n_documento_referencia \n"+
        "from Hmoviald as factura_d \n"+
        "inner join Hmovialc as factura_c on \n"+
        "factura_d.CCOD_EMPRESA = factura_c.CCOD_EMPRESA and  \n"+
        "factura_d.CCOD_ALMACEN = factura_c.CCOD_ALMACEN and  \n"+
        "factura_d.CCOD_MOVIMIENTO = factura_c.CCOD_MOVIMIENTO and  \n"+
        "factura_d.CTIP_MOVIMIENTO = factura_c.CTIP_MOVIMIENTO and  \n"+
        "factura_d.CNUM_SERIE = factura_c.CNUM_SERIE and  \n"+
        "factura_d.CNUM_DOC = factura_c.CNUM_DOC  \n"+
        "where \n"+
        "factura_d.ccod_empresa = Hmoviald.ccod_empresa and \n"+
        "factura_d.CCOD_ALMACEN = Hmoviald.ccod_almacen and \n"+
        "factura_d.movimiento_origen = Hmoviald.CCOD_MOVIMIENTO and \n"+
        "factura_d.serie_origen = Hmoviald.CNUM_SERIE and \n"+
        "factura_d.cnum_doc_guiaventa = Hmoviald.CNUM_DOC and  \n"+
        "factura_c.estado <> 'Anulado' and \n"+
        "factura_d.ccod_articulo = Hmoviald.ccod_articulo and  \n"+
        "factura_d.erp_itemref = Hmoviald.nitem \n"+
        ") as d where orden='1' ) as  Referencia_Guia_1 \n"+
        
        "from Hmovialc \n"+
        "inner join Hmoviald on \n"+
        "Hmovialc.CCOD_EMPRESA = Hmoviald.CCOD_EMPRESA and  \n"+
        "Hmovialc.CCOD_ALMACEN = Hmoviald.CCOD_ALMACEN and  \n"+
        "Hmovialc.CCOD_MOVIMIENTO = Hmoviald.CCOD_MOVIMIENTO and  \n"+
        "Hmovialc.CTIP_MOVIMIENTO = Hmoviald.CTIP_MOVIMIENTO and  \n"+
        "Hmovialc.CNUM_SERIE = Hmoviald.CNUM_SERIE and  \n"+
        "Hmovialc.CNUM_DOC = Hmoviald.CNUM_DOC  \n"+
        "Inner Join hcliente on \n"+
        "Hmovialc.ccod_empresa = hcliente.ccod_empresa \n"+
        "and Hmovialc.ccod_cliente = hcliente.ccod_cliente \n"+
        "Inner Join Harticul on \n"+
        "Hmoviald.ccod_empresa = Harticul.ccod_empresa \n"+
        "and Hmoviald.ccod_articulo = Harticul.ccod_articulo \n"+
        "Inner Join hfam_art on \n"+
        "hfam_art.ccod_empresa = Harticul.ccod_empresa \n"+
        "and hfam_art.cfamilia = Harticul.cfamilia \n"+
        "Inner Join Hsubfamilia_art on \n"+
        "Hsubfamilia_art.ccod_empresa = Harticul.ccod_empresa \n"+
        "and Hsubfamilia_art.ccod_subfamilia = Harticul.ccod_subfamilia \n"+
        "inner join Hfor_pag on \n"+
        "Hmovialc.ccod_empresa = Hfor_pag.ccod_empresa and \n"+
        "Hmovialc.ccod_forpago = Hfor_pag.ccod_forpago \n"+
        "inner join Hmotivo_traslado on \n"+
        "Hmovialc.ccod_empresa = Hmotivo_traslado.ccod_empresa and \n"+
        "Hmovialc.motivo_traslado = Hmotivo_traslado.ccod_motivo \n"+
        "inner join Htransp on \n"+
        "Hmovialc.ccod_empresa = Htransp.ccod_empresa and \n"+
        "Hmovialc.ccod_transportista = Htransp.ccod_transportista \n"+
        "inner join Hvehiculo on \n"+
        "Hmovialc.ccod_empresa = Hvehiculo.ccod_empresa and \n"+
        "Hmovialc.ccod_vehiculo = Hvehiculo.ccod_vehiculo \n"+
        "inner join Hchofer on \n"+
        "Hmovialc.ccod_empresa = Hchofer.erp_empresa and \n"+
        "Hmovialc.nombre_chofer = Hchofer.erp_codigo \n"+
        "inner join erp_agencia_transporte on \n"+
        "Hmovialc.ccod_empresa = erp_agencia_transporte.erp_codemp and \n"+
        "Hmovialc.erp_codage = erp_agencia_transporte.erp_codagencia \n"+
        "inner join Hcencos on \n"+
        "Hmovialc.ccod_empresa = Hcencos.ccod_empresa \n"+
        "and Hmovialc.ccod_cencos = Hcencos.ccod_cencos \n"+
        "inner join Horden_trabajo on \n"+
        "Hmovialc.ccod_empresa = Horden_trabajo.ccod_empresa \n"+
        "and Hmovialc.ot = Horden_trabajo.ccod_ot \n"+
        "inner join erp_unidad_negocio on \n"+
        "Hmovialc.ccod_empresa = erp_unidad_negocio.erp_codemp \n"+
        "and Hmovialc.erp_codune = erp_unidad_negocio.erp_codune \n"+
        "where Hmovialc.ccod_empresa = @codigo_empresa \n"+
        "and Hmovialc.atencion <> case @estado_atencion when 'Todos' then '' else 'Atendido' end  \n"+
        "and Hmovialc.ccod_almacen = @codigo_punto_venta \n"+ 
        (agrupacion1_valores == "" ? "" : "and "+columnas[agrupacion1_tipo]+" in ("+agrupacion1_valores +") \n")+
        (agrupacion2_valores == "" ? "" : "and "+columnas[agrupacion2_tipo]+" in ("+agrupacion2_valores +") \n")+
        (agrupacion3_valores == "" ? "" : "and "+columnas[agrupacion3_tipo]+" in ("+agrupacion3_valores +") \n")+
        "and Hmovialc.dfecha_doc between @fecha_inicio and @fecha_termino \n"

        
        if(tipo_reporte=="resumido"){
            query = 
                "select  \n"+
                "Punto_Venta, \n"+
                "Tipo_Venta, \n"+
                "Fecha, \n"+
                "Fecha_Entrega, \n"+
                "Movimiento, \n"+
                "Serie, \n"+
                "Numero, \n"+
                "Codigo_Cliente, \n"+
                "RUC_Cliente, \n"+
                "Nombre_Cliente, \n"+
                "Moneda, \n"+
                "Tipo_Cambio, \n"+
                "Base_Imponible, \n"+
                "Estado, \n"+
                "Codigo_Forma_Pago, \n"+
                "Forma_Pago, \n"+
                "Codigo_Unidad_Negocio, \n"+
                "Unidad_Negocio, \n"+
                "Codigo_Centro_Costo, \n"+
                "Centro_Costo, \n"+
                "Codigo_Orden_Trabajo, \n"+
                "Orden_Trabajo, \n"+
                "Punto_Partida, \n"+
                "Punto_Llegada, \n"+
                "Motivo_Traslado, \n"+
                "Transport, \n"+
                "Vehiculo, \n"+
                "Chofer, \n"+
                "Agencia_Transporte, \n"+
                "Usuario, \n"+
                "Pc_User, \n"+
                "Pc_Fecha, \n"+
                "Pc_Ip, \n"+
                "SUM(Cantidad) as Cantidad, \n"+
                "SUM(Unit) as Unit \n"+
                "from ( \n"+
                query +
                " ) as t \n"+
                "group by  \n"+
                "Punto_Venta, \n"+
                "Tipo_Venta, \n"+
                "Fecha, \n"+
                "Fecha_Entrega, \n"+
                "Movimiento, \n"+
                "Serie, \n"+
                "Numero, \n"+
                "Codigo_Cliente, \n"+
                "RUC_Cliente, \n"+
                "Nombre_Cliente, \n"+
                "Moneda, \n"+
                "Tipo_Cambio, \n"+
                "Base_Imponible, \n"+
                "Estado, \n"+
                "Codigo_Forma_Pago, \n"+
                "Forma_Pago, \n"+
                "Codigo_Unidad_Negocio, \n"+
                "Unidad_Negocio, \n"+
                "Codigo_Centro_Costo, \n"+
                "Centro_Costo, \n"+
                "Codigo_Orden_Trabajo, \n"+
                "Orden_Trabajo, \n"+
                "Punto_Partida, \n"+
                "Punto_Llegada, \n"+
                "Motivo_Traslado, \n"+
                "Transport, \n"+
                "Vehiculo, \n"+
                "Chofer, \n"+
                "Agencia_Transporte, \n"+
                "Usuario, \n"+
                "Pc_User, \n"+
                "Pc_Fecha, \n"+
                "Pc_Ip \n"+
                "order by \n"+
                (columnas_order[agrupacion1_tipo] ? columnas_order[agrupacion1_tipo] : "Punto_Venta") +", \n"+
                (columnas_order[agrupacion2_tipo] ? columnas_order[agrupacion2_tipo] : "Fecha") +", \n"+
                (columnas_order[agrupacion3_tipo] ? columnas_order[agrupacion3_tipo] : "Numero") +" \n";
        }else{
            query += 
                " order by \n"+
                (columnas_order[agrupacion1_tipo] ? columnas_order[agrupacion1_tipo] : "Punto_Venta") +", \n"+
                (columnas_order[agrupacion2_tipo] ? columnas_order[agrupacion2_tipo] : "Fecha") +", \n"+
                (columnas_order[agrupacion3_tipo] ? columnas_order[agrupacion3_tipo] : "Numero") +",item \n";
        }
        
        const pool = await poolPromise;
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(10), codigo_punto_venta)
        .input('estado_atencion', mssql.VarChar(250), req.body.estado_atencion)
        .input('fecha_inicio', mssql.Date, req.body.fecha_inicio)
        .input('fecha_termino', mssql.Date, req.body.fecha_termino)
        .input('agrupacion1_tipo', mssql.VarChar(250), agrupacion1_tipo)
        .input('agrupacion2_tipo', mssql.VarChar(250), agrupacion2_tipo)
        .input('agrupacion3_tipo', mssql.VarChar(250), agrupacion3_tipo)
        .query(query);
    
        const recordset = lista.recordset;
        res.json(recordset);
    }catch(err){
        console.log(err.message);
        res.send(err.message);
    }
});

router.post('/facturacion/:tipo_reporte', async (req, res) => {
    try{
        const {tipo_reporte} = req.params;
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.body.punto_venta;
        var columnas = {
            centro_costos: "HMOVIALC.ccod_cencos",
            unidad_negocio: "HMOVIALC.erp_codune",
            orden_trabajo: "HMOVIALC.ot",
            serie_documento: "HMOVIALC.cnum_serie",
            codigo_cliente: "HMOVIALC.ccod_cliente",
            forma_pago_lista: "HMOVIALC.ccod_forpago",
            articulos: "HMOVIALD.ccod_articulo",
        }
        var columnas_order = {
            responsable_aprobacion: "Codigo_Aprobacion_1",
            responsable_aprobacion_2: "Codigo_Aprobacion_2",
            centro_costos: "Codigo_Centro_Costo",
            unidad_negocio: "Codigo_Unidad_Negocio",
            orden_trabajo: "Codigo_Orden_Trabajo",
            motivos_tramite: "Codigo_Motivo",
            articulos: "Codigo_Articulo"
        }
        
        var agrupacion1_valores = req.body.agrupacion1_valores;
        var agrupacion2_valores = req.body.agrupacion2_valores;
        var agrupacion3_valores = req.body.agrupacion3_valores;
        var agrupacion1_tipo = req.body.agrupacion1_tipo;
        var agrupacion2_tipo = req.body.agrupacion2_tipo;
        var agrupacion3_tipo = req.body.agrupacion3_tipo;
        var agrupacion0_tipo_moneda= req.body.agrupacion0_tipo_moneda;
        var agrupacion0_moneda= req.body.agrupacion0_moneda;

        var query="";
        if(tipo_reporte=="resumido"){
            query=
            "select \n"+
            "HMOVIALC.ccod_almacen as Punto_Venta, \n"+
            "HMOVIALC.ccod_movimiento as Codigo_Tipo_Documento, \n"+
            "tipo_documento.cnom_doc as Nombre_Tipo_Documento, \n"+
            "HMOVIALC.tipo_venta as Tipo_Venta, \n"+
            "HMOVIALC.cnum_serie as Serie_Documento, \n"+
            "HMOVIALC.cnum_doc as Numero_Documento, \n"+
            "HMOVIALC.ccod_cliente as Codigo_Cliente, \n"+
            "HMOVIALC.cnom_cliente_v as Nombre_Cliente, \n"+
            "CONVERT(VARCHAR,HMOVIALC.dfecha_doc,103) as Fecha_Documento, \n"+
            "HMOVIALC.nro_dias as Dias, \n"+
            "CONVERT(VARCHAR,HMOVIALC.dfecha_val,103) as Fecha_Validez, \n"+
            "CONVERT(VARCHAR,HMOVIALC.dfecha_entr,103) as Fecha_Entrega, \n"+
            "HMOVIALC.ccod_forpago as Codigo_Forma_Pago, \n"+
            "Hfor_pag.cnom_forpago as Forma_Pago, \n"+
            "case HMOVIALC.ctip_docref when '00' then '' else HMOVIALC.ctip_docref end as Codigo_Tipo_Referencia, \n"+
            "case HMOVIALC.ctip_docref when '00' then '' else tipo_documento_referencia.cnom_doc end as Nombre_Tipo_Referencia, \n"+
            "HMOVIALC.cserie_docref as Motivo_Serie_Referencia, \n"+
            "HMOVIALC.cnum_docref as Numero_Referencia, \n"+
            "HMOVIALC.estado as Estado, \n"+
            "HMOVIALC.tipo_cambio as Tipo_Cambio, \n"+
            "HMOVIALC.desc_stock as Desc_Stock, \n"+
            "HMOVIALC.ccod_vendedor as Codigo_Vendedor, \n"+
            "Hvended.cnom_vendedor as Nombre_Vendedor, \n"+
            "HMOVIALC.erp_codune as Codigo_Unidad_Negocio, \n"+
            "erp_unidad_negocio.erp_nomune as Unidad_Negocio, \n"+
            "HMOVIALC.ccod_cencos as Codigo_Centro_Costo, \n"+
            "Hcencos.cnom_cencos as Centro_Costo, \n"+
            "HMOVIALC.ot as Codigo_Orden_Trabajo, \n"+
            "Horden_trabajo.cnom_ot as  Nombre_Orden_Trabajo, \n"+
            "HMOVIALC.ccod_detraccion as  Codigo_Detraccion, \n"+
            "Hdetraccion.descrip as  Nombre_Detraccion, \n"+
            "HMOVIALC.cmoneda as Moneda, \n"+
            "HMOVIALC.n_orden as Numero_Orden, \n"+
            "HMOVIALC.erp_nro_exp as Numero_Expediente1,\n"+
            "HMOVIALC.erp_nro_exp2 as Numero_Expediente2,\n"+
            "HMOVIALC.motivo_traslado as  Codigo_Motivo_Taslado, \n"+
            "Hmotivo_traslado.nombre_motivo as  Nombre_Motivo_Taslado, \n"+
            "HMOVIALC.tribute_concept as  Tipo_Operacion, \n"+
            "HMOVIALC.lista_precios as Lista_Precios, \n"+
            "HMOVIALC.observacion as Observacion, \n"+
            "HMOVIALC.glosa as Glosa, \n"+
            "HMOVIALC.erp_codage as Agente, \n"+
            "HMOVIALC.atencion as Atencion, \n"+
            "HMOVIALC.porcentaje as Porcentaje, \n"+
            "HMOVIALC.porc_descuento as Descuento_Porcentaje, \n"+
            "HMOVIALC.si_igv as Si_Igv, \n"+
            "HMOVIALC.subtotal_sin_descuentos as Base_Calculada, \n"+
            "HMOVIALC.erp_Ddescuento as Descuento, \n"+
            "HMOVIALC.erp_Dsubtotal as Base_Imponible, \n"+
            "HMOVIALC.erp_Digv as Igv, \n"+
            "HMOVIALC.erp_Dimporte as Total, \n"+
            "HMOVIALC.usuario as Usuario, \n"+
            "HMOVIALC.Pc_User as Pc_User, \n"+
            "HMOVIALC.Pc_Fecha as Pc_Fecha, \n"+
            "HMOVIALC.Pc_Ip as Pc_Ip \n"+
            "from HMOVIALC \n"+
            "Inner Join htipdoc as tipo_documento on \n"+
            "HMOVIALC.ccod_empresa = tipo_documento.ccod_empresa \n"+
            "and HMOVIALC.ccod_movimiento = tipo_documento.ctip_doc \n"+
            "Inner Join htipdoc as tipo_documento_referencia on \n"+
            "HMOVIALC.ccod_empresa = tipo_documento_referencia.ccod_empresa \n"+
            "and HMOVIALC.ctip_docref = tipo_documento_referencia.ctip_doc \n"+
            "inner join Hfor_pag on \n"+
            "HMOVIALC.ccod_empresa = Hfor_pag.ccod_empresa and \n"+
            "HMOVIALC.ccod_forpago = Hfor_pag.ccod_forpago \n"+
            "inner join hvended on \n"+
            "HMOVIALC.ccod_empresa = hvended.ccod_empresa and \n"+
            "HMOVIALC.ccod_vendedor = hvended.ccod_vendedor \n"+
            "inner join Hcencos on \n"+
            "HMOVIALC.ccod_empresa = Hcencos.ccod_empresa \n"+
            "and HMOVIALC.ccod_cencos = Hcencos.ccod_cencos \n"+
            "inner join Horden_trabajo on \n"+
            "HMOVIALC.ccod_empresa = Horden_trabajo.ccod_empresa \n"+
            "and HMOVIALC.ot = Horden_trabajo.ccod_ot \n"+
            "inner join erp_unidad_negocio on \n"+
            "HMOVIALC.ccod_empresa = erp_unidad_negocio.erp_codemp \n"+
            "and HMOVIALC.erp_codune = erp_unidad_negocio.erp_codune \n"+
            "inner join Hmotivo_traslado on \n"+
            "HMOVIALC.ccod_empresa = Hmotivo_traslado.ccod_empresa \n"+
            "and HMOVIALC.motivo_traslado = Hmotivo_traslado.ccod_motivo \n"+
            "inner join Hdetraccion on \n"+
            "HMOVIALC.ccod_empresa = Hdetraccion.ccod_empresa \n"+
            "and HMOVIALC.ccod_detraccion = Hdetraccion.ccod_detraccion \n"+
            " where HMOVIALC.ccod_empresa = @codigo_empresa \n"+
            " and HMOVIALC.modulo = 'facturacion' \n"+ 
            " and HMOVIALC.atencion <> case @estado_atencion when 'Todos' then '' else 'Atendido' end  \n"+
            " and HMOVIALC.ccod_almacen = @codigo_punto_venta \n"+ 
            (agrupacion1_valores == "" ? "" : "and "+columnas[agrupacion1_tipo]+" in ("+agrupacion1_valores +") \n")+
            (agrupacion2_valores == "" ? "" : "and "+columnas[agrupacion2_tipo]+" in ("+agrupacion2_valores +") \n")+
            (agrupacion3_valores == "" ? "" : "and "+columnas[agrupacion3_tipo]+" in ("+agrupacion3_valores +") \n")+
            " and HMOVIALC.dfecha_doc between @fecha_inicio and @fecha_termino \n"+
            " order by \n"+
            (columnas[agrupacion1_tipo] ? columnas[agrupacion1_tipo] : "HMOVIALC.ccod_almacen") +", \n"+
            (columnas[agrupacion2_tipo] ? columnas[agrupacion2_tipo] : "HMOVIALC.dfecha_doc desc") +", \n"+
            (columnas[agrupacion3_tipo] ? columnas[agrupacion3_tipo] : "tipo_documento.ctip_doc") +" \n";

        }else{
            query =

            "select \n"+
            "HMOVIALC.ccod_almacen as Punto_Venta, \n"+
            "HMOVIALC.ccod_movimiento as Codigo_Tipo_Documento, \n"+
            "tipo_documento.cnom_doc as Nombre_Tipo_Documento, \n"+
            "HMOVIALC.tipo_venta as Tipo_Venta, \n"+
            "HMOVIALC.cnum_serie as Serie_Documento, \n"+
            "HMOVIALC.cnum_doc as Numero_Documento, \n"+
            "HMOVIALC.ccod_cliente as Codigo_Cliente, \n"+
            "HMOVIALC.cnom_cliente_v as Nombre_Cliente, \n"+
            "CONVERT(VARCHAR,HMOVIALC.dfecha_doc,103) as Fecha_Documento, \n"+
            "HMOVIALC.nro_dias as Dias, \n"+
            "CONVERT(VARCHAR,HMOVIALC.dfecha_val,103) as Fecha_Validez, \n"+
            "CONVERT(VARCHAR,HMOVIALC.dfecha_entr,103) as Fecha_Entrega, \n"+
            "HMOVIALC.ccod_forpago as Codigo_Forma_Pago, \n"+
            "Hfor_pag.cnom_forpago as Forma_Pago, \n"+
            "case HMOVIALC.ctip_docref when '00' then '' else HMOVIALC.ctip_docref end as Codigo_Tipo_Referencia, \n"+
            "case HMOVIALC.ctip_docref when '00' then '' else tipo_documento_referencia.cnom_doc end as Nombre_Tipo_Referencia, \n"+
            "HMOVIALC.cserie_docref as Motivo_Serie_Referencia, \n"+
            "HMOVIALC.cnum_docref as Numero_Referencia, \n"+
            "HMOVIALC.estado as Estado, \n"+
            "HMOVIALC.tipo_cambio as Tipo_Cambio, \n"+
            "HMOVIALC.desc_stock as Desc_Stock, \n"+
            "HMOVIALC.ccod_vendedor as Codigo_Vendedor, \n"+
            "Hvended.cnom_vendedor as Nombre_Vendedor, \n"+
            "HMOVIALC.erp_codune as Codigo_Unidad_Negocio, \n"+
            "erp_unidad_negocio.erp_nomune as Unidad_Negocio, \n"+
            "HMOVIALC.ccod_cencos as Codigo_Centro_Costo, \n"+
            "Hcencos.cnom_cencos as Centro_Costo, \n"+
            "HMOVIALC.ot as Codigo_Orden_Trabajo, \n"+
            "Horden_trabajo.cnom_ot as  Nombre_Orden_Trabajo, \n"+
            "HMOVIALC.ccod_detraccion as  Codigo_Detraccion, \n"+
            "Hdetraccion.descrip as  Nombre_Detraccion, \n"+
            "HMOVIALC.cmoneda as Moneda, \n"+
            "HMOVIALC.n_orden as Numero_Orden, \n"+
            "HMOVIALC.erp_nro_exp as Numero_Expediente1,\n"+
            "HMOVIALC.erp_nro_exp2 as Numero_Expediente2,\n"+
            "HMOVIALC.motivo_traslado as  Codigo_Motivo_Taslado, \n"+
            "Hmotivo_traslado.nombre_motivo as  Nombre_Motivo_Taslado, \n"+
            "HMOVIALC.tribute_concept as  Tipo_Operacion, \n"+
            "HMOVIALC.lista_precios as Lista_Precios, \n"+
            "HMOVIALC.observacion as Observacion, \n"+
            "HMOVIALC.glosa as Glosa, \n"+
            "HMOVIALC.erp_codage as Agente, \n"+
            "HMOVIALC.atencion as Atencion, \n"+
            "HMOVIALC.porcentaje as Porcentaje, \n"+
            "HMOVIALC.porc_descuento as Descuento_Porcentaje, \n"+
            "HMOVIALC.si_igv as Si_Igv, \n"+
            "HMOVIALC.subtotal_sin_descuentos as Base_Calculada, \n"+
            "HMOVIALC.erp_Ddescuento as Descuento, \n"+
            "HMOVIALC.erp_Dsubtotal as Base_Imponible, \n"+
            "HMOVIALC.erp_Digv as Igv, \n"+
            "HMOVIALC.erp_Dimporte as Total, \n"+
            "HMOVIALC.usuario as Usuario, \n"+
            "HMOVIALC.Pc_User as Pc_User, \n"+
            "HMOVIALC.Pc_Fecha as Pc_Fecha, \n"+
            "HMOVIALC.Pc_Ip as Pc_Ip, \n"+
            "HMOVIALD.nitem as Item, \n"+
            "HMOVIALD.ccod_articulo as Codigo_Articulo, \n"+
            "HMOVIALD.cnom_articulo as Nombre_Articulo, \n"+
            "HMOVIALD.cunidad as Unidad, \n"+
            "HMOVIALD.ncantidad3 as Cantidad, \n"+
            "HMOVIALD.factor as Factor, \n"+
            "HMOVIALD.ncantidad as Cantidad_Kardex, \n"+
            "HMOVIALD.NPRECIO_TRANS as Unit, \n"+
            "HMOVIALD.porc_descuento as Descuento1, \n"+
            "HMOVIALD.desc2 as Descuento2, \n"+
            "HMOVIALD.desc3 as Descuento3, \n"+
            "HMOVIALD.erp_desc4 as Descuento4, \n"+
            "HMOVIALD.bserie as Serie_SN, \n"+
            "HMOVIALD.nro_serie as Serie_Numero, \n"+
            "HMOVIALD.blote as Lote_SN, \n"+
            "HMOVIALD.CNRO_LOTE as Lote_Numero, \n"+
            "case HMOVIALD.blote when 'N' then '' else CONVERT(VARCHAR,HMOVIALD.vcto,103) end as Lote_Vencimiento, \n"+
            "HMOVIALD.codigo_presentacion as Codigo_Presentacion, \n"+
            "HMOVIALD.nombre_presentacion as Nombre_Presentacion, \n"+
            "HMOVIALD.cantidad_presentacion as Cantidad_Presentacion, \n"+
            "HMOVIALD.unidad_presentacion as Unidad_Presentacion, \n"+
            "HMOVIALD.precio_presentacion as Precio_Presentacion, \n"+
            "HMOVIALD.movimiento_origen as Documento_Referencia_Tipo, \n"+
            "HMOVIALD.serie_origen as Documento_Referencia_Motivo_Serie, \n"+
            "HMOVIALD.cnum_doc_guiaventa as Documento_Referencia_Numero, \n"+
            "HMOVIALD.erp_itemref as Documento_Referencia_Item, \n"+
            "'OC' as Documento_Referencia_OC, \n"+
            "HMOVIALD.idmotivo_compra as Documento_Referencia_Motivo_OC, \n"+
            "HMOVIALD.cnum_doc_ordc as Documento_Referencia_Numero_OC, \n"+
            "case HMOVIALD.idmotivo_compra when '' then '' else  HMOVIALD.origen_item end as Documento_Referencia_Item_OC, \n"+
            "'PED' as Documento_Referencia_PED, \n"+
            "HMOVIALD.motivo_pedido as Documento_Referencia_Motivo_PED, \n"+
            "HMOVIALD.doc_origen_pedido as Documento_Referencia_Numero_PED, \n"+
            "case HMOVIALD.motivo_pedido when '' then '' else  HMOVIALD.origen_item end as Documento_Referencia_Item_PED, \n"+
            "HMOVIALD.tipdoc_ref_2 as Documento_Referencia_Tipo_2, \n"+
            "HMOVIALD.motivo_ref_2 as Documento_Referencia_Motivo_2, \n"+
            "HMOVIALD.nro_ref_2 as Documento_Referencia_Numero_2, \n"+
            "HMOVIALD.erp_peso as Peso, \n"+
            "HMOVIALD.erp_largo as Largo, \n"+
            "HMOVIALD.erp_ancho as Ancho, \n"+
            "HMOVIALD.nigv as Igv_Articulo, \n"+
            "HMOVIALD.base_calculada as Detalle_Base_Calculada, \n"+
            "HMOVIALD.monto_descuento as Detalle_Descuento, \n"+
            "HMOVIALD.nbaseimpon as Detalle_Base_Imponible, \n"+
            "HMOVIALD.nigvcalc as Detalle_IGV, \n"+
            "HMOVIALD.nprecio_importe as Detalle_Importe \n"+
            "from HMOVIALC \n"+
            "inner join HMOVIALD on \n"+
            "HMOVIALC.ccod_empresa = HMOVIALD.CCOD_EMPRESA \n"+
            "AND HMOVIALC.ccod_almacen = HMOVIALD.ccod_almacen \n"+
            "AND HMOVIALC.ccod_movimiento = HMOVIALD.CCOD_MOVIMIENTO \n"+
            "AND HMOVIALC.ctip_movimiento = HMOVIALD.CTIP_MOVIMIENTO \n"+
            "AND HMOVIALC.cnum_serie = HMOVIALD.CNUM_SERIE \n"+
            "AND HMOVIALC.cnum_doc = HMOVIALD.cnum_doc \n"+
            "Inner Join htipdoc as tipo_documento on \n"+
            "HMOVIALC.ccod_empresa = tipo_documento.ccod_empresa \n"+
            "and HMOVIALC.ccod_movimiento = tipo_documento.ctip_doc \n"+
            "Inner Join htipdoc as tipo_documento_referencia on \n"+
            "HMOVIALC.ccod_empresa = tipo_documento_referencia.ccod_empresa \n"+
            "and HMOVIALC.ctip_docref = tipo_documento_referencia.ctip_doc \n"+
            "inner join Hfor_pag on \n"+
            "HMOVIALC.ccod_empresa = Hfor_pag.ccod_empresa and \n"+
            "HMOVIALC.ccod_forpago = Hfor_pag.ccod_forpago \n"+
            "inner join hvended on \n"+
            "HMOVIALC.ccod_empresa = hvended.ccod_empresa and \n"+
            "HMOVIALC.ccod_vendedor = hvended.ccod_vendedor \n"+
            "inner join Hcencos on \n"+
            "HMOVIALC.ccod_empresa = Hcencos.ccod_empresa \n"+
            "and HMOVIALC.ccod_cencos = Hcencos.ccod_cencos \n"+
            "inner join Horden_trabajo on \n"+
            "HMOVIALC.ccod_empresa = Horden_trabajo.ccod_empresa \n"+
            "and HMOVIALC.ot = Horden_trabajo.ccod_ot \n"+
            "inner join erp_unidad_negocio on \n"+
            "HMOVIALC.ccod_empresa = erp_unidad_negocio.erp_codemp \n"+
            "and HMOVIALC.erp_codune = erp_unidad_negocio.erp_codune \n"+
            "inner join Hmotivo_traslado on \n"+
            "HMOVIALC.ccod_empresa = Hmotivo_traslado.ccod_empresa \n"+
            "and HMOVIALC.motivo_traslado = Hmotivo_traslado.ccod_motivo \n"+
            "inner join Hdetraccion on \n"+
            "HMOVIALC.ccod_empresa = Hdetraccion.ccod_empresa \n"+
            "and HMOVIALC.ccod_detraccion = Hdetraccion.ccod_detraccion \n"+
            " where HMOVIALC.ccod_empresa = @codigo_empresa \n"+
            " and HMOVIALC.modulo = 'facturacion' \n"+ 
            " and HMOVIALC.atencion <> case @estado_atencion when 'Todos' then '' else 'Atendido' end  \n"+
            " and HMOVIALC.ccod_almacen = @codigo_punto_venta \n"+ 
            (agrupacion1_valores == "" ? "" : "and "+columnas[agrupacion1_tipo]+" in ("+agrupacion1_valores +") \n")+
            (agrupacion2_valores == "" ? "" : "and "+columnas[agrupacion2_tipo]+" in ("+agrupacion2_valores +") \n")+
            (agrupacion3_valores == "" ? "" : "and "+columnas[agrupacion3_tipo]+" in ("+agrupacion3_valores +") \n")+
            " and HMOVIALC.dfecha_doc between @fecha_inicio and @fecha_termino \n"+
            " order by \n"+
            (columnas[agrupacion1_tipo] ? columnas[agrupacion1_tipo] : "HMOVIALC.ccod_almacen") +", \n"+
            (columnas[agrupacion2_tipo] ? columnas[agrupacion2_tipo] : "HMOVIALC.dfecha_doc desc") +", \n"+
            (columnas[agrupacion3_tipo] ? columnas[agrupacion3_tipo] : "tipo_documento.ctip_doc") +" \n";
        }
        const pool = await poolPromise;
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(10), codigo_punto_venta)
        .input('estado_atencion', mssql.VarChar(250), req.body.estado_atencion)
        .input('fecha_inicio', mssql.Date, req.body.fecha_inicio)
        .input('fecha_termino', mssql.Date, req.body.fecha_termino)
        .input('agrupacion1_tipo', mssql.VarChar(250), agrupacion1_tipo)
        .input('agrupacion2_tipo', mssql.VarChar(250), agrupacion2_tipo)
        .input('agrupacion3_tipo', mssql.VarChar(250), agrupacion3_tipo)
        .query(query);
    
        const recordset = lista.recordset;
        res.json(recordset);
    }catch(err){
        console.log(err.message);
        res.send(err.message);
    }
});

module.exports = router;