define('module/angular/directives', [], function (){
    
    var module = angular.module('app.directives', []);


    	module.directive('gameRenderZone', ['$rootScope', '$injector', function($rootScope, $injector, uiService) {
		  return {
		    controller: 'gameController',
		    compile: function(e, a){
		        //console.log($(e).html(), arguments);
		        return function(scope, element, attrs) {

		          InitGameEngine(scope, $injector, $rootScope);

		        }
		    }
		  };
		}]);

		module.directive('roomList', ['$rootScope', '$injector', function($rootScope, $injector, uiService) {
		  return {
		  	restrict: 'EA',
		  	scope: {},
		  	templateUrl: 'views/room__list.html',
		    controller: 'roomController',
		    compile: function(e, a){
		        //console.log($(e).html(), arguments);
		        return function(scope, element, attrs) {

		          

		        }
		    }
		  };
		}]);

    return module;

});
