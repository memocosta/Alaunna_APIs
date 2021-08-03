/**
 * OfferPriceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  index: async function (req, res) {
    try {
      let filterOBJ = { where: {}, include: [] }, params = req.allParams();
      if (filterOBJ.offset) {
        filterOBJ['offset'] = params.offset * 10;
        filterOBJ['limit'] = 10;
      }
      if (params.user_id) {
        filterOBJ['where']['user_id'] = params.user_id;
      }
      if (params.country_id) {
        filterOBJ['where']['country_id'] = params.country_id;
      }
      if (params.category_id) {
        filterOBJ['where']['category_id'] = params.category_id;
      }
      if (params.market_id) {
        // filterOBJ['where']['where'][$or] = [{for : 'all' } , {}]
        filterOBJ['include'].push({ model: Market, as: 'markets', attributes: ['id'] });
        filterOBJ['where']['$or'] = [
          { for: 'all_market' },
          Sequelize.literal("markets.id = " + params.market_id)
        ]
      }
      filterOBJ['include'].push({ model: OfferPriceReplay, as: 'offer_price_replay', attributes: ['offer_price_id', 'market_id', 'id'] });
      filterOBJ['include'].push('image');
      filterOBJ['include'].push('category');
      filterOBJ['include'].push('country');
      filterOBJ['include'].push('user');
      filterOBJ['order'] = [['id', 'DESC']]
      let SelectedPrices = await OfferPrice.findAndCountAll(filterOBJ);
      return ResponseService.SuccessResponse(res, 'success for select the prices', SelectedPrices);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'something wrong happen', { action: 'unkown-err', error: err })
    }
  },
  create: async function (req, res) {
    try {
      let params = req.allParams();
      if (params.image) {
        let image = await sails.helpers.uploadImage(params.image.base64, params.name, params.image.alt, params.image.description, 'price_offer', 220, 220, {});
        params['image_id'] = image.id;
      }
      if (params.city_id) {
        params['cities'] = JSON.stringify(params.city_id);
        var cities = params.city_id;
      }
      let CreatedOfferPrice = await OfferPrice.create(params);
      if (params.markets) {
        for (let i = 0; i < params.markets.length; i++) {
          let currentMarket = params.markets[i];
          if (currentMarket) {
            await OfferPriceMarket.create({ market_id: currentMarket, offer_price_id: CreatedOfferPrice.id });
          }
        }
      }
      if (params.city_id) {
        for (let index = 0; index < cities.length; index++) {
          const element = cities[index];
          let topic = '/topics/c' + element + 'c' + params.category_id;
          console.log('topic is ' + topic);

          ////// new notifications counter ///////
          let newNotificationOBJ = {
            type: 'offerPrice',
            user_id: 0,
            offer_price_id: CreatedOfferPrice.id,
            topic: topic,
          };
          await CustomerNotifications.create(newNotificationOBJ);
          ////////////

          if (params.for == 'all_market') {
            let notificationOBJ = {
              token: topic,
              body: 'هناك طلب عرض سعر جديد',
              type: 'offers',
            };
            await sails.helpers.firebase.with(notificationOBJ);
          }

        }
      }

      // const topic = '/topics/c' + params.country_id + 'c' + params.category_id;
      // console.log('topic is ' + topic);

      

      
      return ResponseService.SuccessResponse(res, 'success for create new price', CreatedOfferPrice);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'something wrong happen', { action: 'unkown-err', error: err })
    }
  },
  changeSellerReadofferPrices: async function (req, res) {
    try {

      let user_id = req.param('user_id'),
        filterOBJoffer = { where: {} };
      let selectedUser = await User.findOne({
        where: {
          id: user_id
        }
      });
      let topic = '/topics/c' + selectedUser.markets[0].Country_id + 'c' + selectedUser.markets[0].marketcategory_id;

      filterOBJoffer['where']['offer_price_id'] = {
        [Sequelize.Op.gt]: selectedUser.last_offer_price_read
      };
      filterOBJoffer['where']['topic'] = topic;
      filterOBJoffer['where']['type'] = 'offerPrice';
      filterOBJoffer['order'] = [['id', 'DESC']]
      let offersPriceNoti = await CustomerNotifications.findAll(filterOBJoffer);
      var highestRcord = 0;
      // for (let i = 0; i < offersPriceNoti.length; i++) {
      //   if(highestRcord < offersPriceNoti[i].offer_price_id){
      //     highestRcord = offersPriceNoti[i].offer_price_id;
      //   }
      // }
      if (offersPriceNoti.length > 0) {
        highestRcord = offersPriceNoti[0].offer_price_id;
      }
      selectedUser.last_offer_price_read = highestRcord;
      await selectedUser.save();
      return ResponseService.SuccessResponse(res, 'success for change the price offer notification reading status', highestRcord);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen', { action: 'unkown-err', error: err })
    }
  },
  remove: async function (req, res) {
    try {
      let id = req.param('id');
      console.log(id)
      let selectedOfferPrice = await OfferPrice.findOne({ where: { id: id } });
      // console.log(selectedOfferPrice)
      let SelectedOfferPriceReplaies = await OfferPriceReplay.findAndCountAll({ where: { offer_price_id: selectedOfferPrice.id } });
      // console.log(SelectedOfferPriceReplaies)
      for (let i = 0; i < SelectedOfferPriceReplaies.rows.length; i++) {
        let selectedOfferPriceID = SelectedOfferPriceReplaies.rows[i].id;
        var SelectedOfferPriceReplay = await OfferPriceReplay.findOne({
          where: {
            id: selectedOfferPriceID
          }
        });
        await SelectedOfferPriceReplay.destroy();
      }
      await selectedOfferPrice.destroy();
      return ResponseService.SuccessResponse(res, 'success for remove the price offer And Its Replyes', selectedOfferPrice);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen', { action: 'unkown-err', error: err })
    }
  },
  edit: async function (req, res) { },
  getById: async function (req, res) {
    try {
      let selectedOfferPrice = await OfferPrice.findOne({
        where: { id: req.param('id') },
        include: ['user', 'image', 'markets', 'category', 'country', { model: OfferPriceReplay, as: 'offer_price_replay', attributes: ['offer_price_id', 'id', 'comment', 'createdAt'] }]
      });
      return ResponseService.SuccessResponse(res, 'success for get th price by id', selectedOfferPrice);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen', { action: 'unkown-err', error: err })
    }
  },
};

