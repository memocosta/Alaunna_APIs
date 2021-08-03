var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  host: 'mail.alaunna.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'info@alaunna.com', // your domain email address
    pass: 'Alaunna.com@2020' // your password
  },
  tls: {
    rejectUnauthorized: false
  },
});
module.exports = {



  friendlyName: 'Send mail',


  description: '',


  inputs: {
    to : {
      type : 'string',
      required : true
    },
    token : {
      type : 'string',
      required : true
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {


    var mailOptions = {
      from: 'Alaunna <info@alaunna.com>',
      to: inputs.to,
      subject: 'Alaunna Password Token',
      text: 'Your Token For Reseting Alaunna Password Is : ' + inputs.token , 
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        return exits.error(error);
      } else {
        return exits.success();
      }
    });
    // All done.


  }


};

