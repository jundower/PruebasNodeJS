const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');

router.get('/punto_venta/:id', async (req, res) => {
  try {
      const {id} = req.params;
      const pool = await poolPromise

        const lista = await pool
        .request()
        .input('id', mssql.VarChar(10), id)
        .query('select * from Halmacen where ccod_empresa = @id');
          
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

router.post('/datos', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const codigo_punto_venta = req.user.codigo_punto_venta;


    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_punto_venta', mssql.VarChar(250), codigo_punto_venta)
    .query("select \n"+
    "cnom_almacen as Nombre,\n"+
    "cdireccion as Direccion,\n"+
    "erp_codalmacen_ptovta as Almacen\n"+
    "from halmacen where ccod_empresa = @codigo_empresa and ccod_almacen = @codigo_punto_venta");
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
    .query("select \n"+
      " ccod_almacen as Codigo, \n"+
      " (ccod_almacen+' - '+cnom_almacen) as Nombre, \n"+
      " cdireccion as Direccion, \n"+
      " erp_codalmacen_ptovta as Almacen \n"+
      " from halmacen where ccod_empresa = @codigo_empresa "
      );

    const recordset = lista.recordset;
    res.json(recordset); 
  } catch (err) {
    
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
    .input('codigo_punto_venta', mssql.VarChar(250), req.body.codigo_punto_venta)
    .query(
      "select \n"+
      "LTRIM(RTRIM(codigo)) as Tipo_Producto_Codigo, \n"+
      "nombre as Tipo_Producto_Nombre, \n"+
      "LTRIM(RTRIM(Erp_Codalm)) as Almacen_Codigo, \n"+
      "cnom_almacen as Almacen_Nombre \n"+
      "from htipo_prod \n"+
      "left join Erp_PtoVta_Detalle on \n"+
      "htipo_prod.idempresa = Erp_PtoVta_Detalle.Erp_Codemp \n"+
      "and htipo_prod.codigo = Erp_PtoVta_Detalle.Erp_Tipo_Prod \n"+
      "and erp_ptovta=@codigo_punto_venta \n"+
      "left join Halmacen_2 on \n"+
      "Halmacen_2.ccod_empresa = Erp_PtoVta_Detalle.Erp_Codemp \n"+
      "and Halmacen_2.ccod_almacen = Erp_PtoVta_Detalle.Erp_Codalm \n"+
      "where idempresa=@codigo_empresa \n"
      );

    const recordset = lista.recordset;
    res.json(recordset); 
  } catch (err) {
    
    res.send(err.message)
  }
});

router.post('/guardar', async (req, res) => {
  try {

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{
          const request  = new mssql.Request(transaction);
          await request
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .input('Nombre',mssql.VarChar(250),req.body.Nombre)
          .input('Direccion',mssql.VarChar(250),req.body.Direccion)
          .input('Almacen',mssql.VarChar(250),req.body.Almacen_Relacionado)
          .query(
            "insert into Halmacen \n"+
            "( \n"+
            "ccod_empresa, \n"+
            "ccod_almacen, \n"+
            "cnom_almacen, \n"+
            "cdireccion, \n"+
            "erp_codalmacen_ptovta \n"+
            ") \n"+
            "values \n"+
            "( \n"+
            "@Codigo_Empresa, \n"+
            "@Codigo, \n"+
            "@Nombre, \n"+
            "@Direccion, \n"+
            "@Almacen \n"+
            ") \n"
          );

          const eliminar  = new mssql.Request(transaction);
          await eliminar
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from Erp_PtoVta_Detalle \n"+
            "where \n"+
            "Erp_Codemp = @Codigo_Empresa \n"+
            "and erp_ptovta = @Codigo\n"
          );


          var detalle = JSON.parse(req.body.Listas_Almacenes_Productos)
          for (let i= 0; i< detalle.length; i++){
            
            var fila = detalle[i];
            const request_precios  = new mssql.Request(transaction);
            await request_precios
            .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Codigo',mssql.VarChar(250),req.body.Codigo)
            .input('Tipo_Producto',mssql.VarChar(250),fila.Tipo_producto)
            .input('Almacen',mssql.VarChar(250),fila.Almacen)
            .query(
              "insert into Erp_PtoVta_Detalle \n"+
              "( \n"+
              "Erp_Codemp, \n"+
              "Erp_ptovta, \n"+
              "Erp_Tipo_Prod, \n"+
              "Erp_Codalm \n"+
              ") \n"+
              "values \n"+
              "( \n"+
              "@Codigo_Empresa, \n"+
              "@Codigo, \n"+
              "@Tipo_Producto, \n"+
              "@Almacen \n"+
              ") \n"
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

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{
          const request  = new mssql.Request(transaction);
          await request
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .input('Nombre',mssql.VarChar(250),req.body.Nombre)
          .input('Direccion',mssql.VarChar(250),req.body.Direccion)
          .input('Almacen',mssql.VarChar(250),req.body.Almacen_Relacionado)
          .query(
            
            "update Halmacen set \n"+
            "cnom_almacen = @Nombre, \n"+
            "cdireccion = @Direccion, \n"+
            "erp_codalmacen_ptovta = @Almacen \n"+
            "where \n"+
            "ccod_empresa = @Codigo_Empresa \n"+
            "and ccod_almacen = @Codigo\n"
          );

          const eliminar  = new mssql.Request(transaction);
          await eliminar
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from Erp_PtoVta_Detalle \n"+
            "where \n"+
            "Erp_Codemp = @Codigo_Empresa \n"+
            "and erp_ptovta = @Codigo\n"
          );


          var detalle = JSON.parse(req.body.Listas_Almacenes_Productos)
          for (let i= 0; i< detalle.length; i++){
            
            var fila = detalle[i];
            const request_precios  = new mssql.Request(transaction);
            await request_precios
            .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Codigo',mssql.VarChar(250),req.body.Codigo)
            .input('Tipo_Producto',mssql.VarChar(250),fila.Tipo_producto)
            .input('Almacen',mssql.VarChar(250),fila.Almacen)
            .query(
              "insert into Erp_PtoVta_Detalle \n"+
              "( \n"+
              "Erp_Codemp, \n"+
              "Erp_ptovta, \n"+
              "Erp_Tipo_Prod, \n"+
              "Erp_Codalm \n"+
              ") \n"+
              "values \n"+
              "( \n"+
              "@Codigo_Empresa, \n"+
              "@Codigo, \n"+
              "@Tipo_Producto, \n"+
              "@Almacen \n"+
              ") \n"
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
      const pool = await poolPromise
      await pool
      .request()
      .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
      .input('Codigo',mssql.VarChar(250),req.body.Codigo)
      .query(
        "delete from Erp_PtoVta_Detalle \n"+
        "where \n"+
        "Erp_Codemp = @Codigo_Empresa \n"+
        "and erp_ptovta = @Codigo\n"+
        "delete from halmacen \n"+
        "where \n"+
        "ccod_empresa = @Codigo_Empresa \n"+
        "and ccod_almacen = @Codigo\n"
      );
      res.send({estado: true, codigo: "0", mensaje: ''});
  } catch (err) {
    console.log(err.message);
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

module.exports = router;