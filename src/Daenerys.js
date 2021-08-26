const inquirer = require('inquirer')
const path = require('path')

const pressAnyKey = require('./utils/pressAnyKey')

async function start() {
    let entryPointArg = process.argv[2], entryPoint
    if (typeof entryPointArg !== 'string') {
        console.log('No entry point for custom logic was used.')
        const { set_now } = await inquirer.prompt({
            type: 'confirm',
            name: 'set_now',
            message: 'Do you want to insert one now?',
            default: true,
        })

        if (!set_now) {
            let { proceed } = await inquirer.prompt({
                type: 'confirm',
                name: 'proceed',
                message: 'Do you to proceed anyway?',
                default: false,
            })
    
            if (!proceed) return

            entryPoint = await inquirer.prompt({
                type: 'input',
                name: 'AUTH_TOKEN',
                message: 'What is your authentication token?',
                validate: input => !!input.length,
            })
        } else {
            const { entry_point_arg } = await inquirer.prompt({
                type: 'input',
                name: 'entry_point_arg',
                message: 'What file/folder you want to use as entry point?',
                validate: input => !!input.length,
            })

            entryPointArg = entry_point_arg
        }
    }

    if (typeof entryPointArg === 'string') {
        const entryPointPath = path.isAbsolute(entryPointArg) ? entryPointArg : path.join(process.cwd(), entryPointArg)

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
    }

    const { AUTH_TOKEN } = entryPoint

    console.log("Using AUTH_TOKEN:", AUTH_TOKEN)

    if (typeof entryPointArg === 'string' && typeof entryPoint !== 'function') {
        throw new Error("Entry point must export a function.")
    }

    const dracarysCost = require('./services/getCost')()

    const { proceed } = await inquirer
        .prompt([{
            type: 'confirm',
            name: 'proceed',
            message: `${dracarysCost} pennies will be charged, do you want to proceed?`,
            default: true,
        }])

    if (!proceed) {
        const { helpNeeded } = await inquirer
            .prompt([{
                type: 'confirm',
                name: 'helpNeeded',
                message: 'Do you need help?',
                default: false,
            }])

        if (helpNeeded) {
            console.log(`Go to Bay of Dragons on the southern coast of Essos (https://discord.gg/...) and get support there.`)

            pressAnyKey()
        }

        return
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

    console.log(`${available.transactionCost} pennies was taken from your wallet, now you have ${available.wallet.current}.`)

    const Dracarys = require('./Dracarys/src/index')

    Dracarys.on('ready', () => {
        console.log('All ready!')
        console.log('Now you can use the power of Dracarys tool and also a servant at your disposal.')

        if (typeof entryPoint === 'function') {
            entryPoint(Dracarys)
        } else {
            console.log('But as you didn\'t use a entry point for custom logic, the servant only recognizes the !add_sso command.')
        }
    })
}

start().catch(e => {
    console.log(e.message || e)

    pressAnyKey()
})
