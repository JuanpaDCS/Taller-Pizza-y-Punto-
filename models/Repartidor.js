const repartidoresList = [
    { nombre: 'Pedro Ramírez', id: 'repartidor_01' },
    { nombre: 'Sofía Castro', id: 'repartidor_02' },
    { nombre: 'Luis Gámez', id: 'repartidor_03' },
    { nombre: 'María Pérez', id: 'repartidor_04' }
];

function elegirRepartidorAleatorio() {
    const repartidorElegido = repartidoresList[Math.floor(Math.random() * repartidoresList.length)];
    return repartidorElegido;
}

module.exports = { elegirRepartidorAleatorio };