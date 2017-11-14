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
import FormUtils from "../dist/jk-form-parser";
import TestUtils from "./lib";

// Define constants
const DATE = new Date();
const DATE_STRING = DATE.toISOString();
const FALSE = "false";
const TRUE = "true";
const FLOAT = 9.99;
const FLOAT_STRING = "09.99";
const FLOAT_STRING_COMMA = "09,99";
const INTEGER = 100;
const INTEGER_STRING = "0100";
const STRING = "Hello";


// Test boolean parsing
describe("Boolean parsing", () => {

    test(`parseBoolean(null) should return null`, () => {
        expect(FormUtils.parseBoolean(null)).toEqual(null);
    });
    test(`parseBoolean(undefined) should return null`, () => {
        expect(FormUtils.parseBoolean(undefined)).toEqual(null);
    });
    test(`parseBoolean(true) should return true`, () => {
        expect(FormUtils.parseBoolean(true)).toEqual(true);
    });
    test(`parseBoolean('${TRUE}') should return true`, () => {
        expect(FormUtils.parseBoolean(TRUE)).toEqual(true);
    });
    test(`parseBoolean(false) should return false`, () => {
        expect(FormUtils.parseBoolean(false)).toEqual(false);
    });
    test(`parseBoolean('${FALSE}') should return false`, () => {
        expect(FormUtils.parseBoolean(FALSE)).toEqual(false);
    });
});

// Test number parsing
describe("Number parsing", () => {

    test(`parseNumber(null) should return null`, () => {
        expect(FormUtils.parseNumber(null)).toEqual(null);
    });
    test(`parseNumber(undefined) should return null`, () => {
        expect(FormUtils.parseNumber(undefined)).toEqual(null);
    });

    describe("Float parsing", () => {
        test(`parseNumber(${FLOAT}) should return a number`, () => {
            expect(FormUtils.parseNumber(FLOAT)).toEqual(FLOAT);
        });
        test(`parseNumber('${FLOAT_STRING}') should return a number`, () => {
            expect(FormUtils.parseNumber(FLOAT_STRING)).toEqual(FLOAT);
        });
        test(`parseNumber('${FLOAT_STRING_COMMA}') should return a number`, () => {
            expect(FormUtils.parseNumber(FLOAT_STRING_COMMA)).toEqual(FLOAT);
        });
    });

    describe("Integer parsing", () => {
        test(`parseNumber(${INTEGER}) should return a number`, () => {
            expect(FormUtils.parseNumber(INTEGER)).toEqual(INTEGER);
        });
        test(`parseNumber('${INTEGER_STRING}') should return a number`, () => {
            expect(FormUtils.parseNumber(INTEGER_STRING)).toEqual(INTEGER);
        });
    });
});

// Test empty values
describe("Empty value parsing", () => {

    test(`parseValue() should return undefined`, () => {
        expect(FormUtils.parseValue()).toEqual(undefined);
    });
    test(`parseValue(null) should return null`, () => {
        expect(FormUtils.parseValue(null)).toEqual(null);
    });
    // test(`parseValue('') should return null`, () => {
    //     expect(FormUtils.parseValue("")).toEqual(null);
    // });
    test(`parseValue(' ') should return null`, () => {
        expect(FormUtils.parseValue(" ")).toEqual(" ");
    });
});

// Test returned types
describe("Smart primitive parsing", () => {

    test(`parseValue(true) should return a boolean`, () => {
        expect(FormUtils.parseValue(true)).toEqual(true);
    });
    test(`parseValue(false) should return a boolean`, () => {
        expect(FormUtils.parseValue(false)).toEqual(false);
    });
    test(`parseValue(${FLOAT}) should return a number`, () => {
        expect(FormUtils.parseValue(FLOAT)).toEqual(FLOAT);
    });
    test(`parseValue(${INTEGER}) should return a number`, () => {
        expect(FormUtils.parseValue(INTEGER)).toEqual(INTEGER);
    });
    test(`parseValue('${STRING}') should return a string`, () => {
        expect(FormUtils.parseValue(STRING)).toEqual(STRING);
    });
});

// Test smart parsing
describe("Smart string parsing", () => {

    test(`parseValue('${TRUE}') should return a boolean`, () => {
        expect(FormUtils.parseValue(TRUE)).toEqual(true);
    });
    test(`parseValue('${FALSE}') should return a boolean`, () => {
        expect(FormUtils.parseValue(FALSE)).toEqual(false);
    });
    test(`parseValue('${FLOAT_STRING}') should return a number`, () => {
        expect(FormUtils.parseValue(FLOAT_STRING)).toEqual(FLOAT);
    });
    test(`parseValue('${FLOAT_STRING_COMMA}') should return a number`, () => {
        expect(FormUtils.parseValue(FLOAT_STRING_COMMA)).toEqual(FLOAT);
    });
    test(`parseValue('${INTEGER_STRING}') should return a number`, () => {
        expect(FormUtils.parseValue(INTEGER_STRING)).toEqual(INTEGER);
    });
});

// Test manual parsing
describe("Manual string parsing", () => {

    describe("Parsing string to boolean", () => {

        test(`parseValue('false', 'boolean') should return false`, () => {
            expect(FormUtils.parseValue(FALSE, "boolean")).toEqual(false);
        });
        test(`parseValue('true', 'boolean') should return true`, () => {
            expect(FormUtils.parseValue(TRUE, "boolean")).toEqual(true);
        });
    });

    describe("Parsing string to float", () => {

        test(`parseValue('${FLOAT_STRING}', 'number') should return ${FLOAT}`, () => {
            expect(FormUtils.parseValue(FLOAT_STRING, "number")).toEqual(FLOAT);
        });
        test(`parseValue('${FLOAT_STRING_COMMA}', 'number') should return ${FLOAT}`, () => {
            expect(FormUtils.parseValue(FLOAT_STRING_COMMA, "number")).toEqual(FLOAT);
        });
    });

    describe("Parsing string to integer", () => {

        test(`parseValue('${INTEGER_STRING}', 'number') should return ${INTEGER}`, () => {
            expect(FormUtils.parseValue(INTEGER_STRING, "number")).toEqual(INTEGER);
        });
    });

    describe("Parsing string to string", () => {

        test(`parseValue('false', 'string') should return a string`, () => {
            expect(FormUtils.parseValue(FALSE, "string")).toEqual(FALSE);
        });
        test(`parseValue('true', 'string') should return a string`, () => {
            expect(FormUtils.parseValue(TRUE, "string")).toEqual(TRUE);
        });
        test(`parseValue('${FLOAT_STRING}', 'string') should return a string`, () => {
            expect(FormUtils.parseValue(FLOAT_STRING, "string")).toEqual(FLOAT_STRING);
        });
        test(`parseValue('${FLOAT_STRING_COMMA}', 'string') should return a string`, () => {
            expect(FormUtils.parseValue(FLOAT_STRING_COMMA, "string")).toEqual(FLOAT_STRING_COMMA);
        });
        test(`parseValue('${INTEGER_STRING}', 'string') should return a string`, () => {
            expect(FormUtils.parseValue(INTEGER_STRING, "string")).toEqual(INTEGER_STRING);
        });
    });

    describe("Parsing string with spaces to string", () => {

        test(`parseValue(' false ', 'boolean') should return a string`, () => {
            expect(FormUtils.parseValue(` ${FALSE} `, "boolean")).toEqual(false);
        });
        test(`parseValue(' true ', 'boolean') should return a string`, () => {
            expect(FormUtils.parseValue(` ${TRUE} `, "boolean")).toEqual(true);
        });
        test(`parseValue(' ${FLOAT_STRING} ', 'number') should return a string`, () => {
            expect(FormUtils.parseValue(` ${FLOAT_STRING} `, "number")).toEqual(FLOAT);
        });
        test(`parseValue(' ${FLOAT_STRING_COMMA} ', 'number') should return a string`, () => {
            expect(FormUtils.parseValue(` ${FLOAT_STRING_COMMA} `, "number")).toEqual(FLOAT);
        });
        test(`parseValue(' ${INTEGER_STRING} ', 'number') should return a string`, () => {
            expect(FormUtils.parseValue(` ${INTEGER_STRING} `, "number")).toEqual(INTEGER);
        });
    });
});

describe("Building flat object and array from string", () => {

    describe("Building flat array from string", () => {

        test(`buildObject('[]', '${STRING}', null) should return ['${STRING}']`, () => {
            const r = FormUtils.buildObject("[]", STRING, null);
            expect(r).toEqual([STRING]);
        });
        test(`buildObject('[0]', '${STRING}', null) should return ['${STRING}']`, () => {
            const r = FormUtils.buildObject("[0]", STRING, null);
            expect(r).toEqual([STRING]);
        });
        test(`buildObject('[2]', '${STRING}', null) should return [undefined, undefined, ${STRING}]`, () => {
            const r = FormUtils.buildObject("[2]", STRING, null);
            expect(r).toEqual([undefined, undefined, STRING]);
        });
    });

    describe("Building flat object from string", () => {

        test(`buildObject('[num]', ${INTEGER}, null) should return {num: ${INTEGER}}`, () => {
            const r = FormUtils.buildObject("[num]", INTEGER, null);
            expect(r).toEqual({num: INTEGER});
        });
        test(`buildObject('[text]', '${STRING}', null) should return {text: '${STRING}'}`, () => {
            const r = FormUtils.buildObject("[text]", STRING, null);
            expect(r).toEqual({text: STRING});
        });
    });
});

describe("Building deep object and array from string", () => {

    describe("Building deep array from string", () => {

        test(`buildObject('[][]', '${STRING}', null) should return [['${STRING}']]`, () => {
            const r = FormUtils.buildObject("[][]", STRING, null);
            expect(r).toEqual([[STRING]]);
        });
        test(`buildObject('[][0]', '${STRING}', null) should return [['${STRING}']]`, () => {
            const r = FormUtils.buildObject("[][0]", STRING, null);
            expect(r).toEqual([[STRING]]);
        });
        test(`buildObject('[][2]', '${STRING}', null) should return [[undefined,undefined,${STRING}]]`, () => {
            const r = FormUtils.buildObject("[][2]", STRING, null);
            expect(r).toEqual([[undefined, undefined, STRING]]);
        });
        test(`buildObject('[2][]', '${STRING}', null) should return [undefined,undefined,[${STRING}]]`, () => {
            const r = FormUtils.buildObject("[2][]", STRING, null);
            expect(r).toEqual([undefined, undefined, [STRING]]);
        });
        test(`buildObject('[2][2]', '${STRING}', null) should return [undefined,undefined,[undefined,undefined, ${STRING}]]`, () => {
            const r = FormUtils.buildObject("[2][2]", STRING, null);
            expect(r).toEqual([undefined, undefined, [undefined, undefined, STRING]]);
        });
    });

    describe("Building deep object from string", () => {

        test(`buildObject('[a][]', '${STRING}', null) should return {a:['${STRING}']}`, () => {
            const r = FormUtils.buildObject("[a][]", STRING, null);
            expect(r).toEqual({a: [STRING]});
        });
        test(`buildObject('[a][0]', '${STRING}', null) should return {a:['${STRING}']}`, () => {
            const r = FormUtils.buildObject("[a][0]", STRING, null);
            expect(r).toEqual({a: [STRING]});
        });
        test(`buildObject('[a][2]', '${STRING}', null) should return {a:[undefined,undefined,'${STRING}']}`, () => {
            const r = FormUtils.buildObject("[a][2]", STRING, null);
            expect(r).toEqual({a: [undefined, undefined, STRING]});
        });
    });

    describe("Building complex object from string", () => {

        test(`buildObject('[a][][b][][text]', '${STRING}', null) should return {a:[{b:[{text:'${STRING}']}]}`, () => {
            const r = FormUtils.buildObject("[a][][b][][text]", STRING, null);
            expect(r).toEqual({a: [{b: [{text: STRING}]}]});
        });
        test(`buildObject('[a][][b][0][c][2][text]', '${STRING}', null) should return {a:[{b:[{c:[undefined,undefined,{text:'${STRING}'}]}]}]}`, () => {
            const r = FormUtils.buildObject("[a][][b][0][c][2][text]", STRING, null);
            expect(r).toEqual({a: [{b: [{c: [undefined, undefined, {text: STRING}]}]}]});
        });
    });

    describe("Building complex existing object from string", () => {

        let obj = {a: [0, 1, 2]};
        test(`buildObject('[a][]', '${STRING}', ${JSON.stringify(obj)}) should return {a:[0,1,2,'${STRING}']}`, () => {
            const r = FormUtils.buildObject("[a][]", STRING, obj);
            expect(r).toEqual({a: [0, 1, 2, STRING]});
        });

        let obj1 = {a: [0, 1, 2]};
        test(`buildObject('[a][1]', '${STRING}', ${JSON.stringify(obj1)}) should return {a:[0,'${STRING}',2]}`, () => {
            const r = FormUtils.buildObject("[a][1]", STRING, obj1);
            expect(r).toEqual({a: [0, STRING, 2]});
        });

        let obj2 = {a: [0, 1, 2]};
        test(`buildObject('[b][text]', '${STRING}', ${JSON.stringify(obj2)}) should return {a:[0,1,2],b:{text:'${STRING}'}}`, () => {
            const r = FormUtils.buildObject("[b][text]", STRING, obj2);
            expect(r).toEqual({a: [0, 1, 2], b: {text: STRING}});
        });
    });
});

/**
 * Tests for parsing form fields
 */
describe("Form parsing", () => {

    test(`parseForm(form) should return values of checked checkboxes`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createCheckbox({
            checked: true,
            name: "checkboxes[]",
            value: "A"
        }));
        form.appendChild(TestUtils.createCheckbox({
            checked: false,
            name: "checkboxes[]",
            value: "B"
        }));
        form.appendChild(TestUtils.createCheckbox({
            checked: true,
            name: "checkboxes[]",
            value: "C"
        }));

        const r = FormUtils.parseForm(form, {parseValues: true});
        expect(r).toEqual({
            checkboxes: [
                form.elements["0"].value,
                form.elements["2"].value,
            ]
        });
    });

    test(`parseForm(form) should return values of checked radios`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createRadio({
            checked: false,
            name: "radio",
            value: "A"
        }));
        form.appendChild(TestUtils.createRadio({
            checked: true,
            name: "radio",
            value: "B"
        }));

        const r = FormUtils.parseForm(form, {parseValues: true});
        expect(r).toEqual({radio: form.elements["1"].value});
    });

    test(`parseForm(form) should return values of file inputs`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createFileInput({
            name: "file",
            value: STRING
        }));

        const r = FormUtils.parseForm(form, {parseValues: true});
        expect(r).toEqual({file: STRING});
    });

    test(`parseForm(form) should return values of hidden inputs`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createHiddenInput({
            name: "hidden",
            value: STRING
        }));

        const r = FormUtils.parseForm(form, {parseValues: true});
        expect(r).toEqual({hidden: STRING});
    });

    test(`parseForm(form) should return values of number inputs`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createNumberInput({
            name: "number",
            value: INTEGER
        }));

        const r = FormUtils.parseForm(form, {parseValues: true});
        expect(r).toEqual({number: INTEGER});
    });

    test(`parseForm(form) should return values of password inputs`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createPasswordInput({
            name: "password",
            value: STRING
        }));

        const r = FormUtils.parseForm(form, {parseValues: true});
        expect(r).toEqual({password: STRING});
    });

    test(`parseForm(form) should not parse values of password inputs`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createPasswordInput({
            name: "password",
            value: " 0123 "
        }));

        const r = FormUtils.parseForm(form, {parseValues: true});
        expect(r).toEqual({password: " 0123 "});
    });

    test(`parseForm(form) should return values of single select lists`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createSelect({
            name: "select",
            options: [
                {value: "A"},
                {value: "B", selected: true}
            ]
        }));

        const r = FormUtils.parseForm(form, {parseValues: true});
        expect(r).toEqual({select: "B"});
    });

    test(`parseForm(form) should return values of multiple select lists`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createSelect({
            multiple: true,
            name: "select",
            options: [
                {value: "A"},
                {value: "B", selected: true},
                {value: "C", selected: true}
            ]
        }));

        const r = FormUtils.parseForm(form, {parseValues: true});
        expect(r).toEqual({select: ["B", "C"]});
    });

    test(`parseForm(form) should return values of text inputs`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
            name: "text",
            value: STRING
        }));

        const r = FormUtils.parseForm(form, {parseValues: true});
        expect(r).toEqual({text: STRING});
    });

    test(`parseForm(form) should return values of textareas`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextarea({
            name: "textarea",
            value: STRING
        }));

        const r = FormUtils.parseForm(form, {parseValues: true});
        expect(r).toEqual({textarea: STRING});
    });

    test(`parseForm(form) should not return values of unknown fields`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
            value: STRING
        }));

        const r = FormUtils.parseForm(form, {parseValues: true});
        expect(r).toEqual({});
    });

    test(`parseForm(form, {ignoreButtons: true}) should not return values of buttons`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createButton({
            name: "button",
            type: "button",
            value: "button"
        }));
        form.appendChild(TestUtils.createButton({
            name: "reset",
            type: "reset",
            value: "reset"
        }));
        form.appendChild(TestUtils.createButton({
            name: "submit",
            type: "submit",
            value: "submit"
        }));

        const r = FormUtils.parseForm(form, {ignoreButtons: true});
        expect(r).toEqual({});
    });

    test(`parseForm(form, {ignoreButtons: false}) should return values of buttons`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createButton({
            name: "button",
            type: "button",
            value: "button"
        }));
        form.appendChild(TestUtils.createButton({
            name: "reset",
            type: "reset",
            value: "reset"
        }));
        form.appendChild(TestUtils.createButton({
            name: "submit",
            type: "submit",
            value: "submit"
        }));

        const r = FormUtils.parseForm(form, {ignoreButtons: false});
        expect(r).toEqual({
            button: "button",
            reset: "reset",
            submit: "submit"
        });
    });

    test(`parseForm(form, {ignoreDisabled: true}) should not return disabled fields`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
            disabled: true,
            name: "disabled",
            value: STRING
        }));

        const r = FormUtils.parseForm(form, {ignoreDisabled: true});
        expect(r).toEqual({});
    });

    test(`parseForm(form, {ignoreDisabled: false}) should return disabled fields`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
            disabled: true,
            name: "disabled",
            value: STRING
        }));

        const r = FormUtils.parseForm(form, {ignoreDisabled: false});
        expect(r).toEqual({disabled: STRING});
    });

    test(`parseForm(form, {ignoreEmpty: true}) should not return empty fields`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
            name: "empty",
            value: ""
        }));

        const r = FormUtils.parseForm(form, {ignoreEmpty: true});
        expect(r).toEqual({});
    });

    test(`parseForm(form, {ignoreEmpty: false}) should return empty fields`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
            name: "empty",
            value: ""
        }));

        const r = FormUtils.parseForm(form, {ignoreEmpty: false});
        expect(r).toEqual({empty: null});
    });

    test(`parseForm(form, {ignoreTypes: ['text']}) should not return empty fields`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
            name: "empty",
            value: ""
        }));

        const r = FormUtils.parseForm(form, {ignoreEmpty: true});
        expect(r).toEqual({});
    });

    test(`parseForm(form, {ignoreEmpty: false}) should return empty fields`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
            name: "empty",
            value: ""
        }));

        const r = FormUtils.parseForm(form, {ignoreEmpty: false});
        expect(r).toEqual({empty: null});
    });

    test(`parseForm(form, {ignoreUnchecked: true}) should not return unchecked fields`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createCheckbox({
            checked: false,
            name: "checkbox",
            value: STRING
        }));

        const r = FormUtils.parseForm(form, {ignoreUnchecked: true});
        expect(r).toEqual({});
    });

    test(`parseForm(form, {ignoreUnchecked: false}) should return unchecked fields`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createCheckbox({
            checked: false,
            name: "checkbox",
            value: STRING
        }));

        const r = FormUtils.parseForm(form, {ignoreUnchecked: false});
        expect(r).toEqual({checkbox: null});
    });

    test(`parseForm(form, {parseValues: true}) should parse values`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
            name: "bool_true",
            value: TRUE
        }));
        form.appendChild(TestUtils.createTextInput({
            name: "bool_false",
            value: FALSE
        }));
        form.appendChild(TestUtils.createNumberInput({
            name: "float",
            value: FLOAT_STRING
        }));
        form.appendChild(TestUtils.createNumberInput({
            name: "integer",
            value: INTEGER_STRING
        }));

        const r = FormUtils.parseForm(form, {parseValues: true});
        expect(r).toEqual({
            bool_true: true,
            bool_false: false,
            float: FLOAT,
            integer: INTEGER
        });
    });

    test(`parseForm(form, {parseValues: false}) should not parse values`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
            name: "bool_true",
            value: TRUE
        }));
        form.appendChild(TestUtils.createTextInput({
            name: "bool_false",
            value: FALSE
        }));
        form.appendChild(TestUtils.createNumberInput({
            name: "float",
            value: FLOAT_STRING
        }));
        form.appendChild(TestUtils.createNumberInput({
            name: "integer",
            value: INTEGER_STRING
        }));

        const r = FormUtils.parseForm(form, {parseValues: false});
        expect(r).toEqual({
            bool_true: TRUE,
            bool_false: FALSE,
            float: FLOAT_STRING,
            integer: INTEGER_STRING
        });
    });

    test(`parseForm(form, {smartTyping: true}) should parse values based on field type`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createNumberInput({
            name: "float",
            value: FLOAT_STRING
        }));
        form.appendChild(TestUtils.createTextInput({
            name: "float_text",
            value: FLOAT_STRING
        }));
        form.appendChild(TestUtils.createNumberInput({
            name: "integer",
            value: INTEGER_STRING
        }));
        form.appendChild(TestUtils.createTextInput({
            name: "integer_text",
            value: INTEGER_STRING
        }));

        const r = FormUtils.parseForm(form, {parseValues: true, smartTyping: true});
        expect(r).toEqual({
            float: FLOAT,
            float_text: FLOAT,
            integer: INTEGER,
            integer_text: INTEGER
        });
    });

    test(`parseForm(form, {smartTyping: false}) should not parse values based on field type`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createNumberInput({
            name: "float",
            value: FLOAT_STRING
        }));
        form.appendChild(TestUtils.createTextInput({
            name: "float_text",
            value: FLOAT_STRING
        }));
        form.appendChild(TestUtils.createNumberInput({
            name: "integer",
            value: INTEGER_STRING
        }));
        form.appendChild(TestUtils.createTextInput({
            name: "integer_text",
            value: INTEGER_STRING
        }));

        const r = FormUtils.parseForm(form, {parseValues: true, smartTyping: false});
        expect(r).toEqual({
            float: FLOAT,
            float_text: FLOAT_STRING,
            integer: INTEGER,
            integer_text: INTEGER_STRING
        });
    });

    test(`parseForm(form, {trimValues: true}) should trim text values`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
            name: "text",
            value: ` ${STRING} `
        }));

        const r = FormUtils.parseForm(form, {trimValues: true});
        expect(r).toEqual({text: STRING});
    });

    test(`parseForm(form, {trimValues: false}) should not trim text values`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
            name: "text",
            value: ` ${STRING} `
        }));

        const r = FormUtils.parseForm(form, {trimValues: false});
        expect(r).toEqual({text: ` ${STRING} `});
    });

    test(`parseForm(form, {nullify: true}) should replace empty string with null`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
            name: "text",
            value: " "
        }));

        const r = FormUtils.parseForm(form, {nullify: true, trimValues: true});
        expect(r).toEqual({text: null});
    });

    test(`parseForm(form, {nullify: false}) should not replace empty string with null`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
            name: "text",
            value: " "
        }));

        const r = FormUtils.parseForm(form, {nullify: false, trimValues: true});
        expect(r).toEqual({text: ""});
    });

    test(`parseForm(form, {cleanFunction: Function}) should execute clean function on string values`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
            name: "text",
            value: "<script src='http://hacked.net'></script>"
        }));

        const r = FormUtils.parseForm(form, {
            cleanFunction: function (value) {
                return value.replace(/<\/?[^>]+>/gm, "");
            }
        });
        expect(r).toEqual({text: ""});
    });

    test(`parseForm(form, {cleanFunction: null}) should not execute clean function on string values`, () => {
        const form = TestUtils.createForm();
        form.appendChild(TestUtils.createTextInput({
            name: "text",
            value: "<script src='http://hacked.net'></script>"
        }));

        const r = FormUtils.parseForm(form, {
            cleanFunction: null
        });
        expect(r).toEqual({text: "<script src='http://hacked.net'></script>"});
    });
});

