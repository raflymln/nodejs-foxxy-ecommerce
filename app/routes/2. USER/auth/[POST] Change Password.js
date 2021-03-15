const md5 = require('md5');

module.exports = {
    name: '/user/auth/change-password',
    method: 'post',
    run: async(req, res, sess, db) => {
        try {
            if (req.app.config.BLOCK_CHANGE_PASSWORD) {
                return res.send({
                    message: 'Password Change is Blocked, Please Contact Website Administrator.',
                    status: 403
                })
            }

            const user = sess.get(req);
            if (!user) {
                return res.send({
                    message: 'Please Login First!',
                    status: 401
                });
            }

            const params = req.body;
            const accounts = await db.table("members").find({ username: user.username });

            if (accounts.length > 0) {
                const account = accounts[0];
                if (md5(params.current_password) !== account.password) {
                    return res.send({
                        message: "Wrong Current Password!",
                        status: 400
                    });
                } else if (md5(params.password) == account.password) {
                    return res.send({
                        message: "You cannot use the same password as before!",
                        status: 400
                    })
                } else {
                    account.password = md5(params.password);
                    db.table("members").save(account);

                    return res.send({
                        message: "Successfully changed your password!",
                        status: 200
                    })
                }
            } else {
                return res.send({
                    message: "Cannot Find Your Account.",
                    status: 404
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