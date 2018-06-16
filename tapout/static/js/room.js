var link = window.location.href;
var linkArr = link.split('/');
var roomId = linkArr[linkArr.length-1];
var roomRef = db.ref('/rooms/' + roomId);
var stateRef = db.ref('/rooms/' + roomId).child('state');
var contentdiv = $('#content')[0];
var userbox = $('#userbox')[0];
var leavebutton = $('#leave')[0];
var startbutton = $('#start')[0];
var currentUsers = db.ref('/rooms/' + roomId).child('currentUsers');

roomRef.child('state').once('value').then(function(stateval){
  if(stateval.val() != "waiting"){
    document.location.pathname = '/';
  }
});

$('#codeh1')[0].innerHTML += roomId;
console.log(firebase.auth().currentUser);
firebase.auth().onAuthStateChanged(function(user){
  console.log('logged in');
  roomRef.once('value').then(function(roomval){
    var room = roomval.val();
    console.log(room);
    var users = [];
    if('currentUsers' in room){
      users = room['currentUsers'];
    }
    users.push(firebase.auth().currentUser.uid);
    roomRef.update({currentUsers: users});
  });

  setTimeout(function(){
  currentUsers.on('value', function(snapshot) {
    console.log("SOMETHING CHANGED");
    var users = snapshot.val();
    console.log(users);
    var i;
    console.log('setting innerhtml to nothing');
    userbox.innerHTML = '';
    var nameRef = db.ref('users/');
    var userdict;
    nameRef.once('value').then(function(userSnap){
      userdict = userSnap.val();
      for(i in users){
        var username = '';
        console.log(i);
        username = userdict[users[i]]['name'];
        console.log(username);
        var userdiv = document.createElement('div');
        userdiv.innerHTML = username;
        userbox.appendChild(userdiv);
      }
    });
  });
  },1000);

  stateRef.on('value', function(snapshot){
    var timekeeper;
    if(snapshot.val() == 'started'){
      roomRef.child('currentUsers').once('value').then(function(roomval){
        timekeeper = roomval.val()[0];
        console.log(timekeeper);
        console.log(firebase.auth().currentUser.uid);
        if(firebase.auth().currentUser.uid == timekeeper){
          console.log('DAT ME!');
          setTimeout(function(){
            console.log("time's up! updating");
            roomRef.update({state: 'tapping'});
          },30000);
        }
      });
      contentdiv.innerHTML = '';
      contentdiv.innerHTML = `
<h1>Type in the song you will Tap Out!</h1>
<h2>Include the song name and author(If there is one)!</h2>
<input id="songname" type="text" placeholder="Ex: 'Sugar' by Maroon 5">
<button id="picked">Submit!</button>
`;
      var songbox = $('#songname')[0];
      var pickbutton = $('#picked')[0];
      pickbutton.addEventListener('click', function(){
        if(songbox.value != ''){
          roomRef.child('/songs/' + firebase.auth().currentUser.uid).update({title: songbox.value});
        }
      });
    }
    if(snapshot.val()== 'tapping'){
      contentdiv.innerHTML = '';
      $.ajax({
        type: "POST",
        url: "/taphtml",
        data: {},
        success: function(d) {
          contentdiv.innerHTML = d;
          tapper = document.getElementById("tapper");
          taplist = [];
          startTime = Date.now();
          endTime = startTime + 10000;
          game = true;
          timer = setInterval(gameover, 500);
          audio = document.createElement('audio');
          audio.src = '/static/audio/drum.wav';
          audio.volume = 0.5;

          tapper.addEventListener("click", buttonTapped);
          $("body")[0].addEventListener("keyup", buttonTapWrap);
        }
    });
    }
  });

});


var leaveRoom = function() {
  var users;
  currentUsers.once('value').then(function(userlist) {
    users = userlist.val();
    console.log(users);
    users.splice(users.indexOf(firebase.auth().currentUser.uid),1);
    console.log(users);
    if (users.length == 0){
      db.ref("rooms/" + roomId).remove();
    }
    else{
      console.log(users);
      roomRef.update({currentUsers : users});

    }
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  });
};

var startGame = function(){
  roomRef.update({state: 'started'});
};

leavebutton.addEventListener('click',function(){
  document.location.pathname = '/';
});

startbutton.addEventListener('click', startGame);


window.onunload = leaveRoom;
