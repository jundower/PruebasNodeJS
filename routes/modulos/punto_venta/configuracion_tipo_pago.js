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
      var filas_configuaracion_tipo_pago = JSON.parse(req.body.filas_configuaracion_tipo_pago)
      const pool = await poolPromise;
      const transaction = await new mssql.Transaction(pool);
  
      await transaction.begin(async err => {
          try{
            const request_limpiar_tabla  = new mssql.Request(transaction);
            await request_limpiar_tabla
            .input('erp_empresa',mssql.VarChar(250),codigo_empresa)
            .query(
                "Delete from Erp_Medio_Pago Where erp_codemp = @erp_empresa "
             );  
  
            //#region Guardar Cobrador
            for (let i= 0; i< filas_configuaracion_tipo_pago.length; i++){
            
                var fila = filas_configuaracion_tipo_pago[i];
                console.log(fila);
                const request_configuracion_tarjeta  = new mssql.Request(transaction);
                await request_configuracion_tarjeta
                .input('erp_codemp',mssql.VarChar(250),codigo_empresa)
                .input('erp_codigo',mssql.VarChar(250),fila.Codigo)
                .input('erp_nombre',mssql.VarChar(250),fila.Nombre)
                .input('erp_cuenta',mssql.VarChar(250),fila.Codigo_Cuenta)
                .query(
                  " Insert Into Erp_Medio_Pago ( \n"+
                  " erp_codemp , \n"+
                  " erp_codigo , \n"+
                  " erp_nombre , \n"+
                  " erp_cuenta ) VALUES ( \n"+
                  " @erp_codemp , \n"+
                  " @erp_codigo , \n"+
                  " @erp_nombre , \n"+
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
        .query(
        " Select \n"+ 
        " Erp_Medio_Pago.erp_codigo as Codigo,  \n"+ 
        " ltrim(rtrim(Erp_Medio_Pago.erp_nombre)) as Nombre,  \n"+ 
        " ltrim(rtrim(Erp_Medio_Pago.erp_cuenta)) as Codigo_Cuenta,\n"+ 
        " ltrim(rtrim(Erp_Medio_Pago.erp_cuenta)) + ' - ' + ltrim(rtrim(Hplancon.cnom_cuenta)) as Cuenta  \n"+ 
        " From Erp_Medio_Pago Inner Join Hplancon  \n"+ 
        " On Erp_Medio_Pago.erp_codemp = Hplancon.ccod_empresa and  \n"+ 
        " Erp_Medio_Pago.erp_cuenta = Hplancon.ccuenta  \n"+ 
        " where Erp_Medio_Pago.erp_codemp = @codigo_empresa \n" 
        );
          
        const recordset = lista.recordset;
        console.log(recordset);
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

module.exports = router;