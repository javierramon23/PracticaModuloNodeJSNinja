// Para EJECUTAR el código JS en 'modo estricto', que es menos 'flexible' con los errores de sintaxis de JS.
'use strict';

/**
 * Se cargan los MODULOS necesarios para la app.
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Anuncio = mongoose.model('Anuncio');

/**
 * Peticion GET a la API para que muestre un OBJETO JSON con los OBJETOS que contiene la BD.
 */
router.get('/', (req, res, next) => {
  /**
   * Se GUARDAN los PARAMETROS de ENTRADA (de una QUERY STRING, que vienen en la PETICION)
   * para después poder realizar o aplicar una serie de FILTROS sobre la consulta a la BD.
   * Los que NO se hayan especificado se establecen con un valor POR DEFECTO.
   */

  // start: Define el registro INICIAL en la PAGINACION, será el PRIMERO por defecto.
  const start = parseInt(req.query.start) || 0;
  // limit: Define el NUMERE MAX de registros que puede mostrar la API, 1000 por defecto.
  const limit = parseInt(req.query.limit) || 1000; 
  // sort: Establece el parámetro por el que se ORDENAN los registros, el ID por defecto.
  const sort = req.query.sort || '_id';
  // includeTotal: Establece si se debe realizar la cuenta de TODOS los registros de la COLECCION.
  const includeTotal = req.query.includeTotal === 'true';

  // OBJETO JSON VACIO para 'COMPONER' el FILTRO que se le pasará a la oonsulta. 
  const filters = {};

  /**
   * Se DEFINEN los FILTROS que se le van a aplicar a la CONSULTA a través de
   * una serie de PARAMETROS de ENTRADA que vienen a través de una QUERY STRING en la
   * SOLICITUD.
   */
  // Si la Query String contiene el parámetro 'tag'...
  if (typeof req.query.tag !== 'undefined') {
    // Se incluye en el filtro.
    filters.tags = req.query.tag;
  }
  
  // Si la Query String contiene el parámetro 'venta'...
  if (typeof req.query.venta !== 'undefined') {
    // Se incluye en el filtro.
    filters.venta = req.query.venta;
  }
  
  // Si la Query String contiene el parámetro 'precio'
  // y este parámetro no es el caracter '-'...
  if (typeof req.query.precio !== 'undefined' && req.query.precio !== '-') {
    // Si el parámetro contiene un GUION (-)...
    if (req.query.precio.indexOf('-') !== -1) {
      // Se define un filtro ESPECIFICO para el PRECIO que se debe buscar en la consulta.
      filters.precio = {};
      // Se 'elimina' el GUION (solo necesario para determinar la primera condición).
      let rango = req.query.precio.split('-');
      // SI NO HAY NADA ANTES del PRECIO a BUSCAR....
      if (rango[0] !== '') {
        // El PRECIO de los registros sea MAYOR que el del parametro.
        filters.precio.$gte = rango[0];
      }
      // SI NO HAY NADA DESPUES del PRECIO a BUSCAR....
      if (rango[1] !== '') {
        // Que el PRECIO de los registros sea MENOR que el del parametro.
        filters.precio.$lte = rango[1];
      }
    // Si no se pone el GUION...
    } else {
      // Se debe filtrar por los registros que COINCIDAN con el precio soilicitado.
      filters.precio = req.query.precio;
    }
  }

  // Si la Query String contiene el parámetro 'nombre'...
  if (typeof req.query.nombre !== 'undefined') {
    // Se incluye en el filtro una EXPRESION REGULAR para buscar registros que macheen con esa expresión regular.
    filters.nombre = new RegExp('^' + req.query.nombre, 'i');
  }

  /**
   * Se utiliza el METODO ESTATICO 'list' que se ha definido en el MODELO ANUNCIO
   * para realizar la consulta a la BD.
   * Como todas las operaciones sobre una BD, esta es una operación ASINCRONA y es necesario
   * definir una función de CALLBACK que se ejecutará cuando FINALIZE la OPERACION.
   */
  Anuncio.list(filters, start, limit, sort, includeTotal, function (err, anuncios) {
    // Si la consulta produce un ERROR, se 'salta' al MIDDLEWARE Manejador de ERRORES.
    if (err) return next(err);
    // Si la operación finaliza bien, se devuelve un JSON con los REGISTROS devueltos por la CONSULTA
    res.json({ ok: true, result: anuncios });
  });
});

/**
 * Peticion GET a la API para que muestre un OBJETO JSON con los TAG's que contiene la BD.
 */
router.get('/tags', function (req, res) {
  // NO es una PETICION a la API, se accede al MODELO de DATOS y se llama al METODO ESTATICO que este define para mostrar los TAG'S.
  res.json({ ok: true, allowedTags: Anuncio.allowedTags() });
});

/**
 * Se EXPORTAN los ROUTER para poder utilizarlos desde otros ficheros.
 */
module.exports = router;
