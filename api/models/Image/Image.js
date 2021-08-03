/**
 * Image/Image.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
    },
    alt: {
      type: Sequelize.STRING,
    },
    for: {
      type: Sequelize.STRING
    }
  },
  defaultScope: function () {
    return {
      order : [['id' , 'ASC']]
    }
  },
  options: {
    tableName: 'Image',
    classMethods: {},
    instanceMethods: {},
    hooks: {
      beforeDestroy: async function (instance, options) {
        return new Promise((resolve, reject) => {
          var ImagePath = './assets/images/' + instance.for + '/' + instance.name;
          require('fs').unlink(ImagePath, (err) => {
            if (err) {
              reject(err);
            }
            resolve('done');
          })
        })
      }
    }
  }

};
