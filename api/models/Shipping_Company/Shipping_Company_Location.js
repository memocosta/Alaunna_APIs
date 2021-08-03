/**
 * Shipping_Company/Shipping_Company_Zone.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
module.exports = {

  attributes: {
  },
  associations: function () {
    Shipping_Company_Location.belongsTo(Shipping_Company_Zone, {
      as: 'Shipping_Company_Zone',
      foreignKey: 'Shipping_Company_Zone_id',
      onDelete: 'CASCADE'
    });
    Shipping_Company_Location.belongsTo(City, {
      as: 'City',
      foreignKey: 'city_id',
      onDelete: 'SET NULL'
    });
    Shipping_Company_Location.belongsTo(Country, {
      as: 'Country',
      foreignKey: 'country_id',
      onDelete: 'SET NULL'
    });
  },
  options: {
    tableName: 'Shipping_Company_Location',
    classMethods: {},
    instanceMethods: {},
    hooks: {},
  }
};
