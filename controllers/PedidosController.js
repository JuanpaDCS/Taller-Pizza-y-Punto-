// controllers/PedidosController.js
const inquirer = require('inquirer');
const { connectToDB } = require('../utils/db');

async function mostrarPedidosCompletados() {
  const db = await connectToDB();
  const pedidosCompletadosCol = db.collection('pedidos_completados');

  const pedidosCompletados = await pedidosCompletadosCol.find({}).toArray();

  if (pedidosCompletados.length === 0) {
    console.log('\n❌ No hay pedidos completados en este momento.');
  } else {
    console.log('\n--- Pedidos Completados ---');
    pedidosCompletados.forEach(pedido => {
      const fecha = pedido.fecha.toLocaleString('es-ES');
      console.log(`\nID del Pedido: ${pedido._id}`);
      console.log(`Cliente ID: ${pedido.clienteId}`);
      console.log(`Repartidor Asignado: ${pedido.repartidorId}`);
      console.log(`Fecha: ${fecha}`);
      console.log('Pizzas:');
      pedido.pizzas.forEach(pizza => {
        console.log(`  - ${pizza.nombre}`);
      });
    });
  }

  await inquirer.prompt({
    type: 'list',
    name: 'volver',
    message: '\nPresione enter para continuar...',
    choices: [{ name: 'Volver al Menú Principal', value: 'back' }]
  });
}

module.exports = { mostrarPedidosCompletados };