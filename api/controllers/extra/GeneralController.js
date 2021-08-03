/**
 * GeneralController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getCounters: async function (req, res) {
    try {
      let productsCount = await Product.count();
      let marketsCount = await Market.count();
      let customersCount = await User.count({
        where: {
          category: 'customer'
        }
      });
      let sellersCount = await User.count({
        where: {
          category: 'seller'
        }
      });
      let BannersCount = await SponserdBanners.count();
      let body = {
        products: productsCount,
        markets: marketsCount,
        customers: customersCount,
        sellers: sellersCount,
        banners: BannersCount
      }
      return ResponseService.SuccessResponse(res, 'success for counting objects', body);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when counting obj', err);
    }
  },
  getCategoryWirhProductsCount: async function (req, res) {
    try {
      let filterOBJ = {};
      filterOBJ['include'] = [{
        model: Product,
        as: 'products',
        attributes: ['id']
      }];
      filterOBJ['attributes'] = {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("products.id")), 'productsCount']
        ]
      };
      filterOBJ['group'] = ['ProductCategory.id']
      //filterOBJ['limit'] = 5;

      let Categories = await ProductCategory.findAll(filterOBJ);
      return ResponseService.SuccessResponse(res, 'success for getting all caetgories with products count', Categories);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when caetgories with products count', err);
    }
  },
  Search: async function (req, res) {
    try {
      let Search_type = req.param('search_type');
      let Searching_word = req.param('word');
      if (Search_type == 'text') {
        let SelectedProducts = await Product.scope('search').findAll({
          where: {
            [Sequelize.Op.or]: {
              name: {
                [Sequelize.Op.like]: `%${Searching_word}%`
              },
              nationalQr: {
                [Sequelize.Op.like]: `%${Searching_word}%`
              }
            }
          },
          attributes: ['id', 'name', 'nationalQr'],
          include: [{
            model: Market.scope('search'),
            as: 'market',
            required: true,
            where: {
              status: 'active'
            },
            through: {
              where: {
                Showen: true,
              }
            }
          }],
          limit: 10
        });

        let Selectedmarkets = await Market.findAll({
          where: {
            name: {
              [Sequelize.Op.like]: `%${Searching_word}%`
            },
            status: 'active'
          },
          limit: 10
        });
        let selelctedCategories = await ProductCategory.findAll({
          where: {
            name: {
              [Sequelize.Op.like]: `%${Searching_word}%`
            }
          },
          limit: 10,
          attributes: ['name', 'id']
        });
        let selelctedSubCategories = await ProductSubCategory.findAll({
          where: {
            name: {
              [Sequelize.Op.like]: `%${Searching_word}%`
            }
          },
          limit: 10,
          attributes: ['name', 'id']
        });
        let selelctedSubSubCategories = await ProductSubSubCategory.findAll({
          where: {
            name: {
              [Sequelize.Op.like]: `%${Searching_word}%`
            }
          },
          limit: 10,
          attributes: ['name', 'id']
        });

        return ResponseService.SuccessResponse(res, 'success for getting searching market and products', {
          markets: Selectedmarkets,
          products: SelectedProducts,
          Subcategories: selelctedSubCategories,
          categories: selelctedCategories,
          SubSubcategories: selelctedSubSubCategories
        })
      } else {
        let Selectedmarkets = await Market.findAll({
          include: [{
            model: Country,
            as: 'Country',
            where: {
              name: {
                [Sequelize.Op.like]: `%${Searching_word}%`
              }
            }
          }]
        });
        return ResponseService.SuccessResponse(res, 'success for filtering markets', {
          markets: Selectedmarkets,
          products: []
        });
      }
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when search ', {
        action: 'invalid-error',
        error: err
      })
    }
  },

};
