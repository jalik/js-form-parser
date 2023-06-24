/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

/**
 * Creates a checkbox input
 * @param attrs
 */
export function createCheckbox (attrs): HTMLInputElement {
  return createElement('input', { ...attrs, type: 'checkbox' }) as HTMLInputElement
}

/**
 * Creates a HTML element
 * @param tagName
 * @param attrs
 */
export function createElement (tagName: string, attrs): HTMLElement {
  const element = document.createElement(tagName)
  const keys = Object.keys(attrs)

  for (let i = 0; i < keys.length; i += 1) {
    const attr = keys[i]

    if (typeof attrs[attr] !== 'undefined') {
      if (attr === 'dataset' || attr === 'style') {
        Object.entries(attrs[attr]).forEach(([k, v]) => {
          element[attr][k] = v
        })
      } else {
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
export function createFileInput (attrs): HTMLInputElement {
  return createElement('input', { ...attrs, type: 'file' }) as HTMLInputElement
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
export function createHiddenInput (attrs): HTMLInputElement {
  return createElement('input', { ...attrs, type: 'hidden' }) as HTMLInputElement
}

/**
 * Creates a number input
 * @param attrs
 */
export function createNumberInput (attrs): HTMLInputElement {
  return createElement('input', { ...attrs, type: 'number' }) as HTMLInputElement
}

/**
 * Creates a password input
 * @param attrs
 */
export function createPasswordInput (attrs): HTMLInputElement {
  return createElement('input', { ...attrs, type: 'password' }) as HTMLInputElement
}

/**
 * Creates a radio input
 * @param attrs
 */
export function createRadio (attrs): HTMLInputElement {
  return createElement('input', { ...attrs, type: 'radio' }) as HTMLInputElement
}

/**
 * Creates a select
 * @param attrs
 */
export function createSelect (attrs): HTMLSelectElement {
  const { options } = attrs || {}
  const selectAttributes = { ...attrs }

  if (typeof selectAttributes.options !== 'undefined') {
    delete selectAttributes.options
  }

  const select = createElement('select', selectAttributes) as HTMLSelectElement

  if (options instanceof Array) {
    for (let i = 0; i < options.length; i += 1) {
      const option = createElement('option', options[i])
      select.appendChild(option)
    }
  }
  return select
}

/**
 * Creates a textarea
 * @param attrs
 */
export function createTextarea (attrs): HTMLTextAreaElement {
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
export function createTextInput (attrs): HTMLInputElement {
  return createElement('input', { type: 'text', ...attrs }) as HTMLInputElement
}
