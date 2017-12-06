'use strict'

const express = require('express')
const auth = require('../middlewares/auth')
const userCtrl = require('../controllers/user')
const telemetryCtrl = require('../controllers/telemetry')
const chargePointCtrl = require('../controllers/chargepoints')
const stationCtrl = require('../controllers/station')
const session = require('express-session')
const api = express.Router()
var sess;

api.post('/signup', userCtrl.signUp)
api.post('/signin', userCtrl.signIn)
api.get('/obtenerRol', userCtrl.obtenerRol)
api.get('/obtenerPerfil', userCtrl.obtenerPerfil)

api.get('/logout', function(req,res){
    sess = req.session
    console.log(sess)
})

api.get('/station', auth.chequearSesion, stationCtrl.obtenerEstaciones)
api.get('/station/:stationId', auth.chequearSesion, stationCtrl.obtenerEstacion)
api.post('/station', auth.chequearSesion, auth.requerirRol("admin"), stationCtrl.crearNuevaEstacion)
api.put('/station/:stationId', auth.chequearSesion, auth.requerirRol("admin"), stationCtrl.actualizarEstacion)
//api.delete('/station/:stationId', auth.isAuth, auth.requerirRol("admin"), stationCtrl.eliminarEstacion)

api.get('/chargepoint', auth.chequearSesion, chargePointCtrl.obtenerPuntosCarga)
api.get('/chargepoint/:chargepointId', auth.chequearSesion, chargePointCtrl.obtenerPuntoCarga)
api.post('/chargepoint', auth.chequearSesion, auth.requerirRol("admin"), chargePointCtrl.crearPuntoCarga)
api.put('/chargepoint/:chargepointId', auth.chequearSesion, auth.requerirRol("admin"), chargePointCtrl.actualizarPuntoCarga)
//api.delete('/chargepoint/:chargepointId', auth.isAuth, auth.requerirRol("admin"), chargePointCtrl.eliminarPuntoCarga)

api.get('/telemetry', auth.chequearSesion, telemetryCtrl.obtenerDatosTelemetria)
api.post('/telemetry', auth.chequearSesion, telemetryCtrl.obtenerDatosConsultaTelemetria)
api.post('/createTelemetry', telemetryCtrl.crearRegistroTelemetria)
api.get('/obtUltimaCarga', auth.chequearSesion, telemetryCtrl.obtenerUltimaCarga)

module.exports = api
