'use strict'

/*

    Funciones de BBDD respecto a las estaciones:
        - Obtener todas las estaciones.
        - Crear nueva estación
        - Actualizar estación existente
        - Eliminar estación (con privilegios) --> Futura mejora.
        

*/

const Station = require('../models/station')

function obtenerEstacion(req,res){
    res.status(200).send({message: 'Prueba funcion obtener una estacion por ID'})
}

function obtenerEstaciones(req,res){
    res.status(200).send({message: 'Prueba funcion obtener todas las estaciones'})
}

function crearNuevaEstacion(req,res){
    
    const station = new Station({
        name: req.body.name,
        city: req.body.city,
        address: req.body.address,
        masterpass: req.body.masterpass
    })
    
    station.save(function(err){
        if (err) res.status(200).send({message: err})
    })
    
    res.status(200).send({message: 'Prueba funcion crear estacion'})
}

function actualizarEstacion(req,res){
    res.status(200).send({message: 'Prueba funcion actualizar estacion'})
}

function eliminarEstacion(req,res){
    res.status(200).send({message: 'Prueba funcion eliminar estacion'})
}

module.exports = {
    obtenerEstacion,
    obtenerEstaciones,
    crearNuevaEstacion,
    actualizarEstacion
}