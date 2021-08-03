/**
 * Favorite2\FavoriteProducts.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    quantity: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    },
    extraInput: {
      type: Sequelize.STRING(5000),
    },
  },
  associations: function () {
    FavoriteProducts.belongsTo(Product, {
      as: 'product',
      foreignKey: 'product_id',
      onDelete: "CASCADE",
    });
    FavoriteProducts.belongsTo(Market, {
      as: 'market',
      foreignKey: 'market_id',
      onDelete: 'CASCADE'
    });
  },
  options: {
    tableName: 'favorite_products',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};

