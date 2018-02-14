// @flow

const rapt = require('../lib/rapt').default

const iter = 1000000

const fgCyan = '\x1b[36m'
const reset = '\x1b[0m'

const sampleRapt = rapt('')
const label = `${fgCyan}${
  sampleRapt._operations
    ? 'Lazy array'
    : sampleRapt._output ? 'Lazy closures' : 'Eager'
}${reset}`

console.time(label)
for (let i = 0; i < iter; i++) {
  rapt([1, 2, 3])
    .map(x => x.concat([4]))
    .map(x => x.reverse())
    .map(x => x.join(' '))
    .val()
}
console.timeEnd(label)
