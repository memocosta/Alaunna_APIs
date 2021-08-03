/**
 * Address\ConsumerAddress.js
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
      allowNull: false,
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
    ConsumerAddress.belongsTo(Country, {
      as: 'country',
      foreignKey: 'country_id',
      onDelete: 'SET NULL'
    });

    ConsumerAddress.belongsTo(City, {
      as: 'city',
      foreignKey: 'city_id',
      onDelete: 'SET NULL'
    });

    ConsumerAddress.belongsTo(User, {
      as: 'user',
      foreignKey: 'user_id',
      onDelete: 'SET NULL'
    });

  },
  options: {
  tableName: 'consumer_address',
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

