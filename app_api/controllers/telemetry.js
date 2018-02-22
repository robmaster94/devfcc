'use strict'

/*

    Funciones BBDD respecto a la telemetría --> OK cuando Wallbox realice las pruebas básicas OCPP
    Se harán las peticiones a la plataforma de Wallbox para obtener los datos de interés
    
        - Obtener todos los datos de telemetría.
        - Crear registro de telemetría.

*/

const Telemetry = require('../models/telemetry');

function crearRegistroTelemetria(req, res) {

    var value, unit, measurand, context, format, phase, location, timestamp
    var temp, temp2
    var temp3, temp4, temp5, temp6, temp7, temp8, temp9, temp10, temp11, temp12, temp13, temp14, temp15, temp16
    var temp30, temp31, temp32, temp33

    console.log('Telemetría recibida: ' + req.values)
    if (!req.values) console.log('Telemetría recibida: ' + req)

    var id_tipo_llamada = req.slice(0, 1)
    var id_llamada = req.slice(1, 2)
    var accion = req.slice(2, 3)
    var payload = req.slice(3, 4)
    console.log(id_tipo_llamada + ' ' + id_llamada + ' ' + accion + ' ' + payload)

    for (var v in payload['0']) {
        for (var i in payload['0'][v]) {
            for (var z in payload['0'][v][i]) {
                for (var y in payload['0'][v][i][z]) {
                    for (var w in payload['0'][v][i][z][y]) {
                        switch (w) {
                            case "value":
                                value = payload['0'][v][i][z][y]['value']
                                break
                            case "unit":
                                unit = payload['0'][v][i][z][y]['unit']
                                break
                            case "context":
                                context = payload['0'][v][i][z][y]['context']
                                break
                            case "format":
                                format = payload['0'][v][i][z][y]['format']
                                break
                            case "phase":
                                phase = payload['0'][v][i][z][y]['phase']
                                break
                            case "location":
                                location = payload['0'][v][i][z][y]['location']
                                break
                            case "measurand":
                                measurand = payload['0'][v][i][z][y]['measurand']
                                temp = value + unit
                                switch (measurand) {
                                    case "Voltage":
                                        temp3 = temp
                                        break
                                    case "Current.Offered":
                                        temp4 = temp
                                        break
                                    case "Power.Offered":
                                        temp5 = temp
                                        break
                                    case "Energy.Active.Export.Register":
                                        temp6 = temp
                                        break
                                    case "Energy.Active.Import.Register":
                                        temp7 = temp
                                        break
                                    case "Energy.Reactive.Export.Register":
                                        temp8 = temp
                                        break
                                    case "Energy.Reactive.Import.Register":
                                        temp9 = temp
                                        break
                                    case "Power.Active.Export":
                                        temp10 = temp
                                        break
                                    case "Power.Active.Import":
                                        temp11 = temp
                                        break
                                    case "Power.Reactive.Export":
                                        temp12 = temp
                                        break
                                    case "Power.Reactive.Import":
                                        temp13 = temp
                                        break
                                    case "Power.Factor":
                                        temp14 = temp
                                        break
                                    case "SoC":
                                        context = payload['0'][v][i][z][y]['context']
                                        if (context == 'Transaction.Begin') temp32 = value + unit
                                        else if (context == 'Transaction.End') temp33 = value + unit
                                        else continue
                                        break
                                }
                                break
                        }
                    }
                }
            }
            const telem = new Telemetry({
                voltage: temp3,
                current: temp4,
                curr_power: temp5,
                imp_ae: temp6,
                exp_ae: temp7,
                imp_re: temp8,
                exp_re: temp9,
                exp_ap: temp10,
                imp_ap: temp11,
                exp_rp: temp12,
                imp_rp: temp13,
                power_factor: temp14,
                //earth_wire_status: req.body.earth_wire_status,
                //station_status: temp16,
                ev_battery_start_value: temp32,
                ev_battery_final_value: temp33,
                connector_id: payload['0']['connectorId'],
                current_time_date: payload['0'][v][i]['timestamp']
            })

            console.log('Telemetria a registrar: ' + telem)

            telem.save(function (err) {
                if (err) return console.log('Error: ' + err)

                console.log('Registro guardado')
            })
        }

    }
    var res_final = 'Proceso registro OK'
    return res_final

}

function obtenerDatosTelemetria(req, res) {

    Telemetry.find({}, {
        "__v": 0,
        "_id": 0
    }).sort({
        "current_time_date": -1
    }).exec(function (err, data) {
        if (err) console.log('Error al obtener telemetria: ' + err)

        req.telemet = data
        console.log(req.telemet)

        res.status(200).json({
            Telemetria: req.telemet
        })

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
                }).sort({
                    "current_time_date": -1
                }).exec(function (err, data) {
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
    Telemetry.find({}).sort({
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
