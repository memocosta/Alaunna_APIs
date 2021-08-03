/**
 * Favorite2\Favorite2.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    total_price: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    },
    total_quantity: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    },
    total_items: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    },
    total_size_liter: {
      type: Sequelize.DOUBLE,
      defaultValue: 0.0
    },
    total_size_kg: {
      type: Sequelize.DOUBLE,
      defaultValue: 0.0
    },
    shared: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },

  },
  associations: function () {
    Favorite2.belongsToMany(Product, {
      through: FavoriteProducts,
      foreignKey: 'cart_id',
      as : 'productsData',
    });
    Favorite2.belongsTo(User , {
      as : 'owner',
      foreignKey : 'owner_id',
      onDelete : 'CASCADE'
    });
  },
  options: {
    tableName: 'favorite2',
    classMethods: {},
    instanceMethods: {},
    hooks: {
    }
  }
};

