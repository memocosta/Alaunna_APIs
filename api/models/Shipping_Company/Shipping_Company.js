/**
 * Shipping_Company/Shipping_Company.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
module.exports = {

  attributes: {
    name: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING(2500),
      defaultValue: 'this the Shipping Company description'
    },
    rate: {
      type: Sequelize.FLOAT,
      defaultValue: 0
    },
    status: {
      type: Sequelize.ENUM,
      allowNull: false,
      required: true,
      defaultValue: 'pending',
      values: ['pending', 'active', 'not_active']
    },
  },
  associations: function () {
    Shipping_Company.hasMany(Shipping_Company_Zone, {
      as: 'Shipping_Company_Zone',
      foreignKey: 'Shipping_Company_id'
    });
    Shipping_Company.hasMany(Shipping_Company_Rate, {
      as: 'Shipping_Company_Rate',
      foreignKey: 'Shipping_Company_id'
    });
    Shipping_Company.hasMany(Order, {
        as: 'Shipping_Company_Order',
        foreignKey: 'Shipping_Company_id'
        });
    Shipping_Company.belongsTo(Image, {
      as: 'Logo',
      foreignKey: 'image_id',
      onDelete: 'CASCADE'
    });
  },
  options: {
    tableName: 'Shipping_Company',
    classMethods: {},
    instanceMethods: {},
    hooks: {},
  }
};
