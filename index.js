__basedir = __dirname;
const config = require('./config');

const http = require('http');
const express = require('express');

const bodyParser = require('body-parser');
const useragent = require('express-useragent');
const Sessions = require('./app/classes/sessions');

const mysqlWrapper = require('node-mysql-wrapper');
const glob = require("glob");

const app = express();
const server = http.createServer(app);
const db = mysqlWrapper.wrap(config().MYSQL.connect);
const session = new Sessions;

glob(__dirname + "/app/routes/**/*.js", {}, function(err, files) {
    files.map((file) => {
        const route = require(file);
        app[route.method](route.name, async(req, res) => await route.run(req, res, session, db))
    });
});

app.use(useragent.express());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var reqIP;
app.use(async(req, res, next) => {
    if (!db.isReady) {
        return res.send('Still establishing connection to Database.');
    }

    const requestIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const blockedIp = await db.table("banned_ip").find({ ip: requestIp });

    if (requestIp !== reqIP) {
        console.log(requestIp);
        reqIP = requestIp
    }

    if (blockedIp.length > 0) {
        return res.send('Your IP has been blocked! Please contact web admin.');
    }

    req.app.config = config();
    next();
});
setTimeout(() => app.get('*', (req, res) => res.status(404).redirect('/')), 2000);

const start = Date.now();
db.ready(() => {
    const end = ((Date.now() - start) / 1000)
    console.log(`Database Ready on ${end}s`)
});

server.listen(config().APP_PORT, () => console.log(`Connected on Port ${config().APP_PORT}`));