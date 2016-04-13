function InitGameEngine(scope, $injector, $rootScope){

  var game = 
    new Phaser.Game(
      '100%', '100%',         // width x height
      Phaser.AUTO,      // the game context, 2D/3D
      'gameCanvas'
    );

  //Require all game states
  require([
    'module/game/menuState',
    'module/game/playState'
    ], function(menuState, playState){

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

  });

}