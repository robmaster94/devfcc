'use strict'

/*

    Funciones BBDD respecto a la telemetría --> OK cuando Wallbox realice las pruebas básicas OCPP
    Se harán las peticiones a la plataforma de Wallbox para obtener los datos de interés
    
        - Obtener todos los datos de telemetría.
        - Crear registro de telemetría.

*/

const Telemetry = require('../models/telemetry');

function crearRegistroTelemetria(req,res){
    const telem = new Telemetry({
        //nombre campo = req.body.nombreparametro
    })
    res.status(200).send({message: 'Prueba crear registro de telemetria'})
}

function obtenerDatosTelemetria(req,res){
    res.status(200).send({message: 'Prueba obtener todos los registros de telemetria'})
}

module.exports = {
    crearRegistroTelemetria,
    obtenerDatosTelemetria
}