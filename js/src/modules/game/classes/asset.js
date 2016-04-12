define('module/game/classes/asset', [
    'lib/rxjs.all.min'
    ], function (Rx){
    
    var game, stage, $injector, uiService, gameService;

    function module(_game, _stage){
    	stage = _stage;
        game = _game;
        $injector = game.$injector;
        uiService = $injector.get('uiService');
        gameService = $injector.get('gameService');
    }

    module.prototype.addToStage = function(assetKey, hasInputEnabled){
        var asset = game.add.sprite(0, 0, assetKey);
        var spriteToDrag = {};

        stage.addChild(asset);

        if(hasInputEnabled){
            asset.inputEnabled = true;

            var dragStartStream = Rx.Observable.fromEventPattern(function add (h) {
                asset.events.onInputDown.add(function(){
                    h('dragStart');
                });
              });
            var dragStopStream = Rx.Observable.fromEventPattern(function add (h) {
                asset.events.onInputUp.add(function(){
                    h('dragEnd');
                });
              });
            var dragMoveStream = Rx.Observable.fromEventPattern(function add (h) {
                spriteToDrag.emitDrag = h;
              });

            var dragSource = Rx.Observable.merge(dragStartStream, dragStopStream);


            var outStream = Rx.Observable.fromEventPattern(function add(h) {
                asset.events.onInputOut.add(function(){
                    h('out');
                });
              });

            var overStream = Rx.Observable.fromEventPattern(function add (h) {
                asset.events.onInputOver.add(function(e){
                    h('over');
                });
              })
            .flatMapLatest(function(x) {
                return Rx.Observable
                        .timer(500)
                        .takeUntil(outStream)
                        .takeUntil(dragStartStream)
                        .takeUntil(dragMoveStream)
                        .map(x);
            });

            var overSource = Rx.Observable.merge(outStream, overStream);

            
            var source = Rx.Observable.merge(dragSource, overSource);
                //Event Handling
                source.subscribe(function (x) {
                    if(x == 'out'){
                        console.log(x);
                    }
                    if(x == 'over'){
                        console.log(x);
                    }
                    if(x == 'dragStart'){
                    	//make this the top off the display list
                    	asset.bringToTop();

                        spriteToDrag.obj = asset;
                        spriteToDrag.initX = asset.x;
                        spriteToDrag.initY = asset.y;
                        spriteToDrag.initCX = game.input.activePointer.clientX;
                        spriteToDrag.initCY = game.input.activePointer.clientY;

                        gameService.startObjDrag(spriteToDrag);

                        console.log('drag', game.input.activePointer);
                    }
                    if(x == 'dragEnd'){
                        gameService.stopObjDrag();
                    }
                });
        }

        return asset;
    }

    return module;

});
