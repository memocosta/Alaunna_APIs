/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  '/': {
    view: 'pages/homepage'
  },

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/

  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // General Part
  'get /general/counters': 'extra/GeneralController.getCounters',
  'get /general/category_countes': 'extra/GeneralController.getCategoryWirhProductsCount',
  'get /general/search': 'extra/GeneralController.search',
  // AUTHENTICATION PART  sendPasswordResetToken
  'post /auth/user': 'Auth/AuthController.getUsers',
  'post /auth/signup': 'Auth/AuthController.register',
  'post /auth/login': 'Auth/AuthController.login',
  'post /auth/loginSellerApp': 'Auth/AuthController.loginSellerApp',
  'post /auth/sendPhoneCode': 'Auth/AuthController.sendPhoneCode',
  'post /auth/verifyPhoneCode': 'Auth/AuthController.verifyPhoneCode',
  'post /auth/forgetPassword': 'Auth/AuthController.forgetPassword',
  'post /auth/varify': 'Auth/AuthController.verifyToken',
  'post /auth/remove': 'Auth/AuthController.deleteUser',
  'post /auth/filter': 'Auth/AuthController.filterUsersBassedOnCategory',
  'post /auth/edit': 'Auth/AuthController.editUserProfile',
  'post /auth/status': 'Auth/AuthController.changeUserStatus',
  'post /auth/social': 'Auth/AuthController.varifySocial',
  'post /auth/password/mail': 'Auth/AuthController.sendPasswordResetToken',
  'post /auth/password/reset': 'Auth/AuthController.RestPassword',
  'post /auth/phone': 'Auth/AuthController.changePhoneVerfication',
  'post /auth/updateLastAdminMsgRead': 'Auth/AuthController.updateLastAdminMsgRead',
  'post /auth/sellerLoginSocial': 'Auth/AuthController.sellerLoginSocial',
  'post /auth/sellerRegisterSocial': 'Auth/AuthController.sellerRegisterSocial',
  // SellerAddress Controller
  'get /seller/my_addresses': 'Address/SellerAddressController.index',
  'post /seller/address': 'Address/SellerAddressController.create',
  'post /seller/address/update': 'Address/SellerAddressController.update',
  'post /seller/address/remove': 'Address/SellerAddressController.remove',
  // ConsumerAddress Controller
    'get /consumer/my_addresses': 'Address/ConsumerAddressController.index',
  'post /consumer/address': 'Address/ConsumerAddressController.create',
  'post /consumer/address/update': 'Address/ConsumerAddressController.update',
  'post /consumer/address/remove': 'Address/ConsumerAddressController.remove',
  // Shipping Controller
  'get /shipping': 'Shipping/ShippingController.index',
  'post /shipping': 'Shipping/ShippingController.create',
  'post /shipping/update': 'Shipping/ShippingController.update',
  'post /shipping/remove': 'Shipping/ShippingController.remove',
  // Shipping Company RateController
  'get /Shipping_Company_Rate': 'Shipping_Company/Shipping_Company_RateController.index',
  'post /Shipping_Company_Rate': 'Shipping_Company/Shipping_Company_RateController.create',
  'post /Shipping_Company_Rate/update': 'Shipping_Company/Shipping_Company_RateController.update',
  'post /Shipping_Company_Rate/remove': 'Shipping_Company/Shipping_Company_RateController.remove',
  // Shipping Company Controller
  'get /shipping_company': 'Shipping_Company/Shipping_CompanyController.index',
  'get /getShipping_CompanyById': 'Shipping_Company/Shipping_CompanyController.getShipping_CompanyById',
  'post /shipping_company': 'Shipping_Company/Shipping_CompanyController.create',
  'post /ChangeShipping_CompanyStatus': 'Shipping_Company/Shipping_CompanyController.ChangeShipping_CompanyStatus',
  'post /shipping_company/edit': 'Shipping_Company/Shipping_CompanyController.edit',
  'post /shipping_company/remove': 'Shipping_Company/Shipping_CompanyController.removeShipping_Company',
// chat controller
  'get /messages': 'Chat/ChatController.getMessages',
  'get /chat/message': 'Chat/ChatController.adminIndex',
  'post /message/send': 'Chat/ChatController.sendMessage',
  'post /message/subscribe': 'Chat/ChatController.subscribeToRoom',
  'post /message/leave': 'Chat/ChatController.leaveRoom',

  // cart Controller
  'post /cart/create': 'Cart/CartController.create',
  'get /cart': 'Cart/CartController.index',
  'get /cart_market': 'Cart/CartController.index_market',
  'post /cart/remove': 'Cart/CartController.removeCartProduct',
  'post /cart/removeproduct': 'Cart/CartController.removeProduct',
  'post /cart/changestatus': 'Cart/CartController.changeCartStatus',
  // CustomerNotifications Controller
  'post /customerNotifications': 'Notification/CustomerNotificationsController.index',
  'post /customerNotifications/create': 'Notification/CustomerNotificationsController.create',
  'post /customerNotifications/remove': 'Notification/CustomerNotificationsController.remove',
  'post /customerNotifications/removeAll': 'Notification/CustomerNotificationsController.removeAll',
  'post /customerNotifications/markAsRead': 'Notification/CustomerNotificationsController.markAsRead',
  'post /customerNotifications/markAllAsRead': 'Notification/CustomerNotificationsController.markAllAsRead',
  'post /customerNotifications/markAllAsReadByType': 'Notification/CustomerNotificationsController.markAllAsReadByType',
  'post /customerNotifications/countForSeller': 'Notification/CustomerNotificationsController.countForSeller',
  // Room Controller
  'get /room': 'Chat/RoomController.index',
  'get /room/unreadmessages': 'Chat/RoomController.getUnreadMessages',
  'get /room/getmessagescount': 'Chat/RoomController.getMessagesCount',
  'post /room/create': 'Chat/RoomController.create',
  'post /room/edit': 'Chat/RoomController.edit',
  'post /room/remove': 'Chat/RoomController.remove',
  'post /room/user/add': 'Chat/RoomController.addUserToRoom',
  'post /room/user/remove': 'Chat/RoomController.removeUserToRoom',
  // price offer controller
  'get /offer/price': 'OfferPrice/OfferPriceController.index',
  'post /offer/price/create': 'OfferPrice/OfferPriceController.create',
  'post /offer/price/remove': 'OfferPrice/OfferPriceController.remove',
  'get /offer/price/:id': 'OfferPrice/OfferPriceController.getById',
  'post /offer/price/changeSellerReadofferPrices': 'OfferPrice/OfferPriceController.changeSellerReadofferPrices',
  // offer price replay controller
  'get /offer/price/replay': 'OfferPrice/OfferPriceReplayController.index',
  'get /offer/price/unreadreplay': 'OfferPrice/OfferPriceReplayController.unreadreplay',
  'post /offer/price/replay/create': 'OfferPrice/OfferPriceReplayController.create',
  'post /offer/price/replay/remove': 'OfferPrice/OfferPriceReplayController.remove',
  'get /offer/price/replay/:id': 'OfferPrice/OfferPriceReplayController.getById',
  'get /sendnoti': 'OfferPrice/OfferPriceReplayController.sendnoti',
  // admin
  'get /adminauth': 'Admin/AdminController.index',
  'post /adminauth/login': 'Admin/AdminController.login',
  'post /adminauth/create': 'Admin/AdminController.addNewAdmin',
  'post /adminauth/varify': 'Admin/AdminController.varifyToken',
  'post /adminauth/remove': 'Admin/ADminController.DeleteAdmin',
  // Order
  'post /order': 'Order/OrderController.index',
  'get /order/:id': 'Order/OrderController.getOrderById',
  'post /order/:id': 'Order/OrderController.getOrderById',
  'post /orderindexForApp': 'Order/OrderController.indexForApp',
  'post /userOrder': 'Order/OrderController.userOrder',
  'post /userOrderQuery': 'Order/OrderController.userOrderQuery',
  'post /singleUserOrder': 'Order/OrderController.singleUserOrder',
  'post /indexDashboard': 'Order/OrderController.indexDashboard',
  'post /order/create': 'Order/OrderController.create',
  'post /order/createFastOrder': 'Order/OrderController.createFastOrder',
  'post /order/market': 'Order/OrderController.getMarketOrders',
  'post /ordr/status': 'Order/OrderController.ChangeOrderStatus',
  'post /order/notification': 'Order/OrderController.changeReadOrders',
  'post /order/unread': 'Order/OrderController.getUnreadOrders',
  'post /order/remove': 'Order/OrderController.removeOrder',
  'post /order/product/status': 'Order/OrderController.changeProductInOrderStatus',
  'post /order/statusByMarket': 'Order/OrderController.statusByMarket',
  'post /order/changeReadOrdersNotifications': 'Order/OrderController.changeReadOrdersNotifications',
  'post /order/OrderRecieved': 'Order/OrderController.OrderRecieved',
  'get /order/CheckReturnedOrders': 'Order/OrderController.CheckReturnedOrders',
  //product  ss
  'get /product': 'Product/ProductController.index',
  'get /product/marketDetails': 'Product/ProductController.index_marketDetails',
  'get /product_market': 'Product/ProductController.index_market',
  'get /product/:id': 'Product/ProductController.getProductById',
  'get /product/awshn': 'Product/ProductController.getAwshnProducts',
  'post /product/delete': 'Product/ProductController.delete',
  'post /product/create': 'Product/ProductController.create',
  'post /product/create/multiple': 'Product/ProductController.ReadMultibleProducts',
  'post /product/market': 'Product/ProductController.getMarketProducts',
  'post /product/market/no_offer': 'Product/ProductController.getMarketProductsNoOffer',
  'post /product/market/no_offer_with_offer': 'Product/ProductController.getMarketProductsNoOfferWithOffer',
  'post /product/search': 'Product/ProductController.search',
  'post /product/status': 'Product/ProductController.changeProductStatus',
  'post /product/awshn': 'Product/ProductController.AddAwshnProductsToMarket',
  'post /product/create/excel': 'Product/ProductController.ReadAwshnProducts',
  'post /product/create/market/excel': 'Product/ProductController.readProductsAsExcel',
  'post /product/edit': 'Product/ProductController.edit',
  'post /product/pdf': 'Product/ProductController.readMarketProductAsPDf',
  'post /product/sortMultiple': 'Product/ProductController.sortMultiple',
  // ptoduct category
  'get /product/category': 'Product/ProductCategoryController.index',
  'get /product/category/:id': 'Product/ProductCategoryController.getCategoryById',
  'post /product/category/create': 'Product/ProductCategoryController.create',
  'post /product/category/remove': 'Product/ProductCategoryController.remove',
  'post /product/category/edit': 'Product/ProductCategoryController.edit',
  'post /product/category/request': 'Product/ProductCategoryController.requestToaddNewCategory',
  // ptoduct Sub category
  'get /product/subcategory_product': 'Product/ProductSubCategoryController.getSubCategoriesWithProducts',
  'get /product/subcategory': 'Product/ProductSubCategoryController.index',
  'post /product/subcategory/create': 'Product/ProductSubCategoryController.create',
  'post /product/subcategory/remove': 'Product/ProductSubCategoryController.delete',
  'post /product/subcategory/edit': 'Product/ProductSubCategoryController.edit',
  'post /product/subcategory/filter': 'Product/ProductSubCategoryController.filter',
  // ptoduct Sub Sub category
  'get /product/subsubcategory': 'Product/ProductSubSubCategoryController.index',
  'post /product/subsubcategory/create': 'Product/ProductSubSubCategoryController.create',
  'post /product/subsubcategory/remove': 'Product/ProductSubSubCategoryController.remove',
  'post /product/subsubcategory/edit': 'Product/ProductSubSubCategoryController.edit',
  'post /product/subsubcategory/filter': 'Product/ProductSubSubCategoryController.filter',
  // product Favorite
  'get /product/favorite': 'Product/ProductFavoriteController.index',
  'post /product/favorite/create': 'Product/ProductFavoriteController.create',
  'post /product/favorite/remove': 'Product/ProductFavoriteController.delete',
  // product Rate
  'get /product/rate': 'Product/ProductRateController.index',
  'post /product/rate/create': 'Product/ProductRateController.create',
  'post /product/rate/remove': 'Product/ProductRateController.remove',
  'post /product/rate/edit': 'Product/ProductRateController.edit',
  // product offers
  'get /product/offer/all': 'Product/ProductOfferController.offerIndex',
  'post /product/offer': 'Product/ProductOfferController.index',
  'post /product/offer/ungrouped': 'Product/ProductOfferController.getAllOffers',
  'post /product/offer/market': 'Product/ProductOfferController.getAllOffersMarket',
  'post /product/offer/create/multiable': 'Product/ProductOfferController.addofferWithMultiableProduct',
  'post /product/offer/edit/multiable': 'Product/ProductOfferController.updateOfferWithMultiableProduct',
  'post /product/offer/create': 'Product/ProductOfferController.create',
  'post /product/offer/edit': 'Product/ProductOfferController.edit',
  'post /product/offer/remove': 'Product/ProductOfferController.remove',
  'post /product/offer/edit': 'Product/ProductOfferController.edit',
  'post /product/offer/status': 'Product/ProductOfferController.changeOfferStatus',
  'post /product/offer/single': 'Product/ProductOfferController.single',
  //client
  'get /client': 'Client/ClientController.getAllClients',
  'post /client/create': 'Client/ClientController.create',
  'post /client/remove': 'Client/ClientController.delete',
  'post /client/edit': 'Client/ClientController.edit',
  'post /cient/pay': 'Client/ClientController.payforClient',
  'post /client/excel': 'Client/ClientController.getClientasExcel',
  'post /client/oneexcel': 'Client/ClientController.getOneClientAsExcel',
  //  Supplier
  'get /supplier': 'Supplier/SupplierController.getAllSuppliers',
  'post /supplier/create': 'Supplier/SupplierController.create',
  'post /supplier/remove': 'Supplier/SupplierController.delete',
  'post /supplier/edit': 'Supplier/SupplierController.edit',
  'post /supplier/pay': 'Supplier/SupplierController.payforSupplier',
  'post /supplier/excel': 'Supplier/SupplierController.getSupplierssExcel',
  'post /supplier/oneexcel': 'Supplier/SupplierController.getOneSupplierAsExcel',
  // Market
  'get /send_noti_market': 'Market/MarketController.sendnotimarket',
  'get /market/:id': 'Market/MarketController.getMarketById',
  'get /market': 'Market/MarketController.getAllMarkets',
  'post /market/create': 'Market/MarketController.create',
  'post /market/filter/geolocation': 'Market/MarketController.filterMarketsWithLatAndLng',
  'post /market/edit': 'Market/MarketController.edit',
  'post /market/remove': 'Market/MarketController.delete',
  'post /market/status': 'Market/MarketController.changeMarketStatus',
  'post /market/profit/pdf': 'Market/MarketController.ProfitasPDF',
  'post /market/excel': 'Market/MarketController.getMarketsAsExcel',
  'post /market/sortMultiple': 'Market/MarketController.sortMultiple',
  'post /market/change_col': 'Market/MarketController.change_col',
  // market banners
  'get /market/banner': 'Market/MarketBannerController.index',
  'get /market/banner/getAllMarketsBanners': 'Market/MarketBannerController.getAllMarketsBanners',
  'get /market/banner/:id': 'Market/MarketBannerController.getById',
  'post /market/banner/create': 'Market/MarketBannerController.create',
  'post /market/banner/remove': 'Market/MarketBannerController.remove',
  'post /market/banner/edit': 'Market/MarketBannerController.edit',
  'get /market/banner/comment': 'Market/MarketBannerController.commentIndex',
  'post /market/banner/comment/create': 'Market/MarketBannerController.createComment',
  'post /market/banner/like': 'Market/MarketBannerController.likeBanner',
  'get /market/MarketsCategories': 'Market/MarketController.MarketsCategories',
  // market Customer
  'post /market/customer': 'Market/MarketCustomerController.index',
  'post /market/customer/create': 'Market/MarketCustomerController.create',
  'post /market/customer/create_many': 'Market/MarketCustomerController.create_many',
  // market Cart
  'post /market/cart': 'Market/MarketCartController.index',
  'post /market/cart/create': 'Market/MarketCartController.create',
  'get /market/cart/last_id': 'Market/MarketCartController.last_id',
  'get /market/cart/show': 'Market/MarketCartController.get_market_cart',

  // market Category
  'get /market/category': 'Market/MarketCategoryController.getAllcategory',
  'post /market/category/create': 'Market/MarketCategoryController.create',
  'post /market/category/edit': 'Market/MarketCategoryController.edit',
  'post /market/category/remove': 'Market/MarketCategoryController.delete',
  // market Rate
  'get /market/rate': 'market/MarketRateController.index',
  'post /market/rate/create': 'market/MarketRateController.create',
  'post /market/rate/remove': 'market/MarketRateController.remove',
  'post /market/rate/edit': 'market/MarketRateController.edit',
  // safe
  'post /safe/amount': 'Safe/SafeController.addAmountToSafe',
  'get /safe/transaction': 'Safe/TransactionController.index',
  'post /safe/transaction/create': 'Safe/TransactionController.create',
  // Sales
  'get /sales': 'Sales/SalesController.index',
  'post /sales/create': 'Sales/SalesController.create',
  'post /sales/excel': 'Sales/SalesController.getAllSalesAsExcel',
  'post /sales/pdf': 'Sales/SalesController.getSalesAsPDF',
  // Purchases
  'get /purchases': 'Purchases/PurchasesController.index',
  'post /purchases/create': 'Purchases/PurchasesController.create',
  'post /purchases/excel': 'Purchases/PurchasesController.getAllPurchasesAsExcel',
  'post /purchases/pdf': 'Purchases/PurchasesController.getPurchasesAsPDF',
  // favorite
  'get /favorite': 'Favorite/FavoriteController.index',
  'post /favorite/create': 'Favorite/FavoriteController.create',
  'post /favorite/remove': 'Favorite/FavoriteController.remove',
  'post /favorite/edit': 'Favorite/FavoriteController.edit',
  'post /favorite/filter': 'Favorite/FavoriteController.getOffersFilterdByMarketsId',
  // Notifications
  'get /notification': 'Notification/NotificationController.index',
  'post /notification/remove': 'Notification/NotificationController.remove',
  'post /notification/create': 'Notification/NotificationController.createNotification',
  'post /notification/send': 'Notification/NotificationController.sendNotification',
  'post /notification/remove/all': 'Notification/NotificationController.removeAll',
  //extra
  // Sponnserd Banners
  'get /banner': 'Banners/SponnserdBannersController.index',
  'post /banner/create': 'Banners/SponnserdBannersController.create',
  'post /banner/edit': 'Banners/SponnserdBannersController.edit',
  'post /banner/remove': 'Banners/SponnserdBannersController.delete',
  //  locations
  //    city
  'get /location/cities': 'extra/LocationController.getallCity',
  'post /location/moreCities': 'extra/LocationController.moreCities',
  'get /location/filtercities/:country_id': 'extra/LocationController.filterCitiesAccordingToCountry',
  'post /location/city/create': 'extra/LocationController.addNewCity',
  'post /location/city/remove': 'extra/LocationController.deleteCity',
  'post /location/city/edit': 'extra/LocationController.editCity',
  //    country
  'get /location/countries': 'extra/LocationController.getallCountry',
  'post /location/country/create': 'extra/LocationController.addNewCountry',
  'post /location/country/remove': 'extra/LocationController.deleteCountry',
  'post /location/country/edit': 'extra/LocationController.editCountry',


  // setting
  'get /setting': 'SettingController.index',
  'post /setting/update': 'SettingController.update',

  //coupon
  'post /coupon/create': 'Coupon/CouponController.create',
  'post /coupon/update': 'Coupon/CouponController.update',
  'post /coupon/single': 'Coupon/CouponController.single',
  'post /coupon/marketCoupons': 'Coupon/CouponController.marketCoupons',
  'post /coupon/productsCreateList': 'Coupon/CouponController.productsCreateList',
  'post /coupon/productsUpdateList': 'Coupon/CouponController.productsUpdateList',
  'post /coupon/delete': 'Coupon/CouponController.delete',
  'post /coupon/changeStatus': 'Coupon/CouponController.changeStatus',
  'post /coupon/check': 'Coupon/CouponController.checkCoupon',
  //Slide
  'get /slide': 'Slide/SlideController.index',
  'post /slide/create': 'Slide/SlideController.create',
  'post /slide/update': 'Slide/SlideController.update',
  'post /slide/single': 'Slide/SlideController.single',
  'post /slide/delete': 'Slide/SlideController.delete',
  // expired offers and coupons cronjob
  'get /product/expiredOffersCoupons': 'Product/ProductOfferController.expiredOffersCoupons',
  // Offers Banners
  'get /offerBanners': 'Offers/OfferBannersController.index',
  'get /offerBanners/web': 'Offers/OfferBannersController.indexWeb',
  'get /offerBanners/bannerProducts': 'Offers/OfferBannersController.bannerProducts',
  'post /offerBanners/create': 'Offers/OfferBannersController.create',
  'post /offerBanners/update': 'Offers/OfferBannersController.update',
  'post /offerBanners/delete': 'Offers/OfferBannersController.delete',
  'get /sitemap_products.xml': 'SettingController.sitemapProducts',
  'get /sitemap_markets.xml': 'SettingController.sitemapMarkets',

    // favorite2 Controller
    'post /favorite2/create': 'Favorite2/Favorite2Controller.create',
    'get /favorite2': 'Favorite2/Favorite2Controller.index',
    'get /favorite2_market': 'Favorite2/Favorite2Controller.index_market',
    'post /favorite2/remove': 'Favorite2/Favorite2Controller.removeCartProduct',
    'post /favorite2/removeproduct': 'Favorite2/Favorite2Controller.removeProduct',
    'post /favorite2/changestatus': 'Favorite2/Favorite2Controller.changeCartStatus',
  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};
