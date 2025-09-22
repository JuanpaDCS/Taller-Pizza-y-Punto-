// controllers/MenuController.js
const inquirer = require('inquirer');
const { closeDB } = require('../utils/db');
const { initializeDB } = require('../utils/helpers');
const { registrarPedido } = require('./PedidoController');
const reporteService = require('../services/ReporteService');
const { registrarCliente } = require('./ClienteController');
const { gestionClientes, eliminarCliente } = require('./GestionClientesController');

async function showMainMenu() {
  const choices = [
    { name: '1. Registrar un nuevo pedido', value: 'registrar_pedido' },
    { name: '2. Ver reportes de ventas', value: 'ver_reportes' },
    { name: '3. Registrar nuevo cliente', value: 'registrar_cliente' },
    { name: '4. Gestión de Clientes', value: 'gestion_clientes' },
    { name: '5. Eliminar un cliente', value: 'eliminar_cliente' },
    { name: '6. Salir', value: 'exit' }
  ];

  const answer = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'Bienvenido a Pizza y Punto. ¿Qué desea hacer?',
    choices
  });

  switch (answer.action) {
    case 'registrar_pedido':
      await registrarPedido();
      break;
    case 'ver_reportes':
      await showReportesMenu();
      break;
    case 'registrar_cliente':
      await registrarCliente();
      break;
    case 'gestion_clientes':
      await gestionClientes();
      break;
    case 'eliminar_cliente':
      await eliminarCliente();
      break;
    case 'exit':
      await closeDB();
      return;
  }

  console.log('\n--- Regresando al menú principal ---\n');
  await showMainMenu();
}

async function showReportesMenu() {
  const choices = [
    { name: '1. Ingredientes más usados en el último mes', value: 'ingredientes_usados' },
    { name: '2. Promedio de precios por categoría de pizza', value: 'promedio_precios' },
    { name: '3. Categoría de pizzas con más ventas históricas', value: 'ventas_historicas' },
    { name: '4. Volver al menú principal', value: 'back' }
  ];

  const answer = await inquirer.prompt({
    type: 'list',
    name: 'reporte',
    message: 'Seleccione el reporte que desea ver:',
    choices
  });

  console.log('\n--- Generando reporte... ---');

  let reporteData;
  switch (answer.reporte) {
    case 'ingredientes_usados':
      reporteData = await reporteService.ingredientesMasUsados();
      console.table(reporteData.map(item => ({ Ingrediente: item._id, 'Cantidad usada': item.totalConsumido })));
      break;
    case 'promedio_precios':
      reporteData = await reporteService.promedioPreciosPorCategoria();
      console.table(reporteData.map(item => ({ Categoria: item.categoria, 'Precio promedio': item.promedioPrecio })));
      break;
    case 'ventas_historicas':
      reporteData = await reporteService.categoriasMasVendidas();
      console.table(reporteData.map(item => ({ Categoria: item._id, 'Total de ventas': item.totalVentas })));
      break;
    case 'back':
      return;
  }
}

module.exports = { showMainMenu };