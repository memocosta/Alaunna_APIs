/**
 * TransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    index: async function (req, res) {
        try {
            var safe_id = req.param('safe_id');
            var offset = req.param('offset');
            var filterOB = {};
            if (safe_id) {
                filterOB['where'] = { safe_id: safe_id };
            }
            if (offset) {
                filterOB['offset'] = offset * 10;
                filterOB['limit'] = 10;
            }
            filterOB['include'] = ['supplier' , 'client'];
            var SelectedTransiaction = await Transaction.findAndCountAll(filterOB);
            return ResponseService.SuccessResponse(res, 'success for getting the transactions', SelectedTransiaction);
        } catch (e) {
            return ResponseService.ErrorResponse(res, 'somthing wrong happen when getting the transactions', e);
        }
    },
    delete: async function (req, res) {
        try {
            var transaction_id = req.param('id');
            if (transaction_id) {
                var SelectedTransiaction = await Transaction.findOne({ where: { id: transaction_id } });
                await SelectedTransiaction.destroy();
                return ResponseService.SuccessResponse(res, 'the transaction has been deleted successfully', SelectedTransiaction);
            } else {
                return ResponseService.ErrorResponse(res, 'please provide the transaction id');
            }
        } catch (e) {
            return ResponseService.ErrorResponse(res, 'somthing wrong happen when deleting the transactions', e);
        }
    },
    edit: async function (req, res) {
        try {
            var safe_id = req.param('safe_id');
            var transactionOBj = {
                id: req.param('id'),
                amount: req.param('amount'),
                // note: req.param('note'),
                // Transaction_type: req.param('Transaction_type'),
                // client_id: req.param('client_id'),
                // supplier_id: req.param('supplier_id'),
                // affect_safe: req.param('affect_safe'),
            };
            var SelectedTransiaction = await Transaction.findOne({ where: { id: transactionOBj.id } });
            var SelectedSafe = await Safe.findOne({ where: { id: safe_id } });
            // back thigns to it's owners
            // if (SelectedTransiaction.client_id != transactionOBj.client_id) {
            //     let newClient = await Client.findOne({ where: { id: transactionOBj.client_id } });
            //     oldCLient.amount += (-1 * SelectedTransiaction.amount);
            //     await oldCLient.save();
            //     newClient.amount += transactionOBj.amount;
            //     await newClient.save();
            // }
            
        } catch (e) {

        }
    },
    create: async function (req, res) {
        try {
            var safe_id = req.param('safe_id');
            var transactionOBJ = {
                safe_id : req.param('safe_id'),
                amount: req.param('amount'),
                note: req.param('note'),
                Transaction_type: req.param('Transaction_type'),
                client_id: req.param('client_id'),
                supplier_id: req.param('supplier_id'),
                affect_safe: req.param('affect_safe'),
            }
            if (!safe_id && transactionOBJ.amount) {
                return ResponseService.ErrorResponse(res, 'please provide all safe id and transaction data');
            }
            var SelectedSafe = await Safe.findOne({ where: { id: safe_id } });
            var CreatedTransaction = await Transaction.create(transactionOBJ);
            console.log(transactionOBJ);
            if (transactionOBJ.Transaction_type == 'ClientTransacion') {
                if (!transactionOBJ.client_id) {
                    return ResponseService.ErrorResponse(res, 'please provide the client id');
                }
                var selectedClient = await Client.findOne({ where: { id: transactionOBJ.client_id } })

                selectedClient.amount += parseFloat(transactionOBJ.amount);
                await selectedClient.save();
                if (transactionOBJ.affect_safe) {
                    SelectedSafe.amount += parseFloat(transactionOBJ.amount);
                    SelectedSafe.save();
                }
            } else if (transactionOBJ.Transaction_type == 'SupplierTransaction') {
                if (!transactionOBJ.supplier_id) {
                    return ResponseService.ErrorResponse(res, 'please provide the supploer id');
                }
                var selectedSupllier = await Supplier.findOne({ where: { id: transactionOBJ.supplier_id } })
                selectedSupllier.amount += parseFloat(transactionOBJ.amount);
                await selectedSupllier.save();
                if (transactionOBJ.affect_safe) {
                    SelectedSafe.amount += tparseFloat(transactionOBJ.amount);
                    SelectedSafe.save();
                }
            } else if (transactionOBJ.Transaction_type == 'SafeTransaction') {
                SelectedSafe.amount += parseFloat(transactionOBJ.amount);
                SelectedSafe.save();
            }
            return ResponseService.SuccessResponse(res, 'the transactions has been made successfully', CreatedTransaction);
        } catch (e) {
            console.log(e);
            return ResponseService.ErrorResponse(res, 'some thing wrong hapen when create the transaction', e);
        }
    },
    

};

