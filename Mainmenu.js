var menuImg= new Image();
menuImg.src = "imgs/mainmenu.png"
window.requestAnimFrame;
var canvas = document.getElementById("mainmenu");
var context = canvas.getContext("2d");
context.drawImage(menuImg,0,0);
console.log(canvas);