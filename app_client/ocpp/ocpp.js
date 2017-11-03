'use strict';

angular.module('myApp.ocpp', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/ocpp', {
            templateUrl: 'ocpp/ocpp.html',
            controller: 'ocppCtrl'
        });
}])

    .controller('ocppCtrl', function ($scope) {
        /*    var initValuesF = function() {        
                $scope.mustShow1 = false;
                $scope.mustShow2 = false;
                $scope.mustShow3 = false;
                $scope.mustShow4 = false;
            }();*/

        $scope.connectServer = function () {
            $scope.msg = "...";
            alert("correct");

            var wsUri = new WebSocket('ws://192.168.1.130:9030/app/ocpp/wallbox-sn2197');

            //var wsUri = "ws://localhost:8080";
            var output;

            function init() {
                output = document.getElementById("output");
                testWebSocket();
            }

            function testWebSocket() {

                websocket = new WebSocket(wsUri);

                websocket.onopen = onOpen;

                websocket.onclose = onClose;

                websocket.onmessage = onMessage;

                websocket.onerror = onError;

            }

            function onOpen(evt) {
                writeToScreen("CONECTADO");
                doSend("WebSocket funciona");
            }

            function onClose(evt) {
                writeToScreen("DESCONECTADO");
            }

            function onMessage(evt) {
                writeToScreen('<span style="color: blue;">RESPUESTA: ' + evt.data + '</span>');
                websocket.close();
            }

            function onError(evt) {
                writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
            }

            function doSend(message) {
                writeToScreen("ENVIADO: " + message);
                websocket.send(message);
            }

            function writeToScreen(message) {
                var pre = document.createElement("p");
                pre.style.wordWrap = "break-word";
                pre.innerHTML = message;
                output.appendChild(pre);
            }

            window.addEventListener("load", init, false);

            /*for(var key in connection){
                alert("Clave: "+key+", valor: "+connection[key]);
            }*/


        }

    });
