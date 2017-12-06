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

    switch (tipo) {
        case "telemetry":
            var query = req.body.query
            var datos
            console.log('query: ' + query)
            if (query != "all") {

                switch (query) {
                    case "voltage":
                        Telemetry.find({}, {
                            "voltage": 1,
                            "_id": 0
                        }, function (err, data) {
                            if (err) console.log('Error al obtener telemetria: ' + err)

                            //console.log(data)
                            req.consulta = data
                            console.log(req.consulta)

                            res.status(200).json({
                                Valores: req.consulta,
                                campo: query
                            })
                        })
                }

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

    /*Telemetry.find({
        fechaInicial: req.body.start,
        fechaFinal: req.body.end,
        query: req.body.query,
        tipo: ,
        current_time_date: {

        }
    })*/

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
