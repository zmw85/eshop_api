/* jshint indent: 2 */

var uuidV4 = require('uuid/v4');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('refreshTokens', {
    token: {
      type: DataTypes.CHAR(32),
      allowNull: false,
      defaultValue: () => { return uuidV4().replace(/-/g, '') },
      primaryKey: true,
      field: 'Token'
    },
    clientId: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'Clients',
        key: 'Id'
      },
      field: 'ClientId'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'CreatedAt'
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'ExpireAt'
    },
    revoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'Revoked'
    },
    userId: {
      type: DataTypes.CHAR(32),
      allowNull: true,
      field: 'UserId'
    }
  }, {
    tableName: 'RefreshTokens'
  });
};
