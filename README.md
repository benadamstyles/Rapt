# Rapt

Rapt is a small package that wraps any value, allowing you to map over it. A bit like [Lodash](https://lodash.com/)’s [chain](https://lodash.com/docs/4.17.5#chain), or [Gulp](https://gulpjs.com/)’s [pipe](https://github.com/gulpjs/gulp/blob/v3.9.1/docs/API.md), but for values rather than collections or streams.

Rapt does not exist to reduce the number of characters in your code, nor to make your code run faster. For many, it will not even be the clearest way to write your code. But if, like me, you find it easier to read and understand lists of functions than a variety of variable assignments, operators and returns, then Rapt might help you like the code you write a little more.

It lends itself to a highly functional style of JS programming, allowing you to work with and transform values without having to assign them to variables.

Rapt is particularly useful when you want to avoid unnecessarily executing expensive operations, but you don’t want to give up your functional style.

## Examples

```js
// without Rapt
const countItems = (
  userWantsFilteredItems,
  hugeArrayOfItems,
  hugeArrayOfItemsAlreadyFilteredElsewhere
) => {
  let count = userWantsFilteredItems
    ? hugeArrayOfItemsAlreadyFilteredElsewhere.length
    : hugeArrayOfItems.length
  console.log(count)
  return count
}

// with Rapt
const countItems = (
  userWantsFilteredItems,
  hugeArrayOfItems,
  hugeArrayOfItemsAlreadyFilteredElsewhere
) =>
  rapt(hugeArrayOfItems)
    .mapIf(
      userWantsFilteredItems,
      () => hugeArrayOfItemsAlreadyFilteredElsewhere
    )
    .map(items => items.length)
    .tap(count => console.log(`We have ${count} items`))
    .val()
```
