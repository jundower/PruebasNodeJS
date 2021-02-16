const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');


router.get('/vehiculo/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const pool = await poolPromise
  
          const lista = await pool
          .request()
          .input('id', mssql.VarChar(10), id)
          .query('select * from hvehiculo where ccod_empresa = @id');
            
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
      .query("Select \n"+
      " LTRIM(RTRIM(ccod_vehiculo)) as Codigo, \n"+
      " placa1 as Nombre, \n"+
      " placa2 as Modelo, \n"+
      " n_inscripcion as N_inscripcion \n"+
      " from hvehiculo where ccod_empresa = @id order by ccod_vehiculo");
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
          .input('Placa',mssql.VarChar(250),req.body.Placa)
          .input('Inscripcion',mssql.VarChar(250),req.body.Inscripcion)
          .input('Predeterminado',mssql.VarChar(250),req.body.Predeterminado)
          .input('Privado',mssql.VarChar(250),req.body.Privado)
          .query(
          " INSERT INTO Hvehiculo \n"+
          " (ccod_empresa \n"+
          " ,ccod_vehiculo \n"+
          " ,placa1 \n"+
          " ,placa2 \n"+
          " ,n_inscripcion \n"+
          " ,predeterminado \n"+
          " ,si_privado) \n"+
          " VALUES \n"+
          "(@Codigo_Empresa, \n"+
          " @Codigo, \n"+
          " @Nombre, \n"+
          " @Placa, \n"+
          " @Inscripcion, \n"+
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
          .input('Placa',mssql.VarChar(250),req.body.Placa)
          .input('Inscripcion',mssql.VarChar(250),req.body.Inscripcion)
          .input('Predeterminado',mssql.VarChar(250),req.body.Predeterminado)
          .input('Privado',mssql.VarChar(250),req.body.Privado)
          .query(
          " UPDATE Hvehiculo SET\n"+
          " placa1 = @Nombre \n"+
          " ,placa2 = @Placa \n"+
          " ,n_inscripcion = @Inscripcion \n"+
          " ,predeterminado = @Predeterminado \n"+
          " ,si_privado = @Privado \n"+
          " WHERE ccod_empresa = @Codigo_Empresa and ccod_vehiculo = @Codigo"
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
        "delete from Hvehiculo \n"+
        " WHERE ccod_empresa = @Codigo_Empresa and ccod_vehiculo = @Codigo"
      );
      res.send({estado: true, codigo: "0", mensaje: ''});
  } catch (err) {
    console.log(err.message);
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

module.exports = router;