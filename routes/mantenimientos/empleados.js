const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');


router.get('/empleados/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const pool = await poolPromise
  
          const lista = await pool
          .request()
          .input('id', mssql.VarChar(10), id)
          .query('select * from hperson where ccod_empresa = @id');
            
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
      .query(" Select \n"+
        " LTRIM(RTRIM(ccod_person)) as Codigo, \n"+
        " nombres + ' ' +ape_pat + ' ' + ape_mat as Nombre, \n"+   
        " direccion as Direccion, \n"+
        " (erp_coduser) as Codigo_Usuario , \n"+
        " CONVERT(VARCHAR,fecha_ingreso,103) as Fecha_Ingreso, \n"+
        " Sexo as Sexo, \n"+
        " aprobar_pedido as Aprobar_Pedido, \n"+
        " pais as Pais, \n"+
        " genera_oc as Genera_OC, \n"+
        " email as Email, \n"+
        " erp_cargo as Erp_cargo, \n"+
        " erp_aprob_cot as Erp_Aprob_Cot, \n"+
        " tip_docid as Tipo_Documento, \n"+
        " ndoc_id as Numero_Documento , \n"+
        " aprobar_Req as Aprobar_Req \n"+
        " From hperson \n"+
        " Where ccod_empresa = @codigo_empresa ");
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
          .input('Tipo_Trabajador',mssql.VarChar(250),req.body.Tipo_Trabajador)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .input('Apellido_Paterno',mssql.VarChar(250),req.body.Apellido_Paterno)
          .input('Apellido_Materno',mssql.VarChar(250),req.body.Apellido_Materno)
          .input('Nombre',mssql.VarChar(250),req.body.Nombre)
          .input('Fecha_Ingreso',mssql.VarChar(250),req.body.Fecha_Ingreso)
          .input('Direccion',mssql.VarChar(250),req.body.Direccion)
          .input('Sexo',mssql.VarChar(250),req.body.Sexo)
          .input('Aprobar_Pedido',mssql.VarChar(250),req.body.Aprobar_Pedido)
          .input('Aprobar_Req_1',mssql.VarChar(250),req.body.Aprobar_Req_1)
          .input('Pais',mssql.VarChar(250),req.body.Pais)
          .input('Generar_Orden_Compra',mssql.VarChar(250),req.body.Generar_Orden_Compra)
          .input('Correo',mssql.VarChar(250),req.body.Correo)
          .input('Firma',mssql.VarChar(250),req.body.Firma)
          .input('Cargo',mssql.VarChar(250),req.body.Cargo)
          .input('Aprobar_Cotizacion',mssql.VarChar(250),req.body.Aprobar_Cotizacion)
          .input('Tipo_Documento',mssql.VarChar(250),req.body.Tipo_Documento)
          .input('Numero_Documento',mssql.VarChar(250),req.body.Numero_Documento)
          .input('Cierre_Fondo_Fijo',mssql.VarChar(250),req.body.Cierre_Fondo_Fijo)
          .input('Aprobar_Req_2',mssql.VarChar(250),req.body.Aprobar_Req_2)
          .input('Usuario',mssql.VarChar(250),req.body.Usuario)
          .input('erp_tipo_aporte',mssql.VarChar(250), 'Ninguno')
          .input('erp_afp',mssql.VarChar(250),'00')
          .input('erp_nro_cups',mssql.VarChar(250),'')
          .input('erp_flujo_mixta',mssql.VarChar(250),'F')
          .input('Aprobar_Orden_Compra',mssql.VarChar(250),req.body.Aprobar_Orden_Compra)
          .input('codigo_area',mssql.VarChar(250),'00')
          .query(
          " INSERT INTO Hperson \n"+
          " (ccod_empresa \n"+
          " ,tipo_trabajador \n"+
          " ,ccod_person \n"+
          " ,ape_pat \n"+
          " ,ape_mat \n"+
          " ,nombres \n"+
          " ,fecha_ingreso \n"+
          " ,direccion \n"+
          " ,sexo \n"+
          " ,aprobar_pedido \n"+
          " ,Aprobar_Req \n"+
          " ,pais \n"+
          " ,genera_oc \n"+
          " ,email \n"+
          " ,imagen_firma \n"+
          " ,erp_cargo \n"+
          " ,Erp_Aprob_Cot \n"+
          " ,tip_docid \n"+
          " ,ndoc_id \n"+
          " ,ff_cierre_Doc \n"+
          " ,erp_aprobreq_2 \n"+
          " ,Erp_Coduser \n"+
          " ,erp_tipo_aporte \n"+
          " ,erp_afp \n"+
          " ,erp_nro_cups \n"+
          " ,erp_flujo_mixta \n"+
          " ,aprobacion_oc_1 \n"+
          " ,codigo_area) \n"+
          " VALUES \n"+
          "(@Codigo_Empresa, \n"+
          " @Tipo_Trabajador, \n"+
          " @Codigo, \n"+
          " @Apellido_Paterno, \n"+
          " @Apellido_Materno, \n"+
          " @Nombre, \n"+
          " @Fecha_Ingreso, \n"+
          " @Direccion, \n"+
          " @Sexo, \n"+
          " @Aprobar_Pedido, \n"+
          " @Aprobar_Req_1, \n"+
          " @Pais, \n"+
          " @Generar_Orden_Compra, \n"+
          " @Correo, \n"+
          " @Firma, \n"+
          " @Cargo, \n"+
          " @Aprobar_Cotizacion, \n"+
          " @Tipo_Documento, \n"+
          " @Numero_Documento, \n"+
          " @Cierre_Fondo_Fijo, \n"+
          " @Aprobar_Req_2, \n"+
          " @Usuario, \n"+
          " @erp_tipo_aporte, \n"+
          " @erp_afp, \n"+
          " @erp_nro_cups, \n"+
          " @erp_flujo_mixta, \n"+
          " @Aprobar_Orden_Compra, \n"+
          " @codigo_area)"
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
          .input('Tipo_Trabajador',mssql.VarChar(250),req.body.Tipo_Trabajador)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .input('Apellido_Paterno',mssql.VarChar(250),req.body.Apellido_Paterno)
          .input('Apellido_Materno',mssql.VarChar(250),req.body.Apellido_Materno)
          .input('Nombre',mssql.VarChar(250),req.body.Nombre)
          .input('Fecha_Ingreso',mssql.VarChar(250),req.body.Fecha_Ingreso)
          .input('Direccion',mssql.VarChar(250),req.body.Direccion)
          .input('Sexo',mssql.VarChar(250),req.body.Sexo)
          .input('Aprobar_Pedido',mssql.VarChar(250),req.body.Aprobar_Pedido)
          .input('Aprobar_Req_1',mssql.VarChar(250),req.body.Aprobar_Req_1)
          .input('Pais',mssql.VarChar(250),req.body.Pais)
          .input('Generar_Orden_Compra',mssql.VarChar(250),req.body.Generar_Orden_Compra)
          .input('Correo',mssql.VarChar(250),req.body.Correo)
          .input('Firma',mssql.VarChar(250),req.body.Firma)
          .input('Cargo',mssql.VarChar(250),req.body.Cargo)
          .input('Aprobar_Cotizacion',mssql.VarChar(250),req.body.Aprobar_Cotizacion)
          .input('Tipo_Documento',mssql.VarChar(250),req.body.Tipo_Documento)
          .input('Numero_Documento',mssql.VarChar(250),req.body.Numero_Documento)
          .input('Cierre_Fondo_Fijo',mssql.VarChar(250),req.body.Cierre_Fondo_Fijo)
          .input('Aprobar_Req_2',mssql.VarChar(250),req.body.Aprobar_Req_2)
          .input('Usuario',mssql.VarChar(250),req.body.Usuario)
          .input('erp_tipo_aporte',mssql.VarChar(250), 'Ninguno')
          .input('erp_afp',mssql.VarChar(250),'00')
          .input('erp_nro_cups',mssql.VarChar(250),'')
          .input('erp_flujo_mixta',mssql.VarChar(250),'F')
          .input('Aprobar_Orden_Compra',mssql.VarChar(250),req.body.Aprobar_Orden_Compra)
          .input('codigo_area',mssql.VarChar(250),'00')
          .query(
          " UPDATE Hperson SET \n"+
          " tipo_trabajador = @Tipo_Trabajador \n"+
          " ,ape_pat = @Apellido_Paterno \n"+
          " ,ape_mat = @Apellido_Materno \n"+
          " ,nombres = @Nombre \n"+
          " ,fecha_ingreso = @Fecha_Ingreso \n"+
          " ,direccion = @Direccion \n"+
          " ,sexo = @Sexo \n"+
          " ,aprobar_pedido = @Aprobar_Pedido \n"+
          " ,Aprobar_Req = @Aprobar_Req_1 \n"+
          " ,pais = @Pais \n"+
          " ,genera_oc = @Generar_Orden_Compra \n"+
          " ,email = @Correo \n"+
          " ,imagen_firma = @Firma \n"+
          " ,erp_cargo = @Cargo \n"+
          " ,Erp_Aprob_Cot = @Aprobar_Cotizacion \n"+
          " ,tip_docid = @Tipo_Documento \n"+
          " ,ndoc_id = @Numero_Documento \n"+
          " ,ff_cierre_Doc = @Cierre_Fondo_Fijo \n"+
          " ,erp_aprobreq_2 = @Aprobar_Req_2 \n"+
          " ,Erp_Coduser = @Usuario \n"+
          " ,erp_tipo_aporte = @erp_tipo_aporte \n"+
          " ,erp_afp = @erp_afp \n"+
          " ,erp_nro_cups = @erp_nro_cups \n"+
          " ,erp_flujo_mixta = @erp_flujo_mixta \n"+
          " ,aprobacion_oc_1 = @Aprobar_Orden_Compra \n"+
          " ,codigo_area = @codigo_area \n"+
          " WHERE ccod_empresa = @Codigo_Empresa and ccod_person = @Codigo "
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
        "delete from Hperson \n"+
        " WHERE ccod_empresa = @Codigo_Empresa and ccod_person = @Codigo "
      );
      res.send({estado: true, codigo: "0", mensaje: ''});
  } catch (err) {
    console.log(err.message);
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

module.exports = router;