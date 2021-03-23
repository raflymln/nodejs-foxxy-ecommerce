const axios = require('axios');
var payments, updatedAt = Date.now();

module.exports = {
    name: '/api/payments',
    method: 'get',
    run: async(req, res, sess, db) => {
        try {
            if (!payments || (Date.now() - updatedAt > (1000 * 60 * 60 * 2))) {
                const response = await axios.get(`https://payment.tripay.co.id/${req.app.config.TRIPAY_SANDBOX ? 'api-sandbox' : 'api'}/merchant/payment-channel`, {
                    headers: {
                        'Authorization': `Bearer ${req.app.config.TRIPAY_API_KEY}`
                    }
                });

                payments = response.data.data.filter(x => x.active);
                updatedAt = Date.now();
                console.log(`[${new Date().toLocaleString()}] SYSTEM | Payments Updated!`)
            }

            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(payments, null, 3));
        } catch (error) {
            return res.send({
                message: "Error Happened.",
                status: 500
            });
        }
    }
}