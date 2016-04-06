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

                console.log('scaleUp', this.scale);
    		}

    		this.scaleDown = function(){
    			this.scale -= 0.2;
    			if(this.scale <= this.minScale){
    				this.scale = this.minScale;
    			}

                console.log('scaleDown', this.scale);
    		}

            this.setScale = function(scale){
                this.scale = scale;
                if(this.scale <= this.minScale){
                    this.scale = this.minScale;
                }

                if(this.scale >= this.maxScale){
                    this.scale = this.maxScale;
                }
            }

            this.centerToScreen = function(){
                
            }

    		return this;

		}]);


        module.service('gameService', ['$q', '$http', '$filter', function($q, $http, $filter) {

            var game;

            this.setGame = function(_game){
                game = _game;
            }

            this.setState = function(state){
                game.state.start(state);
            }

            return this;
        }]);


        module.service('assetLoaderService', ['$q', '$http', '$filter', function($q, $http, $filter) {


            this.loadAssetFile = function(loadPath){
                var def = $q.defer();

                $http.get(loadPath).
                  success(function(data, status, headers, config) {

                      def.resolve(data);

                  }).error(function() {
                    def.reject("Error loading");
                  });;//end http

                def.promise;
            }


            return this;

        }]);

    return module;

});
