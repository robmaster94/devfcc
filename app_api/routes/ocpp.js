'use strict'

const express = require('express')
const auth = require('../middlewares/auth')
const User = require('../models/user')
const telemetryCtrl = require('../controllers/telemetry')
const chargesBillCtrl = require('../controllers/chargesbill')
const moment = require('moment')
const heartbeats = require('heartbeats')
const ocppRouter = express.Router()

var connections = []; //Used to manage charge point websocket connections.

ocppRouter.get('/oc_api/telemetry', /*auth.chequearSesion,*/ telemetryCtrl.obtenerDatosTelemetria)
ocppRouter.post('/oc_api/telemetry', /*auth.chequearSesion,*/ telemetryCtrl.obtenerDatosConsultaTelemetria)
ocppRouter.post('/oc_api/createTelemetry', telemetryCtrl.crearRegistroTelemetria)
ocppRouter.get('/oc_api/obtUltimaCarga', /*auth.chequearSesion,*/ telemetryCtrl.obtenerUltimaCarga)

ocppRouter.get('/oc_api/precio', /*auth.chequearSesion, /*auth.requerirRol("admin"),*/ chargesBillCtrl.obtenerPrecioCarga)
ocppRouter.put('/oc_api/precio/:priceId', /*auth.chequearSesion, /*auth.requerirRol("admin"), */chargesBillCtrl.actualizarPrecio)

/*ocppRouter.get('/wallbox-sn2197', function (req, res) {
    //console.log('Cuerpo peticion: ' + req.body)
    
    //res.status(200).send({message: "Hola que tal"})
    
    console.log('Electrolinera conectada al webservice metodo GET')
    
    res.status(200).send(JSON.stringify([2,"123456","Reset", {}]))
})

ocppRouter.post('/wallbox-sn2197', function (req, res) {

    /*console.log('Cuerpo mensaje servicio: ' + req)
    //var cuerpo = req.body
    for (var cosa in req) {
        console.log(cosa + ' is ' + req[cosa])
    }
    
    console.log('Electrolinera conectada al webservice metodo POST')
    
})*/

ocppRouter.websocket('/wallbox-sn2197', (info, cb, next) => {

    var response
    var array = []
    var heart = heartbeats.createHeart(500000); //latido cada 50 segundos
/*    function heartbeat() {
        this.isAlive = true
    }*/
    
    var cpOrigin = info.origin
    console.log('CP connected from '+cpOrigin)
    
    connections.push(cpOrigin)
    cpOrigin = ''
    
    console.log('Active connections: \n')
    for (var con in connections){
        console.log('Client from '+con)
    }

    cb(function (socket) {

        /*function noop() {}

        for (var cosa in socket) {
            console.log(cosa + ' is ' + socket[cosa])
        }*/

        /*mensaje = JSON.stringify([2, "124596", "Reset", {}])
        socket.send(mensaje)
        console.log('Mensaje enviado!')
        socket.onmessage = function (evt) {
            console.log('Recibido: ' + evt.data)
            //socket.send(JSON.stringify([3,"124596",{status: "Accepted"}]))
        }*/

        /*const interval = setInterval(function ping() {
            socket.clients.forEach(function each(ws) {
                if (ws.isAlive === false) return ws.terminate()

                ws.isAlive = false
                ws.ping(noop)
            });
        }, 30000)*/

        socket.onopen = function (event) {
            socket.send(JSON.stringify({
                "message": "Welcome to OCPP back-end server!"
            }))
        }

        socket.on('connection', function (ws) {
            console.log('Evento conexion still-alive')
            var sendHeartbeats = require('ws-heartbeats')(ws)
            /*ws.isAlive = true;
            ws.on('pong', heartbeat)*/
            sendHeartbeats(ws,30,30)            
        })

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
                        console.log('idTag: '+payload['0'].idTag)
                        User.find({
                            idTag: payload['0'].idTag
                        }, (err, message) => {
                            if (err) console.log('error')

                            console.log(message)
                            if (message) {
                                console.log('User encontrado: ' + message)
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
                                socket.send(response)
                            } else {
                                socket.send(JSON.stringify([4, uniqueId.toString(), "InternalError","", "No autorizado"]))
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
                        var res = telemetryCtrl.crearRegistroTelemetria(msg)
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
                        heart.kill()
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
                        console.log('Respuesta enviada: ' + response)
                        response = null
                        heart = heartbeats.createHeart(50000); //latido cada 50 segundos
                        heart.createEvent(1, function (count, last) {
                            socket.send(JSON.stringify("ping"))
                            console.log('Latido con mensaje enviado!')
                            //heart.kill()
                        })
                        break

                }
            } catch (e) {
                console.log('Error parsing JSON object: ' + e)
            }
        }

        socket.onclose = function () {
            console.log('Cerrando conexion....')
            for (var s in socket){
                console.log(socket[s])
            }
            console.log('Origen socket: '+socket.origin)
        }
    })
})

module.exports = ocppRouter
