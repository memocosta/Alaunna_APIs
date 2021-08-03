/**
 * Coupon/coupon.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    code: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    count: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    value: {
      type: Sequelize.DOUBLE,
      defaultValue: 0.0
    },
    from: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    to: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM,
      defaultValue : 'pending',
      values: ['pending', 'active', 'not_active']
    },
    type: {
      type: Sequelize.ENUM,
      defaultValue : 'percent',
      values: ['percent', 'money']
    }
  },
  associations: function () {
    coupon.belongsTo(Market, {
      as: 'Market',
      foreignKey: 'market_id',
      onDelete: 'CASCADE'
    });
  },
  options: {
    tableName: 'coupon',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};

