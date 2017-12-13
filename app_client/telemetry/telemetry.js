'use strict';

angular.module('myApp.telemetry', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/telemetry', {
            templateUrl: 'telemetry/telemetry.html',
            controller: 'telemetryCtrl'
        });
}])

    .controller('telemetryCtrl', function ($scope, loginService, $window, $location, $timeout, $http) {

        //var wsUri = "ws://10.162.254.65:8081/OCPPGateway15/CentralSystemService/EFACECES1";
        var wsUri = "wss://devfcc.herokuapp.com/ocpp/wallbox-sn2197"
        //var wsUri = "ws://localhost:6500/ocpp/wallbox-sn2197";
        var output, random, randomst, request
        var socket

        var connected = loginService.islogged();
        connected.then(function (message) {
            //console.log(message);
            $scope.rol = message.data.Rol;
            if (message.data.Rol == "user") {
                $location.path('/home');
                //$window.location.reload();
            }
        })

        $scope.heartbeat = function () {

            output = document.getElementById('output')
            random = Math.floor(15000000 + (Math.random() * 5000000));

            randomst = random.toString();

            request = JSON.stringify({
                id: 2,
                uniqueId: randomst,
                action: "Heartbeat",
                payload: {}
            })

            // Create WebSocket connection.
            socket = new WebSocket(wsUri, ['ocpp1.6', 'ocpp1.5']);

            // Connection opened
            socket.addEventListener('open', function (event) {
                socket.send(request);
            });

            // Listen for messages
            socket.addEventListener('message', function (event) {
               // console.log(JSON.parse(event.data));
                var message = JSON.parse(event.data);
                var pre = document.getElementById('res')
                pre.className = "lead";
                pre.style.wordWrap = "break-word";

                if (message.id == 3) {
                    pre.innerHTML = 'Disponible'
                } else {
                    pre.innerHTML = 'No disponible'
                }
                output.appendChild(pre)
            });
        }

        $scope.meterV = function () {
            $scope.meterValues = null
            var $promise = $http.get('/api/telemetry')
            $promise.then(function (data) {
                //console.log(data)
                $scope.meterValues = data.data.Telemetria
                $location.path('/telemetry')
            })
            $timeout($scope.meterV, 5000)
        }

        $scope.authorize = function () {

            random = Math.floor(15000000 + (Math.random() * 5000000));

            randomst = random.toString();

            request = JSON.stringify({
                id: 2,
                uniqueId: randomst,
                action: "Authorize",
                payload: {
                    idTag: '11111111'
                }
            })

            // Create WebSocket connection.
            socket = new WebSocket(wsUri, ['ocpp1.6', 'ocpp1.5']);

            // Connection opened
            socket.addEventListener('open', function (event) {
                socket.send(request);
            });

            // Listen for messages
            socket.addEventListener('message', function (event) {
                console.log(event.data)
                var message = JSON.parse(event.data)
                if (message.message != 'Invalid idTag') {
                    alert('id no encontrado')
                    if (message.id == 3) {
                        $scope.autority = 'Autorizado a cargar'
                    } else {
                        $scope.autority = 'No autorizado'
                    }
                } else {
                    $scope.autority = 'Usuario con idTag inválido/no autorizado'
                }
            })
        }


    });
