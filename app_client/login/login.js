'use strict';

angular.module('myApp.login', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'loginCtrl'
        });
}])

    .controller('loginCtrl', function ($scope, $http, loginService) {
    
        $scope.recv = '';
    
        var socket = new WebSocket('ws://localhost:6500/ocpp/wallbox-sn2197')
        
        $scope.login = function (user,pass) {
            var data = {
                user: user,
                pass: pass
            }
            //var data2 = JSON.stringify(data)
            var $promise = $http.post('/api/signin', data)
            $promise.then(function(data){
                console.log(data)
            })
        }
        
        $scope.send = function(datos){
            
            var msg = {
                idTag: datos
            }
            
            var msg2 = JSON.stringify(msg)
            $scope.msg2 = JSON.stringify(msg)           
            
            socket.send(msg2)
            
            $scope.datoss = null;
            
            socket.onmessage = function(evt){
                $scope.recv = evt.data
            }
            
        }
        
    });
