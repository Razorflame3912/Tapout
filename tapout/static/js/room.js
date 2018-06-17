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
        console.log(i);
        var username = '';
        username = userdict[users[i]]['name'];
        console.log(username);
        var userdiv = document.createElement('div');
        userdiv.innerHTML = username;
        userbox.appendChild(userdiv);
      }
    });
  });
  },1000);

  var timekeeper;
  stateRef.on('value', function(snapshot){
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
          console.log(timekeeper);
          console.log(firebase.auth().currentUser.uid);
          if(firebase.auth().currentUser.uid == timekeeper){
            console.log('DAT ME!');
            setTimeout(function(){
              console.log("time's up! updating");
              roomRef.update({state: 'guessing'});
              var scoredic = {};
              currentUsers.once('value').then(function(snap){
                var users = snap.val();
                for(i in users){
                  scoredic[users[i]]  = 0;
                }
                roomRef.child('scores').set(scoredic);
              });
            },10500);
          }





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
    if(snapshot.val() == 'guessing'){
      /* GUESSING CODE HERE */
      contentdiv.innerHTML = `
<h1 id="nameheader"></h1>
<h3>Listen closely!</h3>
<div id="buttons">

</div>


`;
      if(firebase.auth().currentUser.uid == timekeeper){
        console.log('DAT ME!');
        roomRef.child('songs').once('value').then(function(songsnap){
          var songs = songsnap.val();
          console.log(songs);
          var roundlength = 30000;
          var i;
          var count = 0;
          for(i in songs){
            setTimeout(function(){
              roomRef.update({currentSong: i });
            },count*roundlength);
            count++;
          }
          console.log(count);
          setTimeout(function(){
            roomRef.update({state: 'over' });
          }, count * roundlength);
        });
      }
      roomRef.child('songs').once('value').then(function(songs){
        var songdic = songs.val();
        console.log('DIC OF SONGS');
        console.log(songdic);
        roomRef.child('currentSong').on('value', function(usersnap){
          console.log('current user ID: ' + usersnap.val());
          roomRef.child('songs').child(usersnap.val()).child('timetable').once('value').then(function(songsnap){
            var timetable = songsnap.val();
            //console.log('the current song');
            //console.log(song);
            //var timetable = song['timetable'];
            console.log('timetable:');
            console.log(timetable);
            db.ref('users/' + usersnap.val()).child('name').once('value').then(function(namesnap){
              var currentname = namesnap.val();
              console.log('name of currentuser: ' + currentname);
              var header = $('#nameheader')[0];
              var buttonsdiv = $('#buttons')[0];
              header.innerHTML = currentname + "'s song tapped out!";
              console.log('constructing buttons...');
              console.log(timetable);
              playSeries(timetable);
              if(firebase.auth().currentUser.uid != usersnap.val()){


                console.log(songdic);

                for(i in songdic){
                  var songname = songdic[i]['title'];
                  console.log('songname: ' + songname);
                  //var buttondiv = document.createElement('div');
                  var button = document.createElement('button');
                  button.innerHTML = songname;
                  button.id = i;
                  button.addEventListener('click', function(){
                    console.log(this);
                    //this.style.color = 'yellow';
                    var myid = this.id;
                    var thebutton = this;
                    roomRef.child('scores').once('value').then(function(scores){
                      var scoredic = scores.val();
                      console.log('scores as of rn');
                      console.log(scoredic);
                      console.log(myid);
                      console.log(usersnap.val());
                      if(myid == usersnap.val()){
                        scoredic[usersnap.val()] += 500;
                        scoredic[myid] += 1000;
                        roomRef.update({scores: scoredic});
                        thebutton.style.color = "green";
                      }
                      else{
                        thebutton.style.color = "red";
                      }
                    });
                  });
                  //buttondiv.appendChild(button);
                  buttonsdiv.appendChild(button);
                }
              }
            });
          });
        });
      });



    }

    if(snapshot.val() == 'over')
      document.location.pathname = '/sakljfdls';
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
