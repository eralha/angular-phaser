define('module/game/classes/asset', [
    'lib/rxjs.all.min'
    ], function (Rx){

    function module(_game, _stage){
    	this.stage = _stage;
        this.game = _game;
        this.$injector = this.game.$injector;
        this.uiService = this.$injector.get('uiService');
        this.gameService = this.$injector.get('gameService');
    }

    module.prototype.destroy = function(){
    	//clean all asset interaction
    	if(this.asset.inputEnabled){
    		//console.log('clean asset input', this.asset.key);
    		this.asset.events.onInputDown.removeAll();
        	this.asset.events.onInputUp.removeAll();
        	this.asset.events.onInputOut.removeAll();
        	this.asset.events.onInputOver.removeAll();
    	}

    	this.stage = null;
    	this.game = null;
    	this.$injector = null;
    	this.uiService = null;
    	this.gameService = null;
    	this.asset = null;

    	//console.log('asset destroy called', this);
    }

    module.prototype.enableInput = function(asset){
    	var sup = this;
    	var spriteToDrag = {};

    	asset.inputEnabled = true;

		var dragStartStream = Rx.Observable.create(function(observer) {
			asset.events.onInputDown.add(function(){
				observer.onNext('dragStart');
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
                    spriteToDrag.initCX = sup.game.input.activePointer.clientX;
                    spriteToDrag.initCY = sup.game.input.activePointer.clientY;

                    sup.gameService.startObjDrag(spriteToDrag);

                    console.log('drag', sup.game.input.activePointer);
                }
                if(x == 'dragEnd'){
                    sup.gameService.stopObjDrag();
                }
            });
    }

    module.prototype.addToStage = function(assetKey, hasInputEnabled){
        this.asset = this.game.add.sprite(0, 0, assetKey);

        this.stage.add(this.asset);

        if(hasInputEnabled){
            this.enableInput(this.asset);
        }

        return this.asset;
    }

    return module;

});
