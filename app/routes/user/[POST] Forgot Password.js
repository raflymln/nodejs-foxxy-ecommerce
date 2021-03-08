const md5 = require('md5');
const nodemailer = require("nodemailer");

module.exports = {
    name: '/user/forgot-password',
    method: 'post',
    run: async(req, res, sess, db) => {
        if (req.app.config.BLOCK_FORGOT_PASSWORD) {
            return res.send('Forgot Password Email Blocked, Please Contact Website Administrator.')
        }

        const params = req.body;
        const account = await db.table("members").find({ email: params.email });

        if (account.length > 0) {
            const newPassword = generatePassword();

            account[0].password = md5(newPassword);
            db.table("members").save(account[0]);

            const transporter = nodemailer.createTransport(req.app.config.SMTP);
            const mail = await transporter.sendMail({
                from: '"Foxxy Indonesia" <noreply@foxxy.id>',
                to: params.email,
                subject: "Thank you for requesting password resets!",
                html: `Here your new password: ${newPassword}`,
            });

            return res.send(true);
        }

        return res.send('Cannot Find Your Account.');
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