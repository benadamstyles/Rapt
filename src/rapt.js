// @flow

type MapIf<V, R> = ((true, (V) => R) => Rapt<R>) &
  ((false, (V) => R) => Rapt<V>)

class Rapt<V> {
  value: V
  mapIf: MapIf<V, *>

  constructor(val: V) {
    this.value = val
  }

  map<R>(fn: V => R): Rapt<R> {
    return new Rapt(fn(this.value))
  }

  tap(fn: V => void): Rapt<V> {
    fn(this.value)
    return this
  }

  forEach<B>(fn: V => B): void {
    fn(this.value)
  }

  val(): V {
    return this.value
  }

  value(): V {
    return this.value
  }
}

Rapt.prototype.mapIf = function mapIf(bool, fn) {
  return bool ? new Rapt(fn(this.value)) : this
}

export default <V: *>(val: V): Rapt<V> => new Rapt(val)

export const isRapt = (val: mixed) => val instanceof Rapt
