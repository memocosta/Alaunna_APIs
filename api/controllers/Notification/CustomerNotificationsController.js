/**
 * NotificationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  index: async function (req, res) {
    try {
      let user_id = req.param('user_id');
      let topic = req.param('topic');
        filterOBJ = { where: {} }, offset = req.param('offset');
      let chat_where = {};
      if (user_id && user_id != 'false') {
        filterOBJ['where']['user_id'] = [user_id, 0];
        filterOBJ['where']['read'] = 0;
      }
      if (topic == 'website') {
        filterOBJ['where']['topic'] =  null;
      
      }
      if (offset && offset != 'false') {
        filterOBJ['limit'] = 10;
        filterOBJ['offset'] = 10 * parseInt(offset);
      }
      filterOBJ['include'] = [
        {
          model: Message,
          as: 'chat',
          include: [{
            model: Room,
            as: 'room',
            include: [{
              model: Market,
              as: 'market',
              include: [{
                model: Image,
                as: 'cover'
              }]
            }],
            where: { user_id: user_id }
          }],
        },
        {
          model: ProductOffer,
          as: 'product_offer',
          include: [{
            model: Market,
            as: 'market',
            include: [{
              model: Image,
              as: 'cover'
            }]
          }],
        },
        {
          model: OfferPriceReplay,
          as: 'offer_reply',
          include: [{
            model: Market,
            as: 'market',
            include: [{
              model: Image,
              as: 'cover'
            }]
          }],
        },
        {
          model: Notifications,
          as: 'alaunna_message',
        }
      ]
      filterOBJ['order'] = [['id', 'DESC']];
      console.log(filterOBJ)
      let SelectedNotifications = await CustomerNotifications.findAll(filterOBJ);
      return ResponseService.SuccessResponse(res, 'success for getting the  notifications', SelectedNotifications);
    } catch (err) {
      console.log(err)
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when getting the notifications', { action: 'unkown-error', error: err });
    }
  },
  countForSeller: async function (req, res) {
    try {
      let user_id = req.param('user_id'),
        filterOBJmsg = { where: {} },
        filterOBJorder = { where: {} },
        filterOBJoffer = { where: {} };

      let selectedUser = await User.findOne({
        where: {
          id: user_id
        }
      });

      let topic = '/topics/c' + selectedUser.markets[0].Country_id + 'c' + selectedUser.markets[0].marketcategory_id;

      filterOBJmsg['where']['user_id'] = user_id;
      filterOBJmsg['where']['read'] = 0;
      filterOBJmsg['where']['type'] = 'chat';
      let messagesNoti = await CustomerNotifications.findAll(filterOBJmsg);
      let messagesCount = messagesNoti.length;

      filterOBJorder['where']['user_id'] = user_id;
      filterOBJorder['where']['read'] = 0;
      filterOBJorder['where']['type'] = 'order';
      let ordersNoti = await CustomerNotifications.findAll(filterOBJorder);
      let ordersCount = ordersNoti.length;

      filterOBJoffer['where']['offer_price_id'] = {
        [Sequelize.Op.gt]: selectedUser.last_offer_price_read
      };
      filterOBJoffer['where']['topic'] = topic;
      filterOBJoffer['where']['type'] = 'offerPrice';
      let offersPriceNoti = await CustomerNotifications.findAll(filterOBJoffer);
      let offersPriceCount = offersPriceNoti.length;

      let allCount = messagesCount+ordersCount+offersPriceCount;

      return ResponseService.SuccessResponse(res, 'success for getting the notifications counts', {
        messagesCount: messagesCount,
        offersPriceCount: offersPriceCount,
        ordersCount: ordersCount,
        allCount: allCount,
        messagesNoti: messagesNoti

      });
    } catch (err) {
      console.log(err)
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when getting the notifications', { action: 'unkown-error', error: err });
    }
  },
  create: async function (req, res) {
    try {
      let params = req.allParams();
      let filters = [];
      let notificationOBJ = {
        type: params.type, //'Chat' , //'offer' //'offer_reply' //'alaunna_message'(From DashBoard) 
        user_id: params.user_id, // User Model
        product_offer_id: params.offer_id, // ProductOffer Model
        message_id: params.message_id, // Message Model
        offer_reply_id: params.offer_reply_id, // OfferPriceReplay Model
        alaunna_message_id: params.alaunna_message_id, // Notifications Model
      };
      if (params.user_id) {
        filters.push({
          key: 'user_id',
          value: params.user_id,
          relation: '='
        })
      }

      await CustomerNotifications.create(notificationOBJ);
      return ResponseService.SuccessResponse(res, 'success for create notification', notificationOBJ);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong hapen when send notification', {
        action: 'unkown-err',
        error: err
      })
    }
  },
  remove: async function (req, res) {
    try {
      let notification_id = req.param('id');
      if (!notification_id) {
        return this.ResponseService.ErrorResponse(res, 'please provide norification id', { action: 'invalid-data', error: err });
      }
      let SelectedNotification = await CustomerNotifications.findOne({ where: { id: notification_id } });
      await SelectedNotification.destroy();
      return ResponseService.SuccessResponse(res, 'success for deleteing the notification', SelectedNotification);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when trying to delete the notification', { action: 'unkown-error', error: err });
    }
  },
  removeAll: async function (req, res) {
    try {
      let user_id = req.param('user_id');
      await CustomerNotifications.destroy({ where: { user_id: user_id } });
      return ResponseService.SuccessResponse(res, 'success for deleteing the notification', 'done');
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when trying to delete the notification', { action: 'unkown-error', error: err });
    }
  },
  markAsRead: async function (req, res) {
    try {
      let notification_id = req.param('id');
      if (!notification_id) {
        return this.ResponseService.ErrorResponse(res, 'please provide norification id', { action: 'invalid-data', error: err });
      }
      let SelectedNotification = await CustomerNotifications.findOne({ where: { id: notification_id } });
      SelectedNotification.read = 1;
      await SelectedNotification.save();
      return ResponseService.SuccessResponse(res, 'success to mark notification as read', SelectedNotification);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when trying to mark notification as read', { action: 'unkown-error', error: err });
    }
  },
  markAllAsRead: async function (req, res) {
    try {
      let user_id = req.param('user_id');
      let SelectedCustomerNotifications = await CustomerNotifications.findAndCountAll({ where: { user_id: user_id } });
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

      return ResponseService.SuccessResponse(res, 'success To Mark notification As Read', 'done');
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when trying to Mark notification As Read', { action: 'unkown-error', error: err });
    }
  },
  markAllAsReadByType: async function (req, res) {
    try {
      let user_id = req.param('user_id');
      let type = req.param('type');
      let id = req.param('id');
      if (type == 'chat') {
        let Chats = await CustomerNotifications.findAndCountAll({
          include: [{
            model: Message,
            as: 'chat',
            where: { room_id: id }
          }]
        });
        for (let i = 0; i < Chats.rows.length; i++) {
          let MsgID = Chats.rows[i].id;
          var SelectedChatCustomerNotification = await CustomerNotifications.findOne({
            where: {
              id: MsgID
            }
          });
          if (SelectedChatCustomerNotification) {
            SelectedChatCustomerNotification.read = 1;
            await SelectedChatCustomerNotification.save();
          }
        }
      }
      else {
        let SelectedCustomerNotifications = await CustomerNotifications.findAndCountAll({ where: { user_id: user_id, type: type } });
        for (let i = 0; i < SelectedCustomerNotifications.rows.length; i++) {
          let CustomerNotificationID = SelectedCustomerNotifications.rows[i].id;
          if (type == 'offer_reply') {
            var SelectedCustomerNotification = await CustomerNotifications.findOne({
              where: {
                id: CustomerNotificationID
              },
              include: [{
                model: OfferPriceReplay,
                as: 'offer_reply',
                where: { offer_price_id: id }
              }]
            });
            if (SelectedCustomerNotification) {
              SelectedCustomerNotification.read = 1;
              await SelectedCustomerNotification.save();
            }
          }
          // else if (type == 'product_offer') {
          //   var SelectedCustomerNotification = await CustomerNotifications.findOne({
          //     where: {
          //       id: CustomerNotificationID
          //     }
          //   });
          //   if (SelectedCustomerNotification) {
          //     SelectedCustomerNotification.read = 1;
          //     await SelectedCustomerNotification.save();
          //   }
          // }
        }
      }
      return ResponseService.SuccessResponse(res, 'success To Mark notification As Read', 'done');
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when trying to Mark notification As Read', { action: 'unkown-error', error: err });
    }
  },
};

