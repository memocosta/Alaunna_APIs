/**
 * ProductSubCategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  index: async function (req, res) {
    try {
      var offset = req.param('offset');
      let category_id = req.param('category_id');
      var filterOBJ = { where: {} };
      filterOBJ['include'] = ['image'];
      if (offset && offset != 'false') {
        filterOBJ['offset'] = offset * 10;
        filterOBJ['limit'] = 10;
        filterOBJ['include'].push('category');
      }
      if (category_id && category_id != 'false') {
        filterOBJ['where']['productcategory_id'] = category_id;
      }
      var SeletecsubCategories = await ProductSubCategory.findAndCountAll(filterOBJ);
      return ResponseService.SuccessResponse(res, 'success for getting the subcategory', SeletecsubCategories);
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when fetching the subcategory data', e);
    }
  },
  create: async function (req, res) {
    try {
      var subcategoryOBJ = {
        name: req.param('name'),
        description: req.param('description'),
        productcategory_id: req.param('category_id'),
        inputs: req.param('inputs')
      };
      if (subcategoryOBJ.name && subcategoryOBJ.description && subcategoryOBJ.productcategory_id) {
        var createdSubCategory = await ProductSubCategory.create(subcategoryOBJ);
        var image = req.param('image');
        if (image) {
          var image = await sails.helpers.uploadImage(image.base64, createdSubCategory.name, image.alt, image.description, 'product/subcategory' , 220 , 220);
          createdSubCategory.image_id = image.id;
          await createdSubCategory.save();
        }
        return ResponseService.SuccessResponse(res, 'success for creating the subcategiry', createdSubCategory);
      } else {
        return ResponseService.ErrorResponse(res, 'please provide the subcategory data');
      }
    } catch (e) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when creating the subcategory', e);
    }
  },
  delete: async function (req, res) {
    try {
      var subcat_id = req.param('subcategory_id');
      if (subcat_id) {
        var deletedSubCategory = await ProductSubCategory.findOne({ where: { id: subcat_id } });
        await deletedSubCategory.destroy();
        return ResponseService.SuccessResponse(res, 'success for deleting the sub category', deletedSubCategory);
      } else {
        return ResponseService.ErrorResponse(res, 'please provide the subcategory id');
      }
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when removing the subcategory', e);
    }
  },
  edit: async function (req, res) {
    try {
      var SubcategoryOBJ = {
        id: req.param('id'),
        name: req.param('name'),
        description: req.param('description'),
        inputs: req.param('inputs'),
        image: req.param('image'),
        productcategory_id: req.param('productcategory_id')
      }
      if (SubcategoryOBJ.id && SubcategoryOBJ.name && SubcategoryOBJ.description && SubcategoryOBJ.description && SubcategoryOBJ.inputs) {
        var SeletedSubCategory = await ProductSubCategory.findOne({ where: { id: SubcategoryOBJ.id } });
        SeletedSubCategory.name = SubcategoryOBJ.name;
        SeletedSubCategory.description = SubcategoryOBJ.description;
        SeletedSubCategory.inputs = SubcategoryOBJ.inputs;
        SeletedSubCategory.productcategory_id = SubcategoryOBJ.productcategory_id;
        //await sails.helpers.updateImage(SubcategoryOBJ.image);
        await SeletedSubCategory.save();
        return ResponseService.SuccessResponse(res, 'product category has been updated successfully', SeletedSubCategory);
      } else {
        return ResponseService.ErrorResponse(res, 'please provide all category data');
      }
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when update the Sub category', e);
    }
  },
  filter: async function (req, res) {
    try {
      var category_id = req.param('category_id');
      var offset = req.param('offset');
      var filterOBJ = {};
      if (category_id) {
        filterOBJ['where'] = { category_id: category_id };
        filterOBJ['include'] = ['image'];
        if (offset) {
          filterOBJ['offset'] = offset * 10;
          filterOBJ['limit'] = 10;
        }
        var FilterdSubCategories = await ProductSubCategory.findAndCountAll(filterOBJ);
        return ResponseService.SuccessResponse(res, 'success for filter the sub categry', FilterdSubCategories);
      } else {
        return ResponseService.SuccessResponse(res, 'please provider the filter category id');
      }
    } catch (e) {
      return ResponseService.SuccessResponse(res, 'something wrong happen when fetching the subcategories', e);
    }
  },
  getSubCategoriesWithProducts: async function (req, res) {
    try {
      let market_id = req.param('market_id');
      await Market.update({ views: Sequelize.literal('views + 1') }, { where: { id: market_id } });
      let SelectedSubCategories = await ProductSubCategory.findAll({
        include: [{
          model: Product, as: 'products', where: { owner: market_id, status: 'active' }, include: [{
            model: Market,
            as: 'market',
            include: ['Image'],
            through: {
              where: {
                Showen: true
              }
            },
            required: true
          }], limit: 8
        }]
      })
      return ResponseService.SuccessResponse(res, 'success for getting all subcategoris with products', SelectedSubCategories)
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'error when get the subcategories', { action: 'invalid-error', error: err });
    }
  }
};

