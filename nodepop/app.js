/**
 * APLICACION CREADA A PARTIR DEL MODULO EXPRESS GENERATOR QUE NOS GENERA LA ESTRUCTURA BASICA COMUN
 * DE UNA APP EXPRESS.
 * Para CREAR una APP: `express [opciones] [directorio_app]`
 * Después de crear la APP es necesario instalar las DEPENDENCIAS de NODE
 * Para INSTALAR las DEPENDENCIAS: `npm install`
 * 
 * Después de lo anterior ya podríamos EJECUTARLA.
 */

// Para EJECUTAR el código JS en 'modo estricto', que es menos 'flexible' con los errores de sintaxis de JS.
'use strict';

/**
 * Se cargan los MODULOS necesarios para la app.
 */ 
// EXPRESS: Necesario para ejecutar una APP de EXPRESS.
const express = require('express');

/**
 * PATH: Para trabajar con ficheros y rutas de directorios sin importar el sistema en el que se trabaje.
 * https://nodejs.org/api/path.html
 */
const path = require('path');

/**
 * MORGAN: Se encarga de crear un LOGGER para las peticiones HTTP que se realicen a la APP
 * https://www.npmjs.com/package/morgan
 */
const logger = require('morgan');

/**
 * COOKIE PARSER:
 */
const cookieParser = require('cookie-parser');
// BODY PARSER:
const bodyParser = require('body-parser');

// Cargamos la configuración que se ha definido para la INTERNACIONALIZACION en el fichero 'i18nSetup.js'.
const i18n = require('./lib/i18nSetup');

/* jshint ignore:start */
const db = require('./lib/connectMongoose');
/* jshint ignore:end */

// Cargamos las DEFINICIONES de todos nuestros MODELOS
require('./models/Anuncio');

// 
const app = express();

// Definimos el MOTOR de VISTAS.
// Con 'path.join()' se genera la RUTA donde se encuentran almacenadas las vistas de la APP
app.set('views', path.join(__dirname, 'views'));
// Se define el MOTOR de VISTAS.
app.set('view engine', 'ejs');

/**
 * ¡¡¡¡¡LOS MIDDLEWARES!!!!!
 * app.use() : Define un Middleware que se ejecutará o no en función pe las PETICIONES.
 * Los Middlewares se EVALUAN y EJECUTAN en ORDEN LINEAL y DESCENDENTE, si la petición no CUMPLE,
 * se pasa al SiGUIENTE....
 */

 // Se inicia el LOGGER para 'controlar' las peticiones HTTP.
app.use(logger('dev'));
// Se inicia 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Se inicia i18n
app.use(i18n.init);

// Definimos una VARIABLES de ENTORNO con el NOMBRE de la APP.
app.locals.title = 'NodePop';

// Para las peticiones que se hagan a la RUTA 'raiz' de la APP se utilizaran las RUTAS del fichero 'index.js' para RESPONDER.
app.use('/', require('./routes/index'));
// Para las peticiones que se hagan a la RUTA '/anuncios' de la APP se utilizaran las RUTAS del fichero 'anuncios.js' para RESPONDER.
app.use('/anuncios', require('./routes/anuncios'));

// Para las peticiones que se hagan a la RUTA '/apiv1/anuncios' de la APP se utilizaran las RUTAS del fichero '/apiv1/anuncios.js' para RESPONDER.
app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));

// Si hemos llegado a este punto y la petición no COINCIDE con ninguno de los Middlewares ANTERIORES se GENERA un ERROR.
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // Se crea un Objeto ERROR de tipo 'no encontrado'.
  const err = new Error(__('not_found'));
  // Se establece su estatus.
  err.status = 404;
  // REDIRIGIMOS la ejecución al MANEJADOR de ERRORES.
  next(err);
});

// MANEJADOR DE ERRORES.
// Es el Middleware que tiene el PARAMETRO 'err' en la definición de la FUNCION que se debe ejecutar.
app.use(function(err, req, res, next) {
  
  if (err.array) { // validation error
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = isAPI(req) ?
      { message: __('not_valid'), errors: err.mapped()}
      : `${__('not_valid')} - ${errInfo.param} ${errInfo.msg}`;
  }

  // establezco el status a la respuesta
  err.status = err.status || 500;
  res.status(err.status);

  // si es un 500 lo pinto en el log
  if (err.status && err.status >= 500) console.error(err);
  
  // si es una petición al API respondo JSON...
  if (isAPI(req)) {
    res.json({ success: false, error: err.message });
    return;
  }

  // ...y si no respondo con HTML...

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

/**
 * 
 * Funcion AUXILIAR que comprueba si una PETICION este DIRIGIDA a la API.
 */
function isAPI(req) {
  
  return req.originalUrl.indexOf('/api') === 0;
}

module.exports = app;
