const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../../database');

router.post('/configuraciones', async (req, res) => {
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .query("select moneda_trabajo, mas_igv, ctipo_cambio from Hconfiguraciones_2 where idempresa=@codigo_empresa ");
  
    const recordset = lista.recordset;
    res.json(recordset);
});

router.post('/guardar', async (req, res) => {
    try {

      const usuario = req.user.codigo_usuario;
      const codigo_empresa = req.user.codigo_empresa;
      var filas_configuaracion_tarjeta = JSON.parse(req.body.filas_configuaracion_tarjeta)
      const pool = await poolPromise;
      const transaction = await new mssql.Transaction(pool);
  
      await transaction.begin(async err => {
          try{
            const request_limpiar_tabla  = new mssql.Request(transaction);
            await request_limpiar_tabla
            .input('erp_empresa',mssql.VarChar(250),codigo_empresa)
            .query(
                "Delete from Erp_Tarjeta_Credito Where erp_codemp = @erp_empresa "
             );  
  
            //#region Guardar Cobrador
            for (let i= 0; i< filas_configuaracion_tarjeta.length; i++){
            
                var fila = filas_configuaracion_tarjeta[i];
                console.log(fila);
                const request_configuracion_tarjeta  = new mssql.Request(transaction);
                await request_configuracion_tarjeta
                .input('erp_codemp',mssql.VarChar(250),codigo_empresa)
                .input('erp_codtarjeta',mssql.VarChar(250),fila.Codigo)
                .input('erp_nomtarjeta',mssql.VarChar(250),fila.Nombre)
                .input('erp_cuenta',mssql.VarChar(250),fila.Codigo_Cuenta)
                .query(
                  " Insert Into Erp_Tarjeta_Credito ( \n"+
                  " erp_codemp , \n"+
                  " erp_codtarjeta , \n"+
                  " erp_nomtarjeta , \n"+
                  " erp_cuenta ) VALUES ( \n"+
                  " @erp_codemp , \n"+
                  " @erp_codtarjeta , \n"+
                  " @erp_nomtarjeta , \n"+
                  " @erp_cuenta ) \n"
                 );            
              }
            //#endregion
      
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

router.post('/lista', async (req, res) => {
    try {
 
        const codigo_empresa = req.user.codigo_empresa
        const codigo_punto_venta = req.user.codigo_punto_venta;
        const pool = await poolPromise
  
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
        .query(
         " Select  \n"+ 
         " Erp_Tarjeta_Credito.erp_codtarjeta as Codigo, \n"+ 
         " Erp_Tarjeta_Credito.erp_nomtarjeta as Nombre, \n"+ 
         " Erp_Tarjeta_Credito.erp_cuenta as Codigo_Cuenta, \n"+ 
         " Erp_Tarjeta_Credito.erp_cuenta + ' - ' + hplancon.cnom_cuenta  as Cuenta \n"+ 
         " From Erp_Tarjeta_Credito Inner Join Hplancon \n"+ 
         " On Erp_tarjeta_credito.erp_codemp = hplancon.ccod_empresa and \n"+ 
         " Erp_tarjeta_credito.erp_cuenta   = hplancon.ccuenta 	 \n"+ 
         " where Erp_Tarjeta_Credito.erp_codemp    = @codigo_empresa \n"
        );
          
        const recordset = lista.recordset;
        console.log(recordset);
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

module.exports = router;