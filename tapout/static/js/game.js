var tapper = document.getElementById("tapper");
var taplist = [];

var startTime = Date.now();
var endTime = startTime + 10000;

// When the button is clicked directly
var buttonTapped = function(e) {
  taplist.push(Date.now() - startTime);
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
    // send stuff to firebase
  }
};

tapper.addEventListener("click", buttonTapped);
$("body")[0].addEventListener("keyup", buttonTapWrap);

var timer = setInterval(gameover, 500);
