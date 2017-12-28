'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChargesBillSchema = Schema({
  kWh_price: String
})

module.exports = mongoose.model('ChargesBill', ChargesBillSchema)
