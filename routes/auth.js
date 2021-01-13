var express = require("express");
var bcrypt = require("bcrypt-inzi");
var jwt = require('jsonwebtoken'); // https://github.com/auth0/node-jsonwebtoken

var { getUser } = require("../dberor/models"); // problem was here, notice two dots instead of one
console.log("getUser: ", getUser)

var appxml = express.Router();
var ServerSecretKey = process.env.SECRET ||"123";
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


// =======================export
module.exports = appxml;