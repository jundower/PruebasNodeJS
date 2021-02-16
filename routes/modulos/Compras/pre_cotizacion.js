const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../../database');

router.post('/detalle', async (req, res) => {

    const codigo_empresa = req.user.codigo_empresa;
    // const motivo_documento = '022';
    // const numero_documento = '2020-00002';
    // const codigo_punto_venta = '001';
    const numero_documento = req.body.numero_documento;
    var codigo_punto_venta = req.body.codigo_punto_venta;

    if(codigo_punto_venta == null || codigo_punto_venta.trim()===''){
        codigo_punto_venta = req.user.codigo_punto_venta;
    }
    
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('numero_documento', mssql.VarChar(250), numero_documento)
    .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
    .query("SELECT \n"+
        " erp_precotizaciond.erp_itemov as NItem, \n"+
        " erp_precotizaciond.erp_canmov as Cantidad, \n"+
        " erp_precotizaciond.erp_codart AS Codigo, \n"+
        " Harticul.ccod_almacen as Tipo_producto, \n"+
        " Harticul.cfamilia as Familia, \n"+
        " Harticul.ccod_subfamilia as Subfamilia, \n"+
        " harticul.codmarca as Codigo_Concepto1, \n"+
        " erp_concepto1.erp_nomcon as Concepto1, \n"+
        " harticul.modelo as Concepto2, \n"+
        " harticul.color as Concepto3, \n"+
        " harticul.tratamiento as Concepto4, \n"+
        " harticul.fuelle as Concepto5, \n"+
        " harticul.azas as Concepto6, \n"+
        " harticul.solapa as Concepto7, \n"+
        " harticul.ccod_interno as Codigo_Fabricante, \n"+
        " harticul.cod_digemir as Codigo_Digemid, \n"+
        " harticul.erp_codinterno2 as Codigo_Interno, \n"+
        " harticul.erp_codinterno3 as Codigo_Interno2, \n"+
        " harticul.observacion as Leyenda1, \n"+
        " harticul.erp_observacion2 as Leyenda2, \n"+
        " erp_precotizaciond.erp_nomart AS Nombre, \n"+
        " RTRIM(erp_precotizaciond.erp_codund) AS Codigo_Unidad, \n"+
        " RTRIM(erp_precotizaciond.erp_codund) AS Unidad, \n"+
        " '' as Comision_porcentaje, \n"+
        " '' as Factor, \n"+
        " '' as Unit, \n"+
        " '' as Base_Imponible, \n"+
        " '' as Desc1, \n"+
        " '' as Desc2, \n"+
        " '' As Desc3, \n"+
        " '' as Desc4, \n"+
        " '' as Base_Calculada, \n"+
        " '' as Igv, \n"+
        " '' as Importe, \n"+
        " '' as Peso, \n"+
        " Halmacen_2.ccod_almacen as Codigo_Almacen, \n"+
        " Halmacen_2.cnom_almacen as Almacen, \n"+
        " '' as Cantidad_presentacion, \n"+
        " '' as Codigo_presentacion, \n"+
        " '' AS Unidad_presentacion, \n"+
        " '' AS Nombre_presentacion, \n"+
        " '' as Precio_presentacion, \n"+
        " '' as Observacion, \n"+
        " erp_precotizaciond.erp_codot as OT, \n"+
        " erp_precotizaciond.erp_canmov as Cantidad_Kardex, \n"+
        " erp_precotizaciond.barticulo as Barticulo, \n"+
        " '' as Igv_Art, \n"+
        " '' as Monto_Descuento, \n"+
        " '' as Precio_original, \n"+
        " erp_precotizaciond.erp_codune as Codigo_Unidad_Negocio, \n"+
        " erp_precotizaciond.erp_codune as Unidad_negocio, \n"+
        " erp_precotizaciond.erp_codcen AS Codigo_Cencos, \n"+
        " erp_precotizaciond.erp_codcen AS Cencos, \n"+
        " '' as Codigo_Partida_presupuestal, \n"+
        " '' as Partida_presupuestal, \n"+
        " '' as Codigo_Agencia, \n"+
        " '' as Agencia, \n"+
        " '' as Percepcion_sn, \n"+
        " '' as Percepcion_uni, \n"+
        " '' as Perpecion_porc, \n"+
        " '' as Boni_sn, \n"+
        " '' as Item_boni, \n"+
        " '' as Comision_monto, \n"+
        " '' as Base_calculada_dec, \n"+
        " '' as Base_imp_dec, \n"+
        " '' as Igv_dec, \n"+
        " '' as Importe_dec, \n"+
        " Harticul.csistock as Stock_SN, \n"+
        " Harticul.lote as Lote_SN, \n"+
        " '' as Lote_Numero, \n"+
        " '' as Lote_Vencimiento, \n"+
        " Harticul.flagserie Serie_SN, \n"+
        " '' as Serie_Numero, \n"+
        " erp_precotizaciond.erp_codptv as Punto_Venta, \n"+
        " '' as Codigo_Motivo_Serie, \n"+
        " erp_precotizaciond.erp_numprc as Numero, \n"+
        " erp_precotizaciond.erp_motreq as Requerimiento_Motivo, \n"+
        " erp_precotizaciond.erp_numreq as Requerimiento_Numero, \n"+
        " '' as Orden_Compra_Motivo, \n"+
        " '' as Orden_Compra_Numero, \n"+
        " 'REQ' as Origen_Documento, \n"+
        " erp_precotizaciond.erp_codptv as Origen_Punto_Venta, \n"+
        " '' as Origen_Motivo_Serie, \n"+
        " '' as Origen_Numero, \n"+
        " erp_precotizaciond.erp_itereq as Origen_NItem \n"+
        " FROM erp_precotizaciond inner Join Harticul On \n"+
        " erp_precotizaciond.erp_codemp = Harticul.ccod_empresa and \n"+
        " erp_precotizaciond.erp_codart = Harticul.ccod_articulo \n"+
        " inner join erp_concepto1 on \n"+
        " erp_concepto1.erp_codemp = Harticul.ccod_empresa and \n"+
        " erp_concepto1.erp_codcon = Harticul.codmarca \n"+
        " inner join Halmacen_2 on \n"+
        " Halmacen_2.ccod_empresa = erp_precotizaciond.erp_codemp and \n"+
        " Halmacen_2.ccod_almacen = erp_precotizaciond.erp_codptv \n"+
        " WHERE \n"+
        " erp_precotizaciond.erp_codemp = @codigo_empresa and \n"+
        " erp_precotizaciond.erp_numprc = @numero_documento and \n"+
        " erp_precotizaciond.erp_codptv= @codigo_punto_venta \n"+
        " ORDER BY NITEM");

    
    const recordset = lista.recordset;
    res.json(recordset);
});

router.post('/guardar', async (req, res) => {
    try {

        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.user.codigo_punto_venta;
        const usuario = req.user.codigo_usuario;
        var filas_detalle = JSON.parse(req.body.filas_detalle)
        
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
                    .input("idmotivo_compra", mssql.VarChar(150), req.body.motivo)
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
                        "SELECT @correlativo = erp_nummot \n"+
                        "FROM erp_motivos_tramite_detalle \n"+
                        "WHERE erp_codemp = @codigo_empresa \n"+
                        "and erp_codmot = @idmotivo_compra \n"+
                        "and erp_sermot = @anio \n"+
                        "select \n"+
                        "@cantidad_ceros = Isnull(cantidad_caracteres,0) \n"+
                        "from htipdoc \n"+
                        "where ccod_empresa = @codigo_empresa \n"+
                        "and ctip_doc = 'OC' \n"+
                        "set @cnt = LEN(@correlativo) \n"+
                        "WHILE @cnt < @cantidad_ceros \n"+
                        "BEGIN \n"+
                        "SET @ceros = '0'+@ceros \n"+
                        "SET @cnt = @cnt + 1 \n"+
                        "END \n"+
                        "while @contador>0 \n"+
                        "begin \n"+
                        "set @correlativo = @correlativo +1 \n"+
                        "SELECT @contador= COUNT(*) \n"+
                        "FROM Hordcomc \n"+
                        "WHERE ccod_empresa = @codigo_empresa \n"+
                        "AND erp_ptovta = @codigo_punto_venta \n"+
                        "AND idmotivo_compra = @idmotivo_compra \n"+
                        "AND cnum_doc =CONVERT(VARCHAR(50),@anio+'-'+@ceros+@correlativo) \n"+
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
                .input("erp_codemp", mssql.VarChar(250), codigo_empresa)
                .input("erp_codptv", mssql.VarChar(250), codigo_punto_venta)
                .input("erp_numprc", mssql.VarChar(250), numero_correlativo)
                .input("erp_codres", mssql.VarChar(250), req.body.codigo_responsable)
                .input("erp_fecdoc", mssql.VarChar(250), req.body.fecha_doc)
                .input("erp_estdoc", mssql.VarChar(250), req.body.estado)
                .input("erp_glomov", mssql.VarChar(250), req.body.glosa)
                .input("erp_autman", mssql.VarChar(250), req.body.automatico)
                .input("erp_numref", mssql.VarChar(250), req.body.numero_requerimiento)
                // .input("subtotal_sin_descuentos", mssql.VarChar(250), req.body.subtotal_sin_descuentos)
                // .input("erp_Ddescuento", mssql.VarChar(250), req.body.erp_Ddescuento)
                // .input("erp_Dsubtotal", mssql.VarChar(250), req.body.erp_Dsubtotal)
                // .input("erp_Digv", mssql.VarChar(250), req.body.erp_Digv)
                // .input("erp_Dimporte", mssql.VarChar(250), req.body.erp_Dimporte)
                // .input("erp_Dpercepcion", mssql.VarChar(250), req.body.erp_Dpercepcion)
                // .input("erp_Dtotal", mssql.VarChar(250), req.body.erp_Dtotal)
                .query("INSERT INTO erp_precotizacionc( \n"+
                    " erp_codemp, \n"+
                    " erp_codptv, \n"+
                    " erp_numprc, \n"+
                    " erp_codres, \n"+
                    " erp_fecdoc, \n"+
                    " erp_estdoc, \n"+
                    " erp_glomov, \n"+
                    " erp_autman, \n"+
                    " erp_numref) \n"+
                    " VALUES( \n"+
                    " @erp_codemp, \n"+
                    " @erp_codptv, \n"+
                    " @erp_numprc, \n"+
                    " @erp_codres, \n"+
                    " @erp_fecdoc, \n"+
                    " @erp_estdoc, \n"+
                    " @erp_glomov, \n"+
                    " @erp_autman, \n"+
                    " @erp_numref)")
                //#endregion
                
                //#region Registro del detalle
                for (let i= 0; i< filas_detalle.length; i++){
                    rowid = filas_detalle[i];
                    
                    const request_detalle = new mssql.Request(transaction);
                    await request_detalle
                    .input("erp_codemp", mssql.VarChar(250), codigo_empresa)
                    .input("erp_codptv", mssql.VarChar(250), codigo_punto_venta)
                    .input("erp_numprc", mssql.VarChar(250), numero_correlativo)
                    .input("erp_itemov", mssql.VarChar(250), i+1)
                    .input("erp_codart", mssql.VarChar(250), rowid.Codigo)
                    .input("erp_nomart", mssql.VarChar(250), rowid.Nombre)
                    .input("erp_codund", mssql.VarChar(250), rowid.Codigo_Unidad)
                    .input("erp_canmov", mssql.VarChar(250), rowid.Cantidad)
                    .input("erp_codune", mssql.VarChar(250), '00')
                    .input("erp_codcen", mssql.VarChar(250), '00')
                    .input("erp_codot", mssql.VarChar(250), '00')
                    .input("erp_motreq", mssql.VarChar(250), req.body.motivo_requerimiento)
                    .input("erp_numreq", mssql.VarChar(250), req.body.numero_requerimiento)
                    .input("erp_itereq", mssql.VarChar(250), i+1)
                    .input("barticulo", mssql.VarChar(250), rowid.Barticulo)
                    .query("INSERT INTO erp_precotizaciond( \n"+
                        " erp_codemp, \n"+
                        " erp_codptv, \n"+
                        " erp_numprc, \n"+
                        " erp_itemov, \n"+
                        " erp_codart, \n"+
                        " erp_nomart, \n"+
                        " erp_codund, \n"+
                        " erp_canmov, \n"+
                        " erp_codune, \n"+
                        " erp_codcen, \n"+
                        " erp_codot, \n"+
                        " erp_motreq, \n"+
                        " erp_numreq, \n"+
                        " erp_itereq, \n"+
                        " barticulo) \n"+
                        " VALUES( \n"+
                        " @erp_codemp, \n"+
                        " @erp_codptv, \n"+
                        " @erp_numprc, \n"+
                        " @erp_itemov, \n"+
                        " @erp_codart, \n"+
                        " @erp_nomart, \n"+
                        " @erp_codund, \n"+
                        " @erp_canmov, \n"+
                        " @erp_codune, \n"+
                        " @erp_codcen, \n"+
                        " @erp_codot, \n"+
                        " @erp_motreq, \n"+
                        " @erp_numreq, \n"+
                        " @erp_itereq, \n"+
                        " @barticulo)")
                };                
                //#endregion
                
                //#region Actualización del correlativo automatico
                if(req.body.automatico=="A"){
                    serie_motivo = numero_correlativo.substr(-20,4)
                    numero_motivo = numero_correlativo.substr(-4)

                    const request_correlativo = new mssql.Request(transaction);
                    await request_correlativo
                     .input("erp_codemp", mssql.VarChar(250), codigo_empresa)
                     .input("erp_codmot", mssql.VarChar(250), req.body.motivo)
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

router.post('/modificar', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.user.codigo_punto_venta;
        const usuario = req.user.codigo_usuario;

        var filas_detalle = JSON.parse(req.body.filas_detalle)
        
        const pool = await poolPromise;
        const transaction = await new mssql.Transaction(pool);
        await transaction.begin(async err => {
            try{
                //#region Modificar la cabecera
                const request_cabecera  = new mssql.Request(transaction);
                const result_cabecera = await request_cabecera 
                .input("erp_codemp", mssql.VarChar(250), codigo_empresa)
                .input("erp_codptv", mssql.VarChar(250), codigo_punto_venta)
                .input("erp_numprc", mssql.VarChar(250), req.body.numero_correlativo)
                .input("erp_codres", mssql.VarChar(250), req.body.codigo_responsable)
                .input("erp_fecdoc", mssql.VarChar(250), req.body.fecha_doc)
                .input("erp_estdoc", mssql.VarChar(250), req.body.estado)
                .input("erp_glomov", mssql.VarChar(250), req.body.glosa)
                .input("erp_autman", mssql.VarChar(250), req.body.automatico)
                .input("erp_numref", mssql.VarChar(250), req.body.numero_requerimiento)
                // .input("subtotal_sin_descuentos", mssql.VarChar(250), req.body.subtotal_sin_descuentos)
                // .input("erp_Ddescuento", mssql.VarChar(250), req.body.erp_Ddescuento)
                // .input("erp_Dsubtotal", mssql.VarChar(250), req.body.erp_Dsubtotal)
                // .input("erp_Digv", mssql.VarChar(250), req.body.erp_Digv)
                // .input("erp_Dimporte", mssql.VarChar(250), req.body.erp_Dimporte)
                // .input("erp_Dpercepcion", mssql.VarChar(250), req.body.erp_Dpercepcion)
                // .input("erp_Dtotal", mssql.VarChar(250), req.body.erp_Dtotal)
                .query("UPDATE erp_precotizacionc SET \n"+
                        " erp_codres = @erp_codres, \n"+
                        " erp_fecdoc = @erp_fecdoc, \n"+
                        " erp_estdoc = @erp_estdoc, \n"+
                        " erp_glomov = @erp_glomov, \n"+
                        " erp_autman = @erp_autman, \n"+
                        " erp_numref = @erp_numref \n"+
                        " where erp_codemp = @erp_codemp and \n"+
                        " erp_codptv = @erp_codptv and \n"+
                        " erp_numprc = @erp_numprc"  )
                //#endregion

                if(result_cabecera.rowsAffected>0){
                    //#region Borrar detalle
                    const request_detalle_borrar  = new mssql.Request(transaction);
                    await request_detalle_borrar
                    .input("erp_codemp", mssql.VarChar(250), codigo_empresa)
                    .input("erp_codptv", mssql.VarChar(250), codigo_punto_venta)
                    .input("erp_numprc", mssql.VarChar(250), req.body.numero_correlativo)
                    .query("DELETE FROM erp_precotizaciond WHERE erp_codemp =@erp_codemp and erp_codptv = @erp_codptv and erp_numprc = @erp_numprc")
                    //#endregion
                    //#region Grabar detalle   

                    for (let i= 0; i< filas_detalle.length; i++){
                        rowid = filas_detalle[i];
                        const request_detalle_registrar  = new mssql.Request(transaction);
                        await request_detalle_registrar
                        .input("erp_codemp", mssql.VarChar(250), codigo_empresa)
                        .input("erp_codptv", mssql.VarChar(250), codigo_punto_venta)
                        .input("erp_numprc", mssql.VarChar(250), req.body.numero_correlativo)
                        .input("erp_itemov", mssql.VarChar(250), i+1)
                        .input("erp_codart", mssql.VarChar(250), rowid.Codigo)
                        .input("erp_nomart", mssql.VarChar(250), rowid.Nombre)
                        .input("erp_codund", mssql.VarChar(250), rowid.Codigo_Unidad)
                        .input("erp_canmov", mssql.VarChar(250), rowid.Cantidad)
                        .input("erp_codune", mssql.VarChar(250), '00')
                        .input("erp_codcen", mssql.VarChar(250), '00')
                        .input("erp_codot", mssql.VarChar(250), '00')
                        .input("erp_motreq", mssql.VarChar(250), req.body.motivo_requerimiento)
                        .input("erp_numreq", mssql.VarChar(250), req.body.numero_requerimiento)
                        .input("erp_itereq", mssql.VarChar(250), i+1)
                        .input("barticulo", mssql.VarChar(250), rowid.Barticulo)
                        // .input("nbaseimpon", mssql.VarChar(250), rowid.Base_Imponible)
                        // .input("nigvcalc", mssql.VarChar(250), rowid.Igv)
                        // .input("base_calculada", mssql.VarChar(250), rowid.Base_Calculada)
                        // .input("monto_descuento", mssql.VarChar(250), rowid.Monto_Descuento)
                        // .input("nporcdesc", mssql.VarChar(250), rowid.Monto_Descuento)
                        // .input("nprecio_importe", mssql.VarChar(250), rowid.Importe)
                        .query("INSERT INTO erp_precotizaciond( \n"+
                            " erp_codemp, \n"+
                            " erp_codptv, \n"+
                            " erp_numprc, \n"+
                            " erp_itemov, \n"+
                            " erp_codart, \n"+
                            " erp_nomart, \n"+
                            " erp_codund, \n"+
                            " erp_canmov, \n"+
                            " erp_codune, \n"+
                            " erp_codcen, \n"+
                            " erp_codot, \n"+
                            " erp_motreq, \n"+
                            " erp_numreq, \n"+
                            " erp_itereq, \n"+
                            " barticulo) \n"+
                            " VALUES( \n"+
                            " @erp_codemp, \n"+
                            " @erp_codptv, \n"+
                            " @erp_numprc, \n"+
                            " @erp_itemov, \n"+
                            " @erp_codart, \n"+
                            " @erp_nomart, \n"+
                            " @erp_codund, \n"+
                            " @erp_canmov, \n"+
                            " @erp_codune, \n"+
                            " @erp_codcen, \n"+
                            " @erp_codot, \n"+
                            " @erp_motreq, \n"+
                            " @erp_numreq, \n"+
                            " @erp_itereq, \n"+
                            " @barticulo)")
                    };                          
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
                .input("erp_codemp", mssql.VarChar(250), codigo_empresa)
                .input("erp_codptv", mssql.VarChar(250), codigo_punto_venta)
                .input("erp_numprc", mssql.VarChar(250), req.body.numero_correlativo)
                .query("DELETE FROM erp_precotizaciond WHERE erp_codemp =@erp_codemp and erp_codptv = @erp_codptv and erp_numprc = @erp_numprc")
                
                const request_cabecera = new mssql.Request(transaction);
                await request_cabecera 
                .input("erp_codemp", mssql.VarChar(250), codigo_empresa)
                .input("erp_codptv", mssql.VarChar(250), codigo_punto_venta)
                .input("erp_numprc", mssql.VarChar(250), req.body.numero_correlativo)
                .query("DELETE FROM erp_precotizacionc WHERE erp_codemp =@erp_codemp and erp_codptv = @erp_codptv and erp_numprc = @erp_numprc")
                
                if( req.body.automatico == "A") {
                    serie_motivo = req.body.numero_correlativo.substr(-20,4)
                    numero_motivo = req.body.numero_correlativo.substr(-4) - 1

                    const request_automatico = new mssql.Request(transaction);
                    await request_automatico 
                    .input("erp_codemp", mssql.VarChar(150), codigo_empresa)
                    .input("erp_codmot", mssql.VarChar(150), 'RCT')
                    .input("erp_sermot", mssql.VarChar(150), serie_motivo)
                    .input("erp_nummot", mssql.VarChar(150), parseInt(numero_motivo))
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

router.post('/anular', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.user.codigo_punto_venta;
        
        const pool = await poolPromise
        const Detalle = await pool
        .request()
        .input("erp_codemp", mssql.VarChar(250), codigo_empresa)
        .input("erp_codptv", mssql.VarChar(250), codigo_punto_venta)
        .input("erp_numprc", mssql.VarChar(250), req.body.numero_correlativo)
        .query("Update erp_precotizacionc set erp_estdoc = 'Anulado' \n"+
        "where  erp_codemp = @erp_codemp and erp_codptv =@erp_codptv and erp_numprc = @erp_numprc")

        res.send({estado: true, codigo: 0, mensaje: ""});
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
                var opcion = "and MONTH(erp_precotizacionc.erp_fecdoc) = @mes AND YEAR(erp_precotizacionc.erp_fecdoc) = @anio \n"
                break;
            case "rango_fechas":
                var opcion = "and erp_precotizacionc.erp_fecdoc between @fecha_inicio and @fecha_final \n"
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
        .query("select \n"+
            " Halmacen.cnom_almacen as Punto_Venta, \n"+
            " '' as Tipo_Compra, \n"+
            " ''as Tipo_Documento, \n"+
            " '' as Motivo_Serie, \n"+
            " erp_precotizacionc.erp_numprc as Numero, \n"+
            " CONVERT(VARCHAR(50),erp_precotizacionc.erp_fecdoc,103) as Fecha, \n"+
            " '' as Codigo_Proveedor, \n"+
            " '' as Nombre_Proveedor, \n"+
            " '' as Fecha_Entrega, \n"+
            " '' as Fecha_Limite, \n"+
            " '' Forma_Pago, \n"+
            " '' as Prioridad, \n"+
            " '' as Moneda, \n"+
            " '' as Tc, \n"+
            " Responsable.ccod_person as Codigo_Responsable, \n"+
            " Responsable.ape_pat +' '+ Responsable.ape_mat + ' '+ Responsable.nombres as Responsable, \n"+
            " '' as Aprobacion_1, \n"+
            " '' as Usuario_Aprobacion_1, \n"+
            " '' as Aprobacion_2, \n"+
            " '' as Usuario_Aprobacion_2, \n"+
            " erp_precotizacionc.erp_estdoc as Estado, \n"+
            " '' as Atencion, \n"+
            " '' as Porcentaje, \n"+
            " 'REQ' as Documento_Referencia, \n"+
            " '' as Serie_Notivo_Referencia, \n"+
            " erp_precotizacionc.erp_numref as Numero_Referencia, \n"+
            " erp_precotizacionc.erp_glomov as glosa, \n"+
            " '' as si_igv, \n"+
            " '' as Codigo_Unidad_Negocio, \n"+
            " '' as Unidad_Negocio, \n"+
            " '' as Cencos, \n"+
            " '' as Ot, \n"+
            " '' as Codigo_Agencia, \n"+
            " '' as Nombre_Cencos, \n"+
            " '' as Nombre_Motivo, \n"+
            " '' as Porc_Descuento, \n"+
            " '' Telefono_Proveedor, \n"+
            " '' as Codigo_Contacto, \n"+
            " '' as Nombre_Contacto, \n"+
            " '' as Correo_Proveedor, \n"+
            " '' as Dias_Forma_Pago, \n"+
            " '' as Sub_Total_Sin_Descuentos, \n"+
            " '' as Monto_Descuento, \n"+
            " '' as Sub_Total, \n"+
            " '' as Igv, \n"+
            " '' as Total, \n"+
            " '' as Codigo_Cliente, \n"+
            " '' as Nombre_Cliente, \n"+
            " '' as Punto_Llegada, \n"+
            " '' as Proveedor_Direccion, \n"+
            " '' as Usuario, \n"+
            " '' as Nombre_Pc, \n"+
            " '' as Pc_Fecha, \n"+
            " '' as Pc_Ip, \n"+
            " '' as Numero_Expediente, \n"+
            " '' as Comentario, \n"+
            " erp_precotizacionc.erp_codptv as Codigo_Punto_Venta, \n"+
            " '' as Codigo_Motivo_Serie, \n"+
            " '' as Codigo_Tipo_Documento \n"+
            " FROM erp_precotizacionc \n"+
            " left Join Hperson as Responsable \n"+
            " On erp_precotizacionc.erp_codemp = Responsable.ccod_empresa and \n"+
            " case erp_precotizacionc.erp_codres when '00' then '00' else erp_precotizacionc.erp_codres end = Responsable.ccod_person \n"+
            " Inner Join Halmacen \n"+
            " On erp_precotizacionc.erp_codemp = Halmacen.ccod_empresa and \n"+
            " erp_precotizacionc.erp_codptv = Halmacen.ccod_almacen \n"+
            " Where erp_precotizacionc.erp_codemp = @codigo_empresa  \n"+opcion+
            " Order by erp_precotizacionc.erp_numprc desc , erp_precotizacionc.erp_fecdoc");
          
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/consultar', async (req, res) => {
    try {

        const codigo_empresa = req.user.codigo_empresa
        const numero_documento = req.body.numero_documento;
        var codigo_punto_venta = req.body.codigo_punto_venta;

        if(codigo_punto_venta==""){
            codigo_punto_venta = req.user.codigo_punto_venta;
        }
        const pool = await poolPromise
        var lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(150), codigo_punto_venta)
        .input('numero_documento', mssql.VarChar(150), numero_documento)
        .query(
         " select \n"+
         " 'PRE-COTIZACION' as documento_nombre, \n"+
         " erp_precotizacionc.erp_numprc as documento_numero, \n"+
         " Halmacen.cnom_almacen as documento_punto_venta_nombre, \n"+
         " CONVERT(VARCHAR,erp_fecdoc,103) as documento_fecha, \n"+
         " erp_precotizacionc.erp_codemp as Codigo_Empresa, \n"+
         " erp_precotizacionc.erp_codptv as Punto_Venta, \n"+
         " erp_precotizacionc.erp_numprc as Numero_Documento, \n"+
         " erp_codres as Codigo_Responsable, \n"+
         " CONVERT(VARCHAR,erp_fecdoc,23) as Fecha_Documento, \n"+
         " erp_estdoc as Estado_Documento, \n"+
         " erp_glomov as Glosa, \n"+
         " erp_glomov as documento_glosa, \n"+
         " erp_autman as Automatico, \n"+
         " '' as usuario_codigo, \n"+
         "(Responsable.ape_pat+' '+Responsable.ape_mat+' '+Responsable.nombres) as documento_nombre_responsable, \n"+
         " 0 as documento_subtotal_sin_descuentos, \n"+
         " 0 as documento_descuento, \n"+
         " 0 as documento_subtotal, \n"+
         " 0 as documento_igv, \n"+
         " 0 as documento_importe, \n"+
         " 0 as documento_percepcion, \n"+
         " 0 as documento_total, \n"+
         " --Detalle \n"+
         " erp_precotizaciond.erp_itemov as detalle_orden, \n"+
         " erp_precotizaciond.erp_codart as articulo_codigo, \n"+
         " erp_precotizaciond.erp_nomart as articulo_nombre, \n"+
         " erp_precotizaciond.erp_codund as articulo_unidad, \n"+
         " --erp_precotizaciond.nigv as articulo_igv_porcentaje, \n"+
         " --erp_precotizaciond.factor as articulo_factor, \n"+
         " --erp_precotizaciond.ncantidad as articulo_kardex, \n"+
         " erp_precotizaciond.erp_canmov as articulo_cantidad, \n"+
         " 0 as articulo_precio, \n"+
         " 0 as articulo_igv, \n"+
         " '' as articulo_descuento1, \n"+
         " erp_precotizaciond.barticulo as articulo_barticulo, \n"+
         " --erp_precotizaciond.cantidad_presentacion as articulo_presentacion_cantidad, \n"+
         " --erp_precotizaciond.nombre_presentacion as articulo_presentacion_nombre, \n"+
         " --erp_precotizaciond.unidad_presentacion as articulo_presentacion_unidad, \n"+
         " 0 as articulo_presentacion_precio, \n"+
         " 0 as articulo_base_imponible, \n"+
         " 0 as articulo_base_calculada, \n"+
         " 0 as articulo_monto_descuento, \n"+
         " 0 as articulo_importe, \n"+
         " 0 as articulo_precio_original, \n"+
         " '0' as articulo_descuento3, \n"+
         " '0' as articulo_descuento4, \n"+
         " 0 as articulo_base_calculada_dec, \n"+
         " 0 as articulo_base_imponible_dec, \n"+
         " 0 as articulo_igv_dec, \n"+
         " 0 as articulo_importe_dec, \n"+
         " --erp_precotizaciond.codigo_presentacion as articulo_presentacion_codigo, \n"+
         " (select SUM(erp_canmov) from erp_precotizaciond \n"+
         " where erp_precotizaciond.erp_codemp = @codigo_empresa and \n"+
         " erp_precotizaciond.erp_codptv = @codigo_punto_venta and \n"+
         " erp_precotizaciond.erp_numprc = @numero_documento) as documento_total_productos,\n"+
         " erp_numref as Numero_Requerimiento, \n"+
         "--Empresa \n"+
         " Hempresa.ccod_empresa as empresa_codigo, \n"+
         " Hempresa.crazonsocial as empresa_razon_social, \n"+
         " Hempresa.rutadelogo as empresa_ruta_logo, \n"+
         " Hempresa.fax_3 as empresa_logo, \n"+
         " hempresa.nro_cuenta_mn as empresa_cuenta1, \n"+
         " hempresa.nro_cuenta_me as empresa_cuenta2, \n"+
         " hempresa.ctelefono as empresa_telefono, \n"+
         " hempresa.cpag_web as empresa_web, \n"+
         " hempresa.cnum_ruc as empresa_ruc, \n"+
         " hempresa.cdireccion as empresa_direccion, \n"+
         " hempresa.cemail as empresa_correo \n"+
         " from  erp_precotizacionc \n"+
         " inner join erp_precotizaciond on\n"+
         " erp_precotizacionc.erp_codemp = erp_precotizaciond.erp_codemp and\n"+
         " erp_precotizacionc.erp_codptv = erp_precotizaciond.erp_codptv and \n"+
         " erp_precotizacionc.erp_numprc = erp_precotizaciond.erp_numprc\n"+
         " inner join Hempresa on \n"+
         " erp_precotizacionc.erp_codemp = Hempresa.ccod_empresa \n"+
         " inner join Halmacen on \n"+
         " Halmacen.ccod_empresa = erp_precotizacionc.erp_codemp and \n"+
         " Halmacen.ccod_almacen = erp_precotizacionc.erp_codptv \n"+
         " inner join Hperson Responsable on \n"+
         " erp_precotizacionc.erp_codemp = Responsable.ccod_empresa \n"+
         " and erp_precotizacionc.erp_codres = Responsable.ccod_person\n"+
         " where erp_precotizacionc.erp_codemp = @codigo_empresa and erp_precotizacionc.erp_codptv = @codigo_punto_venta and \n"+
         " erp_precotizacionc.erp_numprc = @numero_documento \n"
        );

        const recordset = lista.recordset;
        res.json(recordset);
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/pre_cotizaciones_pendientes', async (req, res) => {
    try {

        const codigo_empresa = req.user.codigo_empresa
        var codigo_punto_venta = req.user.codigo_punto_venta;

        if(codigo_punto_venta==""){
            codigo_punto_venta = req.user.codigo_punto_venta;
        }
        const pool = await poolPromise
        var lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(150), codigo_punto_venta)
        .query("SELECT 'Pre-cotizaciones' as Titulo, \n"+
        " RTRim(LTrim((CASE erp_glomov WHEN '' THEN erp_precotizacionc.erp_numprc + ' del ' + CAST(erp_fecdoc AS VARCHAR(12)) ELSE erp_glomov END ))) as Glosa, \n"+
        " erp_precotizacionc.erp_numprc as Numero, \n"+
        " (hperson.ape_pat +' '+ hperson.ape_mat +' '+ hperson.nombres ) AS Responsable, \n"+
        " CONVERT(VARCHAR,erp_fecdoc,103) as Fecha, \n"+
        " erp_precotizacionc.erp_codptv as Punto_Venta \n"+
        " FROM erp_precotizacionc INNER JOIN hperson ON \n"+
        " erp_precotizacionc.erp_codemp = hperson.ccod_empresa AND \n"+
        " erp_precotizacionc.erp_codres = hperson.ccod_person \n"+
        " WHERE erp_precotizacionc.erp_codemp = @codigo_empresa AND \n"+
        " erp_estdoc	 <> 'Anulado' AND \n"+
        " erp_precotizacionc.erp_codptv  = @codigo_punto_venta and \n"+
        " 'Precotizacion'='Precotizacion' and ( \n"+
        " select isnull ( COUNT(*) , 0 )  from erp_precotizacion_proveedoresd \n"+
        " WHERE  erp_codemp  = 	@codigo_empresa	AND \n"+
        " erp_codptv	=	@codigo_punto_venta	AND \n"+
        " erp_numprc	=	erp_precotizacionc.erp_numprc	and \n"+
        " erp_booapr   =   '1' ) = 0 order by erp_numprc desc");

        const recordset = lista.recordset;
        console.log(recordset);
        res.json(recordset);
    } catch (err) {
        res.send(err.message);
    }
});

module.exports = router;