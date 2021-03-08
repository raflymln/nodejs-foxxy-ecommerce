module.exports = {
    name: '/user/verify/:username/:token',
    method: 'get',
    run: async(req, res, sess, db) => {
        if (req.app.config.BLOCK_ACCOUNT_VERIFICATION) {
            return res.send('Account Verification is Blocked, Please Contact Website Administrator.')
        }

        const params = req.params;
        const account = await db.table("members").find({ username: params.username });

        if (account.length > 0) {
            if ((account[0].verified == false) && (account[0].token == params.token)) {
                account[0].verified = true;
                account[0].token = null;
                db.table("members").save(account[0]);
                return res.redirect('/');
            } else {
                return res.send('Failed to verify your account, please resend verification email or contact web admin!')
            }
        } else {
            return res.send('Failed to verify your account, please resend verification email or contact web admin!')
        }
    }
}