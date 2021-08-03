/**
 * Sales/Sales.js
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
    disscount : {
      type : Sequelize.DOUBLE,
      defaultValue : 0
    },
    Bill_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  },
  associations: function () {
    Sales.belongsTo(Client, {
      as: 'client',
      foreignKey: 'client_id'
    });
    Sales.belongsTo(Market, {
      as: 'market',
      foreignKey: 'market_id'
    });
    // Sales.belongsToMany(Product, {
    //   through: 'ProductSales',
    //   as: 'products',
    //   foreignKey: 'sales_id',
    //   // onDelete: 'CASCADE',
    //   // onUpdate: 'SET NULL'
    // });
    Sales.hasMany(ProductSales , {
      as : 'products',
      foreignKey: 'sales_id'
    });
  },
  
  options: {
    tableName: 'sales',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};

