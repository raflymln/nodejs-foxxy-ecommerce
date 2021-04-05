const Eris = require("eris");

const bot = new Eris.CommandClient("NzkyMjQwMTM2ODYyNTY0MzYy.X-a1Hw.tWwuQVEK9jmNBZ3Bk4NMFMZTxCE", {}, {
    description: "A test bot made with Eris",
    owner: "somebody",
    prefix: "fox"
});

bot.on("ready", () => { // When the bot is ready
    console.log("Ready!"); // Log "Ready!"
});

bot.registerCommand("blockip", (msg, args) => { // Make an echo command
    if (args.length === 0) return;

    for (const ip of args) {
        const blockip = execute(`iptables -A INPUT -s ${ip} -j DROP`);
        if (blockip) {
            return `BLOCKED IP: ${ip}`
        }

        return `Failed to block ${ip}`
    }
}, {
    aliases: ['bip'],
    requirements: {
        userIDs: ['231721153444446208', '499021389572079620']
    }
});

const execute = (bash) => {
    const { exec } = require("child_process");

    try {
        console.log('============ BEGIN CHILD PROCCESS ============');
        exec(bash, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }

            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }

            console.log(`stdout: ${stdout}`);
            console.log('============ END CHILD PROCCESS ============')
        });

        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}

module.exports = bot.connect();