__basedir = __dirname;
const config = require('./config');
require('./app/bot/index')

const http = require('http');
const express = require('express');

const bodyParser = require('body-parser');
const useragent = require('express-useragent');
const expressRateLimit = require("express-rate-limit");

const Sessions = require('./app/classes/sessions');
const Ratelimit = require('./app/classes/ratelimit');

const mysqlWrapper = require('node-mysql-wrapper');
const glob = require("glob");

const app = express();
const server = http.createServer(app);
const db = mysqlWrapper.wrap(config().MYSQL.connect);
const session = new Sessions;
const ratelimit = new Ratelimit;

glob(__dirname + "/app/routes/**/*.js", {}, function(err, files) {
    files.map((file) => {
        const route = require(file);
        app[route.method](route.name, async(req, res) => await route.run(req, res, session, db, ratelimit))
    });
});

app.use('*', async(req, res, next) => {
    if (config().SITE_MAINTENANCE) {
        return res.send('403 | Site is Under Maintenance.')
    }

    next();
})

app.set('trust proxy', 1);
app.use(useragent.express());

app.use(express.static('public/home'));
app.use('/member', express.static('public/member'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/", expressRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
}));

app.use(async(req, res, next) => {
    if (!db.isReady) {
        return res.send('Still establishing connection to Database.');
    }

    const requestIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const blockedIp = await db.table("banned_ip").find({ ip: requestIp });
    console.log(`[${new Date().toLocaleString()}] ${requestIp} | New Request on: ${req.path}`);

    if (blockedIp.length > 0) {
        return res.send('Your IP has been blocked! Please contact web admin.');
    }

    req.app.config = config();
    next();
});

const start = Date.now();
db.ready(() => {
    const end = ((Date.now() - start) / 1000)
    console.log(`Database Ready on ${end}s`)
});

server.listen(config().APP_PORT, () => console.log(`Connected on Port ${config().APP_PORT}`));