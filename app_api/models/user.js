'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')

const UserSchema = new Schema({
    user: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false
    }, //con select no enviamos la pass del usuario para más seguridad
    //avatar: String,
    name: String,
    surname: String,
    age: String,
    sex: String,
    rol: String,
    //car_model: String,
    //conn_type: String,
    signupDate: {
        type: Date,
        default: Date.now()
    },
    lastLogin: Date,
    idTag: {
        type: String/*,
        default: '11111111'*/
    }
})

UserSchema.pre('save', (next) => {
    let user = this
    // console.log(`Usuario: ${user}`)
    // console.log(`Nombre usuario: ${user.displayName}`)
    // console.log(`Pass usuario: ${user.password}`)
    // console.log(`Email usuario: ${user.email}`)
    //if (!user.isModified('password')) return next()

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err)
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err)

            user.password = hash
            next()
        })
    })
})

UserSchema.statics.authenticate = function (user, pass, callback) {
    console.log(user +' '+pass)
    User.findOne({
        user: user
    }).exec(function (err, user) {
        if (err) {
            return callback(err)
        } else if (!user) {
            var err = new Error('User not found.')
            err.status = 401
            return callback(err)
        }
        bcrypt.compare(pass, user.pass, function(err,result){
            if(result === true){
                return callback(null,user)
            } else {
                return callback()
            }
        })
    })
}

/*UserSchema.methods.gravatar = function () { //si no tiene email registrado, un avatar aleatorio por defecto
    if (!this.email) return `https://gravatar.com/avatar/s=200&retro`

    const md5 = crypto.createHash('md5').update(this.email).digest('hex')
    return `https://gravatar.com/avatar/${md5}?s=200&d=retro`
}*/

module.exports = mongoose.model('User', UserSchema)
