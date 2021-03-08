const glob = require("glob");
var routes = [];

const files = glob.sync(__basedir + "/public/components/*.html", {})
for (const file of files) {
    routes.push('/' + file.replace(/^.*[\\\/]/, '').replace('.html', ''))
}

module.exports = {
    name: routes,
    method: 'get',
    run: (req, res) => {
        res.sendFile(__basedir + '/public/index.html');
    }
}