/**
 * Auth/Seller.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    ssn: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    NumberOfMarkets: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    onAccounting: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    packageName: {
      type: Sequelize.STRING,
    },
    category_market: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  },
  defaultScope: function () {
    // // return {
    //   include: ['markets']
    // }
  },
  associations: function () {
    Seller.belongsTo(User, {
      as: 'User',
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
    // Seller.hasMany(Market, {
    //   as: 'markets',
    //   foreignKey: 'Owner_id',
    //   onDelete: "CASCADE",
    // });
  },
  options: {
    tableName: 'seller',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};
