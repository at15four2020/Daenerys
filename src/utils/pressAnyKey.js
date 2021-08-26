function pressAnyKey() {
    // https://stackoverflow.com/a/19692588/4718937
    console.log('Press any key to exit.')

    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.on('data', process.exit.bind(process, 0))
}

module.exports = pressAnyKey
