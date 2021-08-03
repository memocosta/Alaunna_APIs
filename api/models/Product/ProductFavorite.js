/**
 * Product/ProductFavorite.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

  },
  associations: function () {
    ProductFavorite.belongsTo(Product , {
      as : 'product',
      foreignKey : 'product_id',
      onDelete: "CASCADE",
    });
    ProductFavorite.belongsTo(User , {
      as : 'user',
      foreignKey : 'user_id',
      onDelete : 'CASCADE'
    })
  },
  options: {
    tableName: 'product_favorite',
    classMethods: {},
    instanceMethods: {},
    scopes : {},
    hooks: {}
  }
};

