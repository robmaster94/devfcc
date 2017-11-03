'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'homeCtrl'
  });
}])

.controller('homeCtrl', function($scope, loginService) {
	var connected=loginService.islogged();
			connected.then(function(msg){
				if(!msg.data){
                    $scope.it = false;
                }else{
                    $scope.it = true;
                }
            });
});

