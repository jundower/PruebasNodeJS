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
    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{
          const request  = new mssql.Request(transaction);
          await request
          .input('Erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codigo',mssql.VarChar(250),req.body.Codigo)
          .input('erp_nombre',mssql.VarChar(250),req.body.Nombre)
          .input('erp_cuenta',mssql.VarChar(250),req.body.Cuenta_Soles)
          .input('erp_abrev',mssql.VarChar(250),req.body.Abreviatura)
          .input('Erp_provision',mssql.VarChar(250),req.body.Provision)
          .input('erp_cuenta_provision',mssql.VarChar(250),req.body.Cuenta_Provisiones_Soles)
          .input('Erp_Cuenta_Dolares',mssql.VarChar(250),req.body.Cuenta_Dolares)
          .input('Erp_Cuenta_provision_dolares',mssql.VarChar(250),req.body.Cuenta_Provisiones_Dolares)
          .input('tipo_doc',mssql.VarChar(250),req.body.Tipo_Documento)
          .query(   
          "insert into erp_asiento_patron( \n"+
          "Erp_codemp, \n"+
          "erp_codigo, \n"+
          "erp_nombre, \n"+
          "erp_cuenta, \n"+
          "erp_abrev, \n"+
          "Erp_provision, \n"+
          "erp_cuenta_provision, \n"+
          "Erp_Cuenta_Dolares, \n"+
          "Erp_Cuenta_provision_dolares, \n"+
          "tipo_doc \n"+
          ")values( \n"+
          "@Erp_codemp, \n"+
          "@erp_codigo, \n"+
          "@erp_nombre, \n"+
          "@erp_cuenta, \n"+
          "@erp_abrev, \n"+
          "@Erp_provision, \n"+
          "@erp_cuenta_provision, \n"+
          "@Erp_Cuenta_Dolares, \n"+
          "@Erp_Cuenta_provision_dolares, \n"+
          "@tipo_doc )  \n"
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
          .input('Erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codigo',mssql.VarChar(250),req.body.Codigo)
          .input('erp_nombre',mssql.VarChar(250),req.body.Nombre)
          .input('erp_cuenta',mssql.VarChar(250),req.body.Cuenta_Soles)
          .input('erp_abrev',mssql.VarChar(250),req.body.Abreviatura)
          .input('Erp_provision',mssql.VarChar(250),req.body.Provision)
          .input('erp_cuenta_provision',mssql.VarChar(250),req.body.Cuenta_Provisiones_Soles)
          .input('Erp_Cuenta_Dolares',mssql.VarChar(250),req.body.Cuenta_Dolares)
          .input('Erp_Cuenta_provision_dolares',mssql.VarChar(250),req.body.Cuenta_Provisiones_Dolares)
          .input('tipo_doc',mssql.VarChar(250),req.body.Tipo_Documento)
          .query(   
          "update erp_asiento_patron set \n"+
          "erp_nombre = @erp_nombre, \n"+
          "erp_cuenta = @erp_cuenta, \n"+
          "erp_abrev = @erp_abrev, \n"+
          "Erp_provision = @Erp_provision, \n"+
          "erp_cuenta_provision = @erp_cuenta_provision, \n"+
          "Erp_Cuenta_Dolares = @Erp_Cuenta_Dolares, \n"+
          "Erp_Cuenta_provision_dolares = @Erp_Cuenta_provision_dolares, \n"+
          "tipo_doc = @tipo_doc \n"+
          "where Erp_codemp = @Erp_codemp and erp_codigo = @erp_codigo\n"
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
          const request  = new mssql.Request(transaction);
          await request
          .input('Erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codigo',mssql.VarChar(250),req.body.Codigo)
          .query(   
          "delete from erp_asiento_patron \n"+
          "where Erp_codemp = @Erp_codemp and erp_codigo = @erp_codigo\n"
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