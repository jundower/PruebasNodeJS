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
          'LTRIM(RTRIM(ccod_vendedor)) as Codigo \n, '+
          "ccod_vendedor + ' - '+ cnom_vendedor as Nombre, \n"+
          'email as Email, '+
          'celular as Celular, '+
          'telefono1 as Telefono1, '+
          'telefono2 as Telefono2, '+
          'telefono3 as Telefono3, '+
          'telefono4 as Telefono4, '+
          'porcentaje_comision as Porcentaje_Comision '+
          'from Hvended where ccod_empresa = @ccod_empresa order by ccod_vendedor'
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
      .input('codigo', mssql.VarChar(250), req.body.codigo)
      .query(
        'select \n'+
        'LTRIM(RTRIM(ccod_vendedor)) as Codigo \n, '+
        "ccod_vendedor + ' - '+ cnom_vendedor as Nombre, \n"+
        'email as Email, '+
        'celular as Celular, '+
        'telefono1 as Telefono1, '+
        'telefono2 as Telefono2, '+
        'telefono3 as Telefono3, '+
        'telefono4 as Telefono4, '+
        'lista_precios1 as Lista_precios1, '+
        'lista_precios2 as Lista_precios2, '+
        'lista_precios3 as Lista_precios3, '+
        'lista_precios4 as Lista_precios4, '+
        'LTRIM(RTRIM(zona)) as Codigo_Zona, '+
        'erp_cargo as Cargo, '+
        'imagen_firma as Firma, '+
        // 'password as Password, '+
        'porcentaje_comision as Porcentaje_Comision '+
        'from Hvended where ccod_empresa = @ccod_empresa and ccod_vendedor=@codigo order by ccod_vendedor'
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
          .input('Email',mssql.VarChar(250),req.body.Email)
          .input('Celular',mssql.VarChar(250),req.body.Telefono5)
          .input('Zona_Codigo',mssql.VarChar(250),req.body.Zona_Codigo)
          .input('Clave',mssql.VarChar(250),'123456')
          .input('Comision',mssql.VarChar(250),req.body.Comision)
          .input('telefono1',mssql.VarChar(250),req.body.Telefono1)
          .input('telefono2',mssql.VarChar(250),req.body.Telefono2)
          .input('telefono3',mssql.VarChar(250),req.body.Telefono3)
          .input('telefono4',mssql.VarChar(250),req.body.Telefono4)
          .input('erp_cargo',mssql.VarChar(250),req.body.Cargo)
          .input('imagen_firma',mssql.VarChar(250),req.body.Firma)
          .query(
            "insert into Hvended \n"+
            "( \n"+
            "ccod_empresa, \n"+
            "ccod_vendedor, \n"+
            "cnom_vendedor, \n"+
            "email, \n"+
            "celular, \n"+
            "lista_descuento, \n"+
            "zona, \n"+
            "password, \n"+
            "porcentaje_comision, \n"+
            "telefono1, \n"+
            "telefono2, \n"+
            "telefono3, \n"+
            "telefono4, \n"+
            "erp_cargo, \n"+
            "imagen_firma \n"+
            ") \n"+
            "values \n"+
            "( \n"+
            "@Codigo_Empresa, \n"+
            "@Codigo, \n"+
            "@Nombre, \n"+
            "@Email, \n"+
            "@Celular, \n"+
            "'', \n"+
            "@Zona_Codigo, \n"+
            "@Clave, \n"+
            "@Comision, \n"+
            "@telefono1, \n"+
            "@telefono2, \n"+
            "@telefono3, \n"+
            "@telefono4, \n"+
            "@erp_cargo, \n"+
            "@imagen_firma \n"+
            ") \n"
          );
          var Listas_Precios = JSON.parse(req.body.Listas_Precios)
          for (let i= 0; i< Listas_Precios.length; i++){
            
            var fila = Listas_Precios[i];
            const request_precios  = new mssql.Request(transaction);
            await request_precios
            .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Codigo',mssql.VarChar(250),req.body.Codigo)
            .input('Activo',mssql.VarChar(250),fila.Valor)
            .input('Lista',mssql.VarChar(250),fila.Codigo)
            .input('Tipo',mssql.VarChar(250),'12')
            .query(
              "insert into Erp_Vendedores_Lista_Precios \n"+
              "( \n"+
              "erp_codemp, \n"+
              "erp_codven, \n"+
              "erp_activo, \n"+
              "erp_codlista, \n"+
              "erp_tipo \n"+
              ") \n"+
              "values \n"+
              "( \n"+
              "@Codigo_Empresa, \n"+
              "@Codigo, \n"+
              "@Activo, \n"+
              "@Lista, \n"+
              "@Tipo \n"+
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
          .input('Email',mssql.VarChar(250),req.body.Email)
          .input('Celular',mssql.VarChar(250),req.body.Telefono5)
          .input('Zona_Codigo',mssql.VarChar(250),req.body.Zona_Codigo)
          // .input('Clave',mssql.VarChar(250),req.body.Clave)
          .input('Comision',mssql.VarChar(250),req.body.Comision)
          .input('telefono1',mssql.VarChar(250),req.body.Telefono1)
          .input('telefono2',mssql.VarChar(250),req.body.Telefono2)
          .input('telefono3',mssql.VarChar(250),req.body.Telefono3)
          .input('telefono4',mssql.VarChar(250),req.body.Telefono4)
          .input('erp_cargo',mssql.VarChar(250),req.body.Cargo)
          .input('imagen_firma',mssql.VarChar(250),req.body.Firma)
          .query(
            "update Hvended set \n"+
            "cnom_vendedor = @Nombre, \n"+
            "email = @Email, \n"+
            "celular = @Celular, \n"+
            "zona = @Zona_Codigo, \n"+
            // "password = @Clave, \n"+
            "porcentaje_comision = @Comision, \n"+
            "telefono1 = @telefono1, \n"+
            "telefono2 = @telefono2, \n"+
            "telefono3 = @telefono3, \n"+
            "telefono4 = @telefono4, \n"+
            "erp_cargo = @erp_cargo, \n"+
            "imagen_firma = @imagen_firma \n"+
            "where \n"+
            "ccod_empresa = @Codigo_Empresa \n"+
            "and ccod_vendedor = @Codigo\n"
          );

          const request_eliminar_precios  = new mssql.Request(transaction);
          await request_eliminar_precios
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .input('Tipo',mssql.VarChar(250),'12')
          .query(
            "delete from Erp_Vendedores_Lista_Precios \n"+
            "where \n"+
            "erp_codemp = @Codigo_Empresa and \n"+
            "erp_codven = @Codigo and \n"+
            "erp_tipo = @Tipo \n"
          );

          var Listas_Precios = JSON.parse(req.body.Listas_Precios)
          for (let i= 0; i< Listas_Precios.length; i++){
            
            var fila = Listas_Precios[i];
            const request_precios  = new mssql.Request(transaction);
            await request_precios
            .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Codigo',mssql.VarChar(250),req.body.Codigo)
            .input('Activo',mssql.VarChar(250),fila.Valor)
            .input('Lista',mssql.VarChar(250),fila.Codigo)
            .input('Tipo',mssql.VarChar(250),'12')
            .query(
              "insert into Erp_Vendedores_Lista_Precios \n"+
              "( \n"+
              "erp_codemp, \n"+
              "erp_codven, \n"+
              "erp_activo, \n"+
              "erp_codlista, \n"+
              "erp_tipo \n"+
              ") \n"+
              "values \n"+
              "( \n"+
              "@Codigo_Empresa, \n"+
              "@Codigo, \n"+
              "@Activo, \n"+
              "@Lista, \n"+
              "@Tipo \n"+
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

      const lista = await pool
      .request()
      .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
      .input('Codigo',mssql.VarChar(250),req.body.Codigo)
      .query(
        "delete from erp_contacto_vendedor \n"+
        "where \n"+
        "erp_codemp = @Codigo_Empresa \n"+
        "and erp_codven = @Codigo\n"+
        "delete from Erp_Vendedores_Lista_Precios \n"+
        "where \n"+
        "erp_codemp = @Codigo_Empresa \n"+
        "and erp_codven = @Codigo\n"+
        "delete from Hvended \n"+
        "where \n"+
        "ccod_empresa = @Codigo_Empresa \n"+
        "and ccod_vendedor = @Codigo\n"
      );
      res.send({estado: true, codigo: "0", mensaje: ''});
  } catch (err) {
    console.log(err.message);
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

module.exports = router;