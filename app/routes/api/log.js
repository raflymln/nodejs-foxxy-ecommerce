module.exports = {
    name: '/api/log',
    method: 'post',
    run: async(req, res, sess, db) => {
        console.log(req.body);
        res.send('OK')
    }
}