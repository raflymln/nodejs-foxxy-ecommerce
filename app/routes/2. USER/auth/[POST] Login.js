const md5 = require('md5');

module.exports = {
    name: '/user/auth/login',
    method: 'post',
    run: async(req, res, sess, db) => {
        try {
            if (req.app.config.BLOCK_ACCOUNT_LOGIN) {
                return res.send({
                    message: 'Account Login is Blocked, Please Contact Website Administrator.',
                    status: 403
                })
            }

            const user = sess.get(req);
            if (user) {
                return res.send({
                    message: 'You are already logged in!',
                    status: 403
                });
            }

            const params = req.body;
            const data = await db.table("members").find({ email: params.email });

            if (data.length === 0) {
                return res.send({
                    message: 'User not Found!',
                    status: 404
                });
            }

            const userData = data[0];

            if (userData.banned == true) {
                return res.send({
                    message: 'You are banned! Please contact web admin.',
                    status: 403
                })
            }

            if (userData.verified == false) {
                return res.send({
                    message: 'Please Verify Your Email First!',
                    status: 401
                })
            }

            if (md5(params.password) !== userData.password) {
                return res.send({
                    message: 'Wrong Password!',
                    status: 400
                });
            }

            userData.updatedAt = new Date().toUTCString();
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

            return res.send({
                message: 'You are now logged in.',
                status: 200
            });
        } catch (error) {
            return res.send({
                message: "Error Happened.",
                status: 500
            });
        }
    }
}