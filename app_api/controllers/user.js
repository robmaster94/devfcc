'use strict'

const mongoose = require('mongoose')
const User = require('../models/user')
const service = require('../services')

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

    user.save(function (err) {
        if (err) return console.log('Error:' + err)
        /*return res.status(500).send({
                   message: `Error al crear el usuario: ${err}`
               })*/
        res.status(200).send({
            token: service.createToken(user)
        })
        
        //res.redirect('/home')
    })
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
            
            res.status(200).send({
                message: 'Te has logueado correctamente',
                token: service.createToken(user)
            })
        })
    } else {
        console.log('Falta la pass')
        return res.status(403).send({message: 'Falta la pass'})
    }

}

function chequearPrivilegios(req, res, next) {

    console.log(req.idTag)
    for (var recu in res){
        console.log(res[recu])
    }

    User.find({
        idTag: req.idTag
    }, (err, message) => {
        if (err) console.log('error')
        console.log('User encontrado: '+message)
        next(message)
    })

    /*User.find({
        idTag: req.idTag
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
    })*/
}

module.exports = {
    signUp,
    signIn,
    chequearPrivilegios
}
