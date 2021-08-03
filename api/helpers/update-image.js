
let sharp = require('sharp');
let fs = require('fs');
var randomestring = require('randomstring');
var GenerateImage = async function (imgBuffer, width , height , type , Imagefor , name){

  let bigImagePath = './assets/images/' + Imagefor + `/${type}/`  + name;
  await sharp(imgBuffer).resize(width,height,{fit: 'inside'} ).toFile(bigImagePath);
  // fs.createReadStream(bigImagePath).pipe(fs.createWriteStream('./assets/images/' +  Imagefor + `/${type}/` +name ));
}
module.exports = {


  friendlyName: 'Update image',


  description: '',


  inputs: {
    id: {
      type: 'number',
      required: true
    },
    base64: {
      type: 'string',
      required: true,
    },
    alt: {
      type: 'string',
    },
    description: {
      type: 'string'
    },
    width: {
      type: 'number',
      required: true,
    },
    height: {
      type: 'number',
      required: true,
    },
    options : {
      type : 'ref'
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {
    try {
      var oldImageObj = await Image.findOne({ where: { id: inputs.id } });
      //var fileName = './assets/images/' + oldImageObj.for + '/' + oldImageObj.name;
      // Base64Controller.decode_base64(inputs.base64, '/' + oldImageObj.for + '/' + oldImageObj.name).then(__ => {
      oldImageObj.name = oldImageObj.name.slice(0 , -7) + randomestring.generate(3) + '.jpg';
      await oldImageObj.save();
      const uri = inputs.base64.split(';base64,').pop();
      let ImagePath = './assets/images/' + oldImageObj.for + '/' + oldImageObj.name;
      let imgBuffer = Buffer.from(uri, 'base64');
      let Sharpimage = await sharp(imgBuffer).resize(inputs.width, inputs.height,{fit: 'inside'}).toFile(ImagePath);
      // fs.createReadStream(ImagePath).pipe(fs.createWriteStream('./assets/images/' + oldImageObj.for + '/' + oldImageObj.name));
      if (inputs.options && inputs.options.isMarketLogo){
        GenerateImage( imgBuffer,64 , 64 , 'small' , oldImageObj.for , oldImageObj.name);
      }
      if (inputs.options &&  inputs.options.isMarketCover){
        GenerateImage(imgBuffer,254 , 216 , 'small' ,oldImageObj.for,oldImageObj.name);
        GenerateImage(imgBuffer,1081 , 338 , 'big' ,oldImageObj.for,oldImageObj.name);
        GenerateImage(imgBuffer,512 , 258 , 'medium' ,oldImageObj.for,oldImageObj.name);
      }
      if (inputs.options && inputs.options.isProduct){
        GenerateImage(imgBuffer,100 , 100 , 'small' ,oldImageObj.for,oldImageObj.name );
        GenerateImage(imgBuffer,261 , 220 , 'medium' ,oldImageObj.for,oldImageObj.name );
        GenerateImage(imgBuffer,700 , 700 , 'big' ,oldImageObj.for,oldImageObj.name );
        await sharp(imgBuffer).toFile('./assets/images/' + oldImageObj.for  + '/original/' + oldImageObj.name);
      }
      if (inputs.options && inputs.options.isBanner){
        console.log(inputs.options);
        GenerateImage(imgBuffer,1140 , 279 , 'big' ,oldImageObj.for,oldImageObj.name );
        GenerateImage(imgBuffer,524 , 134 , 'small' ,oldImageObj.for,oldImageObj.name )
      }
      if (inputs.options && inputs.options.isMarketBanner){
        GenerateImage(imgBuffer,1140 , 350 , 'medium' , oldImageObj.for,oldImageObj.name)
      }
      let UpdatedImage = await Image.update({ alt: inputs.alt, description: inputs.description }, { where: { id: inputs.id } });
      return exits.success(UpdatedImage)
      // })
    } catch (e) {
      console.log(e);
      return exits.error(e);
    }
  }

};

