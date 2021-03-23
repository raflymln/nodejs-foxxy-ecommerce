module.exports = {
    name: '/user/transaction/list',
    method: 'post',
    run: async(req, res, sess, db) => {
        try {
            const user = sess.get(req);
            if (!user) {
                return res.send({
                    message: 'Please Login First!',
                    status: 401
                });
            }

            const products = require('../../../classes/products')(db);
            const transactions = await db.table("transactions").find({
                member_id: user.id
            });

            var list = [];
            if (transactions.length > 0) {
                for (const transaction of transactions) {
                    const product = await products.get(transaction.productId) || { name: "Product Not Found" };
                    const variant = product.variants.find(x => x.id == transaction.productVariantId) || { name: "Variant Not Found" };
                    const reviews = await db.table("product_reviews").find({
                        transaction_id: transaction.id
                    });

                    list.push(Object.assign({
                        product,
                        variant,
                        review: (reviews[0]) ? reviews[0] : false
                    }, transaction));
                }
            }

            return res.send({
                data: list,
                status: 200
            });
        } catch (error) {
            return res.send({
                message: "Error Happened.",
                status: 500
            });
        }
    }
}