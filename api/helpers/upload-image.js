let sharp = require('sharp');
let fs = require('fs');

var GenerateImage = async function (imgBuffer, width , height , type , Imagefor , name){

  let bigImagePath = './assets/images/' + Imagefor + `/${type}/`  + name;
  await sharp(imgBuffer).resize(width,height,{fit: 'inside'}).toFile(bigImagePath);
  // fs.createReadStream(bigImagePath).pipe(fs.createWriteStream('./assets/images/' +  Imagefor + `/${type}/` +name ));
}
module.exports = {

  friendlyName: 'Upload image',
  description: '',
  inputs: {
    base64Image: {
      type: 'string',
      required: true
    },
    name: {
      type: 'string',
      required: true
    },
    alt: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string',
      required: true
    },
    for: {
      type: 'string',
      required: true
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
    if (inputs.base64Image) {
      var imageObject = {
        name: 'default.jpg',
        description: inputs.description,
        alt: inputs.alt,
        for: inputs.for,
      };
      const uri = inputs.base64Image.split(';base64,').pop();
      imageObject.name = inputs.name + require("randomstring").generate(3) + '.jpg';
      let ImagePath = './assets/images/' + inputs.for + '/' + imageObject.name;
      let imgBuffer = Buffer.from(uri, 'base64');
      let Sharpimage = await sharp(imgBuffer).resize(inputs.width, inputs.height,{fit: 'inside'}).toFile(ImagePath);
      // Generate original image

      if (inputs.options && inputs.options.isMarketLogo){
        GenerateImage( imgBuffer,64 , 64 , 'small' , inputs.for , imageObject.name);
      }
      if (inputs.options &&  inputs.options.isMarketCover){
        GenerateImage(imgBuffer,254 , 216 , 'small' ,inputs.for,imageObject.name);
        GenerateImage(imgBuffer,1081 , 338 , 'big' ,inputs.for,imageObject.name);
        GenerateImage(imgBuffer,512 , 258 , 'medium' ,inputs.for,imageObject.name);
      }
      if (inputs.options && inputs.options.isProduct){
        GenerateImage(imgBuffer,100 , 100 , 'small' ,inputs.for,imageObject.name );
        GenerateImage(imgBuffer,261 , 220 , 'medium' ,inputs.for,imageObject.name );
        GenerateImage(imgBuffer,700 , 700 , 'big' ,inputs.for,imageObject.name );
        await sharp(imgBuffer).toFile('./assets/images/' + inputs.for  + '/original/' + imageObject.name);
      }
      if (inputs.options && inputs.options.isBanner){
        console.log(inputs.options);
        GenerateImage(imgBuffer,1140 , 279 , 'big' ,inputs.for,imageObject.name );
        GenerateImage(imgBuffer,524 , 134 , 'small' ,inputs.for,imageObject.name )
      }
      if (inputs.options && inputs.options.isMarketBanner){
        GenerateImage(imgBuffer,1140 , 350 , 'medium' , inputs.for,imageObject.name)
      }
      // fs.createReadStream(ImagePath).pipe(fs.createWriteStream('./assets/images/' +  inputs.for + '/' + imageObject.name));
      let CreatedImageOBJ = await Image.create(imageObject);
      return exits.success(CreatedImageOBJ);
    } else {
      return exits.error(err);
    }
  }
};

