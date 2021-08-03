/**
 * Market/MarketCategory.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: Sequelize.STRING,
      required: true,
    },
    phone: {
      type: Sequelize.STRING,
      required: true,
    },
  },
  associations: function () {
    MarketCustomer.belongsTo(Market, {
      as: 'market',
      foreignKey: 'market_id'
    });
  },
  options: {
    tableName: 'market_customer',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};

