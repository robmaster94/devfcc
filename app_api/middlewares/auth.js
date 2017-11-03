'use strict'

const service = require('../services')

function isAuth (req,res,next){
  if(!(req.headers.authorization) || req.headers.authorization == 'Bearer undefined'){
    return res.status(403).send({message: 'No tienes autorización'})
  }

  const token = req.headers.authorization.split(" ")[1] // 1 espacio, array size[1]
  service.decodeToken(token)
    .then(response => {
      req.user = response
      next()
    })
    .catch(response => {
      res.status(response.status)
    })

}

//exportamos la función

module.exports = isAuth
