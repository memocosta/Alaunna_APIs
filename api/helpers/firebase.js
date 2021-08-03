var http = require('https');
module.exports = {
  friendlyName: 'Send new notification',
  inputs: {
    token: {
      type: 'ref',
      required: true
    },
    body: {
      type: 'string',
      required: true
    },
    type: {
      type: 'string',
      required: true
    }
  },

  exits: {

  },

  fn: async function (inputs, exits) {
    var API_ACCESS_KEY = 'AAAAUyFWMKw:APA91bGyV7gUnZNRY6o4qH-vb_eI7IKMDKWX7VU6NUYDQwMcHz2JHN7cqKXPgfLvus44TI2oMBzeakYBgBABKGaGolzDp0mQYlmfVItQDFxtaZ-E43UrE8wvFg7an0OL5ql3qxV52L12';
    var title = 'الأونا - تجار';
    if(inputs.title)
      title = inputs.title;
    var fields = {
      'to' : inputs.token,
      'notification' : {
          'title' : title,
          'body' : inputs.body ,
          'vibrate'   : 1,
          'sound'     : "default",
          'type' : inputs.type
      },
      "priority" : "high",
      'data' : {
          'type' :inputs.type
      },
      'alert' : inputs.body,
      'title' : 'الأونا - تجار',
      'type' : inputs.type,
    };
    var headers = {
      'Authorization': 'key=' + API_ACCESS_KEY,
      'Content-Type': 'application/json'
    };

    var options = {
      host: "fcm.googleapis.com",
      port: 443,
      path: "/fcm/send",
      method: "POST",
      headers: headers
    };

    var requ = http.request(options, function (result) {
      result.on('data', function (data) {
        process.stdout.write(data);
        return exits.success(data);
      });
    });

    requ.on('error', function (e) {
      console.error(e);
      return exits.error(e);
    });

    requ.write(JSON.stringify(fields));
    requ.end();
  }
};

