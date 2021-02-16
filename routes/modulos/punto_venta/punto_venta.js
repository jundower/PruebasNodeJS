const express = require('express');
const router = express.Router();
const {isLoggedin} = require('../../../lib/auth');
const fs = require('fs');
const path = require('path');

router.get('/toma_pedidos',isLoggedin,async (req, res) => {
    res.render("modulos/punto_venta/toma_pedidos");
});

router.get('/guia_remision',isLoggedin,async (req, res) => {
    res.render("modulos/punto_venta/guia_remision");
});

router.get('/terminal_pos',isLoggedin,async (req, res) => {
    res.render("modulos/punto_venta/terminal_pos");
});

router.get('/sunat',isLoggedin,async (req, res) => {
    res.render("modulos/punto_venta/sunat");
});

router.get('/configuracion_cobrador',isLoggedin,async (req, res) => {
    res.render("modulos/punto_venta/configuracion_cobrador");
});

router.get('/configuracion_tarjeta',isLoggedin,async (req, res) => {
    res.render("modulos/punto_venta/configuracion_tarjeta");
});

router.get('/configuracion_tipo_pago',isLoggedin,async (req, res) => {
    res.render("modulos/punto_venta/configuracion_tipo_pago");
});

router.get('/eliminar_saldos/:modulo',isLoggedin,async (req, res) => {
    const { modulo } = req.params;
    res.render('modulos/mantenimientos/eliminar_saldos', {modulo: modulo});
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


module.exports = router;