var userID;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";
    document.getElementById("content").style.display = "block";
    

    var user = firebase.auth().currentUser;
    if(user != null){
      userID = user.uid;
      var email_id = user.email;
      var displayName = user.displayName;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var providerData = user.providerData;
      document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;
    }
  } else {
    // No user is signed in.
    document.getElementById("user_div").style.display = "none";
    document.getElementById("content").style.display = "none";
    document.getElementById("login_div").style.display = "block";
  }
});

function signup() {
  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;
  firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    window.alert("Error : " + errorMessage);
    // ...
  });
}

function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

    // ...
  });

}

function logout(){
  firebase.auth().signOut();
}

const memoList = document.querySelector("#memo-list");
const form = document.querySelector("#add-memo-form");
//create element and render Memo
function renderMemo() {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let desc = document.createElement("span");
  let cross = document.createElement("div");
  let edit = document.createElement("span");

  var docRef = db.collection("memos");

  docRef.get().then(function(doc) {
      if (doc.exists) {
          console.log("Document data:", doc.data());
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
  li.setAttribute("data-id", docRef.data().uid);
  name.textContent = docRef.data().name;
  desc.textContent = docRef.data().desc;
  cross.textContent = "X";

  if (docRef.data().uid == userID) {
    li.appendChild(name);
    li.appendChild(desc);
    li.appendChild(cross);
  }

  memoList.appendChild(li);

  // deleting data
  cross.addEventListener("click", e => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    //find a doc on the dom
    db.collection("memo")
      .doc(id)
      .delete();
  });
}

// // getting data
// db.collection("memo")
//   .get()
//   .then(snapshot => {
//     snapshot.docs.forEach(doc => {
//       renderMemo(doc);
//     });
//   });

// // ordering data
// db.collection("memo")
// .where("desc", "<", "d")
//   .orderBy("desc")
//   .get()
//   .then(snapshot => {
//     snapshot.docs.forEach(doc => {
//       renderMemo(doc);
//     });
//   });

// // making queries
// db.collection("memo")
//   // .where("desc", "==", "Calabar")
//   .where("desc", "<", "d")
//   .get()
//   .then(snapshot => {
//     snapshot.docs.forEach(doc => {
//       renderMemo(doc);
//     });
//   });

// saving data
form.addEventListener("submit", e => {
  e.preventDefault();
  db.collection("memo").add({
    uid: userID,
    name: form.name.value,
    desc: form.desc.value
  });
  form.name.value = "";
  form.desc.value = "";
});


// db.collection('memo').get().then((snapshot) => {

//   snapshot.docs.forEach(doc => {
//     console.log(doc.data())
//   })
// });