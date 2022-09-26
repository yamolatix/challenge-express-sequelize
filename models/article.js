"use strict";

const sequelize = require("./database");
const S = require("sequelize");

// Asegurate que tu Postgres este corriendo!

const User = require("./user");

//---------VVV---------  tu código aquí abajo  ---------VVV----------

class Article extends S.Model { }

Article.init({
    title: {
        type: S.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
    },
    content: {
        type: S.TEXT,
        allowNull: false,
    },
    snippet: {
        type: S.VIRTUAL,
        get() {
            return this.content ? `${this.content.slice(0, 23)}...` : ""
        }
    },
    version: {
        type: S.INTEGER,
        defaultValue: 0
    },
    tags: {
        type: S.ARRAY(S.STRING),
        defaultValue: [],
        get() {
            return this.getDataValue('tags').join(', ')
        }
    }
}, { sequelize, modelName: "article" });

Article.prototype.truncate = function (len) {
    this.content = this.content.slice(0, len);
};

Article.findByTitle = function (title) {
    return Article.findOne({ where: { title } })
};

Article.addHook('beforeUpdate', function (article) {
    article.version += 1;
})

Article.belongsTo(User, { as: 'author' })

//---------^^^---------  tu código aquí arriba  ---------^^^----------

module.exports = Article;