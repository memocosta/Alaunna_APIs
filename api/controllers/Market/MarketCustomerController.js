module.exports = {
  index: async function (req, res) {
    try {
      let market_id = req.param('market_id'),
        offset = req.param('offset'),
        fitlerOBJ = {
          where: {}
        };

      if (market_id && market_id != 'false') {
        fitlerOBJ['where']['market_id'] = market_id;
      }

      if (offset && offset != 'false' || offset === 0) {
        fitlerOBJ['offset'] = 10 * offset;
        fitlerOBJ['limit'] = 10;
      }
      fitlerOBJ['include'] = [
        {
          model: Market,
          as: 'market',
        }
      ];
      let SelectedCustomers = await MarketCustomer.findAndCountAll(fitlerOBJ);
      return ResponseService.SuccessResponse(res, 'success for getting all data for market Customers', SelectedCustomers);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'something wrong happen when getting the Customers', {
        action: 'unknown-error',
        error: err
      });

    }
  },

  create: async function (req, res) {
    try {
      let params = req.allParams();
      if (!params['market_id']) {
        return ResponseService.ErrorResponse(res, 'please provide a valid market id', {
          action: 'invalid-data'
        });
      }
      let filterOBJ = { where: {} };
      filterOBJ['where']['market_id'] = params['market_id'];
      filterOBJ['where']['phone'] = params['phone'];
      let CreatedCustomer = await MarketCustomer.findOne(filterOBJ);
      console.log(CreatedCustomer);
      if (!CreatedCustomer)
        CreatedCustomer = await MarketCustomer.create(params);
      return ResponseService.SuccessResponse(res, 'success for rating the market', CreatedCustomer);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'something wrong happen when create the rate', {
        action: 'unknown-error',
        error: err
      });
    }
  },
  create_many: async function (req, res) {
    try {
      let market_id = req.param('market_id'),
        contact_list = req.param('contact_list');

      if (!market_id) {
        return ResponseService.ErrorResponse(res, 'please provide a valid market id', {
          action: 'invalid-data'
        });
      }
      let CreatedCustomer;
      for (let i = 0; i < contact_list.length; i++) {
        let data = contact_list[i].split("&&");
        console.log(data);
        let filterOBJ = { where: {} };
        filterOBJ['where']['market_id'] = market_id;
        filterOBJ['where']['phone'] = data[1];
        CreatedCustomer = await MarketCustomer.findOne(filterOBJ);
        if (!CreatedCustomer) {
          CreatedCustomer = await MarketCustomer.create({
            market_id: market_id,
            name: data[0],
            phone: data[1],
          });
        }

      }
      return ResponseService.SuccessResponse(res, 'success for rating the market', CreatedCustomer);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'something wrong happen when create the rate', {
        action: 'unknown-error',
        error: err
      });
    }
  },
}
