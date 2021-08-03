/**
 * Purchases/Purchases.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    total: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      required: true,
    },
    Bill_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  },
  associations: function () {
    Purchases.belongsTo(Supplier, {
      as: 'supplier',
      foreignKey: 'supplier_id'
    });
    Purchases.belongsTo(Market, {
      as: 'market',
      foreignKey: 'market_id'
    });
    Purchases.belongsToMany(Product, {
      through: {
        model: ProductPurchases,
        unique: false
      },
      as: 'products',
      foreignKey: 'purchas_id',
      // onDelete: 'CASCADE',
      // onUpdate: 'SET NULL'
    });
  },
  options: {
    tableName: 'purchases',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};

