//requirejs configurations
var appCFO_baseUrl = "src";
requirejs.config({
	urlArgs : 'v=3',
    baseUrl: 'js/',
    paths: {
        'lib' : appCFO_baseUrl+'/lib/',
        'module' : appCFO_baseUrl+'/modules'
    }
});


function parseComponent(elem){
    var htmlElement = elem;

    if($(htmlElement).attr("data-init") == "false") { return; }

    require([$(htmlElement).attr("data-component")], function(component){
        if(typeof component == 'function'){
            var comp = new component(htmlElement);
        }
    });
}

function deferImagesLoad(container, callBack){
    $(container).each(function(){
        var sup = this;
        var images = $(this).find("img");
        var imagesNr = $(images).length;
        var loaded = 0;

        $(images).one("load", function() {
          loaded ++;
          if(loaded >= imagesNr){
            //console.log('all images loaded');
            callBack(sup);
          }
        }).each(function() {
          if(this.complete) $(this).load();
        });
    });
}


    (function($){
        $(document).ready(function(){

            //loading Individual components
            $("[data-component]").each(function(){
                parseComponent(this);
            });

        });
    })(jQuery);