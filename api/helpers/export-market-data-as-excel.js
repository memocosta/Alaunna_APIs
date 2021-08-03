var xl = require('excel4node');
var randomstring = require('randomstring');
module.exports = {


  friendlyName: 'Export market data as excel',


  description: '',


  inputs: {
    marketProducts: {
      type: 'ref',
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {

    var products = inputs.marketProducts;
    var headers = ['اسم المنتج', 'وصف المنتج', 'رقم المنتج', 'حجم المنتج', 'سعر الشراء', 'سعر البيع', 'الكميه', 'كود داخلي', 'كود اوشن', 'تاريخ انتهاء الصلاحيه', 'تاريخ الاضافه'];
    var wb = new xl.Workbook();
    var ws = wb.addWorksheet('بيانات المنتجات');
    for (let i = 1; i <= headers.length; i++) {
      ws.cell(1, i).string(headers[i - 1]);
    }
    console.log(products);
    for (let i = 0; i < products.length; i++) {
      ws.cell(i + 2, 1).string(products[i].name);
      ws.cell(i + 2, 2).string(products[i].description);
      ws.cell(i + 2, 3).string(products[i].nationalQr);
      ws.cell(i + 2, 4).number(products[i].size);
      ws.cell(i + 2, 5).number(products[i]['Market_Products']['Purchasing_price']);
      ws.cell(i + 2, 6).number(products[i]['Market_Products']['Selling_price']);
      ws.cell(i + 2, 7).number(products[i]['Market_Products']['quantity']);
      ws.cell(i + 2, 8).string(products[i]['Market_Products']['InnerCode']);
      ws.cell(i + 2, 9).string(products[i]['Market_Products']['AwshnCode']);
      ws.cell(i + 2, 10).string(products[i]['Market_Products']['Expire_date']);
      ws.cell(i + 2, 11).string(products[i]['Market_Products']['createdAt']);
    }
    var filenmae = randomstring.generate(10);
    await wb.write(`./.tmp/public/excel/${filenmae}.xlsx`);
    await wb.write(`assets/excel/${filenmae}.xlsx`);
    return exits.success(filenmae);
  }


};
