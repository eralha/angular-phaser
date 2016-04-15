define('module/game/main', [
  'module/game/menuState',
  'module/game/playState'
  ], function (menuState, playState){
    
    function module(){

    }

    module.prototype.InitGameEngine = function(scope, $injector, $rootScope){

      var game = 
        new Phaser.Game(
          '100%', '100%',         // width x height
          Phaser.AUTO,      // the game context, 2D/3D
          'gameCanvas'
        );

      //assign service var to this game object
      var gameService = $injector.get('gameService');

        gameService.setGame(game);

        game.scope = scope;
        game.$rootScope = $rootScope;
        game.$injector = $injector;

        game.state.add('Play', playState);
        game.state.add('MainMenu', menuState);

        //Start the main state
        game.state.start('MainMenu');

    }

    return new module();

});
