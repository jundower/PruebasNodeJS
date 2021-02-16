var fecha_trabajo=new Date();
var grid_reporte_documentos='reporte-documentos'

var jq_grid_tablas;
var cabecera;
var modal_tablas_titulo="";
var columnas=[];
var modulo_tablas;
var url_tablas;
var concepto;
var jq_group_listas_precios;
var jq_grid_tablas_mantenimientos;
var estado_tablas="Guardar";
var tablas_listas_precios;
var lastsel2;
var lista_almacenes="";
var lista_tipo_productos="";
var fila_vacia_grid={};
var selected_cell_lista_precios = "";
var rowid_selected_lista_precios = "";
var id_fila_seleccionada;
var rowid_dblclick_detalle_contable = "";
var rowid_dblclick_cuentas = "";
var rowid_dblclick_cuentas_subvoucher = "";

$(document).ready(function() {
    $('#modal_tablas_guardar').click(function (){
        guardar_tablas(modulo_tablas);

    });    
    // $(".nav-tab-rounded").click(function(e) {
    //     $("li").removeClass("active");
    //     $(this).addClass("active");
    // });
});

function cargar_configuracion(){
    modulo_tablas = $("#modulo_tablas").text();
    url_tablas='/'+modulo_tablas+'/lista/';
    modal_tablas_titulo=modulo_tablas;

    // if (modulo_tablas.slice(0, -1) == "conceptos") {
    //     modal_tablas_titulo = modulo_tablas.slice(-1) == "1"? "Categoria": modulo_tablas.slice(-1) == "2"? "Tamaño" : modulo_tablas.slice(-1) == "3"? "Dimension":modulo_tablas.slice(-1) == "4"?"Marca":modulo_tablas.slice(-1) == "5"?"Diseño":modulo_tablas.slice(-1) == "6"?"Color": "Concepto";
    //     concepto = modulo_tablas.slice(-1);
    //     modulo_tablas = modulo_tablas.slice(0, -1);
    //     url_tablas='/'+modulo_tablas+'/lista/'+concepto;
    // }
    
    switch (modulo_tablas) {
        case "vendedor":
            columnas=[
                {name: 'Codigo', width: 200, template: textTemplate},
                {name: 'Nombre', width: 200, template: textTemplate},
                {name: 'Email', width: 200, template: textTemplate},
                {name: 'Celular', width: 200, template: textTemplate},
                {name: 'Telefono1', width: 200, template: textTemplate},
                {name: 'Telefono2', width: 200, template: textTemplate},
                {name: 'Telefono3', width: 200, template: textTemplate},
                {name: 'Telefono4', width: 200, template: textTemplate},
            ]
            modal_tablas_titulo="Vendedor";
        break;
        case "almacen":
            columnas=[
                {name: 'Codigo', width: 200, template: textTemplate},
                {name: 'Nombre', width: 200, template: textTemplate},
                {name: 'Direccion', width: 200, template: textTemplate},
                {name: 'Responsable', width: 200, template: textTemplate},
            ]
            modal_tablas_titulo="Almacén";
            url_tablas='/almacen/lista_almacen/';
        break;
        case "punto_venta":
            columnas=[
                {name: 'Codigo', width: 200, template: textTemplate},
                {name: 'Nombre', width: 200, template: textTemplate},
                {name: 'Direccion', width: 200, template: textTemplate},
                {name: 'Almacen', width: 200, template: textTemplate},
            ]
            modal_tablas_titulo="Punto de Venta";
        break;
        case "empleados":
            columnas=[
                {name: 'Codigo', width: 200, template: textTemplate},
                {name: 'Nombre', width: 200, template: textTemplate},
                {name: 'Direccion', width: 200, template: textTemplate},
                {name: 'Codigo_Usuario', width: 200, template: textTemplate},
                {name: 'Fecha_Ingreso', width: 200, template: textTemplate},
                {name: 'Sexo', width: 200, template: textTemplate},
                {name: 'Aprobar_Pedido', width: 200, template: textTemplate},
                {name: 'Pais', width: 200, template: textTemplate},
                {name: 'Genera_OC', width: 200, template: textTemplate},
                {name: 'Email', width: 200, template: textTemplate},
                {name: 'Erp_cargo', width: 200, template: textTemplate},
                {name: 'Erp_Aprob_Cot', width: 200, template: textTemplate},
                {name: 'Tipo_Documento', width: 200, template: textTemplate},
                {name: 'Numero_Documento', width: 200, template: textTemplate},
                {name: 'Aprobar_Req', width: 200, template: textTemplate},
            ]
            modal_tablas_titulo="Empleados";
        break;
        case "productos":
            columnas=[
                { name: "Codigo", width:200, template: textTemplate},
                { name: "Codigo_Fabricante", width:200, template: textTemplate},
                { name: "Nombre", width:200, template: textTemplate},
                { name: "Tipo_Producto", width:200, template: textTemplate},
                { name: "Estado", width:200, template: textTemplate},
                { name: "Familia", width:200, template: textTemplate},
                { name: "SubFamilia", width:200, template: textTemplate},
                { name: "Categoria", width:200, template: textTemplate},
                { name: "Concepto1", width:200, template: textTemplate},
                { name: "Concepto2", width:200, template: textTemplate},
                { name: "Concepto3", width:200, template: textTemplate},
                { name: "Concepto4", width:200, template: textTemplate},
                { name: "Concepto5", width:200, template: textTemplate},
                { name: "Concepto6", width:200, template: textTemplate},
                { name: "Concepto7", width:200, template: textTemplate},
                { name: "Ubicacion1", width:200, template: textTemplate},
                { name: "Ubicacion2", width:200, template: textTemplate},
                { name: "Leyenda1", width:200, template: textTemplate},
                { name: "Leyenda2", width:200, template: textTemplate},
                { name: "Codigo_Interno1", width:200, template: textTemplate},
                { name: "Codigo_Interno2", width:200, template: textTemplate},
                { name: "Codigo_Digemid", width:200, template: textTemplate},
                { name: "Codigo_UNSPC", width:200, template: textTemplate},
                { name: "Control_Stock", width:200, template: textTemplate},
                { name: "Lote_SN", width:200, template: textTemplate},
                { name: "Serie_SN", width:200, template: textTemplate},
                { name: "Servicio", width:200, template: textTemplate},
                { name: "Codigo_Tipo_Producto", width:200, template: textTemplate},
                { name: "Codigo_Familia", width:200, template: textTemplate},
                { name: "Codigo_SubFamilia", width:200, template: textTemplate},
                { name: "Codigo_Concepto1", width:200, template: textTemplate},
                { name: "Codigo_Concepto2", width:200, template: textTemplate},
                { name: "Codigo_Concepto3", width:200, template: textTemplate},
                { name: "Codigo_Concepto4", width:200, template: textTemplate},
                { name: "Codigo_Concepto5", width:200, template: textTemplate},
                { name: "Codigo_Concepto6", width:200, template: textTemplate},
                { name: "Codigo_Concepto7", width:200, template: textTemplate},
                { name: "Igv_Art", width:200, template: textTemplate},
            ]
            modal_tablas_titulo="Productos";
        break;
        case "agencia_transporte":
            columnas=[
                {name: 'Codigo', width: 200, template: textTemplate},
                {name: 'Nombre', width: 200, template: textTemplate},
                {name: 'Direccion', width: 200, template: textTemplate},
                {name: 'Telefono', width: 200, template: textTemplate},
                {name: 'Telefono2', width: 200, template: textTemplate},
                {name: 'Telefono3', width: 200, template: textTemplate},
                {name: 'Web', width: 200, template: textTemplate},
                {name: 'Correo', width: 200, template: textTemplate},
                {name: 'Ruc', width: 200, template: textTemplate},
                {name: 'Observacion', width: 200, template: textTemplate},
                {name: 'Contacto', width: 200, template: textTemplate},
            ]
            modal_tablas_titulo="Agencia de Transporte";
        break;
        case "transportista":
            columnas=[
                {name: 'Codigo', width: 200, template: textTemplate},
                {name: 'Nombre', width: 200, template: textTemplate},
                {name: 'Ruc', width: 200, template: textTemplate},
                {name: 'Razon_Social', width: 200, template: textTemplate},
                {name: 'Direccion', width: 200, template: textTemplate},
                {name: 'Contacto', width: 200, template: textTemplate},
                {name: 'Telefono', width: 200, template: textTemplate},
                {name: 'Fax', width: 100, template: textTemplate},
                {name: 'Licencia', width: 200, template: textTemplate},
                {name: 'Vehiculo', width: 200, template: textTemplate},
            ]
            modal_tablas_titulo="Transportista";
        break;
        case "vehiculo":
            columnas=[
                {name: 'Codigo', width: 200, template: textTemplate},
                {name: 'Nombre', width: 200, template: textTemplate},
                {name: 'Modelo', width: 200, template: textTemplate},
                {name: 'N_inscripcion', width: 200, template: textTemplate},
            ]
            modal_tablas_titulo="Vehiculo";
        break;
        case "chofer":
            columnas=[
                {name: 'Codigo', width: 150, template: textTemplate},
                {name: 'Nombre', width: 300, template: textTemplate},
                {name: 'Tipo_Documento', width: 200, template: textTemplate},
                {name: 'Numero_Documento', width: 200, template: textTemplate},
                {name: 'Licencia', width: 200, template: textTemplate},
            ]
            modal_tablas_titulo="Chofer";
        break;
        case "clientes":
            columnas=[
                {name: 'Codigo', width: 200, template: textTemplate},
                {name: 'Nombre', width: 200, template: textTemplate},
                {name: 'Tipo_Cliente', width: 200, template: textTemplate},
                {name: 'Numero_Doc', width: 200, template: textTemplate},
                {name: 'Numero_Ruc', width: 200, template: textTemplate},
                {name: 'Direccion', width: 200, template: textTemplate},
                {name: 'Telefono', width: 200, template: textTemplate},
                {name: 'Pais', width: 200, template: textTemplate},
                {name: 'Departamento', width: 200, template: textTemplate},
                {name: 'Distrito', width: 200, template: textTemplate},
                {name: 'Ciudad', width: 200, template: textTemplate},
                {name: 'Observacion1', width: 200, template: textTemplate},
                {name: 'Observacion2', width: 200, template: textTemplate},
                {name: 'Estado', width: 200, template: textTemplate},
                {name: 'Codigo_Internoo', width: 200, template: textTemplate},
                {name: 'Usuario', width: 200, template: textTemplate},
                {name: 'Pc_user ', width: 200, template: textTemplate},
                {name: 'Pc_Fecha', width: 200, template: textTemplate},
                {name: 'Pc_ip', width: 200, template: textTemplate},
                {name: 'Fecha_Modidificacion', width: 200, template: textTemplate},
                {name: 'Codigo_Pais', width: 200, template: textTemplate},
                {name: 'Codigo_Departamento', width: 200, template: textTemplate},
                {name: 'Codigo_Distrito', width: 200, template: textTemplate},
                {name: 'Codigo_Ciudad', width: 200, template: textTemplate},
            ]
            modal_tablas_titulo="Clientes";
        break;
        case "proveedores":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 250, template: textTemplate},
                {name: 'Tipo_Proveedor', width: 100, template: textTemplate},
                {name: 'Numero_Doc', width: 100, template: textTemplate},
                {name: 'Numero_Ruc', width: 100, template: textTemplate},
                {name: 'Direccion', width: 200, template: textTemplate},
                {name: 'Telefono', width: 200, template: textTemplate},
                {name: 'Pais', width: 200, template: textTemplate},
                {name: 'Observacion1', width: 200, template: textTemplate},
                {name: 'Observacion2', width: 200, template: textTemplate},
                {name: 'Estado', width: 200, template: textTemplate},
                {name: 'Usuario', width: 200, template: textTemplate},
                {name: 'Pc_user ', width: 200, template: textTemplate},
                {name: 'Pc_Fecha', width: 200, template: textTemplate},
                {name: 'Pc_ip', width: 200, template: textTemplate},
                {name: 'Fecha_Modidificacion', width: 200, template: textTemplate},
                {name: 'Codigo_Pais', width: 200, template: textTemplate},
            ]
            modal_tablas_titulo="Proveedores";
        break;
        case "gestor_cobranza":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 200, template: textTemplate},
                {name: 'Email', width: 200, template: textTemplate},
                {name: 'Celular', width: 100, template: textTemplate},
                {name: 'Telefono1', width: 100, template: textTemplate},
                {name: 'Telefono2', width: 100, template: textTemplate},
                {name: 'Cargo', width: 200, template: textTemplate},
            ]
            modal_tablas_titulo="Gestor De Cobranza";
        break;
        case "cobrador":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 250, template: textTemplate},
                {name: 'Email', width: 250, template: textTemplate},
                {name: 'Telefono1', width: 100, template: textTemplate},
                {name: 'Telefono2', width: 100, template: textTemplate},
            ]
            modal_tablas_titulo="Cobrador";
        break; 
        case "grupo_cliente":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 200, template: textTemplate},
                {name: 'Fecha_Modificacion', width: 200, template: textTemplate},
                {name: 'PC', width: 200, template: textTemplate},
                {name: 'Hora_Modificacion', width: 200, template: textTemplate},
                {name: 'Ip_Cliente', width: 200, template: textTemplate},
                {name: 'Usuario', width: 200, template: textTemplate},
            ]
            modal_tablas_titulo="Grupo Clientes";
        break;
        case "grupo_proveedor":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 200, template: textTemplate},
                {name: 'Fecha_Modificacion', width: 200, template: textTemplate},
                {name: 'PC', width: 200, template: textTemplate},
                {name: 'Hora_Modificacion', width: 200, template: textTemplate},
                {name: 'Ip_Cliente', width: 200, template: textTemplate},
                {name: 'Usuario', width: 200, template: textTemplate},
            ]
            modal_tablas_titulo="Grupo Proveedores";
        break;
        case "tipo_productos":
            columnas=[
                {name: 'Codigo', width: 100, template:textTemplate},
                {name: 'Nombre', width: 200, template:textTemplate},
                {name: 'Codigo_Sunat', width: 100, template:textTemplate},
                {name: 'Fecha_Modificacion', width: 150, template:textTemplate},
                {name: 'PC', width: 200, template:textTemplate},
                {name: 'Hora_Modificacion', width: 150, template:textTemplate},
                {name: 'Ip_Cliente', width: 150, template:textTemplate},
                {name: 'Usuario', width: 150, template:textTemplate},
            ]
            modal_tablas_titulo="Tipo Productos";
        break;
        case "tipo_documento":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 300, template: textTemplate},
                {name: 'Codigo_Sunat', width: 100, template: textTemplate},
                {name: 'Compras', width: 100, template: textTemplate},
                {name: 'Ventas', width: 100, template: textTemplate},
                {name: 'Contabilidad', width: 100, template: textTemplate},
                {name: 'Almacen', width: 100, template: textTemplate},
                {name: 'Csigno', width: 100, template: textTemplate},
                {name: 'Valor_Signo', width: 100, template: textTemplate},
                {name: 'Aplica_Prc', width: 100, template: textTemplate},
                {name: 'Min_A_Prc', width: 100, template: textTemplate},
                {name: 'Genera_Credfis', width: 100, template: textTemplate},
                {name: 'Cantidad_Caracteres', width: 100, template: textTemplate},
                {name: 'Porcentaje_Igv', width: 100, template: textTemplate},
                {name: 'Renta_Cuarta', width: 100, template: textTemplate},
                {name: 'Fecha_Tc', width: 100, template: textTemplate},
                {name: 'Ruta_Formato', width: 100, template: textTemplate},
                {name: 'Tipo_Talonario', width: 100, template: textTemplate},
                {name: 'Caja', width: 100, template: textTemplate},
                {name: 'Fecha_Modificacion', width: 100, template: textTemplate},
                {name: 'PC', width: 100, template: textTemplate},
                {name: 'Hora_Pc', width: 100, template: textTemplate},
                {name: 'Ip_Cliente', width: 100, template: textTemplate},
                {name: 'Usuario', width: 100, template: textTemplate},
                {name: 'Punto_Venta', width: 100, template: textTemplate},
                {name: 'Tipo_Formato', width: 100, template: textTemplate},
            ]
            modal_tablas_titulo="Tipo Documentos";
        break;
        case "talonarios":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate, hidden: true},
                {name: 'Nombre', width: 100, template: textTemplate, hidden: true},
                {name: 'Punto_Venta', width: 200, template: textTemplate},
                {name: 'Tipo_Documento', width: 200, template: textTemplate},
                {name: 'Numero_Serie', width: 100, template: textTemplate},
                {name: 'Ultimo_Grab', width: 100, template: textTemplate},
                {name: 'Activo', width: 100, template: textTemplate},
                {name: 'Predeterminado', width: 100, template: textTemplate},
                {name: 'Ruta_Formato', width: 100, template: textTemplate},
                {name: 'Num_Filas', width: 100, template: textTemplate},
                {name: 'Ancho', width: 100, template: textTemplate},
                {name: 'A4', width: 100, template: textTemplate},
                {name: 'Alto', width: 100, template: textTemplate},
                {name: 'Fecha_Modificacion', width: 100, template: textTemplate},
                {name: 'PC', width: 150, template: textTemplate},
                {name: 'Hora_Pc', width: 100, template: textTemplate},
                {name: 'Ip_Cliente', width: 100, template: textTemplate},
                {name: 'Usuario', width: 100, template: textTemplate}, 
            ]
            modal_tablas_titulo="Talonarios";
        break;
        case "motivos_tramite":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 200, template: textTemplate},
                {name: 'Tipo_Documento', width: 250, template: textTemplate},
                {name: 'Formato', width: 300, template: textTemplate},
                {name: 'Predeterminado', width: 100, template: textTemplate},
                {name: 'Ruta_Impresora', width: 200, template: textTemplate},
                {name: 'Pc_ip', width: 100, template: textTemplate},
                {name: 'Usuario', width: 100, template: textTemplate},
                {name: 'Fecha_Modificacion', width: 100, template: textTemplate},
                {name: 'Pc_user', width: 200, template: textTemplate},
            ]
            modal_tablas_titulo="Motivos de Tramite";
        break;
        case "forma_pago":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 250, template: textTemplate},
                {name: 'Pagado', width: 100, template: textTemplate},
                {name: 'Dias', width: 100, template: textTemplate},
                {name: 'Letras', width: 100, template: textTemplate},
                {name: 'Percepcion', width: 100, template: textTemplate},
                {name: 'Fecha_modificacion', width: 100, template: textTemplate},
                {name: 'Usuario', width: 100, template: textTemplate},
                {name: 'Equipo', width: 150, template: textTemplate},
                {name: 'Hora_Pc', width: 100, template: textTemplate},
                {name: 'Ip_Cliente', width: 100, template: textTemplate},
                {name: 'Activo', width: 100, template: textTemplate},
                {name: 'Predeterminado', width: 100, template: textTemplate}, 
            ]
            modal_tablas_titulo="Forma de Pago";
        break;
        case "cencos":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 200, template: textTemplate},
                {name: 'Responsable', width: 200, template: textTemplate},
                {name: 'Abreviatura', width: 100, template: textTemplate},
                {name: 'Nivel', width: 100, template: textTemplate},
                {name: 'Fecha_Modificacion', width: 150, template: textTemplate},
                {name: 'Pc_user', width: 150, template: textTemplate},
                {name: 'Pc_Fecha', width: 100, template: textTemplate},
                {name: 'Pc_ip', width: 150, template: textTemplate},
                {name: 'Usuario', width: 150, template: textTemplate},
            ]
            modal_tablas_titulo="Centro de Costos";
        break;
        case "unidad_negocios":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 200, template: textTemplate},
                {name: 'Direccion', width: 200, template: textTemplate},
                {name: 'Nivel', width: 100, template: textTemplate},
                {name: 'Fecha_Modificacion', width: 150, template: textTemplate},
                {name: 'Pc_user', width: 150, template: textTemplate},
                {name: 'Pc_Fecha', width: 100, template: textTemplate},
                {name: 'Pc_ip', width: 150, template: textTemplate},
                {name: 'Usuario', width: 150, template: textTemplate},
            ]
            modal_tablas_titulo="Unidad de Negocios";
        break;
        case "orden_trabajo":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 200, template: textTemplate},
                {name: 'Abreviatura', width: 100, template: textTemplate},
                {name: 'Orden_Servicio', width: 100, template: textTemplate},
                {name: 'Fecha_Inicio', width: 150, template: textTemplate},
                {name: 'Fecha_Final', width: 150, template: textTemplate},
                {name: 'Presupuesto', width: 100, template: textTemplate},
                {name: 'Observacion', width: 150, template: textTemplate},
                {name: 'Observacion2', width: 150, template: textTemplate},
                {name: 'Observacion3', width: 100, template: textTemplate},
                {name: 'Fecha_Hora_Modificacion', width: 150, template: textTemplate},
                {name: 'Fecha_Modificacion', width: 150, template: textTemplate},
                {name: 'Pc_user', width: 150, template: textTemplate},
                {name: 'Pc_ip', width: 150, template: textTemplate},
                {name: 'Pc_Fecha', width: 150, template: textTemplate},
                {name: 'Usuario', width: 100, template: textTemplate},
            ]
            modal_tablas_titulo="Orden de Trabajo";
        break;
        case "partida_gasto":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 200, template: textTemplate},
                {name: 'Abreviatura', width: 100, template: textTemplate},
                {name: 'Operacion', width: 100, template: textTemplate},
                {name: 'Cuenta1', width: 100, template: textTemplate},
                {name: 'Cuenta2', width: 100, template: textTemplate},
                {name: 'Cuenta3', width: 100, template: textTemplate},
                {name: 'Cuenta4', width: 100, template: textTemplate},
                {name: 'Cuenta5', width: 100, template: textTemplate},
                {name: 'Usuario', width: 150, template: textTemplate},
                {name: 'Pc_User', width: 150, template: textTemplate},
                {name: 'Fecha', width: 100, template: textTemplate},
                {name: 'Ip_Cliente', width: 100, template: textTemplate},
            ]
            modal_tablas_titulo="Partida de Gastos / Ingresos";
        break;
        case "presupuesto":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 200, template: textTemplate},
                {name: 'Abreviatura', width: 100, template: textTemplate},
                {name: 'Responsable', width: 100, template: textTemplate},
                {name: 'Fecha_Modificacion', width: 100, template: textTemplate},
                {name: 'Pc_user', width: 200, template: textTemplate},
                {name: 'Pc_Fecha', width: 100, template: textTemplate},
                {name: 'Pc_ip', width: 100, template: textTemplate},
                {name: 'Usuario', width: 100, template: textTemplate},
                {name: 'Nivel', width: 150, template: textTemplate},
            ]
            modal_tablas_titulo="Partida Presupuestal";
        break;
        case "kits":
            columnas=[
                {name: 'Codigo', width: 150, template: textTemplate},
                {name: 'Nombre', width: 300, template: textTemplate},
                {name: 'Unidad', width: 100, template: textTemplate},
                {name: 'Familia', width: 150, template: textTemplate},
                {name: 'Subfamilia', width: 100, template: textTemplate},
                {name: 'Concepto01', width: 200, template: textTemplate},
                {name: 'Concepto02', width: 100, template: textTemplate},
                {name: 'Concepto03', width: 100, template: textTemplate},
                {name: 'Concepto04', width: 100, template: textTemplate},
                {name: 'Concepto05', width: 150, template: textTemplate},
                {name: 'Concepto06', width: 100, template: textTemplate},
                {name: 'Concepto07', width: 100, template: textTemplate},
                {name: 'Leyenda01', width: 150, template: textTemplate},
                {name: 'Leyenda02', width: 150, template: textTemplate},
                {name: 'Cod_Interno', width: 100, template: textTemplate},
                {name: 'Cod_Interno2', width: 100, template: textTemplate},
                {name: 'Cod_Interno3', width: 150, template: textTemplate},
                {name: 'Cod_Digamir', width: 100, template: textTemplate},
            ]
            modal_tablas_titulo="Ingreso de Kits";
        case "lista_precio_venta":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate}, 
                {name: 'Nombre', width: 200, template: textTemplate}, 
                {name: 'Interno', width: 100, template: textTemplate}, 
                {name: 'Unidad', width: 100, template: textTemplate}, 
                {name: 'Stock', width: 100, template: numberTemplate}, 
                {name: 'Costo', width: 100, template: numberTemplate}, 
                {name: 'L_Precio_01', width: 100, template: numberTemplate}, 
                {name: 'L_Precio_02', width: 100, template: numberTemplate}, 
                {name: 'L_Precio_03', width: 100, template: numberTemplate}, 
                {name: 'L_Precio_04', width: 100, template: numberTemplate}, 
                {name: 'L_Precio_05', width: 100, template: numberTemplate}, 
                {name: 'L_Precio_06', width: 100, template: numberTemplate}, 
                {name: 'L_Precio_07', width: 100, template: numberTemplate}, 
                {name: 'Familia', width: 100, template: textTemplate}, 
                {name: 'Subfamilia', width: 100, template: textTemplate}, 
                {name: 'Concepto01:', width: 100, template: textTemplate}, 
                {name: 'Concepto02:', width: 100, template: textTemplate}, 
                {name: 'Concepto03:', width: 100, template: textTemplate}, 
                {name: 'Concepto04:', width: 100, template: textTemplate}, 
                {name: 'Concepto05:', width: 100, template: textTemplate}, 
                {name: 'Concepto06:', width: 100, template: textTemplate}, 
                {name: 'Concepto07:', width: 100, template: textTemplate}, 
                {name: 'Leyenda01', width: 100, template: textTemplate}, 
                {name: 'Leyenda02', width: 100, template: textTemplate}, 
                {name: 'Factor', width: 100, template: numberTemplate}, 
                {name: 'mod1', width: 100, template: textTemplate}, 
                {name: 'mod2', width: 100, template: textTemplate}, 
                {name: 'mod3', width: 100, template: textTemplate}, 
                {name: 'mod4', width: 100, template: textTemplate}, 
                {name: 'mod5', width: 100, template: textTemplate}, 
                {name: 'mod6', width: 100, template: textTemplate}, 
                {name: 'mod7', width: 100, template: textTemplate}, 
            ]
            modal_tablas_titulo="Lista Precios Venta";

        break;
        case "usuario":
            columnas=[
                {name: 'Codigo', width: 200, template: textTemplate}, 
                {name: 'Nombre', width: 250, template: textTemplate}, 
                {name: 'Estado', width: 100, template: textTemplate}, 
                {name: 'Ver_Mov_Kardex', width: 150, template: textTemplate}, 
                {name: 'Ver_Mov_Compras', width: 150, template: textTemplate}, 
                {name: 'Ver_Com_Ventas', width: 150, template: textTemplate}
            ]
            modal_tablas_titulo="Usuarios";
            $("#permisos").show();
        break;
        case "familias":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 250, template: textTemplate},
                {name: 'Abreviatura', width: 100, template: textTemplate},
                {name: 'Cta_Debe', width: 100, template: textTemplate},
                {name: 'Cta_Haber', width: 100, template: textTemplate},
                {name: 'Cta_Provision', width: 100, template: textTemplate},
                {name: 'Cta_Diferencia', width: 100, template: textTemplate},
                {name: 'Cta_Costo_Debe', width: 100, template: textTemplate},
                {name: 'Cta_Costo_Haber', width: 100, template: textTemplate},
                {name: 'Costo_Dia', width: 100, template: numberTemplate},
                {name: 'Costo_Hora', width: 100, template: numberTemplate},
                {name: 'Cta_Produccion_Debe', width: 100, template: textTemplate},
                {name: 'Cta_Produccion_Haber', width: 100, template: textTemplate},
                {name: 'Cta_Nc_Dev', width: 100, template: textTemplate},
                {name: 'Alm_NE_Debe', width: 100, template: textTemplate},
                {name: 'Alm_NE_Haber', width: 100, template: textTemplate},
                {name: 'Alm_NS_Debe', width: 100, template: textTemplate},
                {name: 'Alm_NS_Haber', width: 100, template: textTemplate},
                {name: 'Fecha_Modificacion', width: 100, template: textTemplate},
                {name: 'Pc_Fecha', width: 100, template: textTemplate},
                {name: 'Usuario', width: 100, template: textTemplate},
                {name: 'Pc_user', width: 100, template: textTemplate},
                {name: 'Pc_ip', width: 100, template: textTemplate}
            ]
            modal_tablas_titulo="Familias";
        break;
        case "subfamilias":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 250, template: textTemplate},
                {name: 'Afecta_Nombre', width: 100, template: textTemplate},
                {name: 'Abreviatura', width: 100, template: textTemplate},
                {name: 'Fecha_Modificacion', width: 100, template: textTemplate},
                {name: 'Hora', width: 100, template: textTemplate},
                {name: 'Usuario', width: 100, template: textTemplate},
                {name: 'Pc_user', width: 100, template: textTemplate},
                {name: 'Pc_ip', width: 100, template: textTemplate}
            ]
            modal_tablas_titulo ="Subfamilas"
        break;
        case "plan_contable":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 250, template: textTemplate},
                {name: 'Nivel', width: 80, template: textTemplate},
                {name: 'Tipo_Auxiliar', width: 80, template: textTemplate},
                {name: 'Si_CenCos', width: 80, template: textTemplate},
                {name: 'Clase_Cuenta', width: 80, template: textTemplate},
                {name: 'Ajuste_Tc', width: 80, template: textTemplate},
                {name: 'Si_Ot', width: 80, template: textTemplate},
                {name: 'D_H', width: 80, template: textTemplate},
                {name: 'Si_Presupuesto', width: 100, template: textTemplate},
                {name: 'Daot', width: 80, template: textTemplate},
                {name: 'Si_Transferencia', width: 100, template: textTemplate},
                {name: 'Nombre_Presupuesto', width: 250, template: textTemplate},
                {name: 'Si_Genera_Diferencia', width: 100, template: textTemplate},
                {name: 'Ajuste_Tipo_Tc', width: 100, template: textTemplate},
                {name: 'Elemento', width: 100, template: textTemplate},
                {name: 'Moneda_Cierre', width: 100, template: textTemplate},
                {name: 'Bien_Servicio_Clasificacion', width: 100, template: textTemplate},
                {name: 'Fecha_Creacion', width: 100, template: textTemplate},
            ];
            modal_tablas_titulo = "Plan Contable"
        break;
        case "concepto1":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 250, template: textTemplate},
                {name: 'Abreviatura', width: 80, template: textTemplate},
            ];
            modal_tablas_titulo = "Concepto1";
        break;
        case "concepto2":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 250, template: textTemplate},
                {name: 'Abreviatura', width: 80, template: textTemplate},
            ];
            modal_tablas_titulo = "Concepto2";
        break;
        case "concepto3":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 250, template: textTemplate},
                {name: 'Abreviatura', width: 80, template: textTemplate},
            ];
            modal_tablas_titulo = "Concepto3";
        break;
        case "concepto4":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 250, template: textTemplate},
                {name: 'Abreviatura', width: 80, template: textTemplate},
            ];
            modal_tablas_titulo = "Concepto4";
        break;
        case "concepto5":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 250, template: textTemplate},
                {name: 'Abreviatura', width: 80, template: textTemplate},
            ];
            modal_tablas_titulo = "Concepto5";
        break;
        case "concepto6":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 250, template: textTemplate},
                {name: 'Abreviatura', width: 80, template: textTemplate},
            ];
            modal_tablas_titulo = "Concepto6";
        break;
        case "concepto7":
            columnas=[
                {name: 'Codigo', width: 100, template: textTemplate},
                {name: 'Nombre', width: 250, template: textTemplate},
                {name: 'Abreviatura', width: 80, template: textTemplate},
            ];
            modal_tablas_titulo = "Concepto7";
        break;
        case "subvoucher":
            columnas=[
                {name: 'Codigo', width: 80, template: textTemplate},
                {name: 'Nombre', width: 300, template: textTemplate},
                {name: 'Abreviatura', width: 100, template: textTemplate},
                {name: 'Si_Transferencia', width: 100, template: textTemplate},
                {name: 'Si_Compras', width: 100, template: textTemplate},
                {name: 'Si_Ventas', width: 100, template: textTemplate},
                {name: 'Si_Contable', width: 100, template: textTemplate},
                {name: 'Si_Cancelacion', width: 100, template: textTemplate},
                {name: 'Si_Diferencia', width: 100, template: textTemplate},
                {name: 'Si_CalculaMonedas', width: 100, template: textTemplate},
                {name: 'Caracteres', width: 100, template: textTemplate},
            ];
            modal_tablas_titulo = "SubVouchers";
        break;
        case "tipo_auxiliar":
            columnas=[
                {name: 'Codigo', width: 80, template: textTemplate},
                {name: 'Nombre', width: 300, template: textTemplate},
            ]
            modal_tablas_titulo = "Tipo de Auxiliar";
        break;
        case "grupo_auxiliar":
            columnas=[
                {name: 'Codigo', width: 80, template: textTemplate},
                {name: 'Nombre', width: 300, template: textTemplate},
                {name: 'Tipo', width: 300, template: textTemplate},
            ]
            modal_tablas_titulo = "Grupo de Auxiliar";
        break;
        case "asiento_patron":
            columnas=[
                {name: 'Codigo', width: 80, template: textTemplate},
                {name: 'Nombre', width: 150, template: textTemplate},    
                {name: 'Abreviatura', width: 80, template: textTemplate},  
                {name: 'Cuenta_Soles', width: 250, template: textTemplate},  
                {name: 'Cuenta_Dolares', width: 250, template: textTemplate},
                {name: 'Cuenta_Provision_Soles', width: 250, template: textTemplate},  
                {name: 'Cuenta_Provision_Dolares', width: 250, template: textTemplate},  
            ]
            modal_tablas_titulo = "Asiento Patron";
        break;
    }
    setTitle(modal_tablas_titulo);
    cargar_reporte();
}

 function set_objetos(tabla){
    // console.log(tabla);
    jq_group_listas_precios=$("#group_listas_precios");
    rellenar_codigo_nombre("/zona/lista","tablas_"+tabla+"_zona","tablas_"+tabla+"_zona_predeterminado");
    switch(tabla){
        case "vendedor":
            rellenar_group_listas_precios(tabla,{tipo: '12'});
        break;
        case "punto_venta":
            rellenar_codigo_nombre('/almacen/lista_almacen',"tablas_"+tabla+"_almacen","tablas_"+tabla+"_almacen_predeterminado");
            rellenar_grouptipo_producto_almacen(tabla);
        break;
        case "empleados":
            $("#tablas_empleados_tipo_trabajador").val($("#tablas_"+tabla+"_tipo_trabajador_predeterminado").val());
            rellenar_codigo_nombre('/tipo_documento_identidad/lista','tablas_'+tabla+'_tipo_documento',"tablas_"+tabla+"_tipo_documento_predeterminado");
            rellenar_codigo_nombre('/paises/lista','tablas_'+tabla+'_pais',"tablas_"+tabla+"_pais_predeterminado");
            rellenar_codigo_nombre('/usuario/lista','tablas_'+tabla+'_usuario',"tablas_"+tabla+"_usuario_predeterminado");
            $("#tabla_empleados_sexo_predeterminado").val() == 'M' ? $("#tabla_empleados_masculino").prop("checked",true) : $("#tabla_empleados_femenino").prop("checked",true);
            $("#tablas_empleados_aprob_req_1_predeterminado").val() == 'S' ? $("#tabla_empleados_aprob_req_1_si").prop("checked",true) : $("#tabla_empleados_aprob_req_1_no").prop("checked",true);
            $("#tablas_empleados_aprob_req_2_predeterminado").val() == 'S' ? $("#tabla_empleados_aprob_req_2_si").prop("checked",true) : $("#tabla_empleados_aprob_req_2_no").prop("checked",true);
            $("#tablas_empleados_aprob_orden_compra_predeterminado").val() == 'S' ? $("#tabla_empleados_aprob_orden_compra_si").prop("checked",true) : $("#tabla_empleados_aprob_orden_compra_no").prop("checked",true);
            $("#tablas_empleados_generar_orden_compra_predeterminado").val() == 'S' ? $("#tabla_empleados_generar_orden_compra_si").prop("checked",true) : $("#tabla_empleados_generar_orden_compra_no").prop("checked",true);
            $("#tablas_empleados_aprobar_cotizacion_predeterminado").val() == 'S' ? $("#tabla_empleados_aprobar_cotizacion_si").prop("checked",true) : $("#tabla_empleados_aprobar_cotizacion_no").prop("checked",true);
            $("#tablas_empleados_aprobar_pedido_predeterminado").val() == 'S' ? $("#tabla_empleados_aprobar_pedido_si").prop("checked",true) : $("#tabla_empleados_aprobar_pedido_no").prop("checked",true);
            $("#tablas_empleados_cierre_fondo_fijo_predeterminado").val() == 'S' ? $("#tabla_empleados_cierre_fondo_fijo_si").prop("checked",true) : $("#tabla_empleados_cierre_fondo_fijo_no").prop("checked",true);
        break;
        case "agencia_transporte":
            $("#tablas_agencia_transporte_privado_predeterminado").val() == 'S' ? $("#tablas_agencia_transporte_privado").prop("checked",true) : $("#tablas_agencia_transporte_privado").prop("checked",false);
            $("#tablas_agencia_transporte_predeterminado_predeterminado").val() == '1' ? $("#tablas_agencia_transporte_predeterminado").prop("checked",true) : $("#tablas_agencia_transporte_predeterminado").prop("checked",false);
        break;
        case "transportista":
            rellenar_codigo_nombre('/tipo_documento_identidad/lista','tablas_'+tabla+'_tipo_documento',"tablas_"+tabla+"_tipo_documento_predeterminado");
            rellenar_codigo_nombre('/vehiculo/lista','tablas_'+tabla+'_vehiculo',"tablas_"+tabla+"_vehiculo_predeterminado");
            $("#tablas_transportista_privado_predeterminado").val() == 'S' ? $("#tablas_transportista_privado").prop("checked",true) : $("#tablas_transportista_privado").prop("checked",false);
            $("#tablas_transportista_predeterminado_predeterminado").val() == '1' ? $("#tablas_transportista_predeterminado").prop("checked",true) : $("#tablas_transportista_predeterminado").prop("checked",false);
        break;
        case "vehiculo":
            $("#tablas_vehiculo_privado_predeterminado").val() == 'S' ? $("#tablas_vehiculo_privado").prop("checked",true) : $("#tablas_vehiculo_privado").prop("checked",false);
            $("#tablas_vehiculo_predeterminado_predeterminado").val() == '1' ? $("#tablas_vehiculo_predeterminado").prop("checked",true) : $("#tablas_vehiculo_predeterminado").prop("checked",false);
        break;
        case "chofer":
            rellenar_codigo_nombre('/tipo_documento_identidad/lista','tablas_'+tabla+'_tipo_documento',"tablas_"+tabla+"_tipo_documento_predeterminado");
            $("#tablas_chofer_privado_predeterminado").val() == 'S' ? $("#tablas_chofer_privado").prop("checked",true) : $("#tablas_chofer_privado").prop("checked",false);
            $("#tablas_chofer_predeterminado_predeterminado").val() == '1' ? $("#tablas_chofer_predeterminado").prop("checked",true) : $("#tablas_chofer_predeterminado").prop("checked",false);
        break;
        case "productos":
            $("#tablas_"+tabla+"_automatico_predeterminado").val() == 'A' ? $("#tablas_productos_automatico").prop("checked",true) : $("#tablas_productos_manual").prop("checked",true);
            
            rellenar_codigo_nombre('/tipo_productos/lista','tablas_'+tabla+'_tipo_producto',"tablas_"+tabla+"_tipo_producto_predeterminado");
            rellenar_codigo_nombre('/familias/lista','tablas_'+tabla+'_familia',"tablas_"+tabla+"_familia_predeterminado");
            rellenar_codigo_nombre('/subfamilias/lista','tablas_'+tabla+'_subfamilia',"tablas_"+tabla+"_subfamilia_predeterminado");
            rellenar_codigo_nombre('/conceptos/lista/1','tablas_'+tabla+'_categoria',"tablas_"+tabla+"_categoria_predeterminado");
            rellenar_codigo_nombre('/conceptos/lista/2','tablas_'+tabla+'_tamaño',"tablas_"+tabla+"_tamaño_predeterminado");
            rellenar_codigo_nombre('/conceptos/lista/3','tablas_'+tabla+'_dimension',"tablas_"+tabla+"_dimension_predeterminado");
            rellenar_codigo_nombre('/conceptos/lista/4','tablas_'+tabla+'_marca',"tablas_"+tabla+"_marca_predeterminado");
            rellenar_codigo_nombre('/conceptos/lista/5','tablas_'+tabla+'_diseño',"tablas_"+tabla+"_diseño_predeterminado");
            rellenar_codigo_nombre('/conceptos/lista/6','tablas_'+tabla+'_color',"tablas_"+tabla+"_color_predeterminado");
            rellenar_codigo_nombre('/conceptos/lista/7','tablas_'+tabla+'_concepto',"tablas_"+tabla+"_concepto_predeterminado");
            rellenar_codigo_nombre('/unidades/lista','tablas_'+tabla+'_unidad_medida',"tablas_"+tabla+"_unidad_medida_predeterminado");
            rellenar_codigo_nombre('/moneda/lista','tablas_'+tabla+'_moneda',"tablas_"+tabla+"_moneda_predeterminado");
            rellenar_codigo_nombre('/unidades/lista','tablas_'+tabla+'_unidad_medida2',"tablas_"+tabla+"_unidad_medida2_predeterminado");
            rellenar_codigo_nombre('/productos/grupos_receta', 'tablas_'+tabla+'_grupo_receta', "tablas_"+tabla+"_grupo_receta_predeterminado")
            $("#tablas_"+tabla+"_no_stock_predeterminado").val() == 'N' ? $("#tablas_productos_no_stock").prop("checked",true) : $("#tablas_productos_si_stock").prop("checked",true);
            $("#tablas_"+tabla+"_lote_no_predeterminado").val() == 'N' ? $("#tablas_productos_lote_no").prop("checked",true) : $("#tablas_productos_lote_si").prop("checked",true);
            $("#tablas_"+tabla+"_serie_no_predeterminado").val() == 'N' ? $("#tablas_productos_serie_no").prop("checked",true) : $("#tablas_productos_serie_si").prop("checked",true);
            $("#tablas_"+tabla+"_servicio_no_predeterminado").val() == 'N' ? $("#tablas_productos_servicio_no").prop("checked",true) : $("#tablas_productos_servicio_si").prop("checked",true);
            $("#tablas_"+tabla+"_kits_no_predeterminado").val() == 'N' ? $("#tablas_productos_kits_no").prop("checked",true) : $("#tablas_productos_kits_si").prop("checked",true);
            $("#tablas_"+tabla+"_activo_fijo_no_predeterminado").val() == 'N' ? $("#tablas_productos_activo_fijo_no").prop("checked",true) : $("#tablas_productos_activo_fijo_si").prop("checked",true);
            $("#tablas_"+tabla+"_advalorem_no_predeterminado").val() == 'N' ? $("#tablas_productos_advalorem_no").prop("checked",true) : $("#tablas_productos_advalorem_si").prop("checked",true);
            $("#tablas_"+tabla+"_iqpf_no_predeterminado").val() == 'N' ? $("#tablas_productos_iqpf_no").prop("checked",true) : $("#tablas_productos_iqpf_si").prop("checked",true);
            $("#tablas_"+tabla+"_isc_no_predeterminado").val() == 'N' ? $("#tablas_productos_isc_no").prop("checked",true) : $("#tablas_productos_isc_si").prop("checked",true);
            $("#tablas_"+tabla+"_percepcion_si_predeterminado").val() == 'N' ? $("#tablas_productos_percepcion_no").prop("checked",true) : $("#tablas_productos_percepcion_si").prop("checked",true);
            $("#tablas_"+tabla+"_icbper_no_predeterminado").val() == 'N' ? $("#tablas_productos_icbper_no").prop("checked",true) : $("#tablas_productos_icbper_si").prop("checked",true);
            $("#tablas_"+tabla+"_receta_no_predeterminado").val() == 'N' ? $("#tablas_productos_receta_no").prop("checked",true) : $("#tablas_productos_receta_si").prop("checked",true);
            $("#tablas_"+tabla+"_desc_formato_no_predeterminado").val() == 'N'? $("#tablas_productos_desc_formato_no").prop("checked",true) : $("#tablas_productos_desc_formato_si").prop("checked",true);
            $("#tablas_"+tabla+"_comision_no_predeterminado").val() == 'N'? $("#tablas_productos_comision_no").prop("checked",true) : $("#tablas_productos_comision_si").prop("checked",true);
            $("#tablas_"+tabla+"_digemid2_no_predeterminado").val() == 'N'? $("#tablas_productos_digemid2_no").prop("checked",true) : $("#tablas_productos_digemid2_si").prop("checked",true);
            $("#tablas_"+tabla+"_estado_predeterminado").val() == "Activo" ? $("#tablas_"+tabla+"_estado").val("Activo"):  $("#tablas_"+tabla+"_estado").val("Inactivo");
            $("#tablas_"+tabla+"_categoria2_predeterminado").val() == "A" ? $("#tablas_"+tabla+"_categoria2").val("A"):  $("#tablas_"+tabla+"_categoria2").val($("#tablas_"+tabla+"_categoria2_predeterminado").val());
            $("#tablas_"+tabla+"_automatico_codigo_predeterminado").val() == 'A' ? $("#tablas_productos_automatico_codigo").prop("checked",true) : $("#tablas_productos_automatico_codigo").prop("checked",false);
            $("#tablas_"+tabla+"_fecha_creacion_predeterminado").val() == 'S' ? '':   $("#tablas_"+tabla+"_fecha_creacion").val(getShortDate(fecha_trabajo));
            $("#tablas_"+tabla+"_fecha_modificacion_predeterminado").val() == 'S'? '':    $("#tablas_"+tabla+"_fecha_modificacion").val(getShortDate(fecha_trabajo));
            //$("#tablas_"+tabla+"_automatico").is(':checked') ? $("#tablas_productos_codigo").prop("disabled",true) : $("#tablas_productos_codigo").prop("disabled",false);
            $("#tablas_productos_codigo").prop("disabled",true) 
            //$("#tablas_"+tabla+"_igv").val('18');
            //$("#tablas_"+tabla+"_contenido").val('1');
            rellenar_presentacion_productos(tabla);
            rellenar_nombre_presentacion(tabla);
            rellenar_datos_tecnicos(tabla);
            rellenar_lista_precios_compra(tabla);
            rellenar_codigos_alternativos(tabla);
  
            $(".nav-tab-rounded").click(function(e) {
                $("li").removeClass("active");
                $(this).addClass("active");
            });
        break;
        case "clientes":
            $(".nav-tab-rounded").click(function(e) {
                $("li").removeClass("active");
                $(this).addClass("active");
            });
            rellenar_group_listas_precios(tabla,{tipo: '12'});
            rellenar_codigo_nombre('/grupo_cliente/lista',"tablas_"+tabla+"_grupo_clientes","tablas_"+tabla+"_grupo_clientes_predeterminado");
            rellenar_codigo_nombre('/tipo_documento_identidad/lista',"tablas_"+tabla+"_tipo_documento_identidad","tablas_"+tabla+"_tipo_documento_identidad_predeterminado");
            rellenar_codigo_nombre('/paises/lista',"tablas_"+tabla+"_pais","tablas_"+tabla+"_pais_predeterminado");
            rellenar_codigo_nombre('/departamentos/lista',"tablas_"+tabla+"_departamento","tablas_"+tabla+"_departamento_predeterminado");
            rellenar_codigo_nombre('/distritos/lista',"tablas_"+tabla+"_distrito","tablas_"+tabla+"_distrito_predeterminado");
            rellenar_codigo_nombre('/ciudad/lista',"tablas_"+tabla+"_ciudad","tablas_"+tabla+"_ciudad_predeterminado");
            rellenar_codigo_nombre('/zona/lista',"tablas_"+tabla+"_zona1","tablas_"+tabla+"_zona1_predeterminado");
            rellenar_codigo_nombre('/zona/lista',"tablas_"+tabla+"_zona2","tablas_"+tabla+"_zona2_predeterminado");
            rellenar_codigo_nombre('/vendedor/lista',"tablas_"+tabla+"_vendedor","tablas_"+tabla+"_vendedor_predeterminado");
            rellenar_codigo_nombre('/situacion/lista',"tablas_"+tabla+"_situacion1","tablas_"+tabla+"_situacion1_predeterminado");
            rellenar_codigo_nombre('/situacion/lista',"tablas_"+tabla+"_situacion2","tablas_"+tabla+"_situacion2_predeterminado");
            rellenar_codigo_nombre('/rubro/lista',"tablas_"+tabla+"_rubro","tablas_"+tabla+"_rubro_predeterminado");
            rellenar_codigo_nombre('/gestor_cobranza/lista',"tablas_"+tabla+"_gestor","tablas_"+tabla+"_gestor_predeterminado");
            
            $("#tablas_clientes_tipo_cliente").val($("#tablas_clientes_tipo_cliente_predeterminado").val());
            $("#tablas_clientes_estado").val($("#tablas_clientes_estado_predeterminado").val());

            $("#tablas_"+tabla+"_editar").prop("checked",($("#tablas_"+tabla+"_editar_predeterminado").val() == 'S'))
            $("#tablas_"+tabla+"_excluye_percepcion").prop("checked",($("#tablas_"+tabla+"_excluye_percepcion_predeterminado").val() == 'S'))

            $("#tablas_"+tabla+"_bonificacion_predeterminado").val() == 'S' ? $("#tablas_"+tabla+"_bonificacion_si").prop("checked",true) : $("#tablas_"+tabla+"_bonificacion_no").prop("checked",true);
            $("#tablas_"+tabla+"_percepcion_predeterminado").val() == 'S' ? $("#tablas_"+tabla+"_percepcion_si").prop("checked",true) : $("#tablas_"+tabla+"_percepcion_no").prop("checked",true);
            $("#tablas_"+tabla+"_retencion_predeterminado").val() == 'S' ? $("#tablas_"+tabla+"_retencion_si").prop("checked",true) : $("#tablas_"+tabla+"_retencion_no").prop("checked",true);
            $("#tablas_"+tabla+"_buen_contribuyente_predeterminado").val() == 'S' ? $("#tablas_"+tabla+"_buen_contribuyente_si").prop("checked",true) : $("#tablas_"+tabla+"_buen_contribuyente_no").prop("checked",true);
            $("#tablas_"+tabla+"_controlar_linea_predeterminado").val() == 'S' ? $("#tablas_"+tabla+"_controlar_linea_si").prop("checked",true) : $("#tablas_"+tabla+"_controlar_linea_no").prop("checked",true);
            $("#tablas_"+tabla+"_exonerado_predeterminado").val() == 'S' ? $("#tablas_"+tabla+"_exonerado_si").prop("checked",true) : $("#tablas_"+tabla+"_exonerado_no").prop("checked",true);
        

            rellenar_group_formas_pago_listas(tabla,'12');
            rellenar_group_direcciones_alternativas(tabla,'12');
            rellenar_group_persona_contacto(tabla);
            rellenar_group_detracciones_listas(tabla,'12');
            rellenar_group_agencias(tabla,'12');
            rellenar_group_avales(tabla,'12');
            rellenar_group_historial(tabla);
            rellenar_group_placas(tabla);
        break;
        case "proveedores":
            $(".nav-tab-rounded").click(function(e) {
                $("li").removeClass("active");
                $(this).addClass("active");
            });
            rellenar_codigo_nombre('/grupo_proveedor/lista',"tablas_"+tabla+"_grupo_proveedores","tablas_"+tabla+"_grupo_proveedores_predeterminado");
            rellenar_codigo_nombre('/tipo_documento_identidad/lista',"tablas_"+tabla+"_tipo_documento_identidad","tablas_"+tabla+"_tipo_documento_identidad_predeterminado");
            rellenar_codigo_nombre('/paises/lista',"tablas_"+tabla+"_pais","tablas_"+tabla+"_pais_predeterminado");
            rellenar_codigo_nombre('/zona/lista',"tablas_"+tabla+"_zona1","tablas_"+tabla+"_zona1_predeterminado");
            rellenar_codigo_nombre('/zona/lista',"tablas_"+tabla+"_zona2","tablas_"+tabla+"_zona2_predeterminado");
            rellenar_codigo_nombre('/situacion/lista',"tablas_"+tabla+"_situacion1","tablas_"+tabla+"_situacion1_predeterminado");
            rellenar_codigo_nombre('/situacion/lista',"tablas_"+tabla+"_situacion2","tablas_"+tabla+"_situacion2_predeterminado");

            $("#tablas_"+tabla+"_excluye_percepcion").prop("checked",($("#tablas_"+tabla+"_excluye_percepcion_predeterminado").val() == 'S'))

            $("#tablas_"+tabla+"_no_domiciliado_predeterminado").val() == 'S' ? $("#tablas_"+tabla+"_no_domiciliado_si").prop("checked",true) : $("#tablas_"+tabla+"_no_domiciliado_no").prop("checked",true);
            $("#tablas_"+tabla+"_bonificacion_predeterminado").val() == 'S' ? $("#tablas_"+tabla+"_bonificacion_si").prop("checked",true) : $("#tablas_"+tabla+"_bonificacion_no").prop("checked",true);
            $("#tablas_"+tabla+"_percepcion_predeterminado").val() == 'S' ? $("#tablas_"+tabla+"_percepcion_si").prop("checked",true) : $("#tablas_"+tabla+"_percepcion_no").prop("checked",true);
            $("#tablas_"+tabla+"_retencion_predeterminado").val() == 'S' ? $("#tablas_"+tabla+"_retencion_si").prop("checked",true) : $("#tablas_"+tabla+"_retencion_no").prop("checked",true);
            $("#tablas_"+tabla+"_buen_contribuyente_predeterminado").val() == 'S' ? $("#tablas_"+tabla+"_buen_contribuyente_si").prop("checked",true) : $("#tablas_"+tabla+"_buen_contribuyente_no").prop("checked",true);
            $("#tablas_"+tabla+"_percepcion_documento_predeterminado").val() == 'S' ? $("#tablas_"+tabla+"_percepcion_documento_si").prop("checked",true) : $("#tablas_"+tabla+"_percepcion_documento_no").prop("checked",true);
            $("#tablas_"+tabla+"_detraccion_predeterminado").val() == 'S' ? $("#tablas_"+tabla+"_detraccion_si").prop("checked",true) : $("#tablas_"+tabla+"_detraccion_no").prop("checked",true);


            $("#tablas_"+tabla+"_fecha_creacion_predeterminado").val() == 'S' ? '':   $("#tablas_"+tabla+"_fecha_creacion").val(getShortDate(fecha_trabajo));
            $("#tablas_"+tabla+"_fecha_modificacion_predeterminado").val() == 'S'? '':    $("#tablas_"+tabla+"_fecha_modificacion").val(getShortDate(fecha_trabajo));
        
            rellenar_group_formas_pago_listas(tabla,'42');
            rellenar_group_persona_contacto(tabla);
            rellenar_group_detracciones_listas(tabla,'42');
            rellenar_group_agencias(tabla,'42');
            rellenar_group_historial(tabla);
            rellenar_group_retenciones_no_domiciliados_listas(tabla, '42');
            rellenar_group_cuentas_corrientes(tabla);
            rellenar_group_codigos_alternativos(tabla,'42');
        break;
        case "gestor_cobranza":
            $("#tablas_"+tabla+"_predeterminado_predeterminado").val() == '0' ?$("#tablas_"+tabla+"_predeterminado").prop("checked",false) : $("#tablas_"+tabla+"_predeterminado").prop("checked",true);
        break;
        case "cobrador":
            rellenar_codigo_nombre('/usuario/lista',"tablas_"+tabla+"_usuario","tablas_"+tabla+"_usuario_predeterminado");
            $("#tablas_"+tabla+"_predeterminado_predeterminado").val() == '0' ?$("#tablas_"+tabla+"_predeterminado").prop("checked",false) : $("#tablas_"+tabla+"_predeterminado").prop("checked",true);
        break;
        case "grupo_cliente":
            rellenar_codigo_nombre('/usuario/lista',"tablas_"+tabla+"_usuario","tablas_"+tabla+"_usuario_predeterminado");
            rellenar_group_grupo_cuentas(tabla, '12');
            $("#tablas_"+tabla+"_predeterminado_predeterminado").val() == '0' ?$("#tablas_"+tabla+"_predeterminado").prop("checked",false) : $("#tablas_"+tabla+"_predeterminado").prop("checked",true);
        break;
        case "grupo_proveedor":
            rellenar_codigo_nombre('/usuario/lista',"tablas_"+tabla+"_usuario","tablas_"+tabla+"_usuario_predeterminado");
            rellenar_group_grupo_cuentas(tabla, '42');
            $("#tablas_"+tabla+"_predeterminado_predeterminado").val() == '0' ?$("#tablas_"+tabla+"_predeterminado").prop("checked",false) : $("#tablas_"+tabla+"_predeterminado").prop("checked",true);
        break;
        case "tipo_documento":
            $("#tablas_"+tabla+"_compras_predeterminado").val() == 'N' ?$("#tablas_"+tabla+"_compras").prop("checked",false) : $("#tablas_"+tabla+"_compras").prop("checked",true);
            $("#tablas_"+tabla+"_ventas_predeterminado").val() == 'N' ?$("#tablas_"+tabla+"_ventas").prop("checked",false) : $("#tablas_"+tabla+"_ventas").prop("checked",true);
            $("#tablas_"+tabla+"_contabilidad_predeterminado").val() == 'N' ?$("#tablas_"+tabla+"_contabilidad").prop("checked",false) : $("#tablas_"+tabla+"_contabilidad").prop("checked",true);
            $("#tablas_"+tabla+"_almacen_predeterminado").val() == 'N' ?$("#tablas_"+tabla+"_almacen").prop("checked",false) : $("#tablas_"+tabla+"_almacen").prop("checked",true);
            $("#tablas_"+tabla+"_caja_predeterminado").val() == 'N' ?$("#tablas_"+tabla+"_caja").prop("checked",false) : $("#tablas_"+tabla+"_caja").prop("checked",true);
            $("#tablas_"+tabla+"_punto_venta_predeterminado").val() == 'N' ?$("#tablas_"+tabla+"_punto_venta").prop("checked",false) : $("#tablas_"+tabla+"_punto_venta").prop("checked",true);

            $("#tablas_"+tabla+"_csigno_predeterminado").val() == 'R' ?$("#tablas_"+tabla+"_csigno_resta").prop("checked",true) : $("#tablas_"+tabla+"_csigno_suma").prop("checked",true);
            $("#tablas_"+tabla+"_aplica_percepcion_predeterminado").val() == 'N' ?$("#tablas_"+tabla+"_aplica_percepcion_no").prop("checked",true) : $("#tablas_"+tabla+"_aplica_percepcion_si").prop("checked",true);
            $("#tablas_"+tabla+"_genera_credifis_predeterminado").val() == 'N' ?$("#tablas_"+tabla+"_genera_credifis_no").prop("checked",true) : $("#tablas_"+tabla+"_genera_credifis_si").prop("checked",true);
            $("#tablas_"+tabla+"_renta_cuarta_predeterminado").val() == 'N' ?$("#tablas_"+tabla+"_renta_cuarta_no").prop("checked",true) : $("#tablas_"+tabla+"_renta_cuarta_si").prop("checked",true);
            $("#tablas_"+tabla+"_fecha_tipo_cambio").val($("#tablas_"+tabla+"_fecha_tipo_cambio_predeterminado").val());
            $("#tablas_"+tabla+"_tipo_formato").val($("#tablas_"+tabla+"_tipo_formato_predeterminado").val());
        break;
        case "talonarios":
            rellenar_codigo_nombre('/punto_venta/lista',"tablas_"+tabla+"_punto_venta","tablas_"+tabla+"_punto_venta_predeterminado");
            rellenar_codigo_nombre('/tipo_documento/lista',"tablas_"+tabla+"_tipo_documento","tablas_"+tabla+"_tipo_documento_predeterminado");
            $("#tablas_"+tabla+"_predeterminado_predeterminado").val() == 'N' ?$("#tablas_"+tabla+"_predeterminado").prop("checked",false) : $("#tablas_"+tabla+"_predeterminado").prop("checked",true);
            $("#tablas_"+tabla+"_activo_predeterminado").val() == 'N' ?$("#tablas_"+tabla+"_activo").prop("checked",false) : $("#tablas_"+tabla+"_activo").prop("checked",true);
            $("#tablas_"+tabla+"_a4_predeterminado").val() == 'N' ?$("#tablas_"+tabla+"_a4").prop("checked",false) : $("#tablas_"+tabla+"_a4").prop("checked",true);
        break;
        case "motivos_tramite":
            rellenar_codigo_nombre('/tipo_documento/lista',"tablas_"+tabla+"_tipo_documento","tablas_"+tabla+"_tipo_documento_predeterminado");
            $("#tablas_"+tabla+"_predeterminado_predeterminado").val() == 'N' ?$("#tablas_"+tabla+"_predeterminado").prop("checked",false) : $("#tablas_"+tabla+"_predeterminado").prop("checked",true);
            rellenar_group_motivos_tramite(tabla);
        break;
        case "forma_pago":
            $("#tablas_"+tabla+"_afecta_percepcion_predeterminado").val() == 'N' ?$("#tablas_"+tabla+"_afecta_percepcion").prop("checked",false) : $("#tablas_"+tabla+"_afecta_percepcion").prop("checked",true);
            rellenar_group_forma_pago_detalle(tabla);
        break;
        case "orden_trabajo":
            $("#tablas_"+tabla+"_fecha_inicio_predeterminado").val() == 'S' ? '':   $("#tablas_"+tabla+"_fecha_inicio").val(getShortDate(fecha_trabajo));
            $("#tablas_"+tabla+"_fecha_final_predeterminado").val() == 'S'? '':    $("#tablas_"+tabla+"_fecha_final").val(getShortDate(fecha_trabajo));
        break;
        case "partida_gasto":
            rellenar_group_partida_gastos_cuenta(tabla);
            $("#tablas_"+tabla+"_operacion").val($("#tablas_"+tabla+"_operacion_predeterminado").val());
            //$("#tablas_"+tabla+"_fecha_final_predeterminado").val() == 'S'? '':    $("#tablas_"+tabla+"_fecha_final").val(getShortDate(fecha_trabajo));
        break;
        case "kits":
            rellenar_group_kits_articulos(tabla);
        break;
        case "usuario":
            //$("#permisos").show();
            $("#tablas_"+tabla+"_estado_predeterminado").val() == 'A' ?$("#tablas_"+tabla+"_estado_activo").prop("checked",true) : $("#tablas_"+tabla+"_estado_desactivo").prop("checked",true);
            $("#tablas_"+tabla+"_kardex_predeterminado").val() == 'S' ?$("#tablas_"+tabla+"_kardex_si").prop("checked",true) : $("#tablas_"+tabla+"_kardex_no").prop("checked",true);
            $("#tablas_"+tabla+"_compras_predeterminado").val() == 'S' ?$("#tablas_"+tabla+"_compras_si").prop("checked",true) : $("#tablas_"+tabla+"_compras_no").prop("checked",true);
            $("#tablas_"+tabla+"_ventas_predeterminado").val() == 'S' ?$("#tablas_"+tabla+"_ventas_si").prop("checked",true) : $("#tablas_"+tabla+"_ventas_no").prop("checked",true);
            habilitar_password();
            validar_password();
        break;
        case "familias":
           var data = [
            {predeterminado:$("#tablas_"+tabla+"_tipo_cta_debe_pagar_predeterminado").val(), element: $("#tablas_"+tabla+"_tipo_cta_debe_pagar") },
            {predeterminado:$("#tablas_"+tabla+"_cta_ne_debe_predeterminado").val(), element: $("#tablas_"+tabla+"_cta_ne_debe") },
            {predeterminado:$("#tablas_"+tabla+"_cta_haber_ventas_predeterminado").val(), element: $("#tablas_"+tabla+"_cta_haber_ventas") },
            {predeterminado:$("#tablas_"+tabla+"_cta_ne_haber_predeterminado").val(), element: $("#tablas_"+tabla+"_cta_ne_haber") },
            {predeterminado:$("#tablas_"+tabla+"_cta_nc_dev_predeterminado").val(), element: $("#tablas_"+tabla+"_cta_nc_dev") },
            {predeterminado:$("#tablas_"+tabla+"_cta_ns_debe_predeterminado").val(), element: $("#tablas_"+tabla+"_cta_ns_debe") },
            {predeterminado:$("#tablas_"+tabla+"_cta_diferida_predeterminado").val(), element: $("#tablas_"+tabla+"_cta_diferida") },
            {predeterminado:$("#tablas_"+tabla+"_cta_ns_haber_predeterminado").val(), element: $("#tablas_"+tabla+"_cta_ns_haber") },
            {predeterminado:$("#tablas_"+tabla+"_cta_costo_debe_predeterminado").val(), element: $("#tablas_"+tabla+"_cta_costo_debe") },
            {predeterminado:$("#tablas_"+tabla+"_cta_debe_importacion_predeterminado").val(), element: $("#tablas_"+tabla+"_cta_debe_importacion") },
            {predeterminado:$("#tablas_"+tabla+"_cta_costo_haber_predeterminado").val(), element: $("#tablas_"+tabla+"_cta_costo_haber") },
            {predeterminado:$("#tablas_"+tabla+"_cta_costo_debe_produccion_predeterminado").val(), element: $("#tablas_"+tabla+"_cta_costo_debe_produccion") },
            {predeterminado:$("#tablas_"+tabla+"_cta_costo_haber_produccion_predeterminado").val(), element: $("#tablas_"+tabla+"_cta_costo_haber_produccion") },
           ]
            
           rellenar_codigo_nombre_clase('/plan_contable/lista2',"tablas_"+tabla+"_cuenta",data);
           $("#tablas_"+tabla+"_afecta_aberviatura_predeterminado").val() == 'S' ?$("#tablas_"+tabla+"_afecta_aberviatura_si").prop("checked",true) : $("#tablas_"+tabla+"_afecta_aberviatura_no").prop("checked",true);
        break;
        case "subfamilias":
           $("#tablas_"+tabla+"_afecta_aberviatura_predeterminado").val() == 'S' ?$("#tablas_"+tabla+"_afecta_aberviatura_si").prop("checked",true) : $("#tablas_"+tabla+"_afecta_aberviatura_no").prop("checked",true);
        break;
        case "plan_contable":
            rellenar_codigo_nombre('/plan_contable/cuenta_exterior',"tablas_"+tabla+"_cuenta_exterior","tablas_"+tabla+"_cuenta_exterior_predeterminado");
            rellenar_codigo_nombre('/plan_contable/clase_cuenta',"tablas_"+tabla+"_clase_cuenta","tablas_"+tabla+"_clase_cuenta_predeterminado");
            rellenar_codigo_nombre('/plan_contable/elemento_cuenta',"tablas_"+tabla+"_elemento","tablas_"+tabla+"_elemento_predeterminado");
            rellenar_codigo_nombre('/tipo_auxiliar/lista',"tablas_"+tabla+"_tipo_auxiliar","tablas_"+tabla+"_tipo_auxiliar_predeterminado");
            $("#tablas_"+tabla+"_cencos_predeterminado").val() == 'S' ?$("#tablas_"+tabla+"_cencos_si").prop("checked",true) : $("#tablas_"+tabla+"_cencos_no").prop("checked",true);
            $("#tablas_"+tabla+"_ot_predeterminado").val() == 'S' ?$("#tablas_"+tabla+"_ot_si").prop("checked",true) : $("#tablas_"+tabla+"_ot_no").prop("checked",true);
            $("#tablas_"+tabla+"_ajuste_deudor").val($("#tablas_"+tabla+"_ajuste_deudor_predeterminado").val());
            $("#tablas_"+tabla+"_ajuste_acreedor").val($("#tablas_"+tabla+"_ajuste_acreedor_predeterminado").val());
            $("#tablas_"+tabla+"_moneda_cierre").val($("#tablas_"+tabla+"_moneda_cierre_predeterminado").val());
            $("#tablas_"+tabla+"_diferencia_cierre_predeterminado").val() == 'S' ?$("#tablas_"+tabla+"_diferencia_cierre_si").prop("checked",true) : $("#tablas_"+tabla+"_diferencia_cierre_no").prop("checked",true);
            $("#tablas_"+tabla+"_transferencia_predeterminado").val() == 'S' ?$("#tablas_"+tabla+"_transferencia_si").prop("checked",true) : $("#tablas_"+tabla+"_transferencia_no").prop("checked",true);
            $("#tablas_"+tabla+"_D_H").val($("#tablas_"+tabla+"_D_H_predeterminado").val());
            $("#tablas_"+tabla+"_transferencia_predeterminado").val() == 'S' ?$("#tablas_"+tabla+"_transferencia_si").prop("checked",true) : $("#tablas_"+tabla+"_transferencia_no").prop("checked",true);
            $("#tablas_"+tabla+"_daot_predeterminado").val() == 'S' ?$("#tablas_"+tabla+"_daot_si").prop("checked",true) : $("#tablas_"+tabla+"_daot_no").prop("checked",true);
            rellenar_codigo_nombre('/clasificacion_bien_servicios/lista',"tablas_"+tabla+"_clasificacion_bs","tablas_"+tabla+"_clasificacion_bs_predeterminado");
            $("#tablas_"+tabla+"_presupuesto_predeterminado").val() == 'S' ?$("#tablas_"+tabla+"_presupuesto_si").prop("checked",true) : $("#tablas_"+tabla+"_presupuesto_no").prop("checked",true);
            rellenar_group_cuentas(tabla);
        break;
        case "subvoucher":
            $("#tablas_"+tabla+"_genera_transferencia_predeterminado").val() == 'S' ?$("#tablas_"+tabla+"_genera_transferencia_si").prop("checked",true) : $("#tablas_"+tabla+"_genera_transferencia_no").prop("checked",true);
            $("#tablas_"+tabla+"_genera_diferencia_predeterminado").val() == 'S' ?$("#tablas_"+tabla+"_genera_diferencia_si").prop("checked",true) : $("#tablas_"+tabla+"_genera_diferencia_no").prop("checked",true);
            $("#tablas_"+tabla+"_tipo_cambio").val($("#tablas_"+tabla+"_tipo_cambio_predeterminado").val());
            $("#tablas_"+tabla+"_calcula_mn_me_predeterminado").val() == 'S' ?$("#tablas_"+tabla+"_calcula_mn_me_si").prop("checked",true) : $("#tablas_"+tabla+"_calcula_mn_me_no").prop("checked",true);
            $("#tablas_"+tabla+"_compras_predeterminado").val() == 'S' ?$("#tablas_"+tabla+"_compras").prop("checked",true) : $("#tablas_"+tabla+"_compras").prop("checked",false);
            $("#tablas_"+tabla+"_ventas_predeterminado").val() == 'S' ?$("#tablas_"+tabla+"_ventas").prop("checked",true) : $("#tablas_"+tabla+"_ventas").prop("checked",false);
            $("#tablas_"+tabla+"_contabilidad_predeterminado").val() == 'S' ?$("#tablas_"+tabla+"_contabilidad").prop("checked",true) : $("#tablas_"+tabla+"_contabilidad").prop("checked",false);
            $("#tablas_"+tabla+"_cancelacion_predeterminado").val() == 'S' ?$("#tablas_"+tabla+"_cancelacion").prop("checked",true) : $("#tablas_"+tabla+"_cancelacion").prop("checked",false);
            rellenar_group_subvoucher_cuentas(tabla);
        break;
        case "grupo_auxiliar":
            rellenar_codigo_nombre('/tipo_auxiliar/lista',"tablas_"+tabla+"_tipo_auxiliar","tablas_"+tabla+"_tipo_auxiliar_predeterminado");
            rellenar_group_grupo_cuentas(tabla,$("#tablas_"+tabla+"_tipo_auxiliar_predeterminado").val())
        break;
        case "asiento_patron":
            var data = [
                {predeterminado:$("#tablas_"+tabla+"_cuenta_soles_predeterminado").val(), element: $("#tablas_"+tabla+"_cuenta_soles") },
                {predeterminado:$("#tablas_"+tabla+"_cuenta_dolares_predeterminado").val(), element: $("#tablas_"+tabla+"_cuenta_dolares") },
                {predeterminado:$("#tablas_"+tabla+"_cuenta_prov_soles_predeterminado").val(), element: $("#tablas_"+tabla+"_cuenta_prov_soles") },
                {predeterminado:$("#tablas_"+tabla+"_cuenta_prov_dolares_predeterminado").val(), element: $("#tablas_"+tabla+"_cuenta_prov_dolares") },
               ]

            rellenar_codigo_nombre('/tipo_documento/lista/todos',"tablas_"+tabla+"_tipo_documento","tablas_"+tabla+"_tipo_documento_predeterminado");
            rellenar_codigo_nombre_clase('/plan_contable/lista2',"tablas_"+tabla+"_cuenta",data);
            $("#tablas_"+tabla+"_provision_predeterminado").val() == 'S' ?$("#tablas_"+tabla+"_provision").prop("checked",true) : $("#tablas_"+tabla+"_provision").prop("checked",false);
            $("#tablas_"+tabla+"_provision_predeterminado").val() == 'S' ?$(".cuenta_provision").prop("hidden",false) : $(".cuenta_provision").prop("hidden",true);
            mostrar_cuentas_provisiones();
            
        break;
    }
}

function cargar_reporte(){
    
    var jq_grid=jq_grid_tablas;
    var colNames = [];
    var colModel = columnas;
    var url = url_tablas;

    colModel.forEach(element => {
        colNames.push(element.name)
    });

    cabecera=colNames;
    
    jq_grid.jqGrid('GridUnload');

    jq_grid.jqGrid({
        url: url,
        mtype: "POST",
        datatype: "json",
        colNames: colNames,
        colModel: colModel,
        rowNum:50,
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        width: 1190,
        height: 400,
        rowList:[50,500,5000,50000],
        loadonce: true, 
        footerrow : true,
        pager: 'reporte-documentos-pager',
        onSelectRow: function (rowid, status, e){
            id_fila_seleccionada = rowid;
        },
        ondblClickRow: function(rowid, iRow, iCol, e){
            var row = jq_grid.jqGrid ('getRowData', rowid);
            console.log(row);
            open_modal_tablas({codigo: row.Codigo, nombre: row.Nombre, serie: row.Numero_Serie},{tabla_nombre:$("#modulo_tablas").text(),estado:"modificar", titulo:modal_tablas_titulo},jq_grid);          
        },
        loadComplete:function(data){
            // resize_jqgrid_porcentajes(jq_grid,70,98);
            resize_jqgrid_restar(jq_grid,$("#nav_title_bar").height() + 120 ,30)
        }
    });

    jq_grid.jqGrid('filterToolbar',{stringResult: true, searchOnEnter : false, searchOperators : true});
}

function calcular_modal_tablas_totales_footer(){
    
}

function nuevo_tablas(){
    var jq_grid=jq_grid_tablas;
    open_modal_tablas({codigo: ""},{tabla_nombre: $("#modulo_tablas").text(),estado:"guardar", titulo:modal_tablas_titulo},jq_grid);
}

function open_modal_tablas(datos, tabla, jq_grid){
    datos.tabla=tabla.tabla_nombre;
    var tabla_nombre=tabla.tabla_nombre;
    modulo_tablas=tabla.tabla_nombre;
    estado_tablas=tabla.estado;
    jq_grid_tablas_mantenimientos=jq_grid;
    $("#modal_tablas_titulo").text(tabla.titulo);
    $("#modal_tablas").modal("show");
        $.ajax({
        type: 'POST',
        url: '/tablas/ventana/',
        data: datos,
        success: function (result){
            $("#modal_tablas_body").html(result);
            set_objetos(tabla_nombre);

            if(estado_tablas=="modificar" || estado_tablas == "eliminar"){
                $("#tablas_"+modulo_tablas+"_codigo").prop("disabled",true)
            }else{
                $("#tablas_"+modulo_tablas+"_codigo").prop("disabled",false)
            }
        }
    });
}

function rellenar_group_listas_precios(tabla,data){
    $.ajax({
        type: 'POST',
        data: data,
        url: '/lista_precios/lista',
        success: function (result){
            var i=1;
            jq_group_listas_precios.html("");
            tablas_listas_precios=result;
            result.forEach(element => {
                var predeterminado=$("#tablas_"+tabla+"_lista_precios_"+element.Codigo+"_predeterminado").val() == "1" ? 'checked':'';
                var html='<div class="form-check">'+
                '<input class="form-check-input" type="checkbox" name="correlativo" id="lista_precios_'+element.Codigo+'" value="'+element.Nombre+'" '+ predeterminado+'>'+
                '<label class="form-check-label col-form-label-sm" for="lista_precios_'+element.Codigo+'">'+element.Nombre+'</label>'+
                '</div>';
                jq_group_listas_precios.append(html);
                i++;
            });
        }
    });
}

async function rellenar_grouptipo_producto_almacen(tabla){
    var jq_grid =$("#tablas_punto_venta_tipo_producto_almacen");
    var codigo = $("#tablas_"+tabla+"_codigo").val();

    lista_almacenes="";
    lista_tipo_productos="";

    await $.ajax({
        type: 'POST',
        url: '/almacen/lista_almacen/',
        success: function (result){
            result.forEach(element => {
                lista_almacenes +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
            });
        }
    });

    await $.ajax({
        type: 'POST',
        url: '/tipo_productos/lista/',
        success: function (result){
            result.forEach(element => {
                lista_tipo_productos +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
            });
        }
    });
    
    jq_grid.jqGrid({
        url: '/'+tabla+'/detalle/',
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo_punto_venta: codigo,
        },
        colNames: ["Tipo_Producto","Almacen","Tipo_Producto_Codigo","Almacen_Codigo"],
        colModel: [
            { 
                name:'Tipo_Producto_Nombre', width:300
            },
            { 
                name:'Almacen_Nombre', width:300,formatter:lista_select_almacenes
            },
            { 
                name:'Almacen_Codigo', width:300, hidden: true
            },
            { 
                name:'Tipo_Producto_Codigo', width:300, hidden: true
            },
        ],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        height: 400,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
            
        },
        loadComplete:function(data){
            var ids = jq_grid.getDataIDs()
            if(ids){
                ids.forEach(function (element, index, array) {
                    var fila = jq_grid.getRowData(element);
                    $("#lista_select_"+element).val(fila.Almacen_Codigo);

                });
            }
        }
    });
}
async function rellenar_presentacion_productos(tabla){
    var row_editing_detalle_presentacion_articulo = "";
    var col_editing_detalle_presentacion_articulo = "";
    var jq_grid =$("#tablas_presentacion_productos");
    var codigo = $("#tablas_"+tabla+"_codigo").val();
    
    lista_unidades="";

    await $.ajax({
        type: 'POST',
        url: '/unidades/lista',
        success: function (result){
            result.forEach(element => {
                lista_unidades +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
            });
        }
    });
    jq_grid.jqGrid({
        url: '/'+tabla+'/unidades_precio',
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo_articulo: codigo,
        },
        colNames: ["Codigo_Unidad","Unidad","Factor","Precio" ],
        colModel: [
            {  name:'Codigo_Unidad', width:150, hidden: true},
            {  name:'Unidad', width:150, formatter:lista_select_unidades},
            {  name:'Factor', width:150, editable:true,
                editoptions:{
                    dataEvents: [
                        {
                            type: 'keydown',
                            fn: function(e) {
                                var keycode = (e.keyCode ? e.keyCode : e.code);
                                keydown_jqgrid(jq_grid,keycode,{Codigo_Unidad:'',Factor:'',Precio:''});
                            }
                        }
                    ],
                },
            },
            { name:'Precio', width:150, editable:true,
                editoptions:{
                    dataEvents: [
                        {
                            type: 'keydown',
                            fn: function(e) {
                                var keycode = (e.keyCode ? e.keyCode : e.code);
                                keydown_jqgrid(jq_grid,keycode,{Codigo_Unidad:'',Factor:'',Precio:''});
                            }
                        }
                    ],
                },
            }
        ],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        height: 400,
        cellEdit:true,
        loadonce: true, 
        onCellSelect : function(rowid, iCol, cellcontent, e) { // use this event to capture edited cellID
            var iRow = jq_grid.jqGrid('getInd',rowid)
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            var rowdata = jq_grid.getRowData(rowid);
            if(((cm[iCol].name !="Unidad") && cm[iCol].editable) ){
                jq_grid.resetSelection();
                row_editing_detalle_presentacion_articulo = iRow;
                col_editing_detalle_presentacion_articulo = iCol;
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: true,
                });
            }else{
                jq_grid.jqGrid('saveCell',row_editing_detalle_presentacion_articulo,col_editing_detalle_presentacion_articulo);
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: false,
                });
            }
        },
        onSelectRow: function (rowid, status, e){
            
        },
        loadComplete:function(data){
            var ids = jq_grid.getDataIDs()
            if(ids){
                ids.forEach(function (element, index, array) {
                    var fila = jq_grid.getRowData(element);
                    $("#lista_select_"+element).val(fila.Codigo_Unidad);

                });
            }
            cargar_filas_jqgrid(jq_grid);
        }
    });
}
async function rellenar_nombre_presentacion(tabla){
    var jq_grid =$("#tablas_nombre_presentacion");
     var codigo = $("#tablas_"+tabla+"_codigo").val();
     
     jq_grid.jqGrid({
         url: '/'+tabla+'/nombre_presentacion',
         mtype: "POST",
         datatype: "json",
         postData:{
             codigo_articulo: codigo,
         },
         colNames: ["Codigo_Articulo","Nombre_Presentacion"],
         colModel: [
             {   name:'Codigo_Articulo', width:100, hidden: true, editable:true,
                 editoptions:{
                     dataEvents: [
                         {
                             type: 'keydown',
                             fn: function(e) {
                                 var keycode = (e.keyCode ? e.keyCode : e.code);
                                 keydown_jqgrid(jq_grid,keycode,{Codigo_Articulo:'',Nombre_Presentacion:''});
                             }
                         }
                     ],
                 },
             },
             {  name:'Nombre_Presentacion', width:400, editable:true,
                editoptions:{
                    dataEvents: [
                        {
                            type: 'keydown',
                            fn: function(e) {
                                var keycode = (e.keyCode ? e.keyCode : e.code);
                                keydown_jqgrid(jq_grid,keycode,{Codigo_Articulo:'',Nombre_Presentacion:''});
                            }
                        }
                    ],
                },
             },
         ],
         viewrecords: true,
         rownumbers: true,
         shrinkToFit: false,
         height: 400,
         loadonce: true, 
         cellEdit: true,
         onSelectRow: function (rowid, status, e){
             
         },
         loadComplete:function(data){
            cargar_filas_jqgrid(jq_grid);
         }
     });
}
async function rellenar_datos_tecnicos(tabla){
    var jq_grid =$("#tablas_datos_tecnicos");
     var codigo = $("#tablas_"+tabla+"_codigo").val();

     await $.ajax({
        type: 'POST',
        url: '/'+tabla+'/datos_tecnicos_productos',
        data: {
            codigo_articulo: codigo,
            tipo: 'S'
        },
        success: function (result){
            for (let i = 0; i < result.length; i++) {
                const element = result[i];
                if (element.Modulo == "C") {
                    $("#tablas_"+tabla+"_compra").prop("checked", true);
                }
                if (element.Modulo == "V") {
                    $("#tablas_"+tabla+"_venta").prop("checked", true);
                }
            }
        }
    });
     
     jq_grid.jqGrid({
         url: '/'+tabla+'/datos_tecnicos_productos',
         mtype: "POST",
         datatype: "json",
         postData:{
             codigo_articulo: codigo,
             tipo: 'N'
         },
         colNames: ["Titulo","Descripcion"],
         colModel: [
             { 
                 name:'Titulo', width:100, editable:true,
                 editoptions:{
                     dataEvents: [
                         {
                             type: 'keydown',
                             fn: function(e) {
                                 var keycode = (e.keyCode ? e.keyCode : e.code);
                                 keydown_jqgrid(jq_grid,keycode,{Titulo:'',Descripcion:''});
                             }
                         }
                     ],
                 },
             },
             { 
                 name:'Descripcion', width:400, editable:true,
                 editoptions:{
                     dataEvents: [
                         {
                             type: 'keydown',
                             fn: function(e) {
                                 var keycode = (e.keyCode ? e.keyCode : e.code);
                                 keydown_jqgrid(jq_grid,keycode,{Codigo_Articulo:'',Nombre_Presentacion:''});
                             }
                         }
                     ],
                 },
             },
         ],
         viewrecords: true,
         rownumbers: true,
         shrinkToFit: false,
         height: 400,
         loadonce: true, 
         cellEdit: true,
         onSelectRow: function (rowid, status, e){
             
         },
         loadComplete:function(data){
            cargar_filas_jqgrid(jq_grid);
         }
     });
}
async function rellenar_lista_precios_compra(tabla){
     var jq_grid =$("#tablas_lista_precios_compra");
     var codigo = $("#tablas_"+tabla+"_codigo").val();

     lista_precios_productos="";

     row_editing_detalle_lista_precios = "";
     col_editing_detalle_lista_precios = "";

     await $.ajax({
        type: 'POST',
        data: {
            tipo: '42'
        },
        url: '/lista_precios/lista',
        success: function (result){
            result.forEach(element => {
                lista_precios_productos +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
            });
        }
     });

     jq_grid.jqGrid({
         url: '/'+tabla+'/lista_precios_compra',
         mtype: "POST",
         datatype: "json",
         postData:{
             codigo_articulo: codigo,
         },
         colNames: ["Codigo","Nombre","Lista","Precio","Codigo_Lista"],
         colModel: [
             { 
                 name:'Codigo', width:100, editable:true,
                 editoptions:{
                     dataEvents: [
                         {
                             type: 'keydown',
                             fn: function(e) {
                                 var keycode = (e.keyCode ? e.keyCode : e.code);
                                 keydown_jqgrid(jq_grid,keycode,{Codigo:'',Nombre:'',Lista:'',Precio:''});
                             }
                         }
                     ],
                 },
             },
             { 
                 name:'Nombre', width:350, editable:true,
                 editoptions:{
                     dataEvents: [
                         {
                             type: 'keydown',
                             fn: function(e) {
                                 var keycode = (e.keyCode ? e.keyCode : e.code);
                                 keydown_jqgrid(jq_grid,keycode,{Codigo:'',Nombre:'',Lista:'',Precio:''});
                             }
                         }
                     ],
                 },
             },
             { 
                name:'Lista', width:150, formatter:lista_select_precios
            },
            { 
                name:'Precio', width:100, editable:true, hidden: true,
                editoptions:{
                    dataEvents: [
                        {
                            type: 'keydown',
                            fn: function(e) {
                                var keycode = (e.keyCode ? e.keyCode : e.code);
                                keydown_jqgrid(jq_grid,keycode,{Codigo:'',Nombre:'',Lista:'',Precio:''});
                            }
                        }
                    ],
                },
            },
            { 
                name:'Codigo_Lista', width:100, editable:true, hidden: true
            },
         ],
         viewrecords: true,
         rownumbers: true,
         shrinkToFit: false,
         height: 400,
         loadonce: true, 
         cellEdit: true,
         onSelectRow: function (rowid, status, e){
             
         },
         loadComplete:function(data){
            var ids = jq_grid.getDataIDs()
            if(ids){
                ids.forEach(function (element, index, array) {
                    var fila = jq_grid.getRowData(element);
                    $("#lista_select_"+element).val(fila.Codigo_Lista);

                });
            }

            cargar_filas_jqgrid(jq_grid);
         },
         onCellSelect: function (rowid, iCol) {
            var iRow = jq_grid.jqGrid('getInd',rowid)
            selected_cell_lista_precios = iCol;
            row_editing_detalle_lista_precios = iRow;

            var iRow = jq_grid.jqGrid('getInd',rowid)
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            if(((cm[iCol].name !="Lista") && cm[iCol].editable) ){
                jq_grid.resetSelection();
                row_editing_detalle_lista_precios = iRow;
                col_editing_detalle_lista_precios = iCol;
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: true,
                });
            }else{
                jq_grid.jqGrid('saveCell',row_editing_detalle_lista_precios,col_editing_detalle_lista_precios);
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: false,
                });
            }
         },
         onSelectCell: function (rowid, cellname, value, iRow, iCol) {
            selected_cell_lista_precios = iCol;
         },
         ondblClickRow: function(rowid,iRow,iCol,e){
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            rowid_dblclick_detalle_contable= rowid;
            var rowdata = jq_grid.getRowData(rowid);
            switch (cm[iCol].name){
                case "Codigo":
                    if(rowdata.Tipo_Anexo!="00"){
                        lista_mantenimientos_tipo_anexo = rowdata.Tipo_Anexo;
                        open_modal_tablas_mantenimientos_grid(cm[iCol].name,iRow+'_Codigo_Anexo');
                    }
                break;
            }
        },
     });
}
function rellenar_codigo_anexo_mantenimiento(data){
    var rowId=rowid_dblclick_detalle_contable;
    jq_grid = $("#tablas_lista_precios_compra");
    jq_grid.jqGrid('saveCell',row_editing_detalle_lista_precios,selected_cell_lista_precios);
    jq_grid.jqGrid('setCell',rowId,"Codigo",data.Codigo);
    jq_grid.jqGrid('setCell',rowId,"Nombre",data.Nombre);
}
async function rellenar_codigos_alternativos(tabla){
    var jq_grid =$("#tablas_codigos_alternativos");
     var codigo = $("#tablas_"+tabla+"_codigo").val();
     
     jq_grid.jqGrid({
         url: '/'+tabla+'/codigos_alternativos',
         mtype: "POST",
         datatype: "json",
         postData:{
             codigo_articulo: codigo,
         },
         colNames: ["Codigo_Barra","Activo"],
         colModel: [
             { 
                 name:'Codigo_Barra', width:300, editable:true,
                 editoptions:{
                     dataEvents: [
                         {
                             type: 'keydown',
                             fn: function(e) {
                                 var keycode = (e.keyCode ? e.keyCode : e.code);
                                 keydown_jqgrid(jq_grid,keycode,{Codigo_Barra:'',Activo:''});
                             }
                         }
                     ],
                 },
             },
             { 
                 name:'Activo', align: 'center', width:100,formatter:'checkbox',editoptions:{ value: 'S:N', defaultValue: 'N' }, width:50,formatoptions: {disabled:false}
             },
         ],
         viewrecords: true,
         rownumbers: true,
         shrinkToFit: false,
         height: 400,
         loadonce: true, 
         cellEdit: true,
         onSelectRow: function (rowid, status, e){
             
         },
         loadComplete:function(data){
            cargar_filas_jqgrid(jq_grid);
         }
     });
}

function rellenar_group_formas_pago_listas(tabla, tipo_anexo) {
    

    var codigo_anexo=$("#tablas_"+tabla+"_codigo").val();
    var url_elegidos='/forma_pago/clientes/';
    if(isEmptyOrWhiteSpaces(codigo_anexo)){
        url_elegidos='/forma_pago/lista/';
    };
    
    var jq_grid_lista=$("#grid_tablas_"+tabla+"_forma_pago_lista");
    var jq_grid_elegidos=$("#grid_tablas_"+tabla+"_forma_pago_elegidos");
    
    
    jq_grid_elegidos.jqGrid({
        url: url_elegidos,
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: codigo_anexo,
            tipo: tipo_anexo
        },
        colNames: ["Pred.","Código","Nombre"],
        colModel: [{name:'Predeterminado',formatter:'checkbox',editoptions:{value:"S:N"}, width:50,formatoptions: {disabled:false}, align:'center'},{name:'Codigo', width:70, template:textTemplate},{ name:'Nombre', width:300, template:textTemplate}],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        // autowidth: true,
        height: 400,
        width: 350,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
            var ids= jq_grid_elegidos.getDataIDs()
            
            for(var i=0;i<ids.length;i++){
                if(ids[i]!=rowid){
                    jq_grid_elegidos.setRowData(ids[i],{Predeterminado:'N'});
                }
            }
        },
        loadComplete:function(data){
        }
    });

    jq_grid_lista.jqGrid({
        url: '/forma_pago/lista_seleccionar/',
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: codigo_anexo,
            tipo: tipo_anexo
        },
        colNames: ["Activo","Código","Nombre"],
        colModel: [{name:'Activo',formatter:'checkbox',editoptions:{value:"S:N"}, width:50,formatoptions: {disabled:false}, align:'center'},{name:'Codigo', width:70, template:textTemplate},{ name:'Nombre', width:300, template:textTemplate}],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        height: 400,
        width: 350,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
            var row = jq_grid_lista.getRowData(rowid);
            var ids= jq_grid_elegidos.getDataIDs()
            if(row.Activo=="N"){
                for(var i=0;i<ids.length;i++){
                    var row_elegidos = jq_grid_elegidos.getRowData(ids[i]);
                    if(row_elegidos.Codigo == row.Codigo){
                        jq_grid_elegidos.delRowData(ids[i]);
                    }
                }
            }else{
                var add_new=true;
                for(var i=0;i<ids.length;i++){
                    var row_elegidos = jq_grid_elegidos.getRowData(ids[i]);
                    if(row_elegidos.Codigo == row.Codigo){
                        add_new=false;
                    }
                }
                if(add_new) jq_grid_elegidos.jqGrid('addRowData', undefined, {Predeterminado:'N',Codigo: row.Codigo,Nombre:row.Nombre});
            }
        },
        loadComplete:function(data){
        }
    });
    jq_grid_elegidos.jqGrid('filterToolbar',{stringResult: true, searchOnEnter : false, searchOperators : true});
    jq_grid_lista.jqGrid('filterToolbar',{stringResult: true, searchOnEnter : false, searchOperators : true});
}

function rellenar_group_direcciones_alternativas(tabla, tipo_anexo) {
    
    var codigo_anexo=$("#tablas_"+tabla+"_codigo").val();
    var jq_grid = $("#grid_tablas_"+tabla+"_direcciones_alternativas");
    var fila_vacia = {Direccion:'',Ubigeo:''};
    jq_grid.jqGrid({
        url: "/"+tabla+"/direcciones_alternativas/",
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: codigo_anexo,
            tipo: tipo_anexo
        },
        colNames: ["Direccion","Ubigeo"],
        colModel: [{name:'Direccion', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }
        },{ name:'Ubigeo', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode, fila_vacia);
                        }
                    }
                ],
            }
        }],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        cellEdit: true,
        // autowidth: true,
        height: 400,
        width: 700,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
        },
        loadComplete:function(data){
            jq_grid.jqGrid('addRowData',undefined,fila_vacia);  
        }
    });
}

function rellenar_group_persona_contacto(tabla) {
    
    var codigo_anexo=$("#tablas_"+tabla+"_codigo").val();
    var jq_grid = $("#grid_tablas_"+tabla+"_persona_contacto");
    var fila_vacia = {Codigo:''};
    jq_grid.jqGrid({
        url: "/"+tabla+"/lista_contactos/",
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: codigo_anexo
        },
        colNames: ['Pred.','Codigo','Nombre','Documento','Cargo','Email','Telefono1','Telefono2','Telefono3','Telefono4','Referencia','Comentario1','Comentario2','Activo'],
        colModel: [
            {name:'Predeterminado', width:100, formatter:'checkbox',editoptions:{value:"S:N"}, formatoptions: {disabled:false}, align:'center'},
            {name:'Codigo', width:100, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Nombre', width:250, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Documento', width:100, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Cargo', width:150, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Email', width:200, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Telefono1', width:100, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Telefono2', width:100, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Telefono3', width:100, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Telefono4', width:100, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Referencia', width:150, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Comentario1', width:200, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Comentario2', width:200, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Activo', width:100, formatter:'checkbox',editoptions:{value:"S:N"}, formatoptions: {disabled:false}, align:'center'}
        ],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        cellEdit: true,
        // autowidth: true,
        height: 400,
        width: 760,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
        },
        loadComplete:function(data){
            jq_grid.jqGrid('addRowData',undefined,fila_vacia);  
        }
    });
}

function rellenar_group_detracciones_listas(tabla, tipo_anexo) {
    

    var codigo_anexo=$("#tablas_"+tabla+"_codigo").val();
    var url_elegidos='/detracciones/anexos/';
    if(isEmptyOrWhiteSpaces(codigo_anexo)){
        url_elegidos='/detracciones/lista_seleccionar/';
    };
    
    var jq_grid_lista=$("#grid_tablas_"+tabla+"_detracciones_lista");
    var jq_grid_elegidos=$("#grid_tablas_"+tabla+"_detracciones_elegidos");
    
    
    jq_grid_elegidos.jqGrid({
        url: url_elegidos,
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: codigo_anexo,
            tipo: tipo_anexo
        },
        colNames: ["Pred.","Código","Nombre"],
        colModel: [{name:'Predeterminado',formatter:'checkbox',editoptions:{value:"S:N"}, width:50,formatoptions: {disabled:false}, align:'center'},{name:'Codigo', width:70, template:textTemplate},{ name:'Nombre', width:300, template:textTemplate}],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        // autowidth: true,
        height: 400,
        width: 350,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
            var ids= jq_grid_elegidos.getDataIDs()
            
            for(var i=0;i<ids.length;i++){
                if(ids[i]!=rowid){
                    jq_grid_elegidos.setRowData(ids[i],{Predeterminado:'N'});
                }
            }
        },
        loadComplete:function(data){
        }
    });

    jq_grid_lista.jqGrid({
        url: '/detracciones/lista_seleccionar/',
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: codigo_anexo,
            tipo: tipo_anexo
        },
        colNames: ["Activo","Código","Nombre"],
        colModel: [{name:'Activo',formatter:'checkbox',editoptions:{value:"S:N"}, width:50,formatoptions: {disabled:false}, align:'center'},{name:'Codigo', width:70, template:textTemplate},{ name:'Nombre', width:300, template:textTemplate}],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        height: 400,
        width: 350,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
            var row = jq_grid_lista.getRowData(rowid);
            if(row.Activo=="N"){
                var ids= jq_grid_elegidos.getDataIDs()
                for(var i=0;i<ids.length;i++){
                    var row_elegidos = jq_grid_elegidos.getRowData(ids[i]);
                    if(row_elegidos.Codigo == row.Codigo){
                        jq_grid_elegidos.delRowData(ids[i]);
                    }
                }
            }else{
                jq_grid_elegidos.jqGrid('addRowData', undefined, {Predeterminado:'N',Codigo: row.Codigo,Nombre:row.Nombre});
            }
        },
        loadComplete:function(data){
        }
    });
    
    jq_grid_elegidos.jqGrid('filterToolbar',{stringResult: true, searchOnEnter : false, searchOperators : true});
    jq_grid_lista.jqGrid('filterToolbar',{stringResult: true, searchOnEnter : false, searchOperators : true});
}

function rellenar_group_agencias(tabla, tipo_anexo) {
    var row_editing_agencias= "";
    var col_editing_agencias = "";
    var codigo_anexo=$("#tablas_"+tabla+"_codigo").val();
    var jq_grid = $("#grid_tablas_"+tabla+"_agencias");
    var fila_vacia = {Direccion:'',Ubigeo:''};

    lista_tipo_agencias="";

    $.ajax({
        type: 'POST',
        url: '/tipo_agencia/lista',
        success: function (result){
            result.forEach(element => {
                lista_tipo_agencias +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
            });
        }
    });

    jq_grid.jqGrid({
        url: "/"+tabla+"/lista_agencias/",
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: codigo_anexo,
            tipo: tipo_anexo
        },
        colNames: ["Codigo","Nombre","Codigo_Tipo_Agencia","Tipo_Agencia","Direccion","Contacto","Telefono","Codigo_Ubigeo"],
        colModel: [
            {name:'Codigo', width:100, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }
        },{ name:'Nombre', width:250, editable:true,
        editoptions:{
            dataEvents: [
                {
                    type: 'keydown',
                    fn: function(e) {
                        var keycode = (e.keyCode ? e.keyCode : e.code);
                        keydown_jqgrid(jq_grid,keycode, fila_vacia);
                    }
                }
            ],
        }
        },{ name:'Codigo_Tipo_Agencia', width:100, hidden: true
        },{ name:'Tipo_Agencia', width:100, formatter:lista_select_tipo_agencia
        },{ name:'Direccion', width:250, editable:true,
        editoptions:{
            dataEvents: [
                {
                    type: 'keydown',
                    fn: function(e) {
                        var keycode = (e.keyCode ? e.keyCode : e.code);
                        keydown_jqgrid(jq_grid,keycode, fila_vacia);
                    }
                }
            ],
        }
        },{ name:'Contacto', width:150, editable:true,
        editoptions:{
            dataEvents: [
                {
                    type: 'keydown',
                    fn: function(e) {
                        var keycode = (e.keyCode ? e.keyCode : e.code);
                        keydown_jqgrid(jq_grid,keycode, fila_vacia);
                    }
                }
            ],
        }
        },{ name:'Telefono', width:100, editable:true,
        editoptions:{
            dataEvents: [
                {
                    type: 'keydown',
                    fn: function(e) {
                        var keycode = (e.keyCode ? e.keyCode : e.code);
                        keydown_jqgrid(jq_grid,keycode, fila_vacia);
                    }
                }
            ],
        }
        },{ name:'Codigo_Ubigeo', width:100, editable:true,
        editoptions:{
            dataEvents: [
                {
                    type: 'keydown',
                    fn: function(e) {
                        var keycode = (e.keyCode ? e.keyCode : e.code);
                        keydown_jqgrid(jq_grid,keycode, fila_vacia);
                    }
                }
            ],
        }
        }],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        cellEdit: true,
        // autowidth: true,
        height: 400,
        width: 760,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
            var iRow = jq_grid.jqGrid('getInd',rowid)
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            if(((cm[iCol].name !="Tipo_Agencia") && cm[iCol].editable) ){
                jq_grid.resetSelection();
                row_editing_agencias = iRow;
                col_editing_agencias = iCol;
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: true,
                });
            }else{
                jq_grid.jqGrid('saveCell',row_editing_agencias,col_editing_agencias);
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: false,
                });
            }
        },
        loadComplete:function(data){
            jq_grid.jqGrid('addRowData',undefined,fila_vacia);  

            var ids = jq_grid.getDataIDs()
            if(ids){
                ids.forEach(function (element, index, array) {
                    var fila = jq_grid.getRowData(element);
                    $("#lista_select_"+element).val(fila.Codigo_Tipo_Agencia);
                });
            } 
        }
    });
}

function rellenar_group_avales(tabla, tipo_anexo) {
    
    var codigo_anexo=$("#tablas_"+tabla+"_codigo").val();
    var jq_grid = $("#grid_tablas_"+tabla+"_aval");
    var fila_vacia = {Direccion:'',Ubigeo:''};
    jq_grid.jqGrid({
        url: "/"+tabla+"/lista_aval/",
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: codigo_anexo,
            tipo: tipo_anexo
        },
        colNames: ["Codigo","Nombre","Direccion","Telefono","Codigo_Ubigeo","Nombre_Ubigeo"],
        colModel: [
        {name:'Codigo', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }
        },{ name:'Nombre', width:300, editable:true,
        editoptions:{
            dataEvents: [
                {
                    type: 'keydown',
                    fn: function(e) {
                        var keycode = (e.keyCode ? e.keyCode : e.code);
                        keydown_jqgrid(jq_grid,keycode, fila_vacia);
                    }
                }
            ],
        }
        },{ name:'Direccion', width:300, editable:true,
        editoptions:{
            dataEvents: [
                {
                    type: 'keydown',
                    fn: function(e) {
                        var keycode = (e.keyCode ? e.keyCode : e.code);
                        keydown_jqgrid(jq_grid,keycode, fila_vacia);
                    }
                }
            ],
        }
        },{ name:'Telefono', width:300, editable:true,
        editoptions:{
            dataEvents: [
                {
                    type: 'keydown',
                    fn: function(e) {
                        var keycode = (e.keyCode ? e.keyCode : e.code);
                        keydown_jqgrid(jq_grid,keycode, fila_vacia);
                    }
                }
            ],
        }
        },{ name:'Codigo_Ubigeo', width:300, editable:true,
        editoptions:{
            dataEvents: [
                {
                    type: 'keydown',
                    fn: function(e) {
                        var keycode = (e.keyCode ? e.keyCode : e.code);
                        keydown_jqgrid(jq_grid,keycode, fila_vacia);
                    }
                }
            ],
        }
        },{ name:'Nombre_Ubigeo', width:300, editable:true,
        editoptions:{
            dataEvents: [
                {
                    type: 'keydown',
                    fn: function(e) {
                        var keycode = (e.keyCode ? e.keyCode : e.code);
                        keydown_jqgrid(jq_grid,keycode, fila_vacia);
                    }
                }
            ],
        }
        }],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        cellEdit: true,
        // autowidth: true,
        height: 400,
        width: 700,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
        },
        loadComplete:function(data){
            jq_grid.jqGrid('addRowData',undefined,fila_vacia);  
        }
    });
}
function rellenar_group_historial(tabla) {
    
    var codigo_anexo=$("#tablas_"+tabla+"_codigo").val();
    var jq_grid = $("#grid_tablas_"+tabla+"_historial");
    var fila_vacia = {Direccion:'',Ubigeo:''};
    jq_grid.jqGrid({
        url: "/"+tabla+"/historial/",
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: codigo_anexo
        },
        colNames: ["Comentario1","Comentario2","Comentario3","Fecha","Visible"],
        colModel: [
        {name:'Comentario1', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }
        },{ name:'Comentario2', width:300, editable:true,
        editoptions:{
            dataEvents: [
                {
                    type: 'keydown',
                    fn: function(e) {
                        var keycode = (e.keyCode ? e.keyCode : e.code);
                        keydown_jqgrid(jq_grid,keycode, fila_vacia);
                    }
                }
            ],
        }
        },{ name:'Comentario3', width:300, editable:true,
        editoptions:{
            dataEvents: [
                {
                    type: 'keydown',
                    fn: function(e) {
                        var keycode = (e.keyCode ? e.keyCode : e.code);
                        keydown_jqgrid(jq_grid,keycode, fila_vacia);
                    }
                }
            ],
        }
        },{ name:'Fecha', width:100,  editable:true, template: dateTemplate
        },{ name:'Visible', width:100, align: 'center',
        formatter:'checkbox',editoptions:{ value: 'S:N', defaultValue: 'N' }, width:50,formatoptions: {disabled:false}
        },],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        cellEdit: true,
        // autowidth: true,
        height: 400,
        width: 700,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
        },
        loadComplete:function(data){
            jq_grid.jqGrid('addRowData',undefined,fila_vacia);  
        }
    });
}
function rellenar_group_placas(tabla) {
    
    var codigo_anexo=$("#tablas_"+tabla+"_codigo").val();
    var jq_grid = $("#grid_tablas_"+tabla+"_placas");
    var fila_vacia = {Direccion:'',Ubigeo:''};
    jq_grid.jqGrid({
        url: "/"+tabla+"/placas/",
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: codigo_anexo,
            tipo: '12',
        },
        colNames: ["Placa","Marca","Año Fabricacion","Modelo","Combustible","Carrocería","Color","Numero_Motor","Numero_Serie","Longitud","Altura","Ancho","Categoría","Anio_Modelo","Version","Cilindros","Cilindrada","Peso_Bruto","Peso_Neto","Carga_Util"],
        colModel: [
            {name: 'Placa', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }},
            {name: 'Marca', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }},
            {name: 'Anio_Fabricacion', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }},
            {name: 'Modelo', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }},
            {name: 'Combustible', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }},
            {name: 'Carrocería', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }},
            {name: 'Color', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }},
            {name: 'Numero_Motor', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }},
            {name: 'Numero_Serie', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }},
            {name: 'Longitud', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }},
            {name: 'Altura', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }},
            {name: 'Ancho', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }},
            {name: 'Categoría', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }},
            {name: 'Anio_Modelo', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }},
            {name: 'Version', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }},
            {name: 'Cilindros', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }},
            {name: 'Cilindrada', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }},
            {name: 'Peso_Bruto', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }},
            {name: 'Peso_Neto', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }},
            {name: 'Carga_Util', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                    }
                ],
            }}
        ],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        cellEdit: true,
        // autowidth: true,
        height: 400,
        width: 700,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
        },
        loadComplete:function(data){
            jq_grid.jqGrid('addRowData',undefined,fila_vacia);  
        }
    });
}

function rellenar_group_retenciones_no_domiciliados_listas(tabla, tipo_anexo) {

    var codigo_anexo=$("#tablas_"+tabla+"_codigo").val();
    var url_elegidos='/retencion_no_domiciliado/anexos/';
    if(isEmptyOrWhiteSpaces(codigo_anexo)){
        url_elegidos='/retencion_no_domiciliado/lista_seleccionar/';
    };
    
    var jq_grid_lista=$("#grid_tablas_"+tabla+"_retenciones_no_domiciliados_lista");
    var jq_grid_elegidos=$("#grid_tablas_"+tabla+"_retenciones_no_domiciliados_elegidos");
    
    
    jq_grid_elegidos.jqGrid({
        url: url_elegidos,
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: codigo_anexo,
            tipo: tipo_anexo
        },
        colNames: ["Pred.","Código","Nombre"],
        colModel: [{name:'Predeterminado',formatter:'checkbox',editoptions:{value:"S:N"}, width:50,formatoptions: {disabled:false}, align:'center'},{name:'Codigo', width:70, template:textTemplate},{ name:'Nombre', width:300, template:textTemplate}],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        // autowidth: true,
        height: 400,
        width: 350,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
            var ids= jq_grid_elegidos.getDataIDs()
            
            for(var i=0;i<ids.length;i++){
                if(ids[i]!=rowid){
                    jq_grid_elegidos.setRowData(ids[i],{Predeterminado:'N'});
                }
            }
        },
        loadComplete:function(data){
        }
    });

    jq_grid_lista.jqGrid({
        url: '/retencion_no_domiciliado/lista_seleccionar/',
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: codigo_anexo,
            tipo: tipo_anexo
        },
        colNames: ["Activo","Código","Nombre"],
        colModel: [{name:'Activo',formatter:'checkbox',editoptions:{value:"S:N"}, width:50,formatoptions: {disabled:false}, align:'center'},{name:'Codigo', width:70, template:textTemplate},{ name:'Nombre', width:300, template:textTemplate}],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        height: 400,
        width: 350,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
            var row = jq_grid_lista.getRowData(rowid);
            if(row.Activo=="N"){
                var ids= jq_grid_elegidos.getDataIDs()
                for(var i=0;i<ids.length;i++){
                    var row_elegidos = jq_grid_elegidos.getRowData(ids[i]);
                    if(row_elegidos.Codigo == row.Codigo){
                        jq_grid_elegidos.delRowData(ids[i]);
                    }
                }
            }else{
                jq_grid_elegidos.jqGrid('addRowData', undefined, {Predeterminado:'N',Codigo: row.Codigo,Nombre:row.Nombre});
            }
        },
        loadComplete:function(data){
        }
    });
    
    jq_grid_elegidos.jqGrid('filterToolbar',{stringResult: true, searchOnEnter : false, searchOperators : true});
    jq_grid_lista.jqGrid('filterToolbar',{stringResult: true, searchOnEnter : false, searchOperators : true});
}
function rellenar_group_cuentas_corrientes(tabla) {
    var row_editing_dcuentas_corrientes= "";
    var col_editing_cuentas_corrientes = "";
    var codigo_anexo=$("#tablas_"+tabla+"_codigo").val();
    var jq_grid = $("#grid_tablas_"+tabla+"_cuentas_corrientes");
    var fila_vacia = {Codigo:''};

    lista_bancos="";
    lista_moneda="";

    $.ajax({
        type: 'POST',
        url: '/bancos/lista',
        success: function (result){
            result.forEach(element => {
                lista_bancos +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
            });
        }
    });

    $.ajax({
        type: 'POST',
        url: '/moneda/lista',
        success: function (result){
            result.forEach(element => {
                lista_moneda +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
            });
        }
    });

    jq_grid.jqGrid({
        url: "/"+tabla+"/cuenta_corrientes/",
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: codigo_anexo
        },
        colNames: ['Predeterminado','Cta. Cte.','Codigo Banco','Banco','Codigo Moneda','Moneda','Nro. Cta.Cta.'],
        colModel: [
            {name:'Predeterminado', width:100, formatter:'checkbox',editoptions:{value:"1:0"}, formatoptions: {disabled:false}, align:'center'},
            
            {name:'Cuenta_Corriente', width:100, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Codigo_Banco', width:150, hidden:true, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Banco', width:200, formatter:lista_select_bancos},
            {name:'Codigo_Moneda', width:150, hidden:true, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Moneda', width:100, formatter:lista_select_moneda},
            {name:'Numero_Cta_Cte', width:200, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }}
        ],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        cellEdit: true,
        // autowidth: true,
        height: 400,
        width: 750,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
            var iRow = jq_grid.jqGrid('getInd',rowid)
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            if(((cm[iCol].name !="Banco") && cm[iCol].editable) ){
                jq_grid.resetSelection();
                row_editing_dcuentas_corrientes = iRow;
                col_editing_cuentas_corrientes = iCol;
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: true,
                });
            }else{
                jq_grid.jqGrid('saveCell',row_editing_dcuentas_corrientes,col_editing_cuentas_corrientes);
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: false,
                });
            }
        },
        loadComplete:function(data){
            jq_grid.jqGrid('addRowData',undefined,fila_vacia); 
            var ids = jq_grid.getDataIDs()
            if(ids){
                ids.forEach(function (element, index, array) {
                    var fila = jq_grid.getRowData(element);
                    $("#lista_select_"+element).val(fila.Codigo_Banco);
                    $("#lista_select_codigo_moneda"+element).val(fila.Codigo_Moneda);

                });
            } 
        }
    });
}
function rellenar_group_codigos_alternativos(tabla, tipo_anexo) {
    
    var codigo_anexo=$("#tablas_"+tabla+"_codigo").val();
    var jq_grid = $("#grid_tablas_"+tabla+"_codigos_alternativos");
    var fila_vacia = {Codigo_Grupo:'',Codigo_Alternativo:'',Nombre_Aleternativo:''};
    jq_grid.jqGrid({
        url: "/"+tabla+"/codigos_alternativos/",
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: codigo_anexo,
            tipo: tipo_anexo
        },
        colNames: ["Codigo_Producto","Codigo_Alternativo","Nombre_Alternativo"],
        colModel: [
            {name:'Codigo_Producto', width:200, editable:true,
                editoptions:{
                    dataEvents: [
                        {
                            type: 'keydown',
                            fn: function(e) {
                                var keycode = (e.keyCode ? e.keyCode : e.code);
                                keydown_jqgrid(jq_grid,keycode,fila_vacia);
                            }
                        }
                    ],
                }
            },
            { name:'Codigo_Alternativo', width:200, editable:true,
                editoptions:{
                    dataEvents: [
                        {
                            type: 'keydown',
                            fn: function(e) {
                                var keycode = (e.keyCode ? e.keyCode : e.code);
                                keydown_jqgrid(jq_grid,keycode, fila_vacia);
                            }
                        }
                    ],
                }
            },
            { name:'Nombre_Alternativo', width:200, editable:true,
                editoptions:{
                    dataEvents: [
                        {
                            type: 'keydown',
                            fn: function(e) {
                                var keycode = (e.keyCode ? e.keyCode : e.code);
                                keydown_jqgrid(jq_grid,keycode, fila_vacia);
                            }
                        }
                    ],
                }
            }
        ],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        cellEdit: true,
        // autowidth: true,
        height: 400,
        width: 700,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
        },
        loadComplete:function(data){
            jq_grid.jqGrid('addRowData',undefined,fila_vacia);  
        }
    });
}

function rellenar_group_grupo_cuentas(tabla, tipo_anexo) {
    var row_editing_dcuentas= "";
    var col_editing_cuentas = "";
    var codigo_anexo=$("#tablas_"+tabla+"_codigo").val();
    var jq_grid = $("#grid_tablas_"+tabla+"_cuentas");
    var fila_vacia = {Codigo:''};

    lista_tipo_cuentas="";
    lista_moneda="";

    var array = [{"Nombre":"Venta","Codigo": "CTA",},{"Nombre":"Anticipo","Codigo": "ANT",}]
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        lista_tipo_cuentas +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
    }

    $.ajax({
        type: 'POST',
        url: '/moneda/lista',
        success: function (result){
            result.forEach(element => {
                lista_moneda +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
            });
        }
    });
    //console.log(tipo_anexo);
    jq_grid.jqGrid({
        url: "/"+tabla+"/cuentas/",
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: codigo_anexo,
            tipo: tipo_anexo,
        },
        colNames: ['Codigo Moneda','Moneda','Cuenta','Nombre Cuenta','Codigo_Tipo','Tipo'],
        colModel: [
            {name:'Codigo_Moneda', width:150, hidden:true, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Moneda', width:100, formatter:lista_select_moneda},
            {name:'Cuenta', width:150, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Nombre_Cuenta', width:300, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Codigo_Tipo', width:150, hidden: true, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Tipo', width:100, formatter:lista_select_tipo_cuenta},
        ],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        cellEdit: true,
        // autowidth: true,
        height: 250,
        width: 750,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
            selected_cell_lista_precios = iCol;
            rowid_selected_lista_precios=rowid;
            var iRow = jq_grid.jqGrid('getInd',rowid)
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            if(((cm[iCol].name !="Moneda") && cm[iCol].editable) ){
                jq_grid.resetSelection();
                row_editing_dcuentas = iRow;
                col_editing_cuentas = iCol;
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: true,
                });
            }else{
                jq_grid.jqGrid('saveCell',row_editing_dcuentas,col_editing_cuentas);
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: false,
                });
            }
        },
        loadComplete:function(data){
            if (data.length == 0) {
                jq_grid.jqGrid('addRowData',undefined,fila_vacia);
            }else{
                var ids = jq_grid.getDataIDs()
                if(ids){
                    ids.forEach(function (element, index, array) {
                        var fila = jq_grid.getRowData(element);
                        console.log(fila);
                        $("#lista_select_codigo_moneda"+element).val(fila.Codigo_Moneda);
                        $("#lista_select_"+element).val(fila.Codigo_Tipo);

                    });
                } 
            }
        },
        onSelectCell: function (rowid, cellname, value, iRow, iCol) {
            selected_cell_lista_precios = iCol;
            rowid_selected_lista_precios=rowid;
         },
         ondblClickRow: function(rowid,iRow,iCol,e){
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            rowid_dblclick_detalle_contable= rowid;
            switch (cm[iCol].name){
                case "Cuenta":
                    open_modal_tablas_mantenimientos_grid(cm[iCol].name,iRow+'_Cuenta');
                break;
            }
        },
    });
}

function rellenar_group_motivos_tramite(tabla) {
    var row_editing_dcuentas= "";
    var col_editing_cuentas = "";
    var codigo=$("#tablas_"+tabla+"_codigo").val();
    var jq_grid = $("#grid_tablas_"+tabla+"_series");
    var fila_vacia = {Codigo:''};

    lista_series="";

    for (let index = 2025; index >= 2010; index--) {
        lista_series +=  '<option value ="'+index+'">'+index+'</option>'
    }

    jq_grid.jqGrid({
        url: "/"+tabla+"/detalle/",
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: codigo,
        },
        colNames: ['Codigo_Serie','Serie','Numero'],
        colModel: [
            {name:'Codigo_Serie', width:150, hidden:true, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Serie', width:250, formatter:lista_select_series},
            {name:'Numero', width:250, editable:true, align: 'center',editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
        ],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        cellEdit: true,
        // autowidth: true,
        height: 250,
        width: 750,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
            selected_cell_lista_precios = iCol;
            rowid_selected_lista_precios=rowid;
            var iRow = jq_grid.jqGrid('getInd',rowid)
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            if(((cm[iCol].name !="Moneda") && cm[iCol].editable) ){
                jq_grid.resetSelection();
                row_editing_dcuentas = iRow;
                col_editing_cuentas = iCol;
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: true,
                });
            }else{
                jq_grid.jqGrid('saveCell',row_editing_dcuentas,col_editing_cuentas);
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: false,
                });
            }
        },
        loadComplete:function(data){
            jq_grid.jqGrid('addRowData',undefined,fila_vacia); 
            var ids = jq_grid.getDataIDs()
            if(ids){
                ids.forEach(function (element, index, array) {
                    var fila = jq_grid.getRowData(element);
                    $("#lista_select_"+element).val(fila.Codigo_Serie);

                });
            } 
        },
        onSelectCell: function (rowid, cellname, value, iRow, iCol) {
            selected_cell_lista_precios = iCol;
            rowid_selected_lista_precios=rowid;
         },
         ondblClickRow: function(rowid,iRow,iCol,e){
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            rowid_dblclick_detalle_contable= rowid;
            switch (cm[iCol].name){
                case "Cuenta":
                    open_modal_tablas_mantenimientos_grid(cm[iCol].name,iRow+'_Cuenta');
                break;
            }
        },
    });
}

function rellenar_group_forma_pago_detalle(tabla) {

    var codigo=$("#tablas_"+tabla+"_codigo").val();
    var jq_grid = $("#grid_tablas_"+tabla+"_detalle");
    var fila_vacia = {Desde:''};

    jq_grid.jqGrid({
        url: "/"+tabla+"/detalle/",
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: codigo,
        },
        colNames: ['Desde el Dia','Hasta el Dia','Porcentaje de Mora(-)'],
        colModel: [
            {name:'Desde', width:150, align: 'center',editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Hasta', width:250, editable:true, align: 'center',editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Porcentaje', width:250, editable:true, align: 'center',editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
        ],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        cellEdit: true,
        // autowidth: true,
        height: 250,
        width: 750,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
            selected_cell_lista_precios = iCol;
            rowid_selected_lista_precios=rowid;
            var iRow = jq_grid.jqGrid('getInd',rowid)
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
        },
        loadComplete:function(data){
            jq_grid.jqGrid('addRowData',undefined,fila_vacia); 
            var ids = jq_grid.getDataIDs()
        },
        onSelectCell: function (rowid, cellname, value, iRow, iCol) {
            selected_cell_lista_precios = iCol;
            rowid_selected_lista_precios=rowid;
         },
         ondblClickRow: function(rowid,iRow,iCol,e){
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            rowid_dblclick_detalle_contable= rowid;
        },
    });
}

function rellenar_group_partida_gastos_cuenta(tabla) {
    var row_editing_dcuentas= "";
    var col_editing_cuentas = "";
    var Codigo=$("#tablas_"+tabla+"_codigo").val();
    var jq_grid = $("#grid_tablas_"+tabla+"_cuentas");
    var fila_vacia = {Cuenta:''};

    jq_grid.jqGrid({
        url: "/"+tabla+"/cuentas/",
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: Codigo
        },
        colNames: ['Cuenta','Nombre_Cuenta'],
        colModel: [
            {name:'Cuenta', width:150, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Nombre_Cuenta', width:350, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
        ],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        cellEdit: true,
        // autowidth: true,
        height: 250,
        width: 750,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
            selected_cell_lista_precios = iCol;
            rowid_selected_lista_precios=rowid;
            var iRow = jq_grid.jqGrid('getInd',rowid)
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
        },
        loadComplete:function(data){
            jq_grid.jqGrid('addRowData',undefined,fila_vacia); 
            var ids = jq_grid.getDataIDs()
            if(ids){
                ids.forEach(function (element, index, array) {
                    var fila = jq_grid.getRowData(element);
                });
            } 
        },
        onSelectCell: function (rowid, cellname, value, iRow, iCol) {
            selected_cell_lista_precios = iCol;
            rowid_selected_lista_precios=rowid;
         },
         ondblClickRow: function(rowid,iRow,iCol,e){
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            rowid_dblclick_detalle_contable= rowid;
            switch (cm[iCol].name){
                case "Cuenta":
                    open_modal_tablas_mantenimientos_grid(cm[iCol].name,iRow+'_Cuenta');
                break;
            }
        },
    });
}

function rellenar_group_kits_articulos(tabla) {
    
    var codigo=$("#tablas_"+tabla+"_codigo").val();
    var jq_grid = $("#grid_tablas_"+tabla+"_articulos");
    var fila_vacia = {Direccion:'',Ubigeo:''};
    jq_grid.jqGrid({
        url: "/"+tabla+"/articulos/",
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: codigo
        },
        colNames: ["Codigo_Articulo","Codigo_Fabricante","Nombre","Unidad","Cantidad"],
        colModel: [
            {name:'Codigo_Articulo', width:100, editable:true,
                editoptions:{
                    dataEvents: [
                        {
                            type: 'keydown',
                            fn: function(e) {
                                var keycode = (e.keyCode ? e.keyCode : e.code);
                                keydown_jqgrid(jq_grid,keycode,fila_vacia);
                            }
                        }
                    ],
                }
            },
            { name:'Codigo_Fabricante', width:100, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode, fila_vacia);
                        }
                    }
                ],
            }
            },
            { name:'Nombre', width:300, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode, fila_vacia);
                        }
                    }
                ],
            }
            },
            { name:'Unidad', width:100,  editable:true
            },
            { name:'Cantidad', width:100,  editable:true
            },
        ],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        cellEdit: true,
        // autowidth: true,
        height: 300,
        width: 760,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
            selected_cell_lista_precios = iCol;
            rowid_selected_lista_precios=rowid;
        },
        onSelectCell: function (rowid, cellname, value, iRow, iCol) {
            selected_cell_lista_precios = iCol;
            rowid_selected_lista_precios=rowid;
        },
        loadComplete:function(data){
            jq_grid.jqGrid('addRowData',undefined,fila_vacia);  
        },
        ondblClickRow: function(rowid,iRow,iCol,e){
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            rowid_dblclick_kits_ariculos= rowid;
            switch (cm[iCol].name){
                case "Codigo_Articulo":
                    open_modal_tablas_mantenimientos_grid(cm[iCol].name,iRow+'_Codigo_Articulo');
                break;
            }
        },
    });
}

function rellenar_group_cuentas(tabla) {
    
    var codigo=$("#tablas_"+tabla+"_codigo").val();
    console.log(codigo);
    var jq_grid = $("#grid_tablas_"+tabla+"_cuentas");
    var fila_vacia = {Codigo:'', Cuenta: '', Porcentaje_Debe: 0, Porcentaje_Haber: 0};
    jq_grid.jqGrid({
        url: "/"+tabla+"/transferencias",
        mtype: "POST",
        datatype: "json",
        postData:{
            Codigo: codigo
        },
        colNames: ["Codigo","Cuenta","Porcentaje_Debe","Porcentaje_Haber"],
        colModel: [
            {name:'Codigo', width:100, hidden: true},
            { name:'Cuenta', width:350, editable:true,
            editoptions:{
                dataEvents: [
                    {
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode, fila_vacia);
                        }
                    }
                ],
            }
            },
            { name:'Porcentaje_Debe', width:100, editable:true, template: numberTemplate},
            { name:'Porcentaje_Haber', width:100,  editable:true, template: numberTemplate}
        ],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        cellEdit: true,
        // autowidth: true,
        height: 150,
        width: 784,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
            selected_cell_lista_precios = iCol;
            rowid_selected_lista_precios=rowid;
        },
        onSelectCell: function (rowid, cellname, value, iRow, iCol) {
            selected_cell_lista_precios = iCol;
            rowid_selected_lista_precios=rowid;
        },
        loadComplete:function(data){
            if (data.length == 0) {
                jq_grid.jqGrid('addRowData',undefined,fila_vacia);
            }   
        },
        ondblClickRow: function(rowid,iRow,iCol,e){
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            rowid_dblclick_cuentas= rowid;
            switch (cm[iCol].name){
                case "Cuenta":
                    open_modal_tablas_mantenimientos_grid(cm[iCol].name,iRow+'_Cuenta');
                break;
            }
        },
    });
}

function rellenar_group_subvoucher_cuentas(tabla, tipo_anexo) {
    var row_editing_dcuentas= "";
    var col_editing_cuentas = "";
    var codigo_subvoucher=$("#tablas_"+tabla+"_codigo").val();
    var jq_grid = $("#grid_tablas_"+tabla+"_cuentas_subvoucher");
    var fila_vacia = {Codigo:'',Cuenta:'',Codigo_Moneda:'',Moneda:'',Codigo_D_H:'',D_H:''};

    lista_tipo_cuentas="";
    lista_moneda="";

    var array = [{"Nombre":"Debe","Codigo": "D",},{"Nombre":"Haber","Codigo": "H",}]
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        lista_tipo_cuentas +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
    }

    $.ajax({
        type: 'POST',
        url: '/moneda/lista',
        success: function (result){
            result.forEach(element => {
                lista_moneda +=  '<option value ="'+element.Codigo+'">'+element.Nombre+'</option>'
            });
        }
    });

    jq_grid.jqGrid({
        url: "/"+tabla+"/cuentas/",
        mtype: "POST",
        datatype: "json",
        postData:{
            codigo: codigo_subvoucher
        },
        colNames: ['Codigo','Cuenta','Codigo_Moneda','Moneda','Codigo_D_H','D_H'],
        colModel: [
            {name:'Codigo', width:150, editable:true, hidden: true, editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Cuenta', width:350, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Codigo_Moneda', width:150, hidden:true, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'Moneda', width:100, formatter:lista_select_moneda},
            {name:'Codigo_D_H', width:150, hidden: true, editable:true,editoptions:{
                dataEvents: [{
                        type: 'keydown',
                        fn: function(e) {
                            var keycode = (e.keyCode ? e.keyCode : e.code);
                            keydown_jqgrid(jq_grid,keycode,fila_vacia);
                        }
                }],
            }},
            {name:'D_H', width:100, formatter:lista_select_tipo_cuenta},
        ],
        viewrecords: true,
        rownumbers: true,
        shrinkToFit: false,
        cellEdit: true,
        // autowidth: true,
        height: 250,
        width: 763,
        loadonce: true, 
        onSelectRow: function (rowid, status, e){
        },
        onCellSelect: function(rowid, iCol, cellcontent, e){
            selected_cell_lista_precios = iCol;
            rowid_selected_lista_precios=rowid;
            var iRow = jq_grid.jqGrid('getInd',rowid)
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            if(((cm[iCol].name !="Moneda") && cm[iCol].editable) ){
                jq_grid.resetSelection();
                row_editing_dcuentas = iRow;
                col_editing_cuentas = iCol;
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: true,
                });
            }else{
                jq_grid.jqGrid('saveCell',row_editing_dcuentas,col_editing_cuentas);
                jq_grid.jqGrid('setGridParam',{
                    cellEdit: false,
                });
            }
        },
        loadComplete:function(data){
            if (data.length == 0) {
                jq_grid.jqGrid('addRowData',undefined,fila_vacia);
            }else{
                var ids = jq_grid.getDataIDs()
                if(ids){
                    ids.forEach(function (element, index, array) {
                        var fila = jq_grid.getRowData(element);
                        $("#lista_select_codigo_moneda"+element).val(fila.Codigo_Moneda);
                        $("#lista_select_"+element).val(fila.Codigo_D_H);

                    });
                } 
            }
        },
        onSelectCell: function (rowid, cellname, value, iRow, iCol) {
            selected_cell_lista_precios = iCol;
            rowid_selected_lista_precios=rowid;
         },
         ondblClickRow: function(rowid,iRow,iCol,e){
            var cm = jq_grid.jqGrid("getGridParam", "colModel");
            rowid_dblclick_cuentas_subvoucher= rowid;
            switch (cm[iCol].name){
                case "Cuenta":
                    open_modal_tablas_mantenimientos_grid(cm[iCol].name,iRow+'_Cuenta');
                break;
            }
        },
    });
}

function lista_select_almacenes(cellvalue, options, rowObject)
{
    return '<select id="lista_select_'+options.rowId+'" class="form-control form-control-sm select-sm">'+lista_almacenes+'</select>'
}

function lista_select_unidades(cellvalue, options, rowObject)
{
    return '<select id="lista_select_'+options.rowId+'" class="form-control form-control-sm select-sm">'+lista_unidades+'</select>'
}

function lista_select_bancos(cellvalue, options, rowObject)
{
    return '<select id="lista_select_'+options.rowId+'" class="form-control form-control-sm select-sm">'+lista_bancos+'</select>'
}

function lista_select_moneda(cellvalue, options, rowObject)
{
    return '<select id="lista_select_codigo_moneda'+options.rowId+'" class="form-control form-control-sm select-sm">'+lista_moneda+'</select>'
}

function lista_select_precios(cellvalue, options, rowObject)
{
    return '<select id="lista_select_'+options.rowId+'" class="form-control form-control-sm select-sm">'+lista_precios_productos+'</select>'
}

function lista_select_tipo_agencia(cellvalue, options, rowObject)
{
    return '<select id="lista_select_'+options.rowId+'" class="form-control form-control-sm select-sm">'+lista_tipo_agencias+'</select>'
}

function lista_select_tipo_cuenta(cellvalue, options, rowObject)
{
    return '<select id="lista_select_'+options.rowId+'" class="form-control form-control-sm select-sm">'+lista_tipo_cuentas+'</select>'
}

function lista_select_series(cellvalue, options, rowObject)
{
    return '<select id="lista_select_'+options.rowId+'" class="form-control form-control-sm select-sm">'+lista_series+'</select>'
}

function validar_tablas(){
    var jq_grid = jq_grid_tablas;
    var rowid = jq_grid.jqGrid ('getGridParam', 'selrow');
    return !isEmptyOrWhiteSpaces(rowid);
}

function modificar_tablas(){
    var jq_grid = jq_grid_tablas;
    var rowid = jq_grid.jqGrid ('getGridParam', 'selrow');
    if(!isEmptyOrWhiteSpaces(rowid)){
        var row = jq_grid.jqGrid ('getRowData', rowid);
        open_modal_tablas({codigo: row.Codigo, nombre: row.Nombre, serie: row.Numero_Serie},{tabla_nombre:$("#modulo_tablas").text(),estado:"modificar", titulo:modal_tablas_titulo},jq_grid);
    }
}

function eliminar_tablas(){
    
    var jq_grid = jq_grid_tablas;
    var rowid = jq_grid.jqGrid ('getGridParam', 'selrow');
    if(!isEmptyOrWhiteSpaces(rowid)){
        var row = jq_grid.jqGrid ('getRowData', rowid);
        open_modal_tablas({codigo: row.Codigo, nombre: row.Nombre, serie: row.Numero_Serie},{tabla_nombre:$("#modulo_tablas").text(),estado:"eliminar", titulo:modal_tablas_titulo},jq_grid);
    }
}

async function guardar_tablas(modulo_tablas){
    console.log(modulo_tablas);
    var resultado=false;
    var guardar=true;
    var mensaje_exito;
    var mensaje_error;
    var mensaje_confirmacion;
    var lista_punto_venta_tipo_producto_almacen=[];
    var lista_productos_presentacion=[];
    var lista_productos_nombre_presentacion=[];
    var lista_productos_datos_tecnicos=[];
    var lista_productos_compras_precios=[];
    var lista_productos_codigos_alternativos = [];
    var lista_forma_pago_elegidos = [];
    var lista_direcciones_alternativas = [];
    var lista_persona_contacto = [];
    var lista_detracciones_elegidos = [];
    var lista_agencias = [];
    var lista_aval = [];
    var lista_historial = [];
    var lista_placas = [];
    var lista_retencion_no_domiciliados = [];
    var lista_cuentas_corrientes = [];
    var lista_codigos_alternativos = [];
    var lista_grupos_cuenta = [];
    var lista_motivos_tramite_series = [];
    var lista_forma_pago_detalle = [];
    var lista_partida_gasto_cuentas = [];
    var lista_kits_articulo = [];
    var lista_cuentas_transferencia = [];
    var lista_cuentas_subvoucher = [];

    if(tablas_listas_precios){
        tablas_listas_precios.forEach(element => {
            var predeterminado=$('#lista_precios_'+element.Codigo).is(':checked');
            element.Valor = predeterminado ? '1' : '0';
        });
    }
    var jq_grid_punto_venta_tipo_producto_almacen =$("#tablas_punto_venta_tipo_producto_almacen")

    if(jq_grid_punto_venta_tipo_producto_almacen){
        var ids = jq_grid_punto_venta_tipo_producto_almacen.getDataIDs();
        var fila = jq_grid_punto_venta_tipo_producto_almacen.getRowData(ids[0]);
        
        var ids = jq_grid_punto_venta_tipo_producto_almacen.getDataIDs()
        if(ids){
            ids.forEach(function (element, index, array) {
                var fila = jq_grid_punto_venta_tipo_producto_almacen.getRowData(element);
                var almacen=$("#lista_select_"+element).val();
                if(isEmptyOrWhiteSpaces(almacen)){
                    almacen=$("#tablas_punto_venta_almacen").val();
                }
                if(almacen){
                    lista_punto_venta_tipo_producto_almacen.push({Tipo_producto:fila.Tipo_Producto_Codigo, Almacen: almacen})
                }
            });
        }

    }

    var jq_grid_productos_presentacion =$("#tablas_presentacion_productos");
    if (jq_grid_productos_presentacion) {
        var ids = jq_grid_productos_presentacion.getDataIDs();

        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_productos_presentacion.getRowData(element);
                var unidad=$("#lista_select_"+element).val();
                if(unidad == '00'){
                    console.log("No Se Ingresa Presentacion del Producto");
                }
                else{
                    lista_productos_presentacion.push({Codigo_Unidad:unidad, Factor: fila.Factor, Precio: fila.Precio})
                }
            });
        }
    }
   
    var jq_grid_productos_nombre_presentacion =$("#tablas_nombre_presentacion");
    if (jq_grid_productos_nombre_presentacion) {
        var ids = jq_grid_productos_nombre_presentacion.getDataIDs();

        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_productos_nombre_presentacion.getRowData(element);
                if(fila.Nombre_Presentacion == ''){
                    console.log("No Se Ingresa Nombre Presentacion");
                }
                else{
                    lista_productos_nombre_presentacion.push({Nombre_Presentacion:fila.Nombre_Presentacion})
                }
            });
        }
    }

    var jq_grid_productos_datos_tecnicos =$("#tablas_datos_tecnicos");
    if (jq_grid_productos_datos_tecnicos) {
        var ids = jq_grid_productos_datos_tecnicos.getDataIDs();

        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_productos_datos_tecnicos.getRowData(element);
                console.log(fila);
                if(fila.Descripcion == ''){
                    console.log("No Se Ingresa Datos Tecnicos");
                }
                else{
                    lista_productos_datos_tecnicos.push({Titulo:fila.Titulo, Descripcion:fila.Descripcion})
                }
            });
        }
    }

    var jq_grid_productos_lista_precios_compra =$("#tablas_lista_precios_compra");
    if (jq_grid_productos_lista_precios_compra) {
        var ids = jq_grid_productos_lista_precios_compra.getDataIDs();

        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_productos_lista_precios_compra.getRowData(element);
                var lista_precios=$("#lista_select_"+element).val();
                if(fila.Codigo == ''){
                    console.log("No Se Ingresa Lista de Precios Compra");
                }
                else{
                    lista_productos_compras_precios.push({Codigo:fila.Codigo, Nombre: fila.Nombre, Codigo_Lista: lista_precios})
                }
            });
        }
    }

    var jq_grid_productos_codigos_alternativos =$("#tablas_codigos_alternativos");
    if (jq_grid_productos_codigos_alternativos) {
        var ids = jq_grid_productos_codigos_alternativos.getDataIDs();

        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_productos_codigos_alternativos.getRowData(element);
                if (fila.Codigo_Barra  == "") {
                    console.log("No Se Ingresa Codigo Alternativo");
                } else {
                    lista_productos_codigos_alternativos.push(fila);
                }
            });
        }
    }

    var jq_grid_forma_pago_elegidos =$("#grid_tablas_"+modulo_tablas+"_forma_pago_elegidos");
    if (jq_grid_forma_pago_elegidos) {
        var ids = jq_grid_forma_pago_elegidos.getDataIDs();
        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_forma_pago_elegidos.getRowData(element);
                if(!isEmptyOrWhiteSpaces(fila.Codigo)) lista_forma_pago_elegidos.push(fila);
            });
        }
    }

    var jq_grid_direcciones_alternativas =$("#grid_tablas_clientes_direcciones_alternativas");
    if (jq_grid_direcciones_alternativas) {
        var ids = jq_grid_direcciones_alternativas.getDataIDs();
        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_direcciones_alternativas.getRowData(element);
                if(!isEmptyOrWhiteSpaces(fila.Direccion)) lista_direcciones_alternativas.push(fila);
            });
        }
    }

    var jq_grid_persona_contacto =$("#grid_tablas_"+modulo_tablas+"_persona_contacto");
    if (jq_grid_persona_contacto) {
        var ids = jq_grid_persona_contacto.getDataIDs();
        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_persona_contacto.getRowData(element);
                if(!isEmptyOrWhiteSpaces(fila.Codigo)) lista_persona_contacto.push(fila);
            });
        }
    }

    var jq_grid_detracciones_elegidas =$("#grid_tablas_"+modulo_tablas+"_detracciones_elegidos");
    if (jq_grid_detracciones_elegidas) {
        var ids = jq_grid_detracciones_elegidas.getDataIDs();
        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_detracciones_elegidas.getRowData(element);
                if(!isEmptyOrWhiteSpaces(fila.Codigo)) lista_detracciones_elegidos.push(fila);
            });
        }
    }
    
    var jq_grid_agencias =$("#grid_tablas_"+modulo_tablas+"_agencias");
    if (jq_grid_agencias) {
        var ids = jq_grid_agencias.getDataIDs();
        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_agencias.getRowData(element);
                var lista_tipo_agencia=$("#lista_select_"+element).val();
                if(!isEmptyOrWhiteSpaces(fila.Codigo)) lista_agencias.push({Codigo:fila.Codigo, Nombre: fila.Nombre, Tipo_Agencia:lista_tipo_agencia, Direccion:fila.Direccion, Contacto:fila.Contacto, Telefono:fila.Telefono, Codigo_Ubigeo:fila.Codigo_Ubigeo});
            });
        }
    }

    var jq_grid_aval =$("#grid_tablas_clientes_aval");
    if (jq_grid_aval) {
        var ids = jq_grid_aval.getDataIDs();
        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_aval.getRowData(element);
                if(!isEmptyOrWhiteSpaces(fila.Codigo)) lista_aval.push(fila);
            });
        }
    }

    var jq_grid_historial =$("#grid_tablas_"+modulo_tablas+"_historial");
    if (jq_grid_historial) {
        var ids = jq_grid_historial.getDataIDs();
        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_historial.getRowData(element);
                if(!isEmptyOrWhiteSpaces(fila.Comentario1)) lista_historial.push(fila);
            });
        }
    }

    var jq_grid_placas =$("#grid_tablas_clientes_placas");
    if (jq_grid_placas) {
        var ids = jq_grid_placas.getDataIDs();
        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_placas.getRowData(element);
                if(!isEmptyOrWhiteSpaces(fila.Placa)) lista_placas.push(fila);
            });
        }
    }
    
    var jq_grid_retencion_no_domiciliados_elegidos =$("#grid_tablas_proveedores_retenciones_no_domiciliados_elegidos");
    if (jq_grid_retencion_no_domiciliados_elegidos) {
        var ids = jq_grid_retencion_no_domiciliados_elegidos.getDataIDs();
        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_retencion_no_domiciliados_elegidos.getRowData(element);
                lista_retencion_no_domiciliados.push(fila);
            });
        }
    }

    var jq_grid_cuentas_corrientes =$("#grid_tablas_proveedores_cuentas_corrientes");
    if (jq_grid_cuentas_corrientes) {
        var ids = jq_grid_cuentas_corrientes.getDataIDs();
        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_cuentas_corrientes.getRowData(element);
                var lista_banco=$("#lista_select_"+element).val();
                var lista_moneda=$("#lista_select_codigo_moneda"+element).val();
                if (fila.Cuenta_Corriente == "") {
                    console.log("No Se Ingreso Cuentas Corrientes")
                } else {
                    lista_cuentas_corrientes.push({Predeterminado:fila.Predeterminado, Cuenta_Corriente: fila.Cuenta_Corriente, Banco:lista_banco, Moneda:lista_moneda, Numero_Cta_Cte:fila.Numero_Cta_Cte});
                }         
            });
        }
    }

    var jq_grid_codigos_alternativos =$("#grid_tablas_proveedores_codigos_alternativos");
    if (jq_grid_codigos_alternativos) {
        var ids = jq_grid_codigos_alternativos.getDataIDs();
        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_codigos_alternativos.getRowData(element);
                if (fila.Cuenta == "") {
                    console.log("No Se Ingreso Cuenta")
                } else {
                    lista_codigos_alternativos.push(fila);
                } 
            });
        }
    }

    var jq_grid_grupo_cuentas =$("#grid_tablas_"+modulo_tablas+"_cuentas");
    if (jq_grid_grupo_cuentas) {
        var ids = jq_grid_grupo_cuentas.getDataIDs();
        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_grupo_cuentas.getRowData(element);
                var lista_moneda=$("#lista_select_codigo_moneda"+element).val();
                var lista_tipo_cuento=$("#lista_select_"+element).val();
                if (fila.Cuenta == "") {
                    console.log("No Se Ingreso Codigo Alternativo")
                } else {
                    lista_grupos_cuenta.push({Moneda: lista_moneda, Cuenta: fila.Cuenta, Tipo_Cuenta: lista_tipo_cuento});
                } 
            });
        }
    }
    var jq_grid_motivos_tramites_series =$("#grid_tablas_"+modulo_tablas+"_series");
    if (jq_grid_motivos_tramites_series) {
        var ids = jq_grid_motivos_tramites_series.getDataIDs();
        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_motivos_tramites_series.getRowData(element);
                var lista_serie=$("#lista_select_"+element).val();
                if (fila.Numero == "") {
                    console.log("No Se Ingreso Codigo Alternativo")
                } else {
                    lista_motivos_tramite_series.push({Serie: lista_serie, Numero: fila.Numero});
                } 
            });
        }
    }
    var jq_grid_forma_detalle =$("#grid_tablas_"+modulo_tablas+"_detalle");
    if (jq_grid_forma_detalle) {
        var ids = jq_grid_forma_detalle.getDataIDs();
        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_forma_detalle.getRowData(element);
                if (fila.Desde == "") {
                    console.log("No Se Ingreso Forma Pago Detalle")
                } else {
                    lista_forma_pago_detalle.push(fila);
                } 
            });
        }
    }

    var jq_grid_partida_gastos_cuentas =$("#grid_tablas_"+modulo_tablas+"_cuentas");
    if (jq_grid_partida_gastos_cuentas) {
        var ids = jq_grid_partida_gastos_cuentas.getDataIDs();
        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_partida_gastos_cuentas.getRowData(element);
                if (fila.Cuenta == "") {
                    console.log("No Se Ingreso Forma Pago Detalle")
                } else {
                    lista_partida_gasto_cuentas.push(fila);
                } 
            });
        }
    }

    var jq_grid_kits_articulos =$("#grid_tablas_"+modulo_tablas+"_articulos");
    if (jq_grid_kits_articulos) {
        var ids = jq_grid_kits_articulos.getDataIDs();
        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_kits_articulos.getRowData(element);
                if (fila.Codigo_Articulo == "") {
                    console.log("No Se Ingreso Forma Pago Detalle")
                } else {
                    lista_kits_articulo.push(fila);
                } 
            });
        }
    }
    
    var jq_grid_cuentas_transferencia =$("#grid_tablas_"+modulo_tablas+"_cuentas");
    if (jq_grid_cuentas_transferencia) {
        var ids = jq_grid_cuentas_transferencia.getDataIDs();
        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_cuentas_transferencia.getRowData(element);
                if (fila.Codigo == "") {
                    console.log("No Se Ingreso Forma Pago Detalle")
                } else {
                    lista_cuentas_transferencia.push(fila);
                } 
            });
        }
    }

    var jq_grid_cuentas_subvoucher =$("#grid_tablas_"+modulo_tablas+"_cuentas_subvoucher");
    if (jq_grid_cuentas_subvoucher) {
        var ids = jq_grid_cuentas_subvoucher.getDataIDs();
        if (ids) {
            ids.forEach(element => {
                var fila = jq_grid_cuentas_subvoucher.getRowData(element);
                var lista_moneda=$("#lista_select_codigo_moneda"+element).val();
                var lista_dh = $("#lista_select_"+element).val();
                if (fila.Codigo == "") {
                    console.log("No Se Ingreso Forma Pago Detalle")
                } else {
                    lista_cuentas_subvoucher.push({Cuenta: fila.Codigo, Moneda: lista_moneda, D_H: lista_dh });
                } 
            });
        }
    }
    
    if(isEmptyOrWhiteSpaces($("#tablas_"+modulo_tablas+"_zona").val()))
        $("#tablas_"+modulo_tablas+"_zona").val("00");
        
    if(isEmptyOrWhiteSpaces($("#tablas_"+modulo_tablas+"_comision").val()))
        $("#tablas_"+modulo_tablas+"_comision").val("0")

    if(isEmptyOrWhiteSpaces($("#tablas_"+modulo_tablas+"_nombre").val())){
        guardar = false;
        mensaje_error = "El nombre no puede estar en blanco";
    }
    
    var datos={};

    switch (modulo_tablas) {
        case "vendedor":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Telefono1: $("#tablas_"+modulo_tablas+"_telefono1").val(),
                Telefono2: $("#tablas_"+modulo_tablas+"_telefono2").val(),
                Telefono3: $("#tablas_"+modulo_tablas+"_telefono3").val(),
                Telefono4: $("#tablas_"+modulo_tablas+"_telefono4").val(),
                Telefono5: $("#tablas_"+modulo_tablas+"_telefono5").val(),
                Email: $("#tablas_"+modulo_tablas+"_email").val(),
                Zona_Codigo: $("#tablas_"+modulo_tablas+"_zona").val(),
                Cargo: $("#tablas_"+modulo_tablas+"_cargo").val(),
                Firma: $("#tablas_"+modulo_tablas+"_firma").val(),
                Comision: $("#tablas_"+modulo_tablas+"_comision").val(),
                Listas_Precios: JSON.stringify( tablas_listas_precios),
            };
        break;
        case "almacen":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Direccion: $("#tablas_"+modulo_tablas+"_direccion").val(),
                Responsable: $("#tablas_"+modulo_tablas+"_responsable").val(),
                Visible: $("#tablas_"+modulo_tablas+"_visible").is(':checked') ? 'S' :'N'
            }
        break;
        case "punto_venta":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Direccion: $("#tablas_"+modulo_tablas+"_direccion").val(),
                Almacen_Relacionado: $("#tablas_"+modulo_tablas+"_almacen").val(),
                Listas_Almacenes_Productos: JSON.stringify(lista_punto_venta_tipo_producto_almacen),
            }
        break;
        case "empleados":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Correo: $("#tablas_"+modulo_tablas+"_correo").val(), 
                Cargo: $("#tablas_"+modulo_tablas+"_cargo").val(),
                Firma: $("#tablas_"+modulo_tablas+"_firma").val(),
                Direccion: $("#tablas_"+modulo_tablas+"_direccion").val(),
                Tipo_Trabajador: $("#tablas_"+modulo_tablas+"_tipo_trabajador").val(),
                Tipo_Documento: $("#tablas_"+modulo_tablas+"_tipo_documento").val(),
                Numero_Documento: $("#tablas_"+modulo_tablas+"_numero_documento").val(),
                Apellido_Paterno: $("#tablas_"+modulo_tablas+"_apellido_paterno").val(),
                Apellido_Materno: $("#tablas_"+modulo_tablas+"_apellido_materno").val(),
                Fecha_Ingreso: $("#tablas_"+modulo_tablas+"_fecha_ingreso").val(), 
                Pais: $("#tablas_"+modulo_tablas+"_pais").val(), 
                Sexo: $('input:radio[name=tablas_'+modulo_tablas+'_sexo]:checked').val(),
                Usuario: $("#tablas_"+modulo_tablas+"_usuario").val(),
                Aprobar_Req_1: $('input:radio[name=tablas_'+modulo_tablas+'_aprob_req_1]:checked').val(),
                Aprobar_Req_2: $('input:radio[name=tablas_'+modulo_tablas+'_aprob_req_2]:checked').val(),
                Aprobar_Orden_Compra: $('input:radio[name=tablas_'+modulo_tablas+'_aprob_orden_compra]:checked').val(),
                Generar_Orden_Compra: $('input:radio[name=tablas_'+modulo_tablas+'_generar_orden_compra]:checked').val(),
                Aprobar_Cotizacion: $('input:radio[name=tablas_'+modulo_tablas+'_aprobar_cotizacion]:checked').val(),
                Aprobar_Pedido: $('input:radio[name=tablas_'+modulo_tablas+'_aprobar_pedido]:checked').val(),
                Cierre_Fondo_Fijo: $('input:radio[name=tablas_'+modulo_tablas+'_cierre_fondo_fijo]:checked').val(),
            }
        break;
        case "productos":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Responsable: $("#tablas_"+modulo_tablas+"_responsable").val(),
                Almacen_Relacionado: $("#tablas_"+modulo_tablas+"_almacen").val(),
                Listas_Precios: JSON.stringify( tablas_listas_precios),
                Listas_Almacenes_Productos: JSON.stringify(lista_punto_venta_tipo_producto_almacen),
        
                Usuario: $("#tablas_"+modulo_tablas+"_usuario").val(),
                Observacion1: $("#tablas_"+modulo_tablas+"_observacion1").val(),
                Observacion2: $("#tablas_"+modulo_tablas+"_observacion2").val(),
                Contacto: $("#tablas_"+modulo_tablas+"_contacto").val(),
                Privado: $("#tablas_"+modulo_tablas+"_privado").is(':checked') ? 'S' :'N',
                Predeterminado: $("#tablas_"+modulo_tablas+"_predeterminado").is(':checked') ? '1' :'0',
        
        
                Automatico: $("#tablas_"+modulo_tablas+"_automatico").is(':checked') ? 'A' :'M',
                UNSPSC: $("#tablas_"+modulo_tablas+"_unspsc").val(),
                Tipo_Producto: $("#tablas_"+modulo_tablas+"_tipo_producto").val(),
                Codigo_Fabricante: $("#tablas_"+modulo_tablas+"_codigo_fabricante").val(),
                Codigo_Digemid: $("#tablas_"+modulo_tablas+"_codigo_digemid").val(),
                Codigo_Familia: $("#tablas_"+modulo_tablas+"_familia").val(),
                Codigo_Interno1: $("#tablas_"+modulo_tablas+"_codigo_interno").val(),
                Codigo_Interno2: $("#tablas_"+modulo_tablas+"_codigo_interno2").val(),
                Codigo_SubFamilia: $("#tablas_"+modulo_tablas+"_subfamilia").val(),
                Codigo_Concepto1: $("#tablas_"+modulo_tablas+"_categoria").val(),
                Ubicacion1: $("#tablas_"+modulo_tablas+"_ubicacion1").val(),
                Codigo_Concepto2: $("#tablas_"+modulo_tablas+"_tamaño").val(),
                Codigo_Concepto3: $("#tablas_"+modulo_tablas+"_dimension").val(),
                Ubicacion2: $("#tablas_"+modulo_tablas+"_ubicacion2").val(),
                Codigo_Concepto4: $("#tablas_"+modulo_tablas+"_marca").val(),
                Codigo_Concepto5: $("#tablas_"+modulo_tablas+"_diseño").val(),
                Moneda: $("#tablas_"+modulo_tablas+"_moneda").val(),
                Igv: $("#tablas_"+modulo_tablas+"_igv").val(),
                Codigo_Concepto6: $("#tablas_"+modulo_tablas+"_color").val(),
                Codigo_Concepto7: $("#tablas_"+modulo_tablas+"_concepto").val(),
                Estado: $("#tablas_"+modulo_tablas+"_estado").val(),
                Unidad: $("#tablas_"+modulo_tablas+"_unidad_medida").val(),
                Contenido: $("#tablas_"+modulo_tablas+"_contenido").val(),
                Unidad2: $("#tablas_"+modulo_tablas+"_unidad_medida2").val(),
                Categoria: $("#tablas_"+modulo_tablas+"_categoria2").val(),
                Stock_Max: $("#tablas_"+modulo_tablas+"_stock_max").val(),
                Peso: $("#tablas_"+modulo_tablas+"_peso").val(),
                Descuento1: $("#tablas_"+modulo_tablas+"_descuento1").val(),
                Stock_Min: $("#tablas_"+modulo_tablas+"_stock_minimo").val(),
                Largo: $("#tablas_"+modulo_tablas+"_largo").val(),
                Descuento2: $("#tablas_"+modulo_tablas+"_descuento2").val(),
                Stock_Rep: $("#tablas_"+modulo_tablas+"_stock_rep").val(),
                Ancho: $("#tablas_"+modulo_tablas+"_ancho").val(),
                Descuento3: $("#tablas_"+modulo_tablas+"_descuento3").val(),
                Grupo_Receta: $("#tablas_"+modulo_tablas+"_grupo_receta").val(),
                Codigo_Barra: $("#tablas_"+modulo_tablas+"_codigo_barra").val(),
                Codigo_Barra_Automatico: $("#tablas_"+modulo_tablas+"_automatico_codigo").is(':checked') ? 'A' :'M',
                Partida_Arancelaria: $("#tablas_"+modulo_tablas+"_partida_arranc").val(),
                Ruta_Imagen: $("#tablas_"+modulo_tablas+"_ruta_imagen").val(),
                Leyenda1:  $("#tablas_"+modulo_tablas+"_leyenda").val(),
                Leyenda2:  $("#tablas_"+modulo_tablas+"_leyenda2").val(),
                Fecha_Creacion:  $("#tablas_"+modulo_tablas+"_fecha_creacion").val(),
                Fecha_Modificacion: $("#tablas_"+modulo_tablas+"_fecha_modificacion").val(),
                Stock_SN: $("#tablas_"+modulo_tablas+"_si_stock").is(':checked') ? 'S' :'N',
                Lote_SN: $("#tablas_"+modulo_tablas+"_lote_si").is(':checked') ? 'S' :'N',
                Serie_SN: $("#tablas_"+modulo_tablas+"_serie_si").is(':checked') ? 'S' :'N',
                Servicio_SN: $("#tablas_"+modulo_tablas+"_servicio_si").is(':checked') ? 'S' :'N',
                Kits_SN: $("#tablas_"+modulo_tablas+"_kits_si").is(':checked') ? 'S' :'N',
                Activo_Fijo_SN: $("#tablas_"+modulo_tablas+"_activo_fijo_si").is(':checked') ? 'S' :'N',
                Iqpf_SN: $("#tablas_"+modulo_tablas+"_iqpf_si").is(':checked') ? 'S' :'N',
                Advalorem_SN: $("#tablas_"+modulo_tablas+"_advalorem_si").is(':checked') ? 'S' :'N',
                Porcentaje_Advalorem: $("#tablas_"+modulo_tablas+"_porcentaje_advalorem").val(),
                Isc_SN: $("#tablas_"+modulo_tablas+"_serie_si").is(':checked') ? 'S' :'N',
                Porcentaje_Isc: $("#tablas_"+modulo_tablas+"_porcentaje_isc").val(),
                Percepcion_SN: $("#tablas_"+modulo_tablas+"_percepcion_si").is(':checked') ? 'S' :'N',
                Porcentaje_Percepcion: $("#tablas_"+modulo_tablas+"_porcentaje_percepcion").val(),
                Icbper_SN:  $("#tablas_"+modulo_tablas+"_monto_icbper").is(':checked') ? 'S' :'N',
                Monto_Icbper: $("#tablas_"+modulo_tablas+"_porcentaje_percepcion").val(),
                Receta_SN:  $("#tablas_"+modulo_tablas+"_receta_si").is(':checked') ? 'S' :'N',
                Desc_Formato_SN:  $("#tablas_"+modulo_tablas+"_desc_formato_si").is(':checked') ? 'S' :'N',
                Comision_SN: $("#tablas_"+modulo_tablas+"_comision_si").is(':checked') ? 'S' :'N',
                Porcentaje_Comision: $("#tablas_"+modulo_tablas+"_porcentaje_comision").val(),
                Digemid_SN: $("#tablas_"+modulo_tablas+"_digemid2_si").is(':checked') ? 'S' :'N',
                Listas_Productos_Presentacion: JSON.stringify(lista_productos_presentacion),
                Listas_Productos_Nombre_Presentacion: JSON.stringify(lista_productos_nombre_presentacion),
                Compra: $("#tablas_"+modulo_tablas+"_compra").is(':checked') ? 'S' :'N',
                Venta: $("#tablas_"+modulo_tablas+"_venta").is(':checked') ? 'S' :'N',
                Listas_Productos_Datos_Tecnicos: JSON.stringify(lista_productos_datos_tecnicos),
                Listas_Productos_Compras_Precios: JSON.stringify(lista_productos_compras_precios),
                Listas_Productos_Codigos_Alternativos: JSON.stringify(lista_productos_codigos_alternativos),
            }
        break;
        case "agencia_transporte":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Telefono1: $("#tablas_"+modulo_tablas+"_telefono1").val(),
                Telefono2: $("#tablas_"+modulo_tablas+"_telefono2").val(),
                Telefono3: $("#tablas_"+modulo_tablas+"_telefono3").val(),
                Telefono4: $("#tablas_"+modulo_tablas+"_telefono4").val(),
                Telefono5: $("#tablas_"+modulo_tablas+"_telefono5").val(),
                Email: $("#tablas_"+modulo_tablas+"_email").val(),
                Zona_Codigo: $("#tablas_"+modulo_tablas+"_zona").val(),
                Direccion: $("#tablas_"+modulo_tablas+"_direccion").val(),
                Responsable: $("#tablas_"+modulo_tablas+"_responsable").val(),
        
                Correo: $("#tablas_"+modulo_tablas+"_correo").val(), 
                Usuario: $("#tablas_"+modulo_tablas+"_usuario").val(),
        
                Web: $("#tablas_"+modulo_tablas+"_web").val(),
                Ruc: $("#tablas_"+modulo_tablas+"_ruc").val(),
                Observacion1: $("#tablas_"+modulo_tablas+"_observacion1").val(),
                Observacion2: $("#tablas_"+modulo_tablas+"_observacion2").val(),
                Contacto: $("#tablas_"+modulo_tablas+"_contacto").val(),
                Privado: $("#tablas_"+modulo_tablas+"_privado").is(':checked') ? 'S' :'N',
                Predeterminado: $("#tablas_"+modulo_tablas+"_predeterminado").is(':checked') ? '1' :'0',
            }
        break;
        case "transportista":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Telefono1: $("#tablas_"+modulo_tablas+"_telefono1").val(),
                Email: $("#tablas_"+modulo_tablas+"_email").val(),
                Direccion: $("#tablas_"+modulo_tablas+"_direccion").val(),
                Responsable: $("#tablas_"+modulo_tablas+"_responsable").val(),
                Almacen_Relacionado: $("#tablas_"+modulo_tablas+"_almacen").val(),
        
                Tipo_Documento: $("#tablas_"+modulo_tablas+"_tipo_documento").val(),
                Numero_Documento: $("#tablas_"+modulo_tablas+"_numero_documento").val(),
                Apellido_Paterno: $("#tablas_"+modulo_tablas+"_apellido_paterno").val(),
                Apellido_Materno: $("#tablas_"+modulo_tablas+"_apellido_materno").val(),
        
                Web: $("#tablas_"+modulo_tablas+"_web").val(),
                Ruc: $("#tablas_"+modulo_tablas+"_ruc").val(),
                Observacion1: $("#tablas_"+modulo_tablas+"_observacion1").val(),
                Observacion2: $("#tablas_"+modulo_tablas+"_observacion2").val(),
                Contacto: $("#tablas_"+modulo_tablas+"_contacto").val(),
                Privado: $("#tablas_"+modulo_tablas+"_privado").is(':checked') ? 'S' :'N',
                Predeterminado: $("#tablas_"+modulo_tablas+"_predeterminado").is(':checked') ? '1' :'0',
        
                Razon_Social: $("#tablas_"+modulo_tablas+"_razon_social").val(),
                Licencia: $("#tablas_"+modulo_tablas+"_licencia").val(),
                Vehiculo: $("#tablas_"+modulo_tablas+"_vehiculo").val(),
                Fax: $("#tablas_"+modulo_tablas+"_fax").val(),
        
                Placa: $("#tablas_"+modulo_tablas+"_placa").val(),
                Inscripcion:  $("#tablas_"+modulo_tablas+"_numero_inscripcion").val(),
        
            }
        break;
        case "vehiculo":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Privado: $("#tablas_"+modulo_tablas+"_privado").is(':checked') ? 'S' :'N',
                Predeterminado: $("#tablas_"+modulo_tablas+"_predeterminado").is(':checked') ? '1' :'0',
                Placa: $("#tablas_"+modulo_tablas+"_placa").val(),
                Inscripcion:  $("#tablas_"+modulo_tablas+"_numero_inscripcion").val(),
            }
        break;
        case "chofer":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Tipo_Documento: $("#tablas_"+modulo_tablas+"_tipo_documento").val(),
                Licencia: $("#tablas_"+modulo_tablas+"_licencia").val(),
                Numero_Documento: $("#tablas_"+modulo_tablas+"_numero_documento").val(),
                Privado: $("#tablas_"+modulo_tablas+"_privado").is(':checked') ? 'S' :'N',
                Predeterminado: $("#tablas_"+modulo_tablas+"_predeterminado").is(':checked') ? '1' :'0',
        
            }
        break;
        case "clientes":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Editar: $("#tablas_"+modulo_tablas+"_editar").is(':checked') ? 'S' :'N',
                Codigo_interno: $("#tablas_"+modulo_tablas+"_codigo_interno").val(),
                Grupo_clientes: $("#tablas_"+modulo_tablas+"_grupo_clientes").val(),
                Tipo_documento_identidad: $("#tablas_"+modulo_tablas+"_tipo_documento_identidad").val(),
                Numero_documento: $("#tablas_"+modulo_tablas+"_numero_documento").val(),
                Tipo_cliente: $("#tablas_"+modulo_tablas+"_tipo_cliente").val(),
                Numero_ruc: $("#tablas_"+modulo_tablas+"_numero_ruc").val(),
                Numero_dni: $("#tablas_"+modulo_tablas+"_numero_dni").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Nombre_comercial: $("#tablas_"+modulo_tablas+"_nombre_comercial").val(),
                Direccion: $("#tablas_"+modulo_tablas+"_direccion").val(),
                Estado_contribuyente: $("#tablas_"+modulo_tablas+"_estado_contribuyente").val(),
                Condicion: $("#tablas_"+modulo_tablas+"_condicion").val(),
                Telefono1: $("#tablas_"+modulo_tablas+"_telefono1").val(),
                Telefono2: $("#tablas_"+modulo_tablas+"_telefono2").val(),
                Telefono3: $("#tablas_"+modulo_tablas+"_telefono3").val(),
                Telefono4: $("#tablas_"+modulo_tablas+"_telefono4").val(),
                Correo: $("#tablas_"+modulo_tablas+"_correo").val(),
                Fax: $("#tablas_"+modulo_tablas+"_fax").val(),
                Copy_mail: $("#tablas_"+modulo_tablas+"_copy_mail").val(),
                Departamento: $("#tablas_"+modulo_tablas+"_departamento").val(),
                Distrito: $("#tablas_"+modulo_tablas+"_distrito").val(),
                Pais: $("#tablas_"+modulo_tablas+"_pais").val(),
                Rubro: $("#tablas_"+modulo_tablas+"_rubro").val(),
                Ciudad: $("#tablas_"+modulo_tablas+"_ciudad").val(),
                Zona1: $("#tablas_"+modulo_tablas+"_zona1").val(),
                Vendedor: $("#tablas_"+modulo_tablas+"_vendedor").val(),
                Zona2: $("#tablas_"+modulo_tablas+"_zona2").val(),
                Situacion1: $("#tablas_"+modulo_tablas+"_situacion1").val(),
                Situacion2: $("#tablas_"+modulo_tablas+"_situacion2").val(),
                Porcentaje_descuento: $("#tablas_"+modulo_tablas+"_porcentaje_descuento").val(),
                Credito_mn: $("#tablas_"+modulo_tablas+"_credito_mn").val(),
                Credito_me: $("#tablas_"+modulo_tablas+"_credito_me").val(),
                Gestor: $("#tablas_"+modulo_tablas+"_gestor").val(),
                Estado: $("#tablas_"+modulo_tablas+"_estado").val(),
                Leyenda1: $("#tablas_"+modulo_tablas+"_leyenda1").val(),
                Leyenda2: $("#tablas_"+modulo_tablas+"_leyenda2").val(),
                Bonificacion: $('input:radio[name=tablas_'+modulo_tablas+'_bonificacion]:checked').val(),
                Percepcion: $('input:radio[name=tablas_'+modulo_tablas+'_percepcion]:checked').val(),
                Retencion: $('input:radio[name=tablas_'+modulo_tablas+'_retencion]:checked').val(),
                Buen_contribuyente: $('input:radio[name=tablas_'+modulo_tablas+'_buen_contribuyente]:checked').val(),
                Controlar_linea: $('input:radio[name=tablas_'+modulo_tablas+'_controlar_linea]:checked').val(),
                Exonerado: $('input:radio[name=tablas_'+modulo_tablas+'_exonerado]:checked').val(),
                Excluye_percepcion: $("#tablas_"+modulo_tablas+"_excluye_percepcion").is(':checked') ? 'S' :'N',
                Percepcion_porcentaje: $("#tablas_"+modulo_tablas+"_percepcion_porcentaje").val(),
                Retencion_porcentaje: $("#tablas_"+modulo_tablas+"_retencion_porcentaje").val(),
                Listas_Precios: JSON.stringify( tablas_listas_precios),
                Lista_forma_pago_elegidos: JSON.stringify(lista_forma_pago_elegidos),
                Lista_direcciones_alternativas: JSON.stringify(lista_direcciones_alternativas),
                Lista_persona_contacto: JSON.stringify(lista_persona_contacto),
                Lista_detracciones_elegidos: JSON.stringify(lista_detracciones_elegidos),
                Lista_agencias: JSON.stringify(lista_agencias),
                Lista_aval: JSON.stringify(lista_aval),
                Lista_historial: JSON.stringify(lista_historial),
                Lista_placas: JSON.stringify(lista_placas),

            }
        break;
        case "proveedores":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Grupo_Proveedor: $("#tablas_"+modulo_tablas+"_grupo_proveedores").val(),
                Tipo_documento_identidad: $("#tablas_"+modulo_tablas+"_tipo_documento_identidad").val(),
                Numero_documento: $("#tablas_"+modulo_tablas+"_numero_documento").val(),
                Numero_ruc: $("#tablas_"+modulo_tablas+"_numero_ruc").val(),
                Numero_dni: $("#tablas_"+modulo_tablas+"_numero_dni").val(),
                No_Domiciliado_S_N: $("#tablas_"+modulo_tablas+"_no_domiciliado_si").is(':checked') ? 'S' :'N',
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Direccion: $("#tablas_"+modulo_tablas+"_direccion").val(),
                Estado: $("#tablas_"+modulo_tablas+"_estado_contribuyente").val(),
                Condicion: $("#tablas_"+modulo_tablas+"_condicion").val(),
                Telefono1: $("#tablas_"+modulo_tablas+"_telefono1").val(),
                Telefono2: $("#tablas_"+modulo_tablas+"_telefono2").val(),
                Correo: $("#tablas_"+modulo_tablas+"_correo").val(),
                Fax: $("#tablas_"+modulo_tablas+"_fax").val(),
                Pais: $("#tablas_"+modulo_tablas+"_pais").val(),
                Celular: $("#tablas_"+modulo_tablas+"_celular").val(),
                Zona1: $("#tablas_"+modulo_tablas+"_zona1").val(),
                Zona2: $("#tablas_"+modulo_tablas+"_zona2").val(),
                Situacion1: $("#tablas_"+modulo_tablas+"_situacion1").val(),
                Situacion2: $("#tablas_"+modulo_tablas+"_situacion2").val(),
                Leyenda1: $("#tablas_"+modulo_tablas+"_leyenda1").val(),
                Leyenda2: $("#tablas_"+modulo_tablas+"_leyenda2").val(),
                Bonificacion_S_N: $('input:radio[name=tablas_'+modulo_tablas+'_bonificacion]:checked').val(),
                Percepcion_S_N: $('input:radio[name=tablas_'+modulo_tablas+'_percepcion]:checked').val(),
                Retencion_S_N: $('input:radio[name=tablas_'+modulo_tablas+'_retencion]:checked').val(),
                Buen_contribuyente_S_N: $('input:radio[name=tablas_'+modulo_tablas+'_buen_contribuyente]:checked').val(),
                Percepcion_Documento_S_N: $('input:radio[name=tablas_'+modulo_tablas+'_percepcion_documento]:checked').val(),
                Detraccion_S_N: $('input:radio[name=tablas_'+modulo_tablas+'_detraccion]:checked').val(),
                Excluye_percepcion: $("#tablas_"+modulo_tablas+"_excluye_percepcion").is(':checked') ? 'S' :'N',
                Percepcion_porcentaje: $("#tablas_"+modulo_tablas+"_percepcion_porcentaje").val(),
                Retencion_porcentaje: $("#tablas_"+modulo_tablas+"_retencion_porcentaje").val(),
                Direcion_Postal: $("#tablas_"+modulo_tablas+"_direccion_postal").val(),
                Telefono_Postal: $("#tablas_"+modulo_tablas+"_telefono_postal").val(),
                Celular_Postal: $("#tablas_"+modulo_tablas+"_celular_postal").val(),
                Email_Postal: $("#tablas_"+modulo_tablas+"_email_postal").val(),
                Nextel_Postal: $("#tablas_"+modulo_tablas+"_nextel_postal").val(),
                Fax_Postal: $("#tablas_"+modulo_tablas+"_fax_postal").val(),
                Web: $("#tablas_"+modulo_tablas+"_web").val(),
                Contacto: $("#tablas_"+modulo_tablas+"_contacto").val(),

                Lista_Forma_Pago_Elegidos: JSON.stringify(lista_forma_pago_elegidos),
                Lista_Persona_Contacto: JSON.stringify(lista_persona_contacto),
                Lista_Detracciones_Elegidos: JSON.stringify(lista_detracciones_elegidos),
                Lista_Agencias: JSON.stringify(lista_agencias),
                Lista_Historial: JSON.stringify(lista_historial),
                Lista_Retencion_No_Domiciliados: JSON.stringify(lista_retencion_no_domiciliados),
                Lista_Cuentas_Corrientes: JSON.stringify(lista_cuentas_corrientes),
                Lista_Codigos_Alternativos: JSON.stringify(lista_codigos_alternativos),
                
            }
        break;
        case "gestor_cobranza":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Predeterminado: $("#tablas_"+modulo_tablas+"predeterminado").is(':checked') ? '1' :'0',
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Telefono1: $("#tablas_"+modulo_tablas+"_telefono1").val(),
                Telefono2: $("#tablas_"+modulo_tablas+"_telefono2").val(),
                Correo: $("#tablas_"+modulo_tablas+"_email").val(),
                Celular: $("#tablas_"+modulo_tablas+"_celular").val(),
                Cargo: $("#tablas_"+modulo_tablas+"_cargo").val(),
            }
        break;
        case "cobrador":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Predeterminado: $("#tablas_"+modulo_tablas+"_predeterminado").is(':checked') ? '1' :'0',
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Telefono1: $("#tablas_"+modulo_tablas+"_telefono1").val(),
                Telefono2: $("#tablas_"+modulo_tablas+"_telefono2").val(),
                Correo: $("#tablas_"+modulo_tablas+"_email").val(),
                Usuario: $("#tablas_"+modulo_tablas+"_usuario").val(),
                Password: $("#tablas_"+modulo_tablas+"_password").val(),
            }
        break;
        case "grupo_cliente":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Lista_Cuentas_Grupos_Clientes: JSON.stringify(lista_grupos_cuenta),
            }
        break;
        case "grupo_proveedor":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Lista_Cuentas_Grupos_Proveedores: JSON.stringify(lista_grupos_cuenta),
            }
        break;
        case "tipo_productos":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Codigo_Sunat: $("#tablas_"+modulo_tablas+"_codigo_sunat").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
            }
        break;
        case "tipo_documento":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Codigo_Sunat: $("#tablas_"+modulo_tablas+"_codigo_sunat").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Compras: $("#tablas_"+modulo_tablas+"_compras").is(':checked') ? 'S' :'N',
                Ventas: $("#tablas_"+modulo_tablas+"_ventas").is(':checked') ? 'S' :'N',
                Contabilidad: $("#tablas_"+modulo_tablas+"_contabilidad").is(':checked') ? 'S' :'N',
                Almacen: $("#tablas_"+modulo_tablas+"_almacen").is(':checked') ? 'S' :'N',
                Caja: $("#tablas_"+modulo_tablas+"_caja").is(':checked') ? 'S' :'N',
                Punto_Venta: $("#tablas_"+modulo_tablas+"_punto_venta").is(':checked') ? 'S' :'N',
                Aplica_Percepcion: $('input:radio[name=tablas_'+modulo_tablas+'_aplica_percepcion]:checked').val(),
                Genera_Credifis: $('input:radio[name=tablas_'+modulo_tablas+'_genera_credifis]:checked').val(),
                Renta_Cuarta: $('input:radio[name=tablas_'+modulo_tablas+'_renta_cuarta]:checked').val(),
                Csigno: $('input:radio[name=tablas_'+modulo_tablas+'_csigno]:checked').val(),
                Cantidad_Caracteres: $("#tablas_"+modulo_tablas+"_cantidad_caracteres").val(),
                Mnimo_Percepcion: $("#tablas_"+modulo_tablas+"_minimo_percepcion").val(),
                Porcentaje_Igv: $("#tablas_"+modulo_tablas+"_porcentaje_igv").val(),
                Fecha_Tc: $("#tablas_"+modulo_tablas+"_fecha_tipo_cambio").val(),
                Ruta_Formato: $("#tablas_"+modulo_tablas+"_ruta_formato").val(),
                Tipo_Formato: $("#tablas_"+modulo_tablas+"_tipo_formato").val(),
            }
        break;
        case "talonarios":
            datos={
                Punto_Venta: $("#tablas_"+modulo_tablas+"_punto_venta").val(),
                Tipo_Documento: $("#tablas_"+modulo_tablas+"_tipo_documento").val(),
                Ruta_Formato: $("#tablas_"+modulo_tablas+"_ruta_formato").val(),
                Serie: $("#tablas_"+modulo_tablas+"_serie").val(),
                Activo: $("#tablas_"+modulo_tablas+"_activo").is(':checked') ? 'S' :'N',
                Ruta_Impresora: $("#tablas_"+modulo_tablas+"_ruta_impresora").val(),
                Ultimo_Grabado: $("#tablas_"+modulo_tablas+"_numero").val(),
                Predeterminado: $("#tablas_"+modulo_tablas+"_predeterminado").is(':checked') ? 'S' :'N',
                Numero_Filas: $("#tablas_"+modulo_tablas+"_numeros_filas").val(),
                Ancho: $("#tablas_"+modulo_tablas+"_ancho").val(),
                Alto: $("#tablas_"+modulo_tablas+"_alto").val(),
                A4: $("#tablas_"+modulo_tablas+"_a4").is(':checked') ? 'S' :'N',
            }
        break;
        case "motivos_tramite":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Predeterminado: $("#tablas_"+modulo_tablas+"_predeterminado").is(':checked') ? 'S' :'N',
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Tipo_Documento: $("#tablas_"+modulo_tablas+"_tipo_documento").val(),
                Ruta_Formato: $("#tablas_"+modulo_tablas+"_ruta_formato").val(),
                Ruta_Impresora: $("#tablas_"+modulo_tablas+"_ruta_impresora").val(),
                Lista_Motivos_Tramite_Series: JSON.stringify(lista_motivos_tramite_series),
            }
        break;
        case "forma_pago":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Afecta_Percepcion: $("#tablas_"+modulo_tablas+"_afecta_percepcion").is(':checked') ? 'S' :'N',
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Dias: $("#tablas_"+modulo_tablas+"_dias").val(),
                Lista_Forma_Pago_Detalle: JSON.stringify(lista_forma_pago_detalle),
            }
        break;
        case "cencos":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
                Responsable: $("#tablas_"+modulo_tablas+"_responsable").val(),
                Nivel: $("#tablas_"+modulo_tablas+"_nivel").val(),
                Digitos: ($("#tablas_"+modulo_tablas+"_codigo").val()).length,
            }
        break;
        case "unidad_negocios":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Direccion: $("#tablas_"+modulo_tablas+"_direccion").val(),
                Nivel: $("#tablas_"+modulo_tablas+"_nivel").val(),
            }
        break;
        case "orden_trabajo":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
                Orden_Servicio: $("#tablas_"+modulo_tablas+"_orden_servicio").val(),
                Presupuesto: $("#tablas_"+modulo_tablas+"_presupuesto").val(),
                Fecha_Inicio: $("#tablas_"+modulo_tablas+"_fecha_inicio").val(),
                Fecha_Final: $("#tablas_"+modulo_tablas+"_fecha_final").val(),
                Observacion1: $("#tablas_"+modulo_tablas+"_observacion1").val(),
                Observacion2: $("#tablas_"+modulo_tablas+"_observacion2").val(),
                Observacion3: $("#tablas_"+modulo_tablas+"_observacion3").val(),
            }
        break;
        case "partida_gasto":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
                Codigo_Sunat: $("#tablas_"+modulo_tablas+"_codigo_sunat").val(),
                Operacion: $("#tablas_"+modulo_tablas+"_operacion").val(),
                Lista_Partida_Gasto_Cuentas: JSON.stringify(lista_partida_gasto_cuentas),
            }
        break;
        case "presupuesto":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
                Responsable: $("#tablas_"+modulo_tablas+"_responsable").val(),
                Nivel: $("#tablas_"+modulo_tablas+"_nivel").val(),
            }
        break;
        case "kits":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Unidad: $("#tablas_"+modulo_tablas+"_unidad").val(),
                Lista_Kits_Articulos: JSON.stringify(lista_kits_articulo),
            }
        break;
        case "usuario":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Estado: $('input:radio[name=tablas_'+modulo_tablas+'_estado]:checked').val(),
                Password: $("#tablas_"+modulo_tablas+"_password").val(),
                Password2: $("#tablas_"+modulo_tablas+"_repetir_password").val(),
                Kardex: $('input:radio[name=tablas_'+modulo_tablas+'_kardex]:checked').val(),
                Compras: $('input:radio[name=tablas_'+modulo_tablas+'_compras]:checked').val(),
                Ventas: $('input:radio[name=tablas_'+modulo_tablas+'_ventas]:checked').val(),
            }
        break;
        case "familias":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Afecta_Abreviatura: $('input:radio[name=tablas_'+modulo_tablas+'_afecta_aberviatura]:checked').val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
                Cta_debe_pagar: $("#tablas_"+modulo_tablas+"_tipo_cta_debe_pagar").val(),
                Cta_ne_debe: $("#tablas_"+modulo_tablas+"_cta_ne_debe").val(),
                Cta_haber_ventas: $("#tablas_"+modulo_tablas+"_cta_haber_ventas").val(),
                Cta_ne_haber: $("#tablas_"+modulo_tablas+"_cta_ne_haber").val(),
                Cta_nc_dev: $("#tablas_"+modulo_tablas+"_cta_nc_dev").val(),
                Cta_ns_debe: $("#tablas_"+modulo_tablas+"_cta_ns_debe").val(),
                Cta_diferida: $("#tablas_"+modulo_tablas+"_cta_diferida").val(),
                Cta_ns_haber: $("#tablas_"+modulo_tablas+"_cta_ns_haber").val(),
                Cta_costo_debe: $("#tablas_"+modulo_tablas+"_cta_costo_debe").val(),
                Cta_debe_importacion: $("#tablas_"+modulo_tablas+"_cta_debe_importacion").val(),
                Cta_costo_haber: $("#tablas_"+modulo_tablas+"_cta_costo_haber").val(),
                Cta_costo_debe_produccion: $("#tablas_"+modulo_tablas+"_cta_costo_debe_produccion").val(),
                Cta_costo_haber_produccion: $("#tablas_"+modulo_tablas+"_cta_costo_haber_produccion").val(),
                Costo_diario: $("#tablas_"+modulo_tablas+"_costo_diario").val(),
                Costo_X_Hora: $("#tablas_"+modulo_tablas+"_costo_x_hora").val(),
            }
        break;
        case "subfamilias":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Afecta_Abreviatura: $('input:radio[name=tablas_'+modulo_tablas+'_afecta_aberviatura]:checked').val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val()
            }
        break;
        case "plan_contable":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Cuenta_Padre: $("#tablas_"+modulo_tablas+"_cuenta_padre").val(),
                Clase_Cuenta: $("#tablas_"+modulo_tablas+"_clase_cuenta").val(),
                Elemento: $("#tablas_"+modulo_tablas+"_elemento").val(),
                Tipo_Auxiliar: $("#tablas_"+modulo_tablas+"_tipo_auxiliar").val(),
                cencos_s_n: $('input:radio[name=tablas_'+modulo_tablas+'_cencos]:checked').val(),
                ot_s_n: $('input:radio[name=tablas_'+modulo_tablas+'_ot]:checked').val(),
                Nivel: $("#tablas_"+modulo_tablas+"_nivel").val(),
                Ajuste_Deudor: $("#tablas_"+modulo_tablas+"_ajuste_deudor").val(),
                Ajuste_Acreedor: $("#tablas_"+modulo_tablas+"_ajuste_acreedor").val(),
                Moneda_Cierre: $("#tablas_"+modulo_tablas+"_moneda_cierre").val(),
                Diferencia_Cierre: $('input:radio[name=tablas_'+modulo_tablas+'_diferencia_cierre]:checked').val(),
                transferencia_s_n: $('input:radio[name=tablas_'+modulo_tablas+'_transferencia]:checked').val(),
                D_H: $("#tablas_"+modulo_tablas+"_D_H").val(),
                Cuenta_Exterior: $("#tablas_"+modulo_tablas+"_cuenta_exterior").val(),
                Daot: $('input:radio[name=tablas_'+modulo_tablas+'_daot]:checked').val(),
                Cuenta_Pdt: $("#tablas_"+modulo_tablas+"_cuenta_pdt").val(),
                Clasificacion_bs: $("#tablas_"+modulo_tablas+"_clasificacion_bs").val(),
                Presupuesto_s_n: $('input:radio[name=tablas_'+modulo_tablas+'_presupuesto]:checked').val(),
                Nombre_Presupuesto: $("#tablas_"+modulo_tablas+"_nombre_presupuesto").val(),
                Lista_Cuentas_Transferemcia: JSON.stringify(lista_cuentas_transferencia),
            }
        break;
        case "concepto1":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
            }
        break;
        case "concepto2":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
            }
        break;
        case "concepto3":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
            }
        break;
        case "concepto4":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
            }
        break;
        case "concepto5":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
            }
        break;
        case "concepto6":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
            }
        break;
        case "concepto7":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
            }
        break;
        case "subvoucher":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
                Si_Transferencia: $('input:radio[name=tablas_'+modulo_tablas+'_genera_transferencia]:checked').val(),
                Si_Diferencia: $('input:radio[name=tablas_'+modulo_tablas+'_genera_diferencia]:checked').val(),
                Tipo_Cambio: $("#tablas_"+modulo_tablas+"_tipo_cambio").val(),
                Calcula_mn_me: $('input:radio[name=tablas_'+modulo_tablas+'_calcula_mn_me]:checked').val(),
                Caracteres: $("#tablas_"+modulo_tablas+"_caracteres").val(),
                Compras: $("#tablas_"+modulo_tablas+"_compras").is(':checked') ? 'S' :'N',
                Ventas: $("#tablas_"+modulo_tablas+"_ventas").is(':checked') ? 'S' :'N',
                Contabilidad: $("#tablas_"+modulo_tablas+"_contabilidad").is(':checked') ? 'S' :'N',
                Cancelacion: $("#tablas_"+modulo_tablas+"_cancelacion").is(':checked') ? 'S' :'N',
                Lista_Cuentas_Subvoucher: JSON.stringify(lista_cuentas_subvoucher),
            }
        break;
        case "tipo_auxiliar":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
            }
        break;
        case "grupo_auxiliar":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Tipo_Auxiliar: $("#tablas_"+modulo_tablas+"_tipo_auxiliar").val(),
                lista_cuentas_grupo_auxiliar: JSON.stringify(lista_grupos_cuenta),
            }
        break;
        case "asiento_patron":
            datos={
                Codigo: $("#tablas_"+modulo_tablas+"_codigo").val(),
                Nombre: $("#tablas_"+modulo_tablas+"_nombre").val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
                Provision: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
                Cuenta_Soles: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
                Tipo_Documento: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
                Cuenta_Dolares: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
                Abreviatura: $("#tablas_"+modulo_tablas+"_abreviatura").val(),
            }
        break;
    }

    console.log(datos)

    mensaje_exito="Registro";
    mensaje_confirmacion="¿Está seguro de";
    switch(estado_tablas){
        case "modificar":
            mensaje_exito += " modificado ";
            mensaje_confirmacion += " modificar ";
        break;
        case "guardar":
            mensaje_exito += " guardado "
        break;
        case "eliminar":
            mensaje_exito += " eliminado "
            mensaje_confirmacion += " eliminar ";
        break;
    }
    mensaje_exito += "correctamente.";
    mensaje_confirmacion +="el registro?";
            
    if(guardar && (estado_tablas=="eliminar" || estado_tablas=="modificar" )){
        guardar = confirm(mensaje_confirmacion);
    }else{
        mostrarMensajeModal("Aviso",mensaje_error);
    }

    if(guardar){
        await $.ajax({
            type: 'POST',
            url: '/'+modulo_tablas+'/'+estado_tablas,
            data: datos,
            success: function (result){
                console.log(result);
                resultado = result.estado;
                if(!result.estado){
                    mostrarMensajeModal("Aviso",result.mensaje);
                }                
            }
        });
        if(resultado){
            jq_grid=jq_grid_tablas_mantenimientos; 

            jq_grid.jqGrid('setGridParam',{
                url: url_tablas, 
                type: "POST",
            }).trigger('reloadGrid', { fromServer: true, page: 1 });

            $("#modal_tablas").modal("hide");
            mostrarMensajeModal("Aviso",mensaje_exito);
        }
    }
    
}

function keydown_jqgrid(jq_grid, keycode, fila_vacia){
    console.log(keycode);

    // var jq_grid=jq_grid_detalle_ventas;
    switch(keycode){
        // case 115: //F4 = 115
        //     event.preventDefault();
        //     jq_modal_productos.modal('show');
        // break;
        case 118: //F7 = 118
            event.preventDefault();
            jq_grid.jqGrid('addRowData',undefined,fila_vacia);  
            // if(!isEmptyOrWhiteSpaces(selected_Id_Cell_detalle_ventas))
            //     jq_grid.jqGrid('addRowData',undefined,fila_vacia_grid_detalle_productos,"after",selected_Id_Cell_detalle_ventas);
            // else
            //     jq_grid.jqGrid('addRowData',undefined,fila_vacia_grid_detalle_productos);  
        break;
        case 119: //F8 = 118
            event.preventDefault();
            var dataIds = jq_grid.getDataIDs();
            var rowId = jq_grid.jqGrid ("getGridParam", "selrow");
            jq_grid.jqGrid ("delRowData", rowId);
        break;
        case 115: //F4 = 115
        break;
        default:
            // console.log($("*:focus").attr("id"));
            // console.log(keycode);
    }
}

function cargar_filas_jqgrid(jq_grid){
    var ids=jq_grid.getDataIDs();
    if(ids.length==0){
        for(var i = 0 ; i < 1 ; i++ ){
            jq_grid.jqGrid('addRowData',undefined,fila_vacia_grid);
        }
    }      
}

function open_modal_tablas_mantenimientos_grid(name, id){
    switch (name){
        case "Codigo":
            var id_focused=id;
            var tabla_focused="codigo_proveedor";
            modal_open(tabla_focused,id_focused);
        break;
        case "Cuenta":
            var jq_grid = $("#grid_tablas_grupo_cliente_cuentas");
            var id_focused=id;
            var tabla_focused="plan_contable";
            lista_mantenimientos_nivel_plan_contable = 5;
            modal_open(tabla_focused,id_focused);
            jq_grid.saveCell(rowid_selected_lista_precios,selected_cell_lista_precios);
        break;
        case "Codigo_Articulo":
            var id_focused=id;
            var tabla_focused="articulos";
            modal_open(tabla_focused,id_focused);
        break;
    }
}

function rellenar_plan_contable_detalle(data){

    modulo_tablas = $("#modulo_tablas").text();
    var jq_grid = $("#grid_tablas_"+modulo_tablas+"_cuentas");
    jq_grid.saveCell(rowid_selected_lista_precios,selected_cell_lista_precios);

    if(!isEmptyOrWhiteSpaces(rowid_dblclick_detalle_contable)){

        var rowId=rowid_dblclick_detalle_contable;

        jq_grid.jqGrid('setCell',rowId,"Cuenta",data.Codigo);
        jq_grid.jqGrid('setCell',rowId,"Nombre_Cuenta",data.Nombre);
    }
    if (!isEmptyOrWhiteSpaces(rowid_dblclick_cuentas)) {
        var rowId=rowid_dblclick_cuentas;

        jq_grid.jqGrid('setCell',rowId,"Codigo",data.Codigo);
        jq_grid.jqGrid('setCell',rowId,"Cuenta",(data.Codigo +' - '+ data.Nombre)); 
    }
    if (!isEmptyOrWhiteSpaces(rowid_dblclick_cuentas_subvoucher)) {
        var jq_grid = $("#grid_tablas_"+modulo_tablas+"_cuentas_subvoucher");
        jq_grid.saveCell(rowid_selected_lista_precios,selected_cell_lista_precios);

        var rowId=rowid_dblclick_cuentas_subvoucher;

        jq_grid.jqGrid('setCell',rowId,"Codigo",data.Codigo);
        jq_grid.jqGrid('setCell',rowId,"Cuenta",(data.Codigo +' - '+ data.Nombre)); 
    }
}

function rellenar_articulos_seleccionados(data){
    console.log(data);
    modulo_tablas = $("#modulo_tablas").text();
    var jq_grid = $("#grid_tablas_"+modulo_tablas+"_articulos");
    jq_grid.saveCell(rowid_selected_lista_precios,selected_cell_lista_precios);
    var rowId=rowid_dblclick_kits_ariculos;

    jq_grid.jqGrid('setCell',rowId,"Codigo_Articulo",data.Codigo);
    jq_grid.jqGrid('setCell',rowId,"Codigo_Fabricante",data.Codigo_Fabricante);
    jq_grid.jqGrid('setCell',rowId,"Nombre",data.Nombre);
    jq_grid.jqGrid('setCell',rowId,"Unidad",data.Unidad);
    
}


function habilitar_password(){
    $("#cambiar_password").click(function(e){
        if ($("#cambiar_password").prop("checked")) {
            $("#tablas_usuario_password").prop("disabled",false);
            $("#tablas_usuario_repetir_password").prop("disabled",false);
        }else{
            $("#tablas_usuario_password").prop("disabled",true);
            $("#tablas_usuario_repetir_password").prop("disabled",true);
        }
    });
};

function validar_password() {
    var intro = document.getElementById('tablas_usuario_repetir_password');
    $("#tablas_usuario_repetir_password").keyup(function (e) {
        if($("#tablas_usuario_password").val() == $(this).val()){
            intro.style.cssText = 'border: 1px solid #ced4da;';
        }else{
            intro.style.cssText = 'border: 1px solid red;';
        }
    });
};

function mostrar_cuentas_provisiones() {
    $("#tablas_asiento_patron_provision").click(function(e){
        if ($("#tablas_asiento_patron_provision").prop("checked")) {
            $(".cuenta_provision").prop("hidden", false);
        }else{
            $(".cuenta_provision").prop("hidden", true);
        }
    })
};