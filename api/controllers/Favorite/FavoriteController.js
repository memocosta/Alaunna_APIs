/**
 * FavoriteController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var moment = require('moment');
module.exports = {
  index: async function (req, res) {
    try {
      var offset = req.param('offset');
      var user_id = req.param('user_id');
      var market_id = req.param('market_id');
      var fitlerObj = {};
      var whereOBJ = {};
      if (offset && offset != 'false') {
        fitlerObj['offset'] = parseInt(offset) * 10;
        fitlerObj['limit'] = 10;
      }
      if (user_id) {
        whereOBJ['user_id'] = user_id;
      }
      if (market_id) {
        whereOBJ['market_id'] = market_id;
      }
      fitlerObj['include'] = [
        {
          model: User,
          as: 'user'
        }
      ];
      fitlerObj['where'] = whereOBJ;
      var SelectedFav = await Favorite.findAndCountAll(fitlerObj);

      let fitlerOBJ2 = {
          where: {}
        };

      if (market_id && market_id != 'false') {
        fitlerOBJ2['where']['market_id'] = market_id;
      }
      if (offset && offset != 'false' || offset === 0) {
        fitlerOBJ2['offset'] = 10 * offset;
        fitlerOBJ2['limit'] = 10;
      }
      let SelectedCustomers = await MarketCustomer.findAndCountAll(fitlerOBJ2);
      let data = {
        SelectedCustomers:SelectedCustomers,
        SelectedFav:SelectedFav
      }
      return ResponseService.SuccessResponse(res, 'success for getting all favorite data', data);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'something wrong happen wher get all favorite', {
        action: 'unkown-error'
      });
    }
  },
  create: async function (req, res) {
    try {
      var favoriteParams = req.allParams();
      if (!favoriteParams.market_id || !favoriteParams.user_id) {
        return ResponseService.ErrorResponse(res, 'please provide the user_id and market_id', {
          action: 'invalid-data'
        });
      }
      let FavCheck = await Favorite.findOne({
        where: {
          market_id: favoriteParams.market_id,
          user_id: favoriteParams.user_id
        }
      });
      if (FavCheck) {
        return ResponseService.ErrorResponse(res, 'this market is already in your favorite', {
          action: 'already-exist'
        });
      }

      var createdFav = await Favorite.create(favoriteParams);

      let marketobj = await Market.findOne({ where: { id: favoriteParams.market_id } });
      let marketUser = await User.findOne({ where: { id: marketobj.Owner_id } });
      let clientUser = await User.findOne({ where: { id: favoriteParams.user_id } });
      console.log(marketUser);

      if (marketUser !== null) {
        let notificationOBJ = {
          token: marketUser.device_id,
          body: 'تابع متجرك ' + clientUser.name,
          type: 'favorite',
        };
        if (marketUser.device_id) {
          await sails.helpers.firebase.with(notificationOBJ);
        }
      }

      return ResponseService.SuccessResponse(res, 'success for creating the favorite', createdFav);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'something wrong happen when creating the favorite', {
        action: 'unkown-error',
        error: err
      });
    }
  },
  edit: async function (req, res) {
    try {
      var favoriteParams = req.allParams();
      if (!favoriteParams.market_id || !favoriteParams.user_id || !favoriteParams.id) {
        return ResponseService.ErrorResponse(res, 'please provide the user_id and market_id', {
          action: 'invalid-data'
        });
      }
      var SelectedFav = await Favorite.findOne({
        where: {
          id: favoriteParams.id
        }
      });
      SelectedFav.market_id = favoriteParams.market_id;
      SelectedFav.user_id = favoriteParams.user_id;
      await SelectedFav.save()
      return ResponseService.SuccessResponse(res, 'success for editing the favorite', SelectedFav);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen when edit the favorite', {
        action: 'unkown-error',
        error: err
      });
    }
  },
  remove: async function (req, res) {
    try {
      var fav_id = req.param('id');
      if (!fav_id) {
        return ResponseService.ErrorResponse(res, 'please provide the favorite id', {
          action: 'invalid-data'
        });
      }
      var Selectedfavorite = await Favorite.findOne({
        where: {
          id: fav_id
        }
      });
      await Selectedfavorite.destroy();
      return ResponseService.SuccessResponse(res, 'success for remove the favorite', Selectedfavorite);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen when remove the favorite', {
        action: 'unkown-error',
        error: err
      });
    }
  },
  getOffersFilterdByMarketsId: async function (req, res) {
    try {
      let user_id = req.param('user_id');
      if (!user_id) {
        return ResponseService.ErrorResponse(res, 'please provide the user_id', { action: 'user_id-required' });
      }
      let MarketsIds = await Favorite.findAll({
        attributes: ['market_id'],
        where: {
          user_id: user_id
        }
      });
      let ids = [];
      for (let i = 0; i < MarketsIds.length; i++) {
        ids.push(MarketsIds[i].market_id);
      }
      let offset = req.param('offset'),
        filterOBJ = {},
        WhereOBJ = {};
      filterOBJ['where'] = {};

      filterDate = moment().toISOString();
      WhereOBJ['market_id'] = ids;
      WhereOBJ['from'] = {
        [Sequelize.Op.lte]: moment(filterDate).toISOString(),
      }
      WhereOBJ['to'] = {
        [Sequelize.Op.gte]: moment(filterDate).toISOString(),
      }

      console.log(offset);
      if ((offset && offset != 'false' && offset != 'undefiend') || offset == 0) {
        filterOBJ['offset'] = offset * 10;
        filterOBJ['limit'] = 10;
      }

      filterOBJ['limit'] = 8;
      filterOBJ['include'] = [{
        model: ProductOffer,
        as: 'offer',
        where: WhereOBJ,
        required: true
      }];
      let SelectedOffers = await Product.scope('offerScope').findAndCountAll(filterOBJ);
      return ResponseService.SuccessResponse(res, 'success for getting oofer data', SelectedOffers);

    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when get the offer data', { action: 'unkown-error', error: err })
    }
  }
};
