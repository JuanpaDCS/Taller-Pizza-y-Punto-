const { connectToDB, client } = require('../utils/db');
const inventarioService = require('./InventarioService');
const { elegirRepartidorAleatorio } = require('../models/Repartidor');

async function realizarPedido(clienteId, pizzaIds) {
  const session = client.startSession();
  let result = { success: false, message: '' };

  try {
    await session.withTransaction(async () => {
      const db = await connectToDB();
      const pedidosCol = db.collection('pedidos');
      const pizzasCol = db.collection('pizzas');
      const pedidosCompletadosCol = db.collection('pedidos_completados');

      const pizzasSeleccionadas = await pizzasCol.find({ _id: { $in: pizzaIds } }).toArray();

      if (pizzasSeleccionadas.length !== pizzaIds.length) {
        throw new Error('Una o más pizzas no se encontraron.');
      }

      const ingredientesTotales = pizzasSeleccionadas.reduce((acc, pizza) => {
        pizza.ingredientes.forEach(ing => {
          acc[ing.nombre] = (acc[ing.nombre] || 0) + ing.cantidad;
        });
        return acc;
      }, {});

      const ingredientesArray = Object.keys(ingredientesTotales).map(nombre => ({
        nombre,
        cantidad: ingredientesTotales[nombre]
      }));

      const stockCheck = await inventarioService.verificarStock(ingredientesArray);
      if (!stockCheck.suficiente) {
        throw new Error(`Stock insuficiente para el ingrediente: ${stockCheck.ingredienteFaltante}`);
      }

      await inventarioService.descontarStock(ingredientesArray, session);

      // --- New Logic: Automate Repartidor Assignment and Order Completion ---
      const repartidorElegido = elegirRepartidorAleatorio();

      const repartidorId = repartidorElegido.id;

      const nuevoPedido = {
        clienteId,
        pizzas: pizzasSeleccionadas.map(p => ({ _id: p._id, nombre: p.nombre, precio: p.precio })),
        repartidorId,
        estado: 'completado', // The order is now completed right away
        fecha: new Date()
      };
      
      await pedidosCompletadosCol.insertOne(nuevoPedido, { session });

      result = { success: true, message: 'Pedido registrado y completado exitosamente.' };

      const tiempoDemora = Math.floor(Math.random() * (45 - 20 + 1)) + 20;
      const tiempoCompletado = new Date();
      tiempoCompletado.setMinutes(tiempoCompletado.getMinutes() + tiempoDemora);

      result.demora = tiempoDemora;
      result.completado = tiempoCompletado.toLocaleTimeString('es-ES');
      result.repartidorNombre = repartidorElegido.nombre;
    });
  } catch (error) {
    console.error(`Transacción fallida: ${error.message}`);
    result = { success: false, message: error.message };
  } finally {
    await session.endSession();
  }

  return result;
}

module.exports = { realizarPedido };