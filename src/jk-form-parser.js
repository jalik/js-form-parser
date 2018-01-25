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
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export default {

    /**
     * Builds an object from a string (ex: [colors][0][code])
     * @param str
     * @param value
     * @param context
     * @return {*}
     */
    buildObject(str, value, context) {
        if (typeof str !== "string" || str.length === 0) {
            return value;
        }

        // Check missing brackets
        if (typeof context === "undefined" || context === null) {
            let opening = str.match(/\[/g).length;
            let closing = str.match(/]/g).length;

            if (opening > closing) {
                throw new SyntaxError("Missing closing ']' in '" + str + "'");
            }
            else if (closing < opening) {
                throw new SyntaxError("Missing opening '[' in '" + str + "'");
            }
        }

        let index = str.indexOf("[");

        if (index !== -1) {
            let end = str.indexOf("]", index + 1);
            let subtree = str.substr(end + 1);
            let key = str.substring(index + 1, end);
            let keyLen = key.length;

            // Object
            if (keyLen && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
                if (typeof context === "undefined" || context === null) {
                    context = {};
                }
                const result = this.buildObject(subtree, value, context[key]);

                if (typeof result !== "undefined") {
                    context[key] = result;
                }
            }
            // Array
            else {
                if (typeof context === "undefined" || context === null) {
                    context = [];
                }
                // Dynamic index
                if (keyLen === 0) {
                    const result = this.buildObject(subtree, value, context[key]);

                    if (typeof result !== "undefined") {
                        context.push(result);
                    }
                }
                // Static index
                else if (/^[0-9]+$/.test(key)) {
                    const result = this.buildObject(subtree, value, context[key]);

                    if (typeof result !== "undefined") {
                        context[parseInt(key)] = result;
                    }
                }
            }
        }
        return context;
    },

    /**
     * Returns form values as an object
     * @param form
     * @param options
     * @return {{}}
     */
    parseForm(form, options) {
        if (!(form instanceof HTMLFormElement)) {
            throw new TypeError(`form is not an HTMLFormElement`);
        }

        // Default options
        options = this.extend({
            cleanFunction: null,
            dynamicTyping: true,
            filterFunction: null,
            ignoreButtons: true,
            ignoreDisabled: true,
            ignoreEmpty: false,
            ignoreUnchecked: false,
            nullify: true,
            smartTyping: true,
            trim: true
        }, options);

        // Check deprecated options
        if (options.hasOwnProperty("parseValues")) {
            console.warn(`option "parseValues" is deprecated, rename it to "dynamicTyping" instead`);
            options.dynamicTyping = options.parseValues;
        }
        if (options.hasOwnProperty("smartParsing")) {
            console.warn(`option "smartParsing" is deprecated, rename it to "smartTyping" instead`);
            options.smartTyping = options.smartParsing;
        }
        if (options.hasOwnProperty("trimValues")) {
            console.warn(`option "trimValues" is deprecated, rename it to "trim" instead`);
            options.trim = options.trimValues;
        }

        let fields = {};
        const elements = form.elements;

        for (let i = 0; i < elements.length; i += 1) {
            const field = elements[i];
            const isButton = field.localName === "button" || this.contains(["button", "reset", "submit"], field.type);
            const isCheckable = this.contains(["checkbox", "radio"], field.type) || field.hasOwnProperty("checked");

            // Ignore element without a valid name
            if (!field.name || !/^[a-zA-Z_](?:[a-zA-Z0-9_\[\]]+)?$/.test(field.name)) {
                continue;
            }
            // Ignore non-form element
            if (!this.contains(["button", "input", "select", "textarea"], field.localName)) {
                continue;
            }
            // Ignore buttons
            if (options.ignoreButtons && isButton) {
                continue;
            }
            // Ignore disabled element
            if (options.ignoreDisabled && field.disabled) {
                continue;
            }
            // Ignore unchecked element
            if (options.ignoreUnchecked && (isCheckable && !field.checked)) {
                continue;
            }
            // Ignore element based on filter
            if (typeof options.filterFunction === "function" && options.filterFunction(field) !== true) {
                continue;
            }

            let value = field.value;

            // Fetch value from special fields
            switch (field.localName) {
                case "input":
                    if (isCheckable) {
                        // Keep value only if element is checked
                        value = field.checked ? value : undefined;
                    }
                    break;

                case "select":
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
            }

            if (options.dynamicTyping) {
                // Parse value excepted for special fields
                if ((!isCheckable || field.checked)
                    && !this.contains(["email", "file", "password", "search", "url"], field.type)
                    && !this.contains(["textarea"], field.localName)) {

                    // Parse value using the "data-type" attribute
                    if (field.dataset && field.dataset.type) {
                        switch (field.dataset.type) {
                            case "auto":
                                if (value instanceof Array) {
                                    for (let k = 0; k < value.length; k += 1) {
                                        value[k] = this.parseValue(value[k]);
                                    }
                                } else {
                                    value = this.parseValue(value);
                                }
                                break;

                            case "boolean":
                                if (value instanceof Array) {
                                    for (let k = 0; k < value.length; k += 1) {
                                        value[k] = this.parseBoolean(value[k]);
                                    }
                                } else {
                                    value = this.parseBoolean(value);
                                }
                                break;

                            case "number":
                                if (value instanceof Array) {
                                    for (let k = 0; k < value.length; k += 1) {
                                        value[k] = this.parseNumber(value[k]);
                                    }
                                } else {
                                    value = this.parseNumber(value);
                                }
                                break;

                            case "string":
                                // Keep value as string
                                break;

                            default:
                                console.warn(`unknown data-type "${field.dataset.type}" for field "${field.name}"`);
                        }
                    }
                    // Parse value using the "type" attribute
                    else if (options.smartTyping) {
                        switch (field.type) {
                            case "number":
                            case "range":
                                if (value instanceof Array) {
                                    for (let k = 0; k < value.length; k += 1) {
                                        value[k] = this.parseNumber(value[k]);
                                    }
                                } else {
                                    value = this.parseNumber(value);
                                }
                                break;
                        }
                    } else {
                        // Parse value using regular expression
                        if (value instanceof Array) {
                            for (let k = 0; k < value.length; k += 1) {
                                value[k] = this.parseValue(value[k]);
                            }
                        } else {
                            value = this.parseValue(value);
                        }
                    }
                }
            }

            // Removes extra spaces
            if (options.trim && !this.contains(["password"], field.type)) {
                if (value instanceof Array) {
                    for (let k = 0; k < value.length; k += 1) {
                        if (typeof value[k] === "string" && value[k].length) {
                            value[k] = value[k].trim();
                        }
                    }
                } else if (typeof value === "string" && value.length) {
                    value = value.trim();
                }
            }

            // Replaces empty strings with null
            if (options.nullify) {
                if (value instanceof Array) {
                    for (let k = 0; k < value.length; k += 1) {
                        if (value[k] === "") {
                            value[k] = null;
                        }
                    }
                } else if (value === "") {
                    value = null;
                }
            }

            // Execute custom clean function
            if (typeof options.cleanFunction === "function") {
                if (value instanceof Array) {
                    for (let k = 0; k < value.length; k += 1) {
                        if (typeof value[k] === "string" && value[k].length) {
                            value[k] = options.cleanFunction(value[k], field);
                        }
                    }
                } else if (typeof value === "string" && value.length) {
                    value = options.cleanFunction(value, field);
                }
            }

            // Ignore empty value
            if (options.ignoreEmpty && (value === "" || value === null || typeof value === "undefined")) {
                continue;
            }

            let name = field.name;

            // Handle multiple select specific case
            if (field.multiple) {
                name = name.replace(/\[]$/g, "");
            }

            // Reconstruct array or object
            if (name.indexOf("[") !== -1) {
                const rootName = name.substr(0, name.indexOf("["));
                const tree = name.substr(name.indexOf("["));
                fields[rootName] = this.buildObject(tree, value, fields[rootName]);
                continue;
            }

            // Add field to list
            if (isCheckable) {
                if (field.checked) {
                    fields[name] = value;
                }
                else if (typeof fields[name] === "undefined") {
                    fields[name] = null;
                }
            } else {
                fields[name] = value;
            }
        }
        return fields;
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

    /**
     * Merge objects
     * @return {*}
     */
    extend() {
        const args = Array.prototype.slice.call(arguments);
        let recursive = false;
        let a = args.shift();

        if (typeof a === "boolean") {
            recursive = a;
            a = args.shift();
        }

        for (let i = 0; i < args.length; i += 1) {
            const b = args[i];

            if (typeof b === "object" && b !== null && typeof b !== "undefined"
                && typeof a === "object" && a !== null && typeof a !== "undefined") {
                for (let key in b) {
                    if (b.hasOwnProperty(key)) {
                        if (recursive && typeof b[key] === "object" && b[key] !== null && typeof b[key] !== "undefined") {
                            a[key] = this.extend(a[key], b[key]);
                        } else {
                            a[key] = b[key];
                        }
                    }
                }
            } else if (b !== null && typeof b !== "undefined") {
                a = b;
            }
        }
        return a
    },

    /**
     * Returns a boolean
     * @param value
     * @return {boolean|null}
     */
    parseBoolean(value) {
        if (typeof value === "string") {
            value = value.trim();
        }
        if (/^true$/i.test(value)) {
            return true;
        }
        if (/^false$/i.test(value)) {
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
        if (typeof value === "string") {
            value = value.trim();
            // Replace comma with dot (for languages where numbers contain a comma instead of a dot)
            value = value.replace(/,/g, ".");
        }
        // Float
        if (/^[+-]?[0-9]*[.,][0-9]+$/.test(value)) {
            return Number.parseFloat(value);
        }
        // Integer
        if (/^[+-]?[0-9]+$/.test(value)) {
            return Number.parseInt(value);
        }
        return null;
    },

    /**
     * Returns the typed value of a string value
     * @param value
     * @param type
     * @returns {string|number|boolean|null}
     */
    parseValue(value, type = "auto") {
        if (typeof value === "string") {
            if (value.length > 0) {

                switch (type) {
                    case "auto":
                        const bool = this.parseBoolean(value);

                        if (typeof bool === "boolean") {
                            value = bool;
                            break;
                        }

                        const number = this.parseNumber(value);

                        if (typeof number === "number") {
                            value = number;
                        }
                        break;

                    case "boolean":
                        value = this.parseBoolean(value);
                        break;

                    case "number":
                        value = this.parseNumber(value);
                        break;

                    case "string":
                        break;
                }
            }
        }
        return value;
    }
};
