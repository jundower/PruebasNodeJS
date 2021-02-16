const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');

router.post('/serie_documento', async (req, res) => {
  try{
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('punto_venta', mssql.VarChar(250), req.body.punto_venta)
    .input('tipo_documento', mssql.VarChar(250), req.body.tipo_documento)
    .query("select * from Htalonar where ccod_empresa=@codigo_empresa and ccod_almacen=@punto_venta and tip_doc=@tipo_documento ");

    const recordset = lista.recordset;

    res.json(recordset);
  }catch(err){
    if(req.user==null){
      res.send("El usuario ha sido expulsado");
    }else{
      res.send(err.message)
    }
  }
});
router.post('/serie_documento_correlativo', async (req, res) => {
  try{
    const codigo_empresa = req.user.codigo_empresa;

    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('punto_venta', mssql.VarChar(250), req.body.punto_venta)
    .input('tipo_documento', mssql.VarChar(250), req.body.tipo_documento)
    .input('serie_documento', mssql.VarChar(250), req.body.serie_documento)
    .query("select * from Htalonar where ccod_empresa=@codigo_empresa and ccod_almacen=@punto_venta and tip_doc=@tipo_documento and cnum_serie= @serie_documento ");

    const recordset = lista.recordset;
    res.json(recordset);
  }catch(err){
    if(req.user==null){
      res.send("El usuario ha sido expulsado");
    }else{
      res.send(err.message)
    }
  }
});

router.post('/motivos_tramite', async (req, res) => {
  try{
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('tipo_documento', mssql.VarChar(250), req.body.tipo_documento)
    .query("select \n"+
    "LTRIM(RTRIM(erp_codmot)) as Codigo,\n"+
    "erp_nommot as Nombre,\n"+
    "erp_codtid as Tipo_Documento,\n"+
    "erp_rutfor as Formato,\n"+
    "erp_predeterminado as Predeterminado,\n"+
    "IpCliente as Pc_ip,\n"+
    "erpusuario as Usuario,\n"+
    "FechMod as Pc_Fecha,\n"+
    "NombreEquipo as Pc_user\n"+
    "from erp_motivos_tramite \n"+
    "where erp_codemp = @codigo_empresa and erp_codtid = @tipo_documento order by Predeterminado desc "
    );
    const recordset = lista.recordset;
    res.json(recordset);
  }catch(err){
    if(req.user==null){
      res.send("El usuario ha sido expulsado");
    }else{
      res.send(err.message)
    }
  }
});

router.post('/motivos_series', async (req, res) => {
  try {
      const codigo_empresa = req.user.codigo_empresa;
      var codigo_punto_venta = req.body.codigo_punto_venta;
      if(codigo_punto_venta == null || codigo_punto_venta.trim()===''){
          codigo_punto_venta = req.user.codigo_punto_venta;
      }
      const pool = await poolPromise;
      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .input('tipo_documento', mssql.VarChar(250), req.body.tipo_documento)
      .input('punto_venta', mssql.VarChar(250), codigo_punto_venta)
      .query(
        "select \n"+
        "HTALONAR.ccod_almacen as Punto_Venta, \n"+
        "HTALONAR.tip_doc as Tipo_Documento, \n"+
        "Ltrim(rtrim(HTALONAR.cnum_serie)) as Codigo, \n"+
        "Ltrim(rtrim(HTALONAR.cnum_serie)) as Nombre, \n"+
        "HTALONAR.activo as Activo, \n"+
        "HTALONAR.predeterminado as Predeterminado, \n"+
        "HTALONAR.ruta_formato as Ruta_Formato, \n"+
        "HTALONAR.talonar_fechmodificacion as Fecha_Modificacion, \n"+
        "HTALONAR.NombreEquipo as Nombre_Equipo, \n"+
        "HTALONAR.HoraPc as Hora_PC, \n"+
        "HTALONAR.Ip_Cliente as IP_Cliente, \n"+
        "HTALONAR.ErpUsuario as Usuario \n"+
        "FROM HTALONAR \n"+
        "INNER JOIN Halmacen ON \n"+
        "HTALONAR.ccod_almacen = Halmacen.ccod_almacen AND \n"+
        "HTALONAR.ccod_empresa = Halmacen.ccod_empresa \n"+
        "INNER JOIN HTIPDOC ON \n"+
        "HTALONAR.tip_doc = HTIPDOC.ctip_doc AND \n"+
        "HTALONAR.ccod_empresa = HTIPDOC.ccod_empresa \n"+
        "WHERE HTALONAR.ccod_empresa = @codigo_empresa \n"+
        "and HTALONAR.ccod_almacen = @punto_venta \n"+
        "and HTALONAR.tip_doc = case @tipo_documento when 'TODOS' then HTALONAR.tip_doc else @tipo_documento end  \n"+
        "AND activo = 'S' \n"+
        "ORDER BY HTALONAR.predeterminado desc,HTALONAR.cnum_serie asc ");

      const recordset = lista.recordset;
      res.json(recordset);
  } catch (err) {
    if(req.user==null){
      res.send("El usuario ha sido expulsado");
    }else{
      res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
  }
});

router.post('/motivos_tramite_correlativo', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise;
    
    var lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('tipo_documento', mssql.VarChar(250), req.body.tipo_documento)
    .query("select \n"+
    "Isnull(cantidad_caracteres,0) as cantidad_ceros\n"+
    "from htipdoc \n"+
    "where ccod_empresa = @codigo_empresa and ctip_doc = @tipo_documento ");
    
    var recordset = lista.recordset;
    var cantidad_ceros = recordset[0].cantidad_ceros;

    lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('motivo', mssql.VarChar(250), req.body.motivo)
    .input('anio', mssql.VarChar(250), req.body.anio)
    .query("select \n"+
    "erp_nummot as correlativo\n"+
    "from Erp_motivos_tramite_detalle \n"+
    "where erp_codemp = @codigo_empresa and erp_codmot = @motivo and erp_sermot = @anio");

    recordset = lista.recordset;
    if ( recordset.length > 0){
      var ceros="0";
      for(i=1;i<cantidad_ceros;i++){
          ceros+="0";
      }
      var correlativo=  recordset[0].correlativo;
      correlativo = correlativo + 1 ;
      correlativo = (ceros + correlativo).substr(-1 * cantidad_ceros,cantidad_ceros);
      if (req.body.motivo == 'DUA') {
        res.send(correlativo);
      }else{
        res.send(req.body.anio + '-' + correlativo);
      }
      
    }else{
      res.send("-");
    }
  } catch (err) {
    if(req.user==null){
      res.send("El usuario ha sido expulsado");
    }else{
      res.send(err.message);
    }
  }
});

router.post('/motivos_serie_correlativo', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    var codigo_punto_venta = req.body.codigo_punto_venta;
    if(codigo_punto_venta == null || codigo_punto_venta.trim()===''){
        codigo_punto_venta = req.user.codigo_punto_venta;
    }
    const pool = await poolPromise;
    var lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('tipo_documento', mssql.VarChar(250), req.body.tipo_documento)
    .query("select \n"+
    "Isnull(cantidad_caracteres,0) as cantidad_ceros\n"+
    "from htipdoc \n"+
    "where ccod_empresa = @codigo_empresa and ctip_doc = @tipo_documento "
    );

    var recordset = lista.recordset;
    var cantidad_ceros = recordset[0].cantidad_ceros;

    lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('punto_venta', mssql.VarChar(250), codigo_punto_venta)
    .input('tipo_documento', mssql.VarChar(250), req.body.tipo_documento)
    .input('serie_documento', mssql.VarChar(250), req.body.serie_documento)
    .query("select ultimo_grab as correlativo from Htalonar where ccod_empresa=@codigo_empresa and ccod_almacen=@punto_venta and tip_doc=@tipo_documento and cnum_serie= @serie_documento ");

    recordset = lista.recordset;
    if ( recordset.length > 0){
      var ceros="0";
      for(i=1;i<cantidad_ceros;i++){
          ceros+="0";
      }
      var correlativo=  recordset[0].correlativo;
      correlativo = correlativo + 1 ;
      correlativo = (ceros + correlativo).substr(-1 * cantidad_ceros,cantidad_ceros);

      res.send(correlativo);
    }else{
      res.send("-");
    }
  } catch (err) {
    if(req.user==null){
      res.send("El usuario ha sido expulsado");
    }else{
      res.send({estado: false, codigo: err.number, mensaje: err.message});
    }
  }
  
});

router.post('/lista', async (req, res) => {
  try {
      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('Codigo_Empresa', mssql.VarChar(10), req.user.codigo_empresa)
      .query(
      " select  \n"+
      " Htalonar.ccod_empresa as Codigo_Empresa, \n"+
      " (Htalonar.ccod_almacen) as Codigo, \n"+
      " (Htalonar.ccod_almacen+' - '+Halmacen.cnom_almacen) as Punto_Venta, \n"+
      " (tip_doc) as Nombre, \n"+
      " (tip_doc+' - '+Htipdoc.cnom_doc) as Tipo_Documento, \n"+
      " cnum_serie as Numero_Serie, \n"+
      " ultimo_grab as Ultimo_Grab, \n"+
      " activo as Activo, \n"+
      " predeterminado as Predeterminado, \n"+
      " Htalonar.ruta_formato as Ruta_Formato, \n"+
      " num_filas as Num_Filas, \n"+
      " erp_ancho as Ancho, \n"+
      " erp_a4 as A4, \n"+
      " erp_alto as Alto, \n"+
      " convert(varchar,talonar_fechmodificacion,103) as Fecha_Modificacion, \n"+
      " Htalonar.NombreEquipo as PC, \n"+
      " CONVERT(VARCHAR,Htalonar.HoraPc,8) as Hora_Pc, \n"+
      " Htalonar.Ip_Cliente as Ip_Cliente, \n"+
      " Htalonar.ErpUsuario as Usuario \n"+
      " from Htalonar inner join Halmacen \n"+
      " on Htalonar.ccod_empresa = Halmacen.ccod_empresa \n"+
      " and Htalonar.ccod_almacen = Halmacen.ccod_almacen \n"+
      " inner join Htipdoc on \n"+
      " Htalonar.ccod_empresa = Htipdoc.ccod_empresa and  \n"+
      " Htalonar.tip_doc = Htipdoc.ctip_doc \n"+
      " where Htalonar.ccod_empresa = @Codigo_Empresa \n"
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

router.post('/guardar', async (req, res) => {
  try {
    const usuario = req.user.codigo_usuario;
    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);

    await transaction.begin(async err => {
        try{
          
          //#region Guardar Talonario
          const guardar_datos_talonario  = new mssql.Request(transaction);
          await guardar_datos_talonario
          .input('ccod_empresa', mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_almacen', mssql.VarChar(250),req.body.Punto_Venta)
          .input('tip_doc', mssql.VarChar(250),req.body.Tipo_Documento)
          .input('cnum_serie', mssql.VarChar(250),req.body.Serie)
          .input('ultimo_grab', mssql.VarChar(250),req.body.Ultimo_Grabado)
          .input('activo', mssql.VarChar(250),req.body.Activo)
          .input('predeterminado', mssql.VarChar(250),req.body.Predeterminado)
          .input('ruta_formato', mssql.VarChar(250),req.body.Ruta_Formato)
          .input('num_filas', mssql.VarChar(250), req.body.Numero_Filas)
          .input('erp_ancho', mssql.VarChar(250),req.body.Ancho)
          .input('erp_a4', mssql.VarChar(250),req.body.A4)
          .input('erp_alto', mssql.VarChar(250),req.body.Alto)
          .input('talonar_fechmodificacion', mssql.VarChar(250),'')
          .input('NombreEquipo', mssql.VarChar(250), '')
          .input('HoraPc', mssql.VarChar(250),'')
          .input('Ip_Cliente', mssql.VarChar(250),'')
          .input('ErpUsuario', mssql.VarChar(250),usuario)
          .query(
           " insert into Htalonar(  \n"+
           " ccod_empresa,  \n"+
           " ccod_almacen, \n"+
           " tip_doc, \n"+
           " cnum_serie, \n"+
           " ultimo_grab, \n"+
           " activo, \n"+
           " predeterminado, \n"+
           " ruta_formato, \n"+
           " num_filas, \n"+
           " erp_ancho, \n"+
           " erp_a4, \n"+
           " erp_alto, \n"+
           " talonar_fechmodificacion, \n"+
           " NombreEquipo, \n"+
           " HoraPc, \n"+
           " Ip_Cliente, \n"+
           " ErpUsuario \n"+
           " )values( \n"+
           " @ccod_empresa,  \n"+
           " @ccod_almacen, \n"+
           " @tip_doc, \n"+
           " @cnum_serie, \n"+
           " @ultimo_grab, \n"+
           " @activo, \n"+
           " @predeterminado, \n"+
           " @ruta_formato, \n"+
           " @num_filas, \n"+
           " @erp_ancho, \n"+
           " @erp_a4, \n"+
           " @erp_alto, \n"+
           " getdate(), \n"+
           " @NombreEquipo, \n"+
           " CONVERT(VARCHAR,getdate(),8), \n"+
           " @Ip_Cliente, \n"+
           " @ErpUsuario) \n"
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
    if(req.user==null){
      res.send("El usuario ha sido expulsado");
    }else{
      res.send({estado: false, codigo: "Err", mensaje: err.message});
    }
  }
});

router.post('/modificar', async (req, res) => {
  try {
    const usuario = req.user.codigo_usuario;
    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    await transaction.begin(async err => {
        try{

          //#region Modificar Talonario
          const modificar_datos_talonario  = new mssql.Request(transaction);
          await modificar_datos_talonario
          .input('ccod_empresa', mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_almacen', mssql.VarChar(250),req.body.Punto_Venta)
          .input('tip_doc', mssql.VarChar(250),req.body.Tipo_Documento)
          .input('cnum_serie', mssql.VarChar(250),req.body.Serie)
          .input('ultimo_grab', mssql.VarChar(250),req.body.Ultimo_Grabado)
          .input('activo', mssql.VarChar(250),req.body.Activo)
          .input('predeterminado', mssql.VarChar(250),req.body.Predeterminado)
          .input('ruta_formato', mssql.VarChar(250),req.body.Ruta_Formato)
          .input('num_filas', mssql.VarChar(250), req.body.Numero_Filas)
          .input('erp_ancho', mssql.VarChar(250),req.body.Ancho)
          .input('erp_a4', mssql.VarChar(250),req.body.A4)
          .input('erp_alto', mssql.VarChar(250),req.body.Alto)
          .input('talonar_fechmodificacion', mssql.VarChar(250),'')
          .input('NombreEquipo', mssql.VarChar(250), '')
          .input('HoraPc', mssql.VarChar(250),'')
          .input('Ip_Cliente', mssql.VarChar(250),'')
          .input('ErpUsuario', mssql.VarChar(250),usuario)
          .query(
           " update Htalonar set \n"+
           " ultimo_grab = @ultimo_grab, \n"+
           " activo = @activo, \n"+
           " predeterminado = @predeterminado, \n"+
           " ruta_formato = @ruta_formato, \n"+
           " num_filas = @num_filas, \n"+
           " erp_ancho = @erp_ancho, \n"+
           " erp_a4 = @erp_a4, \n"+
           " erp_alto = @erp_alto, \n"+
           " talonar_fechmodificacion = getdate(), \n"+
           " NombreEquipo = @NombreEquipo, \n"+
           " HoraPc = CONVERT(VARCHAR,getdate(),8), \n"+
           " Ip_Cliente = @Ip_Cliente, \n"+
           " ErpUsuario = @ErpUsuario \n"+
           " where ccod_empresa = @ccod_empresa and ccod_almacen = @ccod_almacen  \n"+
           " and tip_doc = @tip_doc  and cnum_serie = @cnum_serie"
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
    if(req.user==null){
      res.send("El usuario ha sido expulsado");
    }else{
      res.send({estado: false, codigo: "Err", mensaje: err.message});
    }
  }
});

router.post('/eliminar', async (req, res) => {
  try {
    const usuario = req.user.codigo_usuario;
    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);

    await transaction.begin(async err => {
        try{

          //#region Eliminar Talonarios
          const datos_talonarios  = new mssql.Request(transaction);
          await datos_talonarios
          .input('ccod_empresa', mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_almacen', mssql.VarChar(250),req.body.Punto_Venta)
          .input('tip_doc', mssql.VarChar(250),req.body.Tipo_Documento)
          .input('cnum_serie', mssql.VarChar(250),req.body.Serie)
          .query(
          " delete from Htalonar \n"+
          " where ccod_empresa = @ccod_empresa and ccod_almacen = @ccod_almacen  \n"+
          " and tip_doc = @tip_doc  and cnum_serie = @cnum_serie"
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
    if(req.user==null){
      res.send("El usuario ha sido expulsado");
    }else{
      res.send({estado: false, codigo: "Err", mensaje: err.message});
    }
  }
});

module.exports = router;