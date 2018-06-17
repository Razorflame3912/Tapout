var namebar = $('#namebar')[0];
var createbar = $('#namebar-create')[0];
var codebar = $('#codebar')[0];
var joinbutton = $('#joinbutton')[0];
var createbutton = $('#createbutton')[0];
var username = '';
var create = false;
var join = false;
console.log('HOMEJS IMPORTED');
console.log(firebase.auth().currentUser);
console.log(firebase.auth().currentUser);

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)

  .then(function() {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // New sign-in will be persisted with session persistence.
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorMessage = error.message;
    var errorCode = error.code;
  });

var createRoom = function(){
  create = true;
  console.log('create room pressed.');
  if(createbar.value != ''){
    username = createbar.value;
    firebase.auth().signInAnonymously().catch(function(error) {
      console.log('signing in');
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  }
};

var joinRoom = function(){
  join = true;
   if(namebar.value != ''){
    username = namebar.value;
    firebase.auth().signInAnonymously().catch(function(error) {
      console.log('signing in');
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
    });
   }
};

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    if(!create && !join){
      firebase.auth().currentUser.delete().then(function() {
        // User deleted.
      }).catch(function(error) {
        // An error happened.
      });

    }
    // User is signed in.
    console.log(user);
    var data = {
      name: username
    };
    db.ref("/users").child(firebase.auth().currentUser.uid).set(data);

    var code;

    if(create){
      code = '';
      var chars = '1234567890';
      for(var i=0; i<4; i++){
        var selected = chars[Math.floor(Math.random() * chars.length)];
        code += selected;
      }
      var pushdata = {
        state: 'waiting'
      };
      db.ref('rooms/' + code).set(pushdata);

      document.location.pathname = '/room/' + code;

    }

    if(join){
      code = codebar.value;
      db.ref('/rooms/' + code).once('value').then(function(roomval){
        if(roomval.val() == null){
          console.log('room does not exist');
          $('#error')[0].innerHTML = 'Room does not exist.';
          join = false;
          firebase.auth().currentUser.delete().then(function() {
            // User deleted.
          }).catch(function(error) {
            // An error happened.
          });

        }
        else if(roomval.val()['state'] == 'started'){
          console.log('room has already started game');
          $('#error')[0].innerHTML = 'Room has already started a game.';
          join = false;
          firebase.auth().currentUser.delete().then(function() {
            // User deleted.
          }).catch(function(error) {
            // An error happened.
          });

        }
        else{
          document.location.pathname = '/room/' + code;
        }

      });
    }

  }
  else {
    // No user is signed in.
  }
});

createbutton.addEventListener('click',createRoom);
createbar.addEventListener('keydown',function(e){
  if(e.key == 'Enter'){
    createRoom();
  }
});
joinbutton.addEventListener('click',joinRoom);
codebar.addEventListener('keydown',function(e){
  if(e.key == 'Enter'){
    joinRoom();
  }
});
