define('module/angular/services/assetLoaderService', [
    'lib/rxjs.all.min'
    ], function (Rx){
        
        var module = angular.module('assetLoaderService', []);

        var sup;

        module.service('assetLoaderService', ['$q', '$http', '$filter',
        function($q, $http, $filter) {

            this.data = {};
            this.lastPath;
            sup = this;

            this.loadSave = function(path){
            	var defer = $q.defer();

            	this.lastPath = path;

            	//memoise
            	if(this.data[path]){
            		defer.resolve(sup.data[path]);
            		return defer.promise;
            	}

            	$http.get(path).success(function(data, status, headers, config) {
		          sup.data[path] = data;
		          defer.resolve(sup.data[path]);
		        }).error(function(data, status, headers, config) {
		          // called asynchronously if an error occurs
		          // or server returns response with an error status.
		        });

		        return defer.promise;
            }

            this.getLastLoaded = function(){
            	return this.data[this.lastPath][0];
            }

            return this;
        }]);

    return module;

});
