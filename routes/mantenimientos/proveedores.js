const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');

router.post('/lista', async (req, res) => {
  try {
      const codigo_empresa = req.user.codigo_empresa
      const pool = await poolPromise

      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .query("Select \n"+
        " LTRIM(RTRIM(Hproveed.ccod_proveedor)) as Codigo, \n"+
        " Hproveed.cnom_proveedor as Nombre, \n"+ 
        " (RTRIM(Htipdociden.ccod_sunatid) + ' - ' + Htipdociden.abvr) as Tipo_Proveedor, \n"+
        " Hproveed.ndoc_id as Numero_Doc, \n"+
        " Hproveed.cnum_ruc as Numero_Ruc, \n"+
        " Hproveed.cdireccion as Direccion, \n"+
        " Hproveed.ctelefonos as Telefono, \n"+
        " (RTRIM(Hpais.ccod_pais) + ' - ' + Hpais.cnom_pais) as Pais, \n"+
        " (RTRIM('' + ' - ' + '')) as Departamento, \n"+
        " (RTRIM('') + ' - ' + '') as Distrito, \n"+
        " (RTRIM('') + ' - ' + '')as Ciudad, \n"+
        " ISNULL(Hproveed.erp_observacion01, '') as Observacion1, \n"+
        " ISNULL(Hproveed.erp_observacion02, '') as Observacion2, \n"+
        " isnull(Hproveed.estado_contrib, 'Inactivo') as Estado, \n"+
        " '' as Codigo_Internoo, \n"+
        " Hproveed.erpusuario as Usuario, \n"+
        " Hproveed.NombreEquipo as Pc_user , \n"+
        " Hproveed.FechaEquipo as Pc_Fecha, \n"+
        " Hproveed.IpEquipo as Pc_ip, \n"+
        " Hproveed.erp_pc_fechamodificacion as Fecha_Modidificacion, \n"+
        " LTRIM(RTRIM(Hpais.ccod_pais)) as Codigo_Pais, \n"+
        " '' as Codigo_Departamento, \n"+
        " '' as Codigo_Distrito, \n"+
        " '' as Codigo_Ciudad \n"+
        " From Hproveed with (nolock) \n"+
        " left Join Htipdociden with (nolock)On \n"+
        " Hproveed.tip_docid = Htipdociden.ccod_tdid \n"+
        " left Join Hpais with (nolock) On \n"+
        " Hproveed.ccod_empresa=Hpais.ccod_empresa  and\n"+
        " Hproveed.pais=Hpais.ccod_pais \n"+
        " where Hproveed.ccod_empresa =@codigo_empresa" );
        
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    console.log(err.message);
    res.send(err.message)
  }
});

router.post('/datos', async (req, res) => {
    try {
      const codigo_empresa = req.user.codigo_empresa
      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .input('codigo_proveedor', mssql.VarChar(250), req.body.codigo)
      .query("Select \n"+
        " LTRIM(RTRIM(Hproveed.ccod_proveedor)) as Codigo, \n"+
        " LTRIM(RTRIM(Hproveed.cnom_proveedor)) as Nombre, \n"+
        " LTRIM(RTRIM(Htipdociden.ccod_sunatid)) as Tipo_documento, \n"+
        " LTRIM(RTRIM(Hproveed.ndoc_id)) as Numero_Doc, \n"+
        " LTRIM(RTRIM(Hproveed.cnum_ruc)) as Numero_Ruc, \n"+
        " LTRIM(RTRIM(Hproveed.cnum_dni)) as Numero_DNI, \n"+
        " LTRIM(RTRIM(Hproveed.cdireccion)) as Direccion, \n"+
        " LTRIM(RTRIM(Hproveed.ctelefonos)) as Telefono, \n"+
        " '' as Lista_Compras, \n"+
        " Hproveed.ce_mail as Email, \n"+
        " Hproveed.ccod_proveedor as Codigo_Interno, \n"+
        " '' as Vendedor_codigo, \n"+
        " '' as Porc_descuento, \n"+
        // " LTRIM(RTRIM( case Hproveed.erp_no_domiciliado_sn when 'S' then Hproveed.erp_no_domiciliado_pais else Hproveed.pais end )) as Codigo_Pais \n"+
        " LTRIM(RTRIM( case Hproveed.erp_no_domiciliado_sn when 'S' then '000' else Hproveed.pais end )) as Codigo_Pais \n"+
        " From Hproveed with (nolock) \n"+
        " inner Join Htipdociden with (nolock) On \n"+
        " Hproveed.tip_docid = Htipdociden.ccod_tdid \n"+
        " where Hproveed.ccod_empresa = @codigo_empresa \n"+
        " and (Hproveed.ccod_proveedor = @codigo_proveedor \n"+
        " or Hproveed.cnum_ruc = @codigo_proveedor \n"+
        " or Hproveed.cnom_proveedor = @codigo_proveedor) ");
      const recordset = lista.recordset;
      res.json(recordset); 
    } catch (err) {
      console.log(err.message);
      res.send(err.message)
    }
});
  
router.post('/contactos', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_cliente', mssql.VarChar(250), req.body.codigo)
    .query(" select \n"+
        " LTRIM(RTRIM(erp_codcont)) as Codigo, \n"+
        " LTRIM(RTRIM( erp_nomcont)) as Nombre, \n"+
        " erp_numdoc as Documento, \n"+
        " erp_telefono1, \n"+
        " erp_cargo as Cargo, \n"+
        " erp_email as Email, \n"+
        " Erp_Predeterminado as Predetermniado \n"+
        " from Hcontacto_proveed where \n"+
        " erp_codemp = @codigo_empresa and \n"+
        " erp_codproveed = @codigo_cliente and \n"+
        " erp_activo='S' \n"+
        " order by erp_nro_item ");
    
    const recordset = lista.recordset;
    res.json(recordset); 
  } catch (err) {
    console.log(err.message);
    res.send(err.message)
  }
});

router.post('/agencias', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_cliente', mssql.VarChar(250), req.body.codigo)
    .query("SELECT \n"+
    "isnull(erp_codage, '00') as Codigo,\n"+
    "isnull(erp_nomage, 'NINGUNO') as Nombre,\n"+
    "erp_codtag as Tipo,\n"+
    "erp_dirage as Direccion,\n"+
    "erp_conage as Contacto,\n"+
    "erp_telage as Telefono,\n"+
    "erp_codubi as Ubigeo\n"+
    "from erp_agencia\n"+
    "WHERE erp_codemp = @codigo_empresa and\n"+
    "erp_codtia = '42' and\n"+
    "erp_codane = @codigo_cliente");
      
    const recordset = lista.recordset;
    res.json(recordset); 
  } catch (err) {
    console.log(err.message);
    res.send(err.message)
  }
});

router.post('/direcciones_alternativas', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_cliente', mssql.VarChar(250), req.body.codigo)
    .query("SELECT \n"+
    "n_item as NItem,\n"+
    "cdirecciong as Direccion,\n"+
    "ubigeo as Ubigeo,\n"+
    "via_tipo as Tipo_Via,\n"+
    "via_nombre as Nombre_Via,\n"+
    "numero as Numero,\n"+
    "interior as Interior,\n"+
    "zona as Zona,\n"+
    "distrito as Distrito,\n"+
    "provincia as Provincia,\n"+
    "departamento as Departamento,\n"+
    "Erp_observacion as Observacion,\n"+
    "cdirecciong + ' '+ ubigeo as Codigo \n"+
    "from Hcliente_ptolle\n"+
    "WHERE ccod_empresa = @codigo_empresa and\n"+
    "tipo = '42' and\n"+
    "ccod_cliente = @codigo_cliente");
      
    const recordset = lista.recordset;
    res.json(recordset); 
  } catch (err) {
    console.log(err.message);
    res.send(err.message)
  }
});

router.post('/lista_contactos', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_proveedor', mssql.VarChar(100), req.body.codigo)
    .query(
     "select \n"+
     "erp_nro_item as Item, \n"+
     "Erp_Predeterminado as Predeterminado, \n"+
     "erp_codcont as Codigo, \n"+
     "erp_nomcont as Nombre, \n"+
     "erp_numdoc as Documento, \n"+
     "erp_cargo as Cargo, \n"+
     "erp_email as Email, \n"+
     "erp_telefono1 as Telefono1, \n"+
     "erp_telefono2 as Telefono2, \n"+
     "erp_telefono3 as Telefono3, \n"+
     "erp_telefono4 as Telefono4, \n"+
     "erp_ref as Referencia, \n"+
     "erp_coment1 as Comentario1, \n"+
     "erp_coment2 as Comentario2, \n"+
     "LTRIM(RTRIM(erp_activo)) as Activo \n"+
     "from Hcontacto_proveed where \n"+
     "erp_codemp = @codigo_empresa \n"+
     "and erp_codproveed = @codigo_proveedor \n"
    );

    const recordset = lista.recordset;
    res.json(recordset);
  } catch (err) {
    console.log(err.message);
    res.send(err.message)
  }
});

router.post('/lista_agencias', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_proveedor', mssql.VarChar(100), req.body.codigo)
    .input('tipo', mssql.VarChar(100), req.body.tipo)
    .query(
      "select \n"+
      "erp_codage as Codigo, \n"+
      "erp_nomage as Nombre, \n"+
      "erp_codtag as Codigo_Tipo_Agencia, \n"+
      "erp_dirage as Direccion, \n"+
      "erp_conage as Contacto, \n"+
      "erp_telage as Telefono, \n"+
      "erp_codubi as Codigo_Ubigeo \n"+
      "from erp_agencia where \n"+
      "erp_codemp = @codigo_empresa \n"+
      "and erp_codtia = @tipo \n"+
      "and erp_codane = @codigo_proveedor \n"
    );

    const recordset = lista.recordset;
    res.json(recordset);
  } catch (err) {
    console.log(err.message);
    res.send(err.message)
  }
});

router.post('/historial', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_porveedor', mssql.VarChar(100), req.body.codigo)
    .query(
      "SELECT \n"+
      "ccod_historial as Codigo, \n"+
      "Comentario as Comentario1, \n"+
      "Comentario_2 As Comentario2, \n"+
      "Comentario_3 As Comentario3, \n"+
      "CONVERT(VARCHAR,fecha,103) as Fecha, \n"+
      "visible as Visible \n"+
      "FROM Hproveed_historial WHERE  \n"+
      "ccod_empresa = @codigo_empresa \n"+
      "and ccod_proveedor = @codigo_porveedor\n"
    );

    const recordset = lista.recordset;
    res.json(recordset);
  } catch (err) {
    console.log(err.message);
    res.send(err.message)
  }
});

router.post('/cuenta_corrientes', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_proveedor', mssql.VarChar(100), req.body.codigo)
    .query(
     " SELECT  \n"+
     " Erp_Ctas_Ctes_Prov.ccod_empresa as Codigo_Empresa,    \n"+
     " Erp_Ctas_Ctes_Prov.ccod_proveedor as Codigo_Proveedor,    \n"+
     " Erp_Ctas_Ctes_Prov.cta_cte as Cuenta_Corriente,    \n"+
     " LTRIM(RTRIM(Erp_Ctas_Ctes_Prov.ccod_banco)) as Codigo_Banco,    \n"+
     " Erp_Ctas_Ctes_Prov.moneda as Codigo_Moneda,    \n"+
     " Erp_Ctas_Ctes_Prov.nro_cta_cte  as Numero_Cta_Cte, \n"+
     " Erp_Ctas_Ctes_Prov.predeterminado as Predeterminado \n"+
     " FROM Erp_Ctas_Ctes_Prov    \n"+
     " WHERE ccod_empresa= @codigo_empresa AND \n"+
     " ccod_proveedor= @codigo_proveedor \n"
    );

    const recordset = lista.recordset;
    res.json(recordset);
  } catch (err) {
    console.log(err.message);
    res.send(err.message)
  }
});

router.post('/codigos_alternativos', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_proveedor', mssql.VarChar(100), req.body.codigo)
    .input('tipo', mssql.VarChar(100), req.body.tipo)
    .query(
     "SELECT hcodigos_alternativos.codigo_prducto as Codigo_Producto, \n"+
     "hcodigos_alternativos.codigo_alternativo as Codigo_Alternativo, \n"+
     "hcodigos_alternativos.nombre_alternativo as Nombre_Alternativo \n"+
     "FROM hcodigos_alternativos   \n"+
     "where codigo_empresa= @codigo_empresa \n"+
     "and codigo_cliente= @codigo_proveedor \n"+
     "and tipo= @tipo \n"
    );

    const recordset = lista.recordset;
    res.json(recordset);
  } catch (err) {
    console.log(err.message);
    res.send(err.message)
  }
});

router.post('/guardar', async (req, res) => {
  try {

    const usuario = req.user.codigo_usuario;
    var filas_formas_pago_elegidos = JSON.parse(req.body.Lista_Forma_Pago_Elegidos)
    var filas_personas_contacto = JSON.parse(req.body.Lista_Persona_Contacto)
    var filas_detracciones_elegidos = JSON.parse(req.body.Lista_Detracciones_Elegidos)
    var filas_proveedor_lista_agencias = JSON.parse(req.body.Lista_Agencias)
    var filas_proveedor_historial = JSON.parse(req.body.Lista_Historial)
    var filas_proveedor_lista_retencion_no_domiciliados = JSON.parse(req.body.Lista_Retencion_No_Domiciliados)
    var filas_proveedor_cuentas_corrientes = JSON.parse(req.body.Lista_Cuentas_Corrientes)
    var filas_proveedor_lista_codigos_alternativos = JSON.parse(req.body.Lista_Codigos_Alternativos)

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{

          //#region Guardar Proveedor
          const datos_proveedor  = new mssql.Request(transaction);
          await datos_proveedor
          .input('ccod_empresa', mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_proveedor', mssql.VarChar(250),req.body.Codigo)
          .input('cgrupo_prov', mssql.VarChar(250),req.body.Grupo_Proveedor)
          .input('cnum_ruc', mssql.VarChar(250),req.body.Numero_ruc)
          .input('cnum_dni', mssql.VarChar(250),req.body.Numero_dni)
          .input('tip_docid', mssql.VarChar(250),req.body.Tipo_documento_identidad)
          .input('ndoc_id', mssql.VarChar(250),req.body.Numero_documento)
          .input('cnom_proveedor', mssql.VarChar(250),req.body.Nombre)
          .input('pais', mssql.VarChar(250),req.body.Pais)
          .input('ctelefonos', mssql.VarChar(250),req.body.Telefono1)
          .input('ce_mail', mssql.VarChar(250),req.body.Correo)
          .input('cfax', mssql.VarChar(250),req.body.Fax)
          .input('celular', mssql.VarChar(250),req.body.Celular)
          .input('cdireccion_postal', mssql.VarChar(250),req.body.Direcion_Postal)
          .input('ctelefonos_postal', mssql.VarChar(250),req.body.Telefono_Postal)
          .input('cfaxpostal', mssql.VarChar(250),req.body.Fax_Postal)
          .input('ce_mail_postal', mssql.VarChar(250),req.body.Email_Postal)
          .input('celular_postal', mssql.VarChar(250),req.body.Celular_Postal)
          .input('nextel_postal', mssql.VarChar(250),req.body.Nextel_Postal)
          .input('web', mssql.VarChar(250),req.body.Web)
          .input('cper_contacto', mssql.VarChar(250),req.body.Contacto)
          .input('cobservaciones', mssql.VarChar(250),req.body.Leyenda1)
          .input('buen_contri', mssql.VarChar(250),req.body.Buen_contribuyente_S_N)
          .input('percepcion', mssql.VarChar(250),req.body.Percepcion_S_N)
          .input('porc_percep', mssql.VarChar(250),req.body.Percepcion_porcentaje == ''? '0':req.body.Percepcion_porcentaje)
          .input('prc_en_doc', mssql.VarChar(250),req.body.Percepcion_Documento_S_N)
          .input('agen_ret_s_n', mssql.VarChar(250),req.body.Retencion_S_N)
          .input('porc_reten', mssql.VarChar(250),req.body.Retencion_porcentaje == ''? '0':req.body.Retencion_porcentaje)
          .input('excluye_percepcion', mssql.VarChar(250),req.body.Excluye_percepcion)
          .input('direccion', mssql.VarChar(250),req.body.Direccion)
          .input('cdireccion', mssql.VarChar(250),req.body.Direccion)
          .input('telefono_2', mssql.VarChar(250),req.body.Telefono2)
          .input('telefono_3', mssql.VarChar(250),'')
          .input('telefono_4', mssql.VarChar(250),'')
          .input('bonificacion', mssql.VarChar(250),req.body.Bonificacion_S_N)
          .input('Erp_Observacion01', mssql.VarChar(250),req.body.Leyenda2)
          .input('Erp_Observacion02', mssql.VarChar(250),'')
          .input('erp_nom_comercial', mssql.VarChar(250),'')
          .input('erp_zona_1', mssql.VarChar(250),req.body.Zona1)
          .input('erp_zona_2', mssql.VarChar(250),req.body.Zona2)
          .input('erp_situacion_1', mssql.VarChar(250),req.body.Situacion1)
          .input('erp_situacion_2', mssql.VarChar(250),req.body.Situacion2)
          .input('erp_no_domiciliado_sn', mssql.VarChar(250),req.body.No_Domiciliado_S_N)
          .input('erp_no_domiciliado_pais', mssql.VarChar(250),'00')
          .input('erp_beneficiario_codigo', mssql.VarChar(250),'00')
          .input('erp_vinculacion_economica', mssql.VarChar(250),'00')
          .input('erpusuario', mssql.VarChar(250),usuario)
          .input('nombreEquipo', mssql.VarChar(250),'')
          .input('FechaEquipo', mssql.VarChar(250),'')
          .input('IpEquipo', mssql.VarChar(250),'')
          .input('erp_pc_fechamodificacion', mssql.VarChar(250),'')
          .input('estado_contrib', mssql.VarChar(250),req.body.Estado)
          .input('condicion_contrib', mssql.VarChar(250),req.body.Condicion)
          .input('detraccion', mssql.VarChar(250),req.body.Detraccion_S_N)
          .query(
           " INSERT INTO Hproveed(\n"+
           " ccod_empresa,\n"+
           " ccod_proveedor,\n"+
           " cgrupo_prov,\n"+
           " cnum_ruc,\n"+
           " cnum_dni,\n"+
           " tip_docid,\n"+
           " ndoc_id,\n"+
           " cnom_proveedor,\n"+
           " pais,\n"+
           " ctelefonos,\n"+
           " ce_mail,\n"+
           " cfax,\n"+
           " celular,\n"+
           " cdireccion_postal,\n"+
           " ctelefonos_postal,\n"+
           " cfaxpostal,\n"+
           " ce_mail_postal,\n"+
           " celular_postal,\n"+
           " nextel_postal,\n"+
           " web,\n"+
           " cper_contacto,\n"+
           " cobservaciones,\n"+
           " buen_contri,\n"+
           " percepcion,\n"+
           " porc_percep,\n"+
           " prc_en_doc,\n"+
           " agen_ret_s_n,\n"+
           " porc_reten,\n"+
           " excluye_percepcion,\n"+
           " direccion,\n"+
           " cdireccion,\n"+
           " telefono_2,\n"+
           " telefono_3,\n"+
           " telefono_4,\n"+
           " bonificacion,\n"+
           " Erp_Observacion01,\n"+
           " Erp_Observacion02,\n"+
           " erp_nom_comercial,\n"+
           " erp_zona_1,\n"+
           " erp_zona_2,\n"+
           " erp_situacion_1,\n"+
           " erp_situacion_2,\n"+
           " erp_no_domiciliado_sn,\n"+
           " erp_no_domiciliado_pais,\n"+
           " erp_beneficiario_codigo,\n"+
           " erp_vinculacion_economica,\n"+
           " erpusuario,\n"+
           " nombreEquipo,\n"+
           " FechaEquipo,\n"+
           " IpEquipo,\n"+
           " erp_pc_fechamodificacion,\n"+
           " estado_contrib,\n"+
           " condicion_contrib,\n"+
           " detraccion )VALUES(\n"+
           " @ccod_empresa, \n"+
           " @ccod_proveedor, \n"+
           " @cgrupo_prov, \n"+
           " @cnum_ruc, \n"+
           " @cnum_dni, \n"+
           " @tip_docid, \n"+
           " @ndoc_id, \n"+
           " @cnom_proveedor, \n"+
           " @pais, \n"+
           " @ctelefonos, \n"+
           " @ce_mail, \n"+
           " @cfax, \n"+
           " @celular, \n"+
           " @cdireccion_postal, \n"+
           " @ctelefonos_postal, \n"+
           " @cfaxpostal, \n"+
           " @ce_mail_postal, \n"+
           " @celular_postal, \n"+
           " @nextel_postal, \n"+
           " @web, \n"+
           " @cper_contacto, \n"+
           " @cobservaciones, \n"+
           " @buen_contri, \n"+
           " @percepcion, \n"+
           " @porc_percep, \n"+
           " @prc_en_doc, \n"+
           " @agen_ret_s_n, \n"+
           " @porc_reten, \n"+
           " @excluye_percepcion, \n"+
           " @direccion, \n"+
           " @cdireccion, \n"+
           " @telefono_2, \n"+
           " @telefono_3, \n"+
           " @telefono_4, \n"+
           " @bonificacion, \n"+
           " @Erp_Observacion01, \n"+
           " @Erp_Observacion02, \n"+
           " @erp_nom_comercial, \n"+
           " @erp_zona_1, \n"+
           " @erp_zona_2, \n"+
           " @erp_situacion_1, \n"+
           " @erp_situacion_2, \n"+
           " @erp_no_domiciliado_sn, \n"+
           " @erp_no_domiciliado_pais, \n"+
           " @erp_beneficiario_codigo, \n"+
           " @erp_vinculacion_economica, \n"+
           " @erpusuario, \n"+
           " @nombreEquipo, \n"+
           " getdate(), \n"+
           " @IpEquipo, \n"+
           " getdate(), \n"+
           " @estado_contrib, \n"+
           " @condicion_contrib, \n"+
           " @detraccion )\n"
          );
          //#endregion
    
          //#region Guardar Forma Pago Provedor
          for (let i= 0; i< filas_formas_pago_elegidos.length; i++){
            var fila = filas_formas_pago_elegidos[i];

            const formas_pagos_proveedor  = new mssql.Request(transaction);
            await formas_pagos_proveedor
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('ccod_proveedor',mssql.VarChar(250),req.body.Codigo)
            .input('tipo',mssql.VarChar(250),'42')
            .input('ccod_forpago',mssql.VarChar(250),fila.Codigo)
            .input('selec',mssql.VarChar(250),fila.Predeterminado)
            .input('n_item',mssql.VarChar(250),i+1)
            .query(
            "insert into Hforpag_provee( \n"+
            "ccod_empresa, \n"+
            "ccod_proveedor, \n"+
            "tipo, \n"+
            "ccod_forpago, \n"+
            "selec, \n"+
            "n_item \n"+
            ")values( \n"+
            "@ccod_empresa, \n"+
            "@ccod_proveedor, \n"+
            "@tipo, \n"+
            "@ccod_forpago, \n"+
            "@selec, \n"+
            "@n_item) \n"
            );
          }
          //#endregion

          //#region Guardar Persona Contacto Proveedor
          for (let i= 0; i< filas_personas_contacto.length; i++){
            var fila = filas_personas_contacto[i];
            console.log(fila);
            const persona_contacto_proveedor  = new mssql.Request(transaction);
            await persona_contacto_proveedor
            .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
            .input('erp_codproveed',mssql.VarChar(250),req.body.Codigo)
            .input('erp_codcont',mssql.VarChar(250),fila.Codigo)
            .input('erp_nomcont',mssql.VarChar(250),fila.Nombre)
            .input('erp_numdoc',mssql.VarChar(250),fila.Documento)
            .input('erp_cargo',mssql.VarChar(250),fila.Cargo)
            .input('erp_email',mssql.VarChar(250),fila.Email)
            .input('erp_telefono1',mssql.VarChar(250),fila.Telefono1)
            .input('erp_telefono2',mssql.VarChar(250),fila.Telefono2)
            .input('erp_telefono3',mssql.VarChar(250),fila.Telefono3)
            .input('erp_telefono4',mssql.VarChar(250),fila.Telefono4)
            .input('erp_ref',mssql.VarChar(250),fila.Referencia)
            .input('erp_coment1',mssql.VarChar(250),fila.Comentario1)
            .input('erp_coment2',mssql.VarChar(250),fila.Comentario2)
            .input('erp_activo',mssql.VarChar(250),fila.Activo)
            .input('Erp_Predeterminado',mssql.VarChar(250),fila.Predeterminado)
            .input('erp_nro_item',mssql.VarChar(250),i+1)
            .query(
              "INSERT INTO Hcontacto_proveed( \n"+
              "erp_codemp, \n"+
              "erp_codproveed, \n"+
              "erp_codcont, \n"+
              "erp_nomcont, \n"+
              "erp_numdoc, \n"+
              "erp_cargo, \n"+
              "erp_email, \n"+
              "erp_telefono1, \n"+
              "erp_telefono2, \n"+
              "erp_telefono3, \n"+
              "erp_telefono4, \n"+
              "erp_ref, \n"+
              "erp_coment1, \n"+
              "erp_coment2, \n"+
              "erp_activo, \n"+
              "erp_nro_item, \n"+
              "Erp_Predeterminado \n"+
              ")VALUES( \n"+
              "@erp_codemp, \n"+
              "@erp_codproveed, \n"+
              "@erp_codcont, \n"+
              "@erp_nomcont, \n"+
              "@erp_numdoc, \n"+
              "@erp_cargo, \n"+
              "@erp_email, \n"+
              "@erp_telefono1, \n"+
              "@erp_telefono2, \n"+
              "@erp_telefono3, \n"+
              "@erp_telefono4, \n"+
              "@erp_ref, \n"+
              "@erp_coment1, \n"+
              "@erp_coment2, \n"+
              "@erp_activo, \n"+
              "@erp_nro_item,  \n"+
              "@Erp_Predeterminado) \n"
            );
          }
          //#endregion

          //#region Guardar Detraccion Proveedor
          for (let i= 0; i< filas_detracciones_elegidos.length; i++){
            var fila = filas_detracciones_elegidos[i];

            const detracciones_proveedor  = new mssql.Request(transaction);
            await detracciones_proveedor
            .input('CCOD_EMPRESA',mssql.VarChar(250),req.user.codigo_empresa)
            .input('CCOD_ANEXO',mssql.VarChar(250),req.body.Codigo)
            .input('CTIP_ANEXO',mssql.VarChar(250),'42')
            .input('CCOD_DETRACCION',mssql.VarChar(250),fila.Codigo)
            .input('PORCENTAJE',mssql.VarChar(250),'0')
            .input('PREDET',mssql.VarChar(250),fila.Predeterminado)
            .input('SEL',mssql.VarChar(250),'')
            .query(
              "insert into HDETRAANEXO( \n"+
              "CCOD_EMPRESA, \n"+
              "CTIP_ANEXO, \n"+
              "CCOD_ANEXO, \n"+
              "CCOD_DETRACCION, \n"+
              "PORCENTAJE, \n"+
              "PREDET, \n"+
              "SEL \n"+
              ")values( \n"+
              "@CCOD_EMPRESA, \n"+
              "@CTIP_ANEXO, \n"+
              "@CCOD_ANEXO, \n"+
              "@CCOD_DETRACCION, \n"+
              "@PORCENTAJE, \n"+
              "@PREDET, \n"+
              "@SEL) \n"
            );
          }
          //#endregion

          //#region Guardar Lista Agencias Proveedor
          for (let i= 0; i< filas_proveedor_lista_agencias.length; i++){
            var fila = filas_proveedor_lista_agencias[i];

            const proveedor_lista_agencias  = new mssql.Request(transaction);
            await proveedor_lista_agencias
            .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
            .input('erp_codane',mssql.VarChar(250),req.body.Codigo)
            .input('erp_codage',mssql.VarChar(250),fila.Codigo)
            .input('erp_nomage',mssql.VarChar(250),fila.Nombre)
            .input('erp_codtag',mssql.VarChar(250),fila.Tipo_Agencia)
            .input('erp_dirage',mssql.VarChar(250),fila.Direccion)
            .input('erp_conage',mssql.VarChar(250),fila.Contacto)
            .input('erp_telage',mssql.VarChar(250),fila.Telefono)
            .input('erp_codubi',mssql.VarChar(250),fila.Codigo_Ubigeo)
            .input('erp_codtia',mssql.VarChar(250),'42')
            .query(
              "insert into erp_agencia( \n"+
              "erp_codemp, \n"+
              "erp_codtia, \n"+
              "erp_codane, \n"+
              "erp_codage, \n"+
              "erp_nomage, \n"+
              "erp_codtag, \n"+
              "erp_dirage, \n"+
              "erp_conage, \n"+
              "erp_telage, \n"+
              "erp_codubi \n"+
              ")values( \n"+
              "@erp_codemp, \n"+
              "@erp_codtia, \n"+
              "@erp_codane, \n"+
              "@erp_codage, \n"+
              "@erp_nomage, \n"+
              "@erp_codtag, \n"+
              "@erp_dirage, \n"+
              "@erp_conage, \n"+
              "@erp_telage, \n"+
              "@erp_codubi) \n"
            );
          }
          //#endregion

          //#region Guardar Lista Historial Proveedor
          for (let i= 0; i< filas_proveedor_historial.length; i++){
            var fila = filas_proveedor_historial[i];

            const proveedor_lista_historial  = new mssql.Request(transaction);
            await proveedor_lista_historial
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('ccod_proveedor',mssql.VarChar(250),req.body.Codigo)
            .input('ccod_historial',mssql.VarChar(250),i+1)
            .input('Comentario',mssql.VarChar(250),fila.Comentario1)
            .input('Comentario_2',mssql.VarChar(250),fila.Comentario2)
            .input('Comentario_3',mssql.VarChar(250),fila.Comentario3)
            .input('fecha',mssql.VarChar(250),fila.Fecha)
            .input('Configuracion',mssql.VarChar(250),filas_proveedor_historial.length)
            .input('visible',mssql.VarChar(250),fila.Visible)
            .query(
              "insert into Hproveed_historial( \n"+
              "ccod_empresa, \n"+
              "ccod_proveedor, \n"+
              "ccod_historial, \n"+
              "Comentario, \n"+
              "Comentario_2, \n"+
              "Comentario_3, \n"+
              "fecha, \n"+
              "Configuracion, \n"+
              "visible \n"+
              ")values( \n"+
              "@ccod_empresa, \n"+
              "@ccod_proveedor, \n"+
              "@ccod_historial, \n"+
              "@Comentario, \n"+
              "@Comentario_2, \n"+
              "@Comentario_3, \n"+
              "@fecha, \n"+
              "@Configuracion, \n"+
              "@visible) \n"
            );
          }
          //#endregion

          //#region Guardar Lista Retenciones No Domiciliados Proveedor
          for (let i= 0; i< filas_proveedor_lista_retencion_no_domiciliados.length; i++){
            var fila = filas_proveedor_lista_retencion_no_domiciliados[i];

            const proveedor_lista_retencion_no_domicicliados  = new mssql.Request(transaction);
            await proveedor_lista_retencion_no_domicicliados
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('ccod_anexo',mssql.VarChar(250),req.body.Codigo)
            .input('ccod_retencion',mssql.VarChar(250),fila.Codigo)
            .input('porcentaje',mssql.VarChar(250),'0')
            .input('predet',mssql.VarChar(250),fila.Predeterminado)
            .input('sel',mssql.VarChar(250),'')
            .input('ctip_anexo',mssql.VarChar(250),'42')
            .query(
             " insert into Hretenanexo( \n"+
             " ccod_empresa, \n"+
             " ctip_anexo, \n"+
             " ccod_anexo, \n"+
             " ccod_retencion, \n"+
             " porcentaje, \n"+
             " predet, \n"+
             " sel \n"+
             " )values( \n"+
             " @ccod_empresa, \n"+
             " @ctip_anexo, \n"+
             " @ccod_anexo, \n"+
             " @ccod_retencion, \n"+
             " @porcentaje, \n"+
             " @predet, \n"+
             " @sel) \n"
            );
          }
          //#endregion

          //#region Guardar Proveedor Cuentas Corrientes
          for (let i= 0; i< filas_proveedor_cuentas_corrientes.length; i++){
            var fila = filas_proveedor_cuentas_corrientes[i];

            const proveedor_cuentas_corrientes  = new mssql.Request(transaction);
            await proveedor_cuentas_corrientes
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('ccod_proveedor',mssql.VarChar(250),req.body.Codigo)
            .input('cta_cte',mssql.VarChar(250),fila.Cuenta_Corriente)
            .input('ccod_banco',mssql.VarChar(250),fila.Banco)
            .input('moneda',mssql.VarChar(250),fila.Moneda)
            .input('nro_cta_cte',mssql.VarChar(250),fila.Numero_Cta_Cte)
            .input('predeterminado',mssql.VarChar(250),fila.Predeterminado)
            .query(
              "insert into Erp_Ctas_Ctes_Prov( \n"+
              "  ccod_empresa, \n"+
              "  ccod_proveedor, \n"+
              "  cta_cte, \n"+
              "  ccod_banco, \n"+
              "  moneda, \n"+
              "  nro_cta_cte, \n"+
              "  predeterminado \n"+
              "  )values( \n"+
              "  @ccod_empresa, \n"+
              "  @ccod_proveedor, \n"+
              "  @cta_cte, \n"+
              "  @ccod_banco, \n"+
              "  @moneda, \n"+
              "  @nro_cta_cte, \n"+
              "  @predeterminado) \n"
            );
          }
          //#endregion

          //#region Guardar Proveedor Codigos Alternativos
          for (let i= 0; i< filas_proveedor_lista_codigos_alternativos.length; i++){
            var fila = filas_proveedor_lista_codigos_alternativos[i];

            const proveedor_codigos_alternativos  = new mssql.Request(transaction);
            await proveedor_codigos_alternativos
            .input('codigo_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('codigo_cliente',mssql.VarChar(250),req.body.Codigo)
            .input('tipo',mssql.VarChar(250),'42')
            .input('codigo_prducto',mssql.VarChar(250),fila.Codigo_Producto)
            .input('codigo_alternativo',mssql.VarChar(250),fila.Codigo_Alternativo)
            .input('nombre_alternativo',mssql.VarChar(250),fila.Nombre_Alternativo)
            .query(
             "insert into hcodigos_alternativos( \n"+
             "codigo_empresa, \n"+
             "tipo, \n"+
             "codigo_cliente, \n"+
             "codigo_prducto, \n"+
             "codigo_alternativo, \n"+
             "nombre_alternativo \n"+
             ")values( \n"+
             "@codigo_empresa, \n"+
             "@tipo, \n"+
             "@codigo_cliente, \n"+
             "@codigo_prducto, \n"+
             "@codigo_alternativo, \n"+
             "@nombre_alternativo) \n"
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

router.post('/modificar', async (req, res) => {
  try {

    const usuario = req.user.codigo_usuario;
    var filas_formas_pago_elegidos = JSON.parse(req.body.Lista_Forma_Pago_Elegidos)
    var filas_personas_contacto = JSON.parse(req.body.Lista_Persona_Contacto)
    var filas_detracciones_elegidos = JSON.parse(req.body.Lista_Detracciones_Elegidos)
    var filas_proveedor_lista_agencias = JSON.parse(req.body.Lista_Agencias)
    var filas_proveedor_historial = JSON.parse(req.body.Lista_Historial)
    var filas_proveedor_lista_retencion_no_domiciliados = JSON.parse(req.body.Lista_Retencion_No_Domiciliados)
    var filas_proveedor_cuentas_corrientes = JSON.parse(req.body.Lista_Cuentas_Corrientes)
    var filas_proveedor_lista_codigos_alternativos = JSON.parse(req.body.Lista_Codigos_Alternativos)

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{

          //#region Modificar Proveedor
          const datos_proveedor  = new mssql.Request(transaction);
          await datos_proveedor
          .input('ccod_empresa', mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_proveedor', mssql.VarChar(250),req.body.Codigo)
          .input('cgrupo_prov', mssql.VarChar(250),req.body.Grupo_Proveedor)
          .input('cnum_ruc', mssql.VarChar(250),req.body.Numero_ruc)
          .input('cnum_dni', mssql.VarChar(250),req.body.Numero_dni)
          .input('tip_docid', mssql.VarChar(250),req.body.Tipo_documento_identidad)
          .input('ndoc_id', mssql.VarChar(250),req.body.Numero_documento)
          .input('cnom_proveedor', mssql.VarChar(250),req.body.Nombre)
          .input('pais', mssql.VarChar(250),req.body.Pais)
          .input('ctelefonos', mssql.VarChar(250),req.body.Telefono1)
          .input('ce_mail', mssql.VarChar(250),req.body.Correo)
          .input('cfax', mssql.VarChar(250),req.body.Fax)
          .input('celular', mssql.VarChar(250),req.body.Celular)
          .input('cdireccion_postal', mssql.VarChar(250),req.body.Direcion_Postal)
          .input('ctelefonos_postal', mssql.VarChar(250),req.body.Telefono_Postal)
          .input('cfaxpostal', mssql.VarChar(250),req.body.Fax_Postal)
          .input('ce_mail_postal', mssql.VarChar(250),req.body.Email_Postal)
          .input('celular_postal', mssql.VarChar(250),req.body.Celular_Postal)
          .input('nextel_postal', mssql.VarChar(250),req.body.Nextel_Postal)
          .input('web', mssql.VarChar(250),req.body.Web)
          .input('cper_contacto', mssql.VarChar(250),req.body.Contacto)
          .input('cobservaciones', mssql.VarChar(250),req.body.Leyenda1)
          .input('buen_contri', mssql.VarChar(250),req.body.Buen_contribuyente_S_N)
          .input('percepcion', mssql.VarChar(250),req.body.Percepcion_S_N)
          .input('porc_percep', mssql.VarChar(250),req.body.Percepcion_porcentaje == ''? '0':req.body.Percepcion_porcentaje)
          .input('prc_en_doc', mssql.VarChar(250),req.body.Percepcion_Documento_S_N)
          .input('agen_ret_s_n', mssql.VarChar(250),req.body.Retencion_S_N)
          .input('porc_reten', mssql.VarChar(250),req.body.Retencion_porcentaje == ''? '0':req.body.Retencion_porcentaje)
          .input('excluye_percepcion', mssql.VarChar(250),req.body.Excluye_percepcion)
          .input('direccion', mssql.VarChar(250),req.body.Direccion)
          .input('cdireccion', mssql.VarChar(250),req.body.Direccion)
          .input('telefono_2', mssql.VarChar(250),req.body.Telefono2)
          .input('telefono_3', mssql.VarChar(250),'')
          .input('telefono_4', mssql.VarChar(250),'')
          .input('bonificacion', mssql.VarChar(250),req.body.Bonificacion_S_N)
          .input('Erp_Observacion01', mssql.VarChar(250),req.body.Leyenda2)
          .input('Erp_Observacion02', mssql.VarChar(250),'')
          .input('erp_nom_comercial', mssql.VarChar(250),'')
          .input('erp_zona_1', mssql.VarChar(250),req.body.Zona1)
          .input('erp_zona_2', mssql.VarChar(250),req.body.Zona2)
          .input('erp_situacion_1', mssql.VarChar(250),req.body.Situacion1)
          .input('erp_situacion_2', mssql.VarChar(250),req.body.Situacion2)
          .input('erp_no_domiciliado_sn', mssql.VarChar(250),req.body.No_Domiciliado_S_N)
          .input('erp_no_domiciliado_pais', mssql.VarChar(250),'00')
          .input('erp_beneficiario_codigo', mssql.VarChar(250),'00')
          .input('erp_vinculacion_economica', mssql.VarChar(250),'00')
          .input('erpusuario', mssql.VarChar(250),usuario)
          .input('nombreEquipo', mssql.VarChar(250),'')
          .input('FechaEquipo', mssql.VarChar(250),'')
          .input('IpEquipo', mssql.VarChar(250),'')
          .input('erp_pc_fechamodificacion', mssql.VarChar(250),'')
          .input('estado_contrib', mssql.VarChar(250),req.body.Estado)
          .input('condicion_contrib', mssql.VarChar(250),req.body.Condicion)
          .input('detraccion', mssql.VarChar(250),req.body.Detraccion_S_N)
          .query(
           " update Hproveed set\n"+
           " cgrupo_prov = @cgrupo_prov,\n"+
           " cnum_ruc = @cnum_ruc,\n"+
           " cnum_dni = @cnum_dni,\n"+
           " tip_docid = @tip_docid,\n"+
           " ndoc_id = @ndoc_id,\n"+
           " cnom_proveedor = @cnom_proveedor,\n"+
           " pais = @pais,\n"+
           " ctelefonos = @ctelefonos,\n"+
           " ce_mail = @ce_mail,\n"+
           " cfax = @cfax,\n"+
           " celular = @celular,\n"+
           " cdireccion_postal = @cdireccion_postal,\n"+
           " ctelefonos_postal = @ctelefonos_postal,\n"+
           " cfaxpostal = @cfaxpostal,\n"+
           " ce_mail_postal = @ce_mail_postal,\n"+
           " celular_postal = @celular_postal,\n"+
           " nextel_postal = @nextel_postal,\n"+
           " web = @web,\n"+
           " cper_contacto = @cper_contacto,\n"+
           " cobservaciones = @cobservaciones,\n"+
           " buen_contri = @buen_contri,\n"+
           " percepcion = @percepcion,\n"+
           " porc_percep = @porc_percep,\n"+
           " prc_en_doc = @prc_en_doc,\n"+
           " agen_ret_s_n = @agen_ret_s_n,\n"+
           " porc_reten = @porc_reten,\n"+
           " excluye_percepcion = @excluye_percepcion,\n"+
           " direccion = @direccion,\n"+
           " cdireccion = @cdireccion,\n"+
           " telefono_2 = @telefono_2,\n"+
           " telefono_3 = @telefono_3,\n"+
           " telefono_4 = @telefono_4,\n"+
           " bonificacion = @bonificacion,\n"+
           " Erp_Observacion01 = @Erp_Observacion01,\n"+
           " Erp_Observacion02 = @Erp_Observacion02,\n"+
           " erp_nom_comercial = @erp_nom_comercial,\n"+
           " erp_zona_1 = @erp_zona_1,\n"+
           " erp_zona_2 = @erp_zona_2,\n"+
           " erp_situacion_1 = @erp_situacion_1,\n"+
           " erp_situacion_2 = @erp_situacion_2,\n"+
           " erp_no_domiciliado_sn = @erp_no_domiciliado_sn,\n"+
           " erp_no_domiciliado_pais = @erp_no_domiciliado_pais,\n"+
           " erp_beneficiario_codigo = @erp_beneficiario_codigo,\n"+
           " erp_vinculacion_economica = @erp_vinculacion_economica,\n"+
           " erpusuario = @erpusuario,\n"+
           " nombreEquipo = @nombreEquipo,\n"+
           " IpEquipo = @IpEquipo,\n"+
           " erp_pc_fechamodificacion = getdate(),\n"+
           " estado_contrib = @estado_contrib,\n"+
           " condicion_contrib = @condicion_contrib,\n"+
           " detraccion = @detraccion \n"+
           " where ccod_empresa = @ccod_empresa and \n"+
           " ccod_proveedor = @ccod_proveedor \n"
          );
          //#endregion
    
          //#region Modificar Forma Pago Provedor
          const eliminar_formas_pagos_proveedor = new mssql.Request(transaction);
          await eliminar_formas_pagos_proveedor
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_proveedor',mssql.VarChar(250),req.body.Codigo)
          .input('tipo',mssql.VarChar(250), '42')
          .query(
            " delete from Hforpag_provee where ccod_empresa = @ccod_empresa and ccod_proveedor = @ccod_proveedor and tipo = @tipo"
          );

          for (let i= 0; i< filas_formas_pago_elegidos.length; i++){
            var fila = filas_formas_pago_elegidos[i];

            const formas_pagos_proveedor  = new mssql.Request(transaction);
            await formas_pagos_proveedor
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('ccod_proveedor',mssql.VarChar(250),req.body.Codigo)
            .input('tipo',mssql.VarChar(250),'42')
            .input('ccod_forpago',mssql.VarChar(250),fila.Codigo)
            .input('selec',mssql.VarChar(250),fila.Predeterminado)
            .input('n_item',mssql.VarChar(250),i+1)
            .query(
            "insert into Hforpag_provee( \n"+
            "ccod_empresa, \n"+
            "ccod_proveedor, \n"+
            "tipo, \n"+
            "ccod_forpago, \n"+
            "selec, \n"+
            "n_item \n"+
            ")values( \n"+
            "@ccod_empresa, \n"+
            "@ccod_proveedor, \n"+
            "@tipo, \n"+
            "@ccod_forpago, \n"+
            "@selec, \n"+
            "@n_item) \n"
            );
          }
          //#endregion

          //#region Modificar Persona Contacto Proveedor
          const eliminar_persona_contacto_proveedor = new mssql.Request(transaction);
          await eliminar_persona_contacto_proveedor
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codproveed',mssql.VarChar(250),req.body.Codigo)
          .query(
            " delete from Hcontacto_proveed where erp_codemp = @erp_codemp and erp_codproveed = @erp_codproveed"
          );

          for (let i= 0; i< filas_personas_contacto.length; i++){
            var fila = filas_personas_contacto[i];
         
            const persona_contacto_proveedor  = new mssql.Request(transaction);
            await persona_contacto_proveedor
            .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
            .input('erp_codproveed',mssql.VarChar(250),req.body.Codigo)
            .input('erp_codcont',mssql.VarChar(250),fila.Codigo)
            .input('erp_nomcont',mssql.VarChar(250),fila.Nombre)
            .input('erp_numdoc',mssql.VarChar(250),fila.Documento)
            .input('erp_cargo',mssql.VarChar(250),fila.Cargo)
            .input('erp_email',mssql.VarChar(250),fila.Email)
            .input('erp_telefono1',mssql.VarChar(250),fila.Telefono1)
            .input('erp_telefono2',mssql.VarChar(250),fila.Telefono2)
            .input('erp_telefono3',mssql.VarChar(250),fila.Telefono3)
            .input('erp_telefono4',mssql.VarChar(250),fila.Telefono4)
            .input('erp_ref',mssql.VarChar(250),fila.Referencia)
            .input('erp_coment1',mssql.VarChar(250),fila.Comentario1)
            .input('erp_coment2',mssql.VarChar(250),fila.Comentario2)
            .input('erp_activo',mssql.VarChar(250),fila.Activo)
            .input('Erp_Predeterminado',mssql.VarChar(250),fila.Predeterminado)
            .input('erp_nro_item',mssql.VarChar(250),i+1)
            .query(
              "INSERT INTO Hcontacto_proveed( \n"+
              "erp_codemp, \n"+
              "erp_codproveed, \n"+
              "erp_codcont, \n"+
              "erp_nomcont, \n"+
              "erp_numdoc, \n"+
              "erp_cargo, \n"+
              "erp_email, \n"+
              "erp_telefono1, \n"+
              "erp_telefono2, \n"+
              "erp_telefono3, \n"+
              "erp_telefono4, \n"+
              "erp_ref, \n"+
              "erp_coment1, \n"+
              "erp_coment2, \n"+
              "erp_activo, \n"+
              "erp_nro_item, \n"+
              "Erp_Predeterminado \n"+
              ")VALUES( \n"+
              "@erp_codemp, \n"+
              "@erp_codproveed, \n"+
              "@erp_codcont, \n"+
              "@erp_nomcont, \n"+
              "@erp_numdoc, \n"+
              "@erp_cargo, \n"+
              "@erp_email, \n"+
              "@erp_telefono1, \n"+
              "@erp_telefono2, \n"+
              "@erp_telefono3, \n"+
              "@erp_telefono4, \n"+
              "@erp_ref, \n"+
              "@erp_coment1, \n"+
              "@erp_coment2, \n"+
              "@erp_activo, \n"+
              "@erp_nro_item,  \n"+
              "@Erp_Predeterminado) \n"
            );
          }
          //#endregion

          //#region Modificar Detraccion Proveedor
          const eliminar_detracciones_proveedor  = new mssql.Request(transaction);
          await eliminar_detracciones_proveedor
          .input('CCOD_EMPRESA',mssql.VarChar(250),req.user.codigo_empresa)
          .input('CCOD_ANEXO',mssql.VarChar(250),req.body.Codigo)
          .input('CTIP_ANEXO',mssql.VarChar(250), '42')
          .query(
            " delete from HDETRAANEXO where CCOD_EMPRESA = @CCOD_EMPRESA and CCOD_ANEXO = @CCOD_ANEXO and CTIP_ANEXO = @CTIP_ANEXO"
          );

          for (let i= 0; i< filas_detracciones_elegidos.length; i++){
            var fila = filas_detracciones_elegidos[i];

            const detracciones_proveedor  = new mssql.Request(transaction);
            await detracciones_proveedor
            .input('CCOD_EMPRESA',mssql.VarChar(250),req.user.codigo_empresa)
            .input('CCOD_ANEXO',mssql.VarChar(250),req.body.Codigo)
            .input('CTIP_ANEXO',mssql.VarChar(250),'42')
            .input('CCOD_DETRACCION',mssql.VarChar(250),fila.Codigo)
            .input('PORCENTAJE',mssql.VarChar(250),'0')
            .input('PREDET',mssql.VarChar(250),fila.Predeterminado)
            .input('SEL',mssql.VarChar(250),'')
            .query(
              "insert into HDETRAANEXO( \n"+
              "CCOD_EMPRESA, \n"+
              "CTIP_ANEXO, \n"+
              "CCOD_ANEXO, \n"+
              "CCOD_DETRACCION, \n"+
              "PORCENTAJE, \n"+
              "PREDET, \n"+
              "SEL \n"+
              ")values( \n"+
              "@CCOD_EMPRESA, \n"+
              "@CTIP_ANEXO, \n"+
              "@CCOD_ANEXO, \n"+
              "@CCOD_DETRACCION, \n"+
              "@PORCENTAJE, \n"+
              "@PREDET, \n"+
              "@SEL) \n"
            );
          }
          //#endregion

          //#region Modificar Lista Agencias Proveedor
          const eliminar_proveedor_lista_agencias  = new mssql.Request(transaction);
          await eliminar_proveedor_lista_agencias
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codane',mssql.VarChar(250),req.body.Codigo)
          .input('erp_codtia',mssql.VarChar(250), '42')
          .query(
            " delete from erp_agencia where erp_codemp = @erp_codemp and erp_codane = @erp_codane and erp_codtia = @erp_codtia"
          );
        
          for (let i= 0; i< filas_proveedor_lista_agencias.length; i++){
            var fila = filas_proveedor_lista_agencias[i];

            const proveedor_lista_agencias  = new mssql.Request(transaction);
            await proveedor_lista_agencias
            .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
            .input('erp_codane',mssql.VarChar(250),req.body.Codigo)
            .input('erp_codage',mssql.VarChar(250),fila.Codigo)
            .input('erp_nomage',mssql.VarChar(250),fila.Nombre)
            .input('erp_codtag',mssql.VarChar(250),fila.Tipo_Agencia)
            .input('erp_dirage',mssql.VarChar(250),fila.Direccion)
            .input('erp_conage',mssql.VarChar(250),fila.Contacto)
            .input('erp_telage',mssql.VarChar(250),fila.Telefono)
            .input('erp_codubi',mssql.VarChar(250),fila.Codigo_Ubigeo)
            .input('erp_codtia',mssql.VarChar(250),'42')
            .query(
              "insert into erp_agencia( \n"+
              "erp_codemp, \n"+
              "erp_codtia, \n"+
              "erp_codane, \n"+
              "erp_codage, \n"+
              "erp_nomage, \n"+
              "erp_codtag, \n"+
              "erp_dirage, \n"+
              "erp_conage, \n"+
              "erp_telage, \n"+
              "erp_codubi \n"+
              ")values( \n"+
              "@erp_codemp, \n"+
              "@erp_codtia, \n"+
              "@erp_codane, \n"+
              "@erp_codage, \n"+
              "@erp_nomage, \n"+
              "@erp_codtag, \n"+
              "@erp_dirage, \n"+
              "@erp_conage, \n"+
              "@erp_telage, \n"+
              "@erp_codubi) \n"
            );
          }
          //#endregion

          //#region Modificar Lista Historial Proveedor
          const eliminar_proveedor_lista_historial  = new mssql.Request(transaction);
          await eliminar_proveedor_lista_historial
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_proveedor',mssql.VarChar(250),req.body.Codigo)
          .query(
            " delete from Hproveed_historial where ccod_empresa = @ccod_empresa and ccod_proveedor = @ccod_proveedor"
          );

          for (let i= 0; i< filas_proveedor_historial.length; i++){
            var fila = filas_proveedor_historial[i];
            console.log(fila);
            const proveedor_lista_historial  = new mssql.Request(transaction);
            await proveedor_lista_historial
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('ccod_proveedor',mssql.VarChar(250),req.body.Codigo)
            .input('ccod_historial',mssql.VarChar(250),i+1)
            .input('Comentario',mssql.VarChar(250),fila.Comentario1)
            .input('Comentario_2',mssql.VarChar(250),fila.Comentario2)
            .input('Comentario_3',mssql.VarChar(250),fila.Comentario3)
            .input('fecha',mssql.VarChar(250),fila.Fecha)
            .input('Configuracion',mssql.VarChar(250),filas_proveedor_historial.length)
            .input('visible',mssql.VarChar(250),fila.Visible)
            .query(
              "insert into Hproveed_historial( \n"+
              "ccod_empresa, \n"+
              "ccod_proveedor, \n"+
              "ccod_historial, \n"+
              "Comentario, \n"+
              "Comentario_2, \n"+
              "Comentario_3, \n"+
              "fecha, \n"+
              "Configuracion, \n"+
              "visible \n"+
              ")values( \n"+
              "@ccod_empresa, \n"+
              "@ccod_proveedor, \n"+
              "@ccod_historial, \n"+
              "@Comentario, \n"+
              "@Comentario_2, \n"+
              "@Comentario_3, \n"+
              "@fecha, \n"+
              "@Configuracion, \n"+
              "@visible) \n"
            );
          }
          //#endregion

          //#region Modificar Lista Retenciones No Domiciliados Proveedor
          const eliminar_proveedor_lista_retencion_no_domicicliados  = new mssql.Request(transaction);
          await eliminar_proveedor_lista_retencion_no_domicicliados
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_anexo',mssql.VarChar(250),req.body.Codigo)
          .input('ctip_anexo',mssql.VarChar(250), '42')
          .query(
            " delete from Hretenanexo where ccod_empresa = @ccod_empresa and ccod_anexo = @ccod_anexo and ctip_anexo = @ctip_anexo"
          );

          for (let i= 0; i< filas_proveedor_lista_retencion_no_domiciliados.length; i++){
            var fila = filas_proveedor_lista_retencion_no_domiciliados[i];

            const proveedor_lista_retencion_no_domicicliados  = new mssql.Request(transaction);
            await proveedor_lista_retencion_no_domicicliados
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('ccod_anexo',mssql.VarChar(250),req.body.Codigo)
            .input('ccod_retencion',mssql.VarChar(250),fila.Codigo)
            .input('porcentaje',mssql.VarChar(250),'0')
            .input('predet',mssql.VarChar(250),fila.Predeterminado)
            .input('sel',mssql.VarChar(250),'')
            .input('ctip_anexo',mssql.VarChar(250),'42')
            .query(
             " insert into Hretenanexo( \n"+
             " ccod_empresa, \n"+
             " ctip_anexo, \n"+
             " ccod_anexo, \n"+
             " ccod_retencion, \n"+
             " porcentaje, \n"+
             " predet, \n"+
             " sel \n"+
             " )values( \n"+
             " @ccod_empresa, \n"+
             " @ctip_anexo, \n"+
             " @ccod_anexo, \n"+
             " @ccod_retencion, \n"+
             " @porcentaje, \n"+
             " @predet, \n"+
             " @sel) \n"
            );
          }
          //#endregion

          //#region Modificar Proveedor Cuentas Corrientes
          const eliminar_proveedor_cuentas_corrientes = new mssql.Request(transaction);
          await eliminar_proveedor_cuentas_corrientes
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_proveedor',mssql.VarChar(250),req.body.Codigo)
          .query(
            " delete from Erp_Ctas_Ctes_Prov where ccod_empresa = @ccod_empresa and ccod_proveedor = @ccod_proveedor"
          );

          for (let i= 0; i< filas_proveedor_cuentas_corrientes.length; i++){
            var fila = filas_proveedor_cuentas_corrientes[i];

            const proveedor_cuentas_corrientes  = new mssql.Request(transaction);
            await proveedor_cuentas_corrientes
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('ccod_proveedor',mssql.VarChar(250),req.body.Codigo)
            .input('cta_cte',mssql.VarChar(250),fila.Cuenta_Corriente)
            .input('ccod_banco',mssql.VarChar(250),fila.Banco)
            .input('moneda',mssql.VarChar(250),fila.Moneda)
            .input('nro_cta_cte',mssql.VarChar(250),fila.Numero_Cta_Cte)
            .input('predeterminado',mssql.VarChar(250),fila.Predeterminado)
            .query(
              "insert into Erp_Ctas_Ctes_Prov( \n"+
              "  ccod_empresa, \n"+
              "  ccod_proveedor, \n"+
              "  cta_cte, \n"+
              "  ccod_banco, \n"+
              "  moneda, \n"+
              "  nro_cta_cte, \n"+
              "  predeterminado \n"+
              "  )values( \n"+
              "  @ccod_empresa, \n"+
              "  @ccod_proveedor, \n"+
              "  @cta_cte, \n"+
              "  @ccod_banco, \n"+
              "  @moneda, \n"+
              "  @nro_cta_cte, \n"+
              "  @predeterminado) \n"
            );
          }
          //#endregion

          //#region Modificar Proveedor Codigos Alternativos
          const eliminar_proveedor_codigos_alternativos  = new mssql.Request(transaction);
          await eliminar_proveedor_codigos_alternativos
          .input('codigo_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('codigo_cliente',mssql.VarChar(250),req.body.Codigo)
          .input('tipo',mssql.VarChar(250), '42')
          .query(
            " delete from hcodigos_alternativos where codigo_empresa = @codigo_empresa and codigo_cliente = @codigo_cliente and tipo = @tipo"
          );


          for (let i= 0; i< filas_proveedor_lista_codigos_alternativos.length; i++){
            var fila = filas_proveedor_lista_codigos_alternativos[i];

            const proveedor_codigos_alternativos  = new mssql.Request(transaction);
            await proveedor_codigos_alternativos
            .input('codigo_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('codigo_cliente',mssql.VarChar(250),req.body.Codigo)
            .input('tipo',mssql.VarChar(250),'42')
            .input('codigo_prducto',mssql.VarChar(250),fila.Codigo_Producto)
            .input('codigo_alternativo',mssql.VarChar(250),fila.Codigo_Alternativo)
            .input('nombre_alternativo',mssql.VarChar(250),fila.Nombre_Alternativo)
            .query(
             "insert into hcodigos_alternativos( \n"+
             "codigo_empresa, \n"+
             "tipo, \n"+
             "codigo_cliente, \n"+
             "codigo_prducto, \n"+
             "codigo_alternativo, \n"+
             "nombre_alternativo \n"+
             ")values( \n"+
             "@codigo_empresa, \n"+
             "@tipo, \n"+
             "@codigo_cliente, \n"+
             "@codigo_prducto, \n"+
             "@codigo_alternativo, \n"+
             "@nombre_alternativo) \n"
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

router.post('/eliminar', async (req, res) => {
  try {

    const usuario = req.user.codigo_usuario;

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{
    
          //#region Eliminar Forma Pago Provedor
          const eliminar_formas_pagos_proveedor = new mssql.Request(transaction);
          await eliminar_formas_pagos_proveedor
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_proveedor',mssql.VarChar(250),req.body.Codigo)
          .input('tipo',mssql.VarChar(250), '42')
          .query(
            " delete from Hforpag_provee where ccod_empresa = @ccod_empresa and ccod_proveedor = @ccod_proveedor and tipo = @tipo"
          );
          //#endregion

          //#region Eliminar Persona Contacto Proveedor
          const eliminar_persona_contacto_proveedor = new mssql.Request(transaction);
          await eliminar_persona_contacto_proveedor
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codproveed',mssql.VarChar(250),req.body.Codigo)
          .query(
            " delete from Hcontacto_proveed where erp_codemp = @erp_codemp and erp_codproveed = @erp_codproveed"
          );
          //#endregion

          //#region Eliminar Detraccion Proveedor
          const eliminar_detracciones_proveedor  = new mssql.Request(transaction);
          await eliminar_detracciones_proveedor
          .input('CCOD_EMPRESA',mssql.VarChar(250),req.user.codigo_empresa)
          .input('CCOD_ANEXO',mssql.VarChar(250),req.body.Codigo)
          .input('CTIP_ANEXO',mssql.VarChar(250), '42')
          .query(
            " delete from HDETRAANEXO where CCOD_EMPRESA = @CCOD_EMPRESA and CCOD_ANEXO = @CCOD_ANEXO and CTIP_ANEXO = @CTIP_ANEXO"
          );
          //#endregion

          //#region Eliminar Lista Agencias Proveedor
          const eliminar_proveedor_lista_agencias  = new mssql.Request(transaction);
          await eliminar_proveedor_lista_agencias
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_codane',mssql.VarChar(250),req.body.Codigo)
          .input('erp_codtia',mssql.VarChar(250), '42')
          .query(
            " delete from erp_agencia where erp_codemp = @erp_codemp and erp_codane = @erp_codane and erp_codtia = @erp_codtia"
          );
          //#endregion

          //#region Eliminar Lista Historial Proveedor
          const eliminar_proveedor_lista_historial  = new mssql.Request(transaction);
          await eliminar_proveedor_lista_historial
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_proveedor',mssql.VarChar(250),req.body.Codigo)
          .query(
            " delete from Hproveed_historial where ccod_empresa = @ccod_empresa and ccod_proveedor = @ccod_proveedor"
          );
          //#endregion

          //#region Eliminar Lista Retenciones No Domiciliados Proveedor
          const eliminar_proveedor_lista_retencion_no_domicicliados  = new mssql.Request(transaction);
          await eliminar_proveedor_lista_retencion_no_domicicliados
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_anexo',mssql.VarChar(250),req.body.Codigo)
          .input('ctip_anexo',mssql.VarChar(250), '42')
          .query(
            " delete from Hretenanexo where ccod_empresa = @ccod_empresa and ccod_anexo = @ccod_anexo and ctip_anexo = @ctip_anexo"
          );
          //#endregion

          //#region Eliminar Proveedor Cuentas Corrientes
          const eliminar_proveedor_cuentas_corrientes = new mssql.Request(transaction);
          await eliminar_proveedor_cuentas_corrientes
          .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_proveedor',mssql.VarChar(250),req.body.Codigo)
          .query(
            " delete from Erp_Ctas_Ctes_Prov where ccod_empresa = @ccod_empresa and ccod_proveedor = @ccod_proveedor"
          );
          //#endregion

          //#region Eliminar Proveedor Codigos Alternativos
          const eliminar_proveedor_codigos_alternativos  = new mssql.Request(transaction);
          await eliminar_proveedor_codigos_alternativos
          .input('codigo_empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('codigo_cliente',mssql.VarChar(250),req.body.Codigo)
          .input('tipo',mssql.VarChar(250), '42')
          .query(
            " delete from hcodigos_alternativos where codigo_empresa = @codigo_empresa and codigo_cliente = @codigo_cliente and tipo = @tipo"
          );
          //#endregion

          //#region Eliminar Proveedor
          const datos_proveedor  = new mssql.Request(transaction);
          await datos_proveedor
          .input('ccod_empresa', mssql.VarChar(250),req.user.codigo_empresa)
          .input('ccod_proveedor', mssql.VarChar(250),req.body.Codigo)
          .query(
           " delete from Hproveed where ccod_empresa = @ccod_empresa and ccod_proveedor = @ccod_proveedor \n"
          );
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

module.exports = router;