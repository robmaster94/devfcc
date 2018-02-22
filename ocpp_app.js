const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const ocpp_serv = require('express-ws-routes')(app)

const ocpp = require('./app_api/routes/ocpp')

ocpp_serv.use(bodyParser.urlencoded({
    extended: false
}))
ocpp_serv.use(bodyParser.json())

ocpp_serv.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    next()
})

ocpp_serv.use('/ocpp', ocpp)

module.exports = ocpp_serv
