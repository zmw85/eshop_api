/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('adminUsers', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'Id'
    },
    accountd: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      references: {
        model: 'accounts',
        key: 'Id'
      },
      field: 'Accountd'
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'Username'
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'Password'
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'FirstName'
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'LastName'
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'Email'
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      field: 'Status'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'CreatedAt'
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'Deleted'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'DeletedAt'
    }
  }, {
    tableName: 'AdminUsers'
  });
};
