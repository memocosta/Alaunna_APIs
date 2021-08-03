/**
 * MarketBannerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var randomestring = require('randomstring');
module.exports = {
  index: async function (req, res) {
    try {
      var offset = req.param('offset');
      var market_id = req.param('market_id');
      let status = req.param('status');
      console.log(status);
      var filterobj = {
        where: {},
        include: []
      };
      if (offset && offset != 'false') {
        filterobj['offset'] = offset * 10;
        filterobj['limit'] = 10;
      }
      if (market_id && market_id != 'false') {
        filterobj['where']['market_id'] = market_id;
      }
      if (status && status != 'false') {
        filterobj['where']['status'] = status;
      }
      
      filterobj['include'] = [{
        model: Market,
        as: 'Market',
        include: [{
          model: MarketBanner,
          as: 'banners',
          include: ['image']
        } , 'Image']
      },'image'];
      var SelectedMarketBanners = await MarketBanner.findAndCountAll(filterobj);
      return ResponseService.SuccessResponse(res, 'success for getting all banners', SelectedMarketBanners);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when geting the banners', {
        error: err,
        action: 'unknown-error'
      });
    }
  },
  getAllMarketsBanners: async function (req, res) {
    try {
      var offset = req.param('offset');
      var market_id = req.param('market_id');
      let status = req.param('status');
      let category_id = req.param('category_id');
      let city_id = req.param('city_id');
      let country_id = req.param('country_id');

      console.log(status);
      var filterobj = {
        where: {},
        include: []
      };
      let WhereMarketOBJ = { };
      if (offset && offset != 'false') {
        filterobj['offset'] = offset * 10;
        filterobj['limit'] = 10;
      }
      if (market_id && market_id != 'false') {
        filterobj['where']['market_id'] = market_id;

      }
      if (status && status != 'false') {
        filterobj['where']['status'] = status;

      }
      if (category_id && category_id != 'false') {
        WhereMarketOBJ['marketcategory_id'] = category_id;
      }
      if (city_id && city_id != 'false') {
        WhereMarketOBJ['City_id'] = city_id;
      }
      if (country_id && country_id != 'false') {
        WhereMarketOBJ['Country_id'] = country_id;
      }
      filterobj['include'] = [{
        model: Market,
        as: 'Market',
        where: WhereMarketOBJ,
        include: [{
          model: MarketBanner,
          as: 'banners',
          include: ['image']
        },'cover','Image']
      },'image'];    
      filterobj['order'] = [['id' , 'DESC']]

      var SelectedMarketBanners = await MarketBanner.findAndCountAll(filterobj);
      return ResponseService.SuccessResponse(res, 'success for getting all banners', SelectedMarketBanners);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when geting the banners', {
        error: err,
        action: 'unknown-error'
      });
    }
  },
  create: async function (req, res) {
    try {
      var BannerObj = req.allParams();
      // if (!BannerObj.title || !BannerObj.image || !BannerObj.market_id) {
      //   return ResponseService.ErrorResponse(res, 'please provide all banner data', {
      //     action: 'invalid-data'
      //   });
      // }
      // var MarketBannersCount = await MarketBanner.count({
      //   where: {
      //     market_id: BannerObj.market_id
      //   }
      // });
      // if (MarketBannersCount >= 3) {
      //   return ResponseService.ErrorResponse(res, 'you have more than 3 banners', {
      //     action: 'invalid-banners-counter'
      //   });
      // }
      if (BannerObj.image){
        var image = await sails.helpers.uploadImage(BannerObj.image.base64, randomestring.generate(5), BannerObj.image.alt, BannerObj.image.description, 'market/banners', 1024, 512);
        BannerObj['image_id'] = image.id;
      }
      var createdBanner = await MarketBanner.create(BannerObj);
      await Admin.sendNotification('تنبيه', `تم اضافه بنر اعلاني للمتجر الذي يجمل رقم ${BannerObj.market_id}`, 'banner', 'create');
      return ResponseService.SuccessResponse(res, 'success for creating the banner', createdBanner);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when creating the banners', {
        error: err,
        action: 'unknown-error'
      });
    }
  },
  remove: async function (req, res) {
    try {
      var banner_id = req.param('id');
      if (!banner_id) {
        return ResponseService.ErrorResponse(res, 'please provide the banner_id', {
          action: 'invalid-id'
        });
      }
      var SelectedBanner = await MarketBanner.findOne({
        where: {
          id: banner_id
        }
      });
      await SelectedBanner.destroy();
      return ResponseService.SuccessResponse(res, 'success for remove sponserd banners', SelectedBanner);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when delete the banner', err);
    }
  },
  edit: async function (req, res) {
    try {
      var params = req.allParams();
      if (!params.id) {
        return ResponseService.ErrorResponse(res, 'please provide the banner_id', {
          action: 'invalid-id'
        });
      }
      var SelectedBanner = await MarketBanner.findOne({
        where: {
          id: params.id
        }
      });
      // SelectedBanner.title = params.title;
      // SelectedBanner.description = params.description;
      // SelectedBanner.status = params.status;
      if (params.image){
        if (params.image.action == 'edited') {
          await sails.helpers.updateImage(params.image.id, params.image.base64, params.image.alt, params.image.description, 1024, 512);
        } else if (params.image.action == 'new') {
          var image = await sails.helpers.uploadImage(params.image.base64, params.title, params.image.alt, params.image.description, 'market/banners', 1024, 512);
          SelectedBanner['image_id'] = image.id;
        } else {
          await Image.update({
            alt: params.image.alt,
            description: params.image.description
          }, {
            where: {
              id: params.image.id
            }
          });
        }
      }
      await SelectedBanner.update(params);
      // await User.sendNotification('تنبيه' , 'تم تعديل البانر الخاص بك بنجاح' , 'banner' , 'edit' , '' , SelectedBanner.market_id);
      return ResponseService.SuccessResponse(res, 'success for editing the all params', SelectedBanner);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when delete the banner', err);
    }
  },
  getById : async function(req,res){
    try {
      let id = req.param('id');
      let SelectedBanenr = await MarketBanner.findOne({where : {id : id} , include : ['image']});
      return ResponseService.SuccessResponse(res ,'success for getting the banner by id' , SelectedBanenr);
    } catch (error) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when get the banner by id', error);
    }
  },
  likeBanner: async function (req, res) {
    try {
      let banner_id = req.param('banner_id');
      let SelectedBanner = await MarketBanner.findOne({
        where: {
          id: banner_id
        }
      });
      SelectedBanner.likes = SelectedBanner.likes + 1;
      await SelectedBanner.save();
      return ResponseService.SuccessResponse(res, 'success for like banner', SelectedBanner);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when like the banner', err);
    }
  },


  // marketBanner comment controllers
  commentIndex: async function (req, res) {
    try {
      let params = req.allParams(),
        filterOBJ = {
          where: {},
          include: []
        };
      if (params.offset) {
        filterOBJ['offset'] = params.offset * 10;
        filterOBJ['limit'] = 10;
      }
      if (params.market_banner_id) {
        filterOBJ['where']['market_banner_id'] = params.market_banner_id;
      }
      if (params.user_id) {
        filterOBJ['where']['user_id'] = params.user_id;
      }
      filterOBJ['include'].push('user');
      let SelectedComments = await MarketBannerComment.findAndCountAll(filterOBJ);
      return ResponseService.SuccessResponse(res ,'success for get comments' , SelectedComments);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen', err);
    }
  },
  createComment : async function (req, res) {
    try {
      let params = req.allParams();
      let SelectedBanner =await MarketBanner.findOne({where : {id : params.market_banner_id}});
      await sails.helpers.sendNewNotification.with({
        content: {
          "en": `تم اضافه كومنت علي الاعلان الخاص بك`,
          "ar": `تم اضافه كومنت علي الاعلان الخاص بك`
        },
        heading: {
          'en': "كومنت جديد",
          "ar": "كومنت جديد"
        },
        for: 'seller',
        filters: [{ key: 'market_id', value: SelectedBanner.market_id, relation: '=' }]
      })
      SelectedBanner.comments  = SelectedBanner.comments + 1;
      await SelectedBanner.save();
      let CreatedComment = await MarketBannerComment.create(params);
      return ResponseService.SuccessResponse(res ,'success for create comment' , CreatedComment);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen', err);
    }
  }
};
