/**
 * SalesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var xl = require("excel4node");
var randomestring = require("randomstring");
var fs = require("fs");
var pdf = require("dynamic-html-pdf");
var html = fs.readFileSync("./assets/templates/sales.html", "utf8");
var fileName;
var getDate = function(curentDate){
  if (curentDate){
    var today = curentDate
  } else {
    var today = new Date();
  }
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }
  today = yyyy + "-" + mm + "-" + dd;
  return today;
}
var generatePDf = async function (salesArray, total_quantity, total_price, total_discount, total_tax_amount, from, to, ) {

  fileName = randomestring.generate(10) + '.pdf';
  var options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm"
  };
  var document = {
    type: "file", // 'file' or 'buffer'
    template: html,
    context: {
      sales: salesArray,
      total_quantity: total_quantity,
      total_price: total_price,
      todayDate:  getDate(),
      from: getDate(from),
      to: getDate(to),
      tax: total_tax_amount,
      total_discount: total_discount
    },
    path: "./.tmp/public/pdf/" + fileName // it is not required if type is buffer
  };
  return pdf.create(document, options);
};

module.exports = {
  index: async function (req, res) {
    try {
      var offset = req.param("offset");
      var market_id = req.param("market_id");
      if (market_id) {
        var filterOBJ = {};
        if (offset) {
          filterOBJ["offset"] = offset * 10;
          filterOBJ["limit"] = 10;
        }
        filterOBJ["where"] = {
          market_id: market_id
        };
        filterOBJ["include"] = ["client", "products"];

        var sales = await Sales.findAndCountAll(filterOBJ);
        return ResponseService.SuccessResponse(res, "success for getting all sales", sales);
      } else {
        return ResponseService.ErrorResponse(res, "please provide the market id");
      }
    } catch (e) {
      return ResponseService.ErrorResponse(res, "somthing wrong hapen when getting the sales", e);
    }
  },

  create: async function (req, res) {
    try {
      let SalesOBJ = {
        total: req.param("paid_amount"),
        disscount: req.param('discount_amount'),
        remain_amount: req.param('remain_amount'),
        Bill_date: req.param("Bill_date"),
        market_id: req.param("market_id"),
        client_id: req.param("client_id")
      };
      let safe_id = req.param("safe_id");
      let products = req.param("products");
      let affect_safe = req.param("affect_safe");
      let Affect_client = req.param("affect_client");

      if (SalesOBJ.total && SalesOBJ.Bill_date && products.length > 0 && SalesOBJ.market_id) {
        var CreatedSales = await Sales.create(SalesOBJ);

        if (Affect_client) {
          var SelectedClient = await Client.findOne({ where: { id: SalesOBJ.client_id } });
          SelectedClient.amount += parseFloat(SalesOBJ.remain_amount) * -1;
          await SelectedClient.save();
        }
        if (affect_safe && (!Affect_client || SalesOBJ.remain_amount)) {
          var SelectedSafe = await Safe.findOne({ where: { id: safe_id } });
          SelectedSafe.amount += parseFloat(SalesOBJ.total);
          await SelectedSafe.save();
        }

        for (let i = 0; i < products.length; i++) {
          var Market_prod = await Market_Products.findOne({ where: { market_id: SalesOBJ.market_id, product_id: products[i]["id"] } });
          Market_prod.quantity -= parseFloat(products[i].quantity);
          await Market_prod.save();
          await ProductSales.create({
            sales_id: CreatedSales.id,
            product_id: products[i]["id"],
            quantity: products[i]["quantity"],
            price: products[i].price,
            tax: products[i].tax,
            market_id : SalesOBJ.market_id
          });
          if (i == products.length - 1) {
            return ResponseService.SuccessResponse(res, "success for creating the sales with it products", CreatedSales);
          }
        }
      } else {
        return ResponseService.ErrorResponse(res, "please provide the sales full data");
      }
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, "somthing wrong happen when createing the sales obj", e);
    }
  },
  //   delete: async function (req, res) {

  //     },
  //     edit: async function (req, res) {

  //       },

  getAllSalesAsExcel: async function (req, res) {
    try {
      var market_id = req.param("market_id");
      var Client_id = req.param("client_id");
      var fitler_obj = {};
      if (market_id) {
        if (Client_id) {
          fitler_obj["where"] = {
            client_id: Client_id,
            market_id: market_id
          };
        } else {
          fitler_obj["where"] = {
            market_id: market_id
          };
        }
        fitler_obj["include"] = ["client", "products"];
        var sales = await Sales.findAll(fitler_obj);
        sales = JSON.parse(JSON.stringify(sales));
        var headers = [
          "الرقم",
          "الاجمالي",
          "تاريخ الفاتوره",
          "عدد المنتجات",
          "رقم العميل",
          "اسم العميل",
          "تليفون العميل",
          "تاريخ الانشاء"
        ];
        //console.log(Suppliers[0]);
        var wb = new xl.Workbook();
        var ws = wb.addWorksheet("بيانات المبيعات");
        for (let i = 1; i <= headers.length; i++) {
          ws.cell(1, i).string(headers[i - 1]);
        }
        for (let i = 0; i < sales.length; i++) {
          ws.cell(i + 2, 1).number(sales[i].id);
          ws.cell(i + 2, 2).number(sales[i].total);
          ws.cell(i + 2, 3).string(sales[i].Bill_date);
          ws.cell(i + 2, 4).number(sales[i].products.length);
          ws.cell(i + 2, 5).number(sales[i]["client"]["id"]);
          ws.cell(i + 2, 6).string(sales[i]["client"]["name"]);
          ws.cell(i + 2, 7).string(sales[i]["client"]["telephone"]);
          ws.cell(i + 2, 8).string(sales[i].createdAt);
        }
        var filenmae = randomestring.generate(10);
        await wb.write(`./.tmp/public/excel/${filenmae}.xlsx`);
        return ResponseService.SuccessResponse(
          res,
          "success for getting the data in excel format", {
            fileName: filenmae + ".xlsx"
          }
        );
      } else {
        return ResponseService.ErrorResponse(
          res,
          "please provide  the market id"
        );
      }
    } catch (e) {
      console.log(e);
      return ResponseService.ErrorResponse(res, "something wrng happen ", e);
    }
  },

  getSalesAsPDF: async function (req, res) {
    try {
      var market_id = req.param("market_id");
      var Client_id = req.param("client_id");
      var from = req.param("from");
      var to = req.param("to");

      from = new Date(from);
      to = new Date(to);
      to.setHours(22);
      console.log(to);
      var fitler_obj = {};
      if (market_id && from && to) {
        if (Client_id) {
          fitler_obj["where"] = {
            client_id: Client_id,
            market_id: market_id,
            createdAt: {
              [Sequelize.Op.gte]: from,
              [Sequelize.Op.lte]: to
            }
          };
        } else {
          fitler_obj["where"] = {
            market_id: market_id,
            createdAt: {
              [Sequelize.Op.gte]: from,
              [Sequelize.Op.lte]: to
            },
          };
        }
        fitler_obj["include"] = ["products"];
        var sales = await Sales.findAll(fitler_obj);
        var bodyArr = [];
        var total_quantity = 0;
        var total_price = 0;
        var total_discount = 0;
        var total_tax_amount = 0;
        for (let i = 0; i < sales.length; i++) {
          for (var j = 0; j < sales[i].products.length; j++) {
            let total = parseFloat(sales[i].products[j].price) * sales[i].products[j].quantity;

            var d = new Date(sales[i].createdAt);
            let product_obj = {
              date: d.toDateString(),
              product_name: sales[i].products[j]["product"].name,
              value: sales[i].products[j].price,
              quantity: sales[i].products[j].quantity,
              total: total
            };

            total_price += total;
            total_tax_amount += (total * (parseFloat(sales[i].products[j].tax) / 100))
            total_quantity += sales[i].products[j].quantity;
            bodyArr.push(product_obj);
          }
          total_discount += sales[i].disscount;
          // if (i == sales)
        }
        total_price += total_tax_amount;
        total_price -= total_discount;

        generatePDf(bodyArr, total_quantity, total_price, total_discount, total_tax_amount, from, to).then(data => {
          return ResponseService.SuccessResponse(res, "success for creating the pdf file", {
            filename: fileName
          });
        }).catch(err => {
          console.log(err);
          return ResponseService.ErrorResponse(res, 'there is an error when generate the pdf', err);
        });

      } else {
        return ResponseService.ErrorResponse(res, "please provide market id");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
