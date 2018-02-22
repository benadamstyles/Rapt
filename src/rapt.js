// @flow

type GetPromiseValue = <V>(Promise<V>) => V

type MapIf<V, R> = ((true, (V) => R) => Rapt<R>) &
  ((false, (V) => R) => Rapt<V>)

class Rapt<V> {
  _value: V
  mapIf: MapIf<V, *>

  constructor(val: V) {
    this._value = val
  }

  map<R>(fn: V => R): Rapt<R> {
    return new Rapt(fn(this._value))
  }

  flatMap<R>(fn: V => Rapt<R>): Rapt<R> {
    return fn(this._value)
  }

  thenMap<R>(
    fn: ($Call<GetPromiseValue, $Call<typeof Promise.resolve, V>>) => R
  ): Rapt<Promise<R>> {
    return new Rapt(Promise.resolve(this._value).then(fn))
  }

  flatten(): Rapt<$Call<ResolveRapt, V>> {
    if (isRapt(this._value)) {
      return this._value
    } else {
      return this
    }
  }

  tap(fn: V => any): Rapt<V> {
    fn(this._value)
    return this
  }

  forEach<B>(fn: V => B): void {
    fn(this._value)
  }

  val(): V {
    return this._value
  }

  value(): V {
    return this._value
  }
}

type ResolveRapt = <V>(Rapt<V> | V) => V

// eslint-disable-next-line fp/no-mutation
Rapt.prototype.mapIf = function mapIf(bool, fn) {
  return bool ? this.map(fn) : this
}

export function isRapt(val: *): boolean %checks {
  return val instanceof Rapt
}

export const rapt = <V: *>(val: V): Rapt<V> => new Rapt(val)
export default rapt
