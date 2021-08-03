/**
 * Safe/Safe.js
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
  },
  associations: function () {
    Safe.belongsTo(Market, {
      as: 'market',
      foreignKey: 'market_id'
    });
    Safe.hasMany(Transaction, {
      as: 'transactions',
      foreignKey: 'safe_id'
    })
  },
  options: {
    tableName: 'safe',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};
