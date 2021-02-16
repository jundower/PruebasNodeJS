const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');


router.get('/unidad_negocios/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const pool = await poolPromise
  
          const lista = await pool
          .request()
          .input('id', mssql.VarChar(10), id)
          .query('select * from erp_unidad_negocio where erp_codemp = @id');
            
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
      .input('id', mssql.VarChar(10), codigo_empresa)
      .query(
        "select \n"+
        "RTrim(erp_codune) as Codigo, \n"+
        "LTrim(RTrim(erp_nomune ))  as Nombre, \n"+
        "erp_dirune as Direccion, \n"+
        "CONVERT(VARCHAR,erp_unidad_negocio_fechmodificacion,103) as Fecha_Modificacion, \n"+
        "NombreEquipo as Pc_user, \n"+
        "CONVERT(VARCHAR,HoraPc,8) as Pc_Fecha, \n"+
        "Ip_Cliente as Pc_ip, \n"+
        "ErpUsuario as Usuario, \n"+
        "erp_nivel as Nivel \n"+
        "from erp_unidad_negocio where \n"+
        "erp_codemp = @id order by erp_codune"
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
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codune',mssql.VarChar(250),req.body.Codigo)
          .input('erp_nomune',mssql.VarChar(250),req.body.Nombre)
          .input('erp_dirune',mssql.VarChar(250),req.body.Direccion)
          .input('erp_unidad_negocio_fechmodificacion',mssql.VarChar(250),'')
          .input('NombreEquipo',mssql.VarChar(250),'')
          .input('HoraPc',mssql.VarChar(250),'')
          .input('Ip_Cliente',mssql.VarChar(250),'')
          .input('ErpUsuario',mssql.VarChar(250),usuario)
          .input('erp_nivel',mssql.VarChar(250),req.body.Nivel)
          .query(            
           " insert into erp_unidad_negocio( \n"+
           " erp_codemp, \n"+
           " erp_codune, \n"+
           " erp_nomune, \n"+
           " erp_dirune, \n"+
           " erp_unidad_negocio_fechmodificacion, \n"+
           " NombreEquipo, \n"+
           " HoraPc, \n"+
           " Ip_Cliente, \n"+
           " ErpUsuario, \n"+
           " erp_nivel \n"+
           " )values( \n"+
           " @erp_codemp, \n"+
           " @erp_codune, \n"+
           " @erp_nomune, \n"+
           " @erp_dirune, \n"+
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
          .input('erp_codune',mssql.VarChar(250),req.body.Codigo)
          .input('erp_nomune',mssql.VarChar(250),req.body.Nombre)
          .input('erp_dirune',mssql.VarChar(250),req.body.Direccion)
          .input('erp_unidad_negocio_fechmodificacion',mssql.VarChar(250),'')
          .input('NombreEquipo',mssql.VarChar(250),'')
          .input('HoraPc',mssql.VarChar(250),'')
          .input('Ip_Cliente',mssql.VarChar(250),'')
          .input('ErpUsuario',mssql.VarChar(250),usuario)
          .input('erp_nivel',mssql.VarChar(250),req.body.Nivel)
          .query(            
           " update erp_unidad_negocio set \n"+
           " erp_nomune = @erp_nomune, \n"+
           " erp_dirune = @erp_dirune, \n"+
           " erp_unidad_negocio_fechmodificacion = getdate(), \n"+
           " NombreEquipo = @NombreEquipo, \n"+
           " HoraPc = convert(varchar,getdate(),8), \n"+
           " Ip_Cliente = @Ip_Cliente, \n"+
           " ErpUsuario = @ErpUsuario, \n"+
           " erp_nivel = @erp_nivel where erp_codemp = @erp_codemp and erp_codune = @erp_codune \n"
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
          .input('erp_codune',mssql.VarChar(250),req.body.Codigo)
          .query(            
           " delete from erp_unidad_negocio where erp_codemp = @erp_codemp and erp_codune = @erp_codune \n"
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