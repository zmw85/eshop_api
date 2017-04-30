/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stores', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'Id'
    },
    accountId: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'Accounts',
        key: 'Id'
      },
      field: 'AccountId'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'Name'
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
    tableName: 'Stores'
  });
};
