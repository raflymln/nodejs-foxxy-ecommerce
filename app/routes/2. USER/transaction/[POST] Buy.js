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
                const variant = product.variants.find(x => x.id == cart.productVariantId);

                if (product && variant) {
                    const sku = `FOXXY-CG${product.categoryId}PL${product.id}PV${variant.id}`;

                    productList.push({
                        sku,
                        id: product.id,
                        variantId: variant.id,
                        name: `${product.name} | ${variant.name}`,
                        price: (variant.price + variant.setupPrice),
                        quantity: cart.quantity,
                        storeID: product.store.id,
                        usageDuration: variant.usageDuration,
                        warrantyDuration: variant.warrantyDuration,
                        info: cart.additionalInformation
                    });
                    totalAmount += (cart.quantity * (variant.price + variant.setupPrice));
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
                    const usageExpired = parseInt(product.usageDuration) * 24 * 60 * 60 * 1000;
                    const warrantyExpired = parseInt(product.warrantyDuration) * 24 * 60 * 60 * 1000;
                    db.table('transactions').save({
                        member_id: user.id,
                        store_id: product.storeID,
                        transaction_id: data.reference,
                        transaction_additional_information: product.info,
                        product_id: product.id,
                        product_variant_id: product.variantId,
                        product_amount: product.quantity,
                        product_price: product.price,
                        payment_method: `TRIPAY-${data.payment_method}`,
                        payment_gateway: data.checkout_url,
                        date_purchased: new Date(Date.now()).toUTCString(),
                        date_product_expired: new Date(Date.now() + usageExpired).toUTCString(),
                        date_warranty_expired: new Date(Date.now() + warrantyExpired).toUTCString()
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