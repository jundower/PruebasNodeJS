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
      " select  \n"+
      " erp_codemp as Codigo_Empresa, \n"+
      " erp_codtag as Codigo, \n"+
      " erp_nomtag as Nombre, \n"+
      " erp_preage as Precio_agencia, \n"+
      " fechMod as Fecha_Modificacion, \n"+
      " NombreEquipo as Nombre_Equipo, \n"+
      " IpCliente as IpCliente, \n"+
      " Erpusuario as Usuario \n"+
      " from erp_tipo_agencia \n"+
      " where erp_codemp = @codigo_empresa \n"
      );

    const recordset = lista.recordset;
    res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

module.exports = router;