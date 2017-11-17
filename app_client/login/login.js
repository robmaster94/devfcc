'use strict';

angular.module('myApp.login', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'loginCtrl'
        });
}])

    .controller('loginCtrl', function ($scope, $http, loginService) {
        $scope.login = function (data, pass) {
            loginService.login(data, pass, $scope); //call login service
        };
    });
