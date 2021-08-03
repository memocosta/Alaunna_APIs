module.exports = {
  SuccessResponse: async function (res, message, data = undefined) {
    if (data) {
      return res.send({
        status: 'success',
        message: message,
        data: data
      });
    } else {
      return res.send({
        status: 'success',
        message: message,
      });
    }
  },
  ErrorResponse : async function (res , message , error = undefined){
    if (error){
      return res.send({
        status: 'error',
        message: message,
        error : error
      });
    } else {
      return res.send({
        status: 'error',
        message: message,
      });
    }
  }
}

