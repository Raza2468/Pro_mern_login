
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
        },
        // withCredentials: true
    })
        .then(function (response) {
            console.log(response.data.message);
            alert(response.data.message);
            // window.location.href = "profile.html";

            window.location.href = "dashboard/profile.html";
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



// ============================>>>>>>>>>>>>>>>>
// ============================>>>>>>>>>>>>>>>>



