const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');


router.get('/agencia_transporte/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const pool = await poolPromise
  
          const lista = await pool
          .request()
          .input('id', mssql.VarChar(10), id)
          .query('select * from erp_agencia_transporte where ccod_empresa = @id');
            
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
      .query("select \n"+ 
      "erp_codagencia as Codigo, \n"+ 
      "erp_nomagencia as Nombre, \n"+ 
      "erp_email as Correo, \n"+ 
      "erp_telefono1 as Telefono, \n"+ 
      "erp_telefono2 as Telefono2, \n"+ 
      "erp_telefono3 as Telefono3, \n"+ 
      "erp_web as Web, \n"+ 
      "erp_direccion as Direccion, \n"+ 
      "erp_ruc as Ruc, \n"+ 
      "erp_observacion1 as Observacion, \n"+ 
      "erp_contacto as Contacto \n"+ 
      "from erp_agencia_transporte where erp_codemp = @id order by erp_codagencia");
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

router.post('/guardar', async (req, res) => {
  try {

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{
          const request  = new mssql.Request(transaction);
          await request
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .input('Nombre',mssql.VarChar(250),req.body.Nombre)
          .input('Email',mssql.VarChar(250),req.body.Email)
          .input('Telefono1',mssql.VarChar(250),req.body.Telefono1)
          .input('Telefono2',mssql.VarChar(250),req.body.Telefono2)
          .input('Telefono3',mssql.VarChar(250),req.body.Telefono3)
          .input('Web',mssql.VarChar(250),req.body.Web)
          .input('Direccion',mssql.VarChar(250),req.body.Direccion)
          .input('Ruc',mssql.VarChar(250),req.body.Ruc)
          .input('Observacion1',mssql.VarChar(250),req.body.Observacion1)
          .input('Observacion2',mssql.VarChar(250),req.body.Observacion2)
          .input('Contacto',mssql.VarChar(250),req.body.Contacto)
          .input('Predeterminado',mssql.VarChar(250),req.body.Predeterminado)
          .input('Privado',mssql.VarChar(250),req.body.Privado)
          .query(
          " INSERT INTO erp_agencia_transporte \n"+
          " (erp_codemp \n"+
          " ,erp_codagencia \n"+
          " ,erp_nomagencia \n"+
          " ,erp_email \n"+
          " ,erp_telefono1 \n"+
          " ,erp_telefono2 \n"+
          " ,erp_telefono3 \n"+
          " ,erp_web \n"+
          " ,erp_direccion \n"+
          " ,erp_ruc \n"+
          " ,erp_observacion1 \n"+
          " ,erp_observacion2 \n"+
          " ,erp_contacto \n"+
          " ,predeterminado \n"+
          " ,si_privado) \n"+
          " VALUES \n"+
          "(@Codigo_Empresa, \n"+
          " @Codigo,  \n"+
          " @Nombre, \n"+
          " @Email,  \n"+
          " @Telefono1,  \n"+
          " @Telefono2,  \n"+
          " @Telefono3,  \n"+
          " @Web,  \n"+
          " @Direccion,  \n"+
          " @Ruc, \n"+
          " @Observacion1,  \n"+
          " @Observacion2,  \n"+
          " @Contacto,  \n"+
          " @Predeterminado,  \n"+
          " @Privado)" 
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

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{
          const request  = new mssql.Request(transaction);
          await request
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .input('Nombre',mssql.VarChar(250),req.body.Nombre)
          .input('Email',mssql.VarChar(250),req.body.Email)
          .input('Telefono1',mssql.VarChar(250),req.body.Telefono1)
          .input('Telefono2',mssql.VarChar(250),req.body.Telefono2)
          .input('Telefono3',mssql.VarChar(250),req.body.Telefono3)
          .input('Web',mssql.VarChar(250),req.body.Web)
          .input('Direccion',mssql.VarChar(250),req.body.Direccion)
          .input('Ruc',mssql.VarChar(250),req.body.Ruc)
          .input('Observacion1',mssql.VarChar(250),req.body.Observacion1)
          .input('Observacion2',mssql.VarChar(250),req.body.Observacion2)
          .input('Contacto',mssql.VarChar(250),req.body.Contacto)
          .input('Predeterminado',mssql.VarChar(250),req.body.Predeterminado)
          .input('Privado',mssql.VarChar(250),req.body.Privado)
          .query(
          " UPDATE  erp_agencia_transporte SET\n"+
          " erp_nomagencia = @Nombre \n"+
          " ,erp_email = @Email \n"+
          " ,erp_telefono1 = @Telefono1 \n"+
          " ,erp_telefono2 = @Telefono2 \n"+
          " ,erp_telefono3 = @Telefono3 \n"+
          " ,erp_web = @Web \n"+
          " ,erp_direccion = @Direccion \n"+
          " ,erp_ruc = @Ruc \n"+
          " ,erp_observacion1 = @Observacion1 \n"+
          " ,erp_observacion2 = @Observacion2 \n"+
          " ,erp_contacto = @Contacto \n"+
          " ,predeterminado = @Predeterminado \n"+
          " ,si_privado = @Privado \n"+
          " WHERE erp_codemp = @Codigo_Empresa and erp_codagencia = @Codigo "
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
      const pool = await poolPromise

      await pool
      .request()
      .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
      .input('Codigo',mssql.VarChar(250),req.body.Codigo)
      .query(
        "delete from erp_agencia_transporte \n"+
        " WHERE erp_codemp = @Codigo_Empresa and erp_codagencia = @Codigo "
      );
      res.send({estado: true, codigo: "0", mensaje: ''});
  } catch (err) {
    console.log(err.message);
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

module.exports = router;