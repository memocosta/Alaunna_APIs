/**
 * OfferPrice/OfferPriceReply.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    comment: {
      type: Sequelize.STRING,
      allowNull: false
    },
    read: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    price: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  associations: function () {
    OfferPriceReplay.belongsTo(OfferPrice, {
      as: 'offer_price',
      foreignKey: 'offer_price_id'
    });
    OfferPriceReplay.belongsTo(Market, {
      as: 'market',
      foreignKey: 'market_id'
    });
    OfferPriceReplay.belongsTo(Image ,{
      as : 'image',
      foreignKey : 'image_id'
    });
  },
  options: {
    tableName: 'offer_price_replay',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};

