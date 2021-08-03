/**
 * Shipping_Company/Shipping_Company_Rate.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    value: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5
      }
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    comment: {
      type: Sequelize.STRING,
      defaultValue: ''
    }
  },
  associations: function () {
    Shipping_Rate.belongsTo(Shipping, {
      as: 'Shipping',
      foreignKey: 'Shipping_id',
      onDelete: 'CASCADE'
    });
    Shipping_Rate.belongsTo(User, {
      as: 'user',
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
  },
  options: {
    tableName: 'Shipping_rate',
    classMethods: {},
    instanceMethods: {},
    scopes: {},
    hooks: {}
  }

};

