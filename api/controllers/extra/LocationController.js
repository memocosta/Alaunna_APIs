/**
 * LocationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getallCity: async function (req, res) {
        try {
            var Cities = await City.findAndCountAll({ include: { all: true } });
            if (Cities) {
                return ResponseService.SuccessResponse(res, 'success getting all cities', Cities);
            } else {
                return ResponseService.ErrorResponse(res, 'error when getting all cities');
            }
        } catch (e) {
            return ResponseService.ErrorResponse(res, 'error when getting all cities', e);
        }
    },
    getallCountry: async function (req, res) {
        try {
            var Countries = await Country.findAndCountAll();
            if (Countries) {
                return ResponseService.SuccessResponse(res, 'success getting all Countries', Countries);
            } else {
                return ResponseService.ErrorResponse(res, 'error when getting all Countries');
            }
        } catch (e) {
            console.log(e);
            return ResponseService.ErrorResponse(res, 'error when getting all Countries', e);
        }
    },
    filterCitiesAccordingToCountry: async function (req, res) {
        try {
            var country_id = req.param('country_id');
            if (country_id) {
                var FilterdCities = await City.findAndCountAll({ where: { countryId: country_id } });
                if (FilterdCities) {
                    return ResponseService.SuccessResponse(res, 'success for getting the filterd City', FilterdCities);
                } else {
                    return ResponseService.ErrorResponse(res, 'error when getting cities');
                }
            } else {
                return ResponseService.ErrorResponse(res, 'please provide Country id');
            }
        } catch (e) {
            console.log(e);
            return ResponseService.ErrorResponse(res, 'error when getting cities', e);
        }
    },
    moreCities: async function (req, res) {
        try {
            var country_id = req.param('country_id');
            var newfitlerOBJ = { where: {} };
            newfitlerOBJ['where']['countryId'] = { [Sequelize.Op.in]: country_id }
            var FilterdCities = await City.findAndCountAll(newfitlerOBJ);
            return ResponseService.SuccessResponse(res, 'success for getting the filterd City', FilterdCities);
        } catch (e) {
            console.log(e);
            return ResponseService.ErrorResponse(res, 'error when getting cities', e);
        }
    },
    addNewCity: async function (req, res) {
        try {
            var cityobj = {
                name: req.param('name'),
                description: req.param('description'),
                countryId: req.param('countryId')
            }
            if (cityobj.name && cityobj.description && cityobj.countryId) {
                var ccreatedCity = await City.create(cityobj);
                return ResponseService.SuccessResponse(res, 'success for createing the City', ccreatedCity);
            } else {
                return ResponseService.ErrorResponse(res, 'please provide Country id and name and description of City');
            }
        } catch (e) {
            console.log(e);
            return ResponseService.ErrorResponse(res, 'please provide Country id and name and description of City');
        }
    },
    addNewCountry: async function (req, res) {
        try {
            var countryobj = {
                name: req.param('name'),
                description: req.param('description'),
            }
            if (countryobj.name && countryobj.description) {
                var createdCountry = await Country.create(countryobj);
                return ResponseService.SuccessResponse(res, 'success for createing the Country', createdCountry);
            } else {
                return ResponseService.ErrorResponse(res, 'please provide name and description of Country');
            }
        } catch (e) {
            console.log(e);
            return ResponseService.ErrorResponse(res, 'some thing wrong happen when create Country', e);
        }
    },
    deleteCity: async function (req, res) {
        try {
            var id = req.param('id');
            if (id) {
                var destroiedCity = await City.destroy({ where: { id: id } });
                return ResponseService.SuccessResponse(res, 'success for deleteing the City', destroiedCity);
            } else {
                return ResponseService.ErrorResponse(res, 'please proivde the id of the City');
            }
        } catch (e) {
            return ResponseService.ErrorResponse(res, 'error happen when delete the City', e);
        }
    },
    deleteCountry: async function (req, res) {
        try {
            var id = req.param('id');
            if (id) {
                var destroiedCountry = await Country.destroy({ where: { id: id } });
                return ResponseService.SuccessResponse(res, 'success for deleteing the Country', destroiedCountry);
            } else {
                return ResponseService.ErrorResponse(res, 'please proivde the id of the Country');
            }
        } catch (e) {
            return ResponseService.ErrorResponse(res, 'error happen when delete the Country', e);
        }
    },
    editCity: async function (req, res) {
        try {
            var id = req.param('id');
            var country = req.param('country');
            var name = req.param('name');
            var description = req.param('description');
            if (id) {
                var upadtedCity = await City.update({ name: name, description: description, countryId: country }, { where: { id: id } });
                return ResponseService.SuccessResponse(res, 'success for updating ciy', upadtedCity);
            } else {
                return ResponseService.ErrorResponse(res, 'please proivde the id of the City');
            }
        } catch (e) {
            return ResponseService.ErrorResponse(res, 'error happen when updating the City', e);
        }
    },
    editCountry: async function (req, res) {
        try {
            var id = req.param('id');
            var name = req.param('name');
            var description = req.param('description');
            if (id) {
                var upadtedcountry = await Country.update({ name: name, description: description }, { where: { id: id } });
                return ResponseService.SuccessResponse(res, 'success for updating Country', upadtedcountry);
            } else {
                return ResponseService.ErrorResponse(res, 'please proivde the id of the Country');
            }
        } catch (e) {
            return ResponseService.ErrorResponse(res, 'error happen when updating the country', e);
        }
    }
};

