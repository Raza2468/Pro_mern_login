

$(document).ready(function () {
    $("#myBtn").click(function () {
        $("#myModal").modal();
    });
});

//  ========>

const sub = () => {
    let namei = document.getElementById("name").value
    let emaili = document.getElementById("email").value
    let passwordi = document.getElementById("password").value


  

    axios({
        method: 'post',
        url: 'http://localhost:3001/auth/signup',
        data : {
            name: namei,
            email: emaili,
            password: passwordi,
        },
    
        // withCredentials: true
    })
    .then(function (response) {
        console.log(response.data.message);
        alert(response.data.message);
        window.location.href = "";

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

    })
    .catch(function (error) {
       
            alert(error.message)
        
    });
    return false;

}

// ==============>//====================>