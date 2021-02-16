const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');


router.get('/retencion_no_domiciliados/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const pool = await poolPromise
  
          const lista = await pool
          .request()
          .input('id', mssql.VarChar(10), id)
          .query('select * from Hretencion_no_domic where ccod_empresa = @id');
            
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
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .query(" select \n"+
      " ccod_retencion as Codigo, \n"+
      " descrip as Nombre, \n"+
      " descrip_tasa as Descripcion_Tasa,\n"+ 
      " tasa as Tasa \n"+
      " from Hretencion_no_domic \n"+
      " where ccod_empresa = @codigo_empresa\n");
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

router.post('/tasa', async (req, res) => {
  try {
      const codigo_empresa = req.user.codigo_empresa;
      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .input('codigo', mssql.VarChar(15), req.body.codigo)
      .query(" select \n"+
      " ccod_retencion as Codigo, \n"+
      " descrip as Nombre, \n"+
      " descrip_tasa as Descripcion_Tasa,\n"+
      " erp_editar as Editar_Porcentaje , \n"+ 
      " RTRIM(LTRIM(tasa)) as Tasa \n"+
      " from Hretencion_no_domic \n"+
      " where ccod_empresa = @codigo_empresa and ccod_retencion = @codigo\n");
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
       " select  \n"+
       " ctip_anexo as Tipo_Anexo, \n"+
       " Hretenanexo.ccod_retencion as Codigo,  \n"+
       " descrip as Nombre,  \n"+
       " descrip_tasa as Descripcion_Tasa,  \n"+
       " tasa as Tasa , \n"+
       " erp_editar as Editar_Porcentaje , \n"+
       " predet as Predeterminado \n"+
       " from Hretenanexo inner join  Hretencion_no_domic on \n"+
       " Hretenanexo.ccod_empresa = Hretencion_no_domic.ccod_empresa and \n"+
       " Hretenanexo.ccod_retencion = Hretencion_no_domic.ccod_retencion \n"+
       " where Hretenanexo.ccod_empresa = @codigo_empresa and Hretenanexo.ccod_anexo = @codigo \n"+
       " order by predet desc, Hretenanexo.ccod_retencion asc  \n"
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
      .input('codigo_proveedor', mssql.VarChar(100), req.body.codigo)
      .input('tipo', mssql.VarChar(100), req.body.tipo)
      .query(
       " Select  \n"+
       " Hretenanexo.ccod_retencion as Codigo, \n"+
       " Hretencion_no_domic.descrip as Nombre, \n"+
       " Hretenanexo.predet as Predeterminado \n"+
       " From Hretenanexo  \n"+
       " Inner Join Hretencion_no_domic On \n"+
       " Hretenanexo.ccod_empresa = Hretencion_no_domic.ccod_empresa And \n"+
       " Hretenanexo.ccod_retencion = Hretencion_no_domic.ccod_retencion \n"+
       " Where Hretenanexo.ccod_empresa = @codigo_empresa And  \n"+
       " Hretenanexo.ctip_anexo = @tipo And  \n"+
       " ccod_anexo = @codigo_proveedor \n"+
       " order by Hretenanexo.ccod_retencion \n"
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
    .input('codigo_proveedor', mssql.VarChar(100), req.body.codigo)
    .input('tipo', mssql.VarChar(100), req.body.tipo)
    .query(
     " Select 'N' as Activo,ccod_retencion as Codigo,descrip as Nombre \n"+
     " From Hretencion_no_domic \n"+
     " Where ccod_empresa  = '01' And  \n"+
     " ccod_retencion not in ( \n"+
     " Select ccod_retencion  \n"+
     " From Hretenanexo  \n"+
     " Where Hretenanexo.ccod_empresa = @codigo_empresa And Hretenanexo.ctip_anexo = @tipo And ccod_anexo = @codigo_proveedor  \n"+
     " ) \n"+
     " union all \n"+
     " Select 'S' as Activo, \n"+
     " Hretenanexo.ccod_retencion as Codigo, \n"+
     " Hretencion_no_domic.descrip as Nombre \n"+
     " From Hretenanexo Inner Join Hretencion_no_domic On \n"+
     " Hretenanexo.ccod_empresa = Hretencion_no_domic.ccod_empresa And \n"+
     " Hretenanexo.ccod_retencion = Hretencion_no_domic.ccod_retencion \n"+
     " Where Hretenanexo.ccod_empresa = @codigo_empresa And Hretenanexo.ctip_anexo = @tipo And ccod_anexo = @codigo_proveedor \n"
    );

    const recordset = lista.recordset;
    res.json(recordset);
    
  } catch (err) {
    console.log(err.message);
    res.send(err.message)
  }
});

module.exports = router;