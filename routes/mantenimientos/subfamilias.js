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
         "select  \n"+
         "LTRIM(RTRIM(ccod_subfamilia))  as Codigo,  \n"+
         "cnom_subfamilia as Nombre, \n"+
         "afecta_nombre as Afecta_Nombre, \n"+
         "abreviatura as Abreviatura, \n"+
         "convert(varchar,hSubFam_fechModificacion,103) as Fecha_Modificacion, \n"+
         "convert(varchar, Hora, 8) as Hora, \n"+
         "ErpUsuario as Usuario, \n"+
         "NombreEquipo as Pc_user, \n"+
         "Ip_Cliente as Pc_ip \n"+
         "from Hsubfamilia_art \n"+
         "where ccod_empresa = @Codigo_Empresa \n"+
         "order by ccod_subfamilia asc \n"
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
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_subfamilia',mssql.VarChar(250),req.body.Codigo)
          .input('cnom_subfamilia',mssql.VarChar(250),req.body.Nombre)
          .input('abreviatura',mssql.VarChar(250),req.body.Abreviatura)
          .input('afecta_nombre',mssql.VarChar(250),req.body.Afecta_Abreviatura)
          .input('hSubFam_fechModificacion',mssql.VarChar(250),'')
          .input('Hora',mssql.VarChar(250),'')
          .input('ErpUsuario',mssql.VarChar(250),usuario)
          .input('NombreEquipo',mssql.VarChar(250),'')
          .input('Ip_Cliente',mssql.VarChar(250),'')
          .query(            
          "insert into Hsubfamilia_art( \n"+
          "ccod_empresa, \n"+
          "ccod_subfamilia, \n"+
          "cnom_subfamilia, \n"+
          "abreviatura, \n"+
          "afecta_nombre, \n"+
          "hSubFam_fechModificacion, \n"+
          "Hora, \n"+
          "ErpUsuario, \n"+
          "NombreEquipo, \n"+
          "Ip_Cliente \n"+
          ")values( \n"+
          "@ccod_empresa, \n"+
          "@ccod_subfamilia, \n"+
          "@cnom_subfamilia, \n"+
          "@abreviatura, \n"+
          "@afecta_nombre, \n"+
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
          .input('ccod_subfamilia',mssql.VarChar(250),req.body.Codigo)
          .input('cnom_subfamilia',mssql.VarChar(250),req.body.Nombre)
          .input('abreviatura',mssql.VarChar(250),req.body.Abreviatura)
          .input('afecta_nombre',mssql.VarChar(250),req.body.Afecta_Abreviatura)
          .input('hSubFam_fechModificacion',mssql.VarChar(250),'')
          .input('Hora',mssql.VarChar(250),'')
          .input('ErpUsuario',mssql.VarChar(250),usuario)
          .input('NombreEquipo',mssql.VarChar(250),'')
          .input('Ip_Cliente',mssql.VarChar(250),'')
          .query(            
          "update Hsubfamilia_art set  \n"+
          "cnom_subfamilia = @cnom_subfamilia, \n"+
          "abreviatura = @abreviatura, \n"+
          "afecta_nombre = @afecta_nombre, \n"+
          "hSubFam_fechModificacion = getdate(), \n"+
          "Hora = getdate(), \n"+
          "ErpUsuario = @ErpUsuario, \n"+
          "NombreEquipo = @NombreEquipo, \n"+
          "Ip_Cliente = @Ip_Cliente \n"+
          "where ccod_empresa = @ccod_empresa and ccod_subfamilia = @ccod_subfamilia\n"
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
          var request_consultar_subfamilia_articulo = await pool
          .request()
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_subfamilia',mssql.VarChar(250),req.body.Codigo)
          .query(            
           " select count(*) as resultado from Hsubfamilia_art  \n"+
           " inner join Harticul on  \n"+
           " Hsubfamilia_art.ccod_empresa = Harticul.ccod_empresa and \n"+
           " Hsubfamilia_art.ccod_subfamilia = Harticul.ccod_subfamilia \n"+
           " where Hsubfamilia_art.ccod_empresa = @ccod_empresa and Hsubfamilia_art.ccod_subfamilia = @ccod_subfamilia \n"
          );
          var Recordarset = request_consultar_subfamilia_articulo.recordset[0];

          if (Recordarset.resultado == 0) {
            const request  = new mssql.Request(transaction);
            await request
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('ccod_subfamilia',mssql.VarChar(250),req.body.Codigo)
            .query(            
            "delete from Hsubfamilia_art where  ccod_empresa = @ccod_empresa and ccod_subfamilia = @ccod_subfamilia \n"
            );
          }else{
            console.log("La Familia Esta Relacionado A Un Producto");
            transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
            res.send({estado: false, codigo: "0", mensaje: 'La Subfamilia Esta Relacionado A Un Producto'});
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