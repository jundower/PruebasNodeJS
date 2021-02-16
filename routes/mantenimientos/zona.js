const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');

router.post('/lista', async (req, res) => {
    try {
        const pool = await poolPromise

        const lista = await pool
        .request()
        .input('ccod_empresa', mssql.VarChar(10), req.user.codigo_empresa)
        .query(
          'select \n'+
          'LTRIM(RTRIM(ccod_zona)) as Codigo, \n'+
          'cnom_zona as Nombre, \n'+
          'Hzona_fechmodificacion as Equipo_Fecha, \n'+
          'NombreEquipo as Equipo_Nombre, \n'+
          'HoraPc as Equipo_Hora, \n'+
          'Ip_Cliente as Equipo_IP, \n'+
          'ErpUsuario as Usuario_Codigo \n'+
          'from Hzona where ccod_empresa = @ccod_empresa'
        );
        
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
      res.send(err.message)
    }
});
  
router.post('/datos', async (req, res) => {
  try {
      const pool = await poolPromise

      const lista = await pool
      .request()
      .input('ccod_empresa', mssql.VarChar(10), req.user.codigo_empresa)
      .input('codigo', mssql.VarChar(250), req.body.Codigo)
      .query(
        'select \n'+
        'LTRIM(RTRIM(ccod_zona)) as Codigo, \n'+
        'cnom_zona as Nombre, \n'+
        'Hzona_fechmodificacion as Equipo_Fecha, \n'+
        'NombreEquipo as Equipo_Nombre, \n'+
        'HoraPc as Equipo_Hora, \n'+
        'Ip_Cliente as Equipo_IP, \n'+
        'ErpUsuario as Usuario_Codigo \n'+
        'from Hzona where ccod_empresa = @ccod_empresa and ccod_zona=@codigo'
      );
      
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

  
module.exports = router;