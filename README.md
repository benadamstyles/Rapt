![Rapt logo](https://leeds-ebooks.co.uk/images/oss/min/rapt-100.png)

[![npm version](https://badge.fury.io/js/rapt.svg)](https://www.npmjs.com/package/rapt)
[![Build Status](https://travis-ci.org/Leeds-eBooks/rapt.svg?branch=master)](https://travis-ci.org/Leeds-eBooks/rapt)
[![Greenkeeper badge](https://badges.greenkeeper.io/Leeds-eBooks/rapt.svg)](https://greenkeeper.io/)

Rapt is a small package that wraps any value, allowing you to map over it. A bit like [Lodash](https://lodash.com/)’s [chain](https://lodash.com/docs/4.17.5#chain), or [Gulp](https://gulpjs.com/)’s [pipe](https://github.com/gulpjs/gulp/blob/v3.9.1/docs/API.md), but for values rather than collections or streams.

Rapt does not exist to reduce the number of characters in your code, nor to make your code run faster. For many, it will not even be the clearest way to write your code. But if, like me, you find it easier to read and understand a list of functions than a variety of assignments, operators and returns, then Rapt might help you enjoy the code you write a little more.

It lends itself to a highly functional style of JS programming, allowing you to work with and transform values without having to assign them to variables. It works best with immutable values (numbers, strings, [immutable collections](https://facebook.github.io/immutable-js/)). It is particularly well suited to the latter, and is very satisfying if you hate using `let` just so you can reassign an immutable value after modifying it, i.e. `let x = Map(); x = x.set('a', 1)`.

> It can be used with plain mutable objects and arrays but it may be counter-productive in terms of clarity, as the functions you pass to `Rapt#map()` will no longer be side-effect-free.

Rapt is particularly useful when you want to avoid unnecessarily executing expensive operations, but you don’t want to give up your functional style.

## Installation

Rapt is [available on npm](https://www.npmjs.com/package/rapt).

```sh
npm install --save rapt
```

```sh
yarn add rapt
```

## Usage

### CommonJS

```js
const {rapt} = require('rapt')
// or
const rapt = require('rapt').default
```

### ES Modules

```js
import rapt from 'rapt'
```

## Examples

```js
import {Map} from 'immutable'

// without Rapt
const processUser = user => {
  log(user)
  let userMap = Map(user)
  if (emailHasBeenVerified) {
    userMap = userMap.set('verified', true)
  }
  syncWithServer(userMap)
  return userMap
}

// with Rapt
const processUser = user =>
  rapt(user)
    .tap(log)
    .map(Map)
    .mapIf(emailHasBeenVerified, u => u.set('verified', true))
    .tap(syncWithServer)
    .val()
```

```js
import _ from 'lodash'

// without Rapt
const countItems = (shouldFilter, hugeArrayOfItems) => {
  let arr = _.compact(hugeArrayOfItems)
  if (shouldFilter) {
    arr = arr.filter(expensiveFilterFunction)
  }
  const count = arr.length
  console.log(`We have ${count} items`)
  return count
}

// with Rapt
const countItems = (shouldFilter, hugeArrayOfItems) =>
  rapt(hugeArrayOfItems)
    .map(compact)
    .mapIf(shouldFilter, arr => arr.filter(expensiveFilterFunction))
    .map(items => items.length)
    .tap(count => console.log(`We have ${count} items`))
    .val()
```

## Types

Rapt is written using [Flow](https://flow.org/), and works well with it – with the caveat that currently, due to [an issue with how Flow handles booleans](https://github.com/facebook/flow/issues/4196), the type of the first argument to `Rapt#mapIf()` must be `true | false` rather than `boolean` (no, they’re currently [not the same thing](https://github.com/facebook/flow/issues/4196)!).

## Promises / async

Rapt offers first-class support for asynchronous JavaScript with [`.thenMap()`](#thenmapfunction), but it also works well without that method:

```js
// async function, returns a Promise
const fetchUserFromDatabase = userId => database.child('users').child(userId)

// sync function, returns the userObject, mutated
const processUser = userObject => doSomethingToTheUserObject(userObject)

const getUser = userId =>
  rapt(userId)
    .map(fetchUserFromDatabase)
    .thenMap(processUser)
    .val() // returns a promise because we used fetchUserFromDatabase

// Equivalent to:
const getUser = userId =>
  rapt(userId)
    .map(fetchUserFromDatabase)
    .map(userPromise => userPromise.then(processUser))
    .val() // returns a promise because we used fetchUserFromDatabase

await getUser('user001')
```

## API

### `.map(Function)`

Transform your wrapped value by mapping over it.

```js
rapt('hello')
  .map(s => `${s} world`)
  .val() // returns 'hello world'
```

### `.mapIf(true | false, Function)`

Transform your wrapped value by mapping over it, if another value is truthy. Otherwise, do nothing and pass on the value for further chaining.

```js
rapt('hello')
  .mapIf(true, s => `${s} world`)
  .val() // returns 'hello world'

rapt('hello')
  .mapIf(false, s => `${s} world`)
  .val() // returns 'hello'
```

### `.flatMap(Function)`

Like `.map()`, but you should return a `Rapt` in your function (equivalent to `.map().flatten()`).

```js
rapt('hello')
  .flatMap(s => rapt(`${s} world`).map(s => `${s}!`))
  .map(s => s.toUpperCase())
  .val() // returns 'HELLO WORLD!'
```

### `.thenMap(Function)`

Like `.map()`, but best used in a `rapt` chain that wraps a `Promise`. It calls `Promise.resolve()` on your wrapped value however, so it will also work on immediate values.

```js
const asyncHello = () => new Promise(resolve => resolve('hello'))

rapt(asyncHello())
  .thenMap(s => `${s} world`)
  .thenMap(s => s.toUpperCase())
  .val() // returns a Promise of 'HELLO WORLD!'
  .then(str => console.log(str)) // logs 'HELLO WORLD!'

rapt('hello')
  .thenMap(s => `${s} world`)
  .thenMap(s => s.toUpperCase())
  .val() // returns a Promise of 'HELLO WORLD!'
  .then(str => console.log(str)) // logs 'HELLO WORLD!'
```

### `.flatten()`

Unwraps a “nested” `Rapt` (see also [`.flatMap()`](#flatmapfunction)).

```js
rapt('hello')
  .map(s => rapt(`${s} world`).map(s => `${s}!`))
  .flatten()
  .map(s => s.toUpperCase())
  .val() // returns 'HELLO WORLD!'
```

### `.tap(Function)`

Execute a side effect on your wrapped value without breaking the chain.

```js
rapt('hello')
  .tap(s => console.log(s)) // logs 'hello'
  .map(s => `${s} world`)
  .val() // returns 'hello world'

rapt('hello')
  .tap(s => `${s} world`)
  .val() // returns 'hello'

// Careful of side effects when working with a mutable value!
rapt({a: 1})
  .tap(obj => {
    obj.b = 2
  })
  .val() // returns {a: 1, b: 2}
```

### `.forEach(Function)`

Execute a side effect on your wrapped value and end the chain (use if you don’t need to return the wrapped value).

```js
rapt('hello')
  .map(s => `${s} world`)
  .forEach(s => console.log(s)) // logs 'hello world'

rapt('hello').forEach(s => `${s} world`) // returns undefined
```

### `.val()` or `.value()`

Unwrap your value and return it.

```js
rapt('hello').map(s => `${s} world`) // returns an instance of Rapt

rapt('hello')
  .map(s => `${s} world`)
  .val() // returns 'hello world'

rapt('hello')
  .map(s => `${s} world`)
  .value() // returns 'hello world'
```

### `isRapt()`

A predicate function to check if a value is wrapped with `Rapt`.

```js
import {isRapt} from 'rapt'
// or
const {isRapt} = require('rapt')

const a = rapt(3)
  .map(x => x * 2)
  .val()

const b = rapt(3).map(x => x * 2)

isRapt(5) // returns false
isRapt(rapt(5)) // returns true
isRapt(a) // returns false
isRapt(b) // returns true
```
