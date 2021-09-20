/*
 * The MIT License (MIT)
 * Copyright (c) 2021 Karl STEIN
 */

/**
 * Builds an object from a string (ex: [colors][0][code])
 * @param str
 * @param value
 * @param context
 * @return {*}
 */
export function buildObject(str, value, context) {
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
    // Field without brackets and without attribute
    // ex: customField
    ctx = buildObject(`[${str}]`, value, ctx);
  } else if (index > 0) {
    // Field without brackets and with attribute
    // ex: customField[attr]
    const rootField = str.substr(0, index);
    const subtree = str.substr(index);
    ctx = buildObject(`[${rootField}]${subtree}`, value, ctx);
  } else {
    // Field with brackets
    // ex: [customField]
    const end = str.indexOf(']', index + 1);
    const subtree = str.substr(end + 1);
    let key = str.substring(index + 1, end);

    // Object attribute
    // ex: [customField1] or ["10"] or ['10']
    if (key.length > 0 && (!/^\d+$/.test(key) || /^(["'])[^"']+\1$/.test(key))) {
      // Remove quotes in key
      key = key.replace(/^["']/, '').replace(/["']$/, '');

      // Create empty object if context is not defined
      if (typeof ctx === 'undefined' || ctx === null) {
        ctx = {};
      }
      const result = buildObject(subtree, value, ctx[key]);

      if (typeof result !== 'undefined') {
        // Put value in attribute
        ctx[key] = result;
      } else {
        // Remove attribute
        delete ctx[key];
      }
    } else {
      // Create empty array if context is not defined
      if (typeof ctx === 'undefined' || ctx === null) {
        ctx = [];
      }

      if (key.length === 0) {
        // Array with dynamic index
        // ex: []
        const result = buildObject(subtree, value, null);

        if (typeof result !== 'undefined') {
          // Put value at the end of the array
          ctx.push(result);
        }
      } else if (/^[0-9]+$/.test(key)) {
        // Array with static index
        // ex: [0]
        const result = buildObject(subtree, value, ctx[key]);
        const keyIndex = parseInt(key, 10);

        if (typeof result !== 'undefined') {
          // Put value at the specified index
          ctx[keyIndex] = result;
        } else {
          // Remove existing value
          ctx.splice(keyIndex, 1);
        }
      }
    }
  }
  return ctx;
}

/**
 * Checks if value is in list
 * @param list
 * @param value
 * @return {boolean}
 */
export function contains(list, value) {
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
}

/**
 * Checks if the field is a button
 * @param field
 * @return {*|boolean}
 */
export function isButton(field) {
  return field && (field.localName === 'button' || contains(['button', 'reset', 'submit'], field.type));
}

/**
 * Checks if the field is checkable
 * @param field
 * @return {*|boolean}
 */
export function isCheckableField(field) {
  return typeof field.type === 'string' && contains(['checkbox', 'radio'], field.type);
}

/**
 * Replaces empty string by null value
 * @param value
 * @return {Object|string|Array|*}
 */
export function nullify(value) {
  let newValue = value;

  if (newValue instanceof Array) {
    for (let i = 0; i < newValue.length; i += 1) {
      newValue[i] = nullify(newValue[i]);
    }
  } else if (typeof newValue === 'object' && newValue !== null) {
    const keys = Object.keys(newValue);

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      newValue[key] = nullify(newValue[key]);
    }
  } else if (typeof newValue === 'string' && newValue === '') {
    newValue = null;
  }
  return newValue;
}

/**
 * Removes extra spaces
 * @param value
 * @return {Object|string|Array|*}
 */
export function trim(value) {
  let newValue = value;

  if (newValue instanceof Array) {
    for (let i = 0; i < newValue.length; i += 1) {
      newValue[i] = trim(newValue[i]);
    }
  } else if (typeof newValue === 'object' && newValue !== null) {
    const keys = Object.keys(newValue);

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      newValue[key] = trim(newValue[key]);
    }
  } else if (typeof newValue === 'string' && newValue.length > 0) {
    newValue = newValue.trim();
  }
  return newValue;
}

/**
 * Returns a boolean
 * @param value
 * @return {boolean|null}
 */
export function parseBoolean(value) {
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
}

/**
 * Returns a number
 * @param value
 * @return {number|null}
 */
export function parseNumber(value) {
  let number = value;

  if (typeof value !== 'number') {
    if (typeof value === 'string') {
      // Remove spaces
      number = value.replace(/ /g, '');
    }

    if (/^[+-]?[0-9]*[.,][0-9]+$/.test(number)) {
      // Replace comma with dot (for languages where number contain a comma instead of a dot)
      number = parseFloat(String(number).replace(/,/g, '.'));
    } else if (/^[+-]?[0-9]+$/.test(number)) {
      number = parseInt(number, 10);
    } else {
      number = null;
    }
  }
  return number;
}

/**
 * Returns the typed value of a string value
 * @param value
 * @param type
 * @returns {string|number|boolean|null}
 */
export function parseValue(value, type = 'auto') {
  let newVal = value;

  if (typeof newVal === 'string') {
    if (newVal.length > 0) {
      switch (type) {
        case 'auto': {
          const bool = parseBoolean(newVal);

          if (typeof bool === 'boolean') {
            newVal = bool;
            break;
          }

          const number = parseNumber(newVal);

          if (typeof number === 'number') {
            newVal = number;
          }
          break;
        }
        case 'boolean':
          newVal = parseBoolean(newVal);
          break;
        case 'number':
          newVal = parseNumber(newVal);
          break;
        case 'string':
          break;
        default:
      }
    }
  }
  return newVal;
}

/**
 * Returns the parsed value of the field
 * @param field
 * @param options
 * @return {*}
 */
export function parseField(field, options) {
  // Check field instance
  if (!(field instanceof HTMLElement)) {
    throw new TypeError('field is not an instance of HTMLElement');
  }
  // Check field name
  if (!contains(['button', 'input', 'select', 'textarea'], field.localName)) {
    throw new TypeError('field is not a form field (button, input, select, textarea)');
  }

  // Set default options
  const opts = {
    dynamicTyping: true,
    nullify: true,
    smartTyping: true,
    trim: true,
    ...options,
  };

  const isCheckable = isCheckableField(field);
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

  if (opts.dynamicTyping) {
    // Parse value excepted for special fields
    if ((!isCheckable || field.checked)
      && !contains(['email', 'file', 'password', 'search', 'url'], field.type)
      && !contains(['textarea'], field.localName)) {
      // Parse value using the "data-type" attribute
      if (field.dataset && field.dataset.type) {
        switch (field.dataset.type) {
          case 'auto':
            if (value instanceof Array) {
              for (let k = 0; k < value.length; k += 1) {
                value[k] = parseValue(value[k]);
              }
            } else {
              value = parseValue(value);
            }
            break;

          case 'boolean':
            if (value instanceof Array) {
              for (let k = 0; k < value.length; k += 1) {
                value[k] = parseBoolean(value[k]);
              }
            } else {
              value = parseBoolean(value);
            }
            break;

          case 'number':
            if (value instanceof Array) {
              for (let k = 0; k < value.length; k += 1) {
                value[k] = parseNumber(value[k]);
              }
            } else {
              value = parseNumber(value);
            }
            break;

          case 'string':
            // Keep value as string
            break;

          default:
            // eslint-disable-next-line no-console
            console.warn(`unknown data-type "${field.dataset.type}" for field "${field.name}"`);
        }
      } else if (opts.smartTyping) {
        // Parse value using the "type" attribute
        switch (field.type) {
          case 'number':
          case 'range':
            if (value instanceof Array) {
              for (let k = 0; k < value.length; k += 1) {
                value[k] = parseNumber(value[k]);
              }
            } else {
              value = parseNumber(value);
            }
            break;
          default:
        }
      } else if (value instanceof Array) {
        // Parse value using regular expression
        for (let k = 0; k < value.length; k += 1) {
          value[k] = parseValue(value[k]);
        }
      } else {
        value = parseValue(value);
      }
    }
  }

  // Removes extra spaces
  if (opts.trim && field.type !== 'password') {
    value = trim(value);
  }
  // Replaces empty strings with null
  if (opts.nullify) {
    value = nullify(value);
  }
  return value;
}

/**
 * Returns form values as an object
 * @param form
 * @param options
 * @return {object}
 */
export function parseForm(form, options) {
  if (!(form instanceof HTMLFormElement)) {
    throw new TypeError('form is not an instance of HTMLFormElement');
  }

  // Default options
  const opts = {
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
    ...options,
  };

  // Check deprecated options
  if (typeof opts.parseValues !== 'undefined') {
    // eslint-disable-next-line no-console
    console.warn('option "parseValues" is deprecated, rename it to "dynamicTyping" instead');
    opts.dynamicTyping = opts.parseValues;
  }
  if (typeof opts.smartParsing !== 'undefined') {
    // eslint-disable-next-line no-console
    console.warn('option "smartParsing" is deprecated, rename it to "smartTyping" instead');
    opts.smartTyping = opts.smartParsing;
  }
  if (typeof opts.trimValues !== 'undefined') {
    // eslint-disable-next-line no-console
    console.warn('option "trimValues" is deprecated, rename it to "trim" instead');
    opts.trim = opts.trimValues;
  }

  const fields = {};
  const { elements } = form;

  for (let i = 0; i < elements.length; i += 1) {
    const field = elements[i];
    const isCheckable = isCheckableField(field);

    // Ignore element without a valid name
    if (typeof field.name !== 'string' || field.name.length < 1) {
      // eslint-disable-next-line
      continue;
    }
    // Ignore non-form element
    if (!contains(['button', 'input', 'select', 'textarea'], field.localName)) {
      // eslint-disable-next-line
      continue;
    }
    // Ignore buttons
    if (opts.ignoreButtons && isButton(field)) {
      // eslint-disable-next-line
      continue;
    }
    // Ignore disabled element
    if (opts.ignoreDisabled && field.disabled) {
      // eslint-disable-next-line
      continue;
    }
    // Ignore unchecked element
    if (opts.ignoreUnchecked && (isCheckable && !field.checked)) {
      // eslint-disable-next-line
      continue;
    }
    // Ignore element based on filter
    if (typeof opts.filterFunction === 'function' && opts.filterFunction(field) !== true) {
      // eslint-disable-next-line
      continue;
    }

    // Parse field value
    let value = parseField(field, opts);

    // Execute custom clean function on fields with type different of password
    if (typeof opts.cleanFunction === 'function' && field.type !== 'password') {
      if (value instanceof Array) {
        for (let k = 0; k < value.length; k += 1) {
          if (typeof value[k] === 'string' && value[k].length) {
            value[k] = opts.cleanFunction(value[k], field);
          }
        }
      } else if (typeof value === 'string' && value.length) {
        value = opts.cleanFunction(value, field);
      }
    }

    // Ignore empty value
    if (opts.ignoreEmpty && (value === '' || value === null || typeof value === 'undefined')) {
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
      fields[rootName] = buildObject(tree, value, fields[rootName]);
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
}
