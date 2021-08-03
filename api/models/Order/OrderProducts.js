/**
 * Order/OrderProducts.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    Quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    Final_Price: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    extra_options: {
      type: Sequelize.STRING(2000),
      defaultValue: "[]"
    },
    status: {
      type: Sequelize.ENUM,
      values: ['accepted', 'pending', 'shipping', 'canceld', 'prepared', 'not_exist' , 'user_canceld'],
      defaultValue: 'pending'
    },
    return_item: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    canceld_reason: {
      type: Sequelize.STRING
    },
    coupon_value: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }

  },
  associations: function () {
    OrderProducts.belongsTo(Market, {
      as: 'market',
      foreignKey: 'market_id'
    });
    OrderProducts.belongsTo(Order);
    OrderProducts.belongsTo(Product,{
      as:'product',
      foreignKey: 'ProductId'
    });
    OrderProducts.belongsTo(coupon, {
      as: 'coupon',
      foreignKey: 'coupon_id'
    });
  },
  options: {
    tableName: 'orderproducts',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};

