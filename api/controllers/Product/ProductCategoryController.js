/**
 * ProductCategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  index: async function (req, res) {
    try {
      var offset = req.param('offset');
      let includeSubcategories = req.param('incoudeSubcategories');
      let includeProducts = req.param('includeProducts');
      let includeMarkets = req.param('includeMarkets');
      let specialMarket = req.param('special');
      var filterOBJ = {};
      if (offset) {
        filterOBJ['offset'] = offset * 10;
        filterOBJ['limit'] = 10;
      }
      filterOBJ['include'] = ['image'];
      if (includeSubcategories && includeSubcategories != 'false') {
        filterOBJ['include'].push('subCategories');
      }
      if (includeProducts && includeProducts != 'false') {
        filterOBJ['include'].push({
          model: Product,
          as: 'products',
          limit: 6,
          where: {
            status: 'active'
          },
          include: [{
            model: Market,
            as: 'market',
            include: ['Image'],
            where: {
              status: 'active'
            },
            through: {
              where: {
                Showen: true
              }
            },
            required: true
          }]
        });
      }
      if (includeMarkets && includeMarkets != 'false') {
        let WhereOBJ = {
          status: 'active'
        };
        if (specialMarket == 'false') {
          WhereOBJ['special'] = false;
        } else if (specialMarket == 'true') {
          WhereOBJ['special'] = true;
        }
        filterOBJ['include'].push({
          model: Market,
          as: 'markets',
          where: WhereOBJ,
          include: ['Image', 'Category', 'City', 'Country', 'cover'],
          limit: 10
        })

      }
      var SelectedData = await ProductCategory.findAndCountAll(filterOBJ);
      return ResponseService.SuccessResponse(res, 'the category data was retevied succesffully', SelectedData);
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'somrthing wrong happen when fetch the category data', e);
    }
  },
  create: async function (req, res) {
    try {
      var categoryOBJ = {
        name: req.param('name'),
        description: req.param('description'),
        inputs: req.param('inputs')
      }
      if (categoryOBJ.name && categoryOBJ.description && categoryOBJ.inputs) {
        var CreatedCategory = await ProductCategory.create(categoryOBJ);
        var image = req.param('image');
        if (image) {
          var image = await sails.helpers.uploadImage(image.base64, CreatedCategory.name, image.alt, image.description, 'product/category', 220 , 220);
          CreatedCategory['image_id'] = image.id;
          CreatedCategory.save();
        }
        var finalResult = CreatedCategory.toJSON();
        return ResponseService.SuccessResponse(res, 'success for creating the category', finalResult);
      } else {
        return ResponseService.ErrorResponse(res, 'please provide all category data');
      }
    } catch (error) {
      return ResponseService.ErrorResponse(res, 'somrthing wrong happen when create the category', error);
    }
  },
  remove: async function (req, res) {
    try {
      var category_id = req.param('id');
      if (category_id) {
        var DeletedCategory = await ProductCategory.findOne({
          where: {
            id: category_id
          }
        });
        await DeletedCategory.destroy();
        return ResponseService.SuccessResponse(res, 'success for deleting the category', DeletedCategory);
      } else {
        return ResponseService.ErrorResponse(res, 'please provide category id');
      }
    } catch (e) {
      return ResponseService.ErrorResponse(res, 'somrthing wrong happen when delete the category', e);
    }
  },
  edit: async function (req, res) {
    try {
      var categoryOBJ = {
        id: req.param('id'),
        name: req.param('name'),
        description: req.param('description'),
        inputs: req.param('inputs'),
        image: req.param('image')
      }
      if (categoryOBJ.id && categoryOBJ.name && categoryOBJ.description && categoryOBJ.description && categoryOBJ.inputs) {
        var SeletedCategory = await ProductCategory.findOne({
          where: {
            id: categoryOBJ.id
          }
        });
        SeletedCategory.name = categoryOBJ.name;
        SeletedCategory.description = categoryOBJ.description;
        SeletedCategory.inputs = categoryOBJ.inputs;
        //await sails.helpers.updateImage(categoryOBJ.image);
        await SeletedCategory.save();
        return ResponseService.SuccessResponse(res, 'product category has been updated successfully', SeletedCategory);
      } else {
        return ResponseService.ErrorResponse(res, 'please provide all category data');
      }
    } catch (e) {
      console.log(e)
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when update the category', e);
    }
  },
  requestToaddNewCategory: async function (req, res) {
    try {
      var RequestOBJ = {
        name: req.param('name'),
        description: req.param('description'),
        userName: req.param('UserName')
      };
      // TODO: add the logic for add new categry;
      return ResponseService.SuccessResponse(res, 'done for sendin request', RequestOBJ);
    } catch (e) {
      return ResponseService.ErrorResponse(res, 'somthin wrong happen when create the category request', e);
    }
  },
  getCategoryById: async function (req, res) {
    try {
      const category_id = req.param('id');
      if (!category_id) {
        return ResponseService.ErrorResponse(res, 'please provide the category id', {
          action: 'invalid-id'
        });
      }
      let selectedCategory = await ProductCategory.findOne({
        where: {
          id: category_id
        }
      });
      return ResponseService.SuccessResponse(res, 'success for getting the product categoyr', selectedCategory);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthign wrong happen when getting the product category', {
        action: 'unkown-error',
        error: err
      });
    }
  }

};
