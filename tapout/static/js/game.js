var tapper = document.getElementById("tapper");
var taplist = [];

var startTime = Date.now();
var endTime = startTime + 10000;
var game = true;

// When the button is clicked directly
var buttonTapped = function(e) { 
    if (game) {
	taplist.push(Date.now() - startTime);
    }
    //console.log("TAP!");
};

// When a key is pressed, to wrap for certain keys
var buttonTapWrap = function(e) {
  switch (e.key) {
  case " ":
  case "Enter":
    //console.log("YES!");
    buttonTapped(e);
    break;
  default:
    //console.log("NO!");
  }
};

var gameover = function() {
  if (Date.now() > endTime) {
    clearInterval(timer);
    console.log(taplist);
      game = false;
      playSeries();
      // send stuff to firebase
  }
};

tapper.addEventListener("click", buttonTapped);
$("body")[0].addEventListener("keyup", buttonTapWrap);

var timer = setInterval(gameover, 500);


var audio = new Audio("static/audio/drum.wav");
var playDrum = function(){
    audio.currentTime = 0;
    audio.play();
    int = setInterval(function() {
        if (audio.currentTime > 0.1) {
            audio.pause();
            clearInterval(int);
        }
    }, 10);
}    


var playSeries = function(){
    for (var tim in taplist){
	//setInterval(playDrum, tim);
	setTimeout(playDrum, taplist[tim]);
	//console.log(tim);
    }
    //clearInterval();
}

