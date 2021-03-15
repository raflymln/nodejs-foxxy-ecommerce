module.exports = {
    name: '/user/session',
    method: 'post',
    run: async(req, res, sess, db) => {
        const session = sess.get(req);

        if (!session) {
            return res.send({
                message: 'Unauthorized',
                status: 401
            })
        }

        const members = await db.table("members").find({
            id: session.id
        });

        if (members.length > 0) {
            const account = members[0];
            if (account.banned) {
                return res.send({
                    message: "You are Banned!",
                    status: 403
                });
            } else {
                return res.send({
                    data: {
                        first_name: session.nameFirst,
                        last_name: session.nameLast,
                        username: session.username,
                        email: session.email
                    },
                    status: 200
                });
            }
        } else {
            return res.send({
                message: "Account not found!",
                status: 404
            })
        }
    }
}