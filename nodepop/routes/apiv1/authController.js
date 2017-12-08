// Para EJECUTAR el código JS en 'modo estricto', que es menos 'flexible' con los errores de sintaxis de JS.
'use strict';

//Se cargan los MODULOS necesarios.
const jsonWebToken = require('jsonwebtoken');
const router = require('express').Router();
const Usuario = require('../../models/Usuario');

    /**
     * Método POST /authenticate realiza un LOGIN con JWT.
     * Comprueba las CREDENCIALES del usuario y si son CORRECTAS
     * CREA un JWT.
     * 
     * Para las operaciones ASINCRONAS con la BD utilizamos ASYNC/AWAIT.
     */
    router.post('/', async function (request, response, next) {
        // Recibimos del BODY los datos de AUTENTICACION.
        const email = request.body.email;
        const password = request.body.password;

        // Generamos el HASH del password recibido.
        const hashedPassword = Usuario.hashPassword(password);

        // Buscamos al Usuario que tenga esos parámetros en la BD.
        const user = await Usuario.findOne({ email: email, password: hashedPassword });

        // Si el usuario NO EXISTE...
        if(!user) {
            // Como es un API SÓLO hay que ENVIAR una RESPUESTA de CREDENCIALES ERRONEAS.
            response.json({ ok: false, error: 'Invalid Credentials' });
            // Terminamos ejecución.
            return;
        }

        /**
         * Si el usuario EXISTE y la PASSWORD coincide, 'construimos'
         * el JWT (Utilizamos la libreria 'jasonwebtoken') y lo ENVIAMOS al usuario.
         */

        /**
         * Para CREAR un JWT usamos el método 'sign()' del módulo 'jsonwebtoken' que recibe los parametros:
         * 1.- Lo que queremos incluir en el JWT: Objeto JSON con datos.
         * 2.- Secreto: Clave PRIVADA.
         * 3.- Tiempo de EXPIRACION.
         * 4.- CallBack.
         */
        jsonWebToken.sign({ _id: user._id }, process.env.JWT_SECRET, {expiresIn: 60}, (error, jwt) => {
            // Si se produce un ERROR al crear el TOKEN.
            if(error) {
                // En este punto podriamos PERSONALIZAR el ERROR (message, status, etc)
                // Seguimos en el middleware de errores.
                return next(error);
            }
            // Si todo OK, respondemos con el JWT.
            response.json({ ok: true, jwt: jwt});
        });
    });

/**
 * Se EXPORTA la RUTA para poder utilizarla en otro fichero (concretamente en app.js).
 */
 module.exports = router;