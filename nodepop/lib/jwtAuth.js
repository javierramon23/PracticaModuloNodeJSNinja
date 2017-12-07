/**
 * MIDDLEWARE de CONTROL que permite comprobar si un usuario AUTENTICADO
 * tiene PERMISO para ACCEDER a un determinado LUGAR.
 * 
 * Aunque sería posible definirlo dentro del propio fichero 'app.js'
 * como se va a REUTILIZAR lo vamos a crear como un MODULO independiente.
 */

 // Para EJECUTAR el código JS en 'modo estricto', que es menos 'flexible' con los errores de sintaxis de JS.
'use strict';

// Se cargan los MODULOS necesarios para la app.
const jwt = require('jsonwebtoken');

/**
 * Lo EXPORTAMOS para poder utilizarlo en otros ficheros.
 */
 module.exports = function() {
     // Este módulo DEVUELVE un MIDDLEARE que si no hay ususairo responde con error
     // Recogemos el JWT y 
     return function(request, response, next) {
         // Podemos recoger el JWT desde varios lugares: QUERYSTRING, CABECERA
        const token = request.query.jwt || request.get('X-Access-Webtoken');

        if(!token) {
            //
            const error = new Error('Unauthorized');
            error.status = 401;
            next(error);
            return;
        }

        // Si hay JWT lo verificamos.
        jwt.verify(token, process.env.JWT_SECRET, (error, tokenDecoded) => {
            if(error) {
                return next(error);
            }
            request.userId = tokenDecoded._id;
            next();
        });
     };
 };