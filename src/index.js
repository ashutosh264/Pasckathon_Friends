const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const express = require('express')
const hbs = require('hbs')
const path = require('path')
var admin = require('firebase-admin')
const bodyparser = require("body-parser")

//admin service account
var serviceAc = require('../firebase-key.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAc),
    databaseURL: "https://home-automation-a274b.firebaseio.com"
})

//firebse initialization
var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');

firebase.initializeApp({
  apiKey: "AIzaSyCWYOfE91eaABu2LeVJogz-j9Y1Qyu6iXM",
  authDomain: "home-automation-a274b.firebaseapp.com",
  databaseURL: "https://home-automation-a274b.firebaseio.com",
  projectId: "home-automation-a274b",
  storageBucket: "home-automation-a274b.appspot.com",
  messagingSenderId: "578331922850",
  appId: "1:578331922850:web:9906cfb1b4a68385de22fb",
  measurementId: "G-495MQ2P0HP"
});

//express app initialization
const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config public , partials and views
const publicDirPath = path.join(__dirname, "../public")
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials') 

//express middlewares
app.use(bodyparser.urlencoded({extended : false}))
app.use(express.json())
app.use(cookieParser())

// Setup handlebars engine & views location
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirPath))

//express routes
app.get("/login", function (req, res) {
  res.render("login")
})
  
app.get("/register", function (req, res) {
  res.render("register")
})

  
app.get("/", function (req, res) {
  res.redirect("/login")
})

app.post('/register', (req, res) => {
  let email= req.body.email
  let password= req.body.password
  let confirm_password= req.body.cnfPassword
  if(password===confirm_password){
      admin.auth().createUser({
          email: email,
          password: password
        })
          .then(function(userRecord) {
            console.log("user created : "+userRecord.uid)
            res.render('login',{
              message: 'Login with same credentials'
              }) 
          })
          .catch(function(error) {
            console.log('Error creating new user:', error.errorInfo.message)
              res.render('register',{
                  message: error.errorInfo.message
              })
          })
  }
  else{
      res.render('register',{
          message: "Password doesn't match"
      })
  }
})
app.get('/sessionLogin', (req, res) => {

  const idToken = req.query.token.toString()
  
  const expiresIn = 60 * 60* 24 * 1000 * 5
  admin.auth().createSessionCookie(idToken, {expiresIn})
    .then((sessionCookie) => {
     const options = {maxAge: expiresIn, httpOnly: true}
     res.cookie('session', sessionCookie, options)

     res.redirect('/dashboard')
    })
    .catch(error => {
     res.status(401).send('UNAUTHORIZED REQUEST!')
    })
})

app.get('/dashboard',(req, res) => {
  try{
      const sessionCookie= req.cookies.session;
      admin.auth().verifySessionCookie(sessionCookie, true).then((decodedClaims) => {
              firebase.database().ref('users/' + decodedClaims.user_id).update({
                email : decodedClaims.email
              })
              res.render('dashboard',{
                  uid: decodedClaims.user_id,
                  email: decodedClaims.email  
              })
          })
          .catch(error => {
            console.log(error)
            res.redirect('/login')
          })    
  }
  catch(err){
      return res.status(401).render('login',{ 
          message: 'Token expired or tampered'
      }) 
  }
  
})

app.get('/logout', function(req, res) {
  res.clearCookie('session')
  res.redirect('/login')
});
//end of routes

//listening to server
app.listen(port, () =>{
    console.log("Server is on port "+ port)
})