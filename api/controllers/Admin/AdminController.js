/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var bcrypt = require('bcrypt');
module.exports = {
  index: async function (req, res) {
    try {
      var offset = req.param(offset);
      var filterOBJ = {};
      if (offset) {
        filterOBJ['offset'] = offset * 10;
        filterOBJ['limit'] = 10;
      }
      var SelectedAdmins = await Admin.findAndCountAll(filterOBJ);
      return ResponseService.SuccessResponse(res, 'success for select all admins', SelectedAdmins);
    } catch (err) {
      return ResponseService.ErrorResponser(res, 'somthing wrong happen when get the admins', err);
    }
  },
  login: async function (req, res) {
    try {
      var password = req.param('password'),
        email = req.param('email'),
        device_id = req.param('device_id');

      if (!password || !email) {
        return ResponseService.ErrorResponse(res, 'please provide all login data', { action: 'invalid-data' });
      }

      var SelectedAdmin = await Admin.findOne({ where: { email: email } });
      if (!SelectedAdmin) {
        return ResponseService.ErrorResponse(res, 'cannot find the Admin Data', { action: 'invalid-email' });
      }
      if (device_id) {
        SelectedAdmin.device_id = device_id;
        await SelectedAdmin.save();
      }

      var passordSame = await bcrypt.compare(password, SelectedAdmin.password);
      if (!passordSame) {
        return ResponseService.ErrorResponse(res, 'invalid password', { action: 'invalid-password' })
      }

      var AdminJSON = SelectedAdmin.toJSON();
      AdminJSON['token'] = JwtService.issue({ id: SelectedAdmin.id });
      return ResponseService.SuccessResponse(res, 'success for login As admin', AdminJSON);

    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when login as admin', { error: err, action: 'error' })
    }
  },
  addNewAdmin: async function (req, res) {
    try {
      var AdminData = req.allParams();
      if (!AdminData.email || !AdminData.password || !AdminData.name) {
        return ResponseService.ErrorResponse(res, 'please provide all admin data', { action: 'invalid-data' });
      }
      var CreatedAdmin = await Admin.create(AdminData);
      return ResponseService.SuccessResponse(res, 'success for createing the new admin', CreatedAdmin);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when creating the new admin', { action: 'error', error: err });
    }
  },
  varifyToken: async function (req, res) {
    var token = req.param('token');
    if (token) {
      JwtService.verify(token, async (err, decode) => {
        if (err) {
          return ResponseService.ErrorResponse(res, 'unauthenticated user');
        }
        try {
          var AdminOBJ = await Admin.findOne({
            where: {
              id: decode.id
            },
          });
          let finalobj = AdminOBJ.toJSON();
          return ResponseService.SuccessResponse(res, 'success in varify token as ', finalobj);
        } catch (er) {
          console.log(er);
          return ResponseService.ErrorResponse(res, 'some thing happen in this code', er);
        }
      });
    } else {
      return ResponseService.ErrorResponse(res, 'please provide the token');
    }
  },
  DeleteAdmin: async function (req, res) {
    try {
      var admin_id = req.param('admin_id');
      if (!admin_id) {
        return ResponseService.ErrorResponse(res, 'please provide the admin id');
      }
      var admin = await Admin.findOne({ where: { id: admin_id } });
      await admin.destroy();
      return ResponseService.SuccessResponse(res, 'success for deleteing the admin', admin);
    } catch (err) {
      return ResponseService.ErrorResponse(res, 'somthign wrong happen when delete the admin', err);
    }
  }
};
