/**
 * Cart/Cart.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
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
    Cart.belongsToMany(Product, {
      through: CartProducts,
      foreignKey: 'cart_id',
      as: 'productsData',
      //onDelete: "CASCADE",
      //unique: false,
      // hooks: true,
      // constraints: false
    });
    Cart.belongsTo(User, {
      as: 'owner',
      foreignKey: 'owner_id',
      onDelete: 'CASCADE'
    });
  },
  options: {
    tableName: 'cart',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};

