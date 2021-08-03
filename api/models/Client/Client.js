/**
 * Client/Client.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true
    },
    address: {
      type: Sequelize.STRING,
    },
    telephone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    amount: {
      type: Sequelize.DOUBLE,
      defaultValue: 0.0
    },
    notes: {
      type: Sequelize.STRING,
      allowNull: true
    },
  },
  associations: function () {
    Client.belongsTo(Market, {
      as: 'market',
      foreignKey: 'market_id',
    });
  },
  options: {
    tableName: 'client',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};
