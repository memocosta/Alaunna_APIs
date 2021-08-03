/**
 * Notification/Notification.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    read: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    message: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    action: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    actionType: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    icon: {
      type: Sequelize.STRING,
      defaultValue: 'fa-envelope'
    },
    for : {
      type : Sequelize.ENUM,
      values : ['admin', 'seller' , 'customer']
    }

  },
  associations: function () {
    // Notifications.belongsToMany(User, {
    //   through: {
    //     model: UserNotification,
    //     unique: false
    //   }
    // });
    // Notifications.belongsToMany(Admin, {
    //   through: {
    //     model: AdminNotification,
    //     unique: false
    //   }
    // });
    Notifications.belongsTo(User, {
      as : 'user',
      foreignKey : 'user_id'
    });
    Notifications.belongsTo(Admin , {
      as : 'admin',
      foreignKey : 'admin_id'
    });
    Notifications.belongsTo(Market , {
      as : 'market',
      foreignKey : 'market_id',
    })
  },
  options: {
    tableName: 'notification',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};

