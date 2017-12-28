'use strict';

angular.module('myApp.queries', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/queries', {
            templateUrl: 'queries/queries.html',
            controller: 'queriesCtrl'
        });
}])

    .controller('queriesCtrl', function ($scope, $http) {

        /*$scope.listStations = function () {
            var $promise = $http.get('queries/listStations.php');
            $promise.then(function (msg) {
                console.log(msg);
                $scope.stations = msg.data.Stations;
            })
        }*/

        $scope.doTelQuery = function (queryUser, start, end, typeQuery) {
            
            $scope.consultaCompleta = null
            $scope.consultaUnicaVariada = null

            var startDate = moment(start).format(); /* Formato para la SQL */
            var startDate2 = moment(start).locale('es').format('L'); /* Formato más cómodo y leíble para el usuario */
            var endDate = moment(end).format(); /* Formato para la SQL */
            var endDate2 = moment(end).locale('es').format('L');

            var $promise = $http.post('/api/telemetry', {
                query: queryUser,
                start: startDate,
                end: endDate,
                type: typeQuery
            })

            $promise.then(function (d) {
                //console.log(d);
                if (d.data.Telemetry) {
                    $scope.consultaCompleta = d.data.Telemetry;
                    $scope.exportToExcel = function () {
                        alasql("SELECT * INTO CSV('Consulta completa - " + startDate2 + " to " + endDate2 + " -.csv',{headers:true}) FROM ?", [d.data.Telemetry]);
                    }
                }
                if (d.data.Valores) {
                    $scope.consultaUnicaVariada = d.data.Valores;
                    $scope.exportToExcel = function () {
                        alasql("SELECT * INTO CSV('" + queryUser + " - " + startDate2 + " to " + endDate2 + " -.csv',{headers:true}) FROM ?", [d.data.Valores]);
                    }
                }
            })
        }

        $scope.doCpQuery = function (queryUser, start, end, typeQuery) {

            var $promise = $http.post('queries/query.php', {
                query: queryUser,
                start: startDate,
                endDate: endDate,
                type: typeQuery
            })

            $promise.then(function (d) {
                //console.log(d);
                $scope.chargePoint = d.data;
            })

        }

        $scope.exportLast = function () {
            var $promise = $http.get('/api/obtUltimaCarga')
            $promise.then(function (data) {
                //console.log(data)
                $scope.lastCharge = data.data.Telemetry
                alasql("SELECT * INTO CSV('Last Charge.csv',{headers:true}) FROM ?", [$scope.lastCharge])
            })
        }

        $scope.clearFilter = function () {
            $scope.consultaCompleta = null
            $scope.consultaUnicaVariada = null
            $scope.dataQuery = null
            $scope.startDate = null
            $scope.finalDate = null
        }

    });
