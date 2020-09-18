var yourname;
var friendname;
var img123;
var notshow = true;
var picturesUrl;
var myid;
var frid;

firebase.auth().onAuthStateChanged(function (user) {
    var uid = user.uid;
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var providerData = user.providerData;

    myid = uid;

    firebase.database().ref('names').child(uid).set({
        name: displayName,
        userPicUrl: photoURL,
        userid : uid
    });
    yourname = displayName;
    picturesUrl = photoURL;

    firebase.database().ref('names').on('child_added', function (data) {

        if (data.val().userPicUrl != picturesUrl) {
            var a = document.getElementById('container1');
            var b = document.createElement('div');
            b.setAttribute('class', 'friends');
            b.setAttribute('onclick', 'toChat(this)')
            b.setAttribute('id' , data.val().userid)
            a.appendChild(b).innerHTML = `<div " style="overflow: hidden; width: 50px; height: 50px; border: 1px solid black; border-radius: 100%;"'><img src="${data.val().userPicUrl}" alt=""></div><h3>${data.val().name}</h3>`
        } else if (data.val().userPicUrl == picturesUrl) {
            showmsg = true;
        }
    })
});



function toChat(e) {
    var frimg = e.firstChild.innerHTML;
    var frn = e.lastChild.innerText;
    frid = e.id;
    document.getElementById('container1').style.display = 'none';
    document.getElementById('container').style.display = 'block';
    friendname = frn;
    img123 = frimg;
    document.getElementById('top').innerHTML = `<div " style="overflow: hidden; width: 40px; height: 40px; border: 1px solid black; border-radius: 100%;">${img123}</div><h2 style="text-transform: capitalize;">${friendname}</h2><p onclick="signout()" style="cursor: pointer; padding: 5px; background-color: red; position: absolute; right: 5px; top: 10px;">LogOut</p>`

    firebase_DB.ref(`messages/${yourname + myid + friendname + frid}`).on('child_added', function (msg) {

        if (msg.val().sender == yourname) {

            if (msg.val().message == 'This Message Was Deleted') {
                var allmessagesbox = document.getElementById('msgbox');
                var singlemsgmain = document.createElement('div');
                singlemsgmain.setAttribute('class', 'messagesendmain');
                var singlemsginner = document.createElement('div');
                singlemsginner.setAttribute('class', 'sendmsg');
                singlemsginner.style.backgroundColor = 'red';
                allmessagesbox.appendChild(singlemsgmain).appendChild(singlemsginner).innerHTML = `<p>${msg.val().message}</p>`
            } else {
                var allmessagesbox = document.getElementById('msgbox');
                var singlemsgmain = document.createElement('div');
                singlemsgmain.setAttribute('class', 'messagesendmain');
                var singlemsginner = document.createElement('div');
                singlemsginner.setAttribute('class', 'sendmsg');
                allmessagesbox.appendChild(singlemsgmain).appendChild(singlemsginner).innerHTML = `<p>${msg.val().message}</p><button class="deletebtn" onclick="deletemsg(this)" id="${msg.val().id}">Delete</button>`
            }

        } else if (msg.val().sender == friendname) {

            if (msg.val().message == 'This Message Was Deleted') {
                var allmessagesbox1 = document.getElementById('msgbox');
                var singlemsgmain1 = document.createElement('div');
                singlemsgmain1.setAttribute('class', 'messagemain');
                var singlemsginner1 = document.createElement('div');
                singlemsginner1.setAttribute('class', 'sendermsg');
                singlemsginner1.style.backgroundColor = 'red';
                allmessagesbox1.appendChild(singlemsgmain1).appendChild(singlemsginner1).innerHTML = `<p id="${msg.val().id}">${msg.val().message}</p>`
            } else {
                var allmessagesbox1 = document.getElementById('msgbox');
                var singlemsgmain1 = document.createElement('div');
                singlemsgmain1.setAttribute('class', 'messagemain');
                var singlemsginner1 = document.createElement('div');
                singlemsginner1.setAttribute('class', 'sendermsg');
                allmessagesbox1.appendChild(singlemsgmain1).appendChild(singlemsginner1).innerHTML = `<p id="${msg.val().id}">${msg.val().sender}: ${msg.val().message}</p>`
            }

        }

        var scrollonmsg = document.getElementById('msgbox');
        scrollonmsg.scrollTo(0, scrollonmsg.scrollHeight);

    });

    firebase_DB.ref(`messages/${friendname + frid + yourname + myid}`).on('child_changed', function (msg) {
        if (msg.val().message == 'This Message Was Deleted') {
            document.getElementById(msg.val().id).innerText = 'This Message Was Deleted';
            document.getElementById(msg.val().id).parentElement.style.backgroundColor = 'red';
        }
    })
}
yourname;
friendname;

var firebase_DB = firebase.database();




function sendMessage() {
    var messageText = document.getElementById('messagebox');
    var key = firebase_DB.ref(`messages/${yourname + myid + friendname + frid}`).push().key;
    var messageData = {
        sender: yourname,
        id: key,
        message: messageText.value
    }

    if (messageText.value == '') {
        alert('Please Enter Some Message');
    } else {
        firebase_DB.ref(`messages/${yourname + myid + friendname + frid}`).child(key).set(messageData);
        firebase_DB.ref(`messages/${friendname + frid + yourname + myid}`).child(key).set(messageData);
        messageText.value = "";
    }
    return false;
}



function deletemsg(e) {
    var deletemsgdata = {
        sender: yourname,
        id: e.id,
        message: "This Message Was Deleted"
    }
    firebase_DB.ref(`messages/${yourname + myid + friendname + frid}`).child(e.id).set(deletemsgdata);
    firebase_DB.ref(`messages/${friendname + frid + yourname + myid}`).child(e.id).set(deletemsgdata);
    e.previousSibling.innerText = 'This Message Was Deleted';
    e.parentElement.style.backgroundColor = 'red';
    e.remove();
}


var signout = () => {

    firebase.auth().signOut().then(function () {
        window.location.assign('./index.html');
    }).catch(function (error) {
        alert('Error While Logout')
    });

}







