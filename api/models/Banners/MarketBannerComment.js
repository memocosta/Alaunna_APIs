/**
 * Banners/MarketBannerComment.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    comment : {
      type: Sequelize.STRING,
    }
  },
  associations: function () {
    MarketBannerComment.belongsTo(MarketBanner, {
      as: 'market_banner',
      foreignKey: 'market_banner_id',
    });
    MarketBannerComment.belongsTo(User, {
      as: 'user',
      foreignKey: 'user_id'
    });
  },
  options: {
    tableName: 'market_banner_comments',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};

