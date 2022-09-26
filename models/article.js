"use strict";

const sequelize = require("./database");
const S = require("sequelize");

// Asegurate que tu Postgres este corriendo!

const User = require("./user");

//---------VVVV---------  tu código aquí abajo  ---------VVV----------

class Article extends S.Model {}
Article.init({}, { sequelize, modelName: "article" });
//---------^^^---------  tu código aquí arriba  ---------^^^----------

module.exports = Article;
