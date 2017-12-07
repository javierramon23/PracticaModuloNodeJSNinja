/**
 * Este es un SCRIPT de INICIALIZACIÓN para preparar la BD de la APP.
 */

// Para EJECUTAR el código JS en 'modo estricto', que es menos 'flexible' con los errores de sintaxis de JS.
'use strict';

/**
 * Se cargan los MODULOS necesarios para la ejecucion de este SCRIPT.
 */
const mongoose = require('mongoose');
// Proporciona una INERFACE para LEER DATOS desde un STREAM (como process.stdin) LINEA por LINEA.
const readLine = require('readline');
const async = require('async');
require('./lib/i18nSetup');

// Se realiza la CONEXION con la BD.
const db = require('./lib/connectMongoose');

// Se carga el MODELO de DATOS ANUNCIO y USUARIO para poder trabajar con ellos.
require('./models/Anuncio');
require('./models/Usuario');

/**
 * Se SUSCRIBE la BD al EVENTO 'open', pero SOLO LA PRIMERA VEZ que se produzca.
 * Es decir, cuando se realice la PRIMERA CONEXION con la BD se ejecutara el código
 * que se define en la función asociada.
 */
db.once('open', function () {
  // Se CREA una INSTANCIA de la INTERFACE para poder LEER los datos.
  const rl = readLine.createInterface({
    // Se determina cual será la ENTRADA y SALIDA de lo que se va a leer.
    input: process.stdin,   // Se define la ENTRADA ESTANDAR (stdin) TECLADO.
    output: process.stdout  // Se define la SALIDA ESTANDAR (stdout) CONSOLA.
  });

  // El metodo '.question()' de READLINE permite establecer una pregunta cuya respuesta será tratada por la función de CALLBACK asociada.
  rl.question('Are you sure you want to empty DB? (no) ', function (answer) {
    // Se cierra la INTERFACE ya que se ha terminado de utilizar.
    rl.close();
    // Si se responde AFIRMATIVAMENTE...
    if (answer.toLowerCase() === 'yes') {
      //
      runInstallScript();
    // En caso CONTRARIO...
    } else {
      // Finalizamos el SCRIPT de instalación
      console.log('DB install aborted!');
      return process.exit(0);
    }
  });
});

/**
 * Función que se encarga de INICIALIZAR el SCRIPT que pone en marcha la carga de registros en la BD.
 */
function runInstallScript() {
  async.series([
      initAnuncios,
      initUsuarios
    ], (err) => {
      if (err) {
        console.error( __('generic', { err }) );
        return process.exit(1);
      }
      return process.exit(0);
    }
  );
}

/**
 * Funcion PRINCIPAL que crea una INSTANCIA de un MODELO ANUCIO para poder llamar a sus METODOS.
 */
function initAnuncios(cb) {
  const Anuncio = mongoose.model('Anuncio');
  // Se ELIMINA el contenido de la BD
  // Se 'CARGA' el fichero que se encarga de CREAR los REGISTROS en la BD.
  Anuncio.remove({}, () => {
    console.log('Anuncios borrados.');
    // Cargar anuncios.json
    const fichero = './anuncios.json';
    console.log('Cargando ' + fichero + '...');
    //
    Anuncio.cargaJson(fichero, (err, numLoaded)=> {
      //
      if (err) return cb(err);
      //
      console.log(`Se han cargado ${numLoaded} anuncios.`);
      return cb(null, numLoaded);
    });
  });
}

/**
 * 
 */
async function initUsuarios() {
  const Usuario = mongoose.model('Usuario');

  await Usuario.remove();

  const inserted = await Usuario.insertMany([
    { nombre:'user', email:'user@example.com', password: Usuario.hashPassword('1234') }
  ]);

  console.log(`Insertados ${inserted.length} usuarios`);
  return process.exit(1);
}



