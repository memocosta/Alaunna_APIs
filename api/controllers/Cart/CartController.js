  /**
 * CartController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  index: async function (req, res) {
    try {
      let owner_id = req.param('owner_id');
      let Selectedproducts = [];
      let SelectedCart = [];
      let filterOBJ = {where: {}};
      if (owner_id && owner_id != 'false' && owner_id != 'undefiend') {
        filterOBJ['where']['owner_id'] = owner_id;
        filterOBJ['where']['active'] = 1;
      }
      filterOBJ['include'] = [
        {
          model: Product,
          as: 'productsData',
          //  as: 'products',
          include: [
            {
              model: ProductOffer,
              as: 'offer',
            },
            {
              model: coupon,
              as: 'coupon',
            }
            , {
              model: Market,
              as: 'market',
              include: [{
                model: Image,
                as: 'cover'
              }],
            }],
          //  where: { owner: { [Sequelize.Op.ne]: 'AWSHN' } }
        }
      ]
      filterOBJ['order'] = [['id', 'DESC']];
      SelectedCart = await Cart.findOne(filterOBJ);
      if (SelectedCart) {
        Selectedproducts = await CartProducts.findAll({
          where: {
            cart_id: SelectedCart.id
          }
        });
        console.log(Selectedproducts)
        SelectedCart['products'] = {};
        SelectedCart['products'] = Selectedproducts;
      }
      responsedata = Object.assign(
        {},
        {'SelectedCart': SelectedCart},
        {'Selectedproducts': Selectedproducts}
      )
      return ResponseService.SuccessResponse(res, 'success for get the selecteing cart', responsedata);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when get the cart', {
        action: 'unkwon-error',
        error: err
      });
    }
  },
  index_market: async function (req, res) {
    try {
      let owner_id = req.param('owner_id');
      let Selectedproducts = [];
      let SelectedCart = [];
      let filterOBJ = {where: {}};
      if (owner_id && owner_id != 'false' && owner_id != 'undefiend') {
        filterOBJ['where']['owner_id'] = owner_id;
        filterOBJ['where']['active'] = 1;
      }
      filterOBJ['include'] = [
        {
          model: Product,
          as: 'productsData',
          //  as: 'products',
          include: [
            {
              model: ProductOffer,
              as: 'offer',
            },
            {
              model: coupon,
              as: 'coupon',
            }
            , {
              model: Market,
              as: 'market',
              include: [{
                model: Image,
                as: 'cover'
              }],
            }],
          //  where: { owner: { [Sequelize.Op.ne]: 'AWSHN' } }
        }
      ]
      filterOBJ['order'] = [['productsData', 'owner', 'asc']];
      SelectedCart = await Cart.findOne(filterOBJ);
      if (SelectedCart) {
        Selectedproducts = await CartProducts.findAll({
          where: {
            cart_id: SelectedCart.id
          }
        });
        console.log(Selectedproducts)
        SelectedCart['products'] = {};
        SelectedCart['products'] = Selectedproducts;
      }
      responsedata = Object.assign(
        {},
        {'SelectedCart': SelectedCart},
        {'Selectedproducts': Selectedproducts}
      )
      return ResponseService.SuccessResponse(res, 'success for get the selecteing cart', responsedata);
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
      var params = req.allParams();
      if (!params.products.length) {
        return ResponseService.ErrorResponse(res, 'please add at least one product', {
          action: 'invalid-product-number'
        });
      }
      if (!params.user_id) {
        return ResponseService.ErrorResponse(res, 'please provider user id', {
          action: 'invalid-user-id'
        })
      }
      let SelectedCart = await Cart.findOne({
        where: {
          owner_id: params.user_id,
          active: 1
        }
      });
      console.log(SelectedCart)
      if (SelectedCart) {
        SelectedCart.total_price = params.total_price,
          SelectedCart.total_size_liter = params.total_size_liter,
          SelectedCart.total_size_kg = params.total_size_kg,
          SelectedCart.shared = params.shared,
          SelectedCart.total_quantity = params.total_quantity,
          SelectedCart.total_items = params.total_items,
          SelectedCart.owner_id = params.user_id

        await SelectedCart.save();
        for (let i = 0; i < params.products.length; i++) {
          let SelectedCartProducts = await CartProducts.findOne({
            where: {
              cart_id: SelectedCart.id,
              product_id: params.products[i].product_id
            }
          });
          if (SelectedCartProducts) {
            SelectedCartProducts.quantity = params.products[i].quantity
            SelectedCartProducts.save();
          } else {
            let filterOBJ = {where: {}};
            filterOBJ['where']['id'] = params.products[i].product_id;

            let SelectedProduct = await Product.findOne(filterOBJ);

            await CartProducts.create({
              quantity: params.products[i].quantity,
              product_id: params.products[i].product_id,
              market_id: SelectedProduct.owner,
              extraInput: params.products[i].extra_options,
              cart_id: SelectedCart.id,
            });
          }
        }
        return ResponseService.SuccessResponse(res, 'success for Updating the cart successfully', params);

      } else {
        let CartParam = {
          total_price: params.total_price,
          total_size_liter: params.total_size_liter,
          total_size_kg: params.total_size_kg,
          shared: params.shared,
          total_quantity: params.total_quantity,
          total_items: params.total_items,
          owner_id: params.user_id,
        }
        let CreatedCart = await Cart.create(CartParam);
        for (let i = 0; i < params.products.length; i++) {
          await CartProducts.create({
            quantity: params.products[i].quantity,
            product_id: params.products[i].product_id,
            extraInput: params.products[i].extra_options,
            cart_id: CreatedCart.id,
          });
        }

        return ResponseService.SuccessResponse(res, 'success for creating the cart successfully', params);
      }
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when create the cart', {
        action: 'unkown-error',
        error: err
      })
    }
  },
  removeCartProduct: async function (req, res) {
    try {
      let product_id = req.param('product_id');
      let owner_id = req.param('user_id');
      let price = req.param('price');
      let filterOBJ = {where: {}};
      let SelectedCartProduct = await CartProducts.findOne({where: {product_id: product_id}});
      filterOBJ['where']['owner_id'] = owner_id;
      filterOBJ['where']['active'] = 1;
      let SelectedCart = await Cart.findOne(filterOBJ);
      console.log(SelectedCart)
      if (SelectedCartProduct.quantity > 1) {
        SelectedCartProduct.quantity = SelectedCartProduct.quantity - 1;
        SelectedCartProduct.save();
        SelectedCart.total_quantity = SelectedCart.total_quantity - 1;
        SelectedCart.total_price = SelectedCart.total_price - price;
        SelectedCart.save();
        return ResponseService.SuccessResponse(res, 'success for Update the Cart Product', {});
      } else {
        await SelectedCartProduct.destroy();
        SelectedCart.total_quantity = SelectedCart.total_quantity - 1;
        SelectedCart.total_items = SelectedCart.total_items - 1;
        SelectedCart.total_price = SelectedCart.total_price - price;
        SelectedCart.save();
        return ResponseService.SuccessResponse(res, 'success for remove the Cart Product', {});

      }
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen', {action: 'unkown-err', error: err});
    }
  },
  removeProduct: async function (req, res) {
    try {
      let product_id = req.param('product_id');
      let owner_id = req.param('user_id');
      let price = req.param('price');
      let quantity = req.param('quantity');
      let filterOBJ = {where: {}};
      let SelectedCartProduct = await CartProducts.findOne({where: {product_id: product_id}});
      filterOBJ['where']['owner_id'] = owner_id;
      filterOBJ['where']['active'] = 1;
      let SelectedCart = await Cart.findOne(filterOBJ);
      console.log(SelectedCart)
      await SelectedCartProduct.destroy();
      SelectedCart.total_quantity = SelectedCart.total_quantity - Number(quantity);
      SelectedCart.total_items = SelectedCart.total_items - 1;
      SelectedCart.total_price = SelectedCart.total_price - price;
      SelectedCart.save();
      if(SelectedCart.total_items == 0){
        await SelectedCart.destroy();
      }
      return ResponseService.SuccessResponse(res, 'success for remove the Cart Product', {});

    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen', {action: 'unkown-err', error: err});
    }
  },
  changeCartStatus: async function (req, res) {
    try {
      let cart_id = req.param('cart_id');
      let selectedCart = await Cart.findOne({
        where: {
          id: cart_id
        }
      })
      if (selectedCart) {
        selectedCart.active = 0;
        selectedCart.save();
      }
      return ResponseService.SuccessResponse(res, 'success for change cart status', {});

    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthign wrong happen when change cart status ', {
        action: 'unkown-err',
        error: err
      })
    }
  }

};

