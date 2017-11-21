'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'myApp.faq',
  'myApp.home',
  'myApp.registro',
  'myApp.login',
  'myApp.perfil',
  'myApp.queries',
  'myApp.stations',
  'myApp.ocpp',
  'myApp.telemetry',
  'myApp.logout',
  'xeditable',
  'angularUtils.directives.dirPagination',
  'ngRoute',
  'ngStorage',
  'ngDialog'
])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  //$locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/home'});
}])

.controller('NavBarCtrl', function ($scope, loginService) {
    
    var connected=loginService.islogged();
			connected.then(function(msg){
                //console.log(msg);
				if(!msg.data){
                    $scope.items = [
                        {'ref': '/registro', 'name':'Sign up' , 'needAuthentication': false},
                        {'ref': '/login', 'name':'Login' , 'needAuthentication': false},
                        {'ref': '/faq', 'name':'FAQ' , 'needAuthentication': false},
                        {'ref': '/perfil', 'name':'My profile' , 'needAuthentication': true},
                        {'ref': '/queries', 'name':'Queries' , 'needAuthentication': true},
                        {'ref': '/stations', 'name':'Stations' , 'needAuthentication': true},
                        {'ref': '/ocpp', 'name':'OCPP' , 'needAuthentication': false},
                        {'ref': '/telemetry', 'name':'Telemetry' , 'needAuthentication': true},
                        {'ref': '/logout', 'name':'Logout' , 'needAuthentication': true}
                        ];
                } else{
                    if (msg.data.rol == "user"){
                        $scope.items = [       
                            {'ref': '/registro', 'name':'Sign up' , 'needAuthentication': true},
                            {'ref': '/login', 'name':'Login' , 'needAuthentication': true},
                            {'ref': '/faq', 'name':'FAQ' , 'needAuthentication': false},
                            {'ref': '/perfil', 'name':'My profile' , 'needAuthentication': false},
                            {'ref': '/queries', 'name':'Queries' , 'needAuthentication': false},
                        ];
                    }
                    if (msg.data.rol == "admin"){
                        $scope.items = [       
                            {'ref': '/registro', 'name':'Sign up' , 'needAuthentication': true},
                            {'ref': '/login', 'name':'Login' , 'needAuthentication': true},
                            {'ref': '/faq', 'name':'FAQ' , 'needAuthentication': false},
                            {'ref': '/stations', 'name':'Stations' , 'needAuthentication': false},
                            {'ref': '/ocpp', 'name':'OCPP' , 'needAuthentication': false},
                            {'ref': '/perfil', 'name':'My profile' , 'needAuthentication': false},
                            {'ref': '/telemetry', 'name':'Telemetry' , 'needAuthentication': false},
                            {'ref': '/logout', 'name':'Logout' , 'needAuthentication': false}
                        ];
                    }
/*                 $scope.items = [
                        {'ref': '!/registro', 'name':'Sign up' , 'needAuthentication': true},
                        {'ref': '!/login', 'name':'Login' , 'needAuthentication': true},
                        {'ref': '!/faq', 'name':'FAQ' , 'needAuthentication': false},                     
                        {'ref': '!/perfil', 'name':'My profile' , 'needAuthentication': false, rol: "user"},
                        {'ref': '!/queries', 'name':'Queries' , 'needAuthentication': false, rol: "user"},
                        {'ref': '!/stations', 'name':'Stations' , 'needAuthentication': false, rol: "admin"},
                        {'ref': '!/telemetry', 'name':'Telemetry' , 'needAuthentication': false, rol: "admin"},
                        {'ref': '!/logout', 'name':'Logout' , 'needAuthentication': false, rol: "admin"}
                        ];*/
                }
			});

})

.run(function($rootScope, $location, loginService){
    var routespermission=['/stations', '/perfil', '/queries', '/telemetry','/logout'];
	$rootScope.$on('$routeChangeStart', function(){
		if( routespermission.indexOf($location.path()) !=-1)
		{
			var connected=loginService.islogged();
			connected.then(function(msg){
				if(!msg.data) $location.path('/login');
			});
		}
	});
});
