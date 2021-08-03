/**
 * Shipping\Shipping.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    activate_delivery_option: {
      type: Sequelize.INTEGER,
      required: true,
      allowNull: false,
      defaultValue : 0
    },
    name: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
    },
    cost: {
      type: Sequelize.DOUBLE,
      required: true,
      allowNull: false,
      defaultValue : 0
    },
    activate_payment_receipt: {
      type: Sequelize.INTEGER,
      required: true,
      allowNull: false,
      defaultValue : 0
    },
    cost_payment_receipt: {
      type: Sequelize.DOUBLE,
      required: false,
      allowNull: false,
      defaultValue : 0
    },
    rate: {
      type: Sequelize.FLOAT,
      defaultValue: 0
    },
  },
  associations: function () {
    Shipping.hasMany(Shipping_Location, {
      as: 'Shipping_Location',
      foreignKey: 'shipping_id',
      onDelete: 'SET NULL'
    });
    Shipping.hasMany(Shipping_Rate, {
      as: 'Shipping_Company_Rate',
      foreignKey: 'Shipping_id'
    });
    Shipping.belongsTo(User, {
      as: 'user',
      foreignKey: 'user_id',
      onDelete: 'SET NULL'
    });

  },
  options: {
    tableName: 'shipping',
    classMethods: {},
    instanceMethods: {},
    scopes: {
      search: {

      },
      offerScope: function () {
        return {
          include: ['country', 'city', 'user']
        }
      }
    },
    hooks: {}
  }

};

