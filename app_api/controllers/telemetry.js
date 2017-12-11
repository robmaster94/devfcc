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
    for (var v in req.values) {
        timestamp = req.values[v].timestamp
        for (var i in req.values[v].values) {
            for (var z in req.values[v].values[i]) {
                //console.log(z)
                switch (z) {
                    case "value":
                        value = req.values[v].values[i].value
                        //temp = value
                        //console.log(value)
                        //json["value"] = value
                        break
                    case "unit":
                        unit = req.values[v].values[i].unit
                        //temp2 = unit
                        //console.log(unit)
                        //json["unit"] = unit
                        break
                    case "context":
                        context = req.values[v].values[i].context
                        if (context == 'Transaction.Begin') temp32 = value + unit
                        else if (context == 'Transaction.End') temp33 = value + unit
                        else continue
                        break
                    case "format":
                        format = req.values[v].values[i].format
                        //console.log(format)
                        //json["format"] = format
                        //temp5 = format
                        break
                    case "phase":
                        phase = req.values[v].values[i].phase
                        //console.log(phase)
                        //json["phase"] = phase
                        break
                    case "location":
                        location = req.values[v].values[i].location
                        temp31 = location
                        //console.log(location)
                        //json["location"] = location
                        break
                    case "measurand":
                        measurand = req.values[v].values[i].measurand
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
                            case "Power.Factor":
                                temp14 = temp
                                break
                            case "SoC":
                                temp16 = temp
                                break
                        }
                        break
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
            station_status: temp16,
            ev_battery_start_value: temp32,
            ev_battery_final_value: temp33,
            connector_id: req.connectorId,
            current_time_date: timestamp
        })

        console.log(telem)

        telem.save(function (err) {
            if (err) return console.log('Error: ' + err)

            console.log('Registro OK')
        })
    }
    var res_final = 'Proceso registro OK'
    return res_final

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
