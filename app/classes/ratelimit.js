module.exports = class Ratelimit {
    constructor() {
        this.data = new Object;
    }

    add = (req, length = (30 * 60)) => {
        const expired = Date.now() + (length * 1000);
        const key = this.util.getKey(req);

        if (this.data[this.util.getKey(req)]) {
            throw new Error('Already Have a Ratelimit Data on: ' + key)
        }

        this.data[key] = { length, expired };
        return true;
    }

    get = (req) => {
        const timeout = this.data[this.util.getKey(req)];

        if (timeout && (Date.now() < timeout.expired)) {
            return false;
        } else {
            delete this.delete(req);
            return true;
        }
    }

    alert = (req, message = 'Doing This') => {
        const timeout = this.data[this.util.getKey(req)];
        const waitTime = this.util.millisToMinutesAndSeconds(timeout.length - (Date.now() - timeout.expired));

        return `Please Wait ${waitTime} Before ${message} Again!`;
    }

    delete = (req) => {
        return delete this.data[this.util.getKey(req)];
    }

    util = {
        getKey(req) {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            return ip + req.path;
        },
        millisToMinutesAndSeconds(millis) {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        }
    }
}