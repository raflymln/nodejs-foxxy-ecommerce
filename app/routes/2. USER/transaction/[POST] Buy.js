const crypto = require('crypto');
const axios = require('axios');

module.exports = {
    name: '/user/transaction/buy',
    method: 'post',
    run: async(req, res, sess, db, ratelimit) => {
        try {
            if (req.app.config.BLOCK_TRANSACTION) {
                return res.send({
                    message: 'Transaction is Blocked, Please Contact Website Administrator.',
                    status: 403
                })
            }

            if (!ratelimit.get(req)) {
                return res.send({
                    message: ratelimit.alert(req, "Purchasing Product"),
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

            const products = require('../../../classes/products')(db);
            const carts = await db.table("carts").find({
                member_id: user.id
            });

            if (carts.length === 0) {
                return res.send({
                    message: "No Products Found!",
                    status: 400
                });
            }

            var productList = [];
            var totalAmount = 0;
            for (const cart of carts) {
                const product = await products.get(cart.productId);

                if (product) {
                    productList.push({
                        sku: product.id,
                        name: product.name,
                        price: (product.price + product.setupPrice),
                        quantity: cart.quantity,
                        store: product.store,
                        duration: product.duration,
                    });
                    totalAmount += (cart.quantity * (product.price + product.setupPrice));
                }

                db.table("carts").remove(cart.id)
            }

            if (totalAmount < 10000) {
                return res.send({
                    message: "Minimum Purchase is Rp10.000,00",
                    status: 400
                })
            }

            const params = req.body;
            const requestURL = `https://payment.tripay.co.id/${req.app.config.TRIPAY_SANDBOX ? 'api-sandbox' : 'api'}/transaction/create`;
            const signature = crypto.createHmac('sha256', req.app.config.TRIPAY_PRIVATE_KEY).update(req.app.config.TRIPAY_MERCHANT_CODE + totalAmount).digest('hex');

            const payload = {
                'method': params.method,
                'amount': totalAmount,
                'customer_name': user.username,
                'customer_email': user.email,
                'customer_phone': user.phoneNumber,
                'order_items': productList,
                'signature': signature,
                'return_url': req.app.config.APP_URL + '/member',
                'callback_url': req.app.config.APP_URL + '/user/transaction/update'
            }

            const headers = {
                headers: {
                    'Authorization': 'Bearer ' + req.app.config.TRIPAY_API_KEY
                }
            }

            try {
                const request = await axios.post(requestURL, payload, headers);
                const data = request.data.data;

                for (const product of productList) {
                    const expired = parseInt(product.duration) * 24 * 60 * 60 * 1000;
                    db.table('transactions').save({
                        member_id: user.id,
                        transaction_id: data.reference,
                        transaction_additional_information: params.additional_info,
                        product_id: product.sku,
                        product_amount: product.quantity,
                        product_store: product.store,
                        product_price: product.price,
                        payment_method: `TRIPAY-${data.payment_method}`,
                        payment_gateway: data.checkout_url,
                        date_purchased: new Date(Date.now()).toUTCString(),
                        date_expired: new Date(Date.now() + expired).toUTCString()
                    })
                }

                ratelimit.add(req, 30);
                return res.send({
                    message: data.checkout_url,
                    status: 200
                });
            } catch (error) {
                return res.send({
                    message: error.message,
                    status: 500
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