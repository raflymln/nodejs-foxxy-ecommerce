module.exports = {
    name: '/member',
    method: 'get',
    run: (req, res, sess) => {
        if (!sess.get(req)) {
            return res.redirect('/')
        }
        return res.sendFile(__basedir + '/public/member/index.html');
    }
}