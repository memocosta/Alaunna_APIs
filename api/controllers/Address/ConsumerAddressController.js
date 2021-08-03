/**
 * ConsumerAddressController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  index: async function (req, res) {
    try {
      var offset = req.param('offset');
      var user_id = req.param('user_id');
      var fitlerObj = {};
      var whereOBJ = {};
      if (offset && offset != 'false') {
        fitlerObj['offset'] = parseInt(offset) * 10;
        fitlerObj['limit'] = 10;
      }
      if (user_id) {
        whereOBJ['user_id'] = user_id;
      }
      fitlerObj['include'] = ['user', 'city', 'country'];

      fitlerObj['where'] = whereOBJ;
      var SelectedAdd = await ConsumerAddress.findAndCountAll(fitlerObj);
      return ResponseService.SuccessResponse(res, 'success for getting my Addresses data', SelectedAdd);
    } catch (err) {
      console.log(11111111111111111111111);
      console.log(err);
      console.log(2222222222222222222222);
      return ResponseService.ErrorResponse(res, 'something wrong happen wher get my Addresses', {
        action: 'unkown-error'
      });
    }
  },
  create: async function (req, res) {
    try {
      let params = req.allParams();
      let CreatedCoupon = await ConsumerAddress.create(params);
      return ResponseService.SuccessResponse(res, 'success for creating the Address', CreatedCoupon);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen when creating the Address', {
        error: err,
        action: 'unkown-error'
      });
    }
  },
  update: async function (req, res) {
    try {
      let params = req.allParams();
      if (!params.id) {
        return ResponseService.ErrorResponse(res, 'please provide the address id', {
          action: 'invalid-data'
        });
      }
      let SelectedAddress = await ConsumerAddress.findOne({
        where: {
          id: params.id
        }
      });
      SelectedAddress.name = params.name;
      SelectedAddress.address = params.address;
      SelectedAddress.phone = params.phone;
      SelectedAddress.latitude = params.latitude;
      SelectedAddress.longitude = params.longitude;
      SelectedAddress.country_id = params.country_id;
      SelectedAddress.city_id = params.city_id;
      SelectedAddress.user_id = params.user_id;
      await SelectedAddress.save();

      return ResponseService.SuccessResponse(res, 'success for update the Address', SelectedAddress);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen when update the Address', {
        error: err,
        action: 'unkown-error'
      });
    }
  },
  remove: async function (req, res) {
    try {
      var address_id = req.param('id');
      if (!address_id) {
        return ResponseService.ErrorResponse(res, 'please provide the Address id', {
          action: 'invalid-data'
        });
      }
      var SelectedAddress = await ConsumerAddress.findOne({
        where: {
          id: address_id
        }
      });
      await SelectedAddress.destroy();
      return ResponseService.SuccessResponse(res, 'success for remove the Address', SelectedAddress);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen when remove the Address', {
        action: 'unkown-error',
        error: err
      });
    }
  },
};

