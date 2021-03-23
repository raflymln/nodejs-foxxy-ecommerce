const md5 = require('md5');
const nodemailer = require("nodemailer");

module.exports = {
    name: '/user/auth/forgot-password',
    method: 'post',
    run: async(req, res, sess, db, ratelimit) => {
        try {
            if (req.app.config.BLOCK_FORGOT_PASSWORD) {
                return res.send({
                    message: 'Forgot Password Email Blocked, Please Contact Website Administrator.',
                    status: 403
                })
            }

            if (!ratelimit.get(req)) {
                return res.send({
                    message: ratelimit.alert(req, "Resending Your Email"),
                    status: 429
                });
            }

            const user = sess.get(req);
            if (user) {
                return res.send({
                    message: 'You are already logged in!',
                    status: 403
                });
            }

            const params = req.body;
            const account = await db.table("members").find({ email: params.email });

            if (account.length > 0) {
                const newPassword = generatePassword();
                const mailHTML = require('../../../templates/mail-forgot-password')(account[0].username, newPassword);

                account[0].password = md5(newPassword);
                db.table("members").save(account[0]);

                const transporter = nodemailer.createTransport(req.app.config.SMTP);
                const mail = await transporter.sendMail({
                    from: '"Foxxy Indonesia" <noreply@foxxy.id>',
                    to: params.email,
                    subject: `Seems That You Forgot Your Password, ${account[0].username}`,
                    html: mailHTML
                });

                ratelimit.add(req, 5 * 60);
                return res.send({
                    message: 'Email has been sent, please check your mailbox!',
                    status: 200
                });
            }

            return res.send({
                message: 'Cannot Find Your Account.',
                status: 404
            });
        } catch (error) {
            return res.send({
                message: "Error Happened.",
                status: 500
            });
        }
    }
}

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}