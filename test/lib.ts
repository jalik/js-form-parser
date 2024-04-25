/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

/**
 * Creates a checkbox input
 * @param attrs
 */
export function createCheckbox (attrs: Partial<HTMLInputElement>): HTMLInputElement {
  return createElement('input', {
    ...attrs,
    type: 'checkbox'
  }) as HTMLInputElement
}

/**
 * Creates a HTML element
 * @param tagName
 * @param attrs
 */
export function createElement<T> (tagName: string, attrs: Partial<T>): T {
  const element = document.createElement(tagName) as T
  const keys = Object.keys(attrs)

  for (let i = 0; i < keys.length; i += 1) {
    const attr = keys[i]

    // @ts-ignore
    if (typeof attrs[attr] !== 'undefined') {
      if (attr === 'dataset' || attr === 'style') {
        // @ts-ignore
        Object.entries(attrs[attr]).forEach(([k, v]) => {
          // @ts-ignore
          element[attr][k] = v
        })
      } else {
        // @ts-ignore
        element.setAttribute(attr, attrs[attr])
      }
    }
  }
  return element
}

/**
 * Creates a file input
 * @param attrs
 */
export function createFileInput (attrs: Partial<HTMLInputElement>): HTMLInputElement {
  return createElement('input', {
    ...attrs,
    type: 'file'
  }) as HTMLInputElement
}

/**
 * Creates a form element
 */
export function createForm (): HTMLFormElement {
  return document.createElement('form')
}

/**
 * Creates a hidden input
 * @param attrs
 */
export function createHiddenInput (attrs: Partial<HTMLInputElement>): HTMLInputElement {
  return createElement('input', {
    ...attrs,
    type: 'hidden'
  }) as HTMLInputElement
}

/**
 * Creates a number input
 * @param attrs
 */
export function createNumberInput (attrs: Partial<HTMLInputElement>): HTMLInputElement {
  return createElement('input', {
    ...attrs,
    type: 'number'
  }) as HTMLInputElement
}

/**
 * Creates a password input
 * @param attrs
 */
export function createPasswordInput (attrs: Partial<HTMLInputElement>): HTMLInputElement {
  return createElement('input', {
    ...attrs,
    type: 'password'
  }) as HTMLInputElement
}

/**
 * Creates a radio input
 * @param attrs
 */
export function createRadio (attrs: Partial<HTMLInputElement>): HTMLInputElement {
  return createElement('input', {
    ...attrs,
    type: 'radio'
  }) as HTMLInputElement
}

/**
 * Creates a select
 * @param attrs
 * @param options
 */
export function createSelect (attrs: Partial<HTMLSelectElement>, options?: Partial<HTMLOptionElement>[]): HTMLSelectElement {
  const select = createElement('select', attrs)

  if (options instanceof Array) {
    for (let i = 0; i < options.length; i += 1) {
      const option = createElement('option', options[i])
      select.options.add(option)
    }
  }
  return select
}

/**
 * Creates a textarea
 * @param attrs
 */
export function createTextarea (attrs: Partial<HTMLTextAreaElement>): HTMLTextAreaElement {
  const element = createElement('textarea', { ...attrs }) as HTMLTextAreaElement

  if (typeof attrs.value !== 'undefined') {
    element.appendChild(document.createTextNode(attrs.value))
  }
  return element
}

/**
 * Creates a text input
 * @param attrs
 */
export function createTextInput (attrs: Partial<HTMLInputElement>): HTMLInputElement {
  return createElement('input', {
    type: 'text',
    ...attrs
  }) as HTMLInputElement
}
