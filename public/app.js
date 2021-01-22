
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

socket.on("chat-connect", (data) => {
 
    // var soketloop =data.profile    // var loop = response.data.tweet
    // for (var i = 0; i <data.profile.length; i++) {
        // alert(response.data[i]);
        // console.log(data[i]);
        // console.log(loop[i].msg);
        // console.log(loop[i].createdOn);
        // console.log(`" email " ${soketloop[i].email}" message "${soketloop[i].msg}" time "${soketloop[i].createdOn}`);
        var post = document.getElementById('welcomeUser')
        var litext = document.createElement('li')
        var litex=document.createTextNode(`" name=> "${data.name}" massage=> "${data.msg} " time=> "${moment(data.createdOn).fromNow()}`);
        litext.appendChild(litex)
        litext.setAttribute("class", "realclass");
            
        post.appendChild(litext)
        // console.log(`${data.name}${"====Raza"}`);
       
        console.log(data.email,"email");
        console.log(data.createdOn,"time");
        console.log(data.msg,"message");
        console.log(data.name,"name");
        console.log(data,"data");
    // }
    // console.log(response.data.tweet, "realtimechat");

    // var post = document.getElementById('posts')
    // var litext = document.createElement('li')
    // var litex = document.createTextNode(data);
    // litext.appendChild(litex)
    // post.appendChild(litext)

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
                console.log(data,"Dasdsad");
                document.getElementById("username").innerHTML=data.profile.name
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
            // email: "faizeraza2468@gmail.com",
        }
    }).then((response) => {
        // getProfile()
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
        var loop = response.data.tweet
        // console.log(data,"dadada");
        for (var i = 0; i < loop.length; i++) {
            // alert(response.data[i]);
            // console.log(loop[i].email);
            // console.log(loop[i].msg);
            // console.log(loop[i].createdOn);
            // console.log(`" email " ${loop[i].email}" message "${loop[i].msg}" time "${loop[i].createdOn}`);
            var post = document.getElementById('welcomeUser')
            var litext = document.createElement('li')
            litext.setAttribute("class", "democlass");
            var litex=document.createTextNode(`" name=> "${loop[i].name} " message=> " ${loop[i].msg}" time=> "${moment(loop[i].createdOn).fromNow()}`);
            litext.appendChild(litex);
            post.appendChild(litext);
        }
        // console.log(response.data.tweet, "realtimechat");

    }).catch((error) => {
        console.log(error.message, "no data");
    })


}

// function filesumit(){
//     var file =  document.getElementById("myfile").style.backgroundImage ="url('http://careyofaustin.com/wp-content/uploads/2016/05/car-img.png')";
// console.log(file);

// }
function upload() {

    var fileInput = document.getElementById("fileInput");

    // // To convert a File into Blob (not recommended)
    // var blob = null;
    // var file = fileInput.files[0];
    // let reader = new FileReader();
    // reader.readAsArrayBuffer(file)
    // reader.onload = function (e) {
    //     blob = new Blob([new Uint8Array(e.target.result)], { type: file.type });
    //     console.log(blob);
    // }

    console.log("fileInput: ", fileInput);
    console.log("fileInput: ", fileInput.files[0]);

    let formData = new FormData();
    // https://developer.mozilla.org/en-US/docs/Web/API/FormData/append#syntax

    formData.append("myFile", fileInput.files[0]); // file input is for browser only, use fs to read file in nodejs client
    // formData.append("myFile", blob, "myFileNameAbc"); // you can also send file in Blob form (but you really dont need to covert a File into blob since it is Actually same, Blob is just a new implementation and nothing else, and most of the time (as of january 2021) when someone function says I accept Blob it means File or Blob) see: https://stackoverflow.com/questions/33855167/convert-data-file-to-blob
    formData.append("myName", "malik"); // this is how you add some text data along with file
    formData.append("myDetails",
        JSON.stringify({
            // "userEmail": sessionStorage.getItem("userEmail"),
            "subject": "Science",   // this is how you send a json object along with file, you need to stringify (ofcourse you need to parse it back to JSON on server) your json Object since append method only allows either USVString or Blob(File is subclass of blob so File is also allowed)
            "year": "2021"
        })
    );

    // you may use any other library to send from-data request to server, I used axios for no specific reason, I used it just because I'm using it these days, earlier I was using npm request module but last week it get fully depricated, such a bad news.
    axios({
        method: 'post',
        url: "http://localhost:3001/upload",
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
    })
        .then(res => {
            console.log(`upload Success` + res.data);
        })
        .catch(err => {
            console.log(err);
        })

    return false; // dont get confused with return false, it is there to prevent html page to reload/default behaviour, and this have nothing to do with actual file upload process but if you remove it page will reload on submit -->

}
