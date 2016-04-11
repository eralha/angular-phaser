define('module/angular/controllers', [], function (){
    
    var module = angular.module('app.controllers', []);

    module.controller('gameController', ['$scope', '$filter', function($scope, $filter){
	    
	}]);

	module.controller('MainController', ['$scope', '$filter', 'uiService', function($scope, $filter, uiService){

		$scope.controlls = null;

		uiService.eventStream.subscribe(function (event) {
			if(event.$name == 'toggleProp'){
				if(event.propValue){
					$scope[event.proName] = event.propValue;
				}else{
					$scope[event.proName] = !$scope[event.proName];
				}
			}
		});

		$scope.toggleProp = function(proName){
			uiService.emit('toggleProp', {proName: 'showRoomList'});
		}
	    
		$scope.toggleControlls = function(controlls){
			$scope.controlls = ($scope.controlls == controlls) ? null : controlls;
		}

		$scope.scaleUp = function(){
			uiService.scaleUp();
		}
		$scope.scaleDown = function(){
			uiService.scaleDown();
		}
		$scope.centerCamera = function(){
			uiService.centerCamera();
		}

	}]);

	module.controller('roomController', ['$scope', '$filter', 'uiService', 'fireService', function($scope, $filter, uiService, fireService){

		$scope.roomList = fireService.getRooms();

		$scope.toggleProp = function(proName){
			uiService.emit('toggleProp', {proName: 'showRoomList'});
		}

		$scope.addRoom = function(){
			fireService.createRoom($scope.roomName);
		}

		$scope.joinRoom = function(room){
			fireService.joinRoom(room.$id);
		}

	}]);

    return module;

});
