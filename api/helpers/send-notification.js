var http = require('https');

module.exports = {
  friendlyName: 'Send notification',


  description: 'sending a notidication to user or users',


  inputs: {
    message: {
      type: 'ref',
      required: true
    },
    auth_key : {
      type : 'string'
    }
  },
  exits: {

  },

  fn: async function (inputs, exits) {
    var authKey = inputs.auth_key;
    var headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": "Basic " + authKey
    };
    var options = {
      host: "onesignal.com",
      port: 443,
      path: "/api/v1/notifications",
      method: "POST",
      headers: headers
    };
    var req = http.request(options, function (res) {
      res.on('data', function (data) {
        return exits.success(data);
      });
    });
    req.on('error', function (e) {
      return exits.error(e);
    });
    req.write(JSON.stringify(inputs.message));
    req.end();
  }
};
