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
        voltage: req.body.voltage,
        current: req.body.current,
        imp_ae: req.body.imp_ae,
        exp_ae: req.body.exp_ae,
        imp_re: req.body.imp_re,
        exp_re: req.body.exp_re,
        power_factor: req.body.power_factor,
        earth_wire_status: req.body.earth_wire_status,
        station_status: req.body.station_status,
        ev_battery_start_value: req.body.ev_battery_start_value,
        ev_battery_final_value: req.body.ev_battery_final_value,
        connector_id: req.body.connector_id
    })
    
    telem.save(function(err){
        if (err) return console.log('Error: '+err)
    })
    
    res.status(200).send({message: 'Registro telemetria guardado'})
}

function obtenerDatosTelemetria(req,res){
    res.status(200).send({message: 'Prueba obtener todos los registros de telemetria'})
}

module.exports = {
    crearRegistroTelemetria,
    obtenerDatosTelemetria
}