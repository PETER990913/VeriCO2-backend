const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.findOne({
    email: req.body.email,
    phoneNumber: req.body.phoneNumber
  })
    .then(async user => {
      if(user) {
        return res.send({message: "already existing user"})
      }      
      else{
        User.create({
          user: req.body.name,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          consultant: req.body.consultant,
          password: bcrypt.hashSync(req.body.password, 8),
          companyName: req.body.companyName
        })
          .then(user => {
            res.status(200).send({ success: true });
          })
          .catch(err => {
            // res.status(500).send({ errors: err.message, success: false, message: 'Something went wrong!' });
            res.status(200).send({ success: false, message: 'Something went wrong!' });
          });
      }
    })
    
    .catch(err => {
      // res.status(500).send({ errors: err.message, success: false, message: 'Something went wrong!' });
      res.status(200).send({ success: false, message: 'Something went wrong!' });
    });
  
};

exports.signin = (req, res) => {

  User.findOne({
    email: req.body.email
  })
    .then(async user => {
      // res.status(200).send({ success: "True" });
      if (!user) {
        // return res.status(401).send({ success: false, message: "Invalid email!" });
        return res.status(200).send({ success: false, message: "Email doesn't exist!" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        // return res.status(402).send({ success: false, message: "Invalid password"});
        return res.status(200).send({ success: false, message: "Wrong password."});
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
        success: true,
        accessToken: token
      });

    })
    .catch(err => {
      // res.status(500).send({ errors: err.message, success: false, message: 'Something went wrong!' });
      res.status(200).send({ success: false, message: 'Something went wrong!' });
    });
};

exports.checkEmail = (req, res) => {
  User.findOne({
    email: req.body.email
  }).then(user => {
    res.status(200).send({
      email: user.email,
      success: true
    })
  }) 
  .catch(err=>{
    // res.status(500).send({ errors: err.message, success: false, message: 'Something went wrong!' });
    res.status(200).send({ success: false, message: 'Something went wrong!' });
  })
}

exports.resetPassword = (req, res) => {
  User.findOne({
    email: req.body.email
  }).then(user => {
      user.password = bcrypt.hashSync(req.body.password, 8),
      user.save().then(()=>{
        res.send({
          success: true
        })
      })
      .catch(err=>{
        // res.status(500).send({ errors: err.message, success: false, message: 'Something went wrong!' });
        res.status(200).send({ success: false, message: 'Something went wrong!' });
      })
  }).catch(err=>{
    // res.status(500).send({ errors: err.message, success: false, message: 'Something went wrong!' });
    res.status(200).send({ success: false, message: 'Something went wrong!' });
  })
}

