/**
 * ChatController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var randomestring = require('randomstring');
module.exports = {
  getMessages: async function (req, res) {
    try {
      let parmas = req.allParams(),
        fitlerOBJ = {
          where: {},
          include: []
        };
      console.log(parmas);
      if (!parmas.room_id && parmas.user_id && parmas.market_id) {
        let SelectedRoom = await Room.findOrCreate({
          where: {
            user_id: parmas.user_id,
            market_id: parmas.market_id
          },
          defaults: {
            name: 'newChatRoom',
            chat_id: randomestring.generate(10),
            market_id: parmas.market_id,
            user_id: parmas.user_id
          }
        });
        // console.log(SelectedRoom);
        // parmas.room_id = SelectedRoom.id;
      } else if (!parmas.room_id) {
        return ResponseService.ErrorResponse(res, 'please send the room_id', {
          action: 'invalid-room_id'
        });
      }
      console.log(parmas);
      if (parmas.offset && parmas.offset != 'false') {
        fitlerOBJ['offset'] = 10 * parmas.offset;
        fitlerOBJ['limit'] = 10;
      }
      fitlerOBJ['order'] = [
        ['id', 'DESC']
      ];

      let SelectedRoom = await Room.findOne({
        where: {
          market_id: parmas.market_id,
          user_id: parmas.user_id
        },
        include: [{
          model: Market,
          as: 'market',
          include: ['Image', 'cover']
        }, { model: User, as: 'user' }]
      })
      fitlerOBJ['where']['room_id'] = SelectedRoom.id;
      fitlerOBJ['include'].push('image');
      let SelectedMessages = await Message.findAll(fitlerOBJ);
      SelectedMessages = SelectedMessages.reverse();

      fitlerOBJ['where']['from_user_id'] = parmas.user_id;

      await Message.update({ read: 1 }, { where: { from_user_id: parmas.user_id, room_id: SelectedRoom.id } });
      let SelectedCustomerNotifications = [];

      SelectedCustomerNotifications = await CustomerNotifications.findAndCountAll(
        {
          where: { read: 0 },
          include: [
            {
              model: Message,
              as: 'chat',
              where: { from_user_id: parmas.user_id, room_id: SelectedRoom.id },
              required: true
            }]
        });
      for (let i = 0; i < SelectedCustomerNotifications.rows.length; i++) {
        let CustomerNotificationID = SelectedCustomerNotifications.rows[i].id;
        var SelectedCustomerNotification = await CustomerNotifications.findOne({
          where: {
            id: CustomerNotificationID
          }
        });
        SelectedCustomerNotification.read = 1;
        await SelectedCustomerNotification.save();
      }

      /*let updatedMessages = await Message.find(fitlerOBJ);
      await updatedMessages.update({ read: 1 });*/

      return ResponseService.SuccessResponse(res, 'success for getting all messages', {
        messages: SelectedMessages,
        room: SelectedRoom,
        SelectedCustomerNotifications: SelectedCustomerNotifications
      });
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthign wrong happen when get the messages', {
        action: 'unkownerr',
        error: err
      });
    }
  },
  sendMessage: async function (req, res) {
    try {
      let params = req.allParams(),
        image;
      if (!req.isSocket) {
        return ResponseService.ErrorResponse(res, 'please connect this api using saisl sockert', {
          action: 'socket-error'
        });
      }
      if (!params.room_id) {
        return ResponseService.ErrorResponse(res, 'please send the room_id for this message', {
          action: 'invalid-room_id'
        });
      }
      let SelectedRoom = await Room.findOne({
        where: {
          id: params.room_id
        },
        attributes: ['market_id', 'user_id', 'chat_id', 'name']
      });

      if (params.image) {
        image = await sails.helpers.uploadImage(params.image.base64, randomestring.generate('10'), params.image.alt, params.image.description, 'chat', 500, 500, {});
        params['image_id'] = image.id;
      }
      let CreatedMessage = await Message.create(params);
      let JsonMessage = CreatedMessage.toJSON();
      if (params.type == 'image') {
        JsonMessage['image'] = image;
      }

      if (params.from_user_id) {
        let from_user = await User.findOne({ where: { id: params.from_user_id } });

        let marketobj = await Market.findOne({ where: { id: SelectedRoom.market_id } });
        let marketUser = await User.findOne({ where: { id: marketobj.Owner_id } });
        console.log(marketUser);
        if (marketUser !== null) {
          let notificationOBJ = {
            token: marketUser.device_id,
            body: 'هناك رسالة جديدة',
            type: 'chat',
            title:from_user.name
          };
          if (marketUser.device_id) {
            await sails.helpers.firebase.with(notificationOBJ);
          }

          let newNotificationOBJ = {
            type: 'chat',
            user_id: marketobj.Owner_id,
            message_id: CreatedMessage.id,
          };
          await CustomerNotifications.create(newNotificationOBJ);

        }
      }

      if (params.from_market_id) {
        let notificationOBJ = {
          type: 'chat',
          user_id: SelectedRoom.user_id,
          message_id: CreatedMessage.id,
        };
        console.log(notificationOBJ)
        await CustomerNotifications.create(notificationOBJ);
      }

      sails.sockets.join(req, SelectedRoom.chat_id);
      sails.sockets.broadcast(SelectedRoom.chat_id, 'newMessage', JsonMessage, req);

      // let socketId = sails.sockets.getId(req);
      // console.log(socketId);
      return ResponseService.SuccessResponse(res, 'success for sending message', JsonMessage);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthign wrong happen when send the message', {
        action: 'unkown-err',
        error: err
      });
    }
  },
  subscribeToRoom: async function (req, res) {
    try {
      let parmas = req.allParams();
      if (!req.isSocket) {
        return ResponseService.ErrorResponse(res, 'please connect this api using saisl sockert', {
          action: 'socket-error'
        });
      }
      let SelectedRoom = await Room.findOne({
        where: {
          id: parmas.room_id
        },
        attributes: ['chat_id', 'name']
      });
      sails.sockets.join(SelectedRoom.chat_id, req);
      return ResponseService.SuccessResponse(res, 'success for getting ')
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthign wrong happen when suscribe to room', {
        action: 'unkown-err',
        error: err
      });
    }
  },
  leaveRoom: async function (req, res) {
    try {
      let parmas = req.allParams();
      if (!req.isSocket) {
        return ResponseService.ErrorResponse(res, 'please connect this api using saisl sockert', {
          action: 'socket-error'
        });
      }
      let SelectedRoom = await Room.findOne({
        where: {
          id: parmas.room_id
        },
        attributes: ['chat_id', 'name']
      });
      sails.sockets.leave(req, SelectedRoom.chat_id);
      return ResponseService.SuccessResponse(res, 'success for leaving the room', SelectedRoom);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen when leave the room ', {
        action: 'unkown-err',
        error: err
      });
    }
  },
  adminIndex: async function (req, res) {
    try {
      console.log(req.allParams())
      let parmas = req.allParams(), fitlerOBJ = { where: {}, include: [] };
      let roomWhere = {};
      let countMessages = -1;
      if (parmas['offset']) {
        fitlerOBJ['offset'] = parmas.offset * 50;
        fitlerOBJ['limit'] = 50;
      }
      if (parmas['user_id']) {
        roomWhere['user_id'] = parmas.user_id;
      }
      if (parmas['market_id']) {
        roomWhere['market_id'] = parmas.market_id;
      }


      // fitlerOBJ.include.push({model : Room , as : 'room' , where : roomWhere ,include : ['user' , 'market']});
      fitlerOBJ.include.push({ model: Room, as: 'room', include: ['user', 'market'] });
      // fitlerOBJ.include.push('from_market');
      // fitlerOBJ.include.push('from_user');
      fitlerOBJ['order'] = [['id', 'DESC']]
      let selectedMessages = await Message.findAll(fitlerOBJ);
      if (parmas.offset === '0') {
        countMessages = await Message.count();
      }
      return ResponseService.SuccessResponse(res, 'success for geting all messages', { 'selectedMessages': selectedMessages, 'count': countMessages });
    } catch (err) {
      // console.log(err);
      return ResponseService.ErrorResponse(res, 'something wrong happen when leave the room ', {
        action: 'unkown-err',
        error: err
      });
    }
  }
};
