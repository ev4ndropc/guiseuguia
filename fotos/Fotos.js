const Sequelize = require("sequelize");
const connection = require("../database/database");

const Fotos = connection.define('codigo_imgs', {
    codigo_imgs: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

//Fotos.sync({ force: true })

module.exports = Fotos;