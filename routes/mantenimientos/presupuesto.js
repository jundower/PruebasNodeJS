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
      .query("SELECT \n"+
      "erp_codpart as Codigo,\n"+
      "erp_nompart as Nombre,\n"+
      "erp_abrev as Abreviatura,\n"+
      "erp_responsable as Responsable,\n"+
      "CONVERT(VARCHAR,PartPresupCab_fechmodificacion,103) as Fecha_Modificacion,\n"+
      "NombreEquipo as Pc_user,\n"+
      "CONVERT(VARCHAR,HoraPc,8) as Pc_Fecha,\n"+
      "Ip_Cliente as Pc_ip,\n"+
      "ErpUsuario as Usuario,\n"+
      "erp_nivel as Nivel\n"+
      "FROM Erp_Partida_Presupuestal_Cab\n"+
      "WHERE erp_codemp = @codigo_empresa");
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
          
          const request  = new mssql.Request(transaction);
          await request
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codpart',mssql.VarChar(250),req.body.Codigo)
          .input('erp_nompart',mssql.VarChar(250),req.body.Nombre)
          .input('erp_responsable',mssql.VarChar(250),req.body.Responsable)
          .input('erp_abrev',mssql.VarChar(250),req.body.Abreviatura)
          .input('erp_nivel',mssql.VarChar(250),req.body.Nivel)
          .input('PartPresupCab_fechmodificacion',mssql.VarChar(250),'')
          .input('NombreEquipo',mssql.VarChar(250),'')
          .input('HoraPc',mssql.VarChar(250),'')
          .input('Ip_Cliente',mssql.VarChar(250),'')
          .input('ErpUsuario',mssql.VarChar(250), usuario)
          .query(            
           " insert into Erp_Partida_Presupuestal_Cab( \n"+
           " erp_codemp, \n"+
           " erp_codpart, \n"+
           " erp_abrev, \n"+
           " erp_nompart, \n"+
           " erp_responsable, \n"+
           " PartPresupCab_fechmodificacion, \n"+
           " NombreEquipo, \n"+
           " HoraPc, \n"+
           " Ip_Cliente, \n"+
           " ErpUsuario, \n"+
           " erp_nivel \n"+
           " )values( \n"+
           " @erp_codemp, \n"+
           " @erp_codpart, \n"+
           " @erp_abrev, \n"+
           " @erp_nompart, \n"+
           " @erp_responsable, \n"+
           " getdate(), \n"+
           " @NombreEquipo, \n"+
           " convert(varchar,getdate(),8), \n"+
           " @Ip_Cliente, \n"+
           " @ErpUsuario, \n"+
           " @erp_nivel) \n"
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

router.post('/modificar', async (req, res) => {
  try {
    const usuario = req.user.codigo_usuario;

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{
          
          const request  = new mssql.Request(transaction);
          await request
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codpart',mssql.VarChar(250),req.body.Codigo)
          .input('erp_nompart',mssql.VarChar(250),req.body.Nombre)
          .input('erp_responsable',mssql.VarChar(250),req.body.Responsable)
          .input('erp_abrev',mssql.VarChar(250),req.body.Abreviatura)
          .input('erp_nivel',mssql.VarChar(250),req.body.Nivel)
          .input('PartPresupCab_fechmodificacion',mssql.VarChar(250),'')
          .input('NombreEquipo',mssql.VarChar(250),'')
          .input('HoraPc',mssql.VarChar(250),'')
          .input('Ip_Cliente',mssql.VarChar(250),'')
          .input('ErpUsuario',mssql.VarChar(250), usuario)
          .query(            
           " update Erp_Partida_Presupuestal_Cab set \n"+
           " erp_abrev = @erp_abrev, \n"+
           " erp_nompart = @erp_nompart, \n"+
           " erp_responsable = @erp_responsable, \n"+
           " PartPresupCab_fechmodificacion = getdate(), \n"+
           " NombreEquipo = @NombreEquipo, \n"+
           " HoraPc = convert(varchar,getdate(),8), \n"+
           " Ip_Cliente = @Ip_Cliente, \n"+
           " ErpUsuario = @ErpUsuario, \n"+
           " erp_nivel = @erp_nivel \n"+
           " where erp_codemp = @erp_codemp and erp_codpart = @erp_codpart \n"
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
          .input('erp_codpart',mssql.VarChar(250),req.body.Codigo)
          .query(            
           " delete from Erp_Partida_Presupuestal_Cab where erp_codemp = @erp_codemp and erp_codpart = @erp_codpart \n"
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