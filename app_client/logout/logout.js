'use strict';

angular.module('myApp.logout', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/logout', {
            templateUrl: 'logout/logout.html',
            controller: 'logoutCtrl'
        });
}])

    .controller('logoutCtrl', function ($scope, $http, loginService) {
        $scope.logout = function () {
            loginService.logout();
        };
    });
