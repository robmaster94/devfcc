'use strict'

//const ip = require('ip')
//var app = require('./../../app')
var http = require("http")
var express = require("express")
var app = express()

exports.createWebSocketServer = function (req, res) {
    var WebSocketServer = require("ws").Server
    var port = 8050

    var server = http.createServer(app)
    server.listen(port)

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
}
