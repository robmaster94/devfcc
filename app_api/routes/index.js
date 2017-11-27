'use strict'

const express = require('express')
const auth = require('../middlewares/auth')
const userCtrl = require('../controllers/user')
const telemetryCtrl = require('../controllers/telemetry')
const chargePointCtrl = require('../controllers/chargepoints')
const stationCtrl = require('../controllers/station')
const api = express.Router()

api.post('/signup', userCtrl.signUp)
api.post('/signin', userCtrl.signIn)

api.get('/station', /*auth.isAuth,*/ stationCtrl.obtenerEstaciones)
api.get('/station/:stationId', /*auth.isAuth,*/ stationCtrl.obtenerEstacion)
api.post('/station', /*auth.isAuth, auth.requerirRol("admin"),*/ stationCtrl.crearNuevaEstacion)
api.put('/station/:stationId', /*auth.isAuth, auth.requerirRol("admin"),*/ stationCtrl.actualizarEstacion)
//api.delete('/station/:stationId', auth.isAuth, auth.requerirRol("admin"), stationCtrl.eliminarEstacion)

api.get('/chargepoint', /*auth.isAuth,*/ chargePointCtrl.obtenerPuntosCarga)
api.get('/chargepoint/:chargepointId', /*auth.isAuth, */chargePointCtrl.obtenerPuntoCarga)
api.post('/chargepoint', /*auth.isAuth, auth.requerirRol("admin"), */chargePointCtrl.crearPuntoCarga)
api.put('/chargepoint/:chargepointId', /*auth.isAuth, auth.requerirRol("admin"), */chargePointCtrl.actualizarPuntoCarga)
//api.delete('/chargepoint/:chargepointId', auth.isAuth, auth.requerirRol("admin"), chargePointCtrl.eliminarPuntoCarga)

api.get('/telemetry', /*auth.isAuth,*/ telemetryCtrl.obtenerDatosTelemetria)
api.post('/telemetry', /*auth.isAuth, */telemetryCtrl.crearRegistroTelemetria)

module.exports = api
