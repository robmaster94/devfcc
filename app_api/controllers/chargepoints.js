'use strict'

/*

    Funciones BBDD respecto a los puntos de carga:
    
    Una estación de recarga (electrolinera) puede tener varios puntos de carga, por lo que se podrá:
    
        - Obtener todos los puntos de carga.
        - Crear puntos de carga.
        - Actualizar los existentes.
        - Eliminar punto de carga. --> El administrador de la estación de recarga será el único que pueda
                                       eliminar un punto de carga. Se le proporcionará una pass maestra.

*/

const ChargePoint = require('../models/chargepoints')

function obtenerPuntosCarga(req,res){
    res.status(200).send({message: 'Prueba funcion obtener todos los puntos de carga'})
}

function obtenerPuntoCarga(req,res){
    res.status(200).send({message: 'Prueba funcion obtener un punto de carga'})
}

function crearPuntoCarga(req,res){
    res.status(200).send({message: 'Prueba funcion crear punto de carga'})
}

function actualizarPuntoCarga(req,res){
    res.status(200).send({message: 'Prueba funcion actualizar punto de carga'})
}

function eliminarPuntoCarga(req,res){
    res.status(200).send({message: 'Prueba funcion eliminar punto de carga'})
}

module.exports = {
    obtenerPuntosCarga,
    obtenerPuntoCarga,
    crearPuntoCarga,
    actualizarPuntoCarga,
    eliminarPuntoCarga
}