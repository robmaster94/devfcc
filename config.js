module.exports = {
  port: /*process.env.PORT ||*/ 6500,
  db: process.env.MONGODB || /*'mongodb://localhost:27017/shop'*/'mongodb://paco.dev:PaCoSaNcHeZ1994@ds259855.mlab.com:59855/shop',
  SECRET_TOKEN: 'mi@clave@de@tokens@aleato#ria'
}
