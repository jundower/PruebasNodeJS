const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');
  
router.post('/lista', async (req, res) => {
  try {
      const codigo_empresa = req.user.codigo_empresa;
      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .query(
        " SELECT       \n"+
        " (Harticul.ccod_articulo) as Codigo, \n"+
        " (harticul.cnom_articulo) as Nombre, \n"+
        " (ltrim(rtrim(harticul.cunidad))) as Unidad, \n"+
        " (Hfam_art.cnom_familia) as Familia, \n"+
        " (Hsubfamilia_art.cnom_subfamilia) as Subfamilia, \n"+
        " (Erp_Concepto1.erp_nomcon) 	as Concepto01, \n"+
        " (Erp_Concepto2.erp_nomcon) 	as Concepto02, \n"+
        " (Erp_Concepto3.erp_nomcon) 	as Concepto03, \n"+
        " (Erp_Concepto4.erp_nomcon) 	as Concepto04, \n"+
        " (Erp_Concepto5.erp_nomcon) 	as Concepto05, \n"+
        " (Erp_Concepto6.erp_nomcon)	as Concepto06, \n"+
        " (Erp_Concepto7.erp_nomcon) 	as Concepto07, \n"+
        " (Harticul.observacion)		as Leyenda01, \n"+
        " (Harticul.erp_observacion2)	as Leyenda02, \n"+
        " (Harticul.ccod_interno	)	as Cod_Interno, \n"+
        " (Harticul.erp_codinterno2) 	as Cod_Interno2, \n"+
        " (Harticul.erp_codinterno3) 	as Cod_Interno3, \n"+
        " (Harticul.cod_digemir)		as Cod_Digamir \n"+
        " FROM   harticul \n"+
        " Inner Join Hfam_art \n"+
        " On Hfam_art.ccod_empresa = Harticul.ccod_empresa and \n"+
        " Hfam_art.cfamilia		 = Harticul.cfamilia \n"+
        " Inner Join Hsubfamilia_art \n"+
        " On Hsubfamilia_art.ccod_empresa	= Harticul.ccod_empresa and \n"+
        " Hsubfamilia_art.ccod_subfamilia	= Harticul.ccod_subfamilia \n"+
        " Inner Join Erp_Concepto1 \n"+
        " On Erp_Concepto1.erp_codemp	= Harticul.ccod_empresa and \n"+
        " Erp_Concepto1.erp_codcon	= Harticul.codmarca \n"+
        " Inner Join Erp_Concepto2 \n"+
        " On Erp_Concepto2.erp_codemp	= Harticul.ccod_empresa and \n"+
        " Erp_Concepto2.erp_codcon	= Harticul.modelo \n"+
        " Inner Join Erp_Concepto3 \n"+
        " On Erp_Concepto3.erp_codemp	= Harticul.ccod_empresa and \n"+
        " Erp_Concepto3.erp_codcon	= Harticul.color \n"+
        " Inner Join Erp_Concepto4 \n"+
        " On Erp_Concepto4.erp_codemp	= Harticul.ccod_empresa and \n"+
        " Erp_Concepto4.erp_codcon	= Harticul.tratamiento \n"+
        " Inner Join Erp_Concepto5 \n"+
        " On Erp_Concepto5.erp_codemp	= Harticul.ccod_empresa and \n"+
        " Erp_Concepto5.erp_codcon	= Harticul.fuelle \n"+
        " Inner Join Erp_Concepto6 \n"+
        " On Erp_Concepto6.erp_codemp	= Harticul.ccod_empresa and \n"+
        " Erp_Concepto6.erp_codcon	= Harticul.azas \n"+
        " Inner Join Erp_Concepto7 \n"+
        " On Erp_Concepto7.erp_codemp	= Harticul.ccod_empresa and \n"+
        " Erp_Concepto7.erp_codcon	= Harticul.solapa \n"+
        " where harticul.ccod_empresa  = @codigo_empresa and Harticul.erp_mankid = 'S' \n"
      );
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    if(req.user==null){
      res.send("El usuario ha sido expulsado");
    }else{
      res.send(err.message)
    }
  }
});

router.post('/articulos', async (req, res) => {
  try {
      const codigo_empresa = req.user.codigo_empresa;
      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .input('codigo', mssql.VarChar(25), req.body.codigo)
      .query(
       " SELECT      \n"+
       " erp_codemp as Codigo_Empresa, \n"+
       " cnom_articulo as Nombre, \n"+
       " erp_codart1 as Codigo_Antiguo,  \n"+
       " erp_codart2 as Codigo_Articulo,  \n"+
       " erp_canart as Cantidad,  \n"+
       " erp_codund2 as Unidad, \n"+
       " (Select top 1 erp_cosart from hstock  \n"+
       " where hstock.erp_codemp = erp_kid_articulo.erp_codemp and hstock.erp_codart = erp_kid_articulo.erp_codart2 ) as Costo, \n"+
       " erp_costo_ref as Costo_Referencia, \n"+
       " (Harticul.ccod_interno) as Codigo_Fabricante \n"+
       " FROM erp_kid_articulo inner join harticul on  \n"+
       " erp_kid_articulo.erp_codemp=harticul.ccod_empresa and  \n"+
       " erp_kid_articulo.erp_codart2=harticul.ccod_articulo \n"+
       " WHERE CCOD_EMPRESA= @codigo_empresa AND ERP_CODART1= @codigo \n"
      );
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    if(req.user==null){
      res.send("El usuario ha sido expulsado");
    }else{
      res.send(err.message)
    }
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
          .input('ccod_cencos',mssql.VarChar(250),req.body.Codigo)
          .input('cnom_cencos',mssql.VarChar(250),req.body.Nombre)
          .input('responsable',mssql.VarChar(250),req.body.Responsable)
          .input('abrev',mssql.VarChar(250),req.body.Abreviatura)
          .input('erp_nivel',mssql.VarChar(250),req.body.Nivel)
          .input('erp_digitos',mssql.VarChar(250),req.body.Digitos)
          .input('Hcencos_fechmodificacion',mssql.VarChar(250),'')
          .input('NombreEquipo',mssql.VarChar(250),'')
          .input('HoraPc',mssql.VarChar(250),'')
          .input('Ip_Cliente',mssql.VarChar(250),'')
          .input('ErpUsuario',mssql.VarChar(250), usuario)
          .query(            
           " insert into Hcencos( \n"+
           " ccod_empresa, \n"+
           " ccod_cencos, \n"+
           " cnom_cencos, \n"+
           " responsable, \n"+
           " abrev, \n"+
           " erp_nivel, \n"+
           " erp_digitos, \n"+
           " Hcencos_fechmodificacion, \n"+
           " NombreEquipo, \n"+
           " HoraPc, \n"+
           " Ip_Cliente, \n"+
           " ErpUsuario \n"+
           " )values( \n"+
           " @ccod_empresa, \n"+
           " @ccod_cencos, \n"+
           " @cnom_cencos, \n"+
           " @responsable, \n"+
           " @abrev, \n"+
           " @erp_nivel, \n"+
           " @erp_digitos, \n"+
           " getdate(), \n"+
           " @NombreEquipo, \n"+
           " convert(varchar,getdate(),8), \n"+
           " @Ip_Cliente, \n"+
           " @ErpUsuario) \n"
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
    var filas_kits_articulos = JSON.parse(req.body.Lista_Kits_Articulos)

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{
          
          const eliminar_kist_articulos  = new mssql.Request(transaction);
          await eliminar_kist_articulos
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codart1',mssql.VarChar(250),req.body.Codigo)
          .query(
            " delete from erp_kid_articulo where  erp_codemp = @erp_codemp and erp_codart1 = @erp_codart1 "
          );

          for (let i= 0; i< filas_kits_articulos.length; i++){
            var fila = filas_kits_articulos[i];

            const kist_articulos  = new mssql.Request(transaction);
            await kist_articulos
            .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
            .input('erp_codart1',mssql.VarChar(250),req.body.Codigo)
            .input('erp_codart2',mssql.VarChar(250),fila.Codigo_Articulo)
            .input('erp_canart',mssql.VarChar(250),fila.Cantidad)
            .input('erp_codund',mssql.VarChar(250),req.body.Unidad)
            .input('erp_cosven',mssql.VarChar(250),'0')
            .input('erp_faccon',mssql.VarChar(250),'1')
            .input('erp_codund2',mssql.VarChar(250),fila.Unidad)
            .input('erp_costo_ref',mssql.VarChar(250),'0')
            .input('erp_costo',mssql.VarChar(250),'0')
            .input('item',mssql.VarChar(250),i+1)
            .query(
             " insert into erp_kid_articulo( \n"+
             " erp_codemp, \n"+
             " erp_codart1, \n"+
             " erp_codart2, \n"+
             " erp_canart, \n"+
             " erp_codund, \n"+
             " erp_cosven, \n"+
             " erp_faccon, \n"+
             " erp_codund2, \n"+
             " erp_costo_ref, \n"+
             " erp_costo, \n"+
             " item \n"+
             " )values( \n"+
             " @erp_codemp, \n"+
             " @erp_codart1, \n"+
             " @erp_codart2, \n"+
             " @erp_canart, \n"+
             " @erp_codund, \n"+
             " @erp_cosven, \n"+
             " @erp_faccon, \n"+
             " @erp_codund2, \n"+
             " @erp_costo_ref, \n"+
             " @erp_costo, \n"+
             " @item) \n"
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
  
module.exports = router;