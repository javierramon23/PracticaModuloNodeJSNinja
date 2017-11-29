// Para EJECUTAR el código JS en 'modo estricto', que es menos 'flexible' con los errores de sintaxis de JS.
'use strict';

/**
 * Se cargan los MODULOS necesarios para la app.
 */
/**
 * Método Router() de Express:
 * Define RUTAS que pueden solicitarse a la APP.
 * Por lo general estarán asociadas a una función que se ejecutará cuando la PETICION COINCIDA con la RUTA.
 */
const router = require('express').Router();
const fs = require('fs');
const path = require('path');

/**
 * Peticion GET al Home.
 * Notar que en la PETICIONES NO SE TIENE EN CUENTA el DOMINIO PRINCIPAL.
 * Es decir: 'www.una_web_cualquiera.com/' es una PETICION a la RAIZ del sitio web '/'.
 */
// Se utiliza ASYNC/AWAY por que vamos a trabajar con ficheros (operaciones ASINCRONAS).
router.get('/', async function (req, res, next) {
  // Los bloques TRY/CATCH permiten tratar los posibles ERRORES que se produzcan durante la ejecución de la función.
  try {
    // Guardamos la ruta del fichero README.md
    const filename = path.join(__dirname, '../README.md');
    // Se lee el fichero y su contenido se guarda en la constante 'readme'.
    // Como es una operación asíncrona utilizamos una PROMESA.
    const readme = await new Promise((resolve, rejected) => 
      fs.readFile(filename, 'utf8', (err, data) => err ? rejected(err) : resolve(data) )
    );
    // Se RENDERIZA la VISTA del HOME (index.ejs).
    // a la que se la pasa la constante 'readme' para que la muestre.
    res.render('index', { readme });
  //Si se produce un ERROR...
  } catch (err) { 
      // 'SALTAMOS' al middleware de MANEJO de ERRORES.
      return next(err); 
  }
});

/**
 * Se EXPORTA la RUTA para poder utilizarla en otro fichero (concretamente en app.js).
 */
module.exports = router;
