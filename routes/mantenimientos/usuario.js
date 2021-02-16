const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../database');

var configuracion_permisos = [
{modulo:'proceso_compra', nivel:'1',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 1},
{modulo:'proceso_compra__sist_requerimiento', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 2},
{modulo:'proceso_compra__sist_requerimiento__solicitud_compra', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 3},
{modulo:'proceso_compra__sist_requerimiento__aprobacion_01', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 4},
{modulo:'proceso_compra__sist_requerimiento__aprobacion_02', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 5},
{modulo:'proceso_compra__sist_requerimiento__eliminar_saldos', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 6},
{modulo:'proceso_compra__sist_requerimiento__reportes', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 7},
{modulo:'proceso_compra__sist_requerimiento__reportes__reporte_01', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 8},
{modulo:'proceso_compra__sist_requerimiento__reportes__reporte_02', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 9},
{modulo:'proceso_compra__sist_cuadro_comparativo', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 10},
{modulo:'proceso_compra__sist_cuadro_comparativo__pre_cotizacion', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 11},
{modulo:'proceso_compra__sist_cuadro_comparativo__cuadro_comparativo', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 12},
{modulo:'proceso_compra__sist_cuadro_comparativo__aprobacion_comparativos', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 13},
{modulo:'proceso_compra__sist_cuadro_comparativo__reportes', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 14},
{modulo:'proceso_compra__sist_cuadro_comparativo__reportes__reporte_01', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 15},
{modulo:'proceso_compra__sist_cuadro_comparativo__reportes__reporte_02', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 16},
{modulo:'proceso_compra__sist_logistica', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 17},
{modulo:'proceso_compra__sist_logistica__orden_compra', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 18},
{modulo:'proceso_compra__sist_logistica__aprobacion', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 19},
{modulo:'proceso_compra__sist_logistica__eliminar_saldos', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 20},
{modulo:'proceso_compra__sist_logistica__reportes', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 21},
{modulo:'proceso_compra__sist_logistica__reportes__reporte_01', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 22},
{modulo:'proceso_compra__sist_logistica__reportes__reporte_02', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 23},
{modulo:'proceso_compra__sist_importaciones', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 24},
{modulo:'proceso_compra__sist_importaciones__dua', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 25},
{modulo:'proceso_compra__sist_importaciones__nacionalizacion', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 26},
{modulo:'proceso_compra__sist_importaciones__reportes', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 27},
{modulo:'proceso_compra__sist_importaciones__reportes__reporte_01', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 28},
{modulo:'proceso_compra__sist_importaciones__reportes__reporte_02', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 29},
{modulo:'proceso_almacen', nivel:'1',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 30},
{modulo:'proceso_almacen__sist_almacen', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 31},
{modulo:'proceso_almacen__sist_almacen__sist_guia_entrada', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 32},
{modulo:'proceso_almacen__sist_almacen__transaccion_almacen', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 33},
{modulo:'proceso_almacen__sist_almacen__ingreso_kit', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 34},
{modulo:'proceso_almacen__sist_almacen__generacion_tickets', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 35},
{modulo:'proceso_almacen__sist_almacen__reportes', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 36},
{modulo:'proceso_almacen__sist_almacen__reportes__reporte_01', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 37},
{modulo:'proceso_almacen__sist_almacen__reportes__inventario_valorizado', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 38},
{modulo:'proceso_almacen__sist_almacen__reportes__inventario_valorizado_lote', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 39},
{modulo:'proceso_almacen__sist_almacen__reportes__inventario_valorizado_serie', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 40},
{modulo:'proceso_ventas', nivel:'1',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 41},
{modulo:'proceso_ventas__sist_cotizacion', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 42},
{modulo:'proceso_ventas__sist_cotizacion__solicitud_cotizacion', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 43},
{modulo:'proceso_ventas__sist_cotizacion__aprobacion', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 44},
{modulo:'proceso_ventas__sist_cotizacion__eliminar_saldos', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 45},
{modulo:'proceso_ventas__sist_cotizacion__reportes', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 46},
{modulo:'proceso_ventas__sist_cotizacion__reportes__reporte_01', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 47},
{modulo:'proceso_ventas__sist_cotizacion__reportes__reporte_02', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 48},
{modulo:'proceso_ventas__sist_pedidos', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 49},
{modulo:'proceso_ventas__sist_pedidos__solicitud_pedidos', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 50},
{modulo:'proceso_ventas__sist_pedidos__aprobacion', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 51},
{modulo:'proceso_ventas__sist_pedidos__elminar_saldos', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 52},
{modulo:'proceso_ventas__sist_pedidos__reportes', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 53},
{modulo:'proceso_ventas__sist_pedidos__reportes__reporte_01', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 54},
{modulo:'proceso_ventas__sist_pedidos__reportes__reporte_02', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 55},
{modulo:'proceso_ventas__sist_venta_facturacion', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 56},
{modulo:'proceso_ventas__sist_venta_facturacion__guia_remision', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 57},
{modulo:'proceso_ventas__sist_venta_facturacion__eliminar_saldos', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 58},
{modulo:'proceso_ventas__sist_venta_facturacion__ventas_facturacion', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 59},
{modulo:'proceso_ventas__sist_venta_facturacion__reportes', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 60},
{modulo:'proceso_ventas__sist_venta_facturacion__reportes__reportes_guias', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 61},
{modulo:'proceso_ventas__sist_venta_facturacion__reportes__reportes_facturas', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 62},
{modulo:'proceso_ventas__sist_facturacion_masiva', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 63},
{modulo:'proceso_ventas__sist_facturacion_masiva__validacion', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 64},
{modulo:'proceso_ventas__sist_facturacion_masiva__pre_factura', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 65},
{modulo:'proceso_ventas__sist_facturacion_masiva__reportes', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 66},
{modulo:'proceso_ventas__sist_facturacion_masiva__reportes__reporte_01', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 67},
{modulo:'proceso_ventas__sist_facturacion_masiva__reportes__reporte_02', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 68},
{modulo:'proceso_ventas__sist_despacho', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 69},
{modulo:'proceso_ventas__sist_despacho__consoldidado_documentos', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 70},
{modulo:'proceso_ventas__sist_despacho__reportes', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 71},
{modulo:'proceso_ventas__sist_despacho__reportes__reporte_01', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 72},
{modulo:'proceso_ventas__sist_despacho__reportes__reporte_02', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 73},
{modulo:'proceso_ventas__sist_fe', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 74},
{modulo:'proceso_ventas__sist_fe_facturacion_electronica', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 75},
{modulo:'proceso_pto_venta', nivel:'1',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 76},
{modulo:'proceso_pto_venta__sist_pto_venta', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 77},
{modulo:'proceso_pto_venta__sist_pto_venta__apertura_caja', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 78},
{modulo:'proceso_pto_venta__sist_pto_venta__toma_pedido', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 79},
{modulo:'proceso_pto_venta__sist_pto_venta__terminal_pos', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 80},
{modulo:'proceso_pto_venta__sist_pto_venta__cierre_caja', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 81},
{modulo:'proceso_pto_venta__sist_pto_venta__guia_remision', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 82},
{modulo:'proceso_pto_venta__sist_pto_venta__reportes', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 83},
{modulo:'proceso_pto_venta__sist_pto_venta__reportes__reporte_venta_diarias', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 84},
{modulo:'proceso_pto_venta__sist_pto_venta__reportes__reporte_arqueo_cajas', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 85},
{modulo:'proceso_pto_venta__configuraciones', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 86},
{modulo:'proceso_pto_venta__configuraciones__configurar_cobrador', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 87},
{modulo:'proceso_pto_venta__configuraciones__configurar_tarjetas', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 88},
{modulo:'proceso_pto_venta__configuraciones__configurar_tipo_pago', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 89},
{modulo:'proceso_provisiones', nivel:'1',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 90},
{modulo:'proceso_provisiones__sist_ctas_x_pagar', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 91},
{modulo:'proceso_provisiones__sist_ctas_x_pagar__registro_comprobantes', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 92},
{modulo:'proceso_provisiones__sist_ctas_x_pagar__registro_detraccion', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 93},
{modulo:'proceso_provisiones__sist_ctas_x_pagar__registro_percepcion', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 94},
{modulo:'proceso_provisiones__sist_ctas_x_pagar__eliminar_saldos', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 95},
{modulo:'proceso_provisiones__sist_ctas_x_pagar__reportes', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 96},
{modulo:'proceso_provisiones__sist_ctas_x_pagar__reportes__programacion_vcto_CXP', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 97},
{modulo:'proceso_provisiones__sist_ctas_x_pagar__reportes__reporte_02', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 98},
{modulo:'proceso_provisiones__sist_ctas_x_cobrar', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 99},
{modulo:'proceso_provisiones__sist_ctas_x_cobrar__registro_comprobantes', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 100},
{modulo:'proceso_provisiones__sist_ctas_x_cobrar__registro_detraccion', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 101},
{modulo:'proceso_provisiones__sist_ctas_x_cobrar__registro_percepcion', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 102},
{modulo:'proceso_provisiones__sist_ctas_x_cobrar__eliminar_saldos', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 103},
{modulo:'proceso_provisiones__sist_ctas_x_cobrar__reportes', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 104},
{modulo:'proceso_provisiones__sist_ctas_x_cobrar__reportes__programacion_vcto_CXC', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 105},
{modulo:'proceso_provisiones__sist_ctas_x_cobrar__reportes__reporte_02', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 106},
{modulo:'proceso_provisiones__sist_letras_CXC', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 107},
{modulo:'proceso_provisiones__sist_letras_CXC__canje_letras_cxc', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 108},
{modulo:'proceso_provisiones__sist_letras_CXC__situacion_letras', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 109},
{modulo:'proceso_provisiones__sist_letras_CXC__eliminar_saldos', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 110},
{modulo:'proceso_provisiones__sist_letras_CXC__reportes', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 111},
{modulo:'proceso_provisiones__sist_letras_CXC__reportes__reporte_01', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 112},
{modulo:'proceso_provisiones__sist_letras_CXC__reportes__reporte_02', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 113},
{modulo:'proceso_provisiones___sist_envios_masivos_TXT', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 114},
{modulo:'proceso_provisiones___sist_envios_masivos_TXT__envios_masivos_CXP', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 115},
{modulo:'proceso_provisiones__sist_activo_fijo', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 116},
{modulo:'proceso_provisiones__sist_activo_fijo__registro_activo_fijo', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 117},
{modulo:'proceso_provisiones__sist_activo_fijo__reevaluacion_activo_fijo', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 118},
{modulo:'proceso_provisiones__sist_activo_fijo__reportes', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 119},
{modulo:'proceso_provisiones__sist_activo_fijo__reportes__reporte_01', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 120},
{modulo:'proceso_provisiones__sist_activo_fijo__reportes__reporte_02', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 121},
{modulo:'proceso_financiero', nivel:'1',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 122},
{modulo:'proceso_financiero__sist_caja_bancos', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 123},
{modulo:'proceso_financiero__sist_caja_bancos__cancelacion_cobros', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 124},
{modulo:'proceso_financiero__sist_caja_bancos__cheque_vauchers', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 125},
{modulo:'proceso_financiero__sist_caja_bancos__reportes', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 126},
{modulo:'proceso_financiero__sist_caja_bancos__reportes__reporte_01', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 127},
{modulo:'proceso_financiero__sist_caja_bancos__reportes__reporte_02', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 128},
{modulo:'cencos_proyectos', nivel:'1',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 129},
{modulo:'cencos_proyectos__sist_proyectos', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 130},
{modulo:'cencos_proyectos__sist_proyectos__gastos_x_proyectos_cencos', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 131},
{modulo:'cencos_proyectos__sist_proyectos__consumo_proyectos_cencos', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 132},
{modulo:'cencos_proyectos__sist_proyectos__movimientos_proyectos_cencos', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 133},
{modulo:'cencos_proyectos__sist_proyectos__estado_financiero_proyectos', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 134},
{modulo:'cencos_proyectos__sist_presupuesto', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 135},
{modulo:'cencos_proyectos__sist_presupuesto__planificacion_cencos', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 136},
{modulo:'cencos_proyectos__sist_presupuesto__planificacion_item', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 137},
{modulo:'cencos_proyectos__sist_presupuesto__flujo_caja', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 138},
{modulo:'cencos_proyectos__sist_presupuesto__reportes', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 139},
{modulo:'cencos_proyectos__sist_presupuesto__reportes__reporte_01', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 140},
{modulo:'cencos_proyectos__sist_presupuesto__reportes__reporte_02', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 141},
{modulo:'proceso_contabilidad', nivel:'1',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 142},
{modulo:'proceso_contabilidad__sist_contabilidad', nivel:'2',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 143},
{modulo:'proceso_contabilidad__sist_contabilidad__movimientos_contables', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 144},
{modulo:'proceso_contabilidad__sist_contabilidad__reportes', nivel:'3',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 145},
{modulo:'proceso_contabilidad__sist_contabilidad__reportes__reporte_01', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 146},
{modulo:'proceso_contabilidad__sist_contabilidad__reportes__reporte_02', nivel:'4',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 147},
{modulo:'proceso_planillas', nivel:'1',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 148},
{modulo:'sig_gerencial', nivel:'1',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 149},
{modulo:'otros', nivel:'1',acceso: 'N', guardar:'N', modificar:'N', eliminar: 'N', orden: 150},
]

router.post('/responsables', async (req, res) => {
    try {
        const codigo_empresa = req.user.codigo_empresa;
        const codigo_usuario = req.user.codigo_usuario;
        const pool = await poolPromise
        const lista = await pool
        .request()
        .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
        .input('codigo_usuario', mssql.VarChar(250), codigo_usuario)
        .input('tipo', mssql.VarChar(250), req.body.tipo)
        .query(
          "Select \n"+
          "ltrim(rtrim(ccod_person)) as Codigo, \n"+
          "(nombres + ' ' +ape_pat +' ' + ape_mat) as Nombre, \n"+
          "direccion as Direccion, \n"+
          "fecha_ingreso as Fecha_Ingreso, \n"+
          "email as Correo, \n"+
          "sexo as Sexo, \n"+
          "erp_cargo as Cargo, \n"+
          "tip_docid as Tipo_Documento, \n"+
          "ndoc_id as Numero_Documento, \n"+
          "Erp_Coduser as Usuario, \n"+
          "aprobar_pedido as Aprobar_Pedidos, \n"+
          "Aprobar_Req as Aprobar_Requerimientos, \n"+
          "erp_aprobreq_2 as Aprobar_Requerimientos2, \n"+
          "genera_oc as Generar_Orden_Compra, \n"+
          "aprobacion_oc_1 as Aprobar_Orden_Compra, \n"+
          "Erp_Aprob_Cot as Aprobar_Cotizacion, \n"+
          "ff_cierre_Doc as Cierre_Caja \n"+
          "From Hperson \n"+
          "Where ccod_empresa = @codigo_empresa \n"+
          "And Erp_Coduser = @codigo_usuario \n"+
          "and (Case @tipo \n"+
          "when 'PED' then IsNull(aprobar_pedido,'N') \n"+
          "when 'REQ1' then IsNull(Aprobar_Req,'N') \n"+
          "when 'REQ2'  then Isnull(erp_aprobreq_2,'N') \n"+
          "when 'GOC' then IsNull(genera_oc,'N') \n"+
          "when 'OC' then IsNull(aprobacion_oc_1,'N') \n"+
          "when 'COT'  then Isnull(Erp_Aprob_Cot,'N') \n"+
          "when 'CIERRE' then IsNull(ff_cierre_Doc,'N') \n"+
          "else 'S' \n"+
          "End) = 'S' \n"
        );       
        
      const recordset = lista.recordset;
      res.json(recordset); 
    } catch (err) {
      res.send(err.message)
    }
});

router.post('/cargo', async (req, res) => {
  try {

      const codigo_empresa = req.user.codigo_empresa;
      const codigo_usuario = req.user.codigo_usuario;
      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .input('codigo_responsable', mssql.VarChar(250), req.body.codigo_responsable)
      .input('tipo', mssql.VarChar(250), req.body.tipo)
      .query(
        "Select \n"+
        "ltrim(rtrim(ccod_person)) as Codigo, \n"+
        "(nombres + ' ' +ape_pat +' ' + ape_mat) as Nombre, \n"+
        "direccion as Direccion, \n"+
        "fecha_ingreso as Fecha_Ingreso, \n"+
        "email as Correo, \n"+
        "sexo as Sexo, \n"+
        "erp_cargo as Cargo, \n"+
        "tip_docid as Tipo_Documento, \n"+
        "ndoc_id as Numero_Documento, \n"+
        "Erp_Coduser as Usuario, \n"+
        "aprobar_pedido as Aprobar_Pedidos, \n"+
        "Aprobar_Req as Aprobar_Requerimientos, \n"+
        "erp_aprobreq_2 as Aprobar_Requerimientos2, \n"+
        "genera_oc as Generar_Orden_Compra, \n"+
        "aprobacion_oc_1 as Aprobar_Orden_Compra, \n"+
        "Erp_Aprob_Cot as Aprobar_Cotizacion, \n"+
        "ff_cierre_Doc as Cierre_Caja \n"+
        "From Hperson \n"+
        "Where ccod_empresa = @codigo_empresa \n"+
        "And ccod_person = @codigo_responsable "
      );       
      
    const recordset = lista.recordset;
    res.json(recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

router.post('/lista', async (req, res) => {
  try {
      const codigo_empresa = req.user.codigo_empresa;
      const pool = await poolPromise
      const lista = await pool
      .request()
      .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
      .query(
       " SELECT erp_usuario.erp_coduser as Codigo,   \n"+
       " LTrim(RTrim(erp_usuario.erp_nomuser)) as Nombre,  \n"+
       " (case erp_usuario.erp_estado when 'A' then 'Activo' else 'Desactivo' end) as Estado,  \n"+
       " erp_usuario.erp_kardex_s_n as Ver_Mov_Kardex,  \n"+
       " erp_usuario.erp_mov_compras as Ver_Mov_Compras,  \n"+
       " erp_usuario.erp_Com_ventas_s_n as Ver_Com_Ventas  \n"+
       " FROM erp_usuario   \n"+
       " Where erp_codemp = @codigo_empresa and erp_mau <> 'M' And erp_estado = 'A'  \n"
      );
      const recordset = lista.recordset;
      res.json(recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

router.post('/guardar', async (req, res) => {
  try {
    var strexpresion=""
    var Password = req.body.Password
    const li_longitud = Password.length; 
    var i;
    for (i = 0; i < Password.length; i++) {
        const ls_letra = Password.substring(i, i+1);
        const li_ascii = ls_letra.codePointAt(0);
        const li_ascii_new = li_ascii + ((li_longitud + 1 - (i + 1)) * (li_longitud + 1 - (i + 1))) - ((li_longitud + 2 - (i + 1)) * (li_longitud + 2 - (i + 1)));
        strexpresion = strexpresion + String.fromCharCode(li_ascii_new);
    }

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{
          const request  = new mssql.Request(transaction);
          await request
          .input('erp_codemp',mssql.VarChar(250),req.user.codigo_empresa)
          .input('erp_coduser',mssql.VarChar(250),req.body.Codigo)
          .input('erp_nomuser',mssql.VarChar(250),req.body.Nombre)
          .input('erp_estado',mssql.VarChar(250),req.body.Estado)
          .input('erp_password',mssql.VarChar(250),strexpresion)
          .input('erp_password_2',mssql.VarChar(250),strexpresion)
          .input('Erp_MAU',mssql.VarChar(250),'A')
          .input('Erp_Cuenta_Corriente',mssql.VarChar(250),'00')
          .input('erp_kardex_s_n',mssql.VarChar(250),req.body.Kardex)
          .input('erp_com_ventas_s_n',mssql.VarChar(250),req.body.Ventas)
          .input('erp_mov_compras',mssql.VarChar(250),req.body.Compras)
          .query(
          " insert into erp_usuario( \n"+
          " erp_codemp, \n"+
          " erp_coduser, \n"+
          " erp_nomuser, \n"+
          " erp_estado, \n"+
          " erp_password, \n"+
          " erp_password_2, \n"+
          " Erp_MAU, \n"+
          " Erp_Cuenta_Corriente, \n"+
          " erp_kardex_s_n, \n"+
          " erp_com_ventas_s_n, \n"+
          " erp_mov_compras \n"+
          " )values( \n"+
          " @erp_codemp, \n"+
          " @erp_coduser, \n"+
          " @erp_nomuser, \n"+
          " @erp_estado, \n"+
          " @erp_password, \n"+
          " @erp_password_2, \n"+
          " @Erp_MAU, \n"+
          " @Erp_Cuenta_Corriente, \n"+
          " @erp_kardex_s_n, \n"+
          " @erp_com_ventas_s_n, \n"+
          " @erp_mov_compras) \n"
          );
            
          transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: true, codigo: "0", mensaje: ''});
        }catch(err){
          transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: false, codigo: "Err", mensaje: err.message});
        }
    });

  } catch (err) {
    console.log(err.message);
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

router.post('/modificar', async (req, res) => {
  try {
    var strexpresion=""
    var Password = req.body.Password
    const li_longitud = Password.length; 
    var i;
    for (i = 0; i < Password.length; i++) {
        const ls_letra = Password.substring(i, i+1);
        const li_ascii = ls_letra.codePointAt(0);
        const li_ascii_new = li_ascii + ((li_longitud + 1 - (i + 1)) * (li_longitud + 1 - (i + 1))) - ((li_longitud + 2 - (i + 1)) * (li_longitud + 2 - (i + 1)));
        strexpresion = strexpresion + String.fromCharCode(li_ascii_new);
    }

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    
    await transaction.begin(async err => {
        try{
          const request  = new mssql.Request(transaction);
          await request
          .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
          .input('Codigo',mssql.VarChar(250),req.body.Codigo)
          .input('erp_nomuser',mssql.VarChar(250),req.body.Nombre)
          .input('erp_estado',mssql.VarChar(250),req.body.Estado)
          .input('erp_password',mssql.VarChar(250),strexpresion)
          .input('erp_password_2',mssql.VarChar(250),strexpresion)
          .input('Erp_MAU',mssql.VarChar(250),'A')
          .input('Erp_Cuenta_Corriente',mssql.VarChar(250),'00')
          .input('erp_kardex_s_n',mssql.VarChar(250),req.body.Kardex)
          .input('erp_com_ventas_s_n',mssql.VarChar(250),req.body.Ventas)
          .input('erp_mov_compras',mssql.VarChar(250),req.body.Compras)
          .query(
          " UPDATE erp_usuario SET\n"+
          " erp_nomuser = @erp_nomuser, \n"+
          " erp_estado = @erp_estado, \n"+
          " erp_password = @erp_password, \n"+
          " erp_password_2 = @erp_password_2, \n"+
          " Erp_MAU = @Erp_MAU, \n"+
          " Erp_Cuenta_Corriente = @Erp_Cuenta_Corriente, \n"+
          " erp_kardex_s_n = @erp_kardex_s_n, \n"+
          " erp_com_ventas_s_n = @erp_com_ventas_s_n, \n"+
          " erp_mov_compras = @erp_mov_compras \n"+
          " WHERE erp_codemp = @Codigo_Empresa and erp_coduser = @Codigo"
          );
            
          transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: true, codigo: "0", mensaje: ''});
        }catch(err){
          transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: false, codigo: "Err", mensaje: err.message});
        }
    });    
  } catch (err) {
    console.log(err.message);
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

router.post('/eliminar', async (req, res) => {
  try {
      const pool = await poolPromise
      await pool
      .request()
      .input('Codigo_Empresa',mssql.VarChar(250),req.user.codigo_empresa)
      .input('Codigo',mssql.VarChar(250),req.body.Codigo)
      .query(
        "delete from erp_usuario \n"+
        "WHERE erp_codemp = @Codigo_Empresa and erp_coduser = @Codigo"
      );
      res.send({estado: true, codigo: "0", mensaje: ''});
  } catch (err) {
    console.log(err.message);
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

router.post('/permisos_nivel/:nivel', async (req, res) => {
  try {
    const { nivel } = req.params;
    var query;
    if (req.body.Modulo != undefined) {
         query = " select  \n"+
        " codigo_usuario as Codigo,  \n"+
        " modulo as Modulo_Padre, \n"+
        " REPLACE(modulo,@modulo+'__','') as Modulo, \n"+
        " acceso as Acceso, \n"+
        " guardar as Guardar, \n"+
        " modificar as Modificar, \n"+
        " eliminar as Eliminar \n"+
        " from configuracion_permisos where codigo_empresa = @codigo_empresa and codigo_usuario = @codigo_usuario and nivel = @nivel and modulo like @modulo+'%'  order by cast(orden as int) asc\n";
    }else{
       query = " select  \n"+
      " codigo_usuario as Codigo,  \n"+
      " modulo as Modulo_Padre, \n"+
      " modulo as Modulo, \n"+
      " acceso as Acceso, \n"+
      " guardar as Guardar, \n"+
      " modificar as Modificar, \n"+
      " eliminar as Eliminar \n"+
      " from configuracion_permisos where codigo_empresa = @codigo_empresa and codigo_usuario = @codigo_usuario and nivel = @nivel  order by cast(orden as int) asc\n";
    }

    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise
    const lista = await pool
    .request()
    .input('codigo_empresa', mssql.VarChar(10), codigo_empresa)
    .input('codigo_usuario', mssql.VarChar(10), req.body.Codigo)
    .input('nivel', mssql.VarChar(10), nivel)
    .input('modulo', mssql.VarChar(300), req.body.Modulo)
    .query(query);
    const recordset = lista.recordset;
    console.log(recordset);
    res.json(recordset); 
  } catch (err) {
    res.send(err.message)
  }
});

router.post('/guardar_permisos', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    var Data_Permisos = JSON.parse(req.body.Data_Permisos)

    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    await transaction.begin(async err => {
        try{

          for (let i= 0; i< Data_Permisos.length; i++){
            rowid = Data_Permisos[i];

            const request_detalle_permisos  = new mssql.Request(transaction);
            await request_detalle_permisos
            .input("codigo_empresa", mssql.VarChar(250), codigo_empresa)
            .input("codigo_usuario", mssql.VarChar(250), rowid.Codigo)
            .input("modulo", mssql.VarChar(300), rowid.Modulo_Padre)
            .input("acceso", mssql.VarChar(250), rowid.Acceso)
            .input("guardar", mssql.VarChar(250), rowid.Guardar)
            .input("modificar", mssql.VarChar(250), rowid.Modificar)
            .input("eliminar", mssql.VarChar(250), rowid.Eliminar)
            .query(
             " update configuracion_permisos set \n"+
             " acceso = @acceso, \n"+
             " guardar = @guardar, \n"+
             " modificar = @modificar, \n"+
             " eliminar = @eliminar \n"+
             " where codigo_empresa = @codigo_empresa and codigo_usuario = @codigo_usuario and \n"+
             " modulo = @modulo \n"
            )
        };      
            
          transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: true, codigo: "0", mensaje: ''});
        }catch(err){
          transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: false, codigo: "Err", mensaje: err.message});
        }
    });

  } catch (err) {
    console.log(err.message);
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

router.post('/restablecer_permisos', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    console.log(req.body);
    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    await transaction.begin(async err => {
        try{
          const request_eliminar_permisos  = new mssql.Request(transaction);
          await request_eliminar_permisos
          .input("codigo_empresa", mssql.VarChar(250), codigo_empresa)
          .input("codigo_usuario", mssql.VarChar(250), req.body.Codigo)
          .query(
          " delete from configuracion_permisos \n"+
          " where codigo_empresa = @codigo_empresa and \n"+
          " codigo_usuario = @codigo_usuario \n")

          var query_detalle= "insert into configuracion_permisos values ";
          for(var i=0;i<configuracion_permisos.length;i++){
            var rowid =  configuracion_permisos[i];
            query_detalle += "('"+codigo_empresa+"','"+req.body.Codigo+"','"+rowid.modulo+"','"+rowid.nivel+"','"+rowid.acceso+"','"+rowid.guardar+"','"+rowid.modificar+"','"+rowid.eliminar+"','"+rowid.orden+"'),";
          }

          query_detalle = query_detalle.slice(0,-1);
          const request_restablecer_permisos = new mssql.Request(transaction);
          await request_restablecer_permisos
          .query(query_detalle);   
            
          transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: true, codigo: "0", mensaje: ''});
        }catch(err){
          transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: false, codigo: "Err", mensaje: err.message});
        }
    });

  } catch (err) {
    console.log(err.message);
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

router.post('/todos_permisos', async (req, res) => {
  try {
    const codigo_empresa = req.user.codigo_empresa;
    const pool = await poolPromise;
    const transaction = await new mssql.Transaction(pool);
    await transaction.begin(async err => {
        try{
          const request_todos_permisos  = new mssql.Request(transaction);
          await request_todos_permisos
          .input("codigo_empresa", mssql.VarChar(250), codigo_empresa)
          .input("codigo_usuario", mssql.VarChar(250), req.body.Codigo)
          .query(
          " update configuracion_permisos set \n"+
          " acceso = 'S', \n"+
          " guardar = 'S', \n"+
          " modificar = 'S', \n"+
          " eliminar = 'S' \n"+
          " where codigo_empresa = @codigo_empresa and \n"+
          " codigo_usuario = @codigo_usuario \n")  
            
          transaction.commit(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: true, codigo: "0", mensaje: ''});
        }catch(err){
          transaction.rollback(tErr => {if(tErr) {console.log(tErr)} })
          res.send({estado: false, codigo: "Err", mensaje: err.message});
        }
    });

  } catch (err) {
    console.log(err.message);
    res.send({estado: false, codigo: "Err", mensaje: err.message});
  }
});

module.exports = router;