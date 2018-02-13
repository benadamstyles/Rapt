// @flow

import {Map as ImmutableMap} from 'immutable'
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
            x.b = 2
            return x
          })
          .map(x => x)
          .val()
      ).toEqual({a: 1, b: 2})
    })

    it('is lazy', () => {
      const mapper = jest.fn(x => Object.assign(x, {a: 1}))
      const r = rapt({}).map(mapper)
      expect(mapper).not.toHaveBeenCalled()
      expect(r.val()).toEqual({a: 1})
      expect(mapper).toHaveBeenCalled()
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

  describe('tap', () => {
    it('is called with the expected value', () => {
      const tapper = jest.fn(x => `${x}+`)
      const r = rapt(5)
        .map(String)
        .tap(tapper)
      expect(tapper).not.toHaveBeenCalled()
      expect(r.val()).toBe('5')
      expect(tapper).toHaveBeenCalledWith('5')
    })
  })
})
