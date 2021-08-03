/**
 * Chat/Message.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    text: {
      type: Sequelize.STRING,
    },
    read: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    type: {
      type: Sequelize.ENUM,
      allowNull : false,
      values: ['message', 'file', 'image']
    },
    file_url: {
      type: Sequelize.STRING,
    }

  },
  associations: function () {
    Message.belongsTo(User, {
      as: 'from_user',
      foreignKey: {
        name: 'from_user_id',
      }
    });
    Message.belongsTo(Market, {
      as: 'from_market',
      foreignKey: {
        name: 'from_market_id',
      }
    });
    Message.belongsTo(Room, {
      as: 'room',
      foreignKey: {
        name: 'room_id',
        allowNull: false
      },
      onDelete : 'CASCADE'
    });
    Message.belongsTo(Image, {
      as: 'image',
      foreignKey: 'image_id'
    });
  },
  options: {
    tableName: 'messages',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};
