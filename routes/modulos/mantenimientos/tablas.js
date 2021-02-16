const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../../database');
const {isLoggedin} = require('../../../lib/auth');
//#region  querys
var vendedor_lista=
    'select \n'+
    'LTRIM(RTRIM(ccod_vendedor)) as Codigo \n, '+
    "ccod_vendedor + ' - '+ cnom_vendedor as Nombre, \n"+
    'email as Email, '+
    'celular as Celular, '+
    'telefono1 as Telefono1, '+
    'telefono2 as Telefono2, '+
    'telefono3 as Telefono3, '+
    'telefono4 as Telefono4, '+
    'LTRIM(RTRIM(zona)) as Codigo_Zona, '+
    'erp_cargo as Cargo, '+
    'imagen_firma as Firma, '+
    'password as Password, '+
    'erp_codlista as Lista_Precios_Codigo, '+
    'erp_activo as Lista_Precios_Activo, '+
    'porcentaje_comision as Porcentaje_Comision '+
    'from Hvended '+
    'left join Erp_Vendedores_Lista_Precios on '+
    'Hvended.ccod_empresa = Erp_Vendedores_Lista_Precios.erp_codemp '+
    'and Hvended.ccod_vendedor = Erp_Vendedores_Lista_Precios.erp_codven '+
    'where ccod_empresa = @Codigo_Empresa and ccod_vendedor=@Codigo';
var almacen_lista=
    "select \n"+
    "ccod_almacen as Codigo, \n"+
    "cnom_almacen as Nombre, \n"+
    "cdireccion as Direccion, \n"+
    "cresponsable as Responsable, \n"+
    "Erp_visible as Visible \n"+
    "from Halmacen_2 \n"+
    "where ccod_empresa=@Codigo_Empresa \n"+
    "and ccod_almacen=@Codigo \n";
var punto_venta_lista=
    "select \n"+
    "ccod_almacen as Codigo, \n"+
    "cnom_almacen as Nombre, \n"+
    "cdireccion as Direccion, \n"+
    "LTRIM(RTRIM(erp_codalmacen_ptovta)) as Almacen_Codigo \n"+
    "from halmacen \n"+
    "where \n"+
    "ccod_empresa=@Codigo_Empresa \n"+
    "and ccod_almacen=@Codigo \n";
var empleados_lista=
    " Select \n"+
    " LTRIM(RTRIM(tipo_trabajador)) as Tipo_Trabajador, \n"+
    " LTRIM(RTRIM(ccod_person)) as Codigo, \n"+
    " ape_pat  as Apellido_Paterno, \n"+ 
    " ape_mat  as Apellido_Materno ,\n"+ 
    " nombres as Nombres, \n"+   
    " direccion as Direccion, \n"+
    " (Erp_Coduser) as Codigo_Usuario , \n"+
    " CONVERT(VARCHAR,fecha_ingreso,23) as Fecha_Ingreso, \n"+
    " Sexo as Sexo, \n"+
    "  LTRIM(RTRIM(pais)) as Pais, \n"+
    " aprobacion_oc_1 as Aprobar_OC, \n"+
    " genera_oc as Genera_OC, \n"+
    " email as Email, \n"+
    " erp_cargo as Erp_cargo, \n"+
    " imagen_firma as Imagen_Firma, \n"+
    " aprobar_pedido as Aprobar_Pedido, \n"+
    " case aprobar_pedido when 'S' then 'checked' else '' end  as Aprobar_Pedido_checked, \n"+
    " case aprobar_pedido when 'S' then '' else 'checked' end  as Aprobar_Pedido_no_checked, \n"+
    " ff_cierre_Doc as Cierre_Fondo_Fijo, \n"+
    " erp_aprob_cot as Erp_Aprob_Cot, \n"+
    " tip_docid as Tipo_Documento, \n"+
    " ndoc_id as Numero_Documento , \n"+
    " erp_aprobreq_2 as Aprobar_Req_2 , \n"+
    " aprobar_Req as Aprobar_Req \n"+
    " From hperson \n"+
    " Where ccod_empresa = @Codigo_Empresa and \n"+
    " ccod_person = @Codigo \n";
var agencia_transporte_lista=
    " Select \n"+
    " erp_codagencia as Codigo, \n"+
    " erp_nomagencia  as Nombre, \n"+
    " erp_email  as Email, \n"+
    " erp_telefono1  as Telefono1, \n"+
    " erp_telefono2 as Telefono2, \n"+
    " erp_telefono3 as Telefono3, \n"+
    " erp_web as Web, \n"+
    " erp_direccion as Direccion, \n"+
    " erp_ruc as Ruc, \n"+
    " erp_contacto as Contacto, \n"+
    " erp_observacion1 as Observacion1, \n"+
    " erp_observacion2 as Observacion2, \n"+
    " predeterminado as Predeterminado, \n"+
    " si_privado as Privado \n"+
    " From erp_agencia_transporte \n"+
    " Where erp_codemp = @Codigo_Empresa and \n"+
    " erp_codagencia = @Codigo \n";
var transportista_lista=
    " Select \n"+
    " ccod_transportista as Codigo, \n"+
    " cnom_transportista as Nombre, \n"+
    " razon_social as Razon_Social, \n"+
    " cnum_ruc as Ruc, \n"+
    " cdireccion as Direccion, \n"+
    " lic_conducir as Licencia, \n"+
    " contacto as Contacto, \n"+
    " cfax as Fax, \n"+
    " LTRIM(RTRIM(conf_vehiculo)) as Vehiculo, \n"+
    " ctelefono as Telefono, \n"+
    " tip_doc as Tipo_Documento, \n"+
    " predeterminado as Predeterminado, \n"+
    " si_privado as Privado \n"+
    " from htransp  Where ccod_empresa = @Codigo_Empresa and \n"+
    " ccod_transportista = @Codigo \n";
var vehiculo_lista=
    "Select \n"+
    " LTRIM(RTRIM(ccod_vehiculo)) as Codigo, \n"+
    " placa1 as Nombre, \n"+
    " placa2 as Placa, \n"+
    " n_inscripcion as N_inscripcion, \n"+
    " predeterminado as Predeterminado, \n"+
    " si_privado as Privado \n"+
    " from hvehiculo  Where ccod_empresa = @Codigo_Empresa and \n"+
    " ccod_vehiculo = @Codigo \n"
var chofer_lista=
    " Select \n"+
    " erp_codigo  as Codigo, \n"+ 
    " erp_nombre as Nombre, \n"+ 
    " erp_documento as Numero_Documento, \n"+ 
    " erp_tipodoc as Tipo_Documento, \n"+ 
    " erp_licencia as Licencia, \n"+
    " predeterminado as Predeterminado, \n"+
    " si_privado as Privado \n"+ 
    " from Hchofer  Where erp_empresa = @Codigo_Empresa and \n"+
    " erp_codigo = @Codigo \n";
var clientes_lista=
    " Select \n"+
    " Hcliente.ccod_cliente as Codigo, \n"+
    " Hcliente.cgrupo_cliente as Grupo_Cliente, \n"+
    " LTRIM(RTRIM(Hcliente.tipo_cliente)) as Tipo_Cliente, \n"+
    " Hcliente.tip_doc as Tipo_Documento, \n"+
    " Htipdociden.ccod_sunatid as Tipo_Documento_Sunat, \n"+
    " Hcliente.ndoc_id as Numero_Doc, \n"+
    " Hcliente.cnum_ruc as Numero_Ruc, \n"+
    " Hcliente.cnum_dni as Numero_DNI, \n"+
    " Hcliente.codigo_interno as Codigo_Interno, \n"+
    " Hcliente.ctelefonos as Telefono1, \n"+
    " Hcliente.telefono_2 as Telefono2, \n"+
    " Hcliente.telefono_3 as Telefono3, \n"+
    " Hcliente.telefono_4 as Telefono4, \n"+
    " Hcliente.cfax as Fax, \n"+
    " Hcliente.ce_mail as Correo, \n"+
    " Hcliente.copymail as Correo_Copia, \n"+
    " LTRIM(RTRIM(Hcliente.ccod_pais)) as Codigo_Pais, \n"+
    " LTRIM(RTRIM(Hcliente.ccod_departamento)) as Codigo_Departamento, \n"+
    " LTRIM(RTRIM(Hcliente.cdistrito)) as Codigo_Distrito, \n"+
    " LTRIM(RTRIM(Hcliente.cciudad)) as Codigo_Ciudad, \n"+
    " LTRIM(RTRIM(Hcliente.ccod_vendedor)) as Codigo_Vendedor, \n"+
    " LTRIM(RTRIM(Hcliente.ccod_zona)) as Codigo_Zona1, \n"+
    " LTRIM(RTRIM(Hcliente.erp_zona_2)) as Codigo_Zona2, \n"+
    " LTRIM(RTRIM(Hcliente.situacion)) as Codigo_Situacion1, \n"+
    " LTRIM(RTRIM(Hcliente.erp_situacion_2)) as Codigo_Situacion2, \n"+
    " LTRIM(RTRIM(Hcliente.lista_precios)) as Lista_Precios_Predeterminado, \n"+
    " Hcliente.descuento as Descuento, \n"+
    " Hcliente.nlinea_credito_mn as Linea_Credito_MN, \n"+
    " Hcliente.nlinea_credito_me as Linea_Credito_ME, \n"+
    " Hcliente.controlar_linea as Controlar_Linea_Si_No, \n"+
    " Hcliente.pc_sn as Percepcion_Si_No, \n"+
    " Hcliente.porc_percep as Percepcion_Porcentaje, \n"+
    " Hcliente.retencion as Retencion_Si_No, \n"+
    " Hcliente.porc_reten as Retencion_Porcentaje, \n"+
    " Hcliente.buen_contri as Buen_Contribuyente_Si_No, \n"+
    " Hcliente.excluye_percepcion as Excluye_Percepcion_Si_No, \n"+
    " Hcliente.cdireccion as Direccion, \n"+
    " Hcliente.erp_codrubro as Codigo_Rubro, \n"+
    " Hcliente.erp_modmov as Modificacion_Si_No, \n"+
    " Hcliente.bonificacion as Bonificacion_Si_No, \n"+
    " Hcliente.Erp_Observacion01 as Observacion1, \n"+
    " Hcliente.Erp_Observacion02 as Observacion2, \n"+
    " Hcliente.erp_porcentaje_desc as Porcentaje_Descuento, \n"+
    " Hcliente.erp_gestor as Codigo_Gestor, \n"+
    " Hcliente.estado as Estado, \n"+
    " Hcliente.cnom_cliente as Nombre, \n"+
    " Hcliente.nombre_comercial as Nombre_Comercial, \n"+
    " Hcliente.erp_nombres as Nombres, \n"+
    " Hcliente.erp_apepat as Apellido_Paterno, \n"+
    " Hcliente.erp_apemat as Apellido_Materno, \n"+
    " Hcliente.estado_contrib as Estado_Contribuyente, \n"+
    " Hcliente.condicion_contrib as Condicion_Contribuyente, \n"+
    " Hcliente.erp_export_sn as Exonerado_Si_No, \n"+
    " CONVERT(VARCHAR,Hcliente.FechaEquipo,23) as Fecha_Creacion, \n"+
    " CONVERT(VARCHAR,Hcliente.erp_pc_fechamodificacion,23) as Fecha_Modificacion, \n"+
    " Erp_clientes_Lista_Precios.erp_codlista as Lista_Precios_Codigo, \n"+
    " Erp_clientes_Lista_Precios.erp_activo as Lista_Precios_Activo \n"+
    " From Hcliente with (nolock) \n"+
    " inner Join Htipdociden with (nolock) On \n"+
    " Hcliente.tip_doc = Htipdociden.ccod_tdid \n"+
    " left join Erp_clientes_Lista_Precios on \n"+
    " Hcliente.ccod_empresa = Erp_clientes_Lista_Precios.erp_codemp and \n"+
    " Hcliente.ccod_cliente = Erp_clientes_Lista_Precios.erp_codclie and \n"+
    " Erp_clientes_Lista_Precios.erp_tipo = '12' \n"+
    " where Hcliente.ccod_empresa = @Codigo_Empresa \n"+
    " and Hcliente.ccod_cliente = @Codigo \n";
var productos_lista=
    "select \n"+
    "harticul.automatico as Automatico, \n"+
    "harticul.ccod_articulo as Codigo, \n"+
    "harticul.cnom_articulo as Nombre, \n"+
    "LTRIM(RTRIM(harticul.cunidad)) as Unidad, \n"+
    "harticul.ubicacion1 as Ubicacion1, \n"+
    "harticul.ubicacion2 as Ubicacion2, \n"+
    "harticul.ccod_interno as Codigo_Fabricante, \n"+
    "harticul.Erp_CodInterno2 as Codigo_Interno1, \n"+
    "harticul.Erp_Codinterno3 as Codigo_Interno2, \n"+
    "harticul.cod_digemir as Codigo_Digemid, \n"+
    "harticul.unspsc as Codigo_UNSPC, \n"+
    "LTRIM(RTRIM(harticul.Categoria)) as Categoria, \n"+
    "harticul.csistock as Control_Stock, \n"+
    "harticul.lote as Lote_SN, \n"+
    "harticul.flagserie as Serie_SN, \n"+
    "harticul.si_servicio as Servicio, \n"+
    "LTRIM(RTRIM(harticul.cmonedav)) as Moneda, \n"+
    "LTRIM(RTRIM(harticul.ccod_almacen)) as Codigo_Tipo_Producto, \n"+
    "LTRIM(RTRIM(harticul.cfamilia)) as Codigo_Familia, \n"+
    "LTRIM(RTRIM(harticul.ccod_subfamilia)) as Codigo_SubFamilia, \n"+
    "LTRIM(RTRIM(harticul.codmarca)) as Codigo_Concepto1, \n"+
    "LTRIM(RTRIM(harticul.modelo)) as Codigo_Concepto2, \n"+
    "LTRIM(RTRIM(harticul.color)) as Codigo_Concepto3, \n"+
    "LTRIM(RTRIM(harticul.tratamiento)) as Codigo_Concepto4, \n"+
    "LTRIM(RTRIM(harticul.fuelle)) as Codigo_Concepto5, \n"+
    "LTRIM(RTRIM(harticul.azas)) as Codigo_Concepto6, \n"+
    "LTRIM(RTRIM(harticul.solapa)) as Codigo_Concepto7, \n"+
    "LTRIM(RTRIM(harticul.estado)) as Estado, \n"+
    "harticul.Cant_cont as Cantidad_Contenido, \n"+
    "LTRIM(RTRIM(harticul.coduni_cont)) as Codigo_Unidad2, \n"+
    "harticul.nstock_max as Stock_Max, \n"+
    "harticul.nstock_min as Stock_Min, \n"+
    "harticul.nstock_rep as Stock_Rep, \n"+
    "harticul.erp_peso as Peso, \n"+
    "harticul.erp_largo as Largo, \n"+
    "harticul.erp_ancho as Ancho, \n"+
    "harticul.porc_descuento1 as Descuento1, \n"+
    "harticul.porc_descuento2 as Descuento2, \n"+
    "harticul.porc_descuento3 as Descuento3, \n"+
    "harticul.erp_mankid as Kits, \n"+
    "harticul.erp_activo_fijo as Activo_Fijo, \n"+
    "harticul.AFCT_ADV as Afecta_Advalorem, \n"+
    "harticul.PORC_ADV as Porcentaje_Advalorem, \n"+
    "harticul.AFCT_PRC as Percepcion, \n"+
    "harticul.erp_porc_percep as Porcentaje_Percepcion, \n"+
    "harticul.erp_isc_sn as Isc, \n"+
    "harticul.erp_porc_isc as Porcentaje_Isc, \n"+
    "harticul.IQPF as Iqpf, \n"+
    "harticul.nigv as Igv_Art, \n"+
    "harticul.si_icbper as Icbper, \n"+
    "harticul.monto_icbper as Monto_Icbper, \n"+
    "harticul.erp_grupo_receta as Grupo_Receta, \n"+
    "harticul.erp_receta as Receta, \n"+
    "harticul.erp_desc_impresion as Desc_Impresion, \n"+
    "harticul.erp_comision_sn as Comision, \n"+
    "harticul.erp_comision_porc as Comision_Porcentaje, \n"+
    "harticul.si_digemid as Cod_Digemid_SN, \n"+
    "harticul.Erp_CodBarra as Codigo_Barra, \n"+
    "harticul.Erp_CodBarra_Aut as Codigo_Barra_Automatico , \n"+ 
    "harticul.Erp_Part_Arancelaria as Partida_Arrancelaria, \n"+ 
    "harticul.ruta_imagen as Ruta_Imagen, \n"+
    "harticul.observacion as Leyenda1, \n"+
    "harticul.Erp_Observacion2 as Leyenda2, \n"+
    "CONVERT(VARCHAR,harticul.erp_pc_fecha,23) as Fecha_Creacion, \n"+ 
    "CONVERT(VARCHAR,harticul.erp_pc_fechamodificacion,23) as Fecha_Modificacion \n"+
    "from Harticul \n"+
    "where Harticul.ccod_empresa= @Codigo_Empresa  and Harticul.ccod_articulo = @Codigo \n";

var proveedores_lista=
    "Select  \n"+
    "Hproveed.ccod_proveedor as Codigo,  \n"+
    "Hproveed.cgrupo_prov as Grupo_Proveedor,  \n"+
    "Hproveed.tip_docid as Tipo_Documento,  \n"+
    "Htipdociden.ccod_sunatid as Tipo_Documento_Sunat,  \n"+
    "Hproveed.ndoc_id as Numero_Doc,  \n"+
    "Hproveed.cnum_ruc as Numero_Ruc,  \n"+
    "Hproveed.cnum_dni as Numero_DNI,  \n"+
    "Hproveed.ctelefonos as Telefono1,  \n"+
    "Hproveed.telefono_2 as Telefono2,  \n"+
    "Hproveed.telefono_3 as Telefono3,  \n"+
    "Hproveed.telefono_4 as Telefono4,  \n"+
    "Hproveed.cfax as Fax,  \n"+
    "Hproveed.celular as Celular,   \n"+
    "Hproveed.ce_mail as Correo,   \n"+
    "Hproveed.cdireccion_postal as Direccion_Postal,  \n"+
    "Hproveed.ctelefonos_postal as Telefono_Postal, \n"+
    "Hproveed.celular_postal as Celular_Postal, \n"+
    "Hproveed.ce_mail_postal as Email_Postal, \n"+
    "Hproveed.nextel_postal as Nextel_Postal, \n"+
    "Hproveed.cfaxpostal as Fax_Postal, \n"+
    "Hproveed.cper_contacto as Contacto, \n"+
    "Hproveed.web as Web, \n"+
    "LTRIM(RTRIM(Hproveed.pais)) as Codigo_Pais,  \n"+
    "LTRIM(RTRIM(Hproveed.erp_zona_1)) as Codigo_Zona1,  \n"+
    "LTRIM(RTRIM(Hproveed.erp_zona_2)) as Codigo_Zona2,  \n"+
    "LTRIM(RTRIM(Hproveed.erp_situacion_1)) as Codigo_Situacion1,  \n"+
    "LTRIM(RTRIM(Hproveed.erp_situacion_2)) as Codigo_Situacion2,   \n"+
    "Hproveed.percepcion as Percepcion_Si_No,  \n"+
    "Hproveed.porc_percep as Percepcion_Porcentaje,  \n"+
    "Hproveed.agen_ret_s_n as Retencion_Si_No,  \n"+
    "Hproveed.porc_reten as Retencion_Porcentaje,  \n"+
    "Hproveed.buen_contri as Buen_Contribuyente_Si_No,  \n"+
    "Hproveed.excluye_percepcion as Excluye_Percepcion_Si_No,  \n"+
    "Hproveed.erp_no_domiciliado_sn as No_Domiciliado_Si_No,  \n"+
    "Hproveed.prc_en_doc as Percepcion_Documento_Si_No,  \n"+
    "Hproveed.detraccion as Detraccion_Si_No,  \n"+
    "Hproveed.cdireccion as Direccion,   \n"+
    "Hproveed.bonificacion as Bonificacion_Si_No,  \n"+
    "Hproveed.cobservaciones as Observacion1,  \n"+
    "Hproveed.Erp_Observacion01 as Observacion2,  \n"+
    "Hproveed.cnom_proveedor as Nombre,  \n"+
    "Hproveed.estado_contrib as Estado_Contribuyente,  \n"+
    "Hproveed.condicion_contrib as Condicion_Contribuyente,  \n"+
    "CONVERT(VARCHAR,Hproveed.FechaEquipo,23) as Fecha_Creacion,  \n"+
    "CONVERT(VARCHAR,Hproveed.erp_pc_fechamodificacion,23) as Fecha_Modificacion \n"+
    "From Hproveed with (nolock)  \n"+
    "inner Join Htipdociden with (nolock) On  \n"+
    "Hproveed.tip_docid = Htipdociden.ccod_tdid \n"+
    "where Hproveed.ccod_empresa = @Codigo_Empresa  \n"+
    "and Hproveed.ccod_proveedor = @Codigo  \n";

var gestor_cobranza_lista=
    "Select \n"+
    "erp_codgestor as Codigo,\n"+
    "erp_nomgestor as Nombre,\n"+
    "erp_email as Email,\n"+
    "erp_celular as Celular, \n"+
    "erp_telefono1 as Telefono1, \n"+
    "erp_telefono2 as Telefono2, \n"+
    "erp_cargo as Cargo,\n"+
    "predeterminado as Predeterminado\n"+
    "From erp_gestor_cobranza\n"+
    "Where erp_codemp= @Codigo_Empresa and erp_codgestor = @Codigo";

var cobrador_lista=
    "Select  \n"+
    "Erp_Cobrador.erp_codcob as Codigo, \n"+
    "Erp_Cobrador.erp_nomcob as Nombre, \n"+
    "Erp_Cobrador.erp_email as Email, \n"+
    "Erp_Cobrador.erp_telefono as Telefono1, \n"+
    "Erp_Cobrador.erp_telefono2 as Telefono2, \n"+
    "Erp_Cobrador.erp_password as Password, \n"+
    "Erp_Cobrador.ccod_caja as Codigo_Caja, \n"+
    "Erp_Cobrador.predeterminado as Predeterminado, \n"+
    "Erp_Cobrador.usuario as Usuario \n"+
    "From Erp_Cobrador \n"+
    "where \n"+
    "Erp_Cobrador.erp_codemp = @Codigo_Empresa and Erp_Cobrador.erp_codcob = @Codigo\n";

var grupo_cliente_lista=
    "select  \n"+
    "cgrupo_cliente as Codigo, \n"+
    "cnom_grupclie as Nombre, \n"+
    "CONVERT(VARCHAR,Hgpoclie_fechmodificacion,103) as Fecha_Modificacion, \n"+
    "NombreEquipo as PC, \n"+
    "CONVERT(VARCHAR,HoraPc,25) as Hora_Modificacion, \n"+
    "Ip_Cliente as Ip_Cliente,  \n"+
    "ErpUsuario as Usuario \n"+
    "from Hgpoclie where  \n"+
    "ccod_empresa = @Codigo_Empresa and cgrupo_cliente = @Codigo \n";

var grupo_proveedor_lista=
    "select  \n"+
    "cgrupo_prov as Codigo, \n"+
    "cnom_grupprov as Nombre, \n"+
    "CONVERT(VARCHAR,Hgpoprov_fechmodificacion,103) as Fecha_Modificacion, \n"+
    "NombreEquipo as PC, \n"+
    "CONVERT(VARCHAR,HoraPc,25) as Hora_Modificacion, \n"+
    "Ip_Cliente as Ip_Cliente,  \n"+
    "ErpUsuario as Usuario \n"+
    "from Hgpoprov where  \n"+
    "ccod_empresa = @Codigo_Empresa and cgrupo_prov = @Codigo \n";

var tipo_productos_lista=
    " select  \n"+
    " LTRIM(RTRIM(codigo)) as Codigo, \n"+
    " nombre as Nombre, \n"+
    " Erp_CodSunat as Codigo_Sunat, \n"+
    " CONVERT(VARCHAR,TipoProd_fechModificacion,103) as Fecha_Modificacion, \n"+
    " NombreEquipo as PC, \n"+
    " Hora as Hora_Modificacion, \n"+
    " Ip_cliente as Ip_Cliente, \n"+
    " ErpUsuario as Usuario \n"+
    " from htipo_prod \n"+
    " where idempresa = @Codigo_Empresa and codigo = @Codigo\n";

var tipo_documento_lista=
    " select  \n"+
    " ctip_doc as Codigo, \n"+
    " cnom_doc as Nombre, \n"+
    " codigo_sunat as Codigo_Sunat, \n"+
    " compras as Compras, \n"+
    " ventas as Ventas, \n"+
    " contabilidad as Contabilidad, \n"+
    " almacen as Almacen, \n"+
    " csigno as Csigno, \n"+
    " valor_signo as Valor_Signo, \n"+
    " aplica_prc as Aplica_Prc, \n"+
    " min_a_prc as Min_A_Prc, \n"+
    " gen_credfis as Genera_Credfis, \n"+
    " cantidad_caracteres as Cantidad_Caracteres, \n"+
    " porc_igv as Porcentaje_Igv, \n"+
    " renta_cuarta as Renta_Cuarta, \n"+
    " UPPER(fecha_tc) as Fecha_Tc, \n"+
    " ruta_formato as Ruta_Formato, \n"+
    " tipo_talonario as Tipo_Talonario, \n"+
    " caja as Caja, \n"+
    " Tipodoc_fechModificacion as Fecha_Modificacion, \n"+
    " NombreEquipo as PC, \n"+
    " HoraPc as Hora_Pc, \n"+
    " Ip_Cliente as Ip_Cliente, \n"+
    " ErpUsuario as Usuario, \n"+
    " ptovta as Punto_Venta, \n"+
    " tipo_formato as Tipo_Formato \n"+
    " from htipdoc  \n"+
    " where ccod_empresa = @Codigo_Empresa  and ctip_doc = @Codigo\n";

var talonario_lista=
    " select  \n"+
    " Htalonar.ccod_empresa as Codigo_Empresa, \n"+
    " Htalonar.ccod_almacen as Punto_Venta, \n"+
    " LTRIM(RTRIM(tip_doc)) as Tipo_Documento, \n"+
    " LTRIM(RTRIM(cnum_serie)) as Numero_Serie, \n"+
    " ultimo_grab as Ultimo_Grab, \n"+
    " activo as Activo, \n"+
    " predeterminado as Predeterminado, \n"+
    " Htalonar.ruta_formato as Ruta_Formato, \n"+
    " num_filas as Num_Filas, \n"+
    " erp_ancho as Ancho, \n"+
    " erp_a4 as A4, \n"+
    " erp_alto as Alto, \n"+
    " talonar_fechmodificacion as Fecha_Modificacion, \n"+
    " Htalonar.NombreEquipo as PC, \n"+
    " Htalonar.HoraPc as Hora_Pc, \n"+
    " Htalonar.Ip_Cliente as Ip_Cliente, \n"+
    " Htalonar.ErpUsuario as Usuario \n"+
    " from Htalonar \n"+
    " where Htalonar.ccod_empresa = @Codigo_Empresa  and Htalonar.ccod_almacen = @Codigo and tip_doc = @Nombre and cnum_serie = @Serie\n";

var motivos_tramite_lista=
    "select \n"+
    "LTRIM(RTRIM(erp_codmot)) as Codigo,\n"+
    "erp_nommot as Nombre,\n"+
    "LTRIM(RTRIM(erp_motivos_tramite.erp_codtid)) as Tipo_Documento,\n"+
    "erp_rutfor as Formato,\n"+
    "erp_predeterminado as Predeterminado,\n"+
    "erp_motivos_tramite.ruta_impresora as Ruta_Impresora,\n"+
    "IpCliente as Pc_ip,\n"+
    "erp_motivos_tramite.erpusuario as Usuario,\n"+
    "convert(varchar,FechMod,103) as Fecha_Modificacion,\n"+
    "erp_motivos_tramite.NombreEquipo as Pc_user\n"+
    "from erp_motivos_tramite \n"+
    "where erp_codemp = @Codigo_Empresa and  erp_codmot = @Codigo";

var forma_pago_lista=
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
    "ccod_empresa = @Codigo_Empresa and ccod_forpago = @Codigo \n";

var cencos_lista=
    " select  \n"+
    " LTRIM(RTRIM(ccod_cencos)) as Codigo, \n"+
    " LTRIM(RTRIM(cnom_cencos)) as Nombre, \n"+
    " responsable as Responsable, \n"+
    " abrev as Abreviatura, \n"+
    " erp_nivel as Nivel, \n"+
    " erp_digitos as Digitos, \n"+
    " CONVERT(VARCHAR,Hcencos_fechmodificacion,103) as Fecha_Modificacion, \n"+
    " NombreEquipo as Pc_user, \n"+
    " CONVERT(VARCHAR,HoraPc,8) as Pc_Fecha, \n"+
    " Ip_Cliente as Pc_ip, \n"+
    " ErpUsuario as Usuario \n"+
    " from Hcencos \n"+
    " where ccod_empresa = @Codigo_Empresa and ccod_cencos = @Codigo\n";

var unidad_negolcios_lista=
    "select \n"+
    "RTrim(erp_codune) as Codigo, \n"+
    "LTrim(RTrim(erp_nomune ))  as Nombre, \n"+
    "erp_dirune as Direccion, \n"+
    "erp_unidad_negocio_fechmodificacion as Fecha_Modificacion, \n"+
    "NombreEquipo as Pc_user, \n"+
    "HoraPc as Pc_Fecha, \n"+
    "Ip_Cliente as Pc_ip, \n"+
    "ErpUsuario as Usuario, \n"+
    "erp_nivel as Nivel \n"+
    "from erp_unidad_negocio where erp_codemp = @Codigo_Empresa and erp_codune = @Codigo \n";

var orden_trabajo_lista=
    "SELECT \n"+
    "rtrim(ltrim(ccod_ot)) as Codigo,\n"+
    "ltrim(rtrim(cnom_ot)) as Nombre,\n"+
    "abrev as Abreviatura,\n"+
    "orden_servicio as Orden_Servicio,\n"+
    "CONVERT(VARCHAR,fecha_inicio,23) as Fecha_Inicio,\n"+
    "CONVERT(VARCHAR,fecha_final,23) as Fecha_Final,\n"+
    "presupuesto as Presupuesto,\n"+
    "observacion as Observacion,\n"+
    "observacion2 as Observacion2,\n"+
    "observacion3 as Observacion3,\n"+
    "CONVERT(VARCHAR,Horden_trabajo_fechmodificacion,8) as Fecha_Hora_Modificacion,\n"+
    "CONVERT(VARCHAR,fechaModificacion,23) as Fecha_Modificacion,\n"+
    "NombreEquipo as Pc_user,\n"+
    "IpCliente as Pc_ip,\n"+
    "CONVERT(VARCHAR,Hora,8) as Pc_Fecha,\n"+
    "Erpusuario as Usuario\n"+
    "FROM horden_trabajo WHERE \n"+
    "ccod_empresa = @Codigo_Empresa and ccod_ot = @Codigo\n";

var partida_gasto_lista=
    "select  \n"+
    "ccod_empresa as Codigo_Empresa, \n"+
    "ccod_partgast as Codigo, \n"+
    "cnom_partgast as Nombre, \n"+
    "abrev as Abreviatura, \n"+
    "erp_codsunat as Codigo_Sunat, \n"+
    "usuario as Usuario, \n"+
    "operacion as Operacion \n"+
    "from Hpartidagast \n"+
    "where ccod_empresa =  @Codigo_Empresa  and ccod_partgast = @Codigo \n";

var presupuesto_lista=
    "SELECT \n"+
    "erp_codpart as Codigo,\n"+
    "erp_nompart as Nombre,\n"+
    "erp_abrev as Abreviatura,\n"+
    "erp_responsable as Responsable,\n"+
    "CONVERT(VARCHAR,PartPresupCab_fechmodificacion,103) as Fecha_Modificacion,\n"+
    "NombreEquipo as Pc_user,\n"+
    "CONVERT(VARCHAR,HoraPc,8) as Pc_Fecha,\n"+
    "Ip_Cliente as Pc_ip,\n"+
    "ErpUsuario as Usuario,\n"+
    "erp_nivel as Nivel\n"+
    "FROM Erp_Partida_Presupuestal_Cab\n"+
    "WHERE erp_codemp = @Codigo_Empresa and erp_codpart = @Codigo";

var kits_lista=
    " SELECT \n"+
    " (Harticul.ccod_articulo) as Codigo, \n"+
    " (harticul.cnom_articulo) as Nombre, \n"+
    " (ltrim(rtrim(harticul.cunidad))) as Unidad \n"+
    " FROM   harticul \n"+
    " where harticul.ccod_empresa  = @Codigo_Empresa and Harticul.ccod_articulo = @Codigo \n"

var usuario_lista=
    " SELECT erp_usuario.erp_coduser as Codigo,   \n"+
    " LTrim(RTrim(erp_usuario.erp_nomuser)) as Nombre,  \n"+
    " erp_usuario.erp_password as Password, \n"+
    " erp_usuario.erp_password_2 as Password02, \n"+
    " erp_usuario.erp_estado  as Estado,  \n"+
    " erp_usuario.erp_kardex_s_n as Ver_Mov_Kardex,  \n"+
    " erp_usuario.erp_mov_compras as Ver_Mov_Compras,  \n"+
    " erp_usuario.erp_Com_ventas_s_n as Ver_Com_Ventas  \n"+
    " FROM erp_usuario   \n"+
    " Where erp_codemp = @Codigo_Empresa  and  erp_coduser = @Codigo \n"

var familias_lista=
    "select  \n"+
    "LTRIM(RTRIM(cfamilia)) as Codigo, \n"+
    "cnom_familia as Nombre, \n"+
    "abrev as Abreviatura, \n"+
    "afecta_nombre as Afecta_Nombre, \n"+
    "ccuenta as Cta_Debe, \n"+
    "ccuenta_h as Cta_Haber, \n"+
    "cta_import_debe as Cta_Imprtacion, \n"+
    "ccuenta_vd as Cta_Diferencia, \n"+
    "cta_costo_venta_d as Cta_Costo_Debe, \n"+
    "cta_costo_venta_h as Cta_Costo_Haber, \n"+
    "costo_dia as Costo_Dia, \n"+
    "costo_hora as Costo_Hora, \n"+
    "cta_produccion_debe as Cta_Produccion_Debe, \n"+
    "cta_produccion_haber as Cta_Produccion_Haber, \n"+
    "erp_cta_nc_dev as Cta_Nc_Dev, \n"+
    "cta_alm_ne_debe as Alm_NE_Debe, \n"+
    "cta_alm_ne_haber as Alm_NE_Haber, \n"+
    "cta_alm_ns_debe as Alm_NS_Debe, \n"+
    "cta_alm_ns_haber as Alm_NS_Haber, \n"+
    "hfam_fechModificacion as Fecha_Modificacion, \n"+
    "Hora as Pc_Fecha, \n"+
    "ErpUsuario as Usuario, \n"+
    "NombreEquipo as Pc_user, \n"+
    "Ip_Cliente as Pc_ip \n"+
    "from Hfam_art  \n"+
    "where ccod_empresa = @Codigo_Empresa and  cfamilia = @Codigo \n"

var subfamilias_lista=
    "select  \n"+
    "LTRIM(RTRIM(ccod_subfamilia))  as Codigo,  \n"+
    "cnom_subfamilia as Nombre, \n"+
    "afecta_nombre as Afecta_Nombre, \n"+
    "abreviatura as Abreviatura, \n"+
    "convert(varchar,hSubFam_fechModificacion,103) as Fecha_Modificacion, \n"+
    "convert(varchar, Hora, 8) as Hora, \n"+
    "ErpUsuario as Usuario, \n"+
    "NombreEquipo as Pc_user, \n"+
    "Ip_Cliente as Pc_ip \n"+
    "from Hsubfamilia_art \n"+
    "where ccod_empresa = @Codigo_Empresa and  ccod_subfamilia = @Codigo\n"

var plan_contable_lista=
    "select \n"+
    "ccuenta_padre as Cuenta_Padre, \n"+
    "ccuenta as Codigo, \n"+
    "cnom_cuenta as Nombre, \n"+
    "nnivel_cuenta as Nivel, \n"+
    "ccod_tipaux as Tipo_Auxiliar, \n"+
    "csicencos as Si_CenCos, \n"+
    "cclase_cuenta as Clase_Cuenta, \n"+
    "ctip_cam_ajuste as Ajuste_Tc, \n"+
    "ot as Si_Ot, \n"+
    "dh as D_H, \n"+
    "csipresup as Si_Presupuesto, \n"+
    "daot as Daot, \n"+
    "sitransfer as Si_Transferencia, \n"+
    "nombre_presupuesto as Nombre_Presupuesto, \n"+
    "genera_diferencia as Si_Genera_Diferencia, \n"+
    "moneda_ajuste_2 as Ajuste_Tipo_Tc, \n"+
    "Erp_Elemento as Elemento, \n"+
    "erp_moneda_cierre as Moneda_Cierre, \n"+
    "clasif_bien_servicio as Bien_Servicio_Clasificacion, \n"+
    "ccuenta_exterior as Cuenta_Exterior, \n"+
    "ctapdt as Cuenta_Pdt,  \n"+
    "CONVERT(VARCHAR,Fecha_creacion,103) as Fecha_Creacion \n"+
    "from Hplancon \n"+
    "where ccod_empresa = @Codigo_Empresa and ccuenta =  @Codigo\n"

var conceptos1_lista = 
    "select \n"+
    " LTRIM(RTRIM(erp_codcon)) as Codigo, \n"+ 
    " erp_nomcon as Nombre,  \n"+
    " erp_abrcon as Abreviatura  \n"+
    " from erp_concepto1 where erp_codemp = @Codigo_Empresa and erp_codcon =  @Codigo \n"
var conceptos2_lista = 
    "select \n"+
    " LTRIM(RTRIM(erp_codcon)) as Codigo, \n"+ 
    " erp_nomcon as Nombre,  \n"+
    " erp_abrcon as Abreviatura  \n"+
    " from erp_concepto2 where erp_codemp = @Codigo_Empresa and erp_codcon =  @Codigo \n"
var conceptos3_lista = 
    "select \n"+
    " LTRIM(RTRIM(erp_codcon)) as Codigo, \n"+ 
    " erp_nomcon as Nombre,  \n"+
    " erp_abrcon as Abreviatura  \n"+
    " from erp_concepto3 where erp_codemp = @Codigo_Empresa and erp_codcon =  @Codigo \n"
var conceptos4_lista = 
    "select \n"+
    " LTRIM(RTRIM(erp_codcon)) as Codigo, \n"+ 
    " erp_nomcon as Nombre,  \n"+
    " erp_abrcon as Abreviatura  \n"+
    " from erp_concepto4 where erp_codemp = @Codigo_Empresa and erp_codcon =  @Codigo \n"
var conceptos5_lista = 
    "select \n"+
    " LTRIM(RTRIM(erp_codcon)) as Codigo, \n"+ 
    " erp_nomcon as Nombre,  \n"+
    " erp_abrcon as Abreviatura  \n"+
    " from erp_concepto5 where erp_codemp = @Codigo_Empresa and erp_codcon =  @Codigo \n"
var conceptos6_lista = 
    "select \n"+
    " LTRIM(RTRIM(erp_codcon)) as Codigo, \n"+ 
    " erp_nomcon as Nombre,  \n"+
    " erp_abrcon as Abreviatura  \n"+
    " from erp_concepto6 where erp_codemp = @Codigo_Empresa and erp_codcon =  @Codigo \n"
var conceptos7_lista = 
    "select \n"+
    " LTRIM(RTRIM(erp_codcon)) as Codigo, \n"+ 
    " erp_nomcon as Nombre,  \n"+
    " erp_abrcon as Abreviatura  \n"+
    " from erp_concepto7 where erp_codemp = @Codigo_Empresa and erp_codcon =  @Codigo \n"

var subvoucher_lista = 
    "select \n"+
    "ccod_svoucher as Codigo, \n"+
    "cnom_svoucher as Nombre, \n"+
    "cabrev_svoucher as Abreviatura, \n"+
    "ctip_cambio as Tipo_Cambio, \n"+
    "genera_transf as Si_Transferencia, \n"+
    "compras as Si_Compras, \n"+
    "ventas as Si_Ventas, \n"+
    "contable as Si_Contable, \n"+
    "cancelacion as Si_Cancelacion, \n"+
    "genera_diferencia as Si_Diferencia, \n"+
    "calcula_moneda as Si_CalculaMonedas, \n"+
    "n_caracteres as Caracteres \n"+
    "from hsubvouc \n"+
    "where ccod_empresa = @Codigo_Empresa and ccod_svoucher =  @Codigo \n"

var tipo_auxiliar_lista = 
    " SELECT \n"+
    " ccod_tipaux as Codigo , \n"+
    " cnom_tipaux as Nombre \n"+
    " FROM HTIPAUX \n"+
    " WHERE ccod_empresa = @Codigo_Empresa and ccod_tipaux =  @Codigo\n"

var grupo_auxiliar_lista=
    " Select erp_codgru as Codigo, \n"+
    " erp_nomgru as Nombre, \n"+
    " erp_gruane.erp_tipane as Tipo   \n"+
    " From erp_gruane \n"+
    " Where erp_codemp = @Codigo_Empresa and erp_codgru =  @Codigo\n"

var asiento_patron_lista=
    " select  \n"+
    " erp_codigo as Codigo, \n"+
    " erp_nombre as Nombre, \n"+
    " erp_cuenta as Cuenta_Soles, \n"+
    " Erp_Cuenta_Dolares as Cuenta_Dolares, \n"+
    " erp_abrev as Abreviatura, \n"+
    " tipo_doc as Tipo_Documento, \n"+
    " Erp_provision as Si_Provision, \n"+
    " erp_cuenta_provision as Cuenta_Provision_Soles, \n"+
    " Erp_Cuenta_provision_dolares as Cuenta_Provision_Dolares \n"+
    " from Erp_asiento_patron \n"+
    " where Erp_codemp = @Codigo_Empresa  and erp_codigo =  @Codigo \n"
//#endregion

router.get('/:tabla',isLoggedin,async (req, res) => {
    const { tabla } = req.params;
    res.render("modulos/mantenimientos/tablas", {modulo: tabla});
});

router.post('/ventana',isLoggedin,async (req, res) => {
    try{

        var tabla=req.body.tabla;
        if(req.body.codigo==null || req.body.codigo==""){
            res.render("modulos/mantenimientos/"+tabla, {layout:false});
        }else{
            var query="";
            switch(tabla){
                case "vendedor":
                    query=vendedor_lista;
                break;
                case "almacen":
                    query=almacen_lista;
                break;
                case "punto_venta":
                    query=punto_venta_lista;
                break;
                case "empleados":
                    query=empleados_lista;
                break;
                case "agencia_transporte":
                    query=agencia_transporte_lista;
                break;
                case "transportista":
                    query=transportista_lista;
                break;
                case "vehiculo":
                    query=vehiculo_lista;
                break;
                case "chofer":
                    query=chofer_lista;
                break;
                case "clientes":
                    query=clientes_lista;
                break;
                case "productos":
                    query=productos_lista;
                break;
                case "proveedores":
                    query=proveedores_lista;
                break;
                case "gestor_cobranza":
                    query=gestor_cobranza_lista;
                break;
                case "cobrador":
                    query=cobrador_lista;
                break;
                case "grupo_cliente":
                    query=grupo_cliente_lista;
                break;
                case "grupo_proveedor":
                    query=grupo_proveedor_lista;
                break;
                case "tipo_productos":
                    query=tipo_productos_lista;
                break;
                case "tipo_documento":
                    query=tipo_documento_lista;
                break;
                case "talonarios":
                    query=talonario_lista;
                break;
                case "motivos_tramite":
                    query=motivos_tramite_lista;
                break;
                case "forma_pago":
                    query=forma_pago_lista;
                break;
                case "cencos":
                    query=cencos_lista;
                break;
                case "unidad_negocios":
                    query=unidad_negolcios_lista;
                break;
                case "orden_trabajo":
                    query=orden_trabajo_lista;
                break;
                case "partida_gasto":
                    query=partida_gasto_lista;
                break;
                case "presupuesto":
                    query=presupuesto_lista;
                break;
                case "kits":
                    query=kits_lista;
                break;
                case "usuario":
                    query=usuario_lista;
                break;
                case "familias":
                    query=familias_lista;
                break;
                case "subfamilias":
                    query=subfamilias_lista;
                break;
                case "plan_contable":
                    query=plan_contable_lista;
                break;
                case "concepto1":
                    query= conceptos1_lista;
                break;
                case "concepto2":
                    query= conceptos2_lista;
                break;
                case "concepto3":
                    query= conceptos3_lista;
                break;
                case "concepto4":
                    query= conceptos4_lista;
                break;
                case "concepto5":
                    query= conceptos5_lista;
                break;
                case "concepto6":
                    query= conceptos6_lista;
                break;
                case "concepto7":
                    query= conceptos7_lista;
                break;
                case "subvoucher":
                    query=subvoucher_lista;
                break;
                case "tipo_auxiliar":
                    query = tipo_auxiliar_lista;
                break;
                case "grupo_auxiliar":
                    query = grupo_auxiliar_lista;
                break;
                case "asiento_patron":
                    query =asiento_patron_lista;
                break;
            }
            const pool = await poolPromise
            const lista = await pool
            .request()
            .input('Codigo_Empresa', mssql.VarChar(10), req.user.codigo_empresa)
            .input('Codigo', mssql.VarChar(250), req.body.codigo)
            .input('Nombre', mssql.VarChar(250), req.body.nombre)
            .input('Serie', mssql.VarChar(250), req.body.serie)
            .query(query);
            
            const recordset = lista.recordset;
            console.log(recordset[0]);
            res.render("modulos/mantenimientos/"+tabla, {layout:false, datos: recordset[0], lista:recordset});
            //res.send(recordset);
        }
    } catch (err) {
      res.send(err.message)
    }
});

module.exports = router;