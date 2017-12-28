'use strict'

const express = require('express')
const User = require('../models/user')
const UserCtrl = require('../controllers/user')
const Telemetry = require('../models/telemetry')
const TelemetryCtrl = require('../controllers/telemetry')
const moment = require('moment')
const heartbeats = require('heartbeats')
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
                var id = msg.slice(0, 1)
                var uniqueId = msg.slice(1, 2)
                var action = msg.slice(2, 3)
                var payload = msg.slice(3, 4)
                console.log('id: ' + id)
                console.log('uniqueId: ' + uniqueId)
                console.log('action: ' + action)
                console.log('payload: ' + payload)
                switch (action.toString()) {
                    case "Heartbeat":
                        console.log('Mensaje JSON vacío')
                        console.log('Heartbeat Message')
                        response = JSON.stringify([
                            3,
                            uniqueId.toString(),
                            {
                                "currentTime": moment()
                            }
                        ])
                        socket.send(response)
                        response = null
                        break
                    case "StartTransaction":
                        console.log('Start Transaction Message')
                        User.find({
                            idTag: payload.idTag
                        }, (err, message) => {
                            if (err) console.log('error')

                            console.log('User encontrado: ' + message)
                            if (message != '') {
                                response = JSON.stringify([
                                    3,
                                    uniqueId.toString(),
                                    {
                                        transactionId: 0,
                                        idTagInfo: {
                                            status: "Accepted",
                                            expiryDate: msg.timestamp,
                                            parentIdTag: "PARENT"
                                        }
                                    }
                                ])
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
                        response = [
                            3,
                            uniqueId.toString(),
                            {}
                        ]
                        socket.send(JSON.stringify(response))
                        response = null
                        break
                    case "MeterValues":
                        console.log('Meter Values Message')
                        //socket.send(JSON.stringify({}))
                        var res = TelemetryCtrl.crearRegistroTelemetria(msg)
                        if (res == 'Proceso registro OK') {
                            console.log('Telemetria registrada')
                            response = [3, uniqueId.toString(), {}]
                        } else {
                            console.log('Error al guardar registro telemetria')
                            response = [4, uniqueId.toString(), 'InternalError', '', 'Error saving telemetry record']
                        }
                        
                        socket.send(JSON.stringify(response))
                        response = null
                        break
                    case "StopTransaction":
                        console.log('Stop Transaction Message')
                        User.find({
                            idTag: payload['0'].idTag
                        }, (err, message) => {
                            if (err) console.log('error')
                            console.log('User encontrado: ' + message)
                            response = JSON.stringify([
                                3,
                                uniqueId,
                                {
                                    idTagInfo: {
                                        status: "Expired",
                                        expiryDate: msg.timestamp,
                                        parentIdTag: "PARENT"
                                    }
                                }
                            ])
                            socket.send(response)
                            response = null
                        })
                        break
                    case "Authorize":
                        console.log('idTag recibido. Cotejando en BBDD...')
                        var idTag = payload['0'].idTag
                        //console.log(idTag)
                        if (idTag == '11111111') {
                            User.find({
                                idTag: idTag
                            }, (err, message) => {
                                if (err) console.log('error')

                                console.log('User encontrado: ' + message)
                                var fecha = moment().format()
                                response = JSON.stringify([
                                    3,
                                    uniqueId.toString(), 
                                    {
                                        idTagInfo: {
                                            status: "Accepted",
                                            expiryDate: moment(fecha).add(30, 'days'),
                                            parentIdTag: "PARENT"
                                        }
                                    }
                                ])
                                socket.send(response)
                            })
                            response = null
                        } else {
                            console.log('Invalid idTag')
                            response = [
                                4,
                                uniqueId,
                                'InternalError',
                                '',
                                'Invalid idTag'
                            ]
                            socket.send(JSON.stringify(response))
                            response = null
                        }

                        break
                    case "BootNotification":
                        console.log('Boot Notification Message')
                        response = JSON.stringify([
                            3, 
                            uniqueId.toString(), 
                            {
                                status: "Accepted",
                                currentTime: moment(),
                                heartbeatInterval: 1800 //30 minutos
                            }
                        ])
                        socket.send(response)
                        console.log('Respuesta enviada: '+response)
                        response = null
                        var heart = heartbeats.createHeart(50000); //latido cada 50 segundos
                        heart.createEvent(1, function(count,last){
                            socket.send(JSON.stringify({message:'50 segundos'}))
                            console.log('Latido con mensaje enviado!')
                        })
                        break

                }
            } catch (e) {
                console.log('Error parsing JSON object: ' + e)
            }
        }
        
        socket.onclose = function(){
            console.log('Cerrando conexion....')
        }
    })
})

ocppRouter.post('/wallbox-sn2197', function (req, res) {
    console.log('Cuerpo mensaje: '+req.body)
    var cuerpo = req.body
    for (var cosa in cuerpo){
        console.log(cosa+' is '+cuerpo[cosa])
    }
})

/*ocppRouter.get('/wallbox-sn2197', function(req,res){

})*/

module.exports = ocppRouter
