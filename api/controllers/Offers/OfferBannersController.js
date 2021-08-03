/**
 * OfferBannersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var moment = require('moment');
module.exports = {
    index: async function (req, res) {
        try {
            var offset = req.param(offset);
            var filterOBJ = {};
            if (offset) {
                filterOBJ['offset'] = offset * 10;
                filterOBJ['limit'] = 10;
            }
            let All = await OfferBanners.findAndCountAll(filterOBJ);
            return ResponseService.SuccessResponse(res, 'success for get offers banners data', All);
        } catch (err) {
            return ResponseService.ErrorResponse(res, 'something wrong happen when get offers banners data', {
                error: err,
                action: 'unkown-error'
            });
        }
    },
    indexWeb: async function (req, res) {
        try {
            let country_id = req.param('country_id');
            let All = {};
            console.log(111111111);
            var fitlerOBJmain = {};
            var whereOBJ1 = {};
            if (country_id && country_id != 'false' && country_id != 'undefined' && country_id != null && country_id != 'null') {
                whereOBJ1['country_id'] = country_id;
            }
            whereOBJ1['banner_type'] = 'main';
            fitlerOBJmain['where'] = whereOBJ1;
            All['main'] = await OfferBanners.findAndCountAll(fitlerOBJmain);
            var filterOBJsub = {};
            whereOBJ1['banner_type'] = 'sub';
            filterOBJsub['where'] = whereOBJ1;
            All['sub'] = await OfferBanners.findAndCountAll(filterOBJsub);
            var filterOBJproducts = {};
            whereOBJ1['banner_type'] = 'products';
            filterOBJproducts['where'] = whereOBJ1;
            var products = await OfferBanners.findAndCountAll(filterOBJproducts);

            for (let i = 0; i < products.rows.length; i++) {
                let item = products.rows[i];
                var fitlerOBJ = {};
                var whereOBJ = {};

                let offer_type = item.offer_type;
                let discount_from = item.from;
                let discount_to = item.to;
                let country_id = item.country_id;

                if (item.category_id) {
                    whereOBJ['category_id'] = item.category_id;
                }
                if (item.subCategory_id) {
                    whereOBJ['subCategory_id'] = item.subCategory_id;
                }
                if (item.subSubCategory_id) {
                    whereOBJ['subSubCategory_id'] = item.subSubCategory_id;
                }

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

                if (offer_type) {

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

                if (country_id) {
                    market_where['Country_id'] = country_id;
                }
                fitlerOBJ['include'] = [{
                    model: Market,
                    as: 'market',
                    where: market_where,
                    through: {
                    },
                    required: true,
                    include: [{ model: User, as: 'Owner', attributes: ['id', 'name', 'phone'] }]
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
                whereOBJ['status'] = 'active';
                fitlerOBJ['where'] = whereOBJ;
                let ssss = await Product.findAndCountAll(fitlerOBJ);
                console.log(ssss);
                products.rows[i].image_id = ssss;
            };
            // console.log(products)
            All['products'] = products;
            return ResponseService.SuccessResponse(res, 'success for get offers banners data', All);
        } catch (err) {
            return ResponseService.ErrorResponse(res, 'something wrong happen when get offers banners data', {
                error: err,
                action: 'unkown-error'
            });
        }
    },
    bannerProducts: async function (req, res) {
        try {
            let banner_id = req.param('id');
            let subcategory_id = req.param('subCategory_id');
            let subSubCategory_id = req.param('subSubCategory_id');
            let markets = req.param('markets');
            var OfferBanner = await OfferBanners.findOne({ where: { id: banner_id } });
            let item = OfferBanner;
            var fitlerOBJ = {};
            var whereOBJ = {};

            let offer_type = item.offer_type;
            let discount_from = item.from;
            let discount_to = item.to;
            let country_id = item.country_id;

            if (item.category_id) {
                whereOBJ['category_id'] = item.category_id;
            }
            if (item.subCategory_id) {
                whereOBJ['subCategory_id'] = item.subCategory_id;
            }
            if (subcategory_id && subcategory_id != 'false' && subcategory_id != 'undefined' && subcategory_id != null && subcategory_id != 'null') {
                whereOBJ['subCategory_id'] = subcategory_id;
            }
            if (item.subSubCategory_id) {
                whereOBJ['subSubCategory_id'] = item.subSubCategory_id;
            }
            if (subSubCategory_id && subSubCategory_id != 'false' && subSubCategory_id != 'undefined' && subSubCategory_id != null && subSubCategory_id != 'null') {
                whereOBJ['subSubCategory_id'] = subSubCategory_id;
            }

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

            if (offer_type) {

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
            market_where['status'] = 'active';
            if (country_id) {
                market_where['Country_id'] = country_id;
            }
            fitlerOBJ['include'] = [{
                model: Market,
                as: 'market',
                where: market_where,
                through: {
                },
                required: true,
                include: ['Image', 'Category', 'City', 'Country', 'safe', 'cover',{ model: User, as: 'Owner', attributes: ['id', 'name', 'phone'] }]
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
            whereOBJ['status'] = 'active';
            fitlerOBJ['where'] = whereOBJ;
            fitlerOBJ['order'] = [['special', 'DESC'],['order', 'DESC'],['id', 'DESC']]
            let products = await Product.findAndCountAll(fitlerOBJ);
            products['bannerData'] = OfferBanner;
            function pushToArray(arr, obj) {
                const index = arr.findIndex((e) => e.id === obj.id);
            
                if (index === -1) {
                    arr.push(obj);
                } else {
                    arr[index] = obj;
                }
            }
            var bannerMarkets = [];
            for (let i = 0; i < products.rows.length; i++) {
                pushToArray(bannerMarkets,products.rows[i].market[0]);
            }
            products['bannerMarkets'] = bannerMarkets;
            
            return ResponseService.SuccessResponse(res, 'success for get offers banners data', products);
        } catch (err) {
            return ResponseService.ErrorResponse(res, 'something wrong happen when get offers banners data', {
                error: err,
                action: 'unkown-error'
            });
        }
    },
    create: async function (req, res) {
        try {
            let params = req.allParams();
            let image = req.param('image');
            if (req.param('image')) {
                var Finalimage = await sails.helpers.uploadImage(image.base64, image.alt, image.alt, image.description, 'offers/banners', 1140, 400, {});
                params['image_id'] = Finalimage.id;
            }
            if(params['from']){
                params['from'] = parseFloat(params['from']);
            }
            if(params['to']){
                params['to'] = parseFloat(params['to']);
            }
            let CreatedBanner = await OfferBanners.create(params);
            // let notificationOBJ = {
            //     type: 'offer_banner',
            //     // user_id: null, 
            //     message_id: CreatedBanner.id,
            // };
            // console.log(notificationOBJ)
            // await CustomerNotifications.create(notificationOBJ);

            return ResponseService.SuccessResponse(res, 'success for creating offers banner', CreatedBanner);
        } catch (err) {
            return ResponseService.ErrorResponse(res, 'something wrong happen when creating offers banner', {
                error: err,
                action: 'unkown-error'
            });
        }
    },
    update: async function (req, res) {
        try {
            var banner_id = req.param('id');
            if (!banner_id) {
                return ResponseService.ErrorResponse(res, 'please provide the OfferBanner id');
            }
            var OfferBanner = await OfferBanners.findOne({ where: { id: banner_id } });

            let image = req.param('image_new');
            if (req.param('image_new')) {
                var Finalimage = await sails.helpers.uploadImage(image.base64, image.alt, image.alt, image.description, 'offers/banners', 1140, 400, {});
                OfferBanner.image_id = Finalimage.id;
            }

            OfferBanner.target = req.param('target');
            OfferBanner.banner_type = req.param('banner_type');
            OfferBanner.offer_type = req.param('offer_type');
            OfferBanner.from = req.param('from');
            OfferBanner.to = req.param('to');
            OfferBanner.category_id = req.param('category_id');
            OfferBanner.subCategory_id = req.param('subCategory_id');
            OfferBanner.subSubCategory_id = req.param('subSubCategory_id');
            OfferBanner.country_id = req.param('country_id');
            OfferBanner.url = req.param('url');
            await OfferBanner.save();
            return ResponseService.SuccessResponse(res, 'success for update the OfferBanner', OfferBanner);
        } catch (err) {
            return ResponseService.ErrorResponse(res, 'somthign wrong happen when update the OfferBanner', err);
        }
    },
    delete: async function (req, res) {
        try {
            var banner_id = req.param('banner_id');
            if (!banner_id) {
                return ResponseService.ErrorResponse(res, 'please provide the slide id');
            }
            var OfferBanner = await OfferBanners.findOne({ where: { id: banner_id } });
            await OfferBanner.destroy();
            return ResponseService.SuccessResponse(res, 'success for deleteing the OfferBanner', OfferBanner);
        } catch (err) {
            return ResponseService.ErrorResponse(res, 'somthign wrong happen when delete the OfferBanner', err);
        }
    }

};

