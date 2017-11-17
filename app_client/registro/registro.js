'use strict';

angular.module('myApp.registro', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/registro', {
            templateUrl: 'registro/registro.html',
            controller: 'registroCtrl'
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

    .controller('registroCtrl', function ($scope, $http, $window, $location) {

        $scope.files = [];

        $scope.filesChanged = function (elm) {
            $scope.files = elm.files;
            $scope.$apply();
        };

        $scope.signUser = function (user, pass, reppass, name, surname, age, sex, picUser, rol, favStation, brand, model, conn_type) {
            var fd = new FormData();
            fd.append('user', user);
            fd.append('pass', pass);
            fd.append('reppass', reppass);
            fd.append('name', name);
            fd.append('surname', surname);
            fd.append('age', age);
            fd.append('sex', sex);
            fd.append('picUser', $scope.files[0]);
            fd.append('rol',rol);
            fd.append('favStation', favStation);
            fd.append('brand', brand);
            fd.append('model', model);
            fd.append('conn_type', conn_type);

            $http.post('registro/insertUser.php', fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function (d) {
                    console.log(d);
                    alert('Usuario creado correctamente');
                    $location.path('/login');
                    $window.location.reload();
                })
                .error(function (e) {
                    alert('Error: ' + e);
                });
        }
        
        $scope.listStations = function () {
            var $promise = $http.get('queries/listStations.php');
            $promise.then(function (msg) {
                console.log(msg);
                $scope.stations = msg.data.Stations;
            })
        } 
        
    });
