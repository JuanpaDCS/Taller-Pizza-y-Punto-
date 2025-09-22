const inquirer = require('inquirer');
const { ObjectId } = require('mongodb');
const { connectToDB } = require('../utils/db');
const pedidoService = require('../services/PedidoService');

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
      if (input.includes('back')) {
        return true;
      }
      return input.length > 0 || 'Debe seleccionar al menos una pizza.';
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
  } else {
    console.log(`❌ ${result.message}`);
  }
}

module.exports = { registrarPedido };