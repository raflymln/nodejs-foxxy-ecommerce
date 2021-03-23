module.exports = {
    name: '/user/cart',
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
            const carts = await db.table("carts").find({
                member_id: user.id
            });

            if (carts.length > 0) {
                var list = [];

                for (const cart of carts) {
                    const product = await products.get(cart.productId);
                    const variant = product.variants.find(x => x.id == cart.productVariantId);

                    if (product && variant) {
                        list.push(Object.assign({
                            cartId: cart.id,
                            quantity: cart.quantity,
                            information: cart.additionalInformation,
                            variant
                        }, product))
                    }
                }

                return res.send({
                    data: list,
                    status: 200
                });
            } else {
                return res.send({
                    message: 'No Product Found!',
                    status: 404
                });
            }
        } catch (error) {
            return res.send({
                message: "Error Happened.",
                status: 500
            });
        }
    }
}