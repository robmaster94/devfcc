'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const hbs = require('express-handlebars')
const passport = require('passport-local');
const path = require('path')
const session = require('express-session')
const app = express()

const api = require('./app_api/routes')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({secret: 'my@secret'}))

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));

//app.use(passport.initialize());
//app.use(passport.session())

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

module.exports = app
