
var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var morgan = require("morgan");
var jwt = require('jsonwebtoken'); // https://github.com/auth0/node-jsonwebtoken
//is JWT secure? https://stackoverflow.com/questions/27301557/if-you-can-decode-jwt-how-are-they-secure
var path = require("path")
var authRoutes = require("./routes/auth");
var { ServerSecretKey } = require("./core/index")
var socketIo = require("socket.io");
var http = require("http");
var { getUser, tweet } = require("./dberor/models")


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

            const issueDate = decodedData.iat * 1000; // javascript ms 13 digits me js me, mger iat deta hai 16 digit ka
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
appxml.get("/getProfile", (req, res, next) => {
    console.log("my tweets user=>", req.body);
    getUser.findById(req.body.jToken.id,
        // getUser.findById({ email: req.body.jToken.email },
        (err, doc) => {
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
});



appxml.post("/profilePOST", (req, res, next) => {

    console.log(req.body.jToken.id)
    console.log(req.body.tweet)
    // if (!req.body.name || !req.body.email || !req.body.tweet) {

    console.log("req body of tweet ", req.body);
    if (!req.body.email || !req.body.tweet) {
        res.status(409).send(`
                Please send useremail and tweet in json body
                e.g:
                "name": "name",
                "email": "abc@gmail.com",
                "text": "abc"
            `)
        return;
    };
    getUser.findById(req.body.jToken.id,
        (err, user) => {
            if (!err) {
                console.log("tweet user : " + user);
                tweet.create({
                    email: req.body.email,
                    msg: req.body.tweet,
                }).then((data) => {
                    console.log("Tweet created: " + data),
                        res.status(200).send({
                            // msg: "tweet",
                            name: user.name,
                            email: user.email,
                        });
                    // io.broadcast.emit("chat-connect",data)
                    io.emit("chat-connect", data)
                }).catch((err) => {
                    res.status(500).send({
                        message: "an error occured : " + err,
                    });
                });
            }
            else {
                res.status.send({
                    message: "an error occured" + err,
                })
            }
        })
});


appxml.get('/realtimechat', (req, res, next) => {
    tweet.find({}, (err, data) => {
        if (!err) {
            console.log("tweetdata=====>", data);
            res.send({
                tweet: data,
            });
        }
        else {
            console.log("error : ", err);
            res.status(500).send("error");
        }
    })
});


// appxml.get("/myTweets", (req, res, next) => {
//     console.log("my tweets user=>",req.body);
//     tweet.find({useremail : req.body.jToken.email},(err,data)=>{
//       if(!err)
//       {
//           console.log("tweet data=>",data);
//           res.status(200).send({
//               tweets : data,
//           });
//       }
//       else{
//           console.log("error : ",err);
//           res.status(500).send("error");
//       }
//     })
//   });





var PORT = process.env.PORT || 3001

var server = http.createServer(appxml);
var io = socketIo(server, { cors: { origin: "*", methods: "*", } });

io.on("connection", () => {
    console.log("user connected");

    io.emit("chat-connect", {name: "gtgfdg"})
})




// io.on('connection', user => {
//     console.log("connection id", user.id);
//     // user.broadcast.emit("user-id",user)
//     user.on('send-message', (message) => {
//         console.log("message", message);
//         // user.broadcast.emit("chat-connect",message)
//     })
// })
// ==========================================>Server /////

server.listen(PORT, () => {
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

// io.on('connection', user=> {console.log("clint id",user.id);});
// io.on('disconnect', user=>{console.log("dissconect id",user.id);});

// io.on('connection', user => {

// console.log("connection id",user.id);
// // user.broadcast.emit("user-id",user)

// user.on('send-message',(message)=>{
//     console.log("message",message);
//     user.broadcast.emit("chat-connect",message)




// })

// user.on('disconnect', () => { console.log("disconnect id",user.id);});
// });

