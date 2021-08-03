/**
 * Safe/Transaction.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    amount: {
      type: Sequelize.DOUBLE,
      defaultValue: 0.0
    },
    note: {
      type: Sequelize.STRING,
    },
    Transaction_type: {
      type: Sequelize.ENUM,
      allowNull: false,
      required: true,
      values: ['SafeTransaction', 'ClientTransacion', 'SupplierTransaction']
    },
  },
  associations: function () {
    Transaction.belongsTo(Safe, {
      as: 'safe',
      foreignKey: 'safe_id'
    });
    Transaction.belongsTo(Client, {
      as: 'client',
      foreignKey: 'client_id'
    });
    Transaction.belongsTo(Supplier, {
      as: 'supplier',
      foreignKey: 'supplier_id'
    });
  },
  options: {
    tableName: 'transaction',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};
