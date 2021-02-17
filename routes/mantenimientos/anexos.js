const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');

router.post('/lista', async (req, res) => {
    const codigo_empresa = req.user.codigo_empresa;
    var tipo = req.body.tipo;
    var query_12=
    "SELECT \n"+
    "'12' as Tipo_Auxiliar, \n"+
    "ccod_cliente as Codigo, \n"+
    "cnum_ruc as Ruc, \n"+
    "cnom_cliente as Nombre, \n"+
    "cdireccion as Direccion, \n"+
    "cdistrito as Distrito, \n"+
    "cciudad as Ciudad, \n"+
    "ctelefonos as Telefono, \n"+
    "cfax as Fax, \n"+
    "ce_mail as Correo_Electronico, \n"+
    "'' as Contacto, \n"+
    "'' as Observacion, \n"+
    "cgrupo_cliente as Grupo_Anexo, \n"+
    "tip_doc as Tipo_Documento, \n"+
    "ndoc_id as Numero_Documento, \n"+
    "ccod_pais as Pais, \n"+
    "retencion as Si_Retencion, \n"+
    "porc_reten as Porcentaje_Retencion, \n"+
    "'' as Si_Percepcion, \n"+
    "'0' as Porcentaje_Percepcion, \n"+
    "'' as Buen_Contribuyente, \n"+
    "ccod_departamento as Departamento, \n"+
    "erp_codrubro as Rubro, \n"+
    "ccod_zona as Zona1, \n"+
    "erp_zona_2 as Zona2, \n"+
    "erp_gestor as gGestor, \n"+
    "'N' as Domiciliado, \n"+
    "'00' as Pais_No_Domiciliado, \n"+
    "'' as Beneficiario_Codigo, \n"+
    "'' as Vinculacion_Economica \n"+
    "FROM \n"+
    "hcliente \n"+
    "where ccod_empresa = @codigo_empresa";

    var query_42=
    "SELECT \n"+
    "'42' as Tipo_Auxiliar, \n"+
    "ccod_proveedor as Codigo, \n"+
    "cnum_ruc as Ruc, \n"+
    "cnom_proveedor as Nombre, \n"+
    "cdireccion as Direccion, \n"+
    "'' as Distrito, \n"+
    "'' as Ciudad, \n"+
    "ctelefonos as Telefono, \n"+
    "cfax as Fax, \n"+
    "ce_mail as Correo_Electronico, \n"+
    "cper_contacto as Contacto, \n"+
    "cobservaciones as Observacion, \n"+
    "cgrupo_prov as Grupo_Anexo, \n"+
    "tip_docid as Tipo_Documento, \n"+
    "ndoc_id as Numero_Documento, \n"+
    "pais as Pais, \n"+
    "agen_ret_s_n as Si_Retencion, \n"+
    "porc_reten as Porcentaje_Retencion, \n"+
    "percepcion as Si_Percepcion, \n"+
    "porc_percep as Porcentaje_Percepcion, \n"+
    "buen_contri as Buen_Contribuyente, \n"+
    "excluye_percepcion as Excluye_Percepcion, \n"+
    "'' as Departamento, \n"+
    "'' as Rubro, \n"+
    "erp_zona_1 as Zona1, \n"+
    "erp_zona_2 as Zona2, \n"+
    "'' as gGestor, \n"+
    "erp_no_domiciliado_sn as Domiciliado, \n"+
    "erp_no_domiciliado_pais as Pais_No_Domiciliado, \n"+
    "erp_beneficiario_codigo as Beneficiario_Codigo, \n"+
    "erp_vinculacion_economica as Vinculacion_Economica \n"+
    "FROM \n"+
    "Hproveed \n"+
    "where ccod_empresa = @codigo_empresa \n";

    var query_41=
    "SELECT \n"+
    "'41' as Tipo_Auxiliar, \n"+
    "ccod_person as Codigo, \n"+
    "'' as Ruc, \n"+
    "ape_pat + ' ' + ape_mat + ', ' + nombres as Nombre, \n"+
    "'' as Direccion, \n"+
    "'' as Distrito, \n"+
    "'' as Ciudad, \n"+
    "'' as Telefono, \n"+
    "'' as Fax, \n"+
    "'' as Correo_Electronico, \n"+
    "'' as Contacto, \n"+
    "'' as Observacion, \n"+
    "'' as Grupo_Anexo, \n"+
    "tip_docid as Tipo_Documento, \n"+
    "ndoc_id as Numero_Documento, \n"+
    "pais as Pais, \n"+
    "'' as Si_Retencion, \n"+
    "'' as Porcentaje_Retencion, \n"+
    "'' as Si_Percepcion, \n"+
    "'0' as Porcentaje_Percepcion, \n"+
    "'' as Buen_Contribuyente, \n"+
    "'' as Departamento, \n"+
    "'' as Rubro, \n"+
    "'' as Zona1, \n"+
    "'' as Zona2, \n"+
    "'' as gGestor, \n"+
    "'N' as Domiciliado, \n"+
    "'00' as Pais_No_Domiciliado, \n"+
    "'' as Beneficiario_Codigo, \n"+
    "'' as Vinculacion_Economica \n"+
    "FROM \n"+
    "Hperson \n"+
    "where ccod_empresa=@codigo_empresa \n";

    var query=
    "SELECT \n"+
    "tipo_auxiliar as Tipo_Auxiliar, \n"+
    "codigo as Codigo, \n"+
    "ruc as Ruc, \n"+
    "nombre as Nombre, \n"+
    "direccion as Direccion, \n"+
    "'' as Distrito, \n"+
    "'' as Ciudad, \n"+
    "telefono as Telefono, \n"+
    "fax as Fax, \n"+
    "'' as Correo_Electronico, \n"+
    "contacto as Contacto, \n"+
    "'' as Observacion, \n"+
    "grupo_anexo as Grupo_Anexo, \n"+
    "tipo_documento as Tipo_Documento, \n"+
    "codigo as Numero_Documento, \n"+
    "'' as Pais, \n"+
    "retencion as Si_Retencion, \n"+
    "porc_retencion as Porcentaje_Retencion, \n"+
    "'' as Si_Percepcion, \n"+
    "'0' as Porcentaje_Percepcion, \n"+
    "'' as Buen_Contribuyente, \n"+
    "'' as Departamento, \n"+
    "'' as Rubro, \n"+
    "'' as Zona1, \n"+
    "'' as Zona2, \n"+
    "'' as gGestor, \n"+
    "'N' as Domiciliado, \n"+
    "'00' as Pais_No_Domiciliado, \n"+
    "'' as Beneficiario_Codigo, \n"+
    "'' as Vinculacion_Economica \n"+
    "FROM \n"+
    "Hanexos_2 \n"+
    "where idempresa=@codigo_empresa \n"+
    "and tipo_auxiliar=@tipo \n";

    var query_undifened =
    "select  \n"+
    "(Hanexos_2.tipo_auxiliar +' - '+ Htipaux.cnom_tipaux) as Tipo_Auxiliar, \n"+
    "codigo as Codigo, \n"+
    "ruc as Ruc, \n"+
    "nombre as Nombre, \n"+
    "direccion as Direccion, \n"+
    "telefono as Telefono, \n"+
    "fax as Fax, \n"+
    "correo_electronico as Correo, \n"+
    "contacto as Contacto, \n"+
    "tipo_documento as Tipo_Documento, \n"+
    "pais as Pais, \n"+
    "excluye_percepcion as Excluye_Percepcion, \n"+
    "percepcion as Si_Percepcion, \n"+
    "percepcion_documento as Documento_Percepcion, \n"+
    "retencion as Si_Retencion, \n"+
    "porc_retencion as Porc_Retencion, \n"+
    "porc_percepcion as Porc_Percepcion, \n"+
    "detraccion_sn as Si_Detraccion, \n"+
    "grupo_anexo as Grupo_Anexo, \n"+
    "buen_contribuyente as Buen_Contribuyente, \n"+
    "Erp_Observacion as Observacion \n"+
    "from Hanexos_2 inner join Htipaux on\n"+   
    "Hanexos_2.idempresa = Htipaux.ccod_empresa and \n"+
    "Hanexos_2.tipo_auxiliar = Htipaux.ccod_tipaux \n"+
    "where idempresa =  @codigo_empresa \n";

    switch (tipo){
        case "12":
            query=query_12;
        break;
        case "42":
            query=query_42;
        break;
        case "41":
            query=query_41;
        break;
        case undefined:
            query=query_undifened;
        break;
    }

    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('tipo', mssql.VarChar(10), tipo)
    .query(query);

    const recordset = lista.recordset;
    res.json(recordset);
});

router.post('/datos', async (req, res) => {
    const codigo_empresa = req.user.codigo_empresa;
    var codigo = req.body.codigo;
    var tipo = req.body.tipo;
    const pool = await poolPromise;
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo', mssql.VarChar(25), codigo)
    .input('tipo', mssql.VarChar(5), tipo)
    .query(
    " SELECT \n"+
    " ctip_auxiliar as Tipo_Auxiliar, \n"+
    " ccod_anexo as Codigo, \n"+
    " cnum_ruc as Ruc, \n"+
    " cnom_anexo as Nombre, \n"+
    " cdireccion as Direccion, \n"+
    " distrito as Distrito, \n"+
    " cciudad as Ciudad, \n"+
    " ctelefonos as Telefono, \n"+
    " cfax as Fax, \n"+
    " ce_mail as Correo_Electronico, \n"+
    " cper_contacto as Contacto, \n"+
    " cgrupo_cliente as Grupo_Anexo, \n"+
    " tip_docid as Tipo_Documento, \n"+
    " ndoc_id as Numero_Documento, \n"+
    " LTRIM(RTRIM(pais)) as Pais, \n"+
    " retenc_percep as Si_Retencion, \n"+
    " porc_retencion as Porcentaje_Retencion, \n"+
    " percepcion_sn as Si_Percepcion, \n"+
    " monto_percepcion as Porcentaje_Percepcion, \n"+
    " '' as Buen_Contribuyente, \n"+
    " departamento as Departamento, \n"+
    " rubro as Rubro, \n"+
    " zona1 as Zona1, \n"+
    " zona2 as Zona2, \n"+
    " no_domiciliado_sn as No_Domiciliado, \n"+
    " no_domiciliado_pais as Pais_No_Domiciliado, \n"+
    " '' as Beneficiario_Codigo, \n"+
    " '' as Vinculacion_Economica \n"+ 
    " FROM Hanexos \n"+
    " WHERE ccod_empresa = @codigo_empresa And \n"+
    " ctip_auxiliar = @tipo And \n"+
    " ccod_anexo = @codigo "
    );

    const recordset = lista.recordset;

    res.json(recordset);
});

module.exports = router;