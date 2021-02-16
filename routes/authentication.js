const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../database');
const passport = require('passport');
var ruc_empresa="";
router.get('/:ruc', async (req,res)=>{
    const { ruc } = req.params;
    ruc_empresa = ruc;
    res.render('auth/ingresar_ruc',{ruc: ruc});
});
router.post('/auth/empresas/lista', async (req,res)=>{
    try {
        const codigo = req.body.codigo;
        const pool = await poolPromise
        const result_empresas = await pool.request().input('codigo',mssql.VarChar(50),codigo).query("select * from hempresa where ccod_empresa in ( select codigo_empresa from hempresa_contratante_detalle where ruc_empresa_contratante = @codigo)");
        const empresas = result_empresas.recordset;
        res.json(empresas);
    } catch (err) {
        res.send(err.message)
    }
});

router.post('/ingresar', (req,res, next)=>{
    passport.authenticate('local.ingresar',{
        successRedirect: '/main',
        failureRedirect: '/'+ruc_empresa,
    })(req,res,next);
});

router.get('/user/desconectar',(req,res)=>{
    req.logout();
    res.redirect('/');
});

module.exports = router;