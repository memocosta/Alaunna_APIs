/**
 * Offers/Offer.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true
      },
      description: {
        type: Sequelize.STRING
      },
      viewsNumer: {
        type: Sequelize.INTEGER,
        defualtValue: 0
      }
  },
  associations: function () {
    Offer.belongsTo(Market, {
      as: 'Market',
      foreignKey: 'market_id',
      onDelete: 'CASCADE'
    });
    Offer.belongsTo(Image, {
      as: 'Image',
      foreignKey: 'image_id',
      onDelete: 'CASCADE'
    });
  },
  // options: {
  //   tableName: 'offers',
  //   classMethods: {},
  //   instanceMethods: {},
  //   hooks: {}
  // }

};

