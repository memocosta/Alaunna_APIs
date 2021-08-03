/**
 * MarketCategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    create: async function (req, res) {
        try {
            var categoryOB = {
                name: req.param('name'),
                description: req.param('description')
            }
            if (categoryOB.name && categoryOB.description) {
                // TODO: change this to product category
                var image = req.param('image');
                if (image) {
                    var image = await sails.helpers.uploadImage(image.base64, CreatedCategory.name, image.alt, image.description, 'product/category' , 220 , 220);
                    CreatedCategory['image_id'] = image.id;
                    CreatedCategory.save();
                }
                var CreatedCategory = await ProductCategory.create(categoryOB);
                return ResponseService.SuccessResponse(res, 'success for creating the Market category', CreatedCategory);
            } else {
                return ResponseService.ErrorResponse(res, 'please provide all category data');
            }
        } catch (e) {
            return ResponseService.ErrorResponse(res, 'somthing wrong happen when create the category', e);
        }
    },
    edit: async function (req, res) {
        try {
            var categoryOBJ = {
                id: req.param('id'),
                name: req.param('name'),
                description: req.param('description')
            }
            if (categoryOBJ.id && categoryOBJ.name && categoryOBJ.description) {
                var SelectedCategry = await ProductCategory.findOne({ where: { id: categoryOBJ.id } });
                SelectedCategry.name = categoryOBJ.name;
                SelectedCategry.description = categoryOBJ.description;
                SelectedCategry.save();
                return ResponseService.SuccessResponse(res, 'success for edit the category', SelectedCategry)
            } else {
                return ResponseService.ErrorResponse(res, 'please provide all category data');
            }
        } catch (e) {
            console.log(e);
            return ResponseService.ErrorResponse(res, 'somthing wrong happen when edit the category', e);
        }
    },
    delete: async function (req, res) {
        try {
            var category_id = req.param('id');
            if (category_id) {
                var DeletedCategory = await ProductCategory.findOne({ where: { id: category_id } });
                await DeletedCategory.destroy();
                return ResponseService.SuccessResponse(res, 'success for deleteing the category', DeletedCategory);
            } else {
                return ResponseService.ErrorResponse(res, 'please provide the category id');
            }
        } catch (e) {
            return ResponseService.ErrorResponse(res, 'somthing wrong happen when delete the category', e);
        }
    },
    getAllcategory: async function (req, res) {
        try {
            var offset = req.param('offset');
            let FilterObj = {};
            if (offset && offset != 'false' ) {
                FilterObj = { limit: 10, offset: offset * 10 };
            }
            var SelectedCategry = await ProductCategory.findAndCountAll(FilterObj);
            return ResponseService.SuccessResponse(res, 'success for getting the categories', SelectedCategry);
        } catch (e) {
            return ResponseService.ErrorResponse(res, 'something wrong happen when get the categories');
        }
    }

};

