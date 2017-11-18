'use strict'

const mongoose = require('mongoose')
const app = require('./app')
const config = require('./config')
var http = require("http")
//const ocppCtrl = require('./app_api/controllers/ocpp')

mongoose.connect(config.db, (err,res) => {
  if(err) {
    return console.log(`Error al conectar a la base de datos: ${err}`)
  }
  console.log('Conexion a la base de datos establecida!')

  app.listen(config.port, () => {
    console.log(`API REST corriendo en http://localhost:${config.port}`)
    var WebSocketServer = require("ws").Server
    var port = 8050

    var server = http.createServer(app)
    server.listen(config.port)

    console.log("http server listening on %d", port)

    var wss = new WebSocketServer({
        server: server
    })
    console.log("websocket server created")

    wss.on("connection", function (ws) {
        var id = setInterval(function () {
            ws.send(JSON.stringify(new Date()), function () {})
        }, 1000)

        console.log("websocket connection open")

        ws.on("close", function () {
            console.log("websocket connection close")
            clearInterval(id)
        })
    })
  })
})
