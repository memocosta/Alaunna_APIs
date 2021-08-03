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
    MarketCartProduct.belongsTo(MarketCart, {
      as: 'market_cart',
      foreignKey: 'market_cart_id'
    });
    MarketCartProduct.belongsTo(Product, {
      as: 'product',
      foreignKey: 'product_id',
      onDelete: 'CASCADE'
    });
  },
  options: {
    tableName: 'market_cart_product',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};

