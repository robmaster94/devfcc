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

    var response

    cb(function (socket) {

        socket.onopen = function (event) {
            socket.send(JSON.stringify({
                "message": "Welcome to OCPP back-end server!"
            }))
        }

        socket.onmessage = function (evt) {
            console.log('Recibido: ' + evt.data)
            var msg
            try {
                msg = JSON.parse(evt.data)
                console.log(msg)
                /*console.log(recv.payload)
                console.log(recv.id)
                console.log(recv.uniqueId)
                console.log(recv.action)*/

                switch (msg.action) {
                    case "Heartbeat":
                        console.log('Mensaje JSON vacío')
                        console.log('Heartbeat Message')
                        response = JSON.stringify({
                            id: 3,
                            uniqueId: msg.uniqueId,
                            payload: {
                                "currentTime": moment()
                            }
                        })
                        socket.send(response)
                        response = null
                        break
                    case "StartTransaction":
                        console.log('Start Transaction Message')
                        User.find({
                            idTag: msg.payload.idTag
                        }, (err, message) => {
                            if (err) console.log('error')

                            console.log('User encontrado: ' + message)
                            if (message != '') {
                                response = JSON.stringify({
                                    id: 3,
                                    uniqueId: msg.uniqueId,
                                    payload: {
                                        transactionId: 0,
                                        idTagInfo: {
                                            status: "Accepted",
                                            expiryDate: msg.timestamp,
                                            parentIdTag: "PARENT"
                                        }
                                    }
                                })
                            } else {
                                socket.send(JSON.stringify({
                                    "message": 'Usuario no autorizado'
                                }))
                            }
                        })
                        response = null
                        break
                    case "StatusNotification":
                        console.log('Status Notification Message')
                        response = {
                            id: 3,
                            uniqueId: msg.uniqueId,
                            payload: {}
                        }
                        socket.send(response)
                        response = null
                        break
                    case "MeterValues":
                        console.log('Meter Values Message')
                        //socket.send(JSON.stringify({}))
                        var res = TelemetryCtrl.crearRegistroTelemetria(msg)
                        if (res == 'Proceso registro OK') {
                            console.log('Telemetria registrada')
                        } else {
                            console.log('Error al guardar registro telemetria')
                        }
                        response = JSON.stringify({
                            id: 3,
                            uniqueId: msg.uniqueId,
                            payload: {}
                        })
                        socket.send(response)
                        response = null
                        break
                    case "StopTransaction":
                        console.log('Stop Transaction Message')
                        User.find({
                            idTag: msg.payload.idTag
                        }, (err, message) => {
                            if (err) console.log('error')
                            console.log('User encontrado: ' + message)
                            response = {
                                id: 3,
                                uniqueId: msg.uniqueId,
                                payload: {
                                    idTagInfo: {
                                        status: "Expired",
                                        expiryDate: msg.timestamp,
                                        parentIdTag: "PARENT"
                                    }
                                }
                            }
                            socket.send(JSON.stringify(response))
                            response = null
                        })
                        break
                    case "Authorize":
                        console.log('idTag recibido. Cotejando en BBDD...')
                        if (msg.payload.idTag == '11111111') {
                            User.find({
                                idTag: msg.payload.idTag
                            }, (err, message) => {
                                if (err) console.log('error')

                                console.log('User encontrado: ' + message)
                                var fecha = moment().format()
                                response = {
                                    id: 3,
                                    uniqueId: msg.uniqueId,
                                    payload: {
                                        idTagInfo: {
                                            status: "Accepted",
                                            expiryDate: moment(fecha).add(30, 'days'),
                                            parentIdTag: "PARENT"
                                        }
                                    }
                                }
                            })
                            socket.send(JSON.stringify(response))
                            response = null
                        } else {
                            console.log('Invalid idTag')
                            response = {
                                id: 4,
                                uniqueId: msg.uniqueId,
                                errorCode: 'InternalError',
                                errorDescription: '',
                                errorDetails: 'Invalid idTag'
                            }
                            socket.send(JSON.stringify(response))
                            response = null
                        }

                        break
                    case "BootNotification":
                        console.log('Boot Notification Message')

                        response = JSON.stringify({
                            id: 3,
                            uniqueId: msg.uniqueId,
                            payload: {
                                status: "Accepted",
                                currentTime: moment(),
                                heartbeatInterval: 30
                            }
                        })
                        socket.send(response)
                        response = null
                        break

                }
            } catch (e) {
                console.log('Error parsing JSON object: ' + e)
            }
        }
    })
})
module.exports = ocppRouter
