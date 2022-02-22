var express = require('express');
const { send } = require('express/lib/response');
const async = require('hbs/lib/async');
var router = express.Router();
const userSchema = require('../src/Models/userSchema')
const signupSchema = require('../src/Models/signupSchema');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
// import {User} from '../src/userSchema'
/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
  const newUser = new userSchema()
  newUser.find()
    .then((data) => {
      console.log('Data:', data)
      res.json(data)
    })
    .catch((error) => {
      console.log('error', error)
    })
});
router.post('/submit', function (req, res, next) {
  console.log(req.body)
  const data = req.body
  const newUser = new userSchema(data)

  newUser.save((error) => {
    if (error) {
      res.send({ msg: "Sorry,internal server error" })
      next()
    } else {
      res.send({
        msg: "your data has been saved"
      })
      // next()
    }
  })
  // res.render('success', { last_name: req.body.last_name })
})
router.get('/signup', (req, res, next) => {
  res.render('signup', { title: 'Express' })
  const signup = new signupSchema()
  signup.find({})
    .then((data) => {
      console.log('Data:', data)
      res.json(data)

    })
    .catch((error) => {
      console.log('error', error)

    })

})

router.post('/signup', (req, res, next) => {
  signupSchema.find({ email: req.body.email }).exec().then((user) => {
    if (user.length >= 1) {
      return res.status(409).json({
        message: "Mail exists"
      })
    } else {
      bcrypt.hash(req.body.pw, 10, (err, hash) => {
        console.log(req.body.pw)
        if (err) {
          return res.status(500).json({
            error: err
          });
        } else {
          const signup = new signupSchema({
            _id: new mongoose.Types.ObjectId(),
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone: req.body.phone,
            pw: hash
          })
          signup.save().then(result => {
            console.log(result)
            res.status(201).json({
              message: "User Created"
            });
          }).catch(err => {
            console.log(err)
            res.status(500).json({
              error: err
            })
          })
        }

      })
    }
  })

})
// login page
router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Express' });
})

router.post('/login', (req, res, next) => {
  signupSchema.findOne(req.body.email).exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(404).json({
          message: "Mail not found,User doesn\'t exists"
        })
      }
      bcrypt.compare(req.body.pw, user[0].pw, (err, result) => {
        if (err) {
          return res.status(404).json({
            message: "Mail not found,User doesn\'t exists"

          })
        }
        if (result) {
          jwt.sign({email:user[0].email,
          userId:user[0]._id},"secrete",{
            expiresIn:"1hr"
          },
          )
          return res.status(200).json({
            message: "Login success",
            token:token
          })
        }
        res.status(200).json({
          message: "Login success"
         
        })
      }).catch(err => {
        console.log(err)
        res.status(500).json({
          error: err
        })
      })
    })
    
})



module.exports = router;
