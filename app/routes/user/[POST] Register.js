const md5 = require('md5');
const nodemailer = require("nodemailer");

module.exports = {
    name: '/user/register',
    method: 'post',
    run: async(req, res, sess, db) => {
        if (req.app.config.BLOCK_ACCOUNT_REGISTRATION) {
            return res.send('Account Registration is Blocked, Please Contact Website Administrator.')
        }

        const params = req.body;
        const findUsername = await db.table("members").find({ username: params.username });

        if (findUsername.length > 0) {
            return res.send('Username is Taken!');
        }

        const findEmail = await db.table("members").find({ email: params.email });

        if (findEmail.length > 0) {
            return res.send('Email is Taken!');
        }

        params.password = md5(params.password);
        params.token = md5(Math.random().toString(36).substring(7));
        params.lastIp = requestIp;
        params.lastUseragent = JSON.stringify({
            browser: req.useragent.browser,
            version: req.useragent.version,
            os: req.useragent.os,
            platform: req.useragent.platform
        });

        const transporter = nodemailer.createTransport(req.app.config.SMTP);
        const verifyUrl = req.app.config.APP_URL + '/user/verify/' + params.username + '/' + params.token;
        const mail = await transporter.sendMail({
            from: '"Foxxy Indonesia" <noreply@foxxy.id>',
            to: params.email,
            subject: "Thank you for signing up!",
            html: `Please verify your email at: <a href='${verifyUrl}'>${verifyUrl}</a>`,
        });

        db.table("members").save(params);

        return res.send(true);
    }
}