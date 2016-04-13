define('module/angular/services/firebase', [
    'lib/rxjs.all.min'
    ], function (Rx){
        
        var module = angular.module('saveLoader', []);

        module.service('saveLoader', ['$q', '$http', '$filter', 'gameService',
            function($q, $http, $filter, gameService) {


            return this;
        }]);

    return module;

});
