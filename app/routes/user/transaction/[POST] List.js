module.exports = {
    name: '/transaction/list',
    method: 'post',
    run: async(req, res, sess, db) => {
        const user = sess.get(req);
        if (!user) return res.send(false);

        const products = require('../../../classes/products')(db);
        const transactionList = await db.table("transactions").find({
            member_id: user.id
        });

        var list = [];
        if (transactionList.length > 0) {
            transactionList.map((transaction) => {
                list.push(Object.assign({
                    product: products.get(transaction.productId)
                }, transaction))
            })
        }

        res.send(list)
    }
}