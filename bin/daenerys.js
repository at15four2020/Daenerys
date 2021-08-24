#!/usr/bin/env node

const spawn = require("child_process").spawn
const platform = require("os").platform()

const cmd = ({
    "linux": `${__dirname}/Daenerys-linux`,
    "darwin": `${__dirname}/Daenerys-macos`,
    "win32": `${__dirname}\\Daenerys-win.exe`,
})[platform]

if (!cmd) throw new Error("Unkown OS platform: "+platform)

spawn(cmd, process.argv.slice(2), { stdio: "inherit" }).on("exit", code => process.exit(code))
