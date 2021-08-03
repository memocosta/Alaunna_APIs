/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt');
module.exports = {

  attributes: {
    name: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      required: false,
      allowNull: true
    },
    phone: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
    },
    passwordRestToken: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    lat: {
      type: Sequelize.FLOAT,
    },
    lng: {
      type: Sequelize.FLOAT,
    },
    category: {
      type: Sequelize.ENUM,
      allowNull: false,
      required: true,
      values: ['seller', 'customer']
    },
    device_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    facebook_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    googleplus_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    last_admin_msg_read: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue:0
    },
    last_offer_read: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue:0
    },
    last_offer_price_read: {
      type: Sequelize.INTEGER,
      defaultValue:0
    },
    status: {
      type: Sequelize.ENUM,
      allowNull: false,
      required: true,
      values: ['pending', 'active', 'not_active']
    },
    phone_verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: 1
    },
    activate_code: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  associations: function () {
    User.belongsTo(Image, {
      as: 'Image',
      foreignKey: 'Image_id',
      onDelete: 'SET NULL',
      OnUpdate: 'SET NULL'
    });
    User.hasOne(Cart, {
      as: 'Cart',
      foreignKey: 'owner_id',
      onDelete: 'CASCADE'
    });
    User.belongsTo(City, {
      as: 'City',
      foreignKey: 'city_id',
      onDelete: 'SET NULL'
    });
    User.belongsTo(Country, {
      as: 'Country',
      foreignKey: 'country_id',
      onDelete: 'SET NULL'
    });
    User.hasMany(Favorite, {
      as: 'Marketfavorites',
      foreignKey: 'owner_id',
      onDelete: 'CASCADE'
    });
    // User.belongsToMany(Notifications, {
    //   through: {
    //     model: UserNotification,
    //     unique: false
    //   }
    // });
    User.hasOne(Customer, {
      as: 'Customer',
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
    User.hasOne(Seller, {
      as: 'Seller',
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
    User.hasMany(Market, {
      as: 'markets',
      foreignKey: 'Owner_id'
    });
    User.hasMany(ProductFavorite, {
      as: 'favorites',
      foreignKey: 'user_id'
    });
    User.hasMany(Notifications, {
      as: 'notifications',
      foreignKey: 'user_id'
    });
  },
  defaultScope: function () {
    var includeOBJ = ['Image', 'Cart', 'Country', 'City', 'Seller', 'Customer', { model: Market, as: 'markets', include: [{ model: Image, as: 'Image' }, { model: Image, as: 'cover' }] }, {
      model: ProductFavorite,
      as: 'favorites',
      attributes: ['product_id', 'id']
    }];
    return {
      include: includeOBJ
    }
  },
  options: {
    tableName: 'user',
    classMethods: {
      sendNotification: async function (title, message, action, actionType, user_id, market_id) {
        var messageOBJ = {
          app_id: sails.config.localSetting.oneSignal.user_app_id,
          contents: {
            "en": message
          },
          headings: {
            "en": title
          },
          filters: [{ "field": "tag", "key": "user_id", "relation": "=", "value": user_id },
          { "operator": "OR" },
          { "field": "tag", "key": "market_id", "relation": "=", "value": market_id }]
        };
        await Notifications.create({
          title: title,
          message: message,
          action: action,
          actionType: actionType,
          user_id : user_id || null ,
          market_id : market_id,
          for: 'users'
        });
        await sails.helpers.sendNotification(messageOBJ);
      }
    },
    instanceMethods: {
      sendNotification: async function (title, message, action, actionType, market_id) {
        let device_id = this.device_id;
        if (device_id) {
          var messageOBJ = {
            app_id: sails.config.localSetting.oneSignal.user_app_id,
            contents: {
              "en": message
            },
            headings: {
              "en": title
            },
            filters: [
              { field: "tag", key: "user_id", relation: "=", value: this.id },
            ]
          };
          await Notifications.create({
            title: title,
            message: message,
            action: action,
            actionType: actionType,
            for: this.category,
            user_id: this.id
          });
          await sails.helpers.sendNotification(messageOBJ);
        }
      }
    },
    hooks: {
      beforeCreate: async function (model, options) {
        var hash = await bcrypt.hash(model.password, 10);
        model.password = hash;
      },
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
    },
    scopes: {
      DontInclude: {

      }
    },
    indexes: [
      { unique: true, fields: ['category', 'phone'] }
    ]

  }
};
