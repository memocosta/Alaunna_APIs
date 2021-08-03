/**
 * OfferPrice/OfferPrice.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    for : {
      type : Sequelize.ENUM,
      values : ['all_market' , 'specific_market' , 'some_markets']
    },
    cities: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  },
  associations: function () {
    OfferPrice.belongsTo(User, {
      as: 'user',
      foreignKey: 'user_id'
    });
    OfferPrice.belongsToMany(Market, {
      through : {
        model : OfferPriceMarket,
      },
      as : 'markets',
      foreignKey : 'offer_price_id'
    });
    OfferPrice.belongsTo(ProductCategory, {
      as: 'category',
      foreignKey: 'category_id'
    });
    OfferPrice.belongsTo(Country, {
      as: 'country',
      foreignKey: 'country_id'
    });
    // OfferPrice.belongsTo(City, {
    //   as: 'city',
    //   foreignKey: 'city_id'
    // });
    OfferPrice.hasMany(OfferPriceReplay , {
      as : 'offer_price_replay',
      foreignKey : 'offer_price_id'
    });
    OfferPrice.belongsTo(Image ,{
      as : 'image',
      foreignKey : 'image_id'
    })
  },
  options: {
    tableName: 'offer_price',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};

