/**
 * General/SponserdBanners.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      defaultValue: 'this is description for sponneserd app'
    },
    link: {
      type: Sequelize.STRING,
    },
    for: {
      type: Sequelize.ENUM,
      defaultValue: 'website',
      values: ['website', 'user_mobile', 'seller_mobile']
    },
    sub_for: {
      type: Sequelize.ENUM,
      defaultValue: 'home',
      values: ['home', 'product_details', 'products', 'markets','ask-markets','contact_banners']
    }
  },
  associations: function () {
    SponserdBanners.belongsTo(Image, {
      as: 'image',
      foreignKey: 'image_id',
      onDelete: 'CASCADe'
    });
  },
  options: {
    tableName: 'sponserd_banners',
    classMethods: {},
    instanceMethods: {},
    hooks: {
      afterDestroy: async function (instance, options) {
        var SeletedImage = await Image.findOne({
          where: {
            id: instance.image_id
          }
        });
        if (SeletedImage) {
          await SeletedImage.destroy();
        }
      }
    }
  }

};
