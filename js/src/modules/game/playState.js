define('module/game/playState', [], function (){
    
    var module = {};
    var count, cursors, background;
    var drag = false;
    var dragInfo = {};


    	module.preload = function(game){
    		game.load.image('MainBoard', 'assets/game_board.jpg');
    	}

    	module.create = function(game){
    		var world = game.world;

	  		background = game.add.sprite(0, 0, 'MainBoard');

	  		//set bounds to camera move
	  		game.world.setBounds(0, 0, 3000, 3000);

	  		var uiService = game.$injector.get('uiService');
	  		game.scope.$watch(function(){
	  			console.log(uiService.scale);
	  			return uiService.scale;
	  		}, function(newValue, oldValue){
	  			game.world.scale.setTo(newValue, newValue);
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

    	module.render = function(game){
    		game.debug.cameraInfo(game.camera, 32, 32);
    	}

    	module.update = function(game){
    		if (game.input.activePointer.isDown) {	
    			if (game.origDragPoint) {		
		    		//move world pivot instead off camera
		    		
		    		game.world.pivot.x += game.origDragPoint.x - game.input.activePointer.position.x;		
		    		game.world.pivot.y += game.origDragPoint.y - game.input.activePointer.position.y;
		    		

		    		/*
		    		game.camera.x += game.origDragPoint.x - game.input.activePointer.position.x;		
		    		game.camera.y += game.origDragPoint.y - game.input.activePointer.position.y;
		    		*/
	    		}	
	    		// set new drag origin to current position	
	    		game.origDragPoint = game.input.activePointer.position.clone();
    		}else {	
    			game.origDragPoint = null;
    		}
    	}

    return module;

});
