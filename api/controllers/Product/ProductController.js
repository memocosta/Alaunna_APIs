/**
 * ProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var randomstring = require('randomstring');
var fs = require("fs");
var pdf = require("dynamic-html-pdf");
var html = fs.readFileSync("./assets/templates/store.html", "utf8");
var fileName;
const XLSX = require('xlsx');

var today = new Date();
var getDate = function (curentDate) {
  if (curentDate) {
    var today = curentDate
  } else {
    var today = new Date();
  }
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
    today = yyyy + "-" + mm + "-" + dd;
    return today;
  }
}

var generatePDf = async function (products, total, from, to) {
  fileName = randomstring.generate(10) + '.pdf';
  var options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm"
  };
  var document = {
    type: "file", // 'file' or 'buffer'
    template: html,
    context: {
      products: products,
      todayDate: getDate(),
      from: getDate(from),
      to: getDate(to),
      total: total
    },
    path: "./.tmp/public/pdf/" + fileName // it is not required if type is buffer
  };
  return pdf.create(document, options);
};
//test
var updateProductImages = async function (images, product_id, name) {
  for (let i = 0; i < images.length; i++) {
    if (images[i]['action'] == 'edited') {
      await sails.helpers.updateImage(images[i].id, images[i].base64, images[i].alt, images[i].description, 220, 220, {isProduct: true});
    } else if (images[i]['action'] == 'new') {
      var image = await sails.helpers.uploadImage(images[i].base64, name, images[i].alt, images[i].description, 'product', 220, 220, {isProduct: true});
      await ProductImages.create({
        product_id: product_id,
        ImageId: image.id
      });
    } else if (images[i]['action'] == 'deleted') {
      await ProductImages.destroy({
        where: {
          product_id: product_id,
          ImageId: images[i].id
        }
      });
      let selectedImage = await Image.findOne({
        where: {
          id: images[i]['id']
        }
      });
      await selectedImage.destroy();
    } else {
      await Image.update({alt: images[i]['alt'], description: images[i]['description']}, {where: {id: images[i].id}});
    }
  }
}
var moment = require('moment');

module.exports = {
  index: async function (req, res) {
    try {
      var offset = req.param('offset');
      var status = req.param('status');
      var category_id = req.param('category_id');
      var subcategory_id = req.param('subcategory_id');
      var subsubcategory_id = req.param('subsubcategory_id');
      var includeMarket = req.param('include_market');
      let market_id = req.param('market_id');
      let country_id = req.param('country_id');
      let searchWord = req.param('word');
      let offer_id = req.param('offer_id');
      let city_id = req.param('city_id');
      let website = req.param('website');
      let sort = req.param('sort');
      let offer_type = req.param('offer_type');
      let discount_from = req.param('discount_from');
      let discount_to = req.param('discount_to');
      let markets_arr = req.param('markets_arr');
      let banner_id = req.param('banner_id');
      var fitlerOBJ = {};
      var whereOBJ = {};

      if (banner_id && banner_id != 'false' && banner_id != 'undefined' && banner_id != null && banner_id != 'null') {
        var OfferBanner = await OfferBanners.findOne({where: {id: banner_id}});
        let item = OfferBanner;
        offer_type = item.offer_type;
        discount_from = item.from;
        discount_to = item.to;
        country_id = item.country_id;
        category_id = item.category_id;
        subcategory_id = item.subCategory_id;
        subsubcategory_id = item.subSubCategory_id;
        website = true;
      }


      if ((offset && offset != 'false') || offset === 0) {
        fitlerOBJ['offset'] = offset * 30;
        fitlerOBJ['limit'] = 30
      }
      console.log(status);
      if (status && status != 'all' && status != 'false') {
        if (status.indexOf(',') > -1) {
          whereOBJ['status'] = status.split(',');
        } else {
          whereOBJ['status'] = status;
        }
      }
      if (category_id && category_id != 'false' && category_id != 'undefined') {
        whereOBJ['category_id'] = category_id;
      }

      if (subcategory_id && subcategory_id != 'false' && subcategory_id != 'undefined' && subcategory_id != null && subcategory_id != 'null') {
        whereOBJ['subCategory_id'] = subcategory_id;
      }
      if (subsubcategory_id && subsubcategory_id != 'false' && subsubcategory_id != 'undefined' && subsubcategory_id != null && subsubcategory_id != 'null') {
        whereOBJ['subSubCategory_id'] = subsubcategory_id;
      }
      if (includeMarket && includeMarket != 'false' && includeMarket != 'undefined') {

        // filter products with type of offer and between discount values
        let filterDate = moment().toISOString();
        let offer_where = {};
        offer_where['from'] = {
          [Sequelize.Op.lte]: moment(filterDate).toISOString(),
        }
        offer_where['to'] = {
          [Sequelize.Op.gte]: moment(filterDate).toISOString(),
        }

        let coupon_where = {};
        coupon_where['from'] = {
          [Sequelize.Op.lte]: moment(filterDate).toISOString(),
        }
        coupon_where['to'] = {
          [Sequelize.Op.gte]: moment(filterDate).toISOString(),
        }

        let offer_required = false;
        let coupon_required = false;

        if (offer_type && offer_type != 'false' && offer_type != 'undefined') {

          if (offer_type == 'discount') {

            offer_required = true;
            if (discount_from && discount_from != 'false' && discount_from != 'undefined' && discount_to && discount_to != 'false' && discount_to != 'undefined') {
              offer_where['value'] = {
                [Sequelize.Op.between]: [discount_from, discount_to]
              }
            } else {
              offer_where['value'] = {
                [Sequelize.Op.gt]: 0,
              }
            }

          } else if (offer_type == 'special') {
            offer_required = true;
            offer_where['value'] = {
              [Sequelize.Op.eq]: 0,
            }
          } else if (offer_type == 'coupon') {
            coupon_required = true;
            if (discount_from && discount_from != 'false' && discount_from != 'undefined' && discount_to && discount_to != 'false' && discount_to != 'undefined') {
              coupon_where['value'] = {
                [Sequelize.Op.between]: [discount_from, discount_to]
              }
            } else {
              coupon_where['value'] = {
                [Sequelize.Op.gt]: 0,
              }
            }
          }
        }

        let market_where = {};
        if (market_id && market_id != 'false' && market_id != 'undefined') {
          market_where['id'] = market_id;
        }
        if (country_id) {
          market_where['Country_id'] = country_id;
        }
        if (city_id) {
          market_where['City_id'] = city_id;
        }
        market_where['status'] = 'active';
        console.log(offset);
        whereOBJ['owner'] = {
          [Sequelize.Op.ne]: 'AWSHN'
        };

        fitlerOBJ['include'] = [{
          model: Market,
          as: 'market',
          where: market_where,
          through: {
            // where: {
            //   Showen: true
            // }
          },
          required: true,
          include: [{model: User, as: 'Owner', attributes: ['id', 'name', 'phone']}]
        },
          {
            model: ProductOffer,
            as: 'offer',
            where: offer_where,
            required: offer_required
          },
          {
            model: coupon,
            as: 'coupon',
            where: coupon_where,
            required: coupon_required
          }
        ];
      }
      if (searchWord && searchWord != 'false') {
        whereOBJ['name'] = {
          [Sequelize.Op.or]: [{[Sequelize.Op.like]: `%${searchWord}%`}]
        };
      }
      if (offer_id && offer_id != 'false') {
        whereOBJ['offer_id'] = offer_id;
      }

      fitlerOBJ['where'] = whereOBJ;

      if (sort == 'order') {
        fitlerOBJ['order'] = [['order', 'DESC'], ['id', 'DESC']]
      } else if (website == 'true') {
        fitlerOBJ['order'] = [['special', 'DESC'], ['order', 'DESC'], ['id', 'DESC']]
      } else {
        fitlerOBJ['order'] = [['id', 'DESC']]
      }

      var SeletedProducts = await Product.findAndCountAll(fitlerOBJ);
      if (banner_id && banner_id != 'false' && banner_id != 'undefined' && banner_id != null && banner_id != 'null') {
        SeletedProducts['bannerData'] = OfferBanner;
      }
      if (markets_arr && markets_arr != 'false' && markets_arr != 'undefined') {
        var markets_ids = [];
        for (let i = 0; i < SeletedProducts.rows.length; i++) {
          let newItem = SeletedProducts.rows[i].market[0].id;
          if (markets_ids.indexOf(newItem) === -1) {
            markets_ids.push(newItem);
          }
        }
        var newfitlerOBJ = {where: {}};
        newfitlerOBJ['where']['id'] = {[Sequelize.Op.in]: markets_ids}
        newfitlerOBJ['include'] = ['Image', 'Category', 'City', 'Country', 'safe', 'cover'];
        newfitlerOBJ['include'].push({model: Country, as: 'Country', attributes: ['id', 'name']});
        newfitlerOBJ['include'].push({model: City, as: 'City', attributes: ['id', 'name']});
        newfitlerOBJ['order'] = [['special', 'DESC'], ['order', 'DESC'], ['id', 'DESC']];
        var bannerMarkets = await Market.findAndCountAll(newfitlerOBJ);

        //old code for getting banner markets
        // function pushToArray(arr, obj) {
        //   const index = arr.findIndex((e) => e.id === obj.id);

        //   if (index === -1) {
        //     arr.push(obj);
        //   } else {
        //     arr[index] = obj;
        //   }
        // }
        // var bannerMarkets = [];
        // for (let i = 0; i < SeletedProducts.rows.length; i++) {
        //   pushToArray(bannerMarkets, SeletedProducts.rows[i].market[0]);
        // }

        SeletedProducts['bannerMarkets'] = bannerMarkets['rows'];
      }

      return ResponseService.SuccessResponse(res, 'success for getting the main products', SeletedProducts);
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'there is error when try to get the product', e);
    }
  },
  index_marketDetails: async function (req, res) {
    try {
      var offset = req.param('offset');
      var status = req.param('status');
      var category_id = req.param('category_id');
      var subcategory_id = req.param('subcategory_id');
      var subsubcategory_id = req.param('subsubcategory_id');
      let market_id = req.param('market_id');
      var includeMarket = req.param('include_market');
      let website = req.param('website');

      var fitlerOBJ = {};
      var whereOBJ = {};

      // if ((offset && offset != 'false') || offset === 0) {
      //   fitlerOBJ['offset'] = offset * 15;
      //   fitlerOBJ['limit'] = 15
      // }
      if (website == 'true') {
        fitlerOBJ['order'] = [['special', 'DESC'], ['order', 'DESC'], ['id', 'DESC']]
      }
      if (category_id && category_id != 'false' && category_id != 'undefined') {
        whereOBJ['category_id'] = category_id;
      }
      if (status && status != 'all' && status != 'false') {
        if (status.indexOf(',') > -1) {
          whereOBJ['status'] = status.split(',');
        } else {
          whereOBJ['status'] = status;
        }
      }
      if (subcategory_id && subcategory_id != 'false' && subcategory_id != 'undefined' && subcategory_id != null && subcategory_id != 'null') {
        whereOBJ['subCategory_id'] = subcategory_id;
      }
      if (subsubcategory_id && subsubcategory_id != 'false' && subsubcategory_id != 'undefined' && subsubcategory_id != null && subsubcategory_id != 'null') {
        whereOBJ['subSubCategory_id'] = subsubcategory_id;
      }
      if (market_id && market_id != 'false' && market_id != 'undefined' && market_id != null && market_id != 'null') {
        whereOBJ['owner'] = market_id;
      }
      if (includeMarket && includeMarket != 'false' && includeMarket != 'undefined') {

        // filter products with type of offer and between discount values
        let filterDate = moment().toISOString();
        let offer_where = {};
        offer_where['from'] = {
          [Sequelize.Op.lte]: moment(filterDate).toISOString(),
        }
        offer_where['to'] = {
          [Sequelize.Op.gte]: moment(filterDate).toISOString(),
        }

        let coupon_where = {};
        coupon_where['from'] = {
          [Sequelize.Op.lte]: moment(filterDate).toISOString(),
        }
        coupon_where['to'] = {
          [Sequelize.Op.gte]: moment(filterDate).toISOString(),
        }

        let offer_required = false;
        let coupon_required = false;

        let market_where = {};
        if (market_id && market_id != 'false' && market_id != 'undefined') {
          market_where['id'] = market_id;
        }
        market_where['status'] = 'active';
        console.log(offset);
        whereOBJ['owner'] = {
          [Sequelize.Op.ne]: 'AWSHN'
        };

        fitlerOBJ['include'] = [{
          model: Market,
          as: 'market',
          where: market_where,
          through: {
            // where: {
            //   Showen: true
            // }
          },
          required: true,
          include: [{model: User, as: 'Owner', attributes: ['id', 'name', 'phone']}]
        },
          {
            model: ProductOffer,
            as: 'offer',
            where: offer_where,
            required: offer_required
          },
          {
            model: coupon,
            as: 'coupon',
            where: coupon_where,
            required: coupon_required
          }
        ];
      }
      fitlerOBJ['where'] = whereOBJ;

      fitlerOBJ['order'] = [['category_id', 'DESC'], ['id', 'DESC']]

      var SeletedProducts = await Product.findAndCountAll(fitlerOBJ);
      return ResponseService.SuccessResponse(res, 'success for getting the main products', SeletedProducts);
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'there is error when try to get the product', e);
    }
  },
  index_market: async function (req, res) {
    try {
      var offset = req.param('offset');
      var category_id = req.param('category_id');
      var subcategory_id = req.param('subcategory_id');
      var subsubcategory_id = req.param('subsubcategory_id');
      let market_id = req.param('market_id');

      var fitlerOBJ = {};
      var whereOBJ = {};

      if ((offset && offset != 'false') || offset === 0) {
        fitlerOBJ['offset'] = offset * 30;
        fitlerOBJ['limit'] = 30
      }
      if (category_id && category_id != 'false' && category_id != 'undefined') {
        whereOBJ['category_id'] = category_id;
      }

      if (subcategory_id && subcategory_id != 'false' && subcategory_id != 'undefined' && subcategory_id != null && subcategory_id != 'null') {
        whereOBJ['subCategory_id'] = subcategory_id;
      }
      if (subsubcategory_id && subsubcategory_id != 'false' && subsubcategory_id != 'undefined' && subsubcategory_id != null && subsubcategory_id != 'null') {
        whereOBJ['subSubCategory_id'] = subsubcategory_id;
      }
      if (market_id && market_id != 'false' && market_id != 'undefined' && market_id != null && market_id != 'null') {
        whereOBJ['owner'] = market_id;
      }

      fitlerOBJ['where'] = whereOBJ;

      fitlerOBJ['order'] = [['category_id', 'DESC'], ['id', 'DESC']]

      var SeletedProducts = await Product.findAndCountAll(fitlerOBJ);
      return ResponseService.SuccessResponse(res, 'success for getting the main products', SeletedProducts);
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'there is error when try to get the product', e);
    }
  },
  create: async function (req, res) {
    try {
      var market_id = req.param('market_id');
      var product_type = req.param('product_type');
      var subFor = req.param('sub_for');
      if (market_id && product_type) {
        if (product_type == 'awshn_product') {
          var awhsn_ref = {
            market_id: market_id,
            product_id: req.param('product_id'),
            InnderCode: req.param('inner_code'),
            Selling_price: req.param('selling_price'),
            Purchasing_price: req.param('purchasing_price'),
            Showen: req.param('awshn_display'),
            Expire_date: req.param('expire_date'),
            Tax: req.param('tax'),
            Price_after: req.param('price_after'),
            quantity: req.param('quantity'),
            AwshnCode: randomstring.generate(10)
          }
          let refObject = await Market_Products.create(awhsn_ref);
          return ResponseService.SuccessResponse(res, 'success for ref the awshn product', refObject);
        } else if (product_type == 'new_product') {
          var product_obj = {
            name: req.param('name'),
            description: req.param('description'),
            nationalQr: req.param('national_qr'),
            size: req.param('size'),
            sizeType: req.param('size_type'),
            status: 'active',
            extraInput: req.param('extra_input'),
            owner: market_id,
            category_id: req.param('category_id'),
            subCategory_id: req.param('subCategory_id'),
            subSubCategory_id: req.param('subSubCategory_id'),
            order: req.param('order'),
            special: req.param('special')
          };
          var createdProduct = await Product.create(product_obj);
          if (subFor != 'dontCreate') {
            var market_ref = {
              market_id: market_id,
              InnerCode: req.param('inner_code'),
              Selling_price: req.param('selling_price'),
              Purchasing_price: req.param('purchasing_price'),
              Showen: req.param('awshn_display'),
              Expire_date: req.param('expire_date'),
              Tax: req.param('tax'),
              Price_after: req.param('price_after'),
              quantity: req.param('quantity'),
              AwshnCode: randomstring.generate(10)
            }
            market_ref['product_id'] = createdProduct.id;
            let refObject = await Market_Products.create(market_ref);
          }
          //await Admin.sendNotification('تنبيه منتتج  جديد' , 'هناك منتج جديد بأنتظار التفعيل برجاء تفعيله' , 'product' , 'new');
          var product_images = req.param('images');
          if (product_images.length <= 0) {
            return ResponseService.SuccessResponse(res, 'the product has been created successfully pleas wait untill begin approved');
          }
          for (let i = 0; i < product_images.length; i++) {
            var image = product_images[i];
            var Finalimage = await sails.helpers.uploadImage(image.base64, createdProduct.name, image.alt, image.description, 'product',image.width, image.heigh, {isProduct: true});
            await ProductImages.create({
              product_id: createdProduct.id,
              ImageId: Finalimage.id
            });
            if (i == product_images.length - 1) {
              return ResponseService.SuccessResponse(res, 'the product has been created successfully pleas wait untill begin approved');
            }
          }
        }
      } else {
        console.log('error');
        return ResponseService.ErrorResponse(res, 'please provide the market id and the product type');
      }
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'something wrong happen when create the product', e);
    }
  },
  delete: async function (req, res) {
    try {
      var product_id = req.param('product_id');
      var market_id = req.param('market_id');
      var DeleteType = req.param('delete_type');
      if (product_id) {
        if (DeleteType == 'market_ref') {
          if (!market_id) {
            return ResponseService.ErrorResponse(res, 'please provide market id');
          }
          var selected_product = await Product.findOne({
            where: {
              id: product_id
            }
          });
          if (selected_product.owner != 'AWSHN') {
            await selected_product.destroy();
          }
          var market_product = await Market_Products.findOne({
            where: {
              product_id: product_id,
              market_id: market_id
            }
          });
          // await User.sendNotification('تنبيه' , 'لقد تم مسح المنتج الخاص بك بنجاح' , 'product' , 'deleted' , '' , market_id);
          await market_product.destroy();
          return ResponseService.SuccessResponse(res, 'success for delete the market ref', market_product);
        } else if (DeleteType == 'awshn_main') {
          var seletedProduct = await Product.findOne({
            where: {
              id: product_id
            }
          });
          await seletedProduct.destroy();
          return ResponseService.SuccessResponse(res, 'success for delete the awshn main product', seletedProduct);
        }
      } else {
        return ResponseService.ErrorResponse(res, 'please provide the product id');
      }
    } catch (e) {
      //// console.log(e);
      return ResponseService.ErrorResponse(res, 'there is error when try to delete the product', e);
    }
  },
  edit: async function (req, res) {
    try {
      var product_obj = req.allParams();
      if ((product_obj.owner == 'AWSHN' && product_obj.role == 'admin') ||
        (product_obj.main_owner == 'alaunna' && product_obj.role == 'admin') ||
        (product_obj.owner != 'AWSHN' && product_obj.main_owner != 'alaunna')) {
        var selected_product = await Product.findOne({
          where: {
            id: product_obj.id
          }
        });
        // if (product_obj.role != 'admin'){
        //   product_obj['status'] = 'pending';
        // }

        await selected_product.update(product_obj);
        //await selected_product.save();
        await updateProductImages(product_obj.images, product_obj.id, product_obj.name);
      }
      if (product_obj['market'] && product_obj['market'][0] && product_obj['market'][0]['Market_Products']) {
        product_obj['Market_Products'] = product_obj['market'][0]['Market_Products'];
      }
      if (product_obj['Market_Products']) {
        console.log(product_obj['Market_Products'], product_obj['id']);
        var market_Ref = await Market_Products.findOne({
          where: {
            market_id: product_obj['Market_Products']['market_id'],
            product_id: product_obj['id']
          }
        });
        if (product_obj.role == 'admin') {
          // await User.sendNotification('تنبيه' , `لقد تم تعديل بيانات المنتج رقم ${product_obj.id} من قبل مسئول` , 'product' , 'edited' , '' , product_obj['Market_Products']['market_id']);
        } else {
          // await Admin.sendNotification('تنبيه'  ,`هناك منتج حمل رقم ${product_obj.id} تم تعديله برجاء مراجعه المنتج` , 'product' , 'edited');
        }
        await market_Ref.update(product_obj['Market_Products']);
      }
      // update product Images
      if (product_obj.images.length == 0) {
        return ResponseService.SuccessResponse(res, 'the product edited successfully', product_obj);
      }
      return ResponseService.SuccessResponse(res, 'success for editing the product images sucessfully');
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when edit the product', e);
    }
  },
  search: async function (req, res) {
    try {
      if (!req.isSocket) {
        return ResponseService.ErrorResponse(res, 'please connect to this function using sails socket');
      }
      var serachingWord = req.param('word');
      //sails.sockets.join(req, 'general');
      var SeletedProducts = await Product.findAndCountAll({
        where: {
          name: {
            [Sequelize.Op.like]: `%${serachingWord}%`
          }
        }
      });
      //sails.sockets.broadcast('general', 'product_search', SeletedProducts);
      return ResponseService.SuccessResponse(res, 'data has been retevied', SeletedProducts);
    } catch (e) {
      //// console.log(e);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when get product data', e);
    }
  },
  getMarketProductsNoOffer: async function (req, res) {
    try {
      let params = req.allParams();
      var market_id = req.param('market_id');
      let filterOBJ = {};
      let whereOBJ = {};
      whereOBJ['owner'] = market_id;
      whereOBJ['offer_id'] = null;
      filterOBJ['where'] = whereOBJ;
      let market_where = {};
      if (market_id && market_id != 'false' && market_id != 'undefined') {
        market_where['id'] = market_id;
      }
      filterOBJ['include'] = [{
        model: Market,
        as: 'market',
        where: market_where,
        through: {
          // where: {
          //   Showen: true
          // }
        },
        required: true,
        include: [{model: User, as: 'Owner', attributes: ['id', 'name', 'phone']}]
      }];
      var userProducts = await Product.findAndCountAll(filterOBJ);
      return ResponseService.SuccessResponse(res, 'success for getting the Market products has no Offer', userProducts);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen when getting the Market products has no Offer', {
        error: err,
        action: 'unkown-error'
      });
    }
  },
  getMarketProductsNoOfferWithOffer: async function (req, res) {
    try {
      let params = req.allParams();
      var market_id = req.param('market_id');
      var offer_id = req.param('offer_id');
      let filterOBJ = {};

      filterOBJ['where'] = Sequelize.and(
        {owner: market_id},
        Sequelize.or(
          {offer_id: offer_id},
          {offer_id: null}
        )
      );
      let market_where = {};
      if (market_id && market_id != 'false' && market_id != 'undefined') {
        market_where['id'] = market_id;
      }
      filterOBJ['include'] = [{
        model: Market,
        as: 'market',
        where: market_where,
        through: {
          // where: {
          //   Showen: true
          // }
        },
        required: true,
        include: [{model: User, as: 'Owner', attributes: ['id', 'name', 'phone']}]
      }];
      var userProducts = await Product.findAndCountAll(filterOBJ);
      var selectedproducts = [];
      for (let i = 0; i < userProducts.rows.length; i++) {
        if (userProducts.rows[i].offer_id == offer_id) {
          selectedproducts.push(userProducts.rows[i].id);
        }
      }
      userProducts['selectedproducts'] = selectedproducts;
      return ResponseService.SuccessResponse(res, 'success for getting the Market products has no Offer', userProducts);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen when getting the Market products has no Offer', {
        error: err,
        action: 'unkown-error'
      });
    }
  },
  getMarketProducts: async function (req, res) {
    try {
      var market_id = req.param('market_id');
      var offset = req.param('offset');
      var asExcel = req.param('as_ecxel');
      var fitlerOBJ = {};
      if (market_id) {
        if (offset) {
          fitlerOBJ['offset'] = offset * 10;
          fitlerOBJ['limit'] = 10;
        }
        var SelectedMarket = await Market.findOne({
          where: {
            id: market_id
          }
        });
        var SelectdProducts = await SelectedMarket.getProducts(fitlerOBJ);
        if (asExcel) {
          var JsonObj = JSON.parse(JSON.stringify(SelectdProducts));
          var filename = await sails.helpers.exportMarketDataAsExcel(JsonObj);
          return ResponseService.SuccessResponse(res, 'success for getting the market products', {
            fileName: filename + '.xlsx'
          });
        } else {
          return ResponseService.SuccessResponse(res, 'success for getting the market products', SelectdProducts);
        }
      } else {
        return ResponseService.ErrorResponse(res, 'please provide the market id');
      }
    } catch (e) {
      //// console.log(e);
      return ResponseService.ErrorResponse(res, 'something wrong happen when get  the market products', e);
    }
  },
  ReadAwshnProducts: async function (req, res) {
    try {
      var file = req.file('uploadFile');
      file.upload(async function (err, uploadFiles) {
        if (err) {
          return ResponseService.ErrorResponse(res, 'please enter a valid file', {
            action: 'invalid-file'
          });
        }
        var workbook = XLSX.readFile(uploadFiles[0].fd);
        var sheet_name_list = workbook.SheetNames;
        data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        if (data.length == 0) {
          return ResponseService.ErrorResponse(res, 'please enter a data in the excel file', {
            action: 'invalid-data'
          });
        }
        for (var key in data) {
          var product_obj = {
            name: data[key]['الاسم'],
            description: data[key]['الوصف'],
            status: 'active',
            nationalQr: data[key]['الكود الدولي'],
            size: data[key]['الحجم'],
            sizeType: data[key]['نوع الحجم'],
            owner: "AWSHN",
            category_id: data[key]['رقم التصنيف'],
            subCategory_id: data[key]['رقم الفئه'],
            subSubCategory_id: data[key]['رقم الفئه الفرعيه'],
          }
          await Product.create(product_obj);
        }
        return ResponseService.SuccessResponse(res, 'success for creating the products from excel seheet', {});
      })
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen when add new proudcts', e);
    }
  },
  ReadSellerProducts: async function (req, res) {
    req.file('excelFile').upload({
      maxBytes: 10000000
    }, function whenDone(err, uploadedFiles) {
      if (err) {
        return ResponseService.ErrorResponse(res, 'the file cannot be uploaded', err);
      }
      if (uploadedFiles.length === 0) {
        return ResponseService.ErrorResponse(res, 'no file to upload');
      }
      require('fs').readFile(uploadedFiles[0].fd, 'utf8', function (err, data) {
        if (err) {
          return ResponseService.ErrorResponse(res, 'the file cannot be read', err);
        }
        return ResponseService.SuccessResponse(res, 'the file uploaded successfully');
      })
    });
  },
  changeProductStatus: async function (req, res) {
    try {
      var product_id = req.param('product_id');
      var status = req.param('status');
      if (status != 'active' && status != 'not_active' && status != 'pending') {
        return ResponseService.ErrorResponse(res, 'please enter a vaild status active or not_active or pending');
      }
      if (product_id && status) {
        var selectedProduct = await Product.findOne({
          where: {
            id: product_id
          }, include: ['market']
        });
        selectedProduct.status = status;
        // await User.sendNotification('تنبيه' , `لقد تمتغير حاله المنتج الخاص بك والذي يجمل رقم ${product_id}` , 'product' , 'status' , '' , selectedProduct.market[0].id);
        selectedProduct.save();
        return ResponseService.SuccessResponse(res, 'success for changeing the product status', selectedProduct);
      } else {
        return ResponseService.ErrorResponse(res, 'please provide the product id and status');
      }
    } catch (e) {
      //// console.log(e);
      return ResponseService.ErrorResponse(res, 'something wrong happen when get  the market products', e);
    }
  },
  AddAwshnProductsToMarket: async function (req, res) {
    try {
      var products = req.param('products');

      if (!products || !products.length) {
        return ResponseService.ErrorResponse(res, 'please provide some products', {action: 'invalid-products'});
      }
      var CreatedPRoducts = [];
      for (let i = 0; i < products.length; i++) {
        var ProductsIndex = products[i];
        ProductsIndex['market_product']['AwshnCode'] = randomstring.generate(6);
        ProductsIndex['owner'] = ProductsIndex['market_product']['market_id'];
        ProductsIndex['main_owner'] = 'alaunna';
        ProductsIndex['status'] = 'active';
        let CreatedProduct = await Product.create(ProductsIndex);

        for (let j = 0; j < ProductsIndex['images'].length; j++) {
          let image = await Image.create({
            name: ProductsIndex['images'][j]['name'],
            for: ProductsIndex['images'][j]['for'],
            alt: 'alaunna product',
            description: 'allaunna product'
          });
          await ProductImages.create({product_id: CreatedProduct.id, ImageId: image.id});
        }
        ProductsIndex['market_product']['product_id'] = CreatedProduct.id;
        var CreatedAwshnREf = await Market_Products.create(ProductsIndex['market_product']);
        CreatedPRoducts.push(CreatedAwshnREf);
        if (i == products.length - 1) {
          return ResponseService.SuccessResponse(res, 'success for adding the products to market', CreatedPRoducts);
        }
      }
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'somthin wrong happen when adding the products to market', e);
    }
  },
  readMarketProductAsPDf: async function (req, res) {
    try {
      var market_id = req.param('market_id');
      var from = req.param('from');
      var to = req.param('to');

      from = new Date(from);
      to = new Date(to);
      to.setHours(22);

      var fitlerOBJ = {};
      var SelectedMarket = await Market.findOne({
        where: {
          id: market_id
        }
      });
      var SelectdProducts = await SelectedMarket.getProducts(fitlerOBJ);
      var SelectedProductSaales = await ProductSales.findAll({
        where: {
          market_id: market_id,
          createdAt: {
            [Sequelize.Op.gte]: from,
            [Sequelize.Op.lte]: to
          }
        }
      });
      let body = [];
      let total = 0;
      for (let i = 0; i < SelectdProducts.length; i++) {
        var quantityCounter = 0;
        for (let j = 0; j < SelectedProductSaales.length; j++) {
          //// console.log(SelectedProductSaales[j])
          if (SelectdProducts[i].id == SelectedProductSaales[j].product_id) {

            quantityCounter += SelectedProductSaales[i].quantity;
          }
        }
        var total_quantity = parseFloat(SelectdProducts[i]['Market_Products']['quantity']) + parseFloat(quantityCounter);
        body.push({
          id: SelectdProducts[i]['nationalQr'],
          name: SelectdProducts[i].name,
          store_quantity: SelectdProducts[i]['Market_Products']['quantity'],
          sales_quantity: quantityCounter,
          total_quantity: total_quantity,
          purchases_price: SelectdProducts[i]['Market_Products']['Purchasing_price'],
          total_price: parseFloat(SelectdProducts[i]['Market_Products']['Purchasing_price']) * total_quantity
        });
        total += parseFloat(SelectdProducts[i]['Market_Products']['Purchasing_price']) * total_quantity;
      }
      // Genrate the fucken pdf
      generatePDf(body, total, from, to).then(result => {
        return ResponseService.SuccessResponse(res, 'done for create the file', {
          filename: fileName
        });
      }).catch(err => {
        ////// console.log(err);
        return ResponseService.ErrorResponse(res, 'somthing wrong happen when creating the pdf', err);
      });
    } catch (err) {
      ////// console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when creating the pdf', err);
    }
  },
  getProductById: async function (req, res) {
    try {
      var id = req.param('id');
      if (!id) {
        return ResponseService.ErrorResponse(res, 'please provide product id', {
          action: 'invalid-id'
        });
      }
      let filterDate = moment().toISOString();
      let SelectdProduct = await Product.findOne({
        where: {
          id: id
        },
        include: [{
          model: Market,
          as: 'market',
          // through: {
          //   where: {
          //     Showen: true
          //   }
          // },
          required: true,
          include: [{model: User, as: 'Owner', attributes: ['id', 'name', 'phone']}]
        },
          {
            model: ProductOffer,
            as: 'offer',
            where: {
              from: {
                [Sequelize.Op.lte]: filterDate
              },
              to: {
                [Sequelize.Op.gte]: filterDate
              }
            },
            required: false
          },
          {
            model: coupon,
            as: 'coupon',
            where: {
              from: {
                [Sequelize.Op.lte]: filterDate
              },
              to: {
                [Sequelize.Op.gte]: filterDate
              }
            },
            required: false
          }]
      });
      return ResponseService.SuccessResponse(res, 'success for getting all data about product', SelectdProduct);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when get the product data', {
        action: 'invalid-error',
        error: err
      });
    }
  },
  readProductsAsExcel: async function (req, res) {
    try {
      var file = req.file('uploadFile');
      let market_categry = req.param('market_category');
      let market_id = req.param('market_id');

      // console.log(market_id);
      // console.log(market_categry);
      file.upload(async function (err, uploadFiles) {

        if (err) {
          // console.log(err);
          return ResponseService.ErrorResponse(res, 'please enter a valid file', {
            action: 'invalid-file',
            error: err
          });
        }
        var workbook = XLSX.readFile(uploadFiles[0].fd);
        var sheet_name_list = workbook.SheetNames;
        data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        if (data.length == 0) {
          return ResponseService.ErrorResponse(res, 'please enter a data in the excel file', {
            action: 'invalid-data'
          });
        }
        for (var key in data) {
          var product_obj = {
            name: data[key]['الاسم'],
            description: data[key]['الوصف'],
            status: 'active',
            nationalQr: data[key]['الكود الدولي'],
            size: data[key]['الحجم'],
            sizeType: data[key]['نوع الحجم'],
            owner: market_id,
            category_id: market_categry,
            subCategory_id: data[key]['رقم الفئه'],
            subSubCategory_id: data[key]['رقم الفئه الفرعيه'],
          };
          var market_ref = {
            market_id: market_id,
            InnerCode: data[key]['الكود الداخلي'],
            Selling_price: data[key]['سعر البيع'],
            Purchasing_price: data[key]['سعر الشراء'],
            Showen: data[key]['عرض علي الموقع والتطبيق'],
            Expire_date: data[key]['تاريخ انتهاء الصلاحيه'],
            Tax: data[key]['الضريبه'],
            Price_after: data[key]['السعر بعد الخصم'],
            quantity: data[key]['الكيمه'],
            AwshnCode: randomstring.generate(10)
          }
          let credate_product = await Product.create(product_obj);
          market_ref['product_id'] = credate_product.id;
          let refObject = await Market_Products.create(market_ref);
        }
        return ResponseService.SuccessResponse(res, 'success for creating the products from excel seheet', {});
      })
    } catch (err) {

      return ResponseService.ErrorResponse(res, 'something wrong happen when add new proudcts', e);
    }
  },
  getAwshnProducts: async function (req, res) {
    try {
      let offset = req.param('offset');
      let category_id = req.param('category_id');
      let subcategory_id = req.param('subcategory_id');
      let subsubcategory_id = req.param('subsubcategory_id');
      let name = req.param('name');
      let filterOBJ = {
        where: {}
      };
      if (offset && offset != 'false' || offset == 0) {
        filterOBJ['offset'] = offset * 10;
        filterOBJ['limit'] = 10;
      }
      if (category_id && category_id != 'false') {
        filterOBJ['where']['category_id'] = category_id;
      }
      if (subcategory_id && subcategory_id != 'false') {
        filterOBJ['where']['subCategory_id'] = subcategory_id;
      }
      if (subsubcategory_id && subsubcategory_id != 'false') {
        filterOBJ['where']['subSubCategory_id'] = subsubcategory_id;
      }
      if (name) {
        filterOBJ['where']['name'] = {$like: `%${name}%`}
      }
      filterOBJ['where']['owner'] = 'AWSHN';
      let SelectedProducts = await Product.findAll(filterOBJ);
      return ResponseService.SuccessResponse(res, 'success for getting all awhsn products', SelectedProducts);
    } catch (err) {
      // console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when trying to get the awshn products', err);
    }
  },
  ReadMultibleProducts: async function (req, res) {
    try {
      var products = req.allParams()['products'];
      if (!products.length) {
        return ResponseService.ErrorResponse(res, 'please provide the products to add it', {
          action: 'invalid-data'
        });
      }
      for (let i = 0; i < products.length; i++) {
        let element = products[i];
        element['owner'] = element['market_id'];
        let CreatedProduct = await Product.create(element);
        element['product_id'] = CreatedProduct.id;
        element['AwshnCode'] = randomstring.generate(10);
        await Market_Products.create(element);
      }
      return ResponseService.SuccessResponse(res, 'success for creating the products', products);
    } catch (err) {
      // console.log(err);
      return ResponseService.ErrorResponse(res, 'somthign wrong happen when create the product', err);
    }
  },
  sortMultiple: async function (req, res) {
    try {
      var products = req.param('products');
      var sort = req.param('sort');
      // update multiple items
      Product.update(
        {
          order: sort
        },
        {
          where: {
            id: products
          }
        }
      );
      return ResponseService.SuccessResponse(res, 'success for sorting products');

    } catch (e) {
      //// console.log(e);
      return ResponseService.ErrorResponse(res, 'something wrong happen when sorting products', e);
    }
  }
};
