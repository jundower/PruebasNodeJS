const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');
  
router.post('/lista', async (req, res) => {
  try {
      const codigo_empresa = req.user.codigo_empresa;
      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('id', mssql.VarChar(10), codigo_empresa)
      .query("SELECT \n"+
      "rtrim(ltrim(ccod_ot)) as Codigo,\n"+
      "ltrim(rtrim(cnom_ot)) as Nombre,\n"+
      "abrev as Abreviatura,\n"+
      "orden_servicio as Orden_Servicio,\n"+
      "CONVERT(VARCHAR,fecha_inicio,103) as Fecha_Inicio,\n"+
      "CONVERT(VARCHAR,fecha_final,103) as Fecha_Final,\n"+
      "presupuesto as Presupuesto,\n"+
      "observacion as Observacion,\n"+
      "observacion2 as Observacion2,\n"+
      "observacion3 as Observacion3,\n"+
      "CONVERT(VARCHAR,Horden_trabajo_fechmodificacion,8) as Fecha_Hora_Modificacion,\n"+
      "CONVERT(VARCHAR,fechaModificacion,103) as Fecha_Modificacion,\n"+
      "NombreEquipo as Pc_user,\n"+
      "IpCliente as Pc_ip,\n"+
      "CONVERT(VARCHAR,Hora,8) as Pc_Fecha,\n"+
      "Erpusuario as Usuario\n"+
      "FROM horden_trabajo WHERE \n"+
      "ccod_empresa = @id order by ccod_ot\n");
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
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_ot',mssql.VarChar(250),req.body.Codigo)
          .input('cnom_ot',mssql.VarChar(250),req.body.Nombre)
          .input('abrev',mssql.VarChar(250),req.body.Abreviatura)
          .input('orden_servicio',mssql.VarChar(250),req.body.Orden_Servicio)
          .input('fecha_inicio',mssql.Date,req.body.Fecha_Inicio)
          .input('fecha_final',mssql.Date,req.body.Fecha_Final)
          .input('observacion',mssql.VarChar(250),req.body.Observacion1)
          .input('presupuesto',mssql.VarChar(250),req.body.Presupuesto)
          .input('observacion2',mssql.VarChar(250),req.body.Observacion2)
          .input('observacion3',mssql.VarChar(250),req.body.Observacion3)
          .input('Horden_trabajo_fechmodificacion',mssql.VarChar(250),'')
          .input('NombreEquipo',mssql.VarChar(250),'')
          .input('Hora',mssql.VarChar(250),'')
          .input('IpCliente',mssql.VarChar(250),'')
          .input('Erpusuario',mssql.VarChar(250), usuario)
          .query(            
           " insert into Horden_trabajo( \n"+
           " ccod_empresa, \n"+
           " ccod_ot, \n"+
           " cnom_ot, \n"+
           " abrev, \n"+
           " orden_servicio, \n"+
           " fecha_inicio, \n"+
           " fecha_final, \n"+
           " observacion, \n"+
           " presupuesto, \n"+
           " observacion2, \n"+
           " observacion3, \n"+
           " Horden_trabajo_fechmodificacion, \n"+
           " fechaModificacion, \n"+
           " NombreEquipo, \n"+
           " IpCliente, \n"+
           " Hora, \n"+
           " Erpusuario \n"+
           " )values( \n"+
           " @ccod_empresa, \n"+
           " @ccod_ot, \n"+
           " @cnom_ot, \n"+
           " @abrev, \n"+
           " @orden_servicio, \n"+
           " @fecha_inicio, \n"+
           " @fecha_final, \n"+
           " @observacion, \n"+
           " @presupuesto, \n"+
           " @observacion2, \n"+
           " @observacion3, \n"+
           " getdate(), \n"+
           " getdate(), \n"+
           " @NombreEquipo, \n"+
           " @IpCliente, \n"+
           " convert(varchar,getdate(),8), \n"+
           " @Erpusuario) \n"
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
          .input('ccod_ot',mssql.VarChar(250),req.body.Codigo)
          .input('cnom_ot',mssql.VarChar(250),req.body.Nombre)
          .input('abrev',mssql.VarChar(250),req.body.Abreviatura)
          .input('orden_servicio',mssql.VarChar(250),req.body.Orden_Servicio)
          .input('fecha_inicio',mssql.Date,req.body.Fecha_Inicio)
          .input('fecha_final',mssql.Date,req.body.Fecha_Final)
          .input('observacion',mssql.VarChar(250),req.body.Observacion1)
          .input('presupuesto',mssql.VarChar(250),req.body.Presupuesto)
          .input('observacion2',mssql.VarChar(250),req.body.Observacion2)
          .input('observacion3',mssql.VarChar(250),req.body.Observacion3)
          .input('Horden_trabajo_fechmodificacion',mssql.VarChar(250),'')
          .input('NombreEquipo',mssql.VarChar(250),'')
          .input('Hora',mssql.VarChar(250),'')
          .input('IpCliente',mssql.VarChar(250),'')
          .input('Erpusuario',mssql.VarChar(250), usuario)
          .query(            
           " update Horden_trabajo set \n"+
           " cnom_ot = @cnom_ot, \n"+
           " abrev = @abrev, \n"+
           " orden_servicio = @orden_servicio, \n"+
           " fecha_inicio = @fecha_inicio, \n"+
           " fecha_final = @fecha_final, \n"+
           " observacion = @observacion, \n"+
           " presupuesto = @presupuesto, \n"+
           " observacion2 = @observacion2, \n"+
           " observacion3 = @observacion3, \n"+
           " Horden_trabajo_fechmodificacion = getdate(), \n"+
           " fechaModificacion = getdate(), \n"+
           " NombreEquipo = @NombreEquipo, \n"+
           " IpCliente = @IpCliente, \n"+
           " Hora = convert(varchar,getdate(),8), \n"+
           " Erpusuario = @Erpusuario where ccod_empresa = @ccod_empresa and ccod_ot = @ccod_ot \n"
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
          .input('ccod_ot',mssql.VarChar(250),req.body.Codigo)
          .query(            
           " delete from Horden_trabajo where ccod_empresa = @ccod_empresa and ccod_ot = @ccod_ot \n"
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