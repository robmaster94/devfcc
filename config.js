module.exports = {
  port: process.env.PORT || 8080,
  db: process.env.MONGODB || /*'mongodb://user.paco.dev.fcc:PaCoCrIs02112014@ds113936.mlab.com:13936/futurecharge'*/
                             'mongodb://localhost:27017/futurecharge',
  SECRET_TOKEN: 'mi@clave@de@tokens@aleato#ria'
}
