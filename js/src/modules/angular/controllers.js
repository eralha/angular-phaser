define('module/angular/controllers', [], function (){
    
    var module = angular.module('app.controllers', []);

    module.controller('gameController', ['$scope', '$filter', function($scope, $filter){
	    
	}]);

	module.controller('MainController', ['$scope', '$filter', 'uiService', '$rootScope', '$state', 'gameService',
		function($scope, $filter, uiService, $rootScope, $state, gameService){

		$scope.controlls = null;
		$scope.lastState;

		$rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
		   //assign the "from" parameter to something
		   $scope.lastState = (from.name != '') ?  from.name : 'game';
		});

		uiService.eventStream.subscribe(function (event) {
			if(event.$name == 'toggleProp'){
				if(event.propValue){
					$scope[event.proName] = event.propValue;
				}else{
					$scope[event.proName] = !$scope[event.proName];
				}
			}

			if(event.$name == 'stateBack'){
				$state.go($scope.lastState);
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

		$scope.changeGameState = function(state){
			gameService.setState(state);
		}

	}]);

	module.controller('roomController', ['$scope', '$filter', 'uiService', 'fireService', function($scope, $filter, uiService, fireService){

		$scope.roomList = fireService.getRooms();

		$scope.userCount = function(key){
			return fireService.getUserCount(key);
		}

		$scope.closeClick = function(proName){
			uiService.emit('stateBack');
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
