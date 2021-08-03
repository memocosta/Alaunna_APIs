/**
 * Market/MarketCategory.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

  },
  associations: function () {
    MarketCart.belongsTo(Market, {
      as: 'market',
      foreignKey: 'market_id'
    });
    MarketCart.belongsTo(User, {
      as: 'user',
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });

    MarketCart.belongsTo(MarketCustomer, {
      as: 'customer',
      foreignKey: 'customer_id',
      onDelete: 'CASCADE'
    });
    MarketCart.hasMany(MarketCartProduct, {
      as: 'MarketCartProduct',
      foreignKey: 'market_cart_id'
    });
  },
  options: {
    tableName: 'market_cart',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};

