// Para EJECUTAR el código JS en 'modo estricto', que es menos 'flexible' con los errores de sintaxis de JS.
'use strict';

// Se carga el modulo SUPERTEST que permite realizar TEST e2e.
const request = require('supertest');
// Se carga UN METODO CONCRETO (expect) del modulo CHAI para poder utilizarlo.
const { expect } = require('chai');

/**
 * Para no tener que utilizar la BD 'REAL' de la APP havemos uso de
 * MOCKGOOSE que permite SIMULAR una BD para realización de test.
 * Es necesario CARGAR MOCKGOOSE por un lado y MONGOOSE por que
 * lo utiliza Mockgoose para su EJECUCIÓN.
 */
const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);

// Como los TEST e2e verifican el CORRECTO funcionamiento de un SITE es cecesario CARGAR la APP para INVOCARLA en los TEST.
const app = require('../app');

/**
 * Modulo DESCRIBE que define un CONJUNTO de TETS RELACIOANDOS entre si.
 */
describe('NodePop API Testing',function() {
    /**
     * Antes de la IMPLEMENTACION de los diferentes TEST
     * Se van a aplicar una serie de operaciones para la configuración y preparación
     * INICIAL de los TEST que aparecerán a continuación.
     * 
     * Como muchas de las OPERACIONES que se van a realizar son ASINCRONAS, utilizamos
     * ASYNC/AWAIT.
     */
    before(async function() {
        // INICIALIZAMOS la BD 'FAKE'.
        await mockgoose.prepareStorage();
        await mongoose.connect('mongodb://example.com/testingDB', { useMongoClient: true });

        // LIMPIAMOS los MODELOS y ESQUEMAS...¿¿¿¿¿???????
        mongoose.models = {};
        mongoose.modelsSchemas = {};

        // Cargamos mongooseFixtures para poder llamar al metodo que inicializa la BD.
        const mongooseFixtures = require('./mongoose.fixtures');
        // INICIALIZAMOS los datos de la BD 'FAKE'.
        await mongooseFixtures.initAnuncios();
    });

    /**
     * Conjunto de TEST que tienen en común que son PETICIONES GET a la API.
     */
    describe('GET /apiv1/anuncios', function() {

        /**
         *  TEST 1.1: El API debe devolver un STATUS 200 al USUARIO (Browser)
         *  si la PETICION a la API se realiza con EXITO.
         */
        it('Should return status 200.', function(done) {
            request(app)
                .get('/apiv1/anuncios')
                .end( function(error, response) {
                    expect(response.status).to.equal(200);
                    done();
                });
        });

        /**
         * TEST 1.2: El API debe devolver un OBJETO JSON como respuesta al USUARIO (Browser)
         * si la PETICION a la API se realiza con EXITO.
         */
        it('Should return an object', function(done) {
            request(app)
                .get('/apiv1/anuncios')
                .end(function(error, response){
                    expect(response.body).to.be.a('object');
                    done();
                });
        });

        /**
         * TEST 1.3: El API debe devolver una PROPIEDAD 'ok = TRUE' como respuesta al USUARIO (Browser)
         * si la PETICION a la API se realiza con EXITO.
         */
        it('Should return ok', function(done) {
            request(app)
                .get('/apiv1/anuncios')
                .end(function(error, response){
                    expect(response.body.ok).to.equal(true);
                    done();
                });
        });

        /**
         * TEST 1.4: El API debe devolver los ANUNCIOS como respuesta al USUARIO (Browser)
         * si la PETICION a la API se realiza con EXITO.
         */  
        it('Should return number of documents into DB', function(done) {
            request(app)
                .get('/apiv1/anuncios')
                .expect(200)
                .end(function(error, response){
                    expect(response.body.result.rows.length).to.equal(4);
                    done();
                });
        });
    });

    /**
     * Conjunto de TEST que tienen en común que son PETICIONES GET a la API/TAGS.
     */
    describe('GET /apiv1/anuncios/tags', function() {

        /**
         *  TEST 2.1: El API debe devolver un STATUS 200 al USUARIO (Browser)
         *  si la PETICION a la API se realiza con EXITO.
         */
        it('Should return status 200.', function(done) {
            request(app)
                .get('/apiv1/anuncios/tags')
                .end( function(error, response) {
                    expect(response.status).to.equal(200);
                    done();
                });
        });

        /**
         * TEST 2.2: El API debe devolver un OBJETO JSON como respuesta al USUARIO (Browser)
         * si la PETICION a la API se realiza con EXITO.
         */
        it('Should return an object', function(done) {
            request(app)
                .get('/apiv1/anuncios/tags')
                .end(function(error, response){
                    expect(response.body).to.be.a('object');
                    done();
                });
        });

        /**
         * TEST 2.3: El API debe devolver una PROPIEDAD 'ok = TRUE' como respuesta al USUARIO (Browser)
         * si la PETICION a la API se realiza con EXITO.
         */
        it('Should return ok', function(done) {
            request(app)
                .get('/apiv1/anuncios')
                .end(function(error, response){
                    expect(response.body.ok).to.equal(true);
                    done();
                });
        });

        /**
         * TEST 2.4: El API debe devolver los TAGS como respuesta al USUARIO (Browser)
         * si la PETICION a la API se realiza con EXITO.
         */  
        it('Should return number of documents into DB', function(done) {
            request(app)
                .get('/apiv1/anuncios/tags')
                .expect(200)
                .end(function(error, response){
                    expect(response.body.allowedTags.length).to.equal(4);
                    done();
                });
        });
    });
});