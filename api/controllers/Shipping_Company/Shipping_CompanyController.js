/**
 * Shipping_CompanyController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  index: async function (req, res) {
    try {
      var offset = req.param('offset');
      var country_id = req.param('country_id');

      var fitlerObj = {};
      var whereOBJ = {};
      if (offset && offset != 'false') {
        fitlerObj['offset'] = parseInt(offset) * 10;
        fitlerObj['limit'] = 10;
      }

      if (country_id) {
        fitlerObj['include'] = ['Logo', 'Shipping_Company_Order', {
          model: Shipping_Company_Rate,
          as: 'Shipping_Company_Rate',
          include: ['user']

        }, {
            model: Shipping_Company_Zone,
            as: 'Shipping_Company_Zone',
            required: true,
            include: [{
              model: Shipping_Company_Location, as: 'Shipping_Company_Location', include: ['Country', 'City'],
              where: { country_id: country_id },
              required: true
            }]
          }];
      } else {
        fitlerObj['include'] = ['Logo', 'Shipping_Company_Order', {
          model: Shipping_Company_Rate,
          as: 'Shipping_Company_Rate',
          include: ['user']

        }, {
            model: Shipping_Company_Zone,
            as: 'Shipping_Company_Zone',
            required: true,
            include: [{ model: Shipping_Company_Location, as: 'Shipping_Company_Location', include: ['Country', 'City'] }]
          }];
      }
      whereOBJ['status'] = "active";
      fitlerObj['where'] = whereOBJ;
      var SelectedAdd = await Shipping_Company.findAndCountAll(fitlerObj);
      return ResponseService.SuccessResponse(res, 'success for getting my Shipping data', SelectedAdd);
    } catch (err) {

      return ResponseService.ErrorResponse(res, 'something wrong happen wher get my Shipping', {
        action: 'unkown-error'
      });
    }
  },

  getShipping_CompanyById: async function (req, res) {
    try {
      var id = req.param('id');
      if (!id) {
        return ResponseService.ErrorResponse(res, 'please provide Shipping Company id', {
          action: 'invalid-id'
        });
      }
      let SelectdShipping_Company = await Shipping_Company.findOne({
        where: {
          id: id
        },
        include: ['Logo', {
          model: Shipping_Company_Zone,
          as: 'Shipping_Company_Zone',
          required: true,
          include: [{ model: Shipping_Company_Location, as: 'Shipping_Company_Location', include: ['Country', 'City'] }]
        }]
      });
      return ResponseService.SuccessResponse(res, 'success for getting all data about Shipping_Company', SelectdShipping_Company);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when get the Shipping_Company data', {
        action: 'invalid-error',
        error: err
      });
    }
  },

  ChangeShipping_CompanyStatus: async function (req, res) {
    try {
      var status = req.param('status');
      var Shipping_Company_id = req.param('Shipping_Company_id');
      if (Shipping_Company_id && status) {
        var SelectedShipping_Company = await Shipping_Company.findOne({
          where: {
            id: Shipping_Company_id
          }
        });
        SelectedShipping_Company.status = status;
        await SelectedShipping_Company.save();

        return ResponseService.SuccessResponse(res, 'success for updating Shipping Company status', SelectedShipping_Company);
      } else {
        return ResponseService.ErrorResponse(res, 'please provide the Shipping Company id');
      }
    } catch (e) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when change the status of the Shipping Company');
    }
  },
  create: async function (req, res) {
    try {
      let params = req.allParams();
      var image = req.param('image');
      if (image) {
        var image = await sails.helpers.uploadImage(image.base64, "Image", "Image", "Image Desc", 'shipping_company', 1140, 400);
        params['image_id'] = image.id;
      }

      let CreatedShipping_Company = await Shipping_Company.create(params);
      console.log(params.zones);

      let zones = JSON.parse(params.zones);
      console.log(zones);
      for (let i = 0; i < zones.length; i++) {
        let zone = {};
        zone['Cost'] = zones[i].cost;
        zone['Cash_Cost'] = zones[i].cash_cost;
        zone['Cash_on_delivery'] = zones[i].cash_on_delivery;
        zone['Shipping_Company_id'] = CreatedShipping_Company.id;
        let CreatedShipping_Company_zone = await Shipping_Company_Zone.create(zone);

        for (let j = 0; j < zones[i].cities.length; j++) {
          let loc = {};
          loc['Shipping_Company_Zone_id'] = CreatedShipping_Company_zone.id;
          loc['city_id'] = zones[i].cities[j];
          var SelectedCity = await City.findOne({
            where: {
              id: zones[i].cities[j]
            }
          });

          loc['country_id'] = SelectedCity.countryId;
          await Shipping_Company_Location.create(loc);
        }

      }
      return ResponseService.SuccessResponse(res, 'success for creating Shipping Company', CreatedShipping_Company);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen when creating Shipping Company', {
        error: err,
        action: 'unkown-error'
      });
    }
  },
  edit: async function (req, res) {
    try {
      let params = req.allParams();
      if (!params.id) {
        return ResponseService.ErrorResponse(res, 'please provide the address id', {
          action: 'invalid-data'
        });
      }
      let SelectedShipping = await Shipping_Company.findOne({
        where: {
          id: params.id
        }
      });
      SelectedShipping.name = params.name;
      SelectedShipping.description = params.description;
      var image = req.param('image');
      if (image) {
        var image = await sails.helpers.uploadImage(image.base64, "Image", "Image", "Image Desc", 'shipping_company', 1140, 400);
        SelectedShipping.image_id = image.id;
      }
      await SelectedShipping.save();

      let SelectedShipping_Company_Zone = await Shipping_Company_Zone.findAndCountAll({ where: { Shipping_Company_id: SelectedShipping.id } });
      console.log(SelectedShipping_Company_Zone.rows.length);
      for (let i = 0; i < SelectedShipping_Company_Zone.rows.length; i++) {
        let selectedOfferPriceID = SelectedShipping_Company_Zone.rows[i].id;
        console.log(selectedOfferPriceID);
        var SelectedOfferPriceReplay = await Shipping_Company_Zone.findOne({
          where: {
            id: selectedOfferPriceID
          }
        });
        await SelectedOfferPriceReplay.destroy();
      }

      let zones = JSON.parse(params.zones);

      for (let i = 0; i < zones.length; i++) {
        let zone = {};
        zone['Cost'] = zones[i].Cost;
        zone['Cash_Cost'] = zones[i].Cash_Cost;
        zone['Cash_on_delivery'] = zones[i].Cash_on_delivery;
        zone['Shipping_Company_id'] = SelectedShipping.id;
        let CreatedShipping_Company_zone = await Shipping_Company_Zone.create(zone);

        for (let j = 0; j < zones[i].cities.length; j++) {
          let loc = {};
          loc['Shipping_Company_Zone_id'] = CreatedShipping_Company_zone.id;
          loc['city_id'] = zones[i].cities[j];
          var SelectedCity = await City.findOne({
            where: {
              id: zones[i].cities[j]
            }
          });
          loc['country_id'] = SelectedCity.countryId;
          await Shipping_Company_Location.create(loc);
        }

      }
      return ResponseService.SuccessResponse(res, 'success for Updating Shipping Company', SelectedShipping);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen when creating Shipping Company', {
        error: err,
        action: 'unkown-error'
      });
    }
  },
  removeShipping_Company: async function (req, res) {
    try {
      let id = req.param('id');
      let SelectedShipping_Company = await Shipping_Company.findOne({ where: { id: id } });
      await SelectedShipping_Company.destroy();
      return ResponseService.SuccessResponse(res, 'success for remove the Shipping Company', SelectedShipping_Company);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen', { action: 'unkown-err', error: err });
    }
  },

};
