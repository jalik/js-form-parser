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

  const regex = /\[\d*]$/
  const realName = name.replace(regex, '')

  for (let i = 0; i < elements.length; i += 1) {
    const el = elements[i]
    if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
      if (el.name.replace(regex, '') === realName) {
        fields.push(el)
      }
    }
  }
  return fields
}

/**
 * Returns input value.
 * @param element
 */
export function getInputValue (element: HTMLInputElement): string | string[] | undefined {
  let value: string | string[] | undefined = element.value

  if (isMultipleField(element)) {
    const { form } = element
    let fields = form ? getFieldsByName(element.name, form) : [element]

    if (isCheckableField(element)) {
      fields = fields.filter((el) => el instanceof HTMLInputElement && el.checked)
    }
    value = getValuesFromFields(fields)
  } else if (isCheckableField(element)) {
    const { form } = element
    const fields = (form ? getFieldsByName(element.name, form) : [element])
    value = fields.find((el) => el instanceof HTMLInputElement && el.checked)?.value
  }
  return value
}

/**
 * Returns select value.
 * @param element
 */
export function getSelectValue (element: HTMLSelectElement): string | string[] {
  let value: string | string[] = element.value

  if (isMultipleField(element)) {
    const { form } = element
    value = form ? getValuesFromFields(getFieldsByName(element.name, form)) : [value]
  } else if (element.multiple) {
    value = []

    // Get selected values.
    if (element.options instanceof HTMLCollection) {
      for (let i = 0; i < element.options.length; i += 1) {
        if (element.options[i].selected) {
          value.push(element.options[i].value)
        }
      }
    }
  }
  return value
}

/**
 * Returns textarea value.
 * @param element
 */
export function getTextareaValue (element: HTMLTextAreaElement): string | string[] {
  let value: string | string[] = element.value

  if (isMultipleField(element)) {
    const { form } = element
    value = form ? getValuesFromFields(getFieldsByName(element.name, form)) : [value]
  }
  return value
}

/**
 * Returns values from fields by using index from name (ex: name="items[1]").
 * @param elements
 */
function getValuesFromFields (elements: Array<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): string[] {
  const values: string[] = []
  elements.forEach((el, index) => {
    const matches = /\[(\d+)?]$/.exec(el.name)

    if (matches) {
      const idx = matches[1]

      if (idx != null && idx.length) {
        values[parseInt(idx, 10)] = el.value
      } else {
        values[index] = el.value
      }
    } else {
      values[index] = el.value
    }
  })
  return values
}

/**
 * Checks if the field is checkable.
 * @param element
 */
export function isCheckableField (element: Element): boolean {
  return element instanceof HTMLInputElement && ['checkbox', 'radio'].includes(element.type)
}

/**
 * Checks if the element value can be edited.
 * @param element
 */
export function isFieldValueEditable (element: Element): boolean {
  return element instanceof HTMLTextAreaElement || (
    element instanceof HTMLInputElement && ![
      'hidden',
      'checkbox',
      'password',
      'radio'
    ].includes(element.type)
  )
}

/**
 * Checks if field value is an array.
 * @param element
 */
export function isMultipleField (element: Element): boolean {
  if ((element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement) && element.name != null) {
    // Check element's name (example: "numbers[]" or "number[0]").
    if (/\[\d*]$/.test(element.name)) {
      return true
    }
    // Check if form contains other elements with the same name.
    if (element.form &&
      element.type === 'checkbox' &&
      getFieldsByName(element.name, element.form).length > 1) {
      return true
    }
  }
  return false
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
  parser?: (value: any, type: string, element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => any
  parsing?: ParsingMode
  trim?: boolean
}

/**
 * Returns the parsed value of the field.
 * @param element
 * @param options
 */
export function parseField (element: Element, options?: ParseFieldOptions): any {
  // Set default options.
  const opts: ParseFieldOptions = {
    nullify: true,
    parsing: 'auto',
    trim: true,
    ...options
  }

  let value: any

  if (element instanceof HTMLInputElement) {
    value = getInputValue(element)
  } else if (element instanceof HTMLSelectElement) {
    value = getSelectValue(element)
  } else if (element instanceof HTMLTextAreaElement) {
    value = getTextareaValue(element)
  } else {
    throw new TypeError('field is not an instance of HTMLInputElement or HTMLSelectElement or HTMLTextAreaElement')
  }

  const dataType = element.dataset.type

  // Parse value only if parsing is enabled and data-type different of "string".
  if (opts.parsing !== 'none' && dataType !== 'string') {
    // Ignore values that must remain string.
    if (!['email', 'file', 'password', 'search', 'url'].includes(element.type) &&
      // todo parse textarea
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
        } else if (opts.parser != null) {
          // Use custom parser.
          value = opts.parser(value, dataType, element)
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

  // Removes extra spaces.
  if (opts.trim && isFieldValueEditable(element)) {
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
  parser?: (value: any, type: string, element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => any
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
      nullify: opts.nullify,
      parser: opts.parser,
      parsing: opts.parsing,
      trim: opts.trim
    })

    // Execute custom clean function on fields with type different of password.
    if (opts.cleanFunction && isFieldValueEditable(field)) {
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

    // Remove array from name (ex: items[] => items, items[0] => items).
    const name = field.name.replace(/\[\d*]$/g, '')

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
