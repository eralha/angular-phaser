define('module/game/playState', [], function (){
    
    var module = {};
    var count, cursors, background, stageGroup, uiService;
    var drag = true;
    var dragInfo = {};
    var mapSizeMaxCurrent, mapSizeMax = 3000;
    var wW, wH, cW, cH, bW, bH;
    var scaleFactor = 1;


    	module.preload = function(game){
    		game.load.image('MainBoard', 'assets/game_board.jpg');
    		game.load.image('TableBg', 'assets/table_bg.jpg');
    	}

    	module.create = function(game){
    		var world = game.world;

    		stageGroup = game.add.group();
    		background = game.add.sprite(0, 0, 'TableBg');

    		//we will add to stage group all our objects
    		stageGroup.add(background);



    		console.log(stageGroup.width);

	  		//set bounds to camera move
	  		game.world.setBounds(0, 0, 3000, 3000);
	  		wW = game.world.width;
	  		wH = game.world.height;
	  		cW = game.camera.width;
	  		cH = game.camera.height;
	  		bW = stageGroup.width;
	  		bH = stageGroup.height;


	  		uiService = game.$injector.get('uiService');


	  		/*
	  		var camTween = game.add.tween(game.world.scale).to( { x: 2, y: 2 }, 3000, "Quart.easeOut");

	  		setTimeout(function(){
	  			camTween.start();
	  		}, 2000);

	  		//var scale = game.world.height / background.height;
	  		//background.scale.setTo(scale, scale);

	  		/*
	  	    //background.autoScroll(-50, -20);
	  	    background.inputEnabled = true;

	  	    background.events.onInputDown.add(function(){
	  	    	dragInfo.x = (game.input.x - background.x);
	  	    	dragInfo.y = (game.input.y - background.y);
	  	    	drag = true;
	  	    }, this);

	  	    background.events.onInputUp.add(function(){
	  	    	drag = false;
	  	    }, this);
			*/
    	}

    	module.render = function(game){
    		game.debug.cameraInfo(game.camera, 32, 32);
    	}

    	module.checkBounds = function(cX, cY){
    		var maxXpos = stageGroup.width - cW;
		    var maxYpos = stageGroup.height - cH;

    		if(Math.abs(cX) > maxXpos) { 
    			cX = 0 - maxXpos;
    		}
    		if(cX > 0) { 
    			cX = 0;
    		}
    		if(Math.abs(cY) > maxYpos) { 
    			cY = 0 - maxYpos;
    		}
    		if(cY > 0) { 
    			cY = 0;
    		}

    		return { cX : cX, cY : cY };
    	}

    	module.update = function(game){

    		//update map scale
    		if(scaleFactor != uiService.scale){
    			var	scaleLimit = ((cW > cH) ? cW : cH) / ((wW > wH) ? wW : wH);

	    		var centerPointW = (cW / 2) + Math.abs(stageGroup.x);
	    		var centerPointH = (cH / 2) + Math.abs(stageGroup.y);
	    		var savedW = stageGroup.width;
	    		var savedH = stageGroup.height;

	    		/*NEED BETTER SCALING*/
	    		var scale = (scaleLimit > uiService.scale) ? scaleLimit : uiService.scale;
	    			stageGroup.scale.setTo(uiService.scale, uiService.scale);

	    		var newCenterPointW = (stageGroup.width * centerPointW) / savedW;
	    		var newCenterPointH = (stageGroup.height * centerPointH) / savedH;

	    		console.log(newCenterPointW, newCenterPointH, stageGroup.width, stageGroup.height);

	    		var newStagePosi =  this.checkBounds(0 - (newCenterPointW - (cW / 2)), 0 - (newCenterPointH - (cH / 2)));

	    		stageGroup.x = newStagePosi.cX;
	    		stageGroup.y = newStagePosi.cY;

	    		scaleFactor = uiService.scale;
    		}

    		//Move MAP on drag
    		if (game.input.activePointer.isDown && drag) {	
    			if (game.origDragPoint) {		
		    		//move world pivot instead off camera
		    		/*
		    		game.world.pivot.x += game.origDragPoint.x - game.input.activePointer.position.x;		
		    		game.world.pivot.y += game.origDragPoint.y - game.input.activePointer.position.y;
		    		*/
		    		/*
		    		game.camera.x += game.origDragPoint.x - game.input.activePointer.position.x;		
		    		game.camera.y += game.origDragPoint.y - game.input.activePointer.position.y;
		    		*/

		    		var cX = stageGroup.x;
		    		var cY = stageGroup.y;

		    		cX -= game.origDragPoint.x - game.input.activePointer.position.x;		
		    		cY -= game.origDragPoint.y - game.input.activePointer.position.y;

		    		stageGroup.x = this.checkBounds(cX, cY).cX;
		    		stageGroup.y = this.checkBounds(cX, cY).cY;
	    		}	
	    		// set new drag origin to current position	
	    		game.origDragPoint = game.input.activePointer.position.clone();
    		}else {	
    			game.origDragPoint = null;
    		}
    	}

    return module;

});
