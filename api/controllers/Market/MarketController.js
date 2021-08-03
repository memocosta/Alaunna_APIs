/**
 * MarketController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var randomstring = require('randomstring');
var fs = require("fs");
var pdf = require("dynamic-html-pdf");
var html = fs.readFileSync("./assets/templates/profit.html", "utf8");
var fileName;

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
  }
  today = yyyy + "-" + mm + "-" + dd;
  return today;
}
var generatePDf = async function (profits, total_profits, from, to) {
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
      profits: profits,
      todayDate: getDate(),
      from: getDate(from),
      to: getDate(to),
      total_profits: total_profits
    },
    path: "./.tmp/public/pdf/" + fileName // it is not required if type is buffer
  };
  return pdf.create(document, options);
};

const XLSX = require('xlsx');
module.exports = {
  create: async function (req, res) {
    try {
      var marketOBJ = {
        name: req.param('name'),
        lat: req.param('lat'),
        lng: req.param('lng'),
        address: req.param('address'),
        marketcategory_id: req.param('marketcategory_id'),
        City_id: req.param('City_id'),
        Country_id: req.param('Country_id'),
        Owner_id: req.param('Owner_id'),
        cover: req.param('cover'),
        class: req.param('class'),
        phone: req.param('phone'),
        delivery_type: req.param('delivery_type'),
        delivery_terms: req.param('delivery_terms'),
        delivery_cost: req.param('delivery_cost'),
        status: 'active'
      };
      var categories_ids = [];

      if (marketOBJ.marketcategory_id && marketOBJ.marketcategory_id.length) {
        categories_ids = marketOBJ.marketcategory_id;
        marketOBJ.marketcategory_id = marketOBJ.marketcategory_id[0];
      }
      if (marketOBJ.name && marketOBJ.marketcategory_id && marketOBJ.address && marketOBJ.Owner_id) {
        var MarketLogo = req.param('image');
        var SelletOBJ = await Seller.findOne({
          where: {
            user_id: marketOBJ.Owner_id
          }
        });
        SelletOBJ.NumberOfMarkets++;
        await SelletOBJ.save();
        if (MarketLogo) {
          let image = await sails.helpers.uploadImage(MarketLogo.base64, marketOBJ.name, MarketLogo.alt, MarketLogo.description, 'market/logo', 220, 220, {isMarketLogo: true});
          marketOBJ['image_id'] = image.id;
        }
        if (marketOBJ.cover) {
          let image = await sails.helpers.uploadImage(marketOBJ.cover.base64, marketOBJ.name, marketOBJ.cover.alt, marketOBJ.cover.description, 'market/cover', 1024, 512, {isMarketCover: true});
          marketOBJ['cover_id'] = image.id;
        }

        let createdMarket = await Market.create(marketOBJ);
        if (req.param('marketcategory_id') && req.param('marketcategory_id').length) {
          for (let i = 0; i < categories_ids.length; i++) {
            await MarketCategory.create({
              market_id: createdMarket.id,
              category_id: categories_ids[i]
            });
          }
        }
        let CreatedSafe = await Safe.create({
          market_id: createdMarket.id
        });
        var CreatedMarketJSON = createdMarket['dataValues'];
        CreatedMarketJSON['safe'] = CreatedSafe;
        //await Admin.sendNotification('تنبيه متجر جديد', `هناك متجر يمتك رقم ${marketOBJ.id} ورقم ${marketOBJ.name} تم اضافته مؤاخرا ويجب مراجعته`, 'market', 'new');
        return ResponseService.SuccessResponse(res, 'success creating a new market', createdMarket);
      } else {
        return ResponseService.ErrorResponse(res, 'please provide the market data right now');
      }
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when create market', e);
    }
  },
  delete: async function (req, res) {
    try {
      var market_id = req.param('id');
      if (market_id) {
        var DeletedMarket = await Market.findOne({
          where: {
            id: market_id
          }
        });
        await DeletedMarket.destroy();
        await Safe.destroy({
          where: {
            market_id: DeletedMarket.id
          }
        });
        // await User.sendNotification('تنبيه', 'لقد تم مسح المتجر الخاص بك بنجاح', 'market', 'deleted', '', DeletedMarket.id);
        return ResponseService.SuccessResponse(res, 'the market deleted successfully', DeletedMarket);
      } else {
        return ResponseService.ErrorResponse(res, 'please provide the market id');
      }
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when delete market', e);
    }
  },
  edit: async function (req, res) {
    try {
      var marketOBJ = req.allParams();
      if (marketOBJ.id) {
        var SelectedMarket = await Market.findOne({
          where: {
            id: marketOBJ.id
          }
        });
        var categories_ids = [];
        if (marketOBJ.marketcategory_id && marketOBJ.marketcategory_id.length) {
          categories_ids = marketOBJ.marketcategory_id;
          marketOBJ.marketcategory_id = marketOBJ.marketcategory_id[0];
        }
        // update the market logo
        if (marketOBJ.Image && marketOBJ.Image.action == 'edited') {
          await sails.helpers.updateImage(marketOBJ.Image.id, marketOBJ.Image.base64, marketOBJ.Image.alt, marketOBJ.Image.description, 220, 220, {isMarketLogo: true});
        } else if (marketOBJ.Image && marketOBJ.Image.action == 'new') {
          var image = await sails.helpers.uploadImage(marketOBJ.Image.base64, marketOBJ.title, marketOBJ.Image.alt, marketOBJ.Image.description, 'market/logo', 220, 220, {isMarketLogo: true});
          marketOBJ['image_id'] = image.id;
        } else if (marketOBJ.Image) {
          await Image.update({
            alt: marketOBJ.Image.alt,
            description: marketOBJ.Image.description
          }, {where: {id: marketOBJ.Image.id}});
        }
        // update the marekt cover
        if (marketOBJ.cover && marketOBJ.cover.action == 'edited') {
          await sails.helpers.updateImage(marketOBJ.cover.id, marketOBJ.cover.base64, marketOBJ.cover.alt, marketOBJ.cover.description, 1024, 512, {isMarketCover: true});
        } else if (marketOBJ.cover && marketOBJ.cover.action == 'new') {
          var image = await sails.helpers.uploadImage(marketOBJ.cover.base64, marketOBJ.title, marketOBJ.cover.alt, marketOBJ.cover.description, 'market/cover', 1024, 512, {isMarketCover: true});
          marketOBJ['cover_id'] = image.id;
        } else if (marketOBJ.cover) {
          await Image.update({
            alt: marketOBJ.cover.alt,
            description: marketOBJ.cover.description
          }, {where: {id: marketOBJ.cover.id}});
        }


        // if (marketOBJ.role == 'admin') {
        //   // await User.sendNotification('تنبيه', 'لقد تم تعديل المتجر الخاص بك بنجاح', 'market', 'edited', '', marketOBJ.id);
        // } else {
        //   await Admin.sendNotification('تنبيه', `لقد تم تعديل المتجر الذي يمتلك اسم ${marketOBJ.name} رقم المتجر ${marketOBJ.id}`, 'market', 'edited');
        // }
        await SelectedMarket.update(marketOBJ);

        if (req.param('marketcategory_id') && req.param('marketcategory_id').length) {
          await MarketCategory.destroy({
            where: {
              market_id: SelectedMarket.id
            }
          });
          for (let i = 0; i < categories_ids.length; i++) {
            await MarketCategory.create({
              market_id: SelectedMarket.id,
              category_id: categories_ids[i]
            });
          }
        }
        return ResponseService.SuccessResponse(res, 'update the market data successfully', SelectedMarket);
      } else {
        return ResponseService.ErrorResponse(res, 'please provide market id');
      }
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when edit the market', e);
    }
  },
  sendnotimarket: async function (req, res) {
    try {
      var fitlerOBJ = {where: {}};
      fitlerOBJ['include'] = [{
        model: User.scope('DontInclude'),
        as: 'Owner',
        attributes: ['name', 'id', 'phone','device_id'],
        include: []
      }];
      var markets = await Market.findAndCountAll(fitlerOBJ);
      var marketOBJ = req.allParams();
// console.log(markets);
      for (let i = 0; i < markets.rows.length; i++) {
        if (markets.rows[i].views != markets.rows[i].views_old && markets.rows[i].Owner) {

          if (markets.rows[i].Owner.device_id) {
            console.log(markets.rows[i].Owner.id);
            let notificationOBJ = {
              token: markets.rows[i].Owner.device_id,
              body: 'There are ' + (markets.rows[i].views - markets.rows[i].views_old) + ' views for today',
              type: 'views market',
            };
            await sails.helpers.firebase.with(notificationOBJ);

            var SelectedMarket = await Market.findOne({
              where: {
                id: markets.rows[i].id
              }
            });
            marketOBJ['views_old'] = markets.rows[i].views;
            await SelectedMarket.update(marketOBJ);
          }
        }
      }

      return ResponseService.SuccessResponse(res, 'success send notification');
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen', {action: 'unkown-err', error: err})
    }
  },
  edit_main_data: async function (req, res) {
    try {
      var marketOBJ = req.allParams();
      if (marketOBJ.id) {
        var SelectedMarket = await Market.findOne({
          where: {
            id: marketOBJ.id
          }
        });

        // update the market logo
        if (marketOBJ.Image && marketOBJ.Image.action == 'edited') {
          await sails.helpers.updateImage(marketOBJ.Image.id, marketOBJ.Image.base64, marketOBJ.Image.alt, marketOBJ.Image.description, 220, 220, {isMarketLogo: true});
        } else if (marketOBJ.Image && marketOBJ.Image.action == 'new') {
          var image = await sails.helpers.uploadImage(marketOBJ.Image.base64, marketOBJ.title, marketOBJ.Image.alt, marketOBJ.Image.description, 'market/logo', 220, 220, {isMarketLogo: true});
          marketOBJ['image_id'] = image.id;
        } else if (marketOBJ.Image) {
          await Image.update({
            alt: marketOBJ.Image.alt,
            description: marketOBJ.Image.description
          }, {where: {id: marketOBJ.Image.id}});
        }
        // update the marekt cover
        if (marketOBJ.cover && marketOBJ.cover.action == 'edited') {
          await sails.helpers.updateImage(marketOBJ.cover.id, marketOBJ.cover.base64, marketOBJ.cover.alt, marketOBJ.cover.description, 1024, 512, {isMarketCover: true});
        } else if (marketOBJ.cover && marketOBJ.cover.action == 'new') {
          var image = await sails.helpers.uploadImage(marketOBJ.cover.base64, marketOBJ.title, marketOBJ.cover.alt, marketOBJ.cover.description, 'market/cover', 1024, 512, {isMarketCover: true});
          marketOBJ['cover_id'] = image.id;
        } else if (marketOBJ.cover) {
          await Image.update({
            alt: marketOBJ.cover.alt,
            description: marketOBJ.cover.description
          }, {where: {id: marketOBJ.cover.id}});
        }


        if (marketOBJ.role == 'admin') {
          // await User.sendNotification('تنبيه', 'لقد تم تعديل المتجر الخاص بك بنجاح', 'market', 'edited', '', marketOBJ.id);
        } else {
          await Admin.sendNotification('تنبيه', `لقد تم تعديل المتجر الذي يمتلك اسم ${marketOBJ.name} رقم المتجر ${marketOBJ.id}`, 'market', 'edited');
        }
        await SelectedMarket.update(marketOBJ);
        return ResponseService.SuccessResponse(res, 'update the market data successfully', SelectedMarket);
      } else {
        return ResponseService.ErrorResponse(res, 'please provide market id');
      }
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when edit the market', e);
    }
  },
  getAllMarkets: async function (req, res) {
    try {
      var offset = req.param('offset');
      var seller_id = req.param('seller_id');
      var attribute = req.param('attr');
      let category_id = req.param('category_id');
      let city_id = req.param('city_id');
      let country_id = req.param('country_id');
      let status = req.param('status');
      let searchword = req.param('word');
      let special = req.param('special');
      let start = req.param('start');
      let end = req.param('end');
      let sort = req.param('sort');
      var fitlerOBJ = {where: {}};

      if (attribute && attribute != 'false') {
        fitlerOBJ['attributes'] = attribute.split(',');
      }
      if ((offset && offset != 'false') || offset == 0) {
        console.log(offset);
        fitlerOBJ['offset'] = offset * 10;
        fitlerOBJ['limit'] = 10;
      }
      if (seller_id) {
        fitlerOBJ['where']['Owner_id'] = seller_id
        fitlerOBJ['include'] = ['Image', 'Category', 'City', 'Country', 'safe', 'cover'];
      } else {
        fitlerOBJ['include'] = ['Image', 'safe', 'offers', 'cover', {
          model: User.scope('DontInclude'),
          as: 'Owner',
          attributes: ['name', 'id', 'phone'],
          include: []
        }];
      }
      if (category_id && category_id != 'false') {
        fitlerOBJ['where']['marketcategory_id'] = category_id;
      }
      if (city_id && city_id != 'false') {
        fitlerOBJ['where']['City_id'] = city_id;
      }
      if (country_id && country_id != 'false') {
        fitlerOBJ['where']['Country_id'] = country_id;
      }
      if (status && status != 'false' && status != 'all') {
        if (status.indexOf(',') > -1) {
          fitlerOBJ['where']['status'] = status.split(',');
        } else {
          fitlerOBJ['where']['status'] = status;
        }
      } else if (status != 'all') {
        fitlerOBJ['where']['status'] = 'active';
      }

      if (searchword && searchword != 'false') {
        fitlerOBJ['where']['name'] = {[Sequelize.Op.like]: `%${searchword}%`}
      }

      if (special) {
        fitlerOBJ['where']['special'] = special == 'false' ? false : true;
      }

      if (start && start != 'false' && end && end != 'false') {
        start = new Date(start);
        end = new Date(end);
        end.setDate(end.getDate() + 1)
        fitlerOBJ['where']['createdAt'] = {
          [Sequelize.Op.gte]: start,
          [Sequelize.Op.lte]: end
        };
      }

      fitlerOBJ['include'].push({model: Country, as: 'Country', attributes: ['id', 'name']});
      fitlerOBJ['include'].push({model: City, as: 'City', attributes: ['id', 'name']});

      if (sort == 'order') {
        fitlerOBJ['order'] = [['order', 'DESC']]
      } else {
        fitlerOBJ['order'] = [['special', 'DESC'], ['order', 'DESC'], ['id', 'DESC']]
      }

      var SelectedMarket = await Market.findAndCountAll(fitlerOBJ);
      return ResponseService.SuccessResponse(res, 'success getting all markets', SelectedMarket);
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when fetch the market', e);
    }
  },
  changeMarketStatus: async function (req, res) {
    try {
      var market_id = req.param('market_id');
      var status = req.param('status');
      if (market_id && status) {
        var SelectedMarket = await Market.findOne({
          where: {
            id: market_id
          }
        });
        SelectedMarket.status = status;
        SelectedMarket.save();
        // await User.sendNotification('تنبيه', 'لقد تم تغير حاله المتجر الخاص بك', 'market', 'status-changed', '', SelectedMarket.id);
        return ResponseService.SuccessResponse(res, 'success for change the status of the maket', SelectedMarket);
      } else {
        return ResponseService.ErrorResponse(res, 'please provide the market id and status');
      }
    } catch (e) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when change the market status', e);
    }
  },
  change_col: async function (req, res) {
    try {
      var market_id = req.param('market_id');
      var online_payment = req.param('online_payment');
      var cash_on_delivery = req.param('cash_on_delivery');
      var alaunna_shipping = req.param('alaunna_shipping');
      if (market_id) {
        var SelectedMarket = await Market.findOne({
          where: {
            id: market_id
          }
        });
        if (online_payment != null) {
          SelectedMarket.online_payment = parseInt(online_payment);
        }
        if (cash_on_delivery != null) {
          SelectedMarket.cash_on_delivery = parseInt(cash_on_delivery);
        }
        if (alaunna_shipping != null) {
          SelectedMarket.alaunna_shipping = parseInt(alaunna_shipping);
        }
        SelectedMarket.save();
        // await User.sendNotification('تنبيه', 'لقد تم تغير حاله المتجر الخاص بك', 'market', 'status-changed', '', SelectedMarket.id);
        return ResponseService.SuccessResponse(res, 'success for change the market', SelectedMarket);
      } else {
        return ResponseService.ErrorResponse(res, 'please provide the market id and status');
      }
    } catch (e) {
      return ResponseService.ErrorResponse(res, 'something wrong happen when change the market status', e);
    }
  },
  ProfitasPDF: async function (req, res) {
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
      var body = [];
      var total_profit = 0;
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
      for (let i = 0; i < SelectdProducts.length; i++) {

        let curentProductPurchasesPrice = 0;
        let curentProductSalesPrice = 0;
        let salesQuantityCounter = 0;
        for (let j = 0; j < SelectedProductSaales.length; j++) {
          if (SelectdProducts[i].id == SelectedProductSaales[j].product_id) {
            curentProductSalesPrice += (parseFloat(SelectedProductSaales[j].quantity) * parseFloat(SelectedProductSaales[j].price));
            salesQuantityCounter += SelectedProductSaales[j].quantity;
          }
        }
        curentProductPurchasesPrice = (salesQuantityCounter * SelectdProducts[i]['Market_Products']['Purchasing_price']);
        var profit = curentProductSalesPrice - curentProductPurchasesPrice
        body.push({
          name: SelectdProducts[i].name,
          cost: curentProductPurchasesPrice,
          sales_quantity: salesQuantityCounter,
          sales_price: curentProductSalesPrice,
          profit: profit
        });
        total_profit += profit;
      }
      generatePDf(body, total_profit, from, to).then(result => {
        return ResponseService.SuccessResponse(res, 'success for creating the file', {
          filename: fileName
        });
      }).catch(err => {
        return ResponseService.ErrorResponse(res, 'something wring happen when create the pdf', err);
      })
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'something wring happen when create the pdf', err);
    }
  },
  getMarketsAsExcel: async function (req, res) {
    try {
      var file = req.file('uploadFile');
      file.upload(async function (err, uploadFiles) {
        if (err) {
          console.log(err);
          return ResponseService.ErrorResponse(res, 'please upload a valid file', {
            action: 'invalid-file',
            err: err
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
          var market_obj = {
            name: data[key]['الاسم'],
            address: data[key]['العنوان'],
            lat: data[key]['رقم السينات علي الخريطه'],
            lng: data[key]['رقم الصادات علي الخريطه'],
            marketcategory_id: data[key]['رقم التصنيف'],
            City_id: data[key]['رقم المدينه'],
            class: data[key]['نوع العرض'],
            Country_id: data[key]['رقم المحافظه'],
            Owner_id: data[key]['رقم المالك'],
            status: 'active'
          }
          let createdMarket = await Market.create(market_obj);
          await Safe.create({
            market_id: createdMarket.id
          });

          if (market_obj.Owner_id) {
            var SelletOBJ = await Seller.findOne({
              where: {
                user_id: market_obj.Owner_id
              }
            });
            SelletOBJ.NumberOfMarkets++;
          }
        }
        return ResponseService.SuccessResponse(res, 'success for adding the markets', {
          action: 'success'
        });
      });
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing error happen when adding the excel file', {
        error: err,
        action: 'uknown-error'
      });
    }
  },
  getMarketById: async function (req, res) {
    try {
      let id = req.param('id');
      await Market.update({views: Sequelize.literal('views + 1')}, {where: {id: id}});
      if (!id) {
        return ResponseService.ErrorResponse(res, 'please provide the', {
          action: 'invalid-id'
        });
      }
      let SelectedMarket = await Market.findOne({
        where: {
          id: id,
          status: 'active'
        },
        include: ['Image', 'Category', 'City', 'Country', 'offers', 'safe', 'cover', 'Owner']
      });
      return ResponseService.SuccessResponse(res, 'success for getting market Data', SelectedMarket)
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when getting', {
        action: "invalid-error",
        error: err
      })
    }
  },
  filterMarketsWithLatAndLng: async function (req, res) {
    try {
      let lat = req.param('lat'),
        lng = req.param('lng'),
        myDistance = req.param('range');
      if (!lat || !lng) {
        return ResponseService.ErrorResponse(res, 'please provide the lat and lng', {
          action: 'invalid-data'
        });
      }
      if (!myDistance) {
        myDistance = 10000; // e.g. 10 kilometres

      }
      lat = parseFloat(lat);
      lng = parseFloat(lng);
      var attributes = Object.keys(Market.attributes);
      var distance = Sequelize.literal("6371 * acos(cos(radians(" + lat + ")) * cos(radians(lat)) * cos(radians(" + lng + ") - radians(lng)) + sin(radians(" + lat + ")) * sin(radians(lat)))")
      attributes.push([distance, 'distance']);

      let selectedMarkets = await Market.findAll({
        attributes: attributes,
        order: Sequelize.col('distance'),
        limit: 10,
        where: Sequelize.where(distance, {
          $lte: myDistance
        }),
        include: ['Image', 'cover']
      });
      return ResponseService.SuccessResponse(res, 'success for getting data for users', selectedMarkets);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when getting', {
        action: "invalid-error",
        error: err
      })
    }
  },
  sortMultiple: async function (req, res) {
    try {
      var markets = req.param('markets');
      var sort = req.param('sort');
      // update multiple items
      Market.update(
        {
          order: sort
        },
        {
          where: {
            id: markets
          }
        }
      );
      return ResponseService.SuccessResponse(res, 'success for sorting markets');

    } catch (e) {
      //// console.log(e);
      return ResponseService.ErrorResponse(res, 'something wrong happen when sorting markets', e);
    }
  },
  MarketsCategories: async function (req, res) {
    try {
      let filterOBJ = {};
      let whereOBJ = {};
      whereOBJ['marketcategory_id'] = {
        [Sequelize.Op.not]: null
      }
      filterOBJ['where'] = whereOBJ;
      var SelectedMarkets = await Market.findAll(filterOBJ);
      for (let i = 0; i < SelectedMarkets.length; i++) {
        let SelectedMarket = await Market.findOne({
          where: {
            id: SelectedMarkets[i].id
          }
        });
        await MarketCategory.create({
          market_id: SelectedMarket.id,
          category_id: SelectedMarket.marketcategory_id
        });
      }
      return ResponseService.SuccessResponse(res, 'success', {});
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when fetch the market', e);
    }
  }

};
