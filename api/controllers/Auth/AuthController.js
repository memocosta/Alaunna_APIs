/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var bcrypt = require('bcrypt');
var randomstring = require('randomstring');
module.exports = {
  register: async function (req, res) {
    try {
      var userObj = {
        name: req.param('name'),
        email: req.param('email'),
        phone: req.param('phone'),
        password: req.param('password'),
        city_id: req.param('city'),
        country_id: req.param('country'),
        lat: req.param('lat'),
        lng: req.param('lng'),
        category: req.param('category'),
        image: req.param('image'),
        device_id: req.param('device_id'),
        facebook_id: req.param('facebook_id'),
        googleplus_id: req.param('googleplus_id'),
        status: 'not_active'
      }
      if (userObj.name && userObj.phone && userObj.password && userObj.category) {
        let user = await User.findOne({ where: { phone: userObj.phone } });
        if(user){
          return ResponseService.ErrorResponse(res, 'old phone', {});
        }
        if (userObj.category == 'customer') {
          let final_user = await sails.helpers.createUser(userObj);
          await Cart.create({
            owner_id: final_user.id
          });
          let customerObj = {
            gender: req.param('gender'),
            user_id: final_user.id
          };
          let customer = await Customer.create(customerObj);
          final_user['customer'] = customer;
          final_user['token'] = JwtService.issue({
            id: userObj['id']
          });
          return ResponseService.SuccessResponse(res, 'success signup as customer', final_user);
        } else if (userObj.category == 'seller' && req.param('ssn')) {
          let final_user = await sails.helpers.createUser(userObj);
          var seelerObj = {
            ssn: req.param('ssn'),
            onAccounting: false,
            category_market: req.param('category_market'),
            user_id: final_user.id
          };
          let sellerOBJ = await Seller.create(seelerObj);
          final_user['Seller'] = sellerOBJ;
          final_user['token'] = JwtService.issue({
            id: final_user['id']
          });
          //await Admin.sendNotification('تنبيه بوجود تاجر جديد', 'هناك تاجر جديد يريد ان يتم مراجعه بياناته وتفعيله', 'seller', 'new', '');
          return ResponseService.SuccessResponse(res, 'success signup as seller , please wait untill approve your account', final_user);
        } else {
          return ResponseService.ErrorResponse(res, 'please provide a correct category');
        }
      } else {
        return ResponseService.ErrorResponse(res, 'please provide all user data');
      }
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen', e);
    }
  },
  login: async function (req, res) {
    try {
      let phone = req.param('phone');
      let password = req.param('password');
      let device_id = req.param('device_id');
      let category = req.param('category');
      if (phone && password) {
        let user = await User.findOne({ where: { phone: phone, category: category } });
        if (user) {
          if (device_id) {
            user.device_id = device_id;
            await user.save();
          }
          var passordSame = await bcrypt.compare(password, user.password);
          if (passordSame) {
            let final_user = user.toJSON();
            final_user['token'] = JwtService.issue({
              id: final_user['id']
            });
            return ResponseService.SuccessResponse(res, 'success in login user ', final_user);
          } else {
            return ResponseService.ErrorResponse(res, 'please provide a correct password');
          }
        } else {
          return ResponseService.ErrorResponse(res, 'please provide correct phone number or you are not active')
        }
      } else {
        return ResponseService.ErrorResponse(res, 'please provide the phone and password');
      }
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'some thing wrong happen', e);
    }
  },
  loginSellerApp: async function (req, res) {
    try {
      let phone = req.param('phone');
      let password = req.param('password');
      let device_id = req.param('device_id');
      let category = req.param('category');
      if (phone && password) {
        let user = await User.findOne({ where: { phone: phone, category: category } });
        if (user) {
          if (device_id) {
            user.device_id = device_id;
            await user.save();
          }
          var passordSame = await bcrypt.compare(password, user.password);
          if (passordSame) {
            let final_user = user.toJSON();
            final_user['token'] = JwtService.issue({
              id: final_user['id']
            });
            return ResponseService.SuccessResponse(res, 'success in login user ', final_user);
          } else {
            return ResponseService.ErrorResponse(res, 'please provide a correct password');
          }
        } else {
          return ResponseService.ErrorResponse(res, 'please provide correct phone number or you are not active')
        }
      } else {
        return ResponseService.ErrorResponse(res, 'please provide the phone and password');
      }
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'something wrong happen', e);
    }
  },
  sendPhoneCode: async function (req, res) {
    var phone = req.param('phone');
    var id = req.param('id');
    var request = require('request');
    //return ResponseService.SuccessResponse(res, 'success in send code11111', {phone:phone});
    try {
      var AuthUser = await User.findOne({
        where: {
          phone: phone
        }
      });
      if (AuthUser) {
        AuthUser.activate_code = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        await AuthUser.save();
        let finalobj = AuthUser.toJSON();
        finalobj['token'] = JwtService.issue({
          id: finalobj['id']
        });
        var formData = {};
        await request.post({ url: 'https://smsmisr.com/api/webapi/?username=Rbvwu1N4&password=yiXlc770Bh&language=1&sender=Alaunna&mobile=' + phone + '&message=your activate code is ' + AuthUser.activate_code, formData: formData }, function optionalCallback(err, httpResponse, body) {
          if (err) {
            //return ResponseService.ErrorResponse(res, 'not sent', err);
          }
          //return ResponseService.ErrorResponse(res, 'sent', body);
        });
        return ResponseService.SuccessResponse(res, 'success in send code', finalobj);
      } else {
        return ResponseService.ErrorResponse(res, 'phone not correct');
      }
    } catch (er) {
      console.log(er);
      return ResponseService.ErrorResponse(res, 'some thing happen in this code', er);
    }

  },
  verifyPhoneCode: async function (req, res) {
    var phone = req.param('phone');
    var activate_code = req.param('activate_code');
    try {
      var AuthUser = await User.findOne({
        where: {
          phone: phone,
          activate_code: activate_code
        }
      });
      if (AuthUser) {
        AuthUser.status = "active";
        await AuthUser.save();
        let finalobj = AuthUser.toJSON();
        finalobj['token'] = JwtService.issue({
          id: finalobj['id']
        });
        return ResponseService.SuccessResponse(res, 'success', finalobj);
      }else{
        return ResponseService.ErrorResponse(res, 'code not match');
      }
    } catch (er) {
      console.log(er);
      return ResponseService.ErrorResponse(res, 'some thing happen in this code', er);
    }

  },
  verifyToken: async function (req, res) {
    var token = req.param('token');
    if (token) {
      JwtService.verify(token, async (err, decode) => {
        if (err) {
          return ResponseService.ErrorResponse(res, 'unauthenticated user');
        }
        try {
          var AuthUser = await User.findOne({
            where: {
              id: decode.id
            }
          });
          let finalobj = AuthUser.toJSON();
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
  filterUsersBassedOnCategory: async function (req, res) {
    try {
      var category = req.param('category');
      var offset = req.param('offset');
      var status = req.param('status');
      if (category) {
        var filterOBJ = {};
        if (status) {
          filterOBJ = {
            category: category,
            status: status
          }
        } else {
          filterOBJ = {
            category: category
          }
        }
        if (offset) {
          var filterdUsers = await User.findAndCountAll({
            where: filterOBJ,
            offset: 10 * offset,
            limit: 10
          });
        } else {
          var filterdUsers = await User.findAndCountAll({
            where: filterOBJ
          });
        }

        return ResponseService.SuccessResponse(res, 'success for filter users', filterdUsers);
      } else {
        return ResponseService.ErrorResponse(res, 'pelase provide category');
      }
    } catch (e) {

    }
  },
  deleteUser: async function (req, res) {
    try {
      var user_id = req.param('id');
      if (user_id) {
        var DeletedUser = await User.findOne({
          where: {
            id: user_id
          }
        });
        // await DeletedUser.sendNotification('تنبيه', 'لقد تم مسح الحساب الخاص بك', 'account', 'deleted' , '');
        var imageOBJ = await Image.findOne({
          where: {
            id: DeletedUser.Image_id
          }
        });
        await DeletedUser.destroy();
        if (imageOBJ) {
          await imageOBJ.destroy();
        }
        return ResponseService.SuccessResponse(res, 'success delete the user', DeletedUser);
      } else {
        return ResponseService.ErrorResponse(res, 'please provide the user id');
      }
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'somthing weong happen when delete the user', e);
    }
  },
  editUserProfile: async function (req, res) {
    try {
      var userData = req.allParams();
      console.log(userData);

      if (userData.id && (userData.password || userData.role == 'admin')) {
        var Selecteduser = await User.findOne({
          where: {
            id: userData.id
          }
        });
        var passordSame = await bcrypt.compare(userData.password, Selecteduser.password) ||  userData.role == 'admin';
      console.log(passordSame);
       
        if (passordSame) {
          delete userData.password
          await Selecteduser.update(userData);
          if (Selecteduser.category == 'customer') {
            let selectedCustomer = await Selecteduser.getCustomer();
            if(userData.Customer){
            selectedCustomer.gender = userData.Customer['gender'];
            await selectedCustomer.save();}
          } else if (Selecteduser.category == 'seller') {
            let selectedSeller = await Selecteduser.getSeller();
            selectedSeller.ssn = userData.Seller['ssn'];
            await selectedSeller.save();
          }
          let userImage = userData.Image;
          if (userData.image && userImage.action == 'edited') {
            await sails.helpers.updateImage(userImage.id, userImage.base64, userImage.alt, userImage.description, 220, 220);
          }
          if (userData.image && userImage.action == 'new') {
            var image = await sails.helpers.uploadImage(userImage.base64, params.title, userImage.alt, userImage.description, 'user', 220, 200);
            Selecteduser['Image_id'] = image.id;
          }
          if (userData.newPassword) {
            var hash = await bcrypt.hash(userData.newPassword, 10);
            Selecteduser.password = hash;
          }
          await Selecteduser.save();
          // await Selecteduser.sendNotification('العميله تمت بنجاح' , 'تم تعديل البيانات الخاص بالملف الشخصي الخاص بك' , 'account' , 'edited' , '');
          return ResponseService.SuccessResponse(res, 'the user has been edited successsfulyy', Selecteduser);
        } else {
          return ResponseService.ErrorResponse(res, 'كلمة المرور التي أدخلتها غير صحيحة');
        }
      } else {
        return ResponseService.ErrorResponse(res, 'برجاء كتابه كلمة المرور لتأكيد التعديل');
      }
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'somthing error heppen', e);
    }
  },
  changeUserStatus: async function (req, res) {
    try {
      var user_id = req.param('user_id');
      var status = req.param('status');
      if (user_id && status) {
        var Selecteduser = await User.findOne({
          where: {
            id: user_id
          }
        });
        Selecteduser.status = status;
        await Selecteduser.save();
        // await Selecteduser.sendNotification('تنبيه', 'تم تغير الحاله الخاص بك', 'account', 'deleted' , '');
        return ResponseService.SuccessResponse(res, 'user status has been changed successfully', Selecteduser);
      } else {
        return ResponseService.ErrorResponse(res, 'please provide the user id and new status');
      }
    } catch (e) {
      return ResponseService.ErrorResponse(res, 'some thing wrong happen', e);
    }
  },
  varifySocial: async function (req, res) {
    try {
      var facebook_id = req.param('facebook_id');
      var googleplus_id = req.param('googleplus_id');
      var filterOBJ = {};
      if (facebook_id) {
        filterOBJ['where'] = {
          facebook_id: facebook_id
        };
      } else if (googleplus_id) {
        filterOBJ['where'] = {
          googleplus_id: googleplus_id
        };
      }
      var Selecteduser = await User.findOne(filterOBJ);
      if (Selecteduser) {
        var FinalUse = Selecteduser.toJSON();
        FinalUse['token'] = JwtService.issue({
          id: FinalUse['id']
        });
        return ResponseService.SuccessResponse(res, 'the user successfully loged in with social', FinalUse);
      } else {
        return ResponseService.ErrorResponse(res, 'cannot find the user');
      }
    } catch (e) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when varify soccail', e);
    }
  },
  sellerLoginSocial: async function (req, res) {
    try {
      var facebook_id = req.param('facebook_id');
      var google_id = req.param('google_id');
      var device_id = req.param('device_id');
      var filterOBJ = {};
      filterOBJ['where'] = { facebook_id: facebook_id , category: 'seller'};
      var Selecteduser = await User.findOne(filterOBJ);
      var filterOBJ1 = {};
      filterOBJ1['where'] = { facebook_id: facebook_id , category: 'customer'};
      var Selecteduser1 = await User.findOne(filterOBJ1);
      if (Selecteduser) {
        if (device_id) {
          Selecteduser.device_id = device_id;
          await Selecteduser.save();
        }
        var FinalUse = Selecteduser.toJSON();
        FinalUse['token'] = JwtService.issue({
          id: FinalUse['id']
        });
        return ResponseService.SuccessResponse(res, 'the user successfully loged in with social', FinalUse);
      }
      else if (Selecteduser1) {
        return ResponseService.ErrorResponse(res, 'customer');
      } else {
        return ResponseService.ErrorResponse(res, 'Not found');
      }
    } catch (e) {
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when varify soccail', e);
    }
  },
  sellerRegisterSocial: async function (req, res) {
    try {
      var userObj = {
        name: req.param('name'),
        email: req.param('email'),
        phone: req.param('phone'),
        password: '123456',
        city_id: req.param('city'),
        country_id: req.param('country'),
        lat: req.param('lat'),
        lng: req.param('lng'),
        category: req.param('category'),
        image: req.param('image'),
        device_id: req.param('device_id'),
        facebook_id: req.param('facebook_id'),
        googleplus_id: req.param('googleplus_id'),
        status: 'active'
      }
      let ssn = req.param('ssn');
      let final_user = await sails.helpers.createUser(userObj);
      var seelerObj = {
        ssn: ssn,
        onAccounting: false,
        category_market: 0,
        user_id: final_user.id
      };
      let sellerOBJ = await Seller.create(seelerObj);
      final_user['Seller'] = sellerOBJ;
      final_user['token'] = JwtService.issue({
        id: final_user['id']
      });
      //await Admin.sendNotification('تنبيه بوجود تاجر جديد', 'هناك تاجر جديد يريد ان يتم مراجعه بياناته وتفعيله', 'seller', 'new', '');
      return ResponseService.SuccessResponse(res, 'success signup as seller , please wait untill approve your account', final_user);

    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen', e);
    }
  },
  sendPasswordResetToken: async function (req, res) {
    try {
      var email = req.param('email');
      console.log(email)
      if (email) {
        var SelectedUser = await User.findOne({
          where: {
            email: email,
            status: 'active'
          }
        });
        if (SelectedUser) {
          var userToken = randomstring.generate(6);
          console.log(userToken)
          SelectedUser.passwordRestToken = userToken;
          SelectedUser.save();
          var c = await sails.helpers.sendMail(email, userToken);
          console.log(c)
          return ResponseService.SuccessResponse(res, 'the token has been send successfully', {
            done: true
          });
        } else {
          return ResponseService.ErrorResponse(res, 'please provide a correct mail');
        }
      } else {
        return ResponseService.ErrorResponse(res, 'please provide your email');
      }
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthign wrong happen when get the user data', err);
    }
  },
  RestPassword: async function (req, res) {
    try {
      var newpassword = req.param('password');
      var token = req.param('token');
      if (newpassword && token) {
        var Selecteduser = await User.findOne({
          where: {
            passwordRestToken: token
          }
        });
        if (Selecteduser) {
          Selecteduser.token = '';
          Selecteduser.password = await bcrypt.hash(newpassword, 10);
          Selecteduser.save();
          Selecteduser['token'] = JwtService.issue({
            id: Selecteduser['id']
          });
          // await Selecteduser.sendNotification('تنبيه', 'لقد تم تغير رقم المرور الخاص بك', 'account', 'password-updated' ,'');
          return ResponseService.SuccessResponse(res, 'the password has been updated successfully', Selecteduser);
        } else {
          return ResponseService.ErrorResponse(res, 'please provide correct token');
        }
      } else {
        return ResponseService.ErrorResponse(res, 'please provide the new password and the token');
      }
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when reset the password', err);
    }
  },
  forgetPassword: async function (req, res) {
    try {
      var newpassword = req.param('password');
      var phone = req.param('phone');
      if (newpassword && phone) {
        var Selecteduser = await User.findOne({
          where: {
            phone: phone
          }
        });
        if (Selecteduser) {
          Selecteduser.password = await bcrypt.hash(newpassword, 10);
          Selecteduser.save();
          Selecteduser['token'] = JwtService.issue({
            id: Selecteduser['id']
          });
          // await Selecteduser.sendNotification('تنبيه', 'لقد تم تغير رقم المرور الخاص بك', 'account', 'password-updated' ,'');
          return ResponseService.SuccessResponse(res, 'the password has been updated successfully', Selecteduser);
        } else {
          return ResponseService.ErrorResponse(res, 'please provide correct token');
        }
      } else {
        return ResponseService.ErrorResponse(res, 'please provide the new password and the token');
      }
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when reset the password', err);
    }
  },
  getUsers: async function (req, res) {
    try {
      let offset = req.param('offset');
      let status = req.param('status');
      let category = req.param('category');
      let attribute = req.param('attr');
      let order = req.param('order');
      let searchWord = req.param('word');

      let filterOBJ = {};
      let whereOBJ = {};
      if (offset && offset != 'false') {
        filterOBJ['offset'] = offset * 10;
        filterOBJ['limit'] = 10;
      }
      if (attribute && attribute != 'false') {
        console.log(attribute);
        filterOBJ['attributes'] = attribute;
      }

      if (status && status != 'false') {
        console.log(status);
        if (status != 'all') {
          if (status.indexOf(',') > -1) {
            whereOBJ['status'] = status.split(',');
          } else {
            whereOBJ['status'] = status;
          }
        }
      } else {
        whereOBJ['status'] = 'active';
      }
      if (searchWord && searchWord != 'false') {
        whereOBJ['name'] = {
          [Sequelize.Op.like]: `%${searchWord}%`
        };
      }

      if (category) {
        whereOBJ['category'] = category;
      }
      filterOBJ['where'] = whereOBJ;
      if (order) {
        filterOBJ['order'] = [['id', order]];
      }
      else {
        filterOBJ['order'] = [['name', 'ASC']];
      }
      var FitlerdUsers = await User.findAndCountAll(filterOBJ);
      return ResponseService.SuccessResponse(res, 'success for getting the users', FitlerdUsers);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen when getting user', {
        action: 'unkown-error',
        error: err
      })
    }
  },
  changePhoneVerfication: async function (req, res) {
    try {
      let user_id = req.param('id');
      let phon_verification = req.param('phone_verification');
      let user = await User.findOne({
        where: {
          id: user_id
        }
      });
      user.phone_verified = phon_verification;
      await user.save();
      let final_user = user.toJSON();
      final_user['token'] = JwtService.issue({
        id: final_user['id']
      });

      return ResponseService.SuccessResponse(res, 'success for change the pone verified', final_user);
    } catch (err) {
      console.log(err);
      return ResponseService.ErrorResponse(res, 'somthing wrong happen change the phone verification', {
        action: 'unkown-err',
        error: err
      })
    }
  },
  updateLastAdminMsgRead: async function (req, res) {
    try {
      var user_id = req.param('user_id');
      var last_admin_msg_read = req.param('last_admin_msg_read');
      var last_offer_read = req.param('last_offer_read');
      console.log(user_id)
      console.log(last_admin_msg_read)
      console.log(last_offer_read)
      if (user_id) {
        var Selecteduser = await User.findOne({
          where: {
            id: user_id
          }
        });
        if (last_admin_msg_read) {
          Selecteduser.last_admin_msg_read = last_admin_msg_read;
        } else if (last_offer_read) {
          Selecteduser.last_offer_read = last_offer_read;
        }
        await Selecteduser.save();
        // await Selecteduser.sendNotification('تنبيه', 'تم تغير الحاله الخاص بك', 'account', 'deleted' , '');
        return ResponseService.SuccessResponse(res, 'user last_admin_msg_read has been changed successfully', Selecteduser);
      } else {
        return ResponseService.ErrorResponse(res, 'please provide the user id and new last_admin_msg_read');
      }
    } catch (e) {
      return ResponseService.ErrorResponse(res, 'some thing wrong happen', e);
    }
  },
};
