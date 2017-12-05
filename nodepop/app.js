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

/**
 * BODY PARSER:
 */
const bodyParser = require('body-parser');

// Cargamos la configuración que se ha definido para la INTERNACIONALIZACION en el fichero 'i18nSetup.js'.
const i18n = require('./lib/i18nSetup');

/**
 * JSHINT: Es una herramienta qe ayuda a detectar errores y problemas potenciales
 * en nuestro código JS.
 */
/* jshint ignore:start */
// Cargamos el fichero de CONEXION con la BD de MOONGOOSE 'connectMongoose.js'.
const db = require('./lib/connectMongoose');
/* jshint ignore:end */

// Cargamos el CONTROLADOR LoginController en este punto.
const loginController = require('./routes/loginController');

// Cargamos las DEFINICIONES de todos nuestros MODELOS
//**************SI NO HACEMOS REFERENCIA A EL, POR QUE CARGARLO????
require('./models/Anuncio');

// SE CREA LA APP de EXPRESS.
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

// Se USA (ejecuta) el LOGGER para 'controlar' las peticiones HTTP.
app.use(logger('dev'));

// Se USA (ejecuta) el
app.use(bodyParser.json());
// Se USA (ejecuta) el
app.use(bodyParser.urlencoded({ extended: false }));

// Se USA (ejecuta) el 
app.use(cookieParser());

// Se USA (ejecuta) el método STATIC de EXPRESS para determinar de donde se deben servir los ficheros ESTATICOS de la APP.
app.use(express.static(path.join(__dirname, 'public')));

// Se USA (ejecuta, inicia) el módulo i18n para la INTERNACIONALIZACION.
app.use(i18n.init);

// Definimos una VARIABLE LOCAL de la APP con el NOMBRE de la APP.
// Las variables definidas en 'app.locals' permanecen a lo largo de la ejecución de esta.
app.locals.title = 'NodePop APP';

// MIDDLEWARE para LOGIN de USUARIOS:
// En lugar de 'app.use' vamos directamente a controlar las PETICIONES al METODO 'index' CONCRETO
// Por esa razon utilizamos 'app.get', usamos las RUTAS del CONTROLADOR.
app.use('/login', loginController.index);

// Para las peticiones que se hagan a la RUTA 'raiz' de la APP se utilizaran las RUTAS del fichero 'index.js' para RESPONDER.
app.use('/', require('./routes/index'));

// Para las peticiones que se hagan a la RUTA '/anuncios' de la APP se utilizaran las RUTAS del fichero 'anuncios.js' para RESPONDER.
app.use('/anuncios', require('./routes/anuncios'));


// Para las peticiones que se hagan a la RUTA '/apiv1/anuncios' de la APP se utilizaran las RUTAS del fichero '/apiv1/anuncios.js' para RESPONDER.
app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));

// Si hemos llegado a este punto y la petición no COINCIDE con ninguno de los Middlewares ANTERIORES se GENERA un ERROR.
app.use(function (req, res, next) {
  // Se crea un Objeto ERROR de tipo 'no encontrado'.
  const err = new Error(__('NOT_FOUND'));
  // Se establece su estatus.
  err.status = 404;
  // REDIRIGIMOS la ejecución al MANEJADOR de ERRORES.
  next(err);
});

// MANEJADOR DE ERRORES.
// Se encarga de MANEJAR los distintos TIPOS de ERRORES que pueden ocurrir.
// Es el Middleware que tiene el PARAMETRO 'err' en la definición de la FUNCION que se debe ejecutar.
app.use(function(err, req, res, next) {
  
  /**
   * ERROR de VALIDACIÓN de los PARAMETROS.
   */
  // Será un error de VALIDACION si 'err' tiene una propiedad 'array'.
  if (err.array) {
    // Se establece el STATUS específico.
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    // Se establece un MENSAJE según la CONDICION...
    /**
     * CONDICIONAL TERNARIO:
     * condición ? expr1 : expr2 
     */
    // Si es una peticion a la API...
    err.message = isAPI(req) ?
      // Creamos JSON con el error.
      { message: __('NOT_VALID'), errors: err.mapped()}
      // si no, creamos un string para mostrarlo en la VISTA HTML.
      : `${__('NOT_VALID')} - ${errInfo.param} ${errInfo.msg}`;
  }

  // Se establece el STATUS del ERROR.
  // Si YA TIENE UNO asignado, se MANTIENE, si no, se le ASIGNA el STATUS 500.
  err.status = err.status || 500;
  // Se RESPONDE a la PETICION con el ERROR uqe se ha creado.
  res.status(err.status);

  /**
   * ERROR del SERVIDOR.
   */
  // Si el STATUS es un 500 lo 'PINTAMOS' en el LOG
  if (err.status && err.status >= 500) console.error(err);
  
  /**
   * ERROR de SOLICITUD a la API.
   */
  if (isAPI(req)) {
    // RESPONDEMOS con un OBJETO JSON de ERROR...
    res.json({ success: false, error: err.message });
    // 'CORTAMOS' la ejecución.
    return;
  }

  /**
   * OTROS ERRORES de HTML
   */
  // Se definen unas VARIABLES LOCALES.
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // RESPONDEMOS RENDERIZANDO la VISTA de ERROR HTML.
  res.render('error');
});

/**
 * Funcion AUXILIAR que comprueba si una PETICION este DIRIGIDA a la API.
 */
function isAPI(req) {
  // Retorna TRUE o FALSE en función de que encuentre el string '/api' dentro de la RUTA de la PETICION.
  /**
   * req.originalUrl guarda la URL de la solicitud MENOS el dominio principal:
   * Si la petición es: 'http://www.example.com/admin/new' --> req.originalUrl = '/admin/new'
   */
  return req.originalUrl.indexOf('/api') === 0;
}

/**
 * Se EXPORTA el CODIGO de la APP para poder ejecutarla desde otro fichero.
 */
module.exports = app;
