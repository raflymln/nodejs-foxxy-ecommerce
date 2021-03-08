module.exports = {
    name: '/api/products',
    method: 'get',
    run: async(req, res, sess, db) => {
        try {
            const product = require('../../classes/products')(db);
            const list = await product.list();

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(list, null, 3));
        } catch (error) {
            res.send(false);
        }
    }
}