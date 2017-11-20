'use strict'

const express = require('express')
//const auth = require('../middlewares/auth')
const ocppCtrl = require('../controllers/ocpp')
const ocppRouter = express.Router()

/*
  Creo otro express.Router() para crear un servidor WebSocket en un módulo aparte
  La ruta será /ocpp/wallbox-sn2197, siendo ocpp el express.Router()
*/

//ocpp.get('/wallbox-sn2197', ocppCtrl.createWebSocketServer)

ocppRouter.websocket('/wallbox-sn2197' , (info,cb,next) => {
    cb(function(socket){
        socket.send('connected!')
    })
})

module.exports = ocppRouter
