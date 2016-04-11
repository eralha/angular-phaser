define('module/angular/services', [
    'lib/rxjs.all.min'
    ], function (Rx){
    
    var module = angular.module('app.services', []);

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
            var uid = Math.round(Math.random() * 1000);//need proper uid generator

            var roomsRef = new Firebase(fireConfig.rooms);
            var roomList = $firebaseArray(roomsRef);
            var roomRef;//this ref will store a ref when the user joins a room
            var roomPipe;

            var moveRef;
                //remove movement data on disconnect
                //moveRef.onDisconnect().remove();

            // download the data into a local object
            var movementPipe;
            var movementWatchRef;

            //observe changes in room data
            var roomsPresenceRef = new Firebase(fireConfig.dataPipe+'/room');
            var roomsPresencePipe = $firebaseArray(roomsPresenceRef);

            //wait fot movement data load
            roomList.$loaded().then(function(){
                //Listen for room presence changes and update room list
                roomsPresenceRef.on("value", function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        var key = childSnapshot.key();
                        var numUsers = childSnapshot.numChildren();

                        if(roomList.length > 0){
                            var index = roomList.$indexFor(key);
                            roomList[index].numUsers = numUsers;
                        }
                    });
                });
            });

            this.moveObj = function(obj){
                if(!movementPipe){ return; }

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

            this.getRooms = function(){
                return roomList;
            }

            this.joinRoom = function(key){
                //we need to check if we are connected to a room and do some cleanup
                if(roomRef){
                    var index = roomList.$indexFor(roomRef.parent().key());
                        roomList[index].numUsers --;
                    roomRef.remove();
                }
                if(movementWatchRef){
                    movementWatchRef();
                }
                if(movementPipe){
                    movementPipe.$destroy();
                }

                moveRef = new Firebase(fireConfig.objMovement+'/'+key);
                roomRef = new Firebase(fireConfig.dataPipe+'/room/'+key+'/'+uid);
                roomRef.onDisconnect().remove();

                roomPipe = $firebaseObject(roomRef);
                movementPipe = $firebaseObject(moveRef);

                //add presence to room
                roomPipe.status = 'online'
                roomPipe.$save();

                //wait fot movement data load
                movementPipe.$loaded().then(function(){
                    //watch for changes in our movement reference
                    movementWatchRef = movementPipe.$watch(sup.watchMovement);
                });

                //return promise for movementpipe
                return movementPipe.$loaded();
            }

            this.createRoom = function(roomName){
                if(!roomName){ return; }
                var room = {};
                    room.name = roomName;
                    room.uid = uid;

                roomList.$add(room).then(function(ref) {
                  //waiting fro movement pipe connected
                  sup.joinRoom(ref.key()).then(function(data){
                    console.log(data, 'Here we should clean room when this connection disconnects');
                  });
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
