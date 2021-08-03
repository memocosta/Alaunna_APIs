/**
 * Auth/Customer.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    gender: {
      type: Sequelize.ENUM,
      allowNull: true,
      values: ['male', 'female']
    },
    points: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
  },
  associations: function () {
    Customer.belongsTo(User, {
      as: 'User',
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });

  },
  options: {
    tableName: 'customer',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};
