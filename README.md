# Rapt

[![Build Status](https://travis-ci.org/Leeds-eBooks/rapt.svg?branch=master)](https://travis-ci.org/Leeds-eBooks/rapt)
[![Greenkeeper badge](https://badges.greenkeeper.io/Leeds-eBooks/rapt.svg)](https://greenkeeper.io/)

Rapt is a small package that wraps any value, allowing you to map over it. A bit like [Lodash](https://lodash.com/)’s [chain](https://lodash.com/docs/4.17.5#chain), or [Gulp](https://gulpjs.com/)’s [pipe](https://github.com/gulpjs/gulp/blob/v3.9.1/docs/API.md), but for values rather than collections or streams.

Rapt does not exist to reduce the number of characters in your code, nor to make your code run faster. For many, it will not even be the clearest way to write your code. But if, like me, you find it easier to read and understand a list of functions than a variety of assignments, operators and returns, then Rapt might help you enjoy the code you write a little more.

It lends itself to a highly functional style of JS programming, allowing you to work with and transform values without having to assign them to variables. It works best with immutable values (numbers, strings, [immutable collections](https://facebook.github.io/immutable-js/)). It is particularly well suited to the latter, and is very satisfying if you hate using `let` just so you can reassign an immutable value after modifying it, i.e. `let x = Map(); x = x.set('a', 1)`.

> It can be used with plain mutable objects and arrays but it may be counter-productive in terms of clarity, as the functions you pass to `Rapt#map()` will no longer be side-effect-free.

Rapt is particularly useful when you want to avoid unnecessarily executing expensive operations, but you don’t want to give up your functional style.

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
  console.log(count)
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

Rapt is written using [Flow](), and works well with it – with the caveat that currently, due to [an issue with how Flow handles booleans](https://github.com/facebook/flow/issues/4196), the type of the first argument to `Rapt#mapIf()` must be `true | false` rather than `boolean` (no, they’re currently [not the same thing](https://github.com/facebook/flow/issues/4196)!).

## API

### `map(Function)`

```js
rapt('hello')
  .map(s => `${s} world`)
  .val() // returns 'hello world'
```

### `mapIf(true | false, Function)`

```js
rapt('hello')
  .mapIf(true, s => `${s} world`)
  .val() // returns 'hello world'

rapt('hello')
  .mapIf(false, s => `${s} world`)
  .val() // returns 'hello'
```

### `tap(Function)`

```js
rapt('hello')
  .tap(s => console.log(s)) // logs 'hello'
  .map(s => `${s} world`)
  .val() // returns 'hello world'

rapt('hello')
  .tap(s => `${s} world`)
  .val() // returns 'hello'
```

### `forEach(Function)`

```js
rapt('hello')
  .map(s => `${s} world`)
  .forEach(s => console.log(s)) // logs 'hello world'

rapt('hello').forEach(s => `${s} world`) // returns undefined
```

### `val()` or `value()`

```js
rapt('hello').map(s => `${s} world`) // returns an instance of Rapt

rapt('hello')
  .map(s => `${s} world`)
  .val() // returns 'hello world'

rapt('hello')
  .map(s => `${s} world`)
  .value() // returns 'hello world'
```
