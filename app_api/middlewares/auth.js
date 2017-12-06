'use strict'

const service = require('../services')

function isAuth(req, res, next) {
    if (!(req.headers.authorization) || req.headers.authorization == 'Bearer undefined') {
        return res.status(403).send({
            message: 'No tienes autorización'
        })
    }

    const token = req.headers.authorization.split(" ")[1]
    service.decodeToken(token)
        .then(response => {
            req.user = response
            next()
        })
        .catch(response => {
            res.status(response.status)
        })

}

function requerirRol(rol) {
    return function (req, res, next) {
        var role
        if (req.session.user && (req.session.rol === rol)) {
            role = rol
            next(role)
        } else {
            res.status(403).send({
                message: 'No tienes permisos para ver esta ruta'
            })
        }
    }
}

function chequearSesion(req,res,next){
    if(req.session.user){
        next()
    } else {
        return res.status(403).send({message: 'No autorizado'})
    }
}

module.exports = {
    isAuth,
    requerirRol,
    chequearSesion
}
