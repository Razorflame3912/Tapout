var link = window.location.href;
var linkArr = link.split('/');
var roomId = linkArr[linkArr.length-1];
var roomRef = db.ref('/rooms/' + roomId);
var stateRef = db.ref('/rooms/' + roomId).child('state');
var contentdiv = $('#content')[0];
var userbox = $('#userbox')[0];
var leavebutton = $('#leave')[0];
var startbutton = $('#start')[0];
var start;
var currentUsers = db.ref('/rooms/' + roomId).child('currentUsers');
var intvl;
var shuffle = function(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
};
var decoys = [
  'By My Side', 'Treat You Better', "Stitches", "Despacito", "Baby",'Hey Jude', 'Take on Me by a-ha', 'The Star Spangled Banner', 'Star Wars Theme',"Beethoven's 5th Symphony", 'Ode to Joy', 'Thriller by Michael Jackson', "Say You Won't Let Go by James Arthur", "Can I Be Him by James Arthur", 'Love Runs Out by OneRepublic', 'Viva La Vida','Pokemon Theme Song', 'Mario Theme', 'Kirby Theme', 'The Duck Song', 'Demons by Imagine Dragons',"It's Not Like I Like You by Static-P", "7 Years","Wavin' Flag by K'NAAN","Waka Waka by Shakira","America the Beautiful","God Bless America","USSR National Anthem","Sorry by Justin Bieber","Love Yourself","Back to December by Taylor Swift","Shake it Off","Firework","Dynamite by Taio Cruz","500 Miles by The Proclaimers","A Thousand Miles by Vanessa Carlton","Party in the USA", "Stay With Me","I Miss the Misery by Halestorm","Drive By by Train","Hey Soul Sister by Train","Marry Me by Train","Happy Birthday","Jingle Bells","Twinkle Twinkle Little Star", "Mary had a Little Lamb","Row, Row, Row Your Boat","What Makes You Beautiful by One Direction","So What by PINK","I Want It That Way by The Backstreet Boys", "Cheerleader by Ne-Yo","Happy by Pharrell Williams","Pompeii by Bastille","All Star","Mustache by Harry Harvey","Ugandan National Anthem","I Told You So by Kelly Macks","Some Nighs by fun","The Nights by Avicii","Gangnam Style","Pomp & Circumstance","The Wedding Song","Kids in the Dark by All Time Low","11 Blocks by Wrabel","You Fooled by Divided by Friday","Centuries by Fallout Boy","Sugar by Maroon 5","Payphone", "Moves Like Jagger", "Stressed Out by Twenty One Pilots", "Hello by Adele", "Imperial March", "Undertale Theme","Wii Music","Spiderman Theme Song","House of Gold by Twenty One Pilots","Bullet by Hollywood Undead","Fireflies", "I Really Like You by Carly Rae Jaepsen","Arthur Theme Song","Sesame Street Theme Song","Gravity Falls Theme Song","Ride of the Valkyries","1812 Overture","Pon Pon Pon","Cotton Eye Joe","Never Gonna Give You Up","Da Ba Dee","Perfect by Ed Sheeran","Castle on the Hill by Ed Sheeran","Photograph by Ed Sheeran","Thinking Out Loud by Ed Sheeran","Hotline Bling","Wake Me Up by Avicii","Down by J-Shawn", "La Cucaracha", "Indiana Jones theme song", "Counting Stars", "Hallelujah","the coconut song", "let it go", "can you feel the love tonight by elton john", "don't stop believing", "livin' on a prayer", "eye of the tiger", "Get lucky by Daft Punk","bohemian rhapsody","the final countdown","we are the champions by queen","bad by michael jackson", "can't help falling in love", "the alphabet song", "dj got us falling in love again", "glad you came", "bad romance by lady gaga", "born this way by lady gaga", "the macarena", "amazing grace", "applause", "best day ever by spongebob", "the fun song", "i can show you the world by aladdin", "under the sea", "six trillion years and overnight story", "you've got a friend in me"
];

var badchars = "<>/\\";
var sanitize = function(input){
  //var temp = input;
  if(input == null || input.length == 0 || input == " "){
    return "null";
  }
  for(var c in badchars){
    while (input.indexOf(badchars[c]) != -1) {
      input = input.replace(badchars[c], '');
    }
  }
  return input;
};

roomRef.child('state').once('value').then(function(stateval){
  if(stateval.val() != "waiting"){
    document.location.pathname = '/';
  }
});

$('#codeh1')[0].innerHTML += (' ' + roomId);
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
          userdiv.innerHTML = sanitize(username);
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
          },35000);
        }
      });
      contentdiv.innerHTML = '';
      contentdiv.innerHTML = `
<h1>Type in the song you will Tap Out in a few seconds!</h1>
<h4>Include the song name and author (If there is one)!</h4>
<div id="form">
<input id="songname" type="text" placeholder="Ex: 'Sugar' by Maroon 5">
<button id="picked" class="btn">Submit!</button>
</div>
<p id="timer">35</p>
`;
      var songbox = $('#songname')[0];
      var pickbutton = $('#picked')[0];
      intvl = setInterval(function(){
        $('#timer')[0].innerHTML = parseInt($('#timer')[0].innerHTML) - 1;
      },1000);
      songbox.addEventListener('keydown', function(e){
        if(e.key=="Enter"){
          if(songbox.value != ''){
            roomRef.child('/songs/' + firebase.auth().currentUser.uid).update({title: songbox.value});
          }
          songbox.remove();
          pickbutton.remove();
          $('#form')[0].innerHTML = `
<p><i>Submitted your choice of song!</i></p>

`;
        }
      });
      pickbutton.addEventListener('click', function(){
        if(songbox.value != ''){
          roomRef.child('/songs/' + firebase.auth().currentUser.uid).update({title: songbox.value});
        }
        songbox.remove();
        pickbutton.remove();
        contentdiv.innerHTML += `
<p><i>Submitted your choice of song!</i></p>

`;
      });
      /*pickbutton.addEventListener('touchend', function(){
       if(songbox.value != ''){
       roomRef.child('/songs/' + firebase.auth().currentUser.uid).update({title: songbox.value});
       }
       songbox.remove();
       pickbutton.remove();
       contentdiv.innerHTML += `
       <p><i>Submitted your choice of song!</i></p>

       `;
       });*/
    }
    if(snapshot.val()== 'tapping'){
      clearInterval(intvl);
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
                for(var i in users){
                  scoredic[users[i]]  = 0;
                }
                roomRef.child('scores').set(scoredic);
              });
            },20000);
          }





          contentdiv.innerHTML = (d + '<p id="timer">20</p>');
          intvl = setInterval(function(){
            $('#timer')[0].innerHTML = parseInt($('#timer')[0].innerHTML) - 1;
          },1000);
          roomRef.child('/songs/' + firebase.auth().currentUser.uid).once('value').then(function(data){
            if(data.val() == null){
              var p = document.createElement('p');
              p.innerHTML = "You didn't select a song! Tap out Happy Birthday now!";
              roomRef.child('/songs/' + firebase.auth().currentUser.uid).update({title: 'Happy Birthday'});
              contentdiv.appendChild(p);

            }
          });
          tapper = document.getElementById("tapper");
          taplist = [];
          startTime = Date.now();
          endTime = startTime + 20000;
          game = true;
          timer = setInterval(gameover, 500);
          audio = document.createElement('audio');
          audio.src = '/static/audio/drum.wav';
          audio.volume = 0.5;

          tapper.addEventListener("click", buttonTapped);
          //tapper.addEventListener("touchend", buttonTapped);
          $("body")[0].addEventListener("keyup", buttonTapWrap);







        }
      });
    }
    if(snapshot.val() == 'guessing'){
      /* GUESSING CODE HERE */
      clearInterval(intvl);
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
          /*for(i in songs){
           console.log(count);
           console.log(i);
           setTimeout(function(){
           console.log('transferring to ' + i);
           roomRef.update({currentSong: i });
           },count*roundlength);
           count++;
           }*/
          var li = [];
          for(i in songs){
            li.push(i);
          }
          for(i in li){
            setTimeout(function(){
              roomRef.update({currentSong: li[0]});
              li.shift();
            },roundlength*i);
          }
          console.log(count);
          setTimeout(function(){
            roomRef.update({state: 'over' });
          }, li.length * roundlength);
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
              clearInterval(intvl);
              buttonsdiv.innerHTML = '';
              header.innerHTML =  sanitize(currentname) + "'s song is being tapped out!";
              console.log('constructing buttons...');
              console.log(timetable);
              playSeries(timetable);
              start = Date.now();
              var clicked = false;
              if(firebase.auth().currentUser.uid != usersnap.val()){


                console.log(songdic);
                var answer = document.createElement('button');
                answer.className = "btn answer-choice";
                answer.innerHTML = sanitize(songdic[usersnap.val()]['title'].toLowerCase());
                answer.id = usersnap.val();
                var j;
                for(var x in songdic){
                  if(x != usersnap.val()){
                    decoys.push(songdic[x]['title']);
                    shuffle(decoys);
                  }
                }
                var rand = Math.floor(Math.random() * 5);
                for(j=0; j<5; j++){
                  var songname = decoys[0].toLowerCase();
                  decoys.shift();
                  while(songname == songdic[usersnap.val()]['title']){
                    songname = sanitize(decoys[0].toLowerCase());
                    decoys.shift();
                  }
                  console.log('songname: ' + songname);
                  //var buttondiv = document.createElement('div');
                  var button = document.createElement('button');
                  button.className = "btn";
                  var guys = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                  var buttid = '';
                  for(var t =0;t<28;t++){
                    var selected = guys[Math.floor(Math.random() * guys.length)];
                    buttid += selected;
                  }
                  button.innerHTML = sanitize(songname);
                  button.id = buttid;
                  button.className = "btn answer-choice";
                  var buttclick = function(){
                    console.log('he pushed my buttons');
                    console.log(clicked);
                    if(!clicked){
                      clicked = true;
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
                          var now = Date.now();
                          roomRef.child('scores').child(usersnap.val()).once('value').then(function(snap){
                            var snapscore = snap.val()+500;
                            roomRef.child('scores').child(usersnap.val()).set(snapscore);
                          });
                          roomRef.child('scores').child(firebase.auth().currentUser.uid).once('value').then(function(snap){
                            console.log(now-start);
                            var snapscore = snap.val()+(1000 - (15*(Math.floor((now-start)/1000))));
                            console.log(snapscore);
                            roomRef.child('scores').child(firebase.auth().currentUser.uid).set(snapscore);
                          });
                          /*scoredic[usersnap.val()] += 500;
                           scoredic[myid] += 1000;
                           roomRef.update({scores: scoredic});*/
                          thebutton.style.backgroundColor = "green";
                        }
                        else{
                          thebutton.style.backgroundColor = "red";
                        }

                        //thebutton.style.backgroundColor = "green";
                        var correcto = $('#' + usersnap.val())[0];
                        correcto.style.backgroundColor = "green";

                      });
                    }
                  };
                  button.addEventListener('click', buttclick);
                  answer.addEventListener('click', buttclick);
                  //button.addEventListener('touchend', buttclick);
                  //answer.addEventListener('touchend', buttclick);
                  if(j==rand){
                    buttonsdiv.appendChild(answer);
                    buttonsdiv.appendChild(document.createElement('br'));
                  }
                  //buttondiv.appendChild(button);
                  buttonsdiv.appendChild(button);
                  buttonsdiv.appendChild(document.createElement('br'));
                }
              }
              buttonsdiv.appendChild(document.createElement('br'));
              var timer = document.createElement('p');
              timer.id = 'timer';
              timer.innerHTML = 30;
              buttonsdiv.appendChild(timer);
              intvl = setInterval(function(){
                $('#timer')[0].innerHTML = parseInt($('#timer')[0].innerHTML) - 1;
              },1000);

            });
          });
        });
      });



    }

    if(snapshot.val() == 'over'){
      contentdiv.innerHTML = `
<h1>Final Scores!</h1>
<div id="scores">

</div>
<br>
<button id="leave" class="btn button">Back to Homepage</button>
`;
      roomRef.child('scores').orderByValue().once('value').then(function(data){
        var ranklist = [];
        var scorelist = [];
        data.forEach(function(data) {
          ranklist.push(data.key);
          scorelist.push(data.val());
        });
        ranklist.reverse();
        scorelist.reverse();
        var namelist = [];
        db.ref('/users').once('value').then(function(users){
          for(var i in ranklist){
            namelist.push(users.val()[ranklist[i]]['name']);
          }
          for(var l = 0;l<ranklist.length;l++){
            var rankdiv = document.createElement('div');
            var namediv = document.createElement('div');
            namediv.innerHTML = sanitize(namelist[l]);
            var scorediv = document.createElement('div');
            scorediv.innerHTML = scorelist[l];
            rankdiv.appendChild(namediv);
            rankdiv.appendChild(scorediv);
            $('#scores')[0].appendChild(rankdiv);
          }
          $('#leave')[0].addEventListener('click',function(){
            document.location.pathname = '/';
          });
        });
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
    firebase.auth().currentUser.delete().then(function() {
      // User deleted.
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

/*leavebutton.addEventListener('touchend',function(){
 document.location.pathname = '/';
 });*/

startbutton.addEventListener('click', startGame);

startbutton.addEventListener('touchend', startGame);




window.onunload = leaveRoom;
