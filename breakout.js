// context, general info
var canv;
var intervalId = 0;
var canvasWidth;
var canvasHeight;
var minX = 0;
var maxX = 0;

//scores
var scores = 0;
$("#scores").html(scores);
//lives
var lives = 3;
$("#lives").html(lives);

// ball
var x = 480; // starting location
var y = 550;
var ballRadius = 8;
var blocksHit = 0; // increment when hit 4 times and 12 times
var orangeHit = false;
var redHit = false;
var ceilingHit = false; // if ceiling is hit, shrink paddle to half size
// the ball's movement per 1 ms.
var mx = 1; 
var my = -2;
var ballColor = "#E44424";
// draw the ball
function ball(x, y, ballRadius){
	canv.beginPath();
	canv.arc(x, y, ballRadius, 0, Math.PI*2, true);
	canv.closePath();
	canv.fill();
}

// reset the ball on the paddle
function reset_ball(){
  x = px+0.5*pw;
  y = canvasHeight-2*ph-15;
  begin = false;
  my = -my;
}

// paddle
var px;
var ph;
var pw;
var paddleColor = "#67BCDB";
function paddle(){
	px = canvasWidth/2-60;
	ph = 15;
	pw = 160;
}

// level info
var level = 1; ////////////////////////////////////////////////////////////////////////

// bricks
var bricks;
var rows = 8;
var cols = 14;
var brickWidth;
var brickHeight = 15;
var padding = 5.5;
var rowColors = ["red", "red", "orange", "orange", "green", "green", "yellow", "yellow"];
function createBricks() {
  level = 1;
  bricks = new Array(rows);
  for (i=0; i < rows; i++) {
    bricks[i] = new Array(cols);
    for (j=0; j < cols; j++) {
      bricks[i][j] = 1;      
    }
  }
}
// level 2's bricks
function createBricks2() {
  level = 2;
  rowColors = ["red", "red", "green", "green", "orange", "orange", "purple", "purple"];
  bricks = new Array(rows);
  for (i=0; i < rows; i++) {
    bricks[i] = new Array(cols);
    for (j=0; j < cols; j++) {
      bricks[i][j] = 1;      
    }
  }
}
//level 3's bricks
function createBricks3() {
  level = 3;
  rowColors = ["red", "red", "blue", "blue", "yellow", "yellow", "green", "green"];
  bricks = new Array(rows);
  for (i=0; i < rows; i++) {
    bricks[i] = new Array(cols);
    for (j=0; j < cols; j++) {
      if ((j - 3 >= i) || ((0 <= j <= 2) && i == 0)){ //() || j-6 > i
        bricks[i][j] = 1;
      }
    }
  }
}
// the function to draw the bricks on the canvas
function drawBricks(){
  for (i=0; i < rows; i++) {
    for (j=0; j < cols; j++) {
      if (bricks[i][j] == 1) {
        canv.fillStyle = rowColors[i];
        rectangle((j * (brickWidth + padding)) + padding,
             (i * (brickHeight + padding)) + padding,
             brickWidth, brickHeight);
        canv.fill();
      }
    }
  }
}

function rectangle(x, y, w, h){ // also used for paddle
	canv.beginPath();
  canv.rect(x,y,w,h);
  canv.closePath();
  canv.fill();
}			

// keyboard
rightKey = false;
leftKey = false;
function pressKey(evt) {
  if (evt.keyCode == 39){
  	rightKey = true;
  }
  else if (evt.keyCode == 37) {
  	leftKey = true;
  }
}
function releaseKey(evt) {
  if (evt.keyCode == 39){
  	rightKey = false;
  }
  else if (evt.keyCode == 37) {
  	leftKey = false;
  }
}
$(document).keyup(releaseKey);
$(document).keydown(pressKey);

// mouse
function cursor(evt) {
  if (evt.pageX > minX && evt.pageX < maxX) {
    px = Math.max(evt.pageX - minX - (pw/2), 0);
    px = Math.min(canvasWidth - pw, px);
  }
}
$(document).mousemove(cursor);

// start game (left click or press space to begin)
var begin=false;
$(document).keydown(keyboardBegin);
function keyboardBegin(evt) {
  if (evt.keyCode == 32) {
  	begin = true;
  }
}
$(document).click(mouseBegin);
function mouseBegin(evt) {
  if (evt.which == 1){
  	begin = true;}
}

// animation
function draw(){
	clear();

	// starting point of ball
	if (begin == false) {
    x = px+0.5*pw;
  	y = canvasHeight-2*ph-65;
	}


	// moving paddle with the keyboard
	if (rightKey && px + pw < canvasWidth){
		px += 4;
	} else if (leftKey && 0 < px){
		px -= 4;
	}
	canv.fillStyle = paddleColor;
	rectangle(px, canvasHeight-ph-70, pw, ph);

	drawBricks();

  // ball
  canv.fillStyle = ballColor;
  ball(x, y, ballRadius);

  rowheight = brickHeight + padding;
  colwidth = brickWidth + padding;
  row = Math.floor(y/rowheight);
  col = Math.floor(x/colwidth);

  // the ball has hit a brick
  if (y < rows * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {

  	// increase speed if the ball has hit a total of 4 blocks, and again at 12 blocks
  	blocksHit += 1
  	if (blocksHit == 4 || blocksHit == 12){
  		mx *= 1.15;
  		my *= 1.15;
  	}
    // change the ball's direction in y axis
    my = -my;
    // clear the brick been hit and keep adding to the scores
    bricks[row][col] = 0;
    if (0 <= row && row <= 1) {
      scores += 7;
      if (redHit == false){
	  		mx *= 1.15;
	  		my *= 1.15;
      	redHit = true;
      }
      $("#scores").html(scores);
    } else if (2 <= row && row <= 3) {
      scores += 5;
      if (orangeHit == false){
	  		mx *= 1.15;
	  		my *= 1.15;
      	orangeHit = true;
      }
      $("#scores").html(scores);
    } else if (4 <= row && row <= 5) {
      scores += 3;
      if (orangeHit == false){
        mx *= 1.15;
        my *= 1.15;
        orangeHit = true;
      }
      $("#scores").html(scores);
    } else if (6 <= row && row <= 7) {
    	scores += 1;
    	$("#scores").html(scores);
    }
  }
  // choose levels and reset vars for the next level.
  if (blocksHit == rows*cols && level == 1){
    mx = 1;
    my = -2;
    blocksHit = 0;
    clear();
    reset_ball();
    paddle();
    redHit = false;
    ceilingHit = false;
    orangeHit = false;
    createBricks2();
  } else if (blocksHit == rows*cols && level == 2){
    mx = 1;
    my = -2;
    blocksHit = 0;
    clear();
    reset_ball();
    paddle();
    redHit = false;
    ceilingHit = false;
    orangeHit = false;
    createBricks3();
  } else if (blocksHit == 63 && level == 3){ //////////////////////////////////
    mx = 1;
    my = -2;
    blocksHit = 0;
    clear();
    reset_ball();
    paddle();
    redHit = false;
    ceilingHit = false;
    orangeHit = false;
  } 
  // when player finished all three levels, the player wins.
  if (blocksHit == 63 && scores > 1000 && level ==3){
    clearInterval(intervalId);
    clear();
    drawBricks();
    //display congratulations
    var c=document.getElementById("canvas");
    var ctx=c.getContext("2d");
    var img=document.getElementById("win");
    ctx.drawImage(img,canvasWidth/2-207,220);
  }

	// movement of ball
	x += mx;
	y += my;

	if (x + mx - ballRadius < 0 || x + mx + ballRadius > canvasWidth){ // ballRadius is 8
    mx = -mx;
	} 
  if (y + my - ballRadius < 0){// ballRadius is 8
    my = -my;
    if (ceilingHit == false){
    	pw = pw/2;
    	ceilingHit = true;
    }
  } 
  // the setting for bouncing back
  else if((canvasHeight-ph-60 > y+my+ballRadius)&&(y+my+ballRadius > canvasHeight-ph-70)&&(x > px-10 && x < px + pw + 10)){//////////////
    // hit paddle
    mx = ((x-(px+pw/2))/pw) * 4;
    my = -my;
  }
  else if (y + my + ballRadius > canvasHeight){
    // did not hit paddle
    lives -= 1;
    $("#lives").html(lives);
    reset_ball(); 
    // if lives go to zero then gameover.
    if (lives == 0) {
      clearInterval(intervalId);
      clear();
      drawBricks();
      //add the game over
      var c=document.getElementById("canvas");
      var ctx=c.getContext("2d");
      var img=document.getElementById("gameover");
      ctx.drawImage(img,canvasWidth/2-207,220);
    }
  }
}

function action(){
	canv = $('#canvas')[0].getContext("2d");
	canvasWidth = $("#canvas").width();
	canvasHeight = $("#canvas").height();
	intervalId = setInterval(draw, 1);
	brickWidth = (canvasWidth/cols) - 6;
	minX = $("#canvas").offset().left;
  maxX = minX + canvasWidth;
}

function clear(){
  canv.clearRect(0, 0, canvasWidth, canvasHeight);
}

action();
paddle();
createBricks();


// to choose level 2 from the html button.
function level2(){
  scores = 0;
  $("#scores").html(scores);
  lives = 3;
  $("#lives").html(lives);
  level = 1;
  blocksHit = rows*cols;
}
// to choose level 3 from the html button
function level3(){
  scores = 0;
  $("#scores").html(scores);
  lives = 3;
  $("#lives").html(lives);
  mx = 2;
  my = -3;
  level = 2;
  blocksHit = rows*cols;
}