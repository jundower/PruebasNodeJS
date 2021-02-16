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
      var filas_configuaracion_cobrador = JSON.parse(req.body.filas_configuaracion_cobrador)
      const pool = await poolPromise;
      const transaction = await new mssql.Transaction(pool);
  
      await transaction.begin(async err => {
          try{
            const request_limpiar_tabla  = new mssql.Request(transaction);
            await request_limpiar_tabla
            .input('erp_empresa',mssql.VarChar(250),codigo_empresa)
            .query(
                "Delete from Erp_PtoVta_Configuracion_Cob Where erp_codemp = @erp_empresa And Erp_modulo ='Ptovta' "
             );  
  
            //#region Guardar Cobrador
            for (let i= 0; i< filas_configuaracion_cobrador.length; i++){
            
                var fila = filas_configuaracion_cobrador[i];
                console.log(fila);
                const request_configuracion_cobrador  = new mssql.Request(transaction);
                await request_configuracion_cobrador
                .input('erp_codemp',mssql.VarChar(250),codigo_empresa)
                .input('erp_codcob',mssql.VarChar(250),fila.Codigo)
                .input('erp_nro_ctacteb',mssql.VarChar(250),fila.Cta_Cteb)
                .input('erp_item',mssql.VarChar(250),i+1)
                .input('erp_modulo',mssql.VarChar(250),'Ptovta')
                .input('ccod_movimiento',mssql.VarChar(250),fila.Codigo_Movimiento)
                .input('cnum_serie',mssql.VarChar(250),fila.Codigo_Serie == null? '': fila.Codigo_Serie)
                .input('ccod_almacen',mssql.VarChar(250),fila.Codigo_Punto_Venta)
                .input('moneda',mssql.VarChar(250),'S/')
                .query(
                  " Insert Into Erp_PtoVta_Configuracion_Cob ( \n"+
                  " erp_codemp , \n"+
                  " erp_codcob , \n"+
                  " erp_nro_ctacteb , \n"+
                  " erp_item , \n"+
                  " erp_modulo , \n"+
                  " ccod_movimiento , \n"+
                  " cnum_serie , \n"+
                  " ccod_almacen , \n"+
                  " moneda ) VALUES ( \n"+
                  " @erp_codemp , \n"+
                  " @erp_codcob , \n"+
                  " @erp_nro_ctacteb , \n"+
                  " @erp_item , \n"+
                  " @erp_modulo , \n"+
                  " @ccod_movimiento , \n"+
                  " @cnum_serie , \n"+
                  " @ccod_almacen , \n"+
                  " @moneda ) \n"
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
          " Erp_PtoVta_Configuracion_Cob.erp_codcob as Codigo, \n"+ 
          " (erp_usuario.erp_coduser) as Usuario, \n"+ 
          " ltrim(rtrim(Erp_PtoVta_Configuracion_Cob.erp_nro_ctacteb)) as Cta_Cteb, \n"+ 
          " (hctacteb.descripcion) as Nombre_Cta_Cteb, \n"+ 
          " (Erp_PtoVta_Configuracion_Cob.ccod_movimiento) as Codigo_Movimiento, \n"+ 
          " (Erp_PtoVta_Configuracion_Cob.cnum_serie) as Codigo_Serie, \n"+ 
          " (Erp_PtoVta_Configuracion_Cob.ccod_almacen) as Codigo_Punto_Venta, \n"+ 
          " (hctacteb.ccuenta ) as Cuenta_Contable, \n"+ 
          " (Erp_PtoVta_Configuracion_Cob.moneda) as Moneda \n"+ 
          " From Erp_PtoVta_Configuracion_Cob  \n"+ 
          " Inner Join erp_usuario On  \n"+ 
          " Erp_PtoVta_Configuracion_Cob.erp_codemp = erp_usuario.erp_codemp and \n"+ 
          " Erp_PtoVta_Configuracion_Cob.erp_codcob = erp_usuario.erp_coduser \n"+ 
          " Inner Join hctacteb \n"+ 
          " On hctacteb.ccod_empresa =  Erp_PtoVta_Configuracion_Cob.erp_codemp and \n"+ 
          " hctacteb.cnum_ctacte 	=  Erp_PtoVta_Configuracion_Cob.erp_nro_ctacteb  \n"+ 
          " Where  Erp_PtoVta_Configuracion_Cob.erp_codemp = @codigo_empresa  \n"+ 
          " And Erp_PtoVta_Configuracion_Cob.Erp_modulo = 'Ptovta' order by erp_item"
        );
          
        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

router.get('/cobrador', async(req, res) => {
    try {
        
        const codigo_empresa = req.user.codigo_empresa
        const codigo_punto_venta = req.user.codigo_punto_venta;
        const codigo_usuario = req.user.codigo_usuario;
        const pool = await poolPromise
  
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
        .input('codigo_usuario', mssql.VarChar(250), codigo_usuario)
        .query(
          " Select  \n"+ 
          " Erp_PtoVta_Configuracion_Cob.erp_codcob as Codigo, \n"+ 
          " (erp_usuario.erp_coduser) as Usuario, \n"+ 
          " ltrim(rtrim(Erp_PtoVta_Configuracion_Cob.erp_nro_ctacteb)) as Cta_Cteb, \n"+ 
          " (hctacteb.descripcion) as Nombre_Cta_Cteb, \n"+ 
          " (Erp_PtoVta_Configuracion_Cob.ccod_movimiento) as Codigo_Movimiento, \n"+ 
          " (Erp_PtoVta_Configuracion_Cob.cnum_serie) as Codigo_Serie, \n"+ 
          " (Erp_PtoVta_Configuracion_Cob.ccod_almacen) as Codigo_Punto_Venta, \n"+ 
          " (hctacteb.ccuenta ) as Cuenta_Contable, \n"+ 
          " (Erp_PtoVta_Configuracion_Cob.moneda) as Moneda \n"+ 
          " From Erp_PtoVta_Configuracion_Cob  \n"+ 
          " Inner Join erp_usuario On  \n"+ 
          " Erp_PtoVta_Configuracion_Cob.erp_codemp = erp_usuario.erp_codemp and \n"+ 
          " Erp_PtoVta_Configuracion_Cob.erp_codcob = erp_usuario.erp_coduser \n"+ 
          " Inner Join hctacteb \n"+ 
          " On hctacteb.ccod_empresa =  Erp_PtoVta_Configuracion_Cob.erp_codemp and \n"+ 
          " hctacteb.cnum_ctacte 	=  Erp_PtoVta_Configuracion_Cob.erp_nro_ctacteb  \n"+ 
          " Where  Erp_PtoVta_Configuracion_Cob.erp_codemp = @codigo_empresa  \n"+ 
          " And  Erp_PtoVta_Configuracion_Cob.erp_codcob = @codigo_usuario  \n"+ 
          " And Erp_PtoVta_Configuracion_Cob.ccod_almacen = @codigo_punto_venta"
        );
          

        const recordset = lista.recordset;
        res.json(recordset); 
    } catch (err) {
        res.send(err.message);
    }
});

module.exports = router;