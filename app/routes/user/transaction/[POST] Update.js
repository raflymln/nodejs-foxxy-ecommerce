module.exports = {
    name: '/transaction/update',
    method: 'post',
    run: async(req, res, sess, db) => {
        const refID = req.body.reference;
        const transactionList = await db.table("transactions").find({
            transaction_id: refID
        });

        if (transactionList.length > 0) {
            transactionList.map((transaction) => {
                transaction.paymentStatus = req.body.status
                db.table("transactions").save(transaction);
            })
        }

        res.send({
            "success": true
        })
    }
}