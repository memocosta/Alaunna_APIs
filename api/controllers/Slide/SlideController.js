/**
 * SlideController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    index: async function (req, res) {
        try {
            var offset = req.param(offset);
            var filterOBJ = {};
            if (offset) {
                filterOBJ['offset'] = offset * 10;
                filterOBJ['limit'] = 10;
            }
            let All = await Slide.findAndCountAll(filterOBJ);
            return ResponseService.SuccessResponse(res, 'success for get the Slides data', All);
        } catch (err) {
            return ResponseService.ErrorResponse(res, 'something wrong happen when get the Slides data', {
                error: err,
                action: 'unkown-error'
            });
        }
    },
    create: async function (req, res) {
        try {
            var SlideData = req.allParams();
            if (!SlideData.title || !SlideData.description) {
                return ResponseService.ErrorResponse(res, 'please provide all Slide data', { action: 'invalid-data' });
            }
            var CreatedSlide = await Slide.create(SlideData);
            return ResponseService.SuccessResponse(res, 'success for createing the new Slide', CreatedSlide);
        } catch (err) {
            console.log(err);
            return ResponseService.ErrorResponse(res, 'somthing wrong happen when creating the new Slide', { action: 'error', error: err });
        }
    },
    update: async function (req, res) {
        try {
            var slide_id = req.param('id');
            if (!slide_id) {
                return ResponseService.ErrorResponse(res, 'please provide the slide id');
            }
            var slide = await Slide.findOne({ where: { id: slide_id } });
            slide.title = req.param('title');
            slide.description = req.param('description');
            await slide.save();
            return ResponseService.SuccessResponse(res, 'success for update the slide', slide);
        } catch (err) {
            return ResponseService.ErrorResponse(res, 'somthign wrong happen when update the slide', err);
        }
    },
    delete: async function (req, res) {
        try {
            var slide_id = req.param('slide_id');
            if (!slide_id) {
                return ResponseService.ErrorResponse(res, 'please provide the slide id');
            }
            var slide = await Slide.findOne({ where: { id: slide_id } });
            await slide.destroy();
            return ResponseService.SuccessResponse(res, 'success for deleteing the slide', slide);
        } catch (err) {
            return ResponseService.ErrorResponse(res, 'somthign wrong happen when delete the slide', err);
        }
    }

};

