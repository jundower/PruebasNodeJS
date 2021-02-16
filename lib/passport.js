const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const {poolPromise, mssql} = require ('../database');
const helpers = require('../lib/helpers');
let datos_login;

passport.use('local.ingresar',new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'clave',
    passReqToCallback: true
}, async(req,username,password,done)=>{
    datos_login = req.body
    const {codigo_empresa}=req.body;
    const pool = await poolPromise
    const rows = await pool
    .request()
    .input('erp_coduser', mssql.VarChar(100), username)
    .input('erp_codemp', mssql.VarChar(100), codigo_empresa)
    .query('select erp_codemp, erp_coduser,erp_password from erp_usuario where erp_coduser = @erp_coduser and erp_codemp=@erp_codemp');

    const lista = rows.recordset;
    if (lista.length > 0){
        const users= lista[0];
        const validPassword= await helpers.matchPassword(password,users.erp_password);
        if(validPassword){
            if(username!="erpsys"){
                // Código para expulsar al usuario cuando se ingresa desde otro navegador
                const pool = await poolPromise
                const rows = await pool
                .request()
                .input('codigo_empresa', mssql.VarChar(100), '%"codigo_empresa":"'+codigo_empresa+'"%')
                .input('username', mssql.VarChar(100), '%"usuario":"'+username+'"%')
                .query("delete from Sessions where sess like @codigo_empresa and sess like @username");
            }
            done(null,users);
        }else{
            done(null,false);
        }
    }else{
        return done (null,false);
    }
   
}));

passport.serializeUser((users, done)=>{
    // done(null,users.erp_codemp+'-'+users.erp_coduser);
    var lista={
        erp_codemp : users.erp_codemp,
        erp_codemp : users.erp_coduser,
        id : users.erp_codemp+'-'+users.erp_coduser,
        datos_login : datos_login,
    }
    done(null,lista);
});

passport.deserializeUser(async (id,done)=>{
    const pool = await poolPromise;
    const rows = await pool
    .request()
    .input('erp_coduser', mssql.VarChar(100), id.id)
    .query(
        "select \n"+
        "usuario.erp_codemp as codigo_empresa, \n"+
        "usuario.erp_coduser as codigo_usuario, \n"+
        "usuario.erp_nomuser as nombre_usuario, \n"+
        "usuario.erp_estado as estado, \n"+
        "usuario.erp_password as clave_encriptada, \n"+
        "usuario.erp_kardex_s_n as kardex_sn, \n"+
        "usuario.erp_com_ventas_s_n as ventas_sn, \n"+
        "usuario.erp_mov_compras as compras_sn, \n"+
        "pto_venta.mas_igv as pto_venta_mas_igv, \n"+
        "ventas.mas_igv as ventas_mas_igv, \n"+
        "ventas.ctipo_cambio as ventas_tipo_cambio, \n"+
        "ventas.moneda_trabajo as ventas_moneda_trabajo, \n"+
        "globales.busqueda_personalizada as globales_busqueda_pto_venta, \n"+
        "empresa.cnum_ruc as ruc_empresa, \n"+
        "empresa.crazonsocial as razon_social, \n"+
        "punto_venta.erp_codalmacen_ptovta as almacen_relacionado, \n"+
        "proceso_compra, \n"+
        "proceso_almacen, \n"+
        "proceso_ventas, \n"+
        "proceso_pto_venta, \n"+
        "proceso_provisiones, \n"+
        "proceso_financiero, \n"+
        "proceso_costos_proyectos, \n"+
        "proceso_contabilidad, \n"+
        "proceso_planillas, \n"+
        "proceso_sistema_gerencial, \n"+
        "proceso_otros \n"+
        "from erp_usuario as usuario \n"+
        "inner join Erp_Configuraciones_6 as pto_venta on \n"+
        "usuario.erp_codemp = pto_venta.erp_codemp \n"+
        "inner join Hconfiguraciones_2 as ventas on \n"+
        "usuario.erp_codemp = ventas.idempresa \n"+
        "inner join hconfiguraciones as globales on \n"+
        "usuario.erp_codemp = globales.idempresa \n"+
        "inner join Hempresa as empresa on \n"+
        "empresa.ccod_empresa = usuario.erp_codemp \n"+
        "inner join Halmacen as punto_venta on \n"+
        "punto_venta.ccod_empresa = usuario.erp_codemp \n"+
        "and punto_venta.ccod_almacen = '"+id.datos_login.codigo_punto_venta+"' \n"+
        "left join hempresa_contratante_detalle on \n"+
        "hempresa_contratante_detalle.codigo_empresa = usuario.erp_codemp \n"+
        "left join configuracion_modulos on \n"+
        "configuracion_modulos.codigo_empresa_contratante = hempresa_contratante_detalle.codigo_empresa_contratante \n"+
        "where usuario.erp_codemp+'-'+ usuario.erp_coduser = @erp_coduser and usuario.erp_estado='A'"
    );
    
    let recordset = rows.recordset;
    let lista = recordset[0];
    let datos_usuario = {...lista, ...id.datos_login}
    done(null,datos_usuario);
});