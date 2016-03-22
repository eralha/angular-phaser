define('module/angular/app', [
  'module/angular/controllers',
  'module/angular/services',
  'module/angular/directives'
  ], function (){
    
    var app = angular.module('app', ['ui.router', 'app.services', 'app.controllers', 'app.directives'])


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
          $urlRouterProvider.otherwise("/loby")
          
          $stateProvider
            .state('loby', {
                url: "/loby",
                templateUrl: "views/menu.html"
            })
              .state('loby.list', {
                  url: '/list',
                  templateUrl: 'views/menu_game_list.html'
              })
        })

        setTimeout(function(){
          angular.bootstrap(document, ['app']);
        }, 500);

    return app;

});
