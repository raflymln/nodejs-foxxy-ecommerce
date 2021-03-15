module.exports = {
    name: '/api/subscribe',
    method: 'post',
    run: async(req, res, sess, db, ratelimit) => {
        try {
            if (req.app.config.BLOCK_EMAIL_SUBSCRIPTION) {
                return res.send({
                    message: 'Email Subscription is Blocked, Please Contact Website Administrator.',
                    status: 403
                })
            }

            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const email = req.body.email;

            if (!ratelimit.get(req)) {
                return res.send({
                    message: ratelimit.alert(req, "Subscribing"),
                    status: 429
                });
            }

            if (!email || !validateEmail(email)) {
                return res.send({
                    message: "Not a Valid Email!",
                    status: 400
                });
            }

            const data = await db.table("email_subscriber").find({ email });

            if (data.length > 0) {
                return res.send({
                    message: "You have already subscribe to our newsletter!",
                    status: 403
                });
            } else {
                db.table("email_subscriber").save({ email, ip });

                ratelimit.add(req, 30 * 60);
                return res.send({
                    message: "Thank You For Subscribing to Our Newsletter!",
                    status: 200
                });
            }
        } catch (error) {
            return res.send({
                message: "Error Happened.",
                status: 500
            });
        }
    }
}

function validateEmail(mail) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
        return true
    }
    return false
}