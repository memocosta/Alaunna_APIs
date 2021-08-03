module.exports = {
  index: async function(req, res){
    try {
      let market_id = req.param('market_id');
      let filterOBJ = {where: {}};
      filterOBJ['order'] = [['id', 'DESC']];
      if (market_id && market_id != 'false' && market_id != 'undefiend') {
        filterOBJ['where']['market_id'] = market_id;
      }
      filterOBJ['include'] = [
        {
          model: User,
          as: 'user'
        },
        {
          model: MarketCustomer,
          as: 'customer'
        }

      ]
      let Market_carts = await MarketCart.findAll(filterOBJ);
      return ResponseService.SuccessResponse(res, 'success for create the Market Cart', Market_carts);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'something wrong happen when create the Market Cart', {
        action: 'unknown-error',
        error: err
      })
    }
  },
  get_market_cart: async function (req, res) {
    try {
      let id = req.param('id');
      let Selectedproducts = [];
      let SelectedCart = [];
      let filterOBJ = {where: {}};
      if (id && id != 'false' && id != 'undefiend') {
        filterOBJ['where']['id'] = id;
      }
      filterOBJ['include'] = [
        {
          model: MarketCartProduct,
          as: 'MarketCartProduct',
          include: [
            {
              model: Product,
              as: 'product',
              //  as: 'products',
              //  where: { owner: { [Sequelize.Op.ne]: 'AWSHN' } }
            }
          ]
        },

      ]
      SelectedCart = await MarketCart.findOne(filterOBJ);
      return ResponseService.SuccessResponse(res, 'success for get the selecteing cart', SelectedCart);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when get the cart', {
        action: 'unkwon-error',
        error: err
      });
    }
  },
  create: async function (req, res) {
    try {
      let params = req.allParams();
      let user_id = req.param('user_id');
      var market_id = req.param('market_id');
      if (!req.param('products') || params.products.length == 0) {
        return ResponseService.ErrorResponse(res, 'no products Selected', {
          action: 'no-products'
        })
      }
      let CreatedMarketCart = await MarketCart.create(params);
      for (let i = 0; i < params.products.length; i++) {
        let prod = {};
        prod['product_id'] = params.products[i];
        prod['market_cart_id'] = CreatedMarketCart.id;
        await MarketCartProduct.create(prod);
      }
      //await Admin.sendNotification('تنبيه' , `تم اضافه عرض جديد برقم ${CreatedOffer.id} برجاء مراجعه العرض` , 'offer' , 'create');
      return ResponseService.SuccessResponse(res, 'success for create the Market Cart', CreatedMarketCart);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'something wrong happen when create the Market Cart', {
        action: 'unknown-error',
        error: err
      })
    }
  },
  last_id: async function (req, res) {
    try {
      let filterOBJ = {where: {}};
      filterOBJ['order'] = [['id', 'DESC']];
      let Market = await MarketCart.findOne(filterOBJ);
      return ResponseService.SuccessResponse(res, 'success for create the Market Cart', Market);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'something wrong happen when create the Market Cart', {
        action: 'unknown-error',
        error: err
      })
    }
  },

}
