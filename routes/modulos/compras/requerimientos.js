const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../../database');

router.post('/configuracion_permisos', async (req, res) => {

    try{
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_usuario = req.user.codigo_usuario;
        const pool = await poolPromise;
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_usuario', mssql.VarChar(20), codigo_usuario)
        .query("select modulo, acceso, guardar, modificar, eliminar from configuracion_permisos where codigo_empresa=@codigo_empresa and codigo_usuario=@codigo_usuario and modulo like'%solicitud_compra'");
      
        const recordset = lista.recordset;
        res.json(recordset);
    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
});

router.post('/detalle', async (req, res) => {

    const codigo_empresa = req.user.codigo_empresa;
    // const motivo_documento = '022';
    // const numero_documento = '2020-00002';
    // const codigo_punto_venta = '001';
    const motivo_documento = req.body.motivo_documento;
    const numero_documento = req.body.numero_documento;
    var codigo_punto_venta = req.body.codigo_punto_venta;

    if(codigo_punto_venta==""){
        codigo_punto_venta = req.user.codigo_punto_venta;
    }
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('motivo_documento', mssql.VarChar(250), motivo_documento)
    .input('numero_documento', mssql.VarChar(250), numero_documento)
    .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
    .query("SELECT \n"+
        "Hrequed.item as NItem,\n"+
        "Hrequed.rcantidad as Cantidad,\n"+
        "Hrequed.r_codart AS Codigo,\n"+
        "Harticul.ccod_almacen as Tipo_producto,\n"+
        "Harticul.cfamilia as Familia,\n"+
        "Harticul.ccod_subfamilia as Subfamilia,\n"+
        "harticul.codmarca as Codigo_Concepto1,\n"+
        "harticul.modelo as Concepto2,\n"+
        "harticul.color as Concepto3,\n"+
        "harticul.tratamiento as Concepto4,\n"+
        "harticul.fuelle as Concepto5,\n"+
        "harticul.azas as Concepto6,\n"+
        "harticul.solapa as Concepto7,\n"+
        "harticul.ccod_interno as Codigo_Fabricante,\n"+
        "harticul.cod_digemir as Codigo_Digemid,\n"+
        "harticul.erp_codinterno2 as Codigo_Interno,\n"+
        "harticul.erp_codinterno3 as Codigo_Interno2,\n"+
        "harticul.observacion as Leyenda1,\n"+ 
        "harticul.erp_observacion2 as Leyenda2,\n"+
        "Hrequed.rdesc AS Nombre,\n"+ 
        "RTRIM(Hrequed.runidades) AS Codigo_Unidad,\n"+
        "RTRIM(Hrequed.runidades) AS Unidad,\n"+
        "'' as Comision_porcentaje,\n"+ 
        "Hrequed.factor as Factor,\n"+ 
        "Hrequed.r_precio as Unit,\n"+ 
        " '0' as Desc1,\n"+
        " '0' as Desc2,\n"+
        " '0' As Desc3,\n"+
        " '0' as Desc4,\n"+
        "Hrequed.nbasecalc as Base_Calculada,\n"+
        "Hrequed.nbaseimpon as Base_Imponible,\n"+
        "Hrequed.nigvcalc as Igv,\n"+ 
        "Hrequed.nprecio_importe as Importe,\n"+
        "Hrequed.erp_peso as Peso,\n"+ 
        "Hrequed.Erp_Cantidad_Presentacion as Cantidad_presentacion,\n"+
        "Hrequed.codigo_presentacion as Codigo_presentacion,\n"+
        "RTRIM(Hrequed.Erp_Unidad_Presentacion) AS Unidad_presentacion,\n"+
        "Hrequed.Erp_Nombre_Presentacion AS Nombre_presentacion,\n"+
        "Hrequed.Erp_Precio_Presentacion as Precio_presentacion,\n"+
        "'' as Observacion,\n"+ 
        "Hrequed.r_ot as OT,\n"+ 
        "Hrequed.rcantidad as Cantidad_Kardex,\n"+ 
        "Hrequed.barticulo as Barticulo,\n"+ 
        "Hrequed.nigv as Igv_Art,\n"+ 
        "Hrequed.monto_descuento as Monto_Descuento,\n"+ 
        "'' as Precio_original,\n"+ 
        "Hrequed.erp_codune as Codigo_Unidad_Negocio,\n"+ 
        "Hrequed.erp_codune as Unidad_negocio,\n"+ 
        "Hrequed.ccod_cencos AS Codigo_Cencos,\n"+ 
        "Hrequed.ccod_cencos AS Cencos,\n"+ 
        "Hrequed.erp_codage as Codigo_Agencia,\n"+ 
        "Hrequed.erp_codage as Agencia,\n"+ 
        "Harticul.csistock as Stock_SN, \n"+ 
        "Harticul.lote as Lote_SN, \n"+ 
        "'' as Lote_Numero, \n"+ 
        "'' as Lote_Vencimiento, \n"+ 
        "Harticul.flagserie Serie_SN \n"+ 
        "FROM Hrequed inner Join Harticul On \n"+
        "Hrequed.rcod_emp = Harticul.ccod_empresa and\n"+ 
        "Hrequed.r_codart = Harticul.ccod_articulo\n"+ 
        "WHERE \n"+
        "Hrequed.rcod_emp = @codigo_empresa and \n"+ 
        "Hrequed.idmotivo_compra = @motivo_documento and\n"+ 
        "Hrequed.rcod_req = @numero_documento and \n"+ 
        "Hrequed.erp_ptovta= @codigo_punto_venta \n"+ 
        "ORDER BY NITEM");
 
    const recordset = lista.recordset;
    res.json(recordset);
});

router.post('/guardar', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.user.codigo_punto_venta;
        const usuario = req.user.codigo_usuario;

        var filas_detalle = JSON.parse(req.body.filas_detalle)
        var filas_comentarios = JSON.parse(req.body.filas_comentarios)
        var numero_correlativo;
        const pool = await poolPromise;
        const transaction = await new mssql.Transaction(pool);
        await transaction.begin(async err => {
            try{
                //#region Generación del correlativo automatico
                if (req.body.automatico == "A") {
                    const request_automatico  = new mssql.Request(transaction);
                    const result_automatico = await request_automatico 
                    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
                    .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
                    .input("idmotivo_compra", mssql.VarChar(250), req.body.motivo_documento)
                    .input("anio", mssql.VarChar(250), req.body.anio)
                    .query(
                        "declare \n"+
                        "@correlativo varchar(50), \n"+
                        "@contador int, \n"+
                        "@cantidad_ceros int, \n"+
                        "@ceros varchar(50), \n"+
                        "@cnt INT \n"+
                        "set @contador = 1 \n"+
                        "set @ceros ='' \n"+
                        "SELECT @correlativo = erp_nummot\n"+
                        "FROM erp_motivos_tramite_detalle\n"+
                        "WHERE erp_codemp = @codigo_empresa \n"+
                        "and erp_codmot = @idmotivo_compra \n"+
                        "and erp_sermot = @anio\n"+
                        "select \n"+
                        "@cantidad_ceros = Isnull(cantidad_caracteres,0) \n"+
                        "from htipdoc \n"+
                        "where ccod_empresa = @codigo_empresa \n"+
                        "and ctip_doc = 'REQ'\n"+
                        "set @cnt = LEN(@correlativo) \n"+
                        "WHILE @cnt < @cantidad_ceros \n"+
                        "BEGIN \n"+
                        "SET @ceros = '0'+@ceros \n"+
                        "SET @cnt = @cnt + 1 \n"+
                        "END \n"+
                        "while @contador>0\n"+
                        "begin \n"+
                        "set @correlativo = @correlativo +1 \n"+
                        "SELECT @contador= COUNT(*) \n"+
                        "FROM Hrequec \n"+
                        "WHERE r_codemp = @codigo_empresa \n"+
                        "AND erp_ptovta = @codigo_punto_venta \n"+
                        "AND idmotivo_compra = @idmotivo_compra \n"+
                        "AND r_codigo =CONVERT(VARCHAR(50),@anio+'-'+@ceros+@correlativo) \n"+
                        "end \n"+
                        "select @anio+'-'+@ceros++CONVERT(VARCHAR(50),@correlativo) as correlativo "
                    );
        
                    var recordset_automatico = result_automatico.recordset;
                    numero_correlativo = recordset_automatico[0].correlativo;

                } else {
                    numero_correlativo = req.body.numero_correlativo
                }
                //#endregion
                
                //#region Registro de la cabecera
                const request_cabecera  = new mssql.Request(transaction);
                await request_cabecera
                .input("r_codemp", mssql.VarChar(250), codigo_empresa)
                .input("r_codigo", mssql.VarChar(250), numero_correlativo)
                .input("idmotivo_compra", mssql.VarChar(250), req.body.motivo_documento)
                .input("erp_ptovta", mssql.VarChar(250), codigo_punto_venta)
                .input("r_fecha", mssql.Date, req.body.fecha_doc)
                .input("r_fechalim", mssql.Date, req.body.fecha_limite)
                .input("r_prior", mssql.VarChar(250), req.body.prioridad)
                .input("e_estado", mssql.VarChar(250), req.body.estado)
                .input("r_coment", mssql.VarChar(250), req.body.comentario)
                .input("r_codcosto", mssql.VarChar(250), req.body.centro_costos)
                .input("r_situapro", mssql.VarChar(250), req.body.situacion_apro)
                .input("r_respon", mssql.VarChar(250), '00')
                .input("r_facepta", mssql.Date, req.body.fecha_aceptacion)
                .input("r_obs", mssql.VarChar(250), req.body.observacion)
                .input("r_ot", mssql.VarChar(250), req.body.orden_trabajo)
                .input("erp_codune", mssql.VarChar(250), req.body.unidad_negocio)
                .input("aprobado1", mssql.VarChar(250), req.body.aprobado1)
                .input("usuario_aprobo1", mssql.VarChar(250), req.body.usuario_aprobado1)
                .input("fecha_aprob2", mssql.Date, req.body.fecha_aprobacion2)
                .input("r_obs2", mssql.VarChar(250), req.body.observacion2)
                .input("atencion", mssql.VarChar(250), req.body.atencion)
                .input("porcentaje", mssql.VarChar(250), req.body.porcentaje)
                .input("erp_moneda", mssql.VarChar(250), req.body.moneda)
                .input("ctipo_cambio", mssql.VarChar(250), req.body.tipo_cambio)
                .input("tc", mssql.VarChar(250), req.body.tasa_cambio)
                .input("glosa", mssql.VarChar(250), req.body.glosa)
                .input("erp_codage", mssql.VarChar(250), req.body.codigo_agencia)
                .input("usuario", mssql.VarChar(250), usuario)
                .input("erp_motivo_ref", mssql.VarChar(250),  req.body.tipo_referencia)
                .input("erp_numero_ref", mssql.VarChar(250), req.body.numero_referencia)
                .input("erp_tipo_ref", mssql.VarChar(250),req.body.motivo_referencia)
                .input("Pc_User", mssql.VarChar(250), req.body.Pc_User)
                .input("Pc_Fecha", mssql.VarChar(250), req.body.Pc_Fecha)
                .input("Pc_Ip", mssql.VarChar(250), req.body.Pc_Ip)
                .input("erp_nro_exp", mssql.VarChar(250), req.body.numero_exp)
                .input("erp_nro_exp2", mssql.VarChar(250), req.body.numero_exp_2)
                .input("si_igv", mssql.VarChar(250), req.body.mas_igv)
                .input("erp_Dbasecalc", mssql.VarChar(250), req.body.subtotal_sin_descuentos)
                .input("erp_Dsubtotal", mssql.VarChar(250), req.body.erp_Dsubtotal)
                .input("erp_Ddescuento", mssql.VarChar(250), req.body.erp_Ddescuento)
                .input("erp_Digv", mssql.VarChar(250), req.body.erp_Digv)
                .input("erp_Dimporte", mssql.VarChar(250), req.body.erp_Dimporte)
                .input("descuento", mssql.VarChar(250), '0')
                .input("estado_salida", mssql.VarChar(250), req.body.estado_salida)
                .input("porcentaje_salida", mssql.VarChar(250), req.body.porcentaje_salida)
                .input("responsable", mssql.VarChar(250), req.body.responsable)
                .input("automatico", mssql.VarChar(250), req.body.automatico)
                .input("nro_dias", mssql.Int, req.body.nro_dias)
                .query("INSERT INTO Hrequec \n"+
                "(r_codemp \n"+
                ",r_codigo \n"+
                ",idmotivo_compra \n"+
                ",erp_ptovta \n"+
                ",r_fecha \n"+
                ",r_fechalim \n"+
                ",r_prior \n"+
                ",e_estado \n"+
                ",r_coment \n"+
                ",r_codcosto \n"+
                ",r_situapro \n"+
                ",r_respon \n"+
                ",r_facepta \n"+
                ",r_obs \n"+
                ",r_ot \n"+
                ",erp_codune \n"+
                ",aprobado1 \n"+
                ",usuario_aprobo1 \n"+
                ",fecha_aprob2 \n"+
                ",r_obs2 \n"+
                ",atencion \n"+
                ",porcentaje \n"+
                ",erp_moneda \n"+
                ",ctipo_cambio \n"+
                ",tc \n"+
                ",glosa \n"+
                ",erp_codage \n"+
                ",usuario \n"+
                ",erp_motivo_ref \n"+
                ",erp_numero_ref \n"+
                ",erp_tipo_ref \n"+
                ",Pc_User \n"+
                ",Pc_Fecha \n"+
                ",Pc_Ip \n"+
                ",erp_nro_exp \n"+
                ",erp_nro_exp2 \n"+
                ",si_igv \n"+
                ",erp_Dsubtotal \n"+
                ",erp_Ddescuento \n"+
                ",erp_Digv \n"+
                ",erp_Dimporte \n"+
                ",descuento \n"+
                ",estado_salida \n"+
                ",porcentaje_salida \n"+
                ",erp_Dbasecalc \n"+
                ",automatico \n"+
                ",responsable \n"+
                ",nro_dias) \n"+
                "VALUES \n"+
                "(@r_codemp \n"+
                ",@r_codigo \n"+
                ",@idmotivo_compra \n"+
                ",@erp_ptovta \n"+
                ",@r_fecha \n"+
                ",@r_fechalim \n"+
                ",@r_prior \n"+
                ",@e_estado \n"+
                ",@r_coment \n"+
                ",@r_codcosto \n"+
                ",@r_situapro \n"+
                ",@r_respon \n"+
                ",@r_facepta \n"+
                ",@r_obs \n"+
                ",@r_ot \n"+
                ",@erp_codune \n"+
                ",@aprobado1 \n"+
                ",@usuario_aprobo1 \n"+
                ",@fecha_aprob2 \n"+
                ",@r_obs2 \n"+
                ",@atencion \n"+
                ",@porcentaje \n"+
                ",@erp_moneda \n"+
                ",@ctipo_cambio \n"+
                ",@tc \n"+
                ",@glosa \n"+
                ",@erp_codage \n"+
                ",@usuario \n"+
                ",@erp_motivo_ref \n"+
                ",@erp_numero_ref \n"+
                ",@erp_tipo_ref \n"+
                ",getdate() \n"+
                ",@Pc_Fecha \n"+
                ",@Pc_Ip \n"+
                ",@erp_nro_exp \n"+ 
                ",@erp_nro_exp2 \n"+ 
                ",@si_igv \n"+
                ",@erp_Dsubtotal \n"+
                ",@erp_Ddescuento \n"+
                ",@erp_Digv \n"+
                ",@erp_Dimporte \n"+
                ",@descuento \n"+
                ",@estado_salida \n"+
                ",@porcentaje_salida \n"+
                ",@erp_Dbasecalc \n"+
                ",@automatico \n"+
                ",@responsable \n"+
                ",@nro_dias)")
                //#endregion
                
                //#region Registro del detalle
                for (let i= 0; i< filas_detalle.length; i++){
                    rowid = filas_detalle[i];
                    const request_detalle = new mssql.Request(transaction);
                    await request_detalle
                     .input("rcod_emp", mssql.VarChar(250), codigo_empresa)
                     .input("rcod_req", mssql.VarChar(250), numero_correlativo)
                     .input("idmotivo_compra", mssql.VarChar(250), req.body.motivo_documento) 
                     .input("erp_ptovta", mssql.VarChar(250), codigo_punto_venta)
                     .input("item", mssql.VarChar(250), i+1)
                     .input("r_codart", mssql.VarChar(250), rowid.Codigo)
                     .input("rdesc", mssql.VarChar(250), rowid.Nombre)
                     .input("runidades", mssql.VarChar(250), rowid.Codigo_Unidad)
                     .input("factor", mssql.VarChar(250), rowid.Factor)
                     .input("rcantidad3", mssql.VarChar(250), rowid.Cantidad_Kardex)
                     .input("rcantidad", mssql.VarChar(250), rowid.Cantidad)
                     .input("r_precio", mssql.VarChar(250), rowid.Unit)
                     .input("nigv", mssql.VarChar(250), rowid.Igv_Art)
                     .input("erp_codinterno", mssql.VarChar(250), '')
                     .input("barticulo", mssql.VarChar(250), rowid.Barticulo)
                     .input("codigo_presentacion", mssql.VarChar(250), rowid.Codigo_presentacion)
                     .input("Erp_Cantidad_Presentacion", mssql.VarChar(250), rowid.Cantidad_presentacion)
                     .input("Erp_Nombre_Presentacion", mssql.VarChar(250), rowid.Nombre_presentacion)
                     .input("Erp_Unidad_Presentacion", mssql.VarChar(250), rowid.Unidad_presentacion)
                     .input("Erp_Precio_Presentacion", mssql.VarChar(250), rowid.Precio_presentacion)
                     .input("ccod_cencos", mssql.VarChar(250), req.body.centro_costos)
                     .input("r_ot", mssql.VarChar(250), req.body.orden_trabajo)
                     .input("nbasecalc", mssql.VarChar(250), rowid.Base_Calculada)
                     .input("nbaseimpon", mssql.VarChar(250), rowid.Base_Imponible)
                     .input("nigvcalc", mssql.VarChar(250), rowid.Igv)
                     .input("monto_descuento", mssql.VarChar(250), rowid.Monto_Descuento)
                     .input("nprecio_importe", mssql.VarChar(250), rowid.Importe)
                     .input("erp_codune", mssql.VarChar(250), req.body.unidad_negocio)
                     .input("erp_codage", mssql.VarChar(250), req.body.codigo_agencia)
                     .input("erp_motivo_ref", mssql.VarChar(250), req.body.motivo_referencia)
                     .input("erp_numero_ref", mssql.VarChar(250),  req.body.numero_referencia)
                     .input("erp_item_ref", mssql.VarChar(250), '0')
                     .input("erp_tipo_ref", mssql.VarChar(250), req.body.tipo_referencia)
                     .input("erp_peso", mssql.VarChar(250), rowid.Peso)
                     .input("erp_largo", mssql.VarChar(250), '0.00')
                     .input("erp_ancho", mssql.VarChar(250), '0.00')
                     .input("erp_nro_exp", mssql.VarChar(250), req.body.numero_exp)
                     .query("INSERT INTO Hrequed \n"+
                        "(rcod_emp \n"+
                        " ,rcod_req \n"+
                        " ,idmotivo_compra \n"+
                        " ,erp_ptovta \n"+
                        " ,item \n"+
                        " ,r_codart \n"+
                        " ,rdesc \n"+
                        " ,rcantidad \n"+
                        " ,rcantidad3 \n"+
                        " ,runidades \n"+
                        " ,r_precio \n"+
                        " ,factor \n"+
                        " ,r_ot \n"+
                        " ,barticulo \n"+
                        " ,ccod_cencos \n"+
                        " ,erp_codune \n"+
                        " ,erp_codage \n"+
                        " ,erp_codinterno \n"+
                        " ,erp_motivo_ref \n"+
                        " ,erp_numero_ref \n"+
                        " ,erp_item_ref \n"+
                        " ,erp_tipo_ref \n"+
                        " ,Erp_Cantidad_Presentacion \n"+
                        " ,Erp_Nombre_Presentacion \n"+
                        " ,Erp_Unidad_Presentacion \n"+
                        " ,Erp_Precio_Presentacion \n"+
                        " ,erp_peso \n"+
                        " ,erp_largo \n"+
                        " ,erp_ancho \n"+
                        " ,erp_nro_exp \n"+
                        " ,nigv \n"+
                        " ,monto_descuento \n"+
                        " ,nbaseimpon \n"+
                        " ,nigvcalc \n"+
                        " ,nprecio_importe \n"+
                        " ,codigo_presentacion\n"+
                        " ,nbasecalc) \n"+
                        "VALUES \n"+
                        "(@rcod_emp \n"+
                        " ,@rcod_req\n"+
                        " ,@idmotivo_compra\n"+
                        " ,@erp_ptovta \n"+
                        " ,@item \n"+
                        " ,@r_codart \n"+
                        " ,@rdesc \n"+
                        " ,@rcantidad \n"+
                        " ,@rcantidad3 \n"+
                        " ,@runidades \n"+
                        " ,@r_precio \n"+
                        " ,@factor \n"+
                        " ,@r_ot \n"+
                        " ,@barticulo \n"+
                        " ,@ccod_cencos\n"+ 
                        " ,@erp_codune \n"+
                        " ,@erp_codage \n"+
                        " ,@erp_codinterno \n"+
                        " ,@erp_motivo_ref \n"+
                        " ,@erp_numero_ref \n"+
                        " ,@erp_item_ref \n"+
                        " ,@erp_tipo_ref \n"+
                        " ,@Erp_Cantidad_Presentacion \n"+
                        " ,@Erp_Nombre_Presentacion \n"+
                        " ,@Erp_Unidad_Presentacion \n"+
                        " ,@Erp_Precio_Presentacion \n"+
                        " ,@erp_peso\n"+
                        " ,@erp_largo\n"+
                        " ,@erp_ancho\n"+
                        " ,@erp_nro_exp\n"+
                        " ,@nigv\n"+
                        " ,@monto_descuento\n"+
                        " ,@nbaseimpon\n"+
                        " ,@nigvcalc \n"+
                        " ,@nprecio_importe\n"+
                        " ,@codigo_presentacion \n"+
                        " ,@nbasecalc)")
                };                
                //#endregion

                //#region Registra Comentarios
                if(filas_comentarios.length != 0){
                    for (let i= 0; i< filas_comentarios.length; i++){
                        rowid = filas_comentarios[i];
                        const request_detalle = new mssql.Request(transaction);
                        await request_detalle
                        .input("erp_codempresa", mssql.VarChar(250), codigo_empresa)
                        .input("erp_tip_doc", mssql.VarChar(250), "REQ")
                        .input("erp_modulo", mssql.VarChar(250), "COMPRAS") 
                        .input("erp_tipo_encabezado", mssql.VarChar(250), "SUMMARY")
                        .input("erp_limite_caracter", mssql.VarChar(250), 250)
                        .input("erp_nitem", mssql.VarChar(250), i+1)
                        .input("erp_titulo", mssql.VarChar(250), rowid.Titulo)
                        .input("erp_descripcion", mssql.VarChar(250), rowid.Descripcion)
                        .input("ccod_almacen", mssql.VarChar(250), codigo_punto_venta)
                        .input("motivo", mssql.VarChar(250), req.body.motivo_documento)
                        .input("cnum_serie", mssql.VarChar(250), "")
                        .input("cnum_doc", mssql.VarChar(250), numero_correlativo)
                        .query(
                        " INSERT INTO ERP_ENCABEZADO_FORMATO( \n"+
                        " erp_codempresa, \n"+
                        " erp_tip_doc, \n"+
                        " erp_modulo, \n"+
                        " erp_tipo_encabezado, \n"+
                        " erp_limite_caracter, \n"+
                        " erp_nitem, \n"+
                        " erp_titulo, \n"+
                        " erp_descripcion, \n"+
                        " ccod_almacen, \n"+
                        " motivo, \n"+
                        " cnum_serie, \n"+
                        " cnum_doc  \n"+
                        " )VALUES( \n"+
                        " @erp_codempresa, \n"+
                        " @erp_tip_doc, \n"+
                        " @erp_modulo, \n"+
                        " @erp_tipo_encabezado, \n"+
                        " @erp_limite_caracter, \n"+
                        " @erp_nitem, \n"+
                        " @erp_titulo, \n"+
                        " @erp_descripcion, \n"+
                        " @ccod_almacen, \n"+
                        " @motivo, \n"+
                        " @cnum_serie, \n"+
                        " @cnum_doc) \n")
                    };      
                }
                //#endregion

                //#region Actualización del correlativo automatico
                if(req.body.automatico=="A"){
                    serie_motivo = numero_correlativo.substr(-20,4)
                    numero_motivo = numero_correlativo.substr(-4)
        
                    const request_correlativo = new mssql.Request(transaction);
                    await request_correlativo
                    .input("erp_codemp", mssql.VarChar(250), codigo_empresa)
                    .input("erp_codmot", mssql.VarChar(250), req.body.motivo_documento)
                    .input("erp_sermot", mssql.VarChar(250), serie_motivo)
                    .input("erp_nummot", mssql.VarChar(250), parseInt(numero_motivo))
                    .query("update Erp_motivos_tramite_detalle SET erp_nummot = @erp_nummot WHERE erp_codemp = @erp_codemp and erp_codmot = @erp_codmot and erp_sermot = @erp_sermot ")
                }                
                //#endregion

                transaction.commit(tErr => {if(tErr) {console.log(tErr)}})
                res.send({estado: true, codigo: numero_correlativo, mensaje: ""});
            }catch(err){
                transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
                console.log(err.message);
                res.send({estado: false, codigo: "Err", mensaje: err.message});
            }
        });
    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
});

router.post('/modificar', async(req, res) =>{
    try {

        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.user.codigo_punto_venta;
        const usuario = req.user.codigo_usuario;

        var filas_detalle = JSON.parse(req.body.filas_detalle)
        var filas_comentarios = JSON.parse(req.body.filas_comentarios)

        const pool = await poolPromise;
        const transaction = await new mssql.Transaction(pool);
        await transaction.begin(async err => {
            try{
                //#region Modificar la cabecera
                const request_cabecera  = new mssql.Request(transaction);
                const result_cabecera = await request_cabecera 
                .input("r_codemp", mssql.VarChar(250), codigo_empresa)
                .input("r_codigo", mssql.VarChar(250), req.body.numero_correlativo)
                .input("idmotivo_compra", mssql.VarChar(250), req.body.motivo_documento)
                .input("erp_ptovta", mssql.VarChar(250), codigo_punto_venta)
                .input("r_fecha", mssql.Date, req.body.fecha_doc)
                .input("r_fechalim", mssql.Date, req.body.fecha_limite)
                .input("r_prior", mssql.VarChar(250), req.body.prioridad)
                .input("e_estado", mssql.VarChar(250), req.body.estado)
                .input("r_coment", mssql.VarChar(250), req.body.comentario)
                .input("r_codcosto", mssql.VarChar(250), req.body.centro_costos)
                .input("r_situapro", mssql.VarChar(250), req.body.situacion_apro)
                .input("r_respon", mssql.VarChar(250), '00')
                .input("r_facepta", mssql.Date, req.body.fecha_aceptacion)
                .input("r_obs", mssql.VarChar(250), req.body.observacion)
                .input("r_ot", mssql.VarChar(250), req.body.orden_trabajo)
                .input("erp_codune", mssql.VarChar(250), req.body.unidad_negocio)
                .input("aprobado1", mssql.VarChar(250), req.body.aprobado1)
                .input("usuario_aprobo1", mssql.VarChar(250), req.body.usuario_aprobado1)
                .input("fecha_aprob2", mssql.Date, req.body.fecha_aprobacion2)
                .input("r_obs2", mssql.VarChar(250), req.body.observacion2)
                .input("atencion", mssql.VarChar(250), req.body.atencion)
                .input("porcentaje", mssql.VarChar(250), req.body.porcentaje)
                .input("erp_moneda", mssql.VarChar(250), req.body.moneda)
                .input("ctipo_cambio", mssql.VarChar(250), req.body.tipo_cambio)
                .input("tc", mssql.VarChar(250), req.body.tasa_cambio)
                .input("glosa", mssql.VarChar(250), req.body.glosa)
                .input("erp_codage", mssql.VarChar(250), req.body.codigo_agencia)
                .input("usuario", mssql.VarChar(250), usuario)
                .input("erp_motivo_ref", mssql.VarChar(250),  req.body.tipo_referencia)
                .input("erp_numero_ref", mssql.VarChar(250), req.body.numero_referencia)
                .input("erp_tipo_ref", mssql.VarChar(250),req.body.motivo_referencia)
                .input("Pc_User", mssql.VarChar(250), req.body.Pc_User)
                .input("Pc_Fecha", mssql.VarChar(250), req.body.Pc_Fecha)
                .input("Pc_Ip", mssql.VarChar(250), req.body.Pc_Ip)
                .input("erp_nro_exp", mssql.VarChar(250), req.body.numero_exp)
                .input("erp_nro_exp2", mssql.VarChar(250), req.body.numero_exp_2)
                .input("si_igv", mssql.VarChar(250), req.body.mas_igv)
                .input("erp_Dsubtotal", mssql.VarChar(250), req.body.erp_Dsubtotal)
                .input("erp_Ddescuento", mssql.VarChar(250), req.body.erp_Ddescuento)
                .input("erp_Digv", mssql.VarChar(250), req.body.erp_Digv)
                .input("erp_Dimporte", mssql.VarChar(250), req.body.erp_Dimporte)
                .input("descuento", mssql.VarChar(250), '0')
                .input("estado_salida", mssql.VarChar(250), req.body.estado_salida)
                .input("porcentaje_salida", mssql.VarChar(250), req.body.porcentaje_salida)
                .input("erp_Dbasecalc", mssql.VarChar(250), req.body.subtotal_sin_descuentos)
                .input("responsable", mssql.VarChar(250), req.body.responsable)
                .input("automatico", mssql.VarChar(250), req.body.automatico)
                .query("UPDATE  Hrequec  SET\n"+
                "r_codemp 	= @r_codemp \n"+
                ",r_codigo 	= @r_codigo \n"+
                ",idmotivo_compra 	= @idmotivo_compra \n"+
                ",erp_ptovta 	= @erp_ptovta \n"+
                ",r_fecha 	= @r_fecha \n"+
                ",r_fechalim 	= @r_fechalim \n"+
                ",r_prior 	= @r_prior \n"+
                ",e_estado 	= @e_estado \n"+
                ",r_coment 	= @r_coment \n"+
                ",r_codcosto 	= @r_codcosto \n"+
                ",r_situapro 	= @r_situapro \n"+
                ",r_respon 	= @r_respon \n"+
                ",r_facepta 	= @r_facepta \n"+
                ",r_obs 	= @r_obs \n"+
                ",r_ot 	= @r_ot \n"+
                ",erp_codune 	= @erp_codune \n"+
                ",aprobado1 	= @aprobado1 \n"+
                ",usuario_aprobo1 	= @usuario_aprobo1 \n"+
                ",fecha_aprob2 	= @fecha_aprob2 \n"+
                ",r_obs2 	= @r_obs2 \n"+
                ",atencion 	= @atencion \n"+
                ",porcentaje 	= @porcentaje \n"+
                ",erp_moneda 	= @erp_moneda \n"+
                ",ctipo_cambio 	= @ctipo_cambio \n"+
                ",tc 	= @tc \n"+
                ",glosa 	= @glosa \n"+
                ",erp_codage 	= @erp_codage \n"+
                ",usuario 	= @usuario \n"+
                ",erp_motivo_ref 	= @erp_motivo_ref \n"+
                ",erp_numero_ref 	= @erp_numero_ref \n"+
                ",erp_tipo_ref 	= @erp_tipo_ref \n"+
                ",Pc_User 	= @Pc_User \n"+
                ",Pc_Fecha 	= getdate() \n"+
                ",Pc_Ip 	= @Pc_Ip \n"+
                ",erp_nro_exp 	= @erp_nro_exp \n"+
                ",erp_nro_exp2 	= @erp_nro_exp2 \n"+
                ",si_igv 	= @si_igv \n"+
                ",erp_Dsubtotal 	= @erp_Dsubtotal \n"+
                ",erp_Ddescuento 	= @erp_Ddescuento \n"+
                ",erp_Digv 	= @erp_Digv \n"+
                ",erp_Dimporte 	= @erp_Dimporte \n"+
                ",descuento 	= @descuento \n"+
                ",estado_salida 	= @estado_salida \n"+
                ",porcentaje_salida 	= @porcentaje_salida \n"+
                ",erp_Dbasecalc	= @erp_Dbasecalc \n"+
                ",automatico = @automatico \n"+
                ",responsable = @responsable \n"+
                "WHERE r_codemp = @r_codemp and erp_ptovta =@erp_ptovta and idmotivo_compra = @idmotivo_compra and r_codigo = @r_codigo")
                //#endregion

                if(result_cabecera.rowsAffected>0){
                    //#region Borrar detalle
                    const request_detalle_borrar  = new mssql.Request(transaction);
                    await request_detalle_borrar
                    .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                    .input("rcod_req", mssql.VarChar(250), req.body.numero_correlativo)
                    .input("idmotivo_compra", mssql.VarChar(250), req.body.motivo_documento) 
                    .input("punto_venta", mssql.VarChar(250), codigo_punto_venta)
                    .query("DELETE FROM Hrequed WHERE rcod_emp = @ccod_empresa and erp_ptovta =@punto_venta and idmotivo_compra = @idmotivo_compra and rcod_req = @rcod_req")
                    //#endregion
                    //#region Grabar detalle   

                    for (let i= 0; i< filas_detalle.length; i++){
                        rowid = filas_detalle[i];
                        const request_detalle_registrar  = new mssql.Request(transaction);
                        await request_detalle_registrar
                         .input("rcod_emp", mssql.VarChar(250), codigo_empresa)
                         .input("rcod_req", mssql.VarChar(250), req.body.numero_correlativo)
                         .input("idmotivo_compra", mssql.VarChar(250), req.body.motivo_documento) 
                         .input("erp_ptovta", mssql.VarChar(250), codigo_punto_venta)
                         .input("item", mssql.VarChar(250), i+1)
                         .input("r_codart", mssql.VarChar(250), rowid.Codigo)
                         .input("rdesc", mssql.VarChar(250), rowid.Nombre)
                         .input("runidades", mssql.VarChar(250), rowid.Codigo_Unidad)
                         .input("factor", mssql.VarChar(250), rowid.Factor)
                         .input("rcantidad3", mssql.VarChar(250), rowid.Cantidad_Kardex)
                         .input("rcantidad", mssql.VarChar(250), rowid.Cantidad)
                         .input("r_precio", mssql.VarChar(250), rowid.Unit)
                         .input("nigv", mssql.VarChar(250), rowid.Igv_Art)
                         .input("erp_codinterno", mssql.VarChar(250), '')
                         .input("barticulo", mssql.VarChar(250), rowid.Barticulo)
                         .input("codigo_presentacion", mssql.VarChar(250), rowid.Codigo_presentacion)
                         .input("Erp_Cantidad_Presentacion", mssql.VarChar(250), rowid.Cantidad_presentacion)
                         .input("Erp_Nombre_Presentacion", mssql.VarChar(250), rowid.Nombre_presentacion)
                         .input("Erp_Unidad_Presentacion", mssql.VarChar(250), rowid.Unidad_presentacion)
                         .input("Erp_Precio_Presentacion", mssql.VarChar(250), rowid.Precio_presentacion)
                         .input("ccod_cencos", mssql.VarChar(250), req.body.centro_costos)
                         .input("r_ot", mssql.VarChar(250), req.body.orden_trabajo)
                         .input("nbasecalc", mssql.VarChar(250), rowid.Base_Calculada)
                         .input("nbaseimpon", mssql.VarChar(250), rowid.Base_Imponible)
                         .input("nigvcalc", mssql.VarChar(250), rowid.Igv)
                         .input("monto_descuento", mssql.VarChar(250), rowid.Monto_Descuento)
                         .input("nprecio_importe", mssql.VarChar(250), rowid.Importe)
                         .input("erp_codune", mssql.VarChar(250), req.body.unidad_negocio)
                         .input("erp_codage", mssql.VarChar(250), req.body.codigo_agencia)
                         .input("erp_motivo_ref", mssql.VarChar(250), req.body.motivo_referencia)
                         .input("erp_numero_ref", mssql.VarChar(250),  req.body.numero_referencia)
                         .input("erp_item_ref", mssql.VarChar(250), '0')
                         .input("erp_tipo_ref", mssql.VarChar(250), req.body.tipo_referencia)
                         .input("erp_peso", mssql.VarChar(250), rowid.Peso)
                         .input("erp_largo", mssql.VarChar(250), '0.00')
                         .input("erp_ancho", mssql.VarChar(250), '0.00')
                         .input("erp_nro_exp", mssql.VarChar(250), req.body.numero_exp)
                         .query("INSERT INTO Hrequed \n"+
                         "(rcod_emp \n"+
                         " ,rcod_req \n"+
                         " ,idmotivo_compra \n"+
                         " ,erp_ptovta \n"+
                         " ,item \n"+
                         " ,r_codart \n"+
                         " ,rdesc \n"+
                         " ,rcantidad \n"+
                         " ,rcantidad3 \n"+
                         " ,runidades \n"+
                         " ,r_precio \n"+
                         " ,factor \n"+
                         " ,r_ot \n"+
                         " ,barticulo \n"+
                         " ,ccod_cencos \n"+
                         " ,erp_codune \n"+
                         " ,erp_codage \n"+
                         " ,erp_codinterno \n"+
                         " ,erp_motivo_ref \n"+
                         " ,erp_numero_ref \n"+
                         " ,erp_item_ref \n"+
                         " ,erp_tipo_ref \n"+
                         " ,Erp_Cantidad_Presentacion \n"+
                         " ,Erp_Nombre_Presentacion \n"+
                         " ,Erp_Unidad_Presentacion \n"+
                         " ,Erp_Precio_Presentacion \n"+
                         " ,erp_peso \n"+
                         " ,erp_largo \n"+
                         " ,erp_ancho \n"+
                         " ,erp_nro_exp \n"+
                         " ,nigv \n"+
                         " ,monto_descuento \n"+
                         " ,nbaseimpon \n"+
                         " ,nigvcalc \n"+
                         " ,nprecio_importe \n"+
                         " ,codigo_presentacion\n"+
                         " ,nbasecalc) \n"+
                         "VALUES \n"+
                         "(@rcod_emp \n"+
                         " ,@rcod_req\n"+
                         " ,@idmotivo_compra\n"+
                         " ,@erp_ptovta \n"+
                         " ,@item \n"+
                         " ,@r_codart \n"+
                         " ,@rdesc \n"+
                         " ,@rcantidad \n"+
                         " ,@rcantidad3 \n"+
                         " ,@runidades \n"+
                         " ,@r_precio \n"+
                         " ,@factor \n"+
                         " ,@r_ot \n"+
                         " ,@barticulo \n"+
                         " ,@ccod_cencos\n"+ 
                         " ,@erp_codune \n"+
                         " ,@erp_codage \n"+
                         " ,@erp_codinterno \n"+
                         " ,@erp_motivo_ref \n"+
                         " ,@erp_numero_ref \n"+
                         " ,@erp_item_ref \n"+
                         " ,@erp_tipo_ref \n"+
                         " ,@Erp_Cantidad_Presentacion \n"+
                         " ,@Erp_Nombre_Presentacion \n"+
                         " ,@Erp_Unidad_Presentacion \n"+
                         " ,@Erp_Precio_Presentacion \n"+
                         " ,@erp_peso\n"+
                         " ,@erp_largo\n"+
                         " ,@erp_ancho\n"+
                         " ,@erp_nro_exp\n"+
                         " ,@nigv\n"+
                         " ,@monto_descuento\n"+
                         " ,@nbaseimpon\n"+
                         " ,@nigvcalc \n"+
                         " ,@nprecio_importe\n"+
                         " ,@codigo_presentacion \n"+
                         " ,@nbasecalc)")
                    };                          
                    //#endregion

                    //#region Borrar Comentarios
                    if(filas_comentarios.length != 0){
                        for (let i= 0; i< filas_comentarios.length; i++){
                            rowid = filas_comentarios[i];
                            const request_eliminar_comentarios = new mssql.Request(transaction);
                            await request_eliminar_comentarios
                            .input("erp_codempresa", mssql.VarChar(250), codigo_empresa)
                            .input("erp_tip_doc", mssql.VarChar(250), "REQ")
                            .input("ccod_almacen", mssql.VarChar(250), codigo_punto_venta)
                            .input("motivo", mssql.VarChar(250), req.body.motivo_documento)
                            .input("cnum_doc", mssql.VarChar(250), req.body.numero_correlativo)
                            .query(
                            " DELETE FROM ERP_ENCABEZADO_FORMATO WHERE\n"+
                            " erp_codempresa = @erp_codempresa AND \n"+
                            " ccod_almacen = @ccod_almacen AND \n"+
                            " motivo = @motivo AND \n"+
                            " erp_tip_doc = @erp_tip_doc AND \n"+
                            " cnum_doc = @cnum_doc  \n")
                        };      
                    }
                    //#endregion

                    //#region Registra Comentarios
                    if(filas_comentarios.length != 0){
                        for (let i= 0; i< filas_comentarios.length; i++){
                            rowid = filas_comentarios[i];
                            const request_comentarios = new mssql.Request(transaction);
                            await request_comentarios
                            .input("erp_codempresa", mssql.VarChar(250), codigo_empresa)
                            .input("erp_tip_doc", mssql.VarChar(250), "REQ")
                            .input("erp_modulo", mssql.VarChar(250), "COMPRAS") 
                            .input("erp_tipo_encabezado", mssql.VarChar(250), "SUMMARY")
                            .input("erp_limite_caracter", mssql.VarChar(250), 250)
                            .input("erp_nitem", mssql.VarChar(250), i+1)
                            .input("erp_titulo", mssql.VarChar(250), rowid.Titulo)
                            .input("erp_descripcion", mssql.VarChar(250), rowid.Descripcion)
                            .input("ccod_almacen", mssql.VarChar(250), codigo_punto_venta)
                            .input("motivo", mssql.VarChar(250), req.body.motivo_documento)
                            .input("cnum_serie", mssql.VarChar(250), "")
                            .input("cnum_doc", mssql.VarChar(250), req.body.numero_correlativo)
                            .query(
                            " INSERT INTO ERP_ENCABEZADO_FORMATO( \n"+
                            " erp_codempresa, \n"+
                            " erp_tip_doc, \n"+
                            " erp_modulo, \n"+
                            " erp_tipo_encabezado, \n"+
                            " erp_limite_caracter, \n"+
                            " erp_nitem, \n"+
                            " erp_titulo, \n"+
                            " erp_descripcion, \n"+
                            " ccod_almacen, \n"+
                            " motivo, \n"+
                            " cnum_serie, \n"+
                            " cnum_doc  \n"+
                            " )VALUES( \n"+
                            " @erp_codempresa, \n"+
                            " @erp_tip_doc, \n"+
                            " @erp_modulo, \n"+
                            " @erp_tipo_encabezado, \n"+
                            " @erp_limite_caracter, \n"+
                            " @erp_nitem, \n"+
                            " @erp_titulo, \n"+
                            " @erp_descripcion, \n"+
                            " @ccod_almacen, \n"+
                            " @motivo, \n"+
                            " @cnum_serie, \n"+
                            " @cnum_doc) \n")
                        };      
                    }
                    //#endregion
                    
                    transaction.commit(tErr => {if(tErr) {console.log(tErr)}})
                    res.send({estado: true, codigo: 0, mensaje: ""});
                }else{
                    transaction.commit(tErr => {if(tErr) {console.log(tErr)}})
                    res.send({estado: false, codigo: 0, mensaje: "No se encuentra el documento para borrar"});
                }

            }catch(err){
                transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
                console.log(err.message);
                res.send({estado: false, codigo: "Err", mensaje: err.message});
            }
        });
    
    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
});

router.post('/eliminar', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.user.codigo_punto_venta;
        
        const pool = await poolPromise;
        const transaction = await new mssql.Transaction(pool);
        
        await transaction.begin(async err => {
            try{
                const request_detalle  = new mssql.Request(transaction);
                await request_detalle
                .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                .input("rcod_req", mssql.VarChar(250), req.body.numero_correlativo)
                .input("idmotivo_compra", mssql.VarChar(250), req.body.motivo_documento) 
                .input("punto_venta", mssql.VarChar(250), codigo_punto_venta)
                .query("DELETE FROM Hrequed WHERE rcod_emp = @ccod_empresa and erp_ptovta =@punto_venta and idmotivo_compra = @idmotivo_compra and rcod_req = @rcod_req")
                
                const request_cabecera = new mssql.Request(transaction);
                await request_cabecera 
                .input("ccod_empresa", mssql.VarChar(250), codigo_empresa)
                .input("r_codigo", mssql.VarChar(250), req.body.numero_correlativo)
                .input("idmotivo_compra", mssql.VarChar(250), req.body.motivo_documento) 
                .input("punto_venta", mssql.VarChar(250), codigo_punto_venta)
                .query("Delete Hrequec where r_codemp = @ccod_empresa and erp_ptovta =@punto_venta and idmotivo_compra = @idmotivo_compra and r_codigo = @r_codigo")
                
                if( req.body.automatico == "A") {
                    serie_motivo = req.body.numero_correlativo.substr(-20,4)
                    numero_motivo = req.body.numero_correlativo.substr(-4) - 1

                    const request_automatico = new mssql.Request(transaction);
                    await request_automatico 
                    .input("erp_codemp", mssql.VarChar(250), codigo_empresa)
                    .input("erp_codmot", mssql.VarChar(250), req.body.motivo_documento)
                    .input("erp_sermot", mssql.VarChar(250), serie_motivo)
                    .input("erp_nummot", mssql.VarChar(250), parseInt(numero_motivo))
                    .query("update Erp_motivos_tramite_detalle SET erp_nummot = @erp_nummot WHERE erp_codemp = @erp_codemp and erp_codmot = @erp_codmot and erp_sermot = @erp_sermot ")
                }
                transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
                res.send({estado: true, codigo: 0, mensaje: ""});   
            }catch(err){
                transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
                console.log(err.message);
                res.send({estado: false, codigo: "Err", mensaje: err.message});
            }
        });
    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
})

router.post('/lista', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa
        const codigo_punto_venta = req.user.codigo_punto_venta;

        switch (req.body.busqueda) {
            case "año_mes":
                var opcion = "and MONTH(Hrequec.r_fecha) = @mes AND YEAR(Hrequec.r_fecha) = @anio \n"
                break;
            case "rango_fechas":
                var opcion = "and Hrequec.r_fecha between @fecha_inicio and @fecha_final \n"
                break;
            case "todos":
                var opcion = " \n"
                break;
        }

        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
        .input('anio', mssql.VarChar(250), req.body.anio)
        .input('mes', mssql.VarChar(250), req.body.meses)
        .input('fecha_inicio', mssql.VarChar(250), req.body.fecha_inicio)
        .input('fecha_final', mssql.VarChar(250), req.body.fecha_final)
        .query(
            "select \n"+
            "Halmacen.cnom_almacen as Punto_Venta, \n"+
            "'REQ' as Tipo_Compra, \n"+
            "'Requerimiento' as Tipo_Documento, \n"+
            "Erp_motivos_tramite.erp_nommot as Motivo_Serie, \n"+
            "Hrequec.r_codigo as Numero, \n"+
            "CONVERT(VARCHAR(50),Hrequec.r_fecha,103) as Fecha, \n"+
            "'' as Codigo_Proveedor, \n"+
            "'' as Nombre_Proveedor, \n"+
            "'' as Fecha_Entrega, \n"+
            "CONVERT(VARCHAR(50),Hrequec.r_fechalim,103) as Fecha_Limite, \n"+
            "'' as Forma_Pago, \n"+
            "Hrequec.r_prior as Prioridad, \n"+
            "Hrequec.erp_moneda as Moneda, \n"+
            "Hrequec.tc as Tc, \n"+
            "Hrequec.responsable as Codigo_Responsable, \n"+
            "Responsable.ape_pat +' '+ Responsable.ape_mat + ' '+ Responsable.nombres as Responsable, \n"+
            "Hrequec.r_situapro as Aprobacion_1, \n"+
            "case when Hrequec.r_situapro in ('Sin Aprobacion','Desaprobado') then '' else Aprobacion1.ape_pat +' '+ Aprobacion1.ape_mat + ' '+ Aprobacion1.nombres end as Usuario_Aprobacion_1, \n"+
            "REPLACE(Hrequec.r_obs,'<br>',' ') as Observacion_Aprobacion_1, \n"+
            "Hrequec.aprobado1 as Aprobacion_2, \n"+
            "case when Hrequec.aprobado1 in ('Sin Aprobacion','Desaprobado') then '' else Aprobacion2.ape_pat +' '+ Aprobacion2.ape_mat + ' '+ Aprobacion2.nombres end as Usuario_Aprobacion_2, \n"+
            "REPLACE(Hrequec.r_obs2,'<br>',' ') as Observacion_Aprobacion_2, \n"+
            "Hrequec.e_estado as Estado, \n"+
            "Hrequec.atencion as Atencion, \n"+
            "Hrequec.porcentaje as Porcentaje, \n"+
            "'' as Documento_Referencia, \n"+
            "'' as Serie_Notivo_Referencia, \n"+
            "'' as Numero_Referencia, \n"+
            "Hrequec.glosa as glosa, \n"+
            "Hrequec.si_igv as si_igv, \n"+
            "Hrequec.erp_codune as Codigo_Unidad_Negocio, \n"+
            "Hrequec.erp_codune as Unidad_Negocio, \n"+
            "Hrequec.r_codcosto as Cencos, \n"+
            "Hrequec.r_ot as Ot, \n"+
            "'' as Codigo_Agencia, \n"+
            "Hrequec.r_codcosto as Nombre_Cencos, \n"+
            "'' as Nombre_Motivo, \n"+
            "'' as Porc_Descuento, \n"+
            "'' as Telefono_Proveedor, \n"+
            "'' as Codigo_Contacto, \n"+
            "'' as Nombre_Contacto, \n"+
            "'' as Correo_Proveedor, \n"+
            "'' as Dias_Forma_Pago, \n"+
            "Hrequec.erp_Dbasecalc as Sub_Total_Sin_Descuentos, \n"+
            "Hrequec.erp_Ddescuento as Monto_Descuento, \n"+
            "Hrequec.erp_Dsubtotal as Sub_Total, \n"+
            "Hrequec.erp_Digv as Igv, \n"+
            "Hrequec.erp_Dimporte as Total, \n"+
            "'' as Codigo_Cliente, \n"+
            "'' as Nombre_Cliente, \n"+
            "'' as Punto_Llegada, \n"+
            "'' as Proveedor_Direccion, \n"+
            "Hrequec.usuario as Usuario, \n"+
            "Hrequec.Pc_User as Nombre_Pc, \n"+
            "Hrequec.Pc_Fecha as Pc_Fecha, \n"+
            "Hrequec.Pc_Ip as Pc_Ip, \n"+
            "'' as Numero_Expediente, \n"+
            "'' as Comentario, \n"+
            "Hrequec.erp_ptovta as Codigo_Punto_Venta, \n"+
            "Hrequec.idmotivo_compra as Codigo_Motivo_Serie, \n"+
            "'REQ' as Codigo_Tipo_Documento \n"+
            "FROM Hrequec Inner Join erp_motivos_tramite \n"+
            "On Hrequec.r_codemp     = erp_motivos_tramite.erp_codemp and \n"+
            "Hrequec.idmotivo_compra = erp_motivos_tramite.erp_codmot and \n"+
            "erp_motivos_tramite.erp_codtid= 'REQ' \n"+
            "left Join Hperson as Aprobacion1 \n"+
            "On Hrequec.r_codemp = Aprobacion1.ccod_empresa and \n"+
            "hrequec.r_respon = Aprobacion1.ccod_person \n"+
            "left Join Hperson as Aprobacion2 \n"+
            "On Hrequec.r_codemp = Aprobacion2.ccod_empresa and \n"+
            "Hrequec.usuario_aprobo1 = Aprobacion2.ccod_person \n"+
            "left Join Hperson as Responsable \n"+
            "On Hrequec.r_codemp = Responsable.ccod_empresa and \n"+
            "Hrequec.responsable = Responsable.ccod_person \n"+
            "Inner Join Erp_Unidad_Negocio \n"+
            "On Hrequec.r_codemp = Erp_Unidad_Negocio.erp_codemp and \n"+
            "Hrequec.erp_codune = Erp_Unidad_Negocio.erp_codune \n"+
            "Inner Join Hcencos \n"+
            "On Hrequec.r_codemp   = Hcencos.ccod_empresa and \n"+
            "Hrequec.r_codcosto = Hcencos.ccod_cencos \n"+
            "Inner Join Horden_Trabajo \n"+
            "On Hrequec.r_codemp   = Horden_trabajo.ccod_empresa and \n"+
            "Hrequec.r_ot    = Horden_Trabajo.ccod_ot \n"+
            "Inner Join Halmacen \n"+
            "On Hrequec.r_codemp = Halmacen.ccod_empresa and \n"+
            "Hrequec.erp_ptovta = Halmacen.ccod_almacen \n"+
            "Where Hrequec.r_codemp = @codigo_empresa \n"+opcion +
            "Order by Hrequec.r_fecha desc, Erp_motivos_tramite.erp_nommot desc , hrequec.r_codigo desc  \n"
        );
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        if(req.user==null){
          res.send("El usuario ha sido expulsado");
        }else{
          res.send(err.message)
        }
    }
});

router.post('/anular', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.user.codigo_punto_venta;
        
        const pool = await poolPromise
        const Detalle = await pool
        .request()
        .input("codigo_empresa", mssql.VarChar(250), codigo_empresa)
        .input("punto_venta", mssql.VarChar(250), codigo_punto_venta)
        .input("motivo_serie", mssql.VarChar(250), req.body.motivo_documento)
        .input("numero_correlativo", mssql.VarChar(250), req.body.numero_correlativo)
        .query("Update Hrequec set e_estado = 'Anulado' where  r_codemp = @codigo_empresa and erp_ptovta =@punto_venta and idmotivo_compra = @motivo_serie and r_codigo = @numero_correlativo")

        res.send({estado: true, codigo: 0, mensaje: ""});
    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
})

router.post('/consultar', async (req, res) => {
    try {

        const codigo_empresa = req.user.codigo_empresa
        const motivo_documento = req.body.motivo_documento;
        const numero_documento = req.body.numero_documento;
        var codigo_punto_venta = req.body.codigo_punto_venta;

        if(codigo_punto_venta==""){
            codigo_punto_venta = req.user.codigo_punto_venta;
        }
        const pool = await poolPromise
        var lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(5), codigo_punto_venta)
        .input('motivo_documento', mssql.VarChar(250), motivo_documento)
        .input('numero_documento', mssql.VarChar(250), numero_documento)
        .query("select \n"+
        "'REQUERIMIENTO' as documento_nombre, \n"+
        "Hrequec.idmotivo_compra as documento_motivo_compra_codigo,\n"+
        "Hrequec.r_codigo as documento_numero,\n"+
        "CONVERT(VARCHAR(50),Hrequec.r_fecha,103) as documento_fecha,\n"+
        "CONVERT(VARCHAR(50),Hrequec.r_fechalim,103) as documento_fecha_limite,\n"+
        "CONVERT(VARCHAR(50),Hrequec.r_fecha,23) as documento_fecha_format23,\n"+
        "CONVERT(VARCHAR(50),Hrequec.r_fechalim,23) as documento_fecha_limite_format23,\n"+
        "Hrequec.r_prior as documento_prioridad,\n"+
        "(case Hrequec.r_prior when 'A' then 'Alta' else \n"+
        "(case Hrequec.r_prior when 'M' then 'Media' else 'Baja' end) end) as documento_nombre_prioridad,\n"+
        "Hrequec.erp_moneda as documento_moneda,\n"+
        "Hrequec.erp_Dimporte as documento_nimporte,\n"+
        "Hrequec.e_estado as documento_estado,\n"+
        "Hrequec.si_igv as documento_mas_igv,\n"+
        "Hrequec.ctipo_cambio as nombre_tipo_cambio,\n"+
        "Hrequec.tc as tipo_cambio,\n"+
        "Hrequec.r_situapro as documento_aprobacion_estado,\n"+
        "CONVERT(VARCHAR(50),Hrequec.r_facepta,103) as documento_aprobacion_fecha,\n"+
        "Hrequec.r_respon as documento_aprobacion_codigo_responsable,\n"+
        "(Aprobacion1.ape_pat+' '+Aprobacion1.ape_mat+' '+Aprobacion1.nombres) as documento_aprobacion1,\n"+
        "(Aprobacion1.imagen_firma) as documento_firma_Aprobacion1,\n"+
        "REPLACE(Hrequec.r_obs,'<br>',' ') as documento_aprobacion_comentario,\n"+
        "Hrequec.aprobado1 as documento_aprobacion2_estado,\n"+
        "CONVERT(VARCHAR(50),Hrequec.fecha_aprob2,103) as documento_aprobacion2_fecha,\n"+
        "Hrequec.usuario_aprobo1 as documento_aprobacion2_codigo_responsable,\n"+
        "(Aprobacion2.ape_pat+' '+Aprobacion2.ape_mat+' '+Aprobacion2.nombres) as documento_aprobacion2,\n"+
        "(Aprobacion2.imagen_firma) as documento_firma_Aprobacion2,\n"+
        "REPLACE(Hrequec.r_obs2,'<br>',' ') as documento_aprobacion2_comentario,\n"+
        "Hrequec.r_codcosto as documento_cencos_codigo,\n"+
        "Hcencos.cnom_cencos as documento_cencos_nombre,\n"+
        "Hrequec.descuento as documento_descuento_porc,\n"+
        "Hrequec.r_ot as documento_ot_codigo,\n"+
        "Horden_trabajo.cnom_ot as documento_ot_nombre,\n"+
        "Hrequec.atencion as documento_atencion_estado,\n"+
        "Hrequec.porcentaje as documento_atencion_porcentaje,\n"+
        "Hrequec.Glosa as documento_glosa,\n"+
        "Hrequec.erp_codage as proveedor_agencia,\n"+
        "Hrequec.usuario as usuario_codigo,\n"+
        "Hrequec.Pc_User as pc_user,\n"+
        "Hrequec.Pc_Fecha as pc_fecha,\n"+
        "Hrequec.Pc_Ip as pc_ip,\n"+
        "Hrequec.erp_nro_exp as documento_numero_expediente,\n"+
        "Hrequec.erp_nro_exp2 as documento_numero_expediente_2,\n"+
        "Hrequec.erp_Dbasecalc as documento_subtotal_sin_descuentos,\n"+
        "Hrequec.erp_Ddescuento as documento_descuento,\n"+
        "Hrequec.erp_Dsubtotal as documento_subtotal,\n"+
        "Hrequec.erp_Digv as documento_igv,\n"+
        "Hrequec.erp_Dimporte as documento_total,\n"+
        "Hrequec.erp_Dimporte as documento_importe,\n"+
        "Hrequec.erp_codune as documento_unidad_negocio_codigo,\n"+
        "erp_unidad_negocio.erp_nomune as documento_nombre_unidad_negocio,\n"+
        "Hrequec.erp_tipo_ref as documento_referencia_tipo,\n"+
        "Hrequec.erp_motivo_ref as documento_referencia_serie,\n"+
        "Hrequec.erp_numero_ref as documento_referencia_numero,\n"+
        "Hrequec.estado_salida as documento_estado_salida,\n"+
        "Hrequec.porcentaje_salida as documento_porcentaje_salida,\n"+
        "Hrequec.responsable as documento_responsable,\n"+
        "(Responsable.ape_pat+' '+Responsable.ape_mat+' '+Responsable.nombres) as documento_nombre_responsable,\n"+
        "(Responsable.imagen_firma) as documento_firma_responsable,\n"+
        "Hrequec.automatico as documento_automatico,\n"+
        "--Detalle\n"+
        "Hrequed.item as detalle_orden,\n"+
        "Hrequed.r_codart as articulo_codigo,\n"+
        "Hrequed.rdesc as articulo_nombre,\n"+
        "Hrequed.runidades as articulo_unidad,\n"+
        "Hrequed.nigv as articulo_igv_porcentaje,\n"+
        "Hrequed.factor as articulo_factor,\n"+
        "Hrequed.rcantidad3 as articulo_cantidad,\n"+
        "Hrequed.rcantidad as articulo_kardex,\n"+
        "Hrequed.r_precio as articulo_precio,\n"+
        "Hrequed.nigv as articulo_igv,\n"+
        "Hrequed.barticulo as articulo_barticulo,\n"+
        "Hrequed.Erp_Cantidad_Presentacion as articulo_presentacion_cantidad,\n"+
        "Hrequed.Erp_Nombre_Presentacion as articulo_presentacion_nombre,\n"+
        "Hrequed.Erp_Unidad_Presentacion as articulo_presentacion_unidad,\n"+
        "Hrequed.Erp_Precio_Presentacion as articulo_presentacion_precio,\n"+
        "Hrequed.nbaseimpon as articulo_base_imponible,\n"+
        "Hrequed.nbasecalc as articulo_base_calculada,\n"+
        "Hrequed.nigvcalc as articulo_igv_calculado,\n"+
        "Hrequed.monto_descuento as articulo_monto_descuento,\n"+
        "isnull(Hrequed.nprecio_importe,0) as articulo_importe,\n"+
        "Hrequed.erp_peso as articulo_peso,\n"+
        "Hrequed.erp_largo as articulo_largo,\n"+
        "Hrequed.erp_ancho as articulo_ancho,\n"+
        "Hrequed.erp_motivo_ref as articulo_motivo_referencia,\n"+
        "Hrequed.erp_item_ref as articulo_item_referencia,\n"+
        "Hrequed.erp_tipo_ref as articulo_tipo_referencia,\n"+
        "Hrequed.codigo_presentacion as articulo_presentacion_codigo,\n"+
        "--Empresa\n"+
        "Hempresa.ccod_empresa as empresa_codigo, \n"+
        "Hempresa.crazonsocial as empresa_razon_social, \n"+
        "Hempresa.rutadelogo as empresa_ruta_logo, \n"+
        "Hempresa.fax_3 as empresa_logo, \n"+
        "hempresa.nro_cuenta_mn as empresa_cuenta1,\n"+
        "hempresa.nro_cuenta_me as empresa_cuenta2,\n"+
        "hempresa.ctelefono as empresa_telefono,\n"+
        "hempresa.cpag_web as empresa_web,\n"+
        "hempresa.cnum_ruc as empresa_ruc,\n"+
        "hempresa.cdireccion as empresa_direccion,\n"+
        "hempresa.cemail as empresa_correo,\n"+
        "--Configuración Formatos\n"+
        "HCONFIG_FORMATOS.valor as cantidad_filas,\n"+
        "Hrequec.erp_ptovta as documento_punto_venta_codigo,\n"+
        "'REQ' as documento_tipo_movimiento,\n"+
        "Hrequec.idmotivo_compra as documento_motivo_venta_codigo,\n"+
        "(select isnull(erp_titulo,'') from erp_encabezado_formato \n"+
        "where erp_codempresa = @codigo_empresa and erp_nitem = '1' and erp_tip_doc  = 'REQ' and ccod_almacen = @codigo_punto_venta  and motivo = @motivo_documento and cnum_doc = @numero_documento) as Titulo1, \n"+
        "(select isnull(erp_titulo,'') from erp_encabezado_formato \n"+
        "where erp_codempresa = @codigo_empresa and erp_nitem = '2' and erp_tip_doc  = 'REQ' and ccod_almacen = @codigo_punto_venta  and motivo = @motivo_documento and cnum_doc = @numero_documento) as Titulo2, \n"+
        "(select isnull(erp_titulo,'') from erp_encabezado_formato \n"+
        "where erp_codempresa = @codigo_empresa and erp_nitem = '3' and erp_tip_doc  = 'REQ' and ccod_almacen = @codigo_punto_venta  and motivo = @motivo_documento and cnum_doc = @numero_documento) as Titulo3, \n"+
        "(select isnull(erp_descripcion,'') from erp_encabezado_formato \n"+
        "where erp_codempresa = @codigo_empresa and erp_nitem = '1' and erp_tip_doc  = 'REQ' and ccod_almacen = @codigo_punto_venta  and motivo = @motivo_documento and cnum_doc = @numero_documento) as Descricion1, \n"+
        "(select isnull(erp_descripcion,'') from erp_encabezado_formato \n"+
        "where erp_codempresa = @codigo_empresa and erp_nitem = '2' and erp_tip_doc  = 'REQ' and ccod_almacen = @codigo_punto_venta  and motivo = @motivo_documento and cnum_doc = @numero_documento) as Descricion2, \n"+
        "(select isnull(erp_descripcion,'') from erp_encabezado_formato \n"+
        "where erp_codempresa = @codigo_empresa and erp_nitem = '3' and erp_tip_doc  = 'REQ' and ccod_almacen = @codigo_punto_venta  and motivo = @motivo_documento and cnum_doc = @numero_documento) as Descricion3, \n"+
        "(select SUM(rcantidad) from Hrequed where  rcod_emp = @codigo_empresa and rcod_req = @numero_documento \n"+
        "and idmotivo_compra = @motivo_documento and erp_ptovta = @codigo_punto_venta ) as documento_total_productos\n"+
        "from Hrequec \n"+
        "left join Hrequed on\n"+
        "Hrequec.r_codemp = Hrequed.rcod_emp\n"+
        "and Hrequec.erp_ptovta = Hrequed.erp_ptovta\n"+
        "and Hrequec.idmotivo_compra = Hrequed.idmotivo_compra\n"+
        "and Hrequec.r_codigo = Hrequed.rcod_req\n"+
        "inner join HCONFIG_FORMATOS on \n"+
        "Hrequec.r_codemp = HCONFIG_FORMATOS.ccod_empresa\n"+
        "and 'REQ' = HCONFIG_FORMATOS.tipo_doc\n"+
        "inner join Hempresa on \n"+
        "Hrequec.r_codemp = Hempresa.ccod_empresa\n"+
        "inner join erp_unidad_negocio on\n"+
        "Hrequec.r_codemp = erp_unidad_negocio.erp_codemp \n"+
        "and Hrequec.erp_codune = erp_unidad_negocio.erp_codune\n"+
        "inner join Hcencos on\n"+
        "Hrequec.r_codemp = Hcencos.ccod_empresa \n"+
        "and Hrequec.r_codcosto = Hcencos.ccod_cencos\n"+
        "inner join Horden_trabajo on\n"+
        "Hrequec.r_codemp = Horden_trabajo.ccod_empresa\n"+
        "and Hrequec.r_ot = Horden_trabajo.ccod_ot\n"+
        "inner join Hperson Responsable on\n"+
        "Hrequec.r_codemp = Responsable.ccod_empresa \n"+
        "and Hrequec.responsable = Responsable.ccod_person\n"+
        "inner join Hperson Aprobacion1 on \n"+
        "Hrequec.r_codemp = Aprobacion1.ccod_empresa \n"+
        "and Hrequec.r_respon = Aprobacion1.ccod_person \n"+
        "inner join Hperson Aprobacion2 on \n"+
        "Hrequec.r_codemp = Aprobacion2.ccod_empresa \n"+
        "and Hrequec.usuario_aprobo1 = Aprobacion2.ccod_person \n"+
        "where \n"+
        "Hrequec.r_codemp = @codigo_empresa\n"+
        "and Hrequec.erp_ptovta = @codigo_punto_venta\n"+
        "and Hrequec.idmotivo_compra = @motivo_documento\n"+
        "and Hrequec.r_codigo = @numero_documento ");

        const Cabecera = lista.recordset;
        res.json(Cabecera);
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/lista_documentos_aprobacion01', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa
        const codigo_punto_venta = req.user.codigo_punto_venta;
        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
        .input('estado', mssql.VarChar(250), req.body.estado)
        .query("SELECT \n"+            
            "Halmacen.cnom_almacen as Punto_Venta, \n"+
            "erp_motivos_tramite.erp_nommot as Motivo_Serie, \n"+
            "CONVERT(VARCHAR(50),Hrequec.r_fecha,103) as Fecha, \n"+
            "CONVERT(VARCHAR(50),Hrequec.r_fechalim,103) as Fecha_Entrega, \n"+
            "'' as Codigo_Proveedor, \n"+
            "'' as Proveedor, \n"+
            "Hrequec.responsable as Codigo_Responsable, \n"+
            "(ltrim(rtrim(Responsable.Ape_pat))  +' '+  ltrim(rtrim(Responsable.ape_mat))  +' '+  ltrim(rtrim(Responsable.nombres))) as Responsable, \n"+
            "hrequec.r_codcosto as Codigo_Centro_Costo, \n"+
            "Hcencos.cnom_cencos as Centro_Costo, \n"+
            "hrequec.r_ot as Codigo_Orden_Trabajo, \n"+
            "Horden_trabajo.cnom_ot as Orden_Trabajo, \n"+
            "hrequec.erp_codune as Codigo_Unidad_Negocio, \n"+
            "erp_unidad_negocio.erp_nomune as Unidad_Negocio, \n"+
            "'' as Forma_Pago, \n"+
            "Hrequec.erp_moneda as Moneda, \n"+
            "Hrequec.tc as Tipo_Cambio, \n"+
            "Hrequec.erp_Dimporte as Importe, \n"+
            "''  as Vendedor, \n"+
            "Hrequec.e_estado as Estado, \n"+
            "Hrequec.r_situapro as Aprobado, \n"+
            "case Hrequec.r_situapro when 'Sin Aprobacion' then '' else (ltrim(rtrim(Aprobacion_1.Ape_pat))  +' '+  ltrim(rtrim(Aprobacion_1.ape_mat))  +' '+  ltrim(rtrim(Aprobacion_1.nombres))) end as Persona_Aprobado, \n"+ 
            "case Hrequec.r_situapro when 'Sin Aprobacion' then '' else CONVERT(VARCHAR(50),Hrequec.r_facepta,103) end as Fecha_Aprobado, \n"+
            "Hrequec.atencion as Atencion, \n"+
            "Hrequec.porcentaje as Porcentaje, \n"+
            "Hrequec.usuario as Usuario, \n"+
            "Hrequec.Pc_User as Nombre_Pc, \n"+ 
            "CONVERT(VARCHAR,Hrequec.Pc_Fecha,3) as Fecha_Grab, \n"+
            "CONVERT(VARCHAR,Hrequec.Pc_Fecha,24) as Hora_Grab, \n"+
            "Hrequec.Pc_Ip as Ip_Pc, \n"+
            "Hrequec.idmotivo_compra as Codigo_Motivo_Serie, \n"+
            "Hrequec.r_codigo as Numero, \n"+
            "Hrequec.aprobado1 as Aprobado2, \n"+
            "Hrequec.erp_ptovta as Codigo_Punto_Venta \n"+
            "FROM Hrequec INNER JOIN Halmacen ON \n"+
            "Hrequec.r_codemp = Halmacen.ccod_empresa and \n"+
            "Hrequec.erp_ptovta = Halmacen.ccod_almacen \n"+
            "INNER JOIN erp_motivos_tramite ON \n"+
            "Hrequec.r_codemp = erp_motivos_tramite.erp_codemp and \n"+
            "Hrequec.idmotivo_compra = erp_motivos_tramite.erp_codmot \n"+
            "Inner Join hperson Aprobacion_1 On \n"+
            "Hrequec.r_codemp = Aprobacion_1.ccod_empresa and \n"+
            "Hrequec.r_respon  = Aprobacion_1.ccod_person \n"+
            "Inner Join hperson Responsable On \n"+
            "Hrequec.r_codemp = Responsable.ccod_empresa and \n"+
            "Hrequec.responsable  = Responsable.ccod_person \n"+
            "Inner Join Hcencos On \n"+
            "Hrequec.r_codemp = Hcencos.ccod_empresa and \n"+
            "Hrequec.r_codcosto  = Hcencos.ccod_cencos \n"+
            "Inner Join Horden_trabajo On \n"+
            "Hrequec.r_codemp = Horden_trabajo.ccod_empresa and \n"+
            "Hrequec.r_ot  = Horden_trabajo.ccod_ot \n"+
            "Inner Join erp_unidad_negocio On \n"+
            "Hrequec.r_codemp = erp_unidad_negocio.erp_codemp and \n"+
            "Hrequec.erp_codune  = erp_unidad_negocio.erp_codune \n"+
            "WHERE Hrequec.r_codemp = @codigo_empresa AND \n"+
            "Hrequec.erp_ptovta = @codigo_punto_venta AND \n"+
            "Hrequec.r_situapro = @estado \n"+
            "order by r_fecha desc, r_codigo desc "
            // "order by r_fecha desc,idmotivo_compra,r_codigo desc "
            );
          
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/aprobaciones01', async (req, res) => {
    try{
        var rowsAffected=0;
        const codigo_empresa = req.user.codigo_empresa;
        var filas = JSON.parse(req.body.fila)
        const pool = await poolPromise;
        var lista;
        for (let i= 0; i< filas.length; i++){
            console.log(filas[i]);
            lista = await pool
            .request()
            .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
            .input('estado', mssql.VarChar(250), req.body.aprobacion)
            .input('responsable', mssql.VarChar(250), req.body.responsable)
            .input('comentario', mssql.VarChar(250), req.body.comentario)
            .input('fecha', mssql.VarChar(250), req.body.fecha)
            .input('punto_venta', mssql.VarChar(250), filas[i].Codigo_Punto_Venta)
            .input('motivo', mssql.VarChar(250), filas[i].Codigo_Motivo_Serie)
            .input('numero', mssql.VarChar(250), filas[i].Numero)
            .query("update Hrequec set \n"+
            "r_situapro = @estado, \n"+
            "r_respon = @responsable, \n"+
            "r_facepta = @fecha, \n"+
            "r_obs = @comentario \n"+
            "where r_codemp=@codigo_empresa and \n"+
            "erp_ptovta=@punto_venta and \n"+
            "idmotivo_compra=@motivo and \n"+
            "r_codigo=@numero");
            rowsAffected++;
        }       
        res.send({estado: true, codigo: "0", mensaje: rowsAffected});
    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
});

router.post('/lista_documentos_aprobacion02', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa
        const codigo_punto_venta = req.user.codigo_punto_venta;
        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
        .input('estado', mssql.VarChar(250), req.body.estado)
        .query("SELECT \n"+              
            "Halmacen.cnom_almacen as Punto_Venta, \n"+            
            "erp_motivos_tramite.erp_nommot as Motivo_Serie, \n"+
            "CONVERT(VARCHAR(50),Hrequec.r_fecha,103) as Fecha, \n"+
            "CONVERT(VARCHAR(50),Hrequec.r_fechalim,103) as Fecha_Entrega, \n"+
            "'' as Codigo_Proveedor, \n"+
            "'' as Proveedor, \n"+
            "Hrequec.responsable as Codigo_Responsable, \n"+
            "(ltrim(rtrim(Responsable.Ape_pat))  +' '+  ltrim(rtrim(Responsable.ape_mat))  +' '+  ltrim(rtrim(Responsable.nombres))) as Responsable, \n"+
            "hrequec.r_codcosto as Codigo_Centro_Costo, \n"+
            "Hcencos.cnom_cencos as Centro_Costo, \n"+
            "hrequec.r_ot as Codigo_Orden_Trabajo, \n"+
            "Horden_trabajo.cnom_ot as Orden_Trabajo, \n"+
            "hrequec.erp_codune as Codigo_Unidad_Negocio, \n"+
            "erp_unidad_negocio.erp_nomune as Unidad_Negocio, \n"+
            "'' as Forma_Pago, \n"+
            "Hrequec.erp_moneda as Moneda, \n"+
            "Hrequec.tc as Tipo_Cambio, \n"+
            "Hrequec.erp_Dimporte as Importe, \n"+
            "''  as Vendedor, \n"+
            "Hrequec.e_estado as Estado, \n"+
            "Hrequec.aprobado1 as Aprobado, \n"+
            "case Hrequec.aprobado1 when 'Sin Aprobacion' then '' else (ltrim(rtrim(Aprobacion_2.Ape_pat))  +' '+  ltrim(rtrim(Aprobacion_2.ape_mat))  +' '+  ltrim(rtrim(Aprobacion_2.nombres))) end as Persona_Aprobado, \n"+  
            "case Hrequec.aprobado1 when 'Sin Aprobacion' then '' else CONVERT(VARCHAR(50),Hrequec.fecha_aprob2,103) end as Fecha_Aprobado, \n"+  
            "Hrequec.atencion as Atencion, \n"+
            "Hrequec.porcentaje as Porcentaje, \n"+
            "Hrequec.usuario as Usuario, \n"+
            "Hrequec.Pc_User as Nombre_Pc, \n"+
            "CONVERT(VARCHAR,Hrequec.Pc_Fecha,3) as Fecha_Grab, \n"+
            "CONVERT(VARCHAR,Hrequec.Pc_Fecha,24) as Hora_Grab, \n"+
            "Hrequec.Pc_Ip as Ip_Pc, \n"+
            "Hrequec.idmotivo_compra as Codigo_Motivo_Serie, \n"+
            "Hrequec.r_codigo as Numero, \n"+
            "Hrequec.erp_ptovta as Codigo_Punto_Venta \n"+
            "FROM Hrequec INNER JOIN Halmacen ON \n"+
            "Hrequec.r_codemp = Halmacen.ccod_empresa and \n"+
            "Hrequec.erp_ptovta = Halmacen.ccod_almacen \n"+
            "INNER JOIN erp_motivos_tramite ON \n"+
            "Hrequec.r_codemp = erp_motivos_tramite.erp_codemp and \n"+
            "Hrequec.idmotivo_compra = erp_motivos_tramite.erp_codmot \n"+     
            "Inner Join hperson Aprobacion_2 On \n"+
            "Hrequec.r_codemp = Aprobacion_2.ccod_empresa and \n"+
            "Hrequec.usuario_aprobo1  = Aprobacion_2.ccod_person \n"+
            "Inner Join hperson Responsable On \n"+
            "Hrequec.r_codemp = Responsable.ccod_empresa and \n"+
            "Hrequec.responsable  = Responsable.ccod_person \n"+
            "Inner Join Hcencos On \n"+
            "Hrequec.r_codemp = Hcencos.ccod_empresa and \n"+
            "Hrequec.r_codcosto  = Hcencos.ccod_cencos \n"+
            "Inner Join Horden_trabajo On \n"+
            "Hrequec.r_codemp = Horden_trabajo.ccod_empresa and \n"+
            "Hrequec.r_ot  = Horden_trabajo.ccod_ot \n"+
            "Inner Join erp_unidad_negocio On \n"+
            "Hrequec.r_codemp = erp_unidad_negocio.erp_codemp and \n"+
            "Hrequec.erp_codune  = erp_unidad_negocio.erp_codune \n"+
            "WHERE Hrequec.r_codemp = @codigo_empresa AND \n"+
            "Hrequec.erp_ptovta = @codigo_punto_venta AND \n"+
            "Hrequec.r_situapro = 'Aprobado' AND \n"+
            "Hrequec.aprobado1 = @estado \n"+
            "order by pc_fecha asc"
            // "order by r_fecha desc,idmotivo_compra,r_codigo desc "
        );
          
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/aprobaciones02', async (req, res) => {
    try{
        var rowsAffected=0;
        var documento_no_modificado = 0;
        const codigo_empresa = req.user.codigo_empresa;
        var filas = JSON.parse(req.body.fila)
        const pool = await poolPromise;
        var lista;
        for (let i= 0; i< filas.length; i++){
            lista = await pool
            .request()
            .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
            .input('estado', mssql.VarChar(250), req.body.aprobacion)
            .input('responsable', mssql.VarChar(250), req.body.responsable)
            .input('comentario', mssql.VarChar(250), req.body.comentario)
            .input('fecha', mssql.VarChar(250), req.body.fecha)
            .input('punto_venta', mssql.VarChar(250), filas[i].Codigo_Punto_Venta)
            .input('motivo', mssql.VarChar(250), filas[i].Codigo_Motivo_Serie)
            .input('numero', mssql.VarChar(250), filas[i].Numero)
            .query("update Hrequec set \n"+
            "aprobado1 = @estado, \n"+
            "usuario_aprobo1 = @responsable, \n"+
            "fecha_aprob2 = @fecha, \n"+
            "r_obs2 = @comentario \n"+
            "where r_codemp=@codigo_empresa and \n"+
            "erp_ptovta=@punto_venta and \n"+
            "idmotivo_compra=@motivo and \n"+
            "r_codigo=@numero");
            rowsAffected++;
        }      
        res.send({estado: true, codigo: "0", mensaje: rowsAffected});
    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
});

router.post('/lista_documentos_pendientes', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa
        const codigo_punto_venta = req.user.codigo_punto_venta;
        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_proveedor', mssql.VarChar(250), req.body.codigo)
        .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
        .input('todos', mssql.VarChar(250), req.body.todos)
        .query(
            "Select \n"+
            "(Hrequec.erp_ptovta) as Punto_Venta, \n"+
            "'REQUERIMIENTO' as Tipo_Venta, \n"+
            "'REQ' as Tipo_Documento, \n"+
            "Rtrim(Ltrim(Hrequec.idmotivo_compra)) as Codigo_Motivo_Serie, \n"+
            "Hrequec.r_codigo as Numero, \n"+
            "CONVERT(VARCHAR(50),Hrequec.r_fecha,103) as Fecha, \n"+
            "'' as Codigo_proveedor, \n"+
            "'' as Nombre_proveedor, \n"+
            "CONVERT(VARCHAR(50),Hrequec.r_fechalim,103) as Fecha_Limite, \n"+
            "'' as Forma_Pago, \n"+
            "Hrequec.r_prior as Prioridad, \n"+
            "Hrequec.erp_moneda as Moneda, \n"+
            "hcencos.ccod_cencos as Cencos, \n"+
            "Hrequec.r_ot as Ot, \n"+
            "Hrequec.responsable as Responsable, \n"+
            "Hrequec.erp_codune as Codigo_Unidad_Negocio, \n"+
            "Hrequec.erp_codage as Codigo_Agencia, \n"+
            "Hrequec.glosa as glosa, \n"+
            "Hrequec.si_igv as si_igv, \n"+
            "Hrequec.tc as Tc, \n"+
            "(hcencos.cnom_cencos) as Nombre_Cencos, \n"+
            "(ERP_MOTIVOS_TRAMITE.erp_nommot) as Nombre_Motivo, \n"+
            "Hrequec.descuento as Porc_Descuento, \n"+
            "'' as Telefono_proveedor, \n"+
            "'' as Codigo_Contacto, \n"+
            "'' as Nombre_Contacto, \n"+
            "'' as Correo_proveedor, \n"+
            "'' as Dias_Forma_Pago, \n"+
            "Hrequec.erp_DBasecalc as Sub_Total_Sin_Descuentos, \n"+
            "Hrequec.erp_Ddescuento as Monto_Descuento, \n"+
            "Hrequec.erp_Dsubtotal as Sub_Total, \n"+
            "Hrequec.erp_Digv as Igv, \n"+
            "Hrequec.erp_Dimporte as Total, \n"+
            "'' as Punto_Llegada, \n"+
            "'' as proveedor_Direccion, \n"+
            "Rtrim(Ltrim(Hrequec.idmotivo_compra)) as Referencia_Requerimiento_Motivo, \n"+
            "Hrequec.r_codigo as Referencia_Requerimiento_Numero, \n"+
            "Hrequec.erp_nro_exp as Numero_Expediente, \n"+
            "Hrequec.erp_nro_exp2 as Numero_Expediente_2 \n"+
            "From Hrequec \n"+
            "Inner Join hcencos On \n"+
            "Hrequec.r_codcosto = hcencos.ccod_cencos And \n"+
            "Hrequec.r_codemp = hcencos.ccod_empresa \n"+
            "Inner Join ERP_MOTIVOS_TRAMITE on \n"+
            "Hrequec.r_codemp= ERP_MOTIVOS_TRAMITE.erp_codemp And \n"+
            "Hrequec.idmotivo_compra = ERP_MOTIVOS_TRAMITE.erp_codmot \n"+
            "inner join Hconfiguraciones_2 on \n"+
            "Hrequec.r_codemp= Hconfiguraciones_2.idempresa \n"+
            "Where Hrequec.r_codemp = @codigo_empresa And \n"+
            "Hrequec.erp_ptovta = @codigo_punto_venta AND    + \n"+
            "case @todos when 'S' then '' else Hrequec.atencion end <> 'Atendido' \n"+
            "and Hrequec.e_estado <> 'Anulado' \n"+
            "and Hrequec.r_situapro ='Aprobado' \n"+
            "and Hrequec.aprobado1 ='Aprobado' \n"+
            "Order By Hrequec.r_fecha desc,r_codigo desc"
        );    
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/lista_detalle_pendientes', async (req, res) => {
    try {
        console.log(req.body);
        const codigo_empresa = req.user.codigo_empresa
        const codigo_punto_venta = req.user.codigo_punto_venta;
        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('punto_venta', mssql.VarChar(200), req.body.punto_venta)
        .input('motivo_serie', mssql.VarChar(200), req.body.motivo_serie)
        .input('numero', mssql.VarChar(200), req.body.numero)
        .input('todos', mssql.VarChar(200), req.body.todos)
        .query(
            "select \n"+
            "Cantidad_Por_Atender - \n"+
            "case Cantidad_Atendida when -1 then 0 else Cantidad_Atendida end as Cantidad, \n"+
            "Cantidad_Kardex_Por_Atender - \n"+
            "case Cantidad_Kardex_Atendida when -1 then 0 else Cantidad_Kardex_Atendida end as Cantidad_Kardex, \n"+
            "* from ( \n"+
            "SELECT \n"+
            "Hrequed.erp_ptovta as Punto_Venta, \n"+
            "Hrequed.idmotivo_compra as Codigo_Motivo_Serie, \n"+
            "Hrequed.rcod_req as Numero, \n"+
            "Hrequed.item as NItem, \n"+
            "Hrequed.rcantidad as Cantidad_Por_Atender, \n"+
            "(case @todos when 'S' then 0 else isnull(( \n"+
            "select sum(ncantidad) from Hordcomd \n"+
            "left join Hordcomc on \n"+
            "Hordcomc.ccod_empresa = Hordcomd.ccod_empresa \n"+
            "and Hordcomc.erp_ptovta = Hordcomd.erp_ptovta \n"+
            "and Hordcomc.idmotivo_compra = Hordcomd.idmotivo_compra \n"+
            "and Hordcomc.idmotivo_compra = Hordcomd.idmotivo_compra \n"+
            "and Hordcomc.cnum_doc = Hordcomd.cnum_doc \n"+
            "where \n"+
            "Hordcomd.ccod_empresa = Hrequed.rcod_emp \n"+
            "and Hordcomd.erp_motivo_req = Hrequed.idmotivo_compra \n"+
            "and Hordcomd.erp_nro_req = Hrequed.rcod_req \n"+
            "and Hordcomd.erp_ptovta_req = Hrequed.erp_ptovta \n"+
            "and Hordcomc.estado <> 'Anulado' \n"+
            "and Hordcomd.ccod_articulo = Hrequed.r_codart \n"+
            "and Hordcomd.cunidad = Hrequed.runidades \n"+
            "and Hordcomd.item_requerimiento = Hrequed.item \n"+
            "),-1) end) as Cantidad_Atendida, \n"+
            "Hrequed.r_codart AS Codigo, \n"+
            "Harticul.ccod_almacen as Tipo_producto, \n"+
            "Harticul.cfamilia as Familia, \n"+
            "Harticul.ccod_subfamilia as Subfamilia, \n"+
            "harticul.codmarca as Codigo_Concepto1, \n"+
            "erp_concepto1.erp_nomcon as Concepto1, \n"+
            "harticul.modelo as Concepto2, \n"+
            "harticul.color as Concepto3, \n"+
            "harticul.tratamiento as Concepto4, \n"+
            "harticul.fuelle as Concepto5, \n"+
            "harticul.azas as Concepto6, \n"+
            "harticul.solapa as Concepto7, \n"+
            "harticul.ccod_interno as Codigo_Fabricante, \n"+
            "harticul.cod_digemir as Codigo_Digemid, \n"+
            "harticul.erp_codinterno2 as Codigo_Interno, \n"+
            "harticul.erp_codinterno3 as Codigo_Interno2, \n"+
            "harticul.observacion as Leyenda1, \n"+
            "harticul.erp_observacion2 as Leyenda2, \n"+
            "Hrequed.rdesc AS Nombre, \n"+
            "RTRIM(Hrequed.runidades) AS Codigo_Unidad, \n"+
            "RTRIM(Hrequed.runidades) AS Unidad, \n"+
            "'0' as Comision_porcentaje, \n"+
            "Hrequed.factor as Factor, \n"+
            "Hrequed.r_precio as Unit, \n"+
            "Hrequed.nbaseimpon as Base_Imponible, \n"+
            "'0' as Desc1, \n"+
            "'0' as Desc2, \n"+
            "'0' As Desc3, \n"+
            "'0' as Desc4, \n"+
            "Hrequed.nbasecalc as Base_Calculada, \n"+
            "Hrequed.nigvcalc as Igv, \n"+
            "Hrequed.nprecio_importe as Importe, \n"+
            "Hrequed.erp_peso as Peso, \n"+
            "Halmacen_2.ccod_almacen as Codigo_Almacen, \n"+
            "Halmacen_2.cnom_almacen as Almacen, \n"+
            "Hrequed.Erp_Cantidad_Presentacion as Cantidad_presentacion, \n"+
            "Hrequed.codigo_presentacion as Codigo_presentacion, \n"+
            "RTRIM(Hrequed.Erp_Unidad_Presentacion) AS Unidad_presentacion, \n"+
            "Hrequed.Erp_Nombre_Presentacion AS Nombre_presentacion, \n"+
            "Hrequed.Erp_Precio_Presentacion as Precio_presentacion, \n"+
            "'' as Observacion, \n"+
            "Hrequed.r_ot as OT, \n"+
            "'' as ICBPER, \n"+
            "Hrequed.rcantidad as Cantidad_Kardex_Por_Atender, \n"+
            "isnull(( \n"+
            "select sum(ncantidad) from Hordcomd \n"+
            "left join Hordcomc on \n"+
            "Hordcomc.ccod_empresa = Hordcomd.ccod_empresa \n"+
            "and Hordcomc.erp_ptovta = Hordcomd.erp_ptovta \n"+
            "and Hordcomc.idmotivo_compra = Hordcomd.idmotivo_compra \n"+
            "and Hordcomc.idmotivo_compra = Hordcomd.idmotivo_compra \n"+
            "and Hordcomc.cnum_doc = Hordcomd.cnum_doc \n"+
            "where \n"+
            "Hordcomd.ccod_empresa = Hrequed.rcod_emp \n"+
            "and Hordcomd.erp_motivo_req = Hrequed.idmotivo_compra \n"+
            "and Hordcomd.erp_nro_req = Hrequed.rcod_req \n"+
            "and Hordcomd.erp_ptovta_req = Hrequed.erp_ptovta \n"+
            "and Hordcomc.estado <> 'Anulado' \n"+
            "and Hordcomd.ccod_articulo = Hrequed.r_codart \n"+
            "and Hordcomd.cunidad = Hrequed.runidades \n"+
            "and Hordcomd.item_requerimiento = Hrequed.item \n"+
            "),-1) as Cantidad_Kardex_Atendida, \n"+
            "Hrequed.barticulo as Barticulo, \n"+
            "Hrequed.nigv as Igv_Art, \n"+
            "Hrequed.monto_descuento as Monto_Descuento, \n"+
            "Hrequed.r_precio as Precio_original, \n"+
            "Hrequed.erp_codune as Codigo_Unidad_Negocio, \n"+
            "Hrequed.erp_codune as Unidad_negocio, \n"+
            "Hrequed.ccod_cencos AS Codigo_Cencos, \n"+
            "Hrequed.ccod_cencos AS Cencos, \n"+
            "'' as Codigo_Partida_presupuestal, \n"+
            "'' as Partida_presupuestal, \n"+
            "Hrequed.erp_codage as Codigo_Agencia, \n"+
            "Hrequed.erp_codage as Agencia, \n"+
            "'' as Percepcion_sn, \n"+
            "'' as Percepcion_uni, \n"+
            "'' as Perpecion_porc, \n"+
            "'' as Boni_sn, \n"+
            "'' as Item_boni, \n"+
            "'' as Comision_monto, \n"+
            "Hrequed.nbasecalc as Base_calculada_dec, \n"+
            "Hrequed.nbaseimpon as Base_imp_dec, \n"+
            "Hrequed.nigvcalc as Igv_dec, \n"+
            "Hrequed.nprecio_importe as Importe_dec, \n"+
            "Harticul.csistock as Stock_SN, \n"+
            "Harticul.lote as Lote_SN, \n"+
            "'' as Lote_Numero, \n"+
            "'' as Lote_Vencimiento, \n"+
            "Harticul.flagserie Serie_SN, \n"+
            "'' as Serie_Numero, \n"+
            "Hrequed.idmotivo_compra as Requerimiento_Motivo, \n"+
            "Hrequed.rcod_req as Requerimiento_Numero, \n"+
            "'' as Orden_Compra_Motivo, \n"+
            "'' as Orden_Compra_Numero, \n"+
            "'REQ' as Origen_Documento, \n"+
            "Hrequed.erp_ptovta as Origen_Punto_Venta, \n"+
            "Hrequed.idmotivo_compra as Origen_Motivo_Serie, \n"+
            "Hrequed.rcod_req as Origen_Numero, \n"+
            "Hrequed.item as Origen_NItem \n"+
            "FROM Hrequed inner Join Harticul On \n"+
            "Hrequed.rcod_emp = Harticul.ccod_empresa and \n"+
            "Hrequed.r_codart = Harticul.ccod_articulo \n"+
            "inner join erp_concepto1 on \n"+
            "erp_concepto1.erp_codemp = Harticul.ccod_empresa and \n"+
            "erp_concepto1.erp_codcon = Harticul.codmarca \n"+
            "inner join Halmacen on \n"+
            "Halmacen.ccod_empresa = Hrequed.rcod_emp and \n"+
            "Halmacen.ccod_almacen = Hrequed.erp_ptovta \n"+
            "inner join Halmacen_2 on \n"+
            "Halmacen_2.ccod_empresa = Hrequed.rcod_emp and \n"+
            "Halmacen_2.ccod_almacen = Halmacen.erp_codalmacen_ptovta \n"+
            "WHERE \n"+
            "Hrequed.rcod_emp = @codigo_empresa and \n"+
            "Hrequed.idmotivo_compra = @motivo_serie and \n"+
            "Hrequed.rcod_req = @numero and \n"+
            "Hrequed.erp_ptovta= @punto_venta \n"+
            ") as tablita \n"+
            "where \n"+
            "Cantidad_Por_Atender > case @todos when 'S' then -1 else Cantidad_Atendida end \n"+
            "ORDER BY NITEM \n"
        );
          
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/eliminar_saldos', async (req, res) => {
    try {
        const filas_detalle=JSON.parse(req.body.datos);
        const codigo_empresa = req.user.codigo_empresa;
        const usuario = req.user.codigo_usuario;
        const pool = await poolPromise
        var lista;
        for (let i= 0; i< filas_detalle.length; i++){
            var detalle = filas_detalle[i];
            lista = await pool
            .request()
            .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
            .input('punto_venta', mssql.VarChar(250), detalle.Punto_Venta)
            .input('tipo_documento', mssql.VarChar(250), "Requerimientos")
            .input('serie_motivo', mssql.VarChar(250), detalle.Codigo_Motivo_Serie)
            .input('numero_documento', mssql.VarChar(250), detalle.Numero)
            .input('modulo', mssql.VarChar(250), "Requerimientos")
            .input('usuario', mssql.VarChar(250), usuario)
            .input('PC_User', mssql.VarChar(250), '')
            .input('PC_Ip', mssql.VarChar(250), req.ip)
            .query(
                "declare @conteo varchar(10) \n"+
                "select @conteo = COUNT(*) from saldos_eliminados where \n"+
                "codigo_empresa = @codigo_empresa \n"+
                "and punto_venta = @punto_venta \n"+
                "and tipo_documento = @tipo_documento \n"+
                "and serie_motivo = @serie_motivo \n"+
                "and numero_documento = @numero_documento \n"+
                "and modulo = @modulo \n"+
                "if @conteo = 0 \n"+
                "begin \n"+
                    "insert into saldos_eliminados values ("+
                    "@codigo_empresa,"+
                    "@punto_venta,"+
                    "@tipo_documento,"+
                    "@serie_motivo,"+
                    "@numero_documento,"+
                    "@modulo,"+
                    "@usuario,"+
                    "host_name(),"+
                    "CURRENT_TIMESTAMP,"+
                    "@PC_Ip"+
                    ")\n"+
                "end"
            );

            
            lista = await pool
            .request()
            .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
            .input('punto_venta', mssql.VarChar(250), detalle.Punto_Venta)
            .input('serie_motivo', mssql.VarChar(250), detalle.Codigo_Motivo_Serie)
            .input('numero_documento', mssql.VarChar(250), detalle.Numero)
            .query(
                "update hrequec \n"+
                "set \n"+
                "atencion='Atendido'\n"+
                ",porcentaje='100%'\n"+
                "where \n"+
                "r_codemp=@codigo_empresa\n"+
                "and erp_ptovta=@punto_venta\n"+
                "and idmotivo_compra=@serie_motivo\n"+
                "and r_codigo=@numero_documento"
            );
        }
        res.send({estado: true, codigo: "0", mensaje: "Saldos Eliminados"});
    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
});

router.post('/comentarios', async (req, res) => {

    const codigo_empresa = req.user.codigo_empresa;
    const motivo_documento = req.body.motivo_documento;
    const numero_documento = req.body.numero_documento;
    var codigo_punto_venta = req.body.codigo_punto_venta;

    if(codigo_punto_venta==""){
        codigo_punto_venta = req.user.codigo_punto_venta;
    }
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('motivo_documento', mssql.VarChar(250), motivo_documento)
    .input('numero_documento', mssql.VarChar(250), numero_documento)
    .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
    .query(
        " SELECT  \n"+
        " erp_titulo as Titulo, \n"+
        " erp_descripcion as Descripcion \n"+
        " FROM ERP_ENCABEZADO_FORMATO \n"+
        " where erp_codempresa = @codigo_empresa and erp_tip_doc  = 'REQ' and ccod_almacen = @codigo_punto_venta  and motivo = @motivo_documento and cnum_doc = @numero_documento \n"
    );
 
    const recordset = lista.recordset;
    res.json(recordset);
});


module.exports = router;