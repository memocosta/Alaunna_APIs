var jwt = require('jsonwebtoken');
var jwtSecret = sails.config.secrets.jwtSecret;

module.exports = {
  issue: function (payload) {
    token = jwt.sign(payload, jwtSecret, {expiresIn: "30d"})
    //var updateSession = User.update({id : payload.id})
    return token
  },

  verify: function (token, callback) {

    return jwt.verify(token, jwtSecret, callback);
  }
}
