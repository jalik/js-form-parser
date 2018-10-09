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

import { extendRecursively } from '@jalik/extend';

const FormParser = {
  /**
   * Builds an object from a string (ex: [colors][0][code])
   * @param str
   * @param value
   * @param context
   * @return {*}
   */
  buildObject(str, value, context) {
    if (typeof str !== 'string' || str.length === 0) {
      return value;
    }

    let ctx = context;

    // Check missing brackets
    if (typeof ctx === 'undefined' || ctx === null) {
      const opening = (str.match(/\[/g) || []).length;
      const closing = (str.match(/]/g) || []).length;

      if (opening !== closing) {
        if (opening > closing) {
          throw new SyntaxError(`Missing closing ] in ${str}`);
        } else {
          throw new SyntaxError(`Missing opening [ in ${str}`);
        }
      }
    }

    const index = str.indexOf('[');

    if (index === -1) {
      ctx = this.buildObject(`[${str}]`, value, ctx);
    } else if (index > 0) {
      const rootField = str.substr(0, index);
      const subtree = str.substr(index);
      ctx = this.buildObject(`[${rootField}]${subtree}`, value, ctx);
    } else {
      const end = str.indexOf(']', index + 1);
      const subtree = str.substr(end + 1);
      const key = str.substring(index + 1, end);
      const keyLen = key.length;

      // Object
      if (keyLen && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
        if (typeof ctx === 'undefined' || ctx === null) {
          ctx = {};
        }
        const result = this.buildObject(subtree, value, ctx[key]);

        if (typeof result !== 'undefined') {
          ctx[key] = result;
        }
      } else {
        // Array
        if (typeof ctx === 'undefined' || ctx === null) {
          ctx = [];
        }
        // Dynamic index
        if (keyLen === 0) {
          const result = this.buildObject(subtree, value, ctx[key]);

          if (typeof result !== 'undefined') {
            ctx.push(result);
          }
        } else if (/^[0-9]+$/.test(key)) {
          // Static index
          const result = this.buildObject(subtree, value, ctx[key]);

          if (typeof result !== 'undefined') {
            ctx[Number.parseInt(key, 10)] = result;
          }
        }
      }
    }
    return ctx;
  },

  /**
   * Checks if value is in list
   * @param list
   * @param value
   * @return {boolean}
   */
  contains(list, value) {
    let result = false;

    if (list instanceof Array) {
      for (let i = 0; i < list.length; i += 1) {
        if (list[i] === value) {
          result = true;
          break;
        }
      }
    }
    return result;
  },

  /**
   * Checks if the field is a button
   * @param field
   * @return {*|boolean}
   */
  isButton(field) {
    return field && (field.localName === 'button' || this.contains(['button', 'reset', 'submit'], field.type));
  },

  /**
   * Checks if the field is checkable
   * @param field
   * @return {*|boolean}
   */
  isCheckableField(field) {
    return field && (this.contains(['checkbox', 'radio'], field.type));
  },

  /**
   * Replaces empty string by null value
   * @param value
   * @return {Object|string|Array|*}
   */
  nullify(value) {
    let newValue = value;

    if (newValue instanceof Array) {
      for (let i = 0; i < newValue.length; i += 1) {
        newValue[i] = this.nullify(newValue[i]);
      }
    } else if (typeof newValue === 'object' && newValue !== null) {
      const keys = Object.keys(newValue);

      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        newValue[key] = this.nullify(newValue[key]);
      }
    } else if (typeof newValue === 'string' && newValue === '') {
      newValue = null;
    }
    return newValue;
  },

  /**
   * Returns a boolean
   * @param value
   * @return {boolean|null}
   */
  parseBoolean(value) {
    let bool = value;

    if (typeof bool === 'string') {
      bool = bool.trim();
    }
    if (/^(true|1)$/i.test(bool)) {
      return true;
    }
    if (/^(false|0)$/i.test(bool)) {
      return false;
    }
    return null;
  },

  /**
   * Returns the parsed value of the field
   * @param field
   * @param options
   * @return {*}
   */
  parseField(field, options) {
    // Check field instance
    if (!(field instanceof HTMLElement)) {
      throw new TypeError('field is not an instance of HTMLElement');
    }
    // Check field name
    if (!this.contains(['button', 'input', 'select', 'textarea'], field.localName)) {
      throw new TypeError('field is not a form field (button, input, select, textarea)');
    }

    // Set default options
    const opt = extendRecursively({
      dynamicTyping: true,
      nullify: true,
      smartTyping: true,
      trim: true,
    }, options);

    const isCheckable = this.isCheckableField(field);
    let { value } = field;

    // Fetch value from special fields
    switch (field.localName) {
      case 'input':
        if (isCheckable) {
          // Keep value only if element is checked
          value = field.checked ? value : undefined;
        }
        break;
      case 'select':
        if (field.multiple) {
          value = [];

          // Collect values of selected options
          if (field.options instanceof HTMLCollection) {
            for (let o = 0; o < field.options.length; o += 1) {
              if (field.options[o].selected) {
                value.push(field.options[o].value);
              }
            }
          }
        }
        break;
      default:
    }

    if (opt.dynamicTyping) {
      // Parse value excepted for special fields
      if ((!isCheckable || field.checked)
        && !this.contains(['email', 'file', 'password', 'search', 'url'], field.type)
        && !this.contains(['textarea'], field.localName)) {
        // Parse value using the "data-type" attribute
        if (field.dataset && field.dataset.type) {
          switch (field.dataset.type) {
            case 'auto':
              if (value instanceof Array) {
                for (let k = 0; k < value.length; k += 1) {
                  value[k] = this.parseValue(value[k]);
                }
              } else {
                value = this.parseValue(value);
              }
              break;

            case 'boolean':
              if (value instanceof Array) {
                for (let k = 0; k < value.length; k += 1) {
                  value[k] = this.parseBoolean(value[k]);
                }
              } else {
                value = this.parseBoolean(value);
              }
              break;

            case 'number':
              if (value instanceof Array) {
                for (let k = 0; k < value.length; k += 1) {
                  value[k] = this.parseNumber(value[k]);
                }
              } else {
                value = this.parseNumber(value);
              }
              break;

            case 'string':
              // Keep value as string
              break;

            default:
              // eslint-disable-next-line no-console
              console.warn(`unknown data-type "${field.dataset.type}" for field "${field.name}"`);
          }
        } else if (opt.smartTyping) {
          // Parse value using the "type" attribute
          switch (field.type) {
            case 'number':
            case 'range':
              if (value instanceof Array) {
                for (let k = 0; k < value.length; k += 1) {
                  value[k] = this.parseNumber(value[k]);
                }
              } else {
                value = this.parseNumber(value);
              }
              break;
            default:
          }
        } else if (value instanceof Array) {
          // Parse value using regular expression
          for (let k = 0; k < value.length; k += 1) {
            value[k] = this.parseValue(value[k]);
          }
        } else {
          value = this.parseValue(value);
        }
      }
    }

    // Removes extra spaces
    if (opt.trim && field.type !== 'password') {
      value = this.trim(value);
    }
    // Replaces empty strings with null
    if (opt.nullify) {
      value = this.nullify(value);
    }
    return value;
  },

  /**
   * Returns form values as an object
   * @param form
   * @param options
   * @return {object}
   */
  parseForm(form, options) {
    if (!(form instanceof HTMLFormElement)) {
      throw new TypeError('form is not an instance of HTMLFormElement');
    }

    // Default options
    const opt = extendRecursively({
      cleanFunction: null,
      dynamicTyping: true,
      filterFunction: null,
      ignoreButtons: true,
      ignoreDisabled: true,
      ignoreEmpty: false,
      ignoreUnchecked: false,
      nullify: true,
      smartTyping: true,
      trim: true,
    }, options);

    // Check deprecated options
    if (typeof opt.parseValues !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn('option "parseValues" is deprecated, rename it to "dynamicTyping" instead');
      opt.dynamicTyping = opt.parseValues;
    }
    if (typeof opt.smartParsing !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn('option "smartParsing" is deprecated, rename it to "smartTyping" instead');
      opt.smartTyping = opt.smartParsing;
    }
    if (typeof opt.trimValues !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn('option "trimValues" is deprecated, rename it to "trim" instead');
      opt.trim = opt.trimValues;
    }

    const fields = {};
    const { elements } = form;

    for (let i = 0; i < elements.length; i += 1) {
      const field = elements[i];
      const isButton = this.isButton(field);
      const isCheckable = this.isCheckableField(field);

      // Ignore element without a valid name
      if (typeof field.name !== 'string' || field.name.length < 1) {
        // eslint-disable-next-line
        continue;
      }
      // Ignore non-form element
      if (!this.contains(['button', 'input', 'select', 'textarea'], field.localName)) {
        // eslint-disable-next-line
        continue;
      }
      // Ignore buttons
      if (opt.ignoreButtons && isButton) {
        // eslint-disable-next-line
        continue;
      }
      // Ignore disabled element
      if (opt.ignoreDisabled && field.disabled) {
        // eslint-disable-next-line
        continue;
      }
      // Ignore unchecked element
      if (opt.ignoreUnchecked && (isCheckable && !field.checked)) {
        // eslint-disable-next-line
        continue;
      }
      // Ignore element based on filter
      if (typeof opt.filterFunction === 'function' && opt.filterFunction(field) !== true) {
        // eslint-disable-next-line
        continue;
      }

      // Parse field value
      let value = this.parseField(field, opt);

      // Execute custom clean function
      if (typeof opt.cleanFunction === 'function') {
        if (value instanceof Array) {
          for (let k = 0; k < value.length; k += 1) {
            if (typeof value[k] === 'string' && value[k].length) {
              value[k] = opt.cleanFunction(value[k], field);
            }
          }
        } else if (typeof value === 'string' && value.length) {
          value = opt.cleanFunction(value, field);
        }
      }

      // Ignore empty value
      if (opt.ignoreEmpty && (value === '' || value === null || typeof value === 'undefined')) {
        // eslint-disable-next-line
        continue;
      }

      let { name } = field;

      // Handle multiple select specific case
      if (field.multiple) {
        name = name.replace(/\[]$/g, '');
      }

      // Reconstruct array or object
      if (name.indexOf('[') !== -1) {
        const rootName = name.substr(0, name.indexOf('['));
        const tree = name.substr(name.indexOf('['));
        fields[rootName] = this.buildObject(tree, value, fields[rootName]);
        // eslint-disable-next-line
        continue;
      }

      // Add field to list
      if (isCheckable) {
        if (field.checked) {
          fields[name] = value;
        } else if (typeof fields[name] === 'undefined') {
          fields[name] = null;
        }
      } else {
        fields[name] = value;
      }
    }
    return fields;
  },

  /**
   * Returns a number
   * @param value
   * @return {number|null}
   */
  parseNumber(value) {
    let number = value;

    if (typeof value !== 'number') {
      if (typeof value === 'string') {
        // Remove spaces
        number = value.replace(/ /g, '');
      }

      if (/^[+-]?[0-9]*[.,][0-9]+$/.test(number)) {
        // Replace comma with dot (for languages where number contain a comma instead of a dot)
        number = Number.parseFloat(String(number).replace(/,/g, '.'));
      } else if (/^[+-]?[0-9]+$/.test(number)) {
        number = Number.parseInt(number, 10);
      } else {
        number = null;
      }
    }
    return number;
  },

  /**
   * Returns the typed value of a string value
   * @param value
   * @param type
   * @returns {string|number|boolean|null}
   */
  parseValue(value, type = 'auto') {
    let newVal = value;

    if (typeof newVal === 'string') {
      if (newVal.length > 0) {
        switch (type) {
          case 'auto': {
            const bool = this.parseBoolean(newVal);

            if (typeof bool === 'boolean') {
              newVal = bool;
              break;
            }

            const number = this.parseNumber(newVal);

            if (typeof number === 'number') {
              newVal = number;
            }
            break;
          }
          case 'boolean':
            newVal = this.parseBoolean(newVal);
            break;
          case 'number':
            newVal = this.parseNumber(newVal);
            break;
          case 'string':
            break;
          default:
        }
      }
    }
    return newVal;
  },

  /**
   * Removes extra spaces
   * @param value
   * @return {Object|string|Array|*}
   */
  trim(value) {
    let newValue = value;

    if (newValue instanceof Array) {
      for (let i = 0; i < newValue.length; i += 1) {
        newValue[i] = this.trim(newValue[i]);
      }
    } else if (typeof newValue === 'object' && newValue !== null) {
      const keys = Object.keys(newValue);

      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        newValue[key] = this.trim(newValue[key]);
      }
    } else if (typeof newValue === 'string' && newValue.length > 0) {
      newValue = newValue.trim();
    }
    return newValue;
  },
};

export default FormParser;
