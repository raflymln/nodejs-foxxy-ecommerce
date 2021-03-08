const fs = require('fs');

module.exports = function() {
    var config;

    try {
        const cfg = fs.readFileSync(`config.json`, "utf8");
        config = JSON.parse(cfg);
    } catch (error) {
        console.log(error)
        throw new Error('Error Reading App Configuration [config.json]')
    }

    return Object.assign({
        MYSQL: {
            connect: `mysql://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST}/${config.DB_NAME}?debug=false&charset=utf8`
        }
    }, config);
}