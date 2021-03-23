module.exports = {
    name: '/user/cart/remove',
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

            const params = req.body;
            const cart = db.table("carts");
            const cartList = await cart.find({
                id: params.cartId,
                member_id: user.id
            });

            if (cartList.length > 0) {
                cart.remove(cartList[0].id)
                return res.send({
                    message: 'Success removing the product from your cart!',
                    status: 200
                });
            } else {
                return res.send({
                    message: 'No matching product found, please refresh the page!',
                    status: 404
                })
            }
        } catch (error) {
            return res.send({
                message: "Error Happened.",
                status: 500
            });
        }
    }
}