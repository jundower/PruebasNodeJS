const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');

router.post('/lista', async (req, res) => {
  try {
      const codigo_empresa = req.user.codigo_empresa;
      const {codigo} = req.params;

      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .input('codigo', mssql.VarChar(250), codigo)
      .query(
        "select \n"+
        "Hctacteb.cnum_ctacte as Codigo, \n"+
        "Hctacteb.descripcion as Nombre, \n"+
        "rtrim(ltrim(Hctacteb.ccod_banco)) + ' - ' + Hbancos.cnom_banco as Banco, \n"+
        "rtrim(ltrim(Hctacteb.ccod_banco))  as Codigo_Banco, \n"+
        "Hbancos.cnom_banco as Nombre_Banco, \n"+
        "RTRIM(LTRIM(Hctacteb.cmoneda)) as Moneda, \n"+
        "rtrim(ltrim(Hctacteb.ccuenta))  as Cuenta, \n"+
        "Hctacteb.conciliacion as Conciliacion, \n"+
        "Hctacteb.caj_ban as Tipo_Caja, \n"+
        "Hctacteb.tipo_doc_pred as Tipo_Documento_Predeterminado, \n"+
        "RTRIM(LTRIM(Hctacteb.tipo_doc)) as Tipo_Documento, \n"+
        "Hctacteb.correlativo as Correlativo, \n"+
        "Hctacteb.erp_logo as Logo, \n"+
        "Hctacteb.si_pto_vta as Si_Pto_Venta, \n"+
        "Hctacteb.si_fdo_fjo as Si_Fondo_Fijo, \n"+
        "Hctacteb.si_banco as Si_Banco, \n"+
        "convert(varchar,Hctacteb.Hctacteb_fechmodificacion,103) as FechaModificacion, \n"+
        "Hctacteb.NombreEquipo as NombreEquipo, \n"+
        "convert(varchar(8),Hctacteb.HoraPc,108) as Hora, \n"+
        "Hctacteb.Ip_Cliente as IP_Cliente, \n"+
        "Hctacteb.ErpUsuario as ErpUsuario, \n"+
        "rtrim(ltrim(Hctacteb.ccuenta))as Codigo_Cuenta_Contable \n"+
        "from \n"+
        "Hctacteb Inner Join Hbancos On \n"+
        "Hctacteb.ccod_banco = Hbancos.ccod_banco and\n"+
        "Hctacteb.ccod_empresa = Hbancos.ccod_empresa \n"+
        "left Join Hplancon On \n"+
        "Hctacteb.ccod_empresa = Hplancon.ccod_empresa And \n"+
        "Hctacteb.ccuenta = Hplancon.ccuenta \n"+
        "where \n"+
        "Hctacteb.ccod_empresa= @codigo_empresa \n"+
        " and Hctacteb.si_pto_vta='S'\n"
        );
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

router.post('/lista/:codigo', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const {codigo} = req.params;

        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo', mssql.VarChar(250), codigo)
        .query(
          "select \n"+
          "Hctacteb.cnum_ctacte as Codigo, \n"+
          "(Hctacteb.cnum_ctacte +' - ' +Hctacteb.descripcion) as Nombre, \n"+
          "Hctacteb.descripcion as Descripcion_Banco, \n"+
          "rtrim(ltrim(Hctacteb.ccod_banco)) + ' - ' + Hbancos.cnom_banco as Banco, \n"+
          "rtrim(ltrim(Hctacteb.ccod_banco))  as Codigo_Banco, \n"+
          "Hbancos.cnom_banco as Nombre_Banco, \n"+
          "RTRIM(LTRIM(Hctacteb.cmoneda)) as Moneda, \n"+
          "rtrim(ltrim(Hctacteb.ccuenta)) +' - '+ Hplancon.cnom_cuenta as Cuenta, \n"+
          "Hctacteb.conciliacion as Conciliacion, \n"+
          "Hctacteb.caj_ban as Tipo_Caja, \n"+
          "Hctacteb.tipo_doc_pred as Tipo_Documento_Predeterminado, \n"+
          "RTRIM(LTRIM(Hctacteb.tipo_doc)) as Tipo_Documento, \n"+
          "Hctacteb.correlativo as Correlativo, \n"+
          "Hctacteb.erp_logo as Logo, \n"+
          "Hctacteb.si_pto_vta as Si_Pto_Venta, \n"+
          "Hctacteb.si_fdo_fjo as Si_Fondo_Fijo, \n"+
          "Hctacteb.si_banco as Si_Banco, \n"+
          "Hctacteb.Hctacteb_fechmodificacion as FechaModificacion, \n"+
          "Hctacteb.NombreEquipo as NombreEquipo, \n"+
          "convert(varchar(8),Hctacteb.HoraPc,108) as Hora, \n"+
          "Hctacteb.Ip_Cliente as IP_Cliente, \n"+
          "Hctacteb.ErpUsuario as ErpUsuario, \n"+
          "rtrim(ltrim(Hctacteb.ccuenta))as Codigo_Cuenta_Contable \n"+
          "from \n"+
          "Hctacteb Inner Join Hbancos On \n"+
          "Hctacteb.ccod_banco = Hbancos.ccod_banco and\n"+
          "Hctacteb.ccod_empresa = Hbancos.ccod_empresa \n"+
          "left Join Hplancon On \n"+
          "Hctacteb.ccod_empresa = Hplancon.ccod_empresa And \n"+
          "Hctacteb.ccuenta = Hplancon.ccuenta \n"+
          "where \n"+
          "Hctacteb.ccod_empresa= @codigo_empresa \n"+
          "and Hctacteb.cnum_ctacte = case @codigo when 'todos' then Hctacteb.cnum_ctacte else @codigo end \n"
          );
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
      res.send(err.message)
    }
});

router.post('/saldo', async (req, res) => {
  try {
      const codigo_empresa = req.user.codigo_empresa;

      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .input('Cta_cte', mssql.VarChar(250), req.body.Cta_cte)
      .input('Periodo', mssql.VarChar(250), req.body.Periodo)
      .input('Tipo', mssql.VarChar(250), req.body.tipo)
      .query("declare @p5 nvarchar(80)  \n"+
      "exec sq_saldo_bancos @codigo_empresa,@Cta_cte,@Periodo,@Tipo,@p5 output  \n"+
      "select @p5 as Saldo")

      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    res.send(err.message)
  }
});
  
module.exports = router;