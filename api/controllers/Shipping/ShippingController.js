/**
 * ShippingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  index: async function (req, res) {
    try {
      var offset = req.param('offset');
      var user_id = req.param('user_id');
      var country_id = req.param('country_id');
      var fitlerObj = {};
      var whereOBJ = {};
      if (offset && offset != 'false') {
        fitlerObj['offset'] = parseInt(offset) * 10;
        fitlerObj['limit'] = 10;
      }
      if (user_id) {
        whereOBJ['user_id'] = user_id;
      }
      if (country_id) {
        fitlerObj['include'] = ['user', {
          model: Shipping_Rate,
          as: 'Shipping_Company_Rate',
          include: ['user']

        }, {
            model: Shipping_Location,
            as: 'Shipping_Location',
            include: ['city', {
              model: Country,
              as: 'country',
            }
            ],
            where: { country_id: country_id },
            required: true
          }];
      } else {
        fitlerObj['include'] = ['user', {
          model: Shipping_Location,
          as: 'Shipping_Location',
          include: ['city', 'country'
          ],
        }];
      }
      fitlerObj['where'] = whereOBJ;
      var SelectedAdd = await Shipping.findAndCountAll(fitlerObj);
      return ResponseService.SuccessResponse(res, 'success for getting my Shipping data', SelectedAdd);
    } catch (err) {

      return ResponseService.ErrorResponse(res, 'something wrong happen wher get my Shipping', {
        action: 'unkown-error'
      });
    }
  },
  create: async function (req, res) {
    try {
      let params = req.allParams();
      let CreatedShipping = await Shipping.create(params);
      let cities = params.city_id;
      console.log(cities);
      for (let j = 0; j < cities.length; j++) {
        console.log(cities[j]);

        let loc = {};
        loc['shipping_id'] = CreatedShipping.id;
        loc['city_id'] = cities[j];
        var SelectedCity = await City.findOne({
          where: {
            id: cities[j]
          }
        });
        loc['country_id'] = SelectedCity.countryId;
        console.log(loc);
        await Shipping_Location.create(loc);
      }

      return ResponseService.SuccessResponse(res, 'success for creating the Shipping', CreatedShipping);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen when creating the Shipping', {
        error: err,
        action: 'unkown-error'
      });
    }
  },
  update: async function (req, res) {
    try {
      let params = req.allParams();
      if (!params.id) {
        return ResponseService.ErrorResponse(res, 'please provide the Shipping id', {
          action: 'invalid-data'
        });
      }
      let SelectedShipping = await Shipping.findOne({
        where: {
          id: params.id
        }
      });
      SelectedShipping.activate_delivery_option = params.activate_delivery_option;
      SelectedShipping.name = params.name;
      SelectedShipping.cost = params.cost;
      SelectedShipping.activate_payment_receipt = params.activate_payment_receipt;
      SelectedShipping.cost_payment_receipt = params.cost_payment_receipt;
      await SelectedShipping.save();
      let cities = params.city_id;
      let SelectedShipping_Location = await Shipping_Location.findAndCountAll({ where: { Shipping_id: SelectedShipping.id } });
      for (let i = 0; i < SelectedShipping_Location.rows.length; i++) {
        let selectedOfferPriceID = SelectedShipping_Location.rows[i].id;
        var SelectedOfferPriceReplay = await Shipping_Location.findOne({
          where: {
            id: selectedOfferPriceID
          }
        });
        await SelectedOfferPriceReplay.destroy();
      }
      for (let j = 0; j < cities.length; j++) {
        let loc = {};
        loc['shipping_id'] = SelectedShipping.id;
        loc['city_id'] = cities[j];
        var SelectedCity = await City.findOne({
          where: {
            id: cities[j]
          }
        });

        loc['country_id'] = SelectedCity.countryId;
        await Shipping_Location.create(loc);
      }

      return ResponseService.SuccessResponse(res, 'success for update the Shipping', SelectedShipping);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen when update the Shipping', {
        error: err,
        action: 'unkown-error'
      });
    }
  },
  remove: async function (req, res) {
    try {
      var shipping_id = req.param('id');
      if (!shipping_id) {
        return ResponseService.ErrorResponse(res, 'please provide the Shipping id', {
          action: 'invalid-data'
        });
      }
      var SelectedShipping = await Shipping.findOne({
        where: {
          id: shipping_id
        }
      });
      await SelectedShipping.destroy();
      return ResponseService.SuccessResponse(res, 'success for remove the Shipping', SelectedShipping);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen when remove the Shipping', {
        action: 'unkown-error',
        error: err
      });
    }
  },
};

