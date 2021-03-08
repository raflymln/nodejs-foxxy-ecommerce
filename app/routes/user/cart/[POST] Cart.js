module.exports = {
    name: '/user/cart',
    method: 'post',
    run: async(req, res, sess, db) => {
        const user = sess.get(req);
        if (!user) return res.send(false);

        var productList = [];
        const products = require('../../classes/products')(db);
        const cartList = await db.table("carts").find({
            member_id: user.id
        });

        cartList.map((cart) => {
            const productID = cart.productId.toUpperCase();
            const product = products.get(productID);
            if (product) {
                productList.push({
                    id: productID,
                    name: product.Name,
                    price: product.Price,
                    quantity: cart.quantity
                })
            }
        });

        res.send(productList)
    }
}