// @flow

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

  flatten(): V {
    if (isRapt(this._value)) {
      return this._value
    } else {
      // $FlowFixMe
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

Rapt.prototype.mapIf = function mapIf(bool, fn) {
  return bool ? this.map(fn) : this
}

export const isRapt = (val: *): boolean %checks => val instanceof Rapt
export const rapt = <V: *>(val: V): Rapt<V> => new Rapt(val)
export default rapt
