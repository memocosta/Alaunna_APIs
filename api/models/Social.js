/**
 * Social.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    type: {
      type: Sequelize.ENUM,
      defaultValue : 'f',
      values: ['f', 'g']
    },
    profile: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
  },
  associations: function () {
    Social.belongsTo(User, {
      as: 'user',
      foreignKey: 'user_id',
    });
  },
  options: {
    tableName: 'social',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};

