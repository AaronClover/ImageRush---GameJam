/**
 * This program starts at init() when it is called in html
 */
 

/**
 * Loads all images in the program
 */
var imageRepository = new function() {
    // Define image name vars
    this.background = new Image();
    this.bottom = new Image();
    
    //Set image locations
    this.background.src = "imgs/bg.png";
    this.bottom.src = "imgs/bottom.png";
};

/**
 * Creates the Drawable object which will be the base class for all drawable
 * objects in the game. Sets up defualt variables that all child objects will
 * inherit, as well as the defualt f unctions.
 */


/**
 * Inheritable object that contains code used for renderable objects
 */
function Drawable() {
    this.init = function(x, y) {
        // X & Y are the 2d coordinates for on screen objects
        this.x = x;
        this.y = y;
    };

    this.speed = 0;
    this.canvasWidth = 0;
    this.canvasHeight = 0;

    // All classes inheriting Drawable will need a draw function unique to each class
    this.draw = function() {
    };
}

/**
 * Class for displaying the background
 */
function Background() {

    // Implement abstract function draw
    this.draw = function() {
        this.context.drawImage(imageRepository.background, this.x, this.y);
    };
}

/**
 * Class for displaying the interface
 */
function GameInterface() {
    this.draw = function () {
        this.context.drawImage(imageRepository.bottom, 0, this.canvasHeight-100);
    };
}

/**
 * Class that contains all data for individual enemy objects
 */
function Enemy() {
    this.speed = 1;
    this.word;
    
    
    this.draw = function() {
        
        // Update moved location
        this.y += this.speed;
        // Draw
        this.context.drawImage(this.word.img, this.x, this.y);
    };
    
    this.init = function(x,y, index) {
        this.x=x;
        this.y=y;
        this.word = game.wordBank[index];
    };
}
Enemy.imagewidth = 150; //Declared outside of class so it will be static


// Inheriting Drawable to the Background and Enemy class
Background.prototype = new Drawable();
Enemy.prototype = new Drawable();
GameInterface.prototype = new Drawable();


/**
 * Class for the Game that will contain all variables and instances will take place in.
 * Reinitializing Game should reset the game
 */
function Game() {
    this.timer;
    this.score;
    this.strikes;
    this.lastspawn;
//  var input = new CanvasInput({
//        canvas: document.getElementById('gamecanvas')
//      });
    
    // This will act as a constructor and a reset function
    this.init = function() {
        this.score = 0;
        this.timer = 0;
        this.strikes = 0;
		this.wordList = getCat(1);
		this.wordBank = this.wordList;
		this.wordGuessed = new Array();
        // Get the canvas element
        this.bgCanvas = document.getElementById("gamecanvas");
		this.textContext = document.getElementById("strikes").getContext('2d');
        //document.getElementById('textInput').focus(); //Brings focus to text box
       // document.textform.action = sendWord(); // Makes it so the text box will submit the word

        
        document.getElementById("textInput").setAttribute( "autocomplete", "off" ); 

        // Test to see if canvas is supported
        if (this.bgCanvas.getContext) {
            this.bgContext = this.bgCanvas.getContext('2d');

            // Pass canvas info to our objects
            Background.prototype.context = this.bgContext;
            Background.prototype.canvasWidth = this.bgCanvas.width;
            Background.prototype.canvasHeight = this.bgCanvas.height;
            // Enemy canvas info
            Enemy.prototype.context = this.bgContext;
            Enemy.prototype.canvasWidth = this.bgCanvas.width;
            Enemy.prototype.canvasHeight = this.bgCanvas.height;
            //Interface canvas
            GameInterface.prototype.context = this.bgContext;
            GameInterface.prototype.canvasWidth = this.bgCanvas.width;
            GameInterface.prototype.canvasHeight = this.bgCanvas.height;

            //Interface init
            this.gameInterface = new GameInterface();
            this.gameInterface.init(0,0);
            
            
            // Enemy Initialization
            this.enemyArray = []; //Array of Enemy instances to contain all enemies

            
            /**
             * Replace the line below with another timer.
             * setInterval will continue running when the game is suspended
             */
            spawnEnemy();
            this.lastspawn = this.timer;
            //var spawner = setInterval("spawnEnemy()", 6000); 
            

            // Initialize the background object
            this.background = new Background();
            this.background.init(0, 0); //Places the image to coordinates
            return true;
        } else {
            return false;
        }
    };

    // Start the animation loop
    this.start = function() {
        animate();
    };
}

function printWordList() {
game.textContext.font="bold 20px Arial";
	for (var i = 0; i < game.wordList.length; i++) {
	var match = false;
     for (var k = 0; k < game.wordBank.length; k++) {
		if (game.wordList[i] == game.wordBank[k]){
		match = true;
		}
		
	 }
	 if (match) {
	    game.textContext.font="bold 20px Arial";
        game.textContext.fillStyle="#000";
		game.textContext.fillText(game.wordList[i].eng, 900, 100 + (20*i));
		}
	
	else {
		  game.textContext.fillStyle= "#eaeaea";
		  game.textContext.fillText(game.wordList[i].eng, 900, 100 + (20*i));
		  }
	}
}

function getCat(catNum) {
	var catArr = new Array();
	for (var i = 0; i < wordLib.length; i++) {
		for (var k = 0;  k < wordLib[i].cat.length; k++) {
			if (wordLib[i].cat[k] == catNum) {
			catArr.push(wordLib[i]);
			}
		}
	}
	return catArr;
}


/**
 * The animation loop. Calls the requestAnimationFrame shim to optimize the game
 * loop and draws all game objects. This function must be a global function and
 * cannot be within an object.
 */
function animate() {
    game.timer++;
    
    requestAnimFrame(animate);
    game.background.draw();
    if (game.timer-game.lastspawn >= 260){
        spawnEnemy();
        game.lastspawn = game.timer;
    }
    for ( var i = 0; i < game.enemyArray.length; i++) {
        if (game.enemyArray[i].y > 500){
             game.enemyArray.splice(i, 1);
             game.strikes++;
             if (game.strikes >=3) {
                 endGame();
             }
        }
        game.enemyArray[i].draw();
    }
    game.gameInterface.draw();
//    if (game.enemyArray[game.enemyArray.length - 1].x > 500) {
//      game.enemyArray.splice((game.enemyArray.length - 1), 1);
//    }
//    console.log(game.enemyArray.length);
    game.bgContext.font="bold 30px Arial";
    game.bgContext.fillStyle="#FFFFFF";
    game.bgContext.fillText("Score: " + game.score, 50, 570);
    
    document.getElementById("strikes").getContext('2d').font="bold 30px Arial";
    document.getElementById("strikes").getContext('2d').fillStyle="#FF0000";
    
    var strikestring;
    switch (game.strikes) {
    case 0:
        strikestring = "- - -";
        break;
    case 1:
        strikestring = "X - -";
        break;
    case 2:
        strikestring = "X X -";
        break;
    case 3:
        strikestring = "X X X";
        break;
    }
    game.textContext.clearRect(0, 0, 1024, 600);
	//!!! Fix magic numbers
    game.textContext.fillText(strikestring, 900, 570);
	printWordList();
	
    
}

/**
 * requestAnim shim layer by Paul Irish Finds the first API that works to
 * optimize the animation loop, otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame || window.oRequestAnimationFrame
            || window.msRequestAnimationFrame
            || function(/* function */callback, /* DOMElement */element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

/**
 * Initialize the Game and starts it.
 */
var game = new Game();

function init() {
    loadMenu();
    if (game.init())
        game.start();
}

/**
 * Can be called to spawn an enemy randomly
 */
function spawnEnemy() {
    var x;
    var y =-150;
    var index;
    x = Math.floor(Math.random()* (game.bgCanvas.width - Enemy.imagewidth));
    var index = Math.floor(Math.random()*game.wordBank.length);
         
    game.enemyArray.push(new Enemy());
    game.enemyArray[game.enemyArray.length - 1].init(x,y,index);
    
   
};

/**
 * Currently unimplemented game over function
 */
function endGame() {
var snd = new Audio("buzz.mp3"); // buffers automatically when created
snd.play();
    game.init();
}


function sendWord() {
      if(event.keyCode==13){//check enter key
        var textValue = document.getElementById('textInput').value;
        for (var i = 0; i < game.enemyArray.length; i++){
            if (game.enemyArray[i].word.eng == textValue) {
				game.wordGuessed.push(game.enemyArray[i].word);
                game.enemyArray.splice(i, 1);
                game.score++;
            }
        }
        document.getElementById('textInput').value = "";//clear after enter key
      }
    }

function loadMenu() {

document.getElementById("mainmenu").width = 1024;
	var menuImg= new Image();
	menuImg.src = "imgs/mainmenu.png"
	var canvas = document.getElementById('mainmenu');
	var context = canvas.getContext('2d');
	context.drawImage(menuImg,0,0);
	//startGame();
	return;
};

function startGame() {
  
  game.start; // Starts game
  //document.getElementById("mainmenu").style.zIndex= -5;
  document.getElementById("mainmenu").width = 0;
  document.getElementById("mainmenucontainer").style.dispaly = "none";

}

/** Class to store vocab words
 * Takes an image location string, "pimg", and an
 * English word value string, "peng".
 * The p stands for private to differ the names with the local vars
 * 
 * diff contains value for difficulty
 * Difficulty:
 * 1 - easy
 * 2 - intermediate
 * 3 - advanced
 * 
 * 
 * cat is an integer with each number representing a category value;
 * Categories:
 * 1 - Body
 * 2 - Animals
 */
function Word (pimg, peng, pdifficulty, pcat) {
    this.cat = pcat;
    this.diff = pdifficulty;
    this.img = new Image();
    this.img.src = pimg;
    this.eng = peng;
}

wordLib = [
            new Word("imgs/vocab/arm.png", "arm", 1, [1]),       
            new Word("imgs/vocab/eye.png", "eye", 1, [1]),
            new Word("imgs/vocab/nose.png", "nose", 1, [1]),
            new Word("imgs/vocab/dog.jpg", "dog", 1, [2]),
            new Word("imgs/vocab/cat.jpg", "cat", 1, [2]),
            //new Word("imgs/vocab/horse1.jpg", "horse", 1, [2]),
           // new Word("imgs/vocab/leg1.jpg", "leg", 1, [1]),
            new Word("imgs/vocab/hand.jpg", "hand", 1, [1]),
            new Word("imgs/vocab/bird.jpg", "bird", 1, [2]),
            new Word("imgs/vocab/fish.jpg", "fish", 1, [2]),
            new Word("imgs/vocab/bear.jpg", "bear", 1, [2]),
            new Word("imgs/vocab/lion.jpg", "lion", 1, [2]),
			new Word("imgs/vocab/feet.png", "feet", 1, [1]),
			new Word("imgs/vocab/ear.png", "ear", 1, [1]),
			new Word("imgs/vocab/peacock.png", "peacock", 1, [1])];
            
            
