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
      .query("Select "+ 
      "Hcliente.ccod_cliente as Codigo, "+ 
      "Hcliente.cnom_cliente as Nombre, "+ 
      "(RTRIM(Htipdociden.ccod_sunatid) + ' - ' + Htipdociden.abvr) as Tipo_Cliente, "+ 
      "Hcliente.ndoc_id as Numero_Doc, "+ 
      "Hcliente.cnum_ruc as Numero_Ruc, "+ 
      "Hcliente.cdireccion as Direccion, "+ 
      "Hcliente.ctelefonos as Telefono, "+ 
      "(RTRIM(Hpais.ccod_pais) + ' - ' + Hpais.cnom_pais) as Pais, "+ 
      "(RTRIM(Hdepto.ccod_departamento) + ' - ' + Hdepto.cnom_departamento) as Departamento, "+ 
      "(RTRIM(Hdistrit.ccod_distrito) + ' - ' + Hdistrit.cnom_distrito) as Distrito, "+ 
      "(RTRIM(Hciudad.ccod_ciudad) + ' - ' + Hciudad.cnom_ciudad)as Ciudad, "+ 
      "ISNULL(Hcliente.erp_observacion01, '') as Observacion1, "+ 
      "ISNULL(Hcliente.erp_observacion02, '') as Observacion2, "+ 
      "isnull(Hcliente.estado, 'Inactivo') as Estado, "+ 
      "Hcliente.codigo_interno as Codigo_Internoo, "+ 
      "Hcliente.erpusuario as Usuario, "+ 
      "Hcliente.NombreEquipo as Pc_user , "+ 
      "Hcliente.FechaEquipo as Pc_Fecha, "+ 
      "Hcliente.IpEquipo as Pc_ip, "+ 
      "Hcliente.erp_pc_fechamodificacion as Fecha_Modidificacion,  "+ 
      "LTRIM(RTRIM(Hpais.ccod_pais)) as Codigo_Pais, "+ 
      "LTRIM(RTRIM(Hdepto.ccod_departamento)) as Codigo_Departamento, "+ 
      "LTRIM(RTRIM(Hdistrit.ccod_distrito)) as Codigo_Distrito, "+ 
      "LTRIM(RTRIM(Hciudad.ccod_ciudad)) as Codigo_Ciudad "+ 
      "From Hcliente with (nolock) "+ 
      "left Join Htipdociden with (nolock)On  "+ 
      "Hcliente.tip_doc = Htipdociden.ccod_tdid "+ 
      "left Join Hpais with (nolock) On  "+ 
      "Hcliente.ccod_empresa=Hpais.ccod_empresa AND  "+ 
      "Hcliente.ccod_pais=Hpais.ccod_pais  "+ 
      "left Join Hdepto with (nolock) On  "+ 
      "Hcliente.ccod_empresa=Hdepto.ccod_empresa AND  "+ 
      "Hcliente.ccod_pais=Hdepto.ccod_pais AND  "+ 
      "Hcliente.ccod_departamento=Hdepto.ccod_departamento  "+ 
      "left Join Hdistrit with (nolock) On  "+ 
      "Hcliente.ccod_empresa=Hdistrit.ccod_empresa AND "+ 
      "Hcliente.ccod_pais=Hdistrit.ccod_pais AND "+ 
      "Hcliente.ccod_departamento=Hdistrit.ccod_departamento AND "+ 
      "Hcliente.cciudad=Hdistrit.ccod_ciudad AND "+ 
      "Hcliente.cdistrito=Hdistrit.ccod_distrito  "+ 
      "left Join Hciudad with (nolock) On  "+ 
      "Hcliente.ccod_empresa=Hciudad.ccod_empresa AND "+ 
      "Hcliente.ccod_pais=Hciudad.ccod_pais AND "+ 
      "Hcliente.ccod_departamento=Hciudad.ccod_departamento AND "+ 
      "Hcliente.cciudad=Hciudad.ccod_ciudad "+
      "where Hcliente.ccod_empresa =@codigo_empresa ");
        
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

router.post('/datos', async (req, res) => {
    try {
      const codigo_empresa = req.user.codigo_empresa
      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .input('codigo_cliente', mssql.VarChar(250), req.body.codigo)
      .query(

        "Select \n"+
        "Hcliente.ccod_cliente as Codigo, \n"+
        "Hcliente.cnom_cliente as Nombre, \n"+
        "Htipdociden.ccod_sunatid as Tipo_documento, \n"+
        "Hcliente.ndoc_id as Numero_Doc, \n"+
        "Hcliente.cnum_ruc as Numero_Ruc, \n"+
        "Hcliente.cnum_dni as Numero_DNI, \n"+
        "Hcliente.cdireccion as Direccion, \n"+
        "Hcliente.ctelefonos as Telefono, \n"+
        "Hcliente.lista_precios as Lista_Precios, \n"+
        "Hcliente.ce_mail as Email, \n"+
        "Hcliente.codigo_interno as Codigo_Interno, \n"+
        "LTRIM(RTRIM(Hcliente.ccod_vendedor)) as Vendedor_codigo, \n"+
        "Hcliente.erp_porcentaje_desc as Porc_descuento, \n"+
        "LTRIM(RTRIM(Hcliente.ccod_pais)) as Codigo_Pais \n"+
        "From Hcliente with (nolock) \n"+
        "inner Join Htipdociden with (nolock) On \n"+
        "Hcliente.tip_doc = Htipdociden.ccod_tdid \n"+
        "where Hcliente.ccod_empresa = @codigo_empresa \n"+
        "and (Hcliente.ccod_cliente = @codigo_cliente \n"+
        "or Hcliente.cnum_ruc = @codigo_cliente \n"+
        "or Hcliente.cnom_cliente = @codigo_cliente) \n"
      );
      const recordset = lista.recordset;
      res.json(recordset); 
    } catch (err) {
      
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
    .query("select \n"+
    "LTRIM(RTRIM(ccod_contacto)) as Codigo, \n"+
    "LTRIM(RTRIM( cnom_contacto)) as Nombre, \n"+
    "cnum_docid as Documento, \n"+
    "Telefono, \n"+
    "erp_cargo as Cargo, \n"+
    "erp_email as Email,\n"+
    "Erp_Predeterminado as Predetermniado\n"+
    "from Hpercontactocli where \n"+
    "ccod_empresa = @codigo_empresa and \n"+
    "ccod_cliente = @codigo_cliente and\n"+
    "erp_activo='1'\n"+
    "order by erp_nro_item");
    
    const recordset = lista.recordset;
    res.json(recordset); 
  } catch (err) {
    
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
    "erp_codage as Codigo,\n"+
    "erp_nomage as Nombre,\n"+
    "erp_codtag as Tipo,\n"+
    "erp_dirage as Direccion,\n"+
    "erp_conage as Contacto,\n"+
    "erp_telage as Telefono,\n"+
    "erp_codubi as Ubigeo\n"+
    "from erp_agencia\n"+
    "WHERE erp_codemp = @codigo_empresa and\n"+
    "erp_codtia = '12' and\n"+
    "erp_codane = @codigo_cliente");
      
    const recordset = lista.recordset;
    res.json(recordset); 
  } catch (err) {
    
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
    "tipo = '12' and\n"+
    "ccod_cliente = @codigo_cliente");
      
    const recordset = lista.recordset;
    res.json(recordset); 
  } catch (err) {
    
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
    .input('codigo_cliente', mssql.VarChar(100), req.body.codigo)
    .query(
      "select \n"+
      "erp_nro_item as Item, \n"+
      "Erp_Predeterminado as Predeterminado, \n"+
      "ccod_contacto as Codigo, \n"+
      "cnom_contacto as Nombre, \n"+
      "cnum_docid as Documento, \n"+
      "erp_cargo as Cargo, \n"+
      "erp_email as Email, \n"+
      "telefono as Telefono1, \n"+
      "erp_telefono2 as Telefono2, \n"+
      "erp_telefono3 as Telefono3, \n"+
      "erp_telefono4 as Telefono4, \n"+
      "erp_ref as Referencia, \n"+
      "comentario_1 as Comentario1, \n"+
      "comentario_2 as Comentario2, \n"+
      "LTRIM(RTRIM(erp_activo)) as Activo \n"+
      "from Hpercontactocli where \n"+
      "ccod_empresa = @codigo_empresa \n"+
      "and ccod_cliente = @codigo_cliente \n"

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
    .input('codigo_cliente', mssql.VarChar(100), req.body.codigo)
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
      "and erp_codane = @codigo_cliente \n"
    );

    const recordset = lista.recordset;
    res.json(recordset);
  } catch (err) {
    console.log(err.message);
    res.send(err.message)
  }
});

router.post('/lista_aval', async (req, res) => {
  try {
    console.log(req.body);
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_cliente', mssql.VarChar(100), req.body.codigo)
    .input('tipo', mssql.VarChar(100), req.body.tipo)
    .query(
      "select \n"+
      "erp_codaval as Codigo, \n"+
      "erp_nomaval as Nombre, \n"+
      "erp_dirava as Direccion, \n"+
      "erp_telaval as Telefono, \n"+
      "erp_codubi as Codigo_Ubigeo, \n"+
      "erp_nomubi as Nombre_Ubigeo \n"+
      "from Erp_aval where \n"+
      "ccod_empresa = @codigo_empresa \n"+
      "and ccod_anexo = @codigo_cliente \n"+
      "and erp_tipo = @tipo \n"
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
    .input('codigo_cliente', mssql.VarChar(100), req.body.codigo)
    .query(
      "SELECT \n"+
      "ccod_historial as Codigo, \n"+
      "Comentario as Comentario1, \n"+
      "Comentario_2 As Comentario2, \n"+
      "Comentario_3 As Comentario3, \n"+
      "fecha as Fecha \n"+
      "FROM hcliente_historial WHERE \n"+
      "ccod_empresa = @codigo_empresa \n"+
      "and ccod_cliente = @codigo_cliente \n"
    );

    const recordset = lista.recordset;
    res.json(recordset);
  } catch (err) {
    console.log(err.message);
    res.send(err.message)
  }
});

router.post('/placas', async (req, res) => {
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
      "placa as Placa, \n"+
      "marca as Marca, \n"+
      "anio_fabricacion as Anio_Fabricacion, \n"+
      "modelo as Modelo, \n"+
      "combustible as Combustible, \n"+
      "carroceria as Carrocería, \n"+
      "color as Color, \n"+
      "n_motor as Numero_Motor, \n"+
      "n_serie as Numero_Serie, \n"+
      "longitud as Longitud, \n"+
      "altura as Altura, \n"+
      "ancho as Ancho, \n"+
      "categoria as Categoría, \n"+
      "anio_modelo as Anio_Modelo, \n"+
      "version as Version, \n"+
      "cilindros as Cilindros, \n"+
      "cilindrada as Cilindrada, \n"+
      "p_bruto as Peso_Bruto, \n"+
      "p_neto as Peso_Neto, \n"+
      "carga_util as Carga_Util \n"+
      "from Hcliente_placas where \n"+
      "ccod_empresa = @codigo_empresa \n"+
      "and tipo = @tipo \n"+
      "and ccod_cliente = @codigo_cliente \n"
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

    const codigo_empresa = req.user.codigo_empresa;
    const codigo_usuario = req.user.codigo_usuario;
    var Listas_Precios = JSON.parse(req.body.Listas_Precios);
    var Lista_forma_pago_elegidos = JSON.parse(req.body.Lista_forma_pago_elegidos);
    var Lista_direcciones_alternativas = JSON.parse(req.body.Lista_direcciones_alternativas);
    var Lista_persona_contacto = JSON.parse(req.body.Lista_persona_contacto);
    var Lista_detracciones_elegidos = JSON.parse(req.body.Lista_detracciones_elegidos);
    var Lista_agencias = JSON.parse(req.body.Lista_agencias);
    var Lista_aval = JSON.parse(req.body.Lista_aval);
    var Lista_historial = JSON.parse(req.body.Lista_historial);
    var Lista_placas = JSON.parse(req.body.Lista_placas);
    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    await transaction.begin(async err => {
        try{
          //#region Insertar Cliente
          const request  = new mssql.Request(transaction);
          await request
          .input('codigo_empresa',mssql.VarChar(250),codigo_empresa)
          .input('codigo',mssql.VarChar(250),req.body.Codigo)
          .input('grupo_cliente',mssql.VarChar(250),req.body.Grupo_clientes)
          .input('tipo_cliente',mssql.VarChar(250),req.body.Tipo_cliente)
          .input('tipo_documento',mssql.VarChar(250),req.body.Tipo_documento_identidad)
          .input('numero_documento',mssql.VarChar(250),req.body.Numero_documento)
          .input('numero_ruc',mssql.VarChar(250),req.body.Numero_ruc)
          .input('numero_dni',mssql.VarChar(250),req.body.Numero_dni)
          .input('codigo_interno',mssql.VarChar(250),req.body.Codigo_interno)
          .input('nombre',mssql.VarChar(250),req.body.Nombre)
          .input('fax',mssql.VarChar(250),req.body.Fax)
          .input('correo',mssql.VarChar(250),req.body.Correo)
          .input('codigo_pais',mssql.VarChar(250),req.body.Pais)
          .input('codigo_departamento',mssql.VarChar(250),req.body.Departamento)
          .input('codigo_distrito',mssql.VarChar(250),req.body.Distrito)
          .input('codigo_ciudad',mssql.VarChar(250),req.body.Ciudad)
          .input('codigo_vendedor',mssql.VarChar(250),req.body.Vendedor)
          .input('lista_precios_predeterminado',mssql.VarChar(250),'01')
          .input('descuento',mssql.VarChar(250),'01')
          .input('linea_credito_mn',mssql.Decimal(18,2),req.body.Credito_mn)
          .input('linea_credito_me',mssql.Decimal(18,2),req.body.Credito_me)
          .input('percepcion_sn',mssql.VarChar(250),req.body.Percepcion)
          .input('porcentaje_percepcion',mssql.Decimal(18,2),req.body.Percepcion_porcentaje)
          .input('retencion',mssql.VarChar(250),req.body.Retencion)
          .input('porcentaje_retencion',mssql.Decimal(18,2),req.body.Retencion_porcentaje)
          .input('buen_contribuyente',mssql.VarChar(250),req.body.Buen_contribuyente)
          .input('excluye_percepcion',mssql.VarChar(250),req.body.Excluye_percepcion)
          .input('direccion',mssql.VarChar(250),req.body.Direccion)
          .input('codigo_rubro',mssql.VarChar(250),req.body.Rubro)
          .input('codigo_modificable',mssql.VarChar(250),req.body.Editar)
          .input('telefono1',mssql.VarChar(250),req.body.Telefono1)
          .input('telefono2',mssql.VarChar(250),req.body.Telefono2)
          .input('telefono3',mssql.VarChar(250),req.body.Telefono3)
          .input('telefono4',mssql.VarChar(250),req.body.Telefono4)
          .input('bonificacion',mssql.VarChar(250),req.body.Bonificacion)
          .input('nombre_comercial',mssql.VarChar(250),req.body.Nombre_comercial)
          .input('observacion1',mssql.VarChar(250),req.body.Leyenda1)
          .input('observacion2',mssql.VarChar(250),req.body.Leyenda2)
          .input('porcentaje_descuento',mssql.Decimal(18,2),req.body.Porcentaje_descuento)
          .input('codigo_zona1',mssql.VarChar(250),req.body.Zona1)
          .input('codigo_zona2',mssql.VarChar(250),req.body.Zona2)
          .input('codigo_situacion1',mssql.VarChar(250),req.body.Situacion1)
          .input('codigo_situacion2',mssql.VarChar(250),req.body.Situacion2)
          .input('codigo_gestor',mssql.VarChar(250),req.body.Gestor)
          .input('estado',mssql.VarChar(250),req.body.Estado)
          .input('nombres',mssql.VarChar(250),'')
          .input('apellidos_paternos',mssql.VarChar(250),'')
          .input('apellidos_maternos',mssql.VarChar(250),'')
          .input('usuario',mssql.VarChar(250),codigo_usuario)
          .input('nombreEquipo',mssql.VarChar(250),'')
          .input('ipEquipo',mssql.VarChar(250),'')
          .input('estado_contribuyente',mssql.VarChar(250),req.body.Estado_contribuyente)
          .input('condicion_contribuyente',mssql.VarChar(250),req.body.Buen_contribuyente)
          .input('copymail',mssql.VarChar(250),req.body.Copy_mail)
          .input('controlar_linea',mssql.VarChar(250),req.body.Controlar_linea)
          .input('exonerado_sn',mssql.VarChar(250),req.body.Exonerado)
          .query(
            "insert into hcliente ( \n"+
              "ccod_empresa, \n"+
              "ccod_cliente, \n"+
              "cgrupo_cliente, \n"+
              "tipo_cliente, \n"+
              "tip_doc, \n"+
              "ndoc_id, \n"+
              "cnum_ruc, \n"+
              "cnum_dni, \n"+
              "codigo_interno, \n"+
              "cnom_cliente, \n"+
              "cfax, \n"+
              "ce_mail, \n"+
              "ccod_pais, \n"+
              "ccod_departamento, \n"+
              "cdistrito, \n"+
              "cciudad, \n"+
              "ccod_vendedor, \n"+
              "lista_precios, \n"+
              "descuento, \n"+
              "nlinea_credito_mn, \n"+
              "nlinea_credito_me, \n"+
              "pc_sn, \n"+
              "porc_percep, \n"+
              "retencion, \n"+
              "porc_reten, \n"+
              "buen_contri, \n"+
              "excluye_percepcion, \n"+
              "cdireccion, \n"+
              "erp_codrubro, \n"+
              "erp_modmov, \n"+
              "ctelefonos, \n"+
              "telefono_2, \n"+
              "telefono_3, \n"+
              "telefono_4, \n"+
              "bonificacion, \n"+
              "nombre_comercial, \n"+
              "Erp_Observacion01, \n"+
              "Erp_Observacion02, \n"+
              "erp_porcentaje_desc, \n"+
              "ccod_zona, \n"+
              "erp_zona_2, \n"+
              "situacion, \n"+
              "erp_situacion_2, \n"+
              "erp_gestor, \n"+
              "estado, \n"+
              "erp_nombres, \n"+
              "erp_apepat, \n"+
              "erp_apemat, \n"+
              "erpusuario, \n"+
              "NombreEquipo, \n"+
              "FechaEquipo, \n"+
              "IpEquipo, \n"+
              "erp_pc_fechamodificacion, \n"+
              "estado_contrib, \n"+
              "condicion_contrib, \n"+
              "copymail, \n"+
              "controlar_linea, \n"+
              "erp_export_sn \n"+
              ") values ( \n"+
              "@codigo_empresa, \n"+
              "@codigo, \n"+
              "@grupo_cliente, \n"+
              "@tipo_cliente, \n"+
              "@tipo_documento, \n"+
              "@numero_documento, \n"+
              "@numero_ruc, \n"+
              "@numero_dni, \n"+
              "@codigo_interno, \n"+
              "@nombre, \n"+
              "@fax, \n"+
              "@correo, \n"+
              "@codigo_pais, \n"+
              "@codigo_departamento, \n"+
              "@codigo_distrito, \n"+
              "@codigo_ciudad, \n"+
              "@codigo_vendedor, \n"+
              "@lista_precios_predeterminado, \n"+
              "@descuento, \n"+
              "@linea_credito_mn, \n"+
              "@linea_credito_me, \n"+
              "@percepcion_sn, \n"+
              "@porcentaje_percepcion, \n"+
              "@retencion, \n"+
              "@porcentaje_retencion, \n"+
              "@buen_contribuyente, \n"+
              "@excluye_percepcion, \n"+
              "@direccion, \n"+
              "@codigo_rubro, \n"+
              "@codigo_modificable, \n"+
              "@telefono1, \n"+
              "@telefono2, \n"+
              "@telefono3, \n"+
              "@telefono4, \n"+
              "@bonificacion, \n"+
              "@nombre_comercial, \n"+
              "@observacion1, \n"+
              "@observacion2, \n"+
              "@porcentaje_descuento, \n"+
              "@codigo_zona1, \n"+
              "@codigo_zona2, \n"+
              "@codigo_situacion1, \n"+
              "@codigo_situacion2, \n"+
              "@codigo_gestor, \n"+
              "@estado, \n"+
              "@nombres, \n"+
              "@apellidos_paternos, \n"+
              "@apellidos_maternos, \n"+
              "@usuario, \n"+
              "@nombreEquipo, \n"+
              "getdate(), \n"+
              "@ipEquipo, \n"+
              "getdate(), \n"+
              "@estado_contribuyente, \n"+
              "@condicion_contribuyente, \n"+
              "@copymail, \n"+
              "@controlar_linea, \n"+
              "@exonerado_sn  \n"+
            ") \n"
          );
          //#endregion
          
          //#region Insertar Lista Precios de Cliente
          const eliminar_precios  = new mssql.Request(transaction);
          await eliminar_precios
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from Erp_clientes_Lista_Precios where\n"+
            "erp_codemp = @Codigo_Empresa and \n"+
            "erp_codclie = @Codigo and \n"+
            "erp_tipo = '12' \n"
          );
          
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
              "insert into Erp_clientes_Lista_Precios \n"+
              "( \n"+
              "erp_codemp, \n"+
              "erp_codclie, \n"+
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
          //#endregion

          //#region Insertar Forma Pago
          const eliminar_forma_pago  = new mssql.Request(transaction);
          await eliminar_forma_pago
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from hforpag_provee where\n"+
            "ccod_empresa = @Codigo_Empresa and \n"+
            "ccod_proveedor = @Codigo and \n"+
            "tipo = '12' \n"
          );
          
          for (let i= 0; i< Lista_forma_pago_elegidos.length; i++){

            var fila = Lista_forma_pago_elegidos[i];
            const request_forma_pago  = new mssql.Request(transaction);
            await request_forma_pago
            .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Codigo',mssql.VarChar(250),req.body.Codigo)
            .input('Tipo',mssql.VarChar(250),'12')
            .input('Forma_Pago',mssql.VarChar(250),fila.Codigo)
            .input('Predeterminado',mssql.VarChar(250),fila.Predeterminado)
            .input('Item',mssql.VarChar(250),(i + 1))
            .query(
              "insert into hforpag_provee \n"+
              "( \n"+
              "ccod_empresa, \n"+
              "ccod_proveedor, \n"+
              "tipo, \n"+
              "ccod_forpago, \n"+
              "selec, \n"+
              "n_item \n"+
              ") \n"+
              "values \n"+
              "( \n"+
              "@Codigo_Empresa, \n"+
              "@Codigo, \n"+
              "@Tipo, \n"+
              "@Forma_Pago, \n"+
              "@Predeterminado, \n"+
              "@Item \n"+
              ") \n"
            );
          }
          //#endregion

          //#region Insertar Direcciones Alternativas
          const eliminar_direcciones_alternativas  = new mssql.Request(transaction);
          await eliminar_direcciones_alternativas
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from Hcliente_ptolle where\n"+
            "ccod_empresa = @Codigo_Empresa and \n"+
            "ccod_cliente = @Codigo and \n"+
            "tipo = '12' \n"
          );
          
          for (let i= 0; i< Lista_direcciones_alternativas.length; i++){

            var fila = Lista_direcciones_alternativas[i];
            const request_direcciones_alternativas  = new mssql.Request(transaction);
            await request_direcciones_alternativas
            .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Tipo',mssql.VarChar(250),'12')
            .input('Codigo',mssql.VarChar(250),req.body.Codigo)
            .input('Item',mssql.VarChar(250),(i + 1))
            .input('Direccion',mssql.VarChar(250),fila.Direccion)
            .input('Ubigeo',mssql.VarChar(250),fila.Ubigeo)
            .query(
              "insert into Hcliente_ptolle \n"+
              "( \n"+
              "ccod_empresa, \n"+
              "tipo, \n"+
              "ccod_cliente, \n"+
              "n_item, \n"+
              "cdirecciong, \n"+
              "ubigeo, \n"+
              "via_tipo, \n"+
              "via_nombre, \n"+
              "numero, \n"+
              "interior, \n"+
              "zona, \n"+
              "distrito, \n"+
              "provincia, \n"+
              "departamento, \n"+
              "erp_observacion \n"+
              ") \n"+
              "values \n"+
              "( \n"+
              "@Codigo_Empresa, \n"+
              "@Tipo, \n"+
              "@Codigo, \n"+
              "@Item, \n"+
              "@Direccion, \n"+
              "@Ubigeo, \n"+
              "'', \n"+
              "'', \n"+
              "'', \n"+
              "'', \n"+
              "'', \n"+
              "'', \n"+
              "'', \n"+
              "'', \n"+
              "'' \n"+
              ") \n"
            );
          }
          //#endregion

          //#region Insertar Persona de Contacto
          const eliminar_persona_contacto  = new mssql.Request(transaction);
          await eliminar_persona_contacto
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from Hpercontactocli where\n"+
            "ccod_empresa = @Codigo_Empresa and \n"+
            "ccod_cliente = @Codigo \n"
          );
          
          for (let i= 0; i< Lista_persona_contacto.length; i++){

            var fila = Lista_persona_contacto[i];
            const request_direcciones_alternativas  = new mssql.Request(transaction);
            await request_direcciones_alternativas
            .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Codigo',mssql.VarChar(250),req.body.Codigo)
            .input('Codigo_Contacto',mssql.VarChar(250),fila.Codigo)
            .input('Nombre',mssql.VarChar(250),fila.Nombre)
            .input('Numero_Documento',mssql.VarChar(250),fila.Documento)
            .input('Telefono',mssql.VarChar(250),fila.Telefono1)
            .input('Cargo',mssql.VarChar(250),fila.Cargo)
            .input('Email',mssql.VarChar(250),fila.Email)
            .input('Telefono2',mssql.VarChar(250),fila.Telefono2)
            .input('Telefono3',mssql.VarChar(250),fila.Telefono3)
            .input('Telefono4',mssql.VarChar(250),fila.Telefono4)
            .input('Referencia',mssql.VarChar(250),fila.Referencia)
            .input('Comentario1',mssql.VarChar(250),fila.Comentario1)
            .input('Comentario2',mssql.VarChar(250),fila.Comentario2)
            .input('Activo',mssql.VarChar(250),fila.Activo)
            .input('Item',mssql.VarChar(250), (i + 1))
            .input('Predeterminado',mssql.VarChar(250),fila.Predeterminado)
            .query(
              "insert into Hpercontactocli \n"+
              "( \n"+
              "ccod_empresa, \n"+
              "ccod_cliente, \n"+
              "ccod_contacto, \n"+
              "cnom_contacto, \n"+
              "cnum_docid, \n"+
              "telefono, \n"+
              "erp_cargo, \n"+
              "erp_email, \n"+
              "erp_telefono2, \n"+
              "erp_telefono3, \n"+
              "erp_telefono4, \n"+
              "erp_ref, \n"+
              "comentario_1, \n"+
              "comentario_2, \n"+
              "erp_activo, \n"+
              "erp_nro_item, \n"+
              "Erp_Predeterminado \n"+
              ") \n"+
              "values \n"+
              "( \n"+
              "@Codigo_Empresa, \n"+
              "@Codigo, \n"+
              "@Codigo_Contacto, \n"+
              "@Nombre, \n"+
              "@Numero_Documento, \n"+
              "@Telefono, \n"+
              "@Cargo, \n"+
              "@Email, \n"+
              "@Telefono2, \n"+
              "@Telefono3, \n"+
              "@Telefono4, \n"+
              "@Referencia, \n"+
              "@Comentario1, \n"+
              "@Comentario2, \n"+
              "@Activo, \n"+
              "@Item, \n"+
              "@Predeterminado \n"+
              ") \n"
            );
          }
          //#endregion

          //#region Insertar Detracciones
          const eliminar_detracciones  = new mssql.Request(transaction);
          await eliminar_detracciones
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from Hdetraanexo where\n"+
            "ccod_empresa = @Codigo_Empresa and \n"+
            "ccod_anexo = @Codigo and \n"+
            "ctip_anexo = '12' \n"
          );
          
          for (let i= 0; i< Lista_detracciones_elegidos.length; i++){

            var fila = Lista_detracciones_elegidos[i];
            const request_direcciones_alternativas  = new mssql.Request(transaction);
            await request_direcciones_alternativas
            .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Tipo',mssql.VarChar(250),'12')
            .input('Codigo',mssql.VarChar(250),req.body.Codigo)
            .input('Codigo_Detraccion',mssql.VarChar(250),fila.Codigo)
            .input('Porcentaje',mssql.VarChar(250),'0')
            .input('Predeterminado',mssql.VarChar(250),fila.Predeterminado)
            .query(
              "insert into Hdetraanexo \n"+
              "( \n"+
              "ccod_empresa, \n"+
              "CTIP_ANEXO, \n"+
              "CCOD_ANEXO, \n"+
              "CCOD_DETRACCION, \n"+
              "PORCENTAJE, \n"+
              "PREDET \n"+
              ") \n"+
              "values \n"+
              "( \n"+
              "@Codigo_Empresa, \n"+
              "@Tipo, \n"+
              "@Codigo, \n"+
              "@Codigo_Detraccion, \n"+
              "@Porcentaje, \n"+
              "@Predeterminado \n"+
              ") \n"
            );
          }
          //#endregion

          //#region Insertar Agencias
          const eliminar_agencias  = new mssql.Request(transaction);
          await eliminar_agencias
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from erp_agencia where\n"+
            "erp_codemp = @Codigo_Empresa and \n"+
            "erp_codane = @Codigo and \n"+
            "erp_codtia = '12' \n"
          );
          
          for (let i= 0; i< Lista_agencias.length; i++){

            var fila = Lista_agencias[i];
            const request_direcciones_alternativas  = new mssql.Request(transaction);
            await request_direcciones_alternativas
            .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Tipo',mssql.VarChar(250),'12')
            .input('Codigo',mssql.VarChar(250),req.body.Codigo)
            .input('Codigo_Agencia',mssql.VarChar(250),fila.Codigo)
            .input('Nombre_Agencia',mssql.VarChar(250),fila.Nombre)
            .input('Codigo_Tipo_Agencia',mssql.VarChar(250),fila.Tipo_Agencia)
            .input('Direccion',mssql.VarChar(250),fila.Direccion)
            .input('Contacto',mssql.VarChar(250),fila.Contacto)
            .input('Telefono',mssql.VarChar(250),fila.Telefono)
            .input('Ubigeo',mssql.VarChar(250),fila.Codigo_Ubigeo)
            .query(
              "insert into erp_agencia \n"+
              "( \n"+
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
              ") \n"+
              "values \n"+
              "( \n"+
              "@Codigo_Empresa, \n"+
              "@Tipo, \n"+
              "@Codigo, \n"+
              "@Codigo_Agencia, \n"+
              "@Nombre_Agencia, \n"+
              "@Codigo_Tipo_Agencia, \n"+
              "@Direccion, \n"+
              "@Contacto, \n"+
              "@Telefono, \n"+
              "@Ubigeo \n"+
              ") \n"
            );
          }
          //#endregion

          //#region Insertar Aval
          const eliminar_aval  = new mssql.Request(transaction);
          await eliminar_aval
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from Erp_aval where\n"+
            "ccod_empresa = @Codigo_Empresa and \n"+
            "ccod_anexo = @Codigo and \n"+
            "erp_tipo = '12' \n"
          );
          
          for (let i= 0; i< Lista_aval.length; i++){

            var fila = Lista_aval[i];
            const request_direcciones_alternativas  = new mssql.Request(transaction);
            await request_direcciones_alternativas
            .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Codigo',mssql.VarChar(250),req.body.Codigo)
            .input('Tipo',mssql.VarChar(250),'12')
            .input('Codigo_Aval',mssql.VarChar(250),fila.Codigo)
            .input('Nombre',mssql.VarChar(250),fila.Nombre)
            .input('Direccion',mssql.VarChar(250),fila.Direccion)
            .input('Telefono',mssql.VarChar(250),fila.Telefono)
            .input('Codigo_Ubigeo',mssql.VarChar(250),fila.Codigo_Ubigeo)
            .input('Ubigeo',mssql.VarChar(250),fila.Nombre_Ubigeo)
            .query(
              "insert into Erp_aval \n"+
              "( \n"+
              "ccod_empresa, \n"+
              "ccod_anexo, \n"+
              "erp_tipo, \n"+
              "erp_codaval, \n"+
              "erp_nomaval, \n"+
              "erp_dirava, \n"+
              "erp_telaval, \n"+
              "erp_codubi, \n"+
              "erp_nomubi \n"+
              ") \n"+
              "values \n"+
              "( \n"+
              "@Codigo_Empresa, \n"+
              "@Codigo, \n"+
              "@Tipo, \n"+
              "@Codigo_Aval, \n"+
              "@Nombre, \n"+
              "@Direccion, \n"+
              "@Telefono, \n"+
              "@Codigo_Ubigeo, \n"+
              "@Ubigeo \n"+
              ") \n"
            );
          }
          //#endregion

          //#region Insertar Historial
          const eliminar_historial  = new mssql.Request(transaction);
          await eliminar_historial
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from hcliente_historial where\n"+
            "ccod_empresa = @Codigo_Empresa and \n"+
            "ccod_cliente = @Codigo  \n"
          );
          
          for (let i= 0; i< Lista_historial.length; i++){

            var fila = Lista_historial[i];
            const request_direcciones_alternativas  = new mssql.Request(transaction);
            await request_direcciones_alternativas
            .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Codigo',mssql.VarChar(250),req.body.Codigo)
            .input('Codigo_Historial',mssql.VarChar(250),(i+1))
            .input('Comentario',mssql.VarChar(250),fila.Comentario1)
            .input('Visible',mssql.VarChar(250),fila.Visible)
            .input('Comentario_2',mssql.VarChar(250),fila.Comentario2)
            .input('Comentario_3',mssql.VarChar(250),fila.Comentario3)
            .query(
              "insert into hcliente_historial \n"+
              "( \n"+
              "ccod_empresa, \n"+
              "ccod_cliente, \n"+
              "ccod_historial, \n"+
              "Comentario, \n"+
              "fecha, \n"+
              "Configuracion, \n"+
              "visible, \n"+
              "Comentario_2, \n"+
              "Comentario_3 \n"+
              ") \n"+
              "values \n"+
              "( \n"+
              "@Codigo_Empresa, \n"+
              "@Codigo, \n"+
              "@Codigo_Historial, \n"+
              "@Comentario, \n"+
              "getdate(), \n"+
              "'1', \n"+
              "@visible, \n"+
              "@Comentario_2, \n"+
              "@Comentario_3 \n"+
              ") \n"
            );
          }
          //#endregion

          //#region Insertar Placas
          const eliminar_placas  = new mssql.Request(transaction);
          await eliminar_placas
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from Hcliente_placas where\n"+
            "ccod_empresa = @Codigo_Empresa and \n"+
            "ccod_cliente = @Codigo and \n"+
            "tipo = '12' \n"
          );
          
          for (let i= 0; i< Lista_placas.length; i++){

            var fila = Lista_placas[i];
            const request_direcciones_alternativas  = new mssql.Request(transaction);
            await request_direcciones_alternativas
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('tipo',mssql.VarChar(250),'12')
            .input('ccod_cliente',mssql.VarChar(250),req.body.Codigo)
            .input('n_item',mssql.VarChar(250),(i + 1))
            .input('placa',mssql.VarChar(250),fila.Placa)
            .input('marca',mssql.VarChar(250),fila.Marca)
            .input('anio_fabricacion',mssql.VarChar(250),fila.Anio_Fabricacion)
            .input('modelo',mssql.VarChar(250),fila.Modelo)
            .input('combustible',mssql.VarChar(250),fila.Combustible)
            .input('carroceria',mssql.VarChar(250),fila.Carrocería)
            .input('color',mssql.VarChar(250),fila.Color)
            .input('n_motor',mssql.VarChar(250),fila.Numero_Motor)
            .input('n_serie',mssql.VarChar(250),fila.Numero_Serie)
            .input('longitud',mssql.VarChar(250),fila.Longitud)
            .input('altura',mssql.VarChar(250),fila.Altura)
            .input('ancho',mssql.VarChar(250),fila.Ancho)
            .input('categoria',mssql.VarChar(250),fila.Categoría)
            .input('anio_modelo',mssql.VarChar(250),fila.Anio_Modelo)
            .input('version',mssql.VarChar(250),fila.Version)
            .input('cilindros',mssql.VarChar(250),fila.Cilindros)
            .input('cilindrada',mssql.VarChar(250),fila.Cilindrada)
            .input('p_bruto',mssql.VarChar(250),fila.Peso_Bruto)
            .input('p_neto',mssql.VarChar(250),fila.Peso_Neto)
            .input('carga_util',mssql.VarChar(250),fila.Carga_Util)
            .query(
              "insert into Hcliente_placas \n"+
              "( \n"+
              "ccod_empresa, \n"+
              "tipo, \n"+
              "ccod_cliente, \n"+
              "n_item, \n"+
              "placa, \n"+
              "marca, \n"+
              "anio_fabricacion, \n"+
              "modelo, \n"+
              "combustible, \n"+
              "carroceria, \n"+
              "color, \n"+
              "n_motor, \n"+
              "n_serie, \n"+
              "longitud, \n"+
              "altura, \n"+
              "ancho, \n"+
              "categoria, \n"+
              "anio_modelo, \n"+
              "version, \n"+
              "cilindros, \n"+
              "cilindrada, \n"+
              "p_bruto, \n"+
              "p_neto, \n"+
              "carga_util \n"+
              ") \n"+
              "values \n"+
              "( \n"+
              "@ccod_empresa, \n"+
              "@tipo, \n"+
              "@ccod_cliente, \n"+
              "@n_item, \n"+
              "@placa, \n"+
              "@marca, \n"+
              "@anio_fabricacion, \n"+
              "@modelo, \n"+
              "@combustible, \n"+
              "@carroceria, \n"+
              "@color, \n"+
              "@n_motor, \n"+
              "@n_serie, \n"+
              "@longitud, \n"+
              "@altura, \n"+
              "@ancho, \n"+
              "@categoria, \n"+
              "@anio_modelo, \n"+
              "@version, \n"+
              "@cilindros, \n"+
              "@cilindrada, \n"+
              "@p_bruto, \n"+
              "@p_neto, \n"+
              "@carga_util \n"+
              ") \n"
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

    const codigo_empresa = req.user.codigo_empresa;
    const codigo_usuario = req.user.codigo_usuario;
    var Listas_Precios = JSON.parse(req.body.Listas_Precios);
    var Lista_forma_pago_elegidos = JSON.parse(req.body.Lista_forma_pago_elegidos);
    var Lista_direcciones_alternativas = JSON.parse(req.body.Lista_direcciones_alternativas);
    var Lista_persona_contacto = JSON.parse(req.body.Lista_persona_contacto);
    var Lista_detracciones_elegidos = JSON.parse(req.body.Lista_detracciones_elegidos);
    var Lista_agencias = JSON.parse(req.body.Lista_agencias);
    var Lista_aval = JSON.parse(req.body.Lista_aval);
    var Lista_historial = JSON.parse(req.body.Lista_historial);
    var Lista_placas = JSON.parse(req.body.Lista_placas);
    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{
          //#region Insertar Cliente
          const request  = new mssql.Request(transaction);
          await request
          .input('codigo_empresa',mssql.VarChar(250),codigo_empresa)
          .input('codigo',mssql.VarChar(250),req.body.Codigo)
          .input('grupo_cliente',mssql.VarChar(250),req.body.Grupo_clientes)
          .input('tipo_cliente',mssql.VarChar(250),req.body.Tipo_cliente)
          .input('tipo_documento',mssql.VarChar(250),req.body.Tipo_documento_identidad)
          .input('numero_documento',mssql.VarChar(250),req.body.Numero_documento)
          .input('numero_ruc',mssql.VarChar(250),req.body.Numero_ruc)
          .input('numero_dni',mssql.VarChar(250),req.body.Numero_dni)
          .input('codigo_interno',mssql.VarChar(250),req.body.Codigo_interno)
          .input('nombre',mssql.VarChar(250),req.body.Nombre)
          .input('fax',mssql.VarChar(250),req.body.Fax)
          .input('correo',mssql.VarChar(250),req.body.Correo)
          .input('codigo_pais',mssql.VarChar(250),req.body.Pais)
          .input('codigo_departamento',mssql.VarChar(250),req.body.Departamento)
          .input('codigo_distrito',mssql.VarChar(250),req.body.Distrito)
          .input('codigo_ciudad',mssql.VarChar(250),req.body.Ciudad)
          .input('codigo_vendedor',mssql.VarChar(250),req.body.Vendedor)
          .input('lista_precios_predeterminado',mssql.VarChar(250),'01')
          .input('descuento',mssql.VarChar(250),'01')
          .input('linea_credito_mn',mssql.Decimal(18,2),req.body.Credito_mn)
          .input('linea_credito_me',mssql.Decimal(18,2),req.body.Credito_me)
          .input('percepcion_sn',mssql.VarChar(250),req.body.Percepcion)
          .input('porcentaje_percepcion',mssql.Decimal(18,2),req.body.Percepcion_porcentaje)
          .input('retencion',mssql.VarChar(250),req.body.Retencion)
          .input('porcentaje_retencion',mssql.Decimal(18,2),req.body.Retencion_porcentaje)
          .input('buen_contribuyente',mssql.VarChar(250),req.body.Buen_contribuyente)
          .input('excluye_percepcion',mssql.VarChar(250),req.body.Excluye_percepcion)
          .input('direccion',mssql.VarChar(250),req.body.Direccion)
          .input('codigo_rubro',mssql.VarChar(250),req.body.Rubro)
          .input('codigo_modificable',mssql.VarChar(250),req.body.Editar)
          .input('telefono1',mssql.VarChar(250),req.body.Telefono1)
          .input('telefono2',mssql.VarChar(250),req.body.Telefono2)
          .input('telefono3',mssql.VarChar(250),req.body.Telefono3)
          .input('telefono4',mssql.VarChar(250),req.body.Telefono4)
          .input('bonificacion',mssql.VarChar(250),req.body.Bonificacion)
          .input('nombre_comercial',mssql.VarChar(250),req.body.Nombre_comercial)
          .input('observacion1',mssql.VarChar(250),req.body.Leyenda1)
          .input('observacion2',mssql.VarChar(250),req.body.Leyenda2)
          .input('porcentaje_descuento',mssql.Decimal(18,2),req.body.Porcentaje_descuento)
          .input('codigo_zona1',mssql.VarChar(250),req.body.Zona1)
          .input('codigo_zona2',mssql.VarChar(250),req.body.Zona2)
          .input('codigo_situacion1',mssql.VarChar(250),req.body.Situacion1)
          .input('codigo_situacion2',mssql.VarChar(250),req.body.Situacion2)
          .input('codigo_gestor',mssql.VarChar(250),req.body.Gestor)
          .input('estado',mssql.VarChar(250),req.body.Estado)
          .input('nombres',mssql.VarChar(250),'')
          .input('apellidos_paternos',mssql.VarChar(250),'')
          .input('apellidos_maternos',mssql.VarChar(250),'')
          .input('usuario',mssql.VarChar(250),codigo_usuario)
          .input('nombreEquipo',mssql.VarChar(250),'')
          .input('ipEquipo',mssql.VarChar(250),'')
          .input('estado_contribuyente',mssql.VarChar(250),req.body.Estado_contribuyente)
          .input('condicion_contribuyente',mssql.VarChar(250),req.body.Buen_contribuyente)
          .input('copymail',mssql.VarChar(250),req.body.Copy_mail)
          .input('controlar_linea',mssql.VarChar(250),req.body.Controlar_linea)
          .input('exonerado_sn',mssql.VarChar(250),req.body.Exonerado)
          .query(
            "update hcliente set \n"+
              "cgrupo_cliente = @grupo_cliente, \n"+
              "tipo_cliente = @tipo_cliente, \n"+
              "tip_doc = @tipo_documento, \n"+
              "ndoc_id = @numero_documento, \n"+
              "cnum_ruc = @numero_ruc, \n"+
              "cnum_dni = @numero_dni, \n"+
              "codigo_interno = @codigo_interno, \n"+
              "cnom_cliente = @nombre, \n"+
              "cfax = @fax, \n"+
              "ce_mail = @correo, \n"+
              "ccod_pais = @codigo_pais, \n"+
              "ccod_departamento = @codigo_departamento, \n"+
              "cdistrito = @codigo_distrito, \n"+
              "cciudad = @codigo_ciudad, \n"+
              "ccod_vendedor = @codigo_vendedor, \n"+
              "lista_precios = @lista_precios_predeterminado, \n"+
              "descuento = @descuento, \n"+
              "nlinea_credito_mn = @linea_credito_mn, \n"+
              "nlinea_credito_me = @linea_credito_me, \n"+
              "pc_sn = @percepcion_sn, \n"+
              "porc_percep = @porcentaje_percepcion, \n"+
              "retencion = @retencion, \n"+
              "porc_reten = @porcentaje_retencion, \n"+
              "buen_contri = @buen_contribuyente, \n"+
              "excluye_percepcion = @excluye_percepcion, \n"+
              "cdireccion = @direccion, \n"+
              "erp_codrubro = @codigo_rubro, \n"+
              "erp_modmov = @codigo_modificable, \n"+
              "ctelefonos = @telefono1, \n"+
              "telefono_2 = @telefono2, \n"+
              "telefono_3 = @telefono3, \n"+
              "telefono_4 = @telefono4, \n"+
              "bonificacion = @bonificacion, \n"+
              "nombre_comercial = @nombre_comercial, \n"+
              "Erp_Observacion01 = @observacion1, \n"+
              "Erp_Observacion02 = @observacion2, \n"+
              "erp_porcentaje_desc = @porcentaje_descuento, \n"+
              "ccod_zona = @codigo_zona1, \n"+
              "erp_zona_2 = @codigo_zona2, \n"+
              "situacion = @codigo_situacion1, \n"+
              "erp_situacion_2 = @codigo_situacion2, \n"+
              "erp_gestor = @codigo_gestor, \n"+
              "estado = @estado, \n"+
              "erp_nombres = @nombres, \n"+
              "erp_apepat = @apellidos_paternos, \n"+
              "erp_apemat = @apellidos_maternos, \n"+
              "erpusuario = @usuario, \n"+
              "NombreEquipo = @nombreEquipo, \n"+
              "IpEquipo = @ipEquipo, \n"+
              "erp_pc_fechamodificacion = getdate(), \n"+
              "estado_contrib = @estado_contribuyente, \n"+
              "condicion_contrib = @condicion_contribuyente, \n"+
              "copymail = @copymail, \n"+
              "controlar_linea = @controlar_linea, \n"+
              "erp_export_sn = @exonerado_sn  \n"+
              " where \n"+
              "ccod_empresa = @codigo_empresa and \n"+
              "ccod_cliente = @codigo \n"
            
          );
          //#endregion            

          //#region Insertar Lista Precios de Cliente
          const eliminar_precios  = new mssql.Request(transaction);
          await eliminar_precios
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from Erp_clientes_Lista_Precios where\n"+
            "erp_codemp = @Codigo_Empresa and \n"+
            "erp_codclie = @Codigo and \n"+
            "erp_tipo = '12' \n"
          );
          
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
              "insert into Erp_clientes_Lista_Precios \n"+
              "( \n"+
              "erp_codemp, \n"+
              "erp_codclie, \n"+
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
          //#endregion

          //#region Insertar Forma Pago
          const eliminar_forma_pago  = new mssql.Request(transaction);
          await eliminar_forma_pago
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from hforpag_provee where\n"+
            "ccod_empresa = @Codigo_Empresa and \n"+
            "ccod_proveedor = @Codigo and \n"+
            "tipo = '12' \n"
          );
          
          for (let i= 0; i< Lista_forma_pago_elegidos.length; i++){

            var fila = Lista_forma_pago_elegidos[i];
            const request_forma_pago  = new mssql.Request(transaction);
            await request_forma_pago
            .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Codigo',mssql.VarChar(250),req.body.Codigo)
            .input('Tipo',mssql.VarChar(250),'12')
            .input('Forma_Pago',mssql.VarChar(250),fila.Codigo)
            .input('Predeterminado',mssql.VarChar(250),fila.Predeterminado)
            .input('Item',mssql.VarChar(250),(i + 1))
            .query(
              "insert into hforpag_provee \n"+
              "( \n"+
              "ccod_empresa, \n"+
              "ccod_proveedor, \n"+
              "tipo, \n"+
              "ccod_forpago, \n"+
              "selec, \n"+
              "n_item \n"+
              ") \n"+
              "values \n"+
              "( \n"+
              "@Codigo_Empresa, \n"+
              "@Codigo, \n"+
              "@Tipo, \n"+
              "@Forma_Pago, \n"+
              "@Predeterminado, \n"+
              "@Item \n"+
              ") \n"
            );
          }
          //#endregion

          //#region Insertar Direcciones Alternativas
          const eliminar_direcciones_alternativas  = new mssql.Request(transaction);
          await eliminar_direcciones_alternativas
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from Hcliente_ptolle where\n"+
            "ccod_empresa = @Codigo_Empresa and \n"+
            "ccod_cliente = @Codigo and \n"+
            "tipo = '12' \n"
          );
          
          for (let i= 0; i< Lista_direcciones_alternativas.length; i++){

            var fila = Lista_direcciones_alternativas[i];
            const request_direcciones_alternativas  = new mssql.Request(transaction);
            await request_direcciones_alternativas
            .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Tipo',mssql.VarChar(250),'12')
            .input('Codigo',mssql.VarChar(250),req.body.Codigo)
            .input('Item',mssql.VarChar(250),(i + 1))
            .input('Direccion',mssql.VarChar(250),fila.Direccion)
            .input('Ubigeo',mssql.VarChar(250),fila.Ubigeo)
            .query(
              "insert into Hcliente_ptolle \n"+
              "( \n"+
              "ccod_empresa, \n"+
              "tipo, \n"+
              "ccod_cliente, \n"+
              "n_item, \n"+
              "cdirecciong, \n"+
              "ubigeo, \n"+
              "via_tipo, \n"+
              "via_nombre, \n"+
              "numero, \n"+
              "interior, \n"+
              "zona, \n"+
              "distrito, \n"+
              "provincia, \n"+
              "departamento, \n"+
              "erp_observacion \n"+
              ") \n"+
              "values \n"+
              "( \n"+
              "@Codigo_Empresa, \n"+
              "@Tipo, \n"+
              "@Codigo, \n"+
              "@Item, \n"+
              "@Direccion, \n"+
              "@Ubigeo, \n"+
              "'', \n"+
              "'', \n"+
              "'', \n"+
              "'', \n"+
              "'', \n"+
              "'', \n"+
              "'', \n"+
              "'', \n"+
              "'' \n"+
              ") \n"
            );
          }
          //#endregion

          //#region Insertar Persona de Contacto
          const eliminar_persona_contacto  = new mssql.Request(transaction);
          await eliminar_persona_contacto
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from Hpercontactocli where\n"+
            "ccod_empresa = @Codigo_Empresa and \n"+
            "ccod_cliente = @Codigo \n"
          );
          
          for (let i= 0; i< Lista_persona_contacto.length; i++){

            var fila = Lista_persona_contacto[i];
            const request_direcciones_alternativas  = new mssql.Request(transaction);
            await request_direcciones_alternativas
            .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Codigo',mssql.VarChar(250),req.body.Codigo)
            .input('Codigo_Contacto',mssql.VarChar(250),fila.Codigo)
            .input('Nombre',mssql.VarChar(250),fila.Nombre)
            .input('Numero_Documento',mssql.VarChar(250),fila.Documento)
            .input('Telefono',mssql.VarChar(250),fila.Telefono1)
            .input('Cargo',mssql.VarChar(250),fila.Cargo)
            .input('Email',mssql.VarChar(250),fila.Email)
            .input('Telefono2',mssql.VarChar(250),fila.Telefono2)
            .input('Telefono3',mssql.VarChar(250),fila.Telefono3)
            .input('Telefono4',mssql.VarChar(250),fila.Telefono4)
            .input('Referencia',mssql.VarChar(250),fila.Referencia)
            .input('Comentario1',mssql.VarChar(250),fila.Comentario1)
            .input('Comentario2',mssql.VarChar(250),fila.Comentario2)
            .input('Activo',mssql.VarChar(250),fila.Activo)
            .input('Item',mssql.VarChar(250), (i + 1))
            .input('Predeterminado',mssql.VarChar(250),fila.Predeterminado)
            .query(
              "insert into Hpercontactocli \n"+
              "( \n"+
              "ccod_empresa, \n"+
              "ccod_cliente, \n"+
              "ccod_contacto, \n"+
              "cnom_contacto, \n"+
              "cnum_docid, \n"+
              "telefono, \n"+
              "erp_cargo, \n"+
              "erp_email, \n"+
              "erp_telefono2, \n"+
              "erp_telefono3, \n"+
              "erp_telefono4, \n"+
              "erp_ref, \n"+
              "comentario_1, \n"+
              "comentario_2, \n"+
              "erp_activo, \n"+
              "erp_nro_item, \n"+
              "Erp_Predeterminado \n"+
              ") \n"+
              "values \n"+
              "( \n"+
              "@Codigo_Empresa, \n"+
              "@Codigo, \n"+
              "@Codigo_Contacto, \n"+
              "@Nombre, \n"+
              "@Numero_Documento, \n"+
              "@Telefono, \n"+
              "@Cargo, \n"+
              "@Email, \n"+
              "@Telefono2, \n"+
              "@Telefono3, \n"+
              "@Telefono4, \n"+
              "@Referencia, \n"+
              "@Comentario1, \n"+
              "@Comentario2, \n"+
              "@Activo, \n"+
              "@Item, \n"+
              "@Predeterminado \n"+
              ") \n"
            );
          }
          //#endregion

          //#region Insertar Detracciones
          const eliminar_detracciones  = new mssql.Request(transaction);
          await eliminar_detracciones
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from Hdetraanexo where\n"+
            "ccod_empresa = @Codigo_Empresa and \n"+
            "ccod_anexo = @Codigo and \n"+
            "ctip_anexo = '12' \n"
          );
          
          for (let i= 0; i< Lista_detracciones_elegidos.length; i++){

            var fila = Lista_detracciones_elegidos[i];
            const request_direcciones_alternativas  = new mssql.Request(transaction);
            await request_direcciones_alternativas
            .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Tipo',mssql.VarChar(250),'12')
            .input('Codigo',mssql.VarChar(250),req.body.Codigo)
            .input('Codigo_Detraccion',mssql.VarChar(250),fila.Codigo)
            .input('Porcentaje',mssql.VarChar(250),'0')
            .input('Predeterminado',mssql.VarChar(250),fila.Predeterminado)
            .query(
              "insert into Hdetraanexo \n"+
              "( \n"+
              "ccod_empresa, \n"+
              "CTIP_ANEXO, \n"+
              "CCOD_ANEXO, \n"+
              "CCOD_DETRACCION, \n"+
              "PORCENTAJE, \n"+
              "PREDET \n"+
              ") \n"+
              "values \n"+
              "( \n"+
              "@Codigo_Empresa, \n"+
              "@Tipo, \n"+
              "@Codigo, \n"+
              "@Codigo_Detraccion, \n"+
              "@Porcentaje, \n"+
              "@Predeterminado \n"+
              ") \n"
            );
          }
          //#endregion

          //#region Insertar Agencias
          const eliminar_agencias  = new mssql.Request(transaction);
          await eliminar_agencias
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from erp_agencia where\n"+
            "erp_codemp = @Codigo_Empresa and \n"+
            "erp_codane = @Codigo and \n"+
            "erp_codtia = '12' \n"
          );
          
          for (let i= 0; i< Lista_agencias.length; i++){

            var fila = Lista_agencias[i];
            const request_direcciones_alternativas  = new mssql.Request(transaction);
            await request_direcciones_alternativas
            .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Tipo',mssql.VarChar(250),'12')
            .input('Codigo',mssql.VarChar(250),req.body.Codigo)
            .input('Codigo_Agencia',mssql.VarChar(250),fila.Codigo)
            .input('Nombre_Agencia',mssql.VarChar(250),fila.Nombre)
            .input('Codigo_Tipo_Agencia',mssql.VarChar(250),fila.Tipo_Agencia)
            .input('Direccion',mssql.VarChar(250),fila.Direccion)
            .input('Contacto',mssql.VarChar(250),fila.Contacto)
            .input('Telefono',mssql.VarChar(250),fila.Telefono)
            .input('Ubigeo',mssql.VarChar(250),fila.Codigo_Ubigeo)
            .query(
              "insert into erp_agencia \n"+
              "( \n"+
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
              ") \n"+
              "values \n"+
              "( \n"+
              "@Codigo_Empresa, \n"+
              "@Tipo, \n"+
              "@Codigo, \n"+
              "@Codigo_Agencia, \n"+
              "@Nombre_Agencia, \n"+
              "@Codigo_Tipo_Agencia, \n"+
              "@Direccion, \n"+
              "@Contacto, \n"+
              "@Telefono, \n"+
              "@Ubigeo \n"+
              ") \n"
            );
          }
          //#endregion

          //#region Insertar Aval
          const eliminar_aval  = new mssql.Request(transaction);
          await eliminar_aval
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from Erp_aval where\n"+
            "ccod_empresa = @Codigo_Empresa and \n"+
            "ccod_anexo = @Codigo and \n"+
            "erp_tipo = '12' \n"
          );
          
          for (let i= 0; i< Lista_aval.length; i++){

            var fila = Lista_aval[i];
            const request_direcciones_alternativas  = new mssql.Request(transaction);
            await request_direcciones_alternativas
            .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Codigo',mssql.VarChar(250),req.body.Codigo)
            .input('Tipo',mssql.VarChar(250),'12')
            .input('Codigo_Aval',mssql.VarChar(250),fila.Codigo)
            .input('Nombre',mssql.VarChar(250),fila.Nombre)
            .input('Direccion',mssql.VarChar(250),fila.Direccion)
            .input('Telefono',mssql.VarChar(250),fila.Telefono)
            .input('Codigo_Ubigeo',mssql.VarChar(250),fila.Codigo_Ubigeo)
            .input('Ubigeo',mssql.VarChar(250),fila.Nombre_Ubigeo)
            .query(
              "insert into Erp_aval \n"+
              "( \n"+
              "ccod_empresa, \n"+
              "ccod_anexo, \n"+
              "erp_tipo, \n"+
              "erp_codaval, \n"+
              "erp_nomaval, \n"+
              "erp_dirava, \n"+
              "erp_telaval, \n"+
              "erp_codubi, \n"+
              "erp_nomubi \n"+
              ") \n"+
              "values \n"+
              "( \n"+
              "@Codigo_Empresa, \n"+
              "@Codigo, \n"+
              "@Tipo, \n"+
              "@Codigo_Aval, \n"+
              "@Nombre, \n"+
              "@Direccion, \n"+
              "@Telefono, \n"+
              "@Codigo_Ubigeo, \n"+
              "@Ubigeo \n"+
              ") \n"
            );
          }
          //#endregion

          //#region Insertar Historial
          const eliminar_historial  = new mssql.Request(transaction);
          await eliminar_historial
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from hcliente_historial where\n"+
            "ccod_empresa = @Codigo_Empresa and \n"+
            "ccod_cliente = @Codigo  \n"
          );
          
          for (let i= 0; i< Lista_historial.length; i++){

            var fila = Lista_historial[i];
            const request_direcciones_alternativas  = new mssql.Request(transaction);
            await request_direcciones_alternativas
            .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('Codigo',mssql.VarChar(250),req.body.Codigo)
            .input('Codigo_Historial',mssql.VarChar(250),(i+1))
            .input('Comentario',mssql.VarChar(250),fila.Comentario1)
            .input('Visible',mssql.VarChar(250),fila.Visible)
            .input('Comentario_2',mssql.VarChar(250),fila.Comentario2)
            .input('Comentario_3',mssql.VarChar(250),fila.Comentario3)
            .query(
              "insert into hcliente_historial \n"+
              "( \n"+
              "ccod_empresa, \n"+
              "ccod_cliente, \n"+
              "ccod_historial, \n"+
              "Comentario, \n"+
              "fecha, \n"+
              "Configuracion, \n"+
              "visible, \n"+
              "Comentario_2, \n"+
              "Comentario_3 \n"+
              ") \n"+
              "values \n"+
              "( \n"+
              "@Codigo_Empresa, \n"+
              "@Codigo, \n"+
              "@Codigo_Historial, \n"+
              "@Comentario, \n"+
              "getdate(), \n"+
              "'1', \n"+
              "@visible, \n"+
              "@Comentario_2, \n"+
              "@Comentario_3 \n"+
              ") \n"
            );
          }
          //#endregion

          //#region Insertar Placas
          const eliminar_placas  = new mssql.Request(transaction);
          await eliminar_placas
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from Hcliente_placas where\n"+
            "ccod_empresa = @Codigo_Empresa and \n"+
            "ccod_cliente = @Codigo and \n"+
            "tipo = '12' \n"
          );
          
          for (let i= 0; i< Lista_placas.length; i++){

            var fila = Lista_placas[i];
            const request_direcciones_alternativas  = new mssql.Request(transaction);
            await request_direcciones_alternativas
            .input('ccod_empresa',mssql.VarChar(250),req.user.codigo_empresa)
            .input('tipo',mssql.VarChar(250),'12')
            .input('ccod_cliente',mssql.VarChar(250),req.body.Codigo)
            .input('n_item',mssql.VarChar(250),(i + 1))
            .input('placa',mssql.VarChar(250),fila.Placa)
            .input('marca',mssql.VarChar(250),fila.Marca)
            .input('anio_fabricacion',mssql.VarChar(250),fila.Anio_Fabricacion)
            .input('modelo',mssql.VarChar(250),fila.Modelo)
            .input('combustible',mssql.VarChar(250),fila.Combustible)
            .input('carroceria',mssql.VarChar(250),fila.Carrocería)
            .input('color',mssql.VarChar(250),fila.Color)
            .input('n_motor',mssql.VarChar(250),fila.Numero_Motor)
            .input('n_serie',mssql.VarChar(250),fila.Numero_Serie)
            .input('longitud',mssql.VarChar(250),fila.Longitud)
            .input('altura',mssql.VarChar(250),fila.Altura)
            .input('ancho',mssql.VarChar(250),fila.Ancho)
            .input('categoria',mssql.VarChar(250),fila.Categoría)
            .input('anio_modelo',mssql.VarChar(250),fila.Anio_Modelo)
            .input('version',mssql.VarChar(250),fila.Version)
            .input('cilindros',mssql.VarChar(250),fila.Cilindros)
            .input('cilindrada',mssql.VarChar(250),fila.Cilindrada)
            .input('p_bruto',mssql.VarChar(250),fila.Peso_Bruto)
            .input('p_neto',mssql.VarChar(250),fila.Peso_Neto)
            .input('carga_util',mssql.VarChar(250),fila.Carga_Util)
            .query(
              "insert into Hcliente_placas \n"+
              "( \n"+
              "ccod_empresa, \n"+
              "tipo, \n"+
              "ccod_cliente, \n"+
              "n_item, \n"+
              "placa, \n"+
              "marca, \n"+
              "anio_fabricacion, \n"+
              "modelo, \n"+
              "combustible, \n"+
              "carroceria, \n"+
              "color, \n"+
              "n_motor, \n"+
              "n_serie, \n"+
              "longitud, \n"+
              "altura, \n"+
              "ancho, \n"+
              "categoria, \n"+
              "anio_modelo, \n"+
              "version, \n"+
              "cilindros, \n"+
              "cilindrada, \n"+
              "p_bruto, \n"+
              "p_neto, \n"+
              "carga_util \n"+
              ") \n"+
              "values \n"+
              "( \n"+
              "@ccod_empresa, \n"+
              "@tipo, \n"+
              "@ccod_cliente, \n"+
              "@n_item, \n"+
              "@placa, \n"+
              "@marca, \n"+
              "@anio_fabricacion, \n"+
              "@modelo, \n"+
              "@combustible, \n"+
              "@carroceria, \n"+
              "@color, \n"+
              "@n_motor, \n"+
              "@n_serie, \n"+
              "@longitud, \n"+
              "@altura, \n"+
              "@ancho, \n"+
              "@categoria, \n"+
              "@anio_modelo, \n"+
              "@version, \n"+
              "@cilindros, \n"+
              "@cilindrada, \n"+
              "@p_bruto, \n"+
              "@p_neto, \n"+
              "@carga_util \n"+
              ") \n"
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

    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{
          //#region Insertar Lista Precios de Cliente
          const eliminar_precios  = new mssql.Request(transaction);
          await eliminar_precios
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from Erp_clientes_Lista_Precios where\n"+
            "erp_codemp = @Codigo_Empresa and \n"+
            "erp_codclie = @Codigo and \n"+
            "erp_tipo = '12' \n"
          );
          //#endregion

          //#region Insertar Forma Pago
          const eliminar_forma_pago  = new mssql.Request(transaction);
          await eliminar_forma_pago
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from hforpag_provee where\n"+
            "ccod_empresa = @Codigo_Empresa and \n"+
            "ccod_proveedor = @Codigo and \n"+
            "tipo = '12' \n"
          );
          
          //#endregion

          //#region Insertar Direcciones Alternativas
          const eliminar_direcciones_alternativas  = new mssql.Request(transaction);
          await eliminar_direcciones_alternativas
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from Hcliente_ptolle where\n"+
            "ccod_empresa = @Codigo_Empresa and \n"+
            "ccod_cliente = @Codigo and \n"+
            "tipo = '12' \n"
          );
          //#endregion

          //#region Insertar Persona de Contacto
          const eliminar_persona_contacto  = new mssql.Request(transaction);
          await eliminar_persona_contacto
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from Hpercontactocli where\n"+
            "ccod_empresa = @Codigo_Empresa and \n"+
            "ccod_cliente = @Codigo \n"
          );
          
          //#endregion

          //#region Insertar Detracciones
          const eliminar_detracciones  = new mssql.Request(transaction);
          await eliminar_detracciones
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from Hdetraanexo where\n"+
            "ccod_empresa = @Codigo_Empresa and \n"+
            "ccod_anexo = @Codigo and \n"+
            "ctip_anexo = '12' \n"
          );
          //#endregion

          //#region Insertar Agencias
          const eliminar_agencias  = new mssql.Request(transaction);
          await eliminar_agencias
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from erp_agencia where\n"+
            "erp_codemp = @Codigo_Empresa and \n"+
            "erp_codane = @Codigo and \n"+
            "erp_codtia = '12' \n"
          );
          
          //#endregion

          //#region Insertar Aval
          const eliminar_aval  = new mssql.Request(transaction);
          await eliminar_aval
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from Erp_aval where\n"+
            "ccod_empresa = @Codigo_Empresa and \n"+
            "ccod_anexo = @Codigo and \n"+
            "erp_tipo = '12' \n"
          );
          //#endregion

          //#region Insertar Historial
          const eliminar_historial  = new mssql.Request(transaction);
          await eliminar_historial
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from hcliente_historial where\n"+
            "ccod_empresa = @Codigo_Empresa and \n"+
            "ccod_cliente = @Codigo  \n"
          );
          
          //#endregion

          //#region Insertar Placas
          const eliminar_placas  = new mssql.Request(transaction);
          await eliminar_placas
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
            "delete from Hcliente_placas where\n"+
            "ccod_empresa = @Codigo_Empresa and \n"+
            "ccod_cliente = @Codigo and \n"+
            "tipo = '12' \n"
          );
          
          //#endregion

          //#region Insertar Cliente
          const request  = new mssql.Request(transaction);
          await request
          .input('codigo_empresa',mssql.VarChar(250),codigo_empresa)
          .input('codigo',mssql.VarChar(250),req.body.Codigo)
          .query(
              "delete from hcliente \n"+
              " where \n"+
              "ccod_empresa = @codigo_empresa and \n"+
              "ccod_cliente = @codigo \n"
            
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