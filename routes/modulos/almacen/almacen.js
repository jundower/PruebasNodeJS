const express = require('express');
const router = express.Router();
const {isLoggedin} = require('../../../lib/auth');

router.get('/guia_entrada',isLoggedin,async (req, res) => {
    res.render("modulos/almacen/guia_entrada");
});

router.get('/transaccion_almacen',isLoggedin,async (req, res) => {
    res.render("modulos/almacen/transaccion_almacen");
});

router.get('/ingreso_kits',isLoggedin,async (req, res) => {
    res.render("modulos/almacen/ingreso_kits");
});

router.get('/generacion_tickets',isLoggedin,async (req, res) => {
    res.render("modulos/almacen/generacion_tickets");
});

router.get('/reportes/:modulo',isLoggedin,async (req, res) => {
    const { modulo } = req.params;
    res.render("modulos/mantenimientos/reportes",{modulo: modulo});
});

router.get('/kardex',isLoggedin,async (req, res) => {
    res.render("modulos/almacen/kardex");
});

router.get('/kardex_lote',isLoggedin,async (req, res) => {
    res.render("modulos/almacen/kardex_lote");
});

router.get('/kardex_serie',isLoggedin,async (req, res) => {
    res.render("modulos/almacen/kardex_serie");
});

router.get('/pruebas',async (req, res) => {
    const { modulo } = req.params;
    res.render("modulos/almacen/prueba",{layout: false});
});

router.get('/data.json',async (req, res) => {
var data  =[
		{"OrderID":"10835","OrderDate":"1998-01-15 00:00:00","CustomerID":"ALFKI","EmployeeID":"1","Freight":"69.5300","ShipName":"Alfreds Futterkiste"},
		{"OrderID":"10952","OrderDate":"1998-03-16 00:00:00","CustomerID":"ALFKI","EmployeeID":"1","Freight":"40.4200","ShipName":"Alfreds Futterkiste"},
		{"OrderID":"11011","OrderDate":"1998-04-09 00:00:00","CustomerID":"ALFKI","EmployeeID":"3","Freight":"1.2100","ShipName":"Alfreds Futterkiste"},
		{"OrderID":"10692","OrderDate":"1997-10-03 00:00:00","CustomerID":"ALFKI","EmployeeID":"4","Freight":"61.0200","ShipName":"Alfreds Futterkiste"},
		{"OrderID":"10702","OrderDate":"1997-10-13 00:00:00","CustomerID":"ALFKI","EmployeeID":"4","Freight":"23.9400","ShipName":"Alfreds Futterkiste"},
		{"OrderID":"10643","OrderDate":"1997-08-25 00:00:00","CustomerID":"ALFKI","EmployeeID":"6","Freight":"29.4600","ShipName":"Alfreds Futterkiste"},
		{"OrderID":"10625","OrderDate":"1997-08-08 00:00:00","CustomerID":"ANATR","EmployeeID":"3","Freight":"43.9000","ShipName":"Ana Trujillo Emparedados y helados"},
		{"OrderID":"10759","OrderDate":"1997-11-28 00:00:00","CustomerID":"ANATR","EmployeeID":"3","Freight":"11.9900","ShipName":"Ana Trujillo Emparedados y helados"},
		{"OrderID":"10926","OrderDate":"1998-03-04 00:00:00","CustomerID":"ANATR","EmployeeID":"4","Freight":"39.9200","ShipName":"Ana Trujillo Emparedados y helados"},
		{"OrderID":"10308","OrderDate":"1996-09-18 00:00:00","CustomerID":"ANATR","EmployeeID":"7","Freight":"1.6100","ShipName":"Ana Trujillo Emparedados y helados"},
		{"OrderID":"10677","OrderDate":"1997-09-22 00:00:00","CustomerID":"ANTON","EmployeeID":"1","Freight":"4.0300","ShipName":"Antonio Moreno Taquer\u00eda"},
		{"OrderID":"10365","OrderDate":"1996-11-27 00:00:00","CustomerID":"ANTON","EmployeeID":"3","Freight":"22.0000","ShipName":"Antonio Moreno Taquer\u00eda"},
		{"OrderID":"10682","OrderDate":"1997-09-25 00:00:00","CustomerID":"ANTON","EmployeeID":"3","Freight":"36.1300","ShipName":"Antonio Moreno Taquer\u00eda"},
		{"OrderID":"10856","OrderDate":"1998-01-28 00:00:00","CustomerID":"ANTON","EmployeeID":"3","Freight":"58.4300","ShipName":"Antonio Moreno Taquer\u00eda"},
		{"OrderID":"10535","OrderDate":"1997-05-13 00:00:00","CustomerID":"ANTON","EmployeeID":"4","Freight":"15.6400","ShipName":"Antonio Moreno Taquer\u00eda"},
		{"OrderID":"10507","OrderDate":"1997-04-15 00:00:00","CustomerID":"ANTON","EmployeeID":"7","Freight":"47.4500","ShipName":"Antonio Moreno Taquer\u00eda"},
		{"OrderID":"10573","OrderDate":"1997-06-19 00:00:00","CustomerID":"ANTON","EmployeeID":"7","Freight":"84.8400","ShipName":"Antonio Moreno Taquer\u00eda"},
		{"OrderID":"10453","OrderDate":"1997-02-21 00:00:00","CustomerID":"AROUT","EmployeeID":"1","Freight":"25.3600","ShipName":"Around the Horn"},
		{"OrderID":"10558","OrderDate":"1997-06-04 00:00:00","CustomerID":"AROUT","EmployeeID":"1","Freight":"72.9700","ShipName":"Around the Horn"},
		{"OrderID":"10743","OrderDate":"1997-11-17 00:00:00","CustomerID":"AROUT","EmployeeID":"1","Freight":"23.7200","ShipName":"Around the Horn"},
		{"OrderID":"10768","OrderDate":"1997-12-08 00:00:00","CustomerID":"AROUT","EmployeeID":"3","Freight":"146.3200","ShipName":"Around the Horn"},
		{"OrderID":"10793","OrderDate":"1997-12-24 00:00:00","CustomerID":"AROUT","EmployeeID":"3","Freight":"4.5200","ShipName":"Around the Horn"},
		{"OrderID":"10707","OrderDate":"1997-10-16 00:00:00","CustomerID":"AROUT","EmployeeID":"4","Freight":"21.7400","ShipName":"Around the Horn"},
		{"OrderID":"10741","OrderDate":"1997-11-14 00:00:00","CustomerID":"AROUT","EmployeeID":"4","Freight":"10.9600","ShipName":"Around the Horn"},
		{"OrderID":"10864","OrderDate":"1998-02-02 00:00:00","CustomerID":"AROUT","EmployeeID":"4","Freight":"3.0400","ShipName":"Around the Horn"},
		{"OrderID":"10920","OrderDate":"1998-03-03 00:00:00","CustomerID":"AROUT","EmployeeID":"4","Freight":"29.6100","ShipName":"Around the Horn"},
		{"OrderID":"10355","OrderDate":"1996-11-15 00:00:00","CustomerID":"AROUT","EmployeeID":"6","Freight":"41.9500","ShipName":"Around the Horn"},
		{"OrderID":"10383","OrderDate":"1996-12-16 00:00:00","CustomerID":"AROUT","EmployeeID":"8","Freight":"34.2400","ShipName":"Around the Horn"},
		{"OrderID":"10953","OrderDate":"1998-03-16 00:00:00","CustomerID":"AROUT","EmployeeID":"9","Freight":"23.7200","ShipName":"Around the Horn"},
		{"OrderID":"11016","OrderDate":"1998-04-10 00:00:00","CustomerID":"AROUT","EmployeeID":"9","Freight":"33.8000","ShipName":"Around the Horn"},
		{"OrderID":"10524","OrderDate":"1997-05-01 00:00:00","CustomerID":"BERGS","EmployeeID":"1","Freight":"244.7900","ShipName":"Berglunds snabbk\u00f6p"},
		{"OrderID":"10626","OrderDate":"1997-08-11 00:00:00","CustomerID":"BERGS","EmployeeID":"1","Freight":"138.6900","ShipName":"Berglunds snabbk\u00f6p"},
		{"OrderID":"10689","OrderDate":"1997-10-01 00:00:00","CustomerID":"BERGS","EmployeeID":"1","Freight":"13.4200","ShipName":"Berglunds snabbk\u00f6p"},
		{"OrderID":"10733","OrderDate":"1997-11-07 00:00:00","CustomerID":"BERGS","EmployeeID":"1","Freight":"110.1100","ShipName":"Berglunds snabbk\u00f6p"},
		{"OrderID":"10280","OrderDate":"1996-08-14 00:00:00","CustomerID":"BERGS","EmployeeID":"2","Freight":"8.9800","ShipName":"Berglunds snabbk\u00f6p"},
		{"OrderID":"10384","OrderDate":"1996-12-16 00:00:00","CustomerID":"BERGS","EmployeeID":"3","Freight":"168.6400","ShipName":"Berglunds snabbk\u00f6p"},
		{"OrderID":"10444","OrderDate":"1997-02-12 00:00:00","CustomerID":"BERGS","EmployeeID":"3","Freight":"3.5000","ShipName":"Berglunds snabbk\u00f6p"},
		{"OrderID":"10445","OrderDate":"1997-02-13 00:00:00","CustomerID":"BERGS","EmployeeID":"3","Freight":"9.3000","ShipName":"Berglunds snabbk\u00f6p"},
		{"OrderID":"10572","OrderDate":"1997-06-18 00:00:00","CustomerID":"BERGS","EmployeeID":"3","Freight":"116.4300","ShipName":"Berglunds snabbk\u00f6p"},
		{"OrderID":"10778","OrderDate":"1997-12-16 00:00:00","CustomerID":"BERGS","EmployeeID":"3","Freight":"6.7900","ShipName":"Berglunds snabbk\u00f6p"},
		{"OrderID":"10924","OrderDate":"1998-03-04 00:00:00","CustomerID":"BERGS","EmployeeID":"3","Freight":"151.5200","ShipName":"Berglunds snabbk\u00f6p"},
		{"OrderID":"10875","OrderDate":"1998-02-06 00:00:00","CustomerID":"BERGS","EmployeeID":"4","Freight":"32.3700","ShipName":"Berglunds snabbk\u00f6p"},
		{"OrderID":"10654","OrderDate":"1997-09-02 00:00:00","CustomerID":"BERGS","EmployeeID":"5","Freight":"55.2600","ShipName":"Berglunds snabbk\u00f6p"},
		{"OrderID":"10866","OrderDate":"1998-02-03 00:00:00","CustomerID":"BERGS","EmployeeID":"5","Freight":"109.1100","ShipName":"Berglunds snabbk\u00f6p"},
		{"OrderID":"10278","OrderDate":"1996-08-12 00:00:00","CustomerID":"BERGS","EmployeeID":"8","Freight":"92.6900","ShipName":"Berglunds snabbk\u00f6p"},
		{"OrderID":"10857","OrderDate":"1998-01-28 00:00:00","CustomerID":"BERGS","EmployeeID":"8","Freight":"188.8500","ShipName":"Berglunds snabbk\u00f6p"},
		{"OrderID":"10672","OrderDate":"1997-09-17 00:00:00","CustomerID":"BERGS","EmployeeID":"9","Freight":"95.7500","ShipName":"Berglunds snabbk\u00f6p"},
		{"OrderID":"10837","OrderDate":"1998-01-16 00:00:00","CustomerID":"BERGS","EmployeeID":"9","Freight":"13.3200","ShipName":"Berglunds snabbk\u00f6p"},
		{"OrderID":"10582","OrderDate":"1997-06-27 00:00:00","CustomerID":"BLAUS","EmployeeID":"3","Freight":"27.7100","ShipName":"Blauer See Delikatessen"},
		{"OrderID":"10509","OrderDate":"1997-04-17 00:00:00","CustomerID":"BLAUS","EmployeeID":"4","Freight":"0.1500","ShipName":"Blauer See Delikatessen"}
    ];
    res.json(data)
});
module.exports = router;