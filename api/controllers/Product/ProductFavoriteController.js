/**
 * ProductFavoriteController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  index : async function (req , res) {
      try {
          let user_id = req.param('user_id');
          let product_id = req.param('product_id');
          let offset = req.param('offset');
          let filterOBJ = {where : {}};

          if (user_id && user_id != 'false'){
              filterOBJ['where']['user_id'] = user_id;
          }

          if (product_id && product_id != 'false'){
              filterOBJ['where']['product_id'] = product_id;
          }

          if (offset && offset != 'false'){
              filterOBJ['limit'] = 12;
              filterOBJ['offset'] = 12 * offset;
          }
          filterOBJ['include'] = [{model : Product , as : 'product' , include : [{model : Market , as : 'market' , through : {where : {Showen : true}} , required : true}]}];
          let selectedProductsFavorite = await ProductFavorite.findAndCountAll(filterOBJ);
          return ResponseService.SuccessResponse(res , 'success for getting all product favorite' , selectedProductsFavorite);
      } catch (err) {
          console.log(err);
          return ResponseService.ErrorResponse(res , 'somthing wrong happen when get the product favorite' , {action : 'unkown-error' , error : err});
      }
  },
  create : async function(req , res){
      try {
          let user_id = req.param('user_id');
          let product_id = req.param('product_id');
          if (!user_id || !product_id){
              return ResponseService.ErrorResponse(res ,'please add a valid user_id and product_id' , {action : 'invalid-data' });
          }
          let checkExist = await ProductFavorite.findOne({where : {product_id : product_id , user_id : user_id}});
          if (checkExist){
              return ResponseService.ErrorResponse(res , 'this product exists before in your favorite' , {action : 'exists-before'} );
          }
          let CreatedFav = await ProductFavorite.create({product_id : product_id , user_id : user_id});
          return ResponseService.SuccessResponse(res , 'success for creating the favorite' , CreatedFav);
      } catch (err) {
          return ResponseService.ErrorResponse(res , 'somthing wrong happen when create new favorite' , {action : 'unkown-error' })
      }
  },
  delete: async function(req , res){
    try {
        let id = req.param('id');
        if (!id){
            return ResponseService.ErrorResponse(res , 'please provide valid id' , {action : 'unkown-error'})
        }
        let deletedFav = await ProductFavorite.findOne({where : {id : id}});
        deletedFav.destroy();
        return ResponseService.SuccessResponse(res , 'success for deleting the favorite' , deletedFav);
    } catch (e) {
        return ResponseService.ErrorResponse(res, 'somthing wrong happen when deleteing the product favortie', e);
    }
  }
};

