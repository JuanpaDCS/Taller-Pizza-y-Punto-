const inquirer = require('inquirer');
const { connectToDB } = require('../utils/db');

async function registrarCliente() {
  const db = await connectToDB();
  const clientesCol = db.collection('clientes');

  console.log('\n--- Registrar Nuevo Cliente ---');
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'nombre',
      message: 'Ingrese el nombre del cliente:',
      validate: (input) => input.trim().length > 0 || 'El nombre no puede estar vacío.'
    },
    {
      type: 'input',
      name: 'telefono',
      message: 'Ingrese el número de teléfono:',
      validate: (input) => input.trim().length > 0 || 'El teléfono no puede estar vacío.'
    },
    {
      type: 'input',
      name: 'direccion',
      message: 'Ingrese la dirección del cliente:',
      validate: (input) => input.trim().length > 0 || 'La dirección no puede estar vacía.'
    }
  ]);

  try {
    const result = await clientesCol.insertOne({
      nombre: answers.nombre.trim(),
      telefono: answers.telefono.trim(),
      direccion: answers.direccion.trim()
    });
    console.log(`✅ Cliente "${answers.nombre}" registrado con éxito. ID: ${result.insertedId}`);
  } catch (error) {
    console.log(`❌ Error al registrar cliente: ${error.message}`);
  }
}

module.exports = { registrarCliente };