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
        //var wsUri = "wss://devfcc.herokuapp.com/ocpp/wallbox-sn2197"
        var wsUri = "ws://localhost:6500/ocpp/wallbox-sn2197";
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
            //$timeout($scope.meterV, 60000)
        }

        $scope.authorize = function () {

            random = Math.floor(15000000 + (Math.random() * 5000000));

            randomst = random.toString();

            /*request = JSON.stringify({
                id: 2,
                uniqueId: randomst,
                action: "Authorize",
                payload: {
                    idTag: '11111111'
                }
            })*/
            
            request = JSON.stringify([2,randomst,"Authorize",{
                    idTag: '11111111'
                }])

            // Create WebSocket connection.
            socket = new WebSocket(wsUri, ['ocpp1.6', 'ocpp1.5']);

            // Connection opened
            socket.addEventListener('open', function (event) {
                socket.send(request);
            });

            // Listen for messages
            socket.addEventListener('message', function (event) {
                //console.log(event.data)
                var message = JSON.parse(event.data)
                //console.log(message)
                var id = message.slice(0,1)
                var uniqueId = message.slice(1,2)
                var payload = message.slice(2,3)
                //console.log(payload)
                if (id == '3') {
                    //alert('id no encontrado')
                    if (payload['0'].idTagInfo.status == 'Accepted') {
                        alert('Autorizado a cargar')
                    } else {
                        alert('No autorizado')
                    }
                } else {
                    console.log('Usuario con idTag inválido/no autorizado')
                }
            })
        }
        
        $scope.carga =function(){
            var $promise = $http.get('/api/obtUltimaCarga')
            $promise.then(function(data){
                $scope.ultCarga = data.data.Telemetry['0']
                console.log($scope.ultCarga)
                var expEnergyObt = data.data.Telemetry['0'].exp_ae
                console.log(expEnergyObt)
                $scope.expEnergy = Number(expEnergyObt.slice(0,2))
                $promise = $http.get('/api/precio')
                $promise.then(function(data2){
                    console.log(data2)
                    $scope.precio = data2.data.precio['0']
                    $scope.total = data2.data.precio['0'].kWh_price * $scope.expEnergy;
                })
            })
        } 

        $scope.actualizarPrecio = function(precio){
            console.log(precio)
            var $promise = $http.put('/api/precio/'+precio._id, precio)
            $promise.then(function(data){
                console.log(data)
            })
        }
        
        $scope.reset = function(){
            socket = new WebSocket(wsUri, ['ocpp1.6', 'ocpp1.5']);
            var msg = JSON.stringify([2, "124596", "Reset", {type: "Soft"}])
            // Create WebSocket connection.
            socket = new WebSocket(wsUri, ['ocpp1.6', 'ocpp1.5']);
            
            socket.addEventListener('open', function (event) {
                socket.send(msg)
            });
            

            // Listen for messages
            socket.addEventListener('message', function (event) {
                //console.log(event.data)
                var message = JSON.parse(event.data)
                //console.log(message)
                var id = message.slice(0,1)
                var uniqueId = message.slice(1,2)
                var payload = message.slice(2,3)
                //console.log(payload)
                if (id == '3') {
                    //alert('id no encontrado')
                    if (payload['0'].idTagInfo.status == 'Accepted') {
                        alert('Autorizado a cargar')
                    } else {
                        alert('No autorizado')
                    }
                } else {
                    console.log('Usuario con idTag inválido/no autorizado')
                }
            })
        }
        
    });
