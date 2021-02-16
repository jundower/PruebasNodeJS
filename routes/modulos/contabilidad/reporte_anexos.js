const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../../database');

router.post('/reporte_anexos', async (req, res) => {
    try{
        console.log(req.body);
        const codigo_empresa = req.user.codigo_empresa;
        const ejercicio = req.body.ejercicio;
        const tipo_anexo = req.body.tipo_anexo;
        const p_inicial = req.body.periodo_inicial;
        const p_final = req.body.periodo_final;
        var cuenta = "NINGUNO";
        var anexo = "NINGUNO";
        const cuentas = JSON.parse(req.body.cuentas);
        const anexos = JSON.parse(req.body.anexos);
        var codigo_random= 0;

        if(cuentas.length>0){
            cuenta = 'PLANCON'
            var query_cuenta;
            query_cuenta="delete from Erp_Table_reporte; insert into Erp_Table_reporte ( erp_id , erp_tipo , erp_codigo , erp_codigo_02 , erp_agrupacion ) Values "
            var pool = await poolPromise;
            for(var i=0; i<cuentas.length; i++){
                var codigo_cuenta = cuentas[i];
                query_cuenta+="('"+codigo_random+"','"+cuenta+"','"+codigo_cuenta+"','','1'),";

            }
            query_cuenta = query_cuenta.slice(0,-1);
            var lista = await pool
            .request()
            .query(query_cuenta);
        }
        else{
            var pool = await poolPromise;
            var lista = await pool
            .request()
            .query("delete from Erp_Table_reporte; insert into Erp_Table_reporte ( erp_id , erp_tipo , erp_codigo , erp_codigo_02 , erp_agrupacion ) Values ('"+codigo_random+"', 'NINGUNO','(TODOS)','','1')");
        }
        if(anexos.length>0){
            anexo = 'ANEXO'
            var query_anexo;
            query_anexo="insert into Erp_Table_reporte ( erp_id , erp_tipo , erp_codigo , erp_codigo_02 , erp_agrupacion ) Values "
            var pool = await poolPromise;
            for(var i=0; i<anexos.length; i++){
                var codigo_anexos = anexos[i];
                query_anexo+="('"+codigo_random+"','"+anexo+"','"+codigo_anexos+"','','2'),";

            }
            query_anexo = query_anexo.slice(0,-1);
            var lista = await pool
            .request()
            .query(query_anexo);
        }else{
            var pool = await poolPromise;
            var lista = await pool
            .request()
            .query("insert into Erp_Table_reporte ( erp_id , erp_tipo , erp_codigo , erp_codigo_02 , erp_agrupacion ) Values ('"+codigo_random+"', 'NINGUNO','(TODOS)','','2')");
        }

        var pool = await poolPromise;
        var lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('ejercicio', mssql.VarChar(10), ejercicio)
        .input('tipo_anexo', mssql.VarChar(250), tipo_anexo)
        .input('p_inicial', mssql.VarChar(250), p_inicial)
        .input('p_final', mssql.VarChar(250), p_final)
        .input('cuenta', mssql.VarChar(250), cuenta)
        .input('anexo', mssql.VarChar(50), anexo)
        .input('codigo_random', mssql.VarChar(50), codigo_random)
        .query("exec sq_reporte_anexos @codigo_empresa,@ejercicio,@tipo_anexo,@p_inicial,@p_final,@cuenta,@anexo,@codigo_random");
    
        const recordset = lista.recordset;
        res.json(recordset);
    }catch(err){
        console.log(err.message);
        res.send(err.message);
    }
});

module.exports = router;