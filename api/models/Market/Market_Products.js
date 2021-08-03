/**
 * Market/Market_Products.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    AwshnCode: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true
    },
    InnerCode: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    Selling_price: {
      type: Sequelize.DOUBLE,
      defaultValue: 0.0
    },
    Purchasing_price: {
      type: Sequelize.DOUBLE,
      defaultValue: 0.0
    },
    Showen: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    Expire_date: {
      type: Sequelize.DATE,
    },
    Tax: {
      type: Sequelize.DOUBLE,
      defaultValue: 0.0
    },
    Price_after: {
      type: Sequelize.DOUBLE,
      defaultValue: 0.0
    },
    quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
  },
  options: {
    tableName: 'market_products',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};
