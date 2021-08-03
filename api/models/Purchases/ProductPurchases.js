/**
 * Purchases/ProductPurchases.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    quantity: {
      type: Sequelize.INTEGER,
      required: true,
      allowNull: false
    },
    price: {
      type: Sequelize.DOUBLE,
      required: true,
      allowNull: false
    },
    market_id : {
      type: Sequelize.INTEGER,
      defaultValue : 0
    }
  },
  options: {
    tableName: 'purchases_products',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};

