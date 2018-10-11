/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import FormParser from '../src/index';
import TestUtils from './lib';

// Define constants
const FALSE = 'false';
const TRUE = 'true';
const FLOAT = 9.99;
const FLOAT_STRING = '09.99';
const FLOAT_STRING_COMMA = '09,99';
const INTEGER = 100;
const INTEGER_STRING = '0100';
const STRING = 'hello';

describe('FormParser', () => {
  it('should be importable from package', () => {
    expect(typeof FormParser.parseForm).toEqual('function');
  });
});

describe('buildObject()', () => {
  // Testing with arrays
  test(`buildObject("[]", "${STRING}", null) should return ["${STRING}"]`, () => {
    const r = FormParser.buildObject('[]', STRING, null);
    expect(r).toEqual([STRING]);
  });

  test(`buildObject("[0]", "${STRING}", null) should return ["${STRING}"]`, () => {
    const r = FormParser.buildObject('[0]', STRING, null);
    expect(r).toEqual([STRING]);
  });

  test(`buildObject("[2]", "${STRING}", null) should return [undefined, undefined, "${STRING}"]`, () => {
    const r = FormParser.buildObject('[2]', STRING, null);
    expect(r).toEqual([undefined, undefined, STRING]);
  });

  test(`buildObject("[][]", "${STRING}", null) should return [["${STRING}"]]`, () => {
    const r = FormParser.buildObject('[][]', STRING, null);
    expect(r).toEqual([[STRING]]);
  });

  test(`buildObject("[][0]", "${STRING}", null) should return [["${STRING}"]]`, () => {
    const r = FormParser.buildObject('[][0]', STRING, null);
    expect(r).toEqual([[STRING]]);
  });

  test(`buildObject("[][2]", "${STRING}", null) should return [[undefined,undefined,${STRING}]]`, () => {
    const r = FormParser.buildObject('[][2]', STRING, null);
    expect(r).toEqual([[undefined, undefined, STRING]]);
  });

  test(`buildObject("[2][]", "${STRING}", null) should return [undefined,undefined,[${STRING}]]`, () => {
    const r = FormParser.buildObject('[2][]', STRING, null);
    expect(r).toEqual([undefined, undefined, [STRING]]);
  });

  test(`buildObject("[2][2]", "${STRING}", null) should return [undefined,undefined,[undefined,undefined, ${STRING}]]`, () => {
    const r = FormParser.buildObject('[2][2]', STRING, null);
    expect(r).toEqual([undefined, undefined, [undefined, undefined, STRING]]);
  });

  // Removing index

  test('buildObject("a[0]", undefined, {a:[1,2]}) should return {a:[2]}}', () => {
    const r = FormParser.buildObject('a[0]', undefined, { a: [1, 2] });
    expect(r).toEqual({ a: [2] });
  });

  test('buildObject("a[b]", undefined, {a:{b:1,c:2}}) should return {a:{c:2}}', () => {
    const r = FormParser.buildObject('a[b]', undefined, { a: { b: 1, c: 2 } });
    expect(r).toEqual({ a: { c: 2 } });
  });

  // Testing with object

  test(`buildObject("[a]", ${INTEGER}, null) should return {a: ${INTEGER}}`, () => {
    const r = FormParser.buildObject('[a]', INTEGER, null);
    expect(r).toEqual({ a: INTEGER });
  });

  test(`buildObject("[a]", "${STRING}", null) should return {a: "${STRING}"}`, () => {
    const r = FormParser.buildObject('[a]', STRING, null);
    expect(r).toEqual({ a: STRING });
  });

  // Root field

  test(`buildObject("a[b]", "${STRING}", null) should return {a:{b:"${STRING}"}}`, () => {
    const r = FormParser.buildObject('a[b]', STRING, null);
    expect(r).toEqual({ a: { b: STRING } });
  });

  test(`buildObject("a[b]", "${STRING}", {}) should return {a:{b:"${STRING}"}}`, () => {
    const r = FormParser.buildObject('a[b]', STRING, {});
    expect(r).toEqual({ a: { b: STRING } });
  });

  test(`buildObject("a[b]", "${STRING}", {a:{}}) should return {a:{b:"${STRING}"}}`, () => {
    const r = FormParser.buildObject('a[b]', STRING, { a: {} });
    expect(r).toEqual({ a: { b: STRING } });
  });

  // Single field

  test(`buildObject("a", "${STRING}", null) should return {a:"${STRING}"}`, () => {
    const r = FormParser.buildObject('a', STRING, null);
    expect(r).toEqual({ a: STRING });
  });

  test(`buildObject("a", "${STRING}", {}) should return {a:"${STRING}"}`, () => {
    const r = FormParser.buildObject('a', STRING, {});
    expect(r).toEqual({ a: STRING });
  });

  test(`buildObject("a", "${STRING}", {a:null}) should return {a:"${STRING}"}`, () => {
    const r = FormParser.buildObject('a', STRING, { a: null });
    expect(r).toEqual({ a: STRING });
  });

  // Testing with array and object

  test(`buildObject("[a][]", "${STRING}", null) should return {a:["${STRING}"]}`, () => {
    const r = FormParser.buildObject('[a][]', STRING, null);
    expect(r).toEqual({ a: [STRING] });
  });

  test(`buildObject("[a][0]", "${STRING}", null) should return {a:["${STRING}"]}`, () => {
    const r = FormParser.buildObject('[a][0]', STRING, null);
    expect(r).toEqual({ a: [STRING] });
  });

  test(`buildObject("[a][2]", "${STRING}", null) should return {a:[undefined,undefined,"${STRING}"]}`, () => {
    const r = FormParser.buildObject('[a][2]', STRING, null);
    expect(r).toEqual({ a: [undefined, undefined, STRING] });
  });

  test(`buildObject("[a][][b][][text]", "${STRING}", null) should return {a:[{b:[{text:"${STRING}"]}]}`, () => {
    const r = FormParser.buildObject('[a][][b][][text]', STRING, null);
    expect(r).toEqual({ a: [{ b: [{ text: STRING }] }] });
  });

  test(`buildObject("[a][][b][0][c][2][text]", "${STRING}", null) should return {a:[{b:[{c:[undefined,undefined,{text:"${STRING}"}]}]}]}`, () => {
    const r = FormParser.buildObject('[a][][b][0][c][2][text]', STRING, null);
    expect(r).toEqual({ a: [{ b: [{ c: [undefined, undefined, { text: STRING }] }] }] });
  });

  const obj = { a: [0, 1, 2] };
  test(`buildObject("[a][]", "${STRING}", ${JSON.stringify(obj)}) should return {a:[0,1,2,"${STRING}"]}`, () => {
    const r = FormParser.buildObject('[a][]', STRING, obj);
    expect(r).toEqual({ a: [0, 1, 2, STRING] });
  });

  const obj1 = { a: [0, 1, 2] };
  test(`buildObject("[a][1]", "${STRING}", ${JSON.stringify(obj1)}) should return {a:[0,"${STRING}",2]}`, () => {
    const r = FormParser.buildObject('[a][1]', STRING, obj1);
    expect(r).toEqual({ a: [0, STRING, 2] });
  });

  const obj2 = { a: [0, 1, 2] };
  test(`buildObject("[b][text]", "${STRING}", ${JSON.stringify(obj2)}) should return {a:[0,1,2],b:{text:"${STRING}"}}`, () => {
    const r = FormParser.buildObject('[b][text]', STRING, obj2);
    expect(r).toEqual({ a: [0, 1, 2], b: { text: STRING } });
  });
});

describe('contains()', () => {
  it('contains([], null) should return false', () => {
    expect(FormParser.contains([], null)).toEqual(false);
  });

  it('contains([null], null) should return true', () => {
    expect(FormParser.contains([null], null)).toEqual(true);
  });

  it('contains(["a"], null) should return false', () => {
    expect(FormParser.contains(['a'], null)).toEqual(false);
  });

  it('contains(["a", null], "a") should return true', () => {
    expect(FormParser.contains(['a', null], 'a')).toEqual(true);
  });

  it('contains([true], true) should return true', () => {
    expect(FormParser.contains([true], true)).toEqual(true);
  });

  it('contains([false], false) should return true', () => {
    expect(FormParser.contains([false], false)).toEqual(true);
  });

  it('contains([1], "1") should return false', () => {
    expect(FormParser.contains([1], '1')).toEqual(false);
  });

  it('contains([1], 1) should return true', () => {
    expect(FormParser.contains([1], 1)).toEqual(true);
  });
});

describe('nullify()', () => {
  it('should replace empty string by null', () => {
    expect(FormParser.nullify(''))
      .toEqual(null);
  });

  it('should replace empty strings by null in array', () => {
    expect(FormParser.nullify(['', 'b', null]))
      .toEqual([null, 'b', null]);
  });

  it('should replace empty strings by null in object', () => {
    expect(FormParser.nullify({ a: '', b: 'b', c: null }))
      .toEqual({ a: null, b: 'b', c: null });
  });
});

describe('parseBoolean()', () => {
  test('parseBoolean(null) should return null', () => {
    expect(FormParser.parseBoolean(null)).toEqual(null);
  });

  test('parseBoolean(undefined) should return null', () => {
    expect(FormParser.parseBoolean(undefined)).toEqual(null);
  });

  test('parseBoolean(true) should return true', () => {
    expect(FormParser.parseBoolean(true)).toEqual(true);
  });

  test(`parseBoolean("${TRUE}") should return true`, () => {
    expect(FormParser.parseBoolean(TRUE)).toEqual(true);
  });

  test('parseBoolean(false) should return false', () => {
    expect(FormParser.parseBoolean(false)).toEqual(false);
  });

  test(`parseBoolean("${FALSE}") should return false`, () => {
    expect(FormParser.parseBoolean(FALSE)).toEqual(false);
  });
});

describe('parseField()', () => {
  it('should return a number', () => {
    const field = TestUtils.createNumberInput({ value: '010' });
    expect(FormParser.parseField(field))
      .toEqual(10);
  });

  it('should return a boolean', () => {
    const field = TestUtils.createCheckbox({
      checked: true,
      dataset: { type: 'boolean' },
      value: 'true',
    });
    expect(FormParser.parseField(field))
      .toEqual(true);
  });

  it('should return an array of numbers', () => {
    const field = TestUtils.createSelect({
      dataset: { type: 'number' },
      multiple: true,
      options: [
        { value: '123', selected: true },
        { value: '456', selected: true },
        { value: '789', selected: true },
        { value: '000' },
      ],
    });
    expect(FormParser.parseField(field))
      .toEqual([123, 456, 789]);
  });
});

describe('parseForm()', () => {
  test('should return fields with a name containing dashes', () => {
    const form = TestUtils.createForm();
    form.appendChild(TestUtils.createTextarea({
      name: 'x-custom-field',
      value: STRING,
    }));

    const r = FormParser.parseForm(form, { dynamicTyping: true, smartTyping: true });
    expect(r).toEqual({ 'x-custom-field': STRING });
  });

  test('should return fields with a name of one character long', () => {
    const form = TestUtils.createForm();
    form.appendChild(TestUtils.createHiddenInput({
      dataset: { type: 'number' },
      name: 'x',
      value: '-149.345564',
      readonly: true,
      required: true,
    }));

    const r = FormParser.parseForm(form, { dynamicTyping: true, smartTyping: true });
    expect(r).toEqual({ x: -149.345564 });
  });

  test('should return empty array if no checkbox is checked', () => {
    const form = TestUtils.createForm();
    form.appendChild(TestUtils.createCheckbox({
      name: 'items[]',
      value: 0,
    }));
    form.appendChild(TestUtils.createCheckbox({
      name: 'items[]',
      value: 1,
    }));

    const r = FormParser.parseForm(form, { dynamicTyping: true, smartTyping: true });
    expect(r).toEqual({ items: [] });
  });

  describe('Parsing fields with options {dynamicTyping: true, smartTyping: true}', () => {
    test('parseForm(form, options) should not return values of unknown fields', () => {
      const form = TestUtils.createForm();
      form.appendChild(TestUtils.createTextInput({
        value: STRING,
      }));

      const r = FormParser.parseForm(form, { dynamicTyping: true, smartTyping: true });
      expect(r).toEqual({});
    });

    test('parseForm(form, options) should parse values based on data-type attribute if present', () => {
      const form = TestUtils.createForm();
      form.appendChild(TestUtils.createNumberInput({
        dataset: { type: 'string' },
        name: 'number',
        value: INTEGER_STRING,
      }));

      const r = FormParser.parseForm(form, { dynamicTyping: true, smartTyping: true });
      expect(r).toEqual({ number: INTEGER_STRING });
    });

    test('parseForm(form, options) should return values of checked checkboxes', () => {
      const form = TestUtils.createForm();
      form.appendChild(TestUtils.createCheckbox({
        checked: true,
        name: 'checkboxes[]',
        value: 'A',
      }));
      form.appendChild(TestUtils.createCheckbox({
        name: 'checkboxes[]',
        value: 'B',
      }));
      form.appendChild(TestUtils.createCheckbox({
        checked: true,
        name: 'checkboxes[]',
        value: 'C',
      }));

      const r = FormParser.parseForm(form, { dynamicTyping: true, smartTyping: true });
      expect(r).toEqual({
        checkboxes: [
          form.elements['0'].value,
          form.elements['2'].value,
        ],
      });
    });

    test('parseForm(form, options) should return values of checked radios', () => {
      const form = TestUtils.createForm();
      form.appendChild(TestUtils.createRadio({
        name: 'radio',
        value: 'A',
      }));
      form.appendChild(TestUtils.createRadio({
        checked: true,
        name: 'radio',
        value: 'B',
      }));

      const r = FormParser.parseForm(form, { dynamicTyping: true, smartTyping: true });
      expect(r).toEqual({ radio: form.elements['1'].value });
    });

    test('parseForm(form, options) should not return values of unchecked fields', () => {
      const form = TestUtils.createForm();
      form.appendChild(TestUtils.createRadio({
        dataset: { type: 'boolean' },
        name: 'options[checkbox]',
        value: 'true',
      }));
      form.appendChild(TestUtils.createRadio({
        dataset: { type: 'number' },
        name: 'options[choice]',
        value: '1',
      }));
      form.appendChild(TestUtils.createRadio({
        dataset: { type: 'number' },
        name: 'options[choice]',
        value: '2',
      }));
      form.appendChild(TestUtils.createRadio({
        dataset: { type: 'number' },
        name: 'options[radio]',
        value: '1',
      }));
      form.appendChild(TestUtils.createRadio({
        dataset: { type: 'number' },
        name: 'options[radio]',
        value: '2',
      }));

      const r = FormParser.parseForm(form, { dynamicTyping: true, smartTyping: true });
      expect(r).toEqual({
        options: {},
      });
    });

    test('parseForm(form, options) should return values of file inputs', () => {
      const form = TestUtils.createForm();
      form.appendChild(TestUtils.createFileInput({
        name: 'file',
      }));

      const r = FormParser.parseForm(form, {
        dynamicTyping: true,
        nullify: true,
        smartTyping: true,
      });
      expect(r).toEqual({ file: null });
    });

    test('parseForm(form, options) should return values of hidden inputs', () => {
      const form = TestUtils.createForm();
      form.appendChild(TestUtils.createHiddenInput({
        name: 'hidden',
        value: STRING,
      }));

      const r = FormParser.parseForm(form, { dynamicTyping: true, smartTyping: true });
      expect(r).toEqual({ hidden: STRING });
    });

    test('parseForm(form, options) should return values of number inputs', () => {
      const form = TestUtils.createForm();
      form.appendChild(TestUtils.createNumberInput({
        name: 'number',
        value: INTEGER,
      }));

      const r = FormParser.parseForm(form, { dynamicTyping: true, smartTyping: true });
      expect(r).toEqual({ number: INTEGER });
    });

    test('parseForm(form, options) should return values of email inputs', () => {
      const form = TestUtils.createForm();
      form.appendChild(TestUtils.createTextInput({
        name: 'email',
        type: 'email',
        value: STRING,
      }));

      const r = FormParser.parseForm(form, { dynamicTyping: true, smartTyping: true });
      expect(r).toEqual({ email: STRING });
    });

    test('parseForm(form, options) should return values of password inputs', () => {
      const form = TestUtils.createForm();
      form.appendChild(TestUtils.createPasswordInput({
        name: 'password',
        value: STRING,
      }));

      const r = FormParser.parseForm(form, { dynamicTyping: true, smartTyping: true });
      expect(r).toEqual({ password: STRING });
    });

    test('parseForm(form, options) should return values of single select lists', () => {
      const form = TestUtils.createForm();
      form.appendChild(TestUtils.createSelect({
        name: 'select',
        options: [
          { value: 'A' },
          { value: 'B', selected: true },
        ],
      }));

      const r = FormParser.parseForm(form, { dynamicTyping: true, smartTyping: true });
      expect(r).toEqual({ select: 'B' });
    });

    test('parseForm(form, options) should return values of multiple select lists', () => {
      const form = TestUtils.createForm();
      form.appendChild(TestUtils.createSelect({
        multiple: true,
        name: 'select',
        options: [
          { value: 'A' },
          { value: 'B', selected: true },
          { value: 'C', selected: true },
        ],
      }));

      const r = FormParser.parseForm(form, { dynamicTyping: true, smartTyping: true });
      expect(r).toEqual({ select: ['B', 'C'] });
    });

    test('parseForm(form, options) should return values of text inputs', () => {
      const form = TestUtils.createForm();
      form.appendChild(TestUtils.createTextInput({
        name: 'text',
        value: STRING,
      }));

      const r = FormParser.parseForm(form, { dynamicTyping: true, smartTyping: true });
      expect(r).toEqual({ text: STRING });
    });

    test('parseForm(form, options) should return values of textarea fields', () => {
      const form = TestUtils.createForm();
      form.appendChild(TestUtils.createTextarea({
        name: 'textarea',
        value: STRING,
      }));

      const r = FormParser.parseForm(form, { dynamicTyping: true, smartTyping: true });
      expect(r).toEqual({ textarea: STRING });
    });
  });

  describe('Parsing options', () => {
    describe('cleanFunction option', () => {
      test('parseForm(form, {cleanFunction: Function}) should execute clean function on string values', () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
          name: 'text',
          value: '<script src="http://hacked.net"></script>',
        }));

        const r = FormParser.parseForm(form, {
          cleanFunction(value) {
            return value.replace(/<\/?[^>]+>/gm, '');
          },
        });
        expect(r).toEqual({ text: '' });
      });

      test('parseForm(form, {filterFunction: Function}) should return allowed fields only', () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({ name: 'text', value: 'test' }));
        form.appendChild(TestUtils.createNumberInput({ name: 'num', value: 2 }));

        const r = FormParser.parseForm(form, {
          filterFunction(field) {
            return field.type === 'text';
          },
        });
        expect(r).toEqual({ text: 'test' });
      });

      test('parseForm(form, {cleanFunction: null}) should not execute clean function on string values', () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
          name: 'text',
          value: '<script src="http://hacked.net"></script>',
        }));

        const r = FormParser.parseForm(form, {
          cleanFunction: null,
        });
        expect(r).toEqual({ text: '<script src="http://hacked.net"></script>' });
      });
    });

    describe('ignoreButtons option', () => {
      test('parseForm(form, {ignoreButtons: true}) should not return values of buttons', () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createButton({
          name: 'button',
          type: 'button',
          value: 'button',
        }));
        form.appendChild(TestUtils.createButton({
          name: 'reset',
          type: 'reset',
          value: 'reset',
        }));
        form.appendChild(TestUtils.createButton({
          name: 'submit',
          type: 'submit',
          value: 'submit',
        }));

        const r = FormParser.parseForm(form, { ignoreButtons: true });
        expect(r).toEqual({});
      });

      test('parseForm(form, {ignoreButtons: false}) should return values of buttons', () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createButton({
          name: 'button',
          type: 'button',
          value: 'button',
        }));
        form.appendChild(TestUtils.createButton({
          name: 'reset',
          type: 'reset',
          value: 'reset',
        }));
        form.appendChild(TestUtils.createButton({
          name: 'submit',
          type: 'submit',
          value: 'submit',
        }));

        const r = FormParser.parseForm(form, { ignoreButtons: false });
        expect(r).toEqual({
          button: 'button',
          reset: 'reset',
          submit: 'submit',
        });
      });
    });

    describe('ignoreDisabled option', () => {
      test('parseForm(form, {ignoreDisabled: true}) should not return disabled fields', () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
          disabled: true,
          name: 'disabled',
          value: STRING,
        }));

        const r = FormParser.parseForm(form, { ignoreDisabled: true });
        expect(r).toEqual({});
      });

      test('parseForm(form, {ignoreDisabled: false}) should return disabled fields', () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
          disabled: true,
          name: 'disabled',
          value: STRING,
        }));

        const r = FormParser.parseForm(form, { ignoreDisabled: false });
        expect(r).toEqual({ disabled: STRING });
      });
    });

    describe('ignoreEmpty option', () => {
      test('parseForm(form, {ignoreEmpty: true}) should not return empty fields', () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
          name: 'empty',
          value: '',
        }));

        const r = FormParser.parseForm(form, { ignoreEmpty: true });
        expect(r).toEqual({});
      });

      test('parseForm(form, {ignoreEmpty: false}) should return empty fields', () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
          name: 'empty',
          value: '',
        }));

        const r = FormParser.parseForm(form, { ignoreEmpty: false });
        expect(r).toEqual({ empty: null });
      });
    });

    describe('ignoreUnchecked option', () => {
      test('parseForm(form, {ignoreUnchecked: true}) should not return unchecked fields', () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createCheckbox({
          name: 'checkbox',
          value: STRING,
        }));

        const r = FormParser.parseForm(form, { ignoreUnchecked: true });
        expect(r).toEqual({});
      });

      test('parseForm(form, {ignoreUnchecked: false}) should return unchecked fields', () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createCheckbox({
          name: 'checkbox',
          value: STRING,
        }));

        const r = FormParser.parseForm(form, { ignoreUnchecked: false });
        expect(r).toEqual({ checkbox: null });
      });
    });

    describe('nullify option', () => {
      test('parseForm(form, {nullify: true}) should replace empty string with null', () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
          name: 'text',
          value: ' ',
        }));

        const r = FormParser.parseForm(form, { nullify: true, trim: true });
        expect(r).toEqual({ text: null });
      });

      test('parseForm(form, {nullify: false}) should not replace empty string with null', () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
          name: 'text',
          value: ' ',
        }));

        const r = FormParser.parseForm(form, { nullify: false, trim: true });
        expect(r).toEqual({ text: '' });
      });
    });

    describe('dynamicTyping option', () => {
      test('parseForm(form, {dynamicTyping: true, smartTyping: false}) should parse all values', () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
          dataset: { type: 'boolean' },
          name: 'bool_true',
          value: TRUE,
        }));
        form.appendChild(TestUtils.createTextInput({
          dataset: { type: 'boolean' },
          name: 'bool_false',
          value: FALSE,
        }));
        form.appendChild(TestUtils.createNumberInput({
          name: 'float',
          value: FLOAT_STRING,
        }));
        form.appendChild(TestUtils.createNumberInput({
          name: 'integer',
          value: INTEGER_STRING,
        }));

        const r = FormParser.parseForm(form, { dynamicTyping: true, smartTyping: false });
        expect(r).toEqual({
          bool_true: true,
          bool_false: false,
          float: FLOAT,
          integer: INTEGER,
        });
      });

      test('parseForm(form, {dynamicTyping: false}) should not parse any value', () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
          dataset: { type: 'boolean' },
          name: 'bool_true',
          value: TRUE,
        }));
        form.appendChild(TestUtils.createTextInput({
          name: 'bool_false',
          value: FALSE,
        }));
        form.appendChild(TestUtils.createNumberInput({
          name: 'float',
          value: FLOAT_STRING,
        }));
        form.appendChild(TestUtils.createNumberInput({
          dataset: { type: 'number' },
          name: 'integer',
          value: INTEGER_STRING,
        }));

        const r = FormParser.parseForm(form, { dynamicTyping: false });
        expect(r).toEqual({
          bool_true: TRUE,
          bool_false: FALSE,
          float: FLOAT_STRING,
          integer: INTEGER_STRING,
        });
      });
    });

    describe('smartTyping option', () => {
      test('parseForm(form, {smartTyping: true}) should parse values using type attribute', () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
          name: 'bool_true',
          value: TRUE,
        }));
        form.appendChild(TestUtils.createTextInput({
          dataset: { type: 'boolean' },
          name: 'bool_false',
          value: FALSE,
        }));
        form.appendChild(TestUtils.createNumberInput({
          name: 'float',
          value: FLOAT_STRING,
        }));
        form.appendChild(TestUtils.createTextInput({
          name: 'float_text',
          value: FLOAT_STRING,
        }));
        form.appendChild(TestUtils.createNumberInput({
          name: 'integer',
          value: INTEGER_STRING,
        }));
        form.appendChild(TestUtils.createTextInput({
          name: 'integer_text',
          value: INTEGER_STRING,
        }));

        const r = FormParser.parseForm(form, { dynamicTyping: true, smartTyping: true });
        expect(r).toEqual({
          bool_true: TRUE,
          bool_false: false,
          float: FLOAT,
          float_text: FLOAT_STRING,
          integer: INTEGER,
          integer_text: INTEGER_STRING,
        });
      });

      test('parseForm(form, {smartTyping: false}) should not parse values using type attribute', () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
          name: 'bool_true',
          value: TRUE,
        }));
        form.appendChild(TestUtils.createTextInput({
          dataset: { type: 'boolean' },
          name: 'bool_false',
          value: FALSE,
        }));
        form.appendChild(TestUtils.createNumberInput({
          name: 'float',
          value: FLOAT_STRING,
        }));
        form.appendChild(TestUtils.createTextInput({
          name: 'float_text',
          value: FLOAT_STRING,
        }));
        form.appendChild(TestUtils.createNumberInput({
          name: 'integer',
          value: INTEGER_STRING,
        }));
        form.appendChild(TestUtils.createTextInput({
          name: 'integer_text',
          value: INTEGER_STRING,
        }));

        const r = FormParser.parseForm(form, { dynamicTyping: true, smartTyping: false });
        expect(r).toEqual({
          bool_true: true,
          bool_false: false,
          float: FLOAT,
          float_text: FLOAT,
          integer: INTEGER,
          integer_text: INTEGER,
        });
      });
    });

    describe('trim option', () => {
      test('parseForm(form, {trim: true}) should trim text values', () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
          name: 'text',
          value: ` ${STRING} `,
        }));

        const r = FormParser.parseForm(form, { trim: true });
        expect(r).toEqual({ text: STRING });
      });

      test('parseForm(form, {trim: false}) should not trim text values', () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
          name: 'text',
          value: ` ${STRING} `,
        }));

        const r = FormParser.parseForm(form, { trim: false });
        expect(r).toEqual({ text: ` ${STRING} ` });
      });

      test('parseForm(form, {trim: true}) should not trim password values', () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createPasswordInput({
          name: 'password',
          value: ` ${STRING} `,
        }));

        const r = FormParser.parseForm(form, { trim: true });
        expect(r).toEqual({ password: ` ${STRING} ` });
      });
    });
  });

  describe('Fields excluded from parsing', () => {
    test('parseForm(form) should not parse email fields', () => {
      const form = TestUtils.createForm();
      form.appendChild(TestUtils.createTextInput({
        name: 'email',
        type: 'email',
        value: INTEGER_STRING,
      }));

      const r = FormParser.parseForm(form, { dynamicTyping: true });
      expect(r).toEqual({ email: INTEGER_STRING });
    });

    test('parseForm(form) should not parse file fields', () => {
      const form = TestUtils.createForm();
      form.appendChild(TestUtils.createFileInput({
        name: 'file',
      }));

      const r = FormParser.parseForm(form, {
        dynamicTyping: true,
        nullify: true,
      });
      expect(r).toEqual({ file: null });
    });

    test('parseForm(form) should not parse password fields', () => {
      const form = TestUtils.createForm();
      form.appendChild(TestUtils.createPasswordInput({
        name: 'password',
        value: INTEGER_STRING,
      }));

      const r = FormParser.parseForm(form, { dynamicTyping: true });
      expect(r).toEqual({ password: INTEGER_STRING });
    });

    test('parseForm(form) should not parse search fields', () => {
      const form = TestUtils.createForm();
      form.appendChild(TestUtils.createTextInput({
        name: 'search',
        type: 'search',
        value: INTEGER_STRING,
      }));

      const r = FormParser.parseForm(form, { dynamicTyping: true });
      expect(r).toEqual({ search: INTEGER_STRING });
    });

    test('parseForm(form) should not parse URL fields', () => {
      const form = TestUtils.createForm();
      form.appendChild(TestUtils.createTextInput({
        name: 'url',
        type: 'url',
        value: INTEGER_STRING,
      }));

      const r = FormParser.parseForm(form, { dynamicTyping: true });
      expect(r).toEqual({ url: INTEGER_STRING });
    });

    test('parseForm(form) should not parse textarea fields', () => {
      const form = TestUtils.createForm();
      form.appendChild(TestUtils.createTextarea({
        name: 'textarea',
        value: INTEGER_STRING,
      }));

      const r = FormParser.parseForm(form, { dynamicTyping: true });
      expect(r).toEqual({ textarea: INTEGER_STRING });
    });
  });
});

describe('parseNumber()', () => {
  test('parseNumber(null) should return null', () => {
    expect(FormParser.parseNumber(null)).toEqual(null);
  });

  test('parseNumber(undefined) should return null', () => {
    expect(FormParser.parseNumber(undefined)).toEqual(null);
  });

  test(`parseNumber(${FLOAT}) should return a float`, () => {
    expect(FormParser.parseNumber(FLOAT)).toEqual(FLOAT);
  });

  test(`parseNumber("${FLOAT_STRING}") should return a float`, () => {
    expect(FormParser.parseNumber(FLOAT_STRING)).toEqual(FLOAT);
  });

  test(`parseNumber("-${FLOAT_STRING}") should return a negative float`, () => {
    expect(FormParser.parseNumber(`-${FLOAT_STRING}`)).toEqual(-FLOAT);
  });

  test(`parseNumber("+${FLOAT_STRING}") should return a positive float`, () => {
    expect(FormParser.parseNumber(`+${FLOAT_STRING}`)).toEqual(FLOAT);
  });

  test(`parseNumber("${FLOAT_STRING_COMMA}") should return a float`, () => {
    expect(FormParser.parseNumber(FLOAT_STRING_COMMA)).toEqual(FLOAT);
  });

  test(`parseNumber(${INTEGER}) should return an integer`, () => {
    expect(FormParser.parseNumber(INTEGER)).toEqual(INTEGER);
  });

  test(`parseNumber("${INTEGER_STRING}") should return an integer`, () => {
    expect(FormParser.parseNumber(INTEGER_STRING)).toEqual(INTEGER);
  });

  test(`parseNumber("-${INTEGER_STRING}") should return a negative integer`, () => {
    expect(FormParser.parseNumber(`-${INTEGER_STRING}`)).toEqual(-INTEGER);
  });

  test(`parseNumber("+${INTEGER_STRING}") should return a positive integer`, () => {
    expect(FormParser.parseNumber(`+${INTEGER_STRING}`)).toEqual(INTEGER);
  });
});

describe('parseValue()', () => {
  test('parseValue() should return undefined', () => {
    expect(FormParser.parseValue()).toEqual(undefined);
  });

  test('parseValue(null) should return null', () => {
    expect(FormParser.parseValue(null)).toEqual(null);
  });

  test('parseValue("") should return an empty string', () => {
    expect(FormParser.parseValue('')).toEqual('');
  });

  test(`parseValue("${TRUE}") should return true`, () => {
    expect(FormParser.parseValue(TRUE)).toEqual(true);
  });

  test(`parseValue("${TRUE}", "auto") should return true`, () => {
    expect(FormParser.parseValue(TRUE, 'auto')).toEqual(true);
  });

  test(`parseValue("${TRUE}", "boolean") should return true`, () => {
    expect(FormParser.parseValue(TRUE, 'boolean')).toEqual(true);
  });

  test(`parseValue("${TRUE}", "number") should return null`, () => {
    expect(FormParser.parseValue(TRUE, 'number')).toEqual(null);
  });

  test(`parseValue("${TRUE}", "string") should return "true"`, () => {
    expect(FormParser.parseValue(TRUE, 'string')).toEqual(TRUE);
  });

  test(`parseValue("${FALSE}") should return false`, () => {
    expect(FormParser.parseValue(FALSE)).toEqual(false);
  });

  test(`parseValue("${FALSE}", "auto") should return false`, () => {
    expect(FormParser.parseValue(FALSE, 'auto')).toEqual(false);
  });

  test(`parseValue("${FALSE}", "boolean") should return false`, () => {
    expect(FormParser.parseValue(FALSE, 'boolean')).toEqual(false);
  });

  test(`parseValue("${FALSE}", "number") should return null`, () => {
    expect(FormParser.parseValue(FALSE, 'number')).toEqual(null);
  });

  test(`parseValue("${FALSE}", "string") should return "false"`, () => {
    expect(FormParser.parseValue(FALSE, 'string')).toEqual(FALSE);
  });

  test(`parseValue("${FLOAT_STRING}") should return ${FLOAT}`, () => {
    expect(FormParser.parseValue(FLOAT_STRING)).toEqual(FLOAT);
  });

  test(`parseValue("${FLOAT_STRING}", "auto") should return ${FLOAT}`, () => {
    expect(FormParser.parseValue(FLOAT_STRING, 'auto')).toEqual(FLOAT);
  });

  test(`parseValue("${FLOAT_STRING}", "boolean") should return null`, () => {
    expect(FormParser.parseValue(FLOAT_STRING, 'boolean')).toEqual(null);
  });

  test(`parseValue("${FLOAT_STRING}", "number") should return ${FLOAT}`, () => {
    expect(FormParser.parseValue(FLOAT_STRING, 'number')).toEqual(FLOAT);
  });

  test(`parseValue("${FLOAT_STRING}", "string") should return "${FLOAT}"`, () => {
    expect(FormParser.parseValue(FLOAT_STRING, 'string')).toEqual(FLOAT_STRING);
  });

  test(`parseValue("${INTEGER_STRING}") should return ${INTEGER}`, () => {
    expect(FormParser.parseValue(INTEGER_STRING)).toEqual(INTEGER);
  });

  test(`parseValue("${INTEGER_STRING}", "auto") should return ${INTEGER}`, () => {
    expect(FormParser.parseValue(INTEGER_STRING, 'auto')).toEqual(INTEGER);
  });

  test(`parseValue("${INTEGER_STRING}", "boolean") should return null`, () => {
    expect(FormParser.parseValue(INTEGER_STRING, 'boolean')).toEqual(null);
  });

  test(`parseValue("${INTEGER_STRING}", "number") should return ${INTEGER}`, () => {
    expect(FormParser.parseValue(INTEGER_STRING, 'number')).toEqual(INTEGER);
  });

  test(`parseValue("${INTEGER_STRING}", "string") should return "${INTEGER}"`, () => {
    expect(FormParser.parseValue(INTEGER_STRING, 'string')).toEqual(INTEGER_STRING);
  });

  test(`parseValue("${STRING}") should return "${STRING}"`, () => {
    expect(FormParser.parseValue(STRING)).toEqual(STRING);
  });

  test(`parseValue("${STRING}", "auto") should return "${STRING}"`, () => {
    expect(FormParser.parseValue(STRING, 'auto')).toEqual(STRING);
  });

  test(`parseValue("${STRING}", "boolean") should return null`, () => {
    expect(FormParser.parseValue(STRING, 'boolean')).toEqual(null);
  });

  test(`parseValue("${STRING}", "number") should return null`, () => {
    expect(FormParser.parseValue(STRING, 'number')).toEqual(null);
  });

  test(`parseValue("${STRING}", "string") should return "${STRING}"`, () => {
    expect(FormParser.parseValue(STRING, 'string')).toEqual(STRING);
  });

  describe('Parsing value with extra spaces', () => {
    test(`parseValue(" ${FALSE} ", "boolean") should return false`, () => {
      expect(FormParser.parseValue(` ${FALSE} `, 'boolean')).toEqual(false);
    });

    test(`parseValue(" ${TRUE} ", "boolean") should return true`, () => {
      expect(FormParser.parseValue(` ${TRUE} `, 'boolean')).toEqual(true);
    });

    test(`parseValue(" ${FLOAT_STRING} ", "number") should return "${FLOAT}"`, () => {
      expect(FormParser.parseValue(` ${FLOAT_STRING} `, 'number')).toEqual(FLOAT);
    });

    test(`parseValue(" ${FLOAT_STRING_COMMA} ", "number") should return "${FLOAT}"`, () => {
      expect(FormParser.parseValue(` ${FLOAT_STRING_COMMA} `, 'number')).toEqual(FLOAT);
    });

    test(`parseValue(" ${INTEGER_STRING} ", "number") should return "${INTEGER}"`, () => {
      expect(FormParser.parseValue(` ${INTEGER_STRING} `, 'number')).toEqual(INTEGER);
    });

    test(`parseValue(" ${STRING} ", "string") should return " ${STRING} "`, () => {
      expect(FormParser.parseValue(` ${STRING} `, 'string')).toEqual(` ${STRING} `);
    });
  });
});

describe('trim()', () => {
  it('should remove extra spaces', () => {
    expect(FormParser.trim(' hello '))
      .toEqual('hello');
  });

  it('should remove extra spaces in array', () => {
    expect(FormParser.trim([' a ', 'b ', ' c']))
      .toEqual(['a', 'b', 'c']);
  });

  it('should remove extra spaces in object', () => {
    expect(FormParser.trim({ a: ' a ', b: 'b ', c: ' c' }))
      .toEqual({ a: 'a', b: 'b', c: 'c' });
  });
});
