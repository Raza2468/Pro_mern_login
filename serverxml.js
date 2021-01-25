
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
var { getUser, tweet, profilepic } = require("./dberor/models")
// var serviceaccount = require("./firebase/firebase.json")

var ServerSecretKey = process.env.SECRET || "123";

let appxml = express()

appxml.use(bodyParser.json());
appxml.use(cookieParser());
appxml.use(cors({
    origin: '*',
    credentials: true
}));
appxml.use(morgan('dev'));


// Firebase bucket
////// For sending file to mongoose
const fs = require('fs')
const multer = require("multer");
const admin = require("firebase-admin");
//==============================================
const storage = multer.diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.filename}.${file.mimetype.split("/")[1]}`)
    }
})
//==============================================
var upload = multer({ storage: storage })
var serviceAccount = require("./firebase/firebase.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://delete-this-1329.firebaseio.com"
});
// const bucket = admin.storage().bucket("gs://delete-this-1329.appspot.com");
const bucket = admin.storage().bucket("gs://firestore-28544.appspot.com");
// mongodb+srv://faiz:2468@mundodb.lkd4g.mongodb.net/ttest?retryWrites=true&w=majority


// ===============
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
                req.headers.jToken = decodedData;
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
    if (!req.body.tweet) {
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
        console.log(req.body),
        (err, user) => {
            if (!err) {
                console.log("tweet user : " + user);
                tweet.create({
                    name: user.name,
                    email: user.email,
                    msg: req.body.tweet,
                }).then((data) => {
                    console.log("Tweet created: " + data),
                        res.status(200).send({
                            msg: req.body.tweet,
                            name: data.name,
                            email: data.email,
                        });
                    // io.emit("chat-connect",data)
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



var PORT = process.env.PORT || 3001

var server = http.createServer(appxml);
var io = socketIo(server, { cors: { origin: "*", methods: "*", } });



appxml.post("/upload", upload.any(), (req, res, next) => {  // never use upload.single. see https://github.com/expressjs/multer/issues/799#issuecomment-586526877

    console.log("req.body: ", req.body);
    console.log("req.body: ", JSON.parse(req.body.myDetails));
    console.log("req.files: ", req.files);

    console.log("uploaded file name: ", req.files[0].originalname);
    console.log("file type: ", req.files[0].mimetype);
    console.log("file name in server folders: ", req.files[0].filename);
    console.log("file path in server folders: ", req.files[0].path);

    // upload file to storage bucket 
    // you must need to upload file in a storage bucket or somewhere safe
    // server folder is not safe, since most of the time when you deploy your server
    // on cloud it makes more t2han one instances, if you use server folder to save files
    // two things will happen, 
    // 1) your server will no more stateless
    // 2) providers like heroku delete all files when dyno restarts (their could be lots of reasons for your dyno to restart, or it could restart for no reason so be careful) 


    // https://googleapis.dev/nodejs/storage/latest/Bucket.html#upload-examples
    bucket.upload(
        req.files[0].path,
        // {
        //     destination: `${new Date().getTime()}-new-image.png`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
        // },
        function (err, file, apiResponse) {
            if (!err) {
                // console.log("api resp: ", apiResponse);

                // https://googleapis.dev/nodejs/storage/latest/Bucket.html#getSignedUrl
                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {
                    if (!err) {

                        getUser.findById(req.headers.jToken.id, (err, userData) => {
                            userData.update({ profileUrl: urlData[0] }, (err, updated) => {
                                if (!err) {
                                    res.status(200).send({
                                        profileUrl: urlData[0],
                                    })
                                }
                            })



                        })


                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });
})
// .then((doc) => {
// client.sendEmail({
//     "From": "faiz_student@sysborg.com",

//     "To": req.body.email,
//     "Subject": "Reset your password",
//     "TextBody": `Here is your pasword reset code: ${otp}`
// })
// })
// .then((status) => {
//     console.log("status: ", status);
//     res.send
//         ({
//       console.log();
//             // message: "email sent with otp",
//         })
// })

// // delete file from folder before sending response back to client (optional but recommended)
// // optional because it is gonna delete automatically sooner or later
// // recommended because you may run out of space if you dont do so, and if your files are sensitive it is simply not safe in server folder
// try {
//     fs.unlinkSync(req.files[0].path)
//     //file removed
// } catch (err) {
//     console.error(err)
// }



// ==========================================>Server /////




server.listen(PORT, () => {
    console.log("chal gya hai server", PORT)
})
// ==========================================>Server End/////


