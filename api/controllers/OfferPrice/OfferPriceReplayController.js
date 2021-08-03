/**
 * OfferPriceReplayController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var randomestring = require('randomstring');
module.exports = {
  index: async function (req, res) {
    try {
      let parmas = req.allParams(), fitlerOBJ = { where: {}, include: [] };
      if (parmas.offset) {
        fitlerOBJ['offset'] = parmas.offset * 10;
        fitlerOBJ['limit'] = 10;
      }
      if (parmas.offer_price_id) {
        fitlerOBJ['where']['offer_price_id'] = parmas.offer_price_id;
      }
      if (parmas.min_price && parmas.max_price) {
        fitlerOBJ['where']['price'] = { $between: [parmas.min_price, parmas.max_price] }
      }
      if (parmas.market_id) {
        fitlerOBJr['where']['market_id'] = parmas.market_id;
      }
      fitlerOBJ['include'].push({
        model : Market ,
         as : 'market'  ,
          include : ['Image'],
          include: [{
            model: Image,
             as: 'cover'
            }],
        });
      fitlerOBJ['include'].push('image');
      let SelectedReplay = await OfferPriceReplay.findAndCountAll(fitlerOBJ);
      return ResponseService.SuccessResponse(res, 'succss for getting all replayes', SelectedReplay);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'something wrong happen', { action: 'unkown-err', error: err })
    }
  },
  unreadreplay: async function (req, res) {
    try {
      let parmas = req.allParams(), fitlerOBJ = { where: {}, include: [] };
      if (parmas.offset) {
        fitlerOBJ['offset'] = parmas.offset * 10;
        fitlerOBJ['limit'] = 10;
      }
      if (parmas.offer_price_id) {
        fitlerOBJ['where']['offer_price_id'] = parmas.offer_price_id;
      }
      if (parmas.min_price && parmas.max_price) {
        fitlerOBJ['where']['price'] = { $between: [parmas.min_price, parmas.max_price] }
      }
      if (parmas.market_id) {
        fitlerOBJr['where']['market_id'] = parmas.market_id;
      }
      fitlerOBJ['include'].push({
        model : Market ,
         as : 'market'  ,
          include : ['Image'],
          include: [{
            model: Image,
             as: 'cover'
            }],
        });
        fitlerOBJ['where']['read'] = false;
      fitlerOBJ['include'].push('image');
      let SelectedReplay = await OfferPriceReplay.findAndCountAll(fitlerOBJ);
      return ResponseService.SuccessResponse(res, 'succss for getting all replayes', SelectedReplay);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'something wrong happen', { action: 'unkown-err', error: err })
    }
  },
  create: async function (req, res) {
    try {
      let params = req.allParams();
      if (params.image) {
        let image = await sails.helpers.uploadImage(params.image.base64, randomestring.generate('10'), params.image.alt, params.image.description, 'offers/reply', 220, 220, {});
        params['image_id'] = image.id;
      }
      let CreatedReplay = await OfferPriceReplay.create(params);
      let SelectedPriceOffer = await OfferPrice.findOne({ where: { id: CreatedReplay.offer_price_id } });
      let notificationOBJ = {
        type: 'offer_reply',
        user_id: SelectedPriceOffer.user_id, 
        offer_reply_id: CreatedReplay.id, 
      };
      console.log(notificationOBJ)
      await CustomerNotifications.create(notificationOBJ);
      return ResponseService.SuccessResponse(res, 'success for create the replay', CreatedReplay);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'something wrong happen', { action: 'unkown-err', error: err })
    }
  },
  edit: async function (req, res) { },
  remove: async function (req, res) {
    try {
      let id = req.param('id');
      let SelectedReplay = await OfferPriceReplay.findOne({ where: { id: id } });
      await SelectedReplay.destroy();
      return ResponseService.SuccessResponse(res, 'success for remove the replayu', SelectedReplay);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen', { action: 'unkown-err', error: err })
    }
  },
  getById: async function (req, res) {
    try {
      let id = req.param('id');
      let SelectedReplay = await OfferPriceReplay.findOne({ where: { id: id } });
      return ResponseService.SuccessResponse(res, 'success for getting the replay by id', SelectedReplay);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen', { action: 'unkown-err', error: err })
    }
  },
  sendnoti: async function (req, res) {
    try {
      let user = await User.findOne({ where: { id: req.param('user_id') } });
      console.log(user);
      let notificationOBJ = {
        token: user.device_id,
        body: req.param('msg'),
        type: 'offers',
      };
          
      await sails.helpers.firebase.with(notificationOBJ);
      
      return ResponseService.SuccessResponse(res, 'success send notification', notificationOBJ);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen', { action: 'unkown-err', error: err })
    }
  }
};

