// controllers/GestionClientesController.js
const inquirer = require('inquirer');
const { connectToDB } = require('../utils/db');
const { ObjectId } = require('mongodb');

async function verDetallesCliente(clienteId) {
    const db = await connectToDB();
    const clientesCol = db.collection('clientes');

    const cliente = await clientesCol.findOne({ _id: new ObjectId(clienteId) });

    console.log('\n--- Datos del Cliente ---');
    console.log(`Nombre: ${cliente.nombre}`);
    console.log(`Teléfono: ${cliente.telefono}`);
    console.log(`Dirección: ${cliente.direccion}`);
    console.log('-------------------------');

    await inquirer.prompt({
        type: 'list',
        name: 'volver',
        message: '¿Qué desea hacer ahora?',
        choices: [
            { name: 'Volver atrás', value: 'back' }
        ]
    });
}

async function gestionClientes() {
    const db = await connectToDB();
    const clientesCol = db.collection('clientes');

    const clientes = await clientesCol.find({}).toArray();

    const clienteChoices = clientes.map(c => ({
        name: `${c.nombre} (${c.direccion})`,
        value: c._id
    }));

    const answer = await inquirer.prompt({
        type: 'list',
        name: 'clienteId',
        message: '--- Gestión de Clientes ---\nSeleccione un cliente para ver sus datos:',
        choices: [
            ...clienteChoices,
            new inquirer.Separator(),
            { name: 'Volver al Menú Principal', value: 'back' }
        ]
    });

    if (answer.clienteId === 'back') {
        return;
    }

    await verDetallesCliente(answer.clienteId);
    
    // Llamada recursiva para que el usuario pueda seguir viendo clientes
    await gestionClientes();
}

async function eliminarCliente() {
    const db = await connectToDB();
    const clientesCol = db.collection('clientes');

    const clientes = await clientesCol.find({}).toArray();

    if (clientes.length === 0) {
        console.log('\n❌ No hay clientes registrados para eliminar.');
        await inquirer.prompt({
            type: 'list',
            name: 'volver',
            message: '¿Qué desea hacer ahora?',
            choices: [
                { name: 'Volver al Menú Principal', value: 'back' }
            ]
        });
        return;
    }

    const clienteChoices = clientes.map(c => ({
        name: `${c.nombre} (${c.direccion})`,
        value: c._id
    }));

    const answer = await inquirer.prompt({
        type: 'list',
        name: 'clienteId',
        message: '--- Eliminar Cliente ---\nSeleccione el cliente que desea eliminar:',
        choices: [
            ...clienteChoices,
            new inquirer.Separator(),
            { name: 'Volver al Menú Principal', value: 'back' }
        ]
    });

    if (answer.clienteId === 'back') {
        return;
    }

    const { confirmacion } = await inquirer.prompt({
        type: 'confirm',
        name: 'confirmacion',
        message: `¿Está seguro de que desea eliminar a este cliente?`,
        default: false
    });

    if (confirmacion) {
        try {
            const result = await clientesCol.deleteOne({ _id: new ObjectId(answer.clienteId) });
            if (result.deletedCount === 1) {
                console.log(`✅ Cliente eliminado con éxito.`);
            } else {
                console.log(`❌ No se encontró el cliente.`);
            }
        } catch (error) {
            console.log(`❌ Error al eliminar cliente: ${error.message}`);
        }
    } else {
        console.log('Operación de eliminación cancelada.');
    }
}

module.exports = { gestionClientes, eliminarCliente };