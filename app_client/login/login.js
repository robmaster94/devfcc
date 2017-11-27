'use strict';

angular.module('myApp.login', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'loginCtrl'
        });
}])

    .controller('loginCtrl', function ($scope, $http, loginService) {
    
        $scope.login = function (user,pass) {
            var data = {
                user: user,
                pass: pass
            }
            var $promise = $http.post('/api/signin', data)
            $promise.then(function(data){
                alert(data)
            })
        }
        /*$scope.login = function (data, pass) {
            loginService.login(data, pass, $scope); //call login service
        };*/
    });
