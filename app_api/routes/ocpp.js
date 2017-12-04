'use strict'

const express = require('express')
const User = require('../models/user')
const UserCtrl = require('../controllers/user')
const moment = require('moment')
const ocppRouter = express.Router()

var contador = 0;

ocppRouter.websocket('/wallbox-sn2197', (info, cb, next) => {

    cb(function (socket) {

        socket.onopen = function (event) {
            var msg = {
                message: 'Welcome to ocpp backend websocket!'
            }
            socket.send(JSON.stringify(msg))
        }

        socket.onmessage = function (evt) {
            console.log('Recibido: ' + evt.data)
            var msg = JSON.parse(evt.data)
            //socket.send('You sended '+evt.data)
            console.log('Mensaje jsoneado: ' + msg)
            if (msg.idTag) {
                console.log('idTag recibido. Cotejando en BBDD...')
                /*UserCtrl.chequearPrivilegios({
                    idTag: msg.idTag
                },(err,message) => {
                    console.log('Respuesta desde BBDD: '+message)
                    if (err) socket.send(JSON.stringify({error: err}))
                    socket.send(JSON.stringify(
                        {usuario: message}
                    ))
                })    */
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
                                "expiryDate": moment(fecha).add(30,'days'),
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


            } else {
                console.log('nada enviado, error')
            }
        }
    })
})

module.exports = ocppRouter
