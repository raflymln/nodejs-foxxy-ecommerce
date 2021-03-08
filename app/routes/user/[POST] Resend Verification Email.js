const nodemailer = require("nodemailer");

module.exports = {
    name: '/user/resend-verification-email',
    method: 'post',
    run: async(req, res, sess, db) => {
        if (req.app.config.BLOCK_RESEND_VERIFICATION_EMAIL) {
            return res.send('Verification Email Resend Blocked, Please Contact Website Administrator.')
        }

        const params = req.body;
        const account = await db.table("members").find({ email: params.email });

        if (account.length > 0) {
            if (account[0].verified == false) {
                const transporter = nodemailer.createTransport(req.app.config.SMTP);
                const verifyUrl = req.app.config.APP_URL + '/user/verify/' + account[0].username + '/' + account[0].token;
                const mail = await transporter.sendMail({
                    from: '"Foxxy Indonesia" <noreply@foxxy.id>',
                    to: params.email,
                    subject: "Thank you for signing up!",
                    html: `Please verify your email at: <a href='${verifyUrl}'>${verifyUrl}</a>`,
                });

                return res.send(true);
            } else {
                return res.send('Your Account has Verified!')
            }
        }

        return res.send('Cannot Find Your Account.')
    }
}