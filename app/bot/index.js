const Eris = require("eris");
const bot = new Eris.CommandClient("NzkyMjQwMTM2ODYyNTY0MzYy.X-a1Hw.tWwuQVEK9jmNBZ3Bk4NMFMZTxCE", {}, {
    prefix: ['fox', 'f!'],
    defaultCommandOptions: {
        requirements: {
            userIDs: ['231721153444446208', '499021389572079620']
        }
    }
});

bot.registerCommand("blockip", async(msg, args) => {
    if (args.length === 0) return;

    for (const ip of args) {
        const blockip = await execute(`iptables -A INPUT -s ${ip} -j DROP`);

        msg.channel.createMessage({
            embed: {
                description: (!!blockip) ? `Blocked IP: ${ip}` : `Failed to Block IP: ${ip}`,
                color: 16498468
            }
        });
    }
}, {
    argsRequired: true,
    aliases: ['bip', 'banip'],
});

bot.registerCommand("unblockip", async(msg, args) => {
    if (args.length === 0) return;

    for (const ip of args) {
        const unblockip = await execute(`iptables -D INPUT -s ${ip} -j DROP`);

        msg.channel.createMessage({
            embed: {
                description: (!!unblockip) ? `Unblocked IP: ${ip}` : `Failed to Unblock IP: ${ip}`,
                color: 16498468
            }
        });
    }
}, {
    argsRequired: true,
    aliases: ['unbip', 'unbanip'],
});

bot.registerCommand("showblockedip", async(msg, args) => {
    const iptables = await execute(`iptables -L INPUT -v -n`);

    msg.channel.createMessage({
        embed: {
            description: "```" + iptables + "```",
            color: 16498468
        }
    });
}, {
    aliases: ['sbip'],
});

const execute = async(bash) => {
    const { exec } = require("child_process");

    try {
        const { stdout, stderr } = await exec(bash);
        return { stdout, stderr };
    } catch (error) {
        console.log(error);
        return false;
    }
}

bot.on("ready", () => console.log("Ready!"));
module.exports = bot.connect();