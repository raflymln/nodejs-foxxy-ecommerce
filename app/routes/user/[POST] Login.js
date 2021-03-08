const md5 = require('md5');

module.exports = {
    name: '/user/login',
    method: 'post',
    run: async(req, res, sess, db) => {
        if (req.app.config.BLOCK_ACCOUNT_LOGIN) {
            return res.send('Account Login is Blocked, Please Contact Website Administrator.')
        }

        const params = req.body;
        const data = await db.table("members").find({ email: params.email });

        if (data.length === 0) {
            return res.send('User not Found!');
        }

        const userData = data[0];

        if (userData.banned == true) {
            return res.send('You are banned! Please contact web admin.')
        }

        if (userData.verified == false) {
            return res.send('Please Verify Your Email First!')
        }

        if (md5(params.password) !== userData.password) {
            return res.send('Wrong Password!');
        }

        userData.updatedAt = new Date().toISOString();
        userData.lastIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        userData.lastUseragent = JSON.stringify({
            browser: req.useragent.browser,
            version: req.useragent.version,
            os: req.useragent.os,
            platform: req.useragent.platform
        });

        db.table("members").save(userData);

        if (!sess.get(req)) {
            sess.add(req, userData);
        }

        return res.send(true);
    }
}