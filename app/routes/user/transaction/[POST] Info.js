const fs = require("fs");

module.exports = {
    name: '/transaction/info/:ID',
    method: 'post',
    run: async(req, res, sess, db) => {
        const transactionList = await db.table("transactions").find({
            id: req.params.ID
        });

        if (transactionList.length > 0) {
            switch (transactionList[0].paymentStatus) {
                case 'PAID':
                    try {
                        const data = fs.readFileSync(`data/transactions/${req.params.ID}.md`, "utf8");
                        res.send(data);
                    } catch (error) {
                        res.send('Error or No Data Found.');
                    }
                    break;
                case 'UNPAID':
                    res.send(`# Please Complete Your Payments on [Here](${transactionList[0].paymentGateway})`);
                    break;
                default:
                    res.send('Invalid Payment Status!');
                    break;
            }
        } else {
            res.send(false);
        }
    }
}