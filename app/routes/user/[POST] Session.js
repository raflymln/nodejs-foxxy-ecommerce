module.exports = {
    name: '/user/session',
    method: 'post',
    run: async(req, res, sess, db) => {
        return res.send(sess.get(req) ? true : false);
    }
}