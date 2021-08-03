/**
 * ClientController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var xl = require('excel4node');
var randomstring = require('randomstring');
module.exports = {
    create: async function (req, res) {
        try {
            var ClientOBJ = {
                name: req.param('name'),
                address: req.param('address'),
                telephone: req.param('telephone'),
                notes: req.param('notes'),
                market_id: req.param('market_id')
            }
            if (ClientOBJ.name  && ClientOBJ.market_id) {
                var CreatedSupplier = await Client.create(ClientOBJ);
                //update thing
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
            var client_id = req.param('id');
            if (client_id) {
                var DeletedSupplier = await Client.findOne({ where: { id: client_id } });
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
            var ClientOBJ = {
                id: req.param('id'),
                name: req.param('name'),
                address: req.param('address'),
                telephone: req.param('telephone'),
                notes: req.param('notes'),
                market_id: req.param('market_id')
            }
            if (ClientOBJ.name && ClientOBJ.id && ClientOBJ.address && ClientOBJ.notes && ClientOBJ.market_id) {
                var EditedClient = await Client.findOne({ where: { id: ClientOBJ.id } });
                EditedClient.name = ClientOBJ.name;
                EditedClient.address = ClientOBJ.address;
                EditedClient.notes = ClientOBJ.notes;
                EditedClient.market_id = ClientOBJ.market_id;
                EditedClient.telephone = ClientOBJ.telephone;
                await EditedClient.save();
                return ResponseService.SuccessResponse(res, 'success for creating the supplier', EditedClient);
            } else {
                return ResponseService.ErrorResponse(res, 'please provide the supplier data');
            }
        } catch (e) {
            return ResponseService.ErrorResponse(res, 'somethin wrong happen when edit the supplier', e);
        }
    },
    getAllClients: async function (req, res) {
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
            var SeletedClient = await Client.findAndCountAll(filterObj);
            return ResponseService.SuccessResponse(res, 'success for getting all market suppliers', SeletedClient);
        } catch (e) {
            return ResponseService.ErrorResponse(res, 'something wrong happen when getting all market suppliers ', e);
        }
    },
    payforClient: async function (req, res) {
        try {
            var client_id = req.param('id');
            var amount = req.param('amount');
            if (client_id && amount) {
                var SelectedClient = await Client.findOne({ where: { id: client_id } });
                SelectedClient.amount += amount;
                SelectedClient.save();
                return ResponseService.SuccessResponse(res, 'success add/remove this amount to supplier', SelectedClient);
            } else {
                return ResponseService.ErrorResponse(res, 'please provide the supplier id and amount id');
            }
        } catch (e) {
            return ResponseService.ErrorResponse(res, 'something wrong happen when getting all market suppliers ', e);
        }
    },
    getClientasExcel: async function (req, res) {
        try {
            var market_id = req.param('market_id');
            var Clients = await Client.findAll({ where: { market_id: market_id } });
            Clients = JSON.parse(JSON.stringify(Clients));
            var headers = ['الاسم', 'رقم التليفون', 'العنوان', 'المبلغ', 'ملاحظات', 'تاريخ الاضافه', 'اخر تعديل'];
            //console.log(Suppliers[0]);
            var wb = new xl.Workbook();
            var ws = wb.addWorksheet('بيانات العملاء');
            for (let i = 1; i <= headers.length; i++) {
                ws.cell(1, i).string(headers[i - 1]);
            }
            for (let i = 0; i < Clients.length; i++) {
                ws.cell(i + 2, 1).string(Clients[i].name);
                ws.cell(i + 2, 2).string(Clients[i].telephone);
                ws.cell(i + 2, 3).string(Clients[i].address);
                ws.cell(i + 2, 4).number(Clients[i].amount);
                ws.cell(i + 2, 5).string(Clients[i].notes);
                ws.cell(i + 2, 6).string(Clients[i].createdAt);
                ws.cell(i + 2, 7).string(Clients[i].updatedAt);
            }
            var filenmae = randomstring.generate(10);
            await wb.write(`./.tmp/public/excel/${filenmae}.xlsx`);
            return ResponseService.SuccessResponse(res, 'success for generate excel file for the Clients', { fileName: filenmae + '.xlsx' });
        } catch (e) {
            console.log(e);
            return ResponseService.ErrorResponse(res, 'somthing wrong happen when get the Clients as excel ', e);
        }
    },
    getOneClientAsExcel: async function (req, res) {
        try {
            var client_id = req.param('client_id');
            if (client_id) {
                var SelectedClient = await Client.findOne({ where: { id: client_id } });
                SelectedClient = JSON.parse(JSON.stringify(SelectedClient));
                var headers = ['الاسم', 'رقم التليفون', 'العنوان', 'المبلغ', 'ملاحظات', 'تاريخ الاضافه', 'اخر تعديل'];
                var wb = new xl.Workbook();
                var ws = wb.addWorksheet('بيانات العملاء');
                for (let i = 1; i <= headers.length; i++) {
                    ws.cell(1, i).string(headers[i - 1]);
                }
                let i = 0;
                ws.cell(i + 2, 1).string(SelectedClient.name);
                ws.cell(i + 2, 2).string(SelectedClient.telephone);
                ws.cell(i + 2, 3).string(SelectedClient.address);
                ws.cell(i + 2, 4).number(SelectedClient.amount);
                ws.cell(i + 2, 5).string(SelectedClient.notes);
                ws.cell(i + 2, 6).string(SelectedClient.createdAt);
                ws.cell(i + 2, 7).string(SelectedClient.updatedAt);
                var filenmae = SelectedClient.name;
                await wb.write(`./.tmp/public/excel/${filenmae}.xlsx`);
                return ResponseService.SuccessResponse(res, 'success for generate excel file for the Clients', { fileName: filenmae + '.xlsx' });
            } else {
                return ResponseService.ErrorResponse(res, 'please provide the client id');
            }
        } catch (e) {
            console.log(e);
            return ResponseService.ErrorResponse(res, 'somthing wrong happen when get the Clients as excel ', e);
        }
    }

};