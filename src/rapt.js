// @flow

type MapIf<V, R> = ((true, (V) => R) => Rapt<R>) &
  ((false, (V) => R) => Rapt<V>)

class Rapt<V> {
  _operations: Array<(*) => *>
  _sideEffects: Array<boolean>
  _value: *

  mapIf: MapIf<V, *>

  constructor(val: V) {
    this._operations = []
    this._sideEffects = []
    this._value = val
  }

  _setOperations(
    existingOps: Array<(*) => *>,
    existingSideEffects: Array<boolean>,
    op: (*) => *,
    sideEffect: boolean = false
  ) {
    this._operations.push(...existingOps, op)
    this._sideEffects.push(...existingSideEffects, sideEffect)
  }

  map<R>(fn: V => R): Rapt<R> {
    const next = new Rapt(this._value)
    next._setOperations(this._operations, this._sideEffects, fn)
    return next
  }

  tap(fn: V => any): Rapt<V> {
    const next = new Rapt(this._value)
    next._setOperations(this._operations, this._sideEffects, fn, true)
    return next
  }

  forEach(fn: V => any): void {
    fn(this.val())
  }

  val(): V {
    return this._operations.reduce((output, fn, i) => {
      const result = fn(output)
      return this._sideEffects[i] ? output : result
    }, this._value)
  }

  value(): V {
    return this.val()
  }
}

Rapt.prototype.mapIf = function mapIf(bool, fn) {
  return bool ? this.map(fn) : this
}

export const isRapt = (val: *) => val instanceof Rapt

export default <V: *>(val: V): Rapt<V> => new Rapt(val)
