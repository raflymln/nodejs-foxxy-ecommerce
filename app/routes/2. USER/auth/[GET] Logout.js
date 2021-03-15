module.exports = {
    name: '/user/auth/logout',
    method: 'get',
    run: async(req, res, sess, db) => {
        sess.delete(req);
        return res.redirect('/');
    }
}