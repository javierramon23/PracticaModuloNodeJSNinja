// Para EJECUTAR el código JS en 'modo estricto', que es menos 'flexible' con los errores de sintaxis de JS.
'use strict';

/**
 * Se cargan los MODULOS necesarios para el fichero.
 * y se CREA una CONEXIÓN con una BD de MongoDB.
 */ 
const mongoose = require('mongoose');
const db = mongoose.connection;

// Se establece la LIBRERIA de PROMESAS que utiliza MONGOOSE.
// Necesarias por que algunas de las operaciones que realiza MONGOOSE son ASINCRONAS.
mongoose.Promise = global.Promise;

/**
 * La CONEXION a la BD se SUSCRIBE a unos EVENTOS a los que deberá RESPONDER, 'error' y 'open'.
 */
// Si se produce el EVENTO 'error'...
db.on('error', function (err) {
  // Se muestra un ERROR de conexión por la consola del servidor.
  console.error('mongodb connection error:', err);
  // Se FINALIZA el proceso de la APP.
  process.exit(1);
});

// La PRIMERA VEZ que se produce el EVENTO 'open'...
db.once('open', function () {
  // Se muestra un mensaje de AVISO de CONEXION por la consola del servidor.
  // Se muestra tb la BD a la que nos estamos conectando.
  console.info('Connected to mongodb on', mongoose.connection.name);
});

/**
 * Se establece la BD que UTILIZARA la APP.
 * Su formato es similar a una URL HTTP.
 * Sustituyendo el protocolo http:// pot mongodb://
 */
mongoose.connect('mongodb://localhost/nodepop', { useMongoClient: true });

/**
 * Se EXPORTA el CODIGO para ejecutarlo desde otros ficheros.
 */
module.exports = db;
