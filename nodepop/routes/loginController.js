/**
 * OTRA FORMA de 'escribir' un ROUTER es en forma de CONTROLADOR.
 * No CARGAMOS los MODULOS como la hacemos en los ROUTER 'clasicos'.
 * En este caso vamos a crear una CLASE.
 */

 //
 'use strict';
/**
 * Clase LoginController:
 * Incluye el METODO 'index(request, response, next)' que se incluiria como FUNCION
 * en un ROUTER 'clasico'. 
 */
 class LoginController {

    /**
     * Método index():
     * Cuando alguien realice una petición a este CONTROLADOR queremos que este
     * hage un RENDER de una página de LOGIN.
     */
    index(request, response, next) {
        // Mostramos al usuario una página de LOGIN para la introducción de credenciales.
        response.render('login');
    }
 }
/**
 * Aunque podemos EXPORTAR la CLASE COMPLETA, es mejor EXPORTAR UNA INSTANCIA.
 * module.exports = LoginController();
 */
 module.exports = new LoginController();