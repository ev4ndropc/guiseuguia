const Sequelize = require("sequelize");
const connection = require("../database/database");

const Noticias = connection.define('noticias',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },news:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Noticias.sync({force:true})

module.exports = Noticias;
