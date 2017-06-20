/* jshint indent: 2 */

const uuidV4 = require('uuid/v4');

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
    tableName: 'RefreshTokens', 
    classMethods: {
      findValidOneByClientIdToken: function(clientId, token) {
        return this.findOne({
          attributes: ['token', 'clientId', 'createdAt', 'userId'],
          where: { token: token, clientId: clientId, expireAt: { $gt: sequelize.fn('UTC_TIMESTAMP') }, revoked: 0 }
        });
      },
      expireRefreshToken: function(clientId, token) {
        return this.update({
          expireAt: sequelize.fn('UTC_TIMESTAMP')
        }, {
          where: { token: token, clientId: clientId, expireAt: { $gt: sequelize.fn('UTC_TIMESTAMP') }, revoked: 0 }
        })
      }
    }
  });
};
