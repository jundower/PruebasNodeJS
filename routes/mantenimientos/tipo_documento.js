const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');


router.get('/tipo_documento/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const pool = await poolPromise
  
          const lista = await pool
          .request()
          .input('id', mssql.VarChar(10), id)
          .query('select * from htipdoc where ccod_empresa = @id');
            
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
      
      res.send(err.message)
    }
  });
  
router.post('/lista/:modulo', async (req, res) => {
  try {
      const { modulo } = req.params;
      const codigo_empresa = req.user.codigo_empresa;
      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('id', mssql.VarChar(10), codigo_empresa)
      .input('modulo', mssql.VarChar(250), modulo)
      .query("Select \n"+ 
      "ltrim(rtrim(ctip_doc)) as Codigo,\n"+ 
      "ltrim(rtrim(ctip_doc)) + '-' + ltrim(rtrim(cnom_doc)) as Nombre,\n"+ 
      "codigo_sunat as Codigo_Sunat,\n"+ 
      "compras as Compras,\n"+ 
      "ventas as Ventas,\n"+ 
      "contabilidad as Contabilidad,\n"+ 
      "almacen as Almacen,\n"+ 
      "csigno as C_Signo,\n"+ 
      "porc_igv as Porc_Igv,\n"+ 
      "fecha_tc as Fecha_Tc,\n"+ 
      "CONVERT(VARCHAR(50),Tipodoc_fechModificacion,3) as Fecha_Modificacion,\n"+ 
      "NombreEquipo as Nombre_Equipo,\n"+ 
      "Ip_Cliente as Ip_Cliente\n"+ 
      "From htipdoc\n"+ 
      "Where ccod_empresa = @id \n"+ 
      "and case @modulo \n"+
      "when 'COMPRA' then compras \n"+
      "when 'VENTAS' then ventas \n"+
      "when 'CONTABILIDAD' then contabilidad \n"+
      "when 'ALMACEN' then almacen \n"+
      "when 'CAJA' then caja \n"+
      "when 'PTOVTA' then ptovta else 'S' end = 'S'\n"+
      "order by ctip_doc");
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

// router.post('/lista/:modulo', async (req, res) => {
//   try {
//       const { modulo } = req.params;
//       const codigo_empresa = req.user.codigo_empresa;
//       const pool = await poolPromise
//       const lista = await pool
//       .request()
//       .input('id', mssql.VarChar(10), codigo_empresa)
//       .input('modulo', mssql.VarChar(250), modulo)
//       .query("Select \n"+ 
//       "ltrim(rtrim(ctip_doc)) as Codigo,\n"+ 
//       "ltrim(rtrim(ctip_doc)) + '-' + ltrim(rtrim(cnom_doc)) as Nombre,\n"+ 
//       "codigo_sunat as Codigo_Sunat,\n"+ 
//       "compras as Compras,\n"+ 
//       "ventas as Ventas,\n"+ 
//       "contabilidad as Contabilidad,\n"+ 
//       "almacen as Almacen,\n"+ 
//       "csigno as C_Signo,\n"+ 
//       "porc_igv as Porc_Igv,\n"+ 
//       "fecha_tc as Fecha_Tc,\n"+ 
//       "CONVERT(VARCHAR(50),Tipodoc_fechModificacion,3) as Fecha_Modificacion,\n"+ 
//       "NombreEquipo as Nombre_Equipo,\n"+ 
//       "Ip_Cliente as Ip_Cliente\n"+ 
//       "From htipdoc\n"+ 
//       "Where ccod_empresa = @id \n"+ 
//       "and case @modulo \n"+
//       "when 'COMPRA' then compras \n"+
//       "when 'VENTAS' then ventas \n"+
//       "when 'CONTABILIDAD' then contabilidad \n"+
//       "when 'ALMACEN' then almacen \n"+
//       "when 'CAJA' then caja \n"+
//       "when 'PTOVTA' then ptovta else 'S' end = 'S'\n"+
//       "order by ctip_doc");
//       const recordset = lista.recordset;
//       res.json(recordset); 
//   } catch (err) {
    
//     res.send(err.message)
//   }
// });

router.post('/porcentaje', async(req, res) => {
 
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('tipo_documento', mssql.VarChar(25), req.body.tipo_documento)
    .query(
      " Select \n"+
      " Isnull ( porc_igv , '' ) as Porcentaje,\n"+
      " aplica_prc as Aplica_Procentaje,\n"+
      " min_a_prc as Minimo_Porcentaje,\n"+
      " renta_cuarta as Renta_Cuarta,\n"+
      " caja as Caja \n"+
      " From Htipdoc \n"+
      " Where ccod_empresa = @codigo_empresa And ctip_doc = @tipo_documento \n"
    );
    const recordset = lista.recordset;
    console.log(recordset);
    res.json(recordset); 
});

router.post('/fecha_tc', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('ctip_doc', mssql.VarChar(25), req.body.Codigo_Tipo_Documento)
    .query("Select  \n"+
    " ltrim(rtrim(ctip_doc)) as Codigo, \n"+
    " ltrim(rtrim(ctip_doc)) + '-' + ltrim(rtrim(cnom_doc)) as Nombre, \n"+
    " codigo_sunat as Codigo_Sunat, \n"+
    " porc_igv as Porc_Igv, \n"+
    " fecha_tc as Fecha_Tc\n"+
    " From htipdoc \n"+
    " Where ccod_empresa = @codigo_empresa  \n"+
    " and  ctip_doc = @ctip_doc");
          
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
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
       " LTRIM(RTRIM(ctip_doc)) as Codigo, \n"+
       " cnom_doc as Nombre, \n"+
       " codigo_sunat as Codigo_Sunat, \n"+
       " compras as Compras, \n"+
       " ventas as Ventas, \n"+
       " contabilidad as Contabilidad, \n"+
       " almacen as Almacen, \n"+
       " csigno as Csigno, \n"+
       " valor_signo as Valor_Signo, \n"+
       " aplica_prc as Aplica_Prc, \n"+
       " min_a_prc as Min_A_Prc, \n"+
       " gen_credfis as Genera_Credfis, \n"+
       " cantidad_caracteres as Cantidad_Caracteres, \n"+
       " porc_igv as Porcentaje_Igv, \n"+
       " renta_cuarta as Renta_Cuarta, \n"+
       " fecha_tc as Fecha_Tc, \n"+
       " ruta_formato as Ruta_Formato, \n"+
       " tipo_talonario as Tipo_Talonario, \n"+
       " caja as Caja, \n"+
       " CONVERT(VARCHAR,Tipodoc_fechModificacion,103) as Fecha_Modificacion, \n"+
       " NombreEquipo as PC, \n"+
       " HoraPc as Hora_Pc, \n"+
       " Ip_Cliente as Ip_Cliente, \n"+
       " ErpUsuario as Usuario, \n"+
       " ptovta as Punto_Venta, \n"+
       " tipo_formato as Tipo_Formato \n"+
       " from htipdoc  \n"+
       " where ccod_empresa = @Codigo_Empresa \n"
      );
      
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

router.post('/guardar', async (req, res) => {
  try {
    const usuario = req.user.codigo_usuario;
    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);

    await transaction.begin(async err => {
        try{

          //#region Guardar Tipo Documento
          const datos_tipo_documentos  = new mssql.Request(transaction);
          await datos_tipo_documentos
          .input('ccod_empresa', mssql.VarChar(250),req.user.codigo_empresa)
          .input('ctip_doc', mssql.VarChar(250),req.body.Codigo)
          .input('cnom_doc', mssql.VarChar(250),req.body.Nombre)
          .input('codigo_sunat', mssql.VarChar(250),req.body.Codigo_Sunat)
          .input('compras', mssql.VarChar(250),req.body.Compras)
          .input('ventas', mssql.VarChar(250),req.body.Ventas)
          .input('contabilidad', mssql.VarChar(250),req.body.Contabilidad)
          .input('almacen', mssql.VarChar(250),req.body.Almacen)
          .input('csigno', mssql.VarChar(250), req.body.Csigno)
          .input('valor_signo', mssql.VarChar(250),req.body.Csigno == "S"? '1':'-1')
          .input('aplica_prc', mssql.VarChar(250),req.body.Aplica_Percepcion)
          .input('min_a_prc', mssql.VarChar(250),req.body.Mnimo_Percepcion)
          .input('gen_credfis', mssql.VarChar(250),req.body.Genera_Credifis)
          .input('cantidad_caracteres', mssql.VarChar(250), req.body.Cantidad_Caracteres)
          .input('porc_igv', mssql.VarChar(250),req.body.Porcentaje_Igv)
          .input('renta_cuarta', mssql.VarChar(250),req.body.Renta_Cuarta)
          .input('fecha_tc', mssql.VarChar(250),req.body.Fecha_Tc)
          .input('ruta_formato', mssql.VarChar(250),req.body.Ruta_Formato)
          .input('tipo_talonario', mssql.VarChar(250),'NINGUNO')
          .input('caja', mssql.VarChar(250), req.body.Caja)
          .input('Tipodoc_fechModificacion', mssql.VarChar(250),'')
          .input('NombreEquipo', mssql.VarChar(250),'')
          .input('HoraPc', mssql.VarChar(250),'')
          .input('Ip_cliente', mssql.VarChar(250),'')
          .input('ErpUsuario', mssql.VarChar(250), usuario)
          .input('ptovta', mssql.VarChar(250), req.body.Punto_Venta)
          .input('tipo_formato', mssql.VarChar(250), req.body.Tipo_Formato)
          .query(
          " insert into htipdoc( \n"+
          " ccod_empresa, \n"+
          " ctip_doc, \n"+
          " cnom_doc, \n"+
          " codigo_sunat, \n"+
          " compras, \n"+
          " ventas, \n"+
          " contabilidad, \n"+
          " almacen, \n"+
          " csigno, \n"+
          " valor_signo, \n"+
          " aplica_prc, \n"+
          " min_a_prc, \n"+
          " gen_credfis, \n"+
          " cantidad_caracteres, \n"+
          " porc_igv, \n"+
          " renta_cuarta, \n"+
          " fecha_tc, \n"+
          " ruta_formato, \n"+
          " tipo_talonario, \n"+
          " caja, \n"+
          " Tipodoc_fechModificacion, \n"+
          " NombreEquipo, \n"+
          " HoraPc, \n"+
          " Ip_Cliente, \n"+
          " ErpUsuario, \n"+
          " ptovta, \n"+
          " tipo_formato \n"+
          " )values( \n"+
          " @ccod_empresa, \n"+
          " @ctip_doc, \n"+
          " @cnom_doc, \n"+
          " @codigo_sunat, \n"+
          " @compras, \n"+
          " @ventas, \n"+
          " @contabilidad, \n"+
          " @almacen, \n"+
          " @csigno, \n"+
          " @valor_signo, \n"+
          " @aplica_prc, \n"+
          " @min_a_prc, \n"+
          " @gen_credfis, \n"+
          " @cantidad_caracteres, \n"+
          " @porc_igv, \n"+
          " @renta_cuarta, \n"+
          " @fecha_tc, \n"+
          " @ruta_formato, \n"+
          " @tipo_talonario, \n"+
          " @caja, \n"+
          " getdate(), \n"+
          " @NombreEquipo, \n"+
          " CONVERT(VARCHAR,getdate(),8), \n"+
          " @Ip_Cliente, \n"+
          " @ErpUsuario, \n"+
          " @ptovta, \n"+
          " @tipo_formato ) \n"
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
    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);

    await transaction.begin(async err => {
        try{

          //#region Modificar Tipo Documento
          const datos_tipo_documentos  = new mssql.Request(transaction);
          await datos_tipo_documentos
          .input('ccod_empresa', mssql.VarChar(250),req.user.codigo_empresa)
          .input('ctip_doc', mssql.VarChar(250),req.body.Codigo)
          .input('cnom_doc', mssql.VarChar(250),req.body.Nombre)
          .input('codigo_sunat', mssql.VarChar(250),req.body.Codigo_Sunat)
          .input('compras', mssql.VarChar(250),req.body.Compras)
          .input('ventas', mssql.VarChar(250),req.body.Ventas)
          .input('contabilidad', mssql.VarChar(250),req.body.Contabilidad)
          .input('almacen', mssql.VarChar(250),req.body.Almacen)
          .input('csigno', mssql.VarChar(250), req.body.Csigno)
          .input('valor_signo', mssql.VarChar(250),req.body.Csigno == "S"? '1':'-1')
          .input('aplica_prc', mssql.VarChar(250),req.body.Aplica_Percepcion)
          .input('min_a_prc', mssql.VarChar(250),req.body.Mnimo_Percepcion)
          .input('gen_credfis', mssql.VarChar(250),req.body.Genera_Credifis)
          .input('cantidad_caracteres', mssql.VarChar(250), req.body.Cantidad_Caracteres)
          .input('porc_igv', mssql.VarChar(250),req.body.Porcentaje_Igv)
          .input('renta_cuarta', mssql.VarChar(250),req.body.Renta_Cuarta)
          .input('fecha_tc', mssql.VarChar(250),req.body.Fecha_Tc)
          .input('ruta_formato', mssql.VarChar(250),req.body.Ruta_Formato)
          .input('tipo_talonario', mssql.VarChar(250),'NINGUNO')
          .input('caja', mssql.VarChar(250), req.body.Caja)
          .input('Tipodoc_fechModificacion', mssql.VarChar(250),'')
          .input('NombreEquipo', mssql.VarChar(250),'')
          .input('HoraPc', mssql.VarChar(250),'')
          .input('Ip_cliente', mssql.VarChar(250),'')
          .input('ErpUsuario', mssql.VarChar(250), usuario)
          .input('ptovta', mssql.VarChar(250), req.body.Punto_Venta)
          .input('tipo_formato', mssql.VarChar(250), req.body.Tipo_Formato)
          .query(
          " update htipdoc set \n"+
          " cnom_doc = @cnom_doc, \n"+
          " codigo_sunat = @codigo_sunat, \n"+
          " compras = @compras, \n"+
          " ventas = @ventas, \n"+
          " contabilidad = @contabilidad, \n"+
          " almacen = @almacen, \n"+
          " csigno = @csigno, \n"+
          " valor_signo = @valor_signo, \n"+
          " aplica_prc = @aplica_prc, \n"+
          " min_a_prc = @min_a_prc, \n"+
          " gen_credfis = @gen_credfis, \n"+
          " cantidad_caracteres = @cantidad_caracteres, \n"+
          " porc_igv = @porc_igv, \n"+
          " renta_cuarta = @renta_cuarta, \n"+
          " fecha_tc = @fecha_tc, \n"+
          " ruta_formato = @ruta_formato, \n"+
          " tipo_talonario = @tipo_talonario, \n"+
          " caja = @caja, \n"+
          " Tipodoc_fechModificacion = getdate(), \n"+
          " NombreEquipo = @NombreEquipo, \n"+
          " HoraPc =  CONVERT(VARCHAR,getdate(),8), \n"+
          " Ip_Cliente = @Ip_Cliente, \n"+
          " ErpUsuario = @ErpUsuario, \n"+
          " ptovta = @ptovta, \n"+
          " tipo_formato = @tipo_formato \n"+
          " where ccod_empresa = @ccod_empresa and ctip_doc = @ctip_doc \n"
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

router.post('/eliminar', async (req, res) => {
  try {
    const usuario = req.user.codigo_usuario;
    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);

    await transaction.begin(async err => {
        try{

          //#region Eliminar Tipo Documento
          const datos_tipo_documentos  = new mssql.Request(transaction);
          await datos_tipo_documentos
          .input('ccod_empresa', mssql.VarChar(250),req.user.codigo_empresa)
          .input('ctip_doc', mssql.VarChar(250),req.body.Codigo)
          .query(
          " delete from htipdoc \n"+
          " where ccod_empresa = @ccod_empresa and ctip_doc = @ctip_doc \n"
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