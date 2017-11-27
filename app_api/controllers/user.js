'use strict'

const mongoose = require('mongoose')
const User = require('../models/user')
const service = require('../services')

function signUp(req, res) {
    const user = new User({
        email: req.body.email,
        displayName: req.body.displayName,
        name: req.body.name,
        surname: req.body.surname,
        age: req.body.age,
        sex: req.body.sex,
        rol: req.body.rol,
        car_model: req.body.car_model,
        conn_type: req.body.conn_type
    })

    user.save((err) => {
        if (err) res.status(500).send({
            message: `Error al crear el usuario: ${err}`
        })
        return res.status(200).send({
            token: service.createToken(user)
        })
    })
}

function signIn(req, res) {
    User.find({
        email: req.body.email
    }, (err, user) => {
        if (err) return res.status(500).send({
            message: err
        })
        if (user == null || user == '') return res.status(404).send({
            message: 'No existe el usuario'
        })

        req.user = user
        
        console.log(req.user)
        
        res.status(200).send({
            message: 'Te has logueado correctamente',
            token: service.createToken(user)
        })
    })
}

module.exports = {
    signUp,
    signIn
}
