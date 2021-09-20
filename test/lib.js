/*
 * The MIT License (MIT)
 * Copyright (c) 2021 Karl STEIN
 */

export default {
  /**
   * Creates a button
   * @param attrs
   * @return {Element}
   */
  createButton(attrs) {
    return this.createElement('button', { ...attrs, type: 'button' });
  },

  /**
   * Creates a checkbox input
   * @param attrs
   * @return {Element}
   */
  createCheckbox(attrs) {
    return this.createElement('input', { ...attrs, type: 'checkbox' });
  },

  /**
   * Creates a HTML element
   * @param node
   * @param attrs
   * @return {Element}
   */
  createElement(node, attrs) {
    const element = document.createElement(node);
    const keys = Object.keys(attrs);

    for (let i = 0; i < keys.length; i += 1) {
      const attr = keys[i];

      if (typeof attrs[attr] !== 'undefined') {
        if (attr === 'dataset' || attr === 'style') {
          Object.entries(attrs[attr]).forEach(([k, v]) => {
            element[attr][k] = v;
          });
        } else {
          element.setAttribute(attr, attrs[attr]);
        }
      }
    }
    return element;
  },

  /**
   * Creates a file input
   * @param attrs
   * @return {Element}
   */
  createFileInput(attrs) {
    return this.createElement('input', { ...attrs, type: 'file' });
  },

  /**
   * Creates a form element
   * @return {Element}
   */
  createForm() {
    return document.createElement('form');
  },

  /**
   * Creates a hidden input
   * @param attrs
   * @return {Element}
   */
  createHiddenInput(attrs) {
    return this.createElement('input', { ...attrs, type: 'hidden' });
  },

  /**
   * Creates a number input
   * @param attrs
   * @return {Element}
   */
  createNumberInput(attrs) {
    return this.createElement('input', { ...attrs, type: 'number' });
  },

  /**
   * Creates a password input
   * @param attrs
   * @return {Element}
   */
  createPasswordInput(attrs) {
    return this.createElement('input', { ...attrs, type: 'password' });
  },

  /**
   * Creates a radio input
   * @param attrs
   * @return {Element}
   */
  createRadio(attrs) {
    return this.createElement('input', { ...attrs, type: 'radio' });
  },

  /**
   * Creates a select
   * @param attrs
   * @return {Element}
   */
  createSelect(attrs) {
    const { options } = attrs || {};
    const selectAttributes = { ...attrs };

    if (typeof selectAttributes.options !== 'undefined') {
      delete selectAttributes.options;
    }

    const select = this.createElement('select', selectAttributes);

    if (options instanceof Array) {
      for (let i = 0; i < options.length; i += 1) {
        const option = this.createElement('option', options[i]);
        select.appendChild(option);
      }
    }
    return select;
  },

  /**
   * Creates a textarea
   * @param attrs
   * @return {Element}
   */
  createTextarea(attrs) {
    const element = this.createElement('textarea', { ...attrs });

    if (typeof attrs.value !== 'undefined') {
      element.appendChild(document.createTextNode(attrs.value));
    }
    return element;
  },

  /**
   * Creates a text input
   * @param attrs
   * @return {Element}
   */
  createTextInput(attrs) {
    return this.createElement('input', { type: 'text', ...attrs });
  },
};
