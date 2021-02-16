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
      " Select erp_codgru as Codigo, \n"+
      " erp_nomgru as Nombre, \n"+
      " (erp_gruane.erp_tipane + ' - ' + Htipaux.cnom_tipaux) as Tipo   \n"+
      " From erp_gruane Inner Join Htipaux On   \n"+
      " erp_gruane.erp_codemp = Htipaux.ccod_empresa And   \n"+
      " erp_gruane.erp_tipane = Htipaux.ccod_tipaux   \n"+
      " Where erp_codemp = @codigo_empresa \n"
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
    .input('tipo', mssql.VarChar(10), req.body.tipo)
    .query(
      " Select  \n"+
      " erp_moncta as Codigo_Moneda,  \n"+
      " erp_ctagru as Cuenta,  \n"+
      " hplancon.cnom_cuenta as Nombre_Cuenta,  \n"+
      " erp_tipcta as Codigo_Tipo  \n"+
      " From ERP_CTAGRU  inner join hplancon on\n"+
      " ERP_CTAGRU.erp_codemp = hplancon.ccod_empresa and\n"+
      " ERP_CTAGRU.erp_ctagru = hplancon.ccuenta\n"+
      " Where erp_codemp = @codigo_empresa And erp_tipgru = @tipo And erp_codgru = @codigo  \n"+
      " order by erp_tipcta  \n"
      );

    const recordset = lista.recordset;
    res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

router.post('/guardar', async (req, res) => {
  try {
  
    var filas_cuentas_grupos_auxiliar = JSON.parse(req.body.lista_cuentas_grupo_auxiliar)

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);

    await transaction.begin(async err => {
        try{

          //#region Guardar
          const datos_grupo_auxiliar  = new mssql.Request(transaction);
          await datos_grupo_auxiliar
          .input('erp_codemp', mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codgru', mssql.VarChar(250),req.body.Codigo)
          .input('erp_nomgru', mssql.VarChar(250),req.body.Nombre)
          .input('erp_tipane', mssql.VarChar(250),req.body.Tipo_Auxiliar)
          .query(
          " insert into erp_gruane ( \n"+
          " erp_codemp, \n"+
          " erp_tipane, \n"+
          " erp_codgru, \n"+
          " erp_nomgru \n"+
          " )values( \n"+
          " @erp_codemp, \n"+
          " @erp_tipane, \n"+
          " @erp_codgru, \n"+
          " @erp_nomgru) \n");
          //#endregion

          for (let i= 0; i< filas_cuentas_grupos_auxiliar.length; i++){

            var fila = filas_cuentas_grupos_auxiliar[i];
            const request_cuentas_grupo_auxiliar  = new mssql.Request(transaction);
            await request_cuentas_grupo_auxiliar
            .input('Erp_Codemp',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Erp_CodGru',mssql.VarChar(250),req.body.Codigo)
            .input('Erp_TipGru',mssql.VarChar(250),req.body.Tipo_Auxiliar)
            .input('Erp_MonCta',mssql.VarChar(250),fila.Moneda)
            .input('Erp_CtaGru',mssql.VarChar(250),fila.Cuenta)
            .input('Erp_Tipcta',mssql.VarChar(250),fila.Tipo_Cuenta)
            .query(
              " insert into ERP_CTAGRU ( \n"+
              " Erp_Codemp, \n"+
              " Erp_CodGru, \n"+
              " Erp_TipGru, \n"+
              " Erp_MonCta, \n"+
              " Erp_CtaGru, \n"+
              " Erp_Tipcta \n"+
              " )values( \n"+
              " @Erp_Codemp, \n"+
              " @Erp_CodGru, \n"+
              " @Erp_TipGru, \n"+
              " @Erp_MonCta, \n"+
              " @Erp_CtaGru, \n"+
              " @Erp_Tipcta) \n"
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
    var filas_cuentas_grupos_auxiliar = JSON.parse(req.body.lista_cuentas_grupo_auxiliar)

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);

    await transaction.begin(async err => {
        try{

           //#region Guardar
           const datos_grupo_auxiliar  = new mssql.Request(transaction);
           await datos_grupo_auxiliar
           .input('erp_codemp', mssql.VarChar(250),req.user.codigo_empresa)
           .input('erp_codgru', mssql.VarChar(250),req.body.Codigo)
           .input('erp_nomgru', mssql.VarChar(250),req.body.Nombre)
           .input('erp_tipane', mssql.VarChar(250),req.body.Tipo_Auxiliar)
           .query(
           " update erp_gruane set \n"+
           " erp_tipane = @erp_tipane, \n"+
           " erp_nomgru = @erp_nomgru \n"+
           " where erp_codemp = @erp_codemp and erp_codgru = @erp_codgru \n");
           //#endregion

           const request_eliminar_detalle  = new mssql.Request(transaction);
           await request_eliminar_detalle
           .input('Erp_Codemp',mssql.VarChar(250),req.user.codigo_empresa)
           .input('Erp_CodGru',mssql.VarChar(250),req.body.Codigo)
           .input('Erp_TipGru', mssql.VarChar(250),req.body.Tipo_Auxiliar)
           .query(            
             " delete from ERP_CTAGRU \n"+
             " where Erp_Codemp = @Erp_Codemp and Erp_CodGru = @Erp_CodGru and Erp_TipGru = @Erp_TipGru \n"
           );
 
           for (let i= 0; i< filas_cuentas_grupos_auxiliar.length; i++){

            var fila = filas_cuentas_grupos_auxiliar[i];
            const request_cuentas_grupo_auxiliar  = new mssql.Request(transaction);
            await request_cuentas_grupo_auxiliar
            .input('Erp_Codemp',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Erp_CodGru',mssql.VarChar(250),req.body.Codigo)
            .input('Erp_TipGru',mssql.VarChar(250),req.body.Tipo_Auxiliar)
            .input('Erp_MonCta',mssql.VarChar(250),fila.Moneda)
            .input('Erp_CtaGru',mssql.VarChar(250),fila.Cuenta)
            .input('Erp_Tipcta',mssql.VarChar(250),fila.Tipo_Cuenta)
            .query(
              " insert into ERP_CTAGRU ( \n"+
              " Erp_Codemp, \n"+
              " Erp_CodGru, \n"+
              " Erp_TipGru, \n"+
              " Erp_MonCta, \n"+
              " Erp_CtaGru, \n"+
              " Erp_Tipcta \n"+
              " )values( \n"+
              " @Erp_Codemp, \n"+
              " @Erp_CodGru, \n"+
              " @Erp_TipGru, \n"+
              " @Erp_MonCta, \n"+
              " @Erp_CtaGru, \n"+
              " @Erp_Tipcta) \n"
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
    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);

    await transaction.begin(async err => {
        try{

          //#region Eliminar
          const request_eliminar_detalle  = new mssql.Request(transaction);
          await request_eliminar_detalle
          .input('Erp_Codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Erp_CodGru',mssql.VarChar(250),req.body.Codigo)
          .input('Erp_TipGru', mssql.VarChar(250),req.body.Tipo_Auxiliar)
          .query(            
            " delete from ERP_CTAGRU \n"+
            " where Erp_Codemp = @Erp_Codemp and Erp_CodGru = @Erp_CodGru and Erp_TipGru = @Erp_TipGru \n"
          );
          //#endregion

          const datos_grupo_auxiliar  = new mssql.Request(transaction);
           await datos_grupo_auxiliar
           .input('erp_codemp', mssql.VarChar(250),req.user.codigo_empresa)
           .input('erp_codgru', mssql.VarChar(250),req.body.Codigo)
           .query(
           " delete from erp_gruane  \n"+
           " where erp_codemp = @erp_codemp and erp_codgru = @erp_codgru \n");

          transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: true, codigo: "0", mensaje: ''});
        }catch(err){
          transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: false, codigo: "Err", mensaje: "El Grupo de Auxiliar " + req.body.Codigo +" tiene movimientos"});
        }
    });    
  } catch (err) {
    console.log(err.message);
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

module.exports = router;