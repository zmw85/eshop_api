"use strict";

var fs            = require("fs");
var path          = require("path");
var Sequelize     = require("sequelize");
var env           = process.env.NODE_ENV || "dev";
var config        = require('../config');
var mysqlConfig  = config.db.mysql;

var sequelize = new Sequelize(mysqlConfig.database, mysqlConfig.username, mysqlConfig.password, {
  dialect: 'mysql',
  host: mysqlConfig.host,
  port: mysqlConfig.port,
  define: {
    timestamps: false
  },
  logging: env === 'dev'
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