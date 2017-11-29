// Para EJECUTAR el código JS en 'modo estricto', que es menos 'flexible' con los errores de sintaxis de JS.
'use strict';

/**
 * Se cargan los MODULOS necesarios para la app.
 */
/**
 * Método Router() de Express:
 * 
 */
const router = require('express').Router();
const fs = require('fs');
const path = require('path');

/* Peticion GET al Home. */
router.get('/', async function (req, res, next) {
  //
  try {
    //
    const filename = path.join(__dirname, '../README.md');
    //
    const readme = await new Promise((res, rej) => 
      fs.readFile(filename, 'utf8', (err, data) => err ? rej(err) : res(data) )
    );
    //
    res.render('index', { readme });
  //
  } catch (err) { 
      //
      return next(err); 
  }
});

/**
 * 
 */
module.exports = router;
