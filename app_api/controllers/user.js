'use strict'

const mongoose = require('mongoose')
const User = require('../models/user')
const service = require('../services')
const session = require('express-session')
var sess;

function signUp(req, res) {
    console.log('Función signUp')
    //console.log(res)
    const user = new User({
        user: req.body.user,
        name: req.body.name,
        surname: req.body.surname,
        age: req.body.age,
        sex: req.body.sex,
        rol: req.body.rol
        //car_model: req.body.car_model,
        //conn_type: req.body.conn_type
    })

    console.log('Usuario a registrar: ' + user)

    user.save(function (err) {
        if (err) return console.log('Error:' + err)
    })

    res.status(200).send({
        token: service.createToken(user)
    })

    sess = req.session
    sess.user = req.body.user
    sess.rol = req.body.rol
}

function signIn(req, res) {
    console.log('Post: ' + req.body.user)
    if (req.body.user && req.body.pass) {
        User.find({
            user: req.body.user
        }, (err, user) => {
            if (err) return res.status(500).send({
                message: err
            })
            if (user == null || user == '') return res.status(404).send({
                message: 'No existe el usuario'
            })

            req.user = user
            console.log(req.user)

            sess = req.session
            sess.user = req.user['0'].user
            sess.rol = req.user['0'].rol
            console.log('User: ' + sess.user + ' con rol ' + sess.rol)

            res.status(200).send({
                message: 'Te has logueado correctamente',
                token: service.createToken(user)
            })
        })
    } else {
        console.log('Falta la pass')
        res.status(403).json({
            message: 'Falta la pass'
        })
    }

}

function chequearPrivilegios(req, res, next) {

    console.log('idTag: ' + req.idTag)

    User.find({
        idTag: req.idTag
    }, (err, message) => {
        if (err) console.log('error')
        console.log('User encontrado: ' + message)
        next(message)
    })

}

function obtenerRol(req, res, next) {
    sess = req.session
    if (sess.user) {
        if (sess.rol == "user") {
            return res.status(200).send({
                rol: 'user'
            })
        } else if (sess.rol == "admin") {
            return res.status(200).send({
                rol: 'admin'
            })
        }
    } else {
        return res.status(200).send({
            message: 'Usuario no logueado'
        })
    }
}

function obtenerPerfil(req, res, next) {
    sess = req.session
    console.log('Usuario para obtener sus datos: ' + sess.user)
    User.findOne({
        user: sess.user
    }, (err, message) => {
        if (err) console.log('error')
        console.log('Datos usuario ' +sess.user+ ': ' + message)
        return res.status(200).send(message)
    })
}

module.exports = {
    signUp,
    signIn,
    chequearPrivilegios,
    obtenerRol,
    obtenerPerfil
}
