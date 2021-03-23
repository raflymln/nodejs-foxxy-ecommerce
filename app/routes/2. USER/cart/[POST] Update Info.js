module.exports = {
    name: '/user/cart/updateInfo',
    method: 'post',
    run: async(req, res, sess, db, ratelimit) => {
        try {
            if (!ratelimit.get(req)) {
                return res.send({
                    message: ratelimit.alert(req, "Updating"),
                    status: 429
                });
            }

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

            if (params.additional_info.length > 355) {
                return res.send({
                    message: 'Information is too Long!',
                    status: 400
                });
            }

            if (cartList.length > 0) {
                cartList[0].additionalInformation = params.additional_info;
                cart.save(cartList[0])
                ratelimit.add(req, 5);

                return res.send({
                    message: 'Success Updating the product information!',
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