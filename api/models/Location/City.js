/**
 * Location/City.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: Sequelize.STRING,
      required: true
    },
    description: {
      type: Sequelize.STRING,
    },
  },
  associations: function () {
    City.belongsTo(Country, {
      as: 'country',
      targetKey: 'id'
    });
  },
  options: {
    tableName: 'city',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};
