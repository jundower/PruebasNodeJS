const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../../database');

router.post('/requerimientos/:tipo_reporte', async (req, res) => {
    try{
        const {tipo_reporte} = req.params;
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.body.punto_venta;
        
        var columnas = {
            responsable_aprobacion: "Hrequec.r_respon",
            responsable_aprobacion_2: "Hrequec.usuario_aprobo1",
            centro_costos: "Hrequec.r_codcosto",
            unidad_negocio: "Hrequec.erp_codune",
            orden_trabajo: "Hrequec.r_ot",
            motivos_tramite: "Hrequec.idmotivo_compra",
            articulos: "Hrequed.r_codart"
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

        var query = 
        "select \n"+
        "Hrequec.erp_ptovta as Punto_Venta, \n"+
        "Hrequec.idmotivo_compra as Codigo_Motivo, \n"+
        "erp_motivos_tramite.erp_nommot as Motivo, \n"+
        "Hrequec.r_codigo as Numero, \n"+
        "CONVERT(VARCHAR,Hrequec.r_fecha,103) as Fecha, \n"+
        "CONVERT(VARCHAR,Hrequec.r_fechalim,103) as Fecha_Limite, \n"+
        "Hrequec.r_prior as Prioridad, \n"+
        "Hrequec.e_estado as Estado, \n"+
        "case Hrequec.r_codcosto when '00' then '' else Hrequec.r_codcosto end as Codigo_Centro_Costo, \n"+
        "case Hrequec.r_codcosto when '00' then '' else Hcencos.cnom_cencos end as Centro_Costo, \n"+
        "case Hrequec.r_situapro when 'Sin Aprobacion' then '' else Hrequec.r_situapro end as Aprobacion_1, \n"+
        "case Hrequec.r_situapro when 'Sin Aprobacion' then '' else Hperson.ccod_person end as Codigo_Aprobacion_1, \n"+
        "case Hrequec.r_situapro when 'Sin Aprobacion' then '' else (Hperson.ape_pat+' '+Hperson.ape_mat+' '+Hperson.nombres) end as  \n"+"Responsable_Aprobacion_1, \n"+
        "case Hrequec.r_situapro when 'Sin Aprobacion' then '' else CONVERT(VARCHAR,Hrequec.r_facepta,103) end as Fecha_Aprobacion_1, \n"+
        "Hrequec.r_obs as Observacion_Aprobacion_1, \n"+
        "case Hrequec.aprobado1 when 'Sin Aprobacion' then '' else Hrequec.aprobado1 end as Aprobacion_2, \n"+
        "case Hrequec.aprobado1 when 'Sin Aprobacion' then '' else Aprobacion2.ccod_person end as Codigo_Aprobacion_2, \n"+
        "case Hrequec.aprobado1 when 'Sin Aprobacion' then '' else (Aprobacion2.ape_pat+' '+Aprobacion2.ape_mat+' '+Aprobacion2.nombres) end as  \n"+"Responable_Aprobacion_2, \n"+
        "case Hrequec.aprobado1 when 'Sin Aprobacion' then '' else CONVERT(VARCHAR,Hrequec.fecha_aprob2,103) end as Fecha_Aprobacion_2, \n"+
        "Hrequec.r_obs2 as Observacion_Aprobacion_2, \n"+
        "case Hrequec.r_ot when '00' then '' else Hrequec.r_ot end as Codigo_Orden_Trabajo, \n"+
        "case Hrequec.r_ot when '00' then '' else Horden_trabajo.cnom_ot end as Orden_Trabajo, \n"+
        "case Hrequec.erp_codune when '00' then '' else Hrequec.erp_codune end as Codigo_Unidad_Negocio, \n"+
        "case Hrequec.erp_codune when '00' then '' else erp_unidad_negocio.erp_nomune end as Unidad_Negocio, \n"+
        "Hrequec.atencion as Atencion, \n"+
        "Hrequec.porcentaje as Porcentaje, \n"+
        "Hrequec.erp_moneda as Moneda, \n"+
        "Hrequec.tc as Tipo_Cambio, \n"+
        "Hrequec.glosa as Glosa, \n"+
        "Hrequec.erp_codage as Agente, \n"+
        "Hrequec.erp_motivo_ref as Motivo_Referencia, \n"+
        "Hrequec.erp_tipo_ref as Tipo_Referencia, \n"+
        "Hrequec.erp_numero_ref as Numero_Refencia, \n"+
        "Hrequec.erp_nro_exp as Numero_Expediente1, \n"+
        "Hrequec.erp_nro_exp2 as Numero_Expediente2, \n"+
        "Hrequec.usuario as Usuario, \n"+
        "Hrequec.Pc_User as Pc_User, \n"+
        "Hrequec.Pc_Fecha as Pc_Fecha, \n"+
        "Hrequec.Pc_Ip as Pc_Ip, \n"+
        "Hrequec.si_igv as Si_Igv, \n"+
        "case Hrequec.e_estado when 'Anulado' then '0' else Hrequec.erp_Dbasecalc end as Base_Calculada, \n"+
        "case Hrequec.e_estado when 'Anulado' then '0' else Hrequec.erp_Ddescuento end as Descuento, \n"+
        "case Hrequec.e_estado when 'Anulado' then '0' else Hrequec.erp_Dsubtotal end as Base_Imponible, \n"+
        "case Hrequec.e_estado when 'Anulado' then '0' else Hrequec.erp_Digv end as Igv, \n"+
        "case Hrequec.e_estado when 'Anulado' then '0' else Hrequec.erp_Dimporte end as Total, \n"+
        "Hrequed.item as Item, \n"+
        "Hrequed.r_codart as Codigo_Articulo, \n"+
        "Harticul.ccod_interno as Codigo_Fabricante, \n"+
        "hfam_art.cfamilia as Codigo_Familia, \n"+
        "hfam_art.cnom_familia as Familia, \n"+
        "Hsubfamilia_art.ccod_subfamilia as Codigo_SubFamilia, \n"+
        "Hsubfamilia_art.cnom_subfamilia as SubFamilia, \n"+
        "Harticul.cnom_articulo as Nombre_Articulo, \n"+
        "Hrequed.runidades as Unidad, \n"+
        "case Hrequec.e_estado when 'Anulado' then '0' else Hrequed.rcantidad3 end as Cantidad, \n"+
        "case Hrequec.e_estado when 'Anulado' then '0' else Hrequed.factor end as Factor, \n"+
        "case Hrequec.e_estado when 'Anulado' then '0' else Hrequed.rcantidad end as Cantidad_Kardex, \n"+
        "case Hrequec.e_estado when 'Anulado' then '0' else Hrequed.r_precio end as Unit, \n"+
        "Hrequed.codigo_presentacion as Codigo_Presentacion, \n"+
        "Hrequed.Erp_Nombre_Presentacion as Nombre_Presentacion, \n"+
        "case Hrequec.e_estado when 'Anulado' then '0' else Hrequed.Erp_Cantidad_Presentacion end as Cantidad_Presentacion, \n"+
        "Hrequed.Erp_Unidad_Presentacion as Unidad_Presentacion, \n"+
        "case Hrequec.e_estado when 'Anulado' then '0' else Hrequed.Erp_Precio_Presentacion end as Precio_Presentacion, \n"+
        "Hrequed.erp_tipo_ref as Documento_Referencia_Tipo, \n"+
        "Hrequed.erp_motivo_ref as Documento_Referencia_Motivo_Serie, \n"+
        "Hrequed.erp_numero_ref as Documento_Referencia_Numero, \n"+
        "Hrequed.erp_item_ref as Documento_Referencia_Item, \n"+
        "Hrequed.erp_peso as Peso, \n"+
        "Hrequed.erp_largo as Largo, \n"+
        "Hrequed.nigv as Igv_Articulo, \n"+
        "case Hrequec.e_estado when 'Anulado' then '0' else Hrequed.nbasecalc end as Detalle_Base_Calculada, \n"+
        "case Hrequec.e_estado when 'Anulado' then '0' else Hrequed.monto_descuento end as Detalle_Descuento, \n"+
        "case Hrequec.e_estado when 'Anulado' then '0' else Hrequed.nbaseimpon end as Detalle_Base_Imponible, \n"+
        "case Hrequec.e_estado when 'Anulado' then '0' else Hrequed.nigvcalc end as Detalle_IGV, \n"+
        "case Hrequec.e_estado when 'Anulado' then '0' else Hrequed.nprecio_importe end as Detalle_Importe, \n"+
        "case Hrequec.e_estado when 'Anulado' then '0' else isnull((select sum(Hordcomd.ncantidad) \n"+
        "from Hordcomd \n"+
        "inner join Hordcomc on \n"+
        "Hordcomd.ccod_empresa = Hordcomc.ccod_empresa and \n"+
        "Hordcomd.erp_ptovta = Hordcomc.erp_ptovta and \n"+
        "Hordcomd.idmotivo_compra = Hordcomc.idmotivo_compra and \n"+
        "Hordcomd.cnum_doc = Hordcomc.cnum_doc \n"+
        "where \n"+
        "Hordcomd.ccod_empresa = Hrequec.r_codemp and \n"+
        "Hordcomd.erp_motivo_req = hrequed.idmotivo_compra and  \n"+
        "Hordcomd.erp_nro_req = hrequed.rcod_req and  \n"+
        "Hordcomc.estado <> 'Anulado' and \n"+
        "Hordcomd.ccod_articulo = hrequed.r_codart and  \n"+
        "Hordcomd.item_requerimiento = hrequed.item),0) end as Cantidad_Atendida,\n"+
        "case Hrequec.e_estado when 'Anulado' then '0' else Hrequed.rcantidad3 - isnull((select sum(Hordcomd.ncantidad) \n"+
        "from Hordcomd \n"+
        "inner join Hordcomc on \n"+
        "Hordcomd.ccod_empresa = Hordcomc.ccod_empresa and \n"+
        "Hordcomd.erp_ptovta = Hordcomc.erp_ptovta and \n"+
        "Hordcomd.idmotivo_compra = Hordcomc.idmotivo_compra and \n"+
        "Hordcomd.cnum_doc = Hordcomc.cnum_doc \n"+
        "where \n"+
        "Hordcomd.ccod_empresa = Hrequec.r_codemp and \n"+
        "Hordcomd.erp_motivo_req = hrequed.idmotivo_compra and  \n"+
        "Hordcomd.erp_nro_req = hrequed.rcod_req and  \n"+
        "Hordcomc.estado <> 'Anulado' and \n"+
        "Hordcomd.ccod_articulo = hrequed.r_codart and  \n"+
        "Hordcomd.item_requerimiento = hrequed.item),0) end as Cantidad_Saldo, \n"+
        "(select sum(n_cantidad) from ( \n"+
        "select ROW_NUMBER() over (order by Hordcomd.cnum_doc) as orden, Hordcomd.ncantidad as n_cantidad \n"+
        "from Hordcomd  \n"+
        "inner join Hordcomc on  \n"+
        "Hordcomd.ccod_empresa = Hordcomc.ccod_empresa and  \n"+
        "Hordcomd.erp_ptovta = Hordcomc.erp_ptovta and  \n"+
        "Hordcomd.idmotivo_compra = Hordcomc.idmotivo_compra and  \n"+
        "Hordcomd.cnum_doc = Hordcomc.cnum_doc  \n"+
        "where  \n"+
        "Hordcomd.ccod_empresa = Hrequec.r_codemp and  \n"+
        "Hordcomd.erp_motivo_req = hrequed.idmotivo_compra and   \n"+
        "Hordcomd.erp_nro_req = hrequed.rcod_req and   \n"+
        "Hordcomc.estado <> 'Anulado' and  \n"+
        "Hordcomd.ccod_articulo = hrequed.r_codart and   \n"+
        "Hordcomd.item_requerimiento = hrequed.item \n"+
        ") as d where orden='1' ) as  Orden_compra_1, \n"+
        "(select n_documento_referencia from ( \n"+
        "select ROW_NUMBER() over (order by Hordcomd.cnum_doc) as orden, Hordcomd.cnum_doc as n_documento_referencia \n"+
        "from Hordcomd  \n"+
        "inner join Hordcomc on  \n"+
        "Hordcomd.ccod_empresa = Hordcomc.ccod_empresa and  \n"+
        "Hordcomd.erp_ptovta = Hordcomc.erp_ptovta and  \n"+
        "Hordcomd.idmotivo_compra = Hordcomc.idmotivo_compra and  \n"+
        "Hordcomd.cnum_doc = Hordcomc.cnum_doc  \n"+
        "where  \n"+
        "Hordcomd.ccod_empresa = Hrequec.r_codemp and  \n"+
        "Hordcomd.erp_motivo_req = hrequed.idmotivo_compra and   \n"+
        "Hordcomd.erp_nro_req = hrequed.rcod_req and   \n"+
        "Hordcomc.estado <> 'Anulado' and  \n"+
        "Hordcomd.ccod_articulo = hrequed.r_codart and   \n"+
        "Hordcomd.item_requerimiento = hrequed.item \n"+
        ") as d where orden='1' ) as  Referencia_Orden_compra_1, \n"+
        "(select sum(n_cantidad) from ( \n"+
        "select ROW_NUMBER() over (order by Hordcomd.cnum_doc) as orden, Hordcomd.ncantidad as n_cantidad \n"+
        "from Hordcomd  \n"+
        "inner join Hordcomc on  \n"+
        "Hordcomd.ccod_empresa = Hordcomc.ccod_empresa and  \n"+
        "Hordcomd.erp_ptovta = Hordcomc.erp_ptovta and  \n"+
        "Hordcomd.idmotivo_compra = Hordcomc.idmotivo_compra and  \n"+
        "Hordcomd.cnum_doc = Hordcomc.cnum_doc  \n"+
        "where  \n"+
        "Hordcomd.ccod_empresa = Hrequec.r_codemp and  \n"+
        "Hordcomd.erp_motivo_req = hrequed.idmotivo_compra and   \n"+
        "Hordcomd.erp_nro_req = hrequed.rcod_req and   \n"+
        "Hordcomc.estado <> 'Anulado' and  \n"+
        "Hordcomd.ccod_articulo = hrequed.r_codart and   \n"+
        "Hordcomd.item_requerimiento = hrequed.item \n"+
        ") as d where orden='2' ) as  Orden_compra_2, \n"+
        "(select n_documento_referencia from ( \n"+
        "select ROW_NUMBER() over (order by Hordcomd.cnum_doc) as orden, Hordcomd.cnum_doc as n_documento_referencia \n"+
        "from Hordcomd  \n"+
        "inner join Hordcomc on  \n"+
        "Hordcomd.ccod_empresa = Hordcomc.ccod_empresa and  \n"+
        "Hordcomd.erp_ptovta = Hordcomc.erp_ptovta and  \n"+
        "Hordcomd.idmotivo_compra = Hordcomc.idmotivo_compra and  \n"+
        "Hordcomd.cnum_doc = Hordcomc.cnum_doc  \n"+
        "where  \n"+
        "Hordcomd.ccod_empresa = Hrequec.r_codemp and  \n"+
        "Hordcomd.erp_motivo_req = hrequed.idmotivo_compra and   \n"+
        "Hordcomd.erp_nro_req = hrequed.rcod_req and   \n"+
        "Hordcomc.estado <> 'Anulado' and  \n"+
        "Hordcomd.ccod_articulo = hrequed.r_codart and   \n"+
        "Hordcomd.item_requerimiento = hrequed.item \n"+
        ") as d where orden='2' ) as  Referencia_Orden_compra_2, \n"+
        "(select sum(n_cantidad) from ( \n"+
        "select ROW_NUMBER() over (order by Hordcomd.cnum_doc) as orden, Hordcomd.ncantidad as n_cantidad \n"+
        "from Hordcomd  \n"+
        "inner join Hordcomc on  \n"+
        "Hordcomd.ccod_empresa = Hordcomc.ccod_empresa and  \n"+
        "Hordcomd.erp_ptovta = Hordcomc.erp_ptovta and  \n"+
        "Hordcomd.idmotivo_compra = Hordcomc.idmotivo_compra and  \n"+
        "Hordcomd.cnum_doc = Hordcomc.cnum_doc  \n"+
        "where  \n"+
        "Hordcomd.ccod_empresa = Hrequec.r_codemp and  \n"+
        "Hordcomd.erp_motivo_req = hrequed.idmotivo_compra and   \n"+
        "Hordcomd.erp_nro_req = hrequed.rcod_req and   \n"+
        "Hordcomc.estado <> 'Anulado' and  \n"+
        "Hordcomd.ccod_articulo = hrequed.r_codart and   \n"+
        "Hordcomd.item_requerimiento = hrequed.item \n"+
        ") as d where orden='3' ) as  Orden_compra_3, \n"+
        "(select n_documento_referencia from ( \n"+
        "select ROW_NUMBER() over (order by Hordcomd.cnum_doc) as orden, Hordcomd.cnum_doc as n_documento_referencia \n"+
        "from Hordcomd  \n"+
        "inner join Hordcomc on  \n"+
        "Hordcomd.ccod_empresa = Hordcomc.ccod_empresa and  \n"+
        "Hordcomd.erp_ptovta = Hordcomc.erp_ptovta and  \n"+
        "Hordcomd.idmotivo_compra = Hordcomc.idmotivo_compra and  \n"+
        "Hordcomd.cnum_doc = Hordcomc.cnum_doc  \n"+
        "where  \n"+
        "Hordcomd.ccod_empresa = Hrequec.r_codemp and  \n"+
        "Hordcomd.erp_motivo_req = hrequed.idmotivo_compra and   \n"+
        "Hordcomd.erp_nro_req = hrequed.rcod_req and   \n"+
        "Hordcomc.estado <> 'Anulado' and  \n"+
        "Hordcomd.ccod_articulo = hrequed.r_codart and   \n"+
        "Hordcomd.item_requerimiento = hrequed.item \n"+
        ") as d where orden='3' ) as  Referencia_Orden_compra_3, \n"+
        "(select sum(n_cantidad) from ( \n"+
        "select ROW_NUMBER() over (order by Hordcomd.cnum_doc) as orden, Hordcomd.ncantidad as n_cantidad \n"+
        "from Hordcomd  \n"+
        "inner join Hordcomc on  \n"+
        "Hordcomd.ccod_empresa = Hordcomc.ccod_empresa and  \n"+
        "Hordcomd.erp_ptovta = Hordcomc.erp_ptovta and  \n"+
        "Hordcomd.idmotivo_compra = Hordcomc.idmotivo_compra and  \n"+
        "Hordcomd.cnum_doc = Hordcomc.cnum_doc  \n"+
        "where  \n"+
        "Hordcomd.ccod_empresa = Hrequec.r_codemp and  \n"+
        "Hordcomd.erp_motivo_req = hrequed.idmotivo_compra and   \n"+
        "Hordcomd.erp_nro_req = hrequed.rcod_req and   \n"+
        "Hordcomc.estado <> 'Anulado' and  \n"+
        "Hordcomd.ccod_articulo = hrequed.r_codart and   \n"+
        "Hordcomd.item_requerimiento = hrequed.item \n"+
        ") as d where orden='4' ) as  Orden_compra_4, \n"+
        "(select n_documento_referencia from ( \n"+
        "select ROW_NUMBER() over (order by Hordcomd.cnum_doc) as orden, Hordcomd.cnum_doc as n_documento_referencia \n"+
        "from Hordcomd  \n"+
        "inner join Hordcomc on  \n"+
        "Hordcomd.ccod_empresa = Hordcomc.ccod_empresa and  \n"+
        "Hordcomd.erp_ptovta = Hordcomc.erp_ptovta and  \n"+
        "Hordcomd.idmotivo_compra = Hordcomc.idmotivo_compra and  \n"+
        "Hordcomd.cnum_doc = Hordcomc.cnum_doc  \n"+
        "where  \n"+
        "Hordcomd.ccod_empresa = Hrequec.r_codemp and  \n"+
        "Hordcomd.erp_motivo_req = hrequed.idmotivo_compra and   \n"+
        "Hordcomd.erp_nro_req = hrequed.rcod_req and   \n"+
        "Hordcomc.estado <> 'Anulado' and  \n"+
        "Hordcomd.ccod_articulo = hrequed.r_codart and   \n"+
        "Hordcomd.item_requerimiento = hrequed.item \n"+
        ") as d where orden='4' ) as  Referencia_Orden_compra_4, \n"+
        "(select sum(n_cantidad) from ( \n"+
        "select ROW_NUMBER() over (order by Hordcomd.cnum_doc) as orden, Hordcomd.ncantidad as n_cantidad \n"+
        "from Hordcomd  \n"+
        "inner join Hordcomc on  \n"+
        "Hordcomd.ccod_empresa = Hordcomc.ccod_empresa and  \n"+
        "Hordcomd.erp_ptovta = Hordcomc.erp_ptovta and  \n"+
        "Hordcomd.idmotivo_compra = Hordcomc.idmotivo_compra and  \n"+
        "Hordcomd.cnum_doc = Hordcomc.cnum_doc  \n"+
        "where  \n"+
        "Hordcomd.ccod_empresa = Hrequec.r_codemp and  \n"+
        "Hordcomd.erp_motivo_req = hrequed.idmotivo_compra and   \n"+
        "Hordcomd.erp_nro_req = hrequed.rcod_req and   \n"+
        "Hordcomc.estado <> 'Anulado' and  \n"+
        "Hordcomd.ccod_articulo = hrequed.r_codart and   \n"+
        "Hordcomd.item_requerimiento = hrequed.item \n"+
        ") as d where orden='5' ) as  Orden_compra_5, \n"+
        "(select n_documento_referencia from ( \n"+
        "select ROW_NUMBER() over (order by Hordcomd.cnum_doc) as orden, Hordcomd.cnum_doc as n_documento_referencia \n"+
        "from Hordcomd  \n"+
        "inner join Hordcomc on  \n"+
        "Hordcomd.ccod_empresa = Hordcomc.ccod_empresa and  \n"+
        "Hordcomd.erp_ptovta = Hordcomc.erp_ptovta and  \n"+
        "Hordcomd.idmotivo_compra = Hordcomc.idmotivo_compra and  \n"+
        "Hordcomd.cnum_doc = Hordcomc.cnum_doc  \n"+
        "where  \n"+
        "Hordcomd.ccod_empresa = Hrequec.r_codemp and  \n"+
        "Hordcomd.erp_motivo_req = hrequed.idmotivo_compra and   \n"+
        "Hordcomd.erp_nro_req = hrequed.rcod_req and   \n"+
        "Hordcomc.estado <> 'Anulado' and  \n"+
        "Hordcomd.ccod_articulo = hrequed.r_codart and   \n"+
        "Hordcomd.item_requerimiento = hrequed.item \n"+
        ") as d where orden='5' ) as Referencia_Orden_compra_5 \n"+
        
        "from Hrequec \n"+
        "inner join Hrequed on \n"+
        "Hrequec.r_codemp = Hrequed.rcod_emp and \n"+
        "Hrequec.r_codigo = Hrequed.rcod_req and \n"+
        "Hrequec.idmotivo_compra = Hrequed.idmotivo_compra and \n"+
        "Hrequec.erp_ptovta = Hrequed.erp_ptovta \n"+
        "Inner Join erp_motivos_tramite on \n"+
        "Hrequed.rcod_emp = erp_motivos_tramite.erp_codemp \n"+
        "and Hrequec.idmotivo_compra = erp_motivos_tramite.erp_codmot \n"+
        "Inner Join Harticul on \n"+
        "Hrequed.rcod_emp = Harticul.ccod_empresa \n"+
        "and Hrequed.r_codart = Harticul.ccod_articulo \n"+
        "Inner Join hfam_art on \n"+
        "hfam_art.ccod_empresa = Harticul.ccod_empresa \n"+
        "and hfam_art.cfamilia = Harticul.cfamilia \n"+
        "Inner Join Hsubfamilia_art on \n"+
        "Hsubfamilia_art.ccod_empresa = Harticul.ccod_empresa \n"+
        "and Hsubfamilia_art.ccod_subfamilia = Harticul.ccod_subfamilia \n"+
        "inner join Hperson on \n"+
        "Hrequec.r_codemp = Hperson.ccod_empresa and \n"+
        "Hrequec.r_respon = Hperson.ccod_person \n"+
        "inner join Hperson Aprobacion2 on \n"+
        "Hrequec.r_codemp = Aprobacion2.ccod_empresa and \n"+
        "Hrequec.usuario_aprobo1 = Aprobacion2.ccod_person \n"+
        "inner join Hcencos on \n"+
        "Hrequec.r_codemp = Hcencos.ccod_empresa \n"+
        "and Hrequec.r_codcosto = Hcencos.ccod_cencos \n"+
        "inner join Horden_trabajo on \n"+
        "Hrequec.r_codemp = Horden_trabajo.ccod_empresa \n"+
        "and Hrequec.r_ot = Horden_trabajo.ccod_ot \n"+
        "inner join erp_unidad_negocio on \n"+
        "Hrequec.r_codemp = erp_unidad_negocio.erp_codemp \n"+
        "and Hrequec.erp_codune = erp_unidad_negocio.erp_codune \n"+
        "where Hrequec.r_codemp = @codigo_empresa \n"+
        "and Hrequec.atencion <> case @estado_atencion when 'Todos' then '' else 'Atendido' end  \n"+
        "and Hrequec.erp_ptovta = @codigo_punto_venta \n"+ 
        (agrupacion1_valores == "" ? "" : "and "+columnas[agrupacion1_tipo]+" in ("+agrupacion1_valores +") \n")+
        (agrupacion2_valores == "" ? "" : "and "+columnas[agrupacion2_tipo]+" in ("+agrupacion2_valores +") \n")+
        (agrupacion3_valores == "" ? "" : "and "+columnas[agrupacion3_tipo]+" in ("+agrupacion3_valores +") \n")+
        "and Hrequec.r_fecha between @fecha_inicio and @fecha_termino \n"
        
        if(tipo_reporte=="resumido"){
            query = 
                "select  \n"+
                "Punto_Venta, \n"+
                "Codigo_Motivo, \n"+
                "Motivo, \n"+
                "Numero, \n"+
                "Fecha, \n"+
                "Fecha_Limite, \n"+
                "Prioridad, \n"+
                "Estado, \n"+
                "Codigo_Centro_Costo, \n"+
                "Centro_Costo, \n"+
                "Aprobacion_1, \n"+
                "Responsable_Aprobacion_1, \n"+
                "Fecha_Aprobacion_1, \n"+
                "Observacion_Aprobacion_1, \n"+
                "Aprobacion_2, \n"+
                "Responable_Aprobacion_2, \n"+
                "Fecha_Aprobacion_2, \n"+
                "Observacion_Aprobacion_2, \n"+
                "Codigo_Orden_Trabajo, \n"+
                "Orden_Trabajo, \n"+
                "Codigo_Unidad_Negocio, \n"+
                "Unidad_Negocio, \n"+
                "Atencion, \n"+
                "Porcentaje, \n"+
                "Moneda, \n"+
                "Tipo_Cambio, \n"+
                "Glosa, \n"+
                "Agente, \n"+
                "Motivo_Referencia, \n"+
                "Tipo_Referencia, \n"+
                "Numero_Refencia, \n"+
                "Numero_Expediente1, \n"+
                "Numero_Expediente2, \n"+
                "Usuario, \n"+
                "Pc_User, \n"+
                "Pc_Fecha, \n"+
                "Pc_Ip, \n"+
                "Si_Igv, \n"+
                "Base_Calculada, \n"+
                "Descuento, \n"+
                "Base_Imponible, \n"+
                "Igv, \n"+
                "Total, \n"+
                "SUM(Cantidad) as Cantidad, \n"+
                "SUM(Cantidad_Kardex) as Cantidad_Kardex, \n"+
                "SUM(Cantidad_Presentacion) as Cantidad_Presentacion, \n"+
                "SUM(Unit) as Unit, \n"+
                "SUM(Precio_Presentacion) as Precio_Presentacion, \n"+
                "SUM(Detalle_Base_Calculada) as Detalle_Base_Calculada, \n"+
                "SUM(Detalle_Descuento) as Detalle_Descuento, \n"+
                "SUM(Detalle_Base_Imponible) as Detalle_Base_Imponible, \n"+
                "SUM(Detalle_IGV) as Detalle_IGV, \n"+
                "SUM(Detalle_Importe) as Detalle_Importe, \n"+
                "SUM(Cantidad_Atendida) as Cantidad_Atendida, \n"+
                "SUM(Cantidad_Saldo) as Cantidad_Saldo \n"+
                "from ( \n"+
                query +
                " ) as t \n"+
                "group by  \n"+
                "Punto_Venta, \n"+
                "Codigo_Motivo, \n"+
                "Motivo, \n"+
                "Numero, \n"+
                "Fecha, \n"+
                "Fecha_Limite, \n"+
                "Prioridad, \n"+
                "Estado, \n"+
                "Codigo_Centro_Costo, \n"+
                "Centro_Costo, \n"+
                "Aprobacion_1, \n"+
                "Responsable_Aprobacion_1, \n"+
                "Fecha_Aprobacion_1, \n"+
                "Observacion_Aprobacion_1, \n"+
                "Aprobacion_2, \n"+
                "Responable_Aprobacion_2, \n"+
                "Fecha_Aprobacion_2, \n"+
                "Observacion_Aprobacion_2, \n"+
                "Codigo_Orden_Trabajo, \n"+
                "Orden_Trabajo, \n"+
                "Codigo_Unidad_Negocio, \n"+
                "Unidad_Negocio, \n"+
                "Atencion, \n"+
                "Porcentaje, \n"+
                "Moneda, \n"+
                "Tipo_Cambio, \n"+
                "Glosa, \n"+
                "Agente, \n"+
                "Motivo_Referencia, \n"+
                "Tipo_Referencia, \n"+
                "Numero_Refencia, \n"+
                "Numero_Expediente1, \n"+
                "Numero_Expediente2, \n"+
                "Usuario, \n"+
                "Pc_User, \n"+
                "Pc_Fecha, \n"+
                "Pc_Ip, \n"+
                "Si_Igv, \n"+
                "Base_Calculada, \n"+
                "Descuento, \n"+
                "Base_Imponible, \n"+
                "Igv, \n"+
                "Total \n"+
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
        // res.send(query);
        res.send(err.message);
    }
});

router.post('/orden_compra/:tipo_reporte', async (req, res) => {
    try{
        const {tipo_reporte} = req.params;
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.body.punto_venta;

        var columnas = {
            responsable: "Hordcomc.responsable",
            responsable_aprobacion: "Hordcomc.respaprov",
            centro_costos: "Hordcomc.ccod_cencos",
            unidad_negocio: "Hordcomc.erp_codune",
            orden_trabajo: "Hordcomc.ccod_ot",
            motivos_tramite: "Hordcomc.idmotivo_compra",
            codigo_proveedor: "Hordcomc.ccod_proveedor",
            articulos: "Hordcomd.ccod_articulo"
        }
        var columnas_order = {
            responsable_aprobacion: "Codigo_Aprobacion_1",
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
        "Hordcomc.erp_ptovta as Punto_Venta, \n"+
        "Hordcomc.tipo as Tipo_Venta, \n"+
        "Hordcomc.idmotivo_compra as Codigo_Motivo, \n"+
        "erp_motivos_tramite.erp_nommot as Motivo, \n"+
        "Hordcomc.cnum_doc as Numero, \n"+
        "Hordcomc.ccod_proveedor as Codigo_Proveedor, \n"+
        "Hordcomc.cnom_proveedor as Nombre_Proveedor, \n"+
        "Hordcomc.direccion as Direccion_Proveedor, \n"+
        "Hordcomc.lugar_entrega as Lugar_Entrega, \n"+
        "Hordcomc.fact_a_nombre as Facturar_Nombre, \n"+
        "CONVERT(VARCHAR,Hordcomc.dfecha_doc,103) as Fecha, \n"+
        "CONVERT(VARCHAR,Hordcomc.dfecha_entr,103) as Fecha_Entrega, \n"+
        "Hordcomc.estado as Estado, \n"+
        "case Hordcomc.ccod_cencos when '00' then '' else Hordcomc.ccod_cencos end as Codigo_Centro_Costo, \n"+
        "case Hordcomc.ccod_cencos when '00' then '' else Hcencos.cnom_cencos end as Centro_Costo, \n"+
        "case Hordcomc.situaprov when 'Sin Aprobacion' then '' else situaprov end as Aprobacion, \n"+
        "case Hordcomc.situaprov when 'Sin Aprobacion' then '' else Hordcomc.situaprov end as Codigo_Aprobacion, \n"+
        "case Hordcomc.situaprov when 'Sin Aprobacion' then '' else (Aprobacion.ape_pat+' '+Aprobacion.ape_mat+' '+Aprobacion.nombres) end as Responsable_Aprobacion, \n"+
        "case Hordcomc.situaprov when 'Sin Aprobacion' then '' else CONVERT(VARCHAR,Hordcomc.fechaprov,103) end as Fecha_Aprobacion, \n"+
        "Hordcomc.comentaprov as Observacion_Aprobacion, \n"+
        "case Hordcomc.ccod_ot when '00' then '' else Hordcomc.ccod_ot end as Codigo_Orden_Trabajo, \n"+
        "case Hordcomc.ccod_ot when '00' then '' else Horden_trabajo.cnom_ot end as Orden_Trabajo, \n"+
        "case Hordcomc.erp_codune when '00' then '' else Hordcomc.erp_codune end as Codigo_Unidad_Negocio, \n"+
        "case Hordcomc.erp_codune when '00' then '' else erp_unidad_negocio.erp_nomune end as Unidad_Negocio, \n"+
        "Hordcomc.atendido as Atencion, \n"+
        "Hordcomc.porcentaje as Porcentaje, \n"+
        "case Hordcomc.ccod_incoterm when '00' then '' else Hordcomc.ccod_incoterm end as Codigo_Incoterm, \n"+
        "case Hordcomc.ccod_incoterm when '00' then '' else Hincoterm.descripcion end as Incoterm, \n"+
        "Hordcomc.nro_importacion as Nro_Importacion, \n"+
        "Hordcomc.nro_fact_comercial as Invoice, \n"+
        "Hordcomc.persona_contacto as Contacto_Proveedor, \n"+
        "case Hordcomc.ccod_forpago when '00' then '' else Hordcomc.ccod_forpago end as Codigo_Forma_Pago, \n"+
        "case Hordcomc.ccod_forpago when '00' then '' else Hfor_pag.cnom_forpago end as Forma_Pago, \n"+
        "Hordcomc.responsable as Codigo_Responsable, \n"+
        "case Hordcomc.situaprov when 'Sin Aprobacion' then '' else (Hperson.ape_pat+' '+Hperson.ape_mat+' '+Hperson.nombres) end as Responsable, \n"+
        "Hordcomc.cmoneda as Moneda, \n"+
        "Hordcomc.tipocambio as Tipo_Cambio, \n"+
        "Hordcomc.glosa as Glosa, \n"+
        "Hordcomc.usuario as Usuario, \n"+
        "Hordcomc.Pc_User as Pc_User, \n"+
        "Hordcomc.Pc_Fecha as Pc_Fecha, \n"+
        "Hordcomc.Pc_Ip as Pc_Ip, \n"+
        "Hordcomc.si_igv as Si_Igv, \n"+
        "case Hordcomc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hordcomc.cmoneda when 'S/' then Hordcomc.subtotal_sin_descuentos else Hordcomc.subtotal_sin_descuentos*Hordcomc.tipocambio end" : "case Hordcomc.cmoneda when '$' then Hordcomc.subtotal_sin_descuentos else Hordcomc.subtotal_sin_descuentos/Hordcomc.tipocambio end") : "Hordcomc.subtotal_sin_descuentos") +" end as Base_Calculada, \n"+
        "case Hordcomc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hordcomc.cmoneda when 'S/' then Hordcomc.erp_Ddescuento else Hordcomc.erp_Ddescuento*Hordcomc.tipocambio end" : "case Hordcomc.cmoneda when '$' then Hordcomc.erp_Ddescuento else Hordcomc.erp_Ddescuento/Hordcomc.tipocambio end") : "Hordcomc.erp_Ddescuento") +" end as Descuento, \n"+
        "case Hordcomc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hordcomc.cmoneda when 'S/' then Hordcomc.erp_Dsubtotal else Hordcomc.erp_Dsubtotal*Hordcomc.tipocambio end" : "case Hordcomc.cmoneda when '$' then Hordcomc.erp_Dsubtotal else Hordcomc.erp_Dsubtotal/Hordcomc.tipocambio end") : "Hordcomc.erp_Dsubtotal") +" end as Base_Imponible, \n"+
        "case Hordcomc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hordcomc.cmoneda when 'S/' then Hordcomc.erp_Digv else Hordcomc.erp_Digv*Hordcomc.tipocambio end" : "case Hordcomc.cmoneda when '$' then Hordcomc.erp_Digv else Hordcomc.erp_Digv/Hordcomc.tipocambio end") : "Hordcomc.erp_Digv") +" end as Igv, \n"+
        "case Hordcomc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hordcomc.cmoneda when 'S/' then Hordcomc.erp_Dimporte else Hordcomc.erp_Dimporte*Hordcomc.tipocambio end" : "case Hordcomc.cmoneda when '$' then Hordcomc.erp_Dimporte else Hordcomc.erp_Dimporte/Hordcomc.tipocambio end") : "Hordcomc.erp_Dimporte") +" end as Importe, \n"+
        "Hordcomd.nitem as Item, \n"+
        "Hordcomd.ccod_articulo as Codigo_Articulo, \n"+
        "Harticul.ccod_interno as Codigo_Fabricante, \n"+
        "hfam_art.cfamilia as Codigo_Familia, \n"+
        "hfam_art.cnom_familia as Familia, \n"+
        "Hsubfamilia_art.ccod_subfamilia as Codigo_SubFamilia, \n"+
        "Hsubfamilia_art.cnom_subfamilia as SubFamilia, \n"+
        "Harticul.cnom_articulo as Nombre_Articulo, \n"+
        "Hordcomd.cunidad as Unidad, \n"+
        "case Hordcomc.estado when 'Anulado' then '0' else Hordcomd.ncantidad3 end as Cantidad, \n"+
        "Hordcomd.factor as Factor, \n"+
        "case Hordcomc.estado when 'Anulado' then '0' else Hordcomd.ncantidad end as Cantidad_Kardex, \n"+

        "case Hordcomc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hordcomc.cmoneda when 'S/' then Hordcomd.npreciounitario else Hordcomd.npreciounitario*Hordcomc.tipocambio end" : "case Hordcomc.cmoneda when '$' then Hordcomd.npreciounitario else Hordcomd.npreciounitario/Hordcomc.tipocambio end") : "Hordcomd.npreciounitario") +" end as Unit, \n"+
        
        "Hordcomd.codigo_presentacion as Codigo_Presentacion, \n"+
        "Hordcomd.nombre_presentacion as Nombre_Presentacion, \n"+
        "case Hordcomc.estado when 'Anulado' then '0' else Hordcomd.cantidad_presentacion end as Cantidad_Presentacion, \n"+
        "Hordcomd.unidad_presentacion as Unidad_Presentacion, \n"+
        "case Hordcomc.estado when 'Anulado' then '0' else Hordcomd.precio_presentacion end as Precio_Presentacion, \n"+
        "Hordcomd.peso as Peso, \n"+
        "Hordcomd.largo as Largo, \n"+
        "Hordcomd.nigv as Igv_Articulo, \n"+

        "case Hordcomc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hordcomc.cmoneda when 'S/' then Hordcomd.base_calculada else Hordcomd.base_calculada*Hordcomc.tipocambio end" : "case Hordcomc.cmoneda when '$' then Hordcomd.base_calculada else Hordcomd.base_calculada/Hordcomc.tipocambio end") : "Hordcomd.base_calculada") +" end as Detalle_Base_Calculada, \n"+
        "case Hordcomc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hordcomc.cmoneda when 'S/' then Hordcomd.monto_descuento else Hordcomd.monto_descuento*Hordcomc.tipocambio end" : "case Hordcomc.cmoneda when '$' then Hordcomd.monto_descuento else Hordcomd.monto_descuento/Hordcomc.tipocambio end") : "Hordcomd.monto_descuento") +" end as Detalle_Descuento, \n"+
        "case Hordcomc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hordcomc.cmoneda when 'S/' then Hordcomd.nbaseimpon else Hordcomd.nbaseimpon*Hordcomc.tipocambio end" : "case Hordcomc.cmoneda when '$' then Hordcomd.nbaseimpon else Hordcomd.nbaseimpon/Hordcomc.tipocambio end") : "Hordcomd.nbaseimpon") +" end as Detalle_Base_Imponible, \n"+
        "case Hordcomc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hordcomc.cmoneda when 'S/' then Hordcomd.nigvcalc else Hordcomd.nigvcalc*Hordcomc.tipocambio end" : "case Hordcomc.cmoneda when '$' then Hordcomd.nigvcalc else Hordcomd.nigvcalc/Hordcomc.tipocambio end") : "Hordcomd.nigvcalc") +" end as Detalle_IGV, \n"+
        "case Hordcomc.estado when 'Anulado' then '0' else " + (agrupacion0_tipo_moneda == "moneda_tipo" ? (agrupacion0_moneda == "S/" ? "case Hordcomc.cmoneda when 'S/' then Hordcomd.nprecio_importe else Hordcomd.nprecio_importe*Hordcomc.tipocambio end" : "case Hordcomc.cmoneda when '$' then Hordcomd.nprecio_importe else Hordcomd.nprecio_importe/Hordcomc.tipocambio end") : "Hordcomd.nprecio_importe") +" end as Detalle_Importe, \n"+

        "case Hordcomc.estado when 'Anulado' then '0' else isnull((select sum(Hmoviald.ncantidad3) \n"+
        "from Hmoviald \n"+
        "inner join Hmovialc on \n"+
        "Hmoviald.ccod_empresa = Hmovialc.ccod_empresa and  \n"+
        "Hmoviald.ccod_almacen = Hmovialc.ccod_almacen and  \n"+
        "Hmoviald.ccod_movimiento = Hmovialc.ccod_movimiento and  \n"+
        "Hmoviald.ctip_movimiento = Hmovialc.ctip_movimiento and  \n"+
        "Hmoviald.cnum_serie = Hmovialc.cnum_serie and  \n"+
        "Hmoviald.cnum_doc = Hmovialc.cnum_doc  \n"+
        "where \n"+
        "Hmoviald.ccod_empresa = Hordcomd.ccod_empresa and \n"+
        "Hmoviald.ccod_almacen = Hordcomd.erp_ptovta and \n"+
        "Hmoviald.movimiento_origen = 'OC' and \n"+
        "Hmoviald.idmotivo_compra = Hordcomd.idmotivo_compra and \n"+
        "Hmoviald.cnum_doc_ordc = Hordcomd.cnum_doc and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hordcomd.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hordcomd.nitem),0) end as Cantidad_Atendida,\n"+

        "case Hordcomc.estado when 'Anulado' then '0' else Hordcomd.ncantidad3 - isnull((select sum(Hmoviald.ncantidad3) \n"+
        "from Hmoviald \n"+
        "inner join Hmovialc on \n"+
        "Hmoviald.ccod_empresa = Hmovialc.ccod_empresa and  \n"+
        "Hmoviald.ccod_almacen = Hmovialc.ccod_almacen and  \n"+
        "Hmoviald.ccod_movimiento = Hmovialc.ccod_movimiento and  \n"+
        "Hmoviald.ctip_movimiento = Hmovialc.ctip_movimiento and  \n"+
        "Hmoviald.cnum_serie = Hmovialc.cnum_serie and  \n"+
        "Hmoviald.cnum_doc = Hmovialc.cnum_doc  \n"+
        "where \n"+
        "Hmoviald.ccod_empresa = Hordcomd.ccod_empresa and \n"+
        "Hmoviald.ccod_almacen = Hordcomd.erp_ptovta and \n"+
        "Hmoviald.movimiento_origen = 'OC' and \n"+
        "Hmoviald.idmotivo_compra = Hordcomd.idmotivo_compra and \n"+
        "Hmoviald.cnum_doc_ordc = Hordcomd.cnum_doc and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hordcomd.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hordcomd.nitem),0) end as Cantidad_Saldo, \n"+

        "(select sum(n_cantidad) from ( \n"+
        "select ROW_NUMBER() over (order by Hmoviald.cnum_doc) as orden, Hmoviald.ncantidad3 as n_cantidad \n"+
        "from Hmoviald  \n"+
        "inner join Hmovialc on \n"+
        "Hmoviald.ccod_empresa = Hmovialc.ccod_empresa and  \n"+
        "Hmoviald.ccod_almacen = Hmovialc.ccod_almacen and  \n"+
        "Hmoviald.ccod_movimiento = Hmovialc.ccod_movimiento and  \n"+
        "Hmoviald.ctip_movimiento = Hmovialc.ctip_movimiento and  \n"+
        "Hmoviald.cnum_serie = Hmovialc.cnum_serie and  \n"+
        "Hmoviald.cnum_doc = Hmovialc.cnum_doc  \n"+
        "where \n"+
        "Hmoviald.ccod_empresa = Hordcomd.ccod_empresa and \n"+
        "Hmoviald.ccod_almacen = Hordcomd.erp_ptovta and \n"+
        "Hmoviald.movimiento_origen = 'OC' and \n"+
        "Hmoviald.idmotivo_compra = Hordcomd.idmotivo_compra and \n"+
        "Hmoviald.cnum_doc_ordc = Hordcomd.cnum_doc and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hordcomd.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hordcomd.nitem \n"+
        ") as d where orden='1' ) as Guia_Entrada_1, \n"+

        "(select n_documento_referencia from ( \n"+
        "select ROW_NUMBER() over (order by Hmoviald.cnum_doc) as orden, Hmoviald.cnum_doc as n_documento_referencia \n"+
        "from Hmoviald  \n"+
        "inner join Hmovialc on  \n"+
        "Hmoviald.ccod_empresa = Hmovialc.ccod_empresa and  \n"+
        "Hmoviald.ccod_almacen = Hmovialc.ccod_almacen and  \n"+
        "Hmoviald.ccod_movimiento = Hmovialc.ccod_movimiento and  \n"+
        "Hmoviald.ctip_movimiento = Hmovialc.ctip_movimiento and  \n"+
        "Hmoviald.cnum_serie = Hmovialc.cnum_serie and  \n"+
        "Hmoviald.cnum_doc = Hmovialc.cnum_doc  \n"+
        "where  \n"+
        "Hmoviald.ccod_empresa = Hordcomd.ccod_empresa and \n"+
        "Hmoviald.ccod_almacen = Hordcomd.erp_ptovta and \n"+
        "Hmoviald.movimiento_origen = 'OC' and \n"+
        "Hmoviald.idmotivo_compra = Hordcomd.idmotivo_compra and \n"+
        "Hmoviald.cnum_doc_ordc = Hordcomd.cnum_doc and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hordcomd.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hordcomd.nitem \n"+
        ") as d where orden='1' ) as  Referencia_Guia_Entrada_1, \n"+
        

        "(select sum(n_cantidad) from ( \n"+
        "select ROW_NUMBER() over (order by Hmoviald.cnum_doc) as orden, Hmoviald.ncantidad3 as n_cantidad \n"+
        "from Hmoviald  \n"+
        "inner join Hmovialc on \n"+
        "Hmoviald.ccod_empresa = Hmovialc.ccod_empresa and  \n"+
        "Hmoviald.ccod_almacen = Hmovialc.ccod_almacen and  \n"+
        "Hmoviald.ccod_movimiento = Hmovialc.ccod_movimiento and  \n"+
        "Hmoviald.ctip_movimiento = Hmovialc.ctip_movimiento and  \n"+
        "Hmoviald.cnum_serie = Hmovialc.cnum_serie and  \n"+
        "Hmoviald.cnum_doc = Hmovialc.cnum_doc  \n"+
        "where \n"+
        "Hmoviald.ccod_empresa = Hordcomd.ccod_empresa and \n"+
        "Hmoviald.ccod_almacen = Hordcomd.erp_ptovta and \n"+
        "Hmoviald.movimiento_origen = 'OC' and \n"+
        "Hmoviald.idmotivo_compra = Hordcomd.idmotivo_compra and \n"+
        "Hmoviald.cnum_doc_ordc = Hordcomd.cnum_doc and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hordcomd.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hordcomd.nitem \n"+
        ") as d where orden='2' ) as Guia_Entrada_2, \n"+

        "(select n_documento_referencia from ( \n"+
        "select ROW_NUMBER() over (order by Hmoviald.cnum_doc) as orden, Hmoviald.cnum_doc as n_documento_referencia \n"+
        "from Hmoviald  \n"+
        "inner join Hmovialc on  \n"+
        "Hmoviald.ccod_empresa = Hmovialc.ccod_empresa and  \n"+
        "Hmoviald.ccod_almacen = Hmovialc.ccod_almacen and  \n"+
        "Hmoviald.ccod_movimiento = Hmovialc.ccod_movimiento and  \n"+
        "Hmoviald.ctip_movimiento = Hmovialc.ctip_movimiento and  \n"+
        "Hmoviald.cnum_serie = Hmovialc.cnum_serie and  \n"+
        "Hmoviald.cnum_doc = Hmovialc.cnum_doc  \n"+
        "where  \n"+
        "Hmoviald.ccod_empresa = Hordcomd.ccod_empresa and \n"+
        "Hmoviald.ccod_almacen = Hordcomd.erp_ptovta and \n"+
        "Hmoviald.movimiento_origen = 'OC' and \n"+
        "Hmoviald.idmotivo_compra = Hordcomd.idmotivo_compra and \n"+
        "Hmoviald.cnum_doc_ordc = Hordcomd.cnum_doc and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hordcomd.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hordcomd.nitem \n"+
        ") as d where orden='2' ) as  Referencia_Guia_Entrada_2, \n"+

        "(select sum(n_cantidad) from ( \n"+
        "select ROW_NUMBER() over (order by Hmoviald.cnum_doc) as orden, Hmoviald.ncantidad3 as n_cantidad \n"+
        "from Hmoviald  \n"+
        "inner join Hmovialc on \n"+
        "Hmoviald.ccod_empresa = Hmovialc.ccod_empresa and  \n"+
        "Hmoviald.ccod_almacen = Hmovialc.ccod_almacen and  \n"+
        "Hmoviald.ccod_movimiento = Hmovialc.ccod_movimiento and  \n"+
        "Hmoviald.ctip_movimiento = Hmovialc.ctip_movimiento and  \n"+
        "Hmoviald.cnum_serie = Hmovialc.cnum_serie and  \n"+
        "Hmoviald.cnum_doc = Hmovialc.cnum_doc  \n"+
        "where \n"+
        "Hmoviald.ccod_empresa = Hordcomd.ccod_empresa and \n"+
        "Hmoviald.ccod_almacen = Hordcomd.erp_ptovta and \n"+
        "Hmoviald.movimiento_origen = 'OC' and \n"+
        "Hmoviald.idmotivo_compra = Hordcomd.idmotivo_compra and \n"+
        "Hmoviald.cnum_doc_ordc = Hordcomd.cnum_doc and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hordcomd.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hordcomd.nitem \n"+
        ") as d where orden='3' ) as Guia_Entrada_3, \n"+

        "(select n_documento_referencia from ( \n"+
        "select ROW_NUMBER() over (order by Hmoviald.cnum_doc) as orden, Hmoviald.cnum_doc as n_documento_referencia \n"+
        "from Hmoviald  \n"+
        "inner join Hmovialc on  \n"+
        "Hmoviald.ccod_empresa = Hmovialc.ccod_empresa and  \n"+
        "Hmoviald.ccod_almacen = Hmovialc.ccod_almacen and  \n"+
        "Hmoviald.ccod_movimiento = Hmovialc.ccod_movimiento and  \n"+
        "Hmoviald.ctip_movimiento = Hmovialc.ctip_movimiento and  \n"+
        "Hmoviald.cnum_serie = Hmovialc.cnum_serie and  \n"+
        "Hmoviald.cnum_doc = Hmovialc.cnum_doc  \n"+
        "where  \n"+
        "Hmoviald.ccod_empresa = Hordcomd.ccod_empresa and \n"+
        "Hmoviald.ccod_almacen = Hordcomd.erp_ptovta and \n"+
        "Hmoviald.movimiento_origen = 'OC' and \n"+
        "Hmoviald.idmotivo_compra = Hordcomd.idmotivo_compra and \n"+
        "Hmoviald.cnum_doc_ordc = Hordcomd.cnum_doc and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hordcomd.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hordcomd.nitem \n"+
        ") as d where orden='3' ) as  Referencia_Guia_Entrada_3, \n"+

        "(select sum(n_cantidad) from ( \n"+
        "select ROW_NUMBER() over (order by Hmoviald.cnum_doc) as orden, Hmoviald.ncantidad3 as n_cantidad \n"+
        "from Hmoviald  \n"+
        "inner join Hmovialc on \n"+
        "Hmoviald.ccod_empresa = Hmovialc.ccod_empresa and  \n"+
        "Hmoviald.ccod_almacen = Hmovialc.ccod_almacen and  \n"+
        "Hmoviald.ccod_movimiento = Hmovialc.ccod_movimiento and  \n"+
        "Hmoviald.ctip_movimiento = Hmovialc.ctip_movimiento and  \n"+
        "Hmoviald.cnum_serie = Hmovialc.cnum_serie and  \n"+
        "Hmoviald.cnum_doc = Hmovialc.cnum_doc  \n"+
        "where \n"+
        "Hmoviald.ccod_empresa = Hordcomd.ccod_empresa and \n"+
        "Hmoviald.ccod_almacen = Hordcomd.erp_ptovta and \n"+
        "Hmoviald.movimiento_origen = 'OC' and \n"+
        "Hmoviald.idmotivo_compra = Hordcomd.idmotivo_compra and \n"+
        "Hmoviald.cnum_doc_ordc = Hordcomd.cnum_doc and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hordcomd.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hordcomd.nitem \n"+
        ") as d where orden='4' ) as Guia_Entrada_4, \n"+

        "(select n_documento_referencia from ( \n"+
        "select ROW_NUMBER() over (order by Hmoviald.cnum_doc) as orden, Hmoviald.cnum_doc as n_documento_referencia \n"+
        "from Hmoviald  \n"+
        "inner join Hmovialc on  \n"+
        "Hmoviald.ccod_empresa = Hmovialc.ccod_empresa and  \n"+
        "Hmoviald.ccod_almacen = Hmovialc.ccod_almacen and  \n"+
        "Hmoviald.ccod_movimiento = Hmovialc.ccod_movimiento and  \n"+
        "Hmoviald.ctip_movimiento = Hmovialc.ctip_movimiento and  \n"+
        "Hmoviald.cnum_serie = Hmovialc.cnum_serie and  \n"+
        "Hmoviald.cnum_doc = Hmovialc.cnum_doc  \n"+
        "where  \n"+
        "Hmoviald.ccod_empresa = Hordcomd.ccod_empresa and \n"+
        "Hmoviald.ccod_almacen = Hordcomd.erp_ptovta and \n"+
        "Hmoviald.movimiento_origen = 'OC' and \n"+
        "Hmoviald.idmotivo_compra = Hordcomd.idmotivo_compra and \n"+
        "Hmoviald.cnum_doc_ordc = Hordcomd.cnum_doc and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hordcomd.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hordcomd.nitem \n"+
        ") as d where orden='4' ) as  Referencia_Guia_Entrada_4, \n"+

        "(select sum(n_cantidad) from ( \n"+
        "select ROW_NUMBER() over (order by Hmoviald.cnum_doc) as orden, Hmoviald.ncantidad3 as n_cantidad \n"+
        "from Hmoviald  \n"+
        "inner join Hmovialc on \n"+
        "Hmoviald.ccod_empresa = Hmovialc.ccod_empresa and  \n"+
        "Hmoviald.ccod_almacen = Hmovialc.ccod_almacen and  \n"+
        "Hmoviald.ccod_movimiento = Hmovialc.ccod_movimiento and  \n"+
        "Hmoviald.ctip_movimiento = Hmovialc.ctip_movimiento and  \n"+
        "Hmoviald.cnum_serie = Hmovialc.cnum_serie and  \n"+
        "Hmoviald.cnum_doc = Hmovialc.cnum_doc  \n"+
        "where \n"+
        "Hmoviald.ccod_empresa = Hordcomd.ccod_empresa and \n"+
        "Hmoviald.ccod_almacen = Hordcomd.erp_ptovta and \n"+
        "Hmoviald.movimiento_origen = 'OC' and \n"+
        "Hmoviald.idmotivo_compra = Hordcomd.idmotivo_compra and \n"+
        "Hmoviald.cnum_doc_ordc = Hordcomd.cnum_doc and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hordcomd.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hordcomd.nitem \n"+
        ") as d where orden='5' ) as Guia_Entrada_5, \n"+

        "(select n_documento_referencia from ( \n"+
        "select ROW_NUMBER() over (order by Hmoviald.cnum_doc) as orden, Hmoviald.cnum_doc as n_documento_referencia \n"+
        "from Hmoviald  \n"+
        "inner join Hmovialc on  \n"+
        "Hmoviald.ccod_empresa = Hmovialc.ccod_empresa and  \n"+
        "Hmoviald.ccod_almacen = Hmovialc.ccod_almacen and  \n"+
        "Hmoviald.ccod_movimiento = Hmovialc.ccod_movimiento and  \n"+
        "Hmoviald.ctip_movimiento = Hmovialc.ctip_movimiento and  \n"+
        "Hmoviald.cnum_serie = Hmovialc.cnum_serie and  \n"+
        "Hmoviald.cnum_doc = Hmovialc.cnum_doc  \n"+
        "where  \n"+
        "Hmoviald.ccod_empresa = Hordcomd.ccod_empresa and \n"+
        "Hmoviald.ccod_almacen = Hordcomd.erp_ptovta and \n"+
        "Hmoviald.movimiento_origen = 'OC' and \n"+
        "Hmoviald.idmotivo_compra = Hordcomd.idmotivo_compra and \n"+
        "Hmoviald.cnum_doc_ordc = Hordcomd.cnum_doc and  \n"+
        "Hmovialc.estado <> 'Anulado' and \n"+
        "Hmoviald.ccod_articulo = Hordcomd.ccod_articulo and  \n"+
        "Hmoviald.origen_item = Hordcomd.nitem \n"+
        ") as d where orden='5' ) as  Referencia_Guia_Entrada_5 \n"+
        
        "from Hordcomc \n"+
        "inner join Hordcomd on \n"+
        "Hordcomc.ccod_empresa = Hordcomd.ccod_empresa and \n"+
        "Hordcomc.erp_ptovta = Hordcomd.erp_ptovta and \n"+
        "Hordcomc.idmotivo_compra = Hordcomd.idmotivo_compra and \n"+
        "Hordcomc.cnum_doc = Hordcomd.cnum_doc \n"+
        "Inner Join erp_motivos_tramite on \n"+
        "Hordcomd.ccod_empresa = erp_motivos_tramite.erp_codemp \n"+
        "and Hordcomc.idmotivo_compra = erp_motivos_tramite.erp_codmot \n"+
        "Inner Join Harticul on \n"+
        "Hordcomd.ccod_empresa = Harticul.ccod_empresa \n"+
        "and Hordcomd.ccod_articulo = Harticul.ccod_articulo \n"+
        "Inner Join hfam_art on \n"+
        "hfam_art.ccod_empresa = Harticul.ccod_empresa \n"+
        "and hfam_art.cfamilia = Harticul.cfamilia \n"+
        "Inner Join Hsubfamilia_art on \n"+
        "Hsubfamilia_art.ccod_empresa = Harticul.ccod_empresa \n"+
        "and Hsubfamilia_art.ccod_subfamilia = Harticul.ccod_subfamilia \n"+
        "inner join Hincoterm on \n"+
        "Hordcomc.ccod_empresa = Hincoterm.ccod_empresa and \n"+
        "Hordcomc.ccod_incoterm = Hincoterm.ccod_incoterm \n"+
        "inner join Hfor_pag on \n"+
        "Hordcomc.ccod_empresa = Hfor_pag.ccod_empresa and \n"+
        "Hordcomc.ccod_forpago = Hfor_pag.ccod_forpago \n"+
        "inner join Hperson on \n"+
        "Hordcomc.ccod_empresa = Hperson.ccod_empresa and \n"+
        "Hordcomc.responsable = Hperson.ccod_person \n"+
        "inner join Hperson Aprobacion on \n"+
        "Hordcomc.ccod_empresa = Aprobacion.ccod_empresa and \n"+
        "Hordcomc.respaprov = Aprobacion.ccod_person \n"+
        "inner join Hcencos on \n"+
        "Hordcomc.ccod_empresa = Hcencos.ccod_empresa \n"+
        "and Hordcomc.ccod_cencos = Hcencos.ccod_cencos \n"+
        "inner join Horden_trabajo on \n"+
        "Hordcomc.ccod_empresa = Horden_trabajo.ccod_empresa \n"+
        "and Hordcomc.ccod_ot = Horden_trabajo.ccod_ot \n"+
        "inner join erp_unidad_negocio on \n"+
        "Hordcomc.ccod_empresa = erp_unidad_negocio.erp_codemp \n"+
        "and Hordcomc.erp_codune = erp_unidad_negocio.erp_codune \n"+
        "where Hordcomc.ccod_empresa = @codigo_empresa \n"+
        "and Hordcomc.atendido <> case @estado_atencion when 'Todos' then '' else 'Atendido' end  \n"+
        "and Hordcomc.erp_ptovta = @codigo_punto_venta \n"+ 
        (agrupacion1_valores == "" ? "" : "and "+columnas[agrupacion1_tipo]+" in ("+agrupacion1_valores +") \n")+
        (agrupacion2_valores == "" ? "" : "and "+columnas[agrupacion2_tipo]+" in ("+agrupacion2_valores +") \n")+
        (agrupacion3_valores == "" ? "" : "and "+columnas[agrupacion3_tipo]+" in ("+agrupacion3_valores +") \n")+
        "and Hordcomc.dfecha_doc between @fecha_inicio and @fecha_termino \n"
        
        if(tipo_reporte=="resumido"){
            query = 
                "select  \n"+
                "Punto_Venta, \n"+
                "Tipo_Venta, \n"+
                "Codigo_Motivo, \n"+
                "Motivo, \n"+
                "Numero, \n"+
                "Codigo_Proveedor, \n"+
                "Nombre_Proveedor, \n"+
                "Direccion_Proveedor, \n"+
                "Lugar_Entrega, \n"+
                "Facturar_Nombre, \n"+
                "Fecha, \n"+
                "Fecha_Entrega, \n"+
                "Estado, \n"+
                "Codigo_Centro_Costo, \n"+
                "Centro_Costo, \n"+
                "Aprobacion, \n"+
                "Codigo_Aprobacion, \n"+
                "Responsable_Aprobacion, \n"+
                "Fecha_Aprobacion, \n"+
                "Observacion_Aprobacion, \n"+
                "Codigo_Orden_Trabajo, \n"+
                "Orden_Trabajo, \n"+
                "Codigo_Unidad_Negocio, \n"+
                "Unidad_Negocio, \n"+
                "Atencion, \n"+
                "Porcentaje, \n"+
                "Codigo_Incoterm, \n"+
                "Incoterm, \n"+
                "Nro_Importacion, \n"+
                "Invoice, \n"+
                "Contacto_Proveedor, \n"+
                "Codigo_Forma_Pago, \n"+
                "Forma_Pago, \n"+
                "Codigo_Responsable, \n"+
                "Responsable, \n"+
                "Moneda, \n"+
                "Tipo_Cambio, \n"+
                "Glosa, \n"+
                "Usuario, \n"+
                "Pc_User, \n"+
                "Pc_Fecha, \n"+
                "Pc_Ip, \n"+
                "Si_Igv, \n"+
                "Base_Calculada, \n"+
                "Descuento, \n"+
                "Base_Imponible, \n"+
                "Igv, \n"+
                "Importe, \n"+
                "SUM(Cantidad) as Cantidad, \n"+
                "SUM(Cantidad_Kardex) as Cantidad_Kardex, \n"+
                "SUM(Cantidad_Presentacion) as Cantidad_Presentacion, \n"+
                "SUM(Precio_Presentacion) as Precio_Presentacion, \n"+
                "SUM(Unit) as Unit, \n"+
                "SUM(Detalle_Base_Calculada) as Detalle_Base_Calculada, \n"+
                "SUM(Detalle_Descuento) as Detalle_Descuento, \n"+
                "SUM(Detalle_Base_Imponible) as Detalle_Base_Imponible, \n"+
                "SUM(Detalle_IGV) as Detalle_IGV, \n"+
                "SUM(Detalle_Importe) as Detalle_Importe, \n"+
                "SUM(Cantidad_Atendida) as Cantidad_Atendida, \n"+
                "SUM(Cantidad_Saldo) as Cantidad_Saldo \n"+
                "from ( \n"+
                query +
                " ) as t \n"+
                "group by  \n"+
                "Punto_Venta, \n"+
                "Tipo_Venta, \n"+
                "Codigo_Motivo, \n"+
                "Motivo, \n"+
                "Numero, \n"+
                "Codigo_Proveedor, \n"+
                "Nombre_Proveedor, \n"+
                "Direccion_Proveedor, \n"+
                "Lugar_Entrega, \n"+
                "Facturar_Nombre, \n"+
                "Fecha, \n"+
                "Fecha_Entrega, \n"+
                "Estado, \n"+
                "Codigo_Centro_Costo, \n"+
                "Centro_Costo, \n"+
                "Aprobacion, \n"+
                "Codigo_Aprobacion, \n"+
                "Responsable_Aprobacion, \n"+
                "Fecha_Aprobacion, \n"+
                "Observacion_Aprobacion, \n"+
                "Codigo_Orden_Trabajo, \n"+
                "Orden_Trabajo, \n"+
                "Codigo_Unidad_Negocio, \n"+
                "Unidad_Negocio, \n"+
                "Atencion, \n"+
                "Porcentaje, \n"+
                "Codigo_Incoterm, \n"+
                "Incoterm, \n"+
                "Nro_Importacion, \n"+
                "Invoice, \n"+
                "Contacto_Proveedor, \n"+
                "Codigo_Forma_Pago, \n"+
                "Forma_Pago, \n"+
                "Codigo_Responsable, \n"+
                "Responsable, \n"+
                "Moneda, \n"+
                "Tipo_Cambio, \n"+
                "Glosa, \n"+
                "Usuario, \n"+
                "Pc_User, \n"+
                "Pc_Fecha, \n"+
                "Pc_Ip, \n"+
                "Si_Igv, \n"+
                "Base_Calculada, \n"+
                "Descuento, \n"+
                "Base_Imponible, \n"+
                "Igv, \n"+
                "Importe \n"+
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
        // res.send(query);
    }
});

router.post('/cuadro_comparativo/:tipo_reporte', async (req, res) => {
    try{
        const {tipo_reporte} = req.params;
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.body.punto_venta;
        var columnas = {
            responsable: "erp_precotizacionc.erp_codres",
            orden_trabajo: "erp_precotizaciond.erp_codot",
            codigo_proveedor: "erp_precotizacion_proveedoresc.erp_codpro",
            articulos: "erp_precotizaciond.erp_codart"
        }
        var agrupacion1_valores = req.body.agrupacion1_valores;
        var agrupacion2_valores = req.body.agrupacion2_valores;
        var agrupacion3_valores = req.body.agrupacion3_valores;
        var agrupacion1_tipo = req.body.agrupacion1_tipo;
        var agrupacion2_tipo = req.body.agrupacion2_tipo;
        var agrupacion3_tipo = req.body.agrupacion3_tipo;

        var query="";
        if(tipo_reporte=="resumido"){
            query=
            "select  \n"+
            "erp_precotizacion_proveedoresc.erp_codptv as Punto_Venta, \n"+
            "erp_precotizacion_proveedoresc.erp_numprc as Numero_PreCotizacion, \n"+
            " CONVERT(VARCHAR,erp_precotizacionc.erp_fecdoc,103) as Fecha_Documento, \n"+
            "erp_precotizacion_proveedoresc.erp_iteprc as Item_PreCotizacion, \n"+
            "erp_precotizacion_proveedoresc.erp_codpro as Codigo_Proveedor, \n"+
            "Hproveed.ccod_proveedor as Nombre_Proveedor, \n"+
            "erp_precotizacion_proveedoresc.erp_codfpa as Codigo_Forma_Pago, \n"+
            "Hfor_pag.cnom_forpago as Nombre_Forma_Pago, \n"+
            "erp_precotizacion_proveedoresc.erp_diaent as Dias_Entrega, \n"+
            "erp_precotizacion_proveedoresc.erp_obsprc as Observacion, \n"+
            "erp_precotizacion_proveedoresc.erp_moneda as Moneda, \n"+
            "erp_precotizacionc.erp_numref as Numero_Referencia, \n"+
            "erp_precotizacionc.erp_codres as Codigo_Responsable, \n"+
            " CONVERT(VARCHAR,erp_precotizacion_proveedoresc.fecha_pc,103) as Fecha_PC \n"+
            "from erp_precotizacion_proveedoresc \n"+
            "inner join erp_precotizacionc on  \n"+
            "erp_precotizacion_proveedoresc.erp_codemp = erp_precotizacionc.erp_codemp \n"+
            "and erp_precotizacion_proveedoresc.erp_codptv = erp_precotizacionc.erp_codptv \n"+
            "and erp_precotizacion_proveedoresc.erp_numprc = erp_precotizacionc.erp_numprc \n"+
            "inner join Hproveed on \n"+
            "erp_precotizacion_proveedoresc.erp_codemp = Hproveed.ccod_empresa \n"+
            "and erp_precotizacion_proveedoresc.erp_codpro = Hproveed.ccod_proveedor \n"+
            "inner join Hfor_pag on \n"+
            "erp_precotizacion_proveedoresc.erp_codemp = Hfor_pag.ccod_empresa \n"+
            "and erp_precotizacion_proveedoresc.erp_codfpa = Hfor_pag.ccod_forpago \n"+
            "inner join hperson on \n"+
            "erp_precotizacionc.erp_codemp = hperson.ccod_empresa \n"+
            "and erp_precotizacionc.erp_codres = hperson.ccod_person \n"+
            "where \n"+
            "erp_precotizacion_proveedoresc.erp_codemp = @codigo_empresa \n"+
            "and erp_precotizacion_proveedoresc.erp_codpro<>'00' \n"+
            "and erp_precotizacion_proveedoresc.erp_codptv = @codigo_punto_venta \n"+ 
            (agrupacion1_valores == "" ? "" : "and "+columnas[agrupacion1_tipo]+" in ("+agrupacion1_valores +") \n")+
            (agrupacion2_valores == "" ? "" : "and "+columnas[agrupacion2_tipo]+" in ("+agrupacion2_valores +") \n")+
            (agrupacion3_valores == "" ? "" : "and "+columnas[agrupacion3_tipo]+" in ("+agrupacion3_valores +") \n")+
            " and erp_precotizacionc.erp_fecdoc between @fecha_inicio and @fecha_termino \n"+
            " order by \n"+
            (columnas[agrupacion1_tipo] ? columnas[agrupacion1_tipo] : "erp_precotizacion_proveedoresc.erp_codptv") +", \n"+
            (columnas[agrupacion2_tipo] ? columnas[agrupacion2_tipo] : "erp_precotizacionc.erp_fecdoc desc") +", \n"+
            (columnas[agrupacion3_tipo] ? columnas[agrupacion3_tipo] : "erp_precotizacion_proveedoresc.erp_numprc") +" \n";
        }else{
            query =
            "select  \n"+
            "erp_precotizacion_proveedoresc.erp_codptv as Punto_Venta, \n"+
            "erp_precotizacion_proveedoresc.erp_numprc as Numero_PreCotizacion, \n"+
            "CONVERT(VARCHAR,erp_precotizacionc.erp_fecdoc,103) as Fecha_Documento, \n"+
            "erp_precotizacion_proveedoresc.erp_iteprc as Item_PreCotizacion, \n"+
            "erp_precotizacion_proveedoresc.erp_codpro as Codigo_Proveedor, \n"+
            "Hproveed.ccod_proveedor as Nombre_Proveedor, \n"+
            "erp_precotizacion_proveedoresc.erp_codfpa as Codigo_Forma_Pago, \n"+
            "Hfor_pag.cnom_forpago as Nombre_Forma_Pago, \n"+
            "erp_precotizacion_proveedoresc.erp_diaent as Dias_Entrega, \n"+
            "erp_precotizacion_proveedoresc.erp_obsprc as Observacion, \n"+
            "erp_precotizacion_proveedoresc.erp_moneda as Moneda, \n"+
            "erp_precotizacionc.erp_numref as Numero_Referencia, \n"+
            "erp_precotizacionc.erp_codres as Codigo_Responsable, \n"+
            "CONVERT(VARCHAR,erp_precotizacion_proveedoresc.fecha_pc,103) as Fecha_PC, \n"+
            "erp_precotizaciond.erp_itemov as Nitem, \n"+
            "erp_precotizaciond.erp_codart as Codigo_Articulo, \n"+
            "erp_precotizaciond.erp_nomart as Nombre_Articulo, \n"+
            "erp_precotizaciond.erp_codune as Unidad_Medida, \n"+
            "erp_precotizaciond.erp_canmov as Cantidad, \n"+
            "erp_precotizacion_proveedoresd.erp_premov as Precio, \n"+
            "case erp_precotizacion_proveedoresd.erp_booapr when '1' then 'Aprobado' else 'Sin Aprobación' end as Estado, \n"+
            "erp_precotizaciond.erp_codot as Codigo_Orden_Trabajo, \n"+
            "erp_precotizaciond.erp_motreq as Codigo_Motivo_Referencia \n"+
            "from erp_precotizacion_proveedoresc \n"+
            "inner join erp_precotizacion_proveedoresd on \n"+
            "erp_precotizacion_proveedoresc.erp_codemp = erp_precotizacion_proveedoresd.erp_codemp \n"+
            "and erp_precotizacion_proveedoresc.erp_codptv = erp_precotizacion_proveedoresd.erp_codptv \n"+
            "and erp_precotizacion_proveedoresc.erp_numprc = erp_precotizacion_proveedoresd.erp_numprc \n"+
            "and erp_precotizacion_proveedoresc.erp_iteprc = erp_precotizacion_proveedoresd.erp_iteprc \n"+
            "inner join erp_precotizacionc on  \n"+
            "erp_precotizacion_proveedoresc.erp_codemp = erp_precotizacionc.erp_codemp \n"+
            "and erp_precotizacion_proveedoresc.erp_codptv = erp_precotizacionc.erp_codptv \n"+
            "and erp_precotizacion_proveedoresc.erp_numprc = erp_precotizacionc.erp_numprc \n"+
            "inner join erp_precotizaciond on  \n"+
            "erp_precotizaciond.erp_codemp = erp_precotizacionc.erp_codemp \n"+
            "and erp_precotizaciond.erp_codptv = erp_precotizacionc.erp_codptv \n"+
            "and erp_precotizaciond.erp_numprc = erp_precotizacionc.erp_numprc \n"+
            "and erp_precotizaciond.erp_itemov = erp_precotizacion_proveedoresd.erp_itedet \n"+
            "inner join Hproveed on \n"+
            "erp_precotizacion_proveedoresc.erp_codemp = Hproveed.ccod_empresa \n"+
            "and erp_precotizacion_proveedoresc.erp_codpro = Hproveed.ccod_proveedor \n"+
            "inner join Hfor_pag on \n"+
            "erp_precotizacion_proveedoresc.erp_codemp = Hfor_pag.ccod_empresa \n"+
            "and erp_precotizacion_proveedoresc.erp_codfpa = Hfor_pag.ccod_forpago \n"+
            "inner join hperson on \n"+
            "erp_precotizacionc.erp_codemp = hperson.ccod_empresa \n"+
            "and erp_precotizacionc.erp_codres = hperson.ccod_person \n"+
            "where \n"+
            "erp_precotizacion_proveedoresc.erp_codemp = @codigo_empresa \n"+
            "and erp_precotizacion_proveedoresc.erp_codpro<>'00' \n"+
            "and erp_precotizacion_proveedoresc.erp_codptv = @codigo_punto_venta \n"+ 
            (agrupacion1_valores == "" ? "" : "and "+columnas[agrupacion1_tipo]+" in ("+agrupacion1_valores +") \n")+
            (agrupacion2_valores == "" ? "" : "and "+columnas[agrupacion2_tipo]+" in ("+agrupacion2_valores +") \n")+
            (agrupacion3_valores == "" ? "" : "and "+columnas[agrupacion3_tipo]+" in ("+agrupacion3_valores +") \n")+
            " and erp_precotizacionc.erp_fecdoc between @fecha_inicio and @fecha_termino \n"+
            " order by \n"+
            (columnas[agrupacion1_tipo] ? columnas[agrupacion1_tipo] : "erp_precotizacion_proveedoresc.erp_codptv") +", \n"+
            (columnas[agrupacion2_tipo] ? columnas[agrupacion2_tipo] : "erp_precotizacionc.erp_fecdoc desc") +", \n"+
            (columnas[agrupacion3_tipo] ? columnas[agrupacion3_tipo] : "erp_precotizacion_proveedoresc.erp_numprc") +" \n";
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