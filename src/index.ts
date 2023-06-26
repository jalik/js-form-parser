/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

/**
 * Builds an object from a string (ex: [colors][0][code]).
 * @param str
 * @param value
 * @param context
 */
export function buildObject (str: string, value: any, context?: Record<string, any>): Record<string, any> {
  if (str == null || str.length === 0) {
    return value
  }

  let ctx = context

  // Check missing brackets
  if (typeof ctx === 'undefined' || ctx === null) {
    const opening = (str.match(/\[/g) || []).length
    const closing = (str.match(/]/g) || []).length

    if (opening !== closing) {
      if (opening > closing) {
        throw new SyntaxError(`Missing closing ] in ${str}`)
      } else {
        throw new SyntaxError(`Missing opening [ in ${str}`)
      }
    }
  }

  const index = str.indexOf('[')

  if (index === -1) {
    // Field without brackets and without attribute
    // ex: customField
    ctx = buildObject(`[${str}]`, value, ctx)
  } else if (index > 0) {
    // Field without brackets and with attribute
    // ex: customField[attr]
    const rootField = str.substring(0, index)
    const subtree = str.substring(index)
    ctx = buildObject(`[${rootField}]${subtree}`, value, ctx)
  } else {
    // Field with brackets
    // ex: [customField]
    const end = str.indexOf(']', index + 1)
    const subtree = str.substring(end + 1)
    let key = str.substring(index + 1, end)

    // Object attribute
    // ex: [customField1] or ["10"] or ['10']
    if (key.length > 0 && (!/^\d+$/.test(key) || /^(["'])[^"']+\1$/.test(key))) {
      // Remove quotes in key
      key = key.replace(/^["']/, '').replace(/["']$/, '')

      // Create empty object if context is not defined
      if (typeof ctx === 'undefined' || ctx === null) {
        ctx = {}
      }
      const result = buildObject(subtree, value, ctx[key])

      if (typeof result !== 'undefined') {
        // Put value in attribute
        ctx[key] = result
      } else {
        // Remove attribute
        delete ctx[key]
      }
    } else {
      // Create empty array if context is not defined
      if (typeof ctx === 'undefined' || ctx === null) {
        ctx = []
      }

      if (key.length === 0) {
        // Array with dynamic index
        // ex: []
        const result = buildObject(subtree, value)

        if (typeof result !== 'undefined') {
          // Put value at the end of the array
          ctx.push(result)
        }
      } else if (/^[0-9]+$/.test(key)) {
        // Array with static index
        // ex: [0]
        const result = buildObject(subtree, value, ctx[key])
        const keyIndex = parseInt(key, 10)

        if (typeof result !== 'undefined') {
          // Put value at the specified index
          ctx[keyIndex] = result
        } else {
          // Remove existing value
          ctx.splice(keyIndex, 1)
        }
      }
    }
  }
  return ctx
}

/**
 * Returns all fields in a form with the same name.
 * @param name
 * @param form
 */
export function getFieldsByName (name: string, form: HTMLFormElement): Array<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  const fields: Array<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> = []
  const { elements } = form

  Object.values(elements).forEach((el) => {
    if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
      if (el.name === name) {
        fields.push(el)
      }
    }
  })
  return fields
}

/**
 * Checks if the field is checkable.
 * @param element
 */
export function isCheckableField (element: Element): boolean {
  return element instanceof HTMLInputElement && ['checkbox', 'radio'].includes(element.type)
}

/**
 * Checks if field has multiple values (based on the "multiple" attribute or when field's name contains []).
 * @param element
 */
export function isMultipleField (element: Element): boolean {
  // Field has attribute "multiple".
  if (element instanceof HTMLSelectElement && element.multiple) {
    return true
  }
  // Field name contains an empty array (example: "numbers[]").
  return (element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement) &&
    element.name != null && /\[]$/.test(element.name)
}

/**
 * Replaces empty string by null value.
 * @param value
 */
export function nullify (value: any): any {
  if (typeof value === 'string') {
    return value === '' ? null : value
  }

  if (value instanceof Array) {
    return value.map((v) => nullify(v))
  }

  if (typeof value === 'object' && value != null) {
    const obj: Record<string, any> = {}

    Object.keys(value).forEach((key) => {
      obj[key] = nullify(value[key])
    })
    return obj
  }
  return value
}

/**
 * Removes extra spaces.
 * @param value
 */
export function trim (value: any): any {
  if (typeof value === 'string' && value.length > 0) {
    return value.trim()
  }

  if (value instanceof Array) {
    return value.map((v) => trim(v))
  }

  if (typeof value === 'object' && value != null) {
    const obj: Record<string, any> = {}

    Object.keys(value).forEach((key) => {
      obj[key] = trim(value[key])
    })
    return obj
  }
  return value
}

/**
 * Returns a boolean string.
 * @param value
 */
export function parseBoolean (value: string): boolean | null {
  if (value == null) {
    return null
  }
  const bool = value.trim()

  if (/^(true|1|on|yes)$/i.test(bool)) {
    return true
  }
  if (/^(false|0|off|no)$/i.test(bool)) {
    return false
  }
  return null
}

/**
 * Parses a number string.
 * @param value
 */
export function parseNumber (value: string): number | null {
  if (value == null) {
    return null
  }
  const str = value.trim()
    // Remove spaces
    .replace(/ /g, '')

  let number = null

  if (/^[+-]?[0-9]*[.,][0-9]+$/.test(str)) {
    // Replace comma with dot (for languages where number contain a comma instead of a dot)
    number = parseFloat(str.replace(/,/g, '.'))
  }
  if (/^[+-]?[0-9]+$/.test(str)) {
    number = parseInt(str, 10)
  }
  return Number.isNaN(number) ? null : number
}

export type ParsingType = 'auto' | 'boolean' | 'number'

/**
 * Parses a value based on type.
 * @param value
 * @param type
 */
export function parseValue (value?: string, type: ParsingType = 'auto'): string | number | boolean | null {
  if (value == null) {
    return null
  }
  if (type === 'boolean') {
    return parseBoolean(value)
  }
  if (type === 'number') {
    return parseNumber(value)
  }
  if (type === 'auto') {
    const bool = parseBoolean(value)

    if (typeof bool === 'boolean') {
      return bool
    }

    const number = parseNumber(value)

    if (typeof number === 'number') {
      return number
    }
  }
  return value
}

export type ParsingMode = 'none' | 'type' | 'data-type' | 'auto'

export type ParseFieldOptions = {
  nullify?: boolean
  parsing?: ParsingMode
  trim?: boolean
}

/**
 * Returns the parsed value of the field.
 * @param element
 * @param options
 */
export function parseField (element: Element, options?: ParseFieldOptions) {
  // Check field.
  if (!(element instanceof HTMLInputElement) &&
    !(element instanceof HTMLSelectElement) &&
    !(element instanceof HTMLTextAreaElement)) {
    throw new TypeError('field is not an instance of HTMLInputElement or HTMLSelectElement or HTMLTextAreaElement')
  }

  // Set default options.
  const opts: ParseFieldOptions = {
    nullify: true,
    parsing: 'auto',
    trim: true,
    ...options
  }

  const isCheckable = isCheckableField(element)

  const { form } = element
  let value: any = element.value

  if (element instanceof HTMLInputElement) {
    // Fetch value from checkbox/radio fields.
    if (isCheckable) {
      const values = form
        ? value = getFieldsByName(element.name, form)
          .filter((el) => el instanceof HTMLInputElement && el.checked)
          .map((el) => el.value)
        : [value]

      if (isMultipleField(element)) {
        value = values
      } else {
        value = values.shift()
      }
    }
  } else if (element instanceof HTMLSelectElement) {
    // Fetch value from select (multiple) fields.
    if (element.multiple) {
      value = []

      // Collect values of selected options
      if (element.options instanceof HTMLCollection) {
        for (let o = 0; o < element.options.length; o += 1) {
          if (element.options[o].selected) {
            value.push(element.options[o].value)
          }
        }
      }
    }
  }

  const dataType = element.dataset.type

  // Parse value only if parsing is enabled and data-type different of "string".
  if (opts.parsing !== 'none' && dataType !== 'string') {
    // Ignore values that must remain string.
    if (!['email', 'file', 'password', 'search', 'url'].includes(element.type) &&
      !['textarea'].includes(element.localName)) {
      // Parse value based on "data-type" attribute.
      if (dataType && (opts.parsing === 'auto' || opts.parsing === 'data-type')) {
        if (dataType === 'auto') {
          if (value instanceof Array) {
            for (let k = 0; k < value.length; k += 1) {
              value[k] = parseValue(value[k])
            }
          } else {
            value = parseValue(value)
          }
        } else if (dataType === 'number') {
          if (value instanceof Array) {
            for (let k = 0; k < value.length; k += 1) {
              value[k] = parseNumber(value[k])
            }
          } else {
            value = parseNumber(value)
          }
        } else if (dataType === 'boolean') {
          if (value instanceof Array) {
            for (let k = 0; k < value.length; k += 1) {
              value[k] = parseBoolean(value[k])
            }
          } else if (element instanceof HTMLInputElement && !element.checked) {
            const bool = parseBoolean(element.value)

            if (typeof bool === 'boolean') {
              value = !bool
            }
          } else {
            value = parseBoolean(value)
          }
        } else {
          // eslint-disable-next-line no-console
          console.warn(`unknown data-type "${dataType}" for field "${element.name}"`)
        }
      } else if (opts.parsing === 'auto' || opts.parsing === 'type') {
        // Parse value based on "type" attribute.
        if (element instanceof HTMLInputElement) {
          if (['number', 'range'].includes(element.type)) {
            if (value instanceof Array) {
              for (let k = 0; k < value.length; k += 1) {
                value[k] = parseNumber(value[k])
              }
            } else {
              value = parseNumber(value)
            }
          }
        }
      }
    }
  }

  // Removes extra spaces but ignore password.
  if (opts.trim && (!(element instanceof HTMLInputElement) || element.type !== 'password')) {
    value = trim(value)
  }
  // Replaces empty string by null.
  if (opts.nullify) {
    value = nullify(value)
  }
  return value
}

export type ParseFormOptions = {
  cleanFunction?: (value: string, field: Element) => any
  filterFunction?: (element: Element, parsedValue: any) => boolean
  nullify?: boolean
  parsing?: ParsingMode
  trim?: boolean
}

/**
 * Returns form values as an object.
 * @param form
 * @param options
 */
export function parseForm (form: HTMLFormElement, options?: ParseFormOptions): Record<string, any> {
  if (!(form instanceof HTMLFormElement)) {
    throw new TypeError('form is not an instance of HTMLFormElement')
  }

  // Set default options.
  const opts: ParseFormOptions = {
    nullify: true,
    parsing: 'auto',
    trim: true,
    ...options
  }

  const fields: Record<string, any> = {}
  const { elements } = form

  for (let i = 0; i < elements.length; i += 1) {
    const field = elements[i]

    // Ignore non-form element.
    if (!(field instanceof HTMLInputElement) &&
      !(field instanceof HTMLSelectElement) &&
      !(field instanceof HTMLTextAreaElement)) {
      continue
    }
    // Ignore element without a name.
    if (field.name == null || field.name.length === 0) {
      continue
    }
    // Ignore disabled element.
    if (field.disabled) {
      continue
    }

    // Parse field value.
    let value = parseField(field, {
      parsing: opts.parsing,
      nullify: opts.nullify,
      trim: opts.trim
    })

    // Execute custom clean function on fields with type different of password.
    if (opts.cleanFunction && field.type !== 'password') {
      if (value instanceof Array) {
        for (let k = 0; k < value.length; k += 1) {
          if (typeof value[k] === 'string' && value[k].length) {
            value[k] = opts.cleanFunction(value[k], field)
          }
        }
      } else if (typeof value === 'string' && value.length) {
        value = opts.cleanFunction(value, field)
      }
    }

    // Ignore element not matching the filter.
    if (opts.filterFunction && !opts.filterFunction(field, value)) {
      continue
    }

    let { name } = field

    // Remove array from name if present (ex: items[] => items).
    name = name.replace(/\[]$/g, '')

    // Reconstruct array or object.
    const arrayIndex = name.indexOf('[')

    if (arrayIndex !== -1) {
      const attr = name.substring(0, arrayIndex)
      const path = name.substring(arrayIndex)
      fields[attr] = buildObject(path, value, fields[attr])
      continue
    }

    // Add field value to result.
    fields[name] = value
  }
  return fields
}
