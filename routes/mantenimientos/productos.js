const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');
const { query } = require('express');
const { compare } = require('bcryptjs');

router.post('/lista', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .query(
      "select \n"+
      "harticul.ccod_articulo as Codigo, \n"+
      "harticul.cnom_articulo as Nombre, \n"+
      "0 as Cantidad, \n"+
      "Htipo_prod.nombre as Tipo_Producto, \n"+
      "Hfam_art.cnom_familia as Familia, \n"+
      "Hsubfamilia_art.cnom_subfamilia as SubFamilia, \n"+
      "erp_concepto1.erp_nomcon as Concepto1, \n"+
      "erp_concepto2.erp_nomcon as Concepto2, \n"+
      "erp_concepto3.erp_nomcon as Concepto3, \n"+
      "erp_concepto4.erp_nomcon as Concepto4, \n"+
      "erp_concepto5.erp_nomcon as Concepto5, \n"+
      "erp_concepto6.erp_nomcon as Concepto6, \n"+
      "erp_concepto7.erp_nomcon as Concepto7, \n"+
      "harticul.ubicacion1 as Ubicacion1, \n"+
      "harticul.ubicacion2 as Ubicacion2, \n"+
      "harticul.observacion as Leyenda1, \n"+
      "harticul.Erp_Observacion2 as Leyenda2, \n"+
      "harticul.ccod_interno as Codigo_Fabricante, \n"+
      "harticul.Erp_CodInterno2 as Codigo_Interno1, \n"+
      "harticul.Erp_Codinterno3 as Codigo_Interno2, \n"+
      "harticul.cod_digemir as Codigo_Digemid, \n"+
      "harticul.unspsc as Codigo_UNSPC, \n"+
      "harticul.Categoria as Categoria, \n"+
      "harticul.csistock as Control_Stock, \n"+
      "harticul.lote as Lote_SN, \n"+
      "harticul.flagserie as Serie_SN, \n"+
      "harticul.si_servicio as Servicio, \n"+
      "harticul.ccod_almacen as Codigo_Tipo_Producto, \n"+
      "harticul.cfamilia as Codigo_Familia, \n"+
      "harticul.ccod_subfamilia as Codigo_SubFamilia, \n"+
      "harticul.codmarca as Codigo_Concepto1, \n"+
      "harticul.modelo as Codigo_Concepto2, \n"+
      "harticul.color as Codigo_Concepto3, \n"+
      "harticul.tratamiento as Codigo_Concepto4, \n"+
      "harticul.fuelle as Codigo_Concepto5, \n"+
      "harticul.azas as Codigo_Concepto6, \n"+
      "harticul.solapa as Codigo_Concepto7, \n"+
      "harticul.estado as Estado, \n"+
      "harticul.nigv as Igv_Art, \n"+
      "harticul.coduni_cont as Unidad, \n"+
      "harticul.ruta_imagen as Imagen \n"+
      "from Harticul \n"+
      "inner join Htipo_prod on \n"+
      "Htipo_prod.idempresa = Harticul.ccod_empresa \n"+
      "and Htipo_prod.codigo = Harticul.ccod_almacen \n"+
      "inner join Hfam_art on \n"+
      "Hfam_art.ccod_empresa = Harticul.ccod_empresa \n"+
      "and Hfam_art.cfamilia = Harticul.cfamilia \n"+
      "inner join Hsubfamilia_art on \n"+
      "Hsubfamilia_art.ccod_empresa = Harticul.ccod_empresa \n"+
      "and Hsubfamilia_art.ccod_subfamilia = Harticul.ccod_subfamilia \n"+
      "inner join erp_concepto1 on \n"+
      "erp_concepto1.erp_codemp = Harticul.ccod_empresa \n"+
      "and erp_concepto1.erp_codcon = Harticul.codmarca \n"+
      "inner join erp_concepto2 on \n"+
      "erp_concepto2.erp_codemp = Harticul.ccod_empresa \n"+
      "and erp_concepto2.erp_codcon = Harticul.modelo \n"+
      "inner join erp_concepto3 on \n"+
      "erp_concepto3.erp_codemp = Harticul.ccod_empresa \n"+
      "and erp_concepto3.erp_codcon = Harticul.color \n"+
      "inner join erp_concepto4 on \n"+
      "erp_concepto4.erp_codemp = Harticul.ccod_empresa \n"+
      "and erp_concepto4.erp_codcon = Harticul.tratamiento \n"+
      "inner join erp_concepto5 on \n"+
      "erp_concepto5.erp_codemp = Harticul.ccod_empresa \n"+
      "and erp_concepto5.erp_codcon = Harticul.fuelle \n"+
      "inner join erp_concepto6 on \n"+
      "erp_concepto6.erp_codemp = Harticul.ccod_empresa \n"+
      "and erp_concepto6.erp_codcon = Harticul.azas \n"+
      "inner join erp_concepto7 on \n"+
      "erp_concepto7.erp_codemp = Harticul.ccod_empresa \n"+
      "and erp_concepto7.erp_codcon = Harticul.solapa \n"+
      "where Harticul.ccod_empresa=@codigo_empresa ")
    const recordset = lista.recordset;
    
    res.json(recordset); 
  } catch (err) {
    
    res.send(err.message);
  }
});

router.post('/detalle', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const codigo_punto_venta = req.user.codigo_punto_venta;
    console.log(req.body);
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_articulo', mssql.VarChar(250), req.body.codigo)
    .input('lista_precios', mssql.VarChar(250), req.body.lista_precios)
    .input('almacen', mssql.VarChar(250), req.body.almacen)
    .input('punto_venta', mssql.VarChar(250), codigo_punto_venta)
    .input('tipo_cambio', mssql.Decimal(10,4), req.body.tipo_cambio)
    .input('moneda_documento', mssql.VarChar(250), req.body.moneda_documento)
    .query(
      "select *, 0.00 as Importe, Unit as PrecioCalcular from ( SELECT \n"+
        "Harticul.ccod_articulo as Codigo, \n"+
        "LTRIM(RTRIM(erp_lista_precio_cliente.erp_unidad)) as Unidad, \n"+
        "(erp_articulo_unidad.erp_factor) as Factor, \n"+
        "erp_monto * \n"+
        "case when @moneda_documento = 'S/' then \n"+
        "case when Harticul.cmoneda_precio = 'S/' then 1 else @tipo_cambio end--Harticul.cmoneda_precio = $ \n"+
        "else --@moneda_documento = $ \n"+
        "case when Harticul.cmoneda_precio = 'S/' then 1/@tipo_cambio else 1 end--Harticul.cmoneda_precio = $ \n"+
        "end \n"+
        "as Unit, \n"+
        "(erp_lista_precio_cliente.erp_desc1) as Descuento1, \n"+
        "(erp_lista_precio_cliente.erp_desc2) as Descuento2, \n"+
        "Isnull( \n"+
        "[dbo].[UDF_STOCK]( @codigo_empresa ,@punto_venta ,@almacen,@codigo_articulo)/erp_articulo_unidad.erp_factor \n"+
        ",0) as Stock, \n"+
        "'' as Cantidad, \n"+
        "(erp_articulo_unidad.erp_iteart) as Item, \n"+
        "nstock_min as Stock_Minimo, \n"+
        "harticul.lote as Lote_SN, \n"+
        "harticul.flagserie as Serie_SN, \n"+
        "case harticul.si_icbper when 'S' then Harticul.monto_icbper else 0 end as ICBPER \n"+
        "FROM erp_lista_precio_cliente INNER JOIN harticul ON \n"+
        "erp_lista_precio_cliente.erp_codemp = harticul.ccod_empresa \n"+
        "and erp_lista_precio_cliente.erp_codart = harticul.ccod_articulo \n"+
        "inner join erp_articulo_unidad on \n"+
        "erp_lista_precio_cliente.erp_codemp=erp_articulo_unidad.erp_codemp \n"+
        "and erp_lista_precio_cliente.erp_codart=erp_articulo_unidad.erp_codart \n"+
        "and erp_lista_precio_cliente.erp_unidad=erp_articulo_unidad.erp_codund \n"+
        "and erp_lista_precio_cliente.erp_codigo_concepto=@lista_precios \n"+
        "and erp_lista_precio_cliente.erp_tipo='12' \n"+
        "WHERE \n"+
        "erp_lista_precio_cliente.erp_codemp = @codigo_empresa \n"+
        "and erp_lista_precio_cliente.erp_codart = @codigo_articulo \n"+
        "UNION \n"+
        "SELECT \n"+
        "Harticul.ccod_articulo as Codigo, \n"+
        "LTRIM(RTRIM(Harticul.cunidad)) as Unidad, \n"+
        "( harticul.cant_cont) as Factor, \n"+
        "erp_monto * \n"+
        "case when @moneda_documento = 'S/' then \n"+
        "case when Harticul.cmoneda_precio = 'S/' then 1 else @tipo_cambio end--Harticul.cmoneda_precio = $ \n"+
        "else --@moneda_documento = $ \n"+
        "case when Harticul.cmoneda_precio = 'S/' then 1/@tipo_cambio else 1 end--Harticul.cmoneda_precio = $ \n"+
        "end \n"+
        "as Unit, \n"+
        "(erp_lista_precio_cliente.erp_desc1) as Desc1, \n"+
        "(erp_lista_precio_cliente.erp_desc2) as Desc2, \n"+
        "Isnull([dbo].[UDF_STOCK]( @codigo_empresa ,@punto_venta ,@almacen,@codigo_articulo) ,0) as Stock, \n"+
        "'' as Cantidad, \n"+
        "(0) as Item, \n"+
        "nstock_min as Stock_Minimo, \n"+
        "harticul.lote as Lote_SN, \n"+
        "harticul.flagserie as Serie_SN, \n"+
        "case harticul.si_icbper when 'S' then Harticul.monto_icbper else 0 end as ICBPER \n"+
        "FROM Harticul left join erp_lista_precio_cliente on \n"+
        "harticul.ccod_empresa=erp_lista_precio_cliente.erp_codemp \n"+
        "and harticul.ccod_articulo=erp_lista_precio_cliente.erp_codart \n"+
        "and harticul.cunidad =erp_lista_precio_cliente.erp_unidad \n"+
        "and erp_lista_precio_cliente.erp_codigo_concepto=@lista_precios \n"+
        "and erp_lista_precio_cliente.erp_tipo='12' \n"+
        "WHERE \n"+
        "Harticul.ccod_empresa = @codigo_empresa \n"+
        "and Harticul.ccod_articulo = @codigo_articulo \n"+
        "and Isnull( \n"+
        "[dbo].[UDF_STOCK](@codigo_empresa,@punto_venta ,@almacen,@codigo_articulo) \n"+
        ",0) >= 0.000 \n"+
        ") as tabla ORDER BY item \n"
      );

    const recordset = lista.recordset;
    res.json(recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

router.post('/datos', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const codigo_almacen = req.user.codigo_punto_venta;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_articulo', mssql.VarChar(250), req.body.codigo)
    .input('codigo_almacen', mssql.VarChar(250), codigo_almacen)
    .query(
      "select \n"+
      "harticul.ccod_articulo as Codigo, \n"+
      "harticul.cnom_articulo as Nombre, \n"+
      "0 as Cantidad, \n"+
      "Htipo_prod.nombre as Tipo_Producto, \n"+
      "Hfam_art.cnom_familia as Familia, \n"+
      "Hsubfamilia_art.cnom_subfamilia as SubFamilia, \n"+
      "erp_concepto1.erp_nomcon as Concepto1, \n"+
      "erp_concepto2.erp_nomcon as Concepto2, \n"+
      "erp_concepto3.erp_nomcon as Concepto3, \n"+
      "erp_concepto4.erp_nomcon as Concepto4, \n"+
      "erp_concepto5.erp_nomcon as Concepto5, \n"+
      "erp_concepto6.erp_nomcon as Concepto6, \n"+
      "erp_concepto7.erp_nomcon as Concepto7, \n"+
      "harticul.ubicacion1 as Ubicacion1, \n"+
      "harticul.ubicacion2 as Ubicacion2, \n"+
      "harticul.observacion as Leyenda1, \n"+
      "harticul.Erp_Observacion2 as Leyenda2, \n"+
      "harticul.ccod_interno as Codigo_Fabricante, \n"+
      "harticul.Erp_CodInterno2 as Codigo_Interno1, \n"+
      "harticul.Erp_Codinterno3 as Codigo_Interno2, \n"+
      "harticul.cod_digemir as Codigo_Digemid, \n"+
      "harticul.unspsc as Codigo_UNSPC, \n"+
      "harticul.Categoria as Categoria, \n"+
      "harticul.csistock as Control_Stock, \n"+
      "harticul.lote as Lote, \n"+
      "harticul.flagserie as Serie, \n"+
      "harticul.si_servicio as Servicio, \n"+
      "harticul.ccod_almacen as Codigo_Tipo_Producto, \n"+
      "harticul.cfamilia as Codigo_Familia, \n"+
      "harticul.ccod_subfamilia as Codigo_SubFamilia, \n"+
      "harticul.codmarca as Codigo_Concepto1, \n"+
      "harticul.modelo as Codigo_Concepto2, \n"+
      "harticul.color as Codigo_Concepto3, \n"+
      "harticul.tratamiento as Codigo_Concepto4, \n"+
      "harticul.fuelle as Codigo_Concepto5, \n"+
      "harticul.azas as Codigo_Concepto6, \n"+
      "harticul.solapa as Codigo_Concepto7, \n"+
      "harticul.nigv as Igv_Art, \n"+
      "LTRIM(RTRIM(harticul.cunidad)) as Unidad, \n"+
      "harticul.Cant_cont as Factor, \n"+
      "Halmacen_2.ccod_almacen as Codigo_Almacen, \n"+
      "harticul.AFCT_ADV as Afecta_Advalorem, \n"+
      "harticul.PORC_ADV as Porcenteje_Advalorem, \n"+
      "Halmacen_2.cnom_almacen as Nombre_Almacen \n"+
      "from Harticul \n"+
      "inner join Htipo_prod on \n"+
      "Htipo_prod.idempresa = Harticul.ccod_empresa \n"+
      "and Htipo_prod.codigo = Harticul.ccod_almacen \n"+
      "inner join Hfam_art on \n"+
      "Hfam_art.ccod_empresa = Harticul.ccod_empresa \n"+
      "and Hfam_art.cfamilia = Harticul.cfamilia \n"+
      "inner join Hsubfamilia_art on \n"+
      "Hsubfamilia_art.ccod_empresa = Harticul.ccod_empresa \n"+
      "and Hsubfamilia_art.ccod_subfamilia = Harticul.ccod_subfamilia \n"+
      "inner join erp_concepto1 on \n"+
      "erp_concepto1.erp_codemp = Harticul.ccod_empresa \n"+
      "and erp_concepto1.erp_codcon = Harticul.codmarca \n"+
      "inner join erp_concepto2 on \n"+
      "erp_concepto2.erp_codemp = Harticul.ccod_empresa \n"+
      "and erp_concepto2.erp_codcon = Harticul.modelo \n"+
      "inner join erp_concepto3 on \n"+
      "erp_concepto3.erp_codemp = Harticul.ccod_empresa \n"+
      "and erp_concepto3.erp_codcon = Harticul.color \n"+
      "inner join erp_concepto4 on \n"+
      "erp_concepto4.erp_codemp = Harticul.ccod_empresa \n"+
      "and erp_concepto4.erp_codcon = Harticul.tratamiento \n"+
      "inner join erp_concepto5 on \n"+
      "erp_concepto5.erp_codemp = Harticul.ccod_empresa \n"+
      "and erp_concepto5.erp_codcon = Harticul.fuelle \n"+
      "inner join erp_concepto6 on \n"+
      "erp_concepto6.erp_codemp = Harticul.ccod_empresa \n"+
      "and erp_concepto6.erp_codcon = Harticul.azas \n"+
      "inner join erp_concepto7 on \n"+
      "erp_concepto7.erp_codemp = Harticul.ccod_empresa \n"+
      "and erp_concepto7.erp_codcon = Harticul.solapa \n"+
      "inner join Halmacen on \n"+
      "Halmacen.ccod_empresa = Harticul.ccod_empresa \n"+
      "inner join Halmacen_2 on \n"+
      "Halmacen_2.ccod_empresa = Harticul.ccod_empresa \n"+
      "and Halmacen_2.ccod_almacen = Halmacen.erp_codalmacen_ptovta \n"+
      "where Harticul.ccod_empresa = @codigo_empresa \n"+
      "and Harticul.ccod_articulo = @codigo_articulo \n"+
      "and Halmacen.ccod_almacen = @codigo_almacen ")
      
    const recordset = lista.recordset;
    
    res.json(recordset); 
  } catch (err) {
    res.send(err.message);
  }
});

router.post('/codigo_barra', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const codigo_almacen = req.user.codigo_punto_venta;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_barra', mssql.VarChar(250), req.body.codigo)
    .input('codigo_almacen', mssql.VarChar(250), codigo_almacen)
    .query(
      "select \n"+
      "harticul.ccod_articulo as Codigo, \n"+
      "harticul.cnom_articulo as Nombre, \n"+
      "harticul.ubicacion1 as Ubicacion1, \n"+
      "harticul.ubicacion2 as Ubicacion2, \n"+
      "harticul.observacion as Leyenda1, \n"+
      "harticul.Erp_Observacion2 as Leyenda2, \n"+
      "harticul.ccod_interno as Codigo_Fabricante, \n"+
      "harticul.Erp_CodInterno2 as Codigo_Interno1, \n"+
      "harticul.Erp_Codinterno3 as Codigo_Interno2, \n"+
      "harticul.cod_digemir as Codigo_Digemid, \n"+
      "harticul.unspsc as Codigo_UNSPC, \n"+
      "harticul.Categoria as Categoria, \n"+
      "harticul.csistock as Control_Stock, \n"+
      "harticul.lote as Lote, \n"+
      "harticul.flagserie as Serie, \n"+
      "harticul.si_servicio as Servicio, \n"+
      "harticul.ccod_almacen as Codigo_Tipo_Producto, \n"+
      "harticul.cfamilia as Codigo_Familia, \n"+
      "harticul.ccod_subfamilia as Codigo_SubFamilia, \n"+
      "harticul.codmarca as Codigo_Concepto1, \n"+
      "harticul.modelo as Codigo_Concepto2, \n"+
      "harticul.color as Codigo_Concepto3, \n"+
      "harticul.tratamiento as Codigo_Concepto4, \n"+
      "harticul.fuelle as Codigo_Concepto5, \n"+
      "harticul.azas as Codigo_Concepto6, \n"+
      "harticul.solapa as Codigo_Concepto7, \n"+
      "harticul.nigv as Igv_Art, \n"+
      "LTRIM(RTRIM(harticul.cunidad)) as Unidad, \n"+
      "harticul.Cant_cont as Factor, \n"+
      "harticul.AFCT_ADV as Afecta_Advalorem, \n"+
      "harticul.PORC_ADV as Porcenteje_Advalorem, \n"+
      "(Select erp_monto From Erp_Lista_Precio_Cliente  \n"+
      "Where erp_codemp = @codigo_empresa  and erp_codigo_concepto ='01' and  \n"+
      "erp_codart = harticul.ccod_articulo and erp_tipo ='12' and  \n"+
      "erp_unidad = LTRIM(RTRIM(harticul.cunidad)) ) as Unit, \n"+
      "(select  \n"+
      "(Halmacen_2.ccod_almacen+ ' - '+Halmacen_2.cnom_almacen)as Nombre \n"+
      "from Halmacen_2  \n"+
      "inner join Halmacen on \n"+
      "Halmacen.ccod_empresa=Halmacen_2.ccod_empresa   \n"+
      "where Halmacen.ccod_almacen= @codigo_almacen and  \n"+
      "Halmacen_2.ccod_empresa= @codigo_empresa  \n"+
      "and Halmacen_2.ccod_almacen = erp_codalmacen_ptovta) as Nombre_Almacen, \n"+
      "(select  \n"+
      "Halmacen_2.ccod_almacen as Codigo \n"+
      "from Halmacen_2  \n"+
      "inner join Halmacen on \n"+
      "Halmacen.ccod_empresa=Halmacen_2.ccod_empresa   \n"+
      "where Halmacen.ccod_almacen= @codigo_almacen and  \n"+
      "Halmacen_2.ccod_empresa= @codigo_empresa  \n"+
      "and Halmacen_2.ccod_almacen = erp_codalmacen_ptovta) as Codigo_Almacen \n"+
      "from Harticul \n"+
      "where Harticul.ccod_empresa = @codigo_empresa \n"+
      "and Harticul.erp_codbarra = @codigo_barra ")
      
    const recordset = lista.recordset;
    
    res.json(recordset); 
  } catch (err) {
    res.send(err.message);
  }
});

router.post('/costo_producto', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa
    const pool = await poolPromise
    //N'01',N'001',N'001',N'00-00001',NULL,N'S/',N'0',N'0',N'0',N'S',@p11 output,@p12 output,N'','02/06/2020'
    var today =  new Date(req.body.vi_fecha);
    var dd = today.getDate();

    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    } 
    // today = mm+'-'+dd+'-'+yyyy;
    // today = mm+'/'+dd+'/'+yyyy;
    // today = dd+'-'+mm+'-'+yyyy;
    // today = dd+'/'+mm+'/'+yyyy;
    today = yyyy+'/'+mm+'/'+dd;

    // const lista = await pool
    // .request()
    // .input('empresa', mssql.VarChar(10), codigo_empresa)
    // .input('pto_venta', mssql.VarChar(3), req.user.codigo_punto_venta)
    // .input('almacen', mssql.VarChar(3), req.body.almacen)
    // .input('articulo', mssql.VarChar(35), req.body.articulo)
    // .input('lote', mssql.VarChar(35), req.body.lote)
    // .input('moneda_mov', mssql.VarChar(5), req.body.moneda_mov)
    // .input('tc', mssql.Decimal(18,8), req.body.tc)
    // .input('deccosto_adi', mssql.Decimal(18,4), req.body.deccosto_adi)
    // .input('deccantidad', mssql.Decimal(18,4), req.body.deccantidad)
    // .input('tipo', mssql.VarChar(1), req.body.tipo)
    // .output('deccosto_new', mssql.Decimal(18,4), 0)
    // .output('deccosto_adi_new', mssql.Decimal(18,4), 0)
    // .input('vi_serie', mssql.VarChar(250), req.body.vi_serie)
    // .input('Vii_Fecha', mssql.Date(), today) // Año / Mes / Dia
    // .execute("SQ_CALCULO_COSTO_ARTICULO");
    
    const lista = await pool
    .request()
    .input('vi_empresa', mssql.VarChar(10), codigo_empresa)
    .input('vi_pto_venta', mssql.VarChar(3), req.user.codigo_punto_venta)
    .input('vi_almacen', mssql.VarChar(3), req.body.vi_almacen)
    .input('vi_movimiento', mssql.VarChar(3), req.body.vi_movimiento)
    .input('vi_serie', mssql.VarChar(35), req.body.vi_serie)
    .input('vi_numero', mssql.VarChar(35), req.body.vi_numero)
    .input('vi_item', mssql.VarChar(35), req.body.vi_item)
    .input('vi_articulo', mssql.VarChar(35), req.body.vi_articulo)
    .input('vi_lote', mssql.VarChar(35), req.body.vi_lote)
    .input('vi_vencimiento', mssql.Date(), req.body.vi_vencimiento)
    .input('vi_numero_serie', mssql.VarChar(35), req.body.vi_numero_serie)
    .input('vi_fecha', mssql.Date(), today)
    .input('vi_tipo_doc', mssql.VarChar(35), req.body.vi_tipo_doc)
    .output('vi_costo_mn', mssql.Decimal(18,4), 0)
    .output('vi_costo_me', mssql.Decimal(18,4), 0)
    .input('vi_tipo_venta', mssql.VarChar(250), req.body.vi_tipo_venta) // Año / Mes / Dia
    .execute("sq_execalculo_costo_salida");
    
    const recordset = lista.output;
    res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

router.post('/punto_venta', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;

    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .query("select \n"+
      " ccod_almacen as Codigo, \n"+
      " (cnom_almacen) as Nombre, \n"+
      " cdireccion as Direccion, \n"+
      " erp_codalmacen_ptovta as Almacen \n"+
      " from halmacen where ccod_empresa = @codigo_empresa "
      );

    const recordset = lista.recordset;
    res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

router.post('/almacenes', async (req, res) => {
  try {
    console.log(req.body);
    const codigo_empresa = req.user.codigo_empresa;
    if (req.body.punto_venta == "" || req.body.punto_venta == undefined) {
      var codigo_punto_venta = req.user.codigo_punto_venta;
      
    } else {
      var codigo_punto_venta = req.body.punto_venta;
    }
    
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_articulo', mssql.VarChar(100), req.body.codigo)
    .input('punto_venta', mssql.VarChar(250), codigo_punto_venta)
    .query(
      "select nom_almacen, sum(stock) as stock , sum(stock_comprometido) as stock_comprometido ,predeterminado,cod_almacen from \n"+
      "(\n"+
      "select\n"+
      "Halmacen_2.cnom_almacen as nom_almacen, \n"+
      "0 as stock , \n"+
      "0 as stock_comprometido,\n"+
      "case when Halmacen.erp_codalmacen_ptovta = Halmacen_2.ccod_almacen then 'S' else 'N' end as predeterminado,\n"+
      "Halmacen_2.ccod_almacen as cod_almacen\n"+
      "from Halmacen inner join Halmacen_2 on\n"+
      "Halmacen.ccod_empresa = Halmacen_2.ccod_empresa and \n"+
      "Halmacen.ccod_almacen = Halmacen_2.punto_venta \n"+
      "where Halmacen.ccod_empresa = @codigo_empresa\n"+
      "and Halmacen.ccod_almacen = @punto_venta\n"+
      "union all\n"+
      "select \n"+
      "halmacen_2.cnom_almacen as nom_almacen,\n"+
      "sum(ERP_STOART) as stock, \n"+
      "sum(ERP_STOCOM) as stock_comprometido,\n"+
      "case when Halmacen.erp_codalmacen_ptovta = Halmacen_2.ccod_almacen then 'S' else 'N' end as predeterminado,\n"+
      "Halmacen_2.ccod_almacen as cod_almacen \n"+
      "from hstock \n"+
      "inner join Halmacen_2 on\n"+
      "ERP_CODEMP=ccod_empresa and\n"+
      "ERP_CODALM=ccod_almacen\n"+
      "left join Halmacen on\n"+
      "Halmacen.ccod_empresa = Halmacen_2.ccod_empresa and \n"+
      "Halmacen.ccod_almacen = Halmacen_2.punto_venta \n"+
      "where erp_codemp = @codigo_empresa\n"+
      "and erp_codart = @codigo_articulo\n"+
      "and erp_codptv = @punto_venta \n"+
      "group by \n"+
      "hstock.ERP_CODALM, \n"+
      "Halmacen_2.cnom_almacen,\n"+
      "Halmacen_2.ccod_almacen,\n"+
      "Halmacen.erp_codalmacen_ptovta\n"+
      ") as tabla\n"+
      "group by \n"+
      "nom_almacen, predeterminado,cod_almacen\n"+
      "Order by predeterminado desc,cod_almacen asc ");

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

router.post('/unidades', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_articulo', mssql.VarChar(250), req.body.codigo)
    .input('lista_precios', mssql.VarChar(250), req.body.lista_precios)
    .query("select * from (\n" +
    "SELECT \n" +
    "(Harticul.ccod_empresa) as codigo_empresa,\n" +
    "(Harticul.ccod_articulo) as Codigo,\n" +
    "erp_lista_precio_cliente.erp_codigo_concepto as codigo_concepto,\n" +
    "erp_lista_precio_cliente.erp_tipo as Tipo,\n" +
    "LTRIM(RTRIM(erp_lista_precio_cliente.erp_unidad)) as Unidad, \n" +
    "(erp_articulo_unidad.erp_factor) as Factor,\n" +
    "harticul.cmoneda_precio as Moneda,\n" +
    "erp_lista_precio_cliente.erp_monto as Unit, \n" +
    "(erp_lista_precio_cliente.erp_desc1) as Descuento1, \n" +
    "(erp_lista_precio_cliente.erp_desc2) as Descuento2,\n" +
    "(erp_articulo_unidad.erp_iteart) as Item\n" +
    "FROM erp_lista_precio_cliente Inner Join Harticul On\n" +
    "erp_lista_precio_cliente.erp_codemp = Harticul.ccod_empresa And\n" +
    "erp_lista_precio_cliente.erp_codart = Harticul.ccod_articulo\n" +
    "inner join erp_articulo_unidad on\n" +
    "erp_lista_precio_cliente.erp_codemp=erp_articulo_unidad.erp_codemp and \n" +
    "erp_lista_precio_cliente.erp_codart=erp_articulo_unidad.erp_codart and \n" +
    "erp_lista_precio_cliente.erp_unidad= erp_articulo_unidad.erp_codund\n" +
    "UNION\n" +
    "SELECT \n" +
    "(Harticul.ccod_empresa) as codigo_empresa,\n" +
    "(Harticul.ccod_articulo) as Codigo,\n" +
    "erp_lista_precio_cliente.erp_codigo_concepto as codigo_concepto,\n" +
    "erp_lista_precio_cliente.erp_tipo as Tipo,\n" +
    "LTRIM(RTRIM(Harticul.cunidad)) as Unidad, \n" +
    "(harticul.cant_cont) as Factor,\n" +
    "harticul.cmoneda_precio as Moneda,\n" +
    "erp_lista_precio_cliente.erp_monto as Unit, \n" +
    "(erp_lista_precio_cliente.erp_desc1) as Descuento1, \n" +
    "(erp_lista_precio_cliente.erp_desc1) as Descuento2,\n" +
    "(0) as Item\n" +
    "FROM erp_lista_precio_cliente Inner Join Harticul On\n" +
    "erp_lista_precio_cliente.erp_codemp = Harticul.ccod_empresa And\n" +
    "erp_lista_precio_cliente.erp_codart = Harticul.ccod_articulo and \n" +
    "erp_lista_precio_cliente.erp_unidad = Harticul.cunidad \n" +
    ") as tabla\n" +
    "WHERE \n" +
    "codigo_empresa = @codigo_empresa AND\n" +
    "Codigo = @codigo_articulo and \n" +
    "codigo_concepto = @lista_precios and \n" +
    "tipo ='12'\n" +
    "ORDER BY item");
      
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

router.post('/datos_tecnicos', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_articulo', mssql.VarChar(250), req.body.codigo)
    .input('modulo', mssql.VarChar(250), req.body.modulo)
    .query(
      "select \n"+
      "'00' as Codigo, \n"+
      "erp_descripcion as Nombre, \n"+
      "0 as Cantidad, \n"+
      "'00' as Unidad, \n"+
      "'0' as Factor, \n"+
      "'0' as Unit, \n"+
      "'0' as PrecioCalcular, \n"+
      "'0' as Importe, \n"+
      "'0' as Stock, \n"+
      "'0' as Stock_Minimo, \n"+
      "'0' as Descuento1, \n"+
      "'0' as Descuento2, \n"+
      "'00' as Almacen, \n"+
      "'00' as Codigo_Almacen, \n"+
      "'0' as Igv_Art, \n"+
      "'N' as Lote_SN, \n"+
      "'N' as Serie_SN \n"+
      "from Erp_Articulo_Datos_Tecnicos \n"+
      "where erp_codemp = @codigo_empresa \n"+
      "and erp_codart = @codigo_articulo \n"+
      "and modulo = @modulo"
      );
      
    const recordset = lista.recordset;
    res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

router.post('/lista_precios', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    var filas = JSON.parse(req.body.filas)
    const pool = await poolPromise
    var records=[];
    for (let i= 0; i< filas.length; i++){
      var fila = filas[i];
      var lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .input('codigo_articulo', mssql.VarChar(250), fila.Codigo)
      .input('codigo_unidad', mssql.VarChar(250), fila.Unidad)
      .input('codigo_concepto', mssql.VarChar(250), req.body.codigo_concepto)
      .input('codigo_tipo', mssql.VarChar(250), req.body.codigo_tipo)
      .input('tipo_cambio', mssql.Decimal(10,4), req.body.tipo_cambio)
      .input('moneda_documento', mssql.VarChar(250), req.body.moneda_documento)
      .query(
        "select \n"+
        "erp_codart as Codigo, \n"+
        "LTRIM(RTRIM(erp_unidad)) as Unidad, \n"+
        "erp_desc1 as Desc1, \n"+
        "erp_desc2 as Desc2, \n"+
        "erp_desc3 as Desc3, \n"+
        "erp_desc4 as Desc4, \n"+
        "Harticul.cmoneda_precio as Moneda_Producto, \n"+
        "erp_monto * \n"+
        "case @moneda_documento when 'S/' then \n"+
          "case Harticul.cmoneda_precio when 'S/'  then 1 else @tipo_cambio end \n"+
          "else \n"+
          "case Harticul.cmoneda_precio when 'S/'  then 1/@tipo_cambio else 1 end \n"+
        "end \n"+
        "as Unit \n"+
        "from Erp_Lista_Precio_Cliente \n"+
        "inner join Harticul on \n"+
        "Harticul.ccod_empresa = Erp_Lista_Precio_Cliente.erp_codemp and \n"+
        "Harticul.ccod_articulo = Erp_Lista_Precio_Cliente.erp_codart \n"+
        "where erp_codemp = @codigo_empresa \n"+
        "and erp_codart = @codigo_articulo \n"+
        "and erp_unidad = @codigo_unidad \n"+
        "and erp_codigo_concepto= @codigo_concepto \n"+
        "and erp_tipo = @codigo_tipo \n"
      );
      records.push(lista.recordset);
    }
      
    res.json(records); 
  } catch (err) {
    res.send(err.message)
  }
});

router.post('/lotes', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const codigo_punto_venta = req.user.codigo_punto_venta;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
    .input('codigo_articulo', mssql.VarChar(250), req.body.codigo_articulo)
    .input('codigo_almacen', mssql.VarChar(250), req.body.almacen)
    .query(
      "SELECT \n"+
      "erp_lotart as Lote, \n"+
      "CONVERT(VARCHAR(50),erp_venlot, 111) as Vcto, \n"+
      "erp_stoart as Stock, \n"+
      "0.00 as Cantidad, \n"+
      "erp_codalm as Almacen \n"+
      "FROM hstock \n"+
      "WHERE \n"+
      "erp_codemp = @codigo_empresa AND \n"+
      "erp_codptv = @codigo_punto_venta AND \n"+
      "(CASE @codigo_almacen WHEN '(TODOS)' then '(TODOS)'  ELSE erp_codalm END ) = @codigo_almacen AND \n"+
      "erp_codart = @codigo_articulo and \n"+
      "erp_stoart > 0 \n"+
      "ORDER BY erp_venlot asc \n"
    );
    res.json(lista.recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

router.post('/series', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const codigo_punto_venta = req.user.codigo_punto_venta;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
    .input('codigo_articulo', mssql.VarChar(250), req.body.codigo_articulo)
    .input('codigo_almacen', mssql.VarChar(250), req.body.almacen)
    .query(
      "SELECT \n"+
      "erp_numser as Series, \n"+
      "erp_stoart as Stock, \n"+
      "0.00 as Cantidad, \n"+
      "erp_codalm as Almacen \n"+
      "FROM hstock \n"+
      "WHERE \n"+
      "erp_codemp = @codigo_empresa AND \n"+
      "erp_codptv = @codigo_punto_venta AND \n"+
      "(CASE @codigo_almacen WHEN '(TODOS)' then '(TODOS)'  ELSE erp_codalm END ) = @codigo_almacen AND \n"+
      "erp_codart = @codigo_articulo and \n"+
      "erp_stoart > 0 \n"+
      "ORDER BY erp_venlot asc \n"
    );
    res.json(lista.recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

router.post('/grupos_receta', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const codigo_punto_venta = req.user.codigo_punto_venta;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .query(
     "Select erp_nomgru as Nombre, \n"+
     "erp_codgru  as Codigo \n"+
     "From Erp_Produccion_grupo_receta \n"+
     "Where erp_codemp = @codigo_empresa \n"
    );
    res.json(lista.recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

router.post('/unidades_precio', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const codigo_punto_venta = req.user.codigo_punto_venta;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_articulo', mssql.VarChar(250), req.body.codigo_articulo)
    .query(
     "SELECT  \n"+
     "erp_articulo_unidad.erp_codund as Codigo_Unidad,    \n"+
     "erp_articulo_unidad.erp_factor as Factor,    \n"+
     "erp_articulo_unidad.erp_preart as Precio,    \n"+
     "erp_articulo_unidad.erp_desc1 as Descuento1,    \n"+
     "erp_articulo_unidad.erp_desc2 as Descuento2 \n"+
     "FROM erp_articulo_unidad   \n"+
     "WHERE ( erp_articulo_unidad.erp_codemp = @codigo_empresa ) AND   \n"+
     "( erp_articulo_unidad.erp_codart = @codigo_articulo )    \n"+
     "ORDER BY erp_articulo_unidad.erp_factor \n"
    );
    res.json(lista.recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

router.post('/nombre_presentacion', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const codigo_punto_venta = req.user.codigo_punto_venta;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_articulo', mssql.VarChar(250), req.body.codigo_articulo)
    .query(
     "SELECT Erp_Art_Presentacion.erp_codart as Codigo_Articulo,    \n"+
     "Erp_Art_Presentacion.erp_nomart  as Nombre_Presentacion \n"+
     "FROM Erp_Art_Presentacion    \n"+
     "where erp_codart = @codigo_articulo and \n"+
     "erp_idempresa = @codigo_empresa \n"
    ); 
    res.json(lista.recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

router.post('/datos_tecnicos_productos', async (req, res) => {
  try {
    if (req.body.tipo == 'S') {
      var query = " Select Distinct erp_titulo as Titulo, \n"+
      " erp_descripcion as Descripcion, \n"+
      " modulo as Modulo \n"+
      " From Erp_Articulo_Datos_Tecnicos \n"+
      " Where erp_codemp = @codigo_empresa and \n"+
      " erp_codart   = @codigo_articulo \n"
    } else {
      var query = " Select Distinct erp_titulo as Titulo, \n"+
      " erp_descripcion as Descripcion \n"+
      " From Erp_Articulo_Datos_Tecnicos \n"+
      " Where erp_codemp = @codigo_empresa and \n"+
      " erp_codart   = @codigo_articulo group by erp_titulo, erp_descripcion\n"
    }

    const codigo_empresa = req.user.codigo_empresa;
      
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_articulo', mssql.VarChar(250), req.body.codigo_articulo)
    .query(query); 

    res.json(lista.recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

router.post('/lista_precios_compra', async (req, res) => {
  try {

    const codigo_empresa = req.user.codigo_empresa;
      
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_articulo', mssql.VarChar(250), req.body.codigo_articulo)
    .input('tipo', mssql.VarChar(250), '42')
    .query(
     " Select (LP.erp_codprov) as Codigo, \n"+
     " (HP.cnom_proveedor) as Nombre, \n"+
     " (LP.erp_lista) as Codigo_Lista, \n"+
     " (LP.erp_precio)	as Precio \n"+
     " From Erp_Lista_Precios_Proveedores as LP Inner Join Hproveed as HP \n"+
     " On LP.erp_codemp    = HP.ccod_empresa and \n"+
     " LP.erp_codprov   = HP.ccod_proveedor \n"+
     " Where LP.erp_codemp = @codigo_empresa and \n"+
     " LP.erp_codart    = @codigo_articulo  and \n"+
     " LP.erp_tipo		  = '42' \n"
    ); 

    res.json(lista.recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

router.post('/codigos_alternativos', async (req, res) => {
  try {

    const codigo_empresa = req.user.codigo_empresa;
      
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_articulo', mssql.VarChar(250), req.body.codigo_articulo)
    .query(
     " Select \n"+
     " (erp_codbarra_articulo.erp_nitem) As Item, \n"+
     " (erp_codbarra_articulo.erp_codbarra) As Codigo_Barra, \n"+
     " (erp_codbarra_articulo.erp_artivo) As Activo \n"+
     " From erp_codbarra_articulo \n"+
     " Where \n"+
     " erp_codbarra_articulo.erp_codempresa = @codigo_empresa \n"+
     " And erp_codbarra_articulo.erp_codarticulo = @codigo_articulo \n"
    ); 

    res.json(lista.recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

router.post('/guardar', async (req, res) => {
  try {

    const usuario = req.user.codigo_usuario;
    var filas_presentacion_productos = JSON.parse(req.body.Listas_Productos_Presentacion)
    var filas_nombre_presentacion = JSON.parse(req.body.Listas_Productos_Nombre_Presentacion)
    var filas_productos_datos_tecnicos = JSON.parse(req.body.Listas_Productos_Datos_Tecnicos)
    var filas_productos_compras_precios = JSON.parse(req.body.Listas_Productos_Compras_Precios)
    var filas_productos_codigos_alternativos = JSON.parse(req.body.Listas_Productos_Codigos_Alternativos)

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{
          //#region Guardar Articulo
          const datos_articulo  = new mssql.Request(transaction);
          await datos_articulo
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_articulo',mssql.VarChar(250),req.body.Codigo)
          .input('cnom_articulo',mssql.VarChar(250),req.body.Nombre)
          .input('ccod_interno',mssql.VarChar(250),req.body.Codigo_Fabricante)
          .input('ccod_almacen',mssql.VarChar(250),req.body.Tipo_Producto)
          .input('cfamilia',mssql.VarChar(250),req.body.Codigo_Familia)
          .input('ccod_subfamilia',mssql.VarChar(250),req.body.Codigo_SubFamilia)
          .input('codmarca',mssql.VarChar(250),req.body.Codigo_Concepto1)
          .input('modelo',mssql.VarChar(250),req.body.Codigo_Concepto2)
          .input('color',mssql.VarChar(250),req.body.Codigo_Concepto3)
          .input('tratamiento',mssql.VarChar(250),req.body.Codigo_Concepto4)
          .input('fuelle',mssql.VarChar(250),req.body.Codigo_Concepto5)
          .input('azas',mssql.VarChar(250),req.body.Codigo_Concepto6)
          .input('solapa',mssql.VarChar(250),req.body.Codigo_Concepto7)
          .input('lote',mssql.VarChar(250),req.body.Lote_SN)
          .input('flagserie',mssql.VarChar(250),req.body.Serie_SN)
          .input('si_servicio',mssql.VarChar(250),req.body.Servicio_SN)
          .input('cunidad',mssql.VarChar(250),req.body.Unidad)
          .input('csistock',mssql.VarChar(250),req.body.Stock_SN)
          .input('nstock_max',mssql.VarChar(250),req.body.Stock_Max == ''?'0':req.body.Stock_Max)
          .input('nstock_min',mssql.VarChar(250),req.body.Stock_Min == ''?'0':req.body.Stock_Min)
          .input('nstock_rep',mssql.VarChar(250),req.body.Stock_Rep == ''?'0':req.body.Stock_Rep)
          .input('AFCT_ADV',mssql.VarChar(250),req.body.Advalorem_SN)
          .input('PORC_ADV',mssql.VarChar(250),req.body.Porcentaje_Advalorem == ''?'0':req.body.Porcentaje_Advalorem)
          .input('AFCT_PRC',mssql.VarChar(250),req.body.Percepcion_SN)
          .input('cmonedav',mssql.VarChar(250),req.body.Moneda)
          .input('valor_vta_1',mssql.VarChar(250),0)
          .input('valor_vta_2',mssql.VarChar(250),0)
          .input('valor_vta_3',mssql.VarChar(250),0)
          .input('valor_vta_4',mssql.VarChar(250),0)
          .input('porc_descuento1',mssql.VarChar(250),req.body.Descuento1 == ''? '0':req.body.Descuento1 )
          .input('porc_descuento2',mssql.VarChar(250),req.body.Descuento2 == ''? '0':req.body.Descuento2 )
          .input('porc_descuento3',mssql.VarChar(250),req.body.Descuento3 == ''? '0':req.body.Descuento3 )
          .input('porc_descuento4',mssql.VarChar(250),0)
          .input('nigv',mssql.VarChar(250),req.body.Igv == ''? '18':req.body.Igv)
          .input('estado',mssql.VarChar(250),req.body.Estado)
          .input('observacion',mssql.VarChar(250),req.body.Leyenda1)
          .input('ruta_imagen',mssql.VarChar(250),req.body.Ruta_Imagen)
          .input('Categoria',mssql.VarChar(250),req.body.Categoria)
          .input('ubicacion1',mssql.VarChar(250),req.body.Ubicacion1)
          .input('ubicacion2',mssql.VarChar(250),req.body.Ubicacion2)
          .input('cmoneda_precio',mssql.VarChar(250),req.body.Moneda)
          .input('automatico',mssql.VarChar(250),req.body.Automatico)
          .input('erp_mankid',mssql.VarChar(250),req.body.Kits_SN)
          .input('idsubgrupo',mssql.VarChar(250),'')
          .input('modulo',mssql.VarChar(250),'')
          .input('cod_digemir',mssql.VarChar(250),req.body.Codigo_Digemid)
          .input('Cant_cont',mssql.VarChar(250),req.body.Contenido == ''?'1':req.body.Contenido)
          .input('coduni_cont',mssql.VarChar(250),req.body.Unidad2)
          .input('IQPF',mssql.VarChar(250),req.body.Iqpf_SN)
          .input('Erp_CodBarra',mssql.VarChar(250),req.body.Codigo_Barra)
          .input('Erp_CodInterno2',mssql.VarChar(250),req.body.Codigo_Interno1)
          .input('Erp_Observacion2',mssql.VarChar(250),req.body.Leyenda2)
          .input('Erp_CodBarra_Aut',mssql.VarChar(250),req.body.Codigo_Barra_Automatico)
          .input('Erp_Codinterno3',mssql.VarChar(250),req.body.Codigo_Interno2)
          .input('Erp_Part_Arancelaria',mssql.VarChar(250),req.body.Partida_Arancelaria)
          .input('erp_gasadm',mssql.VarChar(250),0)
          .input('erp_activo_fijo',mssql.VarChar(250),req.body.Activo_Fijo_SN)
          .input('Valor_Comp_1',mssql.VarChar(250),0)
          .input('Valor_Comp_2',mssql.VarChar(250),0)
          .input('Valor_Comp_3',mssql.VarChar(250),0)
          .input('Valor_Comp_4',mssql.VarChar(250),0)
          .input('Ccod_Proveedor',mssql.VarChar(250),'00')
          .input('erp_gasventa',mssql.VarChar(250),0)
          .input('erp_gasoperativos',mssql.VarChar(250), 0)
          .input('erp_porc_utilidad_vta_1',mssql.VarChar(250),0)
          .input('erp_porc_utilidad_vta_2',mssql.VarChar(250),0)
          .input('erp_porc_utilidad_vta_3',mssql.VarChar(250),0)
          .input('erp_porc_utilidad_vta_4',mssql.VarChar(250),0)
          .input('erp_new_costo',mssql.VarChar(250),0)
          .input('erp_porc_percep',mssql.VarChar(250),req.body.Porcentaje_Percepcion == ''? '0':req.body.Porcentaje_Percepcion)
          .input('erp_peso',mssql.VarChar(250),req.body.Peso == '' ? '0':req.body.Peso)
          .input('erp_largo',mssql.VarChar(250),req.body.Largo == '' ? '0':req.body.Largo)
          .input('erp_ancho',mssql.VarChar(250),req.body.Ancho == '' ? '0':req.body.Ancho)
          .input('erp_receta',mssql.VarChar(250),req.body.Receta_SN)
          .input('erp_grupo_receta',mssql.VarChar(250),req.body.Grupo_Receta)
          .input('erp_usuario',mssql.VarChar(250), usuario)
          .input('erp_pc_user',mssql.VarChar(250),'')
          .input('erp_pc_ip',mssql.VarChar(250),'')
          .input('erp_pc_fecha',mssql.VarChar(250),req.body.Fecha_Creacion)
          .input('erp_desc_impresion',mssql.VarChar(250),req.body.Desc_Formato_SN)
          .input('erp_pc_fechamodificacion',mssql.VarChar(250),req.body.Fecha_Modificacion)
          .input('erp_comision_sn',mssql.VarChar(250),req.body.Comision_SN)
          .input('erp_comision_porc',mssql.VarChar(250),req.body.Porcentaje_Comision == ''?'0':req.body.Porcentaje_Comision)
          .input('si_digemid',mssql.VarChar(250),req.body.Digemid_SN)
          .input('erp_porc_isc',mssql.VarChar(250),req.body.Porcentaje_Isc == ''?'0':req.body.Porcentaje_Isc)
          .input('erp_isc_sn',mssql.VarChar(250),req.body.Isc_SN)
          .input('si_icbper',mssql.VarChar(250),req.body.Icbper_SN)
          .input('monto_icbper',mssql.VarChar(250),req.body.Monto_Icbper == ''? '0':req.body.Monto_Icbper)
          .input('unspsc',mssql.VarChar(250),req.body.UNSPSC)
          .query(
             " INSERT INTO Harticul( \n"+
             " ccod_empresa, \n"+
             " ccod_articulo, \n"+
             " ccod_interno, \n"+
             " ccod_almacen, \n"+
             " cfamilia, \n"+
             " ccod_subfamilia, \n"+
             " codmarca, \n"+
             " modelo, \n"+
             " color, \n"+
             " tratamiento, \n"+
             " fuelle, \n"+
             " azas, \n"+
             " solapa, \n"+
             " cnom_articulo, \n"+
             " lote, \n"+
             " flagserie, \n"+
             " si_servicio, \n"+
             " cunidad, \n"+
             " csistock, \n"+
             " nstock_max, \n"+
             " nstock_min, \n"+
             " nstock_rep, \n"+
             " AFCT_ADV, \n"+
             " PORC_ADV, \n"+
             " AFCT_PRC, \n"+
             " cmonedav, \n"+
             " valor_vta_1, \n"+
             " valor_vta_2, \n"+
             " valor_vta_3, \n"+
             " valor_vta_4, \n"+
             " porc_descuento1, \n"+
             " porc_descuento2, \n"+
             " porc_descuento3, \n"+
             " porc_descuento4, \n"+
             " nigv, \n"+
             " estado, \n"+
             " observacion, \n"+
             " ruta_imagen, \n"+
             " Categoria, \n"+
             " ubicacion1, \n"+
             " ubicacion2, \n"+
             " cmoneda_precio, \n"+
             " automatico, \n"+
             " erp_mankid, \n"+
             " idsubgrupo, \n"+
             " modulo, \n"+
             " cod_digemir, \n"+
             " Cant_cont, \n"+
             " coduni_cont, \n"+
             " IQPF, \n"+
             " Erp_CodBarra, \n"+
             " Erp_CodInterno2, \n"+
             " Erp_Observacion2, \n"+
             " Erp_CodBarra_Aut, \n"+
             " Erp_Codinterno3, \n"+
             " Erp_Part_Arancelaria, \n"+
             " erp_gasadm, \n"+
             " erp_activo_fijo, \n"+
             " Valor_Comp_1, \n"+
             " Valor_Comp_2, \n"+
             " Valor_Comp_3, \n"+
             " Valor_Comp_4, \n"+
             " Ccod_Proveedor, \n"+
             " erp_gasventa, \n"+
             " erp_gasoperativos, \n"+
             " erp_porc_utilidad_vta_1, \n"+
             " erp_porc_utilidad_vta_2, \n"+
             " erp_porc_utilidad_vta_3, \n"+
             " erp_porc_utilidad_vta_4, \n"+
             " erp_new_costo, \n"+
             " erp_porc_percep, \n"+
             " erp_peso, \n"+
             " erp_largo, \n"+
             " erp_ancho, \n"+
             " erp_receta, \n"+
             " erp_grupo_receta, \n"+
             " erp_usuario, \n"+
             " erp_pc_user, \n"+
             " erp_pc_ip, \n"+
             " erp_pc_fecha, \n"+
             " erp_desc_impresion, \n"+
             " erp_pc_fechamodificacion, \n"+
             " erp_comision_sn, \n"+
             " erp_comision_porc, \n"+
             " si_digemid, \n"+
             " erp_porc_isc, \n"+
             " erp_isc_sn, \n"+
             " si_icbper, \n"+
             " monto_icbper, \n"+
             " unspsc) \n"+
             " VALUES( \n"+
             " @ccod_empresa,  \n"+
             " @ccod_articulo,  \n"+
             " @ccod_interno,  \n"+
             " @ccod_almacen,  \n"+
             " @cfamilia,  \n"+
             " @ccod_subfamilia,  \n"+
             " @codmarca,  \n"+
             " @modelo,  \n"+
             " @color,  \n"+
             " @tratamiento,  \n"+
             " @fuelle,  \n"+
             " @azas,  \n"+
             " @solapa,  \n"+
             " @cnom_articulo,  \n"+
             " @lote,  \n"+
             " @flagserie,  \n"+
             " @si_servicio,  \n"+
             " @cunidad,  \n"+
             " @csistock,  \n"+
             " @nstock_max,  \n"+
             " @nstock_min,  \n"+
             " @nstock_rep,  \n"+
             " @AFCT_ADV,  \n"+
             " @PORC_ADV,  \n"+
             " @AFCT_PRC,  \n"+
             " @cmonedav,  \n"+
             " @valor_vta_1,  \n"+
             " @valor_vta_2,  \n"+
             " @valor_vta_3,  \n"+
             " @valor_vta_4,  \n"+
             " @porc_descuento1,  \n"+
             " @porc_descuento2,  \n"+
             " @porc_descuento3,  \n"+
             " @porc_descuento4,  \n"+
             " @nigv,  \n"+
             " @estado,  \n"+
             " @observacion,  \n"+
             " @ruta_imagen,  \n"+
             " @Categoria,  \n"+
             " @ubicacion1,  \n"+
             " @ubicacion2,  \n"+
             " @cmoneda_precio,  \n"+
             " @automatico,  \n"+
             " @erp_mankid,  \n"+
             " @idsubgrupo,  \n"+
             " @modulo,  \n"+
             " @cod_digemir,  \n"+
             " @Cant_cont,  \n"+
             " @coduni_cont, \n"+
             " @IQPF,  \n"+
             " @Erp_CodBarra,  \n"+
             " @Erp_CodInterno2,  \n"+
             " @Erp_Observacion2,  \n"+
             " @Erp_CodBarra_Aut,  \n"+
             " @Erp_Codinterno3,  \n"+
             " @Erp_Part_Arancelaria,  \n"+
             " @erp_gasadm,  \n"+
             " @erp_activo_fijo,  \n"+
             " @Valor_Comp_1,  \n"+
             " @Valor_Comp_2,  \n"+
             " @Valor_Comp_3,  \n"+
             " @Valor_Comp_4,  \n"+
             " @Ccod_Proveedor,  \n"+
             " @erp_gasventa,  \n"+
             " @erp_gasoperativos,  \n"+
             " @erp_porc_utilidad_vta_1,  \n"+
             " @erp_porc_utilidad_vta_2,  \n"+
             " @erp_porc_utilidad_vta_3,  \n"+
             " @erp_porc_utilidad_vta_4,  \n"+
             " @erp_new_costo,  \n"+
             " @erp_porc_percep,  \n"+
             " @erp_peso,  \n"+
             " @erp_largo,  \n"+
             " @erp_ancho,  \n"+
             " @erp_receta,  \n"+
             " @erp_grupo_receta,  \n"+
             " @erp_usuario,  \n"+
             " @erp_pc_user,  \n"+
             " @erp_pc_ip,  \n"+
             " @erp_pc_fecha,  \n"+
             " @erp_desc_impresion,  \n"+
             " @erp_pc_fechamodificacion,  \n"+
             " @erp_comision_sn,  \n"+
             " @erp_comision_porc,  \n"+
             " @si_digemid,  \n"+
             " @erp_porc_isc,  \n"+
             " @erp_isc_sn,  \n"+
             " @si_icbper,  \n"+
             " @monto_icbper,  \n"+
             " @unspsc ) \n"
          );
          //#endregion
    
          //#region Guardar Presentacion Articulo
          for (let i= 0; i< filas_presentacion_productos.length; i++){
            var fila = filas_presentacion_productos[i];

            const presentacion_articulo  = new mssql.Request(transaction);
            await presentacion_articulo
            .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
            .input('erp_codart',mssql.VarChar(250),req.body.Codigo)
            .input('erp_codund',mssql.VarChar(250),fila.Codigo_Unidad)
            .input('erp_factor',mssql.VarChar(250),fila.Factor)
            .input('erp_preart',mssql.VarChar(250),fila.Precio)
            .input('erp_desc1',mssql.VarChar(250),'0')
            .input('erp_desc2',mssql.VarChar(250),'0')
            .input('erp_desc3',mssql.VarChar(250),'0')
            .input('erp_desc4',mssql.VarChar(250),'0')
            .input('erp_iteart',mssql.VarChar(250),i+1)
            .query(
            "insert into erp_articulo_unidad ( \n"+
            "erp_codemp, \n"+
            "erp_codart, \n"+
            "erp_codund, \n"+
            "erp_factor, \n"+
            "erp_preart, \n"+
            "erp_desc1, \n"+
            "erp_desc2, \n"+
            "erp_desc3, \n"+
            "erp_desc4, \n"+
            "erp_iteart \n"+
            ")values( \n"+
            "@erp_codemp, \n"+
            "@erp_codart, \n"+
            "@erp_codund, \n"+
            "@erp_factor, \n"+
            "@erp_preart, \n"+
            "@erp_desc1, \n"+
            "@erp_desc2, \n"+
            "@erp_desc3, \n"+
            "@erp_desc4, \n"+
            "@erp_iteart ) \n"
            );
            const lista_precios_cliente_unidades = new mssql.Request(transaction);
            await lista_precios_cliente_unidades
            .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
            .input('erp_codart',mssql.VarChar(250),req.body.Codigo)
            .input('cunidad',mssql.VarChar(250),fila.Codigo_Unidad)
            .query(
              "insert into Erp_Lista_Precio_Cliente select  \n"+
              "@erp_codemp, \n"+
              "erp_codigo, \n"+
              "@erp_codart, \n"+
              "0, \n"+
              "erp_tipo, \n"+
              "@cunidad, \n"+
              "0, \n"+
              "0, \n"+
              "0, \n"+
              "0 \n"+
              "from Erp_Conceptos_Precios where erp_codemp=@erp_codemp"
            );
          }
          //#endregion

          //#region Guardar Nombre Presentacion Articulo
          for (let i= 0; i< filas_nombre_presentacion.length; i++){
            var fila = filas_nombre_presentacion[i];

            const nombre_presentacion_articulo  = new mssql.Request(transaction);
            await nombre_presentacion_articulo
            .input('erp_idempresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('erp_codart',mssql.VarChar(250),req.body.Codigo)
            .input('erp_nomart',mssql.VarChar(250),fila.Nombre_Presentacion)
            .input('erp_item',mssql.VarChar(250),i+1)
            .query(
            "insert into Erp_Art_Presentacion ( \n"+
            "erp_idempresa, \n"+
            "erp_codart, \n"+
            "erp_nomart, \n"+
            "erp_item \n"+
            ")values( \n"+
            "@erp_idempresa, \n"+
            "@erp_codart, \n"+
            "@erp_nomart, \n"+
            "@erp_item ) \n"
            );
          }
          //#endregion

          //#region Guardar Datos Tecnicos Articulo
          var item = 1;
          for (let i= 0; i< filas_productos_datos_tecnicos.length; i++){
            var fila = filas_productos_datos_tecnicos[i];

            var query=
            "insert into Erp_Articulo_Datos_Tecnicos ( \n"+
            "erp_codemp, \n"+
            "erp_codart, \n"+
            "erp_item, \n"+
            "erp_titulo, \n"+
            "erp_descripcion, \n"+
            "modulo \n"+
            ")values( \n"+
            "@erp_codemp, \n"+
            "@erp_codart, \n"+
            "@erp_item, \n"+
            "@erp_titulo, \n"+
            "@erp_descripcion, \n"+
            "@modulo ) \n";

            if(req.body.Compra=="S"){
              var datos_tecnicos_articulo  = new mssql.Request(transaction);
              await datos_tecnicos_articulo
              .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
              .input('erp_codart',mssql.VarChar(250),req.body.Codigo)
              .input('erp_titulo',mssql.VarChar(250),fila.Titulo)
              .input('erp_descripcion',mssql.VarChar(250),fila.Descripcion)
              .input('modulo',mssql.VarChar(250),"C")
              .input('erp_item',mssql.VarChar(250),item)
              .query(query);
              item++;
            }
            if(req.body.Venta == "S"){
              var datos_tecnicos_articulo  = new mssql.Request(transaction);
              await datos_tecnicos_articulo
              .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
              .input('erp_codart',mssql.VarChar(250),req.body.Codigo)
              .input('erp_titulo',mssql.VarChar(250),fila.Titulo)
              .input('erp_descripcion',mssql.VarChar(250),fila.Descripcion)
              .input('modulo',mssql.VarChar(250),"V")
              .input('erp_item',mssql.VarChar(250),item)
              .query(query);
              item++;
            }
          }
          //#endregion

          //#region Guardar Articulo Compras Precios
          for (let i= 0; i< filas_productos_compras_precios.length; i++){
            var fila = filas_productos_compras_precios[i];

            const articulo_compras_precios  = new mssql.Request(transaction);
            await articulo_compras_precios
            .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
            .input('erp_codart',mssql.VarChar(250),req.body.Codigo)
            .input('erp_codprov',mssql.VarChar(250),fila.Codigo)
            .input('erp_lista',mssql.VarChar(250),fila.Codigo_Lista)
            .input('erp_precio',mssql.VarChar(250),'0')
            .input('erp_tipo',mssql.VarChar(250),'42')
            .query(
            "insert into Erp_Lista_Precios_Proveedores ( \n"+
            "erp_codemp, \n"+
            "erp_codart, \n"+
            "erp_codprov, \n"+
            "erp_lista, \n"+
            "erp_precio, \n"+
            "erp_tipo \n"+
            ")values( \n"+
            "@erp_codemp, \n"+
            "@erp_codart, \n"+
            "@erp_codprov, \n"+
            "@erp_lista, \n"+
            "@erp_precio, \n"+
            "@erp_tipo ) \n"
            );
          }
          //#endregion

          //#region Guardar Articulo Codigos Alternativos
          for (let i= 0; i< filas_productos_codigos_alternativos.length; i++){
            var fila = filas_productos_codigos_alternativos[i];

            const articulo_codigos_alternativos  = new mssql.Request(transaction);
            await articulo_codigos_alternativos
            .input('erp_codempresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('erp_codarticulo',mssql.VarChar(250),req.body.Codigo)
            .input('erp_nitem',mssql.VarChar(250),i+1)
            .input('erp_codbarra',mssql.VarChar(250),fila.Codigo_Barra)
            .input('erp_artivo',mssql.VarChar(250),fila.Activo)
            .query(
            "insert into erp_codbarra_articulo ( \n"+
            "erp_codempresa, \n"+
            "erp_codarticulo, \n"+
            "erp_nitem, \n"+
            "erp_codbarra, \n"+
            "erp_artivo \n"+
            ")values( \n"+
            "@erp_codempresa, \n"+
            "@erp_codarticulo, \n"+
            "@erp_nitem, \n"+
            "@erp_codbarra, \n"+
            "@erp_artivo ) \n"
            );
          }
          //#endregion
            
          //#region Guardar Lista Precios Cliente
          const lista_precios_cliente = new mssql.Request(transaction);
          await lista_precios_cliente
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codart',mssql.VarChar(250),req.body.Codigo)
          .input('cunidad',mssql.VarChar(250),req.body.Unidad)
          .query(
            "insert into Erp_Lista_Precio_Cliente select  \n"+
            "@erp_codemp, \n"+
            "erp_codigo, \n"+
            "@erp_codart, \n"+
            "0, \n"+
            "erp_tipo, \n"+
            "@cunidad, \n"+
            "0, \n"+
            "0, \n"+
            "0, \n"+
            "0 \n"+
            "from Erp_Conceptos_Precios where erp_codemp=@erp_codemp"
          );
          //#endregion

          transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: true, codigo: "0", mensaje: ''});
        }catch(err){
          transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: false, codigo: "Err", mensaje: err.message});
        }
    });    
  } catch (err) {
    console.log(err.message);
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

router.post('/modificar', async (req, res) => {
  try {

    const usuario = req.user.codigo_usuario;
    var filas_presentacion_productos = JSON.parse(req.body.Listas_Productos_Presentacion)
    var filas_nombre_presentacion = JSON.parse(req.body.Listas_Productos_Nombre_Presentacion)
    var filas_productos_datos_tecnicos = JSON.parse(req.body.Listas_Productos_Datos_Tecnicos)
    var filas_productos_compras_precios = JSON.parse(req.body.Listas_Productos_Compras_Precios)
    var filas_productos_codigos_alternativos = JSON.parse(req.body.Listas_Productos_Codigos_Alternativos)

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{

          //#region Modificar Articulo
          const datos_articulo  = new mssql.Request(transaction);
          await datos_articulo
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_articulo',mssql.VarChar(250),req.body.Codigo)
          .input('cnom_articulo',mssql.VarChar(250),req.body.Nombre)
          .input('ccod_interno',mssql.VarChar(250),req.body.Codigo_Fabricante)
          .input('ccod_almacen',mssql.VarChar(250),req.body.Tipo_Producto)
          .input('cfamilia',mssql.VarChar(250),req.body.Codigo_Familia)
          .input('ccod_subfamilia',mssql.VarChar(250),req.body.Codigo_SubFamilia)
          .input('codmarca',mssql.VarChar(250),req.body.Codigo_Concepto1)
          .input('modelo',mssql.VarChar(250),req.body.Codigo_Concepto2)
          .input('color',mssql.VarChar(250),req.body.Codigo_Concepto3)
          .input('tratamiento',mssql.VarChar(250),req.body.Codigo_Concepto4)
          .input('fuelle',mssql.VarChar(250),req.body.Codigo_Concepto5)
          .input('azas',mssql.VarChar(250),req.body.Codigo_Concepto6)
          .input('solapa',mssql.VarChar(250),req.body.Codigo_Concepto7)
          .input('lote',mssql.VarChar(250),req.body.Lote_SN)
          .input('flagserie',mssql.VarChar(250),req.body.Serie_SN)
          .input('si_servicio',mssql.VarChar(250),req.body.Servicio_SN)
          .input('cunidad',mssql.VarChar(250),req.body.Unidad)
          .input('csistock',mssql.VarChar(250),req.body.Stock_SN)
          .input('nstock_max',mssql.VarChar(250),req.body.Stock_Max == ''?'0':req.body.Stock_Max)
          .input('nstock_min',mssql.VarChar(250),req.body.Stock_Min == ''?'0':req.body.Stock_Min)
          .input('nstock_rep',mssql.VarChar(250),req.body.Stock_Rep == ''?'0':req.body.Stock_Rep)
          .input('AFCT_ADV',mssql.VarChar(250),req.body.Advalorem_SN)
          .input('PORC_ADV',mssql.VarChar(250),req.body.Porcentaje_Advalorem == ''?'0':req.body.Porcentaje_Advalorem)
          .input('AFCT_PRC',mssql.VarChar(250),req.body.Percepcion_SN)
          .input('cmonedav',mssql.VarChar(250),req.body.Moneda)
          .input('valor_vta_1',mssql.VarChar(250),0)
          .input('valor_vta_2',mssql.VarChar(250),0)
          .input('valor_vta_3',mssql.VarChar(250),0)
          .input('valor_vta_4',mssql.VarChar(250),0)
          .input('porc_descuento1',mssql.VarChar(250),req.body.Descuento1 == ''? '0':req.body.Descuento1 )
          .input('porc_descuento2',mssql.VarChar(250),req.body.Descuento2 == ''? '0':req.body.Descuento2 )
          .input('porc_descuento3',mssql.VarChar(250),req.body.Descuento3 == ''? '0':req.body.Descuento3 )
          .input('porc_descuento4',mssql.VarChar(250),0)
          .input('nigv',mssql.VarChar(250),req.body.Igv == ''? '18':req.body.Igv)
          .input('estado',mssql.VarChar(250),req.body.Estado)
          .input('observacion',mssql.VarChar(250),req.body.Leyenda1)
          .input('ruta_imagen',mssql.VarChar(250),req.body.Ruta_Imagen)
          .input('Categoria',mssql.VarChar(250),req.body.Categoria)
          .input('ubicacion1',mssql.VarChar(250),req.body.Ubicacion1)
          .input('ubicacion2',mssql.VarChar(250),req.body.Ubicacion2)
          .input('cmoneda_precio',mssql.VarChar(250),req.body.Moneda)
          .input('automatico',mssql.VarChar(250),req.body.Automatico)
          .input('erp_mankid',mssql.VarChar(250),req.body.Kits_SN)
          .input('idsubgrupo',mssql.VarChar(250),'')
          .input('modulo',mssql.VarChar(250),'')
          .input('cod_digemir',mssql.VarChar(250),req.body.Codigo_Digemid)
          .input('Cant_cont',mssql.VarChar(250),req.body.Contenido == ''?'1':req.body.Contenido)
          .input('coduni_cont',mssql.VarChar(250),req.body.Unidad2)
          .input('IQPF',mssql.VarChar(250),req.body.Iqpf_SN)
          .input('Erp_CodBarra',mssql.VarChar(250),req.body.Codigo_Barra)
          .input('Erp_CodInterno2',mssql.VarChar(250),req.body.Codigo_Interno1)
          .input('Erp_Observacion2',mssql.VarChar(250),req.body.Leyenda2)
          .input('Erp_CodBarra_Aut',mssql.VarChar(250),req.body.Codigo_Barra_Automatico)
          .input('Erp_Codinterno3',mssql.VarChar(250),req.body.Codigo_Interno2)
          .input('Erp_Part_Arancelaria',mssql.VarChar(250),req.body.Partida_Arancelaria)
          .input('erp_gasadm',mssql.VarChar(250),0)
          .input('erp_activo_fijo',mssql.VarChar(250),req.body.Activo_Fijo_SN)
          .input('Valor_Comp_1',mssql.VarChar(250),0)
          .input('Valor_Comp_2',mssql.VarChar(250),0)
          .input('Valor_Comp_3',mssql.VarChar(250),0)
          .input('Valor_Comp_4',mssql.VarChar(250),0)
          .input('Ccod_Proveedor',mssql.VarChar(250),'00')
          .input('erp_gasventa',mssql.VarChar(250),0)
          .input('erp_gasoperativos',mssql.VarChar(250), 0)
          .input('erp_porc_utilidad_vta_1',mssql.VarChar(250),0)
          .input('erp_porc_utilidad_vta_2',mssql.VarChar(250),0)
          .input('erp_porc_utilidad_vta_3',mssql.VarChar(250),0)
          .input('erp_porc_utilidad_vta_4',mssql.VarChar(250),0)
          .input('erp_new_costo',mssql.VarChar(250),0)
          .input('erp_porc_percep',mssql.VarChar(250),req.body.Porcentaje_Percepcion == ''? '0':req.body.Porcentaje_Percepcion)
          .input('erp_peso',mssql.VarChar(250),req.body.Peso == '' ? '0':req.body.Peso)
          .input('erp_largo',mssql.VarChar(250),req.body.Largo == '' ? '0':req.body.Largo)
          .input('erp_ancho',mssql.VarChar(250),req.body.Ancho == '' ? '0':req.body.Ancho)
          .input('erp_receta',mssql.VarChar(250),req.body.Receta_SN)
          .input('erp_grupo_receta',mssql.VarChar(250),req.body.Grupo_Receta)
          .input('erp_usuario',mssql.VarChar(250), usuario)
          .input('erp_pc_user',mssql.VarChar(250),'')
          .input('erp_pc_ip',mssql.VarChar(250),'')
          .input('erp_pc_fecha',mssql.VarChar(250),req.body.Fecha_Creacion)
          .input('erp_desc_impresion',mssql.VarChar(250),req.body.Desc_Formato_SN)
          .input('erp_pc_fechamodificacion',mssql.VarChar(250),req.body.Fecha_Modificacion)
          .input('erp_comision_sn',mssql.VarChar(250),req.body.Comision_SN)
          .input('erp_comision_porc',mssql.VarChar(250),req.body.Porcentaje_Comision == ''?'0':req.body.Porcentaje_Comision)
          .input('si_digemid',mssql.VarChar(250),req.body.Digemid_SN)
          .input('erp_porc_isc',mssql.VarChar(250),req.body.Porcentaje_Isc == ''?'0':req.body.Porcentaje_Isc)
          .input('erp_isc_sn',mssql.VarChar(250),req.body.Isc_SN)
          .input('si_icbper',mssql.VarChar(250),req.body.Icbper_SN)
          .input('monto_icbper',mssql.VarChar(250),req.body.Monto_Icbper == ''? '0':req.body.Monto_Icbper)
          .input('unspsc',mssql.VarChar(250),req.body.UNSPSC)
          .query(
             " update Harticul set  \n"+
             " ccod_interno = @ccod_interno, \n"+
             " ccod_almacen = @ccod_almacen, \n"+
             " cfamilia = @cfamilia, \n"+
             " ccod_subfamilia = @ccod_subfamilia, \n"+
             " codmarca = @codmarca, \n"+
             " modelo = @modelo, \n"+
             " color = @color, \n"+
             " tratamiento = @tratamiento, \n"+
             " fuelle = @fuelle, \n"+
             " azas = @azas, \n"+
             " solapa = @solapa, \n"+
             " cnom_articulo = @cnom_articulo, \n"+
             " lote = @lote, \n"+
             " flagserie = @flagserie, \n"+
             " si_servicio = @si_servicio, \n"+
             " cunidad = @cunidad, \n"+
             " csistock = @csistock, \n"+
             " nstock_max = @nstock_max, \n"+
             " nstock_min = @nstock_min, \n"+
             " nstock_rep = @nstock_rep, \n"+
             " AFCT_ADV = @AFCT_ADV, \n"+
             " PORC_ADV = @PORC_ADV, \n"+
             " AFCT_PRC = @AFCT_PRC, \n"+
             " cmonedav = @cmonedav, \n"+
             " valor_vta_1 = @valor_vta_1, \n"+
             " valor_vta_2 = @valor_vta_2, \n"+
             " valor_vta_3 = @valor_vta_3, \n"+
             " valor_vta_4 = @valor_vta_4, \n"+
             " porc_descuento1 = @porc_descuento1, \n"+
             " porc_descuento2 = @porc_descuento2, \n"+
             " porc_descuento3 = @porc_descuento3, \n"+
             " porc_descuento4 = @porc_descuento4, \n"+
             " nigv = @nigv, \n"+
             " estado = @estado, \n"+
             " observacion = @observacion, \n"+
             " ruta_imagen = @ruta_imagen, \n"+
             " Categoria = @Categoria, \n"+
             " ubicacion1 = @ubicacion1, \n"+
             " ubicacion2 = @ubicacion2, \n"+
             " cmoneda_precio = @cmoneda_precio, \n"+
             " automatico = @automatico, \n"+
             " erp_mankid = @erp_mankid, \n"+
             " idsubgrupo = @idsubgrupo, \n"+
             " modulo = @modulo, \n"+
             " cod_digemir = @cod_digemir, \n"+
             " Cant_cont = @Cant_cont, \n"+
             " coduni_cont = @coduni_cont, \n"+
             " IQPF = @IQPF, \n"+
             " Erp_CodBarra = @Erp_CodBarra, \n"+
             " Erp_CodInterno2 = @Erp_CodInterno2, \n"+
             " Erp_Observacion2 = @Erp_Observacion2, \n"+
             " Erp_CodBarra_Aut = @Erp_CodBarra_Aut, \n"+
             " Erp_Codinterno3 = @Erp_Codinterno3, \n"+
             " Erp_Part_Arancelaria = @Erp_Part_Arancelaria, \n"+
             " erp_gasadm = @erp_gasadm, \n"+
             " erp_activo_fijo = @erp_activo_fijo, \n"+
             " Valor_Comp_1 = @Valor_Comp_1, \n"+
             " Valor_Comp_2 = @Valor_Comp_2, \n"+
             " Valor_Comp_3 = @Valor_Comp_3, \n"+
             " Valor_Comp_4 = @Valor_Comp_4, \n"+
             " Ccod_Proveedor = @Ccod_Proveedor, \n"+
             " erp_gasventa = @erp_gasventa, \n"+
             " erp_gasoperativos = @erp_gasoperativos, \n"+
             " erp_porc_utilidad_vta_1 = @erp_porc_utilidad_vta_1, \n"+
             " erp_porc_utilidad_vta_2 = @erp_porc_utilidad_vta_2, \n"+
             " erp_porc_utilidad_vta_3 = @erp_porc_utilidad_vta_3, \n"+
             " erp_porc_utilidad_vta_4 = @erp_porc_utilidad_vta_4, \n"+
             " erp_new_costo = @erp_new_costo, \n"+
             " erp_porc_percep = @erp_porc_percep, \n"+
             " erp_peso = @erp_peso, \n"+
             " erp_largo = @erp_largo, \n"+
             " erp_ancho = @erp_ancho, \n"+
             " erp_receta = @erp_receta, \n"+
             " erp_grupo_receta = @erp_grupo_receta, \n"+
             " erp_usuario = @erp_usuario, \n"+
             " erp_pc_user = @erp_pc_user, \n"+
             " erp_pc_ip = @erp_pc_ip, \n"+
             " erp_desc_impresion = @erp_desc_impresion, \n"+
             " erp_pc_fechamodificacion = getdate(), \n"+
             " erp_comision_sn = @erp_comision_sn, \n"+
             " erp_comision_porc = @erp_comision_porc, \n"+
             " si_digemid = @si_digemid, \n"+
             " erp_porc_isc = @erp_porc_isc, \n"+
             " erp_isc_sn = @erp_isc_sn, \n"+
             " si_icbper = @si_icbper, \n"+
             " monto_icbper = @monto_icbper, \n"+
             " unspsc = @unspsc where ccod_empresa = @ccod_empresa and ccod_articulo = @ccod_articulo \n"
          );
          //#endregion

          //#region Modificar Presentacion Articulo
          const eliminar_presentacion_articulo  = new mssql.Request(transaction);
          await eliminar_presentacion_articulo
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codart',mssql.VarChar(250),req.body.Codigo)
          .query(
            " delete from erp_articulo_unidad where erp_codemp = @erp_codemp and erp_codart = @erp_codart "
          );

          for (let i= 0; i< filas_presentacion_productos.length; i++){
            var fila = filas_presentacion_productos[i];

            const presentacion_articulo  = new mssql.Request(transaction);
            await presentacion_articulo
            .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
            .input('erp_codart',mssql.VarChar(250),req.body.Codigo)
            .input('erp_codund',mssql.VarChar(250),fila.Codigo_Unidad)
            .input('erp_factor',mssql.VarChar(250),fila.Factor)
            .input('erp_preart',mssql.VarChar(250),fila.Precio)
            .input('erp_desc1',mssql.VarChar(250),'0')
            .input('erp_desc2',mssql.VarChar(250),'0')
            .input('erp_desc3',mssql.VarChar(250),'0')
            .input('erp_desc4',mssql.VarChar(250),'0')
            .input('erp_iteart',mssql.VarChar(250),i+1)
            .query(
            "insert into erp_articulo_unidad ( \n"+
            "erp_codemp, \n"+
            "erp_codart, \n"+
            "erp_codund, \n"+
            "erp_factor, \n"+
            "erp_preart, \n"+
            "erp_desc1, \n"+
            "erp_desc2, \n"+
            "erp_desc3, \n"+
            "erp_desc4, \n"+
            "erp_iteart \n"+
            ")values( \n"+
            "@erp_codemp, \n"+
            "@erp_codart, \n"+
            "@erp_codund, \n"+
            "@erp_factor, \n"+
            "@erp_preart, \n"+
            "@erp_desc1, \n"+
            "@erp_desc2, \n"+
            "@erp_desc3, \n"+
            "@erp_desc4, \n"+
            "@erp_iteart ) \n"
            );
          }
          //#endregion
          
          //#region Modificar Nombre Presentacion Articulo
          const eliminar_nombre_presentacion_articulo = new mssql.Request(transaction);
          await eliminar_nombre_presentacion_articulo
          .input('erp_idempresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codart',mssql.VarChar(250),req.body.Codigo)
          .query(
            " delete from Erp_Art_Presentacion where erp_idempresa = @erp_idempresa and erp_codart = @erp_codart "
          );

          for (let i= 0; i< filas_nombre_presentacion.length; i++){
            var fila = filas_nombre_presentacion[i];

            const nombre_presentacion_articulo  = new mssql.Request(transaction);
            await nombre_presentacion_articulo
            .input('erp_idempresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('erp_codart',mssql.VarChar(250),req.body.Codigo)
            .input('erp_nomart',mssql.VarChar(250),fila.Nombre_Presentacion)
            .input('erp_item',mssql.VarChar(250),i+1)
            .query(
            "insert into Erp_Art_Presentacion ( \n"+
            "erp_idempresa, \n"+
            "erp_codart, \n"+
            "erp_nomart, \n"+
            "erp_item \n"+
            ")values( \n"+
            "@erp_idempresa, \n"+
            "@erp_codart, \n"+
            "@erp_nomart, \n"+
            "@erp_item ) \n"
            );
          }
          //#endregion

          //#region Modificar Datos Tecnicos Articulo
          const eliminar_datos_tecnicos_articulo = new mssql.Request(transaction);
          await eliminar_datos_tecnicos_articulo
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codart',mssql.VarChar(250),req.body.Codigo)
          .query(
            " delete from Erp_Articulo_Datos_Tecnicos where erp_codemp = @erp_codemp and erp_codart = @erp_codart "
          );

          var item = 1;
          for (let i= 0; i< filas_productos_datos_tecnicos.length; i++){
            var fila = filas_productos_datos_tecnicos[i];

            var query=
            "insert into Erp_Articulo_Datos_Tecnicos ( \n"+
            "erp_codemp, \n"+
            "erp_codart, \n"+
            "erp_item, \n"+
            "erp_titulo, \n"+
            "erp_descripcion, \n"+
            "modulo \n"+
            ")values( \n"+
            "@erp_codemp, \n"+
            "@erp_codart, \n"+
            "@erp_item, \n"+
            "@erp_titulo, \n"+
            "@erp_descripcion, \n"+
            "@modulo ) \n";

            if(req.body.Compra=="S"){
              var datos_tecnicos_articulo  = new mssql.Request(transaction);
              await datos_tecnicos_articulo
              .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
              .input('erp_codart',mssql.VarChar(250),req.body.Codigo)
              .input('erp_titulo',mssql.VarChar(250),fila.Titulo)
              .input('erp_descripcion',mssql.VarChar(250),fila.Descripcion)
              .input('modulo',mssql.VarChar(250),"C")
              .input('erp_item',mssql.VarChar(250),item)
              .query(query);
              item++;
            }
            if(req.body.Venta =="S"){
              var datos_tecnicos_articulo  = new mssql.Request(transaction);
              await datos_tecnicos_articulo
              .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
              .input('erp_codart',mssql.VarChar(250),req.body.Codigo)
              .input('erp_titulo',mssql.VarChar(250),fila.Titulo)
              .input('erp_descripcion',mssql.VarChar(250),fila.Descripcion)
              .input('modulo',mssql.VarChar(250),"V")
              .input('erp_item',mssql.VarChar(250),item)
              .query(query);
              item++
            }
          }
          //#endregion

          //#region Modificar Articulo Compras Precios
          const eliminar_articulo_compras_precios = new mssql.Request(transaction);
          await eliminar_articulo_compras_precios
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codart',mssql.VarChar(250),req.body.Codigo)
          .query(
            " delete from Erp_Lista_Precios_Proveedores where erp_codemp = @erp_codemp and erp_codart = @erp_codart "
          );

          for (let i= 0; i< filas_productos_compras_precios.length; i++){
            var fila = filas_productos_compras_precios[i];

            const articulo_compras_precios = new mssql.Request(transaction);
            await articulo_compras_precios
            .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
            .input('erp_codart',mssql.VarChar(250),req.body.Codigo)
            .input('erp_codprov',mssql.VarChar(250),fila.Codigo)
            .input('erp_lista',mssql.VarChar(250),fila.Codigo_Lista)
            .input('erp_precio',mssql.VarChar(250),'0')
            .input('erp_tipo',mssql.VarChar(250),'42')
            .query(
            "insert into Erp_Lista_Precios_Proveedores ( \n"+
            "erp_codemp, \n"+
            "erp_codart, \n"+
            "erp_codprov, \n"+
            "erp_lista, \n"+
            "erp_precio, \n"+
            "erp_tipo \n"+
            ")values( \n"+
            "@erp_codemp, \n"+
            "@erp_codart, \n"+
            "@erp_codprov, \n"+
            "@erp_lista, \n"+
            "@erp_precio, \n"+
            "@erp_tipo ) \n"
            );
          }
          //#endregion

          //#region Modifcar Articulo Codigos Alternativos
          const eliminar_articulo_codigos_alternativos = new mssql.Request(transaction);
          await eliminar_articulo_codigos_alternativos
          .input('erp_codempresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codarticulo',mssql.VarChar(250),req.body.Codigo)
          .query(
            " delete from erp_codbarra_articulo where erp_codempresa = @erp_codempresa and erp_codarticulo = @erp_codarticulo "
          );

          for (let i= 0; i< filas_productos_codigos_alternativos.length; i++){
            var fila = filas_productos_codigos_alternativos[i];

            const articulo_codigos_alternativos  = new mssql.Request(transaction);
            await articulo_codigos_alternativos
            .input('erp_codempresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('erp_codarticulo',mssql.VarChar(250),req.body.Codigo)
            .input('erp_nitem',mssql.VarChar(250),i+1)
            .input('erp_codbarra',mssql.VarChar(250),fila.Codigo_Barra)
            .input('erp_artivo',mssql.VarChar(250),fila.Activo)
            .query(
            "insert into erp_codbarra_articulo ( \n"+
            "erp_codempresa, \n"+
            "erp_codarticulo, \n"+
            "erp_nitem, \n"+
            "erp_codbarra, \n"+
            "erp_artivo \n"+
            ")values( \n"+
            "@erp_codempresa, \n"+
            "@erp_codarticulo, \n"+
            "@erp_nitem, \n"+
            "@erp_codbarra, \n"+
            "@erp_artivo ) \n"
            );
          }
          //#endregion

          transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: true, codigo: "0", mensaje: ''});
        }catch(err){
          transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: false, codigo: "Err", mensaje: err.message});
        }
    });    
  } catch (err) {
    console.log(err.message);
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

router.post('/eliminar', async (req, res) => {
  try {

    const usuario = req.user.codigo_usuario;
    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{

          //#region Eliminar Presentacion Articulo
          const eliminar_presentacion_articulo  = new mssql.Request(transaction);
          await eliminar_presentacion_articulo
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codart',mssql.VarChar(250),req.body.Codigo)
          .query(
            " delete from erp_articulo_unidad where erp_codemp = @erp_codemp and erp_codart = @erp_codart "
          );
          //#endregion
          
          //#region Eliminar Nombre Presentacion Articulo
          const eliminar_nombre_presentacion_articulo = new mssql.Request(transaction);
          await eliminar_nombre_presentacion_articulo
          .input('erp_idempresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codart',mssql.VarChar(250),req.body.Codigo)
          .query(
            " delete from Erp_Art_Presentacion where erp_idempresa = @erp_idempresa and erp_codart = @erp_codart "
          );
          //#endregion

          //#region Eliminar Datos Tecnicos Articulo
          const eliminar_datos_tecnicos_articulo = new mssql.Request(transaction);
          await eliminar_datos_tecnicos_articulo
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codart',mssql.VarChar(250),req.body.Codigo)
          .query(
            " delete from Erp_Articulo_Datos_Tecnicos where erp_codemp = @erp_codemp and erp_codart = @erp_codart "
          );
          //#endregion

          //#region Eliminar Articulo Compras Precios
          const eliminar_articulo_compras_precios = new mssql.Request(transaction);
          await eliminar_articulo_compras_precios
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codart',mssql.VarChar(250),req.body.Codigo)
          .query(
            " delete from Erp_Lista_Precios_Proveedores where erp_codemp = @erp_codemp and erp_codart = @erp_codart "
          );
          //#endregion

          //#region Eliminar Lista Precios Cliente
          const eliminar_lista_precios_cliente = new mssql.Request(transaction);
          await eliminar_lista_precios_cliente
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codart',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from Erp_Lista_Precio_Cliente  where erp_codemp = @erp_codemp and erp_codart = @erp_codart"
          );
          //#endregion

          //#region Eliminar Articulo Codigos Alternativos
          const eliminar_articulo_codigos_alternativos = new mssql.Request(transaction);
          await eliminar_articulo_codigos_alternativos
          .input('erp_codempresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codarticulo',mssql.VarChar(250),req.body.Codigo)
          .query(
            " delete from erp_codbarra_articulo where erp_codempresa = @erp_codempresa and erp_codarticulo = @erp_codarticulo "
          );
          //#endregion

          //#region Eliminar Articulo
          const datos_articulo  = new mssql.Request(transaction);
          await datos_articulo
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_articulo',mssql.VarChar(250),req.body.Codigo)
          .query(
             " delete from Harticul where ccod_empresa = @ccod_empresa and ccod_articulo = @ccod_articulo \n"
          );
          //#endregion

          transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: true, codigo: "0", mensaje: ''});
        }catch(err){
          transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: false, codigo: "Err", mensaje: err.message});
        }
    });    
  } catch (err) {
    console.log(err.message);
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

module.exports = router;