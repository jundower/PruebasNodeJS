const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');

router.post('/lista/:numero', async (req, res) => {
    try {
        var {numero} = req.params

        const pool = await poolPromise

        var query = "select \n"+
        " LTRIM(RTRIM(erp_codcon)) as Codigo, \n"+ 
        " erp_nomcon as Nombre,  \n"+
        " erp_abrcon as Abreviatura  \n"+
        " from erp_concepto"+numero+" where erp_codemp = @Codigo_Empresa order by erp_codcon asc";

        const lista = await pool
        .request()
        .input('Codigo_Empresa', mssql.VarChar(10), req.user.codigo_empresa)
        .query(query);
        
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
      res.send(err.message)
    }
});

router.post('/guardar/:numero', async (req, res) => {
  try {
      var {numero} = req.params
      var query =
      "Insert erp_concepto"+numero+" ( \n"+ 
      "erp_codemp, \n"+ 
      "erp_codcon, \n"+ 
      "erp_nomcon, \n"+ 
      "erp_abrcon \n"+ 
      ") values ( \n"+ 
      "@Codigo_Empresa, \n"+ 
      "@erp_codcon, \n"+ 
      "@erp_nomcon, \n"+ 
      "@erp_abrcon) \n";

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{

        const request  = new mssql.Request(transaction);
        await request
        .input('Codigo_Empresa', mssql.VarChar(10), req.user.codigo_empresa)
        .input('erp_codcon', mssql.VarChar(10), req.body.Codigo)
        .input('erp_nomcon', mssql.VarChar(250), req.body.Nombre)
        .input('erp_abrcon', mssql.VarChar(10), req.body.Abreviatura)
        .query(query);

        transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
        res.send({estado: true, codigo: "0", mensaje: ''});
        }catch(err){
          transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: false, codigo: "Err", mensaje: err.message});
        }
    })
  } catch (err) {
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

router.post('/modificar/:numero', async (req, res) => {
  try {
      var {numero} = req.params
      var query =
      "update erp_concepto"+numero+" set \n"+ 
      "erp_nomcon = @erp_nomcon, \n"+ 
      "erp_abrcon = @erp_abrcon  where erp_codemp = @Codigo_Empresa and erp_codcon = @erp_codcon\n" 

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{

        const request  = new mssql.Request(transaction);
        await request
        .input('Codigo_Empresa', mssql.VarChar(10), req.user.codigo_empresa)
        .input('erp_codcon', mssql.VarChar(10), req.body.Codigo)
        .input('erp_nomcon', mssql.VarChar(250), req.body.Nombre)
        .input('erp_abrcon', mssql.VarChar(10), req.body.Abreviatura)
        .query(query);

        transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
        res.send({estado: true, codigo: "0", mensaje: ''});
        }catch(err){
          transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: false, codigo: "Err", mensaje: err.message});
        }
    })
  } catch (err) {
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

router.post('/eliminar/:numero', async (req, res) => {
  try {
    var {numero} = req.params
    var query =
    "delete from erp_concepto"+numero+" where erp_codemp = @Codigo_Empresa and erp_codcon = @erp_codcon \n"

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{

        const request  = new mssql.Request(transaction);
        await request
        .input('Codigo_Empresa', mssql.VarChar(10), req.user.codigo_empresa)
        .input('erp_codcon', mssql.VarChar(10), req.body.Codigo)
        .input('erp_nomcon', mssql.VarChar(250), req.body.Nombre)
        .input('erp_abrcon', mssql.VarChar(10), req.body.Abreviatura)
        .query(query);

        transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
        res.send({estado: true, codigo: "0", mensaje: ''});
        }catch(err){
          transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: false, codigo: "Err", mensaje: err.message});
        }
    })
  } catch (err) {
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});
  
module.exports = router;