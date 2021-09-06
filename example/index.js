console.log("Script imported.")
console.log(__filename)

module.exports = function(dracarys) {
    console.log("Dracarys available!")
    dracarys.initDefaultEntryPoint()

    dracarys.send("I'm ready to serve you!")

    dracarys.setCommand("ping", (_, reply) => {
        reply("pong")
    })

    let completed = false

    dracarys.setCommand("nyan", (_, reply) => {
        const status = !completed ? "nyaing" : "nyaned"
        console.log({ status })
        reply(status)
    })

    // const nyanProgress = require('nyan-progress');
     
    // const progress = nyanProgress(); // initialize
    // progress.start({ total: 100 }); // start the progress
     
    // const timer = setInterval(() => {
    //   progress.tick();
     
    //   if (progress.isComplete) {
    //     clearInterval(timer);
    //     completed = true
    //   }
    // }, 100);
    
}

module.exports.AUTH_TOKEN = 123456
