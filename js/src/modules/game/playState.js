define('module/game/playState', [
	'module/game/classes/camera'
	], function (stageController){
    
    var module = {};
    var count, cursors, background, stageGroup, uiService, assetLoaderService, gameService, fireService, spriteToDrag, stage, gameConfig;
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

             /*
    		game.load.image('MainBoard', 'assets/game_board.jpg');
    		game.load.image('TableBg', 'assets/table_bg.jpg');
    		game.load.image('token', 'assets/icons_03.png');
            game.load.image('token2', 'assets/icons_03.png');
            */

            //Getting angular services
            assetLoaderService = game.$injector.get('assetLoaderService');
            uiService = game.$injector.get('uiService');
            gameService = game.$injector.get('gameService');
            fireService = game.$injector.get('fireService');

            gameConfig = assetLoaderService.getLastLoaded();

            var loadedObjs = {};

            game.load.image('TableBg', gameConfig.tableURL);

            //preload all the sprites we need for this table
            for(i in gameConfig.objects){

                var obj = gameConfig.objects[i];

                game.load.image(obj.objId, obj.url);

            }
    	}

    	module.create = function(game){
    		var world = game.world;

    		stage = new stageController(game);
    		stage.addStageBackground('TableBg');

            console.log(gameConfig);

            for(i in gameConfig.objects){

                var obj = gameConfig.objects[i];

                var asset = stage.addToStage(obj.objId, true);

                if((obj.x && obj.y) != 'center'){
                    asset.x = parseFloat(obj.x);
                    asset.y = parseFloat(obj.y);
                } 

                if(obj.x == 'center'){
                    stage.centerObjectToStageX(asset);
                }
                if(obj.y == 'center'){
                    stage.centerObjectToStageY(asset);
                }
            }

            /*
    		var board = stage.addToStage('MainBoard');
    		var token = stage.addToStage('token', true);
            var token2 = stage.addToStage('token2', true);

    		stage.centerObjectToStage(board);
    		stage.centerObjectToStage(token);
            */

	  		//Set this stage to ui service stage, we can use it on other places
	  		gameService.setStage(stage);

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

                //emit Drag
                spriteToDrag.emitDrag('dragMove');

                fireService.moveObj(spriteToDrag.obj);
	        }else{
	        	stage.update();
	        }

    		return;
    	}

        module.shutdown = function(game){
            console.log('shutdown state');
            stage.destroy();

            stage = null;
            uiService = null;
            gameService = null;
            fireService = null;
            gameConfig = null;
        }

    return module;

});
