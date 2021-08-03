/**
 * Chat/Room.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    chat_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
  },
  associations: function () {
    // Room.belongsTo(User, {
    //   as: 'created_by',
    //   foreignKey: 'created_by_id'
    // });
    Room.belongsTo(Image, {
      as: 'image',
      foreignKey: 'image_id'
    });
    // Room.belongsToMany(User, {
    //   through: {
    //     model: RoomUser
    //   },
    //   as: 'users',
    //   foreignKey: 'room_id'
    // });
    Room.belongsTo(Market, {
      as: 'market',
      foreignKey: 'market_id'
    });
    Room.belongsTo(User , {
      as : 'user' ,
      foreignKey : 'user_id'
    })
    Room.hasMany(Message, {
      as: 'messages',
      foreignKey: 'room_id'
    })
  },
  options: {
    tableName: 'rooms',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }

};
