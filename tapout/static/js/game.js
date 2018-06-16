var tapper;
var taplist = [];

var startTime;
var endTime;
var game;

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

var playSeries = function(abc){
  for (var tim in abc){
    setTimeout(playDrum, abc[tim]);
  }
};

var gameover = function() {
  if (Date.now() > endTime) {
    clearInterval(timer);
    console.log(taplist);
    game = false;
    // send stuff to firebase
    db.ref('/rooms/' + window.location.href.split('/')[ window.location.href.split('/').length - 1]).child('songs').child(firebase.auth().currentUser.uid).update({timetable: taplist});
    //playSeries();
  }
};

/*tapper.addEventListener("click", buttonTapped);
$("body")[0].addEventListener("keyup", buttonTapWrap);*/


var audioType = "drum";
//var audioType = "piano";
//var audioType = "guitar";

if(audioType == "drum"){
    var audio = new Audio("static/audio/drum.wav");
    audio.volume = 0.5;
    var startTim = 0;
    var timeInt = 0.1;
}
if(audioType == "piano"){
    var audio = new Audio("static/audio/piano.mp3");
    var startTim = 0;
    var timeInt = 1;
}
if(audioType == "guitar"){
    var audio = new Audio("static/audio/guitar.wav");
    var startTim = 0.4;
    var timeInt = 0.625;
}


var playOnce = function(){
    audio.currentTime = startTim;
    audio.play();
    
    int = setInterval(function() {
        if (audio.currentTime > timeInt) {
	    audio.pause();
	    clearInterval(int);
        }
    }, 10);
} 
