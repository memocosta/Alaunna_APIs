/**
 * PurchasesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var xl = require('excel4node');
var randomstring = require('randomstring');
var fs = require("fs");
var pdf = require("dynamic-html-pdf");
var html = fs.readFileSync("./assets/templates/purchases.html", "utf8");
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
var generatePDf = async function (purchasesArr, total_quantity, total_price, from, to, ) {
    fileName = randomstring.generate(10) + '.pdf';
    var options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm"
    };
    var document = {
        type: "file", // 'file' or 'buffer'
        template: html,
        context: {
            purchases: purchasesArr,
            total_quantity: total_quantity,
            total_price: total_price,
            todayDate: getDate(),
            from: getDate(from),
            to: getDate(to),
        },
        path: "./.tmp/public/pdf/" + fileName // it is not required if type is buffer
    };
    return pdf.create(document, options);
};

module.exports = {
    index: async function (req, res) {
        try {
            var offset = req.param('offset');
            var market_id = req.param('market_id');
            if (market_id) {
                var filterOBJ = {};
                if (offset) {
                    filterOBJ['offset'] = offset * 10;
                    filterOBJ['limit'] = 10;
                }
                filterOBJ['where'] = { market_id: market_id };
                filterOBJ['include'] = ['supplier', 'products'];
                var purchases = await Purchases.findAndCountAll(filterOBJ);
                return ResponseService.SuccessResponse(res, 'success for getting all Purchases', purchases);
            } else {
                return ResponseService.ErrorResponse(res, 'please provide the market id');
            }
        } catch (e) {
            console.log(e);
            return ResponseService.ErrorResponse(res, 'somthing wrong hapen when getting the Purchases', e);
        }
    },
    create: async function (req, res) {
        try {
            let PurchsesPBJ = {
                total: req.param("paid_amount"),
                disscount: req.param('discount_amount'),
                remain_amount: req.param('remain_amount'),
                Bill_date: req.param("Bill_date"),
                market_id: req.param("market_id"),
                supplier_id: req.param("supplier_id")
            };
            let safe_id = req.param('safe_id');
            let products = req.param('products');
            let affect_safe = req.param('affect_safe');
            let Affect_supplier = req.param('affect_supplier');

            if (PurchsesPBJ.total && PurchsesPBJ.Bill_date && products.length > 0 && PurchsesPBJ.market_id) {
                var CreatedPurcheass = await Purchases.create(PurchsesPBJ);
                console.log(CreatedPurcheass);
                if (Affect_supplier) {
                    var SelectedSupplier = await Supplier.findOne({ where: { id: PurchsesPBJ.supplier_id } });
                    SelectedSupplier.amount += parseFloat(PurchsesPBJ.remain_amount) * -1;
                    await SelectedSupplier.save();
                }
                if (affect_safe && (!Affect_supplier || PurchsesPBJ.remain_amount)) {
                    var SelectedSafe = await Safe.findOne({ where: { id: safe_id } });
                    SelectedSafe.amount -= parseFloat(PurchsesPBJ.total);
                    await SelectedSafe.save();
                }

                for (let i = 0; i < products.length; i++) {
                    var Market_prod = await Market_Products.findOne({ where: { market_id: PurchsesPBJ.market_id, product_id: products[i]['id'] } });
                    Market_prod.quantity += parseFloat(products[i].quantity);
                    await Market_prod.save();
                    await ProductPurchases.create({ purchas_id: CreatedPurcheass.id, 
                        product_id: products[i]['id'], 
                        quantity: products[i]['quantity'], 
                        price: products[i].price , 
                        market_id : PurchsesPBJ.market_id });
                        
                    if (i == products.length - 1) {
                        return ResponseService.SuccessResponse(res, 'success for creating the Purchases with it products', CreatedPurcheass);
                    }
                }
            } else {
                return ResponseService.ErrorResponse(res, 'please provide the purchaess full data');
            }
        } catch (e) {
            console.log(e);
            return ResponseService.ErrorResponse(res, 'somthing wrong happen when createing the purchases obj', e);
        }
    },
    getAllPurchasesAsExcel: async function (req, res) {
        try {
            var market_id = req.param('market_id');
            var supplier_id = req.param('supplier_id');
            var fitler_obj = {};
            if (market_id) {
                if (supplier_id) {
                    fitler_obj['where'] = { supplier_id: supplier_id, market_id: market_id };
                } else {
                    fitler_obj['where'] = { market_id: market_id };
                }
                fitler_obj['include'] = ['supplier', 'products'];
                var purchases = await Purchases.findAll(fitler_obj);
                purchases = JSON.parse(JSON.stringify(purchases));
                var headers = ['الرقم', 'الاجمالي', 'تاريخ الفاتوره', 'عدد المنتجات', 'رقم المورد', 'اسم المورد', 'تليفون المورد', 'تاريخ الانشاء'];
                //console.log(Suppliers[0]);
                var wb = new xl.Workbook();
                var ws = wb.addWorksheet('بيانات المبيعات');
                for (let i = 1; i <= headers.length; i++) {
                    ws.cell(1, i).string(headers[i - 1]);
                }
                for (let i = 0; i < purchases.length; i++) {
                    ws.cell(i + 2, 1).number(purchases[i].id);
                    ws.cell(i + 2, 2).number(purchases[i].total);
                    ws.cell(i + 2, 3).string(purchases[i].Bill_date);
                    ws.cell(i + 2, 4).number(purchases[i].products.length);
                    ws.cell(i + 2, 5).number(purchases[i]['supplier']['id']);
                    ws.cell(i + 2, 6).string(purchases[i]['supplier']['name']);
                    ws.cell(i + 2, 7).string(purchases[i]['supplier']['telephone']);
                    ws.cell(i + 2, 8).string(purchases[i].createdAt);
                }
                var filenmae = randomstring.generate(10);
                await wb.write(`./.tmp/public/excel/${filenmae}.xlsx`);
                return ResponseService.SuccessResponse(res, 'success for getting the data in excel format', { fileName: filenmae + '.xlsx' });
            } else {
                return ResponseService.ErrorResponse(res, 'please provide  the market id');
            }
        } catch (e) {
            console.log(e);
            return ResponseService.ErrorResponse(res, 'somthign wrong hapen', e);
        }
    },
    getPurchasesAsPDF: async function (req, res) {
        try {
            var market_id = req.param("market_id");
            var supplier_id = req.param("supplier_id");
            var from = req.param("from");
            var to = req.param("to");

            from = new Date(from);
            to = new Date(to);

            to.setHours( 22);
            var fitler_obj = {};
            if (market_id ) {
                if (supplier_id) {
                    fitler_obj["where"] = {
                        supplier_id: supplier_id,
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
                var purchases = await Purchases.findAll(fitler_obj);

                var bodyArr = [];
                var total_quantity = 0;
                var total_price = 0;
                for (let i = 0; i < purchases.length; i++) {
                    for (let j = 0; j < purchases[i].products.length; j++) {
                        
                        var d = new Date(purchases[i].createdAt);
                        let total = parseFloat(purchases[i].products[j]['ProductPurchases'].price) * purchases[i].products[j]['ProductPurchases'].quantity;
                        let product_obj = {
                            date: d.toDateString(),
                            product_name: purchases[i].products[j].name,
                            value: purchases[i].products[j]['ProductPurchases'].price,
                            quantity: purchases[i].products[j]['ProductPurchases'].quantity,
                            total: total
                        };
                        total_price += total;
                        total_quantity += purchases[i].products[j]['ProductPurchases'].quantity;
                        bodyArr.push(product_obj);
                    }
                }
                generatePDf(bodyArr, total_quantity, total_price, from, to).then(data => {
                    return ResponseService.SuccessResponse(res, "success for creating the pdf file", {
                        filename: fileName
                    });
                }).catch(err => {
                    console.log(err);
                    return ResponseService.ErrorResponse(res, 'there is an error when generate the pdf', err);
                });
            }
        } catch (err) {
            console.log(err);
            return ResponseService.ErrorResponse(res, 'there is an error when generate the pdf', err);
        }
    }

};

