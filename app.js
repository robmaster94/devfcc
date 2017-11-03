'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const hbs = require('express-handlebars')
const passport = require('passport');
const path = require('path')
const app = express()

const api = require('./app_api/routes')
const ocpp = require('./app_api/routes/ocpp')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));

app.use(passport.initialize());

app.engine('.hbs', hbs({
  defaultLayout: 'default',
  extname: '.hbs'
}))

app.set('view engine', '.hbs')

app.use('/api',api)
app.use('/ocpp', ocpp)

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});

app.use('/login', (req,res) => {
  res.render('login')
})
app.use('/api/product', (req,res) => {
  res.render('product')
})


module.exports = app
