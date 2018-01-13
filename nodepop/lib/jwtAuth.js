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
     // Este módulo DEVUELVE un MIDDLEARE que, 
     // comprueba PRIMERO, que EXISTE un JWT, y DESPUES
     // comprueba que es VALIDO y por lo tanto el Usuario 'dueño' del JWT
     // tiene autorización para continuar. 
     return function(request, response, next) {
         // Podemos recoger el JWT desde varios lugares: QUERYSTRING, CABECERA
        const token = request.query.jwt || request.get('X-Access-Webtoken');

        // Si el JWT NO EXISTE...
        if(!token) {
            // Se crea un ERROR PERSONALIZADO
            const error = new Error('Unauthorized');
            error.status = 401;
            // Continua el Middleware de errores.
            next(error);
            // 'CORTAMOS' la ejecución.
            return;
        }

        // Si EXISTE JWT, se VERIFICA.
        jwt.verify(token, process.env.JWT_SECRET, (error, tokenDecoded) => {
            // Si se produce un ERROR en la VERIFICACIÓN...
            if(error) {
                // Poedmos PERSONALIZALO en función de su campo 'name'.
                if(error.name === 'TokenExpiredError') {
                    error.status = 401;
                    error.message = 'token invalid';
                }
                // Continua el Middleware de errores.
                next(error);
                // 'CORTAMOS' la ejecución.
                return;
            }

            // Se guarda la ID del Usuario.
            request.userId = tokenDecoded._id;
            // Se continua la ejecución con el siguiente Middleware.
            next();
        });
     };
 };