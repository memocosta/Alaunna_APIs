/**
 * Supplier/Supplier.js
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
    notes: {
      type: Sequelize.STRING,
      allowNull: true
    },
    amount: {
      type: Sequelize.DOUBLE,
      defaultValue: 0.0
    }
  },
  associations: function () {
    Supplier.belongsTo(Market, {
      as: 'market',
      foreignKey: 'market_id',
    });
  },
  options: {
    tableName: 'supplier',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};
