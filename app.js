'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const hbs = require('express-handlebars')
const app = express()
const api = require('./routes')
const ocpp = require('./routes/ocpp')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.engine('.hbs', hbs({
  defaultLayout: 'default',
  extname: '.hbs'
}))

app.set('view engine', '.hbs')

app.use('/api',api)
app.use('/login', (req,res) => {
  res.render('login')
})
app.use('/api/product', (req,res) => {
  res.render('product')
})
// app.use('/', (req,res) => {
//   res.render('product')        Esta función renderiza la plantilla 'product' para la ruta global incluyendo subrutas
// })

app.use('/ocpp', ocpp)


module.exports = app
