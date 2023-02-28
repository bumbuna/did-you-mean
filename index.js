const brainjs = require('brain.js')
const fs = require('fs')
const process = require('process')
const readline = require('readline')
const events = require('events')

const trainDataset = []

async function createDataSet() {
    const rl = readline.createInterface({
        input: fs.createReadStream('aspell.txt'),
        crlfDelay: Infinity
    });
    rl.on('line', line => {
        const [input, output] = line.split(':')
        output.split().forEach(word =>
            trainDataset.push({
                input,
                output: word
            }))
    })
    await events.once(rl, 'close');
}

(async () => {
    await createDataSet()
    console.log(JSON.stringify(trainDataset))
    const net = new brainjs.recurrent.LSTM()
    net.train(trainDataset)
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    rl.on('line', line => {
        console.log('did you mean: %s', net.run(line))
    })

    await events.once(rl, 'close')
})()

