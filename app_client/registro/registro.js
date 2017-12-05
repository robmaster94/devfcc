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

        $scope.signUser = function (user, pass, name, surname, age, sex, rol, picUser) {
            if ($scope.files[0]) {
                //alert("Se enviará formData");
                var fd = new FormData();
                fd.append('user', user);
                fd.append('pass', pass);
                fd.append('name', name);
                fd.append('surname', surname);
                fd.append('age', age);
                fd.append('sex', sex);
                fd.append('rol', rol);
                fd.append('pic', $scope.files[0]);
                fd.append('tipo', "formData");

                $http.post('/api/signup', fd, {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    })
                    .success(function (d) {
                        console.log(d);
                        alert('Usuario creado correctamente');
                        $location.path('/login');
                        /*$window.location.reload();*/
                    })
                    .error(function (e) {
                        alert('Error: ' + e);
                    });
            } else {
                //alert("Se enviará objeto JSON");
                var $promise = $http.post('/api/signup' , {
                    user:user,
                    pass:pass,
                    name:name,
                    surname:surname,
                    age:age,
                    sex:sex,
                    rol:rol
                });
                
                $promise.then(function(data){
                    console.log(data)
                    $location.path('/telemetry')
                    $window.location.reload()
                })
            }

        }

        $scope.listStations = function () {
            var $promise = $http.get('queries/listStations.php');
            $promise.then(function (msg) {
                console.log(msg);
                $scope.stations = msg.data.Stations;
            })
        }

    });
