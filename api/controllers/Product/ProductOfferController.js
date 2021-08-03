/**
 * ProductOfferController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var moment = require('moment');
module.exports = {
  index: async function (req, res) {
    try {
      let offset = req.param('offset'),
        filterDate = req.param('date'),
        //product_id = req.param('product_id'),
        OfferfilterOBJ = {},
        ProductFilterOBJ = {},
        WhereOBJ = {};

      if (offset) {
        ProductFilterOBJ['offset'] = 10 * offset;
        ProductFilterOBJ['limit'] = 10;
      }
      if (!filterDate) {
        filterDate = moment().toISOString()
      }
      // if (product_id) {
      //   WhereOBJ['product_id'] = product_id;
      // }
      WhereOBJ['from'] = {
        [Sequelize.Op.lte]: filterDate,
      }
      WhereOBJ['to'] = {
        [Sequelize.Op.gte]: filterDate,
      }
      WhereOBJ['status'] = 'active';
      //OfferfilterOBJ['where'] = WhereOBJ;
      // filterOBJ['include'] = [{
      //   model: Product,
      //   as: 'product',
      //   include: [{
      //     model: Market,
      //     as: 'market',
      //     include: ['Image'],
      //     through: {
      //       where: {
      //         Showen: true
      //       }
      //     },
      //     required: true
      //   }]
      // }];
      ProductFilterOBJ['limit'] = 8;
      ProductFilterOBJ['where'] = {};
      ProductFilterOBJ['where']['status'] = 'active';
      ProductFilterOBJ['include'] = [{
        model: ProductOffer,
        as: 'offer',
        where: WhereOBJ,
        required: true
      }, { model: Market, as: 'market', where: { status: 'active' }, required: true }];
      //OfferfilterOBJ['limit'] = 8;
      //filterOBJ['group'] = ['offer_type'];
      // WhereOBJ['offer_type'] = 1;
      // let SelecteOffsersType1 = await ProductOffer.findAll(filterOBJ);
      // WhereOBJ['offer_type'] = 2;
      // let SelecteOffsersType2 = await ProductOffer.findAll(filterOBJ);
      // WhereOBJ['offer_type'] = 3;
      // let SelecteOffsersType3 = await ProductOffer.findAll(filterOBJ);
      // WhereOBJ['offer_type'] = 4;
      // let SelecteOffsersType4 = await ProductOffer.findAll(filterOBJ);
      // WhereOBJ['offer_type'] = 5;
      // let SelecteOffsersType5 = await ProductOffer.findAll(filterOBJ);
      WhereOBJ['offer_type'] = 1;
      let SelecteOffsersType1 = await Product.scope('offerScope').findAll(ProductFilterOBJ)
      WhereOBJ['offer_type'] = 2;
      let SelecteOffsersType2 = await Product.scope('offerScope').findAll(ProductFilterOBJ)
      WhereOBJ['offer_type'] = 3;
      let SelecteOffsersType3 = await Product.scope('offerScope').findAll(ProductFilterOBJ)
      WhereOBJ['offer_type'] = 4;
      let SelecteOffsersType4 = await Product.scope('offerScope').findAll(ProductFilterOBJ)
      WhereOBJ['offer_type'] = 5;
      let SelecteOffsersType5 = await Product.scope('offerScope').findAll(ProductFilterOBJ)

      let Response = [{
        title: 'type1',
        data: SelecteOffsersType1
      },
      {
        title: 'type2',
        data: SelecteOffsersType2
      },
      {
        title: 'type3',
        data: SelecteOffsersType3
      },
      {
        title: 'type4',
        data: SelecteOffsersType4
      },
      {
        title: 'type5',
        data: SelecteOffsersType5
      }
      ];

      return ResponseService.SuccessResponse(res, 'success for getting the offer', Response);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when getting the offers', {
        error: err,
        action: 'invalid-data'
      });
    }
  },
  create: async function (req, res) {
    try {
      let params = req.allParams();
      var market_id = req.param('market_id');
      // if (!params.product_id) {
      //   return ResponseService.ErrorResponse(res, 'please provide all data', {
      //     action: 'invalid-data'
      //   });
      // }
      let image = req.param('image');
      if (req.param('image')) {
        var Finalimage = await sails.helpers.uploadImage(image.base64, image.alt, image.alt, image.description, 'market/offers', 220, 220, { isBanner: true });
        params['image_id'] = Finalimage.id;
      }

      let filterOBJ = {};
      let whereOBJ = {};
      whereOBJ['owner'] = market_id;
      whereOBJ['offer_id'] = null;
      filterOBJ['where'] = whereOBJ;
      var userProducts = await Product.findAndCountAll(filterOBJ);
      //check if we found products has no offer or not
      if (userProducts.rows.length == 0) {
        return ResponseService.ErrorResponse(res, 'no products Selected', {
          action: 'no-products'
        })
      }

      let CreatedOffer = await ProductOffer.create(params);
    // if(CreatedOffer){
    //   let notificationOBJ = {
    //     type: 'product_offer',
    //     // user_id: null, 
    //     product_offer_id: CreatedOffer.id, 
    //   };
    //   console.log(notificationOBJ)
    //   await CustomerNotifications.create(notificationOBJ);
    // }
      for (let i = 0; i < userProducts.rows.length; i++) {
        let SelectedProduct = await Product.findOne({
          where: {
            id: userProducts.rows[i].id
          }
        });
        SelectedProduct.offer_id = CreatedOffer.id;
        await SelectedProduct.save();
      }
      //await Admin.sendNotification('تنبيه' , 'تم اضافه عرض جديد علي المنتجات برجاء مراجعه العرض'  , 'offer' , 'create');
      return ResponseService.SuccessResponse(res, 'success for creating the product with offer', CreatedOffer);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen when creating the offer', {
        error: err,
        action: 'unkown-error'
      });
    }
  },
  addofferWithMultiableProduct: async function (req, res) {
    try {
      let params = req.allParams();
      let image = req.param('image');
      var market_id = req.param('market_id');
      if (req.param('image')) {
        var Finalimage = await sails.helpers.uploadImage(image.base64, image.alt, image.alt, image.description, 'market/offers', 220, 220, { isBanner: true });
        params['image_id'] = Finalimage.id;
      }
      if (!req.param('products') || params.products.length == 0) {
        return ResponseService.ErrorResponse(res, 'no products Selected', {
          action: 'no-products'
        })
      }
      let CreatedOffer = await ProductOffer.create(params);
      for (let i = 0; i < params.products.length; i++) {
        let SelectedProduct = await Product.findOne({
          where: {
            id: params.products[i]
          }
        });
        SelectedProduct.offer_id = CreatedOffer.id;
        await SelectedProduct.save();
      }
      //await Admin.sendNotification('تنبيه' , `تم اضافه عرض جديد برقم ${CreatedOffer.id} برجاء مراجعه العرض` , 'offer' , 'create');
      return ResponseService.SuccessResponse(res, 'success for create the offer', CreatedOffer);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'something wrong happen when create the offer', {
        action: 'unkown-error',
        error: err
      })
    }
  },
  edit: async function (req, res) {
    try {

      let params = req.allParams();

      var market_id = req.param('market_id');
      if (!params.id) {
        return ResponseService.ErrorResponse(res, 'please provide the offer id', {
          action: 'invalid-data'
        });
      }
      let image = req.param('image_new');

      let SelectOffer = await ProductOffer.findOne({
        where: {
          id: params.id
        }
      });
      if (req.param('image_new')) {
        var Finalimage = await sails.helpers.uploadImage(image.base64, image.alt, image.alt, image.description, 'market/offers', 220, 220, { isBanner: true });
        SelectOffer.image_id = Finalimage.id;
      }
      SelectOffer.title = params.title;
      SelectOffer.description = params.description;
      SelectOffer.from = params.from;
      SelectOffer.to = params.to;
      SelectOffer.value = params.value;
      SelectOffer.discount = params.discount;
      SelectOffer.all = params.all;
      await SelectOffer.save();

      let filterOBJ = {};
      let whereOBJ = {};
      whereOBJ['owner'] = market_id;
      whereOBJ['offer_id'] = null;
      filterOBJ['where'] = whereOBJ;
      var userProducts = await Product.findAndCountAll(filterOBJ);
      for (let i = 0; i < userProducts.rows.length; i++) {
        let SelectedProduct = await Product.findOne({
          where: {
            id: userProducts.rows[i].id
          }
        });
        SelectedProduct.offer_id = SelectOffer.id;
        await SelectedProduct.save();
      }

      return ResponseService.SuccessResponse(res, 'success for edit the offer', SelectOffer);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen when edit the offer', {
        error: err,
        action: 'unkown-error'
      });
    }
  },
  updateOfferWithMultiableProduct: async function (req, res) {
    try {
      let params = req.allParams();
      var market_id = req.param('market_id');
      if (!params.id) {
        return ResponseService.ErrorResponse(res, 'please provide the offer id', {
          action: 'invalid-data'
        });
      }
      if (!req.param('products') || params.products.length == 0) {
        return ResponseService.ErrorResponse(res, 'no products Selected', {
          action: 'no-products'
        })
      }
      let image = req.param('image_new');

      let SelectOffer = await ProductOffer.findOne({
        where: {
          id: params.id
        }
      });
      if (req.param('image_new')) {
        var Finalimage = await sails.helpers.uploadImage(image.base64, image.alt, image.alt, image.description, 'market/offers', 220, 220, { isBanner: true });
        SelectOffer.image_id = Finalimage.id;
      }
      SelectOffer.title = params.title;
      SelectOffer.description = params.description;
      SelectOffer.from = params.from;
      SelectOffer.to = params.to;
      SelectOffer.value = params.value;
      SelectOffer.discount = params.discount;
      SelectOffer.all = params.all;
      await SelectOffer.save();
      if (req.param('products')) {

        let filterOBJ = {};
        let whereOBJ = {};
        whereOBJ['owner'] = market_id;
        whereOBJ['offer_id'] = params.id;
        filterOBJ['where'] = whereOBJ;
        var userProducts = await Product.findAndCountAll(filterOBJ);
        for (let i = 0; i < userProducts.rows.length; i++) {
          let SelectedProduct = await Product.findOne({
            where: {
              id: userProducts.rows[i].id
            }
          });
          SelectedProduct.offer_id = null;
          await SelectedProduct.save();
        }
        for (let i = 0; i < params.products.length; i++) {
          let SelectedProduct = await Product.findOne({
            where: {
              id: params.products[i]
            }
          });
          SelectedProduct.offer_id = SelectOffer.id;
          await SelectedProduct.save();
        }
      }
      return ResponseService.SuccessResponse(res, 'success for create the offer', SelectOffer);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'something wrong happen when create the offer', {
        action: 'unkown-error',
        error: err
      })
    }
  },
  remove: async function (req, res) {
    try {
      let offer_id = req.param('id'),
        product_id = req.param('product_id'),
        filterOBJ = {};
      //   if (offer_id) {
      //     filterOBJ['id'] = offer_id;
      //   }
      //   if (product_id) {
      //     filterOBJ['product_id'] = product_id;
      //   }
      // let selectedProduct = await Product.findOne({
      //   where: {
      //     id: product_id
      //   }
      // });
      // selectedProduct.offer_id = null;
      //await selectedProduct.save();
      // let ProductWithOffer = await Product.findAll({
      //   where: {
      //     offer_id: offer_id
      //   }
      // });
      //if (ProductWithOffer.length == 0) {
      let DeletedOffer = await ProductOffer.findOne({
        where: {
          id: offer_id
        }
      });
      await DeletedOffer.destroy();
      //}
      // await User.sendNotification('تنبيه' , ` تم مسح العرض الخاص بك والذي يمتلك رقم ${DeletedOffer.id}` , 'offer' , 'deleted' , '' , DeletedOffer.market_id);
      return ResponseService.SuccessResponse(res, 'success for deleting  the offer', {});
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'something wrong happen when creating the offer', {
        error: err,
        action: 'unkown-error'
      });
    }
  },
  getAllOffers: async function (req, res) {
    try {
      let offset = req.param('offset'),
        offer_type = req.param('offer_type'),
        filterDate = req.param('date'),
        market_id = req.param('market_id'),
        status = req.param('status'),
        filterOBJ = {},
        WhereOBJ = {};
      filterOBJ['where'] = {};

      if (!filterDate) {
        filterDate = moment().toISOString();
      }
      WhereOBJ['from'] = {
        [Sequelize.Op.lte]: moment(filterDate).toISOString(),
      }
      WhereOBJ['to'] = {
        [Sequelize.Op.gte]: moment(filterDate).toISOString(),
      }

      if (market_id && market_id != 'false') {
        filterOBJ['where']['owner'] = market_id;
      }
      if ((offset && offset != 'false' && offset != 'undefiend') || offset == 0) {
        filterOBJ['offset'] = offset * 10;
        filterOBJ['limit'] = 10;
      }

      if (offer_type && offer_type != 'false' && offer_type != 'undefiend') {
        WhereOBJ['offer_type'] = offer_type;
      }
      if (status && status != 'admin' && status != 'false') {
        WhereOBJ['status'] = status;
      } else if (status != 'admin') {
        status = 'active';
      }
      // filterOBJ['limit'] = 8;
      filterOBJ['include'] = [{
        model: ProductOffer,
        as: 'offer',
        where: WhereOBJ,
        required: true
      }];
      let SelectedOffers = await Product.scope('offerScope').findAndCountAll(filterOBJ);
      return ResponseService.SuccessResponse(res, 'success for getting all offers ', SelectedOffers);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when getting the offers', {
        action: 'unkown-error'
      })
    }
  },
  getAllOffersMarket: async function (req, res) {
    try {
      let market_id = req.param('market_id'),
        filterOBJ = {},
        WhereOBJ = {}
      filterOBJ['where'] = {};

      if (market_id && market_id != 'false') {
        WhereOBJ['market_id'] = market_id;
      }
      filterOBJ['where'] = WhereOBJ;
      let SelectedOffers = await ProductOffer.findAndCountAll(filterOBJ);
      return ResponseService.SuccessResponse(res, 'success for getting all offers ', SelectedOffers);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when getting the offers', {
        action: 'unkown-error'
      })
    }
  },
  offerIndex: async function (req, res) {
    try {
      let params = req.allParams(),
        filterOBJ = {
          where: {},
          include: []
        };
      if (params.offset && params.offset != 'false') {
        filterOBJ['offset'] = 10 * params.offset;
        filterOBJ['limit'] = 10;
      }
      if (params.market_id && params.market_id != 'false') {
        filterOBJ['where']['market_id'] = params.market_id;
      }
      if (params.status && params.status != 'false') {
        if (params.status.indexOf(',') > -1) {
          filterOBJ['where']['status'] = params.status.split(',');
        } else {
          filterOBJ['where']['status'] = params.status;
        }
      }
      if (params.type && params.type != 'false') {
        filterOBJ['where']['offer_type'] = params.type;
      }

      if (params.date) {
        let filterDate = params.date;
        filterDate = moment().toISOString();
        filterOBJ['where']['from'] = {
          [Sequelize.Op.lte]: moment(filterDate).toISOString(),
        }
        filterOBJ['where']['to'] = {
          [Sequelize.Op.gte]: moment(filterDate).toISOString(),
        }
      }

      if (params.expired) {
        if (params.expired == 'yes') {
          filterOBJ['where']['from'] = {
            [Sequelize.Op.lte]: moment().toISOString(),
          }
          filterOBJ['where']['to'] = {
            [Sequelize.Op.lte]: moment().toISOString(),
          }
        } else if (params.expired == 'no') {
          filterOBJ['where']['from'] = {
            [Sequelize.Op.lte]: moment().toISOString(),
          }
          filterOBJ['where']['to'] = {
            [Sequelize.Op.gte]: moment().toISOString(),
          }
        } else if (params.expired == 'not_started') {
          filterOBJ['where']['from'] = {
            [Sequelize.Op.gte]: moment().toISOString(),
          }
          filterOBJ['where']['to'] = {
            [Sequelize.Op.gte]: moment().toISOString(),
          }
        }
      }
      filterOBJ['order'] = [['createdAt', 'DESC']];
      filterOBJ.include.push({ model: Market, as: 'market', attributes: ['name', 'id'] });
      let SelectedOffers = await ProductOffer.findAndCountAll(filterOBJ);

      return ResponseService.SuccessResponse(res, 'success for get all data for offers', SelectedOffers)
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthign wrong happen when get the offer', {
        action: 'unkown-err',
        error: err
      });
    }
  },
  changeOfferStatus: async function (req, res) {
    try {
      let params = req.allParams();
      let SelecteOffser = await ProductOffer.findOne({
        where: {
          id: params.id
        }
      });
      SelecteOffser.status = params.status;
      // await User.sendNotification('تنبيه' ,'لقد تم تغير حاله العرض الذي يحمل رقم ' + SelecteOffser.id , 'offer' , 'status' , '' , SelecteOffser.market_id);
      await SelecteOffser.save();

      if (params.status == 'not_active') {
        let filterOBJ = {};
        let whereOBJ = {};
        whereOBJ['offer_id'] = params.id;
        filterOBJ['where'] = whereOBJ;
        var offerProducts = await Product.findAndCountAll(filterOBJ);
        for (let i = 0; i < offerProducts.rows.length; i++) {
          let SelectedProduct = await Product.findOne({
            where: {
              id: offerProducts.rows[i].id
            }
          });
          SelectedProduct.offer_id = null;
          await SelectedProduct.save();
        }
      }
      return ResponseService.SuccessResponse(res, 'success foe chage the ofefr status', SelecteOffser);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when chnage the offer status', {
        action: 'unkown-err',
        err: err
      });
    }
  },
  single: async function (req, res) {
    try {
      let params = req.allParams();
      let SelecteOffser = await ProductOffer.findOne({
        where: {
          id: params.offer_id
        }
      });

      return ResponseService.SuccessResponse(res, 'success for get data for offer', SelecteOffser);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when get data for offer', {
        action: 'unkown-err',
        err: err
      });
    }
  },
  expiredOffersCoupons: async function (req, res) {
    try {
      let filterOBJ = {
        where: {},
        include: {}
      };
      let filterDate = moment().toISOString();
      filterOBJ['include'] = [
      {
        model: ProductOffer,
        as: 'offer',
        where: {
          to: {
            [Sequelize.Op.lte]: filterDate
          }
        },
        required: true
      }
      ];
      var SelectedProducts = await Product.findAndCountAll(filterOBJ);
      for (let i = 0; i < SelectedProducts.rows.length; i++) {
        let SelectedProduct = await Product.findOne({
          where: {
            id: SelectedProducts.rows[i].id
          }
        });
        SelectedProduct.offer_id = null;
        await SelectedProduct.save();
      }

      // coupon check

      let filterOBJ2 = {
        where: {},
        include: {}
      };

      filterOBJ2['include'] = [
      {
        model: coupon,
        as: 'coupon',
        where: {
          to: {
            [Sequelize.Op.lte]: filterDate
          }
        },
        required: true
      }
      ];
      var SelectedProducts2 = await Product.findAndCountAll(filterOBJ2);
      for (let i = 0; i < SelectedProducts2.rows.length; i++) {
        let SelectedProduct2 = await Product.findOne({
          where: {
            id: SelectedProducts2.rows[i].id
          }
        });
        SelectedProduct2.coupon_id = null;
        await SelectedProduct2.save();
      }

      return ResponseService.SuccessResponse(res, 'success for get all data for expired offers and coupons', SelectedProducts)
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthign wrong happen when get the offer', {
        action: 'unkown-err',
        error: err
      });
    }
  }
};
