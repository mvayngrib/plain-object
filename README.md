
## Usage

### Basic Usage

built-in types: `Buffer`, `Uint8Array`

```js
const { fromPlainObject, toPlainObject } = require('plain-object')

const original = {
  someBuffer: Buffer.from('goodbye'),
  some: {
    nestedBuffer: Buffer.from('cruel world')
  }
}

const plain = toPlainObject(original)
// recover original:
const recovered = fromPlainObject(plain)

```

### Advanced Usage

add your own types

```js
const { fromPlainObject, toPlainObject, register } = require('plain-object')

class Baby {
  constructor(age) {
    this.age = age
  }
}

const original = {
  baby: new Baby(1),
}

register({
  type: 'baby',
  prefix: 'baby:',
  test: (value) => value instanceof Baby,
  encode: (baby) => JSON.stringify({ age: baby.age }),
  decode: (babyStr) => new Baby(JSON.parse(babyStr).age),
})

const plain = toPlainObject(original)
// recover original:
const recovered = fromPlainObject(plain)
```
