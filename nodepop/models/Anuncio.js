/**
 * Este fichero define un MODELO de DATOS para los ANUNCIOS que maneja la APP.
 */
// Para EJECUTAR el código JS en 'modo estricto', que es menos 'flexible' con los errores de sintaxis de JS.
'use strict';

/**
 * Se cargan los MODULOS necesarios para la app.
 */
const mongoose = require('mongoose');
const fs = require('fs');
const flow = require('../lib/flowControl');
const configAnuncios = require('../local_config').anuncios;
const path = require('path');

/**
 * Se define un SCHEMA para los ANUNCIOS.
 * Un SCHEMA es la ESTRUCTURA de DATOS que deben tener los ANUNCIOS en la BD.
 * Podemos verlo como la TABLA de una BD RELACIONAL.
 */
const anuncioSchema = mongoose.Schema({
  nombre: { type: String, index: true },
  venta: { type: Boolean, index: true },
  precio: { type: Number, index: true },
  foto: String,
  tags: { type: [String], index: true }
});

/**
 * METODO ESTATICO: Es posible llamarlo sin crear una instancia de ANUNCIO.
 * Listado de TAGS permitidos para el 'campo' TAGS de un ANUNCIO.
 */
anuncioSchema.statics.allowedTags = function () {
  return ['work', 'lifestyle','motor', 'mobile'];
};

/**
 * METODO ESTATICO.
 * Se encarga de leer el fichero JSON que contiene los VALORES INICIALES de la BD y
 * genera un REGISTRO en la BD para cada uno de ellos.
 */
anuncioSchema.statics.cargaJson = function (fichero, cb) {
  // Encodings: https://nodejs.org/api/buffer.html
  fs.readFile(fichero, { encoding: 'utf8' }, function (err, data) {
    if (err) return cb(err);
    console.log(fichero + ' leido.');
    if (data) {
      const anuncios = JSON.parse(data).anuncios;
      const numAnuncios = anuncios.length;
      flow.serialArray(anuncios, Anuncio.createRecord, (err)=> {
        if (err) return cb(err);
        return cb(null, numAnuncios);
      });
    } else {
      return cb(new Error( __('empty_file', { file: fichero }) ));
    }
  });
};

/**
 * METODO ESTATICO.
 * Crea un INSTANCIA de un ANUNCIO con los parámetros que recibe de 'cb'.
 */
anuncioSchema.statics.createRecord = function (nuevo, cb) {
  new Anuncio(nuevo).save(cb);
};

/**
 * METODO ESTATICO.
 * LISTA los ANUNCIOS que contiene la BD en funcion de los parametros de entrada.
 */
anuncioSchema.statics.list = async function(filters, startRow, numRows, sortField, includeTotal, cb) {
  // Se buscan los REGISTROS (documentos en Mongodb) según los FILTROS recibidos.
  /**
   * El metodo FIND de Mongoose es una CONSULTA o QUERY a la BD.
   * FIND es una operación ASINCRONA por lo que para su EJECUCIÓN es necesario un CALLBACK que se ejecutará
   * despues de realizar la búsqueda.
   * USO BASICO: Modelo.find({filtros}, function(errorFind, resultadoFind){});
   * 
   * Si no se especifica el CallBack FIND no se ejecuta, devuelve un objeto QUERY pendiente de ejecución.
   * Sobre ese objeto QUERY se pueden realizar más operaciones y finalmente se EJECUTA con '.exec(function(error, resultado){})'.
   */
  const query = Anuncio.find(filters);
  // Se ordenan esos registros en funcion del parámetro de entrada.
  query.sort(sortField);
  // De todos los resultados obtenidos en la búsqueda, se empieza a listar desde el número especificado en el parámetro.
  query.skip(startRow);
  // y se termina en el número de registro que indica el parámetro de entrada.
  query.limit(numRows);

  // Se crea un JSON vacio que almacenará el LISTADO FINAL que hay que devolver.
  const result = {};

  // Se CUENTAN cuantos ANUNCIOS hay en la BD.
  if (includeTotal) {
    result.total = await Anuncio.count();
  }

  // Finalmente se EJECUTA el FIND y se guarda el resultado (JSON) en 'result'.
  /**
   * No se le pasa un CALLBACK al metodo EXEC por que estamos utilizando ASYNC/AWAIT.
   */
  result.rows = await query.exec();

  // Se COMPONE la RUTA donde se encuentran las imagenes de cada uno de los registros.
  const ruta = configAnuncios.imagesURLBasePath;
  result.rows.forEach(r => r.foto = r.foto ? path.join(ruta, r.foto) : null );

  // Si me dan un CALLBACK (cb) devuelvo los resultados por ahí
  if (cb) return cb(null, result); 
  // Si no, los devuelvo por la promesa del async (async está en la primera linea de esta función)
  return result; 
};

// Se CREA un MODELO a partir de su SCHEMA.
var Anuncio = mongoose.model('Anuncio', anuncioSchema);

/**
 * Se EXPORTA el MODELO para poder utilizarlo en otros ficheros.
 */
module.exports = Anuncio;
