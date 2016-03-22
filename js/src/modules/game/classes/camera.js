
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>CowsOnIce</title>
    <style>
        body { background-color: #555;}
    </style>
    <script src="phaser.min.js"></script>
</head>
<body>
<script>

var level = 0; 
var zoomed=false;
var oldcamera;
var currentcamerapositionX;
var currentcamerapositionY;

var mapSizeMaxCurrent;
var mapSizeMax;
var mapSizeX;
var mapSizeY;
var worldwidth=800;
var worldheight=480;

var BootState = {
    preload: function() {
        game.load.image('loaderFull', 'assets/loaderfull.png');
        game.load.image('loaderEmpty', 'assets/loaderempty.png');
        game.load.image('orientation', 'assets/orientation.jpg');
    },
    create: function() {
        game.state.start('preload');
    }
}

var PreloadState = {
    preload: function() {
        loaderEmpty = game.add.sprite(0, 0, 'loaderEmpty');
        // Center the preload bar
        loaderEmpty.x = game.world.centerX - loaderEmpty.width / 2;
        loaderEmpty.y = game.world.centerY - loaderEmpty.height / 2;
        loaderFull = game.add.sprite(0, 0, 'loaderFull');
        loaderFull.x = game.world.centerX - loaderFull.width / 2;
        loaderFull.y = game.world.centerY - loaderFull.height / 2;
        game.load.setPreloadSprite(loaderFull);  //this is all you have to do to get a nice preload screen
        game.load.tilemap('level0', './assets/levels/template.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('ice', 'assets/tilesets/ice.png');
    },
    create: function() {
 
        //loaderFull.crop.width = loaderFull.width;
        var tween1 = game.add.tween(loaderFull).to({ alpha: 0 }, 800, Phaser.Easing.Linear.None, true);
        var tween3 = game.add.tween(loaderEmpty).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        tween3.onComplete.addOnce(function() { game.state.start(''+level+''); });
    }
}
var Level0 = {
    create: function () {
        setupLevelEvironment();
        setupLayers('level0','ice');
    },
    update: function () {
        updateLevelstatus();  
    }
}
function setupLevelEvironment(){
    worldScale = 1;
    zoomed=false;
    setupDisplayGroups();
}
function setupDisplayGroups(){
    stageGroup = game.add.group(); // this group will contain everything except the UI for scaling
    backgroundobjects = game.add.group();
    stageGroup.add(backgroundobjects);
}
function setupLayers(level,leveltexture){
    map = game.add.tilemap(level);
    mapSizeX = map.widthInPixels;
    mapSizeY = map.heightInPixels; 
    //chose the smaller side as Scale-minimum so no black bars occur
    if (map.widthInPixels < map.heightInPixels){ 
        mapSizeMaxCurrent=map.widthInPixels; 
        mapSizeMax = map.widthInPixels;
    } else {
        mapSizeMaxCurrent= map.heightInPixels;
        mapSizeMax = map.heightInPixels;
    }
    background1=game.add.tileSprite(0, 0, map.widthInPixels,map.heightInPixels , leveltexture);
    game.camera.bounds=0; 
    testimage = game.add.image(mapSizeX/2,mapSizeY/2,'loaderFull');
    testimage.anchor.setTo(0.5,0.5);
    backgroundobjects.add(background1);
    backgroundobjects.add(testimage);
    
}

