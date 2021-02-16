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
          "select  \n"+
          "cgrupo_cliente as Codigo, \n"+
          "cnom_grupclie as Nombre, \n"+
          "CONVERT(VARCHAR,Hgpoclie_fechmodificacion,103) as Fecha_Modificacion, \n"+
          "NombreEquipo as PC, \n"+
          "CONVERT(VARCHAR,HoraPc,25) as Hora_Modificacion, \n"+
          "Ip_Cliente as Ip_Cliente,  \n"+
          "ErpUsuario as Usuario \n"+
          "from Hgpoclie where  \n"+
          "ccod_empresa = @codigo_empresa \n"
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
      .input('tipo', mssql.VarChar(10),  req.body.tipo)
      .query(
        " Select  \n"+
        " Erp_Codemp as Codigo_Empresa, \n"+
        " erp_moncta as Codigo_Moneda, \n"+
        " erp_ctagru as Cuenta, \n"+
        " Hplancon.cnom_cuenta as Nombre_Cuenta, \n"+
        " erp_tipcta as Codigo_Tipo \n"+
        " From ERP_CTAGRU inner join Hplancon \n"+
        " on ERP_CTAGRU.Erp_Codemp = Hplancon.ccod_empresa and  \n"+
        " ERP_CTAGRU.Erp_CtaGru = Hplancon.ccuenta \n"+
        " Where erp_codemp = @codigo_empresa And erp_tipgru = @tipo And erp_codgru = @codigo \n"+
        " order by erp_tipcta \n"
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
    var filas_grupo_cliente_cuentas = JSON.parse(req.body.Lista_Cuentas_Grupos_Clientes)

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);

    await transaction.begin(async err => {
        try{

          //#region Guardar Grupo Cliente
          const datos_grupo_cliente  = new mssql.Request(transaction);
          await datos_grupo_cliente
          .input('ccod_empresa', mssql.VarChar(250),req.user.codigo_empresa)
          .input('cgrupo_cliente', mssql.VarChar(250),req.body.Codigo)
          .input('cnom_grupclie', mssql.VarChar(250),req.body.Nombre)
          .input('Hgpoclie_fechmodificacion', mssql.VarChar(250),'')
          .input('NombreEquipo', mssql.VarChar(250),'')
          .input('HoraPc', mssql.VarChar(250),'')
          .input('Ip_Cliente', mssql.VarChar(250),'')
          .input('ErpUsuario', mssql.VarChar(250), usuario)
          .query(
          " insert into Hgpoclie( \n"+
          " ccod_empresa, \n"+
          " cgrupo_cliente, \n"+
          " cnom_grupclie, \n"+
          " Hgpoclie_fechmodificacion, \n"+
          " NombreEquipo, \n"+
          " HoraPc, \n"+
          " Ip_Cliente, \n"+
          " ErpUsuario \n"+
          " )values( \n"+
          " @ccod_empresa, \n"+
          " @cgrupo_cliente, \n"+
          " @cnom_grupclie, \n"+
          " getdate(), \n"+
          " @NombreEquipo, \n"+
          " getdate(), \n"+
          " @Ip_Cliente, \n"+
          " @ErpUsuario) \n"
          );
          //#endregion
    
          //#region Guardar Cuentas Grupo Cliente
          for (let i= 0; i< filas_grupo_cliente_cuentas.length; i++){
            var fila = filas_grupo_cliente_cuentas[i];

            const grupo_clientes_cuentas = new mssql.Request(transaction);
            await grupo_clientes_cuentas
            .input('Erp_Codemp',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Erp_CodGru',mssql.VarChar(250),req.body.Codigo)
            .input('Erp_TipGru',mssql.VarChar(250),'12')
            .input('Erp_MonCta',mssql.VarChar(250),fila.Moneda)
            .input('Erp_CtaGru',mssql.VarChar(250),fila.Cuenta)
            .input('Erp_TipCta',mssql.VarChar(250),fila.Tipo_Cuenta)
            .query(
              " insert into Erp_CtaGru( \n"+
              " Erp_Codemp, \n"+
              " Erp_CodGru, \n"+
              " Erp_TipGru, \n"+
              " Erp_MonCta, \n"+
              " Erp_CtaGru, \n"+
              " Erp_TipCta \n"+
              " )values( \n"+
              " @Erp_Codemp, \n"+
              " @Erp_CodGru, \n"+
              " @Erp_TipGru, \n"+
              " @Erp_MonCta, \n"+
              " @Erp_CtaGru, \n"+
              " @Erp_TipCta) \n"
            );
          }
          //#endregion

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
    var filas_grupo_cliente_cuentas = JSON.parse(req.body.Lista_Cuentas_Grupos_Clientes)

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);

    await transaction.begin(async err => {
        try{

          //#region Modificar Grupo Cliente
          const datos_grupo_cliente  = new mssql.Request(transaction);
          await datos_grupo_cliente
          .input('ccod_empresa', mssql.VarChar(250),req.user.codigo_empresa)
          .input('cgrupo_cliente', mssql.VarChar(250),req.body.Codigo)
          .input('cnom_grupclie', mssql.VarChar(250),req.body.Nombre)
          .input('Hgpoclie_fechmodificacion', mssql.VarChar(250),'')
          .input('NombreEquipo', mssql.VarChar(250),'')
          .input('HoraPc', mssql.VarChar(250),'')
          .input('Ip_Cliente', mssql.VarChar(250),'')
          .input('ErpUsuario', mssql.VarChar(250), usuario)
          .query(
          " update Hgpoclie set \n"+
          " cnom_grupclie = @cnom_grupclie, \n"+
          " Hgpoclie_fechmodificacion = getdate(), \n"+
          " NombreEquipo = @NombreEquipo, \n"+
          " HoraPc = getdate(), \n"+
          " Ip_Cliente = @Ip_Cliente, \n"+
          " ErpUsuario = @ErpUsuario \n"+
          " where ccod_empresa = @ccod_empresa and cgrupo_cliente = @cgrupo_cliente \n"
          );
          //#endregion
    
          //#region Modificar Cuentas Grupo Cliente
          const eliminar_grupo_clientes_cuentas = new mssql.Request(transaction);
          await eliminar_grupo_clientes_cuentas
          .input('Erp_Codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Erp_CodGru',mssql.VarChar(250),req.body.Codigo)
          //.input('tipo',mssql.VarChar(250), '42')
          .query(
            " delete from Erp_CtaGru where Erp_Codemp = @Erp_Codemp and Erp_CodGru = @Erp_CodGru "
          );

          for (let i= 0; i< filas_grupo_cliente_cuentas.length; i++){
            var fila = filas_grupo_cliente_cuentas[i];

            const grupo_clientes_cuentas = new mssql.Request(transaction);
            await grupo_clientes_cuentas
            .input('Erp_Codemp',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Erp_CodGru',mssql.VarChar(250),req.body.Codigo)
            .input('Erp_TipGru',mssql.VarChar(250),'12')
            .input('Erp_MonCta',mssql.VarChar(250),fila.Moneda)
            .input('Erp_CtaGru',mssql.VarChar(250),fila.Cuenta)
            .input('Erp_TipCta',mssql.VarChar(250),fila.Tipo_Cuenta)
            .query(
              " insert into Erp_CtaGru( \n"+
              " Erp_Codemp, \n"+
              " Erp_CodGru, \n"+
              " Erp_TipGru, \n"+
              " Erp_MonCta, \n"+
              " Erp_CtaGru, \n"+
              " Erp_TipCta \n"+
              " )values( \n"+
              " @Erp_Codemp, \n"+
              " @Erp_CodGru, \n"+
              " @Erp_TipGru, \n"+
              " @Erp_MonCta, \n"+
              " @Erp_CtaGru, \n"+
              " @Erp_TipCta) \n"
            );
          }
          //#endregion

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
    var filas_grupo_cliente_cuentas = JSON.parse(req.body.Lista_Cuentas_Grupos_Clientes)

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);

    await transaction.begin(async err => {
        try{

          //#region Eliminar Grupo Cliente
          const eliminar_datos_grupo_cliente  = new mssql.Request(transaction);
          await eliminar_datos_grupo_cliente
          .input('ccod_empresa', mssql.VarChar(250),req.user.codigo_empresa)
          .input('cgrupo_cliente', mssql.VarChar(250),req.body.Codigo)
          .query(
          " delete from Hgpoclie \n"+
          " where ccod_empresa = @ccod_empresa and cgrupo_cliente = @cgrupo_cliente \n"
          );
          //#endregion
    
          //#region Eliminar Cuentas Grupo Cliente
          const eliminar_grupo_clientes_cuentas = new mssql.Request(transaction);
          await eliminar_grupo_clientes_cuentas
          .input('Erp_Codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Erp_CodGru',mssql.VarChar(250),req.body.Codigo)
          .input('ERP_TIPGRU',mssql.VarChar(250), '12')
          .query(
            " delete from Erp_CtaGru where Erp_Codemp = @Erp_Codemp and Erp_CodGru = @Erp_CodGru and ERP_TIPGRU = @ERP_TIPGRU "
          );
          //#endregion

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