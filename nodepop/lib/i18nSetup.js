/**
 * Fichero de CONFIGURACION del MODULO i18n para la INTERNACIONALIZACION de la APP.
 */
// Para EJECUTAR el código JS en 'modo estricto', que es menos 'flexible' con los errores de sintaxis de JS.
'use strict';

 // Se cargan los MODULOS necesarios.
const i18n = require('i18n');
const path = require('path');

// CONFIGURACION PERSONALIZADA.
i18n.configure({
  // RUTA donde se encuentran los ficheros de IDIOMAS.
  directory: path.join(__dirname, '..', 'locales'),
  // Se definen los IDIOMAS DISPONIBLES en la APP.
  locales: ['en', 'es'],
  // Idioma POR DEFECTO.
  defaultLocale: 'es',
  // EVITA tener que utilizar 'i18n.' A LA HORA DE MOSTRAR un TEXTO, "__('texto')"" en lugar de "i18n.__('texto')"
  register: global,
  // Permite ESTABLECER el IDIOMA a través de la BARRA de NAVEGACIÓN con una QUERY STRING.
  queryParameter: 'lang',
  // SINCRONIZA el CONTENIDO de los LOCALE de forma AUTOMATICA.
  syncFiles: true,
  // Se establece un NOMBRE de COOKIE para ESTABLECER el IDIOMA.
  cookie: 'nodeapi_laguage'
});

/**
 * EXPORTAMOS este FICHERO para poder UTILIZARLA en otros FICHEROS.
 */
module.exports = i18n;