module.exports = {


  friendlyName: 'Create user',


  description: '',


  inputs: {
    user: {
      type: 'ref',
      description: 'all the user obj data'
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {
    try {
      let UserObj = inputs.user;
      // UserObj.userimage = image.id;
      if (UserObj.category == 'customer') {
        UserObj.status = 'not_active';
      } else {
        UserObj.status = 'not_active';
      }
      if (inputs.user.image) {
        var image = await sails.helpers.uploadImage(inputs.user.image.base64, inputs.user.name, inputs.user.image.alt, inputs.user.image.description, 'user' , 220 , 220);
        // await UserImage.create({
        //   owner_id: finalUserObj.id,
        //   imageId: image.id
        // });
        //finalUserobjJSON['image'] = image;
        UserObj.Image_id = image.id;
      }
      User.create(UserObj).then(async (finalUserObj) => {
        var finalUserobjJSON = finalUserObj['dataValues'];
        finalUserobjJSON['image'] = image ? image.id : null;
        return exits.success(finalUserobjJSON);
      }).catch(err => {
        return exits.error(err);
      })
      // All done.

    } catch (e) {
      return exits.error(e);
    }
  }



};
