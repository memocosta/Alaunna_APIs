/**
 * Notification/Notification.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    read: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    type: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    user_id:{
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    topic: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  associations: function () {
    CustomerNotifications.belongsTo(Message, {
      as : 'chat',
      foreignKey : 'message_id'
    });
    CustomerNotifications.belongsTo(MarketBanner , {
      as : 'offer',
      foreignKey : 'offer_id'
    });
    CustomerNotifications.belongsTo(OfferPriceReplay , {
      as : 'offer_reply',
      foreignKey : 'offer_reply_id',
    });
    CustomerNotifications.belongsTo(Notifications , {
      as : 'alaunna_message',
      foreignKey : 'alaunna_message_id',
    });
    CustomerNotifications.belongsTo(ProductOffer , {
      as : 'product_offer',
      foreignKey : 'product_offer_id',
    });
    CustomerNotifications.belongsTo(OfferBanners , {
      as : 'offer_banner',
      foreignKey : 'offer_banner_id',
    });
    CustomerNotifications.belongsTo(Order , {
      as : 'order',
      foreignKey : 'order_id',
    });
    CustomerNotifications.belongsTo(OfferPrice, {
      as: 'offer_price',
      foreignKey: 'offer_price_id'
    });
  },
  options: {
    tableName: 'customer_notifications',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};

