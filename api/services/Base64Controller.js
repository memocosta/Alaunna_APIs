  var path = require('path');
  var fs = require('fs');

  module.exports = {
    encode_base64: async function (filename) {
        fs.readFile(path.join(__dirname, '/public/', filename), function (error, data) {
          if (error) {
            throw error;
          } else {
            var buf = Buffer.from(data);
            var base64 = buf.toString('base64');
            //console.log('Base64 of ddr.jpg :' + base64);
            return base64;
          }
        });
      },
      decode_base64: async function (base64str, filename) {
        return new Promise((resolve, reject) => {
          //var buf = Buffer.from(base64str, 'base64');
          let ImagePath = './.tmp/public/images' + filename;
          fs.writeFile(ImagePath, base64str, 'base64', function (error) {
            if (error) {
              reject({
                err: 'here is the error',
                error: error
              });
            } else {
              fs.createReadStream(ImagePath).pipe(fs.createWriteStream('./assets/images/' + filename));
              console.log('File created from base64 string!');
              resolve('done');
            }
          });
        })
      }
  };
