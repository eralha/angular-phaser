define('module/angular/app', [
  'lib/angular-fire',
  'module/angular/controllers',
  'module/angular/services/main',
  'module/angular/directives'
  ], function (){
    
    var app = angular.module('app', ['ui.router', 'app.services', 'app.controllers', 'app.directives', 'firebase'])


        app.config(function($stateProvider, $urlRouterProvider, $provide){

          $provide.decorator('$rootScope', ['$delegate', function($delegate) {
              Object.defineProperty($delegate.constructor.prototype, '$onRootScope', {
                  value: function(name, listener) {
                      var unsubscribe = $delegate.$on(name, listener);
                      this.$on('$destroy', unsubscribe);

                      return unsubscribe;
                  },
                  enumerable: false
              });
              return $delegate;
          } ]);

          // For any unmatched url, send to /route1
          //$urlRouterProvider.otherwise("/loby")
          
          $stateProvider
            .state('game', {
                url: "/game",
                templateUrl: "views/game.html"
            })
            .state('roomList', {
                url: "/roomList",
                templateUrl: "views/room__list.html"
            })
        });

        var firebaseREF = 'https://angular-phaser.firebaseio.com/';
        app.constant('fireConfig', {
          rooms: firebaseREF+ 'rooms',
          users: firebaseREF+ 'users',
          dataPipe: firebaseREF+ 'dataPipe',
          objMovement: firebaseREF+ 'objMovement',
          onlineUsers: firebaseREF+''
        });

        setTimeout(function(){
          angular.bootstrap(document, ['app']);
        }, 500);

    return app;

});
