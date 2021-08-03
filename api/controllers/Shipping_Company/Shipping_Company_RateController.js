/**
 * Shipping_Company_RateController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var updateRate = async function (Shipping_Company_id) {
  let Count5 = await Shipping_Company_Rate.count({
    where: {
      Shipping_Company_id: Shipping_Company_id,
      value: 5
    }
  });
  let Count4 = await Shipping_Company_Rate.count({
    where: {
      Shipping_Company_id: Shipping_Company_id,
      value: 4
    }
  });
  let Count3 = await Shipping_Company_Rate.count({
    where: {
      Shipping_Company_id: Shipping_Company_id,
      value: 3
    }
  });
  let Count2 = await Shipping_Company_Rate.count({
    where: {
      Shipping_Company_id: Shipping_Company_id,
      value: 2
    }
  });
  let Count1 = await Shipping_Company_Rate.count({
    where: {
      Shipping_Company_id: Shipping_Company_id,
      value: 1
    }
  });
  let rateValue = ((Count5 * 5) + (Count4 * 4) + (Count3 * 3) + (Count2 * 2) + (Count1 * 1)) / (Count1 + Count2 + Count3 + Count4 + Count5);
  await Shipping_Company.update({
    rate: rateValue
  }, {
    where: {
      id: Shipping_Company_id
    }
  });
}
module.exports = {
  index: async function (req, res) {
    try {
      let user_id = req.param('user_id'),
        Shipping_Company_id = req.param('Shipping_Company_id'),
        offset = req.param('offset'),
        include_user = req.param('include_user'),
        fitlerOBJ = {
          where: {}
        };

      if (user_id && user_id != 'false') {
        fitlerOBJ['where']['user_id'] = user_id;
      }

      if (Shipping_Company_id && Shipping_Company_id != 'false') {
        fitlerOBJ['where']['Shipping_Company_id'] = Shipping_Company_id;
      }

      if (offset && offset != 'false' || offset === 0) {
        fitlerOBJ['offset'] = 10 * offset;
        fitlerOBJ['limit'] = 10;
      }
      fitlerOBJ['include'] = [
        {
          model: User,
          as: 'user',
        }];
      if (include_user && include_user != 'false') {
        fitlerOBJ['include'].push('user')
      }
      let SelectedRates = await Shipping_Company_Rate.findAll(fitlerOBJ);
      return ResponseService.SuccessResponse(res, 'success for getting all data for Shipping Company rate', SelectedRates);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when create the rate', {
        action: 'unkwon-error',
        error: err
      });

    }
  },
  create: async function (req, res) {
    try {
      let params = req.allParams();
      if (!params['Shipping_Company_id'] || !params['user_id']) {
        return ResponseService.ErrorResponse(res, 'please provide a valid Shipping Company id and user id', {
          action: 'invalid-data'
        });
      }
      let CheckIfRateBefore = await Shipping_Company_Rate.findOne({
        where: {
          Shipping_Company_id: params['Shipping_Company_id'],
          user_id: params['user_id']
        }
      });
      console.log(CheckIfRateBefore)
      if (CheckIfRateBefore) {
        CheckIfRateBefore.value = params.value;
        CheckIfRateBefore.comment = params.comment;
      await CheckIfRateBefore.save();
      await updateRate(CheckIfRateBefore['Shipping_Company_id']);
      return ResponseService.SuccessResponse(res, 'success for editing the rate', CheckIfRateBefore);
      }
      let CreatedRate = await Shipping_Company_Rate.create(params);
      await updateRate(params['Shipping_Company_id']);
      return ResponseService.SuccessResponse(res, 'success for rating the Shipping Company', CreatedRate);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when create the rate', {
        action: 'unkwon-error',
        error: err
      });
    }
  },
  edit: async function (req, res) {
    try {
      let id = req.param('id');
      let value = req.param('value');
      let comment = req.param('comment');
      if (!id) {
        return ResponseService.ErrorResponse(res, 'please provide the id of the rate');
      }

      let SelectedRate = await Shipping_Company_Rate.findOne({
        where: {
          id: id
        }
      });
      SelectedRate.value = value;
      SelectedRate.comment = comment;
      await SelectedRate.save();
      await updateRate(SelectedRate['Shipping_Company_id']);
      return ResponseService.SuccessResponse(res, 'success for editing the rate', SelectedRate);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when edit the rate', {
        action: 'unkwon-error',
        error: err
      });
    }
  },
  remove: async function (req, res) {
    try {
      let id = req.param('id');
      if (!id) {
        return ResponseService.ErrorResponse(res, 'please provide the id of the rate');
      }
      let SelectedRate = await Shipping_Company_Rate.findOne({
        where: {
          id: id
        }
      });
      let selectedShipping_Company = await Shipping_Company.findOne({
        id: SelectedRate['Shipping_Company_id']
      });
      selectedShipping_Company.rate -= (SelectedRate.value / 2);
      await selectedShipping_Company.save();

      await SelectedRate.destroy();
      return ResponseService.SuccessResponse(res, 'success for remove the rate', SelectedRate);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when remove the rate', {
        action: 'unkwon-error',
        error: err
      });

    }
  }

};
