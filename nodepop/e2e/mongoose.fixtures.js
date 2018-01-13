/**
 * Este archivo permite una INICIALIZACIÓN de la BD de PRUEBA que
 * se está utilizando para realizar los TEST e2e de forma que contenga
 * algunos DATOS para poder trabajar con ellos.
 */

// Para EJECUTAR el código JS en 'modo estricto', que es menos 'flexible' con los errores de sintaxis de JS.
 'use strict';

 // Cargamos el MODELO de Anuncio para poder trabajar con el.
 const Anuncio = require('../models/Anuncio');
 // Cargamos el FICHERO JSON con ANUNCIOS para INSERTARLOS en la BD 'FAKE'.
 const anunciosFake = require('../anuncios.json');

 /**
  * BORRA el contenidoACTUAL de la BD 'FAKE' e
  * INICIALIZA una serie de ANUNCIOS por defecto en la misma
  * EXPORTAMOS el METODO 'initProductos()' para poder llamarlo desde otro fichero.
  */
 module.exports.initAnuncios = async function() {
     // ELIMINAMOS los ANUNCIOS ACTUALES de la BD.
     await Anuncio.remove();

     /**
      * INSERTAMOS unos ANUNCIOS de PRUEBA.
      * Estos anuncios los vamos a leer de un FICHERO JSON para evitar
      * escribirlos.
      */ 
     await Anuncio.insertMany(anunciosFake.anuncios);
 }