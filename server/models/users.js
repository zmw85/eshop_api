/* jshint indent: 2 */

const uuidV4 = require('uuid/v4'),
  reqHelper = require('../utilities/requestHelper'),
  stdAttributes = ['id', 'firstName', 'lastName', 'email', 'userName', 'sex', 'status', 'emailVerified', 'phone', 'mobile', 
    'createdAt', 'updatedAt'];

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.CHAR(32),
      allowNull: false,
      defaultValue: () => { return uuidV4().replace(/-/g, '') },
      primaryKey: true,
      field: 'Id'
    },
    storeId: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'Stores',
        key: 'Id'
      },
      field: 'StoreId'
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'FirstName'
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'LastName'
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'Email'
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'UserName'
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'Password'
    },
    sex: {
      type: DataTypes.ENUM,
      values: ['male','female'],
      allowNull: true,
      field: 'Sex'
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '0',
      field: 'Deleted'
    },
    deletedDatetime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'DeletedDatetime'
    },
    status: {
      type: DataTypes.ENUM,
      values: ['active','inactive'],
      allowNull: false,
      field: 'Status'
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '0',
      field: 'EmailVerified'
    },
    emailVerifiedDatetime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'EmailVerifiedDatetime'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'Phone'
    },
    mobile: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'Mobile'
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
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'DeletedAt'
    }
  }, {
    tableName: 'Users',
    classMethods: {

      findUsers: function(params = {}) {

        params.offset = params.offset || 0;
        params.limit = reqHelper.setLimit(params.limit);
        params.attributes = reqHelper.filterAttributes(stdAttributes, params.attributes);
        
        return this.findAll({
          attributes: params.attributes,
          where: {
            deleted: 0
          },
          offset: params.offset,
          limit: params.limit
        })
      },

      findOneByUserNamePassword: function(username, password, attributes = []) {

        attributes = reqHelper.filterAttributes(stdAttributes, attributes);

        return this.findOne({
          attributes: attributes,
          where: {
            username: username,
            password: password,
            deleted: 0
          }
        });
      }

    }
  });
};
