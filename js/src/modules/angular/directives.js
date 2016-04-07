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

    return module;

});
