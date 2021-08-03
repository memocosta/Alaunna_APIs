/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var moment = require('moment');

module.exports = {
  index: async function (req, res) {
    try {
      let user_id = req.param('user_id');
      let market_id = req.param('market_id');
      let offset = req.param('offset');
      let order_id = req.param('order_id');
      let include_owner = req.param('include_owner');
      let filterOBJ = {
        where: {}
      };
      if (user_id && user_id != 'false' && user_id != 'undefiend') {
        filterOBJ['where']['user_id'] = user_id;
      }
      if (offset && offset != 'false' && offset != 'undefiend') {
        filterOBJ['offset'] = 10 * offset;
        filterOBJ['limit'] = 10;
      }
      filterOBJ['include'] = [
        // { model: User, as: 'owner', attributes: ['name', 'phone', 'email', 'id'] },

        {
          model: Product,
          as: 'products',
          include: [{
              model: Market,
              as: 'market',
              include: [{
                model: Image,
                as: 'cover'
              }],
              required: false,
            },
            {
              model: coupon,
              as: 'coupon',
              where: {
                status: "active"
              },
              required: false
            }
          ],
          where: {
            owner: {
              [Sequelize.Op.ne]: 'AWSHN'
            }
          },
          required: false,
        },
        {
          model: OrderFast,
          as: 'fast',
          include: [{
            model: Image,
            as: 'image'
          }, {
            model: Market,
            as: 'market',
            include: [{
              model: Image,
              as: 'cover'
            }],
            required: false,
          }, ],
        }
      ]
      if (market_id && market_id != 'false' && market_id != 'undefiend') {
        filterOBJ['include'][1]['through'] = {
          where: {
            market_id: market_id
          }
        }
        filterOBJ['include'][2] = {
          model: OrderProducts,
          as: 'orderproducts',
          where: {
            market_id: market_id
          },
          include: ['product']
        }
        filterOBJ['include'][3] = {
          model: OrderFast,
          as: 'fast',
          where: {
            market_id: market_id
          }
        }
      }
      if (order_id && order_id != 'false') {
        filterOBJ['where']['id'] = order_id;
      }

      filterOBJ['order'] = [
        ['id', 'DESC']
      ];
      let SelectedOrders = await Order.findAll(filterOBJ);
      if (include_owner && include_owner == true) {
        for (let i = 0; i < SelectedOrders.length; i++) {
          let Owner = await User.findOne({
            where: {
              id: SelectedOrders[i]['user_id']
            }
          });
          SelectedOrders[i]['user_id'] = Owner['name'];
        }
      }
      return ResponseService.SuccessResponse(res, 'success for get the selecteing order', SelectedOrders);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when get the orders', {
        action: 'unkwon-error',
        error: err
      });
    }
  },
  indexDashboard: async function (req, res) {
    try {
      let user_id = req.param('user_id');
      let market_id = req.param('market_id');
      let offset = req.param('offset');
      let order_id = req.param('order_id');
      let include_owner = req.param('include_owner');
      let filterOBJ = {
        where: {}
      };
      if (user_id && user_id != 'false' && user_id != 'undefiend') {
        filterOBJ['where']['user_id'] = user_id;
      }
      if (offset && offset != 'false' && offset != 'undefiend') {
        filterOBJ['offset'] = 10 * offset;
        filterOBJ['limit'] = 10;
      }
      filterOBJ['include'] = [
        // { model: User, as: 'owner', attributes: ['name', 'phone', 'email', 'id'] },
        {
          model: Product,
          as: 'products',
          include: [{
              model: Market,
              as: 'market',
              // include: [{
              //   model: Image,
              //   as: 'cover'
              // }],
              required: false,
            },
            // ,
            // {
            //   model: coupon,
            //   as: 'coupon',
            //   where: {status: "active"}
            // }
          ],
          where: {
            owner: {
              [Sequelize.Op.ne]: 'AWSHN'
            }
          },
          required: false,
        },
        {
          model: OrderFast,
          as: 'fast',
          include: [
            //   {
            //   model: Image,
            //   as: 'image'
            // },
            {
              model: Market,
              as: 'market',
              // include: [
              //   {
              //   model: Image,
              //   as: 'cover'
              // }],
              required: false,
            },
          ],
        }
      ]
      if (market_id && market_id != 'false' && market_id != 'undefiend') {
        filterOBJ['include'][1]['through'] = {
          where: {
            market_id: market_id
          }
        }
        filterOBJ['include'][2] = {
          model: OrderProducts,
          as: 'orderproducts',
          where: {
            market_id: market_id
          },
          include: ['product']
        }
        filterOBJ['include'][3] = {
          model: OrderFast,
          as: 'fast',
          where: {
            market_id: market_id
          }
        }
      }
      if (order_id && order_id != 'false') {
        filterOBJ['where']['id'] = order_id;
      }

      filterOBJ['order'] = [
        ['id', 'DESC']
      ];
      let SelectedOrders = await Order.findAndCountAll(filterOBJ);
      console.log(SelectedOrders)
      if (include_owner && include_owner == true) {
        for (let i = 0; i < SelectedOrders['rows'].length; i++) {
          let Owner = await User.findOne({
            where: {
              id: SelectedOrders['rows'][i]['user_id']
            }
          });
          if (Owner) {
            SelectedOrders['rows'][i]['user_id'] = Owner['name'];
          } else {
            SelectedOrders['rows'][i]['user_id'] = null;
          }

        }
      }
      return ResponseService.SuccessResponse(res, 'success for get the selecteing order', SelectedOrders);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when get the orders', {
        action: 'unkwon-error',
        error: err
      });
    }
  },
  indexForApp: async function (req, res) {
    try {
      let market_id = req.param('market_id');
      let offset = req.param('offset');
      let order_id = req.param('order_id');
      let filterOBJ = {
        where: {}
      };

      if (offset && offset != 'false' && offset != 'undefiend') {
        filterOBJ['offset'] = 10 * offset;
        filterOBJ['limit'] = 10;
      }

      if (order_id && order_id != 'false') {
        filterOBJ['where']['id'] = order_id;
      }

      filterOBJ['order'] = [
        ['id', 'DESC']
      ];

      // search for orders with products
      filterOBJ['include'] = [{
          model: User,
          as: 'owner',
          attributes: ['name']
        },
        {
          model: OrderProducts,
          as: 'orderproducts',
          where: {
            market_id: market_id
          }
        }
      ]

      let SelectedOrders = await Order.findAll(filterOBJ);

      //search for orders fast
      filterOBJ['include'] = [{
          model: User,
          as: 'owner',
          attributes: ['name']
        },
        filterOBJ['include'][1] = {
          model: OrderFast,
          as: 'fast',
          where: {
            market_id: market_id
          }
        }
      ]

      let SelectedOrdersFast = await Order.findAll(filterOBJ);

      //merge 2 type of orders arrays
      Array.prototype.push.apply(SelectedOrders, SelectedOrdersFast);
      //sort orders
      SelectedOrders.sort((a, b) => {
        if (a.id > b.id) {
          return -1;
        } else {
          return 1;
        }
      });

      return ResponseService.SuccessResponse(res, 'success for get the selecteing order', SelectedOrders);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when get the orders', {
        action: 'unkwon-error',
        error: err
      });
    }
  },
  getOrderById: async function (req, res) {
    try {
      let market_id = req.param('market_id');
      let order_id = req.param('id');
      let filterOBJ = {
        where: {}
      };

      filterOBJ['where']['id'] = order_id;
      filterOBJ['order'] = [
        ['id', 'DESC']
      ];

      // search for orders with products
      filterOBJ['include'] = [{
          model: User,
          as: 'owner',
          attributes: ['name', 'phone', 'email', 'id']
        },
        {
          model: Product,
          as: 'products',
          include: [{
            model: Market,
            as: 'market',
            include: [{
              model: Image,
              as: 'cover'
            }],
          }],
          where: {
            owner: {
              [Sequelize.Op.ne]: 'AWSHN'
            }
          }
        }
      ]
      if (market_id && market_id != 'false' && market_id != 'undefiend') {
        filterOBJ['include'][1]['through'] = {
          where: {
            market_id: market_id
          }
        }
        filterOBJ['include'][2] = {
          model: OrderProducts,
          as: 'orderproducts',
          where: {
            market_id: market_id
          }
        }
        filterOBJ['include'][3] = {
          model: OrderFast,
          as: 'fast',
          where: {
            market_id: market_id
          },
          required: false
        }
      }

      let SelectedOrders = await Order.findAll(filterOBJ);

      //search for orders fast
      filterOBJ['include'] = [{
          model: User,
          as: 'owner',
          attributes: ['name', 'phone', 'email', 'id']
        },
        {
          model: Product,
          as: 'products',
          required: false,
          include: [{
            model: Market,
            as: 'market',
            include: [{
              model: Image,
              as: 'cover'
            }],
          }],
          where: {
            owner: {
              [Sequelize.Op.ne]: 'AWSHN'
            }
          }
        }
      ]
      if (market_id && market_id != 'false' && market_id != 'undefiend') {
        filterOBJ['include'][1]['through'] = {
          where: {
            market_id: market_id
          }
        }
        filterOBJ['include'][2] = {
          model: OrderProducts,
          as: 'orderproducts',
          required: false,
          where: {
            market_id: market_id
          },
          include: ['product']
        }
        filterOBJ['include'][3] = {
          model: OrderFast,
          as: 'fast',
          where: {
            market_id: market_id
          },
          required: true
        }
      }

      let SelectedOrdersFast = await Order.findAll(filterOBJ);

      //merge 2 type of orders arrays
      Array.prototype.push.apply(SelectedOrders, SelectedOrdersFast);

      return ResponseService.SuccessResponse(res, 'success for get the selecteing order', SelectedOrders);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when get the orders', {
        action: 'unkwon-error',
        error: err
      });
    }
  },
  userOrder: async function (req, res) {
    try {
      let market_id = req.param('market_id');
      let filterOBJ = {};

      filterOBJ['order'] = [
        ['id', 'DESC']
      ];

      // search for orders with products
      filterOBJ['include'] = [{
          model: User,
          as: 'owner',
          attributes: ['name', 'id']
        },
        {
          model: OrderProducts,
          as: 'orderproducts',
          where: {
            market_id: market_id
          }
        }
      ]

      // filterOBJ['group'] = ['Order.user_id'];

      let SelectedOrders = await Order.findAll(filterOBJ);

      //search for orders fast
      filterOBJ['include'] = [{
          model: User,
          as: 'owner',
          attributes: ['name', 'id']
        },
        filterOBJ['include'][1] = {
          model: OrderFast,
          as: 'fast',
          where: {
            market_id: market_id
          }
        }
      ]

      // filterOBJ['group'] = ['Order.user_id'];

      let SelectedOrdersFast = await Order.findAll(filterOBJ);

      //merge 2 type of orders arrays
      Array.prototype.push.apply(SelectedOrders, SelectedOrdersFast);

      return ResponseService.SuccessResponse(res, 'success for get the selecteing order', SelectedOrders);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when get the orders', {
        action: 'unkwon-error',
        error: err
      });
    }
  },
  userOrderQuery: async function (req, res) {
    let market_id = req.param('market_id');
    let offset = req.param('offset');
    let filterOBJ = {
      where: {}
    };
    if (offset && offset != 'false' && offset != 'undefiend') {
      filterOBJ['offset'] = 10 * offset;
      filterOBJ['limit'] = 10;
    }
    var myQuery = "select * from uder";

    sails.log.debug("Query :", myQuery);

    User.query(myQuery, function (err, advisors) {
      console.log(advisors);
      console.log(err);
      if (err || !advisors.rows.length) {
        return res.json({
          "status": 0,
          "error": err
        });
      } else {
        return res.json(advisors);
      }
    });
  },
  singleUserOrder: async function (req, res) {
    try {
      let user_id = req.param('user_id');
      let market_id = req.param('market_id');
      let offset = req.param('offset');
      let filterOBJ = {
        where: {}
      };
      if (user_id && user_id != 'false' && user_id != 'undefiend') {
        filterOBJ['where']['user_id'] = user_id;
      }
      if (offset && offset != 'false' && offset != 'undefiend') {
        filterOBJ['offset'] = 10 * offset;
        filterOBJ['limit'] = 10;
      }
      filterOBJ['order'] = [
        ['id', 'DESC']
      ];
      // search for orders with products
      filterOBJ['include'] = [{
          model: User,
          as: 'owner',
          attributes: ['name', 'phone', 'email', 'id']
        },
        {
          model: Product,
          as: 'products',
          // include: [{
          //   model: Market,
          //   as: 'market',
          //   include: [{
          //     model: Image,
          //     as: 'cover'
          //   }],
          // }],
          // where: { owner: { [Sequelize.Op.ne]: 'AWSHN' } }
        }
      ]
      console.log(filterOBJ)
      if (market_id && market_id != 'false' && market_id != 'undefiend') {
        filterOBJ['include'][1]['through'] = {
          where: {
            market_id: market_id
          }
        }
        filterOBJ['include'][2] = {
          model: OrderProducts,
          as: 'orderproducts',
          where: {
            market_id: market_id
          },
          // include: ['product']
        }
        filterOBJ['include'][3] = {
          model: OrderFast,
          as: 'fast',
          where: {
            market_id: market_id
          },
          required: false
        }
      }

      let SelectedOrders = await Order.findAndCountAll(filterOBJ);

      ////////////
      //search for orders fast
      filterOBJ['include'] = [];
      filterOBJ['include'] = [{
          model: User,
          as: 'owner',
          attributes: ['name', 'phone', 'email', 'id']
        },
        {
          model: Product,
          as: 'products',
          required: false,
          // include: [{
          //   model: Market,
          //   as: 'market',
          //   include: [{
          //     model: Image,
          //     as: 'cover'
          //   }],
          // }],
          // where: { owner: { [Sequelize.Op.ne]: 'AWSHN' } }
        }
      ]
      if (user_id && user_id != 'false' && user_id != 'undefiend') {
        filterOBJ['where']['user_id'] = user_id;
      }
      if (market_id && market_id != 'false' && market_id != 'undefiend') {
        filterOBJ['include'][1]['through'] = {
          where: {
            market_id: market_id
          }
        }
        filterOBJ['include'][2] = {
          model: OrderProducts,
          as: 'orderproducts',
          required: false,
          where: {
            market_id: market_id
          },
          include: ['product']
        }
        filterOBJ['include'][3] = {
          model: OrderFast,
          as: 'fast',
          where: {
            market_id: market_id
          },
          required: true
        }
      }

      let SelectedOrdersFast = await Order.findAll(filterOBJ);
      //////

      //merge 2 type of orders arrays
      Array.prototype.push.apply(SelectedOrders['rows'], SelectedOrdersFast);
      //sort orders
      SelectedOrders['rows'].sort((a, b) => {
        if (a.id > b.id) {
          return -1;
        } else {
          return 1;
        }
      });

      return ResponseService.SuccessResponse(res, 'success for get the selecteing order', SelectedOrders);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when get the orders', {
        action: 'unkwon-error',
        error: err
      });
    }
  },
  changeReadOrders: async function (req, res) {
    try {
      let user_id = req.param('user_id');
      let market_id = req.param('market_id');
      let offset = req.param('offset');
      let order_id = req.param('order_id');
      let filterOBJ = {
        where: {}
      };
      if (user_id && user_id != 'false' && user_id != 'undefiend') {
        filterOBJ['where']['user_id'] = user_id;
      }
      if (offset && offset != 'false' && offset != 'undefiend') {
        filterOBJ['offset'] = 10 * offset;
        filterOBJ['limit'] = 10;
      }
      filterOBJ['include'] = [{
          model: User,
          as: 'owner',
          attributes: ['name', 'phone', 'email', 'id']
        },
        {
          model: Product,
          as: 'products',
          include: [{
            model: Market,
            as: 'market'
          }],
          where: {
            owner: {
              [Sequelize.Op.ne]: 'AWSHN'
            }
          }
        }
      ]
      if (market_id && market_id != 'false' && market_id != 'undefiend') {
        filterOBJ['include'][1]['through'] = {
          where: {
            market_id: market_id
          }
        }
      }
      if (order_id && order_id != 'false') {
        filterOBJ['where']['id'] = order_id;
      }

      filterOBJ['order'] = [
        ['id', 'DESC']
      ];

      let SelectedOrders = await Order.findAndCountAll(filterOBJ);
      for (let i = 0; i < SelectedOrders.rows.length; i++) {
        let orderID = SelectedOrders.rows[i].id;
        var SelectedOrder = await Order.findOne({
          where: {
            id: orderID
          }
        });
        SelectedOrder.read = 1;
        await SelectedOrder.save();
      }
      return ResponseService.SuccessResponse(res, 'success for update the selecteing order');
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when update the orders', {
        action: 'unkwon-error',
        error: err
      });
    }
  },
  changeReadOrdersNotifications: async function (req, res) {
    try {
      let user_id = req.param('user_id');
      CustomerNotifications.update({
        read: 1
      }, {
        where: {
          user_id: user_id,
          read: 0,
          type: 'order'
        }
      });
      return ResponseService.SuccessResponse(res, 'success for update the selecting orders notifications');
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when update the orders', {
        action: 'unkwon-error',
        error: err
      });
    }
  },
  getUnreadOrders: async function (req, res) {
    try {
      let user_id = req.param('user_id');
      let market_id = req.param('market_id');
      let offset = req.param('offset');
      let order_id = req.param('order_id');
      let filterOBJ = {
        where: {}
      };
      if (user_id && user_id != 'false' && user_id != 'undefiend') {
        filterOBJ['where']['user_id'] = user_id;
      }
      if (offset && offset != 'false' && offset != 'undefiend') {
        filterOBJ['offset'] = 10 * offset;
        filterOBJ['limit'] = 10;
      }
      filterOBJ['include'] = [{
          model: User,
          as: 'owner',
          attributes: ['name', 'phone', 'email', 'id']
        },
        {
          model: Product,
          as: 'products',
          include: [{
            model: Market,
            as: 'market'
          }],
          where: {
            owner: {
              [Sequelize.Op.ne]: 'AWSHN'
            }
          }
        }
      ]
      if (market_id && market_id != 'false' && market_id != 'undefiend') {
        filterOBJ['include'][1]['through'] = {
          where: {
            market_id: market_id
          }
        }
      }
      if (order_id && order_id != 'false') {
        filterOBJ['where']['id'] = order_id;
      }

      filterOBJ['where']['read'] = 0;

      filterOBJ['order'] = [
        ['id', 'DESC']
      ];

      let SelectedOrders = await Order.findAndCountAll(filterOBJ);
      return ResponseService.SuccessResponse(res, 'success for get the selecteing order', SelectedOrders);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when get the orders', {
        action: 'unkwon-error',
        error: err
      });
    }
  },
  getMarketOrders: async function (req, res) {
    try {
      var market_id = req.param('market_id');
      var offset = req.param('offset');
      if (market_id) {
        var FitlerObj = {};
        if (offset) {
          FitlerObj['offset'] = offset * 10;
          FitlerObj['limit'] = 10;
        }
        var SelectedMarket = await Market.findOne({
          where: {
            id: market_id
          }
        });
        var MarketOrders = await SelectedMarket.getOrders(FitlerObj);
        return ResponseService.SuccessResponse(res, 'success for getting market Orders', MarketOrders);
      } else {
        return ResponseService.ErrorResponse(res, 'please provide the market id');
      }
    } catch (e) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when getting the market orders', e);
    }
  },
  CheckReturnedOrders: async function (req, res) {
    try {
      var today = moment();
      var SelectedOrders = await Order.findAll();
      for (let i = 0; i < SelectedOrders.length; i++) {
        let SelectedOrder = await Order.findOne({
          where: {
            id: SelectedOrders[i].id
          }
        });
        if(SelectedOrders[i].acceptance_date){
          if (today.diff(moment(SelectedOrders[i].acceptance_date, 'YYYY-MM-DD'), 'days') >= 14 && SelectedOrder.return_order == 1 ) {
            SelectedOrder.return_order = 0;
            await SelectedOrder.save();
            await OrderProducts.update({
              return_item: 0
            }, {
              where: {
                OrderId: SelectedOrders[i].id
              }
            });
          }
        }
      }
      return ResponseService.SuccessResponse(res, 'success for updating order Return status', 'Success');

    } catch (e) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when get the orders Returns');
    }
  },
  ChangeOrderStatus: async function (req, res) {
    try {
      var status = req.param('status');
      var order_id = req.param('order_id');
      var canceld_reason = req.param('canceld_reason');
      if (order_id && status) {
        var SelectedOrder = await Order.findOne({
          where: {
            id: order_id
          }
        });
        SelectedOrder.status = status;
        if (status == 'accepted') {
          SelectedOrder.acceptance_date = moment();
        }
        await SelectedOrder.save();
        if (status == 'canceld') {
          await OrderFast.update({
            status: 'user_canceld',
            canceld_reason: canceld_reason
          }, {
            where: {
              order_id: order_id
            }
          });
          await OrderProducts.update({
            status: 'user_canceld',
            canceld_reason: canceld_reason
          }, {
            where: {
              OrderId: order_id
            }
          });
        }
        return ResponseService.SuccessResponse(res, 'success for updating order status', SelectedOrder);
      } else {
        return ResponseService.ErrorResponse(res, 'please provide the order id');
      }
    } catch (e) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when change the status of the order');
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
      // if (!params.market_id) {
      //   return ResponseService.ErrorResponse(res, 'please provide market_id', {
      //     action: 'invalid-market-id'
      //   });
      // }
      let updatedBefore = [];
      let CreatedOrder = await Order.create(params);
      // save delivery Data //
      if (params.deliveryData) {
        params.deliveryData['order_id'] = CreatedOrder.id;
        await OrderDelivery.create(params.deliveryData);
      }
      ///////////////////////
      for (let i = 0; i < params.products.length; i++) {
        console.log(i);
        await OrderProducts.create({
          OrderId: CreatedOrder.id,
          ProductId: params.products[i].product_id,
          Quantity: params.products[i].quantity,
          Final_Price: params.products[i].Final_Price,
          extra_options: params.products[i].extra_options,
          market_id: params.products[i].market_id,
          coupon_id: params.products[i].coupon_id,
          coupon_value: params.products[i].coupon_value
        });
        let marketPro = await Market_Products.findOne({
          where: {
            product_id: params.products[i].product_id,
            market_id: params.products[i].market_id
          }
        });
        marketPro.quantity = marketPro.quantity - params.products[i].quantity;
        await marketPro.save();
        let userOrder = await User.findOne({
          where: {
            id: params.user_id
          }
        });

        let marketobj = await Market.findOne({
          where: {
            id: params.products[i].market_id
          }
        });
        let marketUser = await User.findOne({
          where: {
            id: marketobj.Owner_id
          }
        });
        if (marketUser) {
          if (marketUser.device_id !== null) {
            let notificationOBJ = {
              token: marketUser.device_id,
              body: 'لديك طلب جديد رقم ' + CreatedOrder.id + ' من ' + userOrder.name,
              type: 'orders',
            };
            if (marketUser.device_id) {
              await sails.helpers.firebase.with(notificationOBJ);
            }

          }
        }
        if (updatedBefore.indexOf(params.products[i].market_id) == -1) {
          await Market.update({
            orderCount: Sequelize.literal('orderCount + +1')
          }, {
            where: {
              id: params.products[i].market_id
            }
          });
          ////new notification unread counter/////
          let newNotificationOBJ = {
            type: 'order',
            user_id: marketobj.Owner_id,
            order_id: CreatedOrder.id,
          };
          console.log(newNotificationOBJ);
          console.log(2222222222222);
          await CustomerNotifications.create(newNotificationOBJ);
          console.log(3333333333333);
          ///////
          updatedBefore.push(params.products[i].market_id);
        }
      }
      return ResponseService.SuccessResponse(res, 'success for creating the order successfully', CreatedOrder);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when create the order', {
        action: 'unkown-error',
        error: err
      })
    }
  },
  createFastOrder: async function (req, res) {
    try {
      var params = req.allParams();
      let FastOrder = {};
      // if (!params.fast.description || !params.fast.image) {
      //   return ResponseService.ErrorResponse(res, 'please add at least one product', {
      //     action: 'invalid-product-number'
      //   });
      // }
      if (params.fast.image) {
        let image = await sails.helpers.uploadImage(params.fast.image.base64, 'Fast', params.fast.image.alt, params.fast.image.description, 'fast_order', 220, 220, {});
        params.fast['image_id'] = image.id;
      }
      if (!params.user_id) {
        return ResponseService.ErrorResponse(res, 'please provider user id', {
          action: 'invalid-user-id'
        })
      }
      if (!params.fast.market_id) {
        return ResponseService.ErrorResponse(res, 'please provide market_id', {
          action: 'invalid-market-id'
        });
      }
      let CreatedOrder = await Order.create(params);
      // save delivery Data //
      if (params.deliveryData) {
        params.deliveryData['order_id'] = CreatedOrder.id;
        await OrderDelivery.create(params.deliveryData);
      }

      FastOrder.description = params.fast.description;
      FastOrder.order_id = CreatedOrder.id;
      FastOrder.market_id = params.fast.market_id;
      FastOrder.image_id = params.fast.image_id;

      await OrderFast.create(FastOrder);

      let marketobj = await Market.findOne({
        where: {
          id: params.fast.market_id
        }
      });
      let marketUser = await User.findOne({
        where: {
          id: marketobj.Owner_id
        }
      });
      if (marketUser) {
        if (marketUser.device_id !== null) {
          let notificationOBJ = {
            token: marketUser.device_id,
            body: 'هناك طلب جديد',
            type: 'orders',
          };
          if (marketUser.device_id) {
            await sails.helpers.firebase.with(notificationOBJ);
          }

        }
      }
      CreatedOrder['fast'] = FastOrder;
      return ResponseService.SuccessResponse(res, 'success for creating the order successfully', CreatedOrder);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when create the order', {
        action: 'unkown-error',
        error: err
      })
    }
  },
  changeProductInOrderStatus: async function (req, res) {
    try {
      let productId = req.param('ProductId'),
        orderId = req.param('OrderId'),
        status = req.param('status');
      console.log(productId)
      console.log(orderId)
      let orderInProduct = await OrderProducts.findOne({
        where: {
          OrderId: orderId,
          ProductId: productId
        }
      });
      await orderInProduct.update({
        status: status
      });
      return ResponseService.SuccessResponse(res, 'success for updating the product in order status', orderInProduct);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when create the order', {
        action: 'unkown-error',
        error: err
      })
    }
  },
  statusByMarket: async function (req, res) {
    try {
      let market_id = req.param('market_id'),
        orderId = req.param('OrderId'),
        fast = req.param('fast'),
        total_price = req.param('total_price'),
        canceld_reason = req.param('canceld_reason'),
        status = req.param('status');

      if (fast) {
        await Order.update({
          status: status,
          total_price: total_price
        }, {
          where: {
            id: orderId
          }
        });
        await OrderFast.update({
          status: status,
          canceld_reason: canceld_reason
        }, {
          where: {
            order_id: orderId
          }
        });
      } else {
        await OrderProducts.update({
          status: status,
          canceld_reason: canceld_reason
        }, {
          where: {
            OrderId: orderId,
            market_id: market_id
          }
        });
        let order_products = await OrderProducts.findAndCountAll({
          where: {
            OrderId: orderId
          }
        });
        statusCheck = 0;
        for (let i = 0; i < order_products.rows.length; i++) {
          let row = order_products.rows[i];
          if (row.status != status) {
            statusCheck = 1;
          }
        }
        if (statusCheck == 0) {
          await Order.update({
            status: status
          }, {
            where: {
              id: orderId
            }
          });
        }
      }

      return ResponseService.SuccessResponse(res, 'success for updating the order status', {});
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when update the order status', {
        action: 'unkown-error',
        error: err
      })
    }
  },
  removeOrder: async function (req, res) {
    try {
      let id = req.param('id');
      let SelectedOrder = await Order.findOne({
        where: {
          id: id
        }
      });
      await SelectedOrder.destroy();
      return ResponseService.SuccessResponse(res, 'success for remove the order', SelectedOrder);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen', {
        action: 'unkown-err',
        error: err
      });
    }
  },
  OrderRecieved: async function (req, res) {
    try {
      let id = req.param('id');
      let recieved = req.param('recieved');
      let SelectedOrder = await Order.findOne({
        where: {
          id: id
        }
      });
      await SelectedOrder.update({
        client_recieved: recieved
      });
      return ResponseService.SuccessResponse(res, 'success for the order', SelectedOrder);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen', {
        action: 'unkown-err',
        error: err
      });
    }
  },

};
