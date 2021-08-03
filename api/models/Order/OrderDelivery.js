/**
 * Order/OrderDelivery.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    }

  },
  associations: function () {
    OrderDelivery.belongsTo(Order, {
      as: 'order',
      foreignKey: 'order_id'
    });
  },
  options: {
    tableName: 'order_delivery',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};

