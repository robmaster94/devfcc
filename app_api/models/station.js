'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StationSchema = Schema({
  name: String,
  city: String,
  address: String,
  masterpass: { type: String, select:false }
})

module.exports = mongoose.model('Station', StationSchema)