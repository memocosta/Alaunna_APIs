/**
 * SponnserdBannersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    index: async function (req, res) {
        try {
            var offset = req.param('offset');
            var forValue = req.param('for_value');
            var subforValue = req.param('subfor_value');
            var filterOBJ = {};
            var whereOBJ = {};

            if (forValue) {
                whereOBJ['for'] = forValue;
            }
            if (subforValue) {
                whereOBJ['sub_for'] = subforValue;
            }
            if (offset) {
                filterOBJ['offset'] = offset * 10;
                filterOBJ['limit'] = 10;
            }
            filterOBJ['include'] = ['image'];
            filterOBJ['where'] = whereOBJ;
            filterOBJ['order'] = [['id' , 'DESC']]

            var SeletecBanners = await SponserdBanners.findAndCountAll(filterOBJ);
            return ResponseService.SuccessResponse(res, 'success for getting all banners', SeletecBanners);
        } catch (err) {
            return ResponseService.ErrorResponse(res, 'somthign wrong happen when get the banners', err);
        }
    },
    create: async function (req, res) {
        try {
            var params = req.allParams();

            if (!params.title || !params.link || !params.image) {
                return ResponseService.ErrorResponse(res, 'please provide the title and the image', { action: 'invalid-data' });
            }
            if (params.image.for == 'main_banners') {
                var image = await sails.helpers.uploadImage(params.image.base64, params.title, params.image.alt, params.image.description, 'main_banners', 1240, 250, { isBanner: true });
            }
            else if (params.image.for == 'singel_banners') {
                var image = await sails.helpers.uploadImage(params.image.base64, params.title, params.image.alt, params.image.description, 'singel_banners', 1100, 175, { isBanner: true });
            }
            
            else if (params.image.for == 'contact_banners') {
                var image = await sails.helpers.uploadImage(params.image.base64, params.title, params.image.alt, params.image.description, 'contact_banners', 1290, 260, { isBanner: true });
            }

            else {
                var image = await sails.helpers.uploadImage(params.image.base64, params.title, params.image.alt, params.image.description, 'banners', 276, 222, { isBanner: true });
            }

            params['image_id'] = image.id;
            var createdBanners = await SponserdBanners.create(params);
            return ResponseService.SuccessResponse(res, 'success for creating the banners', createdBanners);
        } catch (err) {
            console.log(err);
            return ResponseService.ErrorResponse(res, 'somthing wrong happen when create the banner', err);
        }
    },
    delete: async function (req, res) {
        try {
            var banner_id = req.param('id');
            if (!banner_id) {
                return ResponseService.ErrorResponse(res, 'please provide the banner_id', { action: 'invalid-id' });
            }
            var SelectedBanner = await SponserdBanners.findOne({ where: { id: banner_id } });
            SelectedBanner.destroy();
            return ResponseService.SuccessResponse(res, 'success for remove sponserd banners', SelectedBanner);
        } catch (err) {
            return ResponseService.ErrorResponse(res, 'somthing wrong happen when delete the banner', err);
        }
    },
    edit: async function (req, res) {
        try {
            var params = req.allParams();
            if (!params.id) {
                return ResponseService.ErrorResponse(res, 'please provide the banner_id', { action: 'invalid-id' });
            }
            var SelectedBanner = await SponserdBanners.findOne({ where: { id: params.id } });
            SelectedBanner.title = params.title;
            SelectedBanner.description = params.description;
            SelectedBanner.link = params.link;
            SelectedBanner.sub_for = params.sub_for;
            SelectedBanner.for = params.for;
            if (params.image.action == 'edited') {
                if (params.image.for == 'main_banners') {
                await sails.helpers.updateImage(params.image.id, params.image.base64, params.image.alt, params.image.description,  1240, 250, { isBanner: true });
                }
                else if (params.image.for == 'singel_banners') {
                    await sails.helpers.updateImage(params.image.id, params.image.base64, params.image.alt, params.image.description,  1100, 175, { isBanner: true });
                }
                else if (params.image.for == 'banners') {
                    await sails.helpers.updateImage(params.image.id, params.image.base64, params.image.alt, params.image.description, 276, 222, { isBanner: true });
                }
                else if (params.image.for == 'contact_banners') {
                    await sails.helpers.updateImage(params.image.id, params.image.base64, params.image.alt, params.image.description, 1290, 260, { isBanner: true });
                }
            }
            else if (params.image.action == 'new') {
                var image = await sails.helpers.uploadImage(params.image.base64, params.title, params.image.alt, params.image.description, 'banners', 276, 222, { isBanner: true });
                SelectedBanner['image_id'] = image.id;
            } else {
                await Image.update({ alt: params.image.alt, description: params.image.description }, { where: { id: params.image.id } });
            }
            await SelectedBanner.save();
            return ResponseService.SuccessResponse(res, 'success for editing the all params', SelectedBanner);
        } catch (err) {
            console.log(err);
            return ResponseService.ErrorResponse(res, 'somthing wrong happen when delete the banner', err);
        }
    },
};

