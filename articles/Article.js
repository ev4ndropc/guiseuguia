const Sequelize = require("sequelize");
const connection = require("../database/database");
const Noticias = require("../noticias/Noticias");

const Article = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//Article.sync({force:true})

Noticias.hasMany(Article);
Article.belongsTo(Noticias);

module.exports = Article;