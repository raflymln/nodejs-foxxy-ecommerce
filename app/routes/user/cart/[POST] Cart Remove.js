module.exports = {
    name: '/user/cart/remove',
    method: 'post',
    run: async(req, res, sess, db) => {
        const user = sess.get(req);
        if (!user) return res.send(false);

        const productID = req.body.productID.toUpperCase();
        const products = require('../../../classes/products')(db);
        const product = products.get(productID);

        if (product) {
            const cart = db.table("carts");
            const cartList = await cart.find({
                member_id: user.id,
                product_id: productID
            });

            if (cartList.length > 0) {
                cart.remove(cartList[0].id)
            }
            res.send(true);
        } else {
            res.send('Cannot Find That Product!')
        }

    }
}