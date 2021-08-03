/**
 * NotificationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  index: async function (req, res) {
    try {
      let user_id = req.param('user_id'),
        category = req.param('category'),
        filterOBJ = { where: {} }, offset = req.param('offset');
      if (user_id && user_id != 'false') {
        filterOBJ['where']['user_id'] = user_id;
      }

      if (category && category != 'false') {
        filterOBJ['where']['for'] = category;
      }
      if (offset && offset != 'false') {
        filterOBJ['limit'] = 10;
        filterOBJ['offset'] = 10 * parseInt(offset);
      }
      filterOBJ['order'] = [['id', 'DESC']];
      let SelectedNotifications = await Notifications.findAll(filterOBJ);
      return ResponseService.SuccessResponse(res, 'success for getting the notifications', SelectedNotifications);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when getting the notifications', { action: 'unkown-error', error: err });
    }
  },
  remove: async function (req, res) {
    try {
      let notification_id = req.param('id');
      if (!notification_id) {
        return this.ResponseService.ErrorResponse(res, 'please provide norification id', { action: 'invalid-data', error: err });
      }
      let SelectedNotification = await Notifications.findOne({ where: { id: notification_id } });
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
      await Notifications.destroy({where : {user_id : user_id}});
      return ResponseService.SuccessResponse(res, 'success for deleteing the notification' , 'done');
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when trying to delete the notification', { action: 'unkown-error', error: err });
    }
  },
  createNotification : async function(req ,res){
    try {
      let parmas = req.allParams();
      let CreatedParams = await Notifications.create(parmas);
      let notificationOBJ = {
        type: 'alaunna_message', //'chat' , //'offer' //'offer_reply' //'alaunna_message'(From DashBoard) 
        // user_id: 0, // User Model
        alaunna_message_id: CreatedParams.id, // Notifications Model
      };
      console.log(notificationOBJ)
      await CustomerNotifications.create(notificationOBJ);
      return ResponseService.SuccessResponse(res ,'success for create notificnation' , CreatedParams);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen ', { action: 'unkown-error', error: err });
    }
  },
  sendNotification: async function (req, res) {
    try {
      let params = req.allParams();
      let filters = [];
      let notificationOBJ = {
        content: params.content,
        heading: params.heading,
        for: params.for,
      };
      if (params.user_id) {
        filters.push({
          key: 'user_id',
          value: params.user_id,
          relation: '='
        })
      }
      if (params.market_id) {
        filters.push({
          key: 'user_id',
          value: params.market_id,
          relation: '='
        })
      }
      // if (params.category) {
      //   fitlers.push({
      //     key: 'category',
      //     value: params.category,
      //     relation: '='
      //   })
      // }
      if (params.isAndroid){
        notificationOBJ['isAndroid'] = params.isAndroid;
      }
      if (params.isIos){
        notificationOBJ['isIos'] = params.isIos;
      }

      const topic = '/topics/sellers';
      console.log('topic is ' + topic);

      if (params.for == 'seller') {
        let notificationOBJ = {
          token: topic,
          body: params.content.ar,
          type: 'notifications',
        };

        await sails.helpers.firebase.with(notificationOBJ);
      }

      console.log(notificationOBJ);
      await sails.helpers.sendNewNotification.with(notificationOBJ);
      return ResponseService.SuccessResponse(res, 'success for create notification', notificationOBJ);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong hapen when send notification', {
        action: 'unkown-err',
        error: err
      })
    }
  }
};

