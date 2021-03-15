const crypto = require("crypto");

module.exports = {
    name: '/user/transaction/update',
    method: 'post',
    run: async(req, res, sess, db) => {
        const signature = crypto.createHmac("sha256", req.app.config.TRIPAY_PRIVATE_KEY).update(JSON.stringify(req.body)).digest("hex");

        if ((req.headers['x-callback-event'] == 'payment_status') && (req.headers['x-callback-signature'] == signature)) {
            const params = req.body;
            const transactions = await db.table("transactions").find({
                transaction_id: params.reference
            });

            if (transactions.length > 0) {
                for (const transaction of transactions) {
                    transaction.paymentStatus = params.status;
                    db.table("transactions").save(transaction);

                    if (params.status == 'PAID') {
                        const products = await db.table("product_list").find({
                            id: transaction.productId
                        });

                        if (products.length > 0) {
                            products[0].stock -= transaction.productAmount;
                            db.table("product_list").save(products[0]);
                        }
                    }
                }
            }
        }

        return res.send({
            success: true,
            status: 200
        })
    }
}