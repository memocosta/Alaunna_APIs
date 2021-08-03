/**
 * Banners/MarketBanner.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
      defaultValue: 'this is description for sponneserd app'
    },
    link: {
      type: Sequelize.STRING,
    },
    likes : {
      type : Sequelize.INTEGER,
      defaultValue : 0
    },
    comments : {
      type : Sequelize.INTEGER,
      defaultValue : 0
    },
    status: {
      type: Sequelize.ENUM,
      values: ['pending', 'active', 'not_active'],
      defaultValue: 'pending'
    }
  },
  associations: function () {
    MarketBanner.belongsTo(Market, {
      as: 'Market',
      foreignKey: 'market_id',
      onDelete: 'CASCADE'
    });
    MarketBanner.belongsTo(Image, {
      as: 'image',
      foreignKey: 'image_id'
    });
  },
  options: {
    tableName: 'banners',
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
