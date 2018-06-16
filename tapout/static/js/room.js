var link = window.location.href;
var linkArr = link.split('/');
var roomId = linkArr[linkArr.length-1];
var roomRef = db.ref('/rooms/' + roomId);
var userbox = $('#userbox')[0];
var leavebutton = $('#leave')[0];
var currentUsers = db.ref('/rooms/' + roomId).child('currentUsers');
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

leavebutton.addEventListener('click',function(){
  document.location.pathname = '/';
});

window.onunload = leaveRoom;
