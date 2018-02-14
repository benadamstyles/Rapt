// @flow

const {maybe} = require('maybes')
const {rapt} = require('../lib/rapt')

const iter = Math.pow(10, 7)

const fgCyan = '\x1b[36m'
const reset = '\x1b[0m'

const sampleRapt = rapt('')
const label = `${fgCyan}${
  // $FlowExpectError
  maybe(sampleRapt._operations)
    .map(() => 'Lazy array')
    .orJust(
      // $FlowExpectError
      maybe(sampleRapt._output)
        .map(() => 'Lazy closures')
        .orJust('Eager')
    )
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
