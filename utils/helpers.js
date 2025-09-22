const { connectToDB } = require('./db');

async function initializeDB() {
  const db = await connectToDB();
  const clientes = db.collection('clientes');
  const repartidores = db.collection('repartidores');
  const ingredientes = db.collection('ingredientes');
  const pizzas = db.collection('pizzas');

  await clientes.deleteMany({});
  await repartidores.deleteMany({});
  await ingredientes.deleteMany({});
  await pizzas.deleteMany({});

  await clientes.insertMany([
    { nombre: 'Ana Pérez', telefono: '555-1234', direccion: 'Calle Falsa 123' },
    { nombre: 'Juan Gómez', telefono: '555-5678', direccion: 'Avenida Siempre Viva 456' }
  ]);

  await repartidores.insertMany([
    { nombre: 'Pedro Ramírez', estado: 'disponible' },
    { nombre: 'Sofía Castro', estado: 'disponible' }
  ]);

  await ingredientes.insertMany([
    { nombre: 'Tomate', tipo: 'vegetal', stock: 100 },
    { nombre: 'Queso Mozzarella', tipo: 'lácteo', stock: 150 },
    { nombre: 'Harina', tipo: 'grano', stock: 200 },
    { nombre: 'Pepperoni', tipo: 'carne', stock: 80 },
    { nombre: 'Champiñones', tipo: 'vegetal', stock: 60 }
  ]);

  await pizzas.insertMany([
    { nombre: 'Margarita', ingredientes: [{ nombre: 'Tomate', cantidad: 10 }, { nombre: 'Queso Mozzarella', cantidad: 15 }], precio: 15.50 },
    { nombre: 'Pepperoni', ingredientes: [{ nombre: 'Tomate', cantidad: 10 }, { nombre: 'Queso Mozzarella', cantidad: 15 }, { nombre: 'Pepperoni', cantidad: 10 }], precio: 18.75 }
  ]);

  console.log("Datos de la base de datos inicializados.");
}

module.exports = { initializeDB };