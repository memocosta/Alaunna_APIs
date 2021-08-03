/**
 * Slide/Slide.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    title: {
      type: Sequelize.STRING,
      required: false,
      allowNull: true
    },
    description: {
      type: Sequelize.STRING(500),
      required: false,
      allowNull: true
    },
  },
  options: {
    tableName: 'slide',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};

