module.exports = {
    name: '/user/cart/add',
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
            params.quantity = parseInt(params.quantity) || 1;

            if (params.quantity > 50) {
                return res.send({
                    message: 'Please contact admin for a big purchase!',
                    status: 400
                });
            }

            const products = require('../../../classes/products')(db);
            const product = await products.get(params.productID);

            if (product) {
                const cart = db.table("carts");
                const cartList = await cart.find({
                    member_id: user.id,
                    product_id: params.productID
                });

                if (params.quantity > product.stock) {
                    return res.send({
                        message: 'You cannot add more than the available product stock!',
                        status: 400
                    });
                }

                var totalCartAmount = 0;
                for (const list of cartList) {
                    totalCartAmount += list.quantity;
                }

                if (totalCartAmount >= product.stock) {
                    return res.send({
                        message: 'You have reached max amount of that product in your cart!',
                        status: 400
                    });
                }

                if ((cartList.length > 0) && product.stackable) {
                    if ((params.quantity + totalCartAmount) > product.stock) {
                        return res.send({
                            message: 'You cannot add more than the available product stock, please check your cart!',
                            status: 400
                        })
                    }

                    cartList[0].quantity += params.quantity
                    cart.save(cartList[0]);
                } else {
                    if (!product.stackable) {
                        if ((params.quantity + totalCartAmount) > product.maximumPurchase) {
                            if ((totalCartAmount > 0) && (totalCartAmount <= product.maximumPurchase)) {
                                return res.send({
                                    message: `Maximum purchase of this product is ${product.maximumPurchase} items, please check your cart!`,
                                    status: 400
                                });
                            }
                            return res.send({
                                message: `Maximum purchase of this product is ${product.maximumPurchase} items, please contact us for large purchases!`,
                                status: 400
                            });
                        }

                        for (var i = 0; i < params.quantity; i++) {
                            cart.save({
                                member_id: user.id,
                                product_id: params.productID,
                                quantity: 1
                            })
                        }
                    } else {
                        cart.save({
                            member_id: user.id,
                            product_id: params.productID,
                            quantity: params.quantity
                        })
                    }
                }

                return res.send({
                    message: 'Successfully Added Product to Your Cart!',
                    status: 200
                });
            } else {
                return res.send({
                    message: 'Cannot Find That Product!',
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