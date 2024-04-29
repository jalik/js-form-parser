/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

/**
 * Creates a checkbox input
 * @param attrs
 */
export function createCheckbox (attrs?: Partial<HTMLInputElement>): HTMLInputElement {
  return createElement<HTMLInputElement>('input', {
    ...attrs,
    type: 'checkbox'
  })
}

/**
 * Creates a HTML element
 * @param tagName
 * @param attrs
 */
export function createElement<T extends HTMLElement> (tagName: string, attrs?: Partial<T>): T {
  const element = document.createElement(tagName) as T
  if (attrs != null) {
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
  }
  return element
}

/**
 * Creates a file input
 * @param attrs
 */
export function createFileInput (attrs?: Partial<HTMLInputElement>): HTMLInputElement {
  return createElement<HTMLInputElement>('input', {
    ...attrs,
    type: 'file'
  })
}

/**
 * Creates a form element
 */
export function createForm (attrs?: Partial<HTMLFormElement>, elements?: HTMLElement[]): HTMLFormElement {
  const form = createElement('form', attrs)
  if (elements != null) {
    elements.forEach((el) => {
      form.appendChild(el)
    })
  }
  return form
}

/**
 * Creates a hidden input
 * @param attrs
 */
export function createHiddenInput (attrs?: Partial<HTMLInputElement>): HTMLInputElement {
  return createElement<HTMLInputElement>('input', {
    ...attrs,
    type: 'hidden'
  })
}

/**
 * Creates a number input
 * @param attrs
 */
export function createNumberInput (attrs?: Partial<HTMLInputElement>): HTMLInputElement {
  return createElement<HTMLInputElement>('input', {
    ...attrs,
    type: 'number'
  })
}

/**
 * Creates a password input
 * @param attrs
 */
export function createPasswordInput (attrs: Partial<HTMLInputElement>): HTMLInputElement {
  return createElement<HTMLInputElement>('input', {
    ...attrs,
    type: 'password'
  })
}

/**
 * Creates a radio input
 * @param attrs
 */
export function createRadio (attrs?: Partial<HTMLInputElement>): HTMLInputElement {
  return createElement<HTMLInputElement>('input', {
    ...attrs,
    type: 'radio'
  })
}

/**
 * Creates a select
 * @param attrs
 * @param options
 */
export function createSelect (attrs?: Partial<HTMLSelectElement>, options?: Partial<HTMLOptionElement>[]): HTMLSelectElement {
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
export function createTextarea (attrs?: Partial<HTMLTextAreaElement>): HTMLTextAreaElement {
  const element = createElement<HTMLTextAreaElement>('textarea', { ...attrs })

  if (typeof attrs?.value !== 'undefined') {
    element.appendChild(document.createTextNode(attrs.value))
  }
  return element
}

/**
 * Creates a text input
 * @param attrs
 */
export function createTextInput (attrs?: Partial<HTMLInputElement>): HTMLInputElement {
  return createElement<HTMLInputElement>('input', {
    type: 'text',
    ...attrs
  })
}
