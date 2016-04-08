define('module/angular/services', [], function (){
    
    var module = angular.module('app.services', []);

    	module.service('uiService', ['$q', '$http', '$filter', 'gameService', function($q, $http, $filter, gameService) {

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

            this.centerCamera = function(){
                gameService.centerCamera();
            }

    		return this;

		}]);


        module.service('gameService', ['$q', '$http', '$filter', function($q, $http, $filter) {

            var game;
            var stage;
            this.spriteToDrag = null;

            this.setGame = function(_game){
                game = _game;
            }

            this.setState = function(state){
                game.state.start(state);
            }

            this.startObjDrag = function(spriteToDrag){
                this.spriteToDrag = spriteToDrag;
            }

            this.stopObjDrag = function(){
                this.spriteToDrag = null;
            }

            this.centerCamera = function(){
                if(stage){
                    stage.centerCamera();
                }
            }

            this.setStage = function(_stage){
                stage = _stage;
            }

            this.moveObj = function(asset, props){
                if(stage){
                    stage.moveAsset(asset, props);
                }
            }

            return this;
        }]);


        module.service('fireService', ['$q', '$http', '$filter', '$firebaseArray', 'fireConfig', '$firebaseObject', 'gameService',
            function($q, $http, $filter, $firebaseArray, fireConfig, $firebaseObject, gameService) {

            var sup = this;
            var uid = Math.random() * 1000;//need proper uid generator

            var pipeRef = new Firebase(fireConfig.dataPipe);
            var moveRef = new Firebase(fireConfig.objMovement);
                //remove movement data on disconnect
                moveRef.onDisconnect().remove();

            // download the data into a local object
            var movementLoaded = false;
            var movementPipe = $firebaseObject(moveRef);
            var movementWatchRef;

            //wait fot movement data load
            movementPipe.$loaded().then(function(){
                movementLoaded = true;
                //watch for changes in our movement reference
                movementWatchRef = movementPipe.$watch(sup.watchMovement);
            });

            this.moveObj = function(obj){
                if(!movementLoaded){ return; }

                movementPipe[obj.key] = {x: obj.x, y: obj.y, uid: uid};
                movementPipe.$save();
            }

            this.watchMovement = function(){
                angular.forEach(movementPipe, function(value, key) {
                    if(value.uid != uid){
                        gameService.moveObj(key, value);
                    }
                });
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
