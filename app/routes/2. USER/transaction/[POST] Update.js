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

                    if (params.status == 'PAID') {
                        const products = await db.table("product_variants").find({
                            id: transaction.productVariantId
                        });

                        if (products.length > 0) {
                            products[0].stock -= transaction.productAmount;
                            db.table("product_variants").save(products[0]);
                        }

                        const stock = await db.table("product_stocks").find({
                            product_id: transaction.productId,
                            product_variant_id: transaction.productVariantId
                        });

                        if (stock.length > 0) {
                            transaction.productDescription = stock[0].description;
                            transaction.productStatus = 'ACTIVE';
                            db.table("product_stocks").remove(stock[0]);
                        }
                    }

                    db.table("transactions").save(transaction);
                }
            }
        }

        return res.send({
            success: true,
            status: 200
        })
    }
}