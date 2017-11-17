'use strict';

angular.module('myApp.telemetry', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/telemetry', {
            templateUrl: 'telemetry/telemetry.html',
            controller: 'telemetryCtrl'
        });
}])

    .controller('telemetryCtrl', function ($scope, loginService, $window, $location) {

        $scope.conectarElectrolinera = function () {
/*
            var wsUri = "ws://10.162.254.65:8081/OCPPGateway15/CentralSystemService/";
            var wsUri = "ws://192.168.1.132:80/ChargerSn_2197";

            var output;
            var random = Math.floor(15000000 + (Math.random() * 5000000)); 

            var randomst = random.toString();

            var request = JSON.stringify([2, randomst, "Heartbeat", {}]);

            alert("Conectándose a la URI " + wsUri + " con petición " + request);

            function init() {
                output = document.getElementById("output");
                testWebSocket();
            }

            function testWebSocket() {
                websocket = new WebSocket(wsUri, ['ocpp1.6']);
                websocket.onopen = function (evt) {
                    onOpen(evt)
                };
                websocket.onclose = function (evt) {
                    onClose(evt)
                };
                websocket.onmessage = function (evt) {
                    onMessage(evt)
                };
                websocket.onerror = function (evt) {
                    onError(evt)
                };
            }

            function onOpen(evt) {
                writeToScreen(request);
                doSend(request);
            }

            function onClose(evt) {
                writeToScreen("BYE! :)");
            }

            function onMessage(evt) {
                //    writeToScreen('<span style="color: blue;"> RESPONSE: ' + JSON.parse(evt.data) + '</span>');
                writeToScreen('<span style="color: blue;"> RESPONSE: ' + evt.data + '</span>');
                websocket.close();
            }

            function onError(evt) {
                //   writeToScreen('<span style="color: red;"> ERROR: ' + JSON.parse(evt.data) + '</span>');
                writeToScreen('<span style="color: red;"> ERROR: ' + evt.data + '</span>');
            }

            function doSend(message) {
                writeToScreen("SENT: " + message);
                websocket.send(message);
            }

            function writeToScreen(message) {
                var pre = document.createElement("p");
                pre.className = "lead";
                pre.style.wordWrap = "break-word";
                pre.innerHTML = message;
                pruebas.appendChild(pre);
            }

            window.addEventListener("load", init, false);*/

            // Create WebSocket connection.
            const socket = new WebSocket('ws://192.168.1.132:8081/OCPPGateway15/',['ocpp1.6']);

            // Connection opened
            socket.addEventListener('open', function (event) {
                socket.send('Hello Server!');
            });

            // Listen for messages
            socket.addEventListener('message', function (event) {
                console.log('Message from server ', event.data);
            });
        }
        
        var connected = loginService.islogged();
        connected.then(function(message){
            console.log(message);
            $scope.rol = message.data.Rol;
            if(message.data.Rol == "user"){
                $location.path('/home');
                //$window.location.reload();
            }
        })

    });
