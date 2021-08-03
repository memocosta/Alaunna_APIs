/**
 * Shipping\Shipping.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  },
  associations: function () {
    Shipping_Location.belongsTo(Country, {
      as: 'country',
      foreignKey: 'country_id',
      onDelete: 'SET NULL'
    });

    Shipping_Location.belongsTo(City, {
      as: 'city',
      foreignKey: 'city_id',
      onDelete: 'SET NULL'
    });

    Shipping_Location.belongsTo(Shipping, {
      as: 'shipping',
      foreignKey: 'shipping_id',
      onDelete: 'SET NULL'
    });

  },
  options: {
    tableName: 'shipping_location',
    classMethods: {},
    instanceMethods: {},
    scopes: {
      search: {

      },
      offerScope: function () {
        return {
          include: ['country', 'city', 'shipping']
        }
      }
    },
    hooks: {}
  }

};

