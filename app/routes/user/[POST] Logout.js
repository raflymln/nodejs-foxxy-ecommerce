module.exports = {
    name: '/user/logout',
    method: 'get',
    run: async(req, res, sess, db) => {
        sess.delete(req);
        res.redirect('/');
    }
}