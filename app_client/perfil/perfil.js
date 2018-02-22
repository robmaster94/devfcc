'use strict';

angular.module('myApp.perfil', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/perfil', {
            templateUrl: 'perfil/perfil.html',
            controller: 'perfilCtrl'
        });
}])

    .directive('fileInput', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {
                elm.bind('change', function () {
                    $parse(attrs.fileInput)
                        .assign(scope, elm[0].files)
                    scope.$apply()
                })
            }
        };
}])

    .controller('perfilCtrl', function ($scope, loginService, $http, $window) {

        $scope.names = [];
        $scope.obtenerPerfil = function(){
            var $promise = $http.get('/api/obtenerPerfil')
            $promise.then(function(msg) {
                //console.log(msg)
                $scope.names = msg.data
            })
        }

        $scope.files = [];

        $scope.filesChanged = function (elm) {
            $scope.files = elm.files;
            $scope.$apply();
        };

        $scope.modMyPassword = function (data, id) {
            //alert("ID user: " + id);
            var tipoDato = "password";
            $http.put('/api/modPerfil/'+id, {
                    tipo: tipoDato,
                    dato: data
                })
                .then(function (msg) {
                    //console.log(msg.data);
                    //$window.location.reload();
                    $scope.names = msg.data;
                });
        };

        $scope.modMyUsername = function (data, id) {
            //alert("ID user: " + id);
            var tipoDato = "nombre";
            $http.put('/api/modPerfil/'+id, {
                    tipo: tipoDato,
                    dato: data
                })
                .then(function (msg) {
                    //console.log(msg.data);
                    //$window.location.reload();           
                    $scope.names = msg.data;
                });
        };

        $scope.modMyAge = function (data, id) {
            //alert("ID user: " + id);
            var tipoDato = "age";
            $http.put('/api/modPerfil/'+id, {
                    tipo: tipoDato,
                    dato: data
                })
                .then(function (msg) {
                    //console.log(msg.data);
                    //$window.location.reload();           
                    $scope.names = msg.data;
                });
        };

        $scope.modMySex = function (data, id) {
           // alert("ID user: " + id);
            var tipoDato = "sex";
            $http.put('/api/modPerfil/'+id, {
                    tipo: tipoDato,
                    dato: data
                })
                .then(function (msg) {
                   // console.log(msg.data);
                    //$window.location.reload();
                    $scope.names = msg.data;
                });
        };

        $scope.modMyPic = function (data, id) {
            //alert("ID user: " + id);
            var tipoDato = "pic";
            var fd = new FormData();
            fd.append('tipo', tipoDato);
            fd.append('pic', $scope.files[0]);
            fd.append('id', id);
            $http.post('perfil/update.php', fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .then(function (msg) {
                    //console.log(msg.data);
                    $scope.names = msg.data;
                    //$window.location.reload();
                });

        };

        $scope.modMyCar = function (brand, model, id) {
           // alert("ID user: " + id);
            var tipoDato = "car";
            var car_model = brand+" "+model;
            $http.put('/api/modPerfil/'+id, {
                    tipo: tipoDato,
                    dato: car_model,
                })
                .then(function (msg) {
                    //console.log(msg.data);
                    //$window.location.reload();
                    $scope.names = msg.data;
                });
        }

        $scope.modMyConnector = function (conn_type, id) {
            //alert("ID user: " + id);
            var tipoDato = "connector";
            $http.put('/api/modPerfil/'+id, {
                    tipo: tipoDato,
                    dato: conn_type,
                })
                .then(function (msg) {
                    //console.log(msg.data);
                    //$window.location.reload();
                    $scope.names = msg.data;
                });
        }

        $scope.logout = function () {
            loginService.logout();
        }
    });
