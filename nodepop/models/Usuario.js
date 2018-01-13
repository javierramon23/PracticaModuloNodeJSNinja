/**
 * Este fichero define un MODELO de DATOS para los USUARIOS que maneja la APP.
 */
// Para EJECUTAR el código JS en 'modo estricto', que es menos 'flexible' con los errores de sintaxis de JS.
'use strict';

/**
 * Se cargan los MODULOS necesarios para la app.
 */
const mongoose = require('mongoose');
const hash = require('hash.js');

/**
 * Se define un SCHEMA para los USUARIOS.
 * Un SCHEMA es la ESTRUCTURA de DATOS que deben tener los USUARIOS en la BD.
 * Podemos verlo como la TABLA de una BD RELACIONAL.
 */
const usuarioSchema = mongoose.Schema({
    nombre: { type: String, index: true },
    email: { type: String, unique: true },
    password: String
});

/**
 * Metodo ESTATICO.
 * Que se encarga de generar un HASH para la contraseña del usuario.
 */
usuarioSchema.statics.hashPassword = function(plainPassword) {
    return hash.sha256().update(plainPassword).digest('hex');
};

// Se CREA un MODELO a partir de su SCHEMA.
var Usuario = mongoose.model('Usuario', usuarioSchema);

/**
 * Se EXPORTA el MODELO para poder utilizarlo en otros ficheros.
 */
module.exports = Usuario; 