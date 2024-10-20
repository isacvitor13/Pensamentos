const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('thougts', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('conectado')
} catch (error) {
    console.log(`Não foi possivél conectar ${error}`)
}
module.exports = sequelize