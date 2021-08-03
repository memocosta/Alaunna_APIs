/**
 * Image/ProductSubCategoryImage.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {},
  associations: function () {
    ProductSubCategoryImage.belongsTo(Image, {
      as: 'image',
      foreignKey: 'image_id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    })
  },
  defaultScope: function () {
    return {
      include: [{
        model: Image,
        foreignKey: 'image_id',
        as: 'image'
      }],
    }
  },
  // options: {
  //   tableName: 'productSubCategoryImage',
  //   classMethods: {},
  //   instanceMethods: {},
  //   hooks: {}
  // }

};
