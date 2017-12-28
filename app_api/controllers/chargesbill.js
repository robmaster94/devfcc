'use strict'

const ChargesBill = require('../models/chargesbill')

function obtenerPrecioCarga(req, res) {
    console.log('Obteniendo precio carga...')
    ChargesBill.find({}, function (err, data) {
        if (err) res.status(404).send({
            message: 'Precio no encontrado'
        })
        console.log('Precio: ' + data)

        res.status(200).send({
            precio: data
        })
    })
}

function actualizarPrecio(req, res) {
    let update = req.body
    let priceId = req.params.priceId
    console.log('Price id: '+priceId)
    for (var cosa in update){
        console.log(cosa+' is '+update[cosa])    
    }
    
    ChargesBill.findByIdAndUpdate(priceId, update, function (err, priceUpdated) {
        if (err) res.status(500).send({
            message: 'Error interno'
        })
        
        console.log('Precio actualizado: '+priceUpdated)
        for (var cosa in priceUpdated){
            console.log(cosa+' is '+priceUpdated[cosa])    
        }
    })
}

module.exports = {
    obtenerPrecioCarga,
    actualizarPrecio
}
