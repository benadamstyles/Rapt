// @flow

type MapIf<V, R> = ((true, (V) => R) => Rapt<R>) &
  ((false, (V) => R) => Rapt<V>)

class Rapt<V> {
  _output: () => V

  mapIf: MapIf<V, *>

  constructor(fn: () => V) {
    this._output = fn
  }

  map<R>(fn: V => R): Rapt<R> {
    return new Rapt(() => fn(this._output()))
  }

  tap(fn: V => any): Rapt<V> {
    return new Rapt(() => {
      const val = this._output()
      fn(val)
      return val
    })
  }

  forEach(fn: V => any): void {
    fn(this.val())
  }

  val(): V {
    return this._output()
  }

  value(): V {
    return this.val()
  }
}

Rapt.prototype.mapIf = function mapIf(bool, fn) {
  return bool ? this.map(fn) : this
}

export const isRapt = (val: *) => val instanceof Rapt

export default <V: *>(val: V): Rapt<V> => new Rapt(() => val)
