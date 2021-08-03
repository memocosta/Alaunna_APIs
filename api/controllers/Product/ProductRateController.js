/**
 * ProductRateController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var updateRate = async function (product_id) {
  let Count5 = await ProductRate.count({
    where: {
      product_id: product_id,
      value: 5
    }
  });
  let Count4 = await ProductRate.count({
    where: {
      product_id: product_id,
      value: 4
    }
  });
  let Count3 = await ProductRate.count({
    where: {
      product_id: product_id,
      value: 3
    }
  });
  let Count2 = await ProductRate.count({
    where: {
      product_id: product_id,
      value: 2
    }
  });
  let Count1 = await ProductRate.count({
    where: {
      product_id: product_id,
      value: 1
    }
  });
  let rateValue = ((Count5 * 5) + (Count4 * 4) + (Count3 * 3) + (Count2 * 2) + (Count1 * 1)) / (Count1 + Count2 + Count3 + Count4 + Count5);
  await Product.update({
    rate: rateValue
  }, {
    where: {
      id: product_id
    }
  });
}
module.exports = {
  index: async function (req, res) {
    try {
      let user_id = req.param('user_id'),
        product_id = req.param('product_id'),
        offset = req.param('offset'),
        include_user = req.param('include_user'),
        fitlerOBJ = {
          where: {}
        };

      if (user_id && user_id != 'false') {
        fitlerOBJ['where']['user_id'] = user_id;
      }

      if (product_id && product_id != 'false') {
        fitlerOBJ['where']['product_id'] = product_id;
      }

      if (offset && offset != 'false' || offset === 0) {
        fitlerOBJ['offset'] = 10 * offset;
        fitlerOBJ['limit'] = 10;
      }
      fitlerOBJ['include'] = [
        {
        model: Product,
        as: 'product',
        },
        {
          model: User,
          as: 'user',
        }];
      if (include_user && include_user != 'false') {
        fitlerOBJ['include'].push('user')
      }
      let SelectedRates = await ProductRate.findAndCountAll(fitlerOBJ);
      return ResponseService.SuccessResponse(res, 'success for getting all data for product rate', SelectedRates);
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
      if (!params['product_id'] || !params['user_id']) {
        return ResponseService.ErrorResponse(res, 'please provide a valid product id and user id', {
          action: 'invalid-data'
        });
      }
      let CheckIfRateBefore = await ProductRate.findOne({
        where: {
          product_id: params['product_id'],
          user_id: params['user_id']
        }
      });
      if (CheckIfRateBefore) {
        return ResponseService.ErrorResponse(res, 'this product has been rated before', {
          action: 'rate-before'
        });
      }
      // let selectedProduct = await Product.findOne({ id: params['product_id'] });
      // console.log(params['value']);
      // selectedProduct.rate += (parseInt(params['value']) / 2);
      // console.log(selectedProduct.rate)
      // await selectedProduct.save();
      let CreatedRate = await ProductRate.create(params);
      await updateRate(params['product_id']);
      return ResponseService.SuccessResponse(res, 'success for rating the product', CreatedRate);
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

      let SelectedRate = await ProductRate.findOne({
        where: {
          id: id
        }
      });
      // let selectedProduct = await Product.findOne({
      //   id: SelectedRate['product_id']
      // });
      // selectedProduct.rate -= (SelectedRate.value / 2);
      // selectedProduct.rate += (value / 2);
      // await selectedProduct.save();
      SelectedRate.value = value;
      SelectedRate.comment = comment;
      await SelectedRate.save();
      await updateRate(SelectedRate['product_id']);
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
      let SelectedRate = await ProductRate.findOne({
        where: {
          id: id
        }
      });
      let selectedProduct = await Product.findOne({
        id: SelectedRate['product_id']
      });
      selectedProduct.rate -= (SelectedRate.value / 2);
      await selectedProduct.save();

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
