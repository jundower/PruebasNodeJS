const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');


router.get('/transportista/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const pool = await poolPromise
  
          const lista = await pool
          .request()
          .input('id', mssql.VarChar(10), id)
          .query('select * from htransp where ccod_empresa = @id');
            
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
      .query("Select  \n"+
      " ccod_transportista as Codigo, \n"+
      " cnom_transportista as Nombre, \n"+
      " razon_social as Razon_Social,  \n"+
      " cnum_ruc as Ruc,  \n"+
      " cdireccion as Direccion,  \n"+
      " lic_conducir as Licencia,  \n"+
      " contacto as Contacto,  \n"+
      " cfax as Fax,  \n"+
      " conf_vehiculo as Vehiculo,  \n"+
      " ctelefono as Telefono  \n"+
      " from htransp where ccod_empresa = @id order by ccod_transportista");
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
          .input('Ruc',mssql.VarChar(250),req.body.Ruc)
          .input('Direccion',mssql.VarChar(250),req.body.Direccion)
          .input('Razon_Social',mssql.VarChar(250),req.body.Razon_Social)
          .input('Licencia',mssql.VarChar(250),req.body.Licencia)
          .input('Vehiculo',mssql.VarChar(250),req.body.Vehiculo)
          .input('Telefono1',mssql.VarChar(250),req.body.Telefono1)
          .input('Fax',mssql.VarChar(250),req.body.Fax)
          .input('Contacto',mssql.VarChar(250),req.body.Contacto)
          .input('Predeterminado',mssql.VarChar(250),req.body.Predeterminado)
          .input('Tipo_Documento',mssql.VarChar(250),req.body.Tipo_Documento)
          .input('Privado',mssql.VarChar(250),req.body.Privado)
          .query(
           " INSERT INTO Htransp \n"+
           " (ccod_empresa \n"+
           " ,ccod_transportista \n"+
           " ,cnom_transportista \n"+
           " ,cnum_ruc \n"+
           " ,cdireccion \n"+
           " ,razon_social \n"+
           " ,lic_conducir \n"+
           " ,conf_vehiculo \n"+
           " ,ctelefono \n"+
           " ,cfax \n"+
           " ,contacto \n"+
           " ,predeterminado \n"+
           " ,tip_doc \n"+
           " ,si_privado) \n"+
           " VALUES( \n"+
           " @Codigo_Empresa,  \n"+
           " @Codigo,  \n"+
           " @Nombre,  \n"+
           " @Ruc,  \n"+
           " @Direccion,  \n"+
           " @Razon_Social,  \n"+
           " @Licencia,  \n"+
           " @Vehiculo,  \n"+
           " @Telefono1,  \n"+
           " @Fax,  \n"+
           " @Contacto,  \n"+
           " @Predeterminado,  \n"+
           " @Tipo_Documento,  \n"+
           " @Privado )"
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
          .input('Ruc',mssql.VarChar(250),req.body.Ruc)
          .input('Direccion',mssql.VarChar(250),req.body.Direccion)
          .input('Razon_Social',mssql.VarChar(250),req.body.Razon_Social)
          .input('Licencia',mssql.VarChar(250),req.body.Licencia)
          .input('Vehiculo',mssql.VarChar(250),req.body.Vehiculo)
          .input('Telefono1',mssql.VarChar(250),req.body.Telefono1)
          .input('Fax',mssql.VarChar(250),req.body.Fax)
          .input('Contacto',mssql.VarChar(250),req.body.Contacto)
          .input('Predeterminado',mssql.VarChar(250),req.body.Predeterminado)
          .input('Tipo_Documento',mssql.VarChar(250),req.body.Tipo_Documento)
          .input('Privado',mssql.VarChar(250),req.body.Privado)
          .query(
           " UPDATE Htransp SET \n"+
           " cnom_transportista = @Nombre \n"+
           " ,cnum_ruc = @Ruc \n"+
           " ,cdireccion = @Direccion \n"+
           " ,razon_social = @Razon_Social \n"+
           " ,lic_conducir = @Licencia \n"+
           " ,conf_vehiculo = @Vehiculo \n"+
           " ,ctelefono = @Telefono1 \n"+
           " ,cfax = @Fax \n"+
           " ,contacto = @Contacto \n"+
           " ,predeterminado = @Predeterminado \n"+
           " ,tip_doc = @Tipo_Documento \n"+
           " ,si_privado = @Privado \n"+
           " WHERE ccod_empresa = @Codigo_Empresa and ccod_transportista = @Codigo"
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
        "delete from Htransp \n"+
        " WHERE ccod_empresa = @Codigo_Empresa and ccod_transportista = @Codigo"
      );
      res.send({estado: true, codigo: "0", mensaje: ''});
  } catch (err) {
    console.log(err.message);
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

module.exports = router;