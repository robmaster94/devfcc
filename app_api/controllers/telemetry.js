'use strict'

/*

    Funciones BBDD respecto a la telemetría --> OK cuando Wallbox realice las pruebas básicas OCPP
    Se harán las peticiones a la plataforma de Wallbox para obtener los datos de interés
    
        - Obtener todos los datos de telemetría.
        - Crear registro de telemetría.

*/

const Telemetry = require('../models/telemetry');

function crearRegistroTelemetria(req, res) {
    const telem = new Telemetry({
        //nombre campo = req.body.nombreparametro
        voltage: req.body.voltage,
        current: req.body.current,
        curr_power: req.body.curr_power,
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

    telem.save(function (err) {
        if (err) return console.log('Error: ' + err)
    })

    res.status(200).send({
        message: 'Registro telemetria guardado'
    })
}

function obtenerDatosTelemetria(req, res) {
    res.status(200).send({
        message: 'Prueba obtener todos los registros de telemetria'
    })
}

function obtenerDatosConsultaTelemetria(req, res) {

    console.log('consulta telemetria')
    var tipo = req.body.type
    var parametros
    switch (tipo) {
        case "telemetry":
            var query = req.body.query
            console.log('query: ' + query)
            if (query != "all") {
                switch (query) {
                    case "voltage":
                        parametros = {
                            "voltage": 1,
                            "_id": 0
                        }
                        break
                    case "current":
                        parametros = {
                            "current": 1,
                            "_id": 0
                        }
                        break
                    case "curr_power":
                        parametros = {
                            "curr_power": 1,
                            "_id": 0
                        }
                        break
                    case "imp_ae":
                        parametros = {
                            "imp_ae": 1,
                            "_id": 0
                        }
                        break
                    case "exp_ae":
                        parametros = {
                            "exp_ae": 1,
                            "_id": 0
                        }
                        break
                    case "imp_re":
                        parametros = {
                            "imp_re": 1,
                            "_id": 0
                        }
                        break
                    case "exp_re":
                        parametros = {
                            "exp_re": 1,
                            "_id": 0
                        }
                        break
                    case "power_factor":
                        parametros = {
                            "power_factor": 1,
                            "_id": 0
                        }
                        break
                    case "earth_wire_status":
                        parametros = {
                            "earth_wire_status": 1,
                            "_id": 0
                        }
                        break
                    case "station_status":
                        parametros = {
                            "station_status": 1,
                            "_id": 0
                        }
                        break
                    case "ev_battery_start_value":
                        parametros = {
                            "ev_battery_start_value": 1,
                            "_id": 0
                        }
                        break
                    case "ev_battery_final_value":
                        parametros = {
                            "ev_battery_final_value": 1,
                            "_id": 0
                        }
                        break
                }

                Telemetry.find({
                    "current_time_date": {
                        "$gt": req.body.start,
                        "$lt": req.body.end
                    }
                }, parametros, function (err, data) {
                    if (err) console.log('Error al obtener telemetria: ' + err)

                    //console.log(data)
                    req.consulta = data
                    console.log(req.consulta)

                    res.status(200).json({
                        Valores: req.consulta,
                        campo: query
                    })
                })

            } else {
                console.log(req.body.start)
                console.log(req.body.end)
                Telemetry.find({
                        "current_time_date": {
                            "$gt": req.body.start,
                            "$lt": req.body.end
                        }
                    }, {
                        "__v": 0,
                        "_id": 0
                    },
                    function (err, data) {
                        if (err) console.log('Error al obtener telemetria: ' + err)

                        //console.log(data)
                        req.consulta = data
                        console.log(req.consulta)
                        if (req.consulta != '') {
                            res.status(200).json({
                                Telemetry: req.consulta
                            })
                        } else {
                            res.status(200).json({
                                Telemetry: ''
                            })
                        }


                    })
            }
            break
    }

}

function obtenerUltimaCarga(req, res) {
    console.log('Obteniendo ultima carga...')
    Telemetry.find({}, {
        "__v": 0,
        "_id": 0
    }).sort({
        $natural: -1
    }).limit(1).exec(function (err, data) {
        if (err) console.log('Error al obtener ultima carga: ' + err)

        console.log('correcto')
        req.ultimacarga = data
        console.log(req.ultimacarga)

        res.status(200).json({
            Telemetry: req.ultimacarga
        })
    })
}

module.exports = {
    crearRegistroTelemetria,
    obtenerDatosTelemetria,
    obtenerDatosConsultaTelemetria,
    obtenerUltimaCarga
}
