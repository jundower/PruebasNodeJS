const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');

router.get('/centro_costos/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const pool = await poolPromise
  
          const lista = await pool
          .request()
          .input('id', mssql.VarChar(10), id)
          .query('select * from Hcencos where ccod_empresa = @id');
            
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
      res.send(err.message)
    }
  });
  
router.post('/lista', async (req, res) => {
  try {
      const codigo_empresa = req.user.codigo_empresa;
      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .query(
       " select  \n"+
       " LTRIM(RTRIM(ccod_cencos)) as Codigo, \n"+
       " LTRIM(RTRIM(cnom_cencos)) as Nombre, \n"+
       " responsable as Responsable, \n"+
       " abrev as Abreviatura, \n"+
       " erp_nivel as Nivel, \n"+
       " erp_digitos as Digitos, \n"+
       " CONVERT(VARCHAR,Hcencos_fechmodificacion,103) as Fecha_Modificacion, \n"+
       " NombreEquipo as Pc_user, \n"+
       " CONVERT(VARCHAR,HoraPc,8) as Pc_Fecha, \n"+
       " Ip_Cliente as Pc_ip, \n"+
       " ErpUsuario as Usuario \n"+
       " from Hcencos \n"+
       " where ccod_empresa = @codigo_empresa ORDER BY ccod_cencos \n"
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
          
          const request  = new mssql.Request(transaction);
          await request
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_cencos',mssql.VarChar(250),req.body.Codigo)
          .input('cnom_cencos',mssql.VarChar(250),req.body.Nombre)
          .input('responsable',mssql.VarChar(250),req.body.Responsable)
          .input('abrev',mssql.VarChar(250),req.body.Abreviatura)
          .input('erp_nivel',mssql.VarChar(250),req.body.Nivel)
          .input('erp_digitos',mssql.VarChar(250),req.body.Digitos)
          .input('Hcencos_fechmodificacion',mssql.VarChar(250),'')
          .input('NombreEquipo',mssql.VarChar(250),'')
          .input('HoraPc',mssql.VarChar(250),'')
          .input('Ip_Cliente',mssql.VarChar(250),'')
          .input('ErpUsuario',mssql.VarChar(250), usuario)
          .query(            
           " insert into Hcencos( \n"+
           " ccod_empresa, \n"+
           " ccod_cencos, \n"+
           " cnom_cencos, \n"+
           " responsable, \n"+
           " abrev, \n"+
           " erp_nivel, \n"+
           " erp_digitos, \n"+
           " Hcencos_fechmodificacion, \n"+
           " NombreEquipo, \n"+
           " HoraPc, \n"+
           " Ip_Cliente, \n"+
           " ErpUsuario \n"+
           " )values( \n"+
           " @ccod_empresa, \n"+
           " @ccod_cencos, \n"+
           " @cnom_cencos, \n"+
           " @responsable, \n"+
           " @abrev, \n"+
           " @erp_nivel, \n"+
           " @erp_digitos, \n"+
           " getdate(), \n"+
           " @NombreEquipo, \n"+
           " convert(varchar,getdate(),8), \n"+
           " @Ip_Cliente, \n"+
           " @ErpUsuario) \n"
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
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_cencos',mssql.VarChar(250),req.body.Codigo)
          .input('cnom_cencos',mssql.VarChar(250),req.body.Nombre)
          .input('responsable',mssql.VarChar(250),req.body.Responsable)
          .input('abrev',mssql.VarChar(250),req.body.Abreviatura)
          .input('erp_nivel',mssql.VarChar(250),req.body.Nivel)
          .input('erp_digitos',mssql.VarChar(250),req.body.Digitos)
          .input('Hcencos_fechmodificacion',mssql.VarChar(250),'')
          .input('NombreEquipo',mssql.VarChar(250),'')
          .input('HoraPc',mssql.VarChar(250),'')
          .input('Ip_Cliente',mssql.VarChar(250),'')
          .input('ErpUsuario',mssql.VarChar(250), usuario)
          .query(            
           " update Hcencos set \n"+
           " cnom_cencos = @cnom_cencos, \n"+
           " responsable = @responsable, \n"+
           " abrev = @abrev, \n"+
           " erp_nivel = @erp_nivel, \n"+
           " erp_digitos = @erp_digitos, \n"+
           " Hcencos_fechmodificacion = getdate(), \n"+
           " NombreEquipo = @NombreEquipo, \n"+
           " HoraPc = convert(varchar,getdate(),8), \n"+
           " Ip_Cliente = @Ip_Cliente, \n"+
           " ErpUsuario = @ErpUsuario where ccod_empresa = @ccod_empresa and ccod_cencos = @ccod_cencos\n"
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
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_cencos',mssql.VarChar(250),req.body.Codigo)
          .query(            
           " delete from Hcencos where ccod_empresa = @ccod_empresa and ccod_cencos = @ccod_cencos\n"
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