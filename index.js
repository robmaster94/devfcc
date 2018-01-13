'use strict'

const mongoose = require('mongoose')
const app = require('./app')
const config = require('./config')
var http = require("http")

mongoose.connect(config.db, (err,res) => {
  if(err) {
    return console.log(`Error al conectar a la base de datos: ${err}`)
  }
  console.log('Conexion a la base de datos establecida!')

 var server = app.listen(config.port, (req,res) => {
    console.log(`API REST corriendo en http://localhost:${config.port}`)
  })
 server.timeout = 7200000 //2 horas timeout
})
