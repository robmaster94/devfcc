'use strict';

angular.module('myApp.queries', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/queries', {
            templateUrl: 'queries/queries.html',
            controller: 'queriesCtrl'
        });
}])

    .controller('queriesCtrl', function ($scope, $http) {

        $scope.listStations = function () {
            var $promise = $http.get('queries/listStations.php');
            $promise.then(function (msg) {
                console.log(msg);
                $scope.stations = msg.data.Stations;
            })
        }

        $scope.doTelQuery = function (queryUser, start, end, typeQuery, station_id) {

            var startDate = moment(start).format(); /* Formato para la SQL */
            //var startDate2 = moment(start).locale('es').format('L'); /* Formato más cómodo y leíble para el usuario */
            var endDate = moment(end).format(); /* Formato para la SQL */

            if (station_id != null) {
                //fd.append('station_id', station_id);
                var $promise = $http.post('queries/query.php', {
                    query: queryUser,
                    start: startDate,
                    endDate: endDate,
                    station_id: station_id,
                    type: typeQuery
                });
            } else {
                var $promise = $http.post('queries/query.php', {
                    query: queryUser,
                    start: startDate,
                    end: endDate,
                    type: typeQuery
                });
            }

            $promise.then(function (d) {
                console.log(d);
                if (d.data.Telemetry) {
                    $scope.consultaCompleta = d.data.Telemetry;
                    $scope.exportToExcel = function () {
                        alasql("SELECT * INTO CSV('Consulta completa.csv',{headers:true}) FROM ?", [$scope.consultaCompleta]);
                    }
                }
                if (d.data.Valores) {
                    $scope.consultaUnicaVariada = d.data.Valores;
                    $scope.exportToExcel = function () {
                        alasql("SELECT * INTO CSV('" + queryUser + " - " + startDate2 + " to " + endDate2 + " -.csv',{headers:true}) FROM ?", [$scope.consultaUnicaVariada]);
                    }
                }
            })
        }

        $scope.doStatQuery = function (queryUser, typeQuery) {

            var $promise = $http.post('queries/query.php', {
                query: queryUser,
                type: typeQuery
            })

            $promise.then(function (d) {
                console.log(d);
                $scope.station = d.data;
            })

        }

        $scope.doCpQuery = function (queryUser, start, end, typeQuery) {

            var fd = new FormData();
            fd.append('query', queryUser);
            var startDate = moment(start).format();
            fd.append('start', startDate);
            var endDate = moment(end).format();
            fd.append('end', endDate);
            fd.append('type', typeQuery);

            var $promise = $http.post('queries/query.php', {
                query: queryUser,
                start: startDate,
                endDate: endDate,
                type: typeQuery
            })

            $promise.then(function (d) {
                console.log(d);
                $scope.chargePoint = d.data;
            })

        }

        $scope.exportLast = function () {
            var $promise = $http.get('queries/lastCharge.php');
            $promise.then(function (data) {

                console.log(data);
                $scope.lastCharge = data.data.Telemetry;
                alasql("SELECT * INTO CSV('Last Charge.csv',{headers:true}) FROM ?", [$scope.lastCharge]);

            })
        }

    });
