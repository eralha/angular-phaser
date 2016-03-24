define('module/game/playState', [
	'module/game/classes/camera'
	], function (stageController){
    
    var module = {};
    var count, cursors, background, stageGroup, uiService, spriteToDrag, stage;
    var stage;
    var drag = true;
    var dragSprite = false;
    var dragInfo = {};
    var mapSizeMaxCurrent, mapSizeMax = 3000;
    var wW, wH, cW, cH, bW, bH;
    var scaleFactor = 1;


    	module.preload = function(game){
    		game.load.image('MainBoard', 'assets/game_board.jpg');
    		game.load.image('TableBg', 'assets/table_bg.jpg');
    		game.load.image('token', 'assets/icons_03.png');
    	}

    	module.create = function(game){
    		var world = game.world;

    		stage = new stageController(game);
    		stage.addStageBackground('TableBg');

    		var board = stage.addToStage('MainBoard');
    		var token = stage.addToStage('token');

    		stage.centerObjectToStage(board);
    		stage.centerObjectToStage(token);

		    token.inputEnabled = true;
		    token.events.onInputDown.add(function(){
		    	dragSprite = true;
		    	spriteToDrag = {};
		    	spriteToDrag.obj = token;
		    	spriteToDrag.initX = token.x;
		    	spriteToDrag.initY = token.y;
		    	spriteToDrag.initCX = game.input.activePointer.clientX;
		    	spriteToDrag.initCY = game.input.activePointer.clientY;

	  	    	drag = false;

	  	    	console.log('drag', game.input.activePointer);
	  	    }, this);
	  	    token.events.onInputUp.add(function(){
	  	    	dragSprite = false;
	  	    	spriteToDrag = null;
	  	    	drag = true;

	  	    	console.log('drag off', game.input.activePointer);
	  	    }, this);


	  		uiService = game.$injector.get('uiService');

	  		//preparing ui state
	  		stage.fitWorldToScreen();
	  		stage.centerCamera();
    	}

    	module.update = function(game){

    		 //Move MAP on drag
	        if (dragSprite && spriteToDrag) {

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
