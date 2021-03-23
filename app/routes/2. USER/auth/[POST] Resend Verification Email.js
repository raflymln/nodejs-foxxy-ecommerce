const nodemailer = require("nodemailer");

module.exports = {
    name: '/user/auth/resend-verification-email',
    method: 'post',
    run: async(req, res, sess, db, ratelimit) => {
        try {
            if (req.app.config.BLOCK_RESEND_VERIFICATION_EMAIL) {
                return res.send({
                    message: 'Verification Email Resend Blocked, Please Contact Website Administrator.',
                    status: 403
                })
            }

            if (!ratelimit.get(req)) {
                return res.send({
                    message: ratelimit.alert(req, "Resending Your Verification Email"),
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
                if (account[0].verified == false) {
                    const verifyUrl = req.app.config.APP_URL + '/user/auth/verify/' + account[0].username + '/' + account[0].token;
                    const mailHTML = require('../../../templates/mail-register')(account[0].username, verifyUrl);

                    const transporter = nodemailer.createTransport(req.app.config.SMTP);
                    const mail = await transporter.sendMail({
                        from: '"Foxxy Indonesia" <noreply@foxxy.id>',
                        to: params.email,
                        subject: `Please Verify Your Account, ${account[0].username}`,
                        html: mailHTML,
                    });

                    ratelimit.add(req, 5 * 60);
                    return res.send({
                        message: 'Email has been sent, please check your mailbox',
                        status: 200
                    });
                } else {
                    return res.send({
                        message: 'Your Account has Verified!',
                        status: 403
                    })
                }
            }

            return res.send({
                message: 'Cannot Find Your Account.',
                status: 404
            })
        } catch (error) {
            return res.send({
                message: "Error Happened.",
                status: 500
            });
        }
    }
}