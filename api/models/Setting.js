/**
 * Setting.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    home_meta_keyword : {
      type : Sequelize.STRING
    },
    home_meta_description : {
      type : Sequelize.STRING
    },
    offers_meta_keyword : {
      type : Sequelize.STRING
    },
    offers_meta_description : {
      type : Sequelize.STRING
    },
    products_meta_keyword : {
      type : Sequelize.STRING
    },
    products_meta_description : {
      type : Sequelize.STRING
    },
    markets_meta_keyword : {
      type : Sequelize.STRING
    },
    markets_meta_description : {
      type : Sequelize.STRING
    },
  },
  associations: function () {
    Setting.belongsTo(Image , {
      as : 'home_image',
      foreignKey : 'home_image_id'
    })
  },
  options: {
    tableName: 'settings',
    classMethods: {},
    instanceMethods: {},
    hooks: {},
  }

};

