# Pizza y Punto: Sistema de Gestión de Pedidos por Consola

## Descripción del Sistema
"Pizza y Punto" es una aplicación de consola desarrollada en **Node.js** para la gestión de pedidos de pizzas. El sistema está diseñado para controlar el inventario de ingredientes, procesar pedidos de clientes y generar reportes de ventas. Utiliza **MongoDB** para la persistencia de datos y **Inquirer** para una interacción amigable en la línea de comandos.

El proyecto sigue una estructura modular para mantener el código organizado y fácil de mantener, con carpetas dedicadas a modelos, servicios, controladores y utilidades.

pizza-y-punto/
├── models/             # Esquemas de datos 
│   └── Repartidor.js
├── services/           # Lógica de negocio
│   ├── InventarioService.js
│   ├── PedidoService.js
│   └── ReporteService.js
├── controllers/        # Lógica de la interfaz de usuario y orquestación
│   ├── ClienteController.js
│   ├── MenuController.js
│   └── PedidoController.js
├── utils/              # Funciones de utilidad (conexión a DB, inicialización)
│   ├── db.js
│   └── helpers.js
├── .gitignore
├── package.json
└── index.js            # Punto de entrada de la aplicación

## Instalación y Ejecución

Para poner en marcha la aplicación, sigue estos sencillos pasos:

1.  Asegúrate de tener **Node.js** y un servidor de **MongoDB** instalados y en ejecución (el código asume que el servidor está en `localhost:27017`).
2.  Navega hasta la raíz del proyecto en tu terminal.
3.  Instala las dependencias del proyecto ejecutando el siguiente comando:

    ```bash
    npm install
    ```

4.  Una vez que las dependencias estén instaladas, puedes iniciar la aplicación con:

    ```bash
    npm start
    ```

    Al ejecutar este comando, la base de datos se inicializará con datos de ejemplo (clientes, repartidores, pizzas e ingredientes) cada vez que se inicie la aplicación.

## Ejemplos de Uso

Al iniciar la aplicación, serás recibido por un menú principal en la consola.

* **Registrar un nuevo pedido**: Selecciona esta opción para crear un pedido. El sistema te guiará para elegir un cliente y las pizzas que deseas comprar.
* **Ver reportes de ventas**: Elige esta opción para acceder a un submenú que te permitirá generar diferentes análisis de datos.
* **Salir**: Termina la aplicación y cierra la conexión a la base de datos.

## Explicación de las Funcionalidades Clave

### Transacciones Atómicas con MongoDB
La función `realizarPedido` utiliza **transacciones** para garantizar que un pedido se registre de manera segura. Un pedido no se considera completo a menos que se cumplan las siguientes condiciones, todas dentro de una única operación atómica:

1.  Verificación de stock de ingredientes.
2.  Actualización y descuento de ingredientes del inventario.
3.  Asignación y cambio de estado de un repartidor disponible.
4.  Registro final del pedido.

Si alguna de estas operaciones falla, **toda la transacción se revierte**, asegurando que la base de datos no quede en un estado inconsistente.

### Reportes con Aggregation Framework
Para los reportes de análisis, se utiliza el **Aggregation Framework de MongoDB**. Esta potente herramienta permite procesar grandes cantidades de datos y generar resúmenes informativos. Los reportes disponibles son:

* **Ingredientes más usados**: Agrupa los datos para sumar el consumo de cada ingrediente.
* **Promedio de precios por categoría**: Calcula el precio promedio de las pizzas, agrupándolas por el tipo de ingrediente principal que contienen.
* **Categoría de pizzas con más ventas**: Muestra qué categorías de pizzas (basadas en sus ingredientes) son las más populares históricamente.

Estos reportes son fundamentales para la toma de decisiones, como la gestión del inventario y la planificación del menú.

---

## 🤝 Realizado por:🤝

* Juan Pablo Cifuentes 
* Juan Sebastian Gualdron
* Cristian Perez

---
