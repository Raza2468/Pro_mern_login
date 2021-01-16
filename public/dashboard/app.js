// ============================>>>>>>>>>>>>>>>>

function useridbtn() {
    var url="http://localhost:3001/";
    var socket = io(url)
    var usersoket= document.getElementById("usersoket")
    var userJOIN= document.getElementById("userJOIN").value
let msgi={
    name:userJOIN,
// useri= userJOIN,
// message=msg
}
// appendMessage(msgi,'outgoing')
console.log(msgi);
}
// const username=username.value

let send=()=>{
    // var userJOIN= document.getElementById("userJOIN").value
    const message=usertext.value
    socket.emit('send-message',message)
    // socket.emit('user-id',user)
    var li = document.createElement("li")
    var litext= document.createTextNode(`${message},${"msg"}`)
    list.appendChild(li)
    li.appendChild(litext)  
    console.log(message);
   }
//    const Http = new XMLHttpRequest();
//    Http.open("POST", "http://localhost:3001/");
//    Http.setRequestHeader("Content-Type", "application/json");
//    Http.send(JSON.stringify(arr));
//    Http.onreadystatechange = (e) => {
//        let data = JSON.parse((Http.responseText));
//     console.log(data);
   
//            }


socket.on('chat-connect',(user)=> {
    var li = document.createElement("li")
    var litext= document.createTextNode(`${user},${"Raza"}`)
    li.setAttribute("class", "democlass");

    list.appendChild(li)
    li.appendChild(litext)
    console.log(user);
});
socket.on('disconnect',()=> {
    console.log("disconnect")
});

// socket.on("NOTIFICATION", function(){
//     console.log("notification received");
// })

// socket.on("COMMON_TOPIC", function(message){
//     console.log("comon topic received", message);
// })
