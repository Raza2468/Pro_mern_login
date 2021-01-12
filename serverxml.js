var arr = [
    {
        name: "raza",
        email: "raza@gmail.com",
        password: "1234",
    }
]

let express = require("express")
let cors = require("cors");
const bodyParser = require("body-parser");
var morgan = require("morgan");
const mongoose = require("mongoose");
var bcrypt = require("bcrypt-inzi");
var ServerSecretKey = process.env.SECRET || "123"
const axios = require('axios');
const path = require('path');
const cookieParser = require("cookie-parser");//www.npmjs.com/package/cookie-parser
var jwt = require('jsonwebtoken');// https://github.com/auth0/node-jsonwebtoken
//is JWT secure? https://stackoverflow.com/questions/27301557/if-you-can-decode-jwt-how-are-they-secure











/////////////////////////////////////////////////////////////////////////////////////////////////
// let dbURI = "mongodb+srv://dbuser:dbpassword@cluster0.9qvbs.mongodb.net/abc-database";
let dbURI = "mongodb+srv://faiz:2468@mundodb.lkd4g.mongodb.net/ttest?retryWrites=true&w=majority";
// let dbURI = 'mongodb://localhost:27017/abc-database';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////



var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    gender: String,
    createdOn: { type: Date, 'default': Date.now },
    activeSince: Date,
});

var getUser = mongoose.model("users", userSchema);
module.export = getUser


let appxml = express()
var PORT = process.env.PORT || 3001
appxml.use(cors());
appxml.use(bodyParser.json());
appxml.use(bodyParser.urlencoded({ extended: true }));
appxml.use(morgan('dev'));
appxml.use(cookieParser());

appxml.use("/", express.static(path.resolve(path.join(__dirname, "public"))));

appxml.use(cors({
    origin: '*',
    credentials: true
}));

// =========================>

// =========================>


// ==========================================>CreatE UseR Start /////

appxml.post("/signup", (req, res, next) => {

    if (!req.body.name || !req.body.email || !req.body.password) {

        res.status(403).send(`
            please send name, email, passwod, phone and gender in json body.
            e.g:
            {
                "name": "malik",
                "email": "Razamalika@gmail.com",
                "password": "abc",
                "phone": "03000000000",
                "gender": "Male"
            }`)
        return;
    }
    getUser.findOne({ email: req.body.email },
        function (err, Doc) {
            if (!err && !Doc) {

                bcrypt.stringToHash(req.body.password).then(function (hash) {
                    var newUser = new getUser({
                        "name": req.body.name,
                        "email": req.body.email,
                        "password": hash,
                        // "phone": req.body.phone,
                        // "gender": req.body.gender,
                    })

                    newUser.save((err, data) => {
                        if (!err) {
                            res.send({ message: "user created" })
                            //  status: 200

                        } else {
                            console.log(err);
                            res.status(500).send("user create error, " + err)
                        }
                    })
                })

            } else if (err) {
                res.status(500).send({
                    message: "db error"
                })
            } else {
                res.status(409).send({
                    message: "user alredy access"
                })
            }

        }
    )
})

// ==========================================>C5reat User COmplet $$

// ==========================================>Start LOgin /////



appxml.post('/login', (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        res.status(403).send(
            `please send email and passwod in json body.
            e.g:
             {
            "email": "Razamalik@gmail.com",
            "password": "abc",
         }`)
        return;
    }
    getUser.findOne({ email: req.body.email },
        function (err, user) {
            if (err) {
                res.status(500).send({ message: "an error accure" })
            } else if (user) {
                bcrypt.varifyHash(req.body.password, user.password).then(result => {
                    if (result) {
                        // console.log("matched");
                        var token = jwt.sign({
                            id: user._id,
                            name: user.name,
                            email: user.email,
                        },ServerSecretKey);

                        res.cookie('jToken', token, {
                            maxAge: 86_400_000,
                            httpOnly: true
                        });

                        res.send({
                            message: "login success",
                            user: {
                                name: user.name,
                                email: user.email,
                                phone: user.phone,
                            },
                            token: token
                        })
                    } else {
                        console.log("not matched");
                        res.status(401).send({
                            message: "incorrect password"
                        })
                    }
                })
            } else {
                res.status(403).send({
                    message: "user not found"
                });
            }
        }
    )
})
// ==========================================>C5reat Login COmplet $$ /////



appxml.use(function (req, res, next) {

    console.log("req.cookies: ", req.cookies);
    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }
    jwt.verify(req.cookies.jToken, SERVER_SECRET, function (err, decodedData) {
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
                }, SERVER_SECRET)
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

    console.log(req.body)

    userModel.findById(req.body.jToken.id, 'name email phone gender createdOn',
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
appxml.listen(PORT, () => {
    console.log("chal gya hai server", PORT)
})
// ==========================================>Server End/////

