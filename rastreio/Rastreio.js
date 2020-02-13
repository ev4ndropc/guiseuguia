const Sequelize = require("sequelize");
const connection = require("../database/database");

const Rastreio = connection.define('codigo', {
    codigo: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

//Rastreio.sync({force:true})

module.exports = Rastreio;