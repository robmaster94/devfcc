'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TelemetrySchema = Schema({
    voltage: String,
    current: String,
    curr_power: String,
    imp_ae: String,
    exp_ae: String,
    imp_re: String,
    exp_re: String,
    power_factor: String,
    earth_wire_status: String,
    station_status: String,
    ev_battery_start_value: String,
    ev_battery_final_value: String,
    connector_id: String,
    current_time_date: { type:Date, default: Date.now() }
    /*
        station_id = Id de la estación. De momento solo trabajamos con 1
        Cuando se escale la aplicación, se añadirá este campo para
        referenciar la estación de recarga.
    */
})

module.exports = mongoose.model('Telemetry', TelemetrySchema)