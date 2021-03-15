module.exports = {
    name: '/user/auth/verify/:username/:token',
    method: 'get',
    run: async(req, res, sess, db) => {
        try {
            if (req.app.config.BLOCK_ACCOUNT_VERIFICATION) {
                return res.send({
                    message: 'Account Verification is Blocked, Please Contact Website Administrator.',
                    status: 403
                })
            }

            const params = req.params;
            const accounts = await db.table("members").find({ username: params.username });

            if (accounts.length > 0) {
                const account = accounts[0];
                if (!account.verified && (account.token == params.token)) {
                    account.verified = true;
                    account.token = null;
                    db.table("members").save(account);

                    return res.redirect('/');
                } else {
                    return res.send({
                        message: 'Failed to verify your account, please resend verification email or contact web admin!',
                        status: 400
                    })
                }
            } else {
                return res.send({
                    message: 'Failed to verify your account, please resend verification email or contact web admin!',
                    status: 404
                })
            }
        } catch (error) {
            return res.send({
                message: "Error Happened.",
                status: 500
            });
        }
    }
}