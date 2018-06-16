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

var playSeries = function(){
  for (var tim in taplist){
    //setInterval(playDrum, tim);
    setTimeout(playDrum, taplist[tim]);
    //console.log(tim);
  }
  //clearInterval();
};

var gameover = function() {
  if (Date.now() > endTime) {
    clearInterval(timer);
    console.log(taplist);
    game = false;
    // send stuff to firebase
    db.ref('/rooms/' + window.location.href.split('/')[ window.location.href.split('/').length - 1]).child('songs').child(firebase.auth().currentUser.uid).push({timetable: taplist});
    playSeries();
  }
};

/*tapper.addEventListener("click", buttonTapped);
$("body")[0].addEventListener("keyup", buttonTapWrap);*/



var audio;
var playDrum = function(){
  audio.currentTime = 0;
  audio.play();
  int = setInterval(function() {
    if (audio.currentTime > 0.1) {
      audio.pause();
      clearInterval(int);
    }
  }, 10);
};
