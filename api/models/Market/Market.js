/**
 * Market/Market.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: Sequelize.STRING,
      required: true,
    },
    status: {
      type: Sequelize.ENUM,
      allowNull: false,
      required: true,
      defaultValue: 'pending',
      values: ['pending', 'active', 'not_active']
    },
    description: {
      type: Sequelize.STRING(250),
    },
    oppning_hours: {
      type: Sequelize.STRING(1000),
      defaultValue: "{}"
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true
    },
    class: {
      type: Sequelize.STRING,
      defaultValue: 'small'
    },
    lat: {
      type: Sequelize.FLOAT,
      defaultValue: 0
    },
    lng: {
      type: Sequelize.FLOAT,
      defaultValue: 0
    },
    rate: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5
      }
    },
    viewsNumber: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    special: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    order: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    views: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    views_old: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    orderCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    meta_description: {
      type: Sequelize.STRING,
    },
    meta_keywords: {
      type: Sequelize.STRING
    },
    facebook: {
      type: Sequelize.STRING,
    },
    instgram: {
      type: Sequelize.STRING,
    },
    twitter: {
      type: Sequelize.STRING,
    },
    linkedin: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    delivery_type: {
      type: Sequelize.ENUM,
      allowNull: false,
      required: true,
      defaultValue: 'market',
      values: ['delivery', 'market', 'all']
    },
    delivery_terms: {
      type: Sequelize.STRING
    },
    delivery_cost: {
      type: Sequelize.STRING
    },
    online_payment: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    cash_on_delivery: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    alaunna_shipping: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    }
  },
  defaultScope: function () {
    return {
      include: ['categories', 'Country'],
      // order: [
      //   ['special', 'DESC'],
      //   ['order', 'DESC'],
      //   ['id', 'DESC']
      // ]
    }
  },
  associations: function () {
    Market.belongsTo(Image, {
      as: 'Image',
      foreignKey: 'image_id',
      onDelete: 'SET NULL'
    });
    Market.belongsTo(Image, {
      as: 'cover',
      foreignKey: 'cover_id',
      onDelete: 'SET NULL'
    });
    Market.belongsTo(User, {
      as: 'Owner',
      foreignKey: 'Owner_id',
      onDelete: "CASCADE",
    });
    Market.belongsTo(ProductCategory, {
      as: 'Category',
      foreignKey: 'marketcategory_id',
      onDelete: 'SET NULL'
    });
    Market.belongsTo(City, {
      as: 'City',
      foreignKey: 'City_id',
      onDelete: 'SET NULL'
    });
    Market.belongsTo(Country, {
      as: 'Country',
      foreignKey: 'Country_id',
      onDelete: 'SET NULL'
    });
    Market.belongsToMany(Product, {
      through: {
        model: Market_Products,
        unique: false
      },
      as: 'products',
      foreignKey: 'market_id',
    });
    Market.belongsToMany(ProductCategory, {
      through: {
        model: MarketCategory,
        unique: false
      },
      as: 'categories',
      foreignKey: 'market_id',
    });
    Market.hasOne(Safe, {
      as: 'safe',
      foreignKey: 'market_id'
    });
    Market.hasMany(Supplier, {
      as: 'suppliers',
      foreignKey: 'market_id'
    });
    Market.hasMany(Client, {
      as: 'clients',
      foreignKey: 'market_id'
    });
    // Market.hasMany(Order, {
    //   as: 'orders',
    //   foreignKey: 'market_id'
    // });
    Market.hasMany(ProductOffer, {
      as: 'offers',
      foreignKey: 'market_id',
    });
    Market.hasMany(MarketBanner, {
      as: 'banners',
      foreignKey: 'market_id'
    });
    Market.belongsToMany(OfferPrice, {
      through: {
        model: OfferPriceMarket
      },
      as: 'offer_prices',
      foreignKey: 'market_id'
    })
  },
  options: {
    tableName: 'market',
    classMethods: {},
    instanceMethods: {},
    scopes: {
      search: {
        attributes: ['id', 'name', 'status']
      }
    },
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
        var SelectedCover = await Image.findOne({
          where: {
            id: instance.cover_id
          }
        });
        if (SelectedCover) {
          await SelectedCover.destroy();
        }
      }
    }
  }
};
