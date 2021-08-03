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
    MarketCategory.belongsTo(Market, {
      as: 'market',
      foreignKey: 'market_id'
    });
    MarketCategory.belongsTo(ProductCategory, {
      as: 'category',
      foreignKey: 'category_id',
      onDelete: 'CASCADE'
    });
  },
  options: {
    tableName: 'market_category',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};

