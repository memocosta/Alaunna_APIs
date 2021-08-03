/**
 * Cart/CartProducts.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
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

    CartProducts.belongsTo(Market, {
      as: 'market',
      foreignKey: 'market_id',
      onDelete: 'CASCADE'
    });
  },
  options: {
    tableName: 'cart_products',
    classMethods: {},
    instanceMethods: {},
    hooks: {
    }
  }

};

