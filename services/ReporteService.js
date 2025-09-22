const { connectToDB } = require('../utils/db');

async function ingredientesMasUsados(dias = 30) {
  const db = await connectToDB();
  const pedidosCol = db.collection('pedidos_completados');

  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - dias);

  const pipeline = [
    { $match: { fecha: { $gte: fechaLimite } } },
    { $unwind: '$pizzas' },
    {
      $lookup: {
        from: 'pizzas',
        localField: 'pizzas._id',
        foreignField: '_id',
        as: 'pizzaInfo'
      }
    },
    { $unwind: '$pizzaInfo' },
    { $unwind: '$pizzaInfo.ingredientes' },
    {
      $group: {
        _id: '$pizzaInfo.ingredientes.nombre',
        totalConsumido: { $sum: '$pizzaInfo.ingredientes.cantidad' }
      }
    },
    { $sort: { totalConsumido: -1 } }
  ];

  return pedidosCol.aggregate(pipeline).toArray();
}

async function promedioPreciosPorCategoria() {
  const db = await connectToDB();
  const pizzasCol = db.collection('pizzas');

  const pipeline = [
    { $unwind: '$ingredientes' },
    {
      $lookup: {
        from: 'ingredientes',
        localField: 'ingredientes.nombre',
        foreignField: 'nombre',
        as: 'ingredienteInfo'
      }
    },
    { $unwind: '$ingredienteInfo' },
    {
      $group: {
        _id: '$ingredienteInfo.tipo',
        promedioPrecio: { $avg: '$precio' },
        totalPizzas: { $sum: 1 }
      }
    },
    { $match: { totalPizzas: { $gt: 0 } } },
    {
      $project: {
        _id: 0,
        categoria: '$_id',
        promedioPrecio: { $round: ['$promedioPrecio', 2] }
      }
    },
    { $sort: { promedioPrecio: -1 } }
  ];

  return pizzasCol.aggregate(pipeline).toArray();
}

async function categoriasMasVendidas() {
  const db = await connectToDB();
  const pedidosCol = db.collection('pedidos_completados');

  const pipeline = [
    { $unwind: '$pizzas' },
    {
      $lookup: {
        from: 'pizzas',
        localField: 'pizzas._id',
        foreignField: '_id',
        as: 'pizzaInfo'
      }
    },
    { $unwind: '$pizzaInfo' },
    { $unwind: '$pizzaInfo.ingredientes' },
    {
      $lookup: {
        from: 'ingredientes',
        localField: 'pizzaInfo.ingredientes.nombre',
        foreignField: 'nombre',
        as: 'ingredienteInfo'
      }
    },
    { $unwind: '$ingredienteInfo' },
    {
      $group: {
        _id: '$ingredienteInfo.tipo',
        totalVentas: { $sum: 1 }
      }
    },
    { $sort: { totalVentas: -1 } }
  ];

  return pedidosCol.aggregate(pipeline).toArray();
}

module.exports = { ingredientesMasUsados, promedioPreciosPorCategoria, categoriasMasVendidas };