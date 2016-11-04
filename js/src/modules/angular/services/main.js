define('module/angular/services/main', [
    'lib/rxjs.all.min',
    'module/angular/services/roomService',
    'module/angular/services/assetLoaderService'
    ], function (Rx){
    
    var module = angular.module('app.services', ['roomService', 'assetLoaderService']);

    	module.service('uiService', ['$q', '$http', '$filter', 'gameService', function($q, $http, $filter, gameService) {

    		this.scale = 1;
    		this.minScale = 0.2;
    		this.maxScale = 5;

            var eventEmiter;
            this.eventStream = Rx.Observable.fromEventPattern(function add (h) {
                eventEmiter = h;
            });

            this.emit = function(event){
                var props = arguments[1] || {};
                    props.$name = event;

                eventEmiter(props);
            }

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
                if(game){
                    game.state.start(state);
                }
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
                    stage.moveAsset(asset, props, arguments[2]);
                }
            }

            return this;
        }]);

        
        module.service('rtcService', ['$q', '$http', '$filter', function($q, $http, $filter) {

            var socket;
            var sup = this;
            var roomCallbacks = {};

            this.joinRoom = function(room, callback){
                roomCallbacks[room] = callback;
                socket.emit('joinRoom', room);
            }

            this.leaveRoom = function(room, callback){
                roomCallbacks[room] = undefined;
                delete roomCallbacks[room];
                socket.emit('leaveRoom', room);
            }

            this.emitRoom = function(room, data){
                if(!room) { return; }
                data.room = room;
                socket.emit('emitRoom', data);
            }

            if(io){
                socket = io.connect('https://ersocketio.herokuapp.com/rtc');
                //socket = io.connect('http://localhost:3000/rtc');
                socket.on('msg', function (data) {
                    if(socket.id == data.id){
                        console.log('returning dont process msg from own socket');
                        return;
                    }

                    if(roomCallbacks[data.room]){
                        roomCallbacks[data.room](data);
                    }
                });

                /*
                this.joinRoom('room1');
                this.emitRoom('room1', {prop: '1'});
                */
                
            }

            return this;
        }]);


    return module;

});
