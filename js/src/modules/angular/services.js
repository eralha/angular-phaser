define('module/angular/services', [], function (){
    
    var module = angular.module('app.services', []);

    	module.service('uiService', ['$q', '$http', '$filter', function($q, $http, $filter) {

    		this.scale = 1;
    		this.minScale = 0.2;
    		this.maxScale = 5;

    		this.scaleUp = function(){
    			this.scale += 0.2;
    			if(this.scale >= this.maxScale){
    				this.scale = this.maxScale;
    			}
    		}

    		this.scaleDown = function(){
    			this.scale -= 0.2;
    			if(this.scale <= this.minScale){
    				this.scale = this.minScale;
    			}
    		}

    		return this;

		}]);

    return module;

});
