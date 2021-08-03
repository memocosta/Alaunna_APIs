/**
 * MarketRateController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var updateRate = async function (market_id) {
  let Count5 = await MarketRate.count({
    where: {
      market_id: market_id,
      value: 5
    }
  });
  let Count4 = await MarketRate.count({
    where: {
      market_id: market_id,
      value: 4
    }
  });
  let Count3 = await MarketRate.count({
    where: {
      market_id: market_id,
      value: 3
    }
  });
  let Count2 = await MarketRate.count({
    where: {
      market_id: market_id,
      value: 2
    }
  });
  let Count1 = await MarketRate.count({
    where: {
      market_id: market_id,
      value: 1
    }
  });
  let rateValue = ((Count5 * 5) + (Count4 * 4) + (Count3 * 3) + (Count2 * 2) + (Count1 * 1)) / (Count1 + Count2 + Count3 + Count4 + Count5);

  await Market.update({
    rate: rateValue
  }, {
    where: {
      id: market_id
    }
  });
}
module.exports = {
  index: async function (req, res) {
    try {
      let user_id = req.param('user_id'),
        market_id = req.param('market_id'),
        offset = req.param('offset'),
        include_user = req.param('include_user'),
        fitlerOBJ = {
          where: {}
        };

      if (user_id && user_id != 'false') {
        fitlerOBJ['where']['user_id'] = user_id;
      }

      if (market_id && market_id != 'false') {
        fitlerOBJ['where']['market_id'] = market_id;
      }

      if (offset && offset != 'false' || offset === 0) {
        fitlerOBJ['offset'] = 10 * offset;
        fitlerOBJ['limit'] = 10;
      }
      fitlerOBJ['include'] = [
        {
          model: Market,
          as: 'market',
        },
        {
          model: User,
          as: 'user',
        }
      ];
      if (include_user && include_user != 'false') {
        fitlerOBJ['include'].push('user')
      }
      let SelectedRates = await MarketRate.findAndCountAll(fitlerOBJ);
      return ResponseService.SuccessResponse(res, 'success for getting all data for market rate', SelectedRates);
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
      if (!params['market_id'] || !params['user_id']) {
        return ResponseService.ErrorResponse(res, 'please provide a valid market id and user id', {
          action: 'invalid-data'
        });
      }
      let CheckIfRateBefore = await MarketRate.findOne({
        where: {
          market_id: params['market_id'],
          user_id: params['user_id']
        }
      });
      if (CheckIfRateBefore) {
        return ResponseService.ErrorResponse(res, 'this market has been rated before', {
          action: 'rate-before'
        });
      }
      // let selectedMarket = await Market.findOne({ id: params['market_id'] });
      // console.log(params['value']);
      // selectedMarket.rate += (parseInt(params['value']) / 2);
      // console.log(selectedMarket.rate)
      // await selectedMarket.save();
      let CreatedRate = await MarketRate.create(params);
      await updateRate(params['market_id']);
      return ResponseService.SuccessResponse(res, 'success for rating the market', CreatedRate);
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

      let SelectedRate = await MarketRate.findOne({
        where: {
          id: id
        }
      });
      // let selectedMarket = await Market.findOne({
      //   id: SelectedRate['market_id']
      // });
      // selectedMarket.rate -= (SelectedRate.value / 2);
      // selectedMarket.rate += (value / 2);
      // await selectedMarket.save();
      SelectedRate.value = value;
      SelectedRate.comment = comment;
      await SelectedRate.save();
      await updateRate(SelectedRate['market_id']);
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
      let SelectedRate = await MarketRate.findOne({
        where: {
          id: id
        }
      });
      let selectedMarket = await Market.findOne({
        id: SelectedRate['market_id']
      });
      selectedMarket.rate -= (SelectedRate.value / 2);
      await selectedMarket.save();

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
