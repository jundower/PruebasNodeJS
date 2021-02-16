const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');

router.post('/lista', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;

    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .query(
        "select \n"+
        "LTRIM(RTRIM(erp_codmot)) as Codigo,\n"+
        "erp_nommot as Nombre,\n"+
        "(erp_motivos_tramite.erp_codtid +' - '+Htipdoc.cnom_doc) as Tipo_Documento,\n"+
        "erp_rutfor as Formato,\n"+
        "erp_predeterminado as Predeterminado,\n"+
        "erp_motivos_tramite.ruta_impresora as Ruta_Impresora,\n"+
        "IpCliente as Pc_ip,\n"+
        "erp_motivos_tramite.erpusuario as Usuario,\n"+
        "convert(varchar,FechMod,103) as Fecha_Modificacion,\n"+
        "erp_motivos_tramite.NombreEquipo as Pc_user\n"+
        "from erp_motivos_tramite Inner Join Htipdoc On  \n"+
        "erp_motivos_tramite.erp_codemp = Htipdoc.ccod_empresa And  \n"+   
        "erp_motivos_tramite.erp_codtid = Htipdoc.ctip_doc \n"+
        "where erp_codemp = @codigo_empresa order by erp_codmot"
    );

    const recordset = lista.recordset;
    res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

router.post('/detalle', async (req, res) => {
    try {
      const codigo_empresa = req.user.codigo_empresa;
  
      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .input('codigo', mssql.VarChar(10), req.body.codigo)
      .query(
        " SELECT \n"+
        " LTRIM(RTRIM(erp_motivos_tramite_detalle.erp_sermot)) as Codigo_Serie,   \n"+
        " erp_motivos_tramite_detalle.erp_nummot as Numero\n"+
        " FROM erp_motivos_tramite_detalle  \n"+
        " WHERE erp_motivos_tramite_detalle.erp_codemp = @codigo_empresa  AND  \n"+
        " erp_motivos_tramite_detalle.erp_codmot = @codigo \n"
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
    var filas_motivos_tramites_series = JSON.parse(req.body.Lista_Motivos_Tramite_Series)

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{

          const request  = new mssql.Request(transaction);
          await request
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codmot',mssql.VarChar(250),req.body.Codigo)
          .input('erp_nommot',mssql.VarChar(250),req.body.Nombre)
          .input('erp_codtid',mssql.VarChar(250),req.body.Tipo_Documento)
          .input('erp_rutfor',mssql.VarChar(250),req.body.Ruta_Formato)
          .input('erp_predeterminado',mssql.VarChar(250),req.body.Predeterminado)
          .input('IpCliente',mssql.VarChar(250),'')
          .input('erpusuario',mssql.VarChar(250),usuario)
          .input('FechMod',mssql.VarChar(250),'')
          .input('NombreEquipo',mssql.VarChar(250),'')
          .input('ruta_impresora',mssql.VarChar(250),req.body.Ruta_Impresora)
          .query(            
            " insert into erp_motivos_tramite( \n"+
            " erp_codemp, \n"+
            " erp_codmot, \n"+
            " erp_nommot, \n"+
            " erp_codtid, \n"+
            " erp_rutfor, \n"+
            " erp_predeterminado, \n"+
            " IpCliente, \n"+
            " erpusuario, \n"+
            " FechMod, \n"+
            " NombreEquipo, \n"+
            " ruta_impresora \n"+
            " )values( \n"+
            " @erp_codemp, \n"+
            " @erp_codmot, \n"+
            " @erp_nommot, \n"+
            " @erp_codtid, \n"+
            " @erp_rutfor, \n"+
            " @erp_predeterminado, \n"+
            " @IpCliente, \n"+
            " @erpusuario, \n"+
            " getdate(), \n"+
            " @NombreEquipo, \n"+
            " @ruta_impresora) \n"
          );

          
          for (let i= 0; i< filas_motivos_tramites_series.length; i++){
            
            var fila = filas_motivos_tramites_series[i];
            const request_motivos_tramites_series  = new mssql.Request(transaction);
            await request_motivos_tramites_series
            .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
            .input('erp_codmot',mssql.VarChar(250),req.body.Codigo)
            .input('erp_sermot',mssql.VarChar(250),fila.Serie)
            .input('erp_nummot',mssql.VarChar(250),fila.Numero)
            .query(
              " insert into erp_motivos_tramite_detalle( \n"+
              " erp_codemp, \n"+
              " erp_codmot, \n"+
              " erp_sermot, \n"+
              " erp_nummot \n"+
              " )values( \n"+
              " @erp_codemp, \n"+
              " @erp_codmot, \n"+
              " @erp_sermot, \n"+
              " @erp_nummot) \n"
            );            
          }
            
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
    var filas_motivos_tramites_series = JSON.parse(req.body.Lista_Motivos_Tramite_Series)

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{
          const request  = new mssql.Request(transaction);
          await request
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codmot',mssql.VarChar(250),req.body.Codigo)
          .input('erp_nommot',mssql.VarChar(250),req.body.Nombre)
          .input('erp_codtid',mssql.VarChar(250),req.body.Tipo_Documento)
          .input('erp_rutfor',mssql.VarChar(250),req.body.Ruta_Formato)
          .input('erp_predeterminado',mssql.VarChar(250),req.body.Predeterminado)
          .input('IpCliente',mssql.VarChar(250),'')
          .input('erpusuario',mssql.VarChar(250),usuario)
          .input('FechMod',mssql.VarChar(250),'')
          .input('NombreEquipo',mssql.VarChar(250),'')
          .input('ruta_impresora',mssql.VarChar(250),req.body.Ruta_Impresora)
          .query(            
            " update erp_motivos_tramite set \n"+
            " erp_nommot = @erp_nommot, \n"+
            " erp_codtid = @erp_codtid, \n"+
            " erp_rutfor = @erp_rutfor, \n"+
            " erp_predeterminado = @erp_predeterminado, \n"+
            " IpCliente = @IpCliente, \n"+
            " erpusuario = @erpusuario, \n"+
            " FechMod = getdate(), \n"+
            " NombreEquipo = @NombreEquipo, \n"+
            " ruta_impresora = @ruta_impresora \n"+
            " where erp_codemp = @erp_codemp and erp_codmot = @erp_codmot \n"
          );

          const request_eliminar_detalle  = new mssql.Request(transaction);
          await request_eliminar_detalle
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codmot',mssql.VarChar(250),req.body.Codigo)
          .query(            
            " delete from erp_motivos_tramite_detalle \n"+
            " where erp_codemp = @erp_codemp and erp_codmot = @erp_codmot \n"
          );

          
          for (let i= 0; i< filas_motivos_tramites_series.length; i++){
            
            var fila = filas_motivos_tramites_series[i];
            const request_motivos_tramites_series  = new mssql.Request(transaction);
            await request_motivos_tramites_series
            .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
            .input('erp_codmot',mssql.VarChar(250),req.body.Codigo)
            .input('erp_sermot',mssql.VarChar(250),fila.Serie)
            .input('erp_nummot',mssql.VarChar(250),fila.Numero)
            .query(
              " insert into erp_motivos_tramite_detalle( \n"+
              " erp_codemp, \n"+
              " erp_codmot, \n"+
              " erp_sermot, \n"+
              " erp_nummot \n"+
              " )values( \n"+
              " @erp_codemp, \n"+
              " @erp_codmot, \n"+
              " @erp_sermot, \n"+
              " @erp_nummot) \n"
            );            
          }

          if (req.body.Predeterminado == 'S') {
            const request_actualizar_predeterminado  = new mssql.Request(transaction);
            await request_actualizar_predeterminado
            .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
            .input('erp_codmot',mssql.VarChar(250),req.body.Codigo)
            .input('erp_codtid',mssql.VarChar(250),req.body.Tipo_Documento)
            .query(            
              " update erp_motivos_tramite set  \n"+
              " erp_predeterminado = 'N' \n"+
              " where erp_codemp = @erp_codemp and erp_codtid = @erp_codtid  and erp_codmot <> @erp_codmot "
            );
          }
            
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
          const request  = new mssql.Request(transaction);
          await request
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codmot',mssql.VarChar(250),req.body.Codigo)
          .query(            
            " delete from erp_motivos_tramite where erp_codemp = @erp_codemp and erp_codmot = @erp_codmot \n"
          );

          const request_eliminar_detalle  = new mssql.Request(transaction);
          await request_eliminar_detalle
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codmot',mssql.VarChar(250),req.body.Codigo)
          .query(            
            " delete from erp_motivos_tramite_detalle \n"+
            " where erp_codemp = @erp_codemp and erp_codmot = @erp_codmot \n"
          );
            
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