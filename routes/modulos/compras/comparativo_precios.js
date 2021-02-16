const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../../database');

router.post('/configuraciones', async (req, res) => {
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .query("select moneda_trabajo, mas_igv, ctipo_cambio from Hconfiguraciones_2 where idempresa=@codigo_empresa ");
  
    const recordset = lista.recordset;
    res.json(recordset);
});

router.post('/detalle', async (req, res) => {
    try{
        const codigo_empresa = req.user.codigo_empresa;
        // const motivo_documento = '022';
        // const numero_documento = '2020-00002';
        // const codigo_punto_venta = '001';
        var numero_documento = req.body.numero_documento;
        var codigo_punto_venta = req.body.codigo_punto_venta;
        if(codigo_punto_venta == null || codigo_punto_venta.trim()===''){
            codigo_punto_venta = req.user.codigo_punto_venta;
        }

        if (numero_documento === undefined) {
            numero_documento == '0';
        }
        
        const pool = await poolPromise;
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('numero_documento', mssql.VarChar(250), numero_documento)
        .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
        .query("SELECT erp_codart as Codigo, \n"+
            " erp_nomart as Nombre, \n"+
            " erp_codund as Unidad, \n"+
            " erp_canmov as Cantidad, \n"+
            " erp_itemov	as Item, \n"+
            " (SELECT erp_precotizacion_proveedoresd.erp_premov FROM erp_precotizacion_proveedoresd  \n"+
            "     WHERE erp_precotizacion_proveedoresd.erp_codemp	=	erp_precotizaciond.erp_codemp	AND \n"+
            "     erp_precotizacion_proveedoresd.erp_codptv			=	erp_precotizaciond.erp_codptv		AND \n"+
            "     erp_precotizacion_proveedoresd.erp_numprc			=	erp_precotizaciond.erp_numprc	AND \n"+
            "     erp_precotizacion_proveedoresd.erp_iteprc			=	1 AND \n"+
            "     erp_precotizacion_proveedoresd.erp_itedet			=	erp_precotizaciond.erp_itemov) AS Proveedor_1, \n"+
            " (SELECT erp_precotizacion_proveedoresd.erp_premov FROM erp_precotizacion_proveedoresd  \n"+
            "     WHERE erp_precotizacion_proveedoresd.erp_codemp	=	erp_precotizaciond.erp_codemp	AND \n"+
            "     erp_precotizacion_proveedoresd.erp_codptv			=	erp_precotizaciond.erp_codptv		AND \n"+
            "     erp_precotizacion_proveedoresd.erp_numprc			=	erp_precotizaciond.erp_numprc	AND \n"+
            "     erp_precotizacion_proveedoresd.erp_iteprc			=	2 AND \n"+
            "     erp_precotizacion_proveedoresd.erp_itedet			=	erp_precotizaciond.erp_itemov) AS Proveedor_2, \n"+
            " (SELECT erp_precotizacion_proveedoresd.erp_premov FROM erp_precotizacion_proveedoresd  \n"+
            "     WHERE erp_precotizacion_proveedoresd.erp_codemp	=	erp_precotizaciond.erp_codemp	AND \n"+
            "     erp_precotizacion_proveedoresd.erp_codptv			=	erp_precotizaciond.erp_codptv		AND \n"+
            "     erp_precotizacion_proveedoresd.erp_numprc			=	erp_precotizaciond.erp_numprc	AND \n"+
            "     erp_precotizacion_proveedoresd.erp_iteprc			=	3 AND \n"+
            "     erp_precotizacion_proveedoresd.erp_itedet			=	erp_precotizaciond.erp_itemov) AS Proveedor_3, \n"+
            " (SELECT erp_precotizacion_proveedoresd.erp_premov FROM erp_precotizacion_proveedoresd  \n"+
            "     WHERE erp_precotizacion_proveedoresd.erp_codemp	=	erp_precotizaciond.erp_codemp	AND \n"+
            "     erp_precotizacion_proveedoresd.erp_codptv			=	erp_precotizaciond.erp_codptv		AND \n"+
            "     erp_precotizacion_proveedoresd.erp_numprc			=	erp_precotizaciond.erp_numprc	AND \n"+
            "     erp_precotizacion_proveedoresd.erp_iteprc			=	4 AND \n"+
            "     erp_precotizacion_proveedoresd.erp_itedet			=	erp_precotizaciond.erp_itemov) AS Proveedor_4, \n"+
            " (SELECT erp_precotizacion_proveedoresd.erp_premov FROM erp_precotizacion_proveedoresd  \n"+
            "     WHERE erp_precotizacion_proveedoresd.erp_codemp	=	erp_precotizaciond.erp_codemp	AND \n"+
            "     erp_precotizacion_proveedoresd.erp_codptv			=	erp_precotizaciond.erp_codptv		AND \n"+
            "     erp_precotizacion_proveedoresd.erp_numprc			=	erp_precotizaciond.erp_numprc	AND \n"+
            "     erp_precotizacion_proveedoresd.erp_iteprc			=	5 AND \n"+
            "     erp_precotizacion_proveedoresd.erp_itedet			=	erp_precotizaciond.erp_itemov) AS Proveedor_5, \n"+
            " '' as texto, \n"+
            " ISNULL((SELECT cnom_proveedor \n"+
            " FROM erp_precotizacion_proveedoresc INNER JOIN Hproveed ON \n"+
            "      erp_precotizacion_proveedoresc.erp_codemp = Hproveed.ccod_empresa AND \n"+
            "      erp_precotizacion_proveedoresc.erp_codpro = Hproveed.ccod_proveedor \n"+
            " WHERE erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND  \n"+
            " erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 1) ,' ') as Nombre_Proveedor_1, \n"+
            " ISNULL((SELECT cnom_proveedor \n"+
            " FROM erp_precotizacion_proveedoresc INNER JOIN Hproveed ON \n"+
            "      erp_precotizacion_proveedoresc.erp_codemp = Hproveed.ccod_empresa AND \n"+
            "      erp_precotizacion_proveedoresc.erp_codpro = Hproveed.ccod_proveedor \n"+
            " WHERE erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND  \n"+
            " erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 2),' ') as Nombre_Proveedor_2, \n"+
            " ISNULL((SELECT cnom_proveedor \n"+
            " FROM erp_precotizacion_proveedoresc INNER JOIN Hproveed ON \n"+
            "      erp_precotizacion_proveedoresc.erp_codemp = Hproveed.ccod_empresa AND \n"+
            "      erp_precotizacion_proveedoresc.erp_codpro = Hproveed.ccod_proveedor \n"+
            " WHERE erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND  \n"+
            " erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 3),' ') as Nombre_Proveedor_3, \n"+
            " ISNULL((SELECT cnom_proveedor \n"+
            " FROM erp_precotizacion_proveedoresc INNER JOIN Hproveed ON \n"+
            "      erp_precotizacion_proveedoresc.erp_codemp = Hproveed.ccod_empresa AND \n"+
            "      erp_precotizacion_proveedoresc.erp_codpro = Hproveed.ccod_proveedor \n"+
            " WHERE erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND  \n"+
            " erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 4),' ') as Nombre_Proveedor_4, \n"+
            " ISNULL((SELECT cnom_proveedor \n"+
            " FROM erp_precotizacion_proveedoresc INNER JOIN Hproveed ON \n"+
            "      erp_precotizacion_proveedoresc.erp_codemp = Hproveed.ccod_empresa AND \n"+
            "      erp_precotizacion_proveedoresc.erp_codpro = Hproveed.ccod_proveedor \n"+
            " WHERE erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND  \n"+
            " erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 5),' ') as Nombre_Proveedor_5, \n"+
            " erp_precotizaciond.barticulo As Barticulo, \n"+
            "(SELECT erp_precotizacion_proveedoresd.erp_booapr FROM erp_precotizacion_proveedoresd  \n"+
            "WHERE erp_precotizacion_proveedoresd.erp_codemp	=	erp_precotizaciond.erp_codemp	AND \n"+
            "erp_precotizacion_proveedoresd.erp_codptv			=	erp_precotizaciond.erp_codptv		AND \n"+
            "erp_precotizacion_proveedoresd.erp_numprc			=	erp_precotizaciond.erp_numprc	AND \n"+
            "erp_precotizacion_proveedoresd.erp_iteprc			=	1 AND \n"+
            "erp_precotizacion_proveedoresd.erp_itedet			=	erp_precotizaciond.erp_itemov) AS Aprobado_1, \n"+
            "(SELECT erp_precotizacion_proveedoresd.erp_booapr FROM erp_precotizacion_proveedoresd  \n"+
            "WHERE erp_precotizacion_proveedoresd.erp_codemp	=	erp_precotizaciond.erp_codemp	AND \n"+
            "erp_precotizacion_proveedoresd.erp_codptv			=	erp_precotizaciond.erp_codptv		AND \n"+
            "erp_precotizacion_proveedoresd.erp_numprc			=	erp_precotizaciond.erp_numprc	AND \n"+
            "erp_precotizacion_proveedoresd.erp_iteprc			=	2 AND \n"+
            "erp_precotizacion_proveedoresd.erp_itedet			=	erp_precotizaciond.erp_itemov) AS Aprobado_2, \n"+
            "(SELECT erp_precotizacion_proveedoresd.erp_booapr FROM erp_precotizacion_proveedoresd  \n"+
            "WHERE erp_precotizacion_proveedoresd.erp_codemp	=	erp_precotizaciond.erp_codemp	AND \n"+
            "erp_precotizacion_proveedoresd.erp_codptv			=	erp_precotizaciond.erp_codptv		AND \n"+
            "erp_precotizacion_proveedoresd.erp_numprc			=	erp_precotizaciond.erp_numprc	AND \n"+
            "erp_precotizacion_proveedoresd.erp_iteprc			=	3 AND \n"+
            "erp_precotizacion_proveedoresd.erp_itedet			=	erp_precotizaciond.erp_itemov) AS Aprobado_3, \n"+
            "(SELECT erp_precotizacion_proveedoresd.erp_booapr FROM erp_precotizacion_proveedoresd  \n"+
            "WHERE erp_precotizacion_proveedoresd.erp_codemp	=	erp_precotizaciond.erp_codemp	AND \n"+
            "erp_precotizacion_proveedoresd.erp_codptv			=	erp_precotizaciond.erp_codptv		AND \n"+
            "erp_precotizacion_proveedoresd.erp_numprc			=	erp_precotizaciond.erp_numprc	AND \n"+
            "erp_precotizacion_proveedoresd.erp_iteprc			=	4 AND \n"+
            "erp_precotizacion_proveedoresd.erp_itedet			=	erp_precotizaciond.erp_itemov) AS Aprobado_4, \n"+
            "(SELECT erp_precotizacion_proveedoresd.erp_booapr FROM erp_precotizacion_proveedoresd  \n"+
            "WHERE erp_precotizacion_proveedoresd.erp_codemp	=	erp_precotizaciond.erp_codemp	AND \n"+
            "erp_precotizacion_proveedoresd.erp_codptv			=	erp_precotizaciond.erp_codptv		AND \n"+
            "erp_precotizacion_proveedoresd.erp_numprc			=	erp_precotizaciond.erp_numprc	AND \n"+
            "erp_precotizacion_proveedoresd.erp_iteprc			=	5 AND \n"+
            "erp_precotizacion_proveedoresd.erp_itedet			=	erp_precotizaciond.erp_itemov) AS Aprobado_5\n"+
            " FROM erp_precotizaciond \n"+
            " WHERE erp_codemp 	=  @codigo_empresa AND  \n"+
            "           erp_codptv 	= @codigo_punto_venta AND \n"+
            "           erp_numprc 	= @numero_documento \n"+
            " ORDER BY erp_itemov ");

        
        const recordset = lista.recordset;
        res.json(recordset);
    }catch(e){
        console.log(e.message);
        res.send(e.message);
    }
});

router.post('/guardar', async (req, res) => {
    try {

        const codigo_empresa = req.user.codigo_empresa;
        const codigo_punto_venta = req.user.codigo_punto_venta;
        const usuario = req.user.codigo_usuario;
        var filas_cabezera = JSON.parse(req.body.filas_cabezera);
        var filas_detalle = JSON.parse(req.body.filas_detalle)
        
        const pool = await poolPromise;
        const transaction = await new mssql.Transaction(pool);
        await transaction.begin(async err => {
            try{

                const request_eliminar = new mssql.Request(transaction);
                await request_eliminar
                .input("erp_codemp", mssql.VarChar(250), codigo_empresa)
                .input("erp_codptv", mssql.VarChar(250), codigo_punto_venta)
                .input("erp_numprc", mssql.VarChar(250), req.body.numero_documento)
                .query(
                "delete from erp_precotizacion_proveedoresd where erp_codemp = @erp_codemp and erp_codptv = @erp_codptv and erp_numprc = @erp_numprc \n"+
                "delete from erp_precotizacion_proveedoresc where erp_codemp = @erp_codemp and erp_codptv = @erp_codptv and erp_numprc = @erp_numprc"
                )
                
                //#region Registro de la cabecera
                for (let i= 0; i< filas_cabezera.length; i++){
                    rowid = filas_cabezera[i];
                   const request_cabecera = new mssql.Request(transaction);
                    await request_cabecera
                    .input("erp_codemp", mssql.VarChar(250), codigo_empresa)
                    .input("erp_codptv", mssql.VarChar(250), codigo_punto_venta)
                    .input("erp_numprc", mssql.VarChar(250), req.body.numero_documento)
                    .input("erp_iteprc", mssql.VarChar(250), i+1)
                    .input("erp_codpro", mssql.VarChar(250), rowid.codigo_proveedor == '' ? '00': rowid.codigo_proveedor)
                    .input("erp_codfpa", mssql.VarChar(250), rowid.codigo_forma_pago == ''? '00': rowid.codigo_forma_pago )
                    .input("erp_diaent", mssql.VarChar(250), rowid.dias_entrega == ''? '0': rowid.dias_entrega)
                    .input("erp_obsprc", mssql.VarChar(250), rowid.observacion)
                    .input("erp_moneda", mssql.VarChar(250), rowid.moneda == '' ? 'S/': rowid.moneda)
                    .query("INSERT INTO erp_precotizacion_proveedoresc ( \n"+
                        " erp_codemp , \n"+
                        " erp_codptv , \n"+
                        " erp_numprc , \n"+
                        " erp_iteprc , \n"+
                        " erp_codpro , \n"+
                        " erp_codfpa , \n"+
                        " erp_diaent , \n"+
                        " erp_obsprc , \n"+
                        " erp_moneda ) \n"+
                        " VALUES ( \n"+
                        " @erp_codemp ,\n"+
                        " @erp_codptv ,\n"+
                        " @erp_numprc ,\n"+
                        " @erp_iteprc ,\n"+
                        " @erp_codpro ,\n"+
                        " @erp_codfpa ,\n"+
                        " @erp_diaent ,\n"+
                        " @erp_obsprc ,\n"+
                        " @erp_moneda )" )
                };   
                
                //#region Registro del detalle
               for (let i= 0; i< filas_detalle.length; i++){
                    rowid = filas_detalle[i];
                    for(let j=1; j<6;j++){
                        var proveedor = rowid["Proveedor_"+j];
                        var request_detalle = new mssql.Request(transaction);
                        await request_detalle
                        .input("codigo_empresa", mssql.VarChar(250), codigo_empresa)
                        .input("codigo_punto_venta", mssql.VarChar(250), codigo_punto_venta)
                        .input("nitem_articulo", mssql.VarChar(250), i+1)
                        .input("numero_pre_cotizacion", mssql.VarChar(250), req.body.numero_documento)
                        .input("nitem", mssql.VarChar(250), j)
                        .input("precio_proveedor", mssql.VarChar(250), proveedor  )
                        .input("aprobado", mssql.VarChar(250), 'N')
                        .query("INSERT INTO erp_precotizacion_proveedoresd( \n"+
                            "erp_codemp, \n"+
                            "erp_codptv, \n"+
                            "erp_numprc, \n"+
                            "erp_iteprc, \n"+
                            "erp_itedet, \n"+
                            "erp_premov, \n"+
                            "erp_booapr) \n"+
                            "VALUES \n"+
                            "( \n"+
                            "@codigo_empresa, \n"+
                            "@codigo_punto_venta, \n"+
                            "@numero_pre_cotizacion, \n"+
                            "@nitem, \n"+
                            "@nitem_articulo, \n"+
                            "@precio_proveedor, \n"+
                            "@aprobado \n"+
                            ")"
                            )
                    }
                };            
                //#endregion
            
                transaction.commit(tErr => {if(tErr) {console.log(tErr)}})
                res.send({estado: true, mensaje: ""});
            }catch(err){
                transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
                res.send({estado: false, codigo: "Err", mensaje: err.message});
            }
        });    
    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
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
          " SELECT  \n"+
          "'CUADRO COMPARATIVO' as documento_nombre, \n"+
          " erp_codart as articulo_codigo, \n"+
          " erp_nomart as articulo_nombre, \n"+
          " Ltrim(Rtrim(erp_codund )) as articulo_unidad, \n"+
          " erp_canmov as articulo_cantidad, \n"+
          " erp_itemov	as item, \n"+
          " (SELECT erp_precotizacion_proveedoresd.erp_premov FROM erp_precotizacion_proveedoresd  \n"+
          " WHERE erp_precotizacion_proveedoresd.erp_codemp	=	erp_precotizaciond.erp_codemp	AND \n"+
          "      erp_precotizacion_proveedoresd.erp_codptv			=	erp_precotizaciond.erp_codptv		AND \n"+
          "      erp_precotizacion_proveedoresd.erp_numprc			=	erp_precotizaciond.erp_numprc	AND \n"+
          "      erp_precotizacion_proveedoresd.erp_iteprc			=	1 AND \n"+
          "      erp_precotizacion_proveedoresd.erp_itedet			=	erp_precotizaciond.erp_itemov) AS precio1, \n"+
          " (SELECT erp_precotizacion_proveedoresd.erp_premov FROM erp_precotizacion_proveedoresd  \n"+
          " WHERE erp_precotizacion_proveedoresd.erp_codemp	=	erp_precotizaciond.erp_codemp	AND \n"+
          "      erp_precotizacion_proveedoresd.erp_codptv			=	erp_precotizaciond.erp_codptv		AND \n"+
          "      erp_precotizacion_proveedoresd.erp_numprc			=	erp_precotizaciond.erp_numprc	AND \n"+
          "      erp_precotizacion_proveedoresd.erp_iteprc			=	2 AND \n"+
          "      erp_precotizacion_proveedoresd.erp_itedet			=	erp_precotizaciond.erp_itemov) AS precio2, \n"+
          " (SELECT erp_precotizacion_proveedoresd.erp_premov FROM erp_precotizacion_proveedoresd  \n"+
          " WHERE erp_precotizacion_proveedoresd.erp_codemp	=	erp_precotizaciond.erp_codemp	AND \n"+
          "      erp_precotizacion_proveedoresd.erp_codptv			=	erp_precotizaciond.erp_codptv		AND \n"+
          "      erp_precotizacion_proveedoresd.erp_numprc			=	erp_precotizaciond.erp_numprc	AND \n"+
          "      erp_precotizacion_proveedoresd.erp_iteprc			=	3 AND \n"+
          "      erp_precotizacion_proveedoresd.erp_itedet			=	erp_precotizaciond.erp_itemov) AS precio3, \n"+
          " (SELECT erp_precotizacion_proveedoresd.erp_premov FROM erp_precotizacion_proveedoresd  \n"+
          " WHERE erp_precotizacion_proveedoresd.erp_codemp	=	erp_precotizaciond.erp_codemp	AND \n"+
          "      erp_precotizacion_proveedoresd.erp_codptv			=	erp_precotizaciond.erp_codptv		AND \n"+
          "      erp_precotizacion_proveedoresd.erp_numprc			=	erp_precotizaciond.erp_numprc	AND \n"+
          "      erp_precotizacion_proveedoresd.erp_iteprc			=	4 AND \n"+
          "      erp_precotizacion_proveedoresd.erp_itedet			=	erp_precotizaciond.erp_itemov) AS precio4, \n"+
          " '' as texto, \n"+
          " ISNULL((SELECT cnom_proveedor \n"+
          " FROM erp_precotizacion_proveedoresc INNER JOIN Hproveed ON \n"+
          "      erp_precotizacion_proveedoresc.erp_codemp = Hproveed.ccod_empresa AND \n"+
          "      erp_precotizacion_proveedoresc.erp_codpro = Hproveed.ccod_proveedor \n"+
          " WHERE erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 1) ,'Proveedor 1') as nombre1, \n"+
          " ISNULL((SELECT cnom_proveedor \n"+
          " FROM erp_precotizacion_proveedoresc INNER JOIN Hproveed ON \n"+
          "      erp_precotizacion_proveedoresc.erp_codemp = Hproveed.ccod_empresa AND \n"+
          "      erp_precotizacion_proveedoresc.erp_codpro = Hproveed.ccod_proveedor \n"+
          " WHERE erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 2),'Proveedor 2') as nombre2, \n"+
          " ISNULL((SELECT cnom_proveedor \n"+
          " FROM erp_precotizacion_proveedoresc INNER JOIN Hproveed ON \n"+
          "      erp_precotizacion_proveedoresc.erp_codemp = Hproveed.ccod_empresa AND \n"+
          "      erp_precotizacion_proveedoresc.erp_codpro = Hproveed.ccod_proveedor \n"+
          " WHERE erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 3),'Proveedor 3') as nombre3, \n"+
          " ISNULL((SELECT cnom_proveedor \n"+
          " FROM erp_precotizacion_proveedoresc INNER JOIN Hproveed ON \n"+
          "      erp_precotizacion_proveedoresc.erp_codemp = Hproveed.ccod_empresa AND \n"+
          "      erp_precotizacion_proveedoresc.erp_codpro = Hproveed.ccod_proveedor \n"+
          " WHERE erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 4),'Proveedor 4') as nombre4, \n"+
          " erp_precotizaciond.barticulo As barticulo, \n"+
          " (Select Isnull(erp_obsprc,'')  \n"+
          "     From erp_precotizacion_proveedoresc \n"+
          "     Where erp_codemp = @codigo_empresa And Erp_Codptv = @codigo_punto_venta and erp_numprc = @numero_documento And erp_iteprc = 1) As Observacion_01, \n"+
          " (Select Isnull(erp_obsprc,'')  \n"+
          "     From erp_precotizacion_proveedoresc \n"+
          "     Where erp_codemp = @codigo_empresa And Erp_Codptv = @codigo_punto_venta and erp_numprc = @numero_documento And erp_iteprc = 2) As Observacion_02, \n"+
          " (Select Isnull(erp_obsprc,'')  \n"+
          "     From erp_precotizacion_proveedoresc \n"+
          "     Where erp_codemp = @codigo_empresa And Erp_Codptv = @codigo_punto_venta and erp_numprc = @numero_documento And erp_iteprc = 3) As Observacion_03, \n"+
          " (Select Isnull(erp_obsprc,'')  \n"+
          "     From erp_precotizacion_proveedoresc \n"+
          "     Where erp_codemp = @codigo_empresa And Erp_Codptv = @codigo_punto_venta and erp_numprc = @numero_documento And erp_iteprc = 4) As Observacion_04, \n"+
          " (select Isnull(Hfor_pag.cnom_forpago,'')  \n"+
          "     from erp_precotizacion_proveedoresc inner join Hfor_pag on erp_precotizacion_proveedoresc.erp_codemp = Hfor_pag.ccod_empresa and erp_precotizacion_proveedoresc.erp_codfpa = Hfor_pag.ccod_forpago \n"+
          "     WHERE erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 1) as f_pago1, \n"+
          " (select Isnull(Hfor_pag.cnom_forpago,'')  \n"+
          "     from erp_precotizacion_proveedoresc inner join Hfor_pag on erp_precotizacion_proveedoresc.erp_codemp = Hfor_pag.ccod_empresa and erp_precotizacion_proveedoresc.erp_codfpa = Hfor_pag.ccod_forpago \n"+
          "     WHERE erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 2) as f_pago2, \n"+
          " (select Isnull(Hfor_pag.cnom_forpago,'')  \n"+
          "     from erp_precotizacion_proveedoresc inner join Hfor_pag on erp_precotizacion_proveedoresc.erp_codemp = Hfor_pag.ccod_empresa and erp_precotizacion_proveedoresc.erp_codfpa = Hfor_pag.ccod_forpago \n"+
          "     WHERE erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 3) as f_pago3, \n"+
          " (select Isnull(Hfor_pag.cnom_forpago,'')  \n"+
          "     from erp_precotizacion_proveedoresc inner join Hfor_pag on erp_precotizacion_proveedoresc.erp_codemp = Hfor_pag.ccod_empresa and erp_precotizacion_proveedoresc.erp_codfpa = Hfor_pag.ccod_forpago \n"+
          "     WHERE erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 4) as f_pago4, \n"+
          " (select Isnull(erp_diaent,'') from erp_precotizacion_proveedoresc \n"+
          "     WHERE erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 1) as d_entrega1, \n"+
          " (select Isnull(erp_diaent,'') from erp_precotizacion_proveedoresc \n"+
          "     WHERE erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 2) as d_entrega2, \n"+
          " (select Isnull(erp_diaent,'') from erp_precotizacion_proveedoresc \n"+
          "     WHERE erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 3) as d_entrega3, \n"+
          " (select Isnull(erp_diaent,'') from erp_precotizacion_proveedoresc \n"+
          "     WHERE erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 4) as d_entrega4, \n"+
          " (select  Isnull(Hcontacto_proveed.erp_nomcont,'')   \n"+
          "     from erp_precotizacion_proveedoresc  \n"+
          "     inner join Hproveed on erp_precotizacion_proveedoresc.erp_codemp = Hproveed.ccod_empresa and erp_precotizacion_proveedoresc.erp_codpro = Hproveed.ccod_proveedor \n"+
          "     inner join Hcontacto_proveed on erp_precotizacion_proveedoresc.erp_codemp = Hcontacto_proveed.erp_codemp and erp_precotizacion_proveedoresc.erp_codpro = Hcontacto_proveed.erp_codproveed \n"+
          "     where erp_precotizacion_proveedoresc.erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc  \n"+
          "     AND erp_iteprc = 1 AND Hcontacto_proveed.Erp_Predeterminado = 'S') as contacto_proveedor1, \n"+
          " (select  Isnull(Hcontacto_proveed.erp_nomcont,'') \n"+
          "     from erp_precotizacion_proveedoresc  \n"+
          "     inner join Hproveed on erp_precotizacion_proveedoresc.erp_codemp = Hproveed.ccod_empresa and erp_precotizacion_proveedoresc.erp_codpro = Hproveed.ccod_proveedor \n"+
          "     inner join Hcontacto_proveed on erp_precotizacion_proveedoresc.erp_codemp = Hcontacto_proveed.erp_codemp and erp_precotizacion_proveedoresc.erp_codpro = Hcontacto_proveed.erp_codproveed \n"+
          "     where erp_precotizacion_proveedoresc.erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc  \n"+
          "     AND erp_iteprc = 2 AND Hcontacto_proveed.Erp_Predeterminado = 'S') as contacto_proveedor2, \n"+
          " (select  Isnull(Hcontacto_proveed.erp_nomcont,'') \n"+
          "     from erp_precotizacion_proveedoresc  \n"+
          "     inner join Hproveed on erp_precotizacion_proveedoresc.erp_codemp = Hproveed.ccod_empresa and erp_precotizacion_proveedoresc.erp_codpro = Hproveed.ccod_proveedor \n"+
          "     inner join Hcontacto_proveed on erp_precotizacion_proveedoresc.erp_codemp = Hcontacto_proveed.erp_codemp and erp_precotizacion_proveedoresc.erp_codpro = Hcontacto_proveed.erp_codproveed \n"+
          "     where erp_precotizacion_proveedoresc.erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc  \n"+
          "     AND erp_iteprc = 3 AND Hcontacto_proveed.Erp_Predeterminado = 'S') as contacto_proveedor3, \n"+
          " (select  Isnull(Hcontacto_proveed.erp_nomcont,'') \n"+
          "     from erp_precotizacion_proveedoresc  \n"+
          "     inner join Hproveed on erp_precotizacion_proveedoresc.erp_codemp = Hproveed.ccod_empresa and erp_precotizacion_proveedoresc.erp_codpro = Hproveed.ccod_proveedor \n"+
          "     inner join Hcontacto_proveed on erp_precotizacion_proveedoresc.erp_codemp = Hcontacto_proveed.erp_codemp and erp_precotizacion_proveedoresc.erp_codpro = Hcontacto_proveed.erp_codproveed \n"+
          "     where erp_precotizacion_proveedoresc.erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc  \n"+
          "     AND erp_iteprc = 4 AND Hcontacto_proveed.Erp_Predeterminado = 'S') as contacto_proveedor4, \n"+
          " (select  Isnull( Hcontacto_proveed.erp_telefono1,'')   \n"+
          "     from erp_precotizacion_proveedoresc  \n"+
          "     inner join Hproveed on erp_precotizacion_proveedoresc.erp_codemp = Hproveed.ccod_empresa and erp_precotizacion_proveedoresc.erp_codpro = Hproveed.ccod_proveedor \n"+
          "     inner join Hcontacto_proveed on erp_precotizacion_proveedoresc.erp_codemp = Hcontacto_proveed.erp_codemp and erp_precotizacion_proveedoresc.erp_codpro = Hcontacto_proveed.erp_codproveed \n"+
          "     where erp_precotizacion_proveedoresc.erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc  \n"+
          "     AND erp_iteprc = 1 AND Hcontacto_proveed.Erp_Predeterminado = 'S') as telefono_proveedor1, \n"+
          " (select  Isnull( Hcontacto_proveed.erp_telefono1,'')  \n"+
          "     from erp_precotizacion_proveedoresc  \n"+
          "     inner join Hproveed on erp_precotizacion_proveedoresc.erp_codemp = Hproveed.ccod_empresa and erp_precotizacion_proveedoresc.erp_codpro = Hproveed.ccod_proveedor \n"+
          "     inner join Hcontacto_proveed on erp_precotizacion_proveedoresc.erp_codemp = Hcontacto_proveed.erp_codemp and erp_precotizacion_proveedoresc.erp_codpro = Hcontacto_proveed.erp_codproveed \n"+
          "     where erp_precotizacion_proveedoresc.erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc  \n"+
          "     AND erp_iteprc = 2 AND Hcontacto_proveed.Erp_Predeterminado = 'S') as telefono_proveedor2, \n"+
          " (select Isnull( Hcontacto_proveed.erp_telefono1,'')    \n"+
          "     from erp_precotizacion_proveedoresc  \n"+
          "     inner join Hproveed on erp_precotizacion_proveedoresc.erp_codemp = Hproveed.ccod_empresa and erp_precotizacion_proveedoresc.erp_codpro = Hproveed.ccod_proveedor \n"+
          "     inner join Hcontacto_proveed on erp_precotizacion_proveedoresc.erp_codemp = Hcontacto_proveed.erp_codemp and erp_precotizacion_proveedoresc.erp_codpro = Hcontacto_proveed.erp_codproveed \n"+
          "     where erp_precotizacion_proveedoresc.erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc  \n"+
          "     AND erp_iteprc = 3 AND Hcontacto_proveed.Erp_Predeterminado = 'S') as telefono_proveedor3, \n"+
          " (select Isnull( Hcontacto_proveed.erp_telefono1,'')   \n"+
          "     from erp_precotizacion_proveedoresc  \n"+
          "     inner join Hproveed on erp_precotizacion_proveedoresc.erp_codemp = Hproveed.ccod_empresa and erp_precotizacion_proveedoresc.erp_codpro = Hproveed.ccod_proveedor \n"+
          "     inner join Hcontacto_proveed on erp_precotizacion_proveedoresc.erp_codemp = Hcontacto_proveed.erp_codemp and erp_precotizacion_proveedoresc.erp_codpro = Hcontacto_proveed.erp_codproveed \n"+
          "     where erp_precotizacion_proveedoresc.erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc  \n"+
          "     AND erp_iteprc = 4 AND Hcontacto_proveed.Erp_Predeterminado = 'S') as telefono_proveedor4, \n"+
          " (select top 1 Isnull(Comentario,'')  \n"+
          "     from erp_precotizacion_proveedoresc  \n"+
          "     inner join Hproveed_historial on erp_precotizacion_proveedoresc.erp_codemp = Hproveed_historial.ccod_empresa and erp_precotizacion_proveedoresc.erp_codpro = Hproveed_historial.ccod_proveedor \n"+
          "     where erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 1) as comentario_historial1, \n"+
          " (select top 1 Isnull(Comentario,'')  \n"+
          "     from erp_precotizacion_proveedoresc  \n"+
          "     inner join Hproveed_historial on erp_precotizacion_proveedoresc.erp_codemp = Hproveed_historial.ccod_empresa and erp_precotizacion_proveedoresc.erp_codpro = Hproveed_historial.ccod_proveedor \n"+
          "     where erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 2) as comentario_historial2, \n"+
          " (select top 1 Isnull(Comentario,'')  \n"+
          "     from erp_precotizacion_proveedoresc  \n"+
          "     inner join Hproveed_historial on erp_precotizacion_proveedoresc.erp_codemp = Hproveed_historial.ccod_empresa and erp_precotizacion_proveedoresc.erp_codpro = Hproveed_historial.ccod_proveedor \n"+
          "     where erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 3) as comentario_historial3, \n"+
          " (select top 1 Isnull(Comentario,'')  \n"+
          "     from erp_precotizacion_proveedoresc  \n"+
          "     inner join Hproveed_historial on erp_precotizacion_proveedoresc.erp_codemp = Hproveed_historial.ccod_empresa and erp_precotizacion_proveedoresc.erp_codpro = Hproveed_historial.ccod_proveedor \n"+
          "     where erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 4) as comentario_historial4, \n"+
          " (select top 1 Isnull(convert(varchar,fecha,103),'')  \n"+
          "     from erp_precotizacion_proveedoresc  \n"+
          "     inner join Hproveed_historial on erp_precotizacion_proveedoresc.erp_codemp = Hproveed_historial.ccod_empresa and erp_precotizacion_proveedoresc.erp_codpro = Hproveed_historial.ccod_proveedor \n"+
          "     where erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 1) as fecha_historial1, \n"+
          " (select top 1 Isnull(convert(varchar,fecha,103),'')  \n"+
          "     from erp_precotizacion_proveedoresc  \n"+
          "     inner join Hproveed_historial on erp_precotizacion_proveedoresc.erp_codemp = Hproveed_historial.ccod_empresa and erp_precotizacion_proveedoresc.erp_codpro = Hproveed_historial.ccod_proveedor \n"+
          "     where erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 2) as fecha_historial2, \n"+
          " (select top 1 Isnull(convert(varchar,fecha,103),'')  \n"+
          "     from erp_precotizacion_proveedoresc  \n"+
          "     inner join Hproveed_historial on erp_precotizacion_proveedoresc.erp_codemp = Hproveed_historial.ccod_empresa and erp_precotizacion_proveedoresc.erp_codpro = Hproveed_historial.ccod_proveedor \n"+
          "     where erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 3) as fecha_historial3, \n"+
          " (select top 1 Isnull(convert(varchar,fecha,103),'')  \n"+
          "     from erp_precotizacion_proveedoresc  \n"+
          "     inner join Hproveed_historial on erp_precotizacion_proveedoresc.erp_codemp = Hproveed_historial.ccod_empresa and erp_precotizacion_proveedoresc.erp_codpro = Hproveed_historial.ccod_proveedor \n"+
          "     where erp_codemp = erp_precotizaciond.erp_codemp AND erp_codptv = erp_precotizaciond.erp_codptv AND erp_numprc = erp_precotizaciond.erp_numprc AND erp_iteprc = 4) as fecha_historial4, \n"+
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
          " hempresa.cemail as empresa_correo, \n"+
          " '' as usuario_codigo, \n"+
          " 0 as articulo_precio, \n"+
          " 0 as articulo_igv, \n"+
          " 0 as articulo_importe, \n"+
          " (select SUM(erp_canmov) from erp_precotizaciond \n"+
          " WHERE erp_codemp 	= @codigo_empresa AND   \n"+
          " erp_codptv 	= @codigo_punto_venta AND  \n"+
          " erp_numprc 	= @numero_documento ) as documento_total_productos \n"+
          " --(select erp_rutpdf  \n"+
          " --    from erp_precotizacion_proveedoresc  \n"+
          " --    inner join erp_precotizacion_proveedores_imgs  \n"+
          " --    on erp_precotizacion_proveedoresc.erp_codemp = erp_precotizacion_proveedores_imgs.erp_codemp \n"+
          " --    and erp_precotizacion_proveedoresc.erp_codptv = erp_precotizacion_proveedores_imgs.erp_codptv \n"+
          " --    and erp_precotizacion_proveedoresc.erp_numprc = erp_precotizacion_proveedores_imgs.erp_numprc \n"+
          " --    and erp_precotizacion_proveedoresc.erp_iteprc = erp_precotizacion_proveedores_imgs.erp_iteprc \n"+
          " --    where erp_precotizacion_proveedoresc.erp_codemp = erp_precotizaciond.erp_codemp AND erp_precotizacion_proveedoresc.erp_codptv = erp_precotizaciond.erp_codptv  \n"+
          " --    AND erp_precotizacion_proveedoresc.erp_numprc = erp_precotizaciond.erp_numprc AND erp_precotizacion_proveedoresc.erp_iteprc = 1) as ruta1, \n"+
          " --(select erp_rutpdf  \n"+
          " --    from erp_precotizacion_proveedoresc  \n"+
          " --    inner join erp_precotizacion_proveedores_imgs  \n"+
          " --    on erp_precotizacion_proveedoresc.erp_codemp = erp_precotizacion_proveedores_imgs.erp_codemp \n"+
          " --    and erp_precotizacion_proveedoresc.erp_codptv = erp_precotizacion_proveedores_imgs.erp_codptv \n"+
          " --    and erp_precotizacion_proveedoresc.erp_numprc = erp_precotizacion_proveedores_imgs.erp_numprc \n"+
          " --    and erp_precotizacion_proveedoresc.erp_iteprc = erp_precotizacion_proveedores_imgs.erp_iteprc \n"+
          " --    where erp_precotizacion_proveedoresc.erp_codemp = erp_precotizaciond.erp_codemp AND erp_precotizacion_proveedoresc.erp_codptv = erp_precotizaciond.erp_codptv  \n"+
          " --    AND erp_precotizacion_proveedoresc.erp_numprc = erp_precotizaciond.erp_numprc AND erp_precotizacion_proveedoresc.erp_iteprc = 2) as ruta2, \n"+
          " --(select erp_rutpdf  \n"+
          " --    from erp_precotizacion_proveedoresc  \n"+
          " --    inner join erp_precotizacion_proveedores_imgs  \n"+
          " --    on erp_precotizacion_proveedoresc.erp_codemp = erp_precotizacion_proveedores_imgs.erp_codemp \n"+
          " --    and erp_precotizacion_proveedoresc.erp_codptv = erp_precotizacion_proveedores_imgs.erp_codptv \n"+
          " --    and erp_precotizacion_proveedoresc.erp_numprc = erp_precotizacion_proveedores_imgs.erp_numprc \n"+
          " --    and erp_precotizacion_proveedoresc.erp_iteprc = erp_precotizacion_proveedores_imgs.erp_iteprc \n"+
          " --    where erp_precotizacion_proveedoresc.erp_codemp = erp_precotizaciond.erp_codemp AND erp_precotizacion_proveedoresc.erp_codptv = erp_precotizaciond.erp_codptv  \n"+
          " --    AND erp_precotizacion_proveedoresc.erp_numprc = erp_precotizaciond.erp_numprc AND erp_precotizacion_proveedoresc.erp_iteprc = 3) as ruta3, \n"+
          " --(select erp_rutpdf  \n"+
          " --    from erp_precotizacion_proveedoresc  \n"+
          " --    inner join erp_precotizacion_proveedores_imgs  \n"+
          " --    on erp_precotizacion_proveedoresc.erp_codemp = erp_precotizacion_proveedores_imgs.erp_codemp \n"+
          " --    and erp_precotizacion_proveedoresc.erp_codptv = erp_precotizacion_proveedores_imgs.erp_codptv \n"+
          " --    and erp_precotizacion_proveedoresc.erp_numprc = erp_precotizacion_proveedores_imgs.erp_numprc \n"+
          " --    and erp_precotizacion_proveedoresc.erp_iteprc = erp_precotizacion_proveedores_imgs.erp_iteprc \n"+
          " --    where erp_precotizacion_proveedoresc.erp_codemp = erp_precotizaciond.erp_codemp AND erp_precotizacion_proveedoresc.erp_codptv = erp_precotizaciond.erp_codptv  \n"+
          " --    AND erp_precotizacion_proveedoresc.erp_numprc = erp_precotizaciond.erp_numprc AND erp_precotizacion_proveedoresc.erp_iteprc = 4) as ruta4 \n"+
          " FROM erp_precotizaciond Inner Join HEmpresa \n"+
          " On erp_precotizaciond.erp_codemp 	= HEmpresa.Ccod_Empresa \n"+
          " WHERE erp_codemp 	= @codigo_empresa AND  \n"+
          "           erp_codptv 	= @codigo_punto_venta AND \n"+
          "           erp_numprc 	= @numero_documento \n"+
          "  ORDER BY erp_itemov \n"
        );
        const recordset = lista.recordset;
        res.json(recordset);
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/consultar_comparativo', async (req, res) => {
    try {

        const codigo_empresa = req.user.codigo_empresa
        const numero_documento = req.body.numero_documento;
        var codigo_punto_venta = req.body.codigo_punto_venta;

        if(codigo_punto_venta==null || codigo_punto_venta==""){
            codigo_punto_venta = req.user.codigo_punto_venta;
        }
        const pool = await poolPromise
        var lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(150), codigo_punto_venta)
        .input('numero_documento', mssql.VarChar(150), numero_documento)
        .query(
            "select  \n"+
            "erp_iteprc as item, \n"+
            "erp_codpro as codigo_proveedor, \n"+
            "Hproveed.cnom_proveedor as nombre_proveedor, \n"+
            "RTRIM(LTRIM(erp_codfpa)) as codigo_forma_pago, \n"+
            "erp_diaent as dias_entrega,  \n"+
            "erp_obsprc as observacion,  \n"+
            "erp_moneda as moneda,  \n"+
            "CONVERT(VARCHAR,fecha_pc,103) as fecha_pc  \n"+
            "from erp_precotizacion_proveedoresc  \n"+
            "inner join Hproveed on  \n"+
            "erp_precotizacion_proveedoresc.erp_codemp = Hproveed.ccod_empresa and \n"+
            "erp_precotizacion_proveedoresc.erp_codpro = Hproveed.ccod_proveedor \n"+
            "where \n"+
            "erp_codemp=@codigo_empresa  \n"+
            "and erp_codptv=@codigo_punto_venta \n"+
            "and erp_numprc=@numero_documento "
        );

        const recordset = lista.recordset;
        res.json(recordset);
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/cabezera_aprobacion_comparativo_precios', async (req, res) => {
    try {

        const codigo_empresa = req.user.codigo_empresa
        const numero_documento = req.body.numero_documento;
        var codigo_punto_venta = req.body.codigo_punto_venta;

        if(codigo_punto_venta==null || codigo_punto_venta==""){
            codigo_punto_venta = req.user.codigo_punto_venta;
        }
        const pool = await poolPromise
        var lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(150), codigo_punto_venta)
        .input('numero_documento', mssql.VarChar(150), numero_documento)
        .query("exec dbo.sq_logaprobacion_precotizacion_imgs @codigo_empresa, @codigo_punto_venta, @numero_documento");

        const recordset = lista.recordset;
        res.json(recordset);
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/comparativo_precios_pendientes', async (req, res) => {
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
        .input('Estado', mssql.VarChar(150), req.body.estado)
        .query("select titulo as Titulo, \n"+
        " Glosa, \n"+
        " Numero, \n"+
        " Responsable, \n"+
        " fecha as Fecha, \n"+
        " pto_venta as Punto_Venta from  \n"+
        " (SELECT 'Pre-cotizaciones' as titulo, \n"+
        " RTRim(LTrim((CASE erp_glomov WHEN '' THEN erp_precotizacionc.erp_numprc + ' del ' + CAST(erp_fecdoc AS VARCHAR(12)) ELSE erp_glomov END ))) as Glosa, \n"+
        " erp_precotizacionc.erp_numprc as Numero, \n"+
        " LTrim(RTrim(hperson.ape_pat))+' '+LTrim(RTrim(hperson.ape_mat))+', ' +LTrim(RTrim(hperson.nombres)) AS Responsable, \n"+
        " erp_fecdoc as fecha, \n"+
        " erp_precotizacionc.erp_codptv as pto_venta \n"+
        " FROM erp_precotizacionc INNER JOIN hperson ON \n"+
        " erp_precotizacionc.erp_codemp = hperson.ccod_empresa AND \n"+
        " erp_precotizacionc.erp_codres = hperson.ccod_person \n"+
        " INNER JOIN erp_precotizacion_proveedoresc ON \n"+
        " erp_precotizacion_proveedoresc.erp_codemp = erp_precotizacionc.erp_codemp AND \n"+
        " erp_precotizacion_proveedoresc.erp_codptv = erp_precotizacionc.erp_codptv AND \n"+
        " erp_precotizacion_proveedoresc.erp_numprc = erp_precotizacionc.erp_numprc and \n"+
        " erp_precotizacion_proveedoresc.erp_iteprc = 1 \n"+
        " WHERE erp_precotizacionc.erp_codemp = @codigo_empresa AND erp_estdoc	 <> 'Anulado' AND erp_precotizacionc.erp_codptv  = @codigo_punto_venta \n"+
        " and @Estado='Sin Aprobacion' \n"+
        " and erp_precotizacion_proveedoresc.erp_numprc not in ( \n"+
        " select erp_precotizacion_proveedoresd.erp_numprc from  erp_precotizacion_proveedoresd where \n"+
        " erp_precotizacion_proveedoresd.erp_codptv = erp_precotizacionc.erp_codptv \n"+
        " and erp_precotizacion_proveedoresd.erp_codemp = erp_precotizacionc.erp_codemp \n"+
        " and erp_precotizacion_proveedoresd.erp_booapr = '1') \n"+
        " union all \n"+
        " SELECT 'Pre-cotizaciones' as titulo, \n"+
        " RTRim(LTrim((CASE erp_glomov WHEN '' THEN erp_precotizacionc.erp_numprc + ' del ' + CAST(erp_fecdoc AS VARCHAR(12)) ELSE erp_glomov END ))) as Glosa, \n"+
        " erp_precotizacionc.erp_numprc as Numero, \n"+
        " LTrim(RTrim(hperson.ape_pat))+' '+LTrim(RTrim(hperson.ape_mat))+', ' +LTrim(RTrim(hperson.nombres)) AS Responsable, \n"+
        " erp_fecdoc as fecha, \n"+
        " erp_precotizacionc.erp_codptv as pto_venta \n"+
        " FROM erp_precotizacionc INNER JOIN hperson ON \n"+
        " erp_precotizacionc.erp_codemp = hperson.ccod_empresa AND \n"+
        " erp_precotizacionc.erp_codres = hperson.ccod_person \n"+
        " WHERE erp_precotizacionc.erp_codemp = @codigo_empresa AND erp_estdoc	 <> 'Anulado' AND erp_precotizacionc.erp_codptv  = @codigo_punto_venta \n"+
        " and erp_precotizacionc.erp_numprc  in (select erp_precotizacion_proveedoresd.erp_numprc from  erp_precotizacion_proveedoresd where \n"+
        " erp_precotizacion_proveedoresd.erp_codptv = erp_precotizacionc.erp_codptv \n"+
        " and erp_precotizacion_proveedoresd.erp_codemp = erp_precotizacionc.erp_codemp \n"+
        " and erp_precotizacion_proveedoresd.erp_booapr = '1') \n"+
        " and @Estado='Aprobado' \n"+
        " union all \n"+
        " SELECT 'Pre-cotizaciones' as titulo, \n"+
        " RTRim(LTrim((CASE erp_glomov WHEN '' THEN erp_precotizacionc.erp_numprc + ' del ' + CAST(erp_fecdoc AS VARCHAR(12)) ELSE erp_glomov END ))) as Glosa, \n"+
        " erp_precotizacionc.erp_numprc as Numero, \n"+
        " LTrim(RTrim(hperson.ape_pat))+' '+LTrim(RTrim(hperson.ape_mat))+', ' +LTrim(RTrim(hperson.nombres)) AS Responsable, \n"+
        " erp_fecdoc as fecha, \n"+
        " erp_precotizacionc.erp_codptv as pto_venta \n"+
        " FROM erp_precotizacionc INNER JOIN hperson ON \n"+
        " erp_precotizacionc.erp_codemp = hperson.ccod_empresa AND \n"+
        " erp_precotizacionc.erp_codres = hperson.ccod_person \n"+
        " WHERE erp_precotizacionc.erp_codemp = @codigo_empresa AND erp_estdoc	 <> 'Anulado' AND erp_precotizacionc.erp_codptv  = @codigo_punto_venta \n"+
        " and @Estado='(Todos)' \n"+
        " union all \n"+
        " SELECT 'Pre-cotizaciones' as titulo, \n"+
        " RTRim(LTrim((CASE erp_glomov WHEN '' THEN erp_precotizacionc.erp_numprc + ' del ' + CAST(erp_fecdoc AS VARCHAR(12)) ELSE erp_glomov END ))) as Glosa, \n"+
        " erp_precotizacionc.erp_numprc as Numero, \n"+
        " LTrim(RTrim(hperson.ape_pat))+' '+LTrim(RTrim(hperson.ape_mat))+', ' +LTrim(RTrim(hperson.nombres)) AS Responsable, \n"+
        " erp_fecdoc as fecha, \n"+
        " erp_precotizacionc.erp_codptv as pto_venta \n"+
        " FROM erp_precotizacionc INNER JOIN hperson ON \n"+
        " erp_precotizacionc.erp_codemp = hperson.ccod_empresa AND \n"+
        " erp_precotizacionc.erp_codres = hperson.ccod_person \n"+
        " WHERE erp_precotizacionc.erp_codemp = @codigo_empresa AND erp_estdoc	 <> 'Anulado' AND erp_precotizacionc.erp_codptv  = @codigo_punto_venta \n"+
        " and @Estado='Precotizacion' \n"+
        " and ( select isnull ( COUNT(*) , 0 )  from erp_precotizacion_proveedoresd \n"+
        " WHERE  erp_codemp  = 	@codigo_empresa	AND erp_codptv	=	@codigo_punto_venta	AND    \n"+
        " erp_numprc	=	erp_precotizacionc.erp_numprc and erp_booapr   =   '1' ) = 0) as tablita \n"+
        " ORDER BY  fecha Desc,Numero DESC");

        const recordset = lista.recordset;
        res.json(recordset);
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/aprobar_comparativo_precios', async (req, res) => {
    try {

        const codigo_empresa = req.user.codigo_empresa
        const numero_documento = req.body.numero_documento;
        var codigo_punto_venta = req.body.codigo_punto_venta;
        var filas_detalle = JSON.parse(req.body.filas_detalle);
        var precio_proveedor='';

        if(codigo_punto_venta==null || codigo_punto_venta==""){
            codigo_punto_venta = req.user.codigo_punto_venta;
        }

        const pool = await poolPromise;
        const transaction = await new mssql.Transaction(pool);
        await transaction.begin(async err => {
            try{
                var request_update = new mssql.Request(transaction);
                await request_update
                .input("codigo_empresa", mssql.VarChar(250), codigo_empresa)
                .input("codigo_punto_venta", mssql.VarChar(250), codigo_punto_venta)
                .input("numero_documento", mssql.VarChar(250), numero_documento)
                .query("update erp_precotizacion_proveedoresd  \n"+
                    " SET erp_booapr ='N' \n"+
                    " WHERE erp_codemp = @codigo_empresa AND \n"+
                    " erp_codptv = @codigo_punto_venta AND \n"+
                    " erp_numprc = @numero_documento")

                for (let i= 0; i< filas_detalle.length; i++){
                    rowid = filas_detalle[i];

                    if (rowid.proveedor != '') {
                        switch (rowid.proveedor) {
                            case 4:
                                precio_proveedor = '1'
                                break;
                            case 6:
                                precio_proveedor = '2'
                                break
                            case 8:
                                precio_proveedor = '3'
                                break
                            case 10:
                                precio_proveedor = '4'
                                break
                            case 12:
                                precio_proveedor = '5'
                                break
                        }

                        var request_detalle = new mssql.Request(transaction);
                        await request_detalle
                        .input("codigo_empresa", mssql.VarChar(250), codigo_empresa)
                        .input("codigo_punto_venta", mssql.VarChar(250), codigo_punto_venta)
                        .input("numero_documento", mssql.VarChar(250), numero_documento)
                        .input("precio_proveedor", mssql.VarChar(250), precio_proveedor)
                        .input("erp_itedet", mssql.VarChar(250), rowid.nitem  )
                        .query("update erp_precotizacion_proveedoresd  \n"+
                            " SET erp_booapr ='1' \n"+
                            " WHERE erp_codemp = @codigo_empresa AND \n"+
                            " erp_codptv = @codigo_punto_venta AND \n"+
                            " erp_numprc = @numero_documento AND \n"+
                            " erp_iteprc =@precio_proveedor AND \n"+
                            " erp_itedet = @erp_itedet ")
                    }
                };      

                transaction.commit(tErr => {if(tErr) {console.log(tErr)}})
                res.send({estado: true, codigo: 0, mensaje: ""});
            }catch(err){
                transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
                res.send({estado: false, codigo: "Err", mensaje: err.message});
            }
        });
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
            " SELECT  \n"+
            " erp_precotizacion_proveedoresc.erp_codptv as Punto_Venta,  \n"+
            " 'C PRECIOS' as Tipo_Compra,  \n"+
            " '' as Tipo_Documento,  \n"+
            " '' as Codigo_Motivo_Serie,  \n"+
            " erp_precotizacion_proveedoresc.erp_numprc as Numero,  \n"+
            " (select CONVERT(VARCHAR,erp_fecdoc,103) from erp_precotizacionc where erp_codemp = @codigo_empresa and erp_codptv = @codigo_punto_venta and erp_numprc  = erp_precotizacion_proveedoresc.erp_numprc) as Fecha,  \n"+
            " LTRIM(RTRIM(erp_precotizacion_proveedoresc.erp_codpro)) as Codigo_Proveedor,  \n"+
            " hproveed.cnom_proveedor as Nombre_Proveedor,  \n"+
            " '' as Fecha_Limite,  \n"+
            " LTRIM(RTRIM(erp_precotizacion_proveedoresc.erp_codfpa)) as Forma_Pago,  \n"+
            " '' as Prioridad,  \n"+
            " erp_precotizacion_proveedoresc.erp_moneda as Moneda,  \n"+
            " '' as Tc,  \n"+
            " '00' as Cencos,  \n"+
            " '00' as Ot,  \n"+
            " '' as Responsable,  \n"+
            " '00' as Codigo_Unidad_Negocio, \n"+
            " '00' as Codigo_Agencia,  \n"+
            " '' as glosa, \n"+
            " '' as si_igv, \n"+
            " '' as Nombre_Cencos,  \n"+
            " '' as Nombre_Motivo,  \n"+
            " '' as Porc_Descuento,  \n"+
            " (SELECT pais FROM Hproveed WHERE ccod_empresa = @codigo_empresa AND ccod_proveedor = LTRIM(RTRIM(erp_precotizacion_proveedoresc.erp_codpro))) as Pais,  \n"+
            " (SELECT ctelefonos FROM Hproveed WHERE ccod_empresa = @codigo_empresa AND ccod_proveedor = LTRIM(RTRIM(erp_precotizacion_proveedoresc.erp_codpro))) as Telefono_Proveedor,  \n"+
            " LTRIM(RTRIM((Select erp_codcont From Hcontacto_proveed Where erp_codemp = @codigo_empresa And erp_codproveed = LTRIM(RTRIM(erp_precotizacion_proveedoresc.erp_codpro)) And erp_predeterminado ='S' ))) as Codigo_Contacto,  \n"+
            " LTRIM(RTRIM((Select erp_nomcont From Hcontacto_proveed Where erp_codemp = @codigo_empresa And erp_codproveed = LTRIM(RTRIM(erp_precotizacion_proveedoresc.erp_codpro)) And erp_predeterminado ='S' )))  as Nombre_Contacto,  \n"+
            " (SELECT ce_mail FROM Hproveed WHERE ccod_empresa = @codigo_empresa AND ccod_proveedor = LTRIM(RTRIM(erp_precotizacion_proveedoresc.erp_codpro))) as Correo_Proveedor,  \n"+
            " erp_precotizacion_proveedoresc.erp_diaent as Dias_Forma_Pago,  \n"+
            " '' as Sub_Total_Sin_Descuentos,  \n"+
            " '' as Monto_Descuento,  \n"+
            " '' as Sub_Total, \n"+
            " '' as Igv,  \n"+
            " '' as Total,  \n"+
            " '' as Punto_Llegada,  \n"+
            " (Select Hproveed.cdireccion From Hproveed where Hproveed.ccod_empresa = @codigo_empresa and Hproveed.ccod_proveedor = LTRIM(RTRIM(erp_precotizacion_proveedoresc.erp_codpro))) as Proveedor_Direccion,  \n"+
            " '' as Referencia_Requerimiento_Motivo,  \n"+
            " erp_precotizacion_proveedoresc.erp_numprc as Referencia_Requerimiento_Numero , \n"+
            " erp_precotizacion_proveedoresc.erp_iteprc as item, \n"+
            " 'N' as marcar, \n"+
            " (erp_precotizacion_proveedoresc.erp_codpro) as cod_proveed \n"+
            " FROM erp_precotizacion_proveedoresc WITH(NOLOCK)   \n"+
            " INNER JOIN hproveed WITH(NOLOCK) ON \n"+
            " erp_precotizacion_proveedoresc.erp_codemp = hproveed.ccod_empresa AND \n"+
            " erp_precotizacion_proveedoresc.erp_codpro = hproveed.ccod_proveedor    \n"+
            " WHERE erp_precotizacion_proveedoresc.erp_codemp  =  @codigo_empresa \n"+
            " and ( case @todos when 'S' then 0 else (select COUNT(*) from Hordcomc where ccod_empresa= @codigo_empresa and erp_motivo_req='00'  \n"+
            " and erp_precotizacion_proveedoresc.erp_codpro=Hordcomc.ccod_proveedor \n"+
            " and erp_nro_req=erp_precotizacion_proveedoresc.erp_numprc) end) =0 \n"+
            " AND (SELECT SUM(CASE erp_precotizacion_proveedoresd.erp_booapr WHEN '1' THEN 1 ELSE 0 END) \n"+
            " FROM erp_precotizacion_proveedoresd WITH(NOLOCK)  \n"+
            " WHERE erp_precotizacion_proveedoresd.erp_codemp 	= erp_precotizacion_proveedoresc.erp_codemp		AND  \n"+
            " erp_precotizacion_proveedoresd.erp_codptv 		= erp_precotizacion_proveedoresc.erp_codptv			AND \n"+
            " erp_precotizacion_proveedoresd.erp_numprc		= erp_precotizacion_proveedoresc.erp_numprc		AND \n"+
            " erp_precotizacion_proveedoresd.erp_iteprc        = erp_precotizacion_proveedoresc.erp_iteprc \n"+
            " GROUP BY erp_precotizacion_proveedoresd.erp_codemp,erp_precotizacion_proveedoresd.erp_codptv, \n"+
            " erp_precotizacion_proveedoresd.erp_numprc,erp_precotizacion_proveedoresd.erp_iteprc \n"+
            " )  > 0 \n"+
            " order by fecha_pc desc "
        );    
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send("Error: " +err.message);
    }
});

router.post('/lista_detalle_pendientes', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa
        const codigo_punto_venta = req.user.codigo_punto_venta;
        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('punto_venta', mssql.VarChar(200), req.body.punto_venta)
        .input('Codigo_Proveedor', mssql.VarChar(200), req.body.Codigo_Proveedor)
        .input('numero', mssql.VarChar(200), req.body.numero)
        .input('todos', mssql.VarChar(200), req.body.todos)
        .query("exec sq_detalle_cuadro_comparativo_2020 @codigo_empresa, @numero, @punto_venta, @Codigo_Proveedor, @todos"
        );
    
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
});

module.exports = router;