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

export default {

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
      const opening = str.match(/\[/g).length;
      const closing = str.match(/]/g).length;

      if (opening !== closing) {
        if (opening > closing) {
          throw new SyntaxError(`Missing closing ] in ${str}`);
        } else {
          throw new SyntaxError(`Missing opening [ in ${str}`);
        }
      }
    }

    const index = str.indexOf('[');

    if (index !== -1) {
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

  isButton(field) {
    return field && (field.localName === 'button' || this.contains(['button', 'reset', 'submit'], field.type));
  },

  isCheckableField(field) {
    return field && (this.contains(['checkbox', 'radio'], field.type));
  },

  /**
   * Returns form values as an object
   * @param form
   * @param options
   * @return {{}}
   */
  parseForm(form, options) {
    if (!(form instanceof HTMLFormElement)) {
      throw new TypeError('form is not an HTMLFormElement');
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
      console.warn('option "parseValues" is deprecated, rename it to "dynamicTyping" instead');
      opt.dynamicTyping = opt.parseValues;
    }
    if (typeof opt.smartParsing !== 'undefined') {
      console.warn('option "smartParsing" is deprecated, rename it to "smartTyping" instead');
      opt.smartTyping = opt.smartParsing;
    }
    if (typeof opt.trimValues !== 'undefined') {
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
      if (opt.trim && !this.contains(['password'], field.type)) {
        if (value instanceof Array) {
          for (let k = 0; k < value.length; k += 1) {
            if (typeof value[k] === 'string' && value[k].length) {
              value[k] = value[k].trim();
            }
          }
        } else if (typeof value === 'string' && value.length) {
          value = value.trim();
        }
      }

      // Replaces empty strings with null
      if (opt.nullify) {
        if (value instanceof Array) {
          for (let k = 0; k < value.length; k += 1) {
            if (value[k] === '') {
              value[k] = null;
            }
          }
        } else if (value === '') {
          value = null;
        }
      }

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
   * Returns a boolean
   * @param value
   * @return {boolean|null}
   */
  parseBoolean(value) {
    let bool = value;

    if (typeof bool === 'string') {
      bool = bool.trim();
    }
    if (/^true$/i.test(bool)) {
      return true;
    }
    if (/^false$/i.test(bool)) {
      return false;
    }
    return null;
  },

  /**
   * Returns a number
   * @param value
   * @return {number|null}
   */
  parseNumber(value) {
    let number = value;

    if (typeof number === 'string') {
      number = number.trim();
      // Replace comma with dot (for languages where numbers contain a comma instead of a dot)
      number = number.replace(/,/g, '.');
    }
    // Float
    if (/^[+-]?[0-9]*[.,][0-9]+$/.test(number)) {
      return Number.parseFloat(number);
    }
    // Integer
    if (/^[+-]?[0-9]+$/.test(number)) {
      return Number.parseInt(number, 10);
    }
    return null;
  },

  /**
   * Returns the typed value of a string value
   * @param value
   * @param type
   * @returns {string|number|boolean|null}
   */
  parseValue(value, type = 'auto') {
    let val = value;

    if (typeof val === 'string') {
      if (val.length > 0) {
        switch (type) {
          case 'auto': {
            const bool = this.parseBoolean(val);

            if (typeof bool === 'boolean') {
              val = bool;
              break;
            }

            const number = this.parseNumber(val);

            if (typeof number === 'number') {
              val = number;
            }
            break;
          }

          case 'boolean':
            val = this.parseBoolean(val);
            break;

          case 'number':
            val = this.parseNumber(val);
            break;

          case 'string':
            break;

          default:
        }
      }
    }
    return val;
  },
};
