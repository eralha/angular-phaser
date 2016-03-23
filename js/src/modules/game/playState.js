define('module/game/playState', [], function (){
    
    var module = {};
    var count, cursors, background, stageGroup;
    var drag = false;
    var dragInfo = {};
    var mapSizeMaxCurrent, mapSizeMax = 3000;
    var wW, wH, cW, cH, bW, bH;


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


	  		var uiService = game.$injector.get('uiService');
	  		game.scope.$watch(function(){
	  			return uiService.scale;
	  		}, function(newValue, oldValue){
	  			stageGroup.scale.setTo(newValue, newValue);
	  		});


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

    	module.zoomTo = function(scaleTarget){
    		 // zoom in/out with a/o
		    if (game.input.keyboard.isDown(Phaser.Keyboard.A) && (mapSizeMaxCurrent < mapSizeMax)) { mapSizeMaxCurrent += 32; }
		    else if (game.input.keyboard.isDown(Phaser.Keyboard.O) && (mapSizeMaxCurrent > worldwidth )) { mapSizeMaxCurrent -= 32; }

		    mapSizeMaxCurrent = Phaser.Math.clamp(mapSizeMaxCurrent, worldwidth , mapSizeMax); 
		    worldScale = mapSizeMaxCurrent/mapSizeMax;

		    stageGroup.scale.set(worldScale);  // scales my stageGroup (contains all objects that shouldbe scaled)

		    if(game.input.activePointer.isDown && !game.input.pointer2.isDown){   //move around the world
		        if (oldcamera) { 
		            game.camera.x += oldcamera.x - game.input.activePointer.position.x; 
		            game.camera.y += oldcamera.y - game.input.activePointer.position.y; 
		        }
		        oldcamera = game.input.activePointer.position.clone();
		        // store current camera position (relative to the actual scale size of the world)
		        rescalefactorx = mapSizeX / (mapSizeX * worldScale); // multiply by rescalefactor to get original world value
		        rescalefactory = mapSizeY / (mapSizeY * worldScale);
		        currentcamerapositionX = game.camera.view.centerX*rescalefactorx;
		        currentcamerapositionY = game.camera.view.centerY*rescalefactory;
		    }
		    else { //center camera on the point that was in the center of the view atm the zooming started
		        oldcamera = null;
		        if (!currentcamerapositionX){ // if not set yet (never zoomed)
		            currentcamerapositionX = game.camera.view.centerX;
		            currentcamerapositionY = game.camera.view.centerY;
		        }
		        followx = currentcamerapositionX*worldScale;
		        followy = currentcamerapositionY*worldScale;

		        game.camera.focusOnXY(followx, followy);
		    }

    	}

    	module.render = function(game){
    		game.debug.cameraInfo(game.camera, 32, 32);
    	}

    	module.update = function(game){
    		if (game.input.activePointer.isDown) {	
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

		    		var maxXpos = stageGroup.width - cW;
		    		var maxYpos = stageGroup.height - cH;
		    		var cX = stageGroup.x;
		    		var cY = stageGroup.y;

		    		cX -= game.origDragPoint.x - game.input.activePointer.position.x;		
		    		cY -= game.origDragPoint.y - game.input.activePointer.position.y;

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

		    		stageGroup.x = cX;		
		    		stageGroup.y = cY;

		    		console.log(stageGroup.width, wW, game.camera.width);
	    		}	
	    		// set new drag origin to current position	
	    		game.origDragPoint = game.input.activePointer.position.clone();
    		}else {	
    			game.origDragPoint = null;
    		}
    	}

    return module;

});
