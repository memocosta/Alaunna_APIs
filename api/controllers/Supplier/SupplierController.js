/**
 * SupplierController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var xl = require('excel4node');
var randomstring = require('randomstring');
module.exports = {
    create: async function (req, res) {
        try {
            var supplierOBJ = {
                name: req.param('name'),
                address: req.param('address'),
                notes: req.param('notes'),
                telephone: req.param('telephone'),
                market_id: req.param('market_id')
            }
            if (supplierOBJ.name  && supplierOBJ.market_id) {
                var CreatedSupplier = await Supplier.create(supplierOBJ);
                return ResponseService.SuccessResponse(res, 'success for creating the supplier', CreatedSupplier);
            } else {
                return ResponseService.ErrorResponse(res, 'please provide the supplier data');
            }
        } catch (e) {
            console.log(e);
            return ResponseService.ErrorResponse(res, 'somethin wron happen when created the supplier', e);
        }
    },
    delete: async function (req, res) {
        try {
            var supplier_id = req.param('id');
            if (supplier_id) {
                var DeletedSupplier = await Supplier.findOne({ where: { id: supplier_id } });
                await DeletedSupplier.destroy();
                return ResponseService.SuccessResponse(res, 'success for deleting the supplier', DeletedSupplier);
            } else {
                return ResponseService.ErrorResponse(res, 'please provide the supplier id');
            }
        } catch (e) {
            return ResponseService.ErrorResponse(res, 'somethin wron happen when delete the supplier', e);
        }
    },
    edit: async function (req, res) {
        try {
            var supplierOBJ = {
                id: req.param('id'),
                name: req.param('name'),
                address: req.param('address'),
                telephone: req.param('telephone'),
                notes: req.param('notes'),
                market_id: req.param('market_id')
            }
            if (supplierOBJ.name && supplierOBJ.id && supplierOBJ.address && supplierOBJ.notes && supplierOBJ.market_id) {
                var EditedSupplier = await Supplier.findOne({ where: { id: supplierOBJ.id } });
                EditedSupplier.name = supplierOBJ.name;
                EditedSupplier.address = supplierOBJ.address;
                EditedSupplier.notes = supplierOBJ.notes;
                EditedSupplier.telephone = supplierOBJ.telephone;
                EditedSupplier.market_id = supplierOBJ.market_id;
                await EditedSupplier.save();
                return ResponseService.SuccessResponse(res, 'success for creating the supplier', EditedSupplier);
            } else {
                return ResponseService.ErrorResponse(res, 'please provide the supplier data');
            }
        } catch (e) {
            console.log(e)
            return ResponseService.ErrorResponse(res, 'somethin wrong happen when edit the supplier', e);
        }
    },
    getAllSuppliers: async function (req, res) {
        try {
            var offset = req.param('offset');
            var market_id = req.param('market_id');
            var filterObj = {};
            if (offset) {
                filterObj['offset'] = 10 * offset;
                filterObj['limit'] = 10;
            }
            if (market_id) {
                filterObj['where'] = { market_id: market_id };
            }
            var seletedSupplier = await Supplier.findAndCountAll(filterObj);
            return ResponseService.SuccessResponse(res, 'success for getting all market suppliers', seletedSupplier);
        } catch (e) {
            return ResponseService.ErrorResponse(res, 'something wrong happen when getting all market suppliers ', e);
        }
    },
    payforSupplier: async function (req, res) {
        try {
            var supplier_id = req.param('id');
            var amount = req.param('amount');
            if (supplier_id && amount) {
                var SelectedSupplier = await Supplier.findOne({ where: { id: supplier_id } });
                SelectedSupplier.amount += amount;
                SelectedSupplier.save();
                return ResponseService.SuccessResponse(res, 'success add/remove this amount to supplier', SelectedSupplier);
            } else {
                return ResponseService.ErrorResponse(res, 'please provide the supplier id and amount id');
            }
        } catch (e) {
            return ResponseService.ErrorResponse(res, 'something wrong happen when getting all market suppliers ', e);
        }
    },
    getSupplierssExcel: async function (req, res) {
        try {
            var market_id = req.param('market_id');
            var Suppliers = await Supplier.findAll({ where: { market_id: market_id } });
            Suppliers = JSON.parse(JSON.stringify(Suppliers));
            var headers = ['الاسم', 'رقم التليفون', 'العنوان', 'المبلغ', 'ملاحظات', 'تاريخ الاضافه', 'اخر تعديل'];
            //console.log(Suppliers[0]);
            var wb = new xl.Workbook();
            var ws = wb.addWorksheet('بيانات الموردين');
            for (let i = 1; i <= headers.length; i++) {
                ws.cell(1, i).string(headers[i - 1]);
            }
            for (let i = 0; i < Suppliers.length; i++) {
                ws.cell(i + 2, 1).string(Suppliers[i].name);
                 ws.cell(i + 2, 2).string(Suppliers[i].telephone);
                 ws.cell(i + 2, 3).string(Suppliers[i].address);
                 ws.cell(i + 2, 4).number(Suppliers[i].amount);
                ws.cell(i + 2, 5).string(Suppliers[i].notes);
                ws.cell(i + 2, 6).string(Suppliers[i].createdAt);
                ws.cell(i + 2, 7).string(Suppliers[i].updatedAt);
            }
            var filenmae = randomstring.generate(10);
            await wb.write(`./.tmp/public/excel/${filenmae}.xlsx`);
            return ResponseService.SuccessResponse(res, 'success for generate excel file for the supplier', { fileName: filenmae + '.xlsx' });
        } catch (e) {
            console.log(e);
            return ResponseService.ErrorResponse(res, 'somthing wrong happen when get the cliens as excel ', e);
        }
    },
    getOneSupplierAsExcel: async function (req, res) {
        try {
            var supplier_id = req.param('supplier_id');
            if (supplier_id) {
                var SelectedSuplier = await Supplier.findOne({ where: { id: supplier_id } });
                SelectedSuplier = JSON.parse(JSON.stringify(SelectedSuplier));
                var headers = ['الاسم', 'رقم التليفون', 'العنوان', 'المبلغ', 'ملاحظات', 'تاريخ الاضافه', 'اخر تعديل'];
                var wb = new xl.Workbook();
                var ws = wb.addWorksheet('بيانات الموردين');
                for (let i = 1; i <= headers.length; i++) {
                    ws.cell(1, i).string(headers[i - 1]);
                }
                let i = 0;
                ws.cell(i + 2, 1).string(SelectedSuplier.name);
                ws.cell(i + 2, 2).string(SelectedSuplier.telephone);
                ws.cell(i + 2, 3).string(SelectedSuplier.address);
                ws.cell(i + 2, 4).number(SelectedSuplier.amount);
                ws.cell(i + 2, 5).string(SelectedSuplier.notes);
                ws.cell(i + 2, 6).string(SelectedSuplier.createdAt);
                ws.cell(i + 2, 7).string(SelectedSuplier.updatedAt);
                var filenmae = SelectedSuplier.name;
                await wb.write(`./.tmp/public/excel/${filenmae}.xlsx`);
                return ResponseService.SuccessResponse(res, 'success for generate excel file for the supplier', { fileName: filenmae + '.xlsx' });
            } else {
                return ResponseService.ErrorResponse(res, 'please provide the supplier id');
            }
        } catch (e) {
            console.log(e);
            return ResponseService.ErrorResponse(res, 'somthing wrong happen when get the supplier as excel ', e);
        }
    }

};

