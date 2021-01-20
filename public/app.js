
$(document).ready(function () {
    $("#myBtn").click(function () {
        $("#myModal").modal();
    });
});
//  ========>
var modali = document.getElementById('id01');
window.onclick = function (event) {
    if (event.target == modali) {
        modali.style.display = "none";
    }
}
//  ========>
var modale = document.getElementById('id01e');
window.onclick = function (event) {
    if (event.target == modale) {
        modale.style.display = "none";
    }
}
//  ========>
//  ========>
//  ========>


var socket = io("http://localhost:3001");

socket.on('connect', function () {
    console.log("I am connected");



    
});

socket.on("chat-connect", (user) => {
    console.log(`${user}${"Raza"}`);
    // console.log(newPOST.tweet);
    // console.log(newPOST.email);
    // console.log(newPOST.name);
})

const sub = () => {
    let namei = document.getElementById("name").value
    let emaili = document.getElementById("email").value
    let passwordi = document.getElementById("password").value

    axios({
        method: 'post',
        // url: 'https://databaselogin.herokuapp.com/auth/signup',
        url: 'http://localhost:3001/auth/signup',
        data: {
            name: namei,
            email: emaili,
            password: passwordi,
        },

        // withCredentials: true
    })
        .then(function (response) {
            console.log(response.data.message);
            alert(response.data.message);

        })
        .catch(function (error) {

            alert(error)

        });

    return false;
}

// ============>


let sin = () => {
    var email = document.getElementById("emailsin").value
    var password = document.getElementById("passwordsin").value;

    axios({
        method: 'post',
        url: 'http://localhost:3001/auth/login',
        // url: 'https://databaselogin.herokuapp.com/auth/login',
        data: {
            email: email,
            password: password,
            // token:token
        },

        // withCredentials: true
    })
        .then(function (response) {
            console.log(response.data.message);
            alert(response.data.message);
            // window.location.href = "profile.html";

            window.location.href = "profile.html";
        })
        .catch(function (error) {

            alert(error.message)

        });
    return false;

}

// ==============>//====================>

// ========= emailotp

function emailotp() {
    var email = document.getElementById("emotp");
    console.log(email);

    axios({
        method: 'post',
        url: 'http://localhost:3001/auth/forget-password',
        // url: 'https://databaselogin.herokuapp.com/auth/login',
        data: {
            email: email.value,
        },
        // withCredentials: true
    })
        .then(function (response) {
            console.log(response.data.message);
            alert(response.data.message);
            alert(response.user);
            // console.log(response.data.token);
            // window.location.href = "profile.html";

            // window.location.href = "profile.html";
        })
        .catch(function (error) {

            alert(error.message)

        });
    return false;

}
// ================ conform

function conform() {
    var otp = document.getElementById("otpcon").value
    var email = document.getElementById("emailcon").value
    var newPassword = document.getElementById("newPassword").value
    console.log(otp);
    console.log(email);
    console.log(newPassword);
    axios({
        method: 'post',
        url: 'http://localhost:3001/auth/forget-password-step-2',
        // url: 'https://databaselogin.herokuapp.com/auth/login',
        data: {
            otp: otp,
            email: email,
            newPassword: newPassword,
        },
        // withCredentials: true
    })
        .then(function (response) {
            console.log(response.data.message);
            alert(response.data.message);
            // window.location.href = "profile.html";

            // window.location.href = "/dashboard/profile.html";
        })
        .catch(function (error) {

            alert(error.message)

        });
    return false;

}

// =======================================================================================

function getProfile() {

    const Http = new XMLHttpRequest();
    Http.open("GET", "http://localhost:3001/getProfile");
    Http.send();
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4) {
            if (Http.status === 200) {
                var date = moment(new Date("03/25/2015")).fromNow();
                console.log("date==> " + date);
                console.log("response==> " + Http.responseText);
                createdOn = moment(Http.responseText.createdOn).fromNow();
                console.log(createdOn);
                realtimechat();
                data = JSON.parse((Http.responseText));
                console.log(data);
            }
            else {
                alert("Session expired");
                window.location.href = "index.html";
            }
        }
    }



}


// ============================>>>>>>>>>>>>>>>>
// ============================>>>>>>>>>>>>>>>>


// user=>app=>serverv
function profilePOST() {
    var tweet = document.getElementById("usertext").value;
    axios({
        method: "POST",
        url: "http://localhost:3001/profilePOST",
        data: {
            tweet: tweet,
            email: "faizeraza2468@gmail.com",
        }
    }).then((response) => {
        // realtimechat()
    }).catch((error) => {
        console.log(error.message);
    })
    // return false;
}


// ==================
function realtimechat() {

    axios({
        method: "GET",
        url: "http://localhost:3001/realtimechat",

    }).then((response) => {
        console.log(response, "realtimechat");
    }).catch((error) => {
        console.log(error.message, "no data");
    })


}

