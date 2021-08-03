/**
 * Product/ProductRate.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    value: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5
      }
    },
    comment: {
      type: Sequelize.STRING,
      defaultValue: ''
    }
  },
  associations: function () {
    ProductRate.belongsTo(Product, {
      as: 'product',
      foreignKey: 'product_id',
      onDelete: 'CASCADE'
    });
    ProductRate.belongsTo(User, {
      as: 'user',
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
  },
  options: {
    tableName: 'product_rate',
    classMethods: {},
    instanceMethods: {},
    scopes: {},
    hooks: {}
  }

};

