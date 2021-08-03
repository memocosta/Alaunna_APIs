/**
 * Offers/OfferBanners.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    target: {
      type: Sequelize.ENUM,
      defaultValue : 'products',
      values: ['products', 'markets','url']
    },
    banner_type: {
      type: Sequelize.ENUM,
      defaultValue : 'main',
      values: ['main','sub','products']
    },
    offer_type: {
      type: Sequelize.ENUM,
      defaultValue : 'discount',
      values: ['discount','special','coupon']
    },
    from: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    to: {
      type: Sequelize.DOUBLE,
      allowNull: true,
    },
    url: {
      type: Sequelize.STRING,
      allowNull: true,
    }
  },
  defaultScope: function () {
    return {
      include: [{
        model: Image,
        as: 'image'
      },
      {
        model: ProductCategory,
        as: 'category'
      },
      {
        model: Country,
        as: 'country'
      }],
    }
  },
  associations: function () {
    OfferBanners.belongsTo(ProductCategory, {
      as: 'category',
      foreignKey: 'category_id',
      onDelete: 'SET NULL'
    });

    OfferBanners.belongsTo(ProductSubCategory, {
      as: 'subCategory',
      foreignKey: 'subCategory_id',
      onDelete: 'SET NULL'
    });

    OfferBanners.belongsTo(ProductSubSubCategory, {
      as: 'subSubCategory',
      foreignKey: 'subSubCategory_id',
      onDelete: 'SET NULL'
    });

    OfferBanners.belongsTo(Image, {
      as: 'image',
      foreignKey: 'image_id',
      onDelete: 'CASCADE'
    });

    OfferBanners.belongsTo(Country, {
      as: 'country',
      foreignKey: 'country_id',
      onDelete: 'SET NULL'
    });
  },
  options: {
    tableName: 'offer_banners',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};

