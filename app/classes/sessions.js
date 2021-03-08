module.exports = class Session {
    constructor() {
        this.data = new Object;

        setInterval(() => this.utils.handleInactiveSession(), 30000);
    }

    get all() {
        return this.data;
    }

    get = (req) => {
        const ip = this.utils.getIP(req);

        if (!this.data[ip]) {
            return false;
        }

        return this.data[ip];
    }

    add = (req, data, expired) => {
        const ip = this.utils.getIP(req);

        if (this.data[ip]) {
            throw new Error(`Already have existing session record for IP: ${ip}`);
        }

        return this.data[ip] = Object.assign({
            _session: {
                created: Date.now(),
                expired: Date.now() + (expired || (1000 * 60 * 60 * 24))
            }
        }, data);
    }

    set = (req, key, value) => {
        if (key == '_session') {
            throw new Error('Session data can\'t be modified!');
        }

        const ip = this.utils.getIP(req);

        if (!this.data[ip]) {
            return this.add(req, { key: value })
        }

        return this.data[ip][key] = value;
    }

    delete = (req, key = false) => {
        const ip = this.utils.getIP(req);

        if (!this.data[ip]) {
            return false;
        }

        if (key) {
            return (this.data[ip][key]) ? delete this.data[ip][key] : false;
        } else {
            return delete this.data[ip];
        }
    }

    utils = {
        getIP: (req) => {
            if (typeof req == 'string') {
                return req;
            }
            return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        },
        handleInactiveSession: () => {
            Object.keys(this.data).map((ip) => {
                if (this.data[ip]._session.expired == Date.now()) {
                    delete this.data[ip]
                }
            });

            return true;
        }
    }
}