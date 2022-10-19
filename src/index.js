/*
 * The MIT License (MIT)
 * Copyright (c) 2022 Karl STEIN
 */

/**
 * Builds an object from a string (ex: [colors][0][code]).
 * @param {string} str
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
 * Checks if value is in list.
 * @param {*[]} list
 * @param {*} value
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
 * Returns form fields.
 * @param {HTMLFormElement} form
 * @param {function|undefined} filter
 * @returns {*[]}
 */
export function getFormFields(form, filter = undefined) {
  const { elements } = form;
  const fields = [];

  for (let i = 0; i < elements.length; i += 1) {
    const el = elements[i];

    if (!filter || filter(el)) {
      fields.push(el);
    }
  }
  return fields;
}

/**
 * Checks if the field is a button.
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field
 * @return {*|boolean}
 */
export function isButton(field) {
  return field && (field.localName === 'button' || contains(['button', 'reset', 'submit'], field.type));
}

/**
 * Checks if the field is checkable.
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field
 * @return {*|boolean}
 */
export function isCheckableField(field) {
  return typeof field.type === 'string' && contains(['checkbox', 'radio'], field.type);
}

/**
 * Checks if field has multiple values.
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement|HTMLElement} field
 * @return {boolean}
 */
export function isMultipleField(field) {
  // Field has attribute "multiple".
  if (field.multiple) {
    return true;
  }
  // Field name contains an empty array (example: "numbers[]").
  return field.name != null && /\[]$/.test(field.name);
}

/**
 * Replaces empty string by null value.
 * @param value
 * @return {null|*|*[]}
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
 * Removes extra spaces.
 * @param {string|*[]} value
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
 * Returns a boolean.
 * @param {string} value
 * @return {boolean|null}
 */
export function parseBoolean(value) {
  const bool = String(value).trim();

  if (/^(true|1)$/i.test(bool)) {
    return true;
  }
  if (/^(false|0)$/i.test(bool)) {
    return false;
  }
  return null;
}

/**
 * Returns a number.
 * @param {string} value
 * @return {number|null}
 */
export function parseNumber(value) {
  const number = String(value).trim()
    // Remove spaces
    .replace(/ /g, '');

  if (/^[+-]?[0-9]*[.,][0-9]+$/.test(number)) {
    // Replace comma with dot (for languages where number contain a comma instead of a dot)
    return parseFloat(String(number).replace(/,/g, '.'));
  }
  if (/^[+-]?[0-9]+$/.test(number)) {
    return parseInt(number, 10);
  }
  return null;
}

/**
 * Returns the typed value of a string value
 * @param {string|null} value
 * @param {'auto'|'boolean'|'number'} type
 * @returns {string|number|boolean|null}
 */
export function parseValue(value, type = 'auto') {
  if (value == null) {
    return null;
  }
  let result = String(value);

  if (result.length > 0) {
    switch (type) {
      case 'auto': {
        const bool = parseBoolean(result);

        if (typeof bool === 'boolean') {
          result = bool;
          break;
        }

        const number = parseNumber(result);

        if (typeof number === 'number') {
          result = number;
        }
        break;
      }
      case 'boolean':
        result = parseBoolean(result);
        break;
      case 'number':
        result = parseNumber(result);
        break;
      default:
    }
  }
  return result;
}

/**
 * Returns the parsed value of the field
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field
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
  const isMultiple = isMultipleField(field);

  const { form } = field;
  let { value } = field;

  // Fetch value from special fields
  switch (field.localName) {
    case 'input':
      if (isCheckable) {
        if (isMultiple) {
          value = getFormFields(form, (el) => el.name === field.name && el.checked === true)
            .map((el) => el.value);
        } else {
          value = field.checked ? value : null;
        }
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
 * @param {HTMLFormElement} form
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

  const fields = {};
  const { elements } = form;

  for (let i = 0; i < elements.length; i += 1) {
    const field = elements[i];
    const isCheckable = isCheckableField(field);
    const isMultiple = isMultipleField(field);

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
    if (isMultiple) {
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
    if (isCheckable && !isMultiple && !field.checked) {
      fields[name] = null;
    } else {
      fields[name] = value;
    }
  }
  return fields;
}
