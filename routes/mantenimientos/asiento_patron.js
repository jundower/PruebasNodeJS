const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');

router.post('/lista', async (req, res) => {
    try {
        const pool = await poolPromise

        const lista = await pool
        .request()
        .input('Codigo_Empresa', mssql.VarChar(10), req.user.codigo_empresa)
        .query(
        "Select  \n"+
        "Erp_codigo as Codigo, \n"+
        "Erp_nombre as Nombre , \n"+
        "Erp_abrev as Abreviatura,   \n"+
        "(Select LTrim(RTrim(Ccuenta)) + ' - ' + LTrim(RTrim(cnom_cuenta)) from hplancon    \n"+
        "where ccuenta= Erp_asiento_patron.erp_cuenta and  ccod_empresa= Erp_asiento_patron.erp_codemp) as Cuenta_Soles,   \n"+
        "Isnull((Select LTrim(RTrim(Ccuenta)) + ' - ' + LTrim(RTrim(cnom_cuenta)) from hplancon    \n"+
        "where ccuenta= Erp_asiento_patron.Erp_Cuenta_Dolares and  ccod_empresa= Erp_asiento_patron.erp_codemp),'') as Cuenta_Dolares, \n"+
        "Isnull((Select LTrim(RTrim(Ccuenta)) + ' - ' + LTrim(RTrim(cnom_cuenta)) from hplancon    \n"+
        "where ccuenta= Erp_asiento_patron.erp_cuenta_provision and  ccod_empresa= Erp_asiento_patron.erp_codemp),'') as Cuenta_Provision_Soles,   \n"+
        "Isnull((Select LTrim(RTrim(Ccuenta)) + ' - ' + LTrim(RTrim(cnom_cuenta)) from hplancon    \n"+
        "where ccuenta= Erp_asiento_patron.Erp_Cuenta_provision_dolares and  ccod_empresa= Erp_asiento_patron.erp_codemp),'') as Cuenta_Provision_Dolares  \n"+
        "From Erp_asiento_patron   \n"+
        "Where erp_codemp= @Codigo_Empresa \n"
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
    console.log(req.body);
    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{
          const request  = new mssql.Request(transaction);
          await request
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('cfamilia',mssql.VarChar(250),req.body.Codigo)
          .input('cnom_familia',mssql.VarChar(250),req.body.Nombre)
          .input('abrev',mssql.VarChar(250),req.body.Abreviatura)
          .input('afecta_nombre',mssql.VarChar(250),req.body.Afecta_Abreviatura)
          .input('ccuenta',mssql.VarChar(250),req.body.Cta_debe_pagar)
          .input('ccuenta_h',mssql.VarChar(250),req.body.Cta_haber_ventas)
          .input('ccuenta_p',mssql.VarChar(250),'00')
          .input('ccuenta_vd',mssql.VarChar(250),req.body.Cta_diferida)
          .input('cta_costo_venta_d',mssql.VarChar(250),req.body.Cta_costo_debe)
          .input('cta_costo_venta_h',mssql.VarChar(250),req.body.Cta_costo_haber)
          .input('costo_dia',mssql.VarChar(250),req.body.Costo_diario)
          .input('costo_hora',mssql.VarChar(250),req.body.Costo_X_Hora)
          .input('cta_produccion_debe',mssql.VarChar(250),req.body.Cta_costo_debe_produccion)
          .input('cta_produccion_haber',mssql.VarChar(250),req.body.Cta_costo_haber_produccion)
          .input('erp_cta_nc_dev',mssql.VarChar(250),req.body.Cta_nc_dev)
          .input('cta_alm_ne_debe',mssql.VarChar(250),req.body.Cta_ne_debe)
          .input('cta_alm_ne_haber',mssql.VarChar(250),req.body.Cta_ne_haber)
          .input('cta_alm_ns_debe',mssql.VarChar(250),req.body.Cta_ns_debe)
          .input('cta_alm_ns_haber',mssql.VarChar(250),req.body.Cta_ns_haber)
          .input('cta_import_debe',mssql.VarChar(250),req.body.Cta_debe_importacion)
          .input('hfam_fechModificacion',mssql.VarChar(250),'')
          .input('Hora',mssql.VarChar(250),'')
          .input('ErpUsuario',mssql.VarChar(250),usuario)
          .input('NombreEquipo',mssql.VarChar(250),'')
          .input('Ip_Cliente',mssql.VarChar(250),'')
          .query(            
          "insert into Hfam_art( \n"+
          "ccod_empresa, \n"+
          "cfamilia, \n"+
          "cnom_familia, \n"+
          "abrev, \n"+
          "afecta_nombre, \n"+
          "ccuenta, \n"+
          "ccuenta_h, \n"+
          "ccuenta_p, \n"+
          "ccuenta_vd, \n"+
          "cta_costo_venta_d, \n"+
          "cta_costo_venta_h, \n"+
          "costo_dia, \n"+
          "costo_hora, \n"+
          "cta_produccion_debe, \n"+
          "cta_produccion_haber, \n"+
          "erp_cta_nc_dev, \n"+
          "cta_alm_ne_debe, \n"+
          "cta_alm_ne_haber, \n"+
          "cta_alm_ns_debe, \n"+
          "cta_alm_ns_haber, \n"+
          "cta_import_debe, \n"+
          "hfam_fechModificacion, \n"+
          "Hora, \n"+
          "ErpUsuario, \n"+
          "NombreEquipo, \n"+
          "Ip_Cliente \n"+
          ")values( \n"+
          "@ccod_empresa, \n"+
          "@cfamilia, \n"+
          "@cnom_familia, \n"+
          "@abrev, \n"+
          "@afecta_nombre, \n"+
          "@ccuenta, \n"+
          "@ccuenta_h, \n"+
          "@ccuenta_p, \n"+
          "@ccuenta_vd, \n"+
          "@cta_costo_venta_d, \n"+
          "@cta_costo_venta_h, \n"+
          "@costo_dia, \n"+
          "@costo_hora, \n"+
          "@cta_produccion_debe, \n"+
          "@cta_produccion_haber, \n"+
          "@erp_cta_nc_dev, \n"+
          "@cta_alm_ne_debe, \n"+
          "@cta_alm_ne_haber, \n"+
          "@cta_alm_ns_debe, \n"+
          "@cta_alm_ns_haber, \n"+
          "@cta_import_debe, \n"+
          "getdate(), \n"+
          "getdate(), \n"+
          "@ErpUsuario, \n"+
          "@NombreEquipo,\n"+
          "@Ip_Cliente) \n"
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
          .input('cfamilia',mssql.VarChar(250),req.body.Codigo)
          .input('cnom_familia',mssql.VarChar(250),req.body.Nombre)
          .input('abrev',mssql.VarChar(250),req.body.Abreviatura)
          .input('afecta_nombre',mssql.VarChar(250),req.body.Afecta_Abreviatura)
          .input('ccuenta',mssql.VarChar(250),req.body.Cta_debe_pagar)
          .input('ccuenta_h',mssql.VarChar(250),req.body.Cta_haber_ventas)
          .input('ccuenta_p',mssql.VarChar(250),'00')
          .input('ccuenta_vd',mssql.VarChar(250),req.body.Cta_diferida)
          .input('cta_costo_venta_d',mssql.VarChar(250),req.body.Cta_costo_debe)
          .input('cta_costo_venta_h',mssql.VarChar(250),req.body.Cta_costo_haber)
          .input('costo_dia',mssql.VarChar(250),req.body.Costo_diario)
          .input('costo_hora',mssql.VarChar(250),req.body.Costo_X_Hora)
          .input('cta_produccion_debe',mssql.VarChar(250),req.body.Cta_costo_debe_produccion)
          .input('cta_produccion_haber',mssql.VarChar(250),req.body.Cta_costo_haber_produccion)
          .input('erp_cta_nc_dev',mssql.VarChar(250),req.body.Cta_nc_dev)
          .input('cta_alm_ne_debe',mssql.VarChar(250),req.body.Cta_ne_debe)
          .input('cta_alm_ne_haber',mssql.VarChar(250),req.body.Cta_ne_haber)
          .input('cta_alm_ns_debe',mssql.VarChar(250),req.body.Cta_ns_debe)
          .input('cta_alm_ns_haber',mssql.VarChar(250),req.body.Cta_ns_haber)
          .input('cta_import_debe',mssql.VarChar(250),req.body.Cta_debe_importacion)
          .input('hfam_fechModificacion',mssql.VarChar(250),'')
          .input('Hora',mssql.VarChar(250),'')
          .input('ErpUsuario',mssql.VarChar(250),usuario)
          .input('NombreEquipo',mssql.VarChar(250),'')
          .input('Ip_Cliente',mssql.VarChar(250),'')
          .query(            
          "update Hfam_art set  \n"+
          "cnom_familia = @cnom_familia, \n"+
          "abrev = @abrev, \n"+
          "afecta_nombre = @afecta_nombre, \n"+
          "ccuenta = @ccuenta, \n"+
          "ccuenta_h = @ccuenta_h, \n"+
          "ccuenta_p = @ccuenta_p, \n"+
          "ccuenta_vd = @ccuenta_vd, \n"+
          "cta_costo_venta_d = @cta_costo_venta_d, \n"+
          "cta_costo_venta_h = @cta_costo_venta_h, \n"+
          "costo_dia = @costo_dia, \n"+
          "costo_hora = @costo_hora, \n"+
          "cta_produccion_debe = @cta_produccion_debe, \n"+
          "cta_produccion_haber = @cta_produccion_haber, \n"+
          "erp_cta_nc_dev = @erp_cta_nc_dev, \n"+
          "cta_alm_ne_debe = @cta_alm_ne_debe, \n"+
          "cta_alm_ne_haber = @cta_alm_ne_haber, \n"+
          "cta_alm_ns_debe = @cta_alm_ns_debe, \n"+
          "cta_alm_ns_haber = @cta_alm_ns_haber, \n"+
          "cta_import_debe = @cta_import_debe, \n"+
          "hfam_fechModificacion = getdate(), \n"+
          "Hora = getdate(), \n"+
          "ErpUsuario = @ErpUsuario, \n"+
          "NombreEquipo = @NombreEquipo, \n"+
          "Ip_Cliente = @Ip_Cliente where ccod_empresa = @ccod_empresa and cfamilia = @cfamilia\n"
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
    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{
          const pool = await poolPromise
          var request_consultar_familia_articulo = await pool
          .request()
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('cfamilia',mssql.VarChar(250),req.body.Codigo)
          .query(            
           " select count(*) as resultado from Hfam_art  \n"+
           " inner join Harticul on  \n"+
           " Hfam_art.ccod_empresa = Harticul.ccod_empresa and \n"+
           " Hfam_art.cfamilia = Harticul.cfamilia \n"+
           " where Hfam_art.ccod_empresa = @ccod_empresa and Hfam_art.cfamilia = @cfamilia \n"
          );
          var Recordarset = request_consultar_familia_articulo.recordset[0];

          if (Recordarset.resultado == 0) {
            const request  = new mssql.Request(transaction);
            await request
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('cfamilia',mssql.VarChar(250),req.body.Codigo)
            .query(            
            "delete from Hfam_art where  ccod_empresa = @ccod_empresa and cfamilia = @cfamilia \n"
            );

            transaction.commit(tErr => {if(tErr) {console.log(tErr)}})
            res.send({estado: true, codigo: 0, mensaje: ""});
          }else{
            console.log("La Familia Esta Relacionado A Un Producto");
            transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
            res.send({estado: false, codigo: "0", mensaje: 'La Familia Esta Relacionado A Un Producto'});
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