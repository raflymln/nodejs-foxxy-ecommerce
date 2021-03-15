module.exports = {
    name: '/api/products/:id',
    method: 'get',
    run: async(req, res, sess, db) => {
        try {
            const product = require('../../classes/products')(db);
            const list = await product.get(req.params.id);

            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(list, null, 3));
        } catch (error) {
            return res.send({
                message: "Error Happened.",
                status: 500
            });
        }
    }
}