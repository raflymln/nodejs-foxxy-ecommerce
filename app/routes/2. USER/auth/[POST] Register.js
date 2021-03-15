const md5 = require('md5');
const nodemailer = require("nodemailer");

module.exports = {
    name: '/user/auth/register',
    method: 'post',
    run: async(req, res, sess, db) => {
        try {
            if (req.app.config.BLOCK_ACCOUNT_REGISTRATION) {
                return res.send({
                    message: 'Account Registration is Blocked, Please Contact Website Administrator.',
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
            const findUsername = await db.table("members").find({ username: params.username });

            if (findUsername.length > 0) {
                return res.send({
                    message: 'Username is Taken!',
                    status: 400
                });
            }

            const findEmail = await db.table("members").find({ email: params.email });

            if (findEmail.length > 0) {
                return res.send({
                    message: 'Email is Taken!',
                    status: 400
                });
            }

            params.createdAt = new Date().toUTCString();
            params.password = md5(params.password);
            params.token = md5(Math.random().toString(36).substring(7));
            params.lastIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            params.lastUseragent = JSON.stringify({
                browser: req.useragent.browser,
                version: req.useragent.version,
                os: req.useragent.os,
                platform: req.useragent.platform
            });

            const transporter = nodemailer.createTransport(req.app.config.SMTP);
            const verifyUrl = req.app.config.APP_URL + '/user/auth/verify/' + params.username + '/' + params.token;
            const mail = await transporter.sendMail({
                from: '"Foxxy Indonesia" <noreply@foxxy.id>',
                to: params.email,
                subject: "Thank you for signing up!",
                html: `Please verify your email at: <a href='${verifyUrl}'>${verifyUrl}</a>`,
            });

            db.table("members").save(params);

            return res.send({
                message: 'Thank you for registering! Please verify your email address.',
                status: 200
            });
        } catch (error) {
            console.log(error)
            return res.send({
                message: "Error Happened.",
                status: 500
            });
        }
    }
}