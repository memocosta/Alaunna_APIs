/**
 * Product/Product.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
var moment = require('moment');
module.exports = {

  attributes: {
    name: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING(2500),
      defaultValue: 'this the product description'
    },
    status: {
      type: Sequelize.ENUM,
      defaultValue: 'pending',
      values: ['pending', 'active', 'not_active']
    },
    nationalQr: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    size: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    rate: {
      type: Sequelize.FLOAT,
      defaultValue: 0
    },
    sizeType: {
      type: Sequelize.ENUM,
      allowNull: true,
      values: ['byPiece', 'kilogram']
    },
    extraInput: {
      type: Sequelize.STRING(5000),
    },
    owner: {
      type: Sequelize.STRING,
      defaultValue: 'AWSHN'
    },
    order: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    special: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    main_owner : {
      type : Sequelize.STRING,
    },
    meta_description : {
      type : Sequelize.STRING,
    },
    meta_keywords : {
      type : Sequelize.STRING
    }
  },
  defaultScope: function () {
    let WhereOBJ = {};
    let filterDate = moment().toISOString();
    console.log(filterDate);
    WhereOBJ['from'] = {
      [Sequelize.Op.lte]: filterDate,
    }
    WhereOBJ['to'] = {
      [Sequelize.Op.gte]: filterDate,
    }
    WhereOBJ['status'] = 'active';
    return {
      include: [{
        model: Image,
        as: 'images',
        order : [['images.id' , 'ASC']]
      }, 'category', 'subCategory', 'subSubCategory', {
        model: ProductOffer,
        as: 'offer',
        where: WhereOBJ,
        required: false
      }]
      // ,
      // order: [
      //   ['special', 'DESC'],
      //   ['order', 'DESC'],
      //   ['id', 'DESC']
      // ]
    }
  },
  associations: function () {
    Product.belongsTo(ProductCategory, {
      as: 'category',
      foreignKey: 'category_id',
      onDelete: 'SET NULL'
    });

    Product.belongsTo(ProductSubCategory, {
      as: 'subCategory',
      foreignKey: 'subCategory_id',
      onDelete: 'SET NULL'
    });

    Product.belongsTo(ProductSubSubCategory, {
      as: 'subSubCategory',
      foreignKey: 'subSubCategory_id',
      onDelete: 'SET NULL'
    });

    Product.belongsToMany(Image, {
      through: {
        model: ProductImages,
        unique: false,
      },
      foreignKey: 'product_id',
      as: 'images',
      onDelete: "CASCADE",
      hooks: true
    });

    Product.belongsToMany(Order, {
      through: {
        model: OrderProducts,
        unique: false
      },
      as: 'orders'
    });

    Product.belongsToMany(Cart, {
      through: {
        model: CartProducts,
        unique: false
      },
      foreignKey: 'product_id',
      onDelete: "CASCADE",
    });

    Product.belongsToMany(Favorite2, {
      through: {
        model: FavoriteProducts,
        unique: false
      },
      as: 'favorites2',
      foreignKey: 'product_id',
      onDelete: "CASCADE",
    });

    Product.belongsToMany(Market, {
      through: {
        model: Market_Products,
        unique: false
      },
      as: 'market',
      foreignKey: 'product_id',
    });

    Product.belongsToMany(Purchases, {
      through: {
        model: ProductPurchases,
        unique: false
      },
      as: 'purchases',
      foreignKey: 'product_id',
    });

    Product.hasMany(ProductSales, {
      as: 'sales',
      foreignKey: 'product_id'
    });

    Product.belongsTo(ProductOffer, {
      as: 'offer',
      foreignKey: 'offer_id',
    });
    Product.hasMany(ProductFavorite, {
      as: 'favorites',
      foreignKey: 'product_id'
    });
    Product.belongsTo(coupon, {
      as: 'coupon',
      foreignKey: 'coupon_id',
    });
  },
  options: {
    tableName: 'product',
    classMethods: {},
    instanceMethods: {},
    scopes: {
      search: {

      },
      offerScope: function () {
        return {
          include: ['images', 'category', 'subCategory', 'subSubCategory','offer',
            {
              model: Market,
              as: 'market',
              through: {
                where: {
                  Showen: true
                }
              },
              required: true
            },
          ]
        }
      }
    },
    hooks: {}
  }
};
