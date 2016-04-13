define('module/angular/services/saveLoader', [
    'lib/rxjs.all.min'
    ], function (Rx){
        
        var module = angular.module('saveLoader', []);

        module.service('saveLoader', ['$q', '$http', '$filter', 'gameService',
            function($q, $http, $filter, gameService) {

            this.loadSave = function(){
            	
            }

            return this;
        }]);

    return module;

});
