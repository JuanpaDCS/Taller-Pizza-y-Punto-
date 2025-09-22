const { connectToDB, client } = require('../utils/db');
const inventarioService = require('./InventarioService');

async function realizarPedido(clienteId, pizzaIds) {
  const session = client.startSession();
  let result = { success: false, message: '' };

  try {
    await session.withTransaction(async () => {
      const db = await connectToDB();
      const pedidosCol = db.collection('pedidos');
      const pizzasCol = db.collection('pizzas');
      const repartidoresCol = db.collection('repartidores');

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

      const repartidor = await repartidoresCol.findOneAndUpdate(
        { estado: 'disponible' },
        { $set: { estado: 'ocupado' } },
        { returnDocument: 'after', session }
      );

      if (!repartidor.value) {
        throw new Error('No hay repartidores disponibles en este momento.');
      }
      
      const repartidorId = repartidor.value._id;

      const nuevoPedido = {
        clienteId,
        pizzas: pizzasSeleccionadas.map(p => ({ _id: p._id, nombre: p.nombre, precio: p.precio })),
        repartidorId,
        estado: 'en preparación',
        fecha: new Date()
      };
      await pedidosCol.insertOne(nuevoPedido, { session });

      result = { success: true, message: 'Pedido registrado exitosamente.' };
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