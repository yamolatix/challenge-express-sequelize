"use strict";

const { options, database } = require("../config/config.json");
const Sequelize = require("sequelize");

module.exports = new Sequelize(database, null, null, options);
