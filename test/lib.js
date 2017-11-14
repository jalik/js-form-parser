/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import _ from "underscore";

export default {

    /**
     * Creates a button
     * @param attrs
     * @return {Element}
     */
    createButton(attrs) {
        return this.createElement("button", _.extend(attrs, {type: "button"}));
    },

    /**
     * Creates a checkbox input
     * @param attrs
     * @return {Element}
     */
    createCheckbox(attrs) {
        return this.createElement("input", _.extend(attrs, {type: "checkbox"}));
    },

    /**
     * Creates a date input
     * @param attrs
     * @return {Element}
     */
    createDateInput(attrs) {
        return this.createElement("input", _.extend(attrs, {type: "date"}));
    },

    /**
     * Creates a datetime input
     * @param attrs
     * @return {Element}
     */
    createDatetimeInput(attrs) {
        return this.createElement("input", _.extend(attrs, {type: "datetime"}));
    },

    /**
     * Creates a HTML element
     * @param node
     * @param attrs
     * @return {Element}
     */
    createElement(node, attrs) {
        const element = document.createElement(node);

        for (let attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                element[attr] = attrs[attr];
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
        return this.createElement("input", _.extend(attrs, {type: "file"}));
    },

    /**
     * Creates a form element
     * @return {Element}
     */
    createForm() {
        return document.createElement("form");
    },

    /**
     * Creates a hidden input
     * @param attrs
     * @return {Element}
     */
    createHiddenInput(attrs) {
        return this.createElement("input", _.extend(attrs, {type: "hidden"}));
    },

    /**
     * Creates a number input
     * @param attrs
     * @return {Element}
     */
    createNumberInput(attrs) {
        return this.createElement("input", _.extend(attrs, {type: "number"}));
    },

    /**
     * Creates a password input
     * @param attrs
     * @return {Element}
     */
    createPasswordInput(attrs) {
        return this.createElement("input", _.extend(attrs, {type: "password"}));
    },

    /**
     * Creates a radio input
     * @param attrs
     * @return {Element}
     */
    createRadio(attrs) {
        return this.createElement("input", _.extend(attrs, {type: "radio"}));
    },

    /**
     * Creates a select
     * @param attrs
     * @return {Element}
     */
    createSelect(attrs) {
        const select = this.createElement("select", _.extend(_.omit(attrs, "options"), {}));

        if (attrs["options"] instanceof Array) {
            for (let i = 0; i < attrs["options"].length; i += 1) {
                const option = this.createElement("option", attrs["options"][i]);
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
        return this.createElement("textarea", _.extend(attrs, {}));
    },

    /**
     * Creates a text input
     * @param attrs
     * @return {Element}
     */
    createTextInput(attrs) {
        return this.createElement("input", _.extend({type: "text"}, attrs));
    },
};
