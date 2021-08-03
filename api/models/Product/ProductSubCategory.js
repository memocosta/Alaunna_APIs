/**
 * Product/ProductSubCategory.js
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
    inputs : {
      type : Sequelize.STRING(1000)
    }
  },
  associations: function () {
    ProductSubCategory.belongsTo(Image, {
      as: 'image',
      foreignKey: 'image_id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
    ProductSubCategory.hasMany(ProductSubSubCategory, {
      as: 'subSubCategories',
      foreignKey: 'subCategory_id',
      onDelete: 'CASCADE'
    })
    ProductSubCategory.belongsTo(ProductCategory, {
      as: 'category',
      foreignKey: 'productcategory_id',
      onDelete: 'SET NULL'
    });
    ProductSubCategory.hasMany(Product , {
      as : 'products',
      foreignKey : 'subCategory_id'
    })
  },
  options: {
    tableName: 'productSubCategory',
    classMethods: {},
    instanceMethods: {},
    hooks: {
      // afterDestroy: async function (instance, options) {
      //   var SeletedImage = await Image.findOne({ where: { id: instance.image_id } });
      //   if (SeletedImage){
      //     await SeletedImage.destroy();
      //   }
      // }
    }
  }

};

