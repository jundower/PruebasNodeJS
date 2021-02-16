const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');

router.get('/almacen_punto_venta/:id/:selected', async (req, res) => {
    try {
      const {id} = req.params;
      const {selected} = req.params;
      const pool = await poolPromise;
      const lista = await pool
      .request()
      .input('cod_ptoventa', mssql.VarChar(250), selected)
      .input('cod_empresa', mssql.VarChar(10), id)
      .query("select " +
      "Halmacen_2.ccod_almacen, " +
      "Halmacen_2.cnom_almacen " +
      "from Halmacen_2 inner join Halmacen on " +
      "Halmacen_2.ccod_empresa = Halmacen.ccod_empresa and " +
      "Halmacen_2.ccod_almacen = Halmacen.erp_codalmacen_ptovta " +
      "where Halmacen.ccod_almacen = @cod_ptoventa and Halmacen.ccod_empresa = @cod_empresa");
      const recordset = lista.recordset;
      res.json(recordset); 
    } catch (err) {
      res.send(err.message);
    }
  });

router.post('/almacenes_productos', async (req, res) => {
  const codigo_empresa = req.user.codigo_empresa;
  const codigo_punto_venta = req.user.codigo_punto_venta;
  const pool = await poolPromise;
  const lista = await pool
  .request()
  .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
  .input('codigo_articulo', mssql.VarChar(100), req.body.codigo_articulo)
  .input('punto_venta', mssql.VarChar(250), codigo_punto_venta)
  .query("select \n" +
  "Halmacen_2.ccod_almacen, \n" +
  "Halmacen_2.cnom_almacen, \n" +
  "sum(erp_stoart) as stock,\n" +
  "case when Halmacen.erp_codalmacen_ptovta = Halmacen_2.ccod_almacen then 'S' else 'N' end as predeterminado\n" +
  "from hstock \n" +
  "inner join Halmacen_2 on\n" +
  "ERP_CODEMP=ccod_empresa and\n" +
  "ERP_CODALM=ccod_almacen\n" +
  "left join Halmacen on\n" +
  "Halmacen.ccod_empresa=Halmacen_2.ccod_empresa and \n" +
  "Halmacen.ccod_almacen =Halmacen_2.punto_venta \n" +
  "where Halmacen_2.ccod_empresa=@codigo_empresa and \n" +
  "ERP_CODPTV=@punto_venta and \n" +
  "ERP_CODART=@codigo_articulo and\n" +
  "Erp_visible='S'\n" +
  "group by \n" +
  "Halmacen_2.ccod_almacen, \n" +
  "Halmacen_2.cnom_almacen,\n" +
  "Halmacen.erp_codalmacen_ptovta\n" +
  "order by predeterminado desc, ccod_almacen");

  const recordset = lista.recordset;
  res.json(recordset);
});

router.post('/almacenes', async (req, res) => {
  const codigo_empresa = req.user.codigo_empresa;
  const codigo_punto_venta = req.user.codigo_punto_venta;
  const pool = await poolPromise;
  const lista = await pool
  .request()
  .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
  .input('punto_venta', mssql.VarChar(250), codigo_punto_venta)
  .query("select \n" +
  "Halmacen_2.ccod_almacen, \n" +
  "Halmacen_2.cnom_almacen, \n" +
  "case erp_codalmacen_ptovta when Halmacen_2.ccod_almacen then 'S' else 'N' end as predeterminado \n" +
  "from Halmacen_2 \n" +
  "inner join Halmacen on\n" +
  "Halmacen.ccod_empresa=Halmacen_2.ccod_empresa and \n" +
  "Halmacen.ccod_almacen =Halmacen_2.punto_venta \n" +
  "where Halmacen.ccod_almacen=@punto_venta and \n" +
  "Halmacen_2.ccod_empresa=@codigo_empresa and Erp_visible='S'");

  const recordset = lista.recordset;
  res.json(recordset);
});
  
router.post('/lista', async (req, res) => {
  const codigo_empresa = req.user.codigo_empresa;
  var codigo_punto_venta = req.body.codigo_punto_venta;
  
  if(codigo_punto_venta == null || codigo_punto_venta.trim()===''){
    codigo_punto_venta = req.user.codigo_punto_venta;
  }

  const pool = await poolPromise;
  const lista = await pool
  .request()
  .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
  .input('punto_venta', mssql.VarChar(250), codigo_punto_venta)
  .query("select \n" +
  "Halmacen_2.ccod_almacen as Codigo, \n" +
  "(Halmacen_2.ccod_almacen+ ' - '+Halmacen_2.cnom_almacen)as Nombre, \n" +
  "case erp_codalmacen_ptovta when Halmacen_2.ccod_almacen then 'S' else 'N' end as Predeterminado \n" +
  "from Halmacen_2 \n" +
  "inner join Halmacen on\n" +
  "Halmacen.ccod_empresa=Halmacen_2.ccod_empresa\n" +
  " --and Halmacen.ccod_almacen =Halmacen_2.punto_venta \n" +
  "where Halmacen.ccod_almacen=@punto_venta and \n" +
  "Halmacen_2.ccod_empresa=@codigo_empresa order by Predeterminado desc");

  const recordset = lista.recordset;
  res.json(recordset);
});

router.post('/lista_almacen', async (req, res) => {
  const codigo_empresa = req.user.codigo_empresa;
  const pool = await poolPromise;
  const lista = await pool
  .request()
  .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
  .query(
    "select \n"+
    "ccod_almacen as Codigo, \n"+
    "cnom_almacen as Nombre, \n"+
    "cdireccion as Direccion, \n"+
    "cresponsable as Responsable, \n"+
    "Erp_visible as Visible \n"+
    "from Halmacen_2 \n"+
    "where ccod_empresa=@codigo_empresa \n"
  );

  const recordset = lista.recordset;
  res.json(recordset);
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
          .input('Responsable',mssql.VarChar(250),req.body.Responsable)
          .input('punto_venta',mssql.VarChar(250),'00')
          .input('Visible',mssql.VarChar(250),req.body.Visible)
          .query(
            "insert into Halmacen_2 \n"+
            "( \n"+
            "ccod_empresa, \n"+
            "ccod_almacen, \n"+
            "cnom_almacen, \n"+
            "cdireccion, \n"+
            "cresponsable, \n"+
            "punto_venta, \n"+
            "Erp_visible \n"+
            ") \n"+
            "values \n"+
            "( \n"+
            "@Codigo_Empresa, \n"+
            "@Codigo, \n"+
            "@Nombre, \n"+
            "@Direccion, \n"+
            "@Responsable, \n"+
            "@punto_venta, \n"+
            "@Visible \n"+
            ") \n"
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
          .input('Responsable',mssql.VarChar(250),req.body.Responsable)
          .input('punto_venta',mssql.VarChar(250),'00')
          .input('Visible',mssql.VarChar(250),req.body.Visible)
          .query(
            "update Halmacen_2 set \n"+
            "cnom_almacen = @Nombre, \n"+
            "cdireccion = @Direccion, \n"+
            "cresponsable = @Responsable, \n"+
            "punto_venta = @punto_venta, \n"+
            "Erp_visible = @Visible \n"+
            "where \n"+
            "ccod_empresa = @Codigo_Empresa \n"+
            "and ccod_almacen = @Codigo\n"
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
      const pool = await poolPromise

      await pool
      .request()
      .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
      .input('Codigo',mssql.VarChar(250),req.body.Codigo)
      .query(
        "delete from Halmacen_2 \n"+
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