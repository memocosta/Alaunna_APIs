/**
 * Product/ProductOffer.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
var moment = require('moment');

module.exports = {

  attributes: {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true
    },
    description: {
      type: Sequelize.STRING,
    },
    from: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    to: {
      type: Sequelize.DATE,
      allowNull: false,
      //defaultValue: moment().add('10', 'days').format("YYYY-MM-DD HH:mm:ss")
    },
    offer_type: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    value: {
      type: Sequelize.DOUBLE,
      defaultValue: 0.0
    },
    status: {
      type: Sequelize.ENUM,
      defaultValue : 'active',
      values: ['pending', 'active', 'not_active']
    },
    percentage: {
      type: Sequelize.INTEGER,
      defaultValue : 1
    },
    image_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    discount: {
      type: Sequelize.DOUBLE,
      defaultValue: 0.0
    },
    likes: {
      type: Sequelize.INTEGER,
      defaultValue : 0
    },
    comments: {
      type: Sequelize.INTEGER,
      defaultValue : 0
    },
    all: {
      type: Sequelize.INTEGER,
      defaultValue : 0
    }
  },
  associations: function () {
    ProductOffer.hasMany(Product, {
      as: 'product',
      foreignKey: 'offer_id',
      onDelete: 'CASCADE'
    });
    ProductOffer.belongsTo(Market, {
      as: 'market',
      foreignKey: 'market_id',
      onDelete: 'CASCADE'
    });
    ProductOffer.belongsTo(Image, {
      as: 'image',
      foreignKey: 'image_id'
    });

  },
  defaultScope: function () {

    return {
      include: [{
        model: Image,
        as: 'image'
      }],
      
    }
  },
  options: {
    tableName: 'product_offer',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }


};

