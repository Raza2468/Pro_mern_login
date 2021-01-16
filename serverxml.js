
var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var morgan = require("morgan");
var jwt = require('jsonwebtoken'); // https://github.com/auth0/node-jsonwebtoken
//is JWT secure? https://stackoverflow.com/questions/27301557/if-you-can-decode-jwt-how-are-they-secure
var path = require("path")
var { getUser } = require("./dberor/models")
var authRoutes = require("./routes/auth");
// var { ServerSecretKey } = require("./core/index")

console.log("getUser: ", getUser);

var ServerSecretKey = process.env.SECRET || "123";

let appxml = express()


appxml.use(bodyParser.json());
appxml.use(cookieParser());
appxml.use(cors({
    origin: '*',
    credentials: true
}));
appxml.use(morgan('dev'));


// appxml.use(cors());
// appxml.use(bodyParser.urlencoded({ extended: true }));
appxml.use("/", express.static(path.resolve(path.join(__dirname, "public"))));
// var server = http.createServer(app);
// =========================>

appxml.use("/auth", authRoutes)


appxml.use(function (req, res, next) {

    console.log("req.cookies: ", req.cookies);
    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }
    jwt.verify(req.cookies.jToken, ServerSecretKey, function (err, decodedData) {
        if (!err) {

            const issueDate = decodedData.iat * 1000;
            const nowDate = new Date().getTime();
            const diff = nowDate - issueDate; // 86400,000

            if (diff > 300000) { // expire after 5 min (in milis)
                res.status(401).send("token expired")
            } else { // issue new token
                var token = jwt.sign({
                    id: decodedData.id,
                    name: decodedData.name,
                    email: decodedData.email,
                }, ServerSecretKey)
                res.cookie('jToken', token, {
                    maxAge: 86_400_000,
                    httpOnly: true
                });
                req.body.jToken = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
})


// ==========================================>Start Get Profile /////
appxml.get("/profile", (req, res, next) => {

    console.log(req.body.jToken.id)

    getUser.findById(req.body.jToken.id, 'name email phone gender createdOn',
        function (err, doc) {
            if (!err) {
                res.send({
                    profile: doc
                })
            } else {
                res.status(500).send({
                    message: "server error"
                })
            }
        })
})


// ==========================================>Server /////
var PORT = process.env.PORT || 3001
appxml.listen(PORT, () => {
    console.log("chal gya hai server", PORT)
})
// ==========================================>Server End/////



// var express = require("express");
// var path = require("path");
// var cors = require('cors');
// var morgan = require('morgan');
// var bodyParser = require('body-parser');
// var http = require("http");
// var socketIO = require('socket.io');


// var app= express()
// app.use(cors())
// app.use(morgan('dev'))
// app.use(bodyParser.json())

// var PORT = process.env.PORT || 3001


// app.get('/',(res,req,next)=>{
//     req.send("<h1>Server</h1>")

// })

// app.use("/", express.static(path.resolve(path.join(__dirname,'public'))))
// var server = http.createServer(app);

// const io = socketIO(server);

// // io.on('connection', user=> {console.log("clint id",user.id);});
// // io.on('disconnect', user=>{console.log("dissconect id",user.id);});

// io.on('connection', user => {
        
// console.log("connection id",user.id);
// // user.broadcast.emit("user-id",user)

// user.on('send-message',(message)=>{
//     console.log("message",message);
//     user.broadcast.emit("chat-connect",message)




// })

// user.on('disconnect', () => { console.log("disconnect id",user.id);});
// });

// server.listen(PORT,()=>{
// console.log("Server",PORT);
// })