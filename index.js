const { showMainMenu } = require('./controllers/MenuController');
const { connectToDB } = require('./utils/db');
const { initializeDB } = require('./utils/helpers'); // Importa la función aquí

async function main() {
  try {
    await connectToDB();
    await initializeDB(); // Llama a la inicialización solo una vez al inicio
    await showMainMenu();
  } catch (error) {
    console.error("Ocurrió un error en la aplicación:", error);
  }
}

main();