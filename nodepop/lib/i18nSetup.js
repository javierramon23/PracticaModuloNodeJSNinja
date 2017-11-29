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
  // Idioma POR DEFECTO.
  defaultLocale: 'en',
  // EVITA tener que utilizar 'i18n.' A LA HORA DE MOSTRAR un TEXTO, "__('texto')"" en lugar de "i18n.__('texto')"
  register: global
});

/**
 * EXPORTAMOS este FICHERO para poder UTILIZARLA en otros FICHEROS.
 */
module.exports = i18n;