'use strict'

const express = require('express')
const User = require('../models/user')
const UserCtrl = require('../controllers/user')
const Telemetry = require('../models/telemetry')
const TelemetryCtrl = require('../controllers/telemetry')
const moment = require('moment')
const ocppRouter = express.Router()

var contador = 0;

ocppRouter.websocket('/wallbox-sn2197', (info, cb, next) => {

    cb(function (socket) {

        socket.onopen = function (event) {
            socket.send(JSON.stringify({
                "message": "Welcome to OCPP back-end server!"
            }))
        }

        socket.onmessage = function (evt) {
            console.log('Recibido: ' + evt.data)
            if (evt.data == JSON.stringify({})) {
                console.log('Mensaje JSON vacío')
                console.log('Heartbeat Message')
                socket.send(JSON.stringify({
                    "currentTime": moment()
                }))
            } else {
                try {
                    var msg = JSON.parse(evt.data)
                    if (msg.connectorId) {
                        if (msg.idTag) {
                            console.log('Start Transaction Message')
                            User.find({
                                idTag: msg.idTag
                            }, (err, message) => {
                                if (err) console.log('error')

                                console.log('User encontrado: ' + message)
                                if (message != '') {
                                    socket.send(JSON.stringify({
                                        "transactionId": 0,
                                        "idTagInfo": {
                                            "status": "Accepted",
                                            "expiryDate": msg.timestamp,
                                            "parentIdTag": "PARENT"
                                        }
                                    }))
                                } else {
                                    socket.send(JSON.stringify({
                                        "message": 'Usuario no autorizado'
                                    }))
                                }

                            })
                        } else if (msg.status) {
                            console.log('Status Notification Message')
                            socket.send(JSON.stringify({}))
                        } else if (msg.transactionId == 0 || msg.transactionId) {
                            console.log('Meter Values Message')
                            socket.send(JSON.stringify({}))
                            var res = TelemetryCtrl.crearRegistroTelemetria(msg)
                            if (res == 'Proceso registro OK') {
                                console.log('Telemetria registrada')
                            } else {
                                console.log('Error al guardar registro telemetria')
                            }
                        }
                    } else if (msg.transactionId) {
                        console.log('Stop Transaction Message')
                        User.find({
                            idTag: msg.idTag
                        }, (err, message) => {
                            if (err) console.log('error')
                            console.log('User encontrado: ' + message)
                            //var fecha = msg.timestamp
                            socket.send(JSON.stringify({
                                "idTagInfo": {
                                    "status": "Expired",
                                    "expiryDate": msg.timestamp,
                                    "parentIdTag": "PARENT"
                                }
                            }))
                        })
                    } else if (msg.idTag) {
                        console.log('idTag recibido. Cotejando en BBDD...')
                        if (msg.idTag == '11111111') {
                            User.find({
                                idTag: msg.idTag
                            }, (err, message) => {
                                if (err) console.log('error')
                                console.log('User encontrado: ' + message)
                                var fecha = moment().format()
                                socket.send(JSON.stringify({
                                    "idTagInfo": {
                                        "status": "Accepted",
                                        "expiryDate": moment(fecha).add(30, 'days'),
                                        "parentIdTag": "PARENT"
                                    }
                                }))
                            })
                        } else {
                            console.log('Invalid idTag')
                            socket.send(JSON.stringify({
                                message: 'Invalid idTag'
                            }))
                        }


                    } else if (msg.chargePointVendor) {
                        console.log('Boot Notification Message')
                        socket.send(JSON.stringify({
                            "status": "Accepted",
                            "currentTime": moment(),
                            "heartbeatInterval": 1200
                        }))
                    }
                } catch (e) {
                    console.log('Error parsing JSON object: ' +e)
                }
            }
        }
    })
})

module.exports = ocppRouter
