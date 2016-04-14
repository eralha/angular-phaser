define('module/angular/services/roomService', [
    'module/angular/services/assetLoaderService',
    'lib/rxjs.all.min'
    ], function (Rx){
        
        var module = angular.module('roomService', ['assetLoaderService']);

        module.service('roomService', ['$q', '$http', '$filter', '$firebaseArray', 'fireConfig', '$firebaseObject', 'gameService', 'assetLoaderService',
            function($q, $http, $filter, $firebaseArray, fireConfig, $firebaseObject, gameService, assetLoaderService) {

            //stores user presence for rooms
            this.roomUserCount = {};

            var sup = this;
            var uid = Math.round(Math.random() * 1000);//need proper uid generator
            //location config
            var roomPresenceLoc = 'roomPresence';

            var currRoomKey;

            var roomsRef = new Firebase(fireConfig.rooms);
            var roomList = $firebaseArray(roomsRef);
            var roomRef;//this ref will store a ref when the user joins a room
            var roomPipe;

            var moveRef;
            var movementPipe;
            var movementWatchRef;

            //observe changes in room data
            var roomsPresenceRef = new Firebase(fireConfig.dataPipe+'/'+roomPresenceLoc);
            //This pipe will trigger scope changes
            var roomsPresencePipe = $firebaseArray(roomsPresenceRef);

                //wait fot roomList data load
                roomList.$loaded().then(function(){
                    sup.watchRoomPresence();
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

            this.leaveRoom = function(){
                currRoomKey = null;

                if(roomRef){
                    roomRef.remove();
                }
                if(movementWatchRef){
                    movementWatchRef();
                }
                if(movementPipe){
                    movementPipe.$destroy();
                }
            }

            this.joinRoom = function(key){
                //we need to check if we are connected to a room and do some cleanup
                if(currRoomKey){
                    this.leaveRoom();
                }

                currRoomKey = key;

                moveRef = new Firebase(fireConfig.objMovement+'/'+key);
                roomRef = new Firebase(fireConfig.dataPipe+'/'+roomPresenceLoc+'/'+key+'/'+uid);

                //remove presence of this user from the room presence location
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
                    room.gameData = assetLoaderService.getLastLoaded();

                roomList.$add(room).then(function(ref) {
                  //when this user disconnects from server delete current room
                  new Firebase(fireConfig.objMovement+'/'+ref.key()).onDisconnect().remove();
                  new Firebase(fireConfig.rooms+'/'+ref.key()).onDisconnect().remove();
                  new Firebase(fireConfig.dataPipe+'/'+roomPresenceLoc+'/'+ref.key()).onDisconnect().remove();

                  sup.joinRoom(ref.key());
                });
            }

            this.watchRoomPresence = function(){
                //Listen for room presence changes and update room list
                roomsPresenceRef.on("value", function(snapshot) {
                    sup.roomUserCount = {};

                    snapshot.forEach(function(childSnapshot) {
                        var key = childSnapshot.key();
                        var numUsers = childSnapshot.numChildren();

                        sup.roomUserCount[key] = numUsers;
                    });

                    //Check if we are sitting on a non existing room and if so, leave it
                    if(currRoomKey && !sup.roomUserCount.hasOwnProperty(currRoomKey)){
                        sup.leaveRoom();
                    }
                });
            }

            this.getUserCount = function(key){
                return this.roomUserCount[key] || 0;
            }

            return this;
        }]);

    return module;

});
