module.exports = {
    name: '/user/transaction/review',
    method: 'post',
    run: async(req, res, sess, db, ratelimit) => {
        try {
            const user = sess.get(req);
            if (!user) {
                return res.send({
                    message: 'Please Login First!',
                    status: 401
                });
            }

            if (!ratelimit.get(req)) {
                return res.send({
                    message: ratelimit.alert(req, "Updating a Product Review"),
                    status: 429
                });
            }

            const params = req.body;
            params.stars = parseInt(params.stars);
            if (!params.stars || !!isNaN(params.stars)) {
                return res.send({
                    message: 'Please Leave Stars Review',
                    status: 400
                })
            }

            if (params.stars > 5 || params.stars < 1) {
                return res.send({
                    message: 'Please Leave a Valid Stars Review',
                    status: 400
                })
            }

            if (!params.reviews) {
                return res.send({
                    message: 'Please Leave A Review Message',
                    status: 400
                })
            }

            if (!params.reviews.length > 200) {
                return res.send({
                    message: 'Review Message is Too Long!',
                    status: 400
                })
            }

            const transactions = await db.table("transactions").find({
                id: params.transaction_id
            });

            if (transactions.length > 0) {
                const transaction = transactions[0];

                if (transaction.paymentStatus !== "PAID") {
                    return res.send({
                        message: "You haven't purchased that transaction yet!",
                        status: 403
                    });
                }

                params.date = new Date(Date.now()).toUTCString();
                params.member_id = user.id;

                const reviews = await db.table("product_reviews").find({
                    transaction_id: transaction.id
                });

                if (reviews.length > 0) {
                    params.id = reviews[0].id;

                    if (params.reviews == reviews[0].reviews || params.stars == reviews[0].stars) {
                        return res.send({
                            message: "Thank you for your review!",
                            updating: false,
                            status: 200
                        })
                    }
                }

                ratelimit.add(req, 60);
                db.table("product_reviews").save(params);
                return res.send({
                    message: "Your review has been updated, thank you for your review!",
                    updating: true,
                    status: 200
                })
            } else {
                return res.send({
                    message: "Cannot Find That Transaction!",
                    status: 404
                });
            }
        } catch (error) {
            console.log(error)
            return res.send({
                message: "Error Happened.",
                status: 500
            });
        }
    }
}