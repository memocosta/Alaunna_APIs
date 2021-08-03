/**
 * Shipping_Company/Shipping_Company_Zone.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
module.exports = {

  attributes: {
  Cost: {
      type: Sequelize.DOUBLE,
      defaultValue: 0.0
    },
    Cash_Cost: {
      type: Sequelize.DOUBLE,
      defaultValue: 0.0
    },
    Cash_on_delivery: {
      type: Sequelize.ENUM,
      allowNull: false,
      required: true,
      values: ['available', 'not available']
    }
  },
  associations: function () {
    Shipping_Company_Zone.belongsTo(Shipping_Company, {
      as: 'Shipping_Company',
      foreignKey: 'Shipping_Company_id',
      onDelete: 'CASCADE'
    });
    Shipping_Company_Zone.hasMany(Shipping_Company_Location, {
      as: 'Shipping_Company_Location',
      foreignKey: 'Shipping_Company_Zone_id'
    });
  },
  options: {
    tableName: 'Shipping_Company_Zone',
    classMethods: {},
    instanceMethods: {},
    hooks: {},
  }
};
