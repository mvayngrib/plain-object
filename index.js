const { cloneDeepWith } = require('lodash')

const ENCODING = 'base64'

let converters = []

const isRegistered = (type) => converters.find((c) => c.type === type)

const register = ({ type, prefix, test, encode, decode }) => {
  if (isRegistered(type)) throw new Error(`type "${type}" is already registeered`)

  converters.push({ type, prefix, test, encode, decode })
}

const unregister = (type) => {
  converters = converters.filter((c) => c.type !== type)
}

const encodeCustomizer = (value) => {
  for (const converter of converters) {
    if (converter.test(value)) {
      const encoded = converter.encode(value)
      if (typeof encoded !== 'string') {
        throw new Error(`converter "${converter.type}" encode function must return a string`)
      }

      return `${converter.prefix}${encoded}`
    }
  }
}

const decodeCustomizer = (value) => {
  if (typeof value === 'string') {
    for (const converter of converters) {
      if (value.startsWith(converter.prefix)) {
        return converter.decode(value.slice(converter.prefix.length))
      }
    }
  }
}

const toPlainObject = (obj) => cloneDeepWith(obj, encodeCustomizer)

const fromPlainObject = (obj) => cloneDeepWith(obj, decodeCustomizer)

// defaults
register({
  type: 'buffer',
  test: (value) => Buffer.isBuffer(value) || value instanceof Uint8Array,
  // normalize to Buffer, in case it's a raw Uint8Array (like libsodium likes)
  encode: (value) => Buffer.from(value).toString(ENCODING),
  decode: (value) => Buffer.from(value, ENCODING),
  prefix: 'b:',
})

register({
  type: 'string',
  test: (value) => typeof value === 'string',
  encode: (value) => value,
  decode: (value) => value,
  prefix: 's:',
})

module.exports = {
  register,
  unregister,
  isRegistered,
  toPlainObject,
  fromPlainObject,
}
