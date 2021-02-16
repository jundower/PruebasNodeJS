const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');

router.post('/lista', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        var nivel = req.body.nivel;
        if(nivel==null){
          nivel="0";
        }
        var cuenta = req.body.cuenta;
        if(cuenta==null){
          cuenta="";
        }
        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('nivel', mssql.VarChar(250), nivel)
        .input('cuenta', mssql.VarChar(250), cuenta)
        .query(
          "select \n"+
          "ccuenta_padre as Cuenta_Padre, \n"+
          "ccuenta as Codigo, \n"+
          "cnom_cuenta as Nombre, \n"+
          "nnivel_cuenta as Nivel, \n"+
          "ccod_tipaux as Tipo_Auxiliar, \n"+
          "csicencos as Si_CenCos, \n"+
          "cclase_cuenta as Clase_Cuenta, \n"+
          "ctip_cam_ajuste as Ajuste_Tc, \n"+
          "ot as Si_Ot, \n"+
          "dh as D_H, \n"+
          "csipresup as Si_Presupuesto, \n"+
          "daot as Daot, \n"+
          "sitransfer as Si_Transferencia, \n"+
          "nombre_presupuesto as Nombre_Presupuesto, \n"+
          "genera_diferencia as Si_Genera_Diferencia, \n"+
          "moneda_ajuste_2 as Ajuste_Tipo_Tc, \n"+
          "Erp_Elemento as Elemento, \n"+
          "erp_moneda_cierre as Moneda_Cierre, \n"+
          "clasif_bien_servicio as Bien_Servicio_Clasificacion, \n"+
          "CONVERT(VARCHAR,Fecha_creacion,103) as Fecha_Creacion \n"+
          "from Hplancon \n"+
          "where ccod_empresa = @codigo_empresa \n"+
          "and nnivel_cuenta = case @nivel when 0 then nnivel_cuenta else @nivel end \n"+
          "and ccuenta = case @cuenta when '' then ccuenta else @cuenta end "
        );
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
      res.send(err.message)
    }
});
router.post('/lista2', async (req, res) => {
  try {
      const codigo_empresa = req.user.codigo_empresa;
      var nivel = req.body.nivel;
      if(nivel==null){
        nivel="0";
      }
      var cuenta = req.body.cuenta;
      if(cuenta==null){
        cuenta="";
      }
      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .input('nivel', mssql.VarChar(250), '5')
      .input('cuenta', mssql.VarChar(250), cuenta)
      .query(
        "select \n"+
        "ccuenta_padre as Cuenta_Padre, \n"+
        "ccuenta as Codigo, \n"+
        "(ccuenta +' - '+cnom_cuenta) as Nombre, \n"+
        "nnivel_cuenta as Nivel, \n"+
        "ccod_tipaux as Tipo_Auxiliar, \n"+
        "csicencos as Si_CenCos, \n"+
        "cclase_cuenta as Clase_Cuenta, \n"+
        "ctip_cam_ajuste as Ajuste_Tc, \n"+
        "ot as Si_Ot, \n"+
        "dh as D_H, \n"+
        "csipresup as Si_Presupuesto, \n"+
        "daot as Daot, \n"+
        "sitransfer as Si_Transferencia, \n"+
        "nombre_presupuesto as Nombre_Presupuesto, \n"+
        "genera_diferencia as Si_Genera_Diferencia, \n"+
        "moneda_ajuste_2 as Ajuste_Tipo_Tc, \n"+
        "Erp_Elemento as Elemento, \n"+
        "erp_moneda_cierre as Moneda_Cierre, \n"+
        "clasif_bien_servicio as Bien_Servicio_Clasificacion, \n"+
        "CONVERT(VARCHAR,Fecha_creacion,103) as Fecha_Creacion \n"+
        "from Hplancon \n"+
        "where ccod_empresa = @codigo_empresa \n"+
        "and nnivel_cuenta = case @nivel when 0 then nnivel_cuenta else @nivel end \n"+
        "and ccuenta = case @cuenta when '' then ccuenta else @cuenta end "
      );
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    res.send(err.message)
  }
});
router.post('/datos', async (req, res) => {
  try {
      const codigo_empresa = req.user.codigo_empresa;
      var codigo = req.body.Codigo;
      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .input('codigo', mssql.VarChar(250), codigo)
      .query(
        "select  \n"+
        "ccuenta_padre as Cuenta_Padre, \n"+
        "ccuenta as Codigo, \n"+
        "cnom_cuenta as Nombre, \n"+
        "nnivel_cuenta as Nivel, \n"+
        "ccod_tipaux as Tipo_Auxiliar, \n"+
        "csicencos as Si_CenCos, \n"+
        "cclase_cuenta as Clase_Cuenta, \n"+
        "ctip_cam_ajuste as Ajuste_Tc, \n"+
        "ot as Si_Ot, \n"+
        "dh as D_H, \n"+
        "csipresup as Si_Presupuesto, \n"+
        "daot as Daot, \n"+
        "sitransfer as Si_Transferencia, \n"+
        "nombre_presupuesto as Nombre_Presupuesto, \n"+
        "genera_diferencia as Si_Genera_Diferencia, \n"+
        "moneda_ajuste_2 as Ajuste_Tipo_Tc, \n"+
        "Erp_Elemento as Elemento, \n"+
        "erp_moneda_cierre as Moneda_Cierre, \n"+
        "clasif_bien_servicio as Bien_Servicio_Clasificacion, \n"+
        "Fecha_creacion as Fecha_Creacion \n"+
        "from Hplancon \n"+
        "where ccod_empresa = @codigo_empresa \n"+
        "and ccuenta = @codigo"
      );
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    res.send(err.message)
  }
});
router.post('/cuentas_item', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    var codigo = req.body.Codigo;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo', mssql.VarChar(250), codigo)
    .query(
      " Select  \n"+
      " cfamilia as Codigo, \n"+
      " cnom_familia as Nombre, \n"+
      " ltrim(rtrim(abrev)) as Abreviatura, \n"+
      " afecta_nombre as Afecta_Nombre, \n"+
      " LTRIM(RTRIM(ccuenta)) as Cuenta_Debe_Pagar, \n"+
      " LTRIM(RTRIM(ccuenta_h)) as Cuenta_Haber, \n"+
      " '' as Cuenta_Provision, \n"+
      " LTRIM(RTRIM(ccuenta_vd)) as Cuenta_Diferida, \n"+
      " LTRIM(RTRIM(cta_costo_venta_d)) as Cuenta_Costo_Debe, \n"+
      " LTRIM(RTRIM(cta_costo_venta_h)) as Cuenta_Costo_Haber, \n"+
      " costo_dia as costo_dia, \n"+
      " costo_hora as costo_hora, \n"+
      " cta_produccion_haber as Cuenta_Produccion_Haber, \n"+
      " cta_produccion_debe as Cuenta_Produccion_Debe, \n"+
      " erp_cta_nc_dev as Cuenta_Nota_Credito_Dev, \n"+
      " cta_alm_ne_debe as Cuenta_Nota_Entrada_Debe, \n"+
      " cta_alm_ne_haber as Cuenta_Nota_Entrada_Haber, \n"+
      " cta_alm_ns_debe as Cuenta_Nota_Salida_Debe, \n"+
      " cta_alm_ns_haber as Cuenta_Nota_Salida_Haber, \n"+
      " cta_import_debe as Cuenta_Import_Debe \n"+
      " From Hfam_art \n"+
      " Where ccod_empresa = @codigo_empresa And cfamilia = @codigo \n"
    );
    const recordset = lista.recordset;
    res.json(recordset); 
} catch (err) {
  res.send(err.message)
}
});

router.post('/transferencias', async (req, res) => {
  try {
      const codigo_empresa = req.user.codigo_empresa;
      console.log(req.body.Codigo)
      var codigo = req.body.Codigo;
      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .input('codigo', mssql.VarChar(250), codigo)
      .query(
      "select \n"+
      "ccuenta_padre as Cuenta_Padre, \n"+
      "hplancon.ccuenta as Codigo, \n"+
      "cnom_cuenta as Nombre, \n"+
      "(hplancon.ccuenta+' - '+cnom_cuenta) as Cuenta, \n"+
      "nnivel_cuenta as Nivel, \n"+
      "ccod_tipaux as Tipo_Auxiliar, \n"+
      "csicencos as Si_CenCos, \n"+
      "cclase_cuenta as Clase_Cuenta, \n"+
      "ctip_cam_ajuste as Ajuste_Tc, \n"+
      "ot as Si_Ot, \n"+
      "dh as D_H, \n"+
      "csipresup as Si_Presupuesto, \n"+
      "daot as Daot, \n"+
      "sitransfer as Si_Transferencia, \n"+
      "nombre_presupuesto as Nombre_Presupuesto, \n"+
      "genera_diferencia as Si_Genera_Diferencia, \n"+
      "moneda_ajuste_2 as Ajuste_Tipo_Tc, \n"+
      "Erp_Elemento as Elemento, \n"+
      "erp_moneda_cierre as Moneda_Cierre, \n"+
      "clasif_bien_servicio as Bien_Servicio_Clasificacion, \n"+
      "CONVERT(VARCHAR,Fecha_creacion,103) as Fecha_Creacion, \n"+
      "nporc_debe as Porcentaje_Debe, \n"+
      "nporc_haber as Porcentaje_Haber \n"+
      "from Hplancon \n"+
      "inner join hctatrf on \n"+
      "Hplancon.ccod_empresa = hctatrf.ccod_empresa \n"+
      "and Hplancon.ccuenta = hctatrf.cxtransfer \n"+
      "where hctatrf.ccod_empresa = @codigo_empresa \n"+
      "and hctatrf.ccuenta = @codigo \n"
      );
      const recordset = lista.recordset;
      console.log(recordset);
      res.json(recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

router.post('/icbper', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    var codigo = req.body.Codigo;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .query(
      " select \n"+
      " ccuenta_padre as Cuenta_Padre, \n"+
      " hplancon.ccuenta as Codigo, \n"+
      " cnom_cuenta as Nombre, \n"+
      " nnivel_cuenta as Nivel, \n"+
      " ccod_tipaux as Tipo_Auxiliar, \n"+
      " csicencos as Si_CenCos, \n"+
      " cclase_cuenta as Clase_Cuenta, \n"+
      " ctip_cam_ajuste as Ajuste_Tc, \n"+
      " ot as Si_Ot, \n"+
      " dh as D_H,  \n"+
      " csipresup as Si_Presupuesto, \n"+
      " daot as Daot, \n"+
      " sitransfer as Si_Transferencia, \n"+
      " nombre_presupuesto as Nombre_Presupuesto, \n"+
      " genera_diferencia as Si_Genera_Diferencia, \n"+
      " moneda_ajuste_2 as Ajuste_Tipo_Tc, \n"+
      " Erp_Elemento as Elemento, \n"+
      " erp_moneda_cierre as Moneda_Cierre, \n"+
      " clasif_bien_servicio as Bien_Servicio_Clasificacion, \n"+
      " CONVERT(VARCHAR,Fecha_creacion,103) as Fecha_Creacion \n"+
      " from Hparameter inner join Hplancon on \n"+
      " Hparameter.ccod_empresa = Hplancon.ccod_empresa and \n"+
      " Hparameter.cta_icbper = Hplancon.ccuenta \n"+
      " where Hparameter.ccod_empresa = @codigo_empresa \n"
    );
    const recordset = lista.recordset;
    res.json(recordset); 
    } catch (err) {
      res.send(err.message)
    }
});

router.post('/renta_cuarta', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    var codigo = req.body.Codigo;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .query(
      " select \n"+
      " ccuenta_padre as Cuenta_Padre, \n"+
      " hplancon.ccuenta as Codigo, \n"+
      " cnom_cuenta as Nombre, \n"+
      " nnivel_cuenta as Nivel, \n"+
      " ccod_tipaux as Tipo_Auxiliar, \n"+
      " csicencos as Si_CenCos, \n"+
      " cclase_cuenta as Clase_Cuenta, \n"+
      " ctip_cam_ajuste as Ajuste_Tc, \n"+
      " ot as Si_Ot, \n"+
      " dh as D_H,  \n"+
      " csipresup as Si_Presupuesto, \n"+
      " daot as Daot, \n"+
      " sitransfer as Si_Transferencia, \n"+
      " nombre_presupuesto as Nombre_Presupuesto, \n"+
      " genera_diferencia as Si_Genera_Diferencia, \n"+
      " moneda_ajuste_2 as Ajuste_Tipo_Tc, \n"+
      " Erp_Elemento as Elemento, \n"+
      " erp_moneda_cierre as Moneda_Cierre, \n"+
      " clasif_bien_servicio as Bien_Servicio_Clasificacion, \n"+
      " CONVERT(VARCHAR,Fecha_creacion,103) as Fecha_Creacion \n"+
      " from Hparameter inner join Hplancon on \n"+
      " Hparameter.ccod_empresa = Hplancon.ccod_empresa and \n"+
      " Hparameter.cuenta_renta_cuarta = Hplancon.ccuenta \n"+
      " where Hparameter.ccod_empresa = @codigo_empresa \n"
    );
    const recordset = lista.recordset;
    res.json(recordset); 
    } catch (err) {
      res.send(err.message)
    }
});

router.post('/cuenta_exterior', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .query(
      " SELECT rtrim(ltrim(hplancon.ccuenta)) as Codigo, \n"+
      " ltrim(rtrim(hplancon.ccuenta)) + ' - ' + Upper(hplancon.cnom_cuenta) as Nombre \n"+
      " FROM hplancon   \n"+
      " WHERE hplancon.ccod_empresa  = @codigo_empresa and  \n"+
      " hplancon.nnivel_cuenta = (Select nnivel \n"+
      " From Hempresa \n"+
      " Where ccod_empresa = @codigo_empresa) \n"+
      " Order By hplancon.ccuenta Asc \n"
    );
    const recordset = lista.recordset;
    res.json(recordset); 
    } catch (err) {
      res.send(err.message)
    }
});

router.post('/clase_cuenta', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .query(
      " SELECT  hclascta.ccod_clase as Codigo, hclascta.cdes_clase as Nombre FROM hclascta "
    );
    const recordset = lista.recordset;
    res.json(recordset); 
    } catch (err) {
      res.send(err.message)
    }
});

router.post('/elemento_cuenta', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .query(
      " SELECT Erp_Elemento_Cuenta.Ccod_Elemento as Codigo, Erp_Elemento_Cuenta.Cnom_Elemento as Nombre FROM Erp_Elemento_Cuenta "
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
    var filas_cuentas_transferencia = JSON.parse(req.body.Lista_Cuentas_Transferemcia)

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{

          const request  = new mssql.Request(transaction);
          await request
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccuenta',mssql.VarChar(250),req.body.Codigo)
          .input('cnom_cuenta',mssql.VarChar(250),req.body.Nombre)
          .input('ccuenta_padre',mssql.VarChar(250),req.body.Cuenta_Padre)
          .input('nnivel_cuenta',mssql.VarChar(250),req.body.Nivel)
          .input('ccod_tipaux',mssql.VarChar(250),req.body.Tipo_Auxiliar)
          .input('csicencos',mssql.VarChar(250),req.body.cencos_s_n)
          .input('cclase_cuenta',mssql.VarChar(250),req.body.Clase_Cuenta)
          .input('ctip_cam_ajuste',mssql.VarChar(250),req.body.Ajuste_Deudor)
          .input('ot',mssql.VarChar(250),req.body.ot_s_n)
          .input('dh',mssql.VarChar(250),req.body.D_H)
          .input('ctapdt',mssql.VarChar(250),req.body.Cuenta_Pdt)
          .input('csipresup',mssql.VarChar(250),req.body.Presupuesto_s_n)
          .input('daot',mssql.VarChar(250),req.body.Daot)
          .input('sitransfer',mssql.VarChar(250),req.body.transferencia_s_n)
          .input('nombre_presupuesto',mssql.VarChar(250),req.body.Nombre_Presupuesto)
          .input('genera_diferencia',mssql.VarChar(250),req.body.Diferencia_Cierre)
          .input('moneda_ajuste_2',mssql.VarChar(250),req.body.Ajuste_Acreedor)
          .input('ccuenta_exterior',mssql.VarChar(250),req.body.Cuenta_Exterior)
          .input('erp_booune',mssql.VarChar(250),'')
          .input('Erp_Elemento',mssql.VarChar(250),req.body.Elemento)
          .input('erp_moneda_cierre',mssql.VarChar(250),req.body.Moneda_Cierre)
          .input('clasif_bien_servicio',mssql.VarChar(250),req.body.Clasificacion_bs)
          .input('Fecha_creacion',mssql.VarChar(250),'')
          .query(            
            " insert into Hplancon( \n"+
            " ccod_empresa, \n"+
            " ccuenta, \n"+
            " ccuenta_padre, \n"+
            " cnom_cuenta, \n"+
            " nnivel_cuenta, \n"+
            " ccod_tipaux, \n"+
            " csicencos, \n"+
            " cclase_cuenta, \n"+
            " ctip_cam_ajuste, \n"+
            " ot, \n"+
            " dh, \n"+
            " ctapdt, \n"+
            " csipresup, \n"+
            " daot, \n"+
            " sitransfer, \n"+
            " nombre_presupuesto, \n"+
            " genera_diferencia, \n"+
            " moneda_ajuste_2, \n"+
            " ccuenta_exterior, \n"+
            " erp_booune, \n"+
            " Erp_Elemento, \n"+
            " erp_moneda_cierre, \n"+
            " clasif_bien_servicio, \n"+
            " Fecha_creacion \n"+
            " )values( \n"+
            " @ccod_empresa, \n"+
            " @ccuenta, \n"+
            " @ccuenta_padre, \n"+
            " @cnom_cuenta, \n"+
            " @nnivel_cuenta, \n"+
            " @ccod_tipaux, \n"+
            " @csicencos, \n"+
            " @cclase_cuenta, \n"+
            " @ctip_cam_ajuste, \n"+
            " @ot, \n"+
            " @dh, \n"+
            " @ctapdt, \n"+
            " @csipresup, \n"+
            " @daot, \n"+
            " @sitransfer, \n"+
            " @nombre_presupuesto, \n"+
            " @genera_diferencia, \n"+
            " @moneda_ajuste_2, \n"+
            " @ccuenta_exterior, \n"+
            " @erp_booune, \n"+
            " @Erp_Elemento, \n"+
            " @erp_moneda_cierre, \n"+
            " @clasif_bien_servicio, \n"+
            " getdate() ) \n"
          );

          for (let i= 0; i< filas_cuentas_transferencia.length; i++){
            
            var fila = filas_cuentas_transferencia[i];
            const request_cuentas_transferencias  = new mssql.Request(transaction);
            await request_cuentas_transferencias
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('ccuenta',mssql.VarChar(250),req.body.Codigo)
            .input('cxtransfer',mssql.VarChar(250),fila.Codigo)
            .input('nporc_debe',mssql.VarChar(250),fila.Porcentaje_Debe)
            .input('nporc_haber',mssql.VarChar(250),fila.Porcentaje_Haber)
            .query(
             " insert into hctatrf( \n"+
             " ccod_empresa, \n"+
             " ccuenta, \n"+
             " cxtransfer, \n"+
             " nporc_debe, \n"+
             " nporc_haber \n"+
             " )values( \n"+
             " @ccod_empresa, \n"+
             " @ccuenta, \n"+
             " @cxtransfer, \n"+
             " @nporc_debe, \n"+
             " @nporc_haber ) \n"
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
    var filas_cuentas_transferencia = JSON.parse(req.body.Lista_Cuentas_Transferemcia)

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{
          const request  = new mssql.Request(transaction);
          await request
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccuenta',mssql.VarChar(250),req.body.Codigo)
          .input('cnom_cuenta',mssql.VarChar(250),req.body.Nombre)
          .input('ccuenta_padre',mssql.VarChar(250),req.body.Cuenta_Padre)
          .input('nnivel_cuenta',mssql.VarChar(250),req.body.Nivel)
          .input('ccod_tipaux',mssql.VarChar(250),req.body.Tipo_Auxiliar)
          .input('csicencos',mssql.VarChar(250),req.body.cencos_s_n)
          .input('cclase_cuenta',mssql.VarChar(250),req.body.Clase_Cuenta)
          .input('ctip_cam_ajuste',mssql.VarChar(250),req.body.Ajuste_Deudor)
          .input('ot',mssql.VarChar(250),req.body.ot_s_n)
          .input('dh',mssql.VarChar(250),req.body.D_H)
          .input('ctapdt',mssql.VarChar(250),req.body.Cuenta_Pdt)
          .input('csipresup',mssql.VarChar(250),req.body.Presupuesto_s_n)
          .input('daot',mssql.VarChar(250),req.body.Daot)
          .input('sitransfer',mssql.VarChar(250),req.body.transferencia_s_n)
          .input('nombre_presupuesto',mssql.VarChar(250),req.body.Nombre_Presupuesto)
          .input('genera_diferencia',mssql.VarChar(250),req.body.Diferencia_Cierre)
          .input('moneda_ajuste_2',mssql.VarChar(250),req.body.Ajuste_Acreedor)
          .input('ccuenta_exterior',mssql.VarChar(250),req.body.Cuenta_Exterior)
          .input('erp_booune',mssql.VarChar(250),'')
          .input('Erp_Elemento',mssql.VarChar(250),req.body.Elemento)
          .input('erp_moneda_cierre',mssql.VarChar(250),req.body.Moneda_Cierre)
          .input('clasif_bien_servicio',mssql.VarChar(250),req.body.Clasificacion_bs)
          .input('Fecha_creacion',mssql.VarChar(250),'')
          .query(            
          "update Hplancon set \n"+
          "ccuenta_padre = @ccuenta_padre, \n"+
          "nnivel_cuenta = @nnivel_cuenta, \n"+
          "ccod_tipaux = @ccod_tipaux, \n"+
          "csicencos = @csicencos, \n"+
          "cclase_cuenta = @cclase_cuenta, \n"+
          "ctip_cam_ajuste = @ctip_cam_ajuste, \n"+
          "ot = @ot, \n"+
          "dh = @dh, \n"+
          "ctapdt = @ctapdt, \n"+
          "csipresup = @csipresup, \n"+
          "daot = @daot, \n"+
          "sitransfer = @sitransfer, \n"+
          "nombre_presupuesto = @nombre_presupuesto, \n"+
          "genera_diferencia = @genera_diferencia, \n"+
          "moneda_ajuste_2 = @moneda_ajuste_2, \n"+
          "ccuenta_exterior = @ccuenta_exterior, \n"+
          "erp_booune = @erp_booune, \n"+
          "Erp_Elemento = @Erp_Elemento, \n"+
          "erp_moneda_cierre = @erp_moneda_cierre, \n"+
          "clasif_bien_servicio = @clasif_bien_servicio, \n"+
          "Fecha_creacion = getdate() \n"+
          "where  ccod_empresa = @ccod_empresa and ccuenta = @ccuenta \n"
          );

          const request_eliminar_cuenta_transferencia  = new mssql.Request(transaction);
          await request_eliminar_cuenta_transferencia
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccuenta',mssql.VarChar(250),req.body.Codigo)
          .query(            
            " delete from hctatrf where ccod_empresa = @ccod_empresa and ccuenta = @ccuenta \n"
          );

          for (let i= 0; i< filas_cuentas_transferencia.length; i++){
            
            var fila = filas_cuentas_transferencia[i];
            const request_cuentas_transferencias  = new mssql.Request(transaction);
            await request_cuentas_transferencias
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('ccuenta',mssql.VarChar(250),req.body.Codigo)
            .input('cxtransfer',mssql.VarChar(250),fila.Codigo)
            .input('nporc_debe',mssql.VarChar(250),fila.Porcentaje_Debe)
            .input('nporc_haber',mssql.VarChar(250),fila.Porcentaje_Haber)
            .query(
             " insert into hctatrf( \n"+
             " ccod_empresa, \n"+
             " ccuenta, \n"+
             " cxtransfer, \n"+
             " nporc_debe, \n"+
             " nporc_haber \n"+
             " )values( \n"+
             " @ccod_empresa, \n"+
             " @ccuenta, \n"+
             " @cxtransfer, \n"+
             " @nporc_debe, \n"+
             " @nporc_haber ) \n"
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

          const pool = await poolPromise
          var request_consultar_cuenta = await pool
          .request()
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccuenta',mssql.VarChar(250),req.body.Codigo)
          .query(            
           " select Count(*)  as resultado from hmovcond where ccuenta = @ccuenta and ccod_empresa = @ccod_empresa \n"
          );
          var Recordarset = request_consultar_cuenta.recordset[0];

          if (Recordarset.resultado == 0) {

            const request_cuentas_transferencias  = new mssql.Request(transaction);
            await request_cuentas_transferencias
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('ccuenta',mssql.VarChar(250),req.body.Codigo)
            .query(            
            "delete from hctatrf where  ccod_empresa = @ccod_empresa and ccuenta = @ccuenta \n"
            );

            const request  = new mssql.Request(transaction);
            await request
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('ccuenta',mssql.VarChar(250),req.body.Codigo)
            .query(            
            "delete from Hplancon where  ccod_empresa = @ccod_empresa and ccuenta = @ccuenta \n"
            );

            transaction.commit(tErr => {if(tErr) {console.log(tErr)}})
            res.send({estado: true, codigo: 0, mensaje: ""});
          }else{

            transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
            res.send({estado: false, codigo: "0", mensaje: 'La Cuenta Esta Relacionado A Movimientos Contables'});
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