const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');


router.get('/motivo_traslado/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const pool = await poolPromise
  
          const lista = await pool
          .request()
          .input('id', mssql.VarChar(10), id)
          .query('select * from hmotivo_traslado where ccod_empresa = @id');
            
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
      .query("Select "+
      "LTRIM(RTRIM(ccod_motivo)) as Codigo, "+
      "nombre_motivo as Nombre, "+
      "CASE WHEN afecta_nombre = 'N' THEN 'NO' ELSE 'SI' END AS Afecta_Nombre,"+
      "CONVERT(VARCHAR(50), Hmotivo_traslado_fechmodificacion, 103) as Fecha_Modificacion, "+
      "NombreEquipo as Pc_user, "+
      "ErpUsuario as Usuario, "+
      "CONVERT(VARCHAR(50),HoraPc,108) as Pc_Fecha, "+
      "Ip_Cliente as Pc_ip from hmotivo_traslado where ccod_empresa = @id order by ccod_motivo");
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

module.exports = router;