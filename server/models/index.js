"use strict";

var fs            = require("fs");
var path          = require("path");
var Sequelize     = require("sequelize");
var env           = process.env.NODE_ENV || "development";
var config        = require('../config');
var mysqlCconfig  = config.db.mysql;

var sequelize = new Sequelize(mysqlCconfig.database, mysqlCconfig.username, mysqlCconfig.password, {
  dialect: 'mysql',
  host: mysqlCconfig.host,
  port: mysqlCconfig.port,
  define: {
    timestamps: false
  }
});

var db = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;