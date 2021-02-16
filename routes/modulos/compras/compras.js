const express = require('express');
const router = express.Router();
const {isLoggedin} = require('../../../lib/auth');

router.get('/requerimientos',isLoggedin,async (req, res) => {
    res.render("modulos/compras/requerimientos");
});

router.get('/orden_compra',isLoggedin,async (req, res) => {
    var razon_social=req.user.razon_social;
    res.render("modulos/compras/orden_compra", {razon_social: razon_social});
});

router.get('/pre_cotizacion',isLoggedin,async (req, res) => {
    var razon_social=req.user.razon_social;
    res.render("modulos/compras/pre_cotizacion", {razon_social: razon_social});
});

router.get('/comparativo_precios',isLoggedin,async (req, res) => {
    var razon_social=req.user.razon_social;
    res.render("modulos/compras/comparativo_precios", {razon_social: razon_social});
});

router.get('/aprobacion_comparativo_precios',isLoggedin,async (req, res) => {
    var razon_social=req.user.razon_social;
    res.render("modulos/compras/aprobacion_comparativo_precios", {razon_social: razon_social});
});

router.get('/reportes/:modulo',isLoggedin,async (req, res) => {
    const { modulo } = req.params;
    res.render("modulos/mantenimientos/reportes",{modulo: modulo});
});

router.get('/eliminar_saldos/:modulo',isLoggedin,async (req, res) => {
    const { modulo } = req.params;
    res.render('modulos/mantenimientos/eliminar_saldos', {modulo: modulo});
});

router.get('/aprobaciones/:modulo',isLoggedin,async (req, res) => {
    const { modulo } = req.params;
    res.render('modulos/mantenimientos/aprobaciones', {modulo: modulo});
});

router.get('/dua',isLoggedin,async (req, res) => {
    var razon_social=req.user.razon_social;
    res.render("modulos/compras/dua", {razon_social: razon_social});
});

module.exports = router;