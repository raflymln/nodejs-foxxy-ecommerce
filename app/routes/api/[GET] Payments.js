const axios = require('axios');
var payments, updatedAt = Date.now();

module.exports = {
    name: '/api/payments',
    method: 'get',
    run: async(req, res, sess, db) => {
        try {
            if (!payments || (Date.now() - updatedAt > (1000 * 60 * 60 * 2))) {
                const response = await axios.get('https://payment.tripay.co.id/api-sandbox/merchant/payment-channel', {
                    headers: {
                        'Authorization': `Bearer ${req.app.config.TRIPAY_API_KEY}`
                    }
                });

                payments = response.data.data.filter(x => x.active);
                updatedAt = Date.now();
                console.log('Payments Updated!')
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(payments, null, 3));
        } catch (error) {
            res.send(false)
        }
    }
}