/**
 * Sales/ProductSales.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    quantity : {
      type : Sequelize.INTEGER,
      required : true,
      allowNull : false
    },
    market_id : {
      type : Sequelize.INTEGER,
      defaultValue : 0
    },
    tax : {
      type : Sequelize.DOUBLE,
      defaultValue : 0
    },
    price : {
      type : Sequelize.DOUBLE,
      required : true,
      allowNull : false
    }
  },
  defaultScope: function () {
    return {
      include: ['product']
    }
  },
  associations: function () {
    ProductSales.belongsTo(Product , {
      as : 'product',
      foreignKey : 'product_id'
    });
    ProductSales.belongsTo(Sales , {
      as : 'sales',
      foreignKey : 'sales_id'
    });
  },
  options: {
    tableName: 'Productsales',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};

