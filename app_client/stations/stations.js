'use strict';

angular.module('myApp.stations', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/stations', {
            templateUrl: 'stations/stations.html',
            controller: 'stationsCtrl'
        });
}])

    .controller('stationsCtrl', function ($scope, $http, loginService, $window, ngDialog, $location) {

        var connected = loginService.islogged();
        connected.then(function(message){
            console.log(message);
            $scope.rol = message.data.Rol;
            if(message.data.Rol == "user"){
                $location.path('/home');
            }
        })

        $scope.showStations = function () {
            var $promise = $http.get('queries/listStations.php');
            $promise.then(function (message) {
                console.log(message);
                $scope.stations = message.data.Stations;
            })
        }

        $scope.addStation = function (name, city, address, masterpass, repmasterpass) {
            
            var $promise = $http.post('stations/insertStation.php',{
                name:name,
                city:city,
                address:address,
                masterpass:masterpass,
                repmasterpass:repmasterpass
            })

            $promise.then(function (d) {
                console.log(d);
                if (d.data.Stations) {
                    $scope.showAllStations = d.data.Stations;
                    $window.location.reload();
                } else {
                    alert('Error listing stations after adding new one');
                }
            })
        }

        $scope.panelLoginStation = function (name) {
            $scope.myJSONObject = {
                stationName: name
            };
            ngDialog.open({
                template: 'stations/loginForm.html',
                className: 'ngdialog-theme-default',
                data: $scope.myJSONObject
            });
        }

        $scope.loginStation = function (name, pass) {
            /*var fd = new FormData();
            fd.append('station', name);
            fd.append('masterpass', pass);*/
            
            var $promise = $http.post('stations/adminStation.php',{
                station:name,
                masterpass:pass
            });

            $promise.then(function (res) {
                console.log(res);
                if(!res.data.Error){
                    /* Aquí abriremos la nueva plantilla con información de la estación a administrar */
                    
                    alert('Conectado con éxito');
                    $scope.station = res.data;
                    ngDialog.open({
                        template: 'stations/templateStation.html',
                        className: 'ngdialog-theme-default',
                        data: $scope.station
                    });
                } else {
                    alert('Error: '+res.data.Error);
                }
                ngDialog.close("ngdialog1");
            })
        }
    });
