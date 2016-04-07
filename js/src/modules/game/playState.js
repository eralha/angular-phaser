define('module/game/playState', [
	'module/game/classes/camera'
	], function (stageController){
    
    var module = {};
    var count, cursors, background, stageGroup, uiService, gameService, spriteToDrag, stage;
    var stage;
    var drag = true;
    var dragSprite = false;
    var dragInfo = {};
    var mapSizeMaxCurrent, mapSizeMax = 3000;
    var wW, wH, cW, cH, bW, bH;
    var scaleFactor = 1;


    	module.preload = function(game){
    		/*
    		 * TODO: Create angular service that will load a .json file containing all the assets, paths and positions
    		 */
    		game.load.image('MainBoard', 'assets/game_board.jpg');
    		game.load.image('TableBg', 'assets/table_bg.jpg');
    		game.load.image('token', 'assets/icons_03.png');
    	}

    	module.create = function(game){
    		var world = game.world;

    		stage = new stageController(game);
    		stage.addStageBackground('TableBg');

    		var board = stage.addToStage('MainBoard');
    		var token = stage.addToStage('token', true);

    		stage.centerObjectToStage(board);
    		stage.centerObjectToStage(token);

    		//Getting angular services
	  		uiService = game.$injector.get('uiService');
	  		gameService = game.$injector.get('gameService');

	  		//Set this stage to ui service stage, we can use it on other places
	  		uiService.setStage(stage);

	  		//preparing ui state
	  		stage.fitWorldToScreen();
	  		stage.centerCamera();
    	}

    	module.update = function(game){

    		 //Move MAP on drag
	        if (gameService.spriteToDrag) {

	        	var spriteToDrag = gameService.spriteToDrag;

	            //move current dragging object arround, we need to take into account the scale off the group
	            var xDif = (game.input.activePointer.clientX - spriteToDrag.initCX);
	            var yDif = (game.input.activePointer.clientY - spriteToDrag.initCY);

	                xDif = (xDif / uiService.scale);
	                yDif = (yDif / uiService.scale);

	            spriteToDrag.obj.x = spriteToDrag.initX + (xDif);
	            spriteToDrag.obj.y = spriteToDrag.initY + (yDif);

	        }else{
	        	stage.update();
	        }

    		return;
    	}

    return module;

});
