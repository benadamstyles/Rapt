// @flow

import {Map as ImmutableMap} from 'immutable'
// eslint-disable-next-line import/no-named-as-default
import rapt, {isRapt} from './rapt'

describe('isRapt', () => {
  it('returns true for a Rapt instance', () => {
    expect(isRapt(rapt({}))).toBe(true)
  })

  it('returns false for anything else', () => {
    expect(isRapt(1)).toBe(false)
    expect(isRapt('')).toBe(false)
    expect(isRapt(null)).toBe(false)
    expect(isRapt({})).toBe(false)
    expect(isRapt()).toBe(false)
    expect(isRapt(rapt({}).val())).toBe(false)
  })
})

describe('Rapt methods', () => {
  describe('map', () => {
    it('transforms the value as expected', () => {
      expect(
        rapt(10)
          .map(String)
          .map(s => `${s}+`)
          .val()
      ).toBe('10+')
      expect(
        rapt({a: 1})
          .map(x => {
            // $FlowExpectError
            x.b = 2 // eslint-disable-line fp/no-mutation
            return x
          })
          .map(x => x)
          .val()
      ).toEqual({a: 1, b: 2})
    })

    it('can be forked', () => {
      const r = rapt(ImmutableMap({})).map(x => x.set('a', 1))
      expect(
        r
          .map(x => x.set('a', 2))
          .map(x => x.set('b', 2))
          .map(x => x.get('a'))
          .val()
      ).toBe(2)
      const forked = r.map(x => x.get('a'))
      expect(forked.val()).toBe(1)
      expect(r.val().toJS()).toEqual({a: 1})
      expect(r.val().get('b')).not.toBeDefined()
    })
  })

  describe('flatMap', () => {
    it('unwraps a Rapt when one is returned by the user', () => {
      expect(
        isRapt(
          rapt(5)
            .map(rapt)
            .val()
        )
      ).toBe(true)
      expect(
        rapt(5)
          .flatMap(rapt)
          .val()
      ).toBe(5)
    })

    it('returns the value if used on a func that doesn’t return a Rapt', () => {
      // $FlowExpectError
      expect(rapt(5).flatMap(x => x)).toBe(5)
    })
  })

  describe('flatten', () => {
    it('has no effect when the wrapped value is not a Rapt', () => {
      expect(
        rapt(5)
          .flatten()
          // $FlowFixMe
          .val()
      ).toBe(5)
    })
    it('flattens a nested Rapt', () => {
      expect(
        rapt(5)
          .map(rapt)
          .flatten()
          .val()
      ).toBe(5)
    })
  })

  describe('tap', () => {
    it('is called with the expected value', () => {
      const tapper = jest.fn(x => `${x}+`)
      const r = rapt(5)
        .map(String)
        .tap(tapper)
      expect(r.val()).toBe('5')
      expect(tapper).toHaveBeenCalledWith('5')
    })
  })

  describe('forEach', () => {
    it('returns undefined', () => {
      expect(rapt({}).forEach(x => x)).not.toBeDefined()
    })

    it('is called with the expected value', () => {
      const cb = jest.fn()
      const obj = {}
      rapt(obj)
        .map(x => {
          // eslint-disable-next-line fp/no-mutation
          x.a = 1
          return x
        })
        .forEach(cb)
      expect(cb).toHaveBeenCalledWith(obj)
    })
  })
})
