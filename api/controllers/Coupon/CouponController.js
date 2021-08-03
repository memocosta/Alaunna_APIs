/**
 * CouponController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var moment = require('moment');
module.exports = {

    create: async function (req, res) {
        try {
            let params = req.allParams();
            var market_id = req.param('market_id');
            let CreatedCoupon = await coupon.create(params);
            if (!params.products) {
                // coupon to all Products
                let filterOBJ = {};
                let whereOBJ = {};
                whereOBJ['owner'] = market_id;
                whereOBJ['coupon_id'] = null;
                filterOBJ['where'] = whereOBJ;
                var userProducts = await Product.findAndCountAll(filterOBJ);
                for (let i = 0; i < userProducts.rows.length; i++) {
                    let SelectedProduct = await Product.findOne({
                        where: {
                            id: userProducts.rows[i].id
                        }
                    });
                    SelectedProduct.coupon_id = CreatedCoupon.id;
                    await SelectedProduct.save();
                }
            } else {
                // coupon to specific Products

                for (let i = 0; i < params.products.length; i++) {
                    let SelectedProduct = await Product.findOne({
                        where: {
                            id: params.products[i]
                        }
                    });
                    SelectedProduct.coupon_id = CreatedCoupon.id;
                    await SelectedProduct.save();
                }

            }
            return ResponseService.SuccessResponse(res, 'success for creating the coupon', CreatedCoupon);
        } catch (err) {
            return ResponseService.ErrorResponse(res, 'something wrong happen when creating the coupon', {
                error: err,
                action: 'unkown-error'
            });
        }
    },
    update: async function (req, res) {
        try {
            let params = req.allParams();
            let market_id = req.param('market_id');
            if (!params.id) {
                return ResponseService.ErrorResponse(res, 'please provide the copoun id', {
                    action: 'invalid-data'
                });
            }
            let SelectedCoupon = await coupon.findOne({
                where: {
                    id: params.id
                }
            });
            SelectedCoupon.code = params.code;
            SelectedCoupon.value = params.value;
            SelectedCoupon.from = params.from;
            SelectedCoupon.to = params.to;
            SelectedCoupon.count = params.count;
            SelectedCoupon.type = params.type;
            await SelectedCoupon.save();

            if (params.all) {
                // coupon to all Products
                let filterOBJ = {};
                let whereOBJ = {};
                whereOBJ['owner'] = market_id;
                whereOBJ['coupon_id'] = null;
                filterOBJ['where'] = whereOBJ;
                var userProducts = await Product.findAndCountAll(filterOBJ);
                for (let i = 0; i < userProducts.rows.length; i++) {
                    let SelectedProduct = await Product.findOne({
                        where: {
                            id: userProducts.rows[i].id
                        }
                    });
                    SelectedProduct.coupon_id = SelectedCoupon.id;
                    await SelectedProduct.save();
                }
            } else {
                // coupon to specific Products

                if (params.products) {

                    // coupon to ((new)) specific Products
                    let filterOBJ = {};
                    let whereOBJ = {};
                    whereOBJ['owner'] = market_id;
                    whereOBJ['coupon_id'] = params.id;
                    filterOBJ['where'] = whereOBJ;
                    var userProducts = await Product.findAndCountAll(filterOBJ);

                    for (let i = 0; i < userProducts.rows.length; i++) {
                        let oldSelectedProduct = await Product.findOne({
                            where: {
                                id: userProducts.rows[i].id
                            }
                        });
                        oldSelectedProduct.coupon_id = null;
                        await oldSelectedProduct.save();
                    }
                    for (let i = 0; i < params.products.length; i++) {
                        let SelectedProduct = await Product.findOne({
                            where: {
                                id: params.products[i]
                            }
                        });
                        SelectedProduct.coupon_id = params.id;
                        await SelectedProduct.save();
                    }
                }

            }
            return ResponseService.SuccessResponse(res, 'success for update the coupon', SelectedCoupon);
        } catch (err) {
            return ResponseService.ErrorResponse(res, 'something wrong happen when update the coupon', {
                error: err,
                action: 'unkown-error'
            });
        }
    },
    single: async function (req, res) {
        try {
            let params = req.allParams();
            if (!params.id) {
                return ResponseService.ErrorResponse(res, 'please provide the copoun id', {
                    action: 'invalid-data'
                });
            }
            let SelectedCoupon = await coupon.findOne({
                where: {
                    id: params.id
                }
            });

            return ResponseService.SuccessResponse(res, 'success for get the coupon data', SelectedCoupon);
        } catch (err) {
            return ResponseService.ErrorResponse(res, 'something wrong happen when get the coupon data', {
                error: err,
                action: 'unkown-error'
            });
        }
    },
    marketCoupons: async function (req, res) {
        try {
            let market_id = req.param('market_id'),
                filterOBJ = {},
                WhereOBJ = {};
            filterOBJ['where'] = {};

            if (market_id && market_id != 'false') {
                WhereOBJ['market_id'] = market_id;
            }
            filterOBJ['where'] = WhereOBJ;
            let SelectedCoupons = await coupon.findAndCountAll(filterOBJ);
            return ResponseService.SuccessResponse(res, 'success for getting Market Coupons ', SelectedCoupons);
        } catch (err) {
            console.log(err);
            return ResponseService.ErrorResponse(res, 'somthing wrong happen when getting Market Coupons', {
                action: 'unkown-error'
            })
        }
    },
    delete: async function (req, res) {
        try {
            let coupon_id = req.param('id');
            let DeletedCoupon = await coupon.findOne({
                where: {
                    id: coupon_id
                }
            });
            await DeletedCoupon.destroy();
            return ResponseService.SuccessResponse(res, 'success for deleting  the coupon', {});
        } catch (err) {
            console.log(err);
            return ResponseService.ErrorResponse(res, 'something wrong happen when deleting the coupon', {
                error: err,
                action: 'unkown-error'
            });
        }
    },
    changeStatus: async function (req, res) {
        try {
            let params = req.allParams();
            let SelectedCoupon = await coupon.findOne({
                where: {
                    id: params.id
                }
            });
            SelectedCoupon.status = params.status;
            await SelectedCoupon.save();
            return ResponseService.SuccessResponse(res, 'success foe change the Coupon status', SelectedCoupon);
        } catch (err) {
            return ResponseService.ErrorResponse(res, 'somthing wrong happen when change the Coupon status', {
                action: 'unkown-err',
                err: err
            });
        }
    },
    productsCreateList: async function (req, res) {
        try {
            var market_id = req.param('market_id');
            let filterOBJ = {};
            let whereOBJ = {};
            whereOBJ['owner'] = market_id;
            whereOBJ['coupon_id'] = null;
            filterOBJ['include'] = [{
                model: Market,
                as: 'market',
                required: true,
                include: [{ model: User, as: 'Owner', attributes: ['id', 'name', 'phone'] }]
            }]
            filterOBJ['where'] = whereOBJ;
            var userProducts = await Product.findAndCountAll(filterOBJ);
            return ResponseService.SuccessResponse(res, 'success for getting the Market products has no Coupon', userProducts);
        } catch (err) {
            return ResponseService.ErrorResponse(res, 'something wrong happen when getting the Market products has no Coupon', {
                error: err,
                action: 'unkown-error'
            });
        }
    },
    productsUpdateList: async function (req, res) {
        try {
            let market_id = req.param('market_id');
            let coupon_id = req.param('coupon_id');
            let filterOBJ = {};
            filterOBJ['where'] = Sequelize.and(
                { owner: market_id },
                Sequelize.or(
                    { coupon_id: coupon_id },
                    { coupon_id: null }
                )
            );
            filterOBJ['include'] = [{
                model: Market,
                as: 'market',
                required: true,
                include: [{ model: User, as: 'Owner', attributes: ['id', 'name', 'phone'] }]
            }]
            var userProducts = await Product.findAndCountAll(filterOBJ);
            var selectedproducts = [];
            for (let i = 0; i < userProducts.rows.length; i++) {
                if (userProducts.rows[i].coupon_id == coupon_id) {
                    selectedproducts.push(userProducts.rows[i].id);
                }
            }
            userProducts['selectedproducts'] = selectedproducts;
            return ResponseService.SuccessResponse(res, 'success for getting the Market products has no Coupon and selected that Coupon', userProducts);
        } catch (err) {
            return ResponseService.ErrorResponse(res, 'something wrong happen when getting the Market products has no Coupon', {
                error: err,
                action: 'unkown-error'
            });
        }
    },
    checkCoupon: async function (req, res) {
        try {
            let params = req.allParams();
            let filterDate = moment().toISOString();
            var filterOBJ = {};
            filterOBJ['where'] = {
                id: params.product_id
            };

            var coupon_where = {};
            coupon_where = {
                code: params.code,
                status: 'active',
                from: {
                    [Sequelize.Op.lte]: filterDate
                },
                to: {
                    [Sequelize.Op.gte]: filterDate
                }
            };
            filterOBJ['include'] = [
                {
                    model: coupon,
                    as: 'coupon',
                    where: coupon_where,
                    required: true
                }
            ];
            var checkProduct = await Product.findOne(filterOBJ);
            if (checkProduct) {
                var SelectedCoupon = checkProduct.coupon;
                return ResponseService.SuccessResponse(res, 'success for get the Coupon', SelectedCoupon);
            } else {
                return ResponseService.ErrorResponse(res, 'cannot find the Coupon');
            }
        } catch (err) {
            return ResponseService.ErrorResponse(res, 'somthing wrong happen when get the Coupon', {
                action: 'unkown-err',
                err: err
            });
        }
    }
};

