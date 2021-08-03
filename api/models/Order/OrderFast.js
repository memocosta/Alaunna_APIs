/**
 * Order/OrderFast.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    description: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.ENUM,
      values: ['accepted', 'pending', 'shipping', 'canceld'],
      defaultValue: 'pending'
    },
    canceld_reason: {
      type: Sequelize.STRING
    }
  },
  defaultScope: function () {
    return {
      include: [ 'image']
    }
  },
  associations: function () {
    OrderFast.belongsTo(Order, {
      as: 'order',
      foreignKey: 'order_id'
    });
    OrderFast.belongsTo(Image, {
      as: 'image',
      foreignKey: 'image_id',
      onDelete: 'SET NULL'
    });
    OrderFast.belongsTo(Market, {
      as: 'market',
      foreignKey: 'market_id'
    });
  },
  options: {
    tableName: 'order_fast',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};

