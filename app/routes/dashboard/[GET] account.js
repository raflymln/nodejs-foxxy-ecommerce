module.exports = {
    name: '/account',
    method: 'get',
    run: (req, res) => {
        res.sendFile(__basedir + '/public/components/dashboard/index.html');

    }
}