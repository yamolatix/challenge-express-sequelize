"use strict";

const sequelize = require("./database");
const S = require("sequelize");

class User extends S.Model { }

User.init({ name: S.STRING }, { sequelize, modelName: "user" });

module.exports = User;
