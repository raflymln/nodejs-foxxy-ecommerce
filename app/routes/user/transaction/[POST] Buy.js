const crypto = require('crypto');
const axios = require('axios');

module.exports = {
    name: '/transaction/buy',
    method: 'post',
    run: async(req, res, sess, db) => {
        const user = sess.get(req);
        if (!user) return res.send(false);

        const currentURL = process.env.APP_URL;
        const apiKey = process.env.TRIPAY_API_KEY;
        const privateKey = process.env.TRIPAY_PRIVATE_KEY;
        const merchant_code = process.env.TRIPAY_MERCHANT_CODE;

        var totalAmount = 0;
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
                    sku: productID,
                    name: product.Name,
                    price: product.Price,
                    quantity: cart.quantity
                })
                totalAmount += cart.quantity * product.Price;
            }

            db.table("carts").remove(cart.id)
        });

        const expiry = parseInt(Math.floor(new Date() / 1000) + (24 * 60 * 60));
        const signature = crypto.createHmac('sha256', privateKey).update(merchant_code + totalAmount).digest('hex');

        const payload = {
            'method': req.body.method,
            'amount': totalAmount,
            'customer_name': user.username,
            'customer_email': user.email,
            'customer_phone': user.phoneNumber,
            'order_items': productList,
            'expired_time': expiry,
            'signature': signature,
            'return_url': currentURL + '/dash/account',
            'callback_url': currentURL + '/transaction/update'
        }

        axios.post('https://payment.tripay.co.id/api-sandbox/transaction/create', payload, {
                headers: {
                    'Authorization': 'Bearer ' + apiKey
                }
            })
            .then((result) => {
                const data = result.data.data;
                payload.order_items.map((item) => {
                    db.table('transactions').save({
                        product_id: item.sku,
                        transaction_id: data.reference,
                        member_id: user.id,
                        payment_method: 'TRIPAY',
                        payment_gateway: data.checkout_url
                    })
                });
                res.send(data.checkout_url);
            })
            .catch((error) => {
                console.error(error)
                res.send(false)
            });
    }
}