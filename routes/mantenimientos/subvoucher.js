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
        "ccod_svoucher as Codigo, \n"+
        "ccod_svoucher+' - '+cnom_svoucher as Nombre, \n"+
        "cabrev_svoucher as Abreviatura, \n"+
        "ctip_cambio as Tipo_Cambio, \n"+
        "genera_transf as Si_Transferencia, \n"+
        "compras as Si_Compras, \n"+
        "ventas as Si_Ventas, \n"+
        "contable as Si_Contable, \n"+
        "cancelacion as Si_Cancelacion, \n"+
        "genera_diferencia as Si_Diferencia, \n"+
        "calcula_moneda as Si_CalculaMonedas, \n"+
        "n_caracteres as Caracteres \n"+
        "from hsubvouc \n"+
        "where ccod_empresa = @codigo_empresa"
      );

    const recordset = lista.recordset;
    res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

router.post('/correlativo', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;

    const pool = await poolPromise;
    var lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('subvoucher', mssql.VarChar(250), req.body.subvoucher)
    .query(
      " select \n"+
      " Isnull(n_caracteres,0) as cantidad_ceros \n"+
      " from hsubvouc \n"+
      " where ccod_empresa = @codigo_empresa and ccod_svoucher = @subvoucher \n"
    );
    
    var recordset = lista.recordset;
    var cantidad_ceros = recordset[0].cantidad_ceros;

     lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('ejercicio', mssql.VarChar(10), req.body.ejercicio)
    .input('periodo', mssql.VarChar(10), req.body.periodo)
    .input('subvoucher', mssql.VarChar(10), req.body.subvoucher)
    .query(
      " SELECT num_ultcomp as correlativo \n"+
      " FROM Hpernume WHERE \n"+
      " ccod_empresa = @codigo_empresa And \n"+
      " ejercon = @ejercicio And \n"+
      " periodo_con = @periodo And \n"+
      " ccod_svoucher = @subvoucher \n"
      );

      recordset = lista.recordset;
      if(recordset.length > 0){
        var ceros = "0";
        for(i=1; i<cantidad_ceros;i++){
          ceros+="0";
        }
        var correlativo = recordset[0].correlativo;
        correlativo = correlativo + 1;
        correlativo = (ceros + correlativo).substr(-1 * cantidad_ceros, cantidad_ceros);

        res.send(correlativo);
      }else{
        res.send("-")
      }

  } catch (err) {
    res.send({estado: false, codigo: err.number, mensaje: err.message});
  }
});

router.post('/detalle', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;

    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo', mssql.VarChar(10), req.body.subvoucher)
    .input('moneda', mssql.VarChar(10), req.body.moneda)
    .query(
      "select \n"+
      "Hplancon.ccuenta as Cuenta, \n"+
      "Hplancon.cnom_cuenta as Nombre, \n"+
      "Hplancon.ccod_tipaux as Tipo_Auxiliar, \n"+
      "Hplancon.csicencos as Si_CenCos, \n"+
      "Hplancon.sitransfer as Si_Transferencia,\n"+
      "Hplancon.genera_diferencia as Si_Genera_Diferencia,\n"+
      "hsubvoud.d_h as D_H, \n"+
      "hsubvoud.secuencia as Secuencia \n"+
      "from hsubvoud \n"+
      "inner join hplancon on\n"+
      "Hplancon.ccod_empresa = hsubvoud.ccod_empresa\n"+
      "and Hplancon.ccuenta = hsubvoud.ccuenta\n"+
      "where \n"+
      "hsubvoud.ccod_empresa=@codigo_empresa  \n"+
      "and hsubvoud.ccod_svoucher=@codigo  \n"+
      "and hsubvoud.cmoneda=@moneda  \n"+
      "order by hsubvoud.secuencia \n"
      );

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
    "SELECT hsubvoud.ccuenta as Codigo, \n"+
    "(ltrim(rtrim(hsubvoud.ccuenta)) +' - '+ Hplancon.cnom_cuenta) as Cuenta, \n"+
    "ltrim(rtrim(hsubvoud.cmoneda)) as Codigo_Moneda,    \n"+
    "hsubvoud.d_h  as Codigo_D_H \n"+
    "FROM hsubvoud  inner join Hplancon on \n"+
    "hsubvoud.ccod_empresa = Hplancon.ccod_empresa and \n"+
    "hsubvoud.ccuenta = Hplancon.ccuenta \n"+
    "WHERE hsubvoud.ccod_empresa = @codigo_empresa  AND   \n"+
    "hsubvoud.ccod_svoucher = @codigo     \n"+
    "ORDER BY hsubvoud.secuencia \n");

    const recordset = lista.recordset;
    console.log(recordset);
    res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

router.post('/guardar', async (req, res) => {
  try {
    const usuario = req.user.codigo_usuario;
    var filas_cuentas_subvoucher = JSON.parse(req.body.Lista_Cuentas_Subvoucher)

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);

    await transaction.begin(async err => {
        try{

          //#region Guardar Tipo Documento
          const datos_subvoucher  = new mssql.Request(transaction);
          await datos_subvoucher
          .input('ccod_empresa', mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_svoucher', mssql.VarChar(250),req.body.Codigo)
          .input('cnom_svoucher', mssql.VarChar(250),req.body.Nombre)
          .input('cabrev_svoucher', mssql.VarChar(250),req.body.Abreviatura)
          .input('ctip_cambio', mssql.VarChar(250),req.body.Tipo_Cambio)
          .input('genera_transf', mssql.VarChar(250),req.body.Si_Transferencia)
          .input('compras', mssql.VarChar(250),req.body.Compras)
          .input('ventas', mssql.VarChar(250),req.body.Ventas)
          .input('contable', mssql.VarChar(250),req.body.Contabilidad)
          .input('cancelacion', mssql.VarChar(250),req.body.Cancelacion)
          .input('genera_diferencia', mssql.VarChar(250), req.body.Si_Diferencia)
          .input('calcula_moneda', mssql.VarChar(250),req.body.Calcula_mn_me)
          .input('n_caracteres', mssql.VarChar(250),req.body.Caracteres)
          .query(
          " insert into hsubvouc ( \n"+
          " ccod_empresa, \n"+
          " ccod_svoucher, \n"+
          " cnom_svoucher, \n"+
          " cabrev_svoucher, \n"+
          " ctip_cambio, \n"+
          " genera_transf, \n"+
          " compras, \n"+
          " ventas, \n"+
          " contable, \n"+
          " cancelacion, \n"+
          " genera_diferencia, \n"+
          " calcula_moneda, \n"+
          " n_caracteres \n"+
          " )values( \n"+
          " @ccod_empresa, \n"+
          " @ccod_svoucher, \n"+
          " @cnom_svoucher, \n"+
          " @cabrev_svoucher, \n"+
          " @ctip_cambio, \n"+
          " @genera_transf, \n"+
          " @compras, \n"+
          " @ventas, \n"+
          " @contable, \n"+
          " @cancelacion, \n"+
          " @genera_diferencia, \n"+
          " @calcula_moneda, \n"+
          " @n_caracteres) \n"
          );
          //#endregion

          for (let i= 0; i< filas_cuentas_subvoucher.length; i++){

            var fila = filas_cuentas_subvoucher[i];
            const request_cuentas_subvoucher  = new mssql.Request(transaction);
            await request_cuentas_subvoucher
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('ccod_svoucher',mssql.VarChar(250),req.body.Codigo)
            .input('cmoneda',mssql.VarChar(250),fila.Moneda)
            .input('ccuenta',mssql.VarChar(250),fila.Cuenta)
            .input('d_h',mssql.VarChar(250),fila.D_H)
            .input('secuencia',mssql.VarChar(250),i+1)
            .query(
              " insert into hsubvoud ( \n"+
              " ccod_empresa, \n"+
              " ccod_svoucher, \n"+
              " cmoneda, \n"+
              " ccuenta, \n"+
              " d_h, \n"+
              " secuencia \n"+
              " )values( \n"+
              " @ccod_empresa, \n"+
              " @ccod_svoucher, \n"+
              " @cmoneda, \n"+
              " @ccuenta, \n"+
              " @d_h, \n"+
              " @secuencia) \n"
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
    var filas_cuentas_subvoucher = JSON.parse(req.body.Lista_Cuentas_Subvoucher)

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);

    await transaction.begin(async err => {
        try{

          //#region Guardar Tipo Documento
          const datos_subvoucher  = new mssql.Request(transaction);
          await datos_subvoucher
          .input('ccod_empresa', mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_svoucher', mssql.VarChar(250),req.body.Codigo)
          .input('cnom_svoucher', mssql.VarChar(250),req.body.Nombre)
          .input('cabrev_svoucher', mssql.VarChar(250),req.body.Abreviatura)
          .input('ctip_cambio', mssql.VarChar(250),req.body.Tipo_Cambio)
          .input('genera_transf', mssql.VarChar(250),req.body.Si_Transferencia)
          .input('compras', mssql.VarChar(250),req.body.Compras)
          .input('ventas', mssql.VarChar(250),req.body.Ventas)
          .input('contable', mssql.VarChar(250),req.body.Contabilidad)
          .input('cancelacion', mssql.VarChar(250),req.body.Cancelacion)
          .input('genera_diferencia', mssql.VarChar(250), req.body.Si_Diferencia)
          .input('calcula_moneda', mssql.VarChar(250),req.body.Calcula_mn_me)
          .input('n_caracteres', mssql.VarChar(250),req.body.Caracteres)
          .query(
          " update hsubvouc set \n"+
          " cnom_svoucher = @cnom_svoucher, \n"+
          " cabrev_svoucher = @cabrev_svoucher, \n"+
          " ctip_cambio = @ctip_cambio, \n"+
          " genera_transf = @genera_transf, \n"+
          " compras = @compras, \n"+
          " ventas = @ventas, \n"+
          " contable = @contable, \n"+
          " cancelacion = @cancelacion, \n"+
          " genera_diferencia = @genera_diferencia, \n"+
          " calcula_moneda = @calcula_moneda, \n"+
          " n_caracteres = @n_caracteres \n"+
          " where ccod_empresa = @ccod_empresa and ccod_svoucher = @ccod_svoucher \n"
          );
          //#endregion

          const request_eliminar_detalle  = new mssql.Request(transaction);
          await request_eliminar_detalle
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_svoucher',mssql.VarChar(250),req.body.Codigo)
          .query(            
            " delete from hsubvoud \n"+
            " where ccod_empresa = @ccod_empresa and ccod_svoucher = @ccod_svoucher \n"
          );


          for (let i= 0; i< filas_cuentas_subvoucher.length; i++){

            var fila = filas_cuentas_subvoucher[i];
            const request_cuentas_subvoucher  = new mssql.Request(transaction);
            await request_cuentas_subvoucher
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('ccod_svoucher',mssql.VarChar(250),req.body.Codigo)
            .input('cmoneda',mssql.VarChar(250),fila.Moneda)
            .input('ccuenta',mssql.VarChar(250),fila.Cuenta)
            .input('d_h',mssql.VarChar(250),fila.D_H)
            .input('secuencia',mssql.VarChar(250),i+1)
            .query(
              " insert into hsubvoud ( \n"+
              " ccod_empresa, \n"+
              " ccod_svoucher, \n"+
              " cmoneda, \n"+
              " ccuenta, \n"+
              " d_h, \n"+
              " secuencia \n"+
              " )values( \n"+
              " @ccod_empresa, \n"+
              " @ccod_svoucher, \n"+
              " @cmoneda, \n"+
              " @ccuenta, \n"+
              " @d_h, \n"+
              " @secuencia) \n"
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

          var request_consultar_subvoucher = await pool
          .request()
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_svoucher',mssql.VarChar(250),req.body.Codigo)
          .query(            
           " select Count(*) from hmovconc where ccod_empresa = @ccod_empresa and ccod_svoucher = @ccod_svoucher\n"
          );
          var Recordarset = request_consultar_subvoucher.recordset[0];

          if (Recordarset.resultado == 0) {
            const request_eliminar_detalle  = new mssql.Request(transaction);
            await request_eliminar_detalle
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('ccod_svoucher',mssql.VarChar(250),req.body.Codigo)
            .query(            
              " delete from hsubvoud \n"+
              " where ccod_empresa = @ccod_empresa and ccod_svoucher = @ccod_svoucher \n"
            );

            const request_eliminar_cabecera  = new mssql.Request(transaction);
            await request_eliminar_cabecera
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('ccod_svoucher',mssql.VarChar(250),req.body.Codigo)
            .query(            
              " delete from hsubvouc \n"+
              " where ccod_empresa = @ccod_empresa and ccod_svoucher = @ccod_svoucher \n"
            );
              
            transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
            res.send({estado: true, codigo: "0", mensaje: ''});
          }else{

            transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
            res.send({estado: false, codigo: "0", mensaje: 'El subvoucher tiene movimientos relacionados'});
          }
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