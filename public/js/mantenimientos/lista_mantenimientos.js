
var modal_mantenimientos="modal_mantenimientos";
var lista_mantenimientos="lista_mantenimientos";
var modal_title_mantenimientos="modal_title_mantenimientos";
var modal_edit_title_mantenimientos = "modal_edit_title_mantenimientos";
var id_mantenimientos="";
var tabla_mantenimientos = "";
var jq_modal_mantenimientos;
var jq_lista_mantenimientos;
var jq_modal_title_mantenimientos;
var jq_modal_edit_title_mantenimientos;

var jq_jq_enviar_mantenimientos;
var jq_nuevo_mantenimientos;
var jq_modificar_mantenimientos;
var jq_eliminar_mantenimientos;
var jq_anular_mantenimientos;
var jq_consultar_mantenimientos;
var jq_duplicar_mantenimientos;
var jq_exportar_excel_mantenimientos;

var modal_tablas_id;

var cabecera_mantenimientos;
var tipo_forma_pago="12"; //Se configura en cabecera_ventas en rellenar_formas_pago()
var tipo_responsables="S"; //Se configura en aprobaciones.js en la función cargar_configuracion() y 'S' es para que aparezcan todos los responsables
var lista_mantenimientos_nivel_plan_contable = "5" //Se configura en el detalle contable y contabilidad
var lista_mantenimientos_tipo_anexo ="12" //Se configura en el detalle contable y contabilidad
var lista_mantenimientos_tipo_documento="12" //Se configura en el detalle contable y contabilidad
var mantenimientos_tabla_nombre;
var mantenimientos_tabla_titulo;
var mantenimientos_multiselect=false;
var mantenimientos_multiselect_data=[];
var fila_seleccionada;

$(document).ready(function() {
    jq_modal_mantenimientos=$("#"+modal_mantenimientos);
    jq_lista_mantenimientos=$("#"+lista_mantenimientos);
    jq_modal_title_mantenimientos=$("#"+modal_title_mantenimientos);
    jq_modal_edit_title_mantenimientos=$("#"+modal_edit_title_mantenimientos);

    jq_enviar_mantenimientos = $("#enviar_mantenimientos");
    jq_nuevo_mantenimientos=$("#nuevo_mantenimientos");
    jq_modificar_mantenimientos=$("#modificar_mantenimientos");
    jq_eliminar_mantenimientos=$("#eliminar_mantenimientos");
    jq_anular_mantenimientos=$("#anular_mantenimientos");
    jq_consultar_mantenimientos=$("#consultar_mantenimientos");
    jq_duplicar_mantenimientos=$("#duplicar_mantenimientos");
    jq_exportar_excel_mantenimientos=$("#exportar_excel_mantenimientos");

    jq_modal_mantenimientos.on('shown.bs.modal', function () {
        resize_jqgrid_porcentajes(jq_lista_mantenimientos,55,85);
    });
    $('#exportar_excel_mantenimientos').click(function (){
        createExcelFromGrid(lista_mantenimientos,jq_modal_title_mantenimientos.text(),cabecera_mantenimientos)
    });
    
    jq_enviar_mantenimientos.click(function () {
        enviar_datos_lista_mantenimientos()
    });
    jq_nuevo_mantenimientos.click(function (){
        jq_grid = jq_lista_mantenimientos;
        open_modal_tablas({codigo: ""},{tabla_nombre:mantenimientos_tabla_nombre,estado:"guardar", titulo:mantenimientos_tabla_titulo},jq_grid);
    });
    $("#lista_productos_nuevo").click(function (){
        jq_grid = jq_lista_mantenimientos;
        open_modal_tablas({codigo: ""},{tabla_nombre:"productos",estado:"guardar", titulo:"Productos"},jq_grid);
    });
    jq_modificar_mantenimientos.click(function (){
        jq_grid = jq_lista_mantenimientos;
        var rowid = jq_grid.jqGrid ('getGridParam', 'selrow');
        var row = jq_grid.jqGrid ('getRowData', rowid);

        open_modal_tablas({codigo: row.Codigo},{tabla_nombre:mantenimientos_tabla_nombre,estado:"modificar", titulo:mantenimientos_tabla_titulo},jq_grid);
    });
    $("#lista_productos_modificar").click(function (){
        jq_grid = $("#lista_productos");
        var rowid = jq_grid.jqGrid ('getGridParam', 'selrow');
        var row = jq_grid.jqGrid ('getRowData', rowid);

        open_modal_tablas({codigo: row.Codigo},{tabla_nombre:"productos",estado:"modificar", titulo:"Productos"},jq_grid);
    });
    jq_eliminar_mantenimientos.click(function (){
        jq_grid = jq_lista_mantenimientos;
        var rowid = jq_grid.jqGrid ('getGridParam', 'selrow');
        var row = jq_grid.jqGrid ('getRowData', rowid);
        open_modal_tablas({codigo: row.Codigo},{tabla_nombre:mantenimientos_tabla_nombre,estado:"eliminar", titulo:mantenimientos_tabla_titulo},jq_grid);
    });
});

$(document).on("dblclick", ".c_mantenimientos", function(e) {
    var id_focused=$("*:focus").attr("id");
    var tabla_focused=$("*:focus").attr("tabla");
    modal_open(isEmptyOrWhiteSpaces(tabla_focused)? id_focused : tabla_focused,id_focused);
});

$(document).on("keydown", ".c_mantenimientos", function(e) {
    var id_focused=$("*:focus").attr("id");
    var tabla_focused=$("*:focus").attr("tabla");
    var keycode = (e.keyCode ? e.keyCode : e.code);
    if(keycode == '115'){ //115 F4
        // e.preventDefault();
        modal_open(isEmptyOrWhiteSpaces(tabla_focused)? id_focused : tabla_focused,id_focused);
    }
});

$(window).bind('resize', function() {
    resize_jqgrid_porcentajes(jq_lista_mantenimientos,55,85);
});

function modal_open(tabla,id_focused){
    modal_tablas_id=tabla;
    tabla_mantenimientos=tabla;
    mantenimientos_tabla_nombre=tabla;
    mantenimientos_tabla_titulo=tabla;
    id_mantenimientos= id_focused;
    switch(tabla){
        case "codigo_cliente":
            var columnas=['Codigo','Nombre','Tipo_Cliente','Numero_Doc','Direccion','Telefono','Pais','Departamento','Distrito','Ciudad','Codigo_Pais','Usuario','Pc_user','Pc_Fecha','Pc_ip','Fecha_Modificacion'];
            var col_model = [
                {name: 'Codigo', template: textTemplate, width:150},
                {name: 'Nombre', template: textTemplate, width:350},
                {name: 'Tipo_Cliente', template: textTemplate, width:100},
                {name: 'Numero_Doc', template: textTemplate, width:150},
                {name: 'Direccion', template: textTemplate, width:350},
                {name: 'Telefono', template: textTemplate, width:100},
                {name: 'Pais', template: textTemplate, width:100},
                {name: 'Departamento', template: textTemplate, width:   100},
                {name: 'Distrito', template: textTemplate, width:100},
                {name: 'Ciudad', template: textTemplate, width:100},
                {name: 'Codigo_Pais', template: textTemplate, width:100},
                {name: 'Usuario', template: textTemplate, width:100},
                {name: 'Pc_user', template: textTemplate, width:100},
                {name: 'Pc_Fecha', template: dateTemplate, width:100},
                {name: 'Pc_ip', template: textTemplate, width:100},
                {name: 'Fecha_Modificacion', template: dateTemplate, width:100}
            ]
            modal_mantenimientos_show(id_focused,"Clientes",'/clientes/lista/',columnas, {}, col_model);
        break;
        case "almacen":
            var columnas=['Codigo','Nombre','Direccion','Responsable'];
            modal_mantenimientos_show(id_focused,"Almacén",'/almacen/lista_almacen/',columnas);
            mantenimientos_tabla_titulo="Almacén";
        break;
        case "forma_pago":
            var columnas=['Codigo','Nombre','nro_dias','Usuario','Pc_user','Pc_Fecha','Pc_ip','Fecha_Modificacion'];
            modal_mantenimientos_show(id_focused,"Forma Pago",'/forma_pago/clientes/',columnas,{codigo: tipo_forma_pago=="12" ? jq_codigo_cliente.val() || jq_codigo_anexo.val() : jq_codigo_proveedor.val() || jq_codigo_anexo.val(), tipo: tipo_forma_pago});
            mantenimientos_tabla_titulo="Forma Pago";
        break;
        case "forma_pago_lista":
            var columnas=['Codigo','Nombre','nro_dias','Usuario','Pc_user','Pc_Fecha','Pc_ip','Fecha_Modificacion'];
            modal_mantenimientos_show(id_focused,"Forma Pago",'/forma_pago/lista/',columnas);
            
        break;
        case "contacto_cliente":
            var columnas=['Codigo','Nombre','Documento','Telefono','Cargo','Email'];
            modal_mantenimientos_show(id_focused,"Contacto",'/clientes/contactos/',columnas,{codigo: jq_codigo_cliente.val()});
            break;
        case "transportista":
            var columnas=['Codigo','Nombre','Razon_Social','Direccion','Licencia','Telefono'];
            modal_mantenimientos_show(id_focused,"Transportistas",'/transportista/lista/',columnas);
            break;
        case "vehiculo":
            var columnas=['Codigo','Nombre','Modelo','N_inscripcion'];
            modal_mantenimientos_show(id_focused,"Vehiculos",'/vehiculo/lista/',columnas);
            break;
        case "motivo_traslado":
        case "motivo_documento":
            var columnas=['Codigo','Nombre','Afecta_Nombre','Usuario','Pc_user','Pc_Fecha','Pc_ip','Fecha_Modificacion'];
            modal_mantenimientos_show(id_focused,"Motivo Traslado",'/motivo_traslado/lista/',columnas);
            break;
        case "lista_precios":
            var columnas=['Codigo','Nombre'];
            modal_mantenimientos_show(id_focused,"Lista de Precios",'/lista_precios/clientes/',columnas,{codigo: jq_codigo_cliente.val()});
            break;
        case "vendedor":
        case "vendedor1":
        case "vendedor2":
        case "vendedor3":
            var columnas=['Codigo','Nombre','Email','Celular','Telefono1','Telefono2','Telefono3','Telefono4'];
            modal_mantenimientos_show(id_focused,"Vendedores",'/vendedor/lista/',columnas);
            mantenimientos_tabla_nombre="vendedor";
            mantenimientos_tabla_titulo="Vendedor";
            break;
        case "unidad_negocio":
            var columnas=['Codigo','Nombre','Direccion','Usuario','Pc_user','Pc_Fecha','Pc_ip','Fecha_Modificacion'];
            modal_mantenimientos_show(id_focused,"Unidad Negocio",'/unidad_negocios/lista/',columnas);
            mantenimientos_tabla_nombre="unidad_negocios";
            mantenimientos_tabla_titulo="Unidad Negocio";
        break;
        case "centro_costos":
            var columnas=['Codigo','Nombre','Responsable','Abreviatura','Nivel','Digitos','Usuario','Pc_user','Pc_Fecha','Pc_ip','Fecha_Modificacion'];
            modal_mantenimientos_show(id_focused,"Centro de Costos",'/cencos/lista/',columnas);
            mantenimientos_tabla_nombre="cencos";
            mantenimientos_tabla_titulo="Centro de Costos";
            break;
        case "orden_trabajo":
            var columnas=['Codigo','Nombre','Orden_Servicio','Abreviatura','Fecha_Inicio','Fecha_Final','Presupuesto','Observacion','Observacion2','Observacion3','Usuario','Pc_user','Pc_Fecha','Pc_ip','Fecha_Modificacion','Fecha_Hora_Modificacion'];
            modal_mantenimientos_show(id_focused,"Orden de Trabajo",'/orden_trabajo/lista/',columnas);
            mantenimientos_tabla_titulo="Orden de Trabajo";
            break;
        case "presupuesto":
            var columnas=['Codigo','Nombre','Responsable','Abreviatura','Usuario','Pc_user','Pc_Fecha','Pc_ip','Fecha_Modificacion'];
            modal_mantenimientos_show(id_focused,"Presupeust",'/presupuesto/lista/',columnas);
            break;
        case "gestor":
            var columnas=['Codigo','Nombre','Email','Celular','Telefono1','Telefono2','Cargo'];
            modal_mantenimientos_show(id_focused,"Gestor",'/gestor_cobranza/lista/',columnas);
            break;
        case "motivo_referencia_presupuesto":
            var columnas=['Codigo','Nombre','Tipo_Documento','Formato','Predeterminado','Usuario','Pc_user','Pc_Fecha','Pc_ip'];
            modal_mantenimientos_show(id_focused,"Motivos de Referencias de Presupuestos",'/talonarios/motivos_tramite',columnas,{tipo_documento: "PRE"});
            break;
        case "agencia_cliente":
            var columnas=['Codigo','Nombre','Tipo','Direccion','Contacto','Telefono','Ubigeo'];
            modal_mantenimientos_show(id_focused,"Agencias",'/clientes/agencias',columnas,{codigo: jq_codigo_cliente.val()});
            mantenimientos_tabla_nombre="agencia_transporte";
            mantenimientos_tabla_titulo="Agencias";
            break;
        case "agencia_proveedor":
            var columnas=['Codigo','Nombre','Tipo','Direccion','Contacto','Telefono','Ubigeo'];
            modal_mantenimientos_show(id_focused,"Agencias",'/proveedores/agencias',columnas,{codigo: jq_codigo_proveedor.val()});
            mantenimientos_tabla_nombre="agencia_transporte";
            mantenimientos_tabla_titulo="Agencias";
            break;
        case "punto_llegada_cliente":
            var columnas=['NItem','Direccion','Ubigeo','Tipo_Via','Nombre_Via','Numero','Interior','Zona','Distrito','Provincia','Departamento','Observacion','Codigo'];
            modal_mantenimientos_show(id_focused,"Direcciones Alternativas",'/clientes/direcciones_alternativas',columnas,{codigo: jq_codigo_cliente.val()});
            break;
        case "responsable_aprobacion":
        case "responsable_aprobacion_2":
            var columnas=['Codigo','Nombre','Direccion','Fecha_Ingreso','Correo','Sexo','Cargo','Tipo_Documento','Numero_Documento','Usuario','Aprobar_Pedidos','Aprobar_Requerimientos','Aprobar_Requerimientos2','Generar_Orden_Compra','Aprobar_Orden_Compra','Aprobar_Cotizacion','Cierre_Caja'];
            modal_mantenimientos_show(id_focused,"Responsable","/usuario/responsables",columnas,{tipo: tipo_responsables});
            break;
        case "tipo_documento":
        case "tipo_comprobante":
        case "tipo_documento_referencia":
        case "tipo_referencia_2":
        case "tipo_referencia":
            var columnas=['Codigo','Nombre','Codigo_Sunat','Compras','Ventas','Contabilidad','Almacen','C_Signo','Porc_Igv','Fecha_Tc','Fecha_Modificacion','Nombre_Equipo','Ip_Cliente'];
            modal_mantenimientos_show(id_focused,"Tipo de Documento","/tipo_documento/lista/todos",columnas);
            mantenimientos_tabla_nombre="tipo_documento";
            mantenimientos_tabla_titulo="Tipo de Documento";
            break;
        case "chofer":
            var columnas=['Codigo','Nombre','Documento','Licencia'];
            modal_mantenimientos_show(id_focused,"Chofer","/chofer/lista",columnas);
            break;
        case "agencia_transporte":
            var columnas=['Codigo','Nombre','Correo','Telefono','Telefono2','Telefono3','Web','Direccion','Ruc','Observacion','Contacto'];
            modal_mantenimientos_show(id_focused,"Agencia de Transporte","/agencia_transporte/lista",columnas);
            mantenimientos_tabla_titulo="Agencia de Transporte";
            break;
        case "detraccion":
            var columnas=['Codigo','Nombre','Porcentaje','Monto_minimo','grupo'];
            modal_mantenimientos_show(id_focused,"Detracciones","/detracciones/lista",columnas);
        break;
        case "detraccion_provisiones":
            var columnas=['Codigo','Nombre','Porcentaje','Monto_Minimo','grupo'];
            modal_mantenimientos_show(id_focused,"Detracciones","/detracciones/datos",columnas,{codigo:  jq_codigo_anexo.val() });
        break;
        case "motivo_venta":
            var columnas=['Codigo','Nombre','Afecta_Nombre','Usuario','Pc_user','Pc_Fecha','Pc_ip','Fecha_Modificacion'];
            modal_mantenimientos_show(id_focused,"Motivo Traslado",'/motivo_traslado/lista/',columnas);
            break;
        case "codigo_proveedor":
            var columnas=['Codigo','Nombre','Tipo_Proveedor','Numero_Doc','Direccion','Telefono','Pais','Departamento','Distrito','Ciudad','Codigo_Pais','Usuario','Pc_user','Pc_Fecha','Pc_ip','Fecha_Modificacion'];
            modal_mantenimientos_show(id_focused,"Proveedores",'/proveedores/lista/',columnas);
            mantenimientos_tabla_nombre="proveedores";
            mantenimientos_tabla_titulo="Proveedores";
            break;
        case "contacto_proveedor":
            var columnas=['Codigo','Nombre','Documento','Telefono','Cargo','Email'];
            modal_mantenimientos_show(id_focused,"Contacto",'/proveedores/contactos/',columnas,{codigo: jq_codigo_proveedor.val()});
        break;
        case "tipo":
            var columnas=['Codigo','Nombre','Tipo','Proveedor','Cliente','Guia_Remision','Impresion_Gia','Anexo_SN','Tipo_Anexo','Tipo_Documento_Pendientes'];
            modal_mantenimientos_show(id_focused,"Motivo Traslado",'/definicion_transacciones/tipo_transaccion/',columnas,{tipo_movimiento: jq_tipo_movimiento.val() });
            break;
        case "zona":
            var columnas=['Codigo','Nombre','Equipo_Fecha','Equipo_Nombre','Equipo_Hora','Equipo_IP','Usuario_Codigo'];
            modal_mantenimientos_show(id_focused,"Zona",'/zona/lista/',columnas);
        break;
        case "detalle_contable":
        case "plan_contable":
            var columnas=['Cuenta_Padre','Codigo','Nombre','Nivel','Tipo_Auxiliar','Si_CenCos','Clase_Cuenta','Ajuste_Tc','Si_Ot','D_H','Si_Presupuesto','Daot','Si_Transferencia','Nombre_Presupuesto','Si_Genera_Diferencia','Ajuste_Tipo_Tc','Elemento','Moneda_Cierre','Bien_Servicio_Clasificacion','Fecha_Creacion'];
            modal_mantenimientos_show(id_focused,"Plan Contable",'/plan_contable/lista/',columnas,{nivel : lista_mantenimientos_nivel_plan_contable});
        break;
        case "subvoucher":
            var columnas=['Codigo','Nombre','Abreviatura','Tipo_Cambio','Si_Transferencia','Si_Compras','Si_Ventas','Si_Contable','Si_Cancelacion','Si_Diferencia','Si_CalculaMonedas','Caracteres']
            ;
            modal_mantenimientos_show(id_focused,"SubVoucher",'/subvoucher/lista/',columnas);
        break;
        case "codigo_anexo":
            var columnas=['Tipo_Auxiliar','Codigo','Ruc','Nombre','Direccion','Distrito','Ciudad','Telefono','Fax','Correo_Electronico','Contacto','Observacion','Grupo_Anexo','Tipo_Documento','Numero_Documento','Pais','Si_Retencion','Porcentaje_Retencion','Si_Percepcion','Porcentaje_Percepcion','Buen_Contribuyente','Departamento','Rubro','Zona1','Zona2','gGestor','Domiciliado','Pais_No_Domiciliado','Beneficiario_Codigo','Vinculacion_Economica']
            ;
            modal_mantenimientos_show(id_focused,"Anexos",'/anexos/lista/',columnas, {tipo: lista_mantenimientos_tipo_anexo});
        break;
        case "retencion_no_domiciliado":
            var columnas=['Codigo','Nombre','Tipo_Anexo','Descripcion_Tasa','Tasa','Predeterminado'];
            modal_mantenimientos_show(id_focused,"Retención",'/retencion_no_domiciliado/datos/',columnas,{codigo:  jq_codigo_anexo.val() });
        break;
        case "tipo_anexo":
            var columnas=['Codigo','Nombre'];
            modal_mantenimientos_show(id_focused,"Tipo de Anexos",'/tipo_auxiliar/lista/',columnas);
        break;
        case "clasificacion":
            var columnas=['Codigo','Nombre'];
            modal_mantenimientos_show(id_focused,"Clasificación de Bienes y Servicios",'/clasificacion_bien_servicios/lista/',columnas);
        break;
        case "motivos_tramite":
            var columnas=[
                'Codigo',
                'Nombre',
                'Tipo_Documento',
                'Formato',
                'Predeterminado',
                'Pc_ip',
                'Usuario',
                'Pc_Fecha',
                'Pc_user'
            ];
            modal_mantenimientos_show(id_focused,"Motivos",'/talonarios/motivos_tramite/',columnas,{tipo_documento:lista_mantenimientos_tipo_documento});
        break;
        case "serie_documento":
            var columnas=[
                "Punto_Venta",
                "Tipo_Documento",
                "Codigo",
                "Nombre",
                "Activo",
                "Predeterminado",
                "Ruta_Formato",
                "Fecha_Modificacion",
                "Nombre_Equipo",
                "Hora_PC",
                "IP_Cliente",
                "Usuario"
            ];
            modal_mantenimientos_show(id_focused,"Motivos",'/talonarios/motivos_series/',columnas,{tipo_documento:lista_mantenimientos_tipo_documento});
        break;
        case "articulos":
            var columnas=[
                'Codigo',
                'Codigo_Fabricante',
                'Nombre',
                'Tipo_Producto',
                'Familia',
                'SubFamilia',
                'Concepto1',
                'Concepto2',
                'Concepto3',
                'Concepto4',
                'Unidad'
            ];
            modal_mantenimientos_show(id_focused,"Articulos",'/productos/lista/',columnas);
        break;        
        case "cuentas_corrientes":
            var columnas=[
                'Codigo',
                'Nombre',
                'Banco',
                'Moneda',
                'Cuenta',
                'FechaModificacion',
                'NombreEquipo',
                'Hora',
                'IP_Cliente',
                'ErpUsuario'
            ];
            modal_mantenimientos_show(id_focused,"Cuentas Corrientes",'/cuentas_corrientes/lista/todos',columnas);
        break;
        case "Cta_Cteb":
            var columnas=[
                'Codigo',
                'Nombre',
                'Banco',
                'Moneda',
                'Cuenta',
                'FechaModificacion',
                'NombreEquipo',
                'Hora',
                'IP_Cliente',
                'ErpUsuario'
            ];
            modal_mantenimientos_show(id_focused,"Cuentas Corrientes",'/cuentas_corrientes/lista',columnas);
        break;
        case "cobrador":
            var columnas=[
                'Codigo',
                'Nombre',
                'Email',
                'Telefono',
                'Telefono2',
                'Codigo_Caja',
                'Nombre_Caja',
            ];
            modal_mantenimientos_show(id_focused,"Cobrador",'/cobrador/lista/todos',columnas);
        break;
        case "usuario":
            var columnas = ['Codigo','Nombre','Estado','Ver_Mov_Kardex','Ver_Mov_Compras','Ver_Com_Ventas'];
            modal_mantenimientos_show(id_focused,"Usuarios","/usuario/lista",columnas);
        break;
        case "cuentas":
            var columnas = ["Cuenta_Padre","Codigo","Nombre","Nivel","Tipo_Auxiliar","Si_CenCos","Clase_Cuenta","Ajuste_Tc","Si_Ot","D_H","Si_Presupuesto","Daot","Si_Transferencia","Nombre_Presupuesto","Si_Genera_Diferencia","Ajuste_Tipo_Tc","Elemento","Moneda_Cierre","Bien_Servicio_Clasificacion" ];
            modal_mantenimientos_show(id_focused,"Cuentas Contables",'/plan_contable/lista',columnas);
        break;
        case "anexos":
            var columnas = ["Tipo_Auxiliar","Codigo","Ruc","Nombre","Direccion","Distrito","Ciudad","Telefono","Fax","Correo_Electronico","Contacto","Observacion","Grupo_Anexo","Tipo_Documento","Numero_Documento","Pais","Si_Retencion","Porcentaje_Retencion","Si_Percepcion","Porcentaje_Percepcion","Buen_Contribuyente","Departamento","Rubro","Zona1","Zona2","gGestor","Domiciliado","Pais_No_Domiciliado","Beneficiario_Codigo"];
            modal_mantenimientos_show(id_focused,"Cuentas Contables",'/anexos/lista',columnas,{tipo: lista_mantenimientos_tipo_anexo});
        break;
        case "categoria":
            var columnas = ["Codigo","Nombre","Abreviatura"];
            modal_mantenimientos_show(id_focused,"Categoria",'/categoria/lista',columnas);
        break;
    }
}

function modal_mantenimientos_show(id,titulo,url,columnas, data, col_model){
    jq_modal_title_mantenimientos.text("Listado de "+titulo);
    jq_modal_edit_title_mantenimientos.text("Mantenimiento de "+titulo);
    var jq_modal = jq_modal_mantenimientos;
    var jq_grid = jq_lista_mantenimientos;
    jq_modal.modal('show');
    jq_grid.jqGrid('GridUnload');
    
    var model =[]
    for(var i=0;i<columnas.length ; i++){
        model.push({name: columnas[i], searchoptions:{sopt:['cn','nc','eq','bw','bn','ew','en']}});
    }
    if(col_model){
        model = col_model;
    }
    cabecera_mantenimientos = columnas;
    jq_grid.jqGrid({
        url: url,
        mtype: "POST",
        datatype: "json",
        postData: data,
        colNames: columnas,
        colModel: model,
        rowNum:50,
        loadonce: true,
        viewrecords: true,
        rownumbers: true,
        multiselect: mantenimientos_multiselect,
        shrinkToFit: columnas.length<7,
        height: 300,
        width: 300,
        rowList:[50,500,5000,50000],
        pager: '#lista_mantenimientos_pager',
        ondblClickRow: function(rowid, iRow, iCol, e){
            enviar_datos_lista_mantenimientos(rowid); 
        },
        onSelectRow: function (rowid, status, e){
            fila_seleccionada = rowid;
        },
        loadComplete:function(data){
            var gridArr = jq_grid.getDataIDs();
            jq_grid.resetSelection().setSelection(gridArr[0],true);
                
            $('#'+gridArr[0]).focus();
            $('#gs_'+lista_mantenimientos+'_'+model[1].name).focus();

        },
        loadError: function (xhr,status,error){
            alert(xhr.responseText);
            // if(xhr.responseText=="El usuario ha sido expulsado"){
            // }
        }
    });

    jq_grid.jqGrid('filterToolbar',{stringResult: true,searchOnEnter : false, searchOperators : true});

    jq_grid.jqGrid('bindKeys', {
        "onEnter":function( rowid ) {
            enviar_datos_lista_mantenimientos(rowid); 
        } 
    });
    
    jq_modal.keydown(function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.code);
        if(keycode == '38' || keycode == '40')  //up/down arrow override
        {
            var gridArr = jq_grid.getDataIDs();
            var focusID = $("*:focus").attr("id") ; 
            if ( $.inArray( focusID, gridArr )<0 ){
                event.preventDefault();
                $( "#"+gridArr[0] ).focus();
            }
        }
        if(keycode == '45'){ // 45 esc 
            jq_modal.modal('hide');
        }
    });
}

function enviar_datos_lista_mantenimientos (rowid){

    var jq_grid = jq_lista_mantenimientos;
    mantenimientos_multiselect_data = [];
    if(mantenimientos_multiselect){
        var selarrrows=jq_grid.getGridParam('selarrrow');
        var value="";
        for(var i=0;i<selarrrows.length;i++){
            var rowData=jq_grid.jqGrid("getRowData", selarrrows[i]);
            mantenimientos_multiselect_data.push(rowData.Codigo);
            value+="'"+rowData.Codigo +"',"
        }
        value = value.slice(0,-1);
        $("#"+id_mantenimientos).attr("datos",JSON.stringify(mantenimientos_multiselect_data));
        $("#"+id_mantenimientos).val(value);
        mantenimientos_multiselect_function(id_mantenimientos);
    }else{
        var rowData=jq_grid.jqGrid("getRowData", rowid);
        console.log(id_mantenimientos);
        console.log(rowData);
        switch(id_mantenimientos){
            case "codigo_cliente":
                var codigo = jq_grid.jqGrid("getCell", rowid, "Codigo");
                rellenar_clientes(codigo);
            break;
            case "forma_pago":
                $("#"+id_mantenimientos).val(rowData.Codigo);
                calcular_formas_pago_proveedor();
            break;
            case "vendedor1":
            case "vendedor3":
                $("#vendedor1").val(rowData.Codigo);
                $("#vendedor3").val(rowData.Codigo);
            break;
            case "codigo_proveedor":
                var codigo = jq_grid.jqGrid("getCell", rowid, "Codigo");
                rellenar_proveedores(codigo);
            break;
            case "codigo_anexo":
                var codigo = jq_grid.jqGrid("getCell", rowid, "Codigo");
                var tipo = jq_grid.jqGrid("getCell", rowid, "Tipo_Auxiliar");
                rellenar_anexos(codigo, tipo);
            break;
            case "detraccion":
                var codigo = jq_grid.jqGrid("getCell", rowid, "Codigo");
                var porcentaje = jq_grid.jqGrid("getCell", rowid, "Porcentaje");
                jq_detraccion.val(codigo);
            break;
            case "detraccion_provisiones":
                var codigo = jq_grid.jqGrid("getCell", rowid, "Codigo");
                var porcentaje = jq_grid.jqGrid("getCell", rowid, "Porcentaje");
                var porc =  Number(porcentaje)
                if (jq_detraccion_check.is(':checked')) {
                    jq_detraccion_provisiones.val(codigo);
                    jq_porcentaje_detraccion.val(porc.toFixed(2));
                }
            break;
            case "retencion_no_domiciliado":
                var codigo = jq_grid.jqGrid("getCell", rowid, "Codigo");
                var tasa = jq_grid.jqGrid("getCell", rowid, "Tasa");
                var porc =  Number(tasa)
                if (jq_retencion_check.is(':checked')) {
                    jq_retencion_no_domiciliado.val(codigo);
                    jq_porcentaje_retencion.val(porc.toFixed(2));
                }
            break;
            case "tipo_documento":
                var codigo = jq_grid.jqGrid("getCell", rowid, "Codigo");
                var porcentaje = jq_grid.jqGrid("getCell", rowid, "Porc_Igv");
                jq_tipo_documento.val(codigo);
                var porc =  Number(porcentaje)
                jq_porcentaje_impuesto.val(porc.toFixed(2));
            break;
            default:
                var data = jq_grid.jqGrid("getRowData", fila_seleccionada);
                $("#"+id_mantenimientos).val(data.Codigo);
            break;
        }

        switch(tabla_mantenimientos){
            case "plan_contable":
                rellenar_plan_contable_detalle(rowData);
            break;
            case "detalle_contable":
                rellenar_plan_contable_fila(rowData);
            break;
            case "codigo_anexo":
                rellenar_codigo_anexo_detalle(rowData);
            break;
            case "codigo_proveedor":
                rellenar_codigo_anexo_mantenimiento(rowData);
            break;
            case "articulos":
                rellenar_articulos_seleccionados(rowData);
            break;
            case "usuario":
                rellenar_usuario_seleccionado(rowData);
            break;
            case "Cta_Cteb":
                rellenar_cuenta_corriente_seleccionado(rowData);
            break;
        }
    }
    jq_modal_mantenimientos.modal('hide');
}
