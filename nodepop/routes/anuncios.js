// Para EJECUTAR el código JS en 'modo estricto', que es menos 'flexible' con los errores de sintaxis de JS.
'use strict';

/**
 * Se cargan los MODULOS necesarios para la app.
 */
const router = require('express').Router();
const fs = require('fs');
// Se carga el Modelo ANUNCIO de Mongoose para trabajar con la BD.
const Anuncio = require('mongoose').model('Anuncio');

/* Petición GET a la página de Anuncios. */
// Se utiliza ASYNC/AWAY por que vamos a trabajar con la BD (operaciones ASINCRONAS).
router.get('/', async function (req, res, next) {
  // Los bloques TRY/CATCH permiten tratar los posibles ERRORES que se produzcan durante la ejecución de la función.
  try {
    // Se leen los POSIBLES PARAMETROS de ENTRADA que vienen en una QUERY STRING.
    const start = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 1000; // nuestro api devuelve max 1000 registros
    const sort = req.query.sort || '_id';
    const includeTotal = true;

    const filters = {};
    if (req.query.tag) {
      filters.tags = req.query.tag;
    }
    if (req.query.venta) {
      filters.venta = req.query.venta;
    }

    // Se realiza una CONSULTA a la BD, esto es una operación ASINCRONA.
    const {total, rows} = await Anuncio.list(filters, start, limit, sort, includeTotal);
    res.render('anuncios', { total, anuncios: rows });
  } catch(err) { return res.next(err); }
});

/**
 * Se EXPORTA la RUTA para poder utilizarla en otro fichero (concretamente en app.js).
 */
module.exports = router;
