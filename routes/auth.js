var express = require("express");
var bcrypt = require("bcrypt-inzi");
var jwt = require('jsonwebtoken'); // https://github.com/auth0/node-jsonwebtoken
var { ServerSecretKey } = require("../core/index");
// var client = new postmark.Client("ENTER YOUR POSTMARK TOKEN");
// var client = new postmark.Client("a9885685-bb87-4afd-adc6-9acd390f74b7");

var { getUser, otpModel } = require("../dberor/models");
console.log("getUser: ", getUser)

var appxml = express.Router();
// var ServerSecretKey = process.env.SECRET || "123";
// ==========================================>$$ /////

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
// ==========================================>$$ /////


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
                        }, ServerSecretKey);

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
                }).catch(e => {
                    console.log("error: ", e)
                })
            } else {
                res.status(403).send({
                    message: "user not found"
                });
            }
        })
})


// ==========================================>C5reat Login COmplet $$ /////


appxml.post("/logout", (req, res, next) => {
    res.cookie('jToken', "", {
        maxAge: 86_400_000,
        httpOnly: true
    });
    res.send("logout success");
})

// =================
appxml.post('/forget-password', (req, res, next) => {

    if (!req.body.email) {
        res.status(403).send(`
        please send email in json body.
        e.g:
        {
            "email": "malikasinger@gmail.com"
        }`)
        return;
    }
    getUser.findOne({ email: req.body.email },
        function (err, user) {
            if (err) {

                res.status(500).send({
                    message: "an error occured: " + JSON.stringify(err)
                });
            } else if (user) {
                const otp = Math.floor(getRandomArbitrary(11111, 99999))

                otpModel.create({
                    email: req.body.email,
                    otpCode: otp
                }).then((doc) => {
                    client.sendEmail({
                        "From": "info@arabianconsult.com",
                        "To": req.body.email,
                        "Subject": "Reset your password",
                        "TextBody": `Here is your pasword reset code: ${otp}`
                    })
                }).then((status) => {
                    console.log("status: ", status);
                    res.send("email sent with otp")
                }).catch((err) => {
                    console.log("error in creating otp: ", err);
                    res.status(500).send("unexpected error ")
                })

            } else {
                res.status(403).send({
                    message: "user not found"
                });
            }
        })

})


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// =======================export
module.exports = appxml;