/**
 * Address\SellerAddress.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      required: true,
      allowNull: true,
    },
    address: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
    },
    latitude: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
    },
    longitude: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
    },

  },
  associations: function () {
    SellerAddress.belongsTo(Country, {
      as: 'country',
      foreignKey: 'country_id',
      onDelete: 'SET NULL'
    });

    SellerAddress.belongsTo(City, {
      as: 'city',
      foreignKey: 'city_id',
      onDelete: 'SET NULL'
    });

    SellerAddress.belongsTo(User, {
      as: 'user',
      foreignKey: 'user_id',
      onDelete: 'SET NULL'
    });

  },
  options: {
    tableName: 'seller_address',
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

