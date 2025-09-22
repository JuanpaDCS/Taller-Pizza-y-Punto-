// controllers/PedidoController.js
const inquirer = require('inquirer');
const { ObjectId } = require('mongodb');
const { connectToDB } = require('../utils/db');
const pedidoService = require('../services/PedidoService');
const { elegirRepartidorAleatorio } = require('../models/Repartidor')

async function registrarPedido() {
  const db = await connectToDB();
  const clientesCol = db.collection('clientes');
  const pizzasCol = db.collection('pizzas');

  const clientes = await clientesCol.find({}).toArray();
  const clienteChoices = clientes.map(c => ({
    name: `${c.nombre} (${c.direccion})`,
    value: c._id
  }));

  const clienteAnswer = await inquirer.prompt({
    type: 'list',
    name: 'clienteId',
    message: 'Seleccione un cliente:',
    choices: [
      { name: 'Volver al Menú Principal', value: 'back' },
      new inquirer.Separator(),
      ...clienteChoices
    ]
  });

  if (clienteAnswer.clienteId === 'back') {
    return;
  }

  const pizzas = await pizzasCol.find({}).toArray();
  const pizzaChoices = pizzas.map(p => ({
    name: `${p.nombre} ($${p.precio})`,
    value: p._id
  }));

  const pizzaAnswers = await inquirer.prompt({
    type: 'checkbox',
    name: 'pizzaIds',
    message: 'Seleccione las pizzas para el pedido:',
    choices: [
      { name: 'Volver al Menú Principal', value: 'back' },
      new inquirer.Separator(),
      ...pizzaChoices
    ],
    validate: (input) => {
      if (input.length === 0 && !input.includes('back')) {
        return 'Debe seleccionar al menos una pizza.';
      }
      return true;
    }
  });

  if (pizzaAnswers.pizzaIds.includes('back')) {
    return;
  }
  
  console.log('\nProcesando pedido...');
  const result = await pedidoService.realizarPedido(
    new ObjectId(clienteAnswer.clienteId),
    pizzaAnswers.pizzaIds
  );

  if (result.success) {
    console.log(`✅ ${result.message}`);
    console.log(`🛵 Repartidor asignado: ${result.repartidorNombre}`);
    console.log(`📦 Tiempo de demora estimado: ${result.demora} minutos.`);
    console.log(`⏰ Su pedido debería estar completado alrededor de las ${result.completado}.`);
  } else {
    console.log(`❌ ${result.message}`);
  }
}

module.exports = { registrarPedido };