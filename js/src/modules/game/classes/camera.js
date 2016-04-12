define('module/game/classes/camera', [
    'module/game/classes/asset',
    'lib/rxjs.all.min'
    ], function (Asset, Rx){
    
    var game, $injector, stageGroup, uiService, background, gameService;
    var mapSizeMaxCurrent, mapSizeMax = 3000;
    var wW, wH, cW, cH, bW, bH;
    var scaleFactor = 1;
    var drag = true;
    var dragSprite = false;
    var dragInfo = {};
    var mapSizeMaxCurrent, mapSizeMax = 3000;

    function module(_game){
        game = _game;
        $injector = game.$injector;
        uiService = $injector.get('uiService');
        gameService = $injector.get('gameService');

        stageGroup = game.add.group();
    }

    module.prototype.addStageBackground = function(assetKey){
        //if a background exists we need to remove it
        /*
        TODO : Background removing code here
        */
        background = game.add.sprite(0, 0, assetKey);

        //we will add to stage group all our objects
        stageGroup.add(background);

        //set bounds to camera move
        game.world.setBounds(0, 0, background.width, background.height);
        wW = game.world.width;
        wH = game.world.height;
        cW = game.camera.width;
        cH = game.camera.height;
        bW = stageGroup.width;
        bH = stageGroup.height;
    }

    module.prototype.moveAsset = function(assetKey, props){
        for(i in background.children){
            if(background.children[i].key == assetKey){
                background.children[i].x = props.x;
                background.children[i].y = props.y;
            }
        }
    }

    module.prototype.addToStage = function(assetKey, hasInputEnabled){
        /*
         * Note: background is where all the assets will live
         */
        var asset = new Asset(game, stageGroup);

        var sprite = asset.addToStage(assetKey, hasInputEnabled);

        return sprite;
    }

    module.prototype.fitWorldToScreen = function(){
        var ww = $(window).width();
        var wh = $(window).height();

        var sw = stageGroup.width;
        var sh = stageGroup.height;

        if(ww > wh){
            stageGroup.width = ww;
            stageGroup.height = (ww * sh) / sw;

            if(stageGroup.height < wh){
                stageGroup.height = wh;
                stageGroup.width = (wh * sw) / sh;
            }
        }
        if(ww < wh){
            stageGroup.height = wh;
            stageGroup.width = (wh * sw) / sh;

            if(stageGroup.width < ww){
                stageGroup.width = ww;
                stageGroup.height = (ww * sh) / sw;
            }
        }

        //calculating actual scale and set our ui service to this value
        var scale = stageGroup.width / sw;

        uiService.scale = scale;
        scaleFactor = uiService.scale;
    }

    module.prototype.render = function(game){
        //game.debug.cameraInfo(game.camera, 32, 32);
    }

    module.prototype.centerCamera = function(){
        /* center viewport to world center */
        stageGroup.x = 0 - ((stageGroup.width / 2 ) - (cW / 2));
        stageGroup.y = 0 - ((stageGroup.height / 2 ) - (cH / 2));
    }

    module.prototype.centerToObject = function(obj1, obj2){
        obj2.x = (obj1.width / 2) - (obj2.width / 2);
        obj2.y = (obj1.height / 2) - (obj2.height / 2);
    }

    module.prototype.centerObjectToStage = function(obj2){
        obj2.x = (background.width / 2) - (obj2.width / 2);
        obj2.y = (background.height / 2) - (obj2.height / 2);
    }

    module.prototype.checkBounds = function(cX, cY){
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

    module.prototype.getClientPointToStagePoint = function(clientX, clientY){
        var centerPointW = (clientX) + Math.abs(stageGroup.x);
        var centerPointH = (clientY) + Math.abs(stageGroup.y);

        return {x: (centerPointW / scaleFactor), y: (centerPointH / scaleFactor)};
    }

    module.prototype.update = function(){

        //update map scale
        if(scaleFactor != uiService.scale){
            var scaleLimit = ((cW > cH) ? cW : cH) / ((wW > wH) ? wW : wH);

            var centerPointW = (cW / 2) + Math.abs(stageGroup.x);
            var centerPointH = (cH / 2) + Math.abs(stageGroup.y);
            var savedW = stageGroup.width;
            var savedH = stageGroup.height;

            /*NEED BETTER SCALING*/
            var scale = (scaleLimit > uiService.scale) ? scaleLimit : uiService.scale;
                stageGroup.scale.setTo(uiService.scale, uiService.scale);

            var newCenterPointW = (stageGroup.width * centerPointW) / savedW;
            var newCenterPointH = (stageGroup.height * centerPointH) / savedH;

            //console.log(newCenterPointW, newCenterPointH, stageGroup.width, stageGroup.height);

            var newStagePosi =  this.checkBounds(0 - (newCenterPointW - (cW / 2)), 0 - (newCenterPointH - (cH / 2)));

            stageGroup.x = newStagePosi.cX;
            stageGroup.y = newStagePosi.cY;

            scaleFactor = uiService.scale;
        }

        if (game.input.activePointer.isDown && drag) {  
            if (game.origDragPoint) {       
                //move world pivot instead off camera
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
