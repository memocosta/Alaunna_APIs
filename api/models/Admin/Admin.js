/**
 * Admin/Admin.js
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
      required: true,
      allowNull: false,
      indexes: {
      unique:true
              },
    },
    device_id: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    }
  },
  associations: function () {
    // Admin.belongsToMany(Notifications, {
    //   through: {
    //     model: AdminNotification,
    //     unique: false
    //   },
    //   as: 'notifications'
    // });
    Admin.hasMany(Notifications, {
      as: 'notifications',
      foreignKey: 'admin_id'
    });
  },
  options: {
    tableName: 'admin',
    classMethods: {
      sendNotification: async function (title, message, action, actionType) {
        var messageOBJ = {
          app_id: sails.config.custom.oneSignal.admin.appId,
          contents: {
            "en": message
          },
          headings: {
            "en": title
          },
          filters: [{
            "field": "tag",
            "key": "category",
            "relation": "=",
            "value": "admin"
          }, ]
        };
        await Notifications.create({
          title: title,
          message: message,
          action: action,
          actionType: actionType,
          for: 'admin'
        });
        await sails.helpers.sendNotification(messageOBJ ,sails.config.custom.oneSignal.admin.appAuthKey);
      }
    },
    instanceMethods: {
      sendNotification: async function (title, message, action, actionType) {
        let device_id = this.device_id;
        var messageOBJ = {
          app_id: sails.config.custom.oneSignal.admin.appId,
          contents: {
            "en": message
          },
          headings: {
            "en": title
          },
          include_player_ids: [device_id]
        };
        await Notifications.create({
          title: title,
          message: message,
          action: action,
          actionType: actionType,
          for: 'admin',
          admin_id : this.id
        });
        await sails.helpers.sendNotification(messageOBJ ,sails.custom.oneSignal.admin.appAuthKey);
      }
    },
    hooks: {
      beforeCreate: async function (model, options) {
        var hash = await bcrypt.hash(model.password, 10);
        model.password = hash;
      },
    }
  }

};
