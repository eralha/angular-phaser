define('module/angular/controllers', [], function (){
    
    var module = angular.module('app.controllers', []);

    module.controller('gameController', ['$scope', '$filter', function($scope, $filter){
	    
	}]);

	module.controller('MainController', ['$scope', '$filter', 'uiService', function($scope, $filter, uiService){

		$scope.controlls = null;
	    
		$scope.toggleControlls = function(controlls){
			$scope.controlls = ($scope.controlls == controlls) ? null : controlls;
		}

		$scope.scaleUp = function(){
			uiService.scaleUp();
		}
		$scope.scaleDown = function(){
			uiService.scaleDown();
		}

	}]);

    return module;

});
