const express = require('express');
const router = express.Router();
const {isLoggedin} = require('../../../lib/auth');
const fs = require('fs');
const path = require('path');

router.get('/cotizacion',isLoggedin,async (req, res) => {
    res.render("modulos/ventas/cotizacion");
});

router.get('/pedido',isLoggedin,async (req, res) => {
    res.render("modulos/ventas/pedido");
});

router.get('/guia',isLoggedin,async (req, res) => {
    res.render("modulos/ventas/guia");
});

router.get('/facturacion',isLoggedin,async (req, res) => {
    res.render("modulos/ventas/facturacion");
});

router.get('/sunat',isLoggedin,async (req, res) => {
    res.render("modulos/ventas/sunat");
});

router.get('/eliminar_saldos/:modulo',isLoggedin,async (req, res) => {
    const { modulo } = req.params;
    res.render('modulos/mantenimientos/eliminar_saldos', {modulo: modulo});
});

router.get('/aprobaciones/:modulo',isLoggedin,async (req, res) => {
    const { modulo } = req.params;
    res.render('modulos/mantenimientos/aprobaciones', {modulo: modulo});
});

router.get('/reportes/:modulo',isLoggedin,async (req, res) => {
    const { modulo } = req.params;
    res.render("modulos/mantenimientos/reportes",{modulo: modulo});
});

router.post('/exportar_html',isLoggedin,async (req, res) => {
    try{
        const codigo_empresa = req.user.codigo_empresa;

        var ruteFile= path.join(__dirname, '../../../public/erp/'+codigo_empresa+'/html/'+req.body.nameFile+'.html')
        
        await fs.writeFile(ruteFile, req.body.content, (err) => {
            if (err) return err;
            return ruteFile;
        });
        res.send("/erp/"+codigo_empresa+"/html/"+req.body.nameFile+".html");
        // res.redirect(nameFile);
    }catch(err){
        res.send(err.message);
    }
});

router.get('/prueba',async (req, res) => {
    res.render("modulos/ventas/prueba");
});

module.exports = router;