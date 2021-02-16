const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');


router.get('/chofer/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const pool = await poolPromise
  
          const lista = await pool
          .request()
          .input('id', mssql.VarChar(10), id)
          .query('select * from Hchofer where ccod_empresa = @id');
            
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
      "erp_codigo  as Codigo, \n"+ 
      "erp_nombre as Nombre, \n"+ 
      "erp_documento as Documento, \n"+ 
      "erp_tipodoc as Tipo_Documento, \n"+ 
      "erp_documento as Numero_Documento, \n"+ 
      "erp_licencia as Licencia \n"+ 
      "from Hchofer where erp_empresa = @id order by erp_codigo");
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
          .input('Numero_Documento',mssql.VarChar(250),req.body.Numero_Documento)
          .input('Tipo_Documento',mssql.VarChar(250),req.body.Tipo_Documento)
          .input('Licencia',mssql.VarChar(250),req.body.Licencia)
          .input('Predeterminado',mssql.VarChar(250),req.body.Predeterminado)
          .input('Privado',mssql.VarChar(250),req.body.Privado)
          .query(
          " INSERT INTO Hchofer \n"+
          " (erp_empresa \n"+
          " ,erp_codigo \n"+
          " ,erp_nombre \n"+
          " ,erp_documento \n"+
          " ,erp_tipodoc \n"+
          " ,erp_licencia \n"+
          " ,predeterminado \n"+
          " ,si_privado) \n"+
          " VALUES \n"+
          "(@Codigo_Empresa, \n"+
          " @Codigo, \n"+
          " @Nombre,  \n"+
          " @Numero_Documento,  \n"+
          " @Tipo_Documento,  \n"+
          " @Licencia, \n"+
          " @Predeterminado, \n"+
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
          .input('Numero_Documento',mssql.VarChar(250),req.body.Numero_Documento)
          .input('Tipo_Documento',mssql.VarChar(250),req.body.Tipo_Documento)
          .input('Licencia',mssql.VarChar(250),req.body.Licencia)
          .input('Predeterminado',mssql.VarChar(250),req.body.Predeterminado)
          .input('Privado',mssql.VarChar(250),req.body.Privado)
          .query(
          " UPDATE Hchofer SET\n"+
          " erp_nombre = @Nombre \n"+
          " ,erp_documento = @Numero_Documento \n"+
          " ,erp_tipodoc = @Tipo_Documento \n"+
          " ,erp_licencia = @Licencia \n"+
          " ,predeterminado = @Predeterminado \n"+
          " ,si_privado = @Privado \n"+
          " WHERE erp_empresa = @Codigo_Empresa and erp_codigo = @Codigo"
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
        "delete from Hchofer \n"+
        " WHERE erp_empresa = @Codigo_Empresa and erp_codigo = @Codigo"
      );
      res.send({estado: true, codigo: "0", mensaje: ''});
  } catch (err) {
    console.log(err.message);
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

module.exports = router;