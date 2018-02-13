// @flow

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
  })
})
