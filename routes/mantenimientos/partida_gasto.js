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
        "Select \n"+
        "isnull(Hpartidagast.ccod_partgast,'') as Codigo,  \n"+
        "isnull(Hpartidagast.cnom_partgast,'') as Nombre, \n"+
        "isnull(Hpartidagast.abrev,'') as Abreviatura, \n"+
        "HPartidagast.operacion as Operacion,  \n"+
        "isnull(Hpartidagast.erp_codsunat,'') as Sunat, \n"+
        "isnull((select erp_ccuenta from HDetpartidagast where ccod_empresa = '01' and ccod_partgast = Hpartidagast.ccod_partgast and erp_item=1),'') as Cuenta1, \n"+   
        "isnull((select erp_ccuenta from HDetpartidagast where ccod_empresa = '01' and ccod_partgast = Hpartidagast.ccod_partgast and erp_item=2),'') as Cuenta2, \n"+   
        "isnull((select erp_ccuenta from HDetpartidagast where ccod_empresa = '01' and ccod_partgast = Hpartidagast.ccod_partgast and erp_item=3),'') as Cuenta3, \n"+   
        "isnull((select erp_ccuenta from HDetpartidagast where ccod_empresa = '01' and ccod_partgast = Hpartidagast.ccod_partgast and erp_item=4),'') as Cuenta4, \n"+   
        "isnull((select erp_ccuenta from HDetpartidagast where ccod_empresa = '01' and ccod_partgast = Hpartidagast.ccod_partgast and erp_item=5),'') as Cuenta5, \n"+   
        "isnull(Hpartidagast.usuario,'') as Usuario, \n"+
        "isnull(Hpartidagast.pc_user,'') as Pc_User, \n"+
        "CONVERT(VARCHAR,Hpartidagast.fecha,103) as Fecha,  \n"+
        "isnull(Hpartidagast.ip_cliente,'') as Ip_Cliente \n"+
        "From Hpartidagast  \n"+
        "where ccod_empresa = @codigo_empresa \n" );
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

router.post('/cuentas', async (req, res) => {
  try {
      const codigo_empresa = req.user.codigo_empresa;
      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .input('codigo', mssql.VarChar(10), req.body.codigo)
      .query(
        " SELECT  \n"+
        " HDetPartidagast.ccod_partgast,    \n"+
        " HDetPartidagast.erp_item,    \n"+
        " HDetPartidagast.erp_ccuenta as Cuenta, \n"+
        " Ltrim(Rtrim(Hplancon.cnom_cuenta)) as Nombre_Cuenta \n"+
        " FROM HDetPartidagast    \n"+
        " Inner Join Hplancon on \n"+
        " HDetPartidagast.ccod_empresa = Hplancon.ccod_empresa  \n"+
        " and HDetPartidagast.erp_ccuenta = Hplancon.ccuenta \n"+
        " where  \n"+
        " HDetPartidagast.ccod_empresa = @codigo_empresa and  \n"+
        " HDetPartidagast.ccod_partgast = @codigo \n"
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
    var filas_partida_gasto_cuentas = JSON.parse(req.body.Lista_Partida_Gasto_Cuentas)

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    await transaction.begin(async err => {
        try{
          
          const request  = new mssql.Request(transaction);
          await request
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_partgast',mssql.VarChar(250),req.body.Codigo)
          .input('cnom_partgast',mssql.VarChar(250),req.body.Nombre)
          .input('abrev',mssql.VarChar(250),req.body.Abreviatura)
          .input('erp_codsunat',mssql.VarChar(250),req.body.Codigo_Sunat)
          .input('operacion',mssql.VarChar(250),req.body.Operacion)
          .input('fecha',mssql.VarChar(250),'')
          .input('pc_user',mssql.VarChar(250),'')
          .input('Ip_Cliente',mssql.VarChar(250),'')
          .input('usuario',mssql.VarChar(250), usuario)
          .query(            
           " insert into HPartidagast( \n"+
           " ccod_empresa, \n"+
           " ccod_partgast, \n"+
           " cnom_partgast, \n"+
           " abrev, \n"+
           " erp_codsunat, \n"+
           " usuario, \n"+
           " pc_user, \n"+
           " fecha, \n"+
           " Ip_Cliente, \n"+
           " operacion \n"+
           " )values( \n"+
           " @ccod_empresa, \n"+
           " @ccod_partgast, \n"+
           " @cnom_partgast, \n"+
           " @abrev, \n"+
           " @erp_codsunat, \n"+
           " @usuario, \n"+
           " @pc_user, \n"+
           " getdate(), \n"+
           " @Ip_Cliente, \n"+
           " @operacion) \n"
          );

          for (let i= 0; i< filas_partida_gasto_cuentas.length; i++){
            var fila = filas_partida_gasto_cuentas[i];

            const detalle_partida_gasto  = new mssql.Request(transaction);
            await detalle_partida_gasto
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('ccod_partgast',mssql.VarChar(250),req.body.Codigo)
            .input('erp_ccuenta',mssql.VarChar(250),fila.Cuenta)
            .input('erp_item',mssql.VarChar(250),i+1)
            .query(
              " insert into HDetPartidagast( \n"+
              " ccod_empresa, \n"+
              " ccod_partgast, \n"+
              " erp_item, \n"+
              " erp_ccuenta \n"+
              " )values( \n"+
              " @ccod_empresa, \n"+
              " @ccod_partgast, \n"+
              " @erp_item, \n"+
              " @erp_ccuenta) \n"
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
    var filas_partida_gasto_cuentas = JSON.parse(req.body.Lista_Partida_Gasto_Cuentas)

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    await transaction.begin(async err => {
        try{
          
          const request  = new mssql.Request(transaction);
          await request
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_partgast',mssql.VarChar(250),req.body.Codigo)
          .input('cnom_partgast',mssql.VarChar(250),req.body.Nombre)
          .input('abrev',mssql.VarChar(250),req.body.Abreviatura)
          .input('erp_codsunat',mssql.VarChar(250),req.body.Codigo_Sunat)
          .input('operacion',mssql.VarChar(250),req.body.Operacion)
          .input('fecha',mssql.VarChar(250),'')
          .input('pc_user',mssql.VarChar(250),'')
          .input('Ip_Cliente',mssql.VarChar(250),'')
          .input('usuario',mssql.VarChar(250), usuario)
          .query(            
           " update HPartidagast set \n"+
           " cnom_partgast  = @cnom_partgast, \n"+
           " abrev  = @abrev, \n"+
           " erp_codsunat  = @erp_codsunat, \n"+
           " usuario  = @usuario, \n"+
           " pc_user  = @pc_user, \n"+
           " fecha  = getdate(), \n"+
           " Ip_Cliente  = @Ip_Cliente, \n"+
           " operacion  = @operacion \n"+
           " where ccod_empresa  = @ccod_empresa and ccod_partgast  = @ccod_partgast \n"
          );

          const eliminar_detalle_partida_gasto  = new mssql.Request(transaction);
          await eliminar_detalle_partida_gasto
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_partgast',mssql.VarChar(250),req.body.Codigo)
          .query(            
            " delete from HDetPartidagast  where  ccod_empresa = @ccod_empresa and ccod_partgast = @ccod_partgast \n"
          );

          for (let i= 0; i< filas_partida_gasto_cuentas.length; i++){
            var fila = filas_partida_gasto_cuentas[i];

            const detalle_partida_gasto  = new mssql.Request(transaction);
            await detalle_partida_gasto
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('ccod_partgast',mssql.VarChar(250),req.body.Codigo)
            .input('erp_ccuenta',mssql.VarChar(250),fila.Cuenta)
            .input('erp_item',mssql.VarChar(250),i+1)
            .query(
              " insert into HDetPartidagast( \n"+
              " ccod_empresa, \n"+
              " ccod_partgast, \n"+
              " erp_item, \n"+
              " erp_ccuenta \n"+
              " )values( \n"+
              " @ccod_empresa, \n"+
              " @ccod_partgast, \n"+
              " @erp_item, \n"+
              " @erp_ccuenta) \n"
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
          const eliminar_detalle_partida_gasto  = new mssql.Request(transaction);
          await eliminar_detalle_partida_gasto
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_partgast',mssql.VarChar(250),req.body.Codigo)
          .query(            
            " delete from HDetPartidagast  where  ccod_empresa = @ccod_empresa and ccod_partgast = @ccod_partgast \n"
          );

          const request  = new mssql.Request(transaction);
          await request
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_partgast',mssql.VarChar(250),req.body.Codigo)
          .query(            
           "delete from HPartidagast where ccod_empresa  = @ccod_empresa and ccod_partgast  = @ccod_partgast \n"
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