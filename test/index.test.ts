/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { describe, expect, it } from '@jest/globals'
import {
  buildObject,
  nullify,
  parseBoolean,
  parseField,
  parseForm,
  parseNumber,
  parseValue,
  trim
} from '../src'
import {
  createCheckbox,
  createFileInput,
  createForm,
  createHiddenInput,
  createNumberInput,
  createPasswordInput,
  createRadio,
  createSelect,
  createTextarea,
  createTextInput
} from './lib'

// Define constants
const FALSE = 'false'
const TRUE = 'true'
const FLOAT = 9.99
const FLOAT_STRING = '09.99'
const FLOAT_STRING_COMMA = '09,99'
const INTEGER = 100
const INTEGER_STRING = '0100'
const PASSWORD = ' sEcr3t '
const STRING = 'hello'

describe('parseField', () => {
  it('should be importable from package', () => {
    expect(typeof parseField).toEqual('function')
  })
})

describe('parseForm', () => {
  it('should be importable from package', () => {
    expect(typeof parseForm).toEqual('function')
  })
})

describe('buildObject()', () => {
  // Testing with arrays
  it(`buildObject("[]", "${STRING}", null) should return ["${STRING}"]`, () => {
    const r = buildObject('[]', STRING, null)
    expect(r).toEqual([STRING])
  })

  it(`buildObject("[0]", "${STRING}", null) should return ["${STRING}"]`, () => {
    const r = buildObject('[0]', STRING, null)
    expect(r).toEqual([STRING])
  })

  it(`buildObject("[2]", "${STRING}", null) should return [undefined, undefined, "${STRING}"]`, () => {
    const r = buildObject('[2]', STRING, null)
    expect(r).toEqual([undefined, undefined, STRING])
  })

  it(`buildObject("[][]", "${STRING}", null) should return [["${STRING}"]]`, () => {
    const r = buildObject('[][]', STRING, null)
    expect(r).toEqual([[STRING]])
  })

  it(`buildObject("[][0]", "${STRING}", null) should return [["${STRING}"]]`, () => {
    const r = buildObject('[][0]', STRING, null)
    expect(r).toEqual([[STRING]])
  })

  it(`buildObject("[][2]", "${STRING}", null) should return [[undefined,undefined,${STRING}]]`, () => {
    const r = buildObject('[][2]', STRING, null)
    expect(r).toEqual([[undefined, undefined, STRING]])
  })

  it(`buildObject("[2][]", "${STRING}", null) should return [undefined,undefined,[${STRING}]]`, () => {
    const r = buildObject('[2][]', STRING, null)
    expect(r).toEqual([undefined, undefined, [STRING]])
  })

  it(`buildObject("[2][2]", "${STRING}", null) should return [undefined,undefined,[undefined,undefined, ${STRING}]]`, () => {
    const r = buildObject('[2][2]', STRING, null)
    expect(r).toEqual([undefined, undefined, [undefined, undefined, STRING]])
  })

  // Removing index

  it('buildObject("a[0]", undefined, {a:[1,2]}) should return {a:[2]}}', () => {
    const r = buildObject('a[0]', undefined, { a: [1, 2] })
    expect(r).toEqual({ a: [2] })
  })

  it('buildObject("a[b]", undefined, {a:{b:1,c:2}}) should return {a:{c:2}}', () => {
    const r = buildObject('a[b]', undefined, { a: { b: 1, c: 2 } })
    expect(r).toEqual({ a: { c: 2 } })
  })

  // Testing with object

  it(`buildObject("[a]", ${INTEGER}, null) should return {a: ${INTEGER}}`, () => {
    const r = buildObject('[a]', INTEGER, null)
    expect(r).toEqual({ a: INTEGER })
  })

  it(`buildObject("[a]", "${STRING}", null) should return {a: "${STRING}"}`, () => {
    const r = buildObject('[a]', STRING, null)
    expect(r).toEqual({ a: STRING })
  })

  // Root field

  it(`buildObject("a[b]", "${STRING}", null) should return {a:{b:"${STRING}"}}`, () => {
    const r = buildObject('a[b]', STRING, null)
    expect(r).toEqual({ a: { b: STRING } })
  })

  it(`buildObject("a[b]", "${STRING}", {}) should return {a:{b:"${STRING}"}}`, () => {
    const r = buildObject('a[b]', STRING, {})
    expect(r).toEqual({ a: { b: STRING } })
  })

  it(`buildObject("a[b]", "${STRING}", {a:{}}) should return {a:{b:"${STRING}"}}`, () => {
    const r = buildObject('a[b]', STRING, { a: {} })
    expect(r).toEqual({ a: { b: STRING } })
  })

  // Single field

  it(`buildObject("a", "${STRING}", null) should return {a:"${STRING}"}`, () => {
    const r = buildObject('a', STRING, null)
    expect(r).toEqual({ a: STRING })
  })

  it(`buildObject("a", "${STRING}", {}) should return {a:"${STRING}"}`, () => {
    const r = buildObject('a', STRING, {})
    expect(r).toEqual({ a: STRING })
  })

  it(`buildObject("a", "${STRING}", {a:null}) should return {a:"${STRING}"}`, () => {
    const r = buildObject('a', STRING, { a: null })
    expect(r).toEqual({ a: STRING })
  })

  // Testing with array and object

  it(`buildObject("[a][]", "${STRING}", null) should return {a:["${STRING}"]}`, () => {
    const r = buildObject('[a][]', STRING, null)
    expect(r).toEqual({ a: [STRING] })
  })

  it(`buildObject("[a][0]", "${STRING}", null) should return {a:["${STRING}"]}`, () => {
    const r = buildObject('[a][0]', STRING, null)
    expect(r).toEqual({ a: [STRING] })
  })

  it(`buildObject("[a][2]", "${STRING}", null) should return {a:[undefined,undefined,"${STRING}"]}`, () => {
    const r = buildObject('[a][2]', STRING, null)
    expect(r).toEqual({ a: [undefined, undefined, STRING] })
  })

  it(`buildObject("[a][][b][][text]", "${STRING}", null) should return {a:[{b:[{text:"${STRING}"]}]}`, () => {
    const r = buildObject('[a][][b][][text]', STRING, null)
    expect(r).toEqual({ a: [{ b: [{ text: STRING }] }] })
  })

  it('buildObject with special characters should parse', () => {
    const r = buildObject('input[temperature1][-max-threshold-value]', 30, null)
    expect(r).toEqual({ input: { temperature1: { '-max-threshold-value': 30 } } })
  })

  it(`buildObject("[a][][b][0][c][2][text]", "${STRING}", null) should return {a:[{b:[{c:[undefined,undefined,{text:"${STRING}"}]}]}]}`, () => {
    const r = buildObject('[a][][b][0][c][2][text]', STRING, null)
    expect(r).toEqual({ a: [{ b: [{ c: [undefined, undefined, { text: STRING }] }] }] })
  })

  const obj = { a: [0, 1, 2] }
  it(`buildObject("[a][]", "${STRING}", ${JSON.stringify(obj)}) should return {a:[0,1,2,"${STRING}"]}`, () => {
    const r = buildObject('[a][]', STRING, obj)
    expect(r).toEqual({ a: [0, 1, 2, STRING] })
  })

  const obj1 = { a: [0, 1, 2] }
  it(`buildObject("[a][1]", "${STRING}", ${JSON.stringify(obj1)}) should return {a:[0,"${STRING}",2]}`, () => {
    const r = buildObject('[a][1]', STRING, obj1)
    expect(r).toEqual({ a: [0, STRING, 2] })
  })

  const obj2 = { a: [0, 1, 2] }
  it(`buildObject("[b][text]", "${STRING}", ${JSON.stringify(obj2)}) should return {a:[0,1,2],b:{text:"${STRING}"}}`, () => {
    const r = buildObject('[b][text]', STRING, obj2)
    expect(r).toEqual({ a: [0, 1, 2], b: { text: STRING } })
  })

  it('should interpret number as object attribute if surrounded by double quotes', () => {
    const context = {}
    const result = { root: { 10: { text: STRING } } }
    const r = buildObject('root["10"][text]', STRING, context)
    expect(r).toEqual(result)
  })

  it('should interpret number as object attribute if surrounded by single quotes', () => {
    const context = {}
    const result = { root: { 10: { text: STRING } } }
    const r = buildObject('root[\'10\'][text]', STRING, context)
    expect(r).toEqual(result)
  })
})

describe('nullify()', () => {
  it('should replace empty string by null', () => {
    expect(nullify(''))
      .toEqual(null)
  })

  it('should replace empty strings by null in array', () => {
    expect(nullify(['', 'b', null]))
      .toEqual([null, 'b', null])
  })

  it('should replace empty strings by null in object', () => {
    expect(nullify({ a: '', b: 'b', c: null }))
      .toEqual({ a: null, b: 'b', c: null })
  })
})

describe('parseBoolean()', () => {
  it('parseBoolean(null) should return null', () => {
    expect(parseBoolean(null)).toEqual(null)
  })

  it('parseBoolean(undefined) should return null', () => {
    expect(parseBoolean(undefined)).toEqual(null)
  })

  it(`parseBoolean("${TRUE}") should return true`, () => {
    expect(parseBoolean(TRUE)).toEqual(true)
  })

  it(`parseBoolean("${FALSE}") should return false`, () => {
    expect(parseBoolean(FALSE)).toEqual(false)
  })

  it('parseBoolean("1") should return true', () => {
    expect(parseBoolean('1')).toEqual(true)
  })

  it('parseBoolean("0") should return false', () => {
    expect(parseBoolean('0')).toEqual(false)
  })

  it('parseBoolean("yes") should return true', () => {
    expect(parseBoolean('yes')).toEqual(true)
  })

  it('parseBoolean("no") should return false', () => {
    expect(parseBoolean('no')).toEqual(false)
  })

  it('parseBoolean("on") should return true', () => {
    expect(parseBoolean('on')).toEqual(true)
  })

  it('parseBoolean("off") should return false', () => {
    expect(parseBoolean('off')).toEqual(false)
  })
})

describe('parseField()', () => {
  describe('using checkbox input', () => {
    describe('with attribute data-type="boolean"', () => {
      describe('with checked = true', () => {
        it('should return true', () => {
          const field = createCheckbox({
            dataset: { type: 'boolean' },
            name: 'boolean_field',
            value: 'true',
            checked: true
          })
          expect(parseField(field)).toEqual(true)
        })
      })

      describe('with checked = false', () => {
        it('should return false', () => {
          const field = createCheckbox({
            dataset: { type: 'boolean' },
            name: 'boolean_field',
            value: 'true'
          })
          expect(parseField(field)).toEqual(false)
        })
      })
    })
  })

  describe('using text input', () => {
    describe('with attribute data-type="number"', () => {
      const field = createTextInput({
        dataset: { type: 'number' },
        name: 'number_field',
        value: '1'
      })

      it('should return a number', () => {
        expect(parseField(field)).toEqual(Number(field.value))
      })
    })
  })

  describe('using select input', () => {
    describe('with attributes multiple="true" and data-type="number"', () => {
      it('should return an array of numbers', () => {
        const options = [
          { value: '123', selected: true },
          { value: '456', selected: true },
          { value: '789', selected: true },
          { value: '000' }
        ]
        const field = createSelect({
          dataset: { type: 'number' },
          multiple: true,
          options
        })
        const expectation = options
          .filter((el) => el.selected)
          .map((el) => Number(el.value))
        expect(parseField(field)).toEqual(expectation)
      })
    })
  })

  describe('with attribute multiple="true"', () => {
    const form = createForm()
    const field1 = createCheckbox({
      name: 'numbers[]',
      value: '1'
    })
    const field2 = createCheckbox({
      name: 'numbers[]',
      value: '2',
      checked: true
    })
    form.appendChild(field1)
    form.appendChild(field2)

    it('should return an array of values', () => {
      expect(parseField(field1)).toEqual(['2'])
    })
  })

  describe('with data-type="string"', () => {
    it('should not parse value', () => {
      const field = createNumberInput({
        dataset: { type: 'string' },
        name: 'number',
        value: INTEGER_STRING
      })
      expect(parseField(field, { parsing: 'auto' })).toBe(INTEGER_STRING)
    })
  })
})

describe('parseForm()', () => {
  it('should not return disabled fields', () => {
    const form = createForm()
    form.appendChild(createTextInput({
      disabled: true,
      name: 'disabled',
      value: STRING
    }))

    const r = parseForm(form)
    expect(r).toEqual({})
  })

  it('should not return values of fields without a name', () => {
    const form = createForm()
    form.appendChild(createTextInput({
      value: STRING
    }))

    const r = parseForm(form)
    expect(r).toEqual({})
  })

  it('should return fields with a name containing dashes', () => {
    const form = createForm()
    form.appendChild(createTextarea({
      name: 'x-custom-field',
      value: STRING
    }))

    const r = parseForm(form)
    expect(r).toEqual({ 'x-custom-field': STRING })
  })

  it('should return fields with a name of one character long', () => {
    const form = createForm()
    form.appendChild(createHiddenInput({
      name: 'x',
      value: STRING
    }))

    const r = parseForm(form)
    expect(r).toEqual({ x: STRING })
  })

  it('should return empty array if no checkbox is checked', () => {
    const form = createForm()
    form.appendChild(createCheckbox({
      name: 'items[]',
      value: 0
    }))
    form.appendChild(createCheckbox({
      name: 'items[]',
      value: 1
    }))

    const r = parseForm(form)
    expect(r).toEqual({ items: [] })
  })

  it('should return values of file fields', () => {
    const form = createForm()
    form.appendChild(createFileInput({
      name: 'file'
    }))

    const r = parseForm(form)
    expect(r).toEqual({ file: null })
  })

  it('should return values of hidden fields', () => {
    const form = createForm()
    form.appendChild(createHiddenInput({
      name: 'hidden',
      value: STRING
    }))

    const r = parseForm(form)
    expect(r).toEqual({ hidden: STRING })
  })

  it('should return values of checked checkboxes', () => {
    const form = createForm()
    const a = createCheckbox({
      checked: true,
      name: 'checkboxes[]',
      value: 'A'
    })
    form.appendChild(a)
    const b = createCheckbox({
      name: 'checkboxes[]',
      value: 'B'
    })
    form.appendChild(b)
    const c = createCheckbox({
      checked: true,
      name: 'checkboxes[]',
      value: 'C'
    })
    form.appendChild(c)

    const r = parseForm(form)
    expect(r).toEqual({
      checkboxes: [
        a.value,
        c.value
      ]
    })
  })

  it('should return values of checked radios', () => {
    const form = createForm()
    const a = createRadio({
      checked: true,
      name: 'radio',
      value: 'A'
    })
    form.appendChild(a)
    const b = createRadio({
      name: 'radio',
      value: 'B'
    })
    form.appendChild(b)
    const c = createRadio({
      name: 'radio2',
      value: 'C'
    })
    form.appendChild(c)
    const d = createRadio({
      checked: true,
      name: 'radio2',
      value: 'D'
    })
    form.appendChild(d)

    const r = parseForm(form)
    expect(r).toEqual({ radio: a.value, radio2: d.value })
  })

  it('should return values of number fields', () => {
    const form = createForm()
    form.appendChild(createNumberInput({
      name: 'number',
      value: INTEGER
    }))

    const r = parseForm(form)
    expect(r).toEqual({ number: INTEGER })
  })

  it('should return values of email fields', () => {
    const form = createForm()
    form.appendChild(createTextInput({
      name: 'email',
      type: 'email',
      value: STRING
    }))

    const r = parseForm(form)
    expect(r).toEqual({ email: STRING })
  })

  it('should return values of password fields', () => {
    const form = createForm()
    form.appendChild(createPasswordInput({
      name: 'password',
      value: PASSWORD
    }))

    const r = parseForm(form)
    expect(r).toEqual({ password: PASSWORD })
  })

  it('should return values of select fields', () => {
    const form = createForm()
    form.appendChild(createSelect({
      name: 'select',
      options: [
        { value: 'A' },
        { value: 'B', selected: true }
      ]
    }))

    const r = parseForm(form)
    expect(r).toEqual({ select: 'B' })
  })

  it('should return values of multiple select', () => {
    const form = createForm()
    form.appendChild(createSelect({
      multiple: true,
      name: 'select',
      options: [
        { value: 'A' },
        { value: 'B', selected: true },
        { value: 'C', selected: true }
      ]
    }))

    const r = parseForm(form)
    expect(r).toEqual({ select: ['B', 'C'] })
  })

  it('should return values of text fields', () => {
    const form = createForm()
    form.appendChild(createTextInput({
      name: 'text',
      value: STRING
    }))

    const r = parseForm(form)
    expect(r).toEqual({ text: STRING })
  })

  it('should return values of textarea fields', () => {
    const form = createForm()
    form.appendChild(createTextarea({
      name: 'textarea',
      value: STRING
    }))

    const r = parseForm(form)
    expect(r).toEqual({ textarea: STRING })
  })

  describe('with parsing = "none"', () => {
    it('should not parse any value', () => {
      const form = createForm()
      form.appendChild(createTextInput({
        dataset: { type: 'boolean' },
        name: 'bool_true',
        value: TRUE
      }))
      form.appendChild(createTextInput({
        dataset: { type: 'boolean' },
        name: 'bool_false',
        value: FALSE
      }))
      form.appendChild(createNumberInput({
        dataset: { type: 'number' },
        name: 'float',
        value: FLOAT_STRING
      }))
      form.appendChild(createNumberInput({
        dataset: { type: 'number' },
        name: 'integer',
        value: INTEGER_STRING
      }))

      const r = parseForm(form, { parsing: 'none' })
      expect(r).toEqual({
        bool_true: TRUE,
        bool_false: FALSE,
        float: FLOAT_STRING,
        integer: INTEGER_STRING
      })
    })
  })

  describe('with parsing = "type"', () => {
    it('should parse values using "type" attribute', () => {
      const form = createForm()
      form.appendChild(createTextInput({
        name: 'string_true',
        value: TRUE
      }))
      form.appendChild(createTextInput({
        name: 'string_false',
        value: FALSE
      }))
      form.appendChild(createNumberInput({
        name: 'float',
        value: FLOAT_STRING
      }))
      form.appendChild(createTextInput({
        name: 'float_text',
        value: FLOAT_STRING
      }))
      form.appendChild(createNumberInput({
        name: 'integer',
        value: INTEGER_STRING
      }))
      form.appendChild(createTextInput({
        name: 'integer_text',
        value: INTEGER_STRING
      }))

      const r = parseForm(form, { parsing: 'type' })
      expect(r).toEqual({
        string_true: 'true',
        string_false: 'false',
        float: FLOAT,
        float_text: FLOAT_STRING,
        integer: INTEGER,
        integer_text: INTEGER_STRING
      })
    })
  })

  describe('with parsing = "data-type"', () => {
    it('should parse values using "data-type" attribute', () => {
      const form = createForm()
      form.appendChild(createTextInput({
        dataset: { type: 'boolean' },
        name: 'bool_true',
        value: TRUE,
        checked: true
      }))
      form.appendChild(createTextInput({
        dataset: { type: 'boolean' },
        name: 'bool_false',
        value: FALSE
      }))
      form.appendChild(createNumberInput({
        dataset: { type: 'number' },
        name: 'float',
        value: FLOAT_STRING
      }))
      form.appendChild(createNumberInput({
        dataset: { type: 'number' },
        name: 'integer',
        value: INTEGER_STRING
      }))
      const r = parseForm(form, { parsing: 'data-type' })
      expect(r).toEqual({
        bool_true: true,
        bool_false: true,
        float: FLOAT,
        integer: INTEGER
      })
    })

    it('should parse values of checked fields', () => {
      const form = createForm()
      form.appendChild(createCheckbox({
        dataset: { type: 'boolean' },
        checked: true,
        name: 'boolean_field',
        value: 'true'
      }))
      form.appendChild(createCheckbox({
        dataset: { type: 'number' },
        name: 'checkboxes_field[]',
        value: '1'
      }))
      form.appendChild(createCheckbox({
        checked: true,
        dataset: { type: 'number' },
        name: 'checkboxes_field[]',
        value: '2'
      }))
      form.appendChild(createRadio({
        dataset: { type: 'number' },
        name: 'radio_field',
        value: '1'
      }))
      form.appendChild(createRadio({
        checked: true,
        dataset: { type: 'number' },
        name: 'radio_field',
        value: '2'
      }))

      const r = parseForm(form, { parsing: 'data-type' })
      expect(r).toEqual({
        boolean_field: true,
        checkboxes_field: [2],
        radio_field: 2
      })
    })

    describe('with data-type="boolean"', () => {
      it('should return the parsed value when field is checked', () => {
        const form = createForm()
        form.appendChild(createCheckbox({
          dataset: { type: 'boolean' },
          name: 'a',
          value: 'true',
          checked: true
        }))
        form.appendChild(createCheckbox({
          dataset: { type: 'boolean' },
          name: 'b',
          value: 'false',
          checked: true
        }))
        const r = parseForm(form, { parsing: 'data-type' })
        expect(r).toEqual({
          a: true,
          b: false
        })
      })

      it('should return the inverse of parsed value when field is not checked', () => {
        const form = createForm()
        form.appendChild(createCheckbox({
          dataset: { type: 'boolean' },
          name: 'a',
          value: 'true'
        }))
        form.appendChild(createCheckbox({
          dataset: { type: 'boolean' },
          name: 'b',
          value: 'false'
        }))
        const r = parseForm(form, { parsing: 'data-type' })
        expect(r).toEqual({
          a: false,
          b: true
        })
      })
    })

    it('should not return unchecked values', () => {
      const form = createForm()
      form.appendChild(createCheckbox({
        dataset: { type: 'boolean' },
        name: 'boolean_field',
        value: 'true'
      }))
      form.appendChild(createCheckbox({
        dataset: { type: 'number' },
        name: 'checkboxes_field[]',
        value: '1'
      }))
      form.appendChild(createCheckbox({
        dataset: { type: 'number' },
        name: 'checkboxes_field[]',
        value: '2'
      }))
      form.appendChild(createRadio({
        dataset: { type: 'number' },
        name: 'radio_field',
        value: '1'
      }))
      form.appendChild(createRadio({
        dataset: { type: 'number' },
        name: 'radio_field',
        value: '2'
      }))

      const r = parseForm(form, { parsing: 'data-type' })
      expect(r).toEqual({
        boolean_field: false,
        checkboxes_field: [],
        radio_field: null
      })
    })

    it('should not parse email fields', () => {
      const form = createForm()
      form.appendChild(createTextInput({
        name: 'email',
        type: 'email',
        value: INTEGER_STRING
      }))

      const r = parseForm(form, { parsing: 'data-type' })
      expect(r).toEqual({ email: INTEGER_STRING })
    })

    it('should not parse file fields', () => {
      const form = createForm()
      form.appendChild(createFileInput({
        name: 'file'
      }))

      const r = parseForm(form, { parsing: 'data-type' })
      expect(r).toEqual({ file: null })
    })

    it('should not parse password fields', () => {
      const form = createForm()
      form.appendChild(createPasswordInput({
        name: 'password',
        value: INTEGER_STRING
      }))

      const r = parseForm(form, { parsing: 'data-type' })
      expect(r).toEqual({ password: INTEGER_STRING })
    })

    it('should not parse search fields', () => {
      const form = createForm()
      form.appendChild(createTextInput({
        name: 'search',
        type: 'search',
        value: INTEGER_STRING
      }))

      const r = parseForm(form, { parsing: 'data-type' })
      expect(r).toEqual({ search: INTEGER_STRING })
    })

    it('should not parse url fields', () => {
      const form = createForm()
      form.appendChild(createTextInput({
        name: 'url',
        type: 'url',
        value: INTEGER_STRING
      }))

      const r = parseForm(form, { parsing: 'data-type' })
      expect(r).toEqual({ url: INTEGER_STRING })
    })

    it('should not parse textarea fields', () => {
      const form = createForm()
      form.appendChild(createTextarea({
        name: 'textarea',
        value: INTEGER_STRING
      }))

      const r = parseForm(form, { parsing: 'data-type' })
      expect(r).toEqual({ textarea: INTEGER_STRING })
    })
  })

  describe('with parsing = "auto"', () => {
    it('should parse values using "data-type" and "type" attributes', () => {
      const form = createForm()
      form.appendChild(createTextInput({
        dataset: { type: 'boolean' },
        name: 'bool_true',
        value: TRUE,
        checked: true
      }))
      form.appendChild(createTextInput({
        dataset: { type: 'boolean' },
        name: 'bool_false',
        value: FALSE,
        checked: true
      }))
      form.appendChild(createNumberInput({
        name: 'float',
        value: FLOAT_STRING
      }))
      form.appendChild(createNumberInput({
        name: 'integer',
        value: INTEGER_STRING
      }))
      const r = parseForm(form, { parsing: 'auto' })
      expect(r).toEqual({
        bool_true: true,
        bool_false: false,
        float: FLOAT,
        integer: INTEGER
      })
    })
  })

  describe('with cleanFunction', () => {
    it('should clean string values', () => {
      const form = createForm()
      form.appendChild(createTextInput({
        name: 'text',
        value: '<script src="http://hacked.net"></script>'
      }))

      const r = parseForm(form, {
        cleanFunction: (value) => value.replace(/<\/?[^>]+>/gm, '')
      })
      expect(r).toEqual({ text: '' })
    })
    it('should not clean value from password field', () => {
      const form = createForm()
      form.appendChild(createPasswordInput({
        name: 'pass',
        value: PASSWORD
      }))

      const r = parseForm(form, {
        cleanFunction: (value) => value.trim()
      })
      expect(r).toEqual({ pass: PASSWORD })
    })
  })

  describe('with filterFunction', () => {
    const form = createForm()
    form.appendChild(createTextInput({ name: 'text', value: 'test' }))
    form.appendChild(createNumberInput({ name: 'num', value: 2 }))

    it('should return filtered fields only', () => {
      const r = parseForm(form, {
        filterFunction: (field) => field instanceof HTMLInputElement && field.type === 'text'
      })
      expect(r).toEqual({ text: 'test' })
    })

    it('should be called with value as the second argument', () => {
      const r = parseForm(form, {
        filterFunction: (field, value) => value === 'test'
      })
      expect(r).toEqual({ text: 'test' })
    })
  })

  describe('with nullify', () => {
    it('parseForm(form, {nullify: true}) should replace empty string with null', () => {
      const form = createForm()
      form.appendChild(createTextInput({
        name: 'text',
        value: ' '
      }))

      const r = parseForm(form, { nullify: true, trim: true })
      expect(r).toEqual({ text: null })
    })

    it('parseForm(form, {nullify: false}) should not replace empty string with null', () => {
      const form = createForm()
      form.appendChild(createTextInput({
        name: 'text',
        value: ' '
      }))

      const r = parseForm(form, { nullify: false, trim: true })
      expect(r).toEqual({ text: '' })
    })
  })

  describe('with trim', () => {
    it('parseForm(form, {trim: true}) should trim text values', () => {
      const form = createForm()
      form.appendChild(createTextInput({
        name: 'text',
        value: ` ${STRING} `
      }))

      const r = parseForm(form, { trim: true })
      expect(r).toEqual({ text: STRING })
    })

    it('parseForm(form, {trim: false}) should not trim text values', () => {
      const form = createForm()
      form.appendChild(createTextInput({
        name: 'text',
        value: ` ${STRING} `
      }))

      const r = parseForm(form, { trim: false })
      expect(r).toEqual({ text: ` ${STRING} ` })
    })

    it('parseForm(form, {trim: true}) should not trim password values', () => {
      const form = createForm()
      form.appendChild(createPasswordInput({
        name: 'password',
        value: PASSWORD
      }))

      const r = parseForm(form, { trim: true })
      expect(r).toEqual({ password: PASSWORD })
    })
  })
})

describe('parseNumber()', () => {
  it('parseNumber(null) should return null', () => {
    expect(parseNumber(null)).toEqual(null)
  })

  it('parseNumber(undefined) should return null', () => {
    expect(parseNumber(undefined)).toEqual(null)
  })

  it(`parseNumber("${FLOAT_STRING}") should return a float`, () => {
    const r = parseNumber(FLOAT_STRING)
    expect(r).toEqual(FLOAT)
    expect(r).not.toBeNaN()
  })

  it(`parseNumber("-${FLOAT_STRING}") should return a negative float`, () => {
    const r = parseNumber(`-${FLOAT_STRING}`)
    expect(r).toEqual(-FLOAT)
    expect(r).not.toBeNaN()
    expect(r < 0).toBe(true)
  })

  it(`parseNumber("+${FLOAT_STRING}") should return a positive float`, () => {
    const r = parseNumber(`+${FLOAT_STRING}`)
    expect(r).toEqual(parseFloat(FLOAT_STRING))
    expect(r).not.toBeNaN()
    expect(r > 0).toBe(true)
  })

  it(`parseNumber("${FLOAT_STRING_COMMA}") should return a float`, () => {
    expect(parseNumber(FLOAT_STRING_COMMA)).toEqual(FLOAT)
  })

  it(`parseNumber("${INTEGER_STRING}") should return an integer`, () => {
    expect(parseNumber(INTEGER_STRING)).toEqual(INTEGER)
  })

  it(`parseNumber("-${INTEGER_STRING}") should return a negative integer`, () => {
    expect(parseNumber(`-${INTEGER_STRING}`)).toEqual(-INTEGER)
  })

  it(`parseNumber("+${INTEGER_STRING}") should return a positive integer`, () => {
    expect(parseNumber(`+${INTEGER_STRING}`)).toEqual(INTEGER)
  })
})

describe('parseValue()', () => {
  it('parseValue(null) should return null', () => {
    expect(parseValue(null)).toEqual(null)
  })

  it('parseValue("") should return an empty string', () => {
    expect(parseValue('')).toEqual('')
  })

  it(`parseValue("${TRUE}") should return true`, () => {
    expect(parseValue(TRUE)).toEqual(true)
  })

  it(`parseValue("${TRUE}", "auto") should return true`, () => {
    expect(parseValue(TRUE, 'auto')).toEqual(true)
  })

  it(`parseValue("${TRUE}", "boolean") should return true`, () => {
    expect(parseValue(TRUE, 'boolean')).toEqual(true)
  })

  it(`parseValue("${TRUE}", "number") should return null`, () => {
    expect(parseValue(TRUE, 'number')).toEqual(null)
  })

  it(`parseValue("${FALSE}") should return false`, () => {
    expect(parseValue(FALSE)).toEqual(false)
  })

  it(`parseValue("${FALSE}", "auto") should return false`, () => {
    expect(parseValue(FALSE, 'auto')).toEqual(false)
  })

  it(`parseValue("${FALSE}", "boolean") should return false`, () => {
    expect(parseValue(FALSE, 'boolean')).toEqual(false)
  })

  it(`parseValue("${FALSE}", "number") should return null`, () => {
    expect(parseValue(FALSE, 'number')).toEqual(null)
  })

  it(`parseValue("${FLOAT_STRING}") should return ${FLOAT}`, () => {
    expect(parseValue(FLOAT_STRING)).toEqual(FLOAT)
  })

  it(`parseValue("${FLOAT_STRING}", "auto") should return ${FLOAT}`, () => {
    expect(parseValue(FLOAT_STRING, 'auto')).toEqual(FLOAT)
  })

  it(`parseValue("${FLOAT_STRING}", "boolean") should return null`, () => {
    expect(parseValue(FLOAT_STRING, 'boolean')).toEqual(null)
  })

  it(`parseValue("${FLOAT_STRING}", "number") should return ${FLOAT}`, () => {
    expect(parseValue(FLOAT_STRING, 'number')).toEqual(FLOAT)
  })

  it(`parseValue("${INTEGER_STRING}") should return ${INTEGER}`, () => {
    expect(parseValue(INTEGER_STRING)).toEqual(INTEGER)
  })

  it(`parseValue("${INTEGER_STRING}", "auto") should return ${INTEGER}`, () => {
    expect(parseValue(INTEGER_STRING, 'auto')).toEqual(INTEGER)
  })

  it(`parseValue("${INTEGER_STRING}", "boolean") should return null`, () => {
    expect(parseValue(INTEGER_STRING, 'boolean')).toEqual(null)
  })

  it(`parseValue("${INTEGER_STRING}", "number") should return ${INTEGER}`, () => {
    expect(parseValue(INTEGER_STRING, 'number')).toEqual(INTEGER)
  })

  it(`parseValue("${STRING}") should return "${STRING}"`, () => {
    expect(parseValue(STRING)).toEqual(STRING)
  })

  it(`parseValue("${STRING}", "auto") should return "${STRING}"`, () => {
    expect(parseValue(STRING, 'auto')).toEqual(STRING)
  })

  it(`parseValue("${STRING}", "boolean") should return null`, () => {
    expect(parseValue(STRING, 'boolean')).toEqual(null)
  })

  it(`parseValue("${STRING}", "number") should return null`, () => {
    expect(parseValue(STRING, 'number')).toEqual(null)
  })

  describe('Parsing value with extra spaces', () => {
    it(`parseValue(" ${FALSE} ", "boolean") should return false`, () => {
      expect(parseValue(` ${FALSE} `, 'boolean')).toEqual(false)
    })

    it(`parseValue(" ${TRUE} ", "boolean") should return true`, () => {
      expect(parseValue(` ${TRUE} `, 'boolean')).toEqual(true)
    })

    it(`parseValue(" ${FLOAT_STRING} ", "number") should return "${FLOAT}"`, () => {
      expect(parseValue(` ${FLOAT_STRING} `, 'number')).toEqual(FLOAT)
    })

    it(`parseValue(" ${FLOAT_STRING_COMMA} ", "number") should return "${FLOAT}"`, () => {
      expect(parseValue(` ${FLOAT_STRING_COMMA} `, 'number')).toEqual(FLOAT)
    })

    it(`parseValue(" ${INTEGER_STRING} ", "number") should return "${INTEGER}"`, () => {
      expect(parseValue(` ${INTEGER_STRING} `, 'number')).toEqual(INTEGER)
    })
  })
})

describe('trim()', () => {
  it('should remove extra spaces', () => {
    expect(trim(' hello '))
      .toEqual('hello')
  })

  it('should remove extra spaces in array', () => {
    expect(trim([' a ', 'b ', ' c']))
      .toEqual(['a', 'b', 'c'])
  })

  it('should remove extra spaces in object', () => {
    expect(trim({ a: ' a ', b: 'b ', c: ' c' }))
      .toEqual({ a: 'a', b: 'b', c: 'c' })
  })
})
