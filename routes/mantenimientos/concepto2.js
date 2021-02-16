const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');

router.post('/lista', async (req, res) => {
    try {
        
        var query = "select \n"+
        " LTRIM(RTRIM(erp_codcon)) as Codigo, \n"+ 
        " erp_nomcon as Nombre,  \n"+
        " erp_abrcon as Abreviatura  \n"+
        " from erp_concepto2 where erp_codemp = @Codigo_Empresa order by erp_codcon asc";
        const pool = await poolPromise
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

router.post('/guardar', async (req, res) => {
  try {
      var query =
      "Insert erp_concepto2 ( \n"+ 
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

router.post('/modificar', async (req, res) => {
  try {
      var query =
      "update erp_concepto2 set \n"+ 
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

router.post('/eliminar', async (req, res) => {
  try {
    var query ="delete from erp_concepto2 where erp_codemp = @Codigo_Empresa and erp_codcon = @erp_codcon \n"

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{
          const pool = await poolPromise
          var request_consultar_concepto_articulo = await pool
          .request()
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('codigo',mssql.VarChar(250),req.body.Codigo)
          .query(            
           " select count(*) as resultado from Harticul  \n"+
           " where Harticul.ccod_empresa = @ccod_empresa and Harticul.modelo = @codigo \n"
          );
          var Recordarset = request_consultar_concepto_articulo.recordset[0];

          if (Recordarset.resultado == 0) {
            const request  = new mssql.Request(transaction);
            await request
            .input('Codigo_Empresa', mssql.VarChar(10), req.user.codigo_empresa)
            .input('erp_codcon', mssql.VarChar(10), req.body.Codigo)
            .query(query);

            transaction.commit(tErr => {if(tErr) {console.log(tErr)}})
            res.send({estado: true, codigo: 0, mensaje: ""});
          }else{
            console.log("La Familia Esta Relacionado A Un Producto");
            transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
            res.send({estado: false, codigo: "0", mensaje: 'El Item Esta Relacionado A Un Producto'});
          }
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