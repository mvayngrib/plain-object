const { toPlainObject, fromPlainObject, register } = require('../')

const complex = {
  a: {
    b: Buffer.from('hello'),
    c: [
      1,
      2,
      3,
      Buffer.from('hello'),
      {
        hey: 'ho',
      },
    ],
  },
}

const plain = {
  a: {
    b: 'b:' + Buffer.from('hello').toString('base64'),
    c: [
      1,
      2,
      3,
      'b:' + Buffer.from('hello').toString('base64'),
      {
        hey: 's:ho',
      },
    ],
  },
}

test('serialize', () => {
  expect(toPlainObject(complex)).toEqual(plain)
})

test('parse', () => {
  expect(fromPlainObject(plain)).toEqual(complex)
})

test('custom types', () => {
  class Baby {
    constructor(age) {
      this.age = age
    }
  }

  const complex = {
    baby: new Baby(1),
  }

  register({
    type: 'baby',
    prefix: 'baby:',
    test: (value) => value instanceof Baby,
    encode: (baby) => JSON.stringify({ age: baby.age }),
    decode: (babyStr) => new Baby(JSON.parse(babyStr).age),
  })

  const expectedPlain = {
    baby: 'baby:' + JSON.stringify({ age: complex.baby.age }),
  }

  expect(toPlainObject(complex)).toEqual(expectedPlain)

  const recoveredComplex = fromPlainObject(expectedPlain)
  expect(recoveredComplex.baby instanceof Baby).toEqual(true)
  expect(recoveredComplex.baby.age).toEqual(1)
})
