/**
 * Order/Order.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    address_id: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
      allowNull: true,

    },
    total_price: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    },
    total_items: {
      type: Sequelize.DOUBLE,
      defaultValue: 0.0
    },
    total_size_kg: {
      type: Sequelize.DOUBLE,
      defaultValue: 0.0
    },
    read: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    return_order: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    client_recieved: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    sutiable_place: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
      defaultValue: 'anyplce',
    },
    payment_method: {
      type: Sequelize.STRING,
      required: false,
      allowNull: true,
      defaultValue: 'anyplce',
    },
    status: {
      type: Sequelize.ENUM,
      values: ['accepted', 'pending', 'shipping', 'canceld'],
      defaultValue: 'pending'
    },
    acceptance_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    sutiable_time: {
      type: Sequelize.DATE,
      required: true,
      allowNull: false,
    },
    delivery_type: {
      type: Sequelize.ENUM,
      allowNull: false,
      required: true,
      defaultValue: 'market',
      values: ['delivery', 'market']
    }
  },
  defaultScope: function () {
    return {
      include: ['fast', 'OrderDelivery'
        //{ model: User, as: 'owner', attributes: ['name', 'phone', 'email' , 'id'] },
        //{model : Product , as : 'products' , include : [{model : Market , as : 'market'} ] , where : {owner  : {[Sequelize.Op.ne] : 'AWSHN'}}}
      ]
    }
  },
  associations: function () {
    Order.belongsToMany(Product, {
      through: {
        model: OrderProducts,
        unique: false
      },
      as: 'products'
    });
    Order.hasMany(OrderProducts, {
      as: 'orderproducts',
      foreignKey: 'OrderId'
    });
    Order.belongsTo(User, {
      as: 'owner',
      foreignKey: 'user_id'
    });
    Order.belongsTo(Shipping, {
      as: 'shipping',
      foreignKey: 'shipping_id'
    });
    Order.belongsTo(Shipping_Company, {
      as: 'Shipping_Company',
      foreignKey: 'Shipping_Company_id'
    });
    Order.hasOne(OrderFast, {
      as: 'fast',
      foreignKey: 'order_id',
      onDelete: 'CASCADE'
    });
    Order.hasOne(OrderDelivery, {
      as: 'OrderDelivery',
      foreignKey: 'order_id',
      onDelete: 'CASCADE'
    });
    Order.belongsTo(Market, {
      as: 'market',
      foreignKey: 'market_id'
    });
  },
  options: {
    tableName: 'Order',
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};
