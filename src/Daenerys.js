const path = require('path')

if (typeof process.argv[2] !== 'string') {
    throw new Error("No entry point.")
}

const entryPointPath = path.join(process.cwd(), process.argv[2])

let entryPoint
try {
    entryPoint = require(entryPointPath)
} catch(e) {
    switch(e.code) {
        case 'MODULE_NOT_FOUND':
            throw new Error(`Entry point "${entryPointPath}" does not exist.`)
        default:
            throw e
    }
}

const { AUTH_TOKEN } = entryPoint

console.log("Using AUTH_TOKEN:", entryPoint.AUTH_TOKEN)

if (typeof entryPoint !== 'function') {
    throw new Error("Entry point must export a function.")
}

const available = require('./services/useAuthToken')(AUTH_TOKEN)

if (available.error) {
    switch (available.error.code) {
        case 'NOT_FOUND':
            throw new Error("Invalid token.")
        case 'NOT_ENOUGHT_MONEY':
            throw new Error("You don't have enough money in your wallet to use Dracarys. "+available.error.message)
        default:
            throw new Error("A problem with our services internally. This should rarely happen: "+available.error)
    }
}

console.log(`${available.transactionCost} pennies was taken from your wallet, you now have ${available.wallet.current}.`)

const Dracarys = require('./Dracarys/src/index')

entryPoint(Dracarys)
