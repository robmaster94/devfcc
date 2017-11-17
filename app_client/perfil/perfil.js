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
        var connected = loginService.islogged();
        connected.then(function (message) {    
            $http.post('perfil/perfil.php',{
                    user:message.data.user
            })
            .then(function (msg) {
                console.log(msg.data);
                $scope.names = msg.data;
            });
        })

        $scope.files = [];

        $scope.filesChanged = function (elm) {
            $scope.files = elm.files;
            $scope.$apply();
        };

        $scope.modMyPassword = function (data,id) {
            alert("ID user: "+id);
            var tipoDato = "password";
            $http.post('perfil/update.php',{
                tipo:tipoDato,
                pass:data,
                id: id
            })
                .then(function (msg) {
                    console.log(msg.data);
                    //$window.location.reload();
                    $scope.names = msg.data;
                });
        };

        $scope.modMyUsername = function (data,id) {
            alert("ID user: "+id);
            var tipoDato = "nombre";
            $http.post('perfil/update.php',{
                tipo:tipoDato,
                name:data,
                id: id
            })
                .then(function (msg) {
                    console.log(msg.data);
                    //$window.location.reload();           
                    $scope.names = msg.data;
                });
        };

        $scope.modMyAge = function (data,id) {
            alert("ID user: "+id);
            var tipoDato = "age";
            /*var fd = new FormData();
            fd.append('tipo', tipoDato);
            fd.append('age', data);*/
            $http.post('perfil/update.php',{
                tipo:tipoDato,
                age:data,
                id: id
            })
                .then(function (msg) {
                    console.log(msg.data);
                    //$window.location.reload();           
                    $scope.names = msg.data;
                });
        };

        $scope.modMySex = function (data,id) {
            alert("ID user: "+id);
            var tipoDato = "sex";
            /*var fd = new FormData();
            fd.append('tipo', tipoDato);
            fd.append('sex', data);*/
            $http.post('perfil/update.php',{
                tipo:tipoDato,
                sex:data,
                id:id
            })
                .then(function (msg) {
                    console.log(msg.data);
                    //$window.location.reload();
                    $scope.names = msg.data;
                });
        };

        $scope.modMyPic = function (data, id) {
            alert("ID user: "+id);
            var tipoDato = "pic";
            var fd = new FormData();
            fd.append('tipo', tipoDato);
            fd.append('pic', $scope.files[0]);
            fd.append('id',id);
            $http.post('perfil/update.php', fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .then(function (msg) {
                    console.log(msg.data);
                    $scope.names = msg.data;
                    //$window.location.reload();
                });

        };

        $scope.modMyCar = function (brand, model, id) {
            alert("ID user: "+id);
            var tipoDato = "car";
            var car_model = brand + " " + model;
            /*var fd = new FormData();
            alert("Coche: "+car_model);
            fd.append('tipo', tipoDato);
            fd.append('car_model',car_model);*/
            $http.post('perfil/update.php',{
                tipo:tipoDato,
                car_model:car_model,
                id: id
            })
                .then(function (msg) {
                    console.log(msg.data);
                    //$window.location.reload();
                    $scope.names = msg.data;
                });
        }
        
        $scope.modMyConnector = function (conn_type,id) {
            alert("ID user: "+id);
            var tipoDato = "connector";
/*            var fd = new FormData();
            fd.append('tipo', tipoDato);
            fd.append('connector', conn_type);*/
            $http.post('perfil/update.php',{
                tipo:tipoDato,
                connector:conn_type,
                id: id
            })
                .then(function (msg) {
                    console.log(msg.data);
                    //$window.location.reload();
                    $scope.names = msg.data;
                });
        }

        $scope.logout = function () {
            loginService.logout();
        }
    });
