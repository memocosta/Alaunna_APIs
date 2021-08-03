/**
 * Product/ProductSubSubCategory.js
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
    ProductSubSubCategory.belongsTo(Image, {
      as: 'image',
      foreignKey: 'image_id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
    ProductSubSubCategory.belongsTo(ProductSubCategory, {
      as: 'subCategory',
      foreignKey: 'subCategory_id',
      onDelete: 'SET NULL'
    });
  },
  options: {
    tableName: 'productSubSubCategory',
    classMethods: {},
    instanceMethods: {},
    hooks: {
      // afterDestroy: async function (instance, options) {
      //   var SeletedImage = await Image.findOne({ where: { id: instance.image_id } });
      //   await SeletedImage.destroy();
      // }
    }
  }

};

