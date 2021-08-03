/**
 * SettingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  index: async function (req, res) {
    try {
      let SelectedSettings = await Setting.findAll({ include: ['home_image'] });
      return ResponseService.SuccessResponse(res, 'success for getting all data for setting', SelectedSettings[0]);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthign wrong happen when get the settings', {
        action: 'unkown-err',
        error: err
      });
    }
  },
  create: async function (req, res) {

  },
  update: async function (req, res) {
    try {
      let params = req.allParams();
      let SelectedSetting = await Setting.findOne({
        where: {
          id: params.id
        }
      });
      if (params.home_image && params.home_image.action == 'edited') {
        await sails.helpers.updateImage(params.home_image.id, params.home_image.base64, params.home_image.alt, params.home_image.description, 1024, 768);
      }
      else if (params.home_image && params.home_image.action == 'new') {
        var image = await sails.helpers.uploadImage(params.home_image.base64, 'homePageImage', params.home_image.alt, params.home_image.description, 'home', 1024, 768);
        params['home_image_id'] = image.id;
      } else if (params.home_image) {
        await Image.update({ alt: params.home_image.alt, description: params.home_image.description }, { where: { id: params.home_image.id } });
      }

      await SelectedSetting.update(params);
      return ResponseService.SuccessResponse(res, 'success for update the settig params ', SelectedSetting);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthign wrong happen when update the settings', {
        action: 'unkown-err',
        error: err
      });
    }
  },
  delete: async function (req, res) {

  },
  sitemapProducts: async function (req, res) {
    try {
      let html = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
      var filterOBJ = {};
      filterOBJ['order'] = [['id', 'DESC']];
      filterOBJ['limit'] = 500;
      var SeletedProducts = await Product.findAndCountAll(filterOBJ);
      for (let i = 0; i < SeletedProducts.rows.length; i++) {
        html += `<url>
        <loc>https://alaunna.com/products/details/`+SeletedProducts.rows[i].id+`</loc>
        <changefreq>daily</changefreq>
        <priority>1</priority>
      </url>`;
      }
      html += `</urlset>`;

      res.set('Content-Type', 'application/xml');
      res.render('pages/sitemap', { val: html })
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when counting obj', err);
    }
  },
  sitemapMarkets: async function (req, res) {
    try {
      let html = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
      var filterOBJ = {};
      filterOBJ['order'] = [['id', 'DESC']];
      filterOBJ['limit'] = 500;
      var SeletedMarkets = await Market.findAndCountAll(filterOBJ);
      for (let i = 0; i < SeletedMarkets.rows.length; i++) {
        html += `<url>
        <loc>https://alaunna.com/markets/details/`+SeletedMarkets.rows[i].id+`</loc>
        <changefreq>daily</changefreq>
        <priority>1</priority>
      </url>`;
      }
      
      html += `</urlset>`;
      res.set('Content-Type', 'application/xml');
      res.render('pages/sitemap', { val: html })
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when counting obj', err);
    }
  },

};

