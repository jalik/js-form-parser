/*
 * The MIT License (MIT)
 * Copyright (c) 2025 Karl STEIN
 */

import { describe, expect, it } from 'vitest'
import {
  buildObject,
  getFieldValue,
  isMultipleField,
  nullify,
  parseBoolean,
  parseField,
  parseForm,
  parseNumber,
  parseValue,
  ParsingMode,
  ParsingType,
  trim
} from '../src'
import {
  createCheckbox,
  createElement,
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

describe('buildObject()', () => {
  describe('with invalid path', () => {
    it('should throw a SyntaxError', () => {
      expect(() => {
        buildObject('items[0.name', null)
      }).toThrow(SyntaxError)
      expect(() => {
        buildObject('items0].name', null)
      }).toThrow(SyntaxError)
    })
  })

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
    const r = buildObject('a[b]', undefined, {
      a: {
        b: 1,
        c: 2
      }
    })
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
    expect(r).toEqual({
      a: [0, 1, 2],
      b: { text: STRING }
    })
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

describe('getFieldValue()', () => {
  describe('with unsupported element', () => {
    it('should throw a TypeError', () => {
      expect(() => {
        getFieldValue(createElement('div'))
      }).toThrow(TypeError)
    })
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
    expect(nullify({
      a: '',
      b: 'b',
      c: null
    }))
      .toEqual({
        a: null,
        b: 'b',
        c: null
      })
  })
})

describe('isMultipleField()', () => {
  describe('with element having a name ending with []', () => {
    it('should return true', () => {
      const select = createSelect({ name: 'items[]' })
      expect(isMultipleField(select)).toBe(true)
      const textarea = createTextarea({ name: 'items[]' })
      expect(isMultipleField(textarea)).toBe(true)
      const input = createTextInput({ name: 'items[]' })
      expect(isMultipleField(input)).toBe(true)
      const checkbox = createCheckbox({ name: 'items[]' })
      expect(isMultipleField(checkbox)).toBe(true)
      const radio = createRadio({ name: 'items[]' })
      expect(isMultipleField(radio)).toBe(true)
    })
  })

  describe('with element having a name containing an index', () => {
    it('should return true', () => {
      const input = createTextInput({ name: 'items[1]' })
      expect(isMultipleField(input)).toBe(true)
    })
  })

  describe('with inputs having the same name', () => {
    it('should return true', () => {
      const a = createTextInput({
        name: 'item',
        value: 'A'
      })
      const b = createCheckbox({
        name: 'item',
        value: 'B'
      })
      createForm(undefined, [a, b])
      expect(isMultipleField(a)).toBe(true)
      expect(isMultipleField(b)).toBe(true)
    })
  })

  describe('with checkboxes having the same name', () => {
    it('should return true', () => {
      const a = createCheckbox({
        name: 'item',
        value: 'A'
      })
      const b = createCheckbox({
        name: 'item',
        value: 'B'
      })
      createForm(undefined, [a, b])
      expect(isMultipleField(a)).toBe(true)
      expect(isMultipleField(b)).toBe(true)
    })
  })

  describe('with radios having the same name', () => {
    it('should return false', () => {
      const a = createRadio({
        name: 'item',
        value: 'A'
      })
      const b = createRadio({
        name: 'item',
        value: 'B'
      })
      createForm(undefined, [a, b])
      expect(isMultipleField(a)).toBe(false)
      expect(isMultipleField(b)).toBe(false)
    })
  })
})

describe('parseBoolean()', () => {
  it('parseBoolean(null) should return null', () => {
    expect(parseBoolean(null)).toEqual(null)
  })

  it('parseBoolean("true") should return true', () => {
    expect(parseBoolean('true')).toEqual(true)
  })

  it('parseBoolean("false") should return false', () => {
    expect(parseBoolean('false')).toEqual(false)
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
  it('should be importable from package', () => {
    expect(typeof parseField).toEqual('function')
  })

  describe('with unsupported element', () => {
    it('should throw a TypeError', () => {
      expect(() => {
        parseField(createElement('div'))
      }).toThrow(TypeError)
    })
  })

  describe('using checkbox input', () => {
    describe('with attribute data-type="boolean"', () => {
      const parsing: ParsingMode = 'data-type'
      const dataType = 'boolean'

      describe('with checked = true', () => {
        it('should return true', () => {
          const field = createCheckbox({
            dataset: { type: dataType },
            name: 'boolean_field',
            value: 'true',
            checked: true
          })
          expect(parseField(field, { parsing })).toEqual(true)
        })
      })

      describe('with checked = false', () => {
        it('should return null', () => {
          const field = createCheckbox({
            dataset: { type: dataType },
            name: 'boolean_field',
            value: 'true'
          })
          expect(parseField(field, { parsing })).toEqual(null)
        })
      })

      describe('without value', () => {
        describe('and checked = true', () => {
          it('should return checkbox value', () => {
            const checkbox = createCheckbox({
              dataset: { type: dataType },
              name: 'checkbox',
              checked: true
            })
            expect(parseField(checkbox, { parsing })).toBe(checkbox.checked)
          })
        })

        describe('and checked = false', () => {
          it('should return null', () => {
            const checkbox = createCheckbox({
              dataset: { type: dataType },
              name: 'checkbox'
            })
            expect(parseField(checkbox, { parsing })).toBe(null)
          })
        })
      })
    })
  })

  describe('using radio input', () => {
    describe('with data-type="boolean"', () => {
      const parsing: ParsingMode = 'data-type'
      const dataType = 'boolean'

      describe('with checked=true', () => {
        it('should return a boolean', () => {
          const field1 = createRadio({
            dataset: { type: dataType },
            name: 'field',
            value: 'false'
          })
          const field2 = createRadio({
            dataset: { type: dataType },
            name: 'field',
            value: 'true',
            checked: true
          })
          createForm(undefined, [field1, field2])
          expect(parseField(field1, { parsing })).toEqual(true)
          expect(parseField(field2, { parsing })).toEqual(true)
        })

        describe('with unchecked value=""', () => {
          it('should return a boolean', () => {
            const field1 = createRadio({
              dataset: { type: dataType },
              name: 'field',
              value: 'true',
              checked: true
            })
            const field2 = createRadio({
              dataset: { type: dataType },
              name: 'field',
              value: ''
            })
            createForm(undefined, [field1, field2])
            expect(parseField(field2, { parsing })).toEqual(true)
          })
        })
      })

      describe('with checked=false', () => {
        it('should return null', () => {
          const field1 = createRadio({
            dataset: { type: dataType },
            name: 'field',
            value: 'false'
          })
          const field2 = createRadio({
            dataset: { type: dataType },
            name: 'field',
            value: 'true'
          })
          createForm(undefined, [field1, field2])
          expect(parseField(field1, { parsing })).toEqual(null)
          expect(parseField(field2, { parsing })).toEqual(null)
        })
      })
    })

    describe('with data-type="number"', () => {
      const parsing: ParsingMode = 'data-type'
      const dataType = 'number'

      describe('with checked=true', () => {
        it('should return a number', () => {
          const field1 = createRadio({
            dataset: { type: dataType },
            name: 'field',
            value: '100'
          })
          const field2 = createRadio({
            dataset: { type: dataType },
            name: 'field',
            value: '200',
            checked: true
          })
          createForm(undefined, [field1, field2])
          expect(parseField(field1, { parsing })).toEqual(200)
          expect(parseField(field2, { parsing })).toEqual(200)
        })

        describe('with unchecked value=""', () => {
          it('should return a number', () => {
            const field1 = createRadio({
              dataset: { type: dataType },
              name: 'field',
              value: '200',
              checked: true
            })
            const field2 = createRadio({
              dataset: { type: dataType },
              name: 'field',
              value: ''
            })
            createForm(undefined, [field1, field2])
            expect(parseField(field2, { parsing })).toEqual(200)
          })
        })
      })

      describe('with checked=false', () => {
        it('should return null', () => {
          const field1 = createRadio({
            dataset: { type: dataType },
            name: 'field',
            value: '100'
          })
          const field2 = createRadio({
            dataset: { type: dataType },
            name: 'field',
            value: '200'
          })
          createForm(undefined, [field1, field2])
          expect(parseField(field1, { parsing })).toEqual(null)
          expect(parseField(field2, { parsing })).toEqual(null)
        })
      })
    })
  })

  describe('using text input', () => {
    describe('with attribute data-type="number"', () => {
      const parsing: ParsingMode = 'data-type'
      const dataType = 'number'

      const field = createTextInput({
        dataset: { type: dataType },
        name: 'number_field',
        value: '1'
      })

      it('should return a number', () => {
        expect(parseField(field, { parsing })).toEqual(Number(field.value))
      })
    })
  })

  describe('using textarea', () => {
    describe('with attribute data-type="boolean"', () => {
      const parsing: ParsingMode = 'data-type'
      const dataType = 'boolean'

      const field = createTextarea({
        dataset: { type: dataType },
        name: 'number_field',
        value: 'true'
      })

      it('should return a boolean', () => {
        expect(parseField(field, { parsing })).toEqual(parseBoolean(field.value))
      })
    })

    describe('with attribute data-type="number"', () => {
      const parsing: ParsingMode = 'data-type'
      const dataType = 'number'

      const field = createTextarea({
        dataset: { type: dataType },
        name: 'number_field',
        value: '1337'
      })

      it('should return a number', () => {
        expect(parseField(field, { parsing })).toEqual(1337)
      })
    })
  })

  describe('using select input', () => {
    describe('with attributes multiple="true" and data-type="number"', () => {
      const parsing: ParsingMode = 'data-type'
      const dataType = 'number'

      it('should return an array of numbers', () => {
        const options = [
          { value: '000' },
          {
            value: '123',
            selected: true
          },
          {
            value: '456',
            selected: true
          },
          {
            value: '789',
            selected: true
          }
        ]
        const field = createSelect({
          dataset: { type: dataType },
          multiple: true
        }, options)
        const values = options
          .filter((el) => el.selected)
          .map((el) => Number(el.value))
        expect(parseField(field, { parsing })).toEqual(values)
      })
    })
  })

  describe('with element having multiple="true"', () => {
    const field1 = createCheckbox({
      name: 'numbers[]',
      value: '1'
    })
    const field2 = createCheckbox({
      name: 'numbers[]',
      value: '2',
      checked: true
    })
    createForm(undefined, [field1, field2])

    it('should return an array of values', () => {
      expect(parseField(field1)).toEqual(['2'])
    })
  })

  describe('with element having data-type="auto"', () => {
    const parsing: ParsingMode = 'data-type'
    const dataType = 'auto'

    describe('with single field', () => {
      describe('with value like a boolean', () => {
        it('should return a boolean', () => {
          const field = createTextInput({
            dataset: { type: dataType },
            name: 'field',
            value: 'true'
          })
          expect(parseField(field, { parsing })).toBe(true)
        })
      })
      describe('with value like a number', () => {
        it('should return a number', () => {
          const field = createNumberInput({
            dataset: { type: dataType },
            name: 'field',
            value: '100'
          })
          expect(parseField(field, { parsing })).toBe(100)
        })
      })
    })

    describe('from multiple fields', () => {
      describe('with values like boolean', () => {
        it('should return booleans', () => {
          const field1 = createTextInput({
            dataset: { type: dataType },
            name: 'booleans',
            value: 'true'
          })
          const field2 = createTextInput({
            dataset: { type: dataType },
            name: 'booleans',
            value: 'false'
          })
          createForm(undefined, [field1, field2])
          expect(parseField(field1, { parsing })).toStrictEqual([true, false])
        })
      })
      describe('with values like number', () => {
        it('should return numbers', () => {
          const field1 = createTextInput({
            dataset: { type: dataType },
            name: 'numbers',
            value: '100'
          })
          const field2 = createTextInput({
            dataset: { type: dataType },
            name: 'numbers',
            value: '200'
          })
          createForm(undefined, [field1, field2])
          expect(parseField(field1, { parsing })).toStrictEqual([100, 200])
        })
      })
    })
  })

  describe('with element having data-type="boolean"', () => {
    const parsing: ParsingMode = 'data-type'
    const dataType: ParsingType = 'boolean'

    describe('with single field', () => {
      it('should return a boolean', () => {
        const field = createTextInput({
          dataset: { type: dataType },
          name: 'boolean',
          value: 'true'
        })
        expect(parseField(field, { parsing })).toBe(true)
      })
    })

    describe('from multiple fields', () => {
      it('should return booleans', () => {
        const field1 = createTextInput({
          dataset: { type: dataType },
          name: 'booleans',
          value: 'true'
        })
        const field2 = createTextInput({
          dataset: { type: dataType },
          name: 'booleans',
          value: 'false'
        })
        createForm(undefined, [field1, field2])
        expect(parseField(field1, { parsing })).toStrictEqual([true, false])
      })
    })
  })

  describe('with element having data-type="string"', () => {
    const parsing: ParsingMode = 'data-type'
    const dataType: ParsingType = 'string'

    it('should not parse value', () => {
      const field = createNumberInput({
        dataset: { type: dataType },
        name: 'number',
        value: '100'
      })
      expect(parseField(field, { parsing })).toBe('100')
    })
  })

  describe('with parsing="type"', () => {
    const parsing: ParsingMode = 'type'

    describe('with element having type="number"', () => {
      it('should return a number', () => {
        const field = createNumberInput({ value: '100' })
        createForm(undefined, [field])
        expect(parseField(field, { parsing })).toBe(100)
      })
    })

    describe('with several elements having type="number"', () => {
      it('should return an array of numbers', () => {
        const field1 = createNumberInput({ value: '100' })
        const field2 = createNumberInput({ value: '200' })
        createForm(undefined, [field1, field2])
        expect(parseField(field1, { parsing })).toStrictEqual([100, 200])
        expect(parseField(field2, { parsing })).toStrictEqual([100, 200])
      })
    })
  })

  describe('with option nullify=true', () => {
    describe('with value = ""', () => {
      it('should return null', () => {
        const textInput = createTextInput({
          name: 'text',
          value: ''
        })
        expect(parseField(textInput, { nullify: true })).toBe(null)
      })
    })
    describe('with non empty value', () => {
      it('should return value', () => {
        const value = 'test'
        const textInput = createTextInput({
          name: 'text',
          value
        })
        expect(parseField(textInput, { nullify: true })).toBe(value)
      })
    })
  })

  describe('with option trim=true', () => {
    const value = ' test '

    it('should remove extra spaces around value', () => {
      const textInput = createTextInput({
        name: 'text',
        value
      })
      expect(parseField(textInput, { trim: true })).toBe(value.trim())
    })

    it('should not modify hidden value', () => {
      const hidden = createHiddenInput({
        name: 'hidden',
        value
      })
      expect(parseField(hidden, { trim: true })).toBe(value)
    })

    it('should not modify checkbox value', () => {
      const checkbox = createCheckbox({
        checked: true,
        name: 'checkbox',
        value
      })
      expect(parseField(checkbox, { trim: true })).toBe(value)
    })

    it('should not modify radio value', () => {
      const radio = createRadio({
        checked: true,
        name: 'radio',
        value
      })
      expect(parseField(radio, { trim: true })).toBe(value)
    })

    it('should not modify password value', () => {
      const passwordInput = createPasswordInput({
        name: 'password',
        value
      })
      expect(parseField(passwordInput, { trim: true })).toBe(value)
    })

    it('should not modify select value', () => {
      const select = createSelect({
        name: 'select'
      }, [
        {
          value,
          selected: true
        }
      ])
      expect(parseField(select, { trim: true })).toBe(value)
    })
  })

  describe('with option parser', () => {
    const parsing: ParsingMode = 'data-type'
    const dataType: ParsingType = 'phone'

    describe('on single value', () => {
      it('should return the parsed value', () => {
        const field1 = createTextInput({
          dataset: { type: dataType },
          name: 'phone',
          value: '689.87000000'
        })
        const result = parseField(field1, {
          parsing,
          parser: (value, type) => {
            if (type === 'phone') {
              const [code, number] = value.split(/\./)
              return {
                code,
                number
              }
            }
            return null
          }
        })
        expect(result).toStrictEqual({
          code: '689',
          number: '87000000'
        })
      })
    })

    describe('on multiple values', () => {
      it('should return the parsed values', () => {
        const field1 = createTextInput({
          dataset: { type: dataType },
          name: 'phones',
          value: '689.87000000'
        })
        const field2 = createTextInput({
          dataset: { type: dataType },
          name: 'phones',
          value: '689.88000000'
        })
        const form = createForm(undefined, [field1, field2])
        const r = parseForm(form, {
          parsing,
          parser: (value, type) => {
            if (type === 'phone') {
              const [code, number] = value.split(/\./)
              return {
                code,
                number
              }
            }
            return null
          }
        })
        expect(r).toStrictEqual({
          phones: [
            {
              code: '689',
              number: '87000000'
            },
            {
              code: '689',
              number: '88000000'
            }
          ]
        })
      })
    })

    describe('with unsupported data-type', () => {
      it('should throw an Error', () => {
        expect(() => {
          const field = createTextInput({
            dataset: { type: 'binary' },
            value: '01100'
          })
          parseField(field, { parsing })
        }).toThrow()
      })
    })
  })
})

describe('parseForm()', () => {
  it('should be importable from package', () => {
    expect(typeof parseForm).toEqual('function')
  })

  describe('with unsupported element', () => {
    it('should throw a TypeError', () => {
      expect(() => {
        parseForm(createElement('div'))
      }).toThrow(TypeError)
    })
  })

  it('should ignore non input fields', () => {
    const field = createTextInput({
      name: 'text',
      value: 'hello'
    })
    const button = createElement('button')
    const form = createForm(undefined, [field, button])
    expect(parseForm(form)).toStrictEqual({ text: 'hello' })
  })

  it('should not return disabled fields', () => {
    const field1 = createTextInput({
      disabled: true,
      name: 'disabled',
      value: STRING
    })
    const form = createForm(undefined, [field1])
    const r = parseForm(form)
    expect(r).toEqual({})
  })

  it('should not return values of fields without a name', () => {
    const field1 = createTextInput({
      value: STRING
    })
    const form = createForm(undefined, [field1])
    const r = parseForm(form)
    expect(r).toEqual({})
  })

  it('should return null for unchecked checkboxes and radios', () => {
    const checkbox1 = createCheckbox({
      name: 'checkbox',
      value: '1'
    })
    const radio1 = createRadio({
      name: 'radio',
      value: '1'
    })
    const radio2 = createRadio({
      name: 'radio',
      value: '2'
    })
    const form = createForm(undefined, [checkbox1, radio1, radio2])
    expect(parseForm(form)).toEqual({
      checkbox: null,
      radio: null
    })
  })

  it('should return fields with a name containing dashes', () => {
    const field1 = createTextarea({
      name: 'x-custom-field',
      value: STRING
    })
    const form = createForm(undefined, [field1])
    const r = parseForm(form)
    expect(r).toEqual({ 'x-custom-field': STRING })
  })

  it('should return fields with a name of one character long', () => {
    const field1 = createHiddenInput({
      name: 'x',
      value: STRING
    })
    const form = createForm(undefined, [field1])
    const r = parseForm(form)
    expect(r).toEqual({ x: STRING })
  })

  it('should return array fields', () => {
    const textArrayField = createTextInput({
      name: 'text[]',
      value: STRING
    })
    const textareaArrayField = createTextarea({
      name: 'textarea[]',
      value: STRING
    })
    const checkboxArrayField = createCheckbox({
      name: 'checkbox[]',
      value: STRING,
      checked: true
    })
    const radioArrayField = createRadio({
      name: 'radio[]',
      value: STRING,
      checked: true
    })
    const selectArrayField = createSelect({
      name: 'select[]'
    }, [
      { value: '' },
      {
        value: 'A',
        selected: true
      },
      { value: 'B' }
    ])
    const checkboxField1 = createCheckbox({
      name: 'items',
      value: 'A',
      checked: true
    })
    const checkboxField2 = createCheckbox({
      name: 'items',
      value: 'B',
      checked: true
    })
    const form = createForm(undefined, [
      textArrayField,
      textareaArrayField,
      radioArrayField,
      checkboxArrayField,
      selectArrayField,
      checkboxField1,
      checkboxField2
    ])
    const r = parseForm(form)
    expect(r).toEqual({
      text: [STRING],
      textarea: [STRING],
      checkbox: [STRING],
      radio: [STRING],
      select: ['A'],
      items: ['A', 'B']
    })
  })

  it('should return indexed array fields', () => {
    const field1 = createCheckbox({
      name: 'items[1]',
      value: 'A',
      checked: true
    })
    const field2 = createCheckbox({
      name: 'items[0]',
      value: 'B',
      checked: true
    })
    const form = createForm(undefined, [field1, field2])
    const r = parseForm(form)
    expect(r).toEqual({
      items: ['B', 'A']
    })
  })

  it('should return empty array if no checkbox is checked', () => {
    const field1 = createCheckbox({
      name: 'items[]',
      value: '0'
    })
    const field2 = createCheckbox({
      name: 'items[]',
      value: '1'
    })

    const form = createForm(undefined, [field1, field2])
    const r = parseForm(form)
    expect(r).toEqual({ items: [] })
  })

  it('should return nested fields', () => {
    const field1 = createTextInput({
      name: 'a[b][][c]',
      value: STRING
    })
    const form = createForm(undefined, [field1])
    expect(parseForm(form)).toStrictEqual({
      a: { b: [{ c: STRING }] }
    })
  })

  it('should return values of file fields', () => {
    const field1 = createFileInput({
      name: 'file'
    })
    const form = createForm(undefined, [field1])
    const r = parseForm(form)
    expect(r).toEqual({ file: null })
  })

  it('should return values of hidden fields', () => {
    const field1 = createHiddenInput({
      name: 'hidden',
      value: STRING
    })
    const form = createForm(undefined, [field1])
    const r = parseForm(form)
    expect(r).toEqual({ hidden: STRING })
  })

  it('should return values of checked checkboxes', () => {
    const a = createCheckbox({
      checked: true,
      name: 'checkboxes[]',
      value: 'A'
    })
    const b = createCheckbox({
      name: 'checkboxes[]',
      value: 'B'
    })
    const c = createCheckbox({
      checked: true,
      name: 'checkboxes[]',
      value: 'C'
    })
    const form = createForm(undefined, [a, b, c])
    const r = parseForm(form)
    expect(r).toEqual({
      checkboxes: [
        a.value,
        c.value
      ]
    })
  })

  it('should return values of checked radios', () => {
    const a = createRadio({
      checked: true,
      name: 'radio',
      value: 'A'
    })
    const b = createRadio({
      name: 'radio',
      value: 'B'
    })
    const c = createRadio({
      name: 'radio2',
      value: 'C'
    })
    const d = createRadio({
      checked: true,
      name: 'radio2',
      value: 'D'
    })
    const form = createForm(undefined, [a, b, c, d])
    const r = parseForm(form)
    expect(r).toEqual({
      radio: a.value,
      radio2: d.value
    })
  })

  it('should return values of number fields', () => {
    const field1 = createNumberInput({
      name: 'number',
      value: String(INTEGER)
    })
    const form = createForm(undefined, [field1])
    const r = parseForm(form)
    expect(r).toEqual({ number: INTEGER })
  })

  it('should return values of email fields', () => {
    const field1 = createTextInput({
      name: 'email',
      type: 'email',
      value: STRING
    })
    const form = createForm(undefined, [field1])
    const r = parseForm(form)
    expect(r).toEqual({ email: STRING })
  })

  it('should return values of password fields', () => {
    const field1 = createPasswordInput({
      name: 'password',
      value: PASSWORD
    })
    const form = createForm(undefined, [field1])
    const r = parseForm(form)
    expect(r).toEqual({ password: PASSWORD })
  })

  it('should return values of select fields', () => {
    const field1 = createSelect({
      name: 'select'
    }, [
      { value: 'A' },
      {
        value: 'B',
        selected: true
      }
    ])
    const form = createForm(undefined, [field1])
    const r = parseForm(form)
    expect(r).toEqual({ select: 'B' })
  })

  it('should return values of multiple select', () => {
    const field1 = createSelect({
      multiple: true,
      name: 'select'
    }, [
      { value: 'A' },
      {
        value: 'B',
        selected: true
      },
      {
        value: 'C',
        selected: true
      }
    ])
    const form = createForm(undefined, [field1])
    const r = parseForm(form)
    expect(r).toEqual({ select: ['B', 'C'] })
  })

  it('should return values of text fields', () => {
    const field1 = createTextInput({
      name: 'text',
      value: STRING
    })
    const form = createForm(undefined, [field1])
    const r = parseForm(form)
    expect(r).toEqual({ text: STRING })
  })

  it('should return values of textarea fields', () => {
    const field1 = createTextarea({
      name: 'textarea',
      value: STRING
    })
    const form = createForm(undefined, [field1])
    const r = parseForm(form)
    expect(r).toEqual({ textarea: STRING })
  })

  describe('with parsing = "none"', () => {
    const parsing: ParsingMode = 'none'

    it('should not parse any value', () => {
      const boolField1 = createTextInput({
        dataset: { type: 'boolean' },
        name: 'bool_true',
        value: TRUE
      })
      const boolField2 = createTextInput({
        dataset: { type: 'boolean' },
        name: 'bool_false',
        value: FALSE
      })
      const numberField1 = createNumberInput({
        dataset: { type: 'number' },
        name: 'float',
        value: FLOAT_STRING
      })
      const numberField2 = createNumberInput({
        dataset: { type: 'number' },
        name: 'integer',
        value: INTEGER_STRING
      })
      const form = createForm(undefined, [boolField1, boolField2, numberField1, numberField2])
      const r = parseForm(form, { parsing })
      expect(r).toEqual({
        bool_true: TRUE,
        bool_false: FALSE,
        float: FLOAT_STRING,
        integer: INTEGER_STRING
      })
    })
  })

  describe('with parsing = "type"', () => {
    const parsing: ParsingMode = 'type'

    it('should parse values using "type" attribute', () => {
      const trueField = createTextInput({
        name: 'string_true',
        value: TRUE
      })
      const falseField = createTextInput({
        name: 'string_false',
        value: FALSE
      })
      const floatField = createNumberInput({
        name: 'float',
        value: FLOAT_STRING
      })
      const floatStringField = createTextInput({
        name: 'float_text',
        value: FLOAT_STRING
      })
      const integerField = createNumberInput({
        name: 'integer',
        value: INTEGER_STRING
      })
      const integerStringField = createTextInput({
        name: 'integer_text',
        value: INTEGER_STRING
      })
      const form = createForm(undefined, [trueField, falseField, floatField, floatStringField, integerField, integerStringField])
      const r = parseForm(form, { parsing })
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
    const parsing: ParsingMode = 'data-type'

    it('should parse values using "data-type" attribute', () => {
      const checkboxTrue = createCheckbox({
        dataset: { type: 'boolean' },
        name: 'bool_true',
        value: TRUE,
        checked: true
      })
      const checkboxFalse = createCheckbox({
        dataset: { type: 'boolean' },
        name: 'bool_false',
        value: FALSE,
        checked: true
      })
      const radioTrue = createRadio({
        dataset: { type: 'boolean' },
        name: 'bool_radio',
        value: TRUE
      })
      const radioFalse = createRadio({
        dataset: { type: 'boolean' },
        name: 'bool_radio',
        checked: true,
        value: FALSE
      })
      const radio1 = createRadio({
        dataset: { type: 'number' },
        name: 'number_radio',
        value: '1'
      })
      const radio2 = createRadio({
        dataset: { type: 'number' },
        name: 'number_radio',
        checked: true,
        value: '2'
      })
      const floatNumber = createNumberInput({
        dataset: { type: 'number' },
        name: 'float',
        value: FLOAT_STRING
      })
      const integerNumber = createNumberInput({
        dataset: { type: 'number' },
        name: 'integer',
        value: INTEGER_STRING
      })
      const integerTextarea = createTextarea({
        dataset: { type: 'number' },
        name: 'number_textarea',
        value: INTEGER_STRING
      })
      const form = createForm(undefined, [
        checkboxTrue,
        checkboxFalse,
        radioTrue,
        radioFalse,
        radio1,
        radio2,
        floatNumber,
        integerNumber,
        integerTextarea
      ])
      const r = parseForm(form, { parsing })
      expect(r).toEqual({
        bool_radio: false,
        bool_true: true,
        bool_false: false,
        number_radio: 2,
        float: FLOAT,
        integer: INTEGER,
        number_textarea: INTEGER
      })
    })

    it('should parse values of checked fields', () => {
      const bool = createCheckbox({
        dataset: { type: 'boolean' },
        name: 'boolean_field',
        value: 'true',
        checked: true
      })
      const checkbox1 = createCheckbox({
        dataset: { type: 'number' },
        name: 'checkboxes_field[]',
        value: '1'
      })
      const checkbox2 = createCheckbox({
        dataset: { type: 'number' },
        name: 'checkboxes_field[]',
        value: '2',
        checked: true
      })
      const radio1 = createRadio({
        dataset: { type: 'number' },
        name: 'radio_field',
        value: '1'
      })
      const radio2 = createRadio({
        dataset: { type: 'number' },
        name: 'radio_field',
        value: '2',
        checked: true
      })
      const form = createForm(undefined, [bool, checkbox1, checkbox2, radio1, radio2])
      const r = parseForm(form, { parsing })
      expect(r).toEqual({
        boolean_field: true,
        checkboxes_field: [2],
        radio_field: 2
      })
    })

    it('should not return unchecked values', () => {
      const boolField = createCheckbox({
        dataset: { type: 'boolean' },
        name: 'boolean_field',
        value: 'true'
      })
      const checkboxField1 = createCheckbox({
        dataset: { type: 'number' },
        name: 'checkboxes_field[]',
        value: '1'
      })
      const checkboxField2 = createCheckbox({
        dataset: { type: 'number' },
        name: 'checkboxes_field[]',
        value: '2'
      })
      const radioField1 = createRadio({
        dataset: { type: 'number' },
        name: 'radio_field',
        value: '1'
      })
      const radioField2 = createRadio({
        dataset: { type: 'number' },
        name: 'radio_field',
        value: '2'
      })
      const checkboxField = createCheckbox({
        dataset: { type: 'boolean' },
        name: 'single_field',
        checked: true
      })
      const form = createForm(undefined, [boolField, checkboxField1, checkboxField2, radioField1, radioField2, checkboxField])
      const r = parseForm(form, { parsing })
      expect(r).toEqual({
        boolean_field: null,
        checkboxes_field: [],
        radio_field: null,
        single_field: true
      })
    })

    it('should not parse email fields', () => {
      const field = createTextInput({
        name: 'email',
        type: 'email',
        value: INTEGER_STRING
      })
      const form = createForm(undefined, [field])
      const r = parseForm(form, { parsing })
      expect(r).toEqual({ email: INTEGER_STRING })
    })

    it('should not parse file fields', () => {
      const field = createFileInput({
        name: 'file'
      })
      const form = createForm(undefined, [field])
      const r = parseForm(form, { parsing })
      expect(r).toEqual({ file: null })
    })

    it('should not parse password fields', () => {
      const field = createPasswordInput({
        name: 'password',
        value: INTEGER_STRING
      })
      const form = createForm(undefined, [field])
      const r = parseForm(form, { parsing })
      expect(r).toEqual({ password: INTEGER_STRING })
    })

    it('should not parse search fields', () => {
      const field = createTextInput({
        name: 'search',
        type: 'search',
        value: INTEGER_STRING
      })
      const form = createForm(undefined, [field])
      const r = parseForm(form, { parsing })
      expect(r).toEqual({ search: INTEGER_STRING })
    })

    it('should not parse url fields', () => {
      const field = createTextInput({
        name: 'url',
        type: 'url',
        value: INTEGER_STRING
      })
      const form = createForm(undefined, [field])
      const r = parseForm(form, { parsing })
      expect(r).toEqual({ url: INTEGER_STRING })
    })

    it('should not parse textarea fields', () => {
      const field = createTextarea({
        name: 'textarea',
        value: INTEGER_STRING
      })
      const form = createForm(undefined, [field])
      const r = parseForm(form, { parsing })
      expect(r).toEqual({ textarea: INTEGER_STRING })
    })
  })

  describe('with parsing = "auto"', () => {
    const parsing: ParsingMode = 'auto'

    it('should parse values using "data-type" and "type" attributes', () => {
      const trueField = createTextInput({
        dataset: { type: 'boolean' },
        name: 'bool_true',
        value: TRUE,
        checked: true
      })
      const falseField = createTextInput({
        dataset: { type: 'boolean' },
        name: 'bool_false',
        value: FALSE,
        checked: true
      })
      const floatField = createNumberInput({
        name: 'float',
        value: FLOAT_STRING
      })
      const integerField = createNumberInput({
        name: 'integer',
        value: INTEGER_STRING
      })
      const form = createForm(undefined, [trueField, falseField, floatField, integerField])
      const r = parseForm(form, { parsing })
      expect(r).toEqual({
        bool_true: true,
        bool_false: false,
        float: FLOAT,
        integer: INTEGER
      })
    })
  })

  describe('with cleanFunction', () => {
    const value = 'test'
    const CLEANED = 'CLEANED'
    const cleanFunction = () => CLEANED

    it('should clean string values', () => {
      const field1 = createTextInput({
        name: 'text',
        value: '<script src="http://hacked.net"></script>'
      })
      const field2 = createTextInput({
        name: 'emails',
        value: 'perso@mail.com'
      })
      const field3 = createTextInput({
        name: 'emails',
        value: 'pro@mail.com'
      })
      const form = createForm(undefined, [field1, field2, field3])
      const result = parseForm(form, {
        cleanFunction
      })
      expect(result).toEqual({
        text: CLEANED,
        emails: [
          CLEANED,
          CLEANED
        ]
      })
    })

    it('should not modify hidden value', () => {
      const field = createHiddenInput({
        name: 'hidden',
        value
      })
      const form = createForm(undefined, [field])
      const r = parseForm(form, { cleanFunction })
      expect(r).toStrictEqual({ hidden: value })
    })

    it('should not modify checkbox value', () => {
      const field = createCheckbox({
        checked: true,
        name: 'checkbox',
        value
      })
      const form = createForm(undefined, [field])
      const r = parseForm(form, { cleanFunction })
      expect(r).toStrictEqual({ checkbox: value })
    })

    it('should not modify radio value', () => {
      const field = createRadio({
        checked: true,
        name: 'radio',
        value
      })
      const form = createForm(undefined, [field])
      const r = parseForm(form, { cleanFunction })
      expect(r).toStrictEqual({ radio: value })
    })

    it('should not modify password value', () => {
      const field = createPasswordInput({
        name: 'password',
        value
      })
      const form = createForm(undefined, [field])
      const r = parseForm(form, { cleanFunction })
      expect(r).toStrictEqual({ password: value })
    })

    it('should not modify select value', () => {
      const field = createSelect({
        name: 'select'
      }, [
        {
          value,
          selected: true
        }
      ])
      const form = createForm(undefined, [field])
      const r = parseForm(form, { cleanFunction })
      expect(r).toStrictEqual({ select: value })
    })
  })

  describe('with filterFunction', () => {
    const textField = createTextInput({
      name: 'text',
      value: 'test'
    })
    const numberField = createNumberInput({
      name: 'num',
      value: '2'
    })
    const form = createForm(undefined, [textField, numberField])

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
      const field = createTextInput({
        name: 'text',
        value: ' '
      })
      const form = createForm(undefined, [field])
      const r = parseForm(form, {
        nullify: true,
        trim: true
      })
      expect(r).toEqual({ text: null })
    })

    it('parseForm(form, {nullify: false}) should not replace empty string with null', () => {
      const field = createTextInput({
        name: 'text',
        value: ' '
      })
      const form = createForm(undefined, [field])
      const r = parseForm(form, {
        nullify: false,
        trim: true
      })
      expect(r).toEqual({ text: '' })
    })
  })

  describe('with trim', () => {
    it('parseForm(form, {trim: true}) should trim text values', () => {
      const field = createTextInput({
        name: 'text',
        value: ` ${STRING} `
      })
      const form = createForm(undefined, [field])
      const r = parseForm(form, { trim: true })
      expect(r).toEqual({ text: STRING })
    })

    it('parseForm(form, {trim: false}) should not trim text values', () => {
      const field = createTextInput({
        name: 'text',
        value: ` ${STRING} `
      })
      const form = createForm(undefined, [field])
      const r = parseForm(form, { trim: false })
      expect(r).toEqual({ text: ` ${STRING} ` })
    })

    it('parseForm(form, {trim: true}) should not trim password values', () => {
      const field = createPasswordInput({
        name: 'password',
        value: PASSWORD
      })
      const form = createForm(undefined, [field])
      const r = parseForm(form, { trim: true })
      expect(r).toEqual({ password: PASSWORD })
    })
  })
})

describe('parseNumber()', () => {
  it('parseNumber(null) should return null', () => {
    expect(parseNumber(null)).toEqual(null)
  })

  it(`parseNumber("${FLOAT_STRING}") should return a float`, () => {
    const r = parseNumber(FLOAT_STRING)
    expect(r).toEqual(FLOAT)
    expect(r).not.toBeNaN()
  })

  it(`parseNumber("-${FLOAT_STRING}") should return a negative float`, () => {
    const r = parseNumber(`-${FLOAT_STRING}`)
    expect(r).toEqual(-FLOAT)
  })

  it(`parseNumber("+${FLOAT_STRING}") should return a positive float`, () => {
    const r = parseNumber(`+${FLOAT_STRING}`)
    expect(r).toEqual(parseFloat(FLOAT_STRING))
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
    expect(trim({
      a: ' a ',
      b: 'b ',
      c: ' c'
    }))
      .toEqual({
        a: 'a',
        b: 'b',
        c: 'c'
      })
  })
})
