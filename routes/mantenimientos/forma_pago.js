const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');


router.post('/clientes', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_cliente', mssql.VarChar(100), req.body.codigo)
    .input('tipo', mssql.VarChar(100), req.body.tipo)
    .query(
      "select \n"+
      "RTRIM(LTRIM(Hfor_pag.ccod_forpago)) as Codigo, \n"+
      "Hfor_pag.cnom_forpago as Nombre, \n"+
      "selec as Predeterminado, \n"+
      "cpagado, \n"+
      "nro_dias as Nro_dias, \n"+
      "nro_letras, \n"+
      "Hfor_pag_fechmodificacion as Fecha_Modificacion, \n"+
      "HoraPc as Pc_Fecha, \n"+
      "ErpUsuario as Usuario, \n"+
      "NombreEquipo as Pc_user, \n"+
      "Ip_Cliente as Pc_ip \n"+
      "from Hforpag_provee \n"+
      "inner join Hfor_pag on \n"+
      "Hfor_pag.ccod_empresa = Hforpag_provee.ccod_empresa \n"+
      "and Hfor_pag.ccod_forpago = Hforpag_provee.ccod_forpago \n"+
      "where \n"+
      "Hfor_pag.ccod_empresa=@codigo_empresa \n"+
      "and ccod_proveedor = @codigo_cliente  \n"+
      "and tipo= @tipo \n"+
      "order by Predeterminado desc "
    );

    const recordset = lista.recordset;
    res.json(recordset);
  } catch (err) {
    console.log(err.message);
    res.send(err.message)
  }
});

router.post('/lista', async (req, res) => {
  try{
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .query(
      
      "select \n"+
      "RTRIM(LTRIM(ccod_forpago)) as Codigo, \n"+
      "cnom_forpago as Nombre, \n"+
      "cpagado as Pagado, \n"+
      "nro_dias as Dias, \n"+
      "nro_letras as Letras, \n"+
      "erp_afecta_percep as Percepcion, \n"+
      "convert(varchar,Hfor_pag_fechmodificacion,103) as Fecha_modificacion, \n"+
      "ErpUsuario as Usuario, \n"+
      "NombreEquipo as Equipo, \n"+
      "convert(varchar,HoraPc,8) as Hora_Pc, \n"+
      "Ip_Cliente as Ip_Cliente, \n"+
      "'0' as Activo, \n"+
      "'0' as Predeterminado \n"+
      "from Hfor_pag where \n"+
      "ccod_empresa = @codigo_empresa \n"+
      "order by ccod_forpago \n"
    );

    const recordset = lista.recordset;
    res.json(recordset);
    
  } catch (err) {
    console.log(err.message);
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
      "select \n"+
      "RTRIM(LTRIM(Hfor_pag.ccod_forpago)) as Codigo, \n"+
      "cnom_forpago as Nombre, \n"+
      "cpagado as Pagado, \n"+
      "nro_dias as Dias, \n"+
      "nro_letras as Letras, \n"+
      "erp_afecta_percep as Percepcion, \n"+
      "Hfor_pag_fechmodificacion as Fecha_modificacion, \n"+
      "ErpUsuario as Usuario, \n"+
      "NombreEquipo as Equipo, \n"+
      "HoraPc as Hora_Pc, \n"+
      "Ip_Cliente as Ip_Cliente, \n"+
      "case isnull(Hforpag_provee.ccod_forpago,'T') when 'T' then 'N' else 'S' end as Activo \n"+
      "from Hfor_pag  \n"+
      "left join Hforpag_provee on \n"+
      "Hforpag_provee.ccod_empresa = Hfor_pag.ccod_empresa   \n"+
      "and Hforpag_provee.ccod_forpago = Hfor_pag.ccod_forpago   \n"+
      "and tipo = @tipo \n"+
      "and ccod_proveedor=@codigo_cliente \n"+
      "where \n"+
      "Hfor_pag.ccod_empresa = @codigo_empresa \n"+
      "order by Hfor_pag.ccod_forpago \n"
    );

    const recordset = lista.recordset;
    res.json(recordset);
    
  } catch (err) {
    console.log(err.message);
    res.send(err.message)
  }
});

router.post('/detalle', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo', mssql.VarChar(5), req.body.codigo)
    .query(
     " Select  \n"+
     " Forma_Pago_Comisiones.erp_item as Item, \n"+
     " Forma_Pago_Comisiones.erp_desde as Desde, \n"+
     " Forma_Pago_Comisiones.erp_hasta as Hasta, \n"+
     " Forma_Pago_Comisiones.erp_porcentaje as Porcentaje \n"+
     " From Erp_Forma_Pago_Comisiones Forma_Pago_Comisiones WITH(NOLOCK) \n"+
     " Where Forma_Pago_Comisiones.erp_empresa = @codigo_empresa  And   \n"+
     " ltrim(rtrim(Forma_Pago_Comisiones.erp_cod_formpag)) = @codigo  order by erp_item \n"
    );

    const recordset = lista.recordset;
    console.log(recordset);
    res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

router.post('/guardar', async (req, res) => {
  try {
    const usuario = req.user.codigo_usuario;
    var filas_forma_pago_detalles = JSON.parse(req.body.Lista_Forma_Pago_Detalle)

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{
          const request  = new mssql.Request(transaction);
          await request
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_forpago',mssql.VarChar(250),req.body.Codigo)
          .input('cnom_forpago',mssql.VarChar(250),req.body.Nombre)
          .input('nro_dias',mssql.VarChar(250),req.body.Dias)
          .input('cpagado',mssql.VarChar(250),'N')
          .input('nro_letras',mssql.VarChar(250),'0')
          .input('erp_afecta_percep',mssql.VarChar(250),req.body.Afecta_Percepcion)
          .input('NombreEquipo',mssql.VarChar(250),'')
          .input('Ip_Cliente',mssql.VarChar(250),'')
          .input('ErpUsuario',mssql.VarChar(250),usuario)
          .input('HoraPc',mssql.VarChar(250),'')
          .query(            
          "insert into Hfor_pag( \n"+
          "ccod_empresa, \n"+
          "ccod_forpago, \n"+
          "cnom_forpago, \n"+
          "cpagado, \n"+
          "nro_dias, \n"+
          "nro_letras, \n"+
          "prim_letra, \n"+
          "seg_letra, \n"+
          "terc_letra, \n"+
          "cuart_letra, \n"+
          "letra5, \n"+
          "letra6, \n"+
          "letra7, \n"+
          "letra8, \n"+
          "letra9, \n"+
          "letra10, \n"+
          "letra11, \n"+
          "letra12, \n"+
          "letra13, \n"+
          "letra14, \n"+
          "letra15, \n"+
          "nro_comision, \n"+
          "fraccionamiento, \n"+
          "nro_fraccionamiento, \n"+
          "porc_1, \n"+
          "porc_2, \n"+
          "porc_3, \n"+
          "porc_4, \n"+
          "porc_5, \n"+
          "porc_6, \n"+
          "porc_7, \n"+
          "erp_afecta_percep, \n"+
          "Hfor_pag_fechmodificacion, \n"+
          "NombreEquipo, \n"+
          "HoraPc, \n"+
          "Ip_Cliente, \n"+
          "ErpUsuario \n"+
          ")values( \n"+
          "@ccod_empresa, \n"+
          "@ccod_forpago, \n"+
          "@cnom_forpago, \n"+
          "@cpagado, \n"+
          "@nro_dias, \n"+
          "@nro_letras, \n"+
          "0, \n"+
          "0, \n"+
          "0, \n"+
          "0, \n"+
          "0, \n"+
          "0, \n"+
          "0, \n"+
          "0, \n"+
          "0, \n"+
          "0, \n"+
          "0, \n"+
          "0, \n"+
          "0, \n"+
          "0, \n"+
          "0, \n"+
          "0, \n"+
          "'N', \n"+
          "0, \n"+
          "0.00, \n"+
          "0.00, \n"+
          "0.00, \n"+
          "0.00, \n"+
          "0.00, \n"+
          "0.00, \n"+
          "0.00, \n"+
          "@erp_afecta_percep, \n"+
          "getdate(), \n"+
          "@NombreEquipo, \n"+
          "CONVERT(VARCHAR,getdate(),8), \n"+
          "@Ip_Cliente, \n"+
          "@ErpUsuario) \n"
          );

          
          for (let i= 0; i< filas_forma_pago_detalles.length; i++){
            
            var fila = filas_forma_pago_detalles[i];
            const request_forma_pago_detalles  = new mssql.Request(transaction);
            await request_forma_pago_detalles
            .input('erp_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('erp_cod_formpag',mssql.VarChar(250),req.body.Codigo)
            .input('erp_item',mssql.VarChar(250),i+1)
            .input('erp_desde',mssql.VarChar(250),fila.Desde)
            .input('erp_hasta',mssql.VarChar(250),fila.Hasta)
            .input('erp_porcentaje',mssql.VarChar(250),fila.Porcentaje)
            .query(
             " insert into Erp_Forma_Pago_Comisiones( \n"+
             " erp_empresa, \n"+
             " erp_cod_formpag, \n"+
             " erp_item, \n"+
             " erp_desde, \n"+
             " erp_hasta, \n"+
             " erp_porcentaje \n"+
             " )values( \n"+
             " @erp_empresa, \n"+
             " @erp_cod_formpag, \n"+
             " @erp_item, \n"+
             " @erp_desde, \n"+
             " @erp_hasta, \n"+
             " @erp_porcentaje) \n"
            );            
          }
            
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
    var filas_forma_pago_detalles = JSON.parse(req.body.Lista_Forma_Pago_Detalle)

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{
          const request  = new mssql.Request(transaction);
          await request
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_forpago',mssql.VarChar(250),req.body.Codigo)
          .input('cnom_forpago',mssql.VarChar(250),req.body.Nombre)
          .input('nro_dias',mssql.VarChar(250),req.body.Dias)
          .input('cpagado',mssql.VarChar(250),'N')
          .input('nro_letras',mssql.VarChar(250),'0')
          .input('erp_afecta_percep',mssql.VarChar(250),req.body.Afecta_Percepcion)
          .input('NombreEquipo',mssql.VarChar(250),'')
          .input('Ip_Cliente',mssql.VarChar(250),'')
          .input('ErpUsuario',mssql.VarChar(250),usuario)
          .input('HoraPc',mssql.VarChar(250),'')
          .query(            
          "update Hfor_pag set \n"+
          "cnom_forpago = @cnom_forpago, \n"+
          "cpagado = @cpagado, \n"+
          "nro_dias = @nro_dias, \n"+
          "nro_letras = @nro_letras, \n"+
          "prim_letra = 0, \n"+
          "seg_letra = 0, \n"+
          "terc_letra = 0, \n"+
          "cuart_letra = 0, \n"+
          "letra5 = 0, \n"+
          "letra6 = 0, \n"+
          "letra7 = 0, \n"+
          "letra8 = 0, \n"+
          "letra9 = 0, \n"+
          "letra10 = 0, \n"+
          "letra11 = 0, \n"+
          "letra12 = 0, \n"+
          "letra13 = 0, \n"+
          "letra14 = 0, \n"+
          "letra15 = 0, \n"+
          "nro_comision = 0, \n"+
          "fraccionamiento = 'N', \n"+
          "nro_fraccionamiento = 0, \n"+
          "porc_1 = 0.00, \n"+
          "porc_2 = 0.00, \n"+
          "porc_3 = 0.00, \n"+
          "porc_4 = 0.00, \n"+
          "porc_5 = 0.00, \n"+
          "porc_6 = 0.00, \n"+
          "porc_7 = 0.00, \n"+
          "erp_afecta_percep = @erp_afecta_percep, \n"+
          "Hfor_pag_fechmodificacion = getdate(), \n"+
          "NombreEquipo = @NombreEquipo, \n"+
          "HoraPc = CONVERT(VARCHAR,getdate(),8), \n"+
          "Ip_Cliente = @Ip_Cliente, \n"+
          "ErpUsuario = @ErpUsuario where  ccod_empresa = @ccod_empresa and ccod_forpago = @ccod_forpago \n"
          );

          const request_eliminar_forma_pago_detalle  = new mssql.Request(transaction);
          await request_eliminar_forma_pago_detalle
          .input('erp_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_cod_formpag',mssql.VarChar(250),req.body.Codigo)
          .query(            
            " delete from Erp_Forma_Pago_Comisiones where erp_empresa = @erp_empresa and erp_cod_formpag = @erp_cod_formpag \n"
          );

          for (let i= 0; i< filas_forma_pago_detalles.length; i++){
            
            var fila = filas_forma_pago_detalles[i];
            const request_forma_pago_detalles  = new mssql.Request(transaction);
            await request_forma_pago_detalles
            .input('erp_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('erp_cod_formpag',mssql.VarChar(250),req.body.Codigo)
            .input('erp_item',mssql.VarChar(250),i+1)
            .input('erp_desde',mssql.VarChar(250),fila.Desde)
            .input('erp_hasta',mssql.VarChar(250),fila.Hasta)
            .input('erp_porcentaje',mssql.VarChar(250),fila.Porcentaje)
            .query(
             " insert into Erp_Forma_Pago_Comisiones( \n"+
             " erp_empresa, \n"+
             " erp_cod_formpag, \n"+
             " erp_item, \n"+
             " erp_desde, \n"+
             " erp_hasta, \n"+
             " erp_porcentaje \n"+
             " )values( \n"+
             " @erp_empresa, \n"+
             " @erp_cod_formpag, \n"+
             " @erp_item, \n"+
             " @erp_desde, \n"+
             " @erp_hasta, \n"+
             " @erp_porcentaje) \n"
            );            
          }
            
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
          const request_eliminar_forma_pago_detalle  = new mssql.Request(transaction);
          await request_eliminar_forma_pago_detalle
          .input('erp_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_cod_formpag',mssql.VarChar(250),req.body.Codigo)
          .query(            
            " delete from Erp_Forma_Pago_Comisiones where erp_empresa = @erp_empresa and erp_cod_formpag = @erp_cod_formpag \n"
          );

          const request  = new mssql.Request(transaction);
          await request
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_forpago',mssql.VarChar(250),req.body.Codigo)
          .query(            
          "delete from Hfor_pag where  ccod_empresa = @ccod_empresa and ccod_forpago = @ccod_forpago \n"
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

module.exports = router;