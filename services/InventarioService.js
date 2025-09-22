const { connectToDB } = require('../utils/db');

async function verificarStock(ingredientesRequeridos) {
  const db = await connectToDB();
  const ingredientesCol = db.collection('ingredientes');

  for (const req of ingredientesRequeridos) {
    const ingrediente = await ingredientesCol.findOne({ nombre: req.nombre, stock: { $gte: req.cantidad } });
    if (!ingrediente) {
      return { suficiente: false, ingredienteFaltante: req.nombre };
    }
  }
  return { suficiente: true };
}

async function descontarStock(ingredientesRequeridos, session) {
  const db = await connectToDB();
  const ingredientesCol = db.collection('ingredientes');

  for (const req of ingredientesRequeridos) {
    await ingredientesCol.updateOne(
      { nombre: req.nombre },
      { $inc: { stock: -req.cantidad } },
      { session }
    );
  }
}

module.exports = { verificarStock, descontarStock };