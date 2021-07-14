const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.JAWSDB_MARIA_URL)

module.exports = sequelize;