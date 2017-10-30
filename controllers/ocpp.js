'use strict'

exports.createWebSocketServer = function (req,res) {
    //console.log('Función OCPP')
    //return res.status(200).send({message: 'Prueba ocppCtrl'})
    //res.send({message: 'Prueba ocpp'})
    var Server = require('ws').Server;
    var port = process.env.PORT || 3050;
    var ws = new Server({port: port});
    var contador = 0;

    ws.on('connection', function(w){

      w.on('message', function(msg){
        console.log('message from client, msg: '+msg);
        contador++
        w.send(`Received! You sended the message ${contador} times`)
      })

      w.on('close', function() {
        console.log('closing connection');
      })

      w.on('error', function(){
    	console.log('Error');
      })

      w.on('open', function(msg){
        console.log("Mensaje: "+msg);
    	console.log('Conectado al servidor '+Server);
      })

    })

    if(ws){
      // res.status(200).send({message:`Servidor WebSocket ${ws} correctamente encendido`})
      console.log('WebSocket Server is up')
    }
}
