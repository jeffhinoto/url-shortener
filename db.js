const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'mariadb'
})

module.exports = sequelize;