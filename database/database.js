const Sequelize = require('sequelize');

const connection = new Sequelize('modainti_dialogflow', 'modainti_gui', 'evandro1993',{
    host: '108.179.253.183',
    dialect: 'mysql'
});

module.exports = connection;