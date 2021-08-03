/**
 * Product/ProductCategory.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
    },
    inputs: {
      type: Sequelize.STRING(5000)
    }
  },
  associations: function () {
    ProductCategory.hasMany(Product, {
      as: 'products',
      foreignKey: 'category_id'
    });
    ProductCategory.hasMany(Market, {
      as: 'markets',
      foreignKey: 'marketcategory_id'
    })
    ProductCategory.belongsTo(Image, {
      as: 'image',
      foreignKey: 'image_id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
    ProductCategory.hasMany(ProductSubCategory, {
      as: 'subCategories',
      foreignKey: 'productcategory_id',
      onDelete: 'CASCADE'
    });
    ProductCategory.belongsToMany(Market, {
      through: {
        model: MarketCategory,
        unique: true
      },
      as: 'categoryMarkets',
      foreignKey: 'category_id'
    });
  },
  options: {
    tableName: 'productCategory',
    classMethods: {},
    instanceMethods: {},
    hooks: {
      afterDestroy: async function (instance, options) {
        var SeletedImage = await Image.findOne({
          where: {
            id: instance.image_id
          }
        });
        if (SeletedImage ){
          await SeletedImage.destroy();
        }
      }
    }
  }

};
