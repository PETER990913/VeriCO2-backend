const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
// const Success = db.success

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    user: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    birthday: req.body.birthday,
    password: bcrypt.hashSync(req.body.password, 8),
    companyName: req.body.companyName
    // role: 'user'
  })
    .then(user => {
      res.status(200).send({ user: user, Success: true });
    })
    .catch(err => {
      res.status(500).send({ errors: err.message, Success: false, message: 'Something went wrong!' });
    });
};

exports.signin = (req, res) => {

  User.findOne({
    email: req.body.email
  })
    .then(async user => {
      // res.status(200).send({ Success: "True" });
      if (!user) {
        return res.status(401).send({ Success: false, message: "Invalid email!" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(402).send({
          Success: false, message: "Invalid password"
        });
      }
      
      const queryToken = {};
     
      /** 2023/5/9 3:30 */
      /** Add more information */
      queryToken.id = user.id;
      queryToken.role = user.role;

      var token = jwt.sign(queryToken, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).send({
        user: user,
        Success: true,
        accessToken: token
      });

    })
    .catch(err => {
      res.status(500).send({ errors: err.message, success: false, message: 'Something went wrong!' });
    });
};

exports.checkEmail = (req, res) => {
  User.findOne({
    email: req.body.email
  }).then(user => {
    res.status(200).send({
      email: user.email,
      Success: true
    })
  }) 
  .catch(err=>{
    res.status(500).send({ errors: err.message, Success: false, message: 'Something went wrong!' });
  })
}

exports.resetPassword = (req, res) => {
  User.findOne({
    email: req.body.email
  }).then(user => {
      user.password = bcrypt.hashSync(req.body.password, 8),
      user.save().then(()=>{
        res.send({
          Success: true
        })
      })
      .catch(err=>{
        res.status(500).send({ errors: err.message, Success: false, message: 'Something went wrong!' });
      })
  }).catch(err=>{
    res.status(500).send({ errors: err.message, Success: false, message: 'Something went wrong!' });
  })
}