'use strict'

const express = require('express')
const productCtrl = require('../controllers/product')
const auth = require('../middlewares/auth')
const userCtrl = require('../controllers/user')
const api = express.Router()


api.get('/product', auth, productCtrl.getProducts)
api.get('/product/:productId', auth, productCtrl.getProduct)
api.post('/product',auth, productCtrl.saveProduct)
api.put('/product/:productId', auth, productCtrl.updateProduct)
api.delete('/product/:productId', auth, productCtrl.deleteProduct)
api.post('/signup', userCtrl.signUp)
api.post('/signin', userCtrl.signIn)
api.get('/private', auth, function(req,res){
  res.status(200).send({message: 'Tienes acceso'})
})

/*
  Creo otro express.Router() para crear un servidor WebSocket en un módulo aparte
  La ruta será /ocpp/wallbox-sn2197, siendo ocpp el express.Router()
*/

module.exports = api
