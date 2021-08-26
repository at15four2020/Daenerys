console.log("Script imported.")
console.log(__filename)

module.exports = function(Dracarys) {
    console.log("Dracarys available!")

    Dracarys.discord.commands.on("ping", reply => {
        reply("pong")
    })
}

module.exports.AUTH_TOKEN = 123456
