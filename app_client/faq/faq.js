'use strict';

angular.module('myApp.faq', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/faq', {
    templateUrl: 'faq/faq.html',
    controller: 'faqCtrl'
  });
}])

.controller('faqCtrl', function($scope) {
/*    var initValuesF = function() {        
        $scope.mustShow1 = false;
        $scope.mustShow2 = false;
        $scope.mustShow3 = false;
        $scope.mustShow4 = false;
    }();*/
   
});