const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');


router.get('/detraciones/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const pool = await poolPromise
  
          const lista = await pool
          .request()
          .input('id', mssql.VarChar(10), id)
          .query('select * from Hdetraccion where ccod_empresa = @id');
            
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
      
      res.send(err.message)
    }
});

router.post('/lista', async (req, res) => {
  try {
      const codigo_empresa = req.user.codigo_empresa;
      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('id', mssql.VarChar(10), codigo_empresa)
      .query("select \n"+
      "ccod_detraccion as Codigo,  \n"+
      "descrip as Nombre,  \n"+
      "porc_detracc as Porcentaje,  \n"+
      "monto_minimo as Monto_minimo,  \n"+
      "erp_grupo as grupo  \n"+
      "From Hdetraccion  \n"+
      "Where ccod_empresa = @id order by ccod_detraccion asc");
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

router.post('/datos', async (req, res) => {
  try {
      const codigo_empresa = req.user.codigo_empresa;
      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .input('codigo', mssql.VarChar(25), req.body.codigo)
      .query(
        " select \n"+
        " HDETRAANEXO.CCOD_DETRACCION AS Codigo, \n"+
        " descrip as Nombre, \n"+
        " HDETRAANEXO.PREDET as Predeterminado, \n"+
        " porc_detracc as Porcentaje, \n"+
        " monto_minimo as Monto_Minimo, \n"+
        " erp_editar as Editar_Porcentaje, \n"+
        " HDETRAANEXO.CTIP_ANEXO as Tipo_Anexo \n"+
        " from HDETRAANEXO  \n"+
        " inner join Hdetraccion on  \n"+
        " HDETRAANEXO.CCOD_EMPRESA = Hdetraccion.ccod_empresa and \n"+
        " HDETRAANEXO.CCOD_DETRACCION = Hdetraccion.ccod_detraccion \n"+
        " where HDETRAANEXO.CCOD_EMPRESA =  @codigo_empresa and \n"+
        " HDETRAANEXO.CCOD_ANEXO = @codigo \n"+
        " order by  HDETRAANEXO.PREDET desc, \n"+
        " HDETRAANEXO.CCOD_DETRACCION asc" 
      );
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

router.post('/porcentaje', async (req, res) => {
  try {

    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo', mssql.VarChar(15), req.body.codigo)
    .query("select \n"+
    "ccod_detraccion as Codigo,  \n"+
    "descrip as Nombre,  \n"+
    "porc_detracc as Porcentaje,  \n"+
    "monto_minimo as Monto_Minimo,  \n"+
    "erp_editar as Editar_Porcentaje, \n"+
    "erp_grupo as grupo  \n"+
    "From Hdetraccion  \n"+
    "Where ccod_empresa = @codigo_empresa and ccod_detraccion = @codigo ");
    const recordset = lista.recordset;
    res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

router.post('/cuenta', async (req, res) => {
  try {

    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('tipo_grupo', mssql.VarChar(15), req.body.tipo_grupo)
    .input('codigo_anexo', mssql.VarChar(15), req.body.codigo_anexo)
    .input('moneda', mssql.VarChar(15), req.body.moneda)
    .query(
      "SELECT  \n"+
      "erp_ctagru as Cuenta, \n"+
      "hplancon.cnom_cuenta as NombreCuenta, \n"+
      "case @tipo_grupo when '42' then cta_detraccion else erp_ctadtc end  as Cuenta_Detraccion_Soles, \n"+
      "dtsoles.cnom_cuenta as NombreCuenta_Detraccion_Soles, \n"+
      "case @tipo_grupo when '42' then cta_detraccion_dolar else erp_ctadtc_dolar end  as Cuenta_Detraccion_Dolares, \n"+
      "dtdolares.cnom_cuenta as NombreCuenta_Detraccion_Dolares \n"+
      "FROM hanexos INNER JOIN erp_ctagru ON \n"+
      "hanexos.ccod_empresa	= erp_ctagru.erp_codemp 	AND \n"+
      "hanexos.ctip_auxiliar	= erp_ctagru.erp_tipgru 		AND \n"+
      "hanexos.cgrupo_cliente = erp_ctagru.erp_codgru \n"+
      "inner join Hplancon on \n"+
      "Hplancon.ccod_empresa = erp_ctagru.erp_codemp and  \n"+
      "Hplancon.ccuenta = erp_ctagru.erp_ctagru \n"+
      "inner join Hparameter on \n"+
      "Hparameter.ccod_empresa = HANEXOS.ccod_empresa \n"+
      "inner join Hplancon dtsoles on \n"+
      "dtsoles.ccod_empresa = Hparameter.ccod_empresa and  \n"+
      "dtsoles.ccuenta = case @tipo_grupo when '42' then cta_detraccion else erp_ctadtc end  \n"+
      "inner join Hplancon dtdolares on \n"+
      "dtdolares.ccod_empresa = Hparameter.ccod_empresa and  \n"+
      "dtdolares.ccuenta = case @tipo_grupo when '42' then cta_detraccion_dolar else erp_ctadtc_dolar end  \n"+
      "WHERE erp_ctagru.erp_codemp	=  @codigo_empresa	AND  \n"+
      "erp_ctagru.erp_tipgru	= @tipo_grupo		AND \n"+
      "hanexos.ccod_anexo	=  @codigo_anexo  AND  \n"+
      "erp_ctagru.erp_moncta = @moneda	AND  \n"+
      "erp_ctagru.erp_tipcta	=  'CTA' \n"
    );
    const recordset = lista.recordset;
    res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

router.post('/anexos', async (req, res) => {
  try {
      const codigo_empresa = req.user.codigo_empresa
      const pool = await poolPromise

      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .input('codigo_cliente', mssql.VarChar(100), req.body.codigo)
      .input('tipo', mssql.VarChar(100), req.body.tipo)
      .query(
        "Select  \n"+
        "Hdetraanexo.ccod_detraccion as Codigo, \n"+
        "Hdetraccion.descrip as Nombre, \n"+
        "Hdetraanexo.predet as Predeterminado \n"+
        "From Hdetraanexo  \n"+
        "Inner Join Hdetraccion On \n"+
        "Hdetraanexo.ccod_empresa = Hdetraccion.ccod_empresa  \n"+
        "And Hdetraanexo.ccod_detraccion = Hdetraccion.ccod_detraccion \n"+
        "Where  \n"+
        "Hdetraanexo.ccod_empresa = @codigo_empresa  \n"+
        "And Hdetraanexo.ctip_anexo = @tipo \n"+
        "And Hdetraanexo.ccod_anexo = @codigo_cliente \n"
        );
        
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

router.post('/lista_seleccionar', async (req, res) => {
  try{
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_cliente', mssql.VarChar(100), req.body.codigo)
    .input('tipo', mssql.VarChar(100), req.body.tipo)
    .query(
      "Select   \n"+
      "Hdetraccion.ccod_detraccion as Codigo,  \n"+
      "Hdetraccion.descrip as Nombre,  \n"+
      "case isnull(Hdetraanexo.ccod_detraccion,'T') when 'T' then 'N' else 'S' end as Activo \n"+
      "From Hdetraccion \n"+
      "left Join Hdetraanexo On  \n"+
      "Hdetraanexo.ccod_empresa = Hdetraccion.ccod_empresa   \n"+
      "And Hdetraanexo.ccod_detraccion = Hdetraccion.ccod_detraccion  \n"+
      "And Hdetraanexo.ctip_anexo = @tipo \n"+
      "And Hdetraanexo.ccod_anexo = @codigo_cliente \n"+
      "Where   \n"+
      "Hdetraccion.ccod_empresa = @codigo_empresa \n"
    );

    const recordset = lista.recordset;
    res.json(recordset);
    
  } catch (err) {
    console.log(err.message);
    res.send(err.message)
  }
});

module.exports = router;