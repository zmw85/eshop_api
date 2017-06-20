/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clients', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'Id'
    },
    key: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: 'Key'
    },
    secret: {
      type: DataTypes.STRING(32),
      allowNull: false,
      field: 'Secret'
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'Type'
    },
    accountId: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      field: 'AccountId'
    },
    storeId: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      field: 'StoreId'
    },
    tokenLength: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      field: 'TokenLength'
    },
    refreshToken: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '1',
      field: 'RefreshToken'
    },
    refreshTokenLength: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      field: 'RefreshTokenLength'
    },
    userTokenLength: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      field: 'UserTokenLength'
    },
    userRefreshToken: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '1',
      field: 'UserRefreshToken'
    },
    userRefreshTokenLength: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      field: 'UserRefreshTokenLength'
    },
    status: {
      type: DataTypes.ENUM,
      values: ['active', 'inactive'],
      allowNull: false,
      defaultValue: 'inactive',
      field: 'Status'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'CreatedAt'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'UpdatedAt'
    }
  }, {
    tableName: 'Clients',
    classMethods: {

      findOneByKeySecret: function(key, secret) {
        return this.findOne({
          attributes: ['id', 'type', 'accountId', 'storeId', 'tokenLength', 'refreshToken', 'refreshTokenLength'
            , 'userTokenLength', 'userRefreshToken', 'userRefreshTokenLength', 'createdAt', 'updatedAt'],
          where: {
            Key: key,
            Secret: secret,
            Status: 'active'
          }
        });
      }

    }
  });
};
