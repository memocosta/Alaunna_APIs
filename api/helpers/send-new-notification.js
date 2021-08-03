
var OneSignal = require('onesignal-node');
var Client;
module.exports = {


  friendlyName: 'Send new notification',
  inputs: {
    content: {
      type: 'ref',
      required: true
    },
    heading: {
      type: 'ref',
      required: true
    },
    for: {
      type: 'string',
      required: true
    },
    filters: {
      type: 'ref',
    },
    player_id: {
      type: 'string'
    },
    data: {
      type: 'ref'
    },
    isAndroid : {
      type : 'boolean',
    },
    isIos : {
      type : 'boolean'
    }
  },


  exits: {

  },

  fn: async function (inputs, exits) {

    let NotificationBody = new OneSignal.Notification({
      contents: inputs.content,
      headings: inputs.heading
    });
    if (inputs.data) {
      NotificationBody.postBody['data'] = inputs.data;
    }
    if (inputs.for == 'admin') {
      Client = new OneSignal.Client({
        userAuthKey: sails.config.custom.oneSignal.userAuth,
        app: sails.config.custom.oneSignal.admin
      });
    } else if (inputs.for == 'user') {
      Client = new OneSignal.Client({
        userAuthKey: sails.config.custom.oneSignal.userAuth,
        app: sails.config.custom.oneSignal.user
      });
    } else if (inputs.for == 'seller') {
      Client = new OneSignal.Client({
        userAuthKey: sails.config.custom.oneSignal.userAuth,
        app: sails.config.custom.oneSignal.seller
      });
    }
    if (inputs.player_id) {
      NotificationBody.postBody['include_player_ids'] = [inputs.player_id];
      Client.sendNotification(NotificationBody, function (err, httpResponse, data) {
        if (err) {
          console.log(err);
          return exits.error();
        } else {

          console.log(data);
          return exits.success();
        }
      });
    }
    if (inputs.filters) {

      let filters = [];
      filters.push({ field: 'tag', key: 'type', relation: '=', value: inputs.for });
      for (let i = 0; i < inputs.filters.length; i++) {
        let CurrentFilter = inputs.filters[i];
        if (CurrentFilter.operator) {
          filters.push({ operator: CurrentFilter.operator });
          continue;
        }
        filters.push({ field: 'tag', key: CurrentFilter.key, relation: CurrentFilter.relation, value: CurrentFilter.value });
      }
      NotificationBody.postBody['filters'] = filters
    }
    if (inputs.isAndroid){
      NotificationBody.postBody['isAndroid'] = true;
    }
    if (inputs.isIos){
      NotificationBody.postBody['isIos'] = true;
    }
    if (!inputs.filters || !inputs.filters.length && !inputs.player_id) {
      NotificationBody['postBody']['included_segments'] = ['Subscribed Users']
    }
    console.log('hello');
    Client.sendNotification(NotificationBody, function (err, httpResponse, data) {
      if (err) {
        console.log(err);
        return exits.error();
      } else {
        console.log(data);
        return exits.success();
      }
    });
  }

};

