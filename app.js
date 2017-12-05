'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const hbs = require('express-handlebars')
const passport = require('passport-local');
const path = require('path')
const session = require('express-session')
const app = require('express-ws-routes')()

const api = require('./app_api/routes')
const ocpp = require('./app_api/routes/ocpp')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({secret: 'my@secret'}))

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));

//app.use(passport.initialize());
//app.use(passport.session())

/*passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));*/

app.engine('.hbs', hbs({
  defaultLayout: 'default',
  extname: '.hbs'
}))

app.set('view engine', '.hbs')

var sess;

app.use('/api',api, function(req,res){
    sess = req.session;
    sess.user;
    sess.rol;
})
app.use('/ocpp', ocpp)

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
})

module.exports = app
