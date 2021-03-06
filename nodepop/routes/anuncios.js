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
    // Se leen los POSIBLES PARAMETROS de ENTRADA que vienen en una QUERY STRING, si no los hay se establecen valores POR DEFECTO.
    const start = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 1000; // nuestro api devuelve max 1000 registros
    const sort = req.query.sort || '_id';
    const includeTotal = true;

    // Se crea un objeto JSON para crear un FILTRO de búsqueda en función de los TAG'S y si el objeto esta o no a la venta. 
    const filters = {};
    // Si en a PETICION existe un paramtro TAG
    if (req.query.tag) {
      // Se añade el TAG al filtro.
      filters.tags = req.query.tag;
    }
    // Si en la PETICION existe un parametro EN VENTA.
    if (req.query.venta) {
      // Se añade la OPCION al filtro.
      filters.venta = req.query.venta;
    }

    /**
     * Se llama al METODO ESTATICO que se ha definido en el MODELO Anuncio para realizar la CONSULTA.
     * Se le pasan TODOS los PARAMETROS.
     * Se realiza una CONSULTA a la BD con toda la INFO recopilada en los pasos anteriores, esto es una operación ASINCRONA.
     * En este caso se utiliza ASYNC/AWAIT por lo tanto no es necesario pasar un CALLBACK.
     */
    const {total, rows} = await Anuncio.list(filters, start, limit, sort, includeTotal);
    // Se RENDERIZA la VISTA de los anuncios con los datos obtenidos en la consulta (anuncios.ejs).
    res.render('anuncios', { total, anuncios: rows });
  // Si se produce un ERROR...
  } catch(err) {
    // 'SALTAMOS' al middleware de MANEJO de ERRORES.
    return next(err); 
  }
});

/**
 * Petición GET para CAMBIAR el IDIOMA de la PAGINA de ANUNCIOS.
 * como no vamos a utilizar 'next', no hace falta que lo pongamos.
 */
router.get('/language/:locale', (request, response) => {

  //La PETICION lleva un PARAMETRO que determina el idioma que queremos poner.
  const locale = request.params.locale;

  /**
   * Se guarda la CABECERA 'Referer' de la PETICION para saber
   * DESDE DONDE HA VENIDO LA PETICION para más tarde REDIRIGIR la RESPUESTA
   * a ESA MISMA DIRECCIÓN pero ya TRADUCIDA.
   */
  const referer = request.get('referer');

  // Se establece el VALOR de la COOKIE que se ha definido en i18n con el IDIOMA que se quiere ESTABLECER.
  response.cookie('nodeapi_laguage', locale, { maxAge: 90000, httpOnly: true });
  
  /**
   * Se REDIRIGE el NAVEGADOR (o al usuario) a la WEB desde la que se solicito el CAMBIO de IDIOMA.
   * Se utiliza el valor de la CABECERA 'REFERER' que se ha guardado antes.
   */ 
  response.redirect(referer);
});

/**
 * Se EXPORTA la RUTA para poder utilizarla en otro fichero (concretamente en app.js).
 */
module.exports = router;
