/**
 * ProductSubSubCategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    index: async function (req, res) {
        try {
            var offset = req.param('offset');
            let subcategory_id = req.param('subcategory_id');
            var filterOBj = {where : {}};
            if (offset && offset != 'false') {
                filterOBj['offset'] = offset * 10;
                filterOBj['limit'] = 10;
                filterOBj['include'] = ['subCategory'];
            }
            if (subcategory_id && subcategory_id != 'false'){
                filterOBj['where']['subCategory_id'] = subcategory_id;
            }
            var seletctobjcts = await ProductSubSubCategory.findAndCountAll(filterOBj);
            return ResponseService.SuccessResponse(res, 'success getting all sub sub categoryies', seletctobjcts);
        } catch (e) {
            console.log(e);
            return ResponseService.ErrorResponse(res, 'something wrong happen when get the sub sub categories', e);
        }
    },
    create: async function (req, res) {
        try {
            var subsubcategoryOBJ = {
                name: req.param('name'),
                description: req.param('description'),
                subCategory_id: req.param('subCategory_id'),
                inputs: req.param('inputs')
            };
            if (subsubcategoryOBJ.name && subsubcategoryOBJ.description && subsubcategoryOBJ.subCategory_id) {
                var createdSubSubCategory = await ProductSubSubCategory.create(subsubcategoryOBJ);
                var image = req.param('image');
                if (image) {
                    var image = await sails.helpers.uploadImage(image.base64, createdSubSubCategory.name, image.alt, image.description, 'product/subcategory' , 220 , 220);
                    createdSubSubCategory.image_id = image.id;
                    await createdSubSubCategory.save();
                }
                return ResponseService.SuccessResponse(res, 'success for creating the sub sub catgory' , createdSubSubCategory);
            } else {
                return ResponseService.ErrorResponse(res, 'please provide the subcategory data');
            }
        } catch (e) {
            return ResponseService.ErrorResponse(res, 'somthing wrong happen when creating the subsubcategory', e);
        }
    },
    remove: async function (req, res) {
        try {
            var id = req.param('id');
            if (id) {
                let DeletedSubSubCategory = await ProductSubSubCategory.findOne({ where: { id: id } });
                await DeletedSubSubCategory.destroy();
                return ResponseService.SuccessResponse(res, 'success for deleting the product sub sub category', DeletedSubSubCategory);
            } else {
                return ResponseService.ErrorResponse(res, 'please provide the subSub category id');
            }
        } catch (e) {
          console.log(e);
            return ResponseService.ErrorResponse(res, 'somthing wrong happen when deleteing the subsubcategory', e);
        }
    },
    edit: async function (req, res) {
        try {
            var SubSubcategoryOBJ = {
                id: req.param('id'),
                name: req.param('name'),
                description: req.param('description'),
                inputs: req.param('inputs'),
                subCategory_id : req.param('subCategory_id'),
            }
            if (SubSubcategoryOBJ.id && SubSubcategoryOBJ.name && SubSubcategoryOBJ.description && SubSubcategoryOBJ.subCategory_id && SubSubcategoryOBJ.inputs) {
                var SeletedSubSubCategory = await ProductSubSubCategory.findOne({ where: { id: SubSubcategoryOBJ.id } });
                SeletedSubSubCategory.name = SubSubcategoryOBJ.name;
                SeletedSubSubCategory.description = SubSubcategoryOBJ.description;
                SeletedSubSubCategory.subCategory_id =SubSubcategoryOBJ.subCategory_id;
                SeletedSubSubCategory.inputs = SubSubcategoryOBJ.inputs;
                await SeletedSubSubCategory.save();
                return ResponseService.SuccessResponse(res, 'product Sub Subcategory has been updated successfully', SeletedSubSubCategory);
            } else {
                return ResponseService.ErrorResponse(res, 'please provide all Sub Sub category data');
            }
        } catch (e) {
            return ResponseService.ErrorResponse(res, 'somthing wrong happen when update the Sub Sub category', e);
        }
    },
    filter: async function (req, res) {
        try {
            var subCategoryId = req.param('subcategory_id');
            var offset = req.param('offset');
            var filterOBJ = {};
            if (subCategoryId) {
                if (offset) {
                    filterOBJ = { offset: offset * 10, limit: 10 };
                }
                filterOBJ['where'] = { subCategory_id: subCategoryId }
                var SeletedSubSubCategory = await ProductSubSubCategory.findAndCountAll(filterOBJ);
                return ResponseService.SuccessResponse(res, 'success for getting all the sub sub category', SeletedSubSubCategory);
            } else {
                return ResponseService.ErrorResponse(res, 'please provide the subcategory id');
            }
        } catch (e) {
            return ResponseService.ErrorResponse(res, 'somthing wrong happen when get the Sub Sub category', e);
        }
    }
};

