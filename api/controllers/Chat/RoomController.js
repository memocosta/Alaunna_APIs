/**
 * RoomController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var randomestring = require('randomstring');
module.exports = {
  index: async function (req, res) {
    try {
      let params = req.allParams(),
        fitlerOBJ = {
          where: {},
          include: []
        };
      if (params.offset && params.offset != 'false') {
        fitlerOBJ['offset'] = 10 * params.offset;
        fitlerOBJ['limit'] = 10;
      }
      if (params.user_id) {
        fitlerOBJ['where']['user_id'] = params.user_id;
      }
      if (params.market_id) {
        fitlerOBJ['where']['market_id'] = params.market_id
      }
      fitlerOBJ['order'] = [['id', 'DESC']]
      console.log(params);
      // let Rooms = await selectedUser.getRooms(fitlerOBJ);
      fitlerOBJ.include.push({ model: User, as: 'user' });
      fitlerOBJ['include'].push({ model: Market, as: 'market', include: ['Image','cover'] });
      fitlerOBJ.include.push({ model: Message, as: 'messages', include: ['image'], order: [['id', 'DESC']], limit: 1 })
      let Rooms = await Room.findAndCountAll(fitlerOBJ);
      console.log(Rooms);
      for (let i = 0; i < Rooms['rows'].length; i++) {
        console.log(Rooms['rows'][i].chat_id)
        sails.sockets.join(req, Rooms['rows'][i].chat_id);
      }

      return ResponseService.SuccessResponse(res, 'success for getting all rooms', Rooms);
    } catch (err) {
      console.log(err)
      return ResponseService.ErrorResponse(res, 'somthign wrong happen when get the rooms', {
        action: 'unkown-err',
        error: err
      });
    }
  },
  getMessagesCount: async function (req, res) {
    try {
      let params = req.allParams(),
        fitlerOBJ = {
          where: {},
          include: []
        };
      if (params.market_id) {
        fitlerOBJ['where']['market_id'] = params.market_id
      }
      fitlerOBJ.include.push({ model: User, as: 'user' });
      fitlerOBJ['include'].push({ model: Market, as: 'market', include: ['Image'] });
      fitlerOBJ.include.push({ model: Message, as: 'messages', order: [['id', 'DESC']] })
      let Rooms = await Room.findAndCountAll(fitlerOBJ);
      console.log(Rooms);
      let countMarketInbox = 0;
      let countMarketSent = 0;
      let InboxMessages = [];
      let SentMessages = [];
      for (let i = 0; i < Rooms['rows'].length; i++) {
        for (let j = 0; j < Rooms['rows'][i].messages.length; j++) {
          let message = Rooms['rows'][i].messages[j];
          if (message && message.from_market_id == null) {
            countMarketInbox++;
            InboxMessages.push(
              Object.assign(
                {},
                { 'message': Rooms['rows'][i].messages[j] },
                { 'market': Rooms['rows'][i].market }
              )
              );
          }else{
            countMarketSent++;
            SentMessages.push(
              Object.assign(
                {},
                { 'message': Rooms['rows'][i].messages[j] },
                { 'market': Rooms['rows'][i].market }
              )
              );
          }
        }
        console.log(Rooms);
        // let message = Rooms['rows'][i].messages;
        // if (message && !message.read) { count++;
        //   messages.push(Rooms['rows'][i].messages[j]) }
      }
      Rooms['countMarketInbox'] = countMarketInbox;
      Rooms['countMarketSent'] = countMarketSent;
      Rooms['countReadPercentage'] = Math.ceil((countMarketSent/countMarketInbox)*100);
      return ResponseService.SuccessResponse(res, 'success for getting all Counts', Rooms);
    } catch (err) {
      console.log(err)
      return ResponseService.ErrorResponse(res, 'somthign wrong happen when get Counts', {
        action: 'unkown-err',
        error: err
      });
    }
  },
  getUnreadMessages: async function (req, res) {
    try {
      let params = req.allParams(),
        fitlerOBJ = {
          where: {},
          include: []
        };
      if (params.offset && params.offset != 'false') {
        fitlerOBJ['offset'] = 10 * params.offset;
        fitlerOBJ['limit'] = 10;
      }
      if (params.user_id) {
        fitlerOBJ['where']['user_id'] = params.user_id;
      }
      if (params.market_id) {
        fitlerOBJ['where']['market_id'] = params.market_id
      }
      fitlerOBJ.include.push({ model: User, as: 'user' });
      fitlerOBJ['include'].push({ model: Market, as: 'market', include: ['Image'] });
      fitlerOBJ.include.push({ model: Message, as: 'messages', order: [['id', 'DESC']] })
      let Rooms = await Room.findAndCountAll(fitlerOBJ);
      let count = 0;
      let messages = [];
      for (let i = 0; i < Rooms['rows'].length; i++) {
        for (let j = 0; j < Rooms['rows'][i].messages.length; j++) {
          let message = Rooms['rows'][i].messages[j];
          if (message && !message.read) {
            count++;
            messages.push(
              Object.assign(
                {},
                { 'message': Rooms['rows'][i].messages[j] },
                { 'market': Rooms['rows'][i].market }
              )
              );
          }
        }
        // let message = Rooms['rows'][i].messages;
        // if (message && !message.read) { count++;
        //   messages.push(Rooms['rows'][i].messages[j]) }
      }
      return ResponseService.SuccessResponse(res, 'success for getting all unread messages', messages);
    } catch (err) {
      console.log(err)
      return ResponseService.ErrorResponse(res, 'somthign wrong happen when get unread messages', {
        action: 'unkown-err',
        error: err
      });
    }
  },
  create: async function (req, res) {
    try {
      let params = req.allParams();
      params['chat_id'] = randomestring.generate(10);
      if (!params.users || !params.users.length) {
        return ResponseService.ErrorResponse(res, 'please send the users in the room')
      }
      let CreatedRoom = await Room.create(params);
      for (let i = 0; i < params.users.length; i++) {
        await RoomUser.create({
          user_id: params.users[i],
          room_id: CreatedRoom.id
        });
      }
      return ResponseService.SuccessResponse(res, 'success for creating the room ', CreatedRoom);
    } catch (err) {
      console.log(err);
      return ResponseService.SuccessResponse(res, 'somthign wrong happen when create the room', {
        action: 'unkown-err'
      });
    }
  },
  edit: async function (req, res) {
    try {
      let params = req.allParams();
      let SelectedRoom = await Room.findOne({
        where: {
          id: params.id
        }
      });
      await SelectedRoom.update(params);
      return ResponseService.SuccessResponse(res, 'success for editing the room')
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthign wrong happen when edit the room ', {
        action: 'unkown-err',
        error: err
      });
    }
  },
  remove: async function (req, res) {
    try {
      let id = req.param('id');
      await Room.destroy({
        where: {
          id: id
        }
      });
      return ResponseService.SuccessResponse(res, 'success for remove the room', {});
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when remove the room ', {
        action: 'unkown-err',
        error: err
      });
    }
  },
  addUserToRoom: async function (req, res) {
    try {
      let params = req.allParams();
      if (!params.user_id || !params.room_id) {
        return ResponseService.ErrorResponse(res, 'please send the room_id and user_id', {
          action: 'invalid-data'
        });
      }
      await RoomUser.create({
        room_id: params.room_id,
        user_id: params.user_id
      });
      return ResponseService.SuccessResponse(res, 'success for add the user to room', {});
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthign wrong happen when add the user to room', {
        action: 'unkown-err',
        error: err
      })
    }
  },
  removeUserToRoom: async function (req, res) {
    try {
      let params = req.allParams();
      if (!params.user_id || !params.room_id) {
        return ResponseService.ErrorResponse(res, 'please send the room_id and user_id', {
          action: 'invalid-data'
        });
      }
      await RoomUser.destroy({
        where: {
          user_id: params.user_id,
          room_id: params.room_id
        }
      });
      return ResponseService.SuccessResponse(res, 'success for removing the user from room', {});
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthign wrong happen when remove the user to room', {
        action: 'unkown-err',
        error: err
      })
    }
  }

};
