'use strict'

var contador = 0;

ocppRouter.websocket('/wallbox-sn2197' , (info,cb,next) => {
    cb(function(socket){
        contador += 1;
        socket.send('Success! '+contador+' times connected.')
    })
})

module.exports = ocppRouter
